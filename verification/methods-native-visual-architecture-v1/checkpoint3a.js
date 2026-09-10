(() => {
  "use strict";

  const root = document.querySelector("[data-mm-showroom]");
  if (!root) return;

  const mobileQuery = globalThis.matchMedia("(max-width: 760px)");

  function normalizeControls() {
    root.querySelectorAll(".mm-family-tab, [data-mm-lens-tab]").forEach(button => {
      button.removeAttribute("aria-hidden");
      if ("inert" in button) button.inert = false;
      else button.removeAttribute("inert");
      button.tabIndex = button.getAttribute("aria-selected") === "true" ? 0 : -1;
    });

    root.querySelectorAll(".mm-z-axis-controls button").forEach(button => {
      button.hidden = mobileQuery.matches;
    });
  }

  function scheduleNormalize() {
    queueMicrotask(normalizeControls);
  }

  globalThis.addEventListener("METHODS_MODELS_EUCLIDEAN_STATE_CHANGED", scheduleNormalize);
  globalThis.addEventListener("METHODS_MODELS_SHOWROOM_CHANGED", scheduleNormalize);
  globalThis.addEventListener("resize", scheduleNormalize, { passive: true });
  mobileQuery.addEventListener?.("change", scheduleNormalize);

  document.documentElement.dataset.methodsModelsNativeCheckpoint = "3a";
  normalizeControls();
})();
