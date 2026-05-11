// /showroom/globe/audralia/index.js
// AUDRALIA_GRATITUDE_PLAINS_DESERTS_MARSHES_ROUTE_TNT_v10
// Full-file replacement.
// Route orchestration only.
// Loads: backstory → summits → tectonics → topology → elevation → beaches → landrise → mountains → groundcover → canvas.
// Adds plains, deserts, marshes, and more attached landmass.
// Compatibility markers:
// AUDRALIA_GRATITUDE_MOUNTAIN_RANGE_COMMUNITY_ROUTE_TNT_v9
// AUDRALIA_GRATITUDE_PRIMARY_SUMMIT_ROUTE_TNT_v8
// AUDRALIA_G1_TERRAIN_MASS_ATTACHMENT_ROUTE_TNT_v7
// AUDRALIA_G1_RAISED_TERRAIN_BEHIND_BEACH_ROUTE_TNT_v6
// AUDRALIA_G1_BEACH_TO_LAND_RISE_ROUTE_TNT_v5
// No trees. No bushes. No forest canopy.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_GRATITUDE_PLAINS_DESERTS_MARSHES_ROUTE_TNT_v10";
  const RECEIPT = "AUDRALIA_GRATITUDE_PLAINS_DESERTS_MARSHES_ROUTE_RECEIPT_v10";
  const PREVIOUS_CONTRACT = "AUDRALIA_GRATITUDE_MOUNTAIN_RANGE_COMMUNITY_ROUTE_TNT_v9";
  const VERSION = "2026-05-10.audralia-gratitude-plains-deserts-marshes-route-v10";
  const KEY = "audralia-gratitude-plains-deserts-marshes-v10";

  const files = [
    ["backstory", "/assets/audralia/audralia.backstory.js", () => window.AUDRALIA_BACKSTORY && typeof window.AUDRALIA_BACKSTORY.sampleIdentity === "function"],
    ["summits", "/assets/audralia/audralia.summits.js", () => window.AUDRALIA_SUMMITS && typeof window.AUDRALIA_SUMMITS.sampleSummit === "function"],
    ["tectonics", "/assets/audralia/audralia.tectonics.js", () => window.AUDRALIA_TECTONICS && typeof window.AUDRALIA_TECTONICS.sampleTectonics === "function"],
    ["topology", "/assets/audralia/audralia.topology.js", () => window.AUDRALIA_TOPOLOGY && typeof window.AUDRALIA_TOPOLOGY.sampleTopology === "function"],
    ["elevation", "/assets/audralia/audralia.elevation.js", () => window.AUDRALIA_ELEVATION && typeof window.AUDRALIA_ELEVATION.sampleElevation === "function"],
    ["beaches", "/assets/audralia/audralia.beaches.js", () => window.AUDRALIA_BEACHES && typeof window.AUDRALIA_BEACHES.sampleBeach === "function"],
    ["landrise", "/assets/audralia/audralia.landrise.js", () => window.AUDRALIA_LANDRISE && typeof window.AUDRALIA_LANDRISE.sampleLandRise === "function"],
    ["mountains", "/assets/audralia/audralia.mountains.js", () => window.AUDRALIA_MOUNTAINS && typeof window.AUDRALIA_MOUNTAINS.sampleMountains === "function"],
    ["groundcover", "/assets/audralia/audralia.groundcover.js", () => window.AUDRALIA_GROUNDCOVER && typeof window.AUDRALIA_GROUNDCOVER.sampleGroundcover === "function"],
    ["canvas", "/assets/audralia/audralia.canvas.js", () => window.AUDRALIA_CANVAS && typeof window.AUDRALIA_CANVAS.mount === "function"]
  ];

  const state = {
    loaded: [],
    failed: [],
    mounted: false,
    canvasFound: false,
    controlsBound: false,
    frames: 0,
    fallback: false,
    error: ""
  };

  window.__AUDRALIA_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;
  window.__AUDRALIA_ACTIVE_ROUTE_FILE__ = "/showroom/globe/audralia/index.js";

  function setDataset() {
    document.documentElement.dataset.audraliaRouteContract = CONTRACT;
    document.documentElement.dataset.audraliaRouteReceipt = RECEIPT;
    document.documentElement.dataset.audraliaRoutePreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.audraliaRouteVersion = VERSION;
    document.documentElement.dataset.audraliaActiveRouteFile = "/showroom/globe/audralia/index.js";
    document.documentElement.dataset.audraliaGeneration = "1";
    document.documentElement.dataset.audraliaParentChainAligned = "true";
    document.documentElement.dataset.audraliaG1Baseline = "gratitude-plains-deserts-marshes-more-landmass-stabilizing";
    document.documentElement.dataset.audraliaG2Calibration = "held";

    for (const [role] of files) {
      document.documentElement.dataset[`audralia${role[0].toUpperCase()}${role.slice(1)}Loaded`] = String(state.loaded.includes(role));
    }

    document.documentElement.dataset.audraliaPrimarySummit = "Gratitude";
    document.documentElement.dataset.audraliaNineWithinNine = "true";
    document.documentElement.dataset.audraliaBookSummitLaw = "true";
    document.documentElement.dataset.audraliaHighMountains = "true";
    document.documentElement.dataset.audraliaMountainRanges = "true";
    document.documentElement.dataset.audraliaMountainCommunities = "true";
    document.documentElement.dataset.audraliaPlains = "true";
    document.documentElement.dataset.audraliaDeserts = "true";
    document.documentElement.dataset.audraliaMarshes = "true";
    document.documentElement.dataset.audraliaMoreLandmass = "true";
    document.documentElement.dataset.audraliaGenericSummitPlaceholder = "false";
    document.documentElement.dataset.audraliaMounted = String(state.mounted);
    document.documentElement.dataset.audraliaCanvasFound = String(state.canvasFound);
    document.documentElement.dataset.audraliaControlsBound = String(state.controlsBound);
    document.documentElement.dataset.audraliaBeachRemainsSeaLevel = "true";
    document.documentElement.dataset.audraliaRaisedTerrainBehindBeach = "true";
    document.documentElement.dataset.audraliaTerrainMassAttached = "true";
    document.documentElement.dataset.audraliaTerrainAboveSeaLevel = "true";
    document.documentElement.dataset.audraliaOceanDrivenHomeWorld = "true";
    document.documentElement.dataset.audraliaNotAustralia = "true";
    document.documentElement.dataset.audraliaNotHearth = "true";
    document.documentElement.dataset.audraliaEarthClone = "false";
    document.documentElement.dataset.audraliaTrees = "false";
    document.documentElement.dataset.audraliaBushes = "false";
    document.documentElement.dataset.audraliaForestCanopy = "false";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  function status(value) {
    setDataset();

    const node =
      document.getElementById("audralia-route-status") ||
      document.querySelector("[data-audralia-route-status]") ||
      document.getElementById("route-status") ||
      document.querySelector("[data-route-status]");

    if (node) {
      node.textContent = [
        "Audralia Gratitude plains/deserts/marshes route.",
        `Status ${value}`,
        `Route ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Previous ${PREVIOUS_CONTRACT}`,
        `Version ${VERSION}`,
        "Compatibility AUDRALIA_GRATITUDE_MOUNTAIN_RANGE_COMMUNITY_ROUTE_TNT_v9",
        "Compatibility AUDRALIA_GRATITUDE_PRIMARY_SUMMIT_ROUTE_TNT_v8",
        "Compatibility AUDRALIA_G1_TERRAIN_MASS_ATTACHMENT_ROUTE_TNT_v7",
        "Compatibility AUDRALIA_G1_RAISED_TERRAIN_BEHIND_BEACH_ROUTE_TNT_v6",
        "Compatibility AUDRALIA_G1_BEACH_TO_LAND_RISE_ROUTE_TNT_v5",
        "Parent order backstory → summits → tectonics → topology → elevation → beaches → landrise → mountains → groundcover → canvas",
        "Primary Summit Gratitude",
        "Internal Summits Gratitude, Generosity, Dependability, Accountability, Forgiveness, Humility, Self-Control, Patience, Purity",
        "High mountains true",
        "Mountain ranges true",
        "Mountain communities true",
        "Plains true",
        "Deserts true",
        "Marshes true",
        "More landmass true",
        "Nine within nine true",
        "Book summit law true",
        `Loaded ${state.loaded.join(",") || "none"}`,
        `Failed ${state.failed.join(",") || "none"}`,
        `Mounted ${state.mounted}`,
        `Canvas found ${state.canvasFound}`,
        `Controls bound ${state.controlsBound}`,
        `Fallback ${state.fallback}`,
        `Frames ${state.frames}`,
        "Beach remains sea level true",
        "Raised terrain behind beach true",
        "Terrain mass attached true",
        "Terrain above sea level true",
        "Trees false",
        "Bushes false",
        "Forest canopy false",
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
      const main = document.getElementById("audralia-main") || document.querySelector("main") || document.body;

      mount = document.createElement("section");
      mount.id = "audraliaCanvasMount";
      mount.dataset.audraliaCanvasMount = "true";
      mount.setAttribute("aria-label", "Audralia Gratitude plains deserts marshes canvas mount");
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

      main.appendChild(mount);
    }

    mount.dataset.audraliaRouteContract = CONTRACT;
    mount.dataset.audraliaPrimarySummit = "Gratitude";
    mount.dataset.audraliaNineWithinNine = "true";
    mount.dataset.audraliaBookSummitLaw = "true";
    mount.dataset.audraliaHighMountains = "true";
    mount.dataset.audraliaMountainRanges = "true";
    mount.dataset.audraliaMountainCommunities = "true";
    mount.dataset.audraliaPlains = "true";
    mount.dataset.audraliaDeserts = "true";
    mount.dataset.audraliaMarshes = "true";
    mount.dataset.audraliaMoreLandmass = "true";
    mount.dataset.audraliaBeachRemainsSeaLevel = "true";
    mount.dataset.audraliaRaisedTerrainBehindBeach = "true";
    mount.dataset.audraliaTerrainMassAttached = "true";
    mount.dataset.audraliaTerrainAboveSeaLevel = "true";
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";

    return mount;
  }

  function loadScript(role, path, validate) {
    return new Promise((resolve) => {
      document.querySelectorAll(`script[data-audralia-file-role="${role}"]`).forEach((node) => node.remove());

      const script = document.createElement("script");
      script.src = `${path}?v=${KEY}-${Date.now()}`;
      script.defer = true;
      script.dataset.audraliaFile = "true";
      script.dataset.audraliaFileRole = role;
      script.dataset.audraliaRouteContract = CONTRACT;

      script.onload = () => {
        let ok = false;

        try {
          ok = Boolean(validate());
        } catch (_) {
          ok = false;
        }

        if (ok) state.loaded.push(role);
        else state.failed.push(`${role}:invalid`);

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
    if (!window.AUDRALIA_CANVAS || typeof window.AUDRALIA_CANVAS.mount !== "function") return false;

    const api = window.AUDRALIA_CANVAS.mount(mount, {
      routeContract: CONTRACT,
      routeReceipt: RECEIPT,
      generation: 1,
      baseline: "gratitude-plains-deserts-marshes-more-landmass-stabilizing",
      primarySummit: "Gratitude",
      nineWithinNine: true,
      bookSummitLaw: true,
      summitsActive: true,
      mountainsActive: true,
      groundcoverActive: true,
      plainsActive: true,
      desertsActive: true,
      marshesActive: true,
      moreLandmassActive: true,
      beachesActive: true,
      landriseActive: true,
      beachRemainsSeaLevel: true,
      raisedTerrainBehindBeach: true,
      terrainMassAttached: true,
      terrainAboveSeaLevel: true,
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
      fallback.textContent = "Audralia plains, deserts, marshes, and more landmass route loaded, but canvas authority failed. Visible fallback protected.";
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

    for (const [role, path, validate] of files) {
      await loadScript(role, path, validate);
    }

    try {
      if (state.loaded.includes("canvas") && bootCanvas(mount)) return;
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
