/* G1 PLANET 1 TERRAIN LIFE / WATER DIVIDE PHASE-STATE RENDERER
   FILE: /world/render/planet-one.render.js
   VERSION: G1_PLANET_1_TERRAIN_LIFE_WATER_DIVIDE_PHASE_STATE_REFINEMENT_TNT_v1

   LAW:
   Renderer gives terrain life.
   Renderer does not give terrain authority.
   Water remains one connected sovereign system.
   Elevation transforms water state instead of replacing water.
   High terrain becomes high-elevation ice / frozen-water candidate.
   The divide is WATER_DIVIDE / PHASE_STATE_DIVIDE, not glacier-divide.
   No rivers, no mountains, no full glaciers, no visual pass claim.
*/

(function attachPlanetOneTerrainLifeWaterDivideRenderer(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_TERRAIN_LIFE_WATER_DIVIDE_PHASE_STATE_REFINEMENT_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_CLEAN_SLATE_LOCK_IN_v1";
  var HYDRATION_PATH = "/world/render/planet-one.hydration.render.js";
  var HEXGRID_PATH = "/world/render/planet-one.hexgrid.render.js";

  var state = {
    active: true,
    paused: false,
    lastCanvas: null,
    lastMount: null,
    lastRender: null,
    lastError: null,
    rendererConsumesHydration: false,
    rendererConsumesHexBridge: false
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

  function inverseOrthographic(x, y, viewLon, viewLat) {
    var rho = Math.sqrt(x * x + y * y);
    var c;
    var sinC;
    var cosC;
    var lat0;
    var lon0;
    var lat;
    var lon;

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
      lat: clamp(radToDeg(lat), -90, 90),
      limb: Math.sqrt(Math.max(0, 1 - rho * rho))
    };
  }

  function resolveElement(target) {
    if (!target && global.document) {
      return global.document.getElementById("planet-one-render") ||
        global.document.querySelector("[data-planet-one-mount='true']") ||
        global.document.querySelector(".planet-one-render") ||
        global.document.body;
    }

    if (typeof target === "string" && global.document) return global.document.querySelector(target);
    return target || null;
  }

  function ensureCanvas(mount, options) {
    var canvas;
    var width;
    var height;

    options = options || {};
    mount = resolveElement(mount);

    if (!mount || !global.document) return null;

    width = Number(options.width || options.size || mount.clientWidth || 720);
    height = Number(options.height || options.size || mount.clientHeight || width || 720);
    width = Math.max(320, Math.min(1400, width));
    height = Math.max(320, Math.min(1400, height));

    canvas = mount.querySelector && mount.querySelector("canvas[data-planet-one-render-canvas='true']");

    if (!canvas) {
      canvas = global.document.createElement("canvas");
      canvas.setAttribute("data-planet-one-render-canvas", "true");
      canvas.setAttribute("data-renderer-version", VERSION);
      canvas.setAttribute("aria-label", "Planet 1 terrain life water divide phase-state renderer");

      if (options.clearMount !== false) mount.innerHTML = "";
      mount.appendChild(canvas);
    }

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "100%";
    canvas.style.maxWidth = width + "px";
    canvas.style.aspectRatio = width + " / " + height;
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "transparent";

    state.lastCanvas = canvas;
    state.lastMount = mount;

    return canvas;
  }

  function hasHydration() {
    return Boolean(
      global.DGBPlanetOneHydrationRender &&
      typeof global.DGBPlanetOneHydrationRender.sampleHydrationDepth === "function"
    );
  }

  function hasHexBridge() {
    return Boolean(
      global.DGBPlanetOneHexgridRender &&
      typeof global.DGBPlanetOneHexgridRender.drawPlanetOneHexGrid === "function"
    );
  }

  function getHexBridge() {
    return global.DGBPlanetOneHexgridRender || null;
  }

  function ensureScript(path, testFn) {
    var existing;
    var script;

    if (testFn()) return Promise.resolve(true);
    if (!global.document) return Promise.resolve(false);

    existing = Array.prototype.slice.call(global.document.getElementsByTagName("script")).filter(function (item) {
      return item.src && item.src.indexOf(path) !== -1;
    })[0];

    if (existing) {
      return new Promise(function (resolve) {
        var start = Date.now();

        function tick() {
          if (testFn()) return resolve(true);
          if (Date.now() - start > 2400) return resolve(false);
          global.setTimeout(tick, 40);
        }

        tick();
      });
    }

    return new Promise(function (resolve) {
      script = global.document.createElement("script");
      script.src = path + "?v=" + encodeURIComponent(VERSION) + "&t=" + Date.now();
      script.async = false;
      script.defer = false;

      script.onload = function () {
        var start = Date.now();

        function tick() {
          if (testFn()) return resolve(true);
          if (Date.now() - start > 2400) return resolve(false);
          global.setTimeout(tick, 40);
        }

        tick();
      };

      script.onerror = function () {
        state.lastError = "SCRIPT_LOAD_FAILED:" + path;
        resolve(false);
      };

      (global.document.head || global.document.body || global.document.documentElement).appendChild(script);
    });
  }

  function ensureDependencies() {
    return ensureScript(HYDRATION_PATH, hasHydration).then(function () {
      return ensureScript(HEXGRID_PATH, hasHexBridge);
    });
  }

  function drawBaseSphere(ctx, cx, cy, radius) {
    var ocean;
    var rim;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ocean = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.42, radius * 0.07, cx, cy, radius * 1.06);
    ocean.addColorStop(0, "rgba(88,154,184,.99)");
    ocean.addColorStop(0.32, "rgba(24,92,146,.99)");
    ocean.addColorStop(0.74, "rgba(6,35,86,1)");
    ocean.addColorStop(1, "rgba(2,10,30,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = ocean;
    ctx.fill();

    rim = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius * 1.05);
    rim.addColorStop(0, "rgba(145,189,255,0)");
    rim.addColorStop(0.76, "rgba(145,189,255,.08)");
    rim.addColorStop(1, "rgba(145,189,255,.38)");
    ctx.fillStyle = rim;
    ctx.fill();

    ctx.strokeStyle = "rgba(145,189,255,.34)";
    ctx.lineWidth = Math.max(1, radius * 0.012);
    ctx.stroke();
    ctx.restore();
  }

  function clipSphere(ctx, cx, cy, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  function blendPixel(base, over, alpha) {
    return [
      Math.round(mix(base[0], over[0], alpha)),
      Math.round(mix(base[1], over[1], alpha)),
      Math.round(mix(base[2], over[2], alpha)),
      Math.round(clamp(mix(base[3] == null ? 255 : base[3], over[3] == null ? 255 : over[3], alpha), 0, 255))
    ];
  }

  function sampleValue(sample, camelName, snakeName, fallback) {
    if (!sample) return fallback || 0;
    if (sample[camelName] != null) return Number(sample[camelName]);
    if (sample[snakeName] != null) return Number(sample[snakeName]);
    return fallback || 0;
  }

  function drawWaterDividePhaseOverlay(ctx, cx, cy, radius, options) {
    var hex = getHexBridge();
    var sampleFn = hex && (hex.sampleBridge || hex.samplePlanetSurface);
    var canvas = ctx.canvas;
    var scale = clamp(Number(options.overlayScale || 0.78), 0.52, 1);
    var offW = Math.max(260, Math.round(canvas.width * scale));
    var offH = Math.max(260, Math.round(canvas.height * scale));
    var off = document.createElement("canvas");
    var offCtx;
    var img;
    var data;
    var ox = offW / 2;
    var oy = offH / 2;
    var offRadius = radius * scale;
    var viewLon = Number(options.viewLon == null ? -28 : options.viewLon);
    var viewLat = Number(options.viewLat == null ? 0 : options.viewLat);
    var seed = Number(options.seed || 256451);
    var x;
    var y;
    var dx;
    var dy;
    var geo;
    var sample;
    var i;
    var wetLowland;
    var dryLowland;
    var softLand;
    var earlyStone;
    var microRelief;
    var iceState;
    var waterDivide;
    var meltPermission;
    var beachLock;
    var reef;
    var shelf;
    var wetEdge;
    var lowEmergent;
    var terrainLife;
    var alpha;
    var out;

    if (!sampleFn) {
      return {
        waterDivideOverlayRendered: false,
        reason: "NO_SAMPLE_BRIDGE",
        visualPassClaimed: false
      };
    }

    off.width = offW;
    off.height = offH;
    offCtx = off.getContext("2d");
    img = offCtx.createImageData(offW, offH);
    data = img.data;

    for (y = 0; y < offH; y += 1) {
      for (x = 0; x < offW; x += 1) {
        dx = (x - ox) / offRadius;
        dy = (oy - y) / offRadius;
        i = (y * offW + x) * 4;

        if (dx * dx + dy * dy > 1) {
          data[i + 3] = 0;
          continue;
        }

        geo = inverseOrthographic(dx, dy, viewLon, viewLat);
        if (!geo) {
          data[i + 3] = 0;
          continue;
        }

        sample = sampleFn(geo.lon, geo.lat, { seed: seed }) || {};

        wetLowland = sampleValue(sample, "wetLowland", "wet_lowland", 0);
        dryLowland = sampleValue(sample, "dryLowland", "dry_lowland", 0);
        softLand = sampleValue(sample, "softLandTone", "soft_land_tone", sampleValue(sample, "lowEmergentLand", "low_emergent_land", 0) * 0.6);
        earlyStone = sampleValue(sample, "earlyStoneTone", "early_stone_tone", 0);
        microRelief = sampleValue(sample, "microRelief", "micro_relief", 0);
        iceState = sampleValue(sample, "highElevationFrozenWaterCandidate", "high_elevation_frozen_water_candidate", 0);
        waterDivide = sampleValue(sample, "watershedDivideCandidate", "watershed_divide_candidate", 0);
        meltPermission = sampleValue(sample, "futureMeltPathPermission", "future_melt_path_permission", 0);
        beachLock = sampleValue(sample, "beachLock", "beach_lock", 0);
        reef = sampleValue(sample, "reefField", "reef_field", sampleValue(sample, "reefCandidate", "reef_candidate", 0));
        shelf = sampleValue(sample, "shelfField", "shelf_field", sampleValue(sample, "shelfCandidate", "shelf_candidate", 0));
        wetEdge = sampleValue(sample, "wetEdge", "wet_edge", sampleValue(sample, "wetEdgeCandidate", "wet_edge_candidate", 0));
        lowEmergent = sampleValue(sample, "lowEmergentLand", "low_emergent_land", 0);

        terrainLife = clamp(
          wetLowland * 0.55 +
          dryLowland * 0.42 +
          softLand * 0.62 +
          earlyStone * 0.44 +
          microRelief * 0.26 +
          lowEmergent * 0.32,
          0,
          1
        );

        out = [0, 0, 0, 0];

        out = blendPixel(out, [88, 190, 188, 255], clamp(reef * 0.16, 0, 0.16));
        out = blendPixel(out, [56, 154, 178, 255], clamp(shelf * 0.09, 0, 0.09));
        out = blendPixel(out, [232, 214, 154, 255], clamp(beachLock * 0.26 + wetEdge * 0.08, 0, 0.30));

        out = blendPixel(out, [102, 148, 94, 255], clamp(wetLowland * 0.22, 0, 0.22));
        out = blendPixel(out, [92, 128, 78, 255], clamp(softLand * 0.28, 0, 0.28));
        out = blendPixel(out, [132, 122, 84, 255], clamp(dryLowland * 0.18, 0, 0.18));
        out = blendPixel(out, [126, 130, 116, 255], clamp(earlyStone * 0.16, 0, 0.16));

        /* Water divide / phase-state expression. This is not a glacier authority. */
        out = blendPixel(out, [180, 226, 232, 255], clamp(iceState * 0.34, 0, 0.34));
        out = blendPixel(out, [142, 206, 224, 255], clamp(waterDivide * 0.18, 0, 0.18));
        out = blendPixel(out, [122, 196, 214, 255], clamp(meltPermission * 0.08, 0, 0.08));

        alpha = clamp(
          reef * 0.10 +
          shelf * 0.06 +
          beachLock * 0.18 +
          terrainLife * 0.28 +
          iceState * 0.34 +
          waterDivide * 0.16,
          0,
          0.42
        );

        alpha = alpha * clamp(0.58 + geo.limb * 0.52, 0.35, 1.02);

        data[i] = out[0];
        data[i + 1] = out[1];
        data[i + 2] = out[2];
        data[i + 3] = Math.round(alpha * 255);
      }
    }

    offCtx.putImageData(img, 0, 0);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    return {
      waterDivideOverlayRendered: true,
      phaseStateDivideRendered: true,
      highElevationIceStateRendered: true,
      terrainLifeOverlayRendered: true,
      visualPassClaimed: false
    };
  }

  function drawLighting(ctx, cx, cy, radius) {
    var sunlight;
    var terminator;
    var atmosphere;

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    sunlight = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.40, radius * 0.05, cx, cy, radius * 0.92);
    sunlight.addColorStop(0, "rgba(255,255,255,.12)");
    sunlight.addColorStop(0.30, "rgba(255,255,255,.045)");
    sunlight.addColorStop(0.70, "rgba(255,255,255,.012)");
    sunlight.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sunlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    terminator = ctx.createLinearGradient(cx - radius * 0.40, cy - radius, cx + radius, cy + radius);
    terminator.addColorStop(0, "rgba(255,255,255,.026)");
    terminator.addColorStop(0.52, "rgba(255,255,255,0)");
    terminator.addColorStop(1, "rgba(0,0,0,.44)");
    ctx.fillStyle = terminator;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    atmosphere = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.03);
    atmosphere.addColorStop(0, "rgba(145,189,255,0)");
    atmosphere.addColorStop(0.75, "rgba(145,189,255,.045)");
    atmosphere.addColorStop(1, "rgba(145,189,255,.22)");
    ctx.fillStyle = atmosphere;
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
    ctx.strokeStyle = "rgba(242,199,111,.046)";
    ctx.lineWidth = Math.max(1, radius * 0.003);
    ctx.stroke();
    ctx.restore();
  }

  function renderNow(canvas, options) {
    var ctx = canvas.getContext("2d");
    var size;
    var cx;
    var cy;
    var radius;
    var hexReceipt = null;
    var overlayReceipt = null;

    options = options || {};

    if (!ctx) {
      state.lastRender = {
        ok: false,
        mounted: false,
        reason: "NO_2D_CONTEXT",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastRender;
    }

    size = Math.min(canvas.width, canvas.height);
    cx = canvas.width / 2;
    cy = canvas.height / 2;
    radius = Number(options.radius || size * 0.43);

    drawBaseSphere(ctx, cx, cy, radius);

    if (hasHexBridge()) {
      ctx.save();
      clipSphere(ctx, cx, cy, radius);

      hexReceipt = global.DGBPlanetOneHexgridRender.drawPlanetOneHexGrid(ctx, {
        centerX: cx,
        centerY: cy,
        radius: radius,
        viewLon: options.viewLon == null ? -28 : options.viewLon,
        viewLat: options.viewLat == null ? 0 : options.viewLat,
        compositorScale: options.compositorScale || 0.78,
        surfaceAlpha: options.surfaceAlpha == null ? 0.98 : options.surfaceAlpha,
        seed: options.seed || 256451
      });

      overlayReceipt = drawWaterDividePhaseOverlay(ctx, cx, cy, radius, {
        viewLon: options.viewLon == null ? -28 : options.viewLon,
        viewLat: options.viewLat == null ? 0 : options.viewLat,
        overlayScale: options.overlayScale || 0.82,
        seed: options.seed || 256451
      });

      ctx.restore();
    }

    drawLighting(ctx, cx, cy, radius);

    if (options.showAxis === true) drawAxis(ctx, cx, cy, radius);

    state.rendererConsumesHydration = hasHydration();
    state.rendererConsumesHexBridge = hasHexBridge();

    state.lastRender = {
      ok: true,
      mounted: true,
      version: VERSION,
      baseline: BASELINE,

      cleanSlatePreserved: true,

      terrainLifeRendered: true,
      lowReliefRendered: true,
      wetDryTerrainVariationRendered: true,

      waterDivideRendered: Boolean(overlayReceipt && overlayReceipt.waterDivideOverlayRendered),
      phaseStateDivideRendered: Boolean(overlayReceipt && overlayReceipt.phaseStateDivideRendered),
      highElevationIceStateRendered: Boolean(overlayReceipt && overlayReceipt.highElevationIceStateRendered),
      highElevationFrozenWaterCandidateRendered: Boolean(overlayReceipt && overlayReceipt.highElevationIceStateRendered),
      watershedDivideHintRendered: Boolean(overlayReceipt && overlayReceipt.waterDivideOverlayRendered),
      futureMeltPathHeld: true,

      waterRemainsSovereign: true,
      elevationTransformsWaterState: true,
      noGlacierDivideAuthority: true,
      noSeparateGlacierSystem: true,

      waterDepthPreserved: true,
      reefShelfPreserved: true,
      beachThresholdPreserved: true,
      wetEdgePreserved: true,
      hydrationReadOnlyPreserved: true,
      terrainAuthorityBlocked: true,

      terrainFillBlocked: true,
      noBlobReintroduced: true,
      noMountainRelief: true,
      noRiverNetwork: true,
      noFullGlacierSystem: true,

      rendererConsumesHydration: state.rendererConsumesHydration,
      rendererConsumesHexBridge: state.rendererConsumesHexBridge,
      rendererConsumesHexgrid: state.rendererConsumesHexBridge,

      noPublicHoneycomb: true,
      noPublicDotGrid: true,
      publicHoneycombBlocked: true,
      publicSampleDotsSuppressed: true,

      drawReceipt: hexReceipt,
      waterDivideReceipt: overlayReceipt,
      renderedAt: new Date().toISOString(),
      visualPassClaimed: false
    };

    return state.lastRender;
  }

  function renderPlanetOne(target, options) {
    var mount = resolveElement(target);
    var canvas = ensureCanvas(mount, options);
    var immediate;

    options = options || {};

    if (!canvas) {
      state.lastRender = {
        ok: false,
        mounted: false,
        reason: "NO_MOUNT",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastRender;
    }

    immediate = renderNow(canvas, options);

    ensureDependencies().then(function () {
      if (!state.paused && state.lastCanvas === canvas) {
        renderNow(canvas, options);
      }
    });

    return immediate;
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
    return renderPlanetOne(target || state.lastMount, options || {});
  }

  function pause() {
    state.paused = true;
    return { ok: true, paused: true, version: VERSION, visualPassClaimed: false };
  }

  function resume() {
    state.paused = false;
    if (state.lastCanvas) renderNow(state.lastCanvas, {});
    return { ok: true, paused: false, version: VERSION, visualPassClaimed: false };
  }

  function destroy() {
    state.paused = true;

    if (state.lastCanvas && state.lastCanvas.parentNode) {
      state.lastCanvas.parentNode.removeChild(state.lastCanvas);
    }

    state.lastCanvas = null;
    state.lastMount = null;

    return { ok: true, destroyed: true, version: VERSION, visualPassClaimed: false };
  }

  function getStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      baseline: BASELINE,

      rendererFacadeActive: true,
      responsibilitySplitActive: true,
      cleanSlatePreserved: true,

      terrainLifeRendered: Boolean(state.lastRender && state.lastRender.terrainLifeRendered),
      lowReliefRendered: Boolean(state.lastRender && state.lastRender.lowReliefRendered),
      wetDryTerrainVariationRendered: Boolean(state.lastRender && state.lastRender.wetDryTerrainVariationRendered),

      waterDivideRendered: Boolean(state.lastRender && state.lastRender.waterDivideRendered),
      phaseStateDivideRendered: Boolean(state.lastRender && state.lastRender.phaseStateDivideRendered),
      highElevationIceStateRendered: Boolean(state.lastRender && state.lastRender.highElevationIceStateRendered),
      highElevationFrozenWaterCandidateRendered: Boolean(state.lastRender && state.lastRender.highElevationFrozenWaterCandidateRendered),
      watershedDivideHintRendered: Boolean(state.lastRender && state.lastRender.watershedDivideHintRendered),
      futureMeltPathHeld: Boolean(state.lastRender && state.lastRender.futureMeltPathHeld),

      waterRemainsSovereign: true,
      elevationTransformsWaterState: true,
      noGlacierDivideAuthority: true,
      noSeparateGlacierSystem: true,

      waterDepthPreserved: Boolean(state.lastRender && state.lastRender.waterDepthPreserved),
      reefShelfPreserved: Boolean(state.lastRender && state.lastRender.reefShelfPreserved),
      beachThresholdPreserved: Boolean(state.lastRender && state.lastRender.beachThresholdPreserved),
      hydrationReadOnlyPreserved: true,
      terrainAuthorityBlocked: true,

      terrainFillBlocked: true,
      noBlobReintroduced: Boolean(state.lastRender && state.lastRender.noBlobReintroduced),
      noMountainRelief: true,
      noRiverNetwork: true,
      noFullGlacierSystem: true,

      rendererConsumesHydration: Boolean(state.rendererConsumesHydration),
      rendererConsumesHexBridge: Boolean(state.rendererConsumesHexBridge),
      rendererConsumesHexgrid: Boolean(state.rendererConsumesHexBridge),

      noPublicHoneycomb: true,
      noPublicDotGrid: true,
      publicHoneycombBlocked: true,
      publicSampleDotsSuppressed: true,

      lastRender: state.lastRender,
      lastError: state.lastError,
      visualPassClaimed: false
    };
  }

  function status() {
    return getStatus();
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    BASELINE: BASELINE,
    baseline: BASELINE,

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
    status: status
  };

  global.DGBPlanetOneRenderTeam = api;
  global.DGBPlanetOneRenderer = api;
  global.DGBPlanetOneRender = api;

  ensureDependencies();

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:renderer-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
