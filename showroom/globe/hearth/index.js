// /showroom/globe/hearth/index.js
// HEARTH_G2_SEVEN_BODY_MASS_HARD_RENEWAL_ROUTE_TNT_v3
// Full-file replacement.
// Forces the renewed seven-body-mass asset contract and pole-swivel control chain.
// Runtime remains protected.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G2_SEVEN_BODY_MASS_HARD_RENEWAL_ROUTE_TNT_v3";
  const RECEIPT = "HEARTH_G2_SEVEN_BODY_MASS_HARD_RENEWAL_ROUTE_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "HEARTH_HABITABLE_FORMING_ROUTE_CONTROLLER_TNT_v1";
  const KEY = "hearth-g2-seven-body-mass-hard-renewal-v3";

  const EXPECTED = Object.freeze({
    controls: "HEARTH_G2_FREE_DRAG_POLE_SWIVEL_PRESERVATION_CONTROLS_TNT_v2",
    canvas: "HEARTH_G2_CANVAS_POLE_SWIVEL_SEVEN_BODY_CONSUMER_TNT_v2",
    assets: "HEARTH_G2_SEVEN_BODY_MASS_FORMATION_ASSETS_TNT_v2"
  });

  const FILES = [
    { role: "runtime", src: `/assets/hearth/hearth.runtime.js?v=${KEY}`, global: "HEARTH_RUNTIME", validate: (v) => v && typeof v.start === "function" },
    { role: "controls", src: `/assets/hearth/hearth.controls.js?v=${KEY}`, global: "HEARTH_CONTROLS", validate: (v) => v && typeof v.bind === "function" && String(v.contract || "").includes(EXPECTED.controls) },
    { role: "assets", src: `/assets/hearth/hearth.assets.js?v=${KEY}`, global: "HEARTH_ASSETS", validate: (v) => v && typeof v.createTextureCanvas === "function" && String(v.contract || "").includes(EXPECTED.assets) },
    { role: "canvas", src: `/assets/hearth/hearth.canvas.js?v=${KEY}`, global: "HEARTH_CANVAS", validate: (v) => v && typeof v.mount === "function" && String(v.contract || "").includes(EXPECTED.canvas) }
  ];

  const state = { loaded: [], failed: [], mounted: false, canvasFound: false, controlsBound: false, error: "" };

  function status(status) {
    const node = document.getElementById("hearth-route-status") || document.querySelector("[data-hearth-route-status]");
    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthRouteControllerReceipt = RECEIPT;
    document.documentElement.dataset.hearthHardRenewalKey = KEY;
    document.documentElement.dataset.hearthSevenBodyMassFormation = "true";
    document.documentElement.dataset.hearthBodyMassCount = "7";
    document.documentElement.dataset.hearthPoleSwivel = "true";

    if (node) {
      node.textContent = [
        state.mounted ? "Hearth seven-body-mass hard-renewal route ready." : "Hearth seven-body-mass hard-renewal route preparing.",
        `Status ${status}`,
        `Route ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Previous ${PREVIOUS_CONTRACT}`,
        `Hard Renewal Key ${KEY}`,
        `Loaded ${state.loaded.join(",") || "none"}`,
        `Failed ${state.failed.join(",") || "none"}`,
        `Mounted ${state.mounted}`,
        `Canvas found ${state.canvasFound}`,
        `Controls bound ${state.controlsBound}`,
        "Body mass count 7",
        "Pole swivel true",
        "Generated image false",
        "GraphicBox false",
        "Visual pass claimed false",
        state.error ? `Error ${state.error}` : ""
      ].filter(Boolean).join("\n");
    }
  }

  function disposePrior() {
    ["__HEARTH_G4_ROUTE_DISPOSE__", "__HEARTH_HABITABLE_FORMING_ROUTE_DISPOSE__", "__HEARTH_CONTROLS_DISPOSE__", "__HEARTH_CANVAS_DISPOSE__"].forEach((name) => {
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
      'script[src*="/assets/hearth/hearth.assets.js"]',
      'script[src*="/assets/hearth/hearth.canvas.js"]',
      'script[data-hearth-file="true"]'
    ].join(",")).forEach((script) => script.remove());
  }

  function resetGlobals() {
    ["HEARTH_RUNTIME", "HEARTH_CONTROLS", "HEARTH_ASSETS", "HEARTH_CANVAS", "HEARTH_CONTROLS_RECEIPT", "HEARTH_CANVAS_RECEIPT", "HEARTH_ASSETS_RECEIPT", "__HEARTH_INSPECTION_MOTION__"].forEach((name) => {
      try { window[name] = undefined; } catch (_) {}
    });
  }

  function mountNode() {
    let node = document.getElementById("hearthCanvasMount") || document.querySelector("[data-hearth-canvas-mount]");
    if (!node) {
      node = document.createElement("section");
      (document.getElementById("hearth-main") || document.body).appendChild(node);
    }

    node.id = "hearthCanvasMount";
    node.dataset.hearthCanvasMount = "true";
    node.dataset.hearthSevenBodyMassFormation = "true";
    node.dataset.hearthBodyMassCount = "7";
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
      for (const file of FILES) await load(file);

      const runtime = window.HEARTH_RUNTIME;
      const controls = window.HEARTH_CONTROLS;
      const assets = window.HEARTH_ASSETS;
      const canvasAuthority = window.HEARTH_CANVAS;

      const renderer = canvasAuthority.mount(mount, { runtime, assets, routeContract: CONTRACT, routeReceipt: RECEIPT });
      const canvas = renderer?.canvas || mount.querySelector("canvas");

      if (!canvas) throw new Error("Canvas authority mounted, but no canvas was found.");

      controls.bind(canvas, runtime, {
        mount,
        dragRadiansPerScreen: Math.PI * 2.45,
        poleRadiansPerScreen: Math.PI * 1.18,
        maxSpinVelocity: 13,
        wheelSensitivity: 0.003,
        lockDelayMs: 2400,
        poleReturnStrength: 0.06
      });

      if (typeof runtime.start === "function") runtime.start();

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
    if (typeof window.__HEARTH_CONTROLS_DISPOSE__ === "function") window.__HEARTH_CONTROLS_DISPOSE__();
    if (typeof window.__HEARTH_CANVAS_DISPOSE__ === "function") window.__HEARTH_CANVAS_DISPOSE__();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
