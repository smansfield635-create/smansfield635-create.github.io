// /world/world_kernel.js
// MODE: BASELINE RENEWAL
// STATUS: LAW-ONLY | NON-DRIFT | SSG-ALIGNED
// OWNER: SEAN

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export const WORLD_KERNEL = Object.freeze({
  contractVersion: "WORLD_KERNEL_v3",

  resources: Object.freeze({
    world: Object.freeze({
      radiusFactor: 0.36,
      latSteps: 108,
      lonSteps: 216,
      seaLevel: 0.0,
      shorelineBand: 0.028,
      shelfBand: 0.075,
      elevationScale: 1.0
    })
  }),

  stores: Object.freeze({
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

    continents: Object.freeze([
      Object.freeze({
        id: "C1",
        tier: 1,
        canonicalName: "Input Calibration",
        shardClass: "CORE_FRAGMENT",
        sizeFactor: 1.0,
        reliefAmp: 0.35,
        reliefFreq: 0.50,
        roughness: 0.20,
        erosionStrength: 0.70,
        coastSmoothness: 0.65,
        ridgeAlignment: 0.40,
        valleyDepth: 0.30,
        traversalDifficulty: 0.20,
        habitabilityFraction: 0.72,
        activeNodeDensity: 1.0,
        activeMetroDensity: 1.0,
        activeCitiesTotal: null,
        seedLat: 18,
        seedLon: -42,
        axisX: 1.65,
        axisY: 1.02,
        rotationDeg: -26
      }),
      Object.freeze({
        id: "C2",
        tier: 2,
        canonicalName: "Output Allocation",
        shardClass: "CORE_FRAGMENT",
        sizeFactor: 0.90,
        reliefAmp: 0.40,
        reliefFreq: 0.55,
        roughness: 0.22,
        erosionStrength: 0.68,
        coastSmoothness: 0.63,
        ridgeAlignment: 0.45,
        valleyDepth: 0.35,
        traversalDifficulty: 0.28,
        habitabilityFraction: 0.64,
        activeNodeDensity: 0.85,
        activeMetroDensity: 0.80,
        activeCitiesTotal: null,
        seedLat: -14,
        seedLon: -18,
        axisX: 1.48,
        axisY: 0.98,
        rotationDeg: 14
      }),
      Object.freeze({
        id: "C3",
        tier: 3,
        canonicalName: "Uptime Integrity",
        shardClass: "CORE_FRAGMENT",
        sizeFactor: 0.80,
        reliefAmp: 0.45,
        reliefFreq: 0.60,
        roughness: 0.25,
        erosionStrength: 0.66,
        coastSmoothness: 0.60,
        ridgeAlignment: 0.50,
        valleyDepth: 0.40,
        traversalDifficulty: 0.35,
        habitabilityFraction: 0.57,
        activeNodeDensity: 0.70,
        activeMetroDensity: 0.64,
        activeCitiesTotal: null,
        seedLat: 36,
        seedLon: 6,
        axisX: 1.34,
        axisY: 0.92,
        rotationDeg: -8
      }),
      Object.freeze({
        id: "C4",
        tier: 4,
        canonicalName: "Audit Chain",
        shardClass: "SECONDARY_SPLIT",
        sizeFactor: 0.70,
        reliefAmp: 0.55,
        reliefFreq: 0.65,
        roughness: 0.28,
        erosionStrength: 0.63,
        coastSmoothness: 0.58,
        ridgeAlignment: 0.55,
        valleyDepth: 0.50,
        traversalDifficulty: 0.45,
        habitabilityFraction: 0.49,
        activeNodeDensity: 0.55,
        activeMetroDensity: 0.48,
        activeCitiesTotal: null,
        seedLat: -36,
        seedLon: 22,
        axisX: 1.18,
        axisY: 0.86,
        rotationDeg: 32
      }),
      Object.freeze({
        id: "C5",
        tier: 5,
        canonicalName: "Dynamic Resizing",
        shardClass: "SECONDARY_SPLIT",
        sizeFactor: 0.60,
        reliefAmp: 0.65,
        reliefFreq: 0.70,
        roughness: 0.32,
        erosionStrength: 0.60,
        coastSmoothness: 0.55,
        ridgeAlignment: 0.60,
        valleyDepth: 0.60,
        traversalDifficulty: 0.55,
        habitabilityFraction: 0.40,
        activeNodeDensity: 0.40,
        activeMetroDensity: 0.34,
        activeCitiesTotal: null,
        seedLat: 10,
        seedLon: 46,
        axisX: 1.04,
        axisY: 0.80,
        rotationDeg: -38
      }),
      Object.freeze({
        id: "C6",
        tier: 6,
        canonicalName: "Rollback System",
        shardClass: "SECONDARY_SPLIT",
        sizeFactor: 0.50,
        reliefAmp: 0.75,
        reliefFreq: 0.75,
        roughness: 0.36,
        erosionStrength: 0.56,
        coastSmoothness: 0.52,
        ridgeAlignment: 0.65,
        valleyDepth: 0.70,
        traversalDifficulty: 0.65,
        habitabilityFraction: 0.31,
        activeNodeDensity: 0.28,
        activeMetroDensity: 0.22,
        activeCitiesTotal: null,
        seedLat: -4,
        seedLon: 76,
        axisX: 0.90,
        axisY: 0.70,
        rotationDeg: 18
      }),
      Object.freeze({
        id: "C7",
        tier: 7,
        canonicalName: "Boundary Engine",
        shardClass: "PERIPHERAL_SHARD",
        sizeFactor: 0.40,
        reliefAmp: 0.85,
        reliefFreq: 0.80,
        roughness: 0.40,
        erosionStrength: 0.52,
        coastSmoothness: 0.48,
        ridgeAlignment: 0.70,
        valleyDepth: 0.80,
        traversalDifficulty: 0.75,
        habitabilityFraction: 0.22,
        activeNodeDensity: 0.18,
        activeMetroDensity: 0.12,
        activeCitiesTotal: null,
        seedLat: 52,
        seedLon: 54,
        axisX: 0.76,
        axisY: 0.62,
        rotationDeg: -22
      }),
      Object.freeze({
        id: "C8",
        tier: 8,
        canonicalName: "Time Horizon Control",
        shardClass: "PERIPHERAL_SHARD",
        sizeFactor: 0.30,
        reliefAmp: 0.95,
        reliefFreq: 0.85,
        roughness: 0.45,
        erosionStrength: 0.48,
        coastSmoothness: 0.45,
        ridgeAlignment: 0.75,
        valleyDepth: 0.90,
        traversalDifficulty: 0.88,
        habitabilityFraction: 0.14,
        activeNodeDensity: 0.10,
        activeMetroDensity: 0.06,
        activeCitiesTotal: null,
        seedLat: -50,
        seedLon: -76,
        axisX: 0.62,
        axisY: 0.54,
        rotationDeg: 42
      }),
      Object.freeze({
        id: "C9",
        tier: 9,
        canonicalName: "Noise Suppression",
        shardClass: "PERIPHERAL_SHARD",
        sizeFactor: 0.10,
        reliefAmp: 1.05,
        reliefFreq: 0.90,
        roughness: 0.50,
        erosionStrength: 0.45,
        coastSmoothness: 0.42,
        ridgeAlignment: 0.80,
        valleyDepth: 1.00,
        traversalDifficulty: 1.00,
        habitabilityFraction: 0.06,
        activeNodeDensity: 0.0,
        activeMetroDensity: 0.0,
        activeCitiesTotal: 16,
        seedLat: 64,
        seedLon: -104,
        axisX: 0.50,
        axisY: 0.42,
        rotationDeg: -12
      })
    ])
  }),

  constraints: Object.freeze({
    nodeAuthority: Object.freeze({
      owner: "/world/world_kernel.js",
      relationType: "state_index_membership",
      latticeScope: 256,
      nodeScope: 16,
      provisional: false
    }),

    executionSeparation: Object.freeze({
      kernelOwns: Object.freeze([
        "constants",
        "hierarchy",
        "continent_profiles",
        "node_relation_rules"
      ]),
      kernelDoesNotOwn: Object.freeze([
        "planet_field_generation",
        "frame_evolution",
        "render_expression",
        "runtime_scheduling"
      ])
    })
  }),

  goals: Object.freeze({
    preserveLawLayer: true,
    preserveNodeAuthority: true,
    forbidExecutionLeak: true
  }),

  guards: Object.freeze({
    requireValidStateIndex: true,
    forbidImplicitGeneration: true
  })
});

export function resolveNode(sample) {
  const source = sample && typeof sample === "object" ? sample : {};
  const raw = source.stateIndex;

  if (!Number.isInteger(raw)) {
    throw new Error("WORLD_KERNEL.resolveNode requires integer stateIndex");
  }

  const id = clamp(raw, 0, WORLD_KERNEL.stores.hierarchy.nodeScope - 1);

  return Object.freeze({
    id,
    provisional: false,
    relation_type: WORLD_KERNEL.constraints.nodeAuthority.relationType,
    lattice_scope: WORLD_KERNEL.constraints.nodeAuthority.latticeScope,
    node_scope: WORLD_KERNEL.constraints.nodeAuthority.nodeScope,
    nearest_id: id,
    distance: 0,
    anchor: "sample.stateIndex",
    transition_face: null
  });
}

export default Object.freeze({
  WORLD_KERNEL,
  resolveNode
});
