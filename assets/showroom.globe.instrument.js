/* ASSET GENERATION 2 TERMS RENEWAL
   FILE: /assets/showroom.globe.instrument.js
   VERSION: ASSET_GENERATION_2_TERMS_RENEWAL_TNT_v1

   COMPATIBILITY MARKERS:
   G1_PLANET_1_RUNTIME_ASSET_BRIDGE_CHAIN_REPAIR_TNT_v1
   G1_PLANET_1_TERRAIN_DEPTH_NORMAL_RELIEF_TRANSLATION_PAIR_TNT_v1

   ROLE:
   Bridge the Showroom / Planet 1 route to the Demo Universe Earth asset spine.
   Reference handoff only. No canvas ownership, no runtime ownership, no visual pass claim.
*/

(function attachShowroomGlobeInstrumentAssetGeneration2(global) {
  "use strict";

  var VERSION = "ASSET_GENERATION_2_TERMS_RENEWAL_TNT_v1";
  var COMPAT_VERSION = "G1_PLANET_1_RUNTIME_ASSET_BRIDGE_CHAIN_REPAIR_TNT_v1";
  var PRIOR_COMPAT_VERSION = "G1_PLANET_1_TERRAIN_DEPTH_NORMAL_RELIEF_TRANSLATION_PAIR_TNT_v1";

  var ASSET_SPINE = {
    surface: "/assets/earth/earth_surface_2048.jpg",
    clouds: "/assets/earth/earth_clouds_2048.jpg",
    canvas: "/assets/earth/earth_canvas.js",
    material: "/assets/earth/earth_material.css",
    manifest: "/assets/earth/earth_manifest.json"
  };

  var state = {
    handoffCount: 0,
    lastHandoff: null,
    lastMount: null
  };

  function getEarthCanvas() {
    return global.DGBEarthAssetCanvas || global.DGBDemoUniverseEarthCanvas || null;
  }

  function getPlanetRenderer() {
    return global.DGBPlanetOneRenderer ||
      global.DGBPlanetOneRender ||
      global.DGBPlanetOneRenderTeam ||
      null;
  }

  function getRuntime() {
    return global.DGBPlanetOneRuntime || global.DGBWorldRuntime || null;
  }

  function getReferences() {
    return {
      earthCanvas: getEarthCanvas(),
      planetRenderer: getPlanetRenderer(),
      runtime: getRuntime(),
      control: global.DGBPlanetOneControl || global.DGBWorldControl || null,
      showroomRuntime: global.DGBShowroomGlobeRuntime || null
    };
  }

  function handoff() {
    var refs = getReferences();

    state.handoffCount += 1;
    state.lastHandoff = {
      ok: true,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      role: "DEMO_UNIVERSE_EARTH_ASSET_HANDOFF_ONLY",
      assetSpine: ASSET_SPINE,
      earthCanvasReady: Boolean(refs.earthCanvas),
      planetRendererReady: Boolean(refs.planetRenderer),
      runtimeReady: Boolean(refs.runtime),
      controlReady: Boolean(refs.control),
      showroomRuntimeReady: Boolean(refs.showroomRuntime),
      ownsCanvas: false,
      ownsRuntime: false,
      ownsTerrain: false,
      ownsRoute: false,
      graphicBox: false,
      generatedImage: false,
      visualPassClaimed: false,
      handedOffAt: new Date().toISOString()
    };

    return state.lastHandoff;
  }

  function mountDemoUniverse(target, options) {
    var renderer = getPlanetRenderer();
    var earth = getEarthCanvas();

    options = Object.assign({
      demoUniverseEarthBaseline: true,
      viewLon: -28,
      viewLat: 0,
      brightness: 1.13,
      contrast: 1.10,
      cloudStrength: 0.28,
      atmosphere: 0.16
    }, options || {});

    if (renderer && typeof renderer.renderPlanetOne === "function") {
      state.lastMount = renderer.renderPlanetOne(target, options);
      return state.lastMount;
    }

    if (earth && typeof earth.mount === "function") {
      state.lastMount = earth.mount(target, options);
      return state.lastMount;
    }

    return {
      ok: false,
      reason: "NO_EARTH_OR_PLANET_RENDERER",
      version: VERSION,
      visualPassClaimed: false
    };
  }

  function getStatus() {
    var refs = getReferences();

    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      priorCompatibilityVersion: PRIOR_COMPAT_VERSION,
      role: "DEMO_UNIVERSE_EARTH_ASSET_HANDOFF_ONLY",
      assetSpine: ASSET_SPINE,
      earthCanvasReady: Boolean(refs.earthCanvas),
      planetRendererReady: Boolean(refs.planetRenderer),
      runtimeReady: Boolean(refs.runtime),
      controlReady: Boolean(refs.control),
      showroomRuntimeReady: Boolean(refs.showroomRuntime),
      handoffCount: state.handoffCount,
      lastHandoff: state.lastHandoff,
      lastMount: state.lastMount,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsTerrain: false,
      ownsRoute: false,
      graphicBox: false,
      generatedImage: false,
      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    COMPAT_VERSION: COMPAT_VERSION,
    compatibilityVersion: COMPAT_VERSION,
    PRIOR_COMPAT_VERSION: PRIOR_COMPAT_VERSION,
    priorCompatibilityVersion: PRIOR_COMPAT_VERSION,
    ASSET_SPINE: ASSET_SPINE,
    assetSpine: ASSET_SPINE,
    getReferences: getReferences,
    handoff: handoff,
    mountDemoUniverse: mountDemoUniverse,
    mount: mountDemoUniverse,
    getStatus: getStatus,
    status: getStatus,
    visualPassClaimed: false
  };

  global.DGBShowroomGlobeInstrument = api;
  global.DGBDemoUniverseAssetBridge = api;

  handoff();

  try {
    global.dispatchEvent(new CustomEvent("dgb:showroom:globe-instrument:asset-generation-2-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
