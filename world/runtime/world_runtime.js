// /world/runtime/world_runtime.js
// MODE: RUNTIME CONTRACT RENEWAL v2
// STATUS: TNT — LOCKED CONVERGENCE BINDER
// PURPOSE:
// 1) boot one runtime only
// 2) maintain control -> render continuity
// 3) emit authority receipt continuously
// 4) emit live gauges receipt continuously
// 5) commit RUNNING only after first successful verified frame
// 6) honor the live createInstruments() contract
// 7) preserve legacy runtime lifecycle behavior
// 8) add worldVariantState
// 9) add traversalState
// 10) add coherenceBindingState
// 11) add perceptionModifiersState
// 12) add subsurfaceActivationState
// 13) bind unified worldModeState
// 14) bind planet_engine to runtime state
// 15) rebuild planetField only when variant changes
// 16) stay finite, deterministic, and non-drifting

import { WORLD_KERNEL as worldKernel } from "/world/world_kernel.js";
import { createPlanetEngine } from "/world/planet_engine.js";
import { createRenderer } from "/world/render.js";
import { createControlSystem } from "/world/control.js";
import * as instruments from "/assets/instruments.js";

const RECEIPT_KEY = "__AUTHORITY_RECEIPT__";
const RUNTIME_ACTIVE_KEY = "__WORLD_RUNTIME_ACTIVE__";
const RUNTIME_STORAGE_KEY = "cte_runtime_v4";

const DEFAULT_WORLD_VARIANT = 9;
const DEFAULT_TRAVERSAL_MODE = "NORTH";
const VALID_TRAVERSAL_MODES = Object.freeze(["NORTH", "SOUTH", "EAST", "WEST"]);

let canvas = null;
let ctx = null;
let planetEngine = null;
let renderer = null;
let control = null;
let planetField = null;
let instrumentApi = null;

let rafId = 0;
let lastNow = 0;
let started = false;
let disposed = false;
let hasCommittedRunning = false;
let tickIndex = 0;
let previousInstrumentSample = null;

let onResize = null;
let onPageHide = null;
let onPointerDown = null;
let onPointerMove = null;
let onPointerUp = null;
let onPointerCancel = null;

let runtimeState = null;
let lastBuiltVariant = null;

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round3(value) {
  return Math.round((value ?? 0) * 1000) / 1000;
}

function pickNumber(...values) {
  for (const value of values) {
    if (isFiniteNumber(value)) return value;
  }
  return null;
}

function pickString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.length > 0) return value;
  }
  return null;
}

function normalizeWorldVariant(value) {
  if (!Number.isInteger(value)) return DEFAULT_WORLD_VARIANT;
  return Math.max(1, Math.min(9, value));
}

function normalizeTraversalMode(value) {
  const upper = typeof value === "string" ? value.toUpperCase() : "";
  return VALID_TRAVERSAL_MODES.includes(upper) ? upper : DEFAULT_TRAVERSAL_MODE;
}

function getKernelDefaults() {
  const kernel = normalizeObject(worldKernel);
  const runtime = normalizeObject(kernel.runtime);
  const worldMode = normalizeObject(runtime.worldMode);

  return {
    defaultWorldVariant: normalizeWorldVariant(worldMode.defaultWorldVariant),
    defaultTraversalMode: normalizeTraversalMode(worldMode.defaultTraversalMode)
  };
}

function createWorldVariantState(activeVariant = DEFAULT_WORLD_VARIANT) {
  const variant = normalizeWorldVariant(activeVariant);
  const compositionScale = variant / 9;
  const baseScale = 1 - compositionScale;
  const ratioRight = Math.max(1, 10 - variant);

  return Object.freeze({
    activeVariant: variant,
    ratio: `${variant}:${ratioRight}`,
    compositionScale: round3(compositionScale),
    baseScale: round3(baseScale),

    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      variantLatticeIndex: (variant - 1) * 32,
      variantBand: `VARIANT_${variant}`,
      variantEnvelope: round3(compositionScale)
    }),

    cardinalBinding: Object.freeze({
      activeCardinalAxis: "NORTH",
      northWeight: 1,
      southWeight: 0.85,
      eastWeight: 0.9,
      westWeight: 0.9
    }),

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: Math.max(0, Math.min(15, variant - 1)),
      nodeClass: "SUBSTANCE_ROUTE",
      nodeRoute: `VARIANT_NODE_${Math.max(0, Math.min(15, variant - 1))}`,
      nodeModifiers: Object.freeze({
        compositionWeight: round3(compositionScale),
        baseWeight: round3(Math.max(baseScale, 0.111))
      })
    }),

    regionalCompositionBias: Object.freeze({
      HARBOR_CONTINENT: 0.11,
      GRATITUDE_CONTINENT: 0.22,
      GENEROSITY_CONTINENT: 0.33,
      DEPENDABILITY_CONTINENT: 0.44,
      ACCOUNTABILITY_CONTINENT: 0.56,
      HUMILITY_CONTINENT: 0.67,
      FORGIVENESS_CONTINENT: 0.78,
      SELF_CONTROL_CONTINENT: 0.89,
      PURITY_CONTINENT: 1.0
    }),

    materialModifiers: Object.freeze({
      diamondScale: round3(compositionScale),
      opalScale: round3(compositionScale),
      graniteScale: round3(Math.max(baseScale, 0.15)),
      metalScale: round3(0.25 + compositionScale * 0.5),
      clayScale: round3(Math.max(baseScale, 0.2)),
      sandScale: round3(Math.max(baseScale, 0.2)),
      siltScale: round3(Math.max(baseScale, 0.2)),
      soilScale: round3(Math.max(baseScale, 0.25))
    }),

    sedimentModifiers: Object.freeze({
      preciousSedimentBias: round3(compositionScale),
      baseSedimentBias: round3(Math.max(baseScale, 0.15)),
      transportBias: 1,
      depositionBias: 1
    }),

    diagnostics: Object.freeze({
      activeVariant: variant,
      ratioLabel: `${variant}:${ratioRight}`,
      compositionScale: round3(compositionScale),
      baseScale: round3(baseScale),
      variantLatticeIndex: (variant - 1) * 32,
      activeCardinalAxis: "NORTH",
      activeNodeIndex: Math.max(0, Math.min(15, variant - 1))
    })
  });
}

function createTraversalState(mode = DEFAULT_TRAVERSAL_MODE) {
  const activeMode = normalizeTraversalMode(mode);

  const byMode = {
    NORTH: {
      terrainBias: Object.freeze({
        contrastWeight: 1.0,
        edgeWeight: 1.0,
        elevationWeight: 1.0,
        cutWeight: 0.95
      }),
      hydrationBias: Object.freeze({
        flowContinuityWeight: 0.85,
        boundaryWeight: 0.9,
        hierarchyWeight: 1.0,
        directionWeight: 0.9
      }),
      subsurfaceBias: Object.freeze({
        detectabilityWeight: 1.0,
        pathWeight: 0.95,
        inferenceWeight: 1.0
      }),
      convergenceBias: 0.7,
      expansionBias: 0.8,
      cardinalBinding: Object.freeze({
        axis: "N",
        northWeight: 1.0,
        southWeight: 0.7,
        eastWeight: 0.8,
        westWeight: 0.8
      }),
      navigationBias: Object.freeze({
        preferredDirection: "N",
        stabilityWeight: 1.0,
        deviationPenalty: 0.9
      })
    },

    SOUTH: {
      terrainBias: Object.freeze({
        contrastWeight: 0.9,
        edgeWeight: 0.85,
        elevationWeight: 0.8,
        cutWeight: 0.85
      }),
      hydrationBias: Object.freeze({
        flowContinuityWeight: 0.9,
        boundaryWeight: 0.9,
        hierarchyWeight: 0.85,
        directionWeight: 0.85
      }),
      subsurfaceBias: Object.freeze({
        detectabilityWeight: 0.85,
        pathWeight: 0.9,
        inferenceWeight: 0.9
      }),
      convergenceBias: 1.0,
      expansionBias: 0.7,
      cardinalBinding: Object.freeze({
        axis: "S",
        northWeight: 0.7,
        southWeight: 1.0,
        eastWeight: 0.75,
        westWeight: 0.75
      }),
      navigationBias: Object.freeze({
        preferredDirection: "S",
        stabilityWeight: 0.95,
        deviationPenalty: 0.85
      })
    },

    EAST: {
      terrainBias: Object.freeze({
        contrastWeight: 0.85,
        edgeWeight: 0.9,
        elevationWeight: 0.85,
        cutWeight: 0.9
      }),
      hydrationBias: Object.freeze({
        flowContinuityWeight: 1.0,
        boundaryWeight: 0.85,
        hierarchyWeight: 0.9,
        directionWeight: 1.0
      }),
      subsurfaceBias: Object.freeze({
        detectabilityWeight: 0.9,
        pathWeight: 1.0,
        inferenceWeight: 0.85
      }),
      convergenceBias: 0.7,
      expansionBias: 1.0,
      cardinalBinding: Object.freeze({
        axis: "E",
        northWeight: 0.8,
        southWeight: 0.8,
        eastWeight: 1.0,
        westWeight: 0.7
      }),
      navigationBias: Object.freeze({
        preferredDirection: "E",
        stabilityWeight: 0.9,
        deviationPenalty: 0.8
      })
    },

    WEST: {
      terrainBias: Object.freeze({
        contrastWeight: 0.9,
        edgeWeight: 0.95,
        elevationWeight: 0.9,
        cutWeight: 0.95
      }),
      hydrationBias: Object.freeze({
        flowContinuityWeight: 0.85,
        boundaryWeight: 0.9,
        hierarchyWeight: 0.9,
        directionWeight: 0.8
      }),
      subsurfaceBias: Object.freeze({
        detectabilityWeight: 0.9,
        pathWeight: 0.9,
        inferenceWeight: 1.0
      }),
      convergenceBias: 0.9,
      expansionBias: 0.7,
      cardinalBinding: Object.freeze({
        axis: "W",
        northWeight: 0.8,
        southWeight: 0.8,
        eastWeight: 0.7,
        westWeight: 1.0
      }),
      navigationBias: Object.freeze({
        preferredDirection: "W",
        stabilityWeight: 0.95,
        deviationPenalty: 0.85
      })
    }
  };

  const selected = byMode[activeMode];

  return Object.freeze({
    activeMode,

    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      traversalLatticeIndex:
        activeMode === "NORTH" ? 32 :
        activeMode === "SOUTH" ? 96 :
        activeMode === "EAST" ? 160 :
        224,
      traversalBand: activeMode,
      traversalEnvelope: 1
    }),

    cardinalBinding: selected.cardinalBinding,

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex:
        activeMode === "NORTH" ? 0 :
        activeMode === "SOUTH" ? 4 :
        activeMode === "EAST" ? 8 :
        12,
      nodeClass: "TRAVERSAL_ROUTE",
      nodeRoute: `${activeMode}_TRAVERSAL_ROUTE`,
      nodeModifiers: Object.freeze({
        convergenceBias: selected.convergenceBias,
        expansionBias: selected.expansionBias
      })
    }),

    terrainBias: selected.terrainBias,
    hydrationBias: selected.hydrationBias,
    subsurfaceBias: selected.subsurfaceBias,
    convergenceBias: selected.convergenceBias,
    expansionBias: selected.expansionBias,

    directionalFieldBias: Object.freeze({
      northFlowWeight: selected.cardinalBinding.northWeight,
      southFlowWeight: selected.cardinalBinding.southWeight,
      eastFlowWeight: selected.cardinalBinding.eastWeight,
      westFlowWeight: selected.cardinalBinding.westWeight
    }),

    navigationBias: selected.navigationBias,

    diagnostics: Object.freeze({
      activeMode,
      traversalLatticeIndex:
        activeMode === "NORTH" ? 32 :
        activeMode === "SOUTH" ? 96 :
        activeMode === "EAST" ? 160 :
        224,
      activeNodeIndex:
        activeMode === "NORTH" ? 0 :
        activeMode === "SOUTH" ? 4 :
        activeMode === "EAST" ? 8 :
        12
    })
  });
}

function createInitialCoherenceBindingState() {
  return Object.freeze({
    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      coherenceLatticeIndex: 0,
      latticeSpread: 1,
      latticeDecay: 0
    }),

    cardinalBinding: Object.freeze({
      northWeight: 1,
      southWeight: 1,
      eastWeight: 1,
      westWeight: 1
    }),

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: 0,
      nodeAggregationFactor: 1,
      nodeVariancePenalty: 0,
      nodeStabilityBoost: 1
    }),

    entityContributions: Object.freeze({}),
    groupContributions: Object.freeze({}),
    localField: Object.freeze({}),
    regionalField: Object.freeze({}),

    globalField: Object.freeze({
      coherence: 1,
      noise: 0,
      stability: 1
    }),

    coherenceEnvelope: Object.freeze({
      min: 1,
      max: 1,
      average: 1,
      variance: 0
    }),

    stabilityEnvelope: Object.freeze({
      min: 1,
      max: 1,
      average: 1,
      variance: 0
    }),

    diagnostics: Object.freeze({
      globalCoherence: 1,
      globalStability: 1,
      variance: 0,
      hotspotRegions: [],
      noiseSpikes: [],
      authorityMismatchCount: 0,
      groupFragmentationCount: 0
    })
  });
}

function createInitialPerceptionModifiersState() {
  return Object.freeze({
    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      perceptionLatticeIndex: 0,
      perceptionSpread: 1,
      perceptionDecay: 0
    }),

    cardinalBinding: Object.freeze({
      northWeight: 1,
      southWeight: 1,
      eastWeight: 1,
      westWeight: 1
    }),

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: 0,
      nodeClarityBoost: 1,
      nodeNoisePenalty: 0,
      nodeStabilityWeight: 1
    }),

    terrain: Object.freeze({
      contrast: 1,
      edgeClarity: 1,
      elevationFidelity: 1,
      cutDetectability: 1,
      discontinuityVisibility: 1
    }),

    hydration: Object.freeze({
      flowContinuity: 1,
      boundaryClarity: 1,
      hierarchyVisibility: 1,
      reservoirReadability: 1,
      flowDirectionLegibility: 1
    }),

    subsurface: Object.freeze({
      detectability: 1,
      pathContinuity: 1,
      entryInference: 1,
      hiddenPassageLegibility: 1,
      signalIntegrity: 1
    }),

    lighting: Object.freeze({
      intensity: 1,
      stability: 1,
      radius: 1,
      activationReadiness: 1
    }),

    globalEnvelope: Object.freeze({
      clarityLevel: 1,
      noiseLevel: 0,
      stabilityLevel: 1,
      coherenceAverage: 1,
      variance: 0
    }),

    diagnostics: Object.freeze({
      clarityLevel: 1,
      noiseLevel: 0,
      stabilityLevel: 1,
      authorityEffect: 1,
      coordinationEffect: 1,
      traversalEffect: 1,
      flowDivergence: 0
    })
  });
}

function createInitialSubsurfaceActivationState() {
  return Object.freeze({
    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      subsurfaceLatticeIndex: 0,
      accessSpread: 1,
      accessDecay: 0
    }),

    cardinalBinding: Object.freeze({
      northWeight: 1,
      southWeight: 1,
      eastWeight: 1,
      westWeight: 1,
      preferredEntryAxis: "N"
    }),

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: 0,
      nodeWakeFactor: 1,
      nodeStabilityFactor: 1,
      nodeAccessPenalty: 0
    }),

    activeDepthTier: 0,
    zoneState: "DORMANT",

    accessState: Object.freeze({
      accessAllowed: false,
      failedConditions: ["bootstrap"],
      requiredAuthority: 0,
      requiredCoherence: 0.2,
      requiredEquipment: 0,
      requiredCoordination: 0.1,
      requiredParticipants: 1,
      actualAuthority: 0,
      actualCoherence: 0,
      actualEquipment: 0,
      actualCoordination: 0,
      actualParticipants: 0
    }),

    lightingState: Object.freeze({
      intensity: 0,
      stability: 0,
      radius: 0,
      activationReadiness: 0,
      localizedOnly: true
    }),

    wakeState: Object.freeze({
      authorizedPresence: false,
      wakeAllowed: false,
      wakeDelay: 0,
      sleepDelay: 0,
      pathStabilized: false
    }),

    teamState: Object.freeze({
      participantCount: 0,
      requiredParticipants: 1,
      coordinationFactor: 0,
      crossGroupCoherence: 0,
      multiTeamRequired: false,
      teamPass: false
    }),

    waterEntryState: Object.freeze({
      seaEntryCandidate: false,
      waterEntryAllowed: false,
      requiredWaterEquipment: 0,
      requiredWaterCoordination: 0,
      flowStabilityPass: false
    }),

    stabilityEnvelope: Object.freeze({
      coherence: 0,
      stability: 0,
      zoneStability: 0,
      flickerRisk: 1,
      pathLossRisk: 1
    }),

    diagnostics: Object.freeze({
      accessAllowed: false,
      zoneState: "DORMANT",
      activeDepthTier: 0,
      failedConditions: ["bootstrap"],
      requiredVsActual: Object.freeze({}),
      crossGroupCoherence: 0,
      wakeAllowed: false,
      lightingReadiness: 0,
      zoneStability: 0
    })
  });
}

function createInitialWorldModeState(defaultWorldVariant, defaultTraversalMode) {
  const variantState = createWorldVariantState(defaultWorldVariant);
  const traversalState = createTraversalState(defaultTraversalMode);
  const coherenceBindingState = createInitialCoherenceBindingState();
  const perceptionModifiersState = createInitialPerceptionModifiersState();
  const subsurfaceActivationState = createInitialSubsurfaceActivationState();

  return Object.freeze({
    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      unifiedLatticeIndex: 0,
      latticeContinuity: 1
    }),

    cardinalBinding: traversalState.cardinalBinding,

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: 0,
      nodeAggregationFactor: 1,
      nodeStabilityFactor: 1,
      nodeContinuity: 1
    }),

    variantState,
    traversalState,
    coherenceBindingState,
    perceptionModifiersState,
    subsurfaceActivationState,

    effectivePerceptionEnvelope: Object.freeze({
      terrain: perceptionModifiersState.terrain,
      hydration: perceptionModifiersState.hydration,
      subsurface: perceptionModifiersState.subsurface,
      lighting: perceptionModifiersState.lighting
    }),

    effectiveAccessEnvelope: Object.freeze({
      accessAllowed: subsurfaceActivationState.accessState.accessAllowed,
      zoneState: subsurfaceActivationState.zoneState,
      depthTier: subsurfaceActivationState.activeDepthTier,
      stability: subsurfaceActivationState.stabilityEnvelope.zoneStability
    }),

    diagnostics: Object.freeze({
      activeVariant: variantState.activeVariant,
      activeTraversalMode: traversalState.activeMode,
      coherenceLevel: coherenceBindingState.globalField.coherence,
      stabilityLevel: coherenceBindingState.globalField.stability,
      perceptionSummary: perceptionModifiersState.globalEnvelope,
      accessSummary: subsurfaceActivationState.diagnostics,
      bindingIntegrity: true
    })
  });
}

function createInitialRuntimeState() {
  const defaults = getKernelDefaults();

  const worldModeState = createInitialWorldModeState(
    defaults.defaultWorldVariant,
    defaults.defaultTraversalMode
  );

  return {
    worldVariantState: worldModeState.variantState,
    traversalState: worldModeState.traversalState,
    coherenceBindingState: worldModeState.coherenceBindingState,
    perceptionModifiersState: worldModeState.perceptionModifiersState,
    subsurfaceActivationState: worldModeState.subsurfaceActivationState,
    worldModeState
  };
}

function ensureRuntimeState() {
  if (!runtimeState) {
    runtimeState = createInitialRuntimeState();
  }
  return runtimeState;
}

function buildPlanetFieldInput() {
  ensureRuntimeState();

  return Object.freeze({
    worldVariantState: runtimeState.worldVariantState,
    traversalState: runtimeState.traversalState,
    coherenceBindingState: runtimeState.coherenceBindingState,
    perceptionModifiersState: runtimeState.perceptionModifiersState,
    subsurfaceActivationState: runtimeState.subsurfaceActivationState,
    worldModeState: runtimeState.worldModeState
  });
}

function rebuildPlanetFieldIfNeeded(force = false) {
  if (!planetEngine || typeof planetEngine.buildPlanetField !== "function") {
    throw new Error("planet_engine missing buildPlanetField()");
  }

  const activeVariant = normalizeWorldVariant(runtimeState?.worldVariantState?.activeVariant);
  if (!force && planetField && lastBuiltVariant === activeVariant) {
    return;
  }

  planetField = planetEngine.buildPlanetField(buildPlanetFieldInput());
  if (!planetField) {
    throw new Error("planet_engine returned empty field");
  }

  lastBuiltVariant = activeVariant;
}

function validateRuntimeStateCompleteness() {
  ensureRuntimeState();

  if (!runtimeState.worldVariantState) throw new Error("runtime missing worldVariantState");
  if (!runtimeState.traversalState) throw new Error("runtime missing traversalState");
  if (!runtimeState.coherenceBindingState) throw new Error("runtime missing coherenceBindingState");
  if (!runtimeState.perceptionModifiersState) throw new Error("runtime missing perceptionModifiersState");
  if (!runtimeState.subsurfaceActivationState) throw new Error("runtime missing subsurfaceActivationState");
  if (!runtimeState.worldModeState) throw new Error("runtime missing worldModeState");
}

function ensureReceipt() {
  ensureRuntimeState();

  if (!window[RECEIPT_KEY]) {
    window[RECEIPT_KEY] = {
      bootSource: "/index.html",
      runtimeSource: "/world/runtime/world_runtime.js",
      inputOwner: "/world/control.js",
      orbitOwner: "/world/control.js",
      renderSource: "/world/render.js",
      transitionSource: null,
      duplicateRuntime: false,
      duplicateRender: false,
      duplicateInput: false,

      page: "world",
      phase: "BOOT",
      mode: "active",
      timestamp: 0,
      fps: 0,
      dtMs: 0,

      control: {
        motionState: {
          yaw: 0,
          pitch: 0,
          yawVelocity: 0,
          pitchVelocity: 0,
          orbitPhase: 0,
          zoomCurrent: 0,
          zoomTarget: 0,
          mode: null
        },
        orbitalState: {
          orbitPhase: 0
        },
        projectionSummary: null,
        cameraState: null
      },

      renderAudit: {
        sampleCount: 0,
        waterFamilyCount: 0,
        landFamilyCount: 0,
        cryosphereCount: 0,
        shorelineCount: 0
      },

      emissionReceipt: {
        emissionOrbitalCount: 0,
        emissionFrontVisible: 0,
        emissionEmitted: 0,
        emissionSuppressed: 0,
        emissionPass: false
      },

      placementReceipt: {
        markerRequired: false,
        placementPlaced: 0,
        markerCollisionCount: 0,
        placementReservedReject: 0,
        placementViewportReject: 0,
        placementPass: false
      },

      scope: {
        activeScope: "UNKNOWN",
        scopeSizeKm: null,
        scopeAnchor: null,
        scopeTransitionState: null
      },

      lens: {
        lensTier: null,
        lensMode: "UNKNOWN",
        zoomCurrent: 0,
        zoomTarget: 0,
        zoomMin: 0,
        zoomMax: 0
      },

      primitive: {
        primitiveType: "UNKNOWN",
        primitivePath: "UNKNOWN",
        centerAnchored: false,
        rowColumnPathActive: false,
        sectorBandPathActive: false
      },

      topology: {
        topologyMode: "UNKNOWN",
        neighborLaw: "UNKNOWN",
        visibleCellCount: 0,
        emittedCellCount: 0,
        skippedCellCount: 0
      },

      renderAuthority: {
        renderReadsScope: false,
        renderReadsLens: false,
        fallbackMode: false,
        liveRenderPath: "UNKNOWN"
      },

      density: {
        averageCellSpanPx: 0,
        subdivisionTier: 0,
        densityTier: "UNKNOWN"
      },

      worldVariantState: runtimeState.worldVariantState,
      traversalState: runtimeState.traversalState,
      coherenceBindingState: runtimeState.coherenceBindingState,
      perceptionModifiersState: runtimeState.perceptionModifiersState,
      subsurfaceActivationState: runtimeState.subsurfaceActivationState,
      worldModeState: runtimeState.worldModeState,

      instrument: null,

      verification: {
        pass: false
      },

      failure: {
        phase: null,
        message: null
      }
    };
  }

  return window[RECEIPT_KEY];
}

function emitRuntimeReceiptContinuous(receipt, extra = {}) {
  const payload = {
    page: "/index.html",
    phase: receipt.verification?.pass === true ? "RUNNING" : "BOOT",
    mode: receipt.mode || "active",
    timestamp: new Date().toISOString(),

    fps: receipt.fps || 0,
    dtMs: receipt.dtMs || 0,

    control: {
      motionState: receipt.control?.motionState || {},
      orbitalState: receipt.control?.orbitalState || {},
      projectionSummary: receipt.control?.projectionSummary || null,
      cameraState: receipt.control?.cameraState || null
    },

    worldVariantState: receipt.worldVariantState || {},
    traversalState: receipt.traversalState || {},
    coherenceBindingState: receipt.coherenceBindingState || {},
    perceptionModifiersState: receipt.perceptionModifiersState || {},
    subsurfaceActivationState: receipt.subsurfaceActivationState || {},
    worldModeState: receipt.worldModeState || {},

    instrument: receipt.instrument || {},
    renderAudit: receipt.renderAudit || {},
    emissionReceipt: receipt.emissionReceipt || {},
    placementReceipt: receipt.placementReceipt || {},

    scope: receipt.scope || {},
    lens: receipt.lens || {},
    primitive: receipt.primitive || {},
    topology: receipt.topology || {},
    renderAuthority: receipt.renderAuthority || {},
    density: receipt.density || {},

    verification: receipt.verification || { pass: false },

    failure: {
      phase: receipt.failure?.phase || null,
      message: receipt.failure?.message || ""
    },

    ...extra
  };

  try {
    localStorage.setItem(RUNTIME_STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

function setFailure(phase, message) {
  const receipt = ensureReceipt();
  receipt.verification.pass = false;
  receipt.phase = "BOOT";
  receipt.failure.phase = phase;
  receipt.failure.message = message;
}

function clearFailure() {
  const receipt = ensureReceipt();
  receipt.failure.phase = null;
  receipt.failure.message = null;
}

function getCanvas() {
  const el = document.getElementById("world");
  if (!el) {
    throw new Error("Missing #world canvas");
  }
  return el;
}

function resize() {
  if (!canvas || !ctx) return;

  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (control && typeof control.resize === "function") {
    control.resize(width, height);
  }
}

function setupSystems() {
  ensureRuntimeState();

  planetEngine = createPlanetEngine();
  renderer = createRenderer();
  control = createControlSystem();
  instrumentApi = typeof instruments.createInstruments === "function"
    ? instruments.createInstruments()
    : null;

  if (!planetEngine || typeof planetEngine.buildPlanetField !== "function") {
    throw new Error("planet_engine missing buildPlanetField()");
  }

  if (!renderer || typeof renderer.renderPlanet !== "function") {
    throw new Error("render.js missing renderPlanet()");
  }

  if (!control) {
    throw new Error("control.js missing createControlSystem()");
  }

  rebuildPlanetFieldIfNeeded(true);
}

function safe(fn, fallback = null) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

function updateControlReceipt(receipt) {
  const motionState = safe(
    () => (typeof control.getMotionState === "function" ? control.getMotionState() : null),
    null
  );

  const orbitalState = safe(
    () => (typeof control.getOrbitalState === "function" ? control.getOrbitalState() : null),
    null
  );

  const projectionSummary = safe(
    () => (typeof control.getProjectionSummary === "function" ? control.getProjectionSummary() : null),
    null
  );

  const cameraState = safe(
    () => (typeof control.getCameraState === "function" ? control.getCameraState() : null),
    null
  );

  const scopeState = safe(
    () => (typeof control.getScopeState === "function" ? control.getScopeState() : null),
    null
  );

  const lensState = safe(
    () => (typeof control.getLensState === "function" ? control.getLensState() : null),
    null
  );

  if (motionState) receipt.control.motionState = motionState;
  if (orbitalState) receipt.control.orbitalState = orbitalState;
  receipt.control.projectionSummary = projectionSummary;
  receipt.control.cameraState = cameraState;

  const camera = normalizeObject(cameraState);
  const scope = normalizeObject(scopeState);
  const lens = normalizeObject(lensState);
  const motion = normalizeObject(motionState);

  receipt.scope.activeScope =
    pickString(scope.activeScope, camera.activeScope, receipt.scope.activeScope, "UNKNOWN") || "UNKNOWN";
  receipt.scope.scopeSizeKm =
    pickNumber(scope.scopeSizeKm, camera.scopeSizeKm, receipt.scope.scopeSizeKm);
  receipt.scope.scopeAnchor =
    pickString(scope.scopeAnchor, camera.scopeAnchor, receipt.scope.scopeAnchor);
  receipt.scope.scopeTransitionState =
    scope.scopeTransitionState ?? camera.scopeTransitionState ?? receipt.scope.scopeTransitionState ?? null;

  receipt.lens.lensTier =
    pickNumber(lens.lensTier, camera.lensTier, receipt.lens.lensTier);
  receipt.lens.lensMode =
    pickString(lens.lensMode, camera.lensMode, receipt.lens.lensMode, "UNKNOWN") || "UNKNOWN";
  receipt.lens.zoomCurrent =
    pickNumber(lens.zoomCurrent, camera.zoomCurrent, motion.zoomCurrent, receipt.lens.zoomCurrent, 0) ?? 0;
  receipt.lens.zoomTarget =
    pickNumber(lens.zoomTarget, camera.zoomTarget, motion.zoomTarget, receipt.lens.zoomTarget, 0) ?? 0;
  receipt.lens.zoomMin =
    pickNumber(lens.zoomMin, camera.zoomMin, motion.zoomMin, receipt.lens.zoomMin, 0) ?? 0;
  receipt.lens.zoomMax =
    pickNumber(lens.zoomMax, camera.zoomMax, motion.zoomMax, receipt.lens.zoomMax, 0) ?? 0;
}

function buildRenderOptions(receipt) {
  return {
    ctx,
    planetField,
    worldKernel,
    projectPoint: (lat, lon, r = 0) => {
      if (typeof control.projectSphere === "function") {
        return control.projectSphere(lat, lon, r);
      }
      return null;
    },
    viewState:
      typeof control.getCameraState === "function"
        ? control.getCameraState()
        : null,

    worldModeState: receipt.worldModeState,
    worldVariantState: receipt.worldVariantState,
    traversalState: receipt.traversalState,
    perceptionModifiersState: receipt.perceptionModifiersState,

    runtimeWorldModeState: receipt.worldModeState,
    runtimeWorldVariantState: receipt.worldVariantState,
    runtimeTraversalState: receipt.traversalState,
    runtimePerceptionModifiersState: receipt.perceptionModifiersState
  };
}

function renderFrame(receipt) {
  const renderResult =
    renderer.renderPlanet(buildRenderOptions(receipt)) || {};

  const audit = normalizeObject(renderResult.audit);
  const orbitalAudit = normalizeObject(renderResult.orbitalAudit);
  const placementAudit = normalizeObject(renderResult.placementAudit || renderResult.placementReceipt);
  const primitive = normalizeObject(renderResult.primitive);
  const topology = normalizeObject(renderResult.topology);
  const renderAuthority = normalizeObject(renderResult.renderAuthority);
  const density = normalizeObject(renderResult.density);

  receipt.renderAudit.sampleCount = audit.sampleCount ?? 0;
  receipt.renderAudit.waterFamilyCount = audit.waterFamilyCount ?? 0;
  receipt.renderAudit.landFamilyCount = audit.landFamilyCount ?? 0;
  receipt.renderAudit.cryosphereCount = audit.cryosphereCount ?? 0;
  receipt.renderAudit.shorelineCount = audit.shorelineCount ?? 0;

  receipt.emissionReceipt.emissionOrbitalCount = orbitalAudit.count ?? 0;
  receipt.emissionReceipt.emissionFrontVisible = orbitalAudit.frontVisibleCount ?? 0;
  receipt.emissionReceipt.emissionEmitted = orbitalAudit.emittedCount ?? 0;
  receipt.emissionReceipt.emissionSuppressed =
    (orbitalAudit.rejectedBackfaceCount ?? 0) +
    (orbitalAudit.rejectedWeakVisibilityCount ?? 0);
  receipt.emissionReceipt.emissionPass = true;

  receipt.placementReceipt.markerRequired = placementAudit.markerRequired ?? false;
  receipt.placementReceipt.placementPlaced = placementAudit.placementPlaced ?? 0;
  receipt.placementReceipt.markerCollisionCount = placementAudit.markerCollisionCount ?? 0;
  receipt.placementReceipt.placementReservedReject = placementAudit.placementReservedReject ?? 0;
  receipt.placementReceipt.placementViewportReject = placementAudit.placementViewportReject ?? 0;
  receipt.placementReceipt.placementPass = placementAudit.placementPass ?? false;

  receipt.primitive.primitiveType =
    pickString(primitive.primitiveType, receipt.primitive.primitiveType, "UNKNOWN") || "UNKNOWN";
  receipt.primitive.primitivePath =
    pickString(primitive.primitivePath, receipt.primitive.primitivePath, "UNKNOWN") || "UNKNOWN";
  receipt.primitive.centerAnchored = primitive.centerAnchored === true;
  receipt.primitive.rowColumnPathActive = primitive.rowColumnPathActive === true;
  receipt.primitive.sectorBandPathActive = primitive.sectorBandPathActive === true;

  receipt.topology.topologyMode =
    pickString(topology.topologyMode, receipt.topology.topologyMode, "UNKNOWN") || "UNKNOWN";
  receipt.topology.neighborLaw =
    pickString(topology.neighborLaw, receipt.topology.neighborLaw, "UNKNOWN") || "UNKNOWN";
  receipt.topology.visibleCellCount =
    pickNumber(topology.visibleCellCount, receipt.topology.visibleCellCount, 0) ?? 0;
  receipt.topology.emittedCellCount =
    pickNumber(topology.emittedCellCount, receipt.topology.emittedCellCount, 0) ?? 0;
  receipt.topology.skippedCellCount =
    pickNumber(topology.skippedCellCount, receipt.topology.skippedCellCount, 0) ?? 0;

  receipt.renderAuthority.renderReadsScope = renderAuthority.renderReadsScope === true;
  receipt.renderAuthority.renderReadsLens = renderAuthority.renderReadsLens === true;
  receipt.renderAuthority.fallbackMode = renderAuthority.fallbackMode === true;
  receipt.renderAuthority.liveRenderPath =
    pickString(renderAuthority.liveRenderPath, receipt.renderAuthority.liveRenderPath, "UNKNOWN") || "UNKNOWN";
  receipt.renderAuthority.renderReadsWorldMode = renderAuthority.renderReadsWorldMode === true;

  receipt.density.averageCellSpanPx =
    pickNumber(density.averageCellSpanPx, receipt.density.averageCellSpanPx, 0) ?? 0;
  receipt.density.subdivisionTier =
    pickNumber(density.subdivisionTier, receipt.density.subdivisionTier, 0) ?? 0;
  receipt.density.densityTier =
    pickString(density.densityTier, receipt.density.densityTier, "UNKNOWN") || "UNKNOWN";
}

function resolveCurrentSample(projectionSummary) {
  const summary = normalizeObject(projectionSummary);
  const samples = Array.isArray(planetField?.samples) ? planetField.samples : [];
  const sampleY = Number.isInteger(summary.sampleY) ? summary.sampleY : null;
  const sampleX = Number.isInteger(summary.sampleX) ? summary.sampleX : null;

  if (sampleY === null || sampleX === null) return null;
  return samples?.[sampleY]?.[sampleX] ?? null;
}

function buildAuthorityState(receipt) {
  return {
    shellSource: receipt.bootSource,
    runtimeSource: receipt.runtimeSource,
    truthSource: "/world/planet_engine.js",
    structureSource: receipt.runtimeSource,
    projectionOwner: receipt.inputOwner,
    renderSource: receipt.renderSource,
    controlSource: receipt.inputOwner,
    inputOwner: receipt.inputOwner,
    orbitSource: receipt.orbitOwner,
    instrumentSource: "/assets/instruments.js",
    worldUiSource: null,
    transitionSource: receipt.transitionSource,
    receiptWriter: receipt.runtimeSource
  };
}

function buildMotionStateForInstruments(receipt) {
  return {
    ...normalizeObject(receipt.control.motionState),
    motionRunning: true,
    rafActive: rafId !== 0,
    pageVisible: typeof document !== "undefined" ? document.visibilityState === "visible" : true,
    pageRestored: hasCommittedRunning
  };
}

function computeAuthoritySignal(receipt) {
  const motion = normalizeObject(receipt.control.motionState);
  const zoomCurrent = clamp(pickNumber(motion.zoomCurrent, receipt.lens.zoomCurrent, 0) ?? 0, 0, 1);
  return round3(clamp(0.55 + zoomCurrent * 0.45, 0, 1));
}

function computeLocalCellId(receipt) {
  const projectionSummary = normalizeObject(receipt.control.projectionSummary);
  const sampleX = Number.isInteger(projectionSummary.sampleX) ? projectionSummary.sampleX : null;
  const sampleY = Number.isInteger(projectionSummary.sampleY) ? projectionSummary.sampleY : null;
  return sampleX === null || sampleY === null ? "UNKNOWN" : `${sampleX}:${sampleY}`;
}

function computeRegionalZoneId(sample) {
  if (!sample || typeof sample !== "object") return "UNKNOWN";
  return (
    sample.regionId ||
    sample.continentMass ||
    sample.continentId ||
    sample.continentClass ||
    sample.macroRegion ||
    "UNKNOWN"
  );
}

function deriveWorldVariantState(receipt) {
  const current = runtimeState.worldVariantState;
  const activeVariant = normalizeWorldVariant(current?.activeVariant ?? DEFAULT_WORLD_VARIANT);
  runtimeState.worldVariantState = createWorldVariantState(activeVariant);
  receipt.worldVariantState = runtimeState.worldVariantState;
}

function deriveTraversalState(receipt) {
  const current = runtimeState.traversalState;
  const activeMode = normalizeTraversalMode(current?.activeMode ?? DEFAULT_TRAVERSAL_MODE);
  runtimeState.traversalState = createTraversalState(activeMode);
  receipt.traversalState = runtimeState.traversalState;
}

function deriveCoherenceBindingState(receipt, now) {
  const sample = resolveCurrentSample(receipt.control.projectionSummary);
  const localCellId = computeLocalCellId(receipt);
  const regionalZoneId = computeRegionalZoneId(sample);
  const authoritySignal = computeAuthoritySignal(receipt);

  const renderAudit = normalizeObject(receipt.renderAudit);
  const sampleCount = Math.max(1, renderAudit.sampleCount || 1);
  const visibleCount = Math.max(1, receipt.topology.visibleCellCount || 1);
  const emittedCount = Math.max(1, receipt.topology.emittedCellCount || 1);
  const visibilityRatio = clamp(emittedCount / visibleCount, 0, 1);

  const sampleSlope = clamp(sample?.slope ?? 0, 0, 1);
  const sampleCanyon = clamp(sample?.canyonStrength ?? 0, 0, 1);
  const sampleRunoff = clamp(sample?.runoff ?? 0, 0, 1);
  const sampleRainfall = clamp(sample?.rainfall ?? 0, 0, 1);
  const shorelineSignal = clamp((renderAudit.shorelineCount / sampleCount) * 24, 0, 1);
  const cryosphereSignal = clamp((renderAudit.cryosphereCount / sampleCount) * 32, 0, 1);
  const localCoherence = round3(
    clamp(
      visibilityRatio * 0.34 +
      (1 - sampleSlope) * 0.18 +
      (1 - sampleCanyon) * 0.14 +
      sampleRainfall * 0.12 +
      sampleRunoff * 0.08 +
      shorelineSignal * 0.08 +
      (1 - cryosphereSignal) * 0.06,
      0,
      1
    )
  );

  const localNoise = round3(clamp(1 - localCoherence, 0, 1));
  const localStability = round3(clamp(localCoherence * (1 - localNoise * 0.45), 0, 1));
  const regionalCoherence = round3(clamp(localCoherence * 0.96 + authoritySignal * 0.04, 0, 1));
  const globalCoherence = round3(clamp(regionalCoherence * 0.95 + authoritySignal * 0.05, 0, 1));
  const globalNoise = round3(clamp(1 - globalCoherence, 0, 1));
  const globalStability = round3(clamp(globalCoherence * (1 - globalNoise * 0.45), 0, 1));

  const coordinationFactor = round3(
    runtimeState.traversalState.activeMode === "SOUTH" ? 0.94 : 0.9
  );
  const contribution = round3(Math.min(globalCoherence * authoritySignal * coordinationFactor, globalCoherence));

  runtimeState.coherenceBindingState = Object.freeze({
    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      coherenceLatticeIndex: clamp(Math.round(globalCoherence * 255), 0, 255),
      latticeSpread: 1,
      latticeDecay: round3(globalNoise)
    }),

    cardinalBinding: runtimeState.traversalState.cardinalBinding,

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: runtimeState.traversalState.nodeBinding.activeNodeIndex,
      nodeAggregationFactor: 1,
      nodeVariancePenalty: round3(globalNoise),
      nodeStabilityBoost: round3(globalStability)
    }),

    entityContributions: Object.freeze({
      PLAYER_0: Object.freeze({
        internalCoherence: globalCoherence,
        authoritySignal,
        coordinationFactor,
        contribution,
        noiseInjection: round3(1 - globalCoherence),
        localCellId
      })
    }),

    groupContributions: Object.freeze({
      SOLO_RUNTIME: Object.freeze({
        memberIds: Object.freeze(["PLAYER_0"]),
        memberCount: 1,
        groupCoherence: globalCoherence,
        coherenceVariance: 0,
        coordinationFactor,
        effectiveForce: contribution
      })
    }),

    localField: Object.freeze({
      [localCellId]: Object.freeze({
        coherence: localCoherence,
        noise: localNoise,
        stability: localStability,
        contributingEntities: Object.freeze(["PLAYER_0"]),
        contributingGroups: Object.freeze(["SOLO_RUNTIME"])
      })
    }),

    regionalField: Object.freeze({
      [regionalZoneId]: Object.freeze({
        coherence: regionalCoherence,
        stability: round3(clamp(regionalCoherence * 0.97, 0, 1)),
        contributorCount: 1
      })
    }),

    globalField: Object.freeze({
      coherence: globalCoherence,
      noise: globalNoise,
      stability: globalStability
    }),

    coherenceEnvelope: Object.freeze({
      min: localCoherence,
      max: globalCoherence,
      average: globalCoherence,
      variance: globalNoise
    }),

    stabilityEnvelope: Object.freeze({
      min: localStability,
      max: globalStability,
      average: globalStability,
      variance: globalNoise
    }),

    diagnostics: Object.freeze({
      globalCoherence,
      globalStability,
      variance: globalNoise,
      hotspotRegions: regionalCoherence < 0.5 ? Object.freeze([regionalZoneId]) : Object.freeze([]),
      noiseSpikes: localNoise > 0.5 ? Object.freeze([localCellId]) : Object.freeze([]),
      authorityMismatchCount: 0,
      groupFragmentationCount: 0,
      timestamp: now
    })
  });

  receipt.coherenceBindingState = runtimeState.coherenceBindingState;
}

function derivePerceptionModifiersState(receipt) {
  const coherenceState = runtimeState.coherenceBindingState;
  const traversalState = runtimeState.traversalState;

  const coherence = coherenceState.globalField.coherence;
  const noise = coherenceState.globalField.noise;
  const stability = coherenceState.globalField.stability;
  const authoritySignal = computeAuthoritySignal(receipt);
  const coordinationSignal =
    runtimeState.coherenceBindingState.groupContributions.SOLO_RUNTIME?.coordinationFactor ?? 0.9;

  const terrain = Object.freeze({
    contrast: round3(clamp(coherence * traversalState.terrainBias.contrastWeight, 0, 1)),
    edgeClarity: round3(clamp(coherence * traversalState.terrainBias.edgeWeight, 0, 1)),
    elevationFidelity: round3(clamp(coherence * stability * traversalState.terrainBias.elevationWeight, 0, 1)),
    cutDetectability: round3(clamp(coherence * (1 - noise) * traversalState.terrainBias.cutWeight, 0, 1)),
    discontinuityVisibility: round3(clamp(coherence * stability * traversalState.terrainBias.cutWeight, 0, 1))
  });

  const hydration = Object.freeze({
    flowContinuity: round3(clamp(coherence * stability * traversalState.hydrationBias.flowContinuityWeight, 0, 1)),
    boundaryClarity: round3(clamp(coherence * traversalState.hydrationBias.boundaryWeight, 0, 1)),
    hierarchyVisibility: round3(clamp(coherence * authoritySignal * traversalState.hydrationBias.hierarchyWeight, 0, 1)),
    reservoirReadability: round3(clamp(coherence * stability * traversalState.hydrationBias.boundaryWeight, 0, 1)),
    flowDirectionLegibility: round3(clamp(coherence * (1 - noise) * traversalState.hydrationBias.directionWeight, 0, 1))
  });

  const subsurface = Object.freeze({
    detectability: round3(clamp(coherence * authoritySignal * traversalState.subsurfaceBias.detectabilityWeight, 0, 1)),
    pathContinuity: round3(clamp(coherence * stability * traversalState.subsurfaceBias.pathWeight, 0, 1)),
    entryInference: round3(clamp(coherence * authoritySignal * stability * traversalState.subsurfaceBias.inferenceWeight, 0, 1)),
    hiddenPassageLegibility: round3(clamp(coherence * coordinationSignal * traversalState.subsurfaceBias.inferenceWeight, 0, 1)),
    signalIntegrity: round3(clamp(coherence * (1 - noise), 0, 1))
  });

  const lighting = Object.freeze({
    intensity: round3(clamp(authoritySignal * coherence, 0, 1)),
    stability: round3(clamp(coherence * stability, 0, 1)),
    radius: round3(clamp(authoritySignal * coherence * stability, 0, 1)),
    activationReadiness: round3(clamp(coherence * authoritySignal * coordinationSignal, 0, 1))
  });

  runtimeState.perceptionModifiersState = Object.freeze({
    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      perceptionLatticeIndex: coherenceState.latticeBinding.coherenceLatticeIndex,
      perceptionSpread: 1,
      perceptionDecay: coherenceState.globalField.noise
    }),

    cardinalBinding: traversalState.cardinalBinding,

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: traversalState.nodeBinding.activeNodeIndex,
      nodeClarityBoost: coherence,
      nodeNoisePenalty: noise,
      nodeStabilityWeight: stability
    }),

    terrain,
    hydration,
    subsurface,
    lighting,

    globalEnvelope: Object.freeze({
      clarityLevel: coherence,
      noiseLevel: noise,
      stabilityLevel: stability,
      coherenceAverage: coherence,
      variance: coherenceState.coherenceEnvelope.variance
    }),

    diagnostics: Object.freeze({
      clarityLevel: coherence,
      noiseLevel: noise,
      stabilityLevel: stability,
      authorityEffect: authoritySignal,
      coordinationEffect:
        runtimeState.coherenceBindingState.groupContributions.SOLO_RUNTIME?.coordinationFactor ?? 0.9,
      traversalEffect: traversalState.activeMode,
      flowDivergence:
        runtimeState.coherenceBindingState.diagnostics.variance
    })
  });

  receipt.perceptionModifiersState = runtimeState.perceptionModifiersState;
}

function deriveSubsurfaceActivationState(receipt) {
  const coherence = runtimeState.coherenceBindingState.globalField.coherence;
  const stability = runtimeState.coherenceBindingState.globalField.stability;
  const authoritySignal = computeAuthoritySignal(receipt);
  const participantCount =
    runtimeState.coherenceBindingState.groupContributions.SOLO_RUNTIME?.memberCount ?? 1;
  const coordinationFactor =
    runtimeState.coherenceBindingState.groupContributions.SOLO_RUNTIME?.coordinationFactor ?? 0.9;
  const equipmentTier = runtimeState.worldVariantState.activeVariant;
  const sample = resolveCurrentSample(receipt.control.projectionSummary);

  const activeDepthTier = 0;
  const requiredAuthority = 0;
  const requiredCoherence = 0.2;
  const requiredEquipment = 0;
  const requiredCoordination = 0.1;
  const requiredParticipants = 1;

  const failedConditions = [];
  if (!(authoritySignal >= requiredAuthority)) failedConditions.push("authority");
  if (!(coherence >= requiredCoherence)) failedConditions.push("coherence");
  if (!(equipmentTier >= requiredEquipment)) failedConditions.push("equipment");
  if (!(coordinationFactor >= requiredCoordination)) failedConditions.push("coordination");
  if (!(participantCount >= requiredParticipants)) failedConditions.push("participants");

  const accessAllowed = failedConditions.length === 0;
  const zoneState = accessAllowed ? "ACTIVE" : "PARTIAL_ACTIVE";
  const zoneStability = round3(clamp(coherence * stability * coordinationFactor, 0, 1));
  const lighting = runtimeState.perceptionModifiersState.lighting;

  runtimeState.subsurfaceActivationState = Object.freeze({
    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      subsurfaceLatticeIndex: runtimeState.coherenceBindingState.latticeBinding.coherenceLatticeIndex,
      accessSpread: 1,
      accessDecay: round3(1 - zoneStability)
    }),

    cardinalBinding: Object.freeze({
      ...runtimeState.traversalState.cardinalBinding,
      preferredEntryAxis: runtimeState.traversalState.navigationBias.preferredDirection
    }),

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: runtimeState.traversalState.nodeBinding.activeNodeIndex,
      nodeWakeFactor: authoritySignal,
      nodeStabilityFactor: stability,
      nodeAccessPenalty: round3(1 - coherence)
    }),

    activeDepthTier,
    zoneState,

    accessState: Object.freeze({
      accessAllowed,
      failedConditions: Object.freeze(failedConditions),
      requiredAuthority,
      requiredCoherence,
      requiredEquipment,
      requiredCoordination,
      requiredParticipants,
      actualAuthority: authoritySignal,
      actualCoherence: coherence,
      actualEquipment: equipmentTier,
      actualCoordination: coordinationFactor,
      actualParticipants: participantCount
    }),

    lightingState: Object.freeze({
      intensity: lighting.intensity,
      stability: lighting.stability,
      radius: lighting.radius,
      activationReadiness: lighting.activationReadiness,
      localizedOnly: true
    }),

    wakeState: Object.freeze({
      authorizedPresence: true,
      wakeAllowed: accessAllowed,
      wakeDelay: 0,
      sleepDelay: 0,
      pathStabilized: zoneStability >= 0.4
    }),

    teamState: Object.freeze({
      participantCount,
      requiredParticipants,
      coordinationFactor,
      crossGroupCoherence: coherence,
      multiTeamRequired: false,
      teamPass: participantCount >= requiredParticipants && coordinationFactor >= requiredCoordination
    }),

    waterEntryState: Object.freeze({
      seaEntryCandidate: sample?.subsurfaceAccessCandidate === "SEA_ENTRY",
      waterEntryAllowed: false,
      requiredWaterEquipment: 1,
      requiredWaterCoordination: 0.25,
      flowStabilityPass: stability >= 0.4
    }),

    stabilityEnvelope: Object.freeze({
      coherence,
      stability,
      zoneStability,
      flickerRisk: round3(1 - zoneStability),
      pathLossRisk: round3(1 - zoneStability)
    }),

    diagnostics: Object.freeze({
      accessAllowed,
      zoneState,
      activeDepthTier,
      failedConditions: Object.freeze(failedConditions),
      requiredVsActual: Object.freeze({
        authority: `${requiredAuthority} / ${authoritySignal}`,
        coherence: `${requiredCoherence} / ${coherence}`,
        equipment: `${requiredEquipment} / ${equipmentTier}`,
        coordination: `${requiredCoordination} / ${coordinationFactor}`,
        participants: `${requiredParticipants} / ${participantCount}`
      }),
      crossGroupCoherence: coherence,
      wakeAllowed: accessAllowed,
      lightingReadiness: lighting.activationReadiness,
      zoneStability
    })
  });

  receipt.subsurfaceActivationState = runtimeState.subsurfaceActivationState;
}

function bindWorldModeState(receipt) {
  runtimeState.worldModeState = Object.freeze({
    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      unifiedLatticeIndex: runtimeState.coherenceBindingState.latticeBinding.coherenceLatticeIndex,
      latticeContinuity: runtimeState.coherenceBindingState.globalField.stability
    }),

    cardinalBinding: runtimeState.traversalState.cardinalBinding,

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: runtimeState.traversalState.nodeBinding.activeNodeIndex,
      nodeAggregationFactor: 1,
      nodeStabilityFactor: runtimeState.coherenceBindingState.globalField.stability,
      nodeContinuity: runtimeState.coherenceBindingState.globalField.stability
    }),

    variantState: runtimeState.worldVariantState,
    traversalState: runtimeState.traversalState,
    coherenceBindingState: runtimeState.coherenceBindingState,
    perceptionModifiersState: runtimeState.perceptionModifiersState,
    subsurfaceActivationState: runtimeState.subsurfaceActivationState,

    effectivePerceptionEnvelope: Object.freeze({
      terrain: runtimeState.perceptionModifiersState.terrain,
      hydration: runtimeState.perceptionModifiersState.hydration,
      subsurface: runtimeState.perceptionModifiersState.subsurface,
      lighting: runtimeState.perceptionModifiersState.lighting
    }),

    effectiveAccessEnvelope: Object.freeze({
      accessAllowed: runtimeState.subsurfaceActivationState.accessState.accessAllowed,
      zoneState: runtimeState.subsurfaceActivationState.zoneState,
      depthTier: runtimeState.subsurfaceActivationState.activeDepthTier,
      stability: runtimeState.subsurfaceActivationState.stabilityEnvelope.zoneStability
    }),

    diagnostics: Object.freeze({
      activeVariant: runtimeState.worldVariantState.activeVariant,
      activeTraversalMode: runtimeState.traversalState.activeMode,
      coherenceLevel: runtimeState.coherenceBindingState.globalField.coherence,
      stabilityLevel: runtimeState.coherenceBindingState.globalField.stability,
      perceptionSummary: runtimeState.perceptionModifiersState.globalEnvelope,
      accessSummary: runtimeState.subsurfaceActivationState.diagnostics,
      bindingIntegrity: true
    })
  });

  validateRuntimeStateCompleteness();

  receipt.worldVariantState = runtimeState.worldVariantState;
  receipt.traversalState = runtimeState.traversalState;
  receipt.coherenceBindingState = runtimeState.coherenceBindingState;
  receipt.perceptionModifiersState = runtimeState.perceptionModifiersState;
  receipt.subsurfaceActivationState = runtimeState.subsurfaceActivationState;
  receipt.worldModeState = runtimeState.worldModeState;
}

function verifyFrameIntegrity(receipt) {
  if (!planetField) throw new Error("planetField missing");
  if (!receipt.worldModeState) throw new Error("worldModeState missing");
  if (!receipt.worldVariantState) throw new Error("worldVariantState missing");
  if (!receipt.traversalState) throw new Error("traversalState missing");
  if (!receipt.coherenceBindingState) throw new Error("coherenceBindingState missing");
  if (!receipt.perceptionModifiersState) throw new Error("perceptionModifiersState missing");
  if (!receipt.subsurfaceActivationState) throw new Error("subsurfaceActivationState missing");
}

function updateInstrumentReceipt(receipt) {
  try {
    if (!instrumentApi || typeof instrumentApi.buildInstrumentReceipt !== "function") {
      return;
    }

    const projectionSummary = normalizeObject(receipt.control.projectionSummary);
    const currentSample = resolveCurrentSample(projectionSummary);

    receipt.instrument = instrumentApi.buildInstrumentReceipt({
      currentSample,
      previousSample: previousInstrumentSample,
      tickIndex,
      motionState: buildMotionStateForInstruments(receipt),
      authorityState: buildAuthorityState(receipt),
      planetField,
      projectionSummary,
      worldVariantState: receipt.worldVariantState,
      traversalState: receipt.traversalState,
      coherenceBindingState: receipt.coherenceBindingState,
      perceptionModifiersState: receipt.perceptionModifiersState,
      subsurfaceActivationState: receipt.subsurfaceActivationState,
      worldModeState: receipt.worldModeState
    });

    previousInstrumentSample = currentSample ?? previousInstrumentSample;
  } catch {}
}

function disposeRuntime() {
  if (disposed) return;
  disposed = true;

  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  if (canvas && onPointerDown) {
    canvas.removeEventListener("pointerdown", onPointerDown);
  }

  if (onPointerMove) {
    window.removeEventListener("pointermove", onPointerMove);
  }

  if (onPointerUp) {
    window.removeEventListener("pointerup", onPointerUp);
  }

  if (onPointerCancel) {
    window.removeEventListener("pointercancel", onPointerCancel);
  }

  if (onResize) {
    window.removeEventListener("resize", onResize);
  }

  if (onPageHide) {
    window.removeEventListener("pagehide", onPageHide);
  }

  window[RUNTIME_ACTIVE_KEY] = false;
  started = false;
}

function bindInput() {
  if (!canvas || !control) return;

  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  onPointerDown = (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;

    if (typeof control.startDrag === "function") {
      control.startDrag();
    }
  };

  onPointerMove = (e) => {
    if (!dragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    if (typeof control.applyDrag === "function") {
      control.applyDrag(dx, dy);
    }
  };

  onPointerUp = () => {
    if (!dragging) return;
    dragging = false;

    if (typeof control.endDrag === "function") {
      control.endDrag();
    }
  };

  onPointerCancel = () => {
    dragging = false;

    if (typeof control.endDrag === "function") {
      control.endDrag();
    }
  };

  canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointercancel", onPointerCancel, { passive: true });
}

function frame(now) {
  const receipt = ensureReceipt();
  const dtMs = lastNow ? now - lastNow : 16.67;
  lastNow = now;
  tickIndex += 1;

  clearFailure();

  receipt.page = "world";
  receipt.mode = "active";
  receipt.timestamp = now;
  receipt.dtMs = dtMs;
  receipt.fps = dtMs > 0 ? 1000 / dtMs : 0;

  try {
    if (typeof control.stepInertia === "function") {
      control.stepInertia(dtMs);
    }

    updateControlReceipt(receipt);
    deriveWorldVariantState(receipt);
    deriveTraversalState(receipt);
    deriveCoherenceBindingState(receipt, now);
    derivePerceptionModifiersState(receipt);
    deriveSubsurfaceActivationState(receipt);
    bindWorldModeState(receipt);
    rebuildPlanetFieldIfNeeded(false);
    renderFrame(receipt);
    verifyFrameIntegrity(receipt);
    updateInstrumentReceipt(receipt);

    receipt.verification.pass = true;
    receipt.phase = "RUNNING";
    hasCommittedRunning = true;
  } catch (err) {
    setFailure("frame", err instanceof Error ? err.message : String(err));
  }

  emitRuntimeReceiptContinuous(receipt);
  rafId = window.requestAnimationFrame(frame);
}

export function startRuntime() {
  const receipt = ensureReceipt();

  if (started || window[RUNTIME_ACTIVE_KEY]) {
    receipt.duplicateRuntime = true;
    setFailure("startup", "Duplicate runtime detected");
    emitRuntimeReceiptContinuous(receipt);
    return;
  }

  started = true;
  disposed = false;
  hasCommittedRunning = false;
  tickIndex = 0;
  previousInstrumentSample = null;
  window[RUNTIME_ACTIVE_KEY] = true;

  try {
    ensureRuntimeState();

    canvas = getCanvas();
    ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("2D context unavailable");
    }

    bindWorldModeState(receipt);
    setupSystems();
    resize();
    bindInput();

    onResize = () => {
      resize();
    };

    onPageHide = () => {
      disposeRuntime();
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pagehide", onPageHide, { passive: true });

    receipt.page = "world";
    receipt.phase = "BOOT";
    receipt.mode = "active";
    receipt.verification.pass = false;

    lastNow = performance.now();
    emitRuntimeReceiptContinuous(receipt);
    rafId = window.requestAnimationFrame(frame);
  } catch (err) {
    setFailure("startup", err instanceof Error ? err.message : String(err));
    emitRuntimeReceiptContinuous(receipt);
    disposeRuntime();
  }
}

export default {
  startRuntime
};
