// /assets/hearth/hearth.islands.js
// HEARTH_G3_CONSTRAINED_256_ISLAND_CHAIN_ENGINE_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Preserve 256 latent island seats per General Region.
// - Prevent all 256 seats from visibly expressing at once.
// - Convert scattered island debris into intentional island chains.
// - Keep islands detached from parent terrain.
// - Keep islands subordinate to terrain, beaches, and canvas.
// - No GraphicBox. No generated image. No active weather.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_CONSTRAINED_256_ISLAND_CHAIN_ENGINE_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const VERSION = "2026-05-09.hearth-g3-constrained-256-island-chain-engine";
  const RECEIPT = "HEARTH_G3_CONSTRAINED_256_ISLAND_CHAIN_ENGINE_RECEIPT";

  const TAU = Math.PI * 2;
  const RINGS = 16;
  const SPOKES = 16;
  const ISLANDS_PER_GENERAL_REGION = RINGS * SPOKES;

  const MIN_VISIBLE_STRENGTH = 0.42;
  const MAX_VISIBLE_RING = 13;
  const MIN_VISIBLE_RING = 2;

  const LANDFORM_CATEGORIES = Object.freeze(["hill", "mountain", "cliff", "valley"]);

  const DIRECTION_PRECEDENCE = Object.freeze({
    north: { rank: 4, rockyMultiplier: 1.0, heightMultiplier: 1.0 },
    south: { rank: 3, rockyMultiplier: 0.82, heightMultiplier: 0.86 },
    east: { rank: 2, rockyMultiplier: 0.64, heightMultiplier: 0.72 },
    west: { rank: 1, rockyMultiplier: 0.46, heightMultiplier: 0.58 }
  });

  const CHAIN_LAW = Object.freeze({
    geometry: "256-latent-island-seats",
    visibleMode: "constrained-chain-expression",
    seatsPerGeneralRegion: ISLANDS_PER_GENERAL_REGION,
    totalLatentSeats: ISLANDS_PER_GENERAL_REGION * 4,
    rule:
      "All 256 seats exist as geometry per General Region, but only chain-qualified seats become visible islands."
  });

  const TIC_TAC_TOE_DYNAMIC_PROTOCOL = Object.freeze({
    T1: "One detached island engine.",
    T2: "Four General Region island fields.",
    T3: "Sixteen rings by sixteen spokes per field.",
    T4: "Two-hundred fifty-six latent island seats per General Region.",
    T5: "Only chain-qualified seats render visibly.",
    T6: "Tiny scattered debris is suppressed.",
    T7: "Visible islands form intentional arcs and chains.",
    T8: "Canvas consumes islands separately from terrain.",
    T9: "Return constrained island-chain receipt."
  });

  const SYSTEMIC_QUAD_A_ATTACK = Object.freeze({
    authority: "/assets/hearth/hearth.islands.js",
    axis: "256 latent seats -> chain qualification -> visible island bodies",
    artifact:
      "A constrained detached island engine where 256 seats remain available, but visible expression appears as deliberate island chains instead of scattered debris.",
    attack:
      "Reject debris fields, over-dense island scatter, island logic inside terrain, beach ownership, hydration ownership, weather, clouds, humidity, and route ownership."
  });

  const REGION_SOURCE = [
    {
      id: "GR01",
      name: "Baseward West",
      centerLonLat: [-104, 20],
      size: [0.96, 0.66],
      color: [139, 114, 72],
      seed: 0.13,
      chainBias: [0.08, 0.38, 0.66]
    },
    {
      id: "GR02",
      name: "Rising South",
      centerLonLat: [-26, -28],
      size: [0.74, 0.82],
      color: [154, 124, 80],
      seed: 0.39,
      chainBias: [0.16, 0.48, 0.78]
    },
    {
      id: "GR03",
      name: "Middle Eastward",
      centerLonLat: [58, 18],
      size: [1.0, 0.62],
      color: [133, 125, 82],
      seed: 0.64,
      chainBias: [0.20, 0.52, 0.84]
    },
    {
      id: "GR04",
      name: "Summitward North",
      centerLonLat: [138, 43],
      size: [0.66, 0.56],
      color: [127, 126, 94],
      seed: 0.86,
      chainBias: [0.12, 0.44, 0.72]
    }
  ];

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);
  const mix = (a, b, t) => Math.round(lerp(a, b, t));

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
        Math.sin(x * 19.0 + y * 13.0 + seed) * 0.16 +
        Math.cos(x * 31.0 - y * 17.0 + seed * 0.71) * 0.11,
      0,
      1
    );
  }

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

  function ringVisibilityFactor(ring) {
    if (ring < MIN_VISIBLE_RING || ring > MAX_VISIBLE_RING) return 0;

    const centerBand = 1 - Math.abs((ring - 7.5) / 7.5);
    const outerSuppression = 1 - smoothstep(11, 16, ring);
    const innerSuppression = smoothstep(1, 4, ring);

    return clamp(centerBand * 0.72 + outerSuppression * innerSuppression * 0.36, 0, 1);
  }

  function chainBandStrength(region, ring, spoke, angle) {
    const ringNorm = ring / (RINGS - 1);
    const spokeNorm = spoke / SPOKES;

    let best = 0;

    region.chainBias.forEach((bias, i) => {
      const drift =
        bias +
        Math.sin(ringNorm * TAU * 0.65 + region.seed * TAU + i * 0.9) * 0.055 +
        Math.cos(ringNorm * TAU * 1.15 + region.seed * 3.0 + i) * 0.035;

      const d = Math.abs(angleDelta(spokeNorm * TAU, drift * TAU));
      const width = 0.18 + i * 0.025;
      const band = 1 - smoothstep(width, width * 1.9, d);

      best = Math.max(best, band);
    });

    const brokenArc =
      0.62 +
      Math.sin(ring * 0.83 + spoke * 0.61 + region.seed * 9.0) * 0.22 +
      Math.cos(ring * 0.31 - spoke * 0.77 + region.seed * 13.0) * 0.16;

    return clamp(best * brokenArc, 0, 1);
  }

  function seatDefinition(region, ringIndex, spokeIndex) {
    const ring = ((ringIndex % RINGS) + RINGS) % RINGS;
    const spoke = ((spokeIndex % SPOKES) + SPOKES) % SPOKES;
    const seatNumber = ring * SPOKES + spoke + 1;

    const h1 = hash3(region.index + 1, seatNumber + 11, region.seed * 1000 + 1);
    const h2 = hash3(region.index + 1, seatNumber + 23, region.seed * 1000 + 2);
    const h3 = hash3(region.index + 1, seatNumber + 37, region.seed * 1000 + 3);
    const h4 = hash3(region.index + 1, seatNumber + 51, region.seed * 1000 + 4);

    const baseAngle = (spoke / SPOKES) * TAU;
    const angle = baseAngle + (h1 - 0.5) * (TAU / SPOKES) * 0.30;
    const radius = 1.045 + ring * 0.020 + h2 * 0.010;
    const direction = directionFromAngle(angle);
    const precedence = DIRECTION_PRECEDENCE[direction];

    const chainStrength = chainBandStrength(region, ring, spoke, baseAngle);
    const ringFactor = ringVisibilityFactor(ring);
    const visibleQualification = clamp(chainStrength * ringFactor * (0.72 + h4 * 0.36), 0, 1);

    const islandRadius =
      visibleQualification > MIN_VISIBLE_STRENGTH
        ? 0.010 + h3 * 0.020 + chainStrength * 0.010
        : 0.004 + h3 * 0.006;

    const islandStrength = clamp(
      (0.34 + h4 * 0.42 + chainStrength * 0.34) * ringFactor,
      0,
      1
    );

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
      chainStrength,
      ringFactor,
      visibleQualification,
      visibleQualified: visibleQualification >= MIN_VISIBLE_STRENGTH,
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
      const score = local.facing - Math.abs(r - 1.17) * 0.22;

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
      strength * (0.34 + (1 - rocky) * 0.30) +
        (1 - normalizedDistance) * 0.14 +
        (island.direction === "west" ? 0.10 : 0),
      0,
      1
    );

    const mountainStrength = clamp(
      strength * (0.28 + height * 0.48) +
        (island.direction === "north" ? 0.14 : 0) +
        (radial < 0.42 ? 0.04 : 0),
      0,
      1.18
    );

    const cliffStrength = clamp(
      strength * (0.22 + rocky * 0.48) +
        (island.direction === "north" ? 0.12 : 0) +
        (island.direction === "south" ? 0.06 : 0) +
        radial * 0.05,
      0,
      1.18
    );

    const valleyStrength = clamp(
      strength * (0.20 + (1 - height) * 0.28) +
        normalizedDistance * 0.10 +
        (island.direction === "south" ? 0.08 : 0) +
        (island.direction === "west" ? 0.10 : 0),
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
      landformGeometry: "constrained-256-island-chain",
      landformGeometryTotal: ISLANDS_PER_GENERAL_REGION
    };
  }

  function islandColor(region, island, landform, strength) {
    let [r, g, b] = region.color;

    r = mix(r, 104, island.rockyMultiplier * 0.20);
    g = mix(g, 102, island.rockyMultiplier * 0.18);
    b = mix(b, 86, island.rockyMultiplier * 0.16);

    r = mix(r, 204, island.heightMultiplier * strength * 0.16);
    g = mix(g, 192, island.heightMultiplier * strength * 0.13);
    b = mix(b, 154, island.heightMultiplier * strength * 0.10);

    r = mix(r, 148, landform.hillStrength * 0.06);
    g = mix(g, 138, landform.hillStrength * 0.06);
    b = mix(b, 96, landform.hillStrength * 0.05);

    r = mix(r, 224, landform.mountainStrength * 0.08);
    g = mix(g, 216, landform.mountainStrength * 0.07);
    b = mix(b, 188, landform.mountainStrength * 0.05);

    r = mix(r, 66, landform.cliffStrength * 0.10);
    g = mix(g, 68, landform.cliffStrength * 0.08);
    b = mix(b, 64, landform.cliffStrength * 0.07);

    r = mix(r, 86, landform.valleyStrength * 0.06);
    g = mix(g, 112, landform.valleyStrength * 0.06);
    b = mix(b, 82, landform.valleyStrength * 0.05);

    return [r, g, b];
  }

  function sampleVector(vec) {
    const v = norm3(vec);
    const nearest = nearestRegionLocal(v);

    if (!nearest || nearest.local.facing < 0.14) {
      return inactiveSample();
    }

    const region = nearest.region;
    const local = nearest.local;
    const r = Math.hypot(local.x, local.y);
    const theta = Math.atan2(local.y, local.x);

    if (r < 1.02 || r > 1.34) {
      return inactiveSample(region);
    }

    const ringEstimate = clamp(Math.round((r - 1.045) / 0.020), 0, RINGS - 1);
    const positiveTheta = theta < 0 ? theta + TAU : theta;
    const spokeEstimate = clamp(Math.round((positiveTheta / TAU) * SPOKES), 0, SPOKES - 1);

    let best = null;
    let bestStrength = 0;
    let bestDistance = Infinity;

    for (let dr = -1; dr <= 1; dr += 1) {
      for (let ds = -1; ds <= 1; ds += 1) {
        const island = seatDefinition(region, ringEstimate + dr, spokeEstimate + ds);

        if (!island.visibleQualified) continue;

        const dx = local.x - island.x;
        const dy = local.y - island.y;
        const d = Math.hypot(dx, dy);

        const organic =
          0.84 +
          microIsland(local.x * 2.1, local.y * 2.1, region.seed * 77 + island.seatNumber) * 0.28;

        const core = 1 - smoothstep(island.islandRadius * organic, island.islandRadius * 2.05 * organic, d);
        const strength = core * island.islandStrength * island.visibleQualification;

        if (strength > bestStrength) {
          best = island;
          bestStrength = strength;
          bestDistance = d;
        }
      }
    }

    if (!best || bestStrength < 0.20) {
      return inactiveSample(region);
    }

    const landform = islandLandform(best, bestStrength, bestDistance);

    const ridge = clamp(bestStrength * best.rockyMultiplier * 0.62 + landform.mountainStrength * 0.14, 0, 1);
    const upland = clamp(bestStrength * (0.34 + best.heightMultiplier * 0.28) + landform.hillStrength * 0.08, 0, 1);
    const relief = clamp(bestStrength * (0.30 + best.rockyMultiplier * 0.34) + landform.cliffStrength * 0.12, 0, 1);
    const coast = clamp(1 - smoothstep(best.islandRadius * 0.38, best.islandRadius * 1.24, bestDistance), 0, 1);

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

      chainStrength: best.chainStrength,
      visibleQualification: best.visibleQualification,
      visibleQualified: best.visibleQualified,
      chainMode: "constrained-visible-subset",
      latentSeatCountForRegion: ISLANDS_PER_GENERAL_REGION,

      direction: best.direction,
      rockyPrecedenceRank: best.rockyPrecedenceRank,
      rockyMultiplier: best.rockyMultiplier,
      heightMultiplier: best.heightMultiplier,

      coast,
      shelf: clamp(coast * 0.48, 0, 1),
      waterDepth: 0,
      ridge,
      upland,
      relief,
      lowland: clamp((1 - upland) * 0.24 + landform.valleyStrength * 0.12, 0, 1),
      color: islandColor(region, best, landform, bestStrength),

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
      geometry: "constrained-256-island-chain",
      lattice: "16x16-latent-visible-chain-subset",
      authority: "island-engine-constrained-256-chain"
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
      latentSeatCountForRegion: ISLANDS_PER_GENERAL_REGION,
      region: region ? region.id : null,
      regionName: region ? region.name : null,
      chainStrength: 0,
      visibleQualification: 0,
      visibleQualified: false,
      chainMode: "latent-seat-not-visible",
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
      geometry: "constrained-256-island-chain",
      lattice: "16x16-latent-visible-chain-subset",
      authority: "island-engine-constrained-256-chain"
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      standard: "constrained-256-island-chain-engine",
      authority: "island-engine-constrained-256-chain",
      chainLaw: CHAIN_LAW,
      directionPrecedence: DIRECTION_PRECEDENCE,
      landformCategories: LANDFORM_CATEGORIES,
      geometry: "constrained-256-island-chain",
      lattice: {
        rings: RINGS,
        spokes: SPOKES,
        latentSeatsPerGeneralRegion: ISLANDS_PER_GENERAL_REGION,
        totalLatentSeats: ISLANDS_PER_GENERAL_REGION * 4,
        visibleMode: "chain-qualified-subset",
        minVisibleStrength: MIN_VISIBLE_STRENGTH,
        visibleRingWindow: [MIN_VISIBLE_RING + 1, MAX_VISIBLE_RING + 1]
      },
      generalRegions: REGIONS.map((region) => ({
        id: region.id,
        name: region.name,
        latentIslandSeats: ISLANDS_PER_GENERAL_REGION,
        visibleMode: "constrained chains",
        chainBias: region.chainBias,
        geometry: "16 rings x 16 spokes"
      })),
      owns: [
        "detached island bodies",
        "256 latent island seats per General Region",
        "visible island-chain subset",
        "island chain qualification",
        "island hill categories",
        "island mountain categories",
        "island cliff categories",
        "island valley categories",
        "island relation to nearest General Region"
      ],
      doesNotOwn: [
        "main land body terrain",
        "country assignment",
        "beaches",
        "sand systems",
        "mountain child engine",
        "cliff child engine",
        "valley child engine",
        "hydration expansion",
        "rivers",
        "lakes",
        "weather",
        "climate",
        "clouds",
        "humidity",
        "atmospheric moisture",
        "generated images",
        "GraphicBox"
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
    standard: "constrained-256-island-chain-engine",
    authority: "island-engine-constrained-256-chain",
    chainLaw: CHAIN_LAW,
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
  document.documentElement.dataset.hearthIslandsStandard = "constrained-256-island-chain-engine";
  document.documentElement.dataset.hearthIslandsGeometry = "constrained-256-island-chain";
  document.documentElement.dataset.hearthIslandsRings = String(RINGS);
  document.documentElement.dataset.hearthIslandsSpokes = String(SPOKES);
  document.documentElement.dataset.hearthIslandsLatentSeatsPerRegion = String(ISLANDS_PER_GENERAL_REGION);
  document.documentElement.dataset.hearthIslandsTotalLatentSeats = String(ISLANDS_PER_GENERAL_REGION * 4);
  document.documentElement.dataset.hearthIslandsVisibleMode = "chain-qualified-subset";
  document.documentElement.dataset.hearthIslandsLandformCategories = "hills-mountains-cliffs-valleys";
  document.documentElement.dataset.hearthIslandsBeachesExcluded = "true";
  document.documentElement.dataset.hearthIslandsSandExcluded = "true";
  document.documentElement.dataset.hearthIslandsDetachedFromTerrain = "true";
  document.documentElement.dataset.hearthIslandsGeneratedImage = "false";
  document.documentElement.dataset.hearthIslandsGraphicBox = "false";
})();
