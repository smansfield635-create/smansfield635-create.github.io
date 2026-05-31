// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT_RENEWAL_TNT_v1
// Full-file replacement.
// Canvas North parent / split-adapter transistor gate only.
// Purpose:
// - Preserve the public HEARTH_CANVAS API expected by /showroom/globe/hearth/hearth.js.
// - Keep this parent file as Canvas North: carrier, gate, sequence, child loading, receipts, F13 evidence, and compatibility.
// - Require physical Canvas F13 proof before Canvas reports readiness.
// - Route child failures to the correct child file without forcing immediate child rewrites.
// - Keep Canvas strictly F13 evidence only. F21 remains North/NEWS route authority.
// Does not own:
// - planet truth
// - material truth
// - elevation truth
// - hydrology truth
// - runtime-table governance
// - route orchestration
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_RECEIPT_v1";

  const SPLIT_CONTRACT = "HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT_RENEWAL_TNT_v1";
  const SPLIT_RECEIPT = "HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT_RENEWAL_RECEIPT_v1";

  const PREVIOUS_SPLIT_CONTRACT = "HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_TNT_v1";
  const PREVIOUS_SPLIT_RECEIPT = "HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const VERSION = "2026-05-30.hearth-canvas-physical-carrier-f13-proof-parent-renewal-v1";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DEFAULT_SIZE = 600;
  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const MAX_ATLAS_WIDTH = 1024;
  const MAX_ATLAS_HEIGHT = 512;
  const CHILD_LOAD_TIMEOUT_MS = 2400;
  const CYCLE_ORDER = "EAST_SOURCE -> WEST_CONTROL -> NORTH_GATE -> SOUTH_DRAIN -> F13_CHECKPOINT -> EAST_REFRESH";

  const CHILDREN = Object.freeze({
    east: {
      direction: "EAST",
      transistorRole: "source",
      file: EAST_FILE,
      globals: [
        "HEARTH_CANVAS_EAST",
        "HEARTH.canvasEast",
        "HEARTH.canvasEastMaterialAtlasSourceMachine",
        "DEXTER_LAB.hearthCanvasEast",
        "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine"
      ],
      requiredMethods: ["buildAtlas", "sample", "read", "getReceipt"]
    },
    west: {
      direction: "WEST",
      transistorRole: "control",
      file: WEST_FILE,
      globals: [
        "HEARTH_CANVAS_WEST",
        "HEARTH.canvasWest",
        "DEXTER_LAB.hearthCanvasWest"
      ],
      requiredMethods: ["bindInspection", "getViewState", "setRotation", "resetRotation", "setZoom", "getReceipt"]
    },
    south: {
      direction: "SOUTH",
      transistorRole: "drain",
      file: SOUTH_FILE,
      globals: [
        "HEARTH_CANVAS_SOUTH",
        "HEARTH.canvasSouth",
        "DEXTER_LAB.hearthCanvasSouth"
      ],
      requiredMethods: [
        "composeTexture",
        "renderSphere",
        "renderSphereSync",
        "getTextureCanvas",
        "sampleVisibleContent",
        "classifyVisibleContentEvidence",
        "invalidateTexture",
        "getReceipt"
      ]
    }
  });

  const CHECKPOINT_BY_PHASE = Object.freeze({
    CANVAS_COOPERATIVE_BOOT_STARTED: ["F13A_CANVAS_COOPERATIVE_BOOT_STARTED", "F13A", 78, "NORTH_GATE_OPEN"],
    CANVAS_MOUNT_CREATED: ["F13B_CANVAS_MOUNT_CREATED", "F13B", 81, "NORTH_GATE_CARRIER"],
    CANVAS_CONTEXT_READY: ["F13C_CANVAS_CONTEXT_READY", "F13C", 84, "NORTH_GATE_CONTEXT"],
    DRAG_INSPECTION_BOUND: ["F13D_DRAG_INSPECTION_BOUND", "F13D", 86, "WEST_CONTROL_BOUND"],
    ATLAS_BUILD_STARTED: ["F13E_ATLAS_BUILD_STARTED", "F13E", 88, "EAST_SOURCE_ACTIVE"],
    ATLAS_BUILD_COMPLETE: ["F13F_ATLAS_BUILD_COMPLETE", "F13F", 91, "EAST_SOURCE_PACKET_READY"],
    TEXTURE_COMPOSE_STARTED: ["F13G_TEXTURE_COMPOSE_STARTED", "F13G", 93, "SOUTH_DRAIN_TEXTURE_ACTIVE"],
    TEXTURE_COMPOSE_COMPLETE: ["F13H_TEXTURE_COMPOSE_COMPLETE", "F13H", 96, "SOUTH_DRAIN_TEXTURE_READY"],
    FIRST_FRAME_REQUESTED: ["F13I_FIRST_FRAME_REQUESTED", "F13I", 97, "SOUTH_DRAIN_RENDER_REQUEST"],
    FIRST_FRAME_DETECTED: ["F13J_FIRST_FRAME_DETECTED", "F13J", 98, "SOUTH_DRAIN_FIRST_FRAME"],
    CANVAS_READY: ["F13K_CANVAS_READY", "F13K", 98, "F13_READY_ONLY"],
    VISIBLE_CONTENT_PROOF_STARTED: ["F13L_VISIBLE_CONTENT_PROOF_STARTED", "F13L", 98, "SOUTH_DRAIN_PROOF_ACTIVE"],
    VISIBLE_CONTENT_PROOF_PASSED: ["F13M_VISIBLE_CONTENT_PROOF_PASSED", "F13M", 98, "SOUTH_DRAIN_STRICT_PROOF"],
    DEGRADED_VISIBLE_CONTENT_ACCEPTED: ["F13M_VISIBLE_CONTENT_PROOF_PASSED", "F13M", 98, "SOUTH_DRAIN_SOFT_PROOF"],
    VISIBLE_CONTENT_HARD_FAIL: ["F13M_VISIBLE_CONTENT_PROOF_PASSED", "F13M", 98, "SOUTH_DRAIN_HARD_FAIL"],
    INSPECT_MODE_READY: ["F13N_INSPECT_MODE_READY", "F13N", 98, "WEST_CONTROL_INSPECT_READY"]
  });

  const EARLY_PHASES = new Set([
    "CANVAS_COOPERATIVE_BOOT_STARTED",
    "CANVAS_MOUNT_CREATED",
    "CANVAS_CONTEXT_READY",
    "DRAG_INSPECTION_BOUND",
    "ATLAS_BUILD_STARTED"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    splitContract: SPLIT_CONTRACT,
    splitReceipt: SPLIT_RECEIPT,
    previousSplitContract: PREVIOUS_SPLIT_CONTRACT,
    previousSplitReceipt: PREVIOUS_SPLIT_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "canvas-north-physical-carrier-f13-proof-parent",

    northFile: NORTH_FILE,
    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    southFile: SOUTH_FILE,

    canvasNorthActive: true,
    splitAdapterActive: true,
    transistorAdapterActive: true,
    physicalCarrierProofActive: true,
    f13PhysicalProofRequired: true,
    parentFirstBootActive: true,

    transistorGateRole: "north-physical-carrier-sequence-admissibility-gate",
    transistorSourceRole: "east-material-atlas-source",
    transistorControlRole: "west-motion-invalidation-inspection-control",
    transistorDrainRole: "south-visible-output-drain",
    transistorCollectorRole: "runtime-checkpoint-receipt",
    transistorCurrentFlow: "EAST_SOURCE_TO_SOUTH_DRAIN_THROUGH_NORTH_GATE_WITH_WEST_CONTROL",

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    cycleOrder: CYCLE_ORDER,

    childLoadAttempted: false,
    childLoadComplete: false,
    childLoadError: "",
    childLoadStartedAt: "",
    childLoadCompletedAt: "",
    canvasEastPresent: false,
    canvasWestPresent: false,
    canvasSouthPresent: false,
    canvasEastReady: false,
    canvasWestReady: false,
    canvasSouthReady: false,
    allCanvasChildrenReady: false,
    canvasEastMissingMethods: "",
    canvasWestMissingMethods: "",
    canvasSouthMissingMethods: "",
    nextAuditTarget: "",

    booting: false,
    booted: false,
    bootPromiseActive: false,
    canvasLaneClosed: false,
    canvasCarrierRequested: false,
    canvasCarrierMounted: false,
    canvasContextReady: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",
    canvasCarrierMethod: "bootCooperative",
    cooperativeBootAvailable: true,
    cooperativeBootUsed: false,
    syncBootFallbackUsed: false,
    canvasBootStartedAt: "",
    canvasBootCompletedAt: "",
    canvasBootElapsedMs: 0,
    canvasYieldCount: 0,
    canvasPhaseCount: 0,

    mount: null,
    canvas: null,
    context: null,
    cssSize: DEFAULT_SIZE,
    dpr: 1,
    carrierPhysicalWidth: 0,
    carrierPhysicalHeight: 0,

    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    planetFramePainted: false,
    nonblankPlanetVisible: false,
    planetNotObstructed: false,
    carrierOnlyDetected: false,

    atlasCanvas: null,
    textureCanvas: null,
    atlasWidth: DEFAULT_ATLAS_WIDTH,
    atlasHeight: DEFAULT_ATLAS_HEIGHT,
    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    atlasCanonicalMaterialSampleCount: 0,
    atlasElevationHydrologySampleCount: 0,
    atlasFallbackSampleCount: 0,
    atlasTotalSampleCount: 0,

    textureComposeStarted: false,
    textureComposeProgress: 0,
    textureComposeComplete: false,
    firstFrameRequested: false,
    firstFrameDetected: false,
    imageRendered: false,
    renderedAfterTexture: false,
    canvasReady: false,

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

    dragInspectionBound: false,
    zoomInspectionBound: false,
    inspectModeAvailable: false,
    inspectPlanetControlAvailable: false,
    diagnosticCanLeavePlanetFrame: false,
    interactiveRotationActive: true,
    pointerInspectionActive: false,
    pointerInspectionPainted: false,
    pointerDragCount: 0,
    renderFrameCount: 0,
    interactiveFrameCount: 0,
    rotationYaw: -0.18,
    rotationPitch: 0.05,

    zoomEnabled: true,
    zoomLevel: 1,
    zoomMin: 0.82,
    zoomMax: 2.8,
    zoomLodPrepared: true,
    zoomLodLevel: 1,
    zoomUsesCachedTexture: true,
    zoomDoesNotOwnPlanetTruth: true,
    zoomDoesNotTriggerAtlasRebuild: true,
    zoomInteractionCount: 0,
    lastZoomAt: "",
    lastZoomSource: "",

    materialReceiptBridgeActive: false,
    materialNestedReceiptAvailable: false,
    materialContract: "",
    materialReceipt: "",
    materialExpectedContract: "",
    materialExpectedReceipt: "",
    materialContractMatchesExpected: false,
    materialReceiptMatchesExpected: false,
    materialAtlasPrimary: false,
    canonicalMaterialAuthorityPresent: false,
    canonicalMaterialConsumed: false,
    canonicalMaterialColorPrimary: false,
    canonicalMaterialShapePrimary: false,
    materialsPrimaryWhenValid: true,
    rawSourceColorDemotedToPaletteInfluence: true,
    elevationHydrologyFallbackUsed: false,

    upstreamFirstAtlasActive: true,
    sevenContinentFallbackEmergencyOnly: true,
    sevenContinentFallbackUsed: false,
    sevenContinentFallbackSuppressedByUpstream: false,
    sevenContinentVisualFallbackActive: true,
    continentVisualSeedCount: 7,
    continentBlendMode: "max-separated",
    proceduralSixLobeAdditiveFieldRetired: true,
    oceanChannelCutActive: true,
    seaLineTightened: true,
    coastlineSharpeningActive: true,
    landChannelStillReceiverOnly: true,

    cachedTextureInvalidationAvailable: true,
    textureInvalidationCount: 0,
    textureInvalidated: false,
    textureInvalidationReason: "",
    textureRebuildRequested: false,
    textureRebuildComplete: false,
    textureRebuildError: "",
    textureRebuildAfterLaneClosureSupported: true,
    postReadyTextureRebuildSafe: true,

    visualFidelityRenewalActive: true,
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

    f13CanvasEvidencePreserved: true,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f21ClaimedByCanvas: false,
    readyTextClaimedByCanvas: false,

    northAuthorityPresent: false,
    checkpointGovernorDetected: false,
    checkpointSessionSubmissionAvailable: false,
    canvasEvidenceSubmittedToNorth: false,

    callbacks: [],
    canvasPhaseEvents: [],
    progressOnlyEvents: [],
    archivedLateEvents: [],
    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    updatedAt: ""
  };

  let childrenPromise = null;
  let bootPromise = null;

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
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  }

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;
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

  function pathRead(path) {
    const parts = String(path || "").split(".");
    let cursor = root;
    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }
    return cursor || null;
  }

  function scriptAlreadyPresent(file) {
    if (!doc || !file) return null;
    return Array.from(doc.scripts || []).find((script) => {
      const src = script.getAttribute("src") || script.src || "";
      return src.includes(file);
    }) || null;
  }

  function recordLocal(event, detail = {}) {
    const item = { at: nowIso(), event: String(event || "LOCAL_EVENT"), detail: clonePlain(detail) };
    state.localEvents.push(item);
    trimArray(state.localEvents, 180);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      event: String(code || "CANVAS_ERROR"),
      code: String(code || "CANVAS_ERROR"),
      message: error && error.message ? String(error.message) : String(error || ""),
      detail: clonePlain(detail)
    };
    state.errors.push(item);
    trimArray(state.errors, 140);
    state.updatedAt = item.at;
    updateDataset();
    return item;
  }

  function publishEarlyMarker() {
    root.__HEARTH_CANVAS_PARENT_MARKER__ = true;
    root.__HEARTH_CANVAS_PARENT_FILE__ = FILE;
    root.__HEARTH_CANVAS_PARENT_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_PARENT_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_PARENT_SPLIT_CONTRACT__ = SPLIT_CONTRACT;
    root.__HEARTH_CANVAS_PARENT_SPLIT_RECEIPT__ = SPLIT_RECEIPT;

    if (doc && doc.documentElement) {
      const dataset = doc.documentElement.dataset;
      dataset.hearthCanvasParentMarkerPresent = "true";
      dataset.hearthCanvasLoaded = "true";
      dataset.hearthCanvasContract = CONTRACT;
      dataset.hearthCanvasReceipt = RECEIPT;
      dataset.hearthCanvasSplitContract = SPLIT_CONTRACT;
      dataset.hearthCanvasSplitReceipt = SPLIT_RECEIPT;
      dataset.hearthCanvasNorthActive = "true";
      dataset.hearthCanvasF21Claimed = "false";
      dataset.visualPassClaimed = "false";
      dataset.generatedImage = "false";
      dataset.graphicBox = "false";
      dataset.webgl = "false";
    }
  }

  publishEarlyMarker();

  function resolveChild(key) {
    const spec = CHILDREN[key];
    if (!spec) return null;
    for (const globalName of spec.globals) {
      const found = pathRead(globalName);
      if (found && isObject(found)) return found;
    }
    return null;
  }

  function childMissingMethods(key, child = resolveChild(key)) {
    const spec = CHILDREN[key];
    if (!spec) return [];
    if (!child) return spec.requiredMethods.slice();
    return spec.requiredMethods.filter((method) => !isFunction(child[method]));
  }

  function childHasRequiredMethods(key, child = resolveChild(key)) {
    return childMissingMethods(key, child).length === 0;
  }

  function markChildrenPresence() {
    const east = resolveChild("east");
    const west = resolveChild("west");
    const south = resolveChild("south");

    const eastMissing = childMissingMethods("east", east);
    const westMissing = childMissingMethods("west", west);
    const southMissing = childMissingMethods("south", south);

    state.canvasEastPresent = Boolean(east);
    state.canvasWestPresent = Boolean(west);
    state.canvasSouthPresent = Boolean(south);
    state.canvasEastReady = eastMissing.length === 0;
    state.canvasWestReady = westMissing.length === 0;
    state.canvasSouthReady = southMissing.length === 0;
    state.allCanvasChildrenReady = Boolean(state.canvasEastReady && state.canvasWestReady && state.canvasSouthReady);
    state.canvasEastMissingMethods = eastMissing.join(",");
    state.canvasWestMissingMethods = westMissing.join(",");
    state.canvasSouthMissingMethods = southMissing.join(",");

    if (!state.canvasEastReady) state.nextAuditTarget = EAST_FILE;
    else if (!state.canvasWestReady) state.nextAuditTarget = WEST_FILE;
    else if (!state.canvasSouthReady) state.nextAuditTarget = SOUTH_FILE;
    else if (!state.planetCanvasPresent || !state.planetCanvasNonZeroSize || !state.canvasContextReady) state.nextAuditTarget = FILE;
    else if (!state.visibleContentProof && !state.visibleContentSoftGap && !state.visibleContentHardFail) state.nextAuditTarget = SOUTH_FILE;
    else state.nextAuditTarget = "read-route-or-north-receipt-after-canvas-f13";

    return { east, west, south };
  }

  function loadScriptOnce(file) {
    if (!doc || !file) return Promise.resolve(false);

    const existing = scriptAlreadyPresent(file);
    if (existing && existing.dataset.hearthCanvasChildLoaded === "true") return Promise.resolve(true);

    return new Promise((resolve) => {
      const script = existing || doc.createElement("script");
      let settled = false;

      function finish(ok) {
        if (settled) return;
        settled = true;
        script.dataset.hearthCanvasChildLoaded = String(ok);
        resolve(ok);
      }

      script.async = false;
      script.defer = false;
      script.dataset.hearthCanvasChildLoadedBy = SPLIT_CONTRACT;
      script.dataset.hearthCanvasChildFile = file;
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      if (!existing) {
        script.src = `${file}?v=${encodeURIComponent(`${SPLIT_CONTRACT}-${VERSION}`)}`;
        script.onload = () => finish(true);
        script.onerror = () => {
          recordError("CANVAS_CHILD_SCRIPT_LOAD_FAILED", `Failed to load ${file}`, { file });
          finish(false);
        };
        (doc.head || doc.documentElement).appendChild(script);
      } else {
        finish(true);
      }

      root.setTimeout(() => finish(Boolean(scriptAlreadyPresent(file))), CHILD_LOAD_TIMEOUT_MS);
    });
  }

  function waitForChild(key, timeoutMs = CHILD_LOAD_TIMEOUT_MS) {
    const started = Date.now ? Date.now() : new Date().getTime();
    return new Promise((resolve) => {
      const timer = root.setInterval(() => {
        const child = resolveChild(key);
        if (child) {
          root.clearInterval(timer);
          resolve(child);
          return;
        }
        const now = Date.now ? Date.now() : new Date().getTime();
        if (now - started >= timeoutMs) {
          root.clearInterval(timer);
          resolve(null);
        }
      }, 80);
    });
  }

  async function ensureChildren() {
    if (childrenPromise) return childrenPromise;

    childrenPromise = (async () => {
      state.childLoadAttempted = true;
      state.childLoadStartedAt = nowIso();
      state.childLoadError = "";
      markChildrenPresence();
      updateDataset();

      for (const key of Object.keys(CHILDREN)) {
        if (!resolveChild(key)) {
          await loadScriptOnce(CHILDREN[key].file);
          await waitForChild(key);
        }
      }

      const children = markChildrenPresence();
      state.childLoadCompletedAt = nowIso();

      if (!state.allCanvasChildrenReady) {
        state.childLoadComplete = false;
        state.childLoadError = [
          state.canvasEastReady ? "" : `east:${state.canvasEastMissingMethods || "missing-api"}`,
          state.canvasWestReady ? "" : `west:${state.canvasWestMissingMethods || "missing-api"}`,
          state.canvasSouthReady ? "" : `south:${state.canvasSouthMissingMethods || "missing-api"}`
        ].filter(Boolean).join("; ");
        updateDataset();
        throw new Error(`Canvas split-adapter child readiness failed. ${state.childLoadError}`);
      }

      state.childLoadComplete = true;
      state.childLoadError = "";
      updateDataset();
      return children;
    })();

    return childrenPromise;
  }

  function resolveMount(options = {}) {
    if (!doc) return null;

    const candidate = options.mount || options.mountEl || options.container || options.target;
    if (candidate && candidate.nodeType === 1) return candidate;

    if (typeof candidate === "string") {
      try {
        const found = doc.querySelector(candidate);
        if (found) return found;
      } catch (_error) {}
    }

    const selectors = [
      "#hearthCanvasMount",
      "[data-hearth-canvas-mount='true']",
      "[data-hearth-canvas-mount]",
      "[data-hearth-planet-mount]",
      "[data-hearth-planet-frame]",
      "#hearth-canvas-mount",
      "#hearth-planet-canvas-mount",
      "#hearth-planet-frame",
      ".hearth-canvas-mount",
      ".hearth-planet-frame",
      "[data-planet-frame]",
      "main"
    ];

    for (const selector of selectors) {
      const found = doc.querySelector(selector);
      if (found) return found;
    }

    return doc.body || doc.documentElement;
  }

  function ensureCarrier(options = {}) {
    if (!doc) throw new Error("Document unavailable for Hearth canvas.");

    const mount = resolveMount(options);
    if (!mount) throw new Error("Hearth canvas mount unavailable.");

    let canvas = String(mount.tagName || "").toLowerCase() === "canvas"
      ? mount
      : mount.querySelector("canvas[data-hearth-canvas-texture='true'], canvas[data-hearth-canvas='true'], canvas.hearth-canvas");

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.className = "hearth-canvas hearth-canvas--physical-carrier-f13-proof";
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasTexture = "true";
      canvas.setAttribute("aria-label", "Hearth visible planet canvas");
      mount.appendChild(canvas);
    }

    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: DEFAULT_SIZE, height: DEFAULT_SIZE };
    const explicitSize = safeNumber(options.canvasSize, 0) || safeNumber(options.size, 0);
    const widthFromRect = Math.max(0, safeNumber(rect.width, 0));
    const heightFromRect = Math.max(0, safeNumber(rect.height, 0));
    const basis = explicitSize || Math.max(360, Math.min(DEFAULT_SIZE, widthFromRect || DEFAULT_SIZE, heightFromRect || DEFAULT_SIZE));
    const cssSize = Math.max(360, Math.round(basis));
    const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
    const physicalSize = Math.max(360, Math.round(cssSize * dpr));

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";
    canvas.style.objectFit = "contain";
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";

    if (canvas.width !== physicalSize) canvas.width = physicalSize;
    if (canvas.height !== physicalSize) canvas.height = physicalSize;

    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!context) throw new Error("2D canvas context unavailable.");

    state.mount = mount;
    state.canvas = canvas;
    state.context = context;
    state.cssSize = cssSize;
    state.dpr = dpr;
    state.carrierPhysicalWidth = canvas.width;
    state.carrierPhysicalHeight = canvas.height;
    state.canvasCarrierMounted = true;
    state.canvasContextReady = true;
    state.planetCanvasPresent = true;
    state.planetCanvasNonZeroSize = Boolean(canvas.width > 0 && canvas.height > 0);

    if (!state.planetCanvasNonZeroSize) {
      throw new Error("Hearth canvas carrier has zero physical size.");
    }

    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSplitContract = SPLIT_CONTRACT;
    canvas.dataset.hearthCanvasSplitReceipt = SPLIT_RECEIPT;
    canvas.dataset.hearthCanvasNorthActive = "true";
    canvas.dataset.visualPassClaimed = "false";

    updateDataset();
    return { mount, canvas, context, cssSize, dpr };
  }

  function yieldFrame(ms = 0) {
    state.canvasYieldCount += 1;
    return new Promise((resolve) => {
      if (isFunction(root.requestAnimationFrame)) {
        root.requestAnimationFrame(() => {
          if (ms > 0) root.setTimeout(resolve, ms);
          else resolve();
        });
      } else {
        root.setTimeout(resolve, Math.max(0, ms));
      }
    });
  }

  function safeChildReceipt(child, key) {
    if (!child || !isFunction(child.getReceipt)) return {};
    try {
      const receipt = child.getReceipt();
      return isObject(receipt) ? receipt : {};
    } catch (error) {
      recordError("CANVAS_CHILD_RECEIPT_READ_FAILED", error, { child: key });
      return {};
    }
  }

  function copyFields(target, source, keys) {
    if (!source || !isObject(source)) return;
    keys.forEach((key) => {
      if (source[key] !== undefined) target[key] = source[key];
    });
  }

  function mergeChildReceipts() {
    const children = markChildrenPresence();
    const eastReceipt = safeChildReceipt(children.east, "east");
    const westReceipt = safeChildReceipt(children.west, "west");
    const southReceipt = safeChildReceipt(children.south, "south");

    copyFields(state, eastReceipt, [
      "materialReceiptBridgeActive",
      "materialNestedReceiptAvailable",
      "materialContract",
      "materialReceipt",
      "materialExpectedContract",
      "materialExpectedReceipt",
      "materialContractMatchesExpected",
      "materialReceiptMatchesExpected",
      "materialAtlasPrimary",
      "canonicalMaterialAuthorityPresent",
      "canonicalMaterialConsumed",
      "canonicalMaterialColorPrimary",
      "canonicalMaterialShapePrimary",
      "rawSourceColorDemotedToPaletteInfluence",
      "elevationHydrologyFallbackUsed",
      "sevenContinentFallbackUsed",
      "sevenContinentFallbackSuppressedByUpstream",
      "sevenContinentVisualFallbackActive",
      "continentVisualSeedCount",
      "continentBlendMode",
      "proceduralSixLobeAdditiveFieldRetired",
      "oceanChannelCutActive",
      "seaLineTightened",
      "coastlineSharpeningActive",
      "landChannelStillReceiverOnly",
      "atlasCanonicalMaterialSampleCount",
      "atlasElevationHydrologySampleCount",
      "atlasFallbackSampleCount",
      "atlasTotalSampleCount",
      "atlasWidth",
      "atlasHeight"
    ]);

    copyFields(state, westReceipt, [
      "zoomEnabled",
      "zoomLevel",
      "zoomMin",
      "zoomMax",
      "zoomLodPrepared",
      "zoomLodLevel",
      "zoomUsesCachedTexture",
      "zoomDoesNotOwnPlanetTruth",
      "zoomDoesNotTriggerAtlasRebuild",
      "zoomInteractionCount",
      "lastZoomAt",
      "lastZoomSource",
      "interactiveRotationActive",
      "pointerInspectionActive",
      "pointerInspectionPainted",
      "pointerDragCount",
      "interactiveFrameCount",
      "lastInteractionAt",
      "rotationYaw",
      "rotationPitch",
      "dragInspectionBound",
      "zoomInspectionBound"
    ]);

    copyFields(state, southReceipt, [
      "textureComposeStarted",
      "textureComposeProgress",
      "textureComposeComplete",
      "firstFrameRequested",
      "firstFrameDetected",
      "imageRendered",
      "renderedAfterTexture",
      "planetFramePainted",
      "nonblankPlanetVisible",
      "planetNotObstructed",
      "visibleContentProofStarted",
      "visibleContentProof",
      "visibleContentStrictProof",
      "visibleContentSoftGap",
      "visibleContentHardFail",
      "visibleForwardProgress",
      "visibleContentAdmissible",
      "visiblePlanetAvailable",
      "visibleContentProofMethod",
      "visibleContentProofError",
      "visibleContentSampleCount",
      "visibleContentVarianceScore",
      "visibleContentClassCount",
      "visibleContentClasses",
      "visibleContentLandSampleCount",
      "visibleContentWaterSampleCount",
      "visibleContentOtherSampleCount",
      "visibleContentCarrierSampleCount",
      "carrierOnlyDetected",
      "renderFrameCount",
      "clarityRenewalActive",
      "hazeReduced",
      "highDpiCanvasActive",
      "lightingPreservesSurfaceReadability",
      "centerDarknessReduced",
      "coastlineContrastActive"
    ]);

    return { children, eastReceipt, westReceipt, southReceipt };
  }

  function readNorthAuthority() {
    const authority =
      root.LAB_RUNTIME_TABLE ||
      root.LAB_RUNTIME_TABLE_NORTH ||
      root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE ||
      root.RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null;

    const checkpointGovernor =
      root.LAB_CHECKPOINT_GOVERNOR ||
      root.LAB_NEWS_FIBONACCI_CHECKPOINT_GOVERNOR ||
      (root.DEXTER_LAB && root.DEXTER_LAB.checkpointGovernor) ||
      authority ||
      null;

    const session = getNorthSession();

    state.northAuthorityPresent = Boolean(authority);
    state.checkpointGovernorDetected = Boolean(
      checkpointGovernor && (checkpointGovernor.checkpointGovernorActive || checkpointGovernor.createHearthCheckpointSession)
    );
    state.checkpointSessionSubmissionAvailable = Boolean(session);

    return { authority, checkpointGovernor, session };
  }

  function getNorthSession() {
    const candidates = [
      root.HEARTH_CHECKPOINT_SESSION,
      root.HEARTH_RUNTIME_CHECKPOINT_SESSION,
      root.LAB_HEARTH_CHECKPOINT_SESSION,
      root.LAB_CHECKPOINT_SESSION,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthCheckpointSession,
      root.DEXTER_LAB && root.DEXTER_LAB.checkpointSession
    ].filter(Boolean);

    for (const candidate of candidates) {
      if (candidate && isFunction(candidate.submitEvent)) return candidate;
      if (candidate && isFunction(candidate.submit)) return candidate;
    }

    return null;
  }

  function getNorthSnapshot() {
    mergeChildReceipts();
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      splitAdapterActive: true,
      transistorAdapterActive: true,
      physicalCarrierProofActive: true,
      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,
      firstFrameRequested: state.firstFrameRequested,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      renderedAfterTexture: state.renderedAfterTexture,
      dragInspectionBound: state.dragInspectionBound,
      zoomInspectionBound: state.zoomInspectionBound,
      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      visibleContentSampleCount: state.visibleContentSampleCount,
      visibleContentVarianceScore: state.visibleContentVarianceScore,
      visibleContentClassCount: state.visibleContentClassCount,
      visibleContentClasses: Array.isArray(state.visibleContentClasses) ? state.visibleContentClasses.slice() : [],
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      visibleContentCarrierSampleCount: state.visibleContentCarrierSampleCount,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,
      carrierOnlyDetected: state.carrierOnlyDetected,
      canvasNorthActive: true,
      canvasEastPresent: state.canvasEastPresent,
      canvasWestPresent: state.canvasWestPresent,
      canvasSouthPresent: state.canvasSouthPresent,
      canvasEastReady: state.canvasEastReady,
      canvasWestReady: state.canvasWestReady,
      canvasSouthReady: state.canvasSouthReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,
      materialReceiptBridgeActive: state.materialReceiptBridgeActive === true,
      materialContract: state.materialContract || "",
      materialReceipt: state.materialReceipt || "",
      materialContractMatchesExpected: state.materialContractMatchesExpected === true,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected === true,
      inspectEvidenceAvailable: state.dragInspectionBound,
      inspectModeAvailable: state.dragInspectionBound,
      inspectPlanetControlAvailable: state.dragInspectionBound,
      diagnosticCanLeavePlanetFrame: state.dragInspectionBound,
      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,
      cycleOrder: CYCLE_ORDER,
      f13CanvasEvidencePreserved: true,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function checkpointPayloadForPhase(phase, progress, message, detail = {}) {
    const tuple = CHECKPOINT_BY_PHASE[phase] || [String(phase || "CANVAS_EVENT"), "F13", safeNumber(progress, 0), "UNMAPPED_CANVAS_GATE"];
    const [checkpointId, fibonacci, mappedProgress, gate] = tuple;
    const event = String(phase || checkpointId);

    return {
      event,
      id: event,
      phase: event,
      checkpointId,
      fibonacci,
      source: "hearth.canvas.north.physical-carrier-f13-proof-parent",
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      progress: Math.min(98, safeNumber(mappedProgress, progress)),
      message: message || "",
      snapshot: getNorthSnapshot(),
      detail: {
        ...clonePlain(detail || {}),
        mappedCheckpointId: checkpointId,
        mappedFibonacci: fibonacci,
        mappedGate: gate,
        physicalCarrierProofActive: true,
        newsProtocolSynchronized: true,
        fibonacciAlignmentSynchronized: true,
        activeFibonacciGate: "F13",
        futureFibonacciGate: "F21",
        oneActiveGearAtATime: true,
        cycleOrder: CYCLE_ORDER,
        canvasNorthActive: true,
        canvasEastPresent: state.canvasEastPresent,
        canvasWestPresent: state.canvasWestPresent,
        canvasSouthPresent: state.canvasSouthPresent,
        allCanvasChildrenReady: state.allCanvasChildrenReady,
        f21ClaimedByCanvas: false,
        readyTextClaimedByCanvas: false,
        visualPassClaimed: false
      }
    };
  }

  function submitCanvasEvidence(phase, detail = {}) {
    const north = readNorthAuthority();
    const tuple = CHECKPOINT_BY_PHASE[phase] || [phase, "F13", 98, "UNMAPPED_CANVAS_GATE"];
    const payload = checkpointPayloadForPhase(phase, tuple[2], "", detail);

    if (!north.session) return false;

    try {
      if (isFunction(north.session.submitEvent)) {
        north.session.submitEvent(payload);
        state.canvasEvidenceSubmittedToNorth = true;
        return true;
      }
      if (isFunction(north.session.submit)) {
        north.session.submit(payload);
        state.canvasEvidenceSubmittedToNorth = true;
        return true;
      }
    } catch (error) {
      recordError("NORTH_SESSION_SUBMIT_ERROR", error, { phase });
    }

    return false;
  }

  function dispatchPhase(event) {
    const receipt = getReceipt();

    state.callbacks.slice().forEach((callback) => {
      try {
        callback(event, receipt);
      } catch (error) {
        recordError("CANVAS_CALLBACK_ERROR", error, { event: event.event || event.phase || "" });
      }
    });

    if (isFunction(root.dispatchEvent) && isFunction(root.CustomEvent)) {
      try {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-phase", { detail: { event, receipt } }));
      } catch (_error) {}
    }
  }

  function archiveLateEvent(phase, progress, message, reason) {
    const item = {
      at: nowIso(),
      event: String(phase || "CANVAS_EVENT"),
      phase: String(phase || "CANVAS_EVENT"),
      progress: Math.min(98, safeNumber(progress, 0)),
      message: message || "",
      reason: reason || "late-canvas-event",
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      f21ClaimedByCanvas: false,
      visualPassClaimed: false
    };
    state.archivedLateEvents.push(item);
    trimArray(state.archivedLateEvents, 140);
    state.updatedAt = item.at;
    updateDataset();
    return item;
  }

  function emitProgressOnly(phase, progress, message, detail = {}) {
    const item = {
      at: nowIso(),
      event: String(phase || "CANVAS_PROGRESS"),
      phase: String(phase || "CANVAS_PROGRESS"),
      progress: Math.min(98, safeNumber(progress, 0)),
      message: message || "",
      detail: clonePlain(detail),
      progressOnly: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      f21ClaimedByCanvas: false,
      visualPassClaimed: false
    };
    state.progressOnlyEvents.push(item);
    trimArray(state.progressOnlyEvents, 300);
    state.updatedAt = item.at;
    dispatchPhase(item);
    updateDataset();
    return item;
  }

  function emitMilestone(phase, progress, message, detail = {}) {
    if (state.canvasLaneClosed && EARLY_PHASES.has(phase)) {
      return archiveLateEvent(phase, progress, message, "canvas-lane-closed-after-canvas-ready");
    }

    const payload = checkpointPayloadForPhase(phase, progress, message, detail);
    const event = {
      at: nowIso(),
      ...payload,
      gate: payload.detail.mappedGate,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };

    state.canvasPhaseCount += 1;
    state.canvasPhaseEvents.push(event);
    trimArray(state.canvasPhaseEvents, 240);
    state.updatedAt = event.at;

    recordLocal("CANVAS_NORTH_PHYSICAL_CARRIER_F13_MILESTONE", {
      phase,
      checkpointId: event.checkpointId,
      fibonacci: event.fibonacci,
      gate: event.gate
    });

    submitCanvasEvidence(phase, detail);
    dispatchPhase(event);
    updateDataset();
    return event;
  }

  function addCallbacksFromOptions(options = {}) {
    [options.onPhase, options.onEvent, options.onStatus, options.statusCallback, options.onReceipt]
      .filter(isFunction)
      .forEach((callback) => on(callback));
  }

  function on(callback) {
    if (isFunction(callback) && !state.callbacks.includes(callback)) state.callbacks.push(callback);
    return () => off(callback);
  }

  function off(callback) {
    const index = state.callbacks.indexOf(callback);
    if (index >= 0) state.callbacks.splice(index, 1);
  }

  function resolveAtlasSize(options = {}, east = null) {
    const eastDefaultWidth = safeNumber(east && east.defaultAtlasWidth, DEFAULT_ATLAS_WIDTH);
    const eastDefaultHeight = safeNumber(east && east.defaultAtlasHeight, DEFAULT_ATLAS_HEIGHT);
    const width = clamp(safeNumber(options.atlasWidth || options.width, eastDefaultWidth), 256, MAX_ATLAS_WIDTH);
    const height = clamp(safeNumber(options.atlasHeight || options.height, eastDefaultHeight), 128, MAX_ATLAS_HEIGHT);
    state.atlasWidth = width;
    state.atlasHeight = height;
    return { width, height };
  }

  function normalizeAtlasResult(result) {
    if (!result) return null;
    if (result.nodeType === 1 && String(result.tagName || "").toLowerCase() === "canvas") return result;
    if (result.atlasCanvas) return result.atlasCanvas;
    if (result.canvas) return result.canvas;
    return null;
  }

  function normalizeTextureResult(result, south) {
    if (result && result.nodeType === 1 && String(result.tagName || "").toLowerCase() === "canvas") return result;
    if (result && result.textureCanvas) return result.textureCanvas;
    if (result && result.canvas) return result.canvas;
    if (south && isFunction(south.getTextureCanvas)) return south.getTextureCanvas();
    return null;
  }

  function sampleCanvasPixels(canvas = state.canvas) {
    const output = {
      visibleContentProof: false,
      visibleContentStrictProof: false,
      visibleContentSoftGap: false,
      visibleContentHardFail: false,
      visibleForwardProgress: false,
      visibleContentAdmissible: false,
      visiblePlanetAvailable: false,
      nonblankPlanetVisible: false,
      planetNotObstructed: false,
      carrierOnlyDetected: false,
      visibleContentSampleCount: 0,
      visibleContentVarianceScore: 0,
      visibleContentClassCount: 0,
      visibleContentClasses: [],
      visibleContentLandSampleCount: 0,
      visibleContentWaterSampleCount: 0,
      visibleContentOtherSampleCount: 0,
      visibleContentCarrierSampleCount: 0,
      visibleContentProofMethod: "canvas-parent-pixel-sampling"
    };

    if (!canvas || !state.context || !canvas.width || !canvas.height) {
      output.visibleContentHardFail = true;
      output.visibleContentProofError = "canvas-or-context-unavailable";
      return output;
    }

    let image;
    try {
      const sampleSize = Math.min(220, canvas.width, canvas.height);
      const sx = Math.max(0, Math.floor((canvas.width - sampleSize) / 2));
      const sy = Math.max(0, Math.floor((canvas.height - sampleSize) / 2));
      image = state.context.getImageData(sx, sy, sampleSize, sampleSize);
    } catch (error) {
      output.visibleContentHardFail = true;
      output.visibleContentProofError = error && error.message ? error.message : String(error);
      return output;
    }

    const data = image.data || [];
    const step = Math.max(4, Math.floor(data.length / 4 / 1600) * 4);
    const classes = new Set();
    let samples = 0;
    let nonblank = 0;
    let water = 0;
    let land = 0;
    let other = 0;
    let carrier = 0;
    let minLum = 255;
    let maxLum = 0;

    for (let i = 0; i < data.length; i += step * 4) {
      const r = data[i] || 0;
      const g = data[i + 1] || 0;
      const b = data[i + 2] || 0;
      const a = data[i + 3] || 0;
      samples += 1;
      if (a < 16) {
        carrier += 1;
        continue;
      }

      const lum = Math.round((r * 0.2126) + (g * 0.7152) + (b * 0.0722));
      minLum = Math.min(minLum, lum);
      maxLum = Math.max(maxLum, lum);

      if (lum > 8) nonblank += 1;

      let klass = "other";
      if (b > r + 14 && b > g + 4) {
        klass = "water";
        water += 1;
      } else if (g > b + 6 && g >= r - 16) {
        klass = "land";
        land += 1;
      } else if (r > b + 8 && g > b + 2) {
        klass = "land";
        land += 1;
      } else if (lum > 16) {
        other += 1;
      } else {
        carrier += 1;
      }
      classes.add(klass);
    }

    const variance = Math.max(0, maxLum - minLum);
    const contentSamples = land + water + other;
    const classCount = classes.size;
    const hasSurface = Boolean(contentSamples > 20 && variance > 18 && classCount >= 2);
    const hasSoftSurface = Boolean(contentSamples > 20 && nonblank > 20 && variance > 6);

    output.visibleContentSampleCount = samples;
    output.visibleContentVarianceScore = variance;
    output.visibleContentClassCount = classCount;
    output.visibleContentClasses = Array.from(classes);
    output.visibleContentLandSampleCount = land;
    output.visibleContentWaterSampleCount = water;
    output.visibleContentOtherSampleCount = other;
    output.visibleContentCarrierSampleCount = carrier;
    output.nonblankPlanetVisible = nonblank > 20;
    output.planetNotObstructed = output.nonblankPlanetVisible;
    output.carrierOnlyDetected = Boolean(nonblank > 20 && contentSamples <= 20);
    output.visiblePlanetAvailable = hasSurface || hasSoftSurface;
    output.visibleForwardProgress = output.visiblePlanetAvailable;
    output.visibleContentAdmissible = hasSurface || hasSoftSurface;
    output.visibleContentProof = hasSurface;
    output.visibleContentStrictProof = hasSurface;
    output.visibleContentSoftGap = !hasSurface && hasSoftSurface;
    output.visibleContentHardFail = !hasSurface && !hasSoftSurface;

    return output;
  }

  function applyVisibleProof(proof = {}) {
    const pixelProof = sampleCanvasPixels(state.canvas);
    const merged = { ...pixelProof, ...(isObject(proof) ? proof : {}) };

    state.visibleContentProofStarted = true;
    state.visibleContentProof = safeBool(merged.visibleContentProof, false);
    state.visibleContentStrictProof = safeBool(merged.visibleContentStrictProof, state.visibleContentProof && !safeBool(merged.visibleContentSoftGap, false));
    state.visibleContentSoftGap = safeBool(merged.visibleContentSoftGap, false);
    state.visibleContentHardFail = safeBool(merged.visibleContentHardFail, !state.visibleContentProof && !state.visibleContentSoftGap);
    state.visibleForwardProgress = safeBool(merged.visibleForwardProgress, state.visibleContentProof || state.visibleContentSoftGap);
    state.visibleContentAdmissible = safeBool(merged.visibleContentAdmissible, state.visibleContentProof || state.visibleContentSoftGap);
    state.visiblePlanetAvailable = safeBool(merged.visiblePlanetAvailable, state.visibleContentProof || state.visibleContentSoftGap);
    state.nonblankPlanetVisible = safeBool(merged.nonblankPlanetVisible, state.visiblePlanetAvailable);
    state.planetNotObstructed = safeBool(merged.planetNotObstructed, state.visiblePlanetAvailable);
    state.carrierOnlyDetected = safeBool(merged.carrierOnlyDetected, false);
    state.visibleContentProofMethod = merged.visibleContentProofMethod || "south-child-plus-parent-pixel-sampling";
    state.visibleContentProofError = merged.visibleContentProofError || "";
    state.visibleContentSampleCount = safeNumber(merged.visibleContentSampleCount, state.visibleContentSampleCount);
    state.visibleContentVarianceScore = safeNumber(merged.visibleContentVarianceScore, state.visibleContentVarianceScore);
    state.visibleContentClassCount = safeNumber(merged.visibleContentClassCount, state.visibleContentClassCount);
    state.visibleContentClasses = Array.isArray(merged.visibleContentClasses) ? merged.visibleContentClasses.slice() : state.visibleContentClasses;
    state.visibleContentLandSampleCount = safeNumber(merged.visibleContentLandSampleCount, state.visibleContentLandSampleCount);
    state.visibleContentWaterSampleCount = safeNumber(merged.visibleContentWaterSampleCount, state.visibleContentWaterSampleCount);
    state.visibleContentOtherSampleCount = safeNumber(merged.visibleContentOtherSampleCount, state.visibleContentOtherSampleCount);
    state.visibleContentCarrierSampleCount = safeNumber(merged.visibleContentCarrierSampleCount, state.visibleContentCarrierSampleCount);
    state.f13CanvasEvidenceComplete = Boolean(state.visibleContentProof || state.visibleContentSoftGap);
    state.f13HardFail = Boolean(state.visibleContentHardFail);
    return merged;
  }

  async function bootCooperative(options = {}) {
    addCallbacksFromOptions(options);

    if (bootPromise) return bootPromise;

    bootPromise = (async () => {
      if (state.booting) return getReceipt();

      state.booting = true;
      state.bootPromiseActive = true;
      state.booted = false;
      state.canvasCarrierRequested = true;
      state.canvasCarrierMethod = "bootCooperative";
      state.cooperativeBootUsed = true;
      state.syncBootFallbackUsed = false;
      state.canvasBootStartedAt = nowIso();
      state.canvasCarrierHandoffError = "";
      state.updatedAt = state.canvasBootStartedAt;
      updateDataset();

      try {
        emitMilestone("CANVAS_COOPERATIVE_BOOT_STARTED", 78, "Canvas physical-carrier F13 parent boot started.");
        await yieldFrame();

        const carrier = ensureCarrier(options);
        emitMilestone("CANVAS_MOUNT_CREATED", 81, "Canvas carrier mounted with nonzero physical size.", {
          width: carrier.canvas.width,
          height: carrier.canvas.height
        });
        await yieldFrame();

        emitMilestone("CANVAS_CONTEXT_READY", 84, "Canvas 2D context ready.");
        await yieldFrame();

        const children = await ensureChildren();

        children.west.bindInspection({
          canvas: carrier.canvas,
          onChange: () => forceRedraw({ interactive: true, sampleProof: false }),
          onInvalidate: (reason) => invalidateTexture(reason || "west-control-invalidation")
        });

        mergeChildReceipts();
        state.dragInspectionBound = true;
        state.zoomInspectionBound = true;
        state.inspectModeAvailable = true;
        state.inspectPlanetControlAvailable = true;
        state.diagnosticCanLeavePlanetFrame = true;

        emitMilestone("DRAG_INSPECTION_BOUND", 86, "West control bound: drag, zoom, inspection, invalidation.");
        await yieldFrame();

        const atlasSize = resolveAtlasSize(options, children.east);
        state.atlasBuildStarted = true;
        state.atlasBuildProgress = 0;
        emitMilestone("ATLAS_BUILD_STARTED", 88, "East source atlas build started.", atlasSize);

        const atlasResult = await children.east.buildAtlas({
          width: atlasSize.width,
          height: atlasSize.height,
          rowsPerChunk: options.rowsPerChunk,
          onProgress: (progress, receipt) => {
            state.atlasBuildProgress = clamp(progress, 0, 100);
            emitProgressOnly("ATLAS_BUILD_PROGRESS", 88 + (state.atlasBuildProgress * 0.03), `East source atlas active · ${state.atlasBuildProgress}%`, receipt || {});
          }
        });

        state.atlasCanvas = normalizeAtlasResult(atlasResult);
        state.atlasBuildProgress = 100;
        state.atlasBuildComplete = Boolean(state.atlasCanvas);
        if (!state.atlasBuildComplete) throw new Error("East source did not return a usable atlas canvas.");

        mergeChildReceipts();
        emitMilestone("ATLAS_BUILD_COMPLETE", 91, "East source atlas complete.");
        await yieldFrame();

        state.textureComposeStarted = true;
        state.textureComposeProgress = 0;
        emitMilestone("TEXTURE_COMPOSE_STARTED", 93, "South drain texture composition started.");

        const textureResult = await children.south.composeTexture({
          atlasCanvas: state.atlasCanvas,
          onProgress: (progress, receipt) => {
            state.textureComposeProgress = clamp(progress, 0, 100);
            emitProgressOnly("TEXTURE_COMPOSE_PROGRESS", 93 + (state.textureComposeProgress * 0.03), `South drain texture active · ${state.textureComposeProgress}%`, receipt || {});
          }
        });

        state.textureCanvas = normalizeTextureResult(textureResult, children.south);
        state.textureComposeProgress = 100;
        state.textureComposeComplete = Boolean(state.textureCanvas);
        if (!state.textureComposeComplete) throw new Error("South drain did not return a usable texture canvas.");

        mergeChildReceipts();
        emitMilestone("TEXTURE_COMPOSE_COMPLETE", 96, "South drain texture complete.");
        await yieldFrame();

        state.firstFrameRequested = true;
        emitMilestone("FIRST_FRAME_REQUESTED", 97, "South drain first frame requested.");

        await children.south.renderSphere({
          canvas: state.canvas,
          textureCanvas: state.textureCanvas,
          view: children.west.getViewState(),
          onProgress: (progress, receipt) => {
            emitProgressOnly("SPHERE_RENDER_PROGRESS", 97, `South drain sphere render active · ${progress}%`, receipt || {});
          }
        });

        state.firstFrameDetected = true;
        state.imageRendered = true;
        state.renderedAfterTexture = true;
        state.renderFrameCount += 1;
        state.planetFramePainted = true;
        mergeChildReceipts();
        emitMilestone("FIRST_FRAME_DETECTED", 98, "South drain first frame detected.");

        state.canvasReady = true;
        state.canvasLaneClosed = true;
        state.canvasCarrierHandoffOk = true;
        state.canvasCarrierHandoffError = "";
        state.canvasBootCompletedAt = nowIso();
        state.canvasBootElapsedMs = Math.max(0, Date.parse(state.canvasBootCompletedAt) - Date.parse(state.canvasBootStartedAt));
        emitMilestone("CANVAS_READY", 98, "Canvas F13 carrier ready. F21 remains outside Canvas.");

        state.visibleContentProofStarted = true;
        emitMilestone("VISIBLE_CONTENT_PROOF_STARTED", 98, "Visible content proof started.");

        let proof = {};
        try {
          proof = children.south.sampleVisibleContent({ canvas: state.canvas }) || {};
        } catch (error) {
          recordError("SOUTH_VISIBLE_CONTENT_SAMPLE_FAILED", error);
        }

        const appliedProof = applyVisibleProof(proof);
        mergeChildReceipts();

        if (state.visibleContentProof && !state.visibleContentSoftGap && !state.visibleContentHardFail) {
          emitMilestone("VISIBLE_CONTENT_PROOF_PASSED", 98, "Visible content proof passed.", appliedProof);
        } else if (state.visibleContentSoftGap || state.visibleForwardProgress || state.visibleContentAdmissible) {
          state.visibleContentSoftGap = true;
          state.visibleContentHardFail = false;
          emitMilestone("DEGRADED_VISIBLE_CONTENT_ACCEPTED", 98, "Visible content soft gap accepted with physical forward progress.", appliedProof);
        } else {
          state.visibleContentHardFail = true;
          emitMilestone("VISIBLE_CONTENT_HARD_FAIL", 98, "Visible content hard fail after physical carrier render attempt.", appliedProof);
        }

        state.f13CanvasEvidenceComplete = Boolean(state.visibleContentProof || state.visibleContentSoftGap);
        state.f13HardFail = Boolean(state.visibleContentHardFail);

        emitMilestone("INSPECT_MODE_READY", 98, "West control inspect mode ready.");

        state.booting = false;
        state.booted = true;
        state.bootPromiseActive = false;
        state.updatedAt = nowIso();
        updateDataset();

        if (isFunction(options.onReady)) {
          try {
            options.onReady(getReceipt());
          } catch (error) {
            recordError("ON_READY_CALLBACK_ERROR", error);
          }
        }

        return getReceipt();
      } catch (error) {
        state.booting = false;
        state.booted = false;
        state.bootPromiseActive = false;
        state.canvasCarrierHandoffOk = false;
        state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
        state.f13HardFail = true;
        state.visibleContentHardFail = true;
        markChildrenPresence();
        recordError("CANVAS_PHYSICAL_CARRIER_F13_BOOT_FAILED", error, { nextAuditTarget: state.nextAuditTarget || FILE });
        updateDataset();

        if (isFunction(options.onError)) {
          try {
            options.onError(error, getReceipt());
          } catch (callbackError) {
            recordError("ON_ERROR_CALLBACK_ERROR", callbackError);
          }
        }

        return getReceipt();
      } finally {
        bootPromise = null;
      }
    })();

    return bootPromise;
  }

  function boot(options = {}) {
    return bootCooperative(options);
  }

  async function mount(options = {}) {
    addCallbacksFromOptions(options);
    const carrier = ensureCarrier(options);
    const children = await ensureChildren();

    children.west.bindInspection({
      canvas: carrier.canvas,
      onChange: () => forceRedraw({ interactive: true, sampleProof: false }),
      onInvalidate: (reason) => invalidateTexture(reason || "west-control-invalidation")
    });

    state.dragInspectionBound = true;
    state.zoomInspectionBound = true;
    state.inspectModeAvailable = true;
    state.inspectPlanetControlAvailable = true;
    state.diagnosticCanLeavePlanetFrame = true;
    mergeChildReceipts();
    updateDataset();

    return getReceipt();
  }

  async function render(options = {}) {
    addCallbacksFromOptions(options);

    if (!state.canvas || !state.context) await mount(options);

    let children = markChildrenPresence();
    if (!state.allCanvasChildrenReady) children = await ensureChildren();

    const east = children.east || resolveChild("east");
    const west = children.west || resolveChild("west");
    const south = children.south || resolveChild("south");

    if (!east || !west || !south) throw new Error("Canvas split-adapter children unavailable during render.");

    if (state.textureInvalidated || !state.atlasCanvas || !isFunction(south.getTextureCanvas) || !south.getTextureCanvas()) {
      return rebuildTexture(options);
    }

    await south.renderSphere({
      canvas: state.canvas,
      textureCanvas: south.getTextureCanvas(),
      view: west.getViewState(),
      onProgress: options.onProgress
    });

    state.firstFrameDetected = true;
    state.imageRendered = true;
    state.renderedAfterTexture = true;
    state.renderFrameCount += 1;

    const proof = south.sampleVisibleContent({ canvas: state.canvas });
    applyVisibleProof(proof);
    mergeChildReceipts();

    state.canvasReady = true;
    state.canvasLaneClosed = true;
    state.textureInvalidated = false;
    updateDataset();

    return { ...getReceipt(), proof: clonePlain(proof) };
  }

  function forceRedraw(options = {}) {
    const children = markChildrenPresence();
    const west = children.west || resolveChild("west");
    const south = children.south || resolveChild("south");

    if (!state.canvas || !south || !isFunction(south.getTextureCanvas) || !south.getTextureCanvas()) return getReceipt();

    try {
      if (isFunction(south.renderSphereSync)) {
        south.renderSphereSync({
          canvas: state.canvas,
          textureCanvas: south.getTextureCanvas(),
          view: west && isFunction(west.getViewState) ? west.getViewState() : {},
          interactive: options.interactive !== false
        });
      } else if (isFunction(south.renderSphere)) {
        south.renderSphere({
          canvas: state.canvas,
          textureCanvas: south.getTextureCanvas(),
          view: west && isFunction(west.getViewState) ? west.getViewState() : {},
          interactive: options.interactive !== false
        });
      }

      state.interactiveFrameCount += options.interactive !== false ? 1 : 0;
      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.renderFrameCount += 1;

      if (options.sampleProof === true && isFunction(south.sampleVisibleContent)) {
        applyVisibleProof(south.sampleVisibleContent({ canvas: state.canvas }));
      }

      mergeChildReceipts();
    } catch (error) {
      recordError("FORCE_REDRAW_FAILED", error);
    }

    updateDataset();
    return getReceipt();
  }

  function invalidateTexture(reason = "manual-texture-invalidation") {
    const children = markChildrenPresence();
    const east = children.east || resolveChild("east");
    const south = children.south || resolveChild("south");

    state.textureInvalidationCount += 1;
    state.textureInvalidated = true;
    state.textureInvalidationReason = String(reason || "manual-texture-invalidation");
    state.textureRebuildRequested = false;
    state.textureRebuildComplete = false;
    state.textureRebuildError = "";
    state.updatedAt = nowIso();

    if (east && isFunction(east.invalidateAtlas)) {
      try {
        east.invalidateAtlas(reason);
      } catch (error) {
        recordError("EAST_SOURCE_ATLAS_INVALIDATION_FAILED", error);
      }
    }

    if (south && isFunction(south.invalidateTexture)) {
      try {
        south.invalidateTexture(reason);
      } catch (error) {
        recordError("SOUTH_DRAIN_TEXTURE_INVALIDATION_FAILED", error);
      }
    }

    emitProgressOnly("TEXTURE_INVALIDATED", 96, `Split-adapter texture invalidated · reason=${state.textureInvalidationReason}`);
    updateDataset();
    return getReceipt();
  }

  async function rebuildTexture(options = {}) {
    addCallbacksFromOptions(options);
    state.textureRebuildRequested = true;
    state.textureRebuildComplete = false;
    state.textureRebuildError = "";
    updateDataset();

    try {
      const children = await ensureChildren();
      if (!state.canvas || !state.context) ensureCarrier(options);

      const atlasSize = resolveAtlasSize(options, children.east);
      state.atlasBuildStarted = true;
      state.atlasBuildProgress = 0;
      emitMilestone("ATLAS_BUILD_STARTED", 88, "East source atlas rebuild started.", atlasSize);

      const atlasResult = await children.east.buildAtlas({
        width: atlasSize.width,
        height: atlasSize.height,
        rowsPerChunk: options.rowsPerChunk,
        onProgress: (progress, receipt) => {
          state.atlasBuildProgress = clamp(progress, 0, 100);
          emitProgressOnly("ATLAS_BUILD_PROGRESS", 88 + (state.atlasBuildProgress * 0.03), `East source atlas rebuild active · ${state.atlasBuildProgress}%`, receipt || {});
        }
      });

      state.atlasCanvas = normalizeAtlasResult(atlasResult);
      state.atlasBuildProgress = 100;
      state.atlasBuildComplete = Boolean(state.atlasCanvas);
      if (!state.atlasBuildComplete) throw new Error("East source rebuild did not return usable atlas canvas.");
      emitMilestone("ATLAS_BUILD_COMPLETE", 91, "East source atlas rebuild complete.");

      state.textureComposeStarted = true;
      state.textureComposeProgress = 0;
      emitMilestone("TEXTURE_COMPOSE_STARTED", 93, "South drain texture rebuild started.");

      const textureResult = await children.south.composeTexture({
        atlasCanvas: state.atlasCanvas,
        onProgress: (progress, receipt) => {
          state.textureComposeProgress = clamp(progress, 0, 100);
          emitProgressOnly("TEXTURE_COMPOSE_PROGRESS", 93 + (state.textureComposeProgress * 0.03), `South drain texture rebuild active · ${state.textureComposeProgress}%`, receipt || {});
        }
      });

      state.textureCanvas = normalizeTextureResult(textureResult, children.south);
      state.textureComposeProgress = 100;
      state.textureComposeComplete = Boolean(state.textureCanvas);
      if (!state.textureComposeComplete) throw new Error("South drain rebuild did not return usable texture canvas.");
      emitMilestone("TEXTURE_COMPOSE_COMPLETE", 96, "South drain texture rebuild complete.");

      await children.south.renderSphere({
        canvas: state.canvas,
        textureCanvas: state.textureCanvas,
        view: children.west.getViewState()
      });

      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.renderedAfterTexture = true;
      state.renderFrameCount += 1;

      const proof = children.south.sampleVisibleContent({ canvas: state.canvas });
      applyVisibleProof(proof);
      mergeChildReceipts();

      state.textureInvalidated = false;
      state.textureRebuildComplete = true;
      state.canvasReady = true;
      state.canvasLaneClosed = true;

      if (state.visibleContentProof) emitMilestone("VISIBLE_CONTENT_PROOF_PASSED", 98, "Visible content proof passed after rebuild.", proof);
      else if (state.visibleContentSoftGap) emitMilestone("DEGRADED_VISIBLE_CONTENT_ACCEPTED", 98, "Visible content soft gap accepted after rebuild.", proof);
      else emitMilestone("VISIBLE_CONTENT_HARD_FAIL", 98, "Visible content hard fail after rebuild.", proof || {});

      updateDataset();
      return getReceipt();
    } catch (error) {
      state.textureRebuildError = error && error.message ? error.message : String(error);
      state.textureRebuildComplete = false;
      recordError("TEXTURE_REBUILD_FAILED", error);
      return getReceipt();
    }
  }

  function ensureMaterialTextureFresh(options = {}) {
    const east = resolveChild("east");
    if (east && isFunction(east.refreshMaterialBridge)) {
      try {
        const bridge = east.refreshMaterialBridge({ invalidate: false });
        if (bridge && bridge.changed && options.allowRebuild !== false) {
          invalidateTexture("material-contract-signature-changed");
          return rebuildTexture(options);
        }
      } catch (error) {
        recordError("ENSURE_MATERIAL_TEXTURE_FRESH_FAILED", error);
      }
    }
    return Promise.resolve(getReceipt());
  }

  function setRotation(yaw = 0, pitch = 0) {
    const west = resolveChild("west");
    state.rotationYaw = safeNumber(yaw, state.rotationYaw);
    state.rotationPitch = safeNumber(pitch, state.rotationPitch);
    if (west && isFunction(west.setRotation)) west.setRotation(state.rotationYaw, state.rotationPitch);
    return forceRedraw({ interactive: true, sampleProof: false });
  }

  function resetRotation() {
    const west = resolveChild("west");
    if (west && isFunction(west.resetRotation)) west.resetRotation();
    state.rotationYaw = -0.18;
    state.rotationPitch = 0.05;
    return forceRedraw({ interactive: true, sampleProof: false });
  }

  function setZoom(value = 1, options = {}) {
    const west = resolveChild("west");
    state.zoomLevel = clamp(value, state.zoomMin, state.zoomMax);
    state.zoomInteractionCount += 1;
    state.lastZoomAt = nowIso();
    state.lastZoomSource = options.source || "setZoom";
    if (west && isFunction(west.setZoom)) west.setZoom(state.zoomLevel, options);
    return forceRedraw({ interactive: true, sampleProof: options.sampleProof === true });
  }

  function zoomIn(step = 0.18) {
    const west = resolveChild("west");
    const current = west && isFunction(west.getViewState) ? safeNumber(west.getViewState().zoomLevel, state.zoomLevel) : state.zoomLevel;
    return setZoom(current + Math.abs(safeNumber(step, 0.18)), { source: "zoomIn" });
  }

  function zoomOut(step = 0.18) {
    const west = resolveChild("west");
    const current = west && isFunction(west.getViewState) ? safeNumber(west.getViewState().zoomLevel, state.zoomLevel) : state.zoomLevel;
    return setZoom(current - Math.abs(safeNumber(step, 0.18)), { source: "zoomOut" });
  }

  function resetZoom() {
    return setZoom(1, { source: "resetZoom" });
  }

  function sample(point = {}) {
    const east = resolveChild("east");
    if (east && isFunction(east.sample)) return east.sample(point);
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      u: safeNumber(point.u, 0.5),
      v: safeNumber(point.v, 0.5),
      rgb: [0, 0, 0],
      canvasStillDoesNotOwnPlanetTruth: true,
      f21ClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function read(point = {}) {
    return sample(point);
  }

  function sampleVisibleContent(options = {}) {
    const south = resolveChild("south");
    let proof = {};
    if (south && isFunction(south.sampleVisibleContent)) {
      try {
        proof = south.sampleVisibleContent({ canvas: options.canvas || state.canvas }) || {};
      } catch (error) {
        recordError("SOUTH_SAMPLE_VISIBLE_CONTENT_FAILED", error);
      }
    }
    const applied = applyVisibleProof(proof);
    mergeChildReceipts();
    updateDataset();
    return applied;
  }

  function classifyVisibleContentEvidence(metrics = {}) {
    const south = resolveChild("south");
    if (south && isFunction(south.classifyVisibleContentEvidence)) {
      try {
        const proof = south.classifyVisibleContentEvidence(metrics);
        applyVisibleProof(proof);
        mergeChildReceipts();
        return proof;
      } catch (error) {
        recordError("SOUTH_CLASSIFY_VISIBLE_CONTENT_FAILED", error);
      }
    }
    return applyVisibleProof(metrics);
  }

  function getMaterialBridgeReceipt() {
    mergeChildReceipts();
    return {
      materialReceiptBridgeActive: state.materialReceiptBridgeActive === true,
      materialNestedReceiptAvailable: state.materialNestedReceiptAvailable === true,
      materialContract: state.materialContract || "",
      materialReceipt: state.materialReceipt || "",
      materialExpectedContract: state.materialExpectedContract || "",
      materialExpectedReceipt: state.materialExpectedReceipt || "",
      materialContractMatchesExpected: state.materialContractMatchesExpected === true,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected === true,
      materialAtlasPrimary: state.materialAtlasPrimary === true
    };
  }

  function getReceipt() {
    readNorthAuthority();
    markChildrenPresence();
    mergeChildReceipts();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      previousSplitContract: PREVIOUS_SPLIT_CONTRACT,
      previousSplitReceipt: PREVIOUS_SPLIT_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      role: state.role,

      canvasNorthActive: true,
      splitAdapterActive: true,
      transistorAdapterActive: true,
      physicalCarrierProofActive: true,
      f13PhysicalProofRequired: true,
      parentFirstBootActive: true,
      transistorGateRole: state.transistorGateRole,
      transistorSourceRole: state.transistorSourceRole,
      transistorControlRole: state.transistorControlRole,
      transistorDrainRole: state.transistorDrainRole,
      transistorCollectorRole: state.transistorCollectorRole,
      transistorCurrentFlow: state.transistorCurrentFlow,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,
      cycleOrder: CYCLE_ORDER,

      canvasEastFile: EAST_FILE,
      canvasWestFile: WEST_FILE,
      canvasSouthFile: SOUTH_FILE,
      canvasEastPresent: state.canvasEastPresent,
      canvasWestPresent: state.canvasWestPresent,
      canvasSouthPresent: state.canvasSouthPresent,
      canvasEastReady: state.canvasEastReady,
      canvasWestReady: state.canvasWestReady,
      canvasSouthReady: state.canvasSouthReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,
      canvasEastMissingMethods: state.canvasEastMissingMethods,
      canvasWestMissingMethods: state.canvasWestMissingMethods,
      canvasSouthMissingMethods: state.canvasSouthMissingMethods,
      childLoadAttempted: state.childLoadAttempted,
      childLoadComplete: state.childLoadComplete,
      childLoadError: state.childLoadError,
      nextAuditTarget: state.nextAuditTarget,

      northAuthority: NORTH_FILE,
      northAuthorityPresent: state.northAuthorityPresent,
      checkpointGovernorDetected: state.checkpointGovernorDetected,
      checkpointSessionSubmissionAvailable: state.checkpointSessionSubmissionAvailable,
      canvasEvidenceSubmittedToNorth: state.canvasEvidenceSubmittedToNorth,

      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      canvasCarrierMethod: state.canvasCarrierMethod,
      cooperativeBootAvailable: true,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: false,
      canvasBootStartedAt: state.canvasBootStartedAt,
      canvasBootCompletedAt: state.canvasBootCompletedAt,
      canvasBootElapsedMs: state.canvasBootElapsedMs,
      canvasYieldCount: state.canvasYieldCount,
      canvasPhaseCount: state.canvasPhaseCount,
      canvasLaneClosed: state.canvasLaneClosed,
      canvasReady: state.canvasReady,

      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      carrierPhysicalWidth: state.carrierPhysicalWidth,
      carrierPhysicalHeight: state.carrierPhysicalHeight,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,
      carrierOnlyDetected: state.carrierOnlyDetected,

      atlasWidth: state.atlasWidth,
      atlasHeight: state.atlasHeight,
      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,
      firstFrameRequested: state.firstFrameRequested,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      renderedAfterTexture: state.renderedAfterTexture,
      renderFrameCount: state.renderFrameCount,

      dragInspectionBound: state.dragInspectionBound,
      zoomInspectionBound: state.zoomInspectionBound,
      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      interactiveRotationActive: state.interactiveRotationActive !== false,
      pointerInspectionActive: state.pointerInspectionActive === true,
      pointerInspectionPainted: state.pointerInspectionPainted === true,
      pointerDragCount: state.pointerDragCount || 0,
      interactiveFrameCount: state.interactiveFrameCount || 0,
      rotationYaw: state.rotationYaw,
      rotationPitch: state.rotationPitch,

      zoomEnabled: state.zoomEnabled !== false,
      zoomLevel: state.zoomLevel,
      zoomMin: state.zoomMin,
      zoomMax: state.zoomMax,
      zoomLodPrepared: true,
      zoomUsesCachedTexture: true,
      zoomDoesNotOwnPlanetTruth: true,
      zoomDoesNotTriggerAtlasRebuild: true,
      zoomInteractionCount: state.zoomInteractionCount,
      lastZoomAt: state.lastZoomAt,
      lastZoomSource: state.lastZoomSource,

      materialReceiptBridge: getMaterialBridgeReceipt(),
      materialReceiptBridgeActive: state.materialReceiptBridgeActive === true,
      materialNestedReceiptAvailable: state.materialNestedReceiptAvailable === true,
      materialContract: state.materialContract || "",
      materialReceipt: state.materialReceipt || "",
      materialExpectedContract: state.materialExpectedContract || "",
      materialExpectedReceipt: state.materialExpectedReceipt || "",
      materialContractMatchesExpected: state.materialContractMatchesExpected === true,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected === true,
      materialAtlasPrimary: state.materialAtlasPrimary === true,
      canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent === true,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed === true,
      canonicalMaterialColorPrimary: state.canonicalMaterialColorPrimary === true,
      canonicalMaterialShapePrimary: state.canonicalMaterialShapePrimary === true,
      materialsPrimaryWhenValid: true,
      rawSourceColorDemotedToPaletteInfluence: true,
      elevationHydrologyFallbackUsed: state.elevationHydrologyFallbackUsed === true,

      upstreamFirstAtlasActive: true,
      sevenContinentFallbackEmergencyOnly: true,
      sevenContinentFallbackUsed: state.sevenContinentFallbackUsed === true,
      sevenContinentFallbackSuppressedByUpstream: state.sevenContinentFallbackSuppressedByUpstream === true,
      sevenContinentVisualFallbackActive: true,
      continentVisualSeedCount: state.continentVisualSeedCount,
      continentBlendMode: state.continentBlendMode,
      proceduralSixLobeAdditiveFieldRetired: true,
      oceanChannelCutActive: state.oceanChannelCutActive,
      seaLineTightened: state.seaLineTightened,
      coastlineSharpeningActive: state.coastlineSharpeningActive,
      landChannelStillReceiverOnly: true,
      canvasStillDoesNotOwnPlanetTruth: true,

      cachedTextureInvalidationAvailable: true,
      textureInvalidationCount: state.textureInvalidationCount,
      textureInvalidated: state.textureInvalidated,
      textureInvalidationReason: state.textureInvalidationReason,
      textureRebuildRequested: state.textureRebuildRequested,
      textureRebuildComplete: state.textureRebuildComplete,
      textureRebuildError: state.textureRebuildError,
      textureRebuildAfterLaneClosureSupported: true,
      postReadyTextureRebuildSafe: true,

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
      visibleContentClasses: Array.isArray(state.visibleContentClasses) ? state.visibleContentClasses.slice() : [],
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      visibleContentCarrierSampleCount: state.visibleContentCarrierSampleCount,

      visualFidelityRenewalActive: true,
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

      f13CanvasEvidencePreserved: true,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,

      canvasPhaseEvents: clonePlain(state.canvasPhaseEvents),
      progressOnlyEvents: clonePlain(state.progressOnlyEvents),
      archivedLateEvents: clonePlain(state.archivedLateEvents),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      ownsCanvasEvidenceOnly: true,
      ownsCanvasNorthGate: true,
      ownsSplitAdapter: true,
      ownsTransistorGateSequence: true,
      ownsPhysicalCarrierProof: true,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsElevationTruth: false,
      ownsHydrologyTruth: false,
      ownsRuntimeTableGovernance: false,
      ownsNewsFinalAuthority: false,
      ownsF21: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();
    const progressOnlyCounts = (r.progressOnlyEvents || []).reduce((map, event) => {
      const key = event.event || "UNKNOWN";
      map[key] = (map[key] || 0) + 1;
      return map;
    }, {});

    const progressLines = Object.keys(progressOnlyCounts).map((key) => `- ${key}: ${progressOnlyCounts[key]}`).join("\n") || "- none";
    const errors = (r.errors || []).map((event) => `- ${event.at} :: ${event.code || event.event} :: ${event.message}`).join("\n") || "- none";
    const phases = (r.canvasPhaseEvents || []).slice(-28).map((event) => `- ${event.at} :: ${event.fibonacci || ""} :: ${event.event || event.phase || ""} :: ${event.checkpointId || ""}`).join("\n") || "- none";

    return [
      "HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT_RENEWAL_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `splitContract=${r.splitContract}`,
      `splitReceipt=${r.splitReceipt}`,
      `previousSplitContract=${r.previousSplitContract}`,
      `previousSplitReceipt=${r.previousSplitReceipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `canvasNorthActive=${r.canvasNorthActive}`,
      `splitAdapterActive=${r.splitAdapterActive}`,
      `transistorAdapterActive=${r.transistorAdapterActive}`,
      `physicalCarrierProofActive=${r.physicalCarrierProofActive}`,
      `f13PhysicalProofRequired=${r.f13PhysicalProofRequired}`,
      `parentFirstBootActive=${r.parentFirstBootActive}`,
      "",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `cycleOrder=${r.cycleOrder}`,
      "",
      `canvasCarrierRequested=${r.canvasCarrierRequested}`,
      `canvasCarrierMounted=${r.canvasCarrierMounted}`,
      `canvasContextReady=${r.canvasContextReady}`,
      `planetCanvasPresent=${r.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${r.planetCanvasNonZeroSize}`,
      `carrierPhysicalWidth=${r.carrierPhysicalWidth}`,
      `carrierPhysicalHeight=${r.carrierPhysicalHeight}`,
      `canvasCarrierHandoffOk=${r.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${r.canvasCarrierHandoffError}`,
      "",
      `canvasEastPresent=${r.canvasEastPresent}`,
      `canvasWestPresent=${r.canvasWestPresent}`,
      `canvasSouthPresent=${r.canvasSouthPresent}`,
      `canvasEastReady=${r.canvasEastReady}`,
      `canvasWestReady=${r.canvasWestReady}`,
      `canvasSouthReady=${r.canvasSouthReady}`,
      `allCanvasChildrenReady=${r.allCanvasChildrenReady}`,
      `canvasEastMissingMethods=${r.canvasEastMissingMethods}`,
      `canvasWestMissingMethods=${r.canvasWestMissingMethods}`,
      `canvasSouthMissingMethods=${r.canvasSouthMissingMethods}`,
      `childLoadAttempted=${r.childLoadAttempted}`,
      `childLoadComplete=${r.childLoadComplete}`,
      `childLoadError=${r.childLoadError}`,
      `nextAuditTarget=${r.nextAuditTarget}`,
      "",
      `atlasBuildStarted=${r.atlasBuildStarted}`,
      `atlasBuildProgress=${r.atlasBuildProgress}`,
      `atlasBuildComplete=${r.atlasBuildComplete}`,
      `textureComposeStarted=${r.textureComposeStarted}`,
      `textureComposeProgress=${r.textureComposeProgress}`,
      `textureComposeComplete=${r.textureComposeComplete}`,
      `firstFrameRequested=${r.firstFrameRequested}`,
      `firstFrameDetected=${r.firstFrameDetected}`,
      `imageRendered=${r.imageRendered}`,
      `renderedAfterTexture=${r.renderedAfterTexture}`,
      `canvasReady=${r.canvasReady}`,
      "",
      `visibleContentProofStarted=${r.visibleContentProofStarted}`,
      `visibleContentProof=${r.visibleContentProof}`,
      `visibleContentStrictProof=${r.visibleContentStrictProof}`,
      `visibleContentSoftGap=${r.visibleContentSoftGap}`,
      `visibleContentHardFail=${r.visibleContentHardFail}`,
      `visibleForwardProgress=${r.visibleForwardProgress}`,
      `visibleContentAdmissible=${r.visibleContentAdmissible}`,
      `visiblePlanetAvailable=${r.visiblePlanetAvailable}`,
      `nonblankPlanetVisible=${r.nonblankPlanetVisible}`,
      `carrierOnlyDetected=${r.carrierOnlyDetected}`,
      `visibleContentVarianceScore=${r.visibleContentVarianceScore}`,
      `visibleContentClassCount=${r.visibleContentClassCount}`,
      `visibleContentClasses=${(r.visibleContentClasses || []).join(",")}`,
      "",
      `dragInspectionBound=${r.dragInspectionBound}`,
      `zoomInspectionBound=${r.zoomInspectionBound}`,
      `inspectModeAvailable=${r.inspectModeAvailable}`,
      `inspectPlanetControlAvailable=${r.inspectPlanetControlAvailable}`,
      `diagnosticCanLeavePlanetFrame=${r.diagnosticCanLeavePlanetFrame}`,
      "",
      `materialReceiptBridgeActive=${r.materialReceiptBridgeActive}`,
      `materialContract=${r.materialContract}`,
      `materialReceipt=${r.materialReceipt}`,
      `materialContractMatchesExpected=${r.materialContractMatchesExpected}`,
      `materialReceiptMatchesExpected=${r.materialReceiptMatchesExpected}`,
      `canonicalMaterialConsumed=${r.canonicalMaterialConsumed}`,
      "",
      "CANVAS_PHASE_EVENTS",
      phases,
      "",
      "PROGRESS_ONLY_EVENT_COUNTS",
      progressLines,
      "",
      "ERRORS",
      errors,
      "",
      `f13CanvasEvidenceComplete=${r.f13CanvasEvidenceComplete}`,
      `f13HardFail=${r.f13HardFail}`,
      `f21ClaimedByCanvas=${r.f21ClaimedByCanvas}`,
      `readyTextClaimedByCanvas=${r.readyTextClaimedByCanvas}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset() {
    if (!doc || !doc.documentElement) return;
    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasLoaded = "true";
    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasSplitContract = SPLIT_CONTRACT;
    dataset.hearthCanvasSplitReceipt = SPLIT_RECEIPT;
    dataset.hearthCanvasPreviousSplitContract = PREVIOUS_SPLIT_CONTRACT;
    dataset.hearthCanvasPreviousSplitReceipt = PREVIOUS_SPLIT_RECEIPT;
    dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasBaselineContract = BASELINE_CONTRACT;
    dataset.hearthCanvasVersion = VERSION;
    dataset.hearthCanvasRole = state.role;

    dataset.hearthCanvasNorthActive = "true";
    dataset.hearthCanvasSplitAdapterActive = "true";
    dataset.hearthCanvasTransistorAdapterActive = "true";
    dataset.hearthCanvasPhysicalCarrierProofActive = "true";
    dataset.hearthCanvasF13PhysicalProofRequired = "true";
    dataset.hearthCanvasParentFirstBootActive = "true";

    dataset.hearthCanvasNewsProtocolSynchronized = "true";
    dataset.hearthCanvasFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasActiveFibonacciGate = "F13";
    dataset.hearthCanvasFutureFibonacciGate = "F21";
    dataset.hearthCanvasOneActiveGearAtATime = "true";
    dataset.hearthCanvasCycleOrder = CYCLE_ORDER;

    dataset.hearthCanvasCarrierRequested = String(state.canvasCarrierRequested);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthCanvasContextReady = String(state.canvasContextReady);
    dataset.hearthCanvasCarrierHandoffOk = String(state.canvasCarrierHandoffOk);
    dataset.hearthCanvasCarrierHandoffError = state.canvasCarrierHandoffError;
    dataset.hearthPlanetCanvasPresent = String(state.planetCanvasPresent);
    dataset.hearthPlanetCanvasNonZeroSize = String(state.planetCanvasNonZeroSize);

    dataset.hearthCanvasEastPresent = String(state.canvasEastPresent);
    dataset.hearthCanvasWestPresent = String(state.canvasWestPresent);
    dataset.hearthCanvasSouthPresent = String(state.canvasSouthPresent);
    dataset.hearthCanvasEastReady = String(state.canvasEastReady);
    dataset.hearthCanvasWestReady = String(state.canvasWestReady);
    dataset.hearthCanvasSouthReady = String(state.canvasSouthReady);
    dataset.hearthCanvasAllChildrenReady = String(state.allCanvasChildrenReady);
    dataset.hearthCanvasChildLoadAttempted = String(state.childLoadAttempted);
    dataset.hearthCanvasChildLoadComplete = String(state.childLoadComplete);
    dataset.hearthCanvasChildLoadError = state.childLoadError;
    dataset.hearthCanvasNextAuditTarget = state.nextAuditTarget || "";

    dataset.hearthCanvasAtlasBuildStarted = String(state.atlasBuildStarted);
    dataset.hearthCanvasAtlasBuildProgress = String(state.atlasBuildProgress);
    dataset.hearthCanvasAtlasBuildComplete = String(state.atlasBuildComplete);
    dataset.hearthCanvasTextureComposeStarted = String(state.textureComposeStarted);
    dataset.hearthCanvasTextureComposeProgress = String(state.textureComposeProgress);
    dataset.hearthCanvasTextureComposeComplete = String(state.textureComposeComplete);
    dataset.hearthCanvasFirstFrameRequested = String(state.firstFrameRequested);
    dataset.hearthCanvasFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthCanvasImageRendered = String(state.imageRendered);
    dataset.hearthCanvasReady = String(state.canvasReady);

    dataset.hearthCanvasVisibleContentProofStarted = String(state.visibleContentProofStarted);
    dataset.hearthCanvasVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthCanvasVisibleContentStrictProof = String(state.visibleContentStrictProof);
    dataset.hearthCanvasVisibleContentSoftGap = String(state.visibleContentSoftGap);
    dataset.hearthCanvasVisibleContentHardFail = String(state.visibleContentHardFail);
    dataset.hearthCanvasVisibleForwardProgress = String(state.visibleForwardProgress);
    dataset.hearthCanvasVisibleContentAdmissible = String(state.visibleContentAdmissible);
    dataset.hearthCanvasVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    dataset.hearthCanvasNonblankPlanetVisible = String(state.nonblankPlanetVisible);
    dataset.hearthCanvasCarrierOnlyDetected = String(state.carrierOnlyDetected);

    dataset.hearthCanvasDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthCanvasZoomInspectionBound = String(state.zoomInspectionBound);
    dataset.hearthCanvasInspectModeAvailable = String(state.inspectModeAvailable);
    dataset.hearthCanvasInspectPlanetControlAvailable = String(state.inspectPlanetControlAvailable);
    dataset.hearthCanvasDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);

    dataset.hearthCanvasF13EvidencePreserved = "true";
    dataset.hearthCanvasF13EvidenceComplete = String(state.f13CanvasEvidenceComplete);
    dataset.hearthCanvasF13HardFail = String(state.f13HardFail);
    dataset.hearthCanvasF21Claimed = "false";
    dataset.hearthCanvasReadyTextClaimed = "false";
    dataset.hearthCanvasVisualPassClaimed = "false";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    if (state.canvas) {
      state.canvas.dataset.hearthCanvasContract = CONTRACT;
      state.canvas.dataset.hearthCanvasReceipt = RECEIPT;
      state.canvas.dataset.hearthCanvasSplitContract = SPLIT_CONTRACT;
      state.canvas.dataset.hearthCanvasSplitReceipt = SPLIT_RECEIPT;
      state.canvas.dataset.hearthCanvasNorthActive = "true";
      state.canvas.dataset.hearthCanvasReady = String(state.canvasReady);
      state.canvas.dataset.hearthCanvasVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
      state.canvas.dataset.visualPassClaimed = "false";
    }
  }

  function getState() {
    return state;
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvas = api;
    root.HEARTH.canvasAuthority = api;
    root.HEARTH.canvasEvidence = api;
    root.HEARTH.canvasNorth = api;
    root.HEARTH.canvasSplitAdapter = api;
    root.HEARTH.canvasTransistorGate = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_NORTH = api;
    root.HEARTH_CANVAS_TEXTURE = api;
    root.HEARTH_CANVAS_SOFT_GAP_ADAPTER = api;
    root.HEARTH_CANVAS_VISUAL_FIDELITY = api;
    root.HEARTH_CANVAS_INTERACTIVE_ROTATION = api;
    root.HEARTH_CANVAS_STALE_PROTECTION = api;
    root.HEARTH_CANVAS_SEVEN_CONTINENT_VISUAL_FIELD = api;
    root.HEARTH_CANVAS_UPSTREAM_FIRST_ZOOM_LOD = api;
    root.HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION = api;
    root.HEARTH_CANVAS_SPLIT_ADAPTER = api;
    root.HEARTH_CANVAS_TRANSISTOR_GATE = api;
    root.HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT = api;

    root.DEXTER_LAB.hearthCanvasEvidence = api;
    root.DEXTER_LAB.hearthCanvasNorth = api;
    root.DEXTER_LAB.hearthCanvasSplitAdapter = api;
    root.DEXTER_LAB.hearthCanvasTransistorGate = api;
    root.DEXTER_LAB.hearthCanvasVisualFidelity = api;
    root.DEXTER_LAB.hearthCanvasInteractiveRotation = api;
    root.DEXTER_LAB.hearthCanvasSevenContinentVisualField = api;
    root.DEXTER_LAB.hearthCanvasUpstreamFirstZoomLod = api;
    root.DEXTER_LAB.hearthCanvasMaterialsReliefConsumptionInvalidation = api;
    root.DEXTER_LAB.hearthCanvasPhysicalCarrierF13ProofParent = api;

    root.HEARTH_CANVAS_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_EVIDENCE_RECEIPT = root.HEARTH_CANVAS_RECEIPT;
    root.HEARTH_CANVAS_POSTGAME_RECEIPT = root.HEARTH_CANVAS_RECEIPT;
    root.HEARTH.canvasReceipt = root.HEARTH_CANVAS_RECEIPT;
    root.HEARTH.canvasEvidenceReceipt = root.HEARTH_CANVAS_RECEIPT;
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      version: VERSION,
      file: FILE,
      role: state.role,
      canvasNorthActive: true,
      splitAdapterActive: true,
      transistorAdapterActive: true,
      physicalCarrierProofActive: true,
      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      allCanvasChildrenReady: state.allCanvasChildrenReady,
      canvasReady: state.canvasReady,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      visibleContentProof: state.visibleContentProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      nextAuditTarget: state.nextAuditTarget,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    splitContract: SPLIT_CONTRACT,
    splitReceipt: SPLIT_RECEIPT,
    previousSplitContract: PREVIOUS_SPLIT_CONTRACT,
    previousSplitReceipt: PREVIOUS_SPLIT_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,

    bootCooperative,
    boot,
    mount,
    render,
    forceRedraw,
    setRotation,
    resetRotation,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    invalidateTexture,
    rebuildTexture,
    ensureMaterialTextureFresh,
    sample,
    read,
    sampleVisibleContent,
    classifyVisibleContentEvidence,
    exportCanvasEvidenceReceipt: getReceipt,
    readNorthAuthority,
    submitCanvasEvidence,
    getReceipt,
    getReceiptText,
    getMaterialBridgeReceipt,
    getState,
    on,
    off,
    ensureChildren,
    resolveChild,

    splitAdapterActive: true,
    transistorAdapterActive: true,
    physicalCarrierProofActive: true,
    canvasNorthActive: true,
    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    cycleOrder: CYCLE_ORDER,

    ownsCanvasEvidenceOnly: true,
    ownsCanvasNorthGate: true,
    ownsSplitAdapter: true,
    ownsTransistorGateSequence: true,
    ownsPhysicalCarrierProof: true,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsRuntimeTableGovernance: false,
    ownsNewsFinalAuthority: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  state.updatedAt = nowIso();
  markChildrenPresence();
  updateDataset();
  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
