/* G1 PLANET 1 GENERATION 2 SEVEN FILE SYSTEMIC DYNAMIC REWRITE
   FILE: /showroom/runtime.js
   VERSION: G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1

   COMPATIBILITY MARKERS:
   G1_PLANET_1_SHOWROOM_RUNTIME_FRAME_BUDGET_BRIDGE_TNT_v1
   G1_PLANET_1_RUNTIME_FRAME_BUDGET_AND_RENDER_THROTTLE_TNT_v1

   ROLE:
   Showroom runtime owns route stabilization only.
   It does not own late canvas remount, renderer override, terrain flattening, or visual pass.
*/

(function attachShowroomRuntimeGeneration2(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1";
  var COMPAT_VERSION = "G1_PLANET_1_SHOWROOM_RUNTIME_FRAME_BUDGET_BRIDGE_TNT_v1";
  var RUNTIME_COMPAT_VERSION = "G1_PLANET_1_RUNTIME_FRAME_BUDGET_AND_RENDER_THROTTLE_TNT_v1";

  var state = {
    active: true,
    stabilized: false,
    mountAttempted: false,
    mountPerformed: false,
    lastReceipt: null
  };

  function byId(id) {
    return global.document ? global.document.getElementById(id) : null;
  }

  function mountElement() {
    if (!global.document) return null;
    return byId("planet-one-render") ||
      global.document.querySelector("[data-planet-one-mount='true']") ||
      null;
  }

  function hasRenderedCanvas(mount) {
    return Boolean(mount && mount.querySelector && mount.querySelector("canvas[data-planet-one-render-canvas='true']"));
  }

  function getRenderer() {
    return global.DGBPlanetOneRenderer ||
      global.DGBPlanetOneRender ||
      global.DGBPlanetOneRenderTeam ||
      null;
  }

  function getRuntime() {
    return global.DGBPlanetOneRuntime || global.DGBWorldRuntime || null;
  }

  function writeRouteReceipt(status) {
    var node = byId("planet-one-route-receipt");
    if (!node) return;

    node.textContent =
      "G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1\n" +
      "route=/showroom/globe/\n" +
      "showroom-runtime-role=route-stabilization-only\n" +
      "late-remount=false\n" +
      "renderer-override=false\n" +
      "terrain-flattening=false\n" +
      "visual-pass-claimed=false\n" +
      "status=" + status + "\n" +
      "timestamp=" + new Date().toISOString();
  }

  function stabilizeRoute(options) {
    options = options || {};

    var mount = mountElement();
    var renderer = getRenderer();
    var runtime = getRuntime();
    var alreadyRendered = hasRenderedCanvas(mount);

    state.stabilized = true;

    var receipt = {
      ok: true,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      role: "ROUTE_STABILIZATION_ONLY",
      mountPresent: Boolean(mount),
      rendererPresent: Boolean(renderer),
      runtimePresent: Boolean(runtime),
      alreadyRendered: alreadyRendered,
      lateRemountBlocked: true,
      rendererOverrideBlocked: true,
      terrainFlatteningBlocked: true,
      visualPassClaimed: false,
      stabilizedAt: new Date().toISOString()
    };

    if (runtime && typeof runtime.registerMount === "function" && mount) {
      runtime.registerMount(mount, options);
    }

    if (!alreadyRendered && options.mountIfEmpty === true && renderer && mount) {
      state.mountAttempted = true;

      if (typeof renderer.renderPlanetOne === "function") {
        receipt.rendererReceipt = renderer.renderPlanetOne(mount, options);
      } else if (typeof renderer.render === "function") {
        receipt.rendererReceipt = renderer.render(mount, options);
      } else if (typeof renderer.mount === "function") {
        receipt.rendererReceipt = renderer.mount(mount, options);
      }

      state.mountPerformed = Boolean(receipt.rendererReceipt);
      receipt.mountPerformed = state.mountPerformed;
    } else {
      receipt.mountPerformed = false;
      receipt.reason = alreadyRendered ? "CANVAS_ALREADY_PRESENT_NO_REMOUNT" : "MOUNT_IF_EMPTY_FALSE";
    }

    state.lastReceipt = receipt;
    writeRouteReceipt("STABILIZED_NO_LATE_REMOUNT");

    return receipt;
  }

  function mountIfEmpty(target, options) {
    options = Object.assign({}, options || {}, { mountIfEmpty: true });

    if (target) {
      var renderer = getRenderer();
      if (renderer && typeof renderer.renderPlanetOne === "function" && !hasRenderedCanvas(target)) {
        state.mountAttempted = true;
        state.mountPerformed = true;
        state.lastReceipt = renderer.renderPlanetOne(target, options);
        return state.lastReceipt;
      }
    }

    return stabilizeRoute(options);
  }

  function getStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      runtimeCompatibilityVersion: RUNTIME_COMPAT_VERSION,
      role: "ROUTE_STABILIZATION_ONLY",
      systemicDynamicStandardActive: true,
      ownsRouteStabilizationOnly: true,
      ownsLateCanvasRemount: false,
      ownsRendererOverride: false,
      ownsTerrainFlattening: false,
      ownsRuntimeCadence: false,
      stabilized: state.stabilized,
      mountAttempted: state.mountAttempted,
      mountPerformed: state.mountPerformed,
      lastReceipt: state.lastReceipt,
      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    COMPAT_VERSION: COMPAT_VERSION,
    compatibilityVersion: COMPAT_VERSION,
    RUNTIME_COMPAT_VERSION: RUNTIME_COMPAT_VERSION,
    runtimeCompatibilityVersion: RUNTIME_COMPAT_VERSION,

    stabilizeRoute: stabilizeRoute,
    mountIfEmpty: mountIfEmpty,
    getStatus: getStatus,
    status: getStatus,

    visualPassClaimed: false
  };

  global.DGBShowroomGlobeRuntime = api;
  global.DGBPlanetOneRuntimeBridge = api;

  function boot() {
    stabilizeRoute({ mountIfEmpty: false, showAxis: true });
  }

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }
  }

  try {
    global.dispatchEvent(new CustomEvent("dgb:showroom:runtime:generation-2-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
