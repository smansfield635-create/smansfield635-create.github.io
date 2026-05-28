// /showroom/globe/hearth/hearth.climate.route.js
// HEARTH_ELEVATION_COMPOSITION_MATERIAL_ROUTE_SYNC_TNT_v22
// Full-file replacement.
// Route orchestration only.
// Loads parent authorities in order: elevation → composition → tectonics → hydrology → materials → canvas.
// Compatibility preserved with v21/v19 carrier posture.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ELEVATION_COMPOSITION_MATERIAL_ROUTE_SYNC_TNT_v22";
  const RECEIPT = "HEARTH_ELEVATION_COMPOSITION_MATERIAL_ROUTE_SYNC_RECEIPT_v22";
  const PREVIOUS_CONTRACT = "HEARTH_TECTONIC_PARENT_CHAIN_ROUTE_TNT_v21";
  const BASELINE_CONTRACT = "HEARTH_PARENT_CHAIN_ORCHESTRATION_ROUTE_TNT_v19";
  const VERSION = "2026-05-28.hearth-elevation-composition-material-route-sync-v22";
  const KEY = "hearth-elevation-composition-material-route-sync-v22";

  const state = {
    loaded: [],
    failed: [],
    mounted: false,
    canvasFound: false,
    controlsBound: false,
    elevationLoaded: false,
    compositionLoaded: false,
    tectonicsLoaded: false,
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
    document.documentElement.dataset.hearthRouteBaselineContract = BASELINE_CONTRACT;
    document.documentElement.dataset.hearthRouteVersion = VERSION;
    document.documentElement.dataset.hearthActiveRouteFile = "/showroom/globe/hearth/hearth.climate.route.js";
    document.documentElement.dataset.hearthParentChainAligned = "true";
    document.documentElement.dataset.hearthParentChainOrder = "elevation-composition-tectonics-hydrology-materials-canvas";
    document.documentElement.dataset.hearthElevationLoaded = String(state.elevationLoaded);
    document.documentElement.dataset.hearthCompositionLoaded = String(state.compositionLoaded);
    document.documentElement.dataset.hearthTectonicsLoaded = String(state.tectonicsLoaded);
    document.documentElement.dataset.hearthHydrologyLoaded = String(state.hydrologyLoaded);
    document.documentElement.dataset.hearthMaterialsLoaded = String(state.materialsLoaded);
    document.documentElement.dataset.hearthCanvasLoaded = String(state.canvasLoaded);
    document.documentElement.dataset.hearthVisibleGlobeMounted = String(state.mounted);
    document.documentElement.dataset.hearthCanvasFound = String(state.canvasFound);
    document.documentElement.dataset.hearthControlsBound = String(state.controlsBound);
    document.documentElement.dataset.hearthRockyMeansJaggedNotGray = "true";
    document.documentElement.dataset.hearthPlateTectonicsActive = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.webgl = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    window.HEARTH_ROUTE_SYNC_STATUS = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      parentChainOrder: "elevation → composition → tectonics → hydrology → materials → canvas",
      loaded: state.loaded.slice(),
      failed: state.failed.slice(),
      elevationLoaded: state.elevationLoaded,
      compositionLoaded: state.compositionLoaded,
      tectonicsLoaded: state.tectonicsLoaded,
      hydrologyLoaded: state.hydrologyLoaded,
      materialsLoaded: state.materialsLoaded,
      canvasLoaded: state.canvasLoaded,
      mounted: state.mounted,
      canvasFound: state.canvasFound,
      controlsBound: state.controlsBound,
      usingFallback: state.usingFallback,
      frames: state.frames,
      error: state.error,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: new Date().toISOString()
    };

    if (node) {
      node.textContent = [
        "Hearth elevation/composition/material route sync.",
        `Status ${value}`,
        `Route ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Previous ${PREVIOUS_CONTRACT}`,
        `Baseline ${BASELINE_CONTRACT}`,
        `Version ${VERSION}`,
        "Parent order elevation → composition → tectonics → hydrology → materials → canvas",
        "Compatibility parent order composition → hydrology → materials → canvas preserved downstream",
        `Loaded ${state.loaded.join(",") || "none"}`,
        `Failed ${state.failed.join(",") || "none"}`,
        `Elevation loaded ${state.elevationLoaded}`,
        `Composition loaded ${state.compositionLoaded}`,
        `Tectonics loaded ${state.tectonicsLoaded}`,
        `Hydrology loaded ${state.hydrologyLoaded}`,
        `Materials loaded ${state.materialsLoaded}`,
        `Canvas loaded ${state.canvasLoaded}`,
        `Mounted ${state.mounted}`,
        `Canvas found ${state.canvasFound}`,
        `Controls bound ${state.controlsBound}`,
        `Using fallback ${state.usingFallback}`,
        `Frames ${state.frames}`,
        "Rocky means jagged not gray true",
        "Plate tectonics active true",
        "Hard child failure blanks globe false",
        "Generated image false",
        "GraphicBox false",
        "WebGL false",
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
    node.dataset.hearthRouteControllerReceipt = RECEIPT;
    node.dataset.hearthParentChainOrder = "elevation-composition-tectonics-hydrology-materials-canvas";
    node.dataset.generatedImage = "false";
    node.dataset.graphicBox = "false";
    node.dataset.webgl = "false";
    node.dataset.visualPassClaimed = "false";
    node.style.touchAction = "none";
    node.style.userSelect = "none";

    node.querySelectorAll("canvas").forEach((canvas) => canvas.remove());
    node.querySelectorAll("[data-hearth-route-fallback]").forEach((fallback) => fallback.remove());

    const fallback = node.querySelector("[data-hearth-mount-fallback]");
    if (fallback) fallback.remove();

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
      script.dataset.hearthRouteReceipt = RECEIPT;
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      script.onload = () => {
        let ok = false;

        try {
          ok = Boolean(validate());
        } catch (error) {
          ok = false;
          state.error = `${role}: ${error?.message || String(error)}`;
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

  function validateElevation() {
    const api =
      window.HEARTH_ELEVATION ||
      window.HearthElevation ||
      (window.HEARTH && window.HEARTH.elevation);

    return Boolean(
      api &&
      (
        typeof api.sample === "function" ||
        typeof api.read === "function" ||
        typeof api.getElevation === "function" ||
        typeof api.sampleElevation === "function" ||
        typeof api.readElevation === "function"
      )
    );
  }

  function validateComposition() {
    const api =
      window.HEARTH_COMPOSITION ||
      window.HearthComposition ||
      (window.HEARTH && window.HEARTH.composition);

    return Boolean(
      api &&
      (
        typeof api.sample === "function" ||
        typeof api.compose === "function" ||
        typeof api.read === "function" ||
        typeof api.sampleComposition === "function" ||
        typeof api.readComposition === "function"
      )
    );
  }

  function validateTectonics() {
    const api =
      window.HEARTH_TECTONICS ||
      window.HearthTectonics ||
      (window.HEARTH && window.HEARTH.tectonics);

    return Boolean(
      api &&
      (
        typeof api.sampleTectonics === "function" ||
        typeof api.sample === "function" ||
        typeof api.read === "function"
      )
    );
  }

  function validateHydrology() {
    const api =
      window.HEARTH_HYDROLOGY ||
      window.HearthHydrology ||
      (window.HEARTH && window.HEARTH.hydrology);

    return Boolean(
      api &&
      (
        typeof api.sampleHydrology === "function" ||
        typeof api.sample === "function" ||
        typeof api.read === "function"
      )
    );
  }

  function validateMaterials() {
    const api =
      window.HEARTH_MATERIALS ||
      window.HearthMaterials ||
      (window.HEARTH && window.HEARTH.materials);

    return Boolean(
      api &&
      typeof api.createTextureCanvas === "function" &&
      (
        typeof api.sample === "function" ||
        typeof api.read === "function" ||
        typeof api.getMaterial === "function" ||
        typeof api.materialAt === "function"
      )
    );
  }

  function validateCanvas() {
    const api =
      window.HEARTH_CANVAS ||
      window.HearthCanvas ||
      (window.HEARTH && window.HEARTH.canvas);

    return Boolean(api && typeof api.mount === "function");
  }

  function bootCanvas(mount) {
    const materials =
      window.HEARTH_MATERIALS ||
      window.HearthMaterials ||
      (window.HEARTH && window.HEARTH.materials);

    const canvasAuthority =
      window.HEARTH_CANVAS ||
      window.HearthCanvas ||
      (window.HEARTH && window.HEARTH.canvas);

    if (!materials || !canvasAuthority) return false;
    if (typeof materials.createTextureCanvas !== "function") return false;
    if (typeof canvasAuthority.mount !== "function") return false;

    const api = canvasAuthority.mount(mount, {
      materials,
      elevation: window.HEARTH_ELEVATION || window.HearthElevation || (window.HEARTH && window.HEARTH.elevation),
      composition: window.HEARTH_COMPOSITION || window.HearthComposition || (window.HEARTH && window.HEARTH.composition),
      tectonics: window.HEARTH_TECTONICS || window.HearthTectonics || (window.HEARTH && window.HEARTH.tectonics),
      hydrology: window.HEARTH_HYDROLOGY || window.HearthHydrology || (window.HEARTH && window.HEARTH.hydrology),
      routeContract: CONTRACT,
      routeReceipt: RECEIPT,
      previousRouteContract: PREVIOUS_CONTRACT,
      parentChainOrder: "elevation → composition → tectonics → hydrology → materials → canvas",
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      onStatus: (value, info = {}) => {
        state.frames = info.frames || state.frames;
        state.mounted = Boolean(info.mounted || state.mounted);
        state.canvasFound = Boolean(info.canvasFound || state.canvasFound);
        state.controlsBound = Boolean(info.controlsBound || state.controlsBound);
        state.usingFallback = false;
        status(`canvas-${value}`);
      }
    });

    state.mounted = Boolean(api && (api.canvas || api.mounted || api.node));
    state.canvasFound = Boolean(api && (api.canvas || api.canvasFound || api.node));
    state.controlsBound = Boolean(api && ("controlsBound" in api ? api.controlsBound : true));
    state.usingFallback = false;

    status("elevation-parent-chain-canvas-mounted");

    return true;
  }

  function bootFallback(mount, label = "canvas authority failed") {
    const fallback = document.createElement("div");
    fallback.dataset.hearthRouteFallback = "true";
    fallback.style.position = "absolute";
    fallback.style.inset = "0";
    fallback.style.display = "grid";
    fallback.style.placeItems = "center";
    fallback.style.color = "rgba(238,246,255,.72)";
    fallback.style.textAlign = "center";
    fallback.style.padding = "22px";
    fallback.style.fontWeight = "800";
    fallback.textContent = `Hearth elevation parent chain loaded, but ${label}. Visible fallback protected.`;

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

    state.elevationLoaded = await loadScript(
      "elevation",
      `/assets/hearth/hearth.elevation.js?v=${KEY}-${Date.now()}`,
      validateElevation
    );

    state.compositionLoaded = await loadScript(
      "composition",
      `/assets/hearth/hearth.composition.js?v=${KEY}-${Date.now()}`,
      validateComposition
    );

    state.tectonicsLoaded = await loadScript(
      "tectonics",
      `/assets/hearth/hearth.tectonics.js?v=${KEY}-${Date.now()}`,
      validateTectonics
    );

    state.hydrologyLoaded = await loadScript(
      "hydrology",
      `/assets/hearth/hearth.hydrology.js?v=${KEY}-${Date.now()}`,
      validateHydrology
    );

    state.materialsLoaded = await loadScript(
      "materials",
      `/assets/hearth/hearth.materials.js?v=${KEY}-${Date.now()}`,
      validateMaterials
    );

    state.canvasLoaded = await loadScript(
      "canvas",
      `/assets/hearth/hearth.canvas.js?v=${KEY}-${Date.now()}`,
      validateCanvas
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

    if (!state.materialsLoaded) {
      bootFallback(mount, "material authority failed");
      return;
    }

    if (!state.canvasLoaded) {
      bootFallback(mount, "canvas authority failed");
      return;
    }

    bootFallback(mount, "mount failed");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
