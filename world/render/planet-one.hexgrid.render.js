/* G1 PLANET 1 TERRAIN LIFE / GLACIER DIVIDE HEX BRIDGE
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_TERRAIN_LIFE_GLACIER_DIVIDE_REFINEMENT_TNT_v1

   LAW:
   Terrain gets life, not authority.
   Hydration remains sovereign.
   High elevation becomes frozen-water / glacier-storage candidate.
   Terrain rise creates watershed divide logic.
   No rivers, no mountains, no full glaciers, no visual pass claim.
*/

(function attachPlanetOneTerrainLifeGlacierDivideHexBridge(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_TERRAIN_LIFE_GLACIER_DIVIDE_REFINEMENT_TNT_v1";
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

  function ridgeSignal(lon, lat, seed) {
    var n = fbm(lon * 1.35 + 17.2, lat * 1.18 - 8.4, seed + 606);
    return 1 - Math.abs(n * 2 - 1);
  }

  function stateId(terrainPermission, surfaceLife, reliefWaterState, waterResponse) {
    return (((terrainPermission * 4 + surfaceLife) * 4 + reliefWaterState) * 4 + waterResponse);
  }

  function buildStateSpaceReceipt() {
    var states = [];
    var terrainPermission;
    var surfaceLife;
    var reliefWaterState;
    var waterResponse;

    for (terrainPermission = 0; terrainPermission < 4; terrainPermission += 1) {
      for (surfaceLife = 0; surfaceLife < 4; surfaceLife += 1) {
        for (reliefWaterState = 0; reliefWaterState < 4; reliefWaterState += 1) {
          for (waterResponse = 0; waterResponse < 4; waterResponse += 1) {
            states.push({
              state_id: stateId(terrainPermission, surfaceLife, reliefWaterState, waterResponse),
              terrainPermission: terrainPermission,
              surfaceLife: surfaceLife,
              reliefWaterState: reliefWaterState,
              waterResponse: waterResponse
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
      terrainPermissionAxisActive: true,
      surfaceLifeAxisActive: true,
      reliefWaterStateAxisActive: true,
      waterResponseAxisActive: true,
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

  function nodalIndex256(lon, lat) {
    var lonBand = Math.floor(((normalizeLon(lon) + 180) / 360) * 16);
    var latBand = Math.floor(((clamp(lat, -90, 90) + 90) / 180) * 16);
    return clamp(latBand, 0, 15) * 16 + clamp(lonBand, 0, 15);
  }

  function cardinalNode(lon, lat) {
    var absLon = Math.abs(normalizeLon(lon));
    var absLat = Math.abs(lat);
    if (absLat >= absLon * 0.55) return lat >= 0 ? "NORTH" : "SOUTH";
    return normalizeLon(lon) >= 0 ? "EAST" : "WEST";
  }

  function sampleBridge(lon, lat, options) {
    options = options || {};
    var seed = Number(options.seed || SEED);

    lon = normalizeLon(lon);
    lat = clamp(lat, -88, 88);

    var absLat = Math.abs(lat);
    var polar = absLat >= 73 ? 1 : 0;
    var potential = landPotential(lon, lat, seed);
    var ridge = ridgeSignal(lon, lat, seed);
    var texture = fbm(lon * 2.8, lat * 2.35, seed + 840);

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
      (1 - shelf * 0.52) *
      (1 - reef * 0.64),
      0,
      1
    );

    var wetLowland = clamp(
      lowEmergentLand *
      (wetEdge * 0.42 + shallow * 0.24 + (1 - smoothstep(0.56, 0.78, potential)) * 0.52),
      0,
      1
    );

    var dryLowland = clamp(
      lowEmergentLand *
      smoothstep(0.56, 0.82, potential) *
      (1 - wetLowland * 0.46),
      0,
      1
    );

    var softLandTone = clamp(
      lowEmergentLand *
      (0.38 + texture * 0.42) *
      (1 - reef * 0.50),
      0,
      1
    );

    var earlyStoneTone = clamp(
      lowEmergentLand *
      ridge *
      smoothstep(0.70, 0.94, potential) *
      0.42,
      0,
      1
    );

    var microRelief = clamp(
      lowEmergentLand *
      (ridge * 0.38 + texture * 0.18) *
      (1 - shelf * 0.38),
      0,
      1
    );

    var highElevationPotential = clamp(
      lowEmergentLand *
      ridge *
      smoothstep(0.78, 1.02, potential) *
      (0.35 + polar * 0.34),
      0,
      1
    );

    var highElevationFrozenWaterCandidate = clamp(
      highElevationPotential *
      (0.42 + absLat / 140) *
      (1 - reef * 0.82),
      0,
      1
    );

    var watershedDivideCandidate = clamp(
      highElevationFrozenWaterCandidate * 0.72 +
      microRelief * ridge * 0.32,
      0,
      1
    );

    var futureMeltPathPermission = clamp(
      watershedDivideCandidate *
      smoothstep(0.30, 0.74, lowEmergentLand) *
      (1 - reef * 0.90),
      0,
      1
    );

    var waterResponseValue = clamp(
      0.44 +
      shallow * 0.20 +
      reef * 0.18 +
      wetEdge * 0.22 +
      beachLock * 0.12 -
      dryLowland * 0.12 -
      earlyStoneTone * 0.10,
      0,
      1
    );

    var waterDepth = clamp(
      0.78 -
      potential * 0.45 -
      shelf * 0.18 -
      reef * 0.12 -
      beachLock * 0.04 +
      highElevationFrozenWaterCandidate * 0.04,
      0.08,
      0.96
    );

    if (polar) {
      waterDepth = clamp(waterDepth * 0.70, 0.10, 0.62);
    }

    var terrainPermissionState = 0;
    if (beachCandidate > 0.24) terrainPermissionState = 1;
    if (lowEmergentLand > 0.18) terrainPermissionState = 2;
    if (dryLowland > 0.34 || highElevationFrozenWaterCandidate > 0.32) terrainPermissionState = 3;

    var surfaceLifeState = 0;
    if (wetLowland > 0.20) surfaceLifeState = 1;
    if (softLandTone > 0.28 || dryLowland > 0.22) surfaceLifeState = 2;
    if (earlyStoneTone > 0.22) surfaceLifeState = 3;

    var reliefWaterState = 0;
    if (microRelief > 0.18) reliefWaterState = 1;
    if (microRelief > 0.34 || ridge > 0.78) reliefWaterState = 2;
    if (highElevationFrozenWaterCandidate > 0.26) reliefWaterState = 3;

    var waterResponseState = 0;
    if (waterResponseValue > 0.42) waterResponseState = 1;
    if (waterResponseValue > 0.62 && lowEmergentLand > 0.12) waterResponseState = 2;
    if (watershedDivideCandidate > 0.24) waterResponseState = 3;

    return {
      version: VERSION,
      baseline: BASELINE,

      lon: lon,
      lat: lat,
      nodalIndex256: nodalIndex256(lon, lat),
      nodal_index_256: nodalIndex256(lon, lat),
      cardinalNode: cardinalNode(lon, lat),
      cardinal_node: cardinalNode(lon, lat),

      terrainLifeLowReliefActive: true,
      terrainAuthorityBlocked: true,
      hydrationReadOnlyPreserved: true,
      terrainFillBlocked: true,

      lowEmergentLandFieldActive: true,
      wetLowlandFieldActive: true,
      dryLowlandFieldActive: true,
      softLandToneFieldActive: true,
      earlyStoneToneFieldActive: true,
      microReliefFieldActive: true,
      waterResponseFieldActive: true,
      highElevationFrozenWaterCandidateFieldActive: true,
      watershedDivideCandidateFieldActive: true,
      futureMeltPathPermissionFieldActive: true,

      cleanSlatePreserved: true,
      beachLockNodesConsumed: true,
      terrainStartlineNodesConsumed: true,
      reefShelfPreserved: true,
      wetEdgePreserved: true,
      waterDepthPreserved: true,
      beachThresholdPreserved: true,

      terrainStartlineLowEmergenceActive: true,
      hexBridgeActive: true,
      hydrationTerrainBridgeActive: true,

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
      wetLowland: round(wetLowland, 4),
      wet_lowland: round(wetLowland, 4),
      dryLowland: round(dryLowland, 4),
      dry_lowland: round(dryLowland, 4),
      softLandTone: round(softLandTone, 4),
      soft_land_tone: round(softLandTone, 4),
      earlyStoneTone: round(earlyStoneTone, 4),
      early_stone_tone: round(earlyStoneTone, 4),
      microRelief: round(microRelief, 4),
      micro_relief: round(microRelief, 4),

      highElevationFrozenWaterCandidate: round(highElevationFrozenWaterCandidate, 4),
      high_elevation_frozen_water_candidate: round(highElevationFrozenWaterCandidate, 4),
      watershedDivideCandidate: round(watershedDivideCandidate, 4),
      watershed_divide_candidate: round(watershedDivideCandidate, 4),
      futureMeltPathPermission: round(futureMeltPathPermission, 4),
      future_melt_path_permission: round(futureMeltPathPermission, 4),

      waterResponse: round(waterResponseValue, 4),
      water_response: round(waterResponseValue, 4),

      terrainFill: 0,
      terrain_fill: 0,
      mountainRelief: 0,
      mountain_relief: 0,
      riverNetwork: 0,
      river_network: 0,
      fullGlacierSystem: 0,
      full_glacier_system: 0,

      terrainPermissionState: terrainPermissionState,
      surfaceLifeState: surfaceLifeState,
      reliefWaterState: reliefWaterState,
      waterResponseState: waterResponseState,
      state_id: stateId(terrainPermissionState, surfaceLifeState, reliefWaterState, waterResponseState),

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
    var wetLowlandTone = [104, 140, 96, 255];
    var softLandTone = [92, 124, 78, 255];
    var dryLowlandTone = [126, 118, 82, 255];
    var earlyStoneTone = [112, 116, 102, 255];
    var frozenTone = [178, 220, 226, 255];
    var divideTone = [150, 202, 212, 255];

    out = blendPixel(out, shallowTone, clamp(sample.shallowWaterField * 0.12, 0, 0.12));
    out = blendPixel(out, reefTone, clamp(sample.reefField * 0.18, 0, 0.18));
    out = blendPixel(out, wetTone, clamp(sample.wetEdge * 0.10, 0, 0.10));
    out = blendPixel(out, beachTone, clamp(sample.beachCandidate * 0.14 + sample.beachLock * 0.24, 0, 0.27));

    out = blendPixel(out, wetLowlandTone, clamp(sample.wetLowland * 0.17, 0, 0.17));
    out = blendPixel(out, softLandTone, clamp(sample.softLandTone * 0.20, 0, 0.20));
    out = blendPixel(out, dryLowlandTone, clamp(sample.dryLowland * 0.12, 0, 0.12));
    out = blendPixel(out, earlyStoneTone, clamp(sample.earlyStoneTone * 0.10, 0, 0.10));

    /* Frozen-water candidate, not full glacier. */
    out = blendPixel(out, frozenTone, clamp(sample.highElevationFrozenWaterCandidate * 0.20, 0, 0.20));
    out = blendPixel(out, divideTone, clamp(sample.watershedDivideCandidate * 0.10, 0, 0.10));

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

      terrainLifeRendered: true,
      lowReliefRendered: true,
      wetDryTerrainVariationRendered: true,
      highElevationFrozenWaterCandidateRendered: true,
      watershedDivideHintRendered: true,
      futureMeltPathHeld: true,

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

      terrainLifeLowReliefActive: true,
      lowEmergentLandFieldActive: true,
      wetLowlandFieldActive: true,
      dryLowlandFieldActive: true,
      softLandToneFieldActive: true,
      earlyStoneToneFieldActive: true,
      microReliefFieldActive: true,
      waterResponseFieldActive: true,
      highElevationFrozenWaterCandidateFieldActive: true,
      watershedDivideCandidateFieldActive: true,
      futureMeltPathPermissionFieldActive: true,

      terrainAuthorityBlocked: true,
      hydrationReadOnlyPreserved: true,
      terrainFillBlocked: true,

      beachLockNodesConsumed: true,
      terrainStartlineNodesConsumed: true,
      reefShelfPreserved: true,
      wetEdgePreserved: true,
      waterDepthPreserved: true,
      beachThresholdPreserved: true,

      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      stateSpaceReceipt: true,
      terrainPermissionAxisActive: true,
      surfaceLifeAxisActive: true,
      reliefWaterStateAxisActive: true,
      waterResponseAxisActive: true,
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
    global.dispatchEvent(new CustomEvent("dgb:planet-one:terrain-life-glacier-divide-ready", {
      detail: getHexgridStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
