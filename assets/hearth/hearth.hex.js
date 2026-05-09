// /assets/hearth/hearth.hex.surface.js
// HEARTH_G3_HIGH_DENSITY_HEX_SURFACE_CROSS_ADOPTION_TNT_v1
// New render child.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Cross-adopt Audralia's high-density hex surface render technique for Hearth.
// - Preserve Hearth identity, Hearth terrain authority, and Hearth child-engine chain.
// - Use high-density overlapping hex footprints for crisp planet rendering.
// - Do not import Audralia contracts, receipts, runtime, relief authority, or planet truth.
// - Hex surface refines visual expression only.
// - No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const RECEIPT = "HEARTH_G3_HIGH_DENSITY_HEX_SURFACE_CROSS_ADOPTION_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const VERSION = "2026-05-09.hearth-g3-high-density-hex-surface-cross-adoption";

  const DEFAULTS = Object.freeze({
    radiusRatio: 0.456,
    hexDensity: 268,
    minHexRadius: 0.92,
    maxHexRadius: 3.3,
    edgeDarkening: 0.032,
    seamSoftening: 0.035,
    microTerrainStrength: 0.42,
    terrainBlendStrength: 1,
    mountainStrength: 0.52,
    cliffStrength: 0.52,
    valleyStrength: 0.44,
    beachStrength: 0.46,
    islandStrength: 0.46,
    atmosphereStrength: 1,
    axialTilt: -0.22,
    lightX: -0.48,
    lightY: 0.28,
    lightZ: 0.84
  });

  const STATUS = {
    ok: true,
    receipt: RECEIPT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,
    role: "hearth-high-density-hex-surface-render-child",
    crossAdoptedFrom: "audralia-render-technique-only",
    hearthIdentityPreserved: true,
    parentClassificationPreserved: true,
    downstreamClassificationOverrideAllowed: false,
    terrainAuthority: false,
    childEngineAuthority: false,
    canvasAuthority: false,
    runtimeAuthority: false,
    audraliaContractImported: false,
    audraliaPlanetTruthImported: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  const TAU = Math.PI * 2;

  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.max(min, Math.min(max, number));
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

  function smoothstep(edge0, edge1, value) {
    const denominator = Math.max(0.000001, edge1 - edge0);
    const t = clamp01((value - edge0) / denominator);
    return t * t * (3 - 2 * t);
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
      radiusRatio: clamp(Number(options.radiusRatio) || DEFAULTS.radiusRatio, 0.34, 0.49),
      hexDensity: clamp(Number(options.hexDensity) || DEFAULTS.hexDensity, 160, 520),
      minHexRadius: clamp(Number(options.minHexRadius) || DEFAULTS.minHexRadius, 0.55, 3),
      maxHexRadius: clamp(Number(options.maxHexRadius) || DEFAULTS.maxHexRadius, 1.4, 6),
      edgeDarkening: clamp(options.edgeDarkening === undefined ? DEFAULTS.edgeDarkening : Number(options.edgeDarkening), 0, 0.16),
      seamSoftening: clamp(options.seamSoftening === undefined ? DEFAULTS.seamSoftening : Number(options.seamSoftening), 0, 0.16),
      microTerrainStrength: clamp(options.microTerrainStrength === undefined ? DEFAULTS.microTerrainStrength : Number(options.microTerrainStrength), 0, 0.8),
      terrainBlendStrength: clamp(options.terrainBlendStrength === undefined ? DEFAULTS.terrainBlendStrength : Number(options.terrainBlendStrength), 0, 1.2),
      mountainStrength: clamp(options.mountainStrength === undefined ? DEFAULTS.mountainStrength : Number(options.mountainStrength), 0, 1),
      cliffStrength: clamp(options.cliffStrength === undefined ? DEFAULTS.cliffStrength : Number(options.cliffStrength), 0, 1),
      valleyStrength: clamp(options.valleyStrength === undefined ? DEFAULTS.valleyStrength : Number(options.valleyStrength), 0, 1),
      beachStrength: clamp(options.beachStrength === undefined ? DEFAULTS.beachStrength : Number(options.beachStrength), 0, 1),
      islandStrength: clamp(options.islandStrength === undefined ? DEFAULTS.islandStrength : Number(options.islandStrength), 0, 1),
      atmosphereStrength: clamp(options.atmosphereStrength === undefined ? DEFAULTS.atmosphereStrength : Number(options.atmosphereStrength), 0, 1.4),
      axialTilt: Number.isFinite(Number(options.axialTilt)) ? Number(options.axialTilt) : DEFAULTS.axialTilt,
      lightX: Number(options.lightX) || DEFAULTS.lightX,
      lightY: Number(options.lightY) || DEFAULTS.lightY,
      lightZ: Number(options.lightZ) || DEFAULTS.lightZ
    });
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

  function rgb(input, fallback) {
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

  function sampleModule(name, vec) {
    const mod = window[name];

    if (!mod || typeof mod.sampleVector !== "function") {
      return null;
    }

    try {
      return mod.sampleVector(vec);
    } catch (error) {
      document.documentElement.dataset[`hearthHexSurface${name}Error`] =
        error && error.message ? error.message : String(error);
      return null;
    }
  }

  function sampleHearth(vec) {
    return {
      terrain: sampleModule("HEARTH_TERRAIN", vec),
      mountains: sampleModule("HEARTH_MOUNTAINS", vec),
      cliffs: sampleModule("HEARTH_CLIFFS", vec),
      valleys: sampleModule("HEARTH_VALLEYS", vec),
      beaches: sampleModule("HEARTH_BEACHES", vec),
      islands: sampleModule("HEARTH_ISLANDS", vec),
      hex: sampleModule("HEARTH_HEX", vec)
    };
  }

  function baseWaterColor(terrain) {
    const depth = clamp01(Number(terrain && terrain.waterDepth !== undefined ? terrain.waterDepth : 0.72));
    const shelf = clamp01(Number(terrain && terrain.shelf !== undefined ? terrain.shelf : 0));
    const coast = clamp01(Number(terrain && terrain.coast !== undefined ? terrain.coast : 0));

    let color = [8, 70, 132, 255];
    color = mixColor(color, [4, 34, 86, 255], depth * 0.62);
    color = mixColor(color, [34, 170, 184, 255], shelf * 0.66);
    color = mixColor(color, [68, 206, 205, 255], coast * 0.30);
    return color;
  }

  function baseLandColor(terrain) {
    let color = rgb(terrain && terrain.color, [138, 124, 82, 255]);

    const hill = clamp01(Number(terrain && terrain.hillStrength) || 0);
    const mountain = clamp01(Number(terrain && terrain.mountainStrength) || 0);
    const cliff = clamp01(Number(terrain && terrain.cliffStrength) || 0);
    const valley = clamp01(Number(terrain && terrain.valleyStrength) || 0);
    const rock = clamp01(Number(terrain && terrain.rockExposure) || 0);
    const rigid = clamp01(Number(terrain && terrain.rigidLandscapeStrength) || 0);

    color = mixColor(color, [118, 124, 76, 255], hill * 0.18);
    color = mixColor(color, [216, 206, 170, 255], mountain * 0.18);
    color = mixColor(color, [52, 54, 52, 255], cliff * 0.32);
    color = mixColor(color, [70, 104, 72, 255], valley * 0.24);
    color = mixColor(color, [68, 68, 64, 255], rock * 0.28);
    color = mixColor(color, [52, 50, 48, 255], rigid * 0.18);

    return color;
  }

  function baseIslandColor(island) {
    let color = rgb(island && island.color, [152, 132, 84, 255]);

    const hill = clamp01(Number(island && island.hillStrength) || 0);
    const mountain = clamp01(Number(island && island.mountainStrength) || 0);
    const cliff = clamp01(Number(island && island.cliffStrength) || 0);
    const valley = clamp01(Number(island && island.valleyStrength) || 0);

    color = mixColor(color, [146, 136, 86, 255], hill * 0.16);
    color = mixColor(color, [222, 214, 182, 255], mountain * 0.16);
    color = mixColor(color, [58, 60, 56, 255], cliff * 0.25);
    color = mixColor(color, [80, 110, 76, 255], valley * 0.18);

    return color;
  }

  function composeColor(samples, geometryIndex, geometry, config, light) {
    const terrain = samples.terrain || {};
    const mountain = samples.mountains && samples.mountains.active ? samples.mountains : null;
    const cliff = samples.cliffs && samples.cliffs.active ? samples.cliffs : null;
    const valley = samples.valleys && samples.valleys.active ? samples.valleys : null;
    const beach = samples.beaches && samples.beaches.active ? samples.beaches : null;
    const island = samples.islands && samples.islands.active && samples.islands.land ? samples.islands : null;

    let color;
    let surfaceClass = "water";

    if (island) {
      color = baseIslandColor(island);
      surfaceClass = "island";
    } else if (terrain && terrain.land) {
      color = baseLandColor(terrain);
      surfaceClass = "land";
    } else {
      color = baseWaterColor(terrain);
    }

    if (surfaceClass !== "water" && mountain) {
      color = mixColor(color, rgb(mountain.mountainColorBias, [226, 216, 184, 255]), clamp01((Number(mountain.peakStrength) || 0) * 0.18 * config.mountainStrength));
      color = mixColor(color, [236, 228, 200, 255], clamp01((Number(mountain.summitPressure) || 0) * 0.12 * config.mountainStrength));
    }

    if (surfaceClass !== "water" && cliff) {
      color = mixColor(color, rgb(cliff.cliffColorBias, [48, 50, 48, 255]), clamp01((Number(cliff.cliffFaceStrength) || 0) * 0.30 * config.cliffStrength));
      color = multiplyColor(color, 1 - clamp01((Number(cliff.cliffShadow) || 0) * 0.42 * config.cliffStrength));
    }

    if (surfaceClass !== "water" && valley) {
      color = mixColor(color, rgb(valley.valleyColorBias, [74, 104, 74, 255]), clamp01((Number(valley.valleyDepth) || 0) * 0.24 * config.valleyStrength));
      color = multiplyColor(color, 1 - clamp01((Number(valley.valleyShadow) || 0) * 0.28 * config.valleyStrength));
    }

    if (beach) {
      color = mixColor(color, rgb(beach.beachColorBias, [210, 174, 112, 255]), clamp01((Number(beach.sandStrength) || 0) * 0.34 * config.beachStrength));
    }

    const seed = geometry.microSeeds[geometryIndex];
    const hexEdge = geometry.edgeFactors[geometryIndex];
    const zDepth = geometry.sphericalDepths[geometryIndex];
    const hx = geometry.hexQ[geometryIndex];
    const hr = geometry.hexR[geometryIndex];

    const fineNoise = fbm(
      hx * 0.17 + seed * 2.0,
      hr * 0.17 - seed * 3.0,
      1711,
      3
    );

    const microContrast = (fineNoise - 0.5) * config.microTerrainStrength;
    const seam = clamp(
      1 - hexEdge * config.edgeDarkening + (1 - hexEdge) * config.seamSoftening,
      0.80,
      1.08
    );

    const sphericalShade = clamp(0.60 + zDepth * 0.48, 0.50, 1.08);
    const lightShade = clamp(0.72 + light * 0.38, 0.62, 1.12);
    const microShade = clamp(0.965 + microContrast * 0.11, 0.90, 1.12);

    if (surfaceClass !== "water") {
      color = mixColor(color, [232, 224, 190, 255], Math.max(0, microContrast) * 0.08);
      color = mixColor(color, [52, 54, 50, 255], Math.max(0, -microContrast) * 0.10);
    } else {
      color = mixColor(color, [62, 206, 210, 255], Math.max(0, microContrast) * 0.04);
      color = mixColor(color, [4, 28, 78, 255], Math.max(0, -microContrast) * 0.05);
    }

    return multiplyColor(color, seam * sphericalShade * lightShade * 0.98);
  }

  function buildHexGeometry(size, options = {}) {
    const radius = size * options.radiusRatio;
    const cx = size / 2;
    const cy = size / 2;

    const hexRadius = clamp(
      size / options.hexDensity,
      options.minHexRadius,
      options.maxHexRadius
    );

    let count = 0;

    for (let py = 0; py < size; py += 1) {
      const y = (py + 0.5 - cy) / radius;

      for (let px = 0; px < size; px += 1) {
        const x = (px + 0.5 - cx) / radius;
        if (x * x + y * y <= 1) count += 1;
      }
    }

    const indices = new Uint32Array(count);
    const sphereX = new Float32Array(count);
    const sphereY = new Float32Array(count);
    const sphereZ = new Float32Array(count);
    const edgeFactors = new Float32Array(count);
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
        const edge = smoothstep(0.76, 1.05, hexDistance(localX, localY, hexRadius));

        indices[i] = (py * size + px) * 4;
        sphereX[i] = x;
        sphereY[i] = -y;
        sphereZ[i] = z;
        edgeFactors[i] = edge;
        microSeeds[i] = hash2(center.q, center.r, 2027);
        sphericalDepths[i] = z;
        hexQ[i] = center.q;
        hexR[i] = center.r;

        i += 1;
      }
    }

    return Object.freeze({
      receipt: RECEIPT,
      model: "hearth-high-density-overlapping-hex-surface",
      size,
      radius,
      hexRadius,
      count,
      indices,
      sphereX,
      sphereY,
      sphereZ,
      edgeFactors,
      microSeeds,
      sphericalDepths,
      hexQ,
      hexR
    });
  }

  function drawAtmosphere(ctx, size, options = {}) {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * options.radiusRatio;
    const strength = options.atmosphereStrength;

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

  function publishStatus(state, frameReceipt) {
    if (state && state.canvas) {
      state.canvas.dataset.hearthHexSurface = RECEIPT;
      state.canvas.dataset.hearthHexSurfaceModel = "hearth-high-density-overlapping-hex-surface";
      state.canvas.dataset.hearthHexSurfaceCrossAdoptedFrom = "audralia-technique-only";
      state.canvas.dataset.hearthIdentityPreserved = "true";
      state.canvas.dataset.parentClassificationPreserved = "true";
      state.canvas.dataset.downstreamClassificationOverrideAllowed = "false";
      state.canvas.dataset.graphicBox = "false";
      state.canvas.dataset.imageGeneration = "false";
      state.canvas.dataset.visualPassClaimed = "false";

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

    window.HEARTH_HEX_SURFACE_STATUS = STATUS;
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

    if (!state.hearthHexGeometry || state.hearthHexGeometry.size !== size || state.hearthHexGeometry.receipt !== RECEIPT) {
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

    for (let i = 0; i < geometry.count; i += 1) {
      const out = geometry.indices[i];

      let vec = [geometry.sphereX[i], geometry.sphereY[i], geometry.sphereZ[i]];
      vec = rotateX(vec, config.axialTilt);
      vec = rotateY(vec, phase);

      const rawNormal = norm3([geometry.sphereX[i], geometry.sphereY[i], geometry.sphereZ[i]]);
      const lightValue = clamp01(rawNormal[0] * light[0] + rawNormal[1] * light[1] + rawNormal[2] * light[2]);

      const samples = sampleHearth(vec);
      const color = composeColor(samples, i, geometry, config, lightValue);

      const terrain = samples.terrain || {};
      const island = samples.islands || {};
      const mountains = samples.mountains || {};
      const cliffs = samples.cliffs || {};
      const valleys = samples.valleys || {};
      const beaches = samples.beaches || {};

      if (island.active && island.land) islandPixels += 1;
      else if (terrain.land) landPixels += 1;
      else waterPixels += 1;

      if (beaches.active) beachPixels += 1;
      if (mountains.active) mountainPixels += 1;
      if (cliffs.active) cliffPixels += 1;
      if (valleys.active) valleyPixels += 1;

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
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      model: "hearth-high-density-overlapping-hex-surface",
      crossAdoptedFrom: "audralia-render-technique-only",
      hearthIdentityPreserved: true,
      parentClassificationPreserved: true,
      downstreamClassificationOverrideAllowed: false,
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
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    });

    publishStatus(state, frameReceipt);
    return frameReceipt;
  }

  function getHearthHexSurfaceStatus(state = null) {
    return Object.freeze({
      ok: true,
      receipt: RECEIPT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      role: "hearth-high-density-hex-surface-render-child",
      crossAdoptedFrom: "audralia-render-technique-only",
      hearthIdentityPreserved: true,
      terrainAuthority: false,
      childEngineAuthority: false,
      canvasAuthority: false,
      parentClassificationPreserved: true,
      downstreamClassificationOverrideAllowed: false,
      geometryLoaded: Boolean(state && state.hearthHexGeometry),
      hexRadius: state && state.hearthHexGeometry ? state.hearthHexGeometry.hexRadius : null,
      hexSamples: state && state.hearthHexGeometry ? state.hearthHexGeometry.count : null,
      highDensityHexSurface: true,
      overlappingHexFootprints: true,
      rawVectorPlanetSampling: true,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    });
  }

  const api = Object.freeze({
    receipt: RECEIPT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,
    drawHearthHexSurfaceFrame,
    drawFrame: drawHearthHexSurfaceFrame,
    buildHexGeometry,
    getHearthHexSurfaceStatus
  });

  window.HEARTH_HEX_SURFACE = api;
  window.HEARTH_HEX_SURFACE_STATUS = STATUS;

  document.documentElement.dataset.hearthHexSurfaceLoaded = "true";
  document.documentElement.dataset.hearthHexSurfaceReceipt = RECEIPT;
  document.documentElement.dataset.hearthHexSurfaceFamilyContract = FAMILY_CONTRACT;
  document.documentElement.dataset.hearthHexSurfaceVersion = VERSION;
  document.documentElement.dataset.hearthHexSurfaceModel = "high-density-overlapping-hex-surface";
  document.documentElement.dataset.hearthHexSurfaceCrossAdoptedFrom = "audralia-technique-only";
  document.documentElement.dataset.hearthHexSurfaceHearthIdentityPreserved = "true";
  document.documentElement.dataset.hearthHexSurfaceGraphicBox = "false";
  document.documentElement.dataset.hearthHexSurfaceImageGeneration = "false";
})();
