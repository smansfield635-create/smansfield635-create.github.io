/* /assets/audralia.land.render.js
   AUDRALIA_G2_LAND_ENGINE_HYDROLOGY_READY_TERRAIN_TNT_v2

   ROLE=
   DOWNSTREAM_LIVING_WORLD_LAND_ENGINE

   OWNS=
   AUDRALIA_LANDMASS_STRUCTURE
   AUDRALIA_CONTINENT_AND_ISLAND_LOGIC
   AUDRALIA_ELEVATION_FIELD
   AUDRALIA_RIDGE_FIELD
   AUDRALIA_BASIN_FIELD
   AUDRALIA_MINERAL_FIELD
   AUDRALIA_DRY_INTERIOR_FIELD
   AUDRALIA_NINE_SUMMITS_LAND_REGION_PLACEMENT
   AUDRALIA_ORGANIC_COASTLINE_FOUNDATION
   SEAM_SAFE_LAND_FIELD
   HYDROLOGY_READY_TERRAIN
   WATERSHED_PRESSURE
   DRAINAGE_VECTOR_HINT
   CHANNEL_CARVE
   VALLEY_ENTRENCHMENT
   BASIN_CATCHMENT
   LAKE_SEAT
   GLACIAL_SEAT
   SNOWLINE_PRESSURE
   CIRQUE_PRESSURE
   MELTWATER_PATH
   COASTAL_OUTLET
   DRY_WASH

   DOES_NOT_OWN=
   FINAL_WATER_COLOR
   FINAL_OCEAN_RENDERING
   FINAL_RIVER_RENDERING
   FINAL_GLACIER_RENDERING
   FINAL_LAKE_RENDERING
   FINAL_WETLAND_RENDERING
   FOLIAGE_RESPONSE
   ANIMAL_RESPONSE
   FINAL_TEXTURE_COMPOSITION
   PLATFORM_PROJECTION
   INSTRUMENT_STATE
   ROUTE_COPY
   SUN_PIXELS
   MOON_PIXELS
   GAUGES_LOGIC
   PRODUCT_LOGIC
   SHOWROOM_LAYOUT
   IMAGE_GENERATION
   GRAPHIC_BOX_BEHAVIOR

   OUTPUT=
   sampleLand(lon, lat, context)
   sampleUV(u, v, context)
   buildLandField(width, height, options)
   getRegions()
   createProfile()
   getStatus()

   CHAIN_POSITION=
   LAND → WATER → FOLIAGE → ANIMALS → PLANET_COMPOSITOR

   CANONICAL_SEQUENCE=
   Land carves.
   Water fills.
   Foliage responds.
   Animals inhabit.
   Compositor reveals.
*/

(function bindAudraliaLandRenderEngine(global) {
  "use strict";

  const VERSION = "AUDRALIA_G2_LAND_ENGINE_HYDROLOGY_READY_TERRAIN_TNT_v2";
  const ENGINE_ID = "audralia-land";
  const PLANET_ID = "audrelia";
  const CANONICAL_PLANET_ID = "audralia";
  const LABEL = "Audralia Land Engine";
  const TYPE = "land-engine";
  const DEG = Math.PI / 180;

  const REGION_DEFINITIONS = [
    {
      index: 1,
      key: "character_origin_ridge",
      summit: "Character",
      role: "origin ridge / exposed ancient stone / first watershed",
      lon: -122,
      lat: 23,
      rx: 36,
      ry: 25,
      rot: 17,
      weight: 0.92,
      elevationBase: 0.66,
      ridgeBase: 0.88,
      basinBase: 0.10,
      mineralBase: 0.74,
      dryBase: 0.25,
      ageBase: 0.98,
      coastlineBase: 0.66,
      hydrologyBase: 0.62,
      glacierBase: 0.62
    },
    {
      index: 2,
      key: "structure_foundation_plateau",
      summit: "Structure",
      role: "stable plateau / mature foundation land / predictable watershed",
      lon: -18,
      lat: 4,
      rx: 43,
      ry: 25,
      rot: -7,
      weight: 0.96,
      elevationBase: 0.56,
      ridgeBase: 0.54,
      basinBase: 0.25,
      mineralBase: 0.52,
      dryBase: 0.54,
      ageBase: 0.90,
      coastlineBase: 0.58,
      hydrologyBase: 0.46,
      glacierBase: 0.22
    },
    {
      index: 3,
      key: "balance_transition_basin",
      summit: "Balance",
      role: "transition basin / wet-dry-elevation meeting zone",
      lon: 20,
      lat: -47,
      rx: 31,
      ry: 20,
      rot: 22,
      weight: 0.86,
      elevationBase: 0.38,
      ridgeBase: 0.32,
      basinBase: 0.76,
      mineralBase: 0.36,
      dryBase: 0.30,
      ageBase: 0.80,
      coastlineBase: 0.74,
      hydrologyBase: 0.78,
      glacierBase: 0.40
    },
    {
      index: 4,
      key: "stability_habitable_shelf",
      summit: "Stability",
      role: "broad habitable shelf / reliable river mouths / coastal drainage",
      lon: 154,
      lat: -11,
      rx: 38,
      ry: 23,
      rot: -24,
      weight: 0.92,
      elevationBase: 0.42,
      ridgeBase: 0.34,
      basinBase: 0.42,
      mineralBase: 0.34,
      dryBase: 0.20,
      ageBase: 0.76,
      coastlineBase: 0.88,
      hydrologyBase: 0.70,
      glacierBase: 0.14
    },
    {
      index: 5,
      key: "peace_protected_basin",
      summit: "Peace",
      role: "protected basin / lake and wetland potential",
      lon: -54,
      lat: -47,
      rx: 31,
      ry: 21,
      rot: 13,
      weight: 0.84,
      elevationBase: 0.34,
      ridgeBase: 0.24,
      basinBase: 0.84,
      mineralBase: 0.28,
      dryBase: 0.14,
      ageBase: 0.76,
      coastlineBase: 0.78,
      hydrologyBase: 0.82,
      glacierBase: 0.30
    },
    {
      index: 6,
      key: "joy_bright_archipelago",
      summit: "Joy",
      role: "bright archipelago / small drainage systems / reef-fed rainfall",
      lon: -148,
      lat: 31,
      rx: 33,
      ry: 20,
      rot: -15,
      weight: 0.82,
      elevationBase: 0.36,
      ridgeBase: 0.24,
      basinBase: 0.40,
      mineralBase: 0.24,
      dryBase: 0.10,
      ageBase: 0.62,
      coastlineBase: 0.96,
      hydrologyBase: 0.62,
      glacierBase: 0.10
    },
    {
      index: 7,
      key: "dignity_mineral_crownland",
      summit: "Dignity",
      role: "elevated mineral crownland / snowline / exposed ridge pressure",
      lon: 139,
      lat: 36,
      rx: 34,
      ry: 21,
      rot: 9,
      weight: 0.86,
      elevationBase: 0.76,
      ridgeBase: 0.92,
      basinBase: 0.13,
      mineralBase: 0.94,
      dryBase: 0.48,
      ageBase: 0.99,
      coastlineBase: 0.62,
      hydrologyBase: 0.55,
      glacierBase: 0.76
    },
    {
      index: 8,
      key: "free_will_frontier_edge",
      summit: "Free Will",
      role: "frontier belt / seasonal channels / dry washes / open drainage",
      lon: 18,
      lat: 43,
      rx: 37,
      ry: 22,
      rot: 27,
      weight: 0.86,
      elevationBase: 0.50,
      ridgeBase: 0.58,
      basinBase: 0.28,
      mineralBase: 0.48,
      dryBase: 0.52,
      ageBase: 0.86,
      coastlineBase: 0.70,
      hydrologyBase: 0.50,
      glacierBase: 0.36
    },
    {
      index: 9,
      key: "love_convergence_heartland",
      summit: "Love",
      role: "convergence heartland / watersheds, basins, ridges, and routes meeting",
      lon: 84,
      lat: -14,
      rx: 68,
      ry: 39,
      rot: -12,
      weight: 1.20,
      elevationBase: 0.54,
      ridgeBase: 0.48,
      basinBase: 0.50,
      mineralBase: 0.46,
      dryBase: 0.30,
      ageBase: 0.84,
      coastlineBase: 0.82,
      hydrologyBase: 0.82,
      glacierBase: 0.24
    },
    {
      index: 10,
      key: "southern_old_basin",
      summit: "Balance",
      role: "ancient southern basin support / glacial meltwater receiver",
      lon: 96,
      lat: -58,
      rx: 45,
      ry: 13,
      rot: -4,
      weight: 0.58,
      elevationBase: 0.30,
      ridgeBase: 0.18,
      basinBase: 0.84,
      mineralBase: 0.26,
      dryBase: 0.18,
      ageBase: 0.96,
      coastlineBase: 0.56,
      hydrologyBase: 0.80,
      glacierBase: 0.58
    },
    {
      index: 11,
      key: "equatorial_island_chain",
      summit: "Joy",
      role: "equatorial island chain support / rain-carved channels",
      lon: -10,
      lat: -4,
      rx: 23,
      ry: 9,
      rot: 8,
      weight: 0.46,
      elevationBase: 0.26,
      ridgeBase: 0.16,
      basinBase: 0.34,
      mineralBase: 0.16,
      dryBase: 0.08,
      ageBase: 0.58,
      coastlineBase: 0.96,
      hydrologyBase: 0.54,
      glacierBase: 0.00
    },
    {
      index: 12,
      key: "western_littoral_chain",
      summit: "Stability",
      role: "western seam-safe littoral support / drainage mouth chain",
      lon: -174,
      lat: -15,
      rx: 17,
      ry: 32,
      rot: 4,
      weight: 0.55,
      elevationBase: 0.32,
      ridgeBase: 0.22,
      basinBase: 0.36,
      mineralBase: 0.22,
      dryBase: 0.18,
      ageBase: 0.70,
      coastlineBase: 0.88,
      hydrologyBase: 0.66,
      glacierBase: 0.08
    },
    {
      index: 13,
      key: "eastern_littoral_chain",
      summit: "Stability",
      role: "eastern seam-safe littoral support / drainage mouth chain",
      lon: 174,
      lat: -15,
      rx: 17,
      ry: 32,
      rot: -4,
      weight: 0.55,
      elevationBase: 0.32,
      ridgeBase: 0.22,
      basinBase: 0.36,
      mineralBase: 0.22,
      dryBase: 0.18,
      ageBase: 0.70,
      coastlineBase: 0.88,
      hydrologyBase: 0.66,
      glacierBase: 0.08
    }
  ];

  const RIDGE_DEFINITIONS = [
    { key: "love_spine", lon: 82, lat: -7, rx: 9, ry: 62, rot: 72, power: 0.84, glacier: 0.30 },
    { key: "southern_spine", lon: 119, lat: -32, rx: 8, ry: 36, rot: 82, power: 0.58, glacier: 0.45 },
    { key: "character_spine", lon: -108, lat: 20, rx: 7, ry: 32, rot: 108, power: 0.74, glacier: 0.55 },
    { key: "dignity_crown", lon: 149, lat: 31, rx: 7, ry: 29, rot: 72, power: 0.78, glacier: 0.80 },
    { key: "structure_fold", lon: -10, lat: 4, rx: 7, ry: 28, rot: 104, power: 0.54, glacier: 0.18 },
    { key: "free_will_fold", lon: 20, lat: 42, rx: 6, ry: 34, rot: 82, power: 0.52, glacier: 0.44 }
  ];

  const CHANNEL_CORRIDORS = [
    { key: "love_watershed_outlet", lon: 88, lat: -18, rx: 7, ry: 62, rot: 70, power: 0.78 },
    { key: "southern_meltwater_path", lon: 112, lat: -42, rx: 6, ry: 42, rot: 78, power: 0.64 },
    { key: "stability_coastal_outlet", lon: 153, lat: -12, rx: 8, ry: 36, rot: -18, power: 0.58 },
    { key: "peace_basin_drain", lon: -53, lat: -48, rx: 9, ry: 30, rot: 18, power: 0.56 },
    { key: "free_will_dry_wash", lon: 19, lat: 41, rx: 8, ry: 44, rot: 86, power: 0.62 },
    { key: "structure_plateau_drain", lon: -14, lat: -2, rx: 8, ry: 38, rot: 104, power: 0.54 },
    { key: "character_highland_drain", lon: -112, lat: 17, rx: 6, ry: 34, rot: 112, power: 0.54 }
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function mix(a, b, t) {
    return a * (1 - t) + b * t;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrapDeltaLon(lon, centerLon) {
    let d = lon - centerLon;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    return d;
  }

  function normalizeLon(lon) {
    let out = Number(lon) || 0;
    while (out > 180) out -= 360;
    while (out < -180) out += 360;
    return out;
  }

  function hashNoise(x, y, seed) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function fbm(x, y, seed) {
    let value = 0;
    let amp = 0.5;
    let freq = 1;

    for (let i = 0; i < 5; i += 1) {
      value += amp * hashNoise(x * freq, y * freq, seed + i * 13.71);
      amp *= 0.5;
      freq *= 2.03;
    }

    return value;
  }

  function rotatedEllipseField(lon, lat, region) {
    const dx = wrapDeltaLon(lon, region.lon);
    const dy = lat - region.lat;
    const rot = -(region.rot || 0) * DEG;

    const x = dx * Math.cos(rot) - dy * Math.sin(rot);
    const y = dx * Math.sin(rot) + dy * Math.cos(rot);

    const nx = x / region.rx;
    const ny = y / region.ry;
    const d2 = nx * nx + ny * ny;

    return Math.exp(-d2 * 1.52) * region.weight;
  }

  function elongatedField(lon, lat, cfg) {
    const dx = wrapDeltaLon(lon, cfg.lon);
    const dy = lat - cfg.lat;
    const rot = -(cfg.rot || 0) * DEG;

    const x = dx * Math.cos(rot) - dy * Math.sin(rot);
    const y = dx * Math.sin(rot) + dy * Math.cos(rot);

    const nx = x / cfg.rx;
    const ny = y / cfg.ry;
    const d2 = nx * nx + ny * ny;

    return Math.exp(-d2 * 1.7) * cfg.power;
  }

  function ridgeField(lon, lat) {
    let ridge = 0;
    let glacierRidge = 0;

    RIDGE_DEFINITIONS.forEach(function applyRidge(cfg) {
      const signal = elongatedField(lon, lat, cfg);
      ridge = Math.max(ridge, signal);
      glacierRidge = Math.max(glacierRidge, signal * cfg.glacier);
    });

    return {
      ridge: clamp(ridge, 0, 1),
      glacierRidge: clamp(glacierRidge, 0, 1)
    };
  }

  function channelField(lon, lat) {
    let channel = 0;

    CHANNEL_CORRIDORS.forEach(function applyChannel(cfg) {
      channel = Math.max(channel, elongatedField(lon, lat, cfg));
    });

    const branching =
      fbm(lon * 0.062, lat * 0.071, 1904.3) * 0.22 +
      fbm(lon * 0.140, lat * 0.126, 1971.8) * 0.10;

    return clamp(channel * 0.80 + branching, 0, 1);
  }

  function nearestRegionField(lon, lat) {
    let maxScore = 0;
    let sumScore = 0;
    let weightedScore = 0;
    let activeRegion = REGION_DEFINITIONS[0];

    REGION_DEFINITIONS.forEach(function scoreRegion(region) {
      const score = rotatedEllipseField(lon, lat, region);
      sumScore += score * 0.16;
      weightedScore += score;

      if (score > maxScore) {
        maxScore = score;
        activeRegion = region;
      }
    });

    return {
      maxScore,
      sumScore,
      weightedScore,
      combined: Math.max(maxScore, sumScore),
      activeRegion
    };
  }

  function baseTerrainAt(lonInput, latInput, context) {
    const lon = normalizeLon(lonInput);
    const lat = clamp(Number(latInput) || 0, -90, 90);
    const options = context || {};
    const field = nearestRegionField(lon, lat);
    const region = field.activeRegion;

    const coastlineNoise =
      (fbm(lon * 0.021, lat * 0.030, 91.4) - 0.5) * 0.145 +
      (fbm(lon * 0.052, lat * 0.061, 148.2) - 0.5) * 0.052 +
      Math.sin((lon + lat * 1.7) * 0.047) * 0.020;

    const ancientErosion =
      (fbm(lon * 0.012, lat * 0.018, 301.7) - 0.5) * 0.078;

    const threshold =
      (options.landThreshold !== undefined ? Number(options.landThreshold) : 0.405) +
      coastlineNoise +
      ancientErosion;

    const terrain = field.combined - threshold;
    const landMask = smoothstep(-0.035, 0.040, terrain);
    const hardLandMask = terrain > 0 ? 1 : 0;
    const coastlinePressure = clamp((1 - smoothstep(0.018, 0.135, Math.abs(terrain))) * region.coastlineBase, 0, 1);

    const ridgePack = ridgeField(lon, lat);
    const detailNoise = fbm(lon * 0.080, lat * 0.092, 814.2);
    const basinNoise = fbm(lon * 0.026, lat * 0.033, 417.5);
    const mineralNoise = fbm(lon * 0.070, lat * 0.048, 512.9);
    const dryNoise = fbm(lon * 0.020, lat * 0.025, 209.8);

    const absLat = Math.abs(lat);
    const dryLatitude = Math.exp(-Math.pow((absLat - 27) / 17, 2));
    const polarLimit = smoothstep(52, 82, absLat);

    const elevation = clamp(
      landMask * (
        region.elevationBase * 0.52 +
        ridgePack.ridge * 0.42 +
        detailNoise * 0.18 +
        region.ageBase * 0.06 -
        coastlinePressure * 0.14
      ),
      0,
      1
    );

    const ridge = clamp(
      landMask * (
        region.ridgeBase * 0.40 +
        ridgePack.ridge * 0.52 +
        detailNoise * 0.18
      ),
      0,
      1
    );

    const basin = clamp(
      landMask * (
        region.basinBase * 0.55 +
        (1 - ridgePack.ridge) * 0.18 +
        basinNoise * 0.22 -
        elevation * 0.18
      ),
      0,
      1
    );

    const mineral = clamp(
      landMask * (
        region.mineralBase * 0.52 +
        ridge * 0.30 +
        mineralNoise * 0.24 +
        region.ageBase * 0.10
      ),
      0,
      1
    );

    const dryInterior = clamp(
      landMask * (
        region.dryBase * 0.52 +
        dryLatitude * 0.34 +
        dryNoise * 0.24 -
        coastlinePressure * 0.18 -
        polarLimit * 0.12
      ),
      0,
      1
    );

    const ancientGeology = clamp(
      landMask * (
        region.ageBase * 0.62 +
        ridge * 0.20 +
        basin * 0.12 +
        fbm(lon * 0.015, lat * 0.021, 608.4) * 0.16
      ),
      0,
      1
    );

    return {
      lon,
      lat,
      field,
      region,
      threshold,
      terrain,
      landMask,
      hardLandMask,
      continentField: field.combined,
      coastlinePressure,
      elevation,
      ridge,
      ridgePack,
      basin,
      mineral,
      dryInterior,
      ancientGeology,
      polarLimit,
      dryLatitude
    };
  }

  function elevationAt(lon, lat, context) {
    const base = baseTerrainAt(lon, lat, context);
    return base.elevation + base.ridge * 0.18 - base.basin * 0.08;
  }

  function drainageVectorAt(lon, lat, context) {
    const step = 0.85;
    const eWest = elevationAt(lon - step, lat, context);
    const eEast = elevationAt(lon + step, lat, context);
    const eSouth = elevationAt(lon, lat - step, context);
    const eNorth = elevationAt(lon, lat + step, context);

    const gradientX = eEast - eWest;
    const gradientY = eNorth - eSouth;

    const flowX = -gradientX;
    const flowY = -gradientY;
    const magnitude = Math.sqrt(flowX * flowX + flowY * flowY);
    const safeMagnitude = magnitude || 1;

    return {
      x: clamp(flowX / safeMagnitude, -1, 1),
      y: clamp(flowY / safeMagnitude, -1, 1),
      magnitude: clamp(magnitude * 3.2, 0, 1),
      angleDeg: Math.atan2(flowY, flowX) / DEG
    };
  }

  function sampleLand(lonInput, latInput, context) {
    const base = baseTerrainAt(lonInput, latInput, context || {});
    const lon = base.lon;
    const lat = base.lat;
    const region = base.region;
    const absLat = Math.abs(lat);
    const channel = channelField(lon, lat);
    const drainageVectorHint = drainageVectorAt(lon, lat, context || {});

    const highColdLatitude =
      smoothstep(34, 70, absLat) * 0.45 +
      smoothstep(46, 82, absLat) * 0.48;

    const snowlinePressure = clamp(
      base.landMask * (
        highColdLatitude +
        smoothstep(0.58, 0.92, base.elevation) * 0.42 +
        smoothstep(0.52, 0.88, base.ridge) * 0.24 +
        region.glacierBase * 0.18 -
        base.dryInterior * 0.16
      ),
      0,
      1
    );

    const glacialSeat = clamp(
      base.landMask * (
        snowlinePressure * 0.56 +
        base.ridgePack.glacierRidge * 0.48 +
        region.glacierBase * 0.24 +
        smoothstep(0.66, 0.94, base.elevation) * 0.28 -
        base.coastlinePressure * 0.20
      ),
      0,
      1
    );

    const cirquePressure = clamp(
      base.landMask * (
        glacialSeat * 0.44 +
        base.ridge * 0.28 +
        base.basin * 0.24 +
        fbm(lon * 0.095, lat * 0.083, 2309.6) * 0.16 -
        base.dryInterior * 0.10
      ),
      0,
      1
    );

    const watershedPressure = clamp(
      base.landMask * (
        region.hydrologyBase * 0.30 +
        base.elevation * 0.26 +
        base.ridge * 0.22 +
        drainageVectorHint.magnitude * 0.22 +
        channel * 0.14 -
        base.basin * 0.08
      ),
      0,
      1
    );

    const channelCarve = clamp(
      base.landMask * (
        channel * 0.44 +
        drainageVectorHint.magnitude * 0.20 +
        watershedPressure * 0.18 +
        base.coastlinePressure * 0.12 +
        glacialSeat * 0.10 -
        base.ridge * 0.08
      ),
      0,
      1
    );

    const valleyEntrenchment = clamp(
      base.landMask * (
        channelCarve * 0.42 +
        base.ridge * 0.18 +
        base.ancientGeology * 0.16 +
        drainageVectorHint.magnitude * 0.18 +
        cirquePressure * 0.10
      ),
      0,
      1
    );

    const basinCatchment = clamp(
      base.landMask * (
        base.basin * 0.46 +
        channelCarve * 0.20 +
        region.hydrologyBase * 0.18 +
        (1 - base.elevation) * 0.18 +
        fbm(lon * 0.033, lat * 0.029, 2444.1) * 0.13
      ),
      0,
      1
    );

    const lakeSeat = clamp(
      base.landMask * (
        basinCatchment * 0.48 +
        base.basin * 0.26 +
        cirquePressure * 0.16 +
        (1 - base.dryInterior) * 0.14 -
        base.coastlinePressure * 0.10
      ),
      0,
      1
    );

    const meltwaterPath = clamp(
      base.landMask * (
        glacialSeat * 0.22 +
        cirquePressure * 0.22 +
        channelCarve * 0.34 +
        valleyEntrenchment * 0.22 +
        drainageVectorHint.magnitude * 0.16
      ),
      0,
      1
    );

    const coastalOutlet = clamp(
      base.landMask * (
        base.coastlinePressure * 0.50 +
        channelCarve * 0.26 +
        watershedPressure * 0.16 +
        drainageVectorHint.magnitude * 0.10
      ),
      0,
      1
    );

    const dryWash = clamp(
      base.landMask * (
        base.dryInterior * 0.44 +
        channelCarve * 0.30 +
        valleyEntrenchment * 0.18 +
        base.dryLatitude * 0.14 -
        lakeSeat * 0.16 -
        glacialSeat * 0.18
      ),
      0,
      1
    );

    return {
      ok: true,
      engine: ENGINE_ID,
      planet: CANONICAL_PLANET_ID,
      lon,
      lat,
      landMask: base.landMask,
      hardLandMask: base.hardLandMask,
      terrain: base.terrain,
      continentField: base.continentField,
      coastlinePressure: base.coastlinePressure,
      elevation: base.elevation,
      ridge: base.ridge,
      basin: base.basin,
      mineral: base.mineral,
      dryInterior: base.dryInterior,
      ancientGeology: base.ancientGeology,
      polarLimit: base.polarLimit,
      watershedPressure,
      drainageVectorHint,
      channelCarve,
      valleyEntrenchment,
      basinCatchment,
      lakeSeat,
      glacialSeat,
      snowlinePressure,
      cirquePressure,
      meltwaterPath,
      coastalOutlet,
      dryWash,
      hydrologyReady: true,
      glacierBoundaryRule: "glaciers_are_water_but_glacial_seats_are_land",
      summitRegion: region.key,
      summitName: region.summit,
      summitIndex: region.index,
      regionRole: region.role,
      seamSafe: true,
      noWrongEdgePolygonChords: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function sampleUV(u, v, context) {
    const lon = ((Number(u) || 0) % 1) * 360 - 180;
    const lat = 90 - clamp(Number(v) || 0, 0, 1) * 180;
    return sampleLand(lon, lat, context);
  }

  function buildLandField(width, height, options) {
    const w = Math.max(1, Math.floor(Number(width) || 1));
    const h = Math.max(1, Math.floor(Number(height) || 1));
    const channels = 20;
    const data = new Float32Array(w * h * channels);
    let i = 0;

    for (let y = 0; y < h; y += 1) {
      const v = y / Math.max(1, h - 1);

      for (let x = 0; x < w; x += 1) {
        const u = x / w;
        const sample = sampleUV(u, v, options || {});

        data[i] = sample.landMask;
        data[i + 1] = sample.elevation;
        data[i + 2] = sample.ridge;
        data[i + 3] = sample.basin;
        data[i + 4] = sample.mineral;
        data[i + 5] = sample.dryInterior;
        data[i + 6] = sample.coastlinePressure;
        data[i + 7] = sample.summitIndex;
        data[i + 8] = sample.watershedPressure;
        data[i + 9] = sample.drainageVectorHint.x;
        data[i + 10] = sample.drainageVectorHint.y;
        data[i + 11] = sample.channelCarve;
        data[i + 12] = sample.valleyEntrenchment;
        data[i + 13] = sample.basinCatchment;
        data[i + 14] = sample.lakeSeat;
        data[i + 15] = sample.glacialSeat;
        data[i + 16] = sample.snowlinePressure;
        data[i + 17] = sample.cirquePressure;
        data[i + 18] = sample.meltwaterPath;
        data[i + 19] = Math.max(sample.coastalOutlet, sample.dryWash);

        i += channels;
      }
    }

    return {
      ok: true,
      engine: ENGINE_ID,
      planet: CANONICAL_PLANET_ID,
      width: w,
      height: h,
      channels,
      channelMap: [
        "landMask",
        "elevation",
        "ridge",
        "basin",
        "mineral",
        "dryInterior",
        "coastlinePressure",
        "summitIndex",
        "watershedPressure",
        "drainageVectorX",
        "drainageVectorY",
        "channelCarve",
        "valleyEntrenchment",
        "basinCatchment",
        "lakeSeat",
        "glacialSeat",
        "snowlinePressure",
        "cirquePressure",
        "meltwaterPath",
        "coastalOutletOrDryWash"
      ],
      data,
      hydrologyReady: true,
      seamSafe: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function getRegions() {
    return REGION_DEFINITIONS.map(function clone(region) {
      return {
        index: region.index,
        key: region.key,
        summit: region.summit,
        role: region.role,
        lon: region.lon,
        lat: region.lat,
        rx: region.rx,
        ry: region.ry,
        rot: region.rot,
        hydrologyBase: region.hydrologyBase,
        glacierBase: region.glacierBase,
        seamSafe: true
      };
    });
  }

  function createProfile() {
    return {
      id: ENGINE_ID,
      planetId: PLANET_ID,
      canonicalPlanetId: CANONICAL_PLANET_ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      chainPosition: 1,
      chain: "LAND_TO_WATER_TO_FOLIAGE_TO_ANIMALS_TO_PLANET_COMPOSITOR",
      ownsLandOnly: true,
      ownsWater: false,
      ownsFoliage: false,
      ownsAnimals: false,
      ownsFinalTexture: false,
      hydrologyReadyTerrain: true,
      landPreparesWater: true,
      glacierBoundaryRule: "glaciers_are_water_but_glacial_seats_are_land",
      seamSafeTerrain: true,
      noWrongEdgePolygonChords: true,
      organicCoastlineFoundation: true,
      nineSummitLandRegions: true,
      fourTimesEarthAgeLandExpression: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      outputs: [
        "landMask",
        "elevation",
        "ridge",
        "basin",
        "mineral",
        "dryInterior",
        "ancientGeology",
        "coastlinePressure",
        "summitRegion",
        "watershedPressure",
        "drainageVectorHint",
        "channelCarve",
        "valleyEntrenchment",
        "basinCatchment",
        "lakeSeat",
        "glacialSeat",
        "snowlinePressure",
        "cirquePressure",
        "meltwaterPath",
        "coastalOutlet",
        "dryWash"
      ],
      forbiddenOwnership: [
        "finalWaterColor",
        "finalOceanRendering",
        "finalRiverRendering",
        "finalGlacierRendering",
        "finalLakeRendering",
        "finalWetlandRendering",
        "foliageResponse",
        "animalResponse",
        "finalTextureComposition",
        "routeShell",
        "instrument",
        "gauges",
        "products",
        "sun",
        "moon"
      ]
    };
  }

  function getStatus() {
    return {
      ok: true,
      id: ENGINE_ID,
      planetId: PLANET_ID,
      canonicalPlanetId: CANONICAL_PLANET_ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      file: "/assets/audralia.land.render.js",
      chainPosition: 1,
      ownsLandOnly: true,
      landEngineReady: true,
      hydrologyReadyTerrain: true,
      landPreparesWater: true,
      glacierBoundaryRule: "glaciers_are_water_but_glacial_seats_are_land",
      watershedPressure: true,
      drainageVectorHint: true,
      channelCarve: true,
      valleyEntrenchment: true,
      basinCatchment: true,
      lakeSeat: true,
      glacialSeat: true,
      snowlinePressure: true,
      cirquePressure: true,
      meltwaterPath: true,
      coastalOutlet: true,
      dryWash: true,
      seamSafeTerrain: true,
      noWrongEdgePolygonChords: true,
      organicCoastlineFoundation: true,
      nineSummitLandRegions: true,
      ancientGeology: true,
      dryInteriors: true,
      ridgeField: true,
      basinField: true,
      mineralField: true,
      coastlinePressure: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  const api = {
    id: ENGINE_ID,
    planetId: PLANET_ID,
    canonicalPlanetId: CANONICAL_PLANET_ID,
    label: LABEL,
    type: TYPE,
    version: VERSION,
    VERSION,
    aliases: [
      "audralia-land",
      "audrelia-land",
      "audralia-terrain-land",
      "audralia-hydrology-ready-land",
      "audralia-living-world-land"
    ],
    createProfile,
    sampleLand,
    sample: sampleLand,
    sampleUV,
    buildLandField,
    getRegions,
    getStatus
  };

  global.DGBAudraliaLandRenderEngine = api;
  global.DGBAudreliaLandRenderEngine = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAudraliaLandRenderEngine = api;
  global.DiamondGateBridge.DGBAudreliaLandRenderEngine = api;

  try {
    global.dispatchEvent(
      new CustomEvent("dgb:audralia:land-engine-ready", {
        detail: getStatus()
      })
    );

    global.dispatchEvent(
      new CustomEvent("dgb:audrelia:land-engine-ready", {
        detail: getStatus()
      })
    );
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);
