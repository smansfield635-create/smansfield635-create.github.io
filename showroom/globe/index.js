(function bootDemoUniverseVisualDashboard(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_STANDALONE_BOOT_VISUAL_DASHBOARD_TNT_v1";
  const GENERATION = "GENERATION_4";
  const ROUTE = "/showroom/globe/";
  const MAX_WAIT_MS = 2400;
  const WAIT_STEP_MS = 80;

  function setState(state) {
    document.documentElement.dataset.showroomBoot = state;
    document.documentElement.dataset.showroomBootVersion = VERSION;
    document.documentElement.dataset.showroomGeneration = GENERATION;
    document.documentElement.dataset.showroomRoute = ROUTE;
    document.documentElement.dataset.demoUniverseScope = "our-universe";
    document.documentElement.dataset.visualExpression = "solar-system-field";
    document.documentElement.dataset.orbitField = "visible";
    document.documentElement.dataset.visibleCodeGlobe = "true";
    document.documentElement.dataset.phaseBind = "complete";
    document.documentElement.dataset.gen4Closeout = "complete";
    document.documentElement.dataset.finalCloseout = "true";
  }

  function ensureRoot() {
    const existing = document.querySelector("[data-showroom-render-root]") || document.getElementById("showroomRenderRoot");
    if (existing) return existing;

    const root = document.createElement("section");
    root.id = "showroomRenderRoot";
    root.dataset.showroomRenderRoot = "true";
    (document.getElementById("globe-main") || document.body).append(root);
    return root;
  }

  function renderReady() {
    return Boolean(global.ShowroomRender && typeof global.ShowroomRender.renderShowroomProofSurface === "function");
  }

  function waitForRender(startedAt, ready, timeout) {
    if (renderReady()) {
      ready();
      return;
    }

    if (Date.now() - startedAt >= MAX_WAIT_MS) {
      timeout();
      return;
    }

    global.setTimeout(function retry() {
      waitForRender(startedAt, ready, timeout);
    }, WAIT_STEP_MS);
  }

  function showHold(root, message) {
    root.innerHTML = "";
    const panel = document.createElement("section");
    panel.className = "showroom-dashboard-hold";
    panel.innerHTML = "<h2>Visual field hold</h2><p>" + message + "</p>";
    root.append(panel);
  }

  function boot() {
    setState("starting");

    const root = ensureRoot();

    waitForRender(
      Date.now(),
      function ready() {
        try {
          const app = global.ShowroomRender.renderShowroomProofSurface({
            root: root,
            mode: "standalone"
          });

          global.__DEMO_UNIVERSE_VISUAL_DASHBOARD__ = {
            version: VERSION,
            generation: GENERATION,
            route: ROUTE,
            app: app,
            demoUniverseScope: "our-universe",
            visualExpression: "solar-system-field",
            orbitField: "visible",
            visibleCodeGlobe: true,
            phaseBind: "complete",
            gen4Closeout: "complete",
            finalCloseout: true
          };

          setState("complete");
        } catch (error) {
          setState("failed");
          showHold(root, error.message);
        }
      },
      function timeout() {
        setState("render-missing");
        showHold(root, "Render layer unavailable.");
      }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})(window, document);
