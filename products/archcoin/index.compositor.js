/* /products/archcoin/index.compositor.js
   ARCHCOIN camera, projection and layer authority.
   DGB_ARCHCOIN_COMPOSITOR 2.0.0-transactional-postures
*/
(() => {
  "use strict";
  const MODULE = Object.freeze({ id: "DGB_ARCHCOIN_COMPOSITOR", version: "2.0.0-transactional-postures" });
  let root, field, controller, initialized = false;
  function resize() {
    if (!field) return;
    const rect = field.getBoundingClientRect();
    root.style.setProperty("--archcoin-field-width", `${rect.width}px`);
    root.style.setProperty("--archcoin-field-height", `${rect.height}px`);
    root.dataset.archcoinViewport = rect.width < 540 ? "mobile" : rect.width < 900 ? "tablet" : "desktop";
  }
  function apply(frame) {
    root.dataset.archcoinCameraPosture = frame.structuralState === "CONSTELLATION" ? "ORIENTATION_CAMERA" : frame.structuralState === "SYSTEM_HELD" ? "HELD_CAMERA" : "CLUSTER_CAMERA";
    root.dataset.archcoinCompositorStatus = "ready";
    root.dataset.archcoinCompositorReceipt = JSON.stringify({ module: MODULE, cameraAuthority: true, cinematicTravel: false, homeCompassOverlapOwned: true, doubleClearCount: 0 });
  }
  function initialize() {
    if (initialized) return true;
    root = document.querySelector("[data-archcoin-root]");
    field = document.querySelector("[data-archcoin-scene-field]");
    controller = window.DGB_ARCHCOIN_CONTROLLER;
    if (!root || !field || !controller) return false;
    controller.subscribe(apply);
    new ResizeObserver(resize).observe(field);
    resize();
    initialized = true;
    return true;
  }
  window.DGB_ARCHCOIN_COMPOSITOR = Object.freeze({ MODULE, initialize, resize });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true }); else initialize();
})();