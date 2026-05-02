/* G1 PLANET 1 TERRAIN STARTLINE LOW EMERGENCE HEX BRIDGE
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_TERRAIN_STARTLINE_LOW_EMERGENCE_TNT_v1

   LAW:
   BeachLock defines the legal terrain startline.
   Beaches must be visible definitively.
   Beaches do not become full land fill.
   Terrain may emerge only as restrained low land.
*/

(function attachPlanetOneTerrainStartlineHexBridge(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_TERRAIN_STARTLINE_LOW_EMERGENCE_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_CLEAN_SLATE_LOCK_IN_v1";
  var STATE_FORMULA = "4x4x4x4";
  var STATE_COUNT = 256;
  var SEED = 256451;

  var lastGrid = null;
  var lastDraw = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * m) / m;
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

  function stateId(beachAuthority, terrainPermission, surfaceBalance, visualRestraint) {
    return (((beachAuthority * 4 + terrainPermission) * 4 + surfaceBalance) * 4 + visualRestraint);
  }

  function buildStateSpaceReceipt() {
    var states = [];
    var beachAuthority;
    var terrainPermission;
    var surfaceBalance;
    var visualRestraint;

    for (beachAuthority = 0; beachAuthority < 4; beachAuthority += 1) {
      for (terrainPermission = 0; terrainPermission < 4; terrainPermission += 1) {
        for (surfaceBalance = 0; surfaceBalance < 4; surfaceBalance += 1) {
          for (visualRestraint = 0; visualRestraint < 4; visualRestraint += 1) {
            states.push({
              state_id: stateId(beachAuthority, terrainPermission, surfaceBalance, visualRestraint),
              beachAuthority: beachAuthority,
              terrainPermission: terrainPermission,
              surfaceBalance: surfaceBalance,
              visualRestraint: visualRestraint
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
      beachAuthorityAxisActive: true,
      terrainPermissionAxisActive: true,
      surfaceBalanceAxisActive: true,
      visualRestraintAxisActive: true,
      stateSpaceReceipt: true,
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
    var grain = (fbm(lon, lat, seed + 300) - 0.5) * 0.22;
    return Math.max(west, east, north, south, far) + grain;
  }

  function veinField(lon, lat, seed, offset, scale, width) {
    var n = fbm(lon * 0.68 + offset, lat * 0.82 - offset, seed + offset);
    var line = Math.abs(Math.sin(degToRad(lon * scale + lat * scale * 1.42 + n * 88 + offset)));
    return 1 - smoothstep(0, width, line);
  }

  function nodalIndex256(lon, lat) {
    var lonBand = Math.floor(((normalizeLon(lon) + 180) / 360) * 16);
    var latBand = Math.floor(((clamp(lat, -90, 90) + 90) / 180) * 16);
    return clamp(latBand, 0, 15) * 16 + clamp(lonBand, 0, 15);
  }

  function sampleBridge(lon, lat, options) {
    options = options || {};
    var seed = Number(options.seed || SEED);

    lon = normalizeLon(lon);
    lat = clamp(lat, -88, 88);

    var absLat = Math.abs(lat);
    var polar = absLat >= 73 ? 1 : 0;
    var potential = landPotential(lon, lat, seed);

    var outline = smoothstep(0.055, 0.34, potential);
    var shelf = clamp(1 - Math.abs(potential - 0.055) / 0.30, 0, 1);
    var coastContact = clamp(1 - Math.abs(potential - 0.13) / 0.15, 0, 1);

    var reefNoise = fbm(lon * 2.5, lat * 2.1, seed + 909);
    var reef = clamp(shelf * coastContact * smoothstep(0.42, 0.92, reefNoise) * (1 - polar), 0, 1);
    var shallow = clamp(shelf * (1 - smoothstep(0.38, 0.75, potential)), 0, 1);
    var wetEdge = clamp(coastContact * outline * 0.88, 0, 1);

    var beachCandidate = clamp(
      wetEdge *
      smoothstep(0.12, 0.44, potential) *
      (1 - reef * 0.25),
      0,
      1
    );

    var beachLock = clamp(
      beachCandidate *
      smoothstep(0.38, 0.72, coastContact) *
      smoothstep(0.22, 0.50, outline),
      0,
      1
    );

    var terrainStartline = beachLock;
    var lowEmergentLand = clamp(
      beachLock *
      smoothstep(0.48, 0.84, potential) *
      (1 - shelf * 0.55) *
      (1 - reef * 0.68),
      0,
      1
    );

    var inlandRiseAllowed = clamp(
      lowEmergentLand *
      smoothstep(0.72, 0.92, potential),
      0,
      1
    );

    var lowVein = veinField(lon, lat, seed, 19, 1.10, 0.055);
    var artery = veinField(lon, lat, seed, 73, -1.52, 0.044);
    var pressure = veinField(lon, lat, seed, 131, 2.08, 0.036);

    var veinCandidate = clamp(
      Math.max(
        lowVein * terrainStartline * 0.12,
        artery * terrainStartline * 0.14,
        pressure * beachLock * 0.12
      ),
      0,
      1
    );

    var waterDepth = clamp(0.78 - potential * 0.45 - shelf * 0.18 - reef * 0.12 - beachLock * 0.04, 0.08, 0.96);
    if (polar) waterDepth = clamp(waterDepth * 0.70, 0.10, 0.62);

    var beachAuthorityState = 0;
    if (wetEdge > 0.20) beachAuthorityState = 1;
    if (beachCandidate > 0.32) beachAuthorityState = 2;
    if (beachLock > 0.48) beachAuthorityState = 3;

    var terrainPermissionState = 0;
    if (beachCandidate > 0.24) terrainPermissionState = 1;
    if (lowEmergentLand > 0.18) terrainPermissionState = 2;
    if (terrainStartline > 0.52) terrainPermissionState = 3;

    var surfaceBalanceState = 0;
    if (shelf > 0.24 || reef > 0.22) surfaceBalanceState = 1;
    if (wetEdge > 0.30 || beachLock > 0.30) surfaceBalanceState = 2;
    if (lowEmergentLand > 0.24) surfaceBalanceState = 3;

    var visualRestraintState = 0;
    if (beachCandidate > 0.22) visualRestraintState = 1;
    if (beachLock > 0.38 || lowEmergentLand > 0.18) visualRestraintState = 2;
    if (beachLock > 0.68 && lowEmergentLand > 0.42) visualRestraintState = 3;

    return {
      version: VERSION,
      baseline: BASELINE,

      lon: lon,
      lat: lat,
      nodalIndex256: nodalIndex256(lon, lat),
      nodal_index_256: nodalIndex256(lon, lat),

      terrainStartlineLowEmergenceActive: true,
      hexBridgeActive: true,
      beachThresholdBridgeActive: true,
      hydrationTerrainBridgeActive: true,

      beachLockNodesConsumed: true,
      terrainStartlineNodesConsumed: true,
      lowEmergentLandCandidateFieldActive: true,
      terrainRisePermissionFieldActive: true,
      noTerrainNodesPreserved: true,
      reefShelfPreserved: true,
      wetEdgePreserved: true,
      terrainFillBlocked: true,
      beachFillBlocked: true,

      terrainOutlineSourceActive: true,
      officialTerrainOutlineActive: true,
      waterDepthSamplingActive: true,
      shelfDistanceSamplingActive: true,
      reefShelfBoundaryNodesActive: true,
      beachCandidateNodesActive: true,
      beachLockNodesActive: true,
      terrainStartlineNodesActive: true,
      transitionState256Active: true,

      waterDepth: round(waterDepth, 4),
      water_depth: round(waterDepth, 4),

      terrainOutline: round(outline, 4),
      terrain_outline: round(outline, 4),
      officialCoastline: round(coastContact, 4),
      official_coastline: round(coastContact, 4),

      shelfField: round(shelf, 4),
      shelf_field: round(shelf, 4),
      reefField: round(reef, 4),
      reef_field: round(reef, 4),
      shallowWaterField: round(shallow, 4),
      shallow_water_field: round(shallow, 4),
      wetEdge: round(wetEdge, 4),
      wet_edge: round(wetEdge, 4),

      beachCandidate: round(beachCandidate, 4),
      beach_candidate: round(beachCandidate, 4),
      beachLock: round(beachLock, 4),
      beach_lock: round(beachLock, 4),

      terrainStartline: round(terrainStartline, 4),
      terrain_startline: round(terrainStartline, 4),
      lowEmergentLand: round(lowEmergentLand, 4),
      low_emergent_land: round(lowEmergentLand, 4),
      inlandRiseAllowed: round(inlandRiseAllowed, 4),
      inland_rise_allowed: round(inlandRiseAllowed, 4),

      terrainFill: 0,
      terrain_fill: 0,

      veinCandidate: round(veinCandidate, 4),
      vein_candidate: round(veinCandidate, 4),
      lowlandVein: round(lowVein * terrainStartline, 4),
      lowland_vein: round(lowVein * terrainStartline, 4),
      primaryArtery: round(artery * terrainStartline, 4),
      primary_artery: round(artery * terrainStartline, 4),
      pressureCut: round(pressure * beachLock, 4),
      pressure_cut: round(pressure * beachLock, 4),

      polarBoundary: Boolean(polar),
      polar_boundary: Boolean(polar),

      beachAuthorityState: beachAuthorityState,
      terrainPermissionState: terrainPermissionState,
      surfaceBalanceState: surfaceBalanceState,
      visualRestraintState: visualRestraintState,
      state_id: stateId(beachAuthorityState, terrainPermissionState, surfaceBalanceState, visualRestraintState),

      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,

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

  function blendPixel(base, over, alpha) {
    return [
      Math.round(mix(base[0], over[0], alpha)),
      Math.round(mix(base[1], over[1], alpha)),
      Math.round(mix(base[2], over[2], alpha)),
      255
    ];
  }

  function colorFromBridge(sample, hydration, limb) {
    var water = hydration && hydration.waterColor ? hydration.waterColor : { r: 12, g: 70, b: 130 };
    var out = [water.r, water.g, water.b, 255];

    var reefTone = [88, 190, 188, 255];
    var shallowTone = [48, 148, 176, 255];
    var wetTone = [112, 178, 164, 255];

    var beachTone = [226, 210, 150, 255];
    var beachBrightTone = [242, 224, 166, 255];

    var emergentTone = [92, 128, 82, 255];
    var veinTone = [72, 166, 190, 255];

    out = blendPixel(out, shallowTone, clamp(sample.shallowWaterField * 0.14, 0, 0.14));
    out = blendPixel(out, reefTone, clamp(sample.reefField * 0.22, 0, 0.22));
    out = blendPixel(out, wetTone, clamp(sample.wetEdge * 0.10, 0, 0.10));

    /* Definitive beach edge. This is edge indication, not land fill. */
    out = blendPixel(out, beachTone, clamp(sample.beachCandidate * 0.18, 0, 0.18));
    out = blendPixel(out, beachBrightTone, clamp(sample.beachLock * 0.32, 0, 0.32));

    /* Low-emergent land is restrained and cannot override beach/water authority. */
    out = blendPixel(out, emergentTone, clamp(sample.lowEmergentLand * 0.18, 0, 0.18));

    /* Veins remain held until later hydrology pass. */
    out = blendPixel(out, veinTone, clamp(sample.veinCandidate * 0.04, 0, 0.04));

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
    ctx.globalAlpha = Number(options.surfaceAlpha == null ? 0.98 : options.surfaceAlpha);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    lastDraw = {
      ok: true,
      version: VERSION,

      cleanSlatePreserved: true,
      lowEmergentLandRendered: true,
      terrainStartlineConsumed: true,
      beachLockNodesPreserved: true,
      beachLockNodesConsumed: true,
      terrainStartlineNodesConsumed: true,
      reefShelfPreserved: true,
      wetEdgePreserved: true,
      waterDepthPreserved: true,
      beachThresholdPreserved: true,

      beachesVisibleDefinitively: true,
      beachEdgeRenderedDefinitively: true,
      beachIsEdgeNotFill: true,

      terrainFillBlocked: true,
      noBlobReintroduced: true,
      noMountainRelief: true,
      noRiverNetwork: true,
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

      terrainStartlineLowEmergenceActive: true,
      hexBridgeActive: true,
      beachThresholdBridgeActive: true,
      hydrationTerrainBridgeActive: true,

      beachLockNodesConsumed: true,
      terrainStartlineNodesConsumed: true,
      lowEmergentLandCandidateFieldActive: true,
      terrainRisePermissionFieldActive: true,
      noTerrainNodesPreserved: true,
      reefShelfPreserved: true,
      wetEdgePreserved: true,
      terrainFillBlocked: true,
      beachFillBlocked: true,

      beachLockNodesActive: true,
      terrainStartlineNodesActive: true,
      beachesVisibleDefinitively: true,
      beachEdgeRenderedDefinitively: true,
      beachIsEdgeNotFill: true,

      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      stateSpaceReceipt: true,
      beachAuthorityAxisActive: true,
      terrainPermissionAxisActive: true,
      surfaceBalanceAxisActive: true,
      visualRestraintAxisActive: true,
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
    global.dispatchEvent(new CustomEvent("dgb:planet-one:terrain-startline-ready", {
      detail: getHexgridStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
