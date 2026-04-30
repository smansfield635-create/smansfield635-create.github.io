(function bootDemoUniverseEarth(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_STANDALONE_BOOT_TRUE_GEN4_PHASE_ROTATION_CLOSEOUT_TNT_v1";
  const GENERATION = "GENERATION_4";
  const GEN4_TYPE = "narrative-code";
  const ROUTE = "/showroom/globe/";
  const MODE = "standalone";

  function markDocument(stage, value) {
    document.documentElement.dataset.showroomBoot = stage;
    document.documentElement.dataset.showroomBootVersion = VERSION;
    document.documentElement.dataset.showroomGeneration = GENERATION;
    document.documentElement.dataset.showroomGen4Type = GEN4_TYPE;
    document.documentElement.dataset.showroomRoute = ROUTE;
    document.documentElement.dataset.phaseRotationCloseout = String(value);
    document.documentElement.dataset.parentIdentityShared = "false";
  }

  function requireRender() {
    if (!global.ShowroomRender || typeof global.ShowroomRender.renderShowroomProofSurface !== "function") {
      throw new Error("Demo Universe Earth boot failed: ShowroomRender is not available.");
    }
  }

  function findRoot() {
    return document.querySelector("[data-showroom-render-root]");
  }

  function writeBootDataset(root) {
    root.dataset.standaloneBoot = "true";
    root.dataset.showroomGeneration = GENERATION;
    root.dataset.showroomGen4Type = GEN4_TYPE;
    root.dataset.showroomMode = MODE;
    root.dataset.showroomRoute = ROUTE;
    root.dataset.phaseRotationCloseout = "pending";
    root.dataset.parentIdentityShared = "false";
  }

  function closeoutRuntime(app) {
    if (!app || !app.runtime) return null;

    if (typeof app.runtime.writeReceipt === "function") {
      app.runtime.writeReceipt("standalone_boot_consumed_true_gen4_render", {
        generation: GENERATION,
        gen4Type: GEN4_TYPE,
        route: ROUTE,
        mode: MODE,
        bootVersion: VERSION,
        parentIdentityShared: false,
        meaning:
          "Standalone Demo Universe route consumed the same True Gen 4 phase engine without taking parent identity."
      });
    }

    if (typeof app.runtime.writePhaseReceipt === "function") {
      app.runtime.writePhaseReceipt("HOME", {
        route: ROUTE,
        meaning: "Standalone route starts from its own inspection context."
      });

      app.runtime.writePhaseReceipt("BOUNDARY", {
        route: ROUTE,
        meaning: "Standalone route accepts state-defined boundary authority."
      });

      app.runtime.writePhaseReceipt("MOTION", {
        route: ROUTE,
        meaning: "Standalone route treats motion as proof-cycle, not parent speed ownership."
      });

      app.runtime.writePhaseReceipt("REALM", {
        route: ROUTE,
        meaning:
          "Standalone route remains separate from the parent Showroom proof realm."
      });

      app.runtime.writePhaseReceipt("RECEIPT", {
        route: ROUTE,
        meaning: "Standalone route has written readable inspection receipts."
      });

      app.runtime.writePhaseReceipt("NEXT", {
        route: ROUTE,
        meaning: "Standalone route is ready to return or advance without identity collapse."
      });
    }

    if (typeof app.runtime.closeoutRoute === "function") {
      return app.runtime.closeoutRoute({
        route: ROUTE,
        mode: MODE,
        bootVersion: VERSION,
        closeoutType: "standalone-route-phase-rotation",
        parentIdentityShared: false
      });
    }

    return null;
  }

  function boot() {
    requireRender();

    const root = findRoot();

    if (!root) {
      throw new Error("Demo Universe Earth boot failed: render root not found.");
    }

    markDocument("starting", false);
    writeBootDataset(root);

    const app = global.ShowroomRender.renderShowroomProofSurface({
      root: root,
      mode: MODE
    });

    const closeoutReceipt = closeoutRuntime(app);

    root.dataset.phaseRotationCloseout = "complete";
    root.dataset.standaloneBootVersion = VERSION;
    root.dataset.standaloneBootComplete = "true";
    root.dataset.parentIdentityShared = "false";

    markDocument("complete", true);

    global.__DEMO_UNIVERSE_EARTH_APP__ = app;
    global.__DEMO_UNIVERSE_PHASE_CLOSEOUT__ = closeoutReceipt;

    global.dispatchEvent(
      new CustomEvent("showroom:standalone-phase-rotation-closeout", {
        detail: {
          version: VERSION,
          generation: GENERATION,
          gen4Type: GEN4_TYPE,
          route: ROUTE,
          mode: MODE,
          parentIdentityShared: false,
          closeout: true,
          receipt: closeoutReceipt
        }
      })
    );
  }

  function bootSafely() {
    try {
      boot();
    } catch (error) {
      markDocument("failed", false);
      global.__DEMO_UNIVERSE_BOOT_ERROR__ = error;

      global.dispatchEvent(
        new CustomEvent("showroom:standalone-boot-failed", {
          detail: {
            version: VERSION,
            route: ROUTE,
            error: error.message
          }
        })
      );

      throw error;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootSafely, { once: true });
  } else {
    bootSafely();
  }
})(window, document);
