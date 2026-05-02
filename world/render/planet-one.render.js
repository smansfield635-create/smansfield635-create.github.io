/* ASSET GENERATION 2 TERMS RENEWAL
   FILE: /world/render/planet-one.render.js
   VERSION: ASSET_GENERATION_2_TERMS_RENEWAL_TNT_v1

   COMPATIBILITY MARKERS:
   G1_PLANET_1_BLOB_BREAKUP_REAL_PLANET_SURFACE_TNT_v1
   G1_PLANET_1_HYDROLOGY_RECEIVER_VISIBILITY_AND_LAND_ALPHA_REBALANCE_TNT_v1
   G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1

   ROLE:
   Planet 1 renderer adopts Demo Universe Earth asset spine as the visual baseline.
   Renderer composes Earth asset output; it does not own route runtime or lock visual pass.
*/

(function attachPlanetOneRendererAssetGeneration2(global) {
  "use strict";

  var VERSION = "ASSET_GENERATION_2_TERMS_RENEWAL_TNT_v1";
  var COMPAT_VERSION = "G1_PLANET_1_BLOB_BREAKUP_REAL_PLANET_SURFACE_TNT_v1";
  var PRIOR_COMPAT_VERSION = "G1_PLANET_1_HYDROLOGY_RECEIVER_VISIBILITY_AND_LAND_ALPHA_REBALANCE_TNT_v1";
  var SYSTEMIC_COMPAT_VERSION = "G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1";

  var state = {
    mounted: false,
    renderCount: 0,
    lastCanvas: null,
    lastMount: null,
    lastOptions: null,
    lastRender: null,
    lastError: null
  };

  function resolveMount(target) {
    if (typeof target === "string" && global.document) return global.document.querySelector(target);
    if (target) return target;

    if (!global.document) return null;

    return global.document.getElementById("planet-one-render") ||
      global.document.querySelector("[data-planet-one-mount='true']") ||
      global.document.querySelector("[data-earth-asset-mount='true']");
  }

  function ensureCanvas(mount, options) {
    var canvas;
    var size;

    options = options || {};
    mount = resolveMount(mount);

    if (!mount || !global.document) return null;

    size = Math.max(320, Math.min(1400, Number(options.size || options.width || mount.clientWidth || 820)));

    canvas = mount.querySelector("canvas[data-earth-asset-canvas='true'], canvas[data-planet-one-render-canvas='true']");

    if (!canvas) {
      canvas = global.document.createElement("canvas");
      canvas.setAttribute("data-earth-asset-canvas", "true");
      canvas.setAttribute("data-planet-one-render-canvas", "true");
      canvas.setAttribute("data-renderer-version", VERSION);
      canvas.setAttribute("data-demo-universe-earth-baseline", "true");
      canvas.setAttribute("data-visual-pass-claimed", "false");
      canvas.setAttribute("aria-label", "Planet 1 Demo Universe Earth baseline");
      mount.innerHTML = "";
      mount.appendChild(canvas);
    }

    canvas.width = size;
    canvas.height = size;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = size + "px";
    canvas.style.height = "auto";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "transparent";

    state.mounted = true;
    state.lastMount = mount;
    state.lastCanvas = canvas;

    return canvas;
  }

  function earthAsset() {
    return global.DGBEarthAssetCanvas || global.DGBDemoUniverseEarthCanvas || null;
  }

  function drawFallback(canvas) {
    var ctx = canvas.getContext("2d");
    var size = Math.min(canvas.width, canvas.height);
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var radius = size * 0.43;
    var ocean = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.36, radius * 0.05, cx, cy, radius);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ocean.addColorStop(0, "rgba(86,150,210,1)");
    ocean.addColorStop(0.42, "rgba(14,88,154,1)");
    ocean.addColorStop(0.80, "rgba(3,30,88,1)");
    ocean.addColorStop(1, "rgba(2,8,26,1)");

    ctx.fillStyle = ocean;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(55,120,64,.62)";
    ctx.beginPath();
    ctx.ellipse(cx - radius * 0.20, cy - radius * 0.05, radius * 0.20, radius * 0.34, -0.42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(70,126,70,.50)";
    ctx.beginPath();
    ctx.ellipse(cx + radius * 0.22, cy + radius * 0.10, radius * 0.28, radius * 0.22, 0.30, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(150,205,255,.25)";
    ctx.lineWidth = Math.max(1, radius * 0.012);
    ctx.strokeStyle = "rgba(145,190,255,.22)";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    state.lastRender = {
      ok: false,
      fallback: true,
      reason: "EARTH_ASSET_NOT_READY",
      version: VERSION,
      demoUniverseEarthBaseline: true,
      visualPassClaimed: false
    };

    return state.lastRender;
  }

  function renderPlanetOne(target, options) {
    options = Object.assign({
      demoUniverseEarthBaseline: true,
      viewLon: -28,
      viewLat: 0,
      brightness: 1.13,
      contrast: 1.10,
      cloudStrength: 0.28,
      atmosphere: 0.16,
      resolutionScale: 0.88
    }, options || {});

    var mount = resolveMount(target);
    var canvas = ensureCanvas(mount, options);
    var earth = earthAsset();
    var receipt;

    if (!canvas) {
      state.lastRender = {
        ok: false,
        reason: "NO_MOUNT",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastRender;
    }

    if (!earth || typeof earth.renderToCanvas !== "function") {
      return drawFallback(canvas);
    }

    receipt = earth.renderToCanvas(canvas, options);

    if (earth.ensureAssets) {
      earth.ensureAssets().then(function () {
        earth.renderToCanvas(canvas, options);
      }).catch(function (error) {
        state.lastError = String(error && error.message ? error.message : error);
      });
    }

    state.renderCount += 1;
    state.lastOptions = Object.assign({}, options);
    state.lastRender = {
      ok: Boolean(receipt && receipt.ok !== false),
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      priorCompatibilityVersion: PRIOR_COMPAT_VERSION,
      systemicCompatibilityVersion: SYSTEMIC_COMPAT_VERSION,
      role: "PLANET_ONE_DEMO_UNIVERSE_EARTH_COMPOSER",
      renderCount: state.renderCount,
      demoUniverseEarthBaseline: true,
      earthAssetSpineAdopted: true,
      ownsRouteRuntime: false,
      ownsGauges: false,
      ownsVisualLock: false,
      visualPassClaimed: false,
      earthReceipt: receipt || null,
      renderedAt: new Date().toISOString()
    };

    return state.lastRender;
  }

  function render(target, options) { return renderPlanetOne(target, options); }
  function renderGlobe(target, options) { return renderPlanetOne(target, options); }
  function mount(target, options) { return renderPlanetOne(target, options); }
  function mountPlanetOne(target, options) { return renderPlanetOne(target, options); }
  function create(target, options) { return renderPlanetOne(target, options); }
  function createPlanetOneRender(target, options) { return renderPlanetOne(target, options); }
  function createPlanetOneScene(target, options) { return renderPlanetOne(target, options); }
  function start(target, options) { return renderPlanetOne(target || state.lastMount, options || state.lastOptions || {}); }
  function pause() { return { ok: true, paused: true, version: VERSION, visualPassClaimed: false }; }
  function resume() { return renderPlanetOne(state.lastMount, state.lastOptions || {}); }
  function destroy() {
    if (state.lastCanvas && state.lastCanvas.parentNode) state.lastCanvas.parentNode.removeChild(state.lastCanvas);
    state.lastCanvas = null;
    state.lastMount = null;
    state.mounted = false;
    return { ok: true, destroyed: true, version: VERSION, visualPassClaimed: false };
  }

  function getStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      priorCompatibilityVersion: PRIOR_COMPAT_VERSION,
      systemicCompatibilityVersion: SYSTEMIC_COMPAT_VERSION,
      role: "PLANET_ONE_DEMO_UNIVERSE_EARTH_COMPOSER",
      mounted: state.mounted,
      renderCount: state.renderCount,
      demoUniverseEarthBaseline: true,
      earthAssetSpineAdopted: true,
      earthAssetReady: Boolean(earthAsset()),
      ownsRouteRuntime: false,
      ownsGauges: false,
      ownsVisualLock: false,
      visualPassClaimed: false,
      lastRender: state.lastRender,
      lastError: state.lastError
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    COMPAT_VERSION: COMPAT_VERSION,
    compatibilityVersion: COMPAT_VERSION,
    PRIOR_COMPAT_VERSION: PRIOR_COMPAT_VERSION,
    priorCompatibilityVersion: PRIOR_COMPAT_VERSION,
    SYSTEMIC_COMPAT_VERSION: SYSTEMIC_COMPAT_VERSION,
    systemicCompatibilityVersion: SYSTEMIC_COMPAT_VERSION,
    renderPlanetOne: renderPlanetOne,
    render: render,
    renderGlobe: renderGlobe,
    mount: mount,
    mountPlanetOne: mountPlanetOne,
    create: create,
    createPlanetOneRender: createPlanetOneRender,
    createPlanetOneScene: createPlanetOneScene,
    start: start,
    pause: pause,
    resume: resume,
    destroy: destroy,
    getStatus: getStatus,
    status: getStatus,
    visualPassClaimed: false
  };

  global.DGBPlanetOneRenderTeam = api;
  global.DGBPlanetOneRenderer = api;
  global.DGBPlanetOneRender = api;

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:asset-generation-2-renderer-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
