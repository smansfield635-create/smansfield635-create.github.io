// /showroom/globe/hearth/hearth.climate.route.js
// HEARTH_CLIMATE_ROUTE_RETIRED_ACTIVE_CARRIER_TOMBSTONE_TNT_v1
// Full-file replacement.
// Previous active carrier: HEARTH_SOURCE_ALIGNED_VISIBLE_GLOBE_ROUTE_TNT_v17
// Purpose:
// - Retire this file from active Hearth route-carrier duty.
// - Preserve a safe compatibility tombstone for stale script references.
// - Publish retirement receipt and route-conductor handoff markers.
// - Prevent this file from creating canvas, mounting globe, generating texture, binding controls, or animating.
// Active route conduction now belongs to /showroom/globe/hearth/hearth.js.
// Visible carrier / drawing belongs to /assets/hearth/hearth.canvas.js.
// Runtime Table remains diagnostic/procedural-plan equipment only.
// No generated image. No GraphicBox. No WebGL. No visual-pass claim.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_CLIMATE_ROUTE_RETIRED_ACTIVE_CARRIER_TOMBSTONE_TNT_v1";
  const RECEIPT = "HEARTH_CLIMATE_ROUTE_RETIRED_ACTIVE_CARRIER_TOMBSTONE_RECEIPT_v1";
  const PREVIOUS_ACTIVE_CONTRACT = "HEARTH_SOURCE_ALIGNED_VISIBLE_GLOBE_ROUTE_TNT_v17";
  const PREVIOUS_ACTIVE_RECEIPT = "HEARTH_SOURCE_ALIGNED_VISIBLE_GLOBE_ROUTE_RECEIPT_v17";
  const VERSION = "2026-05-29.hearth-climate-route-retired-active-carrier-tombstone-v1";

  const FILE = "/showroom/globe/hearth/hearth.climate.route.js";
  const ACTIVE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const ACTIVE_CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const RUNTIME_TABLE_FILE = "/assets/lab/runtime-table.js";

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousActiveContract: PREVIOUS_ACTIVE_CONTRACT,
    previousActiveReceipt: PREVIOUS_ACTIVE_RECEIPT,
    version: VERSION,
    file: FILE,
    activeCarrier: false,
    retired: true,
    tombstone: true,
    mountedCanvas: false,
    createdCanvas: false,
    removedCanvas: false,
    generatedTexture: false,
    boundControls: false,
    animationStarted: false,
    requestAnimationFrameUsed: false,
    activeRouteClaimed: false,
    routeConductorExpected: ACTIVE_CONDUCTOR_FILE,
    visibleCarrierExpected: ACTIVE_CANVAS_FILE,
    runtimeTableExpected: RUNTIME_TABLE_FILE,
    loadedAt: nowIso(),
    lastStatusPublish: "",
    lastError: ""
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value && typeof value === "object" ? { ...value } : value;
    }
  }

  function getActiveConductorContract() {
    return String(
      root.__HEARTH_ACTIVE_CONDUCTOR_CONTRACT__ ||
      root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR_CONTRACT__ ||
      root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ ||
      (
        root.HEARTH &&
        root.HEARTH.routeConductor &&
        root.HEARTH.routeConductor.contract
      ) ||
      ""
    );
  }

  function getActiveCanvasContract() {
    return String(
      root.__HEARTH_ACTIVE_CANVAS_CONTRACT__ ||
      root.__HEARTH_CANVAS_CONTRACT__ ||
      (
        root.HEARTH &&
        root.HEARTH.canvas &&
        root.HEARTH.canvas.contract
      ) ||
      (
        root.HEARTH_CANVAS &&
        root.HEARTH_CANVAS.contract
      ) ||
      ""
    );
  }

  function getRuntimeTableContract() {
    return String(
      root.LAB_RUNTIME_TABLE_CONTRACT ||
      root.RUNTIME_TABLE_CONTRACT ||
      (
        root.LAB_RUNTIME_TABLE &&
        root.LAB_RUNTIME_TABLE.contract
      ) ||
      (
        root.DEXTER_LAB &&
        root.DEXTER_LAB.runtimeTable &&
        root.DEXTER_LAB.runtimeTable.contract
      ) ||
      ""
    );
  }

  function publishDataset(status = "retired") {
    if (!doc || !doc.documentElement) return null;

    const dataset = doc.documentElement.dataset;

    dataset.hearthClimateRouteFileLoaded = "true";
    dataset.hearthClimateRouteRetired = "true";
    dataset.hearthClimateRouteTombstone = "true";
    dataset.hearthClimateRouteContract = CONTRACT;
    dataset.hearthClimateRouteReceipt = RECEIPT;
    dataset.hearthClimateRoutePreviousActiveContract = PREVIOUS_ACTIVE_CONTRACT;
    dataset.hearthClimateRoutePreviousActiveReceipt = PREVIOUS_ACTIVE_RECEIPT;
    dataset.hearthClimateRouteVersion = VERSION;
    dataset.hearthClimateRouteFile = FILE;

    dataset.hearthClimateRouteActiveCarrier = "false";
    dataset.hearthClimateRouteMountedCanvas = "false";
    dataset.hearthClimateRouteCreatedCanvas = "false";
    dataset.hearthClimateRouteRemovedCanvas = "false";
    dataset.hearthClimateRouteGeneratedTexture = "false";
    dataset.hearthClimateRouteBoundControls = "false";
    dataset.hearthClimateRouteAnimationStarted = "false";
    dataset.hearthClimateRouteRequestAnimationFrameUsed = "false";
    dataset.hearthClimateRouteActiveRouteClaimed = "false";

    dataset.hearthActiveRouteConductorExpected = ACTIVE_CONDUCTOR_FILE;
    dataset.hearthActiveCanvasCarrierExpected = ACTIVE_CANVAS_FILE;
    dataset.hearthRuntimeTableExpected = RUNTIME_TABLE_FILE;

    dataset.hearthClimateRouteStatus = status;
    dataset.hearthClimateRouteLoadedAt = state.loadedAt;
    dataset.hearthClimateRouteLastStatusPublish = nowIso();

    dataset.hearthRouteCarrierRedistribution = "true";
    dataset.hearthRouteCarrierRetiredFromClimateRoute = "true";
    dataset.hearthJsOwnsRouteConduction = "true";
    dataset.hearthCanvasOwnsVisibleCarrier = "true";
    dataset.runtimeTableDiagnosticOnly = "true";
    dataset.runtimeTableCannotBlankCarrier = "true";
    dataset.visibleCarrierFirst = "true";
    dataset.wideProbeDeferred = "true";
    dataset.singleAnchorIsLocalProofOnly = "true";
    dataset.sourceAuthorityHeld = "true";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    state.lastStatusPublish = dataset.hearthClimateRouteLastStatusPublish;

    return dataset;
  }

  function publishStatusNode(status = "retired") {
    if (!doc) return;

    const node =
      doc.getElementById("hearth-route-status") ||
      doc.querySelector("[data-hearth-route-status]") ||
      doc.getElementById("hearth-status") ||
      doc.querySelector("[data-hearth-status]");

    if (!node) return;

    const activeConductorContract = getActiveConductorContract();
    const activeCanvasContract = getActiveCanvasContract();
    const runtimeTableContract = getRuntimeTableContract();

    node.textContent = [
      "Hearth climate route is retired.",
      `Status ${status}`,
      `Tombstone ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `Previous active carrier ${PREVIOUS_ACTIVE_CONTRACT}`,
      `Active conductor expected ${ACTIVE_CONDUCTOR_FILE}`,
      `Active conductor contract ${activeConductorContract || "pending"}`,
      `Visible carrier expected ${ACTIVE_CANVAS_FILE}`,
      `Visible carrier contract ${activeCanvasContract || "pending"}`,
      `Runtime Table expected ${RUNTIME_TABLE_FILE}`,
      `Runtime Table contract ${runtimeTableContract || "pending-or-degraded"}`,
      "Climate route active carrier false",
      "Climate route mounted canvas false",
      "Climate route bound controls false",
      "Climate route animation false",
      "Runtime Table diagnostic only true",
      "Runtime Table missing cannot blank carrier true",
      "Visible carrier first true",
      "Wide-probe deferred true",
      "Generated image false",
      "GraphicBox false",
      "WebGL false",
      "Visual pass claimed false"
    ].join("\n");
  }

  function emitRetirementEvent() {
    if (!root || typeof root.dispatchEvent !== "function" || typeof root.CustomEvent !== "function") {
      return;
    }

    try {
      root.dispatchEvent(
        new root.CustomEvent("hearth:climate-route-retired", {
          detail: getReceipt()
        })
      );
    } catch (_error) {}
  }

  function getStatus() {
    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousActiveContract: PREVIOUS_ACTIVE_CONTRACT,
      previousActiveReceipt: PREVIOUS_ACTIVE_RECEIPT,
      version: VERSION,
      file: FILE,
      status: "retired",
      role: "compatibility-tombstone",
      activeCarrier: false,
      retired: true,
      tombstone: true,

      activeRouteConductorExpected: ACTIVE_CONDUCTOR_FILE,
      activeRouteConductorContract: getActiveConductorContract(),
      activeCanvasCarrierExpected: ACTIVE_CANVAS_FILE,
      activeCanvasCarrierContract: getActiveCanvasContract(),
      runtimeTableExpected: RUNTIME_TABLE_FILE,
      runtimeTableContract: getRuntimeTableContract(),

      mountedCanvas: false,
      createdCanvas: false,
      removedCanvas: false,
      generatedTexture: false,
      boundControls: false,
      animationStarted: false,
      requestAnimationFrameUsed: false,
      activeRouteClaimed: false,

      hearthJsOwnsRouteConduction: true,
      hearthCanvasOwnsVisibleCarrier: true,
      runtimeTableDiagnosticOnly: true,
      runtimeTableCannotBlankCarrier: true,
      visibleCarrierFirst: true,
      wideProbeDeferred: true,
      singleAnchorIsLocalProofOnly: true,
      sourceAuthorityHeld: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      loadedAt: state.loadedAt,
      lastStatusPublish: state.lastStatusPublish,
      lastError: state.lastError
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousActiveContract: PREVIOUS_ACTIVE_CONTRACT,
      previousActiveReceipt: PREVIOUS_ACTIVE_RECEIPT,
      version: VERSION,
      authority: "hearth-climate-route-retired-compatibility-tombstone",
      status: "retired",
      destinationFile: FILE,

      activeRouteConductorExpected: ACTIVE_CONDUCTOR_FILE,
      visibleCarrierExpected: ACTIVE_CANVAS_FILE,
      runtimeTableExpected: RUNTIME_TABLE_FILE,

      purpose: [
        "retire hearth.climate.route.js from active carrier duty",
        "prevent stale script references from remounting an obsolete procedural globe",
        "publish route-conductor handoff markers",
        "preserve compatibility without drawing, controls, animation, or canvas mutation"
      ],

      postgameRole: [
        "compatibility tombstone",
        "retirement receipt publisher",
        "non-rendering handoff marker"
      ],

      owns: [
        "retirement receipt",
        "compatibility markers",
        "route handoff notice"
      ],

      doesNotOwn: [
        "route conduction",
        "canvas mounting",
        "visible carrier drawing",
        "texture generation",
        "pointer controls",
        "runtime motion",
        "Runtime Table planning",
        "source truth",
        "atlas projection",
        "wide-probe diagnostics",
        "final visual pass claim"
      ],

      forbiddenRuntimeEffects: [
        "create canvas",
        "remove canvas",
        "mount globe",
        "generate texture",
        "bind pointer controls",
        "animate planet",
        "call requestAnimationFrame for planet rendering",
        "claim active route authority",
        "block canvas when Runtime Table is absent",
        "erase visible carrier because diagnostics are degraded"
      ],

      activeCarrier: false,
      retired: true,
      tombstone: true,
      hearthJsOwnsRouteConduction: true,
      hearthCanvasOwnsVisibleCarrier: true,
      runtimeTableDiagnosticOnly: true,
      runtimeTableCannotBlankCarrier: true,
      visibleCarrierFirst: true,
      wideProbeDeferred: true,
      singleAnchorIsLocalProofOnly: true,
      sourceAuthorityHeld: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function noop() {
    return getStatus();
  }

  function dispose() {
    state.lastStatusPublish = nowIso();

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthClimateRouteDisposed = "true";
      doc.documentElement.dataset.hearthClimateRouteDisposedAt = state.lastStatusPublish;
    }

    return getStatus();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousActiveContract: PREVIOUS_ACTIVE_CONTRACT,
    previousActiveReceipt: PREVIOUS_ACTIVE_RECEIPT,
    version: VERSION,
    file: FILE,

    getStatus,
    getReceipt,
    dispose,

    boot: noop,
    mount: noop,
    render: noop,
    start: noop,
    stop: noop,
    draw: noop,

    activeCarrier: false,
    retired: true,
    tombstone: true,
    mountedCanvas: false,
    createdCanvas: false,
    removedCanvas: false,
    generatedTexture: false,
    boundControls: false,
    animationStarted: false,
    requestAnimationFrameUsed: false,
    activeRouteClaimed: false,

    activeRouteConductorExpected: ACTIVE_CONDUCTOR_FILE,
    visibleCarrierExpected: ACTIVE_CANVAS_FILE,
    runtimeTableExpected: RUNTIME_TABLE_FILE,

    hearthJsOwnsRouteConduction: true,
    hearthCanvasOwnsVisibleCarrier: true,
    runtimeTableDiagnosticOnly: true,
    runtimeTableCannotBlankCarrier: true,
    visibleCarrierFirst: true,
    wideProbeDeferred: true,
    singleAnchorIsLocalProofOnly: true,
    sourceAuthorityHeld: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  });

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.retiredClimateRoute = api;
  root.HEARTH.climateRouteTombstone = api;

  if (!root.HEARTH.climateRoute || root.HEARTH.climateRoute.retired === true) {
    root.HEARTH.climateRoute = api;
  }

  root.HEARTH_CLIMATE_ROUTE = api;
  root.HEARTH_CLIMATE_ROUTE_TOMBSTONE = api;
  root.HEARTH_CLIMATE_ROUTE_RETIREMENT_RECEIPT = getReceipt();
  root.HEARTH_CLIMATE_ROUTE_CONTRACT = CONTRACT;
  root.HEARTH_CLIMATE_ROUTE_RECEIPT = RECEIPT;

  root.__HEARTH_RETIRED_CLIMATE_ROUTE_FILE__ = FILE;
  root.__HEARTH_RETIRED_CLIMATE_ROUTE_CONTRACT__ = CONTRACT;
  root.__HEARTH_RETIRED_CLIMATE_ROUTE_RECEIPT__ = RECEIPT;
  root.__HEARTH_PREVIOUS_CLIMATE_ROUTE_ACTIVE_CONTRACT__ = PREVIOUS_ACTIVE_CONTRACT;

  root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR_EXPECTED__ = ACTIVE_CONDUCTOR_FILE;
  root.__HEARTH_VISIBLE_CARRIER_EXPECTED__ = ACTIVE_CANVAS_FILE;
  root.__HEARTH_RUNTIME_TABLE_EXPECTED__ = RUNTIME_TABLE_FILE;

  publishDataset("retired");
  publishStatusNode("retired");
  emitRetirementEvent();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
