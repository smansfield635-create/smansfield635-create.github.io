// /showroom/globe/audralia/index.js
// AUDRALIA_G1_TERRAIN_ELEVATION_ROUTE_TNT_v4
// Full-file replacement.
// Route orchestration only.
// Loads: backstory → tectonics → topology → elevation → canvas.
// Does not turn Audralia into Hearth.
// Does not generate images. Does not use GraphicBox. Does not claim visual pass.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_TERRAIN_ELEVATION_ROUTE_TNT_v4";
  const RECEIPT = "AUDRALIA_G1_TERRAIN_ELEVATION_ROUTE_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_PARENT_CHAIN_STABILIZATION_ROUTE_TNT_v3";
  const VERSION = "2026-05-10.audralia-g1-terrain-elevation-route-v4";
  const KEY = "audralia-g1-terrain-elevation-v4";

  const state = {
    loaded: [],
    failed: [],
    mounted: false,
    canvasFound: false,
    controlsBound: false,
    backstoryLoaded: false,
    tectonicsLoaded: false,
    topologyLoaded: false,
    elevationLoaded: false,
    canvasLoaded: false,
    frames: 0,
    fallback: false,
    error: ""
  };

  window.__AUDRALIA_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;
  window.__AUDRALIA_ACTIVE_ROUTE_FILE__ = "/showroom/globe/audralia/index.js";

  function status(value) {
    const node =
      document.getElementById("audralia-route-status") ||
      document.querySelector("[data-audralia-route-status]") ||
      document.getElementById("route-status") ||
      document.querySelector("[data-route-status]");

    document.documentElement.dataset.audraliaRouteContract = CONTRACT;
    document.documentElement.dataset.audraliaRouteReceipt = RECEIPT;
    document.documentElement.dataset.audraliaRoutePreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.audraliaRouteVersion = VERSION;
    document.documentElement.dataset.audraliaActiveRouteFile = "/showroom/globe/audralia/index.js";
    document.documentElement.dataset.audraliaParentChainAligned = "true";
    document.documentElement.dataset.audraliaGeneration = "1";
    document.documentElement.dataset.audraliaG1Baseline = "terrain-elevation-stabilizing";
    document.documentElement.dataset.audraliaG2Calibration = "held";
    document.documentElement.dataset.audraliaBackstoryLoaded = String(state.backstoryLoaded);
    document.documentElement.dataset.audraliaTectonicsLoaded = String(state.tectonicsLoaded);
    document.documentElement.dataset.audraliaTopologyLoaded = String(state.topologyLoaded);
    document.documentElement.dataset.audraliaElevationLoaded = String(state.elevationLoaded);
    document.documentElement.dataset.audraliaCanvasLoaded = String(state.canvasLoaded);
    document.documentElement.dataset.audraliaMounted = String(state.mounted);
    document.documentElement.dataset.audraliaCanvasFound = String(state.canvasFound);
    document.documentElement.dataset.audraliaControlsBound = String(state.controlsBound);
    document.documentElement.dataset.audraliaOceanDrivenHomeWorld = "true";
    document.documentElement.dataset.audraliaNotAustralia = "true";
    document.documentElement.dataset.audraliaNotHearth = "true";
    document.documentElement.dataset.audraliaEarthClone = "false";
    document.documentElement.dataset.audraliaTerrainElevationActive = "true";
    document.documentElement.dataset.audraliaNoTrees = "true";
    document.documentElement.dataset.audraliaNoBushes = "true";
    document.documentElement.dataset.audraliaNoForestCanopy = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (node) {
      node.textContent = [
        "Audralia G1 terrain-elevation route.",
        `Status ${value}`,
        `Route ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Previous ${PREVIOUS_CONTRACT}`,
        `Version ${VERSION}`,
        "Parent order backstory → tectonics → topology → elevation → canvas",
        `Loaded ${state.loaded.join(",") || "none"}`,
        `Failed ${state.failed.join(",") || "none"}`,
        `Backstory loaded ${state.backstoryLoaded}`,
        `Tectonics loaded ${state.tectonicsLoaded}`,
        `Topology loaded ${state.topologyLoaded}`,
        `Elevation loaded ${state.elevationLoaded}`,
        `Canvas loaded ${state.canvasLoaded}`,
        `Mounted ${state.mounted}`,
        `Canvas found ${state.canvasFound}`,
        `Controls bound ${state.controlsBound}`,
        `Fallback ${state.fallback}`,
        `Frames ${state.frames}`,
        "Generation 1 terrain elevation stabilizing true",
        "Generation 2 calibration held true",
        "Audralia identity clean ancient ocean-driven home-world true",
        "Audralia not Australia true",
        "Earth clone false",
        "Hearth identity false",
        "No trees true",
        "No bushes true",
        "No forest canopy true",
        "Generated image false",
        "GraphicBox false",
        "Visual pass claimed false",
        state.error ? `Error ${state.error}` : ""
      ].filter(Boolean).join("\n");
    }
  }

  function ensureMount() {
    let mount =
      document.getElementById("audraliaCanvasMount") ||
      document.getElementById("audralia-canvas-mount") ||
      document.querySelector("[data-audralia-canvas-mount]") ||
      document.querySelector("[data-canvas-mount='audralia']");

    if (!mount) {
      const main =
        document.getElementById("audralia-main") ||
        document.querySelector("main") ||
        document.body;

      mount = document.createElement("section");
      mount.id = "audraliaCanvasMount";
      mount.dataset.audraliaCanvasMount = "true";
      mount.setAttribute("aria-label", "Audralia Generation 1 terrain elevation canvas mount");
      mount.style.position = "relative";
      mount.style.width = "min(520px, 100%)";
      mount.style.aspectRatio = "1 / 1";
      mount.style.minHeight = "320px";
      mount.style.margin = "18px auto";
      mount.style.overflow = "hidden";
      mount.style.borderRadius = "32px";
      mount.style.border = "1px solid rgba(231,188,105,.34)";
      mount.style.background = "radial-gradient(circle at 50% 50%, rgba(39,117,155,.25), rgba(3,9,20,.96) 72%)";
      mount.style.touchAction = "none";
      mount.style.userSelect = "none";

      const firstReceipt =
        document.getElementById("audralia-route-status") ||
        document.querySelector("[data-audralia-route-status]") ||
        document.querySelector("pre");

      if (firstReceipt && firstReceipt.parentElement) {
        firstReceipt.parentElement.insertBefore(mount, firstReceipt);
      } else {
        main.appendChild(mount);
      }
    }

    mount.dataset.audraliaParentChainAligned = "true";
    mount.dataset.audraliaRouteContract = CONTRACT;
    mount.dataset.audraliaGeneration = "1";
    mount.dataset.audraliaTerrainElevationActive = "true";
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";

    return mount;
  }

  function loadScript(role, path, validate) {
    return new Promise((resolve) => {
      const existing = document.querySelector(`script[data-audralia-file-role="${role}"]`);
      if (existing) existing.remove();

      const script = document.createElement("script");
      script.src = `${path}?v=${KEY}-${Date.now()}`;
      script.defer = true;
      script.dataset.audraliaFile = "true";
      script.dataset.audraliaFileRole = role;
      script.dataset.audraliaRouteContract = CONTRACT;

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
    if (!window.AUDRALIA_CANVAS || typeof window.AUDRALIA_CANVAS.mount !== "function") {
      return false;
    }

    const api = window.AUDRALIA_CANVAS.mount(mount, {
      routeContract: CONTRACT,
      routeReceipt: RECEIPT,
      generation: 1,
      baseline: "terrain-elevation-stabilizing",
      landReadabilityLift: 0.12,
      elevationActive: true,
      onStatus: (value, info = {}) => {
        state.frames = info.frames || state.frames;
        state.mounted = Boolean(info.mounted);
        state.canvasFound = Boolean(info.canvasFound);
        state.controlsBound = Boolean(info.controlsBound);
        state.fallback = false;
        status(`canvas-${value}`);
      }
    });

    state.mounted = Boolean(api && api.canvas);
    state.canvasFound = Boolean(api && api.canvas);
    state.controlsBound = Boolean(api && api.controlsBound);
    state.fallback = false;

    status("ready");

    return state.mounted;
  }

  function protectedFallback(mount) {
    let fallback = mount.querySelector("[data-audralia-parent-chain-fallback]");

    if (!fallback) {
      fallback = document.createElement("div");
      fallback.dataset.audraliaParentChainFallback = "true";
      fallback.style.position = "absolute";
      fallback.style.inset = "0";
      fallback.style.display = "grid";
      fallback.style.placeItems = "center";
      fallback.style.padding = "18px";
      fallback.style.color = "rgba(238,246,255,.78)";
      fallback.style.textAlign = "center";
      fallback.style.fontWeight = "800";
      fallback.textContent = "Audralia G1 terrain elevation loaded, but canvas authority failed. Visible fallback protected.";
      mount.appendChild(fallback);
    }

    state.fallback = true;
    state.mounted = true;
    state.canvasFound = false;
    state.controlsBound = false;
    status("fallback");
  }

  async function boot() {
    const mount = ensureMount();

    status("booting");

    state.backstoryLoaded = await loadScript(
      "backstory",
      "/assets/audralia/audralia.backstory.js",
      () => Boolean(window.AUDRALIA_BACKSTORY && typeof window.AUDRALIA_BACKSTORY.sampleIdentity === "function")
    );

    state.tectonicsLoaded = await loadScript(
      "tectonics",
      "/assets/audralia/audralia.tectonics.js",
      () => Boolean(window.AUDRALIA_TECTONICS && typeof window.AUDRALIA_TECTONICS.sampleTectonics === "function")
    );

    state.topologyLoaded = await loadScript(
      "topology",
      "/assets/audralia/audralia.topology.js",
      () => Boolean(window.AUDRALIA_TOPOLOGY && typeof window.AUDRALIA_TOPOLOGY.sampleTopology === "function")
    );

    state.elevationLoaded = await loadScript(
      "elevation",
      "/assets/audralia/audralia.elevation.js",
      () => Boolean(window.AUDRALIA_ELEVATION && typeof window.AUDRALIA_ELEVATION.sampleElevation === "function")
    );

    state.canvasLoaded = await loadScript(
      "canvas",
      "/assets/audralia/audralia.canvas.js",
      () => Boolean(window.AUDRALIA_CANVAS && typeof window.AUDRALIA_CANVAS.mount === "function")
    );

    try {
      if (state.canvasLoaded && bootCanvas(mount)) return;
    } catch (error) {
      state.failed.push("canvas:mount-error");
      state.error = error?.message || String(error);
    }

    protectedFallback(mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
