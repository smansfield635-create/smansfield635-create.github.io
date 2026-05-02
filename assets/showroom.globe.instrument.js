/* G1 PLANET 1 GENERATION 2 SEVEN FILE SYSTEMIC DYNAMIC REWRITE
   FILE: /assets/showroom.globe.instrument.js
   VERSION: G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1

   COMPATIBILITY MARKERS:
   G1_PLANET_1_RUNTIME_ASSET_BRIDGE_CHAIN_REPAIR_TNT_v1
   G1_PLANET_1_TERRAIN_DEPTH_NORMAL_RELIEF_TRANSLATION_PAIR_TNT_v1

   ROLE:
   Asset bridge owns reference handoff only.
   It does not own rendering, terrain generation, canvas replacement, runtime cadence, or visual pass.
*/

(function attachShowroomGlobeInstrumentGeneration2(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1";
  var COMPAT_VERSION = "G1_PLANET_1_RUNTIME_ASSET_BRIDGE_CHAIN_REPAIR_TNT_v1";
  var PRIOR_COMPAT_VERSION = "G1_PLANET_1_TERRAIN_DEPTH_NORMAL_RELIEF_TRANSLATION_PAIR_TNT_v1";

  var state = {
    active: true,
    handoffCount: 0,
    lastHandoff: null
  };

  function getReferences() {
    return {
      hydration: global.DGBPlanetOneHydrationRender || null,
      hexgrid: global.DGBPlanetOneHexgridRender || null,
      renderer: global.DGBPlanetOneRenderer || global.DGBPlanetOneRender || global.DGBPlanetOneRenderTeam || null,
      worldRuntime: global.DGBWorldRuntime || global.DGBPlanetOneRuntime || null,
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
      role: "REFERENCE_HANDOFF_ONLY",
      hydrationReady: Boolean(refs.hydration),
      hexgridReady: Boolean(refs.hexgrid),
      rendererReady: Boolean(refs.renderer),
      worldRuntimeReady: Boolean(refs.worldRuntime),
      controlReady: Boolean(refs.control),
      showroomRuntimeReady: Boolean(refs.showroomRuntime),
      noRendererOverride: true,
      noCanvasReplacement: true,
      noTerrainGeneration: true,
      noRuntimeCadence: true,
      visualPassClaimed: false,
      handedOffAt: new Date().toISOString()
    };

    return state.lastHandoff;
  }

  function mount(target, options) {
    var refs = getReferences();

    if (!refs.renderer) {
      return {
        ok: false,
        reason: "NO_RENDERER_REFERENCE",
        version: VERSION,
        referenceOnly: true,
        visualPassClaimed: false
      };
    }

    if (typeof refs.renderer.renderPlanetOne === "function") {
      return refs.renderer.renderPlanetOne(target, options || {});
    }

    if (typeof refs.renderer.render === "function") {
      return refs.renderer.render(target, options || {});
    }

    if (typeof refs.renderer.mount === "function") {
      return refs.renderer.mount(target, options || {});
    }

    return {
      ok: false,
      reason: "NO_RENDER_METHOD",
      version: VERSION,
      referenceOnly: true,
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
      role: "REFERENCE_HANDOFF_ONLY",
      systemicDynamicStandardActive: true,
      ownsReferenceHandoffOnly: true,
      ownsRendering: false,
      ownsTerrainGeneration: false,
      ownsCanvasReplacement: false,
      ownsRuntimeCadence: false,
      references: {
        hydrationReady: Boolean(refs.hydration),
        hexgridReady: Boolean(refs.hexgrid),
        rendererReady: Boolean(refs.renderer),
        worldRuntimeReady: Boolean(refs.worldRuntime),
        controlReady: Boolean(refs.control),
        showroomRuntimeReady: Boolean(refs.showroomRuntime)
      },
      handoffCount: state.handoffCount,
      lastHandoff: state.lastHandoff,
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

    getReferences: getReferences,
    handoff: handoff,
    mount: mount,
    getStatus: getStatus,
    status: getStatus,

    visualPassClaimed: false
  };

  global.DGBShowroomGlobeInstrument = api;

  handoff();

  try {
    global.dispatchEvent(new CustomEvent("dgb:showroom:globe-instrument:generation-2-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
