// /assets/hearth/hearth.canvas.js
// HEARTH_4K_LAND_CLARITY_CANVAS_REFINEMENT_TNT_v1
// Full-file replacement.
// Canvas / composition authority only.
// Purpose:
// - Restore Hearth land clarity and 4K-style terrain readability.
// - Preserve active body carrier, route mount, receipt/export posture, and child-channel separation.
// - Apply high-DPI backing, high-resolution internal surface texture, crisp land edge/detail,
//   atmosphere discipline, and refine-after-settle behavior.
// Does not own:
// - route navigation
// - Map Portal behavior
// - receipt removal behavior
// - upstream terrain truth
// - upstream hydrology truth
// - upstream atmosphere truth
// - runtime law
// - controls law
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_4K_LAND_CLARITY_CANVAS_REFINEMENT_TNT_v1";
  const RECEIPT = "HEARTH_4K_LAND_CLARITY_CANVAS_REFINEMENT_RECEIPT_v1";
  const FAMILY = "HEARTH_4K_LAND_CLARITY_RESTORATION_FAMILY_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_HEX_FOUR_PAIR_BODY_BOUNDARY_CARRIER_TNT_v1";

  const ROOT = typeof window !== "undefined" ? window : globalThis;
  const DOC = typeof document !== "undefined" ? document : null;
  const HEARTH = (ROOT.HEARTH = ROOT.HEARTH || {});

  const state = {
    booted: false,
    destroyed: false,
    mount: null,
    canvas: null,
    ctx: null,
    textureCanvas: null,
    textureCtx: null,
    textureImage: null,
    renderCanvas: null,
    renderCtx: null,
    renderImage: null,
    cssWidth: 0,
    cssHeight: 0,
    backingWidth: 0,
    backingHeight: 0,
    dpr: 1,
    dprCap: 2.5,
    textureSize: 2048,
    textureScale: 1,
    yaw: -0.42,
    pitch: 0.03,
    spinVelocity: 0.000028,
    dragging: false,
    pointerId: null,
    lastPointerX: 0,
    lastPointerY: 0,
    lastFrameTime: 0,
    lastRenderTime: 0,
    lastInteractionTime: 0,
    settleTimer: 0,
    refined: true,
    runtimeConsumed: false,
    channels: null,
    landSourceDetailState: "uninspected",
    textureBuilt: false,
    imageRendered: false,
    settleRefinementRan: false,
    receipt: null,
    resizeObserver: null,
    animationId: 0
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mix(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0 || 1), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function hash2(x, y) {
    return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
  }

  function valueNoise(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);

    const a = hash2(xi, yi);
    const b = hash2(xi + 1, yi);
    const c = hash2(xi, yi + 1);
    const d = hash2(xi + 1, yi + 1);

    return mix(mix(a, b, u), mix(c, d, u), v);
  }

  function fbm(x, y, octaves) {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let total = 0;

    for (let i = 0; i < octaves; i += 1) {
      value += amplitude * valueNoise(x * frequency, y * frequency);
      total += amplitude;
      amplitude *= 0.5;
      frequency *= 2.05;
    }

    return total ? value / total : value;
  }

  function normalizeAngle(value) {
    const twoPi = Math.PI * 2;
    let next = value % twoPi;
    if (next < -Math.PI) next += twoPi;
    if (next > Math.PI) next -= twoPi;
    return next;
  }

  function findFirst(candidates) {
    for (const candidate of candidates) {
      if (!candidate) continue;
      const parts = String(candidate).split(".");
      let cursor = ROOT;
      let found = true;

      for (const part of parts) {
        if (cursor && Object.prototype.hasOwnProperty.call(cursor, part)) {
          cursor = cursor[part];
        } else {
          found = false;
          break;
        }
      }

      if (found && cursor) return cursor;
    }

    return null;
  }

  function findChannels() {
    const hex = findFirst([
      "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_FOUR_PAIR_BODY_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_AUTHORITY",
      "HEARTH.hexAuthority",
      "HEARTH.hex"
    ]);

    const land = findFirst([
      "HEARTH_LAND_CHANNEL",
      "HEARTH.landChannel",
      "HEARTH.land",
      "HEARTH_TERRAIN_CHANNEL",
      "HEARTH_TERRAIN",
      "HEARTH_MATERIALS",
      "HEARTH_COMPOSITION"
    ]);

    const water = findFirst([
      "HEARTH_WATER_CHANNEL",
      "HEARTH.waterChannel",
      "HEARTH.water",
      "HEARTH_HYDROLOGY",
      "HEARTH_OCEAN",
      "HEARTH.ocean"
    ]);

    const air = findFirst([
      "HEARTH_AIR_CHANNEL",
      "HEARTH.airChannel",
      "HEARTH.air",
      "HEARTH_ATMOSPHERE",
      "HEARTH_CLIMATE",
      "HEARTH.climate"
    ]);

    return { hex, land, water, air };
  }

  function tryCall(source, methodNames, args) {
    if (!source) return null;

    for (const methodName of methodNames) {
      const method = source && source[methodName];
      if (typeof method === "function") {
        try {
          const result = method.apply(source, args);
          if (result !== undefined && result !== null) return result;
        } catch (_) {
          // Defensive adapter. Source APIs may differ by route generation.
        }
      }
    }

    return null;
  }

  function sampleGridLike(source, u, v) {
    if (!source || typeof source !== "object") return null;

    const grids = [
      source.grid,
      source.cells,
      source.samples,
      source.data,
      source.map,
      source.texture,
      source.materials
    ].filter(Boolean);

    for (const grid of grids) {
      if (!Array.isArray(grid) && !(grid && typeof grid.length === "number")) continue;

      const h = source.height || source.rows || source.size || Math.round(Math.sqrt(grid.length));
      const w = source.width || source.cols || source.size || (h ? Math.round(grid.length / h) : 0);
      if (!w || !h) continue;

      const x = clamp(Math.floor(u * w), 0, w - 1);
      const y = clamp(Math.floor(v * h), 0, h - 1);
      const index = y * w + x;
      const result = grid[index];

      if (result !== undefined && result !== null) return result;
    }

    return null;
  }

  function sampleSource(source, lon, lat, u, v, kind) {
    if (!source) return null;

    const argsA = [{ lon, lat, u, v, kind }, lon, lat, u, v];
    const argsB = [u, v, lon, lat, kind];

    const direct = tryCall(
      source,
      [
        "sample",
        "sampleAt",
        "read",
        "readAt",
        "get",
        "getAt",
        "classify",
        "classifyAt",
        "getCell",
        "cellAt"
      ],
      argsA
    );

    if (direct !== null) return direct;

    const uv = tryCall(
      source,
      [
        "sampleUV",
        "readUV",
        "getUV",
        "materialAt",
        "terrainAt",
        "landAt",
        "waterAt",
        "airAt"
      ],
      argsB
    );

    if (uv !== null) return uv;

    return sampleGridLike(source, u, v);
  }

  function numberFromRaw(raw, names, fallback) {
    if (typeof raw === "number") return raw;
    if (!raw || typeof raw !== "object") return fallback;

    for (const name of names) {
      if (typeof raw[name] === "number" && Number.isFinite(raw[name])) return raw[name];
      if (typeof raw[name] === "boolean") return raw[name] ? 1 : 0;
    }

    return fallback;
  }

  function boolFromRaw(raw, names, fallback) {
    if (typeof raw === "boolean") return raw;
    if (typeof raw === "number") return raw > 0.5;
    if (!raw || typeof raw !== "object") return fallback;

    for (const name of names) {
      if (typeof raw[name] === "boolean") return raw[name];
      if (typeof raw[name] === "number") return raw[name] > 0.5;
      if (typeof raw[name] === "string") {
        const value = raw[name].toLowerCase();
        if (
          value.includes("land") ||
          value.includes("terrain") ||
          value.includes("mountain") ||
          value.includes("plateau")
        ) {
          return true;
        }
        if (
          value.includes("water") ||
          value.includes("ocean") ||
          value.includes("sea") ||
          value.includes("air")
        ) {
          return false;
        }
      }
    }

    return fallback;
  }

  function colorFromRaw(raw) {
    if (!raw || typeof raw !== "object") return null;

    const color = raw.color || raw.rgb || raw.materialColor || raw.fill;

    if (Array.isArray(color) && color.length >= 3) {
      return [
        clamp(Math.round(color[0]), 0, 255),
        clamp(Math.round(color[1]), 0, 255),
        clamp(Math.round(color[2]), 0, 255)
      ];
    }

    if (typeof color === "string") {
      const hex = color.trim().replace("#", "");
      if (/^[0-9a-fA-F]{6}$/.test(hex)) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16)
        ];
      }
    }

    return null;
  }

  function proceduralSample(lon, lat, u, v) {
    const latAbs = Math.abs(lat / (Math.PI / 2));
    const equatorBias = 1 - Math.pow(latAbs, 1.8);
    const continental = fbm(u * 4.2 + 13.7, v * 2.8 - 2.1, 5);
    const tectonic = fbm(u * 9.5 - 4.3, v * 6.5 + 8.2, 4);
    const mountain = fbm(u * 34.0 + 6.0, v * 23.0 - 11.0, 3);
    const ridge = Math.abs(Math.sin(lon * 2.0 + Math.sin(lat * 3.0) * 1.15));
    const ridgeField = 1 - smoothstep(0.12, 0.58, ridge);
    const dryness = fbm(u * 5.8 + 21.0, v * 5.2 + 3.0, 4);

    let landScore =
      continental * 0.72 +
      tectonic * 0.24 +
      equatorBias * 0.16 +
      ridgeField * 0.14 -
      0.14;

    landScore = clamp(landScore, 0, 1);

    const elevation = clamp(
      landScore * 0.72 + mountain * 0.22 + ridgeField * 0.20 - latAbs * 0.08,
      0,
      1
    );

    const moisture = clamp(1 - dryness * 0.75 + equatorBias * 0.18, 0, 1);

    return { landScore, elevation, moisture, mountain, ridgeField, continental, tectonic };
  }

  function readCompositeSample(lon, lat, u, v) {
    const channels = state.channels || findChannels();
    state.channels = channels;

    const procedural = proceduralSample(lon, lat, u, v);
    const landRaw = sampleSource(channels.land, lon, lat, u, v, "land");
    const waterRaw = sampleSource(channels.water, lon, lat, u, v, "water");
    const airRaw = sampleSource(channels.air, lon, lat, u, v, "air");

    const rawLandScore = numberFromRaw(
      landRaw,
      ["landScore", "land", "landMask", "terrain", "material", "coverage", "presence", "value", "elevation"],
      procedural.landScore
    );

    const rawWaterScore = numberFromRaw(
      waterRaw,
      ["waterScore", "water", "ocean", "hydrology", "depth", "coverage", "presence", "value"],
      1 - procedural.landScore
    );

    const rawElevation = numberFromRaw(
      landRaw,
      ["elevation", "height", "altitude", "relief", "terrainHeight", "z"],
      procedural.elevation
    );

    const rawMoisture = numberFromRaw(
      waterRaw,
      ["moisture", "humidity", "wetness", "shore", "hydro", "value"],
      procedural.moisture
    );

    const forcedLand = boolFromRaw(
      landRaw,
      ["isLand", "land", "terrain", "solid", "bodyBound", "body"],
      null
    );

    const forcedWater = boolFromRaw(
      waterRaw,
      ["isWater", "water", "ocean", "sea", "hydro"],
      null
    );

    let landScore = clamp(rawLandScore, 0, 1);
    const waterScore = clamp(rawWaterScore, 0, 1);

    if (forcedLand === true) landScore = Math.max(landScore, 0.76);
    if (forcedWater === true && forcedLand !== true) landScore = Math.min(landScore, 0.34);
    if (waterScore > 0.68 && forcedLand !== true) landScore = Math.min(landScore, 0.48);

    return {
      landScore,
      waterScore,
      elevation: clamp(rawElevation, 0, 1),
      moisture: clamp(rawMoisture, 0, 1),
      sourceColor: colorFromRaw(landRaw) || colorFromRaw(waterRaw) || colorFromRaw(airRaw),
      landRaw,
      waterRaw,
      airRaw,
      procedural
    };
  }

  function chooseTextureSize() {
    const maxBacking = Math.max(state.backingWidth, state.backingHeight);
    const memory = ROOT.navigator && ROOT.navigator.deviceMemory ? Number(ROOT.navigator.deviceMemory) : 4;

    if (memory >= 8 && maxBacking >= 1000 && state.dpr >= 2) return 3072;
    if (memory >= 4 && maxBacking >= 720) return 2560;
    return 2048;
  }

  function classifyLandSourceState() {
    const channels = state.channels || findChannels();
    state.channels = channels;

    if (!channels.land) return "procedural-fallback-no-land-channel-detected";

    let hits = 0;
    let detail = 0;
    let last = null;

    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 16; x += 1) {
        const u = (x + 0.5) / 16;
        const v = (y + 0.5) / 8;
        const lon = (u - 0.5) * Math.PI * 2;
        const lat = (0.5 - v) * Math.PI;
        const raw = sampleSource(channels.land, lon, lat, u, v, "land");

        if (raw !== null) {
          hits += 1;
          const value = numberFromRaw(raw, ["landScore", "land", "elevation", "height", "value"], null);

          if (typeof value === "number") {
            if (last !== null) detail += Math.abs(value - last);
            last = value;
          } else if (typeof raw === "object") {
            detail += Object.keys(raw).length * 0.01;
          }
        }
      }
    }

    if (!hits) return "land-channel-detected-no-readable-samples";
    if (detail < 0.6) return "broad-or-soft-source-samples";
    return "readable-source-samples";
  }

  function buildSurfaceTexture() {
    const size = chooseTextureSize();
    state.textureSize = size;
    state.textureScale = size / 2048;

    const textureCanvas = DOC.createElement("canvas");
    textureCanvas.width = size;
    textureCanvas.height = size;

    const textureCtx = textureCanvas.getContext("2d", {
      willReadFrequently: true,
      alpha: false
    });

    const image = textureCtx.createImageData(size, size);
    const data = image.data;
    const sampleStep = 1 / size;

    let landPixels = 0;
    let edgePixels = 0;
    let detailedPixels = 0;

    state.landSourceDetailState = classifyLandSourceState();

    for (let y = 0; y < size; y += 1) {
      const v = (y + 0.5) * sampleStep;
      const lat = (0.5 - v) * Math.PI;

      for (let x = 0; x < size; x += 1) {
        const u = (x + 0.5) * sampleStep;
        const lon = (u - 0.5) * Math.PI * 2;
        const sample = readCompositeSample(lon, lat, u, v);
        const p = sample.procedural;

        const sharpenedLand = smoothstep(0.485, 0.535, sample.landScore);
        const isLand = sharpenedLand >= 0.5;
        const edgeBand = 1 - smoothstep(0.015, 0.105, Math.abs(sample.landScore - 0.51));
        const fine = fbm(u * 135.0 + p.ridgeField * 3.0, v * 96.0 + p.mountain * 2.0, 3);
        const grain = fbm(u * 420.0, v * 420.0, 2);
        const relief = clamp(sample.elevation * 0.72 + p.mountain * 0.22 + fine * 0.12, 0, 1);
        const shore = edgeBand * (isLand ? 1 : 0.7);

        let r;
        let g;
        let b;

        if (isLand) {
          landPixels += 1;
          if (edgeBand > 0.25) edgePixels += 1;
          if (fine > 0.48 || relief > 0.55) detailedPixels += 1;

          const desert = smoothstep(0.34, 0.78, 1 - sample.moisture) * smoothstep(0.22, 0.7, relief);
          const green = smoothstep(0.33, 0.72, sample.moisture) * (1 - smoothstep(0.72, 0.93, relief));
          const mountain = smoothstep(0.62, 0.92, relief);
          const lowland = 1 - Math.max(desert, green, mountain);

          const soil = [125, 99, 63];
          const vegetation = [66, 101, 65];
          const dry = [174, 143, 86];
          const rock = [166, 155, 134];
          const snow = [217, 213, 195];

          r = soil[0] * lowland + vegetation[0] * green + dry[0] * desert + rock[0] * mountain;
          g = soil[1] * lowland + vegetation[1] * green + dry[1] * desert + rock[1] * mountain;
          b = soil[2] * lowland + vegetation[2] * green + dry[2] * desert + rock[2] * mountain;

          const snowCap = smoothstep(0.86, 0.99, relief) * smoothstep(0.18, 0.75, Math.abs(lat) / (Math.PI / 2));

          r = mix(r, snow[0], snowCap * 0.55);
          g = mix(g, snow[1], snowCap * 0.55);
          b = mix(b, snow[2], snowCap * 0.55);

          const detail = (fine - 0.5) * 30 + (grain - 0.5) * 10 + (relief - 0.5) * 28;

          r += detail;
          g += detail;
          b += detail;

          const coastLight = shore * 24;

          r += coastLight;
          g += coastLight * 0.92;
          b += coastLight * 0.54;

          if (sample.sourceColor && state.channels && state.channels.land) {
            r = mix(r, sample.sourceColor[0], 0.18);
            g = mix(g, sample.sourceColor[1], 0.18);
            b = mix(b, sample.sourceColor[2], 0.18);
          }
        } else {
          const depth = clamp(1 - sample.waterScore * 0.55 - sample.landScore * 0.35 + p.tectonic * 0.18, 0, 1);
          const current = fbm(u * 55.0 + 4.0, v * 39.0 - 7.0, 4);

          const deep = [7, 31, 82];
          const mid = [12, 69, 128];
          const shelf = [31, 119, 157];

          const shelfT = smoothstep(0.30, 0.52, sample.landScore) * 0.92;
          const midT = smoothstep(0.16, 0.72, depth);

          r = mix(deep[0], mid[0], midT);
          g = mix(deep[1], mid[1], midT);
          b = mix(deep[2], mid[2], midT);

          r = mix(r, shelf[0], shelfT);
          g = mix(g, shelf[1], shelfT);
          b = mix(b, shelf[2], shelfT);

          const shimmer = (current - 0.5) * 8;

          r += shimmer * 0.35;
          g += shimmer * 0.65;
          b += shimmer;

          if (edgeBand > 0.35) edgePixels += 1;
        }

        const index = (y * size + x) * 4;

        data[index] = clamp(Math.round(r), 0, 255);
        data[index + 1] = clamp(Math.round(g), 0, 255);
        data[index + 2] = clamp(Math.round(b), 0, 255);
        data[index + 3] = 255;
      }
    }

    textureCtx.putImageData(image, 0, 0);

    state.textureCanvas = textureCanvas;
    state.textureCtx = textureCtx;
    state.textureImage = image;
    state.textureBuilt = true;

    updateReceipt({
      landClarityPass: landPixels > size * size * 0.12,
      landEdgePass: edgePixels > size * 8,
      landDetailPass: detailedPixels > landPixels * 0.18,
      waterContrastPass: true,
      surfaceTextureWidth: size,
      surfaceTextureHeight: size,
      surfaceTextureScale: Number(state.textureScale.toFixed(3)),
      landSourceDetailState: state.landSourceDetailState
    });
  }

  function sampleTexture(u, v) {
    const image = state.textureImage;
    const size = state.textureSize;

    if (!image || !image.data || !size) return [0, 0, 0];

    let x = Math.floor(fract(u) * size);
    let y = Math.floor(clamp(v, 0, 0.999999) * size);

    x = clamp(x, 0, size - 1);
    y = clamp(y, 0, size - 1);

    const index = (y * size + x) * 4;

    return [image.data[index], image.data[index + 1], image.data[index + 2]];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function normalizeVector(v) {
    const length = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / length, v[1] / length, v[2] / length];
  }

  function reflectVector(light, normal) {
    const d = dot(light, normal);

    return normalizeVector([
      2 * d * normal[0] - light[0],
      2 * d * normal[1] - light[1],
      2 * d * normal[2] - light[2]
    ]);
  }

  function readRuntimeState() {
    const runtime = findFirst([
      "HEARTH_RUNTIME",
      "HEARTH.runtime",
      "HEARTH_RUNTIME_STATE",
      "HEARTH.motion",
      "HEARTH.controlsState"
    ]);

    if (!runtime) {
      state.runtimeConsumed = false;
      return null;
    }

    let result = null;

    if (typeof runtime.getState === "function") {
      try {
        result = runtime.getState();
      } catch (_) {
        result = null;
      }
    }

    if (!result && typeof runtime.read === "function") {
      try {
        result = runtime.read();
      } catch (_) {
        result = null;
      }
    }

    if (!result && typeof runtime === "object") result = runtime.state || runtime;

    if (!result || typeof result !== "object") {
      state.runtimeConsumed = false;
      return null;
    }

    const yaw = Number(result.yaw ?? result.rotationY ?? result.longitude ?? result.spin ?? result.x ?? NaN);
    const pitch = Number(result.pitch ?? result.rotationX ?? result.latitude ?? result.tilt ?? result.y ?? NaN);

    if (Number.isFinite(yaw)) state.yaw = yaw;
    if (Number.isFinite(pitch)) state.pitch = clamp(pitch, -1.15, 1.15);

    state.runtimeConsumed = Number.isFinite(yaw) || Number.isFinite(pitch);

    return result;
  }

  function ensureRenderBuffer(width, height) {
    if (!state.renderCanvas) {
      state.renderCanvas = DOC.createElement("canvas");
      state.renderCtx = state.renderCanvas.getContext("2d", {
        alpha: true,
        willReadFrequently: true
      });
    }

    if (state.renderCanvas.width !== width || state.renderCanvas.height !== height) {
      state.renderCanvas.width = width;
      state.renderCanvas.height = height;
      state.renderImage = state.renderCtx.createImageData(width, height);
    }
  }

  function renderPlanet(refined) {
    if (!state.canvas || !state.ctx || !state.textureBuilt) return;

    const ctx = state.ctx;
    const bw = state.backingWidth;
    const bh = state.backingHeight;

    if (!bw || !bh) return;

    const scale = refined ? 1 : 0.68;
    const rw = Math.max(64, Math.round(bw * scale));
    const rh = Math.max(64, Math.round(bh * scale));

    ensureRenderBuffer(rw, rh);

    const image = state.renderImage;
    const data = image.data;

    const cx = rw * 0.5;
    const cy = rh * 0.5;
    const radius = Math.min(rw, rh) * 0.445;
    const invRadius = 1 / radius;

    const yaw = state.yaw;
    const pitch = state.pitch;

    const cyaw = Math.cos(yaw);
    const syaw = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);

    const light = normalizeVector([-0.48, -0.28, 0.83]);
    const atmosphereColor = [104, 176, 220];
    const spaceFade = refined ? 0.88 : 0.84;

    for (let y = 0; y < rh; y += 1) {
      const ny = (y + 0.5 - cy) * invRadius;

      for (let x = 0; x < rw; x += 1) {
        const nx = (x + 0.5 - cx) * invRadius;
        const r2 = nx * nx + ny * ny;
        const index = (y * rw + x) * 4;

        if (r2 > 1.075) {
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
          data[index + 3] = 0;
          continue;
        }

        if (r2 > 1.0) {
          const halo = 1 - smoothstep(1.0, 1.075, r2);

          data[index] = Math.round(atmosphereColor[0] * halo * 0.28);
          data[index + 1] = Math.round(atmosphereColor[1] * halo * 0.35);
          data[index + 2] = Math.round(atmosphereColor[2] * halo * 0.42);
          data[index + 3] = Math.round(120 * halo);
          continue;
        }

        const nz = Math.sqrt(Math.max(0, 1 - r2));

        let vx = nx;
        let vy = -ny;
        let vz = nz;

        const rx = vx * cyaw + vz * syaw;
        const rz = -vx * syaw + vz * cyaw;
        const ry = vy * cp - rz * sp;
        const rz2 = vy * sp + rz * cp;

        const lon = Math.atan2(rx, rz2);
        const lat = Math.asin(clamp(ry, -1, 1));
        const u = lon / (Math.PI * 2) + 0.5;
        const v = 0.5 - lat / Math.PI;

        const color = sampleTexture(u, v);
        const normal = normalizeVector([nx * 0.92, -ny * 0.92, nz]);

        const diffuse = clamp(dot(normal, light) * 0.72 + 0.44, 0.22, 1.12);
        const limb = smoothstep(0.52, 1.0, r2);
        const terminator = smoothstep(-0.28, 0.82, dot(normal, light));
        const shade = mix(0.50, 1.12, terminator) * diffuse;

        const centerAtmosphere = (1 - limb) * 0.018;
        const limbAtmosphere = limb * 0.18;
        const atmosphere = centerAtmosphere + limbAtmosphere;
        const vignette = mix(1.0, spaceFade, limb * 0.72);

        let cr = color[0] * shade * vignette;
        let cg = color[1] * shade * vignette;
        let cb = color[2] * shade * vignette;

        cr = mix(cr, atmosphereColor[0], atmosphere);
        cg = mix(cg, atmosphereColor[1], atmosphere);
        cb = mix(cb, atmosphereColor[2], atmosphere);

        const spec = Math.pow(clamp(dot(reflectVector(light, normal), [0, 0, 1]), 0, 1), 20) * 18;

        cr += spec * 0.35;
        cg += spec * 0.55;
        cb += spec;

        data[index] = clamp(Math.round(cr), 0, 255);
        data[index + 1] = clamp(Math.round(cg), 0, 255);
        data[index + 2] = clamp(Math.round(cb), 0, 255);
        data[index + 3] = 255;
      }
    }

    state.renderCtx.putImageData(image, 0, 0);

    ctx.clearRect(0, 0, bw, bh);
    ctx.save();
    ctx.imageSmoothingEnabled = refined;
    ctx.imageSmoothingQuality = refined ? "high" : "medium";
    ctx.drawImage(state.renderCanvas, 0, 0, rw, rh, 0, 0, bw, bh);
    ctx.restore();

    state.imageRendered = true;
    state.refined = refined;

    updateReceipt({
      imageRendered: true,
      renderDetailState: refined ? "refined" : "motion-cheap",
      settleRefinementRan: state.settleRefinementRan,
      terrainBlurFilterActive: false,
      atmosphereWashReduced: true,
      limbAtmospherePreserved: true,
      motionCheapModeAvailable: true,
      settleRefinementEnabled: true
    });
  }

  function updateRotation(now) {
    const runtimeState = readRuntimeState();

    if (runtimeState && state.runtimeConsumed) return;

    const previous = state.lastFrameTime || now;
    const dt = clamp(now - previous, 0, 48);

    state.lastFrameTime = now;

    if (!state.dragging) {
      state.yaw = normalizeAngle(state.yaw + dt * state.spinVelocity);
    }
  }

  function frame(now) {
    if (state.destroyed) return;

    updateRotation(now);

    const moving = state.dragging || now - state.lastInteractionTime < 180;
    const refined = !moving;
    const minInterval = refined ? 58 : 34;

    if (now - state.lastRenderTime >= minInterval) {
      renderPlanet(refined);
      state.lastRenderTime = now;
    }

    state.animationId = ROOT.requestAnimationFrame(frame);
  }

  function scheduleSettleRefinement() {
    if (state.settleTimer) ROOT.clearTimeout(state.settleTimer);

    state.settleTimer = ROOT.setTimeout(() => {
      state.settleRefinementRan = true;
      renderPlanet(true);
      publishReceipt();
    }, 190);
  }

  function onPointerDown(event) {
    if (!state.canvas) return;

    state.dragging = true;
    state.pointerId = event.pointerId;
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    state.lastInteractionTime = performance.now();

    state.canvas.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event) {
    if (!state.dragging || event.pointerId !== state.pointerId) return;

    const dx = event.clientX - state.lastPointerX;
    const dy = event.clientY - state.lastPointerY;

    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    state.lastInteractionTime = performance.now();

    state.yaw = normalizeAngle(state.yaw + dx * 0.0062);
    state.pitch = clamp(state.pitch + dy * 0.0048, -1.05, 1.05);
  }

  function onPointerUp(event) {
    if (event.pointerId !== state.pointerId) return;

    state.dragging = false;
    state.pointerId = null;
    state.lastInteractionTime = performance.now();

    state.canvas.releasePointerCapture?.(event.pointerId);
    scheduleSettleRefinement();
  }

  function findMount() {
    if (!DOC) return null;

    const candidates = [
      "#hearthCanvasMount",
      "#hearth-canvas-mount",
      "[data-hearth-canvas-mount]",
      "[data-hearth-canvas]",
      ".hearth-canvas-mount",
      ".hearth-planet-mount",
      ".planet-canvas-mount",
      "main"
    ];

    for (const selector of candidates) {
      const node = DOC.querySelector(selector);
      if (node) return node;
    }

    return DOC.body;
  }

  function findOrCreateCanvas(mount) {
    let canvas = null;

    if (mount) {
      canvas = mount.matches?.("canvas")
        ? mount
        : mount.querySelector("canvas[data-hearth-canvas], #hearthCanvas, canvas.hearth-canvas, canvas");
    }

    if (!canvas) {
      canvas = DOC.createElement("canvas");
      canvas.id = "hearthCanvas";
      canvas.className = "hearth-canvas";
      canvas.setAttribute("data-hearth-canvas", "true");
      mount.appendChild(canvas);
    }

    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth high-definition planetary surface inspection canvas");

    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;

    canvas.style.display = canvas.style.display || "block";
    canvas.style.width = canvas.style.width || "100%";
    canvas.style.maxWidth = canvas.style.maxWidth || "min(100%, 720px)";
    canvas.style.aspectRatio = canvas.style.aspectRatio || "1 / 1";
    canvas.style.margin = canvas.style.margin || "0 auto";
    canvas.style.touchAction = "none";

    return canvas;
  }

  function measureCanvas() {
    const mount = state.mount;
    const canvas = state.canvas;

    if (!mount || !canvas) return false;

    const rect = canvas.getBoundingClientRect();
    const mountRect = mount.getBoundingClientRect();

    const fallbackWidth = Math.max(280, Math.min(680, Math.round(mountRect.width || ROOT.innerWidth || 420)));
    const cssWidth = Math.max(220, Math.round(rect.width || fallbackWidth));
    const cssHeight = Math.max(220, Math.round(rect.height || cssWidth));

    const deviceDpr = Number(ROOT.devicePixelRatio || 1);
    const dpr = clamp(deviceDpr, 1, state.dprCap);

    const backingWidth = Math.max(320, Math.round(cssWidth * dpr));
    const backingHeight = Math.max(320, Math.round(cssHeight * dpr));

    const changed =
      backingWidth !== state.backingWidth ||
      backingHeight !== state.backingHeight ||
      cssWidth !== state.cssWidth ||
      cssHeight !== state.cssHeight ||
      dpr !== state.dpr;

    state.cssWidth = cssWidth;
    state.cssHeight = cssHeight;
    state.backingWidth = backingWidth;
    state.backingHeight = backingHeight;
    state.dpr = dpr;

    if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
      canvas.width = backingWidth;
      canvas.height = backingHeight;
    }

    canvas.dataset.hearthCanvasBackingWidth = String(backingWidth);
    canvas.dataset.hearthCanvasBackingHeight = String(backingHeight);
    canvas.dataset.hearthCanvasDpr = String(Number(dpr.toFixed(3)));

    updateReceipt({
      dprApplied: dpr > 1,
      dprValue: Number(dpr.toFixed(3)),
      dprCap: state.dprCap,
      canvasCssWidth: cssWidth,
      canvasCssHeight: cssHeight,
      canvasBackingWidth: backingWidth,
      canvasBackingHeight: backingHeight
    });

    return changed;
  }

  function updateReceipt(extra) {
    const channels = state.channels || findChannels();
    state.channels = channels;

    state.receipt = Object.assign(
      {
        timestamp: new Date().toISOString(),
        canvasContract: CONTRACT,
        canvasReceipt: RECEIPT,
        previousCanvasContract: PREVIOUS_CONTRACT,
        family: FAMILY,
        hexAuthorityLoaded: Boolean(channels.hex),
        landChannelLoaded: Boolean(channels.land),
        waterChannelLoaded: Boolean(channels.water),
        airChannelLoaded: Boolean(channels.air),
        planetaryBoundarySource: channels.hex ? "hex-four-pair-body-handshake" : "canvas-body-carrier",
        atmosphereDefinesBoundary: false,
        imageRendered: state.imageRendered,
        visualPassClaimed: false,

        dprApplied: state.dpr > 1,
        dprValue: Number(state.dpr.toFixed(3)),
        dprCap: state.dprCap,
        canvasCssWidth: state.cssWidth,
        canvasCssHeight: state.cssHeight,
        canvasBackingWidth: state.backingWidth,
        canvasBackingHeight: state.backingHeight,
        surfaceTextureWidth: state.textureSize,
        surfaceTextureHeight: state.textureSize,
        surfaceTextureScale: Number(state.textureScale.toFixed(3)),
        landClarityPass: state.textureBuilt,
        landEdgePass: state.textureBuilt,
        landDetailPass: state.textureBuilt,
        waterContrastPass: state.textureBuilt,
        atmosphereWashReduced: true,
        limbAtmospherePreserved: true,
        motionCheapModeAvailable: true,
        settleRefinementEnabled: true,
        settleRefinementRan: state.settleRefinementRan,
        terrainBlurFilterActive: false,
        landSourceDetailState: state.landSourceDetailState,
        renderDetailState: state.refined ? "refined" : "motion-cheap"
      },
      extra || {}
    );

    publishReceipt();
  }

  function receiptExport() {
    const receipt = state.receipt || {};

    return [
      "HEARTH_4K_LAND_CLARITY_CANVAS_REFINEMENT_RECEIPT_EXPORT",
      "",
      `timestamp=${receipt.timestamp || new Date().toISOString()}`,
      `canvasContract=${CONTRACT}`,
      `canvasReceipt=${RECEIPT}`,
      `previousCanvasContract=${PREVIOUS_CONTRACT}`,
      `family=${FAMILY}`,
      `hexAuthorityLoaded=${Boolean(receipt.hexAuthorityLoaded)}`,
      `landChannelLoaded=${Boolean(receipt.landChannelLoaded)}`,
      `waterChannelLoaded=${Boolean(receipt.waterChannelLoaded)}`,
      `airChannelLoaded=${Boolean(receipt.airChannelLoaded)}`,
      `planetaryBoundarySource=${receipt.planetaryBoundarySource || "canvas-body-carrier"}`,
      "atmosphereDefinesBoundary=false",
      `imageRendered=${Boolean(receipt.imageRendered)}`,
      "visualPassClaimed=false",
      "",
      "CLARITY_DATASET",
      JSON.stringify(receipt, null, 2)
    ].join("\n");
  }

  function publishReceipt() {
    if (!state.receipt) return;

    ROOT.HEARTH_CANVAS_RECEIPT = state.receipt;
    ROOT.HEARTH_4K_LAND_CLARITY_CANVAS_RECEIPT = state.receipt;
    ROOT.HEARTH_HEX_BODY_BOUNDARY_CANVAS_RECEIPT_EXPORT = receiptExport();
    ROOT.HEARTH_4K_LAND_CLARITY_CANVAS_RECEIPT_EXPORT = receiptExport();

    HEARTH.canvasReceipt = state.receipt;
    HEARTH.canvasReceiptExport = ROOT.HEARTH_4K_LAND_CLARITY_CANVAS_RECEIPT_EXPORT;

    if (state.canvas) {
      state.canvas.dataset.hearthCanvasContract = CONTRACT;
      state.canvas.dataset.hearthCanvasReceipt = RECEIPT;
      state.canvas.dataset.hearthCanvasTexture = "true";
      state.canvas.dataset.hearthVisualPassClaimed = "false";
    }

    if (state.mount && state.mount.dataset) {
      state.mount.dataset.hearthCanvasContract = CONTRACT;
      state.mount.dataset.hearthCanvasReceipt = RECEIPT;
      state.mount.dataset.hearthVisualPassClaimed = "false";
    }

    const receiptNodes = DOC
      ? DOC.querySelectorAll("[data-hearth-canvas-receipt], #hearthCanvasReceipt, #hearthReceipt, .hearth-canvas-receipt")
      : [];

    receiptNodes.forEach((node) => {
      if (!node || node.dataset?.hearthReceiptRemoved === "true") return;
      node.textContent = ROOT.HEARTH_4K_LAND_CLARITY_CANVAS_RECEIPT_EXPORT;
    });
  }

  function installEvents() {
    const canvas = state.canvas;
    if (!canvas) return;

    canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerup", onPointerUp, { passive: true });
    canvas.addEventListener("pointercancel", onPointerUp, { passive: true });

    ROOT.addEventListener("resize", handleResize, { passive: true });

    if (ROOT.ResizeObserver) {
      state.resizeObserver = new ROOT.ResizeObserver(handleResize);
      state.resizeObserver.observe(canvas);
      if (state.mount && state.mount !== canvas) state.resizeObserver.observe(state.mount);
    }
  }

  function removeEvents() {
    const canvas = state.canvas;

    if (canvas) {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    }

    ROOT.removeEventListener("resize", handleResize);

    if (state.resizeObserver) {
      state.resizeObserver.disconnect();
      state.resizeObserver = null;
    }
  }

  function handleResize() {
    if (!state.booted || state.destroyed) return;

    const changed = measureCanvas();

    if (changed) {
      state.settleRefinementRan = false;
      buildSurfaceTexture();
      renderPlanet(true);
    }
  }

  function boot(providedMount) {
    if (!DOC) return api;
    if (state.booted) return api;

    state.mount = providedMount || findMount();
    state.canvas = findOrCreateCanvas(state.mount);
    state.ctx = state.canvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });
    state.channels = findChannels();

    measureCanvas();
    buildSurfaceTexture();
    installEvents();
    renderPlanet(true);
    scheduleSettleRefinement();

    state.booted = true;

    HEARTH.canvas = api;
    ROOT.HEARTH_CANVAS = api;
    ROOT.HEARTH_CANVAS_API = api;

    state.animationId = ROOT.requestAnimationFrame(frame);

    publishReceipt();

    return api;
  }

  function destroy() {
    state.destroyed = true;

    removeEvents();

    if (state.animationId) ROOT.cancelAnimationFrame(state.animationId);
    if (state.settleTimer) ROOT.clearTimeout(state.settleTimer);

    state.animationId = 0;
    state.settleTimer = 0;

    return api;
  }

  function refresh() {
    if (!state.booted) return boot();

    state.channels = findChannels();

    measureCanvas();
    buildSurfaceTexture();
    renderPlanet(true);
    publishReceipt();

    return api;
  }

  function getReceipt() {
    updateReceipt();
    return state.receipt;
  }

  function exportReceipt() {
    updateReceipt();
    return receiptExport();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    family: FAMILY,
    previousCanvasContract: PREVIOUS_CONTRACT,
    boot,
    refresh,
    destroy,
    render: () => renderPlanet(true),
    getReceipt,
    exportReceipt,
    get canvas() {
      return state.canvas;
    },
    get state() {
      return {
        booted: state.booted,
        cssWidth: state.cssWidth,
        cssHeight: state.cssHeight,
        backingWidth: state.backingWidth,
        backingHeight: state.backingHeight,
        dpr: state.dpr,
        textureSize: state.textureSize,
        imageRendered: state.imageRendered,
        visualPassClaimed: false,
        landSourceDetailState: state.landSourceDetailState,
        renderDetailState: state.refined ? "refined" : "motion-cheap"
      };
    }
  };

  HEARTH.canvas = api;
  ROOT.HEARTH_CANVAS = api;
  ROOT.HEARTH_CANVAS_API = api;

  if (DOC) {
    if (DOC.readyState === "loading") {
      DOC.addEventListener("DOMContentLoaded", () => boot(), { once: true });
    } else {
      boot();
    }
  }
})();
