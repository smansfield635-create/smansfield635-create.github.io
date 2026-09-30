(function () {
  "use strict";

  function normalizeUniverse(universe) {
    return universe === "mirror" ? "mirror" : "demo";
  }

  function renderDependencyError(root, message) {
    root.replaceChildren();

    const card = document.createElement("article");
    card.className = "fallback-card";
    card.dataset.renderError = "true";

    const kicker = document.createElement("p");
    kicker.className = "kicker";
    kicker.textContent = "Render dependency missing";

    const title = document.createElement("h2");
    title.textContent = "Globe engine could not mount.";

    const body = document.createElement("p");
    body.textContent = message;

    card.appendChild(kicker);
    card.appendChild(title);
    card.appendChild(body);
    root.appendChild(card);
  }

  function mountGlobe(options) {
    const root = options && options.root;
    const universe = normalizeUniverse(options && options.universe);

    if (!root) return;

    root.dataset.renderStatus = "rendering";
    root.dataset.renderEngine = "DGBGlobeEngine";
    root.dataset.renderSource = "/render/globe.engine.js";
    root.dataset.renderTemplate = "/render/globe.template.js";
    root.dataset.activeUniverse = universe;

    if (!window.DGBGlobeTemplate || typeof window.DGBGlobeTemplate.createScene !== "function") {
      renderDependencyError(root, "Missing /render/globe.template.js.");
      root.dataset.renderStatus = "error";
      return;
    }

    root.replaceChildren();
    root.appendChild(window.DGBGlobeTemplate.createScene({ universe }));
    root.dataset.renderStatus = "complete";
  }

  window.DGBGlobeEngine = Object.freeze({
    mountGlobe
  });
})();
