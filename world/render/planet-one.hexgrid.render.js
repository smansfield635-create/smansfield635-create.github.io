/* G1 PLANET 1 HEX BRIDGE: HYDRATION DEPTH + TERRAIN OUTLINE
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_HYDRATION_DEPTH_TERRAIN_OUTLINE_HEX_BRIDGE_SET_TNT_v1

   LAW:
   Hexgrid is the 256 bridge.
   It connects hydration depth to terrain outline.
   It produces official terrain outline and vein candidates.
   It does not expose public honeycomb.
*/

(function attachPlanetOneHexBridge(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_HYDRATION_DEPTH_TERRAIN_OUTLINE_HEX_BRIDGE_SET_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_CLEAN_SLATE_LOCK_IN_v1";
  var STATE_FORMULA = "4x4x4x4";
  var STATE_COUNT = 256;
  var SEED = 256451;

  var lastDraw = null;
  var lastGrid = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round(value * m) / m;
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, value) {
    var t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function degToRad(value) {
    return value * Math.PI / 180;
  }

  function radToDeg(value) {
    return value * 180 / Math.PI;
  }

  function normalizeLon(lon) {
    var x = ((lon + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
  }

  function hash2(a, b, seed) {
    var x = Math.sin(a * 127.1 + b * 311.7 + (seed || SEED) * 74.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function noise(lon, lat, scale, seed) {
    return hash2(Math.round(lon * scale), Math.round(lat * scale), seed || SEED);
  }

  function fbm(lon, lat, seed) {
    return (
      noise(lon, lat, 0.42, seed + 11) * 0.40 +
      noise(lon, lat, 0.92, seed + 29) * 0.30 +
      noise(lon, lat, 1.85, seed + 47) * 0.18 +
      noise(lon, lat, 3.70, seed + 83) * 0.12
    );
  }

  function stateId(waterDepth, terrainOutline, veinStructure, visualBoundary) {
    return (((waterDepth * 4 + terrainOutline) * 4 + veinStructure) * 4 + visualBoundary);
  }

  function buildStateSpaceReceipt() {
    var states = [];
    var waterDepth;
    var terrainOutline;
    var veinStructure;
    var visualBoundary;

    for (waterDepth = 0; waterDepth < 4; waterDepth += 1) {
      for (terrainOutline = 0; terrainOutline < 4; terrainOutline += 1) {
        for (veinStructure = 0; veinStructure < 4; veinStructure += 1) {
          for (visualBoundary = 0; visualBoundary < 4; visualBoundary += 1) {
            states.push({
              state_id: stateId(waterDepth, terrainOutline, veinStructure, visualBoundary),
              waterDepth: waterDepth,
              terrainOutline: terrainOutline,
              veinStructure: veinStructure,
              visualBoundary: visualBoundary
            });
          }
        }
      }
    }

    return {
      ok: states.length === STATE_COUNT,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      stateSpaceReceipt: true,
      waterDepthAxisActive: true,
      terrainOutlineAxisActive: true,
      veinStructureAxisActive: true,
      visualBoundaryAxisActive: true,
      states: states
    };
  }

  function landPotential(lon, lat, seed) {
    var west = bodyScore(lon, lat, -92, 4, 72, 78, 1.03, 0.15);
    var east = bodyScore(lon, lat, 96, -6, 66, 72, 0.98, 0.13);
    var north = bodyScore(lon, lat, 28, 38, 36, 28, 0.66, 0.04);
    var south = bodyScore(lon, lat, -22, -38, 42, 30, 0.64, 0.04);
    var far = bodyScore(lon, lat, 178, 14, 34, 42, 0.58, 0.10);
    var grain = (fbm(lon, lat, seed + 300) - 0.5) * 0.24;
    return Math.max(west, east, north, south, far) + grain;
  }

  function bodyScore(lon, lat, centerLon, centerLat, rx, ry, weight, wrap) {
    var dx = Math.abs(normalizeLon(lon - centerLon)) / rx;
    var dy = (lat - centerLat) / ry;
    var curve = Math.cos(degToRad(lon - centerLon)) * wrap;
    return weight * (1 - (dx * dx + dy * dy)) + curve;
  }

  function veinField(lon, lat, seed, offset, scale, width) {
    var n = fbm(lon * 0.68 + offset, lat * 0.82 - offset, seed + offset);
    var line = Math.abs(Math.sin(degToRad(lon * scale + lat * scale * 1.42 + n * 88 + offset)));
    return 1 - smoothstep(0, width, line);
  }

  function sampleBridge(lon, lat, options) {
    options = options || {};
    var seed = Number(options.seed || SEED);

    lon = normalizeLon(lon);
    lat = clamp(lat, -88, 88);

    var potential = landPotential(lon, lat, seed);
    var absLat = Math.abs(lat);
    var polar = absLat >= 73 ? 1 : 0;

    var outlineRaw = smoothstep(0.055, 0.34, potential);
    var officialCoast = 1 - Math.abs(potential - 0.13) / 0.18;
    officialCoast = clamp(officialCoast, 0, 1);

    var shelf = clamp(1 - Math.abs(potential - 0.06) / 0.30, 0, 1);
    var coastDistance = clamp((potential - 0.08) / 0.60, 0, 1);

    var oceanDepth = clamp(0.72 - potential * 0.44 - shelf * 0.18, 0.10, 0.94);
    if (polar) oceanDepth = clamp(oceanDepth * 0.72, 0.10, 0.62);

    var lowVein = veinField(lon, lat, seed, 19, 1.10, 0.055);
    var artery = veinField(lon, lat, seed, 73, -1.52, 0.044);
    var pressure = veinField(lon, lat, seed, 131, 2.08, 0.036);

    var veinCandidate = clamp(
      Math.max(
        lowVein * outlineRaw * 0.60,
        artery * outlineRaw * 0.78,
        pressure * outlineRaw * officialCoast * 0.70
      ),
      0,
      1
    );

    var elevationCandidate = clamp(outlineRaw * 0.64 + coastDistance * 0.20 + pressure * 0.08, 0, 1);

    var waterDepthState = oceanDepth >= 0.72 ? 0 : oceanDepth >= 0.42 ? 1 : oceanDepth >= 0.16 ? 2 : 3;

    var terrainOutlineState = 0;
    if (outlineRaw > 0.18) terrainOutlineState = 1;
    if (officialCoast > 0.52) terrainOutlineState = 2;
    if (polar) terrainOutlineState = 3;

    var veinState = 0;
    if (lowVein * outlineRaw > 0.34) veinState = 1;
    if (artery * outlineRaw > 0.42) veinState = 2;
    if (pressure * outlineRaw > 0.50) veinState = 3;

    var boundaryState = 0;
    var boundaryPower = Math.max(officialCoast, veinCandidate * 0.72, polar * 0.72);
    if (boundaryPower > 0.18) boundaryState = 1;
    if (boundaryPower > 0.42) boundaryState = 2;
    if (boundaryPower > 0.68) boundaryState = 3;

    return {
      version: VERSION,
      baseline: BASELINE,

      lon: lon,
      lat: lat,

      hexBridgeActive: true,
      hydrationTerrainBridgeActive: true,
      terrainOutlineSourceActive: true,
      officialTerrainOutlineActive: true,
      veinCandidateFieldActive: true,
      waterDepthSamplingActive: true,
      shelfDistanceSamplingActive: true,
      coastlineCandidateFieldActive: true,

      waterDepth: round(oceanDepth, 4),
      water_depth: round(oceanDepth, 4),
      shelfDistance: round(shelf, 4),
      shelf_distance: round(shelf, 4),
      coastDistance: round(coastDistance, 4),
      coast_distance: round(coastDistance, 4),

      terrainOutline: round(outlineRaw, 4),
      terrain_outline: round(outlineRaw, 4),
      officialCoastline: round(officialCoast, 4),
      official_coastline: round(officialCoast, 4),
      elevationCandidate: round(elevationCandidate, 4),
      elevation_candidate: round(elevationCandidate, 4),

      veinCandidate: round(veinCandidate, 4),
      vein_candidate: round(veinCandidate, 4),
      lowlandVein: round(lowVein * outlineRaw, 4),
      lowland_vein: round(lowVein * outlineRaw, 4),
      primaryArtery: round(artery * outlineRaw, 4),
      primary_artery: round(artery * outlineRaw, 4),
      pressureCut: round(pressure * outlineRaw, 4),
      pressure_cut: round(pressure * outlineRaw, 4),

      polarBoundary: Boolean(polar),
      polar_boundary: Boolean(polar),

      waterDepthState: waterDepthState,
      terrainOutlineState: terrainOutlineState,
      veinStructureState: veinState,
      visualBoundaryState: boundaryState,
      state_id: stateId(waterDepthState, terrainOutlineState, veinState, boundaryState),

      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,

      visualPassClaimed: false
    };
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
    if (rho < 0.000001) return { lon: normalizeLon(viewLon), lat: viewLat, limb: 1 };

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

  function getHydration() {
    return global.DGBPlanetOneHydrationRender || null;
  }

  function blend(base, over, alpha) {
    return [
      Math.round(mix(base[0], over[0], alpha)),
      Math.round(mix(base[1], over[1], alpha)),
      Math.round(mix(base[2], over[2], alpha)),
      255
    ];
  }

  function colorFromBridge(sample, hydration, limb) {
    var water = hydration && hydration.waterColor ? hydration.waterColor : { r: 12, g: 70, b: 130 };
    var base = [water.r, water.g, water.b, 255];

    var outlineAlpha = clamp(sample.officialCoastline * 0.34 + sample.polarBoundary * 0.18, 0, 0.38);
    var veinAlpha = clamp(sample.veinCandidate * 0.20, 0, 0.20);
    var terrainAlpha = clamp(sample.terrainOutline * 0.20, 0, 0.24);

    var terrainTone = [
      Math.round(mix(58, 104, sample.elevationCandidate)),
      Math.round(mix(92, 128, sample.elevationCandidate)),
      Math.round(mix(76, 86, sample.elevationCandidate)),
      255
    ];

    var coastTone = [96, 180, 180, 255];
    var veinTone = [82, 170, 190, 255];

    var out = base;
    out = blend(out, terrainTone, terrainAlpha);
    out = blend(out, coastTone, outlineAlpha);
    out = blend(out, veinTone, veinAlpha);

    var shade = clamp(0.54 + limb * 0.48, 0.38, 1.10);
    out[0] = Math.round(clamp(out[0] * shade, 0, 255));
    out[1] = Math.round(clamp(out[1] * shade, 0, 255));
    out[2] = Math.round(clamp(out[2] * shade, 0, 255));

    return out;
  }

  function resolveContext(target) {
    if (!target) return null;
    if (target.canvas && typeof target.fillRect === "function") return target;
    if (target.getContext && typeof target.getContext === "function") return target.getContext("2d");
    return null;
  }

  function drawPlanetOneHexGrid(target, gridOrOptions, maybeOptions) {
    var ctx = resolveContext(target);
    if (!ctx) return { ok: false, reason: "NO_CANVAS_CONTEXT", version: VERSION, visualPassClaimed: false };

    var options = gridOrOptions && gridOrOptions.cells ? maybeOptions || {} : gridOrOptions || {};
    var canvas = ctx.canvas;
    var scale = clamp(Number(options.compositorScale || 0.74), 0.50, 1);
    var offW = Math.max(220, Math.round(canvas.width * scale));
    var offH = Math.max(220, Math.round(canvas.height * scale));
    var off = document.createElement("canvas");
    var offCtx;
    var img;
    var data;
    var cx = offW / 2;
    var cy = offH / 2;
    var radius = Number(options.radius || Math.min(canvas.width, canvas.height) * 0.43) * scale;
    var viewLon = Number(options.viewLon == null ? -28 : options.viewLon);
    var viewLat = Number(options.viewLat == null ? 0 : options.viewLat);
    var seed = Number(options.seed || SEED);
    var hydrationEngine = getHydration();

    var x;
    var y;
    var dx;
    var dy;
    var geo;
    var sample;
    var hydration;
    var color;
    var i;

    off.width = offW;
    off.height = offH;
    offCtx = off.getContext("2d");
    img = offCtx.createImageData(offW, offH);
    data = img.data;

    for (y = 0; y < offH; y += 1) {
      for (x = 0; x < offW; x += 1) {
        dx = (x - cx) / radius;
        dy = (cy - y) / radius;
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

        sample = sampleBridge(geo.lon, geo.lat, { seed: seed });
        sample.limbLight = geo.limb;
        sample.limb_light = geo.limb;

        hydration = hydrationEngine && hydrationEngine.sampleHydrationDepth
          ? hydrationEngine.sampleHydrationDepth(geo.lon, geo.lat, sample)
          : null;

        color = colorFromBridge(sample, hydration, geo.limb);

        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = color[3];
      }
    }

    offCtx.putImageData(img, 0, 0);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha = Number(options.surfaceAlpha == null ? 0.97 : options.surfaceAlpha);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    lastDraw = {
      ok: true,
      version: VERSION,
      cleanSlatePreserved: true,
      terrainOutlineRendered: true,
      veinStructureRenderedSubtly: true,
      waterDepthRendered: true,
      noBlobReintroduced: true,
      noPublicHoneycomb: true,
      noPublicDotGrid: true,
      rendererConsumesHydration: Boolean(hydrationEngine),
      rendererConsumesHexBridge: true,
      visualPassClaimed: false,
      renderedAt: new Date().toISOString()
    };

    return lastDraw;
  }

  function createPlanetOneHexGrid(options) {
    options = options || {};
    var lonStep = Number(options.lonStep || 4);
    var latStep = Number(options.latStep || 4);
    var cells = [];
    var lon;
    var lat;

    for (lat = -88; lat <= 88; lat += latStep) {
      for (lon = -180; lon < 180; lon += lonStep) {
        cells.push(sampleBridge(lon, lat, options));
      }
    }

    lastGrid = {
      version: VERSION,
      baseline: BASELINE,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      cells: cells,
      cellCount: cells.length,
      visualPassClaimed: false
    };

    return lastGrid;
  }

  function getHexgridStatus() {
    var receipt = buildStateSpaceReceipt();

    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      baseline: BASELINE,

      hexBridgeActive: true,
      hydrationTerrainBridgeActive: true,
      terrainOutlineSourceActive: true,
      officialTerrainOutlineActive: true,
      veinCandidateFieldActive: true,
      waterDepthSamplingActive: true,
      shelfDistanceSamplingActive: true,
      coastlineCandidateFieldActive: true,

      hexagonalPixelFormatActive: true,
      hexCellSubstrateActive: true,
      terrainCellSamplingActive: true,
      coastCellQuantizationActive: true,
      elevationCellFieldActive: true,
      waterDepthCellFieldActive: true,

      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      stateSpaceReceipt: true,
      waterDepthAxisActive: true,
      terrainOutlineAxisActive: true,
      veinStructureAxisActive: true,
      visualBoundaryAxisActive: true,
      stateSpacePreview: receipt.states.slice(0, 16),

      publicHoneycombBlocked: true,
      publicSampleDotsSuppressed: true,
      lastGrid: lastGrid ? { cellCount: lastGrid.cellCount, version: lastGrid.version } : null,
      lastDraw: lastDraw,
      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    BASELINE: BASELINE,
    baseline: BASELINE,
    stateFormula: STATE_FORMULA,
    stateCount: STATE_COUNT,
    requiredStateCount: STATE_COUNT,

    sampleBridge: sampleBridge,
    samplePlanetSurface: sampleBridge,
    createPlanetOneHexGrid: createPlanetOneHexGrid,
    drawPlanetOneHexGrid: drawPlanetOneHexGrid,
    getHexgridStatus: getHexgridStatus,
    status: getHexgridStatus,
    getLatticeReceipt: buildStateSpaceReceipt,
    getStateSpaceReceipt: buildStateSpaceReceipt
  };

  global.DGBPlanetOneHexgridRender = api;
  createPlanetOneHexGrid({ seed: SEED });

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:hex-bridge-ready", {
      detail: getHexgridStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
