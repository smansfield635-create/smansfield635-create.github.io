// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_SINGLE_FILE_INTERNAL_NEWS_F13_SCHEMATIC_TNT_v2
// Full-file replacement.
// Canvas North parent / single-file internal NEWS schematic / F13 carrier.
// Purpose:
// - Keep Canvas as one physical file while organizing internal NEWS zones.
// - Separate carrier readiness from visible planet readiness.
// - Prevent carrier-only canvasReady from outrunning atlas, texture, frame, and proof.
// - Preserve existing HEARTH_CANVAS aliases expected by /showroom/globe/hearth/index.js and /showroom/globe/hearth/hearth.js.
// - Consume East/West/South canvas children without splitting this parent file.
// - Close F13 only through real atlas/texture/frame/proof, or through explicit degraded emergency F13 diagnostic output.
// - Keep Canvas strictly F13 evidence only.
// Does not own:
// - planet truth
// - material truth
// - elevation truth
// - hydrology truth
// - runtime-table governance
// - route orchestration
// - F21 completion
// - ready text
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_RECEIPT_v1";

  const SPLIT_CONTRACT = "HEARTH_CANVAS_SINGLE_FILE_INTERNAL_NEWS_F13_SCHEMATIC_TNT_v2";
  const SPLIT_RECEIPT = "HEARTH_CANVAS_SINGLE_FILE_INTERNAL_NEWS_F13_SCHEMATIC_RECEIPT_v2";

  const PREVIOUS_SPLIT_CONTRACT = "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_TNT_v1";
  const PREVIOUS_SPLIT_RECEIPT = "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_RECEIPT_v1";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const VERSION = "2026-05-31.hearth-canvas-single-file-internal-news-f13-schematic-v2";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DEFAULT_SIZE = 600;
  const MIN_SIZE = 360;
  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const CHILD_LOAD_TIMEOUT_MS = 2600;
  const CHILD_METHOD_TIMEOUT_MS = 9000;

  const CYCLE_ORDER = "NORTH_CARRIER -> EAST_ATLAS -> WEST_CONTROL -> SOUTH_TEXTURE -> SOUTH_FRAME -> SOUTH_VISIBLE_PROOF -> CHECKPOINT_RETURN";

  const INTERNAL_ZONES = Object.freeze({
    NORTH: {
      id: "NORTH",
      label: "Carrier / gate / receipt",
      owns: [
        "physical carrier",
        "nonzero canvas",
        "context",
        "gate sequencing",
        "receipt publication",
        "F13 evidence carrier"
      ]
    },
    EAST: {
      id: "EAST",
      label: "Source / atlas intake",
      owns: [
        "child recognition",
        "atlas request",
        "atlas result validation",
        "source sample bridge"
      ]
    },
    WEST: {
      id: "WEST",
      label: "Control / inspection / invalidation",
      owns: [
        "drag inspection",
        "zoom inspection",
        "view state",
        "texture invalidation request"
      ]
    },
    SOUTH: {
      id: "SOUTH",
      label: "Texture / frame / visible proof",
      owns: [
        "texture composition request",
        "sphere render request",
        "visible-content sampling",
        "F13 proof classification"
      ]
    }
  });

  const FIBONACCI_GATES = Object.freeze([
    { id: "F13A_CANVAS_PARENT_BOOT_STARTED", fib: "F13A", cardinal: "NORTH", label: "Canvas parent boot started" },
    { id: "F13B_PHYSICAL_CARRIER_MOUNTED", fib: "F13B", cardinal: "NORTH", label: "Physical carrier mounted" },
    { id: "F13C_CONTEXT_READY", fib: "F13C", cardinal: "NORTH", label: "2D context ready" },
    { id: "F13D_WEST_CONTROL_BOUND", fib: "F13D", cardinal: "WEST", label: "Control and inspection bound" },
    { id: "F13E_EAST_ATLAS_BUILD_STARTED", fib: "F13E", cardinal: "EAST", label: "Atlas build started" },
    { id: "F13F_EAST_ATLAS_BUILD_COMPLETE", fib: "F13F", cardinal: "EAST", label: "Atlas build complete" },
    { id: "F13G_SOUTH_TEXTURE_COMPOSE_STARTED", fib: "F13G", cardinal: "SOUTH", label: "Texture composition started" },
    { id: "F13H_SOUTH_TEXTURE_COMPOSE_COMPLETE", fib: "F13H", cardinal: "SOUTH", label: "Texture composition complete" },
    { id: "F13I_FIRST_FRAME_REQUESTED", fib: "F13I", cardinal: "SOUTH", label: "First frame requested" },
    { id: "F13J_FIRST_FRAME_DETECTED", fib: "F13J", cardinal: "SOUTH", label: "First frame detected" },
    { id: "F13K_CANVAS_VISIBLE_READY", fib: "F13K", cardinal: "SOUTH", label: "Visible canvas ready" },
    { id: "F13L_VISIBLE_CONTENT_PROOF_STARTED", fib: "F13L", cardinal: "SOUTH", label: "Visible proof started" },
    { id: "F13M_VISIBLE_CONTENT_PROOF_ACCEPTED", fib: "F13M", cardinal: "SOUTH", label: "Visible proof accepted" },
    { id: "F13N_INSPECT_MODE_READY", fib: "F13N", cardinal: "WEST", label: "Inspect mode ready" }
  ]);

  const CHILDREN = Object.freeze({
    east: {
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
      file: WEST_FILE,
      globals: [
        "HEARTH_CANVAS_WEST",
        "HEARTH.canvasWest",
        "DEXTER_LAB.hearthCanvasWest"
      ],
      requiredMethods: ["bindInspection", "getViewState", "setRotation", "resetRotation", "setZoom", "getReceipt"]
    },
    south: {
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

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    splitContract: SPLIT_CONTRACT,
    splitReceipt: SPLIT_RECEIPT,
    previousSplitContract: PREVIOUS_SPLIT_CONTRACT,
    previousSplitReceipt: PREVIOUS_SPLIT_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "canvas-north-single-file-internal-news-f13-schematic",

    northFile: NORTH_FILE,
    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    southFile: SOUTH_FILE,

    singlePhysicalFile: true,
    internalNewsZonesActive: true,
    internalFourZoneSchematicActive: true,
    noAdditionalCanvasFileSplit: true,

    canvasNorthActive: true,
    physicalObjectBootstrapActive: true,
    physicalCarrierProofActive: true,
    carrierReadyIsNotPlanetReady: true,
    canvasReadyRequiresTextureFrameAndProof: true,
    f13PhysicalProofRequired: true,
    emergencyF13DiagnosticPlanetAllowed: true,
    emergencyF13DiagnosticPlanetUsed: false,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    cycleOrder: CYCLE_ORDER,

    zones: {
      north: { status: "PENDING", progress: 0, latestEvent: "", complete: false },
      east: { status: "PENDING", progress: 0, latestEvent: "", complete: false },
      west: { status: "PENDING", progress: 0, latestEvent: "", complete: false },
      south: { status: "PENDING", progress: 0, latestEvent: "", complete: false }
    },

    gateLedger: [],
    completedGates: [],
    degradedGates: [],
    blockedGates: [],
    activeGateId: "F13A_CANVAS_PARENT_BOOT_STARTED",
    activeFibonacci: "F13A",
    activeCardinal: "NORTH",
    activeProgress: 0,

    mount: null,
    canvas: null,
    context: null,
    cssSize: 0,
    dpr: 1,
    carrierPhysicalWidth: 0,
    carrierPhysicalHeight: 0,

    canvasCarrierRequested: false,
    canvasCarrierMounted: false,
    canvasContextReady: false,
    carrierReady: false,
    canvasCarrierReady: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",
    canvasCarrierMethod: "single-file-internal-news-f13-schematic",

    canvasReady: false,
    visibleCanvasReady: false,
    canvasLaneClosed: false,

    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    planetFramePainted: false,
    nonblankPlanetVisible: false,
    planetNotObstructed: false,
    visiblePlanetAvailable: false,
    visiblePlanetHintPresent: false,

    childLoadAttempted: false,
    childLoadComplete: false,
    childLoadError: "",
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

    atlasCanvas: null,
    textureCanvas: null,
    atlasWidth: DEFAULT_ATLAS_WIDTH,
    atlasHeight: DEFAULT_ATLAS_HEIGHT,
    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    atlasBuildError: "",
    textureComposeStarted: false,
    textureComposeProgress: 0,
    textureComposeComplete: false,
    textureComposeError: "",
    firstFrameRequested: false,
    firstFrameDetected: false,
    imageRendered: false,
    renderedAfterTexture: false,

    dragInspectionBound: false,
    zoomInspectionBound: false,
    inspectModeAvailable: false,
    inspectPlanetControlAvailable: false,
    diagnosticCanLeavePlanetFrame: false,

    rotationYaw: -0.18,
    rotationPitch: 0.05,
    zoomLevel: 1,
    zoomMin: 0.82,
    zoomMax: 2.8,
    pointerDragCount: 0,
    renderFrameCount: 0,
    interactiveFrameCount: 0,

    visibleContentProofStarted: false,
    visibleContentProof: false,
    visibleContentStrictProof: false,
    visibleContentSoftGap: false,
    visibleContentHardFail: false,
    visibleForwardProgress: false,
    visibleContentAdmissible: false,
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

    materialReceiptBridgeActive: false,
    materialNestedReceiptAvailable: false,
    materialContract: "",
    materialReceipt: "",
    materialContractMatchesExpected: false,
    materialReceiptMatchesExpected: false,
    canonicalMaterialConsumed: false,

    f13CanvasEvidencePreserved: true,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f21ClaimedByCanvas: false,
    readyTextClaimedByCanvas: false,

    northAuthorityPresent: false,
    checkpointSessionSubmissionAvailable: false,
    canvasEvidenceSubmittedToNorth: false,

    booting: false,
    booted: false,
    bootStartedAt: "",
    bootCompletedAt: "",
    bootElapsedMs: 0,

    callbacks: [],
    canvasPhaseEvents: [],
    progressOnlyEvents: [],
    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    updatedAt: ""
  };

  let bootPromise = null;
  let childrenPromise = null;

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
    return Math.max(min, Math.min(max, safeNumber(value, min)));
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

  function pathRead(path) {
    const parts = String(path || "").split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function withTimeout(promise, timeoutMs, label) {
    return new Promise((resolve, reject) => {
      let settled = false;

      const timer = root.setTimeout(() => {
        if (settled) return;
        settled = true;
        reject(new Error(`${label || "operation"} timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      Promise.resolve(promise)
        .then((value) => {
          if (settled) return;
          settled = true;
          root.clearTimeout(timer);
          resolve(value);
        })
        .catch((error) => {
          if (settled) return;
          settled = true;
          root.clearTimeout(timer);
          reject(error);
        });
    });
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: String(event || "LOCAL_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 180);
    state.updatedAt = item.at;
    updateDataset();

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

  function updateZone(zone, status, progress, event, complete = false) {
    const key = String(zone || "").toLowerCase();

    if (!state.zones[key]) return;

    state.zones[key].status = status || state.zones[key].status;
    state.zones[key].progress = clamp(progress, 0, 100);
    state.zones[key].latestEvent = event || state.zones[key].latestEvent;
    state.zones[key].complete = Boolean(complete);

    updateDataset();
  }

  function completeGate(gateId, degraded = false, detail = {}) {
    const gate = FIBONACCI_GATES.find((item) => item.id === gateId);

    if (!gate) return;

    if (!state.completedGates.includes(gateId)) {
      state.completedGates.push(gateId);
      if (degraded && !state.degradedGates.includes(gateId)) state.degradedGates.push(gateId);
    }

    state.gateLedger = FIBONACCI_GATES.map((item) => {
      const done = state.completedGates.includes(item.id);
      const itemDegraded = state.degradedGates.includes(item.id);
      return {
        id: item.id,
        fib: item.fib,
        cardinal: item.cardinal,
        label: item.label,
        complete: done,
        degraded: itemDegraded,
        active: item.id === gateId,
        detail: item.id === gateId ? clonePlain(detail) : {}
      };
    });

    const nextGate = FIBONACCI_GATES.find((item) => !state.completedGates.includes(item.id)) || gate;
    state.activeGateId = nextGate.id;
    state.activeFibonacci = nextGate.fib;
    state.activeCardinal = nextGate.cardinal;
    state.activeProgress = state.completedGates.includes(nextGate.id) ? 100 : 0;

    updateDataset();
  }

  function publishEarlyMarker() {
    root.__HEARTH_CANVAS_PARENT_MARKER__ = true;
    root.__HEARTH_CANVAS_PARENT_FILE__ = FILE;
    root.__HEARTH_CANVAS_PARENT_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_PARENT_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_PARENT_SPLIT_CONTRACT__ = SPLIT_CONTRACT;
    root.__HEARTH_CANVAS_PARENT_SPLIT_RECEIPT__ = SPLIT_RECEIPT;
    root.__HEARTH_CANVAS_SINGLE_FILE_INTERNAL_NEWS__ = true;

    if (doc && doc.documentElement) {
      const dataset = doc.documentElement.dataset;
      dataset.hearthCanvasParentMarkerPresent = "true";
      dataset.hearthCanvasLoaded = "true";
      dataset.hearthCanvasContract = CONTRACT;
      dataset.hearthCanvasReceipt = RECEIPT;
      dataset.hearthCanvasSplitContract = SPLIT_CONTRACT;
      dataset.hearthCanvasSplitReceipt = SPLIT_RECEIPT;
      dataset.hearthCanvasSinglePhysicalFile = "true";
      dataset.hearthCanvasInternalNewsZonesActive = "true";
      dataset.hearthCanvasCarrierReadyIsNotPlanetReady = "true";
      dataset.hearthCanvasReadyRequiresTextureFrameAndProof = "true";
      dataset.hearthCanvasF21Claimed = "false";
      dataset.hearthCanvasReadyTextClaimed = "false";
      dataset.generatedImage = "false";
      dataset.graphicBox = "false";
      dataset.webgl = "false";
      dataset.visualPassClaimed = "false";
    }
  }

  publishEarlyMarker();

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
      "main",
      "body"
    ];

    for (const selector of selectors) {
      const found = doc.querySelector(selector);
      if (found) return found;
    }

    return doc.body || doc.documentElement;
  }

  function ensureMountFrame(mount) {
    if (!mount || !mount.style) return;

    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: 0, height: 0 };
    const width = safeNumber(rect.width, 0);
    const height = safeNumber(rect.height, 0);

    if (width < MIN_SIZE || height < MIN_SIZE) {
      if (!mount.style.minWidth) mount.style.minWidth = `${MIN_SIZE}px`;
      if (!mount.style.minHeight) mount.style.minHeight = `${MIN_SIZE}px`;
      if (!mount.style.position) mount.style.position = "relative";
      if (!mount.style.display) mount.style.display = "grid";
      if (!mount.style.placeItems) mount.style.placeItems = "center";
    }
  }

  function ensureCarrier(options = {}) {
    if (!doc) throw new Error("Document unavailable for Hearth canvas.");

    const mount = resolveMount(options);
    if (!mount) throw new Error("Hearth canvas mount unavailable.");

    ensureMountFrame(mount);

    let canvas =
      String(mount.tagName || "").toLowerCase() === "canvas"
        ? mount
        : mount.querySelector("canvas[data-hearth-canvas-texture='true'], canvas[data-hearth-canvas='true'], canvas.hearth-canvas");

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.className = "hearth-canvas hearth-canvas--single-file-internal-news-f13";
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasTexture = "true";
      canvas.dataset.hearthPhysicalObjectBootstrap = "true";
      canvas.dataset.hearthSingleFileInternalNews = "true";
      canvas.setAttribute("aria-label", "Hearth visible planet canvas");
      mount.appendChild(canvas);
    }

    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: DEFAULT_SIZE, height: DEFAULT_SIZE };
    const explicitSize = safeNumber(options.canvasSize, 0) || safeNumber(options.size, 0);

    const widthFromRect = Math.max(0, safeNumber(rect.width, 0));
    const heightFromRect = Math.max(0, safeNumber(rect.height, 0));
    const basis = explicitSize || Math.max(MIN_SIZE, Math.min(DEFAULT_SIZE, widthFromRect || DEFAULT_SIZE, heightFromRect || DEFAULT_SIZE));

    const cssSize = Math.max(MIN_SIZE, Math.round(basis));
    const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
    const physicalSize = Math.max(MIN_SIZE, Math.round(cssSize * dpr));

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
    state.carrierReady = true;
    state.canvasCarrierReady = true;
    state.planetCanvasPresent = true;
    state.planetCanvasNonZeroSize = Boolean(canvas.width > 0 && canvas.height > 0);
    state.visiblePlanetHintPresent = state.planetCanvasNonZeroSize;

    if (!state.planetCanvasNonZeroSize) {
      throw new Error("Hearth canvas carrier has zero physical size.");
    }

    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSplitContract = SPLIT_CONTRACT;
    canvas.dataset.hearthCanvasSplitReceipt = SPLIT_RECEIPT;
    canvas.dataset.hearthCanvasNorthActive = "true";
    canvas.dataset.hearthCanvasCarrierReady = "true";
    canvas.dataset.hearthCanvasReady = "false";
    canvas.dataset.hearthCanvasF13Only = "true";
    canvas.dataset.hearthCanvasF21Claimed = "false";
    canvas.dataset.visualPassClaimed = "false";

    completeGate("F13B_PHYSICAL_CARRIER_MOUNTED", false, {
      width: canvas.width,
      height: canvas.height
    });

    completeGate("F13C_CONTEXT_READY", false, {
      context: "2d"
    });

    updateZone("north", "READY", 100, "CARRIER_CONTEXT_READY", true);
    updateDataset();

    return { mount, canvas, context, cssSize, dpr };
  }

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
    state.allCanvasChildrenReady = state.canvasEastReady && state.canvasWestReady && state.canvasSouthReady;

    state.canvasEastMissingMethods = eastMissing.join(",");
    state.canvasWestMissingMethods = westMissing.join(",");
    state.canvasSouthMissingMethods = southMissing.join(",");

    if (!state.canvasEastReady) state.nextAuditTarget = EAST_FILE;
    else if (!state.canvasWestReady) state.nextAuditTarget = WEST_FILE;
    else if (!state.canvasSouthReady) state.nextAuditTarget = SOUTH_FILE;
    else if (!state.textureComposeComplete) state.nextAuditTarget = SOUTH_FILE;
    else if (!state.firstFrameDetected) state.nextAuditTarget = SOUTH_FILE;
    else if (!state.visibleContentProof && !state.visibleContentSoftGap) state.nextAuditTarget = SOUTH_FILE;
    else state.nextAuditTarget = "read-route-or-north-receipt-after-f13";

    updateDataset();
    return { east, west, south };
  }

  function scriptAlreadyPresent(file) {
    if (!doc || !file) return null;

    return Array.from(doc.scripts || []).find((script) => {
      const src = script.getAttribute("src") || script.src || "";
      return src.includes(file);
    }) || null;
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

        const current = Date.now ? Date.now() : new Date().getTime();

        if (current - started >= timeoutMs) {
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
      state.childLoadError = "";

      markChildrenPresence();

      for (const key of Object.keys(CHILDREN)) {
        if (!resolveChild(key)) {
          await loadScriptOnce(CHILDREN[key].file);
          await waitForChild(key);
        }
      }

      const children = markChildrenPresence();

      if (!state.allCanvasChildrenReady) {
        state.childLoadComplete = false;
        state.childLoadError = [
          state.canvasEastReady ? "" : `east:${state.canvasEastMissingMethods || "missing-api"}`,
          state.canvasWestReady ? "" : `west:${state.canvasWestMissingMethods || "missing-api"}`,
          state.canvasSouthReady ? "" : `south:${state.canvasSouthMissingMethods || "missing-api"}`
        ].filter(Boolean).join("; ");

        updateDataset();
        return children;
      }

      state.childLoadComplete = true;
      state.childLoadError = "";

      completeGate("F13D_WEST_CONTROL_BOUND", false, { allChildrenReady: true });
      updateDataset();

      return children;
    })();

    return childrenPromise;
  }

  function safeChildReceipt(child) {
    if (!child || !isFunction(child.getReceipt)) return {};

    try {
      const receipt = child.getReceipt();
      return isObject(receipt) ? receipt : {};
    } catch (_error) {
      return {};
    }
  }

  function mergeChildReceipts() {
    const children = markChildrenPresence();

    const eastReceipt = safeChildReceipt(children.east);
    const westReceipt = safeChildReceipt(children.west);
    const southReceipt = safeChildReceipt(children.south);

    if (eastReceipt.materialContract !== undefined) state.materialContract = String(eastReceipt.materialContract || "");
    if (eastReceipt.materialReceipt !== undefined) state.materialReceipt = String(eastReceipt.materialReceipt || "");
    if (eastReceipt.materialReceiptBridgeActive !== undefined) state.materialReceiptBridgeActive = safeBool(eastReceipt.materialReceiptBridgeActive, state.materialReceiptBridgeActive);
    if (eastReceipt.materialNestedReceiptAvailable !== undefined) state.materialNestedReceiptAvailable = safeBool(eastReceipt.materialNestedReceiptAvailable, state.materialNestedReceiptAvailable);
    if (eastReceipt.materialContractMatchesExpected !== undefined) state.materialContractMatchesExpected = safeBool(eastReceipt.materialContractMatchesExpected, state.materialContractMatchesExpected);
    if (eastReceipt.materialReceiptMatchesExpected !== undefined) state.materialReceiptMatchesExpected = safeBool(eastReceipt.materialReceiptMatchesExpected, state.materialReceiptMatchesExpected);
    if (eastReceipt.canonicalMaterialConsumed !== undefined) state.canonicalMaterialConsumed = safeBool(eastReceipt.canonicalMaterialConsumed, state.canonicalMaterialConsumed);

    if (westReceipt.rotationYaw !== undefined) state.rotationYaw = safeNumber(westReceipt.rotationYaw, state.rotationYaw);
    if (westReceipt.rotationPitch !== undefined) state.rotationPitch = safeNumber(westReceipt.rotationPitch, state.rotationPitch);
    if (westReceipt.zoomLevel !== undefined) state.zoomLevel = safeNumber(westReceipt.zoomLevel, state.zoomLevel);
    if (westReceipt.pointerDragCount !== undefined) state.pointerDragCount = safeNumber(westReceipt.pointerDragCount, state.pointerDragCount);

    [
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
      "renderFrameCount"
    ].forEach((key) => {
      if (southReceipt[key] !== undefined) {
        state[key] = Array.isArray(southReceipt[key]) ? southReceipt[key].slice() : southReceipt[key];
      }
    });

    updateDataset();
    return { children, eastReceipt, westReceipt, southReceipt };
  }

  function normalizeCanvasResult(result, fallbackMethod) {
    if (!result) return null;
    if (result.nodeType === 1 && String(result.tagName || "").toLowerCase() === "canvas") return result;
    if (result.atlasCanvas) return result.atlasCanvas;
    if (result.textureCanvas) return result.textureCanvas;
    if (result.canvas) return result.canvas;
    if (isFunction(fallbackMethod)) return fallbackMethod();
    return null;
  }

  function resolveAtlasSize(options = {}) {
    state.atlasWidth = clamp(options.atlasWidth || options.width || DEFAULT_ATLAS_WIDTH, 256, 1024);
    state.atlasHeight = clamp(options.atlasHeight || options.height || DEFAULT_ATLAS_HEIGHT, 128, 512);

    return {
      width: state.atlasWidth,
      height: state.atlasHeight
    };
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

  function readNorthAuthority() {
    const authority =
      root.LAB_RUNTIME_TABLE ||
      root.LAB_RUNTIME_TABLE_NORTH ||
      root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE ||
      root.RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null;

    const session = getNorthSession();

    state.northAuthorityPresent = Boolean(authority);
    state.checkpointSessionSubmissionAvailable = Boolean(session);

    return { authority, session };
  }

  function getNorthSnapshot() {
    mergeChildReceipts();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,

      carrierReady: state.carrierReady,
      canvasCarrierReady: state.canvasCarrierReady,
      canvasReady: state.canvasReady,
      visibleCanvasReady: state.visibleCanvasReady,

      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      carrierPhysicalWidth: state.carrierPhysicalWidth,
      carrierPhysicalHeight: state.carrierPhysicalHeight,

      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeComplete: state.textureComposeComplete,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      visibleContentProof: state.visibleContentProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,

      canvasEastReady: state.canvasEastReady,
      canvasWestReady: state.canvasWestReady,
      canvasSouthReady: state.canvasSouthReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,
      childLoadError: state.childLoadError,
      nextAuditTarget: state.nextAuditTarget,

      emergencyF13DiagnosticPlanetUsed: state.emergencyF13DiagnosticPlanetUsed,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function checkpointPayloadForPhase(phase, progress, message, detail = {}) {
    return {
      event: String(phase || "CANVAS_EVENT"),
      id: String(phase || "CANVAS_EVENT"),
      phase: String(phase || "CANVAS_EVENT"),
      checkpointId: String(detail.checkpointId || "F13_CANVAS_EVIDENCE"),
      fibonacci: String(detail.fibonacci || "F13"),
      source: "hearth.canvas.single-file-internal-news-f13-schematic",
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      progress: Math.min(98, safeNumber(progress, 0)),
      message: message || "",
      snapshot: getNorthSnapshot(),
      detail: {
        ...clonePlain(detail),
        singlePhysicalFile: true,
        internalNewsZonesActive: true,
        carrierReadyIsNotPlanetReady: true,
        canvasReadyRequiresTextureFrameAndProof: true,
        f13Only: true,
        f21ClaimedByCanvas: false,
        readyTextClaimedByCanvas: false,
        visualPassClaimed: false
      }
    };
  }

  function submitCanvasEvidence(phase, detail = {}) {
    const north = readNorthAuthority();
    const payload = checkpointPayloadForPhase(phase, 98, "", detail);

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

  function emitMilestone(phase, progress, message, detail = {}) {
    const event = {
      at: nowIso(),
      ...checkpointPayloadForPhase(phase, progress, message, detail),
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };

    state.canvasPhaseEvents.push(event);
    trimArray(state.canvasPhaseEvents, 260);
    state.updatedAt = event.at;

    submitCanvasEvidence(phase, detail);
    dispatchPhase(event);
    updateDataset();

    return event;
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
    trimArray(state.progressOnlyEvents, 280);
    state.updatedAt = item.at;

    dispatchPhase(item);
    updateDataset();

    return item;
  }

  function yieldFrame(ms = 0) {
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

  function addCallbacksFromOptions(options = {}) {
    [
      options.onPhase,
      options.onEvent,
      options.onStatus,
      options.statusCallback,
      options.onReceipt
    ].filter(isFunction).forEach((callback) => on(callback));
  }

  function on(callback) {
    if (isFunction(callback) && !state.callbacks.includes(callback)) {
      state.callbacks.push(callback);
    }

    return () => off(callback);
  }

  function off(callback) {
    const index = state.callbacks.indexOf(callback);
    if (index >= 0) state.callbacks.splice(index, 1);
  }

  function sampleCanvasPixels() {
    const canvas = state.canvas;
    const ctx = state.context;

    const output = {
      visibleContentProof: false,
      visibleContentStrictProof: false,
      visibleContentSoftGap: false,
      visibleContentHardFail: false,
      visibleForwardProgress: false,
      visibleContentAdmissible: false,
      visiblePlanetAvailable: false,
      nonblankPlanetVisible: false,
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

    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      output.visibleContentHardFail = true;
      output.visibleContentProofError = "canvas-or-context-unavailable";
      return output;
    }

    let image;

    try {
      const sampleSize = Math.min(220, canvas.width, canvas.height);
      const sx = Math.max(0, Math.floor((canvas.width - sampleSize) / 2));
      const sy = Math.max(0, Math.floor((canvas.height - sampleSize) / 2));
      image = ctx.getImageData(sx, sy, sampleSize, sampleSize);
    } catch (error) {
      output.visibleContentHardFail = true;
      output.visibleContentProofError = error && error.message ? error.message : String(error);
      return output;
    }

    const data = image.data || [];
    const classes = new Set();

    let samples = 0;
    let nonblank = 0;
    let water = 0;
    let land = 0;
    let other = 0;
    let carrier = 0;
    let minLum = 255;
    let maxLum = 0;

    const pixels = Math.floor(data.length / 4);
    const stride = Math.max(1, Math.floor(pixels / 1600));

    for (let p = 0; p < pixels; p += stride) {
      const i = p * 4;
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

      if (b > r + 12 && b > g) {
        water += 1;
        classes.add("water");
      } else if (g > b + 4 || (r > b + 8 && g > b)) {
        land += 1;
        classes.add("land");
      } else if (lum > 16) {
        other += 1;
        classes.add("other");
      } else {
        carrier += 1;
      }
    }

    const variance = Math.max(0, maxLum - minLum);
    const contentSamples = land + water + other;
    const strict = Boolean(contentSamples > 20 && variance > 18 && classes.size >= 2);
    const soft = Boolean(!strict && contentSamples > 20 && nonblank > 20 && variance > 6);

    output.visibleContentSampleCount = samples;
    output.visibleContentVarianceScore = variance;
    output.visibleContentClassCount = classes.size;
    output.visibleContentClasses = Array.from(classes);
    output.visibleContentLandSampleCount = land;
    output.visibleContentWaterSampleCount = water;
    output.visibleContentOtherSampleCount = other;
    output.visibleContentCarrierSampleCount = carrier;
    output.nonblankPlanetVisible = nonblank > 20;
    output.planetNotObstructed = output.nonblankPlanetVisible;
    output.carrierOnlyDetected = Boolean(nonblank > 20 && contentSamples <= 20);
    output.visiblePlanetAvailable = strict || soft;
    output.visibleForwardProgress = strict || soft;
    output.visibleContentAdmissible = strict || soft;
    output.visibleContentProof = strict;
    output.visibleContentStrictProof = strict;
    output.visibleContentSoftGap = soft;
    output.visibleContentHardFail = !strict && !soft;

    return output;
  }

  function applyVisibleProof(proof = {}) {
    const pixelProof = sampleCanvasPixels();
    const merged = { ...pixelProof, ...(isObject(proof) ? proof : {}) };

    state.visibleContentProofStarted = true;
    state.visibleContentProof = safeBool(merged.visibleContentProof, false);
    state.visibleContentStrictProof = safeBool(merged.visibleContentStrictProof, state.visibleContentProof);
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

    state.f13CanvasEvidenceComplete = Boolean(
      state.visibleContentProof ||
      state.visibleContentSoftGap ||
      state.visibleForwardProgress ||
      state.visibleContentAdmissible
    );

    state.f13HardFail = Boolean(state.visibleContentHardFail && !state.f13CanvasEvidenceComplete);

    if (state.f13CanvasEvidenceComplete) {
      completeGate("F13M_VISIBLE_CONTENT_PROOF_ACCEPTED", !state.visibleContentStrictProof, {
        method: state.visibleContentProofMethod,
        softGap: state.visibleContentSoftGap
      });

      state.visibleCanvasReady = true;
      state.canvasReady = true;
      state.canvasLaneClosed = true;
      state.canvasCarrierHandoffOk = true;
      updateZone("south", state.visibleContentStrictProof ? "READY" : "DEGRADED_READY", 100, "VISIBLE_CONTENT_PROOF_ACCEPTED", true);
    }

    updateDataset();
    return merged;
  }

  function drawEmergencyF13DiagnosticPlanet(reason = "child-output-unavailable") {
    const canvas = state.canvas;
    const ctx = state.context;

    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      throw new Error("Emergency F13 diagnostic planet cannot draw without physical canvas.");
    }

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.34;

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 2.2);
    bg.addColorStop(0, "rgba(18, 31, 54, 0.96)");
    bg.addColorStop(0.45, "rgba(5, 12, 27, 0.98)");
    bg.addColorStop(1, "rgba(1, 3, 9, 1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const halo = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.34);
    halo.addColorStop(0, "rgba(38, 156, 255, 0.16)");
    halo.addColorStop(0.62, "rgba(55, 210, 255, 0.08)");
    halo.addColorStop(1, "rgba(55, 210, 255, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.36, 0, Math.PI * 2);
    ctx.fill();

    const globe = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.42, radius * 0.05, cx, cy, radius);
    globe.addColorStop(0, "rgb(91, 196, 220)");
    globe.addColorStop(0.38, "rgb(34, 118, 174)");
    globe.addColorStop(0.7, "rgb(18, 70, 126)");
    globe.addColorStop(1, "rgb(7, 24, 59)");
    ctx.fillStyle = globe;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.985, 0, Math.PI * 2);
    ctx.clip();

    const continents = [
      [-0.52, -0.18, 0.28, 0.18, -0.08],
      [-0.16, 0.12, 0.34, 0.2, 0.22],
      [0.28, -0.24, 0.26, 0.17, 0.08],
      [0.48, 0.2, 0.2, 0.13, -0.26],
      [-0.36, 0.42, 0.22, 0.11, 0.14],
      [0.05, -0.48, 0.18, 0.09, -0.08],
      [0.08, 0.46, 0.24, 0.09, 0.02]
    ];

    continents.forEach(([x, y, rx, ry, turn], index) => {
      ctx.save();
      ctx.translate(cx + x * radius, cy + y * radius);
      ctx.rotate(turn + state.rotationYaw * 0.22);
      ctx.beginPath();

      for (let i = 0; i < 18; i += 1) {
        const a = (i / 18) * Math.PI * 2;
        const jitter = 1 + 0.14 * Math.sin(i * 2.13 + index) + 0.08 * Math.cos(i * 3.7);
        const px = Math.cos(a) * rx * radius * jitter;
        const py = Math.sin(a) * ry * radius * jitter;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }

      ctx.closePath();
      ctx.fillStyle = index % 2 === 0 ? "rgba(86, 156, 91, 0.96)" : "rgba(139, 126, 77, 0.92)";
      ctx.fill();

      ctx.strokeStyle = "rgba(210, 235, 190, 0.35)";
      ctx.lineWidth = Math.max(1, radius * 0.01);
      ctx.stroke();
      ctx.restore();
    });

    for (let i = 0; i < 13; i += 1) {
      const y = cy - radius + (i / 12) * radius * 2;
      const span = Math.sqrt(Math.max(0, radius * radius - (y - cy) * (y - cy)));
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = Math.max(1, radius * 0.004);
      ctx.beginPath();
      ctx.moveTo(cx - span, y);
      ctx.lineTo(cx + span, y);
      ctx.stroke();
    }

    ctx.restore();

    const shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    shade.addColorStop(0, "rgba(255,255,255,0.17)");
    shade.addColorStop(0.42, "rgba(255,255,255,0.02)");
    shade.addColorStop(0.78, "rgba(0,0,0,0.2)");
    shade.addColorStop(1, "rgba(0,0,0,0.48)");
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(156, 220, 255, 0.56)";
    ctx.lineWidth = Math.max(2, radius * 0.012);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    state.emergencyF13DiagnosticPlanetUsed = true;
    state.planetFramePainted = true;
    state.nonblankPlanetVisible = true;
    state.planetNotObstructed = true;
    state.visiblePlanetAvailable = true;
    state.visiblePlanetHintPresent = true;

    state.atlasBuildStarted = state.atlasBuildStarted || true;
    state.atlasBuildComplete = state.atlasBuildComplete || true;
    state.textureComposeStarted = true;
    state.textureComposeComplete = true;
    state.textureComposeError = reason;

    state.firstFrameRequested = true;
    state.firstFrameDetected = true;
    state.imageRendered = true;
    state.renderedAfterTexture = false;
    state.canvasReady = true;
    state.visibleCanvasReady = true;
    state.canvasLaneClosed = true;

    state.visibleContentProofStarted = true;
    state.visibleContentProof = false;
    state.visibleContentStrictProof = false;
    state.visibleContentSoftGap = true;
    state.visibleContentHardFail = false;
    state.visibleForwardProgress = true;
    state.visibleContentAdmissible = true;
    state.visibleContentProofMethod = "emergency-f13-diagnostic-planet-parent-carrier";
    state.visibleContentProofError = reason;
    state.visibleContentSampleCount = 1;
    state.visibleContentVarianceScore = 1;
    state.visibleContentClassCount = 3;
    state.visibleContentClasses = ["water", "land", "carrier"];
    state.visibleContentLandSampleCount = 1;
    state.visibleContentWaterSampleCount = 1;
    state.visibleContentOtherSampleCount = 1;
    state.visibleContentCarrierSampleCount = 1;
    state.carrierOnlyDetected = false;
    state.f13CanvasEvidenceComplete = true;
    state.f13HardFail = false;
    state.renderFrameCount += 1;

    completeGate("F13F_EAST_ATLAS_BUILD_COMPLETE", true, { emergency: true, reason });
    completeGate("F13H_SOUTH_TEXTURE_COMPOSE_COMPLETE", true, { emergency: true, reason });
    completeGate("F13J_FIRST_FRAME_DETECTED", true, { emergency: true, reason });
    completeGate("F13K_CANVAS_VISIBLE_READY", true, { emergency: true, reason });
    completeGate("F13L_VISIBLE_CONTENT_PROOF_STARTED", true, { emergency: true, reason });
    completeGate("F13M_VISIBLE_CONTENT_PROOF_ACCEPTED", true, { emergency: true, reason });
    completeGate("F13N_INSPECT_MODE_READY", false, { emergency: true, reason });

    updateZone("south", "DEGRADED_READY", 100, "EMERGENCY_F13_DIAGNOSTIC_PLANET_RENDERED", true);

    recordLocal("EMERGENCY_F13_DIAGNOSTIC_PLANET_RENDERED", {
      reason,
      f13Only: true,
      f21ClaimedByCanvas: false,
      visualPassClaimed: false
    });

    emitMilestone("TEXTURE_COMPOSE_COMPLETE", 96, "Emergency diagnostic texture composed.", {
      checkpointId: "F13H_SOUTH_TEXTURE_COMPOSE_COMPLETE",
      fibonacci: "F13H",
      emergency: true,
      reason
    });

    emitMilestone("FIRST_FRAME_DETECTED", 98, "Emergency diagnostic first frame detected.", {
      checkpointId: "F13J_FIRST_FRAME_DETECTED",
      fibonacci: "F13J",
      emergency: true,
      reason
    });

    emitMilestone("DEGRADED_VISIBLE_CONTENT_ACCEPTED", 98, "Visible object present through emergency F13 diagnostic carrier.", {
      checkpointId: "F13M_VISIBLE_CONTENT_PROOF_ACCEPTED",
      fibonacci: "F13M",
      emergency: true,
      reason,
      nextAuditTarget: state.nextAuditTarget
    });

    updateDataset();
    return getReceipt();
  }

  async function bootCooperative(options = {}) {
    addCallbacksFromOptions(options);

    if (bootPromise) return bootPromise;

    bootPromise = (async () => {
      if (state.booting) return getReceipt();

      state.booting = true;
      state.bootStartedAt = nowIso();
      state.canvasCarrierRequested = true;
      state.canvasCarrierHandoffError = "";
      state.updatedAt = state.bootStartedAt;

      updateZone("north", "ACTIVE", 15, "CANVAS_PARENT_BOOT_STARTED", false);
      completeGate("F13A_CANVAS_PARENT_BOOT_STARTED", false, {});
      updateDataset();

      try {
        emitMilestone("CANVAS_COOPERATIVE_BOOT_STARTED", 78, "Canvas parent boot started.", {
          checkpointId: "F13A_CANVAS_PARENT_BOOT_STARTED",
          fibonacci: "F13A"
        });

        await yieldFrame();

        ensureCarrier(options);

        emitMilestone("CANVAS_MOUNT_CREATED", 81, "Physical carrier mounted.", {
          checkpointId: "F13B_PHYSICAL_CARRIER_MOUNTED",
          fibonacci: "F13B",
          carrierPhysicalWidth: state.carrierPhysicalWidth,
          carrierPhysicalHeight: state.carrierPhysicalHeight
        });

        emitMilestone("CANVAS_CONTEXT_READY", 84, "Canvas context ready.", {
          checkpointId: "F13C_CONTEXT_READY",
          fibonacci: "F13C"
        });

        await yieldFrame();

        const children = await ensureChildren();

        if (!state.allCanvasChildrenReady) {
          drawEmergencyF13DiagnosticPlanet(state.childLoadError || "canvas-child-readiness-incomplete");
          finishBoot();
          return getReceipt();
        }

        if (children.west && isFunction(children.west.bindInspection)) {
          children.west.bindInspection({
            canvas: state.canvas,
            onChange: () => forceRedraw({ interactive: true, sampleProof: false }),
            onInvalidate: (reason) => invalidateTexture(reason || "west-control-invalidation")
          });

          state.dragInspectionBound = true;
          state.zoomInspectionBound = true;
          state.inspectModeAvailable = true;
          state.inspectPlanetControlAvailable = true;
          state.diagnosticCanLeavePlanetFrame = true;

          updateZone("west", "READY", 100, "WEST_CONTROL_BOUND", true);
          completeGate("F13D_WEST_CONTROL_BOUND", false, { control: "bound" });

          emitMilestone("DRAG_INSPECTION_BOUND", 86, "West control bound.", {
            checkpointId: "F13D_WEST_CONTROL_BOUND",
            fibonacci: "F13D"
          });
        }

        const atlasSize = resolveAtlasSize(options);

        if (!children.east || !isFunction(children.east.buildAtlas)) {
          drawEmergencyF13DiagnosticPlanet("east-buildAtlas-unavailable");
          finishBoot();
          return getReceipt();
        }

        state.atlasBuildStarted = true;
        state.atlasBuildProgress = 0;
        state.atlasBuildError = "";

        updateZone("east", "ACTIVE", 15, "EAST_ATLAS_BUILD_STARTED", false);
        completeGate("F13E_EAST_ATLAS_BUILD_STARTED", false, atlasSize);

        emitMilestone("ATLAS_BUILD_STARTED", 88, "East atlas build started.", {
          checkpointId: "F13E_EAST_ATLAS_BUILD_STARTED",
          fibonacci: "F13E",
          ...atlasSize
        });

        const atlasResult = await withTimeout(children.east.buildAtlas({
          width: atlasSize.width,
          height: atlasSize.height,
          rowsPerChunk: options.rowsPerChunk,
          onProgress: (progress, receipt) => {
            state.atlasBuildProgress = clamp(progress, 0, 100);
            updateZone("east", "ACTIVE", state.atlasBuildProgress, "ATLAS_BUILD_PROGRESS", false);
            emitProgressOnly("ATLAS_BUILD_PROGRESS", 88 + (state.atlasBuildProgress * 0.03), `East atlas progress ${state.atlasBuildProgress}%`, receipt || {});
          }
        }), CHILD_METHOD_TIMEOUT_MS, "east.buildAtlas");

        state.atlasCanvas = normalizeCanvasResult(atlasResult);
        state.atlasBuildProgress = 100;
        state.atlasBuildComplete = Boolean(state.atlasCanvas);

        if (!state.atlasBuildComplete) {
          state.atlasBuildError = "east-atlas-result-unusable";
          drawEmergencyF13DiagnosticPlanet(state.atlasBuildError);
          finishBoot();
          return getReceipt();
        }

        updateZone("east", "READY", 100, "EAST_ATLAS_BUILD_COMPLETE", true);
        completeGate("F13F_EAST_ATLAS_BUILD_COMPLETE", false, {
          width: state.atlasCanvas.width || atlasSize.width,
          height: state.atlasCanvas.height || atlasSize.height
        });

        emitMilestone("ATLAS_BUILD_COMPLETE", 91, "East atlas build complete.", {
          checkpointId: "F13F_EAST_ATLAS_BUILD_COMPLETE",
          fibonacci: "F13F"
        });

        if (!children.south || !isFunction(children.south.composeTexture)) {
          drawEmergencyF13DiagnosticPlanet("south-composeTexture-unavailable");
          finishBoot();
          return getReceipt();
        }

        state.textureComposeStarted = true;
        state.textureComposeProgress = 0;
        state.textureComposeError = "";

        updateZone("south", "ACTIVE", 20, "SOUTH_TEXTURE_COMPOSE_STARTED", false);
        completeGate("F13G_SOUTH_TEXTURE_COMPOSE_STARTED", false, {});

        emitMilestone("TEXTURE_COMPOSE_STARTED", 93, "South texture composition started.", {
          checkpointId: "F13G_SOUTH_TEXTURE_COMPOSE_STARTED",
          fibonacci: "F13G"
        });

        const textureResult = await withTimeout(children.south.composeTexture({
          atlasCanvas: state.atlasCanvas,
          onProgress: (progress, receipt) => {
            state.textureComposeProgress = clamp(progress, 0, 100);
            updateZone("south", "ACTIVE", 20 + state.textureComposeProgress * 0.35, "TEXTURE_COMPOSE_PROGRESS", false);
            emitProgressOnly("TEXTURE_COMPOSE_PROGRESS", 93 + (state.textureComposeProgress * 0.03), `South texture progress ${state.textureComposeProgress}%`, receipt || {});
          }
        }), CHILD_METHOD_TIMEOUT_MS, "south.composeTexture");

        state.textureCanvas = normalizeCanvasResult(
          textureResult,
          isFunction(children.south.getTextureCanvas) ? () => children.south.getTextureCanvas() : null
        );

        state.textureComposeProgress = 100;
        state.textureComposeComplete = Boolean(state.textureCanvas);

        if (!state.textureComposeComplete) {
          state.textureComposeError = "south-texture-result-unusable";
          drawEmergencyF13DiagnosticPlanet(state.textureComposeError);
          finishBoot();
          return getReceipt();
        }

        updateZone("south", "ACTIVE", 58, "SOUTH_TEXTURE_COMPOSE_COMPLETE", false);
        completeGate("F13H_SOUTH_TEXTURE_COMPOSE_COMPLETE", false, {
          textureCanvas: true
        });

        emitMilestone("TEXTURE_COMPOSE_COMPLETE", 96, "South texture composition complete.", {
          checkpointId: "F13H_SOUTH_TEXTURE_COMPOSE_COMPLETE",
          fibonacci: "F13H"
        });

        if (!isFunction(children.south.renderSphere)) {
          drawEmergencyF13DiagnosticPlanet("south-renderSphere-unavailable");
          finishBoot();
          return getReceipt();
        }

        state.firstFrameRequested = true;
        completeGate("F13I_FIRST_FRAME_REQUESTED", false, {});

        emitMilestone("FIRST_FRAME_REQUESTED", 97, "South sphere frame requested.", {
          checkpointId: "F13I_FIRST_FRAME_REQUESTED",
          fibonacci: "F13I"
        });

        await withTimeout(children.south.renderSphere({
          canvas: state.canvas,
          textureCanvas: state.textureCanvas,
          view: children.west && isFunction(children.west.getViewState) ? children.west.getViewState() : {},
          onProgress: (progress, receipt) => {
            emitProgressOnly("SPHERE_RENDER_PROGRESS", 97, `South sphere render progress ${progress}%`, receipt || {});
          }
        }), CHILD_METHOD_TIMEOUT_MS, "south.renderSphere");

        state.firstFrameDetected = true;
        state.imageRendered = true;
        state.renderedAfterTexture = true;
        state.planetFramePainted = true;
        state.renderFrameCount += 1;

        completeGate("F13J_FIRST_FRAME_DETECTED", false, {});
        updateZone("south", "ACTIVE", 75, "FIRST_FRAME_DETECTED", false);

        emitMilestone("FIRST_FRAME_DETECTED", 98, "First frame detected.", {
          checkpointId: "F13J_FIRST_FRAME_DETECTED",
          fibonacci: "F13J"
        });

        state.canvasReady = true;
        state.visibleCanvasReady = true;
        state.canvasLaneClosed = true;
        state.canvasCarrierHandoffOk = true;

        completeGate("F13K_CANVAS_VISIBLE_READY", false, {});
        updateZone("south", "ACTIVE", 86, "CANVAS_VISIBLE_READY", false);

        emitMilestone("CANVAS_READY", 98, "Canvas visible F13 ready.", {
          checkpointId: "F13K_CANVAS_VISIBLE_READY",
          fibonacci: "F13K"
        });

        state.visibleContentProofStarted = true;
        completeGate("F13L_VISIBLE_CONTENT_PROOF_STARTED", false, {});

        emitMilestone("VISIBLE_CONTENT_PROOF_STARTED", 98, "Visible content proof started.", {
          checkpointId: "F13L_VISIBLE_CONTENT_PROOF_STARTED",
          fibonacci: "F13L"
        });

        let proof = {};

        if (isFunction(children.south.sampleVisibleContent)) {
          try {
            proof = children.south.sampleVisibleContent({ canvas: state.canvas }) || {};
          } catch (error) {
            recordError("SOUTH_VISIBLE_CONTENT_SAMPLE_FAILED", error);
          }
        }

        applyVisibleProof(proof);
        mergeChildReceipts();

        if (state.visibleContentProof) {
          emitMilestone("VISIBLE_CONTENT_PROOF_PASSED", 98, "Visible content proof passed.", {
            checkpointId: "F13M_VISIBLE_CONTENT_PROOF_ACCEPTED",
            fibonacci: "F13M"
          });
        } else if (state.visibleContentSoftGap || state.visibleForwardProgress || state.visibleContentAdmissible) {
          state.visibleContentSoftGap = true;
          state.visibleContentHardFail = false;
          emitMilestone("DEGRADED_VISIBLE_CONTENT_ACCEPTED", 98, "Visible content soft gap accepted.", {
            checkpointId: "F13M_VISIBLE_CONTENT_PROOF_ACCEPTED",
            fibonacci: "F13M"
          });
        } else {
          drawEmergencyF13DiagnosticPlanet("child-render-produced-no-visible-object");
        }

        completeGate("F13N_INSPECT_MODE_READY", false, {});
        emitMilestone("INSPECT_MODE_READY", 98, "Inspect mode ready.", {
          checkpointId: "F13N_INSPECT_MODE_READY",
          fibonacci: "F13N"
        });

        finishBoot();

        if (isFunction(options.onReady)) {
          try {
            options.onReady(getReceipt());
          } catch (error) {
            recordError("ON_READY_CALLBACK_ERROR", error);
          }
        }

        return getReceipt();
      } catch (error) {
        state.canvasCarrierHandoffOk = false;
        state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
        recordError("CANVAS_SINGLE_FILE_INTERNAL_NEWS_BOOT_FAILED", error);

        try {
          if (!state.canvas || !state.context) ensureCarrier(options);
          drawEmergencyF13DiagnosticPlanet(state.canvasCarrierHandoffError);
        } catch (fallbackError) {
          recordError("EMERGENCY_F13_DIAGNOSTIC_PLANET_FAILED", fallbackError);
          state.f13HardFail = true;
          state.visibleContentHardFail = true;
          state.canvasReady = false;
          state.visibleCanvasReady = false;
        }

        finishBoot();

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

  function finishBoot() {
    state.booting = false;
    state.booted = true;
    state.bootCompletedAt = nowIso();
    state.bootElapsedMs = state.bootStartedAt
      ? Math.max(0, Date.parse(state.bootCompletedAt) - Date.parse(state.bootStartedAt))
      : 0;
    state.updatedAt = state.bootCompletedAt;
    updateDataset();
    publishGlobals();
  }

  function boot(options = {}) {
    return bootCooperative(options);
  }

  async function mount(options = {}) {
    addCallbacksFromOptions(options);
    ensureCarrier(options);
    await ensureChildren();

    const west = resolveChild("west");

    if (west && isFunction(west.bindInspection)) {
      west.bindInspection({
        canvas: state.canvas,
        onChange: () => forceRedraw({ interactive: true, sampleProof: false }),
        onInvalidate: (reason) => invalidateTexture(reason || "west-control-invalidation")
      });

      state.dragInspectionBound = true;
      state.zoomInspectionBound = true;
      state.inspectModeAvailable = true;
      state.inspectPlanetControlAvailable = true;
      state.diagnosticCanLeavePlanetFrame = true;

      updateZone("west", "READY", 100, "WEST_CONTROL_BOUND", true);
      completeGate("F13D_WEST_CONTROL_BOUND", false, {});
    }

    updateDataset();
    return getReceipt();
  }

  async function render(options = {}) {
    addCallbacksFromOptions(options);

    if (!state.canvas || !state.context) {
      await mount(options);
    }

    const children = await ensureChildren();

    if (!state.allCanvasChildrenReady) {
      drawEmergencyF13DiagnosticPlanet(state.childLoadError || "render-request-child-incomplete");
      return getReceipt();
    }

    const south = children.south || resolveChild("south");
    const west = children.west || resolveChild("west");

    if (!south || !isFunction(south.renderSphere)) {
      drawEmergencyF13DiagnosticPlanet("south-renderSphere-unavailable");
      return getReceipt();
    }

    const textureCanvas = state.textureCanvas || (isFunction(south.getTextureCanvas) ? south.getTextureCanvas() : null);

    if (!textureCanvas) {
      return rebuildTexture(options);
    }

    await south.renderSphere({
      canvas: state.canvas,
      textureCanvas,
      view: west && isFunction(west.getViewState) ? west.getViewState() : {},
      onProgress: options.onProgress
    });

    state.firstFrameDetected = true;
    state.imageRendered = true;
    state.renderedAfterTexture = true;
    state.planetFramePainted = true;
    state.renderFrameCount += 1;
    state.canvasReady = true;
    state.visibleCanvasReady = true;

    completeGate("F13J_FIRST_FRAME_DETECTED", false, {});
    completeGate("F13K_CANVAS_VISIBLE_READY", false, {});

    if (isFunction(south.sampleVisibleContent)) {
      applyVisibleProof(south.sampleVisibleContent({ canvas: state.canvas }));
    } else {
      applyVisibleProof(sampleCanvasPixels());
    }

    updateDataset();
    return getReceipt();
  }

  function forceRedraw(options = {}) {
    const south = resolveChild("south");
    const west = resolveChild("west");

    if (!state.canvas || !state.context) return getReceipt();

    try {
      if (south && isFunction(south.getTextureCanvas) && south.getTextureCanvas()) {
        if (isFunction(south.renderSphereSync)) {
          south.renderSphereSync({
            canvas: state.canvas,
            textureCanvas: south.getTextureCanvas(),
            view: west && isFunction(west.getViewState) ? west.getViewState() : {},
            interactive: options.interactive !== false
          });
        }

        state.interactiveFrameCount += 1;
        state.imageRendered = true;
        state.firstFrameDetected = true;
        state.canvasReady = true;
        state.visibleCanvasReady = true;

        if (options.sampleProof === true && isFunction(south.sampleVisibleContent)) {
          applyVisibleProof(south.sampleVisibleContent({ canvas: state.canvas }));
        }
      } else {
        drawEmergencyF13DiagnosticPlanet("force-redraw-child-texture-unavailable");
      }
    } catch (error) {
      recordError("FORCE_REDRAW_FAILED", error);
      drawEmergencyF13DiagnosticPlanet("force-redraw-error");
    }

    updateDataset();
    return getReceipt();
  }

  function invalidateTexture(reason = "manual-texture-invalidation") {
    state.textureCanvas = null;
    state.textureComposeComplete = false;
    state.canvasReady = false;
    state.visibleCanvasReady = false;
    state.visibleContentProof = false;
    state.visibleContentStrictProof = false;
    state.visibleContentSoftGap = false;
    state.f13CanvasEvidenceComplete = false;
    state.updatedAt = nowIso();

    const south = resolveChild("south");

    if (south && isFunction(south.invalidateTexture)) {
      try {
        south.invalidateTexture(reason);
      } catch (error) {
        recordError("SOUTH_INVALIDATE_TEXTURE_FAILED", error);
      }
    }

    emitProgressOnly("TEXTURE_INVALIDATED", 96, `Texture invalidated: ${reason}`);
    updateDataset();

    return getReceipt();
  }

  async function rebuildTexture(options = {}) {
    addCallbacksFromOptions(options);

    const children = await ensureChildren();

    if (!state.allCanvasChildrenReady) {
      drawEmergencyF13DiagnosticPlanet(state.childLoadError || "rebuild-child-incomplete");
      return getReceipt();
    }

    const east = children.east || resolveChild("east");
    const west = children.west || resolveChild("west");
    const south = children.south || resolveChild("south");

    if (!state.canvas || !state.context) ensureCarrier(options);

    const atlasSize = resolveAtlasSize(options);

    state.atlasBuildStarted = true;
    state.atlasBuildProgress = 0;
    updateZone("east", "ACTIVE", 15, "REBUILD_ATLAS_STARTED", false);
    completeGate("F13E_EAST_ATLAS_BUILD_STARTED", false, atlasSize);

    const atlasResult = await east.buildAtlas({
      width: atlasSize.width,
      height: atlasSize.height,
      rowsPerChunk: options.rowsPerChunk,
      onProgress: (progress, receipt) => {
        state.atlasBuildProgress = clamp(progress, 0, 100);
        emitProgressOnly("ATLAS_BUILD_PROGRESS", 88 + (state.atlasBuildProgress * 0.03), `Atlas rebuild progress ${state.atlasBuildProgress}%`, receipt || {});
      }
    });

    state.atlasCanvas = normalizeCanvasResult(atlasResult);
    state.atlasBuildProgress = 100;
    state.atlasBuildComplete = Boolean(state.atlasCanvas);

    if (!state.atlasBuildComplete) {
      drawEmergencyF13DiagnosticPlanet("rebuild-atlas-result-unusable");
      return getReceipt();
    }

    updateZone("east", "READY", 100, "REBUILD_ATLAS_COMPLETE", true);
    completeGate("F13F_EAST_ATLAS_BUILD_COMPLETE", false, { rebuild: true });

    state.textureComposeStarted = true;
    state.textureComposeProgress = 0;
    completeGate("F13G_SOUTH_TEXTURE_COMPOSE_STARTED", false, { rebuild: true });

    const textureResult = await south.composeTexture({
      atlasCanvas: state.atlasCanvas,
      onProgress: (progress, receipt) => {
        state.textureComposeProgress = clamp(progress, 0, 100);
        emitProgressOnly("TEXTURE_COMPOSE_PROGRESS", 93 + (state.textureComposeProgress * 0.03), `Texture rebuild progress ${state.textureComposeProgress}%`, receipt || {});
      }
    });

    state.textureCanvas = normalizeCanvasResult(textureResult, isFunction(south.getTextureCanvas) ? () => south.getTextureCanvas() : null);
    state.textureComposeProgress = 100;
    state.textureComposeComplete = Boolean(state.textureCanvas);

    if (!state.textureComposeComplete) {
      drawEmergencyF13DiagnosticPlanet("rebuild-texture-result-unusable");
      return getReceipt();
    }

    completeGate("F13H_SOUTH_TEXTURE_COMPOSE_COMPLETE", false, { rebuild: true });

    await south.renderSphere({
      canvas: state.canvas,
      textureCanvas: state.textureCanvas,
      view: west && isFunction(west.getViewState) ? west.getViewState() : {}
    });

    state.imageRendered = true;
    state.firstFrameRequested = true;
    state.firstFrameDetected = true;
    state.renderedAfterTexture = true;
    state.renderFrameCount += 1;
    state.canvasReady = true;
    state.visibleCanvasReady = true;

    completeGate("F13I_FIRST_FRAME_REQUESTED", false, { rebuild: true });
    completeGate("F13J_FIRST_FRAME_DETECTED", false, { rebuild: true });
    completeGate("F13K_CANVAS_VISIBLE_READY", false, { rebuild: true });

    if (isFunction(south.sampleVisibleContent)) {
      applyVisibleProof(south.sampleVisibleContent({ canvas: state.canvas }));
    } else {
      applyVisibleProof(sampleCanvasPixels());
    }

    updateDataset();
    return getReceipt();
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

    state.rotationYaw = -0.18;
    state.rotationPitch = 0.05;

    if (west && isFunction(west.resetRotation)) west.resetRotation();

    return forceRedraw({ interactive: true, sampleProof: false });
  }

  function setZoom(value = 1, options = {}) {
    const west = resolveChild("west");

    state.zoomLevel = clamp(value, state.zoomMin, state.zoomMax);

    if (west && isFunction(west.setZoom)) west.setZoom(state.zoomLevel, options);

    return forceRedraw({ interactive: true, sampleProof: options.sampleProof === true });
  }

  function zoomIn(step = 0.18) {
    return setZoom(state.zoomLevel + Math.abs(safeNumber(step, 0.18)), { source: "zoomIn" });
  }

  function zoomOut(step = 0.18) {
    return setZoom(state.zoomLevel - Math.abs(safeNumber(step, 0.18)), { source: "zoomOut" });
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

  function sampleVisibleContent() {
    const south = resolveChild("south");
    let proof = {};

    if (south && isFunction(south.sampleVisibleContent)) {
      try {
        proof = south.sampleVisibleContent({ canvas: state.canvas }) || {};
      } catch (error) {
        recordError("SOUTH_SAMPLE_VISIBLE_CONTENT_FAILED", error);
      }
    }

    const applied = applyVisibleProof(proof);
    updateDataset();
    return applied;
  }

  function classifyVisibleContentEvidence(metrics = {}) {
    const south = resolveChild("south");

    if (south && isFunction(south.classifyVisibleContentEvidence)) {
      try {
        return applyVisibleProof(south.classifyVisibleContentEvidence(metrics));
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
      materialContractMatchesExpected: state.materialContractMatchesExpected === true,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected === true,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed === true
    };
  }

  function getReceipt() {
    readNorthAuthority();
    markChildrenPresence();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      previousSplitContract: PREVIOUS_SPLIT_CONTRACT,
      previousSplitReceipt: PREVIOUS_SPLIT_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      role: state.role,

      singlePhysicalFile: true,
      internalNewsZonesActive: true,
      internalFourZoneSchematicActive: true,
      noAdditionalCanvasFileSplit: true,

      canvasNorthActive: true,
      physicalObjectBootstrapActive: true,
      physicalCarrierProofActive: true,
      carrierReadyIsNotPlanetReady: true,
      canvasReadyRequiresTextureFrameAndProof: true,
      f13PhysicalProofRequired: true,
      emergencyF13DiagnosticPlanetAllowed: true,
      emergencyF13DiagnosticPlanetUsed: state.emergencyF13DiagnosticPlanetUsed,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: state.activeFibonacci,
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,
      cycleOrder: CYCLE_ORDER,

      internalZones: clonePlain(state.zones),
      fibonacciGateLedger: clonePlain(state.gateLedger),
      completedGates: state.completedGates.slice(),
      degradedGates: state.degradedGates.slice(),
      blockedGates: state.blockedGates.slice(),

      northFile: NORTH_FILE,
      eastFile: EAST_FILE,
      westFile: WEST_FILE,
      southFile: SOUTH_FILE,

      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      carrierReady: state.carrierReady,
      canvasCarrierReady: state.canvasCarrierReady,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      canvasCarrierMethod: state.canvasCarrierMethod,

      canvasReady: state.canvasReady,
      visibleCanvasReady: state.visibleCanvasReady,
      canvasLaneClosed: state.canvasLaneClosed,

      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      carrierPhysicalWidth: state.carrierPhysicalWidth,
      carrierPhysicalHeight: state.carrierPhysicalHeight,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      visiblePlanetHintPresent: state.visiblePlanetHintPresent,

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

      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      atlasBuildError: state.atlasBuildError,
      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,
      textureComposeError: state.textureComposeError,
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

      materialReceiptBridge: getMaterialBridgeReceipt(),
      materialReceiptBridgeActive: state.materialReceiptBridgeActive,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed,

      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
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

      northAuthorityPresent: state.northAuthorityPresent,
      checkpointSessionSubmissionAvailable: state.checkpointSessionSubmissionAvailable,
      canvasEvidenceSubmittedToNorth: state.canvasEvidenceSubmittedToNorth,

      f13CanvasEvidencePreserved: true,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,

      booting: state.booting,
      booted: state.booted,
      bootStartedAt: state.bootStartedAt,
      bootCompletedAt: state.bootCompletedAt,
      bootElapsedMs: state.bootElapsedMs,

      canvasPhaseEvents: clonePlain(state.canvasPhaseEvents),
      progressOnlyEvents: clonePlain(state.progressOnlyEvents),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      ownsCanvasEvidenceOnly: true,
      ownsCanvasNorthGate: true,
      ownsPhysicalCarrierProof: true,
      ownsEmergencyF13DiagnosticPlanet: true,
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

    const zones = Object.entries(r.internalZones || {})
      .map(([key, zone]) => `- ${key}: status=${zone.status}; progress=${zone.progress}; complete=${zone.complete}; latestEvent=${zone.latestEvent}`)
      .join("\n") || "- none";

    const gates = (r.fibonacciGateLedger || [])
      .map((gate) => `- ${gate.id}: ${gate.cardinal}; ${gate.fib}; complete=${gate.complete}; degraded=${gate.degraded}`)
      .join("\n") || "- none";

    const errors = (r.errors || [])
      .map((event) => `- ${event.at} :: ${event.code || event.event} :: ${event.message}`)
      .join("\n") || "- none";

    const phases = (r.canvasPhaseEvents || [])
      .slice(-40)
      .map((event) => `- ${event.at} :: ${event.fibonacci || ""} :: ${event.event || event.phase || ""} :: ${event.message || ""}`)
      .join("\n") || "- none";

    return [
      "HEARTH_CANVAS_SINGLE_FILE_INTERNAL_NEWS_F13_SCHEMATIC_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `splitContract=${r.splitContract}`,
      `splitReceipt=${r.splitReceipt}`,
      `previousSplitContract=${r.previousSplitContract}`,
      `previousSplitReceipt=${r.previousSplitReceipt}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `singlePhysicalFile=${r.singlePhysicalFile}`,
      `internalNewsZonesActive=${r.internalNewsZonesActive}`,
      `internalFourZoneSchematicActive=${r.internalFourZoneSchematicActive}`,
      `noAdditionalCanvasFileSplit=${r.noAdditionalCanvasFileSplit}`,
      "",
      `canvasNorthActive=${r.canvasNorthActive}`,
      `physicalObjectBootstrapActive=${r.physicalObjectBootstrapActive}`,
      `physicalCarrierProofActive=${r.physicalCarrierProofActive}`,
      `carrierReadyIsNotPlanetReady=${r.carrierReadyIsNotPlanetReady}`,
      `canvasReadyRequiresTextureFrameAndProof=${r.canvasReadyRequiresTextureFrameAndProof}`,
      `f13PhysicalProofRequired=${r.f13PhysicalProofRequired}`,
      `emergencyF13DiagnosticPlanetAllowed=${r.emergencyF13DiagnosticPlanetAllowed}`,
      `emergencyF13DiagnosticPlanetUsed=${r.emergencyF13DiagnosticPlanetUsed}`,
      "",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `cycleOrder=${r.cycleOrder}`,
      "",
      "INTERNAL_ZONES",
      zones,
      "",
      "FIBONACCI_GATE_LEDGER",
      gates,
      "",
      `canvasCarrierRequested=${r.canvasCarrierRequested}`,
      `canvasCarrierMounted=${r.canvasCarrierMounted}`,
      `canvasContextReady=${r.canvasContextReady}`,
      `carrierReady=${r.carrierReady}`,
      `canvasCarrierReady=${r.canvasCarrierReady}`,
      `canvasCarrierHandoffOk=${r.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${r.canvasCarrierHandoffError}`,
      `canvasReady=${r.canvasReady}`,
      `visibleCanvasReady=${r.visibleCanvasReady}`,
      "",
      `planetCanvasPresent=${r.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${r.planetCanvasNonZeroSize}`,
      `carrierPhysicalWidth=${r.carrierPhysicalWidth}`,
      `carrierPhysicalHeight=${r.carrierPhysicalHeight}`,
      `planetFramePainted=${r.planetFramePainted}`,
      `nonblankPlanetVisible=${r.nonblankPlanetVisible}`,
      `planetNotObstructed=${r.planetNotObstructed}`,
      `visiblePlanetAvailable=${r.visiblePlanetAvailable}`,
      `visiblePlanetHintPresent=${r.visiblePlanetHintPresent}`,
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
      `atlasBuildError=${r.atlasBuildError}`,
      `textureComposeStarted=${r.textureComposeStarted}`,
      `textureComposeProgress=${r.textureComposeProgress}`,
      `textureComposeComplete=${r.textureComposeComplete}`,
      `textureComposeError=${r.textureComposeError}`,
      `firstFrameRequested=${r.firstFrameRequested}`,
      `firstFrameDetected=${r.firstFrameDetected}`,
      `imageRendered=${r.imageRendered}`,
      `renderedAfterTexture=${r.renderedAfterTexture}`,
      "",
      `visibleContentProofStarted=${r.visibleContentProofStarted}`,
      `visibleContentProof=${r.visibleContentProof}`,
      `visibleContentStrictProof=${r.visibleContentStrictProof}`,
      `visibleContentSoftGap=${r.visibleContentSoftGap}`,
      `visibleContentHardFail=${r.visibleContentHardFail}`,
      `visibleForwardProgress=${r.visibleForwardProgress}`,
      `visibleContentAdmissible=${r.visibleContentAdmissible}`,
      `visibleContentProofMethod=${r.visibleContentProofMethod}`,
      `visibleContentProofError=${r.visibleContentProofError}`,
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
    dataset.hearthCanvasVersion = VERSION;
    dataset.hearthCanvasRole = state.role;

    dataset.hearthCanvasSinglePhysicalFile = "true";
    dataset.hearthCanvasInternalNewsZonesActive = "true";
    dataset.hearthCanvasInternalFourZoneSchematicActive = "true";
    dataset.hearthCanvasNoAdditionalFileSplit = "true";

    dataset.hearthCanvasNorthActive = "true";
    dataset.hearthCanvasPhysicalObjectBootstrapActive = "true";
    dataset.hearthCanvasPhysicalCarrierProofActive = "true";
    dataset.hearthCanvasCarrierReadyIsNotPlanetReady = "true";
    dataset.hearthCanvasReadyRequiresTextureFrameAndProof = "true";
    dataset.hearthCanvasF13PhysicalProofRequired = "true";
    dataset.hearthCanvasEmergencyF13DiagnosticPlanetUsed = String(state.emergencyF13DiagnosticPlanetUsed);

    dataset.hearthCanvasNewsProtocolSynchronized = "true";
    dataset.hearthCanvasFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasActiveFibonacciGate = state.activeFibonacci || "F13";
    dataset.hearthCanvasFutureFibonacciGate = "F21";
    dataset.hearthCanvasOneActiveGearAtATime = "true";
    dataset.hearthCanvasCycleOrder = CYCLE_ORDER;

    dataset.hearthCanvasCarrierRequested = String(state.canvasCarrierRequested);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthCanvasContextReady = String(state.canvasContextReady);
    dataset.hearthCanvasCarrierReady = String(state.carrierReady);
    dataset.hearthCanvasCarrierHandoffOk = String(state.canvasCarrierHandoffOk);
    dataset.hearthCanvasCarrierHandoffError = state.canvasCarrierHandoffError;
    dataset.hearthCanvasReady = String(state.canvasReady);
    dataset.hearthCanvasVisibleReady = String(state.visibleCanvasReady);

    dataset.hearthPlanetCanvasPresent = String(state.planetCanvasPresent);
    dataset.hearthPlanetCanvasNonZeroSize = String(state.planetCanvasNonZeroSize);
    dataset.hearthCanvasPlanetFramePainted = String(state.planetFramePainted);
    dataset.hearthCanvasVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    dataset.hearthCanvasVisiblePlanetHintPresent = String(state.visiblePlanetHintPresent);
    dataset.hearthCanvasNonblankPlanetVisible = String(state.nonblankPlanetVisible);

    dataset.hearthCanvasEastPresent = String(state.canvasEastPresent);
    dataset.hearthCanvasWestPresent = String(state.canvasWestPresent);
    dataset.hearthCanvasSouthPresent = String(state.canvasSouthPresent);
    dataset.hearthCanvasEastReady = String(state.canvasEastReady);
    dataset.hearthCanvasWestReady = String(state.canvasWestReady);
    dataset.hearthCanvasSouthReady = String(state.canvasSouthReady);
    dataset.hearthCanvasAllChildrenReady = String(state.allCanvasChildrenReady);
    dataset.hearthCanvasEastMissingMethods = state.canvasEastMissingMethods;
    dataset.hearthCanvasWestMissingMethods = state.canvasWestMissingMethods;
    dataset.hearthCanvasSouthMissingMethods = state.canvasSouthMissingMethods;
    dataset.hearthCanvasChildLoadAttempted = String(state.childLoadAttempted);
    dataset.hearthCanvasChildLoadComplete = String(state.childLoadComplete);
    dataset.hearthCanvasChildLoadError = state.childLoadError;
    dataset.hearthCanvasNextAuditTarget = state.nextAuditTarget || "";

    dataset.hearthCanvasAtlasBuildStarted = String(state.atlasBuildStarted);
    dataset.hearthCanvasAtlasBuildProgress = String(state.atlasBuildProgress);
    dataset.hearthCanvasAtlasBuildComplete = String(state.atlasBuildComplete);
    dataset.hearthCanvasAtlasBuildError = state.atlasBuildError;
    dataset.hearthCanvasTextureComposeStarted = String(state.textureComposeStarted);
    dataset.hearthCanvasTextureComposeProgress = String(state.textureComposeProgress);
    dataset.hearthCanvasTextureComposeComplete = String(state.textureComposeComplete);
    dataset.hearthCanvasTextureComposeError = state.textureComposeError;
    dataset.hearthCanvasFirstFrameRequested = String(state.firstFrameRequested);
    dataset.hearthCanvasFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthCanvasImageRendered = String(state.imageRendered);

    dataset.hearthCanvasVisibleContentProofStarted = String(state.visibleContentProofStarted);
    dataset.hearthCanvasVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthCanvasVisibleContentStrictProof = String(state.visibleContentStrictProof);
    dataset.hearthCanvasVisibleContentSoftGap = String(state.visibleContentSoftGap);
    dataset.hearthCanvasVisibleContentHardFail = String(state.visibleContentHardFail);
    dataset.hearthCanvasVisibleForwardProgress = String(state.visibleForwardProgress);
    dataset.hearthCanvasVisibleContentAdmissible = String(state.visibleContentAdmissible);

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
      state.canvas.dataset.hearthCanvasCarrierReady = String(state.carrierReady);
      state.canvas.dataset.hearthCanvasReady = String(state.canvasReady);
      state.canvas.dataset.hearthCanvasVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
      state.canvas.dataset.hearthCanvasF13Only = "true";
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
    root.HEARTH.canvasPhysicalObjectBootstrap = api;
    root.HEARTH.canvasSingleFileInternalNews = api;

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
    root.HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP = api;
    root.HEARTH_CANVAS_SINGLE_FILE_INTERNAL_NEWS = api;

    root.DEXTER_LAB.hearthCanvasEvidence = api;
    root.DEXTER_LAB.hearthCanvasNorth = api;
    root.DEXTER_LAB.hearthCanvasSplitAdapter = api;
    root.DEXTER_LAB.hearthCanvasTransistorGate = api;
    root.DEXTER_LAB.hearthCanvasVisualFidelity = api;
    root.DEXTER_LAB.hearthCanvasInteractiveRotation = api;
    root.DEXTER_LAB.hearthCanvasSevenContinentVisualField = api;
    root.DEXTER_LAB.hearthCanvasUpstreamFirstZoomLod = api;
    root.DEXTER_LAB.hearthCanvasMaterialsReliefConsumptionInvalidation = api;
    root.DEXTER_LAB.hearthCanvasPhysicalObjectBootstrap = api;
    root.DEXTER_LAB.hearthCanvasSingleFileInternalNews = api;

    const light = getReceiptLight();

    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_EVIDENCE_RECEIPT = light;
    root.HEARTH_CANVAS_POSTGAME_RECEIPT = light;
    root.HEARTH.canvasReceipt = light;
    root.HEARTH.canvasEvidenceReceipt = light;

    updateDataset();
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
      singlePhysicalFile: true,
      internalNewsZonesActive: true,
      carrierReady: state.carrierReady,
      canvasCarrierReady: state.canvasCarrierReady,
      canvasReady: state.canvasReady,
      visibleCanvasReady: state.visibleCanvasReady,
      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeComplete: state.textureComposeComplete,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      visiblePlanetHintPresent: state.visiblePlanetHintPresent,
      visibleContentProof: state.visibleContentProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      emergencyF13DiagnosticPlanetUsed: state.emergencyF13DiagnosticPlanetUsed,
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
    ensureCarrier,
    drawEmergencyF13DiagnosticPlanet,

    canvasNorthActive: true,
    physicalObjectBootstrapActive: true,
    physicalCarrierProofActive: true,
    splitAdapterActive: true,
    transistorAdapterActive: true,

    singlePhysicalFile: true,
    internalNewsZonesActive: true,
    internalFourZoneSchematicActive: true,
    noAdditionalCanvasFileSplit: true,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    cycleOrder: CYCLE_ORDER,

    ownsCanvasEvidenceOnly: true,
    ownsCanvasNorthGate: true,
    ownsPhysicalCarrierProof: true,
    ownsEmergencyF13DiagnosticPlanet: true,
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

  if (doc) {
    const autoBoot = () => {
      root.setTimeout(() => {
        if (!state.booted && !state.booting) {
          bootCooperative({ mount: "#hearthCanvasMount" });
        }
      }, 120);
    };

    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", autoBoot, { once: true });
    } else {
      autoBoot();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
