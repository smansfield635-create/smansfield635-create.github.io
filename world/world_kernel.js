export const WORLD_KERNEL = Object.freeze((() => {
  const VERSION = "kernel-cog-v3";

  // SECTION 1 — CANONICAL CONSTANTS
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

  // SECTION 2 — LATTICE GEOMETRY
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

  // SECTION 3 — VOCABULARY
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

  // SECTION 4 — ENVIRONMENT FAMILIES
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
    ])
  });

  // SECTION 5 — CANONICAL REGISTRIES
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
      "field_summary",
      "field_completeness"
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
      "failure_panels"
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
      "error_capture"
    ])
  });

  const DEPENDENCY_REGISTRY = Object.freeze([
    "world/world_kernel.js",
    "world/planet_engine.js",
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
    "planet_field_contract",
    "planet_sample_contract",
    "canon_verification",
    "file_ownership_registry",
    "dependency_registry"
  ]);

  // SECTION 6 — PLANET FIELD CONTRACT
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

  // SECTION 7 — NAMING / SCOPE / FLAGS
  const NAMING = Object.freeze({
    kernelLabel: "KERNEL_COG",
    baselineLabel: "compressed_256_world_v3",
    planetFieldLabel: "planetField",
    sampleLabel: "planetSample",
    structuralLatticeLabel: "structuralLattice16",
    planetSampleLatticeLabel: "planetSampleLattice256"
  });

  const SCOPE = Object.freeze({
    includeEvents: true,
    includeVariants: true,
    includeUI: true,
    activeBranch: "compressed_world_v3"
  });

  const FEATURE_FLAGS = Object.freeze({
    enablePlanetField: true,
    enableVariants: true,
    enableDiagnostics: true,
    enableVerification: true,
    nestedLatticeEnabled: false
  });

  const FUTURE_SCALING = Object.freeze({
    universeSeed: null,
    universalAddress: null,
    nestedLatticeEnabled: false,
    activeFieldState: "active",
    passiveFieldState: "passive"
  });

  // SECTION 8 — NORMALIZERS
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

  // SECTION 9 — EXPECTED STRUCTURE
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

  // SECTION 10 — COMPARATORS
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

  // SECTION 11 — VERIFICATION
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

    environment: Object.freeze({
      families: ENVIRONMENT_FAMILIES
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

export function verifyCanonicalStructure(input = {}) {
  return WORLD_KERNEL.verification.verifyCanonicalStructure(input);
}
