// /assets/engine/diamond-gate-world-engine.js
// DIAMOND_GATE_WORLD_ENGINE_META_LAYER_TNT_v1
// Full-file replacement.
// Browser-native supervisory world engine.
// Purpose:
// - Establish a meta-engine above renderers.
// - Own world truth packets, admissibility, runtime order, evidence receipts, and render-intent compilation.
// - Keep graphics/rendering delegated to adapters.
// - Support Canvas/WebGPU/Three.js/Unity/Unreal/custom render backends without depending on them.
// - Preserve Diamond Gate rules: WORLD_ENGINE owns truth; RUNTIME owns execution order; RENDERERS own expression; GAUGES own measurement; NORTH owns final latch.
// - No generated image.
// - No GraphicBox.
// - No WebGL/WebGPU claim by this file.
// - No final visual pass claim.

(() => {
  "use strict";

  const CONTRACT = "DIAMOND_GATE_WORLD_ENGINE_META_LAYER_TNT_v1";
  const RECEIPT = "DIAMOND_GATE_WORLD_ENGINE_META_LAYER_RECEIPT_v1";
  const VERSION = "2026-06-01.diamond-gate-world-engine-meta-layer-v1";
  const FILE = "/assets/engine/diamond-gate-world-engine.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const NEWS = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    SOUTH: "SOUTH",
    WEST: "WEST",
    CANVAS: "CANVAS",
    RENDERER: "RENDERER",
    GAUGES: "GAUGES",
    UNKNOWN: "UNKNOWN"
  });

  const FIBONACCI = Object.freeze({
    F1: 1,
    F2: 2,
    F3: 3,
    F5: 5,
    F8: 8,
    F13: 13,
    F21: 21,
    F34: 34,
    F55: 55,
    F89: 89,
    F144: 144,
    F233: 233
  });

  const ENGINE_PHASES = Object.freeze({
    CREATED: "CREATED",
    TRUTH_REGISTERED: "TRUTH_REGISTERED",
    ADMISSIBILITY_EVALUATED: "ADMISSIBILITY_EVALUATED",
    RENDER_INTENT_COMPILED: "RENDER_INTENT_COMPILED",
    ADAPTER_SELECTED: "ADAPTER_SELECTED",
    RENDER_PACKET_SUBMITTED: "RENDER_PACKET_SUBMITTED",
    RENDER_EVIDENCE_OBSERVED: "RENDER_EVIDENCE_OBSERVED",
    RETURN_PACKET_COMPOSED: "RETURN_PACKET_COMPOSED",
    HELD: "HELD",
    ERROR: "ERROR"
  });

  const ADMISSIBILITY = Object.freeze({
    PASS: "PASS",
    DEGRADED_PASS: "DEGRADED_PASS",
    HOLD: "HOLD",
    HARD_BLOCK: "HARD_BLOCK"
  });

  const OBJECT_CLASSES = Object.freeze({
    WORLD: "WORLD",
    PLANET: "PLANET",
    REGION: "REGION",
    TERRAIN: "TERRAIN",
    MATERIAL: "MATERIAL",
    HYDROLOGY: "HYDROLOGY",
    ATMOSPHERE: "ATMOSPHERE",
    LIGHTING: "LIGHTING",
    CHARACTER: "CHARACTER",
    ROUTE: "ROUTE",
    UNKNOWN: "UNKNOWN"
  });

  const RENDER_BACKENDS = Object.freeze({
    NULL: "NULL_RENDERER",
    CANVAS_2D: "CANVAS_2D",
    WEBGPU: "WEBGPU",
    THREE: "THREE",
    BABYLON: "BABYLON",
    UNITY: "UNITY",
    UNREAL: "UNREAL",
    CUSTOM: "CUSTOM"
  });

  const REQUIRED_RENDER_INTENT_FIELDS = Object.freeze([
    "objectId",
    "objectClass",
    "truthPacket",
    "admissibility",
    "renderTarget",
    "backend",
    "compiledAt"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,

    role: "world-governance-meta-engine",
    engineLayer: "above-renderers",
    runtimeMode: "browser-native-supervisory",

    worldEngineActive: true,
    supervisoryEngineActive: true,
    renderEngineOwnedExternally: true,
    rendererAdaptersDelegated: true,

    ownsWorldTruth: true,
    ownsAdmissibility: true,
    ownsRuntimeOrder: true,
    ownsRenderIntentCompilation: true,
    ownsEvidenceReceipt: true,
    ownsRendererSelection: true,

    ownsCanvasDrawing: false,
    ownsWebGPUDrawing: false,
    ownsThreeDrawing: false,
    ownsUnityDrawing: false,
    ownsUnrealDrawing: false,
    ownsFinalVisualPassClaim: false,

    newsAlignmentActive: true,
    fibonacciSynchronizationActive: true,
    oneActiveGearAtATime: true,

    activeNews: NEWS.NORTH,
    activeFibonacci: "F1",
    activeFibonacciRank: 1,
    activeStageId: ENGINE_PHASES.CREATED,
    activeGearId: "world-engine-created-f1",
    activeProgress: 1,

    registeredTruthProviders: {},
    registeredRendererAdapters: {},
    registeredObjectPackets: {},
    registeredEvidence: {},

    activeObjectId: "",
    activeObjectClass: OBJECT_CLASSES.UNKNOWN,
    activeBackend: RENDER_BACKENDS.NULL,
    activeAdapterId: "",
    activeRenderIntentId: "",

    lastTruthPacket: null,
    lastAdmissibilityPacket: null,
    lastRenderIntent: null,
    lastRenderSubmission: null,
    lastRenderEvidence: null,
    lastReturnPacket: null,

    renderIntentCount: 0,
    renderSubmissionCount: 0,
    evidenceCount: 0,
    hardBlockCount: 0,
    degradedPassCount: 0,
    passCount: 0,

    firstFailedCoordinate: "NONE_ENGINE_CREATED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "WORLD_ENGINE_META_LAYER_CREATED",

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

  function makeId(prefix = "packet") {
    const time = Date.now ? Date.now() : new Date().getTime();
    const random = Math.random().toString(36).slice(2, 9);
    return `${prefix}-${time}-${random}`;
  }

  function normalizeObjectClass(value) {
    const text = safeString(value, OBJECT_CLASSES.UNKNOWN).toUpperCase();

    if (OBJECT_CLASSES[text]) return OBJECT_CLASSES[text];
    if (text.includes("PLANET")) return OBJECT_CLASSES.PLANET;
    if (text.includes("WORLD")) return OBJECT_CLASSES.WORLD;
    if (text.includes("TERRAIN")) return OBJECT_CLASSES.TERRAIN;
    if (text.includes("MATERIAL")) return OBJECT_CLASSES.MATERIAL;
    if (text.includes("HYDRO")) return OBJECT_CLASSES.HYDROLOGY;
    if (text.includes("ATMOS")) return OBJECT_CLASSES.ATMOSPHERE;
    if (text.includes("ROUTE")) return OBJECT_CLASSES.ROUTE;

    return OBJECT_CLASSES.UNKNOWN;
  }

  function normalizeBackend(value) {
    const text = safeString(value, RENDER_BACKENDS.NULL).toUpperCase();

    if (text.includes("CANVAS")) return RENDER_BACKENDS.CANVAS_2D;
    if (text.includes("WEBGPU")) return RENDER_BACKENDS.WEBGPU;
    if (text.includes("THREE")) return RENDER_BACKENDS.THREE;
    if (text.includes("BABYLON")) return RENDER_BACKENDS.BABYLON;
    if (text.includes("UNITY")) return RENDER_BACKENDS.UNITY;
    if (text.includes("UNREAL")) return RENDER_BACKENDS.UNREAL;
    if (text.includes("CUSTOM")) return RENDER_BACKENDS.CUSTOM;

    return RENDER_BACKENDS.NULL;
  }

  function setStage(news, fibonacci, stageId, progress, status) {
    state.activeNews = news || state.activeNews;
    state.activeFibonacci = fibonacci || state.activeFibonacci;
    state.activeFibonacciRank = FIBONACCI[state.activeFibonacci] || safeNumber(state.activeFibonacci, state.activeFibonacciRank);
    state.activeStageId = stageId || state.activeStageId;
    state.activeGearId = `${safeString(state.activeNews).toLowerCase()}-${safeString(state.activeStageId).toLowerCase()}-${safeString(state.activeFibonacci).toLowerCase()}`;
    state.activeProgress = clamp(progress, 0, 100);
    state.postgameStatus = status || state.postgameStatus;
    state.updatedAt = nowIso();

    updateDataset();
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
    state.updatedAt = item.at;
    state.activeStageId = ENGINE_PHASES.ERROR;
    state.postgameStatus = item.code;

    updateDataset();

    return item;
  }

  function map256ToEngine(input = {}) {
    const source = isObject(input) ? input : {};
    const bits = [];

    for (let i = 0; i < 8; i += 1) {
      const key = `b${i}`;
      const value = source[key] !== undefined ? source[key] : source[i];
      bits.push(safeBool(value, false) ? 1 : 0);
    }

    const microstate =
      bits[0] * 128 +
      bits[1] * 64 +
      bits[2] * 32 +
      bits[3] * 16 +
      bits[4] * 8 +
      bits[5] * 4 +
      bits[6] * 2 +
      bits[7];

    const g1 = bits[0] ^ bits[1];
    const g2 = bits[2] ^ bits[3];
    const g3 = bits[4] ^ bits[5];
    const g4 = bits[6] ^ bits[7];

    const engine = 8 * g1 + 4 * g2 + 2 * g3 + g4;

    return {
      microstate,
      bits,
      g1,
      g2,
      g3,
      g4,
      engine,
      engineId: `ENGINE_${engine}`,
      mappedAt: nowIso()
    };
  }

  function registerTruthProvider(provider = {}) {
    if (!isObject(provider)) {
      throw new Error("registerTruthProvider requires an object.");
    }

    const id = safeString(provider.id || provider.name || makeId("truth-provider"));
    const packet = {
      id,
      label: safeString(provider.label || provider.name || id),
      objectClass: normalizeObjectClass(provider.objectClass),
      priority: safeNumber(provider.priority, 0),
      readTruth: isFunction(provider.readTruth) ? provider.readTruth : null,
      getReceipt: isFunction(provider.getReceipt) ? provider.getReceipt : null,
      registeredAt: nowIso(),
      active: provider.active !== false
    };

    state.registeredTruthProviders[id] = packet;

    setStage(NEWS.NORTH, "F2", ENGINE_PHASES.TRUTH_REGISTERED, 8, "TRUTH_PROVIDER_REGISTERED");

    record("TRUTH_PROVIDER_REGISTERED", {
      id,
      objectClass: packet.objectClass
    });

    publishGlobals();

    return clonePlain(packet);
  }

  function registerRendererAdapter(adapter = {}) {
    if (!isObject(adapter)) {
      throw new Error("registerRendererAdapter requires an object.");
    }

    const id = safeString(adapter.id || adapter.name || makeId("renderer-adapter"));
    const backend = normalizeBackend(adapter.backend || adapter.type);

    const packet = {
      id,
      label: safeString(adapter.label || adapter.name || id),
      backend,
      priority: safeNumber(adapter.priority, 0),
      supports: Array.isArray(adapter.supports) ? adapter.supports.slice() : [],
      prepare: isFunction(adapter.prepare) ? adapter.prepare : null,
      submit: isFunction(adapter.submit) ? adapter.submit : null,
      readEvidence: isFunction(adapter.readEvidence) ? adapter.readEvidence : null,
      getReceipt: isFunction(adapter.getReceipt) ? adapter.getReceipt : null,
      registeredAt: nowIso(),
      active: adapter.active !== false,

      ownsWorldTruth: false,
      ownsAdmissibility: false,
      ownsRuntimeOrder: false,
      ownsFinalVisualPassClaim: false
    };

    state.registeredRendererAdapters[id] = packet;

    setStage(NEWS.EAST, "F3", ENGINE_PHASES.ADAPTER_SELECTED, 14, "RENDERER_ADAPTER_REGISTERED");

    record("RENDERER_ADAPTER_REGISTERED", {
      id,
      backend
    });

    publishGlobals();

    return clonePlain(packet);
  }

  function registerObjectPacket(packet = {}) {
    if (!isObject(packet)) {
      throw new Error("registerObjectPacket requires an object.");
    }

    const objectId = safeString(packet.objectId || packet.id || makeId("object"));
    const objectClass = normalizeObjectClass(packet.objectClass || packet.class || packet.type);

    const normalized = {
      objectId,
      objectClass,
      label: safeString(packet.label || packet.name || objectId),
      state256: isObject(packet.state256) ? map256ToEngine(packet.state256) : map256ToEngine({}),
      truth: isObject(packet.truth) ? clonePlain(packet.truth) : {},
      constraints: isObject(packet.constraints) ? clonePlain(packet.constraints) : {},
      renderPreferences: isObject(packet.renderPreferences) ? clonePlain(packet.renderPreferences) : {},
      metadata: isObject(packet.metadata) ? clonePlain(packet.metadata) : {},
      registeredAt: nowIso()
    };

    state.registeredObjectPackets[objectId] = normalized;
    state.activeObjectId = objectId;
    state.activeObjectClass = objectClass;

    setStage(NEWS.NORTH, "F5", ENGINE_PHASES.TRUTH_REGISTERED, 20, "OBJECT_PACKET_REGISTERED");

    record("OBJECT_PACKET_REGISTERED", {
      objectId,
      objectClass,
      engineId: normalized.state256.engineId
    });

    publishGlobals();

    return clonePlain(normalized);
  }

  function readTruth(objectId, input = {}) {
    const id = safeString(objectId || input.objectId || state.activeObjectId);
    const objectPacket = state.registeredObjectPackets[id] || null;

    const providerList = Object.values(state.registeredTruthProviders)
      .filter((provider) => provider && provider.active)
      .sort((a, b) => b.priority - a.priority);

    const providerTruth = {};

    providerList.forEach((provider) => {
      if (!provider.readTruth) return;

      try {
        const result = provider.readTruth({
          objectId: id,
          objectPacket: clonePlain(objectPacket),
          input: clonePlain(input),
          engine: api
        });

        if (isObject(result)) {
          providerTruth[provider.id] = clonePlain(result);
        }
      } catch (error) {
        recordError("TRUTH_PROVIDER_READ_FAILED", error, {
          providerId: provider.id,
          objectId: id
        });
      }
    });

    const truthPacket = {
      packetId: makeId("truth"),
      contract: CONTRACT,
      receipt: RECEIPT,
      objectId: id,
      objectClass: objectPacket ? objectPacket.objectClass : normalizeObjectClass(input.objectClass),
      baseTruth: objectPacket ? clonePlain(objectPacket.truth) : {},
      providerTruth,
      constraints: objectPacket ? clonePlain(objectPacket.constraints) : {},
      state256: objectPacket ? clonePlain(objectPacket.state256) : map256ToEngine(input.state256 || {}),
      readAt: nowIso(),

      worldEngineOwnsTruthPacket: true,
      rendererOwnsTruth: false,
      finalVisualPassClaimed: false
    };

    state.lastTruthPacket = truthPacket;

    setStage(NEWS.NORTH, "F8", ENGINE_PHASES.TRUTH_REGISTERED, 28, "TRUTH_PACKET_READ");

    record("TRUTH_PACKET_READ", {
      objectId: id,
      objectClass: truthPacket.objectClass,
      providers: Object.keys(providerTruth).length
    });

    return clonePlain(truthPacket);
  }

  function evaluateAdmissibility(truthPacket = null, input = {}) {
    const truth = truthPacket && isObject(truthPacket)
      ? truthPacket
      : readTruth(input.objectId || state.activeObjectId, input);

    const constraints = isObject(truth.constraints) ? truth.constraints : {};
    const baseTruth = isObject(truth.baseTruth) ? truth.baseTruth : {};
    const providerTruth = isObject(truth.providerTruth) ? truth.providerTruth : {};

    const hardBlocks = [];
    const softGaps = [];
    const passes = [];

    if (!truth.objectId) hardBlocks.push("OBJECT_ID_MISSING");
    if (truth.objectClass === OBJECT_CLASSES.UNKNOWN) softGaps.push("OBJECT_CLASS_UNKNOWN");

    if (constraints.requiresElevation === true && !baseTruth.elevation && !providerTruth.elevation) {
      softGaps.push("ELEVATION_TRUTH_NOT_OBSERVED");
    }

    if (constraints.requiresHydrology === true && !baseTruth.hydrology && !providerTruth.hydrology) {
      softGaps.push("HYDROLOGY_TRUTH_NOT_OBSERVED");
    }

    if (constraints.requiresMaterial === true && !baseTruth.materials && !providerTruth.materials) {
      softGaps.push("MATERIAL_TRUTH_NOT_OBSERVED");
    }

    if (constraints.hardBlock === true) {
      hardBlocks.push(safeString(constraints.hardBlockReason, "CONSTRAINT_HARD_BLOCK"));
    }

    if (truth.state256 && safeNumber(truth.state256.engine, -1) < 0) {
      hardBlocks.push("STATE256_ENGINE_MAPPING_INVALID");
    }

    if (!hardBlocks.length) passes.push("NO_HARD_BLOCKS");
    if (!softGaps.length) passes.push("NO_SOFT_GAPS");

    let decision = ADMISSIBILITY.PASS;

    if (hardBlocks.length) {
      decision = ADMISSIBILITY.HARD_BLOCK;
      state.hardBlockCount += 1;
    } else if (softGaps.length) {
      decision = ADMISSIBILITY.DEGRADED_PASS;
      state.degradedPassCount += 1;
    } else {
      state.passCount += 1;
    }

    const packet = {
      packetId: makeId("admissibility"),
      contract: CONTRACT,
      receipt: RECEIPT,
      objectId: truth.objectId,
      objectClass: truth.objectClass,
      decision,
      hardBlocks,
      softGaps,
      passes,
      admissible: decision === ADMISSIBILITY.PASS || decision === ADMISSIBILITY.DEGRADED_PASS,
      strict: decision === ADMISSIBILITY.PASS,
      degraded: decision === ADMISSIBILITY.DEGRADED_PASS,
      hardBlock: decision === ADMISSIBILITY.HARD_BLOCK,
      firstFailedCoordinate:
        decision === ADMISSIBILITY.HARD_BLOCK
          ? hardBlocks[0]
          : decision === ADMISSIBILITY.DEGRADED_PASS
            ? softGaps[0]
            : "NONE_ADMISSIBILITY_PASS",
      truthPacketId: truth.packetId,
      evaluatedAt: nowIso(),

      worldEngineOwnsAdmissibility: true,
      rendererOwnsAdmissibility: false,
      finalVisualPassClaimed: false
    };

    state.lastAdmissibilityPacket = packet;
    state.firstFailedCoordinate = packet.firstFailedCoordinate;
    state.recommendedNextFile = packet.hardBlock ? FILE : state.recommendedNextFile;
    state.recommendedNextRenewalTarget = state.recommendedNextFile;

    setStage(NEWS.WEST, "F8", ENGINE_PHASES.ADMISSIBILITY_EVALUATED, packet.hardBlock ? 34 : 42, `ADMISSIBILITY_${decision}`);

    record("ADMISSIBILITY_EVALUATED", {
      objectId: packet.objectId,
      decision,
      firstFailedCoordinate: packet.firstFailedCoordinate
    });

    return clonePlain(packet);
  }

  function selectAdapter(backend = "", objectClass = "") {
    const normalizedBackend = normalizeBackend(backend);
    const normalizedClass = normalizeObjectClass(objectClass);

    const adapters = Object.values(state.registeredRendererAdapters)
      .filter((adapter) => adapter && adapter.active)
      .filter((adapter) => normalizedBackend === RENDER_BACKENDS.NULL || adapter.backend === normalizedBackend || adapter.backend === RENDER_BACKENDS.CUSTOM)
      .filter((adapter) => !adapter.supports.length || adapter.supports.includes(normalizedClass) || adapter.supports.includes("*"))
      .sort((a, b) => b.priority - a.priority);

    return adapters[0] || null;
  }

  function compileRenderIntent(input = {}) {
    const truth = input.truthPacket && isObject(input.truthPacket)
      ? input.truthPacket
      : readTruth(input.objectId || state.activeObjectId, input);

    const admissibility = input.admissibility && isObject(input.admissibility)
      ? input.admissibility
      : evaluateAdmissibility(truth, input);

    const requestedBackend = normalizeBackend(input.backend || input.renderBackend || input.renderer || (truth.baseTruth && truth.baseTruth.preferredBackend));
    const adapter = selectAdapter(requestedBackend, truth.objectClass);
    const backend = adapter ? adapter.backend : requestedBackend;

    const renderTarget = input.renderTarget || input.mount || input.target || "#app";

    const intent = {
      intentId: makeId("render-intent"),
      contract: CONTRACT,
      receipt: RECEIPT,
      objectId: truth.objectId,
      objectClass: truth.objectClass,
      truthPacket: clonePlain(truth),
      admissibility: clonePlain(admissibility),
      renderTarget,
      backend,
      requestedBackend,
      adapterId: adapter ? adapter.id : "",
      rendererAvailable: Boolean(adapter),
      renderAllowed: Boolean(admissibility.admissible && !admissibility.hardBlock),
      renderMode: admissibility.strict ? "STRICT" : admissibility.degraded ? "DEGRADED" : "HELD",
      compiledAt: nowIso(),

      worldEngineOwnsIntent: true,
      rendererOwnsExpressionOnly: true,
      rendererMayMutateTruth: false,
      rendererMayClaimF21: false,
      rendererMayClaimFinalVisualPass: false,

      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };

    REQUIRED_RENDER_INTENT_FIELDS.forEach((field) => {
      if (intent[field] === undefined || intent[field] === null) {
        throw new Error(`Render intent missing required field: ${field}`);
      }
    });

    state.lastRenderIntent = intent;
    state.renderIntentCount += 1;
    state.activeObjectId = intent.objectId;
    state.activeObjectClass = intent.objectClass;
    state.activeBackend = intent.backend;
    state.activeAdapterId = intent.adapterId;
    state.activeRenderIntentId = intent.intentId;

    setStage(NEWS.SOUTH, "F13", ENGINE_PHASES.RENDER_INTENT_COMPILED, intent.renderAllowed ? 58 : 46, intent.renderAllowed ? "RENDER_INTENT_COMPILED" : "RENDER_INTENT_HELD");

    record("RENDER_INTENT_COMPILED", {
      intentId: intent.intentId,
      objectId: intent.objectId,
      backend: intent.backend,
      adapterId: intent.adapterId,
      renderAllowed: intent.renderAllowed
    });

    return clonePlain(intent);
  }

  async function submitRenderIntent(input = {}) {
    const intent = input.intentId && input.truthPacket ? input : compileRenderIntent(input);

    if (!intent.renderAllowed) {
      const held = {
        submissionId: makeId("render-held"),
        contract: CONTRACT,
        receipt: RECEIPT,
        accepted: false,
        held: true,
        reason: intent.admissibility.firstFailedCoordinate || "RENDER_INTENT_NOT_ADMISSIBLE",
        intent,
        submittedAt: nowIso(),
        visualPassClaimed: false
      };

      state.lastRenderSubmission = held;
      state.firstFailedCoordinate = held.reason;

      setStage(NEWS.SOUTH, "F13", ENGINE_PHASES.HELD, 52, "RENDER_SUBMISSION_HELD");

      record("RENDER_SUBMISSION_HELD", {
        intentId: intent.intentId,
        reason: held.reason
      });

      return clonePlain(held);
    }

    const adapter = state.registeredRendererAdapters[intent.adapterId] || null;

    if (!adapter || !isFunction(adapter.submit)) {
      const held = {
        submissionId: makeId("render-held"),
        contract: CONTRACT,
        receipt: RECEIPT,
        accepted: false,
        held: true,
        reason: "RENDER_ADAPTER_SUBMIT_UNAVAILABLE",
        intent,
        submittedAt: nowIso(),
        visualPassClaimed: false
      };

      state.lastRenderSubmission = held;
      state.firstFailedCoordinate = held.reason;
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;

      setStage(NEWS.RENDERER, "F13", ENGINE_PHASES.HELD, 54, "RENDER_ADAPTER_UNAVAILABLE");

      record("RENDER_ADAPTER_UNAVAILABLE", {
        intentId: intent.intentId,
        backend: intent.backend,
        adapterId: intent.adapterId
      });

      return clonePlain(held);
    }

    try {
      if (isFunction(adapter.prepare)) {
        await Promise.resolve(adapter.prepare(clonePlain(intent), api));
      }

      const adapterResult = await Promise.resolve(adapter.submit(clonePlain(intent), api));

      const submission = {
        submissionId: makeId("render-submission"),
        contract: CONTRACT,
        receipt: RECEIPT,
        accepted: true,
        held: false,
        intent,
        adapterId: adapter.id,
        backend: adapter.backend,
        adapterResult: clonePlain(adapterResult),
        submittedAt: nowIso(),

        worldEngineSubmittedRenderPacket: true,
        rendererOwnsExpressionOnly: true,
        finalVisualPassClaimed: false,
        visualPassClaimed: false
      };

      state.lastRenderSubmission = submission;
      state.renderSubmissionCount += 1;

      setStage(NEWS.RENDERER, "F13", ENGINE_PHASES.RENDER_PACKET_SUBMITTED, 72, "RENDER_PACKET_SUBMITTED");

      record("RENDER_PACKET_SUBMITTED", {
        submissionId: submission.submissionId,
        intentId: intent.intentId,
        backend: adapter.backend,
        adapterId: adapter.id
      });

      return clonePlain(submission);
    } catch (error) {
      recordError("RENDER_ADAPTER_SUBMIT_FAILED", error, {
        intentId: intent.intentId,
        adapterId: adapter.id,
        backend: adapter.backend
      });

      return {
        submissionId: makeId("render-error"),
        contract: CONTRACT,
        receipt: RECEIPT,
        accepted: false,
        held: true,
        reason: "RENDER_ADAPTER_SUBMIT_FAILED",
        error: error && error.message ? error.message : String(error),
        intent,
        submittedAt: nowIso(),
        visualPassClaimed: false
      };
    }
  }

  function submitEvidence(evidence = {}) {
    const input = isObject(evidence) ? evidence : {};
    const evidenceId = safeString(input.evidenceId || input.id || makeId("evidence"));
    const objectId = safeString(input.objectId || state.activeObjectId);

    const packet = {
      evidenceId,
      contract: CONTRACT,
      receipt: RECEIPT,
      objectId,
      adapterId: safeString(input.adapterId || state.activeAdapterId),
      backend: normalizeBackend(input.backend || state.activeBackend),
      renderIntentId: safeString(input.renderIntentId || state.activeRenderIntentId),
      evidenceClass: safeString(input.evidenceClass || "RENDER_EVIDENCE"),
      strict: safeBool(input.strict, false),
      degraded: safeBool(input.degraded, false),
      hardFail: safeBool(input.hardFail, false),
      visible: safeBool(input.visible, false),
      current: safeBool(input.current, true),
      stale: safeBool(input.stale, false),
      metrics: isObject(input.metrics) ? clonePlain(input.metrics) : {},
      sourceReceipt: isObject(input.sourceReceipt) ? clonePlain(input.sourceReceipt) : {},
      submittedAt: nowIso(),

      evidenceDoesNotClaimFinalVisualPass: true,
      f21Claimed: false,
      visualPassClaimed: false
    };

    state.registeredEvidence[evidenceId] = packet;
    state.lastRenderEvidence = packet;
    state.evidenceCount += 1;

    if (packet.hardFail) {
      state.firstFailedCoordinate = "RENDER_EVIDENCE_HARD_FAIL";
      setStage(NEWS.GAUGES, "F13", ENGINE_PHASES.RENDER_EVIDENCE_OBSERVED, 74, "RENDER_EVIDENCE_HARD_FAIL");
    } else if (packet.strict) {
      state.firstFailedCoordinate = "NONE_RENDER_EVIDENCE_STRICT";
      setStage(NEWS.GAUGES, "F21", ENGINE_PHASES.RENDER_EVIDENCE_OBSERVED, 86, "RENDER_EVIDENCE_STRICT_OBSERVED");
    } else if (packet.degraded || packet.visible) {
      state.firstFailedCoordinate = "RENDER_EVIDENCE_DEGRADED_OR_VISIBLE";
      setStage(NEWS.GAUGES, "F21", ENGINE_PHASES.RENDER_EVIDENCE_OBSERVED, 80, "RENDER_EVIDENCE_DEGRADED_OBSERVED");
    } else {
      state.firstFailedCoordinate = "WAITING_RENDER_EVIDENCE";
      setStage(NEWS.GAUGES, "F13", ENGINE_PHASES.RENDER_EVIDENCE_OBSERVED, 76, "WAITING_RENDER_EVIDENCE");
    }

    record("RENDER_EVIDENCE_SUBMITTED", {
      evidenceId,
      objectId,
      strict: packet.strict,
      degraded: packet.degraded,
      hardFail: packet.hardFail,
      visible: packet.visible
    });

    return clonePlain(packet);
  }

  function composeReturnPacket(input = {}) {
    const packet = {
      packetId: makeId("return"),
      contract: CONTRACT,
      receipt: RECEIPT,
      source: "DIAMOND_GATE_WORLD_ENGINE",
      target: safeString(input.target || "NORTH"),
      activeNews: state.activeNews,
      activeFibonacci: state.activeFibonacci,
      activeFibonacciRank: state.activeFibonacciRank,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,

      objectId: state.activeObjectId,
      objectClass: state.activeObjectClass,
      backend: state.activeBackend,
      adapterId: state.activeAdapterId,
      renderIntentId: state.activeRenderIntentId,

      truthPacketAvailable: Boolean(state.lastTruthPacket),
      admissibilityPacketAvailable: Boolean(state.lastAdmissibilityPacket),
      renderIntentAvailable: Boolean(state.lastRenderIntent),
      renderSubmissionAvailable: Boolean(state.lastRenderSubmission),
      renderEvidenceAvailable: Boolean(state.lastRenderEvidence),

      lastTruthPacket: clonePlain(state.lastTruthPacket),
      lastAdmissibilityPacket: clonePlain(state.lastAdmissibilityPacket),
      lastRenderIntent: clonePlain(state.lastRenderIntent),
      lastRenderSubmission: clonePlain(state.lastRenderSubmission),
      lastRenderEvidence: clonePlain(state.lastRenderEvidence),

      worldEngineOwnsTruth: true,
      rendererOwnsExpressionOnly: true,
      gaugesOwnMeasurement: true,
      northOwnsFinalLatch: true,

      f21EligibleForNorth: Boolean(state.lastRenderEvidence && (state.lastRenderEvidence.strict || state.lastRenderEvidence.degraded) && !state.lastRenderEvidence.hardFail),
      f21SubmittedToNorth: false,
      f21ClaimedByWorldEngine: false,
      readyTextClaimedByWorldEngine: false,
      finalVisualPassClaimed: false,
      visualPassClaimed: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      composedAt: nowIso()
    };

    state.lastReturnPacket = packet;

    setStage(NEWS.NORTH, "F21", ENGINE_PHASES.RETURN_PACKET_COMPOSED, packet.f21EligibleForNorth ? 92 : 82, "RETURN_PACKET_COMPOSED");

    record("RETURN_PACKET_COMPOSED", {
      packetId: packet.packetId,
      objectId: packet.objectId,
      f21EligibleForNorth: packet.f21EligibleForNorth,
      firstFailedCoordinate: packet.firstFailedCoordinate
    });

    return clonePlain(packet);
  }

  async function run(input = {}) {
    try {
      const objectPacket = input.objectPacket ? registerObjectPacket(input.objectPacket) : null;
      const objectId = safeString(input.objectId || (objectPacket && objectPacket.objectId) || state.activeObjectId);

      const truth = readTruth(objectId, input);
      const admissibility = evaluateAdmissibility(truth, input);
      const intent = compileRenderIntent({
        ...input,
        objectId,
        truthPacket: truth,
        admissibility
      });

      const submission = await submitRenderIntent(intent);

      if (submission.accepted && input.autoEvidence !== false) {
        const adapter = state.registeredRendererAdapters[submission.adapterId] || null;

        if (adapter && isFunction(adapter.readEvidence)) {
          try {
            const evidence = await Promise.resolve(adapter.readEvidence(clonePlain(submission), api));
            if (isObject(evidence)) {
              submitEvidence({
                ...evidence,
                objectId,
                adapterId: submission.adapterId,
                backend: submission.backend,
                renderIntentId: intent.intentId
              });
            }
          } catch (error) {
            recordError("RENDER_ADAPTER_EVIDENCE_READ_FAILED", error, {
              adapterId: submission.adapterId,
              backend: submission.backend
            });
          }
        }
      }

      return composeReturnPacket({
        target: input.returnTarget || "NORTH"
      });
    } catch (error) {
      recordError("WORLD_ENGINE_RUN_FAILED", error, input);
      return composeReturnPacket({
        target: input.returnTarget || "NORTH"
      });
    }
  }

  function createNullRendererAdapter() {
    return {
      id: "null-renderer-adapter",
      label: "Null Renderer Adapter",
      backend: RENDER_BACKENDS.NULL,
      priority: -999,
      supports: ["*"],
      prepare(intent) {
        return {
          prepared: true,
          intentId: intent.intentId,
          nullRenderer: true
        };
      },
      submit(intent) {
        return {
          submitted: true,
          rendered: false,
          intentId: intent.intentId,
          nullRenderer: true,
          reason: "No visual renderer selected. World engine compiled packet only.",
          visualPassClaimed: false
        };
      },
      readEvidence(submission) {
        return {
          evidenceClass: "NULL_RENDERER_EVIDENCE",
          strict: false,
          degraded: true,
          visible: false,
          current: true,
          stale: false,
          metrics: {
            packetCompiled: true,
            rendererExecuted: false,
            expressionDelegated: true
          },
          sourceReceipt: submission,
          visualPassClaimed: false
        };
      },
      getReceipt() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          adapterId: "null-renderer-adapter",
          backend: RENDER_BACKENDS.NULL,
          active: true,
          visualPassClaimed: false
        };
      }
    };
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const dataset = doc.documentElement.dataset;

    dataset.diamondGateWorldEngineLoaded = "true";
    dataset.diamondGateWorldEngineContract = CONTRACT;
    dataset.diamondGateWorldEngineReceipt = RECEIPT;
    dataset.diamondGateWorldEngineVersion = VERSION;
    dataset.diamondGateWorldEngineFile = FILE;

    dataset.worldEngineActive = String(state.worldEngineActive);
    dataset.supervisoryEngineActive = String(state.supervisoryEngineActive);
    dataset.renderEngineOwnedExternally = "true";
    dataset.rendererAdaptersDelegated = "true";

    dataset.worldEngineOwnsWorldTruth = "true";
    dataset.worldEngineOwnsAdmissibility = "true";
    dataset.worldEngineOwnsRuntimeOrder = "true";
    dataset.worldEngineOwnsRenderIntentCompilation = "true";
    dataset.worldEngineOwnsEvidenceReceipt = "true";
    dataset.worldEngineOwnsRendererSelection = "true";

    dataset.worldEngineOwnsCanvasDrawing = "false";
    dataset.worldEngineOwnsWebgpuDrawing = "false";
    dataset.worldEngineOwnsThreeDrawing = "false";
    dataset.worldEngineOwnsUnityDrawing = "false";
    dataset.worldEngineOwnsUnrealDrawing = "false";
    dataset.worldEngineOwnsFinalVisualPassClaim = "false";

    dataset.worldEngineNewsAlignmentActive = "true";
    dataset.worldEngineFibonacciSynchronizationActive = "true";
    dataset.worldEngineOneActiveGearAtATime = "true";

    dataset.worldEngineActiveNews = state.activeNews;
    dataset.worldEngineActiveFibonacci = state.activeFibonacci;
    dataset.worldEngineActiveFibonacciRank = String(state.activeFibonacciRank);
    dataset.worldEngineActiveStageId = state.activeStageId;
    dataset.worldEngineActiveGearId = state.activeGearId;
    dataset.worldEngineActiveProgress = String(state.activeProgress);

    dataset.worldEngineActiveObjectId = state.activeObjectId;
    dataset.worldEngineActiveObjectClass = state.activeObjectClass;
    dataset.worldEngineActiveBackend = state.activeBackend;
    dataset.worldEngineActiveAdapterId = state.activeAdapterId;
    dataset.worldEngineActiveRenderIntentId = state.activeRenderIntentId;

    dataset.worldEngineTruthProviderCount = String(Object.keys(state.registeredTruthProviders).length);
    dataset.worldEngineRendererAdapterCount = String(Object.keys(state.registeredRendererAdapters).length);
    dataset.worldEngineObjectPacketCount = String(Object.keys(state.registeredObjectPackets).length);
    dataset.worldEngineEvidenceCount = String(state.evidenceCount);
    dataset.worldEngineRenderIntentCount = String(state.renderIntentCount);
    dataset.worldEngineRenderSubmissionCount = String(state.renderSubmissionCount);

    dataset.worldEngineFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.worldEngineRecommendedNextFile = state.recommendedNextFile;
    dataset.worldEngineRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;
    dataset.worldEnginePostgameStatus = state.postgameStatus;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.webgpu = "false";
    dataset.visualPassClaimed = "false";
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,

      role: state.role,
      engineLayer: state.engineLayer,
      runtimeMode: state.runtimeMode,

      worldEngineActive: state.worldEngineActive,
      supervisoryEngineActive: state.supervisoryEngineActive,
      renderEngineOwnedExternally: true,
      rendererAdaptersDelegated: true,

      ownsWorldTruth: true,
      ownsAdmissibility: true,
      ownsRuntimeOrder: true,
      ownsRenderIntentCompilation: true,
      ownsEvidenceReceipt: true,
      ownsRendererSelection: true,

      ownsCanvasDrawing: false,
      ownsWebGPUDrawing: false,
      ownsThreeDrawing: false,
      ownsUnityDrawing: false,
      ownsUnrealDrawing: false,
      ownsFinalVisualPassClaim: false,

      newsAlignmentActive: true,
      fibonacciSynchronizationActive: true,
      oneActiveGearAtATime: true,

      activeNews: state.activeNews,
      activeFibonacci: state.activeFibonacci,
      activeFibonacciRank: state.activeFibonacciRank,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeProgress: state.activeProgress,

      registeredTruthProviderIds: Object.keys(state.registeredTruthProviders),
      registeredRendererAdapterIds: Object.keys(state.registeredRendererAdapters),
      registeredObjectIds: Object.keys(state.registeredObjectPackets),

      activeObjectId: state.activeObjectId,
      activeObjectClass: state.activeObjectClass,
      activeBackend: state.activeBackend,
      activeAdapterId: state.activeAdapterId,
      activeRenderIntentId: state.activeRenderIntentId,

      lastTruthPacket: clonePlain(state.lastTruthPacket),
      lastAdmissibilityPacket: clonePlain(state.lastAdmissibilityPacket),
      lastRenderIntent: clonePlain(state.lastRenderIntent),
      lastRenderSubmission: clonePlain(state.lastRenderSubmission),
      lastRenderEvidence: clonePlain(state.lastRenderEvidence),
      lastReturnPacket: clonePlain(state.lastReturnPacket),

      renderIntentCount: state.renderIntentCount,
      renderSubmissionCount: state.renderSubmissionCount,
      evidenceCount: state.evidenceCount,
      hardBlockCount: state.hardBlockCount,
      degradedPassCount: state.degradedPassCount,
      passCount: state.passCount,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      webGPU: false,
      unityRuntimeClaimed: false,
      unrealRuntimeClaimed: false,
      visualPassClaimed: false,

      startedAt: state.startedAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    return [
      "DIAMOND_GATE_WORLD_ENGINE_META_LAYER_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      `engineLayer=${r.engineLayer}`,
      `runtimeMode=${r.runtimeMode}`,
      "",
      "OWNERSHIP",
      `worldEngineActive=${r.worldEngineActive}`,
      `supervisoryEngineActive=${r.supervisoryEngineActive}`,
      `renderEngineOwnedExternally=${r.renderEngineOwnedExternally}`,
      `rendererAdaptersDelegated=${r.rendererAdaptersDelegated}`,
      `ownsWorldTruth=${r.ownsWorldTruth}`,
      `ownsAdmissibility=${r.ownsAdmissibility}`,
      `ownsRuntimeOrder=${r.ownsRuntimeOrder}`,
      `ownsRenderIntentCompilation=${r.ownsRenderIntentCompilation}`,
      `ownsEvidenceReceipt=${r.ownsEvidenceReceipt}`,
      `ownsRendererSelection=${r.ownsRendererSelection}`,
      `ownsCanvasDrawing=${r.ownsCanvasDrawing}`,
      `ownsWebGPUDrawing=${r.ownsWebGPUDrawing}`,
      `ownsThreeDrawing=${r.ownsThreeDrawing}`,
      `ownsUnityDrawing=${r.ownsUnityDrawing}`,
      `ownsUnrealDrawing=${r.ownsUnrealDrawing}`,
      `ownsFinalVisualPassClaim=${r.ownsFinalVisualPassClaim}`,
      "",
      "NEWS_FIBONACCI",
      `newsAlignmentActive=${r.newsAlignmentActive}`,
      `fibonacciSynchronizationActive=${r.fibonacciSynchronizationActive}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `activeNews=${r.activeNews}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `activeStageId=${r.activeStageId}`,
      `activeGearId=${r.activeGearId}`,
      `activeProgress=${r.activeProgress}`,
      "",
      "REGISTRY",
      `registeredTruthProviderIds=${r.registeredTruthProviderIds.join(",")}`,
      `registeredRendererAdapterIds=${r.registeredRendererAdapterIds.join(",")}`,
      `registeredObjectIds=${r.registeredObjectIds.join(",")}`,
      "",
      "ACTIVE_OBJECT",
      `activeObjectId=${r.activeObjectId}`,
      `activeObjectClass=${r.activeObjectClass}`,
      `activeBackend=${r.activeBackend}`,
      `activeAdapterId=${r.activeAdapterId}`,
      `activeRenderIntentId=${r.activeRenderIntentId}`,
      "",
      "COUNTS",
      `renderIntentCount=${r.renderIntentCount}`,
      `renderSubmissionCount=${r.renderSubmissionCount}`,
      `evidenceCount=${r.evidenceCount}`,
      `hardBlockCount=${r.hardBlockCount}`,
      `degradedPassCount=${r.degradedPassCount}`,
      `passCount=${r.passCount}`,
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

    root.DIAMOND_GATE.worldEngine = api;
    root.DIAMOND_GATE.metaEngine = api;
    root.DIAMOND_GATE.engineAboveEngines = api;

    root.DEXTER_LAB.diamondGateWorldEngine = api;
    root.DEXTER_LAB.engineAboveEngines = api;

    root.DIAMOND_GATE_WORLD_ENGINE = api;
    root.DIAMOND_GATE_META_ENGINE = api;
    root.DIAMOND_GATE_ENGINE_ABOVE_ENGINES = api;
    root.DIAMOND_GATE_WORLD_ENGINE_RECEIPT = getReceipt();

    updateDataset();
  }

  function boot() {
    if (state.startedAt) return getReceipt();

    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;

    registerRendererAdapter(createNullRendererAdapter());

    setStage(NEWS.NORTH, "F1", ENGINE_PHASES.CREATED, 4, "WORLD_ENGINE_BOOTED");

    record("DIAMOND_GATE_WORLD_ENGINE_BOOTED", {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      nullRendererRegistered: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });

    publishGlobals();

    return getReceipt();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,

    NEWS,
    FIBONACCI,
    ENGINE_PHASES,
    ADMISSIBILITY,
    OBJECT_CLASSES,
    RENDER_BACKENDS,

    boot,
    start: boot,
    init: boot,
    run,

    map256ToEngine,
    registerTruthProvider,
    registerRendererAdapter,
    registerObjectPacket,
    readTruth,
    evaluateAdmissibility,
    selectAdapter,
    compileRenderIntent,
    submitRenderIntent,
    submitEvidence,
    composeReturnPacket,

    getReceipt,
    getReceiptText,

    worldEngineActive: true,
    supervisoryEngineActive: true,
    engineLayer: "above-renderers",

    ownsWorldTruth: true,
    ownsAdmissibility: true,
    ownsRuntimeOrder: true,
    ownsRenderIntentCompilation: true,
    ownsEvidenceReceipt: true,
    ownsRendererSelection: true,

    ownsCanvasDrawing: false,
    ownsWebGPUDrawing: false,
    ownsThreeDrawing: false,
    ownsUnityDrawing: false,
    ownsUnrealDrawing: false,
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
