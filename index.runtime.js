(function () {
  "use strict";

  const allowedModes = new Set(["flat", "round", "globe"]);
  const defaultMode = "flat";
  const BASELINE_GENERATION = "B1";
  const COMPASS_GENERATION = "B1_BASELINE";

  function safeMode(mode) {
    return allowedModes.has(mode) ? mode : defaultMode;
  }

  function setSelected(buttons, mode) {
    buttons.forEach((button) => {
      const selected = button.dataset.mode === mode;

      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", selected ? "true" : "false");
    });
  }

  function writeReceipt(mode) {
    document.documentElement.dataset.currentViewMode = mode;
    document.documentElement.dataset.baselineGeneration = BASELINE_GENERATION;
    document.documentElement.dataset.compassGeneration = COMPASS_GENERATION;
    document.documentElement.dataset.compassVisualState = "baseline";
    document.documentElement.dataset.compassReadiness = "baseline-hold";
    document.documentElement.dataset.generationReadiness = "B1_BASELINE_HOLD";
    document.documentElement.dataset.generationAccepted = "false";
    document.documentElement.dataset.generation2Accepted = "false";
    document.documentElement.dataset.generation3Accepted = "false";
    document.documentElement.dataset.treeDetailState = "held";
    document.documentElement.dataset.treeVisualQuality = "not-accepted";
    document.documentElement.dataset.treeAssetSpine = "future-held";

    document.body.dataset.activeMode = mode;
    document.body.dataset.currentViewMode = mode;
    document.body.dataset.runtimeStatus = "active";
    document.body.dataset.runtimeMode = mode;
    document.body.dataset.baselineGeneration = BASELINE_GENERATION;
    document.body.dataset.compassGeneration = COMPASS_GENERATION;
    document.body.dataset.routesChanged = "false";
    document.body.dataset.gaugesLogicTouched = "false";
    document.body.dataset.fakeHealthClaim = "false";

    const root = document.getElementById("compass-root");
    if (root) {
      root.dataset.currentViewMode = mode;
      root.dataset.baselineGeneration = BASELINE_GENERATION;
      root.dataset.compassGeneration = COMPASS_GENERATION;
      root.dataset.generationAccepted = "false";
      root.dataset.generation2Accepted = "false";
      root.dataset.generation3Accepted = "false";
      root.dataset.treeDetailState = "held";
      root.dataset.treeAssetSpine = "future-held";
    }
  }

  function buildRenderState(mode) {
    return {
      mode,
      baselineGeneration: BASELINE_GENERATION,
      compassGeneration: COMPASS_GENERATION,
      visualState: "baseline",
      compassReadiness: "baseline-hold",
      generationAccepted: false,
      generation2Accepted: false,
      generation3Accepted: false,
      treeDetailState: "held",
      treeVisualQuality: "not-accepted",
      treeAssetSpine: "future-held",
      dollLayer: "DOLL_1_COMPASS",
      canopyIndex: 1,
      branchSeatIndex: 1,
      terminalIndex: 1
    };
  }

  function ensureInspectGlobeToggle(stage) {
    let button = document.querySelector(".inspect-globe-toggle");

    if (button) return button;

    button = document.createElement("button");
    button.className = "inspect-globe-toggle";
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("data-inspect-globe-toggle", "true");
    button.textContent = "Inspect Globe";

    stage.appendChild(button);

    return button;
  }

  function setInspectGlobe(open) {
    const isOpen = Boolean(open);
    const button = document.querySelector(".inspect-globe-toggle");

    document.documentElement.dataset.inspectGlobe = isOpen ? "open" : "closed";
    document.body.dataset.inspectGlobe = isOpen ? "open" : "closed";

    if (button) {
      button.textContent = isOpen ? "Close Inspect" : "Inspect Globe";
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  }

  function bindInspectGlobeToggle() {
    const stage = document.querySelector(".compass-stage") || document.querySelector(".scene-shell");

    if (!stage) return;

    const button = ensureInspectGlobeToggle(stage);

    setInspectGlobe(false);

    button.addEventListener("click", () => {
      const nextOpen = document.body.dataset.inspectGlobe !== "open";
      setInspectGlobe(nextOpen);
    });
  }

  function init() {
    const root = document.getElementById("index-render-root");
    const buttons = Array.from(document.querySelectorAll("[data-mode]"));

    bindInspectGlobeToggle();

    if (!root) {
      document.body.dataset.runtimeStatus = "failed-no-render-root";
      return;
    }

    if (!window.DGBIndexRender || typeof window.DGBIndexRender.render !== "function") {
      root.dataset.renderStatus = "failed-render-module-missing";
      document.body.dataset.runtimeStatus = "failed-render-module-missing";
      return;
    }

    function setMode(mode) {
      const nextMode = safeMode(mode);

      setSelected(buttons, nextMode);
      writeReceipt(nextMode);

      root.dataset.activeMode = nextMode;
      root.dataset.renderStatus = "queued";
      root.dataset.baselineGeneration = BASELINE_GENERATION;
      root.dataset.compassGeneration = COMPASS_GENERATION;
      root.dataset.generationAccepted = "false";
      root.dataset.generation2Accepted = "false";
      root.dataset.generation3Accepted = "false";
      root.dataset.treeDetailState = "held";
      root.dataset.treeAssetSpine = "future-held";

      window.DGBIndexRender.render(buildRenderState(nextMode), root);
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
    });

    setMode(document.body.dataset.activeMode || defaultMode);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
