// /assets/hearth/hearth.canvas.finger.surface.js
// HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_TNT_v5
// Full-file replacement.
// Canvas Finger 3 / Surface / Pointer Finger / non-cardinal Surface Pointer Bishop / Hex Expression Socket.
// Previous:
// HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4
// Purpose:
// - Preserve Surface as Canvas Finger 3.
// - Preserve Surface as the Pointer Finger.
// - Preserve non-cardinal Pointer Bishop language.
// - Preserve legacy v1/v2/v3/v4 aliases and receipt expectations.
// - Make Surface the explicit expression authority consumed by Hex Surface.
// - Provide renderable terrain/water/material/elevation-style expression packets to Hex Surface.
// - Expose Hex Surface expression-serving methods:
//   1. sampleHexSurfaceExpression(packet)
//   2. sampleSurfaceExpression(packet)
//   3. getRenderableSurfaceExpression(packet)
//   4. getSurfaceExpressionAt(packet)
// - Keep Hex Surface responsible for projection and canvas drawing.
// - Keep this file responsible for surface expression data only.
// - Preserve internal finger/composite/world-expression intake.
// - Preserve external donor intake and held/routed ledgers.
// - Preserve Canvas Hub registration without becoming Canvas parent.
// - Do not draw canvas.
// - Do not mount DOM.
// - Do not mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, Hex Surface,
//   Hex Four-Pair Authority, Boundary Finger, Mass Finger, Light Finger, Inspect Finger,
//   Composite Finger, materials, composition, air channel, cliffs, or donor files.
// - Do not claim final terrain truth, hydrology truth, material truth, elevation truth,
//   composite truth, F13, F21, ready text, completion latch, final visual pass,
//   generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_TNT_v5";
  const RECEIPT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_RECEIPT_v5";
  const PACKET = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_PACKET_v5";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_RECEIPT_v4";
  const PREVIOUS_PACKET = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_PACKET_v4";

  const LINEAGE_V3_CONTRACT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v3";
  const LINEAGE_V3_RECEIPT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_RECEIPT_v3";
  const LINEAGE_V2_CONTRACT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_TNT_v2";
  const LINEAGE_V2_RECEIPT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_RECEIPT_v2";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_TNT_v1";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_RECEIPT_v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";

  const MATERIALS_FILE = "/assets/hearth/hearth.materials.js";
  const COMPOSITION_FILE = "/assets/hearth/hearth.composition.js";
  const AIR_CHANNEL_FILE = "/assets/hearth/hearth.air.channel.js";
  const CLIFFS_FILE = "/assets/hearth/hearth.cliffs.js";

  const NEXT_FILE = HEX_SURFACE_FILE;

  const FINGER_NAME = "surface";
  const FINGER_ROLE = "pointer-finger-hex-expression-socket";
  const FINGER_ORDER = 3;
  const FINGER_STRETCH_TOTAL = 5;

  const BISHOP_NAME = "surface";
  const BISHOP_TITLE = "Surface Pointer Bishop";
  const BISHOP_ROLE = "pointer-bishop-hex-expression-socket";
  const BISHOP_RANK = "non-cardinal-bishop";
  const BISHOP_ORDER = 3;
  const BISHOP_ADDRESS = "surface.pointer";
  const BISHOP_DIRECTION = "POINTER";
  const BISHOP_CARDINAL_DISPOSITION = "NON_CARDINAL_POINTER";
  const BISHOP_SUBJECT_FILE = FILE;
  const BISHOP_PARENT = PARENT_HUB_FILE;
  const BISHOP_CANONICAL_STATUS = "HEX_EXPRESSION_SOCKET_WITH_LEGACY_FINGER_COMPATIBILITY";

  const HEX_SURFACE_REQUIRED_CONTRACT = "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const HEX_SURFACE_NEXT_EXPECTED_CONTRACT = "HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_CONSUMER_TNT_v5";

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f13ClaimedBySurfacePointerBishop: false,
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
    compositeTruthClaimed: false,
    finalCompositeTruthClaimed: false,
    biomeTruthClaimed: false,
    settlementTruthClaimed: false,
    expressionComplete: false,
    finalVisualPassClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const CATEGORY = Object.freeze({
    SURFACE: "surface",
    MASS: "mass",
    BOUNDARY: "boundary",
    LIGHT: "light",
    INSPECT: "inspect",
    COMPOSITE: "composite",
    WORLD_EXPRESSION: "world-expression",
    MATERIALS: "materials",
    COMPOSITION: "composition",
    AIR_CHANNEL: "air-channel",
    CLIFFS: "cliffs",
    HYDROLOGY_INTERFACE: "hydrology-interface",
    HEX_SURFACE: "hex-surface",
    UNKNOWN: "unknown"
  });

  const ROUTING_STATUS = Object.freeze({
    INTEGRATED_BY_SURFACE: "INTEGRATED_BY_SURFACE",
    INTERNAL_ACCEPTED_BY_SURFACE: "INTERNAL_ACCEPTED_BY_SURFACE",
    INTERNAL_HELD_BY_SURFACE: "INTERNAL_HELD_BY_SURFACE",
    ROUTED_TO_RECEIVER: "ROUTED_TO_RECEIVER",
    HELD_FOR_RECEIVER_RENEWAL: "HELD_FOR_RECEIVER_RENEWAL",
    REJECTED_UNCLASSIFIED: "REJECTED_UNCLASSIFIED",
    REJECTED_FORBIDDEN_CLAIM: "REJECTED_FORBIDDEN_CLAIM"
  });

  const FINGER_STRETCH_REGISTRY = Object.freeze([
    Object.freeze({
      order: 1,
      name: "boundary",
      bishopName: "boundary",
      bishopRank: "non-cardinal-bishop",
      file: BOUNDARY_FILE,
      role: "base globe containment, visible body edge, boundary envelope"
    }),
    Object.freeze({
      order: 2,
      name: "mass",
      bishopName: "mass",
      bishopRank: "non-cardinal-bishop",
      file: MASS_FILE,
      role: "physical body mass, broad body structure, early land/body support"
    }),
    Object.freeze({
      order: 3,
      name: "surface",
      bishopName: BISHOP_NAME,
      bishopTitle: BISHOP_TITLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      file: FILE,
      role: "pointer bishop, pointer finger, hex expression socket, surface-expression authority"
    }),
    Object.freeze({
      order: 4,
      name: "light",
      bishopName: "light",
      bishopRank: "non-cardinal-bishop",
      file: LIGHT_FILE,
      role: "visibility, light, chamber realism, atmosphere-edge readability"
    }),
    Object.freeze({
      order: 5,
      name: "inspect",
      bishopName: "inspect",
      bishopRank: "non-cardinal-bishop",
      file: INSPECT_FILE,
      role: "expression-finger inspection receipt without diagnostic rail takeover"
    })
  ]);

  const COLOR = Object.freeze({
    abyss: [2, 10, 28, 255],
    deep: [4, 28, 70, 255],
    ocean: [8, 68, 122, 255],
    shelf: [30, 128, 146, 255],
    foam: [104, 176, 170, 255],
    landLow: [86, 116, 70, 255],
    landWarm: [144, 132, 78, 255],
    landWet: [36, 104, 66, 255],
    ridge: [92, 88, 78, 255],
    granite: [138, 132, 118, 255],
    cliff: [42, 50, 60, 255],
    snow: [218, 230, 228, 255],
    copper: [158, 92, 60, 255],
    opal: [148, 194, 188, 255]
  });

  const BODY_MASSES = Object.freeze([
    Object.freeze({ key: "north-crown-mass", lat: 78, lon: -20, rx: 42, ry: 13, angle: -10 }),
    Object.freeze({ key: "equatorial-great-mass", lat: 1, lon: -8, rx: 64, ry: 28, angle: -8 }),
    Object.freeze({ key: "northwest-temperate-mass", lat: 44, lon: -104, rx: 32, ry: 17, angle: 28 }),
    Object.freeze({ key: "northeast-broken-shelf-mass", lat: 34, lon: 104, rx: 34, ry: 16, angle: -24 }),
    Object.freeze({ key: "southeast-warm-mass", lat: -24, lon: 142, rx: 38, ry: 20, angle: 18 }),
    Object.freeze({ key: "southwest-ridge-mass", lat: -38, lon: -122, rx: 36, ry: 18, angle: -30 }),
    Object.freeze({ key: "south-transitional-mass", lat: -59, lon: 36, rx: 40, ry: 14, angle: 9 })
  ]);

  const HUB_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasHub",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasFingerManager",
    "HEARTH.canvasBishopManager",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_FINGER_MANAGER",
    "HEARTH_CANVAS_BISHOP_MANAGER",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasFingerManager",
    "DEXTER_LAB.hearthCanvasBishopManager"
  ]);

  const HUB_INTAKE_METHODS = Object.freeze([
    "receiveSurfaceExpressionAuthority",
    "receiveHexExpressionAuthority",
    "receiveBishopPacket",
    "receiveCanvasBishopPacket",
    "receivePointerBishopPacket",
    "receiveSurfaceBishopPacket",
    "registerCanvasBishop",
    "registerExpressionBishop",
    "receiveFingerPacket",
    "receiveCanvasFingerPacket",
    "receiveSurfaceFingerPacket",
    "receiveInternalFingerPacket",
    "receiveExpansionFingerPacket",
    "registerCanvasFinger",
    "registerExpressionFinger",
    "receiveExpressionPacket",
    "receiveChildPacket"
  ]);

  const HEX_SURFACE_SOURCE_NAMES = Object.freeze([
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfacePlanetaryViewControlRenderer",
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurfacePlanetaryViewControlRenderer"
  ]);

  const BOUNDARY_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerBoundary",
    "HEARTH.canvasBoundaryFinger",
    "HEARTH.canvasBishopBoundary",
    "HEARTH.canvasBoundaryBishop",
    "HEARTH_CANVAS_FINGER_BOUNDARY",
    "HEARTH_CANVAS_BOUNDARY_FINGER",
    "HEARTH_CANVAS_BISHOP_BOUNDARY",
    "HEARTH_CANVAS_BOUNDARY_BISHOP",
    "DEXTER_LAB.hearthCanvasFingerBoundary",
    "DEXTER_LAB.hearthCanvasBoundaryFinger",
    "DEXTER_LAB.hearthCanvasBishopBoundary",
    "DEXTER_LAB.hearthCanvasBoundaryBishop"
  ]);

  const MASS_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerMass",
    "HEARTH.canvasMassFinger",
    "HEARTH.canvasBishopMass",
    "HEARTH.canvasMassBishop",
    "HEARTH_CANVAS_FINGER_MASS",
    "HEARTH_CANVAS_MASS_FINGER",
    "HEARTH_CANVAS_BISHOP_MASS",
    "HEARTH_CANVAS_MASS_BISHOP",
    "DEXTER_LAB.hearthCanvasFingerMass",
    "DEXTER_LAB.hearthCanvasMassFinger",
    "DEXTER_LAB.hearthCanvasBishopMass",
    "DEXTER_LAB.hearthCanvasMassBishop"
  ]);

  const KEYWORDS = Object.freeze({
    [CATEGORY.MASS]: Object.freeze(["mass", "volume", "body", "sphere", "physical", "pressure", "core", "weight", "density", "land shape", "body shape"]),
    [CATEGORY.BOUNDARY]: Object.freeze(["boundary", "silhouette", "edge", "containment", "rim", "outline", "sphere edge", "body edge", "clip", "mask", "envelope"]),
    [CATEGORY.LIGHT]: Object.freeze(["light", "shadow", "shade", "glow", "illumination", "sun", "specular", "atmosphere edge", "horizon light", "visibility"]),
    [CATEGORY.INSPECT]: Object.freeze(["inspect", "inspection", "click", "select", "hover", "readability", "proof", "viewer", "hit", "target", "label", "interaction", "control"]),
    [CATEGORY.COMPOSITE]: Object.freeze(["composite", "world expression", "world-expression", "assembled world", "visible world", "composite model", "composite packet", "composite finger", "composite bishop"]),
    [CATEGORY.WORLD_EXPRESSION]: Object.freeze(["world expression", "world-expression", "worldexpression", "planet expression", "visible planet expression", "assembled expression"]),
    [CATEGORY.MATERIALS]: Object.freeze(["material", "mineral", "texture", "color", "soil", "rock", "crust", "palette", "surface color", "tone", "grain", "sediment"]),
    [CATEGORY.COMPOSITION]: Object.freeze(["composition", "layer", "strata", "mantle", "crust", "internal", "structure", "planetary structure", "substrate", "lattice"]),
    [CATEGORY.AIR_CHANNEL]: Object.freeze(["air", "atmosphere", "haze", "fog", "pressure", "sky", "breath", "air channel", "vapor", "mist", "cloud"]),
    [CATEGORY.CLIFFS]: Object.freeze(["cliff", "cliffs", "escarpment", "ridge", "relief", "vertical", "slope", "wall", "mountain edge", "drop", "ravine"]),
    [CATEGORY.HYDROLOGY_INTERFACE]: Object.freeze(["waterline", "wet", "shore", "coast", "basin", "shelf", "ocean interface", "hydrology interface", "dry", "submerged", "water contact"]),
    [CATEGORY.SURFACE]: Object.freeze(["surface", "terrain", "land", "field", "patch", "zone", "formation", "visible surface", "skin", "planet surface", "factory surface", "pointer bishop"]),
    [CATEGORY.HEX_SURFACE]: Object.freeze(["hex surface", "hex-surface", "renderer", "spherical projection", "projection consumer"])
  });

  const api = {};

  const state = {
    timestamp: "",
    updatedAt: "",
    publishedAt: "",

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    previousPacket: PREVIOUS_PACKET,
    lineageV3Contract: LINEAGE_V3_CONTRACT,
    lineageV3Receipt: LINEAGE_V3_RECEIPT,
    lineageV2Contract: LINEAGE_V2_CONTRACT,
    lineageV2Receipt: LINEAGE_V2_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,

    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    boundaryFile: BOUNDARY_FILE,
    massFile: MASS_FILE,
    lightFile: LIGHT_FILE,
    inspectFile: INSPECT_FILE,
    compositeFile: COMPOSITE_FILE,
    materialsFile: MATERIALS_FILE,
    compositionFile: COMPOSITION_FILE,
    airChannelFile: AIR_CHANNEL_FILE,
    cliffsFile: CLIFFS_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,

    bishopName: BISHOP_NAME,
    bishopTitle: BISHOP_TITLE,
    bishopRole: BISHOP_ROLE,
    bishopRank: BISHOP_RANK,
    bishopOrder: BISHOP_ORDER,
    bishopAddress: BISHOP_ADDRESS,
    bishopDirection: BISHOP_DIRECTION,
    bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,
    bishopSubjectFile: BISHOP_SUBJECT_FILE,
    bishopParent: BISHOP_PARENT,
    bishopCanonicalStatus: BISHOP_CANONICAL_STATUS,

    surfaceFingerLoaded: true,
    surfaceFingerActive: true,
    pointerFingerActive: true,
    pointerBishopActive: true,
    bishopLanguageActive: true,
    nonCardinalBishopLanguageActive: true,
    legacyFingerCompatibilityActive: true,

    hexExpressionSocketActive: true,
    hexSurfaceExpressionAuthority: true,
    hexSurfaceConsumerExpected: true,
    hexSurfaceProjectionDelegated: true,
    canvasDrawingDelegatedToHexSurface: true,
    directCanvasDrawingSuppressed: true,

    externalExpressionSocketActive: true,
    internalExpressionSocketActive: true,
    internalExternalExpressionSocketActive: true,
    singleExternalInputReceiver: true,
    internalFingerPacketReceiver: true,
    internalBishopPacketReceiver: true,
    compositePacketReceiver: true,
    worldExpressionPacketReceiver: true,
    firstMaterialDifferentiationActive: true,

    boundaryDependencyExpected: true,
    boundaryDependencyObserved: false,
    boundaryPacketObserved: false,
    boundaryModelObserved: false,

    massDependencyExpected: true,
    massDependencyObserved: false,
    massPacketObserved: false,
    massModelObserved: false,

    hexSurfaceObserved: false,
    hexSurfaceContract: "UNKNOWN",
    hexSurfaceRecognized: false,
    hexSurfaceHandshakeAttempted: false,
    hexSurfaceHandshakeAccepted: false,
    hexSurfaceHandshakeMethod: "NONE",
    hexSurfaceHandshakeError: "",

    surfaceModelReady: false,
    firstSurfaceDifferentiationReady: false,
    roughTerrainTintReady: false,
    shallowMaterialVariationReady: false,
    surfacePacketReady: false,
    pointerFingerPacketReady: false,
    pointerBishopPacketReady: false,
    visibleContributionAvailable: false,

    surfaceExpressionReady: false,
    hexSurfaceExpressionReady: false,
    sampleHexSurfaceExpressionReady: true,
    sampleSurfaceExpressionReady: true,
    renderableSurfaceExpressionReady: true,

    externalIntakeReady: true,
    externalIntakeCount: 0,
    classifiedExpressionCount: 0,
    surfaceIntegratedCount: 0,
    routedExpressionCount: 0,
    heldExpressionCount: 0,
    rejectedExpressionCount: 0,

    internalIntakeReady: true,
    internalIntakeCount: 0,
    internalAcceptedCount: 0,
    internalHeldCount: 0,
    internalRejectedCount: 0,
    compositeInternalPacketCount: 0,
    worldExpressionInternalPacketCount: 0,
    internalSurfaceBridgeCount: 0,

    hexExpressionRequestCount: 0,
    hexExpressionServedCount: 0,
    hexExpressionRejectedCount: 0,
    latestHexExpressionAt: "",
    latestHexExpressionRequestSource: "NONE",
    latestHexExpressionCellId: "NONE",
    latestHexExpressionMaterialClass: "NONE",
    latestHexExpressionLandPresence: 0,
    latestHexExpressionWaterPresence: 0,

    latestExternalPacketId: "NONE",
    latestExternalPacketCategory: "NONE",
    latestExternalPacketStatus: "NONE",

    latestInternalPacketId: "NONE",
    latestInternalPacketCategory: "NONE",
    latestInternalPacketStatus: "NONE",
    latestInternalPacketSourceFile: "NONE",

    categoryCounts: {},
    internalCategoryCounts: {},
    registeredReceivers: {},

    externalIntakeLedger: [],
    classifiedLedger: [],
    routedLedger: [],
    heldDonorQueue: [],
    rejectedDonorQueue: [],
    surfaceIntegratedDonors: [],

    internalIntakeLedger: [],
    internalAcceptedLedger: [],
    internalHeldQueue: [],
    internalRejectedQueue: [],
    compositeInternalPackets: [],
    worldExpressionInternalPackets: [],
    internalSurfaceBridgeFields: [],

    surfaceFormationFields: [],
    surfaceMaterialFamilies: [],

    hexExpressionLedger: [],

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",

    firstFailedCoordinate: "SURFACE_POINTER_BISHOP_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "SURFACE_POINTER_BISHOP_WAITING_BOOT",

    boundaryPacket: null,
    boundaryModel: null,
    massPacket: null,
    massModel: null,
    surfaceModel: null,
    surfacePacket: null,
    pointerFingerPacket: null,
    pointerBishopPacket: null,
    internalExpressionPacket: null,
    compositeBridgePacket: null,
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
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k)),
      Math.round(lerp(a[3] === undefined ? 255 : a[3], b[3] === undefined ? 255 : b[3], k))
    ];
  }

  function multiplyColor(color, amount) {
    const k = clamp(amount, 0, 2);
    return [
      clamp(Math.round(color[0] * k), 0, 255),
      clamp(Math.round(color[1] * k), 0, 255),
      clamp(Math.round(color[2] * k), 0, 255),
      color[3] === undefined ? 255 : color[3]
    ];
  }

  function wrap01(value) {
    const n = safeNumber(value, 0);
    return ((n % 1) + 1) % 1;
  }

  function wrapDeg(value) {
    const n = safeNumber(value, 0);
    return ((((n + 180) % 360) + 360) % 360) - 180;
  }

  function degDistance(a, b) {
    return wrapDeg(safeNumber(a, 0) - safeNumber(b, 0));
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function bounded(value, limit = 4000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function getObjectText(value, limit = 8000) {
    try {
      if (typeof value === "string") return bounded(value, limit);
      return bounded(JSON.stringify(value), limit);
    } catch (_error) {
      return bounded(String(value), limit);
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function hash2(x, y, seed) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(x, y, seed) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;

    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves) {
    let total = 0;
    let amplitude = 0.54;
    let frequency = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
      norm += amplitude;
      amplitude *= 0.5;
      frequency *= 2.03;
    }

    return total / Math.max(0.000001, norm);
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp01((value - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function record(eventName, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(eventName, "SURFACE_POINTER_BISHOP_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 180);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "SURFACE_POINTER_BISHOP_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 120);
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
      if (candidate && isObject(candidate)) return { source: candidate, sourceName };
    }

    return { source: null, sourceName: "NONE" };
  }

  function contractOf(candidate) {
    if (!isObject(candidate)) return "";
    return safeString(
      candidate.contract ||
      candidate.CONTRACT ||
      candidate.currentContract ||
      candidate.sourceContract ||
      candidate.canvasContract ||
      candidate.hexSurfaceContract ||
      "",
      ""
    );
  }

  function receiptOf(candidate) {
    if (!isObject(candidate)) return "";
    return safeString(
      candidate.receipt ||
      candidate.RECEIPT ||
      candidate.currentReceipt ||
      candidate.sourceReceipt ||
      candidate.canvasReceipt ||
      candidate.hexSurfaceReceipt ||
      "",
      ""
    );
  }

  function readReceipt(candidate) {
    if (!isObject(candidate)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState",
      "read"
    ];

    for (const method of methods) {
      if (!isFunction(candidate[method])) continue;

      try {
        const result = candidate[method]();
        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(candidate.receipt)) return candidate.receipt;
    if (isObject(candidate.receiptPacket)) return candidate.receiptPacket;
    if (candidate.contract || candidate.CONTRACT || candidate.receipt || candidate.RECEIPT) return candidate;

    return null;
  }

  function hasForbiddenClaim(packet) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.f13Claimed === true ||
      packet.f13EligibleForCanvas === true ||
      packet.f13ClaimedByCanvasParent === true ||
      packet.f13ClaimedBySurfacePointerBishop === true ||
      packet.f21Claimed === true ||
      packet.f21EligibleForNorth === true ||
      packet.f21SubmittedToNorth === true ||
      packet.f21EligibilitySubmittedToNorth === true ||
      packet.completionLatched === true ||
      packet.finalCompletionLatched === true ||
      packet.degradedCompletionLatched === true ||
      packet.readyTextClaimed === true ||
      packet.readyTextAllowed === true ||
      packet.terrainTruthClaimed === true ||
      packet.hydrologyTruthClaimed === true ||
      packet.materialTruthClaimed === true ||
      packet.elevationTruthClaimed === true ||
      packet.compositeTruthClaimed === true ||
      packet.finalCompositeTruthClaimed === true ||
      packet.finalVisualPassClaimed === true ||
      packet.visualPassClaimed === true ||
      packet.generatedImage === true ||
      packet.graphicBox === true ||
      packet.webGL === true ||
      packet.webgl === true
    );
  }

  function normalizeCategory(category) {
    const text = safeString(category).trim().toLowerCase();

    if (!text) return CATEGORY.UNKNOWN;
    if (text.includes("hex") && text.includes("surface")) return CATEGORY.HEX_SURFACE;
    if (text.includes("world-expression") || text.includes("world expression") || text.includes("worldexpression")) return CATEGORY.WORLD_EXPRESSION;
    if (text.includes("composite")) return CATEGORY.COMPOSITE;
    if (text.includes("hydro") || text.includes("waterline") || text.includes("coast") || text.includes("shore")) return CATEGORY.HYDROLOGY_INTERFACE;
    if (text.includes("air") || text.includes("atmosphere") || text.includes("haze")) return CATEGORY.AIR_CHANNEL;
    if (text.includes("material") || text.includes("mineral") || text.includes("texture")) return CATEGORY.MATERIALS;
    if (text.includes("composition") || text.includes("layer") || text.includes("structure")) return CATEGORY.COMPOSITION;
    if (text.includes("cliff") || text.includes("relief") || text.includes("ridge")) return CATEGORY.CLIFFS;
    if (text.includes("inspect") || text.includes("click") || text.includes("interaction")) return CATEGORY.INSPECT;
    if (text.includes("light") || text.includes("shadow") || text.includes("illumination")) return CATEGORY.LIGHT;
    if (text.includes("boundary") || text.includes("edge") || text.includes("silhouette")) return CATEGORY.BOUNDARY;
    if (text.includes("mass") || text.includes("body") || text.includes("volume")) return CATEGORY.MASS;
    if (text.includes("surface") || text.includes("pointer") || text.includes("terrain") || text.includes("land")) return CATEGORY.SURFACE;

    for (const key of Object.values(CATEGORY)) {
      if (text === key) return key;
    }

    return CATEGORY.UNKNOWN;
  }

  function getExplicitCategory(input) {
    if (!isObject(input)) return "";

    return safeString(
      input.category ||
      input.expressionCategory ||
      input.domain ||
      input.expressionDomain ||
      input.targetCategory ||
      input.routeCategory ||
      input.bishopName ||
      input.bishopKey ||
      input.bishop ||
      input.fingerName ||
      input.fingerKey ||
      input.finger ||
      ""
    ).trim().toLowerCase();
  }

  function classifyByKeywords(input = {}, options = {}) {
    const explicit = normalizeCategory(options.category || getExplicitCategory(input));
    const text = getObjectText(input, 10000).toLowerCase();
    const scores = {};

    for (const category of Object.values(CATEGORY)) scores[category] = 0;

    if (explicit !== CATEGORY.UNKNOWN) scores[explicit] += 12;

    for (const [category, words] of Object.entries(KEYWORDS)) {
      for (const word of words) {
        if (text.includes(word.toLowerCase())) scores[category] += 1;
      }
    }

    if (isObject(input)) {
      const packetType = safeString(input.packetType || input.packetName || "").toUpperCase();
      const sourceFile = safeString(input.sourceFile || input.file || "").toLowerCase();

      if (packetType.includes("HEX_SURFACE") || sourceFile.includes("hearth.hex.surface")) scores[CATEGORY.HEX_SURFACE] += 16;
      if (packetType.includes("WORLD_EXPRESSION")) scores[CATEGORY.WORLD_EXPRESSION] += 16;
      if (packetType.includes("COMPOSITE")) scores[CATEGORY.COMPOSITE] += 16;
      if (packetType.includes("BISHOP") || packetType.includes("FINGER")) scores[CATEGORY.SURFACE] += 2;
      if (sourceFile.includes("composite")) scores[CATEGORY.COMPOSITE] += 8;
      if (input.compositeModel || input.worldExpressionModel || input.compositePacket) scores[CATEGORY.COMPOSITE] += 10;
      if (input.worldExpressionPacket || input.worldExpressionNodes || input.compositeNodes) scores[CATEGORY.WORLD_EXPRESSION] += 10;
      if (Array.isArray(input.surfaceSeeds) || Array.isArray(input.surfaceFormationFields)) scores[CATEGORY.SURFACE] += 5;
      if (Array.isArray(input.materialBands) || Array.isArray(input.materialFamilies)) scores[CATEGORY.MATERIALS] += 5;
      if (Array.isArray(input.massAnchors) || isObject(input.massModel)) scores[CATEGORY.MASS] += 5;
      if (isObject(input.boundaryModel) || input.radius || input.edgeSoftness) scores[CATEGORY.BOUNDARY] += 5;
      if (isObject(input.lightModel) || input.lightVector || input.shadow) scores[CATEGORY.LIGHT] += 5;
      if (Array.isArray(input.clickZones) || Array.isArray(input.inspectZones)) scores[CATEGORY.INSPECT] += 5;
      if (isObject(input.compositionModel) || Array.isArray(input.layers)) scores[CATEGORY.COMPOSITION] += 5;
      if (isObject(input.airModel) || isObject(input.atmosphereModel)) scores[CATEGORY.AIR_CHANNEL] += 5;
      if (Array.isArray(input.cliffs) || Array.isArray(input.ridges)) scores[CATEGORY.CLIFFS] += 5;
      if (Array.isArray(input.coasts) || Array.isArray(input.basins) || Array.isArray(input.shelves)) scores[CATEGORY.HYDROLOGY_INTERFACE] += 5;
    }

    let category = CATEGORY.UNKNOWN;
    let score = 0;

    for (const [candidate, candidateScore] of Object.entries(scores)) {
      if (candidate === CATEGORY.UNKNOWN) continue;
      if (candidateScore > score) {
        category = candidate;
        score = candidateScore;
      }
    }

    const confidence = score >= 12 ? "EXPLICIT" : score >= 5 ? "STRONG" : score >= 2 ? "PARTIAL" : "LOW";

    return {
      category,
      confidence,
      score,
      explicitCategory: explicit,
      scores,
      classificationComplete: category !== CATEGORY.UNKNOWN,
      surfacePointerOwnsFinalCategoryAuthority: false,
      surfacePointerOwnsRoutingAuthority: true,
      pointerBishopOwnsFinalCategoryAuthority: false,
      pointerBishopOwnsRoutingAuthority: true,
      ...FINAL_FALSE
    };
  }

  function classifyExternalExpression(input = {}, options = {}) {
    return {
      ...classifyByKeywords(input, options),
      classificationLane: "external-donor"
    };
  }

  function classifyInternalExpression(input = {}, options = {}) {
    const result = classifyByKeywords(input, options);

    if (result.category === CATEGORY.UNKNOWN) {
      const packetType = safeString(input.packetType || input.packetName || "").toUpperCase();
      const sourceFile = safeString(input.sourceFile || input.file || "").toLowerCase();

      if (packetType.includes("COMPOSITE") || sourceFile.includes("composite")) {
        result.category = CATEGORY.COMPOSITE;
        result.confidence = "STRUCTURAL";
        result.score = Math.max(result.score, 8);
        result.classificationComplete = true;
      } else if (packetType.includes("WORLD_EXPRESSION")) {
        result.category = CATEGORY.WORLD_EXPRESSION;
        result.confidence = "STRUCTURAL";
        result.score = Math.max(result.score, 8);
        result.classificationComplete = true;
      } else if (packetType.includes("BISHOP") || packetType.includes("FINGER")) {
        result.category = CATEGORY.SURFACE;
        result.confidence = "STRUCTURAL";
        result.score = Math.max(result.score, 5);
        result.classificationComplete = true;
      }
    }

    return {
      ...result,
      classificationLane: "internal-bishop-finger"
    };
  }

  function nextExternalId() {
    return `SURFACE_POINTER_BISHOP_EXTERNAL_${String(state.externalIntakeCount + 1).padStart(4, "0")}`;
  }

  function nextInternalId() {
    return `SURFACE_POINTER_BISHOP_INTERNAL_${String(state.internalIntakeCount + 1).padStart(4, "0")}`;
  }

  function normalizeExternalExpression(input = {}, options = {}) {
    const id = safeString(options.id || input.id || input.donorId || input.packetId || nextExternalId());
    const sourceName = safeString(options.sourceName || input.sourceName || input.donorName || input.name || "EXTERNAL_DONOR_EXPRESSION");
    const sourceFile = safeString(options.sourceFile || input.sourceFile || input.file || input.donorFile || "UNKNOWN");
    const sourceContract = safeString(options.sourceContract || input.sourceContract || input.contract || "UNKNOWN");
    const sourceReceipt = safeString(options.sourceReceipt || input.sourceReceipt || input.receipt || "UNKNOWN");

    return {
      id,
      receivedAt: nowIso(),
      packetType: "HEARTH_SURFACE_POINTER_BISHOP_EXTERNAL_EXPRESSION_INTAKE_PACKET",
      pointerContract: CONTRACT,
      pointerReceipt: RECEIPT,
      pointerFile: FILE,
      bishopName: BISHOP_NAME,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      sourceName,
      sourceFile,
      sourceContract,
      sourceReceipt,
      requestedCategory: safeString(options.category || getExplicitCategory(input) || "UNKNOWN"),
      payload: clonePlain(input),
      payloadSummary: getObjectText(input, 2200),
      externalInformationReceivedThroughSurfaceOnly: true,
      surfaceOwnsRouting: true,
      surfaceOwnsExternalSocket: true,
      pointerBishopOwnsExternalSocket: true,
      surfaceOwnsFinalCategoryTruth: false,
      pointerBishopOwnsFinalCategoryTruth: false,
      ...FINAL_FALSE
    };
  }

  function normalizeInternalExpression(input = {}, options = {}) {
    const id = safeString(options.id || input.id || input.packetId || input.packetName || nextInternalId());
    const sourceName = safeString(options.sourceName || input.sourceName || input.fingerName || input.bishopName || input.name || "INTERNAL_BISHOP_FINGER_EXPRESSION");
    const sourceFile = safeString(options.sourceFile || input.sourceFile || input.file || "UNKNOWN");
    const sourceContract = safeString(options.sourceContract || input.sourceContract || input.contract || "UNKNOWN");
    const sourceReceipt = safeString(options.sourceReceipt || input.sourceReceipt || input.receipt || "UNKNOWN");

    return {
      id,
      receivedAt: nowIso(),
      packetType: "HEARTH_SURFACE_POINTER_BISHOP_INTERNAL_EXPRESSION_INTAKE_PACKET",
      pointerContract: CONTRACT,
      pointerReceipt: RECEIPT,
      pointerFile: FILE,
      bishopName: BISHOP_NAME,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      sourceName,
      sourceFile,
      sourceContract,
      sourceReceipt,
      requestedCategory: safeString(options.category || getExplicitCategory(input) || "UNKNOWN"),
      payload: clonePlain(input),
      payloadSummary: getObjectText(input, 2600),
      internalInformationReceivedThroughSurfacePointer: true,
      externalInformationReceivedThroughSurfaceOnly: false,
      surfaceOwnsRouting: true,
      surfaceOwnsInternalSocket: true,
      pointerBishopOwnsInternalSocket: true,
      surfaceOwnsFinalCategoryTruth: false,
      pointerBishopOwnsFinalCategoryTruth: false,
      ...FINAL_FALSE
    };
  }

  function incrementCategory(category) {
    const key = category || CATEGORY.UNKNOWN;
    state.categoryCounts[key] = safeNumber(state.categoryCounts[key], 0) + 1;
  }

  function incrementInternalCategory(category) {
    const key = category || CATEGORY.UNKNOWN;
    state.internalCategoryCounts[key] = safeNumber(state.internalCategoryCounts[key], 0) + 1;
  }

  function extractSurfaceFormationField(payload, classification) {
    const source = isObject(payload) ? payload : {};
    const fields = [];

    const directFields = Array.isArray(source.surfaceFormationFields)
      ? source.surfaceFormationFields
      : Array.isArray(source.surfaceSeeds)
        ? source.surfaceSeeds
        : Array.isArray(source.fields)
          ? source.fields
          : [];

    for (const entry of directFields.slice(0, 64)) {
      if (!isObject(entry)) continue;

      fields.push({
        id: safeString(entry.id || entry.name || `SURFACE_POINTER_BISHOP_DONOR_FIELD_${fields.length + 1}`),
        u: clamp(entry.u ?? entry.x ?? entry.cx ?? entry.centerX ?? 0.5, 0, 1),
        v: clamp(entry.v ?? entry.y ?? entry.cy ?? entry.centerY ?? 0.5, 0, 1),
        lon: safeNumber(entry.lon ?? ((clamp(entry.u ?? entry.x ?? 0.5, 0, 1) * 360) - 180), 0),
        lat: safeNumber(entry.lat ?? (90 - clamp(entry.v ?? entry.y ?? 0.5, 0, 1) * 180), 0),
        scale: clamp(entry.scale ?? entry.radius ?? entry.size ?? 0.16, 0.02, 0.8),
        value: clamp(entry.value ?? entry.weight ?? entry.strength ?? 0.55, 0, 1),
        donorCategory: classification.category,
        donorConfidence: classification.confidence,
        ownsTruth: false
      });
    }

    if (!fields.length) {
      fields.push({
        id: `SURFACE_POINTER_BISHOP_DONOR_${state.surfaceIntegratedCount + 1}`,
        u: 0.5,
        v: 0.5,
        lon: 0,
        lat: 0,
        scale: classification.category === CATEGORY.HYDROLOGY_INTERFACE ? 0.24 : 0.2,
        value: classification.category === CATEGORY.HYDROLOGY_INTERFACE ? 0.42 : 0.56,
        donorCategory: classification.category,
        donorConfidence: classification.confidence,
        ownsTruth: false
      });
    }

    return fields;
  }

  function extractCompositeBridgeFields(payload, classification) {
    const source = isObject(payload) ? payload : {};
    const model = isObject(source.compositeModel)
      ? source.compositeModel
      : isObject(source.worldExpressionModel)
        ? source.worldExpressionModel
        : isObject(source.compositePacket) && isObject(source.compositePacket.compositeModel)
          ? source.compositePacket.compositeModel
          : isObject(source.worldExpressionPacket) && isObject(source.worldExpressionPacket.compositeModel)
            ? source.worldExpressionPacket.compositeModel
            : isObject(source.worldExpressionPacket) && isObject(source.worldExpressionPacket.worldExpressionModel)
              ? source.worldExpressionPacket.worldExpressionModel
              : source;

    const nodes = Array.isArray(model.compositeNodes)
      ? model.compositeNodes
      : Array.isArray(model.worldExpressionNodes)
        ? model.worldExpressionNodes
        : Array.isArray(source.compositeNodes)
          ? source.compositeNodes
          : [];

    const fields = [];

    if (nodes.length) {
      const step = Math.max(1, Math.floor(nodes.length / 48));

      for (let index = 0; index < nodes.length && fields.length < 64; index += step) {
        const node = nodes[index];
        if (!isObject(node)) continue;

        const u = clamp(node.u ?? node.x ?? ((safeNumber(node.col, 8) + 0.5) / 16), 0, 1);
        const v = clamp(node.v ?? node.y ?? ((safeNumber(node.row, 8) + 0.5) / 16), 0, 1);

        fields.push({
          id: safeString(node.id || `SURFACE_POINTER_BISHOP_INTERNAL_COMPOSITE_FIELD_${fields.length + 1}`),
          u,
          v,
          lon: safeNumber(node.lon ?? (u * 360 - 180), 0),
          lat: safeNumber(node.lat ?? (90 - v * 180), 0),
          scale: clamp(0.045 + safeNumber(node.visibleScore, 0.4) * 0.09, 0.035, 0.28),
          value: clamp(safeNumber(node.visibleScore, 0.54), 0, 1),
          donorCategory: classification.category,
          donorConfidence: classification.confidence,
          compositeClass: safeString(node.compositeClass || ""),
          sourceNodeId: safeString(node.id || ""),
          ownsTruth: false
        });
      }
    }

    if (!fields.length) {
      fields.push({
        id: `SURFACE_POINTER_BISHOP_INTERNAL_COMPOSITE_BRIDGE_${state.internalSurfaceBridgeCount + 1}`,
        u: 0.5,
        v: 0.5,
        lon: 0,
        lat: 0,
        scale: 0.23,
        value: 0.58,
        donorCategory: classification.category,
        donorConfidence: classification.confidence,
        compositeClass: "composite-bridge-standard",
        ownsTruth: false
      });
    }

    return fields;
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
      } else if (isFunction(found.source.getBishopPacket)) {
        packet = found.source.getBishopPacket();
      } else if (isFunction(found.source.getReceipt)) {
        receipt = found.source.getReceipt();
        packet = receipt && (receipt.boundaryPacket || receipt.bishopPacket) ? (receipt.boundaryPacket || receipt.bishopPacket) : null;
      } else if (isFunction(found.source.getReceiptLight)) {
        receipt = found.source.getReceiptLight();
      }
    } catch (error) {
      recordError("SURFACE_POINTER_BISHOP_BOUNDARY_READ_FAILED", error, { sourceName: found.sourceName });
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
      } else if (isFunction(found.source.getBishopPacket)) {
        packet = found.source.getBishopPacket();
      } else if (isFunction(found.source.getReceipt)) {
        receipt = found.source.getReceipt();
        packet = receipt && (receipt.massPacket || receipt.bishopPacket) ? (receipt.massPacket || receipt.bishopPacket) : null;
      } else if (isFunction(found.source.getReceiptLight)) {
        receipt = found.source.getReceiptLight();
      }
    } catch (error) {
      recordError("SURFACE_POINTER_BISHOP_MASS_READ_FAILED", error, { sourceName: found.sourceName });
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

  function standardBoundaryModel() {
    return {
      modelType: "HEARTH_SURFACE_POINTER_BISHOP_STANDARD_BOUNDARY_MODEL",
      centerX: 0.5,
      centerY: 0.5,
      radius: 0.47,
      innerRadius: 0.427,
      outerRadius: 0.486,
      edgeSoftness: 0.055,
      localStandardUsed: true,
      finalGeometryClaim: false,
      finalVisualClaim: false
    };
  }

  function standardMassModel(boundaryModel) {
    const b = boundaryModel || standardBoundaryModel();

    return {
      modelType: "HEARTH_SURFACE_POINTER_BISHOP_STANDARD_MASS_MODEL",
      centerX: safeNumber(b.centerX, 0.5),
      centerY: safeNumber(b.centerY, 0.5),
      radius: safeNumber(b.radius, 0.47),
      massAnchors: [
        { id: "SURFACE_POINTER_BISHOP_NW", u: 0.35, v: 0.39, lon: -54, lat: 20, scale: 0.22, weight: 0.7 },
        { id: "SURFACE_POINTER_BISHOP_C", u: 0.5, v: 0.52, lon: 0, lat: -4, scale: 0.25, weight: 0.8 },
        { id: "SURFACE_POINTER_BISHOP_SE", u: 0.61, v: 0.64, lon: 40, lat: -26, scale: 0.2, weight: 0.62 }
      ],
      localStandardUsed: true,
      terrainTruthClaim: false,
      materialTruthClaim: false,
      elevationTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function baseMaterialFamilies() {
    return [
      { id: "SURFACE_DRY_HIGH_TONE", label: "dry-rock-soil-first-pass", threshold: 0.62, tint: "rock-soil", ownsTruth: false },
      { id: "SURFACE_MID_BODY_TONE", label: "weathered-ground-first-pass", threshold: 0.38, tint: "weathered-ground", ownsTruth: false },
      { id: "SURFACE_LOW_BODY_TONE", label: "low-shadow-shelf-first-pass", threshold: 0.18, tint: "low-body-shadow", ownsTruth: false },
      { id: "SURFACE_BOUNDARY_EDGE_TONE", label: "body-edge-readability", threshold: 0.05, tint: "edge-readability", ownsTruth: false }
    ];
  }

  function baseSurfaceFields() {
    return BODY_MASSES.map((mass, index) => ({
      id: `SURFACE_POINTER_BISHOP_${mass.key.toUpperCase()}`,
      u: wrap01((mass.lon + 180) / 360),
      v: clamp01((90 - mass.lat) / 180),
      lon: mass.lon,
      lat: mass.lat,
      scale: clamp((mass.rx + mass.ry) / 360, 0.06, 0.36),
      value: clamp(0.48 + index * 0.035, 0.38, 0.78),
      donorCategory: CATEGORY.SURFACE,
      donorConfidence: "STANDARD",
      ownsTruth: false
    }));
  }

  function buildSurfaceModel(options = {}) {
    const boundaryEvidence = readBoundaryEvidence();
    const massEvidence = readMassEvidence();

    const boundaryModel = boundaryEvidence.model || standardBoundaryModel();
    const massModel = massEvidence.model || standardMassModel(boundaryModel);

    const materialFamilies = [
      ...baseMaterialFamilies(),
      ...state.surfaceMaterialFamilies.map((family) => ({
        id: family.id,
        label: family.label,
        threshold: family.category === CATEGORY.HYDROLOGY_INTERFACE ? 0.24 : 0.5,
        tint: family.category,
        ownsTruth: false,
        sourceName: family.sourceName,
        sourceFile: family.sourceFile
      }))
    ];

    const surfaceFields = [
      ...baseSurfaceFields(),
      ...state.surfaceFormationFields.map((field) => ({
        id: field.id,
        u: clamp(field.u, 0, 1),
        v: clamp(field.v, 0, 1),
        lon: safeNumber(field.lon, field.u * 360 - 180),
        lat: safeNumber(field.lat, 90 - field.v * 180),
        scale: clamp(field.scale, 0.02, 0.8),
        value: clamp(field.value, 0, 1),
        externalPacketId: field.externalPacketId,
        donorCategory: field.donorCategory,
        sourceName: field.sourceName,
        ownsTruth: false
      })),
      ...state.internalSurfaceBridgeFields.map((field) => ({
        id: field.id,
        u: clamp(field.u, 0, 1),
        v: clamp(field.v, 0, 1),
        lon: safeNumber(field.lon, field.u * 360 - 180),
        lat: safeNumber(field.lat, 90 - field.v * 180),
        scale: clamp(field.scale, 0.02, 0.8),
        value: clamp(field.value, 0, 1),
        internalPacketId: field.internalPacketId,
        donorCategory: field.donorCategory,
        compositeClass: field.compositeClass,
        sourceName: field.sourceName,
        ownsTruth: false
      }))
    ];

    const model = {
      modelType: "HEARTH_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_MODEL",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      route: ROUTE,

      bishopName: BISHOP_NAME,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,

      hexExpressionSocketActive: true,
      hexSurfaceExpressionAuthority: true,
      hexSurfaceProjectionDelegated: true,
      canvasDrawingDelegatedToHexSurface: true,
      directCanvasDrawingSuppressed: true,

      boundaryModel: clonePlain(boundaryModel),
      massModel: clonePlain(massModel),

      boundaryDependencyObserved: boundaryEvidence.observed,
      boundaryPacketObserved: Boolean(boundaryEvidence.packet),
      boundaryModelObserved: Boolean(boundaryEvidence.model),

      massDependencyObserved: massEvidence.observed,
      massPacketObserved: Boolean(massEvidence.packet),
      massModelObserved: Boolean(massEvidence.model),

      materialBands: materialFamilies,
      surfaceMaterialFamilies: clonePlain(materialFamilies),
      surfaceSeeds: surfaceFields,
      surfaceFormationFields: clonePlain(surfaceFields),

      surfaceMode: "POINTER_BISHOP_HEX_EXPRESSION_SOCKET",
      surfaceCoordinateSpace: "lon-lat-u-v",
      projectionOwner: HEX_SURFACE_FILE,
      canvasDrawingOwner: HEX_SURFACE_FILE,

      externalExpressionSocketActive: true,
      singleExternalInputReceiver: true,
      internalExpressionSocketActive: true,
      internalFingerPacketReceiver: true,
      internalBishopPacketReceiver: true,
      compositePacketReceiver: true,
      worldExpressionPacketReceiver: true,

      surfaceIntegratedDonorCount: state.surfaceIntegratedDonors.length,
      heldDonorQueueCount: state.heldDonorQueue.length,
      internalAcceptedCount: state.internalAcceptedCount,
      internalHeldCount: state.internalHeldCount,
      compositeInternalPacketCount: state.compositeInternalPacketCount,
      worldExpressionInternalPacketCount: state.worldExpressionInternalPacketCount,
      internalSurfaceBridgeCount: state.internalSurfaceBridgeCount,

      terrainTruthClaim: false,
      hydrologyTruthClaim: false,
      materialTruthClaim: false,
      elevationTruthClaim: false,
      compositeTruthClaim: false,
      finalGeometryClaim: false,
      finalVisualClaim: false
    };

    state.surfaceModel = clonePlain(model);
    state.surfaceModelReady = true;
    state.firstSurfaceDifferentiationReady = true;
    state.roughTerrainTintReady = true;
    state.shallowMaterialVariationReady = true;
    state.visibleContributionAvailable = true;
    state.surfaceExpressionReady = true;
    state.hexSurfaceExpressionReady = true;

    return model;
  }

  function normalizeCoord(input = {}) {
    const packet = isObject(input) ? input : {};
    const coord = isObject(packet.coord) ? packet.coord : packet;

    let u = coord.u;
    let v = coord.v;
    let lon = coord.lon;
    let lat = coord.lat;

    if (lon === undefined && coord.longitude !== undefined) lon = coord.longitude;
    if (lat === undefined && coord.latitude !== undefined) lat = coord.latitude;

    if ((u === undefined || v === undefined) && lon !== undefined && lat !== undefined) {
      u = wrap01((safeNumber(lon, 0) + 180) / 360);
      v = clamp01((90 - safeNumber(lat, 0)) / 180);
    }

    if ((lon === undefined || lat === undefined) && u !== undefined && v !== undefined) {
      lon = wrapDeg(wrap01(u) * 360 - 180);
      lat = 90 - clamp01(v) * 180;
    }

    if ((u === undefined || v === undefined) && coord.x !== undefined && coord.y !== undefined) {
      u = clamp01(coord.x);
      v = clamp01(coord.y);
      lon = wrapDeg(u * 360 - 180);
      lat = 90 - v * 180;
    }

    u = wrap01(u === undefined ? 0.5 : u);
    v = clamp01(v === undefined ? 0.5 : v);
    lon = wrapDeg(lon === undefined ? u * 360 - 180 : lon);
    lat = clamp(lat === undefined ? 90 - v * 180 : lat, -90, 90);

    return {
      u,
      v,
      lon,
      lat,
      lonDegrees: lon,
      latDegrees: lat,
      x: coord.x,
      y: coord.y,
      z: coord.z
    };
  }

  function fieldInfluence(coord, field) {
    const lonDistance = degDistance(coord.lon, safeNumber(field.lon, field.u * 360 - 180)) / 180;
    const latDistance = (coord.lat - safeNumber(field.lat, 90 - field.v * 180)) / 90;
    const scale = Math.max(0.0001, safeNumber(field.scale, 0.16));
    const d2 = (lonDistance * lonDistance) + (latDistance * latDistance);
    return Math.exp(-(d2 / (2 * scale * scale))) * safeNumber(field.value, 0.5);
  }

  function bodyMassField(coord) {
    let best = {
      field: -999,
      massKey: "",
      coast: 0,
      ridge: 0,
      basin: 0,
      mineral: 0
    };

    for (let i = 0; i < BODY_MASSES.length; i += 1) {
      const mass = BODY_MASSES[i];
      const dx = degDistance(coord.lon, mass.lon) * Math.cos(mass.lat * Math.PI / 180);
      const dy = coord.lat - mass.lat;
      const ca = Math.cos(mass.angle * Math.PI / 180);
      const sa = Math.sin(mass.angle * Math.PI / 180);
      const x = dx * ca - dy * sa;
      const y = dx * sa + dy * ca;
      const nx = x / mass.rx;
      const ny = y / mass.ry;
      const theta = Math.atan2(ny, nx);
      const dist = Math.sqrt(nx * nx + ny * ny);

      const angularCut =
        Math.sin(theta * (5 + i) + i * 0.71) * 0.055 +
        Math.sin(theta * (9 + i) - i * 0.43) * 0.038;

      const fracture = (fbm(coord.u * 18 + i * 3.1, coord.v * 12 - i * 2.4, 710 + i * 53, 4) - 0.5) * 0.22;
      const bayCut = smoothstep(0.58, 0.92, fbm(coord.u * 36 - i * 2.7, coord.v * 26 + i * 4.2, 910 + i * 79, 3)) * 0.11;
      const field = 1 - dist + angularCut + fracture - bayCut;

      if (field > best.field) {
        const ridge = smoothstep(0.44, 0.91, fbm(coord.u * 12 + i, coord.v * 15 - i, 1200 + i * 41, 5));
        const basin = smoothstep(0.10, 0.38, 1 - ridge);
        const mineral = smoothstep(0.62, 0.96, fbm(coord.u * 44 + i * 2, coord.v * 41 - i * 3, 1500 + i * 83, 3));

        best = {
          field,
          massKey: mass.key,
          coast: smoothstep(0, 0.88, 1 - clamp(Math.abs(field) * 16, 0, 1)),
          ridge,
          basin,
          mineral
        };
      }
    }

    return best;
  }

  function composeExpressionColor(expression) {
    const isLand = expression.isLand === true;
    const grain = clamp01(expression.grain);
    const relief = clamp01(expression.relief);
    const coast = clamp01(expression.coast);
    const mineral = clamp01(expression.mineral);
    const cold = clamp01(expression.cold);
    const arid = clamp01(expression.arid);
    const wet = clamp01(expression.wet);
    const shelf = clamp01(expression.shelf);
    const deep = clamp01(expression.deep);
    const basin = clamp01(expression.basin);

    let color;

    if (isLand) {
      color = COLOR.landLow.slice();
      color = mixColor(color, COLOR.landWarm, arid * 0.42);
      color = mixColor(color, COLOR.landWet, wet * 0.38);
      color = mixColor(color, COLOR.ridge, relief * 0.34);
      color = mixColor(color, COLOR.granite, relief * relief * 0.30);
      color = mixColor(color, COLOR.cliff, clamp01(relief * coast) * 0.24);
      color = mixColor(color, COLOR.snow, cold * relief * 0.48);
      color = mixColor(color, COLOR.copper, mineral * 0.08);
      color = mixColor(color, COLOR.opal, mineral * coast * 0.10);
    } else {
      color = COLOR.ocean.slice();
      color = mixColor(color, COLOR.deep, deep * 0.55);
      color = mixColor(color, COLOR.abyss, deep * deep * 0.36);
      color = mixColor(color, COLOR.shelf, shelf * 0.58);
      color = mixColor(color, COLOR.foam, shelf * coast * 0.16);
    }

    const micro =
      (grain - 0.5) * 0.31 +
      (relief - 0.5) * (isLand ? 0.18 : 0.04) -
      basin * (isLand ? 0.07 : 0.02);

    return multiplyColor(color, clamp(1 + micro, 0.72, 1.28));
  }

  function materialClassFor(expression) {
    if (expression.isWater) {
      if (expression.shelf > 0.55) return "shallow-shelf-water";
      if (expression.deep > 0.78) return "deep-ocean-basin";
      return "ocean-body";
    }

    if (expression.cold > 0.72 && expression.relief > 0.48) return "cold-highland";
    if (expression.relief > 0.72) return "ridge-and-cliff";
    if (expression.arid > 0.64) return "dry-rock-soil";
    if (expression.wet > 0.58) return "wet-weathered-ground";
    return "weathered-land-body";
  }

  function sampleSurfaceExpression(input = {}, options = {}) {
    const request = isObject(input) ? input : {};
    const model = state.surfaceModel || buildSurfaceModel();
    const coord = normalizeCoord(request);
    const hexPacket = isObject(request.hexPacket) ? request.hexPacket : request;

    state.hexExpressionRequestCount += 1;

    if (hasForbiddenClaim(request)) {
      state.hexExpressionRejectedCount += 1;
      state.updatedAt = nowIso();

      return {
        ok: false,
        rejected: true,
        rejectedReason: "FORBIDDEN_CLAIM",
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        sourceFile: FILE,
        consumerFile: HEX_SURFACE_FILE,
        surfaceExpressionAuthority: true,
        ...FINAL_FALSE
      };
    }

    const bodyField = bodyMassField(coord);

    let donorInfluence = 0;
    let hydrologyInterface = 0;
    let compositeInfluence = 0;

    const fields = Array.isArray(model.surfaceFormationFields) ? model.surfaceFormationFields : [];

    for (const field of fields) {
      const influence = fieldInfluence(coord, field);
      donorInfluence += influence;

      if (field.donorCategory === CATEGORY.HYDROLOGY_INTERFACE) hydrologyInterface += influence;
      if (field.donorCategory === CATEGORY.COMPOSITE || field.donorCategory === CATEGORY.WORLD_EXPRESSION) {
        compositeInfluence += influence;
      }
    }

    const grain = fbm(coord.u * 32 + safeNumber(hexPacket.stateId, 0) * 0.031, coord.v * 24 - safeNumber(hexPacket.stateId, 0) * 0.027, 2200, 4);
    const localVariation = (grain - 0.5) * 0.18;
    const field = bodyField.field + donorInfluence * 0.12 + compositeInfluence * 0.10 - hydrologyInterface * 0.08 + localVariation * 0.42;

    const isLand = field > 0;
    const coast = smoothstep(0, 0.88, 1 - clamp(Math.abs(field) * 16, 0, 1));
    const latAbs = Math.abs(coord.lat) / 90;
    const relief = isLand ? clamp01(bodyField.ridge * 0.72 + grain * 0.24 + compositeInfluence * 0.12) : 0;
    const shelf = !isLand ? smoothstep(-0.24, 0.04, field) * (0.45 + grain * 0.35 + hydrologyInterface * 0.10) : 0;
    const deep = !isLand ? clamp01(1 - shelf * 0.72) : 0;
    const cold = smoothstep(0.68, 0.98, latAbs);
    const arid = isLand ? smoothstep(0.62, 0.88, fbm(coord.u * 7, coord.v * 5, 2500, 3)) * (1 - cold * 0.4) : 0;
    const wet = isLand ? smoothstep(0.50, 0.86, fbm(coord.u * 9 + 8, coord.v * 8 - 4, 2600, 3)) * (1 - arid * 0.45) : 0;
    const mineral = clamp01(bodyField.mineral + compositeInfluence * 0.08);
    const basin = clamp01(bodyField.basin);
    const elevation = isLand ? clamp01(0.42 + relief * 0.42 + donorInfluence * 0.06 - coast * 0.10) : clamp01(-0.18 + shelf * 0.20 - deep * 0.28);
    const landPresence = isLand ? clamp01(0.5 + field * 0.55) : clamp01(0.5 + field * 0.15);
    const waterPresence = clamp01(1 - landPresence);

    const expressionBase = {
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      route: ROUTE,

      packetType: "HEARTH_SURFACE_POINTER_BISHOP_HEX_SURFACE_EXPRESSION_PACKET",
      expressionSource: "SURFACE_POINTER_BISHOP",
      sourceFile: FILE,
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,
      consumerFile: HEX_SURFACE_FILE,

      bishopName: BISHOP_NAME,
      bishopTitle: BISHOP_TITLE,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,

      hexExpressionSocketActive: true,
      surfaceExpressionAuthority: true,
      hexSurfaceExpressionAuthority: true,
      hexSurfaceConsumerExpected: true,
      hexSurfaceProjectionDelegated: true,
      canvasDrawingDelegatedToHexSurface: true,
      directCanvasDrawingSuppressed: true,

      coord: {
        u: coord.u,
        v: coord.v,
        lon: coord.lon,
        lat: coord.lat,
        lonDegrees: coord.lon,
        latDegrees: coord.lat,
        x: coord.x,
        y: coord.y,
        z: coord.z
      },

      hexPacket: {
        cellId: safeString(hexPacket.cellId || hexPacket.hexId || "UNKNOWN"),
        hexId: safeString(hexPacket.hexId || hexPacket.cellId || "UNKNOWN"),
        stateId: safeNumber(hexPacket.stateId, 0),
        stateClass: safeString(hexPacket.stateClass || ""),
        q: safeNumber(hexPacket.q, 0),
        r: safeNumber(hexPacket.r, 0),
        s: safeNumber(hexPacket.s, 0)
      },

      isLand,
      isWater: !isLand,
      landPresence,
      waterPresence,
      field,
      massKey: bodyField.massKey,
      coast,
      ridge: bodyField.ridge,
      relief,
      basin,
      shelf,
      deep,
      cold,
      arid,
      wet,
      mineral,
      grain,
      elevation,
      donorInfluence: clamp01(donorInfluence),
      hydrologyInterfaceInfluence: clamp01(hydrologyInterface),
      compositeInfluence: clamp01(compositeInfluence),

      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,

      terrainTruthClaimed: false,
      hydrologyTruthClaimed: false,
      materialTruthClaimed: false,
      elevationTruthClaimed: false,
      compositeTruthClaimed: false,

      ...FINAL_FALSE
    };

    const rgb = composeExpressionColor(expressionBase);
    const materialClass = materialClassFor(expressionBase);

    const expression = {
      ...expressionBase,
      rgb,
      color: rgb,
      materialClass,
      materialFamily: materialClass,
      ok: true,
      rejected: false,
      expressionReady: true,
      renderableByHexSurface: true,
      projectionRequired: true,
      canvasDrawRequiredDownstream: true
    };

    state.hexExpressionServedCount += 1;
    state.latestHexExpressionAt = nowIso();
    state.latestHexExpressionRequestSource = safeString(request.sourceFile || request.consumerFile || "HEX_SURFACE_OR_RENDERER");
    state.latestHexExpressionCellId = expression.hexPacket.cellId;
    state.latestHexExpressionMaterialClass = materialClass;
    state.latestHexExpressionLandPresence = landPresence;
    state.latestHexExpressionWaterPresence = waterPresence;
    state.updatedAt = state.latestHexExpressionAt;

    state.hexExpressionLedger.push({
      at: state.latestHexExpressionAt,
      cellId: expression.hexPacket.cellId,
      stateId: expression.hexPacket.stateId,
      u: coord.u,
      v: coord.v,
      lon: coord.lon,
      lat: coord.lat,
      materialClass,
      isLand,
      landPresence,
      waterPresence,
      source: state.latestHexExpressionRequestSource,
      ...FINAL_FALSE
    });
    trimArray(state.hexExpressionLedger, 160);

    updateDataset();

    return expression;
  }

  function sampleHexSurfaceExpression(packet = {}, options = {}) {
    return sampleSurfaceExpression(packet, {
      ...options,
      sourceName: options.sourceName || "HEX_SURFACE_EXPRESSION_REQUEST"
    });
  }

  function getRenderableSurfaceExpression(packet = {}, options = {}) {
    return sampleSurfaceExpression(packet, options);
  }

  function getSurfaceExpressionAt(packet = {}, options = {}) {
    return sampleSurfaceExpression(packet, options);
  }

  function receiveHexSurfaceExpressionRequest(packet = {}, options = {}) {
    return sampleHexSurfaceExpression(packet, options);
  }

  function sample(packet = {}, options = {}) {
    return sampleSurfaceExpression(packet, options);
  }

  function drawToCanvas() {
    return {
      drawn: false,
      reason: "SURFACE_POINTER_BISHOP_DOES_NOT_DRAW_CANVAS_HEX_SURFACE_OWNS_PROJECTION_AND_DRAWING",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      projectionOwner: HEX_SURFACE_FILE,
      canvasDrawingOwner: HEX_SURFACE_FILE,
      directCanvasDrawingSuppressed: true,
      ...FINAL_FALSE
    };
  }

  function integrateSurfaceVisibleExpression(normalized, classification) {
    const fields = extractSurfaceFormationField(normalized.payload, classification);

    for (const field of fields) {
      state.surfaceFormationFields.push({
        ...field,
        externalPacketId: normalized.id,
        sourceName: normalized.sourceName,
        sourceFile: normalized.sourceFile,
        integratedAt: nowIso()
      });
    }

    trimArray(state.surfaceFormationFields, 180);

    const family = {
      id: `SURFACE_POINTER_BISHOP_FAMILY_${state.surfaceIntegratedCount + 1}`,
      category: classification.category,
      label: classification.category === CATEGORY.HYDROLOGY_INTERFACE
        ? "wet-dry-contact-visible-interface"
        : "surface-visible-donor-expression",
      sourceName: normalized.sourceName,
      sourceFile: normalized.sourceFile,
      ownsTruth: false,
      materialTruthClaim: false,
      terrainTruthClaim: false,
      hydrologyTruthClaim: false,
      integratedAt: nowIso()
    };

    state.surfaceMaterialFamilies.push(family);
    trimArray(state.surfaceMaterialFamilies, 140);

    const integrated = {
      id: normalized.id,
      category: classification.category,
      status: ROUTING_STATUS.INTEGRATED_BY_SURFACE,
      integratedFields: fields.length,
      targetFile: FILE,
      targetAuthority: "surface-expression",
      sourceName: normalized.sourceName,
      sourceFile: normalized.sourceFile,
      integratedAt: nowIso(),
      ...FINAL_FALSE
    };

    state.surfaceIntegratedDonors.push(integrated);
    trimArray(state.surfaceIntegratedDonors, 140);
    state.surfaceIntegratedCount += 1;
    state.latestExternalPacketStatus = ROUTING_STATUS.INTEGRATED_BY_SURFACE;

    buildSurfaceModel({ rebuildFromPointerFields: true });
    buildSurfacePacket();
    buildPointerBishopPacket();

    record("SURFACE_POINTER_BISHOP_INTEGRATED_SURFACE_VISIBLE_EXPRESSION", integrated);
    return integrated;
  }

  function holdDonor(normalized, classification, reason, detail = {}) {
    const held = {
      id: normalized.id,
      category: classification.category,
      confidence: classification.confidence,
      status: ROUTING_STATUS.HELD_FOR_RECEIVER_RENEWAL,
      heldReason: reason,
      targetFile: FILE,
      targetAuthority: "surface-expression-or-downstream-receiver",
      sourceName: normalized.sourceName,
      sourceFile: normalized.sourceFile,
      sourceContract: normalized.sourceContract,
      payloadSummary: normalized.payloadSummary,
      payload: clonePlain(normalized.payload),
      detail: clonePlain(detail),
      heldAt: nowIso(),
      ...FINAL_FALSE
    };

    state.heldDonorQueue.push(held);
    trimArray(state.heldDonorQueue, 160);
    state.heldExpressionCount += 1;
    state.latestExternalPacketStatus = ROUTING_STATUS.HELD_FOR_RECEIVER_RENEWAL;

    record("SURFACE_POINTER_BISHOP_HELD_EXTERNAL_EXPRESSION", held);
    return held;
  }

  function rejectDonor(normalized, classification, reason) {
    const rejected = {
      id: normalized.id,
      category: classification.category,
      confidence: classification.confidence,
      status: reason === "FORBIDDEN_CLAIM" ? ROUTING_STATUS.REJECTED_FORBIDDEN_CLAIM : ROUTING_STATUS.REJECTED_UNCLASSIFIED,
      rejectedReason: reason,
      sourceName: normalized.sourceName,
      sourceFile: normalized.sourceFile,
      sourceContract: normalized.sourceContract,
      payloadSummary: normalized.payloadSummary,
      rejectedAt: nowIso(),
      ...FINAL_FALSE
    };

    state.rejectedDonorQueue.push(rejected);
    trimArray(state.rejectedDonorQueue, 100);
    state.rejectedExpressionCount += 1;
    state.latestExternalPacketStatus = rejected.status;

    record("SURFACE_POINTER_BISHOP_REJECTED_EXTERNAL_EXPRESSION", rejected);
    return rejected;
  }

  function holdInternal(normalized, classification, reason, detail = {}) {
    const held = {
      id: normalized.id,
      category: classification.category,
      confidence: classification.confidence,
      status: ROUTING_STATUS.INTERNAL_HELD_BY_SURFACE,
      heldReason: reason,
      sourceName: normalized.sourceName,
      sourceFile: normalized.sourceFile,
      sourceContract: normalized.sourceContract,
      payloadSummary: normalized.payloadSummary,
      payload: clonePlain(normalized.payload),
      detail: clonePlain(detail),
      heldAt: nowIso(),
      ...FINAL_FALSE
    };

    state.internalHeldQueue.push(held);
    trimArray(state.internalHeldQueue, 160);
    state.internalHeldCount += 1;
    state.latestInternalPacketStatus = ROUTING_STATUS.INTERNAL_HELD_BY_SURFACE;

    record("SURFACE_POINTER_BISHOP_HELD_INTERNAL_EXPRESSION", held);
    return held;
  }

  function rejectInternal(normalized, classification, reason) {
    const rejected = {
      id: normalized.id,
      category: classification.category,
      confidence: classification.confidence,
      status: reason === "FORBIDDEN_CLAIM" ? ROUTING_STATUS.REJECTED_FORBIDDEN_CLAIM : ROUTING_STATUS.REJECTED_UNCLASSIFIED,
      rejectedReason: reason,
      sourceName: normalized.sourceName,
      sourceFile: normalized.sourceFile,
      sourceContract: normalized.sourceContract,
      payloadSummary: normalized.payloadSummary,
      rejectedAt: nowIso(),
      ...FINAL_FALSE
    };

    state.internalRejectedQueue.push(rejected);
    trimArray(state.internalRejectedQueue, 100);
    state.internalRejectedCount += 1;
    state.latestInternalPacketStatus = rejected.status;

    record("SURFACE_POINTER_BISHOP_REJECTED_INTERNAL_EXPRESSION", rejected);
    return rejected;
  }

  function acceptInternalExpression(normalized, classification) {
    const fields = extractCompositeBridgeFields(normalized.payload, classification);

    for (const field of fields) {
      state.internalSurfaceBridgeFields.push({
        ...field,
        internalPacketId: normalized.id,
        sourceName: normalized.sourceName,
        sourceFile: normalized.sourceFile,
        integratedAt: nowIso()
      });
    }

    trimArray(state.internalSurfaceBridgeFields, 180);
    state.internalSurfaceBridgeCount += fields.length;

    const accepted = {
      id: normalized.id,
      category: classification.category,
      status: ROUTING_STATUS.INTERNAL_ACCEPTED_BY_SURFACE,
      acceptedFields: fields.length,
      sourceName: normalized.sourceName,
      sourceFile: normalized.sourceFile,
      sourceContract: normalized.sourceContract,
      acceptedAt: nowIso(),
      internalPacketStored: true,
      treatedAsExternalDonor: false,
      surfaceOwnsCompositeTruth: false,
      surfaceOwnsWorldExpressionTruth: false,
      pointerBishopOwnsCompositeTruth: false,
      pointerBishopOwnsWorldExpressionTruth: false,
      ...FINAL_FALSE
    };

    state.internalAcceptedLedger.push(accepted);
    trimArray(state.internalAcceptedLedger, 160);
    state.internalAcceptedCount += 1;
    state.latestInternalPacketStatus = ROUTING_STATUS.INTERNAL_ACCEPTED_BY_SURFACE;

    state.internalExpressionPacket = clonePlain(normalized.payload);

    if (classification.category === CATEGORY.COMPOSITE) {
      state.compositeInternalPacketCount += 1;
      state.compositeInternalPackets.push(clonePlain(normalized.payload));
      trimArray(state.compositeInternalPackets, 40);
      state.compositeBridgePacket = clonePlain(normalized.payload);
    }

    if (classification.category === CATEGORY.WORLD_EXPRESSION) {
      state.worldExpressionInternalPacketCount += 1;
      state.worldExpressionInternalPackets.push(clonePlain(normalized.payload));
      trimArray(state.worldExpressionInternalPackets, 40);
      state.compositeBridgePacket = clonePlain(normalized.payload);
    }

    buildSurfaceModel({ rebuildFromInternalFields: true });
    buildSurfacePacket();
    buildPointerFingerPacket();
    buildPointerBishopPacket();

    record("SURFACE_POINTER_BISHOP_ACCEPTED_INTERNAL_EXPRESSION", accepted);
    return accepted;
  }

  function routeExternalExpression(normalized, classification) {
    if (
      classification.category === CATEGORY.SURFACE ||
      classification.category === CATEGORY.HYDROLOGY_INTERFACE ||
      classification.category === CATEGORY.MATERIALS ||
      classification.category === CATEGORY.COMPOSITION ||
      classification.category === CATEGORY.CLIFFS ||
      classification.category === CATEGORY.AIR_CHANNEL ||
      classification.category === CATEGORY.HEX_SURFACE
    ) {
      return integrateSurfaceVisibleExpression(normalized, classification);
    }

    return holdDonor(normalized, classification, "CATEGORY_ACKNOWLEDGED_NO_DIRECT_RECEIVER_IN_SURFACE_POINTER_BISHOP_v5");
  }

  function receiveExternalExpression(input = {}, options = {}) {
    const rawInput = isObject(input) ? input : {};
    const normalized = normalizeExternalExpression(rawInput, options);
    const classification = classifyExternalExpression(normalized.payload, options);

    state.externalIntakeCount += 1;
    state.classifiedExpressionCount += classification.classificationComplete ? 1 : 0;
    state.latestExternalPacketId = normalized.id;
    state.latestExternalPacketCategory = classification.category;

    incrementCategory(classification.category);

    state.externalIntakeLedger.push({
      id: normalized.id,
      sourceName: normalized.sourceName,
      sourceFile: normalized.sourceFile,
      sourceContract: normalized.sourceContract,
      requestedCategory: normalized.requestedCategory,
      receivedAt: normalized.receivedAt,
      ...FINAL_FALSE
    });
    trimArray(state.externalIntakeLedger, 180);

    state.classifiedLedger.push({
      id: normalized.id,
      category: classification.category,
      confidence: classification.confidence,
      score: classification.score,
      explicitCategory: classification.explicitCategory,
      classifiedAt: nowIso(),
      ...FINAL_FALSE
    });
    trimArray(state.classifiedLedger, 180);

    let result;

    if (hasForbiddenClaim(rawInput)) {
      result = rejectDonor(normalized, classification, "FORBIDDEN_CLAIM");
    } else if (!classification.classificationComplete || classification.category === CATEGORY.UNKNOWN) {
      result = rejectDonor(normalized, classification, "CATEGORY_UNCLASSIFIED");
    } else {
      result = routeExternalExpression(normalized, classification);
    }

    updateDataset();
    publishGlobals();

    return {
      ok: result.status !== ROUTING_STATUS.REJECTED_UNCLASSIFIED && result.status !== ROUTING_STATUS.REJECTED_FORBIDDEN_CLAIM,
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      externalPacketId: normalized.id,
      classification,
      routingResult: clonePlain(result),
      surfacePointerSocketActive: true,
      pointerBishopSocketActive: true,
      externalInformationReceivedThroughSurfaceOnly: true,
      internalExpressionSocketActive: true,
      hexExpressionSocketActive: true,
      ...FINAL_FALSE
    };
  }

  function receiveInternalExpression(input = {}, options = {}) {
    const rawInput = isObject(input) ? input : {};
    const normalized = normalizeInternalExpression(rawInput, options);
    const classification = classifyInternalExpression(normalized.payload, options);

    state.internalIntakeCount += 1;
    state.latestInternalPacketId = normalized.id;
    state.latestInternalPacketCategory = classification.category;
    state.latestInternalPacketSourceFile = normalized.sourceFile;

    incrementInternalCategory(classification.category);

    state.internalIntakeLedger.push({
      id: normalized.id,
      sourceName: normalized.sourceName,
      sourceFile: normalized.sourceFile,
      sourceContract: normalized.sourceContract,
      requestedCategory: normalized.requestedCategory,
      category: classification.category,
      receivedAt: normalized.receivedAt,
      treatedAsExternalDonor: false,
      ...FINAL_FALSE
    });
    trimArray(state.internalIntakeLedger, 180);

    let result;

    if (hasForbiddenClaim(rawInput)) {
      result = rejectInternal(normalized, classification, "FORBIDDEN_CLAIM");
    } else if (!classification.classificationComplete || classification.category === CATEGORY.UNKNOWN) {
      result = holdInternal(normalized, classification, "INTERNAL_CATEGORY_UNCLASSIFIED");
    } else if (
      classification.category === CATEGORY.COMPOSITE ||
      classification.category === CATEGORY.WORLD_EXPRESSION ||
      classification.category === CATEGORY.SURFACE ||
      classification.category === CATEGORY.HYDROLOGY_INTERFACE ||
      classification.category === CATEGORY.HEX_SURFACE ||
      classification.category === CATEGORY.MATERIALS ||
      classification.category === CATEGORY.COMPOSITION ||
      classification.category === CATEGORY.CLIFFS ||
      classification.category === CATEGORY.AIR_CHANNEL
    ) {
      result = acceptInternalExpression(normalized, classification);
    } else {
      result = holdInternal(normalized, classification, "INTERNAL_CATEGORY_ACKNOWLEDGED_NON_SURFACE_BRIDGE");
    }

    updateDataset();
    publishGlobals();

    return {
      ok: result.status !== ROUTING_STATUS.REJECTED_UNCLASSIFIED && result.status !== ROUTING_STATUS.REJECTED_FORBIDDEN_CLAIM,
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      internalPacketId: normalized.id,
      classification,
      routingResult: clonePlain(result),
      internalExpressionSocketActive: true,
      hexExpressionSocketActive: true,
      treatedAsExternalDonor: false,
      surfacePointerOwnsCompositeTruth: false,
      pointerBishopOwnsCompositeTruth: false,
      surfacePointerOwnsWorldExpressionTruth: false,
      pointerBishopOwnsWorldExpressionTruth: false,
      ...FINAL_FALSE
    };
  }

  function receiveExternalDonorExpression(input = {}, options = {}) {
    return receiveExternalExpression(input, options);
  }

  function receiveCanvasDonorExpression(input = {}, options = {}) {
    return receiveExternalExpression(input, {
      ...options,
      sourceName: options.sourceName || "CANVAS_DONOR_EXPRESSION"
    });
  }

  function receiveArchiveExpression(input = {}, options = {}) {
    return receiveExternalExpression(input, {
      ...options,
      sourceName: options.sourceName || "ARCHIVE_EXPRESSION_DONOR"
    });
  }

  function receiveInternalFingerPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "INTERNAL_FINGER_PACKET"
    });
  }

  function receiveInternalBishopPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "INTERNAL_BISHOP_PACKET"
    });
  }

  function receiveExpansionFingerPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "EXPANSION_FINGER_PACKET"
    });
  }

  function receiveExpansionBishopPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "EXPANSION_BISHOP_PACKET"
    });
  }

  function receiveCompositeFingerPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      category: CATEGORY.COMPOSITE,
      sourceName: options.sourceName || "COMPOSITE_FINGER_PACKET",
      sourceFile: options.sourceFile || COMPOSITE_FILE
    });
  }

  function receiveCompositeBishopPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      category: CATEGORY.COMPOSITE,
      sourceName: options.sourceName || "COMPOSITE_BISHOP_PACKET",
      sourceFile: options.sourceFile || COMPOSITE_FILE
    });
  }

  function receiveCompositePacket(packet = {}, options = {}) {
    return receiveCompositeFingerPacket(packet, options);
  }

  function receiveWorldExpressionPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      category: CATEGORY.WORLD_EXPRESSION,
      sourceName: options.sourceName || "WORLD_EXPRESSION_PACKET",
      sourceFile: options.sourceFile || COMPOSITE_FILE
    });
  }

  function receiveFingerPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "GENERIC_FINGER_PACKET"
    });
  }

  function receiveBishopPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "GENERIC_BISHOP_PACKET"
    });
  }

  function receiveCanvasFingerPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "CANVAS_FINGER_PACKET"
    });
  }

  function receiveCanvasBishopPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "CANVAS_BISHOP_PACKET"
    });
  }

  function receiveExpressionPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "EXPRESSION_PACKET"
    });
  }

  function receiveCanvasExpressionPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "CANVAS_EXPRESSION_PACKET"
    });
  }

  function receiveSurfacePointerPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "SURFACE_POINTER_PACKET"
    });
  }

  function receiveSurfacePointerBishopPacket(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "SURFACE_POINTER_BISHOP_PACKET"
    });
  }

  function registerExpressionFinger(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "REGISTERED_EXPRESSION_FINGER",
      sourceFile: options.sourceFile || safeString(packet.sourceFile || packet.file || "UNKNOWN")
    });
  }

  function registerExpressionBishop(packet = {}, options = {}) {
    return receiveInternalExpression(packet, {
      ...options,
      sourceName: options.sourceName || "REGISTERED_EXPRESSION_BISHOP",
      sourceFile: options.sourceFile || safeString(packet.sourceFile || packet.file || "UNKNOWN")
    });
  }

  function registerExpressionReceiver(category, receiver, options = {}) {
    const normalized = normalizeCategory(category);

    if (normalized === CATEGORY.UNKNOWN || !receiver || !isObject(receiver)) {
      return {
        ok: false,
        reason: "INVALID_CATEGORY_OR_RECEIVER",
        contract: CONTRACT,
        receipt: RECEIPT,
        ...FINAL_FALSE
      };
    }

    state.registeredReceivers[normalized] = {
      category: normalized,
      receiver,
      name: safeString(options.name || options.sourceName || `REGISTERED:${normalized}`),
      file: safeString(options.file || "UNKNOWN"),
      registeredAt: nowIso()
    };

    record("SURFACE_POINTER_BISHOP_REGISTERED_INTERNAL_RECEIVER", {
      category: normalized,
      name: state.registeredReceivers[normalized].name,
      file: state.registeredReceivers[normalized].file
    });

    updateDataset();
    publishGlobals();

    return {
      ok: true,
      category: normalized,
      contract: CONTRACT,
      receipt: RECEIPT,
      ...FINAL_FALSE
    };
  }

  function getRoutingMap() {
    return {
      [CATEGORY.SURFACE]: {
        category: CATEGORY.SURFACE,
        file: FILE,
        authority: "surface-expression-authority",
        surfaceOwnsCategory: true,
        pointerBishopOwnsCategory: true,
        externalEntryPoint: FILE,
        internalEntryPoint: FILE,
        hexExpressionSocketActive: true
      },
      [CATEGORY.HEX_SURFACE]: {
        category: CATEGORY.HEX_SURFACE,
        file: HEX_SURFACE_FILE,
        authority: "projection-and-canvas-drawing-consumer",
        surfaceOwnsCategory: false,
        pointerBishopOwnsCategory: false,
        expressionProvider: FILE,
        projectionOwner: HEX_SURFACE_FILE,
        canvasDrawingOwner: HEX_SURFACE_FILE
      },
      [CATEGORY.COMPOSITE]: {
        category: CATEGORY.COMPOSITE,
        file: COMPOSITE_FILE,
        authority: "composite/world-expression assembly",
        surfaceOwnsCategory: false,
        pointerBishopOwnsCategory: false,
        internalOnly: true
      },
      [CATEGORY.WORLD_EXPRESSION]: {
        category: CATEGORY.WORLD_EXPRESSION,
        file: COMPOSITE_FILE,
        authority: "assembled world expression packet",
        surfaceOwnsCategory: false,
        pointerBishopOwnsCategory: false,
        internalOnly: true
      },
      [CATEGORY.HYDROLOGY_INTERFACE]: {
        category: CATEGORY.HYDROLOGY_INTERFACE,
        file: FILE,
        authority: "visible wet/dry contact expression only; hydrology truth not owned",
        surfaceOwnsCategory: true,
        pointerBishopOwnsCategory: true
      },
      [CATEGORY.MATERIALS]: {
        category: CATEGORY.MATERIALS,
        file: MATERIALS_FILE,
        authority: "material/mineral/color/texture families",
        surfaceOwnsCategory: false,
        pointerBishopOwnsCategory: false,
        surfaceMayIntegrateVisibleContribution: true
      },
      [CATEGORY.COMPOSITION]: {
        category: CATEGORY.COMPOSITION,
        file: COMPOSITION_FILE,
        authority: "planetary composition/layered structure/internal formation",
        surfaceOwnsCategory: false,
        pointerBishopOwnsCategory: false,
        surfaceMayIntegrateVisibleContribution: true
      },
      [CATEGORY.AIR_CHANNEL]: {
        category: CATEGORY.AIR_CHANNEL,
        file: AIR_CHANNEL_FILE,
        authority: "air channel/pressure/haze/sky shell/atmosphere behavior",
        surfaceOwnsCategory: false,
        pointerBishopOwnsCategory: false,
        surfaceMayIntegrateVisibleContribution: true
      },
      [CATEGORY.CLIFFS]: {
        category: CATEGORY.CLIFFS,
        file: CLIFFS_FILE,
        authority: "cliffs/escarpments/vertical relief/edge relief",
        surfaceOwnsCategory: false,
        pointerBishopOwnsCategory: false,
        surfaceMayIntegrateVisibleContribution: true
      },
      [CATEGORY.BOUNDARY]: {
        category: CATEGORY.BOUNDARY,
        file: BOUNDARY_FILE,
        authority: "boundary/silhouette/containment",
        surfaceOwnsCategory: false,
        pointerBishopOwnsCategory: false
      },
      [CATEGORY.MASS]: {
        category: CATEGORY.MASS,
        file: MASS_FILE,
        authority: "body/mass/volume/physical pressure",
        surfaceOwnsCategory: false,
        pointerBishopOwnsCategory: false
      },
      [CATEGORY.LIGHT]: {
        category: CATEGORY.LIGHT,
        file: LIGHT_FILE,
        authority: "light/shadow/chamber visibility/atmosphere edge",
        surfaceOwnsCategory: false,
        pointerBishopOwnsCategory: false
      },
      [CATEGORY.INSPECT]: {
        category: CATEGORY.INSPECT,
        file: INSPECT_FILE,
        authority: "inspection/readability/click-facing proof",
        surfaceOwnsCategory: false,
        pointerBishopOwnsCategory: false
      }
    };
  }

  function getHeldDonorQueue() {
    return clonePlain(state.heldDonorQueue);
  }

  function getRejectedDonorQueue() {
    return clonePlain(state.rejectedDonorQueue);
  }

  function getInternalHeldQueue() {
    return clonePlain(state.internalHeldQueue);
  }

  function getInternalRejectedQueue() {
    return clonePlain(state.internalRejectedQueue);
  }

  function getExternalIntakeReceipt() {
    return {
      receiptType: "HEARTH_SURFACE_POINTER_BISHOP_EXTERNAL_EXPRESSION_SOCKET_RECEIPT",
      timestamp: nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      bishopName: BISHOP_NAME,
      bishopTitle: BISHOP_TITLE,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,

      pointerFingerActive: state.pointerFingerActive,
      pointerBishopActive: state.pointerBishopActive,
      externalExpressionSocketActive: state.externalExpressionSocketActive,
      singleExternalInputReceiver: state.singleExternalInputReceiver,
      externalIntakeReady: state.externalIntakeReady,

      externalIntakeCount: state.externalIntakeCount,
      classifiedExpressionCount: state.classifiedExpressionCount,
      surfaceIntegratedCount: state.surfaceIntegratedCount,
      routedExpressionCount: state.routedExpressionCount,
      heldExpressionCount: state.heldExpressionCount,
      rejectedExpressionCount: state.rejectedExpressionCount,
      categoryCounts: clonePlain(state.categoryCounts),

      latestExternalPacketId: state.latestExternalPacketId,
      latestExternalPacketCategory: state.latestExternalPacketCategory,
      latestExternalPacketStatus: state.latestExternalPacketStatus,

      routingMap: getRoutingMap(),
      heldDonorQueueCount: state.heldDonorQueue.length,
      rejectedDonorQueueCount: state.rejectedDonorQueue.length,

      surfaceOwnsRouting: true,
      pointerBishopOwnsRouting: true,
      surfaceOwnsSurfaceVisibleSynthesis: true,
      pointerBishopOwnsSurfaceVisibleSynthesis: true,
      surfaceOwnsAllExternalIntake: true,
      pointerBishopOwnsAllExternalIntake: true,
      surfaceOwnsMass: false,
      surfaceOwnsBoundary: false,
      surfaceOwnsLight: false,
      surfaceOwnsInspect: false,
      surfaceOwnsComposite: false,
      pointerBishopOwnsComposite: false,
      surfaceOwnsMaterials: false,
      surfaceOwnsComposition: false,
      surfaceOwnsAirChannel: false,
      surfaceOwnsCliffs: false,
      surfaceOwnsHydrologyTruth: false,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getInternalIntakeReceipt() {
    return {
      receiptType: "HEARTH_SURFACE_POINTER_BISHOP_INTERNAL_EXPRESSION_SOCKET_RECEIPT",
      timestamp: nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      bishopName: BISHOP_NAME,
      bishopTitle: BISHOP_TITLE,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,

      pointerFingerActive: state.pointerFingerActive,
      pointerBishopActive: state.pointerBishopActive,
      internalExpressionSocketActive: state.internalExpressionSocketActive,
      internalFingerPacketReceiver: state.internalFingerPacketReceiver,
      internalBishopPacketReceiver: state.internalBishopPacketReceiver,
      compositePacketReceiver: state.compositePacketReceiver,
      worldExpressionPacketReceiver: state.worldExpressionPacketReceiver,
      internalIntakeReady: state.internalIntakeReady,

      internalIntakeCount: state.internalIntakeCount,
      internalAcceptedCount: state.internalAcceptedCount,
      internalHeldCount: state.internalHeldCount,
      internalRejectedCount: state.internalRejectedCount,
      compositeInternalPacketCount: state.compositeInternalPacketCount,
      worldExpressionInternalPacketCount: state.worldExpressionInternalPacketCount,
      internalSurfaceBridgeCount: state.internalSurfaceBridgeCount,
      internalCategoryCounts: clonePlain(state.internalCategoryCounts),

      latestInternalPacketId: state.latestInternalPacketId,
      latestInternalPacketCategory: state.latestInternalPacketCategory,
      latestInternalPacketStatus: state.latestInternalPacketStatus,
      latestInternalPacketSourceFile: state.latestInternalPacketSourceFile,

      treatedAsExternalDonor: false,
      compositePacketAcceptedBySurfacePointer: state.compositeInternalPacketCount > 0,
      compositePacketAcceptedByPointerBishop: state.compositeInternalPacketCount > 0,
      worldExpressionPacketAcceptedBySurfacePointer: state.worldExpressionInternalPacketCount > 0,
      worldExpressionPacketAcceptedByPointerBishop: state.worldExpressionInternalPacketCount > 0,
      surfaceOwnsCompositeTruth: false,
      pointerBishopOwnsCompositeTruth: false,
      surfaceOwnsWorldExpressionTruth: false,
      pointerBishopOwnsWorldExpressionTruth: false,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getHexExpressionReceipt() {
    return {
      receiptType: "HEARTH_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_RECEIPT",
      timestamp: nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      file: FILE,
      route: ROUTE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      hexExpressionSocketActive: state.hexExpressionSocketActive,
      surfaceExpressionAuthority: state.hexSurfaceExpressionAuthority,
      hexSurfaceConsumerExpected: state.hexSurfaceConsumerExpected,
      hexSurfaceProjectionDelegated: state.hexSurfaceProjectionDelegated,
      canvasDrawingDelegatedToHexSurface: state.canvasDrawingDelegatedToHexSurface,
      directCanvasDrawingSuppressed: state.directCanvasDrawingSuppressed,

      sampleHexSurfaceExpressionAvailable: true,
      sampleSurfaceExpressionAvailable: true,
      getRenderableSurfaceExpressionAvailable: true,
      getSurfaceExpressionAtAvailable: true,
      receiveHexSurfaceExpressionRequestAvailable: true,

      hexExpressionRequestCount: state.hexExpressionRequestCount,
      hexExpressionServedCount: state.hexExpressionServedCount,
      hexExpressionRejectedCount: state.hexExpressionRejectedCount,
      latestHexExpressionAt: state.latestHexExpressionAt,
      latestHexExpressionRequestSource: state.latestHexExpressionRequestSource,
      latestHexExpressionCellId: state.latestHexExpressionCellId,
      latestHexExpressionMaterialClass: state.latestHexExpressionMaterialClass,
      latestHexExpressionLandPresence: state.latestHexExpressionLandPresence,
      latestHexExpressionWaterPresence: state.latestHexExpressionWaterPresence,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceRecognized: state.hexSurfaceRecognized,
      hexSurfaceHandshakeAttempted: state.hexSurfaceHandshakeAttempted,
      hexSurfaceHandshakeAccepted: state.hexSurfaceHandshakeAccepted,
      hexSurfaceHandshakeMethod: state.hexSurfaceHandshakeMethod,
      hexSurfaceHandshakeError: state.hexSurfaceHandshakeError,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function buildSurfacePacket(options = {}) {
    const model = buildSurfaceModel(options);

    const packet = {
      packetType: "HEARTH_CANVAS_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV3Contract: LINEAGE_V3_CONTRACT,
      lineageV3Receipt: LINEAGE_V3_RECEIPT,
      lineageV2Contract: LINEAGE_V2_CONTRACT,
      lineageV2Receipt: LINEAGE_V2_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,
      fingerStretchRegistry: clonePlain(FINGER_STRETCH_REGISTRY),

      bishopName: BISHOP_NAME,
      bishopTitle: BISHOP_TITLE,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopOrder: BISHOP_ORDER,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,
      bishopSubjectFile: BISHOP_SUBJECT_FILE,
      bishopParent: BISHOP_PARENT,
      bishopCanonicalStatus: BISHOP_CANONICAL_STATUS,

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

      compositeFile: COMPOSITE_FILE,
      compositeInternalPacketCount: state.compositeInternalPacketCount,
      worldExpressionInternalPacketCount: state.worldExpressionInternalPacketCount,

      surfaceFingerActive: true,
      pointerFingerActive: true,
      pointerBishopActive: true,
      bishopLanguageActive: true,
      nonCardinalBishopLanguageActive: true,
      legacyFingerCompatibilityActive: true,

      hexExpressionSocketActive: true,
      hexSurfaceExpressionAuthority: true,
      hexSurfaceConsumerExpected: true,
      hexSurfaceProjectionDelegated: true,
      canvasDrawingDelegatedToHexSurface: true,
      directCanvasDrawingSuppressed: true,

      externalExpressionSocketActive: true,
      internalExpressionSocketActive: true,
      internalExternalExpressionSocketActive: true,
      singleExternalInputReceiver: true,
      internalFingerPacketReceiver: true,
      internalBishopPacketReceiver: true,
      compositePacketReceiver: true,
      worldExpressionPacketReceiver: true,
      firstMaterialDifferentiationActive: true,
      surfaceModelReady: true,
      firstSurfaceDifferentiationReady: true,
      roughTerrainTintReady: true,
      shallowMaterialVariationReady: true,
      surfacePacketReady: true,
      pointerFingerPacketReady: true,
      pointerBishopPacketReady: true,
      visibleContributionAvailable: true,

      surfaceModel: clonePlain(model),
      sampleAvailable: true,
      sampleSurfaceAvailable: true,
      sampleHexSurfaceExpressionAvailable: true,
      getRenderableSurfaceExpressionAvailable: true,
      getSurfaceExpressionAtAvailable: true,
      receiveHexSurfaceExpressionRequestAvailable: true,
      drawToCanvasAvailable: true,
      drawToCanvasSuppressed: true,

      externalIntakeReady: true,
      receiveExternalExpressionAvailable: true,
      classifyExternalExpressionAvailable: true,
      routeExpressionCategoryAvailable: true,
      getRoutingMapAvailable: true,
      getHeldDonorQueueAvailable: true,
      getExternalIntakeReceiptAvailable: true,

      internalIntakeReady: true,
      receiveInternalExpressionAvailable: true,
      receiveInternalFingerPacketAvailable: true,
      receiveInternalBishopPacketAvailable: true,
      receiveExpansionFingerPacketAvailable: true,
      receiveExpansionBishopPacketAvailable: true,
      receiveCompositeFingerPacketAvailable: true,
      receiveCompositeBishopPacketAvailable: true,
      receiveWorldExpressionPacketAvailable: true,
      receiveFingerPacketAvailable: true,
      receiveBishopPacketAvailable: true,
      receiveCanvasFingerPacketAvailable: true,
      receiveCanvasBishopPacketAvailable: true,
      receiveExpressionPacketAvailable: true,
      registerExpressionFingerAvailable: true,
      registerExpressionBishopAvailable: true,
      getInternalIntakeReceiptAvailable: true,

      hexExpressionReceipt: getHexExpressionReceipt(),

      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,

      hexSurfaceHandshakeAttempted: state.hexSurfaceHandshakeAttempted,
      hexSurfaceHandshakeAccepted: state.hexSurfaceHandshakeAccepted,
      hexSurfaceHandshakeMethod: state.hexSurfaceHandshakeMethod,

      recommendedNextFile: HEX_SURFACE_FILE,
      recommendedNextRenewalTarget: HEX_SURFACE_FILE,
      firstFailedCoordinate: state.hexSurfaceHandshakeAccepted
        ? "HEX_SURFACE_HANDSHAKE_ACCEPTED_WAITING_HEX_SURFACE_CONSUMER_RENEWAL"
        : "WAITING_HEX_SURFACE_EXPRESSION_CONSUMER_HANDSHAKE",
      noClaimsPreserved: true,

      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.surfacePacket = clonePlain(packet);
    state.surfacePacketReady = true;
    state.surfaceModelReady = true;
    state.firstSurfaceDifferentiationReady = true;
    state.roughTerrainTintReady = true;
    state.shallowMaterialVariationReady = true;
    state.visibleContributionAvailable = true;
    state.surfaceExpressionReady = true;
    state.hexSurfaceExpressionReady = true;

    state.firstFailedCoordinate = packet.firstFailedCoordinate;
    state.recommendedNextFile = packet.recommendedNextFile;
    state.recommendedNextRenewalTarget = packet.recommendedNextRenewalTarget;
    state.postgameStatus = state.hexSurfaceHandshakeAccepted
      ? "SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_ACCEPTED"
      : "SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_READY_WAITING_HEX_SURFACE";

    return packet;
  }

  function buildPointerFingerPacket(options = {}) {
    const surfacePacket = buildSurfacePacket(options);

    const packet = {
      packetType: "HEARTH_CANVAS_SURFACE_POINTER_FINGER_HEX_EXPRESSION_COMPATIBILITY_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,
      fingerStretchRegistry: clonePlain(FINGER_STRETCH_REGISTRY),

      bishopName: BISHOP_NAME,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      bishopLanguageActive: true,

      pointerFingerActive: true,
      pointerBishopActive: true,
      hexExpressionSocketActive: true,
      externalExpressionSocketActive: true,
      internalExpressionSocketActive: true,
      internalExternalExpressionSocketActive: true,
      singleExternalInputReceiver: true,
      internalFingerPacketReceiver: true,
      compositePacketReceiver: true,
      worldExpressionPacketReceiver: true,

      externalIntakeReady: true,
      internalIntakeReady: true,
      externalIntakeReceipt: getExternalIntakeReceipt(),
      internalIntakeReceipt: getInternalIntakeReceipt(),
      hexExpressionReceipt: getHexExpressionReceipt(),
      routingMap: getRoutingMap(),
      surfacePacket: clonePlain(surfacePacket),

      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.pointerFingerPacket = clonePlain(packet);
    state.pointerFingerPacketReady = true;

    return packet;
  }

  function buildPointerBishopPacket(options = {}) {
    const surfacePacket = buildSurfacePacket(options);

    const packet = {
      packetType: "HEARTH_CANVAS_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,

      bishopName: BISHOP_NAME,
      bishopTitle: BISHOP_TITLE,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopOrder: BISHOP_ORDER,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,
      bishopSubjectFile: BISHOP_SUBJECT_FILE,
      bishopParent: BISHOP_PARENT,
      bishopCanonicalStatus: BISHOP_CANONICAL_STATUS,

      legacyFingerName: FINGER_NAME,
      legacyFingerRole: FINGER_ROLE,
      legacyFingerOrder: FINGER_ORDER,
      legacyFingerCompatibilityActive: true,

      pointerBishopActive: true,
      pointerFingerActive: true,
      hexExpressionSocketActive: true,
      hexSurfaceExpressionAuthority: true,
      hexSurfaceConsumerExpected: true,
      hexSurfaceProjectionDelegated: true,
      canvasDrawingDelegatedToHexSurface: true,
      directCanvasDrawingSuppressed: true,

      externalExpressionSocketActive: true,
      internalExpressionSocketActive: true,
      internalBishopPacketReceiver: true,
      internalFingerPacketReceiver: true,
      compositePacketReceiver: true,
      worldExpressionPacketReceiver: true,

      sampleHexSurfaceExpressionAvailable: true,
      sampleSurfaceExpressionAvailable: true,
      getRenderableSurfaceExpressionAvailable: true,
      getSurfaceExpressionAtAvailable: true,

      surfacePacket: clonePlain(surfacePacket),
      externalIntakeReceipt: getExternalIntakeReceipt(),
      internalIntakeReceipt: getInternalIntakeReceipt(),
      hexExpressionReceipt: getHexExpressionReceipt(),
      routingMap: getRoutingMap(),

      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.pointerBishopPacket = clonePlain(packet);
    state.pointerBishopPacketReady = true;

    return packet;
  }

  function getSurfacePacket(options = {}) {
    if (!state.surfacePacket || options.rebuild === true) return buildSurfacePacket(options);
    return clonePlain(state.surfacePacket);
  }

  function getPointerFingerPacket(options = {}) {
    if (!state.pointerFingerPacket || options.rebuild === true) return buildPointerFingerPacket(options);
    return clonePlain(state.pointerFingerPacket);
  }

  function getPointerBishopPacket(options = {}) {
    if (!state.pointerBishopPacket || options.rebuild === true) return buildPointerBishopPacket(options);
    return clonePlain(state.pointerBishopPacket);
  }

  function getBishopPacket(options = {}) {
    return getPointerBishopPacket(options);
  }

  function findCanvasHub() {
    return findSource(HUB_SOURCE_NAMES);
  }

  function findHexSurface() {
    const found = findSource(HEX_SURFACE_SOURCE_NAMES);
    const receipt = readReceipt(found.source) || found.source || {};
    const contract = contractOf(receipt || found.source) || "UNKNOWN";

    state.hexSurfaceObserved = Boolean(found.source);
    state.hexSurfaceContract = contract;
    state.hexSurfaceRecognized =
      contract === HEX_SURFACE_REQUIRED_CONTRACT ||
      contract === HEX_SURFACE_NEXT_EXPECTED_CONTRACT ||
      safeString(contract).includes("HEARTH_HEX_SURFACE");

    return {
      source: found.source,
      sourceName: found.sourceName,
      contract,
      recognized: state.hexSurfaceRecognized
    };
  }

  function registerWithHexSurface(options = {}) {
    const found = findHexSurface();

    state.hexSurfaceHandshakeAttempted = true;
    state.hexSurfaceHandshakeAccepted = false;
    state.hexSurfaceHandshakeMethod = "NONE";
    state.hexSurfaceHandshakeError = "";

    if (!found.source || found.source === api) {
      state.hexSurfaceHandshakeMethod = "NONE";
      state.hexSurfaceHandshakeAccepted = false;
      state.firstFailedCoordinate = "HEX_SURFACE_NOT_FOUND";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextRenewalTarget = HEX_SURFACE_FILE;
      state.postgameStatus = "SURFACE_POINTER_BISHOP_READY_HEX_SURFACE_NOT_FOUND";
      return false;
    }

    const methods = [
      "receiveSurfaceExpressionAuthority",
      "receiveSurfacePointerBishopExpressionAuthority",
      "receiveSurfacePointerBishopPacket",
      "receiveSurfaceExpressionPacket",
      "receiveExpressionPacket",
      "receiveBishopPacket"
    ];

    const payload = getPointerBishopPacket(options);

    for (const method of methods) {
      if (!isFunction(found.source[method])) continue;

      try {
        const response = found.source[method](clonePlain(payload));
        state.hexSurfaceHandshakeAccepted = response !== false;
        state.hexSurfaceHandshakeMethod = method;
        state.postgameStatus = state.hexSurfaceHandshakeAccepted
          ? "SURFACE_POINTER_BISHOP_ACCEPTED_BY_HEX_SURFACE"
          : "SURFACE_POINTER_BISHOP_HEX_SURFACE_REJECTED_PACKET";
        state.firstFailedCoordinate = state.hexSurfaceHandshakeAccepted
          ? "HEX_SURFACE_HANDSHAKE_ACCEPTED_WAITING_CONSUMER_RENEWAL"
          : "HEX_SURFACE_REJECTED_SURFACE_POINTER_BISHOP_PACKET";
        state.recommendedNextFile = HEX_SURFACE_FILE;
        state.recommendedNextRenewalTarget = HEX_SURFACE_FILE;

        record("SURFACE_POINTER_BISHOP_HEX_SURFACE_HANDSHAKE_ATTEMPT_COMPLETE", {
          hexSurfaceSourceName: found.sourceName,
          method,
          accepted: state.hexSurfaceHandshakeAccepted
        });

        return state.hexSurfaceHandshakeAccepted;
      } catch (error) {
        state.hexSurfaceHandshakeError = error && error.message ? String(error.message) : String(error);
        recordError("SURFACE_POINTER_BISHOP_HEX_SURFACE_HANDSHAKE_METHOD_FAILED", error, {
          hexSurfaceSourceName: found.sourceName,
          method
        });
      }
    }

    state.hexSurfaceHandshakeAccepted = false;
    state.hexSurfaceHandshakeMethod = "NONE";
    state.firstFailedCoordinate = "HEX_SURFACE_INTAKE_NOT_FOUND";
    state.recommendedNextFile = HEX_SURFACE_FILE;
    state.recommendedNextRenewalTarget = HEX_SURFACE_FILE;
    state.postgameStatus = "SURFACE_POINTER_BISHOP_READY_HEX_SURFACE_INTAKE_NOT_FOUND";

    return false;
  }

  function registerWithCanvasHub(options = {}) {
    const packet = buildSurfacePacket(options);
    const bishopPacket = buildPointerBishopPacket(options);
    const found = findCanvasHub();

    state.hubDetected = Boolean(found.source);
    state.hubSourceName = found.sourceName;
    state.hubRegistrationAttempted = true;
    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationError = "";

    if (!found.source || found.source === api) {
      state.hubRegistrationHeldReason = "CANVAS_HUB_NOT_FOUND";
      state.firstFailedCoordinate = "WAITING_CANVAS_HUB_OR_HEX_SURFACE";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextRenewalTarget = HEX_SURFACE_FILE;
      state.postgameStatus = "SURFACE_POINTER_BISHOP_READY_CANVAS_HUB_NOT_FOUND";

      record("SURFACE_POINTER_BISHOP_HUB_NOT_FOUND", {
        attemptedSources: clonePlain(HUB_SOURCE_NAMES)
      });

      return false;
    }

    for (const method of HUB_INTAKE_METHODS) {
      if (!isFunction(found.source[method])) continue;

      try {
        const payload = method.toLowerCase().includes("bishop") ? bishopPacket : packet;
        const response = found.source[method](clonePlain(payload));

        state.hubRegistrationAccepted = response !== false;
        state.hubRegistrationMethod = method;
        state.hubRegistrationHeldReason = state.hubRegistrationAccepted ? "NONE" : "CANVAS_HUB_REJECTED_SURFACE_POINTER_BISHOP_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        if (state.hubRegistrationAccepted) {
          state.firstFailedCoordinate = "SURFACE_POINTER_BISHOP_REGISTERED_WAITING_HEX_SURFACE_CONSUMER";
          state.recommendedNextFile = HEX_SURFACE_FILE;
          state.recommendedNextRenewalTarget = HEX_SURFACE_FILE;
          state.postgameStatus = "SURFACE_POINTER_BISHOP_ACCEPTED_BY_CANVAS_HUB_HEX_SOCKET_READY";
        } else {
          state.firstFailedCoordinate = "CANVAS_HUB_REJECTED_SURFACE_POINTER_BISHOP_PACKET";
          state.recommendedNextFile = HEX_SURFACE_FILE;
          state.recommendedNextRenewalTarget = HEX_SURFACE_FILE;
          state.postgameStatus = "SURFACE_POINTER_BISHOP_READY_CANVAS_HUB_REJECTED_PACKET";
        }

        record("SURFACE_POINTER_BISHOP_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        buildSurfacePacket(options);
        buildPointerFingerPacket(options);
        buildPointerBishopPacket(options);
        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("SURFACE_POINTER_BISHOP_HUB_REGISTRATION_METHOD_FAILED", error, {
          hubSourceName: found.sourceName,
          method
        });
      }
    }

    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationHeldReason = "CANVAS_HUB_INTAKE_NOT_FOUND";
    state.firstFailedCoordinate = "CANVAS_HUB_INTAKE_NOT_FOUND";
    state.recommendedNextFile = HEX_SURFACE_FILE;
    state.recommendedNextRenewalTarget = HEX_SURFACE_FILE;
    state.postgameStatus = "SURFACE_POINTER_BISHOP_READY_CANVAS_HUB_INTAKE_NOT_FOUND";

    record("SURFACE_POINTER_BISHOP_HUB_INTAKE_NOT_FOUND", {
      hubSourceName: found.sourceName,
      attemptedMethods: clonePlain(HUB_INTAKE_METHODS)
    });

    buildSurfacePacket(options);
    buildPointerFingerPacket(options);
    buildPointerBishopPacket(options);
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
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV3Contract: LINEAGE_V3_CONTRACT,
      lineageV3Receipt: LINEAGE_V3_RECEIPT,
      lineageV2Contract: LINEAGE_V2_CONTRACT,
      lineageV2Receipt: LINEAGE_V2_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      boundaryFile: BOUNDARY_FILE,
      massFile: MASS_FILE,
      lightFile: LIGHT_FILE,
      inspectFile: INSPECT_FILE,
      compositeFile: COMPOSITE_FILE,
      materialsFile: MATERIALS_FILE,
      compositionFile: COMPOSITION_FILE,
      airChannelFile: AIR_CHANNEL_FILE,
      cliffsFile: CLIFFS_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,

      bishopName: BISHOP_NAME,
      bishopTitle: BISHOP_TITLE,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopOrder: BISHOP_ORDER,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,
      bishopSubjectFile: BISHOP_SUBJECT_FILE,
      bishopParent: BISHOP_PARENT,
      bishopCanonicalStatus: BISHOP_CANONICAL_STATUS,
      bishopLanguageActive: state.bishopLanguageActive,
      nonCardinalBishopLanguageActive: state.nonCardinalBishopLanguageActive,
      legacyFingerCompatibilityActive: state.legacyFingerCompatibilityActive,

      surfaceFingerLoaded: state.surfaceFingerLoaded,
      surfaceFingerActive: state.surfaceFingerActive,
      pointerFingerActive: state.pointerFingerActive,
      pointerBishopActive: state.pointerBishopActive,

      hexExpressionSocketActive: state.hexExpressionSocketActive,
      hexSurfaceExpressionAuthority: state.hexSurfaceExpressionAuthority,
      hexSurfaceConsumerExpected: state.hexSurfaceConsumerExpected,
      hexSurfaceProjectionDelegated: state.hexSurfaceProjectionDelegated,
      canvasDrawingDelegatedToHexSurface: state.canvasDrawingDelegatedToHexSurface,
      directCanvasDrawingSuppressed: state.directCanvasDrawingSuppressed,

      externalExpressionSocketActive: state.externalExpressionSocketActive,
      internalExpressionSocketActive: state.internalExpressionSocketActive,
      internalExternalExpressionSocketActive: state.internalExternalExpressionSocketActive,
      singleExternalInputReceiver: state.singleExternalInputReceiver,
      internalFingerPacketReceiver: state.internalFingerPacketReceiver,
      internalBishopPacketReceiver: state.internalBishopPacketReceiver,
      compositePacketReceiver: state.compositePacketReceiver,
      worldExpressionPacketReceiver: state.worldExpressionPacketReceiver,
      firstMaterialDifferentiationActive: state.firstMaterialDifferentiationActive,

      boundaryDependencyExpected: state.boundaryDependencyExpected,
      boundaryDependencyObserved: state.boundaryDependencyObserved,
      boundaryPacketObserved: state.boundaryPacketObserved,
      boundaryModelObserved: state.boundaryModelObserved,

      massDependencyExpected: state.massDependencyExpected,
      massDependencyObserved: state.massDependencyObserved,
      massPacketObserved: state.massPacketObserved,
      massModelObserved: state.massModelObserved,

      surfaceModelReady: state.surfaceModelReady,
      firstSurfaceDifferentiationReady: state.firstSurfaceDifferentiationReady,
      roughTerrainTintReady: state.roughTerrainTintReady,
      shallowMaterialVariationReady: state.shallowMaterialVariationReady,
      surfacePacketReady: state.surfacePacketReady,
      pointerFingerPacketReady: state.pointerFingerPacketReady,
      pointerBishopPacketReady: state.pointerBishopPacketReady,
      visibleContributionAvailable: state.visibleContributionAvailable,
      surfaceExpressionReady: state.surfaceExpressionReady,
      hexSurfaceExpressionReady: state.hexSurfaceExpressionReady,

      sampleHexSurfaceExpressionReady: state.sampleHexSurfaceExpressionReady,
      sampleSurfaceExpressionReady: state.sampleSurfaceExpressionReady,
      renderableSurfaceExpressionReady: state.renderableSurfaceExpressionReady,
      hexExpressionRequestCount: state.hexExpressionRequestCount,
      hexExpressionServedCount: state.hexExpressionServedCount,
      hexExpressionRejectedCount: state.hexExpressionRejectedCount,
      latestHexExpressionAt: state.latestHexExpressionAt,
      latestHexExpressionRequestSource: state.latestHexExpressionRequestSource,
      latestHexExpressionCellId: state.latestHexExpressionCellId,
      latestHexExpressionMaterialClass: state.latestHexExpressionMaterialClass,
      latestHexExpressionLandPresence: state.latestHexExpressionLandPresence,
      latestHexExpressionWaterPresence: state.latestHexExpressionWaterPresence,

      externalIntakeReady: state.externalIntakeReady,
      externalIntakeCount: state.externalIntakeCount,
      classifiedExpressionCount: state.classifiedExpressionCount,
      surfaceIntegratedCount: state.surfaceIntegratedCount,
      routedExpressionCount: state.routedExpressionCount,
      heldExpressionCount: state.heldExpressionCount,
      rejectedExpressionCount: state.rejectedExpressionCount,
      latestExternalPacketId: state.latestExternalPacketId,
      latestExternalPacketCategory: state.latestExternalPacketCategory,
      latestExternalPacketStatus: state.latestExternalPacketStatus,

      internalIntakeReady: state.internalIntakeReady,
      internalIntakeCount: state.internalIntakeCount,
      internalAcceptedCount: state.internalAcceptedCount,
      internalHeldCount: state.internalHeldCount,
      internalRejectedCount: state.internalRejectedCount,
      compositeInternalPacketCount: state.compositeInternalPacketCount,
      worldExpressionInternalPacketCount: state.worldExpressionInternalPacketCount,
      internalSurfaceBridgeCount: state.internalSurfaceBridgeCount,
      latestInternalPacketId: state.latestInternalPacketId,
      latestInternalPacketCategory: state.latestInternalPacketCategory,
      latestInternalPacketStatus: state.latestInternalPacketStatus,
      latestInternalPacketSourceFile: state.latestInternalPacketSourceFile,

      hubDetected: state.hubDetected,
      hubSourceName: state.hubSourceName,
      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,
      hubRegistrationError: state.hubRegistrationError,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceRecognized: state.hexSurfaceRecognized,
      hexSurfaceHandshakeAttempted: state.hexSurfaceHandshakeAttempted,
      hexSurfaceHandshakeAccepted: state.hexSurfaceHandshakeAccepted,
      hexSurfaceHandshakeMethod: state.hexSurfaceHandshakeMethod,
      hexSurfaceHandshakeError: state.hexSurfaceHandshakeError,

      sampleAvailable: true,
      sampleSurfaceAvailable: true,
      sampleHexSurfaceExpressionAvailable: true,
      getRenderableSurfaceExpressionAvailable: true,
      getSurfaceExpressionAtAvailable: true,
      receiveHexSurfaceExpressionRequestAvailable: true,
      drawToCanvasAvailable: true,
      drawToCanvasSuppressed: true,

      receiveExternalExpressionAvailable: true,
      receiveExternalDonorExpressionAvailable: true,
      receiveCanvasDonorExpressionAvailable: true,
      receiveArchiveExpressionAvailable: true,
      classifyExternalExpressionAvailable: true,

      receiveInternalExpressionAvailable: true,
      classifyInternalExpressionAvailable: true,
      receiveInternalFingerPacketAvailable: true,
      receiveInternalBishopPacketAvailable: true,
      receiveExpansionFingerPacketAvailable: true,
      receiveExpansionBishopPacketAvailable: true,
      receiveCompositeFingerPacketAvailable: true,
      receiveCompositeBishopPacketAvailable: true,
      receiveWorldExpressionPacketAvailable: true,
      receiveFingerPacketAvailable: true,
      receiveBishopPacketAvailable: true,
      receiveCanvasFingerPacketAvailable: true,
      receiveCanvasBishopPacketAvailable: true,
      receiveExpressionPacketAvailable: true,
      registerExpressionFingerAvailable: true,
      registerExpressionBishopAvailable: true,

      registerExpressionReceiverAvailable: true,
      getRoutingMapAvailable: true,
      getHeldDonorQueueAvailable: true,
      getRejectedDonorQueueAvailable: true,
      getInternalHeldQueueAvailable: true,
      getInternalRejectedQueueAvailable: true,
      getExternalIntakeReceiptAvailable: true,
      getInternalIntakeReceiptAvailable: true,
      getHexExpressionReceiptAvailable: true,

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
      surfaceModel: clonePlain(state.surfaceModel),
      surfacePacket: clonePlain(state.surfacePacket),
      pointerFingerPacket: clonePlain(state.pointerFingerPacket),
      pointerBishopPacket: clonePlain(state.pointerBishopPacket),
      bishopPacket: clonePlain(state.pointerBishopPacket),
      internalExpressionPacket: clonePlain(state.internalExpressionPacket),
      compositeBridgePacket: clonePlain(state.compositeBridgePacket),
      fingerStretchRegistry: clonePlain(FINGER_STRETCH_REGISTRY),
      routingMap: getRoutingMap(),
      externalIntakeReceipt: getExternalIntakeReceipt(),
      internalIntakeReceipt: getInternalIntakeReceipt(),
      hexExpressionReceipt: getHexExpressionReceipt(),
      externalIntakeLedger: clonePlain(state.externalIntakeLedger),
      classifiedLedger: clonePlain(state.classifiedLedger),
      routedLedger: clonePlain(state.routedLedger),
      heldDonorQueue: clonePlain(state.heldDonorQueue),
      rejectedDonorQueue: clonePlain(state.rejectedDonorQueue),
      surfaceIntegratedDonors: clonePlain(state.surfaceIntegratedDonors),
      internalIntakeLedger: clonePlain(state.internalIntakeLedger),
      internalAcceptedLedger: clonePlain(state.internalAcceptedLedger),
      internalHeldQueue: clonePlain(state.internalHeldQueue),
      internalRejectedQueue: clonePlain(state.internalRejectedQueue),
      compositeInternalPackets: clonePlain(state.compositeInternalPackets),
      worldExpressionInternalPackets: clonePlain(state.worldExpressionInternalPackets),
      internalSurfaceBridgeFields: clonePlain(state.internalSurfaceBridgeFields),
      surfaceFormationFields: clonePlain(state.surfaceFormationFields),
      surfaceMaterialFamilies: clonePlain(state.surfaceMaterialFamilies),
      hexExpressionLedger: clonePlain(state.hexExpressionLedger),
      registeredReceiverCategories: Object.keys(state.registeredReceivers),
      hubSourceNames: clonePlain(HUB_SOURCE_NAMES),
      hubIntakeMethods: clonePlain(HUB_INTAKE_METHODS),
      hexSurfaceSourceNames: clonePlain(HEX_SURFACE_SOURCE_NAMES),
      boundarySourceNames: clonePlain(BOUNDARY_SOURCE_NAMES),
      massSourceNames: clonePlain(MASS_SOURCE_NAMES),
      lastRegistrationResponse: clonePlain(state.lastRegistrationResponse),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("packet", r.packet),
      line("previousContract", r.previousContract),
      line("previousReceipt", r.previousReceipt),
      line("lineageV3Contract", r.lineageV3Contract),
      line("lineageV2Contract", r.lineageV2Contract),
      line("baselineContract", r.baselineContract),
      line("file", r.file),
      line("route", r.route),
      line("diagnosticRoute", r.diagnosticRoute),
      line("parentHubFile", r.parentHubFile),
      line("hexSurfaceFile", r.hexSurfaceFile),
      line("hexAuthorityFile", r.hexAuthorityFile),
      "",
      "BISHOP",
      line("bishopName", r.bishopName),
      line("bishopTitle", r.bishopTitle),
      line("bishopRole", r.bishopRole),
      line("bishopRank", r.bishopRank),
      line("bishopOrder", r.bishopOrder),
      line("bishopAddress", r.bishopAddress),
      line("bishopDirection", r.bishopDirection),
      line("bishopCardinalDisposition", r.bishopCardinalDisposition),
      line("bishopSubjectFile", r.bishopSubjectFile),
      line("bishopCanonicalStatus", r.bishopCanonicalStatus),
      line("bishopLanguageActive", r.bishopLanguageActive),
      line("nonCardinalBishopLanguageActive", r.nonCardinalBishopLanguageActive),
      line("legacyFingerCompatibilityActive", r.legacyFingerCompatibilityActive),
      "",
      "HEX_EXPRESSION_SOCKET",
      line("hexExpressionSocketActive", r.hexExpressionSocketActive),
      line("hexSurfaceExpressionAuthority", r.hexSurfaceExpressionAuthority),
      line("hexSurfaceConsumerExpected", r.hexSurfaceConsumerExpected),
      line("hexSurfaceProjectionDelegated", r.hexSurfaceProjectionDelegated),
      line("canvasDrawingDelegatedToHexSurface", r.canvasDrawingDelegatedToHexSurface),
      line("directCanvasDrawingSuppressed", r.directCanvasDrawingSuppressed),
      line("sampleHexSurfaceExpressionAvailable", r.sampleHexSurfaceExpressionAvailable),
      line("sampleSurfaceExpressionAvailable", r.sampleSurfaceExpressionAvailable),
      line("getRenderableSurfaceExpressionAvailable", r.getRenderableSurfaceExpressionAvailable),
      line("getSurfaceExpressionAtAvailable", r.getSurfaceExpressionAtAvailable),
      line("hexExpressionRequestCount", r.hexExpressionRequestCount),
      line("hexExpressionServedCount", r.hexExpressionServedCount),
      line("hexExpressionRejectedCount", r.hexExpressionRejectedCount),
      line("latestHexExpressionAt", r.latestHexExpressionAt),
      line("latestHexExpressionCellId", r.latestHexExpressionCellId),
      line("latestHexExpressionMaterialClass", r.latestHexExpressionMaterialClass),
      "",
      "FINGER_COMPATIBILITY",
      line("fingerName", r.fingerName),
      line("fingerRole", r.fingerRole),
      line("fingerOrder", r.fingerOrder),
      line("fingerStretchTotal", r.fingerStretchTotal),
      line("pointerFingerActive", r.pointerFingerActive),
      line("pointerBishopActive", r.pointerBishopActive),
      line("externalExpressionSocketActive", r.externalExpressionSocketActive),
      line("internalExpressionSocketActive", r.internalExpressionSocketActive),
      line("internalExternalExpressionSocketActive", r.internalExternalExpressionSocketActive),
      line("singleExternalInputReceiver", r.singleExternalInputReceiver),
      line("internalFingerPacketReceiver", r.internalFingerPacketReceiver),
      line("internalBishopPacketReceiver", r.internalBishopPacketReceiver),
      line("compositePacketReceiver", r.compositePacketReceiver),
      line("worldExpressionPacketReceiver", r.worldExpressionPacketReceiver),
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
      "SURFACE_STATUS",
      line("surfaceFingerLoaded", r.surfaceFingerLoaded),
      line("surfaceFingerActive", r.surfaceFingerActive),
      line("firstMaterialDifferentiationActive", r.firstMaterialDifferentiationActive),
      line("surfaceModelReady", r.surfaceModelReady),
      line("firstSurfaceDifferentiationReady", r.firstSurfaceDifferentiationReady),
      line("roughTerrainTintReady", r.roughTerrainTintReady),
      line("shallowMaterialVariationReady", r.shallowMaterialVariationReady),
      line("surfacePacketReady", r.surfacePacketReady),
      line("pointerFingerPacketReady", r.pointerFingerPacketReady),
      line("pointerBishopPacketReady", r.pointerBishopPacketReady),
      line("visibleContributionAvailable", r.visibleContributionAvailable),
      line("surfaceExpressionReady", r.surfaceExpressionReady),
      line("hexSurfaceExpressionReady", r.hexSurfaceExpressionReady),
      "",
      "EXTERNAL_SOCKET",
      line("externalIntakeReady", r.externalIntakeReady),
      line("externalIntakeCount", r.externalIntakeCount),
      line("classifiedExpressionCount", r.classifiedExpressionCount),
      line("surfaceIntegratedCount", r.surfaceIntegratedCount),
      line("routedExpressionCount", r.routedExpressionCount),
      line("heldExpressionCount", r.heldExpressionCount),
      line("rejectedExpressionCount", r.rejectedExpressionCount),
      line("latestExternalPacketId", r.latestExternalPacketId),
      line("latestExternalPacketCategory", r.latestExternalPacketCategory),
      line("latestExternalPacketStatus", r.latestExternalPacketStatus),
      "",
      "INTERNAL_SOCKET",
      line("internalIntakeReady", r.internalIntakeReady),
      line("internalIntakeCount", r.internalIntakeCount),
      line("internalAcceptedCount", r.internalAcceptedCount),
      line("internalHeldCount", r.internalHeldCount),
      line("internalRejectedCount", r.internalRejectedCount),
      line("compositeInternalPacketCount", r.compositeInternalPacketCount),
      line("worldExpressionInternalPacketCount", r.worldExpressionInternalPacketCount),
      line("internalSurfaceBridgeCount", r.internalSurfaceBridgeCount),
      line("latestInternalPacketId", r.latestInternalPacketId),
      line("latestInternalPacketCategory", r.latestInternalPacketCategory),
      line("latestInternalPacketStatus", r.latestInternalPacketStatus),
      line("latestInternalPacketSourceFile", r.latestInternalPacketSourceFile),
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
      "HEX_SURFACE_HANDSHAKE",
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("hexSurfaceContract", r.hexSurfaceContract),
      line("hexSurfaceRecognized", r.hexSurfaceRecognized),
      line("hexSurfaceHandshakeAttempted", r.hexSurfaceHandshakeAttempted),
      line("hexSurfaceHandshakeAccepted", r.hexSurfaceHandshakeAccepted),
      line("hexSurfaceHandshakeMethod", r.hexSurfaceHandshakeMethod),
      line("hexSurfaceHandshakeError", r.hexSurfaceHandshakeError),
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
      line("compositeTruthClaimed", false),
      line("finalCompositeTruthClaimed", false),
      line("biomeTruthClaimed", false),
      line("settlementTruthClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerSurfaceLoaded", "true");
    setDataset("hearthCanvasFingerSurfaceContract", CONTRACT);
    setDataset("hearthCanvasFingerSurfaceReceipt", RECEIPT);
    setDataset("hearthCanvasFingerSurfacePreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasFingerSurfacePreviousReceipt", PREVIOUS_RECEIPT);
    setDataset("hearthCanvasFingerSurfaceLineageV3Contract", LINEAGE_V3_CONTRACT);
    setDataset("hearthCanvasFingerSurfaceLineageV2Contract", LINEAGE_V2_CONTRACT);
    setDataset("hearthCanvasFingerSurfaceBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthCanvasFingerSurfaceFile", FILE);

    setDataset("hearthCanvasFingerSurfaceBishopLanguageActive", "true");
    setDataset("hearthCanvasFingerSurfaceBishopName", BISHOP_NAME);
    setDataset("hearthCanvasFingerSurfaceBishopTitle", BISHOP_TITLE);
    setDataset("hearthCanvasFingerSurfaceBishopRole", BISHOP_ROLE);
    setDataset("hearthCanvasFingerSurfaceBishopRank", BISHOP_RANK);
    setDataset("hearthCanvasFingerSurfaceBishopOrder", String(BISHOP_ORDER));
    setDataset("hearthCanvasFingerSurfaceBishopAddress", BISHOP_ADDRESS);
    setDataset("hearthCanvasFingerSurfaceBishopDirection", BISHOP_DIRECTION);
    setDataset("hearthCanvasFingerSurfaceBishopCardinalDisposition", BISHOP_CARDINAL_DISPOSITION);
    setDataset("hearthCanvasFingerSurfaceBishopCanonicalStatus", BISHOP_CANONICAL_STATUS);

    setDataset("hearthCanvasFingerSurfaceActive", String(state.surfaceFingerActive));
    setDataset("hearthCanvasFingerSurfacePointerFingerActive", String(state.pointerFingerActive));
    setDataset("hearthCanvasFingerSurfacePointerBishopActive", String(state.pointerBishopActive));
    setDataset("hearthCanvasFingerSurfaceLegacyFingerCompatibilityActive", String(state.legacyFingerCompatibilityActive));

    setDataset("hearthCanvasFingerSurfaceHexExpressionSocketActive", String(state.hexExpressionSocketActive));
    setDataset("hearthCanvasFingerSurfaceHexSurfaceExpressionAuthority", String(state.hexSurfaceExpressionAuthority));
    setDataset("hearthCanvasFingerSurfaceHexSurfaceConsumerExpected", String(state.hexSurfaceConsumerExpected));
    setDataset("hearthCanvasFingerSurfaceHexSurfaceProjectionDelegated", String(state.hexSurfaceProjectionDelegated));
    setDataset("hearthCanvasFingerSurfaceCanvasDrawingDelegatedToHexSurface", String(state.canvasDrawingDelegatedToHexSurface));
    setDataset("hearthCanvasFingerSurfaceDirectCanvasDrawingSuppressed", String(state.directCanvasDrawingSuppressed));

    setDataset("hearthCanvasFingerSurfaceExternalExpressionSocketActive", String(state.externalExpressionSocketActive));
    setDataset("hearthCanvasFingerSurfaceInternalExpressionSocketActive", String(state.internalExpressionSocketActive));
    setDataset("hearthCanvasFingerSurfaceInternalExternalExpressionSocketActive", String(state.internalExternalExpressionSocketActive));
    setDataset("hearthCanvasFingerSurfaceSingleExternalInputReceiver", String(state.singleExternalInputReceiver));
    setDataset("hearthCanvasFingerSurfaceInternalFingerPacketReceiver", String(state.internalFingerPacketReceiver));
    setDataset("hearthCanvasFingerSurfaceInternalBishopPacketReceiver", String(state.internalBishopPacketReceiver));
    setDataset("hearthCanvasFingerSurfaceCompositePacketReceiver", String(state.compositePacketReceiver));
    setDataset("hearthCanvasFingerSurfaceWorldExpressionPacketReceiver", String(state.worldExpressionPacketReceiver));
    setDataset("hearthCanvasFingerSurfaceFirstMaterialDifferentiationActive", String(state.firstMaterialDifferentiationActive));

    setDataset("hearthCanvasFingerSurfaceBoundaryDependencyExpected", String(state.boundaryDependencyExpected));
    setDataset("hearthCanvasFingerSurfaceBoundaryDependencyObserved", String(state.boundaryDependencyObserved));
    setDataset("hearthCanvasFingerSurfaceBoundaryPacketObserved", String(state.boundaryPacketObserved));
    setDataset("hearthCanvasFingerSurfaceBoundaryModelObserved", String(state.boundaryModelObserved));

    setDataset("hearthCanvasFingerSurfaceMassDependencyExpected", String(state.massDependencyExpected));
    setDataset("hearthCanvasFingerSurfaceMassDependencyObserved", String(state.massDependencyObserved));
    setDataset("hearthCanvasFingerSurfaceMassPacketObserved", String(state.massPacketObserved));
    setDataset("hearthCanvasFingerSurfaceMassModelObserved", String(state.massModelObserved));

    setDataset("hearthCanvasFingerSurfaceModelReady", String(state.surfaceModelReady));
    setDataset("hearthCanvasFingerSurfaceFirstSurfaceDifferentiationReady", String(state.firstSurfaceDifferentiationReady));
    setDataset("hearthCanvasFingerSurfaceRoughTerrainTintReady", String(state.roughTerrainTintReady));
    setDataset("hearthCanvasFingerSurfaceShallowMaterialVariationReady", String(state.shallowMaterialVariationReady));
    setDataset("hearthCanvasFingerSurfacePacketReady", String(state.surfacePacketReady));
    setDataset("hearthCanvasFingerSurfacePointerFingerPacketReady", String(state.pointerFingerPacketReady));
    setDataset("hearthCanvasFingerSurfacePointerBishopPacketReady", String(state.pointerBishopPacketReady));
    setDataset("hearthCanvasFingerSurfaceVisibleContributionAvailable", String(state.visibleContributionAvailable));
    setDataset("hearthCanvasFingerSurfaceSurfaceExpressionReady", String(state.surfaceExpressionReady));
    setDataset("hearthCanvasFingerSurfaceHexSurfaceExpressionReady", String(state.hexSurfaceExpressionReady));

    setDataset("hearthCanvasFingerSurfaceSampleHexSurfaceExpressionReady", String(state.sampleHexSurfaceExpressionReady));
    setDataset("hearthCanvasFingerSurfaceSampleSurfaceExpressionReady", String(state.sampleSurfaceExpressionReady));
    setDataset("hearthCanvasFingerSurfaceRenderableSurfaceExpressionReady", String(state.renderableSurfaceExpressionReady));
    setDataset("hearthCanvasFingerSurfaceHexExpressionRequestCount", String(state.hexExpressionRequestCount));
    setDataset("hearthCanvasFingerSurfaceHexExpressionServedCount", String(state.hexExpressionServedCount));
    setDataset("hearthCanvasFingerSurfaceHexExpressionRejectedCount", String(state.hexExpressionRejectedCount));
    setDataset("hearthCanvasFingerSurfaceLatestHexExpressionAt", state.latestHexExpressionAt);
    setDataset("hearthCanvasFingerSurfaceLatestHexExpressionRequestSource", state.latestHexExpressionRequestSource);
    setDataset("hearthCanvasFingerSurfaceLatestHexExpressionCellId", state.latestHexExpressionCellId);
    setDataset("hearthCanvasFingerSurfaceLatestHexExpressionMaterialClass", state.latestHexExpressionMaterialClass);
    setDataset("hearthCanvasFingerSurfaceLatestHexExpressionLandPresence", String(state.latestHexExpressionLandPresence));
    setDataset("hearthCanvasFingerSurfaceLatestHexExpressionWaterPresence", String(state.latestHexExpressionWaterPresence));

    setDataset("hearthCanvasFingerSurfaceExternalIntakeReady", String(state.externalIntakeReady));
    setDataset("hearthCanvasFingerSurfaceExternalIntakeCount", String(state.externalIntakeCount));
    setDataset("hearthCanvasFingerSurfaceClassifiedExpressionCount", String(state.classifiedExpressionCount));
    setDataset("hearthCanvasFingerSurfaceIntegratedCount", String(state.surfaceIntegratedCount));
    setDataset("hearthCanvasFingerSurfaceRoutedExpressionCount", String(state.routedExpressionCount));
    setDataset("hearthCanvasFingerSurfaceHeldExpressionCount", String(state.heldExpressionCount));
    setDataset("hearthCanvasFingerSurfaceRejectedExpressionCount", String(state.rejectedExpressionCount));
    setDataset("hearthCanvasFingerSurfaceLatestExternalPacketId", state.latestExternalPacketId);
    setDataset("hearthCanvasFingerSurfaceLatestExternalPacketCategory", state.latestExternalPacketCategory);
    setDataset("hearthCanvasFingerSurfaceLatestExternalPacketStatus", state.latestExternalPacketStatus);

    setDataset("hearthCanvasFingerSurfaceInternalIntakeReady", String(state.internalIntakeReady));
    setDataset("hearthCanvasFingerSurfaceInternalIntakeCount", String(state.internalIntakeCount));
    setDataset("hearthCanvasFingerSurfaceInternalAcceptedCount", String(state.internalAcceptedCount));
    setDataset("hearthCanvasFingerSurfaceInternalHeldCount", String(state.internalHeldCount));
    setDataset("hearthCanvasFingerSurfaceInternalRejectedCount", String(state.internalRejectedCount));
    setDataset("hearthCanvasFingerSurfaceCompositeInternalPacketCount", String(state.compositeInternalPacketCount));
    setDataset("hearthCanvasFingerSurfaceWorldExpressionInternalPacketCount", String(state.worldExpressionInternalPacketCount));
    setDataset("hearthCanvasFingerSurfaceInternalSurfaceBridgeCount", String(state.internalSurfaceBridgeCount));
    setDataset("hearthCanvasFingerSurfaceLatestInternalPacketId", state.latestInternalPacketId);
    setDataset("hearthCanvasFingerSurfaceLatestInternalPacketCategory", state.latestInternalPacketCategory);
    setDataset("hearthCanvasFingerSurfaceLatestInternalPacketStatus", state.latestInternalPacketStatus);
    setDataset("hearthCanvasFingerSurfaceLatestInternalPacketSourceFile", state.latestInternalPacketSourceFile);

    setDataset("hearthCanvasFingerSurfaceHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerSurfaceHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerSurfaceHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerSurfaceHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerSurfaceHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerSurfaceHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerSurfaceHexSurfaceObserved", String(state.hexSurfaceObserved));
    setDataset("hearthCanvasFingerSurfaceHexSurfaceContract", state.hexSurfaceContract);
    setDataset("hearthCanvasFingerSurfaceHexSurfaceRecognized", String(state.hexSurfaceRecognized));
    setDataset("hearthCanvasFingerSurfaceHexSurfaceHandshakeAttempted", String(state.hexSurfaceHandshakeAttempted));
    setDataset("hearthCanvasFingerSurfaceHexSurfaceHandshakeAccepted", String(state.hexSurfaceHandshakeAccepted));
    setDataset("hearthCanvasFingerSurfaceHexSurfaceHandshakeMethod", state.hexSurfaceHandshakeMethod);
    setDataset("hearthCanvasFingerSurfaceHexSurfaceHandshakeError", state.hexSurfaceHandshakeError);

    setDataset("hearthCanvasFingerSurfaceFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerSurfaceRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerSurfacePostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerSurfaceNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerSurfaceF13Claimed", "false");
    setDataset("hearthCanvasFingerSurfaceF21Claimed", "false");
    setDataset("hearthCanvasFingerSurfaceReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceCompositeTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceFinalCompositeTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceBiomeTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceSettlementTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceGeneratedImage", "false");
    setDataset("hearthCanvasFingerSurfaceGraphicBox", "false");
    setDataset("hearthCanvasFingerSurfaceWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasFingerSurface = api;
    hearth.canvasSurfaceFinger = api;
    hearth.canvasFingerSurfacePointer = api;
    hearth.canvasPointerFinger = api;
    hearth.canvasFingerSurfaceInternalExternalSocket = api;

    hearth.canvasBishopSurface = api;
    hearth.canvasSurfaceBishop = api;
    hearth.canvasBishopSurfacePointer = api;
    hearth.canvasPointerBishop = api;
    hearth.canvasBishopSurfaceInternalExternalSocket = api;

    hearth.surfaceExpressionAuthority = api;
    hearth.hearthSurfaceExpressionAuthority = api;
    hearth.hexSurfaceExpressionAuthority = api;
    hearth.canvasFingerSurfaceHexExpressionSocket = api;
    hearth.canvasSurfacePointerBishopHexExpressionSocket = api;

    hearth.canvasFingerSurfaceReceipt = getReceiptLight();
    hearth.canvasSurfaceBishopReceipt = getReceiptLight();
    hearth.canvasPointerBishopReceipt = getReceiptLight();
    hearth.canvasFingerSurfacePacket = getSurfacePacket();
    hearth.canvasFingerSurfacePointerPacket = getPointerFingerPacket();
    hearth.canvasPointerBishopPacket = getPointerBishopPacket();
    hearth.canvasFingerSurfaceInternalIntakeReceipt = getInternalIntakeReceipt();
    hearth.canvasFingerSurfaceExternalIntakeReceipt = getExternalIntakeReceipt();
    hearth.canvasFingerSurfaceHexExpressionReceipt = getHexExpressionReceipt();

    lab.hearthCanvasFingerSurface = api;
    lab.hearthCanvasSurfaceFinger = api;
    lab.hearthCanvasFingerSurfacePointer = api;
    lab.hearthCanvasPointerFinger = api;
    lab.hearthCanvasFingerSurfaceInternalExternalSocket = api;

    lab.hearthCanvasBishopSurface = api;
    lab.hearthCanvasSurfaceBishop = api;
    lab.hearthCanvasBishopSurfacePointer = api;
    lab.hearthCanvasPointerBishop = api;
    lab.hearthCanvasBishopSurfaceInternalExternalSocket = api;

    lab.hearthSurfaceExpressionAuthority = api;
    lab.hearthHexSurfaceExpressionAuthority = api;
    lab.hearthCanvasFingerSurfaceHexExpressionSocket = api;
    lab.hearthCanvasSurfacePointerBishopHexExpressionSocket = api;

    lab.hearthCanvasFingerSurfaceReceipt = getReceiptLight();
    lab.hearthCanvasSurfaceBishopReceipt = getReceiptLight();
    lab.hearthCanvasPointerBishopReceipt = getReceiptLight();
    lab.hearthCanvasFingerSurfacePacket = getSurfacePacket();
    lab.hearthCanvasFingerSurfacePointerPacket = getPointerFingerPacket();
    lab.hearthCanvasPointerBishopPacket = getPointerBishopPacket();
    lab.hearthCanvasFingerSurfaceInternalIntakeReceipt = getInternalIntakeReceipt();
    lab.hearthCanvasFingerSurfaceExternalIntakeReceipt = getExternalIntakeReceipt();
    lab.hearthCanvasFingerSurfaceHexExpressionReceipt = getHexExpressionReceipt();

    root.HEARTH_CANVAS_FINGER_SURFACE = api;
    root.HEARTH_CANVAS_SURFACE_FINGER = api;
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER = api;
    root.HEARTH_CANVAS_POINTER_FINGER = api;
    root.HEARTH_CANVAS_FINGER_SURFACE_INTERNAL_EXTERNAL_SOCKET = api;

    root.HEARTH_CANVAS_BISHOP_SURFACE = api;
    root.HEARTH_CANVAS_SURFACE_BISHOP = api;
    root.HEARTH_CANVAS_BISHOP_SURFACE_POINTER = api;
    root.HEARTH_CANVAS_POINTER_BISHOP = api;
    root.HEARTH_CANVAS_BISHOP_SURFACE_INTERNAL_EXTERNAL_SOCKET = api;
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP = api;

    root.HEARTH_SURFACE_EXPRESSION_AUTHORITY = api;
    root.HEARTH_HEX_SURFACE_EXPRESSION_AUTHORITY = api;
    root.HEARTH_CANVAS_FINGER_SURFACE_HEX_EXPRESSION_SOCKET = api;
    root.HEARTH_CANVAS_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET = api;
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET = api;

    root.HEARTH_CANVAS_FINGER_SURFACE_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_BISHOP_SURFACE_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_POINTER_BISHOP_RECEIPT = getReceiptLight();

    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_RECEIPT_v5 = getReceipt();

    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_RECEIPT_v4 = getReceipt();

    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_RECEIPT_v3 = getReceipt();

    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_RECEIPT_v2 = getReceipt();

    root.HEARTH_CANVAS_FINGER_SURFACE_PACKET = getSurfacePacket();
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_PACKET = getPointerFingerPacket();
    root.HEARTH_CANVAS_POINTER_BISHOP_PACKET = getPointerBishopPacket();
    root.HEARTH_CANVAS_SURFACE_BISHOP_PACKET = getPointerBishopPacket();
    root.HEARTH_CANVAS_FINGER_SURFACE_INTERNAL_INTAKE_RECEIPT = getInternalIntakeReceipt();
    root.HEARTH_CANVAS_FINGER_SURFACE_EXTERNAL_INTAKE_RECEIPT = getExternalIntakeReceipt();
    root.HEARTH_CANVAS_FINGER_SURFACE_HEX_EXPRESSION_RECEIPT = getHexExpressionReceipt();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot(options = {}) {
    state.timestamp = nowIso();

    readBoundaryEvidence();
    readMassEvidence();
    buildSurfaceModel(options);
    buildSurfacePacket(options);
    buildPointerFingerPacket(options);
    buildPointerBishopPacket(options);
    updateDataset();
    publishGlobals();

    registerWithCanvasHub(options);
    registerWithHexSurface(options);

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_BOOT_COMPLETE", {
      boundaryDependencyObserved: state.boundaryDependencyObserved,
      massDependencyObserved: state.massDependencyObserved,
      hubDetected: state.hubDetected,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceHandshakeAccepted: state.hexSurfaceHandshakeAccepted,
      externalExpressionSocketActive: state.externalExpressionSocketActive,
      internalExpressionSocketActive: state.internalExpressionSocketActive,
      hexExpressionSocketActive: state.hexExpressionSocketActive,
      compositePacketReceiver: state.compositePacketReceiver,
      worldExpressionPacketReceiver: state.worldExpressionPacketReceiver,
      pointerBishopActive: state.pointerBishopActive,
      bishopLanguageActive: state.bishopLanguageActive,
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
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    PREVIOUS_PACKET,
    LINEAGE_V3_CONTRACT,
    LINEAGE_V3_RECEIPT,
    LINEAGE_V2_CONTRACT,
    LINEAGE_V2_RECEIPT,
    BASELINE_CONTRACT,
    BASELINE_RECEIPT,
    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    PARENT_HUB_FILE,
    HEX_SURFACE_FILE,
    HEX_AUTHORITY_FILE,
    BOUNDARY_FILE,
    MASS_FILE,
    NEXT_FILE,
    LIGHT_FILE,
    INSPECT_FILE,
    COMPOSITE_FILE,
    MATERIALS_FILE,
    COMPOSITION_FILE,
    AIR_CHANNEL_FILE,
    CLIFFS_FILE,
    CATEGORY,
    ROUTING_STATUS,

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV3Contract: LINEAGE_V3_CONTRACT,
    lineageV3Receipt: LINEAGE_V3_RECEIPT,
    lineageV2Contract: LINEAGE_V2_CONTRACT,
    lineageV2Receipt: LINEAGE_V2_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    boundaryFile: BOUNDARY_FILE,
    massFile: MASS_FILE,
    lightFile: LIGHT_FILE,
    inspectFile: INSPECT_FILE,
    compositeFile: COMPOSITE_FILE,
    materialsFile: MATERIALS_FILE,
    compositionFile: COMPOSITION_FILE,
    airChannelFile: AIR_CHANNEL_FILE,
    cliffsFile: CLIFFS_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,
    fingerStretchRegistry: FINGER_STRETCH_REGISTRY,

    bishopName: BISHOP_NAME,
    bishopTitle: BISHOP_TITLE,
    bishopRole: BISHOP_ROLE,
    bishopRank: BISHOP_RANK,
    bishopOrder: BISHOP_ORDER,
    bishopAddress: BISHOP_ADDRESS,
    bishopDirection: BISHOP_DIRECTION,
    bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,
    bishopSubjectFile: BISHOP_SUBJECT_FILE,
    bishopParent: BISHOP_PARENT,
    bishopCanonicalStatus: BISHOP_CANONICAL_STATUS,

    boot,
    init,
    start,
    mount,

    readBoundaryEvidence,
    readMassEvidence,
    buildSurfaceModel,
    buildSurfacePacket,
    buildPointerFingerPacket,
    buildPointerBishopPacket,
    getSurfacePacket,
    getPointerFingerPacket,
    getPointerBishopPacket,
    getBishopPacket,
    registerWithCanvasHub,
    registerWithHexSurface,
    findCanvasHub,
    findHexSurface,

    sample,
    sampleSurfaceExpression,
    sampleHexSurfaceExpression,
    getRenderableSurfaceExpression,
    getSurfaceExpressionAt,
    receiveHexSurfaceExpressionRequest,
    drawToCanvas,

    receiveExternalExpression,
    receiveExternalDonorExpression,
    receiveCanvasDonorExpression,
    receiveArchiveExpression,
    classifyExternalExpression,

    receiveInternalExpression,
    classifyInternalExpression,
    receiveInternalFingerPacket,
    receiveInternalBishopPacket,
    receiveExpansionFingerPacket,
    receiveExpansionBishopPacket,
    receiveCompositeFingerPacket,
    receiveCompositeBishopPacket,
    receiveCompositePacket,
    receiveWorldExpressionPacket,
    receiveFingerPacket,
    receiveBishopPacket,
    receiveCanvasFingerPacket,
    receiveCanvasBishopPacket,
    receiveExpressionPacket,
    receiveCanvasExpressionPacket,
    receiveSurfacePointerPacket,
    receiveSurfacePointerBishopPacket,
    registerExpressionFinger,
    registerExpressionBishop,

    registerExpressionReceiver,
    getRoutingMap,
    getHeldDonorQueue,
    getRejectedDonorQueue,
    getInternalHeldQueue,
    getInternalRejectedQueue,
    getExternalIntakeReceipt,
    getInternalIntakeReceipt,
    getHexExpressionReceipt,

    getState,
    read,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    publishGlobals,

    supportsCanvasFingerSurface: true,
    supportsPointerFingerSocket: true,
    supportsSurfacePointerBishop: true,
    supportsPointerBishopSocket: true,
    supportsNonCardinalBishopLanguage: true,
    supportsLegacyFingerCompatibility: true,
    supportsExternalExpressionIntake: true,
    supportsSingleExternalInputReceiver: true,
    supportsInternalExpressionIntake: true,
    supportsInternalFingerPacketReceiver: true,
    supportsInternalBishopPacketReceiver: true,
    supportsCompositeFingerPacketReceiver: true,
    supportsCompositeBishopPacketReceiver: true,
    supportsWorldExpressionPacketReceiver: true,
    supportsExpansionFingerPacketReceiver: true,
    supportsExpansionBishopPacketReceiver: true,
    supportsCompositeRegistrationMethods: true,
    supportsExternalDonorRouting: true,
    supportsHeldDonorQueue: true,
    supportsInternalHeldQueue: true,
    supportsRegisteredInternalReceivers: true,
    supportsFirstMaterialDifferentiation: true,
    supportsSurfaceExpressionPacket: true,
    supportsPointerBishopPacket: true,
    supportsBoundaryFingerConsumption: true,
    supportsMassFingerConsumption: true,
    supportsCanvasHubRegistration: true,
    supportsVisibleSurfaceContribution: true,
    supportsHexExpressionSocket: true,
    supportsHexSurfaceExpressionAuthority: true,
    supportsSampleHexSurfaceExpression: true,
    supportsSampleSurfaceExpression: true,
    supportsRenderableSurfaceExpression: true,
    supportsReceiptText: true,
    supportsNoFinalClaims: true,

    ownsSurfaceFingerIdentity: true,
    ownsSurfacePointerBishopIdentity: true,
    ownsPointerFingerSocket: true,
    ownsPointerBishopSocket: true,
    ownsExternalExpressionIntake: true,
    ownsInternalExpressionIntake: true,
    ownsExternalExpressionRouting: true,
    ownsInternalExpressionReceipt: true,
    ownsSurfaceExpressionPacket: true,
    ownsPointerBishopPacket: true,
    ownsFirstMaterialDifferentiation: true,
    ownsHexExpressionSocket: true,
    ownsHexSurfaceExpressionAuthority: true,
    ownsCanvasHub: false,
    ownsHexSurfaceProjection: false,
    ownsCanvasDrawing: false,
    ownsCanvasMounting: false,
    ownsBoundaryFinger: false,
    ownsBoundaryBishop: false,
    ownsMassFinger: false,
    ownsMassBishop: false,
    ownsLightFinger: false,
    ownsLightBishop: false,
    ownsInspectFinger: false,
    ownsInspectBishop: false,
    ownsCompositeFinger: false,
    ownsCompositeBishop: false,
    ownsCompositeTruth: false,
    ownsWorldExpressionTruth: false,
    ownsMaterialsAuthority: false,
    ownsCompositionAuthority: false,
    ownsAirChannelAuthority: false,
    ownsCliffsAuthority: false,
    ownsRouteConductor: false,
    ownsDiagnosticRail: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsBiomeTruth: false,
    ownsSettlementTruth: false,
    ownsFinalVisualPassClaim: false,

    hexExpressionSocketActive: true,
    hexSurfaceExpressionAuthority: true,
    hexSurfaceConsumerExpected: true,
    hexSurfaceProjectionDelegated: true,
    canvasDrawingDelegatedToHexSurface: true,
    directCanvasDrawingSuppressed: true,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();

    readBoundaryEvidence();
    readMassEvidence();
    buildSurfaceModel();
    buildSurfacePacket();
    buildPointerFingerPacket();
    buildPointerBishopPacket();
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
    recordError("SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
