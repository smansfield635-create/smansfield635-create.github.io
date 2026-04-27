(function () {
  "use strict";

  const allowedModes = new Set(["flat", "round", "globe"]);
  const allowedZoom = new Set(["estate", "oak", "habitat", "wildlife"]);
  const allowedZones = new Set(["roots", "bark", "hollow", "branches", "canopy", "snowVerge"]);

  const state = {
    mode: "flat",
    zoom: "estate",
    treeZone: "roots",
    wildlifeFocus: "none",
    lastUserAction: "init"
  };

  function safeValue(value, allowed, fallback) {
    return allowed.has(value) ? value : fallback;
  }

  function syncBodyState() {
    document.documentElement.dataset.currentViewMode = state.mode;
    document.documentElement.dataset.currentZoomLevel = state.zoom;
    document.documentElement.dataset.currentTreeZone = state.treeZone;

    document.body.dataset.activeMode = state.mode;
    document.body.dataset.zoomLevel = state.zoom;
    document.body.dataset.treeZone = state.treeZone;
    document.body.dataset.wildlifeFocus = state.wildlifeFocus;
    document.body.dataset.runtimeStatus = "active";
    document.body.dataset.runtimeMode = state.mode;
    document.body.dataset.lastUserAction = state.lastUserAction;
    document.body.dataset.routesChanged = "false";
    document.body.dataset.gaugesLogicTouched = "false";
    document.body.dataset.fakeHealthClaim = "false";
  }

  function syncStaticButtons() {
    document.querySelectorAll("[data-mode]").forEach((button) => {
      const selected = button.dataset.mode === state.mode;
      button.setAttribute("aria-selected", selected ? "true" : "false");
    });
  }

  function syncDynamicButtons(root) {
    root.querySelectorAll("[data-zoom]").forEach((button) => {
      const selected = button.dataset.zoom === state.zoom;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });

    root.querySelectorAll("[data-tree-zone]").forEach((button) => {
      const selected = button.dataset.treeZone === state.treeZone;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  function bindDynamicControls(root) {
    root.querySelectorAll("[data-zoom]").forEach((button) => {
      button.addEventListener("click", () => {
        setState({
          mode: "round",
          zoom: button.dataset.zoom,
          lastUserAction: `zoom:${button.dataset.zoom}`
        });
      });
    });

    root.querySelectorAll("[data-tree-zone]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextZone = button.dataset.treeZone;
        setState({
          mode: "round",
          zoom: state.zoom === "estate" ? "habitat" : state.zoom,
          treeZone: nextZone,
          wildlifeFocus: nextZone,
          lastUserAction: `tree-zone:${nextZone}`
        });
      });
    });
  }

  function render() {
    const root = document.getElementById("index-render-root");

    if (!root) {
      document.body.dataset.runtimeStatus = "failed-no-render-root";
      return;
    }

    if (!window.DGBIndexRender || typeof window.DGBIndexRender.render !== "function") {
      root.dataset.renderStatus = "failed-render-module-missing";
      document.body.dataset.runtimeStatus = "failed-render-module-missing";
      return;
    }

    syncBodyState();
    syncStaticButtons();

    window.DGBIndexRender.render(state, root);

    bindDynamicControls(root);
    syncDynamicButtons(root);
  }

  function setState(patch) {
    const incoming = patch || {};

    if (Object.prototype.hasOwnProperty.call(incoming, "mode")) {
      state.mode = safeValue(incoming.mode, allowedModes, "flat");
    }

    if (Object.prototype.hasOwnProperty.call(incoming, "zoom")) {
      state.zoom = safeValue(incoming.zoom, allowedZoom, "estate");
    }

    if (Object.prototype.hasOwnProperty.call(incoming, "treeZone")) {
      state.treeZone = safeValue(incoming.treeZone, allowedZones, "roots");
    }

    if (Object.prototype.hasOwnProperty.call(incoming, "wildlifeFocus")) {
      state.wildlifeFocus = incoming.wildlifeFocus || "none";
    }

    if (Object.prototype.hasOwnProperty.call(incoming, "lastUserAction")) {
      state.lastUserAction = incoming.lastUserAction || "unknown";
    }

    if (state.mode !== "round") {
      state.zoom = "estate";
      state.treeZone = "roots";
      state.wildlifeFocus = "none";
    }

    render();
  }

  function bindModeControls() {
    document.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        const mode = safeValue(button.dataset.mode, allowedModes, "flat");

        setState({
          mode,
          zoom: mode === "round" ? state.zoom : "estate",
          treeZone: mode === "round" ? state.treeZone : "roots",
          wildlifeFocus: mode === "round" ? state.wildlifeFocus : "none",
          lastUserAction: `mode:${mode}`
        });
      });
    });
  }

  function bindKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (state.mode !== "round") return;

      const zoomOrder = ["estate", "oak", "habitat", "wildlife"];
      const zoneOrder = ["roots", "bark", "hollow", "branches", "canopy", "snowVerge"];

      if (event.key === "ArrowRight") {
        const next = zoomOrder[Math.min(zoomOrder.indexOf(state.zoom) + 1, zoomOrder.length - 1)];
        setState({ zoom: next, lastUserAction: "keyboard:zoom-next" });
      }

      if (event.key === "ArrowLeft") {
        const next = zoomOrder[Math.max(zoomOrder.indexOf(state.zoom) - 1, 0)];
        setState({ zoom: next, lastUserAction: "keyboard:zoom-prev" });
      }

      if (event.key === "ArrowDown") {
        const next = zoneOrder[Math.min(zoneOrder.indexOf(state.treeZone) + 1, zoneOrder.length - 1)];
        setState({ treeZone: next, wildlifeFocus: next, zoom: "habitat", lastUserAction: "keyboard:zone-next" });
      }

      if (event.key === "ArrowUp") {
        const next = zoneOrder[Math.max(zoneOrder.indexOf(state.treeZone) - 1, 0)];
        setState({ treeZone: next, wildlifeFocus: next, zoom: "habitat", lastUserAction: "keyboard:zone-prev" });
      }
    });
  }

  function init() {
    bindModeControls();
    bindKeyboardShortcuts();
    setState({ mode: "flat", zoom: "estate", treeZone: "roots", lastUserAction: "init:flat-default" });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.DGBIndexRuntime = Object.freeze({
    setState,
    readState: function () {
      return Object.assign({}, state);
    }
  });
})();
