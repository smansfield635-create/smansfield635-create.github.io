// /assets/audralia/clean/engine/audralia/engine/continents/gratitude.hydrology.js
// AUDRALIA_G2_6_GRATITUDE_DOWNSTREAM_HYDROLOGY_SEA_LEVEL_INTEGRATION_TNT_v1
// Full-file creation.
// Purpose: define Gratitude-specific downstream hydrology so Gratitude can later render as sea-level-integrated planetary surface instead of a flat ornament.
// Classic script. No imports. No exports. No direct drawing.
// Downstream of: /assets/audralia/clean/engine/audralia/engine/continents/gratitude.js
// Hydrology here means sea-level classification and water-edge relationship, not water physics.
// Does not own: global ocean body, parent planet, route bridge, runtime, canvas, FORM_VISIBLE, topology identity, continent activation, terrain elevation, height maps, mountains, animals, plants, sky, motion, climate, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_GRATITUDE_DOWNSTREAM_HYDROLOGY_SEA_LEVEL_INTEGRATION_TNT_v1";
  const TOPOLOGY_CONTRACT_EXPECTED = "AUDRALIA_G2_6_GRATITUDE_HEX_PREFACE_ORGANIC_TOPOLOGY_CHILD_TNT_v1";
  const DOWNSTREAM_OF = "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.js";
  const TARGET = "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.hydrology.js";
  const ROUTE = "/showroom/globe/audralia/";

  const CONTINENT = "Gratitude";
  const SUMMIT = "Gratitude";

  const HYDROLOGY_CATEGORY = Object.freeze({
    COASTAL_SHELF: "COASTAL_SHELF",
    BEACH_TRANSITION: "BEACH_TRANSITION",
    HARD_COAST_WATERLINE: "HARD_COAST_WATERLINE",
    BAY_WATER_BODY: "BAY_WATER_BODY",
    INLET_WATER_CUT: "INLET_WATER_CUT",
    LAGOON_WATER_BODY: "LAGOON_WATER_BODY",
    WETLAND_TRANSITION: "WETLAND_TRANSITION",
    INLAND_LAKE_WATER: "INLAND_LAKE_WATER",
    SUBMERGED_EDGE: "SUBMERGED_EDGE",
    REPAIRED_WATERLINE: "REPAIRED_WATERLINE",
    OCEAN_ADJACENCY: "OCEAN_ADJACENCY",
    SEA_LEVEL_BLEND: "SEA_LEVEL_BLEND",
    SURFACE_INTEGRATION_HINT: "SURFACE_INTEGRATION_HINT",
    WATERLINE_SHADOW: "WATERLINE_SHADOW",
    WATER_CARVE_MASK: "WATER_CARVE_MASK",
    SHELTER_MOUTH_WATER_MARK: "SHELTER_MOUTH_WATER_MARK",
    MEMORY_WATER: "MEMORY_WATER",
    RESTORATION_WATER: "RESTORATION_WATER",
    REOPENING_WATER: "REOPENING_WATER",
    CONTINUANCE_SHELF: "CONTINUANCE_SHELF",
    ADVERSITY_WATERLINE: "ADVERSITY_WATERLINE"
  });

  const DISTRICT = Object.freeze({
    WEST_ADVERSITY_EDGE: "WEST_ADVERSITY_EDGE",
    NORTH_CONTINUANCE_SHOULDER: "NORTH_CONTINUANCE_SHOULDER",
    EAST_REOPENING_COAST: "EAST_REOPENING_COAST",
    SOUTH_RESTORATION_BELT: "SOUTH_RESTORATION_BELT",
    INTERIOR_MEMORY_FIELD: "INTERIOR_MEMORY_FIELD",
    SHELTER_MOUTH_BELT: "SHELTER_MOUTH_BELT",
    OUTREACH_PENINSULAS: "OUTREACH_PENINSULAS",
    SUBMERGED_EDGE_RING: "SUBMERGED_EDGE_RING",
    SEA_LEVEL_BLEND_RING: "SEA_LEVEL_BLEND_RING"
  });

  const HYDROLOGY_FORCE = Object.freeze({
    ADVERSITY_WATER_CONTACT: "ADVERSITY_WATER_CONTACT",
    CONTINUANCE_SHELFING: "CONTINUANCE_SHELFING",
    REOPENING_CARVE: "REOPENING_CARVE",
    RESTORATION_BLEND: "RESTORATION_BLEND",
    MEMORY_WATER_HOLD: "MEMORY_WATER_HOLD",
    SHELTER_WATER_SHADOW: "SHELTER_WATER_SHADOW",
    SURFACE_INTEGRATION: "SURFACE_INTEGRATION"
  });

  const RENDER_PHASE = Object.freeze({
    BEFORE_LAND: "BEFORE_LAND",
    UNDER_LAND_EDGE: "UNDER_LAND_EDGE",
    WITH_LAND_EDGE: "WITH_LAND_EDGE",
    AFTER_LAND: "AFTER_LAND",
    AFTER_WATER_CUTS: "AFTER_WATER_CUTS",
    RECEIPT_ONLY: "RECEIPT_ONLY"
  });

  const HYDROLOGY_COLORS = Object.freeze({
    coastalShelf: "rgba(86, 205, 232, 0.22)",
    beachTransition: "rgba(237, 223, 158, 0.30)",
    hardCoastWaterline: "rgba(208, 232, 238, 0.34)",
    bayWater: "rgba(82, 202, 232, 0.38)",
    inletWater: "rgba(112, 226, 242, 0.42)",
    lagoonWater: "rgba(104, 224, 222, 0.36)",
    wetlandBlend: "rgba(114, 184, 132, 0.32)",
    inlandLake: "rgba(66, 196, 226, 0.48)",
    submergedEdge: "rgba(46, 150, 194, 0.18)",
    repairedWaterline: "rgba(132, 216, 206, 0.28)",
    waterlineShadow: "rgba(0, 14, 34, 0.20)",
    carveMask: "rgba(28, 134, 188, 0.26)"
  });

  function hasWindow() {
    return typeof window !== "undefined";
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function p(lon, lat) {
    return { lon: roundCoord(lon), lat: roundCoord(lat) };
  }

  function roundCoord(value) {
    return Math.round(Number(value) * 1000) / 1000;
  }

  function segmentRef(id, name, category, sourceRef, district, force, renderPhase, profile) {
    return Object.freeze({
      id,
      name,
      category,
      sourceRef,
      district,
      hydrologyForce: force,
      renderPhase,
      profile,
      hydrologyOnly: true,
      topologyOwned: false,
      terrainOwned: false,
      elevationOwned: false,
      globalOceanOwned: false,
      directDrawing: false
    });
  }

  function ringZone(id, name, category, boundary, district, force, renderPhase, profile) {
    return Object.freeze({
      id,
      name,
      category,
      boundary: Object.freeze(boundary.map((point) => Object.freeze(p(point.lon, point.lat)))),
      district,
      hydrologyForce: force,
      renderPhase,
      profile,
      hydrologyOnly: true,
      topologyOwned: false,
      terrainOwned: false,
      elevationOwned: false,
      globalOceanOwned: false,
      directDrawing: false
    });
  }

  function pointZone(id, name, category, lon, lat, district, force, renderPhase, profile) {
    return Object.freeze({
      id,
      name,
      category,
      lon: roundCoord(lon),
      lat: roundCoord(lat),
      district,
      hydrologyForce: force,
      renderPhase,
      profile,
      hydrologyOnly: true,
      topologyOwned: false,
      terrainOwned: false,
      elevationOwned: false,
      globalOceanOwned: false,
      directDrawing: false
    });
  }

  function organicRing(cx, cy, rx, ry, count, seed, wobble = 0.08) {
    const points = [];

    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      const pulseA = Math.sin(angle * 3 + seed * 0.011) * wobble;
      const pulseB = Math.cos(angle * 5 + seed * 0.017) * wobble * 0.55;
      const pulseC = Math.sin(angle * 7 + seed * 0.023) * wobble * 0.28;
      const scale = 1 + pulseA + pulseB + pulseC;

      points.push(p(cx + Math.cos(angle) * rx * scale, cy + Math.sin(angle) * ry * scale));
    }

    return Object.freeze(points);
  }

  function elongatedBand(points, widthLon, widthLat, seed) {
    const out = [];

    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      const wobble = Math.sin((i + seed) * 1.731) * 0.12;

      out.push(p(point.lon + widthLon * (0.5 + wobble), point.lat + widthLat * (0.5 - wobble)));
    }

    for (let i = points.length - 1; i >= 0; i -= 1) {
      const point = points[i];
      const wobble = Math.cos((i + seed) * 1.219) * 0.12;

      out.push(p(point.lon - widthLon * (0.5 + wobble), point.lat - widthLat * (0.5 - wobble)));
    }

    return Object.freeze(out);
  }

  const FALLBACK_GRATITUDE_BOUNDARY = Object.freeze([
    p(-83.8, -8.8), p(-87.2, -3.1), p(-84.4, 2.6), p(-87.8, 8.7),
    p(-84.6, 15.2), p(-86.7, 22.4), p(-79.8, 29.4), p(-73.2, 35.8),
    p(-65.4, 41.2), p(-55.2, 44.5), p(-43.8, 44.1), p(-32.6, 40.7),
    p(-23.1, 35.7), p(-15.9, 28.4), p(-8.8, 20.6), p(-13.8, 14.7),
    p(-6.2, 8.2), p(-13.4, 2.2), p(-8.4, -4.8), p(-16.8, -10.6),
    p(-21.6, -17.4), p(-30.2, -22.2), p(-38.6, -27.8), p(-48.3, -30.8),
    p(-57.4, -28.5), p(-65.6, -33.2), p(-72.4, -27.6), p(-78.2, -22.2),
    p(-72.5, -17.6), p(-80.5, -13.8)
  ]);

  const FALLBACK_LAKES = Object.freeze([
    organicRing(-47.8, 14.3, 8.8, 6.1, 24, 4101, 0.06),
    organicRing(-60.1, -9.6, 6.9, 4.8, 20, 4102, 0.07),
    organicRing(-35.9, 31.2, 3.8, 2.7, 14, 4103, 0.08),
    organicRing(-40.4, -22.7, 4.4, 3.0, 14, 4104, 0.08)
  ]);

  const FALLBACK_LAGOONS = Object.freeze([
    organicRing(-53.2, -27.1, 8.4, 3.2, 18, 4201, 0.09),
    organicRing(-13.5, 3.2, 4.4, 2.7, 14, 4202, 0.09)
  ]);

  const SOURCE_TOPOLOGY_READERS = Object.freeze({
    topologyGlobal: "window.AUDRALIA_TOPOLOGY_GRATITUDE",
    topologyMethod: "getTopology",
    expectedTopologyContract: TOPOLOGY_CONTRACT_EXPECTED,
    fallbackAllowed: true,
    fallbackReason: "Hydrology can publish sea-level contract before continents.js adapter consumes live topology."
  });

  const CATEGORY_MEANINGS = Object.freeze({
    COASTAL_SHELF: "shallow sea-level shelf adjacent to exposed land",
    BEACH_TRANSITION: "soft water-to-land transition at sea level",
    HARD_COAST_WATERLINE: "abrupt waterline category for hard coast without raised cliff geometry",
    BAY_WATER_BODY: "water pocket recessed into coast topology",
    INLET_WATER_CUT: "narrow water cut entering coast topology",
    LAGOON_WATER_BODY: "protected water boundary near restored coast",
    WETLAND_TRANSITION: "blended land-water edge with high softness",
    INLAND_LAKE_WATER: "water contained inside land topology; no basin depth",
    SUBMERGED_EDGE: "low-alpha shelf or edge immediately below sea-level contact",
    REPAIRED_WATERLINE: "waterline where damaged coast became survivable transition",
    OCEAN_ADJACENCY: "relationship to parent ocean body without owning global ocean",
    SEA_LEVEL_BLEND: "render instruction to avoid decal-like land/ocean separation",
    SURFACE_INTEGRATION_HINT: "adapter guidance for rendering land through sea-level relation",
    WATERLINE_SHADOW: "thin visual contact hint at land/ocean boundary",
    WATER_CARVE_MASK: "adapter mask hint for bays and inlets",
    SHELTER_MOUTH_WATER_MARK: "small water-shadow mark associated with cavern-mouth topology",
    MEMORY_WATER: "interior water identity tied to Gratitude memory field",
    RESTORATION_WATER: "soft southern water identity tied to repair",
    REOPENING_WATER: "east-side water identity tied to reopened coast",
    CONTINUANCE_SHELF: "north-side shelf identity tied to older rounded access",
    ADVERSITY_WATERLINE: "west-side waterline identity tied to pressure"
  });

  function readLiveTopology() {
    const result = {
      attempted: false,
      succeeded: false,
      contract: "",
      topologyId: "",
      topology: null,
      error: "",
      source: "none"
    };

    if (!hasWindow()) {
      result.error = "window_unavailable";
      return result;
    }

    result.attempted = true;

    try {
      const api = window.AUDRALIA_TOPOLOGY_GRATITUDE || null;

      if (!api) {
        result.error = "AUDRALIA_TOPOLOGY_GRATITUDE_missing";
        return result;
      }

      result.source = "window.AUDRALIA_TOPOLOGY_GRATITUDE";

      const status =
        typeof api.getStatus === "function"
          ? api.getStatus()
          : typeof api.status === "function"
            ? api.status()
            : null;

      result.contract = status && status.contract ? status.contract : api.CONTRACT || "";

      if (typeof api.getTopology !== "function") {
        result.error = "getTopology_missing";
        return result;
      }

      const topology = api.getTopology();

      if (!topology || !Array.isArray(topology.landmasses) || !topology.landmasses.length) {
        result.error = "invalid_topology_shape";
        return result;
      }

      result.topology = topology;
      result.topologyId = topology.id || "";
      result.succeeded = true;
      result.error = "";

      return result;
    } catch (error) {
      result.error = error && error.message ? error.message : String(error);
      return result;
    }
  }

  function getPrimaryLandmass(topologyRead) {
    if (
      topologyRead &&
      topologyRead.succeeded &&
      topologyRead.topology &&
      Array.isArray(topologyRead.topology.landmasses) &&
      topologyRead.topology.landmasses[0]
    ) {
      return topologyRead.topology.landmasses[0];
    }

    return {
      id: "gratitude-fallback-landmass-for-hydrology",
      boundary: FALLBACK_GRATITUDE_BOUNDARY,
      topology: {
        lakes: FALLBACK_LAKES,
        lagoons: FALLBACK_LAGOONS
      }
    };
  }

  function getTopologyArray(landmass, key, fallback) {
    if (landmass && landmass.topology && Array.isArray(landmass.topology[key]) && landmass.topology[key].length) {
      return landmass.topology[key];
    }

    return fallback || [];
  }

  function getLakeRings(landmass) {
    return getTopologyArray(landmass, "lakes", FALLBACK_LAKES);
  }

  function getLagoonRings(landmass) {
    return getTopologyArray(landmass, "lagoons", FALLBACK_LAGOONS);
  }

  function safeBoundarySlice(boundary, start, end) {
    if (!Array.isArray(boundary) || !boundary.length) return [];

    const count = boundary.length;
    const a = Math.max(0, Math.min(count - 1, Number(start) || 0));
    const b = Math.max(0, Math.min(count - 1, Number(end) || 0));

    if (a <= b) return boundary.slice(a, b + 1);

    return boundary.slice(a).concat(boundary.slice(0, b + 1));
  }

  function inferBoundaryBands(landmass) {
    const boundary = Array.isArray(landmass.boundary) && landmass.boundary.length
      ? landmass.boundary
      : FALLBACK_GRATITUDE_BOUNDARY;

    const n = boundary.length;

    return Object.freeze({
      fullBoundary: boundary,
      west: safeBoundarySlice(boundary, Math.floor(n * 0.82), n - 1).concat(safeBoundarySlice(boundary, 0, Math.floor(n * 0.18))),
      north: safeBoundarySlice(boundary, Math.floor(n * 0.15), Math.floor(n * 0.40)),
      east: safeBoundarySlice(boundary, Math.floor(n * 0.38), Math.floor(n * 0.60)),
      south: safeBoundarySlice(boundary, Math.floor(n * 0.58), Math.floor(n * 0.82)),
      southwest: safeBoundarySlice(boundary, Math.floor(n * 0.76), Math.floor(n * 0.92)),
      southeast: safeBoundarySlice(boundary, Math.floor(n * 0.52), Math.floor(n * 0.66))
    });
  }

  function buildSeaLevelZones(topologyRead) {
    const landmass = getPrimaryLandmass(topologyRead);
    const bands = inferBoundaryBands(landmass);
    const lakeRings = getLakeRings(landmass);
    const lagoonRings = getLagoonRings(landmass);

    const coastalShelfRegistry = Object.freeze([
      {
        ...segmentRef(
          "gratitude-shelf-west-thin-adversity",
          "West Thin Adversity Shelf",
          HYDROLOGY_CATEGORY.COASTAL_SHELF,
          "topology.boundary.west",
          DISTRICT.WEST_ADVERSITY_EDGE,
          HYDROLOGY_FORCE.ADVERSITY_WATER_CONTACT,
          RENDER_PHASE.BEFORE_LAND,
          {
            shelfWidth: "thin",
            blendStrength: 0.18,
            waterlineSharpness: 0.86,
            softness: 0.08,
            sourceBoundary: bands.west
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-shelf-north-continuance",
          "North Continuance Shelf",
          HYDROLOGY_CATEGORY.COASTAL_SHELF,
          "topology.boundary.north",
          DISTRICT.NORTH_CONTINUANCE_SHOULDER,
          HYDROLOGY_FORCE.CONTINUANCE_SHELFING,
          RENDER_PHASE.BEFORE_LAND,
          {
            shelfWidth: "broad",
            blendStrength: 0.48,
            waterlineSharpness: 0.24,
            softness: 0.72,
            sourceBoundary: bands.north
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-shelf-east-reopening",
          "East Reopening Carved Shelf",
          HYDROLOGY_CATEGORY.COASTAL_SHELF,
          "topology.boundary.east",
          DISTRICT.EAST_REOPENING_COAST,
          HYDROLOGY_FORCE.REOPENING_CARVE,
          RENDER_PHASE.BEFORE_LAND,
          {
            shelfWidth: "variable",
            blendStrength: 0.42,
            waterlineSharpness: 0.42,
            softness: 0.42,
            sourceBoundary: bands.east
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-shelf-south-restoration",
          "South Restoration Feather Shelf",
          HYDROLOGY_CATEGORY.COASTAL_SHELF,
          "topology.boundary.south",
          DISTRICT.SOUTH_RESTORATION_BELT,
          HYDROLOGY_FORCE.RESTORATION_BLEND,
          RENDER_PHASE.BEFORE_LAND,
          {
            shelfWidth: "feathered",
            blendStrength: 0.62,
            waterlineSharpness: 0.14,
            softness: 0.9,
            sourceBoundary: bands.south
          }
        )
      }
    ]);

    const beachTransitionRegistry = Object.freeze([
      {
        ...segmentRef(
          "gratitude-beach-transition-north",
          "North Sea-Level Beach Transition",
          HYDROLOGY_CATEGORY.BEACH_TRANSITION,
          "topology.beaches.north",
          DISTRICT.NORTH_CONTINUANCE_SHOULDER,
          HYDROLOGY_FORCE.CONTINUANCE_SHELFING,
          RENDER_PHASE.WITH_LAND_EDGE,
          {
            transitionWidth: "medium",
            blendStrength: 0.56,
            sandMaterialClaim: false,
            sourceBoundary: bands.north
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-beach-transition-east",
          "East Reopening Beach Transition",
          HYDROLOGY_CATEGORY.BEACH_TRANSITION,
          "topology.beaches.east",
          DISTRICT.EAST_REOPENING_COAST,
          HYDROLOGY_FORCE.REOPENING_CARVE,
          RENDER_PHASE.WITH_LAND_EDGE,
          {
            transitionWidth: "interrupted",
            blendStrength: 0.38,
            sandMaterialClaim: false,
            sourceBoundary: bands.east
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-beach-transition-south",
          "South Restoration Beach Transition",
          HYDROLOGY_CATEGORY.BEACH_TRANSITION,
          "topology.beaches.south",
          DISTRICT.SOUTH_RESTORATION_BELT,
          HYDROLOGY_FORCE.RESTORATION_BLEND,
          RENDER_PHASE.WITH_LAND_EDGE,
          {
            transitionWidth: "soft-broad",
            blendStrength: 0.68,
            sandMaterialClaim: false,
            sourceBoundary: bands.south
          }
        )
      }
    ]);

    const hardCoastWaterlineRegistry = Object.freeze([
      {
        ...segmentRef(
          "gratitude-hard-waterline-west",
          "West Adversity Hard Waterline",
          HYDROLOGY_CATEGORY.HARD_COAST_WATERLINE,
          "topology.cliffEdges.west",
          DISTRICT.WEST_ADVERSITY_EDGE,
          HYDROLOGY_FORCE.ADVERSITY_WATER_CONTACT,
          RENDER_PHASE.AFTER_WATER_CUTS,
          {
            thinLine: true,
            waterlineSharpness: 0.9,
            blendStrength: 0.12,
            raisedCliffGeometry: false,
            sourceBoundary: bands.west
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-hard-waterline-southwest",
          "Southwest Survival Hard Waterline",
          HYDROLOGY_CATEGORY.HARD_COAST_WATERLINE,
          "topology.cliffEdges.southwest",
          DISTRICT.WEST_ADVERSITY_EDGE,
          HYDROLOGY_FORCE.SURFACE_INTEGRATION,
          RENDER_PHASE.AFTER_WATER_CUTS,
          {
            thinLine: true,
            waterlineSharpness: 0.72,
            blendStrength: 0.22,
            raisedCliffGeometry: false,
            sourceBoundary: bands.southwest
          }
        )
      }
    ]);

    const bayWaterRegistry = Object.freeze([
      {
        ...segmentRef(
          "gratitude-bay-water-east-reopened",
          "East Reopened Bay Water",
          HYDROLOGY_CATEGORY.BAY_WATER_BODY,
          "topology.bays.east",
          DISTRICT.EAST_REOPENING_COAST,
          HYDROLOGY_FORCE.REOPENING_CARVE,
          RENDER_PHASE.AFTER_LAND,
          {
            carveStrength: 0.72,
            waterFillAlpha: 0.42,
            nestedWaterEdge: true,
            sourceBoundary: bands.east
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-bay-water-south-repair",
          "South Repair Bay Water",
          HYDROLOGY_CATEGORY.BAY_WATER_BODY,
          "topology.bays.south",
          DISTRICT.SOUTH_RESTORATION_BELT,
          HYDROLOGY_FORCE.RESTORATION_BLEND,
          RENDER_PHASE.AFTER_LAND,
          {
            carveStrength: 0.46,
            waterFillAlpha: 0.34,
            nestedWaterEdge: true,
            sourceBoundary: bands.south
          }
        )
      }
    ]);

    const inletWaterRegistry = Object.freeze([
      {
        ...segmentRef(
          "gratitude-inlet-water-east-cut",
          "East Inlet Water Cut",
          HYDROLOGY_CATEGORY.INLET_WATER_CUT,
          "topology.inlets.east",
          DISTRICT.EAST_REOPENING_COAST,
          HYDROLOGY_FORCE.REOPENING_CARVE,
          RENDER_PHASE.AFTER_LAND,
          {
            carveStrength: 0.82,
            narrowCut: true,
            waterFillAlpha: 0.46,
            sourceBoundary: bands.east
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-inlet-water-southeast-restoration",
          "Southeast Restoration Inlet Water",
          HYDROLOGY_CATEGORY.INLET_WATER_CUT,
          "topology.inlets.southeast",
          DISTRICT.SOUTH_RESTORATION_BELT,
          HYDROLOGY_FORCE.RESTORATION_BLEND,
          RENDER_PHASE.AFTER_LAND,
          {
            carveStrength: 0.54,
            narrowCut: true,
            waterFillAlpha: 0.38,
            sourceBoundary: bands.southeast
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-inlet-water-southwest-survival",
          "Southwest Survival Inlet Water",
          HYDROLOGY_CATEGORY.INLET_WATER_CUT,
          "topology.inlets.southwest",
          DISTRICT.SOUTH_RESTORATION_BELT,
          HYDROLOGY_FORCE.SURFACE_INTEGRATION,
          RENDER_PHASE.AFTER_LAND,
          {
            carveStrength: 0.42,
            narrowCut: true,
            waterFillAlpha: 0.32,
            sourceBoundary: bands.southwest
          }
        )
      }
    ]);

    const lagoonWaterRegistry = Object.freeze(
      lagoonRings.map((ring, index) =>
        ringZone(
          `gratitude-lagoon-water-${index + 1}`,
          index === 0 ? "South Restoration Lagoon Water" : "East Reopening Lagoon Water",
          HYDROLOGY_CATEGORY.LAGOON_WATER_BODY,
          ring,
          index === 0 ? DISTRICT.SOUTH_RESTORATION_BELT : DISTRICT.EAST_REOPENING_COAST,
          index === 0 ? HYDROLOGY_FORCE.RESTORATION_BLEND : HYDROLOGY_FORCE.REOPENING_CARVE,
          RENDER_PHASE.AFTER_WATER_CUTS,
          {
            protectedWater: true,
            blendStrength: index === 0 ? 0.62 : 0.42,
            waterFillAlpha: index === 0 ? 0.42 : 0.36,
            noHydrologyPhysics: true
          }
        )
      )
    );

    const wetlandBlendRegistry = Object.freeze([
      {
        ...segmentRef(
          "gratitude-wetland-blend-south",
          "South Wetland Sea-Level Blend",
          HYDROLOGY_CATEGORY.WETLAND_TRANSITION,
          "topology.wetlands.south",
          DISTRICT.SOUTH_RESTORATION_BELT,
          HYDROLOGY_FORCE.RESTORATION_BLEND,
          RENDER_PHASE.AFTER_WATER_CUTS,
          {
            blendStrength: 0.74,
            edgeAlphaReduction: 0.22,
            waterLandIntermix: true,
            sourceBoundary: bands.south
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-wetland-blend-southeast",
          "Southeast Wetland Repaired Blend",
          HYDROLOGY_CATEGORY.WETLAND_TRANSITION,
          "topology.wetlands.southeast",
          DISTRICT.SOUTH_RESTORATION_BELT,
          HYDROLOGY_FORCE.RESTORATION_BLEND,
          RENDER_PHASE.AFTER_WATER_CUTS,
          {
            blendStrength: 0.58,
            edgeAlphaReduction: 0.18,
            waterLandIntermix: true,
            sourceBoundary: bands.southeast
          }
        )
      }
    ]);

    const inlandLakeRegistry = Object.freeze(
      lakeRings.map((ring, index) =>
        ringZone(
          `gratitude-inland-lake-water-${index + 1}`,
          [
            "Main Memory Lake Water",
            "Companion Survival Lake Water",
            "North Reflection Pool Water",
            "South Restoration Pool Water"
          ][index] || `Interior Memory Water ${index + 1}`,
          HYDROLOGY_CATEGORY.INLAND_LAKE_WATER,
          ring,
          index === 3 ? DISTRICT.SOUTH_RESTORATION_BELT : DISTRICT.INTERIOR_MEMORY_FIELD,
          index === 3 ? HYDROLOGY_FORCE.RESTORATION_BLEND : HYDROLOGY_FORCE.MEMORY_WATER_HOLD,
          RENDER_PHASE.AFTER_WATER_CUTS,
          {
            protectedInteriorWater: true,
            basinDepthClaim: false,
            hydrologyPhysics: false,
            internalBlendStrength: index === 0 ? 0.54 : 0.38,
            waterFillAlpha: index === 0 ? 0.5 : 0.42
          }
        )
      )
    );

    const submergedEdgeRegistry = Object.freeze([
      {
        ...segmentRef(
          "gratitude-submerged-edge-global-contact",
          "Global Sea-Level Contact Band",
          HYDROLOGY_CATEGORY.SUBMERGED_EDGE,
          "topology.boundary.full",
          DISTRICT.SUBMERGED_EDGE_RING,
          HYDROLOGY_FORCE.SURFACE_INTEGRATION,
          RENDER_PHASE.BEFORE_LAND,
          {
            shelfAlpha: 0.18,
            edgeOffset: "outside-land-boundary",
            sourceBoundary: bands.fullBoundary,
            globalOceanOwned: false
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-submerged-edge-east-carve",
          "East Carved Submerged Edge",
          HYDROLOGY_CATEGORY.SUBMERGED_EDGE,
          "topology.boundary.east",
          DISTRICT.EAST_REOPENING_COAST,
          HYDROLOGY_FORCE.REOPENING_CARVE,
          RENDER_PHASE.BEFORE_LAND,
          {
            shelfAlpha: 0.26,
            edgeOffset: "bay-and-inlet-contact",
            sourceBoundary: bands.east,
            globalOceanOwned: false
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-submerged-edge-south-repair",
          "South Repair Submerged Edge",
          HYDROLOGY_CATEGORY.SUBMERGED_EDGE,
          "topology.boundary.south",
          DISTRICT.SOUTH_RESTORATION_BELT,
          HYDROLOGY_FORCE.RESTORATION_BLEND,
          RENDER_PHASE.BEFORE_LAND,
          {
            shelfAlpha: 0.28,
            edgeOffset: "wetland-contact",
            sourceBoundary: bands.south,
            globalOceanOwned: false
          }
        )
      }
    ]);

    const repairedWaterlineRegistry = Object.freeze([
      {
        ...segmentRef(
          "gratitude-repaired-waterline-south",
          "South Repaired Waterline",
          HYDROLOGY_CATEGORY.REPAIRED_WATERLINE,
          "topology.southRestorationBelt",
          DISTRICT.SOUTH_RESTORATION_BELT,
          HYDROLOGY_FORCE.RESTORATION_BLEND,
          RENDER_PHASE.AFTER_WATER_CUTS,
          {
            blendStrength: 0.66,
            waterlineSharpness: 0.18,
            sourceBoundary: bands.south
          }
        )
      },
      {
        ...segmentRef(
          "gratitude-repaired-waterline-southeast",
          "Southeast Repaired Waterline",
          HYDROLOGY_CATEGORY.REPAIRED_WATERLINE,
          "topology.southeastTransition",
          DISTRICT.SOUTH_RESTORATION_BELT,
          HYDROLOGY_FORCE.RESTORATION_BLEND,
          RENDER_PHASE.AFTER_WATER_CUTS,
          {
            blendStrength: 0.5,
            waterlineSharpness: 0.28,
            sourceBoundary: bands.southeast
          }
        )
      }
    ]);

    const shelterMouthWaterRegistry = Object.freeze([
      pointZone(
        "gratitude-shelter-mouth-water-west",
        "West Shelter-Mouth Water Shadow",
        HYDROLOGY_CATEGORY.SHELTER_MOUTH_WATER_MARK,
        -83.2,
        7.4,
        DISTRICT.SHELTER_MOUTH_BELT,
        HYDROLOGY_FORCE.SHELTER_WATER_SHADOW,
        RENDER_PHASE.AFTER_WATER_CUTS,
        {
          shadowAlpha: 0.28,
          caveInteriorClaim: false,
          waterContact: true
        }
      ),
      pointZone(
        "gratitude-shelter-mouth-water-upper-west",
        "Upper West Shelter-Mouth Water Shadow",
        HYDROLOGY_CATEGORY.SHELTER_MOUTH_WATER_MARK,
        -79.4,
        24.7,
        DISTRICT.SHELTER_MOUTH_BELT,
        HYDROLOGY_FORCE.SHELTER_WATER_SHADOW,
        RENDER_PHASE.AFTER_WATER_CUTS,
        {
          shadowAlpha: 0.24,
          caveInteriorClaim: false,
          waterContact: true
        }
      ),
      pointZone(
        "gratitude-shelter-mouth-water-east",
        "East Reopening Shelter-Mouth Water Shadow",
        HYDROLOGY_CATEGORY.SHELTER_MOUTH_WATER_MARK,
        -12.4,
        3.8,
        DISTRICT.EAST_REOPENING_COAST,
        HYDROLOGY_FORCE.SHELTER_WATER_SHADOW,
        RENDER_PHASE.AFTER_WATER_CUTS,
        {
          shadowAlpha: 0.22,
          caveInteriorClaim: false,
          waterContact: true
        }
      )
    ]);

    const seaLevelZones = Object.freeze([
      ...coastalShelfRegistry,
      ...beachTransitionRegistry,
      ...hardCoastWaterlineRegistry,
      ...bayWaterRegistry,
      ...inletWaterRegistry,
      ...lagoonWaterRegistry,
      ...wetlandBlendRegistry,
      ...inlandLakeRegistry,
      ...submergedEdgeRegistry,
      ...repairedWaterlineRegistry,
      ...shelterMouthWaterRegistry
    ]);

    return Object.freeze({
      sourceLandmassId: landmass.id || "unknown",
      boundaryNodeCount: Array.isArray(landmass.boundary) ? landmass.boundary.length : 0,
      seaLevelZones,
      coastalShelfRegistry,
      beachTransitionRegistry,
      hardCoastWaterlineRegistry,
      bayWaterRegistry,
      inletWaterRegistry,
      lagoonWaterRegistry,
      wetlandBlendRegistry,
      inlandLakeRegistry,
      submergedEdgeRegistry,
      repairedWaterlineRegistry,
      shelterMouthWaterRegistry
    });
  }

  function buildRenderHints() {
    return Object.freeze({
      recommendedDrawOrder: Object.freeze([
        "parent_ocean_body",
        "submerged_edge_shelves",
        "continent_land_body",
        "coastal_transition_blends",
        "bay_inlet_water_cuts",
        "wetland_lagoon_blends",
        "inland_lake_water",
        "hard_coast_waterlines",
        "shelter_mouth_water_marks",
        "final_atmospheric_rim"
      ]),
      edgeIntegration: true,
      reduceDecalRead: true,
      seaLevelBlendRequired: true,
      terrainElevationRequired: false,
      rendererAdapterRequired: true,
      directDrawingAllowed: false,
      visualPassClaim: false,
      specificAdapterInstructions: Object.freeze({
        submergedEdgeShelves: {
          phase: RENDER_PHASE.BEFORE_LAND,
          instruction: "Draw low-alpha shelf bands under the land boundary before the land fill so the coast appears seated in water."
        },
        landBody: {
          phase: RENDER_PHASE.WITH_LAND_EDGE,
          instruction: "Reduce uniform land opacity near coast; preserve inland body but avoid flat sticker edge."
        },
        bayInletWaterCuts: {
          phase: RENDER_PHASE.AFTER_LAND,
          instruction: "Draw bay and inlet water cuts above the land body where topology says water entered the edge."
        },
        wetlandsLagoons: {
          phase: RENDER_PHASE.AFTER_WATER_CUTS,
          instruction: "Use soft transition alpha; avoid hard borders in the southern restoration belt."
        },
        inlandLakes: {
          phase: RENDER_PHASE.AFTER_WATER_CUTS,
          instruction: "Render lakes as contained water with edge blending, not stamped turquoise decals."
        },
        hardCoast: {
          phase: RENDER_PHASE.AFTER_WATER_CUTS,
          instruction: "Use thin waterline/shadow on west hard coast; no raised cliff geometry."
        },
        noFalseClaims: {
          terrainHeight: false,
          globalOceanOwnership: false,
          directCanvasAccess: false,
          formVisibleClaim: false
        }
      }),
      visualGoal: "Gratitude should read as land emerging through sea-level surface relationship, not as green ornament pasted onto the planet."
    });
  }

  const FUTURE_HANDOFFS = Object.freeze({
    continentsAdapter: {
      required: true,
      target: "/assets/audralia/clean/engine/audralia/engine/continents.js",
      purpose: "Load Gratitude hydrology after Gratitude topology and use hydrology fields to integrate coast, bay, inlet, lagoon, wetland, and lake rendering at sea level.",
      mayRead: Object.freeze([
        "getHydrology().seaLevelZones",
        "getHydrology().coastalShelfRegistry",
        "getHydrology().bayWaterRegistry",
        "getHydrology().inletWaterRegistry",
        "getHydrology().lagoonWaterRegistry",
        "getHydrology().wetlandBlendRegistry",
        "getHydrology().inlandLakeRegistry",
        "getHydrology().renderHints"
      ]),
      mustNotAssume: Object.freeze([
        "terrain height",
        "mountains",
        "global ocean ownership",
        "direct hydrology drawing"
      ])
    },
    terrain: {
      mayReadLater: Object.freeze([
        "hardCoastWaterlineRegistry",
        "coastalShelfRegistry",
        "repairedWaterlineRegistry",
        "inlandLakeRegistry",
        "wetlandBlendRegistry"
      ]),
      mayNotAssume: Object.freeze([
        "elevation values",
        "height maps",
        "flow physics",
        "mountain systems"
      ]),
      currentLayerOwnsTerrain: false,
      currentLayerOwnsElevation: false
    },
    hydrationPhysics: {
      currentLayerIsNotPhysics: true,
      forbiddenAssumptions: Object.freeze([
        "flow rate",
        "rainfall",
        "river physics",
        "water volume",
        "drainage basin",
        "ocean current",
        "flood model",
        "climate model"
      ])
    }
  });

  function buildHydrology() {
    const topologyRead = readLiveTopology();
    const derived = buildSeaLevelZones(topologyRead);
    const renderHints = buildRenderHints();

    return Object.freeze({
      id: "gratitude-downstream-hydrology-sea-level-integration",
      continent: CONTINENT,
      summit: SUMMIT,
      contract: CONTRACT,
      topologyContractExpected: TOPOLOGY_CONTRACT_EXPECTED,
      downstreamOf: DOWNSTREAM_OF,
      target: TARGET,
      route: ROUTE,

      hydrologyOnly: true,
      topologyOwned: false,
      terrainOwned: false,
      elevationOwned: false,
      oceanOwned: false,
      globalOceanOwned: false,
      directDrawing: false,
      formVisibleClaim: false,
      visualPassClaim: false,

      seaLevelModel: Object.freeze({
        mode: "topology_to_sea_level_relationship",
        continent: CONTINENT,
        parentTopologyContract: TOPOLOGY_CONTRACT_EXPECTED,
        seaLevelIsInterpretive: true,
        terrainElevationOwned: false,
        globalOceanOwned: false,
        visualGoal: "land embedded into planet surface rather than flat ornament",
        hydrologyPhysicsSimulation: false
      }),

      sourceTopologyReaders: SOURCE_TOPOLOGY_READERS,

      topologyRead: Object.freeze({
        attempted: topologyRead.attempted,
        succeeded: topologyRead.succeeded,
        contract: topologyRead.contract,
        topologyId: topologyRead.topologyId,
        source: topologyRead.source,
        error: topologyRead.error,
        expectedContract: TOPOLOGY_CONTRACT_EXPECTED,
        contractMatchesExpected: topologyRead.contract === TOPOLOGY_CONTRACT_EXPECTED
      }),

      sourceLandmassId: derived.sourceLandmassId,
      sourceBoundaryNodeCount: derived.boundaryNodeCount,

      seaLevelZones: derived.seaLevelZones,
      coastalShelfRegistry: derived.coastalShelfRegistry,
      beachTransitionRegistry: derived.beachTransitionRegistry,
      hardCoastWaterlineRegistry: derived.hardCoastWaterlineRegistry,
      bayWaterRegistry: derived.bayWaterRegistry,
      inletWaterRegistry: derived.inletWaterRegistry,
      lagoonWaterRegistry: derived.lagoonWaterRegistry,
      wetlandBlendRegistry: derived.wetlandBlendRegistry,
      inlandLakeRegistry: derived.inlandLakeRegistry,
      submergedEdgeRegistry: derived.submergedEdgeRegistry,
      repairedWaterlineRegistry: derived.repairedWaterlineRegistry,
      shelterMouthWaterRegistry: derived.shelterMouthWaterRegistry,

      renderHints,
      futureHandoffs: FUTURE_HANDOFFS,
      categoryMeanings: CATEGORY_MEANINGS,
      hydrologyColors: HYDROLOGY_COLORS,

      gratitudeHydrologyMap: Object.freeze({
        westAdversityWaterline: {
          source: "Gratitude west adversity edge / hard coast / cavern-mouth topology",
          hydrology: Object.freeze([
            HYDROLOGY_CATEGORY.HARD_COAST_WATERLINE,
            HYDROLOGY_CATEGORY.COASTAL_SHELF,
            HYDROLOGY_CATEGORY.WATERLINE_SHADOW,
            HYDROLOGY_CATEGORY.SHELTER_MOUTH_WATER_MARK
          ]),
          visualIntent: "The west edge should look struck and old, not softly beachlike."
        },
        northContinuanceShelf: {
          source: "North continuance shoulder / beach arcs / rounded coastline",
          hydrology: Object.freeze([
            HYDROLOGY_CATEGORY.COASTAL_SHELF,
            HYDROLOGY_CATEGORY.BEACH_TRANSITION,
            HYDROLOGY_CATEGORY.SEA_LEVEL_BLEND
          ]),
          visualIntent: "The north should read older, broader, accessible, and naturally rounded."
        },
        eastReopeningBaySystem: {
          source: "East reopening coast / bays / inlets / eastern lagoon",
          hydrology: Object.freeze([
            HYDROLOGY_CATEGORY.BAY_WATER_BODY,
            HYDROLOGY_CATEGORY.INLET_WATER_CUT,
            HYDROLOGY_CATEGORY.SUBMERGED_EDGE,
            HYDROLOGY_CATEGORY.WATER_CARVE_MASK
          ]),
          visualIntent: "The east should read as opened by water access."
        },
        southRestorationWetlandSystem: {
          source: "South restoration belt / wetlands / lagoons / repaired beach arcs",
          hydrology: Object.freeze([
            HYDROLOGY_CATEGORY.WETLAND_TRANSITION,
            HYDROLOGY_CATEGORY.LAGOON_WATER_BODY,
            HYDROLOGY_CATEGORY.REPAIRED_WATERLINE,
            HYDROLOGY_CATEGORY.SEA_LEVEL_BLEND
          ]),
          visualIntent: "The south should become the softest and most blended edge."
        },
        interiorMemoryWaterSystem: {
          source: "Main memory lake, companion survival lake, reflection pools",
          hydrology: Object.freeze([
            HYDROLOGY_CATEGORY.INLAND_LAKE_WATER,
            HYDROLOGY_CATEGORY.MEMORY_WATER,
            HYDROLOGY_CATEGORY.SEA_LEVEL_BLEND
          ]),
          visualIntent: "Lakes should read as water held inside the continent, not stamped circles."
        },
        submergedEdgeShelfSystem: {
          source: "All ocean-adjacent boundary sections",
          hydrology: Object.freeze([
            HYDROLOGY_CATEGORY.SUBMERGED_EDGE,
            HYDROLOGY_CATEGORY.COASTAL_SHELF,
            HYDROLOGY_CATEGORY.OCEAN_ADJACENCY
          ]),
          visualIntent: "The land should feel embedded in the planet’s water surface."
        }
      })
    });
  }

  function getHydrology() {
    return clone(buildHydrology());
  }

  function getSeaLevelZones() {
    return clone(buildHydrology().seaLevelZones);
  }

  function getWaterEdgeRegistry() {
    const hydrology = buildHydrology();

    return clone({
      coastalShelfRegistry: hydrology.coastalShelfRegistry,
      beachTransitionRegistry: hydrology.beachTransitionRegistry,
      hardCoastWaterlineRegistry: hydrology.hardCoastWaterlineRegistry,
      bayWaterRegistry: hydrology.bayWaterRegistry,
      inletWaterRegistry: hydrology.inletWaterRegistry,
      lagoonWaterRegistry: hydrology.lagoonWaterRegistry,
      wetlandBlendRegistry: hydrology.wetlandBlendRegistry,
      inlandLakeRegistry: hydrology.inlandLakeRegistry,
      submergedEdgeRegistry: hydrology.submergedEdgeRegistry,
      repairedWaterlineRegistry: hydrology.repairedWaterlineRegistry,
      shelterMouthWaterRegistry: hydrology.shelterMouthWaterRegistry
    });
  }

  function getRenderHints() {
    return clone(buildHydrology().renderHints);
  }

  function getFutureHandoffs() {
    return clone(FUTURE_HANDOFFS);
  }

  function getStatus() {
    const hydrology = buildHydrology();

    return {
      contract: CONTRACT,
      topologyContractExpected: TOPOLOGY_CONTRACT_EXPECTED,
      downstreamOf: DOWNSTREAM_OF,
      target: TARGET,
      route: ROUTE,
      continent: CONTINENT,
      summit: SUMMIT,

      hydrologyOnly: true,
      topologyOwned: false,
      terrainOwned: false,
      elevationOwned: false,
      oceanOwned: false,
      globalOceanOwned: false,
      directDrawing: false,
      formVisibleClaim: false,

      topologyReadAttempted: hydrology.topologyRead.attempted,
      topologyReadSucceeded: hydrology.topologyRead.succeeded,
      topologyReadSource: hydrology.topologyRead.source,
      topologyReadContract: hydrology.topologyRead.contract,
      topologyReadContractMatchesExpected: hydrology.topologyRead.contractMatchesExpected,
      topologyReadError: hydrology.topologyRead.error,

      seaLevelZoneCount: hydrology.seaLevelZones.length,
      coastalShelfCount: hydrology.coastalShelfRegistry.length,
      beachTransitionCount: hydrology.beachTransitionRegistry.length,
      hardCoastWaterlineCount: hydrology.hardCoastWaterlineRegistry.length,
      bayWaterCount: hydrology.bayWaterRegistry.length,
      inletWaterCount: hydrology.inletWaterRegistry.length,
      lagoonWaterCount: hydrology.lagoonWaterRegistry.length,
      wetlandBlendCount: hydrology.wetlandBlendRegistry.length,
      inlandLakeCount: hydrology.inlandLakeRegistry.length,
      submergedEdgeCount: hydrology.submergedEdgeRegistry.length,
      repairedWaterlineCount: hydrology.repairedWaterlineRegistry.length,
      shelterMouthWaterMarkCount: hydrology.shelterMouthWaterRegistry.length,

      rendererAdapterRequired: true,
      visualPassClaim: false,

      owns: [
        "Gratitude sea-level relationship",
        "Gratitude coastal shelf classification",
        "Gratitude beach transition classification",
        "Gratitude hard-coast waterline classification",
        "Gratitude bay-water classification",
        "Gratitude inlet-water classification",
        "Gratitude lagoon-water classification",
        "Gratitude wetland-blend classification",
        "Gratitude inland-lake water classification",
        "Gratitude submerged-edge classification",
        "Gratitude repaired-waterline classification",
        "Gratitude render hints for later continents.js adapter"
      ],

      doesNotOwn: [
        "global ocean body",
        "parent planet",
        "route bridge",
        "runtime",
        "canvas",
        "FORM_VISIBLE",
        "topology identity",
        "continent activation",
        "terrain elevation",
        "height maps",
        "mountains",
        "mountain ranges",
        "animals",
        "plants",
        "sky",
        "motion",
        "climate",
        "hydrology physics simulation"
      ],

      generatedImage: false,
      graphicBox: false
    };
  }

  const api = {
    CONTRACT,
    TOPOLOGY_CONTRACT_EXPECTED,
    DOWNSTREAM_OF,
    TARGET,
    ROUTE,
    CONTINENT,
    SUMMIT,
    getHydrology,
    getStatus,
    status: getStatus,
    getSeaLevelZones,
    getWaterEdgeRegistry,
    getRenderHints,
    getFutureHandoffs
  };

  if (hasWindow()) {
    window.AUDRALIA_GRATITUDE_HYDROLOGY = api;
    window.AUDRALIA_GRATITUDE_HYDROLOGY_RECEIPT = getStatus();
    window.AUDRALIA_GRATITUDE_DOWNSTREAM_HYDROLOGY_ACTIVE = true;
  }
})();
