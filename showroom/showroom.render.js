// /showroom/showroom.render.js
(function () {
  "use strict";

  const ENGINE_SRC = "/render/globe.engine.js";
  const TEMPLATE_SRC = "/render/globe.template.js";
  const MOUNT_ID = "showroom-globe-mount";
  const VERSION = "showroom-render-shared-globe-loader-v2";

  const state = {
    universe: "demo",
    loading: false,
    initialized: false,
    dependencyStatus: "pending"
  };

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function create(tag, attrs, children) {
    const node = document.createElement(tag);

    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, String(value));
    });

    (children || []).forEach((child) => {
      if (typeof child === "string") node.appendChild(document.createTextNode(child));
      else if (child) node.appendChild(child);
    });

    return node;
  }

  function normalizeUniverse(universe) {
    return universe === "mirror" ? "mirror" : "demo";
  }

  function getInitialUniverse() {
    const bodyUniverse = document.body?.dataset?.activeUniverse;
    const rootUniverse = qs("#showroom-root")?.dataset?.activeUniverse;
    const mountUniverse = qs("#showroom-globe-mount")?.dataset?.activeUniverse;
    return normalizeUniverse(mountUniverse || rootUniverse || bodyUniverse || state.universe);
  }

  function syncButtons() {
    state.universe = normalizeUniverse(state.universe);

    if (document.body) {
      document.body.dataset.activeUniverse = state.universe;
    }

    const root = qs("#showroom-root");
    if (root) {
      root.dataset.activeUniverse = state.universe;
      root.dataset.showroomRenderVersion = VERSION;
    }

    const mount = qs("#showroom-globe-mount");
    if (mount) {
      mount.dataset.activeUniverse = state.universe;
      mount.dataset.showroomRenderVersion = VERSION;
    }

    qsa(".universe-button").forEach((button) => {
      const active = normalizeUniverse(button.dataset.universe) === state.universe;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function loadClassicScript(src, id) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);

      if (existing?.dataset.loaded === "true") {
        resolve(existing);
        return;
      }

      if (existing) {
        existing.addEventListener("load", () => resolve(existing), { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("Failed to load " + src)),
          { once: true }
        );

        window.setTimeout(() => {
          if (src === ENGINE_SRC && window.DGBGlobeEngine?.mountGlobe) {
            resolve(existing);
          }
        }, 0);

        return;
      }

      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = false;
      script.dataset.showroomRequiredDependency = "true";

      script.addEventListener(
        "load",
        () => {
          script.dataset.loaded = "true";
          resolve(script);
        },
        { once: true }
      );

      script.addEventListener(
        "error",
        () => reject(new Error("Failed to load " + src)),
        { once: true }
      );

      document.head.appendChild(script);
    });
  }

  async function ensureSharedGlobeDependencies() {
    if (window.DGBGlobeEngine && typeof window.DGBGlobeEngine.mountGlobe === "function") {
      state.dependencyStatus = "ready";
      return true;
    }

    state.dependencyStatus = "loading";

    await loadClassicScript(TEMPLATE_SRC, "showroom-globe-template-js");
    await loadClassicScript(ENGINE_SRC, "showroom-globe-engine-js");

    if (!window.DGBGlobeEngine || typeof window.DGBGlobeEngine.mountGlobe !== "function") {
      throw new Error(
        "Expected window.DGBGlobeEngine.mountGlobe after loading /render/globe.template.js and /render/globe.engine.js."
      );
    }

    state.dependencyStatus = "ready";
    return true;
  }

  function renderLoading(root) {
    root.replaceChildren(
      create("article", { className: "fallback-card", "data-render-loading": "true" }, [
        create("p", { className: "kicker", text: "Showroom render loading" }),
        create("h2", { text: "Preparing shared globe engine." }),
        create("p", { text: "The Showroom is loading the shared globe template and engine." })
      ])
    );

    root.dataset.renderStatus = "loading";
    root.dataset.downstreamMount = "showroom";
    root.dataset.sharedGlobeTemplate = TEMPLATE_SRC;
    root.dataset.sharedGlobeEngine = ENGINE_SRC;
    root.dataset.showroomRenderVersion = VERSION;
  }

  function renderFallback(root, title, message) {
    root.replaceChildren(
      create("article", { className: "fallback-card", "data-render-error": "true" }, [
        create("p", { className: "kicker", text: "Showroom render dependency missing" }),
        create("h2", { text: title }),
        create("p", { text: message })
      ])
    );

    root.dataset.renderStatus = "error";
    root.dataset.downstreamMount = "showroom";
    root.dataset.sharedGlobeTemplate = TEMPLATE_SRC;
    root.dataset.sharedGlobeEngine = ENGINE_SRC;
    root.dataset.showroomRenderVersion = VERSION;
  }

  async function render() {
    syncButtons();

    const mount = qs("#" + MOUNT_ID);
    if (!mount) return;

    mount.dataset.renderStatus = "rendering";
    mount.dataset.downstreamMount = "showroom";
    mount.dataset.sharedGlobeTemplate = TEMPLATE_SRC;
    mount.dataset.sharedGlobeEngine = ENGINE_SRC;
    mount.dataset.showroomRenderVersion = VERSION;
    mount.dataset.activeUniverse = state.universe;

    try {
      if (!window.DGBGlobeEngine || typeof window.DGBGlobeEngine.mountGlobe !== "function") {
        renderLoading(mount);
        await ensureSharedGlobeDependencies();
      }

      mount.dataset.renderStatus = "mounting";
      mount.dataset.activeUniverse = state.universe;

      window.DGBGlobeEngine.mountGlobe({
        root: mount,
        universe: state.universe
      });

      mount.dataset.renderStatus = "complete";
      mount.dataset.activeUniverse = state.universe;
      mount.dataset.showroomRenderVersion = VERSION;
      state.initialized = true;
    } catch (error) {
      console.error("[Showroom render failure]", error);

      renderFallback(
        mount,
        "Shared globe engine unavailable.",
        error && error.message
          ? error.message
          : "Expected /render/globe.engine.js and /render/globe.template.js before the Showroom globe mount can render."
      );
    }
  }

  function setUniverse(universe) {
    state.universe = normalizeUniverse(universe);
    render();
  }

  function bindControls() {
    if (document.body?.dataset?.showroomUniverseControlsBound === "true") {
      return;
    }

    if (document.body) {
      document.body.dataset.showroomUniverseControlsBound = "true";
    }

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-universe]");
      if (!button) return;

      setUniverse(button.dataset.universe);
    });
  }

  function init() {
    state.universe = getInitialUniverse();
    bindControls();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.DGBShowroomMount = Object.freeze({
    setUniverse,
    render,
    state,
    version: VERSION,
    engine: ENGINE_SRC,
    template: TEMPLATE_SRC
  });
})();
