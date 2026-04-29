/*
  /showroom/globe/index.js
  DEMO_UNIVERSE_EARTH_STANDALONE_BOOT_v1

  Standalone globe route boot.
  Consumes /assets/showroom.globe.instrument.js.
*/

(function () {
  "use strict";

  const VERSION = "demo-universe-earth-standalone-boot-v1";
  const MOUNT_ID = "showroom-globe-mount";

  function bootStandaloneGlobe() {
    const mount = document.getElementById(MOUNT_ID);

    if (!mount) return;

    if (!window.DGBShowroomGlobeInstrument || typeof window.DGBShowroomGlobeInstrument.renderGlobe !== "function") {
      mount.dataset.renderStatus = "instrument-missing";
      mount.textContent = "Demo Universe Earth instrument missing.";
      return;
    }

    window.DGBShowroomGlobeInstrument.renderGlobe(mount, {
      context: "standalone",
      caption: "GENERATION 2 · DEMO UNIVERSE EARTH · ACTIVE GLOBE"
    });

    window.DGBShowroomGlobeInstrument.writeReceipts(mount, "standalone", {
      demoUniverseEarthBoot: VERSION,
      generation2StandaloneGlobe: "mounted"
    });

    mount.dataset.renderStatus = "standalone-generation-2-active-globe-mounted";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootStandaloneGlobe, { once: true });
  } else {
    bootStandaloneGlobe();
  }

  window.DGBDemoUniverseEarth = Object.freeze({
    version: VERSION,
    bootStandaloneGlobe
  });
})();
