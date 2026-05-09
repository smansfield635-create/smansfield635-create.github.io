// /assets/hearth/hearth.islands.js
// HEARTH_G3_256_GLOBE_DYNAMIC_LANDFORM_ISLAND_ENGINE_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1
// Purpose:
// - Own detached islands separately from main terrain.
// - Use the 256 globe dynamic as island geometry.
// - Provide 256 island seats around each General Region.
// - Add core rocky landform categories: hills, mountains, cliffs, valleys.
// - Beaches/sand remain excluded for a future beach/coastal engine.
// - Preserve North/South/East/West rocky precedence: North highest, West lowest.
// - Do not mutate main terrain.
// - Do not own hydration, rivers, lakes, weather, climate, clouds, humidity, or atmospheric moisture.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_256_GLOBE_DYNAMIC_LANDFORM_ISLAND_ENGINE_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1";
  const VERSION = "2026-05-09.hearth-g3-256-globe-dynamic-landform-island-engine";
  const RECEIPT = "HEARTH_G3_256_GLOBE_DYNAMIC_LANDFORM_ISLAND_ENGINE_RECEIPT";

  const TAU = Math.PI * 2;
  const RINGS = 16;
  const SPOKES = 16;
  const ISLANDS_PER_GENERAL_REGION = RINGS * SPOKES;
  const LANDFORM_CATEGORIES = Object.freeze(["hill", "mountain", "cliff", "valley"]);

  const DIRECTION_PRECEDENCE = Object.freeze({
    north: { rank: 4, rockyMultiplier: 1.00, heightMultiplier: 1.00 },
    south: { rank: 3, rockyMultiplier: 0.82, heightMultiplier: 0.86 },
    east: { rank: 2, rockyMultiplier: 0.64, heightMultiplier: 0.72 },
    west: { rank: 1, rockyMultiplier: 0.46, heightMultiplier: 0.58 }
  });

  const ISLAND_LAW = Object.freeze({
    geometry: "256-globe-dynamic",
    lattice: "16 rings x 16 spokes",
    islandsPerGeneralRegion: ISLANDS_PER_GENERAL_REGION,
    totalIslandSeats: ISLANDS_PER_GENERAL_REGION * 4,
    ownership: "/assets/hearth/hearth.islands.js",
    terrainOwnership: "excluded-from-main-terrain",
    categories: LANDFORM_CATEGORIES,
    excluded: ["beaches", "sand systems"],
    rule:
      "Detached island bodies are owned by the island engine. Main terrain owns land bodies only. Beaches/sand are deferred."
  });

  const TIC_TAC_TOE_DYNAMIC_PROTOCOL = Object.freeze({
    T1: "One island engine.",
    T2: "Four General Region island fields.",
    T3: "Sixteen rings by sixteen spokes per field.",
    T4: "Two-hundred fifty-six island seats per General Region.",
    T5: "Island categories are hills, mountains, cliffs, and valleys.",
    T6: "North/South/East/West rocky precedence applies.",
    T7: "Beaches and sand remain excluded.",
    T8: "Canvas must consume HEARTH_ISLANDS separately.",
    T9: "Return island receipt without mutating terrain."
  });

  const SYSTEMIC_QUAD_A_ATTACK = Object.freeze({
    authority: "/assets/hearth/hearth.islands.js",
    axis: "256 globe dynamic -> detached island seats -> rocky landform categories",
    artifact:
      "A separate island engine with 256 organic island seats around each General Region, categorized as hills, mountains, cliffs, or valleys.",
    attack:
      "Reject island logic inside terrain, beaches inside islands, sand systems, artificial grid islands, hydration reshaping, new countries, new regions, climate, weather, clouds, humidity, and open-ended island expression."
  });

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => Math.round(lerp(a, b, clamp(t, 0, 1)));

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / ((b - a) || 1e-9), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function dot3(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function cross3(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function norm3(v) {
    const m = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / m, v[1] / m, v[2] / m];
  }

  function dirFromLonLat(lonDeg, latDeg) {
    const lon = (lonDeg * Math.PI) / 180;
    const lat = (latDeg * Math.PI) / 180;
    const cl = Math.cos(lat);
    return [cl * Math.sin(lon), Math.sin(lat), cl * Math.cos(lon)];
  }

  function makeBasis(center) {
    const up = Math.abs(center[1]) > 0.92 ? [1, 0, 0] : [0, 1, 0];
    const east = norm3(cross3(up, center));
    const north = norm3(cross3(center, east));
    return { east, north };
  }

  function hash3(a, b, c) {
    const n = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function angleDelta(a, b) {
    return Math.atan2(Math.sin(a - b), Math.cos(a - b));
  }

  function microIsland(x, y, seed) {
    return clamp(
      0.5 +
        Math.sin(x * 31.0 + y * 17.0 + seed) * 0.18 +
        Math.cos(x * 43.0 - y * 29.0 + seed * 0.71) * 0.13,
      0,
      1
    );
  }

  const REGION_SOURCE = [
    { id: "GR01", name: "Baseward West", centerLonLat: [-104, 20], size: [0.96, 0.66], color: [139, 114, 72], seed: 0.13 },
    { id: "GR02", name: "Rising South", centerLonLat: [-26, -28], size: [0.74, 0.82], color: [154, 124, 80], seed: 0.39 },
    { id: "GR03", name: "Middle Eastward", centerLonLat: [58, 18], size: [1.00, 0.62], color: [133, 125, 82], seed: 0.64 },
    { id: "GR04", name: "Summitward North", centerLonLat: [138, 43], size: [0.66, 0.56], color: [127, 126, 94], seed: 0.86 }
  ];

  const REGIONS = REGION_SOURCE.map((region, index) => {
    const center = dirFromLonLat(region.centerLonLat[0], region.centerLonLat[1]);

    return Object.freeze({
      ...region,
      index,
      center,
      basis: makeBasis(center)
    });
  });

  function localize(v, region) {
    return {
      x: dot3(v, region.basis.east) / region.size[0],
      y: dot3(v, region.basis.north) / region.size[1],
      facing: dot3(v, region.center)
    };
  }

  function directionFromAngle(theta) {
    const values = [
      ["north", Math.abs(angleDelta(theta, Math.PI / 2))],
      ["south", Math.abs(angleDelta(theta, -Math.PI / 2))],
      ["east", Math.abs(angleDelta(theta, 0))],
      ["west", Math.abs(angleDelta(theta, Math.PI))]
    ].sort((a, b) => a[1] - b[1]);

    return values[0][0];
  }

  function seatDefinition(region, ringIndex, spokeIndex) {
    const ring = ((ringIndex % RINGS) + RINGS) % RINGS;
    const spoke = ((spokeIndex % SPOKES) + SPOKES) % SPOKES;
    const seatNumber = ring * SPOKES + spoke + 1;

    const h1 = hash3(region.index + 1, seatNumber + 11, region.seed * 1000 + 1);
    const h2 = hash3(region.index + 1, seatNumber + 23, region.seed * 1000 + 2);
    const h3 = hash3(region.index + 1, seatNumber + 37, region.seed * 1000 + 3);
    const h4 = hash3(region.index + 1, seatNumber + 51, region.seed * 1000 + 4);

    const angle = (spoke / SPOKES) * TAU + (h1 - 0.5) * (TAU / SPOKES) * 0.58;
    const radius = 1.02 + ring * 0.019 + h2 * 0.015;
    const islandRadius = 0.008 + h3 * 0.024;
    const islandStrength = 0.46 + h4 * 0.46;
    const direction = directionFromAngle(angle);
    const precedence = DIRECTION_PRECEDENCE[direction];

    return {
      id: `${region.id}-ISLAND-${String(seatNumber).padStart(3, "0")}`,
      regionId: region.id,
      regionName: region.name,
      seatNumber,
      ring,
      spoke,
      angle,
      radius,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      islandRadius,
      islandStrength,
      direction,
      rockyPrecedenceRank: precedence.rank,
      rockyMultiplier: precedence.rockyMultiplier,
      heightMultiplier: precedence.heightMultiplier
    };
  }

  function nearestRegionLocal(v) {
    let best = null;

    for (const region of REGIONS) {
      const local = localize(v, region);
      const r = Math.hypot(local.x, local.y);
      const score = local.facing - Math.abs(r - 1.16) * 0.22;

      if (!best || score > best.score) {
        best = { region, local, r, score };
      }
    }

    return best;
  }

  function islandLandform(island, strength, distance) {
    const normalizedDistance = clamp(distance / ((island.islandRadius || 0.01) * 2.4), 0, 1);
    const radial = clamp((island.ring + 1) / RINGS, 0, 1);
    const rocky = island.rockyMultiplier;
    const height = island.heightMultiplier;

    const hillStrength = clamp(
      strength * (0.32 + (1 - rocky) * 0.34) +
        (1 - normalizedDistance) * 0.18 +
        (island.direction === "west" ? 0.14 : 0),
      0,
      1
    );

    const mountainStrength = clamp(
      strength * (0.30 + height * 0.50) +
        (island.direction === "north" ? 0.18 : 0) +
        (radial < 0.40 ? 0.06 : 0),
      0,
      1.25
    );

    const cliffStrength = clamp(
      strength * (0.24 + rocky * 0.56) +
        (island.direction === "north" ? 0.14 : 0) +
        (island.direction === "south" ? 0.08 : 0) +
        radial * 0.08,
      0,
      1.25
    );

    const valleyStrength = clamp(
      strength * (0.22 + (1 - height) * 0.34) +
        normalizedDistance * 0.16 +
        (island.direction === "south" ? 0.10 : 0) +
        (island.direction === "west" ? 0.12 : 0),
      0,
      1
    );

    const ranked = [
      { category: "hill", strength: hillStrength, index: 0 },
      { category: "mountain", strength: mountainStrength, index: 1 },
      { category: "cliff", strength: cliffStrength, index: 2 },
      { category: "valley", strength: valleyStrength, index: 3 }
    ].sort((a, b) => b.strength - a.strength);

    return {
      landformCategory: ranked[0].category,
      dominantLandform: ranked[0].category,
      landformSeat: island.seatNumber,
      landformRing: island.ring + 1,
      landformSpoke: island.spoke + 1,
      hillStrength,
      mountainStrength,
      cliffStrength,
      valleyStrength,
      landformGeometry: "256-globe-dynamic",
      landformGeometryTotal: ISLANDS_PER_GENERAL_REGION
    };
  }

  function islandColor(region, island, landform) {
    let [r, g, b] = region.color;

    r = mix(r, 94, island.rockyMultiplier * 0.26);
    g = mix(g, 92, island.rockyMultiplier * 0.24);
    b = mix(b, 84, island.rockyMultiplier * 0.20);

    r = mix(r, 204, island.heightMultiplier * island.strength * 0.20);
    g = mix(g, 192, island.heightMultiplier * island.strength * 0.16);
    b = mix(b, 154, island.heightMultiplier * island.strength * 0.12);

    r = mix(r, 150, landform.hillStrength * 0.08);
    g = mix(g, 138, landform.hillStrength * 0.08);
    b = mix(b, 96, landform.hillStrength * 0.06);

    r = mix(r, 230, landform.mountainStrength * 0.10);
    g = mix(g, 220, landform.mountainStrength * 0.08);
    b = mix(b, 190, landform.mountainStrength * 0.06);

    r = mix(r, 60, landform.cliffStrength * 0.12);
    g = mix(g, 62, landform.cliffStrength * 0.10);
    b = mix(b, 60, landform.cliffStrength * 0.08);

    r = mix(r, 84, landform.valleyStrength * 0.08);
    g = mix(g, 112, landform.valleyStrength * 0.08);
    b = mix(b, 82, landform.valleyStrength * 0.06);

    return [r, g, b];
  }

  function sampleVector(vec) {
    const v = norm3(vec);
    const nearest = nearestRegionLocal(v);

    if (!nearest || nearest.local.facing < 0.12) {
      return inactiveSample();
    }

    const region = nearest.region;
    const local = nearest.local;
    const r = Math.hypot(local.x, local.y);
    const theta = Math.atan2(local.y, local.x);

    if (r < 1.00 || r > 1.36) {
      return inactiveSample(region);
    }

    const ringEstimate = clamp(Math.round((r - 1.02) / 0.019), 0, RINGS - 1);
    const spokeEstimate = clamp(Math.round(((theta < 0 ? theta + TAU : theta) / TAU) * SPOKES), 0, SPOKES - 1);

    let best = null;
    let bestStrength = 0;
    let bestDistance = Infinity;

    for (let dr = -1; dr <= 1; dr += 1) {
      for (let ds = -1; ds <= 1; ds += 1) {
        const island = seatDefinition(region, ringEstimate + dr, spokeEstimate + ds);
        const dx = local.x - island.x;
        const dy = local.y - island.y;
        const d = Math.hypot(dx, dy);
        const organic = 0.78 + microIsland(local.x * 2.4, local.y * 2.4, region.seed * 77 + island.seatNumber) * 0.42;
        const strength = (1 - smoothstep(island.islandRadius * organic, island.islandRadius * 2.55 * organic, d)) * island.islandStrength;

        if (strength > bestStrength) {
          best = island;
          bestStrength = strength;
          bestDistance = d;
        }
      }
    }

    if (!best || bestStrength < 0.18) {
      return inactiveSample(region);
    }

    const landform = islandLandform(best, bestStrength, bestDistance);

    const ridge = clamp(bestStrength * best.rockyMultiplier * 0.88 + landform.mountainStrength * 0.18, 0, 1);
    const upland = clamp(bestStrength * (0.42 + best.heightMultiplier * 0.36) + landform.hillStrength * 0.12, 0, 1);
    const relief = clamp(bestStrength * (0.38 + best.rockyMultiplier * 0.46) + landform.cliffStrength * 0.18, 0, 1);
    const coast = clamp(1 - smoothstep(best.islandRadius * 0.42, best.islandRadius * 1.42, bestDistance), 0, 1);

    return {
      active: true,
      land: true,
      island: true,
      visibleIsland: true,
      detachedFromTerrain: true,
      islandId: best.id,
      islandIndex: best.seatNumber,
      islandSeatNumber: best.seatNumber,
      islandRing: best.ring + 1,
      islandSpoke: best.spoke + 1,
      islandStrength: clamp(bestStrength, 0, 1),
      islandDistance: bestDistance,
      islandCountForRegion: ISLANDS_PER_GENERAL_REGION,
      region: region.id,
      regionName: region.name,
      direction: best.direction,
      rockyPrecedenceRank: best.rockyPrecedenceRank,
      rockyMultiplier: best.rockyMultiplier,
      heightMultiplier: best.heightMultiplier,
      coast,
      shelf: clamp(coast * 0.66, 0, 1),
      waterDepth: 0,
      ridge,
      upland,
      relief,
      lowland: clamp((1 - upland) * 0.32 + landform.valleyStrength * 0.18, 0, 1),
      color: islandColor(region, { ...best, strength: bestStrength }, landform),
      landformSeat: landform.landformSeat,
      landformRing: landform.landformRing,
      landformSpoke: landform.landformSpoke,
      landformCategory: landform.landformCategory,
      dominantLandform: landform.dominantLandform,
      hillStrength: landform.hillStrength,
      mountainStrength: landform.mountainStrength,
      cliffStrength: landform.cliffStrength,
      valleyStrength: landform.valleyStrength,
      beachExcludedFromIslands: true,
      sandExcludedFromIslands: true,
      surfaceScale: "planet",
      geometry: "256-globe-dynamic",
      lattice: "16x16",
      authority: "island-engine-256-landform-category"
    };
  }

  function inactiveSample(region = null) {
    return {
      active: false,
      land: false,
      island: false,
      visibleIsland: false,
      detachedFromTerrain: true,
      islandId: null,
      islandIndex: null,
      islandSeatNumber: null,
      islandRing: null,
      islandSpoke: null,
      islandStrength: 0,
      islandCountForRegion: ISLANDS_PER_GENERAL_REGION,
      region: region ? region.id : null,
      regionName: region ? region.name : null,
      direction: null,
      rockyPrecedenceRank: 0,
      rockyMultiplier: 0,
      heightMultiplier: 0,
      coast: 0,
      shelf: 0,
      waterDepth: 1,
      ridge: 0,
      upland: 0,
      relief: 0,
      lowland: 0,
      color: null,
      landformSeat: null,
      landformRing: null,
      landformSpoke: null,
      landformCategory: null,
      dominantLandform: null,
      hillStrength: 0,
      mountainStrength: 0,
      cliffStrength: 0,
      valleyStrength: 0,
      beachExcludedFromIslands: true,
      sandExcludedFromIslands: true,
      surfaceScale: "planet",
      geometry: "256-globe-dynamic",
      lattice: "16x16",
      authority: "island-engine-256-landform-category"
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      standard: "256-globe-dynamic-landform-island-engine",
      authority: "island-engine-256-landform-category",
      islandLaw: ISLAND_LAW,
      directionPrecedence: DIRECTION_PRECEDENCE,
      landformCategories: LANDFORM_CATEGORIES,
      geometry: "256-globe-dynamic",
      lattice: {
        rings: RINGS,
        spokes: SPOKES,
        islandsPerGeneralRegion: ISLANDS_PER_GENERAL_REGION,
        totalIslandSeats: ISLANDS_PER_GENERAL_REGION * 4
      },
      generalRegions: REGIONS.map((region) => ({
        id: region.id,
        name: region.name,
        islandSeats: ISLANDS_PER_GENERAL_REGION,
        geometry: "16 rings x 16 spokes",
        landformCategories: LANDFORM_CATEGORIES
      })),
      owns: [
        "detached island bodies",
        "256 island seats per General Region",
        "island hill categories",
        "island mountain categories",
        "island cliff categories",
        "island valley categories",
        "island ring/spoke geometry",
        "island organic boundary",
        "island rocky precedence",
        "island relation to nearest General Region"
      ],
      doesNotOwn: [
        "main land body terrain",
        "country assignment",
        "beaches",
        "sand systems",
        "escarpments",
        "plateaus",
        "central mountains",
        "summit peaks",
        "hydration expansion",
        "rivers",
        "lakes",
        "weather",
        "climate",
        "clouds",
        "humidity",
        "atmospheric moisture"
      ],
      ticTacToeDynamicProtocol: TIC_TAC_TOE_DYNAMIC_PROTOCOL,
      systemicQuadAAttack: SYSTEMIC_QUAD_A_ATTACK
    });
  }

  function dispose() {
    if (window.HEARTH_ISLANDS && window.HEARTH_ISLANDS.contract === CONTRACT) {
      try {
        delete window.HEARTH_ISLANDS;
      } catch (_) {
        window.HEARTH_ISLANDS = null;
      }
    }
  }

  window.HEARTH_ISLANDS = Object.freeze({
    receipt,
    contract: CONTRACT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,
    standard: "256-globe-dynamic-landform-island-engine",
    authority: "island-engine-256-landform-category",
    islandLaw: ISLAND_LAW,
    directionPrecedence: DIRECTION_PRECEDENCE,
    landformCategories: LANDFORM_CATEGORIES,
    sampleVector,
    regions: () => REGIONS.slice()
  });

  window.__HEARTH_ISLANDS_DISPOSE__ = dispose;

  document.documentElement.dataset.hearthIslandsLoaded = "true";
  document.documentElement.dataset.hearthIslandsContract = CONTRACT;
  document.documentElement.dataset.hearthIslandsFamilyContract = FAMILY_CONTRACT;
  document.documentElement.dataset.hearthIslandsVersion = VERSION;
  document.documentElement.dataset.hearthIslandsStandard = "256-globe-dynamic-landform-island-engine";
  document.documentElement.dataset.hearthIslandsGeometry = "256-globe-dynamic";
  document.documentElement.dataset.hearthIslandsRings = String(RINGS);
  document.documentElement.dataset.hearthIslandsSpokes = String(SPOKES);
  document.documentElement.dataset.hearthIslandsPerGeneralRegion = String(ISLANDS_PER_GENERAL_REGION);
  document.documentElement.dataset.hearthIslandsTotalSeats = String(ISLANDS_PER_GENERAL_REGION * 4);
  document.documentElement.dataset.hearthIslandsLandformCategories = "hills-mountains-cliffs-valleys";
  document.documentElement.dataset.hearthIslandsBeachesExcluded = "true";
  document.documentElement.dataset.hearthIslandsSandExcluded = "true";
  document.documentElement.dataset.hearthIslandsDetachedFromTerrain = "true";
})();
