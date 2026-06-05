// /assets/hearth/hearth.canvas.finger.surface.js
// HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4
// Full-file replacement.
// Canvas Finger 3 / Surface / Pointer Finger / non-cardinal Bishop / Internal + External Expression Socket.
// Previous:
// HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v3
// Purpose:
// - Preserve Surface as Canvas Finger 3.
// - Preserve Surface as the Pointer Finger.
// - Upgrade Surface into the non-cardinal Pointer Bishop language standard.
// - Preserve the single external donor-expression intake socket.
// - Preserve internal expression intake for Composite, World Expression, Canvas Finger, and expansion packets.
// - Accept Composite registration methods expected by /assets/hearth/hearth.canvas.finger.composite.js.
// - Receive internal finger output without classifying it as an outside donor.
// - Maintain separate ledgers for external donor traffic and internal finger/canvas traffic.
// - Preserve Boundary Finger and Mass Finger consumption.
// - Preserve first material differentiation and visible surface contribution APIs.
// - Preserve Canvas Hub registration without becoming the Canvas parent.
// - Publish both legacy finger aliases and renewed bishop aliases.
// - Hold or route only when receiving authority is unavailable.
// - Do not mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, Boundary Finger, Mass Finger,
//   Light Finger, Inspect Finger, Composite Finger, materials, composition, air channel, cliffs, or donor files.
// - Do not claim final terrain truth, hydrology truth, material truth, elevation truth, composite truth,
//   F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4";
  const RECEIPT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_RECEIPT_v4";
  const PACKET = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_PACKET_v4";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v3";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_RECEIPT_v3";
  const PREVIOUS_PACKET = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_PACKET_v3";

  const LINEAGE_V2_CONTRACT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_TNT_v2";
  const LINEAGE_V2_RECEIPT = "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_RECEIPT_v2";

  const BASELINE_CONTRACT = "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_TNT_v1";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_RECEIPT_v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";

  const MATERIALS_FILE = "/assets/hearth/hearth.materials.js";
  const COMPOSITION_FILE = "/assets/hearth/hearth.composition.js";
  const AIR_CHANNEL_FILE = "/assets/hearth/hearth.air.channel.js";
  const CLIFFS_FILE = "/assets/hearth/hearth.cliffs.js";

  const NEXT_FILE = LIGHT_FILE;

  const FINGER_NAME = "surface";
  const FINGER_ROLE = "pointer-finger-internal-external-expression-socket";
  const FINGER_ORDER = 3;
  const FINGER_STRETCH_TOTAL = 5;

  const BISHOP_NAME = "surface";
  const BISHOP_TITLE = "Surface Pointer Bishop";
  const BISHOP_ROLE = "pointer-bishop-internal-external-expression-socket";
  const BISHOP_RANK = "non-cardinal-bishop";
  const BISHOP_ORDER = 3;
  const BISHOP_ADDRESS = "surface.pointer";
  const BISHOP_DIRECTION = "POINTER";
  const BISHOP_CARDINAL_DISPOSITION = "NON_CARDINAL_POINTER";
  const BISHOP_SUBJECT_FILE = FILE;
  const BISHOP_PARENT = PARENT_HUB_FILE;
  const BISHOP_CANONICAL_STATUS = "BISHOP_LANGUAGE_ADOPTED_WITH_LEGACY_FINGER_COMPATIBILITY";

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
    compositeTruthClaimed: false,
    finalCompositeTruthClaimed: false,
    biomeTruthClaimed: false,
    settlementTruthClaimed: false,
    expressionComplete: false,
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
    COMPOSITE: "composite",
    WORLD_EXPRESSION: "world-expression",
    MATERIALS: "materials",
    COMPOSITION: "composition",
    AIR_CHANNEL: "air-channel",
    CLIFFS: "cliffs",
    HYDROLOGY_INTERFACE: "hydrology-interface",
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
      role: "pointer bishop, pointer finger, internal/external expression socket, surface-visible synthesis"
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

  const TARGET_RECEIVERS = Object.freeze({
    [CATEGORY.BOUNDARY]: Object.freeze({
      category: CATEGORY.BOUNDARY,
      file: BOUNDARY_FILE,
      authority: "boundary/silhouette/containment",
      surfaceOwnsCategory: false,
      globalPaths: BOUNDARY_SOURCE_NAMES,
      methods: Object.freeze([
        "receiveSurfacePointerBishopPacket",
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
        "receiveSurfacePointerBishopPacket",
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
        "HEARTH.canvasBishopLight",
        "HEARTH.canvasLightBishop",
        "HEARTH_CANVAS_FINGER_LIGHT",
        "HEARTH_CANVAS_LIGHT_FINGER",
        "HEARTH_CANVAS_BISHOP_LIGHT",
        "HEARTH_CANVAS_LIGHT_BISHOP",
        "DEXTER_LAB.hearthCanvasFingerLight",
        "DEXTER_LAB.hearthCanvasLightFinger",
        "DEXTER_LAB.hearthCanvasBishopLight",
        "DEXTER_LAB.hearthCanvasLightBishop"
      ]),
      methods: Object.freeze([
        "receiveSurfacePointerBishopPacket",
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
        "HEARTH.canvasBishopInspect",
        "HEARTH.canvasInspectBishop",
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH_CANVAS_INSPECT_FINGER",
        "HEARTH_CANVAS_BISHOP_INSPECT",
        "HEARTH_CANVAS_INSPECT_BISHOP",
        "DEXTER_LAB.hearthCanvasFingerInspect",
        "DEXTER_LAB.hearthCanvasInspectFinger",
        "DEXTER_LAB.hearthCanvasBishopInspect",
        "DEXTER_LAB.hearthCanvasInspectBishop"
      ]),
      methods: Object.freeze([
        "receiveSurfacePointerBishopPacket",
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
        "receiveSurfacePointerBishopPacket",
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
        "receiveSurfacePointerBishopPacket",
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
        "receiveSurfacePointerBishopPacket",
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
        "receiveSurfacePointerBishopPacket",
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
    }),
    [CATEGORY.COMPOSITE]: Object.freeze({
      category: CATEGORY.COMPOSITE,
      file: COMPOSITE_FILE,
      authority: "composite/world-expression assembly",
      surfaceOwnsCategory: false,
      internalOnly: true,
      globalPaths: Object.freeze([
        "HEARTH.canvasFingerComposite",
        "HEARTH.canvasCompositeFinger",
        "HEARTH.canvasBishopComposite",
        "HEARTH.canvasCompositeBishop",
        "HEARTH_CANVAS_FINGER_COMPOSITE",
        "HEARTH_CANVAS_COMPOSITE_FINGER",
        "HEARTH_CANVAS_BISHOP_COMPOSITE",
        "HEARTH_CANVAS_COMPOSITE_BISHOP",
        "DEXTER_LAB.hearthCanvasFingerComposite",
        "DEXTER_LAB.hearthCanvasCompositeFinger",
        "DEXTER_LAB.hearthCanvasBishopComposite",
        "DEXTER_LAB.hearthCanvasCompositeBishop"
      ]),
      methods: Object.freeze([])
    }),
    [CATEGORY.WORLD_EXPRESSION]: Object.freeze({
      category: CATEGORY.WORLD_EXPRESSION,
      file: COMPOSITE_FILE,
      authority: "assembled world expression packet",
      surfaceOwnsCategory: false,
      internalOnly: true,
      globalPaths: Object.freeze([
        "HEARTH.worldExpressionPacket",
        "HEARTH_CANVAS_WORLD_EXPRESSION_PACKET",
        "HEARTH_WORLD_EXPRESSION_PACKET",
        "DEXTER_LAB.hearthWorldExpressionPacket"
      ]),
      methods: Object.freeze([])
    })
  });

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
    [CATEGORY.SURFACE]: Object.freeze(["surface", "terrain", "land", "field", "patch", "zone", "formation", "visible surface", "skin", "planet surface", "factory surface", "pointer bishop"])
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
    lineageV2Contract: LINEAGE_V2_CONTRACT,
    lineageV2Receipt: LINEAGE_V2_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,

    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
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

    surfaceModelReady: false,
    firstSurfaceDifferentiationReady: false,
    roughTerrainTintReady: false,
    shallowMaterialVariationReady: false,
    surfacePacketReady: false,
    pointerFingerPacketReady: false,
    pointerBishopPacketReady: false,
    visibleContributionAvailable: false,

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

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
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

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "SURFACE_POINTER_BISHOP_EVENT"),
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

  function nextExternalId() {
    return `SURFACE_POINTER_BISHOP_EXTERNAL_${String(state.externalIntakeCount + 1).padStart(4, "0")}`;
  }

  function nextInternalId() {
    return `SURFACE_POINTER_BISHOP_INTERNAL_${String(state.internalIntakeCount + 1).padStart(4, "0")}`;
  }

  function getObjectText(value, limit = 8000) {
    try {
      if (typeof value === "string") return bounded(value, limit);
      return bounded(JSON.stringify(value), limit);
    } catch (_error) {
      return bounded(String(value), limit);
    }
  }

  function hasForbiddenClaim(packet) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.f13Claimed === true ||
      packet.f13EligibleForCanvas === true ||
      packet.f13ClaimedByCanvasParent === true ||
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

  function normalizeCategory(category) {
    const text = safeString(category).trim().toLowerCase();

    if (!text) return CATEGORY.UNKNOWN;
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

  function buildRouteEnvelope(normalized, classification, route) {
    return {
      packetType: "HEARTH_SURFACE_POINTER_BISHOP_ROUTED_EXPRESSION_PACKET",
      pointerContract: CONTRACT,
      pointerReceipt: RECEIPT,
      pointerFile: FILE,
      bishopName: BISHOP_NAME,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
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
      pointerBishopOwnsRouting: true,
      receivingFileOwnsCategoryAuthority: Boolean(route && route.surfaceOwnsCategory === false),
      surfaceOwnsCategoryAuthority: Boolean(route && route.surfaceOwnsCategory === true),
      pointerBishopOwnsCategoryAuthority: Boolean(route && route.surfaceOwnsCategory === true),
      ...FINAL_FALSE
    };
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
        id: safeString(entry.id || entry.name || `SURFACE_POINTER_BISHOP_DONOR_FIELD_${fields.length + 1}`),
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
        id: `SURFACE_POINTER_BISHOP_DONOR_${state.surfaceIntegratedCount + 1}`,
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
      const step = Math.max(1, Math.floor(nodes.length / 24));

      for (let index = 0; index < nodes.length && fields.length < 32; index += step) {
        const node = nodes[index];
        if (!isObject(node)) continue;

        fields.push({
          id: safeString(node.id || `SURFACE_POINTER_BISHOP_INTERNAL_COMPOSITE_FIELD_${fields.length + 1}`),
          x: clamp(node.x ?? ((safeNumber(node.col, 8) + 0.5) / 16), 0, 1),
          y: clamp(node.y ?? ((safeNumber(node.row, 8) + 0.5) / 16), 0, 1),
          scale: clamp(0.045 + safeNumber(node.visibleScore, 0.4) * 0.09, 0.035, 0.18),
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
        x: 0.5,
        y: 0.5,
        scale: 0.23,
        value: 0.58,
        donorCategory: classification.category,
        donorConfidence: classification.confidence,
        compositeClass: "composite-bridge-fallback",
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
      targetFile: route.file,
      targetAuthority: route.authority,
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

  function routeToExistingReceiver(normalized, classification) {
    const route = TARGET_RECEIVERS[classification.category];

    if (!route) return holdDonor(normalized, classification, "NO_ROUTE_FOR_CATEGORY");

    if (route.internalOnly === true) {
      return holdDonor(normalized, classification, "CATEGORY_INTERNAL_ONLY_NOT_EXTERNAL_DONOR");
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
          trimArray(state.routedLedger, 140);
          state.routedExpressionCount += 1;
          state.latestExternalPacketStatus = ROUTING_STATUS.ROUTED_TO_RECEIVER;

          record("SURFACE_POINTER_BISHOP_ROUTED_EXTERNAL_EXPRESSION", routed);
          return routed;
        }

        return holdDonor(normalized, classification, "RECEIVER_REJECTED_PACKET", {
          receiverSourceName: found.sourceName,
          receiverFile: route.file,
          method
        });
      } catch (error) {
        recordError("SURFACE_POINTER_BISHOP_RECEIVER_METHOD_FAILED", error, {
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
      result = routeToExistingReceiver(normalized, classification);
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
      classification.category === CATEGORY.HYDROLOGY_INTERFACE
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
            pointerBishopOwnsCategory: route.surfaceOwnsCategory,
            internalOnly: route.internalOnly === true,
            externalEntryPoint: FILE,
            internalEntryPoint: FILE,
            receiverRegistered: Boolean(state.registeredReceivers[category]),
            globalPaths: clonePlain(route.globalPaths || []),
            methods: clonePlain(route.methods || [])
          }
        : {
            category,
            file: "UNKNOWN",
            authority: "UNKNOWN",
            surfaceOwnsCategory: false,
            pointerBishopOwnsCategory: false,
            internalOnly: false,
            externalEntryPoint: FILE,
            internalEntryPoint: FILE,
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

  function defaultBoundaryModel() {
    return {
      modelType: "HEARTH_BASE_GLOBE_BOUNDARY_MODEL_FALLBACK_FOR_SURFACE_POINTER_BISHOP",
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
      modelType: "HEARTH_BASE_GLOBE_MASS_MODEL_FALLBACK_FOR_SURFACE_POINTER_BISHOP",
      centerX: safeNumber(b.centerX, 0.5),
      centerY: safeNumber(b.centerY, 0.5),
      radius: safeNumber(b.radius, 0.47),
      massAnchors: [
        { id: "SURFACE_POINTER_BISHOP_FALLBACK_NW", x: 0.35, y: 0.39, scale: 0.22, weight: 0.7 },
        { id: "SURFACE_POINTER_BISHOP_FALLBACK_C", x: 0.5, y: 0.52, scale: 0.25, weight: 0.8 },
        { id: "SURFACE_POINTER_BISHOP_FALLBACK_SE", x: 0.61, y: 0.64, scale: 0.2, weight: 0.62 }
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
      { id: "SURFACE_DRY_HIGH_TONE", label: "dry-rock-soil-first-pass", threshold: 0.62, tint: "rock-soil", ownsTruth: false },
      { id: "SURFACE_MID_BODY_TONE", label: "weathered-ground-first-pass", threshold: 0.38, tint: "weathered-ground", ownsTruth: false },
      { id: "SURFACE_LOW_BODY_TONE", label: "low-shadow-shelf-first-pass", threshold: 0.18, tint: "low-body-shadow", ownsTruth: false },
      { id: "SURFACE_BOUNDARY_EDGE_TONE", label: "body-edge-readability", threshold: 0.05, tint: "edge-readability", ownsTruth: false }
    ];
  }

  function baseSurfaceFields(centerX, centerY, radius) {
    return [
      { id: "SURFACE_POINTER_BISHOP_NORTHWEST_PATCH", x: centerX - radius * 0.3, y: centerY - radius * 0.18, scale: 0.17, value: 0.72 },
      { id: "SURFACE_POINTER_BISHOP_NORTH_PATCH", x: centerX + radius * 0.02, y: centerY - radius * 0.33, scale: 0.13, value: 0.48 },
      { id: "SURFACE_POINTER_BISHOP_EAST_PATCH", x: centerX + radius * 0.3, y: centerY - radius * 0.05, scale: 0.16, value: 0.66 },
      { id: "SURFACE_POINTER_BISHOP_CENTER_PATCH", x: centerX - radius * 0.02, y: centerY + radius * 0.04, scale: 0.22, value: 0.82 },
      { id: "SURFACE_POINTER_BISHOP_SOUTHWEST_PATCH", x: centerX - radius * 0.21, y: centerY + radius * 0.35, scale: 0.14, value: 0.44 },
      { id: "SURFACE_POINTER_BISHOP_SOUTHEAST_PATCH", x: centerX + radius * 0.24, y: centerY + radius * 0.28, scale: 0.15, value: 0.58 }
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
      })),
      ...state.internalSurfaceBridgeFields.map((field) => ({
        id: field.id,
        x: clamp(field.x, 0, 1),
        y: clamp(field.y, 0, 1),
        scale: clamp(field.scale, 0.02, 0.6),
        value: clamp(field.value, 0, 1),
        internalPacketId: field.internalPacketId,
        donorCategory: field.donorCategory,
        compositeClass: field.compositeClass,
        sourceName: field.sourceName,
        ownsTruth: false
      }))
    ];

    const model = {
      modelType: "HEARTH_BASE_GLOBE_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_SOCKET_MODEL",
      contract: CONTRACT,
      receipt: RECEIPT,
      centerX,
      centerY,
      radius,
      boundaryModel: clonePlain(boundaryModel),
      massModel: clonePlain(massModel),

      bishopName: BISHOP_NAME,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,

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

      surfaceMode: "POINTER_BISHOP_INTERNAL_EXTERNAL_SOCKET_WITH_FIRST_PASS_MATERIAL_DIFFERENTIATION",
      surfaceCoordinateSpace: "normalized-0-to-1",
      projection: "front-facing-base-globe",

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
      pointerBishopSocketActive: true,
      internalExpressionSocketActive: true,
      externalExpressionSocketActive: true,
      terrainTruthClaim: false,
      hydrologyTruthClaim: false,
      materialTruthClaim: false,
      elevationTruthClaim: false,
      compositeTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function sample(x, y, options = {}) {
    return {
      packetType: "HEARTH_CANVAS_SURFACE_POINTER_BISHOP_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      fingerName: FINGER_NAME,
      bishopName: BISHOP_NAME,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
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
        } else if (donorCategory === CATEGORY.COMPOSITE || donorCategory === CATEGORY.WORLD_EXPRESSION) {
          fill = "rgba(122, 138, 104, 0.20)";
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

      record("SURFACE_POINTER_BISHOP_DRAW_TO_CANVAS_COMPLETE", {
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
        bishopName: BISHOP_NAME,
        pointerFingerActive: true,
        pointerBishopActive: true,
        visibleContributionAvailable: true,
        finalVisualClaim: false,
        ...FINAL_FALSE
      };
    } catch (error) {
      try {
        context.restore();
      } catch (_restoreError) {}

      recordError("SURFACE_POINTER_BISHOP_DRAW_TO_CANVAS_FAILED", error);

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
        return { hub: candidate, sourceName };
      }
    }

    return { hub: null, sourceName: "NONE" };
  }

  function buildSurfacePacket(options = {}) {
    const model = buildSurfaceModel(options);

    const packet = {
      packetType: "HEARTH_CANVAS_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_SOCKET_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV2Contract: LINEAGE_V2_CONTRACT,
      lineageV2Receipt: LINEAGE_V2_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,

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
      drawToCanvasAvailable: true,

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

      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,

      recommendedNextFile: state.heldDonorQueue.length ? FILE : state.compositeInternalPacketCount ? INSPECT_FILE : NEXT_FILE,
      recommendedNextRenewalTarget: state.heldDonorQueue.length
        ? "RECEIVER_CATEGORY_FROM_HELD_DONOR_QUEUE"
        : state.compositeInternalPacketCount
          ? INSPECT_FILE
          : NEXT_FILE,
      firstFailedCoordinate: state.hubRegistrationAccepted
        ? state.compositeInternalPacketCount
          ? "COMPOSITE_INTERNAL_EXPRESSION_ACCEPTED_WAITING_INSPECT_OR_LIGHT"
          : "WAITING_EXTERNAL_DONOR_EXPRESSION_OR_LIGHT_BISHOP"
        : "WAITING_CANVAS_HUB_SURFACE_POINTER_BISHOP_INTAKE",
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

    if (state.hubRegistrationAccepted) {
      state.firstFailedCoordinate = packet.firstFailedCoordinate;
      state.recommendedNextFile = packet.recommendedNextFile;
      state.recommendedNextRenewalTarget = packet.recommendedNextRenewalTarget;
      state.postgameStatus = state.compositeInternalPacketCount
        ? "SURFACE_POINTER_BISHOP_ACCEPTED_COMPOSITE_INTERNAL_EXPRESSION"
        : "SURFACE_POINTER_BISHOP_SOCKET_READY";
    }

    return packet;
  }

  function buildPointerFingerPacket(options = {}) {
    const surfacePacket = buildSurfacePacket(options);

    const packet = {
      packetType: "HEARTH_CANVAS_SURFACE_POINTER_FINGER_COMPATIBILITY_PACKET",
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
      routingMap: getRoutingMap(),
      surfacePacket: clonePlain(surfacePacket),

      heldDonorQueueCount: state.heldDonorQueue.length,
      rejectedDonorQueueCount: state.rejectedDonorQueue.length,
      routedExpressionCount: state.routedExpressionCount,
      surfaceIntegratedCount: state.surfaceIntegratedCount,

      internalHeldQueueCount: state.internalHeldQueue.length,
      internalRejectedQueueCount: state.internalRejectedQueue.length,
      internalAcceptedCount: state.internalAcceptedCount,
      compositeInternalPacketCount: state.compositeInternalPacketCount,
      worldExpressionInternalPacketCount: state.worldExpressionInternalPacketCount,

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
      packetType: "HEARTH_CANVAS_SURFACE_POINTER_BISHOP_PACKET",
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
      externalExpressionSocketActive: true,
      internalExpressionSocketActive: true,
      internalBishopPacketReceiver: true,
      internalFingerPacketReceiver: true,
      compositePacketReceiver: true,
      worldExpressionPacketReceiver: true,

      surfacePacket: clonePlain(surfacePacket),
      externalIntakeReceipt: getExternalIntakeReceipt(),
      internalIntakeReceipt: getInternalIntakeReceipt(),
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

  function registerWithCanvasHub(options = {}) {
    const packet = buildSurfacePacket(options);
    const bishopPacket = buildPointerBishopPacket(options);
    const found = findCanvasHub();

    state.hubDetected = Boolean(found.hub);
    state.hubSourceName = found.sourceName;
    state.hubRegistrationAttempted = true;
    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationError = "";

    if (!found.hub || found.hub === api) {
      state.hubRegistrationHeldReason = "CANVAS_HUB_NOT_FOUND";
      state.firstFailedCoordinate = "WAITING_CANVAS_HUB";
      state.recommendedNextFile = PARENT_HUB_FILE;
      state.recommendedNextRenewalTarget = PARENT_HUB_FILE;
      state.postgameStatus = "SURFACE_POINTER_BISHOP_HELD_CANVAS_HUB_NOT_FOUND";

      record("SURFACE_POINTER_BISHOP_HUB_NOT_FOUND", {
        attemptedSources: clonePlain(HUB_SOURCE_NAMES)
      });

      return false;
    }

    for (const method of HUB_INTAKE_METHODS) {
      if (!isFunction(found.hub[method])) continue;

      try {
        const payload = method.toLowerCase().includes("bishop") ? bishopPacket : packet;
        const response = found.hub[method](clonePlain(payload));

        state.hubRegistrationAccepted = response !== false;
        state.hubRegistrationMethod = method;
        state.hubRegistrationHeldReason = state.hubRegistrationAccepted ? "NONE" : "CANVAS_HUB_REJECTED_SURFACE_POINTER_BISHOP_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        if (state.hubRegistrationAccepted) {
          state.firstFailedCoordinate = state.compositeInternalPacketCount
            ? "COMPOSITE_INTERNAL_EXPRESSION_ACCEPTED_WAITING_INSPECT_OR_LIGHT"
            : "WAITING_EXTERNAL_DONOR_EXPRESSION_OR_LIGHT_BISHOP";
          state.recommendedNextFile = state.compositeInternalPacketCount ? INSPECT_FILE : NEXT_FILE;
          state.recommendedNextRenewalTarget = state.recommendedNextFile;
          state.postgameStatus = state.compositeInternalPacketCount
            ? "SURFACE_POINTER_BISHOP_ACCEPTED_BY_CANVAS_HUB_COMPOSITE_SOCKET_READY"
            : "SURFACE_POINTER_BISHOP_ACCEPTED_BY_CANVAS_HUB_SOCKET_READY";
        } else {
          state.firstFailedCoordinate = "CANVAS_HUB_REJECTED_SURFACE_POINTER_BISHOP_PACKET";
          state.recommendedNextFile = PARENT_HUB_FILE;
          state.recommendedNextRenewalTarget = PARENT_HUB_FILE;
          state.postgameStatus = "SURFACE_POINTER_BISHOP_HELD_CANVAS_HUB_REJECTED_PACKET";
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
    state.recommendedNextFile = PARENT_HUB_FILE;
    state.recommendedNextRenewalTarget = PARENT_HUB_FILE;
    state.postgameStatus = "SURFACE_POINTER_BISHOP_HELD_CANVAS_HUB_INTAKE_NOT_FOUND";

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
      lineageV2Contract: LINEAGE_V2_CONTRACT,
      lineageV2Receipt: LINEAGE_V2_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,

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

      sampleAvailable: true,
      sampleSurfaceAvailable: true,
      drawToCanvasAvailable: true,

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

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("packet", r.packet),
      line("previousContract", r.previousContract),
      line("previousReceipt", r.previousReceipt),
      line("lineageV2Contract", r.lineageV2Contract),
      line("baselineContract", r.baselineContract),
      line("file", r.file),
      line("route", r.route),
      line("diagnosticRoute", r.diagnosticRoute),
      line("parentHubFile", r.parentHubFile),
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

    hearth.canvasFingerSurfaceReceipt = getReceiptLight();
    hearth.canvasSurfaceBishopReceipt = getReceiptLight();
    hearth.canvasPointerBishopReceipt = getReceiptLight();
    hearth.canvasFingerSurfacePacket = getSurfacePacket();
    hearth.canvasFingerSurfacePointerPacket = getPointerFingerPacket();
    hearth.canvasPointerBishopPacket = getPointerBishopPacket();
    hearth.canvasFingerSurfaceInternalIntakeReceipt = getInternalIntakeReceipt();
    hearth.canvasFingerSurfaceExternalIntakeReceipt = getExternalIntakeReceipt();

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

    lab.hearthCanvasFingerSurfaceReceipt = getReceiptLight();
    lab.hearthCanvasSurfaceBishopReceipt = getReceiptLight();
    lab.hearthCanvasPointerBishopReceipt = getReceiptLight();
    lab.hearthCanvasFingerSurfacePacket = getSurfacePacket();
    lab.hearthCanvasFingerSurfacePointerPacket = getPointerFingerPacket();
    lab.hearthCanvasPointerBishopPacket = getPointerBishopPacket();
    lab.hearthCanvasFingerSurfaceInternalIntakeReceipt = getInternalIntakeReceipt();
    lab.hearthCanvasFingerSurfaceExternalIntakeReceipt = getExternalIntakeReceipt();

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

    root.HEARTH_CANVAS_FINGER_SURFACE_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_BISHOP_SURFACE_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_POINTER_BISHOP_RECEIPT = getReceiptLight();

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

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_SOCKET_BOOT_COMPLETE", {
      boundaryDependencyObserved: state.boundaryDependencyObserved,
      massDependencyObserved: state.massDependencyObserved,
      hubDetected: state.hubDetected,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      externalExpressionSocketActive: state.externalExpressionSocketActive,
      internalExpressionSocketActive: state.internalExpressionSocketActive,
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
    LINEAGE_V2_CONTRACT,
    LINEAGE_V2_RECEIPT,
    BASELINE_CONTRACT,
    BASELINE_RECEIPT,
    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    PARENT_HUB_FILE,
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
    lineageV2Contract: LINEAGE_V2_CONTRACT,
    lineageV2Receipt: LINEAGE_V2_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
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
    findCanvasHub,

    sample,
    sampleSurface,
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
    ownsCanvasHub: false,
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
    recordError("SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_SOCKET_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
