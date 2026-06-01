// /showroom/globe/hearth/index.js
// HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE_TNT_v2
// Full-file replacement.
// Female JS selector / dynamic alignment / non-blocking runtime release authority.
// Purpose:
// - Correct the prior contradiction where shellAccepted=true but runtime remained held at WAITING_MATCHED_MALE_HTML_SHELL.
// - Accept the matched male HTML shell or the current safe transitional shell when live anchors pass.
// - Use dynamic alignment anchors as the decisive shell acceptance proof.
// - Release runtime from F5 shell-selection into F8 runtime-release when no hard block exists.
// - Preserve shell visibility during downstream runtime failure.
// - Keep Canvas at F13 evidence only.
// - Keep F21 North-only.
// - Never claim final visual pass.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE_TNT_v2";
  const RECEIPT = "HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR_NON_BLOCKING_BOOT_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR_NON_BLOCKING_BOOT_TNT_v1";
  const VERSION = "2026-05-31.hearth-east-south-pair-dynamic-selector-runtime-release-v2";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/index.js";

  const EXPECTED_HTML_CONTRACT = "HEARTH_HTML_SOUTH_PAIR_MALE_SHELL_FEMALE_SELECTED_RUNTIME_RECEIVER_TNT_v1";
  const CURRENT_SAFE_HTML_CONTRACT = "HEARTH_HTML_NON_BLOCKING_EAST_BOOT_TWO_CYCLE_RUNTIME_SHELL_TNT_v3";

  const CYCLE_ONE_ROUTE = "NORTH_EAST_WEST_SOUTH_NORTH";
  const CYCLE_TWO_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";

  const RUNTIME_FILES = Object.freeze([
    {
      key: "northRuntimeTable",
      label: "North Runtime Table",
      news: "NORTH",
      fibonacci: "F8N",
      file: "/assets/lab/runtime-table.js",
      required: true,
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
      key: "eastBranch",
      label: "East Branch",
      news: "EAST",
      fibonacci: "F8E",
      file: "/assets/lab/runtime-table.east.js",
      required: false,
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
      key: "westAdmissibility",
      label: "West Admissibility",
      news: "WEST",
      fibonacci: "F8W",
      file: "/assets/lab/runtime-table.west.js",
      required: false,
      globals: [
        "LAB_RUNTIME_TABLE_WEST",
        "LAB_CARDINAL_RUNTIME_TABLE_WEST",
        "LAB_GAP_CLASSIFIER_WEST",
        "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
        "RUNTIME_TABLE_WEST",
        "DEXTER_LAB.runtimeTableWest",
        "DEXTER_LAB.cardinalRuntimeTableWest",
        "DEXTER_LAB.gapClassifierWest"
      ]
    },
    {
      key: "southVisibleProof",
      label: "South Visible Proof",
      news: "SOUTH",
      fibonacci: "F8S",
      file: "/assets/lab/runtime-table.south.js",
      required: false,
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
      key: "canvasF13Evidence",
      label: "Canvas F13 Evidence",
      news: "CANVAS",
      fibonacci: "F13",
      file: "/assets/hearth/hearth.canvas.js",
      required: false,
      globals: [
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_AUTHORITY",
        "HEARTH_CANVAS_EVIDENCE",
        "HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT",
        "HEARTH.canvas",
        "HEARTH.canvasAuthority",
        "HEARTH.canvasEvidence",
        "HEARTH.canvasNorth",
        "DEXTER_LAB.hearthCanvasEvidence"
      ]
    },
    {
      key: "routeConductor",
      label: "Route Conductor",
      news: "SOUTH",
      fibonacci: "F13S",
      file: "/showroom/globe/hearth/hearth.js",
      required: false,
      globals: [
        "HEARTH_ROUTE_CONDUCTOR",
        "HearthRouteConductor",
        "HEARTH_SOUTH_ROUTE_CONDUCTOR",
        "HEARTH_SOUTH_VISIBLE_COMPLETION",
        "HEARTH.southRouteConductor",
        "HEARTH.routeConductor",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthSouthRouteConductor"
      ]
    }
  ]);

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

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    disposition: "south-facing-expression-pair",
    pairGenderModel: "female-js-selector-chooses-male-html-shell",
    femaleJsComesFirst: true,
    maleHtmlShellExpected: true,
    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    currentSafeHtmlContract: CURRENT_SAFE_HTML_CONTRACT,

    newsAlignmentActive: true,
    fibonacciSynchronizationActive: true,
    cycleOneRoute: CYCLE_ONE_ROUTE,
    cycleTwoRoute: CYCLE_TWO_ROUTE,

    activeNews: "EAST",
    activeFibonacci: "F1",
    activeStage: "F1_STATIC_SHELL_OBSERVED",
    activeProgress: 8,

    shellDetected: false,
    shellSelected: false,
    shellAccepted: false,
    shellContract: "",
    shellSelectionMode: "UNSELECTED",
    matchedMaleShellAccepted: false,
    safeTransitionalShellAccepted: false,
    dynamicAnchorShellAccepted: false,
    shellHoldReason: "WAITING_SHELL_DETECTION",

    hooksBound: false,
    missingHooks: [],
    shellControlsBound: false,
    cockpitPresent: false,
    mountPresent: false,
    statusNodePresent: false,

    runtimeReleaseRequestable: false,
    runtimeReleaseRequested: false,
    runtimeReleaseAuthorized: false,
    runtimeReleaseStarted: false,
    runtimeReleaseComplete: false,
    runtimeHeld: false,
    runtimeReleaseHeldReason: "WAITING_SHELL_SELECTION",
    currentRuntimeKey: "",
    currentRuntimeFile: "",
    runtimeLoaded: [],
    runtimeHeldFiles: [],
    runtimeErrors: [],

    canvasF13Delegated: true,
    f21NorthOnly: true,
    readyTextAllowed: false,
    downstreamReleaseClaimed: false,

    firstFailedCoordinate: "WAITING_SHELL_SELECTION",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "FEMALE_SELECTOR_READY",

    renderWriteCount: 0,
    receiptWriteCount: 0,
    rescueCount: 0,
    settled: false,
    bootStarted: false,

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
    status: null,
    receiptBox: null,
    receiptText: null,
    copyButton: null,
    receiptToggle: null,
    inspectButton: null,
    collapseButton: null,
    showDiagnosticTab: null,
    stageLabel: null,
    heartbeatText: null,
    latestEvent: null,
    progressFill: null,
    progressPercent: null
  };

  let runtimeQueueStarted = false;
  let renderScheduled = false;
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
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  }

  function clamp(value, min, max) {
    const number = Number(value);
    const normalized = Number.isFinite(number) ? number : min;
    return Math.max(min, Math.min(max, normalized));
  }

  function qs(selector) {
    return doc ? doc.querySelector(selector) : null;
  }

  function qsa(selector) {
    return doc ? Array.from(doc.querySelectorAll(selector)) : [];
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

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const found = readPath(path);
      if (found) return found;
    }
    return null;
  }

  function scriptPresent(file) {
    if (!doc) return null;

    return Array.from(doc.scripts || []).find((script) => {
      const src = script.getAttribute("src") || script.src || "";
      return src.includes(file);
    }) || null;
  }

  function globalPresent(def) {
    return Boolean(firstGlobal(def.globals || []));
  }

  function afterFrame(callback) {
    if (root.requestAnimationFrame) {
      root.requestAnimationFrame(() => root.setTimeout(callback, 32));
    } else {
      root.setTimeout(callback, 64);
    }
  }

  function afterIdle(callback, timeout = 900) {
    afterFrame(() => {
      if ("requestIdleCallback" in root) {
        root.requestIdleCallback(callback, { timeout });
      } else {
        root.setTimeout(callback, 96);
      }
    });
  }

  function refreshRefs() {
    refs.mount = qs("#hearthCanvasMount") || qs("[data-hearth-canvas-mount='true']");
    refs.cockpit = qs("#hearthLoadCockpit") || qs("[data-hearth-load-cockpit='true']");
    refs.status = qs("#hearth-route-status") || qs("[data-hearth-route-status]");
    refs.receiptBox = qs("#hearthReceiptPanel") || qs("[data-hearth-receipt-box]");
    refs.receiptText = qs("[data-hearth-receipt-text]");
    refs.copyButton = qs("[data-hearth-copy-diagnostic]");
    refs.receiptToggle = qs("[data-hearth-toggle-receipt]");
    refs.inspectButton = qs("[data-hearth-inspect-planet]");
    refs.collapseButton = qs("[data-hearth-collapse-cockpit]");
    refs.showDiagnosticTab = qs("[data-hearth-south-show-diagnostic-tab]") || qs("[data-hearth-east-show-diagnostic-tab]");
    refs.stageLabel = qs("[data-hearth-stage-label]");
    refs.heartbeatText = qs("[data-hearth-heartbeat-text]");
    refs.latestEvent = qs("[data-hearth-latest-event]");
    refs.progressFill = qs("[data-hearth-main-progress-fill]");
    refs.progressPercent = qs("[data-hearth-main-progress-percent]");
  }

  function ensureShellRescue(reason = "shell-rescue") {
    if (!doc || !doc.body) return false;

    let changed = false;
    let main = qs("#hearth-main");

    if (!main) {
      main = doc.createElement("main");
      main.id = "hearth-main";
      main.dataset.hearthShellRescuedBy = CONTRACT;
      main.innerHTML = `
        <section class="panel hero" aria-labelledby="page-title">
          <div class="kicker">Mirrorland · Survival Path</div>
          <h1 id="page-title">Hearth is the survival path inside Mirrorland.</h1>
          <h2>Shell restored. Runtime remains non-blocking.</h2>
          <p class="lead">The Hearth shell remains visible while runtime proof is staged downstream.</p>
        </section>
        <section class="core-layout" aria-label="Hearth compact object experience">
          <section id="hearthGlobeStage" class="globe-stage" data-hearth-globe-stage="true">
            <section id="hearthCanvasMount" class="globe-mount" data-hearth-canvas-mount="true"></section>
            <aside id="hearthLoadCockpit" class="hearth-ledger-cockpit" data-hearth-load-cockpit="true" data-cockpit-mode="diagnostic-dock">
              <div class="hearth-ledger-head">
                <div class="hearth-ledger-kicker">Hearth · Runtime Shell</div>
                <h2 class="hearth-ledger-title">HEARTH SHELL RESTORED</h2>
                <div class="hearth-ledger-meta" data-hearth-stage-label>F2 · Shell rescue</div>
                <div class="hearth-ledger-meta" data-hearth-heartbeat-text>shell visible · runtime guarded</div>
                <div class="hearth-ledger-latest" data-hearth-latest-event>latest=SHELL_RESCUE</div>
              </div>
              <div class="hearth-ledger-progress">
                <div class="hearth-ledger-track"><span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:24%"></span></div>
                <div class="hearth-ledger-percent" data-hearth-main-progress-percent>24%</div>
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
      `;
      doc.body.appendChild(main);
      changed = true;
    }

    let mount = qs("#hearthCanvasMount");
    if (!mount) {
      mount = doc.createElement("section");
      mount.id = "hearthCanvasMount";
      mount.className = "globe-mount";
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.hearthShellRescuedBy = CONTRACT;
      main.appendChild(mount);
      changed = true;
    }

    let cockpit = qs("#hearthLoadCockpit");
    if (!cockpit) {
      cockpit = doc.createElement("aside");
      cockpit.id = "hearthLoadCockpit";
      cockpit.className = "hearth-ledger-cockpit";
      cockpit.dataset.hearthLoadCockpit = "true";
      cockpit.dataset.cockpitMode = "diagnostic-dock";
      cockpit.innerHTML = `
        <div class="hearth-ledger-head">
          <div class="hearth-ledger-kicker">Hearth · Runtime Shell</div>
          <h2 class="hearth-ledger-title">HEARTH SHELL READY</h2>
          <div class="hearth-ledger-meta" data-hearth-stage-label>F2 · Hooks active</div>
          <div class="hearth-ledger-meta" data-hearth-heartbeat-text>runtime guarded</div>
          <div class="hearth-ledger-latest" data-hearth-latest-event>latest=COCKPIT_RESTORED</div>
        </div>
        <div class="hearth-ledger-progress">
          <div class="hearth-ledger-track"><span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:24%"></span></div>
          <div class="hearth-ledger-percent" data-hearth-main-progress-percent>24%</div>
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
      mount.appendChild(cockpit);
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
      state.rescueCount += 1;
      state.runtimeHeld = true;
      state.runtimeReleaseHeldReason = reason;
    }

    refreshRefs();
    return changed;
  }

  function detectShell() {
    refreshRefs();

    const html = doc && doc.documentElement ? doc.documentElement : null;
    const dataset = html && html.dataset ? html.dataset : {};
    const shellContract = safeString(dataset.contract || dataset.hearthHtmlContract || "", "");
    const missingHooks = DYNAMIC_ALIGNMENT_ANCHORS.filter((selector) => !qs(selector));

    const matchedMale = shellContract === EXPECTED_HTML_CONTRACT;
    const safeTransitional = shellContract === CURRENT_SAFE_HTML_CONTRACT;
    const dynamicAnchorsPass = missingHooks.length === 0;
    const detected = Boolean(doc && doc.body && qs("#hearth-main"));

    let selectionMode = "UNSELECTED";

    if (matchedMale && dynamicAnchorsPass) {
      selectionMode = "MATCHED_MALE_HTML_PAIR";
    } else if (safeTransitional && dynamicAnchorsPass) {
      selectionMode = "SAFE_TRANSITIONAL_HTML_BRIDGE";
    } else if (dynamicAnchorsPass) {
      selectionMode = "DYNAMIC_ANCHOR_ACCEPTED_SHELL";
    } else if (matchedMale || safeTransitional) {
      selectionMode = "CONTRACT_PRESENT_ANCHORS_MISSING";
    }

    const selected = Boolean((matchedMale || safeTransitional || dynamicAnchorsPass) && detected);
    const accepted = Boolean(selected && dynamicAnchorsPass);

    state.shellDetected = detected;
    state.shellSelected = selected;
    state.shellAccepted = accepted;
    state.shellContract = shellContract;
    state.shellSelectionMode = selectionMode;
    state.matchedMaleShellAccepted = Boolean(matchedMale && accepted);
    state.safeTransitionalShellAccepted = Boolean(safeTransitional && accepted);
    state.dynamicAnchorShellAccepted = Boolean(!matchedMale && !safeTransitional && accepted);
    state.hooksBound = dynamicAnchorsPass;
    state.missingHooks = missingHooks;
    state.cockpitPresent = Boolean(refs.cockpit);
    state.mountPresent = Boolean(refs.mount);
    state.statusNodePresent = Boolean(refs.status);

    if (!detected) {
      state.shellHoldReason = "WAITING_SHELL_DETECTION";
    } else if (!selected) {
      state.shellHoldReason = "WAITING_SHELL_SELECTION";
    } else if (!dynamicAnchorsPass) {
      state.shellHoldReason = "WAITING_DYNAMIC_ALIGNMENT_ANCHORS";
    } else {
      state.shellHoldReason = "NONE";
    }

    return {
      detected,
      selected,
      accepted,
      shellContract,
      matchedMale,
      safeTransitional,
      dynamicAnchorsPass,
      missingHooks,
      selectionMode
    };
  }

  function applyReleaseLaw() {
    const shell = detectShell();

    state.runtimeReleaseRequestable = Boolean(state.shellAccepted && state.hooksBound);

    const hardBlock = !state.shellDetected || !state.shellSelected || !state.hooksBound;
    const authorized = Boolean(state.runtimeReleaseRequestable && !hardBlock);

    state.runtimeReleaseAuthorized = authorized;

    if (authorized) {
      state.runtimeReleaseHeldReason = state.runtimeReleaseStarted
        ? state.runtimeReleaseHeldReason
        : "NO_HARD_BLOCK_RUNTIME_RELEASE_AUTHORIZED";

      if (state.runtimeReleaseHeldReason === "WAITING_MATCHED_MALE_HTML_SHELL") {
        state.runtimeReleaseHeldReason = "NO_HARD_BLOCK_RUNTIME_RELEASE_AUTHORIZED";
      }

      state.firstFailedCoordinate = state.runtimeReleaseStarted ? state.firstFailedCoordinate : "WAITING_RUNTIME_RELEASE_START";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.postgameStatus = state.runtimeReleaseStarted
        ? state.postgameStatus
        : "MATCHED_OR_DYNAMIC_SHELL_ACCEPTED_RUNTIME_RELEASE_AUTHORIZED";
    } else {
      state.runtimeReleaseHeldReason = !state.shellDetected
        ? "WAITING_SHELL_DETECTION"
        : !state.shellSelected
          ? "WAITING_SHELL_SELECTION"
          : !state.hooksBound
            ? "WAITING_DYNAMIC_ALIGNMENT_ANCHORS"
            : "WAITING_RUNTIME_RELEASE_AUTHORIZATION";

      state.firstFailedCoordinate = state.runtimeReleaseHeldReason;
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.postgameStatus = state.runtimeReleaseHeldReason;
    }

    if (state.shellAccepted) {
      state.activeNews = "EAST";
      state.activeFibonacci = authorized ? "F8" : "F5";
      state.activeStage = authorized
        ? "F8_RUNTIME_RELEASE_AUTHORIZED"
        : "F5_MATCHED_MALE_HTML_SELECTED";
      state.activeProgress = authorized ? 42 : 34;
    } else if (shell.dynamicAnchorsPass) {
      state.activeNews = "EAST";
      state.activeFibonacci = "F2";
      state.activeStage = "F2_DYNAMIC_ANCHORS_PRESENT";
      state.activeProgress = 24;
    } else {
      state.activeNews = "EAST";
      state.activeFibonacci = "F1";
      state.activeStage = "F1_STATIC_SHELL_OBSERVED";
      state.activeProgress = 12;
    }

    return authorized;
  }

  function updateVisualShell(message = "") {
    refreshRefs();

    if (refs.stageLabel) {
      refs.stageLabel.textContent = `${state.activeFibonacci} · ${state.activeStage}`;
    }

    if (refs.heartbeatText) {
      refs.heartbeatText.textContent = message || `shell=${state.shellAccepted} · release=${state.runtimeReleaseAuthorized} · canvasF13=delegated · f21=north-only`;
    }

    if (refs.latestEvent) {
      refs.latestEvent.textContent = `latest=${state.postgameStatus || state.activeStage}`;
    }

    if (refs.progressFill) {
      refs.progressFill.style.width = `${clamp(state.activeProgress, 0, 100)}%`;
    }

    if (refs.progressPercent) {
      refs.progressPercent.textContent = `${Math.round(clamp(state.activeProgress, 0, 100))}%`;
    }

    if (refs.mount) {
      refs.mount.dataset.hearthFemaleSelectorActive = "true";
      refs.mount.dataset.hearthFemaleSelectorContract = CONTRACT;
      refs.mount.dataset.hearthShellAccepted = String(state.shellAccepted);
      refs.mount.dataset.hearthRuntimeReleaseAuthorized = String(state.runtimeReleaseAuthorized);
      refs.mount.dataset.hearthCanvasF13Delegated = "true";
      refs.mount.dataset.hearthF21NorthOnly = "true";
      refs.mount.dataset.generatedImage = "false";
      refs.mount.dataset.graphicBox = "false";
      refs.mount.dataset.webgl = "false";
      refs.mount.dataset.visualPassClaimed = "false";
    }

    if (refs.cockpit) {
      refs.cockpit.dataset.hearthFemaleSelectorActive = "true";
      refs.cockpit.dataset.hearthFemaleSelectorContract = CONTRACT;
      refs.cockpit.dataset.hearthShellAccepted = String(state.shellAccepted);
      refs.cockpit.dataset.hearthRuntimeReleaseAuthorized = String(state.runtimeReleaseAuthorized);
      refs.cockpit.dataset.generatedImage = "false";
      refs.cockpit.dataset.graphicBox = "false";
      refs.cockpit.dataset.webgl = "false";
      refs.cockpit.dataset.visualPassClaimed = "false";
    }

    state.renderWriteCount += 1;
  }

  function bindShellControls() {
    refreshRefs();

    if (refs.copyButton && refs.copyButton.dataset.hearthFemaleSelectorBound !== "true") {
      refs.copyButton.dataset.hearthFemaleSelectorBound = "true";
      refs.copyButton.addEventListener("click", () => {
        copyDiagnostic();
      });
    }

    if (refs.receiptToggle && refs.receiptToggle.dataset.hearthFemaleSelectorBound !== "true") {
      refs.receiptToggle.dataset.hearthFemaleSelectorBound = "true";
      refs.receiptToggle.addEventListener("click", () => {
        refreshRefs();

        if (!refs.receiptBox) return;

        const visible = refs.receiptBox.dataset.visible !== "true";
        refs.receiptBox.dataset.visible = String(visible);

        if (refs.receiptToggle) {
          refs.receiptToggle.textContent = visible ? "Hide receipt" : "Show receipt";
        }

        if (refs.receiptText) {
          refs.receiptText.textContent = getReceiptText();
        }
      });
    }

    if (refs.inspectButton && refs.inspectButton.dataset.hearthFemaleSelectorBound !== "true") {
      refs.inspectButton.dataset.hearthFemaleSelectorBound = "true";
      refs.inspectButton.addEventListener("click", () => {
        refreshRefs();

        const html = doc && doc.documentElement ? doc.documentElement : null;
        const active = html && html.dataset.hearthSouthPlanetInspect !== "true";

        if (html) {
          html.dataset.hearthSouthPlanetInspect = String(active);
          html.dataset.hearthEastInspectReservedActive = String(active);
        }

        if (refs.cockpit) {
          refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "diagnostic-dock";
        }

        if (refs.showDiagnosticTab) {
          refs.showDiagnosticTab.hidden = !active;
          refs.showDiagnosticTab.dataset.visible = String(active);
        }

        if (refs.inspectButton) {
          refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";
        }

        state.postgameStatus = active ? "SHELL_INSPECT_PLACEHOLDER_ACTIVE" : "SHELL_DIAGNOSTIC_RESTORED";
        publishState("inspect-toggle");
      });
    }

    if (refs.collapseButton && refs.collapseButton.dataset.hearthFemaleSelectorBound !== "true") {
      refs.collapseButton.dataset.hearthFemaleSelectorBound = "true";
      refs.collapseButton.addEventListener("click", () => {
        refreshRefs();

        if (!refs.cockpit) return;

        const expanded = refs.cockpit.dataset.cockpitMode !== "expanded-cockpit";
        refs.cockpit.dataset.cockpitMode = expanded ? "expanded-cockpit" : "diagnostic-dock";
        refs.collapseButton.textContent = expanded ? "Collapse cockpit" : "Expand cockpit";
      });
    }

    if (refs.showDiagnosticTab && refs.showDiagnosticTab.dataset.hearthFemaleSelectorBound !== "true") {
      refs.showDiagnosticTab.dataset.hearthFemaleSelectorBound = "true";
      refs.showDiagnosticTab.addEventListener("click", () => {
        refreshRefs();

        const html = doc && doc.documentElement ? doc.documentElement : null;

        if (html) {
          html.dataset.hearthSouthPlanetInspect = "false";
          html.dataset.hearthEastInspectReservedActive = "false";
        }

        if (refs.cockpit) {
          refs.cockpit.dataset.cockpitMode = "diagnostic-dock";
        }

        refs.showDiagnosticTab.hidden = true;

        if (refs.inspectButton) {
          refs.inspectButton.textContent = "Inspect planet";
        }

        state.postgameStatus = "SHELL_DIAGNOSTIC_RESTORED";
        publishState("show-diagnostic-tab");
      });
    }

    state.shellControlsBound = Boolean(
      refs.copyButton &&
      refs.receiptToggle &&
      refs.inspectButton &&
      refs.collapseButton
    );

    if (state.shellControlsBound && state.shellAccepted && !state.runtimeReleaseStarted) {
      state.activeFibonacci = "F3";
      state.activeStage = "F3_SHELL_CONTROLS_BOUND";
      state.activeProgress = Math.max(state.activeProgress, 30);
    }
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
        file: FILE,
        key: "copyDiagnostic",
        message: error && error.message ? error.message : String(error),
        at: nowIso()
      });
    }

    refreshRefs();

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

  function clearShellWaitingContradiction() {
    if (state.shellAccepted && state.runtimeReleaseHeldReason === "WAITING_MATCHED_MALE_HTML_SHELL") {
      state.runtimeReleaseHeldReason = state.runtimeReleaseAuthorized
        ? "NO_HARD_BLOCK_RUNTIME_RELEASE_AUTHORIZED"
        : "WAITING_RUNTIME_RELEASE_AUTHORIZATION";
    }

    if (state.shellAccepted && state.firstFailedCoordinate === "WAITING_MATCHED_MALE_HTML_SHELL") {
      state.firstFailedCoordinate = state.runtimeReleaseAuthorized
        ? "WAITING_RUNTIME_RELEASE_START"
        : "WAITING_RUNTIME_RELEASE_AUTHORIZATION";
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
        existing.dataset.hearthFemaleSelectorObserved = CONTRACT;

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

      script.src = `${def.file}${separator}v=${encodeURIComponent(CONTRACT)}`;
      script.async = false;
      script.defer = true;
      script.dataset.loadedBy = CONTRACT;
      script.dataset.hearthFemaleSelectorRuntimeRelease = "true";
      script.dataset.hearthRuntimeKey = def.key;
      script.dataset.hearthRuntimeNews = def.news;
      script.dataset.hearthRuntimeFibonacci = def.fibonacci;
      script.dataset.canvasF13Delegated = "true";
      script.dataset.f21NorthOnly = "true";
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      let settled = false;

      const finish = (result) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };

      script.onload = () => {
        if (!state.runtimeLoaded.includes(def.file)) state.runtimeLoaded.push(def.file);

        afterFrame(() => {
          ensureShellRescue(`SHELL_GUARD_AFTER_${def.key.toUpperCase()}`);
          bindShellControls();
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
      }, def.required ? 4200 : 3600);
    });
  }

  async function releaseRuntimeQueue() {
    if (runtimeQueueStarted || state.runtimeReleaseStarted) return;
    if (!applyReleaseLaw()) return;

    runtimeQueueStarted = true;
    state.runtimeReleaseRequested = true;
    state.runtimeReleaseStarted = true;
    state.runtimeReleaseComplete = false;
    state.runtimeHeld = false;
    state.runtimeReleaseHeldReason = "RUNTIME_RELEASE_STARTED";
    state.activeNews = "EAST";
    state.activeFibonacci = "F8";
    state.activeStage = "F8_RUNTIME_RELEASE_STARTED";
    state.activeProgress = 46;
    state.postgameStatus = "RUNTIME_RELEASE_STARTED";
    state.firstFailedCoordinate = "RUNTIME_RELEASE_IN_PROGRESS";
    publishState("runtime-release-started");

    for (let i = 0; i < RUNTIME_FILES.length; i += 1) {
      const def = RUNTIME_FILES[i];

      state.currentRuntimeKey = def.key;
      state.currentRuntimeFile = def.file;
      state.activeNews = def.news;
      state.activeFibonacci = def.fibonacci;
      state.activeStage = `${def.fibonacci}_${def.key}`;
      state.activeProgress = clamp(48 + (i * 7), 48, 88);
      state.postgameStatus = `LOADING_${def.key.toUpperCase()}`;
      publishState(`loading-${def.key}`);

      await new Promise((resolve) => {
        afterIdle(resolve, 1200);
      });

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

        publishState(`runtime-file-held-${def.key}`);

        if (def.required) break;
      } else {
        if (!state.runtimeLoaded.includes(def.file)) state.runtimeLoaded.push(def.file);

        state.runtimeReleaseHeldReason = "NO_HARD_BLOCK_RUNTIME_RELEASE_AUTHORIZED";
        state.firstFailedCoordinate = "RUNTIME_RELEASE_IN_PROGRESS";
        state.postgameStatus = `LOADED_${def.key.toUpperCase()}`;

        ensureShellRescue(`SHELL_GUARD_LOADED_${def.key.toUpperCase()}`);
        bindShellControls();
        publishState(`runtime-file-loaded-${def.key}`);
      }

      await new Promise((resolve) => root.setTimeout(resolve, 90));
    }

    ensureShellRescue("SHELL_GUARD_RUNTIME_QUEUE_SETTLED");
    bindShellControls();

    if (state.runtimeErrors.some((item) => item.required === true)) {
      state.runtimeReleaseComplete = false;
      state.runtimeHeld = true;
      state.activeNews = "EAST";
      state.activeFibonacci = "F8";
      state.activeStage = "F8_RUNTIME_RELEASE_HELD";
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
      state.activeStage = "F13_CANVAS_EVIDENCE_DELEGATED";
      state.activeProgress = state.runtimeErrors.length > 0 ? 78 : 86;
      state.firstFailedCoordinate = state.runtimeErrors.length > 0 ? state.firstFailedCoordinate : "WAITING_CANVAS_F13_EVIDENCE";
      state.recommendedNextFile = state.runtimeErrors.length > 0 ? state.recommendedNextFile : "/assets/hearth/hearth.canvas.js";
      state.recommendedNextRenewalTarget = state.recommendedNextFile;
      state.postgameStatus = state.runtimeErrors.length > 0
        ? "RUNTIME_RELEASE_COMPLETE_WITH_OPTIONAL_HOLDS"
        : "RUNTIME_RELEASE_COMPLETE_CANVAS_F13_DELEGATED";
    }

    state.settled = true;
    publishState("runtime-release-settled");
  }

  function publishDatasets() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthFemaleSelectorLoaded = "true";
    dataset.hearthFemaleSelectorContract = CONTRACT;
    dataset.hearthFemaleSelectorReceipt = RECEIPT;
    dataset.hearthFemaleSelectorVersion = VERSION;

    dataset.hearthPairDisposition = state.disposition;
    dataset.hearthPairGenderModel = state.pairGenderModel;
    dataset.hearthFemaleJsComesFirst = "true";
    dataset.hearthMaleHtmlShellExpected = "true";
    dataset.hearthExpectedHtmlContract = EXPECTED_HTML_CONTRACT;
    dataset.hearthCurrentSafeHtmlContract = CURRENT_SAFE_HTML_CONTRACT;

    dataset.hearthNewsAlignmentActive = "true";
    dataset.hearthFibonacciSynchronizationActive = "true";
    dataset.hearthCycleOneRoute = CYCLE_ONE_ROUTE;
    dataset.hearthCycleTwoRoute = CYCLE_TWO_ROUTE;

    dataset.hearthActiveNews = state.activeNews;
    dataset.hearthActiveFibonacci = state.activeFibonacci;
    dataset.hearthActiveStage = state.activeStage;
    dataset.hearthActiveProgress = String(state.activeProgress);

    dataset.hearthShellDetected = String(state.shellDetected);
    dataset.hearthShellSelected = String(state.shellSelected);
    dataset.hearthShellAccepted = String(state.shellAccepted);
    dataset.hearthShellContract = state.shellContract;
    dataset.hearthShellSelectionMode = state.shellSelectionMode;
    dataset.hearthMatchedMaleShellAccepted = String(state.matchedMaleShellAccepted);
    dataset.hearthSafeTransitionalShellAccepted = String(state.safeTransitionalShellAccepted);
    dataset.hearthDynamicAnchorShellAccepted = String(state.dynamicAnchorShellAccepted);
    dataset.hearthShellHoldReason = state.shellHoldReason;

    dataset.hearthHooksBound = String(state.hooksBound);
    dataset.hearthMissingHooks = state.missingHooks.join(",");
    dataset.hearthShellControlsBound = String(state.shellControlsBound);
    dataset.hearthCockpitPresent = String(state.cockpitPresent);
    dataset.hearthMountPresent = String(state.mountPresent);
    dataset.hearthStatusNodePresent = String(state.statusNodePresent);

    dataset.hearthRuntimeReleaseRequestable = String(state.runtimeReleaseRequestable);
    dataset.hearthRuntimeReleaseRequested = String(state.runtimeReleaseRequested);
    dataset.hearthRuntimeReleaseAuthorized = String(state.runtimeReleaseAuthorized);
    dataset.hearthRuntimeReleaseStarted = String(state.runtimeReleaseStarted);
    dataset.hearthRuntimeReleaseComplete = String(state.runtimeReleaseComplete);
    dataset.hearthRuntimeHeld = String(state.runtimeHeld);
    dataset.hearthRuntimeReleaseHeldReason = state.runtimeReleaseHeldReason;
    dataset.hearthCurrentRuntimeKey = state.currentRuntimeKey;
    dataset.hearthCurrentRuntimeFile = state.currentRuntimeFile;
    dataset.hearthRuntimeLoaded = state.runtimeLoaded.join(",");
    dataset.hearthRuntimeHeldFiles = state.runtimeHeldFiles.join(",");

    dataset.hearthCanvasF13Delegated = "true";
    dataset.hearthF21NorthOnly = "true";
    dataset.hearthReadyTextAllowed = "false";
    dataset.hearthDownstreamReleaseClaimed = "false";

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

    root.HEARTH.eastSouthPairFemaleSelector = api;
    root.HEARTH.dynamicSelectorRuntimeRelease = api;
    root.HEARTH.indexBridge = api;
    root.HEARTH.indexJs = api;

    root.DEXTER_LAB.hearthEastSouthPairFemaleSelector = api;
    root.DEXTER_LAB.hearthDynamicSelectorRuntimeRelease = api;

    root.HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR = api;
    root.HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE = api;
    root.HEARTH_INDEX_JS = api;
    root.HEARTH_INDEX_BRIDGE = api;

    root.HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR_RECEIPT = getReceipt();
    root.HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE_RECEIPT = getReceipt();
    root.HEARTH_INDEX_JS_RECEIPT = getReceipt();
  }

  function publishState(message = "") {
    state.updatedAt = nowIso();

    clearShellWaitingContradiction();
    publishDatasets();
    publishGlobals();
    updateVisualShell(message);

    refreshRefs();

    if (refs.status) {
      refs.status.textContent = getReceiptText();
    }

    if (refs.receiptBox && refs.receiptText && refs.receiptBox.dataset.visible === "true") {
      refs.receiptText.textContent = getReceiptText();
    }

    state.receiptWriteCount += 1;
  }

  function schedulePublish(message = "") {
    if (renderScheduled) return;

    renderScheduled = true;

    root.setTimeout(() => {
      renderScheduled = false;
      publishState(message);
    }, 80);
  }

  function getReceipt() {
    clearShellWaitingContradiction();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,

      disposition: state.disposition,
      pairGenderModel: state.pairGenderModel,
      femaleJsComesFirst: state.femaleJsComesFirst,
      maleHtmlShellExpected: state.maleHtmlShellExpected,
      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      currentSafeHtmlContract: CURRENT_SAFE_HTML_CONTRACT,

      newsAlignmentActive: true,
      fibonacciSynchronizationActive: true,
      cycleOneRoute: CYCLE_ONE_ROUTE,
      cycleTwoRoute: CYCLE_TWO_ROUTE,

      activeNews: state.activeNews,
      activeFibonacci: state.activeFibonacci,
      activeStage: state.activeStage,
      activeProgress: state.activeProgress,

      shellDetected: state.shellDetected,
      shellSelected: state.shellSelected,
      shellAccepted: state.shellAccepted,
      shellContract: state.shellContract,
      shellSelectionMode: state.shellSelectionMode,
      matchedMaleShellAccepted: state.matchedMaleShellAccepted,
      safeTransitionalShellAccepted: state.safeTransitionalShellAccepted,
      dynamicAnchorShellAccepted: state.dynamicAnchorShellAccepted,
      shellHoldReason: state.shellHoldReason,

      hooksBound: state.hooksBound,
      missingHooks: state.missingHooks.slice(),
      shellControlsBound: state.shellControlsBound,
      cockpitPresent: state.cockpitPresent,
      mountPresent: state.mountPresent,
      statusNodePresent: state.statusNodePresent,

      runtimeReleaseRequestable: state.runtimeReleaseRequestable,
      runtimeReleaseRequested: state.runtimeReleaseRequested,
      runtimeReleaseAuthorized: state.runtimeReleaseAuthorized,
      runtimeReleaseStarted: state.runtimeReleaseStarted,
      runtimeReleaseComplete: state.runtimeReleaseComplete,
      runtimeHeld: state.runtimeHeld,
      runtimeReleaseHeldReason: state.runtimeReleaseHeldReason,
      currentRuntimeKey: state.currentRuntimeKey,
      currentRuntimeFile: state.currentRuntimeFile,
      runtimeLoaded: state.runtimeLoaded.slice(),
      runtimeHeldFiles: state.runtimeHeldFiles.slice(),
      runtimeErrors: state.runtimeErrors.slice(),

      canvasF13Delegated: true,
      f21NorthOnly: true,
      readyTextAllowed: false,
      downstreamReleaseClaimed: false,

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
        required: item.required
      })),

      renderWriteCount: state.renderWriteCount,
      receiptWriteCount: state.receiptWriteCount,
      rescueCount: state.rescueCount,
      settled: state.settled,
      bootStarted: state.bootStarted,

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

    return [
      "HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `file=${receipt.file}`,
      `route=${receipt.route}`,
      "",
      `disposition=${receipt.disposition}`,
      `pairGenderModel=${receipt.pairGenderModel}`,
      `femaleJsComesFirst=${receipt.femaleJsComesFirst}`,
      `maleHtmlShellExpected=${receipt.maleHtmlShellExpected}`,
      `expectedHtmlContract=${receipt.expectedHtmlContract}`,
      `currentSafeHtmlContract=${receipt.currentSafeHtmlContract}`,
      "",
      `newsAlignmentActive=${receipt.newsAlignmentActive}`,
      `fibonacciSynchronizationActive=${receipt.fibonacciSynchronizationActive}`,
      `cycleOneRoute=${receipt.cycleOneRoute}`,
      `cycleTwoRoute=${receipt.cycleTwoRoute}`,
      "",
      `activeNews=${receipt.activeNews}`,
      `activeFibonacci=${receipt.activeFibonacci}`,
      `activeStage=${receipt.activeStage}`,
      `activeProgress=${receipt.activeProgress}`,
      "",
      `shellDetected=${receipt.shellDetected}`,
      `shellSelected=${receipt.shellSelected}`,
      `shellAccepted=${receipt.shellAccepted}`,
      `shellContract=${receipt.shellContract}`,
      `shellSelectionMode=${receipt.shellSelectionMode}`,
      `matchedMaleShellAccepted=${receipt.matchedMaleShellAccepted}`,
      `safeTransitionalShellAccepted=${receipt.safeTransitionalShellAccepted}`,
      `dynamicAnchorShellAccepted=${receipt.dynamicAnchorShellAccepted}`,
      `shellHoldReason=${receipt.shellHoldReason}`,
      "",
      `hooksBound=${receipt.hooksBound}`,
      `missingHooks=${receipt.missingHooks.join(",")}`,
      `shellControlsBound=${receipt.shellControlsBound}`,
      `cockpitPresent=${receipt.cockpitPresent}`,
      `mountPresent=${receipt.mountPresent}`,
      `statusNodePresent=${receipt.statusNodePresent}`,
      "",
      `runtimeReleaseRequestable=${receipt.runtimeReleaseRequestable}`,
      `runtimeReleaseRequested=${receipt.runtimeReleaseRequested}`,
      `runtimeReleaseAuthorized=${receipt.runtimeReleaseAuthorized}`,
      `runtimeReleaseStarted=${receipt.runtimeReleaseStarted}`,
      `runtimeReleaseComplete=${receipt.runtimeReleaseComplete}`,
      `runtimeHeld=${receipt.runtimeHeld}`,
      `runtimeReleaseHeldReason=${receipt.runtimeReleaseHeldReason}`,
      `currentRuntimeKey=${receipt.currentRuntimeKey}`,
      `currentRuntimeFile=${receipt.currentRuntimeFile}`,
      `runtimeLoaded=${receipt.runtimeLoaded.join(",")}`,
      `runtimeHeld=${receipt.runtimeHeldFiles.join(",")}`,
      `runtimeErrors=${receipt.runtimeErrors.map((error) => `${error.key || ""}:${error.file || ""}:${error.message || ""}`).join(" | ")}`,
      "",
      `canvasF13Delegated=${receipt.canvasF13Delegated}`,
      `f21NorthOnly=${receipt.f21NorthOnly}`,
      `readyTextAllowed=${receipt.readyTextAllowed}`,
      `downstreamReleaseClaimed=${receipt.downstreamReleaseClaimed}`,
      "",
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextFile=${receipt.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      `postgameStatus=${receipt.postgameStatus}`,
      "",
      "DYNAMIC_ALIGNMENT_ANCHORS",
      receipt.dynamicAlignmentAnchors.map((anchor) => `- ${anchor}`).join("\n"),
      "",
      "RUNTIME_FILES",
      receipt.runtimeFiles.map((file) => (
        `- ${file.key}: news=${file.news}; fibonacci=${file.fibonacci}; required=${file.required}; file=${file.file}`
      )).join("\n"),
      "",
      `renderWriteCount=${receipt.renderWriteCount}`,
      `receiptWriteCount=${receipt.receiptWriteCount}`,
      `rescueCount=${receipt.rescueCount}`,
      `settled=${receipt.settled}`,
      `bootStarted=${receipt.bootStarted}`,
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

  function startShellGuard() {
    if (shellGuardTimer) root.clearInterval(shellGuardTimer);

    let ticks = 0;

    shellGuardTimer = root.setInterval(() => {
      ticks += 1;

      ensureShellRescue("SHELL_GUARD_INTERVAL");
      detectShell();
      bindShellControls();
      applyReleaseLaw();
      schedulePublish("shell-guard");

      if (state.settled || ticks >= 24) {
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

    ensureShellRescue("BOOT_SHELL_GUARD");
    detectShell();
    bindShellControls();

    state.activeNews = "EAST";
    state.activeFibonacci = "F2";
    state.activeStage = "F2_DYNAMIC_ALIGNMENT_ANCHORS_AUDITED";
    state.activeProgress = 24;

    const authorized = applyReleaseLaw();

    if (state.shellAccepted) {
      state.activeFibonacci = authorized ? "F8" : "F5";
      state.activeStage = authorized ? "F8_RUNTIME_RELEASE_AUTHORIZED" : "F5_SHELL_SELECTED_RUNTIME_PENDING";
      state.activeProgress = authorized ? 42 : 34;
    }

    publishState("boot");

    startShellGuard();

    if (authorized) {
      afterIdle(() => {
        releaseRuntimeQueue();
      }, 1200);
    }

    return getReceipt();
  }

  function dispose(reason = "manual-dispose") {
    if (shellGuardTimer) {
      root.clearInterval(shellGuardTimer);
      shellGuardTimer = 0;
    }

    state.settled = true;
    state.postgameStatus = `DISPOSED_${reason}`;
    publishState("dispose");

    return getReceipt();
  }

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

    if (runtimeMatch.required) {
      setRuntimeHold("RUNTIME_REQUIRED_FILE_EXECUTION_ERROR", runtimeMatch.file, runtimeMatch.key);
    } else {
      setRuntimeHold("RUNTIME_OPTIONAL_FILE_EXECUTION_ERROR", runtimeMatch.file, runtimeMatch.key);
    }

    ensureShellRescue("SHELL_GUARD_RUNTIME_ERROR");
    bindShellControls();
    publishState("runtime-error");
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

    ensureShellRescue("SHELL_GUARD_UNHANDLED_REJECTION");
    bindShellControls();
    publishState("runtime-rejection");
  }, true);

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
    CYCLE_ONE_ROUTE,
    CYCLE_TWO_ROUTE,
    DYNAMIC_ALIGNMENT_ANCHORS,
    RUNTIME_FILES,

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    detectShell,
    applyReleaseLaw,
    bindShellControls,
    releaseRuntimeQueue,
    ensureShellRescue,
    publishState,
    getReceipt,
    getReceiptText,
    copyDiagnostic,

    newsAlignmentActive: true,
    fibonacciSynchronizationActive: true,
    canvasF13Delegated: true,
    f21NorthOnly: true,
    readyTextAllowed: false,
    downstreamReleaseClaimed: false,

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
  root.HEARTH.eastSouthPairFemaleSelector = api;
  root.HEARTH.dynamicSelectorRuntimeRelease = api;
  root.HEARTH.indexBridge = api;
  root.HEARTH.indexJs = api;
  root.DEXTER_LAB.hearthEastSouthPairFemaleSelector = api;
  root.HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR = api;
  root.HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE = api;
  root.HEARTH_INDEX_JS = api;

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
