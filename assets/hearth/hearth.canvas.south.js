// /assets/hearth/hearth.canvas.south.js
// HEARTH_CANVAS_SOUTH_F13S_TEXTURE_RENDER_VISIBLE_PROOF_CHILD_TNT_v2
// Full-file replacement.
// Canvas South / F13S texture composition, sphere rendering, visible proof, and output proof child only.
// Purpose:
// - Preserve the Canvas North child API required by /assets/hearth/hearth.canvas.js.
// - Preserve South texture composition from East atlas output.
// - Preserve South cached-texture sphere rendering.
// - Preserve South visible-content proof classification for F13 evidence.
// - Harden South under the current Runtime Table / NEWS / Fibonacci / Canvas F13 chain.
// - Split API readiness from texture/render/visible-proof readiness.
// - Preserve current proof vs historical proof separation.
// - Preserve stale proof suppression after invalidation.
// - Preserve ordered visible-proof binning: strict supersedes soft, soft supersedes hard fail.
// - Preserve fatal compose/render failure behavior after receipt state is updated.
// Does not own:
// - planet truth
// - material truth
// - hydrology truth
// - elevation truth
// - atlas source formation
// - source intake authority
// - drag / zoom / inspection control
// - Canvas parent boot
// - Runtime Table governance
// - route readiness
// - F21 latch
// - ready text
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_SOUTH_F13S_TEXTURE_RENDER_VISIBLE_PROOF_CHILD_TNT_v2";
  const RECEIPT = "HEARTH_CANVAS_SOUTH_F13S_TEXTURE_RENDER_VISIBLE_PROOF_CHILD_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_SOUTH_SPLIT_ADAPTER_DRAIN_VISIBLE_PROOF_HARDENING_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const PARENT_SPLIT_CONTRACT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2";
  const ACCEPTED_PARENT_SPLIT_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2",
    "HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_TNT_v1",
    "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_TNT_v1"
  ]);
  const VERSION = "2026-05-31.hearth-canvas-south-f13s-texture-render-visible-proof-child-v2";
  const FILE = "/assets/hearth/hearth.canvas.south.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DEFAULT_TEXTURE_WIDTH = 768;
  const DEFAULT_TEXTURE_HEIGHT = 384;
  const COMPOSE_ROWS_PER_CHUNK = 12;
  const RENDER_ROWS_PER_CHUNK = 18;

  const MACRO_CYCLE_1 = "NORTH_EAST_WEST_SOUTH_NORTH";
  const MACRO_CYCLE_2 = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const CANVAS_CHILD_SEQUENCE = "CANVAS_EAST_ATLAS_SOURCE__CANVAS_WEST_INSPECTION_VIEW__CANVAS_SOUTH_TEXTURE_RENDER__CANVAS_PARENT_F13_EVIDENCE";
  const DEPRECATED_CYCLE_ORDER = "EAST_WEST_NORTH_SOUTH_CHECKPOINT_EAST";

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    parentSplitContract: PARENT_SPLIT_CONTRACT,
    acceptedParentSplitContracts: ACCEPTED_PARENT_SPLIT_CONTRACTS.slice(),
    version: VERSION,
    file: FILE,
    role: "canvas-south-f13s-texture-render-visible-proof-child",

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,

    macroCycle1: MACRO_CYCLE_1,
    macroCycle2: MACRO_CYCLE_2,
    canvasChildSequence: CANVAS_CHILD_SEQUENCE,
    deprecatedCycleOrder: DEPRECATED_CYCLE_ORDER,
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
    newsGateDegradedBeforeF21: true,

    activeFibonacci: 13,
    activeFibonacciRank: "F13S",
    activeStageId: "canvas-south-texture-render-visible-proof",
    activeGearId: "hearth-canvas-south-f13s",
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    f8SelfDutySatisfied: false,
    f13ProofBodyAvailable: false,
    f13VisibleEvidenceAvailable: false,
    f13VisibleEvidenceDegraded: false,
    f13InspectEvidenceAvailable: false,
    f13sVisibleProofReady: false,
    f13VisibleEvidenceComplete: false,
    f13HardFail: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21LatchMode: "north-only",

    canvasSouthLoaded: true,
    canvasSouthApiReady: false,
    canvasSouthActive: true,
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
    transistorGateParent: "north-split-adapter-gate",
    transistorCurrentFlow: "EAST_SOURCE_TO_SOUTH_DRAIN_THROUGH_NORTH_GATE_WITH_WEST_CONTROL",
    splitAdapterParentAligned: true,
    fatalErrorBoundaryActive: true,

    textureCanvas: null,
    textureContext: null,
    textureWidth: 0,
    textureHeight: 0,
    textureSourceContract: "",
    textureSourceReceipt: "",
    textureSourceWidth: 0,
    textureSourceHeight: 0,

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
    visibleContentLandSampleCount: 0,
    visibleContentWaterSampleCount: 0,
    visibleContentOtherSampleCount: 0,
    visibleContentCarrierSampleCount: 0,
    carrierOnlyDetected: false,

    visibleContentProofDoesNotMeanFinalVisualPass: true,
    f13VisibleEvidenceDoesNotMeanF21: true,

    proofBin: "NONE",
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
    ownsReadyText: false,
    ownsF21: false,

    f21ClaimedByCanvasSouth: false,
    readyTextClaimedByCanvasSouth: false,

    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    updatedAt: nowIso()
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function deriveReadiness() {
    const apiReady =
      isFunction(composeTexture) &&
      isFunction(renderSphere) &&
      isFunction(renderSphereSync) &&
      isFunction(getTextureCanvas) &&
      isFunction(sampleVisibleContent) &&
      isFunction(classifyVisibleContentEvidence) &&
      isFunction(invalidateTexture) &&
      isFunction(getReceipt);

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

    const f13VisibleEvidenceAvailable = Boolean(
      state.visibleContentProof &&
      state.currentVisibleProofValid &&
      !state.visibleProofStale
    );

    const f13VisibleEvidenceDegraded = Boolean(
      state.visibleContentSoftGap &&
      state.currentVisibleProofValid &&
      !state.visibleProofStale
    );

    const southGateReady = Boolean(
      apiReady &&
      textureReady &&
      renderReady &&
      visibleProofReady
    );

    state.canvasSouthApiReady = apiReady;
    state.canvasSouthReady = apiReady;

    state.textureReady = textureReady;
    state.renderReady = renderReady;
    state.visibleProofReady = visibleProofReady;
    state.southGateReady = southGateReady;

    state.f13ProofBodyAvailable = southGateReady;
    state.f13VisibleEvidenceAvailable = f13VisibleEvidenceAvailable;
    state.f13VisibleEvidenceDegraded = f13VisibleEvidenceDegraded;
    state.f13sVisibleProofReady = f13VisibleEvidenceAvailable;
    state.f13VisibleEvidenceComplete = f13VisibleEvidenceAvailable;
    state.f13HardFail = Boolean(state.visibleContentHardFail || state.textureHardFail || state.renderHardFail);

    state.northGateReady = false;
    state.eastGateReady = false;
    state.westGateReady = false;
    state.canvasGateReady = false;
    state.newsGatePassedBeforeF21 = false;
    state.newsGateDegradedBeforeF21 = true;

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

    return {
      canvasSouthApiReady: apiReady,
      textureReady,
      renderReady,
      visibleProofReady,
      southGateReady,
      f13ProofBodyAvailable: state.f13ProofBodyAvailable,
      f13VisibleEvidenceAvailable,
      f13VisibleEvidenceDegraded,
      f13sVisibleProofReady: state.f13sVisibleProofReady
    };
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);

    if (state.localEvents.length > 140) {
      state.localEvents.splice(0, state.localEvents.length - 140);
    }

    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      event: code,
      message: error && error.message ? error.message : String(error || ""),
      detail: clonePlain(detail)
    };

    state.errors.push(item);

    if (state.errors.length > 100) {
      state.errors.splice(0, state.errors.length - 100);
    }

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

  function sourceCanvasFrom(options = {}) {
    const source =
      options.atlasCanvas ||
      options.sourceCanvas ||
      options.textureSource ||
      options.canvas ||
      null;

    if (source && Number(source.width) > 0 && Number(source.height) > 0) {
      return source;
    }

    if (state.textureCanvas && options.allowCachedTexture === true) {
      return state.textureCanvas;
    }

    throw new Error("Canvas South composeTexture requires a valid atlasCanvas.");
  }

  function readSourceReceipt(source) {
    if (!source || !source.dataset) {
      return {
        contract: "",
        receipt: ""
      };
    }

    return {
      contract:
        source.dataset.hearthCanvasEastContract ||
        source.dataset.hearthMaterialsContract ||
        source.dataset.hearthCanvasContract ||
        "",
      receipt:
        source.dataset.hearthCanvasEastReceipt ||
        source.dataset.hearthMaterialsReceipt ||
        source.dataset.hearthCanvasReceipt ||
        ""
    };
  }

  function stampTextureCanvas(canvas) {
    if (!canvas || !canvas.dataset) return;

    deriveReadiness();

    canvas.dataset.hearthCanvasSouthTexture = "true";
    canvas.dataset.hearthCanvasSouthContract = CONTRACT;
    canvas.dataset.hearthCanvasSouthReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSouthParentSplitContract = PARENT_SPLIT_CONTRACT;
    canvas.dataset.hearthCanvasSouthRole = state.role;

    canvas.dataset.hearthCanvasSouthActiveFibonacci = String(state.activeFibonacci);
    canvas.dataset.hearthCanvasSouthActiveFibonacciRank = state.activeFibonacciRank;
    canvas.dataset.hearthCanvasSouthActiveStageId = state.activeStageId;
    canvas.dataset.hearthCanvasSouthActiveGearId = state.activeGearId;

    canvas.dataset.hearthCanvasSouthTransistorRole = "drain";
    canvas.dataset.hearthCanvasSouthTextureReady = String(state.textureReady);
    canvas.dataset.hearthCanvasSouthTextureComposeComplete = String(state.textureComposeComplete);
    canvas.dataset.hearthCanvasSouthTextureProofComplete = String(state.textureProofComplete);
    canvas.dataset.hearthCanvasSouthTextureHardFail = String(state.textureHardFail);
    canvas.dataset.hearthCanvasSouthTextureInvalidated = String(state.textureInvalidated);

    canvas.dataset.hearthCanvasSouthF13VisibleEvidenceAvailable = String(state.f13VisibleEvidenceAvailable);
    canvas.dataset.hearthCanvasSouthF13SVisibleProofReady = String(state.f13sVisibleProofReady);

    canvas.dataset.hearthCanvasSouthClarityRenewalActive = "true";
    canvas.dataset.hearthCanvasSouthHazeReduced = "true";
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
    canvas.dataset.hearthCanvasSouthParentSplitContract = PARENT_SPLIT_CONTRACT;
    canvas.dataset.hearthCanvasSouthSphereProjectionComplete = String(state.sphereProjectionComplete);
    canvas.dataset.hearthCanvasSouthRenderReady = String(state.renderReady);
    canvas.dataset.hearthCanvasSouthRenderHardFail = String(state.renderHardFail);
    canvas.dataset.hearthCanvasSouthRenderFrameStale = String(state.renderFrameStale);

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
    canvas.dataset.hearthCanvasSouthF13VisibleEvidenceDegraded = String(state.f13VisibleEvidenceDegraded);
    canvas.dataset.hearthCanvasSouthF13SVisibleProofReady = String(state.f13sVisibleProofReady);

    canvas.dataset.hearthCanvasSouthImageRenderedMeansFrameDrawnOnly = "true";
    canvas.dataset.hearthCanvasSouthImageRenderedDoesNotMeanVisualPass = "true";
    canvas.dataset.hearthCanvasSouthImageRenderedDoesNotMeanF21 = "true";

    canvas.dataset.hearthCanvasSouthOwnsPlanetTruth = "false";
    canvas.dataset.hearthCanvasSouthOwnsF21 = "false";
    canvas.dataset.visualPassClaimed = "false";
  }

  function clearCurrentProof(reason = "current-proof-cleared") {
    state.visibleContentProof = false;
    state.visibleContentStrictProof = false;
    state.visibleContentSoftGap = false;
    state.visibleContentHardFail = false;
    state.visibleForwardProgress = false;
    state.visibleContentAdmissible = false;
    state.currentVisibleProofValid = false;
    state.visibleProofStale = true;
    state.staleProofSuppressed = true;
    state.proofBin = "STALE";
    state.visibleContentProofMethod = reason;
    state.f13VisibleEvidenceComplete = false;
    state.f13VisibleEvidenceAvailable = false;
    state.f13VisibleEvidenceDegraded = false;
    state.f13sVisibleProofReady = false;
    state.f13HardFail = false;
    deriveReadiness();
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
    state.f13VisibleEvidenceDegraded = false;
    state.f13sVisibleProofReady = false;
    state.f13HardFail = true;
    state.updatedAt = nowIso();

    clearCurrentProof("fatal-compose-failure-current-proof-cleared");
    state.visibleContentHardFail = true;
    state.proofBin = "HARD_FAIL";
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
    state.updatedAt = nowIso();

    clearCurrentProof("fatal-render-failure-current-proof-cleared");
    state.visibleContentHardFail = true;
    state.f13HardFail = true;
    state.proofBin = "HARD_FAIL";

    recordError("SOUTH_RENDER_SPHERE_FATAL", error);
    updateDataset();
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
    dataset.hearthCanvasSouthParentSplitContract = PARENT_SPLIT_CONTRACT;
    dataset.hearthCanvasSouthVersion = VERSION;
    dataset.hearthCanvasSouthFile = FILE;
    dataset.hearthCanvasSouthRole = state.role;

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
    dataset.hearthCanvasSouthDeprecatedCycleOrder = state.deprecatedCycleOrder;
    dataset.hearthCanvasSouthMacroSouth = String(state.canvasSouthMacroSouth);
    dataset.hearthCanvasSouthChildSouth = String(state.canvasSouthChildSouth);
    dataset.hearthCanvasSouthDoesNotAuthorizeCanvasRelease = String(state.canvasSouthDoesNotAuthorizeCanvasRelease);
    dataset.hearthCanvasSouthDoesNotLatchF21 = String(state.canvasSouthDoesNotLatchF21);

    dataset.hearthCanvasSouthFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasSouthActiveFibonacci = String(state.activeFibonacci);
    dataset.hearthCanvasSouthActiveFibonacciRank = state.activeFibonacciRank;
    dataset.hearthCanvasSouthActiveStageId = state.activeStageId;
    dataset.hearthCanvasSouthActiveGearId = state.activeGearId;
    dataset.hearthCanvasSouthActiveFibonacciGate = state.activeFibonacciGate;
    dataset.hearthCanvasSouthFutureFibonacciGate = state.futureFibonacciGate;
    dataset.hearthCanvasSouthOneActiveGearAtATime = "true";
    dataset.hearthCanvasSouthF8SelfDutySatisfied = String(state.f8SelfDutySatisfied);
    dataset.hearthCanvasSouthF13ProofBodyAvailable = String(state.f13ProofBodyAvailable);
    dataset.hearthCanvasSouthF13VisibleEvidenceAvailable = String(state.f13VisibleEvidenceAvailable);
    dataset.hearthCanvasSouthF13VisibleEvidenceDegraded = String(state.f13VisibleEvidenceDegraded);
    dataset.hearthCanvasSouthF13InspectEvidenceAvailable = String(state.f13InspectEvidenceAvailable);
    dataset.hearthCanvasSouthF13SVisibleProofReady = String(state.f13sVisibleProofReady);
    dataset.hearthCanvasSouthF21EligibleForNorth = String(state.f21EligibleForNorth);
    dataset.hearthCanvasSouthF21SubmittedToNorth = String(state.f21SubmittedToNorth);
    dataset.hearthCanvasSouthF21LatchMode = state.f21LatchMode;

    dataset.hearthCanvasSouthActive = "true";
    dataset.hearthCanvasSouthApiReady = String(state.canvasSouthApiReady);
    dataset.hearthCanvasSouthReady = String(state.canvasSouthReady);
    dataset.hearthCanvasSouthTextureReady = String(state.textureReady);
    dataset.hearthCanvasSouthRenderReady = String(state.renderReady);
    dataset.hearthCanvasSouthVisibleProofReady = String(state.visibleProofReady);

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
    dataset.hearthCanvasSouthVisibleContentProofDoesNotMeanFinalVisualPass = "true";
    dataset.hearthCanvasSouthF13VisibleEvidenceDoesNotMeanF21 = "true";

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
    dataset.hearthCanvasSouthOwnsReadyText = "false";
    dataset.hearthCanvasSouthOwnsF21 = "false";

    dataset.hearthCanvasSouthF21ClaimedByCanvasSouth = "false";
    dataset.hearthCanvasSouthReadyTextClaimedByCanvasSouth = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    if (state.textureCanvas) stampTextureCanvas(state.textureCanvas);
  }

  function pixelClass(r, g, b, a) {
    if (a < 12) return "transparent";
    if (r < 8 && g < 8 && b < 8) return "carrier";

    if (b > r + 8 && b >= g + 2) return "water";
    if (g >= b && g >= r * 0.72) return "land";
    if (r >= g && g >= b * 0.70) return "land";
    if (r + g + b > 90) return "other";

    return "carrier";
  }

  function clearCanvas(context, width, height) {
    context.clearRect(0, 0, width, height);
  }

  async function composeTexture(options = {}) {
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
      const source = sourceCanvasFrom(options);
      const sourceReceipt = readSourceReceipt(source);
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

            if (a < 8) continue;

            const brightness = (r + g + b) / 3;
            const contrast = 1.055;
            const hazeLift = 5;
            const polarModeration = latitudeEdge > 0.72 ? 0.94 : 1;

            data[index] = clamp((r - 128) * contrast + 128 + hazeLift, 0, 255);
            data[index + 1] = clamp((g - 128) * contrast + 128 + hazeLift, 0, 255);
            data[index + 2] = clamp((b - 128) * contrast + 128 + hazeLift, 0, 255);

            if (brightness < 34) {
              data[index] = clamp(data[index] + 4, 0, 255);
              data[index + 1] = clamp(data[index + 1] + 5, 0, 255);
              data[index + 2] = clamp(data[index + 2] + 6, 0, 255);
            }

            data[index] = clamp(data[index] * polarModeration, 0, 255);
            data[index + 1] = clamp(data[index + 1] * polarModeration, 0, 255);
            data[index + 2] = clamp(data[index + 2] * polarModeration, 0, 255);
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
      state.textureComposeElapsedMs = Math.max(0, Date.parse(state.textureComposeCompletedAt) - Date.parse(state.textureComposeStartedAt));
      state.currentTextureProofAt = state.textureComposeCompletedAt;
      state.renderFrameStale = true;
      state.visibleProofStale = true;
      state.currentVisibleProofValid = false;
      state.sphereProjectionComplete = false;
      state.imageRendered = false;
      state.firstFrameDetected = false;
      state.f13VisibleEvidenceAvailable = false;
      state.f13VisibleEvidenceDegraded = false;
      state.f13sVisibleProofReady = false;
      state.updatedAt = state.textureComposeCompletedAt;

      stampTextureCanvas(canvas);

      recordLocal("SOUTH_TEXTURE_COMPOSE_COMPLETE", {
        width,
        height,
        sourceContract: state.textureSourceContract,
        sourceReceipt: state.textureSourceReceipt,
        textureProofComplete: true,
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
        textureProofComplete: true,
        textureHardFail: false,
        textureReady: true,
        f13VisibleEvidenceAvailable: false,
        f13sVisibleProofReady: false,
        receiptPacket: getReceipt(),
        visualPassClaimed: false,
        f21EligibleForNorth: false
      };
    } catch (error) {
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

  function texturePixel(textureData, textureWidth, textureHeight, u, v) {
    const uu = ((u % 1) + 1) % 1;
    const vv = clamp01(v);

    const x = Math.floor(uu * (textureWidth - 1));
    const y = Math.floor(vv * (textureHeight - 1));
    const index = (y * textureWidth + x) * 4;

    return [
      textureData[index],
      textureData[index + 1],
      textureData[index + 2],
      textureData[index + 3]
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

  function resolveRenderInputs(options = {}) {
    const canvas = options.canvas || options.outputCanvas || null;
    const textureCanvas = options.textureCanvas || state.textureCanvas || null;
    const view = options.view || {};

    if (!canvas || !isFunction(canvas.getContext)) {
      throw new Error("Canvas South renderSphere requires an output canvas.");
    }

    if (!textureCanvas || !isFunction(textureCanvas.getContext)) {
      throw new Error("Canvas South renderSphere requires a composed texture canvas.");
    }

    if (state.textureInvalidated === true || state.textureProofComplete !== true) {
      throw new Error("Canvas South renderSphere blocked: texture is invalidated or texture proof is incomplete.");
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
      state.f13VisibleEvidenceDegraded = false;
      state.f13sVisibleProofReady = false;
      state.currentSphereProofAt = nowIso();
      state.renderCompletedAt = state.currentSphereProofAt;
      state.renderElapsedMs = Math.max(0, Date.parse(state.renderCompletedAt) - Date.parse(state.renderStartedAt));
      state.updatedAt = state.renderCompletedAt;

      stampOutputCanvas(inputs.canvas);
      updateDataset();

      recordLocal("SOUTH_RENDER_SPHERE_COMPLETE", {
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
        renderHardFail: false,
        receiptPacket: getReceipt(),
        visualPassClaimed: false,
        f21EligibleForNorth: false
      };
    } catch (error) {
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
      state.f13VisibleEvidenceDegraded = false;
      state.f13sVisibleProofReady = false;
      state.currentSphereProofAt = nowIso();
      state.renderCompletedAt = state.currentSphereProofAt;
      state.renderElapsedMs = Math.max(0, Date.parse(state.renderCompletedAt) - Date.parse(state.renderStartedAt));
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
      state.renderError = error && error.message ? error.message : String(error);
      state.renderHardFail = true;
      state.sphereProjectionComplete = false;
      state.renderFrameStale = true;
      state.visibleProofStale = true;
      state.currentVisibleProofValid = false;
      state.f13VisibleEvidenceAvailable = false;
      state.f13VisibleEvidenceDegraded = false;
      state.f13sVisibleProofReady = false;
      state.f13HardFail = true;
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

  function classifyVisibleContentEvidence(metrics = {}) {
    const sampleCount = safeNumber(metrics.sampleCount, metrics.visibleContentSampleCount || 0);
    const carrierCount = safeNumber(metrics.carrierCount, metrics.visibleContentCarrierSampleCount || 0);
    const landCount = safeNumber(metrics.landCount, metrics.visibleContentLandSampleCount || 0);
    const waterCount = safeNumber(metrics.waterCount, metrics.visibleContentWaterSampleCount || 0);
    const otherCount = safeNumber(metrics.otherCount, metrics.visibleContentOtherSampleCount || 0);
    const variance = safeNumber(metrics.varianceScore, metrics.visibleContentVarianceScore || 0);
    const classCount = safeNumber(metrics.classCount, metrics.visibleContentClassCount || 0);

    const contentCount = landCount + waterCount + otherCount;
    const nonCarrierRatio = sampleCount > 0 ? contentCount / sampleCount : 0;
    const balancedSurface = landCount > 0 && waterCount > 0;

    const strict = Boolean(
      sampleCount >= 36 &&
      contentCount >= 18 &&
      nonCarrierRatio >= 0.26 &&
      variance >= 18 &&
      classCount >= 2 &&
      balancedSurface
    );

    const soft = Boolean(
      !strict &&
      sampleCount >= 24 &&
      contentCount >= 8 &&
      variance >= 8 &&
      classCount >= 1
    );

    const hardFail = Boolean(!strict && !soft);
    const visibleContentProof = strict || soft;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      activeFibonacci: 13,
      activeFibonacciRank: "F13S",
      activeStageId: "canvas-south-texture-render-visible-proof",
      activeGearId: "hearth-canvas-south-f13s",

      proofBin: strict ? "STRICT" : soft ? "SOFT_GAP" : "HARD_FAIL",
      visibleContentProof,
      visibleContentStrictProof: strict,
      visibleContentSoftGap: soft,
      visibleContentHardFail: hardFail,
      visibleForwardProgress: strict || soft || contentCount > 0,
      visibleContentAdmissible: visibleContentProof,
      visiblePlanetAvailable: visibleContentProof || contentCount > 0,
      carrierOnlyDetected: carrierCount > 0 && contentCount === 0,
      visibleContentProofMethod: strict
        ? "strict-land-water-variance-proof"
        : soft
          ? "soft-visible-content-forward-progress-proof"
          : "hard-fail-no-visible-content-proof",

      f13VisibleEvidenceComplete: visibleContentProof,
      f13VisibleEvidenceAvailable: visibleContentProof,
      f13VisibleEvidenceDegraded: soft,
      f13sVisibleProofReady: visibleContentProof,
      f13HardFail: hardFail,
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

    if (!canvas || !isFunction(canvas.getContext)) {
      const error = new Error("Canvas South visible-content proof requires a canvas.");

      state.visibleContentProofError = error.message;
      state.visibleContentProof = false;
      state.visibleContentStrictProof = false;
      state.visibleContentSoftGap = false;
      state.visibleContentHardFail = true;
      state.visiblePlanetAvailable = false;
      state.currentVisibleProofValid = false;
      state.visibleProofStale = false;
      state.proofBin = "HARD_FAIL";
      state.f13VisibleEvidenceAvailable = false;
      state.f13VisibleEvidenceDegraded = false;
      state.f13sVisibleProofReady = false;
      state.f13HardFail = true;

      recordError("SOUTH_VISIBLE_PROOF_CANVAS_MISSING", error);
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

      const grid = safeNumber(options.grid, 13);
      const sampleGrid = clamp(Math.round(grid), 7, 21);

      const image = context.getImageData(0, 0, width, height);
      const data = image.data;

      let sampleCount = 0;
      let carrierCount = 0;
      let landCount = 0;
      let waterCount = 0;
      let otherCount = 0;
      let sum = 0;
      let sumSq = 0;

      const classes = new Set();

      for (let gy = 0; gy < sampleGrid; gy += 1) {
        const y = Math.round(((gy + 0.5) / sampleGrid) * (height - 1));

        for (let gx = 0; gx < sampleGrid; gx += 1) {
          const x = Math.round(((gx + 0.5) / sampleGrid) * (width - 1));
          const dx = (x - width * 0.5) / Math.max(1, state.renderRadius || Math.min(width, height) * 0.435);
          const dy = (y - height * 0.5) / Math.max(1, state.renderRadius || Math.min(width, height) * 0.435);

          if (dx * dx + dy * dy > 1.04) continue;

          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          const cls = pixelClass(r, g, b, a);
          const brightness = (r + g + b) / 3;

          sampleCount += 1;
          sum += brightness;
          sumSq += brightness * brightness;

          if (cls === "land") landCount += 1;
          else if (cls === "water") waterCount += 1;
          else if (cls === "other") otherCount += 1;
          else if (cls === "carrier") carrierCount += 1;

          if (cls !== "transparent") classes.add(cls);
        }
      }

      const mean = sampleCount > 0 ? sum / sampleCount : 0;
      const variance = sampleCount > 0
        ? Math.sqrt(Math.max(0, sumSq / sampleCount - mean * mean))
        : 0;

      const metrics = {
        sampleCount,
        carrierCount,
        landCount,
        waterCount,
        otherCount,
        varianceScore: variance,
        classCount: classes.size
      };

      const classified = classifyVisibleContentEvidence(metrics);

      state.visibleContentSampleCount = sampleCount;
      state.visibleContentCarrierSampleCount = carrierCount;
      state.visibleContentLandSampleCount = landCount;
      state.visibleContentWaterSampleCount = waterCount;
      state.visibleContentOtherSampleCount = otherCount;
      state.visibleContentVarianceScore = Number(variance.toFixed(3));
      state.visibleContentClassCount = classes.size;
      state.visibleContentClasses = Array.from(classes).sort();

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
      state.updatedAt = state.currentVisibleProofAt;

      stampOutputCanvas(canvas);
      updateDataset();

      recordLocal("SOUTH_VISIBLE_CONTENT_PROOF_SAMPLED", {
        sampleCount,
        landCount,
        waterCount,
        otherCount,
        carrierCount,
        varianceScore: state.visibleContentVarianceScore,
        classCount: state.visibleContentClassCount,
        proofBin: state.proofBin,
        method: state.visibleContentProofMethod,
        currentVisibleProofValid: state.currentVisibleProofValid,
        f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
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
      state.proofBin = state.visibleContentSoftGap ? "SOFT_GAP" : "HARD_FAIL";
      state.f13VisibleEvidenceComplete = state.visibleContentSoftGap;
      state.f13VisibleEvidenceAvailable = state.visibleContentSoftGap;
      state.f13VisibleEvidenceDegraded = state.visibleContentSoftGap;
      state.f13sVisibleProofReady = state.visibleContentSoftGap;
      state.f13HardFail = state.visibleContentHardFail;
      state.currentVisibleProofAt = nowIso();

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
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      visibleContentCarrierSampleCount: state.visibleContentCarrierSampleCount,
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
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13VisibleEvidenceDegraded: state.f13VisibleEvidenceDegraded,
      f13sVisibleProofReady: state.f13sVisibleProofReady,
      f13VisibleEvidenceComplete: state.f13VisibleEvidenceComplete,
      f13HardFail: state.f13HardFail,

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
    state.f13VisibleEvidenceAvailable = false;
    state.f13VisibleEvidenceDegraded = false;
    state.f13sVisibleProofReady = false;
    state.f13ProofBodyAvailable = false;
    state.updatedAt = nowIso();

    recordLocal("SOUTH_TEXTURE_INVALIDATED", {
      reason: state.textureInvalidationReason,
      textureInvalidationCount: state.textureInvalidationCount,
      renderFrameStale: true,
      visibleProofStale: true,
      currentVisibleProofValid: false,
      f13VisibleEvidenceAvailable: false,
      f13sVisibleProofReady: false,
      visualPassClaimed: false,
      f21EligibleForNorth: false
    });

    updateDataset();

    return getReceipt();
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
      parentSplitContract: PARENT_SPLIT_CONTRACT,
      acceptedParentSplitContracts: ACCEPTED_PARENT_SPLIT_CONTRACTS.slice(),
      version: VERSION,
      file: FILE,
      role: state.role,

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
      deprecatedCycleOrder: state.deprecatedCycleOrder,
      canvasSouthMacroSouth: false,
      canvasSouthChildSouth: true,
      canvasSouthDoesNotAuthorizeCanvasRelease: true,
      canvasSouthDoesNotLatchF21: true,

      fibonacciAlignmentSynchronized: true,
      activeFibonacci: state.activeFibonacci,
      activeFibonacciRank: state.activeFibonacciRank,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeFibonacciGate: state.activeFibonacciGate,
      futureFibonacciGate: state.futureFibonacciGate,
      oneActiveGearAtATime: true,
      f8SelfDutySatisfied: false,
      f13ProofBodyAvailable: state.f13ProofBodyAvailable,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13VisibleEvidenceDegraded: state.f13VisibleEvidenceDegraded,
      f13InspectEvidenceAvailable: false,
      f13sVisibleProofReady: state.f13sVisibleProofReady,
      f13VisibleEvidenceComplete: state.f13VisibleEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21LatchMode: "north-only",

      canvasSouthLoaded: true,
      canvasSouthApiReady: readiness.canvasSouthApiReady,
      canvasSouthActive: true,
      canvasSouthReady: state.canvasSouthReady,
      textureReady: state.textureReady,
      renderReady: state.renderReady,
      visibleProofReady: state.visibleProofReady,
      southGateReady: state.southGateReady,

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
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      visibleContentCarrierSampleCount: state.visibleContentCarrierSampleCount,
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
      ownsReadyText: false,
      ownsF21: false,

      designRules: [
        "south owns F13S texture composition from east atlas",
        "south owns visible 2D sphere rendering from cached texture",
        "south owns visible-content proof classification",
        "strict proof supersedes soft proof",
        "soft proof supersedes hard fail",
        "fatal compose failure throws after receipt update",
        "fatal render failure throws after receipt update",
        "stale current proof cannot be treated as current valid proof",
        "historical proof may remain as lastValidVisibleProofAt only",
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
      updatedAt: state.updatedAt
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const errors = r.errors.length
      ? r.errors.map((item) => `- ${item.at} :: ${item.code} :: ${item.message}`).join("\n")
      : "- none";

    return [
      "HEARTH_CANVAS_SOUTH_F13S_TEXTURE_RENDER_VISIBLE_PROOF_CHILD_RECEIPT",
      "",
      "IDENTITY",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `parentSplitContract=${r.parentSplitContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
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
      "CYCLE",
      `macroCycle1=${r.macroCycle1}`,
      `macroCycle2=${r.macroCycle2}`,
      `canvasChildSequence=${r.canvasChildSequence}`,
      `deprecatedCycleOrder=${r.deprecatedCycleOrder}`,
      `canvasSouthMacroSouth=${r.canvasSouthMacroSouth}`,
      `canvasSouthChildSouth=${r.canvasSouthChildSouth}`,
      `canvasSouthDoesNotAuthorizeCanvasRelease=${r.canvasSouthDoesNotAuthorizeCanvasRelease}`,
      `canvasSouthDoesNotLatchF21=${r.canvasSouthDoesNotLatchF21}`,
      "",
      "FIBONACCI",
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `activeStageId=${r.activeStageId}`,
      `activeGearId=${r.activeGearId}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `f8SelfDutySatisfied=${r.f8SelfDutySatisfied}`,
      `f13ProofBodyAvailable=${r.f13ProofBodyAvailable}`,
      `f13VisibleEvidenceAvailable=${r.f13VisibleEvidenceAvailable}`,
      `f13VisibleEvidenceDegraded=${r.f13VisibleEvidenceDegraded}`,
      `f13InspectEvidenceAvailable=${r.f13InspectEvidenceAvailable}`,
      `f13sVisibleProofReady=${r.f13sVisibleProofReady}`,
      "",
      "READINESS",
      `canvasSouthLoaded=${r.canvasSouthLoaded}`,
      `canvasSouthApiReady=${r.canvasSouthApiReady}`,
      `canvasSouthReady=${r.canvasSouthReady}`,
      `textureReady=${r.textureReady}`,
      `renderReady=${r.renderReady}`,
      `visibleProofReady=${r.visibleProofReady}`,
      `southGateReady=${r.southGateReady}`,
      "",
      "TEXTURE",
      `textureCanvasAvailable=${r.textureCanvasAvailable}`,
      `textureWidth=${r.textureWidth}`,
      `textureHeight=${r.textureHeight}`,
      `textureSourceContract=${r.textureSourceContract}`,
      `textureSourceReceipt=${r.textureSourceReceipt}`,
      `textureComposeStarted=${r.textureComposeStarted}`,
      `textureComposeProgress=${r.textureComposeProgress}`,
      `textureComposeComplete=${r.textureComposeComplete}`,
      `textureProofComplete=${r.textureProofComplete}`,
      `textureHardFail=${r.textureHardFail}`,
      `textureInvalidated=${r.textureInvalidated}`,
      `textureInvalidationReason=${r.textureInvalidationReason}`,
      `textureInvalidationCount=${r.textureInvalidationCount}`,
      `textureRebuildRequested=${r.textureRebuildRequested}`,
      `textureRebuildComplete=${r.textureRebuildComplete}`,
      `currentTextureProofAt=${r.currentTextureProofAt}`,
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
      `canvasWidth=${r.canvasWidth}`,
      `canvasHeight=${r.canvasHeight}`,
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
      `proofBin=${r.proofBin}`,
      `currentVisibleProofValid=${r.currentVisibleProofValid}`,
      `visibleProofStale=${r.visibleProofStale}`,
      `staleProofSuppressed=${r.staleProofSuppressed}`,
      `currentVisibleProofAt=${r.currentVisibleProofAt}`,
      `lastValidVisibleProofAt=${r.lastValidVisibleProofAt}`,
      `visibleContentProofDoesNotMeanFinalVisualPass=${r.visibleContentProofDoesNotMeanFinalVisualPass}`,
      `f13VisibleEvidenceDoesNotMeanF21=${r.f13VisibleEvidenceDoesNotMeanF21}`,
      "",
      "INVALIDATION",
      `textureInvalidated=${r.textureInvalidated}`,
      `textureInvalidationReason=${r.textureInvalidationReason}`,
      `textureInvalidationCount=${r.textureInvalidationCount}`,
      `renderFrameStale=${r.renderFrameStale}`,
      `visibleProofStale=${r.visibleProofStale}`,
      `staleProofSuppressed=${r.staleProofSuppressed}`,
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
      `ownsReadyText=${r.ownsReadyText}`,
      `ownsF21=${r.ownsF21}`,
      "",
      "F21_BOUNDARY",
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21SubmittedToNorth=${r.f21SubmittedToNorth}`,
      `f21LatchMode=${r.f21LatchMode}`,
      `f21ClaimedByCanvasSouth=${r.f21ClaimedByCanvasSouth}`,
      `readyTextClaimedByCanvasSouth=${r.readyTextClaimedByCanvasSouth}`,
      "",
      "FINAL_CLAIMS",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      "ERRORS",
      errors,
      "",
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    parentSplitContract: PARENT_SPLIT_CONTRACT,
    version: VERSION,
    file: FILE,

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

    canvasSouthLoaded: true,
    canvasSouthActive: true,
    canvasSouthReady: true,
    splitAdapterRole: "SOUTH",
    splitAdapterTransistorMode: true,
    transistorAdapterActive: true,
    transistorRole: "drain",
    splitAdapterParentAligned: true,
    fatalErrorBoundaryActive: true,

    newsProtocolSynchronized: true,
    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    canvasGateReady: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: true,

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
    activeStageId: "canvas-south-texture-render-visible-proof",
    activeGearId: "hearth-canvas-south-f13s",
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,

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
    ownsReadyText: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    f21ClaimedByCanvasSouth: false,
    readyTextClaimedByCanvasSouth: false,

    get state() {
      deriveReadiness();
      return state;
    }
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvasSouth = api;
  root.HEARTH.canvasSouthTextureSphereVisibleProof = api;
  root.HEARTH.canvasSouthSplitAdapterDrainVisibleProofHardening = api;
  root.HEARTH.canvasSouthF13STextureRenderVisibleProofChild = api;

  root.HEARTH_CANVAS_SOUTH = api;
  root.HEARTH_CANVAS_SOUTH_TEXTURE_SPHERE_VISIBLE_PROOF = api;
  root.HEARTH_CANVAS_SOUTH_SPLIT_ADAPTER_DRAIN_VISIBLE_PROOF_HARDENING = api;
  root.HEARTH_CANVAS_SOUTH_F13S_TEXTURE_RENDER_VISIBLE_PROOF_CHILD = api;

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.hearthCanvasSouth = api;
  root.DEXTER_LAB.hearthCanvasSouthTextureSphereVisibleProof = api;
  root.DEXTER_LAB.hearthCanvasSouthSplitAdapterDrainVisibleProofHardening = api;
  root.DEXTER_LAB.hearthCanvasSouthF13STextureRenderVisibleProofChild = api;

  updateDataset();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
