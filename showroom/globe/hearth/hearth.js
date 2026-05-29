// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_ANIMATED_LOAD_SCREEN_STATE_MACHINE_TNT_v1
// Full-file replacement.
// Active Hearth route conductor only.
// Purpose:
// - Restore animated Hearth loading screen.
// - Operate live loading progress, percentage, checkmarks, and copyable diagnostic receipt.
// - Consume Runtime Table when present without hard-blocking first visible carrier.
// - Call /assets/hearth/hearth.canvas.js as visible planet carrier authority.
// - Reconcile receipt fields into visible loader phase state.
// - Preserve receipt/loading-screen lifecycle separately from canvas lifecycle.
// Does not own:
// - planet drawing
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology truth
// - material palette
// - canvas pixel rendering
// - runtime motion
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_CONDUCTOR_ANIMATED_LOAD_SCREEN_STATE_MACHINE_TNT_v1";
  const RECEIPT = "HEARTH_ROUTE_CONDUCTOR_ANIMATED_LOAD_SCREEN_STATE_MACHINE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_LOAD_SCREEN_CANVAS_HANDOFF_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_DYNAMIC_ROUTE_CONDUCTOR_RUNTIME_TABLE_CANVAS_REBALANCE_PREGAME_TO_POSTGAME_BINDING_v1";
  const VERSION = "2026-05-29.hearth-route-conductor-animated-load-screen-state-machine-v1";

  const ROUTE = "/showroom/globe/hearth/";
  const DESTINATION_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_AUTHORITY_FILE = "/assets/hearth/hearth.canvas.js";
  const RUNTIME_TABLE_FILE = "/assets/lab/runtime-table.js";
  const RETIRED_CLIMATE_ROUTE = "/showroom/globe/hearth/hearth.climate.route.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const PHASE_STATE = Object.freeze({
    PENDING: "PENDING",
    LOADING: "LOADING",
    READY: "READY",
    DEGRADED: "DEGRADED",
    HELD: "HELD",
    FAILED: "FAILED"
  });

  const POSTGAME_STATUS = Object.freeze({
    LOADING_SCREEN_ACTIVE: "LOADING_SCREEN_ACTIVE",
    ANIMATED_STATE_MACHINE_ACTIVE: "ANIMATED_STATE_MACHINE_ACTIVE",
    CANVAS_HANDOFF_IN_PROGRESS: "CANVAS_HANDOFF_IN_PROGRESS",
    VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_READY: "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_READY",
    VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_DEGRADED: "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_DEGRADED",
    VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING: "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING",
    VISIBLE_CARRIER_ACTIVE_SOURCE_HELD: "VISIBLE_CARRIER_ACTIVE_SOURCE_HELD",
    LOADING_SEQUENCE_COMPLETE_DIAGNOSTIC_READY: "LOADING_SEQUENCE_COMPLETE_DIAGNOSTIC_READY",
    BLOCKED_CARRIER_STRUCTURAL_FAILURE: "BLOCKED_CARRIER_STRUCTURAL_FAILURE"
  });

  const PHASES = [
    {
      key: "shell",
      label: "Shell mounted",
      floor: 12,
      pendingText: "Route shell pending",
      loadingText: "Route shell mounting",
      readyText: "Route shell mounted"
    },
    {
      key: "runtimeTable",
      label: "Lab Runtime Table",
      floor: 28,
      pendingText: "Runtime Table pending",
      loadingText: "Runtime Table checking",
      readyText: "Runtime Table ready",
      degradedText: "Runtime Table degraded / optional"
    },
    {
      key: "sourceStack",
      label: "Source stack",
      floor: 42,
      pendingText: "Source stack pending",
      loadingText: "Source stack checking",
      readyText: "Source stack held",
      heldText: "Source stack held"
    },
    {
      key: "canvasCarrier",
      label: "Canvas carrier",
      floor: 62,
      pendingText: "Canvas carrier pending",
      loadingText: "Canvas carrier loading",
      readyText: "Canvas carrier ready",
      failedText: "Canvas carrier failed"
    },
    {
      key: "touch",
      label: "Touch / drag inspection",
      floor: 76,
      pendingText: "Touch inspection pending",
      loadingText: "Touch inspection binding",
      readyText: "Touch inspection ready",
      degradedText: "Touch inspection degraded"
    },
    {
      key: "visiblePlanet",
      label: "Visible planet",
      floor: 90,
      pendingText: "Visible planet pending",
      loadingText: "Visible planet forming",
      readyText: "Visible planet ready",
      degradedText: "Visible planet degraded"
    },
    {
      key: "diagnosticReceipt",
      label: "Diagnostic receipt",
      floor: 100,
      pendingText: "Diagnostic receipt pending",
      loadingText: "Diagnostic receipt preparing",
      readyText: "Diagnostic receipt ready"
    }
  ];

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,

    routeShellLoaded: false,
    activeRouteConductor: DESTINATION_FILE,
    retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
    retiredClimateRouteActiveCarrier: false,

    loadingScreenMounted: false,
    loadingScreenVisible: true,
    animatedStateMachineActive: false,
    receiptOverlayIndependent: true,
    loadingScreenReceiptCopyEnabled: true,
    receiptExpanded: false,
    receiptVisible: true,

    progress: 0,
    targetProgress: 0,
    displayProgress: 0,

    canvasMountPresent: false,
    canvasAuthority: CANVAS_AUTHORITY_FILE,
    canvasApiPresent: false,
    canvasScriptRequested: false,
    canvasScriptLoaded: false,
    canvasScriptError: "",
    canvasCarrierRequested: false,
    canvasCarrierMounted: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",
    canvasCarrierMethod: "",

    runtimeTable: RUNTIME_TABLE_FILE,
    runtimeTableOptional: true,
    runtimeTablePresent: false,
    runtimeTableMode: "RUNTIME_TABLE_PENDING",
    runtimeTablePlanAttempted: false,
    runtimeTablePlanCreated: false,
    runtimeTablePlanError: "",
    runtimeTablePlan: null,
    runtimeTableMissingDoesNotBlockCarrier: true,

    sourceAuthorityHeld: true,
    visibleCarrierFirst: true,
    wideProbeDeferred: true,
    singleAnchorIsLocalProofOnly: true,

    dragInspectionBound: false,
    imageRendered: false,
    coherentExpressionPass: false,
    visualPassClaimed: false,

    postgameStatus: POSTGAME_STATUS.LOADING_SCREEN_ACTIVE,
    firstFailedCoordinate: "STATE_MACHINE_STARTING",
    recommendedNextRenewalTarget: "canvas-handoff-progress-reconciliation",

    generatedImage: false,
    graphicBox: false,
    webGL: false,

    phaseStates: {},
    events: [],
    errors: [],
    startedAt: "",
    updatedAt: ""
  };

  const nodes = {
    mount: null,
    overlay: null,
    panel: null,
    title: null,
    subtitle: null,
    progressBar: null,
    progressFill: null,
    progressPercent: null,
    phaseList: null,
    receipt: null,
    receiptPre: null,
    copyButton: null,
    expandButton: null,
    toggleButton: null
  };

  let raf = 0;
  let reconcileTimers = [];
  let canvasBootAttempted = false;

  PHASES.forEach((phase) => {
    state.phaseStates[phase.key] = {
      key: phase.key,
      label: phase.label,
      state: PHASE_STATE.PENDING,
      text: phase.pendingText,
      floor: phase.floor,
      complete: false,
      at: ""
    };
  });

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function bool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
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
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
  }

  function emit(event, detail = {}) {
    const entry = {
      event,
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.events.push(entry);
    state.updatedAt = entry.at;

    if (state.events.length > 80) {
      state.events.splice(0, state.events.length - 80);
    }

    publishDataset();
    return entry;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      code,
      message,
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.errors.push(item);

    if (state.errors.length > 30) {
      state.errors.splice(0, state.errors.length - 30);
    }

    emit("ERROR", item);
    return item;
  }

  function getDataset() {
    return doc && doc.documentElement ? doc.documentElement.dataset : null;
  }

  function setPhase(key, nextState, text, eventName) {
    const phaseDef = PHASES.find((phase) => phase.key === key);
    const phase = state.phaseStates[key];

    if (!phase || !phaseDef) return;

    if (
      phase.state === nextState &&
      (!text || phase.text === text)
    ) {
      return;
    }

    phase.state = nextState;
    phase.text = text || phaseDef[`${String(nextState).toLowerCase()}Text`] || phaseDef.readyText || phase.label;
    phase.complete = nextState === PHASE_STATE.READY || nextState === PHASE_STATE.HELD || nextState === PHASE_STATE.DEGRADED;
    phase.at = nowIso();

    if (phase.complete) {
      state.targetProgress = Math.max(state.targetProgress, phaseDef.floor);
    }

    if (nextState === PHASE_STATE.LOADING) {
      state.targetProgress = Math.max(state.targetProgress, Math.max(0, phaseDef.floor - 8));
    }

    emit(eventName || `PHASE_${key.toUpperCase()}_${nextState}`, {
      key,
      state: nextState,
      text: phase.text,
      targetProgress: state.targetProgress
    });

    renderLoader();
  }

  function phaseIcon(phase) {
    if (!phase) return "○";

    switch (phase.state) {
      case PHASE_STATE.READY:
        return "✓";
      case PHASE_STATE.DEGRADED:
        return "!";
      case PHASE_STATE.HELD:
        return "–";
      case PHASE_STATE.FAILED:
        return "×";
      case PHASE_STATE.LOADING:
        return "•";
      case PHASE_STATE.PENDING:
      default:
        return "○";
    }
  }

  function phaseClass(phase) {
    if (!phase) return "pending";
    return String(phase.state || "pending").toLowerCase();
  }

  function guardRetiredClimateRoute() {
    root.__HEARTH_ACTIVE_ROUTE_FILE__ = DESTINATION_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR__ = DESTINATION_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE__ = RETIRED_CLIMATE_ROUTE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE_ACTIVE_CARRIER__ = false;

    if (doc && doc.documentElement) {
      const dataset = doc.documentElement.dataset;
      dataset.hearthActiveRouteFile = DESTINATION_FILE;
      dataset.hearthActiveRouteConductor = DESTINATION_FILE;
      dataset.hearthActiveRouteContract = CONTRACT;
      dataset.hearthRetiredClimateRoute = RETIRED_CLIMATE_ROUTE;
      dataset.hearthRetiredClimateRouteActiveCarrier = "false";
    }

    emit("RETIRED_CLIMATE_ROUTE_GUARDED", {
      retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
      retiredClimateRouteActiveCarrier: false
    });
  }

  function ensureMount() {
    if (!doc) return null;

    let mount =
      doc.getElementById("hearthCanvasMount") ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]");

    if (!mount) {
      mount = doc.createElement("section");
      mount.id = "hearthCanvasMount";
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.hearthCanvasMountCreatedByConductor = "true";

      const parent = doc.getElementById("hearth-main") || doc.body || doc.documentElement;
      parent.appendChild(mount);
    }

    mount.id = mount.id || "hearthCanvasMount";
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthConductorContract = CONTRACT;
    mount.dataset.hearthConductorReceipt = RECEIPT;
    mount.dataset.hearthLoadingScreenMounted = String(state.loadingScreenMounted);
    mount.dataset.hearthVisibleCarrierFirst = "true";
    mount.dataset.hearthRuntimeTableOptional = "true";
    mount.dataset.hearthRuntimeTableMissingDoesNotBlockCarrier = "true";
    mount.dataset.hearthReceiptOverlayIndependent = "true";

    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = mount.style.overflow || "hidden";
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";

    state.canvasMountPresent = true;
    nodes.mount = mount;

    return mount;
  }

  function cssText() {
    return `
      .hearth-loading-overlay{
        position:absolute;
        inset:0;
        z-index:18;
        pointer-events:none;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        padding:16px;
        background:
          radial-gradient(circle at 50% 38%, rgba(141,216,255,.08), transparent 38%),
          linear-gradient(180deg, rgba(1,4,10,.08), rgba(1,4,10,.36));
      }

      .hearth-loading-overlay[data-hidden="true"]{
        opacity:0;
        visibility:hidden;
      }

      .hearth-loading-panel{
        pointer-events:auto;
        width:min(100%, 560px);
        max-height:min(82%, 620px);
        overflow:hidden;
        border:1px solid rgba(231,188,105,.34);
        border-radius:22px;
        background:
          radial-gradient(circle at 10% 0%, rgba(231,188,105,.14), transparent 18rem),
          radial-gradient(circle at 90% 20%, rgba(141,216,255,.12), transparent 18rem),
          linear-gradient(180deg, rgba(9,22,41,.96), rgba(3,8,16,.94));
        box-shadow:
          0 24px 80px rgba(0,0,0,.48),
          inset 0 1px 0 rgba(255,255,255,.08);
        backdrop-filter:blur(12px);
        color:#eef6ff;
        font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .hearth-loading-panel[data-collapsed="true"]{
        max-width:360px;
      }

      .hearth-loading-head{
        display:grid;
        gap:6px;
        padding:16px 16px 12px;
        border-bottom:1px solid rgba(231,188,105,.16);
      }

      .hearth-loading-kicker{
        color:#e7bc69;
        font-size:.68rem;
        font-weight:950;
        letter-spacing:.16em;
        text-transform:uppercase;
      }

      .hearth-loading-title{
        margin:0;
        color:rgba(255,244,216,.98);
        font-size:clamp(1.1rem, 3vw, 1.55rem);
        line-height:1;
        letter-spacing:-.04em;
        font-weight:950;
      }

      .hearth-loading-subtitle{
        color:rgba(238,246,255,.72);
        font-size:.82rem;
        line-height:1.36;
        font-weight:720;
      }

      .hearth-progress-wrap{
        display:grid;
        grid-template-columns:1fr auto;
        align-items:center;
        gap:10px;
        padding:0 16px 14px;
      }

      .hearth-progress-track{
        position:relative;
        height:12px;
        overflow:hidden;
        border:1px solid rgba(141,216,255,.18);
        border-radius:999px;
        background:rgba(1,4,10,.72);
      }

      .hearth-progress-track::after{
        content:"";
        position:absolute;
        inset:0;
        background:linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
        transform:translateX(-100%);
        animation:hearth-progress-sheen 1.25s linear infinite;
      }

      .hearth-progress-fill{
        position:absolute;
        inset:0 auto 0 0;
        width:0%;
        border-radius:999px;
        background:linear-gradient(90deg, #8dd8ff, #e7bc69, #ffe8a3);
        box-shadow:0 0 22px rgba(231,188,105,.22);
        transition:width .16s ease-out;
      }

      .hearth-progress-percent{
        min-width:42px;
        text-align:right;
        color:#ffe8a3;
        font:950 .82rem/1 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
      }

      .hearth-phase-list{
        display:grid;
        gap:7px;
        padding:0 16px 14px;
      }

      .hearth-phase-row{
        display:grid;
        grid-template-columns:26px minmax(0,1fr) auto;
        gap:9px;
        align-items:center;
        min-height:34px;
        padding:8px 10px;
        border:1px solid rgba(255,255,255,.09);
        border-radius:14px;
        background:rgba(255,255,255,.035);
      }

      .hearth-phase-row[data-state="ready"]{
        border-color:rgba(139,215,163,.26);
        background:rgba(139,215,163,.06);
      }

      .hearth-phase-row[data-state="loading"]{
        border-color:rgba(141,216,255,.28);
        background:rgba(141,216,255,.06);
      }

      .hearth-phase-row[data-state="degraded"],
      .hearth-phase-row[data-state="held"]{
        border-color:rgba(231,188,105,.28);
        background:rgba(231,188,105,.06);
      }

      .hearth-phase-row[data-state="failed"]{
        border-color:rgba(255,112,112,.36);
        background:rgba(255,112,112,.07);
      }

      .hearth-phase-icon{
        display:grid;
        place-items:center;
        width:22px;
        height:22px;
        border-radius:999px;
        color:#06101e;
        background:rgba(238,246,255,.55);
        font-weight:950;
        font-size:.78rem;
      }

      .hearth-phase-row[data-state="ready"] .hearth-phase-icon{
        background:#8bd7a3;
      }

      .hearth-phase-row[data-state="loading"] .hearth-phase-icon{
        color:#06101e;
        background:#8dd8ff;
        animation:hearth-loading-pulse .9s ease-in-out infinite alternate;
      }

      .hearth-phase-row[data-state="degraded"] .hearth-phase-icon,
      .hearth-phase-row[data-state="held"] .hearth-phase-icon{
        background:#e7bc69;
      }

      .hearth-phase-row[data-state="failed"] .hearth-phase-icon{
        color:#fff;
        background:#d85d5d;
      }

      .hearth-phase-label{
        display:grid;
        gap:2px;
        min-width:0;
      }

      .hearth-phase-label strong{
        color:rgba(255,244,216,.94);
        font-size:.80rem;
        line-height:1.05;
        letter-spacing:.01em;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }

      .hearth-phase-label span{
        color:rgba(238,246,255,.62);
        font-size:.70rem;
        line-height:1.1;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }

      .hearth-phase-state{
        color:rgba(238,246,255,.70);
        font:900 .64rem/1 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        letter-spacing:.08em;
        text-transform:uppercase;
      }

      .hearth-loading-actions{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        padding:0 16px 14px;
      }

      .hearth-loading-button{
        min-height:32px;
        border:1px solid rgba(231,188,105,.25);
        border-radius:999px;
        padding:7px 10px;
        color:rgba(238,246,255,.86);
        background:rgba(255,255,255,.04);
        font:900 .68rem/1 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        letter-spacing:.08em;
        text-transform:uppercase;
        cursor:pointer;
      }

      .hearth-loading-button:hover{
        border-color:rgba(231,188,105,.52);
        background:rgba(231,188,105,.09);
      }

      .hearth-loading-button.primary{
        color:#06101e;
        background:linear-gradient(135deg,#ffe8a3,#e7bc69);
        border-color:rgba(231,188,105,.72);
      }

      .hearth-receipt-box{
        display:block;
        margin:0 16px 16px;
        max-height:130px;
        overflow:auto;
        border:1px solid rgba(141,216,255,.16);
        border-radius:14px;
        background:rgba(1,4,10,.58);
      }

      .hearth-loading-panel[data-expanded="true"] .hearth-receipt-box{
        max-height:260px;
      }

      .hearth-receipt-box[data-hidden="true"]{
        display:none;
      }

      .hearth-receipt-pre{
        margin:0;
        padding:11px;
        color:rgba(238,246,255,.64);
        font:700 .64rem/1.42 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        white-space:pre-wrap;
      }

      @keyframes hearth-progress-sheen{
        from{transform:translateX(-100%)}
        to{transform:translateX(100%)}
      }

      @keyframes hearth-loading-pulse{
        from{transform:scale(.92); opacity:.72}
        to{transform:scale(1); opacity:1}
      }

      @media (max-width:760px){
        .hearth-loading-overlay{
          padding:10px;
          align-items:flex-end;
        }

        .hearth-loading-panel{
          border-radius:18px;
          max-height:76%;
        }

        .hearth-phase-row{
          grid-template-columns:24px minmax(0,1fr);
        }

        .hearth-phase-state{
          grid-column:2;
        }
      }
    `;
  }

  function ensureStyle() {
    if (!doc) return;

    const existing = doc.getElementById("hearth-conductor-animated-loader-style");
    if (existing) return;

    const style = doc.createElement("style");
    style.id = "hearth-conductor-animated-loader-style";
    style.textContent = cssText();
    doc.head.appendChild(style);
  }

  function mountLoadingScreen() {
    if (!doc) return null;

    ensureStyle();

    const mount = ensureMount();
    if (!mount) return null;

    let overlay = mount.querySelector("[data-hearth-loading-overlay='true']");
    if (overlay) {
      overlay.remove();
    }

    overlay = doc.createElement("aside");
    overlay.className = "hearth-loading-overlay";
    overlay.dataset.hearthLoadingOverlay = "true";
    overlay.dataset.hearthConductorContract = CONTRACT;
    overlay.dataset.receiptOverlayIndependent = "true";

    const panel = doc.createElement("section");
    panel.className = "hearth-loading-panel";
    panel.dataset.hearthLoadingPanel = "true";
    panel.dataset.expanded = "false";
    panel.dataset.collapsed = "false";

    panel.innerHTML = `
      <div class="hearth-loading-head">
        <div class="hearth-loading-kicker">Dexter Lab · Hearth Runtime Table</div>
        <h2 class="hearth-loading-title" data-hearth-loader-title>FORMING HEARTH RUNTIME TABLE</h2>
        <div class="hearth-loading-subtitle" data-hearth-loader-subtitle>
          Animated conductor state machine active. Visible carrier loads first; diagnostics reconcile after proof.
        </div>
      </div>

      <div class="hearth-progress-wrap">
        <div class="hearth-progress-track" aria-label="Hearth loading progress">
          <div class="hearth-progress-fill" data-hearth-progress-fill></div>
        </div>
        <div class="hearth-progress-percent" data-hearth-progress-percent>0%</div>
      </div>

      <div class="hearth-phase-list" data-hearth-phase-list></div>

      <div class="hearth-loading-actions">
        <button class="hearth-loading-button primary" type="button" data-hearth-copy-diagnostic>Copy diagnostic</button>
        <button class="hearth-loading-button" type="button" data-hearth-toggle-receipt>Receipt visible</button>
        <button class="hearth-loading-button" type="button" data-hearth-expand-receipt>Expand receipt</button>
        <button class="hearth-loading-button" type="button" data-hearth-hide-loader>Hide panel</button>
      </div>

      <div class="hearth-receipt-box" data-hearth-receipt-box>
        <pre class="hearth-receipt-pre" data-hearth-receipt-pre></pre>
      </div>
    `;

    overlay.appendChild(panel);
    mount.appendChild(overlay);

    nodes.mount = mount;
    nodes.overlay = overlay;
    nodes.panel = panel;
    nodes.title = panel.querySelector("[data-hearth-loader-title]");
    nodes.subtitle = panel.querySelector("[data-hearth-loader-subtitle]");
    nodes.progressFill = panel.querySelector("[data-hearth-progress-fill]");
    nodes.progressPercent = panel.querySelector("[data-hearth-progress-percent]");
    nodes.phaseList = panel.querySelector("[data-hearth-phase-list]");
    nodes.receipt = panel.querySelector("[data-hearth-receipt-box]");
    nodes.receiptPre = panel.querySelector("[data-hearth-receipt-pre]");
    nodes.copyButton = panel.querySelector("[data-hearth-copy-diagnostic]");
    nodes.expandButton = panel.querySelector("[data-hearth-expand-receipt]");
    nodes.toggleButton = panel.querySelector("[data-hearth-toggle-receipt]");

    const hideButton = panel.querySelector("[data-hearth-hide-loader]");

    if (nodes.copyButton) {
      nodes.copyButton.addEventListener("click", copyDiagnostic);
    }

    if (nodes.expandButton) {
      nodes.expandButton.addEventListener("click", () => {
        state.receiptExpanded = !state.receiptExpanded;
        panel.dataset.expanded = String(state.receiptExpanded);
        nodes.expandButton.textContent = state.receiptExpanded ? "Collapse receipt" : "Expand receipt";
        renderLoader();
        emit("RECEIPT_EXPAND_TOGGLED", { expanded: state.receiptExpanded });
      });
    }

    if (nodes.toggleButton) {
      nodes.toggleButton.addEventListener("click", () => {
        state.receiptVisible = !state.receiptVisible;
        if (nodes.receipt) nodes.receipt.dataset.hidden = String(!state.receiptVisible);
        nodes.toggleButton.textContent = state.receiptVisible ? "Receipt visible" : "Receipt hidden";
        emit("RECEIPT_VISIBILITY_TOGGLED", { visible: state.receiptVisible });
      });
    }

    if (hideButton) {
      hideButton.addEventListener("click", () => {
        state.loadingScreenVisible = false;
        overlay.dataset.hidden = "true";
        emit("LOADING_PANEL_HIDDEN_CANVAS_PRESERVED", {
          canvasCarrierMounted: state.canvasCarrierMounted,
          receiptOverlayIndependent: true
        });
        publishDataset();
      });
    }

    state.loadingScreenMounted = true;
    state.loadingScreenVisible = true;
    state.receiptOverlayIndependent = true;
    state.loadingScreenReceiptCopyEnabled = true;
    state.postgameStatus = POSTGAME_STATUS.LOADING_SCREEN_ACTIVE;

    if (doc.documentElement) {
      doc.documentElement.dataset.hearthLoadingScreenMounted = "true";
      doc.documentElement.dataset.hearthLoadingScreenVisible = "true";
      doc.documentElement.dataset.hearthReceiptOverlayIndependent = "true";
      doc.documentElement.dataset.hearthLoadingScreenReceiptCopyEnabled = "true";
    }

    emit("LOADING_SCREEN_MOUNTED", {
      mountId: mount.id || "hearthCanvasMount",
      receiptOverlayIndependent: true
    });

    renderLoader();

    return overlay;
  }

  function renderPhaseRows() {
    if (!nodes.phaseList) return;

    nodes.phaseList.innerHTML = "";

    PHASES.forEach((phaseDef) => {
      const phase = state.phaseStates[phaseDef.key];
      const row = doc.createElement("div");
      row.className = "hearth-phase-row";
      row.dataset.phase = phaseDef.key;
      row.dataset.state = phaseClass(phase);

      const icon = doc.createElement("div");
      icon.className = "hearth-phase-icon";
      icon.textContent = phaseIcon(phase);

      const label = doc.createElement("div");
      label.className = "hearth-phase-label";

      const strong = doc.createElement("strong");
      strong.textContent = phaseDef.label;

      const span = doc.createElement("span");
      span.textContent = phase.text || phaseDef.pendingText;

      label.appendChild(strong);
      label.appendChild(span);

      const stateNode = doc.createElement("div");
      stateNode.className = "hearth-phase-state";
      stateNode.textContent = phase.state;

      row.appendChild(icon);
      row.appendChild(label);
      row.appendChild(stateNode);

      nodes.phaseList.appendChild(row);
    });
  }

  function renderLoader() {
    if (!nodes.panel) return;

    const rounded = Math.round(state.displayProgress);

    if (nodes.progressFill) {
      nodes.progressFill.style.width = `${clamp(rounded, 0, 100)}%`;
    }

    if (nodes.progressPercent) {
      nodes.progressPercent.textContent = `${clamp(rounded, 0, 100)}%`;
    }

    if (nodes.title) {
      if (state.displayProgress >= 100) {
        nodes.title.textContent = "FORMING HEARTH RUNTIME TABLE";
      } else if (state.canvasCarrierRequested && !state.canvasCarrierMounted) {
        nodes.title.textContent = "Calling Hearth visible carrier";
      } else if (state.canvasCarrierMounted && !state.imageRendered) {
        nodes.title.textContent = "Waiting for visible planet proof";
      } else {
        nodes.title.textContent = "FORMING HEARTH RUNTIME TABLE";
      }
    }

    if (nodes.subtitle) {
      const coherence = state.coherentExpressionPass
        ? "Coherence passed"
        : "Coherence diagnostic pending";

      nodes.subtitle.textContent = state.displayProgress >= 100
        ? `Atlas 100% · ${coherence}. Copy the diagnostic receipt before the next renewal.`
        : `${state.postgameStatus}. Visible carrier first; Runtime Table and wide-probe do not block first render.`;
    }

    renderPhaseRows();

    if (nodes.receiptPre) {
      nodes.receiptPre.textContent = getReceiptText();
    }
  }

  function animateProgress() {
    state.animatedStateMachineActive = true;

    const diff = state.targetProgress - state.displayProgress;

    if (Math.abs(diff) > 0.08) {
      state.displayProgress += diff * 0.075;
    } else {
      state.displayProgress = state.targetProgress;
    }

    state.progress = Math.round(state.displayProgress);

    renderLoader();
    publishDataset();

    raf = root.requestAnimationFrame(animateProgress);
  }

  function startStateMachine() {
    if (raf) return;

    state.startedAt = nowIso();
    state.animatedStateMachineActive = true;
    state.postgameStatus = POSTGAME_STATUS.ANIMATED_STATE_MACHINE_ACTIVE;

    emit("STATE_MACHINE_STARTED", {
      animatedStateMachineActive: true
    });

    raf = root.requestAnimationFrame(animateProgress);
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

  function getCanvasReceipt() {
    const api = getCanvasApi();

    if (api && isFunction(api.getReceipt)) {
      try {
        const receipt = api.getReceipt("hearth-conductor-reconcile");
        if (receipt && isObject(receipt)) return receipt;
      } catch (error) {
        recordError("CANVAS_RECEIPT_READ_FAILED", error && error.message ? error.message : String(error));
      }
    }

    return (
      root.HEARTH_CANVAS_POSTGAME_RECEIPT ||
      root.HEARTH_CANVAS_RECEIPT ||
      null
    );
  }

  function checkRouteShell() {
    state.routeShellLoaded = true;
    setPhase("shell", PHASE_STATE.READY, "Route shell mounted", "SHELL_PHASE_READY");
  }

  function checkRuntimeTable() {
    setPhase("runtimeTable", PHASE_STATE.LOADING, "Runtime Table checking", "RUNTIME_TABLE_CHECK_STARTED");

    const api = getRuntimeTableApi();
    state.runtimeTablePresent = Boolean(api);

    if (!api) {
      state.runtimeTableMode = "RUNTIME_TABLE_MISSING_ALLOWED";
      state.runtimeTablePlanAttempted = false;
      state.runtimeTablePlanCreated = false;
      state.runtimeTablePlanError = "";
      setPhase("runtimeTable", PHASE_STATE.DEGRADED, "Runtime Table missing / optional", "RUNTIME_TABLE_DEGRADED");
      return null;
    }

    state.runtimeTableMode = "RUNTIME_TABLE_READY_OR_DEGRADED";
    state.runtimeTablePlanAttempted = true;

    try {
      let plan = null;

      if (isFunction(api.createHearthVisualCarrierPlan)) {
        plan = api.createHearthVisualCarrierPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 },
          renderMetadata: {
            routeMounted: true,
            canvasMounted: state.canvasMountPresent,
            fallbackShellAvailable: true,
            visibleCarrierAllowed: true,
            sphereContainment: true,
            outsideSphereTransparent: true,
            noRectangularTextureSpill: true
          }
        }, {
          profile: "hearth-channel-expression",
          planetId: "hearth",
          planetLabel: "Hearth"
        });
      } else if (isFunction(api.createVisualCarrierPlan)) {
        plan = api.createVisualCarrierPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 },
          renderMetadata: {
            routeMounted: true,
            canvasMounted: state.canvasMountPresent,
            fallbackShellAvailable: true,
            visibleCarrierAllowed: true,
            sphereContainment: true,
            outsideSphereTransparent: true,
            noRectangularTextureSpill: true
          }
        });
      } else if (isFunction(api.runProceduralPlan)) {
        plan = api.runProceduralPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 }
        });
      }

      state.runtimeTablePlan = plan || null;
      state.runtimeTablePlanCreated = Boolean(plan);
      state.runtimeTablePlanError = "";

      emit("RUNTIME_TABLE_PLAN_CREATED", {
        runtimeTablePresent: true,
        runtimeTablePlanCreated: state.runtimeTablePlanCreated
      });

      setPhase("runtimeTable", PHASE_STATE.READY, "Runtime Table ready", "RUNTIME_TABLE_READY");
      return plan;
    } catch (error) {
      state.runtimeTablePlan = null;
      state.runtimeTablePlanCreated = false;
      state.runtimeTablePlanError = error && error.message ? error.message : String(error);

      recordError("RUNTIME_TABLE_PLAN_ERROR", state.runtimeTablePlanError);

      setPhase("runtimeTable", PHASE_STATE.DEGRADED, "Runtime Table degraded / carrier continues", "RUNTIME_TABLE_DEGRADED");
      return null;
    }
  }

  function holdSourceStack() {
    state.sourceAuthorityHeld = true;
    setPhase("sourceStack", PHASE_STATE.HELD, "Source stack held for this pass", "SOURCE_STACK_HELD_READY");
  }

  function requestCanvasScript() {
    if (!doc || state.canvasScriptRequested) return;

    state.canvasScriptRequested = true;

    const existing = Array.from(doc.scripts || []).some((script) =>
      script.src && script.src.includes(CANVAS_AUTHORITY_FILE)
    );

    if (existing) {
      return;
    }

    const script = doc.createElement("script");
    script.src = `${CANVAS_AUTHORITY_FILE}?v=${encodeURIComponent(CONTRACT)}`;
    script.defer = true;
    script.dataset.hearthCanvasRequestedByConductor = "true";
    script.dataset.hearthConductorContract = CONTRACT;

    script.onload = () => {
      state.canvasScriptLoaded = true;
      state.canvasScriptError = "";
      emit("CANVAS_SCRIPT_LOADED", {
        src: script.src
      });
      callCanvasCarrier();
    };

    script.onerror = () => {
      state.canvasScriptLoaded = false;
      state.canvasScriptError = "Canvas script failed to load.";
      recordError("CANVAS_SCRIPT_LOAD_FAILED", state.canvasScriptError, { src: script.src });
      setPhase("canvasCarrier", PHASE_STATE.FAILED, "Canvas script failed", "CANVAS_HANDOFF_FAILED");
      state.postgameStatus = POSTGAME_STATUS.BLOCKED_CARRIER_STRUCTURAL_FAILURE;
      state.firstFailedCoordinate = "CANVAS_SCRIPT_LOAD_FAILED";
      state.recommendedNextRenewalTarget = "canvas-script-path-or-index-script-order";
      publishDataset();
      renderLoader();
    };

    doc.head.appendChild(script);
  }

  function bestCanvasMethod(api) {
    const methods = [
      "boot",
      "mountVisibleCarrier",
      "bootVisibleCarrier",
      "mount",
      "start",
      "init",
      "render",
      "conduct"
    ];

    return methods.find((name) => isFunction(api && api[name])) || "";
  }

  function canvasHandoffPayload() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      route: ROUTE,
      mountId: "hearthCanvasMount",
      activeRouteConductor: DESTINATION_FILE,
      retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
      runtimeTablePlan: state.runtimeTablePlan,
      visibleCarrierFirst: true,
      runtimeTableOptional: true,
      runtimeTableMissingDoesNotBlockCarrier: true,
      wideProbeDeferred: true,
      sourceAuthorityHeld: true,
      singleAnchorIsLocalProofOnly: true,
      loadingScreenMounted: state.loadingScreenMounted,
      receiptOverlayIndependent: true,
      callbacks: {
        onMounted: (receipt) => {
          state.canvasCarrierMounted = true;
          state.canvasCarrierHandoffOk = true;
          state.canvasCarrierHandoffError = "";
          emit("CANVAS_HANDOFF_READY", { callback: "onMounted" });
          reconcileFromCanvasReceipt(receipt);
        },
        onRendered: (receipt) => {
          state.imageRendered = true;
          emit("IMAGE_RENDERED_READY", { callback: "onRendered" });
          reconcileFromCanvasReceipt(receipt);
        }
      }
    };
  }

  function callCanvasCarrier() {
    if (canvasBootAttempted) {
      reconcileAll("canvas-call-already-attempted");
      return;
    }

    const api = getCanvasApi();
    state.canvasApiPresent = Boolean(api);

    if (!api) {
      state.canvasCarrierRequested = false;
      setPhase("canvasCarrier", PHASE_STATE.LOADING, "Canvas API pending", "CANVAS_API_PENDING");
      requestCanvasScript();
      publishDataset();
      return;
    }

    const method = bestCanvasMethod(api);

    if (!method) {
      state.canvasCarrierHandoffError = "Canvas API present but no supported carrier method exists.";
      recordError("CANVAS_METHOD_MISSING", state.canvasCarrierHandoffError);
      setPhase("canvasCarrier", PHASE_STATE.FAILED, "Canvas carrier method missing", "CANVAS_HANDOFF_FAILED");
      state.postgameStatus = POSTGAME_STATUS.BLOCKED_CARRIER_STRUCTURAL_FAILURE;
      state.firstFailedCoordinate = "CANVAS_METHOD_MISSING";
      state.recommendedNextRenewalTarget = "canvas-export-method-renewal";
      return;
    }

    canvasBootAttempted = true;
    state.canvasCarrierRequested = true;
    state.canvasCarrierMethod = method;
    state.canvasCarrierHandoffError = "";
    state.postgameStatus = POSTGAME_STATUS.CANVAS_HANDOFF_IN_PROGRESS;

    setPhase("canvasCarrier", PHASE_STATE.LOADING, "Canvas carrier loading", "CANVAS_HANDOFF_STARTED");

    try {
      const result = api[method](canvasHandoffPayload());

      state.canvasCarrierHandoffOk = true;
      state.canvasCarrierHandoffError = "";

      emit("CANVAS_CARRIER_CALLED", {
        method,
        resultType: typeof result
      });

      reconcileFromCanvasReceipt(result && isObject(result) ? result : getCanvasReceipt());
    } catch (error) {
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);

      recordError("CANVAS_HANDOFF_ERROR", state.canvasCarrierHandoffError, { method });

      setPhase("canvasCarrier", PHASE_STATE.FAILED, "Canvas handoff failed", "CANVAS_HANDOFF_FAILED");
      state.postgameStatus = POSTGAME_STATUS.BLOCKED_CARRIER_STRUCTURAL_FAILURE;
      state.firstFailedCoordinate = "CANVAS_HANDOFF_ERROR";
      state.recommendedNextRenewalTarget = "canvas-handoff-method-or-payload-renewal";
    }

    publishDataset();
    renderLoader();
  }

  function reconcileFromDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;
    const mount = nodes.mount || ensureMount();

    state.canvasMountPresent = Boolean(mount);

    state.dragInspectionBound = bool(dataset.hearthDragInspectionBound) || bool(dataset.hearthControlsBound) || state.dragInspectionBound;
    state.imageRendered = bool(dataset.hearthImageRendered) || bool(dataset.hearthCanvasImageRendered) || state.imageRendered;
    state.canvasCarrierMounted = bool(dataset.hearthCanvasCarrierMounted) || bool(dataset.hearthVisibleCarrierMounted) || state.canvasCarrierMounted;

    if (mount) {
      state.canvasCarrierMounted = Boolean(mount.querySelector("canvas")) || bool(mount.dataset.hearthCanvasMounted) || bool(mount.dataset.hearthVisibleCarrierMounted) || state.canvasCarrierMounted;
      state.dragInspectionBound = bool(mount.dataset.hearthDragInspectionBound) || bool(mount.dataset.hearthControlsBound) || state.dragInspectionBound;
    }

    state.canvasApiPresent = Boolean(getCanvasApi());
    state.runtimeTablePresent = Boolean(getRuntimeTableApi());

    if (state.runtimeTablePresent && state.runtimeTableMode === "RUNTIME_TABLE_PENDING") {
      state.runtimeTableMode = "RUNTIME_TABLE_READY_OR_DEGRADED";
    }
  }

  function reconcileFromCanvasReceipt(receipt) {
    const canvasReceipt = receipt && isObject(receipt) ? receipt : getCanvasReceipt();

    if (canvasReceipt && isObject(canvasReceipt)) {
      state.canvasCarrierMounted = Boolean(
        canvasReceipt.canvasCarrierMounted ||
        canvasReceipt.visibleCarrierMounted ||
        canvasReceipt.mounted ||
        state.canvasCarrierMounted
      );

      state.canvasCarrierHandoffOk = Boolean(
        state.canvasCarrierHandoffOk ||
        canvasReceipt.canvasCarrierMounted ||
        canvasReceipt.visibleCarrierMounted ||
        canvasReceipt.mounted
      );

      state.dragInspectionBound = Boolean(
        state.dragInspectionBound ||
        canvasReceipt.dragInspectionBound ||
        canvasReceipt.pointerControlsBound
      );

      state.imageRendered = Boolean(
        state.imageRendered ||
        canvasReceipt.imageRendered ||
        canvasReceipt.frames > 0
      );

      if (canvasReceipt.postgameStatus) {
        state.postgameStatus = state.runtimeTablePresent
          ? POSTGAME_STATUS.VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_READY
          : POSTGAME_STATUS.VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING;
      }
    }

    reconcileAll("canvas-receipt-reconcile");
  }

  function reconcileAll(reason = "manual-reconcile") {
    reconcileFromDataset();

    const canvasReceipt = getCanvasReceipt();
    if (canvasReceipt && isObject(canvasReceipt)) {
      state.canvasCarrierMounted = Boolean(
        canvasReceipt.canvasCarrierMounted ||
        canvasReceipt.visibleCarrierMounted ||
        canvasReceipt.mounted ||
        state.canvasCarrierMounted
      );

      state.canvasCarrierHandoffOk = Boolean(
        canvasReceipt.canvasCarrierMounted ||
        canvasReceipt.visibleCarrierMounted ||
        canvasReceipt.mounted ||
        state.canvasCarrierHandoffOk
      );

      state.dragInspectionBound = Boolean(
        canvasReceipt.dragInspectionBound ||
        canvasReceipt.pointerControlsBound ||
        state.dragInspectionBound
      );

      state.imageRendered = Boolean(
        canvasReceipt.imageRendered ||
        Number(canvasReceipt.frames || 0) > 0 ||
        state.imageRendered
      );
    }

    if (state.routeShellLoaded) {
      setPhase("shell", PHASE_STATE.READY, "Route shell mounted", "SHELL_PHASE_READY");
    }

    if (state.runtimeTablePresent) {
      setPhase("runtimeTable", PHASE_STATE.READY, "Runtime Table ready", "RUNTIME_TABLE_READY");
    } else if (state.runtimeTableMode === "RUNTIME_TABLE_MISSING_ALLOWED") {
      setPhase("runtimeTable", PHASE_STATE.DEGRADED, "Runtime Table missing / optional", "RUNTIME_TABLE_DEGRADED");
    }

    if (state.sourceAuthorityHeld) {
      setPhase("sourceStack", PHASE_STATE.HELD, "Source stack held for this pass", "SOURCE_STACK_HELD_READY");
    }

    if (state.canvasCarrierRequested && !state.canvasCarrierMounted) {
      setPhase("canvasCarrier", PHASE_STATE.LOADING, "Canvas carrier loading", "CANVAS_HANDOFF_IN_PROGRESS");
    }

    if (state.canvasCarrierMounted && state.canvasCarrierHandoffOk) {
      setPhase("canvasCarrier", PHASE_STATE.READY, "Canvas carrier ready", "CANVAS_HANDOFF_READY");
    }

    if (state.dragInspectionBound) {
      setPhase("touch", PHASE_STATE.READY, "Touch inspection ready", "DRAG_INSPECTION_READY");
    } else if (state.canvasCarrierMounted) {
      setPhase("touch", PHASE_STATE.LOADING, "Touch inspection checking", "DRAG_INSPECTION_CHECKING");
    }

    if (state.imageRendered) {
      setPhase("visiblePlanet", PHASE_STATE.READY, "Visible planet ready", "IMAGE_RENDERED_READY");
    } else if (state.canvasCarrierMounted) {
      setPhase("visiblePlanet", PHASE_STATE.LOADING, "Visible planet forming", "IMAGE_RENDERING_PENDING");
    }

    if (state.loadingScreenReceiptCopyEnabled) {
      setPhase("diagnosticReceipt", PHASE_STATE.READY, "Diagnostic receipt ready", "DIAGNOSTIC_RECEIPT_READY");
    }

    if (state.imageRendered && state.canvasCarrierMounted && state.loadingScreenReceiptCopyEnabled) {
      state.targetProgress = 100;
      state.postgameStatus = POSTGAME_STATUS.LOADING_SEQUENCE_COMPLETE_DIAGNOSTIC_READY;
      state.firstFailedCoordinate = "NONE_VISIBLE_CARRIER_PRESENT";
      state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";

      emit("LOADING_SEQUENCE_COMPLETE", {
        reason,
        progress: state.targetProgress,
        imageRendered: state.imageRendered,
        visualPassClaimed: false
      });
    } else if (state.canvasCarrierMounted) {
      state.postgameStatus = state.runtimeTablePresent
        ? POSTGAME_STATUS.VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_READY
        : POSTGAME_STATUS.VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING;
      state.firstFailedCoordinate = state.imageRendered ? "DIAGNOSTIC_RECEIPT_PENDING" : "IMAGE_RENDERED_NOT_CONFIRMED";
      state.recommendedNextRenewalTarget = state.imageRendered
        ? "diagnostic-receipt-finalization"
        : "canvas-render-frame-confirmation";
    }

    publishDataset();
    renderLoader();
  }

  function scheduleReconciliations() {
    [80, 250, 600, 1000, 1600, 2500, 4000].forEach((ms) => {
      const timer = root.setTimeout(() => reconcileAll(`post-load-${ms}ms`), ms);
      reconcileTimers.push(timer);
    });
  }

  function publishDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthConductorLoaded = "true";
    dataset.hearthRouteConductorLoaded = "true";
    dataset.hearthJsConductorLoaded = "true";
    dataset.hearthConductorContract = CONTRACT;
    dataset.hearthConductorReceipt = RECEIPT;
    dataset.hearthConductorPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthConductorBaselineContract = BASELINE_CONTRACT;
    dataset.hearthConductorVersion = VERSION;
    dataset.hearthActiveRouteFile = DESTINATION_FILE;
    dataset.hearthActiveRouteConductor = DESTINATION_FILE;
    dataset.hearthActiveRouteContract = CONTRACT;

    dataset.hearthRetiredClimateRoute = RETIRED_CLIMATE_ROUTE;
    dataset.hearthRetiredClimateRouteActiveCarrier = "false";

    dataset.hearthLoadingScreenMounted = String(state.loadingScreenMounted);
    dataset.hearthLoadingScreenVisible = String(state.loadingScreenVisible);
    dataset.hearthAnimatedStateMachineActive = String(state.animatedStateMachineActive);
    dataset.hearthProgress = String(Math.round(state.displayProgress));
    dataset.hearthTargetProgress = String(Math.round(state.targetProgress));

    dataset.hearthReceiptOverlayIndependent = "true";
    dataset.hearthLoadingScreenReceiptCopyEnabled = "true";

    dataset.hearthCanvasMountPresent = String(state.canvasMountPresent);
    dataset.hearthCanvasAuthority = CANVAS_AUTHORITY_FILE;
    dataset.hearthCanvasApiPresent = String(state.canvasApiPresent);
    dataset.hearthCanvasScriptRequested = String(state.canvasScriptRequested);
    dataset.hearthCanvasScriptLoaded = String(state.canvasScriptLoaded);
    dataset.hearthCanvasCarrierRequested = String(state.canvasCarrierRequested);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthCanvasCarrierHandoffOk = String(state.canvasCarrierHandoffOk);
    dataset.hearthCanvasCarrierMethod = state.canvasCarrierMethod;

    dataset.hearthRuntimeTable = RUNTIME_TABLE_FILE;
    dataset.hearthRuntimeTableOptional = "true";
    dataset.hearthRuntimeTablePresent = String(state.runtimeTablePresent);
    dataset.hearthRuntimeTableMode = state.runtimeTableMode;
    dataset.hearthRuntimeTablePlanAttempted = String(state.runtimeTablePlanAttempted);
    dataset.hearthRuntimeTablePlanCreated = String(state.runtimeTablePlanCreated);
    dataset.hearthRuntimeTableMissingDoesNotBlockCarrier = "true";

    dataset.hearthSourceAuthorityHeld = "true";
    dataset.hearthVisibleCarrierFirst = "true";
    dataset.hearthWideProbeDeferred = "true";
    dataset.hearthSingleAnchorIsLocalProofOnly = "true";

    dataset.hearthDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthImageRendered = String(state.imageRendered);
    dataset.hearthCoherentExpressionPass = "false";
    dataset.hearthVisualPassClaimed = "false";

    dataset.hearthPostgameStatus = state.postgameStatus;
    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    root.HEARTH_ROUTE_CONDUCTOR_POSTGAME_RECEIPT = getReceipt();
    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = root.HEARTH_ROUTE_CONDUCTOR_POSTGAME_RECEIPT;
    root.HEARTH_ROUTE_CONDUCTOR_CONTRACT = CONTRACT;
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      route: ROUTE,
      destinationFile: DESTINATION_FILE,

      routeShellLoaded: state.routeShellLoaded,
      activeRouteConductor: DESTINATION_FILE,
      retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
      retiredClimateRouteActiveCarrier: false,

      loadingScreenMounted: state.loadingScreenMounted,
      loadingScreenVisible: state.loadingScreenVisible,
      animatedStateMachineActive: state.animatedStateMachineActive,
      progress: Math.round(state.displayProgress),
      targetProgress: Math.round(state.targetProgress),
      displayProgress: Number(state.displayProgress.toFixed(2)),
      phaseStates: clonePlain(state.phaseStates),

      receiptOverlayIndependent: true,
      loadingScreenReceiptCopyEnabled: true,

      canvasMountPresent: state.canvasMountPresent,
      canvasAuthority: CANVAS_AUTHORITY_FILE,
      canvasApiPresent: state.canvasApiPresent,
      canvasScriptRequested: state.canvasScriptRequested,
      canvasScriptLoaded: state.canvasScriptLoaded,
      canvasScriptError: state.canvasScriptError,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      canvasCarrierMethod: state.canvasCarrierMethod,

      runtimeTable: RUNTIME_TABLE_FILE,
      runtimeTableOptional: true,
      runtimeTablePresent: state.runtimeTablePresent,
      runtimeTableMode: state.runtimeTableMode,
      runtimeTablePlanAttempted: state.runtimeTablePlanAttempted,
      runtimeTablePlanCreated: state.runtimeTablePlanCreated,
      runtimeTablePlanError: state.runtimeTablePlanError,
      runtimeTableMissingDoesNotBlockCarrier: true,

      sourceAuthorityHeld: true,
      visibleCarrierFirst: true,
      wideProbeDeferred: true,
      singleAnchorIsLocalProofOnly: true,

      dragInspectionBound: state.dragInspectionBound,
      imageRendered: state.imageRendered,
      coherentExpressionPass: false,
      visualPassClaimed: false,

      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,

      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function phaseReceiptText() {
    return PHASES.map((phaseDef) => {
      const phase = state.phaseStates[phaseDef.key];
      return `- ${phaseDef.label}: ${phase.state} :: ${phase.text}`;
    }).join("\n");
  }

  function getReceiptText() {
    const receipt = getReceipt();

    const events = receipt.events.map((entry) => `- ${entry.at} :: ${entry.event}`).join("\n") || "- none";
    const errors = receipt.errors.map((entry) => `- ${entry.at} :: ${entry.code} :: ${entry.message}`).join("\n") || "- none";

    return [
      "HEARTH_ROUTE_CONDUCTOR_ANIMATED_LOAD_SCREEN_STATE_MACHINE_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `route=${receipt.route}`,
      "",
      `routeShellLoaded=${receipt.routeShellLoaded}`,
      `activeRouteConductor=${receipt.activeRouteConductor}`,
      `retiredClimateRoute=${receipt.retiredClimateRoute}`,
      `retiredClimateRouteActiveCarrier=${receipt.retiredClimateRouteActiveCarrier}`,
      "",
      `loadingScreenMounted=${receipt.loadingScreenMounted}`,
      `loadingScreenVisible=${receipt.loadingScreenVisible}`,
      `animatedStateMachineActive=${receipt.animatedStateMachineActive}`,
      `progress=${receipt.progress}`,
      `targetProgress=${receipt.targetProgress}`,
      `displayProgress=${receipt.displayProgress}`,
      `receiptOverlayIndependent=${receipt.receiptOverlayIndependent}`,
      `loadingScreenReceiptCopyEnabled=${receipt.loadingScreenReceiptCopyEnabled}`,
      "",
      "PHASE_STATES",
      phaseReceiptText(),
      "",
      `canvasMountPresent=${receipt.canvasMountPresent}`,
      `canvasAuthority=${receipt.canvasAuthority}`,
      `canvasApiPresent=${receipt.canvasApiPresent}`,
      `canvasScriptRequested=${receipt.canvasScriptRequested}`,
      `canvasScriptLoaded=${receipt.canvasScriptLoaded}`,
      `canvasScriptError=${receipt.canvasScriptError}`,
      `canvasCarrierRequested=${receipt.canvasCarrierRequested}`,
      `canvasCarrierMounted=${receipt.canvasCarrierMounted}`,
      `canvasCarrierHandoffOk=${receipt.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${receipt.canvasCarrierHandoffError}`,
      `canvasCarrierMethod=${receipt.canvasCarrierMethod}`,
      "",
      `runtimeTable=${receipt.runtimeTable}`,
      `runtimeTableOptional=${receipt.runtimeTableOptional}`,
      `runtimeTablePresent=${receipt.runtimeTablePresent}`,
      `runtimeTableMode=${receipt.runtimeTableMode}`,
      `runtimeTablePlanAttempted=${receipt.runtimeTablePlanAttempted}`,
      `runtimeTablePlanCreated=${receipt.runtimeTablePlanCreated}`,
      `runtimeTablePlanError=${receipt.runtimeTablePlanError}`,
      `runtimeTableMissingDoesNotBlockCarrier=${receipt.runtimeTableMissingDoesNotBlockCarrier}`,
      "",
      `sourceAuthorityHeld=${receipt.sourceAuthorityHeld}`,
      `visibleCarrierFirst=${receipt.visibleCarrierFirst}`,
      `wideProbeDeferred=${receipt.wideProbeDeferred}`,
      `singleAnchorIsLocalProofOnly=${receipt.singleAnchorIsLocalProofOnly}`,
      "",
      `dragInspectionBound=${receipt.dragInspectionBound}`,
      `imageRendered=${receipt.imageRendered}`,
      `coherentExpressionPass=${receipt.coherentExpressionPass}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      "",
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
      "",
      "SOURCE_STACK_HELD",
      "- /assets/hearth/hearth.tectonics.js",
      "- /assets/hearth/hearth.elevation.js",
      "- /assets/hearth/hearth.composition.js",
      "- /assets/hearth/hearth.hydrology.js",
      "- /assets/hearth/hearth.materials.js",
      "- /assets/hearth/hearth.hex.four-pair.authority.js",
      "- /assets/hearth/hearth.hex.surface.js",
      "- /assets/lab/runtime-table.js",
      "",
      `updatedAt=${receipt.updatedAt}`,
      "",
      "EVENTS",
      events,
      "",
      "ERRORS",
      errors
    ].join("\n");
  }

  async function copyDiagnostic() {
    const text = getReceiptText();

    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
      } else {
        const textarea = doc.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "readonly");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        doc.body.appendChild(textarea);
        textarea.select();
        doc.execCommand("copy");
        textarea.remove();
      }

      if (nodes.copyButton) {
        const previous = nodes.copyButton.textContent;
        nodes.copyButton.textContent = "Copied";
        root.setTimeout(() => {
          nodes.copyButton.textContent = previous || "Copy diagnostic";
        }, 1200);
      }

      emit("DIAGNOSTIC_RECEIPT_COPIED", {
        copyEnabled: true
      });
    } catch (error) {
      recordError("COPY_DIAGNOSTIC_FAILED", error && error.message ? error.message : String(error));
    }
  }

  function bootSequence() {
    guardRetiredClimateRoute();
    mountLoadingScreen();
    startStateMachine();

    checkRouteShell();
    checkRuntimeTable();
    holdSourceStack();

    callCanvasCarrier();
    scheduleReconciliations();

    reconcileAll("boot-sequence-complete");
  }

  function dispose(reason = "manual-dispose") {
    reconcileTimers.forEach((timer) => {
      try {
        root.clearTimeout(timer);
      } catch (_error) {}
    });

    reconcileTimers = [];

    if (raf) {
      try {
        root.cancelAnimationFrame(raf);
      } catch (_error) {}

      raf = 0;
    }

    if (nodes.overlay && nodes.overlay.parentNode) {
      nodes.overlay.parentNode.removeChild(nodes.overlay);
    }

    emit("CONDUCTOR_DISPOSED", { reason });
    publishDataset();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    destinationFile: DESTINATION_FILE,

    boot: bootSequence,
    reconcile: reconcileAll,
    getReceipt,
    getReceiptText,
    copyDiagnostic,
    dispose,

    supportsAnimatedLoadScreen: true,
    supportsProgressBar: true,
    supportsPhaseCheckmarks: true,
    supportsCopyableDiagnosticReceipt: true,
    supportsReceiptOverlayIndependence: true,
    supportsRuntimeTableOptionalMode: true,
    supportsRuntimeTableMissingDoesNotBlockCarrier: true,
    supportsWideProbeDeferred: true,
    supportsVisibleCarrierFirst: true,

    ownsPlanetDrawing: false,
    ownsTectonicCause: false,
    ownsElevationGeneration: false,
    ownsCompositionClassification: false,
    ownsHydrologyTruth: false,
    ownsMaterialPalette: false,
    ownsCanvasPixelRendering: false,
    ownsRuntimeMotion: false,
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
  root.HEARTH.routeConductor = api;

  root.HEARTH_ROUTE_CONDUCTOR = api;
  root.HearthRouteConductor = api;
  root.HEARTH_ROUTE_CONDUCTOR_CONTRACT = CONTRACT;
  root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = getReceipt();

  root.__HEARTH_ACTIVE_ROUTE_FILE__ = DESTINATION_FILE;
  root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR__ = DESTINATION_FILE;
  root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;

  if (doc && doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", bootSequence, { once: true });
  } else {
    bootSequence();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
