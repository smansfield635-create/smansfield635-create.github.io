// /showroom/globe/hearth/index.js
// HEARTH_TERRAIN_EXTENSION_ROUTE_TNT_v6
// Full-file replacement.
// Loads terrain extension before assets.
// Preserves runtime, controls, and canvas chain.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_TERRAIN_EXTENSION_ROUTE_TNT_v6";
  const RECEIPT = "HEARTH_TERRAIN_EXTENSION_ROUTE_RECEIPT_v6";
  const PREVIOUS_CONTRACT = "HEARTH_ASYMMETRIC_LANDMASS_NATURALIZATION_ROUTE_TNT_v5";
  const KEY = "hearth-terrain-extension-fingerprint-authority-v6";

  const EXPECTED = Object.freeze({
    runtime: "HEARTH",
    terrainExtension: "HEARTH_TERRAIN_EXTENSION_FINGERPRINT_AUTHORITY_TNT_v1",
    assets: "HEARTH_ASSETS_TERRAIN_EXTENSION_BRIDGE_TNT_v5",
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
      validate: (value) =>
        value &&
        typeof value.sampleTerrain === "function" &&
        typeof value.getStatus === "function" &&
        String(value.contract || "").includes(EXPECTED.terrainExtension) &&
        value.getStatus().terrainFingerprintCount === 7 &&
        value.getStatus().eachBodyHasUniqueTerrain === true
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
          status.terrainFingerprintCount === 7 &&
          status.eachBodyHasUniqueTerrain === true &&
          status.assetsConsumeTerrainExtension === true &&
          status.twoBodyRead === false &&
          status.symmetryReduced === true
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
    document.documentElement.dataset.hearthTerrainExtensionLoaded = String(state.loaded.includes("terrainExtension"));
    document.documentElement.dataset.hearthTerrainFingerprintCount = "7";
    document.documentElement.dataset.hearthEachBodyHasUniqueTerrain = "true";
    document.documentElement.dataset.hearthAssetsConsumeTerrainExtension = "true";
    document.documentElement.dataset.hearthBodyMassCount = "7";
    document.documentElement.dataset.hearthTwoBodyRead = "false";
    document.documentElement.dataset.hearthSymmetryReduced = "true";
    document.documentElement.dataset.hearthPoleSwivel = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (node) {
      node.textContent = [
        state.mounted
          ? "Hearth terrain-extension route ready."
          : "Hearth terrain-extension route preparing.",
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
        "Terrain extension loaded true",
        "Terrain fingerprint count 7",
        "Each body has unique terrain true",
        "Assets consume terrain extension true",
        "Body mass count 7",
        "Two-body read false",
        "Symmetry reduced true",
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
    node.dataset.hearthTerrainExtensionLoaded = "true";
    node.dataset.hearthTerrainFingerprintCount = "7";
    node.dataset.hearthEachBodyHasUniqueTerrain = "true";
    node.dataset.hearthAssetsConsumeTerrainExtension = "true";
    node.dataset.hearthBodyMassCount = "7";
    node.dataset.hearthTwoBodyRead = "false";
    node.dataset.hearthSymmetryReduced = "true";
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

      canvas.dataset.hearthTerrainExtensionLoaded = "true";
      canvas.dataset.hearthTerrainFingerprintCount = "7";
      canvas.dataset.hearthEachBodyHasUniqueTerrain = "true";
      canvas.dataset.hearthAssetsConsumeTerrainExtension = "true";
      canvas.dataset.hearthBodyMassCount = "7";
      canvas.dataset.hearthTwoBodyRead = "false";
      canvas.dataset.hearthSymmetryReduced = "true";

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
