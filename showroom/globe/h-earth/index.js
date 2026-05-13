// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_REUSABLE_ENVIRONMENT_ENGINE_CONDUCTOR_TNT_v1
// Owns: H-Earth child-route conductor only.
// Imports reusable planet environment modules.
// Does not mutate /showroom/globe/.

import { createGroundEnvironmentScene } from "/assets/world/environment/scene.js";
import { getHEarthWesternGoldenShelfProfile } from "/assets/h-earth/h-earth.environment.profile.js";

const CONTRACT = "H_EARTH_REUSABLE_ENVIRONMENT_ENGINE_CONDUCTOR_TNT_v1";

const state = {
  canvas: null,
  scene: null,
  bootError: null
};

function setStatus(text) {
  const node = document.querySelector("[data-render-status]");
  if (node) node.textContent = text;
}

function markDocument(extra = {}) {
  const markers = {
    page: "h-earth-reusable-ground-engine",
    route: "/showroom/globe/h-earth/",
    contract: CONTRACT,
    parentBaseline: "/showroom/globe/",
    parentMutation: "false",
    groundLevel: "true",
    reusableEnvironmentEngine: "true",
    staticImageSource: "false",
    waterBehindManor: "true",
    shimmerProtocol: "active",
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  });
}

function init() {
  markDocument({ boot: "started" });

  state.canvas = document.querySelector("[data-h-earth-ground-canvas]");

  if (!state.canvas) {
    state.bootError = "Ground canvas missing.";
    setStatus(state.bootError);
    markDocument({ rendered: "false", error: state.bootError });
    return;
  }

  try {
    const profile = getHEarthWesternGoldenShelfProfile();

    state.scene = createGroundEnvironmentScene(state.canvas, profile, {
      targetFrameMs: 50,
      maxDpr: 1.75,
      minWidth: 960,
      minHeight: 1180
    }).start();

    setStatus("Reusable ground environment engine active. Shimmer Protocol active.");
    markDocument({ rendered: "true", sceneEngine: "active" });
  } catch (error) {
    state.bootError = error?.message || "Reusable environment engine failed.";
    setStatus(state.bootError);
    markDocument({ rendered: "false", error: state.bootError });
  }

  window.DGBHEarthGround = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        route: "/showroom/globe/h-earth/",
        parentBaseline: "/showroom/globe/",
        parentMutation: false,
        reusableEnvironmentEngine: true,
        shimmerProtocol: true,
        bootError: state.bootError,
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
