(function () {
  "use strict";

  const state = {
    view: "gate",
    activeFruitRoute: "",
    butterflyVisibility: "hidden",
    generationReadiness: "GEN_1_3D_BASELINE",
    coreExperienceHold: true
  };

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function syncDocumentState() {
    document.documentElement.dataset.activeView = state.view;
    document.body.dataset.activeView = state.view;
    document.body.dataset.runtimeStatus = "active";
    document.body.dataset.generationReadiness = state.generationReadiness;
    document.body.dataset.coreExperienceHold = state.coreExperienceHold ? "true" : "false";
    document.body.dataset.butterflyVisibility = state.butterflyVisibility;

    const root = qs("#compass-root");
    if (root) {
      root.dataset.activeView = state.view;
      root.dataset.generationReadiness = state.generationReadiness;
      root.dataset.coreExperienceHold = state.coreExperienceHold ? "true" : "false";
    }

    qsa(".view-button").forEach((button) => {
      const isActive = button.dataset.view === state.view;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function render() {
    syncDocumentState();

    const root = qs("#index-render-root");
    if (!root || !window.DGBIndexRender || typeof window.DGBIndexRender.render !== "function") {
      return;
    }

    window.DGBIndexRender.render(Object.assign({}, state), root);
  }

  function setView(view) {
    if (!["gate", "tree", "inspect"].includes(view)) return;

    state.view = view;
    state.butterflyVisibility = view === "inspect" ? "visible" : "hidden";
    render();
  }

  function bindViewButtons() {
    qsa("[data-view]").forEach((button) => {
      button.addEventListener("click", () => {
        setView(button.dataset.view);
      });
    });
  }

  function bindKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "1") setView("gate");
      if (event.key === "2") setView("tree");
      if (event.key === "3") setView("inspect");
    });
  }

  function init() {
    bindViewButtons();
    bindKeyboardShortcuts();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.DGBIndexRuntime = Object.freeze({
    setView,
    render,
    state
  });
})();
