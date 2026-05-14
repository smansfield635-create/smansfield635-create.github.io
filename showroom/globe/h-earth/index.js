// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_SKY_WATER_GROUND_MINIMAL_VISIBILITY_TNT_v1
// Purpose: boot only the minimal sky/water/ground scene.
// No module ledger. No structure. No foliage. No terrain detail. No parent Globe edits.

const CONTRACT = "H_EARTH_SKY_WATER_GROUND_MINIMAL_VISIBILITY_TNT_v1";
const ROUTE = "/showroom/globe/h-earth/";
const PARENT_BASELINE = "/showroom/globe/";
const SCENE_SRC =
  "/assets/world/environment/scene.js?v=H_EARTH_SKY_WATER_GROUND_MINIMAL_VISIBILITY_TNT_v1";

const state = {
  mode: "booting",
  scene: null,
  error: null
};

function setStatus(text) {
  const node = document.querySelector("[data-render-status]");
  if (node) node.textContent = text;
}

function markDocument(extra = {}) {
  const markers = {
    page: "h-earth-sky-water-ground-minimal-visibility",
    route: ROUTE,
    contract: CONTRACT,
    parentBaseline: PARENT_BASELINE,
    parentMutation: "false",
    sceneMode: "sky-water-ground-only",
    noStructure: "true",
    noFoliage: "true",
    noTerrainDetail: "true",
    noWildlife: "true",
    noCloudDetail: "true",
    mode: state.mode,
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  });
}

async function init() {
  markDocument({ boot: "started" });

  const canvas = document.querySelector("[data-h-earth-ground-canvas]");

  if (!canvas) {
    state.mode = "failed";
    state.error = "ground-canvas-missing";
    setStatus("Minimal renderer failed. Ground canvas missing.");
    markDocument({ rendered: "false", error: state.error });
    return;
  }

  try {
    setStatus("Loading minimal sky/water/ground renderer.");
    const sceneModule = await import(SCENE_SRC);

    if (typeof sceneModule.createGroundEnvironmentScene !== "function") {
      throw new Error("createGroundEnvironmentScene export missing.");
    }

    state.scene = sceneModule.createGroundEnvironmentScene(canvas, null, {
      maxDpr: 1.5,
      minWidth: 720,
      minHeight: 900,
      targetFrameMs: 80
    });

    state.scene.start();
    state.mode = "minimal";

    setStatus("Minimal renderer active. Sky, water, and ground only.");
    markDocument({
      rendered: "true",
      mode: state.mode,
      sceneSource: SCENE_SRC
    });
  } catch (error) {
    state.mode = "failed";
    state.error = error?.message || "minimal-renderer-failed";
    setStatus(`Minimal renderer failed: ${state.error}`);
    markDocument({
      rendered: "false",
      mode: state.mode,
      error: state.error
    });
  }

  window.DGBHEarthGround = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        route: ROUTE,
        parentBaseline: PARENT_BASELINE,
        parentMutation: false,
        mode: state.mode,
        sceneMode: "sky-water-ground-only",
        noStructure: true,
        noFoliage: true,
        noTerrainDetail: true,
        noWildlife: true,
        sceneSource: SCENE_SRC,
        error: state.error,
        scene: state.scene?.status?.() || null
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

export default init;
