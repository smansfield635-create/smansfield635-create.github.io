// /assets/hearth/hearth.canvas.east.js
// HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_TNT_v3
// Full-file replacement.
// Canvas East / material-atlas source child only.
// Purpose:
// - Repair the parent-reported East child gap: buildAtlas,sample,read,getReceipt.
// - Publish the exact aliases required by /assets/hearth/hearth.canvas.js.
// - Align East child to the active Canvas North parent:
//   HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_TNT_v1.
// - Consume upstream material authority when available.
// - Build a valid atlas canvas packet for the Canvas North parent.
// - Preserve fallback atlas support only as emergency F13 carrier support.
// - Keep East as source/intake only.
// - Preserve NEWS + Fibonacci synchronization at F13E / F13F.
// Does not own:
// - planet truth
// - elevation truth
// - hydrology truth
// - material truth
// - texture composition
// - sphere rendering
// - visible proof
// - runtime-table governance
// - route orchestration
// - F21
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_TNT_v3";
  const RECEIPT = "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_CARDINAL_SPLIT_EAST_CHILD_TNT_v1";

  const ACTIVE_PARENT_SPLIT_CONTRACT = "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_TNT_v1";
  const ACTIVE_PARENT_SPLIT_RECEIPT = "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_RECEIPT_v1";

  const RETIRED_PARENT_SPLIT_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2",
    "HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_TNT_v1"
  ]);

  const EXPECTED_MATERIAL_CONTRACT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_TNT_v1";
  const EXPECTED_MATERIAL_RECEIPT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_RECEIPT_v1";

  const VERSION = "2026-05-31.hearth-canvas-east-parent-aligned-material-atlas-source-transistor-v3";
  const FILE = "/assets/hearth/hearth.canvas.east.js";
  const PARENT_FILE = "/assets/hearth/hearth.canvas.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const MIN_ATLAS_WIDTH = 256;
  const MIN_ATLAS_HEIGHT = 128;
  const MAX_ATLAS_WIDTH = 1024;
  const MAX_ATLAS_HEIGHT = 512;

  const CYCLE_ORDER = "NORTH_PARENT_F13 -> EAST_SOURCE_F13E -> EAST_ATLAS_F13F -> SOUTH_TEXTURE -> SOUTH_FRAME -> CHECKPOINT_RETURN";
  const ACTIVE_FIBONACCI_GATE = "F13E_F13F";
  const FUTURE_FIBONACCI_GATE = "F21";

  const PALETTE = Object.freeze({
    void: [0, 0, 0],
    deepWater: [4, 12, 27],
    water: [11, 42, 75],
    shelf: [28, 75, 87],
    coast: [93, 92, 70],
    land: [86, 112, 69],
    highland: [119, 113, 83],
    ridge: [146, 134, 100],
    canyon: [62, 45, 34],
    peak: [178, 172, 148],
    wetStone: [45, 58, 55],
    scar: [31, 39, 39]
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    activeParentSplitContract: ACTIVE_PARENT_SPLIT_CONTRACT,
    activeParentSplitReceipt: ACTIVE_PARENT_SPLIT_RECEIPT,
    retiredParentSplitContracts: RETIRED_PARENT_SPLIT_CONTRACTS.slice(),
    expectedMaterialContract: EXPECTED_MATERIAL_CONTRACT,
    expectedMaterialReceipt: EXPECTED_MATERIAL_RECEIPT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,
    role: "canvas-east-source-material-atlas-transistor-child-parent-aligned",

    splitAdapterChild: true,
    parentContractAligned: true,
    parentPhysicalBootstrapAligned: true,
    retiredParentContractSuperseded: true,
    recursiveReceiptLoopRemoved: true,

    requiredApiSurfaceComplete: true,
    requiredMethods: ["buildAtlas", "sample", "read", "getReceipt"],

    transistorAdapterActive: true,
    transistorRole: "source",
    transistorSourceRole: "east-material-atlas-source",
    transistorGateParent: "canvas-north-physical-object-bootstrap-f13-carrier",
    transistorControlPeer: "west-motion-invalidation-control",
    transistorDrainPeer: "south-texture-render-visible-output-drain",
    transistorCurrentFlow: "EAST_SOURCE_TO_SOUTH_DRAIN_THROUGH_NORTH_PARENT_GATE_WITH_WEST_CONTROL",

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
    futureFibonacciGate: FUTURE_FIBONACCI_GATE,
    oneActiveGearAtATime: true,
    cycleOrder: CYCLE_ORDER,

    materialReceiptBridgeActive: false,
    materialNestedReceiptAvailable: false,
    materialContract: "",
    materialReceipt: "",
    materialExpectedContract: EXPECTED_MATERIAL_CONTRACT,
    materialExpectedReceipt: EXPECTED_MATERIAL_RECEIPT,
    materialContractMatchesExpected: false,
    materialReceiptMatchesExpected: false,
    materialPreviousContract: "",
    materialBaselineContract: "",
    materialVersion: "",
    materialRole: "",
    materialBridgeSignature: "",
    previousMaterialBridgeSignature: "",
    materialBridgeChanged: false,
    materialBridgeSyncCount: 0,
    materialBridgeLastSyncedAt: "",

    canonicalMaterialAuthorityPresent: false,
    canonicalMaterialConsumed: false,
    canonicalMaterialColorPrimary: false,
    canonicalMaterialShapePrimary: false,
    materialsPrimaryWhenValid: true,
    rawSourceColorDemotedToPaletteInfluence: true,
    canvasStillDoesNotOwnPlanetTruth: true,
    canvasEastDoesNotOwnMaterialTruth: true,

    atlasSourceActive: true,
    upstreamFirstAtlasActive: true,
    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    atlasBuildError: "",
    atlasBuildStartedAt: "",
    atlasBuildCompletedAt: "",
    atlasBuildElapsedMs: 0,
    atlasCanvasPresent: false,
    atlasWidth: DEFAULT_ATLAS_WIDTH,
    atlasHeight: DEFAULT_ATLAS_HEIGHT,
    atlasPixelCount: 0,

    atlasCanonicalMaterialSampleCount: 0,
    atlasMaterialSampleCount: 0,
    atlasElevationHydrologySampleCount: 0,
    atlasFallbackSampleCount: 0,
    atlasUnknownUpstreamSampleCount: 0,
    atlasTotalSampleCount: 0,
    atlasLandSampleCount: 0,
    atlasWaterSampleCount: 0,
    atlasCoastSampleCount: 0,
    atlasReliefSampleCount: 0,
    atlasClassCount: 0,
    atlasClasses: [],

    sevenContinentFallbackEmergencyOnly: true,
    sevenContinentFallbackUsed: false,
    sevenContinentFallbackSuppressedByUpstream: false,
    elevationControlsLandShape: true,
    hydrologyControlsWaterShape: true,
    coastlinesReadFromHydrologyAndMaterials: true,
    landChannelStillReceiverOnly: true,

    cachedAtlasInvalidationAvailable: true,
    atlasInvalidationCount: 0,
    atlasInvalidated: false,
    atlasInvalidationReason: "",

    fallbackSampleAvailable: true,
    fallbackSampleUsedAtRuntime: false,

    f13SourceStageStarted: false,
    f13SourceStageComplete: false,
    f13AtlasPacketReady: false,
    f21ClaimedByCanvasEast: false,
    readyTextClaimedByCanvasEast: false,

    lastSampleAt: "",
    lastBuildAt: "",
    publishedAt: "",
    updatedAt: "",

    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  let atlasCanvas = null;
  let lastAtlasImageData = null;

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
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function mixNumber(a, b, t) {
    const k = clamp01(t);
    return a + (b - a) * k;
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      Math.round(mixNumber(a[0], b[0], k)),
      Math.round(mixNumber(a[1], b[1], k)),
      Math.round(mixNumber(a[2], b[2], k))
    ];
  }

  function scaleColor(color, scalar) {
    const s = Number.isFinite(Number(scalar)) ? Number(scalar) : 1;
    return [
      clamp(Math.round(color[0] * s), 0, 255),
      clamp(Math.round(color[1] * s), 0, 255),
      clamp(Math.round(color[2] * s), 0, 255)
    ];
  }

  function normalizeRgb(value, fallback = PALETTE.void) {
    if (!Array.isArray(value) || value.length < 3) return fallback.slice();

    return [
      clamp(Math.round(safeNumber(value[0], fallback[0])), 0, 255),
      clamp(Math.round(safeNumber(value[1], fallback[1])), 0, 255),
      clamp(Math.round(safeNumber(value[2], fallback[2])), 0, 255)
    ];
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trimArray(array, max = 160) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "LOCAL_EVENT"),
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
      code: safeString(code, "CANVAS_EAST_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 120);
    state.updatedAt = item.at;
    updateDataset();

    return item;
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

  function hashNoise(x, y, z, salt = 0) {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + salt * 89.17) * 43758.5453123;
    return n - Math.floor(n);
  }

  function textureNoise(point, salt = 0) {
    const n1 = hashNoise(point.u || 0, point.v || 0, point.x || 0, salt);
    const n2 = hashNoise(point.v || 0, point.z || 0, point.y || 0, salt + 13);
    const n3 = hashNoise(point.x || 0, point.y || 0, point.z || 0, salt + 31);
    return clamp01(n1 * 0.46 + n2 * 0.34 + n3 * 0.20);
  }

  function pointFromUv(u, v) {
    const uu = ((safeNumber(u, 0.5) % 1) + 1) % 1;
    const vv = clamp(safeNumber(v, 0.5), 0, 1);
    const lon = uu * 360 - 180;
    const lat = 90 - vv * 180;
    const lonRad = lon * Math.PI / 180;
    const latRad = lat * Math.PI / 180;
    const c = Math.cos(latRad);

    return {
      u: uu,
      v: vv,
      lon,
      lat,
      x: Math.sin(lonRad) * c,
      y: Math.sin(latRad),
      z: Math.cos(lonRad) * c
    };
  }

  function normalizePoint(input = {}) {
    if (isObject(input)) {
      if (Number.isFinite(Number(input.u)) && Number.isFinite(Number(input.v))) {
        return pointFromUv(input.u, input.v);
      }

      if (Number.isFinite(Number(input.lon)) && Number.isFinite(Number(input.lat))) {
        return pointFromUv((Number(input.lon) + 180) / 360, (90 - Number(input.lat)) / 180);
      }

      if (
        Number.isFinite(Number(input.x)) &&
        Number.isFinite(Number(input.y)) &&
        Number.isFinite(Number(input.z))
      ) {
        const x = Number(input.x);
        const y = Number(input.y);
        const z = Number(input.z);
        const m = Math.hypot(x, y, z) || 1;
        const nx = x / m;
        const ny = y / m;
        const nz = z / m;
        const lon = Math.atan2(nx, nz) * 180 / Math.PI;
        const lat = Math.asin(clamp(ny, -1, 1)) * 180 / Math.PI;

        return {
          x: nx,
          y: ny,
          z: nz,
          lon,
          lat,
          u: ((lon + 180) / 360 % 1 + 1) % 1,
          v: clamp((90 - lat) / 180, 0, 1)
        };
      }
    }

    return pointFromUv(0.5, 0.5);
  }

  function callAuthority(authority, methods, point) {
    if (!authority || typeof authority !== "object") return null;

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method](point);
        if (result && typeof result === "object") return result;
      } catch (_error) {}

      try {
        const result = authority[method](point.u, point.v, point.lon, point.lat);
        if (result && typeof result === "object") return result;
      } catch (_error2) {}

      try {
        const result = authority[method](point.x, point.y, point.z);
        if (result && typeof result === "object") return result;
      } catch (_error3) {}
    }

    return null;
  }

  function getMaterialAuthority() {
    const candidates = [
      pathRead("HEARTH.materials"),
      pathRead("HEARTH.materialAuthority"),
      pathRead("HEARTH.materialsAuthority"),
      pathRead("HEARTH.surfaceMaterials"),
      root.HEARTH_MATERIALS,
      root.HEARTH_MATERIAL_AUTHORITY,
      root.HearthMaterials,
      root.HearthMaterialAuthority,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthMaterials,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthMaterialAuthority
    ];

    for (const candidate of candidates) {
      if (!candidate || !isObject(candidate)) continue;
      if (candidate === api) continue;
      if (candidate.contract === CONTRACT || candidate.receipt === RECEIPT) continue;

      if (
        isFunction(candidate.sample) ||
        isFunction(candidate.read) ||
        isFunction(candidate.getMaterial) ||
        isFunction(candidate.materialAt) ||
        isFunction(candidate.getMaterialAt) ||
        isFunction(candidate.getSurfaceMaterial) ||
        isFunction(candidate.resolve) ||
        isFunction(candidate.resolveMaterial)
      ) {
        return candidate;
      }
    }

    return null;
  }

  function readMaterialReceipt(authority = getMaterialAuthority()) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        if (receipt && typeof receipt === "object") return receipt;
      } catch (_error) {}
    }

    return {
      contract: authority.contract || "",
      receipt: authority.receipt || "",
      previousContract: authority.previousContract || "",
      baselineContract: authority.baselineContract || "",
      requiredElevationContract: authority.requiredElevationContract || "",
      optionalReliefChildContract: authority.optionalReliefChildContract || "",
      version: authority.version || "",
      authority: authority.authority || "materials",
      role: authority.role || "materials"
    };
  }

  function signatureFromReceipt(receipt) {
    if (!receipt || typeof receipt !== "object") return "NONE";

    return [
      receipt.contract || "",
      receipt.receipt || "",
      receipt.version || "",
      receipt.requiredElevationContract || "",
      receipt.optionalReliefChildContract || "",
      receipt.authority || receipt.role || ""
    ].join("::");
  }

  function syncMaterialBridge(options = {}) {
    const authority = options.authority || getMaterialAuthority();
    const materialReceipt = readMaterialReceipt(authority);
    const signature = signatureFromReceipt(materialReceipt);
    const previousSignature = state.materialBridgeSignature || "";

    state.materialBridgeSyncCount += 1;
    state.materialBridgeLastSyncedAt = nowIso();

    state.canonicalMaterialAuthorityPresent = Boolean(authority);
    state.materialNestedReceiptAvailable = Boolean(materialReceipt);
    state.materialReceiptBridgeActive = Boolean(materialReceipt);

    state.materialContract = materialReceipt ? safeString(materialReceipt.contract, "") : "";
    state.materialReceipt = materialReceipt ? safeString(materialReceipt.receipt, "") : "";
    state.materialPreviousContract = materialReceipt ? safeString(materialReceipt.previousContract, "") : "";
    state.materialBaselineContract = materialReceipt ? safeString(materialReceipt.baselineContract, "") : "";
    state.materialVersion = materialReceipt ? safeString(materialReceipt.version, "") : "";
    state.materialRole = materialReceipt ? safeString(materialReceipt.authority || materialReceipt.role || "materials", "materials") : "";

    state.materialExpectedContract = EXPECTED_MATERIAL_CONTRACT;
    state.materialExpectedReceipt = EXPECTED_MATERIAL_RECEIPT;
    state.materialContractMatchesExpected = state.materialContract === EXPECTED_MATERIAL_CONTRACT;
    state.materialReceiptMatchesExpected = state.materialReceipt === EXPECTED_MATERIAL_RECEIPT;

    state.canonicalMaterialConsumed = Boolean(authority && state.materialContractMatchesExpected);
    state.canonicalMaterialColorPrimary = Boolean(authority);
    state.canonicalMaterialShapePrimary = Boolean(authority);

    state.previousMaterialBridgeSignature = previousSignature;
    state.materialBridgeSignature = signature;
    state.materialBridgeChanged = Boolean(previousSignature && previousSignature !== signature);
    state.updatedAt = state.materialBridgeLastSyncedAt;

    if (state.materialBridgeChanged && options.invalidate === true) {
      invalidateAtlas("material-bridge-signature-changed", { skipDataset: true });
    }

    if (options.updateDataset !== false) updateDataset();

    return {
      changed: state.materialBridgeChanged,
      signature,
      previousSignature,
      authorityPresent: Boolean(authority),
      materialReceipt: clonePlain(materialReceipt || null),
      materialBridgeReceipt: getMaterialBridgeReceipt({ sync: false })
    };
  }

  function refreshMaterialBridge(options = {}) {
    return syncMaterialBridge(options);
  }

  function getMaterialBridgeReceipt(options = {}) {
    if (options.sync !== false) {
      syncMaterialBridge({ updateDataset: false, invalidate: false });
    }

    return {
      materialReceiptBridgeActive: state.materialReceiptBridgeActive,
      materialNestedReceiptAvailable: state.materialNestedReceiptAvailable,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialExpectedContract: state.materialExpectedContract,
      materialExpectedReceipt: state.materialExpectedReceipt,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected,
      materialPreviousContract: state.materialPreviousContract,
      materialBaselineContract: state.materialBaselineContract,
      materialVersion: state.materialVersion,
      materialRole: state.materialRole,
      canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed,
      canonicalMaterialColorPrimary: state.canonicalMaterialColorPrimary,
      canonicalMaterialShapePrimary: state.canonicalMaterialShapePrimary,
      materialBridgeSignature: state.materialBridgeSignature,
      previousMaterialBridgeSignature: state.previousMaterialBridgeSignature,
      materialBridgeChanged: state.materialBridgeChanged,
      materialBridgeSyncCount: state.materialBridgeSyncCount,
      materialBridgeLastSyncedAt: state.materialBridgeLastSyncedAt,
      recursiveReceiptLoopRemoved: true
    };
  }

  function numberField(source, key, fallback = 0) {
    const n = Number(source && source[key]);
    return Number.isFinite(n) ? n : fallback;
  }

  function boolField(source, key, fallback = false) {
    return typeof (source && source[key]) === "boolean" ? source[key] : fallback;
  }

  function stringField(source, key, fallback = "") {
    return typeof (source && source[key]) === "string" && source[key] ? source[key] : fallback;
  }

  function fallbackTerrain(point) {
    const n = textureNoise(point, 411);
    const latAbs = Math.abs(point.lat) / 90;
    const equator = 1 - latAbs;

    const massA = Math.max(0, 0.62 - Math.hypot(point.u - 0.18, point.v - 0.36) * 1.45);
    const massB = Math.max(0, 0.58 - Math.hypot(point.u - 0.45, point.v - 0.48) * 1.55);
    const massC = Math.max(0, 0.57 - Math.hypot(point.u - 0.74, point.v - 0.28) * 1.50);
    const massD = Math.max(0, 0.52 - Math.hypot(point.u - 0.66, point.v - 0.72) * 1.70);
    const polarShelf = Math.max(0, 0.42 - Math.abs(point.v - 0.12) * 2.2) + Math.max(0, 0.36 - Math.abs(point.v - 0.86) * 2.6);

    const landSignal = clamp01(
      massA * 0.34 +
      massB * 0.31 +
      massC * 0.28 +
      massD * 0.23 +
      polarShelf * 0.12 +
      equator * 0.07 +
      (n - 0.5) * 0.18
    );

    const coastBand = clamp01(1 - Math.abs(landSignal - 0.40) / 0.17);
    const isLand = landSignal > 0.40;
    const isWater = !isLand;
    const elevation = isLand ? landSignal * 0.68 : -0.18 - (1 - landSignal) * 0.44;

    let rgb = isWater
      ? mixColor(PALETTE.water, PALETTE.deepWater, clamp01((0.40 - landSignal) * 1.6))
      : mixColor(PALETTE.land, PALETTE.highland, clamp01(landSignal * 0.58));

    if (coastBand > 0.30) {
      rgb = mixColor(rgb, isWater ? PALETTE.shelf : PALETTE.coast, coastBand * 0.20);
    }

    if (isLand && n > 0.68) {
      rgb = mixColor(rgb, PALETTE.ridge, clamp01((n - 0.68) * 0.54));
    }

    if (isLand && n > 0.84) {
      rgb = mixColor(rgb, PALETTE.peak, clamp01((n - 0.84) * 0.62));
    }

    if (isLand && n < 0.22) {
      rgb = mixColor(rgb, PALETTE.canyon, clamp01((0.22 - n) * 0.44));
    }

    return {
      contract: "HEARTH_CANVAS_EAST_EMERGENCY_F13_ATLAS_CARRIER",
      receipt: "HEARTH_CANVAS_EAST_EMERGENCY_F13_ATLAS_CARRIER_RECEIPT",
      rgb,
      color: rgb,
      alpha: 1,
      elevation,
      isLand,
      isWater,
      terrainClass: isWater ? (coastBand > 0.34 ? "shallow_water" : "ocean_basin") : (coastBand > 0.34 ? "coast_edge" : "continent_mass"),
      materialClass: isWater ? "fallback.water.carrier" : "fallback.land.carrier",
      hydrologyClass: isWater ? "fallback_ocean_basin" : "fallback_coastal_transition",
      continentId: isLand ? "fallback_visible_body" : "open_ocean",
      waterFillStrength: isWater ? clamp01(0.44 + (0.40 - landSignal) * 0.68) : 0,
      waterDepth: isWater ? clamp01(0.30 + (0.40 - landSignal) * 0.74) : 0,
      waterlineMaterialFeed: coastBand,
      beachMaterialFeed: coastBand * 0.26,
      wetStoneMaterialFeed: coastBand * 0.18,
      hardCoastMaterialFeed: coastBand * 0.12,
      shorelineGrounding: coastBand * 0.30,
      terrainRelief: isLand ? clamp01(n * 0.26 + landSignal * 0.22) : 0,
      ridgeRelief: isLand ? clamp01(n * 0.18) : 0,
      basinShade: isWater ? clamp01((0.40 - landSignal) * 0.42) : 0,
      mountainRangeMaterialFeed: isLand ? clamp01(Math.max(0, n - 0.64) * 0.38) : 0,
      ridgeChainMaterialFeed: isLand ? clamp01(Math.max(0, n - 0.58) * 0.28) : 0,
      canyonCarveMaterialFeed: isLand ? clamp01(Math.max(0, 0.34 - n) * 0.24) : 0,
      canyonDepthMaterialFeed: isLand ? clamp01(Math.max(0, 0.28 - n) * 0.22) : 0,
      sevenContinentFallbackUsed: true,
      fallbackOnly: true,
      f21ClaimedByCanvasEast: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function classifySampleSource(raw, fallbackUsed) {
    if (fallbackUsed) return "fallback";
    if (!raw || typeof raw !== "object") return "fallback";

    const contract = String(raw.contract || "");

    if (contract === EXPECTED_MATERIAL_CONTRACT) return "canonical-material";
    if (contract.includes("MATERIAL")) return "material";
    if (Number.isFinite(Number(raw.elevation)) || typeof raw.hydrologyClass === "string") return "elevation-hydrology";

    return "unknown-upstream";
  }

  function applyAtlasExpression(samplePacket, point) {
    let rgb = normalizeRgb(
      samplePacket.rgb ||
      samplePacket.color ||
      samplePacket.baseColor ||
      samplePacket.finalColorHint,
      samplePacket.isWater ? PALETTE.water : PALETTE.land
    );

    const n = textureNoise(point, 733);

    const water = clamp01(
      numberField(samplePacket, "waterFillMaterialFeed", 0) * 0.34 +
      numberField(samplePacket, "waterFillStrength", 0) * 0.28 +
      numberField(samplePacket, "waterDepth", 0) * 0.18 +
      (samplePacket.isWater ? 0.12 : 0)
    );

    const coast = clamp01(
      numberField(samplePacket, "waterlineMaterialFeed", 0) * 0.24 +
      numberField(samplePacket, "shorelineGrounding", 0) * 0.20 +
      numberField(samplePacket, "beachMaterialFeed", 0) * 0.14 +
      numberField(samplePacket, "wetStoneMaterialFeed", 0) * 0.16 +
      numberField(samplePacket, "hardCoastMaterialFeed", 0) * 0.14 +
      numberField(samplePacket, "cliffWaterEdgeMaterialFeed", 0) * 0.12
    );

    const relief = clamp01(
      numberField(samplePacket, "terrainRelief", 0) * 0.24 +
      numberField(samplePacket, "ridgeRelief", 0) * 0.18 +
      numberField(samplePacket, "mountainRangeMaterialFeed", 0) * 0.22 +
      numberField(samplePacket, "ridgeChainMaterialFeed", 0) * 0.16 +
      numberField(samplePacket, "canyonCarveMaterialFeed", 0) * 0.14 +
      numberField(samplePacket, "canyonDepthMaterialFeed", 0) * 0.16
    );

    const shelf = clamp01(
      numberField(samplePacket, "shallowShelfMaterialFeed", 0) * 0.24 +
      numberField(samplePacket, "sandShelfMaterialFeed", 0) * 0.18 +
      numberField(samplePacket, "shelfTransition", 0) * 0.16
    );

    const scar = clamp01(
      numberField(samplePacket, "submergedScarMaterialFeed", 0) * 0.22 +
      numberField(samplePacket, "submergedBlockMaterialFeed", 0) * 0.18 +
      numberField(samplePacket, "oldCoastalTechUnderwaterMaterialFeed", 0) * 0.14 +
      numberField(samplePacket, "boundaryMorphologyFeed", 0) * 0.12
    );

    const peak = clamp01(
      numberField(samplePacket, "peakMassifMaterialFeed", 0) * 0.32 +
      numberField(samplePacket, "coordinateSummitMaterialFeed", 0) * 0.18
    );

    const canyon = clamp01(
      numberField(samplePacket, "canyonCarveMaterialFeed", 0) * 0.22 +
      numberField(samplePacket, "canyonDepthMaterialFeed", 0) * 0.24 +
      numberField(samplePacket, "exposedWaterCutMaterialFeed", 0) * 0.20
    );

    if (water > 0.10) rgb = mixColor(rgb, PALETTE.water, water * 0.08);
    if (water > 0.34) rgb = mixColor(rgb, PALETTE.deepWater, water * 0.10);
    if (shelf > 0.12) rgb = mixColor(rgb, PALETTE.shelf, shelf * 0.10);
    if (coast > 0.12) rgb = mixColor(rgb, PALETTE.wetStone, coast * 0.08);
    if (relief > 0.14 && !samplePacket.isWater) rgb = mixColor(rgb, PALETTE.ridge, relief * 0.10);
    if (peak > 0.12 && !samplePacket.isWater) rgb = mixColor(rgb, PALETTE.peak, peak * 0.10);
    if (canyon > 0.12) rgb = mixColor(rgb, PALETTE.canyon, canyon * 0.12);
    if (scar > 0.10) rgb = mixColor(rgb, PALETTE.scar, scar * 0.10);

    const greenSuppression = clamp01(
      scar * 0.08 +
      canyon * 0.06 +
      relief * 0.03 +
      water * 0.04
    );

    rgb[1] = clamp(Math.round(rgb[1] * (1 - greenSuppression)), 0, 255);

    const microContrast = 1 + (n - 0.5) * (0.030 + relief * 0.030 + coast * 0.014);
    return scaleColor(rgb, microContrast);
  }

  function normalizeSample(raw, point, fallbackUsed) {
    const source = raw && typeof raw === "object" ? raw : fallbackTerrain(point);
    const sourceType = classifySampleSource(source, fallbackUsed);
    const rgb = applyAtlasExpression(source, point);

    const terrainClass =
      stringField(source, "terrainClass") ||
      stringField(source, "worldTerrainClass") ||
      stringField(source, "expandedTerrainClass") ||
      stringField(source, "semanticTerrainClass") ||
      (boolField(source, "isWater", false) ? "ocean_basin" : "continent_mass");

    const isWater = boolField(source, "isWater", terrainClass.includes("water") || terrainClass.includes("ocean"));
    const isLand = boolField(source, "isLand", !isWater);
    const isCoast = terrainClass.includes("coast") || terrainClass.includes("shore") || numberField(source, "waterlineMaterialFeed", 0) > 0.25;
    const relief = clamp01(
      numberField(source, "terrainRelief", 0) +
      numberField(source, "ridgeRelief", 0) +
      numberField(source, "mountainRangeMaterialFeed", 0) +
      numberField(source, "canyonCarveMaterialFeed", 0)
    );

    return {
      ...source,
      contract: source.contract || (fallbackUsed ? "HEARTH_CANVAS_EAST_EMERGENCY_F13_ATLAS_CARRIER" : "UNKNOWN_MATERIAL_SOURCE"),
      receipt: source.receipt || (fallbackUsed ? "HEARTH_CANVAS_EAST_EMERGENCY_F13_ATLAS_CARRIER_RECEIPT" : "UNKNOWN_MATERIAL_RECEIPT"),
      eastContract: CONTRACT,
      eastReceipt: RECEIPT,
      parentSplitContract: ACTIVE_PARENT_SPLIT_CONTRACT,
      sourceType,
      u: point.u,
      v: point.v,
      lon: point.lon,
      lat: point.lat,
      x: point.x,
      y: point.y,
      z: point.z,
      rgb,
      color: rgb,
      baseColor: rgb,
      finalColorHint: rgb,
      alpha: clamp01(numberField(source, "alpha", 1)),
      terrainClass,
      isWater,
      isLand,
      isCoast,
      relief,
      canonicalMaterialSample: sourceType === "canonical-material",
      materialSample: sourceType === "canonical-material" || sourceType === "material",
      elevationHydrologySample: sourceType === "elevation-hydrology",
      fallbackSample: sourceType === "fallback",
      unknownUpstreamSample: sourceType === "unknown-upstream",
      atlasExpressionApplied: true,
      canvasEastSourceOnly: true,
      canvasStillDoesNotOwnPlanetTruth: true,
      canvasEastDoesNotOwnMaterialTruth: true,
      parentContractAligned: true,
      parentPhysicalBootstrapAligned: true,
      retiredParentContractSuperseded: true,
      recursiveReceiptLoopRemoved: true,
      f21ClaimedByCanvasEast: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function sampleWithAuthority(point = {}, authority = null, options = {}) {
    const p = normalizePoint(point);
    const materialAuthority = authority || getMaterialAuthority();

    if (options.syncBridge !== false) {
      syncMaterialBridge({
        authority: materialAuthority,
        updateDataset: options.updateDataset !== false,
        invalidate: false
      });
    }

    let raw = null;
    let fallbackUsed = false;

    if (materialAuthority) {
      raw = callAuthority(materialAuthority, [
        "sample",
        "read",
        "getMaterial",
        "materialAt",
        "getMaterialAt",
        "getSurfaceMaterial",
        "resolve",
        "resolveMaterial"
      ], p);
    }

    if (!raw || typeof raw !== "object") {
      raw = fallbackTerrain(p);
      fallbackUsed = true;
      state.fallbackSampleUsedAtRuntime = true;
      state.sevenContinentFallbackUsed = true;
      state.sevenContinentFallbackSuppressedByUpstream = false;
    } else {
      state.sevenContinentFallbackSuppressedByUpstream = true;
    }

    state.lastSampleAt = nowIso();

    return normalizeSample(raw, p, fallbackUsed);
  }

  function sample(point = {}) {
    return sampleWithAuthority(point, getMaterialAuthority(), {
      syncBridge: true,
      updateDataset: false
    });
  }

  function read(point = {}) {
    return sample(point);
  }

  function createAtlasCanvas(width, height) {
    if (!doc || !isFunction(doc.createElement)) {
      throw new Error("Canvas East requires document.createElement to build atlas.");
    }

    const canvas = doc.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    canvas.dataset.hearthCanvasEastAtlas = "true";
    canvas.dataset.hearthCanvasEastContract = CONTRACT;
    canvas.dataset.hearthCanvasEastReceipt = RECEIPT;
    canvas.dataset.hearthCanvasEastParentSplitContract = ACTIVE_PARENT_SPLIT_CONTRACT;
    canvas.dataset.hearthCanvasEastParentContractAligned = "true";
    canvas.dataset.hearthCanvasEastPhysicalBootstrapAligned = "true";
    canvas.dataset.hearthCanvasEastRetiredParentContractSuperseded = "true";
    canvas.dataset.hearthCanvasEastRecursiveReceiptLoopRemoved = "true";
    canvas.dataset.hearthCanvasEastTransistorRole = "source";
    canvas.dataset.hearthCanvasEastMaterialAtlasPrimary = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    return canvas;
  }

  function yieldBuildFrame() {
    return new Promise((resolve) => {
      if (isFunction(root.requestAnimationFrame)) {
        root.requestAnimationFrame(() => resolve());
      } else {
        root.setTimeout(resolve, 0);
      }
    });
  }

  function resetBuildCounters(width, height) {
    state.atlasBuildStarted = true;
    state.atlasBuildProgress = 0;
    state.atlasBuildComplete = false;
    state.atlasBuildError = "";
    state.atlasBuildStartedAt = nowIso();
    state.atlasBuildCompletedAt = "";
    state.atlasBuildElapsedMs = 0;
    state.atlasCanvasPresent = false;
    state.atlasWidth = width;
    state.atlasHeight = height;
    state.atlasPixelCount = width * height;

    state.atlasCanonicalMaterialSampleCount = 0;
    state.atlasMaterialSampleCount = 0;
    state.atlasElevationHydrologySampleCount = 0;
    state.atlasFallbackSampleCount = 0;
    state.atlasUnknownUpstreamSampleCount = 0;
    state.atlasTotalSampleCount = 0;
    state.atlasLandSampleCount = 0;
    state.atlasWaterSampleCount = 0;
    state.atlasCoastSampleCount = 0;
    state.atlasReliefSampleCount = 0;
    state.atlasClassCount = 0;
    state.atlasClasses = [];

    state.f13SourceStageStarted = true;
    state.f13SourceStageComplete = false;
    state.f13AtlasPacketReady = false;

    state.updatedAt = state.atlasBuildStartedAt;

    recordLocal("F13E_ATLAS_BUILD_STARTED", {
      width,
      height,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      parentSplitContract: ACTIVE_PARENT_SPLIT_CONTRACT
    });
  }

  function countSample(material, classSet) {
    state.atlasTotalSampleCount += 1;

    if (material.canonicalMaterialSample) state.atlasCanonicalMaterialSampleCount += 1;
    if (material.materialSample) state.atlasMaterialSampleCount += 1;
    if (material.elevationHydrologySample) state.atlasElevationHydrologySampleCount += 1;
    if (material.fallbackSample) state.atlasFallbackSampleCount += 1;
    if (material.unknownUpstreamSample) state.atlasUnknownUpstreamSampleCount += 1;
    if (material.isLand) state.atlasLandSampleCount += 1;
    if (material.isWater) state.atlasWaterSampleCount += 1;
    if (material.isCoast) state.atlasCoastSampleCount += 1;
    if (material.relief > 0.18) state.atlasReliefSampleCount += 1;

    const className = material.terrainClass || material.materialClass || material.sourceType || "unknown";
    if (className) classSet.add(className);
  }

  function progressCallback(options, progress, detail = {}) {
    state.atlasBuildProgress = clamp(progress, 0, 100);
    state.updatedAt = nowIso();

    if (isFunction(options.onProgress)) {
      try {
        options.onProgress(state.atlasBuildProgress, {
          contract: CONTRACT,
          receipt: RECEIPT,
          parentSplitContract: ACTIVE_PARENT_SPLIT_CONTRACT,
          event: "ATLAS_BUILD_PROGRESS",
          fibonacci: ACTIVE_FIBONACCI_GATE,
          progress: state.atlasBuildProgress,
          detail: clonePlain(detail),
          visualPassClaimed: false
        });
      } catch (error) {
        recordError("ATLAS_PROGRESS_CALLBACK_FAILED", error);
      }
    }

    updateDataset();
  }

  async function buildAtlas(options = {}) {
    const width = clamp(
      Math.round(safeNumber(options.width || options.atlasWidth, DEFAULT_ATLAS_WIDTH)),
      MIN_ATLAS_WIDTH,
      MAX_ATLAS_WIDTH
    );

    const height = clamp(
      Math.round(safeNumber(options.height || options.atlasHeight, DEFAULT_ATLAS_HEIGHT)),
      MIN_ATLAS_HEIGHT,
      MAX_ATLAS_HEIGHT
    );

    const rowsPerChunk = clamp(Math.round(safeNumber(options.rowsPerChunk, 8)), 1, 32);
    const materialAuthority = getMaterialAuthority();

    resetBuildCounters(width, height);
    syncMaterialBridge({
      authority: materialAuthority,
      updateDataset: false,
      invalidate: false
    });

    try {
      atlasCanvas = createAtlasCanvas(width, height);
      const ctx = atlasCanvas.getContext("2d", { alpha: true, willReadFrequently: true });

      if (!ctx) {
        throw new Error("Canvas East could not create atlas 2D context.");
      }

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      const classSet = new Set();

      for (let y = 0; y < height; y += 1) {
        const v = height <= 1 ? 0.5 : y / (height - 1);

        for (let x = 0; x < width; x += 1) {
          const u = width <= 1 ? 0.5 : x / (width - 1);
          const material = sampleWithAuthority({ u, v }, materialAuthority, {
            syncBridge: false,
            updateDataset: false
          });

          countSample(material, classSet);

          const offset = (y * width + x) * 4;
          const rgb = normalizeRgb(material.rgb || material.color, PALETTE.void);
          const alpha = clamp(Math.round(clamp01(material.alpha ?? 1) * 255), 0, 255);

          data[offset] = rgb[0];
          data[offset + 1] = rgb[1];
          data[offset + 2] = rgb[2];
          data[offset + 3] = alpha;
        }

        if (y % rowsPerChunk === 0 || y === height - 1) {
          progressCallback(options, Math.round(((y + 1) / height) * 100), {
            row: y,
            height
          });
          await yieldBuildFrame();
        }
      }

      ctx.putImageData(imageData, 0, 0);

      lastAtlasImageData = imageData;

      state.atlasBuildProgress = 100;
      state.atlasBuildComplete = true;
      state.atlasCanvasPresent = true;
      state.atlasInvalidated = false;
      state.atlasInvalidationReason = "";
      state.atlasClassCount = classSet.size;
      state.atlasClasses = Array.from(classSet).slice(0, 64);
      state.atlasBuildCompletedAt = nowIso();
      state.atlasBuildElapsedMs = Math.max(0, Date.parse(state.atlasBuildCompletedAt) - Date.parse(state.atlasBuildStartedAt));
      state.lastBuildAt = state.atlasBuildCompletedAt;
      state.f13SourceStageComplete = true;
      state.f13AtlasPacketReady = true;
      state.updatedAt = state.atlasBuildCompletedAt;

      recordLocal("F13F_ATLAS_BUILD_COMPLETE", {
        width,
        height,
        atlasPixelCount: state.atlasPixelCount,
        atlasClassCount: state.atlasClassCount,
        fallbackSamples: state.atlasFallbackSampleCount,
        materialSamples: state.atlasMaterialSampleCount,
        canonicalMaterialSamples: state.atlasCanonicalMaterialSampleCount,
        activeFibonacciGate: ACTIVE_FIBONACCI_GATE
      });

      updateDataset();
      publishGlobals();

      const packet = {
        contract: CONTRACT,
        receipt: RECEIPT,
        parentSplitContract: ACTIVE_PARENT_SPLIT_CONTRACT,
        parentSplitReceipt: ACTIVE_PARENT_SPLIT_RECEIPT,
        atlasCanvas,
        canvas: atlasCanvas,
        width,
        height,
        atlasWidth: width,
        atlasHeight: height,
        atlasReady: true,
        atlasBuildComplete: true,
        sourceRole: "east-material-atlas-source",
        materialBridgeReceipt: getMaterialBridgeReceipt({ sync: false }),
        getReceipt,
        f13SourceStageComplete: true,
        f13AtlasPacketReady: true,
        f21ClaimedByCanvasEast: false,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };

      if (isFunction(options.onComplete)) {
        try {
          options.onComplete(packet);
        } catch (error) {
          recordError("ATLAS_COMPLETE_CALLBACK_FAILED", error);
        }
      }

      return packet;
    } catch (error) {
      state.atlasBuildError = error && error.message ? error.message : String(error);
      state.atlasBuildComplete = false;
      state.f13SourceStageComplete = false;
      state.f13AtlasPacketReady = false;
      state.updatedAt = nowIso();

      recordError("ATLAS_BUILD_FAILED", error, {
        width,
        height
      });

      updateDataset();
      publishGlobals();

      throw error;
    }
  }

  function invalidateAtlas(reason = "manual-invalidation", options = {}) {
    state.atlasInvalidationCount += 1;
    state.atlasInvalidated = true;
    state.atlasInvalidationReason = safeString(reason, "manual-invalidation");
    state.atlasBuildComplete = false;
    state.f13AtlasPacketReady = false;
    state.updatedAt = nowIso();

    atlasCanvas = null;
    lastAtlasImageData = null;

    recordLocal("ATLAS_INVALIDATED", {
      reason: state.atlasInvalidationReason
    });

    if (!options.skipDataset) updateDataset();
    publishGlobals();

    return getReceipt();
  }

  function getAtlasCanvas() {
    return atlasCanvas;
  }

  function getLastAtlasImageData() {
    return lastAtlasImageData;
  }

  function updateDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasEastLoaded = "true";
    dataset.hearthCanvasEastPresent = "true";
    dataset.hearthCanvasEastContract = CONTRACT;
    dataset.hearthCanvasEastReceipt = RECEIPT;
    dataset.hearthCanvasEastVersion = VERSION;

    dataset.hearthCanvasEastParentSplitContract = ACTIVE_PARENT_SPLIT_CONTRACT;
    dataset.hearthCanvasEastParentSplitReceipt = ACTIVE_PARENT_SPLIT_RECEIPT;
    dataset.hearthCanvasEastParentContractAligned = "true";
    dataset.hearthCanvasEastPhysicalBootstrapAligned = "true";
    dataset.hearthCanvasEastRetiredParentContractSuperseded = "true";
    dataset.hearthCanvasEastRecursiveReceiptLoopRemoved = "true";

    dataset.hearthCanvasEastRequiredApiSurfaceComplete = "true";
    dataset.hearthCanvasEastBuildAtlasAvailable = "true";
    dataset.hearthCanvasEastSampleAvailable = "true";
    dataset.hearthCanvasEastReadAvailable = "true";
    dataset.hearthCanvasEastGetReceiptAvailable = "true";

    dataset.hearthCanvasEastSplitAdapterChild = "true";
    dataset.hearthCanvasEastTransistorAdapterActive = "true";
    dataset.hearthCanvasEastTransistorRole = "source";
    dataset.hearthCanvasEastNewsProtocolSynchronized = "true";
    dataset.hearthCanvasEastFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasEastActiveFibonacciGate = ACTIVE_FIBONACCI_GATE;
    dataset.hearthCanvasEastFutureFibonacciGate = FUTURE_FIBONACCI_GATE;
    dataset.hearthCanvasEastOneActiveGearAtATime = "true";

    dataset.hearthCanvasEastMaterialReceiptBridgeActive = String(state.materialReceiptBridgeActive);
    dataset.hearthCanvasEastMaterialContract = state.materialContract;
    dataset.hearthCanvasEastMaterialReceipt = state.materialReceipt;
    dataset.hearthCanvasEastMaterialContractMatchesExpected = String(state.materialContractMatchesExpected);
    dataset.hearthCanvasEastMaterialReceiptMatchesExpected = String(state.materialReceiptMatchesExpected);
    dataset.hearthCanvasEastCanonicalMaterialConsumed = String(state.canonicalMaterialConsumed);

    dataset.hearthCanvasEastAtlasBuildStarted = String(state.atlasBuildStarted);
    dataset.hearthCanvasEastAtlasBuildProgress = String(state.atlasBuildProgress);
    dataset.hearthCanvasEastAtlasBuildComplete = String(state.atlasBuildComplete);
    dataset.hearthCanvasEastAtlasCanvasPresent = String(state.atlasCanvasPresent);
    dataset.hearthCanvasEastAtlasWidth = String(state.atlasWidth);
    dataset.hearthCanvasEastAtlasHeight = String(state.atlasHeight);
    dataset.hearthCanvasEastAtlasClassCount = String(state.atlasClassCount);
    dataset.hearthCanvasEastFallbackSampleUsedAtRuntime = String(state.fallbackSampleUsedAtRuntime);
    dataset.hearthCanvasEastAtlasInvalidated = String(state.atlasInvalidated);
    dataset.hearthCanvasEastAtlasInvalidationReason = state.atlasInvalidationReason;

    dataset.hearthCanvasEastF13SourceStageStarted = String(state.f13SourceStageStarted);
    dataset.hearthCanvasEastF13SourceStageComplete = String(state.f13SourceStageComplete);
    dataset.hearthCanvasEastF13AtlasPacketReady = String(state.f13AtlasPacketReady);

    dataset.hearthCanvasEastF21Claimed = "false";
    dataset.hearthCanvasEastReadyTextClaimed = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      activeParentSplitContract: ACTIVE_PARENT_SPLIT_CONTRACT,
      activeParentSplitReceipt: ACTIVE_PARENT_SPLIT_RECEIPT,
      retiredParentSplitContracts: RETIRED_PARENT_SPLIT_CONTRACTS.slice(),
      expectedMaterialContract: EXPECTED_MATERIAL_CONTRACT,
      expectedMaterialReceipt: EXPECTED_MATERIAL_RECEIPT,
      version: VERSION,
      file: FILE,
      parentFile: PARENT_FILE,
      role: state.role,

      splitAdapterChild: true,
      parentContractAligned: true,
      parentPhysicalBootstrapAligned: true,
      retiredParentContractSuperseded: true,
      recursiveReceiptLoopRemoved: true,

      requiredApiSurfaceComplete: true,
      requiredMethods: state.requiredMethods.slice(),
      buildAtlasAvailable: true,
      sampleAvailable: true,
      readAvailable: true,
      getReceiptAvailable: true,

      transistorAdapterActive: true,
      transistorRole: "source",
      transistorSourceRole: state.transistorSourceRole,
      transistorGateParent: state.transistorGateParent,
      transistorControlPeer: state.transistorControlPeer,
      transistorDrainPeer: state.transistorDrainPeer,
      transistorCurrentFlow: state.transistorCurrentFlow,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      futureFibonacciGate: FUTURE_FIBONACCI_GATE,
      oneActiveGearAtATime: true,
      cycleOrder: CYCLE_ORDER,

      materialReceiptBridge: getMaterialBridgeReceipt({ sync: false }),
      materialReceiptBridgeActive: state.materialReceiptBridgeActive,
      materialNestedReceiptAvailable: state.materialNestedReceiptAvailable,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialExpectedContract: state.materialExpectedContract,
      materialExpectedReceipt: state.materialExpectedReceipt,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected,
      canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed,
      canonicalMaterialColorPrimary: state.canonicalMaterialColorPrimary,
      canonicalMaterialShapePrimary: state.canonicalMaterialShapePrimary,
      canvasStillDoesNotOwnPlanetTruth: true,
      canvasEastDoesNotOwnMaterialTruth: true,

      atlasSourceActive: true,
      upstreamFirstAtlasActive: true,
      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      atlasBuildError: state.atlasBuildError,
      atlasBuildStartedAt: state.atlasBuildStartedAt,
      atlasBuildCompletedAt: state.atlasBuildCompletedAt,
      atlasBuildElapsedMs: state.atlasBuildElapsedMs,
      atlasCanvasPresent: state.atlasCanvasPresent,
      atlasWidth: state.atlasWidth,
      atlasHeight: state.atlasHeight,
      atlasPixelCount: state.atlasPixelCount,

      atlasCanonicalMaterialSampleCount: state.atlasCanonicalMaterialSampleCount,
      atlasMaterialSampleCount: state.atlasMaterialSampleCount,
      atlasElevationHydrologySampleCount: state.atlasElevationHydrologySampleCount,
      atlasFallbackSampleCount: state.atlasFallbackSampleCount,
      atlasUnknownUpstreamSampleCount: state.atlasUnknownUpstreamSampleCount,
      atlasTotalSampleCount: state.atlasTotalSampleCount,
      atlasLandSampleCount: state.atlasLandSampleCount,
      atlasWaterSampleCount: state.atlasWaterSampleCount,
      atlasCoastSampleCount: state.atlasCoastSampleCount,
      atlasReliefSampleCount: state.atlasReliefSampleCount,
      atlasClassCount: state.atlasClassCount,
      atlasClasses: state.atlasClasses.slice(),

      sevenContinentFallbackEmergencyOnly: true,
      sevenContinentFallbackUsed: state.sevenContinentFallbackUsed,
      sevenContinentFallbackSuppressedByUpstream: state.sevenContinentFallbackSuppressedByUpstream,
      elevationControlsLandShape: true,
      hydrologyControlsWaterShape: true,
      coastlinesReadFromHydrologyAndMaterials: true,
      landChannelStillReceiverOnly: true,

      cachedAtlasInvalidationAvailable: true,
      atlasInvalidationCount: state.atlasInvalidationCount,
      atlasInvalidated: state.atlasInvalidated,
      atlasInvalidationReason: state.atlasInvalidationReason,

      fallbackSampleAvailable: true,
      fallbackSampleUsedAtRuntime: state.fallbackSampleUsedAtRuntime,

      f13SourceStageStarted: state.f13SourceStageStarted,
      f13SourceStageComplete: state.f13SourceStageComplete,
      f13AtlasPacketReady: state.f13AtlasPacketReady,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      ownsSourceMaterialAtlas: true,
      ownsBuildAtlasMethod: true,
      ownsSampleMethod: true,
      ownsReadMethod: true,
      ownsReceiptSurface: true,

      ownsPlanetTruth: false,
      ownsElevationTruth: false,
      ownsHydrologyTruth: false,
      ownsMaterialTruth: false,
      ownsTextureComposition: false,
      ownsSphereRendering: false,
      ownsVisibleProof: false,
      ownsRuntimeTableGovernance: false,
      ownsRouteOrchestration: false,
      ownsF21: false,
      ownsFinalVisualPassClaim: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      publishedAt: state.publishedAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const classes = (r.atlasClasses || []).join(",");
    const events = (r.localEvents || [])
      .slice(-32)
      .map((event) => `- ${event.at} :: ${event.event} :: ${JSON.stringify(event.detail || {})}`)
      .join("\n") || "- none";

    const errors = (r.errors || [])
      .map((error) => `- ${error.at} :: ${error.code} :: ${error.message}`)
      .join("\n") || "- none";

    return [
      "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `activeParentSplitContract=${r.activeParentSplitContract}`,
      `activeParentSplitReceipt=${r.activeParentSplitReceipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `parentFile=${r.parentFile}`,
      `role=${r.role}`,
      "",
      `splitAdapterChild=${r.splitAdapterChild}`,
      `parentContractAligned=${r.parentContractAligned}`,
      `parentPhysicalBootstrapAligned=${r.parentPhysicalBootstrapAligned}`,
      `retiredParentContractSuperseded=${r.retiredParentContractSuperseded}`,
      `recursiveReceiptLoopRemoved=${r.recursiveReceiptLoopRemoved}`,
      "",
      `requiredApiSurfaceComplete=${r.requiredApiSurfaceComplete}`,
      `buildAtlasAvailable=${r.buildAtlasAvailable}`,
      `sampleAvailable=${r.sampleAvailable}`,
      `readAvailable=${r.readAvailable}`,
      `getReceiptAvailable=${r.getReceiptAvailable}`,
      "",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `cycleOrder=${r.cycleOrder}`,
      "",
      `materialReceiptBridgeActive=${r.materialReceiptBridgeActive}`,
      `materialNestedReceiptAvailable=${r.materialNestedReceiptAvailable}`,
      `materialContract=${r.materialContract}`,
      `materialReceipt=${r.materialReceipt}`,
      `materialContractMatchesExpected=${r.materialContractMatchesExpected}`,
      `materialReceiptMatchesExpected=${r.materialReceiptMatchesExpected}`,
      `canonicalMaterialAuthorityPresent=${r.canonicalMaterialAuthorityPresent}`,
      `canonicalMaterialConsumed=${r.canonicalMaterialConsumed}`,
      "",
      `atlasBuildStarted=${r.atlasBuildStarted}`,
      `atlasBuildProgress=${r.atlasBuildProgress}`,
      `atlasBuildComplete=${r.atlasBuildComplete}`,
      `atlasBuildError=${r.atlasBuildError}`,
      `atlasCanvasPresent=${r.atlasCanvasPresent}`,
      `atlasWidth=${r.atlasWidth}`,
      `atlasHeight=${r.atlasHeight}`,
      `atlasPixelCount=${r.atlasPixelCount}`,
      "",
      `atlasCanonicalMaterialSampleCount=${r.atlasCanonicalMaterialSampleCount}`,
      `atlasMaterialSampleCount=${r.atlasMaterialSampleCount}`,
      `atlasElevationHydrologySampleCount=${r.atlasElevationHydrologySampleCount}`,
      `atlasFallbackSampleCount=${r.atlasFallbackSampleCount}`,
      `atlasUnknownUpstreamSampleCount=${r.atlasUnknownUpstreamSampleCount}`,
      `atlasTotalSampleCount=${r.atlasTotalSampleCount}`,
      `atlasLandSampleCount=${r.atlasLandSampleCount}`,
      `atlasWaterSampleCount=${r.atlasWaterSampleCount}`,
      `atlasCoastSampleCount=${r.atlasCoastSampleCount}`,
      `atlasReliefSampleCount=${r.atlasReliefSampleCount}`,
      `atlasClassCount=${r.atlasClassCount}`,
      `atlasClasses=${classes}`,
      "",
      `f13SourceStageStarted=${r.f13SourceStageStarted}`,
      `f13SourceStageComplete=${r.f13SourceStageComplete}`,
      `f13AtlasPacketReady=${r.f13AtlasPacketReady}`,
      `f21ClaimedByCanvasEast=${r.f21ClaimedByCanvasEast}`,
      `readyTextClaimedByCanvasEast=${r.readyTextClaimedByCanvasEast}`,
      "",
      `ownsSourceMaterialAtlas=${r.ownsSourceMaterialAtlas}`,
      `ownsPlanetTruth=${r.ownsPlanetTruth}`,
      `ownsMaterialTruth=${r.ownsMaterialTruth}`,
      `ownsTextureComposition=${r.ownsTextureComposition}`,
      `ownsSphereRendering=${r.ownsSphereRendering}`,
      `ownsVisibleProof=${r.ownsVisibleProof}`,
      `ownsF21=${r.ownsF21}`,
      `ownsFinalVisualPassClaim=${r.ownsFinalVisualPassClaim}`,
      "",
      "LOCAL_EVENTS",
      events,
      "",
      "ERRORS",
      errors,
      "",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `publishedAt=${r.publishedAt}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvasEast = api;
    root.HEARTH.canvasEastMaterialAtlasSourceMachine = api;
    root.HEARTH.canvasEastSource = api;

    root.HEARTH_CANVAS_EAST = api;
    root.HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE = api;
    root.HEARTH_CANVAS_EAST_SOURCE = api;

    root.DEXTER_LAB.hearthCanvasEast = api;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine = api;
    root.DEXTER_LAB.hearthCanvasEastSource = api;

    const receipt = getReceipt();

    root.HEARTH_CANVAS_EAST_RECEIPT = receipt;
    root.HEARTH.canvasEastReceipt = receipt;
    root.HEARTH.canvasEastMaterialAtlasSourceMachineReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachineReceipt = receipt;

    root.__HEARTH_CANVAS_EAST_LOADED__ = true;
    root.__HEARTH_CANVAS_EAST_FILE__ = FILE;
    root.__HEARTH_CANVAS_EAST_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_EAST_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_EAST_PARENT_SPLIT_CONTRACT__ = ACTIVE_PARENT_SPLIT_CONTRACT;
    root.__HEARTH_CANVAS_EAST_REQUIRED_API_SURFACE_COMPLETE__ = true;

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    updateDataset();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    activeParentSplitContract: ACTIVE_PARENT_SPLIT_CONTRACT,
    activeParentSplitReceipt: ACTIVE_PARENT_SPLIT_RECEIPT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,

    buildAtlas,
    sample,
    read,
    getReceipt,

    invalidateAtlas,
    refreshMaterialBridge,
    getMaterialBridgeReceipt,
    getReceiptText,
    getAtlasCanvas,
    getLastAtlasImageData,

    requiredApiSurfaceComplete: true,
    buildAtlasAvailable: true,
    sampleAvailable: true,
    readAvailable: true,
    getReceiptAvailable: true,

    splitAdapterChild: true,
    parentContractAligned: true,
    parentPhysicalBootstrapAligned: true,
    retiredParentContractSuperseded: true,
    recursiveReceiptLoopRemoved: true,

    transistorAdapterActive: true,
    transistorRole: "source",
    transistorSourceRole: "east-material-atlas-source",

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
    futureFibonacciGate: FUTURE_FIBONACCI_GATE,
    oneActiveGearAtATime: true,
    cycleOrder: CYCLE_ORDER,

    ownsSourceMaterialAtlas: true,
    ownsBuildAtlasMethod: true,
    ownsSampleMethod: true,
    ownsReadMethod: true,
    ownsReceiptSurface: true,

    ownsPlanetTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsTextureComposition: false,
    ownsSphereRendering: false,
    ownsVisibleProof: false,
    ownsRuntimeTableGovernance: false,
    ownsRouteOrchestration: false,
    ownsF21: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  state.updatedAt = nowIso();

  syncMaterialBridge({
    updateDataset: false,
    invalidate: false
  });

  recordLocal("CANVAS_EAST_PARENT_ALIGNED_API_SURFACE_PUBLISHED", {
    requiredMethods: state.requiredMethods.slice(),
    activeParentSplitContract: ACTIVE_PARENT_SPLIT_CONTRACT,
    aliasSet: [
      "HEARTH_CANVAS_EAST",
      "HEARTH.canvasEast",
      "HEARTH.canvasEastMaterialAtlasSourceMachine",
      "DEXTER_LAB.hearthCanvasEast",
      "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine"
    ]
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
