(function bootDemoUniverseGeneration3PhaseBind(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_STANDALONE_BOOT_GENERATION_3_PHASE_BIND_TNT_v1";
  const GENERATION = "GENERATION_3";
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
    document.documentElement.dataset.phaseBind = detail || "active";
    document.documentElement.dataset.gen4Closeout = "held";
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
    panel.dataset.generation3StandalonePanel = "true";

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
      existing.dataset.phaseBind = "pending";
      existing.dataset.parentIdentityShared = "false";
      existing.dataset.gen4Closeout = "held";
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
    section.dataset.phaseBind = "created-by-gen3-boot";
    section.dataset.parentIdentityShared = "false";
    section.dataset.gen4Closeout = "held";

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

  function writePhaseBindReceipts(app) {
    if (app && app.runtime && typeof app.runtime.writeReceipt === "function") {
      app.runtime.writeReceipt("generation_3_phase_bind_route_confirmed", {
        generation: GENERATION,
        route: ROUTE,
        mode: MODE,
        visibleCodeGlobe: true,
        phaseBind: "active",
        parentIdentityShared: false,
        gen4Closeout: "held",
        bootVersion: VERSION
      });
    }

    if (app && app.runtime && typeof app.runtime.writePhaseReceipt === "function") {
      ["HOME", "BOUNDARY", "MOTION", "REALM", "RECEIPT", "NEXT"].forEach(function writePhase(phase) {
        app.runtime.writePhaseReceipt(phase, {
          generation: GENERATION,
          route: ROUTE,
          mode: MODE,
          gen4Closeout: "held"
        });
      });
    }
  }

  function normalizeLegacyRenderLabels(root) {
    const headings = Array.from(root.querySelectorAll("h2"));
    headings.forEach(function updateHeading(heading) {
      if (heading.textContent.indexOf("Generation 2 code-generated globe") !== -1) {
        heading.textContent = "Generation 3 phase-bound code globe";
      }
    });

    const receipts = Array.from(root.querySelectorAll(".showroom-receipts li, .showroom-globe-receipts li"));
    receipts.forEach(function updateReceipt(item) {
      if (item.textContent.indexOf("RESTORED_GENERATION") !== -1 && item.textContent.indexOf("GENERATION_2") !== -1) {
        item.innerHTML = "<strong>PHASE_BIND_GENERATION</strong><span>GENERATION_3</span>";
      }
      if (item.textContent.indexOf("NEXT_ALLOWED_GENERATION") !== -1 && item.textContent.indexOf("GENERATION_3_PHASE_BIND") !== -1) {
        item.innerHTML = "<strong>NEXT_ALLOWED_GENERATION</strong><span>GENERATION_4_CLOSEOUT_AFTER_CONFIRMATION</span>";
      }
    });
  }

  function boot() {
    setDocumentState("starting", "generation-3-phase-bind-starting");

    const root = ensureRenderRoot();

    waitForRender(
      Date.now(),
      function onReady() {
        try {
          const app = global.ShowroomRender.renderShowroomProofSurface({
            root: root,
            mode: MODE
          });

          normalizeLegacyRenderLabels(root);
          writePhaseBindReceipts(app);

          root.dataset.standaloneBootComplete = "true";
          root.dataset.standaloneBootVersion = VERSION;
          root.dataset.showroomGeneration = GENERATION;
          root.dataset.phaseBind = "active";
          root.dataset.visibleCodeGlobe = "true";
          root.dataset.parentIdentityShared = "false";
          root.dataset.gen4Closeout = "held";

          setDocumentState("complete", "generation-3-phase-bind-active");

          appendPanel(
            "Generation 3 phase bind",
            "The inspection route has moved beyond Generation 2 visible-globe restoration. The visible code globe now carries the HOME / BOUNDARY / MOTION / REALM / RECEIPT / NEXT phase layer. Generation 4 closeout remains held.",
            [
              ["ROUTE", ROUTE],
              ["GENERATION", GENERATION],
              ["VISIBLE_CODE_GLOBE", "true"],
              ["PHASE_BIND", "active"],
              ["PHASE_SEQUENCE", "HOME → BOUNDARY → MOTION → REALM → RECEIPT → NEXT"],
              ["PARENT_IDENTITY_SHARED", "false"],
              ["GEN4_CLOSEOUT", "held"],
              ["BOOT_TNT", VERSION]
            ]
          );

          global.__DEMO_UNIVERSE_GENERATION_3_PHASE_BIND__ = {
            version: VERSION,
            generation: GENERATION,
            route: ROUTE,
            mode: MODE,
            visibleCodeGlobe: true,
            phaseBind: "active",
            gen4Closeout: "held",
            app: app
          };

          global.dispatchEvent(
            new CustomEvent("showroom:generation-3-phase-bind-complete", {
              detail: global.__DEMO_UNIVERSE_GENERATION_3_PHASE_BIND__
            })
          );
        } catch (error) {
          setDocumentState("failed", error.message);
          appendPanel(
            "Generation 3 phase bind error",
            "The inspection route attempted Generation 3, but the phase-bind boot failed.",
            [
              ["BOOT_TNT", VERSION],
              ["ROUTE", ROUTE],
              ["ERROR", error.message],
              ["GEN4_CLOSEOUT", "held"]
            ]
          );
        }
      },
      function onTimeout() {
        setDocumentState("render-missing", "showroom-render-unavailable");
        appendPanel(
          "Generation 3 phase bind waiting",
          "The inspection shell is live, but ShowroomRender.renderShowroomProofSurface is not available.",
          [
            ["BOOT_TNT", VERSION],
            ["ROUTE", ROUTE],
            ["MISSING", "ShowroomRender.renderShowroomProofSurface"],
            ["GEN4_CLOSEOUT", "held"]
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
