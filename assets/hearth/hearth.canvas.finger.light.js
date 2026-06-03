// /assets/hearth/hearth.canvas.finger.light.js
// HEARTH_CANVAS_FINGER_LIGHT_FOUR_CHANNEL_VISIBILITY_TNT_v1
// Full-file replacement.
// Canvas Finger 4 / Light / Four-Channel Visibility.
// Purpose:
// - Establish the fourth downstream Canvas finger for Hearth.
// - Consume Boundary, Mass, and Surface Finger evidence when available.
// - Carry four internal light sub-fingers/channels:
//   1. key-light
//   2. rim-atmosphere
//   3. terminator-shadow
//   4. surface-readability
// - Publish a Light Finger packet into the Canvas Expression Hub when a clear hub intake method exists.
// - Improve base-globe readability without claiming final visual pass.
// - Preserve diagnostic bridge, route conductor, parent hub, and upstream finger boundaries.
// - Do not mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, Boundary Finger, Mass Finger, or Surface Finger.
// - Do not claim final terrain truth, hydrology truth, material truth, elevation truth, F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_LIGHT_FOUR_CHANNEL_VISIBILITY_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_LIGHT_FOUR_CHANNEL_VISIBILITY_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_LIGHT_FOUR_CHANNEL_VISIBILITY_PACKET_v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const NEXT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const FINGER_NAME = "light";
  const FINGER_ROLE = "four-channel-visibility";
  const FINGER_ORDER = 4;
  const FINGER_STRETCH_TOTAL = 5;

  const LIGHT_CHANNELS = Object.freeze([
    Object.freeze({
      order: 1,
      name: "key-light",
      role: "primary directional illumination across the base globe"
    }),
    Object.freeze({
      order: 2,
      name: "rim-atmosphere",
      role: "edge glow, atmosphere-shell readability, spherical boundary lift"
    }),
    Object.freeze({
      order: 3,
      name: "terminator-shadow",
      role: "dark-side falloff, curvature, depth separation"
    }),
    Object.freeze({
      order: 4,
      name: "surface-readability",
      role: "soft highlights over mass and surface structure for inspection"
    })
  ]);

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f21Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextClaimed: false,
    readyTextAllowed: false,
    readyTextClaimedByCanvasParent: false,
    terrainTruthClaimed: false,
    hydrologyTruthClaimed: false,
    materialTruthClaimed: false,
    elevationTruthClaimed: false,
    biomeTruthClaimed: false,
    atmosphereTruthClaimed: false,
    finalVisualPassClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const FINGER_STRETCH_REGISTRY = Object.freeze([
    Object.freeze({
      order: 1,
      name: "boundary",
      file: BOUNDARY_FILE,
      role: "base globe containment, visible body edge, boundary envelope"
    }),
    Object.freeze({
      order: 2,
      name: "mass",
      file: MASS_FILE,
      role: "physical body mass, broad body structure, early land/body support"
    }),
    Object.freeze({
      order: 3,
      name: "surface",
      file: SURFACE_FILE,
      role: "first surface and material differentiation"
    }),
    Object.freeze({
      order: 4,
      name: "light",
      file: FILE,
      role: "four-channel visibility and inspection lighting"
    }),
    Object.freeze({
      order: 5,
      name: "inspect",
      file: INSPECT_FILE,
      role: "expression-finger inspection receipt without diagnostic rail takeover"
    })
  ]);

  const HUB_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasExpressionHub",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_EXPRESSION_HUB"
  ]);

  const HUB_INTAKE_METHODS = Object.freeze([
    "receiveFingerPacket",
    "receiveCanvasFingerPacket",
    "receiveLightFingerPacket",
    "registerCanvasFinger",
    "registerExpressionFinger",
    "receiveExpressionPacket",
    "receiveChildPacket"
  ]);

  const BOUNDARY_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerBoundary",
    "HEARTH.canvasBoundaryFinger",
    "HEARTH_CANVAS_FINGER_BOUNDARY",
    "HEARTH_CANVAS_BOUNDARY_FINGER"
  ]);

  const MASS_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerMass",
    "HEARTH.canvasMassFinger",
    "HEARTH_CANVAS_FINGER_MASS",
    "HEARTH_CANVAS_MASS_FINGER"
  ]);

  const SURFACE_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasSurfaceFinger",
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_SURFACE_FINGER"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const state = {
    timestamp: "",
    updatedAt: "",
    publishedAt: "",

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,

    boundaryFile: BOUNDARY_FILE,
    massFile: MASS_FILE,
    surfaceFile: SURFACE_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,

    lightFingerLoaded: true,
    lightFingerActive: true,
    fourChannelVisibilityActive: true,
    lightSubFingerCount: 4,
    keyLightChannelActive: true,
    rimAtmosphereChannelActive: true,
    terminatorShadowChannelActive: true,
    surfaceReadabilityChannelActive: true,

    boundaryDependencyExpected: true,
    boundaryDependencyObserved: false,
    boundaryPacketObserved: false,
    boundaryModelObserved: false,

    massDependencyExpected: true,
    massDependencyObserved: false,
    massPacketObserved: false,
    massModelObserved: false,

    surfaceDependencyExpected: true,
    surfaceDependencyObserved: false,
    surfacePacketObserved: false,
    surfaceModelObserved: false,

    lightModelReady: false,
    keyLightReady: false,
    rimAtmosphereReady: false,
    terminatorShadowReady: false,
    surfaceReadabilityReady: false,
    lightPacketReady: false,
    visibleContributionAvailable: false,

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",

    firstFailedCoordinate: "LIGHT_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "LIGHT_FINGER_WAITING_BOOT",

    boundaryPacket: null,
    boundaryModel: null,
    massPacket: null,
    massModel: null,
    surfacePacket: null,
    surfaceModel: null,
    lightModel: null,
    lightPacket: null,
    lastRegistrationResponse: null,
    localEvents: [],
    errors: [],

    booted: false,
    mounted: false,

    ...FINAL_FALSE
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return String(Date.now());
    }
  }

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
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

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "LIGHT_FINGER_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 120);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "LIGHT_FINGER_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 80);
    state.updatedAt = item.at;
    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function findSource(sourceNames) {
    for (const sourceName of sourceNames) {
      const candidate = readPath(sourceName);
      if (candidate && isObject(candidate)) {
        return { source: candidate, sourceName };
      }
    }

    return { source: null, sourceName: "NONE" };
  }

  function readBoundaryEvidence() {
    const found = findSource(BOUNDARY_SOURCE_NAMES);

    state.boundaryDependencyObserved = Boolean(found.source);

    if (!found.source) {
      state.boundaryPacketObserved = false;
      state.boundaryModelObserved = false;
      state.boundaryPacket = null;
      state.boundaryModel = null;

      return {
        observed: false,
        sourceName: "NONE",
        packet: null,
        model: null
      };
    }

    let packet = null;
    let receipt = null;

    try {
      if (isFunction(found.source.getBoundaryPacket)) {
        packet = found.source.getBoundaryPacket();
      } else if (isFunction(found.source.getReceipt)) {
        receipt = found.source.getReceipt();
        packet = receipt && receipt.boundaryPacket ? receipt.boundaryPacket : null;
      } else if (isFunction(found.source.getReceiptLight)) {
        receipt = found.source.getReceiptLight();
      }
    } catch (error) {
      recordError("LIGHT_FINGER_BOUNDARY_READ_FAILED", error, {
        sourceName: found.sourceName
      });
    }

    const model = packet && packet.boundaryModel
      ? packet.boundaryModel
      : receipt && receipt.boundaryModel
        ? receipt.boundaryModel
        : null;

    state.boundaryPacketObserved = Boolean(packet);
    state.boundaryModelObserved = Boolean(model);
    state.boundaryPacket = clonePlain(packet);
    state.boundaryModel = clonePlain(model);

    return {
      observed: true,
      sourceName: found.sourceName,
      packet: clonePlain(packet),
      model: clonePlain(model)
    };
  }

  function readMassEvidence() {
    const found = findSource(MASS_SOURCE_NAMES);

    state.massDependencyObserved = Boolean(found.source);

    if (!found.source) {
      state.massPacketObserved = false;
      state.massModelObserved = false;
      state.massPacket = null;
      state.massModel = null;

      return {
        observed: false,
        sourceName: "NONE",
        packet: null,
        model: null
      };
    }

    let packet = null;
    let receipt = null;

    try {
      if (isFunction(found.source.getMassPacket)) {
        packet = found.source.getMassPacket();
      } else if (isFunction(found.source.getReceipt)) {
        receipt = found.source.getReceipt();
        packet = receipt && receipt.massPacket ? receipt.massPacket : null;
      } else if (isFunction(found.source.getReceiptLight)) {
        receipt = found.source.getReceiptLight();
      }
    } catch (error) {
      recordError("LIGHT_FINGER_MASS_READ_FAILED", error, {
        sourceName: found.sourceName
      });
    }

    const model = packet && packet.massModel
      ? packet.massModel
      : receipt && receipt.massModel
        ? receipt.massModel
        : null;

    state.massPacketObserved = Boolean(packet);
    state.massModelObserved = Boolean(model);
    state.massPacket = clonePlain(packet);
    state.massModel = clonePlain(model);

    return {
      observed: true,
      sourceName: found.sourceName,
      packet: clonePlain(packet),
      model: clonePlain(model)
    };
  }

  function readSurfaceEvidence() {
    const found = findSource(SURFACE_SOURCE_NAMES);

    state.surfaceDependencyObserved = Boolean(found.source);

    if (!found.source) {
      state.surfacePacketObserved = false;
      state.surfaceModelObserved = false;
      state.surfacePacket = null;
      state.surfaceModel = null;

      return {
        observed: false,
        sourceName: "NONE",
        packet: null,
        model: null
      };
    }

    let packet = null;
    let receipt = null;

    try {
      if (isFunction(found.source.getSurfacePacket)) {
        packet = found.source.getSurfacePacket();
      } else if (isFunction(found.source.getReceipt)) {
        receipt = found.source.getReceipt();
        packet = receipt && receipt.surfacePacket ? receipt.surfacePacket : null;
      } else if (isFunction(found.source.getReceiptLight)) {
        receipt = found.source.getReceiptLight();
      }
    } catch (error) {
      recordError("LIGHT_FINGER_SURFACE_READ_FAILED", error, {
        sourceName: found.sourceName
      });
    }

    const model = packet && packet.surfaceModel
      ? packet.surfaceModel
      : receipt && receipt.surfaceModel
        ? receipt.surfaceModel
        : null;

    state.surfacePacketObserved = Boolean(packet);
    state.surfaceModelObserved = Boolean(model);
    state.surfacePacket = clonePlain(packet);
    state.surfaceModel = clonePlain(model);

    return {
      observed: true,
      sourceName: found.sourceName,
      packet: clonePlain(packet),
      model: clonePlain(model)
    };
  }

  function defaultBoundaryModel() {
    return {
      modelType: "HEARTH_BASE_GLOBE_BOUNDARY_MODEL_FALLBACK_FOR_LIGHT_FINGER",
      centerX: 0.5,
      centerY: 0.5,
      radius: 0.47,
      innerRadius: 0.427,
      outerRadius: 0.486,
      edgeSoftness: 0.055,
      fallbackUsed: true,
      finalGeometryClaim: false,
      finalVisualClaim: false
    };
  }

  function defaultMassModel(boundaryModel) {
    const b = boundaryModel || defaultBoundaryModel();

    return {
      modelType: "HEARTH_BASE_GLOBE_MASS_MODEL_FALLBACK_FOR_LIGHT_FINGER",
      centerX: safeNumber(b.centerX, 0.5),
      centerY: safeNumber(b.centerY, 0.5),
      radius: safeNumber(b.radius, 0.47),
      massAnchors: [
        { id: "LIGHT_FALLBACK_NW", x: 0.35, y: 0.39, scale: 0.22, weight: 0.7 },
        { id: "LIGHT_FALLBACK_C", x: 0.5, y: 0.52, scale: 0.25, weight: 0.8 },
        { id: "LIGHT_FALLBACK_SE", x: 0.61, y: 0.64, scale: 0.2, weight: 0.62 }
      ],
      fallbackUsed: true,
      terrainTruthClaim: false,
      materialTruthClaim: false,
      elevationTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function defaultSurfaceModel(boundaryModel, massModel) {
    const b = boundaryModel || defaultBoundaryModel();
    const m = massModel || defaultMassModel(b);

    return {
      modelType: "HEARTH_BASE_GLOBE_SURFACE_MODEL_FALLBACK_FOR_LIGHT_FINGER",
      centerX: safeNumber(m.centerX, safeNumber(b.centerX, 0.5)),
      centerY: safeNumber(m.centerY, safeNumber(b.centerY, 0.5)),
      radius: safeNumber(m.radius, safeNumber(b.radius, 0.47)),
      surfaceSeeds: [
        { id: "LIGHT_SURFACE_FALLBACK_NW", x: 0.35, y: 0.39, scale: 0.17, value: 0.72 },
        { id: "LIGHT_SURFACE_FALLBACK_C", x: 0.5, y: 0.52, scale: 0.22, value: 0.82 },
        { id: "LIGHT_SURFACE_FALLBACK_SE", x: 0.61, y: 0.64, scale: 0.15, value: 0.58 }
      ],
      fallbackUsed: true,
      terrainTruthClaim: false,
      hydrologyTruthClaim: false,
      materialTruthClaim: false,
      elevationTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function buildLightModel(options = {}) {
    const boundaryEvidence = readBoundaryEvidence();
    const massEvidence = readMassEvidence();
    const surfaceEvidence = readSurfaceEvidence();

    const boundaryModel = boundaryEvidence.model || defaultBoundaryModel();
    const massModel = massEvidence.model || defaultMassModel(boundaryModel);
    const surfaceModel = surfaceEvidence.model || defaultSurfaceModel(boundaryModel, massModel);

    const centerX = clamp(options.centerX ?? surfaceModel.centerX ?? massModel.centerX ?? boundaryModel.centerX ?? 0.5, 0, 1);
    const centerY = clamp(options.centerY ?? surfaceModel.centerY ?? massModel.centerY ?? boundaryModel.centerY ?? 0.5, 0, 1);
    const radius = clamp(options.radius ?? surfaceModel.radius ?? massModel.radius ?? boundaryModel.radius ?? 0.47, 0.05, 0.5);

    const keyVector = {
      x: clamp(options.keyLightX ?? -0.42, -1, 1),
      y: clamp(options.keyLightY ?? -0.56, -1, 1),
      z: clamp(options.keyLightZ ?? 0.72, 0.05, 1)
    };

    const model = {
      modelType: "HEARTH_BASE_GLOBE_LIGHT_MODEL",
      centerX,
      centerY,
      radius,

      boundaryModel: clonePlain(boundaryModel),
      massModel: clonePlain(massModel),
      surfaceModel: clonePlain(surfaceModel),

      boundaryDependencyObserved: boundaryEvidence.observed,
      boundaryPacketObserved: Boolean(boundaryEvidence.packet),
      boundaryModelObserved: Boolean(boundaryEvidence.model),

      massDependencyObserved: massEvidence.observed,
      massPacketObserved: Boolean(massEvidence.packet),
      massModelObserved: Boolean(massEvidence.model),

      surfaceDependencyObserved: surfaceEvidence.observed,
      surfacePacketObserved: Boolean(surfaceEvidence.packet),
      surfaceModelObserved: Boolean(surfaceEvidence.model),

      lightChannels: clonePlain(LIGHT_CHANNELS),
      keyVector,

      keyLight: {
        channel: "key-light",
        active: true,
        vector: clonePlain(keyVector),
        intensity: clamp(options.keyIntensity ?? 0.72, 0, 1),
        ownsFinalLightingTruth: false
      },

      rimAtmosphere: {
        channel: "rim-atmosphere",
        active: true,
        intensity: clamp(options.rimIntensity ?? 0.58, 0, 1),
        thickness: clamp(options.rimThickness ?? 0.16, 0.01, 0.5),
        ownsAtmosphereTruth: false
      },

      terminatorShadow: {
        channel: "terminator-shadow",
        active: true,
        intensity: clamp(options.shadowIntensity ?? 0.54, 0, 1),
        falloff: clamp(options.shadowFalloff ?? 0.72, 0.01, 2),
        ownsFinalShadowTruth: false
      },

      surfaceReadability: {
        channel: "surface-readability",
        active: true,
        intensity: clamp(options.readabilityIntensity ?? 0.44, 0, 1),
        dependsOnSurfaceFinger: true,
        ownsMaterialTruth: false
      },

      projection: "front-facing-base-globe",
      lightCoordinateSpace: "normalized-0-to-1",

      terrainTruthClaim: false,
      hydrologyTruthClaim: false,
      materialTruthClaim: false,
      elevationTruthClaim: false,
      atmosphereTruthClaim: false,
      finalGeometryClaim: false,
      finalVisualClaim: false
    };

    state.lightModel = clonePlain(model);
    state.lightModelReady = true;
    state.keyLightReady = true;
    state.rimAtmosphereReady = true;
    state.terminatorShadowReady = true;
    state.surfaceReadabilityReady = true;
    state.visibleContributionAvailable = true;

    return model;
  }

  function normalizePoint(x, y, width, height) {
    let nx = safeNumber(x, 0);
    let ny = safeNumber(y, 0);

    const w = safeNumber(width, 0);
    const h = safeNumber(height, 0);

    if ((nx > 1 || ny > 1) && w > 0 && h > 0) {
      nx = nx / w;
      ny = ny / h;
    }

    return {
      x: clamp(nx, 0, 1),
      y: clamp(ny, 0, 1)
    };
  }

  function sampleBoundaryContainment(point, model) {
    const boundary = model && model.boundaryModel ? model.boundaryModel : defaultBoundaryModel();
    const dx = point.x - safeNumber(boundary.centerX, 0.5);
    const dy = point.y - safeNumber(boundary.centerY, 0.5);
    const distance = Math.sqrt((dx * dx) + (dy * dy));
    const radius = safeNumber(boundary.radius, 0.47);
    const outerRadius = safeNumber(boundary.outerRadius, radius * 1.035);

    if (distance <= radius) return 1;
    if (distance >= outerRadius) return 0;

    const span = Math.max(0.0001, outerRadius - radius);
    return clamp(1 - ((distance - radius) / span), 0, 1);
  }

  function sampleSurfaceInfluence(point, model) {
    const surfaceModel = model && model.surfaceModel
      ? model.surfaceModel
      : defaultSurfaceModel(model && model.boundaryModel, model && model.massModel);

    const seeds = Array.isArray(surfaceModel.surfaceSeeds) ? surfaceModel.surfaceSeeds : [];
    const radius = safeNumber(surfaceModel.radius, 0.47);

    let value = 0;

    for (const seed of seeds) {
      const dx = point.x - safeNumber(seed.x, 0.5);
      const dy = point.y - safeNumber(seed.y, 0.5);
      const d = Math.sqrt((dx * dx) + (dy * dy));
      const scale = Math.max(0.0001, safeNumber(seed.scale, 0.16) * radius);
      value += Math.exp(-((d * d) / (2 * scale * scale))) * safeNumber(seed.value, 0.5);
    }

    return clamp(value, 0, 1);
  }

  function sampleLightValue(point, model) {
    const containment = sampleBoundaryContainment(point, model);
    const surfaceInfluence = sampleSurfaceInfluence(point, model);

    const cx = safeNumber(model.centerX, 0.5);
    const cy = safeNumber(model.centerY, 0.5);
    const radius = safeNumber(model.radius, 0.47);

    const dx = (point.x - cx) / Math.max(0.0001, radius);
    const dy = (point.y - cy) / Math.max(0.0001, radius);
    const r2 = dx * dx + dy * dy;
    const z = r2 <= 1 ? Math.sqrt(1 - r2) : 0;

    const key = model.keyVector || { x: -0.42, y: -0.56, z: 0.72 };
    const keyMagnitude = Math.sqrt((key.x * key.x) + (key.y * key.y) + (key.z * key.z)) || 1;
    const lx = key.x / keyMagnitude;
    const ly = key.y / keyMagnitude;
    const lz = key.z / keyMagnitude;

    const normalDot = clamp((dx * lx) + (dy * ly) + (z * lz), -1, 1);

    const keyLight = clamp(
      Math.max(0, normalDot) * safeNumber(model.keyLight && model.keyLight.intensity, 0.72) * containment,
      0,
      1
    );

    const radial = Math.sqrt(r2);
    const rim = clamp(
      Math.pow(clamp((radial - 0.66) / 0.34, 0, 1), 1.6) *
        safeNumber(model.rimAtmosphere && model.rimAtmosphere.intensity, 0.58) *
        containment,
      0,
      1
    );

    const terminator = clamp(
      Math.pow(clamp(1 - ((normalDot + 0.2) / 1.2), 0, 1), safeNumber(model.terminatorShadow && model.terminatorShadow.falloff, 0.72)) *
        safeNumber(model.terminatorShadow && model.terminatorShadow.intensity, 0.54) *
        containment,
      0,
      1
    );

    const readability = clamp(
      surfaceInfluence *
        safeNumber(model.surfaceReadability && model.surfaceReadability.intensity, 0.44) *
        containment,
      0,
      1
    );

    const composite = clamp((keyLight * 0.42) + (rim * 0.24) + (readability * 0.24) - (terminator * 0.1), 0, 1);

    return {
      containment,
      normal: { x: dx, y: dy, z },
      keyLight,
      rimAtmosphere: rim,
      terminatorShadow: terminator,
      surfaceReadability: readability,
      composite,
      surfaceInfluence
    };
  }

  function sampleLight(x, y, width, height) {
    const model = state.lightModel || buildLightModel();
    const point = normalizePoint(x, y, width, height);
    const value = sampleLightValue(point, model);

    return {
      x: point.x,
      y: point.y,
      containment: value.containment,
      normal: value.normal,
      keyLight: value.keyLight,
      rimAtmosphere: value.rimAtmosphere,
      terminatorShadow: value.terminatorShadow,
      surfaceReadability: value.surfaceReadability,
      composite: value.composite,
      surfaceInfluence: value.surfaceInfluence,
      fourChannelVisibilityReady: true,
      atmosphereTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function sample(x, y, options = {}) {
    return {
      packetType: "HEARTH_CANVAS_LIGHT_FINGER_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      fingerName: FINGER_NAME,
      light: sampleLight(x, y, options.width, options.height),
      ...FINAL_FALSE
    };
  }

  function drawToCanvas(canvasOrContext, options = {}) {
    const target = canvasOrContext || null;
    const context = target && isFunction(target.getContext)
      ? target.getContext("2d")
      : target && isFunction(target.beginPath)
        ? target
        : null;

    if (!context) {
      return {
        drawn: false,
        reason: "NO_2D_CANVAS_CONTEXT",
        contract: CONTRACT,
        receipt: RECEIPT,
        ...FINAL_FALSE
      };
    }

    const canvas = context.canvas || target;
    const width = safeNumber(options.width || (canvas && canvas.width), 0);
    const height = safeNumber(options.height || (canvas && canvas.height), 0);

    if (!width || !height) {
      return {
        drawn: false,
        reason: "CANVAS_DIMENSIONS_UNAVAILABLE",
        contract: CONTRACT,
        receipt: RECEIPT,
        ...FINAL_FALSE
      };
    }

    const model = state.lightModel || buildLightModel(options);
    const minSide = Math.min(width, height);
    const cx = model.centerX * width;
    const cy = model.centerY * height;
    const r = model.radius * minSide;

    try {
      context.save();

      const keyX = cx - r * 0.36;
      const keyY = cy - r * 0.42;

      const keyGradient = isFunction(context.createRadialGradient)
        ? context.createRadialGradient(keyX, keyY, r * 0.04, keyX, keyY, r * 1.18)
        : null;

      context.globalAlpha = clamp(options.keyOpacity ?? 0.32, 0, 0.5);
      context.beginPath();
      context.arc(cx, cy, r, 0, Math.PI * 2);

      if (keyGradient) {
        keyGradient.addColorStop(0, "rgba(255, 235, 178, 0.52)");
        keyGradient.addColorStop(0.48, "rgba(214, 196, 140, 0.18)");
        keyGradient.addColorStop(1, "rgba(214, 196, 140, 0)");
        context.fillStyle = keyGradient;
      } else {
        context.fillStyle = "rgba(255, 235, 178, 0.16)";
      }

      context.fill();

      context.globalAlpha = clamp(options.readabilityOpacity ?? 0.2, 0, 0.4);
      context.beginPath();
      context.ellipse(cx - r * 0.08, cy + r * 0.05, r * 0.66, r * 0.46, -0.32, 0, Math.PI * 2);
      context.fillStyle = "rgba(238, 219, 160, 0.18)";
      context.fill();

      context.globalAlpha = clamp(options.shadowOpacity ?? 0.26, 0, 0.45);
      context.beginPath();
      context.ellipse(cx + r * 0.3, cy + r * 0.22, r * 0.72, r * 0.78, -0.16, 0, Math.PI * 2);
      context.fillStyle = "rgba(10, 19, 25, 0.28)";
      context.fill();

      context.globalAlpha = clamp(options.rimOpacity ?? 0.48, 0, 0.7);
      context.lineWidth = Math.max(1, minSide * 0.012);
      context.beginPath();
      context.arc(cx, cy, r * 1.004, 0, Math.PI * 2);
      context.strokeStyle = "rgba(194, 232, 237, 0.38)";
      context.stroke();

      context.globalAlpha = clamp(options.outerRimOpacity ?? 0.2, 0, 0.4);
      context.lineWidth = Math.max(1, minSide * 0.005);
      context.beginPath();
      context.arc(cx, cy, r * 1.032, 0, Math.PI * 2);
      context.strokeStyle = "rgba(230, 245, 244, 0.22)";
      context.stroke();

      context.restore();

      record("LIGHT_FINGER_DRAW_TO_CANVAS_COMPLETE", {
        width,
        height,
        channels: LIGHT_CHANNELS.length,
        finalVisualClaim: false
      });

      return {
        drawn: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        fingerName: FINGER_NAME,
        lightSubFingerCount: LIGHT_CHANNELS.length,
        visibleContributionAvailable: true,
        finalVisualClaim: false,
        ...FINAL_FALSE
      };
    } catch (error) {
      try {
        context.restore();
      } catch (_restoreError) {}

      recordError("LIGHT_FINGER_DRAW_TO_CANVAS_FAILED", error);

      return {
        drawn: false,
        reason: "DRAW_FAILED",
        error: error && error.message ? String(error.message) : String(error),
        contract: CONTRACT,
        receipt: RECEIPT,
        ...FINAL_FALSE
      };
    }
  }

  function findCanvasHub() {
    for (const sourceName of HUB_SOURCE_NAMES) {
      const candidate = readPath(sourceName);
      if (candidate && isObject(candidate)) {
        return {
          hub: candidate,
          sourceName
        };
      }
    }

    return {
      hub: null,
      sourceName: "NONE"
    };
  }

  function buildLightPacket(options = {}) {
    const model = buildLightModel(options);

    const packet = {
      packetType: "HEARTH_CANVAS_LIGHT_FINGER_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,
      fingerStretchRegistry: clonePlain(FINGER_STRETCH_REGISTRY),

      lightSubFingerCount: LIGHT_CHANNELS.length,
      lightChannels: clonePlain(LIGHT_CHANNELS),
      keyLightChannelActive: true,
      rimAtmosphereChannelActive: true,
      terminatorShadowChannelActive: true,
      surfaceReadabilityChannelActive: true,

      boundaryFile: BOUNDARY_FILE,
      boundaryDependencyExpected: true,
      boundaryDependencyObserved: state.boundaryDependencyObserved,
      boundaryPacketObserved: state.boundaryPacketObserved,
      boundaryModelObserved: state.boundaryModelObserved,

      massFile: MASS_FILE,
      massDependencyExpected: true,
      massDependencyObserved: state.massDependencyObserved,
      massPacketObserved: state.massPacketObserved,
      massModelObserved: state.massModelObserved,

      surfaceFile: SURFACE_FILE,
      surfaceDependencyExpected: true,
      surfaceDependencyObserved: state.surfaceDependencyObserved,
      surfacePacketObserved: state.surfacePacketObserved,
      surfaceModelObserved: state.surfaceModelObserved,

      lightFingerActive: true,
      fourChannelVisibilityActive: true,
      lightModelReady: true,
      keyLightReady: true,
      rimAtmosphereReady: true,
      terminatorShadowReady: true,
      surfaceReadabilityReady: true,
      lightPacketReady: true,
      visibleContributionAvailable: true,

      lightModel: clonePlain(model),
      sampleAvailable: true,
      sampleLightAvailable: true,
      drawToCanvasAvailable: true,

      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,

      recommendedNextFile: NEXT_FILE,
      recommendedNextRenewalTarget: NEXT_FILE,
      firstFailedCoordinate: state.hubRegistrationAccepted
        ? "WAITING_CANVAS_FINGER_INSPECT"
        : "WAITING_CANVAS_HUB_LIGHT_FINGER_INTAKE",
      noClaimsPreserved: true,

      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.lightPacket = clonePlain(packet);
    state.lightPacketReady = true;
    state.lightModelReady = true;
    state.keyLightReady = true;
    state.rimAtmosphereReady = true;
    state.terminatorShadowReady = true;
    state.surfaceReadabilityReady = true;
    state.visibleContributionAvailable = true;

    return packet;
  }

  function getLightPacket(options = {}) {
    if (!state.lightPacket || options.rebuild === true) {
      return buildLightPacket(options);
    }

    return clonePlain(state.lightPacket);
  }

  function registerWithCanvasHub(options = {}) {
    const packet = buildLightPacket(options);
    const found = findCanvasHub();

    state.hubDetected = Boolean(found.hub);
    state.hubSourceName = found.sourceName;
    state.hubRegistrationAttempted = true;
    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationError = "";

    if (!found.hub) {
      state.hubRegistrationHeldReason = "CANVAS_HUB_NOT_FOUND";
      state.firstFailedCoordinate = "WAITING_CANVAS_HUB";
      state.recommendedNextFile = PARENT_HUB_FILE;
      state.recommendedNextRenewalTarget = PARENT_HUB_FILE;
      state.postgameStatus = "LIGHT_FINGER_HELD_CANVAS_HUB_NOT_FOUND";

      record("LIGHT_FINGER_HUB_NOT_FOUND", {
        attemptedSources: clonePlain(HUB_SOURCE_NAMES)
      });

      return false;
    }

    for (const method of HUB_INTAKE_METHODS) {
      if (!isFunction(found.hub[method])) continue;

      try {
        const response = found.hub[method](clonePlain(packet));

        state.hubRegistrationAccepted = response !== false;
        state.hubRegistrationMethod = method;
        state.hubRegistrationHeldReason = state.hubRegistrationAccepted ? "NONE" : "CANVAS_HUB_REJECTED_LIGHT_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        if (state.hubRegistrationAccepted) {
          state.firstFailedCoordinate = "WAITING_CANVAS_FINGER_INSPECT";
          state.recommendedNextFile = NEXT_FILE;
          state.recommendedNextRenewalTarget = NEXT_FILE;
          state.postgameStatus = "LIGHT_FINGER_ACCEPTED_BY_CANVAS_HUB_READY_FOR_INSPECT_FINGER";
        } else {
          state.firstFailedCoordinate = "CANVAS_HUB_REJECTED_LIGHT_PACKET";
          state.recommendedNextFile = PARENT_HUB_FILE;
          state.recommendedNextRenewalTarget = PARENT_HUB_FILE;
          state.postgameStatus = "LIGHT_FINGER_HELD_CANVAS_HUB_REJECTED_PACKET";
        }

        record("LIGHT_FINGER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        buildLightPacket(options);
        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("LIGHT_FINGER_HUB_REGISTRATION_METHOD_FAILED", error, {
          hubSourceName: found.sourceName,
          method
        });
      }
    }

    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationHeldReason = "CANVAS_HUB_INTAKE_NOT_FOUND";
    state.firstFailedCoordinate = "CANVAS_HUB_INTAKE_NOT_FOUND";
    state.recommendedNextFile = PARENT_HUB_FILE;
    state.recommendedNextRenewalTarget = PARENT_HUB_FILE;
    state.postgameStatus = "LIGHT_FINGER_HELD_CANVAS_HUB_INTAKE_NOT_FOUND";

    record("LIGHT_FINGER_HUB_INTAKE_NOT_FOUND", {
      hubSourceName: found.sourceName,
      attemptedMethods: clonePlain(HUB_INTAKE_METHODS)
    });

    buildLightPacket(options);
    return false;
  }

  function getState() {
    return clonePlain(state);
  }

  function read() {
    return getReceiptLight();
  }

  function getReceiptLight() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,
      boundaryFile: BOUNDARY_FILE,
      massFile: MASS_FILE,
      surfaceFile: SURFACE_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,

      lightFingerLoaded: state.lightFingerLoaded,
      lightFingerActive: state.lightFingerActive,
      fourChannelVisibilityActive: state.fourChannelVisibilityActive,
      lightSubFingerCount: LIGHT_CHANNELS.length,

      keyLightChannelActive: state.keyLightChannelActive,
      rimAtmosphereChannelActive: state.rimAtmosphereChannelActive,
      terminatorShadowChannelActive: state.terminatorShadowChannelActive,
      surfaceReadabilityChannelActive: state.surfaceReadabilityChannelActive,

      boundaryDependencyExpected: state.boundaryDependencyExpected,
      boundaryDependencyObserved: state.boundaryDependencyObserved,
      boundaryPacketObserved: state.boundaryPacketObserved,
      boundaryModelObserved: state.boundaryModelObserved,

      massDependencyExpected: state.massDependencyExpected,
      massDependencyObserved: state.massDependencyObserved,
      massPacketObserved: state.massPacketObserved,
      massModelObserved: state.massModelObserved,

      surfaceDependencyExpected: state.surfaceDependencyExpected,
      surfaceDependencyObserved: state.surfaceDependencyObserved,
      surfacePacketObserved: state.surfacePacketObserved,
      surfaceModelObserved: state.surfaceModelObserved,

      lightModelReady: state.lightModelReady,
      keyLightReady: state.keyLightReady,
      rimAtmosphereReady: state.rimAtmosphereReady,
      terminatorShadowReady: state.terminatorShadowReady,
      surfaceReadabilityReady: state.surfaceReadabilityReady,
      lightPacketReady: state.lightPacketReady,
      visibleContributionAvailable: state.visibleContributionAvailable,

      hubDetected: state.hubDetected,
      hubSourceName: state.hubSourceName,
      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,
      hubRegistrationError: state.hubRegistrationError,

      sampleAvailable: true,
      sampleLightAvailable: true,
      drawToCanvasAvailable: true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      currentReceipt: true,
      boundaryPacket: clonePlain(state.boundaryPacket),
      boundaryModel: clonePlain(state.boundaryModel),
      massPacket: clonePlain(state.massPacket),
      massModel: clonePlain(state.massModel),
      surfacePacket: clonePlain(state.surfacePacket),
      surfaceModel: clonePlain(state.surfaceModel),
      lightModel: clonePlain(state.lightModel),
      lightPacket: clonePlain(state.lightPacket),
      lightChannels: clonePlain(LIGHT_CHANNELS),
      fingerStretchRegistry: clonePlain(FINGER_STRETCH_REGISTRY),
      hubSourceNames: clonePlain(HUB_SOURCE_NAMES),
      hubIntakeMethods: clonePlain(HUB_INTAKE_METHODS),
      boundarySourceNames: clonePlain(BOUNDARY_SOURCE_NAMES),
      massSourceNames: clonePlain(MASS_SOURCE_NAMES),
      surfaceSourceNames: clonePlain(SURFACE_SOURCE_NAMES),
      lastRegistrationResponse: clonePlain(state.lastRegistrationResponse),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_FINGER_LIGHT_FOUR_CHANNEL_VISIBILITY_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("packet", r.packet),
      line("file", r.file),
      line("route", r.route),
      line("diagnosticRoute", r.diagnosticRoute),
      line("parentHubFile", r.parentHubFile),
      line("boundaryFile", r.boundaryFile),
      line("massFile", r.massFile),
      line("surfaceFile", r.surfaceFile),
      "",
      "FINGER",
      line("fingerName", r.fingerName),
      line("fingerRole", r.fingerRole),
      line("fingerOrder", r.fingerOrder),
      line("fingerStretchTotal", r.fingerStretchTotal),
      "",
      "FOUR_LIGHT_CHANNELS",
      line("lightSubFingerCount", r.lightSubFingerCount),
      line("keyLightChannelActive", r.keyLightChannelActive),
      line("rimAtmosphereChannelActive", r.rimAtmosphereChannelActive),
      line("terminatorShadowChannelActive", r.terminatorShadowChannelActive),
      line("surfaceReadabilityChannelActive", r.surfaceReadabilityChannelActive),
      "",
      "BOUNDARY_DEPENDENCY",
      line("boundaryDependencyExpected", r.boundaryDependencyExpected),
      line("boundaryDependencyObserved", r.boundaryDependencyObserved),
      line("boundaryPacketObserved", r.boundaryPacketObserved),
      line("boundaryModelObserved", r.boundaryModelObserved),
      "",
      "MASS_DEPENDENCY",
      line("massDependencyExpected", r.massDependencyExpected),
      line("massDependencyObserved", r.massDependencyObserved),
      line("massPacketObserved", r.massPacketObserved),
      line("massModelObserved", r.massModelObserved),
      "",
      "SURFACE_DEPENDENCY",
      line("surfaceDependencyExpected", r.surfaceDependencyExpected),
      line("surfaceDependencyObserved", r.surfaceDependencyObserved),
      line("surfacePacketObserved", r.surfacePacketObserved),
      line("surfaceModelObserved", r.surfaceModelObserved),
      "",
      "LIGHT_STATUS",
      line("lightFingerLoaded", r.lightFingerLoaded),
      line("lightFingerActive", r.lightFingerActive),
      line("fourChannelVisibilityActive", r.fourChannelVisibilityActive),
      line("lightModelReady", r.lightModelReady),
      line("keyLightReady", r.keyLightReady),
      line("rimAtmosphereReady", r.rimAtmosphereReady),
      line("terminatorShadowReady", r.terminatorShadowReady),
      line("surfaceReadabilityReady", r.surfaceReadabilityReady),
      line("lightPacketReady", r.lightPacketReady),
      line("visibleContributionAvailable", r.visibleContributionAvailable),
      "",
      "HUB_REGISTRATION",
      line("hubDetected", r.hubDetected),
      line("hubSourceName", r.hubSourceName),
      line("hubRegistrationAttempted", r.hubRegistrationAttempted),
      line("hubRegistrationAccepted", r.hubRegistrationAccepted),
      line("hubRegistrationMethod", r.hubRegistrationMethod),
      line("hubRegistrationHeldReason", r.hubRegistrationHeldReason),
      line("hubRegistrationError", r.hubRegistrationError),
      "",
      "API",
      line("sampleAvailable", r.sampleAvailable),
      line("sampleLightAvailable", r.sampleLightAvailable),
      line("drawToCanvasAvailable", r.drawToCanvasAvailable),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("noClaimsPreserved", r.noClaimsPreserved),
      line("f13Claimed", false),
      line("f21Claimed", false),
      line("readyTextClaimed", false),
      line("completionLatched", false),
      line("terrainTruthClaimed", false),
      line("hydrologyTruthClaimed", false),
      line("materialTruthClaimed", false),
      line("elevationTruthClaimed", false),
      line("biomeTruthClaimed", false),
      line("atmosphereTruthClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerLightLoaded", "true");
    setDataset("hearthCanvasFingerLightContract", CONTRACT);
    setDataset("hearthCanvasFingerLightReceipt", RECEIPT);
    setDataset("hearthCanvasFingerLightFile", FILE);
    setDataset("hearthCanvasFingerLightActive", String(state.lightFingerActive));
    setDataset("hearthCanvasFingerLightFourChannelVisibilityActive", String(state.fourChannelVisibilityActive));
    setDataset("hearthCanvasFingerLightSubFingerCount", String(LIGHT_CHANNELS.length));

    setDataset("hearthCanvasFingerLightKeyChannelActive", String(state.keyLightChannelActive));
    setDataset("hearthCanvasFingerLightRimAtmosphereChannelActive", String(state.rimAtmosphereChannelActive));
    setDataset("hearthCanvasFingerLightTerminatorShadowChannelActive", String(state.terminatorShadowChannelActive));
    setDataset("hearthCanvasFingerLightSurfaceReadabilityChannelActive", String(state.surfaceReadabilityChannelActive));

    setDataset("hearthCanvasFingerLightBoundaryDependencyExpected", String(state.boundaryDependencyExpected));
    setDataset("hearthCanvasFingerLightBoundaryDependencyObserved", String(state.boundaryDependencyObserved));
    setDataset("hearthCanvasFingerLightBoundaryPacketObserved", String(state.boundaryPacketObserved));
    setDataset("hearthCanvasFingerLightBoundaryModelObserved", String(state.boundaryModelObserved));

    setDataset("hearthCanvasFingerLightMassDependencyExpected", String(state.massDependencyExpected));
    setDataset("hearthCanvasFingerLightMassDependencyObserved", String(state.massDependencyObserved));
    setDataset("hearthCanvasFingerLightMassPacketObserved", String(state.massPacketObserved));
    setDataset("hearthCanvasFingerLightMassModelObserved", String(state.massModelObserved));

    setDataset("hearthCanvasFingerLightSurfaceDependencyExpected", String(state.surfaceDependencyExpected));
    setDataset("hearthCanvasFingerLightSurfaceDependencyObserved", String(state.surfaceDependencyObserved));
    setDataset("hearthCanvasFingerLightSurfacePacketObserved", String(state.surfacePacketObserved));
    setDataset("hearthCanvasFingerLightSurfaceModelObserved", String(state.surfaceModelObserved));

    setDataset("hearthCanvasFingerLightModelReady", String(state.lightModelReady));
    setDataset("hearthCanvasFingerLightKeyLightReady", String(state.keyLightReady));
    setDataset("hearthCanvasFingerLightRimAtmosphereReady", String(state.rimAtmosphereReady));
    setDataset("hearthCanvasFingerLightTerminatorShadowReady", String(state.terminatorShadowReady));
    setDataset("hearthCanvasFingerLightSurfaceReadabilityReady", String(state.surfaceReadabilityReady));
    setDataset("hearthCanvasFingerLightPacketReady", String(state.lightPacketReady));
    setDataset("hearthCanvasFingerLightVisibleContributionAvailable", String(state.visibleContributionAvailable));

    setDataset("hearthCanvasFingerLightHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerLightHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerLightHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerLightHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerLightHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerLightHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerLightFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerLightRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerLightPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerLightNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerLightF13Claimed", "false");
    setDataset("hearthCanvasFingerLightF21Claimed", "false");
    setDataset("hearthCanvasFingerLightReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerLightTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightBiomeTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightAtmosphereTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerLightGeneratedImage", "false");
    setDataset("hearthCanvasFingerLightGraphicBox", "false");
    setDataset("hearthCanvasFingerLightWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");

    hearth.canvasFingerLight = api;
    hearth.canvasLightFinger = api;
    hearth.canvasFingerLightReceipt = getReceiptLight();
    hearth.canvasFingerLightPacket = getLightPacket();

    root.HEARTH_CANVAS_FINGER_LIGHT = api;
    root.HEARTH_CANVAS_LIGHT_FINGER = api;
    root.HEARTH_CANVAS_FINGER_LIGHT_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_LIGHT_FOUR_CHANNEL_VISIBILITY_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_LIGHT_FOUR_CHANNEL_VISIBILITY_RECEIPT_v1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_LIGHT_PACKET = getLightPacket();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot(options = {}) {
    state.timestamp = nowIso();

    readBoundaryEvidence();
    readMassEvidence();
    readSurfaceEvidence();
    buildLightModel(options);
    buildLightPacket(options);
    publishGlobals();

    registerWithCanvasHub(options);

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("LIGHT_FINGER_BOOT_COMPLETE", {
      boundaryDependencyObserved: state.boundaryDependencyObserved,
      massDependencyObserved: state.massDependencyObserved,
      surfaceDependencyObserved: state.surfaceDependencyObserved,
      lightSubFingerCount: LIGHT_CHANNELS.length,
      hubDetected: state.hubDetected,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile
    });

    return getReceipt();
  }

  function init(options = {}) {
    return boot(options);
  }

  function start(options = {}) {
    return boot(options);
  }

  function mount(options = {}) {
    return boot(options);
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PACKET,
    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    PARENT_HUB_FILE,
    BOUNDARY_FILE,
    MASS_FILE,
    SURFACE_FILE,
    NEXT_FILE,
    INSPECT_FILE,

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
    boundaryFile: BOUNDARY_FILE,
    massFile: MASS_FILE,
    surfaceFile: SURFACE_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,
    fingerStretchRegistry: FINGER_STRETCH_REGISTRY,
    lightChannels: LIGHT_CHANNELS,

    boot,
    init,
    start,
    mount,

    readBoundaryEvidence,
    readMassEvidence,
    readSurfaceEvidence,
    buildLightModel,
    buildLightPacket,
    getLightPacket,
    registerWithCanvasHub,
    findCanvasHub,

    sample,
    sampleLight,
    drawToCanvas,

    getState,
    read,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    publishGlobals,

    supportsCanvasFingerLight: true,
    supportsFourChannelVisibility: true,
    supportsKeyLightChannel: true,
    supportsRimAtmosphereChannel: true,
    supportsTerminatorShadowChannel: true,
    supportsSurfaceReadabilityChannel: true,
    supportsLightExpressionPacket: true,
    supportsBoundaryFingerConsumption: true,
    supportsMassFingerConsumption: true,
    supportsSurfaceFingerConsumption: true,
    supportsCanvasHubRegistration: true,
    supportsVisibleLightContribution: true,
    supportsReceiptText: true,
    supportsNoFinalClaims: true,

    ownsLightFingerIdentity: true,
    ownsLightExpressionPacket: true,
    ownsFourChannelVisibility: true,
    ownsCanvasHub: false,
    ownsBoundaryFinger: false,
    ownsMassFinger: false,
    ownsSurfaceFinger: false,
    ownsRouteConductor: false,
    ownsDiagnosticRail: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsAtmosphereTruth: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();

    readBoundaryEvidence();
    readMassEvidence();
    readSurfaceEvidence();
    buildLightModel();
    buildLightPacket();
    updateDataset();
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot({}), { once: true });
      } else {
        boot({});
      }
    } else {
      boot({});
    }
  } catch (error) {
    recordError("LIGHT_FINGER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
