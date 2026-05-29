// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_LOAD_SCREEN_CANVAS_HANDOFF_TNT_v1
// Full-file replacement.
// Active Hearth route conductor only.
// Purpose:
// - Restore the Hearth loading screen immediately.
// - Keep the diagnostic receipt copy surface available.
// - Conduct the route shell into the canvas carrier.
// - Consume Runtime Table only when present.
// - Keep Runtime Table absence as degraded diagnostic mode, never blank planet mode.
// - Preserve canvas/inspection lifecycle independence.
// Does not own:
// - canvas pixel drawing
// - atlas painting
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology truth
// - material palette
// - runtime motion
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_CONDUCTOR_LOAD_SCREEN_CANVAS_HANDOFF_TNT_v1";
  const RECEIPT = "HEARTH_ROUTE_CONDUCTOR_LOAD_SCREEN_CANVAS_HANDOFF_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_SHELL_CONDUCTOR_CANVAS_REBALANCE_HTML_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_DYNAMIC_ROUTE_CONDUCTOR_RUNTIME_TABLE_CANVAS_REBALANCE_PREGAME_TO_POSTGAME_BINDING_v1";
  const VERSION = "2026-05-29.hearth-route-conductor-load-screen-canvas-handoff-v1";

  const ROUTE = "/showroom/globe/hearth/";
  const CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const RUNTIME_TABLE_FILE = "/assets/lab/runtime-table.js";
  const RETIRED_CLIMATE_ROUTE = "/showroom/globe/hearth/hearth.climate.route.js";

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

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    route: ROUTE,
    activeRouteConductor: CONDUCTOR_FILE,
    retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
    retiredClimateRouteActiveCarrier: false,

    routeShellLoaded: false,
    conductorLoaded: true,
    conductorBootStarted: false,
    conductorBootComplete: false,

    mountPresent: false,
    mountId: "hearthCanvasMount",

    loadingScreenMounted: false,
    loadingScreenVisible: true,
    loadingScreenReceiptCopyEnabled: true,
    receiptOverlayIndependent: true,

    canvasAuthority: CANVAS_FILE,
    canvasApiPresent: false,
    canvasScriptPresent: false,
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
    runtimeTableMissingDoesNotBlockCarrier: true,

    sourceAuthorityHeld: true,
    visibleCarrierFirst: true,
    wideProbeDeferred: true,
    singleAnchorIsLocalProofOnly: true,

    dragInspectionBound: false,
    imageRendered: false,
    coherentExpressionPass: false,
    visualPassClaimed: false,

    postgameStatus: "CONDUCTOR_BOOTING",
    firstFailedCoordinate: "CONDUCTOR_BOOTING",
    recommendedNextRenewalTarget: "canvas-carrier-handoff",

    generatedImage: false,
    graphicBox: false,
    webGL: false,

    bootStartedAt: "",
    updatedAt: "",
    events: []
  };

  const steps = [
    {
      key: "shell",
      label: "Route shell",
      text: "Index shell and mount verified.",
      status: "pending"
    },
    {
      key: "loader",
      label: "Loading screen",
      text: "Diagnostic loading surface restored.",
      status: "pending"
    },
    {
      key: "runtime",
      label: "Runtime Table",
      text: "Optional diagnostic equipment checked.",
      status: "pending"
    },
    {
      key: "canvas",
      label: "Canvas carrier",
      text: "Visible planet carrier requested.",
      status: "pending"
    },
    {
      key: "inspection",
      label: "Inspection",
      text: "Drag / copy receipt / hide receipt lifecycle checked.",
      status: "pending"
    }
  ];

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
    return typeof value === "string" && value ? value : fallback;
  }

  function bool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
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

  function log(event, detail = {}) {
    const entry = {
      event,
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.events.push(entry);
    state.updatedAt = entry.at;

    if (state.events.length > 40) {
      state.events.splice(0, state.events.length - 40);
    }

    return entry;
  }

  function setStep(key, status, text) {
    const step = steps.find((item) => item.key === key);
    if (!step) return;

    step.status = status;

    if (text) {
      step.text = text;
    }
  }

  function getDataset() {
    return doc && doc.documentElement ? doc.documentElement.dataset : null;
  }

  function publishDataset() {
    const dataset = getDataset();
    if (!dataset) return;

    dataset.hearthConductorLoaded = "true";
    dataset.hearthRouteConductorLoaded = "true";
    dataset.hearthJsConductorLoaded = "true";
    dataset.hearthConductorContract = CONTRACT;
    dataset.hearthConductorReceipt = RECEIPT;
    dataset.hearthConductorPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthConductorBaselineContract = BASELINE_CONTRACT;
    dataset.hearthActiveRouteFile = CONDUCTOR_FILE;
    dataset.hearthActiveRouteConductor = CONDUCTOR_FILE;

    dataset.hearthRetiredClimateRoute = RETIRED_CLIMATE_ROUTE;
    dataset.hearthRetiredClimateRouteActiveCarrier = "false";

    dataset.hearthRouteShellLoaded = String(state.routeShellLoaded);
    dataset.hearthVisibleCarrierFirst = "true";
    dataset.hearthWideProbeDeferred = "true";
    dataset.hearthSourceAuthorityHeld = "true";

    dataset.hearthRuntimeTable = RUNTIME_TABLE_FILE;
    dataset.hearthRuntimeTableOptional = "true";
    dataset.hearthRuntimeTablePresent = String(state.runtimeTablePresent);
    dataset.hearthRuntimeTableMode = state.runtimeTableMode;
    dataset.hearthRuntimeTableMissingDoesNotBlockCarrier = "true";

    dataset.hearthLoadingScreenMounted = String(state.loadingScreenMounted);
    dataset.hearthLoadingScreenVisible = String(state.loadingScreenVisible);
    dataset.hearthReceiptOverlayIndependent = "true";
    dataset.hearthReceiptCopyEnabled = "true";

    dataset.hearthCanvasAuthority = CANVAS_FILE;
    dataset.hearthCanvasApiPresent = String(state.canvasApiPresent);
    dataset.hearthCanvasScriptRequested = String(state.canvasScriptRequested);
    dataset.hearthCanvasScriptLoaded = String(state.canvasScriptLoaded);
    dataset.hearthCanvasCarrierRequested = String(state.canvasCarrierRequested);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthCanvasCarrierHandoffOk = String(state.canvasCarrierHandoffOk);

    dataset.hearthDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthImageRendered = String(state.imageRendered);
    dataset.hearthCoherentExpressionPass = "false";
    dataset.hearthVisualPassClaimed = "false";
    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;
    dataset.hearthPostgameStatus = state.postgameStatus;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function createElement(tag, className, text) {
    if (!doc) return null;

    const node = doc.createElement(tag);

    if (className) {
      node.className = className;
    }

    if (text !== undefined && text !== null) {
      node.textContent = String(text);
    }

    return node;
  }

  function ensureStyle() {
    if (!doc || doc.getElementById("hearth-conductor-loading-screen-style")) return;

    const style = doc.createElement("style");
    style.id = "hearth-conductor-loading-screen-style";
    style.textContent = `
      [data-hearth-conductor-loader]{
        position:absolute;
        inset:0;
        z-index:8;
        display:grid;
        align-items:end;
        justify-items:stretch;
        pointer-events:none;
        color:#eef6ff;
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      }

      [data-hearth-conductor-loader][data-loader-hidden="true"]{
        display:none;
      }

      [data-hearth-conductor-loader] .hearth-loader-panel{
        pointer-events:auto;
        width:min(100% - 18px,620px);
        margin:9px auto;
        border:1px solid rgba(231,188,105,.34);
        border-radius:22px;
        background:
          radial-gradient(circle at 8% 0%,rgba(231,188,105,.18),transparent 15rem),
          radial-gradient(circle at 100% 20%,rgba(141,216,255,.13),transparent 16rem),
          linear-gradient(180deg,rgba(9,22,41,.96),rgba(3,8,16,.92));
        box-shadow:
          0 28px 80px rgba(0,0,0,.48),
          inset 0 1px 0 rgba(255,255,255,.08);
        backdrop-filter:blur(12px);
        overflow:hidden;
      }

      [data-hearth-conductor-loader] .hearth-loader-head{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:10px;
        align-items:start;
        padding:14px 14px 10px;
        border-bottom:1px solid rgba(255,255,255,.08);
      }

      [data-hearth-conductor-loader] .hearth-loader-kicker{
        color:#e7bc69;
        font-size:.68rem;
        font-weight:950;
        letter-spacing:.15em;
        text-transform:uppercase;
      }

      [data-hearth-conductor-loader] .hearth-loader-title{
        margin-top:4px;
        color:rgba(255,244,216,.98);
        font-size:clamp(1.05rem,3vw,1.45rem);
        line-height:1.05;
        font-weight:950;
        letter-spacing:-.04em;
      }

      [data-hearth-conductor-loader] .hearth-loader-subtitle{
        margin-top:5px;
        color:rgba(238,246,255,.70);
        font-size:.82rem;
        line-height:1.35;
      }

      [data-hearth-conductor-loader] .hearth-loader-orb{
        width:46px;
        height:46px;
        border-radius:50%;
        border:1px solid rgba(231,188,105,.42);
        background:
          radial-gradient(circle at 35% 25%,rgba(255,255,255,.48),transparent 18%),
          radial-gradient(circle at 55% 52%,rgba(139,215,163,.45),rgba(39,117,155,.34) 42%,rgba(4,10,20,.94) 76%);
        box-shadow:
          0 0 30px rgba(141,216,255,.18),
          inset -12px -10px 20px rgba(0,0,0,.40);
        animation:hearthLoaderPulse 1800ms ease-in-out infinite;
      }

      [data-hearth-conductor-loader] .hearth-loader-body{
        display:grid;
        gap:10px;
        padding:12px 14px 14px;
      }

      [data-hearth-conductor-loader] .hearth-loader-steps{
        display:grid;
        gap:7px;
      }

      [data-hearth-conductor-loader] .hearth-loader-step{
        display:grid;
        grid-template-columns:auto minmax(0,1fr) auto;
        gap:8px;
        align-items:center;
        min-height:30px;
        padding:7px 9px;
        border:1px solid rgba(255,255,255,.08);
        border-radius:14px;
        background:rgba(255,255,255,.035);
      }

      [data-hearth-conductor-loader] .hearth-loader-dot{
        width:9px;
        height:9px;
        border-radius:50%;
        background:rgba(238,246,255,.35);
        box-shadow:0 0 0 3px rgba(238,246,255,.06);
      }

      [data-hearth-conductor-loader] .hearth-loader-step[data-status="pass"] .hearth-loader-dot{
        background:#8bd7a3;
        box-shadow:0 0 0 3px rgba(139,215,163,.13),0 0 16px rgba(139,215,163,.18);
      }

      [data-hearth-conductor-loader] .hearth-loader-step[data-status="degraded"] .hearth-loader-dot,
      [data-hearth-conductor-loader] .hearth-loader-step[data-status="pending"] .hearth-loader-dot{
        background:#e7bc69;
        box-shadow:0 0 0 3px rgba(231,188,105,.13),0 0 16px rgba(231,188,105,.16);
      }

      [data-hearth-conductor-loader] .hearth-loader-step[data-status="fail"] .hearth-loader-dot{
        background:#ff7b69;
        box-shadow:0 0 0 3px rgba(255,123,105,.13),0 0 16px rgba(255,123,105,.16);
      }

      [data-hearth-conductor-loader] .hearth-loader-step strong{
        color:rgba(255,244,216,.96);
        font-size:.77rem;
        letter-spacing:.02em;
      }

      [data-hearth-conductor-loader] .hearth-loader-step span{
        color:rgba(238,246,255,.62);
        font-size:.70rem;
        line-height:1.2;
      }

      [data-hearth-conductor-loader] .hearth-loader-step code{
        color:#e7bc69;
        font:900 .66rem/1 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
      }

      [data-hearth-conductor-loader] .hearth-loader-actions{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
      }

      [data-hearth-conductor-loader] button{
        appearance:none;
        border:1px solid rgba(231,188,105,.34);
        border-radius:999px;
        min-height:32px;
        padding:7px 10px;
        color:rgba(255,244,216,.92);
        background:rgba(231,188,105,.08);
        font:900 .68rem/1 ui-sans-serif,system-ui,sans-serif;
        letter-spacing:.08em;
        text-transform:uppercase;
        cursor:pointer;
      }

      [data-hearth-conductor-loader] button:hover{
        border-color:rgba(231,188,105,.66);
        background:rgba(231,188,105,.14);
      }

      [data-hearth-conductor-loader] .hearth-loader-receipt{
        max-height:180px;
        overflow:auto;
        white-space:pre-wrap;
        border:1px solid rgba(141,216,255,.16);
        border-radius:14px;
        padding:10px;
        color:rgba(238,246,255,.68);
        background:rgba(1,4,10,.54);
        font:750 .66rem/1.42 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
      }

      [data-hearth-conductor-loader][data-receipt-hidden="true"] .hearth-loader-receipt{
        display:none;
      }

      [data-hearth-conductor-loader] .hearth-loader-copy-state{
        min-height:16px;
        color:rgba(139,215,163,.82);
        font-size:.68rem;
        font-weight:850;
      }

      @keyframes hearthLoaderPulse{
        0%,100%{transform:scale(1);filter:brightness(1)}
        50%{transform:scale(1.035);filter:brightness(1.14)}
      }

      @media (max-width:760px){
        [data-hearth-conductor-loader]{
          align-items:end;
        }

        [data-hearth-conductor-loader] .hearth-loader-panel{
          width:calc(100% - 14px);
          margin:7px auto;
          border-radius:18px;
        }

        [data-hearth-conductor-loader] .hearth-loader-head{
          grid-template-columns:1fr;
        }

        [data-hearth-conductor-loader] .hearth-loader-orb{
          display:none;
        }

        [data-hearth-conductor-loader] .hearth-loader-receipt{
          max-height:150px;
        }
      }

      @media (prefers-reduced-motion:reduce){
        [data-hearth-conductor-loader] .hearth-loader-orb{
          animation:none!important;
        }
      }
    `;

    doc.head.appendChild(style);
  }

  function ensureMount() {
    if (!doc) return null;

    let mount =
      doc.getElementById("hearthCanvasMount") ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]");

    if (!mount) {
      const parent = doc.getElementById("hearth-main") || doc.body || doc.documentElement;
      mount = doc.createElement("section");
      mount.id = "hearthCanvasMount";
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.hearthCreatedByConductor = "true";
      mount.style.position = "relative";
      mount.style.minHeight = "320px";
      mount.style.aspectRatio = "1 / 1";
      mount.style.overflow = "hidden";
      parent.appendChild(mount);
    }

    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthRouteConductor = CONTRACT;
    mount.dataset.hearthActiveRouteConductor = CONDUCTOR_FILE;
    mount.dataset.hearthVisibleCarrierFirst = "true";
    mount.dataset.runtimeTableOptional = "true";
    mount.dataset.runtimeTableMissingDoesNotBlockCarrier = "true";
    mount.dataset.receiptOverlayIndependent = "true";
    mount.style.position = mount.style.position || "relative";
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";

    state.mountPresent = true;
    state.routeShellLoaded = true;
    setStep("shell", "pass", "Route shell and Hearth canvas mount verified.");

    return mount;
  }

  function fallbackNode(mount) {
    if (!mount) return null;

    let node =
      mount.querySelector("[data-hearth-mount-fallback]") ||
      mount.querySelector(".mount-fallback");

    if (!node && doc) {
      node = doc.createElement("span");
      node.className = "mount-fallback";
      node.dataset.hearthMountFallback = "true";
      node.textContent = "Hearth visible carrier preparing.";
      mount.appendChild(node);
    }

    return node;
  }

  function getReceiptObject(reason = "receipt-read") {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      route: ROUTE,
      activeRouteConductor: CONDUCTOR_FILE,
      retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
      retiredClimateRouteActiveCarrier: false,

      routeShellLoaded: state.routeShellLoaded,
      conductorLoaded: true,
      conductorBootStarted: state.conductorBootStarted,
      conductorBootComplete: state.conductorBootComplete,

      canvasMountPresent: state.mountPresent,
      canvasAuthority: CANVAS_FILE,
      canvasApiPresent: state.canvasApiPresent,
      canvasScriptRequested: state.canvasScriptRequested,
      canvasScriptLoaded: state.canvasScriptLoaded,
      canvasScriptError: state.canvasScriptError,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      canvasCarrierMethod: state.canvasCarrierMethod,

      loadingScreenMounted: state.loadingScreenMounted,
      loadingScreenVisible: state.loadingScreenVisible,
      receiptOverlayIndependent: true,
      loadingScreenReceiptCopyEnabled: true,

      runtimeTable: RUNTIME_TABLE_FILE,
      runtimeTableOptional: true,
      runtimeTablePresent: state.runtimeTablePresent,
      runtimeTableMode: state.runtimeTableMode,
      runtimeTablePlanAttempted: state.runtimeTablePlanAttempted,
      runtimeTablePlanCreated: state.runtimeTablePlanCreated,
      runtimeTablePlanError: state.runtimeTablePlanError,
      runtimeTableMissingDoesNotBlockCarrier: true,

      sourceAuthorityHeld: true,
      sourceStackHeld: SOURCE_STACK_HELD.slice(),
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
      reason,
      events: clonePlain(state.events),
      updatedAt: nowIso()
    };
  }

  function receiptText(reason = "receipt-read") {
    const receipt = getReceiptObject(reason);

    return [
      "HEARTH_ROUTE_CONDUCTOR_LOAD_SCREEN_CANVAS_HANDOFF_RECEIPT",
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
      `receiptOverlayIndependent=${receipt.receiptOverlayIndependent}`,
      `loadingScreenReceiptCopyEnabled=${receipt.loadingScreenReceiptCopyEnabled}`,
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
      ...SOURCE_STACK_HELD.map((item) => `- ${item}`),
      "",
      `updatedAt=${receipt.updatedAt}`,
      "",
      "EVENTS",
      ...state.events.map((event) => `- ${event.at} :: ${event.event}`)
    ].join("\n");
  }

  function findStatusNode() {
    if (!doc) return null;

    return (
      doc.getElementById("hearth-route-status") ||
      doc.querySelector("[data-hearth-route-status='true']") ||
      doc.querySelector("[data-hearth-route-status]")
    );
  }

  function updateStatusNode(reason) {
    const node = findStatusNode();
    if (!node) return;

    node.textContent = [
      "Hearth route conductor active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `Status ${state.postgameStatus}`,
      `Reason ${reason}`,
      `Active conductor ${CONDUCTOR_FILE}`,
      `Retired climate route ${RETIRED_CLIMATE_ROUTE}`,
      "Climate route active carrier false",
      `Canvas authority ${CANVAS_FILE}`,
      `Canvas mount present ${state.mountPresent}`,
      `Canvas API present ${state.canvasApiPresent}`,
      `Canvas script requested ${state.canvasScriptRequested}`,
      `Canvas script loaded ${state.canvasScriptLoaded}`,
      `Canvas carrier requested ${state.canvasCarrierRequested}`,
      `Canvas carrier mounted ${state.canvasCarrierMounted}`,
      `Canvas carrier handoff ok ${state.canvasCarrierHandoffOk}`,
      `Runtime Table present ${state.runtimeTablePresent}`,
      `Runtime Table mode ${state.runtimeTableMode}`,
      "Runtime Table missing does not block carrier true",
      `Loading screen mounted ${state.loadingScreenMounted}`,
      "Receipt overlay independent true",
      `Drag inspection bound ${state.dragInspectionBound}`,
      `Image rendered ${state.imageRendered}`,
      "Coherent expression pass false",
      "Visual pass claimed false",
      `First failed coordinate ${state.firstFailedCoordinate}`,
      `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
      `Updated ${state.updatedAt || nowIso()}`
    ].join("\n");
  }

  function refreshLoader(reason) {
    if (!doc) return;

    const loader = doc.querySelector("[data-hearth-conductor-loader='true']");
    if (!loader) return;

    const status = loader.querySelector("[data-hearth-loader-status]");
    const receipt = loader.querySelector("[data-hearth-loader-receipt]");
    const stepsNode = loader.querySelector("[data-hearth-loader-steps]");

    loader.dataset.hearthPostgameStatus = state.postgameStatus;
    loader.dataset.receiptHidden = loader.dataset.receiptHidden || "false";
    loader.dataset.loaderHidden = state.loadingScreenVisible ? "false" : "true";

    if (status) {
      status.textContent = `${state.postgameStatus} · ${reason}`;
    }

    if (receipt) {
      receipt.textContent = receiptText(reason);
    }

    if (stepsNode) {
      stepsNode.innerHTML = "";

      steps.forEach((step) => {
        const row = createElement("div", "hearth-loader-step");
        const dot = createElement("i", "hearth-loader-dot");
        const copy = createElement("div");
        const label = createElement("strong", "", step.label);
        const text = createElement("span", "", step.text);
        const code = createElement("code", "", step.status.toUpperCase());

        row.dataset.status = step.status || "pending";
        copy.appendChild(label);
        copy.appendChild(text);
        row.appendChild(dot);
        row.appendChild(copy);
        row.appendChild(code);
        stepsNode.appendChild(row);
      });
    }
  }

  function publish(reason) {
    state.updatedAt = nowIso();

    publishDataset();
    updateStatusNode(reason);
    refreshLoader(reason);

    root.HEARTH_ROUTE_CONDUCTOR_POSTGAME_RECEIPT = getReceiptObject(reason);
    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = root.HEARTH_ROUTE_CONDUCTOR_POSTGAME_RECEIPT;
    root.HEARTH_ROUTE_CONDUCTOR_CONTRACT = CONTRACT;

    log("PUBLISH", {
      reason,
      status: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget
    });
  }

  async function copyText(text) {
    if (!doc) return false;

    if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
      try {
        await root.navigator.clipboard.writeText(text);
        return true;
      } catch (_error) {}
    }

    const area = doc.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "readonly");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    area.style.top = "0";
    doc.body.appendChild(area);
    area.select();

    let ok = false;

    try {
      ok = doc.execCommand("copy");
    } catch (_error) {
      ok = false;
    }

    area.remove();
    return ok;
  }

  function ensureLoadingScreen(mount) {
    if (!doc || !mount) return null;

    ensureStyle();

    let loader = mount.querySelector("[data-hearth-conductor-loader='true']");

    if (!loader) {
      loader = createElement("aside", "");
      loader.dataset.hearthConductorLoader = "true";
      loader.dataset.receiptHidden = "false";
      loader.dataset.loaderHidden = "false";
      loader.setAttribute("aria-label", "Hearth loading screen and diagnostic receipt");

      const panel = createElement("section", "hearth-loader-panel");

      const head = createElement("header", "hearth-loader-head");
      const headCopy = createElement("div");
      const kicker = createElement("div", "hearth-loader-kicker", "Hearth Loading Screen · Runtime Table Diagnostic Funnel");
      const title = createElement("div", "hearth-loader-title", "Loading Hearth visible carrier.");
      const subtitle = createElement("div", "hearth-loader-subtitle");
      subtitle.dataset.hearthLoaderStatus = "true";
      subtitle.textContent = state.postgameStatus;

      const orb = createElement("div", "hearth-loader-orb");
      orb.setAttribute("aria-hidden", "true");

      headCopy.appendChild(kicker);
      headCopy.appendChild(title);
      headCopy.appendChild(subtitle);
      head.appendChild(headCopy);
      head.appendChild(orb);

      const body = createElement("div", "hearth-loader-body");

      const stepsNode = createElement("div", "hearth-loader-steps");
      stepsNode.dataset.hearthLoaderSteps = "true";

      const actions = createElement("div", "hearth-loader-actions");

      const copyButton = createElement("button", "", "Copy Receipt");
      copyButton.type = "button";
      copyButton.dataset.hearthCopyReceipt = "true";

      const hideReceiptButton = createElement("button", "", "Hide Receipt");
      hideReceiptButton.type = "button";
      hideReceiptButton.dataset.hearthHideReceipt = "true";

      const showReceiptButton = createElement("button", "", "Show Receipt");
      showReceiptButton.type = "button";
      showReceiptButton.dataset.hearthShowReceipt = "true";

      const hideLoaderButton = createElement("button", "", "Hide Loader");
      hideLoaderButton.type = "button";
      hideLoaderButton.dataset.hearthHideLoader = "true";

      actions.appendChild(copyButton);
      actions.appendChild(hideReceiptButton);
      actions.appendChild(showReceiptButton);
      actions.appendChild(hideLoaderButton);

      const copyState = createElement("div", "hearth-loader-copy-state");
      copyState.dataset.hearthCopyState = "true";

      const receipt = createElement("pre", "hearth-loader-receipt");
      receipt.dataset.hearthLoaderReceipt = "true";
      receipt.textContent = receiptText("loading-screen-created");

      body.appendChild(stepsNode);
      body.appendChild(actions);
      body.appendChild(copyState);
      body.appendChild(receipt);

      panel.appendChild(head);
      panel.appendChild(body);
      loader.appendChild(panel);
      mount.appendChild(loader);

      copyButton.addEventListener("click", async () => {
        const ok = await copyText(receiptText("copy-button"));
        copyState.textContent = ok
          ? `Receipt copied ${nowIso()}`
          : "Receipt copy failed; select the receipt text manually.";
        log("COPY_RECEIPT", { ok });
        publish("copy-receipt");
      });

      hideReceiptButton.addEventListener("click", () => {
        loader.dataset.receiptHidden = "true";
        copyState.textContent = "Receipt hidden. Canvas and controls remain mounted.";
        state.receiptOverlayIndependent = true;
        log("HIDE_RECEIPT", { canvasUnaffected: true });
        publish("hide-receipt");
      });

      showReceiptButton.addEventListener("click", () => {
        loader.dataset.receiptHidden = "false";
        copyState.textContent = "Receipt visible.";
        state.receiptOverlayIndependent = true;
        log("SHOW_RECEIPT", { canvasUnaffected: true });
        publish("show-receipt");
      });

      hideLoaderButton.addEventListener("click", () => {
        state.loadingScreenVisible = false;
        loader.dataset.loaderHidden = "true";
        state.receiptOverlayIndependent = true;
        log("HIDE_LOADER", { canvasUnaffected: true });
        publish("hide-loader");
      });
    }

    state.loadingScreenMounted = true;
    state.loadingScreenVisible = loader.dataset.loaderHidden !== "true";
    setStep("loader", "pass", "Loading screen restored with copyable receipt.");
    log("LOADING_SCREEN_MOUNTED", { independent: true });

    return loader;
  }

  function detectRuntimeTable() {
    const api =
      root.LAB_RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      root.RUNTIME_TABLE ||
      root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE ||
      root.LAB_VISUAL_CARRIER_PLAN_AUTHORITY ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null;

    state.runtimeTablePresent = Boolean(api);
    state.runtimeTableMode = api
      ? "RUNTIME_TABLE_READY_OR_DEGRADED"
      : "RUNTIME_TABLE_MISSING_ALLOWED";

    if (api) {
      setStep("runtime", "pass", "Runtime Table detected and kept optional.");
    } else {
      setStep("runtime", "degraded", "Runtime Table missing allowed; visible carrier remains authorized.");
    }

    return api;
  }

  function createRuntimePlan(runtimeTable, mount) {
    state.runtimeTablePlanAttempted = true;

    if (!runtimeTable) {
      state.runtimeTablePlanCreated = false;
      state.runtimeTablePlanError = "Runtime Table missing; degraded diagnostic mode allowed.";
      return null;
    }

    const input = {
      planetId: "hearth",
      planetLabel: "Hearth",
      route: ROUTE,
      samplePoint: {
        u: 0.5,
        v: 0.5,
        lon: 0,
        lat: 0,
        x: 0,
        y: 0,
        z: 1
      },
      routeMounted: true,
      canvasMounted: Boolean(mount),
      fallbackShellAvailable: true,
      visibleCarrierAvailable: true,
      imageRendered: state.imageRendered,
      renderMetadata: {
        routeMounted: true,
        canvasMounted: Boolean(mount),
        fallbackShellAvailable: true,
        sphereContainment: true,
        outsideSphereTransparent: true,
        noRectangularTextureSpill: true,
        visibleCarrierAllowed: true,
        imageRendered: state.imageRendered,
        atlasReady: false,
        projectionReady: false
      }
    };

    try {
      let plan = null;

      if (isFunction(runtimeTable.createHearthVisualCarrierPlan)) {
        plan = runtimeTable.createHearthVisualCarrierPlan(input, {
          profile: "hearth-channel-expression",
          planetId: "hearth",
          planetLabel: "Hearth",
          runHearthTable: true
        });
      } else if (isFunction(runtimeTable.createVisualCarrierPlan)) {
        plan = runtimeTable.createVisualCarrierPlan(input, {
          profile: "hearth-channel-expression",
          planetId: "hearth",
          planetLabel: "Hearth",
          runHearthTable: true
        });
      } else if (isFunction(runtimeTable.createUniversalPlanetVisualCarrierPlan)) {
        plan = runtimeTable.createUniversalPlanetVisualCarrierPlan(input, {
          profile: "hearth-channel-expression",
          planetId: "hearth",
          planetLabel: "Hearth",
          runHearthTable: true
        });
      }

      state.runtimeTablePlanCreated = Boolean(plan);
      state.runtimeTablePlanError = plan ? "" : "Runtime Table present but no compatible visual carrier plan method found.";

      if (plan) {
        log("RUNTIME_TABLE_PLAN_CREATED", {
          planContract: plan.planContract || "",
          atlasStartAuthorized: plan.atlasStartAuthorized,
          visualCarrierAllowed: plan.visualCarrierAllowed,
          recommendedNextRenewalTarget: plan.recommendedNextRenewalTarget || ""
        });
      }

      return plan;
    } catch (error) {
      state.runtimeTablePlanCreated = false;
      state.runtimeTablePlanError = error && error.message ? error.message : String(error);
      log("RUNTIME_TABLE_PLAN_ERROR", { error: state.runtimeTablePlanError });
      return null;
    }
  }

  function detectCanvasApi() {
    const api =
      root.HEARTH_CANVAS ||
      root.HearthCanvas ||
      (root.HEARTH && root.HEARTH.canvas) ||
      null;

    state.canvasApiPresent = Boolean(api);
    return api;
  }

  function detectCanvasScript() {
    if (!doc) return null;

    const scripts = Array.from(doc.scripts || []);
    const script = scripts.find((item) => {
      const src = item.getAttribute("src") || "";
      return src.includes("/assets/hearth/hearth.canvas.js") || src.includes("hearth.canvas.js");
    });

    state.canvasScriptPresent = Boolean(script);
    if (script && script.dataset.hearthConductorRequested === "true") {
      state.canvasScriptRequested = true;
    }

    return script;
  }

  function requestCanvasScript() {
    if (!doc) return Promise.resolve(false);

    const existing = detectCanvasScript();

    if (existing && detectCanvasApi()) {
      state.canvasScriptLoaded = true;
      return Promise.resolve(true);
    }

    if (existing && state.canvasScriptRequested) {
      return new Promise((resolve) => {
        root.setTimeout(() => resolve(Boolean(detectCanvasApi())), 120);
      });
    }

    state.canvasScriptRequested = true;
    setStep("canvas", "pending", "Canvas authority requested.");
    log("REQUEST_CANVAS_SCRIPT", { src: CANVAS_FILE });

    return new Promise((resolve) => {
      const script = doc.createElement("script");
      const key = `${CONTRACT}-${Date.now()}`;

      script.src = `${CANVAS_FILE}?v=${encodeURIComponent(key)}`;
      script.defer = true;
      script.dataset.hearthConductorRequested = "true";
      script.dataset.hearthFile = "true";
      script.dataset.hearthFileRole = "visible-carrier-authority";
      script.dataset.hearthExpectedAuthority = "canvas";
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      script.onload = () => {
        state.canvasScriptLoaded = true;
        state.canvasScriptError = "";
        log("CANVAS_SCRIPT_LOADED", { src: CANVAS_FILE });
        resolve(true);
      };

      script.onerror = () => {
        state.canvasScriptLoaded = false;
        state.canvasScriptError = `Failed to load ${CANVAS_FILE}`;
        log("CANVAS_SCRIPT_ERROR", { src: CANVAS_FILE });
        resolve(false);
      };

      doc.head.appendChild(script);
    });
  }

  function getCanvasReceipt(api) {
    if (!api || !isObject(api)) return null;

    if (isFunction(api.getReceipt)) {
      try {
        return api.getReceipt();
      } catch (_error) {}
    }

    if (api.receiptPacket && isObject(api.receiptPacket)) return api.receiptPacket;
    if (api.receipt && isObject(api.receipt)) return api.receipt;

    return null;
  }

  function updateFromCanvasResult(result, api) {
    const mount = doc ? doc.getElementById("hearthCanvasMount") : null;
    const canvasPresent = Boolean(mount && mount.querySelector("canvas"));
    const dataset = getDataset();

    const receipt = getCanvasReceipt(api);

    state.canvasCarrierMounted = Boolean(
      canvasPresent ||
      bool(result && result.canvasCarrierMounted) ||
      bool(result && result.mounted) ||
      bool(result && result.visibleCarrierMounted) ||
      bool(receipt && receipt.canvasCarrierMounted) ||
      bool(receipt && receipt.visibleCarrierMounted) ||
      bool(dataset && dataset.hearthCanvasCarrierMounted) ||
      bool(dataset && dataset.hearthVisibleCarrierMounted)
    );

    state.dragInspectionBound = Boolean(
      bool(result && result.dragInspectionBound) ||
      bool(result && result.controlsBound) ||
      bool(receipt && receipt.dragInspectionBound) ||
      bool(receipt && receipt.controlsBound) ||
      bool(dataset && dataset.hearthDragInspectionBound) ||
      bool(dataset && dataset.hearthControlsBound) ||
      bool(mount && mount.dataset.hearthDragInspectionBound) ||
      bool(mount && mount.dataset.hearthControlsBound)
    );

    state.imageRendered = Boolean(
      state.canvasCarrierMounted ||
      bool(result && result.imageRendered) ||
      bool(receipt && receipt.imageRendered) ||
      bool(dataset && dataset.hearthImageRendered) ||
      bool(dataset && dataset.hearthCanvasImageRendered)
    );

    if (state.canvasCarrierMounted) {
      state.canvasCarrierHandoffOk = true;
      state.canvasCarrierHandoffError = "";
      setStep("canvas", "pass", "Canvas carrier mounted or visible canvas detected.");
      setStep("inspection", state.dragInspectionBound ? "pass" : "degraded", state.dragInspectionBound ? "Drag inspection confirmed." : "Canvas mounted; drag inspection not yet confirmed.");
      state.postgameStatus = state.runtimeTablePresent
        ? "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_READY"
        : "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING";
      state.firstFailedCoordinate = "NONE_VISIBLE_CARRIER_PRESENT";
      state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";
    } else if (state.canvasApiPresent || api) {
      state.canvasCarrierHandoffOk = false;
      setStep("canvas", "degraded", "Canvas API present, carrier mount not yet confirmed.");
      setStep("inspection", "pending", "Inspection waits for canvas carrier confirmation.");
      state.postgameStatus = "VISIBLE_CARRIER_ACTIVE_SOURCE_DEGRADED";
      state.firstFailedCoordinate = "CANVAS_CARRIER_NOT_CONFIRMED";
      state.recommendedNextRenewalTarget = "hearth.canvas.js-visible-carrier-mount";
    } else {
      state.canvasCarrierHandoffOk = false;
      setStep("canvas", "fail", "Canvas API missing.");
      setStep("inspection", "pending", "Inspection unavailable until canvas authority loads.");
      state.postgameStatus = "VISIBLE_CARRIER_ACTIVE_SOURCE_DEGRADED";
      state.firstFailedCoordinate = "CANVAS_API_MISSING";
      state.recommendedNextRenewalTarget = "hearth.canvas.js-upload-or-script-load";
    }
  }

  function callCanvasCarrier(api, mount, plan) {
    state.canvasCarrierRequested = true;

    if (!api || !isObject(api)) {
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = "Canvas API unavailable.";
      updateFromCanvasResult(null, null);
      return null;
    }

    const methods = [
      "boot",
      "mount",
      "mountVisibleCarrier",
      "bootVisibleCarrier",
      "start",
      "init",
      "render",
      "conduct"
    ];

    const payload = {
      contract: CONTRACT,
      receipt: RECEIPT,
      route: ROUTE,
      mount,
      mountId: "hearthCanvasMount",
      planetId: "hearth",
      planetLabel: "Hearth",
      visibleCarrierFirst: true,
      runtimeTableOptional: true,
      runtimeTableMissingDoesNotBlockCarrier: true,
      wideProbeDeferred: true,
      sourceAuthorityHeld: true,
      receiptOverlayIndependent: true,
      conductorReceipt: getReceiptObject("canvas-handoff"),
      runtimeTablePlan: plan || null,
      loadingScreen: {
        present: state.loadingScreenMounted,
        copyReceiptAvailable: true,
        hideDoesNotRemoveCanvas: true
      },
      callbacks: {
        onStatus: (status) => {
          log("CANVAS_STATUS_CALLBACK", { status });
          publish("canvas-status-callback");
        },
        onMounted: (result = {}) => {
          state.canvasCarrierMounted = true;
          updateFromCanvasResult(result, api);
          publish("canvas-mounted-callback");
        },
        onRendered: (result = {}) => {
          state.imageRendered = true;
          updateFromCanvasResult(result, api);
          publish("canvas-rendered-callback");
        }
      }
    };

    for (const method of methods) {
      if (!isFunction(api[method])) continue;

      try {
        state.canvasCarrierMethod = method;
        const result = api[method](payload);
        state.canvasCarrierHandoffOk = true;
        state.canvasCarrierHandoffError = "";
        log("CANVAS_CARRIER_CALLED", { method });
        updateFromCanvasResult(result, api);
        return result;
      } catch (error) {
        state.canvasCarrierHandoffOk = false;
        state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
        log("CANVAS_CARRIER_METHOD_ERROR", {
          method,
          error: state.canvasCarrierHandoffError
        });
      }
    }

    state.canvasCarrierMethod = "";
    state.canvasCarrierHandoffOk = false;
    state.canvasCarrierHandoffError = "Canvas API found, but no compatible boot/mount method succeeded.";
    updateFromCanvasResult(null, api);
    return null;
  }

  async function conductCanvas(mount) {
    let api = detectCanvasApi();

    if (!api) {
      await requestCanvasScript();
      api = detectCanvasApi();
    }

    const runtimeTable = detectRuntimeTable();
    const plan = createRuntimePlan(runtimeTable, mount);

    state.canvasApiPresent = Boolean(api);

    if (!api) {
      state.postgameStatus = state.runtimeTablePresent
        ? "VISIBLE_CARRIER_ACTIVE_SOURCE_DEGRADED"
        : "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING";
      state.firstFailedCoordinate = "CANVAS_API_MISSING";
      state.recommendedNextRenewalTarget = "hearth.canvas.js-upload-or-script-load";
      setStep("canvas", "fail", "Canvas API missing after script request.");
      publish("canvas-api-missing-after-request");
      return;
    }

    callCanvasCarrier(api, mount, plan);
    publish("canvas-handoff-attempted");

    root.setTimeout(() => {
      updateFromCanvasResult(null, api);
      publish("post-handoff-250ms");
    }, 250);

    root.setTimeout(() => {
      updateFromCanvasResult(null, api);
      publish("post-handoff-1000ms");
    }, 1000);

    root.setTimeout(() => {
      updateFromCanvasResult(null, api);
      publish("post-handoff-2500ms");
    }, 2500);
  }

  function guardRetiredClimateRoute() {
    root.__HEARTH_RETIRED_CLIMATE_ROUTE__ = RETIRED_CLIMATE_ROUTE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE_ACTIVE_CARRIER__ = false;

    const dataset = getDataset();
    if (dataset) {
      dataset.hearthRetiredClimateRoute = RETIRED_CLIMATE_ROUTE;
      dataset.hearthRetiredClimateRouteActiveCarrier = "false";
    }

    log("RETIRED_CLIMATE_ROUTE_GUARDED", {
      route: RETIRED_CLIMATE_ROUTE,
      activeCarrier: false
    });
  }

  function boot() {
    if (!doc) return;

    state.bootStartedAt = nowIso();
    state.conductorBootStarted = true;
    state.postgameStatus = "CONDUCTOR_BOOTING";
    state.firstFailedCoordinate = "CONDUCTOR_BOOTING";
    state.recommendedNextRenewalTarget = "canvas-carrier-handoff";

    root.__HEARTH_ACTIVE_ROUTE_FILE__ = CONDUCTOR_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR__ = CONDUCTOR_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;
    root.__HEARTH_ACTIVE_ROUTE_RECEIPT__ = RECEIPT;

    guardRetiredClimateRoute();

    const mount = ensureMount();
    fallbackNode(mount);
    ensureLoadingScreen(mount);

    detectRuntimeTable();
    detectCanvasScript();
    detectCanvasApi();

    state.postgameStatus = "LOADING_SCREEN_ACTIVE_CANVAS_HANDOFF_PENDING";
    state.firstFailedCoordinate = "CANVAS_HANDOFF_PENDING";
    state.recommendedNextRenewalTarget = "hearth.canvas.js-visible-carrier";

    publish("boot-started");

    conductCanvas(mount).then(() => {
      state.conductorBootComplete = true;
      publish("boot-complete");
    }).catch((error) => {
      state.conductorBootComplete = false;
      state.postgameStatus = "VISIBLE_CARRIER_ACTIVE_SOURCE_DEGRADED";
      state.firstFailedCoordinate = "CONDUCTOR_CANVAS_HANDOFF_ERROR";
      state.recommendedNextRenewalTarget = "hearth.js-handoff-error";
      log("CONDUCTOR_BOOT_ERROR", {
        error: error && error.message ? error.message : String(error)
      });
      publish("boot-error");
    });
  }

  function refresh(reason = "manual-refresh") {
    detectRuntimeTable();
    detectCanvasScript();
    const api = detectCanvasApi();
    updateFromCanvasResult(null, api);
    publish(reason);
    return getReceiptObject(reason);
  }

  function showLoadingScreen() {
    const mount = ensureMount();
    const loader = ensureLoadingScreen(mount);

    if (loader) {
      loader.dataset.loaderHidden = "false";
      state.loadingScreenVisible = true;
    }

    publish("show-loading-screen");
    return getReceiptObject("show-loading-screen");
  }

  function hideLoadingScreen() {
    const loader = doc ? doc.querySelector("[data-hearth-conductor-loader='true']") : null;

    if (loader) {
      loader.dataset.loaderHidden = "true";
    }

    state.loadingScreenVisible = false;
    publish("hide-loading-screen");
    return getReceiptObject("hide-loading-screen");
  }

  function showReceipt() {
    const loader = doc ? doc.querySelector("[data-hearth-conductor-loader='true']") : null;

    if (loader) {
      loader.dataset.receiptHidden = "false";
      loader.dataset.loaderHidden = "false";
    }

    state.loadingScreenVisible = true;
    state.receiptOverlayIndependent = true;
    publish("show-receipt-api");
    return getReceiptObject("show-receipt-api");
  }

  function hideReceipt() {
    const loader = doc ? doc.querySelector("[data-hearth-conductor-loader='true']") : null;

    if (loader) {
      loader.dataset.receiptHidden = "true";
    }

    state.receiptOverlayIndependent = true;
    publish("hide-receipt-api");
    return getReceiptObject("hide-receipt-api");
  }

  async function copyReceipt() {
    const text = receiptText("api-copy-receipt");
    const ok = await copyText(text);
    log("API_COPY_RECEIPT", { ok });
    publish("api-copy-receipt");
    return {
      ok,
      text
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    conductorFile: CONDUCTOR_FILE,
    canvasAuthority: CANVAS_FILE,
    runtimeTable: RUNTIME_TABLE_FILE,
    retiredClimateRoute: RETIRED_CLIMATE_ROUTE,

    boot,
    refresh,
    showLoadingScreen,
    hideLoadingScreen,
    showReceipt,
    hideReceipt,
    copyReceipt,
    getReceipt: () => getReceiptObject("api-get-receipt"),
    getReceiptText: () => receiptText("api-get-receipt-text"),
    conductCanvas: () => conductCanvas(ensureMount()),

    visibleCarrierFirst: true,
    runtimeTableOptional: true,
    runtimeTableMissingDoesNotBlockCarrier: true,
    wideProbeDeferred: true,
    sourceAuthorityHeld: true,
    receiptOverlayIndependent: true,
    loadingScreenRestored: true,
    doesNotDrawCanvas: true,
    doesNotOwnTruth: true,
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
  root.HEARTH_CONDUCTOR = api;
  root.HEARTH_ROUTE_CONDUCTOR_CONTRACT = CONTRACT;
  root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = getReceiptObject("initial-export");

  publishDataset();

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }

    root.addEventListener("load", () => {
      refresh("window-load");
    }, { once: true });
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
