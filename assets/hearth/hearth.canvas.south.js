// /assets/hearth/hearth.canvas.south.js
// HEARTH_CANVAS_SOUTH_PARENT_ACCLIMATED_F13S_VISIBLE_PROOF_CHILD_TNT_v4
// Full-file replacement.
// Canvas South / parent-acclimated F13S texture composition, sphere rendering, visible proof, and output proof child only.
// Purpose:
// - Preserve the Canvas North parent API required by /assets/hearth/hearth.canvas.js.
// - Treat already-doable upstream parent files as authority.
// - Accustom South to the current parent handoff surfaces instead of requiring parent mutation.
// - Preserve South texture composition from East atlas output.
// - Accept direct and nested atlas packets from parent, East, release packets, source packets, and cached texture only when explicitly allowed.
// - Preserve South cached-texture sphere rendering.
// - Renew visible-content proof so strict F13 evidence can be earned downstream when the rendered sphere is materially visible.
// - Split API readiness from texture/render/visible-proof readiness.
// - Initialize NEWS conservatively; degraded NEWS is earned only by current soft proof.
// - Preserve stale-proof suppression after invalidation.
// - Preserve ordered proof bins: STRICT supersedes SOFT_GAP; SOFT_GAP supersedes HARD_FAIL; STALE suppresses current proof.
// - Preserve fatal compose/render failure behavior after receipt state is updated.
// - Preserve current proof vs historical proof separation.
// - Preserve NEWS / Fibonacci / Runtime Table / Canvas F13 boundaries.
// Does not own:
// - planet truth
// - material truth
// - hydrology truth
// - elevation truth
// - atlas source formation
// - source intake authority
// - drag / zoom / inspection control
// - Canvas parent boot
// - Macro West admissibility
// - Runtime Table governance
// - route readiness
// - F21 latch
// - ready text
// - final visual pass claim
// - generated image
// - GraphicBox
// - WebGL

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_SOUTH_PARENT_ACCLIMATED_F13S_VISIBLE_PROOF_CHILD_TNT_v4";
  const RECEIPT = "HEARTH_CANVAS_SOUTH_PARENT_ACCLIMATED_F13S_VISIBLE_PROOF_CHILD_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_SOUTH_F13S_STRICT_VISIBLE_PROOF_CLASSIFIER_CHILD_TNT_v3";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_SOUTH_F13S_STRICT_VISIBLE_PROOF_CLASSIFIER_CHILD_TNT_v3";

  const VERSION = "2026-06-01.hearth-canvas-south-parent-acclimated-f13s-visible-proof-child-v4";
  const FILE = "/assets/hearth/hearth.canvas.south.js";

  const PARENT_FILE = "/assets/hearth/hearth.canvas.js";
  const EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const WEST_FILE = "/assets/hearth/hearth.canvas.west.js";

  const ACTIVE_PARENT_CONTEXT_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION_TNT_v6",
    "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_TNT_v5",
    "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST_TNT_v4",
    "HEARTH_CANVAS_PARENT_RELEASE_PACKET_TO_EAST_STALE_CLEARANCE_TNT_v3",
    "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_TNT_v2",
    "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_TNT_v1",
    "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_TNT_v1"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DEFAULT_TEXTURE_WIDTH = 768;
  const DEFAULT_TEXTURE_HEIGHT = 384;
  const COMPOSE_ROWS_PER_CHUNK = 12;
  const RENDER_ROWS_PER_CHUNK = 18;
  const MAX_EVENT_LOG = 180;
  const MAX_ERROR_LOG = 140;

  const MACRO_CYCLE_1 = "NORTH_EAST_WEST_SOUTH_NORTH";
  const MACRO_CYCLE_2 = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const CANVAS_CHILD_SEQUENCE = "CANVAS_EAST_ATLAS_SOURCE__CANVAS_WEST_INSPECTION_VIEW__CANVAS_SOUTH_TEXTURE_RENDER__CANVAS_PARENT_F13_EVIDENCE";

  const PROOF_BIN = Object.freeze({
    NONE: "NONE",
    STRICT: "STRICT",
    SOFT_GAP: "SOFT_GAP",
    HARD_FAIL: "HARD_FAIL",
    STALE: "STALE"
  });

  const SOURCE_CANDIDATE_PATHS = Object.freeze([
    "atlasCanvas",
    "sourceCanvas",
    "textureSource",
    "canvas",

    "eastAtlasPacket.atlasCanvas",
    "eastAtlasPacket.canvas",
    "atlasPacket.atlasCanvas",
    "atlasPacket.canvas",
    "canvasEastPacket.atlasCanvas",
    "canvasEastPacket.canvas",

    "parentPacket.eastAtlasPacket.atlasCanvas",
    "parentPacket.eastAtlasPacket.canvas",
    "parentPacket.atlasPacket.atlasCanvas",
    "parentPacket.atlasPacket.canvas",
    "parentPacket.canvasEastPacket.atlasCanvas",
    "parentPacket.canvasEastPacket.canvas",
    "parentPacket.sourcePacket.atlasCanvas",
    "parentPacket.sourcePacket.canvas",

    "releasePacket.eastAtlasPacket.atlasCanvas",
    "releasePacket.eastAtlasPacket.canvas",
    "releasePacket.atlasPacket.atlasCanvas",
    "releasePacket.atlasPacket.canvas",
    "releasePacket.canvasEastPacket.atlasCanvas",
    "releasePacket.canvasEastPacket.canvas",
    "releasePacket.sourcePacket.atlasCanvas",
    "releasePacket.sourcePacket.canvas",

    "sourcePacket.atlasCanvas",
    "sourcePacket.canvas",
    "sourcePacket.sourceCanvas",
    "sourcePacket.textureSource",

    "packet.atlasCanvas",
    "packet.canvas",
    "payload.atlasCanvas",
    "payload.canvas",
    "detail.atlasCanvas",
    "detail.canvas"
  ]);

  class SouthHoldError extends Error {
    constructor(message, code) {
      super(message);
      this.name = "SouthHoldError";
      this.code = code || "SOUTH_HELD";
      this.isSouthHold = true;
    }
  }

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,
    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    role: "canvas-south-parent-acclimated-f13s-visible-proof-child",

    parentAuthorityRule: "UPSTREAM_PARENT_ALREADY_DOABLE_IS_AUTHORITY",
    downstreamAcclimationRule: "SOUTH_ACCLIMATES_TO_PARENT_HANDOFF",
    parentMutationRecommendedBySouth: false,
    parentContractInformationalOnly: true,
    parentStructuralCarrierTruthOwnedByParent: true,
    currentParentContextAccepted: true,
    activeParentContextContracts: ACTIVE_PARENT_CONTEXT_CONTRACTS.slice(),

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,

    macroCycle1: MACRO_CYCLE_1,
    macroCycle2: MACRO_CYCLE_2,
    canvasChildSequence: CANVAS_CHILD_SEQUENCE,
    canvasSouthMacroSouth: false,
    canvasSouthChildSouth: true,
    canvasSouthDoesNotAuthorizeCanvasRelease: true,
    canvasSouthDoesNotLatchF21: true,

    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    canvasGateReady: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: false,

    activeFibonacci: 13,
    activeFibonacciRank: "F13S",
    activeFibonacciGate: "F13S",
    parentFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    activeStageId: "canvas-south-parent-acclimated-texture-render-visible-proof",
    activeGearId: "hearth-canvas-south-parent-acclimated-f13s",
    oneActiveGearAtATime: true,

    f8SelfDutySatisfied: false,
    f13ProofBodyAvailable: false,
    f13VisibleEvidenceAvailable: false,
    f13VisibleEvidenceStrict: false,
    f13VisibleEvidenceDegraded: false,
    f13InspectEvidenceAvailable: false,
    f13sVisibleProofReady: false,
    f13VisibleEvidenceComplete: false,
    f13HardFail: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21LatchMode: "north-only",

    canvasSouthLoaded: true,
    canvasSouthActive: true,
    canvasSouthApiReady: false,
    canvasSouthEvidenceReady: false,
    canvasSouthReady: false,
    textureReady: false,
    renderReady: false,
    visibleProofReady: false,

    splitAdapterRole: "SOUTH",
    splitAdapterTransistorMode: true,
    transistorAdapterActive: true,
    transistorRole: "drain",
    transistorDrainRole: "south-texture-render-visible-proof-drain",
    transistorSourcePeer: "east-material-atlas-source",
    transistorControlPeer: "west-motion-invalidation-control",
    transistorGateParent: "north-parent-gate",
    transistorCurrentFlow: "EAST_SOURCE_TO_SOUTH_DRAIN_THROUGH_PARENT_GATE_WITH_WEST_CONTROL",
    splitAdapterParentAligned: true,
    fatalErrorBoundaryActive: true,

    sourceResolutionActive: true,
    sourceCandidatePaths: SOURCE_CANDIDATE_PATHS.slice(),
    sourceCanvasResolved: false,
    sourceCanvasResolutionPath: "",
    sourceCanvasResolutionReason: "WAITING_EAST_ATLAS_CANVAS_OR_PARENT_ATLAS_PACKET",
    sourcePacketAccepted: false,
    parentPacketAccepted: false,
    releasePacketAccepted: false,
    eastAtlasPacketAccepted: false,
    cachedTextureAccepted: false,

    textureCanvas: null,
    textureContext: null,
    textureWidth: 0,
    textureHeight: 0,
    textureSourceContract: "",
    textureSourceReceipt: "",
    textureSourceWidth: 0,
    textureSourceHeight: 0,
    textureSourcePath: "",

    textureComposeStarted: false,
    textureComposeProgress: 0,
    textureComposeComplete: false,
    textureProofComplete: false,
    textureHardFail: false,
    textureComposeStartedAt: "",
    textureComposeCompletedAt: "",
    textureComposeElapsedMs: 0,
    textureComposeYieldCount: 0,
    textureComposeError: "",

    textureInvalidated: false,
    textureInvalidationReason: "",
    textureInvalidationCount: 0,
    textureRebuildRequested: false,
    textureRebuildComplete: false,
    textureRebuildError: "",

    firstFrameRequested: false,
    firstFrameDetected: false,
    imageRendered: false,
    imageRenderedMeansFrameDrawnOnly: true,
    imageRenderedDoesNotMeanVisualPass: true,
    imageRenderedDoesNotMeanF21: true,
    renderedAfterTexture: false,
    renderedFromCachedTexture: false,
    planetFramePainted: false,
    nonblankPlanetVisible: false,
    planetNotObstructed: false,

    renderStarted: false,
    renderProgress: 0,
    renderFrameCount: 0,
    renderStartedAt: "",
    renderCompletedAt: "",
    renderElapsedMs: 0,
    renderYieldCount: 0,
    renderError: "",
    renderHardFail: false,
    renderFrameStale: false,
    sphereProjectionComplete: false,
    currentSphereProofAt: "",

    canvasWidth: 0,
    canvasHeight: 0,
    renderRadius: 0,
    renderCenterX: 0,
    renderCenterY: 0,
    lastYaw: 0,
    lastPitch: 0,
    lastZoom: 1,

    visibleContentProofStarted: false,
    visibleContentProof: false,
    visibleContentStrictProof: false,
    visibleContentSoftGap: false,
    visibleContentHardFail: false,
    visibleForwardProgress: false,
    visibleContentAdmissible: false,
    visiblePlanetAvailable: false,
    visibleContentProofMethod: "",
    visibleContentProofError: "",
    visibleContentSampleCount: 0,
    visibleContentVarianceScore: 0,
    visibleContentClassCount: 0,
    visibleContentClasses: [],
    visibleContentColorBucketCount: 0,
    visibleContentColorBuckets: [],
    visibleContentLandSampleCount: 0,
    visibleContentWaterSampleCount: 0,
    visibleContentReliefSampleCount: 0,
    visibleContentOtherSampleCount: 0,
    visibleContentCarrierSampleCount: 0,
    visibleContentTransparentSampleCount: 0,
    visibleContentPlanetPixelCount: 0,
    visibleContentNonCarrierRatio: 0,
    visibleContentNonTransparentRatio: 0,
    carrierOnlyDetected: false,

    visibleContentProofDoesNotMeanFinalVisualPass: true,
    f13VisibleEvidenceDoesNotMeanF21: true,

    proofBin: PROOF_BIN.NONE,
    currentVisibleProofValid: false,
    currentVisibleProofAt: "",
    lastValidVisibleProofAt: "",
    visibleProofStale: false,
    staleProofSuppressed: false,
    currentTextureProofAt: "",

    clarityRenewalActive: true,
    hazeReduced: true,
    highDpiCanvasActive: true,
    sourceColorDemotedToPaletteInfluence: true,
    elevationControlsLandShape: true,
    hydrologyControlsWaterShape: true,
    coastlineContrastActive: true,
    centerDarknessReduced: true,
    lightingPreservesSurfaceReadability: true,
    staleSourceMaskProtectionActive: true,
    strictVisibleProofClassifierActive: true,
    strictProofDoesNotRequireNamedLandWaterBalance: true,
    strictProofRequiresRenderedSphereSurfaceSignal: true,
    degradedProofRemainsAvailableForForwardProgress: true,

    ownsTextureComposition: true,
    ownsSphereRendering: true,
    ownsVisibleProof: true,
    ownsCanvasSouthOutput: true,
    ownsAtlasSource: false,
    ownsAtlasFormation: false,
    ownsSourceIntake: false,
    ownsDragInspection: false,
    ownsZoomInspection: false,
    ownsInspectionControl: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsRuntimeTableGovernance: false,
    ownsRouteReadiness: false,
    ownsCanvasParentBoot: false,
    ownsCanvasRelease: false,
    ownsWestAudit: false,
    ownsReadyText: false,
    ownsF21: false,
    ownsFinalVisualPassClaim: false,

    f21ClaimedByCanvasSouth: false,
    readyTextClaimedByCanvasSouth: false,

    firstFailedCoordinate: "WAITING_EAST_ATLAS_CANVAS_OR_PARENT_ATLAS_PACKET",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "SOUTH_API_READY_WAITING_CURRENT_F13S_INPUT",

    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    updatedAt: ""
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function nowMs() {
    return Date.now ? Date.now() : new Date().getTime();
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true") return true;
    if (value === false || value === 0 || value === "0" || value === "false") return false;
    return fallback;
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function objectValue(source, path, fallback = undefined) {
    if (!source || typeof source !== "object") return fallback;

    const parts = String(path || "").split(".");
    let cursor = source;

    for (const part of parts) {
      if (!cursor || typeof cursor !== "object" || cursor[part] === undefined || cursor[part] === null) {
        return fallback;
      }

      cursor = cursor[part];
    }

    return cursor;
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }

    return undefined;
  }

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "LOCAL_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, MAX_EVENT_LOG);
    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "SOUTH_ERROR"),
      event: safeString(code, "SOUTH_ERROR"),
      message: error && error.message ? String(error.message) : String(error || ""),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, MAX_ERROR_LOG);
    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function yieldFrame(kind = "render") {
    if (kind === "compose") state.textureComposeYieldCount += 1;
    else state.renderYieldCount += 1;

    return new Promise((resolve) => {
      if (isFunction(root.requestAnimationFrame)) {
        root.requestAnimationFrame(resolve);
      } else {
        root.setTimeout(resolve, 0);
      }
    });
  }

  function validCanvas(candidate) {
    return Boolean(
      candidate &&
      Number(candidate.width) > 0 &&
      Number(candidate.height) > 0 &&
      isFunction(candidate.getContext)
    );
  }

  function classifySourcePath(path) {
    const p = safeString(path, "");

    return {
      parentPacketAccepted: p.includes("parentPacket"),
      releasePacketAccepted: p.includes("releasePacket"),
      eastAtlasPacketAccepted: p.includes("eastAtlasPacket") || p.includes("canvasEastPacket") || p.includes("atlasPacket"),
      sourcePacketAccepted: p.includes("sourcePacket") || p.includes("packet") || p.includes("payload") || p.includes("detail"),
      cachedTextureAccepted: p === "state.textureCanvas"
    };
  }

  function resolveSourceCanvas(options = {}) {
    const source = isObject(options) ? options : {};

    for (const path of SOURCE_CANDIDATE_PATHS) {
      const candidate = objectValue(source, path);

      if (validCanvas(candidate)) {
        const flags = classifySourcePath(path);

        state.sourceCanvasResolved = true;
        state.sourceCanvasResolutionPath = path;
        state.sourceCanvasResolutionReason = "NONE_SOURCE_CANVAS_RESOLVED";
        state.sourcePacketAccepted = flags.sourcePacketAccepted;
        state.parentPacketAccepted = flags.parentPacketAccepted;
        state.releasePacketAccepted = flags.releasePacketAccepted;
        state.eastAtlasPacketAccepted = flags.eastAtlasPacketAccepted;
        state.cachedTextureAccepted = false;

        return {
          canvas: candidate,
          path,
          fromCache: false,
          reason: "NONE_SOURCE_CANVAS_RESOLVED"
        };
      }
    }

    if (source.allowCachedTexture === true && validCanvas(state.textureCanvas)) {
      state.sourceCanvasResolved = true;
      state.sourceCanvasResolutionPath = "state.textureCanvas";
      state.sourceCanvasResolutionReason = "NONE_CACHED_TEXTURE_RESOLVED";
      state.sourcePacketAccepted = false;
      state.parentPacketAccepted = false;
      state.releasePacketAccepted = false;
      state.eastAtlasPacketAccepted = false;
      state.cachedTextureAccepted = true;

      return {
        canvas: state.textureCanvas,
        path: "state.textureCanvas",
        fromCache: true,
        reason: "NONE_CACHED_TEXTURE_RESOLVED"
      };
    }

    state.sourceCanvasResolved = false;
    state.sourceCanvasResolutionPath = "";
    state.sourceCanvasResolutionReason = "WAITING_EAST_ATLAS_CANVAS_OR_PARENT_ATLAS_PACKET";
    state.sourcePacketAccepted = false;
    state.parentPacketAccepted = false;
    state.releasePacketAccepted = false;
    state.eastAtlasPacketAccepted = false;
    state.cachedTextureAccepted = false;

    return {
      canvas: null,
      path: "",
      fromCache: false,
      reason: "WAITING_EAST_ATLAS_CANVAS_OR_PARENT_ATLAS_PACKET"
    };
  }

  function readSourceReceipt(source, options = {}) {
    const packetReceipt = firstDefined(
      objectValue(options, "eastAtlasPacket.receipt"),
      objectValue(options, "atlasPacket.receipt"),
      objectValue(options, "canvasEastPacket.receipt"),
      objectValue(options, "parentPacket.eastAtlasPacket.receipt"),
      objectValue(options, "parentPacket.atlasPacket.receipt"),
      objectValue(options, "releasePacket.eastAtlasPacket.receipt"),
      objectValue(options, "releasePacket.atlasPacket.receipt"),
      objectValue(options, "sourcePacket.receipt"),
      objectValue(options, "packet.receipt"),
      objectValue(options, "payload.receipt"),
      objectValue(options, "detail.receipt"),
      options.receipt
    );

    const packetContract = firstDefined(
      objectValue(options, "eastAtlasPacket.contract"),
      objectValue(options, "atlasPacket.contract"),
      objectValue(options, "canvasEastPacket.contract"),
      objectValue(options, "parentPacket.eastAtlasPacket.contract"),
      objectValue(options, "parentPacket.atlasPacket.contract"),
      objectValue(options, "releasePacket.eastAtlasPacket.contract"),
      objectValue(options, "releasePacket.atlasPacket.contract"),
      objectValue(options, "sourcePacket.contract"),
      objectValue(options, "packet.contract"),
      objectValue(options, "payload.contract"),
      objectValue(options, "detail.contract"),
      options.contract
    );

    if (!source || !source.dataset) {
      return {
        contract: safeString(packetContract, ""),
        receipt: safeString(packetReceipt, "")
      };
    }

    return {
      contract: safeString(firstDefined(
        source.dataset.hearthCanvasEastContract,
        source.dataset.hearthMaterialsContract,
        source.dataset.hearthCanvasContract,
        source.dataset.contract,
        packetContract
      ), ""),
      receipt: safeString(firstDefined(
        source.dataset.hearthCanvasEastReceipt,
        source.dataset.hearthMaterialsReceipt,
        source.dataset.hearthCanvasReceipt,
        source.dataset.receipt,
        packetReceipt
      ), "")
    };
  }

  function createCanvas(width, height) {
    if (!doc || !isFunction(doc.createElement)) {
      throw new Error("Canvas South requires document.createElement.");
    }

    const canvas = doc.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));

    const context = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true
    });

    if (!context) throw new Error("Canvas South 2D context unavailable.");

    return { canvas, context };
  }

  function clearCanvas(context, width, height) {
    context.clearRect(0, 0, width, height);
  }

  function clearCurrentProof(reason = "current-proof-cleared") {
    state.visibleContentProof = false;
    state.visibleContentStrictProof = false;
    state.visibleContentSoftGap = false;
    state.visibleContentHardFail = false;
    state.visibleForwardProgress = false;
    state.visibleContentAdmissible = false;
    state.visiblePlanetAvailable = false;
    state.currentVisibleProofValid = false;
    state.visibleProofStale = true;
    state.staleProofSuppressed = true;
    state.proofBin = PROOF_BIN.STALE;
    state.visibleContentProofMethod = reason;
    state.f13VisibleEvidenceComplete = false;
    state.f13VisibleEvidenceAvailable = false;
    state.f13VisibleEvidenceStrict = false;
    state.f13VisibleEvidenceDegraded = false;
    state.f13sVisibleProofReady = false;
    state.f13HardFail = false;

    deriveReadiness();
  }

  function setSouthHold(reason = "WAITING_EAST_ATLAS_CANVAS_OR_PARENT_ATLAS_PACKET", detail = {}) {
    state.firstFailedCoordinate = reason;
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;
    state.postgameStatus = reason;
    state.parentMutationRecommendedBySouth = false;

    if (reason === "WAITING_EAST_ATLAS_CANVAS_OR_PARENT_ATLAS_PACKET") {
      state.textureComposeComplete = false;
      state.textureProofComplete = false;
      state.textureHardFail = false;
      state.textureReady = false;
    }

    deriveReadiness();

    recordLocal("SOUTH_HELD_WITHOUT_PARENT_MUTATION", {
      reason,
      recommendedNextFile: FILE,
      recommendedNextRenewalTarget: FILE,
      parentMutationRecommendedBySouth: false,
      ...clonePlain(detail)
    });

    updateDataset();

    return getHeldPacket(reason);
  }

  function markFatalCompose(error) {
    state.textureComposeError = error && error.message ? error.message : String(error || "");
    state.textureComposeComplete = false;
    state.textureProofComplete = false;
    state.textureHardFail = true;
    state.textureRebuildComplete = false;
    state.textureRebuildError = state.textureComposeError;
    state.textureInvalidated = true;
    state.renderFrameStale = true;
    state.visibleProofStale = true;
    state.currentVisibleProofValid = false;
    state.sphereProjectionComplete = false;
    state.renderedFromCachedTexture = false;
    state.f13VisibleEvidenceAvailable = false;
    state.f13VisibleEvidenceStrict = false;
    state.f13VisibleEvidenceDegraded = false;
    state.f13sVisibleProofReady = false;
    state.f13HardFail = true;
    state.firstFailedCoordinate = "SOUTH_TEXTURE_COMPOSE_FATAL";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;
    state.updatedAt = nowIso();

    clearCurrentProof("fatal-compose-failure-current-proof-cleared");
    state.visibleContentHardFail = true;
    state.proofBin = PROOF_BIN.HARD_FAIL;
    state.f13HardFail = true;

    recordError("SOUTH_TEXTURE_COMPOSE_FATAL", error);
    updateDataset();
  }

  function markFatalRender(error) {
    state.renderError = error && error.message ? error.message : String(error || "");
    state.renderHardFail = true;
    state.renderStarted = true;
    state.renderProgress = 0;
    state.firstFrameDetected = false;
    state.imageRendered = false;
    state.renderedAfterTexture = false;
    state.renderedFromCachedTexture = false;
    state.planetFramePainted = false;
    state.nonblankPlanetVisible = false;
    state.planetNotObstructed = false;
    state.visiblePlanetAvailable = false;
    state.sphereProjectionComplete = false;
    state.renderFrameStale = true;
    state.visibleProofStale = true;
    state.currentVisibleProofValid = false;
    state.firstFailedCoordinate = "SOUTH_RENDER_SPHERE_FATAL";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;
    state.updatedAt = nowIso();

    clearCurrentProof("fatal-render-failure-current-proof-cleared");
    state.visibleContentHardFail = true;
    state.f13HardFail = true;
    state.proofBin = PROOF_BIN.HARD_FAIL;

    recordError("SOUTH_RENDER_SPHERE_FATAL", error);
    updateDataset();
  }

  function enhanceTexturePixel(r, g, b, a, latitudeEdge) {
    if (a < 8) return [r, g, b, a];

    const brightness = (r + g + b) / 3;
    const contrast = 1.075;
    const hazeLift = 5.5;
    const polarModeration = latitudeEdge > 0.74 ? 0.95 : 1;

    let rr = (r - 128) * contrast + 128 + hazeLift;
    let gg = (g - 128) * contrast + 128 + hazeLift;
    let bb = (b - 128) * contrast + 128 + hazeLift;

    if (brightness < 34) {
      rr += 5;
      gg += 6;
      bb += 7;
    }

    if (brightness > 210) {
      rr -= 4;
      gg -= 4;
      bb -= 4;
    }

    return [
      clamp(rr * polarModeration, 0, 255),
      clamp(gg * polarModeration, 0, 255),
      clamp(bb * polarModeration, 0, 255),
      a
    ];
  }

  async function composeTexture(options = {}) {
    const startedMs = nowMs();

    state.textureComposeStarted = true;
    state.textureComposeComplete = false;
    state.textureProofComplete = false;
    state.textureHardFail = false;
    state.textureComposeProgress = 0;
    state.textureComposeStartedAt = nowIso();
    state.textureComposeCompletedAt = "";
    state.textureComposeElapsedMs = 0;
    state.textureComposeError = "";
    state.textureComposeYieldCount = 0;
    state.textureRebuildRequested = options.rebuild === true;
    state.textureRebuildComplete = false;
    state.textureRebuildError = "";
    state.renderFrameStale = true;
    state.visibleProofStale = true;
    state.currentVisibleProofValid = false;
    state.currentTextureProofAt = "";
    state.updatedAt = state.textureComposeStartedAt;

    updateDataset();

    try {
      const resolved = resolveSourceCanvas(options);

      if (!resolved.canvas) {
        return setSouthHold(resolved.reason, {
          operation: "composeTexture",
          sourceResolutionPath: "",
          parentAuthorityRule: state.parentAuthorityRule,
          downstreamAcclimationRule: state.downstreamAcclimationRule
        });
      }

      const source = resolved.canvas;
      const sourceReceipt = readSourceReceipt(source, options);
      const width = Math.max(1, Math.round(source.width || DEFAULT_TEXTURE_WIDTH));
      const height = Math.max(1, Math.round(source.height || DEFAULT_TEXTURE_HEIGHT));

      const working = createCanvas(width, height);
      const canvas = working.canvas;
      const context = working.context;

      context.clearRect(0, 0, width, height);
      context.drawImage(source, 0, 0, width, height);

      const image = context.getImageData(0, 0, width, height);
      const data = image.data;

      state.textureSourceContract = sourceReceipt.contract;
      state.textureSourceReceipt = sourceReceipt.receipt;
      state.textureSourceWidth = width;
      state.textureSourceHeight = height;
      state.textureSourcePath = resolved.path;

      for (let yStart = 0; yStart < height; yStart += COMPOSE_ROWS_PER_CHUNK) {
        const yEnd = Math.min(height, yStart + COMPOSE_ROWS_PER_CHUNK);

        for (let y = yStart; y < yEnd; y += 1) {
          const v = height <= 1 ? 0 : y / (height - 1);
          const latitudeEdge = Math.abs(v - 0.5) * 2;

          for (let x = 0; x < width; x += 1) {
            const index = (y * width + x) * 4;

            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];

            const enhanced = enhanceTexturePixel(r, g, b, a, latitudeEdge);

            data[index] = enhanced[0];
            data[index + 1] = enhanced[1];
            data[index + 2] = enhanced[2];
            data[index + 3] = enhanced[3];
          }
        }

        state.textureComposeProgress = Math.round((yEnd / height) * 100);
        state.updatedAt = nowIso();

        if (isFunction(options.onProgress)) {
          try {
            options.onProgress(state.textureComposeProgress, getReceipt());
          } catch (error) {
            recordError("SOUTH_TEXTURE_PROGRESS_CALLBACK_FAILED", error);
          }
        }

        await yieldFrame("compose");
      }

      context.putImageData(image, 0, 0);

      state.textureCanvas = canvas;
      state.textureContext = context;
      state.textureWidth = width;
      state.textureHeight = height;

      state.textureComposeProgress = 100;
      state.textureComposeComplete = true;
      state.textureProofComplete = true;
      state.textureHardFail = false;
      state.textureInvalidated = false;
      state.textureInvalidationReason = "";
      state.textureRebuildComplete = options.rebuild === true;
      state.textureComposeCompletedAt = nowIso();
      state.textureComposeElapsedMs = Math.max(0, nowMs() - startedMs);
      state.currentTextureProofAt = state.textureComposeCompletedAt;
      state.renderFrameStale = true;
      state.visibleProofStale = true;
      state.currentVisibleProofValid = false;
      state.sphereProjectionComplete = false;
      state.imageRendered = false;
      state.firstFrameDetected = false;
      state.f13VisibleEvidenceAvailable = false;
      state.f13VisibleEvidenceStrict = false;
      state.f13VisibleEvidenceDegraded = false;
      state.f13sVisibleProofReady = false;
      state.firstFailedCoordinate = "WAITING_SOUTH_RENDER_FROM_CURRENT_TEXTURE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.postgameStatus = "SOUTH_TEXTURE_COMPOSED_WAITING_RENDER_AND_VISIBLE_PROOF";
      state.updatedAt = state.textureComposeCompletedAt;

      stampTextureCanvas(canvas);

      recordLocal("SOUTH_TEXTURE_COMPOSE_COMPLETE_PARENT_ACCLIMATED", {
        width,
        height,
        sourcePath: state.textureSourcePath,
        sourceContract: state.textureSourceContract,
        sourceReceipt: state.textureSourceReceipt,
        textureProofComplete: true,
        parentMutationRecommendedBySouth: false,
        visualPassClaimed: false,
        f21EligibleForNorth: false
      });

      updateDataset();

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        textureCanvas: canvas,
        textureContext: context,
        width,
        height,
        sourceResolutionPath: resolved.path,
        sourceCanvasResolved: true,
        textureProofComplete: true,
        textureHardFail: false,
        textureReady: true,
        canvasSouthApiReady: state.canvasSouthApiReady,
        canvasSouthEvidenceReady: state.canvasSouthEvidenceReady,
        canvasSouthReady: state.canvasSouthReady,
        f13VisibleEvidenceAvailable: false,
        f13VisibleEvidenceStrict: false,
        f13VisibleEvidenceDegraded: false,
        f13sVisibleProofReady: false,
        receiptPacket: getReceipt(),
        visualPassClaimed: false,
        f21EligibleForNorth: false
      };
    } catch (error) {
      if (error && error.isSouthHold) {
        return setSouthHold(error.code || error.message, { operation: "composeTexture" });
      }

      markFatalCompose(error);
      throw error;
    }
  }

  function composeTextureFromAtlas(options = {}) {
    return composeTexture(options);
  }

  function getTextureCanvas() {
    return state.textureCanvas;
  }

  function getTextureReceipt() {
    return getReceipt();
  }

  function resolveRenderInputs(options = {}) {
    const canvas = options.canvas || options.outputCanvas || null;
    const textureCanvas = options.textureCanvas || state.textureCanvas || null;
    const view = options.view || {};

    if (!validCanvas(canvas)) {
      throw new SouthHoldError("Canvas South renderSphere requires a valid output canvas.", "WAITING_SOUTH_OUTPUT_CANVAS");
    }

    if (!validCanvas(textureCanvas)) {
      throw new SouthHoldError("Canvas South renderSphere requires a composed texture canvas.", "WAITING_SOUTH_TEXTURE_CANVAS");
    }

    if (state.textureInvalidated === true || state.textureProofComplete !== true) {
      throw new SouthHoldError(
        "Canvas South renderSphere blocked: texture is invalidated or texture proof is incomplete.",
        "WAITING_CURRENT_SOUTH_TEXTURE_PROOF"
      );
    }

    const context = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true
    });

    if (!context) throw new Error("Canvas South output 2D context unavailable.");

    const textureContext = textureCanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true
    });

    if (!textureContext) throw new Error("Canvas South texture context unavailable.");

    const width = Math.max(1, Math.round(canvas.width || 1));
    const height = Math.max(1, Math.round(canvas.height || 1));
    const textureWidth = Math.max(1, Math.round(textureCanvas.width || DEFAULT_TEXTURE_WIDTH));
    const textureHeight = Math.max(1, Math.round(textureCanvas.height || DEFAULT_TEXTURE_HEIGHT));

    const yaw = safeNumber(view.yaw !== undefined ? view.yaw : view.rotationYaw, 0);
    const pitch = clamp(view.pitch !== undefined ? view.pitch : view.rotationPitch, -1.18, 1.18);
    const zoom = clamp(view.zoomLevel !== undefined ? view.zoomLevel : view.zoom, 0.82, 2.8);

    state.canvasWidth = width;
    state.canvasHeight = height;
    state.lastYaw = yaw;
    state.lastPitch = pitch;
    state.lastZoom = zoom;

    return {
      canvas,
      context,
      textureCanvas,
      textureContext,
      width,
      height,
      textureWidth,
      textureHeight,
      yaw,
      pitch,
      zoom
    };
  }

  function texturePixel(textureData, textureWidth, textureHeight, u, v) {
    const uu = ((u % 1) + 1) % 1;
    const vv = clamp01(v);

    const x = Math.floor(uu * (textureWidth - 1));
    const y = Math.floor(vv * (textureHeight - 1));
    const index = (y * textureWidth + x) * 4;

    return [
      textureData[index] || 0,
      textureData[index + 1] || 0,
      textureData[index + 2] || 0,
      textureData[index + 3] || 0
    ];
  }

  function rotatedSphereVector(px, py, radius, yaw, pitch) {
    const nx = px / radius;
    const ny = py / radius;
    const r2 = nx * nx + ny * ny;

    if (r2 > 1) return null;

    const nz = Math.sqrt(Math.max(0, 1 - r2));

    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);

    const x1 = nx * cosYaw + nz * sinYaw;
    const z1 = -nx * sinYaw + nz * cosYaw;
    const y1 = -ny;

    const y2 = y1 * cosPitch - z1 * sinPitch;
    const z2 = y1 * sinPitch + z1 * cosPitch;

    const lon = Math.atan2(x1, z2);
    const lat = Math.asin(clamp(y2, -1, 1));

    return {
      u: lon / (Math.PI * 2) + 0.5,
      v: 0.5 - lat / Math.PI,
      normalZ: nz,
      edge: 1 - r2,
      r2
    };
  }

  function renderRowRange(inputs, outputImage, textureImage, yStart, yEnd) {
    const {
      width,
      height,
      textureWidth,
      textureHeight,
      yaw,
      pitch,
      zoom
    } = inputs;

    const out = outputImage.data;
    const tex = textureImage.data;

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const radius = Math.max(8, Math.min(width, height) * 0.435 * zoom);

    state.renderCenterX = centerX;
    state.renderCenterY = centerY;
    state.renderRadius = radius;

    for (let y = yStart; y < yEnd; y += 1) {
      const dy = y - centerY;

      for (let x = 0; x < width; x += 1) {
        const dx = x - centerX;
        const index = (y * width + x) * 4;
        const sphere = rotatedSphereVector(dx, dy, radius, yaw, pitch);

        if (!sphere) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          const halo = clamp01(1 - Math.abs(distance - radius) / Math.max(1, radius * 0.045));

          if (halo > 0) {
            out[index] = 14;
            out[index + 1] = 22;
            out[index + 2] = 32;
            out[index + 3] = Math.round(halo * 86);
          } else {
            out[index] = 0;
            out[index + 1] = 0;
            out[index + 2] = 0;
            out[index + 3] = 0;
          }

          continue;
        }

        const pixel = texturePixel(tex, textureWidth, textureHeight, sphere.u, sphere.v);

        const limb = clamp01(Math.pow(sphere.normalZ, 0.58));
        const light = clamp(0.50 + limb * 0.58, 0.34, 1.10);
        const rim = clamp01(1 - sphere.edge * 2.6);
        const atmosphericLift = rim * 10;

        out[index] = clamp(pixel[0] * light + atmosphericLift, 0, 255);
        out[index + 1] = clamp(pixel[1] * light + atmosphericLift * 1.12, 0, 255);
        out[index + 2] = clamp(pixel[2] * light + atmosphericLift * 1.55, 0, 255);
        out[index + 3] = 255;
      }
    }
  }

  async function renderSphere(options = {}) {
    const startedMs = nowMs();

    state.renderStarted = true;
    state.renderProgress = 0;
    state.renderStartedAt = nowIso();
    state.renderCompletedAt = "";
    state.renderElapsedMs = 0;
    state.renderError = "";
    state.renderHardFail = false;
    state.firstFrameRequested = true;
    state.sphereProjectionComplete = false;
    state.renderedFromCachedTexture = false;
    state.renderFrameStale = true;
    state.visibleProofStale = true;
    state.currentVisibleProofValid = false;
    state.updatedAt = state.renderStartedAt;

    updateDataset();

    try {
      const inputs = resolveRenderInputs(options);
      const textureImage = inputs.textureContext.getImageData(0, 0, inputs.textureWidth, inputs.textureHeight);
      const outputImage = inputs.context.createImageData(inputs.width, inputs.height);

      clearCanvas(inputs.context, inputs.width, inputs.height);

      for (let yStart = 0; yStart < inputs.height; yStart += RENDER_ROWS_PER_CHUNK) {
        const yEnd = Math.min(inputs.height, yStart + RENDER_ROWS_PER_CHUNK);

        renderRowRange(inputs, outputImage, textureImage, yStart, yEnd);

        state.renderProgress = Math.round((yEnd / inputs.height) * 100);

        if (isFunction(options.onProgress)) {
          try {
            options.onProgress(state.renderProgress, getReceipt());
          } catch (error) {
            recordError("SOUTH_RENDER_PROGRESS_CALLBACK_FAILED", error);
          }
        }

        await yieldFrame("render");
      }

      inputs.context.putImageData(outputImage, 0, 0);

      state.renderProgress = 100;
      state.renderFrameCount += 1;
      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.imageRenderedMeansFrameDrawnOnly = true;
      state.imageRenderedDoesNotMeanVisualPass = true;
      state.imageRenderedDoesNotMeanF21 = true;
      state.renderedAfterTexture = state.textureComposeComplete === true;
      state.renderedFromCachedTexture = true;
      state.planetFramePainted = true;
      state.nonblankPlanetVisible = true;
      state.planetNotObstructed = true;
      state.visiblePlanetAvailable = true;
      state.sphereProjectionComplete = true;
      state.renderHardFail = false;
      state.renderFrameStale = false;
      state.visibleProofStale = true;
      state.currentVisibleProofValid = false;
      state.f13VisibleEvidenceAvailable = false;
      state.f13VisibleEvidenceStrict = false;
      state.f13VisibleEvidenceDegraded = false;
      state.f13sVisibleProofReady = false;
      state.currentSphereProofAt = nowIso();
      state.renderCompletedAt = state.currentSphereProofAt;
      state.renderElapsedMs = Math.max(0, nowMs() - startedMs);
      state.firstFailedCoordinate = "WAITING_CURRENT_SOUTH_VISIBLE_PROOF_SAMPLE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.postgameStatus = "SOUTH_RENDER_COMPLETE_WAITING_VISIBLE_PROOF_SAMPLE";
      state.updatedAt = state.renderCompletedAt;

      stampOutputCanvas(inputs.canvas);
      updateDataset();

      recordLocal("SOUTH_RENDER_SPHERE_COMPLETE_PARENT_ACCLIMATED", {
        width: inputs.width,
        height: inputs.height,
        textureWidth: inputs.textureWidth,
        textureHeight: inputs.textureHeight,
        yaw: inputs.yaw,
        pitch: inputs.pitch,
        zoom: inputs.zoom,
        sphereProjectionComplete: true,
        imageRenderedMeansFrameDrawnOnly: true,
        visualPassClaimed: false,
        f21EligibleForNorth: false
      });

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        imageRendered: true,
        imageRenderedMeansFrameDrawnOnly: true,
        imageRenderedDoesNotMeanVisualPass: true,
        imageRenderedDoesNotMeanF21: true,
        firstFrameDetected: true,
        renderedAfterTexture: state.renderedAfterTexture,
        renderedFromCachedTexture: true,
        sphereProjectionComplete: true,
        renderReady: true,
        visibleProofReady: false,
        f13VisibleEvidenceAvailable: false,
        f13VisibleEvidenceStrict: false,
        f13VisibleEvidenceDegraded: false,
        receiptPacket: getReceipt(),
        visualPassClaimed: false,
        f21EligibleForNorth: false
      };
    } catch (error) {
      if (error && error.isSouthHold) {
        return setSouthHold(error.code || error.message, { operation: "renderSphere" });
      }

      markFatalRender(error);
      throw error;
    }
  }

  function renderFromTexture(options = {}) {
    return renderSphere(options);
  }

  function renderSphereSync(options = {}) {
    try {
      state.renderStarted = true;
      state.renderStartedAt = nowIso();
      state.renderError = "";
      state.renderHardFail = false;
      state.firstFrameRequested = true;

      const inputs = resolveRenderInputs(options);
      const textureImage = inputs.textureContext.getImageData(0, 0, inputs.textureWidth, inputs.textureHeight);
      const outputImage = inputs.context.createImageData(inputs.width, inputs.height);

      clearCanvas(inputs.context, inputs.width, inputs.height);
      renderRowRange(inputs, outputImage, textureImage, 0, inputs.height);
      inputs.context.putImageData(outputImage, 0, 0);

      state.renderProgress = 100;
      state.renderFrameCount += 1;
      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.imageRenderedMeansFrameDrawnOnly = true;
      state.imageRenderedDoesNotMeanVisualPass = true;
      state.imageRenderedDoesNotMeanF21 = true;
      state.renderedAfterTexture = state.textureComposeComplete === true;
      state.renderedFromCachedTexture = true;
      state.planetFramePainted = true;
      state.nonblankPlanetVisible = true;
      state.planetNotObstructed = true;
      state.visiblePlanetAvailable = true;
      state.sphereProjectionComplete = true;
      state.renderHardFail = false;
      state.renderFrameStale = false;
      state.visibleProofStale = true;
      state.currentVisibleProofValid = false;
      state.f13VisibleEvidenceAvailable = false;
      state.f13VisibleEvidenceStrict = false;
      state.f13VisibleEvidenceDegraded = false;
      state.f13sVisibleProofReady = false;
      state.currentSphereProofAt = nowIso();
      state.renderCompletedAt = state.currentSphereProofAt;
      state.renderElapsedMs = Math.max(0, Date.parse(state.renderCompletedAt) - Date.parse(state.renderStartedAt));
      state.firstFailedCoordinate = "WAITING_CURRENT_SOUTH_VISIBLE_PROOF_SAMPLE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.postgameStatus = "SOUTH_RENDER_SYNC_COMPLETE_WAITING_VISIBLE_PROOF_SAMPLE";
      state.updatedAt = state.currentSphereProofAt;

      stampOutputCanvas(inputs.canvas);
      updateDataset();

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        imageRendered: true,
        imageRenderedMeansFrameDrawnOnly: true,
        imageRenderedDoesNotMeanVisualPass: true,
        imageRenderedDoesNotMeanF21: true,
        sync: true,
        renderedFromCachedTexture: true,
        sphereProjectionComplete: true,
        renderReady: true,
        visibleProofReady: false,
        receiptPacket: getReceipt(),
        visualPassClaimed: false,
        f21EligibleForNorth: false
      };
    } catch (error) {
      if (error && error.isSouthHold) {
        return setSouthHold(error.code || error.message, { operation: "renderSphereSync", sync: true });
      }

      state.renderError = error && error.message ? error.message : String(error);
      state.renderHardFail = true;
      state.sphereProjectionComplete = false;
      state.renderFrameStale = true;
      state.visibleProofStale = true;
      state.currentVisibleProofValid = false;
      state.f13VisibleEvidenceAvailable = false;
      state.f13VisibleEvidenceStrict = false;
      state.f13VisibleEvidenceDegraded = false;
      state.f13sVisibleProofReady = false;
      state.f13HardFail = true;
      state.firstFailedCoordinate = "SOUTH_RENDER_SPHERE_SYNC_FAILED";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.updatedAt = nowIso();

      recordError("SOUTH_RENDER_SPHERE_SYNC_FAILED", error);
      updateDataset();

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        imageRendered: false,
        sync: true,
        error: state.renderError,
        renderHardFail: true,
        sphereProjectionComplete: false,
        receiptPacket: getReceipt(),
        visualPassClaimed: false,
        f21EligibleForNorth: false
      };
    }
  }

  function pixelClass(r, g, b, a) {
    if (a < 12) return "transparent";

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    const brightness = (r + g + b) / 3;

    if (brightness < 9) return "carrier";
    if (chroma < 8 && brightness < 28) return "carrier";

    if (b > r + 8 && b >= g - 2) return "water";
    if (g >= b && g >= r * 0.68 && brightness > 24) return "land";
    if (r >= g * 0.88 && g >= b * 0.62 && brightness > 26) return "relief";
    if (brightness > 38 && chroma >= 8) return "other";
    if (brightness > 48) return "other";

    return "carrier";
  }

  function colorBucket(r, g, b, a) {
    if (a < 12) return "transparent";

    const brightness = Math.round(((r + g + b) / 3) / 32);
    const dominant =
      b >= r && b >= g ? "B" :
        g >= r && g >= b ? "G" :
          r >= g && r >= b ? "R" :
            "N";

    return `${dominant}${clamp(brightness, 0, 7)}`;
  }

  function classifyVisibleContentEvidence(metrics = {}) {
    const sampleCount = safeNumber(metrics.sampleCount, metrics.visibleContentSampleCount || 0);
    const transparentCount = safeNumber(metrics.transparentCount, metrics.visibleContentTransparentSampleCount || 0);
    const carrierCount = safeNumber(metrics.carrierCount, metrics.visibleContentCarrierSampleCount || 0);
    const landCount = safeNumber(metrics.landCount, metrics.visibleContentLandSampleCount || 0);
    const waterCount = safeNumber(metrics.waterCount, metrics.visibleContentWaterSampleCount || 0);
    const reliefCount = safeNumber(metrics.reliefCount, metrics.visibleContentReliefSampleCount || 0);
    const otherCount = safeNumber(metrics.otherCount, metrics.visibleContentOtherSampleCount || 0);
    const planetPixelCount = safeNumber(metrics.planetPixelCount, metrics.visibleContentPlanetPixelCount || 0);
    const variance = safeNumber(metrics.varianceScore, metrics.visibleContentVarianceScore || 0);
    const classCount = safeNumber(metrics.classCount, metrics.visibleContentClassCount || 0);
    const colorBucketCount = safeNumber(metrics.colorBucketCount, metrics.visibleContentColorBucketCount || 0);

    const contentCount = landCount + waterCount + reliefCount + otherCount;
    const nonTransparentCount = sampleCount - transparentCount;
    const nonCarrierRatio = nonTransparentCount > 0 ? contentCount / nonTransparentCount : 0;
    const nonTransparentRatio = sampleCount > 0 ? nonTransparentCount / sampleCount : 0;
    const planetRatio = sampleCount > 0 ? planetPixelCount / sampleCount : 0;

    const renderedSphereAvailable = Boolean(
      safeBool(metrics.imageRendered, state.imageRendered) &&
      safeBool(metrics.firstFrameDetected, state.firstFrameDetected) &&
      safeBool(metrics.sphereProjectionComplete, state.sphereProjectionComplete)
    );

    const textureProofAvailable = Boolean(
      safeBool(metrics.textureComposeComplete, state.textureComposeComplete) &&
      safeBool(metrics.textureProofComplete, state.textureProofComplete) &&
      !safeBool(metrics.textureHardFail, state.textureHardFail)
    );

    const staleBlocked = Boolean(
      safeBool(metrics.visibleProofStale, state.visibleProofStale) &&
      safeBool(metrics.requireCurrentProof, true) === false
    );

    const multiSurfaceSignal = Boolean(
      classCount >= 2 ||
      colorBucketCount >= 3 ||
      (waterCount > 0 && (landCount > 0 || reliefCount > 0 || otherCount > 0))
    );

    const strongMaterialSignal = Boolean(
      contentCount >= 12 &&
      planetPixelCount >= 18 &&
      variance >= 7 &&
      nonCarrierRatio >= 0.18 &&
      nonTransparentRatio >= 0.30
    );

    const strict = Boolean(
      !staleBlocked &&
      renderedSphereAvailable &&
      textureProofAvailable &&
      sampleCount >= 24 &&
      strongMaterialSignal &&
      (
        multiSurfaceSignal ||
        (contentCount >= 22 && variance >= 10 && colorBucketCount >= 2) ||
        (planetRatio >= 0.34 && variance >= 12)
      )
    );

    const soft = Boolean(
      !strict &&
      !staleBlocked &&
      renderedSphereAvailable &&
      sampleCount >= 16 &&
      planetPixelCount >= 8 &&
      nonTransparentRatio >= 0.18 &&
      (
        contentCount >= 5 ||
        variance >= 4 ||
        colorBucketCount >= 2
      )
    );

    const visibleContentProof = strict || soft;
    const hardFail = Boolean(!strict && !soft);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      activeFibonacci: 13,
      activeFibonacciRank: "F13S",
      activeFibonacciGate: "F13S",
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,

      proofBin: strict ? PROOF_BIN.STRICT : soft ? PROOF_BIN.SOFT_GAP : PROOF_BIN.HARD_FAIL,
      visibleContentProof,
      visibleContentStrictProof: strict,
      visibleContentSoftGap: soft,
      visibleContentHardFail: hardFail,
      visibleForwardProgress: strict || soft || contentCount > 0 || planetPixelCount > 0,
      visibleContentAdmissible: visibleContentProof,
      visiblePlanetAvailable: visibleContentProof || planetPixelCount > 0,
      carrierOnlyDetected: carrierCount > 0 && contentCount === 0,
      visibleContentProofMethod: strict
        ? "strict-rendered-sphere-surface-signal-proof-v4"
        : soft
          ? "soft-visible-content-forward-progress-proof-v4"
          : "hard-fail-no-current-visible-content-proof-v4",

      f13VisibleEvidenceComplete: visibleContentProof,
      f13VisibleEvidenceAvailable: visibleContentProof,
      f13VisibleEvidenceStrict: strict,
      f13VisibleEvidenceDegraded: soft,
      f13sVisibleProofReady: visibleContentProof,
      f13HardFail: hardFail,

      strictVisibleProofClassifierActive: true,
      strictProofDoesNotRequireNamedLandWaterBalance: true,
      strictProofRequiresRenderedSphereSurfaceSignal: true,
      degradedProofRemainsAvailableForForwardProgress: true,

      metrics: {
        sampleCount,
        transparentCount,
        carrierCount,
        landCount,
        waterCount,
        reliefCount,
        otherCount,
        contentCount,
        planetPixelCount,
        varianceScore: variance,
        classCount,
        colorBucketCount,
        nonCarrierRatio,
        nonTransparentRatio,
        planetRatio,
        renderedSphereAvailable,
        textureProofAvailable,
        multiSurfaceSignal,
        strongMaterialSignal
      },

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21LatchMode: "north-only",
      f21ClaimedByCanvasSouth: false,
      visualPassClaimed: false
    };
  }

  function sampleVisibleContent(options = {}) {
    state.visibleContentProofStarted = true;
    state.visibleContentProofError = "";

    const canvas = options.canvas || options.outputCanvas || null;

    if (!validCanvas(canvas)) {
      const error = new SouthHoldError("Canvas South visible-content proof requires a valid output canvas.", "WAITING_SOUTH_OUTPUT_CANVAS_FOR_VISIBLE_PROOF");

      state.visibleContentProofError = error.message;
      state.visibleContentProof = false;
      state.visibleContentStrictProof = false;
      state.visibleContentSoftGap = false;
      state.visibleContentHardFail = false;
      state.visiblePlanetAvailable = false;
      state.currentVisibleProofValid = false;
      state.visibleProofStale = false;
      state.proofBin = PROOF_BIN.NONE;
      state.f13VisibleEvidenceAvailable = false;
      state.f13VisibleEvidenceStrict = false;
      state.f13VisibleEvidenceDegraded = false;
      state.f13sVisibleProofReady = false;
      state.f13HardFail = false;
      state.firstFailedCoordinate = error.code;
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;

      recordLocal("SOUTH_VISIBLE_PROOF_HELD_OUTPUT_CANVAS_MISSING", {
        reason: error.code,
        parentMutationRecommendedBySouth: false
      });

      updateDataset();

      return getVisibleProofPacket();
    }

    try {
      const context = canvas.getContext("2d", {
        alpha: true,
        willReadFrequently: true
      });

      if (!context) throw new Error("Visible proof context unavailable.");

      const width = Math.max(1, Math.round(canvas.width || 1));
      const height = Math.max(1, Math.round(canvas.height || 1));

      const grid = safeNumber(options.grid, 15);
      const sampleGrid = clamp(Math.round(grid), 9, 25);

      const image = context.getImageData(0, 0, width, height);
      const data = image.data;

      let sampleCount = 0;
      let transparentCount = 0;
      let carrierCount = 0;
      let landCount = 0;
      let waterCount = 0;
      let reliefCount = 0;
      let otherCount = 0;
      let planetPixelCount = 0;
      let sum = 0;
      let sumSq = 0;

      const classes = new Set();
      const buckets = new Set();

      const radius = Math.max(1, state.renderRadius || Math.min(width, height) * 0.435);
      const centerX = state.renderCenterX || width * 0.5;
      const centerY = state.renderCenterY || height * 0.5;

      for (let gy = 0; gy < sampleGrid; gy += 1) {
        const y = Math.round(((gy + 0.5) / sampleGrid) * (height - 1));

        for (let gx = 0; gx < sampleGrid; gx += 1) {
          const x = Math.round(((gx + 0.5) / sampleGrid) * (width - 1));
          const dx = (x - centerX) / radius;
          const dy = (y - centerY) / radius;

          if (dx * dx + dy * dy > 1.05) continue;

          const index = (y * width + x) * 4;
          const r = data[index] || 0;
          const g = data[index + 1] || 0;
          const b = data[index + 2] || 0;
          const a = data[index + 3] || 0;

          const cls = pixelClass(r, g, b, a);
          const bucket = colorBucket(r, g, b, a);
          const brightness = (r + g + b) / 3;

          sampleCount += 1;
          sum += brightness;
          sumSq += brightness * brightness;

          if (cls === "transparent") transparentCount += 1;
          else if (cls === "land") landCount += 1;
          else if (cls === "water") waterCount += 1;
          else if (cls === "relief") reliefCount += 1;
          else if (cls === "other") otherCount += 1;
          else carrierCount += 1;

          if (cls !== "transparent" && cls !== "carrier") {
            planetPixelCount += 1;
            classes.add(cls);
          }

          if (bucket !== "transparent") buckets.add(bucket);
        }
      }

      const mean = sampleCount > 0 ? sum / sampleCount : 0;
      const variance = sampleCount > 0
        ? Math.sqrt(Math.max(0, sumSq / sampleCount - mean * mean))
        : 0;

      const metrics = {
        sampleCount,
        transparentCount,
        carrierCount,
        landCount,
        waterCount,
        reliefCount,
        otherCount,
        planetPixelCount,
        varianceScore: Number(variance.toFixed(3)),
        classCount: classes.size,
        colorBucketCount: buckets.size,
        imageRendered: state.imageRendered,
        firstFrameDetected: state.firstFrameDetected,
        sphereProjectionComplete: state.sphereProjectionComplete,
        textureComposeComplete: state.textureComposeComplete,
        textureProofComplete: state.textureProofComplete,
        textureHardFail: state.textureHardFail
      };

      const classified = classifyVisibleContentEvidence(metrics);

      state.visibleContentSampleCount = sampleCount;
      state.visibleContentTransparentSampleCount = transparentCount;
      state.visibleContentCarrierSampleCount = carrierCount;
      state.visibleContentLandSampleCount = landCount;
      state.visibleContentWaterSampleCount = waterCount;
      state.visibleContentReliefSampleCount = reliefCount;
      state.visibleContentOtherSampleCount = otherCount;
      state.visibleContentPlanetPixelCount = planetPixelCount;
      state.visibleContentVarianceScore = Number(variance.toFixed(3));
      state.visibleContentClassCount = classes.size;
      state.visibleContentClasses = Array.from(classes).sort();
      state.visibleContentColorBucketCount = buckets.size;
      state.visibleContentColorBuckets = Array.from(buckets).sort();

      const nonTransparentCount = sampleCount - transparentCount;
      const contentCount = landCount + waterCount + reliefCount + otherCount;
      state.visibleContentNonCarrierRatio = nonTransparentCount > 0 ? Number((contentCount / nonTransparentCount).toFixed(4)) : 0;
      state.visibleContentNonTransparentRatio = sampleCount > 0 ? Number((nonTransparentCount / sampleCount).toFixed(4)) : 0;

      state.visibleContentProof = classified.visibleContentProof;
      state.visibleContentStrictProof = classified.visibleContentStrictProof;
      state.visibleContentSoftGap = classified.visibleContentSoftGap;
      state.visibleContentHardFail = classified.visibleContentHardFail;
      state.visibleForwardProgress = classified.visibleForwardProgress;
      state.visibleContentAdmissible = classified.visibleContentAdmissible;
      state.visiblePlanetAvailable = classified.visiblePlanetAvailable;
      state.carrierOnlyDetected = classified.carrierOnlyDetected;
      state.visibleContentProofMethod = classified.visibleContentProofMethod;
      state.proofBin = classified.proofBin;

      state.f13VisibleEvidenceComplete = classified.f13VisibleEvidenceComplete;
      state.f13VisibleEvidenceAvailable = classified.f13VisibleEvidenceAvailable;
      state.f13VisibleEvidenceStrict = classified.f13VisibleEvidenceStrict;
      state.f13VisibleEvidenceDegraded = classified.f13VisibleEvidenceDegraded;
      state.f13sVisibleProofReady = classified.f13sVisibleProofReady;
      state.f13HardFail = classified.f13HardFail;

      state.currentVisibleProofValid = classified.visibleContentProof === true;
      state.visibleProofStale = false;
      state.staleProofSuppressed = false;
      state.currentVisibleProofAt = nowIso();

      if (classified.visibleContentProof === true) {
        state.lastValidVisibleProofAt = state.currentVisibleProofAt;
      }

      state.nonblankPlanetVisible = state.visiblePlanetAvailable;
      state.planetNotObstructed = state.visiblePlanetAvailable;
      state.firstFailedCoordinate = classified.visibleContentStrictProof
        ? "NONE_F13S_STRICT_VISIBLE_PROOF_CURRENT"
        : classified.visibleContentSoftGap
          ? "WAITING_F13S_STRICT_VISIBLE_PROOF_CURRENT_SOFT_GAP_AVAILABLE"
          : "SOUTH_VISIBLE_PROOF_HARD_FAIL";
      state.recommendedNextFile = classified.visibleContentStrictProof ? PARENT_FILE : FILE;
      state.recommendedNextRenewalTarget = state.recommendedNextFile;
      state.postgameStatus = classified.visibleContentStrictProof
        ? "SOUTH_F13S_STRICT_VISIBLE_PROOF_CURRENT"
        : classified.visibleContentSoftGap
          ? "SOUTH_F13S_SOFT_VISIBLE_PROOF_CURRENT_STRICT_PENDING"
          : "SOUTH_F13S_VISIBLE_PROOF_HARD_FAIL";
      state.updatedAt = state.currentVisibleProofAt;

      stampOutputCanvas(canvas);
      updateDataset();

      recordLocal("SOUTH_VISIBLE_CONTENT_PROOF_SAMPLED_PARENT_ACCLIMATED", {
        sampleCount,
        landCount,
        waterCount,
        reliefCount,
        otherCount,
        carrierCount,
        transparentCount,
        planetPixelCount,
        varianceScore: state.visibleContentVarianceScore,
        classCount: state.visibleContentClassCount,
        colorBucketCount: state.visibleContentColorBucketCount,
        proofBin: state.proofBin,
        method: state.visibleContentProofMethod,
        currentVisibleProofValid: state.currentVisibleProofValid,
        f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
        f13VisibleEvidenceStrict: state.f13VisibleEvidenceStrict,
        f13VisibleEvidenceDegraded: state.f13VisibleEvidenceDegraded,
        f13sVisibleProofReady: state.f13sVisibleProofReady,
        visualPassClaimed: false,
        f21EligibleForNorth: false
      });

      return getVisibleProofPacket();
    } catch (error) {
      state.visibleContentProofError = error && error.message ? error.message : String(error);
      state.visibleContentProof = false;
      state.visibleContentStrictProof = false;
      state.visibleContentSoftGap = state.imageRendered === true && state.sphereProjectionComplete === true;
      state.visibleContentHardFail = !(state.imageRendered === true && state.sphereProjectionComplete === true);
      state.visiblePlanetAvailable = state.imageRendered === true && state.sphereProjectionComplete === true;
      state.visibleForwardProgress = state.visiblePlanetAvailable;
      state.visibleContentAdmissible = state.visiblePlanetAvailable;
      state.currentVisibleProofValid = state.visibleContentSoftGap;
      state.visibleProofStale = false;
      state.proofBin = state.visibleContentSoftGap ? PROOF_BIN.SOFT_GAP : PROOF_BIN.HARD_FAIL;
      state.f13VisibleEvidenceComplete = state.visibleContentSoftGap;
      state.f13VisibleEvidenceAvailable = state.visibleContentSoftGap;
      state.f13VisibleEvidenceStrict = false;
      state.f13VisibleEvidenceDegraded = state.visibleContentSoftGap;
      state.f13sVisibleProofReady = state.visibleContentSoftGap;
      state.f13HardFail = state.visibleContentHardFail;
      state.currentVisibleProofAt = nowIso();
      state.firstFailedCoordinate = state.visibleContentSoftGap
        ? "WAITING_F13S_STRICT_VISIBLE_PROOF_CURRENT_SOFT_GAP_AVAILABLE"
        : "SOUTH_VISIBLE_PROOF_FAILED";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;

      if (state.currentVisibleProofValid) {
        state.lastValidVisibleProofAt = state.currentVisibleProofAt;
      }

      recordError("SOUTH_VISIBLE_PROOF_FAILED", error);

      updateDataset();
      return getVisibleProofPacket();
    }
  }

  function sampleVisibleProof(options = {}) {
    return sampleVisibleContent(options);
  }

  function getVisibleProofPacket() {
    deriveReadiness();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,

      activeFibonacci: state.activeFibonacci,
      activeFibonacciRank: state.activeFibonacciRank,
      activeFibonacciGate: state.activeFibonacciGate,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,

      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      visibleContentProofMethod: state.visibleContentProofMethod,
      visibleContentProofError: state.visibleContentProofError,
      visibleContentSampleCount: state.visibleContentSampleCount,
      visibleContentVarianceScore: state.visibleContentVarianceScore,
      visibleContentClassCount: state.visibleContentClassCount,
      visibleContentClasses: state.visibleContentClasses.slice(),
      visibleContentColorBucketCount: state.visibleContentColorBucketCount,
      visibleContentColorBuckets: state.visibleContentColorBuckets.slice(),
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentReliefSampleCount: state.visibleContentReliefSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      visibleContentCarrierSampleCount: state.visibleContentCarrierSampleCount,
      visibleContentTransparentSampleCount: state.visibleContentTransparentSampleCount,
      visibleContentPlanetPixelCount: state.visibleContentPlanetPixelCount,
      visibleContentNonCarrierRatio: state.visibleContentNonCarrierRatio,
      visibleContentNonTransparentRatio: state.visibleContentNonTransparentRatio,
      carrierOnlyDetected: state.carrierOnlyDetected,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,
      proofBin: state.proofBin,
      currentVisibleProofValid: state.currentVisibleProofValid,
      currentVisibleProofAt: state.currentVisibleProofAt,
      lastValidVisibleProofAt: state.lastValidVisibleProofAt,
      visibleProofStale: state.visibleProofStale,
      staleProofSuppressed: state.staleProofSuppressed,

      visibleProofReady: state.visibleProofReady,
      southGateReady: state.southGateReady,
      canvasSouthApiReady: state.canvasSouthApiReady,
      canvasSouthEvidenceReady: state.canvasSouthEvidenceReady,
      canvasSouthReady: state.canvasSouthReady,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13VisibleEvidenceStrict: state.f13VisibleEvidenceStrict,
      f13VisibleEvidenceDegraded: state.f13VisibleEvidenceDegraded,
      f13sVisibleProofReady: state.f13sVisibleProofReady,
      f13VisibleEvidenceComplete: state.f13VisibleEvidenceComplete,
      f13HardFail: state.f13HardFail,

      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21: state.newsGateDegradedBeforeF21,

      strictVisibleProofClassifierActive: true,
      strictProofDoesNotRequireNamedLandWaterBalance: true,
      strictProofRequiresRenderedSphereSurfaceSignal: true,
      degradedProofRemainsAvailableForForwardProgress: true,

      visibleContentProofDoesNotMeanFinalVisualPass: true,
      f13VisibleEvidenceDoesNotMeanF21: true,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21LatchMode: "north-only",
      f21ClaimedByCanvasSouth: false,
      visualPassClaimed: false
    };
  }

  function invalidateTexture(reason = "south-texture-invalidation") {
    state.textureInvalidationCount += 1;
    state.textureInvalidated = true;
    state.textureInvalidationReason = String(reason || "south-texture-invalidation");
    state.textureRebuildRequested = false;
    state.textureRebuildComplete = false;
    state.textureRebuildError = "";
    state.textureComposeComplete = false;
    state.textureProofComplete = false;
    state.textureHardFail = false;
    state.textureComposeProgress = 0;

    state.firstFrameDetected = false;
    state.imageRendered = false;
    state.renderedAfterTexture = false;
    state.renderedFromCachedTexture = false;
    state.planetFramePainted = false;
    state.nonblankPlanetVisible = false;
    state.planetNotObstructed = false;
    state.visiblePlanetAvailable = false;
    state.sphereProjectionComplete = false;
    state.renderFrameStale = true;
    state.visibleProofStale = true;
    state.currentVisibleProofValid = false;
    state.staleProofSuppressed = true;

    clearCurrentProof("texture-invalidated-current-proof-cleared");

    state.textureReady = false;
    state.renderReady = false;
    state.visibleProofReady = false;
    state.southGateReady = false;
    state.canvasSouthEvidenceReady = false;
    state.canvasSouthReady = false;
    state.f13VisibleEvidenceAvailable = false;
    state.f13VisibleEvidenceStrict = false;
    state.f13VisibleEvidenceDegraded = false;
    state.f13sVisibleProofReady = false;
    state.f13VisibleEvidenceComplete = false;
    state.f13ProofBodyAvailable = false;
    state.firstFailedCoordinate = "SOUTH_TEXTURE_INVALIDATED_CURRENT_PROOF_SUPPRESSED";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;
    state.postgameStatus = "SOUTH_TEXTURE_INVALIDATED_CURRENT_PROOF_SUPPRESSED";
    state.updatedAt = nowIso();

    recordLocal("SOUTH_TEXTURE_INVALIDATED_PARENT_ACCLIMATED", {
      reason: state.textureInvalidationReason,
      textureInvalidationCount: state.textureInvalidationCount,
      renderFrameStale: true,
      visibleProofStale: true,
      currentVisibleProofValid: false,
      f13VisibleEvidenceAvailable: false,
      f13VisibleEvidenceStrict: false,
      f13sVisibleProofReady: false,
      visualPassClaimed: false,
      f21EligibleForNorth: false
    });

    updateDataset();

    return getReceipt();
  }

  function deriveReadiness() {
    const apiReady = Boolean(
      isFunction(composeTexture) &&
      isFunction(renderSphere) &&
      isFunction(renderSphereSync) &&
      isFunction(getTextureCanvas) &&
      isFunction(sampleVisibleContent) &&
      isFunction(classifyVisibleContentEvidence) &&
      isFunction(invalidateTexture) &&
      isFunction(getReceipt) &&
      isFunction(getReceiptText)
    );

    const textureReady = Boolean(
      state.textureComposeComplete &&
      state.textureProofComplete &&
      !state.textureHardFail &&
      !state.textureInvalidated
    );

    const renderReady = Boolean(
      state.imageRendered &&
      state.firstFrameDetected &&
      state.sphereProjectionComplete &&
      !state.renderHardFail &&
      !state.renderFrameStale
    );

    const visibleProofReady = Boolean(
      state.currentVisibleProofValid &&
      !state.visibleProofStale
    );

    const strictEvidence = Boolean(
      state.visibleContentStrictProof &&
      state.currentVisibleProofValid &&
      !state.visibleProofStale
    );

    const degradedEvidence = Boolean(
      !strictEvidence &&
      state.visibleContentSoftGap &&
      state.currentVisibleProofValid &&
      !state.visibleProofStale
    );

    const availableEvidence = Boolean(strictEvidence || degradedEvidence);

    const evidenceReady = Boolean(
      textureReady &&
      renderReady &&
      visibleProofReady &&
      availableEvidence
    );

    state.canvasSouthApiReady = apiReady;
    state.canvasSouthEvidenceReady = evidenceReady;
    state.canvasSouthReady = Boolean(apiReady && evidenceReady);

    state.textureReady = textureReady;
    state.renderReady = renderReady;
    state.visibleProofReady = visibleProofReady;
    state.southGateReady = evidenceReady;

    state.f13ProofBodyAvailable = evidenceReady;
    state.f13VisibleEvidenceAvailable = availableEvidence;
    state.f13VisibleEvidenceStrict = strictEvidence;
    state.f13VisibleEvidenceDegraded = degradedEvidence;
    state.f13sVisibleProofReady = availableEvidence;
    state.f13VisibleEvidenceComplete = availableEvidence;
    state.f13HardFail = Boolean(state.visibleContentHardFail || state.textureHardFail || state.renderHardFail);

    state.northGateReady = false;
    state.eastGateReady = false;
    state.westGateReady = false;
    state.canvasGateReady = false;

    state.newsGatePassedBeforeF21 = Boolean(strictEvidence);
    state.newsGateDegradedBeforeF21 = Boolean(!strictEvidence && degradedEvidence);

    state.f8SelfDutySatisfied = false;
    state.f13InspectEvidenceAvailable = false;
    state.f21EligibleForNorth = false;
    state.f21SubmittedToNorth = false;
    state.f21LatchMode = "north-only";

    state.generatedImage = false;
    state.graphicBox = false;
    state.webGL = false;
    state.visualPassClaimed = false;
    state.f21ClaimedByCanvasSouth = false;
    state.readyTextClaimedByCanvasSouth = false;
    state.parentMutationRecommendedBySouth = false;

    return {
      canvasSouthApiReady: apiReady,
      canvasSouthEvidenceReady: evidenceReady,
      canvasSouthReady: state.canvasSouthReady,
      textureReady,
      renderReady,
      visibleProofReady,
      southGateReady: evidenceReady,
      f13ProofBodyAvailable: state.f13ProofBodyAvailable,
      f13VisibleEvidenceAvailable: availableEvidence,
      f13VisibleEvidenceStrict: strictEvidence,
      f13VisibleEvidenceDegraded: degradedEvidence,
      f13sVisibleProofReady: state.f13sVisibleProofReady,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21: state.newsGateDegradedBeforeF21
    };
  }

  function stampTextureCanvas(canvas) {
    if (!canvas || !canvas.dataset) return;

    deriveReadiness();

    canvas.dataset.hearthCanvasSouthTexture = "true";
    canvas.dataset.hearthCanvasSouthContract = CONTRACT;
    canvas.dataset.hearthCanvasSouthReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSouthRole = state.role;

    canvas.dataset.hearthCanvasSouthParentAuthorityRule = state.parentAuthorityRule;
    canvas.dataset.hearthCanvasSouthDownstreamAcclimationRule = state.downstreamAcclimationRule;
    canvas.dataset.hearthCanvasSouthParentMutationRecommended = "false";

    canvas.dataset.hearthCanvasSouthActiveFibonacci = String(state.activeFibonacci);
    canvas.dataset.hearthCanvasSouthActiveFibonacciRank = state.activeFibonacciRank;
    canvas.dataset.hearthCanvasSouthActiveFibonacciGate = state.activeFibonacciGate;
    canvas.dataset.hearthCanvasSouthActiveStageId = state.activeStageId;
    canvas.dataset.hearthCanvasSouthActiveGearId = state.activeGearId;

    canvas.dataset.hearthCanvasSouthTransistorRole = "drain";
    canvas.dataset.hearthCanvasSouthTextureReady = String(state.textureReady);
    canvas.dataset.hearthCanvasSouthTextureComposeComplete = String(state.textureComposeComplete);
    canvas.dataset.hearthCanvasSouthTextureProofComplete = String(state.textureProofComplete);
    canvas.dataset.hearthCanvasSouthTextureHardFail = String(state.textureHardFail);
    canvas.dataset.hearthCanvasSouthTextureInvalidated = String(state.textureInvalidated);

    canvas.dataset.hearthCanvasSouthApiReady = String(state.canvasSouthApiReady);
    canvas.dataset.hearthCanvasSouthEvidenceReady = String(state.canvasSouthEvidenceReady);
    canvas.dataset.hearthCanvasSouthReady = String(state.canvasSouthReady);

    canvas.dataset.hearthCanvasSouthF13VisibleEvidenceAvailable = String(state.f13VisibleEvidenceAvailable);
    canvas.dataset.hearthCanvasSouthF13VisibleEvidenceStrict = String(state.f13VisibleEvidenceStrict);
    canvas.dataset.hearthCanvasSouthF13VisibleEvidenceDegraded = String(state.f13VisibleEvidenceDegraded);
    canvas.dataset.hearthCanvasSouthF13SVisibleProofReady = String(state.f13sVisibleProofReady);

    canvas.dataset.hearthCanvasSouthStrictVisibleProofClassifierActive = "true";
    canvas.dataset.hearthCanvasSouthOwnsPlanetTruth = "false";
    canvas.dataset.hearthCanvasSouthOwnsF21 = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";
  }

  function stampOutputCanvas(canvas) {
    if (!canvas || !canvas.dataset) return;

    deriveReadiness();

    canvas.dataset.hearthCanvasSouthRendered = String(state.imageRendered);
    canvas.dataset.hearthCanvasSouthContract = CONTRACT;
    canvas.dataset.hearthCanvasSouthReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSouthSphereProjectionComplete = String(state.sphereProjectionComplete);
    canvas.dataset.hearthCanvasSouthRenderReady = String(state.renderReady);
    canvas.dataset.hearthCanvasSouthRenderHardFail = String(state.renderHardFail);
    canvas.dataset.hearthCanvasSouthRenderFrameStale = String(state.renderFrameStale);

    canvas.dataset.hearthCanvasSouthApiReady = String(state.canvasSouthApiReady);
    canvas.dataset.hearthCanvasSouthEvidenceReady = String(state.canvasSouthEvidenceReady);
    canvas.dataset.hearthCanvasSouthReady = String(state.canvasSouthReady);

    canvas.dataset.hearthCanvasSouthVisibleProofReady = String(state.visibleProofReady);
    canvas.dataset.hearthCanvasSouthVisibleProof = String(state.visibleContentProof);
    canvas.dataset.hearthCanvasSouthVisibleStrictProof = String(state.visibleContentStrictProof);
    canvas.dataset.hearthCanvasSouthVisibleSoftGap = String(state.visibleContentSoftGap);
    canvas.dataset.hearthCanvasSouthVisibleHardFail = String(state.visibleContentHardFail);
    canvas.dataset.hearthCanvasSouthCurrentVisibleProofValid = String(state.currentVisibleProofValid);
    canvas.dataset.hearthCanvasSouthVisibleProofStale = String(state.visibleProofStale);
    canvas.dataset.hearthCanvasSouthProofBin = state.proofBin;

    canvas.dataset.hearthCanvasSouthSouthGateReady = String(state.southGateReady);
    canvas.dataset.hearthCanvasSouthF13VisibleEvidenceAvailable = String(state.f13VisibleEvidenceAvailable);
    canvas.dataset.hearthCanvasSouthF13VisibleEvidenceStrict = String(state.f13VisibleEvidenceStrict);
    canvas.dataset.hearthCanvasSouthF13VisibleEvidenceDegraded = String(state.f13VisibleEvidenceDegraded);
    canvas.dataset.hearthCanvasSouthF13SVisibleProofReady = String(state.f13sVisibleProofReady);

    canvas.dataset.hearthCanvasSouthNewsGatePassedBeforeF21 = String(state.newsGatePassedBeforeF21);
    canvas.dataset.hearthCanvasSouthNewsGateDegradedBeforeF21 = String(state.newsGateDegradedBeforeF21);

    canvas.dataset.hearthCanvasSouthImageRenderedMeansFrameDrawnOnly = "true";
    canvas.dataset.hearthCanvasSouthImageRenderedDoesNotMeanVisualPass = "true";
    canvas.dataset.hearthCanvasSouthImageRenderedDoesNotMeanF21 = "true";

    canvas.dataset.hearthCanvasSouthOwnsPlanetTruth = "false";
    canvas.dataset.hearthCanvasSouthOwnsF21 = "false";
    canvas.dataset.visualPassClaimed = "false";
  }

  function getHeldPacket(reason = state.firstFailedCoordinate) {
    deriveReadiness();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      parentFile: PARENT_FILE,
      action: "HELD",
      reason,
      firstFailedCoordinate: reason,
      recommendedNextFile: FILE,
      recommendedNextRenewalTarget: FILE,
      parentMutationRecommendedBySouth: false,
      parentAuthorityRule: state.parentAuthorityRule,
      downstreamAcclimationRule: state.downstreamAcclimationRule,
      canvasSouthApiReady: state.canvasSouthApiReady,
      canvasSouthEvidenceReady: state.canvasSouthEvidenceReady,
      canvasSouthReady: state.canvasSouthReady,
      textureReady: state.textureReady,
      renderReady: state.renderReady,
      visibleProofReady: state.visibleProofReady,
      f13VisibleEvidenceAvailable: false,
      f13VisibleEvidenceStrict: false,
      f13VisibleEvidenceDegraded: false,
      f13sVisibleProofReady: false,
      f21EligibleForNorth: false,
      f21ClaimedByCanvasSouth: false,
      readyTextClaimedByCanvasSouth: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      receiptPacket: getReceipt()
    };
  }

  function getSouthReceipt() {
    return getReceipt();
  }

  function getRenderReceipt() {
    return getReceipt();
  }

  function getReceipt() {
    const readiness = deriveReadiness();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      parentFile: PARENT_FILE,
      eastFile: EAST_FILE,
      westFile: WEST_FILE,
      role: state.role,

      parentAuthorityRule: state.parentAuthorityRule,
      downstreamAcclimationRule: state.downstreamAcclimationRule,
      parentMutationRecommendedBySouth: false,
      parentContractInformationalOnly: true,
      parentStructuralCarrierTruthOwnedByParent: true,
      currentParentContextAccepted: true,
      activeParentContextContracts: ACTIVE_PARENT_CONTEXT_CONTRACTS.slice(),

      newsProtocolSynchronized: true,
      northGateReady: state.northGateReady,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      canvasGateReady: state.canvasGateReady,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21: state.newsGateDegradedBeforeF21,

      macroCycle1: state.macroCycle1,
      macroCycle2: state.macroCycle2,
      canvasChildSequence: state.canvasChildSequence,
      canvasSouthMacroSouth: false,
      canvasSouthChildSouth: true,
      canvasSouthDoesNotAuthorizeCanvasRelease: true,
      canvasSouthDoesNotLatchF21: true,

      fibonacciAlignmentSynchronized: true,
      activeFibonacci: state.activeFibonacci,
      activeFibonacciRank: state.activeFibonacciRank,
      activeFibonacciGate: state.activeFibonacciGate,
      parentFibonacciGate: state.parentFibonacciGate,
      futureFibonacciGate: state.futureFibonacciGate,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      oneActiveGearAtATime: true,
      f8SelfDutySatisfied: false,
      f13ProofBodyAvailable: state.f13ProofBodyAvailable,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13VisibleEvidenceStrict: state.f13VisibleEvidenceStrict,
      f13VisibleEvidenceDegraded: state.f13VisibleEvidenceDegraded,
      f13InspectEvidenceAvailable: false,
      f13sVisibleProofReady: state.f13sVisibleProofReady,
      f13VisibleEvidenceComplete: state.f13VisibleEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21LatchMode: "north-only",

      canvasSouthLoaded: true,
      canvasSouthActive: true,
      canvasSouthApiReady: readiness.canvasSouthApiReady,
      canvasSouthEvidenceReady: readiness.canvasSouthEvidenceReady,
      canvasSouthReady: readiness.canvasSouthReady,
      textureReady: state.textureReady,
      renderReady: state.renderReady,
      visibleProofReady: state.visibleProofReady,
      southGateReady: state.southGateReady,

      sourceResolutionActive: true,
      sourceCandidatePaths: SOURCE_CANDIDATE_PATHS.slice(),
      sourceCanvasResolved: state.sourceCanvasResolved,
      sourceCanvasResolutionPath: state.sourceCanvasResolutionPath,
      sourceCanvasResolutionReason: state.sourceCanvasResolutionReason,
      sourcePacketAccepted: state.sourcePacketAccepted,
      parentPacketAccepted: state.parentPacketAccepted,
      releasePacketAccepted: state.releasePacketAccepted,
      eastAtlasPacketAccepted: state.eastAtlasPacketAccepted,
      cachedTextureAccepted: state.cachedTextureAccepted,

      splitAdapterRole: "SOUTH",
      splitAdapterTransistorMode: true,
      transistorAdapterActive: true,
      transistorRole: "drain",
      transistorDrainRole: state.transistorDrainRole,
      transistorSourcePeer: state.transistorSourcePeer,
      transistorControlPeer: state.transistorControlPeer,
      transistorGateParent: state.transistorGateParent,
      transistorCurrentFlow: state.transistorCurrentFlow,
      splitAdapterParentAligned: true,
      fatalErrorBoundaryActive: true,

      textureCanvasAvailable: Boolean(state.textureCanvas),
      textureWidth: state.textureWidth,
      textureHeight: state.textureHeight,
      textureSourceContract: state.textureSourceContract,
      textureSourceReceipt: state.textureSourceReceipt,
      textureSourceWidth: state.textureSourceWidth,
      textureSourceHeight: state.textureSourceHeight,
      textureSourcePath: state.textureSourcePath,

      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,
      textureProofComplete: state.textureProofComplete,
      textureHardFail: state.textureHardFail,
      textureComposeStartedAt: state.textureComposeStartedAt,
      textureComposeCompletedAt: state.textureComposeCompletedAt,
      textureComposeElapsedMs: state.textureComposeElapsedMs,
      textureComposeYieldCount: state.textureComposeYieldCount,
      textureComposeError: state.textureComposeError,
      currentTextureProofAt: state.currentTextureProofAt,

      textureInvalidated: state.textureInvalidated,
      textureInvalidationReason: state.textureInvalidationReason,
      textureInvalidationCount: state.textureInvalidationCount,
      textureRebuildRequested: state.textureRebuildRequested,
      textureRebuildComplete: state.textureRebuildComplete,
      textureRebuildError: state.textureRebuildError,

      firstFrameRequested: state.firstFrameRequested,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      imageRenderedMeansFrameDrawnOnly: true,
      imageRenderedDoesNotMeanVisualPass: true,
      imageRenderedDoesNotMeanF21: true,
      renderedAfterTexture: state.renderedAfterTexture,
      renderedFromCachedTexture: state.renderedFromCachedTexture,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,

      renderStarted: state.renderStarted,
      renderProgress: state.renderProgress,
      renderFrameCount: state.renderFrameCount,
      renderStartedAt: state.renderStartedAt,
      renderCompletedAt: state.renderCompletedAt,
      renderElapsedMs: state.renderElapsedMs,
      renderYieldCount: state.renderYieldCount,
      renderError: state.renderError,
      renderHardFail: state.renderHardFail,
      renderFrameStale: state.renderFrameStale,
      sphereProjectionComplete: state.sphereProjectionComplete,
      currentSphereProofAt: state.currentSphereProofAt,

      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      renderRadius: state.renderRadius,
      renderCenterX: state.renderCenterX,
      renderCenterY: state.renderCenterY,
      lastYaw: state.lastYaw,
      lastPitch: state.lastPitch,
      lastZoom: state.lastZoom,

      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      visibleContentProofMethod: state.visibleContentProofMethod,
      visibleContentProofError: state.visibleContentProofError,
      visibleContentSampleCount: state.visibleContentSampleCount,
      visibleContentVarianceScore: state.visibleContentVarianceScore,
      visibleContentClassCount: state.visibleContentClassCount,
      visibleContentClasses: state.visibleContentClasses.slice(),
      visibleContentColorBucketCount: state.visibleContentColorBucketCount,
      visibleContentColorBuckets: state.visibleContentColorBuckets.slice(),
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentReliefSampleCount: state.visibleContentReliefSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      visibleContentCarrierSampleCount: state.visibleContentCarrierSampleCount,
      visibleContentTransparentSampleCount: state.visibleContentTransparentSampleCount,
      visibleContentPlanetPixelCount: state.visibleContentPlanetPixelCount,
      visibleContentNonCarrierRatio: state.visibleContentNonCarrierRatio,
      visibleContentNonTransparentRatio: state.visibleContentNonTransparentRatio,
      carrierOnlyDetected: state.carrierOnlyDetected,
      visibleContentProofDoesNotMeanFinalVisualPass: true,
      f13VisibleEvidenceDoesNotMeanF21: true,

      proofBin: state.proofBin,
      currentVisibleProofValid: state.currentVisibleProofValid,
      currentVisibleProofAt: state.currentVisibleProofAt,
      lastValidVisibleProofAt: state.lastValidVisibleProofAt,
      visibleProofStale: state.visibleProofStale,
      staleProofSuppressed: state.staleProofSuppressed,

      clarityRenewalActive: true,
      hazeReduced: true,
      highDpiCanvasActive: true,
      sourceColorDemotedToPaletteInfluence: true,
      elevationControlsLandShape: true,
      hydrologyControlsWaterShape: true,
      coastlineContrastActive: true,
      centerDarknessReduced: true,
      lightingPreservesSurfaceReadability: true,
      staleSourceMaskProtectionActive: true,
      strictVisibleProofClassifierActive: true,
      strictProofDoesNotRequireNamedLandWaterBalance: true,
      strictProofRequiresRenderedSphereSurfaceSignal: true,
      degradedProofRemainsAvailableForForwardProgress: true,

      ownsTextureComposition: true,
      ownsSphereRendering: true,
      ownsVisibleProof: true,
      ownsCanvasSouthOutput: true,
      ownsAtlasSource: false,
      ownsAtlasFormation: false,
      ownsSourceIntake: false,
      ownsDragInspection: false,
      ownsZoomInspection: false,
      ownsInspectionControl: false,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsRuntimeTableGovernance: false,
      ownsRouteReadiness: false,
      ownsCanvasParentBoot: false,
      ownsCanvasRelease: false,
      ownsWestAudit: false,
      ownsReadyText: false,
      ownsF21: false,
      ownsFinalVisualPassClaim: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      designRules: [
        "upstream parent files already judged doable are authority",
        "south acclimates to parent handoff instead of forcing parent renewal",
        "parent contract identity is informative, not an exclusive south gate",
        "south owns F13S texture composition from East atlas",
        "south owns visible 2D sphere rendering from cached texture",
        "south owns visible-content proof classification",
        "API readiness is not evidence readiness",
        "canvasSouthReady requires API plus current evidence",
        "NEWS degraded is not true on boot",
        "strict proof supersedes soft proof",
        "soft proof supersedes hard fail",
        "stale proof suppresses current proof",
        "lastValidVisibleProofAt is historical only",
        "imageRendered means frame drawn only",
        "imageRendered does not mean final visual pass",
        "imageRendered does not mean F21",
        "visibleContentProof does not mean final visual pass",
        "F13 visible evidence does not mean F21",
        "south does not own source intake",
        "south does not own atlas formation",
        "south does not own drag or zoom control",
        "south does not own planet truth",
        "south does not own material truth",
        "south does not own hydrology truth",
        "south does not own runtime governance",
        "south does not claim F21",
        "south does not claim final visual pass"
      ],

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      f21ClaimedByCanvasSouth: false,
      readyTextClaimedByCanvasSouth: false,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const errors = r.errors.length
      ? r.errors.map((item) => `- ${item.at} :: ${item.code} :: ${item.message}`).join("\n")
      : "- none";

    const events = r.localEvents.length
      ? r.localEvents.slice(-40).map((item) => `- ${item.at} :: ${item.event}`).join("\n")
      : "- none";

    return [
      "HEARTH_CANVAS_SOUTH_PARENT_ACCLIMATED_F13S_VISIBLE_PROOF_CHILD_RECEIPT",
      "",
      "IDENTITY",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      "PARENT_ACCLIMATION",
      `parentAuthorityRule=${r.parentAuthorityRule}`,
      `downstreamAcclimationRule=${r.downstreamAcclimationRule}`,
      `parentMutationRecommendedBySouth=${r.parentMutationRecommendedBySouth}`,
      `parentContractInformationalOnly=${r.parentContractInformationalOnly}`,
      `parentStructuralCarrierTruthOwnedByParent=${r.parentStructuralCarrierTruthOwnedByParent}`,
      "",
      "NEWS",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `northGateReady=${r.northGateReady}`,
      `eastGateReady=${r.eastGateReady}`,
      `westGateReady=${r.westGateReady}`,
      `southGateReady=${r.southGateReady}`,
      `canvasGateReady=${r.canvasGateReady}`,
      `newsGatePassedBeforeF21=${r.newsGatePassedBeforeF21}`,
      `newsGateDegradedBeforeF21=${r.newsGateDegradedBeforeF21}`,
      "",
      "FIBONACCI",
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `parentFibonacciGate=${r.parentFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `activeStageId=${r.activeStageId}`,
      `activeGearId=${r.activeGearId}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `f13VisibleEvidenceAvailable=${r.f13VisibleEvidenceAvailable}`,
      `f13VisibleEvidenceStrict=${r.f13VisibleEvidenceStrict}`,
      `f13VisibleEvidenceDegraded=${r.f13VisibleEvidenceDegraded}`,
      `f13sVisibleProofReady=${r.f13sVisibleProofReady}`,
      "",
      "READINESS_SPLIT",
      `canvasSouthApiReady=${r.canvasSouthApiReady}`,
      `canvasSouthEvidenceReady=${r.canvasSouthEvidenceReady}`,
      `canvasSouthReady=${r.canvasSouthReady}`,
      `textureReady=${r.textureReady}`,
      `renderReady=${r.renderReady}`,
      `visibleProofReady=${r.visibleProofReady}`,
      "",
      "SOURCE_RESOLUTION",
      `sourceCanvasResolved=${r.sourceCanvasResolved}`,
      `sourceCanvasResolutionPath=${r.sourceCanvasResolutionPath}`,
      `sourceCanvasResolutionReason=${r.sourceCanvasResolutionReason}`,
      `sourcePacketAccepted=${r.sourcePacketAccepted}`,
      `parentPacketAccepted=${r.parentPacketAccepted}`,
      `releasePacketAccepted=${r.releasePacketAccepted}`,
      `eastAtlasPacketAccepted=${r.eastAtlasPacketAccepted}`,
      `cachedTextureAccepted=${r.cachedTextureAccepted}`,
      "",
      "TEXTURE",
      `textureCanvasAvailable=${r.textureCanvasAvailable}`,
      `textureWidth=${r.textureWidth}`,
      `textureHeight=${r.textureHeight}`,
      `textureSourceContract=${r.textureSourceContract}`,
      `textureSourceReceipt=${r.textureSourceReceipt}`,
      `textureSourcePath=${r.textureSourcePath}`,
      `textureComposeStarted=${r.textureComposeStarted}`,
      `textureComposeProgress=${r.textureComposeProgress}`,
      `textureComposeComplete=${r.textureComposeComplete}`,
      `textureProofComplete=${r.textureProofComplete}`,
      `textureHardFail=${r.textureHardFail}`,
      `textureInvalidated=${r.textureInvalidated}`,
      `textureInvalidationReason=${r.textureInvalidationReason}`,
      `textureInvalidationCount=${r.textureInvalidationCount}`,
      "",
      "RENDER",
      `firstFrameRequested=${r.firstFrameRequested}`,
      `firstFrameDetected=${r.firstFrameDetected}`,
      `imageRendered=${r.imageRendered}`,
      `imageRenderedMeansFrameDrawnOnly=${r.imageRenderedMeansFrameDrawnOnly}`,
      `imageRenderedDoesNotMeanVisualPass=${r.imageRenderedDoesNotMeanVisualPass}`,
      `imageRenderedDoesNotMeanF21=${r.imageRenderedDoesNotMeanF21}`,
      `renderedAfterTexture=${r.renderedAfterTexture}`,
      `renderedFromCachedTexture=${r.renderedFromCachedTexture}`,
      `sphereProjectionComplete=${r.sphereProjectionComplete}`,
      `renderHardFail=${r.renderHardFail}`,
      `renderFrameStale=${r.renderFrameStale}`,
      `planetFramePainted=${r.planetFramePainted}`,
      `nonblankPlanetVisible=${r.nonblankPlanetVisible}`,
      `planetNotObstructed=${r.planetNotObstructed}`,
      `renderFrameCount=${r.renderFrameCount}`,
      "",
      "VISIBLE_PROOF",
      `visibleContentProofStarted=${r.visibleContentProofStarted}`,
      `visibleContentProof=${r.visibleContentProof}`,
      `visibleContentStrictProof=${r.visibleContentStrictProof}`,
      `visibleContentSoftGap=${r.visibleContentSoftGap}`,
      `visibleContentHardFail=${r.visibleContentHardFail}`,
      `visiblePlanetAvailable=${r.visiblePlanetAvailable}`,
      `visibleContentVarianceScore=${r.visibleContentVarianceScore}`,
      `visibleContentClassCount=${r.visibleContentClassCount}`,
      `visibleContentClasses=${r.visibleContentClasses.join(",")}`,
      `visibleContentColorBucketCount=${r.visibleContentColorBucketCount}`,
      `visibleContentColorBuckets=${r.visibleContentColorBuckets.join(",")}`,
      `visibleContentPlanetPixelCount=${r.visibleContentPlanetPixelCount}`,
      `visibleContentNonCarrierRatio=${r.visibleContentNonCarrierRatio}`,
      `visibleContentNonTransparentRatio=${r.visibleContentNonTransparentRatio}`,
      `proofBin=${r.proofBin}`,
      `currentVisibleProofValid=${r.currentVisibleProofValid}`,
      `visibleProofStale=${r.visibleProofStale}`,
      `staleProofSuppressed=${r.staleProofSuppressed}`,
      `currentVisibleProofAt=${r.currentVisibleProofAt}`,
      `lastValidVisibleProofAt=${r.lastValidVisibleProofAt}`,
      "",
      "STRICT_CLASSIFIER",
      `strictVisibleProofClassifierActive=${r.strictVisibleProofClassifierActive}`,
      `strictProofDoesNotRequireNamedLandWaterBalance=${r.strictProofDoesNotRequireNamedLandWaterBalance}`,
      `strictProofRequiresRenderedSphereSurfaceSignal=${r.strictProofRequiresRenderedSphereSurfaceSignal}`,
      `degradedProofRemainsAvailableForForwardProgress=${r.degradedProofRemainsAvailableForForwardProgress}`,
      "",
      "OWNERSHIP_BOUNDARY",
      `ownsTextureComposition=${r.ownsTextureComposition}`,
      `ownsSphereRendering=${r.ownsSphereRendering}`,
      `ownsVisibleProof=${r.ownsVisibleProof}`,
      `ownsCanvasSouthOutput=${r.ownsCanvasSouthOutput}`,
      `ownsAtlasSource=${r.ownsAtlasSource}`,
      `ownsAtlasFormation=${r.ownsAtlasFormation}`,
      `ownsSourceIntake=${r.ownsSourceIntake}`,
      `ownsDragInspection=${r.ownsDragInspection}`,
      `ownsZoomInspection=${r.ownsZoomInspection}`,
      `ownsInspectionControl=${r.ownsInspectionControl}`,
      `ownsPlanetTruth=${r.ownsPlanetTruth}`,
      `ownsMaterialTruth=${r.ownsMaterialTruth}`,
      `ownsHydrologyTruth=${r.ownsHydrologyTruth}`,
      `ownsElevationTruth=${r.ownsElevationTruth}`,
      `ownsRuntimeTableGovernance=${r.ownsRuntimeTableGovernance}`,
      `ownsRouteReadiness=${r.ownsRouteReadiness}`,
      `ownsCanvasParentBoot=${r.ownsCanvasParentBoot}`,
      `ownsCanvasRelease=${r.ownsCanvasRelease}`,
      `ownsWestAudit=${r.ownsWestAudit}`,
      `ownsReadyText=${r.ownsReadyText}`,
      `ownsF21=${r.ownsF21}`,
      `ownsFinalVisualPassClaim=${r.ownsFinalVisualPassClaim}`,
      "",
      "F21_BOUNDARY",
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21SubmittedToNorth=${r.f21SubmittedToNorth}`,
      `f21LatchMode=${r.f21LatchMode}`,
      `f21ClaimedByCanvasSouth=${r.f21ClaimedByCanvasSouth}`,
      `readyTextClaimedByCanvasSouth=${r.readyTextClaimedByCanvasSouth}`,
      "",
      "NEXT",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `postgameStatus=${r.postgameStatus}`,
      "",
      "LOCAL_EVENTS",
      events,
      "",
      "ERRORS",
      errors,
      "",
      "FINAL_CLAIMS",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset() {
    deriveReadiness();

    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasSouthLoaded = "true";
    dataset.hearthCanvasSouthContract = CONTRACT;
    dataset.hearthCanvasSouthReceipt = RECEIPT;
    dataset.hearthCanvasSouthPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasSouthBaselineContract = BASELINE_CONTRACT;
    dataset.hearthCanvasSouthVersion = VERSION;
    dataset.hearthCanvasSouthFile = FILE;
    dataset.hearthCanvasSouthRole = state.role;

    dataset.hearthCanvasSouthParentAuthorityRule = state.parentAuthorityRule;
    dataset.hearthCanvasSouthDownstreamAcclimationRule = state.downstreamAcclimationRule;
    dataset.hearthCanvasSouthParentMutationRecommendedBySouth = "false";
    dataset.hearthCanvasSouthParentContractInformationalOnly = "true";
    dataset.hearthCanvasSouthParentStructuralCarrierTruthOwnedByParent = "true";

    dataset.hearthCanvasSouthNewsProtocolSynchronized = "true";
    dataset.hearthCanvasSouthNorthGateReady = String(state.northGateReady);
    dataset.hearthCanvasSouthEastGateReady = String(state.eastGateReady);
    dataset.hearthCanvasSouthWestGateReady = String(state.westGateReady);
    dataset.hearthCanvasSouthSouthGateReady = String(state.southGateReady);
    dataset.hearthCanvasSouthCanvasGateReady = String(state.canvasGateReady);
    dataset.hearthCanvasSouthNewsGatePassedBeforeF21 = String(state.newsGatePassedBeforeF21);
    dataset.hearthCanvasSouthNewsGateDegradedBeforeF21 = String(state.newsGateDegradedBeforeF21);

    dataset.hearthCanvasSouthMacroCycle1 = state.macroCycle1;
    dataset.hearthCanvasSouthMacroCycle2 = state.macroCycle2;
    dataset.hearthCanvasSouthCanvasChildSequence = state.canvasChildSequence;
    dataset.hearthCanvasSouthMacroSouth = String(state.canvasSouthMacroSouth);
    dataset.hearthCanvasSouthChildSouth = String(state.canvasSouthChildSouth);
    dataset.hearthCanvasSouthDoesNotAuthorizeCanvasRelease = String(state.canvasSouthDoesNotAuthorizeCanvasRelease);
    dataset.hearthCanvasSouthDoesNotLatchF21 = String(state.canvasSouthDoesNotLatchF21);

    dataset.hearthCanvasSouthFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasSouthActiveFibonacci = String(state.activeFibonacci);
    dataset.hearthCanvasSouthActiveFibonacciRank = state.activeFibonacciRank;
    dataset.hearthCanvasSouthActiveFibonacciGate = state.activeFibonacciGate;
    dataset.hearthCanvasSouthParentFibonacciGate = state.parentFibonacciGate;
    dataset.hearthCanvasSouthFutureFibonacciGate = state.futureFibonacciGate;
    dataset.hearthCanvasSouthActiveStageId = state.activeStageId;
    dataset.hearthCanvasSouthActiveGearId = state.activeGearId;
    dataset.hearthCanvasSouthOneActiveGearAtATime = "true";
    dataset.hearthCanvasSouthF8SelfDutySatisfied = String(state.f8SelfDutySatisfied);
    dataset.hearthCanvasSouthF13ProofBodyAvailable = String(state.f13ProofBodyAvailable);
    dataset.hearthCanvasSouthF13VisibleEvidenceAvailable = String(state.f13VisibleEvidenceAvailable);
    dataset.hearthCanvasSouthF13VisibleEvidenceStrict = String(state.f13VisibleEvidenceStrict);
    dataset.hearthCanvasSouthF13VisibleEvidenceDegraded = String(state.f13VisibleEvidenceDegraded);
    dataset.hearthCanvasSouthF13InspectEvidenceAvailable = String(state.f13InspectEvidenceAvailable);
    dataset.hearthCanvasSouthF13SVisibleProofReady = String(state.f13sVisibleProofReady);
    dataset.hearthCanvasSouthF13VisibleEvidenceComplete = String(state.f13VisibleEvidenceComplete);
    dataset.hearthCanvasSouthF13HardFail = String(state.f13HardFail);
    dataset.hearthCanvasSouthF21EligibleForNorth = "false";
    dataset.hearthCanvasSouthF21SubmittedToNorth = "false";
    dataset.hearthCanvasSouthF21LatchMode = state.f21LatchMode;

    dataset.hearthCanvasSouthActive = "true";
    dataset.hearthCanvasSouthApiReady = String(state.canvasSouthApiReady);
    dataset.hearthCanvasSouthEvidenceReady = String(state.canvasSouthEvidenceReady);
    dataset.hearthCanvasSouthReady = String(state.canvasSouthReady);
    dataset.hearthCanvasSouthTextureReady = String(state.textureReady);
    dataset.hearthCanvasSouthRenderReady = String(state.renderReady);
    dataset.hearthCanvasSouthVisibleProofReady = String(state.visibleProofReady);

    dataset.hearthCanvasSouthSourceResolutionActive = "true";
    dataset.hearthCanvasSouthSourceCanvasResolved = String(state.sourceCanvasResolved);
    dataset.hearthCanvasSouthSourceCanvasResolutionPath = state.sourceCanvasResolutionPath;
    dataset.hearthCanvasSouthSourceCanvasResolutionReason = state.sourceCanvasResolutionReason;
    dataset.hearthCanvasSouthSourcePacketAccepted = String(state.sourcePacketAccepted);
    dataset.hearthCanvasSouthParentPacketAccepted = String(state.parentPacketAccepted);
    dataset.hearthCanvasSouthReleasePacketAccepted = String(state.releasePacketAccepted);
    dataset.hearthCanvasSouthEastAtlasPacketAccepted = String(state.eastAtlasPacketAccepted);
    dataset.hearthCanvasSouthCachedTextureAccepted = String(state.cachedTextureAccepted);

    dataset.hearthCanvasSouthSplitAdapterTransistorMode = "true";
    dataset.hearthCanvasSouthTransistorRole = "drain";
    dataset.hearthCanvasSouthSplitAdapterParentAligned = "true";
    dataset.hearthCanvasSouthFatalErrorBoundaryActive = "true";

    dataset.hearthCanvasSouthTextureComposeStarted = String(state.textureComposeStarted);
    dataset.hearthCanvasSouthTextureComposeProgress = String(state.textureComposeProgress);
    dataset.hearthCanvasSouthTextureComposeComplete = String(state.textureComposeComplete);
    dataset.hearthCanvasSouthTextureProofComplete = String(state.textureProofComplete);
    dataset.hearthCanvasSouthTextureHardFail = String(state.textureHardFail);
    dataset.hearthCanvasSouthTextureInvalidated = String(state.textureInvalidated);
    dataset.hearthCanvasSouthTextureInvalidationReason = state.textureInvalidationReason;
    dataset.hearthCanvasSouthTextureInvalidationCount = String(state.textureInvalidationCount);
    dataset.hearthCanvasSouthTextureSourcePath = state.textureSourcePath;
    dataset.hearthCanvasSouthTextureSourceContract = state.textureSourceContract;
    dataset.hearthCanvasSouthTextureSourceReceipt = state.textureSourceReceipt;

    dataset.hearthCanvasSouthFirstFrameRequested = String(state.firstFrameRequested);
    dataset.hearthCanvasSouthFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthCanvasSouthImageRendered = String(state.imageRendered);
    dataset.hearthCanvasSouthImageRenderedMeansFrameDrawnOnly = "true";
    dataset.hearthCanvasSouthImageRenderedDoesNotMeanVisualPass = "true";
    dataset.hearthCanvasSouthImageRenderedDoesNotMeanF21 = "true";
    dataset.hearthCanvasSouthRenderedAfterTexture = String(state.renderedAfterTexture);
    dataset.hearthCanvasSouthRenderedFromCachedTexture = String(state.renderedFromCachedTexture);
    dataset.hearthCanvasSouthSphereProjectionComplete = String(state.sphereProjectionComplete);
    dataset.hearthCanvasSouthRenderHardFail = String(state.renderHardFail);
    dataset.hearthCanvasSouthRenderFrameStale = String(state.renderFrameStale);
    dataset.hearthCanvasSouthPlanetFramePainted = String(state.planetFramePainted);
    dataset.hearthCanvasSouthNonblankPlanetVisible = String(state.nonblankPlanetVisible);
    dataset.hearthCanvasSouthPlanetNotObstructed = String(state.planetNotObstructed);

    dataset.hearthCanvasSouthVisibleContentProofStarted = String(state.visibleContentProofStarted);
    dataset.hearthCanvasSouthVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthCanvasSouthVisibleContentStrictProof = String(state.visibleContentStrictProof);
    dataset.hearthCanvasSouthVisibleContentSoftGap = String(state.visibleContentSoftGap);
    dataset.hearthCanvasSouthVisibleContentHardFail = String(state.visibleContentHardFail);
    dataset.hearthCanvasSouthVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    dataset.hearthCanvasSouthCurrentVisibleProofValid = String(state.currentVisibleProofValid);
    dataset.hearthCanvasSouthVisibleProofStale = String(state.visibleProofStale);
    dataset.hearthCanvasSouthProofBin = state.proofBin;
    dataset.hearthCanvasSouthVisibleContentVarianceScore = String(state.visibleContentVarianceScore);
    dataset.hearthCanvasSouthVisibleContentClassCount = String(state.visibleContentClassCount);
    dataset.hearthCanvasSouthVisibleContentColorBucketCount = String(state.visibleContentColorBucketCount);
    dataset.hearthCanvasSouthVisibleContentPlanetPixelCount = String(state.visibleContentPlanetPixelCount);
    dataset.hearthCanvasSouthVisibleContentNonCarrierRatio = String(state.visibleContentNonCarrierRatio);
    dataset.hearthCanvasSouthVisibleContentNonTransparentRatio = String(state.visibleContentNonTransparentRatio);
    dataset.hearthCanvasSouthVisibleContentProofDoesNotMeanFinalVisualPass = "true";
    dataset.hearthCanvasSouthF13VisibleEvidenceDoesNotMeanF21 = "true";

    dataset.hearthCanvasSouthStrictVisibleProofClassifierActive = "true";
    dataset.hearthCanvasSouthStrictProofDoesNotRequireNamedLandWaterBalance = "true";
    dataset.hearthCanvasSouthStrictProofRequiresRenderedSphereSurfaceSignal = "true";
    dataset.hearthCanvasSouthDegradedProofRemainsAvailableForForwardProgress = "true";

    dataset.hearthCanvasSouthClarityRenewalActive = "true";
    dataset.hearthCanvasSouthHazeReduced = "true";
    dataset.hearthCanvasSouthHighDpiCanvasActive = "true";
    dataset.hearthCanvasSouthCoastlineContrastActive = "true";
    dataset.hearthCanvasSouthLightingPreservesSurfaceReadability = "true";

    dataset.hearthCanvasSouthOwnsTextureComposition = "true";
    dataset.hearthCanvasSouthOwnsSphereRendering = "true";
    dataset.hearthCanvasSouthOwnsVisibleProof = "true";
    dataset.hearthCanvasSouthOwnsCanvasSouthOutput = "true";
    dataset.hearthCanvasSouthOwnsAtlasSource = "false";
    dataset.hearthCanvasSouthOwnsAtlasFormation = "false";
    dataset.hearthCanvasSouthOwnsSourceIntake = "false";
    dataset.hearthCanvasSouthOwnsDragInspection = "false";
    dataset.hearthCanvasSouthOwnsZoomInspection = "false";
    dataset.hearthCanvasSouthOwnsInspectionControl = "false";
    dataset.hearthCanvasSouthOwnsPlanetTruth = "false";
    dataset.hearthCanvasSouthOwnsMaterialTruth = "false";
    dataset.hearthCanvasSouthOwnsHydrologyTruth = "false";
    dataset.hearthCanvasSouthOwnsElevationTruth = "false";
    dataset.hearthCanvasSouthOwnsRuntimeTableGovernance = "false";
    dataset.hearthCanvasSouthOwnsRouteReadiness = "false";
    dataset.hearthCanvasSouthOwnsCanvasParentBoot = "false";
    dataset.hearthCanvasSouthOwnsCanvasRelease = "false";
    dataset.hearthCanvasSouthOwnsWestAudit = "false";
    dataset.hearthCanvasSouthOwnsReadyText = "false";
    dataset.hearthCanvasSouthOwnsF21 = "false";
    dataset.hearthCanvasSouthOwnsFinalVisualPassClaim = "false";

    dataset.hearthCanvasSouthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthCanvasSouthRecommendedNextFile = state.recommendedNextFile;
    dataset.hearthCanvasSouthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;
    dataset.hearthCanvasSouthPostgameStatus = state.postgameStatus;

    dataset.hearthCanvasSouthF21ClaimedByCanvasSouth = "false";
    dataset.hearthCanvasSouthReadyTextClaimedByCanvasSouth = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    if (state.textureCanvas) stampTextureCanvas(state.textureCanvas);
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,
    eastFile: EAST_FILE,
    westFile: WEST_FILE,

    ACTIVE_PARENT_CONTEXT_CONTRACTS,
    SOURCE_CANDIDATE_PATHS,
    PROOF_BIN,

    composeTexture,
    composeTextureFromAtlas,
    renderSphere,
    renderFromTexture,
    renderSphereSync,
    getTextureCanvas,
    sampleVisibleContent,
    sampleVisibleProof,
    classifyVisibleContentEvidence,
    getVisibleProofPacket,
    invalidateTexture,
    getSouthReceipt,
    getTextureReceipt,
    getRenderReceipt,
    getReceipt,
    getReceiptText,
    resolveSourceCanvas,

    canvasSouthLoaded: true,
    canvasSouthActive: true,
    splitAdapterRole: "SOUTH",
    splitAdapterTransistorMode: true,
    transistorAdapterActive: true,
    transistorRole: "drain",
    splitAdapterParentAligned: true,
    fatalErrorBoundaryActive: true,

    parentAuthorityRule: "UPSTREAM_PARENT_ALREADY_DOABLE_IS_AUTHORITY",
    downstreamAcclimationRule: "SOUTH_ACCLIMATES_TO_PARENT_HANDOFF",
    parentMutationRecommendedBySouth: false,
    parentContractInformationalOnly: true,

    newsProtocolSynchronized: true,
    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    canvasGateReady: false,

    macroCycle1: MACRO_CYCLE_1,
    macroCycle2: MACRO_CYCLE_2,
    canvasChildSequence: CANVAS_CHILD_SEQUENCE,
    canvasSouthMacroSouth: false,
    canvasSouthChildSouth: true,
    canvasSouthDoesNotAuthorizeCanvasRelease: true,
    canvasSouthDoesNotLatchF21: true,

    fibonacciAlignmentSynchronized: true,
    activeFibonacci: 13,
    activeFibonacciRank: "F13S",
    activeFibonacciGate: "F13S",
    parentFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    activeStageId: "canvas-south-parent-acclimated-texture-render-visible-proof",
    activeGearId: "hearth-canvas-south-parent-acclimated-f13s",
    oneActiveGearAtATime: true,

    strictVisibleProofClassifierActive: true,
    strictProofDoesNotRequireNamedLandWaterBalance: true,
    strictProofRequiresRenderedSphereSurfaceSignal: true,
    degradedProofRemainsAvailableForForwardProgress: true,

    ownsTextureComposition: true,
    ownsSphereRendering: true,
    ownsVisibleProof: true,
    ownsCanvasSouthOutput: true,
    ownsAtlasSource: false,
    ownsAtlasFormation: false,
    ownsSourceIntake: false,
    ownsDragInspection: false,
    ownsZoomInspection: false,
    ownsInspectionControl: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsRuntimeTableGovernance: false,
    ownsRouteReadiness: false,
    ownsCanvasParentBoot: false,
    ownsCanvasRelease: false,
    ownsWestAudit: false,
    ownsReadyText: false,
    ownsF21: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByCanvasSouth: false,
    readyTextClaimedByCanvasSouth: false,

    get state() {
      deriveReadiness();
      return state;
    }
  };

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvasSouth = api;
    root.HEARTH.canvasSouthTextureSphereVisibleProof = api;
    root.HEARTH.canvasSouthSplitAdapterDrainVisibleProofHardening = api;
    root.HEARTH.canvasSouthF13STextureRenderVisibleProofChild = api;
    root.HEARTH.canvasSouthF13SStrictVisibleProofClassifierChild = api;
    root.HEARTH.canvasSouthParentAcclimatedF13SVisibleProofChild = api;

    root.HEARTH_CANVAS_SOUTH = api;
    root.HEARTH_CANVAS_SOUTH_TEXTURE_SPHERE_VISIBLE_PROOF = api;
    root.HEARTH_CANVAS_SOUTH_SPLIT_ADAPTER_DRAIN_VISIBLE_PROOF_HARDENING = api;
    root.HEARTH_CANVAS_SOUTH_F13S_TEXTURE_RENDER_VISIBLE_PROOF_CHILD = api;
    root.HEARTH_CANVAS_SOUTH_F13S_STRICT_VISIBLE_PROOF_CLASSIFIER_CHILD = api;
    root.HEARTH_CANVAS_SOUTH_PARENT_ACCLIMATED_F13S_VISIBLE_PROOF_CHILD = api;

    root.DEXTER_LAB.hearthCanvasSouth = api;
    root.DEXTER_LAB.hearthCanvasSouthTextureSphereVisibleProof = api;
    root.DEXTER_LAB.hearthCanvasSouthSplitAdapterDrainVisibleProofHardening = api;
    root.DEXTER_LAB.hearthCanvasSouthF13STextureRenderVisibleProofChild = api;
    root.DEXTER_LAB.hearthCanvasSouthF13SStrictVisibleProofClassifierChild = api;
    root.DEXTER_LAB.hearthCanvasSouthParentAcclimatedF13SVisibleProofChild = api;

    const receipt = getReceipt();

    root.HEARTH_CANVAS_SOUTH_RECEIPT = receipt;
    root.HEARTH_CANVAS_SOUTH_TEXTURE_SPHERE_VISIBLE_PROOF_RECEIPT = receipt;
    root.HEARTH_CANVAS_SOUTH_SPLIT_ADAPTER_DRAIN_VISIBLE_PROOF_HARDENING_RECEIPT = receipt;
    root.HEARTH_CANVAS_SOUTH_F13S_TEXTURE_RENDER_VISIBLE_PROOF_CHILD_RECEIPT = receipt;
    root.HEARTH_CANVAS_SOUTH_F13S_STRICT_VISIBLE_PROOF_CLASSIFIER_CHILD_RECEIPT = receipt;
    root.HEARTH_CANVAS_SOUTH_PARENT_ACCLIMATED_F13S_VISIBLE_PROOF_CHILD_RECEIPT = receipt;

    root.HEARTH.canvasSouthReceipt = receipt;
    root.HEARTH.canvasSouthTextureSphereVisibleProofReceipt = receipt;
    root.HEARTH.canvasSouthSplitAdapterDrainVisibleProofHardeningReceipt = receipt;
    root.HEARTH.canvasSouthF13STextureRenderVisibleProofChildReceipt = receipt;
    root.HEARTH.canvasSouthF13SStrictVisibleProofClassifierChildReceipt = receipt;
    root.HEARTH.canvasSouthParentAcclimatedF13SVisibleProofChildReceipt = receipt;

    root.DEXTER_LAB.hearthCanvasSouthReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasSouthTextureSphereVisibleProofReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasSouthSplitAdapterDrainVisibleProofHardeningReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasSouthF13STextureRenderVisibleProofChildReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasSouthF13SStrictVisibleProofClassifierChildReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasSouthParentAcclimatedF13SVisibleProofChildReceipt = receipt;

    root.__HEARTH_CANVAS_SOUTH_LOADED__ = true;
    root.__HEARTH_CANVAS_SOUTH_PRESENT__ = true;
    root.__HEARTH_CANVAS_SOUTH_FILE__ = FILE;
    root.__HEARTH_CANVAS_SOUTH_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_SOUTH_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_SOUTH_PARENT_ACCLIMATED__ = true;
    root.__HEARTH_CANVAS_SOUTH_PARENT_MUTATION_RECOMMENDED__ = false;
    root.__HEARTH_CANVAS_SOUTH_API_READY__ = state.canvasSouthApiReady;
    root.__HEARTH_CANVAS_SOUTH_EVIDENCE_READY__ = state.canvasSouthEvidenceReady;
    root.__HEARTH_CANVAS_SOUTH_READY__ = state.canvasSouthReady;
    root.__HEARTH_CANVAS_SOUTH_F21_CLAIMED__ = false;
    root.__HEARTH_CANVAS_SOUTH_READY_TEXT_CLAIMED__ = false;
    root.__HEARTH_CANVAS_SOUTH_VISUAL_PASS_CLAIMED__ = false;
  }

  try {
    state.updatedAt = nowIso();

    deriveReadiness();
    updateDataset();
    publishGlobals();

    recordLocal("SOUTH_PARENT_ACCLIMATED_F13S_VISIBLE_PROOF_CHILD_LOADED", {
      file: FILE,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      parentAuthorityRule: state.parentAuthorityRule,
      downstreamAcclimationRule: state.downstreamAcclimationRule,
      canvasSouthApiReady: state.canvasSouthApiReady,
      canvasSouthEvidenceReady: state.canvasSouthEvidenceReady,
      canvasSouthReady: state.canvasSouthReady,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21: state.newsGateDegradedBeforeF21,
      strictVisibleProofClassifierActive: true,
      visualPassClaimed: false,
      f21EligibleForNorth: false
    });

    publishGlobals();
  } catch (error) {
    recordError("SOUTH_PARENT_ACCLIMATED_F13S_VISIBLE_PROOF_CHILD_INITIALIZATION_FAILED", error);

    try {
      publishGlobals();
      updateDataset();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
