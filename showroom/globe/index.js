(function bootDemoUniverseGeneration4Closeout(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_STANDALONE_BOOT_GENERATION_4_CLOSEOUT_TNT_v1";
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
    document.documentElement.dataset.gen4Closeout = detail || "complete";
    document.documentElement.dataset.finalCloseout = detail === "failed" ? "false" : "true";
  }

  function makeReceiptItem(name, value) {
    const item = document.createElement("li");
    item.innerHTML = "<strong>" + name + "</strong><span>" + String(value) + "</span>";
    return item;
  }

  function appendPanel(title, body, rows) {
    const host = document.getElementById("globe-main") || document.querySelector("main") || document.body;
    const panel = document.createElement("section");
    panel.className = "showroom-receipt-panel";
    panel.dataset.generation4CloseoutPanel = "true";

    const heading = document.createElement("h2");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = body;

    const list = document.createElement("ul");
    list.className = "showroom-receipts";

    rows.forEach(function add(row) {
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

  function writeCloseoutRuntimeReceipts(app) {
    if (app && app.runtime && typeof app.runtime.writeReceipt === "function") {
      app.runtime.writeReceipt("generation_4_route_closeout_confirmed", {
        generation: GENERATION,
        route: ROUTE,
        mode: MODE,
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
          gen4Closeout: "complete",
          finalCloseout: true
        });
      });
    }
  }

  function boot() {
    setDocumentState("starting", "starting");

    const root = ensureRenderRoot();

    waitForRender(
      Date.now(),
      function onReady() {
        try {
          const app = global.ShowroomRender.renderShowroomProofSurface({
            root: root,
            mode: MODE
          });

          writeCloseoutRuntimeReceipts(app);

          root.dataset.standaloneBootComplete = "true";
          root.dataset.standaloneBootVersion = VERSION;
          root.dataset.showroomGeneration = GENERATION;
          root.dataset.visibleCodeGlobe = "true";
          root.dataset.phaseBind = "complete";
          root.dataset.parentIdentityShared = "false";
          root.dataset.gen4Closeout = "complete";
          root.dataset.finalCloseout = "true";

          setDocumentState("complete", "complete");

          appendPanel(
            "Generation 4 closeout confirmation",
            "The inspection route now closes Generation 4. The visible code globe remains inspection-only; the parent Showroom remains the proof-realm shell.",
            [
              ["ROUTE", ROUTE],
              ["GENERATION", GENERATION],
              ["VISIBLE_CODE_GLOBE", "true"],
              ["PHASE_BIND", "complete"],
              ["PHASE_SEQUENCE", "HOME → BOUNDARY → MOTION → REALM → RECEIPT → NEXT"],
              ["PARENT_IDENTITY_SHARED", "false"],
              ["PARENT_GLOBE_REQUIRED", "false"],
              ["GENERATION_4_CLOSEOUT", "complete"],
              ["GEN4_CLOSEOUT", "complete"],
              ["FINAL_CLOSEOUT", "true"],
              ["GEN_4_FINAL_PASS", "inspection-route-closeout"],
              ["BOOT_TNT", VERSION]
            ]
          );

          global.__DEMO_UNIVERSE_GENERATION_4_CLOSEOUT__ = {
            version: VERSION,
            generation: GENERATION,
            route: ROUTE,
            mode: MODE,
            visibleCodeGlobe: true,
            phaseBind: "complete",
            gen4Closeout: "complete",
            finalCloseout: true,
            parentIdentityShared: false,
            parentGlobeRequired: false,
            app: app
          };

          global.dispatchEvent(
            new CustomEvent("showroom:generation-4-closeout-complete", {
              detail: global.__DEMO_UNIVERSE_GENERATION_4_CLOSEOUT__
            })
          );
        } catch (error) {
          setDocumentState("failed", "failed");
          appendPanel(
            "Generation 4 closeout error",
            "The inspection route attempted Generation 4 closeout, but the closeout boot failed.",
            [
              ["BOOT_TNT", VERSION],
              ["ROUTE", ROUTE],
              ["ERROR", error.message],
              ["GENERATION_4_CLOSEOUT", "failed"]
            ]
          );
        }
      },
      function onTimeout() {
        setDocumentState("render-missing", "render-missing");
        appendPanel(
          "Generation 4 closeout waiting",
          "The inspection shell is live, but ShowroomRender.renderShowroomProofSurface is not available.",
          [
            ["BOOT_TNT", VERSION],
            ["ROUTE", ROUTE],
            ["MISSING", "ShowroomRender.renderShowroomProofSurface"],
            ["GENERATION_4_CLOSEOUT", "blocked"]
          ]
        );
      }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})(window, document);
