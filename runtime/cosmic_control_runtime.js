/* TNT RENEWAL — /runtime/cosmic_control_runtime.js
   COSMIC CONTROL RUNTIME · NON-OVERLAP PASSIVE READER B2

   VERSION = "cosmic-control-plane-b2"
   ROOT_BOOT_ID = "root-sun-asset-b1"
   COCKPIT_VERSION = "root-compass-cockpit-b1"

   PURPOSE:
     - Stop execution-state overlap with /index.js
     - Do NOT bind controls
     - Do NOT mutate data-cockpit-view
     - Do NOT mutate data-layer-*
     - Do NOT overwrite DGBIndexBoot
     - Do NOT overwrite DGBCompassCockpit
     - Do NOT run mutation loops
     - Do NOT own render CSS
     - Do NOT own instrument panel DOM
     - Read cockpit state only
     - Mark only cosmic-control-plane ownership attributes
     - Expose DGBCosmicControlRuntime as passive read API

   SINGLE-WRITER CONTRACT:
     /index.js owns cockpit state.
     /runtime/compass_cockpit_render.js owns visual render CSS.
     /runtime/compass_cockpit_control_panel.js owns control-panel DOM.
     /runtime/cosmic_control_runtime.js owns passive cosmic-control receipt only.
*/

(function () {
  "use strict";

  var VERSION = "cosmic-control-plane-b2";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var COCKPIT_VERSION = "root-compass-cockpit-b1";
  var READY_EVENT = "dgb:cosmic-control:ready";
  var UPDATE_EVENT = "dgb:cosmic-control:update";

  var META = Object.freeze({
    name: "COSMIC_CONTROL_RUNTIME",
    version: VERSION,
    role: "passive_cosmic_control_receipt_reader",
    contract: "COSMIC_CONTROL_NON_OVERLAP_CONTRACT_B2",
    status: "ACTIVE_PASSIVE",
    deterministic: true
  });

  var state = {
    version: VERSION,
    booted: false,
    updatedAt: null,
    rootPresent: false,
    cockpitPresent: false,
    indexBootPresent: false,
    rootBootAligned: false,
    cockpitVersionAligned: false,
    view: "unknown",
    layers: {
      planets: null,
      paths: null,
      axes: null,
      nebula: null,
      milkyWay: null,
      solarWind: null
    },
    publicCockpitState: null,
    lastError: ""
  };

  var scheduled = false;

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function rootNode() {
    return document.getElementById("door-root") || $("[data-root-door]");
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function readBoolAttr(node, attr) {
    var value;

    if (!node) return null;

    value = node.getAttribute(attr);
    if (value === "true") return true;
    if (value === "false") return false;

    return null;
  }

  function safeCockpitState() {
    try {
      if (window.DGBCompassCockpit && typeof window.DGBCompassCockpit.getPublicState === "function") {
        return window.DGBCompassCockpit.getPublicState();
      }
    } catch (error) {
      state.lastError = error && error.message ? error.message : "cockpit public state read failed";
    }

    return null;
  }

  function readState() {
    var root = rootNode();
    var body = document.body;
    var cockpitState = safeCockpitState();

    state.updatedAt = nowIso();
    state.rootPresent = Boolean(root);
    state.cockpitPresent = Boolean(window.DGBCompassCockpit);
    state.indexBootPresent = Boolean(window.DGBIndexBoot);
    state.rootBootAligned = Boolean(root && root.getAttribute("data-root-boot-id") === ROOT_BOOT_ID);
    state.cockpitVersionAligned = Boolean(root && root.getAttribute("data-compass-cockpit") === COCKPIT_VERSION);
    state.view = String(
      (cockpitState && cockpitState.view) ||
      (root && root.getAttribute("data-cockpit-view")) ||
      (body && body.getAttribute("data-cockpit-view")) ||
      "unknown"
    );

    state.layers.planets = readBoolAttr(root, "data-layer-planets");
    state.layers.paths = readBoolAttr(root, "data-layer-paths");
    state.layers.axes = readBoolAttr(root, "data-layer-axes");
    state.layers.nebula = readBoolAttr(root, "data-layer-nebula");
    state.layers.milkyWay = readBoolAttr(root, "data-layer-milkyway");
    state.layers.solarWind = readBoolAttr(root, "data-layer-solarwind");
    state.publicCockpitState = cockpitState;

    return state;
  }

  function markOwnReceiptOnly() {
    var root = rootNode();

    if (!root) return null;

    root.setAttribute("data-cosmic-control-plane", VERSION);
    root.setAttribute("data-cosmic-control-runtime", VERSION);
    root.setAttribute("data-cosmic-control-authority", "passive-receipt-reader");
    root.setAttribute("data-cosmic-control-contract", "COSMIC_CONTROL_NON_OVERLAP_CONTRACT_B2");
    root.setAttribute("data-cosmic-control-status", "ACTIVE_PASSIVE");

    return root;
  }

  function dispatch(name) {
    try {
      window.dispatchEvent(new CustomEvent(name, {
        detail: getPublicState()
      }));
    } catch (error) {
      /* no-op */
    }
  }

  function sync() {
    scheduled = false;
    readState();
    markOwnReceiptOnly();
    dispatch(UPDATE_EVENT);
  }

  function scheduleSync() {
    if (scheduled) return;
    scheduled = true;

    window.requestAnimationFrame(sync);
  }

  function getPublicState() {
    return {
      meta: META,
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      cockpitVersion: COCKPIT_VERSION,
      booted: state.booted,
      updatedAt: state.updatedAt,
      rootPresent: state.rootPresent,
      cockpitPresent: state.cockpitPresent,
      indexBootPresent: state.indexBootPresent,
      rootBootAligned: state.rootBootAligned,
      cockpitVersionAligned: state.cockpitVersionAligned,
      view: state.view,
      layers: {
        planets: state.layers.planets,
        paths: state.layers.paths,
        axes: state.layers.axes,
        nebula: state.layers.nebula,
        milkyWay: state.layers.milkyWay,
        solarWind: state.layers.solarWind
      },
      cockpit: state.publicCockpitState,
      lastError: state.lastError,
      ownership: {
        writesCockpitView: false,
        writesLayerState: false,
        bindsControls: false,
        ownsRenderCss: false,
        ownsControlPanelDom: false,
        ownsInstrumentPanelDom: false,
        ownsCanopyTruth: false,
        ownsOperatorApi: false,
        ownsPassiveReceipt: true
      }
    };
  }

  function expose() {
    window.DGBCosmicControlRuntime = {
      meta: META,
      version: VERSION,
      sync: scheduleSync,
      readState: readState,
      getPublicState: getPublicState
    };
  }

  function boot() {
    state.booted = true;
    expose();
    sync();
    dispatch(READY_EVENT);

    window.addEventListener("dgb:cockpit:viewchange", scheduleSync, { passive: true });
    window.addEventListener("dgb:cockpit:controlpanelready", scheduleSync, { passive: true });
    window.addEventListener("dgb:cockpit:runtimequeue", scheduleSync, { passive: true });

    window.setTimeout(scheduleSync, 250);
    window.setTimeout(scheduleSync, 1000);
  }

  expose();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
