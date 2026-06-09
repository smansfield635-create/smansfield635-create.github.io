// /assets/lab/runtime-table.js
// LAB_RUNTIME_TABLE_COUNTY_ENGINE_MECHANICS_3D_LATTICE_256_STATE_SUPPORT_ENGINE_TNT_v4
// Full-file replacement.
// Runtime Table / North county engine / 3D mechanical coordinate lattice / 256 state integration.
// Purpose:
// - Preserve the existing Runtime Table public API surface.
// - Keep North as the county runtime engine center, timing governor, and F21 latch authority.
// - Bind the 19 engine parts x 19 runtime categories x 11 Fibonacci stations as the 3D runtime logic lattice.
// - Bind the 256 state lattice, 61 filters, 192 pressure shell, 9 basin anchors, and 451 total envelope.
// - Treat aliases, court labels, chess labels, chapel labels, and clerk labels as architecture/navigation only.
// - Treat engine parts and math as the executable runtime logic.
// - Anchor support engines: F34 virtual Product Engine slot, F55 Expression, F89 Registry, F144 Market, F233 return.
// - Preserve non-rendering, non-WebGL, non-GraphicBox, non-public-superiority behavior.
// Does not own:
// - Canvas rendering
// - controls
// - route orchestration
// - planet truth
// - material/elevation/hydrology truth
// - support engine internals
// - generated image
// - GraphicBox
// - WebGL
// - final visual pass claim
// - public superiority claim

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_COUNTY_ENGINE_MECHANICS_3D_LATTICE_256_STATE_SUPPORT_ENGINE_TNT_v4";
  const RECEIPT = "LAB_RUNTIME_TABLE_COUNTY_ENGINE_MECHANICS_3D_LATTICE_256_STATE_SUPPORT_ENGINE_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION_PRODUCT_ENGINE_CONDUCTOR_TNT_v3";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD_TNT_v1";
  const VERSION = "2026-06-08.lab-runtime-table-county-engine-mechanics-3d-lattice-256-state-support-engine-v4";

  const FILE = "/assets/lab/runtime-table.js";
  const EAST_FILE = "/assets/lab/runtime-table.east.js";
  const SOUTH_FILE = "/assets/lab/runtime-table.south.js";
  const WEST_FILE = "/assets/lab/runtime-table.west.js";

  const F34_PRODUCT_ENGINE_FILE = "/assets/lab/product-engine.js";
  const F55_EXPRESSION_FILE = "/assets/lab/product-engine.ue5-expression.js";
  const F89_REGISTRY_FILE = "/assets/lab/product-engine.registry.js";
  const F144_MARKET_FILE = "/assets/lab/product-engine.market.js";

  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEARTH_ROUTE_FILE = "/showroom/globe/hearth/hearth.js";
  const HEARTH_INDEX_FILE = "/showroom/globe/hearth/index.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const STATUS = Object.freeze({
    HELD: "HELD",
    ACTIVE: "ACTIVE",
    READY: "READY",
    DEGRADED: "DEGRADED",
    BLOCKED: "BLOCKED",
    COMPLETE: "COMPLETE",
    UNKNOWN: "UNKNOWN"
  });

  const ENGINE_PARTS = Object.freeze([
    { index: 1, id: "CHASSIS", function: "whole runtime frame" },
    { index: 2, id: "CYLINDER", function: "bounded execution chamber" },
    { index: 3, id: "PISTON", function: "active motion inside a chamber" },
    { index: 4, id: "VALVE", function: "admission and release control" },
    { index: 5, id: "IGNITION", function: "lawful start signal" },
    { index: 6, id: "COMPRESSION", function: "pressure-building admissibility phase" },
    { index: 7, id: "EXHAUST", function: "proof and output return" },
    { index: 8, id: "CRANKSHAFT", function: "cycle-motion conversion" },
    { index: 9, id: "CAMSHAFT", function: "timing controller" },
    { index: 10, id: "GEARBOX", function: "mode and packet translation" },
    { index: 11, id: "CLUTCH", function: "engagement and disengagement control" },
    { index: 12, id: "BRAKE", function: "lawful hold and stop" },
    { index: 13, id: "GOVERNOR", function: "speed and authority regulator" },
    { index: 14, id: "MANIFOLD", function: "collection and routing distributor" },
    { index: 15, id: "FUEL_LINE", function: "evidence and packet supply" },
    { index: 16, id: "RADIATOR", function: "heat and pressure dissipation" },
    { index: 17, id: "FLYWHEEL", function: "continuity and stability" },
    { index: 18, id: "AXLE", function: "authorized transfer to movement surface" },
    { index: 19, id: "SPOKES", function: "distributed structural supports" }
  ]);

  const RUNTIME_SYSTEM_CATEGORIES = Object.freeze(
    Array.from({ length: 19 }, (_, index) => {
      const n = index + 1;
      const names = [
        "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
        "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN",
        "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"
      ];
      return {
        index: n,
        id: `${names[index]}_PART_SYSTEM`,
        activePartCount: n
      };
    })
  );

  const FIBONACCI_STATIONS = Object.freeze([
    { index: 1, stage: "F1", rank: 1, id: "NORTH_ORIGIN_IGNITION", gate: "NORTH", role: "North origin / ignition" },
    { index: 2, stage: "F3", rank: 3, id: "EAST_INTAKE", gate: "EAST", role: "East intake" },
    { index: 3, stage: "F5", rank: 5, id: "WEST_PRESSURE_ADMISSIBILITY", gate: "WEST", role: "West pressure / admissibility" },
    { index: 4, stage: "F8", rank: 8, id: "SOUTH_PROOF_EXHAUST_RETURN", gate: "SOUTH", role: "South proof / exhaust return" },
    { index: 5, stage: "F13", rank: 13, id: "CANVAS_EVIDENCE_RELEASE_CHAMBER", gate: "CANVAS", role: "Canvas evidence / release chamber" },
    { index: 6, stage: "F21", rank: 21, id: "NORTH_COMPLETION_LATCH", gate: "NORTH", role: "North completion latch" },
    { index: 7, stage: "F34", rank: 34, id: "PRODUCT_ENGINE_SLOT", gate: "PRODUCT_ENGINE", role: "Product Engine slot" },
    { index: 8, stage: "F55", rank: 55, id: "EXPRESSION_CLERK", gate: "UE5_EXPRESSION", role: "Expression clerk" },
    { index: 9, stage: "F89", rank: 89, id: "REGISTRY_CLERK", gate: "PROJECT_REGISTRY", role: "Registry clerk" },
    { index: 10, stage: "F144", rank: 144, id: "MARKET_CLERK", gate: "MARKET_READINESS", role: "Market clerk" },
    { index: 11, stage: "F233", rank: 233, id: "DOWNSTREAM_RETURN", gate: "DOWNSTREAM_RETURN", role: "Downstream return" }
  ]);

  const FIBONACCI = Object.freeze({
    NORTH_ORIGIN: "F1",
    EAST_FORMATION: "F3",
    WEST_AUDIT: "F5",
    SOUTH_RETURN: "F8",
    CANVAS_EVIDENCE: "F13",
    NORTH_LATCH: "F21",
    PRODUCT_ENGINE: "F34",
    UE5_EXPRESSION: "F55",
    PROJECT_REGISTRY: "F89",
    MARKET_READINESS: "F144",
    DOWNSTREAM_RETURN: "F233"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    WEST: "WEST",
    SOUTH: "SOUTH",
    CANVAS: "CANVAS",
    PRODUCT: "PRODUCT_ENGINE",
    EXPRESSION: "UE5_EXPRESSION",
    REGISTRY: "PROJECT_REGISTRY",
    MARKET: "MARKET_READINESS",
    DOWNSTREAM: "DOWNSTREAM_RETURN"
  });

  const SUPPORT_ENGINE_STAGES = Object.freeze({
    F34_PRODUCT_ENGINE_SLOT: "F34_PRODUCT_ENGINE_SLOT",
    F55_EXPRESSION_ENGINE: "F55_EXPRESSION_ENGINE",
    F89_REGISTRY_ENGINE: "F89_REGISTRY_ENGINE",
    F144_MARKET_ENGINE: "F144_MARKET_ENGINE",
    F233_DOWNSTREAM_RETURN: "F233_DOWNSTREAM_RETURN"
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,

    countyRuntimeEngineCenter: true,
    northTimingGovernor: true,
    shellStandardActive: true,
    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,

    threeDMechanicalLatticeBound: true,
    stateLattice256Bound: true,
    filterPassage61Bound: true,
    pressureShell192Bound: true,
    basinAnchor9Bound: true,
    geometryEnvelope451Bound: true,

    totalMechanicalCoordinates: 19 * 19 * 11,
    totalCoordinateStateCapacity: 19 * 19 * 11 * 256,

    activeStage: FIBONACCI.NORTH_ORIGIN,
    activeFibonacciRank: 1,
    activeNewsGate: NEWS_GATES.NORTH,
    activeProgress: 0,
    oneActiveGearAtATime: true,

    cycleOneLaw: ["NORTH", "EAST", "WEST", "SOUTH", "NORTH"],
    cycleTwoLaw: ["NORTH", "EAST", "SOUTH", "WEST", "CANVAS"],
    cycleOneStatus: STATUS.HELD,
    cycleTwoStatus: STATUS.HELD,
    cycleTwoAuthorized: false,

    canvasF13ReleaseAuthorized: false,
    canvasF13EvidenceAccepted: false,
    canvasF13EvidencePacket: null,

    f21EligibilityAccepted: false,
    f21Latched: false,
    f21LatchPacket: null,

    supportEngineAnchors: {},
    supportEnginePackets: [],
    supportEngineStatus: STATUS.HELD,

    stationArtifacts: {},
    productEngineArtifacts: {},

    primaryGateRegistry: {},
    observedAuthorities: {},
    authorityCacheValid: false,
    authorityCacheUpdatedAt: "",

    checkpointSessions: {},
    hearthTransmissionSession: null,

    localEvents: [],
    errors: [],

    lightPublishQueued: false,
    broadDatasetWritesDeferred: true,

    publicSuperiorityClaimed: false,
    benchmarkRequiredBeforePublicClaim: true,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    createdAt: "",
    updatedAt: ""
  };

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
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true") return true;
    if (value === false || value === 0 || value === "0" || value === "false") return false;
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

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function makeId(value, fallback = "item") {
    const raw = safeString(value || fallback, fallback)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return raw || fallback;
  }

  function trim(list, max = 240) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function readPath(path) {
    const parts = String(path || "").split(".");
    let cursor = root;
    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }
    return cursor || null;
  }

  function setPath(path, value) {
    const parts = String(path || "").split(".").filter(Boolean);
    if (!parts.length) return false;

    let cursor = root;
    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(names) {
    for (const name of names || []) {
      const found = readPath(name);
      if (found) return found;
    }
    return null;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return {};
    try {
      if (isFunction(authority.getReceiptLight)) {
        const receipt = authority.getReceiptLight();
        if (isObject(receipt)) return receipt;
      }
      if (isFunction(authority.getReceipt)) {
        const receipt = authority.getReceipt();
        if (isObject(receipt)) return receipt;
      }
    } catch (error) {
      return { error: error && error.message ? error.message : String(error) };
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version) return authority;

    return {};
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "LOCAL_EVENT"),
      detail: clonePlain(detail)
    };
    state.localEvents.push(item);
    trim(state.localEvents);
    state.updatedAt = item.at;
    updateDatasetLight();
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "RUNTIME_TABLE_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };
    state.errors.push(item);
    trim(state.errors);
    state.updatedAt = item.at;
    updateDatasetLight();
    return item;
  }

  function partById(partId) {
    const id = safeString(partId).toUpperCase();
    return ENGINE_PARTS.find((part) => part.id === id) || null;
  }

  function partByIndex(index) {
    return ENGINE_PARTS.find((part) => part.index === safeNumber(index, -1)) || null;
  }

  function categoryById(categoryId) {
    const id = safeString(categoryId).toUpperCase();
    return RUNTIME_SYSTEM_CATEGORIES.find((category) => category.id === id) || null;
  }

  function categoryByIndex(index) {
    return RUNTIME_SYSTEM_CATEGORIES.find((category) => category.index === safeNumber(index, -1)) || null;
  }

  function stationByStage(stage) {
    const value = safeString(stage).toUpperCase();
    return FIBONACCI_STATIONS.find((station) => station.stage === value || String(station.rank) === value || station.id === value) || null;
  }

  function coordinateId(partIndex, categoryIndex, stationRank) {
    return `RT3D-X${pad2(partIndex)}_Y${pad2(categoryIndex)}_Z${stationRank}`;
  }

  function createMechanicalCoordinate(partInput, categoryInput, stationInput, extra = {}) {
    const part =
      typeof partInput === "number" ? partByIndex(partInput) : partById(partInput);
    const category =
      typeof categoryInput === "number" ? categoryByIndex(categoryInput) : categoryById(categoryInput);
    const station = stationByStage(stationInput);

    if (!part || !category || !station) {
      return {
        coordinateId: "",
        valid: false,
        reason: "INVALID_MECHANICAL_COORDINATE_INPUT",
        input: clonePlain({ partInput, categoryInput, stationInput })
      };
    }

    return {
      coordinateId: coordinateId(part.index, category.index, station.rank),
      valid: true,
      enginePart: part.id,
      enginePartIndex: part.index,
      enginePartFunction: part.function,
      systemCategory: category.id,
      systemCategoryIndex: category.index,
      activePartCount: category.activePartCount,
      fibonacciStage: station.stage,
      fibonacciRank: station.rank,
      fibonacciStation: station.id,
      fibonacciStationIndex: station.index,
      newsGate: station.gate,
      stationRole: station.role,
      ...clonePlain(extra)
    };
  }

  function parseCoordinateId(id) {
    const text = safeString(id);
    const match = text.match(/^RT3D-X(\d{2})_Y(\d{2})_Z(\d+)$/i);
    if (!match) {
      return {
        valid: false,
        coordinateId: text,
        reason: "UNPARSEABLE_COORDINATE_ID"
      };
    }

    return createMechanicalCoordinate(Number(match[1]), Number(match[2]), `F${Number(match[3])}`);
  }

  function getEnginePartAxis() {
    return clonePlain(ENGINE_PARTS);
  }

  function getRuntimeSystemCategoryAxis() {
    return clonePlain(RUNTIME_SYSTEM_CATEGORIES);
  }

  function getFibonacciStationAxis() {
    return clonePlain(FIBONACCI_STATIONS);
  }

  function getMechanicalCoordinateLattice(options = {}) {
    const materialize = safeBool(options.materialize, false);
    const lattice = {
      contract: CONTRACT,
      receipt: RECEIPT,
      latticeType: "MECHANICAL_COORDINATE_LATTICE_19x19x11",
      xAxis: getEnginePartAxis(),
      yAxis: getRuntimeSystemCategoryAxis(),
      zAxis: getFibonacciStationAxis(),
      totalCoordinates: 19 * 19 * 11,
      materialized: materialize,
      cells: []
    };

    if (materialize) {
      ENGINE_PARTS.forEach((part) => {
        RUNTIME_SYSTEM_CATEGORIES.forEach((category) => {
          FIBONACCI_STATIONS.forEach((station) => {
            lattice.cells.push(createMechanicalCoordinate(part.id, category.id, station.stage));
          });
        });
      });
    }

    return lattice;
  }

  function getStateLattice256() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      latticeType: "STATE_LATTICE_256",
      stateCount: 256,
      states: Array.from({ length: 256 }, (_, index) => ({
        stateId: `ST_${index}`,
        stateIndex: index,
        binary: index.toString(2).padStart(8, "0"),
        field: "STATE_MOTION_CONSTRAINT_POSSIBILITY"
      })),
      replacesMechanicalCoordinate: false
    };
  }

  function getFilterPassageMap61() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      mapType: "FILTER_PASSAGE_MAP_61",
      filterCount: 61,
      filters: Array.from({ length: 61 }, (_, index) => ({
        filterId: `FL_${index + 1}`,
        filterIndex: index + 1,
        passageRole: "admissibility passage",
        defaultPass: true
      }))
    };
  }

  function getPressureShellMap192() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      mapType: "PRESSURE_SHELL_MAP_192",
      shellCount: 192,
      shells: Array.from({ length: 192 }, (_, index) => ({
        shellId: `PS_${index + 1}`,
        shellIndex: index + 1,
        pressureRole: "runtime pressure / motion shell",
        defaultWithinShell: true
      }))
    };
  }

  function getBasinAnchorMap9() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      mapType: "BASIN_ANCHOR_MAP_9",
      basinCount: 9,
      basins: Array.from({ length: 9 }, (_, index) => ({
        basinId: `BA_${index + 1}`,
        basinIndex: index + 1,
        anchorRole: "runtime containment anchor",
        defaultAnchored: true
      }))
    };
  }

  function getGeometryEnvelope451() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      mapType: "GEOMETRY_ENVELOPE_451",
      totalGeometry: 451,
      stateLattice: 256,
      pressureShell: 192,
      basinAnchors: 9,
      filterPassage: 61,
      note: "451 is the whole containing geometry envelope. It does not replace the 256 state lattice or 3D mechanical lattice."
    };
  }

  function getEngineMechanicsComponentMap() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      engineMechanicsPrimary: true,
      numbersSupportEngineFunction: true,
      enginePartDefinesFunction: true,
      parts: getEnginePartAxis(),
      runtimeCategories: getRuntimeSystemCategoryAxis(),
      fibonacciStations: getFibonacciStationAxis()
    };
  }

  function getEngineMechanicsContract() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,
      aliasesLocateOnly: true,
      namesDescribeOnly: true,
      enginePartsExecute: true,
      numbersSupportFunction: true,
      publicSuperiorityClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getFibonacciSynchronizationMap() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      fibonacciStations: getFibonacciStationAxis(),
      sequence: FIBONACCI_STATIONS.map((station) => ({
        stage: station.stage,
        rank: station.rank,
        station: station.id,
        gate: station.gate,
        role: station.role
      })),
      activeStage: state.activeStage,
      activeFibonacciRank: state.activeFibonacciRank,
      activeNewsGate: state.activeNewsGate
    };
  }

  function getLabSupremeJudgeRegistry() {
    return {
      north: {
        file: FILE,
        fibonacci: ["F1", "F21", "F233"],
        engineParts: ["CHASSIS", "CAMSHAFT", "GOVERNOR", "MANIFOLD", "RADIATOR", "FLYWHEEL"],
        role: "NORTH_SUPREME_JUDGE",
        authorityLimit: "may synchronize, admit, latch, receive support-engine packets, publish runtime receipts; may not render or claim visual pass"
      },
      east: {
        file: EAST_FILE,
        fibonacci: "F3",
        enginePart: "VALVE",
        role: "EAST_SUPREME_JUDGE",
        sourceAudited: false,
        authorityLimit: "may intake/admit; may not latch F21"
      },
      west: {
        file: WEST_FILE,
        fibonacci: "F5",
        enginePart: "COMPRESSION",
        role: "WEST_SUPREME_JUDGE",
        sourceAudited: false,
        authorityLimit: "may audit pressure/admissibility; may not render"
      },
      south: {
        file: SOUTH_FILE,
        fibonacci: "F8",
        enginePart: "EXHAUST",
        role: "SOUTH_SUPREME_JUDGE",
        sourceAudited: false,
        authorityLimit: "may return proof/output; may not overrule North"
      }
    };
  }

  function getRegistryJudgeRegistry() {
    return {
      productRecordJudge: {
        fibonacci: "F34",
        evaluates: "product-engine authority evidence",
        overrulesSupremeJudges: false
      },
      expressionRecordJudge: {
        fibonacci: "F55",
        evaluates: "scene-graph / expression-node evidence",
        overrulesSupremeJudges: false
      },
      projectRegistryRecordJudge: {
        fibonacci: "F89",
        evaluates: "engine, file, route, product, receipt, evidence registry records",
        overrulesSupremeJudges: false
      },
      marketReadinessRecordJudge: {
        fibonacci: "F144/F233",
        evaluates: "market, demo, license, documentation, risk, distribution, implementation readiness",
        overrulesSupremeJudges: false
      }
    };
  }

  function getEngineClerkMap() {
    return {
      productEngineClerk: {
        file: F34_PRODUCT_ENGINE_FILE,
        status: "UNWRITTEN_BUT_INTEGRATED",
        fibonacci: "F34",
        enginePart: "GEARBOX",
        role: "PRODUCT_ENGINE_CLERK",
        mayJudge: false,
        hardFailureWhenAbsent: false
      },
      expressionClerk: {
        file: F55_EXPRESSION_FILE,
        status: "REAL_SUPPORT_ENGINE",
        fibonacci: "F55",
        enginePart: "GEARBOX",
        role: "EXPRESSION_CLERK",
        mayJudge: false
      },
      registryClerk: {
        file: F89_REGISTRY_FILE,
        status: "REAL_SUPPORT_ENGINE",
        fibonacci: "F89",
        enginePart: "MANIFOLD",
        role: "REGISTRY_CLERK",
        mayJudge: false
      },
      marketClerk: {
        file: F144_MARKET_FILE,
        status: "REAL_SUPPORT_ENGINE",
        fibonacci: "F144/F233",
        enginePart: "GEARBOX",
        role: "MARKET_CLERK",
        mayJudge: false
      }
    };
  }

  function getChessOrchestrationMap() {
    return {
      king: {
        role: "route sovereignty / route conductor",
        likelyFiles: [HEARTH_ROUTE_FILE, HEARTH_INDEX_FILE],
        mayRender: false
      },
      queen: {
        role: "visible expression carrier",
        likelyFiles: [CANVAS_FILE, "/assets/hearth/hearth.canvas.launch.js"],
        mayJudge: false
      },
      rook: {
        role: "rail, registry, boundary, structural stabilization",
        examples: [F89_REGISTRY_FILE]
      },
      bishop: {
        role: "diagonal interpreter / cross-lane translator",
        examples: [F55_EXPRESSION_FILE, "chapel bishops"]
      },
      knight: {
        role: "nonlinear bridge / plane jump / readiness conversion",
        examples: [F144_MARKET_FILE]
      },
      pawn: {
        role: "local tactical worker",
        examples: ["chapel fingers except pointer-finger priest distinction"]
      },
      priest: {
        role: "pointer finger / inspect-orientation attendant",
        examples: ["inspect files attached to chapels"]
      }
    };
  }

  function getChapelOrchestrationMap() {
    return {
      chapelRule: {
        everyChapelHasBishop: true,
        everyChapelHasPriestPointerFinger: true,
        everyChapelHasAtLeastFourFingers: true,
        everyOrdinaryFingerIsPawn: true,
        chapelMayOverruleSupremeJudges: false
      },
      chapel1: {
        name: "CANVAS_CHAPEL",
        connectedFile: CANVAS_FILE,
        coordinate: "RT3D-X18_Y19_Z13",
        enginePart: "AXLE",
        role: "VISIBLE_EXPRESSION_TRANSFER_AXIS",
        minimumFingers: 4,
        priest: "pointer finger / inspect file",
        sourceAliasStatus: "PENDING"
      },
      chapel2: {
        name: "FINGER_SURFACE_CHAPEL",
        connectedFile: "finger surface file",
        coordinate: "RT3D-X19_Y19_Z13",
        enginePart: "SPOKES",
        role: "SURFACE_FINGER_DISTRIBUTION_SPOKES",
        minimumFingers: "MORE_THAN_5",
        priest: "pointer finger / inspect file",
        exactPathStatus: "PENDING"
      }
    };
  }

  function getPriestPointerFingerMap() {
    return {
      priestEqualsPointerFinger: true,
      role: "inspect-orientation finger",
      function: "point, inspect, indicate, prepare evidence, identify chapel condition",
      mayJudge: false,
      mayRelease: false,
      mayLatch: false,
      mayOverrule: false
    };
  }

  function getFingerPawnMap() {
    return {
      allFingersArePawns: true,
      pointerFingerException: "priest / inspect-orientation finger",
      ordinaryPawnAuthority: "local tactical work / local proof / surface contribution",
      pawnMayDeclareCompletion: false
    };
  }

  function getFileCoordinateMap() {
    return {
      [FILE]: {
        status: "RENEWAL_TARGET",
        primaryCoordinates: [
          createMechanicalCoordinate("CHASSIS", "NINETEEN_PART_SYSTEM", "F1", {
            mechanicalRole: "COUNTY_RUNTIME_ENGINE_BODY"
          }),
          createMechanicalCoordinate("CAMSHAFT", "NINETEEN_PART_SYSTEM", "F21", {
            mechanicalRole: "FIBONACCI_TIMING_CONTROLLER"
          }),
          createMechanicalCoordinate("GOVERNOR", "NINETEEN_PART_SYSTEM", "F21", {
            mechanicalRole: "NORTH_TIMING_GOVERNOR_AND_COMPLETION_LATCH"
          }),
          createMechanicalCoordinate("MANIFOLD", "NINETEEN_PART_SYSTEM", "F233", {
            mechanicalRole: "F233_RETURN_INTAKE_AND_ALIAS_DISTRIBUTION"
          }),
          createMechanicalCoordinate("RADIATOR", "NINETEEN_PART_SYSTEM", "F1", {
            mechanicalRole: "NON_BLOCKING_SCHEDULER_AND_PRESSURE_DISSIPATION"
          }),
          createMechanicalCoordinate("FLYWHEEL", "NINETEEN_PART_SYSTEM", "F21", {
            mechanicalRole: "RUNTIME_CONTINUITY_STABILIZER"
          })
        ],
        architectureLabels: ["North Supreme Judge", "Board Arbiter", "County Runtime Court"],
        aliases: [
          "LAB_RUNTIME_TABLE",
          "RUNTIME_TABLE",
          "LAB_RUNTIME_TABLE_NORTH",
          "DEXTER_LAB.runtimeTable",
          "HEARTH.northCommandRuntimeTable"
        ],
        sourceAudited: true
      },
      [EAST_FILE]: {
        status: "PENDING_SOURCE_AUDIT",
        primaryCoordinate: createMechanicalCoordinate("VALVE", "NINETEEN_PART_SYSTEM", "F3", {
          mechanicalRole: "EAST_INTAKE_CHANNEL"
        }),
        architectureLabels: ["East Supreme Judge", "Admission Branch"],
        aliases: ["LAB_RUNTIME_TABLE_EAST", "DEXTER_LAB.runtimeTableEast", "HEARTH.runtimeTableEast"],
        sourceAudited: false
      },
      [WEST_FILE]: {
        status: "PENDING_SOURCE_AUDIT",
        primaryCoordinate: createMechanicalCoordinate("COMPRESSION", "NINETEEN_PART_SYSTEM", "F5", {
          mechanicalRole: "WEST_PRESSURE_VALVE_AND_ADMISSIBILITY_CHECK"
        }),
        architectureLabels: ["West Supreme Judge", "Admissibility Court"],
        aliases: ["LAB_RUNTIME_TABLE_WEST", "DEXTER_LAB.runtimeTableWest", "HEARTH.runtimeTableWest"],
        sourceAudited: false
      },
      [SOUTH_FILE]: {
        status: "PENDING_SOURCE_AUDIT",
        primaryCoordinate: createMechanicalCoordinate("EXHAUST", "NINETEEN_PART_SYSTEM", "F8", {
          mechanicalRole: "SOUTH_OUTPUT_EXHAUST_AND_PROOF_RETURN"
        }),
        architectureLabels: ["South Supreme Judge", "Proof Return Court"],
        aliases: ["LAB_RUNTIME_TABLE_SOUTH", "DEXTER_LAB.runtimeTableSouth", "HEARTH.runtimeTableSouth"],
        sourceAudited: false
      },
      [F34_PRODUCT_ENGINE_FILE]: {
        status: "UNWRITTEN_BUT_INTEGRATED",
        primaryCoordinate: createMechanicalCoordinate("GEARBOX", "NINETEEN_PART_SYSTEM", "F34", {
          mechanicalRole: "PRODUCT_ENGINE_AUTHORITY_SLOT"
        }),
        architectureLabels: ["Product Engine Clerk", "Future Product Record Source"],
        aliases: ["LAB_PRODUCT_ENGINE", "LAB_PRODUCT_ENGINE_F34", "PRODUCT_ENGINE", "DEXTER_LAB.productEngine", "HEARTH.productEngine"],
        hardFailureWhenAbsent: false
      },
      [F55_EXPRESSION_FILE]: {
        status: "REAL_SUPPORT_ENGINE",
        primaryCoordinate: createMechanicalCoordinate("GEARBOX", "NINETEEN_PART_SYSTEM", "F55", {
          mechanicalRole: "EXPRESSION_SCENE_GRAPH_MANIFOLD"
        }),
        architectureLabels: ["Expression Clerk", "Bishop-Style Translator", "Expression Record Source"],
        aliases: [
          "LAB_PRODUCT_ENGINE_UE5_EXPRESSION",
          "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55",
          "PRODUCT_ENGINE_UE5_EXPRESSION",
          "UE5_EXPRESSION_CONDUCTOR",
          "DEXTER_LAB.productEngineUE5Expression",
          "HEARTH.productEngineUE5Expression"
        ]
      },
      [F89_REGISTRY_FILE]: {
        status: "REAL_SUPPORT_ENGINE",
        primaryCoordinate: createMechanicalCoordinate("MANIFOLD", "NINETEEN_PART_SYSTEM", "F89", {
          mechanicalRole: "PROJECT_REGISTRY_CONDUCTOR"
        }),
        architectureLabels: ["Registry Clerk", "Rook", "Project Record Source"],
        aliases: [
          "LAB_PRODUCT_ENGINE_REGISTRY",
          "LAB_PRODUCT_ENGINE_REGISTRY_F89",
          "PRODUCT_ENGINE_REGISTRY",
          "PROJECT_REGISTRY_CONDUCTOR",
          "DEXTER_LAB.productEngineRegistry",
          "HEARTH.productEngineRegistry"
        ]
      },
      [F144_MARKET_FILE]: {
        status: "REAL_SUPPORT_ENGINE",
        primaryCoordinate: createMechanicalCoordinate("GEARBOX", "NINETEEN_PART_SYSTEM", "F144", {
          mechanicalRole: "MARKET_READINESS_OUTPUT_MANIFOLD"
        }),
        architectureLabels: ["Market Clerk", "Knight", "Market Readiness Record Source"],
        aliases: [
          "LAB_PRODUCT_ENGINE_MARKET",
          "LAB_PRODUCT_ENGINE_MARKET_F144",
          "PRODUCT_ENGINE_MARKET",
          "MARKET_F144_READINESS_CONDUCTOR",
          "DEXTER_LAB.productEngineMarket",
          "HEARTH.productEngineMarket"
        ]
      },
      [CANVAS_FILE]: {
        status: "ARCHITECTURE_BOUND_SOURCE_ALIAS_PENDING",
        primaryCoordinate: createMechanicalCoordinate("AXLE", "NINETEEN_PART_SYSTEM", "F13", {
          mechanicalRole: "VISIBLE_EXPRESSION_TRANSFER_AXIS"
        }),
        architectureLabels: ["Canvas Chapel", "Queen Relation", "Chapel Bishop", "Priest Pointer Finger", "Finger Pawns"],
        aliases: ["HEARTH.canvas", "HEARTH.canvasAuthority", "HEARTH_CANVAS"],
        sourceAudited: false
      }
    };
  }

  function buildAliasRegistry() {
    const fileMap = getFileCoordinateMap();
    const aliasEntries = [];

    Object.keys(fileMap).forEach((file) => {
      const entry = fileMap[file];
      (entry.aliases || []).forEach((alias) => {
        aliasEntries.push({
          alias,
          file,
          coordinateId: entry.primaryCoordinate
            ? entry.primaryCoordinate.coordinateId
            : Array.isArray(entry.primaryCoordinates)
              ? entry.primaryCoordinates.map((coordinate) => coordinate.coordinateId)
              : "",
          status: entry.status || STATUS.UNKNOWN,
          architectureLabels: entry.architectureLabels || []
        });
      });
    });

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      aliasRegistryActive: true,
      aliasesLocateOnly: true,
      canonical: [
        "LAB_RUNTIME_TABLE",
        "RUNTIME_TABLE",
        "LAB_RUNTIME_TABLE_NORTH"
      ],
      dexterLab: [
        "DEXTER_LAB.runtimeTable",
        "DEXTER_LAB.tripleGDiagnostic",
        "DEXTER_LAB.visualCarrierPlanAuthority",
        "DEXTER_LAB.checkpointGovernor",
        "DEXTER_LAB.cardinalRuntimeTableNorth",
        "DEXTER_LAB.centralTrainStation",
        "DEXTER_LAB.productEngineConductor"
      ],
      hearth: [
        "HEARTH.northCommandRuntimeTable",
        "HEARTH.centralTrainStation",
        "HEARTH.runtimeTable"
      ],
      support: [
        "LAB_PRODUCT_ENGINE",
        "LAB_PRODUCT_ENGINE_F34",
        "LAB_PRODUCT_ENGINE_UE5_EXPRESSION",
        "LAB_PRODUCT_ENGINE_REGISTRY",
        "LAB_PRODUCT_ENGINE_MARKET"
      ],
      receipt: [
        "LAB_RUNTIME_TABLE_RECEIPT",
        "LAB_RUNTIME_TABLE_NORTH_RECEIPT",
        "HEARTH_NORTH_COMMAND_RECEIPT"
      ],
      entries: aliasEntries
    };
  }

  function getAliasRegistry() {
    return clonePlain(buildAliasRegistry());
  }

  function getAliasBoundCoordinate(fileOrAlias) {
    const key = safeString(fileOrAlias);
    const fileMap = getFileCoordinateMap();

    if (fileMap[key]) {
      return {
        found: true,
        lookup: key,
        file: key,
        coordinate: clonePlain(fileMap[key]),
        lookupType: "file"
      };
    }

    const registry = buildAliasRegistry();
    const entry = registry.entries.find((item) => item.alias === key);

    if (entry && fileMap[entry.file]) {
      return {
        found: true,
        lookup: key,
        file: entry.file,
        alias: entry.alias,
        coordinate: clonePlain(fileMap[entry.file]),
        lookupType: "alias"
      };
    }

    return {
      found: false,
      lookup: key,
      reason: "NO_ALIAS_BOUND_COORDINATE"
    };
  }

  function evaluateCoordinateBinding(fileOrAlias) {
    const found = getAliasBoundCoordinate(fileOrAlias);
    if (!found.found) {
      return {
        ...found,
        bindingValid: false,
        hardFailure: false
      };
    }

    const coordinate = found.coordinate.primaryCoordinate || (found.coordinate.primaryCoordinates || [])[0] || null;

    return {
      ...found,
      bindingValid: Boolean(coordinate && coordinate.valid),
      coordinateId: coordinate ? coordinate.coordinateId : "",
      enginePart: coordinate ? coordinate.enginePart : "",
      fibonacciStage: coordinate ? coordinate.fibonacciStage : "",
      status: found.coordinate.status || STATUS.UNKNOWN,
      hardFailure: safeBool(found.coordinate.hardFailureWhenAbsent, false)
    };
  }

  function evaluateMechanicalCoordinate(coordinateInput = {}) {
    const coordinate = typeof coordinateInput === "string"
      ? parseCoordinateId(coordinateInput)
      : isObject(coordinateInput) && coordinateInput.coordinateId
        ? parseCoordinateId(coordinateInput.coordinateId)
        : createMechanicalCoordinate(
            coordinateInput.enginePart,
            coordinateInput.systemCategory,
            coordinateInput.fibonacciStage || coordinateInput.fibonacciStation
          );

    if (!coordinate.valid) {
      return {
        accepted: false,
        reason: coordinate.reason || "INVALID_COORDINATE",
        coordinate: clonePlain(coordinate)
      };
    }

    return {
      accepted: true,
      reason: "MECHANICAL_COORDINATE_VALID",
      coordinate,
      enginePartDefinesFunction: true,
      fibonacciDefinesSequence: true,
      categoryDefinesScale: true
    };
  }

  function normalizeStateIndex(value) {
    const n = safeNumber(value, 0);
    return clamp(Math.floor(n), 0, 255);
  }

  function bindStateToMechanicalCoordinate(input = {}) {
    const coordinateInput = input.coordinate || input.coordinateId || input;
    const evaluated = evaluateMechanicalCoordinate(coordinateInput);
    const stateIndex = normalizeStateIndex(input.stateIndex ?? input.state ?? 0);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      bindingType: "MECHANICAL_COORDINATE_PLUS_STATE_256",
      coordinateAccepted: evaluated.accepted,
      coordinate: evaluated.coordinate || null,
      state256: {
        stateId: `ST_${stateIndex}`,
        stateIndex,
        binary: stateIndex.toString(2).padStart(8, "0"),
        field: "STATE_MOTION_CONSTRAINT_POSSIBILITY",
        replacesMechanicalCoordinate: false
      },
      geometry: {
        filterId: `FL_${(stateIndex % 61) + 1}`,
        pressureShellId: `PS_${(stateIndex % 192) + 1}`,
        basinAnchorId: `BA_${(stateIndex % 9) + 1}`,
        geometryEnvelope: "GEOMETRY_TOTAL_451"
      },
      bound: evaluated.accepted,
      boundAt: nowIso()
    };
  }

  function evaluateCoordinateState(input = {}) {
    const binding = input.bindingType
      ? input
      : bindStateToMechanicalCoordinate(input);

    const coordinateAllowed = Boolean(binding.coordinateAccepted);
    const stateAdmissible = binding.state256 && binding.state256.stateIndex >= 0 && binding.state256.stateIndex <= 255;
    const filterPassageAllowed = true;
    const pressureWithinShell = true;
    const basinAnchored = true;
    const envelopeContained = true;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      coordinateId: binding.coordinate ? binding.coordinate.coordinateId : "",
      stateId: binding.state256 ? binding.state256.stateId : "",
      coordinateAllowed,
      stateAdmissible,
      filterPassageAllowed,
      pressureWithinShell,
      basinAnchored,
      envelopeContained,
      runtimeExpressionAllowed: Boolean(
        coordinateAllowed &&
        stateAdmissible &&
        filterPassageAllowed &&
        pressureWithinShell &&
        basinAnchored &&
        envelopeContained
      ),
      evaluatedAt: nowIso()
    };
  }

  function evaluateRuntimeCondition(input = {}) {
    const binding = input.bindingType
      ? input
      : bindStateToMechanicalCoordinate(input);
    const evaluation = evaluateCoordinateState(binding);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      conditionType: "RUNTIME_CONDITION",
      runtimeCondition:
        `${evaluation.coordinateId || "NO_COORDINATE"}::${evaluation.stateId || "NO_STATE"}`,
      binding,
      evaluation,
      brakeState: evaluation.runtimeExpressionAllowed ? "RELEASED" : "ENGAGED",
      valveState: evaluation.runtimeExpressionAllowed ? "OPEN" : "CLOSED",
      clutchState: evaluation.runtimeExpressionAllowed ? "ENGAGED" : "DISENGAGED",
      governorState: "ACTIVE",
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      evaluatedAt: nowIso()
    };
  }

  function getRuntimeConditionPacket(input = {}) {
    return evaluateRuntimeCondition(input);
  }

  function getCoordinatesByEnginePart(enginePart) {
    const id = safeString(enginePart).toUpperCase();
    return getMechanicalCoordinateLattice({ materialize: true }).cells.filter((cell) => cell.enginePart === id);
  }

  function getCoordinatesByFibonacciStation(stage) {
    const station = stationByStage(stage);
    if (!station) return [];
    return getMechanicalCoordinateLattice({ materialize: true }).cells.filter((cell) => cell.fibonacciStage === station.stage);
  }

  function getCoordinatesBySystemCategory(category) {
    const found = typeof category === "number" ? categoryByIndex(category) : categoryById(category);
    if (!found) return [];
    return getMechanicalCoordinateLattice({ materialize: true }).cells.filter((cell) => cell.systemCategory === found.id);
  }

  function createTable(rows = [], options = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      tableType: safeString(options.tableType || "RUNTIME_TABLE"),
      rows: Array.isArray(rows) ? clonePlain(rows) : [],
      rowCount: Array.isArray(rows) ? rows.length : 0,
      options: clonePlain(options),
      createdAt: nowIso()
    };
  }

  class RuntimeTable {
    constructor(options = {}) {
      this.options = clonePlain(options);
      this.createdAt = nowIso();
      this.rows = [];
    }

    add(row) {
      this.rows.push(clonePlain(row));
      return this;
    }

    toJSON() {
      return createTable(this.rows, this.options);
    }

    getReceiptLight() {
      return getReceiptLight();
    }

    getReceipt() {
      return getReceipt();
    }

    submit(packet) {
      return submit(packet);
    }
  }

  function createHearthChannelTable(input = {}) {
    return createTable([
      { channel: "land", status: "receiver" },
      { channel: "water", status: "receiver" },
      { channel: "air", status: "receiver" },
      { channel: "canvas", status: "carrier" }
    ], { ...clonePlain(input), tableType: "HEARTH_CHANNEL_TABLE" });
  }

  function createPlanetChannelTable(input = {}) {
    return createTable([
      { channel: "terrain", status: "receiver" },
      { channel: "hydrology", status: "receiver" },
      { channel: "material", status: "receiver" },
      { channel: "canvas", status: "carrier" }
    ], { ...clonePlain(input), tableType: "PLANET_CHANNEL_TABLE" });
  }

  function createGoalProfile(input = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      profileType: "GOAL_PROFILE",
      target: safeString(input.target || input.route || ""),
      goals: Array.isArray(input.goals) ? input.goals.slice() : [],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: nowIso()
    };
  }

  function createPlanetGoalProfile(input = {}) {
    return {
      ...createGoalProfile(input),
      profileType: "PLANET_GOAL_PROFILE",
      planet: safeString(input.planet || "hearth")
    };
  }

  function createTripleGDiagnostic(input = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      diagnosticType: "TRIPLE_G",
      coherence: safeNumber(input.coherence, 0),
      constraint: safeNumber(input.constraint, 0),
      runtime: safeNumber(input.runtime, 0),
      status: STATUS.ACTIVE,
      createdAt: nowIso()
    };
  }

  function createHearthCoherenceDiagnostic(input = {}) {
    return {
      ...createTripleGDiagnostic(input),
      diagnosticType: "HEARTH_COHERENCE"
    };
  }

  function createPlanetWideProbeDiagnostic(input = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      diagnosticType: "PLANET_WIDE_PROBE",
      sampleCount: safeNumber(input.sampleCount, 0),
      status: STATUS.ACTIVE,
      createdAt: nowIso()
    };
  }

  function runCoherenceDiagnostic(input = {}) {
    const score = clamp(
      Math.round((safeNumber(input.coherence, 0) + safeNumber(input.constraint, 0) + safeNumber(input.runtime, 0)) / 3),
      0,
      100
    );
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      diagnosticRun: "COHERENCE",
      score,
      pass: score >= 80,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      ranAt: nowIso()
    };
  }

  function runPlanetWideProbe(input = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      probeRun: "PLANET_WIDE",
      sampleCount: safeNumber(input.sampleCount, 0),
      pass: safeNumber(input.sampleCount, 0) > 0,
      ranAt: nowIso()
    };
  }

  function createVisualCarrierPlan(input = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      planType: "VISUAL_CARRIER_PLAN",
      carrier: safeString(input.carrier || CANVAS_FILE),
      ownsRendering: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: nowIso()
    };
  }

  function createHearthVisualCarrierPlan(input = {}) {
    return {
      ...createVisualCarrierPlan(input),
      planType: "HEARTH_VISUAL_CARRIER_PLAN"
    };
  }

  function createUniversalPlanetVisualCarrierPlan(input = {}) {
    return {
      ...createVisualCarrierPlan(input),
      planType: "UNIVERSAL_PLANET_VISUAL_CARRIER_PLAN"
    };
  }

  function createLoadingOptimizationPlan(input = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      planType: "LOADING_OPTIMIZATION_PLAN",
      nonBlocking: true,
      deferBroadDatasetWrites: true,
      lightReceiptsPreferred: true,
      target: safeString(input.target || FILE),
      createdAt: nowIso()
    };
  }

  function runProceduralPlan(plan = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      proceduralPlanRun: true,
      plan: clonePlain(plan),
      status: STATUS.READY,
      ranAt: nowIso()
    };
  }

  function createCheckpointSession(input = {}) {
    const id = safeString(input.id || `checkpoint-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    const session = {
      id,
      contract: CONTRACT,
      receipt: RECEIPT,
      activeStage: safeString(input.activeStage || state.activeStage),
      activeProgress: safeNumber(input.activeProgress, 0),
      events: [],
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    state.checkpointSessions[id] = session;
    return clonePlain(session);
  }

  function createHearthCheckpointSession(input = {}) {
    return createCheckpointSession({ ...clonePlain(input), scope: "HEARTH" });
  }

  function createChronologicalFibonacciPlan() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      planType: "CHRONOLOGICAL_FIBONACCI_PLAN",
      sequence: getFibonacciStationAxis(),
      twoCycleLaw: {
        cycleOne: state.cycleOneLaw.slice(),
        cycleTwo: state.cycleTwoLaw.slice()
      },
      createdAt: nowIso()
    };
  }

  function createNewsFibonacciCheckpointPlan() {
    return {
      ...createChronologicalFibonacciPlan(),
      planType: "NEWS_FIBONACCI_CHECKPOINT_PLAN",
      newsGates: clonePlain(NEWS_GATES)
    };
  }

  function classifyCheckpointEvent(event = {}) {
    const type = safeString(event.event || event.checkpointEvent || event.type || "CHECKPOINT_EVENT");
    const stage = safeString(event.activeFibonacci || event.fibonacciStage || event.stage || state.activeStage);
    return {
      eventType: type,
      stage,
      station: stationByStage(stage),
      isSupportEnginePacket: /F34|F55|F89|F144|F233|SUPPORT|MARKET|REGISTRY|EXPRESSION/.test(JSON.stringify(event || {})),
      classifiedAt: nowIso()
    };
  }

  function evaluateNewsGateState(stage = state.activeStage) {
    const station = stationByStage(stage) || stationByStage(state.activeStage);
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      activeStage: station ? station.stage : state.activeStage,
      activeFibonacciRank: station ? station.rank : state.activeFibonacciRank,
      activeNewsGate: station ? station.gate : state.activeNewsGate,
      oneActiveGearAtATime: true,
      evaluatedAt: nowIso()
    };
  }

  function createPrimaryGateRegistry() {
    state.primaryGateRegistry = {
      NORTH: { stage: "F1", status: STATUS.ACTIVE },
      EAST: { stage: "F3", status: STATUS.HELD },
      WEST: { stage: "F5", status: STATUS.HELD },
      SOUTH: { stage: "F8", status: STATUS.HELD },
      CANVAS: { stage: "F13", status: STATUS.HELD },
      NORTH_LATCH: { stage: "F21", status: STATUS.HELD },
      PRODUCT: { stage: "F34", status: STATUS.HELD },
      EXPRESSION: { stage: "F55", status: STATUS.HELD },
      REGISTRY: { stage: "F89", status: STATUS.HELD },
      MARKET: { stage: "F144", status: STATUS.HELD },
      DOWNSTREAM: { stage: "F233", status: STATUS.HELD }
    };
    return clonePlain(state.primaryGateRegistry);
  }

  function getActiveGateState() {
    return evaluateNewsGateState(state.activeStage);
  }

  function setActiveStage(stage, detail = {}) {
    const station = stationByStage(stage);
    if (!station) {
      return {
        accepted: false,
        reason: "UNKNOWN_FIBONACCI_STAGE",
        requestedStage: safeString(stage)
      };
    }

    state.activeStage = station.stage;
    state.activeFibonacciRank = station.rank;
    state.activeNewsGate = station.gate;
    state.updatedAt = nowIso();

    recordLocal("ACTIVE_STAGE_SET", {
      stage: station.stage,
      rank: station.rank,
      gate: station.gate,
      detail
    });

    publishLight();

    return {
      accepted: true,
      activeStage: state.activeStage,
      activeFibonacciRank: state.activeFibonacciRank,
      activeNewsGate: state.activeNewsGate
    };
  }

  function completeStage(stage = state.activeStage, detail = {}) {
    const station = stationByStage(stage);
    recordLocal("STAGE_COMPLETED", {
      stage: station ? station.stage : safeString(stage),
      detail
    });
    state.activeProgress = 100;
    return {
      completed: true,
      stage: station ? station.stage : safeString(stage),
      completedAt: nowIso()
    };
  }

  function updateActiveProgress(value, detail = {}) {
    state.activeProgress = clamp(value, 0, 100);
    state.updatedAt = nowIso();
    recordLocal("ACTIVE_PROGRESS_UPDATED", {
      activeProgress: state.activeProgress,
      detail
    });
    return {
      activeProgress: state.activeProgress,
      updatedAt: state.updatedAt
    };
  }

  function createHearthTransmissionSession(input = {}) {
    state.hearthTransmissionSession = {
      id: safeString(input.id || `hearth-transmission-${Date.now()}`),
      contract: CONTRACT,
      receipt: RECEIPT,
      status: STATUS.ACTIVE,
      events: [],
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    return clonePlain(state.hearthTransmissionSession);
  }

  function getHearthTransmissionSession() {
    if (!state.hearthTransmissionSession) createHearthTransmissionSession();
    return clonePlain(state.hearthTransmissionSession);
  }

  function getTransmissionReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      transmissionSession: getHearthTransmissionSession(),
      updatedAt: nowIso()
    };
  }

  function getTransmissionReceiptText() {
    return JSON.stringify(getTransmissionReceipt(), null, 2);
  }

  function getNorthCommandReceipt() {
    return getReceiptLight();
  }

  function acceptBranchPacket(branch, action, packet = {}) {
    const stageByBranch = {
      EAST: "F3",
      WEST: "F5",
      SOUTH: "F8",
      CANVAS: "F13",
      NORTH: "F21"
    };
    const stage = stageByBranch[branch] || state.activeStage;
    const coordinateByBranch = {
      EAST: createMechanicalCoordinate("VALVE", "NINETEEN_PART_SYSTEM", "F3", { mechanicalRole: "EAST_INTAKE_CHANNEL" }),
      WEST: createMechanicalCoordinate("COMPRESSION", "NINETEEN_PART_SYSTEM", "F5", { mechanicalRole: "WEST_PRESSURE_VALVE" }),
      SOUTH: createMechanicalCoordinate("EXHAUST", "NINETEEN_PART_SYSTEM", "F8", { mechanicalRole: "SOUTH_PROOF_RETURN" }),
      CANVAS: createMechanicalCoordinate("AXLE", "NINETEEN_PART_SYSTEM", "F13", { mechanicalRole: "CANVAS_EVIDENCE_TRANSFER" }),
      NORTH: createMechanicalCoordinate("GOVERNOR", "NINETEEN_PART_SYSTEM", "F21", { mechanicalRole: "NORTH_COMPLETION_LATCH" })
    };

    const condition = evaluateRuntimeCondition({
      coordinate: coordinateByBranch[branch] || createMechanicalCoordinate("CHASSIS", "NINETEEN_PART_SYSTEM", stage),
      stateIndex: packet.stateIndex ?? packet.state ?? 0
    });

    const accepted = condition.evaluation.runtimeExpressionAllowed;
    recordLocal(`${branch}_${action}`, {
      accepted,
      stage,
      condition: condition.runtimeCondition,
      packet
    });

    if (accepted) {
      setActiveStage(stage, { branch, action });
      if (branch === "EAST") state.cycleOneStatus = STATUS.ACTIVE;
      if (branch === "WEST") state.cycleOneStatus = STATUS.ACTIVE;
      if (branch === "SOUTH") state.cycleOneStatus = STATUS.READY;
    }

    return {
      accepted,
      branch,
      action,
      stage,
      condition,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function acceptEastPrimary(packet = {}) { return acceptBranchPacket("EAST", "PRIMARY_ACCEPTED", packet); }
  function receiveEastPrimary(packet = {}) { return acceptEastPrimary(packet); }
  function acceptEastPrimaryGate(packet = {}) { return acceptEastPrimary(packet); }
  function acceptEastHandoff(packet = {}) { return acceptBranchPacket("EAST", "HANDOFF_ACCEPTED", packet); }
  function receiveEastHandoff(packet = {}) { return acceptEastHandoff(packet); }

  function acceptSouthPrimary(packet = {}) { return acceptBranchPacket("SOUTH", "PRIMARY_ACCEPTED", packet); }
  function receiveSouthPrimary(packet = {}) { return acceptSouthPrimary(packet); }
  function acceptSouthPrimaryGate(packet = {}) { return acceptSouthPrimary(packet); }
  function acceptSouthSpread(packet = {}) { return acceptBranchPacket("SOUTH", "SPREAD_ACCEPTED", packet); }
  function receiveCycleOneSouthReturn(packet = {}) { return acceptSouthPrimary(packet); }

  function acceptWestPrimary(packet = {}) { return acceptBranchPacket("WEST", "PRIMARY_ACCEPTED", packet); }
  function receiveWestPrimary(packet = {}) { return acceptWestPrimary(packet); }
  function acceptWestPrimaryGate(packet = {}) { return acceptWestPrimary(packet); }
  function acceptWestHandoff(packet = {}) { return acceptBranchPacket("WEST", "HANDOFF_ACCEPTED", packet); }
  function receiveWestHandoff(packet = {}) { return acceptWestHandoff(packet); }
  function acceptWestIntake(packet = {}) { return acceptBranchPacket("WEST", "INTAKE_ACCEPTED", packet); }
  function receiveWestIntake(packet = {}) { return acceptWestIntake(packet); }

  function authorizeCycleTwoStart(packet = {}) {
    const eligible = safeBool(packet.force, false) || state.cycleOneStatus === STATUS.READY || state.cycleOneStatus === STATUS.COMPLETE;
    state.cycleTwoAuthorized = eligible;
    state.cycleTwoStatus = eligible ? STATUS.ACTIVE : STATUS.HELD;
    recordLocal("CYCLE_TWO_START_AUTHORIZATION", { eligible, packet });
    return {
      accepted: eligible,
      cycleTwoAuthorized: state.cycleTwoAuthorized,
      cycleTwoStatus: state.cycleTwoStatus
    };
  }

  function authorizeCanvasF13Release(packet = {}) {
    const accepted = safeBool(packet.force, false) || state.cycleTwoAuthorized || state.cycleTwoStatus === STATUS.ACTIVE;
    state.canvasF13ReleaseAuthorized = accepted;
    if (accepted) setActiveStage("F13", { reason: "CANVAS_F13_RELEASE_AUTHORIZED" });
    recordLocal("CANVAS_F13_RELEASE_AUTHORIZATION", { accepted, packet });
    return {
      accepted,
      canvasF13ReleaseAuthorized: accepted,
      releasePacket: composeCanvasF13ReleasePacket(packet)
    };
  }

  function composeCanvasF13ReleasePacket(extra = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "CANVAS_F13_RELEASE_PACKET",
      activeFibonacci: "F13",
      activeFibonacciRank: 13,
      sourceFile: FILE,
      targetFile: CANVAS_FILE,
      canvasF13ReleaseAuthorized: state.canvasF13ReleaseAuthorized,
      cycleTwoAuthorized: state.cycleTwoAuthorized,
      detail: clonePlain(extra),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };
  }

  function acceptCanvasF13Evidence(packet = {}) {
    const accepted = Boolean(
      state.canvasF13ReleaseAuthorized ||
      safeBool(packet.canvasF13EvidenceComplete, false) ||
      safeBool(packet.f13EvidenceReady, false) ||
      safeBool(packet.force, false)
    );
    state.canvasF13EvidenceAccepted = accepted;
    state.canvasF13EvidencePacket = clonePlain(packet);
    recordLocal("CANVAS_F13_EVIDENCE_ACCEPTED", { accepted, packet });
    return {
      accepted,
      canvasF13EvidenceAccepted: accepted,
      recommendedNextStage: accepted ? "F21" : "F13",
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function validateF21Eligibility(packet = {}) {
    const packetSaysEligible = safeBool(packet.f21Eligible, false) || safeBool(packet.f21EligibleForNorth, false);
    const accepted = Boolean(
      packetSaysEligible ||
      state.canvasF13EvidenceAccepted ||
      safeBool(packet.southProofAccepted, false) ||
      safeBool(packet.force, false)
    );

    return {
      accepted,
      f21Eligible: accepted,
      reason: accepted ? "F21_ELIGIBILITY_ACCEPTED" : "WAITING_CANVAS_F13_OR_SOUTH_PROOF",
      packet: clonePlain(packet),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function acceptF21Eligibility(packet = {}) {
    const validation = validateF21Eligibility(packet);
    state.f21EligibilityAccepted = validation.accepted;
    recordLocal("F21_ELIGIBILITY_ACCEPTED", validation);
    if (validation.accepted) setActiveStage("F21", { reason: "F21_ELIGIBILITY_ACCEPTED" });
    return validation;
  }

  function receiveF21Eligibility(packet = {}) { return acceptF21Eligibility(packet); }
  function submitF21Eligibility(packet = {}) { return acceptF21Eligibility(packet); }

  function latchF21FromSouthEligibility(packet = {}) {
    const validation = validateF21Eligibility(packet);
    state.f21EligibilityAccepted = validation.accepted;
    state.f21Latched = validation.accepted;
    state.f21LatchPacket = validation.accepted ? clonePlain(packet) : null;
    state.cycleTwoStatus = validation.accepted ? STATUS.COMPLETE : state.cycleTwoStatus;
    recordLocal("F21_LATCH_FROM_SOUTH_ELIGIBILITY", { accepted: validation.accepted, packet });
    if (validation.accepted) setActiveStage("F21", { reason: "F21_LATCHED" });
    return {
      accepted: validation.accepted,
      f21Latched: state.f21Latched,
      reason: validation.reason,
      recommendedNextStage: validation.accepted ? "F34" : "F21"
    };
  }

  function detectSupportStage(packet = {}) {
    const text = JSON.stringify(packet || {});
    if (safeString(packet.activeFibonacci) === "F55" || /F55|UE5_EXPRESSION|EXPRESSION/.test(text)) return "F55";
    if (safeString(packet.activeFibonacci) === "F89" || /F89|PROJECT_REGISTRY|REGISTRY/.test(text)) return "F89";
    if (safeString(packet.activeFibonacci) === "F144" || /F144|MARKET/.test(text)) return "F144";
    if (safeString(packet.activeFibonacci) === "F233" || /F233|DOWNSTREAM/.test(text)) return "F233";
    if (safeString(packet.activeFibonacci) === "F34" || /F34|PRODUCT_ENGINE/.test(text)) return "F34";
    return "";
  }

  function acceptSupportEnginePacket(packet = {}) {
    const stage = detectSupportStage(packet);
    if (stage === "F55") return acceptF55ExpressionPacket(packet);
    if (stage === "F89") return acceptF89RegistryPacket(packet);
    if (stage === "F144") return acceptF144MarketReadinessPacket(packet);
    if (stage === "F233") return receiveF233DownstreamReturnPacket(packet);
    if (stage === "F34") {
      return recordSupportEnginePacket("F34", SUPPORT_ENGINE_STAGES.F34_PRODUCT_ENGINE_SLOT, packet);
    }

    return {
      accepted: false,
      reason: "UNKNOWN_SUPPORT_ENGINE_PACKET_STAGE",
      packet: clonePlain(packet)
    };
  }

  function receiveSupportEnginePacket(packet = {}) { return acceptSupportEnginePacket(packet); }
  function submitSupportEnginePacket(packet = {}) { return acceptSupportEnginePacket(packet); }

  function recordSupportEnginePacket(stage, anchorId, packet = {}) {
    const station = stationByStage(stage);
    const coordinate =
      stage === "F89"
        ? createMechanicalCoordinate("MANIFOLD", "NINETEEN_PART_SYSTEM", stage, { mechanicalRole: "PROJECT_REGISTRY_CONDUCTOR" })
        : createMechanicalCoordinate("GEARBOX", "NINETEEN_PART_SYSTEM", stage, { mechanicalRole: `${anchorId}_PACKET_CONVERSION` });

    const condition = evaluateRuntimeCondition({ coordinate, stateIndex: packet.stateIndex ?? 0 });

    const item = {
      anchorId,
      stage,
      station: station ? station.id : "",
      accepted: condition.evaluation.runtimeExpressionAllowed,
      packet: clonePlain(packet),
      condition: condition.runtimeCondition,
      acceptedAt: nowIso()
    };

    state.supportEnginePackets.push(item);
    trim(state.supportEnginePackets);
    state.supportEngineAnchors[anchorId] = {
      anchorId,
      stage,
      lastPacketAccepted: item.accepted,
      lastPacketAt: item.acceptedAt,
      status: item.accepted ? STATUS.ACTIVE : STATUS.HELD
    };

    state.supportEngineStatus = item.accepted ? STATUS.ACTIVE : STATUS.HELD;
    recordLocal("SUPPORT_ENGINE_PACKET_ACCEPTED", item);
    publishLight();

    return {
      accepted: item.accepted,
      anchorId,
      stage,
      condition,
      recommendedNextStage:
        stage === "F55" ? "F89" :
        stage === "F89" ? "F144" :
        stage === "F144" ? "F233" :
        stage === "F233" ? "F21" : "F55",
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function acceptF55ExpressionPacket(packet = {}) {
    return recordSupportEnginePacket("F55", SUPPORT_ENGINE_STAGES.F55_EXPRESSION_ENGINE, packet);
  }

  function acceptF89RegistryPacket(packet = {}) {
    return recordSupportEnginePacket("F89", SUPPORT_ENGINE_STAGES.F89_REGISTRY_ENGINE, packet);
  }

  function acceptF144MarketReadinessPacket(packet = {}) {
    return recordSupportEnginePacket("F144", SUPPORT_ENGINE_STAGES.F144_MARKET_ENGINE, packet);
  }

  function receiveF233DownstreamReturnPacket(packet = {}) {
    const response = recordSupportEnginePacket("F233", SUPPORT_ENGINE_STAGES.F233_DOWNSTREAM_RETURN, packet);
    recordLocal("F233_DOWNSTREAM_RETURN_RECEIVED", { accepted: response.accepted, packet });
    return response;
  }

  function acceptCheckpointEvent(packet = {}) {
    return submitEvent(packet);
  }

  function receiveCheckpointEvent(packet = {}) {
    return submitEvent(packet);
  }

  function submitEvent(packet = {}) {
    const classification = classifyCheckpointEvent(packet);
    let response;

    if (classification.isSupportEnginePacket) {
      response = acceptSupportEnginePacket(packet);
    } else if (/CANVAS|F13/.test(JSON.stringify(packet || {}))) {
      response = acceptCanvasF13Evidence(packet);
    } else if (/F21|ELIGIBILITY|LATCH/.test(JSON.stringify(packet || {}))) {
      response = acceptF21Eligibility(packet);
    } else {
      response = {
        accepted: true,
        reason: "GENERIC_EVENT_ACCEPTED",
        classification,
        packet: clonePlain(packet)
      };
      recordLocal("GENERIC_EVENT_ACCEPTED", response);
    }

    return response;
  }

  function submit(packet = {}) { return submitEvent(packet); }
  function receiveEvent(packet = {}) { return submitEvent(packet); }

  function completeActive(detail = {}) {
    return completeStage(state.activeStage, detail);
  }

  function bindCardinalBranches(input = {}) {
    const branches = {
      east: firstGlobal(["LAB_RUNTIME_TABLE_EAST", "DEXTER_LAB.runtimeTableEast", "HEARTH.runtimeTableEast"]),
      south: firstGlobal(["LAB_RUNTIME_TABLE_SOUTH", "DEXTER_LAB.runtimeTableSouth", "HEARTH.runtimeTableSouth"]),
      west: firstGlobal(["LAB_RUNTIME_TABLE_WEST", "DEXTER_LAB.runtimeTableWest", "HEARTH.runtimeTableWest"])
    };
    state.observedAuthorities.cardinalBranches = {
      eastPresent: Boolean(branches.east),
      southPresent: Boolean(branches.south),
      westPresent: Boolean(branches.west),
      detail: clonePlain(input),
      observedAt: nowIso()
    };
    return clonePlain(state.observedAuthorities.cardinalBranches);
  }

  function loadCardinalBranchScripts(options = {}) {
    const files = [EAST_FILE, SOUTH_FILE, WEST_FILE];
    if (!doc || !doc.createElement || !doc.head) {
      return {
        attempted: false,
        reason: "DOCUMENT_UNAVAILABLE",
        files
      };
    }

    const created = [];
    files.forEach((src) => {
      if (doc.querySelector && doc.querySelector(`script[src="${src}"]`)) return;
      const script = doc.createElement("script");
      script.src = src;
      script.defer = true;
      script.dataset.runtimeTableBranch = "true";
      script.dataset.runtimeTableBranchContract = CONTRACT;
      doc.head.appendChild(script);
      created.push(src);
    });

    recordLocal("CARDINAL_BRANCH_SCRIPTS_REQUESTED", { created, options });
    return {
      attempted: true,
      created,
      files
    };
  }

  function getCardinalReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      branches: bindCardinalBranches(),
      updatedAt: nowIso()
    };
  }

  function extractNodalArtifact(input = {}) {
    const id = makeId(input.id || input.name || `artifact-${Object.keys(state.stationArtifacts).length + 1}`);
    const artifact = {
      id,
      type: safeString(input.type || "artifact"),
      sourceFile: safeString(input.sourceFile || ""),
      platform: assignArtifactPlatform(input).platform,
      input: clonePlain(input),
      extractedAt: nowIso()
    };
    state.stationArtifacts[id] = artifact;
    return clonePlain(artifact);
  }

  function assignArtifactPlatform(input = {}) {
    const type = safeString(input.type || input.artifactType || "").toLowerCase();
    let platform = "general";
    if (/market|offer|license|demo/.test(type)) platform = "market";
    else if (/scene|expression|ue5|visual/.test(type)) platform = "expression";
    else if (/registry|record|evidence|receipt/.test(type)) platform = "registry";
    else if (/runtime|checkpoint|north/.test(type)) platform = "runtime";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      platform,
      input: clonePlain(input),
      assignedAt: nowIso()
    };
  }

  function evaluateNewsAlignment() {
    const checks = [
      state.oneActiveGearAtATime,
      state.engineMechanicsPrimary,
      state.mathPrimary,
      state.threeDMechanicalLatticeBound,
      state.stateLattice256Bound,
      state.filterPassage61Bound,
      state.pressureShell192Bound,
      state.basinAnchor9Bound,
      state.geometryEnvelope451Bound,
      !state.publicSuperiorityClaimed,
      !state.generatedImage,
      !state.graphicBox,
      !state.webGL,
      !state.visualPassClaimed
    ];

    const passed = checks.filter(Boolean).length;
    const score = Math.round((passed / checks.length) * 100);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsProtocolAligned: score >= 90,
      fibonacciSynchronizationScore: score,
      activeStage: state.activeStage,
      activeFibonacciRank: state.activeFibonacciRank,
      activeNewsGate: state.activeNewsGate,
      sequence: getFibonacciStationAxis(),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      evaluatedAt: nowIso()
    };
  }

  function evaluateFibonacciSynchronization(packet = {}) {
    const stage = safeString(packet.activeFibonacci || packet.fibonacciStage || packet.stage || state.activeStage);
    const station = stationByStage(stage);
    const ok = Boolean(station);
    return {
      accepted: ok,
      stage: ok ? station.stage : stage,
      rank: ok ? station.rank : 0,
      gate: ok ? station.gate : "",
      activeStage: state.activeStage,
      synchronized: ok,
      evaluatedAt: nowIso()
    };
  }

  function evaluateParentContact(input = {}) {
    const aliases = Array.isArray(input.aliases) ? input.aliases : [
      "LAB_RUNTIME_TABLE",
      "RUNTIME_TABLE",
      "DEXTER_LAB.runtimeTable",
      "HEARTH.northCommandRuntimeTable"
    ];
    const found = firstGlobal(aliases);
    return {
      parentContactDetected: Boolean(found),
      aliases,
      recommendedNextFile: Boolean(found) ? "" : FILE,
      evaluatedAt: nowIso()
    };
  }

  function dispatchStationArtifact(input = {}) {
    const artifact = extractNodalArtifact(input);
    recordLocal("STATION_ARTIFACT_DISPATCHED", artifact);
    return {
      dispatched: true,
      artifact,
      dispatchedAt: nowIso()
    };
  }

  function classifyProductEngineArtifact(input = {}) {
    const type = safeString(input.type || input.artifactType || "").toLowerCase();
    let className = "PRODUCT_ENGINE_ARTIFACT";
    if (/f55|expression|scene/.test(type)) className = "F55_EXPRESSION_ARTIFACT";
    else if (/f89|registry|record/.test(type)) className = "F89_REGISTRY_ARTIFACT";
    else if (/f144|market|offer/.test(type)) className = "F144_MARKET_ARTIFACT";
    else if (/f34|product/.test(type)) className = "F34_PRODUCT_ENGINE_ARTIFACT";

    return {
      className,
      input: clonePlain(input),
      classifiedAt: nowIso()
    };
  }

  function registerProductEngineArtifact(input = {}) {
    const id = makeId(input.id || input.name || `product-artifact-${Object.keys(state.productEngineArtifacts).length + 1}`);
    const classification = classifyProductEngineArtifact(input);
    const artifact = {
      id,
      classification: classification.className,
      input: clonePlain(input),
      registeredAt: nowIso()
    };
    state.productEngineArtifacts[id] = artifact;
    recordLocal("PRODUCT_ENGINE_ARTIFACT_REGISTERED", artifact);
    return clonePlain(artifact);
  }

  function routeProductEngineArtifact(input = {}) {
    const artifact = registerProductEngineArtifact(input);
    const platform = assignArtifactPlatform(input);
    return {
      routed: true,
      artifact,
      platform: platform.platform,
      routedAt: nowIso()
    };
  }

  function refreshStationArtifacts() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      stationArtifacts: clonePlain(state.stationArtifacts),
      productEngineArtifacts: clonePlain(state.productEngineArtifacts),
      refreshedAt: nowIso()
    };
  }

  function queuePhase(phase = "", detail = {}) {
    const item = recordLocal("PHASE_QUEUED", { phase, detail });
    return {
      queued: true,
      phase: safeString(phase),
      event: item
    };
  }

  function invalidateAuthorityCache() {
    state.authorityCacheValid = false;
    state.authorityCacheUpdatedAt = "";
    return {
      invalidated: true,
      invalidatedAt: nowIso()
    };
  }

  function refreshObservedAuthorities() {
    const registry = buildAliasRegistry();
    const observed = {};
    registry.entries.forEach((entry) => {
      observed[entry.alias] = Boolean(readPath(entry.alias));
    });
    state.observedAuthorities.aliases = observed;
    state.authorityCacheValid = true;
    state.authorityCacheUpdatedAt = nowIso();
    return clonePlain({
      authorityCacheValid: state.authorityCacheValid,
      authorityCacheUpdatedAt: state.authorityCacheUpdatedAt,
      observed
    });
  }

  function scheduleLightPublish() {
    if (state.lightPublishQueued) return { queued: true, alreadyQueued: true };
    state.lightPublishQueued = true;

    const run = () => {
      state.lightPublishQueued = false;
      publishLight();
    };

    try {
      if (typeof root.requestAnimationFrame === "function") {
        root.requestAnimationFrame(run);
      } else {
        root.setTimeout(run, 0);
      }
    } catch (_error) {
      state.lightPublishQueued = false;
      publishLight();
    }

    return { queued: true };
  }

  function publishDatasetsLight() {
    updateDatasetLight();
    return {
      published: true,
      mode: "light",
      updatedAt: nowIso()
    };
  }

  function publishDatasetsFull() {
    updateDatasetLight();
    setDataset("runtimeTableTotalMechanicalCoordinates", state.totalMechanicalCoordinates);
    setDataset("runtimeTableTotalCoordinateStateCapacity", state.totalCoordinateStateCapacity);
    setDataset("runtimeTable3dEngineLatticeBound", "true");
    setDataset("runtimeTable256StateLatticeBound", "true");
    setDataset("runtimeTable61FiltersBound", "true");
    setDataset("runtimeTable192PressureShellBound", "true");
    setDataset("runtimeTable9BasinsBound", "true");
    setDataset("runtimeTable451EnvelopeBound", "true");
    return {
      published: true,
      mode: "full",
      updatedAt: nowIso()
    };
  }

  function publishLight() {
    publishGlobalsLight();
    publishDatasetsLight();
    return {
      published: true,
      mode: "light",
      updatedAt: nowIso()
    };
  }

  function getCentralStationReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      centralTrainStationActive: true,
      countyRuntimeEngineCenter: true,
      supportEngineAnchors: clonePlain(state.supportEngineAnchors),
      stationArtifactsCount: Object.keys(state.stationArtifacts).length,
      productEngineArtifactsCount: Object.keys(state.productEngineArtifacts).length,
      updatedAt: nowIso()
    };
  }

  function getCentralStationReceipt() {
    return {
      ...getCentralStationReceiptLight(),
      stationArtifacts: clonePlain(state.stationArtifacts),
      productEngineArtifacts: clonePlain(state.productEngineArtifacts),
      supportEnginePackets: clonePlain(state.supportEnginePackets)
    };
  }

  function getCentralStationReceiptText() {
    return JSON.stringify(getCentralStationReceipt(), null, 2);
  }

  function getReceiptLight() {
    const news = evaluateNewsAlignment();
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,

      countyRuntimeEngineCenter: true,
      northTimingGovernor: true,
      shellStandardActive: true,
      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,

      threeDMechanicalLatticeBound: true,
      stateLattice256Bound: true,
      filterPassage61Bound: true,
      pressureShell192Bound: true,
      basinAnchor9Bound: true,
      geometryEnvelope451Bound: true,
      totalMechanicalCoordinates: state.totalMechanicalCoordinates,
      totalCoordinateStateCapacity: state.totalCoordinateStateCapacity,

      activeStage: state.activeStage,
      activeFibonacciRank: state.activeFibonacciRank,
      activeNewsGate: state.activeNewsGate,
      activeProgress: state.activeProgress,
      oneActiveGearAtATime: true,

      cycleOneStatus: state.cycleOneStatus,
      cycleTwoStatus: state.cycleTwoStatus,
      cycleTwoAuthorized: state.cycleTwoAuthorized,
      canvasF13ReleaseAuthorized: state.canvasF13ReleaseAuthorized,
      canvasF13EvidenceAccepted: state.canvasF13EvidenceAccepted,
      f21EligibilityAccepted: state.f21EligibilityAccepted,
      f21Latched: state.f21Latched,

      supportEngineStatus: state.supportEngineStatus,
      f34ProductEngineFileWritten: false,
      f34ProductEngineHardFailure: false,
      f55ExpressionEngineSupported: true,
      f89RegistryEngineSupported: true,
      f144MarketEngineSupported: true,
      f233DownstreamReturnSupported: true,

      newsProtocolAligned: news.newsProtocolAligned,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: news.fibonacciSynchronizationScore,

      benchmarkRequiredBeforePublicClaim: true,
      publicSuperiorityClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      localEventCount: state.localEvents.length,
      errorCount: state.errors.length,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      runtimeTableReceipt: true,
      owns: [
        "county runtime engine center",
        "North timing governor",
        "F21 completion latch",
        "F233 return intake",
        "3D mechanical coordinate lattice",
        "256 state lattice binding",
        "61 filter passage binding",
        "192 pressure shell binding",
        "9 basin anchor binding",
        "451 geometry envelope binding",
        "alias manifold",
        "support-engine anchor registry",
        "district diagnostic bridge"
      ],
      doesNotOwn: [
        "Canvas rendering",
        "controls",
        "route orchestration",
        "planet truth",
        "material truth",
        "elevation truth",
        "hydrology truth",
        "support engine internals",
        "generated image",
        "GraphicBox",
        "WebGL",
        "final visual pass claim",
        "public superiority claim"
      ],

      engineMechanicsContract: getEngineMechanicsContract(),
      engineMechanicsComponentMap: getEngineMechanicsComponentMap(),
      mechanicalCoordinateLattice: getMechanicalCoordinateLattice({ materialize: false }),
      stateLattice256Summary: {
        stateCount: 256,
        replacesMechanicalCoordinate: false
      },
      filterPassageMap61Summary: {
        filterCount: 61
      },
      pressureShellMap192Summary: {
        shellCount: 192
      },
      basinAnchorMap9Summary: {
        basinCount: 9
      },
      geometryEnvelope451: getGeometryEnvelope451(),

      fibonacciSynchronizationMap: getFibonacciSynchronizationMap(),
      labSupremeJudgeRegistry: getLabSupremeJudgeRegistry(),
      registryJudgeRegistry: getRegistryJudgeRegistry(),
      engineClerkMap: getEngineClerkMap(),
      chessOrchestrationMap: getChessOrchestrationMap(),
      chapelOrchestrationMap: getChapelOrchestrationMap(),
      priestPointerFingerMap: getPriestPointerFingerMap(),
      fingerPawnMap: getFingerPawnMap(),
      fileCoordinateMap: getFileCoordinateMap(),
      aliasRegistry: getAliasRegistry(),

      supportEngineAnchors: clonePlain(state.supportEngineAnchors),
      supportEnginePackets: clonePlain(state.supportEnginePackets),
      stationArtifacts: clonePlain(state.stationArtifacts),
      productEngineArtifacts: clonePlain(state.productEngineArtifacts),
      observedAuthorities: clonePlain(state.observedAuthorities),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();
    return [
      "LAB_RUNTIME_TABLE_COUNTY_ENGINE_MECHANICS_3D_LATTICE_256_STATE_SUPPORT_ENGINE_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      "",
      `countyRuntimeEngineCenter=${r.countyRuntimeEngineCenter}`,
      `northTimingGovernor=${r.northTimingGovernor}`,
      `shellStandardActive=${r.shellStandardActive}`,
      `engineMechanicsPrimary=${r.engineMechanicsPrimary}`,
      `mathPrimary=${r.mathPrimary}`,
      `architectureLabelsSecondary=${r.architectureLabelsSecondary}`,
      "",
      `threeDMechanicalLatticeBound=${r.threeDMechanicalLatticeBound}`,
      `stateLattice256Bound=${r.stateLattice256Bound}`,
      `filterPassage61Bound=${r.filterPassage61Bound}`,
      `pressureShell192Bound=${r.pressureShell192Bound}`,
      `basinAnchor9Bound=${r.basinAnchor9Bound}`,
      `geometryEnvelope451Bound=${r.geometryEnvelope451Bound}`,
      `totalMechanicalCoordinates=${r.totalMechanicalCoordinates}`,
      `totalCoordinateStateCapacity=${r.totalCoordinateStateCapacity}`,
      "",
      `activeStage=${r.activeStage}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `activeNewsGate=${r.activeNewsGate}`,
      `activeProgress=${r.activeProgress}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      "",
      `cycleOneStatus=${r.cycleOneStatus}`,
      `cycleTwoStatus=${r.cycleTwoStatus}`,
      `cycleTwoAuthorized=${r.cycleTwoAuthorized}`,
      `canvasF13ReleaseAuthorized=${r.canvasF13ReleaseAuthorized}`,
      `canvasF13EvidenceAccepted=${r.canvasF13EvidenceAccepted}`,
      `f21EligibilityAccepted=${r.f21EligibilityAccepted}`,
      `f21Latched=${r.f21Latched}`,
      "",
      `supportEngineStatus=${r.supportEngineStatus}`,
      `f34ProductEngineFileWritten=${r.f34ProductEngineFileWritten}`,
      `f34ProductEngineHardFailure=${r.f34ProductEngineHardFailure}`,
      `f55ExpressionEngineSupported=${r.f55ExpressionEngineSupported}`,
      `f89RegistryEngineSupported=${r.f89RegistryEngineSupported}`,
      `f144MarketEngineSupported=${r.f144MarketEngineSupported}`,
      `f233DownstreamReturnSupported=${r.f233DownstreamReturnSupported}`,
      "",
      `newsProtocolAligned=${r.newsProtocolAligned}`,
      `fibonacciSynchronizationScore=${r.fibonacciSynchronizationScore}`,
      "",
      `benchmarkRequiredBeforePublicClaim=${r.benchmarkRequiredBeforePublicClaim}`,
      `publicSuperiorityClaimed=${r.publicSuperiorityClaimed}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `localEventCount=${r.localEventCount}`,
      `errorCount=${r.errorCount}`,
      `createdAt=${r.createdAt}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDatasetLight() {
    setDataset("labRuntimeTableLoaded", "true");
    setDataset("labRuntimeTableContract", CONTRACT);
    setDataset("labRuntimeTableReceipt", RECEIPT);
    setDataset("labRuntimeTableVersion", VERSION);
    setDataset("labRuntimeTableFile", FILE);

    setDataset("runtimeTableCountyEngineCenter", "true");
    setDataset("runtimeTableEngineMechanicsPrimary", "true");
    setDataset("runtimeTableMathPrimary", "true");
    setDataset("runtimeTableArchitectureLabelsSecondary", "true");

    setDataset("runtimeTable3dMechanicalLatticeBound", "true");
    setDataset("runtimeTable256StateLatticeBound", "true");
    setDataset("runtimeTable61FiltersBound", "true");
    setDataset("runtimeTable192PressureShellBound", "true");
    setDataset("runtimeTable9BasinsBound", "true");
    setDataset("runtimeTable451EnvelopeBound", "true");

    setDataset("runtimeTableActiveStage", state.activeStage);
    setDataset("runtimeTableActiveFibonacciRank", state.activeFibonacciRank);
    setDataset("runtimeTableActiveNewsGate", state.activeNewsGate);
    setDataset("runtimeTableActiveProgress", state.activeProgress);

    setDataset("runtimeTableF21Latched", state.f21Latched);
    setDataset("runtimeTableCanvasF13ReleaseAuthorized", state.canvasF13ReleaseAuthorized);
    setDataset("runtimeTableSupportEngineStatus", state.supportEngineStatus);

    setDataset("runtimeTableF34ProductEngineFileWritten", "false");
    setDataset("runtimeTableF34ProductEngineHardFailure", "false");
    setDataset("runtimeTableF55ExpressionSupported", "true");
    setDataset("runtimeTableF89RegistrySupported", "true");
    setDataset("runtimeTableF144MarketSupported", "true");
    setDataset("runtimeTableF233DownstreamReturnSupported", "true");

    setDataset("runtimeTablePublicSuperiorityClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishGlobalsLight() {
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.HEARTH = root.HEARTH || {};

    const aliases = [
      "LAB_RUNTIME_TABLE",
      "RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "LAB_CENTRAL_TRAIN_STATION",
      "LAB_PRODUCT_ENGINE_CONDUCTOR"
    ];

    aliases.forEach((alias) => {
      root[alias] = api;
    });

    [
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.tripleGDiagnostic",
      "DEXTER_LAB.visualCarrierPlanAuthority",
      "DEXTER_LAB.checkpointGovernor",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "DEXTER_LAB.centralTrainStation",
      "DEXTER_LAB.productEngineConductor",
      "HEARTH.runtimeTable",
      "HEARTH.northCommandRuntimeTable",
      "HEARTH.centralTrainStation"
    ].forEach((path) => setPath(path, api));

    const light = getReceiptLight();

    root.LAB_RUNTIME_TABLE_RECEIPT = light;
    root.LAB_RUNTIME_TABLE_NORTH_RECEIPT = light;
    root.HEARTH_NORTH_COMMAND_RECEIPT = light;
    root.LAB_CENTRAL_TRAIN_STATION_RECEIPT = getCentralStationReceiptLight();

    setPath("DEXTER_LAB.runtimeTableReceipt", light);
    setPath("HEARTH.northCommandReceipt", light);

    root.__LAB_RUNTIME_TABLE_LOADED__ = true;
    root.__LAB_RUNTIME_TABLE_CONTRACT__ = CONTRACT;
    root.__LAB_RUNTIME_TABLE_RECEIPT__ = RECEIPT;
    root.__LAB_RUNTIME_TABLE_3D_ENGINE_LATTICE_BOUND__ = true;
    root.__LAB_RUNTIME_TABLE_256_STATE_LATTICE_BOUND__ = true;
    root.__LAB_RUNTIME_TABLE_WEBGL__ = false;
    root.__LAB_RUNTIME_TABLE_VISUAL_PASS_CLAIMED__ = false;

    updateDatasetLight();
  }

  function publishGlobals() {
    publishGlobalsLight();
    publishDatasetsFull();
    return {
      published: true,
      mode: "full",
      updatedAt: nowIso()
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,

    STATUS,
    ENGINE_PARTS,
    RUNTIME_SYSTEM_CATEGORIES,
    FIBONACCI_STATIONS,
    FIBONACCI,
    NEWS_GATES,
    SUPPORT_ENGINE_STAGES,

    createTable,
    RuntimeTable,
    createHearthChannelTable,
    createPlanetChannelTable,
    createGoalProfile,
    createPlanetGoalProfile,
    createTripleGDiagnostic,
    createHearthCoherenceDiagnostic,
    createPlanetWideProbeDiagnostic,
    runCoherenceDiagnostic,
    runPlanetWideProbe,
    createVisualCarrierPlan,
    createHearthVisualCarrierPlan,
    createUniversalPlanetVisualCarrierPlan,
    createLoadingOptimizationPlan,
    runProceduralPlan,

    createCheckpointSession,
    createHearthCheckpointSession,
    createChronologicalFibonacciPlan,
    createNewsFibonacciCheckpointPlan,
    classifyCheckpointEvent,
    evaluateNewsGateState,
    createPrimaryGateRegistry,
    getActiveGateState,
    setActiveStage,
    completeStage,
    updateActiveProgress,

    createHearthTransmissionSession,
    getHearthTransmissionSession,
    getTransmissionReceipt,
    getTransmissionReceiptText,
    getNorthCommandReceipt,

    acceptEastPrimary,
    receiveEastPrimary,
    acceptEastPrimaryGate,
    acceptEastHandoff,
    receiveEastHandoff,

    acceptSouthPrimary,
    receiveSouthPrimary,
    acceptSouthPrimaryGate,
    acceptSouthSpread,
    receiveCycleOneSouthReturn,

    acceptWestPrimary,
    receiveWestPrimary,
    acceptWestPrimaryGate,
    acceptWestHandoff,
    receiveWestHandoff,
    acceptWestIntake,
    receiveWestIntake,

    authorizeCycleTwoStart,
    authorizeCanvasF13Release,
    composeCanvasF13ReleasePacket,
    acceptCanvasF13Evidence,

    acceptF21Eligibility,
    receiveF21Eligibility,
    submitF21Eligibility,
    validateF21Eligibility,
    latchF21FromSouthEligibility,

    acceptCheckpointEvent,
    receiveCheckpointEvent,
    submitEvent,
    submit,
    receiveEvent,
    completeActive,

    bindCardinalBranches,
    loadCardinalBranchScripts,
    getCardinalReceipt,

    extractNodalArtifact,
    assignArtifactPlatform,
    evaluateNewsAlignment,
    evaluateFibonacciSynchronization,
    evaluateParentContact,
    dispatchStationArtifact,
    registerProductEngineArtifact,
    classifyProductEngineArtifact,
    routeProductEngineArtifact,

    getCentralStationReceiptLight,
    getCentralStationReceipt,
    getCentralStationReceiptText,
    refreshStationArtifacts,
    queuePhase,
    invalidateAuthorityCache,
    refreshObservedAuthorities,
    scheduleLightPublish,
    publishLight,
    publishDatasetsLight,
    publishDatasetsFull,
    publishGlobals,

    getEngineMechanicsContract,
    getEngineMechanicsComponentMap,
    getMechanicalCoordinateLattice,
    getEnginePartAxis,
    getRuntimeSystemCategoryAxis,
    getFibonacciStationAxis,
    getStateLattice256,
    getFilterPassageMap61,
    getPressureShellMap192,
    getBasinAnchorMap9,
    getGeometryEnvelope451,

    bindStateToMechanicalCoordinate,
    evaluateMechanicalCoordinate,
    evaluateCoordinateState,
    evaluateRuntimeCondition,
    getRuntimeConditionPacket,
    getCoordinatesByEnginePart,
    getCoordinatesByFibonacciStation,
    getCoordinatesBySystemCategory,

    getFibonacciSynchronizationMap,
    getLabSupremeJudgeRegistry,
    getRegistryJudgeRegistry,
    getEngineClerkMap,
    getChessOrchestrationMap,
    getChapelOrchestrationMap,
    getPriestPointerFingerMap,
    getFingerPawnMap,
    getFileCoordinateMap,
    getAliasRegistry,
    getAliasBoundCoordinate,
    evaluateCoordinateBinding,

    acceptSupportEnginePacket,
    receiveSupportEnginePacket,
    submitSupportEnginePacket,
    acceptF55ExpressionPacket,
    acceptF89RegistryPacket,
    acceptF144MarketReadinessPacket,
    receiveF233DownstreamReturnPacket,

    getReceiptLight,
    getReceipt,
    getReceiptText,

    countyRuntimeEngineCenter: true,
    northTimingGovernor: true,
    shellStandardActive: true,
    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,

    threeDMechanicalLatticeBound: true,
    stateLattice256Bound: true,
    filterPassage61Bound: true,
    pressureShell192Bound: true,
    basinAnchor9Bound: true,
    geometryEnvelope451Bound: true,

    benchmarkRequiredBeforePublicClaim: true,
    publicSuperiorityClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  state.createdAt = nowIso();
  state.updatedAt = state.createdAt;
  createPrimaryGateRegistry();

  try {
    refreshObservedAuthorities();
  } catch (error) {
    recordError("INITIAL_AUTHORITY_SCAN_FAILED", error);
  }

  recordLocal("RUNTIME_TABLE_V4_LOADED", {
    file: FILE,
    contract: CONTRACT,
    threeDMechanicalLatticeBound: true,
    stateLattice256Bound: true,
    supportEngineAnchors: true,
    f34ProductEngineFileWritten: false,
    publicSuperiorityClaimed: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
