(function bootShowroomParentGeneration2ForceMount(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_PARENT_BOOT_GENERATION_2_FORCE_MOUNT_CTG_v1";
  const GENERATION = "GENERATION_2";
  const ROUTE = "/showroom/";
  const MODE = "parent";
  const MAX_WAIT_MS = 2400;
  const WAIT_STEP_MS = 80;

  function setDocumentState(stage, detail) {
    document.documentElement.dataset.showroomBoot = stage;
    document.documentElement.dataset.showroomBootVersion = VERSION;
    document.documentElement.dataset.showroomGeneration = GENERATION;
    document.documentElement.dataset.showroomRoute = ROUTE;
    document.documentElement.dataset.showroomMode = MODE;
    document.documentElement.dataset.generation2ParentMount = detail || "active";
  }

  function makeReceiptItem(name, value) {
    const item = document.createElement("li");
    item.innerHTML = "<strong>" + name + "</strong><span>" + String(value) + "</span>";
    return item;
  }

  function makePanel(className, title, body, rows) {
    const panel = document.createElement("section");
    panel.className = className || "showroom-receipt-panel";
    panel.dataset.parentGeneration2Panel = "true";

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
    return panel;
  }

  function getMain() {
    return (
      document.getElementById("showroom-main") ||
      document.querySelector("main.showroom-page") ||
      document.querySelector("main") ||
      document.body
    );
  }

  function getHero() {
    return (
      document.querySelector(".showroom-hero") ||
      document.querySelector("[data-showroom-contract] .showroom-hero") ||
      null
    );
  }

  function ensureRenderRoot() {
    const main = getMain();

    let root =
      document.querySelector("[data-showroom-render-root]") ||
      document.getElementById("showroomRenderRoot");

    if (!root) {
      root = document.createElement("section");
      root.id = "showroomRenderRoot";
      root.dataset.showroomRenderRoot = "true";
      root.dataset.showroomMode = MODE;
      root.dataset.showroomGeneration = GENERATION;
      root.dataset.showroomRoute = ROUTE;
      root.dataset.visibleCodeGlobe = "pending";
      root.dataset.generation2ParentMount = "created-by-parent-force-mount";

      const hero = getHero();

      if (hero && hero.parentNode === main) {
        hero.insertAdjacentElement("afterend", root);
      } else {
        main.append(root);
      }
    } else {
      root.id = root.id || "showroomRenderRoot";
      root.dataset.showroomRenderRoot = "true";
      root.dataset.showroomMode = MODE;
      root.dataset.showroomGeneration = GENERATION;
      root.dataset.showroomRoute = ROUTE;
      root.dataset.visibleCodeGlobe = root.dataset.visibleCodeGlobe || "pending";
      root.dataset.generation2ParentMount = "existing-root";

      const hero = getHero();

      if (hero && root.previousElementSibling !== hero && root.parentNode === main) {
        hero.insertAdjacentElement("afterend", root);
      }
    }

    return root;
  }

  function dependenciesReady() {
    return Boolean(
      global.ShowroomRender &&
      typeof global.ShowroomRender.renderShowroomProofSurface === "function"
    );
  }

  function instrumentAvailable() {
    return Boolean(
      global.ShowroomGlobeInstrument &&
      typeof global.ShowroomGlobeInstrument.createGlobe === "function"
    );
  }

  function waitForDependencies(startedAt, onReady, onTimeout) {
    if (dependenciesReady()) {
      onReady();
      return;
    }

    if (Date.now() - startedAt >= MAX_WAIT_MS) {
      onTimeout();
      return;
    }

    global.setTimeout(function retry() {
      waitForDependencies(startedAt, onReady, onTimeout);
    }, WAIT_STEP_MS);
  }

  function appendWaitingPanel(root) {
    const existing = root.querySelector("[data-parent-generation2-waiting='true']");
    if (existing) existing.remove();

    const panel = makePanel(
      "showroom-receipt-panel",
      "Generation 2 parent mount waiting",
      "The accepted Showroom shell is live, but the parent boot has not found ShowroomRender.renderShowroomProofSurface yet.",
      [
        ["BOOT_VERSION", VERSION],
        ["ROUTE", ROUTE],
        ["MOUNT_ROOT", "present"],
        ["MISSING", "ShowroomRender.renderShowroomProofSurface"],
        ["INSTRUMENT_AVAILABLE", instrumentAvailable()],
        ["GEN3_PHASE_BIND", "held"],
        ["GEN4_CLOSEOUT", "held"],
        ["NEXT_ACTION", "verify /showroom/showroom.render.js served source and script order"]
      ]
    );

    panel.dataset.parentGeneration2Waiting = "true";
    root.append(panel);
  }

  function appendErrorPanel(root, error) {
    const panel = makePanel(
      "showroom-receipt-panel",
      "Generation 2 parent mount error",
      "The accepted Showroom shell is live, but the lower Generation 2 render mount failed.",
      [
        ["BOOT_VERSION", VERSION],
        ["ROUTE", ROUTE],
        ["ERROR", error.message],
        ["RENDER_AVAILABLE", dependenciesReady()],
        ["INSTRUMENT_AVAILABLE", instrumentAvailable()],
        ["GEN3_PHASE_BIND", "held"],
        ["GEN4_CLOSEOUT", "held"]
      ]
    );

    panel.dataset.parentGeneration2Error = "true";
    root.append(panel);
  }

  function renderParent(root) {
    root.dataset.parentBoot = "true";
    root.dataset.parentBootVersion = VERSION;
    root.dataset.showroomMode = MODE;
    root.dataset.showroomRoute = ROUTE;
    root.dataset.showroomGeneration = GENERATION;
    root.dataset.generation2ParentMount = "rendering";
    root.dataset.visibleCodeGlobe = "pending";

    const app = global.ShowroomRender.renderShowroomProofSurface({
      root: root,
      mode: MODE
    });

    root.dataset.parentBootComplete = "true";
    root.dataset.generation2ParentMount = "complete";
    root.dataset.visibleCodeGlobe = app && app.instrument ? "true" : root.dataset.visibleCodeGlobe || "unknown";

    setDocumentState("complete", "generation-2-parent-render-mounted");

    global.__SHOWROOM_PARENT_APP__ = app;
    global.__SHOWROOM_PARENT_GENERATION_2_FORCE_MOUNT__ = {
      version: VERSION,
      generation: GENERATION,
      route: ROUTE,
      mode: MODE,
      complete: true,
      visibleCodeGlobe: Boolean(app && app.instrument),
      renderVersion: app && app.version ? app.version : "unknown",
      instrumentVersion: app && app.instrument && app.instrument.version ? app.instrument.version : "unknown"
    };

    global.dispatchEvent(
      new CustomEvent("showroom:generation-2-parent-force-mount-complete", {
        detail: global.__SHOWROOM_PARENT_GENERATION_2_FORCE_MOUNT__
      })
    );
  }

  function boot() {
    setDocumentState("starting", "generation-2-parent-force-mount-starting");

    const root = ensureRenderRoot();

    root.dataset.generation2ParentMount = "waiting-for-render";
    root.dataset.visibleCodeGlobe = "pending";

    waitForDependencies(
      Date.now(),
      function onReady() {
        try {
          renderParent(root);
        } catch (error) {
          setDocumentState("failed", error.message);
          root.dataset.generation2ParentMount = "failed";
          root.dataset.visibleCodeGlobe = "false";
          global.__SHOWROOM_PARENT_BOOT_ERROR__ = error;
          appendErrorPanel(root, error);

          global.dispatchEvent(
            new CustomEvent("showroom:generation-2-parent-force-mount-failed", {
              detail: {
                version: VERSION,
                generation: GENERATION,
                route: ROUTE,
                error: error.message
              }
            })
          );
        }
      },
      function onTimeout() {
        setDocumentState("render-missing", "showroom-render-unavailable");
        root.dataset.generation2ParentMount = "render-missing";
        root.dataset.visibleCodeGlobe = "false";
        appendWaitingPanel(root);

        global.dispatchEvent(
          new CustomEvent("showroom:generation-2-parent-force-mount-waiting", {
            detail: {
              version: VERSION,
              generation: GENERATION,
              route: ROUTE,
              missing: "ShowroomRender.renderShowroomProofSurface",
              instrumentAvailable: instrumentAvailable()
            }
          })
        );
      }
    );
  }

  function bootSafely() {
    try {
      boot();
    } catch (error) {
      setDocumentState("failed", error.message);
      global.__SHOWROOM_PARENT_BOOT_ERROR__ = error;

      const root = ensureRenderRoot();
      root.dataset.generation2ParentMount = "failed";
      root.dataset.visibleCodeGlobe = "false";
      appendErrorPanel(root, error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootSafely, { once: true });
  } else {
    bootSafely();
  }
})(window, document);
