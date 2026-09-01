/* /prototypes/universal-compass/archcoin.lab.guard.js */
(() => {
  "use strict";
  const expected = Object.freeze([
    "/prototypes/universal-compass/archcoin.index.css",
    "/prototypes/universal-compass/archcoin.index.controller.js",
    "/prototypes/universal-compass/archcoin.index.compositor.js",
    "/prototypes/universal-compass/archcoin.index.crystals.js",
    "/prototypes/universal-compass/archcoin.index.interactions.js",
    "/prototypes/universal-compass/archcoin.upstream-compass.css",
    "/prototypes/universal-compass/archcoin.upstream-compass.geometry.js",
    "/prototypes/universal-compass/archcoin.upstream-compass.renderer.js"
  ]);
  window.__ARCHCOIN_CALIBRATION_LAB__ = Object.freeze({
    isolated: true,
    build: "ARCHCOIN_ISOLATION_v1",
    expectedLocalAssets: expected
  });
  document.documentElement.dataset.archcoinCalibrationLab = "isolated";
})();
