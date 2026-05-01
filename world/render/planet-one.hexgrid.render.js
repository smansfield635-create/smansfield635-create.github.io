/* G1 PLANET 1 RAISED LOW LAND WITH TURQUOISE SHELF RIM
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_RAISED_LOW_LAND_WITH_TURQUOISE_SHELF_RIM_TNT_v1

   PURPOSE:
   - Preserve the hidden 256-state hexagonal terrain-cell substrate.
   - Preserve the water-dominant maritime globe and continuous orbital shelf bodies.
   - Raise land bodies above sea level.
   - Preserve a turquoise shallow-water rim around each land body.
   - Keep debug cell visibility separate from public satellite mode.
   - Keep visual pass on HOLD.
*/

(function attachPlanetOneHexgridRender(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_RAISED_LOW_LAND_WITH_TURQUOISE_SHELF_RIM_TNT_v1";
  var BASELINE = "PLANET_1_G1_RAISED_LOW_LAND_WITH_TURQUOISE_SHELF_RIM_v1";
  var PRIOR_BASELINE = "PLANET_1_G1_MARITIME_LOW_LAND_INTERMEDIATE_BASELINE_v1";
  var MARITIME_BASELINE = "PLANET_1_G1_MARITIME_SEA_LEVEL_BASELINE_v1";
  var DEFAULT_SEED = 256451;

  var CONTRACT_MARKERS = [
    VERSION,
    BASELINE,
    PRIOR_BASELINE,
    MARITIME_BASELINE,
    "HEXGRID_RENDERER_ACTIVE",
    "HEXGRID_CONSUMED_AS_HIDDEN_PLANETARY_DATA",
    "MARITIME_SEA_LEVEL_BASELINE_ACTIVE",
    "CONTINUOUS_ORBITAL_LAND_SURFACE_ACTIVE",
    "RAISED_LOW_LAND_ACTIVE",
    "TURQUOISE_SHELF_RIM_ACTIVE",
    "COASTAL_GRADIENT_ACTIVE",
    "PUBLIC_HONEYCOMB_BLOCKED",
    "PUBLIC_CELL_DOTS_BLOCKED",
    "PUBLIC_SCANLINE_LAND_BLOCKED",
    "DEBUG_CELL_VISIBILITY_ONLY",
    "TWO_DYNAMIC_HEMISPHERIC_LAND_STRUCTURES_ACTIVE",
    "THREE_SECONDARY_NON_POLAR_BODIES_ACTIVE",
    "SEVEN_LANDMASS_LAW_ACTIVE",
    "HIGH_RELIEF_HELD",
    "VISUAL_PASS_NOT_CLAIMED"
  ];

  var state = {
    active: true,
    version: VERSION,
    baseline: BASELINE,
    lastGrid: null,
    lastDraw: null,
    lastSurface: null,
    lastError: null,
    cellDebugModeAvailable: true,
    publicHoneycombBlocked: true,
    publicCellDotsBlocked: true,
    publicScanlineLandBlocked: true,
    satelliteObservationalModeActive: true,
    continuousOrbitalLandSurfaceActive: true,
    raisedLowLandActive: true,
    turquoiseShelfRimActive: true,
    visualPassClaimed: false
  };

  function now() {
    return new Date().toISOString();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function degToRad(value) {
    return value * Math.PI / 180;
  }

  function radToDeg(value) {
    return value * 180 / Math.PI;
  }

  function wrapLon(value) {
    var lon = value;
    while (lon <= -180) lon += 360;
    while (lon > 180) lon -= 360;
    return lon;
  }

  function lonDistance(a, b) {
    return Math.abs(wrapLon(a - b));
  }

  function smoothstep(edge0, edge1, x) {
    var t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function hash2(x, y, seed) {
    return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
  }

  function valueNoise(x, y, seed) {
    var ix = Math.floor(x);
    var iy = Math.floor(y);
    var fx = fract(x);
    var fy = fract(y);
    var ux = fx * fx * (3 - 2 * fx);
    var uy = fy * fy * (3 - 2 * fy);
    var a = hash2(ix, iy, seed);
    var b = hash2(ix + 1, iy, seed);
    var c = hash2(ix, iy + 1, seed);
    var d = hash2(ix + 1, iy + 1, seed);
    return mix(mix(a, b, ux), mix(c, d, ux), uy);
  }

  function fractalNoise(lon, lat, seed) {
    var x = (lon + 180) / 360;
    var y = (lat + 90) / 180;
    var n1 = valueNoise(x * 7.0, y * 5.0, seed);
    var n2 = valueNoise(x * 15.0, y * 11.0, seed + 17);
    var n3 = valueNoise(x * 31.0, y * 23.0, seed + 41);
    return (n1 * 0.55) + (n2 * 0.30) + (n3 * 0.15);
  }

  function signedFractalNoise(lon, lat, seed) {
    return fractalNoise(lon, lat, seed) * 2 - 1;
  }

  function ellipseScore(lon, lat, centerLon, centerLat, scaleLon, scaleLat, curve, seed) {
    var coastNoise = signedFractalNoise(lon, lat, seed) * 9.0;
    var longCurve = Math.sin(degToRad((lon + centerLon) * 1.03 + seed * 13.0)) * curve;
    var curvedLat = centerLat + longCurve + coastNoise;
    var dx = lonDistance(lon, centerLon) / scaleLon;
    var dy = (lat - curvedLat) / scaleLat;
    var distance = Math.sqrt((dx * dx) + (dy * dy));
    var pressure = 1 - smoothstep(0.58, 1.04, distance);
    var edgeBreak = signedFractalNoise(lon * 1.7, lat * 1.7, seed + 101) * 0.09;
    return clamp(pressure + edgeBreak, 0, 1);
  }

  function getSurfaceFields(lon, lat, seed) {
    var northPole = smoothstep(60, 77, lat);
    var southPole = smoothstep(60, 77, -lat);

    var westDynamic = ellipseScore(lon, lat, -116, 7, 68, 49, 12, seed + 1);
    var eastDynamic = ellipseScore(lon, lat, 74, -7, 72, 47, -10, seed + 2);
    var secondaryOne = ellipseScore(lon, lat, -20, -31, 27, 20, 5, seed + 3);
    var secondaryTwo = ellipseScore(lon, lat, 151, 22, 28, 19, -5, seed + 4);
    var secondaryThree = ellipseScore(lon, lat, 22, 40, 23, 17, 4, seed + 5);

    var dynamicLand = Math.max(westDynamic, eastDynamic);
    var secondaryLand = Math.max(secondaryOne, secondaryTwo, secondaryThree);
    var nonPolarLand = Math.max(dynamicLand, secondaryLand);

    var broadTexture = signedFractalNoise(lon * 0.84, lat * 0.84, seed + 72);
    var fineTexture = signedFractalNoise(lon * 2.15, lat * 2.15, seed + 109);
    var landScore = clamp(nonPolarLand + broadTexture * 0.035 + fineTexture * 0.018, 0, 1);
    var polarScore = Math.max(northPole, southPole);

    var landStrength = smoothstep(0.49, 0.67, landScore);
    var raisedCoreStrength = smoothstep(0.60, 0.82, landScore);
    var shelfStrength = smoothstep(0.27, 0.50, landScore) * (1 - smoothstep(0.55, 0.74, landScore));
    var turquoiseRimStrength = smoothstep(0.39, 0.535, landScore) * (1 - smoothstep(0.58, 0.72, landScore));
    var coastStrength = clamp(1 - Math.abs(landScore - 0.545) / 0.145, 0, 1);
    var lowElevation = clamp((landScore - 0.49) / 0.51, 0, 1);
    var materialTexture = fractalNoise(lon * 1.52, lat * 1.52, seed + 211);
    var waterDepth = clamp(1 - landScore * 0.90 - shelfStrength * 0.30, 0, 1);

    var type = "water";
    var structure = "ocean";

    if (polarScore > 0.30) {
      type = "polar";
      structure = northPole >= southPole ? "north_polar_lid" : "south_polar_lid";
    } else if (landStrength > 0.05) {
      type = "land";
      if (westDynamic >= eastDynamic && westDynamic >= secondaryLand) {
        structure = "west_dynamic_hemispheric_land_structure";
      } else if (eastDynamic >= westDynamic && eastDynamic >= secondaryLand) {
        structure = "east_dynamic_hemispheric_land_structure";
      } else if (secondaryOne >= secondaryTwo && secondaryOne >= secondaryThree) {
        structure = "secondary_non_polar_body_1";
      } else if (secondaryTwo >= secondaryOne && secondaryTwo >= secondaryThree) {
        structure = "secondary_non_polar_body_2";
      } else {
        structure = "secondary_non_polar_body_3";
      }
    } else if (shelfStrength > 0.08 || turquoiseRimStrength > 0.08) {
      type = "shelf";
      structure = "turquoise_shallow_coastal_rim";
    }

    return {
      lon: lon,
      lat: lat,
      type: type,
      structure: structure,
      westDynamic: westDynamic,
      eastDynamic: eastDynamic,
      secondaryOne: secondaryOne,
      secondaryTwo: secondaryTwo,
      secondaryThree: secondaryThree,
      landScore: landScore,
      landStrength: landStrength,
      raisedCoreStrength: raisedCoreStrength,
      polarScore: polarScore,
      shelfStrength: shelfStrength,
      turquoiseRimStrength: turquoiseRimStrength,
      coastStrength: coastStrength,
      elevation: type === "land" ? clamp(0.055 + lowElevation * 0.205 + materialTexture * 0.026, 0.05, 0.29) : 0,
      waterDepth: waterDepth,
      mineralPressure: type === "land" ? clamp(materialTexture * 0.11, 0, 0.11) : 0,
      plateauPressure: type === "land" ? clamp(lowElevation * 0.08, 0, 0.08) : 0,
      higherRelief: 0,
      maritimeDatum: 0,
      hiddenSubstrateCell: true
    };
  }

  function classifyCell(lon, lat, seed) {
    return getSurfaceFields(lon, lat, seed);
  }

  function createPlanetOneHexGrid(options) {
    var opts = options || {};
    var lonStep = Math.max(2, Number(opts.lonStep || 4));
    var latStep = Math.max(2, Number(opts.latStep || 4));
    var seed = Number(opts.seed || DEFAULT_SEED);
    var cells = [];
    var lat;
    var lon;
    var grid;

    for (lat = -88; lat <= 88; lat += latStep) {
      for (lon = -180; lon < 180; lon += lonStep) {
        cells.push(classifyCell(lon, lat, seed));
      }
    }

    grid = {
      ok: true,
      version: VERSION,
      baseline: BASELINE,
      priorBaseline: PRIOR_BASELINE,
      maritimeBaseline: MARITIME_BASELINE,
      seed: seed,
      lonStep: lonStep,
      latStep: latStep,
      cells: cells,
      cellCount: cells.length,
      generatedAt: now(),
      hiddenPlanetaryData: true,
      publicHoneycombBlocked: true,
      publicCellDotsBlocked: true,
      publicScanlineLandBlocked: true,
      continuousOrbitalLandSurfaceActive: true,
      raisedLowLandActive: true,
      turquoiseShelfRimActive: true,
      visualPassClaimed: false
    };

    state.lastGrid = grid;
    return grid;
  }

  function projectCell(cell, viewLon, viewLat, cx, cy, radius) {
    var lat = degToRad(cell.lat);
    var lon = degToRad(wrapLon(cell.lon - viewLon));
    var vLat = degToRad(viewLat || 0);
    var cosLat = Math.cos(lat);
    var sinLat = Math.sin(lat);
    var cosLon = Math.cos(lon);
    var sinLon = Math.sin(lon);
    var cosViewLat = Math.cos(vLat);
    var sinViewLat = Math.sin(vLat);
    var z = (cosLat * cosLon * cosViewLat) + (sinLat * sinViewLat);

    return {
      visible: z > -0.035,
      x: cx + radius * cosLat * sinLon,
      y: cy - radius * ((sinLat * cosViewLat) - (cosLat * cosLon * sinViewLat)),
      z: z
    };
  }

  function inverseProjectToLonLat(px, py, cx, cy, radius, viewLon, viewLat) {
    var x = (px - cx) / radius;
    var screenY = (py - cy) / radius;
    var y = -screenY;
    var rho2 = x * x + y * y;
    var z;
    var vLat;
    var cosViewLat;
    var sinViewLat;
    var lat;
    var lonRel;
    var lon;

    if (rho2 > 1) return null;

    z = Math.sqrt(Math.max(0, 1 - rho2));
    vLat = degToRad(viewLat || 0);
    cosViewLat = Math.cos(vLat);
    sinViewLat = Math.sin(vLat);

    lat = Math.asin(clamp(y * cosViewLat + z * sinViewLat, -1, 1));
    lonRel = Math.atan2(x, z * cosViewLat - y * sinViewLat);
    lon = wrapLon(radToDeg(lonRel) + viewLon);

    return {
      lon: lon,
      lat: radToDeg(lat),
      z: z,
      rho: Math.sqrt(rho2)
    };
  }

  function getDocument() {
    return global.document || null;
  }

  function createWorkCanvas(width, height) {
    var doc = getDocument();
    var canvas;

    if (typeof global.OffscreenCanvas === "function") {
      return new global.OffscreenCanvas(width, height);
    }

    if (doc && typeof doc.createElement === "function") {
      canvas = doc.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      return canvas;
    }

    return null;
  }

  function putPixel(data, index, r, g, b, a) {
    data[index] = Math.round(clamp(r, 0, 255));
    data[index + 1] = Math.round(clamp(g, 0, 255));
    data[index + 2] = Math.round(clamp(b, 0, 255));
    data[index + 3] = Math.round(clamp(a, 0, 1) * 255);
  }

  function drawContinuousSurfaceBuffer(ctx, grid, options) {
    var opts = options || {};
    var cx = Number(opts.centerX || ctx.canvas.width / 2);
    var cy = Number(opts.centerY || ctx.canvas.height / 2);
    var radius = Number(opts.radius || Math.min(ctx.canvas.width, ctx.canvas.height) * 0.43);
    var viewLon = Number(opts.viewLon == null ? -28 : opts.viewLon);
    var viewLat = Number(opts.viewLat == null ? 0 : opts.viewLat);
    var alpha = clamp(Number(opts.alpha == null ? 0.90 : opts.alpha), 0, 1);
    var seed = Number((grid && grid.seed) || opts.seed || DEFAULT_SEED);
    var diameter = Math.max(180, Math.round(radius * 2));
    var scale = clamp(Number(opts.surfaceScale || 0.74), 0.48, 1.0);
    var w = Math.max(180, Math.round(diameter * scale));
    var h = Math.max(180, Math.round(diameter * scale));
    var workCanvas = createWorkCanvas(w, h);
    var workCtx;
    var image;
    var data;
    var x;
    var y;
    var wx;
    var wy;
    var mapped;
    var field;
    var index;
    var edgeFade;
    var light;
    var texture;
    var landAlpha;
    var shelfAlpha;
    var polarAlpha;
    var rimAlpha;
    var elevationLight;
    var r;
    var g;
    var b;

    if (!workCanvas) {
      state.lastError = "NO_WORK_CANVAS";
      return false;
    }

    workCtx = workCanvas.getContext("2d");
    if (!workCtx) {
      state.lastError = "NO_WORK_CONTEXT";
      return false;
    }

    image = workCtx.createImageData(w, h);
    data = image.data;

    for (y = 0; y < h; y += 1) {
      for (x = 0; x < w; x += 1) {
        wx = cx - radius + (x + 0.5) / scale;
        wy = cy - radius + (y + 0.5) / scale;
        mapped = inverseProjectToLonLat(wx, wy, cx, cy, radius, viewLon, viewLat);
        index = (y * w + x) * 4;

        if (!mapped) {
          putPixel(data, index, 0, 0, 0, 0);
          continue;
        }

        field = getSurfaceFields(mapped.lon, mapped.lat, seed);
        edgeFade = smoothstep(1.0, 0.78, mapped.rho);
        light = clamp(0.43 + mapped.z * 0.56, 0.18, 1.0);
        texture = fractalNoise(mapped.lon * 2.0, mapped.lat * 2.0, seed + 307);

        if (field.type === "polar") {
          polarAlpha = alpha * edgeFade * light * (0.12 + field.polarScore * 0.26);
          r = 216 + texture * 34;
          g = 234 + texture * 22;
          b = 239 + texture * 16;
          putPixel(data, index, r, g, b, polarAlpha);
          continue;
        }

        if (field.type === "land") {
          elevationLight = 1 + field.elevation * 1.18 + field.raisedCoreStrength * 0.22;
          landAlpha = alpha * edgeFade * light * (0.27 + field.landStrength * 0.48);

          r = (66 + field.elevation * 310 + texture * 28) * elevationLight;
          g = (98 + field.elevation * 175 + texture * 22) * elevationLight;
          b = (62 + field.elevation * 82 + texture * 13) * elevationLight;

          r = mix(r, 188, field.coastStrength * 0.14);
          g = mix(g, 171, field.coastStrength * 0.12);
          b = mix(b, 116, field.coastStrength * 0.10);

          putPixel(data, index, r, g, b, landAlpha);
          continue;
        }

        if (field.type === "shelf") {
          rimAlpha = alpha * edgeFade * light * (0.11 + field.turquoiseRimStrength * 0.28);
          shelfAlpha = alpha * edgeFade * light * (0.045 + field.shelfStrength * 0.13);

          r = mix(72, 118, texture * 0.35);
          g = mix(164, 214, field.turquoiseRimStrength);
          b = mix(178, 218, field.turquoiseRimStrength);

          putPixel(data, index, r, g, b, Math.max(rimAlpha, shelfAlpha));
          continue;
        }

        putPixel(data, index, 0, 0, 0, 0);
      }
    }

    workCtx.putImageData(image, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    if ("filter" in ctx) {
      ctx.filter = "blur(" + Math.max(0.36, radius * 0.0026).toFixed(2) + "px)";
    }

    ctx.drawImage(workCanvas, cx - radius, cy - radius, radius * 2, radius * 2);

    if ("filter" in ctx) ctx.filter = "none";

    ctx.restore();

    state.lastSurface = {
      ok: true,
      version: VERSION,
      baseline: BASELINE,
      renderedAt: now(),
      mode: "raised_low_land_with_turquoise_shelf_rim",
      surfaceWidth: w,
      surfaceHeight: h,
      radius: radius,
      viewLon: viewLon,
      viewLat: viewLat,
      publicCellDotsBlocked: true,
      publicScanlineLandBlocked: true,
      continuousOrbitalLandSurfaceActive: true,
      raisedLowLandActive: true,
      turquoiseShelfRimActive: true,
      coastalGradientActive: true,
      highReliefHeld: true,
      visualPassClaimed: false
    };

    return true;
  }

  function drawSatelliteSurface(ctx, grid, options) {
    var opts = options || {};
    var workingGrid = grid && grid.cells ? grid : createPlanetOneHexGrid(opts);
    var drewBuffer = drawContinuousSurfaceBuffer(ctx, workingGrid, opts);

    state.lastDraw = {
      ok: Boolean(drewBuffer),
      version: VERSION,
      baseline: BASELINE,
      renderedAt: now(),
      renderMode: "satellite",
      cellCount: workingGrid.cells ? workingGrid.cells.length : 0,
      hiddenPlanetaryData: true,
      drawsPublicCellOutlines: false,
      drawsPublicCellDots: false,
      drawsPublicScanlineLand: false,
      publicHoneycombBlocked: true,
      publicCellDotsBlocked: true,
      publicScanlineLandBlocked: true,
      maritimeSeaLevelBaselineActive: true,
      continuousOrbitalLandSurfaceActive: true,
      raisedLowLandActive: true,
      turquoiseShelfRimActive: true,
      coastalGradientActive: true,
      debugCellVisibilityOnly: true,
      highReliefHeld: true,
      visualPassClaimed: false,
      lastSurface: state.lastSurface
    };

    return state.lastDraw;
  }

  function drawDebugGrid(ctx, grid, options) {
    var opts = options || {};
    var cx = Number(opts.centerX || ctx.canvas.width / 2);
    var cy = Number(opts.centerY || ctx.canvas.height / 2);
    var radius = Number(opts.radius || Math.min(ctx.canvas.width, ctx.canvas.height) * 0.43);
    var viewLon = Number(opts.viewLon == null ? -28 : opts.viewLon);
    var viewLat = Number(opts.viewLat == null ? 0 : opts.viewLat);
    var cells = grid && grid.cells ? grid.cells : [];
    var pointRadius = Math.max(1.0, radius * Math.max(grid.lonStep || 4, grid.latStep || 4) / 168);
    var i;
    var p;
    var cell;

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.16)";
    ctx.lineWidth = Math.max(0.5, radius * 0.0018);

    for (i = 0; i < cells.length; i += 1) {
      cell = cells[i];
      p = projectCell(cell, viewLon, viewLat, cx, cy, radius);
      if (!p.visible) continue;

      ctx.beginPath();

      if (typeof ctx.ellipse === "function") {
        ctx.ellipse(p.x, p.y, pointRadius * 1.22, pointRadius * 0.82, degToRad(cell.lon * 0.1), 0, Math.PI * 2);
      } else {
        ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2);
      }

      ctx.stroke();
    }

    ctx.restore();

    state.lastDraw = {
      ok: true,
      version: VERSION,
      baseline: BASELINE,
      renderedAt: now(),
      renderMode: "debug",
      cellCount: cells.length,
      publicHoneycombBlocked: false,
      publicCellDotsBlocked: false,
      publicScanlineLandBlocked: false,
      debugOnly: true,
      visualPassClaimed: false
    };

    return state.lastDraw;
  }

  function drawPlanetOneHexGrid(ctx, grid, options) {
    var opts = options || {};
    var renderMode = opts.renderMode || "satellite";
    var workingGrid = grid && grid.cells ? grid : createPlanetOneHexGrid(opts);

    if (!ctx) {
      state.lastError = "NO_CONTEXT";
      return {
        ok: false,
        reason: "NO_CONTEXT",
        version: VERSION,
        visualPassClaimed: false
      };
    }

    if (renderMode === "debug" && opts.allowDebug !== false) {
      return drawDebugGrid(ctx, workingGrid, opts);
    }

    return drawSatelliteSurface(ctx, workingGrid, opts);
  }

  function getHexgridStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      baseline: BASELINE,
      priorBaseline: PRIOR_BASELINE,
      maritimeBaseline: MARITIME_BASELINE,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),

      hexgridRendererActive: true,
      hiddenPlanetaryData: true,
      hexCellSubstrateActive: true,
      hexagonalPixelFormatActive: true,
      terrainCellSamplingActive: true,
      coastCellQuantizationActive: true,
      elevationCellFieldActive: true,
      waterDepthCellFieldActive: true,
      mineralPressureCellFieldActive: true,

      maritimeSeaLevelBaselineActive: true,
      continuousOrbitalLandSurfaceActive: true,
      raisedLowLandActive: true,
      turquoiseShelfRimActive: true,
      coastalGradientActive: true,
      shallowShelfHintActive: true,

      plateauPressureHeld: true,
      mineralPressureHeld: true,
      higherReliefHeld: true,
      highReliefHeld: true,

      satelliteObservationalModeActive: true,
      satelliteModeDrawsContinuousSurfaceFieldsOnly: true,
      publicHoneycombBlocked: true,
      publicCellDotsBlocked: true,
      publicScanlineLandBlocked: true,
      drawsPublicCellOutlinesInSatelliteMode: false,
      drawsPublicCellDotsInSatelliteMode: false,
      drawsPublicScanlinesInSatelliteMode: false,

      debugCellVisibilityOnly: true,
      cellDebugModeAvailable: true,

      twoDynamicHemisphericLandStructuresActive: true,
      threeSecondaryNonPolarBodiesActive: true,
      sevenLandmassLawActive: true,
      northSouthPolarDistinctionActive: true,

      visualPassClaimed: false,

      lastGrid: state.lastGrid ? {
        cellCount: state.lastGrid.cellCount,
        lonStep: state.lastGrid.lonStep,
        latStep: state.lastGrid.latStep,
        seed: state.lastGrid.seed,
        generatedAt: state.lastGrid.generatedAt
      } : null,

      lastSurface: state.lastSurface,
      lastDraw: state.lastDraw,
      lastError: state.lastError
    };
  }

  function status() {
    return getHexgridStatus();
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    BASELINE: BASELINE,
    PRIOR_BASELINE: PRIOR_BASELINE,
    MARITIME_BASELINE: MARITIME_BASELINE,
    CONTRACT_MARKERS: CONTRACT_MARKERS,
    createPlanetOneHexGrid: createPlanetOneHexGrid,
    drawPlanetOneHexGrid: drawPlanetOneHexGrid,
    getHexgridStatus: getHexgridStatus,
    status: status
  };

  global.DGBPlanetOneHexgridRender = api;
  global.DGBPlanetOneHexGridRender = api;

  try {
    if (global.dispatchEvent && typeof global.CustomEvent === "function") {
      global.dispatchEvent(new global.CustomEvent("dgb:planet-one:hexgrid-ready", {
        detail: getHexgridStatus()
      }));
    }
  } catch (error) {
    state.lastError = String(error && error.message ? error.message : error);
  }
})(typeof window !== "undefined" ? window : globalThis);
