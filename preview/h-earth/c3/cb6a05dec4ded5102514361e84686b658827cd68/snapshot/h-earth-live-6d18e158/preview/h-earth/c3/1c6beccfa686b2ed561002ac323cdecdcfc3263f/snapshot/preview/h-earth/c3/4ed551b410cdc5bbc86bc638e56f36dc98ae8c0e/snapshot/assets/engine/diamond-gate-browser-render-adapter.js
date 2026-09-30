// /assets/engine/diamond-gate-browser-render-adapter.js
// DIAMOND_GATE_BROWSER_NATIVE_3D_RENDER_ADAPTER_TNT_v1
// Full-file replacement.
// Browser-native renderer adapter for Diamond Gate World Engine.
// Purpose:
// - Register a renderer adapter with /assets/engine/diamond-gate-world-engine.js.
// - Receive render intents from the meta-engine.
// - Express true geometry using X/Y/Z mesh coordinates projected into Canvas 2D.
// - Remain WebGPU-compatible at the intent/protocol layer without claiming WebGPU rendering.
// - Keep world truth owned by the World Engine.
// - Keep rendering/expression owned by this adapter.
// - Never mutate truth packets.
// - Never claim F21, ready text, final visual pass, generated image, GraphicBox, WebGL, or WebGPU rendering.

(() => {
  "use strict";

  const CONTRACT = "DIAMOND_GATE_BROWSER_NATIVE_3D_RENDER_ADAPTER_TNT_v1";
  const RECEIPT = "DIAMOND_GATE_BROWSER_NATIVE_3D_RENDER_ADAPTER_RECEIPT_v1";
  const VERSION = "2026-06-01.diamond-gate-browser-native-3d-render-adapter-v1";
  const FILE = "/assets/engine/diamond-gate-browser-render-adapter.js";

  const WORLD_ENGINE_FILE = "/assets/engine/diamond-gate-world-engine.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ADAPTER_ID = "diamond-gate-browser-native-3d-render-adapter";
  const BACKEND = "CUSTOM";

  const SUPPORTED_BACKENDS = Object.freeze([
    "CANVAS_2D",
    "WEBGPU",
    "CUSTOM"
  ]);

  const SUPPORTED_CLASSES = Object.freeze([
    "*",
    "WORLD",
    "PLANET",
    "REGION",
    "TERRAIN",
    "MATERIAL",
    "HYDROLOGY",
    "ATMOSPHERE",
    "ROUTE"
  ]);

  const DEFAULT_RENDER_TARGET = "#diamond-gate-render-mount";
  const DEFAULT_CANVAS_SIZE = 720;
  const MIN_CANVAS_SIZE = 360;
  const MAX_CANVAS_SIZE = 1440;

  const DEFAULT_LAT_BANDS = 34;
  const DEFAULT_LON_BANDS = 68;

  const PHASE = Object.freeze({
    CREATED: "CREATED",
    WAITING_WORLD_ENGINE: "WAITING_WORLD_ENGINE",
    REGISTERED_WITH_WORLD_ENGINE: "REGISTERED_WITH_WORLD_ENGINE",
    PREPARED: "PREPARED",
    GEOMETRY_COMPILED: "GEOMETRY_COMPILED",
    CANVAS_READY: "CANVAS_READY",
    FRAME_RENDERED: "FRAME_RENDERED",
    EVIDENCE_READY: "EVIDENCE_READY",
    HELD: "HELD",
    ERROR: "ERROR"
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    worldEngineFile: WORLD_ENGINE_FILE,

    adapterId: ADAPTER_ID,
    backend: BACKEND,
    supportedBackends: SUPPORTED_BACKENDS.slice(),
    supports: SUPPORTED_CLASSES.slice(),
    priority: 80,

    role: "browser-native-3d-render-adapter",
    renderLayer: "expression-only",
    worldEngineAdapter: true,
    registersWithWorldEngine: true,
    registeredWithWorldEngine: false,
    registrationAttempts: 0,
    registrationHeldReason: "WAITING_WORLD_ENGINE",

    canvas2DExpressionActive: true,
    webGPUIntentCompatible: true,
    webGPUCapabilityDetected: false,
    webGPUDrawingUsed: false,
    webGLDrawingUsed: false,

    true3DGeometryExpressionActive: true,
    geometryUsesXYZ: true,
    projectionUsesZDepth: true,
    depthSortActive: true,
    backfaceCullActive: true,

    ownsRendererExpression: true,
    ownsProjectionExpression: true,
    ownsMeshExpression: true,
    ownsCanvasPixels: true,

    ownsWorldTruth: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsAdmissibility: false,
    ownsRuntimeOrder: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    activeIntentId: "",
    activeObjectId: "",
    activeObjectClass: "",
    activeRequestedBackend: "",
    activeResolvedBackend: "CANVAS_2D",
    activeRenderTarget: "",
    activeMountPresent: false,
    activeCanvasPresent: false,

    canvas: null,
    context: null,
    mount: null,
    dpr: 1,
    cssWidth: 0,
    cssHeight: 0,
    physicalWidth: 0,
    physicalHeight: 0,

    meshReady: false,
    meshVertexCount: 0,
    meshFaceCount: 0,
    meshBounds: null,
    meshSource: "NONE",
    lastMesh: null,

    cameraReady: false,
    cameraYaw: -0.42,
    cameraPitch: 0.18,
    cameraRoll: 0,
    cameraZoom: 1,
    cameraDistance: 3.2,
    cameraFocalLength: 1.9,

    lastPreparedIntent: null,
    lastRenderIntent: null,
    lastSubmission: null,
    lastEvidence: null,
    lastFrameStats: null,
    lastReceiptText: "",

    frameCount: 0,
    renderSubmissionCount: 0,
    evidenceCount: 0,
    geometryCompileCount: 0,
    heldCount: 0,
    errorCount: 0,

    activePhase: PHASE.CREATED,
    activeNews: "RENDERER",
    activeFibonacci: "F13",
    activeFibonacciRank: 13,
    activeStageId: "browser-native-3d-render-adapter-created",
    activeGearId: "renderer-f13-created",
    activeProgress: 1,

    firstFailedCoordinate: "NONE_RENDER_ADAPTER_CREATED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "BROWSER_NATIVE_3D_RENDER_ADAPTER_CREATED",

    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webGPU: false,
    unityRuntimeClaimed: false,
    unrealRuntimeClaimed: false,
    visualPassClaimed: false,

    startedAt: "",
    updatedAt: ""
  };

  const MAX_LOG = 240;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
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

  function trimLog(array) {
    if (Array.isArray(array) && array.length > MAX_LOG) {
      array.splice(0, array.length - MAX_LOG);
    }
  }

  function makeId(prefix = "adapter") {
    const time = Date.now ? Date.now() : new Date().getTime();
    const random = Math.random().toString(36).slice(2, 9);
    return `${prefix}-${time}-${random}`;
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimLog(state.localEvents);
    state.updatedAt = item.at;

    updateDataset();

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors);
    state.errorCount += 1;
    state.activePhase = PHASE.ERROR;
    state.postgameStatus = item.code;
    state.updatedAt = item.at;

    updateDataset();

    return item;
  }

  function setPhase(phase, progress, status, coordinate = "") {
    state.activePhase = phase || state.activePhase;
    state.activeStageId = safeString(phase || state.activeStageId).toLowerCase();
    state.activeGearId = `renderer-${safeString(state.activeFibonacci).toLowerCase()}-${state.activeStageId}`;
    state.activeProgress = clamp(progress, 0, 100);
    state.postgameStatus = status || state.postgameStatus;
    if (coordinate) state.firstFailedCoordinate = coordinate;
    state.updatedAt = nowIso();

    updateDataset();
  }

  function readWorldEngine() {
    return (
      root.DIAMOND_GATE_WORLD_ENGINE ||
      root.DIAMOND_GATE_META_ENGINE ||
      root.DIAMOND_GATE_ENGINE_ABOVE_ENGINES ||
      (root.DIAMOND_GATE && root.DIAMOND_GATE.worldEngine) ||
      (root.DIAMOND_GATE && root.DIAMOND_GATE.metaEngine) ||
      (root.DEXTER_LAB && root.DEXTER_LAB.diamondGateWorldEngine) ||
      null
    );
  }

  function registerWithWorldEngine() {
    state.registrationAttempts += 1;

    const engine = readWorldEngine();

    if (!engine || !isFunction(engine.registerRendererAdapter)) {
      state.registeredWithWorldEngine = false;
      state.registrationHeldReason = "WAITING_WORLD_ENGINE_REGISTER_RENDERER_ADAPTER";
      setPhase(PHASE.WAITING_WORLD_ENGINE, 8, "WAITING_WORLD_ENGINE", state.registrationHeldReason);
      return false;
    }

    try {
      engine.registerRendererAdapter(adapterRegistrationPacket());
      state.registeredWithWorldEngine = true;
      state.registrationHeldReason = "NONE_REGISTERED_WITH_WORLD_ENGINE";
      state.firstFailedCoordinate = "NONE_REGISTERED_WITH_WORLD_ENGINE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;

      setPhase(PHASE.REGISTERED_WITH_WORLD_ENGINE, 18, "REGISTERED_WITH_WORLD_ENGINE", "NONE_REGISTERED_WITH_WORLD_ENGINE");

      record("REGISTERED_WITH_WORLD_ENGINE", {
        adapterId: ADAPTER_ID,
        backend: BACKEND,
        supportedBackends: SUPPORTED_BACKENDS
      });

      publishGlobals();

      return true;
    } catch (error) {
      recordError("WORLD_ENGINE_ADAPTER_REGISTRATION_FAILED", error);
      state.registeredWithWorldEngine = false;
      state.registrationHeldReason = "WORLD_ENGINE_ADAPTER_REGISTRATION_FAILED";
      return false;
    }
  }

  function scheduleRegistrationWatch() {
    let ticks = 0;

    const timer = root.setInterval(() => {
      ticks += 1;

      if (state.registeredWithWorldEngine) {
        root.clearInterval(timer);
        return;
      }

      registerWithWorldEngine();

      if (state.registeredWithWorldEngine || ticks >= 30) {
        root.clearInterval(timer);
      }
    }, 500);
  }

  function adapterRegistrationPacket() {
    return {
      id: ADAPTER_ID,
      name: ADAPTER_ID,
      label: "Diamond Gate Browser Native 3D Render Adapter",
      backend: BACKEND,
      priority: state.priority,
      supports: SUPPORTED_CLASSES.slice(),

      prepare,
      submit,
      readEvidence,
      getReceipt,

      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,

      supportedBackends: SUPPORTED_BACKENDS.slice(),
      canvas2DExpressionActive: true,
      webGPUIntentCompatible: true,
      webGPUDrawingUsed: false,
      webGLDrawingUsed: false,

      ownsRendererExpression: true,
      ownsWorldTruth: false,
      ownsAdmissibility: false,
      ownsRuntimeOrder: false,
      ownsF21: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      webGPU: false,
      visualPassClaimed: false
    };
  }

  function detectWebGPUCapability() {
    state.webGPUCapabilityDetected = Boolean(root.navigator && root.navigator.gpu);
    state.webGPUDrawingUsed = false;
    state.webGPU = false;
    return state.webGPUCapabilityDetected;
  }

  function extractTruth(intent = {}) {
    const truthPacket = isObject(intent.truthPacket) ? intent.truthPacket : {};
    const baseTruth = isObject(truthPacket.baseTruth) ? truthPacket.baseTruth : {};
    const providerTruth = isObject(truthPacket.providerTruth) ? truthPacket.providerTruth : {};
    const renderPreferences = isObject(baseTruth.renderPreferences) ? baseTruth.renderPreferences : {};
    const objectTruth = isObject(baseTruth.geometry) ? baseTruth.geometry : {};

    return {
      truthPacket,
      baseTruth,
      providerTruth,
      renderPreferences,
      objectTruth
    };
  }

  function normalizeRenderTarget(target) {
    if (!doc) return null;

    if (target && target.nodeType === 1) return target;

    if (typeof target === "string" && target.trim()) {
      try {
        const found = doc.querySelector(target);
        if (found) return found;
      } catch (_error) {}
    }

    try {
      let fallback = doc.querySelector(DEFAULT_RENDER_TARGET);

      if (!fallback) {
        fallback = doc.createElement("section");
        fallback.id = DEFAULT_RENDER_TARGET.replace("#", "");
        fallback.dataset.diamondGateRenderMount = "true";
        fallback.style.position = "relative";
        fallback.style.display = "grid";
        fallback.style.placeItems = "center";
        fallback.style.minHeight = `${MIN_CANVAS_SIZE}px`;
        fallback.style.width = "100%";
        fallback.style.overflow = "hidden";
        doc.body.appendChild(fallback);
      }

      return fallback;
    } catch (_error) {
      return null;
    }
  }

  function ensureCanvas(intent = {}) {
    if (!doc) {
      throw new Error("Document unavailable for browser-native render adapter.");
    }

    const target = normalizeRenderTarget(intent.renderTarget || intent.mount || intent.target || DEFAULT_RENDER_TARGET);

    if (!target) {
      throw new Error("Render target unavailable.");
    }

    let canvas =
      target.tagName && target.tagName.toLowerCase() === "canvas"
        ? target
        : target.querySelector("canvas[data-diamond-gate-browser-native-3d-canvas='true']");

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.dataset.diamondGateBrowserNative3dCanvas = "true";
      canvas.dataset.diamondGateRenderAdapterContract = CONTRACT;
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.webgl = "false";
      canvas.dataset.webgpu = "false";
      canvas.dataset.visualPassClaimed = "false";
      canvas.setAttribute("aria-label", "Diamond Gate browser-native 3D renderer canvas");
      target.appendChild(canvas);
    }

    if (!target.style.position) target.style.position = "relative";
    if (!target.style.display) target.style.display = "grid";
    if (!target.style.placeItems) target.style.placeItems = "center";
    if (!target.style.overflow) target.style.overflow = "hidden";

    const rect = target.getBoundingClientRect ? target.getBoundingClientRect() : { width: DEFAULT_CANVAS_SIZE, height: DEFAULT_CANVAS_SIZE };

    const requestedWidth = safeNumber(intent.width || intent.canvasWidth || 0, 0);
    const requestedHeight = safeNumber(intent.height || intent.canvasHeight || 0, 0);

    const cssWidth = clamp(
      requestedWidth || safeNumber(rect.width, DEFAULT_CANVAS_SIZE) || DEFAULT_CANVAS_SIZE,
      MIN_CANVAS_SIZE,
      MAX_CANVAS_SIZE
    );

    const cssHeight = clamp(
      requestedHeight || safeNumber(rect.height, DEFAULT_CANVAS_SIZE) || DEFAULT_CANVAS_SIZE,
      MIN_CANVAS_SIZE,
      MAX_CANVAS_SIZE
    );

    const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
    const physicalWidth = Math.round(cssWidth * dpr);
    const physicalHeight = Math.round(cssHeight * dpr);

    canvas.style.display = "block";
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";
    canvas.style.touchAction = "none";

    if (canvas.width !== physicalWidth) canvas.width = physicalWidth;
    if (canvas.height !== physicalHeight) canvas.height = physicalHeight;

    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });

    if (!context) {
      throw new Error("Canvas 2D context unavailable.");
    }

    state.mount = target;
    state.canvas = canvas;
    state.context = context;
    state.dpr = dpr;
    state.cssWidth = cssWidth;
    state.cssHeight = cssHeight;
    state.physicalWidth = physicalWidth;
    state.physicalHeight = physicalHeight;
    state.activeMountPresent = true;
    state.activeCanvasPresent = true;

    updateDataset();

    return { target, canvas, context };
  }

  function seededNoise(seedText) {
    let seed = 2166136261;

    const text = safeString(seedText, "diamond-gate");

    for (let i = 0; i < text.length; i += 1) {
      seed ^= text.charCodeAt(i);
      seed += (seed << 1) + (seed << 4) + (seed << 7) + (seed << 8) + (seed << 24);
    }

    return function noise(x, y, z = 0) {
      const n =
        Math.sin((x * 12.9898) + (y * 78.233) + (z * 37.719) + seed * 0.0000001) *
        43758.5453123;

      return n - Math.floor(n);
    };
  }

  function heightFunctionForIntent(intent = {}) {
    const extracted = extractTruth(intent);
    const baseTruth = extracted.baseTruth || {};
    const objectTruth = extracted.objectTruth || {};
    const seed = safeString(baseTruth.seed || objectTruth.seed || intent.objectId || "diamond-gate-planet");

    const noise = seededNoise(seed);

    const heightScale = clamp(
      objectTruth.heightScale ||
      baseTruth.heightScale ||
      extracted.renderPreferences.heightScale ||
      0.055,
      0,
      0.3
    );

    const waterLevel = clamp(
      objectTruth.waterLevel ||
      baseTruth.waterLevel ||
      0.48,
      0,
      1
    );

    return function heightAt(lat, lon) {
      const nx = Math.cos(lat) * Math.cos(lon);
      const ny = Math.sin(lat);
      const nz = Math.cos(lat) * Math.sin(lon);

      const a = noise(nx * 1.3, ny * 1.3, nz * 1.3);
      const b = noise(nx * 3.1 + 4.2, ny * 3.1 - 1.4, nz * 3.1 + 0.7);
      const c = noise(nx * 7.4 - 2.8, ny * 7.4 + 2.2, nz * 7.4 - 4.1);

      const blend = (a * 0.55) + (b * 0.32) + (c * 0.13);
      const terrainLift = blend > waterLevel ? (blend - waterLevel) / Math.max(0.0001, 1 - waterLevel) : -((waterLevel - blend) / Math.max(0.0001, waterLevel)) * 0.42;

      return terrainLift * heightScale;
    };
  }

  function classifySurface(height, lat, lon, intent = {}) {
    const polar = Math.abs(Math.sin(lat));

    if (polar > 0.9) return "ice";
    if (height < -0.012) return "deep-water";
    if (height < 0.004) return "water";
    if (height > 0.045) return "mountain";
    if (height > 0.022) return "highland";

    const noise = seededNoise(`${intent.objectId || "surface"}-surface`);
    const vegetation = noise(Math.cos(lat) * 4, Math.sin(lon) * 4, Math.sin(lat) * 4);

    if (vegetation > 0.68) return "forest";
    return "land";
  }

  function surfaceColor(surfaceClass, light = 1, depth = 0) {
    const shade = clamp(light * (0.78 + depth * 0.22), 0.18, 1.12);

    const palette = {
      "deep-water": [7, 31, 74],
      "water": [20, 78, 135],
      "land": [92, 132, 73],
      "forest": [44, 104, 62],
      "highland": [126, 117, 77],
      "mountain": [154, 142, 116],
      "ice": [210, 232, 238],
      "unknown": [96, 116, 132]
    };

    const rgb = palette[surfaceClass] || palette.unknown;
    return `rgb(${Math.round(rgb[0] * shade)}, ${Math.round(rgb[1] * shade)}, ${Math.round(rgb[2] * shade)})`;
  }

  function compileSphereMesh(intent = {}) {
    const extracted = extractTruth(intent);
    const objectTruth = extracted.objectTruth || {};
    const renderPreferences = extracted.renderPreferences || {};

    const latBands = clamp(renderPreferences.latBands || objectTruth.latBands || DEFAULT_LAT_BANDS, 10, 96);
    const lonBands = clamp(renderPreferences.lonBands || objectTruth.lonBands || DEFAULT_LON_BANDS, 20, 192);
    const radius = clamp(objectTruth.radius || extracted.baseTruth.radius || 1, 0.1, 10);

    const heightAt = heightFunctionForIntent(intent);
    const vertices = [];
    const faces = [];

    for (let latIndex = 0; latIndex <= latBands; latIndex += 1) {
      const v = latIndex / latBands;
      const lat = -Math.PI / 2 + v * Math.PI;

      for (let lonIndex = 0; lonIndex <= lonBands; lonIndex += 1) {
        const u = lonIndex / lonBands;
        const lon = -Math.PI + u * Math.PI * 2;
        const h = heightAt(lat, lon);
        const r = radius + h;

        const x = r * Math.cos(lat) * Math.cos(lon);
        const y = r * Math.sin(lat);
        const z = r * Math.cos(lat) * Math.sin(lon);

        const surfaceClass = classifySurface(h, lat, lon, intent);

        vertices.push({
          x,
          y,
          z,
          nx: Math.cos(lat) * Math.cos(lon),
          ny: Math.sin(lat),
          nz: Math.cos(lat) * Math.sin(lon),
          u,
          v,
          lat,
          lon,
          height: h,
          surfaceClass
        });
      }
    }

    const row = lonBands + 1;

    for (let latIndex = 0; latIndex < latBands; latIndex += 1) {
      for (let lonIndex = 0; lonIndex < lonBands; lonIndex += 1) {
        const a = latIndex * row + lonIndex;
        const b = a + 1;
        const c = a + row;
        const d = c + 1;

        if (latIndex > 0) faces.push({ a, b, c });
        if (latIndex < latBands - 1) faces.push({ a: b, b: d, c });
      }
    }

    const mesh = {
      meshId: makeId("mesh"),
      objectId: safeString(intent.objectId || "object"),
      objectClass: safeString(intent.objectClass || "UNKNOWN"),
      vertices,
      faces,
      latBands,
      lonBands,
      radius,
      source: "procedural-xyz-sphere-from-world-truth-packet",
      compiledAt: nowIso(),

      ownsTruth: false,
      ownsExpressionMesh: true,
      geometryUsesXYZ: true,
      visualPassClaimed: false
    };

    state.lastMesh = mesh;
    state.meshReady = true;
    state.meshVertexCount = vertices.length;
    state.meshFaceCount = faces.length;
    state.meshSource = mesh.source;
    state.geometryCompileCount += 1;

    const bounds = {
      minX: Infinity,
      minY: Infinity,
      minZ: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
      maxZ: -Infinity
    };

    vertices.forEach((vertex) => {
      bounds.minX = Math.min(bounds.minX, vertex.x);
      bounds.minY = Math.min(bounds.minY, vertex.y);
      bounds.minZ = Math.min(bounds.minZ, vertex.z);
      bounds.maxX = Math.max(bounds.maxX, vertex.x);
      bounds.maxY = Math.max(bounds.maxY, vertex.y);
      bounds.maxZ = Math.max(bounds.maxZ, vertex.z);
    });

    state.meshBounds = bounds;

    setPhase(PHASE.GEOMETRY_COMPILED, 42, "GEOMETRY_COMPILED", "NONE_GEOMETRY_COMPILED");

    record("GEOMETRY_COMPILED", {
      meshId: mesh.meshId,
      vertices: vertices.length,
      faces: faces.length,
      usesXYZ: true
    });

    updateDataset();

    return mesh;
  }

  function rotatePoint(vertex, camera) {
    const yaw = safeNumber(camera.yaw, state.cameraYaw);
    const pitch = safeNumber(camera.pitch, state.cameraPitch);
    const roll = safeNumber(camera.roll, state.cameraRoll);

    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);

    let x = vertex.x;
    let y = vertex.y;
    let z = vertex.z;

    const x1 = x * cy - z * sy;
    const z1 = x * sy + z * cy;

    x = x1;
    z = z1;

    const y2 = y * cp - z * sp;
    const z2 = y * sp + z * cp;

    y = y2;
    z = z2;

    const x3 = x * cr - y * sr;
    const y3 = x * sr + y * cr;

    return {
      x: x3,
      y: y3,
      z: z2,
      source: vertex
    };
  }

  function projectPoint(point, canvas, camera) {
    const zoom = safeNumber(camera.zoom, state.cameraZoom);
    const distance = safeNumber(camera.distance, state.cameraDistance);
    const focal = safeNumber(camera.focalLength, state.cameraFocalLength);

    const w = canvas.width;
    const h = canvas.height;
    const scale = Math.min(w, h) * 0.36 * zoom;

    const zDepth = point.z + distance;
    const perspective = focal / Math.max(0.12, zDepth);

    return {
      x: (w / 2) + point.x * scale * perspective,
      y: (h / 2) - point.y * scale * perspective,
      z: point.z,
      zDepth,
      perspective,
      source: point.source
    };
  }

  function faceNormal(a, b, c) {
    const ux = b.x - a.x;
    const uy = b.y - a.y;
    const uz = b.z - a.z;

    const vx = c.x - a.x;
    const vy = c.y - a.y;
    const vz = c.z - a.z;

    return {
      x: uy * vz - uz * vy,
      y: uz * vx - ux * vz,
      z: ux * vy - uy * vx
    };
  }

  function renderMeshToCanvas(mesh, intent = {}) {
    const ensured = ensureCanvas(intent);
    const canvas = ensured.canvas;
    const ctx = ensured.context;

    const camera = {
      yaw: safeNumber(intent.cameraYaw, state.cameraYaw),
      pitch: safeNumber(intent.cameraPitch, state.cameraPitch),
      roll: safeNumber(intent.cameraRoll, state.cameraRoll),
      zoom: safeNumber(intent.cameraZoom, state.cameraZoom),
      distance: safeNumber(intent.cameraDistance, state.cameraDistance),
      focalLength: safeNumber(intent.cameraFocalLength, state.cameraFocalLength)
    };

    state.cameraYaw = camera.yaw;
    state.cameraPitch = camera.pitch;
    state.cameraRoll = camera.roll;
    state.cameraZoom = camera.zoom;
    state.cameraDistance = camera.distance;
    state.cameraFocalLength = camera.focalLength;
    state.cameraReady = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    const background = ctx.createRadialGradient(w * 0.5, h * 0.46, Math.min(w, h) * 0.05, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
    background.addColorStop(0, "rgba(24, 42, 70, 0.96)");
    background.addColorStop(0.42, "rgba(6, 12, 26, 0.98)");
    background.addColorStop(1, "rgba(1, 3, 9, 1)");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);

    const rotated = mesh.vertices.map((vertex) => rotatePoint(vertex, camera));
    const projected = rotated.map((point) => projectPoint(point, canvas, camera));

    const light = {
      x: -0.42,
      y: 0.62,
      z: 0.66
    };

    const drawableFaces = [];

    mesh.faces.forEach((face) => {
      const ra = rotated[face.a];
      const rb = rotated[face.b];
      const rc = rotated[face.c];

      const n = faceNormal(ra, rb, rc);

      if (state.backfaceCullActive && n.z <= 0) return;

      const pa = projected[face.a];
      const pb = projected[face.b];
      const pc = projected[face.c];

      const avgZ = (ra.z + rb.z + rc.z) / 3;
      const avgDepth = (pa.zDepth + pb.zDepth + pc.zDepth) / 3;

      const na = mesh.vertices[face.a];
      const nb = mesh.vertices[face.b];
      const nc = mesh.vertices[face.c];

      const nx = (na.nx + nb.nx + nc.nx) / 3;
      const ny = (na.ny + nb.ny + nc.ny) / 3;
      const nz = (na.nz + nb.nz + nc.nz) / 3;

      const lightValue = clamp((nx * light.x + ny * light.y + nz * light.z) * 0.5 + 0.58, 0.2, 1);

      const surfaceClass =
        na.surfaceClass === nb.surfaceClass || na.surfaceClass === nc.surfaceClass
          ? na.surfaceClass
          : nb.surfaceClass === nc.surfaceClass
            ? nb.surfaceClass
            : na.surfaceClass;

      drawableFaces.push({
        pa,
        pb,
        pc,
        avgZ,
        avgDepth,
        lightValue,
        surfaceClass
      });
    });

    drawableFaces.sort((a, b) => a.avgDepth - b.avgDepth);

    let paintedFaces = 0;

    drawableFaces.forEach((face) => {
      ctx.beginPath();
      ctx.moveTo(face.pa.x, face.pa.y);
      ctx.lineTo(face.pb.x, face.pb.y);
      ctx.lineTo(face.pc.x, face.pc.y);
      ctx.closePath();

      const depthShade = clamp((face.avgZ + 1.5) / 3, 0.25, 1);
      ctx.fillStyle = surfaceColor(face.surfaceClass, face.lightValue, depthShade);
      ctx.fill();

      paintedFaces += 1;
    });

    const rim = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.23, w * 0.5, h * 0.5, Math.min(w, h) * 0.43);
    rim.addColorStop(0, "rgba(255,255,255,0)");
    rim.addColorStop(0.72, "rgba(255,255,255,0.02)");
    rim.addColorStop(0.92, "rgba(159,213,255,0.16)");
    rim.addColorStop(1, "rgba(159,213,255,0.02)");

    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.385, 0, Math.PI * 2);
    ctx.fill();

    state.frameCount += 1;

    const stats = {
      frameId: makeId("frame"),
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      cssWidth: state.cssWidth,
      cssHeight: state.cssHeight,
      dpr: state.dpr,
      vertexCount: mesh.vertices.length,
      faceCount: mesh.faces.length,
      paintedFaces,
      depthSortActive: true,
      backfaceCullActive: true,
      projectionUsesZDepth: true,
      geometryUsesXYZ: true,
      renderedAt: nowIso(),
      visualPassClaimed: false
    };

    state.lastFrameStats = stats;

    setPhase(PHASE.FRAME_RENDERED, 76, "FRAME_RENDERED", "NONE_FRAME_RENDERED");

    record("FRAME_RENDERED", {
      frameId: stats.frameId,
      paintedFaces,
      usesXYZ: true,
      projectionUsesZDepth: true
    });

    updateDataset();

    return stats;
  }

  function sampleEvidenceFromCanvas() {
    const canvas = state.canvas;
    const ctx = state.context;

    const evidence = {
      evidenceId: makeId("browser-render-evidence"),
      contract: CONTRACT,
      receipt: RECEIPT,
      adapterId: ADAPTER_ID,
      backend: state.activeResolvedBackend,
      visible: false,
      strict: false,
      degraded: false,
      hardFail: false,
      current: true,
      stale: false,
      metrics: {
        canvasPresent: Boolean(canvas),
        canvasNonZeroSize: Boolean(canvas && canvas.width > 0 && canvas.height > 0),
        frameCount: state.frameCount,
        meshReady: state.meshReady,
        meshVertexCount: state.meshVertexCount,
        meshFaceCount: state.meshFaceCount,
        projectionUsesZDepth: true,
        geometryUsesXYZ: true,
        webGLUsed: false,
        webGPUUsed: false
      },
      sourceReceipt: getReceiptLight(),
      visualPassClaimed: false
    };

    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      evidence.hardFail = true;
      evidence.metrics.firstFailedCoordinate = "CANVAS_CONTEXT_UNAVAILABLE";
      return evidence;
    }

    try {
      const sampleSize = Math.min(220, canvas.width, canvas.height);
      const sx = Math.max(0, Math.floor((canvas.width - sampleSize) / 2));
      const sy = Math.max(0, Math.floor((canvas.height - sampleSize) / 2));
      const image = ctx.getImageData(sx, sy, sampleSize, sampleSize);
      const data = image.data || [];

      let samples = 0;
      let nonTransparent = 0;
      let nonDark = 0;
      let minLum = 255;
      let maxLum = 0;
      const pixels = Math.floor(data.length / 4);
      const stride = Math.max(1, Math.floor(pixels / 1800));

      for (let p = 0; p < pixels; p += stride) {
        const i = p * 4;
        const r = data[i] || 0;
        const g = data[i + 1] || 0;
        const b = data[i + 2] || 0;
        const a = data[i + 3] || 0;

        samples += 1;

        if (a > 12) nonTransparent += 1;

        const lum = Math.round((r * 0.2126) + (g * 0.7152) + (b * 0.0722));
        minLum = Math.min(minLum, lum);
        maxLum = Math.max(maxLum, lum);

        if (a > 12 && lum > 14) nonDark += 1;
      }

      const variance = Math.max(0, maxLum - minLum);

      evidence.visible = Boolean(nonTransparent > 40 && nonDark > 24);
      evidence.strict = Boolean(
        evidence.visible &&
        state.meshReady &&
        state.meshVertexCount > 100 &&
        state.meshFaceCount > 100 &&
        state.lastFrameStats &&
        state.lastFrameStats.paintedFaces > 50 &&
        variance > 10
      );

      evidence.degraded = Boolean(evidence.visible && !evidence.strict);
      evidence.hardFail = !evidence.visible;

      evidence.metrics.samples = samples;
      evidence.metrics.nonTransparentSamples = nonTransparent;
      evidence.metrics.nonDarkSamples = nonDark;
      evidence.metrics.varianceScore = variance;
      evidence.metrics.paintedFaces = state.lastFrameStats ? state.lastFrameStats.paintedFaces : 0;
      evidence.metrics.frameId = state.lastFrameStats ? state.lastFrameStats.frameId : "";

      return evidence;
    } catch (error) {
      evidence.hardFail = true;
      evidence.metrics.error = error && error.message ? error.message : String(error);
      evidence.metrics.firstFailedCoordinate = "CANVAS_PIXEL_EVIDENCE_SAMPLE_FAILED";
      return evidence;
    }
  }

  function prepare(intent = {}) {
    detectWebGPUCapability();

    const renderIntent = isObject(intent) ? clonePlain(intent) : {};
    state.lastPreparedIntent = renderIntent;
    state.activeIntentId = safeString(renderIntent.intentId || makeId("external-intent"));
    state.activeObjectId = safeString(renderIntent.objectId || "");
    state.activeObjectClass = safeString(renderIntent.objectClass || "");
    state.activeRequestedBackend = safeString(renderIntent.requestedBackend || renderIntent.backend || "");
    state.activeResolvedBackend = "CANVAS_2D";
    state.activeRenderTarget = safeString(renderIntent.renderTarget || DEFAULT_RENDER_TARGET);

    if (renderIntent.backend === "WEBGPU" || renderIntent.requestedBackend === "WEBGPU") {
      state.webGPUIntentCompatible = true;
      state.webGPUCapabilityDetected = detectWebGPUCapability();
      state.webGPUDrawingUsed = false;
      state.webGPU = false;
      state.activeResolvedBackend = "CANVAS_2D";
    }

    ensureCanvas(renderIntent);

    setPhase(PHASE.PREPARED, 28, "RENDER_ADAPTER_PREPARED", "NONE_RENDER_ADAPTER_PREPARED");

    record("RENDER_ADAPTER_PREPARED", {
      intentId: state.activeIntentId,
      objectId: state.activeObjectId,
      requestedBackend: state.activeRequestedBackend,
      resolvedBackend: state.activeResolvedBackend,
      webGPUCapabilityDetected: state.webGPUCapabilityDetected,
      webGPUDrawingUsed: false
    });

    publishGlobals();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      adapterId: ADAPTER_ID,
      prepared: true,
      intentId: state.activeIntentId,
      objectId: state.activeObjectId,
      requestedBackend: state.activeRequestedBackend,
      resolvedBackend: state.activeResolvedBackend,
      canvasReady: state.activeCanvasPresent,
      webGPUIntentCompatible: true,
      webGPUCapabilityDetected: state.webGPUCapabilityDetected,
      webGPUDrawingUsed: false,
      webGLDrawingUsed: false,
      ownsWorldTruth: false,
      ownsRendererExpression: true,
      visualPassClaimed: false
    };
  }

  function submit(intent = {}) {
    const renderIntent = isObject(intent) ? clonePlain(intent) : {};

    state.renderSubmissionCount += 1;
    state.lastRenderIntent = renderIntent;

    try {
      prepare(renderIntent);

      if (renderIntent.renderAllowed === false || (renderIntent.admissibility && renderIntent.admissibility.hardBlock === true)) {
        state.heldCount += 1;
        state.firstFailedCoordinate =
          renderIntent.admissibility && renderIntent.admissibility.firstFailedCoordinate
            ? renderIntent.admissibility.firstFailedCoordinate
            : "RENDER_INTENT_HELD_BY_ADMISSIBILITY";

        const held = {
          submissionId: makeId("browser-render-held"),
          contract: CONTRACT,
          receipt: RECEIPT,
          adapterId: ADAPTER_ID,
          accepted: false,
          held: true,
          reason: state.firstFailedCoordinate,
          intentId: state.activeIntentId,
          objectId: state.activeObjectId,
          visualPassClaimed: false
        };

        state.lastSubmission = held;
        setPhase(PHASE.HELD, 34, "RENDER_INTENT_HELD", state.firstFailedCoordinate);
        return clonePlain(held);
      }

      const mesh = compileSphereMesh(renderIntent);
      const frameStats = renderMeshToCanvas(mesh, renderIntent);
      const evidence = sampleEvidenceFromCanvas();

      state.lastEvidence = evidence;
      state.evidenceCount += 1;

      const submission = {
        submissionId: makeId("browser-render-submission"),
        contract: CONTRACT,
        receipt: RECEIPT,
        adapterId: ADAPTER_ID,
        backend: state.activeResolvedBackend,
        requestedBackend: state.activeRequestedBackend,
        accepted: true,
        held: false,
        intentId: state.activeIntentId,
        objectId: state.activeObjectId,
        objectClass: state.activeObjectClass,
        canvasRendered: true,
        meshRendered: true,
        frameStats: clonePlain(frameStats),
        evidence: clonePlain(evidence),
        webGPUIntentCompatible: true,
        webGPUCapabilityDetected: state.webGPUCapabilityDetected,
        webGPUDrawingUsed: false,
        webGLDrawingUsed: false,
        rendererOwnsExpressionOnly: true,
        ownsWorldTruth: false,
        ownsF21: false,
        readyTextClaimed: false,
        visualPassClaimed: false,
        submittedAt: nowIso()
      };

      state.lastSubmission = submission;

      state.firstFailedCoordinate =
        evidence.strict
          ? "NONE_BROWSER_NATIVE_3D_RENDER_EVIDENCE_STRICT"
          : evidence.degraded
            ? "BROWSER_NATIVE_3D_RENDER_EVIDENCE_DEGRADED"
            : "BROWSER_NATIVE_3D_RENDER_EVIDENCE_HARD_FAIL";

      state.postgameStatus =
        evidence.strict
          ? "BROWSER_NATIVE_3D_RENDER_STRICT_EVIDENCE_READY"
          : evidence.degraded
            ? "BROWSER_NATIVE_3D_RENDER_DEGRADED_EVIDENCE_READY"
            : "BROWSER_NATIVE_3D_RENDER_HARD_FAIL_EVIDENCE";

      setPhase(PHASE.EVIDENCE_READY, evidence.strict ? 88 : evidence.degraded ? 80 : 70, state.postgameStatus, state.firstFailedCoordinate);

      record("RENDER_SUBMISSION_COMPLETE", {
        submissionId: submission.submissionId,
        intentId: state.activeIntentId,
        strict: evidence.strict,
        degraded: evidence.degraded,
        hardFail: evidence.hardFail
      });

      publishGlobals();

      return clonePlain(submission);
    } catch (error) {
      state.errorCount += 1;
      state.firstFailedCoordinate = "BROWSER_NATIVE_3D_RENDER_SUBMIT_FAILED";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;

      recordError("BROWSER_NATIVE_3D_RENDER_SUBMIT_FAILED", error, {
        intentId: state.activeIntentId,
        objectId: state.activeObjectId
      });

      return {
        submissionId: makeId("browser-render-error"),
        contract: CONTRACT,
        receipt: RECEIPT,
        adapterId: ADAPTER_ID,
        accepted: false,
        held: true,
        reason: "BROWSER_NATIVE_3D_RENDER_SUBMIT_FAILED",
        error: error && error.message ? error.message : String(error),
        visualPassClaimed: false
      };
    }
  }

  function readEvidence(submission = null) {
    const evidence = sampleEvidenceFromCanvas();

    if (submission && isObject(submission)) {
      evidence.sourceReceipt = {
        ...clonePlain(evidence.sourceReceipt),
        submission: clonePlain(submission)
      };
    }

    state.lastEvidence = evidence;
    state.evidenceCount += 1;

    setPhase(PHASE.EVIDENCE_READY, evidence.strict ? 88 : evidence.degraded ? 80 : 70, "RENDER_EVIDENCE_READ", evidence.strict ? "NONE_RENDER_EVIDENCE_STRICT" : evidence.degraded ? "RENDER_EVIDENCE_DEGRADED" : "RENDER_EVIDENCE_HARD_FAIL");

    record("RENDER_EVIDENCE_READ", {
      evidenceId: evidence.evidenceId,
      strict: evidence.strict,
      degraded: evidence.degraded,
      hardFail: evidence.hardFail
    });

    publishGlobals();

    return clonePlain(evidence);
  }

  function setCamera(input = {}) {
    if (isObject(input)) {
      state.cameraYaw = safeNumber(input.yaw, state.cameraYaw);
      state.cameraPitch = safeNumber(input.pitch, state.cameraPitch);
      state.cameraRoll = safeNumber(input.roll, state.cameraRoll);
      state.cameraZoom = clamp(input.zoom, 0.25, 6);
      state.cameraDistance = clamp(input.distance, 1.1, 12);
      state.cameraFocalLength = clamp(input.focalLength, 0.4, 5);
    }

    state.cameraReady = true;
    updateDataset();

    if (state.lastRenderIntent && state.lastMesh) {
      renderMeshToCanvas(state.lastMesh, {
        ...state.lastRenderIntent,
        cameraYaw: state.cameraYaw,
        cameraPitch: state.cameraPitch,
        cameraRoll: state.cameraRoll,
        cameraZoom: state.cameraZoom,
        cameraDistance: state.cameraDistance,
        cameraFocalLength: state.cameraFocalLength
      });

      state.lastEvidence = sampleEvidenceFromCanvas();
      publishGlobals();
    }

    return getReceipt();
  }

  function rotate(deltaYaw = 0, deltaPitch = 0) {
    return setCamera({
      yaw: state.cameraYaw + safeNumber(deltaYaw, 0),
      pitch: clamp(state.cameraPitch + safeNumber(deltaPitch, 0), -1.2, 1.2),
      zoom: state.cameraZoom,
      distance: state.cameraDistance,
      focalLength: state.cameraFocalLength
    });
  }

  function setZoom(zoom = 1) {
    return setCamera({
      yaw: state.cameraYaw,
      pitch: state.cameraPitch,
      roll: state.cameraRoll,
      zoom: clamp(zoom, 0.25, 6),
      distance: state.cameraDistance,
      focalLength: state.cameraFocalLength
    });
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const dataset = doc.documentElement.dataset;

    dataset.diamondGateBrowserNative3dRenderAdapterLoaded = "true";
    dataset.diamondGateBrowserNative3dRenderAdapterContract = CONTRACT;
    dataset.diamondGateBrowserNative3dRenderAdapterReceipt = RECEIPT;
    dataset.diamondGateBrowserNative3dRenderAdapterVersion = VERSION;
    dataset.diamondGateBrowserNative3dRenderAdapterFile = FILE;
    dataset.diamondGateBrowserNative3dRenderAdapterId = ADAPTER_ID;

    dataset.diamondGateBrowserNative3dRenderAdapterRegisteredWithWorldEngine = String(state.registeredWithWorldEngine);
    dataset.diamondGateBrowserNative3dRenderAdapterRegistrationHeldReason = state.registrationHeldReason;
    dataset.diamondGateBrowserNative3dRenderAdapterBackend = BACKEND;
    dataset.diamondGateBrowserNative3dRenderAdapterActiveResolvedBackend = state.activeResolvedBackend;
    dataset.diamondGateBrowserNative3dRenderAdapterSupportedBackends = SUPPORTED_BACKENDS.join(",");

    dataset.diamondGateBrowserNative3dCanvas2dExpressionActive = "true";
    dataset.diamondGateBrowserNative3dWebgpuIntentCompatible = "true";
    dataset.diamondGateBrowserNative3dWebgpuCapabilityDetected = String(state.webGPUCapabilityDetected);
    dataset.diamondGateBrowserNative3dWebgpuDrawingUsed = "false";
    dataset.diamondGateBrowserNative3dWebglDrawingUsed = "false";

    dataset.diamondGateBrowserNative3dTrueGeometryExpressionActive = "true";
    dataset.diamondGateBrowserNative3dGeometryUsesXyz = "true";
    dataset.diamondGateBrowserNative3dProjectionUsesZDepth = "true";
    dataset.diamondGateBrowserNative3dDepthSortActive = "true";
    dataset.diamondGateBrowserNative3dBackfaceCullActive = "true";

    dataset.diamondGateBrowserNative3dOwnsRendererExpression = "true";
    dataset.diamondGateBrowserNative3dOwnsProjectionExpression = "true";
    dataset.diamondGateBrowserNative3dOwnsMeshExpression = "true";
    dataset.diamondGateBrowserNative3dOwnsCanvasPixels = "true";

    dataset.diamondGateBrowserNative3dOwnsWorldTruth = "false";
    dataset.diamondGateBrowserNative3dOwnsPlanetTruth = "false";
    dataset.diamondGateBrowserNative3dOwnsMaterialTruth = "false";
    dataset.diamondGateBrowserNative3dOwnsHydrologyTruth = "false";
    dataset.diamondGateBrowserNative3dOwnsElevationTruth = "false";
    dataset.diamondGateBrowserNative3dOwnsAdmissibility = "false";
    dataset.diamondGateBrowserNative3dOwnsRuntimeOrder = "false";
    dataset.diamondGateBrowserNative3dOwnsF21 = "false";
    dataset.diamondGateBrowserNative3dOwnsReadyText = "false";
    dataset.diamondGateBrowserNative3dOwnsFinalVisualPassClaim = "false";

    dataset.diamondGateBrowserNative3dActiveIntentId = state.activeIntentId;
    dataset.diamondGateBrowserNative3dActiveObjectId = state.activeObjectId;
    dataset.diamondGateBrowserNative3dActiveObjectClass = state.activeObjectClass;
    dataset.diamondGateBrowserNative3dActiveRenderTarget = state.activeRenderTarget;
    dataset.diamondGateBrowserNative3dActiveMountPresent = String(state.activeMountPresent);
    dataset.diamondGateBrowserNative3dActiveCanvasPresent = String(state.activeCanvasPresent);

    dataset.diamondGateBrowserNative3dMeshReady = String(state.meshReady);
    dataset.diamondGateBrowserNative3dMeshVertexCount = String(state.meshVertexCount);
    dataset.diamondGateBrowserNative3dMeshFaceCount = String(state.meshFaceCount);
    dataset.diamondGateBrowserNative3dMeshSource = state.meshSource;

    dataset.diamondGateBrowserNative3dFrameCount = String(state.frameCount);
    dataset.diamondGateBrowserNative3dRenderSubmissionCount = String(state.renderSubmissionCount);
    dataset.diamondGateBrowserNative3dEvidenceCount = String(state.evidenceCount);
    dataset.diamondGateBrowserNative3dGeometryCompileCount = String(state.geometryCompileCount);

    dataset.diamondGateBrowserNative3dActivePhase = state.activePhase;
    dataset.diamondGateBrowserNative3dActiveNews = state.activeNews;
    dataset.diamondGateBrowserNative3dActiveFibonacci = state.activeFibonacci;
    dataset.diamondGateBrowserNative3dActiveFibonacciRank = String(state.activeFibonacciRank);
    dataset.diamondGateBrowserNative3dActiveStageId = state.activeStageId;
    dataset.diamondGateBrowserNative3dActiveGearId = state.activeGearId;
    dataset.diamondGateBrowserNative3dActiveProgress = String(state.activeProgress);

    dataset.diamondGateBrowserNative3dFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.diamondGateBrowserNative3dRecommendedNextFile = state.recommendedNextFile;
    dataset.diamondGateBrowserNative3dRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;
    dataset.diamondGateBrowserNative3dPostgameStatus = state.postgameStatus;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.webgpu = "false";
    dataset.visualPassClaimed = "false";

    if (state.canvas) {
      state.canvas.dataset.diamondGateBrowserNative3dRenderAdapterContract = CONTRACT;
      state.canvas.dataset.diamondGateBrowserNative3dRenderAdapterReceipt = RECEIPT;
      state.canvas.dataset.diamondGateBrowserNative3dGeometryUsesXyz = "true";
      state.canvas.dataset.diamondGateBrowserNative3dProjectionUsesZDepth = "true";
      state.canvas.dataset.generatedImage = "false";
      state.canvas.dataset.graphicBox = "false";
      state.canvas.dataset.webgl = "false";
      state.canvas.dataset.webgpu = "false";
      state.canvas.dataset.visualPassClaimed = "false";
    }
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      adapterId: ADAPTER_ID,
      backend: BACKEND,
      supportedBackends: SUPPORTED_BACKENDS.slice(),
      supports: SUPPORTED_CLASSES.slice(),

      registeredWithWorldEngine: state.registeredWithWorldEngine,
      registrationAttempts: state.registrationAttempts,
      registrationHeldReason: state.registrationHeldReason,

      canvas2DExpressionActive: true,
      webGPUIntentCompatible: true,
      webGPUCapabilityDetected: state.webGPUCapabilityDetected,
      webGPUDrawingUsed: false,
      webGLDrawingUsed: false,

      true3DGeometryExpressionActive: true,
      geometryUsesXYZ: true,
      projectionUsesZDepth: true,
      depthSortActive: true,
      backfaceCullActive: true,

      ownsRendererExpression: true,
      ownsProjectionExpression: true,
      ownsMeshExpression: true,
      ownsCanvasPixels: true,

      ownsWorldTruth: false,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsAdmissibility: false,
      ownsRuntimeOrder: false,
      ownsF21: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      activeIntentId: state.activeIntentId,
      activeObjectId: state.activeObjectId,
      activeObjectClass: state.activeObjectClass,
      activeRequestedBackend: state.activeRequestedBackend,
      activeResolvedBackend: state.activeResolvedBackend,
      activeRenderTarget: state.activeRenderTarget,
      activeMountPresent: state.activeMountPresent,
      activeCanvasPresent: state.activeCanvasPresent,

      meshReady: state.meshReady,
      meshVertexCount: state.meshVertexCount,
      meshFaceCount: state.meshFaceCount,
      meshSource: state.meshSource,
      meshBounds: clonePlain(state.meshBounds),

      cameraReady: state.cameraReady,
      cameraYaw: state.cameraYaw,
      cameraPitch: state.cameraPitch,
      cameraRoll: state.cameraRoll,
      cameraZoom: state.cameraZoom,
      cameraDistance: state.cameraDistance,
      cameraFocalLength: state.cameraFocalLength,

      frameCount: state.frameCount,
      renderSubmissionCount: state.renderSubmissionCount,
      evidenceCount: state.evidenceCount,
      geometryCompileCount: state.geometryCompileCount,

      activePhase: state.activePhase,
      activeNews: state.activeNews,
      activeFibonacci: state.activeFibonacci,
      activeFibonacciRank: state.activeFibonacciRank,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeProgress: state.activeProgress,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      webGPU: false,
      unityRuntimeClaimed: false,
      unrealRuntimeClaimed: false,
      visualPassClaimed: false,

      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      role: state.role,
      renderLayer: state.renderLayer,
      worldEngineAdapter: true,

      lastPreparedIntent: clonePlain(state.lastPreparedIntent),
      lastRenderIntent: clonePlain(state.lastRenderIntent),
      lastSubmission: clonePlain(state.lastSubmission),
      lastEvidence: clonePlain(state.lastEvidence),
      lastFrameStats: clonePlain(state.lastFrameStats),

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      startedAt: state.startedAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    return [
      "DIAMOND_GATE_BROWSER_NATIVE_3D_RENDER_ADAPTER_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `adapterId=${r.adapterId}`,
      `backend=${r.backend}`,
      `supportedBackends=${r.supportedBackends.join(",")}`,
      "",
      "REGISTRATION",
      `registeredWithWorldEngine=${r.registeredWithWorldEngine}`,
      `registrationAttempts=${r.registrationAttempts}`,
      `registrationHeldReason=${r.registrationHeldReason}`,
      "",
      "RENDER_CAPABILITY",
      `canvas2DExpressionActive=${r.canvas2DExpressionActive}`,
      `webGPUIntentCompatible=${r.webGPUIntentCompatible}`,
      `webGPUCapabilityDetected=${r.webGPUCapabilityDetected}`,
      `webGPUDrawingUsed=${r.webGPUDrawingUsed}`,
      `webGLDrawingUsed=${r.webGLDrawingUsed}`,
      `true3DGeometryExpressionActive=${r.true3DGeometryExpressionActive}`,
      `geometryUsesXYZ=${r.geometryUsesXYZ}`,
      `projectionUsesZDepth=${r.projectionUsesZDepth}`,
      `depthSortActive=${r.depthSortActive}`,
      `backfaceCullActive=${r.backfaceCullActive}`,
      "",
      "OWNERSHIP",
      `ownsRendererExpression=${r.ownsRendererExpression}`,
      `ownsProjectionExpression=${r.ownsProjectionExpression}`,
      `ownsMeshExpression=${r.ownsMeshExpression}`,
      `ownsCanvasPixels=${r.ownsCanvasPixels}`,
      `ownsWorldTruth=${r.ownsWorldTruth}`,
      `ownsPlanetTruth=${r.ownsPlanetTruth}`,
      `ownsMaterialTruth=${r.ownsMaterialTruth}`,
      `ownsHydrologyTruth=${r.ownsHydrologyTruth}`,
      `ownsElevationTruth=${r.ownsElevationTruth}`,
      `ownsAdmissibility=${r.ownsAdmissibility}`,
      `ownsRuntimeOrder=${r.ownsRuntimeOrder}`,
      `ownsF21=${r.ownsF21}`,
      `ownsReadyText=${r.ownsReadyText}`,
      `ownsFinalVisualPassClaim=${r.ownsFinalVisualPassClaim}`,
      "",
      "ACTIVE",
      `activeIntentId=${r.activeIntentId}`,
      `activeObjectId=${r.activeObjectId}`,
      `activeObjectClass=${r.activeObjectClass}`,
      `activeRequestedBackend=${r.activeRequestedBackend}`,
      `activeResolvedBackend=${r.activeResolvedBackend}`,
      `activeRenderTarget=${r.activeRenderTarget}`,
      `activeMountPresent=${r.activeMountPresent}`,
      `activeCanvasPresent=${r.activeCanvasPresent}`,
      "",
      "MESH",
      `meshReady=${r.meshReady}`,
      `meshVertexCount=${r.meshVertexCount}`,
      `meshFaceCount=${r.meshFaceCount}`,
      `meshSource=${r.meshSource}`,
      "",
      "CAMERA",
      `cameraReady=${r.cameraReady}`,
      `cameraYaw=${r.cameraYaw}`,
      `cameraPitch=${r.cameraPitch}`,
      `cameraRoll=${r.cameraRoll}`,
      `cameraZoom=${r.cameraZoom}`,
      `cameraDistance=${r.cameraDistance}`,
      `cameraFocalLength=${r.cameraFocalLength}`,
      "",
      "COUNTS",
      `frameCount=${r.frameCount}`,
      `renderSubmissionCount=${r.renderSubmissionCount}`,
      `evidenceCount=${r.evidenceCount}`,
      `geometryCompileCount=${r.geometryCompileCount}`,
      "",
      "NEWS_FIBONACCI",
      `activePhase=${r.activePhase}`,
      `activeNews=${r.activeNews}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `activeStageId=${r.activeStageId}`,
      `activeGearId=${r.activeGearId}`,
      `activeProgress=${r.activeProgress}`,
      "",
      "NEXT",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `postgameStatus=${r.postgameStatus}`,
      "",
      "FINAL_CLAIMS",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `webGPU=${r.webGPU}`,
      `unityRuntimeClaimed=${r.unityRuntimeClaimed}`,
      `unrealRuntimeClaimed=${r.unrealRuntimeClaimed}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `startedAt=${r.startedAt}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function publishGlobals() {
    root.DIAMOND_GATE = root.DIAMOND_GATE || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.DIAMOND_GATE.browserNative3dRenderAdapter = api;
    root.DIAMOND_GATE.browserRenderAdapter = api;
    root.DIAMOND_GATE.renderAdapter3D = api;

    root.DEXTER_LAB.diamondGateBrowserNative3dRenderAdapter = api;

    root.DIAMOND_GATE_BROWSER_NATIVE_3D_RENDER_ADAPTER = api;
    root.DIAMOND_GATE_BROWSER_RENDER_ADAPTER = api;
    root.DIAMOND_GATE_RENDER_ADAPTER_3D = api;
    root.DIAMOND_GATE_BROWSER_NATIVE_3D_RENDER_ADAPTER_RECEIPT = getReceiptLight();

    updateDataset();
  }

  function boot() {
    if (!state.startedAt) {
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
    }

    detectWebGPUCapability();
    publishGlobals();

    const registered = registerWithWorldEngine();

    if (!registered) {
      scheduleRegistrationWatch();
    }

    record("DIAMOND_GATE_BROWSER_NATIVE_3D_RENDER_ADAPTER_BOOTED", {
      adapterId: ADAPTER_ID,
      registeredWithWorldEngine: state.registeredWithWorldEngine,
      webGPUCapabilityDetected: state.webGPUCapabilityDetected,
      webGPUDrawingUsed: false,
      webGLDrawingUsed: false,
      visualPassClaimed: false
    });

    return getReceipt();
  }

  const api = {
    id: ADAPTER_ID,
    name: ADAPTER_ID,
    label: "Diamond Gate Browser Native 3D Render Adapter",
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,

    backend: BACKEND,
    priority: state.priority,
    supports: SUPPORTED_CLASSES.slice(),
    supportedBackends: SUPPORTED_BACKENDS.slice(),

    boot,
    start: boot,
    init: boot,

    prepare,
    submit,
    readEvidence,

    compileSphereMesh,
    renderMeshToCanvas,
    sampleEvidenceFromCanvas,
    ensureCanvas,
    setCamera,
    rotate,
    setZoom,

    registerWithWorldEngine,
    adapterRegistrationPacket,

    getReceipt,
    getReceiptLight,
    getReceiptText,

    canvas2DExpressionActive: true,
    webGPUIntentCompatible: true,
    webGPUDrawingUsed: false,
    webGLDrawingUsed: false,
    true3DGeometryExpressionActive: true,
    geometryUsesXYZ: true,
    projectionUsesZDepth: true,
    depthSortActive: true,
    backfaceCullActive: true,

    ownsRendererExpression: true,
    ownsProjectionExpression: true,
    ownsMeshExpression: true,
    ownsCanvasPixels: true,

    ownsWorldTruth: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsAdmissibility: false,
    ownsRuntimeOrder: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webGPU: false,
    unityRuntimeClaimed: false,
    unrealRuntimeClaimed: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  publishGlobals();

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
    } else {
      boot();
    }
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
