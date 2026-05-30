// /assets/hearth/hearth.canvas.east.js
// HEARTH_CANVAS_EAST_OLD_TERRAIN_MATERIAL_LANGUAGE_DEGOLFING_TNT_v4
// Full-file replacement.
// Canvas East / source intake and atlas formation only.
// Purpose:
// - Preserve East v2 load-reduction mechanics.
// - Keep authority resolution cached once per atlas build.
// - Keep material bridge refresh cached once per atlas build.
// - Preserve 512x256 default atlas pressure reduction.
// - Retire golf-course material language from Hearth.
// - Suppress manicured green fairway interiors.
// - Convert pale round “sand trap” highlands into irregular exposed mineral / stone / dry basin residues.
// - Convert smooth coast rings into ancient waterline scars, shelf drops, eroded shore traces, and dried hydrosphere boundaries.
// - Preserve detail growth without moving truth ownership into canvas.
// - Keep NEWS/Fibonacci synchronization metadata aligned to F13 canvas evidence flow.
// Does not own:
// - canvas drawing
// - drag / zoom interaction
// - visible proof
// - F21
// - route readiness
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_EAST_OLD_TERRAIN_MATERIAL_LANGUAGE_DEGOLFING_TNT_v4";
  const RECEIPT = "HEARTH_CANVAS_EAST_OLD_TERRAIN_MATERIAL_LANGUAGE_DEGOLFING_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE_TNT_v2";
  const VERSION = "2026-05-30.hearth-canvas-east-old-terrain-material-language-degolfing-v4";
  const FILE = "/assets/hearth/hearth.canvas.east.js";

  const EXPECTED_MATERIAL_CONTRACT = "HEARTH_MATERIALS_ISLAND_ELEVATION_BEACH_RELIEF_CONSUMER_TNT_v1";
  const EXPECTED_MATERIAL_RECEIPT = "HEARTH_MATERIALS_ISLAND_ELEVATION_BEACH_RELIEF_CONSUMER_RECEIPT_v1";

  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const MIN_ATLAS_WIDTH = 256;
  const MIN_ATLAS_HEIGHT = 128;
  const MAX_ATLAS_WIDTH = 1024;
  const MAX_ATLAS_HEIGHT = 512;
  const ROWS_PER_CHUNK_DEFAULT = 4;

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const SEVEN_CONTINENT_SEEDS = Object.freeze([
    { id: "northwest-continent", index: 1, u: 0.17, v: 0.34, rx: 0.115, ry: 0.205, rot: -24, weight: 1.02, seed: 101 },
    { id: "north-tethys-continent", index: 2, u: 0.36, v: 0.22, rx: 0.125, ry: 0.155, rot: 18, weight: 0.94, seed: 202 },
    { id: "west-equatorial-continent", index: 3, u: 0.38, v: 0.55, rx: 0.135, ry: 0.205, rot: 8, weight: 1.00, seed: 303 },
    { id: "central-south-continent", index: 4, u: 0.55, v: 0.68, rx: 0.145, ry: 0.185, rot: -16, weight: 0.92, seed: 404 },
    { id: "east-continent", index: 5, u: 0.66, v: 0.38, rx: 0.125, ry: 0.185, rot: 22, weight: 0.98, seed: 505 },
    { id: "southeast-island-continent", index: 6, u: 0.84, v: 0.62, rx: 0.110, ry: 0.150, rot: -28, weight: 0.78, seed: 606 },
    { id: "polar-crown-continent", index: 7, u: 0.06, v: 0.17, rx: 0.155, ry: 0.095, rot: 0, weight: 0.70, seed: 707 }
  ]);

  const OLD_TERRAIN_PALETTE = Object.freeze({
    deepWater: [4, 18, 38],
    basinWater: [7, 31, 58],
    shelfWater: [21, 72, 92],
    scarWater: [18, 48, 52],
    wetStone: [47, 62, 54],
    oldMoss: [45, 75, 48],
    scrub: [75, 89, 52],
    oxidizedLowland: [91, 78, 49],
    drySoil: [112, 92, 57],
    weatheredStone: [132, 119, 86],
    mineralScar: [153, 139, 102],
    saltChalk: [172, 162, 132],
    darkRidge: [33, 42, 37],
    shadowCut: [13, 24, 28]
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "canvas-east-old-terrain-material-language-degolfing",

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    cycleOrder: "EAST_WEST_NORTH_SOUTH_CHECKPOINT_EAST",

    authorityResolutionCachedPerAtlasBuild: true,
    materialBridgeRefreshCachedPerAtlasBuild: true,
    perPixelAuthorityResolutionRetired: true,
    perPixelMaterialBridgeRefreshRetired: true,
    defaultAtlasReduced: true,
    defaultAtlasWidth: DEFAULT_ATLAS_WIDTH,
    defaultAtlasHeight: DEFAULT_ATLAS_HEIGHT,
    optionalHigherLodSupported: true,

    oldTerrainMaterialLanguageActive: true,
    golfCourseGreenSuppressed: true,
    manicuredGrassReadRetired: true,
    flatFairwayInteriorSuppressed: true,
    materialColorComesFromTerrain: true,
    irregularHighlandMaterialActive: true,
    roundSandTrapHighlandsRetired: true,
    mineralScarHighlandsActive: true,
    highlandEdgeBreakupActive: true,
    coastalScarMaterialActive: true,
    ancientWaterlineTraceActive: true,
    shelfDropShadowActive: true,
    coastlineRingReadSuppressed: true,
    materialEdgeBreakupActive: true,
    deterministicTerrainNoiseActive: true,
    smoothConcentricBandingReduced: true,
    atlasFrameStable: true,
    terrainVeiningActive: true,
    dryScarThreadsActive: true,
    mineralSeamVariationActive: true,

    materialReceiptBridgeActive: true,
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
    materialContractSignature: "",
    previousMaterialContractSignature: "",
    materialContractSignatureChanged: false,
    materialAtlasPrimary: false,
    materialSampleSuccessCount: 0,
    materialSampleFailureCount: 0,
    materialReliefFeedsDetected: false,
    materialElevationContractMatchesActive: false,

    upstreamFirstAtlasActive: true,
    canonicalMaterialAuthorityPresent: false,
    canonicalMaterialConsumed: false,
    canonicalMaterialColorPrimary: false,
    canonicalMaterialShapePrimary: false,
    materialsPrimaryWhenValid: true,
    rawSourceColorDemotedToPaletteInfluence: true,

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
    landChannelStillReceiverOnly: true,
    elevationHydrologyFallbackUsed: false,

    atlasCanvas: null,
    atlasContext: null,
    atlasWidth: 0,
    atlasHeight: 0,
    atlasCanonicalMaterialSampleCount: 0,
    atlasElevationHydrologySampleCount: 0,
    atlasFallbackSampleCount: 0,
    atlasTotalSampleCount: 0,
    atlasInvalidated: false,
    atlasInvalidationReason: "",
    atlasBuildStarted: false,
    atlasBuildComplete: false,
    atlasBuildProgress: 0,
    atlasBuildRowsPerChunk: ROWS_PER_CHUNK_DEFAULT,
    atlasBuildStartedAt: "",
    atlasBuildCompletedAt: "",
    atlasBuildElapsedMs: 0,
    atlasBuildYieldCount: 0,

    oldTerrainSampleCount: 0,
    golfSuppressionSampleCount: 0,
    mineralScarSampleCount: 0,
    coastalScarSampleCount: 0,
    dryScarThreadSampleCount: 0,
    terrainVeinSampleCount: 0,

    sourceContextCreated: false,
    sourceContextCreatedAt: "",
    sourceContextAuthorityResolutionCount: 0,
    sourceContextMaterialBridgeRefreshCount: 0,
    sourceContextSampleCount: 0,

    latestMachinePacket: null,
    errors: [],
    updatedAt: nowIso(),

    ownsSourceIntake: true,
    ownsAtlasFormation: true,
    ownsCanvasDrawing: false,
    ownsInteraction: false,
    ownsVisibleProof: false,
    ownsF21: false,
    ownsRouteReadiness: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return ""; }
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
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
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
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_error) { return Array.isArray(value) ? value.slice() : { ...value }; }
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

  function ridgeNoise(x, y, seed = 1, octaves = 4) {
    const n = fbm(x, y, seed, octaves);
    return 1 - Math.abs(n - 0.5) * 2;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function signedWrapDelta(a, b) {
    let d = a - b;
    if (d > 0.5) d -= 1;
    if (d < -0.5) d += 1;
    return d;
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

  function createCanvas(width, height) {
    if (!doc) throw new Error("Document unavailable for atlas canvas.");

    const canvas = doc.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!context) throw new Error("Atlas 2D context unavailable.");

    return { canvas, context };
  }

  function yieldFrame() {
    state.atlasBuildYieldCount += 1;
    return new Promise((resolve) => {
      if (typeof root.requestAnimationFrame === "function") root.requestAnimationFrame(resolve);
      else root.setTimeout(resolve, 0);
    });
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      message: error && error.message ? error.message : String(error || ""),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    if (state.errors.length > 80) state.errors.splice(0, state.errors.length - 80);

    state.updatedAt = item.at;
    updateDocumentDataset();
    return item;
  }

  function resolveSource(names) {
    for (const name of names) {
      if (root[name] && isObject(root[name])) return root[name];
      if (root.HEARTH && root.HEARTH[name] && isObject(root.HEARTH[name])) return root.HEARTH[name];
      if (root.DEXTER_LAB && root.DEXTER_LAB[name] && isObject(root.DEXTER_LAB[name])) return root.DEXTER_LAB[name];
    }
    return null;
  }

  function readMaterialAuthority() {
    return (
      root.HEARTH_MATERIALS ||
      root.HearthMaterials ||
      (root.HEARTH && root.HEARTH.materials) ||
      (root.DEXTER_LAB && root.DEXTER_LAB.hearthMaterials) ||
      resolveSource(["materials", "hearthMaterials"]) ||
      null
    );
  }

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        if (isObject(receipt)) return receipt;
      } catch (error) {
        recordError("MATERIAL_RECEIPT_READ_FAILED", error);
      }
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receiptData)) return authority.receiptData;
    if (isObject(authority.receipt)) return authority.receipt;

    if (authority.contract || authority.version) {
      return {
        contract: authority.contract || "",
        receipt: typeof authority.receipt === "string" ? authority.receipt : "",
        previousContract: authority.previousContract || "",
        baselineContract: authority.baselineContract || "",
        version: authority.version || "",
        role: authority.role || ""
      };
    }

    return null;
  }

  function readString(source, keys, fallback = "") {
    if (!source || !isObject(source)) return fallback;
    for (const key of keys) {
      const value = source[key];
      if (value !== undefined && value !== null && String(value).length) return String(value);
    }
    return fallback;
  }

  function readNumber(source, keys, fallback = NaN) {
    if (!source || !isObject(source)) return fallback;
    for (const key of keys) {
      const n = Number(source[key]);
      if (Number.isFinite(n)) return n;
    }
    return fallback;
  }

  function readBoolean(source, keys, fallback = null) {
    if (!source || !isObject(source)) return fallback;
    for (const key of keys) {
      const value = source[key];
      if (typeof value === "boolean") return value;
      if (value === "true") return true;
      if (value === "false") return false;
    }
    return fallback;
  }

  function materialSignatureFrom(authority, receipt) {
    const source = receipt || authority || {};
    return [
      readString(source, ["contract"], authority && authority.contract ? authority.contract : ""),
      readString(source, ["receipt"], authority && authority.receipt ? authority.receipt : ""),
      readString(source, ["version"], authority && authority.version ? authority.version : ""),
      readString(source, ["activeElevationContractRequired", "requiredElevationContract"], ""),
      String(Boolean(readBoolean(source, ["supportsIslandElevationMaterialConsumer"], false))),
      String(Boolean(readBoolean(source, ["supportsRidgeBandMaterialFeed"], false))),
      String(Boolean(readBoolean(source, ["supportsInlandReliefMaterialFeed"], false))),
      CONTRACT
    ].join("|");
  }

  function refreshMaterialBridge() {
    const authority = readMaterialAuthority();
    const receipt = readAuthorityReceipt(authority);
    const source = receipt || authority || {};
    const signature = materialSignatureFrom(authority, receipt);
    const previous = state.materialContractSignature;

    state.sourceContextMaterialBridgeRefreshCount += 1;
    state.canonicalMaterialAuthorityPresent = Boolean(authority);
    state.materialNestedReceiptAvailable = Boolean(receipt);

    state.materialContract = readString(source, ["contract"], authority && authority.contract ? authority.contract : "");
    state.materialReceipt = readString(source, ["receipt"], authority && authority.receipt ? authority.receipt : "");
    state.materialPreviousContract = readString(source, ["previousContract"], "");
    state.materialBaselineContract = readString(source, ["baselineContract"], "");
    state.materialVersion = readString(source, ["version"], authority && authority.version ? authority.version : "");
    state.materialRole = readString(source, ["role"], "");

    state.materialContractMatchesExpected = state.materialContract === EXPECTED_MATERIAL_CONTRACT;
    state.materialReceiptMatchesExpected = state.materialReceipt === EXPECTED_MATERIAL_RECEIPT;
    state.materialContractSignatureChanged = Boolean(previous && signature && previous !== signature);
    state.previousMaterialContractSignature = previous || "";
    state.materialContractSignature = signature || previous || "";

    state.materialReliefFeedsDetected = Boolean(
      readBoolean(source, ["supportsRidgeBandMaterialFeed"], false) ||
      readBoolean(source, ["supportsInlandReliefMaterialFeed"], false) ||
      readBoolean(source, ["ridgeBandMaterialFeedActive"], false) ||
      readBoolean(source, ["inlandReliefMaterialFeedActive"], false)
    );

    state.materialElevationContractMatchesActive = Boolean(
      readBoolean(source, ["elevationContractMatchesActive"], false) ||
      readBoolean(source, ["consumesActiveElevationContract"], false) ||
      readString(source, ["activeElevationContractRequired", "requiredElevationContract"], "") === "HEARTH_ELEVATION_ISLAND_COASTAL_FEATURE_CONSUMPTION_TNT_v1"
    );

    state.updatedAt = nowIso();
    updateDocumentDataset();

    return {
      authority,
      receipt,
      source,
      signature,
      changed: state.materialContractSignatureChanged,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected
    };
  }

  function createSourceContext(options = {}) {
    const materialBridge = refreshMaterialBridge();

    const sourceContext = {
      createdAt: nowIso(),
      materialBridge,
      materialsAuthority: materialBridge.authority || null,
      hydrologyAuthority: resolveSource(["HEARTH_HYDROLOGY", "hydrology", "hearthHydrology"]),
      elevationAuthority: resolveSource(["HEARTH_ELEVATION", "elevation", "hearthElevation"]),
      compositionAuthority: resolveSource(["HEARTH_COMPOSITION", "composition", "hearthComposition"]),
      hexAuthority: resolveSource(["HEARTH_HEX_FOUR_PAIR_AUTHORITY", "hexAuthority", "hearthHexAuthority"]),
      hexSurface: resolveSource(["HEARTH_HEX_SURFACE", "hexSurface", "hearthHexSurface"]),
      width: Math.max(MIN_ATLAS_WIDTH, Math.min(MAX_ATLAS_WIDTH, Math.round(safeNumber(options.width, DEFAULT_ATLAS_WIDTH)))),
      height: Math.max(MIN_ATLAS_HEIGHT, Math.min(MAX_ATLAS_HEIGHT, Math.round(safeNumber(options.height, DEFAULT_ATLAS_HEIGHT)))),
      rowsPerChunk: Math.max(1, Math.round(safeNumber(options.rowsPerChunk, ROWS_PER_CHUNK_DEFAULT))),
      oldTerrainMaterialLanguageActive: true,
      authorityResolutionCachedPerAtlasBuild: true,
      materialBridgeRefreshCachedPerAtlasBuild: true,
      perPixelAuthorityResolutionRetired: true,
      perPixelMaterialBridgeRefreshRetired: true
    };

    state.sourceContextCreated = true;
    state.sourceContextCreatedAt = sourceContext.createdAt;
    state.sourceContextAuthorityResolutionCount += 1;
    state.canonicalMaterialAuthorityPresent = Boolean(sourceContext.materialsAuthority);

    return sourceContext;
  }

  function sampleExternalAuthority(authority, point) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "sample",
      "read",
      "get",
      "getCell",
      "sampleAt",
      "readAt",
      "getMaterial",
      "getSurfaceMaterial",
      "resolve",
      "resolveMaterial"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method](point);
        if (isObject(result)) return result;
      } catch (_error) {}

      try {
        const result = authority[method](point.u, point.v, point.lon, point.lat);
        if (isObject(result)) return result;
      } catch (_error2) {}

      try {
        const result = authority[method](point.x, point.y, point.z);
        if (isObject(result)) return result;
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

  function includesAny(text, words) {
    const source = String(text || "").toLowerCase();
    return words.some((word) => source.includes(word));
  }

  function materialClassText(packet) {
    return [
      readString(packet, ["terrainClass"], ""),
      readString(packet, ["worldTerrainClass"], ""),
      readString(packet, ["expandedTerrainClass"], ""),
      readString(packet, ["semanticTerrainClass"], ""),
      readString(packet, ["compatibilityTerrainClass"], ""),
      readString(packet, ["materialClass"], ""),
      readString(packet, ["surfaceFamily"], ""),
      readString(packet, ["visualClass"], ""),
      readString(packet, ["hydrologyClass"], ""),
      readString(packet, ["waterBoundaryClass"], ""),
      readString(packet, ["coastBoundaryClass"], "")
    ].join(" ").toLowerCase();
  }

  function classifyCanonicalMaterial(packet) {
    const color = extractColor(packet);
    const classText = materialClassText(packet);

    const isWaterBool = readBoolean(packet, ["isWater", "isWaterOccupied", "waterFill"], null);
    const isLandBool = readBoolean(packet, ["isLand"], null);

    const waterFeed = clamp01(Math.max(
      readNumber(packet, ["waterAlpha"], 0),
      readNumber(packet, ["waterFillMaterialFeed"], 0),
      readNumber(packet, ["waterFillStrength"], 0),
      readNumber(packet, ["waterDepthShade"], 0),
      readNumber(packet, ["waterDepth"], 0),
      readNumber(packet, ["coordinateOceanBasinMaterialFeed"], 0)
    ));

    const landFeed = clamp01(Math.max(
      readNumber(packet, ["landAlpha"], 0),
      readNumber(packet, ["landDensity"], 0),
      readNumber(packet, ["landPotential"], 0),
      readNumber(packet, ["coordinateLandBodyMaterialFeed"], 0),
      readNumber(packet, ["coordinateBodyInteriorMaterialFeed"], 0),
      readNumber(packet, ["bodySeatPressure"], 0)
    ));

    const textSaysWater = includesAny(classText, [
      "water", "ocean", "shelf", "submerged", "hydro", "marine", "sea", "strait",
      "shallow", "deep", "bay", "inlet"
    ]);

    const textSaysLand = includesAny(classText, [
      "land", "continent", "mountain", "plateau", "canyon", "cliff", "rainforest",
      "tundra", "desert", "summit", "ridge", "coast", "beach", "island", "peninsula",
      "stone", "mineral", "soil", "moss", "scrub"
    ]);

    let isWater = Boolean(isWaterBool === true || waterFeed > 0.42 || (textSaysWater && !textSaysLand));
    let isLand = Boolean(isLandBool === true || landFeed > 0.34 || (textSaysLand && !isWater));

    if (isWater && isLand) {
      if (waterFeed > landFeed + 0.08) isLand = false;
      else if (landFeed > waterFeed + 0.08) isWater = false;
    }

    const valid = Boolean(packet && color && (isWater || isLand || classText.length > 0));
    const elevation = normalizeElevation(readNumber(packet, ["elevation", "height", "altitude"], NaN));

    const shore = clamp01(Math.max(
      readNumber(packet, ["shore"], 0),
      readNumber(packet, ["shorelineGrounding"], 0),
      readNumber(packet, ["waterlineMaterialFeed"], 0),
      readNumber(packet, ["beachMaterialFeed"], 0),
      readNumber(packet, ["nearSeaLevelStrength"], 0)
    ));

    const shelf = clamp01(Math.max(
      readNumber(packet, ["shelf"], 0),
      readNumber(packet, ["shelfTransition"], 0),
      readNumber(packet, ["shallowShelfMaterialFeed"], 0),
      readNumber(packet, ["sandShelfMaterialFeed"], 0),
      readNumber(packet, ["shelfPotential"], 0)
    ));

    const relief = clamp01(Math.max(
      readNumber(packet, ["terrainRelief"], 0),
      readNumber(packet, ["ridgeRelief"], 0),
      readNumber(packet, ["elevationReliefMaterialFeed"], 0),
      readNumber(packet, ["coordinateSummitMaterialFeed"], 0),
      readNumber(packet, ["ridgeBandMaterialFeed"], 0),
      readNumber(packet, ["inlandReliefMaterialFeed"], 0),
      readNumber(packet, ["islandReliefMaterialFeed"], 0)
    ));

    return {
      valid,
      color,
      classText,
      isWater,
      isLand: isLand && !isWater,
      waterFeed,
      landFeed,
      elevation,
      shore,
      shelf,
      relief,
      visualClass: readString(packet, ["visualClass", "terrainClass", "surfaceFamily"], isWater ? "canonical-material-water" : "canonical-material-land"),
      packet
    };
  }

  function continentLobe(u, v, seed) {
    const du = signedWrapDelta(u, seed.u);
    const dv = v - seed.v;
    const angle = seed.rot * Math.PI / 180;
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);

    const ru = du * ca - dv * sa;
    const rv = du * sa + dv * ca;

    const core = Math.exp(-((ru / seed.rx) ** 2 + (rv / seed.ry) ** 2));
    const shoulder = Math.exp(-((ru / (seed.rx * 1.75)) ** 2 + (rv / (seed.ry * 1.55)) ** 2)) * 0.34;
    const edgeNoise = fbm(u * 8.5 + seed.seed * 0.13, v * 7.3 - seed.seed * 0.07, seed.seed, 4);
    const biteNoise = fbm(u * 15.0 - seed.seed * 0.03, v * 13.0 + seed.seed * 0.04, seed.seed + 9, 4);

    return clamp01((core + shoulder) * seed.weight * (0.82 + edgeNoise * 0.26 - biteNoise * 0.12));
  }

  function sevenContinentField(u, v, latBand) {
    const warpA = fbm(u * 2.2 + 7.0, v * 2.0 - 3.0, 111, 4) - 0.5;
    const warpB = fbm(u * 1.9 - 4.0, v * 2.4 + 2.2, 222, 4) - 0.5;
    const wu = (u + warpA * 0.032 + 1) % 1;
    const wv = clamp01(v + warpB * 0.028);

    const values = SEVEN_CONTINENT_SEEDS
      .map((seed) => ({ seed, value: continentLobe(wu, wv, seed) }))
      .sort((a, b) => b.value - a.value);

    const primary = values[0] || { value: 0, seed: null };
    const secondary = values[1] || { value: 0, seed: null };

    const regional = fbm(u * 5.8 - 1.5, v * 4.8 + 2.8, 333, 5);
    const fine = fbm(u * 18.0 + 4.7, v * 14.0 - 2.8, 444, 4);
    const ridge = ridgeNoise(u * 11.0 + 7.1, v * 8.6 - 6.2, 555, 4);
    const basin = ridgeNoise(u * 4.2 - 3.2, v * 3.5 + 5.6, 666, 4);

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
      Math.pow(latBand, 2.2) * 0.065
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
      fine
    };
  }

  function oldTerrainMaterialize(point, source) {
    const p = OLD_TERRAIN_PALETTE;

    const u = point.u;
    const v = point.v;
    const latBand = Math.abs(point.lat) / 90;
    const elevation = clamp01(source.elevation);
    const landSignal = clamp01(source.landSignal);
    const waterSignal = clamp01(source.waterSignal);
    const shore = clamp01(source.shore);
    const shelf = clamp01(source.shelf);
    const highland = clamp01(source.highland);
    const mountain = clamp01(source.mountain);

    const broad = fbm(u * 6.7 + 19.2, v * 5.3 - 4.8, 2401, 5);
    const grain = fbm(u * 38.0 - 11.4, v * 29.0 + 3.2, 2402, 4);
    const mineral = ridgeNoise(u * 22.0 + 2.1, v * 17.0 - 8.4, 2403, 4);
    const scar = ridgeNoise(u * 34.0 - 1.9, v * 21.0 + 7.5, 2404, 4);
    const vein = ridgeNoise(u * 54.0 + 8.8, v * 39.0 - 10.2, 2405, 3);
    const dryThread = smoothstep(0.67, 0.92, vein) * smoothstep(0.24, 0.88, landSignal);
    const highlandBreak = smoothstep(0.45, 0.92, mineral) * smoothstep(0.34, 0.98, highland + mountain * 0.58);
    const coastalScar = shore * (0.48 + scar * 0.52);
    const shelfDrop = shelf * smoothstep(0.38, 0.92, scar);

    let rgb;
    let visualClass;

    if (source.isWater) {
      const depth = clamp01(waterSignal * 0.76 + (1 - shelf) * 0.24);
      rgb = mixRgb(p.shelfWater, p.deepWater, depth);
      rgb = mixRgb(rgb, p.basinWater, source.oceanChannelCut * 0.62);
      rgb = mixRgb(rgb, p.scarWater, shelfDrop * 0.55);
      rgb = mixRgb(rgb, p.shadowCut, Math.max(source.oceanChannelCut, 1 - landSignal) * 0.22);
      visualClass = shelfDrop > 0.35 ? "old-hydrosphere-shelf-drop-water" : "old-basin-water";
      if (shelfDrop > 0.18) state.coastalScarSampleCount += 1;
    } else {
      const mossWeight = clamp01((1 - highland * 0.75) * (1 - latBand * 0.52) * (0.26 + broad * 0.34));
      const scrubWeight = clamp01((1 - highland * 0.45) * (0.32 + grain * 0.28));
      const oxidizedWeight = clamp01(0.28 + broad * 0.34 + latBand * 0.18);
      const stoneWeight = clamp01(highland * 0.62 + mountain * 0.72 + mineral * 0.24);
      const scarWeight = clamp01(highlandBreak * 0.72 + coastalScar * 0.38 + dryThread * 0.26);

      rgb = mixRgb(p.oxidizedLowland, p.oldMoss, mossWeight * 0.42);
      rgb = mixRgb(rgb, p.scrub, scrubWeight * 0.36);
      rgb = mixRgb(rgb, p.drySoil, oxidizedWeight * 0.40);
      rgb = mixRgb(rgb, p.weatheredStone, stoneWeight * 0.52);
      rgb = mixRgb(rgb, p.mineralScar, scarWeight * 0.48);
      rgb = mixRgb(rgb, p.saltChalk, mountain * highlandBreak * 0.34);
      rgb = mixRgb(rgb, p.darkRidge, source.oceanChannelCut * 0.20 + scar * 0.08);
      rgb = mixRgb(rgb, p.mineralScar, coastalScar * 0.36);

      if (highlandBreak > 0.30) state.mineralScarSampleCount += 1;
      if (coastalScar > 0.28) state.coastalScarSampleCount += 1;
      if (dryThread > 0.25) state.dryScarThreadSampleCount += 1;
      if (vein > 0.64) state.terrainVeinSampleCount += 1;

      if (mountain > 0.42 || highlandBreak > 0.45) visualClass = "old-exposed-mineral-highland";
      else if (coastalScar > 0.32) visualClass = "old-waterline-scar-land";
      else if (dryThread > 0.28) visualClass = "old-dry-scar-thread-land";
      else visualClass = "old-scrub-stone-lowland";
    }

    const nonManicuredJitter = (grain - 0.5) * 18 + (mineral - 0.5) * 13 + dryThread * 16 - coastalScar * 8;
    const greenSuppression = source.isWater ? 0 : clamp01((rgb[1] - Math.max(rgb[0], rgb[2])) / 80);
    const fairwaySuppression = greenSuppression * smoothstep(0.22, 0.92, landSignal) * (1 - highland * 0.34);

    if (fairwaySuppression > 0.08) {
      state.golfSuppressionSampleCount += 1;
      rgb = mixRgb(rgb, p.oxidizedLowland, fairwaySuppression * 0.48);
      rgb = mixRgb(rgb, p.weatheredStone, fairwaySuppression * 0.20);
    }

    rgb = [
      clamp(Math.round(rgb[0] + nonManicuredJitter * 0.66), 0, 255),
      clamp(Math.round(rgb[1] + nonManicuredJitter * 0.42 - fairwaySuppression * 18), 0, 255),
      clamp(Math.round(rgb[2] + nonManicuredJitter * 0.34 - fairwaySuppression * 6), 0, 255)
    ];

    state.oldTerrainSampleCount += 1;

    return {
      rgb,
      visualClass,
      oldTerrainMaterialLanguageActive: true,
      golfCourseGreenSuppressed: true,
      manicuredGrassReadRetired: true,
      flatFairwayInteriorSuppressed: true,
      irregularHighlandMaterialActive: true,
      mineralScarHighlandsActive: true,
      coastalScarMaterialActive: true,
      ancientWaterlineTraceActive: true,
      shelfDropShadowActive: true,
      terrainVeiningActive: vein > 0.64,
      dryScarThreadsActive: dryThread > 0.25,
      materialEdgeBreakupActive: true
    };
  }

  function fallbackMaterial(point, visualField, latBand, mode = "emergency-seven-continent-fallback") {
    const elevation = visualField.elevation;
    const landSignal = smoothstep(visualField.seaLine - 0.035, visualField.seaLine + 0.03, elevation);
    const waterSignal = 1 - landSignal;
    const isWater = waterSignal >= landSignal;
    const shore = clamp01(1 - Math.abs(waterSignal - landSignal) * 5.1);
    const shelf = isWater ? clamp01(shore * 0.88 + (1 - waterSignal) * 0.22) : 0;
    const highland = clamp01((elevation - 0.56) * 2.4);
    const mountain = clamp01((elevation - 0.67) * 3.8);

    const source = {
      isWater,
      isLand: !isWater,
      waterSignal,
      landSignal,
      elevation,
      shore,
      shelf,
      highland,
      mountain,
      oceanChannelCut: visualField.oceanChannelCut
    };

    const terrain = oldTerrainMaterialize(point, source);

    return {
      ...point,
      rgb: terrain.rgb,
      visualClass: `${mode}-${terrain.visualClass}`,
      isWater,
      isLand: !isWater,
      waterSignal,
      landSignal,
      elevation,
      seaLine: visualField.seaLine,
      shore,
      shelf,
      highland,
      mountain,
      continentId: visualField.continentId,
      continentIndex: visualField.continentIndex,
      continentSignal: visualField.continentSignal,
      secondaryContinentSignal: visualField.secondaryContinentSignal,
      oceanChannelCut: visualField.oceanChannelCut,
      source: mode,
      canonicalMaterialConsumed: false,
      elevationHydrologyFallbackUsed: mode === "elevation-hydrology-lite-fallback",
      sevenContinentFallbackUsed: mode !== "elevation-hydrology-lite-fallback",
      sevenContinentFallbackSuppressedByUpstream: mode === "elevation-hydrology-lite-fallback",
      oldTerrainMaterialLanguageActive: terrain.oldTerrainMaterialLanguageActive,
      golfCourseGreenSuppressed: terrain.golfCourseGreenSuppressed,
      mineralScarHighlandsActive: terrain.mineralScarHighlandsActive,
      coastalScarMaterialActive: terrain.coastalScarMaterialActive
    };
  }

  function samplePlanetMaterialWithContext(sourceContext, u, v) {
    const context = sourceContext || createSourceContext();
    state.sourceContextSampleCount += 1;

    const lon = u * 360 - 180;
    const lat = 90 - v * 180;
    const vector = lonLatToVector(lon, lat);
    const point = { u, v, lon, lat, x: vector.x, y: vector.y, z: vector.z };
    const latBand = Math.abs(lat) / 90;

    const materialSample = sampleExternalAuthority(context.materialsAuthority, point);
    const hydroSample = sampleExternalAuthority(context.hydrologyAuthority, point);
    const elevationSample = sampleExternalAuthority(context.elevationAuthority, point);
    const compositionSample = sampleExternalAuthority(context.compositionAuthority, point);
    const hexSample =
      sampleExternalAuthority(context.hexAuthority, point) ||
      sampleExternalAuthority(context.hexSurface, point);

    const material = classifyCanonicalMaterial(materialSample);
    const visualField = sevenContinentField(u, v, latBand);

    if (material.valid) {
      state.materialSampleSuccessCount += 1;
      state.canonicalMaterialAuthorityPresent = Boolean(context.materialsAuthority);
      state.canonicalMaterialConsumed = true;
      state.canonicalMaterialColorPrimary = true;
      state.canonicalMaterialShapePrimary = true;
      state.materialAtlasPrimary = true;
      state.sevenContinentFallbackSuppressedByUpstream = true;

      const elevation = Number.isFinite(material.elevation) ? material.elevation : visualField.elevation;
      const landSignal = material.isWater ? clamp01(1 - Math.max(0.58, material.waterFeed)) : Math.max(0.58, material.landFeed);
      const waterSignal = material.isWater ? Math.max(0.58, material.waterFeed) : clamp01(1 - Math.max(0.58, material.landFeed));
      const highland = clamp01(Math.max(material.relief, (elevation - 0.56) * 2.4));
      const mountain = clamp01((elevation - 0.67) * 3.8 + material.relief * 0.28);

      const terrain = oldTerrainMaterialize(point, {
        isWater: material.isWater,
        isLand: !material.isWater,
        waterSignal,
        landSignal,
        elevation,
        shore: material.shore,
        shelf: material.shelf,
        highland,
        mountain,
        oceanChannelCut: visualField.oceanChannelCut
      });

      return {
        ...point,
        rgb: terrain.rgb,
        visualClass: `canonical-${terrain.visualClass}`,
        isWater: material.isWater,
        isLand: !material.isWater,
        waterSignal,
        landSignal,
        elevation,
        seaLine: visualField.seaLine,
        shore: material.shore,
        shelf: material.shelf,
        highland,
        mountain,
        continentId: readString(material.packet, ["continentId"], visualField.continentId),
        continentIndex: readNumber(material.packet, ["continentIndex"], visualField.continentIndex),
        continentSignal: Math.max(readNumber(material.packet, ["continentPotential", "bodySeatPressure"], 0), visualField.continentSignal),
        secondaryContinentSignal: visualField.secondaryContinentSignal,
        oceanChannelCut: visualField.oceanChannelCut,
        source: "canonical-material-old-terrain-translation",
        canonicalMaterialConsumed: true,
        elevationHydrologyFallbackUsed: false,
        sevenContinentFallbackUsed: false,
        sevenContinentFallbackSuppressedByUpstream: true,
        upstreamSampleAvailable: Boolean(materialSample || hydroSample || elevationSample || compositionSample || hexSample),
        oldTerrainMaterialLanguageActive: true,
        golfCourseGreenSuppressed: true,
        materialColorComesFromTerrain: true
      };
    }

    if (context.materialsAuthority) {
      state.materialSampleFailureCount += 1;
    }

    const upstreamUsable = Boolean(isObject(hydroSample) || isObject(elevationSample) || isObject(compositionSample) || isObject(hexSample));

    if (upstreamUsable) {
      state.elevationHydrologyFallbackUsed = true;
      state.sevenContinentFallbackSuppressedByUpstream = true;
      const fallback = fallbackMaterial(point, visualField, latBand, "elevation-hydrology-lite-fallback");
      fallback.upstreamSampleAvailable = true;
      return fallback;
    }

    state.sevenContinentFallbackUsed = true;
    const emergency = fallbackMaterial(point, visualField, latBand, "emergency-seven-continent-fallback");
    emergency.upstreamSampleAvailable = false;
    return emergency;
  }

  async function buildAtlas(options = {}) {
    if (state.atlasBuildStarted && !state.atlasBuildComplete && options.allowConcurrent !== true) {
      return state.latestMachinePacket || {
        contract: CONTRACT,
        receipt: RECEIPT,
        pending: true,
        reason: "atlas-build-already-active",
        receiptPacket: getReceipt()
      };
    }

    const sourceContext = createSourceContext(options);
    const width = sourceContext.width;
    const height = sourceContext.height;
    const rowsPerChunk = sourceContext.rowsPerChunk;

    const working = createCanvas(width, height);
    const canvas = working.canvas;
    const context = working.context;
    const image = context.createImageData(width, height);

    state.atlasBuildStarted = true;
    state.atlasBuildComplete = false;
    state.atlasBuildProgress = 0;
    state.atlasBuildRowsPerChunk = rowsPerChunk;
    state.atlasBuildStartedAt = nowIso();
    state.atlasBuildCompletedAt = "";
    state.atlasBuildElapsedMs = 0;
    state.atlasBuildYieldCount = 0;

    state.atlasWidth = width;
    state.atlasHeight = height;
    state.atlasCanonicalMaterialSampleCount = 0;
    state.atlasElevationHydrologySampleCount = 0;
    state.atlasFallbackSampleCount = 0;
    state.atlasTotalSampleCount = 0;

    state.materialSampleSuccessCount = 0;
    state.materialSampleFailureCount = 0;
    state.canonicalMaterialConsumed = false;
    state.canonicalMaterialColorPrimary = false;
    state.canonicalMaterialShapePrimary = false;
    state.elevationHydrologyFallbackUsed = false;
    state.sevenContinentFallbackUsed = false;
    state.sevenContinentFallbackSuppressedByUpstream = false;
    state.materialAtlasPrimary = false;
    state.sourceContextSampleCount = 0;

    state.oldTerrainSampleCount = 0;
    state.golfSuppressionSampleCount = 0;
    state.mineralScarSampleCount = 0;
    state.coastalScarSampleCount = 0;
    state.dryScarThreadSampleCount = 0;
    state.terrainVeinSampleCount = 0;

    updateDocumentDataset();

    for (let yStart = 0; yStart < height; yStart += rowsPerChunk) {
      const yEnd = Math.min(height, yStart + rowsPerChunk);

      for (let y = yStart; y < yEnd; y += 1) {
        const v = y / Math.max(1, height - 1);

        for (let x = 0; x < width; x += 1) {
          const u = x / Math.max(1, width - 1);
          const sample = samplePlanetMaterialWithContext(sourceContext, u, v);
          const index = (y * width + x) * 4;

          image.data[index] = sample.rgb[0];
          image.data[index + 1] = sample.rgb[1];
          image.data[index + 2] = sample.rgb[2];
          image.data[index + 3] = 255;

          state.atlasTotalSampleCount += 1;

          if (sample.canonicalMaterialConsumed) state.atlasCanonicalMaterialSampleCount += 1;
          else if (sample.elevationHydrologyFallbackUsed) state.atlasElevationHydrologySampleCount += 1;
          else if (sample.sevenContinentFallbackUsed) state.atlasFallbackSampleCount += 1;
        }
      }

      state.atlasBuildProgress = Math.round((yEnd / height) * 100);
      state.updatedAt = nowIso();

      if (isFunction(options.onProgress)) {
        try {
          options.onProgress(state.atlasBuildProgress, getReceipt());
        } catch (error) {
          recordError("ATLAS_PROGRESS_CALLBACK_FAILED", error);
        }
      }

      await yieldFrame();
    }

    context.putImageData(image, 0, 0);

    state.atlasCanvas = canvas;
    state.atlasContext = context;
    state.materialAtlasPrimary = state.atlasCanonicalMaterialSampleCount > 0;
    state.canonicalMaterialConsumed = state.atlasCanonicalMaterialSampleCount > 0;
    state.canonicalMaterialColorPrimary = state.atlasCanonicalMaterialSampleCount > 0;
    state.canonicalMaterialShapePrimary = state.atlasCanonicalMaterialSampleCount > 0;
    state.elevationHydrologyFallbackUsed = state.atlasElevationHydrologySampleCount > 0;
    state.sevenContinentFallbackUsed = state.atlasFallbackSampleCount > 0;
    state.sevenContinentFallbackSuppressedByUpstream =
      state.atlasCanonicalMaterialSampleCount + state.atlasElevationHydrologySampleCount > 0;

    state.atlasInvalidated = false;
    state.atlasInvalidationReason = "";
    state.atlasBuildComplete = true;
    state.atlasBuildProgress = 100;
    state.atlasBuildCompletedAt = nowIso();
    state.atlasBuildElapsedMs = Math.max(0, Date.parse(state.atlasBuildCompletedAt) - Date.parse(state.atlasBuildStartedAt));
    state.updatedAt = state.atlasBuildCompletedAt;

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      role: state.role,

      atlasCanvas: canvas,
      atlasContext: context,
      width,
      height,

      sourceReceipt: {
        contract: CONTRACT,
        receipt: RECEIPT,
        sourceContextCreated: true,
        sourceContextCreatedAt: sourceContext.createdAt,
        authorityResolutionCachedPerAtlasBuild: true,
        materialBridgeRefreshCachedPerAtlasBuild: true,
        perPixelAuthorityResolutionRetired: true,
        perPixelMaterialBridgeRefreshRetired: true,
        defaultAtlasReduced: true,
        defaultAtlasWidth: DEFAULT_ATLAS_WIDTH,
        defaultAtlasHeight: DEFAULT_ATLAS_HEIGHT,
        actualAtlasWidth: width,
        actualAtlasHeight: height,
        oldTerrainMaterialLanguageActive: true,
        golfCourseGreenSuppressed: true,
        materialColorComesFromTerrain: true
      },

      materialBridge: getMaterialBridgeReceipt(),
      receiptPacket: getReceipt(),

      ownsSourceIntake: true,
      ownsAtlasFormation: true,
      ownsCanvasDrawing: false,
      ownsInteraction: false,
      ownsVisibleProof: false,
      ownsF21: false,
      ownsRouteReadiness: false,
      ownsFinalVisualPassClaim: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    state.latestMachinePacket = packet;
    updateDocumentDataset();

    return packet;
  }

  function invalidateAtlas(reason = "manual-atlas-invalidation") {
    state.atlasInvalidated = true;
    state.atlasInvalidationReason = String(reason || "manual-atlas-invalidation");
    state.atlasCanvas = null;
    state.atlasContext = null;
    state.atlasBuildComplete = false;
    state.atlasBuildProgress = 0;
    state.latestMachinePacket = null;
    state.updatedAt = nowIso();
    updateDocumentDataset();
    return getReceipt();
  }

  function sample(point = {}) {
    const sourceContext = createSourceContext({
      width: DEFAULT_ATLAS_WIDTH,
      height: DEFAULT_ATLAS_HEIGHT
    });

    const u = clamp01(safeNumber(point.u, 0.5));
    const v = clamp01(safeNumber(point.v, 0.5));
    const material = samplePlanetMaterialWithContext(sourceContext, u, v);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      ...material,

      materialReceiptBridgeActive: true,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialExpectedContract: EXPECTED_MATERIAL_CONTRACT,
      materialExpectedReceipt: EXPECTED_MATERIAL_RECEIPT,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected,
      materialAtlasPrimary: material.canonicalMaterialConsumed === true,

      bodyBinding: 1,
      surfaceAttachment: 1,
      hydrosphereBinding: 1,
      surfaceSeat: 1,
      allowedToFloat: false,
      isCanvasEastSample: true,
      canvasStillDoesNotOwnPlanetTruth: true,

      f21ClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function read(point = {}) {
    return sample(point);
  }

  function getMaterialBridgeReceipt() {
    return {
      materialReceiptBridgeActive: true,
      materialNestedReceiptAvailable: state.materialNestedReceiptAvailable,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialExpectedContract: EXPECTED_MATERIAL_CONTRACT,
      materialExpectedReceipt: EXPECTED_MATERIAL_RECEIPT,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected,
      materialPreviousContract: state.materialPreviousContract,
      materialBaselineContract: state.materialBaselineContract,
      materialVersion: state.materialVersion,
      materialRole: state.materialRole,
      materialContractSignature: state.materialContractSignature,
      previousMaterialContractSignature: state.previousMaterialContractSignature,
      materialContractSignatureChanged: state.materialContractSignatureChanged,
      materialAtlasPrimary: state.materialAtlasPrimary,
      materialSampleSuccessCount: state.materialSampleSuccessCount,
      materialSampleFailureCount: state.materialSampleFailureCount,
      materialReliefFeedsDetected: state.materialReliefFeedsDetected,
      materialElevationContractMatchesActive: state.materialElevationContractMatchesActive
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      role: state.role,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,
      cycleOrder: state.cycleOrder,

      authorityResolutionCachedPerAtlasBuild: true,
      materialBridgeRefreshCachedPerAtlasBuild: true,
      perPixelAuthorityResolutionRetired: true,
      perPixelMaterialBridgeRefreshRetired: true,
      defaultAtlasReduced: true,
      defaultAtlasWidth: DEFAULT_ATLAS_WIDTH,
      defaultAtlasHeight: DEFAULT_ATLAS_HEIGHT,
      optionalHigherLodSupported: true,

      oldTerrainMaterialLanguageActive: true,
      golfCourseGreenSuppressed: true,
      manicuredGrassReadRetired: true,
      flatFairwayInteriorSuppressed: true,
      materialColorComesFromTerrain: true,
      irregularHighlandMaterialActive: true,
      roundSandTrapHighlandsRetired: true,
      mineralScarHighlandsActive: true,
      highlandEdgeBreakupActive: true,
      coastalScarMaterialActive: true,
      ancientWaterlineTraceActive: true,
      shelfDropShadowActive: true,
      coastlineRingReadSuppressed: true,
      materialEdgeBreakupActive: true,
      deterministicTerrainNoiseActive: true,
      smoothConcentricBandingReduced: true,
      atlasFrameStable: true,
      terrainVeiningActive: true,
      dryScarThreadsActive: true,
      mineralSeamVariationActive: true,

      oldTerrainSampleCount: state.oldTerrainSampleCount,
      golfSuppressionSampleCount: state.golfSuppressionSampleCount,
      mineralScarSampleCount: state.mineralScarSampleCount,
      coastalScarSampleCount: state.coastalScarSampleCount,
      dryScarThreadSampleCount: state.dryScarThreadSampleCount,
      terrainVeinSampleCount: state.terrainVeinSampleCount,

      sourceContextCreated: state.sourceContextCreated,
      sourceContextCreatedAt: state.sourceContextCreatedAt,
      sourceContextAuthorityResolutionCount: state.sourceContextAuthorityResolutionCount,
      sourceContextMaterialBridgeRefreshCount: state.sourceContextMaterialBridgeRefreshCount,
      sourceContextSampleCount: state.sourceContextSampleCount,

      materialReceiptBridge: getMaterialBridgeReceipt(),

      upstreamFirstAtlasActive: true,
      canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed,
      canonicalMaterialColorPrimary: state.canonicalMaterialColorPrimary,
      canonicalMaterialShapePrimary: state.canonicalMaterialShapePrimary,
      materialsPrimaryWhenValid: true,
      rawSourceColorDemotedToPaletteInfluence: true,

      sevenContinentFallbackEmergencyOnly: true,
      sevenContinentFallbackUsed: state.sevenContinentFallbackUsed,
      sevenContinentFallbackSuppressedByUpstream: state.sevenContinentFallbackSuppressedByUpstream,
      sevenContinentVisualFallbackActive: true,
      continentVisualSeedCount: 7,
      continentSeedIds: SEVEN_CONTINENT_SEEDS.map((seed) => seed.id),
      continentBlendMode: "max-separated",
      proceduralSixLobeAdditiveFieldRetired: true,
      oceanChannelCutActive: true,
      seaLineTightened: true,
      coastlineSharpeningActive: true,
      landChannelStillReceiverOnly: true,
      elevationHydrologyFallbackUsed: state.elevationHydrologyFallbackUsed,

      atlasWidth: state.atlasWidth,
      atlasHeight: state.atlasHeight,
      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildComplete: state.atlasBuildComplete,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildRowsPerChunk: state.atlasBuildRowsPerChunk,
      atlasBuildStartedAt: state.atlasBuildStartedAt,
      atlasBuildCompletedAt: state.atlasBuildCompletedAt,
      atlasBuildElapsedMs: state.atlasBuildElapsedMs,
      atlasBuildYieldCount: state.atlasBuildYieldCount,
      atlasCanonicalMaterialSampleCount: state.atlasCanonicalMaterialSampleCount,
      atlasElevationHydrologySampleCount: state.atlasElevationHydrologySampleCount,
      atlasFallbackSampleCount: state.atlasFallbackSampleCount,
      atlasTotalSampleCount: state.atlasTotalSampleCount,
      atlasInvalidated: state.atlasInvalidated,
      atlasInvalidationReason: state.atlasInvalidationReason,

      latestMachinePacketAvailable: Boolean(state.latestMachinePacket),

      ownsSourceIntake: true,
      ownsAtlasFormation: true,
      ownsCanvasDrawing: false,
      ownsInteraction: false,
      ownsVisibleProof: false,
      ownsF21: false,
      ownsRouteReadiness: false,
      ownsFinalVisualPassClaim: false,

      errors: state.errors.slice(),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt
    };
  }

  function getReceiptText() {
    const receipt = getReceipt();
    const material = receipt.materialReceiptBridge || {};
    const errors = receipt.errors.length
      ? receipt.errors.map((item) => `- ${item.at} :: ${item.code} :: ${item.message}`).join("\n")
      : "- none";

    return [
      "HEARTH_CANVAS_EAST_OLD_TERRAIN_MATERIAL_LANGUAGE_DEGOLFING_RECEIPT",
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
      `authorityResolutionCachedPerAtlasBuild=${receipt.authorityResolutionCachedPerAtlasBuild}`,
      `materialBridgeRefreshCachedPerAtlasBuild=${receipt.materialBridgeRefreshCachedPerAtlasBuild}`,
      `perPixelAuthorityResolutionRetired=${receipt.perPixelAuthorityResolutionRetired}`,
      `perPixelMaterialBridgeRefreshRetired=${receipt.perPixelMaterialBridgeRefreshRetired}`,
      `defaultAtlasReduced=${receipt.defaultAtlasReduced}`,
      `defaultAtlasWidth=${receipt.defaultAtlasWidth}`,
      `defaultAtlasHeight=${receipt.defaultAtlasHeight}`,
      `optionalHigherLodSupported=${receipt.optionalHigherLodSupported}`,
      "",
      `oldTerrainMaterialLanguageActive=${receipt.oldTerrainMaterialLanguageActive}`,
      `golfCourseGreenSuppressed=${receipt.golfCourseGreenSuppressed}`,
      `manicuredGrassReadRetired=${receipt.manicuredGrassReadRetired}`,
      `flatFairwayInteriorSuppressed=${receipt.flatFairwayInteriorSuppressed}`,
      `materialColorComesFromTerrain=${receipt.materialColorComesFromTerrain}`,
      `irregularHighlandMaterialActive=${receipt.irregularHighlandMaterialActive}`,
      `roundSandTrapHighlandsRetired=${receipt.roundSandTrapHighlandsRetired}`,
      `mineralScarHighlandsActive=${receipt.mineralScarHighlandsActive}`,
      `highlandEdgeBreakupActive=${receipt.highlandEdgeBreakupActive}`,
      `coastalScarMaterialActive=${receipt.coastalScarMaterialActive}`,
      `ancientWaterlineTraceActive=${receipt.ancientWaterlineTraceActive}`,
      `shelfDropShadowActive=${receipt.shelfDropShadowActive}`,
      `coastlineRingReadSuppressed=${receipt.coastlineRingReadSuppressed}`,
      `materialEdgeBreakupActive=${receipt.materialEdgeBreakupActive}`,
      `deterministicTerrainNoiseActive=${receipt.deterministicTerrainNoiseActive}`,
      `smoothConcentricBandingReduced=${receipt.smoothConcentricBandingReduced}`,
      `atlasFrameStable=${receipt.atlasFrameStable}`,
      `terrainVeiningActive=${receipt.terrainVeiningActive}`,
      `dryScarThreadsActive=${receipt.dryScarThreadsActive}`,
      `mineralSeamVariationActive=${receipt.mineralSeamVariationActive}`,
      "",
      `oldTerrainSampleCount=${receipt.oldTerrainSampleCount}`,
      `golfSuppressionSampleCount=${receipt.golfSuppressionSampleCount}`,
      `mineralScarSampleCount=${receipt.mineralScarSampleCount}`,
      `coastalScarSampleCount=${receipt.coastalScarSampleCount}`,
      `dryScarThreadSampleCount=${receipt.dryScarThreadSampleCount}`,
      `terrainVeinSampleCount=${receipt.terrainVeinSampleCount}`,
      "",
      "MATERIAL_RECEIPT_BRIDGE",
      `materialReceiptBridgeActive=${material.materialReceiptBridgeActive}`,
      `materialNestedReceiptAvailable=${material.materialNestedReceiptAvailable}`,
      `materialContract=${material.materialContract}`,
      `materialReceipt=${material.materialReceipt}`,
      `materialExpectedContract=${material.materialExpectedContract}`,
      `materialExpectedReceipt=${material.materialExpectedReceipt}`,
      `materialContractMatchesExpected=${material.materialContractMatchesExpected}`,
      `materialReceiptMatchesExpected=${material.materialReceiptMatchesExpected}`,
      `materialPreviousContract=${material.materialPreviousContract}`,
      `materialBaselineContract=${material.materialBaselineContract}`,
      `materialVersion=${material.materialVersion}`,
      `materialRole=${material.materialRole}`,
      `materialContractSignatureChanged=${material.materialContractSignatureChanged}`,
      `materialAtlasPrimary=${material.materialAtlasPrimary}`,
      `materialSampleSuccessCount=${material.materialSampleSuccessCount}`,
      `materialSampleFailureCount=${material.materialSampleFailureCount}`,
      `materialReliefFeedsDetected=${material.materialReliefFeedsDetected}`,
      `materialElevationContractMatchesActive=${material.materialElevationContractMatchesActive}`,
      "",
      `atlasWidth=${receipt.atlasWidth}`,
      `atlasHeight=${receipt.atlasHeight}`,
      `atlasBuildStarted=${receipt.atlasBuildStarted}`,
      `atlasBuildComplete=${receipt.atlasBuildComplete}`,
      `atlasBuildProgress=${receipt.atlasBuildProgress}`,
      `atlasBuildRowsPerChunk=${receipt.atlasBuildRowsPerChunk}`,
      `atlasBuildElapsedMs=${receipt.atlasBuildElapsedMs}`,
      `atlasCanonicalMaterialSampleCount=${receipt.atlasCanonicalMaterialSampleCount}`,
      `atlasElevationHydrologySampleCount=${receipt.atlasElevationHydrologySampleCount}`,
      `atlasFallbackSampleCount=${receipt.atlasFallbackSampleCount}`,
      `atlasTotalSampleCount=${receipt.atlasTotalSampleCount}`,
      `latestMachinePacketAvailable=${receipt.latestMachinePacketAvailable}`,
      "",
      `ownsSourceIntake=${receipt.ownsSourceIntake}`,
      `ownsAtlasFormation=${receipt.ownsAtlasFormation}`,
      `ownsCanvasDrawing=${receipt.ownsCanvasDrawing}`,
      `ownsInteraction=${receipt.ownsInteraction}`,
      `ownsVisibleProof=${receipt.ownsVisibleProof}`,
      `ownsF21=${receipt.ownsF21}`,
      `ownsRouteReadiness=${receipt.ownsRouteReadiness}`,
      `ownsFinalVisualPassClaim=${receipt.ownsFinalVisualPassClaim}`,
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

  function updateDocumentDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasEastLoaded = "true";
    dataset.hearthCanvasEastContract = CONTRACT;
    dataset.hearthCanvasEastReceipt = RECEIPT;
    dataset.hearthCanvasEastPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasEastBaselineContract = BASELINE_CONTRACT;
    dataset.hearthCanvasEastVersion = VERSION;
    dataset.hearthCanvasEastFile = FILE;

    dataset.hearthCanvasEastNewsProtocolSynchronized = "true";
    dataset.hearthCanvasEastFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasEastActiveFibonacciGate = "F13";
    dataset.hearthCanvasEastFutureFibonacciGate = "F21";
    dataset.hearthCanvasEastOneActiveGearAtATime = "true";

    dataset.hearthCanvasEastAuthorityResolutionCachedPerAtlasBuild = "true";
    dataset.hearthCanvasEastMaterialBridgeRefreshCachedPerAtlasBuild = "true";
    dataset.hearthCanvasEastPerPixelAuthorityResolutionRetired = "true";
    dataset.hearthCanvasEastPerPixelMaterialBridgeRefreshRetired = "true";
    dataset.hearthCanvasEastDefaultAtlasReduced = "true";
    dataset.hearthCanvasEastDefaultAtlasWidth = String(DEFAULT_ATLAS_WIDTH);
    dataset.hearthCanvasEastDefaultAtlasHeight = String(DEFAULT_ATLAS_HEIGHT);

    dataset.hearthCanvasEastOldTerrainMaterialLanguageActive = "true";
    dataset.hearthCanvasEastGolfCourseGreenSuppressed = "true";
    dataset.hearthCanvasEastManicuredGrassReadRetired = "true";
    dataset.hearthCanvasEastFlatFairwayInteriorSuppressed = "true";
    dataset.hearthCanvasEastMaterialColorComesFromTerrain = "true";
    dataset.hearthCanvasEastIrregularHighlandMaterialActive = "true";
    dataset.hearthCanvasEastMineralScarHighlandsActive = "true";
    dataset.hearthCanvasEastCoastalScarMaterialActive = "true";
    dataset.hearthCanvasEastAncientWaterlineTraceActive = "true";
    dataset.hearthCanvasEastShelfDropShadowActive = "true";
    dataset.hearthCanvasEastMaterialEdgeBreakupActive = "true";
    dataset.hearthCanvasEastDeterministicTerrainNoiseActive = "true";

    dataset.hearthCanvasEastMaterialReceiptBridgeActive = "true";
    dataset.hearthCanvasEastMaterialNestedReceiptAvailable = String(state.materialNestedReceiptAvailable);
    dataset.hearthCanvasEastMaterialContract = state.materialContract;
    dataset.hearthCanvasEastMaterialReceipt = state.materialReceipt;
    dataset.hearthCanvasEastMaterialContractMatchesExpected = String(state.materialContractMatchesExpected);
    dataset.hearthCanvasEastMaterialReceiptMatchesExpected = String(state.materialReceiptMatchesExpected);
    dataset.hearthCanvasEastMaterialAtlasPrimary = String(state.materialAtlasPrimary);

    dataset.hearthCanvasEastAtlasWidth = String(state.atlasWidth);
    dataset.hearthCanvasEastAtlasHeight = String(state.atlasHeight);
    dataset.hearthCanvasEastAtlasBuildStarted = String(state.atlasBuildStarted);
    dataset.hearthCanvasEastAtlasBuildComplete = String(state.atlasBuildComplete);
    dataset.hearthCanvasEastAtlasBuildProgress = String(state.atlasBuildProgress);
    dataset.hearthCanvasEastAtlasCanonicalMaterialSampleCount = String(state.atlasCanonicalMaterialSampleCount);
    dataset.hearthCanvasEastAtlasElevationHydrologySampleCount = String(state.atlasElevationHydrologySampleCount);
    dataset.hearthCanvasEastAtlasFallbackSampleCount = String(state.atlasFallbackSampleCount);
    dataset.hearthCanvasEastAtlasTotalSampleCount = String(state.atlasTotalSampleCount);

    dataset.hearthCanvasEastOwnsSourceIntake = "true";
    dataset.hearthCanvasEastOwnsAtlasFormation = "true";
    dataset.hearthCanvasEastOwnsCanvasDrawing = "false";
    dataset.hearthCanvasEastOwnsInteraction = "false";
    dataset.hearthCanvasEastOwnsVisibleProof = "false";
    dataset.hearthCanvasEastOwnsF21 = "false";
    dataset.hearthCanvasEastOwnsRouteReadiness = "false";
    dataset.hearthCanvasEastOwnsFinalVisualPassClaim = "false";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,

    createSourceContext,
    refreshMaterialBridge,
    buildAtlas,
    invalidateAtlas,
    sample,
    read,
    getReceipt,
    getReceiptText,
    getMaterialBridgeReceipt,

    canvasEastActive: true,
    materialAtlasSourceMachine: true,
    oldTerrainMaterialLanguageActive: true,
    golfCourseGreenSuppressed: true,
    v4DegolfingActive: true,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,

    authorityResolutionCachedPerAtlasBuild: true,
    materialBridgeRefreshCachedPerAtlasBuild: true,
    perPixelAuthorityResolutionRetired: true,
    perPixelMaterialBridgeRefreshRetired: true,
    defaultAtlasReduced: true,
    defaultAtlasWidth: DEFAULT_ATLAS_WIDTH,
    defaultAtlasHeight: DEFAULT_ATLAS_HEIGHT,
    optionalHigherLodSupported: true,

    ownsSourceIntake: true,
    ownsAtlasFormation: true,
    ownsCanvasDrawing: false,
    ownsInteraction: false,
    ownsVisibleProof: false,
    ownsF21: false,
    ownsRouteReadiness: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvasEast = api;
  root.HEARTH.canvasEastMaterialAtlasSourceMachine = api;
  root.HEARTH.canvasEastOldTerrainMaterialLanguage = api;

  root.HEARTH_CANVAS_EAST = api;
  root.HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE = api;
  root.HEARTH_CANVAS_EAST_OLD_TERRAIN_MATERIAL_LANGUAGE_DEGOLFING = api;

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.hearthCanvasEast = api;
  root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine = api;
  root.DEXTER_LAB.hearthCanvasEastOldTerrainMaterialLanguageDegolfing = api;

  refreshMaterialBridge();
  updateDocumentDataset();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
