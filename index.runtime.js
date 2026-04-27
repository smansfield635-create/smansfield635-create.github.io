(function () {
  "use strict";

  const allowedModes = new Set(["flat", "round", "globe"]);
  const defaultMode = "flat";

  function safeMode(mode) {
    return allowedModes.has(mode) ? mode : defaultMode;
  }

  function setSelected(buttons, mode) {
    buttons.forEach((button) => {
      const selected = button.dataset.mode === mode;
      button.setAttribute("aria-selected", selected ? "true" : "false");
    });
  }

  function writeReceipt(mode) {
    document.documentElement.dataset.currentViewMode = mode;
    document.body.dataset.activeMode = mode;
    document.body.dataset.runtimeStatus = "active";
    document.body.dataset.runtimeMode = mode;
    document.body.dataset.routesChanged = "false";
    document.body.dataset.gaugesLogicTouched = "false";
    document.body.dataset.fakeHealthClaim = "false";
  }

  function init() {
    const root = document.getElementById("index-render-root");
    const buttons = Array.from(document.querySelectorAll("[data-mode]"));

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
      window.DGBIndexRender.render(nextMode, root);
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
    });

    setMode(defaultMode);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
