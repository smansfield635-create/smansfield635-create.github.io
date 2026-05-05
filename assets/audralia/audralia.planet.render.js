/*
  /assets/audralia/audralia.planet.render.js
  AUDRALIA_G2_HEALTHY_CLIMATE_ISLAND_AND_ELEVATION_REGION_TNT_v1

  Purpose:
  - Preserve Audralia as the active constructed home-world body.
  - Keep G2 parent-consumed terrain + hydration + climate.
  - Increase islands and miscellaneous territories so all Nine Summits regions have enough land capacity.
  - Preserve five major land bodies.
  - Preserve North Pole land body.
  - Preserve South Pole ice-only law.
  - Make Audralia behave like a clean, healthy Earth-like climate system.
  - Keep Audralia four-times-Earth-age in geological maturity without industrial poisoning.
  - Bind the Nine Summits regions to elevation order: higher regions occupy higher elevational status.
  - Prepare G3 ecology without falsely claiming G3 completion.

  Scope:
  - Audralia parent render-body authority only.
  - No Earth, Showroom selector, CSS, Gauges, Products, Sun, Moon, route shell, or global mutation.

  Public API preserved:
  - createProfile
  - buildTexture
  - sampleSurface
  - renderSurface
  - getStatus
  - registerExtension
*/

(function () {
  "use strict";

  const VERSION = "AUDRALIA_G2_HEALTHY_CLIMATE_ISLAND_AND_ELEVATION_REGION_TNT_v1";

  const BODY = Object.freeze({
    id: "audralia",
    legacyId: "audrelia",
    label: "Audralia",
    publicLabel: "Audralia",
    classification: "constructed-home-world-body",
    parentAuthority: "/assets/audralia/audralia.planet.render.js",
    generation: "G2_HEALTHY_CLIMATE_ISLAND_ELEVATION_REGION",
    generationClaim: "G2",
    generation3Prepared: true,
    generation3Claimed: false,
    generation4Claimed: false
  });

  const CONTRACT = Object.freeze({
    landBodies: 5,
    visibleSegments: 6,
    miscellaneousTerritories: "INCREASED",
    islandDensity: "HIGH",
    enoughLandForNineRegions: true,
    regionElevationLaw: true,
    southPoleIceOnly: true,
    northPoleLandBody: true,
    healthyClimate: true,
    earthLikeClimate: true,
    fourTimesEarthAge: true,
    toxicIndustrialHistory: false,
    toxicGasPoisoning: false,
    industrialWastePoisoning: false,
    pollutedAtmosphere: false,
    terrainFoundationPreserved: true,
    hydrationConsumed: true,
    climateConsumed: true,
    parentWorldBodyActive: true,
    ecologyPrepared: true,
    ecologyClaimed: false,
    visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION",
    imageGeneration: false,
    staticPictureReplacement: false,
    hybridBondStatus: "PASS"
  });

  const CHILDREN = Object.freeze({
    terrain: {
      status: "CONSUMED_BY_PARENT",
      generationRole: "G1_TERRAFORM_FOUNDATION"
    },
    hydration: {
      status: "CONSUMED_BY_PARENT",
      generationRole: "G2_HYDRATION_CHILD"
    },
    climate: {
      status: "CONSUMED_BY_PARENT",
      generationRole: "G2_CLIMATE_CHILD"
    },
    ecology: {
      status: "PREPARED_NOT_CLAIMED",
      generationRole: "G3_ECOLOGY_PREP"
    },
    fauna: {
      status: "NOT_BUILT",
      generationRole: "G4_FAUNA_FUTURE"
    }
  });

  const REGION_TIERS = Object.freeze([
    {
      region: 1,
      key: "character",
      name: "Character",
      elevationTier: "low-origin-ground",
      relativeElevation: 0.12,
      terrainRole: "origin plains, low coastal stone, first habitable ground",
      lon: 0.32,
      lat: 0.55,
      radius: 0.092,
      moisture: 0.10
    },
    {
      region: 2,
      key: "structure",
      name: "Structure",
      elevationTier: "low-plateau",
      relativeElevation: 0.22,
      terrainRole: "stable foundation plateau and broad settlement table",
      lon: 0.42,
      lat: 0.47,
      radius: 0.094,
      moisture: 0.04
    },
    {
      region: 3,
      key: "balance",
      name: "Balance",
      elevationTier: "basin-transition",
      relativeElevation: 0.32,
      terrainRole: "wet dry transition basin where systems meet",
      lon: 0.52,
      lat: 0.50,
      radius: 0.096,
      moisture: 0.12
    },
    {
      region: 4,
      key: "stability",
      name: "Stability",
      elevationTier: "temperate-upland",
      relativeElevation: 0.42,
      terrainRole: "steady upland belt with repeatable climate",
      lon: 0.65,
      lat: 0.45,
      radius: 0.098,
      moisture: 0.10
    },
    {
      region: 5,
      key: "peace",
      name: "Peace",
      elevationTier: "protected-high-basin",
      relativeElevation: 0.52,
      terrainRole: "sheltered green basin above lower belts",
      lon: 0.38,
      lat: 0.60,
      radius: 0.100,
      moisture: 0.22
    },
    {
      region: 6,
      key: "joy",
      name: "Joy",
      elevationTier: "bright-island-highlands",
      relativeElevation: 0.62,
      terrainRole: "reef islands, warm high islands, lively archipelago",
      lon: 0.60,
      lat: 0.68,
      radius: 0.102,
      moisture: 0.25
    },
    {
      region: 7,
      key: "dignity",
      name: "Dignity",
      elevationTier: "mineral-crownland",
      relativeElevation: 0.72,
      terrainRole: "weathered mineral ridges and old exposed value",
      lon: 0.55,
      lat: 0.30,
      radius: 0.104,
      moisture: -0.06
    },
    {
      region: 8,
      key: "free-will",
      name: "Free Will",
      elevationTier: "frontier-ridge-belt",
      relativeElevation: 0.82,
      terrainRole: "open high frontier, difficult traversal, mixed climate edge",
      lon: 0.22,
      lat: 0.46,
      radius: 0.106,
      moisture: 0.02
    },
    {
      region: 9,
      key: "love",
      name: "Love",
      elevationTier: "highest-convergence-summit",
      relativeElevation: 0.92,
      terrainRole: "highest convergence heartland where waters, ridges, routes, and climates meet",
      lon: 0.48,
      lat: 0.42,
      radius: 0.112,
      moisture: 0.16
    }
  ]);

  const MAJOR_LAND_SEGMENTS = Object.freeze([
    {
      id: "dominant-mainland",
      type: "land",
      role: "dominant_current_position_body",
      lon: 0.44,
      lat: 0.50,
      radiusX: 0.135,
      radiusY: 0.170,
      height: 0.54,
      moisture: 0.08,
      climate: "temperate-convergence",
      priority: 1
    },
    {
      id: "western-weathered-body",
      type: "land",
      role: "secondary_weathered_continent",
      lon: 0.18,
      lat: 0.48,
      radiusX: 0.108,
      radiusY: 0.150,
      height: 0.44,
      moisture: 0.02,
      climate: "weathered-western-basin",
      priority: 2
    },
    {
      id: "eastern-shelf-body",
      type: "land",
      role: "temperate_shelf_continent",
      lon: 0.70,
      lat: 0.51,
      radiusX: 0.112,
      radiusY: 0.142,
      height: 0.42,
      moisture: 0.14,
      climate: "temperate-eastern-shelf",
      priority: 3
    },
    {
      id: "southern-archipelago-body",
      type: "archipelago",
      role: "major_broken_island_chain",
      lon: 0.59,
      lat: 0.68,
      radiusX: 0.080,
      radiusY: 0.060,
      height: 0.31,
      moisture: 0.22,
      islandCount: 13,
      climate: "warm-reef-archipelago",
      priority: 4
    },
    {
      id: "north-polar-land",
      type: "land",
      role: "north_pole_land_body",
      lon: 0.50,
      lat: 0.078,
      radiusX: 0.185,
      radiusY: 0.078,
      height: 0.35,
      moisture: -0.04,
      climate: "north-polar-mineral-land",
      polar: "north",
      priority: 5
    }
  ]);

  const MISC_TERRITORY_CLUSTERS = Object.freeze([
    { id: "equatorial-west-islands", lon: 0.09, lat: 0.53, count: 11, stepLon: 0.025, stepLat: 0.006, radius: 0.017, height: 0.22, moisture: 0.17, regionBias: 1 },
    { id: "balance-chain", lon: 0.36, lat: 0.49, count: 10, stepLon: 0.020, stepLat: -0.008, radius: 0.018, height: 0.24, moisture: 0.13, regionBias: 3 },
    { id: "joy-reef-chain", lon: 0.56, lat: 0.67, count: 16, stepLon: 0.018, stepLat: -0.010, radius: 0.016, height: 0.21, moisture: 0.24, regionBias: 6 },
    { id: "eastern-temperate-islands", lon: 0.77, lat: 0.47, count: 12, stepLon: -0.017, stepLat: 0.011, radius: 0.017, height: 0.22, moisture: 0.15, regionBias: 4 },
    { id: "frontier-fracture-islands", lon: 0.23, lat: 0.36, count: 9, stepLon: 0.021, stepLat: -0.013, radius: 0.015, height: 0.27, moisture: 0.03, regionBias: 8 },
    { id: "northern-shelf-territories", lon: 0.50, lat: 0.19, count: 14, stepLon: 0.020, stepLat: 0.004, radius: 0.016, height: 0.25, moisture: 0.01, regionBias: 7 },
    { id: "love-convergence-islands", lon: 0.48, lat: 0.39, count: 8, stepLon: 0.016, stepLat: 0.014, radius: 0.019, height: 0.29, moisture: 0.18, regionBias: 9 },
    { id: "southern-clean-ocean-keys", lon: 0.40, lat: 0.72, count: 10, stepLon: 0.026, stepLat: 0.002, radius: 0.014, height: 0.18, moisture: 0.22, regionBias: 6 }
  ]);

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function wrapDistance(a, b) {
    const direct = Math.abs(a - b);
    return Math.min(direct, 1 - direct);
  }

  function hash2(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return s - Math.floor(s);
  }

  function valueNoise(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    const a = hash2(xi, yi);
    const b = hash2(xi + 1, yi);
    const c = hash2(xi, yi + 1);
    const d = hash2(xi + 1, yi + 1);

    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);

    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  }

  function fbm(x, y, octaves) {
    let total = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let normalization = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x * frequency, y * frequency) * amplitude;
      normalization += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return total / normalization;
  }

  function ellipseInfluence(x, y, segment, noiseScale) {
    const dx = wrapDistance(x, segment.lon) / segment.radiusX;
    const dy = Math.abs(y - segment.lat) / segment.radiusY;
    const d = Math.sqrt(dx * dx + dy * dy);

    const n =
      (fbm(x * noiseScale + segment.priority * 11, y * noiseScale + segment.priority * 17, 4) - 0.5) *
      0.24;

    return smoothstep(1.13, 0.33, d + n);
  }

  function islandInfluence(x, y, cluster) {
    let height = 0;
    let moisture = 0;
    let strength = 0;
    let regionBias = 0;

    for (let i = 0; i < cluster.count; i += 1) {
      const lon = wrap01(cluster.lon + (i - cluster.count / 2) * cluster.stepLon + Math.sin(i * 1.71) * 0.010);
      const lat = clamp(cluster.lat + Math.cos(i * 1.23) * 0.030 + (i % 3 - 1) * cluster.stepLat, 0.08, 0.86);
      const radiusX = cluster.radius * (0.78 + (i % 5) * 0.055);
      const radiusY = cluster.radius * (0.62 + (i % 4) * 0.050);

      const influence = ellipseInfluence(
        x,
        y,
        {
          lon,
          lat,
          radiusX,
          radiusY,
          priority: cluster.regionBias + i,
          height: cluster.height,
          moisture: cluster.moisture
        },
        92
      );

      if (influence > 0) {
        const shaped = influence * influence * (3 - 2 * influence);
        height += cluster.height * shaped;
        moisture += cluster.moisture * shaped;
        strength = Math.max(strength, shaped);
        regionBias = cluster.regionBias;
      }
    }

    return { height, moisture, strength, regionBias };
  }

  function landDistribution(x, y) {
    let elevation = -0.47;
    let moisture = 0;
    let dominantSegment = "deep-ocean";
    let dominantStrength = 0;
    let regionBias = 0;

    for (let i = 0; i < MAJOR_LAND_SEGMENTS.length; i += 1) {
      const segment = MAJOR_LAND_SEGMENTS[i];
      let influence = 0;

      if (segment.type === "archipelago") {
        const chain = islandInfluence(x, y, {
          id: segment.id,
          lon: segment.lon,
          lat: segment.lat,
          count: segment.islandCount,
          stepLon: 0.025,
          stepLat: -0.010,
          radius: 0.020,
          height: segment.height,
          moisture: segment.moisture,
          regionBias: 6
        });

        influence = chain.strength;
        elevation += chain.height;
        moisture += chain.moisture;
        regionBias = influence > dominantStrength ? chain.regionBias : regionBias;
      } else {
        influence = ellipseInfluence(x, y, segment, 42);
        elevation += segment.height * influence;
        moisture += segment.moisture * influence;
      }

      if (influence > dominantStrength) {
        dominantStrength = influence;
        dominantSegment = segment.id;
        if (segment.id === "north-polar-land") regionBias = 7;
        if (segment.id === "dominant-mainland") regionBias = 2;
        if (segment.id === "western-weathered-body") regionBias = 8;
        if (segment.id === "eastern-shelf-body") regionBias = 4;
      }
    }

    for (let c = 0; c < MISC_TERRITORY_CLUSTERS.length; c += 1) {
      const cluster = MISC_TERRITORY_CLUSTERS[c];
      const islands = islandInfluence(x, y, cluster);

      elevation += islands.height;
      moisture += islands.moisture;

      if (islands.strength > dominantStrength) {
        dominantStrength = islands.strength;
        dominantSegment = cluster.id;
        regionBias = islands.regionBias;
      }
    }

    return {
      elevation,
      moisture,
      dominantSegment,
      dominantStrength,
      regionBias
    };
  }

  function regionInfluence(x, y, landStrength, currentElevation) {
    let elevationBoost = 0;
    let moisture = 0;
    let regionKey = "open-ocean";
    let regionName = "Open Ocean";
    let regionNumber = 0;
    let regionStrength = 0;
    let relativeElevation = 0;

    for (let i = 0; i < REGION_TIERS.length; i += 1) {
      const region = REGION_TIERS[i];
      const dx = wrapDistance(x, region.lon) / region.radius;
      const dy = Math.abs(y - region.lat) / region.radius;
      const d = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - d);

      if (influence > 0) {
        const shaped = influence * influence * (3 - 2 * influence);
        const landLimited = shaped * clamp(landStrength * 1.45, 0, 1);
        const targetElevation = region.relativeElevation * 0.62;
        const lift = Math.max(0, targetElevation - Math.max(0, currentElevation));

        elevationBoost += lift * landLimited;
        moisture += region.moisture * landLimited;

        if (landLimited > regionStrength) {
          regionStrength = landLimited;
          regionKey = region.key;
          regionName = region.name;
          regionNumber = region.region;
          relativeElevation = region.relativeElevation;
        }
      }
    }

    return {
      elevationBoost,
      moisture,
      regionKey,
      regionName,
      regionNumber,
      regionStrength,
      relativeElevation
    };
  }

  function ridgeField(x, y, landStrength) {
    const fold =
      1 -
      Math.abs(
        Math.sin((x * 2.20 - y * 1.32 + fbm(x * 9 + 4, y * 9 + 7, 4) * 0.13) * Math.PI)
      );

    const ancient =
      1 -
      Math.abs(
        Math.sin((x * 1.56 + y * 0.86 + fbm(x * 11 + 8, y * 10 + 3, 4) * 0.10) * Math.PI)
      );

    return Math.pow(Math.max(fold, ancient * 0.78), 4) * clamp(landStrength * 1.3, 0, 1);
  }

  function cleanClimate(x, y, surfaceBase) {
    const latFromEquator = Math.abs(y - 0.5) * 2;
    const equatorialWarmth = 1 - smoothstep(0.08, 0.55, Math.abs(y - 0.5));
    const temperateBelt = smoothstep(0.22, 0.48, latFromEquator) * (1 - smoothstep(0.58, 0.90, latFromEquator));
    const polarCold = smoothstep(0.70, 0.98, latFromEquator);
    const oceanicFlow = fbm(x * 4.0 + 9, y * 5.0 + 3, 4);
    const wind = fbm(x * 8.0 + 21, y * 3.0 + 11, 4);

    const dryPressure =
      smoothstep(0.18, 0.46, latFromEquator) *
      (1 - smoothstep(0.56, 0.78, latFromEquator)) *
      (1 - surfaceBase.moisture * 0.5);

    return {
      equatorialWarmth,
      temperateBelt,
      polarCold,
      oceanicFlow,
      wind,
      dryPressure,
      cleanAtmosphere: true,
      pollutedAtmosphere: false,
      toxicGas: false,
      industrialWaste: false
    };
  }

  function calculateSurface(xInput, yInput) {
    const x = wrap01(Number(xInput) || 0);
    const y = clamp(Number(yInput) || 0, 0, 1);

    const latFromEquator = Math.abs(y - 0.5) * 2;
    const northPolar = smoothstep(0.78, 0.98, 1 - y);
    const southPolar = smoothstep(0.82, 0.98, y);
    const equatorial = 1 - smoothstep(0.08, 0.52, Math.abs(y - 0.5));

    const distribution = landDistribution(x, y);
    const landStrength = clamp(distribution.dominantStrength, 0, 1);

    const macro = fbm(x * 3.5, y * 2.8, 5);
    const erosion = fbm(x * 22 + 19, y * 18 + 7, 5);
    const micro = fbm(x * 74 + 2, y * 58 + 11, 3);
    const ridges = ridgeField(x, y, landStrength);

    let elevation =
      distribution.elevation +
      ridges * 0.14 +
      (macro - 0.5) * 0.13 * clamp(landStrength + 0.18, 0, 1) +
      (erosion - 0.5) * 0.09 * clamp(landStrength + 0.2, 0, 1) +
      (micro - 0.5) * 0.025 * clamp(landStrength + 0.1, 0, 1);

    const region = regionInfluence(x, y, landStrength, elevation);
    elevation += region.elevationBoost;

    const southIce = southPolar > 0.32;

    if (southIce) {
      elevation = Math.min(elevation, -0.09);
    }

    elevation = clamp(elevation, -0.96, 0.92);

    const isLand = elevation >= 0 && !southIce;
    const isWater = !isLand && !southIce;
    const isIce = southIce || (!isWater && northPolar > 0.70 && elevation > -0.05);

    const climate = cleanClimate(x, y, {
      moisture: distribution.moisture + region.moisture
    });

    const depth = isWater ? clamp(Math.abs(elevation), 0, 1) : 0;
    const coast = isLand ? 1 - clamp(Math.abs(elevation) / 0.16, 0, 1) : 0;
    const shelf = isWater && elevation > -0.22 ? 1 - Math.abs(elevation + 0.09) / 0.13 : 0;
    const reef =
      shelf *
      equatorial *
      smoothstep(0.48, 0.78, fbm(x * 44 + 5, y * 44 + 17, 3));

    const mountainCold = isLand ? smoothstep(0.26, 0.62, elevation) : 0;

    const moisture = clamp(
      0.45 +
        distribution.moisture +
        region.moisture +
        climate.equatorialWarmth * 0.18 +
        climate.oceanicFlow * 0.12 -
        climate.dryPressure * 0.22 +
        coast * 0.12 -
        mountainCold * 0.08 +
        (climate.wind - 0.5) * 0.12,
      0,
      1
    );

    let biome = "deep-ocean";

    if (isIce && southIce) biome = "south-polar-ice-only";
    else if (isIce) biome = "north-polar-land-ice";
    else if (isWater && shelf > 0.25) biome = reef > 0.35 ? "reef-shelf" : "shallow-shelf";
    else if (isWater) biome = depth > 0.48 ? "deep-ocean" : "open-ocean";
    else if (isLand && elevation > 0.58) biome = "highest-convergence-summit";
    else if (isLand && elevation > 0.46) biome = "high-frontier-ridge";
    else if (isLand && elevation > 0.36) biome = "mineral-crownland";
    else if (isLand && moisture < 0.27) biome = "ancient-dry-interior";
    else if (isLand && moisture > 0.64 && equatorial > 0.35) biome = "humid-green-belt";
    else if (isLand && moisture > 0.50) biome = "temperate-green-coast";
    else if (isLand) biome = "olive-weathered-basin";

    return {
      x,
      y,
      elevation,
      isLand,
      isWater,
      isIce,
      southIce,
      depth,
      shelf: clamp(shelf, 0, 1),
      reef: clamp(reef, 0, 1),
      coast: clamp(coast, 0, 1),
      ridges: clamp(ridges, 0, 1),
      northPolar: clamp(northPolar, 0, 1),
      southPolar: clamp(southPolar, 0, 1),
      moisture,
      biome,
      segment: distribution.dominantSegment,
      segmentStrength: distribution.dominantStrength,
      regionKey: region.regionKey,
      regionName: region.regionName,
      regionNumber: region.regionNumber,
      regionStrength: region.regionStrength,
      regionRelativeElevation: region.relativeElevation,
      climate,
      generation: BODY.generation,
      parentConsumption: "terrain+hydration+climate",
      ecologyPrep: true
    };
  }

  function colorToBytes(hex) {
    const normalized = String(hex || "#000000").replace("#", "");
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16)
    };
  }

  function mixColor(a, b, amount) {
    const colorA = typeof a === "string" ? colorToBytes(a) : a;
    const colorB = typeof b === "string" ? colorToBytes(b) : b;
    const t = clamp(amount, 0, 1);

    return {
      r: Math.round(lerp(colorA.r, colorB.r, t)),
      g: Math.round(lerp(colorA.g, colorB.g, t)),
      b: Math.round(lerp(colorA.b, colorB.b, t))
    };
  }

  function surfaceColor(surface) {
    if (surface.isIce) {
      if (surface.southIce) {
        return mixColor("#e4f2f8", "#ffffff", 0.52 + surface.southPolar * 0.26);
      }

      return mixColor("#d2e4ea", "#f7fbff", 0.32 + surface.northPolar * 0.24);
    }

    if (surface.isWater) {
      const deep = colorToBytes("#061b4d");
      const mid = colorToBytes("#145c94");
      const shelf = colorToBytes("#2bb9c2");
      const reef = colorToBytes("#72d6c3");

      let color = mixColor(mid, deep, clamp(surface.depth * 1.18, 0, 1));
      color = mixColor(color, shelf, surface.shelf * 0.72);
      color = mixColor(color, reef, surface.reef * 0.66);

      return color;
    }

    const lowOrigin = colorToBytes("#9c9461");
    const plateau = colorToBytes("#8f8b57");
    const green = colorToBytes("#3f8c58");
    const humid = colorToBytes("#2d7d4e");
    const dry = colorToBytes("#b8894f");
    const crown = colorToBytes("#a89171");
    const ridge = colorToBytes("#817363");
    const summit = colorToBytes("#c8b384");

    let color;

    if (surface.biome === "ancient-dry-interior") color = dry;
    else if (surface.biome === "humid-green-belt") color = humid;
    else if (surface.biome === "temperate-green-coast") color = green;
    else if (surface.biome === "mineral-crownland") color = crown;
    else if (surface.biome === "high-frontier-ridge") color = ridge;
    else if (surface.biome === "highest-convergence-summit") color = summit;
    else color = surface.regionNumber <= 2 ? lowOrigin : plateau;

    color = mixColor(color, crown, surface.ridges * 0.20);
    color = mixColor(color, summit, Math.max(0, surface.regionRelativeElevation - 0.62) * 0.44);

    if (surface.coast > 0.35) {
      color = mixColor(color, "#d1b878", surface.coast * 0.18);
    }

    if (surface.regionStrength > 0.35) {
      color = mixColor(color, "#c2a163", surface.regionStrength * surface.regionRelativeElevation * 0.16);
    }

    return color;
  }

  function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.body = BODY.id;
    canvas.dataset.legacyBody = BODY.legacyId;
    canvas.dataset.label = BODY.label;
    canvas.dataset.version = VERSION;
    canvas.dataset.generation = BODY.generation;
    canvas.dataset.landBodies = String(CONTRACT.landBodies);
    canvas.dataset.visibleSegments = String(CONTRACT.visibleSegments);
    canvas.dataset.miscellaneousTerritories = CONTRACT.miscellaneousTerritories;
    canvas.dataset.islandDensity = CONTRACT.islandDensity;
    canvas.dataset.southPole = "ice-only";
    canvas.dataset.northPole = "land-body";
    canvas.dataset.regionElevationLaw = "active";
    canvas.dataset.healthyClimate = "active";
    canvas.dataset.toxicIndustrialHistory = "false";
    canvas.dataset.visualPass = CONTRACT.visualPass;
    return canvas;
  }

  function buildTexture(options) {
    const config = options || {};
    const width = Math.max(256, Math.min(4096, Number(config.width) || 1024));
    const height = Math.max(128, Math.min(2048, Number(config.height) || 512));

    const canvas =
      config.canvas && typeof config.canvas.getContext === "function"
        ? config.canvas
        : createCanvas(width, height);

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { willReadFrequently: false });
    const image = context.createImageData(width, height);
    const data = image.data;

    for (let py = 0; py < height; py += 1) {
      const y = py / (height - 1);

      for (let px = 0; px < width; px += 1) {
        const x = px / width;
        const surface = calculateSurface(x, y);
        const color = surfaceColor(surface);

        const cleanAirLight =
          0.89 +
          surface.ridges * 0.08 +
          surface.coast * 0.04 +
          surface.reef * 0.06 -
          surface.depth * 0.035 +
          (fbm(x * 96 + 41, y * 96 + 83, 2) - 0.5) * 0.052;

        const index = (py * width + px) * 4;
        data[index] = clamp(Math.round(color.r * cleanAirLight), 0, 255);
        data[index + 1] = clamp(Math.round(color.g * cleanAirLight), 0, 255);
        data[index + 2] = clamp(Math.round(color.b * cleanAirLight), 0, 255);
        data[index + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);

    canvas.dataset.textureStatus = "AUDRALIA_G2_HEALTHY_CLIMATE_ISLAND_ELEVATION_REGION_READY";
    canvas.dataset.landDistribution = "five-land-bodies-plus-many-islands-plus-south-pole-ice";
    canvas.dataset.regionElevationLaw = "nine-regions-ascending-elevation";
    canvas.dataset.cleanClimate = "healthy-earthlike-no-industrial-poisoning";
    canvas.dataset.staticPictureReplacement = "false";
    canvas.dataset.imageGeneration = "false";

    if (config.returnObject === true) {
      return {
        canvas,
        width,
        height,
        body: BODY.id,
        legacyId: BODY.legacyId,
        label: BODY.label,
        version: VERSION,
        generation: BODY.generation,
        majorLandSegments: MAJOR_LAND_SEGMENTS,
        miscellaneousTerritories: MISC_TERRITORY_CLUSTERS,
        regionTiers: REGION_TIERS,
        status: getStatus()
      };
    }

    return canvas;
  }

  function normalizeSampleArgs(input, y) {
    if (typeof input === "object" && input !== null) {
      if (Number.isFinite(input.lon) || Number.isFinite(input.lat)) {
        return {
          x: wrap01((Number(input.lon) || 0) / 360 + 0.5),
          y: clamp(0.5 - (Number(input.lat) || 0) / 180, 0, 1)
        };
      }

      return {
        x: wrap01(Number(input.x) || 0),
        y: clamp(Number(input.y) || 0, 0, 1)
      };
    }

    return {
      x: wrap01(Number(input) || 0),
      y: clamp(Number(y) || 0, 0, 1)
    };
  }

  function sampleSurface(input, y) {
    const point = normalizeSampleArgs(input, y);
    return calculateSurface(point.x, point.y);
  }

  function drawWrappedStrip(ctx, texture, phase, sy, sh, dx, dy, dw, dh) {
    if (!texture || !texture.width || !texture.height || dw <= 0 || dh <= 0) return;

    const sourceWidth = texture.width;
    const sourceHeight = texture.height;
    const start = wrap01(phase) * sourceWidth;
    const safeSy = clamp(sy, 0, sourceHeight - 1);
    const safeSh = clamp(sh, 1, sourceHeight - safeSy);

    const firstSourceWidth = sourceWidth - start;
    const firstDestWidth = dw * (firstSourceWidth / sourceWidth);
    const secondDestWidth = dw - firstDestWidth;

    ctx.drawImage(texture, start, safeSy, firstSourceWidth, safeSh, dx, dy, firstDestWidth, dh);

    if (secondDestWidth > 0.5) {
      ctx.drawImage(texture, 0, safeSy, start, safeSh, dx + firstDestWidth, dy, secondDestWidth, dh);
    }
  }

  function drawSphere(ctx, texture, phase) {
    const size = ctx.canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.405;
    const stripHeight = Math.max(1, Math.floor(size / 420));
    const sourceHeight = texture.height || 512;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    for (let y = -radius; y <= radius; y += stripHeight) {
      const yMid = y + stripHeight / 2;
      const normalizedY = yMid / radius;
      const chord = Math.sqrt(Math.max(0, 1 - normalizedY * normalizedY));
      const destWidth = radius * 2 * chord;
      const destX = cx - destWidth / 2;
      const destY = cy + y;
      const v = clamp(0.5 + normalizedY * 0.5, 0, 1);
      const sy = Math.floor(v * (sourceHeight - 1));
      const sh = Math.max(1, Math.ceil((stripHeight / (radius * 2)) * sourceHeight * 1.9));

      drawWrappedStrip(ctx, texture, phase, sy, sh, destX, destY, destWidth, stripHeight + 1);
    }

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const light = ctx.createRadialGradient(
      cx - radius * 0.36,
      cy - radius * 0.34,
      radius * 0.03,
      cx,
      cy,
      radius * 1.16
    );

    light.addColorStop(0, "rgba(255,255,255,0.20)");
    light.addColorStop(0.34, "rgba(255,255,255,0.06)");
    light.addColorStop(0.72, "rgba(0,0,0,0.10)");
    light.addColorStop(1, "rgba(0,0,0,0.42)");

    ctx.fillStyle = light;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const atmosphere = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius);
    atmosphere.addColorStop(0, "rgba(0,0,0,0)");
    atmosphere.addColorStop(0.82, "rgba(10,25,44,0.08)");
    atmosphere.addColorStop(1, "rgba(80,140,190,0.22)");

    ctx.fillStyle = atmosphere;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(176, 218, 255, 0.28)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();
    ctx.restore();
  }

  function createReceiptNode(status) {
    const receipt = document.createElement("div");
    receipt.hidden = true;
    receipt.setAttribute("aria-hidden", "true");
    receipt.className = "audralia-healthy-climate-elevation-region-receipt";
    receipt.dataset.body = BODY.id;
    receipt.dataset.legacyBody = BODY.legacyId;
    receipt.dataset.label = BODY.label;
    receipt.dataset.version = VERSION;
    receipt.dataset.generation = BODY.generation;
    receipt.dataset.landBodies = String(CONTRACT.landBodies);
    receipt.dataset.visibleSegments = String(CONTRACT.visibleSegments);
    receipt.dataset.miscellaneousTerritories = CONTRACT.miscellaneousTerritories;
    receipt.dataset.islandDensity = CONTRACT.islandDensity;
    receipt.dataset.regionElevationLaw = "active";
    receipt.dataset.healthyClimate = "active";
    receipt.dataset.toxicIndustrialHistory = "false";
    receipt.dataset.visualPass = CONTRACT.visualPass;
    receipt.textContent = [
      "AUDRALIA_HEALTHY_CLIMATE=ACTIVE",
      "ISLAND_DENSITY=HIGH",
      "MISC_TERRITORIES=INCREASED",
      "NINE_REGIONS=ELEVATION_ORDERED",
      "SOUTH_POLE=ICE_ONLY",
      "G3_ECOLOGY=PREPARED_NOT_CLAIMED",
      "VISUAL_PASS=HELD"
    ].join(" · ");

    if (status && status.mountId) {
      receipt.dataset.mountId = status.mountId;
    }

    return receipt;
  }

  function renderSurface(mount, options) {
    const config = options || {};
    const target =
      typeof mount === "string"
        ? document.querySelector(mount)
        : mount && mount.nodeType === 1
          ? mount
          : null;

    const texture = buildTexture({
      width: Number(config.textureWidth) || 1024,
      height: Number(config.textureHeight) || 512
    });

    const size = Math.max(320, Math.min(1200, Number(config.size) || 720));
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d", { alpha: true });

    canvas.className = [
      "audralia-world-body-canvas",
      "audralia-g2-parent-consumed",
      "audralia-healthy-climate-body",
      "audralia-many-islands",
      "audralia-elevation-regions",
      "audralia-g3-ecology-prep"
    ].join(" ");

    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Audralia Generation 2 healthy climate world body with many islands and nine elevation ordered regions"
    );

    canvas.style.width = "100%";
    canvas.style.maxWidth = config.maxWidth || "720px";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.display = "block";
    canvas.style.borderRadius = "50%";
    canvas.style.objectFit = "cover";
    canvas.style.background = "transparent";

    drawSphere(ctx, texture, Number(config.phase) || 0.18);

    const status = getStatus();
    status.mountId = target && target.id ? target.id : "";

    if (target) {
      target.replaceChildren();

      target.dataset.body = BODY.id;
      target.dataset.legacyBody = BODY.legacyId;
      target.dataset.label = BODY.label;
      target.dataset.version = VERSION;
      target.dataset.generation = BODY.generation;
      target.dataset.landBodies = String(CONTRACT.landBodies);
      target.dataset.visibleSegments = String(CONTRACT.visibleSegments);
      target.dataset.miscellaneousTerritories = CONTRACT.miscellaneousTerritories;
      target.dataset.islandDensity = CONTRACT.islandDensity;
      target.dataset.southPole = "ice-only";
      target.dataset.northPole = "land-body";
      target.dataset.regionElevationLaw = "active";
      target.dataset.healthyClimate = "active";
      target.dataset.toxicIndustrialHistory = "false";
      target.dataset.parentConsumption = "terrain-hydration-climate";
      target.dataset.g3EcologyPrep = "true";
      target.dataset.g3Claimed = "false";
      target.dataset.visualPass = CONTRACT.visualPass;

      target.appendChild(canvas);

      if (config.receipt !== false) {
        target.appendChild(createReceiptNode(status));
      }
    }

    return canvas;
  }

  function createProfile(overrides) {
    return Object.assign(
      {
        id: BODY.id,
        legacyId: BODY.legacyId,
        label: BODY.label,
        publicLabel: BODY.publicLabel,
        classification: BODY.classification,
        parentAuthority: BODY.parentAuthority,
        version: VERSION,
        generation: BODY.generation,
        generationClaim: BODY.generationClaim,
        generation3Prepared: true,
        generation3Claimed: false,
        generation4Claimed: false,
        landBodies: CONTRACT.landBodies,
        visibleSegments: CONTRACT.visibleSegments,
        miscellaneousTerritories: CONTRACT.miscellaneousTerritories,
        islandDensity: CONTRACT.islandDensity,
        enoughLandForNineRegions: true,
        climateLaw: {
          earthLikeClimate: true,
          healthyBirthlikeClimate: true,
          fourTimesEarthAge: true,
          toxicIndustrialHistory: false,
          toxicGasPoisoning: false,
          industrialWastePoisoning: false,
          pollutedAtmosphere: false
        },
        regionElevationLaw: REGION_TIERS,
        majorLandSegments: MAJOR_LAND_SEGMENTS,
        miscellaneousTerritoryClusters: MISC_TERRITORY_CLUSTERS,
        activeDownstreamChildren: ["terrain", "hydration", "climate"],
        consumedChildren: ["terrain", "hydration", "climate"],
        preparedChildren: ["ecology"],
        futureChildren: ["fauna"],
        children: CHILDREN,
        contract: CONTRACT,
        api: {
          createProfile: true,
          buildTexture: true,
          sampleSurface: true,
          renderSurface: true,
          getStatus: true,
          registerExtension: true
        }
      },
      overrides || {}
    );
  }

  function getStatus() {
    return {
      version: VERSION,
      body: BODY.id,
      legacyId: BODY.legacyId,
      label: BODY.label,
      parentAuthority: BODY.parentAuthority,
      generation: BODY.generation,
      generationClaim: BODY.generationClaim,
      g1TerrainFoundation: "PRESERVED",
      g2ParentConsumption: "ACTIVE",
      g2HydrationConsumed: true,
      g2ClimateConsumed: true,
      g3EcologyPrepared: true,
      g3Claimed: false,
      g4FaunaBuilt: false,
      children: CHILDREN,
      landDistribution: "FIVE_MAJOR_LAND_BODIES_PLUS_MANY_ISLANDS_AND_MISC_TERRITORIES",
      visibleSegments: CONTRACT.visibleSegments,
      landBodies: CONTRACT.landBodies,
      miscellaneousTerritories: CONTRACT.miscellaneousTerritories,
      islandDensity: CONTRACT.islandDensity,
      enoughLandForNineRegions: true,
      northPole: "LAND_BODY",
      southPole: "ICE_ONLY",
      regionElevationLaw: "NINE_REGIONS_ASCEND_BY_ELEVATION_STATUS",
      regionTiers: REGION_TIERS.map(function (region) {
        return {
          region: region.region,
          key: region.key,
          name: region.name,
          relativeElevation: region.relativeElevation,
          elevationTier: region.elevationTier
        };
      }),
      climate: {
        earthLike: true,
        healthyBirthlike: true,
        cleanAtmosphere: true,
        fourTimesEarthAge: true,
        toxicIndustrialHistory: false,
        toxicGasPoisoning: false,
        industrialWastePoisoning: false,
        pollutedAtmosphere: false
      },
      seamSafeTerrainGrammar: true,
      noCrossSeamContinentChord: true,
      terrainHydrationClimateParentConsumed: true,
      activeDownstreamChildren: ["terrain", "hydration", "climate"],
      downstreamChildrenActive: "terrain+hydration+climate",
      visualPass: CONTRACT.visualPass,
      imageGeneration: CONTRACT.imageGeneration,
      staticPictureReplacement: CONTRACT.staticPictureReplacement,
      protectedNonJurisdiction: [
        "Earth",
        "Showroom selector",
        "Showroom CSS",
        "Gauges",
        "Products",
        "Sun",
        "Moon",
        "global files"
      ],
      returnReceipt:
        "AUDRALIA_HEALTHY_CLIMATE_ISLAND_DENSITY_AND_ELEVATION_REGION_LAW_ACTIVE"
    };
  }

  function registerExtension(target) {
    const api = window.DGBAudraliaPlanetRender;
    const profile = createProfile();

    if (!target) return api;
    if (target === api) return api;

    if (typeof target.registerPlanet === "function") {
      target.registerPlanet(profile, api);
    }

    if (typeof target.registerRenderer === "function") {
      target.registerRenderer(BODY.id, api);
      target.registerRenderer(BODY.legacyId, api);
    }

    if (typeof target.registerExtension === "function") {
      target.registerExtension(BODY.id, api);
    }

    if (typeof target.addExtension === "function") {
      target.addExtension(BODY.id, api);
    }

    if (target.extensions && typeof target.extensions === "object") {
      target.extensions[BODY.id] = api;
      target.extensions[BODY.legacyId] = api;
    }

    if (target.planets && typeof target.planets === "object") {
      target.planets[BODY.id] = profile;
      target.planets[BODY.legacyId] = profile;
    }

    return api;
  }

  function autoRegister() {
    const api = window.DGBAudraliaPlanetRender;

    [
      window.DGBPlanetRegistry,
      window.DGBShowroomPlanetRegistry,
      window.DGBShowroomGlobeInstrument,
      window.DGBAudraliaRegistry,
      window.DGBAudreliaRegistry
    ].forEach(function (registry) {
      if (registry) registerExtension(registry);
    });

    window.dispatchEvent(
      new CustomEvent("dgb:audralia-healthy-climate-island-elevation-ready", {
        detail: {
          body: BODY.id,
          legacyId: BODY.legacyId,
          label: BODY.label,
          version: VERSION,
          generation: BODY.generation,
          landBodies: CONTRACT.landBodies,
          visibleSegments: CONTRACT.visibleSegments,
          miscellaneousTerritories: CONTRACT.miscellaneousTerritories,
          regionElevationLaw: true,
          healthyClimate: true,
          api
        }
      })
    );
  }

  function autoMount() {
    const mount =
      document.getElementById("audraliaRenderMount") ||
      document.getElementById("audreliaRenderMount") ||
      document.querySelector("[data-audralia-render-mount]") ||
      document.querySelector("[data-audrelia-render-mount]") ||
      document.querySelector("[data-body='audralia'][data-render-mount]") ||
      document.querySelector("[data-body='audrelia'][data-render-mount]");

    if (!mount) return;

    renderSurface(mount, {
      size: 720,
      receipt: true
    });
  }

  const api = Object.freeze({
    version: VERSION,
    body: BODY,
    children: CHILDREN,
    contract: CONTRACT,
    regionTiers: REGION_TIERS,
    majorLandSegments: MAJOR_LAND_SEGMENTS,
    miscellaneousTerritoryClusters: MISC_TERRITORY_CLUSTERS,
    createProfile,
    buildTexture,
    sampleSurface,
    renderSurface,
    getStatus,
    registerExtension
  });

  window.DGBAudraliaPlanetRender = api;
  window.AudraliaPlanetRender = api;
  window.audraliaPlanetRender = api;

  window.DGBAudreliaPlanetRender = api;
  window.AudreliaPlanetRender = api;
  window.audreliaPlanetRender = api;

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        autoRegister();
        autoMount();
      },
      { once: true }
    );
  } else {
    autoRegister();
    autoMount();
  }
})();
