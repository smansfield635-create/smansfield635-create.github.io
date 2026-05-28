// /assets/hearth/hearth.canvas.js
// HEARTH_CHANNEL_MULTIPLEX_SEMICONDUCTOR_CANVAS_TNT_v4
// Full-file replacement.
// Canvas / mount / multiplex outlet authority only.
// Purpose:
// - Preserve v3 shell-first nonblocking mount.
// - Preserve immediate thumb / pointer drag.
// - Connect land, water, and air channel children.
// - Behave as semiconductor-style outlet: conduct, gate, synchronize, project, and composite.
// - Decide no channel truth.
// - Keep land/water body-bound and air floating above the body.
// Does not own:
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology classification
// - material palette authority
// - ocean authority generation
// - land channel truth
// - water channel truth
// - air channel truth
// - route orchestration
// - runtime motion
// - external controls authority
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CHANNEL_MULTIPLEX_SEMICONDUCTOR_CANVAS_TNT_v4";
  const RECEIPT = "HEARTH_CHANNEL_MULTIPLEX_SEMICONDUCTOR_CANVAS_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "HEARTH_TRUE_SHELL_FIRST_NONBLOCKING_CANVAS_TNT_v3";
  const VERSION = "2026-05-28.hearth-channel-multiplex-semiconductor-canvas-v4";

  const LAND_CONTRACT = "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1";
  const WATER_CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";
  const AIR_CONTRACT = "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;
  const TWO_PI = Math.PI * 2;

  const CHANNEL_FILES = Object.freeze([
    {
      key: "land",
      path: "/assets/hearth/hearth.land.channel.js",
      contract: LAND_CONTRACT,
      globalName: "HEARTH_LAND_CHANNEL"
    },
    {
      key: "water",
      path: "/assets/hearth/hearth.water.channel.js",
      contract: WATER_CONTRACT,
      globalName: "HEARTH_WATER_CHANNEL"
    },
    {
      key: "air",
      path: "/assets/hearth/hearth.air.channel.js",
      contract: AIR_CONTRACT,
      globalName: "HEARTH_AIR_CHANNEL"
    }
  ]);

  const COLORS = Object.freeze({
    shellDark: [5, 9, 19],
    shellMid: [16, 31, 48],
    shellLight: [62, 84, 92],
    land: [92, 86, 58],
    water: [8, 35, 86],
    air: [150, 190, 210],
    rim: [174, 216, 236],
    atmosphere: [20, 32, 48],
    shadow: [2, 5, 12],
    transparent: [0, 0, 0]
  });

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrap01(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
  }

  function mixNumber(a, b, t) {
    const k = clamp01(t);
    return a + (b - a) * k;
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      clamp(Math.round(mixNumber(a[0], b[0], k)), 0, 255),
      clamp(Math.round(mixNumber(a[1], b[1], k)), 0, 255),
      clamp(Math.round(mixNumber(a[2], b[2], k)), 0, 255)
    ];
  }

  function scaleColor(rgb, scalar) {
    const s = Number.isFinite(Number(scalar)) ? Number(scalar) : 1;
    return [
      clamp(Math.round(rgb[0] * s), 0, 255),
      clamp(Math.round(rgb[1] * s), 0, 255),
      clamp(Math.round(rgb[2] * s), 0, 255)
    ];
  }

  function normalize3(p) {
    const x = Number.isFinite(Number(p && p.x)) ? Number(p.x) : 0;
    const y = Number.isFinite(Number(p && p.y)) ? Number(p.y) : 0;
    const z = Number.isFinite(Number(p && p.z)) ? Number(p.z) : 1;
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
  }

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = Number(lonDeg || 0) * DEG;
    const lat = Number(latDeg || 0) * DEG;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  }

  function vectorToLonLat(p) {
    const n = normalize3(p);
    return {
      lon: Math.atan2(n.x, n.z) / DEG,
      lat: Math.asin(clamp(n.y, -1, 1)) / DEG
    };
  }

  function lonToU(lon) {
    return wrap01((Number(lon) + 180) / 360);
  }

  function latToV(lat) {
    return clamp((90 - Number(lat)) / 180, 0, 1);
  }

  function uToLon(u) {
    return wrap01(u) * 360 - 180;
  }

  function vToLat(v) {
    return 90 - clamp(Number(v), 0, 1) * 180;
  }

  function rotateY(p, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: p.x * c + p.z * s,
      y: p.y,
      z: -p.x * s + p.z * c
    };
  }

  function rotateX(p, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: p.x,
      y: p.y * c - p.z * s,
      z: p.y * s + p.z * c
    };
  }

  function rotateForView(p, rotationLon, rotationLat) {
    return normalize3(rotateY(rotateX(p, rotationLat), rotationLon));
  }

  function spherePixelToVector(x, y, width, height) {
    const size = Math.min(width, height);
    const cx = (width - 1) / 2;
    const cy = (height - 1) / 2;
    const radius = size * 0.5 * 0.985;

    const dx = (x - cx) / radius;
    const dy = (y - cy) / radius;
    const rr = dx * dx + dy * dy;

    if (rr > 1) {
      return {
        inside: false,
        edgeAlpha: 0,
        radial: Math.sqrt(rr),
        vector: { x: 0, y: 0, z: 1 }
      };
    }

    const radial = Math.sqrt(rr);
    const z = Math.sqrt(Math.max(0, 1 - rr));
    const edgeAlpha = clamp01((1 - radial) / 0.025);

    return {
      inside: true,
      edgeAlpha,
      radial,
      vector: normalize3({
        x: dx,
        y: -dy,
        z
      })
    };
  }

  function parseInput(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        return lonLatToVector(uToLon(p.u), vToLat(p.v));
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        return lonLatToVector(Number(p.lon), Number(p.lat));
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        return lonLatToVector(Number(p.longitude), Number(p.latitude));
      }

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        return normalize3(p);
      }
    }

    if (args.length >= 3) return normalize3({ x: args[0], y: args[1], z: args[2] });
    if (args.length >= 2) return lonLatToVector(Number(args[0]), Number(args[1]));
    return lonLatToVector(0, 0);
  }

  function colorField(source, keys, fallback) {
    for (const key of keys) {
      const value = source && source[key];

      if (
        Array.isArray(value) &&
        value.length >= 3 &&
        value.every((v) => Number.isFinite(Number(v)))
      ) {
        return [
          clamp(Math.round(Number(value[0])), 0, 255),
          clamp(Math.round(Number(value[1])), 0, 255),
          clamp(Math.round(Number(value[2])), 0, 255)
        ];
      }
    }

    return fallback.slice();
  }

  function numberField(source, key, fallback = 0) {
    const n = Number(source && source[key]);
    return Number.isFinite(n) ? n : fallback;
  }

  function boolField(source, key, fallback = false) {
    return typeof (source && source[key]) === "boolean" ? source[key] : fallback;
  }

  function getLandChannel() {
    return root.HEARTH_LAND_CHANNEL || root.HearthLandChannel || (root.HEARTH && root.HEARTH.landChannel) || null;
  }

  function getWaterChannel() {
    return root.HEARTH_WATER_CHANNEL || root.HearthWaterChannel || (root.HEARTH && root.HEARTH.waterChannel) || null;
  }

  function getAirChannel() {
    return root.HEARTH_AIR_CHANNEL || root.HearthAirChannel || (root.HEARTH && root.HEARTH.airChannel) || null;
  }

  function callChannel(authority, args, p) {
    if (!authority) return null;

    const fallbackArg = {
      u: lonToU(vectorToLonLat(p).lon),
      v: latToV(vectorToLonLat(p).lat),
      x: p.x,
      y: p.y,
      z: p.z
    };

    const methods = ["sample", "read"];

    for (const method of methods) {
      if (typeof authority[method] !== "function") continue;

      try {
        const result = authority[method].apply(authority, args);
        if (result && typeof result === "object") return result;
      } catch (_error) {
        try {
          const result = authority[method].call(authority, fallbackArg);
          if (result && typeof result === "object") return result;
        } catch (_error2) {}
      }
    }

    return null;
  }

  function fallbackLand(p) {
    const ll = vectorToLonLat(p);
    const landShape = clamp01(0.42 + Math.sin((ll.lon + 35) * DEG) * 0.18 + Math.cos(ll.lat * DEG * 2) * 0.10);
    const landAlpha = landShape > 0.48 ? 0.42 : 0.05;

    return {
      channel: "land",
      channelClass: landAlpha > 0.2 ? "fallback-body-bound-land" : "fallback-low-land",
      rgb: mixColor(COLORS.land, COLORS.shellMid, 1 - landAlpha),
      color: mixColor(COLORS.land, COLORS.shellMid, 1 - landAlpha),
      alpha: landAlpha,
      landAlpha,
      landPresence: landAlpha,
      bodyBinding: landAlpha,
      surfaceAttachment: landAlpha,
      atmosphericRejection: landAlpha,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      sourceContract: "FALLBACK_LAND_CHANNEL"
    };
  }

  function fallbackWater(p) {
    const waterShape = clamp01(0.36 + (p.z < 0.16 ? 0.36 : 0) + Math.cos(p.x * 7) * 0.06);
    const waterAlpha = p.z < 0.24 ? clamp01(waterShape * 0.52) : 0.03;

    return {
      channel: "water",
      channelClass: waterAlpha > 0.2 ? "fallback-surface-water" : "fallback-low-water",
      rgb: mixColor(COLORS.water, COLORS.shellDark, 1 - waterAlpha),
      color: mixColor(COLORS.water, COLORS.shellDark, 1 - waterAlpha),
      alpha: waterAlpha,
      waterAlpha,
      waterPresence: waterAlpha,
      hydrosphereBinding: waterAlpha,
      surfaceSeat: waterAlpha,
      depthBinding: waterAlpha * 0.8,
      atmosphericRejection: waterAlpha,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      sourceContract: "FALLBACK_WATER_CHANNEL"
    };
  }

  function fallbackAir(p) {
    const limb = clamp01(1 - Math.abs(p.z));
    const airAlpha = clamp01(limb * 0.12);

    return {
      channel: "air",
      channelClass: "fallback-rim-air",
      rgb: COLORS.air.slice(),
      color: COLORS.air.slice(),
      alpha: airAlpha,
      airAlpha,
      airPresence: airAlpha,
      atmosphereSeparation: airAlpha,
      humidity: 0.16,
      airPressure: 0.52,
      barometricPressure: 0.52,
      barometricGradient: 0.08,
      rimHaze: limb,
      limbAtmosphere: limb,
      floatsAboveBody: true,
      allowedToFloat: true,
      bodyBound: false,
      surfaceBound: false,
      mayDefineLand: false,
      mayDefineWater: false,
      sourceContract: "FALLBACK_AIR_CHANNEL"
    };
  }

  function normalizeLand(raw, p) {
    const fallback = fallbackLand(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "landRgb"], fallback.rgb);

    return {
      ...fallback,
      ...source,
      rgb,
      color: rgb,
      alpha: clamp01(numberField(source, "alpha", numberField(source, "landAlpha", fallback.alpha))),
      landAlpha: clamp01(numberField(source, "landAlpha", numberField(source, "landPresence", fallback.landAlpha))),
      bodyBinding: clamp01(numberField(source, "bodyBinding", fallback.bodyBinding)),
      surfaceAttachment: clamp01(numberField(source, "surfaceAttachment", fallback.surfaceAttachment)),
      atmosphericRejection: clamp01(numberField(source, "atmosphericRejection", fallback.atmosphericRejection)),
      bodyBound: boolField(source, "bodyBound", true),
      surfaceBound: boolField(source, "surfaceBound", true),
      floatsAboveBody: false,
      allowedToFloat: false
    };
  }

  function normalizeWater(raw, p) {
    const fallback = fallbackWater(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "waterRgb", "oceanRgb"], fallback.rgb);

    return {
      ...fallback,
      ...source,
      rgb,
      color: rgb,
      alpha: clamp01(numberField(source, "alpha", numberField(source, "waterAlpha", fallback.alpha))),
      waterAlpha: clamp01(numberField(source, "waterAlpha", numberField(source, "waterPresence", fallback.waterAlpha))),
      hydrosphereBinding: clamp01(numberField(source, "hydrosphereBinding", fallback.hydrosphereBinding)),
      surfaceSeat: clamp01(numberField(source, "surfaceSeat", fallback.surfaceSeat)),
      depthBinding: clamp01(numberField(source, "depthBinding", fallback.depthBinding)),
      atmosphericRejection: clamp01(numberField(source, "atmosphericRejection", fallback.atmosphericRejection)),
      bodyBound: boolField(source, "bodyBound", true),
      surfaceBound: boolField(source, "surfaceBound", true),
      floatsAboveBody: false,
      allowedToFloat: false
    };
  }

  function normalizeAir(raw, p) {
    const fallback = fallbackAir(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "airRgb", "atmosphereRgb"], fallback.rgb);

    return {
      ...fallback,
      ...source,
      rgb,
      color: rgb,
      alpha: clamp01(numberField(source, "alpha", numberField(source, "airAlpha", fallback.alpha))),
      airAlpha: clamp01(numberField(source, "airAlpha", numberField(source, "airPresence", fallback.airAlpha))),
      atmosphereSeparation: clamp01(numberField(source, "atmosphereSeparation", fallback.atmosphereSeparation)),
      humidity: clamp01(numberField(source, "humidity", fallback.humidity)),
      airPressure: clamp01(numberField(source, "airPressure", fallback.airPressure)),
      barometricPressure: clamp01(numberField(source, "barometricPressure", fallback.barometricPressure)),
      barometricGradient: clamp01(numberField(source, "barometricGradient", fallback.barometricGradient)),
      rimHaze: clamp01(numberField(source, "rimHaze", fallback.rimHaze)),
      limbAtmosphere: clamp01(numberField(source, "limbAtmosphere", fallback.limbAtmosphere)),
      floatsAboveBody: true,
      allowedToFloat: true,
      bodyBound: false,
      surfaceBound: false,
      mayDefineLand: false,
      mayDefineWater: false
    };
  }

  function composeChannels(land, water, air, p) {
    let rgb = COLORS.shellMid.slice();

    const landWeight = clamp01(land.landAlpha * (0.72 + land.bodyBinding * 0.24 + land.surfaceAttachment * 0.12));
    const waterWeight = clamp01(water.waterAlpha * (0.68 + water.hydrosphereBinding * 0.22 + water.depthBinding * 0.12));
    const airWeight = clamp01(air.airAlpha * (0.28 + air.atmosphereSeparation * 0.18 + air.rimHaze * 0.12));

    if (landWeight > 0.01) {
      rgb = mixColor(rgb, land.rgb, landWeight);
    }

    if (waterWeight > 0.01) {
      rgb = mixColor(rgb, water.rgb, waterWeight);
    }

    if (airWeight > 0.01) {
      rgb = mixColor(rgb, air.rgb, airWeight);
    }

    const light = normalize3({ x: -0.34, y: 0.42, z: 0.83 });
    const illumination = clamp01(0.66 + dot3(p, light) * 0.30);
    const bodyLock = clamp01(
      land.bodyBinding * 0.34 +
        land.surfaceAttachment * 0.20 +
        water.hydrosphereBinding * 0.26 +
        water.surfaceSeat * 0.12 +
        0.08
    );

    const seatedShade = clamp01(0.76 + illumination * 0.22 + bodyLock * 0.08);
    rgb = scaleColor(rgb, seatedShade);

    return {
      rgb,
      alpha: clamp01(0.96 + airWeight * 0.04),
      landWeight,
      waterWeight,
      airWeight,
      bodyLock
    };
  }

  function multiplexSample(...args) {
    const p = parseInput(...args);

    const land = normalizeLand(callChannel(getLandChannel(), args, p), p);
    const water = normalizeWater(callChannel(getWaterChannel(), args, p), p);
    const air = normalizeAir(callChannel(getAirChannel(), args, p), p);
    const composed = composeChannels(land, water, air, p);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "channel-multiplex-semiconductor-canvas",

      x: p.x,
      y: p.y,
      z: p.z,

      channelMultiplexReady: Boolean(getLandChannel() && getWaterChannel() && getAirChannel()),
      semiconductorOutlet: true,
      canvasDecidesNothing: true,

      rgb: composed.rgb,
      color: composed.rgb,
      alpha: composed.alpha,

      land,
      water,
      air,

      landChannelLoaded: Boolean(getLandChannel()),
      waterChannelLoaded: Boolean(getWaterChannel()),
      airChannelLoaded: Boolean(getAirChannel()),

      landWeight: composed.landWeight,
      waterWeight: composed.waterWeight,
      airWeight: composed.airWeight,
      bodyLock: composed.bodyLock,

      compositeOrder: "planet-body-shell → land-channel → water-channel → air-channel → rim-lighting",

      landFloatsAboveBody: false,
      waterFloatsAboveBody: false,
      airFloatsAboveBody: true,

      ownsLandTruth: false,
      ownsWaterTruth: false,
      ownsAirTruth: false,
      ownsTectonicCause: false,
      ownsElevationGeneration: false,
      ownsCompositionClassification: false,
      ownsHydrology: false,
      ownsMaterialPalette: false,
      ownsOceanAuthority: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  const sample = (...args) => multiplexSample(...args);
  const read = (...args) => multiplexSample(...args);
  const compose = (...args) => multiplexSample(...args);
  const composeSample = (...args) => multiplexSample(...args);
  const composePixel = (...args) => multiplexSample(...args);
  const getPixel = (...args) => multiplexSample(...args);
  const getColor = (...args) => multiplexSample(...args).rgb;

  function createShellCanvas(options = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth shell canvas requires document.createElement.");
    }

    const requestedSize = Number.isFinite(Number(options.size))
      ? Math.round(Number(options.size))
      : Number.isFinite(Number(options.width))
        ? Math.round(Number(options.width))
        : 420;

    const size = clamp(requestedSize, 240, options.allowLargeTexture === true ? 720 : 520);
    const canvas = root.document.createElement("canvas");

    canvas.width = size;
    canvas.height = size;
    canvas.className = options.className || "hearth-canvas-texture hearth-canvas-contained-sphere hearth-canvas-semiconductor-outlet";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.background = "transparent";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.cursor = "grab";

    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthCanvasShellFirst = "true";
    canvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    canvas.dataset.hearthCanvasDecidesNothing = "true";
    canvas.dataset.hearthCanvasChannelMultiplexReady = "false";
    canvas.dataset.hearthCanvasInteractiveShellMounted = "true";
    canvas.dataset.hearthCanvasCachedAtlasProjection = "pending";
    canvas.dataset.hearthCanvasInteractiveProjection = "true";
    canvas.dataset.hearthCanvasControlsBound = "false";
    canvas.dataset.hearthCanvasAtlasReady = "false";
    canvas.dataset.hearthCanvasAtlasBuilding = "false";
    canvas.dataset.hearthCanvasAtlasProgress = "0";
    canvas.dataset.hearthCanvasSphereContainment = "true";
    canvas.dataset.hearthCanvasNoRectangularTextureSpill = "true";
    canvas.dataset.hearthCanvasOutsideSphereTransparent = "true";
    canvas.dataset.visualPassClaimed = "false";

    return canvas;
  }

  function drawFallbackShell(canvas, state = {}) {
    if (!canvas || typeof canvas.getContext !== "function") return null;

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const width = canvas.width;
    const height = canvas.height;
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const r = size * 0.47;
    const rotationLon = Number.isFinite(Number(state.rotationLon)) ? Number(state.rotationLon) : 0;
    const rotationLat = Number.isFinite(Number(state.rotationLat)) ? Number(state.rotationLat) : 0;

    ctx.clearRect(0, 0, width, height);

    const shell = ctx.createRadialGradient(
      cx - r * 0.28,
      cy - r * 0.34,
      r * 0.05,
      cx,
      cy,
      r
    );

    shell.addColorStop(0, "rgba(82, 112, 118, 0.98)");
    shell.addColorStop(0.34, "rgba(31, 57, 73, 0.98)");
    shell.addColorStop(0.72, "rgba(8, 18, 36, 0.99)");
    shell.addColorStop(1, "rgba(1, 4, 12, 1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.clip();
    ctx.fillStyle = shell;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.globalAlpha = 0.42;
    ctx.strokeStyle = "rgba(138, 130, 88, 0.62)";
    ctx.lineWidth = Math.max(1.2, size * 0.005);

    for (let i = 0; i < 7; i += 1) {
      const phase = rotationLon * 0.9 + i * 0.91;
      const y = cy + Math.sin(phase + rotationLat) * r * 0.42;
      const rx = r * (0.28 + (i % 3) * 0.10);
      const ry = r * (0.08 + (i % 2) * 0.04);
      const x = cx + Math.cos(phase * 0.7) * r * 0.22;

      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, phase * 0.22, 0.18 * Math.PI, 1.72 * Math.PI);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = "rgba(24, 122, 190, 0.68)";
    ctx.lineWidth = Math.max(1, size * 0.0035);

    for (let i = 0; i < 5; i += 1) {
      const phase = rotationLon * 1.15 + i * 1.17;
      const y = cy + Math.sin(phase - rotationLat * 0.6) * r * 0.36;
      const rx = r * (0.34 + (i % 2) * 0.12);
      const ry = r * 0.07;
      const x = cx + Math.cos(phase * 0.5) * r * 0.18;

      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, phase * 0.18, 0, TWO_PI);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = "rgba(170, 210, 235, 0.50)";
    ctx.lineWidth = Math.max(1, size * 0.0028);

    for (let i = 0; i < 4; i += 1) {
      const phase = rotationLon * 0.7 + i * 1.31;
      ctx.beginPath();
      ctx.arc(
        cx + Math.cos(phase) * r * 0.10,
        cy + Math.sin(phase + rotationLat) * r * 0.10,
        r * (0.52 + i * 0.018),
        0.15 * Math.PI + phase * 0.05,
        1.25 * Math.PI + phase * 0.05
      );
      ctx.stroke();
    }

    const shade = ctx.createRadialGradient(
      cx - r * 0.25,
      cy - r * 0.32,
      r * 0.10,
      cx + r * 0.18,
      cy + r * 0.14,
      r * 1.08
    );

    shade.addColorStop(0, "rgba(255,255,255,0.12)");
    shade.addColorStop(0.42, "rgba(255,255,255,0.00)");
    shade.addColorStop(0.75, "rgba(0,0,0,0.20)");
    shade.addColorStop(1, "rgba(0,0,0,0.48)");

    ctx.globalAlpha = 1;
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.strokeStyle = "rgba(172, 219, 240, 0.28)";
    ctx.lineWidth = Math.max(1, size * 0.005);
    ctx.stroke();

    canvas.dataset.hearthCanvasFallbackShellPainted = "true";
    canvas.dataset.hearthCanvasFrames = String(Number(canvas.dataset.hearthCanvasFrames || 0) + 1);
    return canvas;
  }

  function sampleAtlasNearest(atlas, u, v) {
    const x = clamp(Math.round(wrap01(u) * (atlas.width - 1)), 0, atlas.width - 1);
    const y = clamp(Math.round(clamp(v, 0, 1) * (atlas.height - 1)), 0, atlas.height - 1);
    const i = (y * atlas.width + x) * 4;

    return [
      atlas.data[i],
      atlas.data[i + 1],
      atlas.data[i + 2],
      atlas.data[i + 3]
    ];
  }

  function renderSphereFromAtlas(targetCanvas, atlas, state = {}, options = {}) {
    if (!targetCanvas || !atlas || !atlas.data) return targetCanvas;

    const ctx = targetCanvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const width = targetCanvas.width;
    const height = targetCanvas.height;
    const image = ctx.createImageData(width, height);
    const data = image.data;

    const rotationLon = Number.isFinite(Number(state.rotationLon)) ? Number(state.rotationLon) : 0;
    const rotationLat = Number.isFinite(Number(state.rotationLat)) ? Number(state.rotationLat) : 0;
    const light = normalize3({ x: -0.34, y: 0.42, z: 0.83 });
    const useSoftLighting = options.softProjectionLighting !== false;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const sphere = spherePixelToVector(x, y, width, height);
        const i = (y * width + x) * 4;

        if (!sphere.inside) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
          continue;
        }

        const world = rotateForView(sphere.vector, rotationLon, rotationLat);
        const ll = vectorToLonLat(world);
        const color = sampleAtlasNearest(atlas, lonToU(ll.lon), latToV(ll.lat));

        let r = color[0];
        let g = color[1];
        let b = color[2];

        if (useSoftLighting) {
          const illumination = clamp01(0.64 + dot3(sphere.vector, light) * 0.30);
          const edgeShade = clamp01(1 - sphere.radial * 0.13);
          const shade = clamp01(illumination * edgeShade);
          r = clamp(Math.round(r * shade), 0, 255);
          g = clamp(Math.round(g * shade), 0, 255);
          b = clamp(Math.round(b * shade), 0, 255);

          const limbAtmosphere = clamp01(sphere.radial * 0.05);
          const mixed = mixColor([r, g, b], COLORS.atmosphere, limbAtmosphere);
          r = mixed[0];
          g = mixed[1];
          b = mixed[2];
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = Math.round(clamp01(color[3] / 255) * 255 * sphere.edgeAlpha);
      }
    }

    ctx.putImageData(image, 0, 0);
    targetCanvas.dataset.hearthCanvasRenderedFromCachedAtlas = "true";
    targetCanvas.dataset.hearthCanvasInteractiveProjection = "true";
    targetCanvas.dataset.hearthCanvasAtlasReady = "true";
    targetCanvas.dataset.hearthCanvasFrames = String(Number(targetCanvas.dataset.hearthCanvasFrames || 0) + 1);
    return targetCanvas;
  }

  function scheduleWork(fn) {
    if (root.requestIdleCallback) {
      root.requestIdleCallback(fn, { timeout: 80 });
      return;
    }

    if (root.requestAnimationFrame) {
      root.requestAnimationFrame(fn);
      return;
    }

    setTimeout(fn, 0);
  }

  function loadScriptOnce(item, cacheKey) {
    return new Promise((resolve) => {
      if (root[item.globalName]) {
        resolve({ key: item.key, loaded: true, alreadyPresent: true });
        return;
      }

      if (!root.document || !root.document.head) {
        resolve({ key: item.key, loaded: false, error: "document unavailable" });
        return;
      }

      const existing = root.document.querySelector(`script[data-hearth-channel-file="${item.key}"]`);

      if (existing) {
        existing.addEventListener("load", () => resolve({ key: item.key, loaded: Boolean(root[item.globalName]), existing: true }), { once: true });
        existing.addEventListener("error", () => resolve({ key: item.key, loaded: false, existing: true, error: "load-error" }), { once: true });
        return;
      }

      const script = root.document.createElement("script");
      script.src = `${item.path}?v=${encodeURIComponent(cacheKey || VERSION)}`;
      script.defer = true;
      script.dataset.hearthChannelFile = item.key;
      script.dataset.hearthChannelContract = item.contract;
      script.dataset.hearthCanvasSemiconductorOutlet = CONTRACT;
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      script.onload = () => resolve({ key: item.key, loaded: Boolean(root[item.globalName]), path: item.path });
      script.onerror = () => resolve({ key: item.key, loaded: false, path: item.path, error: "load-error" });

      root.document.head.appendChild(script);
    });
  }

  function ensureChannelScripts(options = {}) {
    const cacheKey = options.channelCacheKey || "hearth-channel-multiplex-v4";
    return Promise.all(CHANNEL_FILES.map((item) => loadScriptOnce(item, cacheKey)));
  }

  function createAtlasTextureCanvas(options = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth canvas atlas creation requires document.createElement.");
    }

    const width = clamp(
      Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 384,
      32,
      options.allowLargeTexture === true ? 1536 : 512
    );

    const height = clamp(
      Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : 192,
      16,
      options.allowLargeTexture === true ? 768 : 256
    );

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    canvas.dataset.hearthCanvasAtlasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    canvas.dataset.hearthCanvasRawAtlasDisplayForbidden = "true";
    canvas.dataset.visualPassClaimed = "false";

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let y = 0; y < height; y += 1) {
      const v = height <= 1 ? 0 : y / (height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = width <= 1 ? 0 : x / (width - 1);
        const px = multiplexSample({ u, v });
        const i = (y * width + x) * 4;

        data[i] = px.rgb[0];
        data[i + 1] = px.rgb[1];
        data[i + 2] = px.rgb[2];
        data[i + 3] = Math.round(clamp01(px.alpha) * 255);
      }
    }

    ctx.putImageData(image, 0, 0);
    return canvas;
  }

  function getAtlasData(atlasCanvas) {
    const ctx = atlasCanvas.getContext("2d", { alpha: true, willReadFrequently: true });
    const image = ctx.getImageData(0, 0, atlasCanvas.width, atlasCanvas.height);

    return {
      canvas: atlasCanvas,
      width: atlasCanvas.width,
      height: atlasCanvas.height,
      data: image.data
    };
  }

  function buildAtlasAsync(options = {}, handlers = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      const error = new Error("Hearth async atlas creation requires document.createElement.");
      if (typeof handlers.onError === "function") handlers.onError(error);
      return { cancel() {} };
    }

    const width = clamp(
      Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 384,
      32,
      options.allowLargeTexture === true ? 1024 : 512
    );

    const height = clamp(
      Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : 192,
      16,
      options.allowLargeTexture === true ? 512 : 256
    );

    const rowsPerChunk = clamp(
      Number.isFinite(Number(options.rowsPerChunk)) ? Math.round(Number(options.rowsPerChunk)) : 2,
      1,
      8
    );

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.hearthCanvasAtlasTexture = "true";
    canvas.dataset.hearthCanvasAsyncAtlas = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    canvas.dataset.visualPassClaimed = "false";

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    let y = 0;
    let cancelled = false;

    const controller = {
      canvas,
      width,
      height,
      cancel() {
        cancelled = true;
      }
    };

    const processChunk = () => {
      if (cancelled) return;

      try {
        const endY = Math.min(height, y + rowsPerChunk);

        for (; y < endY; y += 1) {
          const v = height <= 1 ? 0 : y / (height - 1);

          for (let x = 0; x < width; x += 1) {
            const u = width <= 1 ? 0 : x / (width - 1);
            const px = multiplexSample({ u, v });
            const i = (y * width + x) * 4;

            data[i] = px.rgb[0];
            data[i + 1] = px.rgb[1];
            data[i + 2] = px.rgb[2];
            data[i + 3] = Math.round(clamp01(px.alpha) * 255);
          }
        }

        const progress = clamp01(y / height);

        if (typeof handlers.onProgress === "function") {
          handlers.onProgress(progress, { y, width, height, rowsPerChunk });
        }

        if (y >= height) {
          ctx.putImageData(image, 0, 0);

          const readCtx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
          const atlasImage = readCtx.getImageData(0, 0, width, height);

          const atlas = {
            canvas,
            width,
            height,
            data: atlasImage.data
          };

          if (typeof handlers.onComplete === "function") handlers.onComplete(atlas);
          return;
        }

        scheduleWork(processChunk);
      } catch (error) {
        if (typeof handlers.onError === "function") handlers.onError(error);
      }
    };

    scheduleWork(processChunk);
    return controller;
  }

  function createSphereTextureCanvas(options = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth canvas texture creation requires document.createElement.");
    }

    const atlasCanvas = createAtlasTextureCanvas({
      width: options.atlasWidth || 384,
      height: options.atlasHeight || 192,
      allowLargeTexture: options.allowLargeTexture === true
    });

    const atlas = getAtlasData(atlasCanvas);

    const requestedWidth = Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 420;
    const requestedHeight = Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : requestedWidth;

    const width = clamp(requestedWidth, 32, options.allowLargeTexture === true ? 1024 : 520);
    const height = clamp(requestedHeight, 32, options.allowLargeTexture === true ? 1024 : 520);

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    canvas.dataset.hearthCanvasSphereContainment = "true";
    canvas.dataset.hearthCanvasOutsideSphereTransparent = "true";
    canvas.dataset.hearthCanvasCachedAtlasProjection = "true";
    canvas.dataset.visualPassClaimed = "false";

    renderSphereFromAtlas(
      canvas,
      atlas,
      {
        rotationLon: Number.isFinite(Number(options.rotationLon)) ? Number(options.rotationLon) : 0,
        rotationLat: Number.isFinite(Number(options.rotationLat)) ? Number(options.rotationLat) : 0
      },
      options
    );

    return canvas;
  }

  function createTextureCanvas(options = {}) {
    if (options && options.atlas === true) return createAtlasTextureCanvas(options);
    return createSphereTextureCanvas(options);
  }

  const createCanvas = (options = {}) => createTextureCanvas(options);
  const createPlanetTexture = (options = {}) => createTextureCanvas(options);
  const createTexture = (options = {}) => createTextureCanvas(options);
  const buildTexture = (options = {}) => createTextureCanvas(options);
  const getTextureCanvas = (options = {}) => createTextureCanvas(options);

  function paintToCanvas(targetCanvas, options = {}) {
    if (!targetCanvas || typeof targetCanvas.getContext !== "function") return null;

    const texture = createSphereTextureCanvas({
      width: options.width || targetCanvas.width || 420,
      height: options.height || targetCanvas.height || targetCanvas.width || 420,
      atlasWidth: options.atlasWidth || 384,
      atlasHeight: options.atlasHeight || 192,
      allowLargeTexture: options.allowLargeTexture === true
    });

    const ctx = targetCanvas.getContext("2d");
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    ctx.drawImage(texture, 0, 0, targetCanvas.width, targetCanvas.height);

    targetCanvas.dataset.hearthCanvasPainted = "true";
    targetCanvas.dataset.hearthCanvasContract = CONTRACT;
    targetCanvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    targetCanvas.dataset.hearthCanvasSphereContainment = "true";
    targetCanvas.dataset.hearthCanvasOutsideSphereTransparent = "true";
    targetCanvas.dataset.hearthCanvasCachedAtlasProjection = "true";
    targetCanvas.dataset.visualPassClaimed = "false";

    return targetCanvas;
  }

  const renderToCanvas = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const drawToCanvas = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const render = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const paint = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);

  function bindPointerDrag(canvas, api) {
    const state = api.state;

    const handlePointerDown = (event) => {
      if (state.destroyed) return;

      state.dragging = true;
      state.pointerId = event.pointerId;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;

      canvas.style.cursor = "grabbing";
      canvas.dataset.hearthCanvasDragging = "true";

      if (canvas.setPointerCapture && event.pointerId !== undefined) {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch (_error) {}
      }

      if (event.cancelable) event.preventDefault();
    };

    const handlePointerMove = (event) => {
      if (state.destroyed || !state.dragging) return;
      if (state.pointerId !== null && event.pointerId !== state.pointerId) return;

      const dx = event.clientX - state.lastPointerX;
      const dy = event.clientY - state.lastPointerY;

      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;

      state.rotationLon -= dx * 0.010;
      state.rotationLat += dy * 0.008;
      state.rotationLat = clamp(state.rotationLat, -Math.PI * 0.42, Math.PI * 0.42);

      canvas.dataset.hearthCanvasRotationLon = String(state.rotationLon);
      canvas.dataset.hearthCanvasRotationLat = String(state.rotationLat);

      api.requestRedraw();

      if (event.cancelable) event.preventDefault();
    };

    const endDrag = (event) => {
      if (state.destroyed) return;
      if (state.pointerId !== null && event && event.pointerId !== state.pointerId) return;

      state.dragging = false;
      canvas.style.cursor = "grab";
      canvas.dataset.hearthCanvasDragging = "false";

      if (event && canvas.releasePointerCapture && event.pointerId !== undefined) {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch (_error) {}
      }

      state.pointerId = null;
      if (event && event.cancelable) event.preventDefault();
    };

    canvas.addEventListener("pointerdown", handlePointerDown, { passive: false });
    canvas.addEventListener("pointermove", handlePointerMove, { passive: false });
    canvas.addEventListener("pointerup", endDrag, { passive: false });
    canvas.addEventListener("pointercancel", endDrag, { passive: false });
    canvas.addEventListener("lostpointercapture", endDrag, { passive: false });

    canvas.dataset.hearthCanvasControlsBound = "true";
    state.controlsBound = true;

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("lostpointercapture", endDrag);
      canvas.dataset.hearthCanvasControlsBound = "false";
      state.controlsBound = false;
    };
  }

  function createShellFirstMount(target, options = {}) {
    if (!root.document) return null;

    const element =
      typeof target === "string"
        ? root.document.querySelector(target)
        : target && target.nodeType === 1
          ? target
          : null;

    if (!element) return null;

    element.querySelectorAll("[data-hearth-canvas-texture], canvas.hearth-canvas-texture").forEach((node) => {
      node.remove();
    });

    const canvas = createShellCanvas(options);

    const state = {
      rotationLon: Number.isFinite(Number(options.rotationLon)) ? Number(options.rotationLon) : 0,
      rotationLat: Number.isFinite(Number(options.rotationLat)) ? Number(options.rotationLat) : 0,
      dragging: false,
      pointerId: null,
      lastPointerX: 0,
      lastPointerY: 0,
      frames: 0,
      atlasReady: false,
      atlasBuilding: false,
      atlasProgress: 0,
      fallbackActive: true,
      destroyed: false,
      redrawPending: false,
      controlsBound: false,
      atlas: null,
      atlasController: null,
      landChannelLoaded: Boolean(getLandChannel()),
      waterChannelLoaded: Boolean(getWaterChannel()),
      airChannelLoaded: Boolean(getAirChannel()),
      channelMultiplexReady: false
    };

    const api = {
      canvas,
      node: element,
      state,
      mounted: true,
      canvasFound: true,
      controlsBound: false,
      interactiveShellMounted: true,
      cachedAtlasProjection: false,
      atlasReady: false,
      atlasBuilding: false,
      channelMultiplexReady: false,
      semiconductorOutlet: true,
      canvasDecidesNothing: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      redraw() {
        if (state.destroyed) return canvas;

        state.redrawPending = false;

        if (state.atlasReady && state.atlas) {
          renderSphereFromAtlas(canvas, state.atlas, state, options);
          state.fallbackActive = false;
        } else {
          drawFallbackShell(canvas, state);
          state.fallbackActive = true;
        }

        state.frames += 1;
        canvas.dataset.hearthCanvasFrames = String(state.frames);
        return canvas;
      },
      requestRedraw() {
        if (state.destroyed || state.redrawPending) return;
        state.redrawPending = true;

        if (root.requestAnimationFrame) {
          root.requestAnimationFrame(() => api.redraw());
        } else {
          setTimeout(() => api.redraw(), 16);
        }
      },
      destroy() {
        state.destroyed = true;

        if (state.atlasController && typeof state.atlasController.cancel === "function") {
          state.atlasController.cancel();
        }

        if (typeof api.unbindControls === "function") api.unbindControls();

        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      },
      unbindControls: null
    };

    element.appendChild(canvas);

    canvas.dataset.hearthCanvasMountedImmediately = "true";
    canvas.dataset.hearthCanvasInteractiveShellMounted = "true";
    canvas.dataset.hearthCanvasAtlasReady = "false";
    canvas.dataset.hearthCanvasAtlasBuilding = "false";
    canvas.dataset.hearthCanvasAtlasProgress = "0";
    canvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    canvas.dataset.hearthCanvasDecidesNothing = "true";

    drawFallbackShell(canvas, state);

    api.unbindControls = bindPointerDrag(canvas, api);
    api.controlsBound = true;
    state.controlsBound = true;

    if (typeof options.onStatus === "function") {
      options.onStatus("mounted-semiconductor-shell-first", {
        mounted: true,
        canvasFound: true,
        controlsBound: true,
        interactiveShellMounted: true,
        semiconductorOutlet: true,
        canvasDecidesNothing: true,
        channelMultiplexReady: false,
        atlasReady: false,
        atlasBuilding: false,
        frames: state.frames,
        contract: CONTRACT,
        receipt: RECEIPT
      });
    }

    const startAtlas = () => {
      if (state.destroyed) return;

      ensureChannelScripts(options).then((results) => {
        if (state.destroyed) return;

        state.landChannelLoaded = Boolean(getLandChannel());
        state.waterChannelLoaded = Boolean(getWaterChannel());
        state.airChannelLoaded = Boolean(getAirChannel());
        state.channelMultiplexReady = state.landChannelLoaded && state.waterChannelLoaded && state.airChannelLoaded;

        api.channelMultiplexReady = state.channelMultiplexReady;

        canvas.dataset.hearthLandChannelLoaded = String(state.landChannelLoaded);
        canvas.dataset.hearthWaterChannelLoaded = String(state.waterChannelLoaded);
        canvas.dataset.hearthAirChannelLoaded = String(state.airChannelLoaded);
        canvas.dataset.hearthCanvasChannelMultiplexReady = String(state.channelMultiplexReady);

        if (typeof options.onStatus === "function") {
          options.onStatus("channels-checked", {
            mounted: true,
            canvasFound: true,
            controlsBound: true,
            semiconductorOutlet: true,
            canvasDecidesNothing: true,
            channelMultiplexReady: state.channelMultiplexReady,
            landChannelLoaded: state.landChannelLoaded,
            waterChannelLoaded: state.waterChannelLoaded,
            airChannelLoaded: state.airChannelLoaded,
            channelLoadResults: results,
            contract: CONTRACT,
            receipt: RECEIPT
          });
        }

        state.atlasBuilding = true;
        api.atlasBuilding = true;
        canvas.dataset.hearthCanvasAtlasBuilding = "true";

        state.atlasController = buildAtlasAsync(
          {
            width: options.atlasWidth || 384,
            height: options.atlasHeight || 192,
            rowsPerChunk: options.rowsPerChunk || 2,
            allowLargeTexture: options.allowLargeTexture === true
          },
          {
            onProgress(progress) {
              if (state.destroyed) return;

              state.atlasProgress = progress;
              canvas.dataset.hearthCanvasAtlasProgress = String(progress);

              if (typeof options.onStatus === "function" && progress > 0 && progress < 1) {
                options.onStatus("atlas-progress", {
                  mounted: true,
                  canvasFound: true,
                  controlsBound: true,
                  semiconductorOutlet: true,
                  canvasDecidesNothing: true,
                  channelMultiplexReady: state.channelMultiplexReady,
                  atlasReady: false,
                  atlasBuilding: true,
                  atlasProgress: progress,
                  frames: state.frames,
                  contract: CONTRACT,
                  receipt: RECEIPT
                });
              }
            },
            onComplete(atlas) {
              if (state.destroyed) return;

              state.atlas = atlas;
              state.atlasReady = true;
              state.atlasBuilding = false;
              state.atlasProgress = 1;
              state.fallbackActive = false;

              api.atlasReady = true;
              api.atlasBuilding = false;
              api.cachedAtlasProjection = true;

              canvas.dataset.hearthCanvasAtlasReady = "true";
              canvas.dataset.hearthCanvasAtlasBuilding = "false";
              canvas.dataset.hearthCanvasAtlasProgress = "1";
              canvas.dataset.hearthCanvasCachedAtlasProjection = "true";

              api.requestRedraw();

              if (typeof options.onStatus === "function") {
                options.onStatus("semiconductor-atlas-ready", {
                  mounted: true,
                  canvasFound: true,
                  controlsBound: true,
                  semiconductorOutlet: true,
                  canvasDecidesNothing: true,
                  channelMultiplexReady: state.channelMultiplexReady,
                  atlasReady: true,
                  atlasBuilding: false,
                  atlasProgress: 1,
                  frames: state.frames,
                  contract: CONTRACT,
                  receipt: RECEIPT
                });
              }
            },
            onError(error) {
              if (state.destroyed) return;

              state.atlasBuilding = false;
              state.atlasReady = false;
              state.fallbackActive = true;

              api.atlasBuilding = false;
              api.atlasReady = false;

              canvas.dataset.hearthCanvasAtlasBuilding = "false";
              canvas.dataset.hearthCanvasAtlasReady = "false";
              canvas.dataset.hearthCanvasAtlasError = error && error.message ? error.message : String(error);

              drawFallbackShell(canvas, state);

              if (typeof options.onStatus === "function") {
                options.onStatus("atlas-error-fallback-held", {
                  mounted: true,
                  canvasFound: true,
                  controlsBound: true,
                  semiconductorOutlet: true,
                  canvasDecidesNothing: true,
                  channelMultiplexReady: state.channelMultiplexReady,
                  atlasReady: false,
                  atlasBuilding: false,
                  error: error && error.message ? error.message : String(error),
                  frames: state.frames,
                  contract: CONTRACT,
                  receipt: RECEIPT
                });
              }
            }
          }
        );
      });
    };

    setTimeout(startAtlas, 0);

    return api;
  }

  const mount = (target, options = {}) => createShellFirstMount(target, options);

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "channel-multiplex-semiconductor-canvas",
      status: "active",
      primaryTarget: "/assets/hearth/hearth.canvas.js",
      role: "mount-language-binder-current-connector-multiplex-outlet",
      semiconductorOutlet: true,
      canvasDecidesNothing: true,
      shellFirstMount: true,
      nonBlockingMount: true,
      asyncAtlasBuild: true,
      chunkedAtlasBuild: true,
      fallbackShellImmediate: true,
      touchDragBoundImmediately: true,
      pointerDragBoundImmediately: true,
      mountReturnsApiObject: true,
      childChannels: [
        "/assets/hearth/hearth.land.channel.js",
        "/assets/hearth/hearth.water.channel.js",
        "/assets/hearth/hearth.air.channel.js"
      ],
      childContracts: {
        land: LAND_CONTRACT,
        water: WATER_CONTRACT,
        air: AIR_CONTRACT
      },
      compositeOrder: [
        "planet-body-shell",
        "land-channel",
        "water-channel",
        "air-channel",
        "rim-lighting"
      ],
      law: [
        "canvas binds language",
        "canvas connects current",
        "canvas maintains flow",
        "canvas multiplexes channel output",
        "canvas decides no channel truth",
        "land and water are body-bound",
        "air is the only floating channel"
      ],
      owns: [
        "visible-canvas-shell",
        "fallback-shell-drawing",
        "pointer-touch-drag-binding",
        "rotation-state",
        "redraw-scheduling",
        "async-channel-loading",
        "async-atlas-build",
        "cached-atlas-projection",
        "channel-multiplexing",
        "semiconductor-outlet-composition",
        "spherical-alpha-containment-for-visible-canvas-output"
      ],
      doesNotOwn: [
        "tectonic-cause",
        "elevation-generation",
        "composition-classification",
        "hydrology-classification",
        "material-palette-authority",
        "ocean-authority-generation",
        "land-channel-truth",
        "water-channel-truth",
        "air-channel-truth",
        "route-orchestration",
        "runtime-motion",
        "external-controls-authority",
        "final-visual-pass-claim"
      ],
      failSoftRules: [
        "mount-visible-shell-before-channel-load",
        "bind-controls-before-channel-load",
        "return-api-before-channel-load",
        "if-child-channel-missing-use-local-fallback-channel",
        "if-atlas-fails-keep-draggable-fallback-shell",
        "no-blank-planet",
        "no-map-portal-freeze",
        "no-raw-rectangle-fallback"
      ],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    sample,
    read,
    compose,
    composeSample,
    composePixel,
    getPixel,
    getColor,

    createShellCanvas,
    drawFallbackShell,
    bindPointerDrag,
    buildAtlasAsync,
    createShellFirstMount,

    createTextureCanvas,
    createSphereTextureCanvas,
    createAtlasTextureCanvas,
    createCanvas,
    createPlanetTexture,
    createTexture,
    buildTexture,
    getTextureCanvas,

    renderSphereFromAtlas,
    paintToCanvas,
    renderToCanvas,
    drawToCanvas,
    render,
    paint,
    mount,

    ensureChannelScripts,
    getReceipt,

    supportsTrueShellFirstMount: true,
    supportsNonBlockingMount: true,
    supportsAsyncAtlasBuild: true,
    supportsChunkedAtlasBuild: true,
    supportsImmediateFallbackShell: true,
    supportsImmediateTouchDrag: true,
    supportsImmediatePointerDrag: true,
    supportsChannelMultiplex: true,
    supportsSemiconductorOutlet: true,

    semiconductorOutlet: true,
    canvasDecidesNothing: true,
    consumesLandChannel: true,
    consumesWaterChannel: true,
    consumesAirChannel: true,

    landChannelContract: LAND_CONTRACT,
    waterChannelContract: WATER_CONTRACT,
    airChannelContract: AIR_CONTRACT,

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
  root.HEARTH_CANVAS_RECEIPT = getReceipt();
  root.HEARTH_CANVAS_CONTRACT = CONTRACT;

  root.HEARTH_CANVAS_TRUE_SHELL_FIRST = true;
  root.HEARTH_CANVAS_NONBLOCKING_MOUNT = true;
  root.HEARTH_CANVAS_ASYNC_ATLAS_BUILD = true;
  root.HEARTH_CANVAS_SUPPORTS_TOUCH_DRAG = true;
  root.HEARTH_CANVAS_SUPPORTS_POINTER_DRAG = true;
  root.HEARTH_CANVAS_CHANNEL_MULTIPLEX = true;
  root.HEARTH_CANVAS_SEMICONDUCTOR_OUTLET = true;
  root.HEARTH_CANVAS_DECIDES_NOTHING = true;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthCanvasAuthorityLoaded = "true";
    root.document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    root.document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    root.document.documentElement.dataset.hearthCanvasTrueShellFirst = "true";
    root.document.documentElement.dataset.hearthCanvasNonBlockingMount = "true";
    root.document.documentElement.dataset.hearthCanvasAsyncAtlasBuild = "true";
    root.document.documentElement.dataset.hearthCanvasSupportsTouchDrag = "true";
    root.document.documentElement.dataset.hearthCanvasSupportsPointerDrag = "true";
    root.document.documentElement.dataset.hearthCanvasMountReturnsApiObject = "true";
    root.document.documentElement.dataset.hearthCanvasChannelMultiplex = "true";
    root.document.documentElement.dataset.hearthCanvasSemiconductorOutlet = "true";
    root.document.documentElement.dataset.hearthCanvasDecidesNothing = "true";
    root.document.documentElement.dataset.hearthCanvasLandChannelContract = LAND_CONTRACT;
    root.document.documentElement.dataset.hearthCanvasWaterChannelContract = WATER_CONTRACT;
    root.document.documentElement.dataset.hearthCanvasAirChannelContract = AIR_CONTRACT;
    root.document.documentElement.dataset.generatedImage = "false";
    root.document.documentElement.dataset.graphicBox = "false";
    root.document.documentElement.dataset.webgl = "false";
    root.document.documentElement.dataset.routeMutation = "false";
    root.document.documentElement.dataset.runtimeMutation = "false";
    root.document.documentElement.dataset.controlsMutation = "false";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
