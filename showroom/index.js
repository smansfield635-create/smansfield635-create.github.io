(function bootShowroomParentGeneration2Mount(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_PARENT_BOOT_GENERATION_2_RENDER_MOUNT_ACTIVATION_CTG_v1";
  const GENERATION = "GENERATION_2";
  const ROUTE = "/showroom/";
  const MODE = "parent";

  function mark(stage, detail) {
    document.documentElement.dataset.showroomBoot = stage;
    document.documentElement.dataset.showroomBootVersion = VERSION;
    document.documentElement.dataset.showroomGeneration = GENERATION;
    document.documentElement.dataset.showroomRoute = ROUTE;
    document.documentElement.dataset.generation2MountActivation = detail || "active";
  }

  function findRoot() {
    return (
      document.querySelector("[data-showroom-render-root]") ||
      document.getElementById("showroomRenderRoot") ||
      document.getElementById("showroom-main")
    );
  }

  function ensureRenderRoot(candidate) {
    if (!candidate) {
      throw new Error("Parent Showroom boot failed: no render root or showroom main found.");
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
    section.dataset.generation2MountActivation = "created-by-parent-boot";

    candidate.append(section);
    return section;
  }

  function requireRender() {
    if (!global.ShowroomRender || typeof global.ShowroomRender.renderShowroomProofSurface !== "function") {
      throw new Error("Parent Showroom boot failed: ShowroomRender.renderShowroomProofSurface is unavailable.");
    }
  }

  function boot() {
    mark("starting", "render-required");
    requireRender();

    const root = ensureRenderRoot(findRoot());

    root.dataset.parentBoot = "true";
    root.dataset.showroomMode = MODE;
    root.dataset.showroomRoute = ROUTE;
    root.dataset.showroomGeneration = GENERATION;
    root.dataset.generation2MountActivation = "starting";

    const app = global.ShowroomRender.renderShowroomProofSurface({
      root,
      mode: MODE
    });

    root.dataset.parentBootComplete = "true";
    root.dataset.parentBootVersion = VERSION;
    root.dataset.generation2MountActivation = "complete";

    mark("complete", "generation-2-render-mounted");

    global.__SHOWROOM_PARENT_APP__ = app;
    global.__SHOWROOM_PARENT_GENERATION_2_MOUNT__ = {
      version: VERSION,
      generation: GENERATION,
      route: ROUTE,
      complete: true,
      app
    };

    global.dispatchEvent(
      new CustomEvent("showroom:generation-2-parent-mount-complete", {
        detail: {
          version: VERSION,
          generation: GENERATION,
          route: ROUTE,
          mode: MODE,
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
      global.__SHOWROOM_PARENT_BOOT_ERROR__ = error;

      global.dispatchEvent(
        new CustomEvent("showroom:generation-2-parent-mount-failed", {
          detail: {
            version: VERSION,
            generation: GENERATION,
            route: ROUTE,
            error: error.message
          }
        })
      );

      const main = document.getElementById("showroom-main") || document.body;
      const fallback = document.createElement("section");
      fallback.className = "showroom-receipt-panel";
      fallback.innerHTML =
        "<h2>Generation 2 mount error</h2>" +
        "<p>The accepted shell is live, but the lower render boot failed.</p>" +
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
