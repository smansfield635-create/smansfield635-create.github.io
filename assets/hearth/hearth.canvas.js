// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_RECEIPT_TOGGLE_INSPECTION_RECOVERY_TNT_v1
// Full-file replacement.
// Supersedes: HEARTH_CANVAS_HEX_FOUR_PAIR_BODY_BOUNDARY_CARRIER_TNT_v1
// Previous: HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1
// Baseline: HEARTH_CANVAS_VISIBLE_PLANET_NONBLOCKING_WATER_CHILD_DIAGNOSTIC_RECOVERY_TNT_v1
//
// Canvas / visible carrier / diagnostic UI authority only.
//
// Purpose:
// - Preserve the hex four-pair body-bound Hearth carrier.
// - Preserve hex, land, water, and air channel consumption.
// - Restore removable receipt visibility.
// - Restore direct object inspection.
// - Keep Copy Diagnostic available.
// - Prevent the diagnostic receipt panel from permanently covering the planet.
// - Keep pointer / drag inspection active when the receipt is hidden, minimized, or set to inspect mode.
// - Preserve visualPassClaimed=false.
//
// Does not own:
// - hex handshake law
// - land truth
// - water truth
// - air truth
// - hydrology truth
// - elevation generation
// - material palette generation
// - runtime route orchestration
// - final visual pass claim

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;

  const CONTRACT = "HEARTH_CANVAS_RECEIPT_TOGGLE_INSPECTION_RECOVERY_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_RECEIPT_TOGGLE_INSPECTION_RECOVERY_RECEIPT_v1";
  const SUPERSEDES_CONTRACT = "HEARTH_CANVAS_HEX_FOUR_PAIR_BODY_BOUNDARY_CARRIER_TNT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_VISIBLE_PLANET_NONBLOCKING_WATER_CHILD_DIAGNOSTIC_RECOVERY_TNT_v1";
  const VERSION = "2026-05-29.hearth-canvas-receipt-toggle-inspection-recovery-v1";

  const PLANET_ID = "hearth";
  const PLANET_LABEL = "Hearth";

  const EXPECTED = Object.freeze({
    hex: "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1",
    land: "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1",
    water: "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1",
    air: "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1",
    runtimeTable: "LAB_UNIVERSAL_PLANET_WIDE_PROBE_DIAGNOSTIC_LOADING_STANDARD_TNT_v1"
  });

  const CHILD_PATHS = Object.freeze({
    hex: "/assets/hearth/hearth.hex.four-pair.authority.js",
    land: "/assets/hearth/hearth.land.channel.js",
    water: "/assets/hearth/hearth.water.channel.js",
    air: "/assets/hearth/hearth.air.channel.js"
  });

  const CACHE = Object.freeze({
    canvas: "hearth-canvas-receipt-toggle-inspection-recovery-v1",
    hex: "hearth-hex-four-pair-pixel-handshake-authority-v1",
    land: "hearth-land-surface-attachment-channel-v1",
    water: "hearth-water-hydrosphere-surface-channel-v1",
    air: "hearth-air-pressure-humidity-channel-v1"
  });

  const DEFAULTS = Object.freeze({
    size: 460,
    atlasWidth: 384,
    atlasHeight: 192,
    rowsPerChunk: 2,
    radiusRatio: 0.455,
    tilt: -0.18,
    phase: -0.12,
    lightX: -0.48,
    lightY: 0.28,
    lightZ: 0.84,
    receiptVisible: true,
    receiptMode: "compact",
    inspectionMode: false
  });

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
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

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function mix(a, b, t) {
    const amount = clamp01(t);
    return a + (b - a) * amount;
  }

  function wrap01(value) {
    const number = safeNumber(value, 0);
    return ((number % 1) + 1) % 1;
  }

  function boolString(value) {
    return String(Boolean(value));
  }

  function getDocument() {
    return root.document && root.document.documentElement ? root.document : null;
  }

  function getRootDataset() {
    const doc = getDocument();
    return doc && doc.documentElement ? doc.documentElement.dataset : null;
  }

  function writeRootDataset(pairs) {
    const dataset = getRootDataset();
    if (!dataset) return;

    Object.keys(pairs || {}).forEach((key) => {
      dataset[key] = safeString(pairs[key]);
    });
  }

  function appendCacheKey(path, cacheKey) {
    const joiner = path.includes("?") ? "&" : "?";
    return `${path}${joiner}v=${encodeURIComponent(cacheKey || CACHE.canvas)}`;
  }

  function requestFrame(callback) {
    if (typeof root.requestAnimationFrame === "function") {
      return root.requestAnimationFrame(callback);
    }

    return root.setTimeout(callback, 16);
  }

  function normalize3(point) {
    const x = safeNumber(point && point.x, 0);
    const y = safeNumber(point && point.y, 0);
    const z = safeNumber(point && point.z, 1);
    const magnitude = Math.hypot(x, y, z) || 1;

    return {
      x: x / magnitude,
      y: y / magnitude,
      z: z / magnitude
    };
  }

  function rotateY(point, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: point.x * c + point.z * s,
      y: point.y,
      z: -point.x * s + point.z * c
    };
  }

  function rotateX(point, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: point.x,
      y: point.y * c - point.z * s,
      z: point.y * s + point.z * c
    };
  }

  function vectorToUv(point) {
    const p = normalize3(point);
    const lon = Math.atan2(p.x, p.z);
    const lat = Math.asin(clamp(p.y, -1, 1));

    return {
      u: wrap01(lon / (Math.PI * 2) + 0.5),
      v: clamp01(0.5 - lat / Math.PI),
      lon,
      lat
    };
  }

  function uvToVector(u, v) {
    const lon = (wrap01(u) - 0.5) * Math.PI * 2;
    const lat = (0.5 - clamp01(v)) * Math.PI;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  }

  function colorFrom(value, fallback) {
    if (Array.isArray(value) && value.length >= 3) {
      return [
        clamp(Math.round(value[0]), 0, 255),
        clamp(Math.round(value[1]), 0, 255),
        clamp(Math.round(value[2]), 0, 255)
      ];
    }

    return fallback.slice();
  }

  function mixColor(base, overlay, amount) {
    return [
      clamp(Math.round(mix(base[0], overlay[0], amount)), 0, 255),
      clamp(Math.round(mix(base[1], overlay[1], amount)), 0, 255),
      clamp(Math.round(mix(base[2], overlay[2], amount)), 0, 255)
    ];
  }

  function multiplyColor(color, amount) {
    return [
      clamp(Math.round(color[0] * amount), 0, 255),
      clamp(Math.round(color[1] * amount), 0, 255),
      clamp(Math.round(color[2] * amount), 0, 255)
    ];
  }

  function luma(color) {
    return (
      color[0] * 0.2126 +
      color[1] * 0.7152 +
      color[2] * 0.0722
    ) / 255;
  }

  function contractOf(value) {
    if (!value || typeof value !== "object") return "";

    return safeString(
      value.contract ||
      value.CONTRACT ||
      value.birthContract ||
      value.compatibilityContract ||
      value.boundaryHandshakeContract ||
      value.receipt ||
      value.RECEIPT ||
      ""
    );
  }

  function receiptOf(value) {
    if (!value || typeof value !== "object") return "";

    return safeString(
      value.receipt ||
      value.RECEIPT ||
      value.contract ||
      value.birthContract ||
      value.compatibilityContract ||
      ""
    );
  }

  function readGlobal(name) {
    try {
      return root[name];
    } catch (_error) {
      return null;
    }
  }

  function resolveAuthority(key) {
    const hearth = root.HEARTH || {};

    const candidates = {
      hex: [
        root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY,
        root.HEARTH_HEX_FOUR_PAIR_AUTHORITY,
        root.HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY,
        root.HEARTH_HEX_HANDSHAKE_AUTHORITY,
        root.HEARTH_HEXGRID_AUTHORITY,
        hearth.hexFourPairAuthority,
        hearth.hexAuthority
      ],
      land: [
        root.HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL,
        root.HEARTH_LAND_CHANNEL,
        root.HEARTH_LAND,
        root.HEARTH_LAND_AUTHORITY,
        hearth.landChannel,
        hearth.land
      ],
      water: [
        root.HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL,
        root.HEARTH_WATER_CHANNEL,
        root.HEARTH_WATER,
        root.HEARTH_WATER_AUTHORITY,
        root.HEARTH_HYDROSPHERE,
        hearth.waterChannel,
        hearth.water
      ],
      air: [
        root.HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL,
        root.HEARTH_AIR_CHANNEL,
        root.HEARTH_AIR,
        root.HEARTH_AIR_AUTHORITY,
        root.HEARTH_ATMOSPHERE,
        hearth.airChannel,
        hearth.air
      ],
      runtimeTable: [
        root.HEARTH_RUNTIME_TABLE,
        root.LAB_UNIVERSAL_PLANET_WIDE_PROBE_DIAGNOSTIC_LOADING_STANDARD,
        hearth.runtimeTable
      ]
    }[key] || [];

    return candidates.find((candidate) => candidate && typeof candidate === "object") || null;
  }

  function validateAuthority(key, expectedContract) {
    const authority = resolveAuthority(key);
    const contract = contractOf(authority);
    const receipt = receiptOf(authority);

    return {
      key,
      expectedContract,
      authorityPresent: Boolean(authority),
      actualContract: contract,
      actualReceipt: receipt,
      contractOk: Boolean(
        authority &&
        (
          contract === expectedContract ||
          receipt === expectedContract ||
          contract.includes(expectedContract.replace("_TNT_v1", "")) ||
          receipt.includes(expectedContract.replace("_TNT_v1", ""))
        )
      ),
      validationOk: Boolean(authority),
      authority
    };
  }

  function loadScript(path, cacheKey, marker) {
    return new Promise((resolve) => {
      const doc = getDocument();

      if (!doc || !doc.head) {
        resolve({
          path,
          loaded: false,
          error: "document-head-unavailable"
        });
        return;
      }

      const existing = doc.querySelector(`script[data-hearth-canvas-loader-marker="${marker}"]`);
      if (existing) {
        resolve({
          path,
          loaded: true,
          alreadyPresent: true,
          error: ""
        });
        return;
      }

      const script = doc.createElement("script");
      script.src = appendCacheKey(path, cacheKey);
      script.defer = true;
      script.dataset.hearthCanvasLoaderMarker = marker;
      script.dataset.hearthCanvasContract = CONTRACT;
      script.dataset.hearthCanvasReceipt = RECEIPT;
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      let settled = false;

      const settle = (result) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };

      script.onload = () => settle({
        path,
        loaded: true,
        alreadyPresent: false,
        error: ""
      });

      script.onerror = () => settle({
        path,
        loaded: false,
        alreadyPresent: false,
        error: "load-error"
      });

      try {
        doc.head.appendChild(script);
      } catch (error) {
        settle({
          path,
          loaded: false,
          alreadyPresent: false,
          error: error && error.message ? error.message : String(error)
        });
        return;
      }

      root.setTimeout(() => {
        settle({
          path,
          loaded: false,
          alreadyPresent: false,
          error: "load-timeout"
        });
      }, 3500);
    });
  }

  function callSample(authority, input) {
    if (!authority || typeof authority !== "object") return null;

    const methods = [
      "sampleVector",
      "sample",
      "read",
      "getSample",
      "getCell",
      "resolve",
      "lookup"
    ];

    for (const method of methods) {
      if (typeof authority[method] !== "function") continue;

      try {
        const result = authority[method](input);
        if (result && typeof result === "object") return result;
      } catch (_error) {}

      try {
        const result = authority[method](input.x, input.y, input.z);
        if (result && typeof result === "object") return result;
      } catch (_error) {}

      try {
        const result = authority[method](input.lon, input.lat);
        if (result && typeof result === "object") return result;
      } catch (_error) {}
    }

    return null;
  }

  function fallbackLand(input) {
    const broad = Math.sin(input.lon * 2.1 + 0.45) * 0.32 +
      Math.cos(input.lat * 3.2 - 0.3) * 0.28 +
      Math.sin((input.lon + input.lat) * 4.1) * 0.20;

    const island = Math.sin(input.lon * 6.0) * Math.cos(input.lat * 5.4) * 0.16;
    const landPresence = clamp01(0.38 + broad + island);
    const isLand = landPresence > 0.52;

    return {
      contract: "FALLBACK_HEARTH_LAND_CHANNEL_READ_ONLY",
      channel: "land",
      isLandChannel: true,
      isWaterChannel: false,
      isAirChannel: false,
      isLand,
      isWater: false,
      landAlpha: isLand ? clamp01(0.45 + landPresence * 0.48) : clamp01(landPresence * 0.32),
      landPresence,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      rgb: isLand ? [96, 82, 54] : [44, 54, 44],
      color: isLand ? [96, 82, 54] : [44, 54, 44],
      elevation: isLand ? clamp01(landPresence) * 0.35 : -0.08,
      coastPotential: clamp01(1 - Math.abs(landPresence - 0.52) * 7),
      canvasFallbackOnly: true,
      visualPassClaimed: false
    };
  }

  function fallbackWater(input) {
    const depth = clamp01(0.54 + Math.cos(input.lat * 2.7) * 0.12 + Math.sin(input.lon * 3.1) * 0.12);

    return {
      contract: "FALLBACK_HEARTH_WATER_CHANNEL_READ_ONLY",
      channel: "water",
      isWaterChannel: true,
      isLandChannel: false,
      isAirChannel: false,
      isWater: true,
      waterAlpha: clamp01(0.58 + depth * 0.32),
      waterPresence: clamp01(0.58 + depth * 0.32),
      waterDepth: depth,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      rgb: [12, 58, 112],
      color: [12, 58, 112],
      canvasFallbackOnly: true,
      visualPassClaimed: false
    };
  }

  function fallbackAir(input) {
    const rim = clamp01(1 - Math.max(0, input.z));
    const airAlpha = clamp01(0.045 + rim * 0.22);

    return {
      contract: "FALLBACK_HEARTH_AIR_CHANNEL_READ_ONLY",
      channel: "air",
      isAirChannel: true,
      isLandChannel: false,
      isWaterChannel: false,
      airAlpha,
      airPresence: airAlpha,
      rimHaze: rim,
      bodyBound: false,
      surfaceBound: false,
      floatsAboveBody: true,
      allowedToFloat: true,
      rgb: [112, 178, 218],
      color: [112, 178, 218],
      atmosphereMayDefineBoundary: false,
      boundaryAuthority: "rim-only-not-body-boundary",
      visualPassClaimed: false
    };
  }

  function readChannelColor(sample, fallback) {
    return colorFrom(
      sample && (sample.rgb || sample.color || sample.debugColor),
      fallback
    );
  }

  function readAlpha(sample, keys, fallback) {
    if (!sample || typeof sample !== "object") return fallback;

    for (const key of keys) {
      if (Number.isFinite(Number(sample[key]))) return clamp01(Number(sample[key]));
    }

    return fallback;
  }

  function composePlanetSample(state, vector) {
    const uv = vectorToUv(vector);
    const input = {
      x: vector.x,
      y: vector.y,
      z: vector.z,
      u: uv.u,
      v: uv.v,
      lon: uv.lon,
      lat: uv.lat,
      planetId: PLANET_ID,
      routeContract: state.routeContract || "",
      canvasContract: CONTRACT
    };

    const hex = callSample(state.authorities.hex, input);
    const land = callSample(state.authorities.land, input) || fallbackLand(input);
    const water = callSample(state.authorities.water, input) || fallbackWater(input);
    const air = callSample(state.authorities.air, input) || fallbackAir(input);

    const landAlpha = readAlpha(land, ["landAlpha", "landPresence", "alpha", "landPotential"], 0);
    const waterAlpha = readAlpha(water, ["waterAlpha", "waterPresence", "alpha", "waterPotential"], 0.62);
    const airAlpha = readAlpha(air, ["airAlpha", "airPresence", "alpha", "visualShellAlpha"], 0.06);

    const landColor = readChannelColor(land, [96, 82, 54]);
    const waterColor = readChannelColor(water, [12, 58, 112]);
    const airColor = readChannelColor(air, [112, 178, 218]);

    const landDeclares = Boolean(
      land &&
      (
        land.isLand ||
        land.visibleLand ||
        land.solidSurfaceLand ||
        land.topologyLand ||
        land.exposedTerrainLand ||
        land.landPresence > 0.5 ||
        land.landAlpha > 0.5
      )
    );

    const waterDeclares = Boolean(
      water &&
      (
        water.isWater ||
        water.water ||
        water.ocean ||
        water.liquidWater ||
        water.waterAlpha > 0.5
      )
    );

    const total = Math.max(0.001, landAlpha + waterAlpha);
    let landWeight = clamp01(landAlpha / total);

    if (landDeclares && landWeight < 0.44) landWeight = 0.44;
    if (!landDeclares && waterDeclares) landWeight *= 0.55;

    let color = mixColor(waterColor, landColor, landWeight);

    const coast = clamp01(
      safeNumber(land && (land.coastPotential || land.shorelineContact), 0) * 0.55 +
      safeNumber(water && (water.coastPotential || water.shorelineContact || water.wetEdge), 0) * 0.45
    );

    const relief = clamp01(
      safeNumber(land && (land.reliefStrength || land.terrainRelief || land.groundSeat), 0)
    );

    if (coast > 0.18) {
      color = mixColor(color, [188, 158, 104], coast * 0.12);
    }

    if (landWeight > 0.48) {
      color = mixColor(color, [142, 116, 72], relief * 0.18);
      color = mixColor(color, [54, 58, 48], clamp01(safeNumber(land && land.underlandShadow, 0)) * 0.16);
    } else {
      color = mixColor(color, [4, 36, 88], clamp01(safeNumber(water && water.waterDepth, 0.55)) * 0.28);
    }

    color = mixColor(color, airColor, airAlpha * 0.09);

    const contrastBase = luma(color);
    if (contrastBase < 0.16) color = mixColor(color, [64, 88, 110], 0.22);
    if (contrastBase > 0.78) color = mixColor(color, [34, 42, 54], 0.12);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousCanvasContract: PREVIOUS_CONTRACT,
      supersedesCanvasContract: SUPERSEDES_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-receipt-toggle-inspection-recovery",
      x: vector.x,
      y: vector.y,
      z: vector.z,
      u: uv.u,
      v: uv.v,
      lon: uv.lon,
      lat: uv.lat,
      rgb: color,
      color,
      alpha: 1,
      handshake: hex,
      hexHandshakeLoaded: Boolean(hex),
      fourPairPixelSet: hex && Array.isArray(hex.fourPairSet) ? hex.fourPairSet : [],
      bodyBoundaryAuthority: Boolean(hex && hex.everyPixelHasFourPairSet),
      planetaryBoundarySource: "hex-four-pair-body-handshake",
      atmosphereDefinesBoundary: false,
      land,
      water,
      air,
      landWeight,
      waterWeight: clamp01(waterAlpha / total),
      airWeight: airAlpha,
      bodyLock: Boolean(hex) ? 1 : 0.72,
      contrastDelta: Math.abs(luma(landColor) - luma(waterColor)) * 255,
      contrastAdjusted: true,
      opaqueBodyTexture: true,
      landChannelLoaded: Boolean(state.authorities.land),
      waterChannelLoaded: Boolean(state.authorities.water),
      airChannelLoaded: Boolean(state.authorities.air),
      channelMultiplexReady: Boolean(state.authorities.land || state.authorities.water || state.authorities.air),
      channelMultiplexDegraded: !(state.authorities.land && state.authorities.water && state.authorities.air),
      canvasOwnsLandTruth: false,
      canvasOwnsWaterTruth: false,
      canvasOwnsAirTruth: false,
      canvasOwnsHexHandshakeLaw: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  function createCanvas(size) {
    const doc = getDocument();
    const canvas = doc.createElement("canvas");
    const resolvedSize = Math.max(260, Math.round(size));

    canvas.width = resolvedSize;
    canvas.height = resolvedSize;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Inspectable Hearth planet carrier");
    canvas.dataset.hearthCanvasManaged = "true";
    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSupersedesContract = SUPERSEDES_CONTRACT;
    canvas.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthCanvasBaselineContract = BASELINE_CONTRACT;
    canvas.dataset.hearthCanvasVisibleCarrier = "true";
    canvas.dataset.hearthCanvasShellFirst = "true";
    canvas.dataset.hearthCanvasPlanConsumer = "true";
    canvas.dataset.hearthCanvasHexFourPairBoundary = "true";
    canvas.dataset.hearthCanvasOwnsHexHandshakeLaw = "false";
    canvas.dataset.hearthCanvasOwnsLandTruth = "false";
    canvas.dataset.hearthCanvasOwnsWaterTruth = "false";
    canvas.dataset.hearthCanvasOwnsAirTruth = "false";
    canvas.dataset.hearthPlanetBoundarySource = "hex-four-pair-body-handshake";
    canvas.dataset.hearthAtmosphereDefinesBoundary = "false";
    canvas.dataset.hearthOpaqueBodyTexture = "true";
    canvas.dataset.hearthReceiptToggleAvailable = "true";
    canvas.dataset.hearthInspectionModeAvailable = "true";
    canvas.dataset.hearthReceiptOverlayNonBlocking = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    canvas.style.width = "min(100%, 460px)";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "999px";
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";

    return canvas;
  }

  function createAtlas(width, height) {
    const doc = getDocument();
    const canvas = doc.createElement("canvas");

    canvas.width = Math.max(64, Math.round(width));
    canvas.height = Math.max(32, Math.round(height));

    return canvas;
  }

  function drawFallbackShell(state) {
    const canvas = state.canvas;
    const ctx = state.ctx;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * state.options.radiusRatio;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const body = ctx.createRadialGradient(
      cx - radius * 0.3,
      cy - radius * 0.34,
      radius * 0.04,
      cx,
      cy,
      radius
    );

    body.addColorStop(0, "rgba(86,116,126,1)");
    body.addColorStop(0.32, "rgba(32,72,112,1)");
    body.addColorStop(0.62, "rgba(17,54,100,1)");
    body.addColorStop(1, "rgba(5,16,34,1)");

    ctx.fillStyle = body;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    drawAtmosphere(state);

    state.imageRendered = true;
    state.canvas.dataset.hearthCanvasFallbackShellPainted = "true";
    state.canvas.dataset.hearthCanvasNeutralLoadingShell = "true";
    state.canvas.dataset.hearthCanvasImageRendered = "true";
  }

  function sampleAtlasColor(state, u, v) {
    if (!state.atlasData) return [10, 54, 106];

    const width = state.atlasWidth;
    const height = state.atlasHeight;
    const x = wrap01(u) * (width - 1);
    const y = clamp01(v) * (height - 1);

    const x0 = Math.floor(x);
    const x1 = (x0 + 1) % width;
    const y0 = Math.floor(y);
    const y1 = Math.min(height - 1, y0 + 1);
    const tx = x - x0;
    const ty = y - y0;

    function read(px, py) {
      const index = (py * width + px) * 4;
      return [
        state.atlasData[index],
        state.atlasData[index + 1],
        state.atlasData[index + 2]
      ];
    }

    const c00 = read(x0, y0);
    const c10 = read(x1, y0);
    const c01 = read(x0, y1);
    const c11 = read(x1, y1);

    return [
      Math.round(mix(mix(c00[0], c10[0], tx), mix(c01[0], c11[0], tx), ty)),
      Math.round(mix(mix(c00[1], c10[1], tx), mix(c01[1], c11[1], tx), ty)),
      Math.round(mix(mix(c00[2], c10[2], tx), mix(c01[2], c11[2], tx), ty))
    ];
  }

  function drawAtmosphere(state) {
    const ctx = state.ctx;
    const size = state.canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * state.options.radiusRatio;

    ctx.save();

    const edge = ctx.createRadialGradient(cx, cy, radius * 0.62, cx, cy, radius * 1.02);
    edge.addColorStop(0, "rgba(0,0,0,0)");
    edge.addColorStop(0.78, "rgba(5,14,30,0.18)");
    edge.addColorStop(1, "rgba(0,0,0,0.58)");

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = edge;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(188,222,246,0.30)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(2, size * 0.012), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(102,178,230,0.12)";
    ctx.lineWidth = Math.max(1, size * 0.006);
    ctx.stroke();

    ctx.restore();
  }

  function renderSphere(state) {
    const canvas = state.canvas;
    const ctx = state.ctx;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * state.options.radiusRatio;

    if (!state.atlasReady) {
      drawFallbackShell(state);
      return;
    }

    const image = ctx.createImageData(size, size);
    const data = image.data;

    const light = normalize3({
      x: state.options.lightX,
      y: state.options.lightY,
      z: state.options.lightZ
    });

    for (let py = 0; py < size; py += 1) {
      const y = (py + 0.5 - cy) / radius;

      for (let px = 0; px < size; px += 1) {
        const x = (px + 0.5 - cx) / radius;
        const r2 = x * x + y * y;
        const out = (py * size + px) * 4;

        if (r2 > 1) {
          data[out] = 0;
          data[out + 1] = 0;
          data[out + 2] = 0;
          data[out + 3] = 0;
          continue;
        }

        const z = Math.sqrt(Math.max(0, 1 - r2));

        let vector = normalize3({
          x,
          y: -y,
          z
        });

        vector = rotateX(vector, state.tilt);
        vector = rotateY(vector, state.phase);

        const uv = vectorToUv(vector);
        let color = sampleAtlasColor(state, uv.u, uv.v);

        const normal = normalize3({ x, y: -y, z });
        const lightValue = clamp01(normal.x * light.x + normal.y * light.y + normal.z * light.z);
        const limb = clamp01(1 - z);
        const shade = clamp(0.62 + z * 0.34 + lightValue * 0.18 - limb * 0.24, 0.34, 1.08);

        color = multiplyColor(color, shade);

        data[out] = color[0];
        data[out + 1] = color[1];
        data[out + 2] = color[2];
        data[out + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);
    drawAtmosphere(state);

    state.frames += 1;
    state.imageRendered = true;
    state.canvas.dataset.hearthCanvasImageRendered = "true";
    state.canvas.dataset.hearthCanvasRenderedFromCachedAtlas = "true";
    state.canvas.dataset.hearthCanvasFrames = String(state.frames);
    state.canvas.dataset.hearthCanvasAtlasReady = "true";
    state.canvas.dataset.hearthCanvasAtlasProgress = "1";
  }

  function buildAtlas(state) {
    state.atlasReady = false;
    state.atlasBuilding = true;
    state.atlasProgress = 0;

    const width = state.atlasWidth;
    const height = state.atlasHeight;
    const atlasCtx = state.atlasCtx;
    const image = atlasCtx.createImageData(width, height);
    const data = image.data;
    const rowsPerChunk = Math.max(1, Math.round(state.options.rowsPerChunk || DEFAULTS.rowsPerChunk));

    let row = 0;

    state.canvas.dataset.hearthCanvasAtlasReady = "false";
    state.canvas.dataset.hearthCanvasAtlasBuilding = "true";
    state.canvas.dataset.hearthCanvasAtlasProgress = "0";

    function processChunk() {
      const end = Math.min(height, row + rowsPerChunk);

      for (; row < end; row += 1) {
        const v = (row + 0.5) / height;

        for (let column = 0; column < width; column += 1) {
          const u = (column + 0.5) / width;
          const vector = uvToVector(u, v);
          const sample = composePlanetSample(state, vector);
          const color = sample.color;
          const out = (row * width + column) * 4;

          data[out] = color[0];
          data[out + 1] = color[1];
          data[out + 2] = color[2];
          data[out + 3] = 255;
        }
      }

      state.atlasProgress = clamp01(row / height);
      state.canvas.dataset.hearthCanvasAtlasProgress = String(state.atlasProgress);

      updateReceiptPanel(state);

      if (row < height) {
        requestFrame(processChunk);
        return;
      }

      atlasCtx.putImageData(image, 0, 0);

      state.atlasData = data;
      state.atlasReady = true;
      state.atlasBuilding = false;
      state.atlasProgress = 1;
      state.canvas.dataset.hearthCanvasAtlasReady = "true";
      state.canvas.dataset.hearthCanvasAtlasBuilding = "false";
      state.canvas.dataset.hearthCanvasAtlasProgress = "1";

      renderSphere(state);
      publishState(state);
      updateReceiptPanel(state);
    }

    requestFrame(processChunk);
  }

  function createButton(doc, label, handler) {
    const button = doc.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.dataset.hearthReceiptControl = label.toLowerCase().replace(/\s+/g, "-");
    button.style.pointerEvents = "auto";
    button.style.border = "1px solid rgba(174,201,225,0.34)";
    button.style.background = "rgba(16,31,49,0.86)";
    button.style.color = "rgba(235,243,250,0.96)";
    button.style.borderRadius = "999px";
    button.style.padding = "0.48rem 0.72rem";
    button.style.font = "600 0.78rem/1.1 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    button.style.letterSpacing = "0.01em";
    button.style.cursor = "pointer";
    button.style.touchAction = "manipulation";

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      handler();
    });

    return button;
  }

  function createReceiptPanel(state) {
    const doc = getDocument();

    const panel = doc.createElement("aside");
    panel.dataset.hearthReceiptPanel = "true";
    panel.dataset.hearthCanvasManaged = "true";
    panel.dataset.hearthReceiptContract = CONTRACT;
    panel.dataset.hearthReceiptMode = state.receiptMode;
    panel.dataset.hearthReceiptVisible = boolString(state.receiptVisible);
    panel.dataset.hearthInspectionMode = boolString(state.inspectionMode);

    panel.style.position = "absolute";
    panel.style.left = "clamp(12px, 5%, 32px)";
    panel.style.right = "clamp(12px, 5%, 32px)";
    panel.style.bottom = "clamp(18px, 9%, 44px)";
    panel.style.zIndex = "5";
    panel.style.border = "1px solid rgba(174,201,225,0.26)";
    panel.style.background = "linear-gradient(180deg, rgba(11,17,29,0.89), rgba(6,12,22,0.78))";
    panel.style.backdropFilter = "blur(10px)";
    panel.style.borderRadius = "22px";
    panel.style.boxShadow = "0 18px 50px rgba(0,0,0,0.35)";
    panel.style.padding = "1rem";
    panel.style.color = "rgba(238,244,250,0.96)";
    panel.style.pointerEvents = "none";
    panel.style.maxHeight = "58%";
    panel.style.overflow = "hidden";

    const titleRow = doc.createElement("div");
    titleRow.style.display = "flex";
    titleRow.style.alignItems = "center";
    titleRow.style.justifyContent = "space-between";
    titleRow.style.gap = "1rem";
    titleRow.style.pointerEvents = "none";

    const title = doc.createElement("strong");
    title.textContent = "HEARTH HEX BOUNDARY PLAN";
    title.style.display = "block";
    title.style.font = "800 0.95rem/1.15 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    title.style.letterSpacing = "0.11em";

    const percent = doc.createElement("span");
    percent.dataset.hearthReceiptPercent = "true";
    percent.textContent = "0%";
    percent.style.font = "600 0.9rem/1 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    percent.style.opacity = "0.8";

    titleRow.appendChild(title);
    titleRow.appendChild(percent);

    const bar = doc.createElement("div");
    bar.style.height = "5px";
    bar.style.margin = "0.72rem 0 0.88rem";
    bar.style.borderRadius = "999px";
    bar.style.background = "rgba(174,201,225,0.18)";
    bar.style.overflow = "hidden";

    const fill = doc.createElement("div");
    fill.dataset.hearthReceiptProgress = "true";
    fill.style.height = "100%";
    fill.style.width = "0%";
    fill.style.borderRadius = "999px";
    fill.style.background = "rgba(185,222,242,0.9)";

    bar.appendChild(fill);

    const controls = doc.createElement("div");
    controls.dataset.hearthReceiptControls = "true";
    controls.style.display = "flex";
    controls.style.flexWrap = "wrap";
    controls.style.gap = "0.48rem";
    controls.style.alignItems = "center";
    controls.style.pointerEvents = "auto";
    controls.style.marginBottom = "0.86rem";

    const inspectButton = createButton(doc, "Inspect Hearth", () => {
      setReceiptVisible(state, false, true);
    });

    const hideButton = createButton(doc, "Hide receipt", () => {
      setReceiptVisible(state, false, false);
    });

    const modeButton = createButton(doc, "Expand receipt", () => {
      state.receiptMode = state.receiptMode === "expanded" ? "compact" : "expanded";
      state.inspectionMode = false;
      updateReceiptPanel(state);
      publishState(state);
    });

    const copyButton = createButton(doc, "Copy diagnostic", () => {
      copyDiagnostic(state);
    });

    controls.appendChild(inspectButton);
    controls.appendChild(hideButton);
    controls.appendChild(modeButton);
    controls.appendChild(copyButton);

    const compact = doc.createElement("div");
    compact.dataset.hearthReceiptCompact = "true";
    compact.style.display = "grid";
    compact.style.gap = "0.42rem";
    compact.style.pointerEvents = "none";

    const expanded = doc.createElement("pre");
    expanded.dataset.hearthReceiptExpanded = "true";
    expanded.style.display = "none";
    expanded.style.margin = "0";
    expanded.style.whiteSpace = "pre-wrap";
    expanded.style.wordBreak = "break-word";
    expanded.style.maxHeight = "42vh";
    expanded.style.overflow = "auto";
    expanded.style.pointerEvents = "auto";
    expanded.style.font = "500 0.72rem/1.35 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";
    expanded.style.color = "rgba(220,232,241,0.92)";
    expanded.style.background = "rgba(2,8,16,0.38)";
    expanded.style.border = "1px solid rgba(174,201,225,0.14)";
    expanded.style.borderRadius = "14px";
    expanded.style.padding = "0.72rem";

    panel.appendChild(titleRow);
    panel.appendChild(bar);
    panel.appendChild(controls);
    panel.appendChild(compact);
    panel.appendChild(expanded);

    const showButton = createButton(doc, "Show receipt", () => {
      setReceiptVisible(state, true, false);
    });

    showButton.dataset.hearthReceiptShowButton = "true";
    showButton.dataset.hearthCanvasManaged = "true";
    showButton.style.position = "absolute";
    showButton.style.right = "clamp(12px, 5%, 28px)";
    showButton.style.bottom = "clamp(14px, 5%, 28px)";
    showButton.style.zIndex = "6";
    showButton.style.display = "none";
    showButton.style.boxShadow = "0 10px 32px rgba(0,0,0,0.34)";

    state.receiptPanel = panel;
    state.receiptCompact = compact;
    state.receiptExpanded = expanded;
    state.receiptProgress = fill;
    state.receiptPercent = percent;
    state.receiptModeButton = modeButton;
    state.showReceiptButton = showButton;

    state.stage.appendChild(panel);
    state.stage.appendChild(showButton);

    updateReceiptPanel(state);
  }

  function row(label, value) {
    return `
      <div style="display:grid;grid-template-columns:auto 1fr auto;gap:0.65rem;align-items:center;">
        <span style="opacity:.9;">✓</span>
        <span>${label}</span>
        <span style="font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;opacity:.78;">${value}</span>
      </div>
    `;
  }

  function updateReceiptPanel(state) {
    if (!state.receiptPanel) return;

    const progress = state.atlasReady ? 1 : clamp01(state.atlasProgress);
    const percent = `${Math.round(progress * 100)}%`;

    state.receiptPanel.dataset.hearthReceiptMode = state.receiptMode;
    state.receiptPanel.dataset.hearthReceiptVisible = boolString(state.receiptVisible);
    state.receiptPanel.dataset.hearthInspectionMode = boolString(state.inspectionMode);
    state.receiptPanel.style.display = state.receiptVisible ? "block" : "none";

    if (state.showReceiptButton) {
      state.showReceiptButton.style.display = state.receiptVisible ? "none" : "inline-flex";
    }

    if (state.receiptProgress) {
      state.receiptProgress.style.width = percent;
    }

    if (state.receiptPercent) {
      state.receiptPercent.textContent = percent;
    }

    if (state.receiptModeButton) {
      state.receiptModeButton.textContent = state.receiptMode === "expanded" ? "Compact receipt" : "Expand receipt";
    }

    if (state.receiptCompact) {
      state.receiptCompact.style.display = state.receiptMode === "compact" ? "grid" : "none";
      state.receiptCompact.innerHTML = [
        row("Hex authority", state.authorities.hex ? "loaded" : "fallback"),
        row("Four-pair boundary", state.hexValidation.validationOk ? "ready" : "degraded"),
        row("Land channel", state.authorities.land ? "loaded" : "fallback"),
        row("Water channel", state.authorities.water ? "loaded" : "fallback"),
        row("Air channel", state.authorities.air ? "loaded" : "fallback"),
        row("Atlas", state.atlasReady ? "ready" : "building"),
        row("Inspection", state.controlsBound ? "active" : "pending")
      ].join("");
    }

    if (state.receiptExpanded) {
      state.receiptExpanded.style.display = state.receiptMode === "expanded" ? "block" : "none";
      state.receiptExpanded.textContent = generateDiagnosticExport(state);
    }

    if (state.stage) {
      state.stage.dataset.hearthReceiptVisible = boolString(state.receiptVisible);
      state.stage.dataset.hearthReceiptMode = state.receiptMode;
      state.stage.dataset.hearthInspectionMode = boolString(state.inspectionMode);
    }

    if (state.canvas) {
      state.canvas.dataset.hearthReceiptVisible = boolString(state.receiptVisible);
      state.canvas.dataset.hearthReceiptMode = state.receiptMode;
      state.canvas.dataset.hearthInspectionMode = boolString(state.inspectionMode);
      state.canvas.dataset.hearthReceiptPanelBlocksInspection = "false";
    }
  }

  function setReceiptVisible(state, visible, inspectMode) {
    state.receiptVisible = Boolean(visible);
    state.inspectionMode = Boolean(inspectMode);
    state.receiptMode = visible ? state.receiptMode : "compact";

    if (state.canvas) {
      state.canvas.style.cursor = "grab";
    }

    updateReceiptPanel(state);
    publishState(state);
  }

  function copyText(text) {
    const doc = getDocument();

    if (root.navigator && root.navigator.clipboard && typeof root.navigator.clipboard.writeText === "function") {
      return root.navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
      if (!doc || !doc.body) {
        reject(new Error("clipboard-unavailable"));
        return;
      }

      const textarea = doc.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";

      doc.body.appendChild(textarea);
      textarea.select();

      try {
        doc.execCommand("copy");
        doc.body.removeChild(textarea);
        resolve();
      } catch (error) {
        doc.body.removeChild(textarea);
        reject(error);
      }
    });
  }

  function copyDiagnostic(state) {
    const exportText = generateDiagnosticExport(state);

    copyText(exportText)
      .then(() => {
        state.lastCopyStatus = "COPIED";
        state.lastCopyAt = nowIso();
        publishState(state);
        updateReceiptPanel(state);
      })
      .catch((error) => {
        state.lastCopyStatus = error && error.message ? error.message : "COPY_FAILED";
        state.lastCopyAt = nowIso();
        publishState(state);
        updateReceiptPanel(state);
      });
  }

  function bindControls(state) {
    const canvas = state.canvas;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    function pointerPoint(event) {
      if (event.touches && event.touches.length) {
        return {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      }

      return {
        x: event.clientX,
        y: event.clientY
      };
    }

    function start(event) {
      const point = pointerPoint(event);

      dragging = true;
      lastX = point.x;
      lastY = point.y;
      canvas.style.cursor = "grabbing";

      if (event.cancelable) event.preventDefault();
    }

    function move(event) {
      if (!dragging) return;

      const point = pointerPoint(event);
      const dx = point.x - lastX;
      const dy = point.y - lastY;

      lastX = point.x;
      lastY = point.y;

      state.phase += dx * 0.008;
      state.tilt = clamp(state.tilt + dy * 0.006, -1.05, 1.05);

      renderSphere(state);
      publishState(state);

      if (event.cancelable) event.preventDefault();
    }

    function end() {
      dragging = false;
      canvas.style.cursor = "grab";
    }

    canvas.addEventListener("pointerdown", start);
    root.addEventListener("pointermove", move, { passive: false });
    root.addEventListener("pointerup", end);
    root.addEventListener("pointercancel", end);

    canvas.addEventListener("touchstart", start, { passive: false });
    root.addEventListener("touchmove", move, { passive: false });
    root.addEventListener("touchend", end);

    state.controlsBound = true;
    canvas.dataset.hearthCanvasControlsBound = "true";

    return {
      destroy() {
        canvas.removeEventListener("pointerdown", start);
        root.removeEventListener("pointermove", move);
        root.removeEventListener("pointerup", end);
        root.removeEventListener("pointercancel", end);
        canvas.removeEventListener("touchstart", start);
        root.removeEventListener("touchmove", move);
        root.removeEventListener("touchend", end);
      }
    };
  }

  function validateAllAuthorities(state) {
    state.hexValidation = validateAuthority("hex", EXPECTED.hex);
    state.landValidation = validateAuthority("land", EXPECTED.land);
    state.waterValidation = validateAuthority("water", EXPECTED.water);
    state.airValidation = validateAuthority("air", EXPECTED.air);

    return {
      hex: state.hexValidation,
      land: state.landValidation,
      water: state.waterValidation,
      air: state.airValidation
    };
  }

  function refreshAuthorities(state) {
    state.authorities.hex = resolveAuthority("hex");
    state.authorities.land = resolveAuthority("land");
    state.authorities.water = resolveAuthority("water");
    state.authorities.air = resolveAuthority("air");
    state.authorities.runtimeTable = resolveAuthority("runtimeTable");

    validateAllAuthorities(state);

    return state.authorities;
  }

  function loadChildAuthorities(state) {
    const plan = [
      {
        key: "hex",
        path: CHILD_PATHS.hex,
        cache: CACHE.hex,
        marker: "hearth-hex-four-pair-authority"
      },
      {
        key: "land",
        path: CHILD_PATHS.land,
        cache: CACHE.land,
        marker: "hearth-land-channel"
      },
      {
        key: "water",
        path: CHILD_PATHS.water,
        cache: CACHE.water,
        marker: "hearth-water-channel"
      },
      {
        key: "air",
        path: CHILD_PATHS.air,
        cache: CACHE.air,
        marker: "hearth-air-channel"
      }
    ];

    const results = [];

    return plan.reduce((chain, item) => {
      return chain.then(() => {
        refreshAuthorities(state);

        if (state.authorities[item.key]) {
          const result = {
            key: item.key,
            path: item.path,
            loaded: true,
            alreadyPresent: true,
            validationOk: true,
            coordinate: "C11_CHILD_ALREADY_PRESENT",
            error: ""
          };

          results.push(result);
          state.authorityLoadResults = results.slice();
          return result;
        }

        return loadScript(item.path, item.cache, item.marker).then((loadResult) => {
          refreshAuthorities(state);

          const result = {
            key: item.key,
            path: item.path,
            loaded: Boolean(loadResult.loaded),
            alreadyPresent: Boolean(loadResult.alreadyPresent),
            validationOk: Boolean(state.authorities[item.key]),
            coordinate: state.authorities[item.key] ? "C11_CHILD_VALIDATED" : "C07_CHILD_UNAVAILABLE_FALLBACK_ALLOWED",
            error: loadResult.error || ""
          };

          results.push(result);
          state.authorityLoadResults = results.slice();

          publishState(state);
          updateReceiptPanel(state);

          return result;
        });
      });
    }, Promise.resolve()).then(() => {
      refreshAuthorities(state);
      return results;
    });
  }

  function publishState(state) {
    const canvas = state.canvas;

    const datasetPairs = {
      hearthCanvasTexture: "true",
      hearthCanvasContract: CONTRACT,
      hearthCanvasReceipt: RECEIPT,
      hearthCanvasSupersedesContract: SUPERSEDES_CONTRACT,
      hearthCanvasPreviousContract: PREVIOUS_CONTRACT,
      hearthCanvasBaselineContract: BASELINE_CONTRACT,
      hearthCanvasVisibleCarrier: "true",
      hearthCanvasShellFirst: "true",
      hearthCanvasPlanConsumer: "true",
      hearthCanvasHexFourPairBoundary: "true",
      hearthCanvasOwnsHexHandshakeLaw: "false",
      hearthCanvasOwnsLandTruth: "false",
      hearthCanvasOwnsWaterTruth: "false",
      hearthCanvasOwnsAirTruth: "false",
      hearthPlanetBoundarySource: "hex-four-pair-body-handshake",
      hearthAtmosphereDefinesBoundary: "false",
      hearthOpaqueBodyTexture: "true",

      hearthHexHandshakeAuthorityContract: EXPECTED.hex,
      hearthCanvasLandChannelContract: EXPECTED.land,
      hearthCanvasWaterChannelContract: EXPECTED.water,
      hearthCanvasAirChannelContract: EXPECTED.air,

      visualCarrierAllowed: "true",
      visualizationBlocked: "false",
      visualCarrierMode: "hex-four-pair-atlas-carrier-with-receipt-toggle",
      visualDiagnosticStatus: state.atlasReady ? "READY" : "BUILDING",
      visualDiagnosticCue: state.receiptVisible ? "RECEIPT_VISIBLE_NONBLOCKING" : "INSPECTION_AVAILABLE",

      hearthCanvasAtlasReady: boolString(state.atlasReady),
      hearthCanvasAtlasBuilding: boolString(state.atlasBuilding),
      hearthCanvasAtlasProgress: String(state.atlasProgress),
      hearthCanvasSphereContainment: "true",
      hearthCanvasOutsideSphereTransparent: "true",
      hearthCanvasNoRectangularTextureSpill: "true",

      hearthCanvasFallbackShellPainted: "true",
      hearthCanvasNeutralLoadingShell: state.atlasReady ? "false" : "true",
      hearthCanvasImageRendered: boolString(state.imageRendered),
      hearthCanvasControlsBound: boolString(state.controlsBound),
      hearthCanvasAuthorityLoaded: "true",

      hearthHexHandshakeAuthorityLoaded: boolString(state.authorities.hex),
      hearthHexFourPairSet: boolString(state.hexValidation && state.hexValidation.authorityPresent),
      hearthHexDirections: "north,south,east,west",
      hearthCanvasOpaqueBodyTexture: "true",
      hearthLandChannelLoaded: boolString(state.authorities.land),
      hearthWaterChannelLoaded: boolString(state.authorities.water),
      hearthAirChannelLoaded: boolString(state.authorities.air),

      waterFailureDoesNotBlockAtlas: "true",
      visualFailureDoesNotBlockInspection: "true",
      visualizationBlocksOnlyWhenCarrierUnsafe: "true",

      hearthReceiptToggleAvailable: "true",
      hearthReceiptVisible: boolString(state.receiptVisible),
      hearthReceiptMode: state.receiptMode,
      hearthReceiptCanBeHidden: "true",
      hearthReceiptCanBeExpanded: "true",
      hearthReceiptCanBeCopied: "true",
      hearthReceiptPanelBlocksInspection: "false",
      hearthInspectObjectAvailable: "true",
      hearthInspectionMode: boolString(state.inspectionMode),
      hearthObjectInspectionRestored: "true",

      constructionReadyIsNotCoherencePass: "true",
      imageRenderedIsNotCoherencePass: "true",
      coherentExpressionPassIsNotVisualPassClaim: "true",

      hearthDiagnosticExportAvailable: "true",
      hearthDiagnosticExportLength: String(generateDiagnosticExport(state).length),
      hearthDiagnosticLastCopyStatus: state.lastCopyStatus || "",
      hearthDiagnosticLastCopyAt: state.lastCopyAt || "",

      hearthAuthorityLoadResults: JSON.stringify(state.authorityLoadResults || []),
      hearthRuntimeTableLoaded: boolString(state.authorities.runtimeTable),
      hearthRuntimeTableActualContract: contractOf(state.authorities.runtimeTable),

      generatedImage: "false",
      graphicBox: "false",
      webgl: "false",
      routeMutation: "false",
      runtimeMutation: "false",
      controlsMutation: "false",
      visualPassClaimed: "false"
    };

    if (canvas && canvas.dataset) {
      Object.keys(datasetPairs).forEach((key) => {
        canvas.dataset[key] = safeString(datasetPairs[key]);
      });
    }

    writeRootDataset({
      hearthCanvasLoaded: "true",
      hearthCanvasContract: CONTRACT,
      hearthCanvasReceipt: RECEIPT,
      hearthCanvasSupersedesContract: SUPERSEDES_CONTRACT,
      hearthCanvasPreviousContract: PREVIOUS_CONTRACT,
      hearthCanvasReceiptToggleAvailable: "true",
      hearthObjectInspectionRestored: "true",
      hearthReceiptPanelBlocksInspection: "false",
      hearthVisiblePlanetCarrier: boolString(state.imageRendered || state.atlasReady),
      hearthVisibleGlobeMounted: "true",
      generatedImage: "false",
      graphicBox: "false",
      webgl: "false",
      visualPassClaimed: "false"
    });

    root.HEARTH_HEX_BODY_BOUNDARY_CANVAS_RECEIPT_EXPORT = generateDiagnosticExport(state);

    root.HEARTH_CANVAS_STATUS = {
      contract: CONTRACT,
      receipt: RECEIPT,
      supersedesContract: SUPERSEDES_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      atlasReady: state.atlasReady,
      atlasProgress: state.atlasProgress,
      imageRendered: state.imageRendered,
      controlsBound: state.controlsBound,
      receiptVisible: state.receiptVisible,
      receiptMode: state.receiptMode,
      inspectionMode: state.inspectionMode,
      receiptPanelBlocksInspection: false,
      objectInspectionRestored: true,
      hexAuthorityLoaded: Boolean(state.authorities.hex),
      landChannelLoaded: Boolean(state.authorities.land),
      waterChannelLoaded: Boolean(state.authorities.water),
      airChannelLoaded: Boolean(state.authorities.air),
      visualPassClaimed: false
    };

    return root.HEARTH_CANVAS_STATUS;
  }

  function generateDiagnosticExport(state) {
    const canvasDataset = state.canvas && state.canvas.dataset
      ? JSON.parse(JSON.stringify(state.canvas.dataset))
      : {};

    const anchorVector = normalize3({ x: 0, y: 0, z: 1 });
    const anchorSample = composePlanetSample(state, anchorVector);

    const exportObject = {
      timestamp: nowIso(),
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      supersedesCanvasContract: SUPERSEDES_CONTRACT,
      previousCanvasContract: PREVIOUS_CONTRACT,
      baselineCanvasContract: BASELINE_CONTRACT,
      version: VERSION,
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,

      hexAuthorityContract: EXPECTED.hex,
      hexAuthorityLoaded: Boolean(state.authorities.hex),
      landChannelLoaded: Boolean(state.authorities.land),
      waterChannelLoaded: Boolean(state.authorities.water),
      airChannelLoaded: Boolean(state.authorities.air),

      planetaryBoundarySource: "hex-four-pair-body-handshake",
      atmosphereDefinesBoundary: false,

      atlasReady: Boolean(state.atlasReady),
      atlasBuilding: Boolean(state.atlasBuilding),
      atlasProgress: state.atlasProgress,
      imageRendered: Boolean(state.imageRendered),
      controlsBound: Boolean(state.controlsBound),

      receiptToggleAvailable: true,
      receiptVisible: Boolean(state.receiptVisible),
      receiptMode: state.receiptMode,
      inspectionMode: Boolean(state.inspectionMode),
      receiptPanelBlocksInspection: false,
      objectInspectionRestored: true,

      constructionReadyIsNotCoherencePass: true,
      imageRenderedIsNotCoherencePass: true,
      coherentExpressionPassIsNotVisualPassClaim: true,
      visualPassClaimed: false,

      authorityLoadResults: state.authorityLoadResults || [],

      validations: {
        hex: state.hexValidation,
        land: state.landValidation,
        water: state.waterValidation,
        air: state.airValidation
      },

      canvasDataset,
      anchorSample
    };

    return [
      "HEARTH_HEX_BODY_BOUNDARY_CANVAS_RECEIPT_EXPORT",
      "",
      `timestamp=${exportObject.timestamp}`,
      `canvasContract=${exportObject.canvasContract}`,
      `canvasReceipt=${exportObject.canvasReceipt}`,
      `supersedesCanvasContract=${exportObject.supersedesCanvasContract}`,
      `previousCanvasContract=${exportObject.previousCanvasContract}`,
      `hexAuthorityContract=${exportObject.hexAuthorityContract}`,
      `hexAuthorityLoaded=${exportObject.hexAuthorityLoaded}`,
      `landChannelLoaded=${exportObject.landChannelLoaded}`,
      `waterChannelLoaded=${exportObject.waterChannelLoaded}`,
      `airChannelLoaded=${exportObject.airChannelLoaded}`,
      `planetaryBoundarySource=${exportObject.planetaryBoundarySource}`,
      `atmosphereDefinesBoundary=${exportObject.atmosphereDefinesBoundary}`,
      `atlasReady=${exportObject.atlasReady}`,
      `atlasProgress=${exportObject.atlasProgress}`,
      `imageRendered=${exportObject.imageRendered}`,
      `controlsBound=${exportObject.controlsBound}`,
      `receiptToggleAvailable=${exportObject.receiptToggleAvailable}`,
      `receiptVisible=${exportObject.receiptVisible}`,
      `receiptMode=${exportObject.receiptMode}`,
      `inspectionMode=${exportObject.inspectionMode}`,
      `receiptPanelBlocksInspection=${exportObject.receiptPanelBlocksInspection}`,
      `objectInspectionRestored=${exportObject.objectInspectionRestored}`,
      `visualPassClaimed=${exportObject.visualPassClaimed}`,
      "",
      "FULL_RECEIPT_JSON",
      JSON.stringify(exportObject, null, 2)
    ].join("\n");
  }

  function clearPriorManagedNodes(target) {
    if (!target || typeof target.querySelectorAll !== "function") return;

    const nodes = target.querySelectorAll("[data-hearth-canvas-managed='true']");

    Array.from(nodes).forEach((node) => {
      try {
        if (node && node.parentNode) node.parentNode.removeChild(node);
      } catch (_error) {}
    });
  }

  function createStage(target, options) {
    const doc = getDocument();
    const stage = doc.createElement("section");

    stage.dataset.hearthCanvasManaged = "true";
    stage.dataset.hearthCanvasStage = "true";
    stage.dataset.hearthCanvasContract = CONTRACT;
    stage.dataset.hearthCanvasReceipt = RECEIPT;
    stage.dataset.hearthReceiptToggleAvailable = "true";
    stage.dataset.hearthReceiptPanelBlocksInspection = "false";
    stage.dataset.hearthObjectInspectionRestored = "true";
    stage.dataset.generatedImage = "false";
    stage.dataset.graphicBox = "false";
    stage.dataset.webgl = "false";
    stage.dataset.visualPassClaimed = "false";

    stage.style.position = "relative";
    stage.style.display = "grid";
    stage.style.placeItems = "center";
    stage.style.width = "100%";
    stage.style.minHeight = `${Math.max(320, Math.round((options.size || DEFAULTS.size) * 0.92))}px`;
    stage.style.margin = "0 auto";
    stage.style.overflow = "hidden";
    stage.style.borderRadius = "28px";
    stage.style.isolation = "isolate";

    target.appendChild(stage);

    return stage;
  }

  function normalizeOptions(options = {}) {
    return {
      size: clamp(options.size || DEFAULTS.size, 260, 760),
      atlasWidth: clamp(options.atlasWidth || DEFAULTS.atlasWidth, 128, 1024),
      atlasHeight: clamp(options.atlasHeight || DEFAULTS.atlasHeight, 64, 512),
      rowsPerChunk: clamp(options.rowsPerChunk || DEFAULTS.rowsPerChunk, 1, 32),
      radiusRatio: clamp(options.radiusRatio || DEFAULTS.radiusRatio, 0.34, 0.49),
      tilt: Number.isFinite(Number(options.tilt)) ? Number(options.tilt) : DEFAULTS.tilt,
      phase: Number.isFinite(Number(options.phase)) ? Number(options.phase) : DEFAULTS.phase,
      lightX: Number.isFinite(Number(options.lightX)) ? Number(options.lightX) : DEFAULTS.lightX,
      lightY: Number.isFinite(Number(options.lightY)) ? Number(options.lightY) : DEFAULTS.lightY,
      lightZ: Number.isFinite(Number(options.lightZ)) ? Number(options.lightZ) : DEFAULTS.lightZ,
      receiptVisible: options.receiptVisible === undefined ? DEFAULTS.receiptVisible : Boolean(options.receiptVisible),
      receiptMode: options.receiptMode === "expanded" ? "expanded" : DEFAULTS.receiptMode,
      inspectionMode: Boolean(options.inspectionMode)
    };
  }

  function mount(target, options = {}) {
    const doc = getDocument();

    if (!doc) {
      throw new Error("HEARTH_CANVAS_DOCUMENT_UNAVAILABLE");
    }

    const mountTarget = target && target.nodeType === 1 ? target : doc.querySelector("[data-hearth-planet-mount]") || doc.body;

    if (!mountTarget) {
      throw new Error("HEARTH_CANVAS_MOUNT_TARGET_UNAVAILABLE");
    }

    const resolvedOptions = normalizeOptions(options);

    clearPriorManagedNodes(mountTarget);

    const stage = createStage(mountTarget, resolvedOptions);
    const canvas = createCanvas(resolvedOptions.size);
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });

    if (!ctx) {
      throw new Error("HEARTH_CANVAS_2D_CONTEXT_UNAVAILABLE");
    }

    const atlas = createAtlas(resolvedOptions.atlasWidth, resolvedOptions.atlasHeight);
    const atlasCtx = atlas.getContext("2d", { alpha: false, willReadFrequently: true });

    if (!atlasCtx) {
      throw new Error("HEARTH_CANVAS_ATLAS_CONTEXT_UNAVAILABLE");
    }

    stage.appendChild(canvas);

    const state = {
      contract: CONTRACT,
      receipt: RECEIPT,
      supersedesContract: SUPERSEDES_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,

      routeContract: options.routeContract || "",
      routeReceipt: options.routeReceipt || "",

      target: mountTarget,
      stage,
      canvas,
      ctx,
      atlas,
      atlasCtx,
      atlasWidth: atlas.width,
      atlasHeight: atlas.height,
      atlasData: null,

      options: resolvedOptions,
      phase: resolvedOptions.phase,
      tilt: resolvedOptions.tilt,

      authorities: {
        hex: null,
        land: null,
        water: null,
        air: null,
        runtimeTable: null
      },

      authorityLoadResults: [],
      hexValidation: {},
      landValidation: {},
      waterValidation: {},
      airValidation: {},

      atlasReady: false,
      atlasBuilding: false,
      atlasProgress: 0,
      imageRendered: false,
      controlsBound: false,
      frames: 0,

      receiptVisible: resolvedOptions.receiptVisible,
      receiptMode: resolvedOptions.receiptMode,
      inspectionMode: resolvedOptions.inspectionMode,
      lastCopyStatus: "",
      lastCopyAt: "",

      receiptPanel: null,
      receiptCompact: null,
      receiptExpanded: null,
      receiptProgress: null,
      receiptPercent: null,
      receiptModeButton: null,
      showReceiptButton: null,

      controls: null
    };

    refreshAuthorities(state);
    drawFallbackShell(state);
    createReceiptPanel(state);
    state.controls = bindControls(state);

    publishState(state);
    updateReceiptPanel(state);

    loadChildAuthorities(state)
      .then(() => {
        refreshAuthorities(state);
        publishState(state);
        updateReceiptPanel(state);
        buildAtlas(state);
      })
      .catch(() => {
        refreshAuthorities(state);
        publishState(state);
        updateReceiptPanel(state);
        buildAtlas(state);
      });

    const mountApi = {
      contract: CONTRACT,
      receipt: RECEIPT,
      supersedesContract: SUPERSEDES_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      canvas,
      stage,
      state,
      controlsBound: true,

      hideReceipt() {
        setReceiptVisible(state, false, false);
        return publishState(state);
      },

      showReceipt() {
        setReceiptVisible(state, true, false);
        return publishState(state);
      },

      inspectObject() {
        setReceiptVisible(state, false, true);
        return publishState(state);
      },

      expandReceipt() {
        state.receiptVisible = true;
        state.receiptMode = "expanded";
        state.inspectionMode = false;
        updateReceiptPanel(state);
        return publishState(state);
      },

      compactReceipt() {
        state.receiptVisible = true;
        state.receiptMode = "compact";
        state.inspectionMode = false;
        updateReceiptPanel(state);
        return publishState(state);
      },

      copyDiagnostic() {
        copyDiagnostic(state);
        return generateDiagnosticExport(state);
      },

      generateDiagnosticExport() {
        return generateDiagnosticExport(state);
      },

      getStatus() {
        return publishState(state);
      },

      getReceipt() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          supersedesContract: SUPERSEDES_CONTRACT,
          previousContract: PREVIOUS_CONTRACT,
          baselineContract: BASELINE_CONTRACT,
          version: VERSION,
          planetId: PLANET_ID,
          planetLabel: PLANET_LABEL,
          atlasReady: state.atlasReady,
          imageRendered: state.imageRendered,
          controlsBound: state.controlsBound,
          receiptToggleAvailable: true,
          receiptVisible: state.receiptVisible,
          receiptMode: state.receiptMode,
          inspectionMode: state.inspectionMode,
          receiptPanelBlocksInspection: false,
          objectInspectionRestored: true,
          hexAuthorityLoaded: Boolean(state.authorities.hex),
          landChannelLoaded: Boolean(state.authorities.land),
          waterChannelLoaded: Boolean(state.authorities.water),
          airChannelLoaded: Boolean(state.authorities.air),
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false
        };
      },

      remountAtlas() {
        refreshAuthorities(state);
        buildAtlas(state);
        return publishState(state);
      },

      dispose() {
        if (state.controls && typeof state.controls.destroy === "function") {
          state.controls.destroy();
        }

        clearPriorManagedNodes(mountTarget);
        state.disposed = true;
      }
    };

    root.HEARTH_CANVAS_MOUNT_API = mountApi;
    root.HEARTH_HEX_BODY_BOUNDARY_CANVAS_RECEIPT_EXPORT = generateDiagnosticExport(state);

    return mountApi;
  }

  function createShellFirstMount(target, options = {}) {
    return mount(target, options);
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      supersedesContract: SUPERSEDES_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-receipt-toggle-inspection-recovery",
      destinationFile: "/assets/hearth/hearth.canvas.js",
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,
      expectedContracts: EXPECTED,
      childPaths: CHILD_PATHS,
      owns: [
        "visible-canvas-carrier",
        "atlas-render-cache",
        "receipt-panel-visibility",
        "receipt-copy-export",
        "inspection-mode-toggle",
        "touch-drag-inspection-binding",
        "canvas-dataset-receipts"
      ],
      doesNotOwn: [
        "hex handshake law",
        "land truth",
        "water truth",
        "air truth",
        "hydrology truth",
        "elevation generation",
        "material palette generation",
        "runtime route orchestration",
        "final visual pass claim"
      ],
      receiptToggleAvailable: true,
      receiptPanelBlocksInspection: false,
      objectInspectionRestored: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      supersedesContract: SUPERSEDES_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      apiReady: true,
      mountReady: true,
      createShellFirstMountReady: true,
      receiptToggleAvailable: true,
      objectInspectionRestored: true,
      receiptPanelBlocksInspection: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    supersedesContract: SUPERSEDES_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    authority: "hearth-canvas-receipt-toggle-inspection-recovery",

    mount,
    createShellFirstMount,
    getReceipt,
    getStatus,

    expectedContracts: EXPECTED,
    childPaths: CHILD_PATHS,

    receiptToggleAvailable: true,
    receiptCanBeHidden: true,
    receiptCanBeExpanded: true,
    receiptCanBeCopied: true,
    objectInspectionRestored: true,
    receiptPanelBlocksInspection: false,

    hexFourPairBoundaryCarrier: true,
    planetaryBoundarySource: "hex-four-pair-body-handshake",
    atmosphereDefinesBoundary: false,

    ownsHexHandshakeLaw: false,
    ownsLandTruth: false,
    ownsWaterTruth: false,
    ownsAirTruth: false,
    ownsRuntimeMotion: false,
    ownsControlsTruth: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    routeMutation: false,
    runtimeMutation: false,
    controlsMutation: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;
  root.HEARTH_CANVAS = api;
  root.HearthCanvas = api;

  root.HEARTH_CANVAS_CONTRACT = CONTRACT;
  root.HEARTH_CANVAS_RECEIPT = RECEIPT;
  root.HEARTH_CANVAS_STATUS = getStatus();

  writeRootDataset({
    hearthCanvasAuthorityLoaded: "true",
    hearthCanvasContract: CONTRACT,
    hearthCanvasReceipt: RECEIPT,
    hearthCanvasSupersedesContract: SUPERSEDES_CONTRACT,
    hearthCanvasPreviousContract: PREVIOUS_CONTRACT,
    hearthCanvasBaselineContract: BASELINE_CONTRACT,
    hearthReceiptToggleAvailable: "true",
    hearthReceiptCanBeHidden: "true",
    hearthReceiptCanBeExpanded: "true",
    hearthReceiptCanBeCopied: "true",
    hearthObjectInspectionRestored: "true",
    hearthReceiptPanelBlocksInspection: "false",
    hearthPlanetBoundarySource: "hex-four-pair-body-handshake",
    hearthAtmosphereDefinesBoundary: "false",
    generatedImage: "false",
    graphicBox: "false",
    webgl: "false",
    visualPassClaimed: "false"
  });

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
