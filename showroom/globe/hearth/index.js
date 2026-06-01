// /showroom/globe/hearth/index.js
// HEARTH_EAST_NON_BLOCKING_EXISTING_STATUS_ADMISSION_ADAPTER_TNT_v1
// Full-file replacement.
// East admission adapter only.
// Purpose:
// - Match HEARTH_HTML_NON_BLOCKING_EAST_BOOT_TWO_CYCLE_RUNTIME_SHELL_TNT_v3.
// - Keep HTML shell-first architecture responsive.
// - Publish East admission packet without loading downstream scripts.
// - Preserve compatibility aliases for existing North/West consumers if already present.
// - Delegate Canvas F13 and North F21 without claiming either.
// Does not own:
// - North Runtime Table authority
// - North F21 latch
// - West admissibility decision
// - South visible proof
// - Canvas drawing
// - Canvas F13 evidence generation
// - Route conductor runtime
// - source stack hydration
// - downstream script loading
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_EAST_NON_BLOCKING_EXISTING_STATUS_ADMISSION_ADAPTER_TNT_v1";
  const RECEIPT = "HEARTH_EAST_NON_BLOCKING_EXISTING_STATUS_ADMISSION_ADAPTER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_EAST_ROUTE_CONDUCTOR_REQUEST_HYDRATION_ADMISSION_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_HTML_NON_BLOCKING_EAST_BOOT_TWO_CYCLE_RUNTIME_SHELL_TNT_v3";
  const VERSION = "2026-05-31.hearth-east-non-blocking-existing-status-admission-adapter-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FILE = "/showroom/globe/hearth/index.js";
  const ROUTE = "/showroom/globe/hearth/";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const HTML_CONTRACT = "HEARTH_HTML_NON_BLOCKING_EAST_BOOT_TWO_CYCLE_RUNTIME_SHELL_TNT_v3";

  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const WEST_FILE = "/assets/lab/runtime-table.west.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const CYCLE_ONE = "NORTH_EAST_WEST_SOUTH_NORTH";
  const CYCLE_TWO = "NORTH_EAST_SOUTH_WEST_CANVAS";

  const CORE_HOOKS = Object.freeze([
    "#hearthCanvasMount",
    "#hearthLoadCockpit",
    "#hearth-route-status"
  ]);

  const OPTIONAL_HOOKS = Object.freeze([
    "[data-hearth-stage-label]",
    "[data-hearth-heartbeat-text]",
    "[data-hearth-latest-event]",
    "[data-hearth-main-progress-fill]",
    "[data-hearth-main-progress-percent]",
    "[data-hearth-receipt-text]",
    "[data-hearth-receipt-box]",
    "[data-hearth-copy-diagnostic]",
    "[data-hearth-toggle-receipt]",
    "[data-hearth-inspect-planet]",
    "[data-hearth-collapse-cockpit]",
    "[data-hearth-south-show-diagnostic-tab]"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    htmlFile: HTML_FILE,
    htmlContract: HTML_CONTRACT,
    role: "hearth-east-non-blocking-existing-status-admission-adapter",

    shellObserved: false,
    hooksValidated: false,
    coreHooksValidated: false,
    optionalHooksObserved: false,
    missingCoreHooks: [],
    missingOptionalHooks: [],

    eastAdmissionReady: false,
    admissionPacketEmitted: false,
    browserEventDispatched: false,

    compatibilityHandoffAttempted: false,
    compatibilityHandoffAcceptedByNorth: false,
    compatibilityHandoffAcceptedByWest: false,
    compatibilityHandoffErrors: [],

    northObserved: false,
    westObserved: false,

    htmlLoadedEastOnly: true,
    eastLoadsDownstreamCycle: false,
    downstreamLoadingOwnedByEast: false,
    downstreamLoadingPerformed: false,

    canvasF13Delegated: true,
    f21NorthOnly: true,

    activeFibonacci: "F1",
    activeStage: "EAST_ADMISSION_NOT_STARTED",
    activeProgress: 0,

    firstFailedCoordinate: "EAST_ADMISSION_NOT_STARTED",
    recommendedNextOwner: "EAST",
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "EAST_ADMISSION_NOT_STARTED",

    events: [],
    errors: [],

    bootStarted: false,
    bootComplete: false,
    createdAt: "",
    updatedAt: "",

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  const refs = {
    mount: null,
    cockpit: null,
    status: null,
    stage: null,
    heartbeat: null,
    latest: null,
    progressFill: null,
    progressPercent: null,
    receiptText: null,
    receiptBox: null,
    copyButton: null,
    toggleReceiptButton: null,
    inspectButton: null,
    collapseButton: null,
    showTab: null
  };

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

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
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

  function qs(selector) {
    return doc ? doc.querySelector(selector) : null;
  }

  function setText(node, text) {
    if (node) node.textContent = safeString(text);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.events.push(item);
    if (state.events.length > 80) {
      state.events.splice(0, state.events.length - 80);
    }

    state.updatedAt = item.at;
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
    if (state.errors.length > 40) {
      state.errors.splice(0, state.errors.length - 40);
    }

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

  function firstExisting(paths) {
    for (const path of paths) {
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
      } catch (error) {
        recordError("READ_RECEIPT_FAILED", error && error.message ? error.message : String(error));
        return null;
      }
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;

    if (authority.contract || authority.receipt || authority.version) return authority;

    return null;
  }

  function bindRefs() {
    refs.mount = qs("#hearthCanvasMount");
    refs.cockpit = qs("#hearthLoadCockpit");
    refs.status = qs("#hearth-route-status");
    refs.stage = qs("[data-hearth-stage-label]");
    refs.heartbeat = qs("[data-hearth-heartbeat-text]");
    refs.latest = qs("[data-hearth-latest-event]");
    refs.progressFill = qs("[data-hearth-main-progress-fill]");
    refs.progressPercent = qs("[data-hearth-main-progress-percent]");
    refs.receiptText = qs("[data-hearth-receipt-text]");
    refs.receiptBox = qs("[data-hearth-receipt-box]");
    refs.copyButton = qs("[data-hearth-copy-diagnostic]");
    refs.toggleReceiptButton = qs("[data-hearth-toggle-receipt]");
    refs.inspectButton = qs("[data-hearth-inspect-planet]");
    refs.collapseButton = qs("[data-hearth-collapse-cockpit]");
    refs.showTab = qs("[data-hearth-south-show-diagnostic-tab]");

    state.shellObserved = Boolean(refs.mount && refs.cockpit && refs.status);
  }

  function validateHooks() {
    bindRefs();

    state.missingCoreHooks = CORE_HOOKS.filter((selector) => !qs(selector));
    state.missingOptionalHooks = OPTIONAL_HOOKS.filter((selector) => !qs(selector));

    state.coreHooksValidated = state.missingCoreHooks.length === 0;
    state.optionalHooksObserved = state.missingOptionalHooks.length < OPTIONAL_HOOKS.length;
    state.hooksValidated = state.coreHooksValidated;

    if (!state.coreHooksValidated) {
      state.activeFibonacci = "F2";
      state.activeStage = "EAST_SHELL_HOOK_VALIDATION_HELD";
      state.activeProgress = 18;
      state.firstFailedCoordinate = "EAST_SHELL_HOOK_VALIDATION_HELD";
      state.recommendedNextOwner = "HTML";
      state.recommendedNextRenewalTarget = HTML_FILE;
      state.postgameStatus = "EAST_ADMISSION_HELD_BY_MISSING_CORE_HTML_HOOKS";

      record("HOOK_VALIDATION_HELD", {
        missingCoreHooks: state.missingCoreHooks,
        missingOptionalHooks: state.missingOptionalHooks
      });

      return false;
    }

    state.activeFibonacci = "F2";
    state.activeStage = "EAST_SHELL_HOOK_VALIDATION_COMPLETE";
    state.activeProgress = 24;
    state.firstFailedCoordinate = "NONE_CORE_HOOKS_VALIDATED";
    state.recommendedNextOwner = "EAST";
    state.recommendedNextRenewalTarget = FILE;
    state.postgameStatus = "EAST_CORE_HOOKS_VALIDATED";

    record("HOOK_VALIDATION_COMPLETE", {
      missingOptionalHooks: state.missingOptionalHooks
    });

    return true;
  }

  function setProgress(value) {
    const progress = clamp(value, 0, 100);
    state.activeProgress = progress;

    if (refs.progressFill) refs.progressFill.style.width = `${progress}%`;
    if (refs.progressPercent) refs.progressPercent.textContent = `${Math.round(progress)}%`;
  }

  function updateShellText(message) {
    bindRefs();

    if (refs.stage) refs.stage.textContent = `${state.activeFibonacci} · ${state.activeStage}`;
    if (refs.heartbeat) refs.heartbeat.textContent = message || state.postgameStatus;
    if (refs.latest) refs.latest.textContent = `latest=${state.postgameStatus}`;
    setProgress(state.activeProgress);

    if (refs.status) refs.status.textContent = getReceiptText();

    if (refs.receiptText && refs.receiptBox && refs.receiptBox.dataset.visible === "true") {
      refs.receiptText.textContent = getReceiptText();
    }
  }

  function detectExistingAuthorities() {
    const north = firstExisting([
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_CARDINAL_RUNTIME_TABLE_NORTH",
      "LAB_RUNTIME_TABLE_NORTH_TWO_CYCLE_DISTRIBUTOR",
      "LAB_CHECKPOINT_GOVERNOR",
      "LAB_NEWS_FIBONACCI_CHECKPOINT_GOVERNOR",
      "DexterRuntimeTable",
      "RUNTIME_TABLE",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth"
    ]);

    const west = firstExisting([
      "LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_GAP_CLASSIFIER_WEST",
      "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.gapClassifierWest"
    ]);

    state.northObserved = Boolean(north);
    state.westObserved = Boolean(west);

    return { north, west };
  }

  function getAdmissionPacket() {
    const authorities = detectExistingAuthorities();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      packetType: "HEARTH_EAST_ADMISSION_PACKET",
      file: FILE,
      route: ROUTE,
      htmlFile: HTML_FILE,
      htmlContract: HTML_CONTRACT,

      cycleOneRoute: CYCLE_ONE,
      cycleTwoRoute: CYCLE_TWO,

      activeFibonacci: state.activeFibonacci,
      activeStage: state.activeStage,
      activeProgress: state.activeProgress,

      shellObserved: state.shellObserved,
      hooksValidated: state.hooksValidated,
      coreHooksValidated: state.coreHooksValidated,
      optionalHooksObserved: state.optionalHooksObserved,
      missingCoreHooks: state.missingCoreHooks.slice(),
      missingOptionalHooks: state.missingOptionalHooks.slice(),

      eastAdmissionReady: state.eastAdmissionReady,
      admissionPacketEmitted: state.admissionPacketEmitted,

      htmlLoadedEastOnly: true,
      htmlLoadsRuntimeTable: false,
      htmlLoadsSourceStack: false,
      htmlLoadsCanvas: false,
      htmlLoadsWest: false,
      htmlLoadsNorth: false,
      htmlLoadsSouth: false,

      eastLoadsDownstreamCycle: false,
      downstreamLoadingOwnedByEast: false,
      downstreamLoadingPerformed: false,

      northObserved: Boolean(authorities.north),
      westObserved: Boolean(authorities.west),

      canvasF13Delegated: true,
      f21NorthOnly: true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      emittedAt: nowIso()
    };
  }

  function dispatchAdmission() {
    const packet = getAdmissionPacket();

    state.admissionPacketEmitted = true;
    state.browserEventDispatched = false;

    try {
      if (isFunction(root.CustomEvent) && isFunction(root.dispatchEvent)) {
        root.dispatchEvent(new CustomEvent("hearth:east-admission-ready", { detail: packet }));
        root.dispatchEvent(new CustomEvent("HEARTH_EAST_ADMISSION_READY", { detail: packet }));
        state.browserEventDispatched = true;
      }
    } catch (error) {
      recordError("ADMISSION_EVENT_DISPATCH_FAILED", error && error.message ? error.message : String(error));
    }

    root.HEARTH_EAST_ADMISSION_PACKET = packet;
    root.HEARTH_INDEX_STEP1_HANDOFF_RECEIPT = packet;
    root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT = packet;

    record("EAST_ADMISSION_PACKET_EMITTED", {
      browserEventDispatched: state.browserEventDispatched
    });

    return packet;
  }

  function callFirst(authority, methodNames, packet) {
    if (!authority || !isObject(authority)) return false;

    for (const methodName of methodNames) {
      if (!isFunction(authority[methodName])) continue;

      try {
        const result = authority[methodName](packet);
        return result !== false;
      } catch (error) {
        recordError(`${methodName}_FAILED`, error && error.message ? error.message : String(error));
        return false;
      }
    }

    return true;
  }

  function attemptCompatibilityHandoff() {
    const packet = getAdmissionPacket();
    const authorities = detectExistingAuthorities();

    state.compatibilityHandoffAttempted = true;
    state.compatibilityHandoffAcceptedByNorth = false;
    state.compatibilityHandoffAcceptedByWest = false;

    if (authorities.north) {
      state.compatibilityHandoffAcceptedByNorth = callFirst(authorities.north, [
        "acceptEastPrimary",
        "receiveEastPrimary",
        "acceptEastHandoff",
        "receiveEastHandoff",
        "acceptCheckpointEvent",
        "receiveCheckpointEvent",
        "submitEvent",
        "receiveEvent"
      ], packet);
    }

    if (authorities.west) {
      state.compatibilityHandoffAcceptedByWest = callFirst(authorities.west, [
        "acceptEastHandoff",
        "receiveEastHandoff",
        "acceptEastPrimary",
        "receiveEastPrimary",
        "acceptWestIntake",
        "receiveWestIntake"
      ], packet);
    }

    if (!authorities.north) {
      state.firstFailedCoordinate = "WAITING_EXISTING_NORTH_RUNTIME_TABLE_OR_NEXT_NORTH_RENEWAL";
      state.recommendedNextOwner = "NORTH";
      state.recommendedNextRenewalTarget = NORTH_FILE;
      state.postgameStatus = "EAST_ADMISSION_READY_NO_EXISTING_NORTH_CONSUMER_OBSERVED";
    } else {
      state.firstFailedCoordinate = "NONE_EAST_ADMISSION_READY";
      state.recommendedNextOwner = state.compatibilityHandoffAcceptedByWest ? "CANVAS" : "WEST";
      state.recommendedNextRenewalTarget = state.compatibilityHandoffAcceptedByWest ? CANVAS_FILE : WEST_FILE;
      state.postgameStatus = state.compatibilityHandoffAcceptedByWest
        ? "EAST_ADMISSION_READY_EXISTING_STATUS_HANDOFF_COMPLETE"
        : "EAST_ADMISSION_READY_WAITING_EXISTING_WEST_OR_NEXT_WEST_RENEWAL";
    }

    record("COMPATIBILITY_HANDOFF_ATTEMPTED", {
      northObserved: Boolean(authorities.north),
      westObserved: Boolean(authorities.west),
      acceptedByNorth: state.compatibilityHandoffAcceptedByNorth,
      acceptedByWest: state.compatibilityHandoffAcceptedByWest
    });

    return {
      attempted: true,
      northObserved: Boolean(authorities.north),
      westObserved: Boolean(authorities.west),
      acceptedByNorth: state.compatibilityHandoffAcceptedByNorth,
      acceptedByWest: state.compatibilityHandoffAcceptedByWest,
      packet
    };
  }

  function bindShellControls() {
    bindRefs();

    if (refs.copyButton && !refs.copyButton.dataset.hearthEastAdmissionBound) {
      refs.copyButton.dataset.hearthEastAdmissionBound = "true";
      refs.copyButton.addEventListener("click", () => {
        const text = getReceiptText();

        const done = (ok) => {
          const original = refs.copyButton.textContent || "Copy diagnostic";
          refs.copyButton.textContent = ok ? "Copied" : "Copy held";
          root.setTimeout(() => {
            refs.copyButton.textContent = original;
          }, 900);
        };

        if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
          root.navigator.clipboard.writeText(text).then(() => done(true)).catch(() => done(false));
          return;
        }

        try {
          const area = doc.createElement("textarea");
          area.value = text;
          area.setAttribute("readonly", "readonly");
          area.style.position = "fixed";
          area.style.left = "-9999px";
          doc.body.appendChild(area);
          area.select();
          doc.execCommand("copy");
          area.remove();
          done(true);
        } catch (_error) {
          done(false);
        }
      });
    }

    if (refs.toggleReceiptButton && refs.receiptBox && !refs.toggleReceiptButton.dataset.hearthEastAdmissionBound) {
      refs.toggleReceiptButton.dataset.hearthEastAdmissionBound = "true";
      refs.toggleReceiptButton.addEventListener("click", () => {
        const visible = refs.receiptBox.dataset.visible !== "true";
        refs.receiptBox.dataset.visible = String(visible);
        refs.toggleReceiptButton.textContent = visible ? "Hide receipt" : "Show receipt";
        if (refs.receiptText) refs.receiptText.textContent = getReceiptText();
      });
    }

    if (refs.inspectButton && refs.cockpit && !refs.inspectButton.dataset.hearthEastAdmissionBound) {
      refs.inspectButton.dataset.hearthEastAdmissionBound = "true";
      refs.inspectButton.addEventListener("click", () => {
        const active = doc.documentElement.dataset.hearthEastAdmissionInspectPlaceholder !== "true";
        doc.documentElement.dataset.hearthEastAdmissionInspectPlaceholder = String(active);
        refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "diagnostic-dock";
        refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";

        if (refs.showTab) {
          refs.showTab.hidden = !active;
          refs.showTab.dataset.visible = String(active);
        }

        record(active ? "INSPECT_PLACEHOLDER_ACTIVE" : "DIAGNOSTIC_DOCK_RESTORED", {
          shellOnly: true
        });

        publishAll();
        updateShellText(active ? "inspect placeholder active" : "diagnostic dock restored");
      });
    }

    if (refs.showTab && refs.cockpit && !refs.showTab.dataset.hearthEastAdmissionBound) {
      refs.showTab.dataset.hearthEastAdmissionBound = "true";
      refs.showTab.addEventListener("click", () => {
        doc.documentElement.dataset.hearthEastAdmissionInspectPlaceholder = "false";
        refs.showTab.hidden = true;
        refs.cockpit.dataset.cockpitMode = "diagnostic-dock";
        if (refs.inspectButton) refs.inspectButton.textContent = "Inspect planet";

        record("DIAGNOSTIC_DOCK_RESTORED_FROM_TAB");
        publishAll();
        updateShellText("diagnostic dock restored");
      });
    }

    if (refs.collapseButton && refs.cockpit && !refs.collapseButton.dataset.hearthEastAdmissionBound) {
      refs.collapseButton.dataset.hearthEastAdmissionBound = "true";
      refs.collapseButton.addEventListener("click", () => {
        const expanded = refs.cockpit.dataset.cockpitMode !== "expanded-cockpit";
        refs.cockpit.dataset.cockpitMode = expanded ? "expanded-cockpit" : "diagnostic-dock";
        refs.collapseButton.textContent = expanded ? "Collapse cockpit" : "Expand cockpit";

        record(expanded ? "COCKPIT_EXPANDED" : "COCKPIT_COLLAPSED");
        publishAll();
      });
    }

    state.activeFibonacci = "F3";
    state.activeStage = "EAST_LOCAL_API_AND_SHELL_CONTROLS_READY";
    state.activeProgress = 30;
    state.postgameStatus = "EAST_LOCAL_API_AND_SHELL_CONTROLS_READY";

    record("SHELL_CONTROLS_BOUND");
  }

  function publishDatasets() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthEastAdmissionAdapterLoaded = "true";
    dataset.hearthEastAdmissionAdapterContract = CONTRACT;
    dataset.hearthEastAdmissionAdapterReceipt = RECEIPT;
    dataset.hearthEastAdmissionAdapterVersion = VERSION;

    dataset.hearthEastFile = FILE;
    dataset.hearthHtmlContract = HTML_CONTRACT;

    dataset.hearthCycleOneRoute = CYCLE_ONE;
    dataset.hearthCycleTwoRoute = CYCLE_TWO;

    dataset.hearthHtmlLoadedEastOnly = "true";
    dataset.hearthHtmlLoadsRuntimeTable = "false";
    dataset.hearthHtmlLoadsSourceStack = "false";
    dataset.hearthHtmlLoadsCanvas = "false";
    dataset.hearthHtmlLoadsWest = "false";
    dataset.hearthHtmlLoadsNorth = "false";
    dataset.hearthHtmlLoadsSouth = "false";

    dataset.hearthEastLoadsDownstreamCycle = "false";
    dataset.hearthDownstreamLoadingOwnedByEast = "false";
    dataset.hearthDownstreamLoadingPerformed = "false";

    dataset.hearthEastAdmissionReady = String(state.eastAdmissionReady);
    dataset.hearthEastAdmissionPacketEmitted = String(state.admissionPacketEmitted);
    dataset.hearthEastAdmissionBrowserEventDispatched = String(state.browserEventDispatched);

    dataset.hearthEastHooksValidated = String(state.hooksValidated);
    dataset.hearthEastMissingCoreHooks = state.missingCoreHooks.join(",");
    dataset.hearthEastMissingOptionalHooks = state.missingOptionalHooks.join(",");

    dataset.hearthEastNorthObserved = String(state.northObserved);
    dataset.hearthEastWestObserved = String(state.westObserved);
    dataset.hearthEastCompatibilityHandoffAttempted = String(state.compatibilityHandoffAttempted);
    dataset.hearthEastCompatibilityHandoffAcceptedByNorth = String(state.compatibilityHandoffAcceptedByNorth);
    dataset.hearthEastCompatibilityHandoffAcceptedByWest = String(state.compatibilityHandoffAcceptedByWest);

    dataset.hearthCanvasF13Delegated = "true";
    dataset.hearthF21NorthOnly = "true";

    dataset.hearthActiveFibonacci = state.activeFibonacci;
    dataset.hearthActiveStage = state.activeStage;
    dataset.hearthActiveProgress = String(state.activeProgress);

    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextOwner = state.recommendedNextOwner;
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

    root.HEARTH.eastAdmissionAdapter = api;
    root.HEARTH.indexBridge = api;
    root.HEARTH.eastStep1Ignition = api;

    root.DEXTER_LAB.hearthEastAdmissionAdapter = api;

    root.HEARTH_EAST_ADMISSION_ADAPTER = api;
    root.HEARTH_EAST_STEP1_IGNITION = api;
    root.HEARTH_INDEX_BRIDGE = api;
    root.HEARTH_INDEX_JS = api;
    root.HearthIndexBridge = api;

    root.HEARTH_EAST_ADMISSION_ADAPTER_RECEIPT = getReceipt();
    root.HEARTH_EAST_STEP1_IGNITION_RECEIPT = root.HEARTH_EAST_ADMISSION_ADAPTER_RECEIPT;
    root.HEARTH_INDEX_BRIDGE_RECEIPT = root.HEARTH_EAST_ADMISSION_ADAPTER_RECEIPT;
    root.HEARTH_INDEX_JS_RECEIPT = root.HEARTH_EAST_ADMISSION_ADAPTER_RECEIPT;

    publishDatasets();
  }

  function getReceipt() {
    detectExistingAuthorities();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      htmlFile: HTML_FILE,
      htmlContract: HTML_CONTRACT,
      role: state.role,

      shellObserved: state.shellObserved,
      hooksValidated: state.hooksValidated,
      coreHooksValidated: state.coreHooksValidated,
      optionalHooksObserved: state.optionalHooksObserved,
      missingCoreHooks: state.missingCoreHooks.slice(),
      missingOptionalHooks: state.missingOptionalHooks.slice(),

      eastAdmissionReady: state.eastAdmissionReady,
      admissionPacketEmitted: state.admissionPacketEmitted,
      browserEventDispatched: state.browserEventDispatched,

      compatibilityHandoffAttempted: state.compatibilityHandoffAttempted,
      compatibilityHandoffAcceptedByNorth: state.compatibilityHandoffAcceptedByNorth,
      compatibilityHandoffAcceptedByWest: state.compatibilityHandoffAcceptedByWest,
      compatibilityHandoffErrors: state.compatibilityHandoffErrors.slice(),

      northObserved: state.northObserved,
      westObserved: state.westObserved,

      htmlLoadedEastOnly: true,
      htmlLoadsRuntimeTable: false,
      htmlLoadsSourceStack: false,
      htmlLoadsCanvas: false,
      htmlLoadsWest: false,
      htmlLoadsNorth: false,
      htmlLoadsSouth: false,

      eastLoadsDownstreamCycle: false,
      downstreamLoadingOwnedByEast: false,
      downstreamLoadingPerformed: false,

      canvasF13Delegated: true,
      f21NorthOnly: true,

      activeFibonacci: state.activeFibonacci,
      activeStage: state.activeStage,
      activeProgress: state.activeProgress,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      ownsShellAdmission: true,
      ownsHookValidation: true,
      ownsEastAdmissionPacket: true,
      ownsOneTimeCompatibilityHandoff: true,

      ownsNorthRuntimeTable: false,
      ownsNorthF21Latch: false,
      ownsWestAdmissibilityDecision: false,
      ownsSouthVisibleProof: false,
      ownsCanvasDrawing: false,
      ownsCanvasF13EvidenceGeneration: false,
      ownsRouteConductorRuntime: false,
      ownsSourceStackHydration: false,
      ownsDownstreamScriptLoading: false,
      ownsFinalVisualPassClaim: false,

      noHeartbeatInterval: true,
      noWatchdogInterval: true,
      noSerialDownstreamScriptLoader: true,
      noDeepRecursiveGlobalScan: true,
      noLaneRepaintLoop: true,

      events: clonePlain(state.events),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      createdAt: state.createdAt,
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const events = r.events.map((item) => (
      `- ${item.at || ""} :: ${item.event || ""} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = r.errors.map((item) => (
      `- ${item.at || ""} :: ${item.code || ""} :: ${item.message || ""}`
    )).join("\n") || "- none";

    return [
      "HEARTH_EAST_NON_BLOCKING_EXISTING_STATUS_ADMISSION_ADAPTER_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `htmlContract=${r.htmlContract}`,
      `role=${r.role}`,
      "",
      `shellObserved=${r.shellObserved}`,
      `hooksValidated=${r.hooksValidated}`,
      `coreHooksValidated=${r.coreHooksValidated}`,
      `optionalHooksObserved=${r.optionalHooksObserved}`,
      `missingCoreHooks=${r.missingCoreHooks.join(",")}`,
      `missingOptionalHooks=${r.missingOptionalHooks.join(",")}`,
      "",
      `eastAdmissionReady=${r.eastAdmissionReady}`,
      `admissionPacketEmitted=${r.admissionPacketEmitted}`,
      `browserEventDispatched=${r.browserEventDispatched}`,
      "",
      `compatibilityHandoffAttempted=${r.compatibilityHandoffAttempted}`,
      `compatibilityHandoffAcceptedByNorth=${r.compatibilityHandoffAcceptedByNorth}`,
      `compatibilityHandoffAcceptedByWest=${r.compatibilityHandoffAcceptedByWest}`,
      `northObserved=${r.northObserved}`,
      `westObserved=${r.westObserved}`,
      "",
      "SCRIPT_BOUNDARY",
      "htmlLoadedEastOnly=true",
      "htmlLoadsRuntimeTable=false",
      "htmlLoadsSourceStack=false",
      "htmlLoadsCanvas=false",
      "htmlLoadsWest=false",
      "htmlLoadsNorth=false",
      "htmlLoadsSouth=false",
      "eastLoadsDownstreamCycle=false",
      "downstreamLoadingOwnedByEast=false",
      "downstreamLoadingPerformed=false",
      "",
      "NEWS_ALIGNMENT",
      "north=macro law / permission / F21 latch",
      "east=shell admission / packet / event / one-time compatibility handoff",
      "west=admissibility and Canvas release audit",
      "south=visible completion and proof body",
      "canvas=F13 evidence only",
      "",
      "FIBONACCI_SYNCHRONIZATION",
      "F1=HTML shell painted",
      "F2=East hook validation",
      "F3=East local API and shell controls",
      "F5=East admission packet emitted",
      "F8=East compatibility handoff attempted",
      "F13=Canvas evidence delegated",
      "F21=North-only latch",
      "",
      `activeFibonacci=${r.activeFibonacci}`,
      `activeStage=${r.activeStage}`,
      `activeProgress=${r.activeProgress}`,
      "",
      `canvasF13Delegated=${r.canvasF13Delegated}`,
      `f21NorthOnly=${r.f21NorthOnly}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextOwner=${r.recommendedNextOwner}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `postgameStatus=${r.postgameStatus}`,
      "",
      "OWNERSHIP",
      `ownsShellAdmission=${r.ownsShellAdmission}`,
      `ownsHookValidation=${r.ownsHookValidation}`,
      `ownsEastAdmissionPacket=${r.ownsEastAdmissionPacket}`,
      `ownsOneTimeCompatibilityHandoff=${r.ownsOneTimeCompatibilityHandoff}`,
      `ownsNorthRuntimeTable=${r.ownsNorthRuntimeTable}`,
      `ownsNorthF21Latch=${r.ownsNorthF21Latch}`,
      `ownsWestAdmissibilityDecision=${r.ownsWestAdmissibilityDecision}`,
      `ownsSouthVisibleProof=${r.ownsSouthVisibleProof}`,
      `ownsCanvasDrawing=${r.ownsCanvasDrawing}`,
      `ownsCanvasF13EvidenceGeneration=${r.ownsCanvasF13EvidenceGeneration}`,
      `ownsRouteConductorRuntime=${r.ownsRouteConductorRuntime}`,
      `ownsSourceStackHydration=${r.ownsSourceStackHydration}`,
      `ownsDownstreamScriptLoading=${r.ownsDownstreamScriptLoading}`,
      `ownsFinalVisualPassClaim=${r.ownsFinalVisualPassClaim}`,
      "",
      "PERFORMANCE_BOUNDARY",
      `noHeartbeatInterval=${r.noHeartbeatInterval}`,
      `noWatchdogInterval=${r.noWatchdogInterval}`,
      `noSerialDownstreamScriptLoader=${r.noSerialDownstreamScriptLoader}`,
      `noDeepRecursiveGlobalScan=${r.noDeepRecursiveGlobalScan}`,
      `noLaneRepaintLoop=${r.noLaneRepaintLoop}`,
      "",
      "EVENTS",
      events,
      "",
      "ERRORS",
      errors,
      "",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `createdAt=${r.createdAt}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function boot() {
    if (state.bootStarted) {
      publishAll();
      updateShellText("East admission already booted.");
      return getReceipt();
    }

    state.bootStarted = true;
    state.createdAt = nowIso();
    state.updatedAt = state.createdAt;

    state.activeFibonacci = "F2";
    state.activeStage = "EAST_HOOK_VALIDATION_STARTED";
    state.activeProgress = 18;
    state.postgameStatus = "EAST_HOOK_VALIDATION_STARTED";

    record("BOOT_STARTED");

    if (!validateHooks()) {
      state.bootComplete = true;
      publishAll();
      updateShellText("hook validation held · core shell hook missing");
      return getReceipt();
    }

    bindShellControls();
    publishAll();
    updateShellText("shell controls ready · East admission packet pending");

    state.activeFibonacci = "F5";
    state.activeStage = "EAST_ADMISSION_PACKET_EMITTED";
    state.activeProgress = 34;
    state.eastAdmissionReady = true;
    state.firstFailedCoordinate = "NONE_EAST_ADMISSION_PACKET_READY";
    state.recommendedNextOwner = "NORTH";
    state.recommendedNextRenewalTarget = NORTH_FILE;
    state.postgameStatus = "EAST_ADMISSION_PACKET_READY";

    dispatchAdmission();
    publishAll();
    updateShellText("East admission packet emitted · compatibility handoff pending");

    state.activeFibonacci = "F8";
    state.activeStage = "EAST_EXISTING_STATUS_COMPATIBILITY_HANDOFF_ATTEMPTED";
    state.activeProgress = 40;

    attemptCompatibilityHandoff();

    state.bootComplete = true;

    if (state.postgameStatus === "EAST_ADMISSION_READY_NO_EXISTING_NORTH_CONSUMER_OBSERVED") {
      state.activeStage = "EAST_ADMISSION_READY_NO_EXISTING_DOWNSTREAM_CONSUMER_OBSERVED";
    } else {
      state.activeStage = "EAST_ADMISSION_READY_EXISTING_STATUS_HANDOFF_COMPLETE_OR_WAITING";
    }

    publishAll();
    updateShellText("East admission ready · downstream ownership delegated");

    record("BOOT_COMPLETE", {
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget
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
    htmlContract: HTML_CONTRACT,

    boot,
    start: boot,
    init: boot,
    run: boot,

    getAdmissionPacket,
    dispatchAdmission,
    attemptCompatibilityHandoff,
    getReceipt,
    getReceiptText,

    htmlLoadedEastOnly: true,
    htmlLoadsRuntimeTable: false,
    htmlLoadsSourceStack: false,
    htmlLoadsCanvas: false,
    htmlLoadsWest: false,
    htmlLoadsNorth: false,
    htmlLoadsSouth: false,
    eastLoadsDownstreamCycle: false,
    downstreamLoadingOwnedByEast: false,
    downstreamLoadingPerformed: false,

    canvasF13Delegated: true,
    f21NorthOnly: true,

    ownsShellAdmission: true,
    ownsHookValidation: true,
    ownsEastAdmissionPacket: true,
    ownsOneTimeCompatibilityHandoff: true,

    ownsNorthRuntimeTable: false,
    ownsNorthF21Latch: false,
    ownsWestAdmissibilityDecision: false,
    ownsSouthVisibleProof: false,
    ownsCanvasDrawing: false,
    ownsCanvasF13EvidenceGeneration: false,
    ownsRouteConductorRuntime: false,
    ownsSourceStackHydration: false,
    ownsDownstreamScriptLoading: false,
    ownsFinalVisualPassClaim: false,

    noHeartbeatInterval: true,
    noWatchdogInterval: true,
    noSerialDownstreamScriptLoader: true,
    noDeepRecursiveGlobalScan: true,
    noLaneRepaintLoop: true,

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
      doc.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
