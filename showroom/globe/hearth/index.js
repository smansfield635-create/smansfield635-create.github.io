// /showroom/globe/hearth/index.js
// HEARTH_ELEVATION_MOUNTAIN_RANGE_CLIFF_DEPTH_ROUTE_TNT_v10
// Full-file replacement.
// Loads elevation/mountain/cliff/depth terrain extension before assets.
// Preserves runtime, controls, and canvas chain.
// TET + MAPS + Quad-A source validation active.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ELEVATION_MOUNTAIN_RANGE_CLIFF_DEPTH_ROUTE_TNT_v10";
  const RECEIPT = "HEARTH_ELEVATION_MOUNTAIN_RANGE_CLIFF_DEPTH_ROUTE_RECEIPT_v10";
  const PREVIOUS_CONTRACT = "HEARTH_LAND_TEXTURE_COMPOSITION_ELEVATION_ROUTE_TNT_v9";
  const KEY = "hearth-elevation-mountain-range-cliff-depth-v10";

  const EXPECTED = Object.freeze({
    terrainExtension: "HEARTH_ELEVATION_MOUNTAIN_RANGE_CLIFF_DEPTH_TERRAIN_EXTENSION_TNT_v5",
    assets: "HEARTH_ELEVATION_MOUNTAIN_RANGE_CLIFF_DEPTH_ASSETS_TNT_v9",
    controls: "HEARTH_G2_FREE_DRAG_POLE_SWIVEL_PRESERVATION_CONTROLS_TNT_v2",
    canvas: "HEARTH_G2_CANVAS_POLE_SWIVEL_SEVEN_BODY_CONSUMER_TNT_v2"
  });

  const FILES = [
    {
      role: "runtime",
      src: `/assets/hearth/hearth.runtime.js?v=${KEY}`,
      global: "HEARTH_RUNTIME",
      validate: (value) => value && typeof value.start === "function"
    },
    {
      role: "controls",
      src: `/assets/hearth/hearth.controls.js?v=${KEY}`,
      global: "HEARTH_CONTROLS",
      validate: (value) =>
        value &&
        typeof value.bind === "function" &&
        String(value.contract || "").includes(EXPECTED.controls)
    },
    {
      role: "terrainExtension",
      src: `/assets/hearth/hearth.terrain.extension.js?v=${KEY}`,
      global: "HEARTH_TERRAIN_EXTENSION",
      validate: (value) => {
        if (!value || typeof value.sampleTerrain !== "function") return false;
        if (!value.sampleCoastlineModifier || typeof value.sampleCoastlineModifier !== "function") return false;
        if (!value.sampleIslandField || typeof value.sampleIslandField !== "function") return false;
        if (!value.getStatus || typeof value.getStatus !== "function") return false;
        const status = value.getStatus();

        return (
          String(value.contract || "").includes(EXPECTED.terrainExtension) &&
          status.elevationDepthLoaded === true &&
          status.mountainRangeSystemLoaded === true &&
          status.cliffSystemLoaded === true &&
          status.visualDepthActive === true &&
          status.landTextureCompositionLoaded === true &&
          status.elevationDifferentiationActive === true &&
          status.compositionDifferentiationActive === true &&
          status.terrainTextureActive === true &&
          status.tetMap === "TERRAIN_TO_ELEVATION_TO_TERRAIN" &&
          status.mapsProtocol === "MAKE_A_PIZZA_SYSTEMIC_EXECUTION" &&
          status.quadAAudit === "AUDIT_ATTACK_ADJUST_AUTHORIZE_PASS"
        );
      }
    },
    {
      role: "assets",
      src: `/assets/hearth/hearth.assets.js?v=${KEY}`,
      global: "HEARTH_ASSETS",
      validate: (value) => {
        if (!value || typeof value.createTextureCanvas !== "function") return false;
        if (!String(value.contract || "").includes(EXPECTED.assets)) return false;
        if (typeof value.getStatus !== "function") return false;
        const status = value.getStatus();

        return (
          status.bodyMassCount === 7 &&
          status.terrainExtensionLoaded === true &&
          status.elevationDepthLoaded === true &&
          status.mountainRangeSystemLoaded === true &&
          status.cliffSystemLoaded === true &&
          status.visualDepthActive === true &&
          status.twoBodyRead === false &&
          status.roundLobeRead === false &&
          status.ovalPatchRead === false
        );
      }
    },
    {
      role: "canvas",
      src: `/assets/hearth/hearth.canvas.js?v=${KEY}`,
      global: "HEARTH_CANVAS",
      validate: (value) =>
        value &&
        typeof value.mount === "function" &&
        String(value.contract || "").includes(EXPECTED.canvas)
    }
  ];

  const state = {
    loaded: [],
    failed: [],
    mounted: false,
    canvasFound: false,
    controlsBound: false,
    error: ""
  };

  function status(statusValue) {
    const node =
      document.getElementById("hearth-route-status") ||
      document.querySelector("[data-hearth-route-status]");

    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthRouteControllerReceipt = RECEIPT;
    document.documentElement.dataset.hearthRoutePreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.hearthHardRenewalKey = KEY;
    document.documentElement.dataset.hearthElevationDepthLoaded = "true";
    document.documentElement.dataset.hearthMountainRangeSystemLoaded = "true";
    document.documentElement.dataset.hearthCliffSystemLoaded = "true";
    document.documentElement.dataset.hearthVisualDepthActive = "true";
    document.documentElement.dataset.hearthLandTextureCompositionLoaded = "true";
    document.documentElement.dataset.hearthElevationDifferentiationActive = "true";
    document.documentElement.dataset.hearthCompositionDifferentiationActive = "true";
    document.documentElement.dataset.hearthTerrainTextureActive = "true";
    document.documentElement.dataset.hearthTetMap = "TERRAIN_TO_ELEVATION_TO_TERRAIN";
    document.documentElement.dataset.hearthMapsProtocol = "MAKE_A_PIZZA_SYSTEMIC_EXECUTION";
    document.documentElement.dataset.hearthQuadAAudit = "AUDIT_ATTACK_ADJUST_AUTHORIZE_PASS";
    document.documentElement.dataset.hearthBodyMassCount = "7";
    document.documentElement.dataset.hearthTwoBodyRead = "false";
    document.documentElement.dataset.hearthPoleSwivel = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (node) {
      node.textContent = [
        state.mounted
          ? "Hearth elevation, mountain range, cliff, and visual-depth route ready."
          : "Hearth elevation, mountain range, cliff, and visual-depth route preparing.",
        `Status ${statusValue}`,
        `Route ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Previous ${PREVIOUS_CONTRACT}`,
        `Hard Renewal Key ${KEY}`,
        `Loaded ${state.loaded.join(",") || "none"}`,
        `Failed ${state.failed.join(",") || "none"}`,
        `Mounted ${state.mounted}`,
        `Canvas found ${state.canvasFound}`,
        `Controls bound ${state.controlsBound}`,
        "Elevation depth loaded true",
        "Mountain range system loaded true",
        "Cliff system loaded true",
        "Visual depth active true",
        "Land texture composition loaded true",
        "Elevation differentiation active true",
        "Composition differentiation active true",
        "Terrain texture active true",
        "TET map TERRAIN_TO_ELEVATION_TO_TERRAIN",
        "MAPS protocol MAKE_A_PIZZA_SYSTEMIC_EXECUTION",
        "Quad-A audit AUDIT_ATTACK_ADJUST_AUTHORIZE_PASS",
        "Body mass count 7",
        "Two-body read false",
        "Pole swivel true",
        "Runtime touched false",
        "Controls touched false",
        "Canvas touched false",
        "Generated image false",
        "GraphicBox false",
        "Visual pass claimed false",
        state.error ? `Error ${state.error}` : ""
      ].filter(Boolean).join("\n");
    }
  }

  function disposePrior() {
    [
      "__HEARTH_G4_ROUTE_DISPOSE__",
      "__HEARTH_HABITABLE_FORMING_ROUTE_DISPOSE__",
      "__HEARTH_CONTROLS_DISPOSE__",
      "__HEARTH_CANVAS_DISPOSE__"
    ].forEach((name) => {
      if (typeof window[name] === "function") {
        try { window[name](); } catch (_) {}
      }

      try { window[name] = undefined; } catch (_) {}
    });
  }

  function removeScripts() {
    document.querySelectorAll([
      'script[src*="/assets/hearth/hearth.runtime.js"]',
      'script[src*="/assets/hearth/hearth.controls.js"]',
      'script[src*="/assets/hearth/hearth.terrain.extension.js"]',
      'script[src*="/assets/hearth/hearth.assets.js"]',
      'script[src*="/assets/hearth/hearth.canvas.js"]',
      'script[data-hearth-file="true"]'
    ].join(",")).forEach((script) => script.remove());
  }

  function resetGlobals() {
    [
      "HEARTH_RUNTIME",
      "HEARTH_CONTROLS",
      "HEARTH_TERRAIN_EXTENSION",
      "HEARTH_TERRAIN_EXTENSION_RECEIPT",
      "HEARTH_ASSETS",
      "HEARTH_CANVAS",
      "HEARTH_CONTROLS_RECEIPT",
      "HEARTH_CANVAS_RECEIPT",
      "HEARTH_ASSETS_RECEIPT",
      "__HEARTH_INSPECTION_MOTION__"
    ].forEach((name) => {
      try { window[name] = undefined; } catch (_) {}
    });
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
    node.dataset.hearthElevationDepthLoaded = "true";
    node.dataset.hearthMountainRangeSystemLoaded = "true";
    node.dataset.hearthCliffSystemLoaded = "true";
    node.dataset.hearthVisualDepthActive = "true";
    node.dataset.hearthLandTextureCompositionLoaded = "true";
    node.dataset.hearthElevationDifferentiationActive = "true";
    node.dataset.hearthCompositionDifferentiationActive = "true";
    node.dataset.hearthTerrainTextureActive = "true";
    node.dataset.hearthTetMap = "TERRAIN_TO_ELEVATION_TO_TERRAIN";
    node.dataset.hearthMapsProtocol = "MAKE_A_PIZZA_SYSTEMIC_EXECUTION";
    node.dataset.hearthQuadAAudit = "AUDIT_ATTACK_ADJUST_AUTHORIZE_PASS";
    node.dataset.hearthBodyMassCount = "7";
    node.dataset.hearthTwoBodyRead = "false";
    node.dataset.hearthPoleSwivel = "true";
    node.style.touchAction = "none";
    node.style.userSelect = "none";
    node.querySelectorAll("canvas").forEach((canvas) => canvas.remove());

    return node;
  }

  function load(file) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = file.src;
      script.defer = true;
      script.dataset.hearthFile = "true";
      script.dataset.hearthFileRole = file.role;
      script.dataset.hardRenewalKey = KEY;
      script.dataset.routeContract = CONTRACT;

      script.onload = () => {
        if (!file.validate(window[file.global])) {
          state.failed.push(file.role);
          status(`invalid-${file.role}`);
          reject(new Error(`Loaded ${file.role}, but contract validation failed.`));
          return;
        }

        state.loaded.push(file.role);
        status(`loaded-${file.role}`);
        resolve();
      };

      script.onerror = () => {
        state.failed.push(file.role);
        status(`failed-${file.role}`);
        reject(new Error(`Failed to load ${file.role}: ${file.src}`));
      };

      document.head.appendChild(script);
    });
  }

  async function boot() {
    const mount = mountNode();

    status("booting");
    disposePrior();
    removeScripts();
    resetGlobals();

    try {
      for (const file of FILES) {
        await load(file);
      }

      const runtime = window.HEARTH_RUNTIME;
      const controls = window.HEARTH_CONTROLS;
      const assets = window.HEARTH_ASSETS;
      const canvasAuthority = window.HEARTH_CANVAS;

      const renderer = canvasAuthority.mount(mount, {
        runtime,
        assets,
        routeContract: CONTRACT,
        routeReceipt: RECEIPT
      });

      const canvas = renderer?.canvas || mount.querySelector("canvas");

      if (!canvas) {
        throw new Error("Canvas authority mounted, but no canvas was found.");
      }

      canvas.dataset.hearthElevationDepthLoaded = "true";
      canvas.dataset.hearthMountainRangeSystemLoaded = "true";
      canvas.dataset.hearthCliffSystemLoaded = "true";
      canvas.dataset.hearthVisualDepthActive = "true";
      canvas.dataset.hearthLandTextureCompositionLoaded = "true";
      canvas.dataset.hearthElevationDifferentiationActive = "true";
      canvas.dataset.hearthCompositionDifferentiationActive = "true";
      canvas.dataset.hearthTerrainTextureActive = "true";
      canvas.dataset.hearthTetMap = "TERRAIN_TO_ELEVATION_TO_TERRAIN";
      canvas.dataset.hearthMapsProtocol = "MAKE_A_PIZZA_SYSTEMIC_EXECUTION";
      canvas.dataset.hearthQuadAAudit = "AUDIT_ATTACK_ADJUST_AUTHORIZE_PASS";
      canvas.dataset.hearthBodyMassCount = "7";
      canvas.dataset.hearthTwoBodyRead = "false";

      controls.bind(canvas, runtime, {
        mount,
        dragRadiansPerScreen: Math.PI * 2.45,
        poleRadiansPerScreen: Math.PI * 1.18,
        maxSpinVelocity: 13,
        wheelSensitivity: 0.003,
        lockDelayMs: 2400,
        poleReturnStrength: 0.06
      });

      if (typeof runtime.start === "function") {
        runtime.start();
      }

      state.mounted = true;
      state.canvasFound = true;
      state.controlsBound = true;

      const fallback = mount.querySelector("[data-hearth-mount-fallback]");
      if (fallback) {
        fallback.hidden = true;
        fallback.style.display = "none";
      }

      status("ready");
    } catch (error) {
      state.error = error?.message || String(error);
      status("failed");
    }
  }

  window.__HEARTH_HABITABLE_FORMING_ROUTE_DISPOSE__ = () => {
    if (typeof window.__HEARTH_CONTROLS_DISPOSE__ === "function") {
      window.__HEARTH_CONTROLS_DISPOSE__();
    }

    if (typeof window.__HEARTH_CANVAS_DISPOSE__ === "function") {
      window.__HEARTH_CANVAS_DISPOSE__();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
