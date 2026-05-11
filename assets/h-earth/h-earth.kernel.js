// /assets/h-earth/h-earth.kernel.js
// H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1
// Full-file replacement.
// Kernel parent core authority only.
//
// Owns:
// - H-Earth identity
// - generation state
// - parent-core law
// - module contract registry
// - terrain-only activation rules
// - downstream admissibility
//
// Does not own:
// - route DOM
// - canvas paint
// - controls
// - surface color
// - animation
// - land/water computation
// - terrain computation

const CONTRACT = "H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const TERRAIN_ONLY_CHAIN = "H_EARTH_G1_COMPLETE_TERRAIN_ONLY_PARENT_CHAIN_TNT_v1";
const VERSION = "2026-05-10.h-earth.g1.terrain-only.kernel";

const MODULE_REGISTRY = Object.freeze({
  kernel: {
    path: "/assets/h-earth/h-earth.kernel.js",
    contract: CONTRACT,
    owns: "identity-generation-parent-core-law",
    parent: null
  },
  lattice256: {
    path: "/assets/h-earth/h-earth.lattice256.js",
    contract: "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1",
    owns: "coordinate-seats-state-receipts",
    parent: "kernel"
  },
  landmap: {
    path: "/assets/h-earth/h-earth.landmap.js",
    contract: "H_EARTH_G1_TERRAIN_ONLY_LANDMAP_TNT_v1",
    owns: "land-water-mask-ocean-dominant-balance",
    parent: "lattice256"
  },
  terrain: {
    path: "/assets/h-earth/h-earth.terrain.js",
    contract: "H_EARTH_G1_COMPLETE_TERRAIN_ONLY_TNT_v1",
    owns: "terrain-relief-dispositionary-locations",
    parent: "landmap"
  },
  surface: {
    path: "/assets/h-earth/h-earth.surface.js",
    contract: "HELD",
    owns: "held-outside-terrain-only-scope",
    parent: "terrain"
  },
  canvas: {
    path: "/assets/h-earth/h-earth.canvas.js",
    contract: "HELD",
    owns: "held-outside-terrain-only-scope",
    parent: "surface"
  },
  controls: {
    path: "/assets/h-earth/h-earth.controls.js",
    contract: "HELD",
    owns: "held-outside-terrain-only-scope",
    parent: "canvas"
  }
});

const PARENT_CHAIN_ORDER = Object.freeze([
  "kernel",
  "lattice256",
  "landmap",
  "terrain",
  "surface",
  "canvas",
  "controls"
]);

const TERRAIN_ONLY_ACTIVE_ORDER = Object.freeze([
  "kernel",
  "lattice256",
  "landmap",
  "terrain"
]);

const TERRAIN_ASPECTS = Object.freeze({
  land: [
    "land-body-anchor",
    "coast-edge",
    "coastal-shelf",
    "beach-slope",
    "cliff-edge",
    "escarpment",
    "plateau",
    "highland",
    "mountain-spine",
    "master-summit",
    "secondary-peak",
    "valley-corridor",
    "basin",
    "canyon",
    "fault-ridge",
    "lowland",
    "island-fragment",
    "archipelago-seat",
    "polar-crust-seat",
    "glacial-terrain-seat"
  ],
  oceanFloor: [
    "continental-shelf",
    "slope-drop",
    "abyssal-plain",
    "trench",
    "mid-ocean-ridge",
    "seamount-chain",
    "fracture-zone",
    "seaway-corridor",
    "basin-mouth"
  ]
});

const LESSON_MERGE = Object.freeze({
  hearth: [
    "seven-body-mass-discipline",
    "edge-escarpment-to-plateau-to-mountain-to-summit-hierarchy",
    "rigid-coastline-fracture",
    "island-chain-and-fragment-seating"
  ],
  audralia: [
    "ocean-dominant-parent-mask",
    "parent-before-child-chain-discipline",
    "landmap-before-terrain-separation",
    "no-canvas-owned-truth"
  ],
  hEarthSimplification: [
    "one-kernel",
    "one-lattice",
    "one-landmap",
    "one-terrain-parent",
    "all-terrain-aspects-dispositioned-before-surface"
  ]
});

function freezeDeep(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;

  Object.freeze(value);

  for (const key of Object.keys(value)) {
    freezeDeep(value[key]);
  }

  return value;
}

function createReceipt(type, detail = {}) {
  return freezeDeep({
    type,
    contract: CONTRACT,
    seedPacket: SEED_PACKET,
    terrainOnlyChain: TERRAIN_ONLY_CHAIN,
    planet: "H-Earth",
    meaning: "Hybrid Earth",
    generation: "G1",
    timestamp: new Date().toISOString(),
    detail
  });
}

function getRegistryEntry(key) {
  return MODULE_REGISTRY[key] || null;
}

function getRequiredParent(key) {
  const entry = getRegistryEntry(key);
  return entry ? entry.parent : null;
}

function isTerrainOnlyModule(key) {
  return TERRAIN_ONLY_ACTIVE_ORDER.includes(key);
}

function isHeldModule(key) {
  return ["surface", "canvas", "controls"].includes(key);
}

function canActivateModule(key, receipts = {}) {
  if (!MODULE_REGISTRY[key]) {
    return {
      allowed: false,
      reason: "unknown-module",
      requiredParent: null
    };
  }

  if (isHeldModule(key)) {
    return {
      allowed: false,
      reason: "held-outside-terrain-only-scope",
      requiredParent: getRequiredParent(key)
    };
  }

  const parent = getRequiredParent(key);

  if (!parent) {
    return {
      allowed: true,
      reason: "root-kernel",
      requiredParent: null
    };
  }

  if (!receipts[parent]) {
    return {
      allowed: false,
      reason: "parent-receipt-missing",
      requiredParent: parent
    };
  }

  return {
    allowed: true,
    reason: "parent-receipt-present",
    requiredParent: parent
  };
}

export function createHEarthKernel(options = {}) {
  const kernel = {
    contract: CONTRACT,
    seedPacket: SEED_PACKET,
    terrainOnlyChain: TERRAIN_ONLY_CHAIN,
    version: VERSION,
    planet: {
      key: "h-earth",
      name: "H-Earth",
      meaning: "Hybrid Earth",
      generation: "G1",
      lane: "separate-experimental-third-planet",
      status: "terrain-only-parent-chain",
      earthReferenceShell: "protected-reference-only",
      mutatesEarth: false,
      mutatesHearth: false,
      mutatesAudralia: false
    },
    prohibitions: {
      graphicBox: true,
      imageGeneration: true,
      visualPassClaim: true,
      surfaceInTerrainPass: true,
      canvasInTerrainPass: true,
      controlsInTerrainPass: true,
      weatherInTerrainPass: true,
      atmosphereInTerrainPass: true,
      lifeLayerInTerrainPass: true,
      routeOwnedPlanetTruth: true,
      canvasOwnedLandWaterTruth: true,
      staleContractImport: true,
      realWorldNameSubstitution: true
    },
    parentCoreLaw: {
      kernelBeforeLattice: true,
      latticeBeforeLandmap: true,
      landmapBeforeTerrain: true,
      terrainBeforeSurface: true,
      surfaceBeforeCanvas: true,
      canvasBeforeControls: true,
      controlsMotionOnly: true,
      downstreamCannotRedefineParentTruth: true,
      noSidestreamTruth: true
    },
    terrainOnlyScope: {
      active: true,
      activeOrder: [...TERRAIN_ONLY_ACTIVE_ORDER],
      heldOutsideScope: ["surface", "canvas", "controls", "weather", "atmosphere", "life", "material-color"],
      finalVisibleComposition: "not-authorized-in-this-pass"
    },
    moduleRegistry: MODULE_REGISTRY,
    parentChainOrder: [...PARENT_CHAIN_ORDER],
    terrainAspects: TERRAIN_ASPECTS,
    lessonMerge: LESSON_MERGE,
    options: freezeDeep({ ...options }),
    receipts: {
      kernel: createReceipt("kernel-created", {
        activeModules: [...TERRAIN_ONLY_ACTIVE_ORDER],
        heldModules: ["surface", "canvas", "controls"]
      })
    },
    api: {
      getRegistryEntry,
      getRequiredParent,
      isTerrainOnlyModule,
      isHeldModule,
      canActivateModule,
      createReceipt
    }
  };

  return freezeDeep(kernel);
}

export {
  CONTRACT,
  SEED_PACKET,
  TERRAIN_ONLY_CHAIN,
  VERSION,
  MODULE_REGISTRY,
  PARENT_CHAIN_ORDER,
  TERRAIN_ONLY_ACTIVE_ORDER,
  TERRAIN_ASPECTS,
  LESSON_MERGE
};

export default createHEarthKernel;
