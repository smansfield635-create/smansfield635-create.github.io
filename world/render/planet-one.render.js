/* G1 PLANET 1 GENERATION 2 SEVEN FILE SYSTEMIC DYNAMIC REWRITE
   FILE: /world/render/planet-one.render.js
   VERSION: G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1

   COMPATIBILITY MARKERS:
   G1_PLANET_1_BLOB_BREAKUP_REAL_PLANET_SURFACE_TNT_v1
   G1_PLANET_1_HYDROLOGY_RECEIVER_VISIBILITY_AND_LAND_ALPHA_REBALANCE_TNT_v1

   ROLE:
   Renderer owns canvas composition only.
   It composes hydration + hexgrid output.
   It does not generate terrain truth, control runtime cadence, or claim visual pass.
*/

(function attachPlanetOneRendererGeneration2(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1";
  var COMPAT_VERSION = "G1_PLANET_1_BLOB_BREAKUP_REAL_PLANET_SURFACE_TNT_v1";
  var PRIOR_COMPAT_VERSION = "G1_PLANET_1_HYDROLOGY_RECEIVER_VISIBILITY_AND_LAND_ALPHA_REBALANCE_TNT_v1";

  var state = {
    active: true,
    mounted: false,
    lastCanvas: null,
    lastMount: null,
    lastOptions: null,
    lastRender: null,
    renderCount: 0,
    paused: false
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function normalizeLon(lon) {
    var x = ((Number(lon) + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
  }

  function degToRad(value) {
    return value * Math.PI / 180;
  }

  function radToDeg(value) {
    return value * 180 / Math.PI;
  }

  function resolveElement(target) {
    if (typeof target === "string" && global.document) return global.document.querySelector(target);

    if (!target && global.document) {
      return global.document.getElementById("planet-one-render") ||
        global.document.querySelector("[data-planet-one-mount='true']") ||
        global.document.querySelector(".planet-one-render");
    }

    return target || null;
  }

  function ensureCanvas(mount, options) {
    var canvas;
    var size;

    options = options || {};
    mount = resolveElement(mount);

    if (!mount || !global.document) return null;

    size = Number(options.size || options.width || mount.clientWidth || 720);
    size = Math.max(320, Math.min(1400, size));

    canvas = mount.querySelector && mount.querySelector("canvas[data-planet-one-render-canvas='true']");

    if (!canvas) {
      canvas = global.document.createElement("canvas");
      canvas.setAttribute("data-planet-one-render-canvas", "true");
      canvas.setAttribute("data-renderer-version", VERSION);
      canvas.setAttribute("data-renderer-role", "canvas-composition-only");
      canvas.setAttribute("data-visual-pass-claimed", "false");
      canvas.setAttribute("aria-label", "Planet 1 Generation 2 renderer");

      if (options.clearMount !== false && !mount.querySelector("canvas")) {
        mount.innerHTML = "";
      }

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

    state.lastCanvas = canvas;
    state.lastMount = mount;
    state.mounted = true;

    return canvas;
  }

  function inverseOrthographic(x, y, viewLon, viewLat) {
    var rho = Math.sqrt(x * x + y * y);
    var c, sinC, cosC, lat0, lon0, lat, lon;

    if (rho > 1) return null;
    if (rho < 0.000001) return { lon: normalizeLon(viewLon), lat: viewLat || 0, limb: 1 };

    c = Math.asin(rho);
    sinC = Math.sin(c);
    cosC = Math.cos(c);
    lat0 = degToRad(viewLat || 0);
    lon0 = degToRad(viewLon || 0);

    lat = Math.asin(cosC * Math.sin(lat0) + (y * sinC * Math.cos(lat0)) / rho);
    lon = lon0 + Math.atan2(
      x * sinC,
      rho * Math.cos(lat0) * cosC - y * Math.sin(lat0) * sinC
    );

    return {
      lon: normalizeLon(radToDeg(lon)),
      lat: Math.max(-90, Math.min(90, radToDeg(lat))),
      limb: Math.sqrt(Math.max(0, 1 - rho * rho))
    };
  }

  function sampleSurface(lon, lat, options) {
    if (global.DGBPlanetOneHexgridRender && typeof global.DGBPlanetOneHexgridRender.sampleSurface === "function") {
      return global.DGBPlanetOneHexgridRender.sampleSurface(lon, lat, options);
    }

    return {
      lon: lon,
      lat: lat,
      elevation: 0,
      landMask: 0,
      liquidWater: 1,
      interiorWater: 0,
      shelf: 0,
      coast: 0,
      wetEdge: 0,
      ridgeLine: 0,
      basinShadow: 0,
      vegetation: 0,
      mineral: 0,
      drySurface: 0,
      roughness: 0,
      fractureNetwork: 0,
      airMask: 0,
      ice: 0,
      waterRemainsWater: true
    };
  }

  function mixColor(a, b, t) {
    return [
      mix(a[0], b[0], t),
      mix(a[1], b[1], t),
      mix(a[2], b[2], t)
    ];
  }

  function surfaceColor(sample, limb) {
    var waterDeep = [4, 16, 58];
    var waterMid = [9, 75, 130];
    var waterShelf = [48, 148, 168];
    var inlandWater = [8, 104, 122];

    var wetSoil = [42, 62, 48];
    var green = [38, 96, 54];
    var brown = [88, 72, 50];
    var slate = [66, 74, 76];
    var ridge = [126, 116, 88];
    var ice = [178, 222, 228];

    var water = mixColor(waterDeep, waterMid, clamp(sample.liquidWater, 0, 1));
    water = mixColor(water, waterShelf, clamp(sample.shelf * 0.40 + sample.coast * 0.18, 0, 0.58));
    water = mixColor(water, inlandWater, clamp(sample.interiorWater * 0.62, 0, 0.62));

    var land = mixColor(brown, green, clamp(sample.vegetation * 0.56, 0, 0.56));
    land = mixColor(land, wetSoil, clamp(sample.wetEdge * 0.40 + sample.interiorWater * 0.54, 0, 0.72));
    land = mixColor(land, slate, clamp(sample.mineral * 0.34 + sample.fractureNetwork * 0.24, 0, 0.50));
    land = mixColor(land, ridge, clamp(sample.ridgeLine * 0.20, 0, 0.22));
    land = mixColor(land, ice, clamp(sample.ice * 0.30, 0, 0.30));

    var landAlpha = clamp(sample.landMask * (0.64 + sample.roughness * 0.20) * (1 - sample.interiorWater * 0.50), 0, 0.90);
    var color = mixColor(water, land, landAlpha);

    var shadow = clamp(1 - sample.basinShadow * 0.20 - sample.roughness * 0.08, 0.72, 1);
    var shade = clamp(0.50 + limb * 0.56, 0.36, 1.08);

    return [
      Math.round(color[0] * shade * shadow),
      Math.round(color[1] * shade * shadow),
      Math.round(color[2] * shade * shadow),
      255
    ];
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    var halo = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.08);
    halo.addColorStop(0, "rgba(145,190,255,0)");
    halo.addColorStop(0.84, "rgba(145,190,255,.026)");
    halo.addColorStop(1, "rgba(145,190,255,.16)");

    ctx.save();
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawLighting(ctx, cx, cy, radius) {
    var terminator;
    var highlight;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    highlight = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.40, radius * 0.05, cx, cy, radius * 0.95);
    highlight.addColorStop(0, "rgba(255,255,255,.080)");
    highlight.addColorStop(0.36, "rgba(255,255,255,.026)");
    highlight.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = highlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    terminator = ctx.createLinearGradient(cx - radius * 0.42, cy - radius, cx + radius, cy + radius);
    terminator.addColorStop(0, "rgba(255,255,255,.012)");
    terminator.addColorStop(0.50, "rgba(255,255,255,0)");
    terminator.addColorStop(1, "rgba(0,0,0,.34)");
    ctx.fillStyle = terminator;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();
  }

  function drawAxis(ctx, cx, cy, radius) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.28);
    ctx.beginPath();
    ctx.moveTo(0, -radius * 1.10);
    ctx.lineTo(0, radius * 1.10);
    ctx.strokeStyle = "rgba(242,199,111,.075)";
    ctx.lineWidth = Math.max(1, radius * 0.004);
    ctx.stroke();
    ctx.restore();
  }

  function renderToCanvas(canvas, options) {
    var ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
    var size, cx, cy, radius, resolution, off, offCtx, image, data, x, y, dx, dy, idx, geo, sample, color;

    options = options || {};
    if (!ctx) {
      state.lastRender = {
        ok: false,
        reason: "NO_CANVAS_CONTEXT",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastRender;
    }

    size = Math.min(canvas.width, canvas.height);
    cx = size / 2;
    cy = size / 2;
    radius = size * 0.43;
    resolution = Math.max(260, Math.min(760, Math.round(size * clamp(options.resolutionScale || 0.82, 0.44, 1))));

    off = document.createElement("canvas");
    off.width = resolution;
    off.height = resolution;
    offCtx = off.getContext("2d");
    image = offCtx.createImageData(resolution, resolution);
    data = image.data;

    for (y = 0; y < resolution; y += 1) {
      for (x = 0; x < resolution; x += 1) {
        dx = (x - resolution / 2) / (resolution * 0.43);
        dy = (resolution / 2 - y) / (resolution * 0.43);
        idx = (y * resolution + x) * 4;

        if (dx * dx + dy * dy > 1) {
          data[idx + 3] = 0;
          continue;
        }

        geo = inverseOrthographic(dx, dy, options.viewLon == null ? -28 : options.viewLon, options.viewLat || 0);
        sample = sampleSurface(geo.lon, geo.lat, options);
        color = surfaceColor(sample, geo.limb);

        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = color[3];
      }
    }

    offCtx.putImageData(image, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    drawAtmosphere(ctx, canvas.width / 2, canvas.height / 2, radius);
    drawLighting(ctx, canvas.width / 2, canvas.height / 2, radius);

    if (options.showAxis === true) drawAxis(ctx, canvas.width / 2, canvas.height / 2, radius);

    state.renderCount += 1;
    state.lastRender = {
      ok: true,
      mounted: true,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      rendererRole: "CANVAS_COMPOSITION_ONLY",
      renderCount: state.renderCount,
      viewLon: options.viewLon == null ? -28 : options.viewLon,
      viewLat: options.viewLat || 0,
      consumesHydration: Boolean(global.DGBPlanetOneHydrationRender),
      consumesHexgrid: Boolean(global.DGBPlanetOneHexgridRender),
      ownsSurfaceTruth: false,
      ownsRuntimeCadence: false,
      ownsRouteMount: false,
      visualPassClaimed: false,
      renderedAt: new Date().toISOString()
    };

    return state.lastRender;
  }

  function renderPlanetOne(target, options) {
    var mount = resolveElement(target);
    var canvas;

    options = options || {};
    state.lastOptions = Object.assign({}, options);

    canvas = ensureCanvas(mount, options);
    if (!canvas) {
      state.lastRender = {
        ok: false,
        reason: "NO_MOUNT",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastRender;
    }

    return renderToCanvas(canvas, options);
  }

  function render(target, options) { return renderPlanetOne(target, options); }
  function renderGlobe(target, options) { return renderPlanetOne(target, options); }
  function mount(target, options) { return renderPlanetOne(target, options); }
  function mountPlanetOne(target, options) { return renderPlanetOne(target, options); }
  function create(target, options) { return renderPlanetOne(target, options); }
  function createPlanetOneRender(target, options) { return renderPlanetOne(target, options); }
  function createPlanetOneScene(target, options) { return renderPlanetOne(target, options); }

  function start(target, options) {
    state.paused = false;
    return renderPlanetOne(target || state.lastMount, options || state.lastOptions || {});
  }

  function pause() {
    state.paused = true;
    return { ok: true, paused: true, version: VERSION, visualPassClaimed: false };
  }

  function resume() {
    state.paused = false;
    if (state.lastCanvas) return renderToCanvas(state.lastCanvas, state.lastOptions || {});
    return { ok: true, paused: false, version: VERSION, visualPassClaimed: false };
  }

  function destroy() {
    state.paused = true;
    if (state.lastCanvas && state.lastCanvas.parentNode) {
      state.lastCanvas.parentNode.removeChild(state.lastCanvas);
    }
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
      role: "CANVAS_COMPOSITION_ONLY",
      systemicDynamicStandardActive: true,
      ownsCanvasComposition: true,
      ownsSurfaceTruth: false,
      ownsRuntimeCadence: false,
      ownsControlState: false,
      ownsRouteMount: false,
      mounted: state.mounted,
      renderCount: state.renderCount,
      lastRender: state.lastRender,
      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    COMPAT_VERSION: COMPAT_VERSION,
    compatibilityVersion: COMPAT_VERSION,
    PRIOR_COMPAT_VERSION: PRIOR_COMPAT_VERSION,
    priorCompatibilityVersion: PRIOR_COMPAT_VERSION,

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
    global.dispatchEvent(new CustomEvent("dgb:planet-one:renderer:generation-2-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
