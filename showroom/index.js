(function bootShowroomParentGeneration2Mount(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_PARENT_BOOT_GENERATION_2_SHELL_AND_MOUNT_PARITY_CLOSE_CTG_v1";
  const GENERATION = "GENERATION_2";
  const ROUTE = "/showroom/";
  const MODE = "parent";

  function setDocumentState(stage, detail) {
    document.documentElement.dataset.showroomBoot = stage;
    document.documentElement.dataset.showroomBootVersion = VERSION;
    document.documentElement.dataset.showroomGeneration = GENERATION;
    document.documentElement.dataset.showroomRoute = ROUTE;
    document.documentElement.dataset.showroomMode = MODE;
    document.documentElement.dataset.generation2MountActivation = detail || "active";
  }

  function makeReceiptItem(name, value) {
    const item = document.createElement("li");
    item.innerHTML = "<strong>" + name + "</strong><span>" + String(value) + "</span>";
    return item;
  }

  function appendFallbackPanel(title, body, rows) {
    const host = document.getElementById("showroom-main") || document.querySelector("main") || document.body;
    const panel = document.createElement("section");
    panel.className = "showroom-receipt-panel";
    panel.dataset.generation2MountFallback = "true";

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

  function locateHost() {
    return document.getElementById("showroom-main") || document.querySelector("main") || document.body;
  }

  function ensureRenderRoot() {
    const existing =
      document.querySelector("[data-showroom-render-root]") ||
      document.getElementById("showroomRenderRoot");

    if (existing) {
      existing.dataset.showroomRenderRoot = "true";
      existing.dataset.showroomMode = MODE;
      existing.dataset.showroomGeneration = GENERATION;
      existing.dataset.visibleCodeGlobe = "pending";
      existing.dataset.generation2MountActivation = "existing-root";
      return existing;
    }

    const section = document.createElement("section");
    section.id = "showroomRenderRoot";
    section.dataset.showroomRenderRoot = "true";
    section.dataset.showroomMode = MODE;
    section.dataset.showroomGeneration = GENERATION;
    section.dataset.visibleCodeGlobe = "pending";
    section.dataset.generation2MountActivation = "created-by-parent-boot";

    locateHost().append(section);
    return section;
  }

  function requireRender() {
    return Boolean(
      global.ShowroomRender &&
      typeof global.ShowroomRender.renderShowroomProofSurface === "function"
    );
  }

  function boot() {
    setDocumentState("starting", "generation-2-mount-required");

    const root = ensureRenderRoot();

    root.dataset.parentBoot = "true";
    root.dataset.parentBootVersion = VERSION;
    root.dataset.showroomMode = MODE;
    root.dataset.showroomRoute = ROUTE;
    root.dataset.showroomGeneration = GENERATION;
    root.dataset.generation2MountActivation = "starting";

    if (!requireRender()) {
      root.dataset.generation2MountActivation = "render-missing";
      root.dataset.visibleCodeGlobe = "false";
      setDocumentState("render-missing", "showroom-render-unavailable");

      appendFallbackPanel(
        "Generation 2 render mount waiting",
        "The accepted Showroom shell is live, but /showroom/showroom.render.js is not exposing ShowroomRender.renderShowroomProofSurface.",
        [
          ["BOOT_VERSION", VERSION],
          ["ROUTE", ROUTE],
          ["MOUNT_ROOT", "present"],
          ["MISSING", "ShowroomRender.renderShowroomProofSurface"],
          ["NEXT_ACTION", "verify /showroom/showroom.render.js served source"]
        ]
      );

      return;
    }

    const app = global.ShowroomRender.renderShowroomProofSurface({
      root: root,
      mode: MODE
    });

    root.dataset.parentBootComplete = "true";
    root.dataset.generation2MountActivation = "complete";
    root.dataset.visibleCodeGlobe = app && app.instrument ? "true" : root.dataset.visibleCodeGlobe || "unknown";

    setDocumentState("complete", "generation-2-render-mounted");

    global.__SHOWROOM_PARENT_APP__ = app;
    global.__SHOWROOM_PARENT_GENERATION_2_MOUNT__ = {
      version: VERSION,
      generation: GENERATION,
      route: ROUTE,
      mode: MODE,
      complete: true,
      visibleCodeGlobe: Boolean(app && app.instrument)
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
      setDocumentState("failed", error.message);
      global.__SHOWROOM_PARENT_BOOT_ERROR__ = error;

      appendFallbackPanel(
        "Generation 2 parent mount error",
        "The accepted shell is live, but the lower Generation 2 render mount failed.",
        [
          ["BOOT_VERSION", VERSION],
          ["ROUTE", ROUTE],
          ["ERROR", error.message],
          ["GEN3_PHASE_BIND", "held"],
          ["GEN4_CLOSEOUT", "held"]
        ]
      );

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
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootSafely, { once: true });
  } else {
    bootSafely();
  }
})(window, document);
