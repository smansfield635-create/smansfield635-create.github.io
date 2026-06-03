// /assets/hearth/hearth.canvas.finger.surface.js
// HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_TNT_v2
// Full-file replacement.
// Canvas Finger 3 / Surface / Pointer Finger / External Expression Socket.
// Previous:
// HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_TNT_v1
// Purpose:
// - Preserve Surface as Canvas Finger 3.
// - Renew Surface into the Pointer Finger: the single external donor-expression intake socket.
// - Receive external canvas/archive/donor expression packets through Surface first.
// - Classify incoming expression into internal categories.
// - Integrate only lawful surface-visible expression directly.
// - Route non-surface categories to existing internal fingers/files when receivers exist.
// - Hold recognized packets safely when the receiving file is not yet renewed or unavailable.
// - Preserve Boundary Finger and Mass Finger consumption.
// - Preserve first material differentiation and visible surface contribution APIs.
// - Preserve Canvas hub registration without becoming the Canvas parent.
// - Do not mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, Boundary Finger, Mass Finger, Light Finger, Inspect Finger, materials, composition, air channel, cliffs, or any donor file.
// - Do not claim final terrain truth, hydrology truth, material truth, elevation truth, F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_TNT_v2";
  const RECEIPT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_RECEIPT_v2";
  const PACKET = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_PACKET_v2";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_TNT_v1";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_RECEIPT_v1";
  const PREVIOUS_PACKET = "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_PACKET_v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const MATERIALS_FILE = "/assets/hearth/hearth.materials.js";
  const COMPOSITION_FILE = "/assets/hearth/hearth.composition.js";
  const AIR_CHANNEL_FILE = "/assets/hearth/hearth.air.channel.js";
  const CLIFFS_FILE = "/assets/hearth/hearth.cliffs.js";

  const NEXT_FILE = LIGHT_FILE;

  const FINGER_NAME = "surface";
  const FINGER_ROLE = "pointer-finger-external-expression-socket";
  const FINGER_ORDER = 3;
  const FINGER_STRETCH_TOTAL = 5;

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
    settlementTruthClaimed: false,
    finalVisualPassClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const CATEGORY = Object.freeze({
    SURFACE: "surface",
    MASS: "mass",
    BOUNDARY: "boundary",
    LIGHT: "light",
    INSPECT: "inspect",
    MATERIALS: "materials",
    COMPOSITION: "composition",
    AIR_CHANNEL: "air-channel",
    CLIFFS: "cliffs",
    HYDROLOGY_INTERFACE: "hydrology-interface",
    UNKNOWN: "unknown"
  });

  const ROUTING_STATUS = Object.freeze({
    INTEGRATED_BY_SURFACE: "INTEGRATED_BY_SURFACE",
    ROUTED_TO_RECEIVER: "ROUTED_TO_RECEIVER",
    HELD_FOR_RECEIVER_RENEWAL: "HELD_FOR_RECEIVER_RENEWAL",
    REJECTED_UNCLASSIFIED: "REJECTED_UNCLASSIFIED"
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
      file: FILE,
      role: "pointer finger, external expression socket, surface-visible synthesis"
    }),
    Object.freeze({
      order: 4,
      name: "light",
      file: LIGHT_FILE,
      role: "visibility, light, chamber realism, atmosphere-edge readability"
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
    "receiveSurfaceFingerPacket",
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

  const TARGET_RECEIVERS = Object.freeze({
    [CATEGORY.BOUNDARY]: Object.freeze({
      category: CATEGORY.BOUNDARY,
      file: BOUNDARY_FILE,
      authority: "boundary/silhouette/containment",
      surfaceOwnsCategory: false,
      globalPaths: BOUNDARY_SOURCE_NAMES,
      methods: Object.freeze([
        "receiveSurfacePointerPacket",
        "receivePointerFingerPacket",
        "receiveExternalExpression",
        "receiveExpressionPacket",
        "receiveBoundaryExpressionPacket",
        "receiveChildPacket"
      ])
    }),
    [CATEGORY.MASS]: Object.freeze({
      category: CATEGORY.MASS,
      file: MASS_FILE,
      authority: "body/mass/volume/physical pressure",
      surfaceOwnsCategory: false,
      globalPaths: MASS_SOURCE_NAMES,
      methods: Object.freeze([
        "receiveSurfacePointerPacket",
        "receivePointerFingerPacket",
        "receiveExternalExpression",
        "receiveExpressionPacket",
        "receiveMassExpressionPacket",
        "receiveChildPacket"
      ])
    }),
    [CATEGORY.LIGHT]: Object.freeze({
      category: CATEGORY.LIGHT,
      file: LIGHT_FILE,
      authority: "light/shadow/chamber visibility/atmosphere edge",
      surfaceOwnsCategory: false,
      globalPaths: Object.freeze([
        "HEARTH.canvasFingerLight",
        "HEARTH.canvasLightFinger",
        "HEARTH_CANVAS_FINGER_LIGHT",
        "HEARTH_CANVAS_LIGHT_FINGER"
      ]),
      methods: Object.freeze([
        "receiveSurfacePointerPacket",
        "receivePointerFingerPacket",
        "receiveExternalExpression",
        "receiveExpressionPacket",
        "receiveLightExpressionPacket",
        "receiveChildPacket"
      ])
    }),
    [CATEGORY.INSPECT]: Object.freeze({
      category: CATEGORY.INSPECT,
      file: INSPECT_FILE,
      authority: "inspection/readability/click-facing proof",
      surfaceOwnsCategory: false,
      globalPaths: Object.freeze([
        "HEARTH.canvasFingerInspect",
        "HEARTH.canvasInspectFinger",
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH_CANVAS_INSPECT_FINGER"
      ]),
      methods: Object.freeze([
        "receiveSurfacePointerPacket",
        "receivePointerFingerPacket",
        "receiveExternalExpression",
        "receiveExpressionPacket",
        "receiveInspectExpressionPacket",
        "receiveClickExpressionPacket",
        "receiveChildPacket"
      ])
    }),
    [CATEGORY.MATERIALS]: Object.freeze({
      category: CATEGORY.MATERIALS,
      file: MATERIALS_FILE,
      authority: "material/mineral/color/texture families",
      surfaceOwnsCategory: false,
      globalPaths: Object.freeze([
        "HEARTH.materials",
        "HEARTH.hearthMaterials",
        "HEARTH_MATERIALS",
        "HEARTH_CANVAS_MATERIALS",
        "HEARTH_CANVAS_MATERIAL_AUTHORITY"
      ]),
      methods: Object.freeze([
        "receiveSurfacePointerPacket",
        "receivePointerFingerPacket",
        "receiveExternalExpression",
        "receiveExpressionPacket",
        "receiveMaterialExpressionPacket",
        "receiveChildPacket"
      ])
    }),
    [CATEGORY.COMPOSITION]: Object.freeze({
      category: CATEGORY.COMPOSITION,
      file: COMPOSITION_FILE,
      authority: "planetary composition/layered structure/internal formation",
      surfaceOwnsCategory: false,
      globalPaths: Object.freeze([
        "HEARTH.composition",
        "HEARTH.hearthComposition",
        "HEARTH_COMPOSITION",
        "HEARTH_CANVAS_COMPOSITION",
        "HEARTH_PLANET_COMPOSITION"
      ]),
      methods: Object.freeze([
        "receiveSurfacePointerPacket",
        "receivePointerFingerPacket",
        "receiveExternalExpression",
        "receiveExpressionPacket",
        "receiveCompositionExpressionPacket",
        "receiveChildPacket"
      ])
    }),
    [CATEGORY.AIR_CHANNEL]: Object.freeze({
      category: CATEGORY.AIR_CHANNEL,
      file: AIR_CHANNEL_FILE,
      authority: "air channel/pressure/haze/sky shell/atmosphere behavior",
      surfaceOwnsCategory: false,
      globalPaths: Object.freeze([
        "HEARTH.airChannel",
        "HEARTH.hearthAirChannel",
        "HEARTH_AIR_CHANNEL",
        "HEARTH_CANVAS_AIR_CHANNEL",
        "HEARTH_ATMOSPHERE_CHANNEL"
      ]),
      methods: Object.freeze([
        "receiveSurfacePointerPacket",
        "receivePointerFingerPacket",
        "receiveExternalExpression",
        "receiveExpressionPacket",
        "receiveAirChannelExpressionPacket",
        "receiveAtmosphereExpressionPacket",
        "receiveChildPacket"
      ])
    }),
    [CATEGORY.CLIFFS]: Object.freeze({
      category: CATEGORY.CLIFFS,
      file: CLIFFS_FILE,
      authority: "cliffs/escarpments/vertical relief/edge relief",
      surfaceOwnsCategory: false,
      globalPaths: Object.freeze([
        "HEARTH.cliffs",
        "HEARTH.hearthCliffs",
        "HEARTH_CLIFFS",
        "HEARTH_CANVAS_CLIFFS",
        "HEARTH_RELIEF_CLIFFS"
      ]),
      methods: Object.freeze([
        "receiveSurfacePointerPacket",
        "receivePointerFingerPacket",
        "receiveExternalExpression",
        "receiveExpressionPacket",
        "receiveCliffExpressionPacket",
        "receiveReliefExpressionPacket",
        "receiveChildPacket"
      ])
    }),
    [CATEGORY.SURFACE]: Object.freeze({
      category: CATEGORY.SURFACE,
      file: FILE,
      authority: "surface-visible synthesis and external intake routing",
      surfaceOwnsCategory: true,
      globalPaths: Object.freeze([]),
      methods: Object.freeze([])
    }),
    [CATEGORY.HYDROLOGY_INTERFACE]: Object.freeze({
      category: CATEGORY.HYDROLOGY_INTERFACE,
      file: FILE,
      authority: "visible wet/dry contact only; hydrology truth not owned",
      surfaceOwnsCategory: true,
      globalPaths: Object.freeze([]),
      methods: Object.freeze([])
    })
  });

  const KEYWORDS = Object.freeze({
    [CATEGORY.MASS]: Object.freeze([
      "mass", "volume", "body", "sphere", "planet body", "physical", "pressure",
      "core", "weight", "density", "land shape", "body shape", "formation pressure"
    ]),
    [CATEGORY.BOUNDARY]: Object.freeze([
      "boundary", "silhouette", "edge", "containment", "rim", "outline",
      "sphere edge", "body edge", "clip", "mask", "envelope"
    ]),
    [CATEGORY.LIGHT]: Object.freeze([
      "light", "shadow", "shade", "glow", "illumination", "sun", "specular",
      "atmosphere edge", "horizon light", "visibility", "chamber light"
    ]),
    [CATEGORY.INSPECT]: Object.freeze([
      "inspect", "inspection", "click", "select", "hover", "readability", "proof",
      "viewer", "hit", "target", "label", "interaction", "control"
    ]),
    [CATEGORY.MATERIALS]: Object.freeze([
      "material", "mineral", "texture", "color", "soil", "rock", "crust",
      "palette", "surface color", "tone", "grain", "sediment"
    ]),
    [CATEGORY.COMPOSITION]: Object.freeze([
      "composition", "layer", "strata", "mantle", "crust", "internal",
      "structure", "planetary structure", "substrate", "lattice"
    ]),
    [CATEGORY.AIR_CHANNEL]: Object.freeze([
      "air", "atmosphere", "haze", "fog", "pressure", "sky", "breath",
      "air channel", "vapor", "mist", "cloud", "aerosol"
    ]),
    [CATEGORY.CLIFFS]: Object.freeze([
      "cliff", "cliffs", "escarpment", "ridge", "relief", "vertical",
      "slope", "wall", "mountain edge", "drop", "ravine"
    ]),
    [CATEGORY.HYDROLOGY_INTERFACE]: Object.freeze([
      "waterline", "wet", "shore", "coast", "basin", "shelf", "ocean interface",
      "hydrology interface", "dry", "submerged", "water contact"
    ]),
    [CATEGORY.SURFACE]: Object.freeze([
      "surface", "terrain", "land", "field", "patch", "zone", "formation",
      "visible surface", "skin", "planet surface", "factory surface"
    ])
  });

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
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    previousPacket: PREVIOUS_PACKET,

    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
    boundaryFile: BOUNDARY_FILE,
    massFile: MASS_FILE,
    lightFile: LIGHT_FILE,
    inspectFile: INSPECT_FILE,
    materialsFile: MATERIALS_FILE,
    compositionFile: COMPOSITION_FILE,
    airChannelFile: AIR_CHANNEL_FILE,
    cliffsFile: CLIFFS_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,

    surfaceFingerLoaded: true,
    surfaceFingerActive: true,
    pointerFingerActive: true,
    externalExpressionSocketActive: true,
    singleExternalInputReceiver: true,
    firstMaterialDifferentiationActive: true,

    boundaryDependencyExpected: true,
    boundaryDependencyObserved: false,
    boundaryPacketObserved: false,
    boundaryModelObserved: false,

    massDependencyExpected: true,
    massDependencyObserved: false,
    massPacketObserved: false,
    massModelObserved: false,

    surfaceModelReady: false,
    firstSurfaceDifferentiationReady: false,
    roughTerrainTintReady: false,
    shallowMaterialVariationReady: false,
    surfacePacketReady: false,
    pointerFingerPacketReady: false,
    visibleContributionAvailable: false,

    externalIntakeReady: true,
    externalIntakeCount: 0,
    classifiedExpressionCount: 0,
    surfaceIntegratedCount: 0,
    routedExpressionCount: 0,
    heldExpressionCount: 0,
    rejectedExpressionCount: 0,

    latestExternalPacketId: "NONE",
    latestExternalPacketCategory: "NONE",
    latestExternalPacketStatus: "NONE",

    categoryCounts: {},
    registeredReceivers: {},

    externalIntakeLedger: [],
    classifiedLedger: [],
    routedLedger: [],
    heldDonorQueue: [],
    rejectedDonorQueue: [],
    surfaceIntegratedDonors: [],
    surfaceFormationFields: [],
    surfaceMaterialFamilies: [],

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",

    firstFailedCoordinate: "SURFACE_POINTER_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "SURFACE_POINTER_FINGER_WAITING_BOOT",

    boundaryPacket: null,
    boundaryModel: null,
    massPacket: null,
    massModel: null,
    surfaceModel: null,
    surfacePacket: null,
    pointerFingerPacket: null,
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

  function bounded(value, limit = 4000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "SURFACE_POINTER_FINGER_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 160);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "SURFACE_POINTER_FINGER_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 100);
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

  function nextExternalId() {
    return `SURFACE_POINTER_EXTERNAL_${String(state.externalIntakeCount + 1).padStart(4, "0")}`;
  }

  function getObjectText(value, limit = 8000) {
    try {
      if (typeof value === "string") return bounded(value, limit);
      return bounded(JSON.stringify(value), limit);
    } catch (_error) {
      return bounded(String(value), limit);
    }
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
      ""
    ).trim().toLowerCase();
  }

  function normalizeCategory(category) {
    const text = safeString(category).trim().toLowerCase();

    if (!text) return CATEGORY.UNKNOWN;
    if (text.includes("hydro") || text.includes("waterline") || text.includes("coast") || text.includes("shore")) return CATEGORY.HYDROLOGY_INTERFACE;
    if (text.includes("air") || text.includes("atmosphere") || text.includes("haze")) return CATEGORY.AIR_CHANNEL;
    if (text.includes("material") || text.includes("mineral") || text.includes("texture")) return CATEGORY.MATERIALS;
    if (text.includes("composition") || text.includes("layer") || text.includes("structure")) return CATEGORY.COMPOSITION;
    if (text.includes("cliff") || text.includes("relief") || text.includes("ridge")) return CATEGORY.CLIFFS;
    if (text.includes("inspect") || text.includes("click") || text.includes("interaction")) return CATEGORY.INSPECT;
    if (text.includes("light") || text.includes("shadow") || text.includes("illumination")) return CATEGORY.LIGHT;
    if (text.includes("boundary") || text.includes("edge") || text.includes("silhouette")) return CATEGORY.BOUNDARY;
    if (text.includes("mass") || text.includes("body") || text.includes("volume")) return CATEGORY.MASS;
    if (text.includes("surface") || text.includes("terrain") || text.includes("land")) return CATEGORY.SURFACE;

    for (const key of Object.values(CATEGORY)) {
      if (text === key) return key;
    }

    return CATEGORY.UNKNOWN;
  }

  function classifyExternalExpression(input = {}, options = {}) {
    const explicit = normalizeCategory(options.category || getExplicitCategory(input));
    const text = getObjectText(input, 10000).toLowerCase();
    const scores = {};

    for (const category of Object.values(CATEGORY)) {
      scores[category] = 0;
    }

    if (explicit !== CATEGORY.UNKNOWN) {
      scores[explicit] += 12;
    }

    for (const [category, words] of Object.entries(KEYWORDS)) {
      for (const word of words) {
        if (text.includes(word.toLowerCase())) {
          scores[category] += 1;
        }
      }
    }

    if (isObject(input)) {
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
      ...FINAL_FALSE
    };
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
      packetType: "HEARTH_SURFACE_POINTER_EXTERNAL_EXPRESSION_INTAKE_PACKET",
      pointerContract: CONTRACT,
      pointerReceipt: RECEIPT,
      pointerFile: FILE,
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
      surfaceOwnsFinalCategoryTruth: false,
      ...FINAL_FALSE
    };
  }

  function incrementCategory(category) {
    const key = category || CATEGORY.UNKNOWN;
    state.categoryCounts[key] = safeNumber(state.categoryCounts[key], 0) + 1;
  }

  function buildRouteEnvelope(normalized, classification, route) {
    return {
      packetType: "HEARTH_SURFACE_POINTER_ROUTED_EXPRESSION_PACKET",
      pointerContract: CONTRACT,
      pointerReceipt: RECEIPT,
      pointerFile: FILE,
      externalPacketId: normalized.id,
      routedAt: nowIso(),
      category: classification.category,
      confidence: classification.confidence,
      score: classification.score,
      targetFile: route ? route.file : "NONE",
      targetAuthority: route ? route.authority : "NONE",
      sourceName: normalized.sourceName,
      sourceFile: normalized.sourceFile,
      sourceContract: normalized.sourceContract,
      sourceReceipt: normalized.sourceReceipt,
      payload: clonePlain(normalized.payload),
      payloadSummary: normalized.payloadSummary,
      surfacePointerOwnsRouting: true,
      receivingFileOwnsCategoryAuthority: Boolean(route && route.surfaceOwnsCategory === false),
      surfaceOwnsCategoryAuthority: Boolean(route && route.surfaceOwnsCategory === true),
      ...FINAL_FALSE
    };
  }

  function findRegisteredReceiver(category) {
    const entry = state.registeredReceivers[category];
    if (entry && isObject(entry.receiver)) {
      return {
        receiver: entry.receiver,
        sourceName: entry.name || `REGISTERED:${category}`
      };
    }

    return { receiver: null, sourceName: "NONE" };
  }

  function findCategoryReceiver(route) {
    const registered = findRegisteredReceiver(route.category);
    if (registered.receiver) return registered;

    const found = findSource(route.globalPaths || []);
    return {
      receiver: found.source,
      sourceName: found.sourceName
    };
  }

  function routeToExistingReceiver(normalized, classification) {
    const route = TARGET_RECEIVERS[classification.category];

    if (!route) {
      return holdDonor(normalized, classification, "NO_ROUTE_FOR_CATEGORY");
    }

    if (route.surfaceOwnsCategory === true) {
      return integrateSurfaceVisibleExpression(normalized, classification, route);
    }

    const found = findCategoryReceiver(route);
    const envelope = buildRouteEnvelope(normalized, classification, route);

    if (!found.receiver) {
      return holdDonor(normalized, classification, "RECEIVER_NOT_AVAILABLE");
    }

    for (const method of route.methods || []) {
      if (!isFunction(found.receiver[method])) continue;

      try {
        const response = found.receiver[method](clonePlain(envelope));

        const accepted = response !== false;

        const routed = {
          id: normalized.id,
          category: classification.category,
          status: accepted ? ROUTING_STATUS.ROUTED_TO_RECEIVER : ROUTING_STATUS.HELD_FOR_RECEIVER_RENEWAL,
          receiverSourceName: found.sourceName,
          receiverFile: route.file,
          method,
          response: clonePlain(response),
          routedAt: nowIso(),
          ...FINAL_FALSE
        };

        if (accepted) {
          state.routedLedger.push(routed);
          trimArray(state.routedLedger, 120);
          state.routedExpressionCount += 1;
          state.latestExternalPacketStatus = ROUTING_STATUS.ROUTED_TO_RECEIVER;

          record("SURFACE_POINTER_ROUTED_EXTERNAL_EXPRESSION", routed);
          return routed;
        }

        return holdDonor(normalized, classification, "RECEIVER_REJECTED_PACKET", {
          receiverSourceName: found.sourceName,
          receiverFile: route.file,
          method
        });
      } catch (error) {
        recordError("SURFACE_POINTER_RECEIVER_METHOD_FAILED", error, {
          category: classification.category,
          receiverSourceName: found.sourceName,
          method
        });
      }
    }

    return holdDonor(normalized, classification, "RECEIVER_METHOD_NOT_AVAILABLE", {
      receiverSourceName: found.sourceName,
      receiverFile: route.file
    });
  }

  function holdDonor(normalized, classification, reason, detail = {}) {
    const route = TARGET_RECEIVERS[classification.category] || null;

    const held = {
      id: normalized.id,
      category: classification.category,
      confidence: classification.confidence,
      status: ROUTING_STATUS.HELD_FOR_RECEIVER_RENEWAL,
      heldReason: reason,
      targetFile: route ? route.file : "UNKNOWN",
      targetAuthority: route ? route.authority : "UNKNOWN",
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

    record("SURFACE_POINTER_HELD_EXTERNAL_EXPRESSION", held);
    return held;
  }

  function rejectDonor(normalized, classification, reason) {
    const rejected = {
      id: normalized.id,
      category: classification.category,
      confidence: classification.confidence,
      status: ROUTING_STATUS.REJECTED_UNCLASSIFIED,
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
    state.latestExternalPacketStatus = ROUTING_STATUS.REJECTED_UNCLASSIFIED;

    record("SURFACE_POINTER_REJECTED_EXTERNAL_EXPRESSION", rejected);
    return rejected;
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

    for (const entry of directFields.slice(0, 48)) {
      if (!isObject(entry)) continue;

      fields.push({
        id: safeString(entry.id || entry.name || `SURFACE_DONOR_FIELD_${fields.length + 1}`),
        x: clamp(entry.x ?? entry.cx ?? entry.centerX ?? 0.5, 0, 1),
        y: clamp(entry.y ?? entry.cy ?? entry.centerY ?? 0.5, 0, 1),
        scale: clamp(entry.scale ?? entry.radius ?? entry.size ?? 0.16, 0.02, 0.6),
        value: clamp(entry.value ?? entry.weight ?? entry.strength ?? 0.55, 0, 1),
        donorCategory: classification.category,
        donorConfidence: classification.confidence,
        ownsTruth: false
      });
    }

    if (!fields.length) {
      fields.push({
        id: `SURFACE_POINTER_DONOR_${state.surfaceIntegratedCount + 1}`,
        x: 0.5,
        y: 0.5,
        scale: classification.category === CATEGORY.HYDROLOGY_INTERFACE ? 0.24 : 0.2,
        value: classification.category === CATEGORY.HYDROLOGY_INTERFACE ? 0.42 : 0.56,
        donorCategory: classification.category,
        donorConfidence: classification.confidence,
        ownsTruth: false
      });
    }

    return fields;
  }

  function integrateSurfaceVisibleExpression(normalized, classification, route) {
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

    trimArray(state.surfaceFormationFields, 160);

    const family = {
      id: `SURFACE_POINTER_FAMILY_${state.surfaceIntegratedCount + 1}`,
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
    trimArray(state.surfaceMaterialFamilies, 120);

    const integrated = {
      id: normalized.id,
      category: classification.category,
      status: ROUTING_STATUS.INTEGRATED_BY_SURFACE,
      integratedFields: fields.length,
      targetFile: route.file,
      targetAuthority: route.authority,
      sourceName: normalized.sourceName,
      sourceFile: normalized.sourceFile,
      integratedAt: nowIso(),
      ...FINAL_FALSE
    };

    state.surfaceIntegratedDonors.push(integrated);
    trimArray(state.surfaceIntegratedDonors, 120);
    state.surfaceIntegratedCount += 1;
    state.latestExternalPacketStatus = ROUTING_STATUS.INTEGRATED_BY_SURFACE;

    buildSurfaceModel({ rebuildFromPointerFields: true });
    buildSurfacePacket();

    record("SURFACE_POINTER_INTEGRATED_SURFACE_VISIBLE_EXPRESSION", integrated);
    return integrated;
  }

  function receiveExternalExpression(input = {}, options = {}) {
    const normalized = normalizeExternalExpression(input, options);
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
    trimArray(state.externalIntakeLedger, 160);

    state.classifiedLedger.push({
      id: normalized.id,
      category: classification.category,
      confidence: classification.confidence,
      score: classification.score,
      explicitCategory: classification.explicitCategory,
      classifiedAt: nowIso(),
      ...FINAL_FALSE
    });
    trimArray(state.classifiedLedger, 160);

    let result;

    if (!classification.classificationComplete || classification.category === CATEGORY.UNKNOWN) {
      result = rejectDonor(normalized, classification, "CATEGORY_UNCLASSIFIED");
    } else {
      result = routeToExistingReceiver(normalized, classification);
    }

    updateDataset();
    publishGlobals();

    return {
      ok: result.status !== ROUTING_STATUS.REJECTED_UNCLASSIFIED,
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      externalPacketId: normalized.id,
      classification,
      routingResult: clonePlain(result),
      surfacePointerSocketActive: true,
      externalInformationReceivedThroughSurfaceOnly: true,
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

    record("SURFACE_POINTER_REGISTERED_INTERNAL_RECEIVER", {
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
    const map = {};

    for (const category of Object.values(CATEGORY)) {
      if (category === CATEGORY.UNKNOWN) continue;

      const route = TARGET_RECEIVERS[category] || null;
      map[category] = route
        ? {
            category,
            file: route.file,
            authority: route.authority,
            surfaceOwnsCategory: route.surfaceOwnsCategory,
            externalEntryPoint: FILE,
            receiverRegistered: Boolean(state.registeredReceivers[category]),
            globalPaths: clonePlain(route.globalPaths || []),
            methods: clonePlain(route.methods || [])
          }
        : {
            category,
            file: "UNKNOWN",
            authority: "UNKNOWN",
            surfaceOwnsCategory: false,
            externalEntryPoint: FILE,
            receiverRegistered: false,
            globalPaths: [],
            methods: []
          };
    }

    return map;
  }

  function getHeldDonorQueue() {
    return clonePlain(state.heldDonorQueue);
  }

  function getRejectedDonorQueue() {
    return clonePlain(state.rejectedDonorQueue);
  }

  function getExternalIntakeReceipt() {
    return {
      receiptType: "HEARTH_SURFACE_POINTER_EXTERNAL_EXPRESSION_SOCKET_RECEIPT",
      timestamp: nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      pointerFingerActive: state.pointerFingerActive,
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
      surfaceOwnsSurfaceVisibleSynthesis: true,
      surfaceOwnsAllExternalIntake: true,
      surfaceOwnsMass: false,
      surfaceOwnsBoundary: false,
      surfaceOwnsLight: false,
      surfaceOwnsInspect: false,
      surfaceOwnsMaterials: false,
      surfaceOwnsComposition: false,
      surfaceOwnsAirChannel: false,
      surfaceOwnsCliffs: false,
      surfaceOwnsHydrologyTruth: false,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
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
      recordError("SURFACE_POINTER_BOUNDARY_READ_FAILED", error, {
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
      recordError("SURFACE_POINTER_MASS_READ_FAILED", error, {
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

  function defaultBoundaryModel() {
    return {
      modelType: "HEARTH_BASE_GLOBE_BOUNDARY_MODEL_FALLBACK_FOR_SURFACE_POINTER_FINGER",
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
      modelType: "HEARTH_BASE_GLOBE_MASS_MODEL_FALLBACK_FOR_SURFACE_POINTER_FINGER",
      centerX: safeNumber(b.centerX, 0.5),
      centerY: safeNumber(b.centerY, 0.5),
      radius: safeNumber(b.radius, 0.47),
      massAnchors: [
        { id: "SURFACE_POINTER_FALLBACK_NW", x: 0.35, y: 0.39, scale: 0.22, weight: 0.7 },
        { id: "SURFACE_POINTER_FALLBACK_C", x: 0.5, y: 0.52, scale: 0.25, weight: 0.8 },
        { id: "SURFACE_POINTER_FALLBACK_SE", x: 0.61, y: 0.64, scale: 0.2, weight: 0.62 }
      ],
      fallbackUsed: true,
      terrainTruthClaim: false,
      materialTruthClaim: false,
      elevationTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function baseMaterialFamilies() {
    return [
      {
        id: "SURFACE_DRY_HIGH_TONE",
        label: "dry-rock-soil-first-pass",
        threshold: 0.62,
        tint: "rock-soil",
        ownsTruth: false
      },
      {
        id: "SURFACE_MID_BODY_TONE",
        label: "weathered-ground-first-pass",
        threshold: 0.38,
        tint: "weathered-ground",
        ownsTruth: false
      },
      {
        id: "SURFACE_LOW_BODY_TONE",
        label: "low-shadow-shelf-first-pass",
        threshold: 0.18,
        tint: "low-body-shadow",
        ownsTruth: false
      },
      {
        id: "SURFACE_BOUNDARY_EDGE_TONE",
        label: "body-edge-readability",
        threshold: 0.05,
        tint: "edge-readability",
        ownsTruth: false
      }
    ];
  }

  function baseSurfaceFields(centerX, centerY, radius) {
    return [
      { id: "SURFACE_NORTHWEST_PATCH", x: centerX - radius * 0.3, y: centerY - radius * 0.18, scale: 0.17, value: 0.72 },
      { id: "SURFACE_NORTH_PATCH", x: centerX + radius * 0.02, y: centerY - radius * 0.33, scale: 0.13, value: 0.48 },
      { id: "SURFACE_EAST_PATCH", x: centerX + radius * 0.3, y: centerY - radius * 0.05, scale: 0.16, value: 0.66 },
      { id: "SURFACE_CENTER_PATCH", x: centerX - radius * 0.02, y: centerY + radius * 0.04, scale: 0.22, value: 0.82 },
      { id: "SURFACE_SOUTHWEST_PATCH", x: centerX - radius * 0.21, y: centerY + radius * 0.35, scale: 0.14, value: 0.44 },
      { id: "SURFACE_SOUTHEAST_PATCH", x: centerX + radius * 0.24, y: centerY + radius * 0.28, scale: 0.15, value: 0.58 }
    ];
  }

  function buildSurfaceModel(options = {}) {
    const boundaryEvidence = readBoundaryEvidence();
    const massEvidence = readMassEvidence();

    const boundaryModel = boundaryEvidence.model || defaultBoundaryModel();
    const massModel = massEvidence.model || defaultMassModel(boundaryModel);

    const centerX = clamp(options.centerX ?? massModel.centerX ?? boundaryModel.centerX ?? 0.5, 0, 1);
    const centerY = clamp(options.centerY ?? massModel.centerY ?? boundaryModel.centerY ?? 0.5, 0, 1);
    const radius = clamp(options.radius ?? massModel.radius ?? boundaryModel.radius ?? 0.47, 0.05, 0.5);

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
      ...baseSurfaceFields(centerX, centerY, radius),
      ...state.surfaceFormationFields.map((field) => ({
        id: field.id,
        x: clamp(field.x, 0, 1),
        y: clamp(field.y, 0, 1),
        scale: clamp(field.scale, 0.02, 0.6),
        value: clamp(field.value, 0, 1),
        externalPacketId: field.externalPacketId,
        donorCategory: field.donorCategory,
        sourceName: field.sourceName,
        ownsTruth: false
      }))
    ];

    const model = {
      modelType: "HEARTH_BASE_GLOBE_SURFACE_POINTER_FINGER_MODEL",
      centerX,
      centerY,
      radius,
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

      surfaceMode: "POINTER_FINGER_EXTERNAL_SOCKET_WITH_FIRST_PASS_MATERIAL_DIFFERENTIATION",
      surfaceCoordinateSpace: "normalized-0-to-1",
      projection: "front-facing-base-globe",

      externalExpressionSocketActive: true,
      singleExternalInputReceiver: true,
      surfaceIntegratedDonorCount: state.surfaceIntegratedDonors.length,
      heldDonorQueueCount: state.heldDonorQueue.length,

      terrainTruthClaim: false,
      hydrologyTruthClaim: false,
      materialTruthClaim: false,
      elevationTruthClaim: false,
      biomeTruthClaim: false,
      settlementTruthClaim: false,
      finalGeometryClaim: false,
      finalVisualClaim: false
    };

    state.surfaceModel = clonePlain(model);
    state.surfaceModelReady = true;
    state.firstSurfaceDifferentiationReady = true;
    state.roughTerrainTintReady = true;
    state.shallowMaterialVariationReady = true;
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

  function sampleMassInfluence(point, model) {
    const massModel = model && model.massModel ? model.massModel : defaultMassModel(model && model.boundaryModel);
    const anchors = Array.isArray(massModel.massAnchors) ? massModel.massAnchors : [];
    const radius = safeNumber(massModel.radius, 0.47);

    let mass = 0;

    for (const anchor of anchors) {
      const dx = point.x - safeNumber(anchor.x, 0.5);
      const dy = point.y - safeNumber(anchor.y, 0.5);
      const d = Math.sqrt((dx * dx) + (dy * dy));
      const scale = Math.max(0.0001, safeNumber(anchor.scale, 0.18) * radius);
      mass += Math.exp(-((d * d) / (2 * scale * scale))) * safeNumber(anchor.weight, 0.5);
    }

    return clamp(mass, 0, 1);
  }

  function sampleSurfaceValue(point, model) {
    const containment = sampleBoundaryContainment(point, model);
    const mass = sampleMassInfluence(point, model);

    let fieldValue = 0;

    for (const seed of model.surfaceFormationFields || model.surfaceSeeds || []) {
      const dx = point.x - safeNumber(seed.x, 0.5);
      const dy = point.y - safeNumber(seed.y, 0.5);
      const d = Math.sqrt((dx * dx) + (dy * dy));
      const scale = Math.max(0.0001, safeNumber(seed.scale, 0.16) * model.radius);
      fieldValue += Math.exp(-((d * d) / (2 * scale * scale))) * safeNumber(seed.value, 0.5);
    }

    const latitudeBias = clamp(1 - Math.abs(point.y - model.centerY) * 1.6, 0, 1);
    const radialBias = containment;

    const surface = clamp(
      ((mass * 0.42) + (fieldValue * 0.46) + (latitudeBias * 0.12)) * radialBias,
      0,
      1
    );

    let materialClass = "outside-body";

    if (containment > 0) {
      if (surface >= 0.62) materialClass = "dry-rock-soil-first-pass";
      else if (surface >= 0.38) materialClass = "weathered-ground-first-pass";
      else if (surface >= 0.18) materialClass = "low-body-shadow-first-pass";
      else materialClass = "edge-readability-first-pass";
    }

    return {
      containment,
      mass,
      surface,
      materialClass
    };
  }

  function sampleSurface(x, y, width, height) {
    const model = state.surfaceModel || buildSurfaceModel();
    const point = normalizePoint(x, y, width, height);
    const value = sampleSurfaceValue(point, model);

    return {
      x: point.x,
      y: point.y,
      containment: value.containment,
      mass: value.mass,
      surface: value.surface,
      materialClass: value.materialClass,
      firstSurfaceDifferentiationReady: true,
      pointerFingerSocketActive: true,
      terrainTruthClaim: false,
      hydrologyTruthClaim: false,
      materialTruthClaim: false,
      elevationTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function sample(x, y, options = {}) {
    return {
      packetType: "HEARTH_CANVAS_SURFACE_POINTER_FINGER_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      fingerName: FINGER_NAME,
      surface: sampleSurface(x, y, options.width, options.height),
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

    const model = state.surfaceModel || buildSurfaceModel(options);
    const minSide = Math.min(width, height);

    try {
      context.save();

      for (const seed of model.surfaceFormationFields || model.surfaceSeeds || []) {
        const cx = safeNumber(seed.x, 0.5) * width;
        const cy = safeNumber(seed.y, 0.5) * height;
        const r = Math.max(1, safeNumber(seed.scale, 0.16) * model.radius * minSide * 2.15);
        const value = safeNumber(seed.value, 0.5);
        const donorCategory = safeString(seed.donorCategory || "");

        let fill = "rgba(112, 116, 87, 0.22)";

        if (donorCategory === CATEGORY.HYDROLOGY_INTERFACE) {
          fill = "rgba(74, 124, 132, 0.22)";
        } else if (value >= 0.7) {
          fill = "rgba(143, 126, 82, 0.30)";
        } else if (value >= 0.52) {
          fill = "rgba(108, 132, 91, 0.24)";
        } else {
          fill = "rgba(77, 91, 82, 0.20)";
        }

        context.globalAlpha = clamp(options.surfaceOpacity ?? 0.58, 0, 0.72);
        context.beginPath();
        context.ellipse(
          cx,
          cy,
          r * clamp(options.ellipseX ?? 1.28, 0.5, 2.4),
          r * clamp(options.ellipseY ?? 0.72, 0.35, 2.2),
          safeNumber(options.rotation ?? -0.22, 0),
          0,
          Math.PI * 2
        );
        context.fillStyle = fill;
        context.fill();
      }

      context.globalAlpha = clamp(options.bodyGlazeOpacity ?? 0.12, 0, 0.28);
      context.beginPath();
      context.arc(model.centerX * width, model.centerY * height, model.radius * minSide * 0.985, 0, Math.PI * 2);
      context.fillStyle = "rgba(121, 105, 72, 0.12)";
      context.fill();

      context.globalAlpha = clamp(options.edgeSurfaceOpacity ?? 0.2, 0, 0.35);
      context.lineWidth = Math.max(1, minSide * 0.006);
      context.beginPath();
      context.arc(model.centerX * width, model.centerY * height, model.radius * minSide * 0.998, 0, Math.PI * 2);
      context.strokeStyle = "rgba(199, 175, 105, 0.24)";
      context.stroke();

      context.restore();

      record("SURFACE_POINTER_DRAW_TO_CANVAS_COMPLETE", {
        width,
        height,
        fields: (model.surfaceFormationFields || []).length,
        finalVisualClaim: false
      });

      return {
        drawn: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        fingerName: FINGER_NAME,
        pointerFingerActive: true,
        visibleContributionAvailable: true,
        finalVisualClaim: false,
        ...FINAL_FALSE
      };
    } catch (error) {
      try {
        context.restore();
      } catch (_restoreError) {}

      recordError("SURFACE_POINTER_DRAW_TO_CANVAS_FAILED", error);

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

  function buildPointerFingerPacket(options = {}) {
    const surfacePacket = buildSurfacePacket(options);

    const packet = {
      packetType: "HEARTH_CANVAS_SURFACE_POINTER_FINGER_SOCKET_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,
      fingerStretchRegistry: clonePlain(FINGER_STRETCH_REGISTRY),

      pointerFingerActive: true,
      externalExpressionSocketActive: true,
      singleExternalInputReceiver: true,
      externalIntakeReady: true,

      externalIntakeReceipt: getExternalIntakeReceipt(),
      routingMap: getRoutingMap(),
      surfacePacket: clonePlain(surfacePacket),

      heldDonorQueueCount: state.heldDonorQueue.length,
      rejectedDonorQueueCount: state.rejectedDonorQueue.length,
      routedExpressionCount: state.routedExpressionCount,
      surfaceIntegratedCount: state.surfaceIntegratedCount,

      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.pointerFingerPacket = clonePlain(packet);
    state.pointerFingerPacketReady = true;

    return packet;
  }

  function buildSurfacePacket(options = {}) {
    const model = buildSurfaceModel(options);

    const packet = {
      packetType: "HEARTH_CANVAS_SURFACE_FINGER_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,
      fingerStretchRegistry: clonePlain(FINGER_STRETCH_REGISTRY),

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

      surfaceFingerActive: true,
      pointerFingerActive: true,
      externalExpressionSocketActive: true,
      singleExternalInputReceiver: true,
      firstMaterialDifferentiationActive: true,
      surfaceModelReady: true,
      firstSurfaceDifferentiationReady: true,
      roughTerrainTintReady: true,
      shallowMaterialVariationReady: true,
      surfacePacketReady: true,
      visibleContributionAvailable: true,

      surfaceModel: clonePlain(model),
      sampleAvailable: true,
      sampleSurfaceAvailable: true,
      drawToCanvasAvailable: true,

      externalIntakeReady: true,
      receiveExternalExpressionAvailable: true,
      classifyExternalExpressionAvailable: true,
      routeExpressionCategoryAvailable: true,
      getRoutingMapAvailable: true,
      getHeldDonorQueueAvailable: true,
      getExternalIntakeReceiptAvailable: true,

      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,

      recommendedNextFile: state.heldDonorQueue.length ? FILE : NEXT_FILE,
      recommendedNextRenewalTarget: state.heldDonorQueue.length ? "RECEIVER_CATEGORY_FROM_HELD_DONOR_QUEUE" : NEXT_FILE,
      firstFailedCoordinate: state.hubRegistrationAccepted
        ? "WAITING_EXTERNAL_DONOR_EXPRESSION_OR_LIGHT_FINGER"
        : "WAITING_CANVAS_HUB_SURFACE_FINGER_INTAKE",
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

    return packet;
  }

  function getSurfacePacket(options = {}) {
    if (!state.surfacePacket || options.rebuild === true) {
      return buildSurfacePacket(options);
    }

    return clonePlain(state.surfacePacket);
  }

  function getPointerFingerPacket(options = {}) {
    if (!state.pointerFingerPacket || options.rebuild === true) {
      return buildPointerFingerPacket(options);
    }

    return clonePlain(state.pointerFingerPacket);
  }

  function registerWithCanvasHub(options = {}) {
    const packet = buildSurfacePacket(options);
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
      state.postgameStatus = "SURFACE_POINTER_FINGER_HELD_CANVAS_HUB_NOT_FOUND";

      record("SURFACE_POINTER_HUB_NOT_FOUND", {
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
        state.hubRegistrationHeldReason = state.hubRegistrationAccepted ? "NONE" : "CANVAS_HUB_REJECTED_SURFACE_POINTER_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        if (state.hubRegistrationAccepted) {
          state.firstFailedCoordinate = "WAITING_EXTERNAL_DONOR_EXPRESSION_OR_LIGHT_FINGER";
          state.recommendedNextFile = NEXT_FILE;
          state.recommendedNextRenewalTarget = NEXT_FILE;
          state.postgameStatus = "SURFACE_POINTER_FINGER_ACCEPTED_BY_CANVAS_HUB_SOCKET_READY";
        } else {
          state.firstFailedCoordinate = "CANVAS_HUB_REJECTED_SURFACE_POINTER_PACKET";
          state.recommendedNextFile = PARENT_HUB_FILE;
          state.recommendedNextRenewalTarget = PARENT_HUB_FILE;
          state.postgameStatus = "SURFACE_POINTER_FINGER_HELD_CANVAS_HUB_REJECTED_PACKET";
        }

        record("SURFACE_POINTER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        buildSurfacePacket(options);
        buildPointerFingerPacket(options);
        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("SURFACE_POINTER_HUB_REGISTRATION_METHOD_FAILED", error, {
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
    state.postgameStatus = "SURFACE_POINTER_FINGER_HELD_CANVAS_HUB_INTAKE_NOT_FOUND";

    record("SURFACE_POINTER_HUB_INTAKE_NOT_FOUND", {
      hubSourceName: found.sourceName,
      attemptedMethods: clonePlain(HUB_INTAKE_METHODS)
    });

    buildSurfacePacket(options);
    buildPointerFingerPacket(options);
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
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,

      boundaryFile: BOUNDARY_FILE,
      massFile: MASS_FILE,
      lightFile: LIGHT_FILE,
      inspectFile: INSPECT_FILE,
      materialsFile: MATERIALS_FILE,
      compositionFile: COMPOSITION_FILE,
      airChannelFile: AIR_CHANNEL_FILE,
      cliffsFile: CLIFFS_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,

      surfaceFingerLoaded: state.surfaceFingerLoaded,
      surfaceFingerActive: state.surfaceFingerActive,
      pointerFingerActive: state.pointerFingerActive,
      externalExpressionSocketActive: state.externalExpressionSocketActive,
      singleExternalInputReceiver: state.singleExternalInputReceiver,
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
      visibleContributionAvailable: state.visibleContributionAvailable,

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

      hubDetected: state.hubDetected,
      hubSourceName: state.hubSourceName,
      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,
      hubRegistrationError: state.hubRegistrationError,

      sampleAvailable: true,
      sampleSurfaceAvailable: true,
      drawToCanvasAvailable: true,
      receiveExternalExpressionAvailable: true,
      receiveExternalDonorExpressionAvailable: true,
      receiveCanvasDonorExpressionAvailable: true,
      receiveArchiveExpressionAvailable: true,
      classifyExternalExpressionAvailable: true,
      registerExpressionReceiverAvailable: true,
      getRoutingMapAvailable: true,
      getHeldDonorQueueAvailable: true,
      getExternalIntakeReceiptAvailable: true,

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
      fingerStretchRegistry: clonePlain(FINGER_STRETCH_REGISTRY),
      routingMap: getRoutingMap(),
      externalIntakeReceipt: getExternalIntakeReceipt(),
      externalIntakeLedger: clonePlain(state.externalIntakeLedger),
      classifiedLedger: clonePlain(state.classifiedLedger),
      routedLedger: clonePlain(state.routedLedger),
      heldDonorQueue: clonePlain(state.heldDonorQueue),
      rejectedDonorQueue: clonePlain(state.rejectedDonorQueue),
      surfaceIntegratedDonors: clonePlain(state.surfaceIntegratedDonors),
      surfaceFormationFields: clonePlain(state.surfaceFormationFields),
      surfaceMaterialFamilies: clonePlain(state.surfaceMaterialFamilies),
      registeredReceiverCategories: Object.keys(state.registeredReceivers),
      hubSourceNames: clonePlain(HUB_SOURCE_NAMES),
      hubIntakeMethods: clonePlain(HUB_INTAKE_METHODS),
      boundarySourceNames: clonePlain(BOUNDARY_SOURCE_NAMES),
      massSourceNames: clonePlain(MASS_SOURCE_NAMES),
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
      "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("packet", r.packet),
      line("previousContract", r.previousContract),
      line("file", r.file),
      line("route", r.route),
      line("diagnosticRoute", r.diagnosticRoute),
      line("parentHubFile", r.parentHubFile),
      "",
      "FINGER",
      line("fingerName", r.fingerName),
      line("fingerRole", r.fingerRole),
      line("fingerOrder", r.fingerOrder),
      line("fingerStretchTotal", r.fingerStretchTotal),
      line("pointerFingerActive", r.pointerFingerActive),
      line("externalExpressionSocketActive", r.externalExpressionSocketActive),
      line("singleExternalInputReceiver", r.singleExternalInputReceiver),
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
      line("visibleContributionAvailable", r.visibleContributionAvailable),
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
      line("sampleSurfaceAvailable", r.sampleSurfaceAvailable),
      line("drawToCanvasAvailable", r.drawToCanvasAvailable),
      line("receiveExternalExpressionAvailable", r.receiveExternalExpressionAvailable),
      line("classifyExternalExpressionAvailable", r.classifyExternalExpressionAvailable),
      line("registerExpressionReceiverAvailable", r.registerExpressionReceiverAvailable),
      line("getRoutingMapAvailable", r.getRoutingMapAvailable),
      line("getHeldDonorQueueAvailable", r.getHeldDonorQueueAvailable),
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
    setDataset("hearthCanvasFingerSurfaceFile", FILE);
    setDataset("hearthCanvasFingerSurfaceActive", String(state.surfaceFingerActive));
    setDataset("hearthCanvasFingerSurfacePointerFingerActive", String(state.pointerFingerActive));
    setDataset("hearthCanvasFingerSurfaceExternalExpressionSocketActive", String(state.externalExpressionSocketActive));
    setDataset("hearthCanvasFingerSurfaceSingleExternalInputReceiver", String(state.singleExternalInputReceiver));
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
    setDataset("hearthCanvasFingerSurfaceVisibleContributionAvailable", String(state.visibleContributionAvailable));

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

    setDataset("hearthCanvasFingerSurfaceHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerSurfaceHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerSurfaceHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerSurfaceHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerSurfaceHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerSurfaceHubRegistrationHeldReason", state.hubRegistrationHeldReason);

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

    hearth.canvasFingerSurface = api;
    hearth.canvasSurfaceFinger = api;
    hearth.canvasFingerSurfacePointer = api;
    hearth.canvasPointerFinger = api;

    hearth.canvasFingerSurfaceReceipt = getReceiptLight();
    hearth.canvasFingerSurfacePacket = getSurfacePacket();
    hearth.canvasFingerSurfacePointerPacket = getPointerFingerPacket();

    root.HEARTH_CANVAS_FINGER_SURFACE = api;
    root.HEARTH_CANVAS_SURFACE_FINGER = api;
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER = api;
    root.HEARTH_CANVAS_POINTER_FINGER = api;

    root.HEARTH_CANVAS_FINGER_SURFACE_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_RECEIPT_v2 = getReceipt();

    root.HEARTH_CANVAS_FINGER_SURFACE_PACKET = getSurfacePacket();
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_PACKET = getPointerFingerPacket();

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
    publishGlobals();

    registerWithCanvasHub(options);

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("SURFACE_POINTER_FINGER_BOOT_COMPLETE", {
      boundaryDependencyObserved: state.boundaryDependencyObserved,
      massDependencyObserved: state.massDependencyObserved,
      hubDetected: state.hubDetected,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      externalExpressionSocketActive: state.externalExpressionSocketActive,
      singleExternalInputReceiver: state.singleExternalInputReceiver,
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
    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    PARENT_HUB_FILE,
    BOUNDARY_FILE,
    MASS_FILE,
    NEXT_FILE,
    LIGHT_FILE,
    INSPECT_FILE,
    MATERIALS_FILE,
    COMPOSITION_FILE,
    AIR_CHANNEL_FILE,
    CLIFFS_FILE,

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
    boundaryFile: BOUNDARY_FILE,
    massFile: MASS_FILE,
    lightFile: LIGHT_FILE,
    inspectFile: INSPECT_FILE,
    materialsFile: MATERIALS_FILE,
    compositionFile: COMPOSITION_FILE,
    airChannelFile: AIR_CHANNEL_FILE,
    cliffsFile: CLIFFS_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,
    fingerStretchRegistry: FINGER_STRETCH_REGISTRY,

    boot,
    init,
    start,
    mount,

    readBoundaryEvidence,
    readMassEvidence,
    buildSurfaceModel,
    buildSurfacePacket,
    buildPointerFingerPacket,
    getSurfacePacket,
    getPointerFingerPacket,
    registerWithCanvasHub,
    findCanvasHub,

    sample,
    sampleSurface,
    drawToCanvas,

    receiveExternalExpression,
    receiveExternalDonorExpression,
    receiveCanvasDonorExpression,
    receiveArchiveExpression,
    classifyExternalExpression,
    registerExpressionReceiver,
    getRoutingMap,
    getHeldDonorQueue,
    getRejectedDonorQueue,
    getExternalIntakeReceipt,

    getState,
    read,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    publishGlobals,

    supportsCanvasFingerSurface: true,
    supportsPointerFingerSocket: true,
    supportsExternalExpressionIntake: true,
    supportsSingleExternalInputReceiver: true,
    supportsExternalDonorRouting: true,
    supportsHeldDonorQueue: true,
    supportsRegisteredInternalReceivers: true,
    supportsFirstMaterialDifferentiation: true,
    supportsSurfaceExpressionPacket: true,
    supportsBoundaryFingerConsumption: true,
    supportsMassFingerConsumption: true,
    supportsCanvasHubRegistration: true,
    supportsVisibleSurfaceContribution: true,
    supportsReceiptText: true,
    supportsNoFinalClaims: true,

    ownsSurfaceFingerIdentity: true,
    ownsPointerFingerSocket: true,
    ownsExternalExpressionIntake: true,
    ownsExternalExpressionRouting: true,
    ownsSurfaceExpressionPacket: true,
    ownsFirstMaterialDifferentiation: true,
    ownsCanvasHub: false,
    ownsBoundaryFinger: false,
    ownsMassFinger: false,
    ownsLightFinger: false,
    ownsInspectFinger: false,
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
    recordError("SURFACE_POINTER_FINGER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
