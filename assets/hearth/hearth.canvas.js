// /assets/hearth/hearth.canvas.js
// HEARTH_SEVEN_CONTINENT_TRANSITIONAL_CANVAS_VISUAL_FIELD_TNT_v1
// Full-file replacement.
// Canvas / F13 evidence authority only.
// Purpose:
// - Replace the stale six-lobe additive visual fallback with a seven-continent separated field.
// - Preserve NEWS/Fibonacci F13 evidence flow.
// - Preserve cooperative chunking so the page does not freeze.
// - Preserve pointer/touch drag repaint and cached texture inspection.
// - Add explicit texture invalidation/rebuild capability so land-shape renewals do not stay visually stale.
// - Demote source color to palette influence only.
// - Use elevation/hydrology as bounded inputs, not flat source-color masks.
// - Feed North Runtime Table checkpoint evidence without claiming F21.
// Does not own:
// - planet truth
// - upstream elevation truth
// - upstream composition truth
// - hydrology truth
// - child channel truth
// - Runtime Table governance
// - NEWS gate final authority
// - route orchestration
// - runtime motion
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SEVEN_CONTINENT_TRANSITIONAL_CANVAS_VISUAL_FIELD_TNT_v1";
  const RECEIPT = "HEARTH_SEVEN_CONTINENT_TRANSITIONAL_CANVAS_VISUAL_FIELD_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_INTERACTIVE_VISUAL_FIDELITY_STALE_CANVAS_REPAIR_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_NEWS_FIBONACCI_SOFT_GAP_EVIDENCE_ADAPTER_TNT_v2";
  const VERSION = "2026-05-30.hearth-seven-continent-transitional-canvas-visual-field-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FILE = "/assets/hearth/hearth.canvas.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";

  const DEFAULT_SIZE = 600;
  const ATLAS_WIDTH = 640;
  const ATLAS_HEIGHT = 320;
  const ATLAS_ROWS_PER_CHUNK = 4;
  const SPHERE_ROWS_PER_CHUNK = 8;
  const TEXTURE_STEPS = 18;
  const SAMPLE_COUNT = 257;

  const CHECKPOINT_BY_PHASE = Object.freeze({
    CANVAS_COOPERATIVE_BOOT_STARTED: {
      checkpointId: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED",
      event: "CANVAS_COOPERATIVE_BOOT_STARTED",
      progress: 78
    },
    CANVAS_MOUNT_CREATED: {
      checkpointId: "F13B_CANVAS_MOUNT_CREATED",
      event: "CANVAS_MOUNT_CREATED",
      progress: 81
    },
    CANVAS_CONTEXT_READY: {
      checkpointId: "F13C_CANVAS_CONTEXT_READY",
      event: "CANVAS_CONTEXT_READY",
      progress: 84
    },
    DRAG_INSPECTION_BOUND: {
      checkpointId: "F13D_DRAG_INSPECTION_BOUND",
      event: "DRAG_INSPECTION_BOUND",
      progress: 86
    },
    ATLAS_BUILD_STARTED: {
      checkpointId: "F13E_ATLAS_BUILD_STARTED",
      event: "ATLAS_BUILD_STARTED",
      progress: 88
    },
    ATLAS_BUILD_COMPLETE: {
      checkpointId: "F13F_ATLAS_BUILD_COMPLETE",
      event: "ATLAS_BUILD_COMPLETE",
      progress: 91
    },
    TEXTURE_COMPOSE_STARTED: {
      checkpointId: "F13G_TEXTURE_COMPOSE_STARTED",
      event: "TEXTURE_COMPOSE_STARTED",
      progress: 93
    },
    TEXTURE_COMPOSE_COMPLETE: {
      checkpointId: "F13H_TEXTURE_COMPOSE_COMPLETE",
      event: "TEXTURE_COMPOSE_COMPLETE",
      progress: 96
    },
    FIRST_FRAME_REQUESTED: {
      checkpointId: "F13I_FIRST_FRAME_REQUESTED",
      event: "FIRST_FRAME_REQUESTED",
      progress: 97
    },
    FIRST_FRAME_DETECTED: {
      checkpointId: "F13J_FIRST_FRAME_DETECTED",
      event: "FIRST_FRAME_DETECTED",
      progress: 98
    },
    CANVAS_READY: {
      checkpointId: "F13K_CANVAS_READY",
      event: "CANVAS_READY",
      progress: 98
    },
    VISIBLE_CONTENT_PROOF_STARTED: {
      checkpointId: "F13L_VISIBLE_CONTENT_PROOF_STARTED",
      event: "VISIBLE_CONTENT_PROOF_STARTED",
      progress: 98
    },
    VISIBLE_CONTENT_PROOF_PASSED: {
      checkpointId: "F13M_VISIBLE_CONTENT_PROOF_PASSED",
      event: "VISIBLE_CONTENT_PROOF_PASSED",
      progress: 98
    },
    DEGRADED_VISIBLE_CONTENT_ACCEPTED: {
      checkpointId: "F13M_VISIBLE_CONTENT_PROOF_PASSED",
      event: "DEGRADED_VISIBLE_CONTENT_ACCEPTED",
      progress: 98
    },
    VISIBLE_CONTENT_HARD_FAIL: {
      checkpointId: "F13M_VISIBLE_CONTENT_PROOF_PASSED",
      event: "VISIBLE_CONTENT_PROOF_PASSED",
      progress: 98
    }
  });

  const EARLY_CANVAS_EVENTS = new Set([
    "CANVAS_COOPERATIVE_BOOT_STARTED",
    "CANVAS_MOUNT_CREATED",
    "CANVAS_CONTEXT_READY",
    "DRAG_INSPECTION_BOUND",
    "ATLAS_BUILD_STARTED"
  ]);

  const SEVEN_CONTINENT_SEEDS = Object.freeze([
    {
      id: "northwest-continent",
      index: 1,
      u: 0.17,
      v: 0.34,
      rx: 0.115,
      ry: 0.205,
      rot: -24,
      weight: 1.02,
      seed: 101
    },
    {
      id: "north-tethys-continent",
      index: 2,
      u: 0.36,
      v: 0.22,
      rx: 0.125,
      ry: 0.155,
      rot: 18,
      weight: 0.94,
      seed: 202
    },
    {
      id: "west-equatorial-continent",
      index: 3,
      u: 0.38,
      v: 0.55,
      rx: 0.135,
      ry: 0.205,
      rot: 8,
      weight: 1.0,
      seed: 303
    },
    {
      id: "central-south-continent",
      index: 4,
      u: 0.55,
      v: 0.68,
      rx: 0.145,
      ry: 0.185,
      rot: -16,
      weight: 0.92,
      seed: 404
    },
    {
      id: "east-continent",
      index: 5,
      u: 0.66,
      v: 0.38,
      rx: 0.125,
      ry: 0.185,
      rot: 22,
      weight: 0.98,
      seed: 505
    },
    {
      id: "southeast-island-continent",
      index: 6,
      u: 0.84,
      v: 0.62,
      rx: 0.11,
      ry: 0.15,
      rot: -28,
      weight: 0.78,
      seed: 606
    },
    {
      id: "polar-crown-continent",
      index: 7,
      u: 0.06,
      v: 0.17,
      rx: 0.155,
      ry: 0.095,
      rot: 0,
      weight: 0.7,
      seed: 707
    }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "f13-canvas-evidence-producer-seven-continent-transitional-visual-field",

    northAuthority: NORTH_FILE,
    ownsCanvasEvidenceOnly: true,
    ownsVisualTranslation: true,
    ownsInteractiveCanvasRepaint: true,
    doesNotOwnPlanetTruth: true,
    doesNotOwnRuntimeTableGovernance: true,
    doesNotOwnNewsFinalAuthority: true,
    doesNotOwnF21: true,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    cycleOrder: "EAST_WEST_NORTH_SOUTH_CHECKPOINT_EAST",

    sevenContinentVisualFallbackActive: true,
    transitionalFallbackVisualField: true,
    upstreamSevenContinentAuthorityPreferred: true,
    continentVisualSeedCount: 7,
    continentBlendMode: "max-separated",
    proceduralSixLobeAdditiveFieldRetired: true,
    oceanChannelCutActive: true,
    seaLineTightened: true,
    coastlineSharpeningActive: true,
    cachedTextureInvalidationAvailable: true,
    landChannelStillReceiverOnly: true,

    booting: false,
    booted: false,
    canvasLaneClosed: false,

    canvas: null,
    context: null,
    mount: null,
    atlasCanvas: null,
    atlasContext: null,
    textureCanvas: null,
    textureContext: null,
    textureImageData: null,

    callbacks: [],
    canvasPhaseEvents: [],
    progressOnlyEvents: [],
    archivedLateEvents: [],
    localEvents: [],
    errors: [],

    northAuthorityPresent: false,
    checkpointGovernorDetected: false,
    checkpointSessionSubmissionAvailable: false,
    canvasEvidenceSubmittedToNorth: false,

    canvasReady: false,
    canvasCarrierMounted: false,
    canvasContextReady: false,
    canvasCarrierRequested: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",

    cooperativeBootAvailable: true,
    cooperativeBootUsed: false,
    syncBootFallbackUsed: false,
    canvasCarrierMethod: "bootCooperative",
    canvasBootStartedAt: "",
    canvasBootCompletedAt: "",
    canvasBootElapsedMs: 0,
    canvasYieldCount: 0,
    canvasPhaseCount: 0,

    postCanvasReadyRebootSuppressed: false,
    lateCanvasBootEventsArchived: false,
    duplicateCanvasEventsSuppressed: false,
    progressOnlyEventsArchived: false,
    regressiveCanvasEventsBlocked: false,

    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    textureComposeStarted: false,
    textureComposeProgress: 0,
    textureComposeComplete: false,
    firstFrameRequested: false,
    firstFrameDetected: false,
    imageRendered: false,
    renderedAfterTexture: false,
    dragInspectionBound: false,

    textureInvalidationCount: 0,
    textureInvalidated: false,
    textureInvalidationReason: "",
    textureRebuildRequested: false,
    textureRebuildComplete: false,
    textureRebuildError: "",

    interactiveRotationActive: true,
    staleCanvasRepairActive: true,
    cachedTextureRepaintActive: true,
    pointerInspectionActive: false,
    pointerInspectionPainted: false,
    pointerDragCount: 0,
    renderFrameCount: 0,
    interactiveFrameCount: 0,
    lastInteractionAt: "",
    lastPointerDeltaX: 0,
    lastPointerDeltaY: 0,
    rotationYaw: -0.18,
    rotationPitch: 0.05,
    rotationVelocityYaw: 0,
    rotationVelocityPitch: 0,
    inertiaActive: false,
    inertiaFrame: 0,

    visibleContentProofStarted: false,
    visibleContentProof: false,
    visibleContentStrictProof: false,
    visibleContentSoftGap: false,
    visibleContentHardFail: false,
    visibleForwardProgress: false,
    visibleContentAdmissible: false,
    visiblePlanetAvailable: false,
    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    planetFramePainted: false,
    nonblankPlanetVisible: false,
    planetNotObstructed: false,

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

    visualFidelityRenewalActive: true,
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
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function mixRgb(a, b, t) {
    const k = clamp01(t);
    return [
      Math.round(mix(a[0], b[0], k)),
      Math.round(mix(a[1], b[1], k)),
      Math.round(mix(a[2], b[2], k))
    ];
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
  }

  function yieldFrame(ms = 0) {
    state.canvasYieldCount += 1;

    return new Promise((resolve) => {
      if (typeof root.requestAnimationFrame === "function") {
        root.requestAnimationFrame(() => {
          if (ms > 0) root.setTimeout(resolve, ms);
          else resolve();
        });
      } else {
        root.setTimeout(resolve, Math.max(0, ms));
      }
    });
  }

  function resolveElement(candidate) {
    if (!doc || !candidate) return null;
    if (candidate.nodeType === 1) return candidate;

    if (typeof candidate === "string") {
      try {
        return doc.querySelector(candidate);
      } catch (_error) {
        return null;
      }
    }

    if (candidate.current && candidate.current.nodeType === 1) return candidate.current;
    if (candidate.element && candidate.element.nodeType === 1) return candidate.element;
    if (candidate.mount && candidate.mount.nodeType === 1) return candidate.mount;

    return null;
  }

  function resolveMount(options = {}) {
    if (!doc) return null;

    const direct = resolveElement(options.mount || options.mountEl || options.container || options.target);
    if (direct) return direct;

    const selectors = [
      "#hearthCanvasMount",
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

  function ensureCanvas(options = {}) {
    if (!doc) throw new Error("Document unavailable for Hearth canvas.");

    const mount = resolveMount(options);
    if (!mount) throw new Error("Hearth canvas mount unavailable.");

    let canvas = null;

    if (mount.tagName && String(mount.tagName).toLowerCase() === "canvas") {
      canvas = mount;
    } else {
      canvas =
        mount.querySelector("canvas[data-hearth-canvas-texture='true']") ||
        mount.querySelector("canvas[data-hearth-canvas='true']") ||
        mount.querySelector("canvas.hearth-canvas") ||
        null;
    }

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.className = "hearth-canvas hearth-canvas--seven-continent-transitional";
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasTexture = "true";
      canvas.dataset.hearthCanvasContract = CONTRACT;
      canvas.setAttribute("aria-label", "Hearth visible planet canvas");
      mount.appendChild(canvas);
    }

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";
    canvas.style.objectFit = "contain";
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";

    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: DEFAULT_SIZE, height: DEFAULT_SIZE };
    const widthFromRect = safeNumber(rect.width, DEFAULT_SIZE) || DEFAULT_SIZE;
    const heightFromRect = safeNumber(rect.height, DEFAULT_SIZE) || DEFAULT_SIZE;
    const explicitSize = safeNumber(options.canvasSize, 0) || safeNumber(options.size, 0);

    const finalSize = explicitSize
      ? Math.max(320, Math.round(explicitSize))
      : Math.max(360, Math.round(Math.min(DEFAULT_SIZE, Math.max(360, widthFromRect), Math.max(360, heightFromRect))));

    if (canvas.width !== finalSize) canvas.width = finalSize;
    if (canvas.height !== finalSize) canvas.height = finalSize;

    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!context) throw new Error("2D canvas context unavailable.");

    state.mount = mount;
    state.canvas = canvas;
    state.context = context;
    state.planetCanvasPresent = true;
    state.planetCanvasNonZeroSize = canvas.width > 0 && canvas.height > 0;
    state.canvasCarrierMounted = true;
    state.canvasContextReady = true;

    updateDocumentDataset();

    return { mount, canvas, context };
  }

  function createWorkingCanvas(width, height) {
    const canvas = doc ? doc.createElement("canvas") : null;
    if (!canvas) return { canvas: null, context: null };

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    return { canvas, context };
  }

  function hashNoise(x, y, seed = 1) {
    const n = Math.sin((x * 127.1 + y * 311.7 + seed * 74.7)) * 43758.5453123;
    return n - Math.floor(n);
  }

  function smoothNoise(x, y, seed = 1) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;

    const a = hashNoise(ix, iy, seed);
    const b = hashNoise(ix + 1, iy, seed);
    const c = hashNoise(ix, iy + 1, seed);
    const d = hashNoise(ix + 1, iy + 1, seed);

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }

  function fbm(x, y, seed = 1, octaves = 5) {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let total = 0;

    for (let i = 0; i < octaves; i += 1) {
      value += smoothNoise(x * frequency, y * frequency, seed + i * 17) * amplitude;
      total += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return total ? value / total : value;
  }

  function lonLatToVector(lon, lat) {
    const radLon = lon * Math.PI / 180;
    const radLat = lat * Math.PI / 180;
    const cosLat = Math.cos(radLat);

    return {
      x: cosLat * Math.cos(radLon),
      y: Math.sin(radLat),
      z: cosLat * Math.sin(radLon)
    };
  }

  function signedWrapDelta(a, b) {
    let d = a - b;
    if (d > 0.5) d -= 1;
    if (d < -0.5) d += 1;
    return d;
  }

  function continentLobe(u, v, seed) {
    const du = signedWrapDelta(u, seed.u);
    const dv = v - seed.v;
    const angle = safeNumber(seed.rot, 0) * Math.PI / 180;
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);

    const ru = du * ca - dv * sa;
    const rv = du * sa + dv * ca;

    const rx = Math.max(0.0001, safeNumber(seed.rx, 0.1));
    const ry = Math.max(0.0001, safeNumber(seed.ry, 0.1));

    const core = Math.exp(-((ru / rx) ** 2 + (rv / ry) ** 2));
    const shoulder = Math.exp(-((ru / (rx * 1.75)) ** 2 + (rv / (ry * 1.55)) ** 2)) * 0.34;

    const edgeNoise = fbm(u * 8.5 + seed.seed * 0.13, v * 7.3 - seed.seed * 0.07, seed.seed, 4);
    const biteNoise = fbm(u * 15.0 - seed.seed * 0.03, v * 13.0 + seed.seed * 0.04, seed.seed + 9, 4);
    const irregular = 0.82 + edgeNoise * 0.26 - biteNoise * 0.12;

    return clamp01((core + shoulder) * seed.weight * irregular);
  }

  function sevenContinentField(u, v, latBand) {
    const warpA = fbm(u * 2.2 + 7.0, v * 2.0 - 3.0, 111, 4) - 0.5;
    const warpB = fbm(u * 1.9 - 4.0, v * 2.4 + 2.2, 222, 4) - 0.5;

    const wu = (u + warpA * 0.032 + 1) % 1;
    const wv = clamp01(v + warpB * 0.028);

    const values = SEVEN_CONTINENT_SEEDS
      .map((seed) => ({
        seed,
        value: continentLobe(wu, wv, seed)
      }))
      .sort((a, b) => b.value - a.value);

    const primary = values[0];
    const secondary = values[1] || { value: 0, seed: null };

    const regional = fbm(u * 5.8 - 1.5, v * 4.8 + 2.8, 333, 5);
    const fine = fbm(u * 18.0 + 4.7, v * 14.0 - 2.8, 444, 4);
    const ridgeRaw = fbm(u * 11.0 + 7.1, v * 8.6 - 6.2, 555, 4);
    const ridge = 1 - Math.abs(ridgeRaw - 0.5) * 2;
    const basinRaw = fbm(u * 4.2 - 3.2, v * 3.5 + 5.6, 666, 4);
    const basin = 1 - Math.abs(basinRaw - 0.5) * 2;

    const polarDip = Math.pow(latBand, 2.2) * 0.065;

    const overlapCut =
      smoothstep(0.11, 0.34, secondary.value) *
      smoothstep(0.28, 0.72, primary.value) *
      0.16;

    const openOceanCut = Math.pow(1 - primary.value, 1.65) * 0.14;
    const channelNoise = fbm(u * 3.8 + 11.2, v * 3.2 - 4.4, 1212, 4) * 0.055;
    const oceanChannelCut = clamp01(overlapCut + openOceanCut + channelNoise);

    const elevation = clamp01(
      primary.value * 0.74 +
      regional * 0.16 +
      ridge * 0.13 +
      fine * 0.05 -
      basin * 0.09 -
      oceanChannelCut -
      polarDip
    );

    const seaLine =
      0.525 +
      Math.sin(u * Math.PI * 6.0 + v * 2.0) * 0.012 -
      Math.pow(latBand, 1.7) * 0.010;

    return {
      elevation,
      seaLine,
      continentSignal: primary.value,
      secondaryContinentSignal: secondary.value,
      continentId: primary.seed ? primary.seed.id : "none",
      continentIndex: primary.seed ? primary.seed.index : 0,
      continentSeedCount: SEVEN_CONTINENT_SEEDS.length,
      continentBlendMode: "max-separated",
      oceanChannelCut,
      overlapCut,
      openOceanCut,
      ridge,
      basin,
      regional,
      fine,
      polarDip,
      warpU: wu,
      warpV: wv
    };
  }

  function proceduralElevationField(u, v, latBand) {
    return sevenContinentField(u, v, latBand).elevation;
  }

  function resolveSource(nameList) {
    for (const name of nameList) {
      if (root[name] && isObject(root[name])) return root[name];
      if (root.HEARTH && root.HEARTH[name] && isObject(root.HEARTH[name])) return root.HEARTH[name];
      if (root.DEXTER_LAB && root.DEXTER_LAB[name] && isObject(root.DEXTER_LAB[name])) return root.DEXTER_LAB[name];
    }

    return null;
  }

  function sampleExternalAuthority(authority, point) {
    if (!authority || !isObject(authority)) return null;

    const methods = ["sample", "read", "get", "getCell", "sampleAt", "readAt"];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method](point);
        if (result && isObject(result)) return result;
      } catch (_error) {}

      try {
        const result = authority[method](point.u, point.v, point.lon, point.lat);
        if (result && isObject(result)) return result;
      } catch (_error2) {}

      try {
        const result = authority[method](point.x, point.y, point.z);
        if (result && isObject(result)) return result;
      } catch (_error3) {}
    }

    return null;
  }

  function extractColor(packet) {
    if (!packet || !isObject(packet)) return null;

    const keys = [
      "rgb",
      "color",
      "baseColor",
      "finalColor",
      "finalColorHint",
      "landRgb",
      "waterRgb",
      "oceanRgb"
    ];

    for (const key of keys) {
      const value = packet[key];

      if (
        Array.isArray(value) &&
        value.length >= 3 &&
        value.every((item) => Number.isFinite(Number(item)))
      ) {
        return [
          clamp(Math.round(Number(value[0])), 0, 255),
          clamp(Math.round(Number(value[1])), 0, 255),
          clamp(Math.round(Number(value[2])), 0, 255)
        ];
      }
    }

    return null;
  }

  function normalizeElevation(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return NaN;
    if (n >= 0 && n <= 1) return n;
    if (n >= -1 && n <= 1) return (n + 1) / 2;
    return clamp01(n / 100);
  }

  function samplePlanetMaterial(u, v) {
    const lon = u * 360 - 180;
    const lat = 90 - v * 180;
    const vector = lonLatToVector(lon, lat);

    const point = { u, v, lon, lat, x: vector.x, y: vector.y, z: vector.z };

    const materialsAuthority = resolveSource(["HEARTH_MATERIALS", "materials", "hearthMaterials"]);
    const hydrologyAuthority = resolveSource(["HEARTH_HYDROLOGY", "hydrology", "hearthHydrology"]);
    const elevationAuthority = resolveSource(["HEARTH_ELEVATION", "elevation", "hearthElevation"]);
    const compositionAuthority = resolveSource(["HEARTH_COMPOSITION", "composition", "hearthComposition"]);
    const hexAuthority = resolveSource(["HEARTH_HEX_FOUR_PAIR_AUTHORITY", "hexAuthority", "hearthHexAuthority"]);
    const hexSurface = resolveSource(["HEARTH_HEX_SURFACE", "hexSurface", "hearthHexSurface"]);

    const materialSample = sampleExternalAuthority(materialsAuthority, point);
    const hydroSample = sampleExternalAuthority(hydrologyAuthority, point);
    const elevationSample = sampleExternalAuthority(elevationAuthority, point);
    const compositionSample = sampleExternalAuthority(compositionAuthority, point);
    const hexSample = sampleExternalAuthority(hexAuthority, point) || sampleExternalAuthority(hexSurface, point);

    const sourceColor =
      extractColor(materialSample) ||
      extractColor(hydroSample) ||
      extractColor(compositionSample) ||
      extractColor(hexSample) ||
      null;

    const latBand = Math.abs(lat) / 90;
    const polar = Math.pow(latBand, 2.1);
    const visualField = sevenContinentField(u, v, latBand);

    const rawElevation = normalizeElevation(
      elevationSample && (
        elevationSample.elevation ??
        elevationSample.height ??
        elevationSample.value ??
        elevationSample.altitude
      )
    );

    const proceduralElevation = proceduralElevationField(u, v, latBand);
    const elevation = Number.isFinite(rawElevation)
      ? clamp01(proceduralElevation * 0.78 + rawElevation * 0.22)
      : proceduralElevation;

    const hydro = safeNumber(
      hydroSample && (
        hydroSample.waterAlpha ??
        hydroSample.waterPresence ??
        hydroSample.hydrology ??
        hydroSample.water
      ),
      NaN
    );

    const compositionLand = safeNumber(
      compositionSample && (
        compositionSample.landAlpha ??
        compositionSample.landPresence ??
        compositionSample.land
      ),
      NaN
    );

    const seaLine = visualField.seaLine;
    const proceduralLand = smoothstep(seaLine - 0.035, seaLine + 0.030, elevation);

    const externalLand = Number.isFinite(compositionLand) ? clamp01(compositionLand) : NaN;
    const externalWater = Number.isFinite(hydro) ? clamp01(hydro) : NaN;

    let landSignal = proceduralLand;

    if (Number.isFinite(externalLand)) {
      landSignal = clamp01(proceduralLand * 0.82 + externalLand * 0.18);
    }

    if (Number.isFinite(externalWater)) {
      landSignal = clamp01(landSignal * 0.86 + (1 - externalWater) * 0.14);
    }

    const waterSignal = clamp01(1 - landSignal);
    const isWater = waterSignal >= landSignal;

    const coastDistance = Math.abs(waterSignal - landSignal);
    const shore = clamp01(1 - coastDistance * 5.1);
    const shelf = isWater ? clamp01(shore * 0.88 + (1 - waterSignal) * 0.22) : 0;
    const highland = clamp01((elevation - 0.58) * 2.7);
    const mountain = clamp01((elevation - 0.68) * 3.5);
    const lowland = clamp01(1 - Math.abs(elevation - 0.52) * 3.0);

    const fine = fbm(u * 22.0 + 4.7, v * 16.0 - 2.8, 777, 4);
    const ridge = 1 - Math.abs(fbm(u * 13.5 + 7.1, v * 9.0 - 6.2, 888, 4) - 0.5) * 2;
    const arid = clamp01(fbm(u * 7.4 + 9.2, v * 5.9 - 1.1, 999, 4) * 0.72 + latBand * 0.28);
    const vegetation = clamp01((1 - latBand * 0.70) * (1 - mountain * 0.42) * (0.70 + fine * 0.30));

    let rgb;
    let className;

    if (isWater) {
      className = shelf > 0.42 ? "shelf-water" : "deep-water";

      const deepOcean = [6, 35, 82];
      const ocean = [12, 66, 132];
      const shelfWater = [32, 117, 158];
      const glacialWater = [76, 135, 166];

      rgb = mixRgb(deepOcean, ocean, clamp01((1 - waterSignal) * 0.52 + fine * 0.20));
      rgb = mixRgb(rgb, shelfWater, shelf);
      rgb = mixRgb(rgb, glacialWater, polar * 0.22);
    } else {
      const wetLowland = [52, 114, 72];
      const dryLowland = [126, 106, 60];
      const upland = [102, 123, 84];
      const mountainRock = [150, 140, 112];
      const snow = [208, 215, 203];

      const baseLand = mixRgb(dryLowland, wetLowland, vegetation * (1 - arid * 0.52));
      rgb = mixRgb(baseLand, upland, lowland * 0.34 + highland * 0.20);
      rgb = mixRgb(rgb, mountainRock, mountain * 0.72);
      rgb = mixRgb(rgb, snow, clamp01((polar - 0.62) * 1.55 + mountain * 0.20));
      rgb = mixRgb(rgb, [190, 166, 98], shore * 0.66);

      className = mountain > 0.50
        ? "mountain"
        : highland > 0.42
          ? "highland"
          : shore > 0.42
            ? "coast-land"
            : arid > 0.74
              ? "dry-land"
              : "green-land";
    }

    const relief = (ridge - 0.50) * 20 + (fine - 0.50) * 9;
    const coast = shore * 20;
    const channelBlueLift = isWater ? visualField.oceanChannelCut * 22 : 0;

    rgb = [
      clamp(Math.round(rgb[0] + relief + coast * (isWater ? 0.20 : 1.00)), 0, 255),
      clamp(Math.round(rgb[1] + relief + coast * (isWater ? 0.28 : 0.88)), 0, 255),
      clamp(Math.round(rgb[2] + relief * 0.70 + shelf * 20 + coast * (isWater ? 0.78 : 0.28) + channelBlueLift), 0, 255)
    ];

    if (sourceColor) {
      rgb = mixRgb(rgb, sourceColor, isWater ? 0.08 : 0.10);
    }

    return {
      ...point,
      rgb,
      className,
      isWater,
      isLand: !isWater,
      waterSignal,
      landSignal,
      elevation,
      seaLine,
      shore,
      shelf,
      highland,
      mountain,
      lowland,
      polar,
      visualClass: className,

      continentId: visualField.continentId,
      continentIndex: visualField.continentIndex,
      continentSignal: visualField.continentSignal,
      secondaryContinentSignal: visualField.secondaryContinentSignal,
      continentSeedCount: visualField.continentSeedCount,
      continentBlendMode: visualField.continentBlendMode,
      oceanChannelCut: visualField.oceanChannelCut,

      sourceColorDemotedToPaletteInfluence: true,
      sevenContinentVisualFallbackActive: true,
      transitionalFallbackVisualField: true,
      canvasStillDoesNotOwnPlanetTruth: true
    };
  }

  async function buildAtlas(onProgress) {
    if (!doc) throw new Error("Document unavailable for atlas build.");

    if (!state.atlasCanvas || !state.atlasContext) {
      const working = createWorkingCanvas(ATLAS_WIDTH, ATLAS_HEIGHT);
      state.atlasCanvas = working.canvas;
      state.atlasContext = working.context;
    }

    if (!state.atlasCanvas || !state.atlasContext) throw new Error("Atlas canvas unavailable.");

    const image = state.atlasContext.createImageData(ATLAS_WIDTH, ATLAS_HEIGHT);

    state.atlasBuildStarted = true;
    state.atlasBuildProgress = 0;
    emitMilestone("ATLAS_BUILD_STARTED", 88, "Atlas build started.");

    for (let yStart = 0; yStart < ATLAS_HEIGHT; yStart += ATLAS_ROWS_PER_CHUNK) {
      const yEnd = Math.min(ATLAS_HEIGHT, yStart + ATLAS_ROWS_PER_CHUNK);

      for (let y = yStart; y < yEnd; y += 1) {
        const v = y / Math.max(1, ATLAS_HEIGHT - 1);

        for (let x = 0; x < ATLAS_WIDTH; x += 1) {
          const u = x / Math.max(1, ATLAS_WIDTH - 1);
          const sample = samplePlanetMaterial(u, v);
          const index = (y * ATLAS_WIDTH + x) * 4;

          image.data[index] = sample.rgb[0];
          image.data[index + 1] = sample.rgb[1];
          image.data[index + 2] = sample.rgb[2];
          image.data[index + 3] = 255;
        }
      }

      state.atlasBuildProgress = Math.round((yEnd / ATLAS_HEIGHT) * 100);

      archiveProgressOnlyEvent(
        "ATLAS_BUILD_PROGRESS",
        Math.min(90, Math.round(88 + state.atlasBuildProgress * 0.03)),
        `Atlas build active · ${state.atlasBuildProgress}% · elapsed ${elapsedText()}`
      );

      if (isFunction(onProgress)) {
        try {
          onProgress(state.atlasBuildProgress, getReceipt());
        } catch (error) {
          recordError("ATLAS_PROGRESS_CALLBACK_ERROR", error);
        }
      }

      await yieldFrame(0);
    }

    state.atlasContext.putImageData(image, 0, 0);
    state.atlasBuildComplete = true;
    state.atlasBuildProgress = 100;
    state.textureInvalidated = false;
    emitMilestone("ATLAS_BUILD_COMPLETE", 91, "Atlas build complete.");
  }

  async function composeTexture(onProgress) {
    if (!state.atlasCanvas || !state.atlasContext) throw new Error("Atlas unavailable for texture composition.");

    if (!state.textureCanvas || !state.textureContext) {
      const working = createWorkingCanvas(ATLAS_WIDTH, ATLAS_HEIGHT);
      state.textureCanvas = working.canvas;
      state.textureContext = working.context;
    }

    if (!state.textureCanvas || !state.textureContext) throw new Error("Texture canvas unavailable.");

    state.textureComposeStarted = true;
    state.textureComposeProgress = 0;
    emitMilestone("TEXTURE_COMPOSE_STARTED", 93, "Texture composition started.");

    const ctx = state.textureContext;
    ctx.clearRect(0, 0, ATLAS_WIDTH, ATLAS_HEIGHT);
    ctx.drawImage(state.atlasCanvas, 0, 0);

    for (let step = 1; step <= TEXTURE_STEPS; step += 1) {
      state.textureComposeProgress = Math.round((step / TEXTURE_STEPS) * 100);

      if (step === 1 || step === TEXTURE_STEPS || step % 6 === 0) {
        const alpha = 0.004 + step / TEXTURE_STEPS * 0.008;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = step % 2 ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.10)";
        ctx.fillRect(0, 0, ATLAS_WIDTH, ATLAS_HEIGHT);
        ctx.restore();
      }

      archiveProgressOnlyEvent(
        "TEXTURE_COMPOSE_PROGRESS",
        Math.min(95, Math.round(93 + state.textureComposeProgress * 0.03)),
        `Texture composition active · ${state.textureComposeProgress}% · elapsed ${elapsedText()}`
      );

      if (isFunction(onProgress)) {
        try {
          onProgress(state.textureComposeProgress, getReceipt());
        } catch (error) {
          recordError("TEXTURE_PROGRESS_CALLBACK_ERROR", error);
        }
      }

      await yieldFrame(0);
    }

    state.textureImageData = ctx.getImageData(0, 0, ATLAS_WIDTH, ATLAS_HEIGHT);
    state.textureComposeComplete = true;
    state.textureComposeProgress = 100;
    state.textureRebuildComplete = true;
    emitMilestone("TEXTURE_COMPOSE_COMPLETE", 96, "Texture composition complete.");
  }

  function sampleTexture(u, v) {
    const texture = state.textureImageData || (
      state.textureContext
        ? state.textureContext.getImageData(0, 0, ATLAS_WIDTH, ATLAS_HEIGHT)
        : null
    );

    if (!texture) return [0, 0, 0];

    state.textureImageData = texture;

    const uu = ((u % 1) + 1) % 1;
    const vv = clamp01(v);
    const tx = clamp(Math.floor(uu * (ATLAS_WIDTH - 1)), 0, ATLAS_WIDTH - 1);
    const ty = clamp(Math.floor(vv * (ATLAS_HEIGHT - 1)), 0, ATLAS_HEIGHT - 1);
    const index = (ty * ATLAS_WIDTH + tx) * 4;

    return [
      texture.data[index],
      texture.data[index + 1],
      texture.data[index + 2]
    ];
  }

  function drawSphereFrame(options = {}) {
    if (!state.canvas || !state.context || !state.textureCanvas || !state.textureContext) {
      throw new Error("Canvas or texture unavailable for sphere draw.");
    }

    const canvas = state.canvas;
    const ctx = state.context;
    const width = canvas.width;
    const height = canvas.height;
    const size = Math.min(width, height);
    const radius = size * 0.455;
    const cx = width / 2;
    const cy = height / 2;

    const output = ctx.createImageData(width, height);

    const yaw = state.rotationYaw;
    const pitch = state.rotationPitch;
    const cyaw = Math.cos(yaw);
    const syaw = Math.sin(yaw);
    const cpitch = Math.cos(pitch);
    const spitch = Math.sin(pitch);

    for (let y = 0; y < height; y += 1) {
      const dy = (y - cy) / radius;

      for (let x = 0; x < width; x += 1) {
        const dx = (x - cx) / radius;
        const r2 = dx * dx + dy * dy;
        const outIndex = (y * width + x) * 4;

        if (r2 > 1) {
          output.data[outIndex] = 0;
          output.data[outIndex + 1] = 0;
          output.data[outIndex + 2] = 0;
          output.data[outIndex + 3] = 0;
          continue;
        }

        const dz = Math.sqrt(1 - r2);
        const sx = dx;
        const sy = -dy;
        const sz = dz;

        const py = sy * cpitch - sz * spitch;
        const pz = sy * spitch + sz * cpitch;
        const px = sx;

        const rx = px * cyaw + pz * syaw;
        const rz = -px * syaw + pz * cyaw;
        const ry = py;

        const lon = Math.atan2(rx, rz);
        const lat = Math.asin(clamp(ry, -1, 1));
        const u = lon / (Math.PI * 2) + 0.5;
        const v = 0.5 - lat / Math.PI;

        const rgb = sampleTexture(u, v);

        const limb = clamp01(dz);
        const direct = clamp01(rx * -0.16 + ry * 0.10 + rz * 0.98);
        const shade = clamp(0.76 + direct * 0.32 + limb * 0.10, 0.52, 1.16);
        const atmosphere = clamp01((1 - limb) * 0.74);
        const hazeLift = atmosphere * 16;
        const horizonBlue = atmosphere * 48;

        output.data[outIndex] = clamp(Math.round(rgb[0] * shade + hazeLift), 0, 255);
        output.data[outIndex + 1] = clamp(Math.round(rgb[1] * shade + hazeLift + atmosphere * 8), 0, 255);
        output.data[outIndex + 2] = clamp(Math.round(rgb[2] * shade + horizonBlue), 0, 255);
        output.data[outIndex + 3] = 255;
      }
    }

    ctx.clearRect(0, 0, width, height);
    ctx.putImageData(output, 0, 0);

    ctx.save();
    const glow = ctx.createRadialGradient(cx - radius * 0.24, cy - radius * 0.34, radius * 0.10, cx, cy, radius);
    glow.addColorStop(0, "rgba(255,255,255,0.09)");
    glow.addColorStop(0.52, "rgba(255,255,255,0.018)");
    glow.addColorStop(1, "rgba(0,0,0,0.24)");
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(188,220,255,0.50)";
    ctx.lineWidth = Math.max(1, size * 0.006);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(125,190,255,0.20)";
    ctx.lineWidth = Math.max(1, size * 0.014);
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.006, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    state.renderFrameCount += 1;

    if (options.interactive) {
      state.interactiveFrameCount += 1;
      state.pointerInspectionPainted = true;
    }

    state.firstFrameDetected = true;
    state.imageRendered = true;
    state.planetFramePainted = true;
    state.renderedAfterTexture = state.textureComposeComplete === true;
    state.updatedAt = nowIso();

    updateDocumentDataset();
  }

  async function renderSphereCooperative(onProgress) {
    if (!state.canvas || !state.context || !state.textureCanvas || !state.textureContext) {
      throw new Error("Canvas or texture unavailable for sphere render.");
    }

    if (!state.firstFrameRequested) {
      state.firstFrameRequested = true;
      emitMilestone("FIRST_FRAME_REQUESTED", 97, "First frame requested.");
    }

    const height = state.canvas.height || DEFAULT_SIZE;

    for (let yStart = 0; yStart < height; yStart += SPHERE_ROWS_PER_CHUNK * 5) {
      archiveProgressOnlyEvent(
        "SPHERE_RENDER_PROGRESS",
        97,
        `Sphere render active · ${Math.round((Math.min(height, yStart + SPHERE_ROWS_PER_CHUNK * 5) / height) * 100)}% · elapsed ${elapsedText()}`
      );

      if (isFunction(onProgress)) {
        try {
          onProgress(Math.round((Math.min(height, yStart + SPHERE_ROWS_PER_CHUNK * 5) / height) * 100), getReceipt());
        } catch (error) {
          recordError("SPHERE_PROGRESS_CALLBACK_ERROR", error);
        }
      }

      await yieldFrame(0);
    }

    drawSphereFrame({ interactive: false });

    if (!state.firstFrameDetected || state.canvasPhaseEvents.every((item) => item.event !== "FIRST_FRAME_DETECTED")) {
      emitMilestone("FIRST_FRAME_DETECTED", 98, "First frame detected.");
    }
  }

  function bindDragInspection() {
    if (!state.canvas || state.dragInspectionBound) return;

    let dragging = false;
    let pointerId = null;
    let lastX = 0;
    let lastY = 0;

    const repaint = () => {
      if (!state.textureComposeComplete || !state.textureCanvas || !state.textureContext) return;

      try {
        drawSphereFrame({ interactive: true });
        state.lastInteractionAt = nowIso();
        updateDocumentDataset();
      } catch (error) {
        recordError("INTERACTIVE_REPAINT_FAILED", error);
      }
    };

    const onDown = (event) => {
      dragging = true;
      pointerId = event.pointerId;
      lastX = event.clientX || 0;
      lastY = event.clientY || 0;

      state.pointerInspectionActive = true;
      state.canvas.dataset.hearthInspectDragging = "true";
      state.canvas.style.cursor = "grabbing";

      if (isFunction(state.canvas.setPointerCapture) && pointerId !== null && pointerId !== undefined) {
        try {
          state.canvas.setPointerCapture(pointerId);
        } catch (_error) {}
      }

      if (isFunction(event.preventDefault)) event.preventDefault();
      updateDocumentDataset();
    };

    const onMove = (event) => {
      if (!dragging) return;

      const x = event.clientX || 0;
      const y = event.clientY || 0;
      const dx = x - lastX;
      const dy = y - lastY;

      lastX = x;
      lastY = y;

      state.pointerDragCount += 1;
      state.lastPointerDeltaX = Math.round(dx);
      state.lastPointerDeltaY = Math.round(dy);

      state.rotationYaw += dx * 0.0085;
      state.rotationPitch = clamp(state.rotationPitch + dy * 0.0065, -1.05, 1.05);
      state.rotationVelocityYaw = dx * 0.0045;
      state.rotationVelocityPitch = dy * 0.0030;

      state.canvas.dataset.hearthInspectDeltaX = String(state.lastPointerDeltaX);
      state.canvas.dataset.hearthInspectDeltaY = String(state.lastPointerDeltaY);
      state.canvas.dataset.hearthRotationYaw = String(Number(state.rotationYaw.toFixed(4)));
      state.canvas.dataset.hearthRotationPitch = String(Number(state.rotationPitch.toFixed(4)));

      repaint();

      if (isFunction(event.preventDefault)) event.preventDefault();
    };

    const onUp = (event) => {
      if (!dragging) return;

      dragging = false;
      pointerId = null;
      state.pointerInspectionActive = false;
      state.canvas.dataset.hearthInspectDragging = "false";
      state.canvas.style.cursor = "grab";

      if (isFunction(event.preventDefault)) event.preventDefault();
      startInertia();
      updateDocumentDataset();
    };

    state.canvas.addEventListener("pointerdown", onDown, { passive: false });
    state.canvas.addEventListener("pointermove", onMove, { passive: false });
    state.canvas.addEventListener("pointerup", onUp, { passive: false });
    state.canvas.addEventListener("pointercancel", onUp, { passive: false });
    state.canvas.addEventListener("lostpointercapture", onUp, { passive: false });

    state.dragInspectionBound = true;
    emitMilestone("DRAG_INSPECTION_BOUND", 86, "Drag inspection bound.");
  }

  function startInertia() {
    if (state.inertiaActive) return;

    const minVelocity = 0.0005;
    state.inertiaActive = true;

    const step = () => {
      if (!state.inertiaActive) return;

      state.rotationVelocityYaw *= 0.92;
      state.rotationVelocityPitch *= 0.86;

      if (
        Math.abs(state.rotationVelocityYaw) < minVelocity &&
        Math.abs(state.rotationVelocityPitch) < minVelocity
      ) {
        state.inertiaActive = false;
        return;
      }

      state.rotationYaw += state.rotationVelocityYaw;
      state.rotationPitch = clamp(state.rotationPitch + state.rotationVelocityPitch, -1.05, 1.05);
      state.inertiaFrame += 1;

      try {
        drawSphereFrame({ interactive: true });
      } catch (error) {
        state.inertiaActive = false;
        recordError("INERTIA_REPAINT_FAILED", error);
        return;
      }

      if (typeof root.requestAnimationFrame === "function") {
        root.requestAnimationFrame(step);
      } else {
        root.setTimeout(step, 16);
      }
    };

    if (typeof root.requestAnimationFrame === "function") {
      root.requestAnimationFrame(step);
    } else {
      root.setTimeout(step, 16);
    }
  }

  function luminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function classifyPixel(r, g, b, a) {
    if (a < 8) return "blank";

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;
    const lum = luminance(r, g, b);

    if (sat < 10 && lum > 34 && lum < 235) return "carrier";
    if (b > g + 16 && b > r + 20) return "water";
    if (g >= b - 12 && r >= b - 26) return "land";
    if (r > 105 && g > 78 && b < 120) return "land";
    if (b > 78 && g > 48) return "water";

    return "other";
  }

  function sampleVisibleContent() {
    state.visibleContentProofStarted = true;
    state.visibleContentProofMethod = "canvas-pixel-content-sample";
    emitMilestone("VISIBLE_CONTENT_PROOF_STARTED", 98, "Visible content proof started.");

    if (!state.canvas || !state.context) {
      return classifyVisibleContentEvidence({
        hardFailReason: "canvas-missing",
        samples: 0,
        nonblank: 0,
        variance: 0,
        land: 0,
        water: 0,
        other: 0,
        carrier: 0,
        classes: []
      });
    }

    const canvas = state.canvas;
    const ctx = state.context;
    const width = canvas.width;
    const height = canvas.height;

    if (!width || !height) {
      return classifyVisibleContentEvidence({
        hardFailReason: "canvas-zero-size",
        samples: 0,
        nonblank: 0,
        variance: 0,
        land: 0,
        water: 0,
        other: 0,
        carrier: 0,
        classes: []
      });
    }

    let imageData;

    try {
      imageData = ctx.getImageData(0, 0, width, height);
    } catch (error) {
      return classifyVisibleContentEvidence({
        hardFailReason: `canvas-read-failed:${error && error.message ? error.message : String(error)}`,
        samples: 0,
        nonblank: 0,
        variance: 0,
        land: 0,
        water: 0,
        other: 0,
        carrier: 0,
        classes: []
      });
    }

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.455;

    let samples = 0;
    let nonblank = 0;
    let land = 0;
    let water = 0;
    let other = 0;
    let carrier = 0;
    const lumValues = [];
    const classes = new Set();

    for (let i = 0; i < SAMPLE_COUNT; i += 1) {
      const t = i / SAMPLE_COUNT;
      const angle = i * 2.399963229728653;
      const rr = Math.sqrt(t) * radius * 0.92;
      const x = clamp(Math.round(cx + Math.cos(angle) * rr), 0, width - 1);
      const y = clamp(Math.round(cy + Math.sin(angle) * rr), 0, height - 1);
      const index = (y * width + x) * 4;

      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const a = imageData.data[index + 3];

      const cls = classifyPixel(r, g, b, a);
      samples += 1;

      if (cls !== "blank") {
        nonblank += 1;
        lumValues.push(luminance(r, g, b));
      }

      if (cls === "land") {
        land += 1;
        classes.add("land");
      } else if (cls === "water") {
        water += 1;
        classes.add("water");
      } else if (cls === "other") {
        other += 1;
        classes.add("other");
      } else if (cls === "carrier") {
        carrier += 1;
      }
    }

    const mean = lumValues.length
      ? lumValues.reduce((sum, value) => sum + value, 0) / lumValues.length
      : 0;

    const variance = lumValues.length
      ? Math.sqrt(lumValues.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / lumValues.length)
      : 0;

    return classifyVisibleContentEvidence({
      samples,
      nonblank,
      variance,
      land,
      water,
      other,
      carrier,
      classes: Array.from(classes)
    });
  }

  function classifyVisibleContentEvidence(metrics = {}) {
    const samples = safeNumber(metrics.samples, 0);
    const nonblank = safeNumber(metrics.nonblank, 0);
    const variance = safeNumber(metrics.variance, 0);
    const land = safeNumber(metrics.land, 0);
    const water = safeNumber(metrics.water, 0);
    const other = safeNumber(metrics.other, 0);
    const carrier = safeNumber(metrics.carrier, 0);
    const classes = Array.isArray(metrics.classes) ? metrics.classes.slice() : [];
    const meaningful = land + water + other;
    const carrierRatio = nonblank ? carrier / nonblank : 1;
    const contentRatio = nonblank ? meaningful / nonblank : 0;

    const structuralReady = Boolean(
      state.canvasReady ||
      (
        state.canvasCarrierMounted &&
        state.canvasContextReady &&
        state.firstFrameDetected &&
        state.imageRendered &&
        state.renderedAfterTexture
      )
    );

    const strictPass = Boolean(
      structuralReady &&
      samples >= SAMPLE_COUNT &&
      nonblank >= Math.floor(SAMPLE_COUNT * 0.60) &&
      variance >= 2.4 &&
      classes.length >= 2 &&
      meaningful >= Math.floor(SAMPLE_COUNT * 0.22) &&
      carrierRatio <= 0.55 &&
      land + water >= Math.floor(SAMPLE_COUNT * 0.18)
    );

    const softGap = Boolean(
      !strictPass &&
      structuralReady &&
      samples > 0 &&
      nonblank > 0 &&
      variance >= 0.75 &&
      meaningful > 0 &&
      state.firstFrameDetected &&
      state.imageRendered
    );

    const hardFail = Boolean(
      !strictPass &&
      !softGap &&
      (
        metrics.hardFailReason ||
        !state.canvas ||
        !state.context ||
        !state.planetCanvasNonZeroSize ||
        !state.firstFrameDetected ||
        !state.imageRendered ||
        nonblank <= 0
      )
    );

    state.visibleContentSampleCount = samples;
    state.visibleContentVarianceScore = Number(variance.toFixed(2));
    state.visibleContentClassCount = classes.length;
    state.visibleContentClasses = classes;
    state.visibleContentLandSampleCount = land;
    state.visibleContentWaterSampleCount = water;
    state.visibleContentOtherSampleCount = other;
    state.visibleContentCarrierSampleCount = carrier;

    state.nonblankPlanetVisible = nonblank > 0;
    state.carrierOnlyDetected = Boolean(!strictPass && carrierRatio > 0.55);
    state.visibleContentStrictProof = strictPass;
    state.visibleContentProof = strictPass;
    state.visibleContentSoftGap = softGap;
    state.visibleContentHardFail = hardFail;
    state.visibleForwardProgress = strictPass || softGap;
    state.visibleContentAdmissible = strictPass || softGap;
    state.visiblePlanetAvailable = strictPass || softGap;
    state.f13HardFail = hardFail;
    state.f13CanvasEvidenceComplete = strictPass || softGap;
    state.planetNotObstructed = true;

    if (strictPass) {
      state.visibleContentProofMethod = "canvas-pixel-content-sample";
      state.visibleContentProofError = "";

      emitMilestone("VISIBLE_CONTENT_PROOF_PASSED", 98, "Visible content proof passed.", {
        visibleContentProof: true,
        visibleContentStrictProof: true,
        visibleContentSoftGap: false,
        visibleContentHardFail: false,
        visibleForwardProgress: true,
        visiblePlanetAvailable: true
      });
    } else if (softGap) {
      state.visibleContentProofMethod = "seven-continent-transitional-soft-gap-content-sample";
      state.visibleContentProofError = [
        `Visible content soft gap: samples=${samples}`,
        `nonblank=${nonblank}`,
        `variance=${state.visibleContentVarianceScore}`,
        `classes=${classes.length}`,
        `land=${land}`,
        `water=${water}`,
        `other=${other}`,
        `carrier=${carrier}`,
        `carrierRatio=${carrierRatio.toFixed(2)}`,
        `contentRatio=${contentRatio.toFixed(2)}`
      ].join(", ");

      emitMilestone("DEGRADED_VISIBLE_CONTENT_ACCEPTED", 98, "Visible content soft gap; forward progress allowed.", {
        visibleContentProof: false,
        visibleContentStrictProof: false,
        visibleContentSoftGap: true,
        visibleContentHardFail: false,
        visibleForwardProgress: true,
        visibleContentAdmissible: true,
        visiblePlanetAvailable: true,
        carrierOnlyDetected: state.carrierOnlyDetected
      });
    } else {
      state.visibleContentProofMethod = "hard-fail-content-sample";
      state.visibleContentProofError = metrics.hardFailReason || [
        `Visible content hard fail: samples=${samples}`,
        `nonblank=${nonblank}`,
        `variance=${state.visibleContentVarianceScore}`,
        `classes=${classes.length}`,
        `land=${land}`,
        `water=${water}`,
        `other=${other}`,
        `carrier=${carrier}`
      ].join(", ");

      emitMilestone("VISIBLE_CONTENT_HARD_FAIL", 98, "Visible content hard fail.", {
        visibleContentProof: false,
        visibleContentStrictProof: false,
        visibleContentSoftGap: false,
        visibleContentHardFail: true,
        visibleForwardProgress: false,
        visibleContentAdmissible: false,
        visiblePlanetAvailable: false
      });
    }

    state.updatedAt = nowIso();
    updateDocumentDataset();

    return {
      status: strictPass ? "PASS" : softGap ? "SOFT_GAP" : "HARD_FAIL",
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      carrierOnlyDetected: state.carrierOnlyDetected,
      metrics: {
        samples,
        nonblank,
        variance: state.visibleContentVarianceScore,
        land,
        water,
        other,
        carrier,
        classes,
        carrierRatio,
        contentRatio
      }
    };
  }

  function getNorthSession() {
    const candidates = [
      root.HEARTH_CHECKPOINT_SESSION,
      root.HEARTH_RUNTIME_CHECKPOINT_SESSION,
      root.LAB_HEARTH_CHECKPOINT_SESSION,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthCheckpointSession,
      root.DEXTER_LAB && root.DEXTER_LAB.checkpointSession,
      root.LAB_CHECKPOINT_SESSION
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
      checkpointGovernor &&
      (checkpointGovernor.checkpointGovernorActive || checkpointGovernor.createHearthCheckpointSession)
    );
    state.checkpointSessionSubmissionAvailable = Boolean(session);

    return { authority, checkpointGovernor, session };
  }

  function getNorthSnapshot() {
    return {
      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,

      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,
      postCanvasReadyRebootSuppressed: state.postCanvasReadyRebootSuppressed,
      lateBootEventsArchived: state.lateCanvasBootEventsArchived,
      duplicateCanvasEventsSuppressed: state.duplicateCanvasEventsSuppressed,
      blockingFutureEventViolation: false,

      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,
      firstFrameRequested: state.firstFrameRequested,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      dragInspectionBound: state.dragInspectionBound,
      renderedAfterTexture: state.renderedAfterTexture,

      textureInvalidationCount: state.textureInvalidationCount,
      textureInvalidated: state.textureInvalidated,
      textureRebuildRequested: state.textureRebuildRequested,
      textureRebuildComplete: state.textureRebuildComplete,

      interactiveRotationActive: state.interactiveRotationActive,
      staleCanvasRepairActive: state.staleCanvasRepairActive,
      cachedTextureRepaintActive: state.cachedTextureRepaintActive,
      pointerInspectionPainted: state.pointerInspectionPainted,
      pointerDragCount: state.pointerDragCount,
      renderFrameCount: state.renderFrameCount,
      interactiveFrameCount: state.interactiveFrameCount,
      rotationYaw: Number(state.rotationYaw.toFixed(4)),
      rotationPitch: Number(state.rotationPitch.toFixed(4)),

      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      carrierOnlyDetected: state.carrierOnlyDetected,

      visibleContentSampleCount: state.visibleContentSampleCount,
      visibleContentVarianceScore: state.visibleContentVarianceScore,
      visibleContentClassCount: state.visibleContentClassCount,
      visibleContentClasses: state.visibleContentClasses.slice(),
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      visibleContentCarrierSampleCount: state.visibleContentCarrierSampleCount,

      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,

      sevenContinentVisualFallbackActive: true,
      continentVisualSeedCount: 7,
      continentBlendMode: "max-separated",
      proceduralSixLobeAdditiveFieldRetired: true,
      oceanChannelCutActive: true,
      seaLineTightened: true,
      coastlineSharpeningActive: true,
      cachedTextureInvalidationAvailable: true,
      canvasStillDoesNotOwnPlanetTruth: true,
      transitionalFallbackVisualField: true,
      upstreamSevenContinentAuthorityPreferred: true,
      landChannelStillReceiverOnly: true,

      visualFidelityRenewalActive: true,
      sourceColorDemotedToPaletteInfluence: true,
      elevationControlsLandShape: true,
      hydrologyControlsWaterShape: true,
      coastlineContrastActive: true,
      centerDarknessReduced: true,
      lightingPreservesSurfaceReadability: true,
      staleSourceMaskProtectionActive: true,

      inspectEvidenceAvailable: state.dragInspectionBound,
      inspectModeAvailable: state.dragInspectionBound,
      inspectPlanetControlAvailable: state.dragInspectionBound,
      diagnosticCanLeavePlanetFrame: state.dragInspectionBound,
      canvasCanSupportDiagnosticExit: state.canvasReady && state.firstFrameDetected,
      canvasDoesNotObstructDock: true,
      copyDiagnosticSafe: true,

      f13CanvasEvidencePreserved: true,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function checkpointPayloadForPhase(phase, progress, message, detail = {}) {
    const mapping = CHECKPOINT_BY_PHASE[phase] || {
      checkpointId: String(phase || ""),
      event: String(phase || ""),
      progress: Math.min(98, safeNumber(progress, 0))
    };

    return {
      event: mapping.event,
      id: mapping.event,
      phase: mapping.event,
      checkpointId: mapping.checkpointId,
      source: "hearth.canvas",
      contract: CONTRACT,
      receipt: RECEIPT,
      progress: Math.min(98, safeNumber(mapping.progress ?? progress, 0)),
      message: message || "",
      snapshot: getNorthSnapshot(),
      detail: {
        ...clonePlain(detail || {}),
        contract: CONTRACT,
        receipt: RECEIPT,
        source: "hearth.canvas",
        originalPhase: phase,
        mappedCheckpointId: mapping.checkpointId,
        mappedEvent: mapping.event,

        newsProtocolSynchronized: true,
        fibonacciAlignmentSynchronized: true,
        activeFibonacciGate: "F13",
        futureFibonacciGate: "F21",

        sevenContinentVisualFallbackActive: true,
        continentVisualSeedCount: 7,
        continentBlendMode: "max-separated",
        proceduralSixLobeAdditiveFieldRetired: true,
        oceanChannelCutActive: true,
        seaLineTightened: true,
        coastlineSharpeningActive: true,
        cachedTextureInvalidationAvailable: true,
        canvasStillDoesNotOwnPlanetTruth: true,
        transitionalFallbackVisualField: true,
        upstreamSevenContinentAuthorityPreferred: true,
        landChannelStillReceiverOnly: true,

        interactiveRotationActive: true,
        staleCanvasRepairActive: true,
        cachedTextureRepaintActive: true,
        visualFidelityRenewalActive: true,
        visualPassClaimed: false,
        f21ClaimedByCanvas: false,
        readyTextClaimedByCanvas: false
      }
    };
  }

  function submitCanvasEvidence(phase, detail = {}) {
    const north = readNorthAuthority();
    const payload = checkpointPayloadForPhase(
      phase,
      CHECKPOINT_BY_PHASE[phase] ? CHECKPOINT_BY_PHASE[phase].progress : 98,
      "",
      detail
    );

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

  function shouldSuppressLateCanvasEvent(phase) {
    return Boolean(state.canvasLaneClosed && EARLY_CANVAS_EVENTS.has(phase));
  }

  function archiveLateEvent(phase, progress, message, reason) {
    state.postCanvasReadyRebootSuppressed = true;
    state.lateCanvasBootEventsArchived = true;
    state.duplicateCanvasEventsSuppressed = true;
    state.updatedAt = nowIso();

    state.archivedLateEvents.push({
      at: state.updatedAt,
      event: phase,
      phase,
      progress: Math.min(98, safeNumber(progress, 0)),
      message,
      reason,
      contract: CONTRACT,
      receipt: RECEIPT
    });

    if (state.archivedLateEvents.length > 140) {
      state.archivedLateEvents.splice(0, state.archivedLateEvents.length - 140);
    }

    updateDocumentDataset();
  }

  function archiveProgressOnlyEvent(phase, progress, message) {
    state.progressOnlyEventsArchived = true;
    state.updatedAt = nowIso();

    const event = {
      at: state.updatedAt,
      event: phase,
      phase,
      progress: Math.min(98, safeNumber(progress, 0)),
      message,
      progressOnly: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      visualPassClaimed: false,
      f21ClaimedByCanvas: false
    };

    state.progressOnlyEvents.push(event);

    if (state.progressOnlyEvents.length > 260) {
      state.progressOnlyEvents.splice(0, state.progressOnlyEvents.length - 260);
    }

    notifyCallbacks(event);
    updateDocumentDataset();
  }

  function emitMilestone(phase, progress, message, detail = {}) {
    if (shouldSuppressLateCanvasEvent(phase)) {
      archiveLateEvent(phase, progress, message, "canvas-lane-closed-after-canvas-ready");
      return null;
    }

    const mapped = CHECKPOINT_BY_PHASE[phase] || {};
    const safeProgress = Math.min(98, safeNumber(mapped.progress ?? progress, 0));

    state.canvasPhaseCount += 1;
    state.updatedAt = nowIso();

    const event = {
      at: state.updatedAt,
      event: mapped.event || phase,
      phase: mapped.event || phase,
      checkpointId: mapped.checkpointId || phase,
      progress: safeProgress,
      message,
      detail: clonePlain(detail),
      snapshot: getNorthSnapshot(),
      contract: CONTRACT,
      receipt: RECEIPT,
      visualPassClaimed: false,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false
    };

    state.canvasPhaseEvents.push(event);

    if (state.canvasPhaseEvents.length > 180) {
      state.canvasPhaseEvents.splice(0, state.canvasPhaseEvents.length - 180);
    }

    state.localEvents.push({
      at: event.at,
      event: event.event,
      checkpointId: event.checkpointId,
      action: "ADMIT",
      reason: "canvas-evidence-milestone"
    });

    submitCanvasEvidence(phase, detail);
    notifyCallbacks(event);
    updateDocumentDataset();

    return event;
  }

  function notifyCallbacks(event) {
    const receipt = getReceipt();

    state.callbacks.forEach((callback) => {
      try {
        callback(event, receipt);
      } catch (error) {
        recordError("CALLBACK_ERROR", error, { phase: event.phase || event.event || "" });
      }
    });

    if (doc && typeof root.CustomEvent === "function" && isFunction(root.dispatchEvent)) {
      try {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-phase", {
          detail: { event, receipt }
        }));
      } catch (_error) {}
    }
  }

  function addCallbacksFromOptions(options = {}) {
    const callbacks = [
      options.onPhase,
      options.onEvent,
      options.onStatus,
      options.statusCallback,
      options.onReceipt
    ].filter(isFunction);

    callbacks.forEach((callback) => {
      if (!state.callbacks.includes(callback)) state.callbacks.push(callback);
    });
  }

  function recordError(code, error, detail = {}) {
    const item = {
      event: code,
      code,
      message: error && error.message ? error.message : String(error || ""),
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.errors.push(item);

    if (state.errors.length > 100) {
      state.errors.splice(0, state.errors.length - 100);
    }

    state.updatedAt = item.at;
    updateDocumentDataset();

    return item;
  }

  function invalidateTexture(reason = "manual-texture-invalidation") {
    state.atlasCanvas = null;
    state.atlasContext = null;
    state.textureCanvas = null;
    state.textureContext = null;
    state.textureImageData = null;

    state.atlasBuildStarted = false;
    state.atlasBuildProgress = 0;
    state.atlasBuildComplete = false;
    state.textureComposeStarted = false;
    state.textureComposeProgress = 0;
    state.textureComposeComplete = false;
    state.firstFrameRequested = false;
    state.firstFrameDetected = false;
    state.imageRendered = false;
    state.renderedAfterTexture = false;
    state.planetFramePainted = false;
    state.nonblankPlanetVisible = false;

    state.textureInvalidationCount += 1;
    state.textureInvalidated = true;
    state.textureInvalidationReason = String(reason || "manual-texture-invalidation");
    state.textureRebuildRequested = false;
    state.textureRebuildComplete = false;
    state.textureRebuildError = "";
    state.updatedAt = nowIso();

    archiveProgressOnlyEvent(
      "TEXTURE_INVALIDATED",
      96,
      `Texture invalidated · reason=${state.textureInvalidationReason}`
    );

    updateDocumentDataset();

    return getReceipt();
  }

  async function rebuildTexture(options = {}) {
    addCallbacksFromOptions(options);

    state.textureRebuildRequested = true;
    state.textureRebuildComplete = false;
    state.textureRebuildError = "";

    try {
      invalidateTexture(options.reason || "manual-rebuild-texture-request");

      if (!state.canvas || !state.context) {
        ensureCanvas(options);
      }

      bindDragInspection();

      await buildAtlas(options.onAtlasProgress || options.onProgress);
      await composeTexture(options.onTextureProgress || options.onProgress);
      await renderSphereCooperative(options.onSphereProgress || options.onProgress);

      state.canvasReady = true;
      state.canvasCarrierHandoffOk = true;
      state.canvasCarrierHandoffError = "";
      state.textureRebuildComplete = true;
      state.updatedAt = nowIso();

      sampleVisibleContent();
      updateDocumentDataset();

      if (isFunction(options.onReady)) {
        try {
          options.onReady(getReceipt());
        } catch (error) {
          recordError("ON_REBUILD_READY_CALLBACK_ERROR", error);
        }
      }

      return getReceipt();
    } catch (error) {
      state.textureRebuildError = error && error.message ? error.message : String(error);
      state.textureRebuildComplete = false;
      recordError("TEXTURE_REBUILD_ERROR", error);
      updateDocumentDataset();

      if (isFunction(options.onError)) {
        try {
          options.onError(error, getReceipt());
        } catch (callbackError) {
          recordError("ON_REBUILD_ERROR_CALLBACK_ERROR", callbackError);
        }
      }

      return getReceipt();
    }
  }

  async function bootCooperative(options = {}) {
    addCallbacksFromOptions(options);

    if (state.booting) return getReceipt();

    if (state.canvasReady && state.canvasLaneClosed) {
      archiveLateEvent(
        "CANVAS_COOPERATIVE_BOOT_STARTED",
        78,
        "Canvas cooperative boot requested after lane close.",
        "duplicate-boot-request-after-canvas-ready"
      );
      return getReceipt();
    }

    state.booting = true;
    state.booted = false;
    state.canvasCarrierRequested = true;
    state.canvasCarrierMethod = "bootCooperative";
    state.cooperativeBootUsed = true;
    state.syncBootFallbackUsed = false;
    state.canvasBootStartedAt = nowIso();
    state.updatedAt = state.canvasBootStartedAt;

    try {
      readNorthAuthority();

      emitMilestone("CANVAS_COOPERATIVE_BOOT_STARTED", 78, "Canvas cooperative boot started.");
      await yieldFrame(0);

      ensureCanvas(options);
      emitMilestone("CANVAS_MOUNT_CREATED", 81, "Canvas mount created.");
      await yieldFrame(0);

      emitMilestone("CANVAS_CONTEXT_READY", 84, "Canvas context ready.");
      await yieldFrame(0);

      bindDragInspection();
      await yieldFrame(0);

      await buildAtlas(options.onAtlasProgress || options.onProgress);
      await composeTexture(options.onTextureProgress || options.onProgress);
      await renderSphereCooperative(options.onSphereProgress || options.onProgress);

      state.canvasReady = true;
      state.canvasLaneClosed = true;
      state.canvasCarrierHandoffOk = true;
      state.canvasCarrierHandoffError = "";
      state.canvasBootCompletedAt = nowIso();
      state.canvasBootElapsedMs = Math.max(0, Date.parse(state.canvasBootCompletedAt) - Date.parse(state.canvasBootStartedAt));
      state.updatedAt = state.canvasBootCompletedAt;

      emitMilestone("CANVAS_READY", 98, "Canvas ready.");
      sampleVisibleContent();

      state.booted = true;
      state.booting = false;
      state.updatedAt = nowIso();

      updateDocumentDataset();

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
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
      recordError("CANVAS_BOOT_ERROR", error);

      classifyVisibleContentEvidence({
        hardFailReason: state.canvasCarrierHandoffError,
        samples: 0,
        nonblank: 0,
        variance: 0,
        land: 0,
        water: 0,
        other: 0,
        carrier: 0,
        classes: []
      });

      updateDocumentDataset();

      if (isFunction(options.onError)) {
        try {
          options.onError(error, getReceipt());
        } catch (callbackError) {
          recordError("ON_ERROR_CALLBACK_ERROR", callbackError);
        }
      }

      return getReceipt();
    }
  }

  function boot(options = {}) {
    return bootCooperative(options);
  }

  function mount(options = {}) {
    ensureCanvas(options);
    bindDragInspection();
    updateDocumentDataset();
    return getReceipt();
  }

  async function render(options = {}) {
    if (!state.canvas || !state.context) ensureCanvas(options);

    if (!state.atlasCanvas || !state.textureCanvas || !state.textureImageData) {
      return bootCooperative(options);
    }

    drawSphereFrame({ interactive: Boolean(options.interactive) });
    state.canvasReady = true;
    state.canvasLaneClosed = true;
    sampleVisibleContent();
    updateDocumentDataset();

    return getReceipt();
  }

  function forceRedraw(options = {}) {
    if (!state.canvas || !state.context) ensureCanvas(options);
    if (!state.textureCanvas || !state.textureContext) return getReceipt();

    try {
      drawSphereFrame({ interactive: true });
      sampleVisibleContent();
    } catch (error) {
      recordError("FORCE_REDRAW_FAILED", error);
    }

    updateDocumentDataset();
    return getReceipt();
  }

  function setRotation(yaw = 0, pitch = 0) {
    state.rotationYaw = safeNumber(yaw, state.rotationYaw);
    state.rotationPitch = clamp(safeNumber(pitch, state.rotationPitch), -1.05, 1.05);
    return forceRedraw();
  }

  function resetRotation() {
    state.rotationYaw = -0.18;
    state.rotationPitch = 0.05;
    state.rotationVelocityYaw = 0;
    state.rotationVelocityPitch = 0;
    return forceRedraw();
  }

  function sample(point = {}) {
    const u = clamp01(safeNumber(point.u, 0.5));
    const v = clamp01(safeNumber(point.v, 0.5));
    const material = samplePlanetMaterial(u, v);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      u,
      v,
      lon: material.lon,
      lat: material.lat,
      x: material.x,
      y: material.y,
      z: material.z,
      rgb: material.rgb,
      landAlpha: material.isLand ? material.landSignal : 0,
      waterAlpha: material.isWater ? material.waterSignal : 0,
      airAlpha: 0.18,
      elevation: material.elevation,
      seaLine: material.seaLine,
      shore: material.shore,
      shelf: material.shelf,
      highland: material.highland,
      mountain: material.mountain,
      visualClass: material.visualClass,
      continentId: material.continentId,
      continentIndex: material.continentIndex,
      continentSignal: material.continentSignal,
      secondaryContinentSignal: material.secondaryContinentSignal,
      continentSeedCount: material.continentSeedCount,
      continentBlendMode: material.continentBlendMode,
      oceanChannelCut: material.oceanChannelCut,
      bodyBinding: 1,
      surfaceAttachment: 1,
      hydrosphereBinding: 1,
      surfaceSeat: 1,
      allowedToFloat: false,
      isCanvasSample: true,
      sevenContinentVisualFallbackActive: true,
      transitionalFallbackVisualField: true,
      canvasStillDoesNotOwnPlanetTruth: true,
      f21ClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function read(point = {}) {
    return sample(point);
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

  function elapsedText() {
    if (!state.canvasBootStartedAt) return "00:00";

    const start = Date.parse(state.canvasBootStartedAt);
    if (!Number.isFinite(start)) return "00:00";

    const delta = Math.max(0, Date.now() - start);
    const seconds = Math.floor(delta / 1000);
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");

    return `${mm}:${ss}`;
  }

  function updateDocumentDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasLoaded = "true";
    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasBaselineContract = BASELINE_CONTRACT;
    dataset.hearthCanvasRole = "f13-evidence-producer-seven-continent-transitional-visual-field";

    dataset.hearthCanvasReady = String(state.canvasReady);
    dataset.hearthCanvasLaneClosed = String(state.canvasLaneClosed);
    dataset.hearthCanvasSoftGapAdapter = "true";
    dataset.hearthCanvasVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthCanvasVisibleContentSoftGap = String(state.visibleContentSoftGap);
    dataset.hearthCanvasVisibleContentHardFail = String(state.visibleContentHardFail);
    dataset.hearthCanvasVisibleForwardProgress = String(state.visibleForwardProgress);
    dataset.hearthCanvasVisiblePlanetAvailable = String(state.visiblePlanetAvailable);

    dataset.hearthCanvasInteractiveRotationActive = String(state.interactiveRotationActive);
    dataset.hearthCanvasStaleCanvasRepairActive = String(state.staleCanvasRepairActive);
    dataset.hearthCanvasCachedTextureRepaintActive = String(state.cachedTextureRepaintActive);
    dataset.hearthCanvasPointerInspectionPainted = String(state.pointerInspectionPainted);
    dataset.hearthCanvasPointerDragCount = String(state.pointerDragCount);
    dataset.hearthCanvasRenderFrameCount = String(state.renderFrameCount);
    dataset.hearthCanvasInteractiveFrameCount = String(state.interactiveFrameCount);

    dataset.hearthCanvasNewsProtocolSynchronized = "true";
    dataset.hearthCanvasFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasActiveFibonacciGate = "F13";
    dataset.hearthCanvasFutureFibonacciGate = "F21";
    dataset.hearthCanvasOneActiveGearAtATime = "true";
    dataset.hearthCanvasCycleOrder = "EAST_WEST_NORTH_SOUTH_CHECKPOINT_EAST";

    dataset.hearthCanvasSevenContinentVisualFallbackActive = "true";
    dataset.hearthCanvasContinentVisualSeedCount = "7";
    dataset.hearthCanvasContinentBlendMode = "max-separated";
    dataset.hearthCanvasProceduralSixLobeAdditiveFieldRetired = "true";
    dataset.hearthCanvasOceanChannelCutActive = "true";
    dataset.hearthCanvasSeaLineTightened = "true";
    dataset.hearthCanvasCoastlineSharpeningActive = "true";
    dataset.hearthCanvasCachedTextureInvalidationAvailable = "true";
    dataset.hearthCanvasTextureInvalidationCount = String(state.textureInvalidationCount);
    dataset.hearthCanvasTextureInvalidated = String(state.textureInvalidated);
    dataset.hearthCanvasTextureRebuildRequested = String(state.textureRebuildRequested);
    dataset.hearthCanvasTextureRebuildComplete = String(state.textureRebuildComplete);

    dataset.hearthCanvasStillDoesNotOwnPlanetTruth = "true";
    dataset.hearthCanvasTransitionalFallbackVisualField = "true";
    dataset.hearthCanvasUpstreamSevenContinentAuthorityPreferred = "true";
    dataset.hearthCanvasLandChannelStillReceiverOnly = "true";

    dataset.hearthCanvasVisualFidelityRenewalActive = "true";
    dataset.hearthCanvasSourceColorDemotedToPaletteInfluence = "true";
    dataset.hearthCanvasElevationControlsLandShape = "true";
    dataset.hearthCanvasHydrologyControlsWaterShape = "true";
    dataset.hearthCanvasCoastlineContrastActive = "true";
    dataset.hearthCanvasCenterDarknessReduced = "true";
    dataset.hearthCanvasLightingPreservesSurfaceReadability = "true";
    dataset.hearthCanvasStaleSourceMaskProtectionActive = "true";

    dataset.hearthCanvasPostReadyRebootSuppressed = String(state.postCanvasReadyRebootSuppressed);
    dataset.hearthCanvasLateBootEventsArchived = String(state.lateCanvasBootEventsArchived);
    dataset.hearthCanvasDuplicateEventsSuppressed = String(state.duplicateCanvasEventsSuppressed);
    dataset.hearthCanvasProgressOnlyEventsArchived = String(state.progressOnlyEventsArchived);

    dataset.hearthCanvasF13EvidencePreserved = "true";
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
      state.canvas.dataset.hearthCanvasReady = String(state.canvasReady);
      state.canvas.dataset.hearthCanvasSoftGap = String(state.visibleContentSoftGap);
      state.canvas.dataset.hearthCanvasVisibleForwardProgress = String(state.visibleForwardProgress);
      state.canvas.dataset.hearthCanvasInteractiveRotationActive = "true";
      state.canvas.dataset.hearthCanvasStaleCanvasRepairActive = "true";
      state.canvas.dataset.hearthCanvasVisualFidelityRenewalActive = "true";
      state.canvas.dataset.hearthCanvasSevenContinentVisualFallbackActive = "true";
      state.canvas.dataset.hearthCanvasContinentVisualSeedCount = "7";
      state.canvas.dataset.hearthCanvasContinentBlendMode = "max-separated";
      state.canvas.dataset.hearthRotationYaw = String(Number(state.rotationYaw.toFixed(4)));
      state.canvas.dataset.hearthRotationPitch = String(Number(state.rotationPitch.toFixed(4)));
      state.canvas.dataset.visualPassClaimed = "false";
    }
  }

  function getReceipt() {
    readNorthAuthority();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: state.file,
      role: state.role,

      northAuthority: state.northAuthority,
      northAuthorityPresent: state.northAuthorityPresent,
      checkpointGovernorDetected: state.checkpointGovernorDetected,
      checkpointSessionSubmissionAvailable: state.checkpointSessionSubmissionAvailable,
      canvasEvidenceSubmittedToNorth: state.canvasEvidenceSubmittedToNorth,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,
      cycleOrder: "EAST_WEST_NORTH_SOUTH_CHECKPOINT_EAST",

      eastIgnitionComplete: true,
      westAdmissibilityComplete: true,
      northCheckpointGovernancePreserved: true,
      southVisibleProofRequired: true,

      sevenContinentVisualFallbackActive: true,
      continentVisualSeedCount: 7,
      continentSeedIds: SEVEN_CONTINENT_SEEDS.map((seed) => seed.id),
      continentBlendMode: "max-separated",
      proceduralSixLobeAdditiveFieldRetired: true,
      oceanChannelCutActive: true,
      seaLineTightened: true,
      coastlineSharpeningActive: true,
      cachedTextureInvalidationAvailable: true,
      canvasStillDoesNotOwnPlanetTruth: true,
      transitionalFallbackVisualField: true,
      upstreamSevenContinentAuthorityPreferred: true,
      landChannelStillReceiverOnly: true,

      cooperativeBootAvailable: state.cooperativeBootAvailable,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,
      canvasCarrierMethod: state.canvasCarrierMethod,
      canvasBootStartedAt: state.canvasBootStartedAt,
      canvasBootCompletedAt: state.canvasBootCompletedAt,
      canvasBootElapsedMs: state.canvasBootElapsedMs,
      canvasYieldCount: state.canvasYieldCount,
      canvasPhaseCount: state.canvasPhaseCount,

      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,

      canvasLaneClosed: state.canvasLaneClosed,
      postCanvasReadyRebootSuppressed: state.postCanvasReadyRebootSuppressed,
      lateCanvasBootEventsArchived: state.lateCanvasBootEventsArchived,
      duplicateCanvasEventsSuppressed: state.duplicateCanvasEventsSuppressed,
      progressOnlyEventsArchived: state.progressOnlyEventsArchived,
      regressiveCanvasEventsBlocked: state.regressiveCanvasEventsBlocked,

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

      textureInvalidationCount: state.textureInvalidationCount,
      textureInvalidated: state.textureInvalidated,
      textureInvalidationReason: state.textureInvalidationReason,
      textureRebuildRequested: state.textureRebuildRequested,
      textureRebuildComplete: state.textureRebuildComplete,
      textureRebuildError: state.textureRebuildError,

      interactiveRotationActive: state.interactiveRotationActive,
      staleCanvasRepairActive: state.staleCanvasRepairActive,
      cachedTextureRepaintActive: state.cachedTextureRepaintActive,
      pointerInspectionActive: state.pointerInspectionActive,
      pointerInspectionPainted: state.pointerInspectionPainted,
      pointerDragCount: state.pointerDragCount,
      renderFrameCount: state.renderFrameCount,
      interactiveFrameCount: state.interactiveFrameCount,
      lastInteractionAt: state.lastInteractionAt,
      rotationYaw: Number(state.rotationYaw.toFixed(4)),
      rotationPitch: Number(state.rotationPitch.toFixed(4)),
      inertiaFrame: state.inertiaFrame,

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

      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,

      visualFidelityRenewalActive: true,
      sourceColorDemotedToPaletteInfluence: true,
      elevationControlsLandShape: true,
      hydrologyControlsWaterShape: true,
      coastlineContrastActive: true,
      centerDarknessReduced: true,
      lightingPreservesSurfaceReadability: true,
      staleSourceMaskProtectionActive: true,

      inspectEvidenceAvailable: state.dragInspectionBound,
      inspectModeAvailable: state.dragInspectionBound,
      inspectPlanetControlAvailable: state.dragInspectionBound,
      diagnosticCanLeavePlanetFrame: state.dragInspectionBound,

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
      ownsVisualTranslation: true,
      ownsInteractiveCanvasRepaint: true,
      doesNotOwnPlanetTruth: true,
      doesNotOwnRuntimeTableGovernance: true,
      doesNotOwnNewsFinalAuthority: true,
      doesNotOwnF21: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      updatedAt: state.updatedAt
    };
  }

  function getReceiptText() {
    const receipt = getReceipt();

    const progressOnlyCounts = receipt.progressOnlyEvents.reduce((map, event) => {
      const key = event.event || "UNKNOWN";
      map[key] = (map[key] || 0) + 1;
      return map;
    }, {});

    const progressLines = Object.keys(progressOnlyCounts)
      .map((key) => `- ${key}: ${progressOnlyCounts[key]}`)
      .join("\n") || "- none";

    const archivedLate = receipt.archivedLateEvents.slice(-16).map((event) => (
      `- ${event.at} :: ${event.event} :: progress=${event.progress} :: reason=${event.reason}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((event) => (
      `- ${event.at} :: ${event.event || event.code} :: ${event.message}`
    )).join("\n") || "- none";

    return [
      "HEARTH_SEVEN_CONTINENT_TRANSITIONAL_CANVAS_VISUAL_FIELD_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `file=${receipt.file}`,
      `role=${receipt.role}`,
      "",
      `newsProtocolSynchronized=${receipt.newsProtocolSynchronized}`,
      `fibonacciAlignmentSynchronized=${receipt.fibonacciAlignmentSynchronized}`,
      `activeFibonacciGate=${receipt.activeFibonacciGate}`,
      `futureFibonacciGate=${receipt.futureFibonacciGate}`,
      `oneActiveGearAtATime=${receipt.oneActiveGearAtATime}`,
      `cycleOrder=${receipt.cycleOrder}`,
      "",
      `sevenContinentVisualFallbackActive=${receipt.sevenContinentVisualFallbackActive}`,
      `continentVisualSeedCount=${receipt.continentVisualSeedCount}`,
      `continentBlendMode=${receipt.continentBlendMode}`,
      `proceduralSixLobeAdditiveFieldRetired=${receipt.proceduralSixLobeAdditiveFieldRetired}`,
      `oceanChannelCutActive=${receipt.oceanChannelCutActive}`,
      `seaLineTightened=${receipt.seaLineTightened}`,
      `coastlineSharpeningActive=${receipt.coastlineSharpeningActive}`,
      `cachedTextureInvalidationAvailable=${receipt.cachedTextureInvalidationAvailable}`,
      `canvasStillDoesNotOwnPlanetTruth=${receipt.canvasStillDoesNotOwnPlanetTruth}`,
      `transitionalFallbackVisualField=${receipt.transitionalFallbackVisualField}`,
      `upstreamSevenContinentAuthorityPreferred=${receipt.upstreamSevenContinentAuthorityPreferred}`,
      `landChannelStillReceiverOnly=${receipt.landChannelStillReceiverOnly}`,
      "",
      `northAuthorityPresent=${receipt.northAuthorityPresent}`,
      `checkpointGovernorDetected=${receipt.checkpointGovernorDetected}`,
      `checkpointSessionSubmissionAvailable=${receipt.checkpointSessionSubmissionAvailable}`,
      `canvasEvidenceSubmittedToNorth=${receipt.canvasEvidenceSubmittedToNorth}`,
      "",
      `canvasReady=${receipt.canvasReady}`,
      `canvasCarrierMounted=${receipt.canvasCarrierMounted}`,
      `canvasContextReady=${receipt.canvasContextReady}`,
      `canvasCarrierRequested=${receipt.canvasCarrierRequested}`,
      `canvasCarrierHandoffOk=${receipt.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${receipt.canvasCarrierHandoffError}`,
      "",
      `atlasBuildStarted=${receipt.atlasBuildStarted}`,
      `atlasBuildProgress=${receipt.atlasBuildProgress}`,
      `atlasBuildComplete=${receipt.atlasBuildComplete}`,
      `textureComposeStarted=${receipt.textureComposeStarted}`,
      `textureComposeProgress=${receipt.textureComposeProgress}`,
      `textureComposeComplete=${receipt.textureComposeComplete}`,
      `firstFrameRequested=${receipt.firstFrameRequested}`,
      `firstFrameDetected=${receipt.firstFrameDetected}`,
      `imageRendered=${receipt.imageRendered}`,
      `renderedAfterTexture=${receipt.renderedAfterTexture}`,
      `dragInspectionBound=${receipt.dragInspectionBound}`,
      "",
      `textureInvalidationCount=${receipt.textureInvalidationCount}`,
      `textureInvalidated=${receipt.textureInvalidated}`,
      `textureInvalidationReason=${receipt.textureInvalidationReason}`,
      `textureRebuildRequested=${receipt.textureRebuildRequested}`,
      `textureRebuildComplete=${receipt.textureRebuildComplete}`,
      `textureRebuildError=${receipt.textureRebuildError}`,
      "",
      `interactiveRotationActive=${receipt.interactiveRotationActive}`,
      `staleCanvasRepairActive=${receipt.staleCanvasRepairActive}`,
      `cachedTextureRepaintActive=${receipt.cachedTextureRepaintActive}`,
      `pointerInspectionPainted=${receipt.pointerInspectionPainted}`,
      `pointerDragCount=${receipt.pointerDragCount}`,
      `renderFrameCount=${receipt.renderFrameCount}`,
      `interactiveFrameCount=${receipt.interactiveFrameCount}`,
      `rotationYaw=${receipt.rotationYaw}`,
      `rotationPitch=${receipt.rotationPitch}`,
      "",
      `visibleContentProofStarted=${receipt.visibleContentProofStarted}`,
      `visibleContentProof=${receipt.visibleContentProof}`,
      `visibleContentStrictProof=${receipt.visibleContentStrictProof}`,
      `visibleContentSoftGap=${receipt.visibleContentSoftGap}`,
      `visibleContentHardFail=${receipt.visibleContentHardFail}`,
      `visibleForwardProgress=${receipt.visibleForwardProgress}`,
      `visibleContentAdmissible=${receipt.visibleContentAdmissible}`,
      `visiblePlanetAvailable=${receipt.visiblePlanetAvailable}`,
      `visibleContentProofMethod=${receipt.visibleContentProofMethod}`,
      `visibleContentProofError=${receipt.visibleContentProofError}`,
      `visibleContentSampleCount=${receipt.visibleContentSampleCount}`,
      `visibleContentVarianceScore=${receipt.visibleContentVarianceScore}`,
      `visibleContentClassCount=${receipt.visibleContentClassCount}`,
      `visibleContentClasses=${receipt.visibleContentClasses.join(",")}`,
      `visibleContentLandSampleCount=${receipt.visibleContentLandSampleCount}`,
      `visibleContentWaterSampleCount=${receipt.visibleContentWaterSampleCount}`,
      `visibleContentOtherSampleCount=${receipt.visibleContentOtherSampleCount}`,
      `visibleContentCarrierSampleCount=${receipt.visibleContentCarrierSampleCount}`,
      `carrierOnlyDetected=${receipt.carrierOnlyDetected}`,
      "",
      `planetCanvasPresent=${receipt.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${receipt.planetCanvasNonZeroSize}`,
      `planetFramePainted=${receipt.planetFramePainted}`,
      `nonblankPlanetVisible=${receipt.nonblankPlanetVisible}`,
      `planetNotObstructed=${receipt.planetNotObstructed}`,
      "",
      `visualFidelityRenewalActive=${receipt.visualFidelityRenewalActive}`,
      `sourceColorDemotedToPaletteInfluence=${receipt.sourceColorDemotedToPaletteInfluence}`,
      `elevationControlsLandShape=${receipt.elevationControlsLandShape}`,
      `hydrologyControlsWaterShape=${receipt.hydrologyControlsWaterShape}`,
      `coastlineContrastActive=${receipt.coastlineContrastActive}`,
      `centerDarknessReduced=${receipt.centerDarknessReduced}`,
      `lightingPreservesSurfaceReadability=${receipt.lightingPreservesSurfaceReadability}`,
      `staleSourceMaskProtectionActive=${receipt.staleSourceMaskProtectionActive}`,
      "",
      `inspectEvidenceAvailable=${receipt.inspectEvidenceAvailable}`,
      `inspectModeAvailable=${receipt.inspectModeAvailable}`,
      `inspectPlanetControlAvailable=${receipt.inspectPlanetControlAvailable}`,
      `diagnosticCanLeavePlanetFrame=${receipt.diagnosticCanLeavePlanetFrame}`,
      "",
      `f13CanvasEvidencePreserved=${receipt.f13CanvasEvidencePreserved}`,
      `f13CanvasEvidenceComplete=${receipt.f13CanvasEvidenceComplete}`,
      `f13HardFail=${receipt.f13HardFail}`,
      `f21ClaimedByCanvas=${receipt.f21ClaimedByCanvas}`,
      `readyTextClaimedByCanvas=${receipt.readyTextClaimedByCanvas}`,
      "",
      "PROGRESS_ONLY_EVENT_COUNTS",
      progressLines,
      "",
      "ARCHIVED_LATE_EVENTS_COMPACT_TAIL",
      archivedLate,
      "",
      "ERRORS",
      errors,
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      "",
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  function exportCanvasEvidenceReceipt() {
    return getReceipt();
  }

  function getState() {
    return state;
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    bootCooperative,
    boot,
    mount,
    render,
    forceRedraw,
    setRotation,
    resetRotation,
    invalidateTexture,
    rebuildTexture,
    sample,
    read,
    sampleVisibleContent,
    classifyVisibleContentEvidence,
    exportCanvasEvidenceReceipt,
    readNorthAuthority,
    submitCanvasEvidence,
    getReceipt,
    getReceiptText,
    getState,
    on,
    off,

    canvasEvidenceProducer: true,
    f13CanvasEvidenceProducer: true,
    newsFibonacciSoftGapAdapter: true,
    softGapForwardProgressAllowed: true,
    hardFailReservedForStructuralFailure: true,
    duplicatePostReadyBootSuppression: true,
    cooperativeRenderChunking: true,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,

    sevenContinentVisualFallbackActive: true,
    continentVisualSeedCount: 7,
    continentBlendMode: "max-separated",
    proceduralSixLobeAdditiveFieldRetired: true,
    oceanChannelCutActive: true,
    seaLineTightened: true,
    coastlineSharpeningActive: true,
    cachedTextureInvalidationAvailable: true,
    transitionalFallbackVisualField: true,
    upstreamSevenContinentAuthorityPreferred: true,
    landChannelStillReceiverOnly: true,

    interactiveRotationActive: true,
    staleCanvasRepairActive: true,
    cachedTextureRepaintActive: true,
    visualFidelityRenewalActive: true,
    sourceColorDemotedToPaletteInfluence: true,
    elevationControlsLandShape: true,
    hydrologyControlsWaterShape: true,
    coastlineContrastActive: true,
    centerDarknessReduced: true,
    lightingPreservesSurfaceReadability: true,
    staleSourceMaskProtectionActive: true,

    ownsCanvasEvidenceOnly: true,
    ownsVisualTranslation: true,
    ownsInteractiveCanvasRepaint: true,
    doesNotOwnPlanetTruth: true,
    doesNotOwnRuntimeTableGovernance: true,
    doesNotOwnNewsFinalAuthority: true,
    doesNotOwnF21: true,
    f21ClaimedByCanvas: false,
    readyTextClaimedByCanvas: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;
  root.HEARTH.canvasAuthority = api;
  root.HEARTH.canvasEvidence = api;

  root.HEARTH_CANVAS = api;
  root.HEARTH_CANVAS_AUTHORITY = api;
  root.HEARTH_CANVAS_EVIDENCE = api;
  root.HEARTH_CANVAS_TEXTURE = api;
  root.HEARTH_CANVAS_SOFT_GAP_ADAPTER = api;
  root.HEARTH_CANVAS_VISUAL_FIDELITY = api;
  root.HEARTH_CANVAS_INTERACTIVE_ROTATION = api;
  root.HEARTH_CANVAS_STALE_REPAIR = api;
  root.HEARTH_CANVAS_SEVEN_CONTINENT_VISUAL_FIELD = api;

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.hearthCanvasEvidence = api;
  root.DEXTER_LAB.hearthCanvasVisualFidelity = api;
  root.DEXTER_LAB.hearthCanvasInteractiveRotation = api;
  root.DEXTER_LAB.hearthCanvasSevenContinentVisualField = api;

  updateDocumentDataset();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
