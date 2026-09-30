/* ASSET GENERATION 2 EARTH VISIBILITY / AXIS / SPIN / TOUCH
   FILE: /world/render/planet-one.render.js
   VERSION: ASSET_GENERATION_2_EARTH_VISIBILITY_AXIS_SPIN_TOUCH_TNT_v1

   COMPATIBILITY MARKERS:
   G1_PLANET_1_BLOB_BREAKUP_REAL_PLANET_SURFACE_TNT_v1
   G1_PLANET_1_HYDROLOGY_RECEIVER_VISIBILITY_AND_LAND_ALPHA_REBALANCE_TNT_v1
   G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1

   ROLE:
   Planet 1 renderer delegates visual rendering to the Demo Universe Earth asset canvas.
   It does not own route runtime, Gauges, or lock-in.
*/

(function attachPlanetOneEarthDelegatingRenderer(global) {
  "use strict";

  var VERSION = "ASSET_GENERATION_2_EARTH_VISIBILITY_AXIS_SPIN_TOUCH_TNT_v1";
  var COMPAT_VERSION = "G1_PLANET_1_BLOB_BREAKUP_REAL_PLANET_SURFACE_TNT_v1";
  var PRIOR_COMPAT_VERSION = "G1_PLANET_1_HYDROLOGY_RECEIVER_VISIBILITY_AND_LAND_ALPHA_REBALANCE_TNT_v1";
  var SYSTEMIC_COMPAT_VERSION = "G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1";

  var state = {
    mounted: false,
    renderCount: 0,
    lastReceipt: null
  };

  function earth() {
    return global.DGBEarthAssetCanvas || global.DGBDemoUniverseEarthCanvas || null;
  }

  function resolveMount(target) {
    if (typeof target === "string" && global.document) return global.document.querySelector(target);
    if (target) return target;

    if (!global.document) return null;

    return global.document.getElementById("planet-one-render") ||
      global.document.querySelector("[data-earth-asset-mount='true']") ||
      global.document.querySelector("[data-planet-one-mount='true']");
  }

  function renderPlanetOne(target, options) {
    var mount = resolveMount(target);
    var asset = earth();

    options = Object.assign({
      autoSpin: true,
      showAxis: true,
      touchEnabled: true,
      brightness: 1.10,
      contrast: 1.08,
      cloudStrength: 0.30
    }, options || {});

    if (!mount) {
      state.lastReceipt = {
        ok: false,
        reason: "NO_MOUNT",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastReceipt;
    }

    if (!asset || typeof asset.mount !== "function") {
      state.lastReceipt = {
        ok: false,
        reason: "EARTH_ASSET_NOT_READY",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastReceipt;
    }

    state.renderCount += 1;
    state.mounted = true;
    state.lastReceipt = asset.mount(mount, options);

    return {
      ok: Boolean(state.lastReceipt && state.lastReceipt.ok !== false),
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      priorCompatibilityVersion: PRIOR_COMPAT_VERSION,
      systemicCompatibilityVersion: SYSTEMIC_COMPAT_VERSION,
      role: "PLANET_ONE_DEMO_UNIVERSE_EARTH_DELEGATING_RENDERER",
      renderCount: state.renderCount,
      demoUniverseEarthBaseline: true,
      earthAssetSpineAdopted: true,
      axisVisible: true,
      spinRequested: true,
      touchRequested: true,
      ownsRouteRuntime: false,
      ownsGauges: false,
      visualPassClaimed: false,
      earthReceipt: state.lastReceipt
    };
  }

  function render(target, options) { return renderPlanetOne(target, options); }
  function renderGlobe(target, options) { return renderPlanetOne(target, options); }
  function mount(target, options) { return renderPlanetOne(target, options); }
  function mountPlanetOne(target, options) { return renderPlanetOne(target, options); }
  function create(target, options) { return renderPlanetOne(target, options); }
  function createPlanetOneRender(target, options) { return renderPlanetOne(target, options); }
  function createPlanetOneScene(target, options) { return renderPlanetOne(target, options); }

  function start() {
    var asset = earth();
    if (asset && typeof asset.start === "function") return asset.start();
    return getStatus();
  }

  function pause() {
    var asset = earth();
    if (asset && typeof asset.pause === "function") return asset.pause();
    return getStatus();
  }

  function resume() {
    var asset = earth();
    if (asset && typeof asset.resume === "function") return asset.resume();
    return getStatus();
  }

  function reset() {
    var asset = earth();
    if (asset && typeof asset.reset === "function") return asset.reset();
    return getStatus();
  }

  function reverse() {
    var asset = earth();
    if (asset && typeof asset.reverse === "function") return asset.reverse();
    return getStatus();
  }

  function slow() {
    var asset = earth();
    if (asset && typeof asset.slow === "function") return asset.slow();
    return getStatus();
  }

  function normal() {
    var asset = earth();
    if (asset && typeof asset.normal === "function") return asset.normal();
    return getStatus();
  }

  function fast() {
    var asset = earth();
    if (asset && typeof asset.fast === "function") return asset.fast();
    return getStatus();
  }

  function setSpeed(value) {
    var asset = earth();
    if (asset && typeof asset.setSpeed === "function") return asset.setSpeed(value);
    return getStatus();
  }

  function getStatus() {
    var asset = earth();

    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      priorCompatibilityVersion: PRIOR_COMPAT_VERSION,
      systemicCompatibilityVersion: SYSTEMIC_COMPAT_VERSION,
      role: "PLANET_ONE_DEMO_UNIVERSE_EARTH_DELEGATING_RENDERER",
      mounted: state.mounted,
      renderCount: state.renderCount,
      earthAssetReady: Boolean(asset),
      demoUniverseEarthBaseline: true,
      axisEnabled: true,
      spinEnabled: true,
      touchEnabled: true,
      ownsRouteRuntime: false,
      ownsGauges: false,
      visualPassClaimed: false,
      lastReceipt: state.lastReceipt,
      earthStatus: asset && typeof asset.getStatus === "function" ? asset.getStatus() : null
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    COMPAT_VERSION: COMPAT_VERSION,
    compatibilityVersion: COMPAT_VERSION,
    PRIOR_COMPAT_VERSION: PRIOR_COMPAT_VERSION,
    priorCompatibilityVersion: PRIOR_COMPAT_VERSION,
    SYSTEMIC_COMPAT_VERSION: SYSTEMIC_COMPAT_VERSION,
    systemicCompatibilityVersion: SYSTEMIC_COMPAT_VERSION,
    renderPlanetOne: renderPlanetOne,
    render: render,
    renderGlobe: renderGlobe,
    mount: mount,
    mountPlanetOne: mountPlanetOne,
    create: create,
    createPlanetOneRender: createPlanetOneRender,
    createPlanetOneScene: createPlanetOneScene,
    start: start,
    pause: pause,
    resume: resume,
    reset: reset,
    reverse: reverse,
    slow: slow,
    normal: normal,
    fast: fast,
    setSpeed: setSpeed,
    getStatus: getStatus,
    status: getStatus,
    visualPassClaimed: false
  };

  global.DGBPlanetOneRenderTeam = api;
  global.DGBPlanetOneRenderer = api;
  global.DGBPlanetOneRender = api;

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:earth-axis-spin-touch-renderer-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
