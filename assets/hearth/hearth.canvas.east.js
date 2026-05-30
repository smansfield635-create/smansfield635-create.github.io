// /assets/hearth/hearth.canvas.east.js
// HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_TNT_v2
// Full-file replacement.
// Canvas East / split-adapter source machine only.
// Purpose:
// - Serve as the East source/intake child for /assets/hearth/hearth.canvas.js.
// - Align East with the active Canvas North parent contract:
//   HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2.
// - Consume the active materials authority and convert it into a canvas atlas packet.
// - Preserve the split-adapter transistor model:
//   - East = source/material-atlas intake.
//   - West = control/admissibility/motion/invalidation.
//   - North = gate/sequencer/checkpoint adapter.
//   - South = drain/output/render/proof.
// - Preserve material truth as upstream authority; this file only samples and carries it.
// - Preserve fallback visibility only as emergency carrier support.
// - Remove the recursive receipt loop between refreshMaterialBridge() and getReceipt().
// - Expose buildAtlas(), sample(), read(), invalidateAtlas(), refreshMaterialBridge(), getReceipt().
// - Run NEWS/Fibonacci synchronization at F13E/F13F source stage.
// Does not own:
// - planet truth
// - elevation truth
// - hydrology truth
// - material truth
// - runtime-table governance
// - route orchestration
// - texture composition
// - sphere rendering
// - visible proof
// - F21
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_TNT_v2";
  const RECEIPT = "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_TRANSISTOR_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_CARDINAL_SPLIT_EAST_CHILD_TNT_v1";

  const PARENT_SPLIT_CONTRACT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2";
  const RETIRED_PARENT_SPLIT_CONTRACT = "HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_TNT_v1";

  const EXPECTED_MATERIAL_CONTRACT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_TNT_v1";
  const EXPECTED_MATERIAL_RECEIPT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_RECEIPT_v1";

  const VERSION = "2026-05-30.hearth-canvas-east-parent-aligned-material-atlas-source-transistor-v2";
  const FILE = "/assets/hearth/hearth.canvas.east.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const MIN_ATLAS_WIDTH = 256;
  const MIN_ATLAS_HEIGHT = 128;
  const MAX_ATLAS_WIDTH = 1024;
  const MAX_ATLAS_HEIGHT = 512;

  const CYCLE_ORDER = "EAST_SOURCE_WEST_CONTROL_NORTH_GATE_SOUTH_DRAIN_CHECKPOINT_EAST_REFRESH";

  const PALETTE = Object.freeze({
    void: [0, 0, 0],
    fallbackWater: [7, 20, 34],
    fallbackDeepWater: [4, 10, 21],
    fallbackShelf: [26, 55, 55],
    fallbackLand: [94, 94, 62],
    fallbackHighland: [116, 110, 84],
    fallbackCoast: [64, 69, 55],
    fallbackWetStone: [41, 50, 47],
    fallbackRidge: [126, 116, 86],
    fallbackCanyon: [48, 38, 30],
    fallbackPeak: [150, 144, 122],
    fallbackSand: [131, 112, 76],
    fallbackScar: [28, 38, 36]
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    parentSplitContract: PARENT_SPLIT_CONTRACT,
    retiredParentSplitContract: RETIRED_PARENT_SPLIT_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    expectedMaterialContract: EXPECTED_MATERIAL_CONTRACT,
    expectedMaterialReceipt: EXPECTED_MATERIAL_RECEIPT,
    version: VERSION,
    file: FILE,
    role: "canvas-east-source-material-atlas-transistor-child-parent-aligned",

    splitAdapterChild: true,
    parentContractAligned: true,
    retiredParentContractSuperseded: true,
    recursiveReceiptLoopRemoved: true,

    transistorAdapterActive: true,
    transistorRole: "source",
    transistorSourceRole: "east-material-atlas-source",
    transistorGateParent: "north-cardinal-split-parent-v2",
    transistorControlPeer: "west-motion-invalidation-control",
    transistorDrainPeer: "south-texture-render-visible-output-drain",
    transistorCurrentFlow: "EAST_SOURCE_TO_SOUTH_DRAIN_THROUGH_NORTH_GATE_WITH_WEST_CONTROL",

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13E_F13F",
    futureFibonacciGate: "F21",
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
    materialAtlasPrimary: false,
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

    upstreamFirstAtlasActive: true,
    atlasSourceActive: true,
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
    sevenContinentVisualFallbackActive: true,
    continentVisualSeedCount: 7,
    continentBlendMode: "max-separated",
    proceduralSixLobeAdditiveFieldRetired: true,
    oceanChannelCutActive: true,
    seaLineTightened: true,
    coastlineSharpeningActive: true,
    sourceColorDemotedToPaletteInfluence: true,
    elevationControlsLandShape: true,
    hydrologyControlsWaterShape: true,
    coastlinesReadFromHydrologyAndMaterials: true,
    landChannelStillReceiverOnly: true,
    canvasStillDoesNotOwnPlanetTruth: true,
    elevationHydrologyFallbackUsed: false,

    cachedAtlasInvalidationAvailable: true,
    atlasInvalidationCount: 0,
    atlasInvalidated: false,
    atlasInvalidationReason: "",

    fallbackSampleAvailable: true,
    fallbackSampleUsedAtRuntime: false,

    lastSampleAt: "",
    lastBuildAt: "",
    updatedAt: nowIso(),

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

  function textureNoise(p, salt = 0) {
    const n1 = hashNoise(p.u || 0, p.v || 0, p.x || 0, salt);
    const n2 = hashNoise(p.v || 0, p.z || 0, p.y || 0, salt + 13);
    const n3 = hashNoise(p.x || 0, p.y || 0, p.z || 0, salt + 31);
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
    return (
      pathRead("HEARTH.materials") ||
      pathRead("HEARTH.materialAuthority") ||
      root.HEARTH_MATERIALS ||
      root.HearthMaterials ||
      (root.DEXTER_LAB && root.DEXTER_LAB.hearthMaterials) ||
      null
    );
  }

  function readMaterialReceipt(authority = getMaterialAuthority()) {
    if (!authority || typeof authority !== "object") return null;

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
    state.materialAtlasPrimary = Boolean(authority);

    state.previousMaterialBridgeSignature = previousSignature;
    state.materialBridgeSignature = signature;
    state.materialBridgeChanged = Boolean(previousSignature && previousSignature !== signature);
    state.updatedAt = state.materialBridgeLastSyncedAt;

    if (state.materialBridgeChanged && options.invalidate === true) {
      invalidateAtlas("material-bridge-signature-changed", { skipDataset: true });
    }

    if (options.updateDataset !== false) {
      updateDataset();
    }

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
      materialAtlasPrimary: state.materialAtlasPrimary,
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
    const westMass = Math.max(0, 0.62 - Math.abs(point.u - 0.18) * 2.1);
    const eastMass = Math.max(0, 0.58 - Math.abs(point.u - 0.72) * 1.8);
    const northMass = Math.max(0, 0.56 - Math.abs(point.v - 0.18) * 2.6);
    const southMass = Math.max(0, 0.54 - Math.abs(point.v - 0.78) * 2.4);
    const centerMass = Math.max(0, 0.48 - Math.hypot(point.u - 0.42, point.v - 0.50) * 1.4);

    const landSignal = clamp01(
      westMass * 0.32 +
      eastMass * 0.24 +
      northMass * 0.18 +
      southMass * 0.16 +
      centerMass * 0.22 +
      equator * 0.12 +
      (n - 0.5) * 0.18
    );

    const coastBand = clamp01(1 - Math.abs(landSignal - 0.42) / 0.18);
    const isLand = landSignal > 0.42;
    const isWater = !isLand;
    const elevation = isLand ? landSignal * 0.58 : -0.18 - (1 - landSignal) * 0.42;

    let rgb = isWater
      ? mixColor(PALETTE.fallbackWater, PALETTE.fallbackDeepWater, clamp01((0.42 - landSignal) * 1.4))
      : mixColor(PALETTE.fallbackLand, PALETTE.fallbackHighland, clamp01(landSignal * 0.46));

    if (coastBand > 0.35) {
      rgb = mixColor(rgb, isWater ? PALETTE.fallbackShelf : PALETTE.fallbackCoast, coastBand * 0.18);
    }

    if (isLand && n > 0.72) {
      rgb = mixColor(rgb, PALETTE.fallbackRidge, clamp01((n - 0.72) * 0.42));
    }

    if (isLand && n < 0.22) {
      rgb = mixColor(rgb, PALETTE.fallbackCanyon, clamp01((0.22 - n) * 0.30));
    }

    return {
      contract: "HEARTH_CANVAS_EAST_EMERGENCY_FALLBACK_CARRIER",
      receipt: "HEARTH_CANVAS_EAST_EMERGENCY_FALLBACK_CARRIER_RECEIPT",
      rgb,
      color: rgb,
      alpha: 1,
      elevation,
      isLand,
      isWater,
      terrainClass: isWater ? (coastBand > 0.34 ? "shallow_water" : "ocean_basin") : (coastBand > 0.34 ? "coast_edge" : "continent_mass"),
      materialClass: isWater ? "fallback.water.carrier" : "fallback.land.carrier",
      continentId: isLand ? "fallback_visible_body" : "open_ocean",
      hydrologyClass: isWater ? "fallback_ocean_basin" : "fallback_coastal_transition",
      waterFillStrength: isWater ? clamp01(0.44 + (0.42 - landSignal) * 0.66) : 0,
      waterDepth: isWater ? clamp01(0.30 + (0.42 - landSignal) * 0.72) : 0,
      waterlineMaterialFeed: coastBand,
      beachMaterialFeed: coastBand * 0.24,
      wetStoneMaterialFeed: coastBand * 0.18,
      hardCoastMaterialFeed: coastBand * 0.10,
      shorelineGrounding: coastBand * 0.30,
      terrainRelief: isLand ? clamp01(n * 0.24 + landSignal * 0.18) : 0,
      ridgeRelief: isLand ? clamp01(n * 0.16) : 0,
      basinShade: isWater ? clamp01((0.42 - landSignal) * 0.40) : 0,
      mountainRangeMaterialFeed: isLand ? clamp01(Math.max(0, n - 0.66) * 0.34) : 0,
      ridgeChainMaterialFeed: isLand ? clamp01(Math.max(0, n - 0.60) * 0.24) : 0,
      canyonCarveMaterialFeed: isLand ? clamp01(Math.max(0, 0.34 - n) * 0.22) : 0,
      canyonDepthMaterialFeed: isLand ? clamp01(Math.max(0, 0.28 - n) * 0.20) : 0,
      sevenContinentFallbackUsed: true,
      fallbackOnly: true,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false
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
      samplePacket.isWater ? PALETTE.fallbackWater : PALETTE.fallbackLand
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

    if (water > 0.10) rgb = mixColor(rgb, PALETTE.fallbackWater, water * 0.08);
    if (water > 0.34) rgb = mixColor(rgb, PALETTE.fallbackDeepWater, water * 0.10);
    if (shelf > 0.12) rgb = mixColor(rgb, PALETTE.fallbackShelf, shelf * 0.10);
    if (coast > 0.12) rgb = mixColor(rgb, PALETTE.fallbackWetStone, coast * 0.08);
    if (relief > 0.14 && !samplePacket.isWater) rgb = mixColor(rgb, PALETTE.fallbackRidge, relief * 0.10);
    if (peak > 0.12 && !samplePacket.isWater) rgb = mixColor(rgb, PALETTE.fallbackPeak, peak * 0.10);
    if (canyon > 0.12) rgb = mixColor(rgb, PALETTE.fallbackCanyon, canyon * 0.12);
    if (scar > 0.10) rgb = mixColor(rgb, PALETTE.fallbackScar, scar * 0.10);

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

    return {
      ...source,
      contract: source.contract || (fallbackUsed ? "HEARTH_CANVAS_EAST_EMERGENCY_FALLBACK_CARRIER" : "UNKNOWN_MATERIAL_SOURCE"),
      receipt: source.receipt || (fallbackUsed ? "HEARTH_CANVAS_EAST_EMERGENCY_FALLBACK_CARRIER_RECEIPT" : "UNKNOWN_MATERIAL_RECEIPT"),
      eastContract: CONTRACT,
      eastReceipt: RECEIPT,
      parentSplitContract: PARENT_SPLIT_CONTRACT,
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
    const authority = getMaterialAuthority();
    return sampleWithAuthority(point, authority, {
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
    canvas.dataset.hearthCanvasEastParentSplitContract = PARENT_SPLIT_CONTRACT;
    canvas.dataset.hearthCanvasEastRetiredParentSplitContract = RETIRED_PARENT_SPLIT_CONTRACT;
    canvas.dataset.hearthCanvasEastParentContractAligned = "true";
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

    state.updatedAt = state.atlasBuildStartedAt;
  }

  function countSample(material, classSet) {
    state.atlasTotalSampleCount += 1;

    if (material.canonicalMaterialSample) state.atlasCanonicalMaterialSampleCount += 1;
    if (material.materialSample) state.atlasMaterialSampleCount += 1;
    if (material.elevationHydrologySample) state.atlasElevationHydrologySampleCount += 1;
    if (material.fallbackSample) state.atlasFallbackSampleCount += 1;
    if (material.unknownUpstreamSample) state.atlasUnknownUpstreamSampleCount += 1;
    if (material.isLand) state.atlasLandSampleCount += 1;
    if (material.isWater) state.atlas
