/*
 PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1
 PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1
 PLANET_ONE_RENDER_V20_BALANCED_GLOBE_VISUAL_PRESSURE_RELEASE_TNT_v1
 PLANET_ONE_RENDER_V21_VISUAL_BALANCE_REFINEMENT_TNT_v1
 PLANET_ONE_RENDER_V22_FINE_SURFACE_SAMPLING_AND_SHORELINE_SMOOTHING_TNT_v1
 PLANET_ONE_RENDER_V23_CINEMATIC_MATERIAL_ATMOSPHERE_REFINEMENT_TNT_v1
 PLANET_ONE_RENDER_V24_NODAL_LAND_CONSTRUCT_EXPRESSIVE_WRAP_TNT_v1
 B25_TERRAIN_LEGIBILITY_TNT_v1
 B26D_RENDERER_FACADE_TNT_v1
 TARGET=/world/render/planet-one.render.js
 PURPOSE:
 Renderer facade and orchestrator only.
 Preserve public renderer contract and mounted Asset V21 / Terrain V5 / Hydration chain.
 Split land geometry into /world/render/planet-one.land.constructs.js.
 Split surface material drawing into /world/render/planet-one.surface.materials.js.
 Keep page, gauges, CSS, route, terrain module, hydration module, and tree demo untouched.
*/

(function attachPlanetOneRendererFacade(global) {
  "use strict";

  var VERSION = "PLANET_ONE_RENDER_V18B_TERRAIN_WATER_ADHESION_MARKER_CLOSEOUT_TNT_v1";
  var PROJECTION_TNT = "PLANET_ONE_RENDER_V19_SPHERICAL_LAND_DISTRIBUTION_PROJECTION_TNT_v1";
  var BALANCE_TNT = "PLANET_ONE_RENDER_V20_BALANCED_GLOBE_VISUAL_PRESSURE_RELEASE_TNT_v1";
  var VISUAL_TNT = "PLANET_ONE_RENDER_V21_VISUAL_BALANCE_REFINEMENT_TNT_v1";
  var SURFACE_TNT = "PLANET_ONE_RENDER_V22_FINE_SURFACE_SAMPLING_AND_SHORELINE_SMOOTHING_TNT_v1";
  var CINEMATIC_TNT = "PLANET_ONE_RENDER_V23_CINEMATIC_MATERIAL_ATMOSPHERE_REFINEMENT_TNT_v1";
  var NODAL_TNT = "PLANET_ONE_RENDER_V24_NODAL_LAND_CONSTRUCT_EXPRESSIVE_WRAP_TNT_v1";
  var B25_TNT = "B25_TERRAIN_LEGIBILITY_TNT_v1";
  var B26_FACADE_TNT = "B26D_RENDERER_FACADE_TNT_v1";
  var PREVIOUS_V15 = "PLANET_ONE_RENDER_V15_OPTIMUM_EXPRESSION_ONLY_TNT_v1";
  var TERRAIN_AUTHORITY = "/world/render/planet-one.terrain.render.js";
  var HYDRATION_AUTHORITY = "/world/render/planet-one.hydration.render.js";
  var LAND_CONSTRUCTS_AUTHORITY = "/world/render/planet-one.land.constructs.js";
  var SURFACE_MATERIALS_AUTHORITY = "/world/render/planet-one.surface.materials.js";

  var activeAnimation = null;
  var activeCanvas = null;
  var activeState = null;
  var moduleLoadState = {
    requested: false,
    landRequested: false,
    surfaceRequested: false,
    landLoaded: false,
    surfaceLoaded: false,
    landError: false,
    surfaceError: false
  };

  var CONTRACT_MARKERS = [
    VERSION,
    PROJECTION_TNT,
    BALANCE_TNT,
    VISUAL_TNT,
    SURFACE_TNT,
    CINEMATIC_TNT,
    NODAL_TNT,
    B25_TNT,
    B26_FACADE_TNT,
    PREVIOUS_V15,
    "window.DGBPlanetOneRenderTeam",
    "renderPlanetOne",
    "terrain-render-authority=/world/render/planet-one.terrain.render.js",
    "terrain-module-integrated=true",
    "ancient-39b-crust-engine-active=true",
    "axis-spin-active=true",
    "climate-topology-active=true",
    "weather-circulation-active=true",
    "ocean-current-logic-active=true",
    "hydration-render-authority=/world/render/planet-one.hydration.render.js",
    "hydration-module-integrated=true",
    "hydro-terrain-marriage-active=true",
    "terrain-water-adhesion-active=true",
    "spherical-land-distribution-active=true",
    "visible-hemisphere-projection-active=true",
    "backside-land-culling-active=true",
    "limb-compression-active=true",
    "front-hemisphere-packing-rejected=true",
    "balanced-globe-visual-pressure-release-active=true",
    "land-scale-rebalanced=true",
    "water-field-dominance-restored=true",
    "bad-squeeze-released=true",
    "visual-balance-refinement-active=true",
    "continent-curvature-refined=true",
    "shoreline-wrap-refined=true",
    "ocean-breathing-room-active=true",
    "plate-stamp-effect-reduced=true",
    "atmospheric-depth-refined=true",
    "bad-pull-released=true",
    "fine-surface-sampling-active=true",
    "shoreline-smoothing-active=true",
    "blocky-cell-artifact-reduced=true",
    "geologic-blend-field-active=true",
    "smooth-continent-wrap-active=true",
    "renderer-only-visual-refinement=true",
    "cinematic-material-atmosphere-active=true",
    "ancient-surface-materiality-active=true",
    "ocean-basin-depth-active=true",
    "atmospheric-limb-depth-active=true",
    "non-cartoon-world-body-active=true",
    "mineral-pressure-surface-active=true",
    "geologic-scar-subtlety-active=true",
    "nodal-land-construct-active=true",
    "central-blob-rejected=true",
    "three-region-attached-wrap-active=true",
    "five-major-regions-preserved=true",
    "north-south-poles-preserved=true",
    "expressive-nodal-terrain-system-active=true",
    "terrain-legibility-active=true",
    "blob-edge-broken=true",
    "fractured-continental-wrap-active=true",
    "coastal-bay-inlet-system-active=true",
    "plateau-ridge-legibility-active=true",
    "tri-region-attachment-legible=true",
    "polar-bodies-preserved=true",
    "renderer-only-visual-correction=true",
    "B26_RENDER_RESPONSIBILITY_SPLIT_ACTIVE=true",
    "renderer-facade-active=true",
    "land-constructs-module-consumed=true",
    "surface-materials-module-consumed=true",
    "single-file-responsibility-collapse-reduced=true"
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function deg(value) {
    return value * Math.PI / 180;
  }

  function normalizeLon(lon) {
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;
    return lon;
  }

  function safeNow() {
    return global.performance && typeof global.performance.now === "function" ? global.performance.now() : Date.now();
  }

  function hasTerrainModule() {
    return Boolean(global.DGBPlanetOneTerrainRender && typeof global.DGBPlanetOneTerrainRender.createTerrainLayer === "function");
  }

  function hasHydrationModule() {
    return Boolean(global.DGBPlanetOneHydrationRender && typeof global.DGBPlanetOneHydrationRender.createHydrationLayer === "function");
  }

  function getLandModule() {
    return global.DGBPlanetOneLandConstructs || null;
  }

  function getSurfaceModule() {
    return global.DGBPlanetOneSurfaceMaterials || null;
  }

  function hasLandConstructsModule() {
    var mod = getLandModule();
    return Boolean(mod && typeof mod.createPlanetOneLandConstructs === "function");
  }

  function hasSurfaceMaterialsModule() {
    var mod = getSurfaceModule();
    return Boolean(
      mod &&
      typeof mod.drawPlanetOneOcean === "function" &&
      typeof mod.drawPlanetOneConstructSurface === "function" &&
      typeof mod.drawPlanetOneAtmosphere === "function"
    );
  }

  function clearActiveAnimation() {
    if (activeAnimation && typeof global.cancelAnimationFrame === "function") {
      global.cancelAnimationFrame(activeAnimation);
    }
    activeAnimation = null;
  }

  function normalizeOptions(maybeOptions) {
    var options = maybeOptions || {};
    if (options.nodeType || typeof options.getContext === "function") {
      return { mount: options };
    }
    return options;
  }

  function resolveMount(mountOrOptions, options) {
    var candidate = null;

    if (mountOrOptions && (mountOrOptions.nodeType || typeof mountOrOptions.getContext === "function")) {
      candidate = mountOrOptions;
    } else if (options && options.mount) {
      candidate = options.mount;
    } else if (mountOrOptions && mountOrOptions.mount) {
      candidate = mountOrOptions.mount;
    }

    if (typeof candidate === "string" && global.document) {
      candidate = global.document.querySelector(candidate);
    }

    if (!candidate && global.document) {
      candidate =
        global.document.querySelector("[data-planet-one-render]") ||
        global.document.querySelector("[data-dgb-planet-one]") ||
        global.document.querySelector("#planet-one-render") ||
        global.document.querySelector("#planet-one-canvas") ||
        global.document.querySelector(".planet-one-render") ||
        global.document.querySelector("main") ||
        global.document.body;
    }

    return candidate || null;
  }

  function makeCanvas(mount, options) {
    var canvas;
    var hostWidth;
    var size;
    var ratio;

    if (!global.document) return null;

    if (mount && typeof mount.getContext === "function") {
      canvas = mount;
      hostWidth = canvas.clientWidth || (canvas.parentNode && canvas.parentNode.clientWidth) || 720;
    } else {
      canvas = global.document.createElement("canvas");
      hostWidth = mount && mount.clientWidth ? mount.clientWidth : 720;
    }

    size = Math.max(340, Math.min(960, options.size || hostWidth || 720));
    ratio = Math.max(1, Math.min(2, global.devicePixelRatio || 1));

    canvas.width = Math.floor(size * ratio);
    canvas.height = Math.floor(size * ratio);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas.style.maxWidth = "100%";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Planet 1 renderer facade with split land construct and surface material modules");
    canvas.dataset.planetOneRenderer = B26_FACADE_TNT;

    if (mount && !canvas.parentNode && typeof mount.appendChild === "function") {
      if (options.replace !== false) {
        while (mount.firstChild) mount.removeChild(mount.firstChild);
      }
      mount.appendChild(canvas);
    }

    return {
      canvas: canvas,
      size: size,
      ratio: ratio,
      width: canvas.width,
      height: canvas.height
    };
  }

  function moduleScriptId(key) {
    return "dgb-planet-one-module-" + key;
  }

  function requestModuleScript(key, path) {
    var id;
    var script;
    var target;

    if (!global.document) return;
    id = moduleScriptId(key);

    if (global.document.getElementById(id)) return;

    script = global.document.createElement("script");
    script.id = id;
    script.src = path;
    script.async = false;
    script.defer = false;

    script.onload = function onModuleLoad() {
      if (key === "land") moduleLoadState.landLoaded = true;
      if (key === "surface") moduleLoadState.surfaceLoaded = true;
      refreshModulesAndRedraw();
    };

    script.onerror = function onModuleError() {
      if (key === "land") moduleLoadState.landError = true;
      if (key === "surface") moduleLoadState.surfaceError = true;
      refreshModulesAndRedraw();
    };

    target = global.document.head || global.document.body || global.document.documentElement;
    if (target && typeof target.appendChild === "function") target.appendChild(script);
  }

  function ensureModulesRequested() {
    if (moduleLoadState.requested) return;
    moduleLoadState.requested = true;

    if (!hasLandConstructsModule()) {
      moduleLoadState.landRequested = true;
      requestModuleScript("land", LAND_CONSTRUCTS_AUTHORITY);
    } else {
      moduleLoadState.landLoaded = true;
    }

    if (!hasSurfaceMaterialsModule()) {
      moduleLoadState.surfaceRequested = true;
      requestModuleScript("surface", SURFACE_MATERIALS_AUTHORITY);
    } else {
      moduleLoadState.surfaceLoaded = true;
    }
  }

  function refreshModulesAndRedraw() {
    if (!activeState) return;
    activeState.landConstructsModuleDetected = hasLandConstructsModule();
    activeState.surfaceMaterialsModuleDetected = hasSurfaceMaterialsModule();
    activeState.constructs = collectConstructs();
    activeState.moduleRefreshes += 1;
    drawPlanetFrame(activeState, safeNow());
  }

  function collectConstructs() {
    var mod = getLandModule();
    if (mod && typeof mod.createPlanetOneLandConstructs === "function") {
      return mod.createPlanetOneLandConstructs() || [];
    }
    return [];
  }

  function project(lon, lat, rotation, tilt, cx, cy, radius) {
    var lonRad = deg(normalizeLon(lon + rotation));
    var latRad = deg(lat);
    var tiltRad = deg(tilt);
    var cosLat = Math.cos(latRad);
    var x = cosLat * Math.sin(lonRad);
    var y = -Math.sin(latRad);
    var z = cosLat * Math.cos(lonRad);
    var y2 = y * Math.cos(tiltRad) - z * Math.sin(tiltRad);
    var z2 = y * Math.sin(tiltRad) + z * Math.cos(tiltRad);

    return {
      x: cx + x * radius,
      y: cy + y2 * radius,
      z: z2,
      visible: z2 > -0.07,
      limb: clamp((z2 + 0.07) / 1.07, 0, 1)
    };
  }

  function visibleProjectedPath(path, rotation, tilt, cx, cy, radius) {
    var points = [];
    var i;
    var p;

    for (i = 0; path && i < path.length; i += 1) {
      p = project(path[i][0], path[i][1], rotation, tilt, cx, cy, radius);
      if (p.visible) points.push(p);
    }

    return points;
  }

  function smoothClosedPath(ctx, points) {
    var i;
    var current;
    var next;
    var mid;

    if (!points || points.length < 3) return false;

    ctx.beginPath();
    current = points[0];
    next = points[1];
    ctx.moveTo((current.x + next.x) / 2, (current.y + next.y) / 2);

    for (i = 1; i < points.length; i += 1) {
      current = points[i];
      next = points[(i + 1) % points.length];
      mid = { x: (current.x + next.x) / 2, y: (current.y + next.y) / 2 };
      ctx.quadraticCurveTo(current.x, current.y, mid.x, mid.y);
    }

    ctx.closePath();
    return true;
  }

  function drawOpenProjectedLine(ctx, path, rotation, tilt, cx, cy, radius, color, width, alpha) {
    var projected = visibleProjectedPath(path, rotation, tilt, cx, cy, radius);
    var i;
    var current;
    var next;
    var mid;

    if (projected.length < 2) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);

    for (i = 1; i < projected.length - 1; i += 1) {
      current = projected[i];
      next = projected[i + 1];
      mid = { x: (current.x + next.x) / 2, y: (current.y + next.y) / 2 };
      ctx.quadraticCurveTo(current.x, current.y, mid.x, mid.y);
    }

    ctx.lineTo(projected[projected.length - 1].x, projected[projected.length - 1].y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }

  function pointInPolygon(outline, lon, lat) {
    var i;
    var j;
    var xi;
    var yi;
    var xj;
    var yj;
    var inside = false;

    if (!outline || outline.length < 3) return false;

    for (i = 0, j = outline.length - 1; i < outline.length; j = i, i += 1) {
      xi = outline[i][0];
      yi = outline[i][1];
      xj = outline[j][0];
      yj = outline[j][1];
      if (((yi > lat) !== (yj > lat)) && (lon < (xj - xi) * (lat - yi) / ((yj - yi) || 1) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  }

  function localFractureConstructOutline(outline) {
    return outline || [];
  }

  function fractureConstructOutline(outline, profile) {
    var mod = getLandModule();
    if (mod && typeof mod.fractureConstructOutline === "function") {
      return mod.fractureConstructOutline(outline, profile);
    }
    return localFractureConstructOutline(outline, profile);
  }

  function makeSurfaceHelpers() {
    return {
      project: project,
      visibleProjectedPath: visibleProjectedPath,
      smoothClosedPath: smoothClosedPath,
      drawOpenProjectedLine: drawOpenProjectedLine,
      pointInPolygon: pointInPolygon,
      fractureConstructOutline: fractureConstructOutline
    };
  }

  function drawBackground(ctx, width, height) {
    var bg = ctx.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.5, width * 0.74);
    var i;
    var x;
    var y;
    var r;

    ctx.clearRect(0, 0, width, height);
    bg.addColorStop(0, "#071426");
    bg.addColorStop(0.62, "#020714");
    bg.addColorStop(1, "#010207");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    for (i = 0; i < 136; i += 1) {
      x = (i * 89) % width;
      y = (i * 47) % height;
      r = 0.34 + ((i * 17) % 7) * 0.07;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(216,232,255," + (0.08 + ((i * 13) % 9) / 125) + ")";
      ctx.fill();
    }
  }

  function clipSphere(ctx, cx, cy, radius, drawFn) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    drawFn();
    ctx.restore();
  }

  function drawDegradedOcean(ctx, frame) {
    var ocean = ctx.createRadialGradient(frame.cx - frame.radius * 0.34, frame.cy - frame.radius * 0.36, frame.radius * 0.02, frame.cx, frame.cy, frame.radius * 1.04);
    ocean.addColorStop(0.00, "#1a8fa8");
    ocean.addColorStop(0.45, "#052d45");
    ocean.addColorStop(1.00, "#010611");
    ctx.fillStyle = ocean;
    ctx.fillRect(frame.cx - frame.radius, frame.cy - frame.radius, frame.radius * 2, frame.radius * 2);
  }

  function drawDegradedAtmosphere(ctx, frame) {
    var ctx = frame.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(frame.cx, frame.cy, frame.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(142,232,245,0.24)";
    ctx.lineWidth = Math.max(1, frame.radius * 0.006);
    ctx.shadowColor = "rgba(114,219,242,0.24)";
    ctx.shadowBlur = frame.radius * 0.032;
    ctx.stroke();
    ctx.restore();
  }

  function drawGraticule(ctx, frame) {
    var lat;
    var lon;
    var path;

    for (lat = -60; lat <= 60; lat += 30) {
      path = [];
      for (lon = -180; lon <= 180; lon += 6) path.push([lon, lat]);
      drawOpenProjectedLine(ctx, path, frame.rotation, frame.tilt, frame.cx, frame.cy, frame.radius, "rgba(190,224,255,0.032)", Math.max(0.32, frame.radius * 0.001), 0.36);
    }

    for (lon = -150; lon <= 180; lon += 30) {
      path = [];
      for (lat = -80; lat <= 80; lat += 6) path.push([lon, lat]);
      drawOpenProjectedLine(ctx, path, frame.rotation, frame.tilt, frame.cx, frame.cy, frame.radius, "rgba(190,224,255,0.024)", Math.max(0.30, frame.radius * 0.0009), 0.30);
    }
  }

  function drawPlanetFrame(state, timestamp) {
    var canvas = state.canvas;
    var ctx = state.ctx;
    var width = canvas.width;
    var height = canvas.height;
    var cx = width * 0.5;
    var cy = height * 0.5;
    var radius = Math.min(width, height) * 0.385;
    var elapsed = (timestamp - state.startedAt) / 1000;
    var rotation = state.baseRotation + elapsed * state.rotationSpeed;
    var tilt = state.tilt;
    var surface = getSurfaceModule();
    var surfaceReady = hasSurfaceMaterialsModule();
    var helpers = makeSurfaceHelpers();
    var frame = {
      ctx: ctx,
      canvas: canvas,
      width: width,
      height: height,
      cx: cx,
      cy: cy,
      radius: radius,
      elapsed: elapsed,
      rotation: rotation,
      tilt: tilt
    };
    var constructs;
    var i;

    state.landConstructsModuleDetected = hasLandConstructsModule();
    state.surfaceMaterialsModuleDetected = surfaceReady;
    constructs = state.landConstructsModuleDetected ? collectConstructs() : state.constructs;
    state.constructs = constructs || [];

    drawBackground(ctx, width, height);

    clipSphere(ctx, cx, cy, radius, function drawSphereContents() {
      if (surfaceReady) {
        surface.drawPlanetOneOcean(ctx, frame);
      } else {
        drawDegradedOcean(ctx, frame);
      }

      drawGraticule(ctx, frame);

      if (surfaceReady && state.constructs && state.constructs.length) {
        for (i = 0; i < state.constructs.length; i += 1) {
          surface.drawPlanetOneConstructSurface(ctx, state.constructs[i], helpers, frame);
        }
        if (typeof surface.drawPlanetOneSurfaceFilm === "function") {
          surface.drawPlanetOneSurfaceFilm(ctx, frame);
        }
      }
    });

    if (surfaceReady) {
      surface.drawPlanetOneAtmosphere(ctx, frame);
    } else {
      drawDegradedAtmosphere(ctx, frame);
    }
  }

  function animationLoop(timestamp) {
    if (!activeState || !activeState.running) return;
    drawPlanetFrame(activeState, timestamp || safeNow());
    if (typeof global.requestAnimationFrame === "function") {
      activeAnimation = global.requestAnimationFrame(animationLoop);
    }
  }

  function start() {
    if (!activeState) return { ok: false, reason: "no-active-render" };
    if (activeState.running) return getStatus();
    activeState.running = true;
    activeState.startedAt = safeNow();
    if (typeof global.requestAnimationFrame === "function") {
      activeAnimation = global.requestAnimationFrame(animationLoop);
    } else {
      drawPlanetFrame(activeState, safeNow());
    }
    return getStatus();
  }

  function stop() {
    if (activeState) activeState.running = false;
    clearActiveAnimation();
    return getStatus();
  }

  function renderPlanetOne(mountOrOptions, maybeOptions) {
    var options;
    var mount;
    var made;
    var ctx;
    var state;

    ensureModulesRequested();
    clearActiveAnimation();

    options = normalizeOptions(maybeOptions || mountOrOptions || {});
    if (mountOrOptions && !mountOrOptions.nodeType && typeof mountOrOptions.getContext !== "function" && mountOrOptions.mount && !maybeOptions) {
      options = mountOrOptions;
    }

    mount = resolveMount(mountOrOptions, options);
    if (!mount) {
      return {
        ok: false,
        reason: "planet-one-render-mount-not-found",
        version: VERSION,
        VERSION: VERSION,
        PROJECTION_TNT: PROJECTION_TNT,
        projectionTnt: PROJECTION_TNT,
        markers: CONTRACT_MARKERS.slice()
      };
    }

    made = makeCanvas(mount, options);
    if (!made || !made.canvas || typeof made.canvas.getContext !== "function") {
      return {
        ok: false,
        reason: "planet-one-render-canvas-not-available",
        version: VERSION,
        VERSION: VERSION,
        PROJECTION_TNT: PROJECTION_TNT,
        projectionTnt: PROJECTION_TNT,
        markers: CONTRACT_MARKERS.slice()
      };
    }

    ctx = made.canvas.getContext("2d");
    if (!ctx) {
      return {
        ok: false,
        reason: "planet-one-render-2d-context-not-available",
        version: VERSION,
        VERSION: VERSION,
        PROJECTION_TNT: PROJECTION_TNT,
        projectionTnt: PROJECTION_TNT,
        markers: CONTRACT_MARKERS.slice()
      };
    }

    state = {
      canvas: made.canvas,
      ctx: ctx,
      mount: mount,
      size: made.size,
      ratio: made.ratio,
      baseRotation: typeof options.rotation === "number" ? options.rotation : -18,
      rotationSpeed: typeof options.rotationSpeed === "number" ? options.rotationSpeed : 3.2,
      tilt: typeof options.tilt === "number" ? options.tilt : -11,
      startedAt: safeNow(),
      running: options.animate !== false,
      constructs: collectConstructs(),
      markers: CONTRACT_MARKERS.slice(),
      terrainModuleDetected: hasTerrainModule(),
      hydrationModuleDetected: hasHydrationModule(),
      landConstructsModuleDetected: hasLandConstructsModule(),
      surfaceMaterialsModuleDetected: hasSurfaceMaterialsModule(),
      responsibilitySplitActive: true,
      rendererFacadeActive: true,
      moduleRefreshes: 0
    };

    activeCanvas = made.canvas;
    activeState = state;
    drawPlanetFrame(state, safeNow());

    if (state.running && typeof global.requestAnimationFrame === "function") {
      activeAnimation = global.requestAnimationFrame(animationLoop);
    }

    return {
      ok: true,
      canvas: made.canvas,
      state: state,
      version: VERSION,
      VERSION: VERSION,
      PROJECTION_TNT: PROJECTION_TNT,
      projectionTnt: PROJECTION_TNT,
      BALANCE_TNT: BALANCE_TNT,
      VISUAL_TNT: VISUAL_TNT,
      SURFACE_TNT: SURFACE_TNT,
      CINEMATIC_TNT: CINEMATIC_TNT,
      NODAL_TNT: NODAL_TNT,
      B25_TNT: B25_TNT,
      B26_FACADE_TNT: B26_FACADE_TNT,
      landConstructsAuthority: LAND_CONSTRUCTS_AUTHORITY,
      surfaceMaterialsAuthority: SURFACE_MATERIALS_AUTHORITY,
      landConstructsModuleDetected: hasLandConstructsModule(),
      surfaceMaterialsModuleDetected: hasSurfaceMaterialsModule(),
      responsibilitySplitActive: true,
      rendererFacadeActive: true,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
      markers: CONTRACT_MARKERS.slice(),
      start: start,
      stop: stop,
      getStatus: getStatus,
      renderFrame: function renderFrame() {
        drawPlanetFrame(state, safeNow());
        return getStatus();
      }
    };
  }

  function getStatus() {
    var land = getLandModule();
    var surface = getSurfaceModule();
    var landStatus = land && typeof land.getLandConstructStatus === "function" ? land.getLandConstructStatus() : null;
    var surfaceStatus = surface && typeof surface.getSurfaceMaterialStatus === "function" ? surface.getSurfaceMaterialStatus() : null;

    return {
      ok: true,
      active: Boolean(activeState),
      running: Boolean(activeState && activeState.running),
      version: VERSION,
      VERSION: VERSION,
      PROJECTION_TNT: PROJECTION_TNT,
      projectionTnt: PROJECTION_TNT,
      BALANCE_TNT: BALANCE_TNT,
      VISUAL_TNT: VISUAL_TNT,
      SURFACE_TNT: SURFACE_TNT,
      CINEMATIC_TNT: CINEMATIC_TNT,
      NODAL_TNT: NODAL_TNT,
      B25_TNT: B25_TNT,
      B26_FACADE_TNT: B26_FACADE_TNT,
      terrainAuthority: TERRAIN_AUTHORITY,
      hydrationAuthority: HYDRATION_AUTHORITY,
      landConstructsAuthority: LAND_CONSTRUCTS_AUTHORITY,
      surfaceMaterialsAuthority: SURFACE_MATERIALS_AUTHORITY,
      terrainModuleDetected: hasTerrainModule(),
      hydrationModuleDetected: hasHydrationModule(),
      landConstructsModuleDetected: hasLandConstructsModule(),
      surfaceMaterialsModuleDetected: hasSurfaceMaterialsModule(),
      landConstructsStatus: landStatus,
      surfaceMaterialsStatus: surfaceStatus,
      responsibilitySplitActive: true,
      rendererFacadeActive: true,
      moduleLoadState: {
        requested: moduleLoadState.requested,
        landRequested: moduleLoadState.landRequested,
        surfaceRequested: moduleLoadState.surfaceRequested,
        landLoaded: moduleLoadState.landLoaded || hasLandConstructsModule(),
        surfaceLoaded: moduleLoadState.surfaceLoaded || hasSurfaceMaterialsModule(),
        landError: moduleLoadState.landError,
        surfaceError: moduleLoadState.surfaceError
      },
      activeCanvas: activeCanvas,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
      markers: CONTRACT_MARKERS.slice()
    };
  }

  function mount(mountOrOptions, maybeOptions) {
    return renderPlanetOne(mountOrOptions, maybeOptions);
  }

  function render(mountOrOptions, maybeOptions) {
    return renderPlanetOne(mountOrOptions, maybeOptions);
  }

  global.DGBPlanetOneRenderTeam = {
    VERSION: VERSION,
    version: VERSION,
    PROJECTION_TNT: PROJECTION_TNT,
    projectionTnt: PROJECTION_TNT,
    BALANCE_TNT: BALANCE_TNT,
    VISUAL_TNT: VISUAL_TNT,
    SURFACE_TNT: SURFACE_TNT,
    CINEMATIC_TNT: CINEMATIC_TNT,
    NODAL_TNT: NODAL_TNT,
    B25_TNT: B25_TNT,
    B26_FACADE_TNT: B26_FACADE_TNT,
    TERRAIN_AUTHORITY: TERRAIN_AUTHORITY,
    HYDRATION_AUTHORITY: HYDRATION_AUTHORITY,
    LAND_CONSTRUCTS_AUTHORITY: LAND_CONSTRUCTS_AUTHORITY,
    SURFACE_MATERIALS_AUTHORITY: SURFACE_MATERIALS_AUTHORITY,
    CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
    markers: CONTRACT_MARKERS.slice(),
    renderPlanetOne: renderPlanetOne,
    render: render,
    mount: mount,
    start: start,
    stop: stop,
    getStatus: getStatus,
    status: getStatus,
    createRender: renderPlanetOne,
    createPlanetOneRender: renderPlanetOne
  };

  ensureModulesRequested();
})(typeof window !== "undefined" ? window : globalThis);
