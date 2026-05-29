// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1
// Full-file replacement.
// Rebuild receipt: HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_REBUILD_RECEIPT_v1
// Public route contract is preserved exactly.
// Canvas authority / visible carrier only.
// Purpose:
// - Restore HEARTH_CANVAS public carrier expected by hearth.climate.route.js.
// - Mount a visible Hearth canvas inside #hearthCanvasMount.
// - Hide/remove route fallback text after successful carrier mount.
// - Bridge HEARTH_MATERIALS into HEARTH_LAND_CHANNEL / HEARTH_WATER_CHANNEL / HEARTH_AIR_CHANNEL for HEARTH_HEX_SURFACE.
// - Consume HEARTH_HEX_SURFACE when available.
// - Fall back to a materials-driven 2D body renderer when hex surface is unavailable.
// - Preserve drag/spin inspection.
// - Preserve route-required mount API shape.
// Does not own:
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology classification
// - material palette truth
// - route orchestration
// - final visual pass claim

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;

  const CONTRACT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_RECEIPT_v1";
  const REBUILD_RECEIPT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_REBUILD_RECEIPT_v1";
  const PREVIOUS_KNOWN_CONTRACT = "HEARTH_CANVAS_HEX_FOUR_PAIR_BODY_BOUNDARY_CARRIER_TNT_v1";
  const ROUTE_EXPECTED_CONTRACT = "HEARTH_CLIMATE_ROUTE_HEX_FOUR_PAIR_FULL_RENEWAL_TNT_v1";
  const VERSION = "2026-05-29.hearth-canvas-runtime-table-directed-visible-carrier-rebuild-v1";

  const PLANET_ID = "hearth";
  const PLANET_LABEL = "Hearth";
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  let activeMount = null;
  let mountSerial = 0;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

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

  function mix(a, b, t) {
    const k = clamp01(t);
    return a + (b - a) * k;
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      Math.round(mix(a[0], b[0], k)),
      Math.round(mix(a[1], b[1], k)),
      Math.round(mix(a[2], b[2], k)),
      a[3] === undefined ? 255 : a[3]
    ];
  }

  function scaleColor(color, scalar) {
    const s = Number.isFinite(Number(scalar)) ? Number(scalar) : 1;
    return [
      clamp(Math.round(color[0] * s), 0, 255),
      clamp(Math.round(color[1] * s), 0, 255),
      clamp(Math.round(color[2] * s), 0, 255),
      color[3] === undefined ? 255 : color[3]
    ];
  }

  function norm3(v) {
    const x = Number(v && v[0]) || 0;
    const y = Number(v && v[1]) || 0;
    const z = Number(v && v[2]) || 1;
    const m = Math.hypot(x, y, z) || 1;

    return [x / m, y / m, z / m];
  }

  function rotateY(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return [
      v[0] * c + v[2] * s,
      v[1],
      -v[0] * s + v[2] * c
    ];
  }

  function rotateX(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return [
      v[0],
      v[1] * c - v[2] * s,
      v[1] * s + v[2] * c
    ];
  }

  function vectorToCoord(v) {
    const n = norm3(v);
    const lon = Math.atan2(n[0], n[2]) / DEG;
    const lat = Math.asin(clamp(n[1], -1, 1)) / DEG;

    return {
      x: n[0],
      y: n[1],
      z: n[2],
      lon,
      lat,
      u: wrap01((lon + 180) / 360),
      v: clamp01((90 - lat) / 180)
    };
  }

  function hash2(x, y, seed) {
    return wrap01(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
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

    return mix(mix(a, b, ux), mix(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves = 4) {
    let total = 0;
    let amp = 0.55;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x * freq, y * freq, seed + i * 17.17) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2.05;
    }

    return total / Math.max(0.000001, norm);
  }

  function readNumber(source, keys, fallback = 0) {
    if (!source || typeof source !== "object") return fallback;

    for (const key of keys) {
      const n = Number(source[key]);
      if (Number.isFinite(n)) return n;
    }

    return fallback;
  }

  function readBool(source, keys, fallback = false) {
    if (!source || typeof source !== "object") return fallback;

    for (const key of keys) {
      if (source[key] === true || source[key] === "true") return true;
      if (source[key] === false || source[key] === "false") return false;
    }

    return fallback;
  }

  function rgba(input, fallback) {
    if (Array.isArray(input) && input.length >= 3) {
      return [
        clamp(Math.round(input[0]), 0, 255),
        clamp(Math.round(input[1]), 0, 255),
        clamp(Math.round(input[2]), 0, 255),
        input[3] === undefined ? 255 : clamp(Math.round(input[3]), 0, 255)
      ];
    }

    return fallback.slice();
  }

  function resolveMaterials() {
    return (
      root.HEARTH_MATERIALS ||
      root.HearthMaterials ||
      (root.HEARTH && root.HEARTH.materials) ||
      null
    );
  }

  function resolveHexSurface() {
    return (
      root.HEARTH_HEX_SURFACE ||
      root.HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER ||
      (root.HEARTH && root.HEARTH.hexSurface) ||
      null
    );
  }

  function resolveHexAuthority() {
    return (
      root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY ||
      root.HEARTH_HEX_FOUR_PAIR_AUTHORITY ||
      root.HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY ||
      root.HEARTH_HEX_HANDSHAKE_AUTHORITY ||
      root.HEARTH_HEXGRID_AUTHORITY ||
      (root.HEARTH && root.HEARTH.hexFourPairAuthority) ||
      (root.HEARTH && root.HEARTH.hexAuthority) ||
      null
    );
  }

  function sampleMaterials(coord) {
    const materials = resolveMaterials();

    if (materials && typeof materials.sample === "function") {
      try {
        const value = materials.sample(coord);
        if (value && typeof value === "object") return value;
      } catch (_error) {}
    }

    if (materials && typeof materials.read === "function") {
      try {
        const value = materials.read(coord);
        if (value && typeof value === "object") return value;
      } catch (_error) {}
    }

    const landSignal = fbm(coord.u * 5.2 + 0.4, coord.v * 4.7 - 0.2, 9001, 5);
    const ridge = fbm(coord.u * 17.0, coord.v * 13.0, 9011, 4);
    const isLand = landSignal > 0.58 && Math.abs(coord.lat) < 76;

    return {
      contract: "HEARTH_CANVAS_MATERIAL_FALLBACK_PACKET",
      receipt: "HEARTH_CANVAS_MATERIAL_FALLBACK_RECEIPT",
      isLand,
      isWater: !isLand,
      landDensity: isLand ? clamp01(0.58 + ridge * 0.30) : 0,
      waterDepth: isLand ? 0 : clamp01(0.48 + landSignal * 0.30),
      waterFillStrength: isLand ? 0 : 0.72,
      shorelineGrounding: isLand ? clamp01(Math.abs(landSignal - 0.58) * 2.4) : 0,
      terrainRelief: isLand ? clamp01(ridge) : 0,
      ridgeRelief: isLand ? clamp01(ridge * 0.82) : 0,
      materialClass: isLand ? "fallback.land.mass" : "fallback.water.body",
      terrainClass: isLand ? "continent_mass" : "ocean_basin",
      rgb: isLand ? [104, 96, 64] : [8, 30, 58],
      color: isLand ? [104, 96, 64] : [8, 30, 58],
      fallback: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function createLandPacket(coord) {
    const material = sampleMaterials(coord);
    const isLand = readBool(material, ["isLand"], false);
    const isWater = readBool(material, ["isWater"], !isLand);
    const landDensity = clamp01(readNumber(material, ["landDensity", "landPotential", "materialDensity"], isLand ? 0.72 : 0));
    const waterFill = clamp01(readNumber(material, ["waterFillStrength", "waterDepth", "waterDepthShade"], isWater ? 0.64 : 0));
    const landAlpha = isLand ? clamp01(0.62 + landDensity * 0.32 - waterFill * 0.20) : 0;

    return {
      contract: "HEARTH_CANVAS_MATERIALS_TO_LAND_CHANNEL_ADAPTER_TNT_v1",
      receipt: "HEARTH_CANVAS_MATERIALS_TO_LAND_CHANNEL_ADAPTER_RECEIPT_v1",
      channel: "land",
      sourceContract: material.contract || "",
      sourceReceipt: material.receipt || "",
      isLandChannel: true,
      isWaterChannel: false,
      isAirChannel: false,
      isLand,
      isWater: false,
      landPresence: landAlpha,
      landAlpha,
      alpha: landAlpha,
      rgb: rgba(material.rgb || material.color || material.baseColor, [104, 96, 64, 255]),
      color: rgba(material.rgb || material.color || material.baseColor, [104, 96, 64, 255]),
      materialClass: material.materialClass || "",
      terrainClass: material.terrainClass || material.worldTerrainClass || "",
      terrainRelief: clamp01(readNumber(material, ["terrainRelief", "reliefStrength"], 0)),
      ridgeRelief: clamp01(readNumber(material, ["ridgeRelief", "ridgePotential", "mountainArcPotential"], 0)),
      plateauPotential: clamp01(readNumber(material, ["plateauPotential"], 0)),
      basinPotential: clamp01(readNumber(material, ["basinPotential", "basinShade"], 0)),
      shorelineContact: clamp01(readNumber(material, ["shorelineGrounding", "shorelineContact", "coastPotential"], 0)),
      coastPotential: clamp01(readNumber(material, ["coastPotential"], 0)),
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function createWaterPacket(coord) {
    const material = sampleMaterials(coord);
    const isWater = readBool(material, ["isWater", "isWaterOccupied", "waterFill"], false);
    const isLand = readBool(material, ["isLand"], !isWater);
    const waterDepth = clamp01(readNumber(material, ["waterDepth", "waterDepthShade", "waterDepthPotential"], isWater ? 0.62 : 0));
    const waterFill = clamp01(readNumber(material, ["waterFillStrength", "waterFillMaterialFeed", "waterPresence"], isWater ? 0.72 : 0));
    const shelf = clamp01(readNumber(material, ["shelfTransition", "shelfPotential", "shallowShelfStrength"], 0));
    const wetEdge = clamp01(readNumber(material, ["waterlineMaterialFeed", "shorelineGrounding", "wetStoneMaterialFeed", "coastPotential"], 0));
    const waterAlpha = isWater
      ? clamp01(0.58 + waterFill * 0.24 + waterDepth * 0.18)
      : clamp01(Math.max(shelf, wetEdge) * 0.32 - (isLand ? 0.08 : 0));

    return {
      contract: "HEARTH_CANVAS_MATERIALS_TO_WATER_CHANNEL_ADAPTER_TNT_v1",
      receipt: "HEARTH_CANVAS_MATERIALS_TO_WATER_CHANNEL_ADAPTER_RECEIPT_v1",
      channel: "water",
      sourceContract: material.contract || "",
      sourceReceipt: material.receipt || "",
      isWaterChannel: true,
      isLandChannel: false,
      isAirChannel: false,
      isWater,
      isLand: false,
      waterPresence: waterAlpha,
      waterAlpha,
      alpha: waterAlpha,
      waterDepth,
      depth: waterDepth,
      oceanDepth: waterDepth,
      wetEdge,
      shorelineContact: wetEdge,
      coastPotential: wetEdge,
      basinInfluence: clamp01(readNumber(material, ["basinShade", "basinPotential", "harborScarBasin"], 0)),
      submergedBlockInfluence: clamp01(readNumber(material, ["submergedBlockMaterialFeed", "submergedBlockStrength"], 0)),
      submergedScarInfluence: clamp01(readNumber(material, ["submergedScarMaterialFeed", "submergedScarStrength"], 0)),
      rgb: rgba(material.rgb || material.color || material.baseColor, [8, 30, 58, 255]),
      color: rgba(material.rgb || material.color || material.baseColor, [8, 30, 58, 255]),
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function createAirPacket(coord) {
    const latitudePressure = clamp01(Math.abs(coord.lat) / 90);
    const humidity = clamp01(0.34 + (1 - latitudePressure) * 0.22);

    return {
      contract: "HEARTH_CANVAS_LIGHTWEIGHT_AIR_CHANNEL_ADAPTER_TNT_v1",
      receipt: "HEARTH_CANVAS_LIGHTWEIGHT_AIR_CHANNEL_ADAPTER_RECEIPT_v1",
      channel: "air",
      isAirChannel: true,
      isLandChannel: false,
      isWaterChannel: false,
      airPresence: 0.12,
      airAlpha: 0.12,
      visualShellAlpha: 0.10,
      pressureEnvelope: clamp01(0.24 + latitudePressure * 0.16),
      humidity,
      mayDefineLand: false,
      mayDefineWater: false,
      ownsSurfaceTruth: false,
      bodyBound: false,
      surfaceBound: false,
      floatsAboveBody: true,
      allowedToFloat: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function installMaterialChannelAdapters() {
    const previous = {
      land: root.HEARTH_LAND_CHANNEL || null,
      water: root.HEARTH_WATER_CHANNEL || null,
      air: root.HEARTH_AIR_CHANNEL || null
    };

    const landChannel = {
      contract: "HEARTH_CANVAS_MATERIALS_TO_LAND_CHANNEL_ADAPTER_TNT_v1",
      receipt: "HEARTH_CANVAS_MATERIALS_TO_LAND_CHANNEL_ADAPTER_RECEIPT_v1",
      adapter: true,
      sourceAuthority: "HEARTH_MATERIALS",
      sample: createLandPacket,
      read: createLandPacket,
      getReceipt() {
        return {
          contract: this.contract,
          receipt: this.receipt,
          sourceAuthority: "HEARTH_MATERIALS",
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false
        };
      },
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    const waterChannel = {
      contract: "HEARTH_CANVAS_MATERIALS_TO_WATER_CHANNEL_ADAPTER_TNT_v1",
      receipt: "HEARTH_CANVAS_MATERIALS_TO_WATER_CHANNEL_ADAPTER_RECEIPT_v1",
      adapter: true,
      sourceAuthority: "HEARTH_MATERIALS",
      sample: createWaterPacket,
      read: createWaterPacket,
      getReceipt() {
        return {
          contract: this.contract,
          receipt: this.receipt,
          sourceAuthority: "HEARTH_MATERIALS",
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false
        };
      },
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    const airChannel = {
      contract: "HEARTH_CANVAS_LIGHTWEIGHT_AIR_CHANNEL_ADAPTER_TNT_v1",
      receipt: "HEARTH_CANVAS_LIGHTWEIGHT_AIR_CHANNEL_ADAPTER_RECEIPT_v1",
      adapter: true,
      sourceAuthority: "HEARTH_CANVAS",
      sample: createAirPacket,
      read: createAirPacket,
      getReceipt() {
        return {
          contract: this.contract,
          receipt: this.receipt,
          sourceAuthority: "HEARTH_CANVAS",
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false
        };
      },
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.landChannel = landChannel;
    root.HEARTH.waterChannel = waterChannel;
    root.HEARTH.airChannel = airChannel;

    root.HEARTH_LAND_CHANNEL = landChannel;
    root.HEARTH_WATER_CHANNEL = waterChannel;
    root.HEARTH_AIR_CHANNEL = airChannel;

    root.HEARTH_CANVAS_CHANNEL_ADAPTERS = {
      contract: CONTRACT,
      receipt: REBUILD_RECEIPT,
      installed: true,
      previousLandChannel: previous.land,
      previousWaterChannel: previous.water,
      previousAirChannel: previous.air,
      landChannel,
      waterChannel,
      airChannel,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    return root.HEARTH_CANVAS_CHANNEL_ADAPTERS;
  }

  function targetElementFrom(input) {
    const doc = root.document || null;

    if (input && input.nodeType === 1) return input;
    if (typeof input === "string" && doc) return doc.querySelector(input);

    return (
      doc &&
      (
        doc.querySelector("#hearthCanvasMount") ||
        doc.querySelector("[data-hearth-canvas-mount]") ||
        doc.querySelector("[data-hearth-planet-mount]") ||
        doc.querySelector("[data-hearth-globe-mount]")
      )
    ) || null;
  }

  function clearPriorCanvases(target) {
    if (!target || typeof target.querySelectorAll !== "function") return;

    Array.from(target.querySelectorAll("canvas[data-hearth-canvas-carrier='true']")).forEach((canvas) => {
      try {
        canvas.remove();
      } catch (_error) {}
    });
  }

  function hideFallback(target) {
    if (!target || typeof target.querySelectorAll !== "function") return;

    Array.from(target.querySelectorAll("[data-hearth-mount-fallback='true']")).forEach((node) => {
      try {
        node.hidden = true;
        node.setAttribute("aria-hidden", "true");
        node.style.display = "none";
      } catch (_error) {}
    });
  }

  function determineBackingSize(target, options = {}) {
    const rect = target && typeof target.getBoundingClientRect === "function"
      ? target.getBoundingClientRect()
      : { width: 460, height: 460 };

    const cssSize = clamp(
      Math.max(
        Number(rect.width) || 0,
        Number(rect.height) || 0,
        Number(options.size) || 0,
        420
      ),
      320,
      760
    );

    const dpr = clamp(root.devicePixelRatio || 1, 1, 2.75);
    const qualityFloor = options.quality === "low" ? 640 : options.quality === "motion" ? 720 : 960;
    const qualityCeiling = options.allowLargeTexture === true ? 1536 : 1280;

    return clamp(
      Math.round(Math.max(cssSize * dpr, qualityFloor)),
      512,
      qualityCeiling
    );
  }

  function createCanvas(target, options = {}) {
    const doc = root.document;

    if (!doc || typeof doc.createElement !== "function") {
      throw new Error("HEARTH_CANVAS requires document.createElement.");
    }

    const canvas = doc.createElement("canvas");
    const size = determineBackingSize(target, options);

    canvas.width = size;
    canvas.height = size;

    canvas.dataset.hearthCanvasCarrier = "true";
    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasRebuildReceipt = REBUILD_RECEIPT;
    canvas.dataset.hearthCanvasPreviousKnownContract = PREVIOUS_KNOWN_CONTRACT;
    canvas.dataset.hearthCanvasPublicContractPreserved = "true";
    canvas.dataset.hearthCanvasVisibleCarrier = "true";
    canvas.dataset.hearthCanvasRouteCompatibleMount = "true";
    canvas.dataset.hearthCanvasMaterialChannelAdapters = "true";
    canvas.dataset.hearthCanvasHexSurfaceConsumer = "true";
    canvas.dataset.hearthCanvasHighDensityBacking = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth active planet visible carrier");

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.webkitTouchCallout = "none";

    target.appendChild(canvas);

    return canvas;
  }

  function drawAtmosphere(ctx, size) {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.456;

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.clip();

    const highlight = ctx.createRadialGradient(
      cx - radius * 0.34,
      cy - radius * 0.38,
      radius * 0.02,
      cx,
      cy,
      radius * 1.16
    );

    highlight.addColorStop(0, "rgba(255,255,255,0.12)");
    highlight.addColorStop(0.30, "rgba(255,255,255,0.035)");
    highlight.addColorStop(0.72, "rgba(0,0,0,0.08)");
    highlight.addColorStop(1, "rgba(0,0,0,0.50)");

    ctx.fillStyle = highlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const edge = ctx.createRadialGradient(cx, cy, radius * 0.66, cx, cy, radius);
    edge.addColorStop(0, "rgba(0,0,0,0)");
    edge.addColorStop(0.80, "rgba(4,12,22,0.16)");
    edge.addColorStop(1, "rgba(2,6,14,0.68)");

    ctx.fillStyle = edge;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, TAU);
    ctx.strokeStyle = "rgba(190,226,255,0.24)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(2, size * 0.011), 0, TAU);
    ctx.strokeStyle = "rgba(108,185,232,0.10)";
    ctx.lineWidth = Math.max(1, size * 0.006);
    ctx.stroke();
    ctx.restore();
  }

  function drawFallbackMaterialsFrame(state, options = {}) {
    const canvas = state.canvas;
    const ctx = state.ctx;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.456;
    const image = ctx.createImageData(size, size);
    const data = image.data;
    const phase = Number(state.phase) || 0;
    const tilt = Number(state.tilt) || -0.22;
    const light = norm3([-0.48, 0.28, 0.84]);

    let landPixels = 0;
    let waterPixels = 0;

    for (let py = 0; py < size; py += 1) {
      const y = (py + 0.5 - cy) / radius;

      for (let px = 0; px < size; px += 1) {
        const x = (px + 0.5 - cx) / radius;
        const r2 = x * x + y * y;

        if (r2 > 1) continue;

        const z = Math.sqrt(Math.max(0, 1 - r2));
        let vec = [x, -y, z];

        vec = rotateX(vec, tilt);
        vec = rotateY(vec, phase);

        const coord = vectorToCoord(vec);
        const material = sampleMaterials(coord);
        const isLand = readBool(material, ["isLand"], false);
        const colorBase = rgba(material.rgb || material.color || material.baseColor, isLand ? [104, 96, 64, 255] : [8, 30, 58, 255]);

        if (isLand) landPixels += 1;
        else waterPixels += 1;

        const relief = clamp01(readNumber(material, ["terrainRelief", "ridgeRelief", "reliefStrength"], 0));
        const waterDepth = clamp01(readNumber(material, ["waterDepth", "waterDepthShade", "waterDepthPotential"], 0));
        const shoreline = clamp01(readNumber(material, ["shorelineGrounding", "waterlineMaterialFeed", "coastPotential"], 0));
        const scar = clamp01(readNumber(material, ["submergedScarMaterialFeed", "submergedScarStrength", "boundaryMorphologyFeed"], 0));
        const noise = fbm(coord.u * 22 + phase * 0.15, coord.v * 18 - phase * 0.08, isLand ? 6211 : 6221, 4);

        let color = colorBase;

        if (isLand) {
          color = mixColor(color, [172, 154, 98, 255], relief * 0.13 + Math.max(0, noise - 0.5) * 0.08);
          color = mixColor(color, [48, 50, 43, 255], Math.max(0, 0.5 - noise) * 0.12);
          color = mixColor(color, [116, 102, 74, 255], shoreline * 0.15);
        } else {
          color = mixColor(color, [4, 18, 46, 255], waterDepth * 0.26);
          color = mixColor(color, [38, 128, 144, 255], shoreline * 0.12);
          color = mixColor(color, [28, 36, 34, 255], scar * 0.16);
        }

        const rawNormal = norm3([x, -y, z]);
        const lightValue = clamp01(rawNormal[0] * light[0] + rawNormal[1] * light[1] + rawNormal[2] * light[2]);
        const limb = clamp(0.54 + z * 0.54, 0.46, 1.08);
        const shade = clamp(0.72 + lightValue * 0.40 + (noise - 0.5) * 0.08, 0.52, 1.15);

        color = scaleColor(color, limb * shade);

        const index = (py * size + px) * 4;
        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);
    drawAtmosphere(ctx, size);

    return {
      ok: true,
      contract: CONTRACT,
      receipt: "HEARTH_CANVAS_FALLBACK_MATERIALS_FRAME_RECEIPT_v1",
      renderer: "fallback-materials-body-renderer",
      size,
      landPixels,
      waterPixels,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      at: nowIso()
    };
  }

  function drawFrame(state, reason = "frame") {
    if (!state || state.destroyed || !state.canvas || !state.ctx) return null;

    const hexSurface = resolveHexSurface();
    let frameReceipt = null;

    state.frameCount += 1;
    state.lastFrameReason = reason;

    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

    if (hexSurface && typeof hexSurface.drawHearthHexSurfaceFrame === "function") {
      try {
        frameReceipt = hexSurface.drawHearthHexSurfaceFrame(state, {
          radiusRatio: 0.456,
          hexDensity: state.motionActive ? 210 : 260,
          minHexRadius: state.motionActive ? 0.74 : 0.62,
          maxHexRadius: state.motionActive ? 3.0 : 3.4,
          edgeDarkening: 0.020,
          seamSoftening: 0.052,
          authoritySeedStrength: 0.48,
          microTerrainStrength: state.motionActive ? 0.32 : 0.44,
          landExposureLift: 0.18,
          waterDepthPush: 0.24,
          contrastLift: 0.20,
          atmosphereStrength: 0.94,
          axialTilt: state.tilt,
          lightX: -0.48,
          lightY: 0.28,
          lightZ: 0.84
        });

        state.renderer = "HEARTH_HEX_SURFACE";
      } catch (error) {
        state.lastError = error && error.message ? error.message : String(error);
        frameReceipt = drawFallbackMaterialsFrame(state);
        state.renderer = "HEARTH_CANVAS_FALLBACK_MATERIALS";
      }
    } else if (hexSurface && typeof hexSurface.drawFrame === "function") {
      try {
        frameReceipt = hexSurface.drawFrame(state, {
          radiusRatio: 0.456,
          hexDensity: state.motionActive ? 210 : 260,
          minHexRadius: state.motionActive ? 0.74 : 0.62,
          maxHexRadius: state.motionActive ? 3.0 : 3.4,
          axialTilt: state.tilt
        });

        state.renderer = "HEARTH_HEX_SURFACE_DRAW_FRAME";
      } catch (error) {
        state.lastError = error && error.message ? error.message : String(error);
        frameReceipt = drawFallbackMaterialsFrame(state);
        state.renderer = "HEARTH_CANVAS_FALLBACK_MATERIALS";
      }
    } else {
      frameReceipt = drawFallbackMaterialsFrame(state);
      state.renderer = "HEARTH_CANVAS_FALLBACK_MATERIALS";
    }

    state.imageRendered = true;
    state.lastFrameReceipt = frameReceipt;
    state.lastFrameAt = nowIso();

    publishDataset(state);

    return frameReceipt;
  }

  function publishDataset(state) {
    const dataset = root.document && root.document.documentElement
      ? root.document.documentElement.dataset
      : null;

    if (dataset) {
      dataset.hearthCanvasAuthorityLoaded = "true";
      dataset.hearthCanvasContract = CONTRACT;
      dataset.hearthCanvasReceipt = RECEIPT;
      dataset.hearthCanvasRebuildReceipt = REBUILD_RECEIPT;
      dataset.hearthCanvasPreviousKnownContract = PREVIOUS_KNOWN_CONTRACT;
      dataset.hearthCanvasPublicContractPreserved = "true";
      dataset.hearthCanvasRouteCompatibleMount = "true";
      dataset.hearthCanvasVisibleCarrier = "true";
      dataset.hearthCanvasMounted = state && state.mounted ? "true" : "false";
      dataset.hearthCanvasImageRendered = state && state.imageRendered ? "true" : "false";
      dataset.hearthCanvasControlsBound = state && state.controlsBound ? "true" : "false";
      dataset.hearthCanvasRenderer = state && state.renderer ? state.renderer : "";
      dataset.hearthCanvasBackingSize = state && state.canvas ? String(state.canvas.width) : "";
      dataset.hearthCanvasMaterialChannelAdapters = "true";
      dataset.hearthCanvasHexSurfacePresent = resolveHexSurface() ? "true" : "false";
      dataset.hearthCanvasMaterialsPresent = resolveMaterials() ? "true" : "false";
      dataset.hearthCanvasHexAuthorityPresent = resolveHexAuthority() ? "true" : "false";
      dataset.generatedImage = "false";
      dataset.graphicBox = "false";
      dataset.webgl = "false";
      dataset.visualPassClaimed = "false";
    }

    if (state && state.canvas && state.canvas.dataset) {
      state.canvas.dataset.hearthCanvasMounted = state.mounted ? "true" : "false";
      state.canvas.dataset.hearthCanvasImageRendered = state.imageRendered ? "true" : "false";
      state.canvas.dataset.hearthCanvasControlsBound = state.controlsBound ? "true" : "false";
      state.canvas.dataset.hearthCanvasRenderer = state.renderer || "";
      state.canvas.dataset.hearthCanvasFrameCount = String(state.frameCount || 0);
      state.canvas.dataset.hearthCanvasPhase = String(Number(state.phase || 0).toFixed(6));
      state.canvas.dataset.hearthCanvasLastFrameAt = state.lastFrameAt || "";
      state.canvas.dataset.generatedImage = "false";
      state.canvas.dataset.graphicBox = "false";
      state.canvas.dataset.webgl = "false";
      state.canvas.dataset.visualPassClaimed = "false";
    }
  }

  function createReceipt(state = null) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      rebuildReceipt: REBUILD_RECEIPT,
      previousKnownContract: PREVIOUS_KNOWN_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-runtime-table-directed-visible-carrier",
      status: state && state.mounted ? "mounted" : "active",
      destinationFile: "/assets/hearth/hearth.canvas.js",
      routeExpectedContract: ROUTE_EXPECTED_CONTRACT,
      publicContractPreservedForRoute: true,

      mounted: Boolean(state && state.mounted),
      imageRendered: Boolean(state && state.imageRendered),
      controlsBound: Boolean(state && state.controlsBound),
      renderer: state && state.renderer ? state.renderer : "",
      backingSize: state && state.canvas ? state.canvas.width : null,
      mountSelector: state && state.mountSelector ? state.mountSelector : "",

      consumes: {
        hexSurface: Boolean(resolveHexSurface()),
        materials: Boolean(resolveMaterials()),
        hexFourPairAuthority: Boolean(resolveHexAuthority())
      },

      adapters: {
        landChannel: Boolean(root.HEARTH_LAND_CHANNEL && root.HEARTH_LAND_CHANNEL.adapter),
        waterChannel: Boolean(root.HEARTH_WATER_CHANNEL && root.HEARTH_WATER_CHANNEL.adapter),
        airChannel: Boolean(root.HEARTH_AIR_CHANNEL && root.HEARTH_AIR_CHANNEL.adapter),
        sourceAuthority: "HEARTH_MATERIALS"
      },

      routeApiShape: {
        mount: true,
        createShellFirstMount: true,
        refresh: true,
        destroy: true,
        getReceipt: true,
        stateImageRendered: Boolean(state && state.imageRendered),
        stateControlsBound: Boolean(state && state.controlsBound)
      },

      owns: [
        "visible-canvas-carrier",
        "canvas-mount",
        "fallback-removal",
        "material-channel-adapter-bridge",
        "2d-frame-drawing-handoff",
        "drag-spin-inspection",
        "canvas-route-receipt"
      ],

      doesNotOwn: [
        "tectonic cause",
        "elevation generation",
        "composition classification",
        "hydrology classification",
        "material palette truth",
        "route orchestration",
        "final visual pass claim"
      ],

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      at: nowIso()
    };
  }

  function bindControls(state) {
    const canvas = state.canvas;
    const target = state.target;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastAt = 0;

    const captureTarget = target || canvas;

    function pointerDown(event) {
      dragging = true;
      state.motionActive = true;
      state.velocity = 0;
      lastX = Number(event.clientX) || 0;
      lastY = Number(event.clientY) || 0;
      lastAt = Date.now();

      try {
        canvas.setPointerCapture(event.pointerId);
      } catch (_error) {}

      event.preventDefault();
    }

    function pointerMove(event) {
      if (!dragging) return;

      const x = Number(event.clientX) || 0;
      const y = Number(event.clientY) || 0;
      const now = Date.now();
      const dx = x - lastX;
      const dy = y - lastY;
      const dt = Math.max(16, now - lastAt);

      state.phase += dx * 0.0075;
      state.tilt = clamp(state.tilt + dy * 0.0035, -0.72, 0.72);
      state.velocity = clamp(dx / dt, -3.2, 3.2) * 0.28;

      lastX = x;
      lastY = y;
      lastAt = now;

      drawFrame(state, "pointer-drag");
      event.preventDefault();
    }

    function pointerUp(event) {
      dragging = false;
      state.motionActive = false;

      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch (_error) {}

      event.preventDefault();
    }

    function wheel(event) {
      const delta = clamp(Number(event.deltaY) || 0, -160, 160);
      state.phase += delta * 0.0009;
      drawFrame(state, "wheel-inspection");
      event.preventDefault();
    }

    captureTarget.addEventListener("pointerdown", pointerDown, { passive: false });
    captureTarget.addEventListener("pointermove", pointerMove, { passive: false });
    captureTarget.addEventListener("pointerup", pointerUp, { passive: false });
    captureTarget.addEventListener("pointercancel", pointerUp, { passive: false });
    captureTarget.addEventListener("wheel", wheel, { passive: false });

    state.controlsBound = true;

    return () => {
      captureTarget.removeEventListener("pointerdown", pointerDown);
      captureTarget.removeEventListener("pointermove", pointerMove);
      captureTarget.removeEventListener("pointerup", pointerUp);
      captureTarget.removeEventListener("pointercancel", pointerUp);
      captureTarget.removeEventListener("wheel", wheel);
    };
  }

  function startMotionLoop(state) {
    function tick() {
      if (!state || state.destroyed) return;

      const moving = Math.abs(state.velocity) > 0.0004;

      if (moving) {
        state.phase += state.velocity;
        state.velocity *= 0.925;
        state.motionActive = true;
        drawFrame(state, "inertia");
      } else {
        state.motionActive = false;
        state.velocity = 0;
      }

      state.raf = root.requestAnimationFrame ? root.requestAnimationFrame(tick) : setTimeout(tick, 80);
    }

    state.raf = root.requestAnimationFrame ? root.requestAnimationFrame(tick) : setTimeout(tick, 80);
  }

  function createMountApi(state) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      rebuildReceipt: REBUILD_RECEIPT,
      canvas: state.canvas,
      ctx: state.ctx,
      target: state.target,
      controlsBound: true,
      state,

      refresh(reason = "manual-refresh") {
        return drawFrame(state, reason);
      },

      resize() {
        if (!state || state.destroyed) return null;

        const nextSize = determineBackingSize(state.target, state.options);

        if (nextSize !== state.canvas.width) {
          state.canvas.width = nextSize;
          state.canvas.height = nextSize;
          state.hearthHexSurfaceGeometry = null;
          state.hearthHexGeometry = null;
        }

        return drawFrame(state, "resize");
      },

      destroy() {
        if (state.destroyed) return;

        state.destroyed = true;

        if (typeof state.unbindControls === "function") {
          try {
            state.unbindControls();
          } catch (_error) {}
        }

        if (state.raf) {
          try {
            if (root.cancelAnimationFrame) root.cancelAnimationFrame(state.raf);
            else clearTimeout(state.raf);
          } catch (_error) {}
        }

        try {
          if (state.canvas && state.canvas.parentNode) state.canvas.remove();
        } catch (_error) {}

        state.mounted = false;
        publishDataset(state);
      },

      getReceipt() {
        return createReceipt(state);
      },

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function mount(targetInput, options = {}) {
    if (activeMount && typeof activeMount.destroy === "function") {
      try {
        activeMount.destroy();
      } catch (_error) {}
    }

    const target = targetElementFrom(targetInput);

    if (!target) {
      throw new Error("HEARTH_CANVAS mount target not found.");
    }

    mountSerial += 1;
    clearPriorCanvases(target);
    hideFallback(target);
    installMaterialChannelAdapters();

    const canvas = createCanvas(target, options);
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });

    if (!ctx) {
      throw new Error("HEARTH_CANVAS could not create 2D context.");
    }

    const state = {
      contract: CONTRACT,
      receipt: RECEIPT,
      rebuildReceipt: REBUILD_RECEIPT,
      serial: mountSerial,
      target,
      canvas,
      ctx,
      options: { ...options },
      phase: Number(options.phase) || 0,
      tilt: -0.22,
      velocity: 0,
      mounted: true,
      imageRendered: false,
      controlsBound: false,
      renderer: "",
      frameCount: 0,
      lastFrameReceipt: null,
      lastFrameAt: "",
      lastFrameReason: "",
      lastError: "",
      motionActive: false,
      destroyed: false,
      mountSelector: target.id ? `#${target.id}` : target.dataset && target.dataset.hearthCanvasMount ? "[data-hearth-canvas-mount]" : "element",
      routeContract: options.routeContract || "",
      routeReceipt: options.routeReceipt || "",
      hexFourPairAuthorityValidated: options.hexFourPairAuthorityValidated === true,
      routeBlocksCanvasForHexMissing: options.routeBlocksCanvasForHexMissing === true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    state.unbindControls = bindControls(state);

    drawFrame(state, "initial-mount");

    state.imageRendered = true;
    state.controlsBound = true;

    const mountApi = createMountApi(state);
    activeMount = mountApi;

    startMotionLoop(state);
    publishDataset(state);

    if (typeof options.onStatus === "function") {
      try {
        options.onStatus("hearth-canvas-mounted", {
          contract: CONTRACT,
          receipt: RECEIPT,
          rebuildReceipt: REBUILD_RECEIPT,
          imageRendered: true,
          controlsBound: true,
          visualPassClaimed: false
        });
      } catch (_error) {}
    }

    return mountApi;
  }

  function createShellFirstMount(targetInput, options = {}) {
    return mount(targetInput, options);
  }

  function destroy() {
    if (activeMount && typeof activeMount.destroy === "function") {
      activeMount.destroy();
    }

    activeMount = null;
  }

  function refresh(reason = "api-refresh") {
    if (activeMount && typeof activeMount.refresh === "function") {
      return activeMount.refresh(reason);
    }

    return null;
  }

  function getReceipt() {
    return createReceipt(activeMount && activeMount.state ? activeMount.state : null);
  }

  function getStatus() {
    const state = activeMount && activeMount.state ? activeMount.state : null;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      rebuildReceipt: REBUILD_RECEIPT,
      version: VERSION,
      mounted: Boolean(state && state.mounted),
      imageRendered: Boolean(state && state.imageRendered),
      controlsBound: Boolean(state && state.controlsBound),
      renderer: state && state.renderer ? state.renderer : "",
      backingSize: state && state.canvas ? state.canvas.width : null,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    rebuildReceipt: REBUILD_RECEIPT,
    previousKnownContract: PREVIOUS_KNOWN_CONTRACT,
    version: VERSION,
    authority: "hearth-canvas-runtime-table-directed-visible-carrier",

    mount,
    createShellFirstMount,
    destroy,
    refresh,
    getReceipt,
    getStatus,

    installMaterialChannelAdapters,
    resolveMaterials,
    resolveHexSurface,
    resolveHexAuthority,

    routeCompatibleVisibleCarrier: true,
    publicContractPreservedForRoute: true,
    materialChannelAdapters: true,
    consumesHexSurface: true,
    consumesMaterials: true,
    controlsBoundByMount: true,

    ownsCanvasMount: true,
    ownsVisibleCarrier: true,
    ownsTectonicCause: false,
    ownsElevationGeneration: false,
    ownsCompositionClassification: false,
    ownsHydrologyClassification: false,
    ownsMaterialPaletteTruth: false,
    ownsRouteOrchestration: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;

  root.HEARTH_CANVAS = api;
  root.HearthCanvas = api;
  root.HEARTH_CANVAS_CONTRACT = CONTRACT;
  root.HEARTH_CANVAS_RECEIPT = RECEIPT;
  root.HEARTH_CANVAS_REBUILD_RECEIPT = REBUILD_RECEIPT;
  root.__HEARTH_CANVAS_DISPOSE__ = destroy;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.hearthCanvasAuthorityLoaded = "true";
    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasRebuildReceipt = REBUILD_RECEIPT;
    dataset.hearthCanvasPreviousKnownContract = PREVIOUS_KNOWN_CONTRACT;
    dataset.hearthCanvasPublicContractPreserved = "true";
    dataset.hearthCanvasRouteCompatibleMount = "true";
    dataset.hearthCanvasVisibleCarrier = "true";
    dataset.hearthCanvasMaterialChannelAdapters = "true";
    dataset.hearthCanvasConsumesHexSurface = "true";
    dataset.hearthCanvasConsumesMaterials = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
