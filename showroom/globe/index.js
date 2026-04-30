(function bootDemoUniverseEarth(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_STANDALONE_GLOBE_BOOT_GEN4_CONSUMER_TNT_v1";

  function boot() {
    const root = document.querySelector("[data-showroom-render-root]");

    if (!root) {
      throw new Error("Demo Universe Earth boot failed: render root not found.");
    }

    const app = global.ShowroomRender.renderShowroomProofSurface({
      root,
      mode: "standalone"
    });

    document.documentElement.dataset.showroomBoot = "complete";
    document.documentElement.dataset.showroomBootVersion = VERSION;
    document.documentElement.dataset.showroomGeneration = "GENERATION_4";

    global.__DEMO_UNIVERSE_EARTH_APP__ = app;

    global.dispatchEvent(
      new CustomEvent("showroom:standalone-boot-complete", {
        detail: {
          version: VERSION,
          generation: "GENERATION_4",
          route: "/showroom/globe/",
          realm: app.contract.realm
        }
      })
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})(window, document);
