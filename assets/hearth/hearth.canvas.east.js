// /assets/hearth/hearth.canvas.east.js
// HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE_TNT_v1
// Full-file replacement.
// Canvas East / source intake and atlas formation only.
// Purpose:
// - Read HEARTH_MATERIALS first when available.
// - Bridge the material receipt into the canvas system.
// - Build the atlas field consumed by Canvas South.
// - Preserve emergency seven-continent fallback only when upstream material/elevation/hydrology are unavailable.
// Does not own:
// - canvas drawing
// - drag / zoom interaction
// - visible proof
// - F21
// - route readiness
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE_RECEIPT_v1";
  const VERSION = "2026-05-30.hearth-canvas-east-material-atlas-source-machine-v1";
  const FILE = "/assets/hearth/hearth.canvas.east.js";

  const EXPECTED_MATERIAL_CONTRACT = "HEARTH_MATERIALS_ISLAND_ELEVATION_BEACH_RELIEF_CONSUMER_TNT_v1";
  const EXPECTED_MATERIAL_RECEIPT = "HEARTH_MATERIALS_ISLAND_ELEVATION_BEACH_RELIEF_CONSUMER_RECEIPT_v1";

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

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    role: "canvas-east-material-atlas-source-machine",

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

    errors: [],
    updatedAt: nowIso(),

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
    return new Promise((resolve) => {
      if (typeof root.requestAnimationFrame === "function") root.requestAnimationFrame(resolve);
      else root.setTimeout(resolve, 0);
    });
  }

  function recordError(code, error) {
    const item = {
      at: nowIso(),
      code,
      message: error && error.message ? error.message : String(error || "")
    };
    state.errors.push(item);
    if (state.errors.length > 80) state.errors.splice(0, state.errors.length - 80);
    state.updatedAt = item.at;
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
      String(Boolean(readBoolean(source, ["supportsInlandReliefMaterialFeed"], false)))
    ].join("|");
  }

  function refreshMaterialBridge() {
    const authority = readMaterialAuthority();
    const receipt = readAuthorityReceipt(authority);
    const source = receipt || authority || {};
    const signature = materialSignatureFrom(authority, receipt);
    const previous = state.materialContractSignature;

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

    return {
      changed: state.materialContractSignatureChanged,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected
    };
  }

  function sampleExternalAuthority(authority, point) {
    if (!authority || !isObject(authority)) return null;

    const methods = ["sample", "read", "get", "getCell", "sampleAt", "readAt", "getMaterial", "getSurfaceMaterial", "resolve", "resolveMaterial"];

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

    const keys = ["rgb", "color", "baseColor", "finalColor", "finalColorHint", "landRgb", "waterRgb", "oceanRgb"];

    for (const key of keys) {
      const value = packet[key];
      if (Array.isArray(value) && value.length >= 3 && value.every((item) => Number.isFinite(Number(item)))) {
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
      readNumber(packet, ["waterDepthShade"], 0),
      readNumber(packet, ["waterDepth"], 0)
    ));

    const landFeed = clamp01(Math.max(
      readNumber(packet, ["landAlpha"], 0),
      readNumber(packet, ["landDensity"], 0),
      readNumber(packet, ["landPotential"], 0),
      readNumber(packet, ["coordinateLandBodyMaterialFeed"], 0),
      readNumber(packet, ["bodySeatPressure"], 0)
    ));

    const textSaysWater = includesAny(classText, ["water", "ocean", "shelf", "submerged", "hydro", "marine", "sea", "strait", "shallow", "deep", "bay", "inlet"]);
    const textSaysLand = includesAny(classText, ["land", "continent", "mountain", "plateau", "canyon", "cliff", "rainforest", "tundra", "desert", "summit", "ridge", "coast", "beach", "island", "peninsula"]);

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
      readNumber(packet, ["beachMaterialFeed"], 0)
    ));

    const shelf = clamp01(Math.max(
      readNumber(packet, ["shelf"], 0),
      readNumber(packet, ["shelfTransition"], 0),
      readNumber(packet, ["shallowShelfMaterialFeed"], 0),
      readNumber(packet, ["sandShelfMaterialFeed"], 0)
    ));

    const relief = clamp01(Math.max(
      readNumber(packet, ["terrainRelief"], 0),
      readNumber(packet, ["ridgeRelief"], 0),
      readNumber(packet, ["elevationReliefMaterialFeed"], 0),
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
    const ridgeRaw = fbm(u * 11.0 + 7.1, v * 8.6 - 6.2, 555, 4);
    const ridge = 1 - Math.abs(ridgeRaw - 0.5) * 2;
    const basinRaw = fbm(u * 4.2 - 3.2, v * 3.5 + 5.6, 666, 4);
    const basin = 1 - Math.abs(basinRaw - 0.5) * 2;

    const overlapCut = smoothstep(0.11, 0.34, secondary.value) * smoothstep(0.28, 0.72, primary.value) * 0.16;
    const openOceanCut = Math.pow(1 - primary.value, 1.65) * 0.14;
    const channelNoise = fbm(u * 3.8 + 11.2, v * 3.2 - 4.4, 1212, 4) * 0.055;
    const oceanChannelCut = clamp01(overlapCut + openOceanCut + channelNoise);

    const elevation = clamp01(primary.value * 0.74 + regional * 0.16 + ridge * 0.13 + fine * 0.05 - basin * 0.09 - oceanChannelCut - Math.pow(latBand, 2.2) * 0.065);
    const seaLine = 0.525 + Math.sin(u * Math.PI * 6.0 + v * 2.0) * 0.012 - Math.pow(latBand, 1.7) * 0.010;

    return {
      elevation,
      seaLine,
      continentSignal: primary.value,
      secondaryContinentSignal: secondary.value,
      continentId: primary.seed ? primary.seed.id : "none",
      continentIndex: primary.seed ? primary.seed.index : 0,
      oceanChannelCut,
      ridge,
      basin,
      regional,
      fine
    };
  }

  function fallbackMaterial(point, visualField, latBand) {
    const elevation = visualField.elevation;
    const landSignal = smoothstep(visualField.seaLine - 0.035, visualField.seaLine + 0.03, elevation);
    const waterSignal = 1 - landSignal;
    const isWater = waterSignal >= landSignal;
    const shore = clamp01(1 - Math.abs(waterSignal - landSignal) * 5.1);
    const shelf = isWater ? clamp01(shore * 0.88 + (1 - waterSignal) * 0.22) : 0;
    const fine = fbm(point.u * 22.0 + 4.7, point.v * 16.0 - 2.8, 777, 4);
    const ridge = 1 - Math.abs(fbm(point.u * 13.5 + 7.1, point.v * 9.0 - 6.2, 888, 4) - 0.5) * 2;

    let rgb;
    let visualClass;

    if (isWater) {
      rgb = mixRgb([5, 28, 66], [12, 70, 135], clamp01((1 - waterSignal) * 0.52 + fine * 0.20));
      rgb = mixRgb(rgb, [30, 119, 158], shelf);
      visualClass = shelf > 0.42 ? "emergency-seven-continent-shelf-water" : "emergency-seven-continent-deep-water";
    } else {
      const highland = clamp01((elevation - 0.58) * 2.7);
      const mountain = clamp01((elevation - 0.68) * 3.5);
      const arid = clamp01(fbm(point.u * 7.4 + 9.2, point.v * 5.9 - 1.1, 999, 4) * 0.72 + latBand * 0.28);
      const vegetation = clamp01((1 - latBand * 0.70) * (1 - mountain * 0.42) * (0.70 + fine * 0.30));

      rgb = mixRgb([126, 106, 60], [52, 114, 72], vegetation * (1 - arid * 0.52));
      rgb = mixRgb(rgb, [150, 140, 112], mountain * 0.72);
      rgb = mixRgb(rgb, [190, 166, 98], shore * 0.66);
      visualClass = mountain > 0.50 ? "emergency-seven-continent-mountain" : shore > 0.42 ? "emergency-seven-continent-coast-land" : "emergency-seven-continent-land";
    }

    const relief = (ridge - 0.5) * 24 + (fine - 0.5) * 10;
    rgb = [
      clamp(Math.round(rgb[0] + relief + shore * (isWater ? 2 : 20)), 0, 255),
      clamp(Math.round(rgb[1] + relief + shore * (isWater ? 4 : 16)), 0, 255),
      clamp(Math.round(rgb[2] + relief * 0.72 + shelf * 18 + shore * (isWater ? 12 : 4)), 0, 255)
    ];

    return {
      ...point,
      rgb,
      visualClass,
      isWater,
      isLand: !isWater,
      waterSignal,
      landSignal,
      elevation,
      seaLine: visualField.seaLine,
      shore,
      shelf,
      highland: clamp01((elevation - 0.58) * 2.7),
      mountain: clamp01((elevation - 0.68) * 3.5),
      continentId: visualField.continentId,
      continentIndex: visualField.continentIndex,
      continentSignal: visualField.continentSignal,
      secondaryContinentSignal: visualField.secondaryContinentSignal,
      oceanChannelCut: visualField.oceanChannelCut,
      source: "emergency-seven-continent-fallback",
      canonicalMaterialConsumed: false,
      elevationHydrologyFallbackUsed: false,
      sevenContinentFallbackUsed: true,
      sevenContinentFallbackSuppressedByUpstream: false
    };
  }

  function samplePlanetMaterial(u, v) {
    refreshMaterialBridge();

    const lon = u * 360 - 180;
    const lat = 90 - v * 180;
    const vector = lonLatToVector(lon, lat);
    const point = { u, v, lon, lat, x: vector.x, y: vector.y, z: vector.z };
    const latBand = Math.abs(lat) / 90;

    const materialsAuthority = readMaterialAuthority();
    const hydrologyAuthority = resolveSource(["HEARTH_HYDROLOGY", "hydrology", "hearthHydrology"]);
    const elevationAuthority = resolveSource(["HEARTH_ELEVATION", "elevation", "hearthElevation"]);
    const compositionAuthority = resolveSource(["HEARTH_COMPOSITION", "composition", "hearthComposition"]);

    const materialSample = sampleExternalAuthority(materialsAuthority, point);
    const hydroSample = sampleExternalAuthority(hydrologyAuthority, point);
    const elevationSample = sampleExternalAuthority(elevationAuthority, point);
    const compositionSample = sampleExternalAuthority(compositionAuthority, point);

    const material = classifyCanonicalMaterial(materialSample);
    const visualField = sevenContinentField(u, v, latBand);

    if (material.valid) {
      state.materialSampleSuccessCount += 1;
      state.canonicalMaterialAuthorityPresent = Boolean(materialsAuthority);
      state.canonicalMaterialConsumed = true;
      state.canonicalMaterialColorPrimary = true;
      state.canonicalMaterialShapePrimary = true;
      state.materialAtlasPrimary = true;
      state.sevenContinentFallbackSuppressedByUpstream = true;

      const elevation = Number.isFinite(material.elevation) ? material.elevation : visualField.elevation;
      let rgb = material.color.slice();

      if (material.isWater) rgb = mixRgb(rgb, [3, 16, 34], readNumber(material.packet, ["waterDepthShade", "waterDepth"], 0) * 0.10);
      else rgb = mixRgb(rgb, [156, 146, 112], material.relief * 0.10);

      return {
        ...point,
        rgb,
        visualClass: material.visualClass,
        isWater: material.isWater,
        isLand: !material.isWater,
        waterSignal: material.isWater ? Math.max(0.58, material.waterFeed) : clamp01(1 - Math.max(0.58, material.landFeed)),
        landSignal: material.isWater ? clamp01(1 - Math.max(0.58, material.waterFeed)) : Math.max(0.58, material.landFeed),
        elevation,
        seaLine: visualField.seaLine,
        shore: material.shore,
        shelf: material.shelf,
        highland: clamp01((elevation - 0.58) * 2.7),
        mountain: clamp01((elevation - 0.68) * 3.5),
        continentId: readString(material.packet, ["continentId"], visualField.continentId),
        continentIndex: readNumber(material.packet, ["continentIndex"], visualField.continentIndex),
        continentSignal: Math.max(readNumber(material.packet, ["continentPotential", "bodySeatPressure"], 0), visualField.continentSignal),
        secondaryContinentSignal: visualField.secondaryContinentSignal,
        oceanChannelCut: visualField.oceanChannelCut,
        source: "canonical-material",
        canonicalMaterialConsumed: true,
        elevationHydrologyFallbackUsed: false,
        sevenContinentFallbackUsed: false,
        sevenContinentFallbackSuppressedByUpstream: true
      };
    }

    const upstreamUsable = Boolean(isObject(hydroSample) || isObject(elevationSample) || isObject(compositionSample));
    if (upstreamUsable) {
      state.elevationHydrologyFallbackUsed = true;
      state.sevenContinentFallbackSuppressedByUpstream = true;
    }

    const fallback = fallbackMaterial(point, visualField, latBand);
    if (upstreamUsable) {
      fallback.source = "elevation-hydrology-lite-fallback";
      fallback.elevationHydrologyFallbackUsed = true;
      fallback.sevenContinentFallbackUsed = false;
      fallback.sevenContinentFallbackSuppressedByUpstream = true;
    } else {
      state.sevenContinentFallbackUsed = true;
    }

    return fallback;
  }

  async function buildAtlas(options = {}) {
    const width = Math.max(256, Math.round(safeNumber(options.width, 768)));
    const height = Math.max(128, Math.round(safeNumber(options.height, 384)));

    const working = createCanvas(width, height);
    const canvas = working.canvas;
    const context = working.context;
    const image = context.createImageData(width, height);

    refreshMaterialBridge();

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

    const rowsPerChunk = 4;

    for (let yStart = 0; yStart < height; yStart += rowsPerChunk) {
      const yEnd = Math.min(height, yStart + rowsPerChunk);

      for (let y = yStart; y < yEnd; y += 1) {
        const v = y / Math.max(1, height - 1);

        for (let x = 0; x < width; x += 1) {
          const u = x / Math.max(1, width - 1);
          const sample = samplePlanetMaterial(u, v);
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

      const progress = Math.round((yEnd / height) * 100);
      if (isFunction(options.onProgress)) {
        try { options.onProgress(progress, getReceipt()); } catch (error) { recordError("ATLAS_PROGRESS_CALLBACK_FAILED", error); }
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
    state.sevenContinentFallbackSuppressedByUpstream = state.atlasCanonicalMaterialSampleCount + state.atlasElevationHydrologySampleCount > 0;
    state.atlasInvalidated = false;
    state.updatedAt = nowIso();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      atlasCanvas: canvas,
      atlasContext: context,
      width,
      height,
      receiptPacket: getReceipt()
    };
  }

  function invalidateAtlas(reason = "manual-atlas-invalidation") {
    state.atlasInvalidated = true;
    state.atlasInvalidationReason = String(reason || "manual-atlas-invalidation");
    state.atlasCanvas = null;
    state.atlasContext = null;
    state.updatedAt = nowIso();
    return getReceipt();
  }

  function sample(point = {}) {
    const u = clamp01(safeNumber(point.u, 0.5));
    const v = clamp01(safeNumber(point.v, 0.5));
    const material = samplePlanetMaterial(u, v);

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

  function getReceipt() {
    refreshMaterialBridge();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      role: state.role,

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
      materialContractSignatureChanged: state.materialContractSignatureChanged,
      previousMaterialContractSignature: state.previousMaterialContractSignature,
      materialAtlasPrimary: state.materialAtlasPrimary,
      materialSampleSuccessCount: state.materialSampleSuccessCount,
      materialSampleFailureCount: state.materialSampleFailureCount,
      materialReliefFeedsDetected: state.materialReliefFeedsDetected,
      materialElevationContractMatchesActive: state.materialElevationContractMatchesActive,

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
      atlasCanonicalMaterialSampleCount: state.atlasCanonicalMaterialSampleCount,
      atlasElevationHydrologySampleCount: state.atlasElevationHydrologySampleCount,
      atlasFallbackSampleCount: state.atlasFallbackSampleCount,
      atlasTotalSampleCount: state.atlasTotalSampleCount,
      atlasInvalidated: state.atlasInvalidated,
      atlasInvalidationReason: state.atlasInvalidationReason,

      ownsSourceIntake: true,
      ownsAtlasFormation: true,
      ownsCanvasDrawing: false,
      ownsInteraction: false,
      ownsVisibleProof: false,
      ownsF21: false,

      errors: state.errors.slice(),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,

    refreshMaterialBridge,
    buildAtlas,
    invalidateAtlas,
    sample,
    read,
    getReceipt,

    canvasEastActive: true,
    ownsSourceIntake: true,
    ownsAtlasFormation: true,
    ownsCanvasDrawing: false,
    ownsInteraction: false,
    ownsVisibleProof: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvasEast = api;
  root.HEARTH_CANVAS_EAST = api;

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.hearthCanvasEast = api;

  if (doc && doc.documentElement) {
    const dataset = doc.documentElement.dataset;
    dataset.hearthCanvasEastLoaded = "true";
    dataset.hearthCanvasEastContract = CONTRACT;
    dataset.hearthCanvasEastReceipt = RECEIPT;
    dataset.hearthCanvasEastFile = FILE;
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
