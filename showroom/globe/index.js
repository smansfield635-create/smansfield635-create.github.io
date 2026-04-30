(function bootDemoUniverseGeneration2Mount(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_STANDALONE_BOOT_GENERATION_2_RENDER_MOUNT_ACTIVATION_CTG_v1";
  const GENERATION = "GENERATION_2";
  const ROUTE = "/showroom/globe/";
  const MODE = "standalone";

  function mark(stage, detail) {
    document.documentElement.dataset.showroomBoot = stage;
    document.documentElement.dataset.showroomBootVersion = VERSION;
    document.documentElement.dataset.showroomGeneration = GENERATION;
    document.documentElement.dataset.showroomRoute = ROUTE;
    document.documentElement.dataset.showroomMode = MODE;
    document.documentElement.dataset.parentIdentityShared = "false";
    document.documentElement.dataset.generation2MountActivation = detail || "active";
  }

  function findRoot() {
    return (
      document.querySelector("[data-showroom-render-root]") ||
      document.getElementById("showroomRenderRoot") ||
      document.querySelector("main") ||
      document.body
    );
  }

  function ensureRenderRoot(candidate) {
    if (!candidate) {
      throw new Error("Demo Universe boot failed: no render root or main container found.");
    }

    if (candidate.matches && candidate.matches("[data-showroom-render-root]")) {
      return candidate;
    }

    const existing = document.querySelector("[data-showroom-render-root]");
    if (existing) return existing;

    const section = document.createElement("section");
    section.id = "showroomRenderRoot";
    section.dataset.showroomRenderRoot = "true";
    section.dataset.showroomMode = MODE;
    section.dataset.showroomGeneration = GENERATION;
    section.dataset.parentIdentityShared = "false";
    section.dataset.generation2MountActivation = "created-by-standalone-boot";

    candidate.append(section);
    return section;
  }

  function requireRender() {
    if (!global.ShowroomRender || typeof global.ShowroomRender.renderShowroomProofSurface !== "function") {
      throw new Error("Demo Universe boot failed: ShowroomRender.renderShowroomProofSurface is unavailable.");
    }
  }

  function boot() {
    mark("starting", "render-required");
    requireRender();

    const root = ensureRenderRoot(findRoot());

    root.dataset.standaloneBoot = "true";
    root.dataset.showroomMode = MODE;
    root.dataset.showroomRoute = ROUTE;
    root.dataset.showroomGeneration = GENERATION;
    root.dataset.parentIdentityShared = "false";
    root.dataset.generation2MountActivation = "starting";

    const app = global.ShowroomRender.renderShowroomProofSurface({
      root,
      mode: MODE
    });

    root.dataset.standaloneBootComplete = "true";
    root.dataset.standaloneBootVersion = VERSION;
    root.dataset.generation2MountActivation = "complete";
    root.dataset.parentIdentityShared = "false";

    mark("complete", "generation-2-render-mounted");

    global.__DEMO_UNIVERSE_EARTH_APP__ = app;
    global.__DEMO_UNIVERSE_GENERATION_2_MOUNT__ = {
      version: VERSION,
      generation: GENERATION,
      route: ROUTE,
      mode: MODE,
      parentIdentityShared: false,
      complete: true,
      app
    };

    global.dispatchEvent(
      new CustomEvent("showroom:generation-2-standalone-mount-complete", {
        detail: {
          version: VERSION,
          generation: GENERATION,
          route: ROUTE,
          mode: MODE,
          parentIdentityShared: false,
          visibleCodeGlobe: Boolean(app && app.instrument)
        }
      })
    );
  }

  function bootSafely() {
    try {
      boot();
    } catch (error) {
      mark("failed", error.message);
      global.__DEMO_UNIVERSE_BOOT_ERROR__ = error;

      global.dispatchEvent(
        new CustomEvent("showroom:generation-2-standalone-mount-failed", {
          detail: {
            version: VERSION,
            generation: GENERATION,
            route: ROUTE,
            error: error.message
          }
        })
      );

      const main = document.querySelector("main") || document.body;
      const fallback = document.createElement("section");
      fallback.className = "showroom-receipt-panel";
      fallback.innerHTML =
        "<h2>Generation 2 standalone mount error</h2>" +
        "<p>The standalone route is live, but the lower render boot failed.</p>" +
        "<ul class='showroom-receipts'>" +
        "<li><strong>BOOT_VERSION</strong><span>" + VERSION + "</span></li>" +
        "<li><strong>ERROR</strong><span>" + error.message + "</span></li>" +
        "</ul>";
      main.append(fallback);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootSafely, { once: true });
  } else {
    bootSafely();
  }
})(window, document);
