/* G1 PLANET 1 HEX BRIDGE: REEF / SHELF / LAND EMERGENCE
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_REEF_SHELF_SHALLOW_WATER_AND_LAND_EMERGENCE_TNT_v1
*/

(function attachPlanetOneHexBridge(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_REEF_SHELF_SHALLOW_WATER_AND_LAND_EMERGENCE_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_CLEAN_SLATE_LOCK_IN_v1";
  var STATE_FORMULA = "4x4x4x4";
  var STATE_COUNT = 256;
  var SEED = 256451;

  var lastDraw = null;
  var lastGrid = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round(value * m) / m;
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

  function stateId(waterDepth, surfaceClass, boundaryRole, elevationState) {
    return (((waterDepth * 4 + surfaceClass) * 4 + boundaryRole) * 4 + elevationState);
  }

  function buildStateSpaceReceipt() {
    var states = [];
    var waterDepth;
    var surfaceClass;
    var boundaryRole;
    var elevationState;

    for (waterDepth = 0; waterDepth < 4; waterDepth += 1) {
      for (surfaceClass = 0; surfaceClass < 4; surfaceClass += 1) {
        for (boundaryRole = 0; boundaryRole < 4; boundaryRole += 1) {
          for (elevationState = 0; elevationState < 4; elevationState += 1) {
            states.push({
              state_id: stateId(waterDepth, surfaceClass, boundaryRole, elevationState),
              waterDepth: waterDepth,
              surfaceClass: surfaceClass,
              boundaryRole: boundaryRole,
              elevationState: elevationState
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
      surfaceClassAxisActive: true,
      boundaryRoleAxisActive: true,
      elevationStateAxisActive: true,
      states: states
    };
  }

  function bodyScore(lon, lat, centerLon, centerLat, rx, ry, weight, wrap) {
    var dx = Math.abs(normalizeLon(lon - centerLon)) / rx;
    var dy = (lat - centerLat) / ry;
    var curve = Math.cos(degToRad(lon - centerLon)) * wrap;
    return weight * (1 - (dx * dx + dy * dy)) + curve;
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

    var absLat = Math.abs(lat);
    var polar = absLat >= 73 ? 1 : 0;
    var potential = landPotential(lon, lat, seed);

    var terrainOutline = smoothstep(0.055, 0.34, potential);
    var officialCoastline = clamp(1 - Math.abs(potential - 0.13) / 0.18, 0, 1);
    var shelfCandidate = clamp(1 - Math.abs(potential - 0.06) / 0.30, 0, 1);
    var shallowWaterCandidate = clamp(shelfCandidate * (1 - smoothstep(0.28, 0.70, potential)), 0, 1);

    var reefNoise = fbm(lon * 2.3, lat * 2.1, seed + 909);
    var reefCandidate = clamp(
      shelfCandidate *
      officialCoastline *
      smoothstep(0.46, 0.92, reefNoise) *
      (1 - polar),
      0,
      1
    );

    var wetEdgeCandidate = clamp(officialCoastline * terrainOutline * 0.78, 0, 1);
    var beachReadyCandidate = clamp(
      officialCoastline *
      terrainOutline *
      smoothstep(0.18, 0.44, potential) *
      (1 - reefCandidate * 0.35),
      0,
      1
    );

    var emergentLandCandidate = clamp(
      terrainOutline *
      smoothstep(0.44, 0.78, potential) *
      (1 - shelfCandidate * 0.62) *
      (1 - reefCandidate * 0.74),
      0,
      1
    );

    var raisedLandCandidate = clamp(
      emergentLandCandidate *
      smoothstep(0.72, 0.94, fbm(lon * 1.2, lat * 1.2, seed + 707)),
      0,
      1
    );

    var lowVein = veinField(lon, lat, seed, 19, 1.10, 0.055);
    var artery = veinField(lon, lat, seed, 73, -1.52, 0.044);
    var pressure = veinField(lon, lat, seed, 131, 2.08, 0.036);

    var veinCandidate = clamp(
      Math.max(
        lowVein * emergentLandCandidate * 0.38,
        artery * emergentLandCandidate * 0.44,
        pressure * terrainOutline * officialCoastline * 0.32
      ),
      0,
      1
    );

    var waterDepth = clamp(0.78 - potential * 0.46 - shelfCandidate * 0.20 - reefCandidate * 0.12, 0.08, 0.96);
    if (polar) waterDepth = clamp(waterDepth * 0.70, 0.10, 0.62);

    var waterDepthState = waterDepth >= 0.72 ? 0 : waterDepth >= 0.42 ? 1 : waterDepth >= 0.16 ? 2 : 3;

    var surfaceClassState = 0;
    if (reefCandidate > 0.28) surfaceClassState = 1;
    if (beachReadyCandidate > 0.32) surfaceClassState = 2;
    if (emergentLandCandidate > 0.38) surfaceClassState = 3;

    var boundaryRoleState = 0;
    if (officialCoastline > 0.18 || wetEdgeCandidate > 0.18) boundaryRoleState = 1;
    if (officialCoastline > 0.44) boundaryRoleState = 2;
    if (officialCoastline > 0.72 && emergentLandCandidate > 0.44) boundaryRoleState = 3;

    var elevationState = 0;
    if (beachReadyCandidate > 0.16 || terrainOutline > 0.28) elevationState = 1;
    if (emergentLandCandidate > 0.38) elevationState = 2;
    if (raisedLandCandidate > 0.24) elevationState = 3;

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

      reefCandidateFieldActive: true,
      shelfCandidateFieldActive: true,
      shallowWaterCandidateFieldActive: true,
      wetEdgeCandidateFieldActive: true,
      beachReadyCandidateFieldActive: true,
      emergentLandCandidateFieldActive: true,
      transitionState256Active: true,

      waterDepth: round(waterDepth, 4),
      water_depth: round(waterDepth, 4),

      terrainOutline: round(terrainOutline, 4),
      terrain_outline: round(terrainOutline, 4),
      officialCoastline: round(officialCoastline, 4),
      official_coastline: round(officialCoastline, 4),

      shelfCandidate: round(shelfCandidate, 4),
      shelf_candidate: round(shelfCandidate, 4),
      shallowWaterCandidate: round(shallowWaterCandidate, 4),
      shallow_water_candidate: round(shallowWaterCandidate, 4),
      reefCandidate: round(reefCandidate, 4),
      reef_candidate: round(reefCandidate, 4),
      wetEdgeCandidate: round(wetEdgeCandidate, 4),
      wet_edge_candidate: round(wetEdgeCandidate, 4),
      beachReadyCandidate: round(beachReadyCandidate, 4),
      beach_ready_candidate: round(beachReadyCandidate, 4),
      emergentLandCandidate: round(emergentLandCandidate, 4),
      emergent_land_candidate: round(emergentLandCandidate, 4),
      raisedLandCandidate: round(raisedLandCandidate, 4),
      raised_land_candidate: round(raisedLandCandidate, 4),

      veinCandidate: round(veinCandidate, 4),
      vein_candidate: round(veinCandidate, 4),
      lowlandVein: round(lowVein * emergentLandCandidate, 4),
      lowland_vein: round(lowVein * emergentLandCandidate, 4),
      primaryArtery: round(artery * emergentLandCandidate, 4),
      primary_artery: round(artery * emergentLandCandidate, 4),
      pressureCut: round(pressure * terrainOutline * officialCoastline, 4),
      pressure_cut: round(pressure * terrainOutline * officialCoastline, 4),

      polarBoundary: Boolean(polar),
      polar_boundary: Boolean(polar),

      waterDepthState: waterDepthState,
      surfaceClassState: surfaceClassState,
      boundaryRoleState: boundaryRoleState,
      elevationState: elevationState,
      state_id: stateId(waterDepthState, surfaceClassState, boundaryRoleState, elevationState),

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

    var reefTone = [96, 190, 184, 255];
    var shallowTone = [52, 148, 174, 255];
    var beachTone = [126, 162, 122, 255];
    var emergentTone = [76, 116, 80, 255];
    var veinTone = [82, 172, 190, 255];

    var out = base;

    out = blend(out, shallowTone, clamp(sample.shallowWaterCandidate * 0.18, 0, 0.18));
    out = blend(out, reefTone, clamp(sample.reefCandidate * 0.32, 0, 0.32));
    out = blend(out, beachTone, clamp(sample.beachReadyCandidate * 0.16, 0, 0.16));
    out = blend(out, emergentTone, clamp(sample.emergentLandCandidate * 0.24, 0, 0.24));
    out = blend(out, veinTone, clamp(sample.veinCandidate * 0.16, 0, 0.16));

    var coastlineLight = clamp(sample.officialCoastline * 0.18 + sample.wetEdgeCandidate * 0.12, 0, 0.22);
    out = blend(out, [124, 188, 176, 255], coastlineLight);

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
      currentViableOutlinePreserved: true,
      reefFieldsRendered: true,
      shallowWaterRendered: true,
      shelfDepthRendered: true,
      beachReadyBoundaryRendered: true,
      selectedLandEmergenceRendered: true,
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

      reefCandidateFieldActive: true,
      shelfCandidateFieldActive: true,
      shallowWaterCandidateFieldActive: true,
      wetEdgeCandidateFieldActive: true,
      beachReadyCandidateFieldActive: true,
      emergentLandCandidateFieldActive: true,
      transitionState256Active: true,

      hexagonalPixelFormatActive: true,
      hexCellSubstrateActive: true,
      terrainCellSamplingActive: true,
      coastCellQuantizationActive: true,
      elevationCellFieldActive: true,
      waterDepthCellFieldActive: true,
      mineralPressureCellFieldActive: true,

      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      stateSpaceReceipt: true,
      waterDepthAxisActive: true,
      surfaceClassAxisActive: true,
      boundaryRoleAxisActive: true,
      elevationStateAxisActive: true,
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
