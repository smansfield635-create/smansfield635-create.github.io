// /assets/audralia/clean/engine/audralia/engine/continents/gratitude.js
// AUDRALIA_G2_6_GRATITUDE_FULL_TOPOLOGY_GROUND_BASIS_CHILD_TNT_v1
// Full-file replacement.
// Purpose: define Gratitude as a full topology ground-basis child with continent-grade internal structure.
// Classic script. No imports. No exports. No direct drawing.
// Topology only: category, boundary, adjacency, surface relationship, water's edge, plateaus as surface zones, and future handoff markers.
// Does not own: parent geometry, canvas, FORM_VISIBLE, ocean body, seawater base, elevation, height maps, mountain systems, animals, plants, sky, motion, zoom, orbit, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_GRATITUDE_FULL_TOPOLOGY_GROUND_BASIS_CHILD_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_6_GRATITUDE_ADVERSITY_SURVIVAL_TOPOLOGY_CHILD_TNT_v1";
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
    SOFT_COAST: "SOFT_COAST"
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
    SURVIVAL_CONTACT_RING: "SURVIVAL_CONTACT_RING"
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
    CONTINUANCE: "CONTINUANCE"
  });

  const COLORS = Object.freeze({
    land: "rgba(66, 166, 102, 0.78)",
    repairedLand: "rgba(84, 183, 116, 0.74)",
    memoryWater: "rgba(68, 188, 222, 0.42)",
    lagoonWater: "rgba(106, 218, 220, 0.34)",
    wetlandEdge: "rgba(118, 178, 126, 0.38)",
    beachEdge: "rgba(238, 222, 150, 0.48)",
    hardCoast: "rgba(196, 196, 176, 0.42)",
    cavernMouth: "rgba(25, 28, 35, 0.52)",
    bayEdge: "rgba(112, 224, 235, 0.34)",
    inletEdge: "rgba(132, 232, 239, 0.36)",
    peninsulaEdge: "rgba(118, 198, 126, 0.38)",
    plateauMarker: "rgba(154, 192, 124, 0.30)"
  });

  function p(lon, lat) {
    return { lon, lat };
  }

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

  const PRIMARY_BOUNDARY = Object.freeze([
    p(-87, 8),
    p(-84, 15),
    p(-86, 22),
    p(-80, 28),
    p(-75, 35),
    p(-66, 40),
    p(-58, 44),
    p(-48, 45),
    p(-39, 43),
    p(-30, 40),
    p(-22, 35),
    p(-15, 30),
    p(-10, 23),
    p(-7, 16),
    p(-10, 10),
    p(-5, 5),
    p(-12, 1),
    p(-7, -5),
    p(-15, -8),
    p(-18, -15),
    p(-25, -18),
    p(-29, -25),
    p(-37, -31),
    p(-47, -35),
    p(-57, -33),
    p(-64, -38),
    p(-72, -32),
    p(-70, -25),
    p(-79, -21),
    p(-74, -14),
    p(-84, -11),
    p(-78, -5),
    p(-88, 0),
    p(-82, 4)
  ]);

  const WEST_SCAR_SUBBOUNDARY = Object.freeze([
    p(-88, 0),
    p(-87, 8),
    p(-84, 15),
    p(-86, 22),
    p(-80, 28),
    p(-75, 35),
    p(-78, 29),
    p(-76, 21),
    p(-80, 14),
    p(-78, 8),
    p(-82, 4)
  ]);

  const EAST_REOPENING_SUBBOUNDARY = Object.freeze([
    p(-15, 30),
    p(-10, 23),
    p(-7, 16),
    p(-10, 10),
    p(-5, 5),
    p(-12, 1),
    p(-7, -5),
    p(-15, -8),
    p(-18, -15),
    p(-14, -9),
    p(-16, -2),
    p(-11, 4),
    p(-15, 10),
    p(-13, 18)
  ]);

  const SOUTH_RESTORATION_SUBBOUNDARY = Object.freeze([
    p(-18, -15),
    p(-25, -18),
    p(-29, -25),
    p(-37, -31),
    p(-47, -35),
    p(-57, -33),
    p(-64, -38),
    p(-72, -32),
    p(-70, -25),
    p(-79, -21),
    p(-74, -14),
    p(-64, -18),
    p(-54, -21),
    p(-43, -22),
    p(-32, -18)
  ]);

  const NORTH_CONTINUANCE_SUBBOUNDARY = Object.freeze([
    p(-84, 15),
    p(-86, 22),
    p(-80, 28),
    p(-75, 35),
    p(-66, 40),
    p(-58, 44),
    p(-48, 45),
    p(-39, 43),
    p(-30, 40),
    p(-22, 35),
    p(-15, 30),
    p(-26, 32),
    p(-38, 35),
    p(-51, 37),
    p(-64, 35),
    p(-75, 29)
  ]);

  const MAIN_MEMORY_LAKE = Object.freeze([
    p(-56, 16),
    p(-53, 21),
    p(-47, 24),
    p(-40, 23),
    p(-35, 19),
    p(-34, 13),
    p(-38, 8),
    p(-45, 6),
    p(-52, 9)
  ]);

  const COMPANION_SURVIVAL_LAKE = Object.freeze([
    p(-64, -8),
    p(-60, -4),
    p(-55, -4),
    p(-50, -7),
    p(-49, -12),
    p(-53, -16),
    p(-59, -16),
    p(-64, -13)
  ]);

  const SMALL_REFLECTION_POOL_NORTH = Object.freeze([
    p(-39, 31),
    p(-36, 33),
    p(-32, 32),
    p(-31, 29),
    p(-34, 27),
    p(-38, 28)
  ]);

  const SMALL_REFLECTION_POOL_SOUTH = Object.freeze([
    p(-42, -20),
    p(-38, -18),
    p(-34, -20),
    p(-34, -24),
    p(-38, -26),
    p(-43, -24)
  ]);

  const SOUTH_RESTORATION_LAGOON = Object.freeze([
    p(-61, -27),
    p(-56, -23),
    p(-49, -22),
    p(-43, -25),
    p(-45, -30),
    p(-53, -32),
    p(-60, -31)
  ]);

  const EAST_REOPENING_LAGOON = Object.freeze([
    p(-18, 3),
    p(-14, 6),
    p(-10, 4),
    p(-10, 0),
    p(-15, -2)
  ]);

  const TOPOLOGY_DISTRICTS = Object.freeze([
    {
      id: DISTRICT.WEST_ADVERSITY_EDGE,
      name: "West Adversity Edge",
      role: "hardest shoreline category",
      meaning: "Where Gratitude absorbed the oldest pressure and remained intact.",
      storyForces: [STORY_FORCE.ADVERSITY, STORY_FORCE.SURVIVAL],
      categoryClasses: [CATEGORY.CLIFF_EDGE, CATEGORY.CAVERN_MOUTH, CATEGORY.HARD_COAST, CATEGORY.SHELTER_EDGE],
      boundaryReference: "primaryBoundary[28..33,0..4]",
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "hard coast categories and shelter-mouth points; no raised cliff geometry"
    },
    {
      id: DISTRICT.NORTH_CONTINUANCE_SHOULDER,
      name: "North Continuance Shoulder",
      role: "broad accessible continuity zone",
      meaning: "Where the continent stayed open to light, contact, and movement after pressure.",
      storyForces: [STORY_FORCE.CONTINUANCE, STORY_FORCE.GRATITUDE],
      categoryClasses: [CATEGORY.BEACH, CATEGORY.PENINSULA, CATEGORY.ACCESS_EDGE, CATEGORY.SOFT_COAST],
      boundaryReference: "primaryBoundary[2..12]",
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "broad shoulder and accessible beach arcs; no elevation"
    },
    {
      id: DISTRICT.EAST_REOPENING_COAST,
      name: "East Reopening Coast",
      role: "fracture converted into access",
      meaning: "Where Gratitude did not remain closed after adversity.",
      storyForces: [STORY_FORCE.REOPENING, STORY_FORCE.OUTREACH, STORY_FORCE.GRATITUDE],
      categoryClasses: [CATEGORY.BAY, CATEGORY.INLET, CATEGORY.BEACH, CATEGORY.PENINSULA, CATEGORY.CAVERN_MOUTH],
      boundaryReference: "primaryBoundary[11..20]",
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "large bay and inlet behavior; visibly open edge"
    },
    {
      id: DISTRICT.SOUTH_RESTORATION_BELT,
      name: "South Restoration Belt",
      role: "repaired land-water transition",
      meaning: "Where loss became survivable through softer water-edge relationships.",
      storyForces: [STORY_FORCE.REPAIR, STORY_FORCE.SURVIVAL, STORY_FORCE.GRATITUDE],
      categoryClasses: [CATEGORY.WETLAND, CATEGORY.LAGOON, CATEGORY.BAY, CATEGORY.BEACH, CATEGORY.REPAIR_EDGE],
      boundaryReference: "primaryBoundary[20..29]",
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "wetlands, lagoon, repaired beach arcs; no hydrology simulation"
    },
    {
      id: DISTRICT.INTERIOR_MEMORY_FIELD,
      name: "Interior Memory Field",
      role: "protected inland water and stable surface continuity",
      meaning: "Where memory is preserved without becoming imprisonment.",
      storyForces: [STORY_FORCE.MEMORY, STORY_FORCE.SURVIVAL],
      categoryClasses: [CATEGORY.LAKE, CATEGORY.MEMORY_WATER, CATEGORY.PLATEAU_SURFACE],
      boundaryReference: "interior lake rings and plateau surface zones",
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "larger readable lakes; no basin/depression logic"
    },
    {
      id: DISTRICT.SHELTER_MOUTH_BELT,
      name: "Shelter-Mouth Belt",
      role: "temporary refuge boundary system",
      meaning: "Where life withdrew under pressure and returned after stabilization.",
      storyForces: [STORY_FORCE.SHELTER, STORY_FORCE.SURVIVAL],
      categoryClasses: [CATEGORY.CAVERN_MOUTH, CATEGORY.SHELTER_EDGE, CATEGORY.HARD_COAST],
      boundaryReference: "western, southwestern, and eastern shelter-mouth points",
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "small dark mouth markers only; no cave interior"
    },
    {
      id: DISTRICT.OUTREACH_PENINSULAS,
      name: "Outreach Peninsulas",
      role: "land extensions toward the world",
      meaning: "Gratitude reaches outward after surviving inward pressure.",
      storyForces: [STORY_FORCE.OUTREACH, STORY_FORCE.GRATITUDE],
      categoryClasses: [CATEGORY.PENINSULA, CATEGORY.ACCESS_EDGE],
      boundaryReference: "northwestern, northeastern, and eastern extensions",
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "subtle land reaches; no aggressive sprawl"
    },
    {
      id: DISTRICT.PLATEAU_SURFACE_FIELDS,
      name: "Plateau Surface Fields",
      role: "stable topology zones for later terrain handoff",
      meaning: "The ground has internal surface logic, but height is not defined here.",
      storyForces: [STORY_FORCE.STABILITY, STORY_FORCE.SURVIVAL],
      categoryClasses: [CATEGORY.PLATEAU_SURFACE],
      boundaryReference: "surfaceClassRegistry.plateauZones",
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      visualDirective: "data handoff only unless future orchestrator chooses to draw topology zones"
    }
  ]);

  const WATER_EDGE_REGISTRY = Object.freeze({
    beaches: [
      segment(
        "gratitude-beach-north-continuance-arc",
        "North Continuance Beach Arc",
        CATEGORY.BEACH,
        3,
        10,
        DISTRICT.NORTH_CONTINUANCE_SHOULDER,
        STORY_FORCE.CONTINUANCE,
        "The northern edge remained open to movement after pressure."
      ),
      segment(
        "gratitude-beach-east-reopening-mouth",
        "East Reopening Beach Mouth",
        CATEGORY.BEACH,
        12,
        16,
        DISTRICT.EAST_REOPENING_COAST,
        STORY_FORCE.REOPENING,
        "The fractured side became accessible rather than sealed."
      ),
      segment(
        "gratitude-beach-south-restoration-arc",
        "South Restoration Beach Arc",
        CATEGORY.BEACH,
        22,
        25,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.REPAIR,
        "A repaired soft edge where loss became survivable."
      ),
      segment(
        "gratitude-beach-southeast-repaired-transition",
        "Southeast Repaired Beach Transition",
        CATEGORY.BEACH,
        18,
        21,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.GRATITUDE,
        "A small access edge between reopening and restoration."
      )
    ],
    cliffEdges: [
      segment(
        "gratitude-hardcoast-west-pressure-wall",
        "West Pressure Hard Coast",
        CATEGORY.CLIFF_EDGE,
        28,
        33,
        DISTRICT.WEST_ADVERSITY_EDGE,
        STORY_FORCE.ADVERSITY,
        "Hard shoreline category where the oldest pressure was absorbed."
      ),
      segment(
        "gratitude-hardcoast-west-upper-scar",
        "Upper Western Scar Edge",
        CATEGORY.CLIFF_EDGE,
        0,
        4,
        DISTRICT.WEST_ADVERSITY_EDGE,
        STORY_FORCE.SURVIVAL,
        "Scarred but intact hard coast category."
      ),
      segment(
        "gratitude-hardcoast-southwest-survival-edge",
        "Southwest Survival Hard Coast",
        CATEGORY.CLIFF_EDGE,
        25,
        30,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.SURVIVAL,
        "A hard shoreline segment before the restored southern belt opens."
      )
    ],
    cavernMouths: [
      pointFeature(
        "gratitude-cavern-west-pressure-shelter",
        "Western Pressure Shelter Mouth",
        CATEGORY.CAVERN_MOUTH,
        -83,
        8,
        DISTRICT.SHELTER_MOUTH_BELT,
        STORY_FORCE.SHELTER,
        "A boundary-mouth mark where life withdrew during west-edge pressure."
      ),
      pointFeature(
        "gratitude-cavern-upper-west-scar",
        "Upper West Scar Shelter Mouth",
        CATEGORY.CAVERN_MOUTH,
        -79,
        24,
        DISTRICT.SHELTER_MOUTH_BELT,
        STORY_FORCE.SURVIVAL,
        "A small shelter-mouth category near the continuance shoulder."
      ),
      pointFeature(
        "gratitude-cavern-southwest-restoration",
        "Southwest Restoration Shelter Mouth",
        CATEGORY.CAVERN_MOUTH,
        -68,
        -26,
        DISTRICT.SHELTER_MOUTH_BELT,
        STORY_FORCE.REPAIR,
        "A repaired shelter-mouth boundary near the southern restoration belt."
      ),
      pointFeature(
        "gratitude-cavern-east-reopening",
        "Eastern Reopening Shelter Mouth",
        CATEGORY.CAVERN_MOUTH,
        -13,
        3,
        DISTRICT.EAST_REOPENING_COAST,
        STORY_FORCE.REOPENING,
        "A small dark boundary opening on the reopened coast."
      ),
      pointFeature(
        "gratitude-cavern-southeast-repaired-mouth",
        "Southeast Repaired Shelter Mouth",
        CATEGORY.CAVERN_MOUTH,
        -23,
        -15,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.SHELTER,
        "A shelter-mouth category between south repair and east reopening."
      )
    ],
    lakes: [
      ringFeature(
        "gratitude-lake-main-memory",
        "Main Memory Lake",
        CATEGORY.LAKE,
        MAIN_MEMORY_LAKE,
        DISTRICT.INTERIOR_MEMORY_FIELD,
        STORY_FORCE.MEMORY,
        "The protected inland water boundary where survival memory is preserved."
      ),
      ringFeature(
        "gratitude-lake-companion-survival",
        "Companion Survival Lake",
        CATEGORY.LAKE,
        COMPANION_SURVIVAL_LAKE,
        DISTRICT.INTERIOR_MEMORY_FIELD,
        STORY_FORCE.SURVIVAL,
        "A secondary water boundary marking endurance after pressure."
      ),
      ringFeature(
        "gratitude-pool-north-reflection",
        "North Reflection Pool",
        CATEGORY.LAKE,
        SMALL_REFLECTION_POOL_NORTH,
        DISTRICT.INTERIOR_MEMORY_FIELD,
        STORY_FORCE.GRATITUDE,
        "A restrained memory-water boundary near the continuance shoulder."
      ),
      ringFeature(
        "gratitude-pool-south-restoration",
        "South Restoration Reflection Pool",
        CATEGORY.LAKE,
        SMALL_REFLECTION_POOL_SOUTH,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.REPAIR,
        "A small inland water boundary near the restored south."
      )
    ],
    bays: [
      segment(
        "gratitude-bay-east-reopened-gulf",
        "East Reopened Bay",
        CATEGORY.BAY,
        13,
        17,
        DISTRICT.EAST_REOPENING_COAST,
        STORY_FORCE.REOPENING,
        "The largest visible indentation where fracture became access."
      ),
      segment(
        "gratitude-bay-southeast-repair-mouth",
        "Southeast Repair Bay",
        CATEGORY.BAY,
        18,
        21,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.REPAIR,
        "A smaller restored water-contact category."
      ),
      segment(
        "gratitude-bay-south-restored-water",
        "South Restored Bay",
        CATEGORY.BAY,
        22,
        26,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.GRATITUDE,
        "A broad lower bay category tied to restoration."
      )
    ],
    inlets: [
      segment(
        "gratitude-inlet-east-narrow-reopening",
        "Narrow East Reopening Inlet",
        CATEGORY.INLET,
        14,
        16,
        DISTRICT.EAST_REOPENING_COAST,
        STORY_FORCE.REOPENING,
        "A narrow ocean-entry category on the reopened side."
      ),
      segment(
        "gratitude-inlet-southeast-restoration",
        "Southeast Restoration Inlet",
        CATEGORY.INLET,
        18,
        20,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.REPAIR,
        "A narrow repaired water-entry category."
      ),
      segment(
        "gratitude-inlet-southwest-survival-cut",
        "Southwest Survival Cut",
        CATEGORY.INLET,
        26,
        28,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.SURVIVAL,
        "A cut in the repaired edge, retained as access rather than damage."
      )
    ],
    peninsulas: [
      segment(
        "gratitude-peninsula-northwest-continuance",
        "Northwest Continuance Shoulder",
        CATEGORY.PENINSULA,
        1,
        5,
        DISTRICT.OUTREACH_PENINSULAS,
        STORY_FORCE.CONTINUANCE,
        "A shoulder that stayed intact after west-edge pressure."
      ),
      segment(
        "gratitude-peninsula-northeast-outreach",
        "Northeast Outreach Point",
        CATEGORY.PENINSULA,
        8,
        12,
        DISTRICT.OUTREACH_PENINSULAS,
        STORY_FORCE.OUTREACH,
        "A reach toward the world after survival."
      ),
      segment(
        "gratitude-peninsula-east-survival-reach",
        "Eastern Survival Reach",
        CATEGORY.PENINSULA,
        16,
        19,
        DISTRICT.OUTREACH_PENINSULAS,
        STORY_FORCE.GRATITUDE,
        "An outward extension on the reopened side."
      )
    ],
    lagoons: [
      ringFeature(
        "gratitude-lagoon-south-restoration",
        "South Restoration Lagoon",
        CATEGORY.LAGOON,
        SOUTH_RESTORATION_LAGOON,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.REPAIR,
        "A protected water boundary inside the southern repair belt."
      ),
      ringFeature(
        "gratitude-lagoon-east-reopening",
        "East Reopening Lagoon",
        CATEGORY.LAGOON,
        EAST_REOPENING_LAGOON,
        DISTRICT.EAST_REOPENING_COAST,
        STORY_FORCE.REOPENING,
        "A smaller protected water boundary near the reopened coast."
      )
    ],
    wetlands: [
      segment(
        "gratitude-wetland-south-soft-restoration",
        "South Soft Restoration Wetland",
        CATEGORY.WETLAND,
        21,
        27,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.REPAIR,
        "A soft land-water transition category along the restored south."
      ),
      segment(
        "gratitude-wetland-southeast-repaired-transition",
        "Southeast Repaired Wetland Transition",
        CATEGORY.WETLAND,
        17,
        21,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.GRATITUDE,
        "The transitional edge between reopening and restoration."
      ),
      segment(
        "gratitude-wetland-southwest-survival-margin",
        "Southwest Survival Wetland Margin",
        CATEGORY.WETLAND,
        25,
        29,
        DISTRICT.SOUTH_RESTORATION_BELT,
        STORY_FORCE.SURVIVAL,
        "A softening edge after the hard southwest survival coast."
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

  const SURFACE_CLASS_REGISTRY = Object.freeze({
    landmassClasses: [
      {
        id: "gratitude-primary-exposed-body",
        name: "Primary Exposed Body",
        category: CATEGORY.LANDMASS,
        district: "WHOLE_CONTINENT",
        meaning: "The above-seawater exposed land boundary of Gratitude.",
        topologyOnly: true,
        terrainOwned: false,
        elevationOwned: false
      },
      {
        id: "gratitude-repaired-south-surface",
        name: "Repaired South Surface",
        category: CATEGORY.REPAIR_EDGE,
        district: DISTRICT.SOUTH_RESTORATION_BELT,
        meaning: "A surface class readable later by terrain or water systems, but not height-bearing here.",
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
        boundary: [
          p(-62, 4),
          p(-56, 19),
          p(-44, 27),
          p(-32, 22),
          p(-28, 8),
          p(-37, -5),
          p(-52, -8)
        ],
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
        boundary: [
          p(-70, 25),
          p(-60, 36),
          p(-47, 39),
          p(-34, 36),
          p(-25, 29),
          p(-36, 25),
          p(-52, 27)
        ],
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
        boundary: [
          p(-80, 2),
          p(-76, 15),
          p(-72, 27),
          p(-66, 30),
          p(-64, 18),
          p(-66, 6),
          p(-72, -4)
        ],
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
        boundary: [
          p(-26, 18),
          p(-17, 20),
          p(-12, 13),
          p(-14, 4),
          p(-21, -4),
          p(-29, 1),
          p(-31, 10)
        ],
        meaning: "A future-readable surface zone beside the reopened coast; no table height is defined.",
        futureTerrainReadable: true,
        topologyOnly: true,
        terrainOwned: false,
        elevationOwned: false
      }
    ],
    transitionZones: [
      {
        id: "gratitude-west-hard-to-soft-transition",
        name: "West Hard-to-Soft Transition",
        category: CATEGORY.WATER_EDGE,
        fromDistrict: DISTRICT.WEST_ADVERSITY_EDGE,
        toDistrict: DISTRICT.NORTH_CONTINUANCE_SHOULDER,
        meaning: "Where the hard adversity edge begins to become accessible."
      },
      {
        id: "gratitude-east-open-to-south-repair-transition",
        name: "East Open-to-South Repair Transition",
        category: CATEGORY.WATER_EDGE,
        fromDistrict: DISTRICT.EAST_REOPENING_COAST,
        toDistrict: DISTRICT.SOUTH_RESTORATION_BELT,
        meaning: "Where reopening becomes restoration."
      },
      {
        id: "gratitude-south-repair-to-west-survival-transition",
        name: "South Repair-to-West Survival Transition",
        category: CATEGORY.WATER_EDGE,
        fromDistrict: DISTRICT.SOUTH_RESTORATION_BELT,
        toDistrict: DISTRICT.WEST_ADVERSITY_EDGE,
        meaning: "Where softness meets the hard survival margin."
      }
    ]
  });

  const STORY_TO_TOPOLOGY_MAP = Object.freeze([
    {
      storyForce: STORY_FORCE.ADVERSITY,
      topologyStructures: [
        "gratitude-hardcoast-west-pressure-wall",
        "gratitude-hardcoast-west-upper-scar",
        "gratitude-cavern-west-pressure-shelter",
        "gratitude-west-endurance-plateau-surface"
      ],
      meaning: "Adversity becomes hard shoreline classification and shelter-mouth topology, not raised terrain."
    },
    {
      storyForce: STORY_FORCE.SURVIVAL,
      topologyStructures: [
        "gratitude-lake-companion-survival",
        "gratitude-hardcoast-southwest-survival-edge",
        "gratitude-inlet-southwest-survival-cut",
        "gratitude-wetland-southwest-survival-margin"
      ],
      meaning: "Survival becomes protected water, retained hard edge, and repaired access cuts."
    },
    {
      storyForce: STORY_FORCE.GRATITUDE,
      topologyStructures: [
        "gratitude-beach-north-continuance-arc",
        "gratitude-beach-east-reopening-mouth",
        "gratitude-peninsula-east-survival-reach",
        "gratitude-pool-north-reflection"
      ],
      meaning: "Gratitude becomes continued openness after pressure."
    },
    {
      storyForce: STORY_FORCE.REPAIR,
      topologyStructures: [
        "gratitude-lagoon-south-restoration",
        "gratitude-wetland-south-soft-restoration",
        "gratitude-beach-south-restoration-arc",
        "gratitude-bay-south-restored-water"
      ],
      meaning: "Repair becomes wetlands, lagoons, beaches, and restored water-edge categories."
    },
    {
      storyForce: STORY_FORCE.REOPENING,
      topologyStructures: [
        "gratitude-bay-east-reopened-gulf",
        "gratitude-inlet-east-narrow-reopening",
        "gratitude-lagoon-east-reopening",
        "gratitude-east-reopening-table-surface"
      ],
      meaning: "Reopening becomes bays, inlets, and access-bearing eastern topology."
    },
    {
      storyForce: STORY_FORCE.SHELTER,
      topologyStructures: [
        "gratitude-cavern-west-pressure-shelter",
        "gratitude-cavern-upper-west-scar",
        "gratitude-cavern-southwest-restoration",
        "gratitude-cavern-east-reopening",
        "gratitude-cavern-southeast-repaired-mouth"
      ],
      meaning: "Shelter becomes boundary-mouth markers only, not cave interiors."
    },
    {
      storyForce: STORY_FORCE.MEMORY,
      topologyStructures: [
        "gratitude-lake-main-memory",
        "gratitude-lake-companion-survival",
        "gratitude-pool-north-reflection",
        "gratitude-pool-south-restoration",
        "gratitude-central-memory-plateau-surface"
      ],
      meaning: "Memory becomes inland water boundaries and stable surface zones, not basins."
    },
    {
      storyForce: STORY_FORCE.OUTREACH,
      topologyStructures: [
        "gratitude-peninsula-northwest-continuance",
        "gratitude-peninsula-northeast-outreach",
        "gratitude-peninsula-east-survival-reach"
      ],
      meaning: "Outreach becomes peninsulas and access edges."
    },
    {
      storyForce: STORY_FORCE.STABILITY,
      topologyStructures: [
        "gratitude-central-memory-plateau-surface",
        "gratitude-north-continuance-plateau-surface",
        "gratitude-west-endurance-plateau-surface",
        "gratitude-east-reopening-table-surface"
      ],
      meaning: "Stability becomes plateau surface zones for later reading, without height."
    }
  ]);

  const FUTURE_HANDOFFS = Object.freeze({
    terrain: {
      mayRead: [
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
    SOFT_COAST: "soft water-edge transition category"
  });

  const HISTORY_MAP = Object.freeze({
    westCoast: {
      name: "Adversity Edge",
      district: DISTRICT.WEST_ADVERSITY_EDGE,
      meaning: "The coast that absorbed the oldest pressure.",
      topologyClasses: [CATEGORY.CLIFF_EDGE, CATEGORY.CAVERN_MOUTH, CATEGORY.HARD_COAST],
      visualGoal: "scarred, hard, intact",
      terrainOwned: false,
      elevationOwned: false
    },
    northCoast: {
      name: "Continuance Edge",
      district: DISTRICT.NORTH_CONTINUANCE_SHOULDER,
      meaning: "The shoulder that remained open to light and movement after pressure.",
      topologyClasses: [CATEGORY.BEACH, CATEGORY.PENINSULA, CATEGORY.ACCESS_EDGE],
      visualGoal: "broad, accessible, continuous",
      terrainOwned: false,
      elevationOwned: false
    },
    eastCoast: {
      name: "Reopening Edge",
      district: DISTRICT.EAST_REOPENING_COAST,
      meaning: "The broken side that became access instead of closure.",
      topologyClasses: [CATEGORY.BEACH, CATEGORY.BAY, CATEGORY.INLET, CATEGORY.CAVERN_MOUTH, CATEGORY.PENINSULA],
      visualGoal: "open, indented, accessible",
      terrainOwned: false,
      elevationOwned: false
    },
    southCoast: {
      name: "Restoration Edge",
      district: DISTRICT.SOUTH_RESTORATION_BELT,
      meaning: "The boundary where loss became survivable.",
      topologyClasses: [CATEGORY.BEACH, CATEGORY.BAY, CATEGORY.INLET, CATEGORY.LAGOON, CATEGORY.WETLAND],
      visualGoal: "softened, restored, water-rich",
      terrainOwned: false,
      elevationOwned: false
    },
    interior: {
      name: "Memory Field",
      district: DISTRICT.INTERIOR_MEMORY_FIELD,
      meaning: "Protected inland water boundaries that preserve memory without becoming terrain basins.",
      topologyClasses: [CATEGORY.LAKE, CATEGORY.PLATEAU_SURFACE, CATEGORY.MEMORY_WATER],
      visualGoal: "protected interior water and stable surface zones",
      terrainOwned: false,
      elevationOwned: false
    },
    shelterBelt: {
      name: "Shelter-Mouth Belt",
      district: DISTRICT.SHELTER_MOUTH_BELT,
      meaning: "Temporary refuge during pressure; life withdrew, survived, and returned.",
      topologyClasses: [CATEGORY.CAVERN_MOUTH, CATEGORY.SHELTER_EDGE],
      visualGoal: "small boundary-mouth markers, not 3D caves",
      terrainOwned: false,
      elevationOwned: false
    },
    outreach: {
      name: "Outreach Peninsulas",
      district: DISTRICT.OUTREACH_PENINSULAS,
      meaning: "Gratitude reaches outward after surviving inward pressure.",
      topologyClasses: [CATEGORY.PENINSULA, CATEGORY.ACCESS_EDGE],
      visualGoal: "subtle reach without sprawl",
      terrainOwned: false,
      elevationOwned: false
    },
    plateauFields: {
      name: "Plateau Surface Fields",
      district: DISTRICT.PLATEAU_SURFACE_FIELDS,
      meaning: "Stable topology zones for later terrain expression.",
      topologyClasses: [CATEGORY.PLATEAU_SURFACE],
      visualGoal: "data handoff only in current orchestrator",
      terrainOwned: false,
      elevationOwned: false
    }
  });

  const GOVERNING_LAW = Object.freeze({
    short: "Gratitude does not deny adversity; Gratitude remains open after adversity.",
    clauses: [
      "Gratitude is not comfort.",
      "Gratitude is survival without closure.",
      "Gratitude preserves memory without becoming trapped by memory.",
      "Gratitude protects life without closing itself off from the world.",
      "Gratitude reaches outward after surviving inward pressure.",
      "Gratitude holds scars as boundary memory, not as collapse.",
      "Gratitude receives existence as a gift after pressure."
    ]
  });

  const BACKSTORY = [
    "Gratitude is the first surviving continent of Audralia's exposed-land cycle.",
    "It is not the first because it conquered the ocean. It is first because it remained after pressure.",
    "Its western coast absorbed the earliest hard contact and became an adversity edge.",
    "Its eastern boundary fractured open, but the fracture did not become permanent closure; it became reopening.",
    "Its southern boundary softened after damage and became restoration through wetlands, lagoons, and repaired water's-edge logic.",
    "Its northern shoulder stayed broad enough to continue receiving contact, light, and motion.",
    "Its interior water boundaries preserve memory without creating terrain basins.",
    "Its shelter-mouth points mark places of temporary refuge during pressure, not caves or underground systems.",
    "Its plateau surface fields mark future-readable stable surface zones, not elevation.",
    "Gratitude is the map of a landmass that suffered and stayed open."
  ].join(" ");

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

  const LANDMASSES = Object.freeze([
    {
      id: "gratitude-primary-ground-basis-body",
      type: "primary",
      cells: 21,
      oceanAdjacency: true,
      boundary: PRIMARY_BOUNDARY,
      subBoundaries: {
        westScar: WEST_SCAR_SUBBOUNDARY,
        eastReopening: EAST_REOPENING_SUBBOUNDARY,
        southRestoration: SOUTH_RESTORATION_SUBBOUNDARY,
        northContinuance: NORTH_CONTINUANCE_SUBBOUNDARY
      },
      topology: buildRenderTopologyFromRegistry()
    }
  ]);

  const TOPOLOGY = Object.freeze({
    id: "gratitude-full-topology-ground-basis",
    summit: "Gratitude",
    name: "Gratitude",
    cells: 21,
    className: "primary",
    localLattice: "gratitude_21_full_topology_ground_basis_lattice",
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
    waterEdgeRegistry: WATER_EDGE_REGISTRY,
    surfaceClassRegistry: SURFACE_CLASS_REGISTRY,
    storyTopologyMap: STORY_TO_TOPOLOGY_MAP,
    futureHandoffs: FUTURE_HANDOFFS,
    categoryMeanings: CATEGORY_MEANINGS,
    historyMap: HISTORY_MAP,
    visualLeverage: {
      boundaryNodeCount: PRIMARY_BOUNDARY.length,
      priorBoundaryWasTooThin: true,
      westSideHarder: true,
      eastSideReopened: true,
      southSideRestored: true,
      lakesStrengthened: true,
      lagoonsStrengthened: true,
      wetlandsStrengthened: true,
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
      note: "If this does not create visible change, the next failure is the orchestrator render limit, not the Gratitude topology file."
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

      fullTopologyGroundBasisActive: true,
      thinMetadataStubReplaced: true,
      adversitySurvivalHistoryActive: true,
      firstSurvivingContinent: true,

      boundaryNodeCount: PRIMARY_BOUNDARY.length,
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
      outreachPeninsulas: true,
      plateauSurfaceFields: true,

      governingLaw: clone(GOVERNING_LAW),
      categoryMeanings: clone(CATEGORY_MEANINGS),
      historyMap: clone(HISTORY_MAP),
      futureHandoffs: clone(FUTURE_HANDOFFS),

      currentRendererConsumes: clone(TOPOLOGY.visualLeverage.consumedByCurrentOrchestrator),

      owns: [
        "Gratitude full topology ground-basis",
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
    getFutureHandoffs
  };

  if (hasWindow()) {
    window.AUDRALIA_TOPOLOGY_GRATITUDE = api;
    window.AUDRALIA_TOPOLOGY_GRATITUDE_RECEIPT = getStatus();
    window.AUDRALIA_GRATITUDE_FULL_TOPOLOGY_GROUND_BASIS_ACTIVE = true;
    window.AUDRALIA_GRATITUDE_ADVERSITY_SURVIVAL_TOPOLOGY_ACTIVE = true;
  }
})();
