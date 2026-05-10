// /showroom/globe/hearth/hearth.climate.route.js
// HEARTH_PARENT_CHAIN_ORCHESTRATION_ROUTE_TNT_v19
// Full-file replacement.
// Route orchestration only.
// Loads parent authorities in order: composition → hydrology → materials → canvas.
// Does not generate terrain/materials itself unless all children fail.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_PARENT_CHAIN_ORCHESTRATION_ROUTE_TNT_v19";
  const RECEIPT = "HEARTH_PARENT_CHAIN_ORCHESTRATION_ROUTE_RECEIPT_v19";
  const PREVIOUS_CONTRACT = "HEARTH_SOURCE_ALIGNED_NATURAL_MATERIAL_ROUTE_TNT_v18";
  const VERSION = "2026-05-10.hearth-parent-chain-orchestration-route-v19";
  const KEY = "hearth-parent-chain-v19";

  const state = {
    loaded: [],
    failed: [],
    mounted: false,
    canvasFound: false,
    controlsBound: false,
    compositionLoaded: false,
    hydrologyLoaded: false,
    materialsLoaded: false,
    canvasLoaded: false,
    usingFallback: false,
    frames: 0,
    error: ""
  };

  window.__HEARTH_ACTIVE_ROUTE_FILE__ = "/showroom/globe/hearth/hearth.climate.route.js";
  window.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;

  function status(value) {
    const node =
      document.getElementById("hearth-route-status") ||
      document.querySelector("[data-hearth-route-status]");

    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthRouteControllerReceipt = RECEIPT;
    document.documentElement.dataset.hearthRoutePreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.hearthRouteVersion = VERSION;
    document.documentElement.dataset.hearthActiveRouteFile = "/showroom/globe/hearth/hearth.climate.route.js";
    document.documentElement.dataset.hearthParentChainAligned = "true";
    document.documentElement.dataset.hearthCompositionLoaded = String(state.compositionLoaded);
    document.documentElement.dataset.hearthHydrologyLoaded = String(state.hydrologyLoaded);
    document.documentElement.dataset.hearthMaterialsLoaded = String(state.materialsLoaded);
    document.documentElement.dataset.hearthCanvasLoaded = String(state.canvasLoaded);
    document.documentElement.dataset.hearthVisibleGlobeMounted = String(state.mounted);
    document.documentElement.dataset.hearthCanvasFound = String(state.canvasFound);
    document.documentElement.dataset.hearthControlsBound = String(state.controlsBound);
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (node) {
      node.textContent = [
        "Hearth parent-chain orchestration route.",
        `Status ${value}`,
        `Route ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Previous ${PREVIOUS_CONTRACT}`,
        `Version ${VERSION}`,
        "Parent order composition → hydrology → materials → canvas",
        `Loaded ${state.loaded.join(",") || "none"}`,
        `Failed ${state.failed.join(",") || "none"}`,
        `Composition loaded ${state.compositionLoaded}`,
        `Hydrology loaded ${state.hydrologyLoaded}`,
        `Materials loaded ${state.materialsLoaded}`,
        `Canvas loaded ${state.canvasLoaded}`,
        `Mounted ${state.mounted}`,
        `Canvas found ${state.canvasFound}`,
        `Controls bound ${state.controlsBound}`,
        `Using fallback ${state.usingFallback}`,
        `Frames ${state.frames}`,
        "Hard child failure blanks globe false",
        "Generated image false",
        "GraphicBox false",
        "Visual pass claimed false",
        state.error ? `Error ${state.error}` : ""
      ].filter(Boolean).join("\n");
    }
  }

  function mountNode() {
    let node =
      document.getElementById("hearthCanvasMount") ||
      document.querySelector("[data-hearth-canvas-mount]");

    if (!node) {
      node = document.createElement("section");
      (document.getElementById("hearth-main") || document.body).appendChild(node);
    }

    node.id = "hearthCanvasMount";
    node.dataset.hearthCanvasMount = "true";
    node.dataset.hearthParentChainAligned = "true";
    node.dataset.hearthRouteControllerContract = CONTRACT;
    node.style.touchAction = "none";
    node.style.userSelect = "none";
    node.querySelectorAll("canvas").forEach((canvas) => canvas.remove());

    return node;
  }

  function loadScript(role, src, validate) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.dataset.hearthFile = "true";
      script.dataset.hearthFileRole = role;
      script.dataset.hearthRouteContract = CONTRACT;

      script.onload = () => {
        let ok = false;

        try {
          ok = validate();
        } catch (_) {
          ok = false;
        }

        if (ok) {
          state.loaded.push(role);
        } else {
          state.failed.push(`${role}:invalid`);
        }

        status(`checked-${role}`);
        resolve(ok);
      };

      script.onerror = () => {
        state.failed.push(`${role}:load-error`);
        status(`failed-${role}`);
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  function bootCanvas(mount) {
    if (!window.HEARTH_MATERIALS || !window.HEARTH_CANVAS) return false;
    if (typeof window.HEARTH_CANVAS.mount !== "function") return false;

    const api = window.HEARTH_CANVAS.mount(mount, {
      materials: window.HEARTH_MATERIALS,
      routeContract: CONTRACT,
      routeReceipt: RECEIPT,
      onStatus: (value, info) => {
        state.frames = info.frames || state.frames;
        state.mounted = Boolean(info.mounted);
        state.canvasFound = Boolean(info.canvasFound);
        state.controlsBound = Boolean(info.controlsBound);
        state.usingFallback = false;
        status(`canvas-${value}`);
      }
    });

    state.mounted = Boolean(api && api.canvas);
    state.canvasFound = Boolean(api && api.canvas);
    state.controlsBound = true;
    state.usingFallback = false;

    status("parent-chain-canvas-mounted");

    return true;
  }

  function bootFallback(mount) {
    const fallback = document.createElement("div");
    fallback.style.position = "absolute";
    fallback.style.inset = "0";
    fallback.style.display = "grid";
    fallback.style.placeItems = "center";
    fallback.style.color = "rgba(238,246,255,.72)";
    fallback.style.textAlign = "center";
    fallback.style.padding = "22px";
    fallback.style.fontWeight = "800";
    fallback.textContent = "Hearth parent chain loaded, but canvas authority failed. Visible fallback protected.";

    mount.appendChild(fallback);

    state.mounted = true;
    state.canvasFound = false;
    state.controlsBound = false;
    state.usingFallback = true;

    status("fallback-mounted");
  }

  async function boot() {
    const mount = mountNode();

    status("booting");

    state.compositionLoaded = await loadScript(
      "composition",
      `/assets/hearth/hearth.composition.js?v=${KEY}-${Date.now()}`,
      () => Boolean(window.HEARTH_COMPOSITION && typeof window.HEARTH_COMPOSITION.sampleComposition === "function")
    );

    state.hydrologyLoaded = await loadScript(
      "hydrology",
      `/assets/hearth/hearth.hydrology.js?v=${KEY}-${Date.now()}`,
      () => Boolean(window.HEARTH_HYDROLOGY && typeof window.HEARTH_HYDROLOGY.sampleHydrology === "function")
    );

    state.materialsLoaded = await loadScript(
      "materials",
      `/assets/hearth/hearth.materials.js?v=${KEY}-${Date.now()}`,
      () => Boolean(window.HEARTH_MATERIALS && typeof window.HEARTH_MATERIALS.createTextureCanvas === "function")
    );

    state.canvasLoaded = await loadScript(
      "canvas",
      `/assets/hearth/hearth.canvas.js?v=${KEY}-${Date.now()}`,
      () => Boolean(window.HEARTH_CANVAS && typeof window.HEARTH_CANVAS.mount === "function")
    );

    if (state.materialsLoaded && state.canvasLoaded) {
      try {
        if (bootCanvas(mount)) return;
      } catch (error) {
        state.failed.push("canvas:mount-error");
        state.error = error?.message || String(error);
        status("canvas-mount-error");
      }
    }

    bootFallback(mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
