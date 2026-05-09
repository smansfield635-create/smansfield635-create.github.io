// /assets/hearth/hearth.islands.js
// HEARTH_G3_256_ISLAND_COASTAL_FEATURE_SPLIT_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Preserve the 256-state island/coastal geometry.
// - Split the 256 seats into four feature categories:
//   1. peninsulas
//   2. bays
//   3. keys
//   4. main islands
// - Peninsulas attach to parent coastline; they are not detached islands.
// - Bays are negative carved-water/coastline cuts; they are not land.
// - Keys absorb small scattered fragments into intentional low island chains.
// - Main islands are larger detached island bodies.
// - Beaches/sand remain under beach authority.
// - Terrain remains parent authority.
// - No GraphicBox. No generated image. No active weather.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_256_ISLAND_COASTAL_FEATURE_SPLIT_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const VERSION = "2026-05-09.hearth-g3-256-island-coastal-feature-split";
  const RECEIPT = "HEARTH_G3_256_ISLAND_COASTAL_FEATURE_SPLIT_RECEIPT";

  const TAU = Math.PI * 2;
  const RINGS = 16;
  const SPOKES = 16;
  const SEATS_PER_REGION = RINGS * SPOKES;

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
    categorySplit: "4 feature categories x 64 seats = 256 feature seats",
    categories: FEATURE_CATEGORIES,
    rule:
      "Every seat is classified first. Only keys and main islands render as detached island land. Peninsulas and bays return coastal relationship metadata."
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

    const biases =
      category === "bay"
        ? region.bayBias
        : region.chainBias;

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
    if (category === "peninsula") {
      return 0.965 + ring * 0.018 + h * 0.006;
    }

    if (category === "bay") {
      return 1.035 + (ring - 4) * 0.020 + h * 0.006;
    }

    if (category === "key") {
      return 1.115 + (ring - 8) * 0.022 + h * 0.006;
    }

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

  function sampleVector(vec) {
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

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      standard: "256-island-coastal-feature-split",
      authority: "island-engine-256-coastal-feature-split",
      featureLaw: FEATURE_LAW,
      featureCategories: FEATURE_CATEGORIES,
      categoryBands: CATEGORY_BANDS,
      directionPrecedence: DIRECTION_PRECEDENCE,
      geometry: "16x16-categorized-256-state",
      lattice: {
        rings: RINGS,
        spokes: SPOKES,
        seatsPerGeneralRegion: SEATS_PER_REGION,
        totalLatentSeats: SEATS_PER_REGION * 4,
        featureCategories: FEATURE_CATEGORIES,
        seatsPerCategory: 64,
        renderRule:
          "keys and main islands may render as detached land; peninsulas and bays return relationship metadata"
      },
      generalRegions: REGIONS.map((region) => ({
        id: region.id,
        name: region.name,
        seats: SEATS_PER_REGION,
        categories: FEATURE_CATEGORIES,
        seatsPerCategory: 64,
        chainBias: region.chainBias,
        bayBias: region.bayBias
      })),
      owns: [
        "256 latent coastal/island seats per General Region",
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
    standard: "256-island-coastal-feature-split",
    authority: "island-engine-256-coastal-feature-split",
    featureLaw: FEATURE_LAW,
    featureCategories: FEATURE_CATEGORIES,
    categoryBands: CATEGORY_BANDS,
    directionPrecedence: DIRECTION_PRECEDENCE,
    sampleVector,
    regions: () => REGIONS.slice()
  });

  window.__HEARTH_ISLANDS_DISPOSE__ = dispose;

  document.documentElement.dataset.hearthIslandsLoaded = "true";
  document.documentElement.dataset.hearthIslandsContract = CONTRACT;
  document.documentElement.dataset.hearthIslandsFamilyContract = FAMILY_CONTRACT;
  document.documentElement.dataset.hearthIslandsVersion = VERSION;
  document.documentElement.dataset.hearthIslandsStandard = "256-island-coastal-feature-split";
  document.documentElement.dataset.hearthIslandsGeometry = "16x16-categorized-256-state";
  document.documentElement.dataset.hearthIslandsRings = String(RINGS);
  document.documentElement.dataset.hearthIslandsSpokes = String(SPOKES);
  document.documentElement.dataset.hearthIslandsSeatsPerRegion = String(SEATS_PER_REGION);
  document.documentElement.dataset.hearthIslandsTotalLatentSeats = String(SEATS_PER_REGION * 4);
  document.documentElement.dataset.hearthIslandsFeatureCategories = "peninsulas,bays,keys,main-islands";
  document.documentElement.dataset.hearthIslandsSeatsPerCategory = "64";
  document.documentElement.dataset.hearthIslandsRenderRule = "keys-and-main-islands-render-peninsulas-and-bays-return-metadata";
  document.documentElement.dataset.hearthIslandsBeachesExcluded = "true";
  document.documentElement.dataset.hearthIslandsSandExcluded = "true";
  document.documentElement.dataset.hearthIslandsDetachedFromTerrain = "true";
  document.documentElement.dataset.hearthIslandsGeneratedImage = "false";
  document.documentElement.dataset.hearthIslandsGraphicBox = "false";
})();
