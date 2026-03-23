// /world/runtime/world_runtime.js
// MODE: RUNTIME CONTRACT RENEWAL v3
// STATUS: TNT — THIN CONDUCTOR
// PURPOSE:
// 1) boot one runtime only
// 2) maintain control -> render continuity
// 3) emit authority receipt continuously
// 4) emit live gauges receipt continuously
// 5) commit RUNNING only after first successful verified frame
// 6) honor the live createInstruments() contract
// 7) preserve legacy runtime lifecycle behavior
// 8) bind worldVariantState
// 9) bind traversalState
// 10) bind coherenceBindingState
// 11) bind perceptionModifiersState
// 12) bind subsurfaceActivationState
// 13) bind unified worldModeState
// 14) bind planet_engine to runtime state
// 15) rebuild planetField only when variant changes
// 16) stay finite, deterministic, and non-drifting
// 17) strip interpretation and preserve orchestration

import { WORLD_KERNEL as worldKernel } from "/world/world_kernel.js";
import { createPlanetEngine } from "/world/planet_engine.js";
import { createRenderer } from "/world/render/index.js";
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
  return clamp(value, 1, 9);
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

function getTraversalWeights(mode) {
  const activeMode = normalizeTraversalMode(mode);

  if (activeMode === "SOUTH") {
    return Object.freeze({
      axis: "S",
      northWeight: 0.7,
      southWeight: 1,
      eastWeight: 0.75,
      westWeight: 0.75,
      preferredDirection: "S"
    });
  }

  if (activeMode === "EAST") {
    return Object.freeze({
      axis: "E",
      northWeight: 0.8,
      southWeight: 0.8,
      eastWeight: 1,
      westWeight: 0.7,
      preferredDirection: "E"
    });
  }

  if (activeMode === "WEST") {
    return Object.freeze({
      axis: "W",
      northWeight: 0.8,
      southWeight: 0.8,
      eastWeight: 0.7,
      westWeight: 1,
      preferredDirection: "W"
    });
  }

  return Object.freeze({
    axis: "N",
    northWeight: 1,
    southWeight: 0.85,
    eastWeight: 0.9,
    westWeight: 0.9,
    preferredDirection: "N"
  });
}

function createWorldVariantState(activeVariant = DEFAULT_WORLD_VARIANT) {
  const variant = normalizeWorldVariant(activeVariant);
  const compositionScale = round3(variant / 9);
  const baseScale = round3(1 - compositionScale);
  const ratioRight = Math.max(1, 10 - variant);
  const nodeIndex = clamp(variant - 1, 0, 15);

  return Object.freeze({
    activeVariant: variant,
    ratio: `${variant}:${ratioRight}`,
    compositionScale,
    baseScale,

    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      variantLatticeIndex: (variant - 1) * 32,
      variantBand: `VARIANT_${variant}`,
      variantEnvelope: compositionScale
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
      activeNodeIndex: nodeIndex,
      nodeClass: "SUBSTANCE_ROUTE",
      nodeRoute: `VARIANT_NODE_${nodeIndex}`,
      nodeModifiers: Object.freeze({
        compositionWeight: compositionScale,
        baseWeight: round3(Math.max(baseScale, 0.111))
      })
    }),

    diagnostics: Object.freeze({
      activeVariant: variant,
      ratioLabel: `${variant}:${ratioRight}`,
      compositionScale,
      baseScale,
      variantLatticeIndex: (variant - 1) * 32,
      activeNodeIndex: nodeIndex
    })
  });
}

function createTraversalState(mode = DEFAULT_TRAVERSAL_MODE) {
  const activeMode = normalizeTraversalMode(mode);
  const weights = getTraversalWeights(activeMode);
  const nodeIndex =
    activeMode === "NORTH" ? 0 :
    activeMode === "SOUTH" ? 4 :
    activeMode === "EAST" ? 8 :
    12;

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

    cardinalBinding: Object.freeze({
      axis: weights.axis,
      northWeight: weights.northWeight,
      southWeight: weights.southWeight,
      eastWeight: weights.eastWeight,
      westWeight: weights.westWeight
    }),

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: nodeIndex,
      nodeClass: "TRAVERSAL_ROUTE",
      nodeRoute: `${activeMode}_TRAVERSAL_ROUTE`,
      nodeModifiers: Object.freeze({
        convergenceBias:
          activeMode === "NORTH" ? 0.7 :
          activeMode === "SOUTH" ? 1 :
          activeMode === "EAST" ? 0.7 : 0.9,
        expansionBias:
          activeMode === "NORTH" ? 0.8 :
          activeMode === "SOUTH" ? 0.7 :
          activeMode === "EAST" ? 1 : 0.7
      })
    }),

    navigationBias: Object.freeze({
      preferredDirection: weights.preferredDirection,
      stabilityWeight:
        activeMode === "EAST" ? 0.9 :
        activeMode === "NORTH" ? 1 : 0.95,
      deviationPenalty:
        activeMode === "EAST" ? 0.8 :
        activeMode === "NORTH" ? 0.9 : 0.85
    }),

    diagnostics: Object.freeze({
      activeMode,
      traversalLatticeIndex:
        activeMode === "NORTH" ? 32 :
        activeMode === "SOUTH" ? 96 :
        activeMode === "EAST" ? 160 :
        224,
      activeNodeIndex: nodeIndex
    })
  });
}

function createBaseCoherenceState() {
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
      hotspotRegions: Object.freeze([]),
      noiseSpikes: Object.freeze([]),
      authorityMismatchCount: 0,
      groupFragmentationCount: 0
    })
  });
}

function createBasePerceptionState() {
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
      traversalEffect: "NORTH",
      flowDivergence: 0
    })
  });
}

function createBaseSubsurfaceState() {
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
      failedConditions: Object.freeze(["bootstrap"]),
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
      requiredWaterEquipment: 1,
      requiredWaterCoordination: 0.25,
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
      failedConditions: Object.freeze(["bootstrap"]),
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
  const coherenceBindingState = createBaseCoherenceState();
  const perceptionModifiersState = createBasePerceptionState();
  const subsurfaceActivationState = createBaseSubsurfaceState();

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
      activeNodeIndex: traversalState.nodeBinding.activeNodeIndex,
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

function validateRuntimeStateCompleteness() {
  ensureRuntimeState();
  if (!runtimeState.worldVariantState) throw new Error("runtime missing worldVariantState");
  if (!runtimeState.traversalState) throw new Error("runtime missing traversalState");
  if (!runtimeState.coherenceBindingState) throw new Error("runtime missing coherenceBindingState");
  if (!runtimeState.perceptionModifiersState) throw new Error("runtime missing perceptionModifiersState");
  if (!runtimeState.subsurfaceActivationState) throw new Error("runtime missing subsurfaceActivationState");
  if (!runtimeState.worldModeState) throw new Error("runtime missing worldModeState");
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
  if (!force && planetField && lastBuiltVariant === activeVariant) return;

  planetField = planetEngine.buildPlanetField(buildPlanetFieldInput());
  if (!planetField) {
    throw new Error("planet_engine returned empty field");
  }

  lastBuiltVariant = activeVariant;
}

function ensureReceipt() {
  ensureRuntimeState();

  if (!window[RECEIPT_KEY]) {
    window[RECEIPT_KEY] = {
      bootSource: "/index.html",
      runtimeSource: "/world/runtime/world_runtime.js",
      inputOwner: "/world/control.js",
      orbitOwner: "/world/control.js",
      renderSource: "/world/render/index.js",
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
        renderReadsWorldMode: false,
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
  const renderResult = renderer.renderPlanet(buildRenderOptions(receipt)) || {};

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
  receipt.renderAuthority.renderReadsWorldMode = renderAuthority.renderReadsWorldMode === true;
  receipt.renderAuthority.fallbackMode = renderAuthority.fallbackMode === true;
  receipt.renderAuthority.liveRenderPath =
    pickString(renderAuthority.liveRenderPath, receipt.renderAuthority.liveRenderPath, "UNKNOWN") || "UNKNOWN";

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

function deriveWorldVariantState(receipt) {
  const current = runtimeState.worldVariantState;
  const nextVariant = normalizeWorldVariant(current?.activeVariant ?? DEFAULT_WORLD_VARIANT);
  runtimeState.worldVariantState = createWorldVariantState(nextVariant);
  receipt.worldVariantState = runtimeState.worldVariantState;
}

function deriveTraversalState(receipt) {
  const current = runtimeState.traversalState;
  const nextMode = normalizeTraversalMode(current?.activeMode ?? DEFAULT_TRAVERSAL_MODE);
  runtimeState.traversalState = createTraversalState(nextMode);
  receipt.traversalState = runtimeState.traversalState;
}

function deriveLightweightStates(receipt) {
  const sample = resolveCurrentSample(receipt.control.projectionSummary);
  const renderAudit = normalizeObject(receipt.renderAudit);
  const motion = normalizeObject(receipt.control.motionState);

  const sampleCount = Math.max(1, renderAudit.sampleCount || 1);
  const visibleCount = Math.max(1, receipt.topology.visibleCellCount || 1);
  const emittedCount = Math.max(1, receipt.topology.emittedCellCount || 1);
  const visibilityRatio = clamp(emittedCount / visibleCount, 0, 1);

  const slope = clamp(sample?.slope ?? 0, 0, 1);
  const canyon = clamp(sample?.canyonStrength ?? 0, 0, 1);
  const rainfall = clamp(sample?.rainfall ?? 0, 0, 1);
  const runoff = clamp(sample?.runoff ?? 0, 0, 1);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const shorelineSignal = clamp((renderAudit.shorelineCount / sampleCount) * 24, 0, 1);
  const cryosphereSignal = clamp((renderAudit.cryosphereCount / sampleCount) * 32, 0, 1);
  const zoomCurrent = clamp(pickNumber(motion.zoomCurrent, receipt.lens.zoomCurrent, 0) ?? 0, 0, 1);
  const authoritySignal = round3(clamp(0.55 + zoomCurrent * 0.45, 0, 1));

  const coherence = round3(
    clamp(
      visibilityRatio * 0.34 +
      (1 - slope) * 0.18 +
      (1 - canyon) * 0.14 +
      rainfall * 0.12 +
      runoff * 0.08 +
      shorelineSignal * 0.08 +
      (1 - cryosphereSignal) * 0.06,
      0,
      1
    )
  );

  const noise = round3(clamp(1 - coherence, 0, 1));
  const stability = round3(clamp(coherence * (1 - noise * 0.45), 0, 1));
  const coordination =
    runtimeState.traversalState.activeMode === "SOUTH" ? 0.94 :
    runtimeState.traversalState.activeMode === "NORTH" ? 0.9 :
    0.9;

  const clarity = coherence;
  const accessAllowed = coherence >= 0.2 && authoritySignal >= 0 && coordination >= 0.1;
  const zoneStability = round3(clamp(coherence * stability * coordination, 0, 1));
  const preferredEntryAxis = runtimeState.traversalState.navigationBias.preferredDirection;
  const coherenceIndex = clamp(Math.round(coherence * 255), 0, 255);
  const localCellId = (() => {
    const projectionSummary = normalizeObject(receipt.control.projectionSummary);
    const sampleX = Number.isInteger(projectionSummary.sampleX) ? projectionSummary.sampleX : null;
    const sampleY = Number.isInteger(projectionSummary.sampleY) ? projectionSummary.sampleY : null;
    return sampleX === null || sampleY === null ? "UNKNOWN" : `${sampleX}:${sampleY}`;
  })();
  const regionalZoneId =
    sample?.regionId ||
    sample?.continentMass ||
    sample?.continentId ||
    sample?.continentClass ||
    sample?.macroRegion ||
    "UNKNOWN";

  runtimeState.coherenceBindingState = Object.freeze({
    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      coherenceLatticeIndex: coherenceIndex,
      latticeSpread: 1,
      latticeDecay: noise
    }),

    cardinalBinding: Object.freeze({
      northWeight: runtimeState.traversalState.cardinalBinding.northWeight,
      southWeight: runtimeState.traversalState.cardinalBinding.southWeight,
      eastWeight: runtimeState.traversalState.cardinalBinding.eastWeight,
      westWeight: runtimeState.traversalState.cardinalBinding.westWeight
    }),

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: runtimeState.traversalState.nodeBinding.activeNodeIndex,
      nodeAggregationFactor: 1,
      nodeVariancePenalty: noise,
      nodeStabilityBoost: stability
    }),

    entityContributions: Object.freeze({
      PLAYER_0: Object.freeze({
        internalCoherence: coherence,
        authoritySignal,
        coordinationFactor: coordination,
        contribution: round3(Math.min(coherence * authoritySignal * coordination, coherence)),
        noiseInjection: noise,
        localCellId
      })
    }),

    groupContributions: Object.freeze({
      SOLO_RUNTIME: Object.freeze({
        memberIds: Object.freeze(["PLAYER_0"]),
        memberCount: 1,
        groupCoherence: coherence,
        coherenceVariance: 0,
        coordinationFactor: coordination,
        effectiveForce: round3(coherence * coordination)
      })
    }),

    localField: Object.freeze({
      [localCellId]: Object.freeze({
        coherence,
        noise,
        stability,
        contributingEntities: Object.freeze(["PLAYER_0"]),
        contributingGroups: Object.freeze(["SOLO_RUNTIME"])
      })
    }),

    regionalField: Object.freeze({
      [regionalZoneId]: Object.freeze({
        coherence,
        stability,
        contributorCount: 1
      })
    }),

    globalField: Object.freeze({
      coherence,
      noise,
      stability
    }),

    coherenceEnvelope: Object.freeze({
      min: coherence,
      max: coherence,
      average: coherence,
      variance: noise
    }),

    stabilityEnvelope: Object.freeze({
      min: stability,
      max: stability,
      average: stability,
      variance: noise
    }),

    diagnostics: Object.freeze({
      globalCoherence: coherence,
      globalStability: stability,
      variance: noise,
      hotspotRegions: coherence < 0.5 ? Object.freeze([regionalZoneId]) : Object.freeze([]),
      noiseSpikes: noise > 0.5 ? Object.freeze([localCellId]) : Object.freeze([]),
      authorityMismatchCount: 0,
      groupFragmentationCount: 0
    })
  });

  runtimeState.perceptionModifiersState = Object.freeze({
    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      perceptionLatticeIndex: coherenceIndex,
      perceptionSpread: 1,
      perceptionDecay: noise
    }),

    cardinalBinding: runtimeState.traversalState.cardinalBinding,

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: runtimeState.traversalState.nodeBinding.activeNodeIndex,
      nodeClarityBoost: clarity,
      nodeNoisePenalty: noise,
      nodeStabilityWeight: stability
    }),

    terrain: Object.freeze({
      contrast: clarity,
      edgeClarity: clarity,
      elevationFidelity: round3(clamp(clarity * stability, 0, 1)),
      cutDetectability: round3(clamp(clarity * (1 - noise), 0, 1)),
      discontinuityVisibility: round3(clamp(clarity * stability, 0, 1))
    }),

    hydration: Object.freeze({
      flowContinuity: round3(clamp(clarity * stability, 0, 1)),
      boundaryClarity: clarity,
      hierarchyVisibility: round3(clamp(clarity * authoritySignal, 0, 1)),
      reservoirReadability: round3(clamp(clarity * stability, 0, 1)),
      flowDirectionLegibility: round3(clamp(clarity * (1 - noise), 0, 1))
    }),

    subsurface: Object.freeze({
      detectability: round3(clamp(clarity * authoritySignal, 0, 1)),
      pathContinuity: round3(clamp(clarity * stability, 0, 1)),
      entryInference: round3(clamp(clarity * authoritySignal * stability, 0, 1)),
      hiddenPassageLegibility: round3(clamp(clarity * coordination, 0, 1)),
      signalIntegrity: round3(clamp(clarity * (1 - noise), 0, 1))
    }),

    lighting: Object.freeze({
      intensity: round3(clamp(authoritySignal * clarity, 0, 1)),
      stability: round3(clamp(clarity * stability, 0, 1)),
      radius: round3(clamp(authoritySignal * clarity * stability, 0, 1)),
      activationReadiness: round3(clamp(clarity * authoritySignal * coordination, 0, 1))
    }),

    globalEnvelope: Object.freeze({
      clarityLevel: clarity,
      noiseLevel: noise,
      stabilityLevel: stability,
      coherenceAverage: coherence,
      variance: noise
    }),

    diagnostics: Object.freeze({
      clarityLevel: clarity,
      noiseLevel: noise,
      stabilityLevel: stability,
      authorityEffect: authoritySignal,
      coordinationEffect: coordination,
      traversalEffect: runtimeState.traversalState.activeMode,
      flowDivergence: noise
    })
  });

  runtimeState.subsurfaceActivationState = Object.freeze({
    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      subsurfaceLatticeIndex: coherenceIndex,
      accessSpread: 1,
      accessDecay: round3(1 - zoneStability)
    }),

    cardinalBinding: Object.freeze({
      ...runtimeState.traversalState.cardinalBinding,
      preferredEntryAxis
    }),

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: runtimeState.traversalState.nodeBinding.activeNodeIndex,
      nodeWakeFactor: authoritySignal,
      nodeStabilityFactor: stability,
      nodeAccessPenalty: round3(1 - coherence)
    }),

    activeDepthTier: 0,
    zoneState: accessAllowed ? "ACTIVE" : "PARTIAL_ACTIVE",

    accessState: Object.freeze({
      accessAllowed,
      failedConditions: Object.freeze(accessAllowed ? [] : ["coherence"]),
      requiredAuthority: 0,
      requiredCoherence: 0.2,
      requiredEquipment: 0,
      requiredCoordination: 0.1,
      requiredParticipants: 1,
      actualAuthority: authoritySignal,
      actualCoherence: coherence,
      actualEquipment: runtimeState.worldVariantState.activeVariant,
      actualCoordination: coordination,
      actualParticipants: 1
    }),

    lightingState: Object.freeze({
      intensity: runtimeState.perceptionModifiersState.lighting.intensity,
      stability: runtimeState.perceptionModifiersState.lighting.stability,
      radius: runtimeState.perceptionModifiersState.lighting.radius,
      activationReadiness: runtimeState.perceptionModifiersState.lighting.activationReadiness,
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
      participantCount: 1,
      requiredParticipants: 1,
      coordinationFactor: coordination,
      crossGroupCoherence: coherence,
      multiTeamRequired: false,
      teamPass: coordination >= 0.1
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
      zoneState: accessAllowed ? "ACTIVE" : "PARTIAL_ACTIVE",
      activeDepthTier: 0,
      failedConditions: Object.freeze(accessAllowed ? [] : ["coherence"]),
      requiredVsActual: Object.freeze({
        authority: `0 / ${authoritySignal}`,
        coherence: `0.2 / ${coherence}`,
        equipment: `0 / ${runtimeState.worldVariantState.activeVariant}`,
        coordination: `0.1 / ${coordination}`,
        participants: `1 / 1`
      }),
      crossGroupCoherence: coherence,
      wakeAllowed: accessAllowed,
      lightingReadiness: runtimeState.perceptionModifiersState.lighting.activationReadiness,
      zoneStability
    })
  });

  runtimeState.worldModeState = Object.freeze({
    latticeBinding: Object.freeze({
      latticeEnabled: true,
      latticeResolution: 256,
      unifiedLatticeIndex: coherenceIndex,
      latticeContinuity: stability
    }),

    cardinalBinding: runtimeState.traversalState.cardinalBinding,

    nodeBinding: Object.freeze({
      nodeEnabled: true,
      activeNodeIndex: runtimeState.traversalState.nodeBinding.activeNodeIndex,
      nodeAggregationFactor: 1,
      nodeStabilityFactor: stability,
      nodeContinuity: stability
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
      coherenceLevel: coherence,
      stabilityLevel: stability,
      perceptionSummary: runtimeState.perceptionModifiersState.globalEnvelope,
      accessSummary: runtimeState.subsurfaceActivationState.diagnostics,
      bindingIntegrity: true
    })
  });

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
    if (!instrumentApi || typeof instrumentApi.buildInstrumentReceipt !== "function") return;

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
    deriveLightweightStates(receipt);
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
    validateRuntimeStateCompleteness();

    canvas = getCanvas();
    ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("2D context unavailable");
    }

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
