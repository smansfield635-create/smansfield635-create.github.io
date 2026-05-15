// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_CANONICAL_LOADER_TNT_v1
// Full-file replacement.
// Route loader and mount authority only.
// Loads the current Audralia lattice, landmap, climate, surface, and canvas chain.
// Mounts only window.AUDRALIA_CANVAS.mount(...).
// Adds visible route-level status so stale canvas failures can be diagnosed.
// Does not own footprint.
// Does not own climate.
// Does not own canvas internals.
// Does not touch Gauges.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_ROUTE_CANONICAL_LOADER_TNT_v1";
  const RECEIPT = "AUDRALIA_ROUTE_CANONICAL_LOADER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_ROUTE_PUBLIC_CONTEXT_LEGACY_LOADER";
  const VERSION = "2026-05-15.audralia-route-canonical-loader-v1";

  const EXPECTED = Object.freeze({
    canvas: "AUDRALIA_VISIBLE_UPDATE_NOTICE_CANVAS_TNT_v3",
    landmap: "AUDRALIA_30_BILLION_YEAR_EARTH_LEGACY_ORGANIC_LANDFORM_TNT_v1",
    climate: "AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v1",
    surface: "AUDRALIA_G1_LAYER_TWO_LUSH_LAND_SURFACE_TNT_v1"
  });

  const CACHE_KEY = "AUDRALIA_ROUTE_CANONICAL_LOADER_TNT_v1";

  const SCRIPT_CHAIN = Object.freeze([
    {
      key: "lattice256",
      label: "Lattice 256",
      src: "/assets/audralia/audralia.lattice256.js",
      globalCheck: () => Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV)
    },
    {
      key: "landmap",
      label: "Organic Landmap",
      src: "/assets/audralia/audralia.landmap.js",
      globalCheck: () => Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap),
      expectedContract: EXPECTED.landmap,
      contractRead: () => window.AUDRALIA_LANDMAP?.contract
    },
    {
      key: "climate",
      label: "Climate Detail",
      src: "/assets/audralia/audralia.climate.render.js",
      globalCheck: () => Boolean(window.AUDRALIA_CLIMATE_RENDER?.sampleClimate),
      expectedContract: EXPECTED.climate,
      contractRead: () => window.AUDRALIA_CLIMATE_RENDER?.contract
    },
    {
      key: "beaches",
      label: "Beach Authority",
      src: "/assets/audralia/audralia.beaches.js",
      optional: true,
      globalCheck: () => Boolean(window.AUDRALIA_BEACHES)
    },
    {
      key: "groundcover",
      label: "Groundcover",
      src: "/assets/audralia/audralia.groundcover.js",
      optional: true,
      globalCheck: () => Boolean(window.AUDRALIA_GROUNDCOVER)
    },
    {
      key: "landSurface",
      label: "Land Surface",
      src: "/assets/audralia/audralia.land.surface.js",
      globalCheck: () => Boolean(window.AUDRALIA_LAND_SURFACE?.sampleSurface),
      expectedContract: EXPECTED.surface,
      contractRead: () => window.AUDRALIA_LAND_SURFACE?.contract
    },
    {
      key: "canvas",
      label: "Visible Notice Canvas",
      src: "/assets/audralia/audralia.canvas.js",
      globalCheck: () => Boolean(window.AUDRALIA_CANVAS?.mount),
      expectedContract: EXPECTED.canvas,
      contractRead: () => window.AUDRALIA_CANVAS?.contract
    }
  ]);

  const root = document.documentElement;

  function $(selector) {
    return document.querySelector(selector);
  }

  function setRootReceipt() {
    root.dataset.audraliaRouteLoaderLoaded = "true";
    root.dataset.audraliaRouteLoaderContract = CONTRACT;
    root.dataset.audraliaRouteLoaderReceipt = RECEIPT;
    root.dataset.audraliaRouteLoaderPreviousContract = PREVIOUS_CONTRACT;
    root.dataset.audraliaRouteExpectedCanvasContract = EXPECTED.canvas;
    root.dataset.audraliaRouteExpectedLandmapContract = EXPECTED.landmap;
    root.dataset.audraliaRouteExpectedClimateContract = EXPECTED.climate;
    root.dataset.audraliaRouteOwnsFootprint = "false";
    root.dataset.audraliaRouteOwnsClimate = "false";
    root.dataset.audraliaRouteOwnsCanvas = "false";
    root.dataset.generatedImage = "false";
    root.dataset.graphicBox = "false";
    root.dataset.visualPassClaimed = "false";

    window.DGB_AUDRALIA_ROUTE_LOADER_RECEIPT = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: "/showroom/globe/audralia/",
      expected: EXPECTED,
      owns: [
        "route_loader",
        "script_chain_loading",
        "visible_route_status",
        "canonical_canvas_mount_call"
      ],
      doesNotOwn: [
        "land_footprint",
        "climate_authority",
        "surface_truth",
        "canvas_internals",
        "runtime_motion",
        "gauges_logic",
        "image_generation",
        "GraphicBox"
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      timestamp: new Date().toISOString()
    });
  }

  function statusNodes() {
    return Object.freeze({
      notice: $("#audraliaRouteLoaderNotice"),
      status: $("#audraliaRouteStatus"),
      mount: $("#audraliaCanvasMount"),
      fallback: $("[data-stage-fallback='true']")
    });
  }

  function setNotice(text, tone = "pending") {
    const { notice } = statusNodes();
    if (!notice) return;

    notice.textContent = text;
    notice.dataset.statusTone = tone;

    if (tone === "pass") {
      notice.style.borderColor = "rgba(158,240,191,.58)";
      notice.style.color = "rgba(206,255,228,.98)";
      notice.style.background = "rgba(2,30,24,.78)";
    } else if (tone === "warn") {
      notice.style.borderColor = "rgba(243,200,111,.54)";
      notice.style.color = "rgba(255,232,168,.98)";
      notice.style.background = "rgba(40,26,4,.74)";
    } else if (tone === "fail") {
      notice.style.borderColor = "rgba(255,139,139,.54)";
      notice.style.color = "rgba(255,210,210,.98)";
      notice.style.background = "rgba(44,8,12,.76)";
    }
  }

  function setStatus(text) {
    const { status } = statusNodes();
    if (!status) return;
    status.textContent = text;
  }

  function appendCache(src) {
    const joiner = src.includes("?") ? "&" : "?";
    return `${src}${joiner}v=${encodeURIComponent(CACHE_KEY)}.${Date.now()}`;
  }

  function readScriptState(item) {
    const loaded = Boolean(item.globalCheck());
    const actualContract = typeof item.contractRead === "function" ? String(item.contractRead() || "") : "";
    const expectedContract = String(item.expectedContract || "");
    const contractMatches = expectedContract ? actualContract === expectedContract : true;

    return Object.freeze({
      key: item.key,
      label: item.label,
      loaded,
      optional: Boolean(item.optional),
      expectedContract,
      actualContract,
      contractMatches
    });
  }

  function summarizeStates(states) {
    return states.map((state) => {
      if (!state.loaded && state.optional) return `${state.label}: optional missing`;
      if (!state.loaded) return `${state.label}: missing`;
      if (state.expectedContract && !state.contractMatches) {
        return `${state.label}: loaded stale ${state.actualContract || "unknown"}`;
      }
      return `${state.label}: active`;
    }).join(" · ");
  }

  function loadScript(item) {
    return new Promise((resolve) => {
      if (item.globalCheck()) {
        resolve(readScriptState(item));
        return;
      }

      const existing = document.querySelector(`script[data-audralia-route-script="${item.key}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(readScriptState(item)), { once: true });
        existing.addEventListener("error", () => resolve(readScriptState(item)), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = appendCache(item.src);
      script.defer = true;
      script.dataset.audraliaRouteScript = item.key;
      script.dataset.audraliaRouteLoader = CONTRACT;
      script.onload = () => resolve(readScriptState(item));
      script.onerror = () => resolve(readScriptState(item));
      document.head.appendChild(script);
    });
  }

  async function loadChain() {
    const states = [];

    for (const item of SCRIPT_CHAIN) {
      setNotice(`Loading Audralia chain · ${item.label}`, "pending");
      setStatus(`Loading ${item.label} from ${item.src}`);

      const state = await loadScript(item);
      states.push(state);

      if (!state.loaded && !state.optional) {
        setNotice(`Audralia chain blocked · ${item.label} missing`, "fail");
        setStatus(summarizeStates(states));
        break;
      }

      if (state.loaded && state.expectedContract && !state.contractMatches) {
        setNotice(`Audralia chain warning · ${item.label} stale`, "warn");
        setStatus(summarizeStates(states));
      } else {
        setStatus(summarizeStates(states));
      }
    }

    return states;
  }

  function chainResult(states) {
    const required = states.filter((state) => !state.optional);
    const missingRequired = required.filter((state) => !state.loaded);
    const staleRequired = required.filter((state) => state.expectedContract && !state.contractMatches);

    return Object.freeze({
      missingRequired,
      staleRequired,
      requiredPassed: missingRequired.length === 0,
      strictPassed: missingRequired.length === 0 && staleRequired.length === 0,
      states
    });
  }

  function disposeOldCanvasIfPresent() {
    if (typeof window.__AUDRALIA_CANVAS_DISPOSE__ === "function") {
      try {
        window.__AUDRALIA_CANVAS_DISPOSE__();
      } catch {
        // Keep route alive if old dispose fails.
      }
    }
  }

  function clearMount() {
    const { mount } = statusNodes();
    if (!mount) return null;

    mount.querySelectorAll("canvas,[data-audralia-coordinate-readout],[data-audralia-version-notice]").forEach((node) => node.remove());
    return mount;
  }

  function markFallback(hidden) {
    const { fallback } = statusNodes();
    if (!fallback) return;
    fallback.style.display = hidden ? "none" : "grid";
  }

  function mountCanvas(result) {
    const mount = clearMount();

    if (!mount) {
      setNotice("Audralia chain blocked · mount missing", "fail");
      setStatus("Missing #audraliaCanvasMount. Route shell must expose the canonical mount node.");
      return false;
    }

    if (!window.AUDRALIA_CANVAS?.mount) {
      setNotice("Audralia chain blocked · canvas mount unavailable", "fail");
      setStatus("window.AUDRALIA_CANVAS.mount was not found after script load.");
      return false;
    }

    disposeOldCanvasIfPresent();

    window.__AUDRALIA_CANONICAL_MOUNT_LOCK__ = Object.freeze({
      contract: CONTRACT,
      canvasContract: String(window.AUDRALIA_CANVAS.contract || ""),
      route: "/showroom/globe/audralia/",
      timestamp: new Date().toISOString()
    });

    try {
      window.AUDRALIA_CANVAS.mount(mount, {
        route: "/showroom/globe/audralia/",
        routeLoaderContract: CONTRACT,
        expectedCanvasContract: EXPECTED.canvas,
        expectedLandmapContract: EXPECTED.landmap,
        expectedClimateContract: EXPECTED.climate,
        onStatus: (phase, payload = {}) => {
          root.dataset.audraliaRouteCanvasPhase = String(phase);
          root.dataset.audraliaRouteCanvasFrames = String(payload.frames || 0);
          root.dataset.audraliaRouteCanvasMounted = String(Boolean(payload.mounted));
          root.dataset.audraliaRouteCanvasVisibleNotice = String(Boolean(payload.visibleUpdateNotice));

          if (payload.mounted) {
            markFallback(true);
          }
        }
      });
    } catch (error) {
      setNotice("Audralia canvas mount failed", "fail");
      setStatus(`Canvas mount error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }

    markFallback(true);

    const tone = result.strictPassed ? "pass" : "warn";
    const message = result.strictPassed
      ? "Audralia route updated · visible notice canvas mounted"
      : "Audralia route mounted · chain has stale or optional gaps";

    setNotice(message, tone);
    setStatus(summarizeStates(result.states));

    root.dataset.audraliaRouteCanvasMounted = "true";
    root.dataset.audraliaRouteStrictChainPassed = String(result.strictPassed);
    root.dataset.audraliaRouteRequiredChainPassed = String(result.requiredPassed);
    root.dataset.audraliaActiveCanvasContract = String(window.AUDRALIA_CANVAS.contract || "");
    root.dataset.audraliaActiveLandmapContract = String(window.AUDRALIA_LANDMAP?.contract || "");
    root.dataset.audraliaActiveClimateContract = String(window.AUDRALIA_CLIMATE_RENDER?.contract || "");
    root.dataset.audraliaActiveLandSurfaceContract = String(window.AUDRALIA_LAND_SURFACE?.contract || "");

    return true;
  }

  function installMutationWatch() {
    const { mount } = statusNodes();
    if (!mount || !window.MutationObserver) return;

    const observer = new MutationObserver(() => {
      const canvases = Array.from(mount.querySelectorAll("canvas"));
      const activeCanvas = canvases.find((node) => node.dataset.audraliaCanvasContract === EXPECTED.canvas);

      if (canvases.length > 0 && !activeCanvas) {
        setNotice("Audralia route warning · legacy canvas detected", "warn");
        root.dataset.audraliaLegacyCanvasDetected = "true";
      }
    });

    observer.observe(mount, { childList: true, subtree: true });

    window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
  }

  async function init() {
    setRootReceipt();
    installMutationWatch();

    setNotice("Audralia route loader active", "pending");
    setStatus("Beginning canonical Audralia chain load.");

    const states = await loadChain();
    const result = chainResult(states);

    if (!result.requiredPassed) {
      setNotice("Audralia route blocked · required authority missing", "fail");
      setStatus(summarizeStates(result.states));
      return;
    }

    mountCanvas(result);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
