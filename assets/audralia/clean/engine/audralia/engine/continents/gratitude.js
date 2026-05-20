// /assets/audralia/clean/engine/audralia/engine/continents/gratitude.js
// AUDRALIA_G2_6_GRATITUDE_HEX_PREFACE_ORGANIC_TOPOLOGY_CHILD_TNT_v1
// Full-file replacement.
// Purpose: renew Gratitude as a hex-prefaced organic topology child so the continent reads field-born, aged, pressure-shaped, and organic rather than manufactured/polygonal.
// Classic script. No imports. No exports. No direct drawing.
// Topology only: category, boundary, adjacency, surface relationship, water's edge, hex-preface origin, plateaus as surface zones, and future handoff markers.
// Does not own: parent geometry, canvas, FORM_VISIBLE, ocean body, seawater base, elevation, height maps, mountain systems, animals, plants, sky, motion, zoom, orbit, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_GRATITUDE_HEX_PREFACE_ORGANIC_TOPOLOGY_CHILD_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_6_GRATITUDE_FULL_TOPOLOGY_GROUND_BASIS_CHILD_TNT_v1";
  const CHILD_SPLIT_CONTRACT = "AUDRALIA_G2_6_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_TNT_v1";
  const PARENT_FACING_CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";
  const PARENT_COMPLIANCE_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";

  const TARGET = "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.js";
  const ROUTE = "/showroom/globe/audralia/";

  const CATEGORY = Object.freeze({
    LANDMASS: "LANDMASS",
    OCEAN_ADJACENCY: "OCEAN_ADJACENCY",
    BEACH: "BEACH",
    CLIFF_EDGE: "CLIFF_EDGE",
    CAVERN_MOUTH: "CAVERN_MOUTH",
    LAKE: "LAKE",
    BAY: "BAY",
    INLET: "INLET",
    PENINSULA: "PENINSULA",
    LAGOON: "LAGOON",
    WETLAND: "WETLAND",
    PLATEAU_SURFACE: "PLATEAU_SURFACE",
    REPAIR_EDGE: "REPAIR_EDGE",
    SHELTER_EDGE: "SHELTER_EDGE",
    MEMORY_WATER: "MEMORY_WATER",
    WATER_EDGE: "WATER_EDGE",
    ACCESS_EDGE: "ACCESS_EDGE",
    HARD_COAST: "HARD_COAST",
    SOFT_COAST: "SOFT_COAST",
    HEX_PREFACE: "HEX_PREFACE",
    FIELD_BORN_BOUNDARY: "FIELD_BORN_BOUNDARY",
    ORGANIC_TRACE: "ORGANIC_TRACE"
  });

  const DISTRICT = Object.freeze({
    WEST_ADVERSITY_EDGE: "WEST_ADVERSITY_EDGE",
    NORTH_CONTINUANCE_SHOULDER: "NORTH_CONTINUANCE_SHOULDER",
    EAST_REOPENING_COAST: "EAST_REOPENING_COAST",
    SOUTH_RESTORATION_BELT: "SOUTH_RESTORATION_BELT",
    INTERIOR_MEMORY_FIELD: "INTERIOR_MEMORY_FIELD",
    SHELTER_MOUTH_BELT: "SHELTER_MOUTH_BELT",
    OUTREACH_PENINSULAS: "OUTREACH_PENINSULAS",
    PLATEAU_SURFACE_FIELDS: "PLATEAU_SURFACE_FIELDS",
    REPAIRED_WATER_EDGE: "REPAIRED_WATER_EDGE",
    CONTINUANCE_ACCESS_BELT: "CONTINUANCE_ACCESS_BELT",
    SURVIVAL_CONTACT_RING: "SURVIVAL_CONTACT_RING",
    HEX_ORIGIN_FIELD: "HEX_ORIGIN_FIELD"
  });

  const STORY_FORCE = Object.freeze({
    ADVERSITY: "ADVERSITY",
    SURVIVAL: "SURVIVAL",
    GRATITUDE: "GRATITUDE",
    REPAIR: "REPAIR",
    REOPENING: "REOPENING",
    MEMORY: "MEMORY",
    SHELTER: "SHELTER",
    OUTREACH: "OUTREACH",
    STABILITY: "STABILITY",
    CONTINUANCE: "CONTINUANCE",
    FIELD_BIRTH: "FIELD_BIRTH"
  });

  const PROFILE = Object.freeze({
    WEST_JAGGED: "WEST_JAGGED",
    NORTH_ROUNDED: "NORTH_ROUNDED",
    EAST_CARVED: "EAST_CARVED",
    SOUTH_FEATHERED: "SOUTH_FEATHERED",
    SOUTHWEST_REPAIRED: "SOUTHWEST_REPAIRED",
    INTERIOR_ROUNDED: "INTERIOR_ROUNDED",
    SHELTER_MARKED: "SHELTER_MARKED"
  });

  const COLORS = Object.freeze({
    land: "rgba(56, 164, 104, 0.78)",
    repairedLand: "rgba(76, 181, 116, 0.74)",
    memoryWater: "rgba(66, 195, 224, 0.50)",
    lagoonWater: "rgba(106, 224, 224, 0.44)",
    wetlandEdge: "rgba(126, 190, 128, 0.52)",
    beachEdge: "rgba(242, 222, 148, 0.60)",
    hardCoast: "rgba(210, 210, 188, 0.58)",
    cavernMouth: "rgba(16, 20, 29, 0.78)",
    bayEdge: "rgba(116, 228, 240, 0.48)",
    inletEdge: "rgba(136, 238, 244, 0.52)",
    peninsulaEdge: "rgba(126, 212, 136, 0.48)",
    plateauMarker: "rgba(152, 192, 124, 0.30)"
  });

  const HEX = Object.freeze({
    centerLon: -48,
    centerLat: 4,
    lonSpacing: 7.2,
    latSpacing: 6.2,
    qSkew: 0.52,
    seed: 21613,
    activeCellCount: 21,
    prefaceVisible: false,
    hiddenFieldOnly: true,
    topologyOnly: true,
    terrainOwned: false,
    elevationOwned: false
  });

  function p(lon, lat) {
    return { lon: roundCoord(lon), lat: roundCoord(lat) };
  }

  function roundCoord(value) {
    return Math.round(Number(value) * 1000) / 1000;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function hashNumber(input) {
    const text = String(input);
    let hash = 2166136261;

    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    return Math.abs(hash >>> 0);
  }

  function wave(seed, index, scale = 1) {
    const h = hashNumber(`${seed}:${index}`);
    const a = Math.sin((h % 997) * 0.01745329251);
    const b = Math.cos((h % 613) * 0.03141592653);
    return ((a + b) / 2) * scale;
  }

  function axialToLonLat(q, r) {
    const lon = HEX.centerLon + (q + r * HEX.qSkew) * HEX.lonSpacing;
    const lat = HEX.centerLat + r * HEX.latSpacing;
    return p(lon, lat);
  }

  function createHexCell(spec) {
    const center = axialToLonLat(spec.q, spec.r);

    return {
      id: spec.id,
      q: spec.q,
      r: spec.r,
      center,
      district: spec.district,
      role: spec.role,
      storyForce: spec.storyForce,
      pressure: spec.pressure,
      boundaryBehavior: spec.boundaryBehavior,
      waterAdjacency: spec.waterAdjacency === true,
      smoothing: spec.smoothing,
      jaggedness: spec.jaggedness,
      futureTerrainReadable: spec.futureTerrainReadable === true,
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false
    };
  }

  const HEX_CELL_SPECS = Object.freeze([
    {
      id: "hex-core-00-memory",
      q: 0,
      r: 0,
      district: DISTRICT.INTERIOR_MEMORY_FIELD,
      role: "core_survival_mass",
      storyForce: STORY_FORCE.MEMORY,
      pressure: 0.34,
      boundaryBehavior: "rounded_interior",
      waterAdjacency: false,
      smoothing: 0.84,
      jaggedness: 0.08,
      futureTerrainReadable: true
    },
    {
      id: "hex-core-01-continuance",
      q: 0,
      r: 1,
      district: DISTRICT.NORTH_CONTINUANCE_SHOULDER,
      role: "north_continuance_mass",
      storyForce: STORY_FORCE.CONTINUANCE,
      pressure: 0.26,
      boundaryBehavior: "rounded_shoulder",
      waterAdjacency: true,
      smoothing: 0.9,
      jaggedness: 0.06,
      futureTerrainReadable: true
    },
    {
      id: "hex-core-02-memory-west",
      q: -1,
      r: 1,
      district: DISTRICT.INTERIOR_MEMORY_FIELD,
      role: "memory_support_mass",
      storyForce: STORY_FORCE.SURVIVAL,
      pressure: 0.42,
      boundaryBehavior: "stable_surface",
      waterAdjacency: false,
      smoothing: 0.7,
      jaggedness: 0.12,
      futureTerrainReadable: true
    },
    {
      id: "hex-core-03-memory-east",
      q: 1,
      r: 0,
      district: DISTRICT.INTERIOR_MEMORY_FIELD,
      role: "memory_support_mass",
      storyForce: STORY_FORCE.GRATITUDE,
      pressure: 0.28,
      boundaryBehavior: "stable_surface",
      waterAdjacency: false,
      smoothing: 0.78,
      jaggedness: 0.1,
      futureTerrainReadable: true
    },
    {
      id: "hex-core-04-south-repair",
      q: 0,
      r: -1,
      district: DISTRICT.SOUTH_RESTORATION_BELT,
      role: "restoration_underbody",
      storyForce: STORY_FORCE.REPAIR,
      pressure: 0.38,
      boundaryBehavior: "soft_feather",
      waterAdjacency: true,
      smoothing: 0.62,
      jaggedness: 0.18,
      futureTerrainReadable: true
    },
    {
      id: "hex-west-05-scar",
      q: -2,
      r: 1,
      district: DISTRICT.WEST_ADVERSITY_EDGE,
      role: "west_scar_plate",
      storyForce: STORY_FORCE.ADVERSITY,
      pressure: 0.92,
      boundaryBehavior: "jagged_hard_coast",
      waterAdjacency: true,
      smoothing: 0.22,
      jaggedness: 0.72,
      futureTerrainReadable: true
    },
    {
      id: "hex-west-06-shelter",
      q: -2,
      r: 0,
      district: DISTRICT.SHELTER_MOUTH_BELT,
      role: "shelter_mouth_support",
      storyForce: STORY_FORCE.SHELTER,
      pressure: 0.86,
      boundaryBehavior: "pocketed_hard_edge",
      waterAdjacency: true,
      smoothing: 0.18,
      jaggedness: 0.66,
      futureTerrainReadable: true
    },
    {
      id: "hex-west-07-lower-scar",
      q: -2,
      r: -1,
      district: DISTRICT.WEST_ADVERSITY_EDGE,
      role: "lower_west_scar",
      storyForce: STORY_FORCE.SURVIVAL,
      pressure: 0.82,
      boundaryBehavior: "compressed_scar",
      waterAdjacency: true,
      smoothing: 0.24,
      jaggedness: 0.62,
      futureTerrainReadable: true
    },
    {
      id: "hex-north-08-shoulder",
      q: -1,
      r: 2,
      district: DISTRICT.NORTH_CONTINUANCE_SHOULDER,
      role: "northwest_continuance_shoulder",
      storyForce: STORY_FORCE.CONTINUANCE,
      pressure: 0.24,
      boundaryBehavior: "broad_round",
      waterAdjacency: true,
      smoothing: 0.94,
      jaggedness: 0.05,
      futureTerrainReadable: true
    },
    {
      id: "hex-north-09-high-shoulder",
      q: 0,
      r: 2,
      district: DISTRICT.NORTH_CONTINUANCE_SHOULDER,
      role: "high_continuance_shoulder",
      storyForce: STORY_FORCE.GRATITUDE,
      pressure: 0.2,
      boundaryBehavior: "broad_round",
      waterAdjacency: true,
      smoothing: 0.96,
      jaggedness: 0.04,
      futureTerrainReadable: true
    },
    {
      id: "hex-north-10-outreach",
      q: 1,
      r: 1,
      district: DISTRICT.OUTREACH_PENINSULAS,
      role: "northeast_outreach",
      storyForce: STORY_FORCE.OUTREACH,
      pressure: 0.36,
      boundaryBehavior: "rounded_reach",
      waterAdjacency: true,
      smoothing: 0.72,
      jaggedness: 0.14,
      futureTerrainReadable: true
    },
    {
      id: "hex-east-11-reopening-mouth",
      q: 2,
      r: 0,
      district: DISTRICT.EAST_REOPENING_COAST,
      role: "east_reopening_mouth",
      storyForce: STORY_FORCE.REOPENING,
      pressure: 0.58,
      boundaryBehavior: "carved_bay",
      waterAdjacency: true,
      smoothing: 0.46,
      jaggedness: 0.3,
      futureTerrainReadable: true
    },
    {
      id: "hex-east-12-inlet",
      q: 2,
      r: -1,
      district: DISTRICT.EAST_REOPENING_COAST,
      role: "east_inlet_cut",
      storyForce: STORY_FORCE.REOPENING,
      pressure: 0.62,
      boundaryBehavior: "inlet_cut",
      waterAdjacency: true,
      smoothing: 0.34,
      jaggedness: 0.34,
      futureTerrainReadable: true
    },
    {
      id: "hex-east-13-southeast-repair",
      q: 1,
      r: -2,
      district: DISTRICT.SOUTH_RESTORATION_BELT,
      role: "southeast_repair_cell",
      storyForce: STORY_FORCE.REPAIR,
      pressure: 0.48,
      boundaryBehavior: "soft_repaired_edge",
      waterAdjacency: true,
      smoothing: 0.56,
      jaggedness: 0.22,
      futureTerrainReadable: true
    },
    {
      id: "hex-south-14-lagoon-anchor",
      q: 0,
      r: -2,
      district: DISTRICT.SOUTH_RESTORATION_BELT,
      role: "south_lagoon_anchor",
      storyForce: STORY_FORCE.REPAIR,
      pressure: 0.44,
      boundaryBehavior: "wetland_lagoon_edge",
      waterAdjacency: true,
      smoothing: 0.52,
      jaggedness: 0.2,
      futureTerrainReadable: true
    },
    {
      id: "hex-south-15-soft-belt",
      q: -1,
      r: -2,
      district: DISTRICT.SOUTH_RESTORATION_BELT,
      role: "south_soft_belt",
      storyForce: STORY_FORCE.GRATITUDE,
      pressure: 0.4,
      boundaryBehavior: "wetland_feather",
      waterAdjacency: true,
      smoothing: 0.58,
      jaggedness: 0.18,
      futureTerrainReadable: true
    },
    {
      id: "hex-southwest-16-repair-scar",
      q: -2,
      r: -2,
      district: DISTRICT.SOUTH_RESTORATION_BELT,
      role: "southwest_repair_scar",
      storyForce: STORY_FORCE.SURVIVAL,
      pressure: 0.68,
      boundaryBehavior: "repaired_hard_to_soft",
      waterAdjacency: true,
      smoothing: 0.36,
      jaggedness: 0.42,
      futureTerrainReadable: true
    },
    {
      id: "hex-outreach-17-east-reach",
      q: 3,
      r: -1,
      district: DISTRICT.OUTREACH_PENINSULAS,
      role: "east_survival_reach",
      storyForce: STORY_FORCE.OUTREACH,
      pressure: 0.5,
      boundaryBehavior: "restrained_peninsula",
      waterAdjacency: true,
      smoothing: 0.5,
      jaggedness: 0.22,
      futureTerrainReadable: true
    },
    {
      id: "hex-northwest-18-lip",
      q: -2,
      r: 2,
      district: DISTRICT.NORTH_CONTINUANCE_SHOULDER,
      role: "northwest_lip",
      storyForce: STORY_FORCE.CONTINUANCE,
      pressure: 0.34,
      boundaryBehavior: "rounded_to_scar_transition",
      waterAdjacency: true,
      smoothing: 0.62,
      jaggedness: 0.18,
      futureTerrainReadable: true
    },
    {
      id: "hex-memory-19-waterhold",
      q: -1,
      r: 0,
      district: DISTRICT.INTERIOR_MEMORY_FIELD,
      role: "interior_waterhold",
      storyForce: STORY_FORCE.MEMORY,
      pressure: 0.3,
      boundaryBehavior: "protected_memory_field",
      waterAdjacency: false,
      smoothing: 0.86,
      jaggedness: 0.06,
      futureTerrainReadable: true
    },
    {
      id: "hex-repaired-20-southeast-soft",
      q: 2,
      r: -2,
      district: DISTRICT.SOUTH_RESTORATION_BELT,
      role: "southeast_soft_repair",
      storyForce: STORY_FORCE.REPAIR,
      pressure: 0.46,
      boundaryBehavior: "softened_cut",
      waterAdjacency: true,
      smoothing: 0.5,
      jaggedness: 0.24,
      futureTerrainReadable: true
    }
  ]);

  const ACTIVE_HEX_CELLS = Object.freeze(HEX_CELL_SPECS.map(createHexCell));

  function sectionAnchor(lon, lat, pressure = 0.5) {
    return { lon, lat, pressure };
  }

  function interpolatePoint(a, b, t) {
    return {
      lon: a.lon + (b.lon - a.lon) * t,
      lat: a.lat + (b.lat - a.lat) * t,
      pressure: a.pressure + (b.pressure - a.pressure) * t
    };
  }

  function disturbPoint(base, a, b, t, profile, index) {
    const dx = b.lon - a.lon;
    const dy = b.lat - a.lat;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    let normalAmp = 0;
    let tangentAmp = 0;
    let harmonic = wave(`${profile}:normal:${HEX.seed}`, index, 1);

    if (profile === PROFILE.WEST_JAGGED) {
      normalAmp = 1.45 * base.pressure;
      tangentAmp = 0.48 * base.pressure;
      harmonic += Math.sin(index * 1.77) * 0.42;
      harmonic += Math.sign(Math.sin(index * 2.41)) * 0.34;
    } else if (profile === PROFILE.NORTH_ROUNDED) {
      normalAmp = 0.38 * base.pressure;
      tangentAmp = 0.16 * base.pressure;
      harmonic *= 0.45;
    } else if (profile === PROFILE.EAST_CARVED) {
      normalAmp = 1.0 * base.pressure;
      tangentAmp = 0.32 * base.pressure;
      harmonic += Math.sin(index * 1.19) * 0.28;
    } else if (profile === PROFILE.SOUTH_FEATHERED) {
      normalAmp = 0.86 * base.pressure;
      tangentAmp = 0.36 * base.pressure;
      harmonic += Math.sin(index * 0.84) * 0.26;
    } else if (profile === PROFILE.SOUTHWEST_REPAIRED) {
      normalAmp = 1.05 * base.pressure;
      tangentAmp = 0.38 * base.pressure;
      harmonic += Math.sin(index * 1.53) * 0.3;
    } else {
      normalAmp = 0.52 * base.pressure;
      tangentAmp = 0.18 * base.pressure;
    }

    const localSoftener = profile === PROFILE.NORTH_ROUNDED ? Math.sin(Math.PI * t) : 1;
    const normalOffset = harmonic * normalAmp * localSoftener;
    const tangentOffset = wave(`${profile}:tangent:${HEX.seed}`, index, tangentAmp) * localSoftener;

    return p(
      base.lon + nx * normalOffset + (dx / len) * tangentOffset,
      clamp(base.lat + ny * normalOffset + (dy / len) * tangentOffset, -44, 48)
    );
  }

  function buildOrganicBoundaryFromHexPreface() {
    const boundary = [];
    const ranges = {};

    function addSection(id, anchors, pointsPerSegment, profile) {
      const start = boundary.length;

      if (!boundary.length) {
        boundary.push(p(anchors[0].lon, anchors[0].lat));
      }

      for (let i = 0; i < anchors.length - 1; i += 1) {
        const a = anchors[i];
        const b = anchors[i + 1];

        for (let step = 1; step <= pointsPerSegment; step += 1) {
          const t = step / pointsPerSegment;
          const base = interpolatePoint(a, b, t);
          const index = boundary.length + step + i * pointsPerSegment;
          boundary.push(disturbPoint(base, a, b, t, profile, index));
        }
      }

      ranges[id] = {
        id,
        start,
        end: boundary.length - 1,
        profile,
        points: boundary.length - start
      };
    }

    addSection(
      "westAdversityEdge",
      [
        sectionAnchor(-83.8, -8.8, 0.82),
        sectionAnchor(-87.6, -3.8, 0.88),
        sectionAnchor(-84.3, 2.8, 0.94),
        sectionAnchor(-88.2, 8.4, 0.98),
        sectionAnchor(-84.7, 15.2, 0.9),
        sectionAnchor(-87.3, 22.4, 0.86),
        sectionAnchor(-79.6, 29.6, 0.74),
        sectionAnchor(-73.2, 35.8, 0.54)
      ],
      5,
      PROFILE.WEST_JAGGED
    );

    addSection(
      "northContinuanceShoulder",
      [
        sectionAnchor(-73.2, 35.8, 0.34),
        sectionAnchor(-65.4, 41.2, 0.26),
        sectionAnchor(-55.2, 44.5, 0.22),
        sectionAnchor(-43.8, 44.1, 0.2),
        sectionAnchor(-32.6, 40.7, 0.24),
        sectionAnchor(-23.1, 35.7, 0.28),
        sectionAnchor(-15.9, 28.4, 0.34)
      ],
      5,
      PROFILE.NORTH_ROUNDED
    );

    addSection(
      "eastReopeningCoast",
      [
        sectionAnchor(-15.9, 28.4, 0.44),
        sectionAnchor(-8.8, 20.6, 0.56),
        sectionAnchor(-13.8, 14.7, 0.62),
        sectionAnchor(-6.2, 8.2, 0.7),
        sectionAnchor(-13.4, 2.2, 0.66),
        sectionAnchor(-8.4, -4.8, 0.58),
        sectionAnchor(-16.8, -10.6, 0.52),
        sectionAnchor(-21.6, -17.4, 0.48)
      ],
      5,
      PROFILE.EAST_CARVED
    );

    addSection(
      "southRestorationBelt",
      [
        sectionAnchor(-21.6, -17.4, 0.46),
        sectionAnchor(-30.2, -22.2, 0.42),
        sectionAnchor(-38.6, -27.8, 0.38),
        sectionAnchor(-48.3, -30.8, 0.36),
        sectionAnchor(-57.4, -28.5, 0.4),
        sectionAnchor(-65.6, -33.2, 0.46),
        sectionAnchor(-72.4, -27.6, 0.52),
        sectionAnchor(-78.2, -22.2, 0.58)
      ],
      5,
      PROFILE.SOUTH_FEATHERED
    );

    addSection(
      "southwestRepairedScar",
      [
        sectionAnchor(-78.2, -22.2, 0.62),
        sectionAnchor(-72.5, -17.6, 0.68),
        sectionAnchor(-80.5, -13.8, 0.76),
        sectionAnchor(-83.8, -8.8, 0.82)
      ],
      5,
      PROFILE.SOUTHWEST_REPAIRED
    );

    return {
      boundary,
      ranges
    };
  }

  function organicRing(cx, cy, rx, ry, count, seed, profile) {
    const points = [];

    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      const hexPulse = Math.sin(angle * 6 + seed * 0.013) * 0.055;
      const oldWaterPulse = Math.sin(angle * 3 + seed * 0.029) * 0.08;
      const asymmetry = wave(`${profile}:ring:${seed}`, i, 0.06);
      const radiusFactor = 1 + hexPulse + oldWaterPulse + asymmetry;

      const localX = Math.cos(angle) * rx * radiusFactor;
      const localY = Math.sin(angle) * ry * (1 + oldWaterPulse * 0.6 + asymmetry * 0.3);

      const slant = Math.sin(angle + seed * 0.017) * 0.42;

      points.push(p(cx + localX + slant, cy + localY));
    }

    return Object.freeze(points);
  }

  const BOUNDARY_BUILD = buildOrganicBoundaryFromHexPreface();
  const PRIMARY_BOUNDARY = Object.freeze(BOUNDARY_BUILD.boundary);
  const RANGE = Object.freeze(BOUNDARY_BUILD.ranges);

  const MAIN_MEMORY_LAKE = organicRing(-47.8, 14.3, 8.8, 6.1, 24, 2101, "main-memory");
  const COMPANION_SURVIVAL_LAKE = organicRing(-60.1, -9.6, 6.9, 4.8, 20, 2102, "companion-survival");
  const NORTH_REFLECTION_POOL = organicRing(-35.9, 31.2, 3.8, 2.7, 14, 2103, "north-reflection");
  const SOUTH_RESTORATION_POOL = organicRing(-40.4, -22.7, 4.4, 3.0, 14, 2104, "south-restoration-pool");
  const SOUTH_RESTORATION_LAGOON = organicRing(-53.2, -27.1, 8.4, 3.2, 18, 2105, "south-lagoon");
  const EAST_REOPENING_LAGOON = organicRing(-13.5, 3.2, 4.4, 2.7, 14, 2106, "east-lagoon");

  function segment(id, name, category, start, end, district, storyFunction, meaning) {
    return {
      id,
      name,
      category,
      start,
      end,
      district,
      storyFunction,
      meaning,
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false
    };
  }

  function pointFeature(id, name, category, lon, lat, district, storyFunction, meaning) {
    return {
      id,
      name,
      category,
      lon,
      lat,
      district,
      storyFunction,
      meaning,
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false
    };
  }

  function ringFeature(id, name, category, boundary, district, storyFunction, meaning) {
    return {
      id,
      name,
      category,
      boundary,
      district,
      storyFunction,
      meaning,
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false
    };
  }

  function sectionStart(id, fallback = 0) {
    return RANGE[id] ? RANGE[id].start : fallback;
  }

  function sectionEnd(id, fallback = 0) {
    return RANGE[id] ? RANGE[id].end : fallback;
  }

  function sectionMid(id) {
    const range = RANGE[id];
    if (!range) return 0;
    return Math.floor((range.start + range.end) / 2);
  }

  const TOPOLOGY_DISTRICTS = Object.freeze([
    {
      id: DISTRICT.HEX_ORIGIN_FIELD,
      name: "Hex Origin Field",
      role: "hidden field preface",
      meaning: "The continent begins as a local hex topology field before it is converted into visible organic coastline.",
      storyForces: [STORY_FORCE.FIELD_BIRTH, STORY_FORCE.STABILITY],
      categoryClasses: [CATEGORY.HEX_PREFACE, CATEGORY.FIELD_BORN_BOUNDARY],
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visibleGrid: false
    },
    {
      id: DISTRICT.WEST_ADVERSITY_EDGE,
      name: "West Adversity Edge",
      role: "scarred hard shoreline category",
      meaning: "Where Gratitude absorbed the oldest pressure and carried the strongest jaggedness.",
      storyForces: [STORY_FORCE.ADVERSITY, STORY_FORCE.SURVIVAL],
      categoryClasses: [CATEGORY.CLIFF_EDGE, CATEGORY.CAVERN_MOUTH, CATEGORY.HARD_COAST, CATEGORY.SHELTER_EDGE],
      boundaryReference: "fieldBoundary.ranges.westAdversityEdge",
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "jagged but purposeful; no random sawtooth and no raised cliff geometry"
    },
    {
      id: DISTRICT.NORTH_CONTINUANCE_SHOULDER,
      name: "North Continuance Shoulder",
      role: "broad rounded accessible continuity zone",
      meaning: "Where the continent stayed open to light, contact, and movement after pressure.",
      storyForces: [STORY_FORCE.CONTINUANCE, STORY_FORCE.GRATITUDE],
      categoryClasses: [CATEGORY.BEACH, CATEGORY.PENINSULA, CATEGORY.ACCESS_EDGE, CATEGORY.SOFT_COAST],
      boundaryReference: "fieldBoundary.ranges.northContinuanceShoulder",
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "rounded old shoulder produced by stabilized hex mass"
    },
    {
      id: DISTRICT.EAST_REOPENING_COAST,
      name: "East Reopening Coast",
      role: "carved bay and inlet edge",
      meaning: "Where Gratitude reopened rather than sealing shut after fracture.",
      storyForces: [STORY_FORCE.REOPENING, STORY_FORCE.OUTREACH, STORY_FORCE.GRATITUDE],
      categoryClasses: [CATEGORY.BAY, CATEGORY.INLET, CATEGORY.BEACH, CATEGORY.PENINSULA, CATEGORY.CAVERN_MOUTH],
      boundaryReference: "fieldBoundary.ranges.eastReopeningCoast",
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "visible bay cuts, inlet mouths, and restrained outreach"
    },
    {
      id: DISTRICT.SOUTH_RESTORATION_BELT,
      name: "South Restoration Belt",
      role: "softened wetland and lagoon transition",
      meaning: "Where brokenness became survivable water-edge repair.",
      storyForces: [STORY_FORCE.REPAIR, STORY_FORCE.SURVIVAL, STORY_FORCE.GRATITUDE],
      categoryClasses: [CATEGORY.WETLAND, CATEGORY.LAGOON, CATEGORY.BAY, CATEGORY.BEACH, CATEGORY.REPAIR_EDGE],
      boundaryReference: "fieldBoundary.ranges.southRestorationBelt",
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "braided and repaired rather than jagged"
    },
    {
      id: DISTRICT.INTERIOR_MEMORY_FIELD,
      name: "Interior Memory Field",
      role: "rounded irregular memory-water field",
      meaning: "Where survival memory is preserved without becoming terrain basin logic.",
      storyForces: [STORY_FORCE.MEMORY, STORY_FORCE.SURVIVAL],
      categoryClasses: [CATEGORY.LAKE, CATEGORY.MEMORY_WATER, CATEGORY.PLATEAU_SURFACE],
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "lakes are rounder and irregular from hex-ring preface"
    },
    {
      id: DISTRICT.SHELTER_MOUTH_BELT,
      name: "Shelter-Mouth Belt",
      role: "small boundary refuge marks",
      meaning: "Where life withdrew during pressure and returned after stabilization.",
      storyForces: [STORY_FORCE.SHELTER, STORY_FORCE.SURVIVAL],
      categoryClasses: [CATEGORY.CAVERN_MOUTH, CATEGORY.SHELTER_EDGE, CATEGORY.HARD_COAST],
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "mouth points only; no cave interiors"
    },
    {
      id: DISTRICT.PLATEAU_SURFACE_FIELDS,
      name: "Plateau Surface Fields",
      role: "stable topology zones for later terrain handoff",
      meaning: "The ground has internal surface logic, but height is not defined here.",
      storyForces: [STORY_FORCE.STABILITY, STORY_FORCE.SURVIVAL],
      categoryClasses: [CATEGORY.PLATEAU_SURFACE],
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "data handoff only unless future orchestrator expands"
    }
  ]);

  const WATER_EDGE_REGISTRY = Object.freeze({
    beaches: [
      segment(
        "gratitude-beach-north-continuance-long-arc",
        "North Continuance Long Beach Arc",
        CATEGORY.BEACH,
        sectionStart("northContinuanceShoulder") + 2,
        sectionEnd("northContinuanceShoulder") - 3,
        DISTRICT.NORTH_CONTINUANCE_SHOULDER,
        STORY_FORCE.CONTINUANCE,
        "A rounded accessible edge produced by stabilized northern hex cells."
      ),
      segment(
        "gratitude-beach-east-reopening-access",
        "East Reopening Access Beach",
        CATEGORY.BEACH,
        sectionStart("eastReopeningCoast") + 3,
        sectionStart("eastReopeningCoast") + 12,
        DISTRICT.EAST_REOPENING_COAST,
        STORY_FORCE.REOPENING,
        "A beach class where fracture became access."
      ),
      segment(
        "gratitude-beach-south-restoration-soft-arc",
        "South Restoration Soft Beach Arc",
        CATEGORY.BEACH,
        sectionStart("southRestorationBelt") + 6,
        sectionEnd("southRestorationBelt") - 5,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.REPAIR,
        "A softened water edge that survived damage."
      )
    ],
    cliffEdges: [
      segment(
        "gratitude-hardcoast-west-pressure-scar",
        "West Pressure Scar Hard Coast",
        CATEGORY.CLIFF_EDGE,
        sectionStart("westAdversityEdge") + 1,
        sectionMid("westAdversityEdge") + 4,
        DISTRICT.WEST_ADVERSITY_EDGE,
        STORY_FORCE.ADVERSITY,
        "Hard shoreline category only; a scar line without raised geometry."
      ),
      segment(
        "gratitude-hardcoast-west-lower-survival",
        "Lower West Survival Hard Coast",
        CATEGORY.CLIFF_EDGE,
        sectionStart("southwestRepairedScar"),
        sectionEnd("southwestRepairedScar") - 2,
        DISTRICT.WEST_ADVERSITY_EDGE,
        STORY_FORCE.SURVIVAL,
        "The southwest transition where hard coast becomes repair."
      )
    ],
    cavernMouths: [
      pointFeature(
        "gratitude-cavern-west-pressure-mouth",
        "Western Pressure Shelter Mouth",
        CATEGORY.CAVERN_MOUTH,
        -83.2,
        7.4,
        DISTRICT.SHELTER_MOUTH_BELT,
        STORY_FORCE.SHELTER,
        "A boundary mouth mark where life withdrew during west-edge pressure."
      ),
      pointFeature(
        "gratitude-cavern-upper-west-scar-mouth",
        "Upper West Scar Shelter Mouth",
        CATEGORY.CAVERN_MOUTH,
        -79.4,
        24.7,
        DISTRICT.SHELTER_MOUTH_BELT,
        STORY_FORCE.SURVIVAL,
        "A small mouth mark near the scar-to-continuance transition."
      ),
      pointFeature(
        "gratitude-cavern-southwest-repair-mouth",
        "Southwest Repair Shelter Mouth",
        CATEGORY.CAVERN_MOUTH,
        -69.6,
        -25.2,
        DISTRICT.SHELTER_MOUTH_BELT,
        STORY_FORCE.REPAIR,
        "A shelter-mouth mark near the restored southern belt."
      ),
      pointFeature(
        "gratitude-cavern-east-reopening-mouth",
        "Eastern Reopening Shelter Mouth",
        CATEGORY.CAVERN_MOUTH,
        -12.4,
        3.8,
        DISTRICT.EAST_REOPENING_COAST,
        STORY_FORCE.REOPENING,
        "A boundary-mouth mark on the reopened coast."
      ),
      pointFeature(
        "gratitude-cavern-southeast-soft-mouth",
        "Southeast Soft Repair Shelter Mouth",
        CATEGORY.CAVERN_MOUTH,
        -23.4,
        -14.6,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.SHELTER,
        "A shelter-mouth mark between reopening and restoration."
      )
    ],
    lakes: [
      ringFeature(
        "gratitude-lake-main-memory-organic-ring",
        "Main Memory Lake Organic Ring",
        CATEGORY.LAKE,
        MAIN_MEMORY_LAKE,
        DISTRICT.INTERIOR_MEMORY_FIELD,
        STORY_FORCE.MEMORY,
        "A rounded but irregular memory-water boundary derived from hex-ring pulse."
      ),
      ringFeature(
        "gratitude-lake-companion-survival-organic-ring",
        "Companion Survival Lake Organic Ring",
        CATEGORY.LAKE,
        COMPANION_SURVIVAL_LAKE,
        DISTRICT.INTERIOR_MEMORY_FIELD,
        STORY_FORCE.SURVIVAL,
        "A secondary irregular memory-water boundary offset from the main lake."
      ),
      ringFeature(
        "gratitude-pool-north-reflection-organic-ring",
        "North Reflection Pool Organic Ring",
        CATEGORY.LAKE,
        NORTH_REFLECTION_POOL,
        DISTRICT.INTERIOR_MEMORY_FIELD,
        STORY_FORCE.GRATITUDE,
        "A small non-geometric reflection pool near the continuance shoulder."
      ),
      ringFeature(
        "gratitude-pool-south-restoration-organic-ring",
        "South Restoration Pool Organic Ring",
        CATEGORY.LAKE,
        SOUTH_RESTORATION_POOL,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.REPAIR,
        "A small irregular water boundary near the repaired south."
      )
    ],
    bays: [
      segment(
        "gratitude-bay-east-reopened-gulf-organic",
        "East Reopened Organic Bay",
        CATEGORY.BAY,
        sectionStart("eastReopeningCoast") + 8,
        sectionStart("eastReopeningCoast") + 22,
        DISTRICT.EAST_REOPENING_COAST,
        STORY_FORCE.REOPENING,
        "A carved bay section where the field opened rather than sealed."
      ),
      segment(
        "gratitude-bay-south-repair-water-pocket",
        "South Repair Water Pocket Bay",
        CATEGORY.BAY,
        sectionStart("southRestorationBelt") + 2,
        sectionStart("southRestorationBelt") + 14,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.REPAIR,
        "A repaired water-contact category inside the softened south."
      )
    ],
    inlets: [
      segment(
        "gratitude-inlet-east-narrow-organic-cut",
        "East Narrow Organic Inlet",
        CATEGORY.INLET,
        sectionStart("eastReopeningCoast") + 14,
        sectionStart("eastReopeningCoast") + 19,
        DISTRICT.EAST_REOPENING_COAST,
        STORY_FORCE.REOPENING,
        "A narrow inlet cut inside the reopened east coast."
      ),
      segment(
        "gratitude-inlet-southeast-restoration-cut",
        "Southeast Restoration Cut",
        CATEGORY.INLET,
        sectionEnd("eastReopeningCoast") - 6,
        sectionEnd("eastReopeningCoast"),
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.REPAIR,
        "A narrow access cut between reopening and restoration."
      ),
      segment(
        "gratitude-inlet-southwest-survival-channel",
        "Southwest Survival Channel",
        CATEGORY.INLET,
        sectionEnd("southRestorationBelt") - 7,
        sectionEnd("southRestorationBelt") - 1,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.SURVIVAL,
        "A retained cut in the repaired southwest edge."
      )
    ],
    peninsulas: [
      segment(
        "gratitude-peninsula-northwest-continuance-shoulder",
        "Northwest Continuance Shoulder",
        CATEGORY.PENINSULA,
        sectionEnd("westAdversityEdge") - 8,
        sectionStart("northContinuanceShoulder") + 7,
        DISTRICT.OUTREACH_PENINSULAS,
        STORY_FORCE.CONTINUANCE,
        "A surviving shoulder, rounded from the hex field rather than drawn as a spike."
      ),
      segment(
        "gratitude-peninsula-northeast-outreach-field-born",
        "Northeast Field-Born Outreach",
        CATEGORY.PENINSULA,
        sectionEnd("northContinuanceShoulder") - 9,
        sectionStart("eastReopeningCoast") + 5,
        DISTRICT.OUTREACH_PENINSULAS,
        STORY_FORCE.OUTREACH,
        "A restrained outward reach on the reopened side."
      ),
      segment(
        "gratitude-peninsula-east-survival-reach",
        "East Survival Reach",
        CATEGORY.PENINSULA,
        sectionStart("eastReopeningCoast") + 20,
        sectionStart("eastReopeningCoast") + 29,
        DISTRICT.OUTREACH_PENINSULAS,
        STORY_FORCE.GRATITUDE,
        "An asymmetrical reach formed from reopening pressure."
      )
    ],
    lagoons: [
      ringFeature(
        "gratitude-lagoon-south-restoration-organic-ring",
        "South Restoration Lagoon Organic Ring",
        CATEGORY.LAGOON,
        SOUTH_RESTORATION_LAGOON,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.REPAIR,
        "A protected organic lagoon inside the restoration belt."
      ),
      ringFeature(
        "gratitude-lagoon-east-reopening-organic-ring",
        "East Reopening Lagoon Organic Ring",
        CATEGORY.LAGOON,
        EAST_REOPENING_LAGOON,
        DISTRICT.EAST_REOPENING_COAST,
        STORY_FORCE.REOPENING,
        "A smaller lagoon near the carved eastern opening."
      )
    ],
    wetlands: [
      segment(
        "gratitude-wetland-south-feathered-belt",
        "South Feathered Wetland Belt",
        CATEGORY.WETLAND,
        sectionStart("southRestorationBelt") + 4,
        sectionEnd("southRestorationBelt") - 4,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.REPAIR,
        "The soft braided edge where restoration overtakes damage."
      ),
      segment(
        "gratitude-wetland-southeast-repaired-transition",
        "Southeast Repaired Wetland Transition",
        CATEGORY.WETLAND,
        sectionEnd("eastReopeningCoast") - 8,
        sectionStart("southRestorationBelt") + 8,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.GRATITUDE,
        "A transition between open east water and south repair."
      )
    ],
    oceanAdjacency: [
      {
        id: "gratitude-global-ocean-adjacency",
        name: "Gratitude Ocean Adjacency Ring",
        category: CATEGORY.OCEAN_ADJACENCY,
        meaning: "All exposed landmass boundary points contact the parent ocean body as adjacency only.",
        parentOceanOwned: true,
        childOceanOwned: false,
        topologyOnly: true,
        terrainOwned: false,
        elevationOwned: false
      }
    ]
  });

  function buildRenderTopologyFromRegistry() {
    return {
      oceanAdjacency: true,
      beaches: WATER_EDGE_REGISTRY.beaches.map((item) => ({
        start: item.start,
        end: item.end,
        label: item.name,
        id: item.id,
        district: item.district,
        storyFunction: item.storyFunction
      })),
      cliffEdges: WATER_EDGE_REGISTRY.cliffEdges.map((item) => ({
        start: item.start,
        end: item.end,
        label: item.name,
        id: item.id,
        district: item.district,
        storyFunction: item.storyFunction
      })),
      cavernMouths: WATER_EDGE_REGISTRY.cavernMouths.map((item) => ({
        lon: item.lon,
        lat: item.lat,
        label: item.name,
        id: item.id,
        district: item.district,
        storyFunction: item.storyFunction
      })),
      lakes: WATER_EDGE_REGISTRY.lakes.map((item) => item.boundary),
      bays: WATER_EDGE_REGISTRY.bays.map((item) => ({
        start: item.start,
        end: item.end,
        label: item.name,
        id: item.id,
        district: item.district,
        storyFunction: item.storyFunction
      })),
      inlets: WATER_EDGE_REGISTRY.inlets.map((item) => ({
        start: item.start,
        end: item.end,
        label: item.name,
        id: item.id,
        district: item.district,
        storyFunction: item.storyFunction
      })),
      peninsulas: WATER_EDGE_REGISTRY.peninsulas.map((item) => ({
        start: item.start,
        end: item.end,
        label: item.name,
        id: item.id,
        district: item.district,
        storyFunction: item.storyFunction
      })),
      lagoons: WATER_EDGE_REGISTRY.lagoons.map((item) => item.boundary),
      wetlands: WATER_EDGE_REGISTRY.wetlands.map((item) => ({
        start: item.start,
        end: item.end,
        label: item.name,
        id: item.id,
        district: item.district,
        storyFunction: item.storyFunction
      }))
    };
  }

  const SURFACE_CLASS_REGISTRY = Object.freeze({
    landmassClasses: [
      {
        id: "gratitude-primary-field-born-body",
        name: "Primary Field-Born Body",
        category: CATEGORY.LANDMASS,
        district: "WHOLE_CONTINENT",
        meaning: "The above-seawater exposed land boundary derived from hidden local hex-field pressure.",
        topologyOnly: true,
        terrainOwned: false,
        elevationOwned: false
      },
      {
        id: "gratitude-organic-water-edge",
        name: "Organic Water Edge",
        category: CATEGORY.ORGANIC_TRACE,
        district: "WHOLE_CONTINENT",
        meaning: "The coastline is produced from pressure-specific field behavior, not a manual polygon.",
        topologyOnly: true,
        terrainOwned: false,
        elevationOwned: false
      }
    ],
    plateauZones: [
      {
        id: "gratitude-central-memory-plateau-surface",
        name: "Central Memory Plateau Surface",
        category: CATEGORY.PLATEAU_SURFACE,
        district: DISTRICT.INTERIOR_MEMORY_FIELD,
        boundary: organicRing(-48.8, 9.1, 16.2, 12.6, 22, 3101, "central-plateau"),
        meaning: "Stable surface topology around the memory lakes; future terrain may read it, but no height exists here.",
        futureTerrainReadable: true,
        topologyOnly: true,
        terrainOwned: false,
        elevationOwned: false
      },
      {
        id: "gratitude-north-continuance-plateau-surface",
        name: "North Continuance Plateau Surface",
        category: CATEGORY.PLATEAU_SURFACE,
        district: DISTRICT.NORTH_CONTINUANCE_SHOULDER,
        boundary: organicRing(-49.4, 31.8, 21.8, 7.4, 18, 3102, "north-plateau"),
        meaning: "A stable northern surface field marking continuance and access; no elevation is defined.",
        futureTerrainReadable: true,
        topologyOnly: true,
        terrainOwned: false,
        elevationOwned: false
      },
      {
        id: "gratitude-west-endurance-plateau-surface",
        name: "West Endurance Plateau Surface",
        category: CATEGORY.PLATEAU_SURFACE,
        district: DISTRICT.WEST_ADVERSITY_EDGE,
        boundary: organicRing(-72.8, 7.8, 8.6, 16.2, 18, 3103, "west-plateau"),
        meaning: "A future-readable endurance surface near the scarred coast; still topology only.",
        futureTerrainReadable: true,
        topologyOnly: true,
        terrainOwned: false,
        elevationOwned: false
      },
      {
        id: "gratitude-east-reopening-table-surface",
        name: "East Reopening Table Surface",
        category: CATEGORY.PLATEAU_SURFACE,
        district: DISTRICT.EAST_REOPENING_COAST,
        boundary: organicRing(-22.1, 8.9, 9.8, 12.4, 18, 3104, "east-table"),
        meaning: "A future-readable surface zone beside the reopened coast; no table height is defined.",
        futureTerrainReadable: true,
        topologyOnly: true,
        terrainOwned: false,
        elevationOwned: false
      }
    ],
    transitionZones: [
      {
        id: "gratitude-west-hard-to-north-round-transition",
        name: "West Hard-to-North Round Transition",
        category: CATEGORY.WATER_EDGE,
        fromDistrict: DISTRICT.WEST_ADVERSITY_EDGE,
        toDistrict: DISTRICT.NORTH_CONTINUANCE_SHOULDER,
        meaning: "Where scarred hex pressure gives way to rounded continuance."
      },
      {
        id: "gratitude-east-carved-to-south-feather-transition",
        name: "East Carved-to-South Feather Transition",
        category: CATEGORY.WATER_EDGE,
        fromDistrict: DISTRICT.EAST_REOPENING_COAST,
        toDistrict: DISTRICT.SOUTH_RESTORATION_BELT,
        meaning: "Where reopening becomes restoration."
      },
      {
        id: "gratitude-south-soft-to-west-scar-transition",
        name: "South Soft-to-West Scar Transition",
        category: CATEGORY.WATER_EDGE,
        fromDistrict: DISTRICT.SOUTH_RESTORATION_BELT,
        toDistrict: DISTRICT.WEST_ADVERSITY_EDGE,
        meaning: "Where restoration meets older survival pressure."
      }
    ]
  });

  const STORY_TO_TOPOLOGY_MAP = Object.freeze([
    {
      storyForce: STORY_FORCE.FIELD_BIRTH,
      topologyStructures: [
        "hexPreface.activeHexCells",
        "gratitude-primary-field-born-body",
        "fieldBoundary.ranges"
      ],
      meaning: "The continent begins as a hex-derived topology field, not as a drawn polygon."
    },
    {
      storyForce: STORY_FORCE.ADVERSITY,
      topologyStructures: [
        "gratitude-hardcoast-west-pressure-scar",
        "gratitude-hardcoast-west-lower-survival",
        "gratitude-cavern-west-pressure-mouth",
        "gratitude-west-endurance-plateau-surface"
      ],
      meaning: "Adversity becomes hard, scarred west boundary categories, not height."
    },
    {
      storyForce: STORY_FORCE.SURVIVAL,
      topologyStructures: [
        "gratitude-lake-companion-survival-organic-ring",
        "gratitude-inlet-southwest-survival-channel",
        "gratitude-cavern-southwest-repair-mouth"
      ],
      meaning: "Survival becomes protected water and retained access cuts."
    },
    {
      storyForce: STORY_FORCE.GRATITUDE,
      topologyStructures: [
        "gratitude-beach-north-continuance-long-arc",
        "gratitude-beach-east-reopening-access",
        "gratitude-peninsula-east-survival-reach",
        "gratitude-pool-north-reflection-organic-ring"
      ],
      meaning: "Gratitude becomes continued access after pressure."
    },
    {
      storyForce: STORY_FORCE.REPAIR,
      topologyStructures: [
        "gratitude-lagoon-south-restoration-organic-ring",
        "gratitude-wetland-south-feathered-belt",
        "gratitude-beach-south-restoration-soft-arc",
        "gratitude-bay-south-repair-water-pocket"
      ],
      meaning: "Repair becomes wetlands, lagoons, and softened edge logic."
    },
    {
      storyForce: STORY_FORCE.REOPENING,
      topologyStructures: [
        "gratitude-bay-east-reopened-gulf-organic",
        "gratitude-inlet-east-narrow-organic-cut",
        "gratitude-lagoon-east-reopening-organic-ring",
        "gratitude-east-reopening-table-surface"
      ],
      meaning: "Reopening becomes carved bays, inlets, and access-bearing eastern topology."
    },
    {
      storyForce: STORY_FORCE.MEMORY,
      topologyStructures: [
        "gratitude-lake-main-memory-organic-ring",
        "gratitude-lake-companion-survival-organic-ring",
        "gratitude-pool-north-reflection-organic-ring",
        "gratitude-pool-south-restoration-organic-ring",
        "gratitude-central-memory-plateau-surface"
      ],
      meaning: "Memory becomes rounded irregular inland water boundaries and stable surface zones."
    },
    {
      storyForce: STORY_FORCE.SHELTER,
      topologyStructures: [
        "gratitude-cavern-west-pressure-mouth",
        "gratitude-cavern-upper-west-scar-mouth",
        "gratitude-cavern-southwest-repair-mouth",
        "gratitude-cavern-east-reopening-mouth",
        "gratitude-cavern-southeast-soft-mouth"
      ],
      meaning: "Shelter becomes boundary-mouth marks only, not cave interiors."
    },
    {
      storyForce: STORY_FORCE.STABILITY,
      topologyStructures: [
        "gratitude-central-memory-plateau-surface",
        "gratitude-north-continuance-plateau-surface",
        "gratitude-west-endurance-plateau-surface",
        "gratitude-east-reopening-table-surface"
      ],
      meaning: "Stability becomes future-readable plateau surface zones without height."
    }
  ]);

  const FUTURE_HANDOFFS = Object.freeze({
    terrain: {
      mayRead: [
        "hexPreface.activeHexCells",
        "surfaceClassRegistry.plateauZones",
        "waterEdgeRegistry.cliffEdges",
        "districts.WEST_ADVERSITY_EDGE",
        "districts.PLATEAU_SURFACE_FIELDS",
        "surfaceClassRegistry.transitionZones"
      ],
      mayNotAssume: [
        "height values",
        "mountain systems",
        "slope",
        "vertical relief",
        "raised cliffs"
      ],
      currentLayerOwnsTerrain: false,
      currentLayerOwnsElevation: false
    },
    hydration: {
      mayRead: [
        "waterEdgeRegistry.lakes",
        "waterEdgeRegistry.lagoons",
        "waterEdgeRegistry.wetlands",
        "waterEdgeRegistry.bays",
        "waterEdgeRegistry.inlets",
        "waterEdgeRegistry.oceanAdjacency"
      ],
      mayNotAssume: [
        "water physics",
        "hydrology simulation",
        "basin depth",
        "flow volume"
      ],
      currentLayerOwnsHydrologySimulation: false
    },
    ecology: {
      mayRead: [
        "waterEdgeRegistry.beaches",
        "waterEdgeRegistry.wetlands",
        "waterEdgeRegistry.lakes",
        "waterEdgeRegistry.lagoons",
        "waterEdgeRegistry.cavernMouths"
      ],
      mayNotAssume: [
        "plants",
        "animals",
        "species",
        "biomes",
        "climate"
      ],
      currentLayerOwnsEcology: false
    },
    story: {
      mayRead: [
        "storyTopologyMap",
        "districts",
        "hexPreface",
        "waterEdgeRegistry.cavernMouths",
        "waterEdgeRegistry.peninsulas",
        "waterEdgeRegistry.lakes",
        "historyMap"
      ],
      mayNotAssume: [
        "settlements",
        "people",
        "buildings",
        "roads",
        "civilization"
      ],
      currentLayerOwnsCivilization: false
    },
    renderer: {
      currentlyConsumedByOrchestrator: [
        "landmasses[].boundary",
        "landmasses[].topology.beaches",
        "landmasses[].topology.cliffEdges",
        "landmasses[].topology.cavernMouths",
        "landmasses[].topology.lakes",
        "landmasses[].topology.bays",
        "landmasses[].topology.inlets",
        "landmasses[].topology.peninsulas",
        "landmasses[].topology.lagoons",
        "landmasses[].topology.wetlands",
        "color"
      ],
      notCurrentlyRenderedUnlessOrchestratorExpands: [
        "districts",
        "hexPreface",
        "surfaceClassRegistry.plateauZones",
        "storyTopologyMap",
        "futureHandoffs"
      ]
    }
  });

  const CATEGORY_MEANINGS = Object.freeze({
    LANDMASS: "above-seawater exposed land boundary",
    OCEAN_ADJACENCY: "where parent seawater contacts Gratitude's boundary",
    BEACH: "soft land/ocean transition category",
    CLIFF_EDGE: "hard shoreline category only; not vertical height",
    CAVERN_MOUTH: "shelter/opening category only; not a 3D cave",
    LAKE: "inland water boundary only; not a basin or hydrology simulation",
    BAY: "recessed ocean-contact category",
    INLET: "narrow ocean-entry category",
    PENINSULA: "outreach land extension category",
    LAGOON: "protected water boundary near restored coast",
    WETLAND: "soft land-water transition category",
    PLATEAU_SURFACE: "stable surface/topology zone for later terrain handoff; not height",
    REPAIR_EDGE: "boundary class where damage became survivable access",
    SHELTER_EDGE: "boundary class associated with temporary refuge",
    WATER_EDGE: "generic land-water contact category",
    ACCESS_EDGE: "shoreline category where contact remains open",
    HARD_COAST: "hard water-edge category; no vertical geometry",
    SOFT_COAST: "soft water-edge transition category",
    HEX_PREFACE: "hidden hex-field origin grammar, not visible grid",
    FIELD_BORN_BOUNDARY: "boundary derived from local cell-field pressure",
    ORGANIC_TRACE: "aged coastline trace produced by district-specific pressure"
  });

  const HISTORY_MAP = Object.freeze({
    hexOrigin: {
      name: "Hex Preface Origin",
      district: DISTRICT.HEX_ORIGIN_FIELD,
      meaning: "The continent begins as a field, not as a manufactured polygon.",
      topologyClasses: [CATEGORY.HEX_PREFACE, CATEGORY.FIELD_BORN_BOUNDARY],
      visibleGrid: false,
      terrainOwned: false,
      elevationOwned: false
    },
    westCoast: {
      name: "Adversity Edge",
      district: DISTRICT.WEST_ADVERSITY_EDGE,
      meaning: "The coast that absorbed the oldest pressure.",
      topologyClasses: [CATEGORY.CLIFF_EDGE, CATEGORY.CAVERN_MOUTH, CATEGORY.HARD_COAST],
      visualGoal: "scarred, hard, intact, jagged only where pressure demands it",
      terrainOwned: false,
      elevationOwned: false
    },
    northCoast: {
      name: "Continuance Edge",
      district: DISTRICT.NORTH_CONTINUANCE_SHOULDER,
      meaning: "The shoulder that remained open to light and movement after pressure.",
      topologyClasses: [CATEGORY.BEACH, CATEGORY.PENINSULA, CATEGORY.ACCESS_EDGE],
      visualGoal: "broad, accessible, rounded, old",
      terrainOwned: false,
      elevationOwned: false
    },
    eastCoast: {
      name: "Reopening Edge",
      district: DISTRICT.EAST_REOPENING_COAST,
      meaning: "The broken side that became access instead of closure.",
      topologyClasses: [CATEGORY.BEACH, CATEGORY.BAY, CATEGORY.INLET, CATEGORY.CAVERN_MOUTH, CATEGORY.PENINSULA],
      visualGoal: "open, indented, carved by access",
      terrainOwned: false,
      elevationOwned: false
    },
    southCoast: {
      name: "Restoration Edge",
      district: DISTRICT.SOUTH_RESTORATION_BELT,
      meaning: "The boundary where loss became survivable.",
      topologyClasses: [CATEGORY.BEACH, CATEGORY.BAY, CATEGORY.INLET, CATEGORY.LAGOON, CATEGORY.WETLAND],
      visualGoal: "softened, restored, water-rich, feathered",
      terrainOwned: false,
      elevationOwned: false
    },
    interior: {
      name: "Memory Field",
      district: DISTRICT.INTERIOR_MEMORY_FIELD,
      meaning: "Protected inland water boundaries that preserve memory without becoming terrain basins.",
      topologyClasses: [CATEGORY.LAKE, CATEGORY.PLATEAU_SURFACE, CATEGORY.MEMORY_WATER],
      visualGoal: "rounded irregular water and stable surface zones",
      terrainOwned: false,
      elevationOwned: false
    }
  });

  const GOVERNING_LAW = Object.freeze({
    short: "Gratitude does not deny adversity; Gratitude remains open after adversity.",
    clauses: [
      "Gratitude is not comfort.",
      "Gratitude is survival without closure.",
      "Gratitude is field-born, not manufactured.",
      "Gratitude preserves memory without becoming trapped by memory.",
      "Gratitude protects life without closing itself off from the world.",
      "Gratitude reaches outward after surviving inward pressure.",
      "Gratitude holds scars as boundary memory, not as collapse.",
      "Gratitude receives existence as a gift after pressure."
    ]
  });

  const BACKSTORY = [
    "Gratitude is the first surviving continent of Audralia's exposed-land cycle.",
    "It does not begin as a hand-drawn coastline. It begins as a hidden local hex-field where survival cells, scar cells, repair cells, water-edge cells, and memory cells gathered into one landmass.",
    "The western field absorbed the oldest hard contact and became jagged only where pressure required a scar.",
    "The northern field stabilized into a broad old shoulder that stayed open to light and movement.",
    "The eastern field fractured into access, forming bay cuts and inlet mouths instead of permanent closure.",
    "The southern field softened into restoration through wetland, lagoon, and repaired water-edge logic.",
    "The interior holds rounded but irregular water boundaries that preserve memory without becoming terrain basins.",
    "The continent is therefore aged mass: round where continuity settled, jagged where adversity struck, open where reopening occurred, and soft where restoration healed.",
    "This file remains topology only. It defines the ground basis, not elevation, mountains, animals, plants, sky, or hydrology simulation."
  ].join(" ");

  const HEX_PREFACE = Object.freeze({
    id: "gratitude-hidden-hex-preface",
    category: CATEGORY.HEX_PREFACE,
    model: "axial-local-field",
    visibleGrid: false,
    hiddenFieldOnly: true,
    constants: HEX,
    activeHexCells: ACTIVE_HEX_CELLS,
    activeCellCount: ACTIVE_HEX_CELLS.length,
    expectedCellCount: 21,
    boundaryExtraction: {
      method: "hex-field-pressure-to-organic-boundary",
      trace: "sectioned coastline generated from hex pressure regions",
      outputBoundaryNodeCount: PRIMARY_BOUNDARY.length,
      ranges: RANGE,
      rule: "round where cells stabilized, jag where pressure scarred, carve where water reopened, feather where restoration softened"
    },
    pressureRules: {
      west: {
        profile: PROFILE.WEST_JAGGED,
        district: DISTRICT.WEST_ADVERSITY_EDGE,
        behavior: "compressed scarred hard edge",
        organicRule: "jagged only along adversity pressure; no uniform sawtooth"
      },
      north: {
        profile: PROFILE.NORTH_ROUNDED,
        district: DISTRICT.NORTH_CONTINUANCE_SHOULDER,
        behavior: "broad old rounded shoulder",
        organicRule: "smooth large curves, low micro-variation"
      },
      east: {
        profile: PROFILE.EAST_CARVED,
        district: DISTRICT.EAST_REOPENING_COAST,
        behavior: "bay and inlet cuts",
        organicRule: "carved but not shattered"
      },
      south: {
        profile: PROFILE.SOUTH_FEATHERED,
        district: DISTRICT.SOUTH_RESTORATION_BELT,
        behavior: "wetland and lagoon feathering",
        organicRule: "soft variation, repaired transitions"
      },
      interior: {
        profile: PROFILE.INTERIOR_ROUNDED,
        district: DISTRICT.INTERIOR_MEMORY_FIELD,
        behavior: "rounded irregular lake rings",
        organicRule: "no regular geometric decals"
      }
    },
    topologyOnly: true,
    terrainOwned: false,
    elevationOwned: false
  });

  const LANDMASSES = Object.freeze([
    {
      id: "gratitude-primary-hex-preface-organic-body",
      type: "primary",
      cells: 21,
      oceanAdjacency: true,
      boundary: PRIMARY_BOUNDARY,
      topology: buildRenderTopologyFromRegistry(),
      subBoundaries: {
        westAdversityEdge: PRIMARY_BOUNDARY.slice(sectionStart("westAdversityEdge"), sectionEnd("westAdversityEdge") + 1),
        northContinuanceShoulder: PRIMARY_BOUNDARY.slice(sectionStart("northContinuanceShoulder"), sectionEnd("northContinuanceShoulder") + 1),
        eastReopeningCoast: PRIMARY_BOUNDARY.slice(sectionStart("eastReopeningCoast"), sectionEnd("eastReopeningCoast") + 1),
        southRestorationBelt: PRIMARY_BOUNDARY.slice(sectionStart("southRestorationBelt"), sectionEnd("southRestorationBelt") + 1),
        southwestRepairedScar: PRIMARY_BOUNDARY.slice(sectionStart("southwestRepairedScar"), sectionEnd("southwestRepairedScar") + 1)
      },
      hexCellSource: {
        model: "hidden-hex-preface",
        activeCells: ACTIVE_HEX_CELLS.map((cell) => cell.id),
        outputBoundaryNodeCount: PRIMARY_BOUNDARY.length,
        ranges: RANGE,
        visibleGrid: false,
        topologyOnly: true,
        terrainOwned: false,
        elevationOwned: false
      }
    }
  ]);

  const TOPOLOGY = Object.freeze({
    id: "gratitude-hex-preface-organic-topology",
    summit: "Gratitude",
    name: "Gratitude",
    cells: 21,
    className: "primary",
    localLattice: "gratitude_21_hex_preface_organic_topology_lattice",
    governingLaw: GOVERNING_LAW,
    backstory: BACKSTORY,
    topologyOnly: true,
    terrainOwned: false,
    elevationOwned: false,
    directDrawing: false,
    oceanOwned: false,
    color: COLORS.land,
    colors: COLORS,
    landmasses: LANDMASSES,
    districts: TOPOLOGY_DISTRICTS,
    hexPreface: HEX_PREFACE,
    waterEdgeRegistry: WATER_EDGE_REGISTRY,
    surfaceClassRegistry: SURFACE_CLASS_REGISTRY,
    storyTopologyMap: STORY_TO_TOPOLOGY_MAP,
    futureHandoffs: FUTURE_HANDOFFS,
    categoryMeanings: CATEGORY_MEANINGS,
    historyMap: HISTORY_MAP,
    visualLeverage: {
      previousRead: "manufactured polygon",
      correction: "hidden hex-preface organic boundary",
      boundaryNodeCount: PRIMARY_BOUNDARY.length,
      activeHexCellCount: ACTIVE_HEX_CELLS.length,
      visibleHexGrid: false,
      westSideHarder: true,
      northSideRounded: true,
      eastSideOpened: true,
      southSideSoftened: true,
      lakesRoundedButIrregular: true,
      lagoonsOrganic: true,
      wetlandsFeathered: true,
      consumedByCurrentOrchestrator: [
        "boundary",
        "beaches",
        "cliffEdges",
        "cavernMouths",
        "lakes",
        "bays",
        "inlets",
        "peninsulas",
        "lagoons",
        "wetlands",
        "color"
      ],
      note: "If this still reads mechanical, the next issue is renderer smoothing or segment drawing in continents.js, not the Gratitude source data."
    },
    noFalseClaims: {
      visualPassClaim: false,
      terrainPass: false,
      elevationPass: false,
      mountainPass: false,
      ecologyPass: false,
      materialPass: false,
      hydrationPass: false
    }
  });

  function hasWindow() {
    return typeof window !== "undefined";
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function countRegistryItems(registry) {
    return Object.keys(registry).reduce((total, key) => {
      const value = registry[key];
      return total + (Array.isArray(value) ? value.length : 0);
    }, 0);
  }

  function getTopology() {
    return clone(TOPOLOGY);
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      childSplitContract: CHILD_SPLIT_CONTRACT,
      parentFacingContract: PARENT_FACING_CONTRACT,
      parentComplianceContract: PARENT_COMPLIANCE_CONTRACT,
      target: TARGET,
      route: ROUTE,

      id: TOPOLOGY.id,
      name: TOPOLOGY.name,
      summit: TOPOLOGY.summit,
      cells: TOPOLOGY.cells,
      className: TOPOLOGY.className,
      localLattice: TOPOLOGY.localLattice,

      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      directDrawing: false,
      oceanOwned: false,
      formVisibleClaim: false,

      hexPrefaceOrganicTopologyActive: true,
      visibleHexGrid: false,
      hiddenHexFieldOnly: true,
      manufacturedPolygonReplaced: true,
      fullTopologyGroundBasisActive: true,
      adversitySurvivalHistoryActive: true,
      firstSurvivingContinent: true,

      boundaryNodeCount: PRIMARY_BOUNDARY.length,
      activeHexCellCount: ACTIVE_HEX_CELLS.length,
      expectedHexCellCount: 21,
      landmassCount: LANDMASSES.length,
      districtCount: TOPOLOGY_DISTRICTS.length,
      registryItemCount: countRegistryItems(WATER_EDGE_REGISTRY),
      plateauSurfaceZoneCount: SURFACE_CLASS_REGISTRY.plateauZones.length,
      storyTopologyMapCount: STORY_TO_TOPOLOGY_MAP.length,

      westCoastAdversityEdge: true,
      northCoastContinuanceEdge: true,
      eastCoastReopeningEdge: true,
      southCoastRestorationEdge: true,
      interiorMemoryField: true,
      shelterMouthBelt: true,
      plateauSurfaceFields: true,

      governingLaw: clone(GOVERNING_LAW),
      categoryMeanings: clone(CATEGORY_MEANINGS),
      historyMap: clone(HISTORY_MAP),
      hexPreface: clone(HEX_PREFACE),
      futureHandoffs: clone(FUTURE_HANDOFFS),

      currentRendererConsumes: clone(TOPOLOGY.visualLeverage.consumedByCurrentOrchestrator),

      owns: [
        "Gratitude hidden hex-preface",
        "organic field-born boundary",
        "adversity-survival backstory",
        "exposed landmass boundary",
        "sub-boundary frames",
        "topology districts",
        "ocean adjacency classification",
        "beach registry",
        "hard coast / cliff-edge category registry",
        "cavern-mouth / shelter-mouth category registry",
        "lake boundary registry",
        "bay registry",
        "inlet registry",
        "peninsula registry",
        "lagoon boundary registry",
        "wetland category registry",
        "plateau surface zone registry as topology only",
        "story-to-topology map",
        "future handoff markers"
      ],

      doesNotOwn: [
        "canvas",
        "FORM_VISIBLE",
        "parent projection",
        "ocean body",
        "seawater base",
        "height maps",
        "vertical relief",
        "raised cliffs",
        "3D caverns",
        "hydrology simulation",
        "ecology",
        "animals",
        "plants",
        "sky",
        "motion",
        "zoom",
        "orbit"
      ],

      visualPassClaim: false,
      generatedImage: false,
      graphicBox: false
    };
  }

  function getDistricts() {
    return clone(TOPOLOGY_DISTRICTS);
  }

  function getWaterEdgeRegistry() {
    return clone(WATER_EDGE_REGISTRY);
  }

  function getSurfaceClassRegistry() {
    return clone(SURFACE_CLASS_REGISTRY);
  }

  function getStoryTopologyMap() {
    return clone(STORY_TO_TOPOLOGY_MAP);
  }

  function getFutureHandoffs() {
    return clone(FUTURE_HANDOFFS);
  }

  function getHexPreface() {
    return clone(HEX_PREFACE);
  }

  const api = {
    CONTRACT,
    PREVIOUS_CONTRACT,
    CHILD_SPLIT_CONTRACT,
    PARENT_FACING_CONTRACT,
    PARENT_COMPLIANCE_CONTRACT,
    TARGET,
    ROUTE,
    getTopology,
    getStatus,
    status: getStatus,
    getDistricts,
    getWaterEdgeRegistry,
    getSurfaceClassRegistry,
    getStoryTopologyMap,
    getFutureHandoffs,
    getHexPreface
  };

  if (hasWindow()) {
    window.AUDRALIA_TOPOLOGY_GRATITUDE = api;
    window.AUDRALIA_TOPOLOGY_GRATITUDE_RECEIPT = getStatus();
    window.AUDRALIA_GRATITUDE_HEX_PREFACE_ORGANIC_TOPOLOGY_ACTIVE = true;
    window.AUDRALIA_GRATITUDE_FULL_TOPOLOGY_GROUND_BASIS_ACTIVE = true;
    window.AUDRALIA_GRATITUDE_ADVERSITY_SURVIVAL_TOPOLOGY_ACTIVE = true;
  }
})();
