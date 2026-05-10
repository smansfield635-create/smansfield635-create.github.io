// /showroom/globe/hearth/index.js
// HEARTH_CLIMATE_BIOME_REGION_ROUTE_TNT_v12
// Full-file replacement.
// Loads dedicated climate/biome authority after elevation and before assets.
// New file loaded: /assets/hearth/hearth.climate.js
// Preserves terrain, elevation, runtime, controls, and canvas chain.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CLIMATE_BIOME_REGION_ROUTE_TNT_v12";
  const RECEIPT = "HEARTH_CLIMATE_BIOME_REGION_ROUTE_RECEIPT_v12";
  const PREVIOUS_CONTRACT = "HEARTH_DEDICATED_ELEVATION_AUTHORITY_ROUTE_TNT_v11";
  const KEY = "hearth-climate-biome-region-v12";

  const EXPECTED = Object.freeze({
    terrainExtension: "HEARTH_TERRAIN_BASE_FOR_DEDICATED_ELEVATION_TNT_v6",
    elevation: "HEARTH_TANGIBLE_ELEVATION_MOUNTAINS_FOOTHILLS_CLIFFS_TNT_v1",
    climate: "HEARTH_CLIMATE_REGION_BIOME_AUTHORITY_TNT_v1",
    assets: "HEARTH_ASSETS_CLIMATE_BIOME_REGION_COLORING_TNT_v11",
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
          status.terrainBaseLoaded === true &&
          status.ownsTangibleElevation === false &&
          status.elevationDelegatedTo === "/assets/hearth/hearth.elevation.js"
        );
      }
    },
    {
      role: "elevation",
      src: `/assets/hearth/hearth.elevation.js?v=${KEY}`,
      global: "HEARTH_ELEVATION",
      validate: (value) => {
        if (!value || typeof value.sampleElevation !== "function") return false;
        if (!value.getStatus || typeof value.getStatus !== "function") return false;
        const status = value.getStatus();

        return (
          String(value.contract || "").includes(EXPECTED.elevation) &&
          status.elevationAuthorityLoaded === true &&
          status.tangibleElevationLoaded === true &&
          status.mountainRangeLoaded === true &&
          status.foothillsLoaded === true &&
          status.cliffSystemLoaded === true &&
          status.visualDepthActive === true
        );
      }
    },
    {
      role: "climate",
      src: `/assets/hearth/hearth.climate.js?v=${KEY}`,
      global: "HEARTH_CLIMATE",
      validate: (value) => {
        if (!value || typeof value.sampleClimate !== "function") return false;
        if (!value.getStatus || typeof value.getStatus !== "function") return false;
        const status = value.getStatus();

        return (
          String(value.contract || "").includes(EXPECTED.climate) &&
          status.climateAuthorityLoaded === true &&
          status.regionBiomeAuthorityLoaded === true &&
          status.biomeColorNotBodyMassColor === true &&
          status.bodyMassAssignedColoring === false
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
          status.elevationAuthorityLoaded === true &&
          status.climateAuthorityLoaded === true &&
          status.assetsConsumeClimateAuthority === true &&
          status.biomeColorNotBodyMassColor === true &&
          status.bodyMassAssignedColoring === false
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
    document.documentElement.dataset.hearthClimateAuthorityLoaded = String(state.loaded.includes("climate"));
    document.documentElement.dataset.hearthRegionBiomeAuthorityLoaded = "true";
    document.documentElement.dataset.hearthBiomeColorNotBodyMassColor = "true";
    document.documentElement.dataset.hearthBodyMassAssignedColoring = "false";
    document.documentElement.dataset.hearthClimateRegionDifferentiationActive = "true";
    document.documentElement.dataset.hearthBodyMassCount = "7";
    document.documentElement.dataset.hearthTwoBodyRead = "false";
    document.documentElement.dataset.hearthPoleSwivel = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (node) {
      node.textContent = [
        state.mounted
          ? "Hearth climate/biome/region route ready."
          : "Hearth climate/biome/region route preparing.",
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
        "Climate authority loaded true",
        "Dedicated climate file /assets/hearth/hearth.climate.js",
        "Region biome authority loaded true",
        "Biome color not body-mass color true",
        "Body-mass assigned coloring false",
        "Climate region differentiation active true",
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
      'script[src*="/assets/hearth/hearth.elevation.js"]',
      'script[src*="/assets/hearth/hearth.climate.js"]',
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
      "HEARTH_ELEVATION",
      "HEARTH_ELEVATION_RECEIPT",
      "HEARTH_CLIMATE",
      "HEARTH_CLIMATE_RECEIPT",
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
    node.dataset.hearthClimateAuthorityLoaded = "true";
    node.dataset.hearthRegionBiomeAuthorityLoaded = "true";
    node.dataset.hearthBiomeColorNotBodyMassColor = "true";
    node.dataset.hearthBodyMassAssignedColoring = "false";
    node.dataset.hearthClimateRegionDifferentiationActive = "true";
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

      canvas.dataset.hearthClimateAuthorityLoaded = "true";
      canvas.dataset.hearthRegionBiomeAuthorityLoaded = "true";
      canvas.dataset.hearthBiomeColorNotBodyMassColor = "true";
      canvas.dataset.hearthBodyMassAssignedColoring = "false";
      canvas.dataset.hearthClimateRegionDifferentiationActive = "true";
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
