// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_LIVE_WORLD_INLINE_CANVAS_FAILSAFE_TNT_v7
// Owns: enhancement-only module boot. The HTML inline renderer owns immediate nonblank canvas survival.
// Rule: never replace body; never blank canvas; never depend on PNG/static image.

const CONTRACT = "H_EARTH_LIVE_WORLD_INLINE_CANVAS_FAILSAFE_TNT_v7";
const GROUND_RENDER_CACHE_KEY = "H_EARTH_WESTERN_GOLDEN_SHELF_LIVE_WORLD_RENDER_TNT_v5";

function setStatus(text) {
  const node = document.querySelector("[data-render-status]");
  if (node) node.textContent = text;
}

function markDocument(extra = {}) {
  const markers = {
    page: "h-earth-live-world-inline-canvas-failsafe",
    route: "/showroom/globe/h-earth/",
    contract: CONTRACT,
    renderer: "inline-live-world-failsafe-plus-module-enhancement",
    staticImageDependency: "false",
    pngDependency: "false",
    waterBehindManor: "true",
    cameraFacing: "west-southwest",
    finalArchitectureAuthorized: "false",
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    document.body.dataset[key] = String(value);
  });
}

async function startModuleEnhancement() {
  const canvas = document.querySelector("[data-manor-ground-canvas]");
  if (!canvas) {
    setStatus("Canvas mount missing. HTML shell remains visible.");
    return null;
  }

  try {
    const mod = await import(`/assets/h-earth/h-earth.western-golden-shelf.ground.render.js?v=${GROUND_RENDER_CACHE_KEY}`);

    if (!mod?.createWesternGoldenShelfGroundRenderer) {
      throw new Error("createWesternGoldenShelfGroundRenderer export missing.");
    }

    const renderer = mod.createWesternGoldenShelfGroundRenderer(canvas, {
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      targetFrameMs: 50
    }).start();

    setStatus("External live renderer active.");
    markDocument({ moduleRendererActive: "true", inlineFailsafeActive: "true" });
    return renderer;
  } catch (error) {
    setStatus(`Inline live renderer active. External module unavailable: ${error?.message || "unknown error"}`);
    markDocument({ moduleRendererActive: "false", inlineFailsafeActive: "true", moduleError: error?.message || "unknown" });
    return null;
  }
}

async function init() {
  markDocument({ boot: "started" });

  let renderer = null;
  let error = null;

  try {
    renderer = await startModuleEnhancement();
  } catch (err) {
    error = err?.message || "Unexpected module boot failure.";
    setStatus(`Inline live renderer active. Module boot failed: ${error}`);
    markDocument({ moduleRendererActive: "false", inlineFailsafeActive: "true", bootError: error });
  }

  window.DGBHEarthGroundScout = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        route: "/showroom/globe/h-earth/",
        moduleRenderer: renderer?.status?.() || null,
        bootError: error,
        inlineFailsafeActive: true,
        htmlShellVisible: true,
        staticImageDependency: false,
        pngDependency: false,
        waterBehindManor: true,
        cameraFacing: "west-southwest",
        finalArchitectureAuthorized: false
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

export default init;
