// /assets/hearth/hearth.hex.surface.js
// HEARTH_G3_HEX_SURFACE_GLOBAL_API_REPAIR_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Repair missing HEARTH_HEX_SURFACE global API.
// - Preserve HEARTH_G3_HIGH_DENSITY_HEX_SURFACE_BASELINE_v1.
// - Provide drawHearthHexSurfaceFrame() and getHearthHexSurfaceStatus().
// - Use high-density overlapping hex surface rendering.
// - Use raw vector sampling for visual continuity.
// - Use hex center only for influence, edge pressure, micro-seed, and surface grain.
// - Do not own terrain truth.
// - Do not create GraphicBox.
// - Do not use generated images.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_HEX_SURFACE_GLOBAL_API_REPAIR_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const BASELINE = "HEARTH_G3_HIGH_DENSITY_HEX_SURFACE_BASELINE_v1";
  const VERSION = "2026-05-09.hearth-g3-hex-surface-global-api-repair";
  const RECEIPT = "HEARTH_G3_HEX_SURFACE_GLOBAL_API_REPAIR_RECEIPT";

  const TAU = Math.PI * 2;

  const DEFAULTS = Object.freeze({
    radiusRatio: 0.456,
    hexDensity: 220,
    minHexRadius: 0.92,
    maxHexRadius: 3.3,
    edgeDarkening: 0.032,
    seamSoftening: 0.035,
    microTerrainStrength: 0.34,
    mountainStrength: 0.46,
    cliffStrength: 0.46,
    valleyStrength: 0.38,
    beachStrength: 0.4,
    islandStrength: 0.4,
    atmosphereStrength: 0.96,
    axialTilt: -0.22,
    lightX: -0.48,
    lightY: 0.28,
    lightZ: 0.84
  });

  const STATUS = {
    ok: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    familyContract: FAMILY_CONTRACT,
    baseline: BASELINE,
    version: VERSION,
    role: "hearth-high-density-hex-surface-global-api",
    globalApi: "HEARTH_HEX_SURFACE",
    drawFunction: "drawHearthHexSurfaceFrame",
    statusFunction: "getHearthHexSurfaceStatus",
    highDensityHexSurface: true,
    overlappingHexFootprints: true,
    rawVectorVisualSampling: true,
    hexCenterVisualOverride: false,
    terrainAuthority: false,
    childEngineAuthority: false,
    canvasAuthority: false,
    runtimeAuthority: false,
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false,
    lastFrameReceipt: null,
    lastError: ""
  };

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function hash2(x, y, seed) {
    return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
  }

  function valueNoise(x, y, seed) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = fract(x);
    const fy = fract(y);

    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return mix(mix(a, b, ux), mix(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves) {
    let total = 0;
    let amplitude = 0.52;
    let frequency = 1;
    let normalizer = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x * frequency, y * frequency, seed + i * 29.37) * amplitude;
      normalizer += amplitude;
      amplitude *= 0.5;
      frequency *= 2.04;
    }

    return total / Math.max(0.000001, normalizer);
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp01((value - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function norm3(v) {
    const m = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / m, v[1] / m, v[2] / m];
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

  function cubeRound(q, r) {
    const s = -q - r;

    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);

    const qDiff = Math.abs(rq - q);
    const rDiff = Math.abs(rr - r);
    const sDiff = Math.abs(rs - s);

    if (qDiff > rDiff && qDiff > sDiff) {
      rq = -rr - rs;
    } else if (rDiff > sDiff) {
      rr = -rq - rs;
    }

    return { q: rq, r: rr };
  }

  function nearestHexCenter(xPx, yPx, hexRadius) {
    const q = ((Math.sqrt(3) / 3) * xPx - (1 / 3) * yPx) / hexRadius;
    const r = ((2 / 3) * yPx) / hexRadius;
    const rounded = cubeRound(q, r);

    return {
      x: hexRadius * Math.sqrt(3) * (rounded.q + rounded.r / 2),
      y: hexRadius * 1.5 * rounded.r,
      q: rounded.q,
      r: rounded.r
    };
  }

  function hexDistance(localX, localY, hexRadius) {
    const q = ((Math.sqrt(3) / 3) * localX - (1 / 3) * localY) / hexRadius;
    const r = ((2 / 3) * localY) / hexRadius;
    const s = -q - r;

    return Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
  }

  function normalizeOptions(options = {}) {
    return Object.freeze({
      radiusRatio: clamp(options.radiusRatio ?? DEFAULTS.radiusRatio, 0.34, 0.49),
      hexDensity: clamp(options.hexDensity ?? DEFAULTS.hexDensity, 150, 520),
      minHexRadius: clamp(options.minHexRadius ?? DEFAULTS.minHexRadius, 0.55, 3),
      maxHexRadius: clamp(options.maxHexRadius ?? DEFAULTS.maxHexRadius, 1.4, 6),
      edgeDarkening: clamp(options.edgeDarkening ?? DEFAULTS.edgeDarkening, 0, 0.18),
      seamSoftening: clamp(options.seamSoftening ?? DEFAULTS.seamSoftening, 0, 0.18),
      microTerrainStrength: clamp(options.microTerrainStrength ?? DEFAULTS.microTerrainStrength, 0, 0.82),
      mountainStrength: clamp(options.mountainStrength ?? DEFAULTS.mountainStrength, 0, 1),
      cliffStrength: clamp(options.cliffStrength ?? DEFAULTS.cliffStrength, 0, 1),
      valleyStrength: clamp(options.valleyStrength ?? DEFAULTS.valleyStrength, 0, 1),
      beachStrength: clamp(options.beachStrength ?? DEFAULTS.beachStrength, 0, 1),
      islandStrength: clamp(options.islandStrength ?? DEFAULTS.islandStrength, 0, 1),
      atmosphereStrength: clamp(options.atmosphereStrength ?? DEFAULTS.atmosphereStrength, 0, 1.4),
      axialTilt: Number.isFinite(Number(options.axialTilt)) ? Number(options.axialTilt) : DEFAULTS.axialTilt,
      lightX: Number(options.lightX) || DEFAULTS.lightX,
      lightY: Number(options.lightY) || DEFAULTS.lightY,
      lightZ: Number(options.lightZ) || DEFAULTS.lightZ
    });
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

  function mixColor(base, overlay, amount) {
    const t = clamp01(amount);

    return [
      clamp(Math.round(mix(base[0], overlay[0], t)), 0, 255),
      clamp(Math.round(mix(base[1], overlay[1], t)), 0, 255),
      clamp(Math.round(mix(base[2], overlay[2], t)), 0, 255),
      base[3] === undefined ? 255 : base[3]
    ];
  }

  function multiplyColor(color, amount) {
    return [
      clamp(Math.round(color[0] * amount), 0, 255),
      clamp(Math.round(color[1] * amount), 0, 255),
      clamp(Math.round(color[2] * amount), 0, 255),
      color[3] === undefined ? 255 : color[3]
    ];
  }

  function callSampleVector(globalName, vec) {
    const mod = window[globalName];

    if (!mod || typeof mod.sampleVector !== "function") {
      return null;
    }

    try {
      const sample = mod.sampleVector(vec);
      return sample && typeof sample === "object" ? sample : null;
    } catch (error) {
      document.documentElement.dataset[`hearthHexSurface${globalName}Error`] =
        error && error.message ? error.message : String(error);
      return null;
    }
  }

  function fallbackTerrain(vec) {
    return {
      land: false,
      water: true,
      ocean: true,
      shelf: 0,
      coast: 0,
      waterDepth: clamp01(0.55 + vec[2] * 0.22),
      color: [8, 70, 132, 255],
      fallback: true
    };
  }

  function sampleHearth(vec) {
    const terrain = callSampleVector("HEARTH_TERRAIN", vec) || fallbackTerrain(vec);

    return {
      terrain,
      hex: callSampleVector("HEARTH_HEX", vec),
      hydration: callSampleVector("HEARTH_HYDRATION", vec),
      mountains: callSampleVector("HEARTH_MOUNTAINS", vec),
      cliffs: callSampleVector("HEARTH_CLIFFS", vec),
      valleys: callSampleVector("HEARTH_VALLEYS", vec),
      beaches: callSampleVector("HEARTH_BEACHES", vec),
      islands: callSampleVector("HEARTH_ISLANDS", vec)
    };
  }

  function readAny(sample, keys, fallback = 0) {
    if (!sample || typeof sample !== "object") return fallback;

    for (const key of keys) {
      if (sample[key] !== undefined && Number.isFinite(Number(sample[key]))) {
        return Number(sample[key]);
      }
    }

    return fallback;
  }

  function readBool(sample, keys) {
    if (!sample || typeof sample !== "object") return false;

    return keys.some((key) => Boolean(sample[key]));
  }

  function isLandLike(terrain) {
    return readBool(terrain, [
      "land",
      "visibleLand",
      "solidSurfaceLand",
      "topologyLand",
      "exposedTerrainLand"
    ]);
  }

  function isWaterLike(terrain) {
    return readBool(terrain, [
      "water",
      "liquidWater",
      "ocean"
    ]);
  }

  function isActive(sample) {
    return Boolean(sample && typeof sample === "object" && sample.active);
  }

  function baseWaterColor(terrain) {
    const depth = clamp01(readAny(terrain, ["waterDepth", "depth", "oceanDepth"], 0.66));
    const shelf = clamp01(readAny(terrain, ["shelf", "shelfIndex", "shelfGradientIndex"], 0));
    const coast = clamp01(readAny(terrain, ["coast", "coastlineIndex", "coastalFeather"], 0));
    const turquoise = clamp01(readAny(terrain, ["turquoiseIndex", "turquoise"], 0));

    let color = rgba(terrain && terrain.color, [8, 70, 132, 255]);

    color = mixColor(color, [4, 34, 86, 255], depth * 0.54);
    color = mixColor(color, [34, 170, 184, 255], Math.max(shelf, turquoise) * 0.62);
    color = mixColor(color, [68, 206, 205, 255], coast * 0.28);

    return color;
  }

  function baseLandColor(terrain) {
    const hill = clamp01(readAny(terrain, ["hillStrength", "hill", "hillIndex"], 0));
    const mountain = clamp01(readAny(terrain, ["mountainStrength", "mountainIndex"], 0));
    const cliff = clamp01(readAny(terrain, ["cliffStrength", "cliffIndex"], 0));
    const valley = clamp01(readAny(terrain, ["valleyStrength", "valleyIndex"], 0));
    const rock = clamp01(readAny(terrain, ["rockExposure", "rockIndex", "rigidLandscapeStrength"], 0));

    let color = rgba(terrain && terrain.color, [138, 124, 82, 255]);

    color = mixColor(color, [118, 124, 76, 255], hill * 0.18);
    color = mixColor(color, [216, 206, 170, 255], mountain * 0.18);
    color = mixColor(color, [52, 54, 52, 255], cliff * 0.28);
    color = mixColor(color, [70, 104, 72, 255], valley * 0.22);
    color = mixColor(color, [68, 68, 64, 255], rock * 0.26);

    return color;
  }

  function baseIslandColor(island) {
    const hill = clamp01(readAny(island, ["hillStrength", "hill", "hillIndex"], 0));
    const mountain = clamp01(readAny(island, ["mountainStrength", "mountainIndex"], 0));
    const cliff = clamp01(readAny(island, ["cliffStrength", "cliffIndex"], 0));
    const valley = clamp01(readAny(island, ["valleyStrength", "valleyIndex"], 0));

    let color = rgba(island && island.color, [152, 132, 84, 255]);

    color = mixColor(color, [146, 136, 86, 255], hill * 0.16);
    color = mixColor(color, [222, 214, 182, 255], mountain * 0.16);
    color = mixColor(color, [58, 60, 56, 255], cliff * 0.25);
    color = mixColor(color, [80, 110, 76, 255], valley * 0.18);

    return color;
  }

  function composeColor(samples, geometryIndex, geometry, config, lightValue) {
    const terrain = samples.terrain || {};
    const island = samples.islands && isActive(samples.islands) && readBool(samples.islands, ["land", "visibleLand"])
      ? samples.islands
      : null;

    const mountain = isActive(samples.mountains) ? samples.mountains : null;
    const cliff = isActive(samples.cliffs) ? samples.cliffs : null;
    const valley = isActive(samples.valleys) ? samples.valleys : null;
    const beach = isActive(samples.beaches) ? samples.beaches : null;

    const land = island || isLandLike(terrain);
    const water = !land || isWaterLike(terrain);

    let surfaceClass = "water";
    let color;

    if (island) {
      surfaceClass = "island";
      color = baseIslandColor(island);
    } else if (land) {
      surfaceClass = "land";
      color = baseLandColor(terrain);
    } else {
      surfaceClass = "water";
      color = baseWaterColor(terrain);
    }

    if (surfaceClass !== "water" && mountain) {
      const peak = clamp01(readAny(mountain, ["peakStrength", "mountainStrength", "summitPressure"], 0));
      const summit = clamp01(readAny(mountain, ["summitPressure", "summitStrength"], 0));
      color = mixColor(color, rgba(mountain.mountainColorBias, [226, 216, 184, 255]), peak * 0.2 * config.mountainStrength);
      color = mixColor(color, [236, 228, 200, 255], summit * 0.14 * config.mountainStrength);
    }

    if (surfaceClass !== "water" && cliff) {
      const face = clamp01(readAny(cliff, ["cliffFaceStrength", "cliffStrength", "cliffIndex"], 0));
      const shadow = clamp01(readAny(cliff, ["cliffShadow", "shadow"], 0));
      color = mixColor(color, rgba(cliff.cliffColorBias, [48, 50, 48, 255]), face * 0.3 * config.cliffStrength);
      color = multiplyColor(color, 1 - shadow * 0.38 * config.cliffStrength);
    }

    if (surfaceClass !== "water" && valley) {
      const depth = clamp01(readAny(valley, ["valleyDepth", "valleyStrength", "valleyIndex"], 0));
      const shadow = clamp01(readAny(valley, ["valleyShadow", "shadow"], 0));
      color = mixColor(color, rgba(valley.valleyColorBias, [74, 104, 74, 255]), depth * 0.24 * config.valleyStrength);
      color = multiplyColor(color, 1 - shadow * 0.24 * config.valleyStrength);
    }

    if (beach) {
      const sand = clamp01(readAny(beach, ["sandStrength", "beachStrength", "coastalSand"], 0.5));
      color = mixColor(color, rgba(beach.beachColorBias, [210, 174, 112, 255]), sand * 0.34 * config.beachStrength);
    }

    const seed = geometry.microSeeds[geometryIndex];
    const hexEdge = geometry.edgeFactors[geometryIndex];
    const overlap = geometry.overlapFactors[geometryIndex];
    const zDepth = geometry.sphericalDepths[geometryIndex];
    const hx = geometry.hexQ[geometryIndex];
    const hr = geometry.hexR[geometryIndex];

    const rawX = geometry.rawX[geometryIndex];
    const rawY = geometry.rawY[geometryIndex];

    const fineNoise = fbm(
      hx * 0.17 + seed * 2.0 + rawX * 4.3,
      hr * 0.17 - seed * 3.0 + rawY * 3.1,
      1711,
      3
    );

    const broadNoise = fbm(
      rawX * 5.1 + seed * 1.7,
      rawY * 4.4 - seed * 1.1,
      2719,
      3
    );

    const micro = (fineNoise - 0.5) * config.microTerrainStrength;
    const broad = (broadNoise - 0.5) * config.microTerrainStrength * 0.72;

    if (surfaceClass !== "water") {
      color = mixColor(color, [232, 224, 190, 255], Math.max(0, micro + broad) * 0.1);
      color = mixColor(color, [48, 54, 50, 255], Math.max(0, -(micro + broad)) * 0.12);
    } else {
      color = mixColor(color, [62, 206, 210, 255], Math.max(0, micro) * 0.035);
      color = mixColor(color, [4, 28, 78, 255], Math.max(0, -micro) * 0.045);
    }

    const seam = clamp(
      1 - hexEdge * config.edgeDarkening + overlap * config.seamSoftening,
      0.82,
      1.09
    );

    const sphericalShade = clamp(0.60 + zDepth * 0.48, 0.50, 1.08);
    const lightShade = clamp(0.72 + lightValue * 0.38, 0.62, 1.12);
    const microShade = clamp(0.965 + (micro + broad) * 0.11, 0.9, 1.12);

    return multiplyColor(color, seam * sphericalShade * lightShade * microShade * 0.98);
  }

  function buildHexGeometry(size, options = {}) {
    const config = normalizeOptions(options);
    const radius = size * config.radiusRatio;
    const cx = size / 2;
    const cy = size / 2;

    const hexRadius = clamp(
      size / config.hexDensity,
      config.minHexRadius,
      config.maxHexRadius
    );

    let count = 0;

    for (let py = 0; py < size; py += 1) {
      const y = (py + 0.5 - cy) / radius;

      for (let px = 0; px < size; px += 1) {
        const x = (px + 0.5 - cx) / radius;

        if (x * x + y * y <= 1) {
          count += 1;
        }
      }
    }

    const indices = new Uint32Array(count);
    const sphereX = new Float32Array(count);
    const sphereY = new Float32Array(count);
    const sphereZ = new Float32Array(count);
    const rawX = new Float32Array(count);
    const rawY = new Float32Array(count);
    const edgeFactors = new Float32Array(count);
    const overlapFactors = new Float32Array(count);
    const microSeeds = new Float32Array(count);
    const sphericalDepths = new Float32Array(count);
    const hexQ = new Int32Array(count);
    const hexR = new Int32Array(count);

    let i = 0;

    for (let py = 0; py < size; py += 1) {
      const yRaw = py + 0.5 - cy;
      const y = yRaw / radius;

      for (let px = 0; px < size; px += 1) {
        const xRaw = px + 0.5 - cx;
        const x = xRaw / radius;
        const r2 = x * x + y * y;

        if (r2 > 1) continue;

        const z = Math.sqrt(Math.max(0, 1 - r2));
        const center = nearestHexCenter(xRaw, yRaw, hexRadius);
        const localX = xRaw - center.x;
        const localY = yRaw - center.y;
        const hd = hexDistance(localX, localY, hexRadius);

        indices[i] = (py * size + px) * 4;
        sphereX[i] = x;
        sphereY[i] = -y;
        sphereZ[i] = z;
        rawX[i] = x;
        rawY[i] = y;
        edgeFactors[i] = smoothstep(0.76, 1.05, hd);
        overlapFactors[i] = 1 - smoothstep(0.82, 1.24, hd);
        microSeeds[i] = hash2(center.q, center.r, 2027);
        sphericalDepths[i] = z;
        hexQ[i] = center.q;
        hexR[i] = center.r;

        i += 1;
      }
    }

    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      baseline: BASELINE,
      model: "hearth-high-density-overlapping-hex-surface-global-api",
      size,
      radius,
      hexRadius,
      count,
      indices,
      sphereX,
      sphereY,
      sphereZ,
      rawX,
      rawY,
      edgeFactors,
      overlapFactors,
      microSeeds,
      sphericalDepths,
      hexQ,
      hexR,
      rawVectorVisualSampling: true,
      hexCenterVisualOverride: false,
      generatedImage: false,
      graphicBox: false
    });
  }

  function drawAtmosphere(ctx, size, options = {}) {
    const config = normalizeOptions(options);
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * config.radiusRatio;
    const strength = config.atmosphereStrength;

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.clip();

    const highlight = ctx.createRadialGradient(
      cx - radius * 0.34,
      cy - radius * 0.36,
      radius * 0.02,
      cx,
      cy,
      radius * 1.16
    );

    highlight.addColorStop(0, `rgba(255,255,255,${0.12 * strength})`);
    highlight.addColorStop(0.32, `rgba(255,255,255,${0.035 * strength})`);
    highlight.addColorStop(0.74, "rgba(0,0,0,0.10)");
    highlight.addColorStop(1, "rgba(0,0,0,0.48)");

    ctx.fillStyle = highlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const edge = ctx.createRadialGradient(cx, cy, radius * 0.66, cx, cy, radius);
    edge.addColorStop(0, "rgba(0,0,0,0)");
    edge.addColorStop(0.78, `rgba(8,23,44,${0.16 * strength})`);
    edge.addColorStop(1, `rgba(4,10,20,${0.62 * strength})`);

    ctx.fillStyle = edge;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, TAU);
    ctx.strokeStyle = `rgba(190,226,255,${0.28 * strength})`;
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(2, size * 0.011), 0, TAU);
    ctx.strokeStyle = `rgba(108,185,232,${0.11 * strength})`;
    ctx.lineWidth = Math.max(1, size * 0.006);
    ctx.stroke();

    ctx.restore();
  }

  function publishFrameStatus(state, frameReceipt) {
    STATUS.lastFrameReceipt = frameReceipt;
    STATUS.lastError = "";

    if (state && state.canvas) {
      state.canvas.dataset.hearthHexSurface = RECEIPT;
      state.canvas.dataset.hearthHexSurfaceContract = CONTRACT;
      state.canvas.dataset.hearthHexSurfaceFamilyContract = FAMILY_CONTRACT;
      state.canvas.dataset.hearthHexSurfaceBaseline = BASELINE;
      state.canvas.dataset.hearthHexSurfaceVersion = VERSION;
      state.canvas.dataset.hearthHexSurfaceModel = "hearth-high-density-overlapping-hex-surface-global-api";
      state.canvas.dataset.hearthHexSurfaceGlobalApi = "true";
      state.canvas.dataset.hearthHexSurfaceHighDensity = "true";
      state.canvas.dataset.hearthHexSurfaceRawVectorVisualSampling = "true";
      state.canvas.dataset.hearthHexSurfaceHexCenterVisualOverride = "false";
      state.canvas.dataset.hearthHexSurfaceGeneratedImage = "false";
      state.canvas.dataset.hearthHexSurfaceGraphicBox = "false";

      if (frameReceipt) {
        state.canvas.dataset.hearthHexSurfaceFrameReceipt = frameReceipt.receipt;
        state.canvas.dataset.hearthHexSamples = String(frameReceipt.samples || 0);
        state.canvas.dataset.hearthLandPixels = String(frameReceipt.landPixels || 0);
        state.canvas.dataset.hearthWaterPixels = String(frameReceipt.waterPixels || 0);
        state.canvas.dataset.hearthIslandPixels = String(frameReceipt.islandPixels || 0);
        state.canvas.dataset.hearthBeachPixels = String(frameReceipt.beachPixels || 0);
        state.canvas.dataset.hearthMountainPixels = String(frameReceipt.mountainPixels || 0);
        state.canvas.dataset.hearthCliffPixels = String(frameReceipt.cliffPixels || 0);
        state.canvas.dataset.hearthValleyPixels = String(frameReceipt.valleyPixels || 0);
      }
    }

    document.documentElement.dataset.hearthHexSurfaceReady = "true";
    document.documentElement.dataset.hearthHexSurfaceLoaded = "true";
    document.documentElement.dataset.hearthHexSurfaceReceipt = RECEIPT;
    document.documentElement.dataset.hearthHexSurfaceContract = CONTRACT;
    document.documentElement.dataset.hearthHexSurfaceBaseline = BASELINE;
    document.documentElement.dataset.hearthHexSurfaceGeneratedImage = "false";
    document.documentElement.dataset.hearthHexSurfaceGraphicBox = "false";

    return STATUS;
  }

  function drawHearthHexSurfaceFrame(state, options = {}) {
    if (!state || !state.canvas || !state.ctx) {
      throw new Error("HEARTH_HEX_SURFACE_MISSING_STATE");
    }

    const size = Number(state.canvas.width) || 0;

    if (!size) {
      throw new Error("HEARTH_HEX_SURFACE_MISSING_CANVAS_SIZE");
    }

    const config = normalizeOptions(options);
    const phase = Number(state.phase) || 0;
    const light = norm3([config.lightX, config.lightY, config.lightZ]);

    if (
      !state.hearthHexGeometry ||
      state.hearthHexGeometry.size !== size ||
      state.hearthHexGeometry.receipt !== RECEIPT ||
      state.hearthHexGeometry.hexRadius !== clamp(size / config.hexDensity, config.minHexRadius, config.maxHexRadius)
    ) {
      state.hearthHexGeometry = buildHexGeometry(size, config);
    }

    const geometry = state.hearthHexGeometry;
    const output = state.ctx.createImageData(size, size);
    const data = output.data;

    let landPixels = 0;
    let waterPixels = 0;
    let islandPixels = 0;
    let beachPixels = 0;
    let mountainPixels = 0;
    let cliffPixels = 0;
    let valleyPixels = 0;
    let fallbackTerrainPixels = 0;

    for (let i = 0; i < geometry.count; i += 1) {
      const out = geometry.indices[i];

      let vec = [geometry.sphereX[i], geometry.sphereY[i], geometry.sphereZ[i]];
      vec = rotateX(vec, config.axialTilt);
      vec = rotateY(vec, phase);

      const rawNormal = norm3([geometry.sphereX[i], geometry.sphereY[i], geometry.sphereZ[i]]);
      const lightValue = clamp01(
        rawNormal[0] * light[0] +
        rawNormal[1] * light[1] +
        rawNormal[2] * light[2]
      );

      const samples = sampleHearth(vec);
      const color = composeColor(samples, i, geometry, config, lightValue);

      const terrain = samples.terrain || {};
      const island = samples.islands || {};
      const mountains = samples.mountains || {};
      const cliffs = samples.cliffs || {};
      const valleys = samples.valleys || {};
      const beaches = samples.beaches || {};

      if (terrain.fallback) fallbackTerrainPixels += 1;

      if (isActive(island) && readBool(island, ["land", "visibleLand"])) {
        islandPixels += 1;
      } else if (isLandLike(terrain)) {
        landPixels += 1;
      } else {
        waterPixels += 1;
      }

      if (isActive(beaches)) beachPixels += 1;
      if (isActive(mountains)) mountainPixels += 1;
      if (isActive(cliffs)) cliffPixels += 1;
      if (isActive(valleys)) valleyPixels += 1;

      data[out] = color[0];
      data[out + 1] = color[1];
      data[out + 2] = color[2];
      data[out + 3] = color[3];
    }

    state.ctx.putImageData(output, 0, 0);
    drawAtmosphere(state.ctx, size, config);

    const frameReceipt = Object.freeze({
      ok: true,
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      baseline: BASELINE,
      version: VERSION,
      model: "hearth-high-density-overlapping-hex-surface-global-api",
      size,
      samples: geometry.count,
      hexRadius: geometry.hexRadius,
      landPixels,
      waterPixels,
      islandPixels,
      beachPixels,
      mountainPixels,
      cliffPixels,
      valleyPixels,
      fallbackTerrainPixels,
      rawVectorVisualSampling: true,
      highDensityHexSurface: true,
      overlappingHexFootprints: true,
      hexCenterVisualOverride: false,
      terrainAuthority: false,
      childEngineAuthority: false,
      canvasAuthority: false,
      runtimeAuthority: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });

    publishFrameStatus(state, frameReceipt);

    return frameReceipt;
  }

  function getHearthHexSurfaceStatus(state = null) {
    return Object.freeze({
      ok: true,
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      baseline: BASELINE,
      version: VERSION,
      role: "hearth-high-density-hex-surface-global-api",
      globalApi: "HEARTH_HEX_SURFACE",
      apiReady: true,
      drawHearthHexSurfaceFrame: true,
      getHearthHexSurfaceStatus: true,
      geometryLoaded: Boolean(state && state.hearthHexGeometry),
      hexRadius: state && state.hearthHexGeometry ? state.hearthHexGeometry.hexRadius : null,
      hexSamples: state && state.hearthHexGeometry ? state.hearthHexGeometry.count : null,
      highDensityHexSurface: true,
      overlappingHexFootprints: true,
      rawVectorVisualSampling: true,
      hexCenterVisualOverride: false,
      terrainReady: Boolean(window.HEARTH_TERRAIN),
      hexReady: Boolean(window.HEARTH_HEX),
      hydrationReady: Boolean(window.HEARTH_HYDRATION),
      mountainsReady: Boolean(window.HEARTH_MOUNTAINS),
      cliffsReady: Boolean(window.HEARTH_CLIFFS),
      valleysReady: Boolean(window.HEARTH_VALLEYS),
      beachesReady: Boolean(window.HEARTH_BEACHES),
      islandsReady: Boolean(window.HEARTH_ISLANDS),
      terrainAuthority: false,
      childEngineAuthority: false,
      canvasAuthority: false,
      runtimeAuthority: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      lastFrameReceipt: STATUS.lastFrameReceipt,
      lastError: STATUS.lastError || ""
    });
  }

  function dispose() {
    if (window.HEARTH_HEX_SURFACE && window.HEARTH_HEX_SURFACE.contract === CONTRACT) {
      try {
        delete window.HEARTH_HEX_SURFACE;
      } catch (_) {
        window.HEARTH_HEX_SURFACE = null;
      }
    }

    if (window.HEARTH_HEX_SURFACE_STATUS && window.HEARTH_HEX_SURFACE_STATUS.contract === CONTRACT) {
      try {
        delete window.HEARTH_HEX_SURFACE_STATUS;
      } catch (_) {
        window.HEARTH_HEX_SURFACE_STATUS = null;
      }
    }

    document.documentElement.dataset.hearthHexSurfaceDisposed = "true";
  }

  const api = Object.freeze({
    receipt: RECEIPT,
    contract: CONTRACT,
    familyContract: FAMILY_CONTRACT,
    baseline: BASELINE,
    version: VERSION,
    drawHearthHexSurfaceFrame,
    drawFrame: drawHearthHexSurfaceFrame,
    getHearthHexSurfaceStatus,
    buildHexGeometry
  });

  window.HEARTH_HEX_SURFACE = api;
  window.HEARTH_HEX_SURFACE_STATUS = STATUS;
  window.__HEARTH_HEX_SURFACE_DISPOSE__ = dispose;

  document.documentElement.dataset.hearthHexSurfaceLoaded = "true";
  document.documentElement.dataset.hearthHexSurfaceReady = "true";
  document.documentElement.dataset.hearthHexSurfaceReceipt = RECEIPT;
  document.documentElement.dataset.hearthHexSurfaceContract = CONTRACT;
  document.documentElement.dataset.hearthHexSurfaceFamilyContract = FAMILY_CONTRACT;
  document.documentElement.dataset.hearthHexSurfaceBaseline = BASELINE;
  document.documentElement.dataset.hearthHexSurfaceVersion = VERSION;
  document.documentElement.dataset.hearthHexSurfaceGlobalApi = "true";
  document.documentElement.dataset.hearthHexSurfaceDrawFunction = "drawHearthHexSurfaceFrame";
  document.documentElement.dataset.hearthHexSurfaceStatusFunction = "getHearthHexSurfaceStatus";
  document.documentElement.dataset.hearthHexSurfaceHighDensity = "true";
  document.documentElement.dataset.hearthHexSurfaceRawVectorVisualSampling = "true";
  document.documentElement.dataset.hearthHexSurfaceHexCenterVisualOverride = "false";
  document.documentElement.dataset.hearthHexSurfaceGeneratedImage = "false";
  document.documentElement.dataset.hearthHexSurfaceGraphicBox = "false";
})();
