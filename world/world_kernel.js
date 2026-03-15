export const WORLD_KERNEL = Object.freeze({
  version: "optimum-baseline-v1",

  modes: Object.freeze({
    roundWorld: true,
    flatWorldReconnection: true,
    externalViewOnly: true
  }),

  cardinals: Object.freeze({
    north: { id: "north", role: "constraint" },
    south: { id: "south", role: "stability" },
    east: { id: "east", role: "behavior" },
    west: { id: "west", role: "alignment" }
  }),

  recursionLaw: Object.freeze({
    pattern: "1→4→1",
    description: "Core differentiates into cardinal branches and recombines into a single conclusion."
  }),

  descentOrder: Object.freeze([
    "water",
    "land",
    "atmosphere",
    "space"
  ]),

  scaleOrder: Object.freeze([
    "cosmic",
    "region",
    "galaxy",
    "harbor",
    "planet",
    "surface"
  ]),

  environment: Object.freeze({
    families: Object.freeze({
      space: Object.freeze(["cosmic", "stellar", "orbital", "deep_space"]),
      atmosphere: Object.freeze(["climate", "weather", "aerial", "optics"]),
      land: Object.freeze(["continents", "regions", "topography", "geography"]),
      water: Object.freeze(["oceans", "currents", "surfaces", "cycles"])
    })
  }),

  branches: Object.freeze({
    harbor: Object.freeze({
      external: true,
      children: Object.freeze(["gratitude", "generosity"]),
      gratitude: Object.freeze({
        north: "recognition_of_value",
        south: "stabilization_of_relationship",
        east: "outward_acknowledgement",
        west: "reciprocal_alignment"
      }),
      generosity: Object.freeze({
        north: "awareness_of_need",
        south: "sustained_support",
        east: "outward_distribution",
        west: "relational_coherence"
      })
    })
  }),

  constants: Object.freeze({
    initialYaw: -0.18,
    initialPitch: -0.34,
    minPitch: -1.15,
    maxPitch: 1.15,
    inertiaDecay: 0.94,
    dragSensitivity: 0.0065,
    worldRadiusFactor: 0.34,
    atmosphereThicknessFactor: 0.08,
    oceanCoverThreshold: 0.48
  }),

  naming: Object.freeze({
    activeScale: "harbor",
    baselineLabel: "world_is_round_external",
    reconnectionTarget: "world_is_flat"
  }),

  scope: Object.freeze({
    includeEvents: false,
    includeNPCs: false,
    includeEconomy: false,
    includeAgriculture: false,
    includeInfrastructureBehavior: false
  }),

  flags: Object.freeze({
    showHarborAudit: true,
    showCompassOverlay: true,
    showDebugPanels: true
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
