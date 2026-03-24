// /world/world_kernel.js
// MODE: KERNEL CONTRACT RENEWAL
// STATUS: NON-DRIFT | LANGUAGE-ALIGNED | LAW-ONLY | NO-EXECUTION-LEAK
// OWNER: SEAN

export const WORLD_KERNEL = Object.freeze({
  contractVersion: "WORLD_KERNEL_v2",

  /* =========================
     LAW — CONSTANTS ONLY
  ========================= */

  constants: Object.freeze({
    worldRadiusFactor: 0.36,
    latSteps: 108,
    lonSteps: 216,
    seaLevel: 0.0,
    shorelineBand: 0.028,
    shelfBand: 0.075,
    elevationScale: 1.0
  }),

  hierarchy: Object.freeze({
    continents: 9,
    countriesPerContinent: 4,
    regionsPerCountry: 4,
    statesPerCountry: 16,
    metrosPerState: 16,
    citiesPerState: 256,
    capitalsPerCountry: 4,
    nodeScope: 16,
    latticeScope: 256
  }),

  nodeAuthority: Object.freeze({
    owner: "/world/world_kernel.js",
    relationType: "state_index_membership",
    latticeScope: 256,
    nodeScope: 16,
    provisional: false
  }),

  /* =========================
     LAW — CONTINENT DEFINITIONS
  ========================= */

  continents: Object.freeze([
    Object.freeze({ id: "C1", tier: 1, canonicalName: "Input Calibration", shardClass: "CORE_FRAGMENT", sizeFactor: 1.0 }),
    Object.freeze({ id: "C2", tier: 2, canonicalName: "Output Allocation", shardClass: "CORE_FRAGMENT", sizeFactor: 0.90 }),
    Object.freeze({ id: "C3", tier: 3, canonicalName: "Uptime Integrity", shardClass: "CORE_FRAGMENT", sizeFactor: 0.80 }),
    Object.freeze({ id: "C4", tier: 4, canonicalName: "Audit Chain", shardClass: "SECONDARY_SPLIT", sizeFactor: 0.70 }),
    Object.freeze({ id: "C5", tier: 5, canonicalName: "Dynamic Resizing", shardClass: "SECONDARY_SPLIT", sizeFactor: 0.60 }),
    Object.freeze({ id: "C6", tier: 6, canonicalName: "Rollback System", shardClass: "SECONDARY_SPLIT", sizeFactor: 0.50 }),
    Object.freeze({ id: "C7", tier: 7, canonicalName: "Boundary Engine", shardClass: "PERIPHERAL_SHARD", sizeFactor: 0.40 }),
    Object.freeze({ id: "C8", tier: 8, canonicalName: "Time Horizon Control", shardClass: "PERIPHERAL_SHARD", sizeFactor: 0.30 }),
    Object.freeze({ id: "C9", tier: 9, canonicalName: "Noise Suppression", shardClass: "PERIPHERAL_SHARD", sizeFactor: 0.10 })
  ]),

  /* =========================
     LAW — NO EXECUTION
  ========================= */

  capabilities: Object.freeze({
    provides: Object.freeze([
      "constants",
      "hierarchy",
      "continent_identity",
      "node_authority_rules"
    ]),

    explicitlyDoesNotProvide: Object.freeze([
      "planet_field_generation",
      "frame_evolution",
      "render_logic",
      "time_state",
      "motion_state"
    ])
  })
});

/* =========================
   NODE RESOLUTION (PURE LAW)
========================= */

export function resolveNode(sample) {
  const source = sample && typeof sample === "object" ? sample : {};

  if (
    Number.isInteger(source.stateIndex) &&
    source.stateIndex >= 0 &&
    source.stateIndex < WORLD_KERNEL.hierarchy.nodeScope
  ) {
    return Object.freeze({
      id: source.stateIndex,
      relation_type: "state_index_membership",
      lattice_scope: WORLD_KERNEL.hierarchy.latticeScope,
      node_scope: WORLD_KERNEL.hierarchy.nodeScope
    });
  }

  throw new Error("WORLD_KERNEL.resolveNode requires stateIndex");
}
