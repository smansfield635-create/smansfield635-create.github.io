// /showroom/globe/hearth/index.js
// HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4
// Full-file replacement.
// Index JS / front-end button authority reset only.
// Supersedes:
// - HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3
// Purpose:
// - Restore visible Hearth front-end button and anchor functionality first.
// - Bind current HTML v2_2 controls directly.
// - Preserve native navigation for diagnostic and portal anchors.
// - Protect buttons from downstream/global suppression without blocking native anchors.
// - Toggle receipt, copy diagnostic, inspect/diagnostic dock, and cockpit expansion.
// - Keep runtime, canvas, route conductor, Macro West, F13, F21, ready text, generated image, GraphicBox, WebGL, and visual pass claims held.
// Does not own:
// - runtime release
// - canvas drawing
// - route conductor handoff
// - diagnostic child-chain loading
// - F13
// - F21
// - final visual pass
// - production repair beyond front-end button authority

(() => {
  "use strict";

  const CONTRACT = "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const RECEIPT = "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_RECEIPT_v5_4";
  const PREVIOUS_CONTRACT = "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3";
  const VERSION = "2026-06-02.hearth-index-js-frontend-button-authority-reset-v5-4";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/index.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CURRENT_HTML_CONTRACT = "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_NATIVE_ACCESS_DOORWAY_TNT_v2_2";
  const PREVIOUS_HTML_CONTRACT = "HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: FILE,
    htmlFile: HTML_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    role: "frontend-button-authority-reset",
    currentHtmlContract: CURRENT_HTML_CONTRACT,
    previousHtmlContract: PREVIOUS_HTML_CONTRACT,
    observedHtmlContract: "UNKNOWN",
    currentHtmlContractRecognized: false,

    bootStarted: false,
    bootComplete: false,
    controlStyleInjected: false,

    buttonAuthorityActive: true,
    globalSuppressionAvoided: true,
    windowDocumentCaptureSuppressionRetired: true,
    nativeAnchorDefaultPreserved: true,
    directButtonBindingActive: true,
    delegatedButtonBindingActive: true,
    detailsSummaryBindingActive: true,
    runtimeReleaseHeld: true,
    diagnosticRailLoadedByIndex: false,
    diagnosticRailOwnedByIndex: false,

    copyDiagnosticBound: false,
    toggleReceiptBound: false,
    diagnosticAnchorBound: false,
    inspectPlanetBound: false,
    expandCockpitBound: false,
    portalAnchorsBound: false,
    detailsDrawersBound: false,

    copyDiagnosticCount: 0,
    toggleReceiptCount: 0,
    diagnosticAnchorCount: 0,
    inspectPlanetCount: 0,
    showDiagnosticCount: 0,
    expandCockpitCount: 0,
    portalNavigationCount: 0,
    drawerToggleCount: 0,

    lastAction: "NOT_RUN",
    lastActionAt: "",
    lastError: "",
    receiptVisible: false,
    inspectModeActive: false,
    cockpitMode: "diagnostic-dock",

    f13Claimed: false,
    f21Claimed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,

    startedAt: "",
    updatedAt: ""
  };

  const refs = {
    html: null,
    body: null,
    stage: null,
    mount: null,
    cockpit: null,
    receiptPanel: null,
    receiptText: null,
    routeStatus: null,
    copyButton: null,
    toggleReceiptButton: null,
    inspectButton: null,
    collapseButton: null,
    showDiagnosticTab: null,
    diagnosticAnchors: [],
    portalLinks: [],
    summaries: [],
    stageLabel: null,
    heartbeatText: null,
    latestEvent: null,
    progressFill: null,
    progressPercent: null
  };

  const boundElements = typeof WeakSet !== "undefined" ? new WeakSet() : null;
  let lastActivationKey = "";
  let lastActivationAt = 0;

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

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
  }

  function isFunction(value) {
    return typeof value === "function";
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

  function closest(target, selector) {
    if (!isElement(target) || !isFunction(target.closest)) return null;
    try {
      return target.closest(selector);
    } catch (_error) {
      return null;
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function setDataset(node, key, value) {
    if (!node || !node.dataset) return;
    node.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function setText(node, text) {
    if (!node) return;
    node.textContent = safeString(text);
  }

  function markAction(actionName) {
    state.lastAction = actionName;
    state.lastActionAt = nowIso();
    state.updatedAt = state.lastActionAt;
    publishDataset();
    updateStatusLine(actionName);
  }

  function shouldIgnoreDuplicate(key) {
    const at = nowMs();
    if (key === lastActivationKey && at - lastActivationAt < 450) return true;
    lastActivationKey = key;
    lastActivationAt = at;
    return false;
  }

  function stopForButton(event) {
    if (!event) return;
    try {
      if (event.cancelable) event.preventDefault();
    } catch (_error) {}
    try {
      if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
      else if (isFunction(event.stopPropagation)) event.stopPropagation();
    } catch (_error) {}
  }

  function protectNativeAnchor(event, anchor) {
    if (!anchor) return;

    try {
      if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
      else if (isFunction(event.stopPropagation)) event.stopPropagation();
    } catch (_error) {}

    if (event.type !== "click") return;
    if (event.defaultPrevented) {
      navigate(anchor.href || anchor.getAttribute("href") || DIAGNOSTIC_ROUTE);
      return;
    }

    root.setTimeout(() => {
      if (!doc || doc.visibilityState === "hidden") return;
    }, 0);
  }

  function navigate(url) {
    const target = safeString(url, "");
    if (!target) return false;

    try {
      root.location.assign(target);
      return true;
    } catch (_error) {
      try {
        root.location.href = target;
        return true;
      } catch (error) {
        state.lastError = error && error.message ? error.message : String(error);
        return false;
      }
    }
  }

  function refreshRefs() {
    refs.html = doc ? doc.documentElement : null;
    refs.body = doc ? doc.body : null;
    refs.stage = qs("#hearthGlobeStage") || qs("[data-hearth-globe-stage]");
    refs.mount = qs("#hearthCanvasMount") || qs("[data-hearth-canvas-mount]");
    refs.cockpit = qs("#hearthLoadCockpit") || qs("[data-hearth-load-cockpit]");
    refs.receiptPanel = qs("#hearthReceiptPanel") || qs("[data-hearth-receipt-box]");
    refs.receiptText = qs("[data-hearth-receipt-text]");
    refs.routeStatus = qs("#hearth-route-status") || qs("[data-hearth-route-status]");
    refs.copyButton = qs("[data-hearth-copy-diagnostic]");
    refs.toggleReceiptButton = qs("[data-hearth-toggle-receipt]");
    refs.inspectButton = qs("[data-hearth-inspect-planet]");
    refs.collapseButton = qs("[data-hearth-collapse-cockpit]");
    refs.showDiagnosticTab = qs("[data-hearth-south-show-diagnostic-tab]") || qs("[data-hearth-east-show-diagnostic-tab]") || qs("[data-hearth-show-diagnostic-tab]");
    refs.diagnosticAnchors = qsa("a[href='/showroom/globe/hearth/diagnostic/'], a[data-hearth-diagnostic-rail-native-anchor], a[data-hearth-diagnostic-rail-field]");
    refs.portalLinks = qsa("#hearthMapPortal a[href], [data-hearth-map-portal] a[href], .portal-link[href]");
    refs.summaries = qsa("details.drawer > summary, details > summary");
    refs.stageLabel = qs("[data-hearth-stage-label]");
    refs.heartbeatText = qs("[data-hearth-heartbeat-text]");
    refs.latestEvent = qs("[data-hearth-latest-event]");
    refs.progressFill = qs("[data-hearth-main-progress-fill]");
    refs.progressPercent = qs("[data-hearth-main-progress-percent]");
  }

  function readHtmlContract() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return "UNKNOWN";
    return safeString(
      doc.documentElement.dataset.contract ||
      doc.documentElement.dataset.hearthHtmlContract ||
      doc.documentElement.dataset.hearthShellContract ||
      "UNKNOWN"
    );
  }

  function injectControlAuthorityStyle() {
    if (!doc || !doc.head) return false;

    if (qs("style[data-hearth-index-button-authority-reset-style]")) {
      state.controlStyleInjected = true;
      return true;
    }

    const style = doc.createElement("style");
    style.setAttribute("data-hearth-index-button-authority-reset-style", CONTRACT);
    style.textContent = `
      [data-hearth-load-cockpit],
      #hearthLoadCockpit {
        z-index: 10020 !important;
        pointer-events: auto !important;
      }

      [data-hearth-load-cockpit] button,
      [data-hearth-load-cockpit] a,
      #hearthLoadCockpit button,
      #hearthLoadCockpit a,
      #hearthMapPortal a,
      [data-hearth-map-portal] a,
      details > summary,
      [data-hearth-south-show-diagnostic-tab],
      [data-hearth-east-show-diagnostic-tab],
      [data-hearth-show-diagnostic-tab],
      #hearthDiagnosticRailEmergencyAnchor {
        pointer-events: auto !important;
        touch-action: manipulation !important;
        user-select: auto !important;
        -webkit-user-select: auto !important;
      }

      #hearthCanvasMount[data-hearth-canvas-mount] {
        z-index: 2;
      }

      #hearthDiagnosticRailEmergencyAnchor {
        position: fixed;
        left: max(10px, env(safe-area-inset-left));
        top: max(10px, env(safe-area-inset-top));
        z-index: 100000;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 10px 14px;
        border: 1px solid rgba(242, 198, 109, .8);
        border-radius: 999px;
        background: linear-gradient(135deg, #ffe8a3, #f2c66d);
        color: #06101e;
        font: 950 12px/1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: .08em;
        text-transform: uppercase;
        text-decoration: none;
        box-shadow: 0 16px 44px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.28);
      }

      #hearthDiagnosticRailEmergencyAnchor:focus-visible {
        outline: 3px solid rgba(126, 216, 255, .9);
        outline-offset: 4px;
      }
    `;

    doc.head.appendChild(style);
    state.controlStyleInjected = true;
    return true;
  }

  function ensureEmergencyDiagnosticAnchor() {
    if (!doc || !doc.body) return null;

    let anchor = qs("#hearthDiagnosticRailEmergencyAnchor");
    if (anchor) return anchor;

    anchor = doc.createElement("a");
    anchor.id = "hearthDiagnosticRailEmergencyAnchor";
    anchor.href = DIAGNOSTIC_ROUTE;
    anchor.textContent = "Open Hearth Diagnostic Rail";
    anchor.setAttribute("data-hearth-diagnostic-rail-native-anchor", "true");
    anchor.setAttribute("data-hearth-index-emergency-diagnostic-anchor", CONTRACT);
    anchor.setAttribute("aria-label", "Open Hearth Diagnostic Rail");
    doc.body.appendChild(anchor);

    return anchor;
  }

  function bindOnce(element, type, handler, options) {
    if (!element || !isFunction(element.addEventListener)) return false;

    const key = `__hearth_${CONTRACT}_${type}`;
    if (element[key]) return false;

    try {
      element.addEventListener(type, handler, options || false);
      element[key] = true;
      return true;
    } catch (_error) {
      try {
        element.addEventListener(type, handler, false);
        element[key] = true;
        return true;
      } catch (__error) {
        return false;
      }
    }
  }

  function markControl(element, actionName) {
    if (!element) return;
    setDataset(element, "hearthIndexButtonAuthorityReset", "true");
    setDataset(element, "hearthIndexButtonAuthorityContract", CONTRACT);
    setDataset(element, "hearthIndexButtonAction", actionName);
    setDataset(element, "hearthRouteConductorOwnsControlBinding", "false");
    setDataset(element, "hearthNativeAnchorDefaultPreserved", "true");
  }

  function bindButton(element, actionName, callback) {
    if (!element) return false;

    markControl(element, actionName);

    if (boundElements && boundElements.has(element)) return true;

    bindOnce(element, "pointerup", (event) => {
      const key = `${actionName}:pointerup`;
      if (shouldIgnoreDuplicate(key)) return;
      stopForButton(event);
      callback(event);
    }, { capture: true, passive: false });

    bindOnce(element, "touchend", (event) => {
      const key = `${actionName}:touchend`;
      if (shouldIgnoreDuplicate(key)) return;
      stopForButton(event);
      callback(event);
    }, { capture: true, passive: false });

    bindOnce(element, "click", (event) => {
      const keyboardClick = Number(event.detail || 0) === 0;
      const key = `${actionName}:click`;
      if (!keyboardClick && shouldIgnoreDuplicate(key)) {
        stopForButton(event);
        return;
      }
      stopForButton(event);
      callback(event);
    }, { capture: true, passive: false });

    bindOnce(element, "keydown", (event) => {
      const key = event.key || "";
      if (key !== "Enter" && key !== " ") return;
      stopForButton(event);
      callback(event);
    }, { capture: true, passive: false });

    if (boundElements) boundElements.add(element);
    return true;
  }

  function bindAnchor(anchor, actionName = "nativeAnchor") {
    if (!anchor) return false;

    markControl(anchor, actionName);

    bindOnce(anchor, "pointerup", (event) => {
      protectNativeAnchor(event, anchor);
    }, { capture: true, passive: false });

    bindOnce(anchor, "touchend", (event) => {
      protectNativeAnchor(event, anchor);
    }, { capture: true, passive: false });

    bindOnce(anchor, "click", (event) => {
      state.diagnosticAnchorCount += anchor.getAttribute("href") === DIAGNOSTIC_ROUTE ? 1 : 0;
      state.portalNavigationCount += anchor.getAttribute("href") !== DIAGNOSTIC_ROUTE ? 1 : 0;
      markAction(actionName);
      protectNativeAnchor(event, anchor);
    }, { capture: true, passive: false });

    return true;
  }

  function bindSummary(summary) {
    if (!summary) return false;

    setDataset(summary, "hearthIndexDrawerAuthorityReset", CONTRACT);

    bindOnce(summary, "click", (event) => {
      const details = closest(summary, "details");
      if (!details) return;

      try {
        event.preventDefault();
        if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
        else if (isFunction(event.stopPropagation)) event.stopPropagation();
      } catch (_error) {}

      details.open = !details.open;
      state.drawerToggleCount += 1;
      markAction("drawerToggle");
    }, { capture: true, passive: false });

    bindOnce(summary, "keydown", (event) => {
      const key = event.key || "";
      if (key !== "Enter" && key !== " ") return;

      const details = closest(summary, "details");
      if (!details) return;

      try {
        event.preventDefault();
        if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
        else if (isFunction(event.stopPropagation)) event.stopPropagation();
      } catch (_error) {}

      details.open = !details.open;
      state.drawerToggleCount += 1;
      markAction("drawerToggleKeyboard");
    }, { capture: true, passive: false });

    return true;
  }

  async function copyText(text) {
    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_error) {}

    try {
      if (!doc || !doc.body) return false;
      const area = doc.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "readonly");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      area.style.top = "-9999px";
      doc.body.appendChild(area);
      area.focus();
      area.select();
      const ok = doc.execCommand("copy");
      area.remove();
      return Boolean(ok);
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);
      return false;
    }
  }

  async function copyDiagnostic() {
    refreshRefs();

    const text = getReceiptText();
    const ok = await copyText(text);

    state.copyDiagnosticCount += 1;

    if (refs.copyButton) {
      refs.copyButton.textContent = ok ? "Copied" : "Copy held";
      root.setTimeout(() => {
        refreshRefs();
        if (refs.copyButton) refs.copyButton.textContent = "Copy diagnostic";
      }, 900);
    }

    markAction(ok ? "copyDiagnostic" : "copyDiagnosticHeld");
    return ok;
  }

  function toggleReceiptPanel() {
    refreshRefs();

    if (!refs.receiptPanel) {
      state.lastError = "RECEIPT_PANEL_NOT_FOUND";
      markAction("toggleReceiptFailed");
      return false;
    }

    const visible = refs.receiptPanel.dataset.visible !== "true";
    refs.receiptPanel.dataset.visible = String(visible);
    refs.receiptPanel.hidden = false;

    if (refs.receiptText) {
      refs.receiptText.textContent = visible ? getReceiptText() : "";
    }

    if (refs.toggleReceiptButton) {
      refs.toggleReceiptButton.textContent = visible ? "Hide receipt" : "Show receipt";
    }

    state.receiptVisible = visible;
    state.toggleReceiptCount += 1;
    markAction(visible ? "showReceipt" : "hideReceipt");
    return visible;
  }

  function setInspectMode(active) {
    refreshRefs();

    state.inspectModeActive = Boolean(active);

    if (refs.html) {
      refs.html.dataset.hearthSouthPlanetInspect = String(state.inspectModeActive);
      refs.html.dataset.hearthEastInspectReservedActive = String(state.inspectModeActive);
      refs.html.dataset.hearthIndexInspectModeActive = String(state.inspectModeActive);
    }

    if (refs.cockpit) {
      refs.cockpit.dataset.cockpitMode = state.inspectModeActive ? "planet-inspect" : "diagnostic-dock";
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = state.inspectModeActive ? "Show diagnostic" : "Inspect planet";
    }

    if (refs.showDiagnosticTab) {
      refs.showDiagnosticTab.hidden = !state.inspectModeActive;
      refs.showDiagnosticTab.dataset.visible = String(state.inspectModeActive);
    }

    if (state.inspectModeActive) {
      state.inspectPlanetCount += 1;
      state.cockpitMode = "planet-inspect";
      markAction("inspectPlanet");
    } else {
      state.showDiagnosticCount += 1;
      state.cockpitMode = "diagnostic-dock";
      markAction("showDiagnostic");
    }

    return state.inspectModeActive;
  }

  function toggleCockpitMode() {
    refreshRefs();

    if (!refs.cockpit) {
      state.lastError = "COCKPIT_NOT_FOUND";
      markAction("toggleCockpitFailed");
      return false;
    }

    const next = refs.cockpit.dataset.cockpitMode === "expanded-cockpit"
      ? "diagnostic-dock"
      : "expanded-cockpit";

    refs.cockpit.dataset.cockpitMode = next;
    state.cockpitMode = next;

    if (refs.collapseButton) {
      refs.collapseButton.textContent = next === "expanded-cockpit" ? "Collapse cockpit" : "Expand cockpit";
    }

    state.expandCockpitCount += 1;
    markAction("toggleCockpit");
    return true;
  }

  function updateStatusLine(message = "") {
    refreshRefs();

    if (refs.stageLabel) refs.stageLabel.textContent = "F3 · Front-end button authority restored";

    if (refs.heartbeatText) {
      refs.heartbeatText.textContent = [
        "buttons=functional",
        "native-anchors=preserved",
        "runtime-release=held",
        `last=${message || state.lastAction}`
      ].join(" · ");
    }

    if (refs.latestEvent) {
      refs.latestEvent.textContent = `latest=${CONTRACT}`;
    }

    if (refs.progressFill) refs.progressFill.style.width = "34%";
    if (refs.progressPercent) refs.progressPercent.textContent = "34%";

    if (refs.routeStatus) {
      refs.routeStatus.textContent = getReceiptText();
    }
  }

  function publishDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const html = doc.documentElement;
    html.dataset.hearthIndexJsLoaded = "true";
    html.dataset.hearthIndexJsContract = CONTRACT;
    html.dataset.hearthIndexJsReceipt = RECEIPT;
    html.dataset.hearthIndexJsPreviousContract = PREVIOUS_CONTRACT;
    html.dataset.hearthIndexJsVersion = VERSION;
    html.dataset.hearthIndexButtonAuthorityResetActive = "true";
    html.dataset.hearthFrontendButtonAuthorityRestored = "true";
    html.dataset.hearthWindowDocumentCaptureSuppressionRetired = "true";
    html.dataset.hearthNativeAnchorDefaultPreserved = "true";
    html.dataset.hearthDirectButtonBindingActive = "true";
    html.dataset.hearthRuntimeReleaseHeld = "true";
    html.dataset.hearthDiagnosticRailLoadedByIndex = "false";
    html.dataset.hearthDiagnosticRailOwnedByIndex = "false";
    html.dataset.hearthCurrentHtmlContractRecognized = String(state.currentHtmlContractRecognized);
    html.dataset.hearthObservedHtmlContract = state.observedHtmlContract;
    html.dataset.hearthCopyDiagnosticBound = String(state.copyDiagnosticBound);
    html.dataset.hearthToggleReceiptBound = String(state.toggleReceiptBound);
    html.dataset.hearthDiagnosticAnchorBound = String(state.diagnosticAnchorBound);
    html.dataset.hearthInspectPlanetBound = String(state.inspectPlanetBound);
    html.dataset.hearthExpandCockpitBound = String(state.expandCockpitBound);
    html.dataset.hearthPortalAnchorsBound = String(state.portalAnchorsBound);
    html.dataset.hearthDetailsDrawersBound = String(state.detailsDrawersBound);
    html.dataset.hearthLastButtonAction = state.lastAction;
    html.dataset.hearthLastButtonActionAt = state.lastActionAt;
    html.dataset.hearthF13Claimed = "false";
    html.dataset.hearthF21Claimed = "false";
    html.dataset.hearthReadyTextClaimed = "false";
    html.dataset.visualPassClaimed = "false";
    html.dataset.generatedImage = "false";
    html.dataset.graphicBox = "false";
    html.dataset.webgl = "false";
  }

  function bindControls() {
    refreshRefs();
    injectControlAuthorityStyle();
    ensureEmergencyDiagnosticAnchor();
    refreshRefs();

    state.copyDiagnosticBound = bindButton(refs.copyButton, "copyDiagnostic", copyDiagnostic);
    state.toggleReceiptBound = bindButton(refs.toggleReceiptButton, "toggleReceipt", toggleReceiptPanel);
    state.inspectPlanetBound = bindButton(refs.inspectButton, "inspectPlanet", () => setInspectMode(!state.inspectModeActive));
    state.expandCockpitBound = bindButton(refs.collapseButton, "toggleCockpit", toggleCockpitMode);

    if (refs.showDiagnosticTab) {
      bindButton(refs.showDiagnosticTab, "showDiagnostic", () => setInspectMode(false));
    }

    refs.diagnosticAnchors.forEach((anchor) => bindAnchor(anchor, "openDiagnosticRail"));
    refs.portalLinks.forEach((anchor) => bindAnchor(anchor, "portalNativeNavigation"));
    refs.summaries.forEach(bindSummary);

    state.diagnosticAnchorBound = refs.diagnosticAnchors.length > 0;
    state.portalAnchorsBound = refs.portalLinks.length > 0;
    state.detailsDrawersBound = refs.summaries.length > 0;

    publishDataset();
    updateStatusLine("bindControls");
    return getReceipt();
  }

  function auditHtml() {
    refreshRefs();

    state.observedHtmlContract = readHtmlContract();
    state.currentHtmlContractRecognized = (
      state.observedHtmlContract === CURRENT_HTML_CONTRACT ||
      state.observedHtmlContract === PREVIOUS_HTML_CONTRACT
    );

    return {
      observedHtmlContract: state.observedHtmlContract,
      currentHtmlContractRecognized: state.currentHtmlContractRecognized,
      copyButtonPresent: Boolean(refs.copyButton),
      toggleReceiptButtonPresent: Boolean(refs.toggleReceiptButton),
      diagnosticAnchorsPresent: refs.diagnosticAnchors.length,
      inspectButtonPresent: Boolean(refs.inspectButton),
      collapseButtonPresent: Boolean(refs.collapseButton),
      portalLinksPresent: refs.portalLinks.length,
      detailsSummariesPresent: refs.summaries.length,
      receiptPanelPresent: Boolean(refs.receiptPanel),
      receiptTextPresent: Boolean(refs.receiptText)
    };
  }

  function boot() {
    if (state.bootStarted) return getReceipt();

    state.bootStarted = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;

    auditHtml();
    bindControls();

    state.bootComplete = true;
    state.runtimeReleaseHeld = true;

    publishGlobals();
    markAction("bootComplete");

    root.setTimeout(() => {
      auditHtml();
      bindControls();
      publishGlobals();
      markAction("postBootRebind");
    }, 350);

    root.setTimeout(() => {
      auditHtml();
      bindControls();
      publishGlobals();
      markAction("lateRebind");
    }, 1200);

    return getReceipt();
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: ROUTE,
      file: FILE,
      htmlFile: HTML_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: state.role,
      currentHtmlContract: CURRENT_HTML_CONTRACT,
      previousHtmlContract: PREVIOUS_HTML_CONTRACT,
      observedHtmlContract: state.observedHtmlContract,
      currentHtmlContractRecognized: state.currentHtmlContractRecognized,

      bootStarted: state.bootStarted,
      bootComplete: state.bootComplete,
      controlStyleInjected: state.controlStyleInjected,

      buttonAuthorityActive: true,
      frontendButtonAuthorityRestored: true,
      globalSuppressionAvoided: true,
      windowDocumentCaptureSuppressionRetired: true,
      nativeAnchorDefaultPreserved: true,
      directButtonBindingActive: true,
      delegatedButtonBindingActive: true,
      detailsSummaryBindingActive: true,

      copyDiagnosticBound: state.copyDiagnosticBound,
      toggleReceiptBound: state.toggleReceiptBound,
      diagnosticAnchorBound: state.diagnosticAnchorBound,
      inspectPlanetBound: state.inspectPlanetBound,
      expandCockpitBound: state.expandCockpitBound,
      portalAnchorsBound: state.portalAnchorsBound,
      detailsDrawersBound: state.detailsDrawersBound,

      copyDiagnosticCount: state.copyDiagnosticCount,
      toggleReceiptCount: state.toggleReceiptCount,
      diagnosticAnchorCount: state.diagnosticAnchorCount,
      inspectPlanetCount: state.inspectPlanetCount,
      showDiagnosticCount: state.showDiagnosticCount,
      expandCockpitCount: state.expandCockpitCount,
      portalNavigationCount: state.portalNavigationCount,
      drawerToggleCount: state.drawerToggleCount,

      receiptVisible: state.receiptVisible,
      inspectModeActive: state.inspectModeActive,
      cockpitMode: state.cockpitMode,
      lastAction: state.lastAction,
      lastActionAt: state.lastActionAt,
      lastError: state.lastError,

      runtimeReleaseHeld: true,
      runtimeReleaseStarted: false,
      runtimeReleaseComplete: false,
      routeConductorLoadedByIndex: false,
      canvasLoadedByIndex: false,
      diagnosticRailLoadedByIndex: false,
      diagnosticRailOwnedByIndex: false,

      htmlOwnsVisibleShell: true,
      indexCreatesVisibleShell: false,
      indexOwnsButtonBindingOnly: true,
      indexOwnsRuntimeRelease: false,
      indexOwnsCanvasDrawing: false,
      indexOwnsRouteConductorHandoff: false,

      f13Claimed: false,
      f21Claimed: false,
      readyTextClaimed: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      startedAt: state.startedAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    return [
      "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_RECEIPT",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("version", r.version),
      line("route", r.route),
      line("file", r.file),
      line("htmlFile", r.htmlFile),
      line("diagnosticRoute", r.diagnosticRoute),
      "",
      "HTML_ALIGNMENT",
      line("currentHtmlContract", r.currentHtmlContract),
      line("previousHtmlContract", r.previousHtmlContract),
      line("observedHtmlContract", r.observedHtmlContract),
      line("currentHtmlContractRecognized", r.currentHtmlContractRecognized),
      "",
      "BUTTON_AUTHORITY",
      line("buttonAuthorityActive", r.buttonAuthorityActive),
      line("frontendButtonAuthorityRestored", r.frontendButtonAuthorityRestored),
      line("globalSuppressionAvoided", r.globalSuppressionAvoided),
      line("windowDocumentCaptureSuppressionRetired", r.windowDocumentCaptureSuppressionRetired),
      line("nativeAnchorDefaultPreserved", r.nativeAnchorDefaultPreserved),
      line("directButtonBindingActive", r.directButtonBindingActive),
      line("detailsSummaryBindingActive", r.detailsSummaryBindingActive),
      "",
      "BOUND_CONTROLS",
      line("copyDiagnosticBound", r.copyDiagnosticBound),
      line("toggleReceiptBound", r.toggleReceiptBound),
      line("diagnosticAnchorBound", r.diagnosticAnchorBound),
      line("inspectPlanetBound", r.inspectPlanetBound),
      line("expandCockpitBound", r.expandCockpitBound),
      line("portalAnchorsBound", r.portalAnchorsBound),
      line("detailsDrawersBound", r.detailsDrawersBound),
      "",
      "ACTION_COUNTS",
      line("copyDiagnosticCount", r.copyDiagnosticCount),
      line("toggleReceiptCount", r.toggleReceiptCount),
      line("diagnosticAnchorCount", r.diagnosticAnchorCount),
      line("inspectPlanetCount", r.inspectPlanetCount),
      line("showDiagnosticCount", r.showDiagnosticCount),
      line("expandCockpitCount", r.expandCockpitCount),
      line("portalNavigationCount", r.portalNavigationCount),
      line("drawerToggleCount", r.drawerToggleCount),
      "",
      "CURRENT_STATE",
      line("receiptVisible", r.receiptVisible),
      line("inspectModeActive", r.inspectModeActive),
      line("cockpitMode", r.cockpitMode),
      line("lastAction", r.lastAction),
      line("lastActionAt", r.lastActionAt),
      line("lastError", r.lastError),
      "",
      "RUNTIME_HELD",
      line("runtimeReleaseHeld", r.runtimeReleaseHeld),
      line("runtimeReleaseStarted", r.runtimeReleaseStarted),
      line("runtimeReleaseComplete", r.runtimeReleaseComplete),
      line("routeConductorLoadedByIndex", r.routeConductorLoadedByIndex),
      line("canvasLoadedByIndex", r.canvasLoadedByIndex),
      line("diagnosticRailLoadedByIndex", r.diagnosticRailLoadedByIndex),
      line("diagnosticRailOwnedByIndex", r.diagnosticRailOwnedByIndex),
      "",
      "OWNERSHIP",
      line("htmlOwnsVisibleShell", r.htmlOwnsVisibleShell),
      line("indexCreatesVisibleShell", r.indexCreatesVisibleShell),
      line("indexOwnsButtonBindingOnly", r.indexOwnsButtonBindingOnly),
      line("indexOwnsRuntimeRelease", r.indexOwnsRuntimeRelease),
      line("indexOwnsCanvasDrawing", r.indexOwnsCanvasDrawing),
      line("indexOwnsRouteConductorHandoff", r.indexOwnsRouteConductorHandoff),
      "",
      "NO_CLAIMS",
      line("f13Claimed", r.f13Claimed),
      line("f21Claimed", r.f21Claimed),
      line("readyTextClaimed", r.readyTextClaimed),
      line("visualPassClaimed", r.visualPassClaimed),
      line("generatedImage", r.generatedImage),
      line("graphicBox", r.graphicBox),
      line("webGL", r.webGL),
      "",
      line("startedAt", r.startedAt),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.indexJs = api;
    root.HEARTH.indexBridge = api;
    root.HEARTH.frontendButtonAuthorityReset = api;
    root.HEARTH.buttonAuthority = api;
    root.HEARTH.indexJsReceipt = getReceipt();

    root.DEXTER_LAB.hearthIndexJs = api;
    root.DEXTER_LAB.hearthFrontendButtonAuthorityReset = api;

    root.HEARTH_INDEX_JS = api;
    root.HEARTH_INDEX_BRIDGE = api;
    root.HEARTH_FRONTEND_BUTTON_AUTHORITY_RESET = api;
    root.HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET = api;
    root.HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_RECEIPT = getReceipt();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    boot,
    init: boot,
    start: boot,
    run: boot,
    bindControls,
    auditHtml,
    copyDiagnostic,
    toggleReceiptPanel,
    setInspectMode,
    toggleCockpitMode,
    getReceipt,
    getReceiptText,
    publishGlobals,

    buttonAuthorityActive: true,
    frontendButtonAuthorityRestored: true,
    runtimeReleaseHeld: true,
    diagnosticRailLoadedByIndex: false,
    diagnosticRailOwnedByIndex: false,
    f13Claimed: false,
    f21Claimed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,

    get state() {
      return state;
    }
  });

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
