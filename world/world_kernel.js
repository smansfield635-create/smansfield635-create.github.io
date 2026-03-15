const FILE_HOME_REGISTRY = Object.freeze({
  "assets/instruments.js": Object.freeze([
    "runtime_panel",
    "selection_panel",
    "harbor_panel",
    "gratitude_panel",
    "generosity_panel",
    "orientation_panel",
    "depth_lattice_panel",
    "canon_verification_panel",
    "execution_gate_panel",
    "failure_panel",
    "diagnostic_render_surface",
    "magnetic_field_panel",
    "thermodynamic_field_panel",
    "hydrology_field_panel"
  ]),
  "assets/ui.css": Object.freeze([
    "page_baseline",
    "app_shell",
    "canvas_layer",
    "debug_panel",
    "info_panel",
    "typography",
    "spacing",
    "overlay",
    "z_index_layering",
    "responsive_shell"
  ]),
  "index.html": Object.freeze([
    "document_shell",
    "mount_point",
    "canvas_host",
    "panel_host",
    "module_boot_order",
    "runtime_bootstrap",
    "fail_safe_fallback"
  ]),
  "world/world_kernel.js": Object.freeze([
    "cardinal_law",
    "round_world_law",
    "flat_world_reconnection",
    "environment_family_registry",
    "branch_registry",
    "harbor_branch",
    "gratitude_branch",
    "generosity_branch",
    "recursion_1_to_4_to_1",
    "depth_lattice",
    "descent_order",
    "recombination_order",
    "allowed_scope",
    "feature_flag",
    "canonical_constants",
    "naming_registry",
    "canon_verification"
  ]),
  "world/cosmic_engine_spine.js": Object.freeze([
    "cosmic_resolver",
    "galaxy_resolver",
    "solar_resolver",
    "planet_resolver",
    "surface_resolver",
    "harbor_resolver",
    "gratitude_resolver",
    "generosity_resolver",
    "upstream_downstream_handoff",
    "normalized_state_packaging",
    "branch_descent",
    "branch_recombination",
    "harbor_exchange",
    "gratitude_recombination",
    "generosity_recombination",
    "node_state_conclusion",
    "scale_transition",
    "scale_containment",
    "audit_labeling",
    "execution_gate"
  ]),
  "world/planet_surface_projector.js": Object.freeze([
    "center",
    "radius",
    "resize",
    "yaw",
    "pitch",
    "momentum",
    "drag_application",
    "decay",
    "sphere_projection",
    "inverse_projection",
    "lat_long_conversion",
    "surface_coordinate",
    "orbital_view_projection",
    "body_relative_attachment",
    "horizon_exclusion",
    "full_circle_law",
    "orientation_extraction",
    "cardinal_mapping",
    "world_state_handoff"
  ]),
  "world/environment/magnetic_field_engine.js": Object.freeze([
    "magnetic_intensity_field",
    "shielding_gradient_field",
    "auroral_potential_field",
    "navigation_field_basis"
  ]),
  "world/environment/thermodynamic_engine.js": Object.freeze([
    "temperature_field",
    "thermal_gradient_field",
    "freeze_potential_field",
    "melt_potential_field",
    "evaporation_pressure_field"
  ]),
  "world/environment/hydrology_engine.js": Object.freeze([
    "rainfall_field",
    "runoff_field",
    "basin_accumulation_field",
    "drainage_field",
    "river_path_field",
    "lake_formation_field"
  ]),
  "world/environment_renderer.js": Object.freeze([
    "space_family",
    "magnetic_field_family",
    "thermodynamic_family",
    "hydrology_family",
    "atmosphere_family",
    "land_family",
    "water_family",
    "cosmic_field",
    "stellar",
    "orbital",
    "deep_space",
    "continents",
    "oceans",
    "currents",
    "surfaces",
    "family_dispatch",
    "subfamily_dispatch",
    "external_view_render",
    "environment_audit",
    "no_npc_no_event_exclusion"
  ]),
  "world/compass_renderer.js": Object.freeze([
    "cardinal_ring",
    "center_marker",
    "heading_transform",
    "label_placement",
    "external_view_framing",
    "harbor_node_display",
    "branch_indicator",
    "recombination_readout",
    "orientation_text",
    "audit_overlay"
  ]),
  "world/scene_runtime.js": Object.freeze([
    "boot_sequence",
    "initialization_state",
    "verification_state",
    "authorization_state",
    "running_state",
    "error_state",
    "world_boot",
    "spine_boot",
    "projector_boot",
    "environment_boot",
    "compass_boot",
    "instruments_boot",
    "canvas_initialization",
    "resize_orchestration",
    "update_order",
    "render_order",
    "runtime_state_container",
    "frame_scheduler",
    "error_isolation",
    "debug_panel_write"
  ])
});

const CHRONOLOGY_REGISTRY = Object.freeze([
  "assets/instruments.js",
  "assets/ui.css",
  "index.html",
  "world/world_kernel.js",
  "world/cosmic_engine_spine.js",
  "world/planet_surface_projector.js",
  "world/environment/magnetic_field_engine.js",
  "world/environment/thermodynamic_engine.js",
  "world/environment/hydrology_engine.js",
  "world/environment_renderer.js",
  "world/compass_renderer.js",
  "world/scene_runtime.js"
]);

const OWNERSHIP_REGISTRY = Object.freeze(
  Object.fromEntries(
    Object.entries(FILE_HOME_REGISTRY).flatMap(([filePath, constructs]) =>
      constructs.map((construct) => [construct, filePath])
    )
  )
);

const DUPLICATE_TRUTH_REGISTRY = Object.freeze([
  "cardinal_law",
  "round_world_law",
  "flat_world_reconnection",
  "environment_family_registry",
  "branch_registry",
  "harbor_branch",
  "gratitude_branch",
  "generosity_branch",
  "recursion_1_to_4_to_1",
  "depth_lattice",
  "descent_order",
  "recombination_order",
  "allowed_scope",
  "feature_flag",
  "canonical_constants",
  "naming_registry",
  "canon_verification",
  "execution_gate",
  "world_state_handoff",
  "orientation_extraction",
  "cardinal_mapping"
]);

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

const DEPTH_SCOPE_LOCK = Object.freeze({
  live: Object.freeze(["cosmic", "galaxy", "solar", "planet", "surface", "harbor", "gratitude", "generosity"]),
  scaffolded: Object.freeze([]),
  externalBranchOnly: true
});

const LOCAL_GRID_REGISTRY = Object.freeze({
  rows: Object.freeze([0, 1, 2, 3]),
  cols: Object.freeze([0, 1, 2, 3]),
  cellIds: Object.freeze([
    "R0C0", "R0C1", "R0C2", "R0C3",
    "R1C0", "R1C1", "R1C2", "R1C3",
    "R2C0", "R2C1", "R2C2", "R2C3",
    "R3C0", "R3C1", "R3C2", "R3C3"
  ])
});

const DEPTH_TO_GRID_BINDING = Object.freeze({
  cosmic: false,
  galaxy: false,
  solar: false,
  planet: false,
  surface: true,
  harbor: false,
  gratitude: false,
  generosity: false
});

const ENVIRONMENT_FAMILIES = Object.freeze({
  space: Object.freeze(["cosmic", "stellar", "orbital", "deep_space"]),
  magnetic_field: Object.freeze(["magnetic_intensity", "shielding_gradient", "auroral_potential", "navigation_basis"]),
  thermodynamic: Object.freeze(["temperature", "thermal_gradient", "freeze_potential", "melt_potential", "evaporation_pressure"]),
  hydrology: Object.freeze(["rainfall", "runoff", "basin_accumulation", "drainage", "river_path", "lake_formation"]),
  atmosphere: Object.freeze(["climate", "weather", "aerial", "optics"]),
  land: Object.freeze(["continents", "regions", "topography", "geography"]),
  water: Object.freeze(["oceans", "currents", "surfaces", "cycles"])
});

const CARDINAL_REGISTRY = Object.freeze({
  north: Object.freeze({ id: "north", role: "constraint" }),
  south: Object.freeze({ id: "south", role: "stability" }),
  east: Object.freeze({ id: "east", role: "behavior" }),
  west: Object.freeze({ id: "west", role: "alignment" })
});

const RECURSION_LAW = Object.freeze({
  pattern: "1→4→1",
  description: "Core differentiates into cardinal branches and recombines into a single conclusion."
});

const DESCENT_ORDER = Object.freeze([
  "cosmic",
  "galaxy",
  "solar",
  "planet",
  "surface",
  "harbor",
  "gratitude",
  "generosity"
]);

const RECOMBINATION_ORDER = Object.freeze([
  "gratitude",
  "harbor",
  "generosity",
  "harbor",
  "surface",
  "planet",
  "solar",
  "galaxy",
  "cosmic"
]);

const BRANCH_REGISTRY = Object.freeze({
  harbor: Object.freeze({
    id: "harbor",
    external: true,
    dualStatus: true,
    children: Object.freeze(["gratitude", "generosity"]),
    gratitude: Object.freeze({
      north: "recognition_of_value",
      south: "stabilization_of_relationship",
      east: "outward_acknowledgement",
      west: "reciprocal_alignment",
      recombination: "acknowledged_value_stabilized"
    }),
    generosity: Object.freeze({
      north: "awareness_of_need",
      south: "sustained_support",
      east: "outward_distribution",
      west: "relational_coherence",
      recombination: "outward_support_coherently_distributed"
    }),
    recombination: "recognized_value_and_distributed_value_balance_at_the_node"
  })
});

const CONSTANTS = Object.freeze({
  initialYaw: -0.18,
  initialPitch: -0.34,
  minPitch: -1.15,
  maxPitch: 1.15,
  inertiaDecay: 0.94,
  dragSensitivity: 0.0065,
  worldRadiusFactor: 0.34,
  atmosphereThicknessFactor: 0.08,
  oceanCoverThreshold: 0.48,
  localGridRows: 4,
  localGridCols: 4,
  localGridCells: 16,
  structuralCoordinateCount: 16,
  executionCoordinateCount: 16,
  stateFieldCount: 256,
  causalCoverageCount: 65536,
  thermalBaseline: 0.48,
  thermalPolarCoolingStrength: 0.82,
  thermalWildernessDecayStrength: 0.26,
  magneticBaseline: 0.20,
  hydrologyRunoffStrength: 0.58,
  hydrologyBasinThreshold: 0.62,
  hydrologyRiverThreshold: 0.56,
  hydrologyLakeThreshold: 0.62
});

const NAMING_REGISTRY = Object.freeze({
  activeScale: "harbor",
  baselineLabel: "world_is_round_external",
  reconnectionTarget: "world_is_flat",
  liveDepthBaseline: "harbor",
  localGridLabel: "4x4_surface_field",
  thermodynamicFieldLabel: "planetary_thermodynamic_field",
  magneticFieldLabel: "planetary_magnetic_field",
  hydrologyFieldLabel: "planetary_hydrology_field"
});

const FEATURE_FLAGS = Object.freeze({
  showHarborAudit: true,
  showCompassOverlay: true,
  showDebugPanels: true,
  showVerificationPanel: true,
  showExecutionGatePanel: true,
  enable4x4LocalField: true,
  enableThermodynamicField: true,
  enableMagneticField: true,
  enableHydrologyField: true
});

const SCOPE_REGISTRY = Object.freeze({
  includeEvents: false,
  includeNPCs: false,
  includeEconomy: false,
  includeAgriculture: false,
  includeInfrastructureBehavior: false,
  activeBranch: "external",
  activePath: Object.freeze(["cosmic", "galaxy", "solar", "planet", "surface", "harbor"])
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

function buildExpectedStructure() {
  return Object.freeze({
    fileHomes: FILE_HOME_REGISTRY,
    chronology: CHRONOLOGY_REGISTRY,
    ownership: OWNERSHIP_REGISTRY,
    scope: SCOPE_REGISTRY,
    duplicateTruth: DUPLICATE_TRUTH_REGISTRY
  });
}

function buildReceivedStructure(input = {}) {
  const normalizedInput = normalizeObject(input);

  return Object.freeze({
    fileHomes: normalizeObject(normalizedInput.fileHomes),
    chronology: normalizeArray(normalizedInput.chronology),
    ownership: normalizeObject(normalizedInput.ownership),
    scope: normalizeObject(normalizedInput.scope),
    duplicateTruth: normalizeArray(normalizedInput.duplicateTruth)
  });
}

function compareFileHomes(expected, received) {
  const expectedEntries = Object.entries(expected);
  if (!expectedEntries.length) return false;

  return expectedEntries.every(([filePath, constructs]) => {
    const receivedConstructs = received[filePath];
    if (!Array.isArray(receivedConstructs)) return false;
    if (receivedConstructs.length !== constructs.length) return false;

    return constructs.every((construct, index) => receivedConstructs[index] === construct);
  });
}

function compareChronology(expected, received) {
  if (!Array.isArray(received) || received.length !== expected.length) return false;
  return expected.every((filePath, index) => received[index] === filePath);
}

function compareOwnership(expected, received) {
  const expectedEntries = Object.entries(expected);
  if (!expectedEntries.length) return false;

  return expectedEntries.every(([construct, filePath]) => received[construct] === filePath);
}

function compareScope(expected, received) {
  return (
    normalizeBoolean(received.includeEvents, true) === expected.includeEvents &&
    normalizeBoolean(received.includeNPCs, true) === expected.includeNPCs &&
    normalizeBoolean(received.includeEconomy, true) === expected.includeEconomy &&
    normalizeBoolean(received.includeAgriculture, true) === expected.includeAgriculture &&
    normalizeBoolean(received.includeInfrastructureBehavior, true) === expected.includeInfrastructureBehavior &&
    normalizeString(received.activeBranch) === expected.activeBranch &&
    JSON.stringify(normalizeArray(received.activePath)) === JSON.stringify(expected.activePath)
  );
}

function detectDuplicateTruth(expected, received) {
  if (!Array.isArray(received)) return false;
  if (received.length !== expected.length) return false;

  const seen = new Set();
  for (const truthName of received) {
    if (seen.has(truthName)) return false;
    seen.add(truthName);
  }

  return expected.every((truthName) => seen.has(truthName));
}

function packageVerificationVerdict(expected, received) {
  const file_home_pass = compareFileHomes(expected.fileHomes, received.fileHomes);
  const chronology_pass = compareChronology(expected.chronology, received.chronology);
  const ownership_pass = compareOwnership(expected.ownership, received.ownership);
  const scope_pass = compareScope(expected.scope, received.scope);
  const duplicate_truth_pass = detectDuplicateTruth(expected.duplicateTruth, received.duplicateTruth);

  const reasons = [];
  if (!file_home_pass) reasons.push("file_home_mismatch");
  if (!chronology_pass) reasons.push("chronology_mismatch");
  if (!ownership_pass) reasons.push("ownership_mismatch");
  if (!scope_pass) reasons.push("scope_mismatch");
  if (!duplicate_truth_pass) reasons.push("duplicate_truth_detected");

  return Object.freeze({
    pass: file_home_pass && chronology_pass && ownership_pass && scope_pass && duplicate_truth_pass,
    file_home_pass,
    chronology_pass,
    ownership_pass,
    scope_pass,
    duplicate_truth_pass,
    reasons: Object.freeze(reasons),
    expected,
    received
  });
}

export const WORLD_KERNEL = Object.freeze({
  version: "optimum-baseline-v1",
  modes: Object.freeze({
    roundWorld: true,
    flatWorldReconnection: true,
    externalViewOnly: true
  }),
  cardinals: CARDINAL_REGISTRY,
  recursionLaw: RECURSION_LAW,
  depthRegistry: DEPTH_REGISTRY,
  depthOrder: DEPTH_ORDER,
  depthScope: DEPTH_SCOPE_LOCK,
  descentOrder: DESCENT_ORDER,
  recombinationOrder: RECOMBINATION_ORDER,
  localGrid: LOCAL_GRID_REGISTRY,
  depthToGridBinding: DEPTH_TO_GRID_BINDING,
  environment: Object.freeze({
    families: ENVIRONMENT_FAMILIES
  }),
  branches: BRANCH_REGISTRY,
  constants: CONSTANTS,
  naming: NAMING_REGISTRY,
  scope: SCOPE_REGISTRY,
  flags: FEATURE_FLAGS,
  canon: Object.freeze({
    fileHomeRegistry: FILE_HOME_REGISTRY,
    chronologyRegistry: CHRONOLOGY_REGISTRY,
    ownershipRegistry: OWNERSHIP_REGISTRY,
    duplicateTruthRegistry: DUPLICATE_TRUTH_REGISTRY
  })
});

export function getEnvironmentFamilies() {
  return WORLD_KERNEL.environment.families;
}

export function getHarborBranch() {
  return WORLD_KERNEL.branches.harbor;
}

export function getCardinalRoles() {
  return WORLD_KERNEL.cardinals;
}

export function getDepthRegistry() {
  return WORLD_KERNEL.depthRegistry;
}

export function getDepthById(depthId) {
  return WORLD_KERNEL.depthRegistry.find((depth) => depth.id === depthId) ?? null;
}

export function isGridBoundDepth(depthId) {
  return WORLD_KERNEL.depthToGridBinding[depthId] === true;
}

export function getLocalGridCell(row, col) {
  if (!Number.isInteger(row) || !Number.isInteger(col)) return null;
  if (row < 0 || row > 3 || col < 0 || col > 3) return null;

  const cellIndex = row * 4 + col;
  return Object.freeze({
    row,
    col,
    cellIndex,
    cellId: WORLD_KERNEL.localGrid.cellIds[cellIndex]
  });
}

export function getExpectedCanonStructure() {
  return buildExpectedStructure();
}

export function verifyCanonicalStructure(input = {}) {
  const expected = buildExpectedStructure();
  const received = buildReceivedStructure(input);
  return packageVerificationVerdict(expected, received);
}
