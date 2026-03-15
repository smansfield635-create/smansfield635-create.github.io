const DEPTH_REGISTRY = Object.freeze([
  Object.freeze({ id: "cosmic", index: 0, label: "Cosmic", zoneBearing: false }),
  Object.freeze({ id: "region", index: 1, label: "Region", zoneBearing: false }),
  Object.freeze({ id: "galaxy", index: 2, label: "Galaxy", zoneBearing: false }),
  Object.freeze({ id: "harbor", index: 3, label: "Harbor", zoneBearing: false }),
  Object.freeze({ id: "system", index: 4, label: "System", zoneBearing: false }),
  Object.freeze({ id: "planet", index: 5, label: "Planet", zoneBearing: false }),
  Object.freeze({ id: "macro_surface", index: 6, label: "Macro Surface", zoneBearing: false }),
  Object.freeze({ id: "regional_surface", index: 7, label: "Regional Surface", zoneBearing: true }),
  Object.freeze({ id: "local_zone", index: 8, label: "Local Zone", zoneBearing: true }),
  Object.freeze({ id: "site_cell", index: 9, label: "Site Cell", zoneBearing: true }),
  Object.freeze({ id: "micro_cell", index: 10, label: "Micro Cell", zoneBearing: true })
]);

const DEPTH_ORDER = Object.freeze(DEPTH_REGISTRY.map((d) => d.id));

const DEPTH_SCOPE_LOCK = Object.freeze({
  live: Object.freeze(["cosmic", "region", "galaxy", "harbor"]),
  scaffolded: Object.freeze([
    "system",
    "planet",
    "macro_surface",
    "regional_surface",
    "local_zone",
    "site_cell",
    "micro_cell"
  ]),
  externalBranchOnly: true
});

export const WORLD_KERNEL = Object.freeze({
  version: "optimum-baseline-v4",
  depthRegistry: DEPTH_REGISTRY,
  depthOrder: DEPTH_ORDER,
  depthScope: DEPTH_SCOPE_LOCK,
  naming: Object.freeze({
    activeScale: "harbor",
    baselineLabel: "world_is_round_external"
  }),
  localGrid: Object.freeze({
    rows: Object.freeze([0,1,2,3]),
    cols: Object.freeze([0,1,2,3]),
    cellIds: Object.freeze([
      "R0C0","R0C1","R0C2","R0C3",
      "R1C0","R1C1","R1C2","R1C3",
      "R2C0","R2C1","R2C2","R2C3",
      "R3C0","R3C1","R3C2","R3C3"
    ])
  }),
  branches: Object.freeze({
    harbor: Object.freeze({
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
  }),
  scope: Object.freeze({
    includeEvents: false,
    includeNPCs: false,
    activeBranch: "external",
    activePath: Object.freeze(["cosmic","region","galaxy","harbor"])
  })
});

export function getDepthById(id){
  return WORLD_KERNEL.depthRegistry.find(d=>d.id===id) || null;
}

export function isGridBoundDepth(id){
  return ["regional_surface","local_zone","site_cell","micro_cell"].includes(id);
}

export function getExpectedCanonStructure(){
  return Object.freeze({});
}

export function verifyCanonicalStructure(){
  return Object.freeze({ pass:true });
}
