// /assets/hearth/hearth.islands.js
// HEARTH_ISLANDS_AUTHORITY_CONSUMPTION_BRIDGE_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Previous baseline: HEARTH_G3_256_ISLAND_COASTAL_FEATURE_SPLIT_TNT_v1
// Purpose:
// - Preserve the existing 256-state island/coastal geometry.
// - Preserve sampleVector(vec).
// - Add standard Hearth authority methods: sample(point), read(point), get(point), sampleIslandFeature(point), getReceipt().
// - Support coordinate packets: {x,y,z}, {u,v}, {lon,lat}, {longitude,latitude}, positional (x,y,z), and positional (lon,lat).
// - Normalize active and inactive island/coastal-feature packets for downstream elevation, hydrology, materials, canvas, and future zoom.
// - Clarify that 4 regions x 256 seats = 1024 latent feature seats, not 1024 visible islands.
// - Preserve peninsulas as attached coastal relationships.
// - Preserve bays as negative water/coastline carves.
// - Preserve keys and main islands as the only detached land candidates.
// - Preserve beaches/sand exclusion.
// Does not own:
// - main continent terrain
// - elevation generation
// - hydrology
// - beaches
// - sand
// - material palette
// - canvas drawing
// - zoom
// - runtime motion
// - controls
// - route state
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ISLANDS_AUTHORITY_CONSUMPTION_BRIDGE_TNT_v1";
  const RECEIPT = "HEARTH_ISLANDS_AUTHORITY_CONSUMPTION_BRIDGE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_G3_256_ISLAND_COASTAL_FEATURE_SPLIT_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const VERSION = "2026-05-30.hearth-islands-authority-consumption-bridge-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const RAD = 180 / Math.PI;

  const RINGS = 16;
  const SPOKES = 16;
  const SEATS_PER_REGION = RINGS * SPOKES;
  const GENERAL_REGION_COUNT = 4;
  const TOTAL_LATENT_FEATURE_SEATS = SEATS_PER_REGION * GENERAL_REGION_COUNT;

  const FEATURE_CATEGORIES = Object.freeze([
    "peninsula",
    "bay",
    "key",
    "mainIsland"
  ]);

  const CATEGORY_BANDS = Object.freeze({
    peninsula: { startRing: 0, endRing: 3, seats: 64 },
    bay: { startRing: 4, endRing: 7, seats: 64 },
    key: { startRing: 8, endRing: 11, seats: 64 },
    mainIsland: { startRing: 12, endRing: 15, seats: 64 }
  });

  const FEATURE_LAW = Object.freeze({
    geometry: "16 rings x 16 spokes = 256 seats per General Region",
    categorySplit: "4 feature categories x 64 seats = 256 feature seats per General Region",
    generalRegionCount: GENERAL_REGION_COUNT,
    totalLatentFeatureSeats: TOTAL_LATENT_FEATURE_SEATS,
    latentFeatureSeatsAreNotVisibleIslandCount: true,
    categories: FEATURE_CATEGORIES,
    rule:
      "Every seat is classified first. Only keys and main islands may render as detached island land. Peninsulas and bays return coastal relationship metadata."
  });

  const DIRECTION_PRECEDENCE = Object.freeze({
    north: { rank: 4, rockyMultiplier: 1.0, heightMultiplier: 1.0 },
    south: { rank: 3, rockyMultiplier: 0.82, heightMultiplier: 0.86 },
    east: { rank: 2, rockyMultiplier: 0.64, heightMultiplier: 0.72 },
    west: { rank: 1, rockyMultiplier: 0.46, heightMultiplier: 0.58 }
  });

  const TIC_TAC_TOE_DYNAMIC_PROTOCOL = Object.freeze({
    T1: "Keep 256 latent coastal/island seats per General Region.",
    T2: "Classify each seat before rendering.",
    T3: "Peninsulas attach to parent coastline and do not become detached islands.",
    T4: "Bays carve negative coastline/water cuts and do not render as land.",
    T5: "Keys absorb small fragments into intentional low island chains.",
    T6: "Main islands render as fewer, larger detached bodies.",
    T7: "Debris scatter is suppressed.",
    T8: "The full 256-state geometry remains intact.",
    T9: "Return featureCategory, featureFamily, chainMembership, and visibleQualification."
  });

  const SYSTEMIC_QUAD_A_ATTACK = Object.freeze({
    authority: "/assets/hearth/hearth.islands.js",
    admissibility:
      "Every visible feature must belong to the existing 256-seat geometry. No new regions, countries, or route authority.",
    alignment:
      "Peninsulas and bays align to parent terrain coast. Keys align to small chain behavior. Main islands align to larger detached bodies.",
    attack:
      "Reject debris scatter, every seat rendering as detached land, island logic inside terrain, beach logic inside islands, route mutation, GraphicBox, generated images, active weather, clouds, and humidity."
  });

  const REGION_SOURCE = [
    {
      id: "GR01",
      name: "Baseward West",
      centerLonLat: [-104, 20],
      size: [0.96, 0.66],
      color: [139, 114, 72],
      seed: 0.13,
      chainBias: [0.10, 0.58],
      bayBias: [0.30, 0.78]
    },
    {
      id: "GR02",
      name: "Rising South",
      centerLonLat: [-26, -28],
      size: [0.74, 0.82],
      color: [154, 124, 80],
      seed: 0.39,
      chainBias: [0.18, 0.66],
      bayBias: [0.42, 0.86]
    },
    {
      id: "GR03",
      name: "Middle Eastward",
      centerLonLat: [58, 18],
      size: [1.0, 0.62],
      color: [133, 125, 82],
      seed: 0.64,
      chainBias: [0.22, 0.72],
      bayBias: [0.36, 0.82]
    },
    {
      id: "GR04",
      name: "Summitward North",
      centerLonLat: [138, 43],
      size: [0.66, 0.56],
      color: [127, 126, 94],
      seed: 0.86,
      chainBias: [0.14, 0.62],
      bayBias: [0.28, 0.74]
    }
  ];

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function mix(a, b, t) {
    return Math.round(lerp(a, b, t));
  }

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
    const source = Array.isArray(v)
      ? v
      : [
          Number(v && v.x) || 0,
          Number(v && v.y) || 0,
          Number(v && v.z) || 1
        ];

    const m = Math.hypot(source[0], source[1], source[2]) || 1;
    return [source[0] / m, source[1] / m, source[2] / m];
  }

  function dirFromLonLat(lonDeg, latDeg) {
    const lon = (Number(lonDeg || 0) * Math.PI) / 180;
    const lat = (Number(latDeg || 0) * Math.PI) / 180;
    const cl = Math.cos(lat);
    return [cl * Math.sin(lon), Math.sin(lat), cl * Math.cos(lon)];
  }

  function lonLatFromDir(vec) {
    const v = norm3(vec);
    return {
      lon: Math.atan2(v[0], v[2]) * RAD,
      lat: Math.asin(clamp(v[1], -1, 1)) * RAD
    };
  }

  function lonToU(lon) {
    return (((Number(lon) + 180) / 360) % 1 + 1) % 1;
  }

  function latToV(lat) {
    return clamp((90 - Number(lat)) / 180, 0, 1);
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

  function microFeature(x, y, seed) {
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

  function categoryFromRing(ring) {
    if (ring <= 3) return "peninsula";
    if (ring <= 7) return "bay";
    if (ring <= 11) return "key";
    return "mainIsland";
  }

  function featureFamily(category) {
    if (category === "peninsula") return "attached-coastal-extension";
    if (category === "bay") return "negative-coastal-carve";
    if (category === "key") return "low-island-chain";
    if (category === "mainIsland") return "major-detached-island";
    return "latent";
  }

  function categorySeatNumber(ring, spoke) {
    const categoryLocalRing = ring % 4;
    return categoryLocalRing * SPOKES + spoke + 1;
  }

  function ringVisibilityFactor(category, ring) {
    if (category === "peninsula") {
      return clamp(1 - smoothstep(3.1, 4.3, ring), 0, 1);
    }

    if (category === "bay") {
      return clamp(smoothstep(3.2, 5.0, ring) * (1 - smoothstep(7.2, 8.6, ring)), 0, 1);
    }

    if (category === "key") {
      return clamp(smoothstep(7.5, 9.0, ring) * (1 - smoothstep(11.8, 13.2, ring)), 0, 1);
    }

    if (category === "mainIsland") {
      return clamp(smoothstep(11.4, 13.0, ring), 0, 1);
    }

    return 0;
  }

  function chainBandStrength(region, ring, spoke, category) {
    const spokeNorm = spoke / SPOKES;
    const ringNorm = ring / (RINGS - 1);
    const angle = spokeNorm * TAU;
    const biases = category === "bay" ? region.bayBias : region.chainBias;

    let best = 0;

    biases.forEach((bias, i) => {
      const drift =
        bias +
        Math.sin(ringNorm * TAU * 0.58 + region.seed * TAU + i * 0.93) * 0.045 +
        Math.cos(ringNorm * TAU * 1.08 + region.seed * 2.7 + i) * 0.032;

      const d = Math.abs(angleDelta(angle, drift * TAU));

      const width =
        category === "mainIsland"
          ? 0.105
          : category === "key"
            ? 0.145
            : category === "bay"
              ? 0.18
              : 0.22;

      const band = 1 - smoothstep(width, width * 1.85, d);
      best = Math.max(best, band);
    });

    const brokenArc =
      0.58 +
      Math.sin(ring * 0.83 + spoke * 0.61 + region.seed * 9.0) * 0.22 +
      Math.cos(ring * 0.31 - spoke * 0.77 + region.seed * 13.0) * 0.16;

    return clamp(best * brokenArc, 0, 1);
  }

  function radiusForSeat(category, ring, h) {
    if (category === "peninsula") return 0.965 + ring * 0.018 + h * 0.006;
    if (category === "bay") return 1.035 + (ring - 4) * 0.020 + h * 0.006;
    if (category === "key") return 1.115 + (ring - 8) * 0.022 + h * 0.006;
    return 1.205 + (ring - 12) * 0.030 + h * 0.010;
  }

  function visibilityThreshold(category) {
    if (category === "peninsula") return 0.38;
    if (category === "bay") return 0.42;
    if (category === "key") return 0.56;
    return 0.68;
  }

  function seatDefinition(region, ringIndex, spokeIndex) {
    const ring = clamp(Math.round(ringIndex), 0, RINGS - 1);
    const spoke = ((Math.round(spokeIndex) % SPOKES) + SPOKES) % SPOKES;
    const seatNumber = ring * SPOKES + spoke + 1;
    const category = categoryFromRing(ring);

    const h1 = hash3(region.index + 1, seatNumber + 11, region.seed * 1000 + 1);
    const h2 = hash3(region.index + 1, seatNumber + 23, region.seed * 1000 + 2);
    const h3 = hash3(region.index + 1, seatNumber + 37, region.seed * 1000 + 3);
    const h4 = hash3(region.index + 1, seatNumber + 51, region.seed * 1000 + 4);

    const baseAngle = (spoke / SPOKES) * TAU;
    const angle = baseAngle + (h1 - 0.5) * (TAU / SPOKES) * 0.28;
    const radius = radiusForSeat(category, ring, h2);
    const direction = directionFromAngle(angle);
    const precedence = DIRECTION_PRECEDENCE[direction];

    const chainStrength = chainBandStrength(region, ring, spoke, category);
    const ringFactor = ringVisibilityFactor(category, ring);
    const threshold = visibilityThreshold(category);

    const categorySeed =
      category === "mainIsland"
        ? 0.18
        : category === "key"
          ? 0.14
          : category === "bay"
            ? 0.10
            : 0.12;

    const visibleQualification = clamp(
      chainStrength * 0.66 +
        ringFactor * 0.22 +
        h4 * categorySeed,
      0,
      1
    );

    const visibleQualified = visibleQualification >= threshold;

    const featureRadius =
      category === "mainIsland"
        ? 0.024 + h3 * 0.026 + visibleQualification * 0.010
        : category === "key"
          ? 0.008 + h3 * 0.014 + visibleQualification * 0.004
          : category === "peninsula"
            ? 0.015 + h3 * 0.016
            : 0.012 + h3 * 0.014;

    const featureStrength = clamp(
      (0.28 + h4 * 0.36 + chainStrength * 0.36) * ringFactor,
      0,
      1
    );

    return {
      id: `${region.id}-FEATURE-${String(seatNumber).padStart(3, "0")}`,
      regionId: region.id,
      regionName: region.name,
      seatNumber,
      categorySeat: categorySeatNumber(ring, spoke),
      ring,
      spoke,
      angle,
      radius,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,

      featureCategory: category,
      featureFamily: featureFamily(category),
      parentCoastRelation:
        category === "peninsula"
          ? "attached-to-parent-coast"
          : category === "bay"
            ? "negative-coastline-cut"
            : category === "key"
              ? "detached-low-chain-near-coast"
              : "detached-main-island-body",

      chainMembership: chainStrength > 0.32 ? "chain-qualified" : "latent-orphan",
      chainStrength,
      ringFactor,
      visibleQualification,
      visibleQualified,
      threshold,

      featureRadius,
      featureStrength,

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
      const score = local.facing - Math.abs(r - 1.13) * 0.20;

      if (!best || score > best.score) {
        best = { region, local, r, score };
      }
    }

    return best;
  }

  function estimateRingFromRadius(r) {
    if (r < 1.03) return clamp(Math.round((r - 0.965) / 0.018), 0, 3);
    if (r < 1.115) return clamp(Math.round((r - 1.035) / 0.020) + 4, 4, 7);
    if (r < 1.205) return clamp(Math.round((r - 1.115) / 0.022) + 8, 8, 11);
    return clamp(Math.round((r - 1.205) / 0.030) + 12, 12, 15);
  }

  function landformForDetachedFeature(feature, strength, distance) {
    const normalizedDistance = clamp(distance / ((feature.featureRadius || 0.01) * 2.3), 0, 1);
    const rocky = feature.rockyMultiplier;
    const height = feature.heightMultiplier;

    const hillStrength = clamp(
      strength * (0.34 + (1 - rocky) * 0.26) +
        (1 - normalizedDistance) * 0.12 +
        (feature.direction === "west" ? 0.08 : 0),
      0,
      1
    );

    const mountainStrength = clamp(
      strength * (0.24 + height * 0.44) +
        (feature.direction === "north" ? 0.12 : 0) +
        (feature.featureCategory === "mainIsland" ? 0.12 : 0),
      0,
      1.16
    );

    const cliffStrength = clamp(
      strength * (0.22 + rocky * 0.42) +
        (feature.direction === "north" ? 0.10 : 0) +
        (feature.featureCategory === "mainIsland" ? 0.10 : 0),
      0,
      1.16
    );

    const valleyStrength = clamp(
      strength * (0.18 + (1 - height) * 0.26) +
        normalizedDistance * 0.08 +
        (feature.direction === "south" ? 0.08 : 0) +
        (feature.direction === "west" ? 0.08 : 0),
      0,
      1
    );

    const ranked = [
      { category: "hill", strength: hillStrength },
      { category: "mountain", strength: mountainStrength },
      { category: "cliff", strength: cliffStrength },
      { category: "valley", strength: valleyStrength }
    ].sort((a, b) => b.strength - a.strength);

    return {
      landformCategory: ranked[0].category,
      dominantLandform: ranked[0].category,
      landformSeat: feature.seatNumber,
      landformRing: feature.ring + 1,
      landformSpoke: feature.spoke + 1,
      hillStrength,
      mountainStrength,
      cliffStrength,
      valleyStrength,
      landformGeometry: "256-island-coastal-feature-split",
      landformGeometryTotal: SEATS_PER_REGION
    };
  }

  function featureColor(region, feature, landform, strength) {
    let [r, g, b] = region.color;

    if (feature.featureCategory === "key") {
      r = mix(r, 150, 0.22);
      g = mix(g, 134, 0.18);
      b = mix(b, 92, 0.14);
    }

    if (feature.featureCategory === "mainIsland") {
      r = mix(r, 112, feature.rockyMultiplier * 0.22);
      g = mix(g, 108, feature.rockyMultiplier * 0.20);
      b = mix(b, 88, feature.rockyMultiplier * 0.18);
    }

    r = mix(r, 204, feature.heightMultiplier * strength * 0.14);
    g = mix(g, 192, feature.heightMultiplier * strength * 0.11);
    b = mix(b, 154, feature.heightMultiplier * strength * 0.09);

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

  function relationOnlySample(region, feature, strength, distance) {
    const category = feature.featureCategory;

    return {
      active: category === "peninsula" || category === "bay",
      land: false,
      island: false,
      visibleIsland: false,
      detachedIslandBody: false,
      coastalRelationOnly: true,

      featureId: feature.id,
      featureCategory: category,
      featureFamily: feature.featureFamily,
      parentCoastRelation: feature.parentCoastRelation,
      chainMembership: feature.chainMembership,
      visibleQualification: feature.visibleQualification,
      visibleQualified: feature.visibleQualified,

      region: region.id,
      regionName: region.name,
      featureSeat: feature.seatNumber,
      categorySeat: feature.categorySeat,
      featureRing: feature.ring + 1,
      featureSpoke: feature.spoke + 1,
      direction: feature.direction,

      peninsulaStrength: category === "peninsula" ? strength : 0,
      bayCarveStrength: category === "bay" ? strength : 0,
      keyStrength: 0,
      mainIslandStrength: 0,

      islandStrength: 0,
      coast: category === "peninsula" ? clamp(strength * 0.62, 0, 1) : 0,
      shelf: category === "bay" ? clamp(strength * 0.52, 0, 1) : 0,
      waterDepth: category === "bay" ? clamp(0.62 + strength * 0.26, 0, 1) : 1,

      color: null,
      landformCategory: null,
      dominantLandform: null,
      hillStrength: 0,
      mountainStrength: 0,
      cliffStrength: 0,
      valleyStrength: 0,

      featureDistance: distance,
      beachExcludedFromIslands: true,
      sandExcludedFromIslands: true,
      surfaceScale: "planet",
      geometry: "256-island-coastal-feature-split",
      lattice: "16x16-categorized",
      authority: "island-engine-256-coastal-feature-split"
    };
  }

  function inactiveSample(region = null) {
    return {
      active: false,
      land: false,
      island: false,
      visibleIsland: false,
      detachedIslandBody: false,
      coastalRelationOnly: false,

      featureId: null,
      featureCategory: "latent",
      featureFamily: "latent",
      parentCoastRelation: null,
      chainMembership: "latent",
      visibleQualification: 0,
      visibleQualified: false,

      islandId: null,
      islandIndex: null,
      islandSeatNumber: null,
      islandRing: null,
      islandSpoke: null,
      islandStrength: 0,
      islandCountForRegion: SEATS_PER_REGION,
      latentSeatCountForRegion: SEATS_PER_REGION,

      region: region ? region.id : null,
      regionName: region ? region.name : null,

      featureSeat: null,
      categorySeat: null,
      featureRing: null,
      featureSpoke: null,

      peninsulaStrength: 0,
      bayCarveStrength: 0,
      keyStrength: 0,
      mainIslandStrength: 0,

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
      geometry: "256-island-coastal-feature-split",
      lattice: "16x16-categorized",
      authority: "island-engine-256-coastal-feature-split"
    };
  }

  function sampleVectorRaw(vec) {
    const v = norm3(vec);
    const nearest = nearestRegionLocal(v);

    if (!nearest || nearest.local.facing < 0.14) {
      return inactiveSample();
    }

    const region = nearest.region;
    const local = nearest.local;
    const r = Math.hypot(local.x, local.y);

    if (r < 0.94 || r > 1.36) {
      return inactiveSample(region);
    }

    const theta = Math.atan2(local.y, local.x);
    const positiveTheta = theta < 0 ? theta + TAU : theta;
    const ringEstimate = estimateRingFromRadius(r);
    const spokeEstimate = clamp(Math.round((positiveTheta / TAU) * SPOKES), 0, SPOKES - 1);

    let best = null;
    let bestStrength = 0;
    let bestDistance = Infinity;

    for (let dr = -1; dr <= 1; dr += 1) {
      for (let ds = -1; ds <= 1; ds += 1) {
        const feature = seatDefinition(region, ringEstimate + dr, spokeEstimate + ds);

        if (!feature.visibleQualified) continue;

        const dx = local.x - feature.x;
        const dy = local.y - feature.y;
        const d = Math.hypot(dx, dy);

        const organic =
          0.86 +
          microFeature(local.x * 2.0, local.y * 2.0, region.seed * 77 + feature.seatNumber) * 0.24;

        const radiusMultiplier =
          feature.featureCategory === "mainIsland"
            ? 2.0
            : feature.featureCategory === "key"
              ? 1.65
              : 1.55;

        const core =
          1 -
          smoothstep(
            feature.featureRadius * organic,
            feature.featureRadius * radiusMultiplier * organic,
            d
          );

        const strength = core * feature.featureStrength * feature.visibleQualification;

        if (strength > bestStrength) {
          best = feature;
          bestStrength = strength;
          bestDistance = d;
        }
      }
    }

    if (!best || bestStrength < 0.18) {
      return inactiveSample(region);
    }

    if (best.featureCategory === "peninsula" || best.featureCategory === "bay") {
      return relationOnlySample(region, best, clamp(bestStrength, 0, 1), bestDistance);
    }

    const landform = landformForDetachedFeature(best, bestStrength, bestDistance);
    const isKey = best.featureCategory === "key";
    const isMainIsland = best.featureCategory === "mainIsland";

    const visibleStrength = isMainIsland
      ? clamp(bestStrength * 1.08, 0, 1)
      : clamp(bestStrength * 0.76, 0, 1);

    if (isKey && visibleStrength < 0.24) {
      return inactiveSample(region);
    }

    if (isMainIsland && visibleStrength < 0.30) {
      return inactiveSample(region);
    }

    const ridge = clamp(
      visibleStrength * best.rockyMultiplier * (isMainIsland ? 0.76 : 0.48) +
        landform.mountainStrength * 0.14,
      0,
      1
    );

    const upland = clamp(
      visibleStrength * (0.34 + best.heightMultiplier * (isMainIsland ? 0.34 : 0.22)) +
        landform.hillStrength * 0.08,
      0,
      1
    );

    const relief = clamp(
      visibleStrength * (0.30 + best.rockyMultiplier * (isMainIsland ? 0.42 : 0.24)) +
        landform.cliffStrength * 0.12,
      0,
      1
    );

    const coast = clamp(
      1 - smoothstep(best.featureRadius * 0.34, best.featureRadius * 1.18, bestDistance),
      0,
      1
    );

    return {
      active: true,
      land: true,
      island: true,
      visibleIsland: true,
      detachedIslandBody: true,
      coastalRelationOnly: false,

      featureId: best.id,
      featureCategory: best.featureCategory,
      featureFamily: best.featureFamily,
      parentCoastRelation: best.parentCoastRelation,
      chainMembership: best.chainMembership,
      visibleQualification: best.visibleQualification,
      visibleQualified: best.visibleQualified,

      islandId: best.id,
      islandIndex: best.seatNumber,
      islandSeatNumber: best.seatNumber,
      islandRing: best.ring + 1,
      islandSpoke: best.spoke + 1,
      islandStrength: visibleStrength,
      islandDistance: bestDistance,
      islandCountForRegion: SEATS_PER_REGION,
      latentSeatCountForRegion: SEATS_PER_REGION,

      featureSeat: best.seatNumber,
      categorySeat: best.categorySeat,
      featureRing: best.ring + 1,
      featureSpoke: best.spoke + 1,

      region: region.id,
      regionName: region.name,

      peninsulaStrength: 0,
      bayCarveStrength: 0,
      keyStrength: isKey ? visibleStrength : 0,
      mainIslandStrength: isMainIsland ? visibleStrength : 0,

      direction: best.direction,
      rockyPrecedenceRank: best.rockyPrecedenceRank,
      rockyMultiplier: best.rockyMultiplier,
      heightMultiplier: best.heightMultiplier,

      coast,
      shelf: clamp(coast * (isKey ? 0.38 : 0.54), 0, 1),
      waterDepth: 0,
      ridge,
      upland,
      relief,
      lowland: clamp((1 - upland) * 0.22 + landform.valleyStrength * 0.10, 0, 1),

      color: featureColor(region, best, landform, visibleStrength),

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
      geometry: "256-island-coastal-feature-split",
      lattice: "16x16-categorized",
      authority: "island-engine-256-coastal-feature-split"
    };
  }

  function parseInputToPacket(...args) {
    let vector;
    let inputMode = "default";

    if (args.length === 1 && Array.isArray(args[0])) {
      vector = norm3(args[0]);
      inputMode = "array-vector";
    } else if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        vector = norm3([Number(p.x), Number(p.y), Number(p.z)]);
        inputMode = "object-vector";
      } else if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        vector = dirFromLonLat(Number(p.lon), Number(p.lat));
        inputMode = "object-lon-lat";
      } else if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        vector = dirFromLonLat(Number(p.longitude), Number(p.latitude));
        inputMode = "object-longitude-latitude";
      } else if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        const u = (((Number(p.u) % 1) + 1) % 1);
        const v = clamp(Number(p.v), 0, 1);
        vector = dirFromLonLat(u * 360 - 180, 90 - v * 180);
        inputMode = "object-u-v";
      } else {
        vector = dirFromLonLat(0, 0);
        inputMode = "invalid-object-fallback";
      }
    } else if (args.length >= 3) {
      vector = norm3([Number(args[0]), Number(args[1]), Number(args[2])]);
      inputMode = "positional-vector";
    } else if (args.length >= 2) {
      vector = dirFromLonLat(Number(args[0]), Number(args[1]));
      inputMode = "positional-lon-lat";
    } else {
      vector = dirFromLonLat(0, 0);
      inputMode = "default-fallback";
    }

    const lonLat = lonLatFromDir(vector);

    return {
      vector,
      x: vector[0],
      y: vector[1],
      z: vector[2],
      lon: lonLat.lon,
      lat: lonLat.lat,
      u: lonToU(lonLat.lon),
      v: latToV(lonLat.lat),
      inputMode
    };
  }

  function normalizeIslandSample(raw, packet) {
    const source = raw && typeof raw === "object" ? raw : inactiveSample();

    let featureCategory = source.featureCategory || "latent";
    if (!FEATURE_CATEGORIES.includes(featureCategory)) featureCategory = featureCategory === "main-island" ? "mainIsland" : featureCategory;
    if (!FEATURE_CATEGORIES.includes(featureCategory)) featureCategory = "latent";

    const isPeninsula = featureCategory === "peninsula";
    const isBay = featureCategory === "bay";
    const isKey = featureCategory === "key";
    const isMainIsland = featureCategory === "mainIsland";
    const isDetachedCandidate = isKey || isMainIsland;

    const detachedIslandBody = Boolean(source.detachedIslandBody && isDetachedCandidate);
    const coastalRelationOnly = Boolean(source.coastalRelationOnly || isPeninsula || isBay);

    const land = Boolean(source.land && isDetachedCandidate && detachedIslandBody);
    const island = Boolean(source.island && isDetachedCandidate && detachedIslandBody);
    const visibleIsland = Boolean(source.visibleIsland && isDetachedCandidate && detachedIslandBody);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      authority: "island-engine-256-coastal-feature-consumption-bridge",
      standard: "256-island-coastal-feature-split-with-authority-bridge",

      x: packet.x,
      y: packet.y,
      z: packet.z,
      lon: packet.lon,
      lat: packet.lat,
      u: packet.u,
      v: packet.v,
      inputMode: packet.inputMode,

      active: Boolean(source.active),
      land,
      island,
      visibleIsland,
      detachedIslandBody,
      coastalRelationOnly,

      featureId: source.featureId || source.islandId || null,
      featureCategory,
      featureFamily: source.featureFamily || featureFamily(featureCategory),
      parentCoastRelation: source.parentCoastRelation || null,
      chainMembership: source.chainMembership || "latent",
      visibleQualification: clamp01(Number(source.visibleQualification) || 0),
      visibleQualified: Boolean(source.visibleQualified),

      islandId: source.islandId || source.featureId || null,
      islandIndex: Number.isFinite(Number(source.islandIndex)) ? Number(source.islandIndex) : null,
      islandSeatNumber: Number.isFinite(Number(source.islandSeatNumber)) ? Number(source.islandSeatNumber) : null,
      islandRing: Number.isFinite(Number(source.islandRing)) ? Number(source.islandRing) : null,
      islandSpoke: Number.isFinite(Number(source.islandSpoke)) ? Number(source.islandSpoke) : null,

      region: source.region || null,
      regionName: source.regionName || null,
      featureSeat: Number.isFinite(Number(source.featureSeat)) ? Number(source.featureSeat) : null,
      categorySeat: Number.isFinite(Number(source.categorySeat)) ? Number(source.categorySeat) : null,
      featureRing: Number.isFinite(Number(source.featureRing)) ? Number(source.featureRing) : null,
      featureSpoke: Number.isFinite(Number(source.featureSpoke)) ? Number(source.featureSpoke) : null,

      peninsulaStrength: isPeninsula ? clamp01(source.peninsulaStrength) : 0,
      bayCarveStrength: isBay ? clamp01(source.bayCarveStrength) : 0,
      keyStrength: isKey ? clamp01(source.keyStrength) : 0,
      mainIslandStrength: isMainIsland ? clamp01(source.mainIslandStrength) : 0,
      islandStrength: isDetachedCandidate ? clamp01(source.islandStrength) : 0,

      direction: source.direction || null,
      rockyPrecedenceRank: Number.isFinite(Number(source.rockyPrecedenceRank)) ? Number(source.rockyPrecedenceRank) : 0,
      rockyMultiplier: clamp01(source.rockyMultiplier),
      heightMultiplier: clamp01(source.heightMultiplier),

      coast: clamp01(source.coast),
      shelf: clamp01(source.shelf),
      waterDepth: clamp01(source.waterDepth === undefined ? 1 : source.waterDepth),
      ridge: clamp01(source.ridge),
      upland: clamp01(source.upland),
      relief: clamp01(source.relief),
      lowland: clamp01(source.lowland),

      color: Array.isArray(source.color) ? source.color.slice(0, 3) : null,

      landformSeat: Number.isFinite(Number(source.landformSeat)) ? Number(source.landformSeat) : null,
      landformRing: Number.isFinite(Number(source.landformRing)) ? Number(source.landformRing) : null,
      landformSpoke: Number.isFinite(Number(source.landformSpoke)) ? Number(source.landformSpoke) : null,
      landformCategory: source.landformCategory || null,
      dominantLandform: source.dominantLandform || null,
      hillStrength: clamp01(source.hillStrength),
      mountainStrength: clamp01(source.mountainStrength),
      cliffStrength: clamp01(source.cliffStrength),
      valleyStrength: clamp01(source.valleyStrength),

      seatsPerGeneralRegion: SEATS_PER_REGION,
      generalRegionCount: GENERAL_REGION_COUNT,
      totalLatentFeatureSeats: TOTAL_LATENT_FEATURE_SEATS,
      latentFeatureSeatsAreNotVisibleIslandCount: true,
      visibleDetachedLandLimitedToKeysAndMainIslands: true,

      peninsulasAreAttached: true,
      baysAreNegativeCarves: true,
      keysAreLowIslandChains: true,
      mainIslandsAreDetachedBodies: true,

      beachExcludedFromIslands: true,
      beachesExcludedFromIslands: true,
      sandExcludedFromIslands: true,
      ownsMainTerrain: false,
      ownsElevationGeneration: false,
      ownsHydrology: false,
      ownsBeaches: false,
      ownsSand: false,
      ownsMaterials: false,
      ownsCanvas: false,
      ownsZoom: false,

      elevationPrepared: true,
      hydrologyPrepared: true,
      materialsPrepared: true,
      canvasPrepared: true,
      zoomHeld: true,

      sampleVectorPreserved: true,
      legacyVectorApiPreserved: true,
      standardSampleApiActive: true,

      surfaceScale: "planet",
      geometry: "256-island-coastal-feature-split",
      lattice: "16x16-categorized",
      f21ClaimedByIslands: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function sampleVector(vec) {
    const packet = parseInputToPacket(vec);
    return normalizeIslandSample(sampleVectorRaw(packet.vector), packet);
  }

  function sample(...args) {
    const packet = parseInputToPacket(...args);
    return normalizeIslandSample(sampleVectorRaw(packet.vector), packet);
  }

  function read(...args) {
    return sample(...args);
  }

  function get(...args) {
    return sample(...args);
  }

  function sampleIslandFeature(...args) {
    return sample(...args);
  }

  function getReceipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      standard: "256-island-coastal-feature-split-with-authority-bridge",
      authority: "island-engine-256-coastal-feature-consumption-bridge",

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,
      cycleOrder: "EAST_WEST_NORTH_SOUTH_CHECKPOINT_EAST",

      sampleVectorPreserved: true,
      legacyVectorApiPreserved: true,
      standardSampleApiActive: true,
      sampleMethodActive: true,
      readMethodActive: true,
      getMethodActive: true,
      sampleIslandFeatureMethodActive: true,

      coordinatePacketInputSupported: true,
      vectorInputSupported: true,
      lonLatInputSupported: true,
      uvInputSupported: true,
      positionalInputSupported: true,

      featureLaw: FEATURE_LAW,
      featureCategories: FEATURE_CATEGORIES.slice(),
      categoryBands: CATEGORY_BANDS,
      directionPrecedence: DIRECTION_PRECEDENCE,

      geometry: "16x16-categorized-256-state",
      lattice: {
        rings: RINGS,
        spokes: SPOKES,
        seatsPerGeneralRegion: SEATS_PER_REGION,
        generalRegionCount: GENERAL_REGION_COUNT,
        totalLatentFeatureSeats: TOTAL_LATENT_FEATURE_SEATS,
        latentFeatureSeatsAreNotVisibleIslandCount: true,
        featureCategories: FEATURE_CATEGORIES.slice(),
        seatsPerCategory: 64,
        renderRule:
          "Keys and main islands may render as detached land; peninsulas and bays return relationship metadata."
      },

      seatsPerGeneralRegion: SEATS_PER_REGION,
      generalRegionCount: GENERAL_REGION_COUNT,
      totalLatentFeatureSeats: TOTAL_LATENT_FEATURE_SEATS,
      latentFeatureSeatsAreNotVisibleIslandCount: true,

      visibleDetachedLandLimitedToKeysAndMainIslands: true,
      peninsulasAreAttached: true,
      baysAreNegativeCarves: true,
      keysAreLowIslandChains: true,
      mainIslandsAreDetachedBodies: true,

      beachesExcludedFromIslands: true,
      sandExcludedFromIslands: true,
      ownsMainTerrain: false,
      ownsElevationGeneration: false,
      ownsHydrology: false,
      ownsBeaches: false,
      ownsSand: false,
      ownsMaterials: false,
      ownsCanvas: false,
      ownsZoom: false,

      elevationPrepared: true,
      hydrologyPrepared: true,
      materialsPrepared: true,
      canvasPrepared: true,
      zoomHeld: true,

      f21ClaimedByIslands: false,
      visualPassClaimed: false,

      generalRegions: REGIONS.map((region) => ({
        id: region.id,
        name: region.name,
        seats: SEATS_PER_REGION,
        categories: FEATURE_CATEGORIES.slice(),
        seatsPerCategory: 64,
        chainBias: region.chainBias.slice(),
        bayBias: region.bayBias.slice()
      })),

      normalizedOutputFields: [
        "contract",
        "receipt",
        "authority",
        "featureCategory",
        "featureFamily",
        "parentCoastRelation",
        "coastalRelationOnly",
        "detachedIslandBody",
        "visibleIsland",
        "active",
        "land",
        "island",
        "featureId",
        "region",
        "regionName",
        "featureSeat",
        "categorySeat",
        "featureRing",
        "featureSpoke",
        "chainMembership",
        "visibleQualification",
        "visibleQualified",
        "peninsulaStrength",
        "bayCarveStrength",
        "keyStrength",
        "mainIslandStrength",
        "islandStrength",
        "coast",
        "shelf",
        "waterDepth",
        "ridge",
        "upland",
        "relief",
        "lowland",
        "hillStrength",
        "mountainStrength",
        "cliffStrength",
        "valleyStrength"
      ],

      owns: [
        "256 latent coastal/island seats per General Region",
        "standard authority bridge",
        "coordinate packet normalization",
        "peninsula relationship seats",
        "bay carve relationship seats",
        "key-chain island seats",
        "main island body seats",
        "feature classification",
        "chain qualification",
        "detached island visibility gating"
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
        "elevation generation",
        "hydrology",
        "materials",
        "canvas",
        "zoom",
        "generated images",
        "GraphicBox",
        "final visual pass"
      ],

      ticTacToeDynamicProtocol: TIC_TAC_TOE_DYNAMIC_PROTOCOL,
      systemicQuadAAttack: SYSTEMIC_QUAD_A_ATTACK,

      generatedImage: false,
      graphicBox: false,
      webGL: false
    });
  }

  function receipt() {
    return getReceipt();
  }

  function regions() {
    return REGIONS.slice();
  }

  function dispose() {
    if (root.HEARTH_ISLANDS && root.HEARTH_ISLANDS.contract === CONTRACT) {
      try {
        delete root.HEARTH_ISLANDS;
      } catch (_error) {
        root.HEARTH_ISLANDS = null;
      }
    }

    if (root.HEARTH && root.HEARTH.islands && root.HEARTH.islands.contract === CONTRACT) {
      try {
        delete root.HEARTH.islands;
      } catch (_error2) {
        root.HEARTH.islands = null;
      }
    }
  }

  const api = Object.freeze({
    receipt,
    getReceipt,

    contract: CONTRACT,
    receiptId: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,
    generation: "G3",
    standard: "256-island-coastal-feature-split-with-authority-bridge",
    authority: "island-engine-256-coastal-feature-consumption-bridge",

    featureLaw: FEATURE_LAW,
    featureCategories: FEATURE_CATEGORIES.slice(),
    categoryBands: CATEGORY_BANDS,
    directionPrecedence: DIRECTION_PRECEDENCE,

    sampleVector,
    sample,
    read,
    get,
    sampleIslandFeature,

    regions,

    sampleVectorPreserved: true,
    legacyVectorApiPreserved: true,
    standardSampleApiActive: true,
    sampleMethodActive: true,
    readMethodActive: true,
    getMethodActive: true,
    sampleIslandFeatureMethodActive: true,

    coordinatePacketInputSupported: true,
    vectorInputSupported: true,
    lonLatInputSupported: true,
    uvInputSupported: true,
    positionalInputSupported: true,

    seatsPerGeneralRegion: SEATS_PER_REGION,
    generalRegionCount: GENERAL_REGION_COUNT,
    totalLatentFeatureSeats: TOTAL_LATENT_FEATURE_SEATS,
    latentFeatureSeatsAreNotVisibleIslandCount: true,

    visibleDetachedLandLimitedToKeysAndMainIslands: true,
    peninsulasAreAttached: true,
    baysAreNegativeCarves: true,
    keysAreLowIslandChains: true,
    mainIslandsAreDetachedBodies: true,

    beachesExcludedFromIslands: true,
    sandExcludedFromIslands: true,
    ownsMainTerrain: false,
    ownsElevationGeneration: false,
    ownsHydrology: false,
    ownsBeaches: false,
    ownsSand: false,
    ownsMaterials: false,
    ownsCanvas: false,
    ownsZoom: false,

    elevationPrepared: true,
    hydrologyPrepared: true,
    materialsPrepared: true,
    canvasPrepared: true,
    zoomHeld: true,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,

    f21ClaimedByIslands: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  });

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.islands = api;
  root.HEARTH.islandFeatures = api;

  root.HEARTH_ISLANDS = api;
  root.HEARTH_ISLANDS_RECEIPT = getReceipt();
  root.HEARTH_ISLANDS_CONTRACT = CONTRACT;
  root.HEARTH_ISLANDS_AUTHORITY_BRIDGE = true;
  root.HEARTH_ISLANDS_SAMPLE_VECTOR_PRESERVED = true;
  root.HEARTH_ISLANDS_STANDARD_SAMPLE_API_ACTIVE = true;

  root.__HEARTH_ISLANDS_DISPOSE__ = dispose;

  if (doc && doc.documentElement) {
    const dataset = doc.documentElement.dataset;

    dataset.hearthIslandsLoaded = "true";
    dataset.hearthIslandsContract = CONTRACT;
    dataset.hearthIslandsReceipt = RECEIPT;
    dataset.hearthIslandsPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthIslandsFamilyContract = FAMILY_CONTRACT;
    dataset.hearthIslandsVersion = VERSION;
    dataset.hearthIslandsStandard = "256-island-coastal-feature-split-with-authority-bridge";
    dataset.hearthIslandsAuthority = "island-engine-256-coastal-feature-consumption-bridge";

    dataset.hearthIslandsNewsProtocolSynchronized = "true";
    dataset.hearthIslandsFibonacciAlignmentSynchronized = "true";
    dataset.hearthIslandsActiveFibonacciGate = "F13";
    dataset.hearthIslandsFutureFibonacciGate = "F21";
    dataset.hearthIslandsOneActiveGearAtATime = "true";

    dataset.hearthIslandsSampleVectorPreserved = "true";
    dataset.hearthIslandsLegacyVectorApiPreserved = "true";
    dataset.hearthIslandsStandardSampleApiActive = "true";
    dataset.hearthIslandsSampleMethodActive = "true";
    dataset.hearthIslandsReadMethodActive = "true";
    dataset.hearthIslandsGetMethodActive = "true";
    dataset.hearthIslandsSampleIslandFeatureMethodActive = "true";

    dataset.hearthIslandsCoordinatePacketInputSupported = "true";
    dataset.hearthIslandsVectorInputSupported = "true";
    dataset.hearthIslandsLonLatInputSupported = "true";
    dataset.hearthIslandsUvInputSupported = "true";
    dataset.hearthIslandsPositionalInputSupported = "true";

    dataset.hearthIslandsGeometry = "16x16-categorized-256-state";
    dataset.hearthIslandsRings = String(RINGS);
    dataset.hearthIslandsSpokes = String(SPOKES);
    dataset.hearthIslandsSeatsPerRegion = String(SEATS_PER_REGION);
    dataset.hearthIslandsGeneralRegionCount = String(GENERAL_REGION_COUNT);
    dataset.hearthIslandsTotalLatentFeatureSeats = String(TOTAL_LATENT_FEATURE_SEATS);
    dataset.hearthIslandsLatentFeatureSeatsAreNotVisibleIslandCount = "true";
    dataset.hearthIslandsFeatureCategories = "peninsulas,bays,keys,main-islands";
    dataset.hearthIslandsSeatsPerCategory = "64";
    dataset.hearthIslandsRenderRule = "keys-and-main-islands-render-peninsulas-and-bays-return-metadata";

    dataset.hearthIslandsVisibleDetachedLandLimitedToKeysAndMainIslands = "true";
    dataset.hearthIslandsPeninsulasAreAttached = "true";
    dataset.hearthIslandsBaysAreNegativeCarves = "true";
    dataset.hearthIslandsKeysAreLowIslandChains = "true";
    dataset.hearthIslandsMainIslandsAreDetachedBodies = "true";

    dataset.hearthIslandsBeachesExcluded = "true";
    dataset.hearthIslandsSandExcluded = "true";
    dataset.hearthIslandsDetachedFromTerrain = "true";
    dataset.hearthIslandsOwnsMainTerrain = "false";
    dataset.hearthIslandsOwnsElevationGeneration = "false";
    dataset.hearthIslandsOwnsHydrology = "false";
    dataset.hearthIslandsOwnsMaterials = "false";
    dataset.hearthIslandsOwnsCanvas = "false";
    dataset.hearthIslandsOwnsZoom = "false";

    dataset.hearthIslandsElevationPrepared = "true";
    dataset.hearthIslandsHydrologyPrepared = "true";
    dataset.hearthIslandsMaterialsPrepared = "true";
    dataset.hearthIslandsCanvasPrepared = "true";
    dataset.hearthIslandsZoomHeld = "true";

    dataset.hearthIslandsF21Claimed = "false";
    dataset.hearthIslandsGeneratedImage = "false";
    dataset.hearthIslandsGraphicBox = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
