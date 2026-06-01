// /showroom/globe/hearth/index.js
// HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR_NON_BLOCKING_BOOT_TNT_v1
// Full-file replacement.
// Female JS selector / chooser / binder comes first in the South-facing pair.
// Purpose:
// - Stop the flash-to-white-screen failure by preventing forced downstream runtime boot against an unmatched shell.
// - Treat JS as the selector/binder that carries the expected HTML shell contract inside itself.
// - Bind safe shell controls only.
// - Hold heavy runtime release until the paired HTML shell explicitly confirms readiness.
// - Preserve NEWS alignment and Fibonacci synchronization.
// - Preserve existing file status, not future North timetable rewrites.
// - Preserve F13 Canvas delegation and F21 North-only latch.
// Does not own:
// - HTML public shell structure
// - North Runtime Table truth
// - West admissibility truth
// - South route-conductor runtime truth
// - Canvas drawing truth
// - planet material truth
// - final visual pass claim
// - F21 completion latch

(() => {
  "use strict";

  const CONTRACT = "HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR_NON_BLOCKING_BOOT_TNT_v1";
  const RECEIPT = "HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR_NON_BLOCKING_BOOT_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_EAST_ROUTE_CONDUCTOR_REQUEST_HYDRATION_ADMISSION_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_EAST_ROUTE_CONDUCTOR_REQUEST_HYDRATION_ADMISSION_TNT_v1";
  const VERSION = "2026-05-31.hearth-east-south-pair-female-selector-non-blocking-boot-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FILE = "/showroom/globe/hearth/index.js";
  const ROUTE = "/showroom/globe/hearth/";

  const EXPECTED_HTML_CONTRACT = "HEARTH_HTML_SOUTH_PAIR_MALE_SHELL_FEMALE_SELECTED_RUNTIME_RECEIVER_TNT_v1";
  const CURRENT_SAFE_HTML_CONTRACT = "HEARTH_HTML_NON_BLOCKING_EAST_BOOT_TWO_CYCLE_RUNTIME_SHELL_TNT_v3";

  const FILES = Object.freeze({
    north: "/assets/lab/runtime-table.js",
    east: "/assets/lab/runtime-table.east.js",
    south: "/assets/lab/runtime-table.south.js",
    west: "/assets/lab/runtime-table.west.js",
    canvas: "/assets/hearth/hearth.canvas.js",
    routeConductor: "/showroom/globe/hearth/hearth.js"
  });

  const SOURCE_STACK = Object.freeze([
    "/assets/hearth/hearth.tectonics.js",
    "/assets/hearth/hearth.elevation.js",
    "/assets/hearth/hearth.composition.js",
    "/assets/hearth/hearth.hydrology.js",
    "/assets/hearth/hearth.materials.js",
    "/assets/hearth/hearth.hex.four-pair.authority.js",
    "/assets/hearth/hearth.hex.surface.js"
  ]);

  const RUNTIME_QUEUE = Object.freeze([
    { key: "north", file: FILES.north, news: "NORTH", fibonacci: "F8N", required: true },
    { key: "east", file: FILES.east, news: "EAST", fibonacci: "F8E", required: false },
    { key: "south", file: FILES.south, news: "SOUTH", fibonacci: "F13S", required: false },
    { key: "west", file: FILES.west, news: "WEST", fibonacci: "F13W", required: false },
    ...SOURCE_STACK.map((file, index) => ({
      key: `source_${index + 1}`,
      file,
      news: "SOUTH",
      fibonacci: "F13M",
      required: false
    })),
    { key: "canvas", file: FILES.canvas, news: "CANVAS", fibonacci: "F13C", required: false },
    { key: "routeConductor", file: FILES.routeConductor, news: "SOUTH", fibonacci: "F13R", required: false }
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
    cycleOneRoute: "NORTH_EAST_WEST_SOUTH_NORTH",
    cycleTwoRoute: "NORTH_EAST_SOUTH_WEST_CANVAS",

    activeNews: "EAST",
    activeFibonacci: "F1",
    activeStage: "F1_FEMALE_SELECTOR_ALIVE",
    activeProgress: 8,

    shellSelected: false,
    shellAccepted: false,
    shellContract: "",
    shellMode: "UNSELECTED",
    shellHoldReason: "WAITING_SELECTION",

    hooksBound: false,
    shellControlsBound: false,
    cockpitPresent: false,
    mountPresent: false,
    statusNodePresent: false,

    runtimeReleaseRequested: false,
    runtimeReleaseAuthorized: false,
    runtimeReleaseStarted: false,
    runtimeReleaseComplete: false,
    runtimeReleaseHeldReason: "WAITING_MATCHED_MALE_HTML_SHELL",

    currentRuntimeKey: "",
    currentRuntimeFile: "",
    runtimeLoaded: [],
    runtimeHeld: [],
    runtimeErrors: [],

    canvasF13Delegated: true,
    f21NorthOnly: true,
    readyTextAllowed: false,
    downstreamReleaseClaimed: false,

    firstFailedCoordinate: "WAITING_MATCHED_MALE_HTML_SHELL",
    recommendedNextFile: "/showroom/globe/hearth/index.html",
    recommendedNextRenewalTarget: "/showroom/globe/hearth/index.html",
    postgameStatus: "FEMALE_JS_READY_WAITING_MATCHED_MALE_HTML_SHELL",

    events: [],
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
    status: null,
    title: null,
    stage: null,
    heartbeat: null,
    latest: null,
    progressFill: null,
    progressPercent: null,
    receiptBox: null,
    receiptText: null,
    copyButton: null,
    receiptButton: null,
    inspectButton: null,
    collapseButton: null,
    showTab: null
  };

  let booted = false;
  let runtimeRunning = false;

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

  function clamp(value, min, max) {
    const n = Number(value);
    const safe = Number.isFinite(n) ? n : min;
    return Math.max(min, Math.min(max, safe));
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function q(selector) {
    return doc ? doc.querySelector(selector) : null;
  }

  function qa(selector) {
    return doc ? Array.from(doc.querySelectorAll(selector)) : [];
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.events.push(item);
    if (state.events.length > 120) {
      state.events.splice(0, state.events.length - 120);
    }

    state.updatedAt = item.at;
    publish();

    return item;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      message: safeString(message),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    if (state.errors.length > 60) {
      state.errors.splice(0, state.errors.length - 60);
    }

    state.updatedAt = item.at;
    publish();

    return item;
  }

  function setStage(fibonacci, news, stage, progress, message = "") {
    state.activeFibonacci = fibonacci;
    state.activeNews = news;
    state.activeStage = stage;
    state.activeProgress = clamp(progress, 0, 100);
    state.updatedAt = nowIso();

    if (refs.stage) refs.stage.textContent = `${fibonacci} · ${stage}`;
    if (refs.heartbeat) refs.heartbeat.textContent = message || `news=${news} · fibonacci=${fibonacci}`;
    if (refs.latest) refs.latest.textContent = `latest=${stage}`;
    if (refs.progressFill) refs.progressFill.style.width = `${state.activeProgress}%`;
    if (refs.progressPercent) refs.progressPercent.textContent = `${Math.round(state.activeProgress)}%`;

    publish();
  }

  function ensureStatusNode() {
    if (!doc) return null;

    let node = doc.getElementById("hearth-route-status") || q("[data-hearth-route-status]");

    if (!node) {
      node = doc.createElement("pre");
      node.id = "hearth-route-status";
      node.hidden = true;
      node.dataset.hearthRouteStatus = "true";
      (doc.getElementById("hearth-main") || doc.body || doc.documentElement).appendChild(node);
    }

    refs.status = node;
    state.statusNodePresent = true;
    return node;
  }

  function ensureMount() {
    if (!doc) return null;

    let mount =
      doc.getElementById("hearthCanvasMount") ||
      q("[data-hearth-canvas-mount='true']") ||
      q("[data-hearth-canvas-mount]");

    if (!mount) {
      mount = doc.createElement("section");
      mount.id = "hearthCanvasMount";
      mount.className = "globe-mount";
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.createdByFemaleJsSelector = CONTRACT;

      const stage = doc.getElementById("hearthGlobeStage") || q("[data-hearth-globe-stage]") || doc.getElementById("hearth-main") || doc.body || doc.documentElement;
      stage.appendChild(mount);
    }

    mount.id = "hearthCanvasMount";
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthFemaleJsSelected = CONTRACT;
    mount.dataset.hearthFemaleJsComesFirst = "true";
    mount.dataset.hearthCanvasF13Delegated = "true";
    mount.dataset.hearthF21NorthOnly = "true";
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.webgl = "false";
    mount.dataset.visualPassClaimed = "false";

    refs.mount = mount;
    state.mountPresent = true;

    return mount;
  }

  function ensureCockpit() {
    if (!doc) return null;

    const mount = ensureMount();

    let cockpit =
      doc.getElementById("hearthLoadCockpit") ||
      q("[data-hearth-load-cockpit='true']") ||
      q("[data-hearth-load-cockpit]");

    if (!cockpit) {
      cockpit = doc.createElement("aside");
      cockpit.id = "hearthLoadCockpit";
      cockpit.className = "hearth-ledger-cockpit";
      cockpit.dataset.hearthLoadCockpit = "true";
      cockpit.dataset.cockpitMode = "diagnostic-dock";
      cockpit.setAttribute("aria-live", "polite");

      cockpit.innerHTML = [
        '<div class="hearth-ledger-head">',
        '<div class="hearth-ledger-kicker">Hearth · Female JS Selector</div>',
        '<h2 class="hearth-ledger-title">HEARTH SELECTOR READY</h2>',
        '<div class="hearth-ledger-meta" data-hearth-stage-label>F1 · selector alive</div>',
        '<div class="hearth-ledger-meta" data-hearth-heartbeat-text>waiting for matched HTML shell</div>',
        '<div class="hearth-ledger-latest" data-hearth-latest-event>latest=FEMALE_SELECTOR_READY</div>',
        '</div>',
        '<div class="hearth-ledger-progress" data-hearth-index-progress-strip="true">',
        '<div class="hearth-ledger-track"><span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:8%"></span></div>',
        '<div class="hearth-ledger-percent" data-hearth-main-progress-percent>8%</div>',
        '</div>',
        '<div class="hearth-ledger-actions">',
        '<button class="hearth-ledger-button primary" type="button" data-hearth-copy-diagnostic>Copy diagnostic</button>',
        '<button class="hearth-ledger-button" type="button" data-hearth-toggle-receipt>Show receipt</button>',
        '<button class="hearth-ledger-button" type="button" data-hearth-inspect-planet>Inspect planet</button>',
        '<button class="hearth-ledger-button" type="button" data-hearth-collapse-cockpit>Collapse cockpit</button>',
        '</div>',
        '<div class="hearth-ledger-scroll">',
        '<div class="hearth-ledger-lanes" data-hearth-lane-list></div>',
        '<div class="hearth-ledger-receipt" data-hearth-receipt-box data-visible="false"><pre data-hearth-receipt-text></pre></div>',
        '</div>'
      ].join("");

      if (mount) mount.appendChild(cockpit);
    }

    cockpit.dataset.hearthFemaleJsSelected = CONTRACT;
    cockpit.dataset.hearthSouthPairDisposition = "female-js-selector";
    cockpit.dataset.generatedImage = "false";
    cockpit.dataset.graphicBox = "false";
    cockpit.dataset.webgl = "false";
    cockpit.dataset.visualPassClaimed = "false";

    refs.cockpit = cockpit;
    refs.title = cockpit.querySelector(".hearth-ledger-title");
    refs.stage = cockpit.querySelector("[data-hearth-stage-label]");
    refs.heartbeat = cockpit.querySelector("[data-hearth-heartbeat-text]");
    refs.latest = cockpit.querySelector("[data-hearth-latest-event]");
    refs.progressFill = cockpit.querySelector("[data-hearth-main-progress-fill]");
    refs.progressPercent = cockpit.querySelector("[data-hearth-main-progress-percent]");
    refs.receiptBox = cockpit.querySelector("[data-hearth-receipt-box]");
    refs.receiptText = cockpit.querySelector("[data-hearth-receipt-text]");
    refs.copyButton = cockpit.querySelector("[data-hearth-copy-diagnostic]");
    refs.receiptButton = cockpit.querySelector("[data-hearth-toggle-receipt]");
    refs.inspectButton = cockpit.querySelector("[data-hearth-inspect-planet]");
    refs.collapseButton = cockpit.querySelector("[data-hearth-collapse-cockpit]");

    refs.showTab =
      q("[data-hearth-south-show-diagnostic-tab]") ||
      q("[data-hearth-east-show-diagnostic-tab]");

    if (refs.copyButton) refs.copyButton.onclick = copyDiagnostic;
    if (refs.receiptButton) refs.receiptButton.onclick = toggleReceipt;
    if (refs.inspectButton) refs.inspectButton.onclick = toggleInspect;
    if (refs.collapseButton) refs.collapseButton.onclick = toggleCockpit;
    if (refs.showTab) refs.showTab.onclick = showDiagnostic;

    state.cockpitPresent = true;
    return cockpit;
  }

  function bindShellControls() {
    ensureStatusNode();
    ensureMount();
    ensureCockpit();

    state.hooksBound = Boolean(refs.mount && refs.cockpit && refs.status);
    state.shellControlsBound = true;

    setStage(
      "F3",
      "EAST",
      "F3_SHELL_CONTROLS_BOUND",
      22,
      "female JS selector bound safe shell controls only"
    );

    record("SHELL_CONTROLS_BOUND", {
      mountPresent: state.mountPresent,
      cockpitPresent: state.cockpitPresent,
      statusNodePresent: state.statusNodePresent
    });
  }

  function selectMaleShell() {
    if (!doc || !doc.documentElement) {
      state.shellSelected = false;
      state.shellAccepted = false;
      state.shellMode = "NO_DOCUMENT";
      state.shellHoldReason = "DOCUMENT_UNAVAILABLE";
      state.firstFailedCoordinate = "DOCUMENT_UNAVAILABLE";
      return false;
    }

    const dataset = doc.documentElement.dataset || {};
    const htmlContract = safeString(dataset.contract, "");

    state.shellContract = htmlContract;
    state.shellSelected = true;

    const matchedPair = htmlContract === EXPECTED_HTML_CONTRACT;
    const safeLegacy = htmlContract === CURRENT_SAFE_HTML_CONTRACT;

    if (matchedPair) {
      state.shellAccepted = true;
      state.shellMode = "MATCHED_MALE_HTML_PAIR";
      state.shellHoldReason = "NONE";
      state.firstFailedCoordinate = "WAITING_RUNTIME_RELEASE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.postgameStatus = "MATCHED_MALE_HTML_SELECTED_RUNTIME_HELD_FOR_RELEASE";

      setStage(
        "F5",
        "EAST",
        "F5_MATCHED_MALE_HTML_SELECTED",
        34,
        "female JS selected matched HTML shell; runtime still held"
      );

      record("MATCHED_MALE_HTML_SELECTED", {
        htmlContract,
        expected: EXPECTED_HTML_CONTRACT
      });

      return true;
    }

    if (safeLegacy) {
      state.shellAccepted = false;
      state.shellMode = "SAFE_LEGACY_HTML_HELD";
      state.shellHoldReason = "WAITING_PAIRED_HTML_TNT";
      state.firstFailedCoordinate = "WAITING_PAIRED_HTML_TNT";
      state.recommendedNextFile = "/showroom/globe/hearth/index.html";
      state.recommendedNextRenewalTarget = "/showroom/globe/hearth/index.html";
      state.postgameStatus = "SAFE_HOLD_WAITING_PAIRED_MALE_HTML_SHELL";

      setStage(
        "F5",
        "EAST",
        "F5_SAFE_LEGACY_HTML_HELD",
        28,
        "current shell is safe legacy; heavy runtime release held until paired HTML executes"
      );

      record("SAFE_LEGACY_HTML_HELD", {
        htmlContract,
        expected: EXPECTED_HTML_CONTRACT
      });

      return false;
    }

    state.shellAccepted = false;
    state.shellMode = "UNMATCHED_HTML_HELD";
    state.shellHoldReason = "HTML_CONTRACT_MISMATCH";
    state.firstFailedCoordinate = "HTML_CONTRACT_MISMATCH";
    state.recommendedNextFile = "/showroom/globe/hearth/index.html";
    state.recommendedNextRenewalTarget = "/showroom/globe/hearth/index.html";
    state.postgameStatus = "UNMATCHED_HTML_HELD_RUNTIME_NOT_RELEASED";

    setStage(
      "F5",
      "EAST",
      "F5_UNMATCHED_HTML_HELD",
      26,
      "female JS refused heavy runtime release against unmatched HTML shell"
    );

    record("UNMATCHED_HTML_HELD", {
      htmlContract,
      expected: EXPECTED_HTML_CONTRACT,
      safeLegacy: CURRENT_SAFE_HTML_CONTRACT
    });

    return false;
  }

  function existingScript(file) {
    if (!doc) return null;

    return Array.from(doc.scripts || []).find((script) => {
      const src = script.getAttribute("src") || script.src || "";
      return src.includes(file);
    }) || null;
  }

  function loadScript(item) {
    return new Promise((resolve) => {
      if (!doc || !doc.head) {
        state.runtimeHeld.push(item.key);
        state.runtimeErrors.push(`${item.key}:document-head-missing`);
        resolve(false);
        return;
      }

      const existing = existingScript(item.file);

      if (existing) {
        state.runtimeLoaded.push(`${item.key}:existing`);
        record("RUNTIME_SCRIPT_EXISTING", item);
        resolve(true);
        return;
      }

      const script = doc.createElement("script");
      const separator = item.file.includes("?") ? "&" : "?";

      state.currentRuntimeKey = item.key;
      state.currentRuntimeFile = item.file;

      setStage(
        item.fibonacci,
        item.news,
        `LOADING_${item.key.toUpperCase()}`,
        Math.min(88, state.activeProgress + 4),
        `loading ${item.key}`
      );

      script.src = `${item.file}${separator}v=${encodeURIComponent(CONTRACT)}`;
      script.async = false;
      script.defer = true;
      script.dataset.loadedBy = CONTRACT;
      script.dataset.hearthSouthPairRuntime = "true";
      script.dataset.hearthFemaleJsSelected = "true";
      script.dataset.hearthNewsGate = item.news;
      script.dataset.hearthFibonacci = item.fibonacci;
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      let settled = false;

      const finish = (ok, label) => {
        if (settled) return;
        settled = true;

        if (ok) {
          state.runtimeLoaded.push(item.key);
          record("RUNTIME_SCRIPT_LOADED", { ...item, label });
        } else {
          state.runtimeHeld.push(item.key);
          state.runtimeErrors.push(`${item.key}:${label}`);
          recordError("RUNTIME_SCRIPT_HELD", label, item);
        }

        resolve(ok);
      };

      script.onload = () => finish(true, "loaded");
      script.onerror = () => finish(false, "load-error");

      doc.head.appendChild(script);

      root.setTimeout(() => {
        finish(false, "load-timeout-soft-held");
      }, item.required ? 5000 : 3600);
    });
  }

  function idle(callback, timeout = 800) {
    if (root.requestIdleCallback) {
      root.requestIdleCallback(callback, { timeout });
      return;
    }

    root.setTimeout(callback, 80);
  }

  function sleep(ms) {
    return new Promise((resolve) => root.setTimeout(resolve, ms));
  }

  async function releaseRuntime(source = "manual-release") {
    state.runtimeReleaseRequested = true;

    if (!state.shellAccepted) {
      const selected = selectMaleShell();

      if (!selected) {
        state.runtimeReleaseAuthorized = false;
        state.runtimeReleaseHeldReason = state.shellHoldReason || "WAITING_MATCHED_MALE_HTML_SHELL";
        state.firstFailedCoordinate = state.runtimeReleaseHeldReason;
        state.postgameStatus = "RUNTIME_RELEASE_HELD_WAITING_MATCHED_HTML";

        setStage(
          "F5",
          "EAST",
          "F5_RUNTIME_RELEASE_HELD",
          30,
          state.runtimeReleaseHeldReason
        );

        record("RUNTIME_RELEASE_HELD", {
          source,
          reason: state.runtimeReleaseHeldReason,
          shellContract: state.shellContract,
          expectedHtmlContract: EXPECTED_HTML_CONTRACT
        });

        return getReceipt();
      }
    }

    if (runtimeRunning || state.runtimeReleaseStarted) {
      record("RUNTIME_RELEASE_ALREADY_STARTED", { source });
      return getReceipt();
    }

    runtimeRunning = true;
    state.runtimeReleaseAuthorized = true;
    state.runtimeReleaseStarted = true;
    state.runtimeReleaseHeldReason = "NONE";

    setStage(
      "F8",
      "EAST",
      "F8_RUNTIME_RELEASE_AUTHORIZED",
      38,
      "matched shell accepted; non-blocking runtime release begins"
    );

    record("RUNTIME_RELEASE_AUTHORIZED", { source });

    for (let i = 0; i < RUNTIME_QUEUE.length; i += 1) {
      const item = RUNTIME_QUEUE[i];

      await new Promise((resolve) => {
        idle(() => resolve(), 900);
      });

      await loadScript(item);
      await sleep(60);
    }

    state.runtimeReleaseComplete = true;
    state.currentRuntimeKey = "";
    state.currentRuntimeFile = "";
    state.firstFailedCoordinate = "NONE_RUNTIME_QUEUE_COMPLETE";
    state.recommendedNextFile = FILES.routeConductor;
    state.recommendedNextRenewalTarget = FILES.routeConductor;
    state.postgameStatus = "RUNTIME_QUEUE_COMPLETE_F13_DELEGATED_F21_HELD_BY_NORTH";

    setStage(
      "F13",
      "CANVAS",
      "F13_RUNTIME_QUEUE_COMPLETE_CANVAS_DELEGATED",
      72,
      "runtime queue complete; Canvas F13 evidence is delegated; F21 remains North-only"
    );

    runtimeRunning = false;
    publish();

    record("RUNTIME_QUEUE_COMPLETE", {
      loaded: state.runtimeLoaded,
      held: state.runtimeHeld,
      errors: state.runtimeErrors
    });

    return getReceipt();
  }

  function maybeAutoReleaseFromMatchedHtml() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset || {};
    const autoReady = dataset.hearthSouthPairShellReady === "true";
    const autoRelease = dataset.hearthSouthPairAutoReleaseRuntime === "true";

    if (autoReady) {
      selectMaleShell();
    }

    if (autoReady && autoRelease) {
      idle(() => {
        releaseRuntime("matched-html-auto-release");
      }, 1200);
    }
  }

  function toggleReceipt() {
    if (!refs.receiptBox) return;

    const visible = refs.receiptBox.dataset.visible !== "true";
    refs.receiptBox.dataset.visible = String(visible);

    if (refs.receiptButton) {
      refs.receiptButton.textContent = visible ? "Hide receipt" : "Show receipt";
    }

    if (refs.receiptText) {
      refs.receiptText.textContent = getReceiptText();
    }
  }

  function toggleCockpit() {
    if (!refs.cockpit) return;

    const expanded = refs.cockpit.dataset.cockpitMode !== "expanded-cockpit";
    refs.cockpit.dataset.cockpitMode = expanded ? "expanded-cockpit" : "diagnostic-dock";

    if (refs.collapseButton) {
      refs.collapseButton.textContent = expanded ? "Collapse cockpit" : "Expand cockpit";
    }
  }

  function toggleInspect() {
    if (!doc || !doc.documentElement || !refs.cockpit) return;

    const active = doc.documentElement.dataset.hearthSouthPairInspect === "true" ? false : true;

    doc.documentElement.dataset.hearthSouthPairInspect = String(active);
    refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "diagnostic-dock";

    if (refs.inspectButton) {
      refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";
    }

    if (refs.showTab) {
      refs.showTab.hidden = !active;
    }

    record(active ? "INSPECT_PLACEHOLDER_ACTIVE" : "DIAGNOSTIC_DOCK_RESTORED", {
      shellOnly: true,
      runtimeMayEnhance: true
    });
  }

  function showDiagnostic() {
    if (!doc || !doc.documentElement || !refs.cockpit) return;

    doc.documentElement.dataset.hearthSouthPairInspect = "false";
    refs.cockpit.dataset.cockpitMode = "diagnostic-dock";

    if (refs.showTab) refs.showTab.hidden = true;
    if (refs.inspectButton) refs.inspectButton.textContent = "Inspect planet";

    record("DIAGNOSTIC_DOCK_RESTORED_FROM_TAB");
  }

  async function copyDiagnostic() {
    const text = getReceiptText();
    let copied = false;

    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
        copied = true;
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
        copied = true;
      }
    } catch (error) {
      recordError("COPY_DIAGNOSTIC_FAILED", error && error.message ? error.message : String(error));
    }

    if (refs.copyButton) {
      refs.copyButton.textContent = copied ? "Copied" : "Copy held";
      root.setTimeout(() => {
        if (refs.copyButton) refs.copyButton.textContent = "Copy diagnostic";
      }, 900);
    }

    record("COPY_DIAGNOSTIC", { copied });
    return copied;
  }

  function publish() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthEastFemaleSelectorLoaded = "true";
    dataset.hearthEastFemaleSelectorContract = CONTRACT;
    dataset.hearthEastFemaleSelectorReceipt = RECEIPT;
    dataset.hearthEastFemaleSelectorVersion = VERSION;

    dataset.hearthSouthPairDisposition = "south-facing-expression-pair";
    dataset.hearthSouthPairFemaleJsComesFirst = "true";
    dataset.hearthSouthPairFemaleJsFile = FILE;
    dataset.hearthSouthPairExpectedMaleHtmlContract = EXPECTED_HTML_CONTRACT;

    dataset.hearthNewsAlignmentActive = "true";
    dataset.hearthFibonacciSynchronizationActive = "true";
    dataset.hearthCycleOneRoute = state.cycleOneRoute;
    dataset.hearthCycleTwoRoute = state.cycleTwoRoute;
    dataset.hearthActiveNews = state.activeNews;
    dataset.hearthActiveFibonacci = state.activeFibonacci;
    dataset.hearthActiveStage = state.activeStage;
    dataset.hearthActiveProgress = String(state.activeProgress);

    dataset.hearthShellSelected = String(state.shellSelected);
    dataset.hearthShellAccepted = String(state.shellAccepted);
    dataset.hearthShellContract = state.shellContract;
    dataset.hearthShellMode = state.shellMode;
    dataset.hearthShellHoldReason = state.shellHoldReason;

    dataset.hearthRuntimeReleaseRequested = String(state.runtimeReleaseRequested);
    dataset.hearthRuntimeReleaseAuthorized = String(state.runtimeReleaseAuthorized);
    dataset.hearthRuntimeReleaseStarted = String(state.runtimeReleaseStarted);
    dataset.hearthRuntimeReleaseComplete = String(state.runtimeReleaseComplete);
    dataset.hearthRuntimeReleaseHeldReason = state.runtimeReleaseHeldReason;

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

    if (refs.status) {
      refs.status.textContent = getReceiptText();
    }

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.eastFemaleSelector = api;
    root.HEARTH.indexBridge = api;
    root.HEARTH.indexJs = api;

    root.HEARTH_EAST_FEMALE_SELECTOR = api;
    root.HEARTH_EAST_STEP1_IGNITION = api;
    root.HEARTH_INDEX_JS = api;
    root.HEARTH_INDEX_BRIDGE = api;
    root.HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR = api;

    root.HEARTH_EAST_FEMALE_SELECTOR_RECEIPT = getReceipt();
    root.HEARTH_INDEX_JS_RECEIPT = root.HEARTH_EAST_FEMALE_SELECTOR_RECEIPT;
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

      disposition: state.disposition,
      pairGenderModel: state.pairGenderModel,
      femaleJsComesFirst: state.femaleJsComesFirst,
      maleHtmlShellExpected: state.maleHtmlShellExpected,
      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      currentSafeHtmlContract: CURRENT_SAFE_HTML_CONTRACT,

      newsAlignmentActive: true,
      fibonacciSynchronizationActive: true,
      cycleOneRoute: state.cycleOneRoute,
      cycleTwoRoute: state.cycleTwoRoute,

      activeNews: state.activeNews,
      activeFibonacci: state.activeFibonacci,
      activeStage: state.activeStage,
      activeProgress: state.activeProgress,

      shellSelected: state.shellSelected,
      shellAccepted: state.shellAccepted,
      shellContract: state.shellContract,
      shellMode: state.shellMode,
      shellHoldReason: state.shellHoldReason,

      hooksBound: state.hooksBound,
      shellControlsBound: state.shellControlsBound,
      cockpitPresent: state.cockpitPresent,
      mountPresent: state.mountPresent,
      statusNodePresent: state.statusNodePresent,

      runtimeReleaseRequested: state.runtimeReleaseRequested,
      runtimeReleaseAuthorized: state.runtimeReleaseAuthorized,
      runtimeReleaseStarted: state.runtimeReleaseStarted,
      runtimeReleaseComplete: state.runtimeReleaseComplete,
      runtimeReleaseHeldReason: state.runtimeReleaseHeldReason,

      currentRuntimeKey: state.currentRuntimeKey,
      currentRuntimeFile: state.currentRuntimeFile,
      runtimeLoaded: state.runtimeLoaded.slice(),
      runtimeHeld: state.runtimeHeld.slice(),
      runtimeErrors: state.runtimeErrors.slice(),

      canvasF13Delegated: true,
      f21NorthOnly: true,
      readyTextAllowed: false,
      downstreamReleaseClaimed: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      events: clonePlain(state.events),
      errors: clonePlain(state.errors),

      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    return [
      "HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR_NON_BLOCKING_BOOT_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      "",
      `disposition=${r.disposition}`,
      `pairGenderModel=${r.pairGenderModel}`,
      `femaleJsComesFirst=${r.femaleJsComesFirst}`,
      `maleHtmlShellExpected=${r.maleHtmlShellExpected}`,
      `expectedHtmlContract=${r.expectedHtmlContract}`,
      `currentSafeHtmlContract=${r.currentSafeHtmlContract}`,
      "",
      `newsAlignmentActive=${r.newsAlignmentActive}`,
      `fibonacciSynchronizationActive=${r.fibonacciSynchronizationActive}`,
      `cycleOneRoute=${r.cycleOneRoute}`,
      `cycleTwoRoute=${r.cycleTwoRoute}`,
      "",
      `activeNews=${r.activeNews}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeStage=${r.activeStage}`,
      `activeProgress=${r.activeProgress}`,
      "",
      `shellSelected=${r.shellSelected}`,
      `shellAccepted=${r.shellAccepted}`,
      `shellContract=${r.shellContract}`,
      `shellMode=${r.shellMode}`,
      `shellHoldReason=${r.shellHoldReason}`,
      "",
      `hooksBound=${r.hooksBound}`,
      `shellControlsBound=${r.shellControlsBound}`,
      `cockpitPresent=${r.cockpitPresent}`,
      `mountPresent=${r.mountPresent}`,
      `statusNodePresent=${r.statusNodePresent}`,
      "",
      `runtimeReleaseRequested=${r.runtimeReleaseRequested}`,
      `runtimeReleaseAuthorized=${r.runtimeReleaseAuthorized}`,
      `runtimeReleaseStarted=${r.runtimeReleaseStarted}`,
      `runtimeReleaseComplete=${r.runtimeReleaseComplete}`,
      `runtimeReleaseHeldReason=${r.runtimeReleaseHeldReason}`,
      `currentRuntimeKey=${r.currentRuntimeKey}`,
      `currentRuntimeFile=${r.currentRuntimeFile}`,
      `runtimeLoaded=${r.runtimeLoaded.join(",")}`,
      `runtimeHeld=${r.runtimeHeld.join(",")}`,
      `runtimeErrors=${r.runtimeErrors.join(" | ")}`,
      "",
      `canvasF13Delegated=${r.canvasF13Delegated}`,
      `f21NorthOnly=${r.f21NorthOnly}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `downstreamReleaseClaimed=${r.downstreamReleaseClaimed}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `postgameStatus=${r.postgameStatus}`,
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

  function boot() {
    if (booted) return getReceipt();

    booted = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;

    ensureStatusNode();
    ensureMount();
    ensureCockpit();

    setStage(
      "F1",
      "EAST",
      "F1_FEMALE_SELECTOR_ALIVE",
      8,
      "female JS selector alive; choosing shell"
    );

    bindShellControls();

    setStage(
      "F2",
      "EAST",
      "F2_SHELL_HOOKS_STABLE",
      18,
      "safe shell hooks stable; no heavy runtime loaded"
    );

    selectMaleShell();
    maybeAutoReleaseFromMatchedHtml();

    publish();

    record("FEMALE_JS_SELECTOR_BOOTED", {
      shellContract: state.shellContract,
      shellAccepted: state.shellAccepted,
      runtimeReleaseAuthorized: state.runtimeReleaseAuthorized
    });

    return getReceipt();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    boot,
    start: boot,
    init: boot,
    run: boot,

    selectMaleShell,
    bindShellControls,
    releaseRuntime,
    getReceipt,
    getReceiptText,
    copyDiagnostic,

    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    currentSafeHtmlContract: CURRENT_SAFE_HTML_CONTRACT,
    femaleJsComesFirst: true,
    maleHtmlShellExpected: true,
    southFacingExpressionPair: true,

    newsAlignmentActive: true,
    fibonacciSynchronizationActive: true,
    cycleOneRoute: "NORTH_EAST_WEST_SOUTH_NORTH",
    cycleTwoRoute: "NORTH_EAST_SOUTH_WEST_CANVAS",

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
  root.HEARTH.eastFemaleSelector = api;
  root.HEARTH.indexJs = api;

  root.HEARTH_EAST_FEMALE_SELECTOR = api;
  root.HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR = api;
  root.HEARTH_INDEX_JS = api;
  root.HEARTH_INDEX_BRIDGE = api;

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
