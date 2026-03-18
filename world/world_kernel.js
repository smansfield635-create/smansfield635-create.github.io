export const WORLD_KERNEL = Object.freeze((() => {
  const VERSION = "kernel-cog-v4";

  function freezeObjectDeep(value) {
    if (!value || typeof value !== "object") return value;
    if (Object.isFrozen(value)) return value;
    Object.freeze(value);
    for (const key of Object.keys(value)) {
      freezeObjectDeep(value[key]);
    }
    return value;
  }

  function buildReservedNames(prefix, start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => `${prefix}_${start + i}`);
  }

  function buildStateRegistryDefinitions() {
    const block0 = [
      "VOID",
      "AIR_STILL",
      "AIR_MOIST",
      "AIR_COLD",
      "AIR_WARM",
      "FOG",
      "MIST",
      "CLOUD_THIN",
      "CLOUD_DENSE",
      "STORM_CELL",
      "AURORA_ACTIVE",
      "AURORA_PASSIVE",
      "ASH_LIGHT",
      "ASH_HEAVY",
      "SMOKE_LIGHT",
      "SMOKE_HEAVY",
      "DUST_LIGHT",
      "DUST_HEAVY",
      "VAPOR_RISING",
      "VAPOR_CONDENSING",
      "WIND_CALM",
      "WIND_ACTIVE",
      "WIND_SHEAR",
      "PRESSURE_LOW",
      "PRESSURE_HIGH",
      "ELECTRICAL_CHARGE_LOW",
      "ELECTRICAL_CHARGE_HIGH",
      "PARTICULATE_LIGHT",
      "PARTICULATE_DENSE"
    ].concat(buildReservedNames("RESERVED_AIR", 29, 31));

    const block1 = [
      "WATER_STILL_SHALLOW",
      "WATER_STILL_DEEP",
      "WATER_FLOWING_WEAK",
      "WATER_FLOWING_STRONG",
      "WATER_BASIN_RETAINED",
      "WATER_CHANNELLED",
      "WATER_FALLING",
      "WATER_SHELF",
      "WATER_SLOPE",
      "WATER_ABYSS",
      "WATER_TRENCH",
      "WATER_WAVE_LOW",
      "WATER_WAVE_HIGH",
      "WATER_TIDAL_ADVANCE",
      "WATER_TIDAL_RETREAT",
      "WATER_DELTA",
      "WATER_MARSH_OPEN",
      "WATER_MARSH_DENSE",
      "WATER_SEEPING",
      "WATER_SATURATED",
      "WATER_BRACKISH",
      "WATER_MINERAL_RICH",
      "WATER_GLACIAL_RUNOFF",
      "WATER_THERMAL",
      "WATER_EVAPORATING",
      "WATER_CONDENSING",
      "WATER_POLLUTED_LIGHT",
      "WATER_POLLUTED_HEAVY"
    ].concat(buildReservedNames("RESERVED_WATER", 60, 63));

    const block2 = [
      "ICE_SHEET",
      "ICE_PACK",
      "ICE_THIN",
      "ICE_CRACKING",
      "ICE_MELTING",
      "ICE_REFORMING",
      "SNOW_LIGHT",
      "SNOW_DENSE",
      "SNOWPACK",
      "SNOW_MELTING",
      "FROST_LIGHT",
      "FROST_HEAVY",
      "GLACIER_STABLE",
      "GLACIER_ADVANCING",
      "GLACIER_RETREATING",
      "SLUSH",
      "PERMAFROST",
      "POLAR_SURFACE",
      "SUBPOLAR_SURFACE",
      "HAIL_FIELD",
      "RIME_ICE",
      "BLACK_ICE",
      "ICE_SATURATED",
      "ICE_MINERAL_RICH",
      "ICE_COMPRESSED",
      "ICE_SHEAR_ZONE"
    ].concat(buildReservedNames("RESERVED_CRYO", 90, 95));

    const block3 = [
      "SOIL_DRY",
      "SOIL_MOIST",
      "SOIL_SATURATED",
      "SAND_DRY",
      "SAND_WET",
      "SILT_DRY",
      "SILT_WET",
      "CLAY_DRY",
      "CLAY_WET",
      "GRAVEL_LOOSE",
      "GRAVEL_LOCKED",
      "BEDROCK_EXPOSED",
      "BEDROCK_CRACKED",
      "BEDROCK_WEATHERING",
      "SEDIMENT_LIGHT",
      "SEDIMENT_HEAVY",
      "MUD_SOFT",
      "MUD_DENSE",
      "PEAT",
      "ORGANIC_LITTER",
      "DELTA_DEPOSIT",
      "DUNE_ACTIVE",
      "DUNE_LOCKED",
      "TALUS",
      "SCREE",
      "ALLUVIUM",
      "LATERITE",
      "SALT_FLAT",
      "BASALT_EXPOSED",
      "GRANITE_EXPOSED",
      "MARBLE_EXPOSED",
      "RESERVED_SUBSTRATE_127"
    ];

    const block4 = [
      "VEGETATION_SPARSE",
      "VEGETATION_GROWING",
      "VEGETATION_DENSE",
      "GRASSLAND_TEMPERATE",
      "GRASSLAND_TROPICAL",
      "FOREST_TEMPERATE",
      "FOREST_BOREAL",
      "RAINFOREST_TROPICAL",
      "SHRUBLAND_DRY",
      "WETLAND_REED",
      "WETLAND_MANGROVE",
      "TUNDRA_MOSS",
      "TUNDRA_LICHEN",
      "DESERT_SCRUB",
      "RIPARIAN_LIGHT",
      "RIPARIAN_DENSE",
      "ALPINE_LOW",
      "ALPINE_DENSE",
      "CANOPY_OPEN",
      "CANOPY_DENSE",
      "ROOTED_BANK",
      "ERODED_VEGETATION",
      "BURNT_VEGETATION",
      "REGROWTH_EARLY",
      "REGROWTH_MID",
      "REGROWTH_LATE"
    ].concat(buildReservedNames("RESERVED_VEG", 154, 159));

    const block5 = [
      "THERMAL_CALM",
      "THERMAL_ACTIVE",
      "THERMAL_HIGH",
      "MAGMA_LOCKED",
      "MAGMA_MOBILE",
      "FIRE_START",
      "FIRE_ACTIVE_LOW",
      "FIRE_ACTIVE_HIGH",
      "FIRE_SMOLDER",
      "FIRE_EXHAUSTED",
      "ASH_DEPOSIT",
      "CHAR_LAYER",
      "HEAT_STRESS_LOW",
      "HEAT_STRESS_HIGH",
      "DRYING_ACTIVE",
      "MELT_ACTIVE",
      "FREEZE_ACTIVE",
      "OXIDATION_LIGHT",
      "OXIDATION_HEAVY",
      "CHEMICAL_ACTIVE_LOW",
      "CHEMICAL_ACTIVE_HIGH",
      "ELECTRICAL_SURGE",
      "STATIC_BUILDUP",
      "STEAM_RELEASE",
      "BOIL_ACTIVE",
      "COOLING_ACTIVE"
    ].concat(buildReservedNames("RESERVED_THERMAL", 186, 191));

    const block6 = [
      "FOUNDATION_STABLE",
      "FOUNDATION_WEAK",
      "PATH_EARTH",
      "PATH_STONE",
      "BRIDGE_STABLE",
      "BRIDGE_STRESSED",
      "WALL_STABLE",
      "WALL_DAMAGED",
      "TOWER_STABLE",
      "TOWER_DAMAGED",
      "HARBOR_WORKS",
      "CANAL_WORKS",
      "FARMLAND_ACTIVE",
      "FARMLAND_FALLOW",
      "SETTLEMENT_LIGHT",
      "SETTLEMENT_DENSE",
      "INDUSTRIAL_LIGHT",
      "INDUSTRIAL_HEAVY",
      "DRAINAGE_WORKS",
      "RETAINING_WORKS",
      "FORTIFICATION_LIGHT",
      "FORTIFICATION_HEAVY",
      "ROAD_LIGHT",
      "ROAD_HEAVY",
      "POWER_NODE_ACTIVE",
      "POWER_NODE_FAILING",
      "SIGNAL_NODE_ACTIVE",
      "SIGNAL_NODE_FAILING"
    ].concat(buildReservedNames("RESERVED_CIV", 220, 223));

    const block7 = [
      "LOCKED_STATIC",
      "LOCKED_SCRIPTED",
      "EVENT_PENDING",
      "EVENT_ACTIVE",
      "EVENT_RESOLVING",
      "BOUNDARY_HARD",
      "BOUNDARY_SOFT",
      "SAFE_ZONE",
      "HAZARD_ZONE",
      "CHECKPOINT",
      "BASIN_RESTORE_NODE",
      "SUMMIT_CLEAR_NODE",
      "TRANSITION_GATE",
      "ADMISSIBILITY_BLOCK",
      "ADMISSIBILITY_ALLOW",
      "MEMORY_ECHO",
      "TEMP_OVERRIDE",
      "DEBUG_MARK",
      "DIAGNOSTIC_MARK",
      "PLAYER_TRACE",
      "NPC_TRACE",
      "STORY_TRIGGER",
      "STORY_ACTIVE",
      "STORY_RESOLVED"
    ].concat(buildReservedNames("RESERVED_META", 248, 255));

    return Object.freeze([
      Object.freeze({ start: 0, end: 31, family: "air_passive", labels: Object.freeze(block0) }),
      Object.freeze({ start: 32, end: 63, family: "water_family", labels: Object.freeze(block1) }),
      Object.freeze({ start: 64, end: 95, family: "cryosphere_family", labels: Object.freeze(block2) }),
      Object.freeze({ start: 96, end: 127, family: "substrate_family", labels: Object.freeze(block3) }),
      Object.freeze({ start: 128, end: 159, family: "vegetation_family", labels: Object.freeze(block4) }),
      Object.freeze({ start: 160, end: 191, family: "thermal_reactive_family", labels: Object.freeze(block5) }),
      Object.freeze({ start: 192, end: 223, family: "civilization_family", labels: Object.freeze(block6) }),
      Object.freeze({ start: 224, end: 255, family: "meta_event_family", labels: Object.freeze(block7) })
    ]);
  }

  function buildStateRegistry(definitions) {
    const byCode = {};
    const codesByName = {};
    const familyByCode = {};

    for (const block of definitions) {
      for (let offset = 0; offset < block.labels.length; offset += 1) {
        const code = block.start + offset;
        const label = block.labels[offset];
        byCode[code] = Object.freeze({
          code,
          label,
          family: block.family,
          blockStart: block.start,
          blockEnd: block.end
        });
        codesByName[label] = code;
        familyByCode[code] = block.family;
      }
    }

    return Object.freeze({
      definitions,
      byCode: freezeObjectDeep(byCode),
      codesByName: freezeObjectDeep(codesByName),
      familyByCode: freezeObjectDeep(familyByCode)
    });
  }

  function buildEnumRegistry(vocabulary) {
    return Object.freeze({
      version: 1,
      terrain: Object.freeze(["UNKNOWN", ...vocabulary.terrainClasses]),
      surface: Object.freeze(["UNKNOWN", ...vocabulary.surfaceMaterials]),
      biome: Object.freeze(["UNKNOWN", ...vocabulary.biomeTypes]),
      climate: Object.freeze(["UNKNOWN", ...vocabulary.climateBands]),
      drainage: Object.freeze([
        "UNKNOWN",
        "NONE",
        "CLOSED_BASIN",
        "OPEN_FLOW",
        "RIVER_ACTIVE",
        "FLOODPLAIN",
        "WETLAND_DRAIN"
      ])
    });
  }

  const STATE_DEFINITIONS = buildStateRegistryDefinitions();
  const STATE_REGISTRY = buildStateRegistry(STATE_DEFINITIONS);

  const RULE_FAMILY_REGISTRY = freezeObjectDeep({
    WATER_RETENTION_SPREAD: Object.freeze({
      id: "WATER_RETENTION_SPREAD",
      precedence: 2,
      description: "Water-family states persist in basins and move across slopes."
    }),
    FREEZE_MELT: Object.freeze({
      id: "FREEZE_MELT",
      precedence: 1,
      description: "Water-family and cryosphere-family states convert under thermal thresholds."
    }),
    WETTING_DRYING: Object.freeze({
      id: "WETTING_DRYING",
      precedence: 3,
      description: "Substrate-family states shift between dry, moist, and saturated regimes."
    })
  });

  const RULE_PRECEDENCE_REGISTRY = Object.freeze([
    "FREEZE_MELT",
    "WATER_RETENTION_SPREAD",
    "WETTING_DRYING"
  ]);

  const SIMULATION_TICK_CONTRACT = freezeObjectDeep({
    neighborhoodMode: "SURFACE_RING_8",
    doubleBufferRequired: true,
    simulationTickHz: 6,
    renderDecoupledFromSimulation: true,
    stateChannels: Object.freeze([
      "stateCode",
      "stateAge"
    ]),
    firstRuleFamilies: Object.freeze([
      "WATER_RETENTION_SPREAD",
      "FREEZE_MELT",
      "WETTING_DRYING"
    ])
  });

  const STATE_CHANNEL_CONTRACT = freezeObjectDeep({
    required: Object.freeze([
      "stateCode",
      "stateAge"
    ]),
    optional: Object.freeze([
      "stateEnergy",
      "stateFlags",
      "stateAux",
      "transitionFamily",
      "transitionAdmissible"
    ])
  });

  const CONSTANTS = Object.freeze({
    structuralLatticeWidth: 16,
    structuralLatticeHeight: 16,
    structuralCoordinateCount: 16,
    executionCoordinateCount: 16,

    planetSampleLatticeWidth: 256,
    planetSampleLatticeHeight: 256,
    planetSampleTotal: 65536,

    localGridRows: 4,
    localGridCols: 4,
    localGridCells: 16,

    initialYaw: -0.18,
    initialPitch: -0.34,
    minPitch: -1.15,
    maxPitch: 1.15,
    inertiaDecay: 0.94,
    dragSensitivity: 0.0065,

    worldRadiusFactor: 0.34,
    atmosphereThicknessFactor: 0.08,

    seaLevelNormalized: 0.0,
    landTarget: 0.29,
    waterTarget: 0.71,
    ratioTolerance: 0.005,

    contourSeedA: 1109,
    contourSeedB: 2713,
    contourSeedC: 4079,
    contourAmplitude: 0.07,
    contourSigma: 0.06,
    macroThreshold: 0.16,
    finalLandThresholdDefault: 0.18,
    shorelineBandHalfWidth: 0.018,

    equatorialMaxAbsLat: 15,
    tropicalMaxAbsLat: 30,
    temperateMaxAbsLat: 55,
    subpolarMaxAbsLat: 70,
    polarMaxAbsLat: 90,

    thermalBaseline: 0.64,
    axialTiltDegrees: 23.5,
    thermalPolarCoolingStrength: 0.55,
    thermalWildernessDecayStrength: 0.65,

    magneticBaseline: 0.22,
    gravityConstant: 9.81,

    hydrologyRunoffStrength: 0.52,
    hydrologyRiverThreshold: 0.48,
    hydrologyLakeThreshold: 0.50,

    topologyMountainThreshold: 0.38,
    topologyBasinThreshold: 0.26,
    topologyCanyonThreshold: 0.32,
    topologyCaveThreshold: 0.50,

    sedimentDepositionThreshold: 0.48,
    sedimentErosionScalar: 0.12,

    dtMsThreshold: 16.6,
    targetFps: 60
  });

  const STRUCTURAL_COORDINATES = Object.freeze(
    Array.from({ length: CONSTANTS.structuralCoordinateCount }, (_, i) => `S${i}`)
  );

  const EXECUTION_COORDINATES = Object.freeze(
    Array.from({ length: CONSTANTS.executionCoordinateCount }, (_, i) => `E${i}`)
  );

  const LOCAL_GRID = Object.freeze({
    rows: Object.freeze([0, 1, 2, 3]),
    cols: Object.freeze([0, 1, 2, 3]),
    cellIds: Object.freeze([
      "R0C0", "R0C1", "R0C2", "R0C3",
      "R1C0", "R1C1", "R1C2", "R1C3",
      "R2C0", "R2C1", "R2C2", "R2C3",
      "R3C0", "R3C1", "R3C2", "R3C3"
    ])
  });

  const CARDINALS = Object.freeze({
    north: Object.freeze({ id: "north", role: "structure" }),
    south: Object.freeze({ id: "south", role: "environment" }),
    east: Object.freeze({ id: "east", role: "execution" }),
    west: Object.freeze({ id: "west", role: "representation" })
  });

  const RECURSION_LAW = Object.freeze({
    pattern: "1→4→1",
    description: "Core differentiates into four axes and recombines into one lawful system."
  });

  const DEPTH_REGISTRY = Object.freeze([
    Object.freeze({ id: "cosmic", index: 0, label: "Cosmic", zoneBearing: false }),
    Object.freeze({ id: "galaxy", index: 1, label: "Galaxy", zoneBearing: false }),
    Object.freeze({ id: "solar", index: 2, label: "Solar", zoneBearing: false }),
    Object.freeze({ id: "planet", index: 3, label: "Planet", zoneBearing: false }),
    Object.freeze({ id: "surface", index: 4, label: "Surface", zoneBearing: true }),
    Object.freeze({ id: "harbor", index: 5, label: "Harbor", zoneBearing: false }),
    Object.freeze({ id: "gratitude", index: 6, label: "Gratitude", zoneBearing: false }),
    Object.freeze({ id: "generosity", index: 7, label: "Generosity", zoneBearing: false })
  ]);

  const DEPTH_ORDER = Object.freeze(DEPTH_REGISTRY.map((item) => item.id));

  const TERRAIN_CLASSES = Object.freeze([
    "WATER",
    "SHELF",
    "SHORELINE",
    "BEACH",
    "LOWLAND",
    "FOOTHILL",
    "RIDGE",
    "PLATEAU",
    "MOUNTAIN",
    "SUMMIT",
    "BASIN",
    "CANYON",
    "POLAR_ICE",
    "GLACIAL_HIGHLAND"
  ]);

  const SURFACE_MATERIALS = Object.freeze([
    "NONE",
    "BEDROCK",
    "GRAVEL",
    "SAND",
    "SILT",
    "CLAY",
    "SOIL",
    "ICE",
    "SNOW"
  ]);

  const BIOME_TYPES = Object.freeze([
    "NONE",
    "TROPICAL_RAINFOREST",
    "TROPICAL_GRASSLAND",
    "TEMPERATE_FOREST",
    "TEMPERATE_GRASSLAND",
    "DESERT",
    "TUNDRA",
    "WETLAND",
    "BOREAL_FOREST",
    "GLACIER"
  ]);

  const CLIMATE_BANDS = Object.freeze([
    "EQUATORIAL",
    "TROPICAL",
    "TEMPERATE",
    "SUBPOLAR",
    "POLAR"
  ]);

  const ENUM_REGISTRY = buildEnumRegistry(Object.freeze({
    terrainClasses: TERRAIN_CLASSES,
    surfaceMaterials: SURFACE_MATERIALS,
    biomeTypes: BIOME_TYPES,
    climateBands: CLIMATE_BANDS
  }));

  const ENVIRONMENT_FAMILIES = Object.freeze({
    macroWorld: Object.freeze([
      "landMask",
      "waterMask",
      "macroLandScore",
      "finalLandScore",
      "continentMass",
      "macroRegion",
      "subRegion",
      "harborBridgeSupport",
      "oceanCarveTotal"
    ]),
    summitBasin: Object.freeze([
      "strongestSummitId",
      "strongestSummitScore",
      "strongestBasinId",
      "strongestBasinScore"
    ]),
    lithosphere: Object.freeze([
      "materialType",
      "diamondDensity",
      "opalDensity",
      "graniteDensity",
      "marbleDensity",
      "metalDensity",
      "baseElevation"
    ]),
    hydrology: Object.freeze([
      "waterDepth",
      "seaLevel",
      "rainfall",
      "runoff",
      "basinAccumulation",
      "drainage",
      "riverCandidate",
      "lakeCandidate",
      "distanceToWater",
      "distanceToLand"
    ]),
    thermodynamic: Object.freeze([
      "temperature",
      "thermalGradient",
      "freezePotential",
      "meltPotential",
      "evaporationPressure",
      "climateBandField"
    ]),
    sediment: Object.freeze([
      "sedimentType",
      "sedimentLoad",
      "transportPotential",
      "depositionPotential",
      "shorelineBand",
      "beachCandidate"
    ]),
    magnetic: Object.freeze([
      "magneticIntensity",
      "shieldingGradient",
      "auroralPotential",
      "navigationBias",
      "navigationStability",
      "gravityConstraint"
    ]),
    topologyDerived: Object.freeze([
      "elevation",
      "oceanDepthField",
      "shoreline",
      "terrainClass",
      "slope",
      "curvature",
      "ridgeStrength",
      "basinStrength",
      "divideStrength",
      "plateauStrength",
      "canyonStrength",
      "cavePotential"
    ]),
    surfaceBiome: Object.freeze([
      "surfaceMaterial",
      "biomeType"
    ]),
    stateChannels: Object.freeze([
      "stateCode",
      "stateAge"
    ])
  });

  const FILE_HOME_REGISTRY = Object.freeze({
    "world/world_kernel.js": Object.freeze([
      "cardinal_stack",
      "lattice_geometry",
      "canonical_constants",
      "environment_family_registry",
      "terrain_vocabulary",
      "surface_material_vocabulary",
      "biome_vocabulary",
      "climate_band_vocabulary",
      "state_channel_contract",
      "state_registry",
      "rule_family_registry",
      "rule_precedence_registry",
      "simulation_tick_contract",
      "depth_registry",
      "planet_field_contract",
      "planet_sample_contract",
      "canon_verification",
      "file_ownership_registry",
      "dependency_registry"
    ]),
    "world/planet_engine.js": Object.freeze([
      "planet_field_generation",
      "macro_world_realization",
      "summit_basin_realization",
      "surface_biome_realization",
      "initial_state_seeding_handoff",
      "field_summary",
      "field_completeness"
    ]),
    "world/rule_engine.js": Object.freeze([
      "state_seeding_law",
      "state_buffer_contract",
      "neighborhood_read_law",
      "transition_family_execution",
      "state_step_execution",
      "transition_summary"
    ]),
    "world/render.js": Object.freeze([
      "space_expression",
      "atmosphere_expression",
      "surface_expression",
      "ocean_expression",
      "draw_order",
      "render_audit"
    ]),
    "world/control.js": Object.freeze([
      "input_handling",
      "projection_state",
      "selection_state",
      "orientation_state",
      "inverse_projection"
    ]),
    "assets/instruments.js": Object.freeze([
      "runtime_panels",
      "field_panels",
      "verification_panels",
      "failure_panels",
      "state_panels_later"
    ]),
    "assets/ui.css": Object.freeze([
      "shell_layout",
      "panel_layout",
      "responsive_layout"
    ]),
    "index.html": Object.freeze([
      "document_shell",
      "mount_points",
      "boot_entry",
      "runtime_orchestration",
      "frame_scheduling",
      "simulation_cadence",
      "error_capture"
    ])
  });

  const DEPENDENCY_REGISTRY = Object.freeze([
    "world/world_kernel.js",
    "world/planet_engine.js",
    "world/rule_engine.js",
    "world/render.js",
    "world/control.js",
    "assets/instruments.js",
    "assets/ui.css",
    "index.html"
  ]);

  const OWNERSHIP_REGISTRY = Object.freeze(
    Object.fromEntries(
      Object.entries(FILE_HOME_REGISTRY).flatMap(([filePath, constructs]) =>
        constructs.map((construct) => [construct, filePath])
      )
    )
  );

  const DUPLICATE_TRUTH_REGISTRY = Object.freeze([
    "cardinal_stack",
    "lattice_geometry",
    "canonical_constants",
    "environment_family_registry",
    "terrain_vocabulary",
    "surface_material_vocabulary",
    "biome_vocabulary",
    "climate_band_vocabulary",
    "state_channel_contract",
    "state_registry",
    "rule_family_registry",
    "rule_precedence_registry",
    "simulation_tick_contract",
    "planet_field_contract",
    "planet_sample_contract",
    "canon_verification",
    "file_ownership_registry",
    "dependency_registry"
  ]);

  const PLANET_FIELD_PULSE_ORDER = Object.freeze([
    "base_sample_grid",
    "macro_continent_field",
    "land_water_classification",
    "continent_labels",
    "summit_realization",
    "basin_realization",
    "ocean_depth_realization",
    "climate_bands",
    "topology_fields",
    "thermodynamics",
    "hydrology",
    "magnetics",
    "materials",
    "sediment",
    "surface_biome_threshold_bands",
    "surface_biome_precedence_tiebreak",
    "surface_biome_sampling_unit_assignment",
    "final_terrain_class",
    "initial_state_seeding_handoff",
    "summary_completeness"
  ]);

  const CANONICAL_SAMPLE_CONTRACT = Object.freeze([
    "x",
    "y",
    "latDeg",
    "lonDeg",
    "visible",

    "parentAddress",
    "localAddress",
    "seedSignature",
    "nestedLatticeDepth",

    "landMask",
    "waterMask",
    "macroLandScore",
    "finalLandScore",

    "baseElevation",
    "elevation",
    "seaLevel",
    "waterDepth",
    "oceanDepthField",
    "terrainClass",
    "shoreline",
    "shorelineBand",
    "beachCandidate",
    "continentMass",
    "macroRegion",
    "subRegion",

    "strongestSummitId",
    "strongestSummitScore",
    "strongestBasinId",
    "strongestBasinScore",

    "slope",
    "curvature",
    "ridgeStrength",
    "basinStrength",
    "divideStrength",
    "plateauStrength",
    "canyonStrength",
    "cavePotential",

    "temperature",
    "thermalGradient",
    "freezePotential",
    "meltPotential",
    "evaporationPressure",
    "climateBandField",

    "rainfall",
    "runoff",
    "basinAccumulation",
    "drainage",
    "riverCandidate",
    "lakeCandidate",
    "distanceToWater",
    "distanceToLand",

    "magneticIntensity",
    "shieldingGradient",
    "auroralPotential",
    "navigationBias",
    "navigationStability",
    "gravityConstraint",

    "materialType",
    "diamondDensity",
    "opalDensity",
    "graniteDensity",
    "marbleDensity",
    "metalDensity",

    "sedimentType",
    "sedimentLoad",
    "transportPotential",
    "depositionPotential",

    "surfaceMaterial",
    "biomeType",

    "stateCode",
    "stateAge",

    "eventFlags"
  ]);

  const PLANET_FIELD_CONTRACT = Object.freeze({
    width: CONSTANTS.planetSampleLatticeWidth,
    height: CONSTANTS.planetSampleLatticeHeight,
    total: CONSTANTS.planetSampleTotal,
    order: PLANET_FIELD_PULSE_ORDER,
    pulseOrder: PLANET_FIELD_PULSE_ORDER,
    sampleContract: CANONICAL_SAMPLE_CONTRACT,
    summaryRequired: true,
    completenessRequired: true
  });

  const NAMING = Object.freeze({
    kernelLabel: "KERNEL_COG",
    baselineLabel: "compressed_256_world_v4",
    planetFieldLabel: "planetField",
    sampleLabel: "planetSample",
    stateSampleLabel: "stateSample",
    structuralLatticeLabel: "structuralLattice16",
    planetSampleLatticeLabel: "planetSampleLattice256"
  });

  const SCOPE = Object.freeze({
    includeEvents: true,
    includeVariants: true,
    includeUI: true,
    activeBranch: "compressed_world_v4"
  });

  const FEATURE_FLAGS = Object.freeze({
    enablePlanetField: true,
    enableVariants: true,
    enableDiagnostics: true,
    enableVerification: true,
    enableRuleEngine: true,
    nestedLatticeEnabled: false
  });

  const FUTURE_SCALING = Object.freeze({
    universeSeed: null,
    universalAddress: null,
    nestedLatticeEnabled: false,
    activeFieldState: "active",
    passiveFieldState: "passive"
  });

  function normalizeArray(value) {
    return Array.isArray(value) ? value.map((item) => String(item)) : [];
  }

  function normalizeBoolean(value, fallback = false) {
    return typeof value === "boolean" ? value : fallback;
  }

  function normalizeString(value, fallback = "") {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }

  function normalizeObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function buildExpectedCanonStructure() {
    return Object.freeze({
      fileHomes: FILE_HOME_REGISTRY,
      dependency: DEPENDENCY_REGISTRY,
      ownership: OWNERSHIP_REGISTRY,
      duplicateTruth: DUPLICATE_TRUTH_REGISTRY,
      pulseOrder: PLANET_FIELD_PULSE_ORDER,
      sampleContract: CANONICAL_SAMPLE_CONTRACT,
      scope: SCOPE
    });
  }

  function compareFileHomes(expected, received) {
    const expectedEntries = Object.entries(expected);
    if (expectedEntries.length === 0) return false;

    return expectedEntries.every(([filePath, constructs]) => {
      const got = received[filePath];
      return (
        Array.isArray(got) &&
        got.length === constructs.length &&
        constructs.every((construct, index) => got[index] === construct)
      );
    });
  }

  function compareDependency(expected, received) {
    return (
      Array.isArray(received) &&
      received.length === expected.length &&
      expected.every((item, index) => received[index] === item)
    );
  }

  function compareOwnership(expected, received) {
    const expectedEntries = Object.entries(expected);
    if (expectedEntries.length === 0) return false;
    return expectedEntries.every(([construct, filePath]) => received[construct] === filePath);
  }

  function compareDuplicateTruth(expected, received) {
    if (!Array.isArray(received) || received.length !== expected.length) return false;
    const seen = new Set(received);
    return seen.size === expected.length && expected.every((item) => seen.has(item));
  }

  function comparePulseOrder(expected, received) {
    return (
      Array.isArray(received) &&
      received.length === expected.length &&
      expected.every((item, index) => received[index] === item)
    );
  }

  function compareSampleContract(expected, received) {
    return (
      Array.isArray(received) &&
      received.length === expected.length &&
      expected.every((item, index) => received[index] === item)
    );
  }

  function compareScope(expected, received) {
    return (
      normalizeBoolean(received.includeEvents, !expected.includeEvents) === expected.includeEvents &&
      normalizeBoolean(received.includeVariants, !expected.includeVariants) === expected.includeVariants &&
      normalizeBoolean(received.includeUI, !expected.includeUI) === expected.includeUI &&
      normalizeString(received.activeBranch) === expected.activeBranch
    );
  }

  function verifyCanonicalStructure(input = {}) {
    const received = normalizeObject(input);
    const expected = buildExpectedCanonStructure();

    const file_home_pass = compareFileHomes(expected.fileHomes, normalizeObject(received.fileHomes));
    const dependency_pass = compareDependency(expected.dependency, normalizeArray(received.dependency ?? received.chronology));
    const ownership_pass = compareOwnership(expected.ownership, normalizeObject(received.ownership));
    const duplicate_truth_pass = compareDuplicateTruth(expected.duplicateTruth, normalizeArray(received.duplicateTruth));
    const pulse_order_pass = comparePulseOrder(expected.pulseOrder, normalizeArray(received.pulseOrder ?? received.fieldOrder));
    const sample_contract_pass = compareSampleContract(expected.sampleContract, normalizeArray(received.sampleContract));
    const scope_pass = compareScope(expected.scope, normalizeObject(received.scope));

    const reasons = [];
    if (!file_home_pass) reasons.push("file_home_mismatch");
    if (!dependency_pass) reasons.push("dependency_registry_mismatch");
    if (!ownership_pass) reasons.push("ownership_mismatch");
    if (!duplicate_truth_pass) reasons.push("duplicate_truth_mismatch");
    if (!pulse_order_pass) reasons.push("pulse_order_mismatch");
    if (!sample_contract_pass) reasons.push("sample_contract_mismatch");
    if (!scope_pass) reasons.push("scope_mismatch");

    return Object.freeze({
      pass:
        file_home_pass &&
        dependency_pass &&
        ownership_pass &&
        duplicate_truth_pass &&
        pulse_order_pass &&
        sample_contract_pass &&
        scope_pass,
      file_home_pass,
      dependency_pass,
      chronology_pass: dependency_pass,
      ownership_pass,
      duplicate_truth_pass,
      pulse_order_pass,
      field_order_pass: pulse_order_pass,
      sample_contract_pass,
      scope_pass,
      reasons: Object.freeze(reasons)
    });
  }

  return Object.freeze({
    version: VERSION,
    label: NAMING.kernelLabel,
    cardinals: CARDINALS,
    recursionLaw: RECURSION_LAW,

    constants: CONSTANTS,

    lattices: Object.freeze({
      structural: Object.freeze({
        width: CONSTANTS.structuralLatticeWidth,
        height: CONSTANTS.structuralLatticeHeight,
        structuralCoordinates: STRUCTURAL_COORDINATES,
        executionCoordinates: EXECUTION_COORDINATES
      }),
      planetSample: Object.freeze({
        width: CONSTANTS.planetSampleLatticeWidth,
        height: CONSTANTS.planetSampleLatticeHeight,
        total: CONSTANTS.planetSampleTotal
      })
    }),

    localGrid: LOCAL_GRID,
    depthRegistry: DEPTH_REGISTRY,
    depthOrder: DEPTH_ORDER,

    vocabulary: Object.freeze({
      terrainClasses: TERRAIN_CLASSES,
      surfaceMaterials: SURFACE_MATERIALS,
      biomeTypes: BIOME_TYPES,
      climateBands: CLIMATE_BANDS
    }),

    enums: ENUM_REGISTRY,

    environment: Object.freeze({
      families: ENVIRONMENT_FAMILIES
    }),

    state: Object.freeze({
      channelContract: STATE_CHANNEL_CONTRACT,
      registry: STATE_REGISTRY
    }),

    ruleEngine: Object.freeze({
      families: RULE_FAMILY_REGISTRY,
      precedence: RULE_PRECEDENCE_REGISTRY,
      tickContract: SIMULATION_TICK_CONTRACT
    }),

    naming: NAMING,
    scope: SCOPE,
    flags: FEATURE_FLAGS,
    futureScaling: FUTURE_SCALING,

    planetField: PLANET_FIELD_CONTRACT,

    canon: Object.freeze({
      fileHomeRegistry: FILE_HOME_REGISTRY,
      dependencyRegistry: DEPENDENCY_REGISTRY,
      chronologyRegistry: DEPENDENCY_REGISTRY,
      ownershipRegistry: OWNERSHIP_REGISTRY,
      duplicateTruthRegistry: DUPLICATE_TRUTH_REGISTRY
    }),

    verification: Object.freeze({
      verifyCanonicalStructure
    })
  });
})());

export function getPlanetFieldContract() {
  return WORLD_KERNEL.planetField;
}

export function getCanonicalSampleContract() {
  return WORLD_KERNEL.planetField.sampleContract;
}

export function getStateRegistry() {
  return WORLD_KERNEL.state.registry;
}

export function getRuleFamilyRegistry() {
  return WORLD_KERNEL.ruleEngine.families;
}

export function getSimulationTickContract() {
  return WORLD_KERNEL.ruleEngine.tickContract;
}

export function getEnumRegistry() {
  return WORLD_KERNEL.enums;
}

export function getEnumRegistryVersion() {
  return WORLD_KERNEL.enums.version;
}

export function requireStateCode(name) {
  const code = WORLD_KERNEL.state.registry.codesByName[name];
  if (!Number.isInteger(code)) {
    throw new Error(`WORLD_KERNEL_STATE_LOOKUP_MISSING:${String(name)}`);
  }
  return code;
}

export function getStateEntry(code) {
  const entry = WORLD_KERNEL.state.registry.byCode[code];
  if (!entry) {
    throw new Error(`WORLD_KERNEL_INVALID_STATE_CODE:${String(code)}`);
  }
  return entry;
}

export function isValidStateCode(code) {
  return !!WORLD_KERNEL.state.registry.byCode[code];
}

export function verifyCanonicalStructure(input = {}) {
  return WORLD_KERNEL.verification.verifyCanonicalStructure(input);
}
