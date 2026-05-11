// /showroom/globe/audralia/index.js
// AUDRALIA_PARENT_CHAIN_ALIGNMENT_ROUTE_TNT_v1
// Full-file replacement.
// Route orchestration only.
// Loads new parent authorities first:
// backstory → tectonics → topology
// Then loads existing active chain safely:
// runtime → controls → terrain → assets → canvas
// Does not turn Audralia into Hearth.
// Does not generate images. Does not use GraphicBox. Does not claim visual pass.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PARENT_CHAIN_ALIGNMENT_ROUTE_TNT_v1";
  const RECEIPT = "AUDRALIA_PARENT_CHAIN_ALIGNMENT_ROUTE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_5_FREE_DRAG_POLE_SWIVEL_ROUTE_CONTROLLER_TNT_v1";
  const VERSION = "2026-05-10.audralia-parent-chain-alignment-route-v1";
  const KEY = "audralia-parent-chain-alignment-v1";

  const state = {
    loaded: [],
    failed: [],
    mounted: false,
    canvasFound: false,
    controlsBound: false,
    backstoryLoaded: false,
    tectonicsLoaded: false,
    topologyLoaded: false,
    runtimeLoaded: false,
    controlsLoaded: false,
    terrainLoaded: false,
    assetsLoaded: false,
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
    document.documentElement.dataset.audraliaBackstoryLoaded = String(state.backstoryLoaded);
    document.documentElement.dataset.audraliaTectonicsLoaded = String(state.tectonicsLoaded);
    document.documentElement.dataset.audraliaTopologyLoaded = String(state.topologyLoaded);
    document.documentElement.dataset.audraliaRuntimeLoaded = String(state.runtimeLoaded);
    document.documentElement.dataset.audraliaControlsLoaded = String(state.controlsLoaded);
    document.documentElement.dataset.audraliaTerrainLoaded = String(state.terrainLoaded);
    document.documentElement.dataset.audraliaAssetsLoaded = String(state.assetsLoaded);
    document.documentElement.dataset.audraliaCanvasLoaded = String(state.canvasLoaded);
    document.documentElement.dataset.audraliaMounted = String(state.mounted);
    document.documentElement.dataset.audraliaCanvasFound = String(state.canvasFound);
    document.documentElement.dataset.audraliaControlsBound = String(state.controlsBound);
    document.documentElement.dataset.audraliaOceanDrivenHomeWorld = "true";
    document.documentElement.dataset.audraliaNotHearth = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (node) {
      node.textContent = [
        "Audralia parent-chain alignment route.",
        `Status ${value}`,
        `Route ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Previous ${PREVIOUS_CONTRACT}`,
        `Version ${VERSION}`,
        "Parent order backstory → tectonics → topology → runtime → controls → terrain → assets → canvas",
        `Loaded ${state.loaded.join(",") || "none"}`,
        `Failed ${state.failed.join(",") || "none"}`,
        `Backstory loaded ${state.backstoryLoaded}`,
        `Tectonics loaded ${state.tectonicsLoaded}`,
        `Topology loaded ${state.topologyLoaded}`,
        `Runtime loaded ${state.runtimeLoaded}`,
        `Controls loaded ${state.controlsLoaded}`,
        `Terrain loaded ${state.terrainLoaded}`,
        `Assets loaded ${state.assetsLoaded}`,
        `Canvas loaded ${state.canvasLoaded}`,
        `Mounted ${state.mounted}`,
        `Canvas found ${state.canvasFound}`,
        `Controls bound ${state.controlsBound}`,
        `Fallback ${state.fallback}`,
        `Frames ${state.frames}`,
        "Audralia identity clean ancient ocean-driven home-world true",
        "Generated image false",
        "GraphicBox false",
        "Visual pass claimed false",
        state.error ? `Error ${state.error}` : ""
      ].filter(Boolean).join("\n");
    }
  }

  function loadScript(role, path, validate, required = true) {
    return new Promise((resolve) => {
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
        if (required) state.failed.push(`${role}:load-error`);
        else state.loaded.push(`${role}:held`);
        status(`failed-${role}`);
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  function findMount() {
    return (
      document.getElementById("audraliaCanvasMount") ||
      document.getElementById("audralia-canvas-mount") ||
      document.querySelector("[data-audralia-canvas-mount]") ||
      document.querySelector("[data-canvas-mount='audralia']") ||
      document.querySelector("canvas")?.parentElement ||
      document.getElementById("audralia-main") ||
      document.querySelector("main") ||
      document.body
    );
  }

  function findCanvas(mount) {
    return (
      document.getElementById("audraliaCanvas") ||
      document.getElementById("audralia-canvas") ||
      mount.querySelector("canvas") ||
      document.querySelector("canvas")
    );
  }

  function tryMountKnownCanvas(mount) {
    const candidates = [
      ["AUDRALIA_CANVAS.mount", () => window.AUDRALIA_CANVAS?.mount?.(mount, { routeContract: CONTRACT, routeReceipt: RECEIPT })],
      ["AUDRALIA_CANVAS.init", () => window.AUDRALIA_CANVAS?.init?.(mount, { routeContract: CONTRACT, routeReceipt: RECEIPT })],
      ["AUDRALIA_CANVAS.render", () => window.AUDRALIA_CANVAS?.render?.(mount, { routeContract: CONTRACT, routeReceipt: RECEIPT })],
      ["AudraliaCanvas.mount", () => window.AudraliaCanvas?.mount?.(mount, { routeContract: CONTRACT, routeReceipt: RECEIPT })],
      ["mountAudraliaCanvas", () => window.mountAudraliaCanvas?.(mount, { routeContract: CONTRACT, routeReceipt: RECEIPT })],
      ["renderAudralia", () => window.renderAudralia?.(mount, { routeContract: CONTRACT, routeReceipt: RECEIPT })]
    ];

    for (const [name, fn] of candidates) {
      try {
        const result = fn();
        if (result) {
          state.loaded.push(`mount:${name}`);
          return result;
        }
      } catch (error) {
        state.failed.push(`mount:${name}`);
        state.error = error?.message || String(error);
      }
    }

    return null;
  }

  function bindControls(canvas, mount) {
    const candidates = [
      ["AUDRALIA_CONTROLS.bind", () => window.AUDRALIA_CONTROLS?.bind?.(canvas, { mount, routeContract: CONTRACT })],
      ["AUDRALIA_CONTROLS.mount", () => window.AUDRALIA_CONTROLS?.mount?.(canvas, { mount, routeContract: CONTRACT })],
      ["AUDRALIA_CONTROLS.attach", () => window.AUDRALIA_CONTROLS?.attach?.(canvas, { mount, routeContract: CONTRACT })],
      ["AudraliaControls.bind", () => window.AudraliaControls?.bind?.(canvas, { mount, routeContract: CONTRACT })],
      ["bindAudraliaControls", () => window.bindAudraliaControls?.(canvas, { mount, routeContract: CONTRACT })]
    ];

    for (const [name, fn] of candidates) {
      try {
        const result = fn();
        if (result !== false) {
          state.loaded.push(`controls:${name}`);
          return true;
        }
      } catch (_) {}
    }

    return false;
  }

  function protectedFallback(mount) {
    let fallback = mount.querySelector("[data-audralia-parent-chain-fallback]");

    if (!fallback) {
      fallback = document.createElement("div");
      fallback.dataset.audraliaParentChainFallback = "true";
      fallback.style.border = "1px solid rgba(231,188,105,.34)";
      fallback.style.borderRadius = "18px";
      fallback.style.padding = "14px";
      fallback.style.margin = "12px 0";
      fallback.style.color = "rgba(238,246,255,.78)";
      fallback.style.background = "rgba(4,10,20,.72)";
      fallback.textContent = "Audralia parent chain loaded. Existing canvas mount was not exposed through a known adapter. Visual fallback protected; no generated image, no GraphicBox.";
      mount.appendChild(fallback);
    }

    state.fallback = true;
    state.mounted = true;
    state.canvasFound = Boolean(findCanvas(mount));
    state.controlsBound = false;
  }

  async function boot() {
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

    state.runtimeLoaded = await loadScript(
      "runtime",
      "/assets/audralia/audralia.runtime.js",
      () => Boolean(window.AUDRALIA_RUNTIME || window.AudraliaRuntime || window.audraliaRuntime),
      false
    );

    state.controlsLoaded = await loadScript(
      "controls",
      "/assets/audralia/audralia.controls.js",
      () => Boolean(window.AUDRALIA_CONTROLS || window.AudraliaControls || window.bindAudraliaControls),
      false
    );

    state.terrainLoaded = await loadScript(
      "terrain",
      "/assets/audralia/audralia.terrain.fingers.js",
      () => Boolean(window.AUDRALIA_TERRAIN || window.AUDRALIA_TERRAIN_FINGERS || window.AudraliaTerrain),
      false
    );

    state.assetsLoaded = await loadScript(
      "assets",
      "/assets/audralia/audralia.assets.js",
      () => Boolean(window.AUDRALIA_ASSETS || window.AudraliaAssets || window.audraliaAssets),
      false
    );

    state.canvasLoaded = await loadScript(
      "canvas",
      "/assets/audralia/audralia.canvas.js",
      () => Boolean(window.AUDRALIA_CANVAS || window.AudraliaCanvas || window.mountAudraliaCanvas || window.renderAudralia),
      false
    );

    const mount = findMount();
    const mounted = tryMountKnownCanvas(mount);
    const canvas = findCanvas(mount);

    state.mounted = Boolean(mounted || canvas);
    state.canvasFound = Boolean(canvas || mounted?.canvas);

    if (canvas) {
      state.controlsBound = bindControls(canvas, mount);
      canvas.dataset.audraliaParentChainAligned = "true";
      canvas.dataset.audraliaRouteContract = CONTRACT;
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.visualPassClaimed = "false";
    }

    if (!state.mounted) {
      protectedFallback(mount);
    }

    status(state.mounted ? "ready" : "held");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
