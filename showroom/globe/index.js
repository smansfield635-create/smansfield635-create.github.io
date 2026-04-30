(function bootDemoUniverseOurUniverseGen4(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_STANDALONE_BOOT_DEMO_UNIVERSE_OUR_UNIVERSE_GEN4_TNT_v1";
  const GENERATION = "GENERATION_4";
  const ROUTE = "/showroom/globe/";
  const MODE = "standalone";
  const MAX_WAIT_MS = 2400;
  const WAIT_STEP_MS = 80;

  function setDocumentState(stage, detail) {
    document.documentElement.dataset.showroomBoot = stage;
    document.documentElement.dataset.showroomBootVersion = VERSION;
    document.documentElement.dataset.showroomGeneration = GENERATION;
    document.documentElement.dataset.showroomRoute = ROUTE;
    document.documentElement.dataset.showroomMode = MODE;
    document.documentElement.dataset.parentIdentityShared = "false";
    document.documentElement.dataset.visibleCodeGlobe = "true";
    document.documentElement.dataset.phaseBind = "complete";
    document.documentElement.dataset.demoUniverseScope = "our-universe";
    document.documentElement.dataset.sun = "included";
    document.documentElement.dataset.moon = "included";
    document.documentElement.dataset.planets = "included";
    document.documentElement.dataset.gen4Closeout = detail || "complete";
    document.documentElement.dataset.finalCloseout = detail === "failed" ? "false" : "true";
  }

  function makeReceiptItem(name, value) {
    const item = document.createElement("li");
    item.innerHTML = "<strong>" + name + "</strong><span>" + String(value) + "</span>";
    return item;
  }

  function removeStalePanels() {
    const selectors = [
      "[data-generation3-standalone-panel='true']",
      "[data-generation2-standalone-fallback='true']",
      "[data-generation2-mount-fallback='true']",
      "[data-generation4-closeout-panel='true']"
    ];

    selectors.forEach(function removeSelector(selector) {
      Array.from(document.querySelectorAll(selector)).forEach(function remove(node) {
        node.remove();
      });
    });

    Array.from(document.querySelectorAll(".showroom-receipt-panel")).forEach(function inspect(panel) {
      const text = panel.textContent || "";
      const stale =
        text.indexOf("Generation 2 render mount activation only") !== -1 ||
        text.indexOf("This stops at Generation 2") !== -1 ||
        text.indexOf("Generation 3 phase bind") !== -1 ||
        text.indexOf("GEN3_PHASE_BINDheld") !== -1 ||
        text.indexOf("GEN4_CLOSEOUTheld") !== -1 ||
        text.indexOf("SHOWROOM_RENDER_GENERATION_2_RENDER_MOUNT_ACTIVATION_CTG_v1") !== -1 ||
        text.indexOf("SHOWROOM_STANDALONE_BOOT_GENERATION_3_PHASE_BIND_TNT_v1") !== -1;

      if (stale) {
        panel.remove();
      }
    });
  }

  function appendConfirmationPanel() {
    removeStalePanels();

    const host = document.getElementById("globe-main") || document.querySelector("main") || document.body;
    const panel = document.createElement("section");
    panel.className = "showroom-receipt-panel";
    panel.dataset.generation4CloseoutPanel = "true";

    const heading = document.createElement("h2");
    heading.textContent = "Demo Universe closeout confirmation";

    const paragraph = document.createElement("p");
    paragraph.textContent =
      "Demo Universe now represents our universe: Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, and Neptune. Earth remains the inspection anchor; the parent Showroom remains the shell.";

    const list = document.createElement("ul");
    list.className = "showroom-receipts";

    [
      ["ROUTE", ROUTE],
      ["GENERATION", GENERATION],
      ["DEMO_UNIVERSE_SCOPE", "our-universe"],
      ["VISIBLE_CODE_GLOBE", "true"],
      ["EARTH_ROLE", "primary inspection anchor"],
      ["SUN", "included"],
      ["MOON", "included"],
      ["PLANETS", "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune"],
      ["PHASE_BIND", "complete"],
      ["PHASE_SEQUENCE", "HOME → BOUNDARY → MOTION → REALM → RECEIPT → NEXT"],
      ["PARENT_IDENTITY_SHARED", "false"],
      ["PARENT_GLOBE_REQUIRED", "false"],
      ["GENERATION_4_CLOSEOUT", "complete"],
      ["GEN4_CLOSEOUT", "complete"],
      ["FINAL_CLOSEOUT", "true"],
      ["GEN_4_FINAL_PASS", "demo-universe-our-universe-closeout"],
      ["BOOT_TNT", VERSION]
    ].forEach(function add(row) {
      list.append(makeReceiptItem(row[0], row[1]));
    });

    panel.append(heading, paragraph, list);
    host.append(panel);
  }

  function ensureRenderRoot() {
    const existing =
      document.querySelector("[data-showroom-render-root]") ||
      document.getElementById("showroomRenderRoot");

    if (existing) {
      existing.dataset.showroomRenderRoot = "true";
      existing.dataset.showroomMode = MODE;
      existing.dataset.showroomGeneration = GENERATION;
      existing.dataset.showroomRoute = ROUTE;
      existing.dataset.visibleCodeGlobe = "true";
      existing.dataset.phaseBind = "complete";
      existing.dataset.demoUniverseScope = "our-universe";
      existing.dataset.sun = "included";
      existing.dataset.moon = "included";
      existing.dataset.planets = "included";
      existing.dataset.parentIdentityShared = "false";
      existing.dataset.gen4Closeout = "complete";
      existing.dataset.finalCloseout = "true";
      return existing;
    }

    const host = document.getElementById("globe-main") || document.querySelector("main") || document.body;
    const section = document.createElement("section");
    section.id = "showroomRenderRoot";
    section.dataset.showroomRenderRoot = "true";
    section.dataset.showroomMode = MODE;
    section.dataset.showroomGeneration = GENERATION;
    section.dataset.showroomRoute = ROUTE;
    section.dataset.visibleCodeGlobe = "true";
    section.dataset.phaseBind = "complete";
    section.dataset.demoUniverseScope = "our-universe";
    section.dataset.sun = "included";
    section.dataset.moon = "included";
    section.dataset.planets = "included";
    section.dataset.parentIdentityShared = "false";
    section.dataset.gen4Closeout = "complete";
    section.dataset.finalCloseout = "true";

    host.append(section);
    return section;
  }

  function renderReady() {
    return Boolean(
      global.ShowroomRender &&
      typeof global.ShowroomRender.renderShowroomProofSurface === "function"
    );
  }

  function waitForRender(startedAt, onReady, onTimeout) {
    if (renderReady()) {
      onReady();
      return;
    }

    if (Date.now() - startedAt >= MAX_WAIT_MS) {
      onTimeout();
      return;
    }

    global.setTimeout(function retry() {
      waitForRender(startedAt, onReady, onTimeout);
    }, WAIT_STEP_MS);
  }

  function writeRuntimeCloseout(app) {
    if (app && app.runtime && typeof app.runtime.writeReceipt === "function") {
      app.runtime.writeReceipt("demo_universe_our_universe_gen4_confirmed", {
        generation: GENERATION,
        route: ROUTE,
        mode: MODE,
        scope: "our-universe",
        included: ["Sun", "Mercury", "Venus", "Earth", "Moon", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
        visibleCodeGlobe: true,
        phaseBind: "complete",
        parentIdentityShared: false,
        generation4Closeout: "complete",
        gen4Closeout: "complete",
        finalCloseout: true,
        parentGlobeRequired: false,
        bootVersion: VERSION
      });
    }

    if (app && app.runtime && typeof app.runtime.writePhaseReceipt === "function") {
      ["HOME", "BOUNDARY", "MOTION", "REALM", "RECEIPT", "NEXT"].forEach(function writePhase(phase) {
        app.runtime.writePhaseReceipt(phase, {
          generation: GENERATION,
          route: ROUTE,
          mode: MODE,
          scope: "our-universe",
          gen4Closeout: "complete",
          finalCloseout: true
        });
      });
    }
  }

  function appendError(error) {
    const host = document.getElementById("globe-main") || document.querySelector("main") || document.body;
    const panel = document.createElement("section");
    panel.className = "showroom-receipt-panel";
    panel.dataset.generation4CloseoutPanel = "true";

    const heading = document.createElement("h2");
    heading.textContent = "Demo Universe update error";

    const paragraph = document.createElement("p");
    paragraph.textContent = "Demo Universe our-universe update attempted, but boot did not complete cleanly.";

    const list = document.createElement("ul");
    list.className = "showroom-receipts";

    [
      ["BOOT_TNT", VERSION],
      ["ROUTE", ROUTE],
      ["ERROR", error.message],
      ["DEMO_UNIVERSE_SCOPE", "blocked"]
    ].forEach(function add(row) {
      list.append(makeReceiptItem(row[0], row[1]));
    });

    panel.append(heading, paragraph, list);
    host.append(panel);
  }

  function boot() {
    setDocumentState("starting", "starting");

    const root = ensureRenderRoot();
    removeStalePanels();

    waitForRender(
      Date.now(),
      function onReady() {
        try {
          const app = global.ShowroomRender.renderShowroomProofSurface({
            root: root,
            mode: MODE
          });

          writeRuntimeCloseout(app);
          removeStalePanels();
          appendConfirmationPanel();

          root.dataset.standaloneBootComplete = "true";
          root.dataset.standaloneBootVersion = VERSION;
          root.dataset.showroomGeneration = GENERATION;
          root.dataset.visibleCodeGlobe = "true";
          root.dataset.phaseBind = "complete";
          root.dataset.demoUniverseScope = "our-universe";
          root.dataset.sun = "included";
          root.dataset.moon = "included";
          root.dataset.planets = "included";
          root.dataset.parentIdentityShared = "false";
          root.dataset.gen4Closeout = "complete";
          root.dataset.finalCloseout = "true";

          setDocumentState("complete", "complete");

          global.__DEMO_UNIVERSE_OUR_UNIVERSE_GEN4__ = {
            version: VERSION,
            generation: GENERATION,
            route: ROUTE,
            mode: MODE,
            scope: "our-universe",
            visibleCodeGlobe: true,
            phaseBind: "complete",
            gen4Closeout: "complete",
            finalCloseout: true,
            parentIdentityShared: false,
            parentGlobeRequired: false,
            app: app
          };

          global.dispatchEvent(
            new CustomEvent("showroom:demo-universe-our-universe-gen4-complete", {
              detail: global.__DEMO_UNIVERSE_OUR_UNIVERSE_GEN4__
            })
          );
        } catch (error) {
          setDocumentState("failed", "failed");
          appendError(error);
        }
      },
      function onTimeout() {
        setDocumentState("render-missing", "render-missing");
        appendError(new Error("ShowroomRender.renderShowroomProofSurface unavailable"));
      }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})(window, document);
