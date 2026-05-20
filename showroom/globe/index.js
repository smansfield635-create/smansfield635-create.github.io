// /showroom/globe/audralia/index.js
// AUDRALIA_CLEAN_CANVAS_ROUTE_BRIDGE_TNT_v1
// Full-file replacement.
// File 17.
// Audralia route bridge only.
// Purpose:
// - Loads the clean 16-file Audralia authority chain in lawful order.
// - Mounts /assets/audralia/clean/audralia.engine.js into the Audralia page canvas.
// - Reports route receipts to the HTML expression shell.
// - Does not own planet science.
// - Does not own runtime motion.
// - Does not own controls.
// - Does not own canvas composition.
// - Does not own HTML expression.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_ROUTE_BRIDGE_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_ROUTE_BRIDGE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_ENGINE_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-route-bridge-v1";

  const ROUTE = "/showroom/globe/audralia/";
  const HTML_SHELL_CONTRACT = "AUDRALIA_CLEAN_CANVAS_EXPRESSION_SHELL_HTML_TNT_v1";
  const CACHE_KEY = "2026-05-20-audralia-clean-canvas-route-bridge-v1";

  const CHAIN = Object.freeze([
    "/assets/showroom/globe/planet/planet.manifest.js",
    "/assets/showroom/globe/planet/planet.math.js",
    "/assets/showroom/globe/planet/planet.lattice.js",
    "/assets/showroom/globe/planet/planet.palette.js",
    "/assets/audralia/clean/audralia.identity.js",
    "/assets/audralia/clean/audralia.landmask.js",
    "/assets/audralia/clean/audralia.hydrology.js",
    "/assets/audralia/clean/audralia.elevation.js",
    "/assets/audralia/clean/audralia.climate.js",
    "/assets/audralia/clean/audralia.biome.js",
    "/assets/audralia/clean/audralia.surface.js",
    "/assets/audralia/clean/audralia.atmosphere.js",
    "/assets/audralia/clean/audralia.runtime.js",
    "/assets/audralia/clean/audralia.controls.js",
    "/assets/audralia/clean/audralia.canvas.js",
    "/assets/audralia/clean/audralia.engine.js"
  ]);

  const EXPECTED_GLOBALS = Object.freeze([
    "AUDRALIA_CLEAN_CANVAS_MANIFEST",
    "AUDRALIA_CLEAN_CANVAS_MATH",
    "AUDRALIA_CLEAN_CANVAS_LATTICE",
    "AUDRALIA_CLEAN_CANVAS_PALETTE",
    "AUDRALIA_CLEAN_CANVAS_IDENTITY",
    "AUDRALIA_CLEAN_CANVAS_LANDMASK",
    "AUDRALIA_CLEAN_CANVAS_HYDROLOGY",
    "AUDRALIA_CLEAN_CANVAS_ELEVATION",
    "AUDRALIA_CLEAN_CANVAS_CLIMATE",
    "AUDRALIA_CLEAN_CANVAS_BIOME",
    "AUDRALIA_CLEAN_CANVAS_SURFACE",
    "AUDRALIA_CLEAN_CANVAS_ATMOSPHERE",
    "AUDRALIA_CLEAN_CANVAS_RUNTIME",
    "AUDRALIA_CLEAN_CANVAS_CONTROLS",
    "AUDRALIA_CLEAN_CANVAS_COMPOSITOR",
    "AUDRALIA_CLEAN_CANVAS_ENGINE"
  ]);

  const state = {
    booted: false,
    loaded: [],
    failed: [],
    engineMount: null,
    receipt: null
  };

  function doc() {
    return typeof document !== "undefined" ? document : null;
  }

  function win() {
    return typeof window !== "undefined" ? window : {};
  }

  function setDataset(key, value) {
    const d = doc();
    if (!d?.documentElement?.dataset) return;

    try {
      d.documentElement.dataset[key] = String(value);
    } catch {
      // Dataset writes are route proof metadata only.
    }
  }

  function byId(id) {
    const d = doc();
    return d ? d.getElementById(id) : null;
  }

  function qs(selector) {
    const d = doc();
    return d ? d.querySelector(selector) : null;
  }

  function statusNode() {
    return byId("audralia-route-status") || qs("[data-audralia-route-status]");
  }

  function writeStatus(message, tone = "neutral") {
    const node = statusNode();
    if (!node) return;

    node.textContent = message;
    node.dataset.statusTone = tone;
  }

  function appendReceiptLine(message) {
    const list = byId("audralia-receipt-list") || qs("[data-audralia-receipts]");
    if (!list) return;

    const item = doc().createElement("li");
    item.textContent = message;
    list.appendChild(item);
  }

  function chainUrl(path) {
    return `${path}?v=${encodeURIComponent(CACHE_KEY)}`;
  }

  function hasScript(path) {
    const d = doc();
    if (!d) return false;

    return Boolean(
      d.querySelector(`script[data-audralia-clean-chain-path="${path}"]`) ||
      Array.from(d.scripts || []).some((script) => String(script.src || "").includes(path))
    );
  }

  function loadScript(path) {
    return new Promise((resolve, reject) => {
      const d = doc();

      if (!d) {
        reject(new Error("document unavailable"));
        return;
      }

      if (hasScript(path)) {
        state.loaded.push(path);
        resolve({ path, reused: true });
        return;
      }

      const script = d.createElement("script");
      script.src = chainUrl(path);
      script.async = false;
      script.defer = false;
      script.dataset.audraliaCleanChainPath = path;
      script.dataset.audraliaCleanChainContract = CONTRACT;

      script.onload = () => {
        state.loaded.push(path);
        appendReceiptLine(`loaded · ${path}`);
        resolve({ path, reused: false });
      };

      script.onerror = () => {
        state.failed.push(path);
        reject(new Error(`Failed to load ${path}`));
      };

      d.head.appendChild(script);
    });
  }

  async function loadChain() {
    writeStatus("Loading Audralia clean-canvas authority chain.", "loading");

    for (const path of CHAIN) {
      await loadScript(path);
    }

    const missingGlobals = EXPECTED_GLOBALS.filter((name) => !win()[name]);

    return Object.freeze({
      expected: CHAIN.length,
      loaded: state.loaded.length,
      failed: state.failed.slice(),
      missingGlobals,
      complete: state.failed.length === 0 && missingGlobals.length === 0
    });
  }

  function resolveRoot() {
    return byId("audralia-main") ||
      byId("audralia-stage") ||
      qs("[data-audralia-root]") ||
      qs("main") ||
      doc()?.body ||
      null;
  }

  function resolveStage() {
    return byId("audralia-stage") ||
      qs("[data-audralia-stage]") ||
      resolveRoot();
  }

  function resolveCanvas() {
    const existing =
      byId("audralia-canvas") ||
      qs("canvas[data-audralia-canvas]") ||
      qs(".audralia-clean-canvas");

    if (existing) return existing;

    const stage = resolveStage();
    if (!stage || !doc()) return null;

    const canvas = doc().createElement("canvas");
    canvas.id = "audralia-canvas";
    canvas.className = "audralia-clean-canvas";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Audralia clean-canvas planet inspection surface");
    canvas.dataset.audraliaCanvas = "true";
    canvas.dataset.createdByRouteBridge = CONTRACT;

    stage.appendChild(canvas);
    return canvas;
  }

  function verifyHtmlShell() {
    const html = doc()?.documentElement;

    return Object.freeze({
      shellAvailable: Boolean(html),
      expectedContract: HTML_SHELL_CONTRACT,
      actualContract: html?.dataset?.contract || null,
      route: html?.dataset?.route || null,
      page: html?.dataset?.page || null,
      validRoute: html?.dataset?.route === ROUTE,
      validPage: html?.dataset?.page === "audralia",
      validShellContract: html?.dataset?.contract === HTML_SHELL_CONTRACT
    });
  }

  function mountEngine(chainReceipt) {
    const engine = win().AUDRALIA_CLEAN_CANVAS_ENGINE || win().AUDRALIA_ENGINE;
    const root = resolveRoot();
    const stage = resolveStage();
    const canvas = resolveCanvas();

    if (!engine?.mountAudralia) {
      throw new Error("AUDRALIA_CLEAN_CANVAS_ENGINE.mountAudralia unavailable");
    }

    if (!canvas) {
      throw new Error("Audralia canvas unavailable");
    }

    const mountResult = engine.mountAudralia({
      root,
      stage,
      canvas,
      options: {
        autoStart: true,
        autoResize: true,
        autoVisibility: true,
        proofStatus: false,
        allowCreateCanvas: false,
        dprCap: 1.65,
        frameBudgetMs: 42,
        textureWidth: 288,
        textureHeight: 144,
        radiusScale: 0.365,
        cxRatio: 0.50,
        cyRatio: 0.51
      }
    });

    state.engineMount = mountResult;

    return Object.freeze({
      mounted: Boolean(mountResult?.mounted || mountResult?.receipt?.mounted),
      chain: chainReceipt,
      engineReceipt: mountResult?.receipt || null,
      engineAvailable: true,
      canvasAvailable: true,
      rootAvailable: Boolean(root),
      stageAvailable: Boolean(stage)
    });
  }

  function buildReceipt(chainReceipt, mountReceipt, error = null) {
    const htmlShell = verifyHtmlShell();
    const engineStatus =
      win().AUDRALIA_CLEAN_CANVAS_ENGINE?.getStatus?.() ||
      win().AUDRALIA_ENGINE?.getStatus?.() ||
      null;

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-route-bridge-only",
      route: ROUTE,
      htmlShell,
      chain: chainReceipt,
      mount: mountReceipt,
      engineStatus,
      error: error ? String(error.message || error) : null,
      ownsRouteBridge: true,
      ownsHtmlExpression: false,
      ownsEngine: false,
      ownsRuntimeMotion: false,
      ownsControls: false,
      ownsCanvasComposition: false,
      ownsPlanetScience: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function publishReceipt(receipt) {
    state.receipt = receipt;

    win().AUDRALIA_ROUTE_BRIDGE = API;
    win().AUDRALIA_ROUTE_BRIDGE_RECEIPT = receipt;
    win().AUDRALIA_CLEAN_CANVAS_ROUTE_BRIDGE = API;
    win().AUDRALIA_CLEAN_CANVAS_ROUTE_BRIDGE_RECEIPT = receipt;

    setDataset("audraliaRouteBridgeLoaded", "true");
    setDataset("audraliaRouteBridgeContract", CONTRACT);
    setDataset("audraliaRouteBridgeReceipt", RECEIPT);
    setDataset("audraliaRouteBridgeVersion", VERSION);
    setDataset("audraliaRouteBridgeOwnsRouteBridge", "true");
    setDataset("audraliaRouteBridgeOwnsHtmlExpression", "false");
    setDataset("audraliaRouteBridgeOwnsEngine", "false");
    setDataset("audraliaRouteBridgeOwnsRuntimeMotion", "false");
    setDataset("audraliaRouteBridgeOwnsControls", "false");
    setDataset("audraliaRouteBridgeOwnsCanvasComposition", "false");
    setDataset("audraliaRouteBridgeOwnsPlanetScience", "false");
    setDataset("audraliaRouteBridgeChainLoaded", receipt.chain?.complete ? "true" : "false");
    setDataset("audraliaRouteBridgeMounted", receipt.mount?.mounted ? "true" : "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("visualPassClaimed", "false");

    return receipt;
  }

  async function boot() {
    if (state.booted) {
      return state.receipt || buildReceipt(null, null, null);
    }

    state.booted = true;

    setDataset("audraliaRouteBridgeBooting", "true");
    writeStatus("Booting Audralia clean-canvas route bridge.", "loading");

    let chainReceipt = null;
    let mountReceipt = null;

    try {
      chainReceipt = await loadChain();
      mountReceipt = mountEngine(chainReceipt);

      const receipt = publishReceipt(buildReceipt(chainReceipt, mountReceipt, null));

      writeStatus(
        mountReceipt.mounted
          ? "Audralia clean-canvas route bridge mounted."
          : "Audralia clean-canvas route bridge loaded but mount did not complete.",
        mountReceipt.mounted ? "ready" : "held"
      );

      appendReceiptLine(`${CONTRACT} · mounted=${mountReceipt.mounted}`);

      setDataset("audraliaRouteBridgeBooting", "false");
      setDataset("audraliaRouteBridgeReady", mountReceipt.mounted ? "true" : "false");

      return receipt;
    } catch (error) {
      const receipt = publishReceipt(buildReceipt(chainReceipt, mountReceipt, error));

      writeStatus(`Audralia route bridge held: ${error.message || error}`, "held");
      appendReceiptLine(`${CONTRACT} · held · ${error.message || error}`);

      setDataset("audraliaRouteBridgeBooting", "false");
      setDataset("audraliaRouteBridgeReady", "false");
      setDataset("audraliaRouteBridgeError", error.message || String(error));

      return receipt;
    }
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-route-bridge-only",
      route: ROUTE,
      htmlShellContract: HTML_SHELL_CONTRACT,
      cacheKey: CACHE_KEY,
      chain: CHAIN,
      expectedGlobals: EXPECTED_GLOBALS,
      loaded: state.loaded.slice(),
      failed: state.failed.slice(),
      booted: state.booted,
      mounted: Boolean(state.engineMount?.mounted || state.engineMount?.receipt?.mounted),
      lastReceipt: state.receipt,
      ownsRouteBridge: true,
      ownsHtmlExpression: false,
      ownsEngine: false,
      ownsRuntimeMotion: false,
      ownsControls: false,
      ownsCanvasComposition: false,
      ownsPlanetScience: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    route: ROUTE,
    chain: CHAIN,
    expectedGlobals: EXPECTED_GLOBALS,
    boot,
    loadChain,
    mountEngine,
    verifyHtmlShell,
    getStatus
  });

  win().AUDRALIA_ROUTE_BRIDGE = API;
  win().AUDRALIA_CLEAN_CANVAS_ROUTE_BRIDGE = API;

  if (doc()?.readyState === "loading") {
    doc().addEventListener("DOMContentLoaded", () => {
      boot();
    }, { once: true });
  } else {
    boot();
  }
})();
