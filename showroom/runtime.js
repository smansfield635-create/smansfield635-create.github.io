/*
  /showroom/runtime.js
  SHOWROOM_RUNTIME_STATE_v1

  Runtime owns state and receipts only.
  No DOM replacement.
*/

(function () {
  "use strict";

  const VERSION = "showroom-runtime-state-v1";

  const state = {
    generation1: "layout-established",
    generation2: "active-globe-target",
    generation3: "shadow-detail-blocked",
    activeGlobeStatus: "pending",
    reducedMotion: false,
    started: false
  };

  function detectReducedMotion() {
    state.reducedMotion =
      Boolean(window.matchMedia) &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches === true;
  }

  function writeReceipts(status) {
    state.activeGlobeStatus = status || state.activeGlobeStatus;

    const nodes = [
      document.getElementById("showroom-root"),
      document.getElementById("showroom-main"),
      document.getElementById("showroom-globe-mount")
    ];

    nodes.forEach(function (node) {
      if (!node) return;

      node.dataset.showroomRuntime = VERSION;
      node.dataset.generation1LayoutEstablished = "true";
      node.dataset.generation2ActiveGlobe = state.activeGlobeStatus;
      node.dataset.generation3 = "shadow-detail-blocked-until-generation-2-pass";
      node.dataset.reducedMotion = state.reducedMotion ? "true" : "false";
    });
  }

  function start() {
    detectReducedMotion();
    state.started = true;
    writeReceipts("runtime-started");

    return getState();
  }

  function setActiveGlobeStatus(status) {
    writeReceipts(status);
    return getState();
  }

  function getState() {
    return {
      generation1: state.generation1,
      generation2: state.generation2,
      generation3: state.generation3,
      activeGlobeStatus: state.activeGlobeStatus,
      reducedMotion: state.reducedMotion,
      started: state.started
    };
  }

  window.DGBShowroomRuntime = Object.freeze({
    version: VERSION,
    start,
    setActiveGlobeStatus,
    getState
  });
})();
