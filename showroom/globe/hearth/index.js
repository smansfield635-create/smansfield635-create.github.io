// /showroom/globe/hearth/index.js
// HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3
// Full-file replacement.
// Index JS / HTML-shell anchor auditor / control binder / runtime host / carrier-host admissibility publisher.
// Narrow repair over:
// - HEARTH_INDEX_JS_CONTROL_SURFACE_EVENT_SHIELD_RUNTIME_STAGE_INTERCEPTION_REPAIR_TNT_v5_2
// Accepted baseline lineage:
// - HEARTH_INDEX_JS_API_REDECLARATION_CONTROL_BINDING_REPAIR_TNT_v5_1
// Purpose:
// - Preserve accepted v5_1 parser repair and API Object.assign pattern.
// - Preserve runtime loading order, carrier-host admissibility, and route-conductor handoff.
// - Explicitly recognize current HTML v2_1 control-surface receiver.
// - Install an Index-owned early activation shield across window/document/html/body/cockpit/stage/control surfaces.
// - Execute cockpit controls from terminal physical activation, not click-only dependency.
// - Suppress pointer/touch/mouse/click duplicate execution by physical activation window.
// - Block event leakage into globe/stage/canvas/runtime gesture paths.
// - Preserve keyboard activation through Enter/Space click behavior.
// - Do not alter HTML shell, Route Conductor, Canvas, Macro West, runtime tables, North, F21, ready text, generated image, GraphicBox, WebGL, or final visual pass claims.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3";
  const RECEIPT = "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_RECEIPT_v5_3";
  const PREVIOUS_CONTRACT = "HEARTH_INDEX_JS_CONTROL_SURFACE_EVENT_SHIELD_RUNTIME_STAGE_INTERCEPTION_REPAIR_TNT_v5_2";
  const BASELINE_CONTRACT = "HEARTH_INDEX_JS_API_REDECLARATION_CONTROL_BINDING_REPAIR_TNT_v5_1";
  const VERSION = "2026-06-02.hearth-index-js-control-surface-early-activation-shield-v5-3";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/index.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const PAIRED_ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";

  const CANVAS_PARENT_FILE = "/assets/hearth/hearth.canvas.js";
  const NORTH_RUNTIME_FILE = "/assets/lab/runtime-table.js";
  const EAST_RUNTIME_FILE = "/assets/lab/runtime-table.east.js";
  const SOUTH_RUNTIME_FILE = "/assets/lab/runtime-table.south.js";
  const WEST_RUNTIME_FILE = "/assets/lab/runtime-table.west.js";

  const CURRENT_HTML_CONTRACT = "HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1";
  const EXPECTED_HTML_CONTRACT = "HEARTH_HTML_SOUTH_PAIR_MALE_SHELL_FEMALE_SELECTED_RUNTIME_RECEIVER_TNT_v1";
  const CURRENT_SAFE_HTML_CONTRACT = "HEARTH_HTML_NON_BLOCKING_EAST_BOOT_TWO_CYCLE_RUNTIME_SHELL_TNT_v3";

  const HTML_CONTRACTS_RECOGNIZED = Object.freeze([
    CURRENT_HTML_CONTRACT,
    CURRENT_SAFE_HTML_CONTRACT,
    EXPECTED_HTML_CONTRACT,
    "HEARTH_HTML_CURRENT_RUNTIME_SELECTOR_CACHE_RENEWAL_RECEIVER_TNT_v2"
  ]);

  const MACRO_CYCLE_1 = "NORTH_EAST_WEST_SOUTH_NORTH";
  const MACRO_CYCLE_2 = "NORTH_EAST_SOUTH_WEST_CANVAS";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTROL_SELECTORS = Object.freeze([
    "[data-hearth-copy-diagnostic]",
    "[data-hearth-toggle-receipt]",
    "[data-hearth-inspect-planet]",
    "[data-hearth-collapse-cockpit]",
    "[data-hearth-south-show-diagnostic-tab]",
    "[data-hearth-east-show-diagnostic-tab]",
    "[data-hearth-show-diagnostic-tab]"
  ]);

  const CONTROL_ACTIONS = Object.freeze([
    {
      actionName: "copyDiagnostic",
      selector: "[data-hearth-copy-diagnostic]",
      label: "Copy Diagnostic"
    },
    {
      actionName: "toggleReceipt",
      selector: "[data-hearth-toggle-receipt]",
      label: "Show Receipt"
    },
    {
      actionName: "inspectPlanet",
      selector: "[data-hearth-inspect-planet]",
      label: "Inspect Planet"
    },
    {
      actionName: "toggleCockpit",
      selector: "[data-hearth-collapse-cockpit]",
      label: "Expand Cockpit"
    },
    {
      actionName: "showDiagnostic",
      selector: "[data-hearth-south-show-diagnostic-tab]",
      label: "Show Diagnostic"
    },
    {
      actionName: "showDiagnostic",
      selector: "[data-hearth-east-show-diagnostic-tab]",
      label: "Show Diagnostic"
    },
    {
      actionName: "showDiagnostic",
      selector: "[data-hearth-show-diagnostic-tab]",
      label: "Show Diagnostic"
    }
  ]);

  const CONTROL_SHIELD_EVENTS = Object.freeze([
    "pointerdown",
    "pointerup",
    "touchstart",
    "touchend",
    "mousedown",
    "mouseup",
    "click"
  ]);

  const CONTROL_TERMINAL_EVENTS = Object.freeze([
    "pointerup",
    "touchend",
    "mouseup"
  ]);

  const CONTROL_START_EVENTS = Object.freeze([
    "pointerdown",
    "touchstart",
    "mousedown"
  ]);

  const DUPLICATE_ACTIVATION_WINDOW_MS = 720;

  const REQUIRED_HTML_ANCHORS = Object.freeze([
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
        "HEARTH_CANVAS_PARENT",
        "HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION",
        "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST",
        "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER",
        "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER",
        "HEARTH.canvas",
        "HEARTH.canvasParent",
        "HEARTH.canvasEvidence",
        "HEARTH.canvasNorth",
        "HEARTH.canvasParentEastV5SynchronousHeldPacketConsumption",
        "HEARTH.canvasParentPreReleaseStructuralCarrierThenWestReleaseToEast",
        "HEARTH.canvasParentGovernedF13EvidenceReceiver",
        "HEARTH.canvasParentChildReconciliationF13EvidenceReceiver",
        "DEXTER_LAB.hearthCanvas",
        "DEXTER_LAB.hearthCanvasParent",
        "DEXTER_LAB.hearthCanvasEvidence",
        "DEXTER_LAB.hearthCanvasParentEastV5SynchronousHeldPacketConsumption"
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
        "HEARTH_ROUTE_CONDUCTOR_MALE_PAIR_INDEX_SELECTOR_INTEGRATION_STRICT_F13",
        "HEARTH.routeConductor",
        "HEARTH.southRouteConductor",
        "HEARTH.routeConductorPrimaryGate",
        "HEARTH.routeConductorStrictF13DownstreamAlignment",
        "HEARTH.routeConductorMalePairIndexSelectorIntegrationStrictF13",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthSouthRouteConductor",
        "DEXTER_LAB.hearthRouteConductorPrimaryGate"
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
    htmlFile: HTML_FILE,
    route: ROUTE,

    role: "index-js-control-surface-early-activation-shield",
    pairRole: "female-runtime-host-for-male-route-conductor",
    pairedRouteConductorFile: PAIRED_ROUTE_CONDUCTOR_FILE,

    parserRepairActive: true,
    apiRedeclarationRepairActive: true,
    priorApiRedeclarationFatalDefectCorrected: true,

    indexControlSurfaceEarlyActivationShieldActive: true,
    indexControlSurfaceEventShieldActive: true,
    controlPointerTouchShieldActive: true,
    controlCapturePhaseShieldActive: true,
    multiLayerControlCaptureShieldActive: true,
    terminalActivationExecutionActive: true,
    clickOnlyActivationAvoided: true,
    runtimeStageInterceptionPrevented: true,
    canvasGestureLeakBlocked: true,
    duplicateTouchClickSuppressionActive: true,
    physicalActivationWindowSuppressionActive: true,
    keyboardActivationPreserved: true,
    currentHtmlContractRecognized: false,
    htmlRebuildRequired: false,
    routeConductorRebuildRequired: false,
    canvasRebuildRequired: false,
    runtimeTableRebuildRequired: false,
    routeConductorOwnsControlBinding: false,

    controlSurfaceShieldBound: false,
    controlShieldBoundTargets: 0,
    controlShieldBoundControls: 0,
    controlShieldInterceptCount: 0,
    controlShieldTerminalActivationCount: 0,
    controlShieldClickSuppressionCount: 0,
    controlShieldDuplicateSuppressionCount: 0,
    controlShieldKeyboardActivationCount: 0,
    controlShieldLastActionName: "",
    controlShieldLastEventType: "",
    controlShieldLastActivatedAt: "",
    controlShieldLastSuppressedAt: "",

    htmlOwnsVisibleShell: true,
    indexJsCreatesVisibleShell: false,
    indexJsCreatesFallbackCss: false,
    indexJsCreatesShellDom: false,
    indexJsCreatesRuntimeScriptsOnly: true,

    ownsRouteAnchors: false,
    ownsMountHost: false,
    ownsControlsCreation: false,
    ownsControlBinding: true,
    indexOwnsControlBinding: true,
    ownsRuntimeScriptRelease: true,
    ownsCanvasCarrierHostPacket: true,
    ownsCarrierHostAdmissibility: true,
    ownsRouteConductorHandoff: true,

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

    currentHtmlContract: CURRENT_HTML_CONTRACT,
    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    currentSafeHtmlContract: CURRENT_SAFE_HTML_CONTRACT,
    shellContract: "",
    shellDetected: false,
    shellSelected: false,
    shellAccepted: false,
    shellSelectionMode: "UNSELECTED",
    shellHoldReason: "WAITING_HTML_MALE_ROUTE_SHELL_ANCHORS",
    htmlAnchorAuditActive: true,
    dynamicAnchorsPass: false,
    missingAnchors: [],
    shellControlsBound: false,

    mountPresent: false,
    cockpitPresent: false,
    statusNodePresent: false,
    receiptPanelPresent: false,
    portalPresent: false,
    carrierHostReady: false,
    carrierHostPacketReady: false,

    carrierHostAdmissibilityActive: true,
    carrierHostAdmissibilityReady: false,
    carrierHostAdmissibilityPacketReady: false,
    carrierHostAdmissibilityPacketPublished: false,
    carrierHostAdmissibilityReceiptObservedByRoute: false,
    carrierHostAdmissibilityHoldReason: "WAITING_HTML_MALE_ROUTE_SHELL_ANCHORS",
    handoffToRouteConductor: false,
    indexMacroWestCandidateReady: false,
    routeConductorHandoffPacketReady: false,
    lastCarrierHostAdmissibilityPacket: null,

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
    runtimeReleaseHeldReason: "WAITING_HTML_MALE_ROUTE_SHELL_ANCHORS",
    runtimeLoaded: [],
    runtimeHeldFiles: [],
    runtimeErrors: [],
    currentRuntimeKey: "",
    currentRuntimeFile: "",

    newsAlignmentActive: true,
    newsAlignmentProtocolActive: true,
    fibonacciSynchronizationActive: true,
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    fibonacciSynchronizationSatisfied: 0,
    fibonacciSynchronizationExpected: 8,
    fibonacciSynchronizationPassed: false,
    fibonacciSynchronizationDegraded: false,
    macroCycle1: MACRO_CYCLE_1,
    macroCycle2: MACRO_CYCLE_2,
    activeNews: "EAST",
    activeFibonacci: "F1",
    activeFibonacciRank: 1,
    activeStageId: "F1_HTML_SHELL_ANCHOR_AUDIT",
    activeGearId: "hearth-index-js-html-anchor-audit-f1",
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

    firstFailedCoordinate: "WAITING_HTML_MALE_ROUTE_SHELL_ANCHORS",
    recommendedNextFile: HTML_FILE,
    recommendedNextRenewalTarget: HTML_FILE,
    postgameStatus: "INDEX_JS_WAITING_HTML_SHELL_ANCHORS",

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
    stage: null,
    cockpit: null,
    controlSurface: null,
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

  const shieldBoundTargets = typeof WeakSet !== "undefined" ? new WeakSet() : null;
  const shieldBoundControls = typeof WeakSet !== "undefined" ? new WeakSet() : null;
  const activationLedger = new Map();

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function nowMs() {
    try {
      return Date.now();
    } catch (_error) {
      return new Date().getTime();
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
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

  function qsa(selector) {
    if (!doc) return [];

    try {
      return Array.from(doc.querySelectorAll(selector));
    } catch (_error) {
      return [];
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

    if (isFunction(authority.getReceiptLight)) {
      try {
        const receipt = authority.getReceiptLight();
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

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
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

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function stopControlEvent(event) {
    if (!event) return;

    try {
      if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
      if (isFunction(event.stopPropagation)) event.stopPropagation();
    } catch (_error) {}

    if (event.cancelable) {
      try {
        event.preventDefault();
      } catch (_error) {}
    }
  }

  function getEventPath(event) {
    if (!event) return [];

    if (isFunction(event.composedPath)) {
      try {
        return event.composedPath();
      } catch (_error) {
        return [];
      }
    }

    const path = [];
    let cursor = event.target || null;

    while (cursor) {
      path.push(cursor);
      cursor = cursor.parentNode || cursor.host || null;
    }

    path.push(root);
    return path;
  }

  function closestSafe(target, selector) {
    if (!target) return null;

    if (isElement(target) && isFunction(target.closest)) {
      try {
        return target.closest(selector);
      } catch (_error) {
        return null;
      }
    }

    return null;
  }

  function matchControlActionFromNode(node) {
    if (!isElement(node)) return null;

    for (const def of CONTROL_ACTIONS) {
      const matched = closestSafe(node, def.selector);
      if (matched) {
        return {
          ...def,
          element: matched
        };
      }
    }

    return null;
  }

  function matchControlActionFromEvent(event) {
    const direct = matchControlActionFromNode(event && event.target);
    if (direct) return direct;

    const path = getEventPath(event);

    for (const node of path) {
      const found = matchControlActionFromNode(node);
      if (found) return found;
    }

    return null;
  }

  function getControlIdentity(element, actionName) {
    if (!element) return actionName;

    const dataset = element.dataset || {};
    const explicit = dataset.hearthControlId || dataset.hearthAction || dataset.action || element.id || element.getAttribute("aria-label") || element.textContent || "";
    return `${actionName}:${safeString(explicit, actionName).trim().slice(0, 80)}`;
  }

  function markControlElement(element, actionName) {
    if (!element || !element.dataset) return;

    element.dataset.hearthIndexControlShield = "true";
    element.dataset.hearthIndexControlShieldContract = CONTRACT;
    element.dataset.hearthIndexOwnsControlBinding = "true";
    element.dataset.hearthRouteConductorOwnsControlBinding = "false";
    element.dataset.hearthControlPointerTouchShieldActive = "true";
    element.dataset.hearthControlCapturePhaseShieldActive = "true";
    element.dataset.hearthRuntimeStageInterceptionPrevented = "true";
    element.dataset.hearthCanvasGestureLeakBlocked = "true";
    element.dataset.hearthDuplicateTouchClickSuppressionActive = "true";
    element.dataset.hearthKeyboardActivationPreserved = "true";
    element.dataset.hearthControlActionName = actionName || "";
  }

  function bindShieldTarget(target, label = "target") {
    if (!target || !isFunction(target.addEventListener)) return false;

    if (shieldBoundTargets && shieldBoundTargets.has(target)) return false;

    const options = {
      capture: true,
      passive: false
    };

    for (const eventType of CONTROL_SHIELD_EVENTS) {
      try {
        target.addEventListener(eventType, handleControlSurfaceEvent, options);
      } catch (_error) {
        try {
          target.addEventListener(eventType, handleControlSurfaceEvent, true);
        } catch (__error) {}
      }
    }

    try {
      target.__hearthIndexControlShieldBound = CONTRACT;
      target.__hearthIndexControlShieldLabel = label;
    } catch (_error) {}

    if (shieldBoundTargets) shieldBoundTargets.add(target);
    state.controlShieldBoundTargets += 1;
    return true;
  }

  function bindControlElement(element, actionName = "") {
    if (!element || !isFunction(element.addEventListener)) return false;

    markControlElement(element, actionName);

    if (shieldBoundControls && shieldBoundControls.has(element)) return false;

    const options = {
      capture: true,
      passive: false
    };

    for (const eventType of CONTROL_SHIELD_EVENTS) {
      try {
        element.addEventListener(eventType, handleControlSurfaceEvent, options);
      } catch (_error) {
        try {
          element.addEventListener(eventType, handleControlSurfaceEvent, true);
        } catch (__error) {}
      }
    }

    if (shieldBoundControls) shieldBoundControls.add(element);
    state.controlShieldBoundControls += 1;
    return true;
  }

  function collectShieldTargets() {
    const targets = [];

    if (root && isFunction(root.addEventListener)) targets.push({ target: root, label: "window" });
    if (doc && isFunction(doc.addEventListener)) targets.push({ target: doc, label: "document" });
    if (doc && doc.documentElement) targets.push({ target: doc.documentElement, label: "documentElement" });
    if (doc && doc.body) targets.push({ target: doc.body, label: "body" });

    refreshRefs();

    [
      ["main", refs.main],
      ["stage", refs.stage],
      ["mount", refs.mount],
      ["cockpit", refs.cockpit],
      ["controlSurface", refs.controlSurface],
      ["receiptPanel", refs.receiptPanel]
    ].forEach(([label, target]) => {
      if (target) targets.push({ target, label });
    });

    const seen = new Set();
    return targets.filter((entry) => {
      if (!entry.target) return false;
      const id = entry.label + ":" + (entry.target.__hearthIndexControlShieldObjectId || "");
      if (seen.has(entry.target)) return false;
      seen.add(entry.target);
      return Boolean(id);
    });
  }

  function bindControlSurfaceEventShield(reason = "bind-control-surface-event-shield") {
    refreshRefs();

    const targets = collectShieldTargets();

    for (const entry of targets) {
      bindShieldTarget(entry.target, entry.label);
    }

    for (const def of CONTROL_ACTIONS) {
      const elements = qsa(def.selector);
      for (const element of elements) {
        bindControlElement(element, def.actionName);
      }
    }

    if (refs.cockpit && refs.cockpit.dataset) {
      refs.cockpit.dataset.hearthIndexControlSurfaceEventShieldActive = "true";
      refs.cockpit.dataset.hearthIndexControlSurfaceEarlyActivationShieldActive = "true";
      refs.cockpit.dataset.hearthIndexOwnsControlBinding = "true";
      refs.cockpit.dataset.hearthRouteConductorOwnsControlBinding = "false";
      refs.cockpit.dataset.hearthRuntimeStageInterceptionPrevented = "true";
      refs.cockpit.dataset.hearthCanvasGestureLeakBlocked = "true";
    }

    if (refs.stage && refs.stage.dataset) {
      refs.stage.dataset.hearthIndexStageControlShieldAware = "true";
      refs.stage.dataset.hearthIndexCockpitControlEventsBlockedFromStage = "true";
    }

    if (refs.mount && refs.mount.dataset) {
      refs.mount.dataset.hearthIndexCockpitControlEventsBlockedFromCanvas = "true";
    }

    state.controlSurfaceShieldBound = true;
    state.shellControlsBound = Boolean(refs.copyButton && refs.toggleButton && refs.inspectButton && refs.collapseButton);
    state.controlShieldLastActionName = state.controlShieldLastActionName || "";
    state.postgameStatus = state.shellControlsBound
      ? "INDEX_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_BOUND"
      : state.postgameStatus;

    updateDataset();

    if (reason && reason !== "audit-shell-anchors") {
      state.updatedAt = nowIso();
    }

    return {
      bound: state.controlSurfaceShieldBound,
      controlsBound: state.shellControlsBound,
      boundTargets: state.controlShieldBoundTargets,
      boundControls: state.controlShieldBoundControls
    };
  }

  function shouldExecuteControlAction(event, actionName, element) {
    const eventType = event && event.type ? event.type : "";
    const identity = getControlIdentity(element, actionName);
    const key = identity;
    const at = nowMs();
    const prior = activationLedger.get(key) || 0;
    const withinWindow = at - prior >= 0 && at - prior < DUPLICATE_ACTIVATION_WINDOW_MS;

    if (CONTROL_START_EVENTS.includes(eventType)) {
      return false;
    }

    if (eventType === "click") {
      const keyboardClick = safeNumber(event && event.detail, 0) === 0;

      if (withinWindow) {
        state.controlShieldClickSuppressionCount += 1;
        state.controlShieldDuplicateSuppressionCount += 1;
        state.controlShieldLastSuppressedAt = nowIso();
        return false;
      }

      if (keyboardClick) {
        activationLedger.set(key, at);
        state.controlShieldKeyboardActivationCount += 1;
        return true;
      }

      state.controlShieldClickSuppressionCount += 1;
      state.controlShieldLastSuppressedAt = nowIso();
      return false;
    }

    if (CONTROL_TERMINAL_EVENTS.includes(eventType)) {
      if (withinWindow) {
        state.controlShieldDuplicateSuppressionCount += 1;
        state.controlShieldLastSuppressedAt = nowIso();
        return false;
      }

      activationLedger.set(key, at);
      return true;
    }

    return false;
  }

  function handleControlSurfaceEvent(event) {
    const matched = matchControlActionFromEvent(event);
    if (!matched) return;

    state.controlShieldInterceptCount += 1;
    state.controlShieldLastEventType = event.type || "";
    state.runtimeStageInterceptionPrevented = true;
    state.canvasGestureLeakBlocked = true;

    stopControlEvent(event);

    const execute = shouldExecuteControlAction(event, matched.actionName, matched.element);

    if (!execute) {
      updateDataset();
      return false;
    }

    state.controlShieldTerminalActivationCount += 1;
    state.controlShieldLastActionName = matched.actionName;
    state.controlShieldLastActivatedAt = nowIso();

    activateControlAction(matched.actionName, matched.element, event);

    updateDataset();
    return false;
  }

  function activateControlAction(actionName, element, event) {
    markControlElement(element, actionName);

    switch (actionName) {
      case "copyDiagnostic":
        copyDiagnostic();
        break;
      case "toggleReceipt":
        toggleReceiptPanel();
        break;
      case "inspectPlanet":
        setInspectIntent(true, "index-control-surface-shield");
        break;
      case "showDiagnostic":
        setInspectIntent(false, "index-control-surface-shield");
        break;
      case "toggleCockpit":
        toggleCockpitMode();
        break;
      default:
        break;
    }

    state.postgameStatus = `INDEX_CONTROL_ACTION_${safeString(actionName).toUpperCase()}_EXECUTED`;
    state.updatedAt = nowIso();

    if (event && event.type === "click" && safeNumber(event.detail, 0) === 0) {
      state.controlShieldKeyboardActivationCount += 1;
    }

    updateVisualShell(`control=${actionName}`);
    schedulePublish(`control-surface-action-${actionName}`);
  }

  function toggleReceiptPanel() {
    refreshRefs();

    if (!refs.receiptPanel) return false;

    const visible = refs.receiptPanel.dataset.visible !== "true";
    refs.receiptPanel.dataset.visible = String(visible);

    if (refs.toggleButton) {
      refs.toggleButton.textContent = visible ? "Hide receipt" : "Show receipt";
    }

    if (refs.receiptText) {
      refs.receiptText.textContent = visible ? getReceiptText() : "";
    }

    return visible;
  }

  function setInspectIntent(active, source = "index-js") {
    const html = doc && doc.documentElement ? doc.documentElement : null;

    refreshRefs();

    if (html) {
      html.dataset.hearthSouthPlanetInspect = String(active);
      html.dataset.hearthEastInspectReservedActive = String(active);
      html.dataset.hearthIndexJsInspectIntent = String(active);
      html.dataset.hearthIndexControlShieldInspectIntentSource = source;
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

    state.postgameStatus = active ? "INDEX_JS_INSPECT_INTENT_ACTIVE" : "INDEX_JS_DIAGNOSTIC_DOCK_ACTIVE";
    updateDataset();
    return active;
  }

  function toggleCockpitMode() {
    refreshRefs();

    if (!refs.cockpit) return false;

    const expanded = refs.cockpit.dataset.cockpitMode !== "expanded-cockpit";
    refs.cockpit.dataset.cockpitMode = expanded ? "expanded-cockpit" : "diagnostic-dock";

    if (refs.collapseButton) {
      refs.collapseButton.textContent = expanded ? "Collapse cockpit" : "Expand cockpit";
    }

    return expanded;
  }

  function refreshRefs() {
    refs.main = qs("#hearth-main") || qs("[data-hearth-main='true']");
    refs.mount = qs("#hearthCanvasMount") || qs("[data-hearth-canvas-mount='true']") || qs("[data-hearth-canvas-mount]");
    refs.stage = qs("#hearthGlobeStage") || qs("[data-hearth-globe-stage='true']") || qs("[data-hearth-survival-path-stage='true']");
    refs.cockpit = qs("#hearthLoadCockpit") || qs("[data-hearth-load-cockpit='true']");
    refs.controlSurface = refs.cockpit || qs("[data-hearth-control-surface='true']") || qs("[data-hearth-ledger-cockpit]");
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

  function auditShellAnchors(reason = "audit-shell-anchors") {
    refreshRefs();

    const dataset = doc && doc.documentElement && doc.documentElement.dataset ? doc.documentElement.dataset : {};
    const shellContract = safeString(dataset.contract || dataset.hearthHtmlContract || dataset.hearthShellContract || "");
    const missingAnchors = REQUIRED_HTML_ANCHORS.filter((selector) => !qs(selector));

    const currentV2_1 = shellContract === CURRENT_HTML_CONTRACT;
    const matchedMale = shellContract === EXPECTED_HTML_CONTRACT;
    const safeTransitional = shellContract === CURRENT_SAFE_HTML_CONTRACT;
    const recognizedContract = HTML_CONTRACTS_RECOGNIZED.includes(shellContract);
    const dynamicAnchorsPass = missingAnchors.length === 0;
    const detected = Boolean(refs.main && refs.mount && refs.cockpit);

    let selectionMode = "UNSELECTED";

    if (currentV2_1 && dynamicAnchorsPass) {
      selectionMode = "CURRENT_HTML_V2_1_CONTROL_SURFACE_RECEIVER";
    } else if (matchedMale && dynamicAnchorsPass) {
      selectionMode = "MATCHED_MALE_HTML_PAIR";
    } else if (safeTransitional && dynamicAnchorsPass) {
      selectionMode = "SAFE_TRANSITIONAL_HTML_BRIDGE";
    } else if (recognizedContract && dynamicAnchorsPass) {
      selectionMode = "RECOGNIZED_HTML_CONTRACT_DYNAMIC_ANCHORS";
    } else if (dynamicAnchorsPass) {
      selectionMode = "DYNAMIC_ANCHOR_ACCEPTED_HTML_SHELL";
    } else if (recognizedContract) {
      selectionMode = "HTML_CONTRACT_PRESENT_ANCHORS_MISSING";
    }

    const selected = Boolean(detected && (recognizedContract || dynamicAnchorsPass));
    const accepted = Boolean(selected && dynamicAnchorsPass);

    state.shellContract = shellContract;
    state.currentHtmlContractRecognized = currentV2_1 || recognizedContract;
    state.shellDetected = detected;
    state.shellSelected = selected;
    state.shellAccepted = accepted;
    state.shellSelectionMode = selectionMode;
    state.dynamicAnchorsPass = dynamicAnchorsPass;
    state.missingAnchors = missingAnchors;

    state.mountPresent = Boolean(refs.mount);
    state.cockpitPresent = Boolean(refs.cockpit);
    state.statusNodePresent = Boolean(refs.status);
    state.receiptPanelPresent = Boolean(refs.receiptPanel);
    state.portalPresent = Boolean(refs.portal);
    state.carrierHostReady = Boolean(refs.mount);
    state.carrierHostPacketReady = Boolean(refs.mount);
    state.f13CarrierHostAvailable = Boolean(refs.mount);

    if (!detected) {
      state.shellHoldReason = "WAITING_HTML_MALE_ROUTE_SHELL";
    } else if (!selected) {
      state.shellHoldReason = "WAITING_HTML_MALE_ROUTE_SHELL_SELECTION";
    } else if (!dynamicAnchorsPass) {
      state.shellHoldReason = "WAITING_HTML_MALE_ROUTE_SHELL_ANCHORS";
    } else {
      state.shellHoldReason = "NONE";
    }

    if (refs.mount) {
      refs.mount.dataset.hearthIndexJsAnchorAudit = "true";
      refs.mount.dataset.hearthIndexJsContract = CONTRACT;
      refs.mount.dataset.hearthCanvasCarrierHostReady = String(state.carrierHostReady);
      refs.mount.dataset.hearthCarrierHostPacketReady = String(state.carrierHostPacketReady);
      refs.mount.dataset.hearthIndexCockpitControlEventsBlockedFromCanvas = "true";
      refs.mount.dataset.generatedImage = "false";
      refs.mount.dataset.graphicBox = "false";
      refs.mount.dataset.webgl = "false";
      refs.mount.dataset.visualPassClaimed = "false";
    }

    bindControlSurfaceEventShield("audit-shell-anchors");

    updateCarrierHostAdmissibility(`shell-audit:${reason}`);
    updateDataset();

    return {
      reason,
      detected,
      selected,
      accepted,
      currentV2_1,
      matchedMale,
      safeTransitional,
      recognizedContract,
      dynamicAnchorsPass,
      missingAnchors,
      selectionMode,
      shellContract
    };
  }

  function applyReleaseLaw() {
    const shell = auditShellAnchors("apply-release-law");

    state.runtimeReleaseRequestable = Boolean(shell.accepted);
    state.runtimeReleaseAuthorized = Boolean(shell.accepted);

    if (state.runtimeReleaseAuthorized) {
      if (!state.runtimeReleaseStarted) {
        state.runtimeReleaseHeldReason = "NONE_RUNTIME_RELEASE_AUTHORIZED";
        state.firstFailedCoordinate = state.shellControlsBound ? "WAITING_RUNTIME_RELEASE_START" : "WAITING_HTML_SHELL_CONTROLS_BOUND";
        state.recommendedNextFile = FILE;
        state.recommendedNextRenewalTarget = FILE;
        state.postgameStatus = "HTML_SHELL_ACCEPTED_RUNTIME_RELEASE_AUTHORIZED";
      }

      state.activeNews = "EAST";
      state.activeFibonacci = state.runtimeReleaseStarted ? "F8" : "F5";
      state.activeFibonacciRank = state.runtimeReleaseStarted ? 8 : 5;
      state.activeStageId = state.runtimeReleaseStarted ? "F8_RUNTIME_RELEASE_ACTIVE" : "F5_HTML_SHELL_ACCEPTED";
      state.activeGearId = state.runtimeReleaseStarted ? "hearth-index-js-runtime-release-f8" : "hearth-index-js-html-shell-accepted-f5";
      state.activeProgress = Math.max(state.activeProgress, state.runtimeReleaseStarted ? 48 : 34);
    } else {
      state.runtimeReleaseHeldReason = state.shellHoldReason;
      state.firstFailedCoordinate = state.shellHoldReason;
      state.recommendedNextFile = HTML_FILE;
      state.recommendedNextRenewalTarget = HTML_FILE;
      state.postgameStatus = state.shellHoldReason;
      state.activeNews = "EAST";
      state.activeFibonacci = shell.dynamicAnchorsPass ? "F2" : "F1";
      state.activeFibonacciRank = shell.dynamicAnchorsPass ? 2 : 1;
      state.activeStageId = shell.dynamicAnchorsPass ? "F2_DYNAMIC_HTML_ANCHORS_PRESENT" : "F1_HTML_SHELL_ANCHOR_AUDIT";
      state.activeGearId = shell.dynamicAnchorsPass ? "hearth-index-js-html-anchors-f2" : "hearth-index-js-html-anchor-audit-f1";
      state.activeProgress = shell.dynamicAnchorsPass ? 22 : 12;
    }

    updateCarrierHostAdmissibility("apply-release-law");
    updateDataset();
    return state.runtimeReleaseAuthorized;
  }

  function composeCarrierHostPacket() {
    refreshRefs();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "INDEX_JS_HTML_SHELL_CARRIER_HOST_PACKET",
      sourceFile: FILE,
      htmlFile: HTML_FILE,
      targetFile: CANVAS_PARENT_FILE,
      route: ROUTE,
      pairRole: state.pairRole,
      pairedRouteConductorFile: PAIRED_ROUTE_CONDUCTOR_FILE,

      htmlOwnsVisibleShell: true,
      indexJsCreatesVisibleShell: false,
      indexJsCreatesFallbackCss: false,
      indexJsCreatesShellDom: false,
      indexJsCreatesRuntimeScriptsOnly: true,

      ownsRouteAnchors: false,
      ownsMountHost: false,
      ownsControlsCreation: false,
      ownsControlBinding: true,
      indexOwnsControlBinding: true,
      routeConductorOwnsControlBinding: false,
      ownsRuntimeScriptRelease: true,
      ownsCanvasCarrierHostPacket: true,
      ownsCarrierHostAdmissibility: true,

      indexControlSurfaceEarlyActivationShieldActive: true,
      indexControlSurfaceEventShieldActive: true,
      controlPointerTouchShieldActive: true,
      controlCapturePhaseShieldActive: true,
      multiLayerControlCaptureShieldActive: true,
      terminalActivationExecutionActive: true,
      clickOnlyActivationAvoided: true,
      runtimeStageInterceptionPrevented: true,
      canvasGestureLeakBlocked: true,
      duplicateTouchClickSuppressionActive: true,
      physicalActivationWindowSuppressionActive: true,
      keyboardActivationPreserved: true,
      currentHtmlContractRecognized: state.currentHtmlContractRecognized,

      mountSelector: "#hearthCanvasMount",
      mountPresent: Boolean(refs.mount),
      cockpitPresent: Boolean(refs.cockpit),
      statusNodePresent: Boolean(refs.status),
      receiptPanelPresent: Boolean(refs.receiptPanel),
      routeShellAccepted: state.shellAccepted,
      dynamicAnchorsPass: state.dynamicAnchorsPass,
      shellControlsBound: state.shellControlsBound,
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

  function computeCarrierHostAdmissibility() {
    const ready = Boolean(
      state.shellAccepted &&
      state.dynamicAnchorsPass &&
      state.mountPresent &&
      state.carrierHostReady &&
      state.carrierHostPacketReady &&
      state.shellControlsBound &&
      state.controlSurfaceShieldBound &&
      state.runtimeReleaseAuthorized &&
      state.runtimeReleaseComplete
    );

    const holdReason = ready
      ? "NONE_CARRIER_HOST_ADMISSIBILITY_READY"
      : !state.shellAccepted
        ? state.shellHoldReason || "WAITING_HTML_MALE_ROUTE_SHELL_ANCHORS"
        : !state.dynamicAnchorsPass
          ? "WAITING_DYNAMIC_HTML_ANCHORS"
          : !state.mountPresent || !state.carrierHostReady || !state.carrierHostPacketReady
            ? "WAITING_CARRIER_HOST_PACKET"
            : !state.shellControlsBound
              ? "WAITING_HTML_SHELL_CONTROLS_BOUND"
              : !state.controlSurfaceShieldBound
                ? "WAITING_INDEX_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD"
                : !state.runtimeReleaseAuthorized
                  ? "WAITING_RUNTIME_RELEASE_AUTHORIZATION"
                  : !state.runtimeReleaseComplete
                    ? "WAITING_RUNTIME_RELEASE_COMPLETION"
                    : "WAITING_CARRIER_HOST_ADMISSIBILITY";

    return { ready, holdReason };
  }

  function composeCarrierHostAdmissibilityPacket() {
    const computed = computeCarrierHostAdmissibility();
    const carrierPacket = composeCarrierHostPacket();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "INDEX_JS_TWO_FILE_CARRIER_HOST_ADMISSIBILITY_PACKET",
      sourceFile: FILE,
      targetFile: PAIRED_ROUTE_CONDUCTOR_FILE,
      destinationFile: PAIRED_ROUTE_CONDUCTOR_FILE,
      route: ROUTE,

      carrierHostAdmissibilityActive: true,
      carrierHostAdmissibilityReady: computed.ready,
      carrierHostAdmissibilityPacketReady: computed.ready,
      carrierHostAdmissibilityHoldReason: computed.holdReason,
      handoffToRouteConductor: computed.ready,
      indexMacroWestCandidateReady: computed.ready,
      routeConductorHandoffPacketReady: computed.ready,

      shellDetected: state.shellDetected,
      shellSelected: state.shellSelected,
      shellAccepted: state.shellAccepted,
      shellSelectionMode: state.shellSelectionMode,
      currentHtmlContractRecognized: state.currentHtmlContractRecognized,
      dynamicAnchorsPass: state.dynamicAnchorsPass,
      missingAnchors: state.missingAnchors.slice(),
      shellControlsBound: state.shellControlsBound,

      indexControlSurfaceEarlyActivationShieldActive: true,
      indexControlSurfaceEventShieldActive: true,
      indexOwnsControlBinding: true,
      routeConductorOwnsControlBinding: false,
      controlPointerTouchShieldActive: true,
      controlCapturePhaseShieldActive: true,
      multiLayerControlCaptureShieldActive: true,
      terminalActivationExecutionActive: true,
      clickOnlyActivationAvoided: true,
      runtimeStageInterceptionPrevented: true,
      canvasGestureLeakBlocked: true,
      duplicateTouchClickSuppressionActive: true,
      physicalActivationWindowSuppressionActive: true,
      keyboardActivationPreserved: true,
      htmlRebuildRequired: false,
      routeConductorRebuildRequired: false,
      canvasRebuildRequired: false,
      runtimeTableRebuildRequired: false,

      mountPresent: state.mountPresent,
      cockpitPresent: state.cockpitPresent,
      statusNodePresent: state.statusNodePresent,
      receiptPanelPresent: state.receiptPanelPresent,
      portalPresent: state.portalPresent,
      carrierHostReady: state.carrierHostReady,
      carrierHostPacketReady: state.carrierHostPacketReady,
      carrierHostPacket: carrierPacket,

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

      newsAlignmentActive: true,
      newsAlignmentProtocolActive: true,
      fibonacciSynchronizationActive: true,
      fibonacciSynchronizationMetricActive: true,
      activeNews: state.activeNews,
      activeFibonacci: state.activeFibonacci,
      activeFibonacciRank: state.activeFibonacciRank,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      oneActiveGearAtATime: true,

      f13CarrierHostAvailable: state.f13CarrierHostAvailable,
      f13CanvasDelegated: true,
      f13CanvasEvidenceOwnedByCanvas: true,
      canvasParentObserved: state.canvasParentObserved,
      canvasParentApiReady: state.canvasParentApiReady,
      canvasPreReleaseCarrierRequested: state.canvasPreReleaseCarrierRequested,
      canvasPreReleaseCarrierObserved: state.canvasPreReleaseCarrierObserved,
      canvasPreReleaseCarrierAccepted: state.canvasPreReleaseCarrierAccepted,
      canvasPreReleaseCarrierSafeForWest: state.canvasPreReleaseCarrierSafeForWest,
      canvasCarrierHeldReason: state.canvasCarrierHeldReason,

      canvasReleaseAuthorized: false,
      canvasParentCarrierSafe: false,
      f13CanvasEvidenceComplete: false,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21ClaimedByIndex: false,
      readyTextAllowed: false,
      readyTextClaimedByIndex: false,

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

      firstFailedCoordinate: computed.ready ? "NONE_CARRIER_HOST_ADMISSIBILITY_READY" : computed.holdReason,
      recommendedNextFile: computed.ready ? PAIRED_ROUTE_CONDUCTOR_FILE : state.recommendedNextFile,
      recommendedNextRenewalTarget: computed.ready ? PAIRED_ROUTE_CONDUCTOR_FILE : state.recommendedNextRenewalTarget,
      postgameStatus: computed.ready ? "CARRIER_HOST_ADMISSIBILITY_READY_FOR_ROUTE_CONDUCTOR" : computed.holdReason,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: nowIso()
    };
  }

  function computeFibonacciSynchronization() {
    const gates = [
      Boolean(state.newsAlignmentActive),
      Boolean(state.activeFibonacci),
      Boolean(state.shellDetected),
      Boolean(state.currentHtmlContractRecognized),
      Boolean(state.shellAccepted),
      Boolean(state.shellControlsBound),
      Boolean(state.controlSurfaceShieldBound),
      Boolean(state.runtimeReleaseAuthorized),
      Boolean(state.runtimeReleaseComplete),
      Boolean(state.carrierHostAdmissibilityReady),
      Boolean(!state.f21ClaimedByIndex && !state.readyTextAllowed && !state.visualPassClaimed)
    ];

    const expected = gates.length;
    const satisfied = gates.filter(Boolean).length;
    const score = expected ? Math.round((satisfied / expected) * 100) : 0;

    state.fibonacciSynchronizationExpected = expected;
    state.fibonacciSynchronizationSatisfied = satisfied;
    state.fibonacciSynchronizationScore = score;
    state.fibonacciSynchronizationPassed = satisfied === expected;
    state.fibonacciSynchronizationDegraded = satisfied >= Math.max(1, expected - 2) && satisfied < expected;

    return {
      expected,
      satisfied,
      score,
      passed: state.fibonacciSynchronizationPassed,
      degraded: state.fibonacciSynchronizationDegraded
    };
  }

  function updateCarrierHostAdmissibility(reason = "carrier-host-admissibility-refresh") {
    const computed = computeCarrierHostAdmissibility();

    state.carrierHostAdmissibilityReady = computed.ready;
    state.carrierHostAdmissibilityPacketReady = computed.ready;
    state.carrierHostAdmissibilityHoldReason = computed.holdReason;
    state.handoffToRouteConductor = computed.ready;
    state.indexMacroWestCandidateReady = computed.ready;
    state.routeConductorHandoffPacketReady = computed.ready;

    if (computed.ready) {
      state.firstFailedCoordinate = "NONE_CARRIER_HOST_ADMISSIBILITY_READY";
      state.recommendedNextFile = PAIRED_ROUTE_CONDUCTOR_FILE;
      state.recommendedNextRenewalTarget = PAIRED_ROUTE_CONDUCTOR_FILE;
      state.postgameStatus = "CARRIER_HOST_ADMISSIBILITY_READY_FOR_ROUTE_CONDUCTOR";
      state.activeNews = "SOUTH";
      state.activeFibonacci = "F8";
      state.activeFibonacciRank = 8;
      state.activeStageId = "F8_CARRIER_HOST_ADMISSIBILITY_READY";
      state.activeGearId = "hearth-index-js-carrier-host-admissibility-f8";
      state.activeProgress = Math.max(state.activeProgress, 92);
    } else if (state.shellAccepted && state.runtimeReleaseStarted && !state.runtimeReleaseComplete) {
      state.firstFailedCoordinate = "WAITING_RUNTIME_RELEASE_COMPLETION";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.postgameStatus = "RUNTIME_RELEASE_IN_PROGRESS";
    } else if (state.shellAccepted && !state.shellControlsBound) {
      state.firstFailedCoordinate = "WAITING_HTML_SHELL_CONTROLS_BOUND";
      state.recommendedNextFile = HTML_FILE;
      state.recommendedNextRenewalTarget = HTML_FILE;
      state.postgameStatus = "WAITING_HTML_SHELL_CONTROLS_BOUND";
    } else if (state.shellAccepted && !state.controlSurfaceShieldBound) {
      state.firstFailedCoordinate = "WAITING_INDEX_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.postgameStatus = "WAITING_INDEX_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD";
    } else if (!state.shellAccepted) {
      state.firstFailedCoordinate = state.shellHoldReason || "WAITING_HTML_MALE_ROUTE_SHELL_ANCHORS";
      state.recommendedNextFile = HTML_FILE;
      state.recommendedNextRenewalTarget = HTML_FILE;
      state.postgameStatus = state.firstFailedCoordinate;
    }

    state.lastCarrierHostAdmissibilityPacket = composeCarrierHostAdmissibilityPacket();
    computeFibonacciSynchronization();
    state.updatedAt = nowIso();

    publishCarrierHostAdmissibility(reason);
    updateDataset();

    return state.lastCarrierHostAdmissibilityPacket;
  }

  function publishCarrierHostAdmissibility(_reason = "publish-carrier-host-admissibility") {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    const packet = state.lastCarrierHostAdmissibilityPacket || composeCarrierHostAdmissibilityPacket();

    root.HEARTH.carrierHostAdmissibility = packet;
    root.HEARTH.indexCarrierHostAdmissibility = packet;
    root.HEARTH.indexCarrierHostAdmissibilityReceipt = packet;
    root.HEARTH.carrierHostAdmissibilityReady = packet.carrierHostAdmissibilityReady;
    root.HEARTH.indexMacroWestCandidateReady = packet.indexMacroWestCandidateReady;
    root.HEARTH.handoffToRouteConductor = packet.handoffToRouteConductor;

    root.DEXTER_LAB.hearthCarrierHostAdmissibility = packet;
    root.DEXTER_LAB.hearthIndexCarrierHostAdmissibility = packet;

    root.HEARTH_INDEX_CARRIER_HOST_ADMISSIBILITY = packet;
    root.HEARTH_INDEX_CARRIER_HOST_ADMISSIBILITY_RECEIPT = packet;
    root.HEARTH_INDEX_CARRIER_HOST_ADMISSIBILITY_READY = packet.carrierHostAdmissibilityReady;
    root.HEARTH_INDEX_HANDOFF_TO_ROUTE_CONDUCTOR = packet.handoffToRouteConductor;
    root.HEARTH_INDEX_MACRO_WEST_CANDIDATE_READY = packet.indexMacroWestCandidateReady;

    state.carrierHostAdmissibilityPacketPublished = true;
  }

  function findCanvasParentApi() {
    const canvasDef = RUNTIME_FILES.find((item) => item.key === "canvasParent");
    return canvasDef ? firstGlobal(canvasDef.globals) : null;
  }

  function normalizeCanvasCarrierReceipt(result, apiObject) {
    const receipt = isObject(result) && (
      result.contract ||
      result.receipt ||
      result.structuralCarrierSafeForCanvasRelease !== undefined ||
      result.preReleaseStructuralCarrierSafe !== undefined
    )
      ? result
      : readReceipt(apiObject) || {};

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
        ? "NONE_CANVAS_PRE_RELEASE_CARRIER_SAFE_FOR_WEST_OBSERVED_ONLY"
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
    auditShellAnchors(reason);

    if (!state.shellAccepted || !refs.mount) {
      state.canvasPreReleaseCarrierRequested = false;
      state.canvasPreReleaseCarrierObserved = false;
      state.canvasPreReleaseCarrierAccepted = false;
      state.canvasPreReleaseCarrierSafeForWest = false;
      state.canvasCarrierHeldReason = state.shellHoldReason || "WAITING_HTML_MALE_ROUTE_SHELL_ANCHORS";
      state.f13CarrierHostAvailable = Boolean(refs.mount);
      updateCarrierHostAdmissibility("canvas-pre-release-held-shell");
      updateDataset();
      return false;
    }

    const canvasApi = findCanvasParentApi();

    state.canvasParentObserved = Boolean(canvasApi);
    state.canvasParentApiReady = Boolean(canvasApi && (
      isFunction(canvasApi.ensurePreReleaseStructuralCarrier) ||
      isFunction(canvasApi.ensureCarrier) ||
      isFunction(canvasApi.mount) ||
      isFunction(canvasApi.boot) ||
      isFunction(canvasApi.bootCooperative) ||
      isFunction(canvasApi.getReceipt)
    ));

    if (!canvasApi || !state.canvasParentApiReady) {
      state.canvasPreReleaseCarrierRequested = false;
      state.canvasPreReleaseCarrierObserved = false;
      state.canvasPreReleaseCarrierAccepted = false;
      state.canvasPreReleaseCarrierSafeForWest = false;
      state.canvasCarrierHeldReason = "WAITING_CANVAS_PARENT_API_OBSERVED_ONLY";
      state.f13CarrierHostAvailable = Boolean(refs.mount);
      updateCarrierHostAdmissibility("canvas-parent-api-not-ready-observed-only");
      updateDataset();
      return false;
    }

    const packet = composeCarrierHostPacket();
    let result = null;

    state.canvasPreReleaseCarrierRequested = true;

    try {
      const input = {
        mount: refs.mount,
        container: refs.mount,
        target: refs.mount,
        route: ROUTE,
        preReleaseOnly: true,
        carrierHostPacket: packet,
        sourceFile: FILE,
        htmlFile: HTML_FILE,
        requestedBy: CONTRACT,
        releaseAuthorized: false,
        canvasReleaseAuthorized: false,
        westReleaseObserved: false,
        childWorkAuthorized: false,
        visualPassClaimed: false
      };

      if (isFunction(canvasApi.ensurePreReleaseStructuralCarrier)) {
        result = canvasApi.ensurePreReleaseStructuralCarrier(input);
      } else if (isFunction(canvasApi.ensureCarrier)) {
        result = canvasApi.ensureCarrier(input);
      } else if (isFunction(canvasApi.mount)) {
        result = canvasApi.mount(input);
      } else if (isFunction(canvasApi.getReceipt)) {
        result = canvasApi.getReceipt();
      }
    } catch (error) {
      state.runtimeErrors.push({
        key: "canvasParentPreReleaseCarrier",
        file: CANVAS_PARENT_FILE,
        required: false,
        message: error && error.message ? error.message : String(error),
        at: nowIso()
      });

      state.canvasCarrierHeldReason = "CANVAS_PARENT_PRE_RELEASE_CARRIER_REQUEST_FAILED_OBSERVED_ONLY";
      updateCarrierHostAdmissibility("canvas-pre-release-request-error-observed-only");
      updateDataset();
      return false;
    }

    const normalized = normalizeCanvasCarrierReceipt(result, canvasApi);

    state.canvasParentReceipt = clonePlain(normalized.receipt);
    state.canvasCarrierReceiptObserved = Boolean(normalized.receipt && (normalized.receipt.contract || normalized.receipt.receipt));
    state.canvasPreReleaseCarrierObserved = normalized.observed;
    state.canvasPreReleaseCarrierAccepted = normalized.safe;
    state.canvasPreReleaseCarrierSafeForWest = normalized.safe;
    state.canvasCarrierHeldReason = normalized.heldReason;
    state.f13CarrierHostAvailable = Boolean(refs.mount);

    updateCarrierHostAdmissibility("canvas-pre-release-observed-only");
    updateDataset();
    return normalized.safe;
  }

  function bindControls() {
    auditShellAnchors("bind-controls");

    if (!state.shellAccepted) {
      state.shellControlsBound = false;
      updateCarrierHostAdmissibility("bind-controls-shell-not-accepted");
      updateDataset();
      return false;
    }

    bindControlSurfaceEventShield("bind-controls");

    state.shellControlsBound = Boolean(refs.copyButton && refs.toggleButton && refs.inspectButton && refs.collapseButton);

    if (state.shellControlsBound && state.shellAccepted && !state.runtimeReleaseStarted) {
      state.activeFibonacci = "F3";
      state.activeFibonacciRank = 3;
      state.activeStageId = "F3_HTML_SHELL_CONTROLS_BOUND_AND_SHIELDED";
      state.activeGearId = "hearth-index-js-controls-shielded-f3";
      state.activeProgress = Math.max(state.activeProgress, 28);
      state.firstFailedCoordinate = state.runtimeReleaseAuthorized ? "WAITING_RUNTIME_RELEASE_START" : "WAITING_RUNTIME_RELEASE_AUTHORIZATION";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.postgameStatus = "HTML_SHELL_CONTROLS_BOUND_WITH_EARLY_ACTIVATION_SHIELD";
    }

    updateCarrierHostAdmissibility("bind-controls-complete");
    updateDataset();
    return state.shellControlsBound;
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

    updateCarrierHostAdmissibility("runtime-hold");
    updateDataset();
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
        existing.dataset.hearthIndexJsObserved = CONTRACT;

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
      script.dataset.hearthIndexJsRuntimeRelease = "true";
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
          auditShellAnchors(`script-loaded-${def.key}`);
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
    state.activeGearId = "hearth-index-js-runtime-release-f8";
    state.activeProgress = 44;
    state.postgameStatus = "RUNTIME_RELEASE_STARTED";
    state.firstFailedCoordinate = "RUNTIME_RELEASE_IN_PROGRESS";
    updateCarrierHostAdmissibility("runtime-release-started");
    schedulePublish("runtime-release-started");

    for (let i = 0; i < RUNTIME_FILES.length; i += 1) {
      const def = RUNTIME_FILES[i];

      state.currentRuntimeKey = def.key;
      state.currentRuntimeFile = def.file;
      state.activeNews = def.news;
      state.activeFibonacci = def.fibonacci;
      state.activeFibonacciRank = def.fibonacci;
      state.activeStageId = `${def.fibonacci}_${def.key}`;
      state.activeGearId = `hearth-index-js-${def.key}`;
      state.activeProgress = clamp(46 + i * 7, 46, 88);
      state.postgameStatus = `LOADING_${def.key.toUpperCase()}`;
      updateCarrierHostAdmissibility(`loading-${def.key}`);
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
          requestCanvasPreReleaseCarrier("canvas-parent-loaded-before-west-admissibility-observed-only");
        }

        auditShellAnchors(`runtime-loaded-${def.key}`);
        bindControls();
        updateCarrierHostAdmissibility(`runtime-loaded-${def.key}`);
        schedulePublish(`runtime-loaded-${def.key}`);
      }

      await new Promise((resolve) => root.setTimeout(resolve, 80));
    }

    requestCanvasPreReleaseCarrier("runtime-queue-settled-carrier-proof-refresh-observed-only");

    if (state.runtimeErrors.some((item) => item.required === true)) {
      state.runtimeReleaseComplete = false;
      state.runtimeHeld = true;
      state.activeNews = "EAST";
      state.activeFibonacci = "F8";
      state.activeFibonacciRank = 8;
      state.activeStageId = "F8_RUNTIME_RELEASE_HELD_REQUIRED_FILE";
      state.activeGearId = "hearth-index-js-runtime-held-f8";
      state.activeProgress = 58;
      state.postgameStatus = "RUNTIME_RELEASE_HELD_REQUIRED_FILE";
      state.firstFailedCoordinate = "RUNTIME_REQUIRED_FILE_LOAD_FAILED";
      state.recommendedNextFile = state.currentRuntimeFile || NORTH_RUNTIME_FILE;
      state.recommendedNextRenewalTarget = state.recommendedNextFile;
    } else {
      state.runtimeReleaseComplete = true;
      state.runtimeHeld = state.runtimeErrors.length > 0;
      state.runtimeReleaseHeldReason = state.runtimeErrors.length > 0
        ? "RUNTIME_RELEASE_COMPLETE_WITH_OPTIONAL_HOLDS"
        : "NONE_RUNTIME_RELEASE_COMPLETE";

      state.activeNews = "SOUTH";
      state.activeFibonacci = "F8";
      state.activeFibonacciRank = 8;
      state.activeStageId = "F8_CARRIER_HOST_ADMISSIBILITY_READY";
      state.activeGearId = "hearth-index-js-carrier-host-admissibility-f8";
      state.activeProgress = 92;
      state.firstFailedCoordinate = "NONE_CARRIER_HOST_ADMISSIBILITY_READY";
      state.recommendedNextFile = PAIRED_ROUTE_CONDUCTOR_FILE;
      state.recommendedNextRenewalTarget = PAIRED_ROUTE_CONDUCTOR_FILE;
      state.postgameStatus = "CARRIER_HOST_ADMISSIBILITY_READY_FOR_ROUTE_CONDUCTOR";
    }

    state.settled = true;
    state.booted = true;
    updateCarrierHostAdmissibility("runtime-release-settled");
    schedulePublish("runtime-release-settled");

    return getReceipt();
  }

  function updateVisualShell(message = "") {
    refreshRefs();

    if (refs.stageLabel) refs.stageLabel.textContent = `${state.activeFibonacci} · ${state.activeStageId}`;

    if (refs.heartbeatText) {
      refs.heartbeatText.textContent = message || [
        `htmlShell=${state.shellAccepted}`,
        `htmlContract=${state.currentHtmlContractRecognized}`,
        `controls=${state.shellControlsBound}`,
        `shield=${state.controlSurfaceShieldBound}`,
        `runtime=${state.runtimeReleaseComplete}`,
        `carrierHost=${state.carrierHostReady}`,
        `admissibility=${state.carrierHostAdmissibilityReady}`,
        "f21=north-only"
      ].join(" · ");
    }

    if (refs.latestEvent) refs.latestEvent.textContent = `latest=${state.postgameStatus}`;
    if (refs.progressFill) refs.progressFill.style.width = `${clamp(state.activeProgress, 0, 100)}%`;
    if (refs.progressPercent) refs.progressPercent.textContent = `${Math.round(clamp(state.activeProgress, 0, 100))}%`;

    if (refs.cockpit) {
      refs.cockpit.dataset.hearthIndexJsActive = "true";
      refs.cockpit.dataset.hearthIndexJsContract = CONTRACT;
      refs.cockpit.dataset.hearthShellAccepted = String(state.shellAccepted);
      refs.cockpit.dataset.hearthCurrentHtmlContractRecognized = String(state.currentHtmlContractRecognized);
      refs.cockpit.dataset.hearthIndexControlSurfaceEarlyActivationShieldActive = "true";
      refs.cockpit.dataset.hearthIndexControlSurfaceEventShieldActive = "true";
      refs.cockpit.dataset.hearthIndexControlPointerTouchShieldActive = "true";
      refs.cockpit.dataset.hearthIndexControlCapturePhaseShieldActive = "true";
      refs.cockpit.dataset.hearthRuntimeStageInterceptionPrevented = "true";
      refs.cockpit.dataset.hearthCanvasGestureLeakBlocked = "true";
      refs.cockpit.dataset.hearthDuplicateTouchClickSuppressionActive = "true";
      refs.cockpit.dataset.hearthKeyboardActivationPreserved = "true";
      refs.cockpit.dataset.hearthRuntimeReleaseComplete = String(state.runtimeReleaseComplete);
      refs.cockpit.dataset.hearthCarrierHostAdmissibilityReady = String(state.carrierHostAdmissibilityReady);
      refs.cockpit.dataset.hearthIndexHandoffToRouteConductor = String(state.handoffToRouteConductor);
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

    setDataset("hearthIndexJsLoaded", "true");
    setDataset("hearthIndexJsContract", CONTRACT);
    setDataset("hearthIndexJsReceipt", RECEIPT);
    setDataset("hearthIndexJsPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthIndexJsBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthIndexJsVersion", VERSION);
    setDataset("hearthIndexJsFile", FILE);
    setDataset("hearthIndexJsRoute", ROUTE);
    setDataset("hearthIndexJsParserRepairActive", "true");
    setDataset("hearthIndexJsApiRedeclarationRepairActive", "true");

    setDataset("hearthIndexControlSurfaceEarlyActivationShieldActive", "true");
    setDataset("hearthIndexControlSurfaceEventShieldActive", "true");
    setDataset("hearthIndexOwnsControlBinding", "true");
    setDataset("hearthRouteConductorOwnsControlBinding", "false");
    setDataset("hearthControlPointerTouchShieldActive", "true");
    setDataset("hearthControlCapturePhaseShieldActive", "true");
    setDataset("hearthMultiLayerControlCaptureShieldActive", "true");
    setDataset("hearthTerminalActivationExecutionActive", "true");
    setDataset("hearthClickOnlyActivationAvoided", "true");
    setDataset("hearthRuntimeStageInterceptionPrevented", "true");
    setDataset("hearthCanvasGestureLeakBlocked", "true");
    setDataset("hearthDuplicateTouchClickSuppressionActive", "true");
    setDataset("hearthPhysicalActivationWindowSuppressionActive", "true");
    setDataset("hearthKeyboardActivationPreserved", "true");
    setDataset("hearthCurrentHtmlContractRecognized", state.currentHtmlContractRecognized);
    setDataset("hearthHtmlRebuildRequired", "false");
    setDataset("hearthRouteConductorRebuildRequired", "false");
    setDataset("hearthCanvasRebuildRequired", "false");
    setDataset("hearthRuntimeTableRebuildRequired", "false");
    setDataset("hearthControlShieldInterceptCount", state.controlShieldInterceptCount);
    setDataset("hearthControlShieldTerminalActivationCount", state.controlShieldTerminalActivationCount);
    setDataset("hearthControlShieldClickSuppressionCount", state.controlShieldClickSuppressionCount);
    setDataset("hearthControlShieldDuplicateSuppressionCount", state.controlShieldDuplicateSuppressionCount);
    setDataset("hearthControlShieldKeyboardActivationCount", state.controlShieldKeyboardActivationCount);
    setDataset("hearthControlShieldLastActionName", state.controlShieldLastActionName);
    setDataset("hearthControlShieldLastEventType", state.controlShieldLastEventType);

    setDataset("hearthIndexJsHtmlFile", HTML_FILE);
    setDataset("hearthHtmlOwnsVisibleShell", "true");
    setDataset("hearthIndexJsCreatesVisibleShell", "false");
    setDataset("hearthIndexJsCreatesFallbackCss", "false");
    setDataset("hearthIndexJsCreatesShellDom", "false");
    setDataset("hearthIndexJsCreatesRuntimeScriptsOnly", "true");

    setDataset("hearthPairRole", state.pairRole);
    setDataset("hearthPairedRouteConductorFile", PAIRED_ROUTE_CONDUCTOR_FILE);

    setDataset("hearthIndexJsOwnsRouteAnchors", "false");
    setDataset("hearthIndexJsOwnsMountHost", "false");
    setDataset("hearthIndexJsOwnsControlsCreation", "false");
    setDataset("hearthIndexJsOwnsControlBinding", "true");
    setDataset("hearthIndexJsOwnsRuntimeScriptRelease", "true");
    setDataset("hearthIndexJsOwnsCanvasCarrierHostPacket", "true");
    setDataset("hearthIndexJsOwnsCarrierHostAdmissibility", "true");
    setDataset("hearthIndexJsOwnsCanvasStructuralCarrierTruth", "false");
    setDataset("hearthIndexJsOwnsCanvasReleaseTruth", "false");
    setDataset("hearthIndexJsOwnsCanvasDrawing", "false");
    setDataset("hearthIndexJsOwnsMaterialTruth", "false");
    setDataset("hearthIndexJsOwnsPlanetTruth", "false");
    setDataset("hearthIndexJsOwnsF21", "false");
    setDataset("hearthIndexJsOwnsReadyText", "false");
    setDataset("hearthIndexJsOwnsFinalVisualPassClaim", "false");

    setDataset("hearthCurrentHtmlContract", CURRENT_HTML_CONTRACT);
    setDataset("hearthExpectedHtmlContract", EXPECTED_HTML_CONTRACT);
    setDataset("hearthCurrentSafeHtmlContract", CURRENT_SAFE_HTML_CONTRACT);
    setDataset("hearthShellContract", state.shellContract);
    setDataset("hearthShellDetected", state.shellDetected);
    setDataset("hearthShellSelected", state.shellSelected);
    setDataset("hearthShellAccepted", state.shellAccepted);
    setDataset("hearthShellSelectionMode", state.shellSelectionMode);
    setDataset("hearthShellHoldReason", state.shellHoldReason);
    setDataset("hearthHtmlAnchorAuditActive", "true");
    setDataset("hearthDynamicAnchorsPass", state.dynamicAnchorsPass);
    setDataset("hearthMissingAnchors", state.missingAnchors.join(","));
    setDataset("hearthShellControlsBound", state.shellControlsBound);

    setDataset("hearthMountPresent", state.mountPresent);
    setDataset("hearthCockpitPresent", state.cockpitPresent);
    setDataset("hearthStatusNodePresent", state.statusNodePresent);
    setDataset("hearthReceiptPanelPresent", state.receiptPanelPresent);
    setDataset("hearthCarrierHostReady", state.carrierHostReady);
    setDataset("hearthCarrierHostPacketReady", state.carrierHostPacketReady);

    setDataset("hearthCarrierHostAdmissibilityActive", "true");
    setDataset("hearthCarrierHostAdmissibilityReady", state.carrierHostAdmissibilityReady);
    setDataset("hearthCarrierHostAdmissibilityPacketReady", state.carrierHostAdmissibilityPacketReady);
    setDataset("hearthCarrierHostAdmissibilityPacketPublished", state.carrierHostAdmissibilityPacketPublished);
    setDataset("hearthCarrierHostAdmissibilityHoldReason", state.carrierHostAdmissibilityHoldReason);
    setDataset("hearthIndexHandoffToRouteConductor", state.handoffToRouteConductor);
    setDataset("hearthIndexMacroWestCandidateReady", state.indexMacroWestCandidateReady);
    setDataset("hearthIndexRouteConductorHandoffPacketReady", state.routeConductorHandoffPacketReady);

    setDataset("hearthCanvasParentObserved", state.canvasParentObserved);
    setDataset("hearthCanvasParentApiReady", state.canvasParentApiReady);
    setDataset("hearthCanvasParentLoadedBeforeWest", state.canvasParentLoadedBeforeWest);
    setDataset("hearthCanvasPreReleaseCarrierRequested", state.canvasPreReleaseCarrierRequested);
    setDataset("hearthCanvasPreReleaseCarrierObserved", state.canvasPreReleaseCarrierObserved);
    setDataset("hearthCanvasPreReleaseCarrierAccepted", state.canvasPreReleaseCarrierAccepted);
    setDataset("hearthCanvasPreReleaseCarrierSafeForWest", state.canvasPreReleaseCarrierSafeForWest);
    setDataset("hearthCanvasCarrierHeldReason", state.canvasCarrierHeldReason);

    setDataset("hearthRuntimeReleaseRequestable", state.runtimeReleaseRequestable);
    setDataset("hearthRuntimeReleaseRequested", state.runtimeReleaseRequested);
    setDataset("hearthRuntimeReleaseAuthorized", state.runtimeReleaseAuthorized);
    setDataset("hearthRuntimeReleaseStarted", state.runtimeReleaseStarted);
    setDataset("hearthRuntimeReleaseComplete", state.runtimeReleaseComplete);
    setDataset("hearthRuntimeHeld", state.runtimeHeld);
    setDataset("hearthRuntimeReleaseHeldReason", state.runtimeReleaseHeldReason);
    setDataset("hearthRuntimeLoaded", state.runtimeLoaded.join(","));
    setDataset("hearthRuntimeHeldFiles", state.runtimeHeldFiles.join(","));
    setDataset("hearthCurrentRuntimeKey", state.currentRuntimeKey);
    setDataset("hearthCurrentRuntimeFile", state.currentRuntimeFile);

    setDataset("hearthNewsAlignmentActive", "true");
    setDataset("hearthNewsAlignmentProtocolActive", "true");
    setDataset("hearthFibonacciSynchronizationActive", "true");
    setDataset("hearthFibonacciSynchronizationMetricActive", "true");
    setDataset("hearthFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("hearthFibonacciSynchronizationSatisfied", state.fibonacciSynchronizationSatisfied);
    setDataset("hearthFibonacciSynchronizationExpected", state.fibonacciSynchronizationExpected);
    setDataset("hearthFibonacciSynchronizationPassed", state.fibonacciSynchronizationPassed);
    setDataset("hearthFibonacciSynchronizationDegraded", state.fibonacciSynchronizationDegraded);
    setDataset("hearthMacroCycle1", MACRO_CYCLE_1);
    setDataset("hearthMacroCycle2", MACRO_CYCLE_2);
    setDataset("hearthActiveNews", state.activeNews);
    setDataset("hearthActiveFibonacci", state.activeFibonacci);
    setDataset("hearthActiveFibonacciRank", state.activeFibonacciRank);
    setDataset("hearthActiveStageId", state.activeStageId);
    setDataset("hearthActiveGearId", state.activeGearId);
    setDataset("hearthActiveProgress", state.activeProgress);
    setDataset("hearthOneActiveGearAtATime", "true");

    setDataset("hearthF13CanvasDelegated", "true");
    setDataset("hearthF13CarrierHostAvailable", state.f13CarrierHostAvailable);
    setDataset("hearthF13CanvasEvidenceOwnedByCanvas", "true");
    setDataset("hearthF21NorthOnly", "true");
    setDataset("hearthF21EligibleForNorth", "false");
    setDataset("hearthF21SubmittedToNorth", "false");
    setDataset("hearthF21ClaimedByIndex", "false");
    setDataset("hearthReadyTextAllowed", "false");
    setDataset("hearthReadyTextClaimedByIndex", "false");

    setDataset("hearthFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthPostgameStatus", state.postgameStatus);

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.indexRuntimeHost = api;
    root.HEARTH.htmlShellAnchorAuditRuntimeHost = api;
    root.HEARTH.indexBridge = api;
    root.HEARTH.indexJs = api;
    root.HEARTH.dynamicSelectorRuntimeRelease = api;
    root.HEARTH.eastSouthPairFemaleSelector = api;
    root.HEARTH.twoFileNewsFibonacciCarrierHostAlignment = api;
    root.HEARTH.indexJsApiRedeclarationControlBindingRepair = api;
    root.HEARTH.indexJsControlSurfaceEarlyActivationShield = api;

    root.DEXTER_LAB.hearthIndexRuntimeHost = api;
    root.DEXTER_LAB.hearthHtmlShellAnchorAuditRuntimeHost = api;
    root.DEXTER_LAB.hearthDynamicSelectorRuntimeRelease = api;
    root.DEXTER_LAB.hearthTwoFileNewsFibonacciCarrierHostAlignment = api;
    root.DEXTER_LAB.hearthIndexJsApiRedeclarationControlBindingRepair = api;
    root.DEXTER_LAB.hearthIndexJsControlSurfaceEarlyActivationShield = api;

    root.HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD = api;
    root.HEARTH_INDEX_JS_API_REDECLARATION_CONTROL_BINDING_REPAIR = api;
    root.HEARTH_INDEX_JS_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_ALIGNMENT = api;
    root.HEARTH_INDEX_JS_HTML_SHELL_ANCHOR_AUDIT_RUNTIME_HOST = api;
    root.HEARTH_INDEX_RUNTIME_HOST = api;
    root.HEARTH_HTML_SHELL_ANCHOR_AUDIT_RUNTIME_HOST = api;
    root.HEARTH_INDEX_JS = api;
    root.HEARTH_INDEX_BRIDGE = api;

    root.HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR = api;
    root.HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE = api;

    publishCarrierHostAdmissibility("publish-globals");

    const receipt = getReceipt();

    root.HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_RECEIPT = receipt;
    root.HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_RECEIPT_v5_3 = receipt;
    root.HEARTH_INDEX_JS_API_REDECLARATION_CONTROL_BINDING_REPAIR_RECEIPT = receipt;
    root.HEARTH_INDEX_JS_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_ALIGNMENT_RECEIPT = receipt;
    root.HEARTH_INDEX_JS_HTML_SHELL_ANCHOR_AUDIT_RUNTIME_HOST_RECEIPT = receipt;
    root.HEARTH_INDEX_RUNTIME_HOST_RECEIPT = receipt;
    root.HEARTH_HTML_SHELL_ANCHOR_AUDIT_RUNTIME_HOST_RECEIPT = receipt;
    root.HEARTH_INDEX_JS_RECEIPT = receipt;
    root.HEARTH_INDEX_BRIDGE_RECEIPT = receipt;

    root.HEARTH.indexRuntimeHostReceipt = receipt;
    root.HEARTH.indexJsReceipt = receipt;
    root.HEARTH.twoFileNewsFibonacciCarrierHostAlignmentReceipt = receipt;
    root.HEARTH.indexJsApiRedeclarationControlBindingRepairReceipt = receipt;
    root.HEARTH.indexJsControlSurfaceEarlyActivationShieldReceipt = receipt;
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

    updateCarrierHostAdmissibility(`publish-state:${message}`);
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

      auditShellAnchors("SHELL_GUARD_INTERVAL");
      bindControls();
      applyReleaseLaw();

      if (findCanvasParentApi()) {
        requestCanvasPreReleaseCarrier("SHELL_GUARD_CANVAS_CARRIER_REFRESH_OBSERVED_ONLY");
      }

      updateCarrierHostAdmissibility("shell-guard");
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

    auditShellAnchors("BOOT_HTML_SHELL_ANCHOR_AUDIT");
    bindControls();
    applyReleaseLaw();
    requestCanvasPreReleaseCarrier("BOOT_EXISTING_CANVAS_PARENT_PREFLIGHT_OBSERVED_ONLY");
    updateCarrierHostAdmissibility("boot");
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

  function getControlShieldStatus() {
    return {
      indexControlSurfaceEarlyActivationShieldActive: true,
      indexControlSurfaceEventShieldActive: true,
      indexOwnsControlBinding: true,
      routeConductorOwnsControlBinding: false,
      controlPointerTouchShieldActive: true,
      controlCapturePhaseShieldActive: true,
      multiLayerControlCaptureShieldActive: true,
      terminalActivationExecutionActive: true,
      clickOnlyActivationAvoided: true,
      runtimeStageInterceptionPrevented: true,
      canvasGestureLeakBlocked: true,
      duplicateTouchClickSuppressionActive: true,
      physicalActivationWindowSuppressionActive: true,
      keyboardActivationPreserved: true,
      currentHtmlContractRecognized: state.currentHtmlContractRecognized,
      controlSurfaceShieldBound: state.controlSurfaceShieldBound,
      controlShieldBoundTargets: state.controlShieldBoundTargets,
      controlShieldBoundControls: state.controlShieldBoundControls,
      controlShieldInterceptCount: state.controlShieldInterceptCount,
      controlShieldTerminalActivationCount: state.controlShieldTerminalActivationCount,
      controlShieldClickSuppressionCount: state.controlShieldClickSuppressionCount,
      controlShieldDuplicateSuppressionCount: state.controlShieldDuplicateSuppressionCount,
      controlShieldKeyboardActivationCount: state.controlShieldKeyboardActivationCount,
      controlShieldLastActionName: state.controlShieldLastActionName,
      controlShieldLastEventType: state.controlShieldLastEventType,
      controlShieldLastActivatedAt: state.controlShieldLastActivatedAt,
      controlShieldLastSuppressedAt: state.controlShieldLastSuppressedAt
    };
  }

  function getReceipt() {
    const carrierPacket = state.lastCarrierHostAdmissibilityPacket || composeCarrierHostAdmissibilityPacket();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      htmlFile: HTML_FILE,
      route: ROUTE,

      role: state.role,
      pairRole: state.pairRole,
      pairedRouteConductorFile: PAIRED_ROUTE_CONDUCTOR_FILE,

      parserRepairActive: true,
      apiRedeclarationRepairActive: true,
      priorApiRedeclarationFatalDefectCorrected: true,
      apiObjectPopulationMode: "Object.assign(api, {...})",

      ...getControlShieldStatus(),

      htmlRebuildRequired: false,
      routeConductorRebuildRequired: false,
      canvasRebuildRequired: false,
      runtimeTableRebuildRequired: false,

      htmlOwnsVisibleShell: true,
      indexJsCreatesVisibleShell: false,
      indexJsCreatesFallbackCss: false,
      indexJsCreatesShellDom: false,
      indexJsCreatesRuntimeScriptsOnly: true,

      ownsRouteAnchors: false,
      ownsMountHost: false,
      ownsControlsCreation: false,
      ownsControlBinding: true,
      ownsRuntimeScriptRelease: true,
      ownsCanvasCarrierHostPacket: true,
      ownsCarrierHostAdmissibility: true,
      ownsRouteConductorHandoff: true,

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

      currentHtmlContract: CURRENT_HTML_CONTRACT,
      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      currentSafeHtmlContract: CURRENT_SAFE_HTML_CONTRACT,
      htmlContractsRecognized: HTML_CONTRACTS_RECOGNIZED.slice(),
      shellContract: state.shellContract,
      shellDetected: state.shellDetected,
      shellSelected: state.shellSelected,
      shellAccepted: state.shellAccepted,
      shellSelectionMode: state.shellSelectionMode,
      shellHoldReason: state.shellHoldReason,
      htmlAnchorAuditActive: true,
      dynamicAnchorsPass: state.dynamicAnchorsPass,
      missingAnchors: state.missingAnchors.slice(),
      shellControlsBound: state.shellControlsBound,

      mountPresent: state.mountPresent,
      cockpitPresent: state.cockpitPresent,
      statusNodePresent: state.statusNodePresent,
      receiptPanelPresent: state.receiptPanelPresent,
      portalPresent: state.portalPresent,
      carrierHostReady: state.carrierHostReady,
      carrierHostPacketReady: state.carrierHostPacketReady,

      carrierHostAdmissibilityActive: true,
      carrierHostAdmissibilityReady: state.carrierHostAdmissibilityReady,
      carrierHostAdmissibilityPacketReady: state.carrierHostAdmissibilityPacketReady,
      carrierHostAdmissibilityPacketPublished: state.carrierHostAdmissibilityPacketPublished,
      carrierHostAdmissibilityHoldReason: state.carrierHostAdmissibilityHoldReason,
      handoffToRouteConductor: state.handoffToRouteConductor,
      indexMacroWestCandidateReady: state.indexMacroWestCandidateReady,
      routeConductorHandoffPacketReady: state.routeConductorHandoffPacketReady,
      carrierHostAdmissibilityPacket: carrierPacket,

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
      newsAlignmentProtocolActive: true,
      fibonacciSynchronizationActive: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      fibonacciSynchronizationSatisfied: state.fibonacciSynchronizationSatisfied,
      fibonacciSynchronizationExpected: state.fibonacciSynchronizationExpected,
      fibonacciSynchronizationPassed: state.fibonacciSynchronizationPassed,
      fibonacciSynchronizationDegraded: state.fibonacciSynchronizationDegraded,
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

      requiredHtmlAnchors: REQUIRED_HTML_ANCHORS.slice(),
      controlSelectors: CONTROL_SELECTORS.slice(),
      controlShieldEvents: CONTROL_SHIELD_EVENTS.slice(),
      controlTerminalEvents: CONTROL_TERMINAL_EVENTS.slice(),
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
      "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_RECEIPT",
      "",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("baselineContract", r.baselineContract),
      line("version", r.version),
      line("file", r.file),
      line("htmlFile", r.htmlFile),
      line("route", r.route),
      "",
      "PARSER_REPAIR",
      line("parserRepairActive", r.parserRepairActive),
      line("apiRedeclarationRepairActive", r.apiRedeclarationRepairActive),
      line("priorApiRedeclarationFatalDefectCorrected", r.priorApiRedeclarationFatalDefectCorrected),
      line("apiObjectPopulationMode", r.apiObjectPopulationMode),
      "",
      "CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD",
      line("indexControlSurfaceEarlyActivationShieldActive", r.indexControlSurfaceEarlyActivationShieldActive),
      line("indexControlSurfaceEventShieldActive", r.indexControlSurfaceEventShieldActive),
      line("indexOwnsControlBinding", r.indexOwnsControlBinding),
      line("routeConductorOwnsControlBinding", r.routeConductorOwnsControlBinding),
      line("controlPointerTouchShieldActive", r.controlPointerTouchShieldActive),
      line("controlCapturePhaseShieldActive", r.controlCapturePhaseShieldActive),
      line("multiLayerControlCaptureShieldActive", r.multiLayerControlCaptureShieldActive),
      line("terminalActivationExecutionActive", r.terminalActivationExecutionActive),
      line("clickOnlyActivationAvoided", r.clickOnlyActivationAvoided),
      line("runtimeStageInterceptionPrevented", r.runtimeStageInterceptionPrevented),
      line("canvasGestureLeakBlocked", r.canvasGestureLeakBlocked),
      line("duplicateTouchClickSuppressionActive", r.duplicateTouchClickSuppressionActive),
      line("physicalActivationWindowSuppressionActive", r.physicalActivationWindowSuppressionActive),
      line("keyboardActivationPreserved", r.keyboardActivationPreserved),
      line("controlSurfaceShieldBound", r.controlSurfaceShieldBound),
      line("controlShieldBoundTargets", r.controlShieldBoundTargets),
      line("controlShieldBoundControls", r.controlShieldBoundControls),
      line("controlShieldInterceptCount", r.controlShieldInterceptCount),
      line("controlShieldTerminalActivationCount", r.controlShieldTerminalActivationCount),
      line("controlShieldClickSuppressionCount", r.controlShieldClickSuppressionCount),
      line("controlShieldDuplicateSuppressionCount", r.controlShieldDuplicateSuppressionCount),
      line("controlShieldKeyboardActivationCount", r.controlShieldKeyboardActivationCount),
      line("controlShieldLastActionName", r.controlShieldLastActionName),
      line("controlShieldLastEventType", r.controlShieldLastEventType),
      line("controlShieldLastActivatedAt", r.controlShieldLastActivatedAt),
      line("controlShieldLastSuppressedAt", r.controlShieldLastSuppressedAt),
      "",
      "HTML_CONTRACT_ALIGNMENT",
      line("currentHtmlContract", r.currentHtmlContract),
      line("currentHtmlContractRecognized", r.currentHtmlContractRecognized),
      line("expectedHtmlContract", r.expectedHtmlContract),
      line("currentSafeHtmlContract", r.currentSafeHtmlContract),
      line("shellContract", r.shellContract),
      line("shellSelectionMode", r.shellSelectionMode),
      line("htmlRebuildRequired", r.htmlRebuildRequired),
      line("routeConductorRebuildRequired", r.routeConductorRebuildRequired),
      line("canvasRebuildRequired", r.canvasRebuildRequired),
      line("runtimeTableRebuildRequired", r.runtimeTableRebuildRequired),
      "",
      "SPLIT_BOUNDARY",
      line("htmlOwnsVisibleShell", r.htmlOwnsVisibleShell),
      line("indexJsCreatesVisibleShell", r.indexJsCreatesVisibleShell),
      line("indexJsCreatesFallbackCss", r.indexJsCreatesFallbackCss),
      line("indexJsCreatesShellDom", r.indexJsCreatesShellDom),
      line("indexJsCreatesRuntimeScriptsOnly", r.indexJsCreatesRuntimeScriptsOnly),
      "",
      "PAIR",
      line("role", r.role),
      line("pairRole", r.pairRole),
      line("pairedRouteConductorFile", r.pairedRouteConductorFile),
      line("ownsRouteAnchors", r.ownsRouteAnchors),
      line("ownsMountHost", r.ownsMountHost),
      line("ownsControlsCreation", r.ownsControlsCreation),
      line("ownsControlBinding", r.ownsControlBinding),
      line("ownsRuntimeScriptRelease", r.ownsRuntimeScriptRelease),
      line("ownsCanvasCarrierHostPacket", r.ownsCanvasCarrierHostPacket),
      line("ownsCarrierHostAdmissibility", r.ownsCarrierHostAdmissibility),
      line("ownsRouteConductorHandoff", r.ownsRouteConductorHandoff),
      "",
      "HTML_SHELL_AUDIT",
      line("shellDetected", r.shellDetected),
      line("shellSelected", r.shellSelected),
      line("shellAccepted", r.shellAccepted),
      line("shellContract", r.shellContract),
      line("shellSelectionMode", r.shellSelectionMode),
      line("shellHoldReason", r.shellHoldReason),
      line("htmlAnchorAuditActive", r.htmlAnchorAuditActive),
      line("dynamicAnchorsPass", r.dynamicAnchorsPass),
      line("missingAnchors", r.missingAnchors.join(",")),
      line("shellControlsBound", r.shellControlsBound),
      "",
      "CARRIER_HOST",
      line("mountPresent", r.mountPresent),
      line("cockpitPresent", r.cockpitPresent),
      line("statusNodePresent", r.statusNodePresent),
      line("receiptPanelPresent", r.receiptPanelPresent),
      line("portalPresent", r.portalPresent),
      line("carrierHostReady", r.carrierHostReady),
      line("carrierHostPacketReady", r.carrierHostPacketReady),
      "",
      "CARRIER_HOST_ADMISSIBILITY",
      line("carrierHostAdmissibilityActive", r.carrierHostAdmissibilityActive),
      line("carrierHostAdmissibilityReady", r.carrierHostAdmissibilityReady),
      line("carrierHostAdmissibilityPacketReady", r.carrierHostAdmissibilityPacketReady),
      line("carrierHostAdmissibilityPacketPublished", r.carrierHostAdmissibilityPacketPublished),
      line("carrierHostAdmissibilityHoldReason", r.carrierHostAdmissibilityHoldReason),
      line("handoffToRouteConductor", r.handoffToRouteConductor),
      line("indexMacroWestCandidateReady", r.indexMacroWestCandidateReady),
      line("routeConductorHandoffPacketReady", r.routeConductorHandoffPacketReady),
      "",
      "CANVAS_PRE_RELEASE_OBSERVED_ONLY",
      line("canvasParentObserved", r.canvasParentObserved),
      line("canvasParentApiReady", r.canvasParentApiReady),
      line("canvasParentLoadedBeforeWest", r.canvasParentLoadedBeforeWest),
      line("canvasPreReleaseCarrierRequested", r.canvasPreReleaseCarrierRequested),
      line("canvasPreReleaseCarrierObserved", r.canvasPreReleaseCarrierObserved),
      line("canvasPreReleaseCarrierAccepted", r.canvasPreReleaseCarrierAccepted),
      line("canvasPreReleaseCarrierSafeForWest", r.canvasPreReleaseCarrierSafeForWest),
      line("canvasCarrierReceiptObserved", r.canvasCarrierReceiptObserved),
      line("canvasCarrierHeldReason", r.canvasCarrierHeldReason),
      "",
      "RUNTIME",
      line("runtimeReleaseRequestable", r.runtimeReleaseRequestable),
      line("runtimeReleaseRequested", r.runtimeReleaseRequested),
      line("runtimeReleaseAuthorized", r.runtimeReleaseAuthorized),
      line("runtimeReleaseStarted", r.runtimeReleaseStarted),
      line("runtimeReleaseComplete", r.runtimeReleaseComplete),
      line("runtimeHeld", r.runtimeHeld),
      line("runtimeReleaseHeldReason", r.runtimeReleaseHeldReason),
      line("currentRuntimeKey", r.currentRuntimeKey),
      line("currentRuntimeFile", r.currentRuntimeFile),
      line("runtimeLoaded", r.runtimeLoaded.join(",")),
      line("runtimeHeldFiles", r.runtimeHeldFiles.join(",")),
      line("runtimeErrors", r.runtimeErrors.map((error) => `${error.key || ""}:${error.file || ""}:${error.message || ""}`).join(" | ")),
      "",
      "NEWS_FIBONACCI",
      line("newsAlignmentActive", r.newsAlignmentActive),
      line("newsAlignmentProtocolActive", r.newsAlignmentProtocolActive),
      line("fibonacciSynchronizationActive", r.fibonacciSynchronizationActive),
      line("fibonacciSynchronizationMetricActive", r.fibonacciSynchronizationMetricActive),
      line("fibonacciSynchronizationScore", r.fibonacciSynchronizationScore),
      line("fibonacciSynchronizationSatisfied", r.fibonacciSynchronizationSatisfied),
      line("fibonacciSynchronizationExpected", r.fibonacciSynchronizationExpected),
      line("fibonacciSynchronizationPassed", r.fibonacciSynchronizationPassed),
      line("fibonacciSynchronizationDegraded", r.fibonacciSynchronizationDegraded),
      line("macroCycle1", r.macroCycle1),
      line("macroCycle2", r.macroCycle2),
      line("activeNews", r.activeNews),
      line("activeFibonacci", r.activeFibonacci),
      line("activeFibonacciRank", r.activeFibonacciRank),
      line("activeStageId", r.activeStageId),
      line("activeGearId", r.activeGearId),
      line("activeProgress", r.activeProgress),
      line("oneActiveGearAtATime", r.oneActiveGearAtATime),
      "",
      "F13_F21_BOUNDARY",
      line("f13CanvasDelegated", r.f13CanvasDelegated),
      line("f13CarrierHostAvailable", r.f13CarrierHostAvailable),
      line("f13CanvasEvidenceOwnedByCanvas", r.f13CanvasEvidenceOwnedByCanvas),
      line("f21NorthOnly", r.f21NorthOnly),
      line("f21EligibleForNorth", r.f21EligibleForNorth),
      line("f21SubmittedToNorth", r.f21SubmittedToNorth),
      line("f21ClaimedByIndex", r.f21ClaimedByIndex),
      line("readyTextAllowed", r.readyTextAllowed),
      line("readyTextClaimedByIndex", r.readyTextClaimedByIndex),
      "",
      "OWNERSHIP_BOUNDARY",
      line("ownsMacroWestTruth", r.ownsMacroWestTruth),
      line("ownsCanvasStructuralCarrierTruth", r.ownsCanvasStructuralCarrierTruth),
      line("ownsCanvasReleaseTruth", r.ownsCanvasReleaseTruth),
      line("ownsCanvasDrawing", r.ownsCanvasDrawing),
      line("ownsMaterialTruth", r.ownsMaterialTruth),
      line("ownsHydrologyTruth", r.ownsHydrologyTruth),
      line("ownsElevationTruth", r.ownsElevationTruth),
      line("ownsPlanetTruth", r.ownsPlanetTruth),
      line("ownsF21", r.ownsF21),
      line("ownsReadyText", r.ownsReadyText),
      line("ownsFinalVisualPassClaim", r.ownsFinalVisualPassClaim),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("postgameStatus", r.postgameStatus),
      "",
      "FINAL_CLAIMS",
      line("generatedImage", r.generatedImage),
      line("graphicBox", r.graphicBox),
      line("webGL", r.webGL),
      line("visualPassClaimed", r.visualPassClaimed),
      "",
      line("startedAt", r.startedAt),
      line("updatedAt", r.updatedAt)
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

      auditShellAnchors("RUNTIME_ERROR_SHELL_AUDIT");
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

      auditShellAnchors("UNHANDLED_REJECTION_SHELL_AUDIT");
      bindControls();
      schedulePublish("runtime-rejection");
    }, true);
  }

  Object.assign(api, {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    htmlFile: HTML_FILE,
    route: ROUTE,

    CURRENT_HTML_CONTRACT,
    EXPECTED_HTML_CONTRACT,
    CURRENT_SAFE_HTML_CONTRACT,
    HTML_CONTRACTS_RECOGNIZED,
    MACRO_CYCLE_1,
    MACRO_CYCLE_2,
    REQUIRED_HTML_ANCHORS,
    CONTROL_SELECTORS,
    CONTROL_ACTIONS,
    CONTROL_SHIELD_EVENTS,
    CONTROL_TERMINAL_EVENTS,
    RUNTIME_FILES,

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    auditShellAnchors,
    detectShell: auditShellAnchors,
    applyReleaseLaw,
    bindControls,
    bindControlSurfaceEventShield,
    handleControlSurfaceEvent,
    activateControlAction,
    setInspectIntent,
    toggleReceiptPanel,
    toggleCockpitMode,
    releaseRuntimeQueue,
    requestCanvasPreReleaseCarrier,
    composeCarrierHostPacket,
    composeCarrierHostAdmissibilityPacket,
    updateCarrierHostAdmissibility,
    publishCarrierHostAdmissibility,
    findCanvasParentApi,
    publishState,
    getReceipt,
    getReceiptText,
    getControlShieldStatus,
    copyDiagnostic,

    parserRepairActive: true,
    apiRedeclarationRepairActive: true,
    priorApiRedeclarationFatalDefectCorrected: true,

    indexControlSurfaceEarlyActivationShieldActive: true,
    indexControlSurfaceEventShieldActive: true,
    controlPointerTouchShieldActive: true,
    controlCapturePhaseShieldActive: true,
    multiLayerControlCaptureShieldActive: true,
    terminalActivationExecutionActive: true,
    clickOnlyActivationAvoided: true,
    runtimeStageInterceptionPrevented: true,
    canvasGestureLeakBlocked: true,
    duplicateTouchClickSuppressionActive: true,
    physicalActivationWindowSuppressionActive: true,
    keyboardActivationPreserved: true,

    htmlOwnsVisibleShell: true,
    indexJsCreatesVisibleShell: false,
    indexJsCreatesFallbackCss: false,
    indexJsCreatesShellDom: false,
    indexJsCreatesRuntimeScriptsOnly: true,

    pairRole: "female-runtime-host-for-male-route-conductor",
    pairedRouteConductorFile: PAIRED_ROUTE_CONDUCTOR_FILE,

    carrierHostAdmissibilityActive: true,
    newsAlignmentActive: true,
    newsAlignmentProtocolActive: true,
    fibonacciSynchronizationActive: true,
    fibonacciSynchronizationMetricActive: true,
    f13CanvasDelegated: true,
    f21NorthOnly: true,
    f21EligibleForNorth: false,
    f21ClaimedByIndex: false,
    readyTextAllowed: false,
    readyTextClaimedByIndex: false,

    ownsRouteAnchors: false,
    ownsMountHost: false,
    ownsControlsCreation: false,
    ownsControlBinding: true,
    indexOwnsControlBinding: true,
    routeConductorOwnsControlBinding: false,
    ownsRuntimeScriptRelease: true,
    ownsCanvasCarrierHostPacket: true,
    ownsCarrierHostAdmissibility: true,
    ownsRouteConductorHandoff: true,
    ownsMacroWestTruth: false,
    ownsCanvasStructuralCarrierTruth: false,
    ownsCanvasReleaseTruth: false,
    ownsCanvasDrawing: false,
    ownsMaterialTruth: false,
    ownsPlanetTruth: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    htmlRebuildRequired: false,
    routeConductorRebuildRequired: false,
    canvasRebuildRequired: false,
    runtimeTableRebuildRequired: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  });

  root.HEARTH = root.HEARTH || {};
  root.DEXTER_LAB = root.DEXTER_LAB || {};

  root.HEARTH.indexRuntimeHost = api;
  root.HEARTH.htmlShellAnchorAuditRuntimeHost = api;
  root.HEARTH.indexBridge = api;
  root.HEARTH.indexJs = api;
  root.HEARTH.dynamicSelectorRuntimeRelease = api;
  root.HEARTH.eastSouthPairFemaleSelector = api;
  root.HEARTH.twoFileNewsFibonacciCarrierHostAlignment = api;
  root.HEARTH.indexJsApiRedeclarationControlBindingRepair = api;
  root.HEARTH.indexJsControlSurfaceEarlyActivationShield = api;

  root.DEXTER_LAB.hearthIndexRuntimeHost = api;
  root.DEXTER_LAB.hearthHtmlShellAnchorAuditRuntimeHost = api;
  root.DEXTER_LAB.hearthDynamicSelectorRuntimeRelease = api;
  root.DEXTER_LAB.hearthTwoFileNewsFibonacciCarrierHostAlignment = api;
  root.DEXTER_LAB.hearthIndexJsApiRedeclarationControlBindingRepair = api;
  root.DEXTER_LAB.hearthIndexJsControlSurfaceEarlyActivationShield = api;

  root.HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD = api;
  root.HEARTH_INDEX_JS_API_REDECLARATION_CONTROL_BINDING_REPAIR = api;
  root.HEARTH_INDEX_JS_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_ALIGNMENT = api;
  root.HEARTH_INDEX_JS_HTML_SHELL_ANCHOR_AUDIT_RUNTIME_HOST = api;
  root.HEARTH_INDEX_RUNTIME_HOST = api;
  root.HEARTH_HTML_SHELL_ANCHOR_AUDIT_RUNTIME_HOST = api;
  root.HEARTH_INDEX_JS = api;
  root.HEARTH_INDEX_BRIDGE = api;
  root.HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR = api;
  root.HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE = api;

  bindControlSurfaceEventShield("initial-control-shield-publication");
  updateCarrierHostAdmissibility("initial-publication");
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
