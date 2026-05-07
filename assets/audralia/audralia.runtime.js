// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_MOTION_ONLY_FULL_POTENTIAL_TNT_v10
// Full-file replacement.
// Purpose:
// - Runtime owns action, timing, orbital motion, phase motion, and motion receipts only.
// - Runtime does not own land/water, terrain, ice, ocean, color, blur, compositor, or visual truth.
// - Removes v9 organic land/water compositor authority from the controlling chain.
// - Preserves legacy API aliases without returning visual classification.
// - No GraphicBox. No image generation. No visual-pass claim.

const RECEIPT = "AUDRALIA_RUNTIME_MOTION_ONLY_FULL_POTENTIAL_TNT_v10";
const PREVIOUS_RECEIPT = "AUDRALIA_RUNTIME_ORGANIC_LAND_WATER_COMPOSITOR_TNT_v9";
const COMPATIBILITY_RECEIPT = "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8";
const CONTRACT = "AUDRALIA_RUNTIME_MOTION_ONLY_NO_VISUAL_SOVEREIGNTY_CONTRACT_v1";

let startedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
let running = true;

const STATUS = {
  ok: true,
  receipt: RECEIPT,
  previousReceipt: PREVIOUS_RECEIPT,
  compatibilityReceipt: COMPATIBILITY_RECEIPT,
  contract: CONTRACT,
  source: "audralia-runtime-motion-only",
  role: "motion-action-clock-authority",

  runtimeAuthority: true,
  motionAuthority: true,
  actionAuthority: true,
  timingAuthority: true,

  visualSovereignty: false,
  visualCompositorAuthority: false,
  paintAuthority: false,
  blurAuthority: false,
  surfaceTruthAuthority: false,
  landWaterAuthority: false,
  terrainAuthority: false,
  hydrationAuthority: false,
  oceanAuthority: false,
  iceAuthority: false,
  colorAuthority: false,

  runtimeOwnsFinalNormalization: false,
  runtimeOwnsSamplingNormalization: false,
  runtimeOrganicCompositorActive: false,
  runtimeFinalLandWaterNormalized: false,
  runtimeNormalizesSweptChain: false,

  landWaterRatiosRemoved: true,
  classificationRemoved: true,
  compositorReceiptsRetired: true,
  v9CompositorNonControlling: true,

  fallbackAllowed: false,
  fallbackSamples: 0,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,

  api: {
    start: true,
    stop: true,
    reset: true,
    sampleMotionState: true,
    sampleRuntimeMotion: true,
    sampleRuntimeState: true,
    sampleAudraliaRuntime: true,
    buildRuntimeField: true,
    createAudraliaRuntime: true,
    createAudraliaRuntimeAsync: true,
    getStatus: true,
    getSummary: true,
    getRuntimeStats: true,
    getFallbackReport: true
  },

  retiredReceipts: [
    "AUDRALIA_RUNTIME_ORGANIC_LAND_WATER_COMPOSITOR_TNT_v9",
    "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8",
    "AUDRALIA_RUNTIME_4K_DOWNSTREAM_SURFACE_CONNECTOR_TNT_v7",
    "AUDRALIA_RUNTIME_AWAITED_DOWNSTREAM_CHAIN_CONNECTOR_TNT_v6",
    "AUDRALIA_RUNTIME_PROOF_CHAIN_FALLBACK_ELIMINATION_BRIDGE_TNT_v15"
  ]
};

function nowMs(input) {
  if (typeof input === "number" && Number.isFinite(input)) return input;

  if (input && typeof input === "object") {
    const value = Number(input.time ?? input.now ?? input.t ?? input.ms);
    if (Number.isFinite(value)) return value;
  }

  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function cycleDegrees(ms, speed, offset = 0) {
  return ((ms * speed + offset) % 360 + 360) % 360;
}

function degToRad(deg) {
  return deg * Math.PI / 180;
}

export function sampleMotionState(input = null) {
  const ms = nowMs(input);
  const elapsed = Math.max(0, ms - startedAt);
  const seconds = elapsed / 1000;

  const rotationDeg = cycleDegrees(elapsed, 0.0048, 0);
  const cloudPhase = cycleDegrees(elapsed, 0.0062, 37);
  const oceanPhase = cycleDegrees(elapsed, 0.0026, 91);
  const lightPhase = cycleDegrees(elapsed, 0.00115, 12);
  const atmosphericPhase = cycleDegrees(elapsed, 0.0034, 144);
  const pulse = 0.5 + Math.sin(seconds * 0.9) * 0.5;

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    contract: CONTRACT,
    source: "audralia-runtime-motion-only",

    running,
    elapsedMs: elapsed,
    elapsedSeconds: seconds,

    rotationDeg,
    rotationRad: degToRad(rotationDeg),
    axialTiltDeg: -8.5,
    axialTiltRad: degToRad(-8.5),

    cloudPhase,
    cloudPhaseRad: degToRad(cloudPhase),
    oceanPhase,
    oceanPhaseRad: degToRad(oceanPhase),
    lightPhase,
    lightPhaseRad: degToRad(lightPhase),
    atmosphericPhase,
    atmosphericPhaseRad: degToRad(atmosphericPhase),

    pulse,
    motionIntensity: running ? 1 : 0,
    orbitalContinuity: true,
    frameMotion: true,

    visualSovereignty: false,
    visualCompositorAuthority: false,
    paintAuthority: false,
    blurAuthority: false,
    surfaceTruthAuthority: false,
    landWaterAuthority: false,
    terrainAuthority: false,
    hydrationAuthority: false,
    oceanAuthority: false,
    iceAuthority: false,
    colorAuthority: false,

    solidSurfaceLandRatio: null,
    liquidWaterRatio: null,
    exposedTerrainLandRatio: null,
    waterSamples: null,
    landSamples: null,
    topologyLandSamples: null,
    visualSurfaceClasses: [],
    classCounts: {},

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function sampleRuntimeMotion(input = null) {
  return sampleMotionState(input);
}

export function sampleRuntimeState(input = null) {
  return sampleMotionState(input);
}

export function sampleAudraliaRuntime(input = null) {
  return sampleMotionState(input);
}

export function sampleAudraliaPlanetState(input = null) {
  return sampleMotionState(input);
}

export function buildRuntimeField(input = null) {
  return sampleMotionState(input);
}

export function start() {
  running = true;
  exposeRuntimeStatus();
  return getStatus();
}

export function stop() {
  running = false;
  exposeRuntimeStatus();
  return getStatus();
}

export function reset() {
  startedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
  running = true;
  exposeRuntimeStatus();
  return getStatus();
}

export function getSummary() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    compatibilityReceipt: COMPATIBILITY_RECEIPT,
    contract: CONTRACT,
    source: "audralia-runtime-motion-only-summary",

    summaryType: "motion-only",
    visualSummaryRemoved: true,
    landWaterSummaryRemoved: true,
    compositorSummaryRemoved: true,

    runtimeAuthority: true,
    motionAuthority: true,
    actionAuthority: true,
    timingAuthority: true,

    visualSovereignty: false,
    visualCompositorAuthority: false,
    paintAuthority: false,
    blurAuthority: false,
    surfaceTruthAuthority: false,
    landWaterAuthority: false,
    terrainAuthority: false,
    hydrationAuthority: false,
    oceanAuthority: false,
    iceAuthority: false,
    colorAuthority: false,

    solidSurfaceLandRatio: null,
    liquidWaterRatio: null,
    exposedTerrainLandRatio: null,
    waterSamples: null,
    landSamples: null,
    topologyLandSamples: null,
    visibleLandSamples: null,
    visualSurfaceClasses: [],
    classCounts: {},

    targetLandRatio: null,
    targetLiquidWaterRatio: null,
    solidSurfaceLandRatioTargetMet: null,
    liquidWaterRatioTargetMet: null,
    earthEquivalentLandRatioAligned: null,
    rowBandingSuppressed: null,
    bullseyeCollapseSuppressed: null,

    controllingSurfaceTruth: "AUDRALIA_SURFACE_PARENT_STANDARD_NONBLOCKING_BOOT_TNT_v3_or_later",
    controllingCanvas: "AUDRALIA_CANVAS_SURFACE_TRUTH_DECOUPLED_ORTHOGRAPHIC_TNT_v12_or_later",

    fallbackAllowed: false,
    fallbackSamples: 0,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function getRuntimeStats() {
  return getSummary();
}

export function getStats() {
  return getSummary();
}

export function getFallbackReport() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    fallbackAllowed: false,
    fallbackSamples: 0,
    fallbackRatio: 0,
    reason: "runtime-motion-only-does-not-sample-surface"
  });
}

export function getStatus() {
  return Object.freeze({
    ...STATUS,
    running,
    startedAt,
    motion: sampleMotionState()
  });
}

export function createAudraliaRuntime() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    status: getStatus(),
    sampleMotionState,
    sampleRuntimeMotion,
    sampleRuntimeState,
    sampleAudraliaRuntime,
    sampleAudraliaPlanetState,
    buildRuntimeField,
    getStatus,
    getSummary,
    getStats,
    getRuntimeStats,
    getFallbackReport,
    start,
    stop,
    reset
  });
}

export async function createAudraliaRuntimeAsync() {
  return createAudraliaRuntime();
}

function exposeRuntimeStatus() {
  if (typeof window !== "undefined") {
    window.AUDRALIA_RUNTIME_STATUS = STATUS;
    window.AUDRALIA_RUNTIME_RECEIPT = RECEIPT;
    window.__AUDRALIA_RUNTIME_STATUS__ = STATUS;
    window.__AUDRALIA_RUNTIME_RECEIPT__ = RECEIPT;
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaRuntimeReceipt = RECEIPT;
    document.documentElement.dataset.audraliaRuntimePreviousReceipt = PREVIOUS_RECEIPT;
    document.documentElement.dataset.audraliaRuntimeContract = CONTRACT;
    document.documentElement.dataset.audraliaRuntimeMotionOnly = "true";
    document.documentElement.dataset.audraliaRuntimeVisualSovereignty = "false";
    document.documentElement.dataset.audraliaRuntimeLandWaterAuthority = "false";
    document.documentElement.dataset.audraliaRuntimeCompositorAuthority = "false";
    document.documentElement.dataset.audraliaRuntimeBlurAuthority = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("audralia:runtime-status", { detail: STATUS }));
    }
  } catch (_) {}

  return STATUS;
}

export const AUDRALIA_RUNTIME_STATUS = STATUS;
export const AUDRALIA_RUNTIME_RECEIPT_VALUE = RECEIPT;
export const AUDRALIA_RUNTIME_PREVIOUS_RECEIPT_VALUE = PREVIOUS_RECEIPT;
export const AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT_VALUE = COMPATIBILITY_RECEIPT;
export const AUDRALIA_RUNTIME_CONTRACT_VALUE = CONTRACT;
export const AUDRALIA_RUNTIME_MOTION_ONLY = true;
export const AUDRALIA_RUNTIME_VISUAL_SOVEREIGNTY = false;

exposeRuntimeStatus();

export default createAudraliaRuntime;
