(function () {
  "use strict";

  const state = {
    universe: "demo"
  };

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function normalizeUniverse(universe) {
    return universe === "mirror" ? "mirror" : "demo";
  }

  function syncButtons() {
    document.body.dataset.activeUniverse = state.universe;

    const root = qs("#showroom-root");
    if (root) root.dataset.activeUniverse = state.universe;

    const mount = qs("#showroom-globe-mount");
    if (mount) mount.dataset.activeUniverse = state.universe;

    qsa(".universe-button").forEach((button) => {
      const active = button.dataset.universe === state.universe;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function renderFallback(root) {
    root.replaceChildren();

    const card = document.createElement("article");
    card.className = "fallback-card";
    card.dataset.renderError = "true";

    const kicker = document.createElement("p");
    kicker.className = "kicker";
    kicker.textContent = "Showroom render dependency missing";

    const title = document.createElement("h2");
    title.textContent = "Shared globe engine unavailable.";

    const body = document.createElement("p");
    body.textContent = "Expected /render/globe.engine.js and /render/globe.template.js before /showroom/showroom.render.js.";

    card.appendChild(kicker);
    card.appendChild(title);
    card.appendChild(body);
    root.appendChild(card);
  }

  function render() {
    syncButtons();

    const mount = qs("#showroom-globe-mount");
    if (!mount) return;

    mount.dataset.renderStatus = "rendering";
    mount.dataset.downstreamMount = "showroom";

    if (!window.DGBGlobeEngine || typeof window.DGBGlobeEngine.mountGlobe !== "function") {
      renderFallback(mount);
      mount.dataset.renderStatus = "error";
      return;
    }

    window.DGBGlobeEngine.mountGlobe({
      root: mount,
      universe: state.universe
    });
  }

  function setUniverse(universe) {
    state.universe = normalizeUniverse(universe);
    render();
  }

  function bindControls() {
    qsa("[data-universe]").forEach((button) => {
      button.addEventListener("click", () => {
        setUniverse(button.dataset.universe);
      });
    });
  }

  function init() {
    bindControls();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.DGBShowroomMount = Object.freeze({
    setUniverse,
    render,
    state
  });
})();
