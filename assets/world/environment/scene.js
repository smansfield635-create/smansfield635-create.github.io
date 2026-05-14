// /assets/world/environment/scene.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_SCENE_CORE_MECHANICS_REDUCTION_TNT_v1
// Scope: scene compositor reduced to sky, water, and ground mechanics only.
// Purpose: preserve live hex substrate while returning Manor, foliage, rocks, path, wildlife,
// climate detail, and water-detail authority to their own files.
// Parent Globe untouched. Route shell untouched. Conductor untouched unless cache sync is needed.

import {
  createEnvironmentProfile,
  resolveEnvironmentCell,
  clamp,
  lerp,
  hash01
} from "/assets/world/environment/profile.js";

import { createHexField } from "/assets/world/environment/hexfield.js";

export const ENVIRONMENT_SCENE_VERSION =
  "h-earth-scene-core-mechanics-reduction-v1";

const TAU = Math.PI * 2;

const CORE_MATERIAL = Object.freeze({
  skyHigh: [72, 106, 132],
  skyWarm: [222, 195, 146],
  haze: [255, 231, 181],
  cloudSoft: [246, 242, 220],

  waterFar: [94, 150, 156],
  waterFace: [30, 96, 128],
  waterDeep: [8, 45, 76],
  foam: [236, 246, 238],
  shimmer: [255, 236, 180],

  shelfStone: [126, 116, 78],
  soil: [88, 65, 42],
  wetSand: [144, 113, 69],
  darkGround: [24, 40, 32]
});

function rgbaColor(color, alpha) {
  return `rgba(${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])},${alpha})`;
}

function mix(a, b, t) {
  const k = clamp(t, 0, 1);
  return [
    lerp(a[0], b[0], k),
    lerp(a[1], b[1], k),
    lerp(a[2], b[2], k)
  ];
}

function material(name, alpha = 1, options = {}) {
  const base = CORE_MATERIAL[name] || CORE_MATERIAL.darkGround;
  const light = clamp(options.light ?? 0, -1, 1);
  const shadow = clamp(options.shadow ?? 0, 0, 1);
  const wet = clamp(options.wet ?? 0, 0, 1);
  const warmth = clamp(options.warmth ?? 0, 0, 1);

  let color = [...base];

  if (wet > 0) color = mix(color, [7, 20, 25], wet * 0.34);
  if (warmth > 0) color = mix(color, CORE_MATERIAL.haze, warmth * 0.22);
  if (light > 0) color = mix(color, [255, 255, 244], light * 0.28);
  if (light < 0) color = mix(color, [0, 0, 0], Math.abs(light) * 0.22);
  if (shadow > 0) color = mix(color, [0, 0, 0], shadow * 0.44);

  return rgbaColor(color, alpha);
}

function gradient(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);

  stops.forEach((stop) => {
    g.addColorStop(
      stop.at,
      material(stop.material, stop.alpha ?? 1, stop.options || {})
    );
  });

  return g;
}

export function createGroundEnvironmentScene(canvas, inputProfile, options = {}) {
  const profile = createEnvironmentProfile(inputProfile);
  const cell = resolveEnvironmentCell(profile, options.cell || profile.region.activeCell);
  const hexfield = createHexField(profile, cell, options);
  const ctx = canvas.getContext("2d", { alpha: false });

  const state = {
    running: false,
    raf: 0,
    startedAt: performance.now(),
    lastFrame: 0,
    targetFrameMs: options.targetFrameMs || 50,
    receipt: null
  };

  function resizeCanvas() {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, options.maxDpr || 1.75);
    const width = Math.max(options.minWidth || 960, Math.floor((box.width || 980) * dpr));
    const height = Math.max(options.minHeight || 1180, Math.floor((box.height || 1200) * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    return { width, height, dpr };
  }

  function draw(time = performance.now()) {
    if (!state.running) return;

    if (time - state.lastFrame < state.targetFrameMs) {
      state.raf = requestAnimationFrame(draw);
      return;
    }

    state.lastFrame = time;

    const size = resizeCanvas();
    const frame = {
      width: size.width,
      height: size.height,
      dpr: size.dpr,
      time: (time - state.startedAt) / 1000,
      now: time,
      profile,
      cell,
      hexfield
    };

    ctx.clearRect(0, 0, size.width, size.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    drawSkyMechanics(ctx, frame);
    drawWaterMechanics(ctx, frame);
    drawGroundMechanics(ctx, frame);
    drawCoreAtmosphere(ctx, frame);

    state.receipt = Object.freeze({
      sceneVersion: ENVIRONMENT_SCENE_VERSION,
      hexfieldVersion: hexfield.version,
      planet: profile.planet.key,
      region: profile.region.key,
      cell: cell.coordinate,
      reusableEngine: true,
      staticImageSource: false,
      parentMutation: false,
      rendered: true,
      sceneReduced: true,
      sceneOwnsOnly: ["sky-mechanics", "water-mechanics", "ground-mechanics", "composition", "receipt"],
      delegatedToOtherFiles: [
        "structure",
        "foliage",
        "terrain-detail",
        "path",
        "rocks",
        "mountains",
        "wildlife",
        "advanced-climate",
        "advanced-water"
      ],
      materialExpression: true,
      colorFillRejected: true,
      hexSubstrate: {
        live: true,
        scale: hexfield.scale,
        seed: hexfield.seed
      },
      layers: [
        "sky-core",
        "water-core",
        "ground-core",
        "atmosphere-core"
      ]
    });

    state.raf = requestAnimationFrame(draw);
  }

  return Object.freeze({
    start() {
      if (!ctx) throw new Error("Canvas 2D context unavailable.");

      if (!state.running) {
        state.running = true;
        state.raf = requestAnimationFrame(draw);
      }

      return this;
    },

    stop() {
      state.running = false;
      cancelAnimationFrame(state.raf);
    },

    status() {
      return Object.freeze({
        version: ENVIRONMENT_SCENE_VERSION,
        running: state.running,
        profile,
        cell,
        hexfield: hexfield.status(),
        receipt: state.receipt
      });
    }
  });
}

function drawSkyMechanics(ctx, frame) {
  const { width: w, height: h, profile, cell, hexfield, time: t } = frame;

  ctx.fillStyle = gradient(ctx, 0, 0, 0, h, [
    { at: 0, material: "skyHigh", alpha: 1, options: { light: 0.03 } },
    { at: 0.26, material: "skyWarm", alpha: 1, options: { warmth: 0.16 } },
    { at: 0.48, material: "haze", alpha: 0.92, options: { warmth: 0.14 } },
    { at: 0.72, material: "shelfStone", alpha: 0.66, options: { shadow: 0.12, warmth: 0.08 } },
    { at: 1, material: "darkGround", alpha: 1, options: { shadow: 0.42 } }
  ]);
  ctx.fillRect(0, 0, w, h);

  const sunX = w * (profile.climate?.sunX ?? 0.80);
  const sunY = h * (profile.climate?.sunY ?? 0.13);

  const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.70);
  sun.addColorStop(0, material("haze", 0.68, { light: 0.24 }));
  sun.addColorStop(0.20, material("haze", 0.36, { warmth: 0.16 }));
  sun.addColorStop(0.48, material("haze", 0.13));
  sun.addColorStop(0.84, material("haze", 0.035));
  sun.addColorStop(1, material("haze", 0));
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  drawCoreCloudPressure(ctx, frame);
}

function drawCoreCloudPressure(ctx, frame) {
  const { width: w, height: h, time: t, cell, hexfield, profile } = frame;
  const density = clamp(profile.climate?.cloudDensity ?? 0.52, 0, 1);
  const wind = profile.climate?.wind ?? 0.60;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let bank = 0; bank < Math.round(6 + density * 7); bank += 1) {
    const baseX = (((hash01(bank, 310, 1, cell.seed) + t * 0.0014 * wind) % 1) + 1) % 1;
    const baseY = 0.055 + hash01(bank, 311, 2, cell.seed) * 0.240;
    const scaleX = 0.08 + hash01(bank, 312, 3, cell.seed) * 0.16;
    const scaleY = 0.010 + hash01(bank, 313, 4, cell.seed) * 0.024;
    const lobes = 6 + Math.floor(hash01(bank, 314, 5, cell.seed) * 7);

    for (let lobe = 0; lobe < lobes; lobe += 1) {
      const lx = baseX + (hash01(bank, lobe, 6, cell.seed) - 0.5) * scaleX;
      const ly = baseY + (hash01(bank, lobe, 7, cell.seed) - 0.5) * scaleY * 2.1;
      const nx = ((lx % 1) + 1) % 1;
      const sample = hexfield.sample(nx, clamp(ly, 0, 1), t);
      const pressure = sample.cloudNoise ?? hash01(bank, lobe, 8, cell.seed);

      ctx.globalAlpha = (0.034 + pressure * 0.060) * density;
      ctx.fillStyle = pressure > 0.52
        ? material("cloudSoft", 0.82, { light: 0.06 })
        : material("skyHigh", 0.24, { light: 0.08 });

      ctx.beginPath();
      ctx.ellipse(
        nx * w,
        ly * h,
        w * scaleX * (0.14 + pressure * 0.30),
        h * scaleY * (0.40 + pressure * 0.88),
        pressure * 0.16,
        0,
        TAU
      );
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawWaterMechanics(ctx, frame) {
  const { width: w, height: h, time: t, hexfield, profile, cell } = frame;
  const water = profile.water || {};
  const camera = profile.camera || {};

  const top = h * (camera.horizon ?? 0.35);
  const bottom = h * (camera.shoreline ?? 0.588);
  const tideOffset = Math.sin(t * 0.18) * h * 0.006 * (water.tide ?? 0.48);

  ctx.fillStyle = gradient(ctx, 0, top, 0, bottom, [
    { at: 0, material: "waterFar", alpha: 1, options: { light: 0.05 } },
    { at: 0.42, material: "waterFace", alpha: 1 },
    { at: 1, material: "waterDeep", alpha: 1, options: { shadow: 0.20 } }
  ]);

  ctx.beginPath();
  ctx.moveTo(0, top);

  for (let i = 0; i <= 180; i += 1) {
    const nx = i / 180;
    const sample = hexfield.sample(nx, camera.horizon ?? 0.35, t);
    const y =
      top +
      Math.sin(i * 0.31 + t * 0.36) * h * 0.0025 * (water.waveStrength ?? 0.70) +
      Math.sin(i * 1.43 + t * 0.15) * h * 0.0016 * (water.waveStrength ?? 0.70) +
      sample.wave * h * 0.0014;

    ctx.lineTo(nx * w, y);
  }

  ctx.lineTo(w, bottom + tideOffset);
  ctx.lineTo(0, bottom + tideOffset);
  ctx.closePath();
  ctx.fill();

  drawCoreWaterMotion(ctx, frame, top, bottom);
}

function drawCoreWaterMotion(ctx, frame, topPx, bottomPx) {
  const { width: w, height: h, time: t, cell, hexfield, profile } = frame;
  const top = profile.camera?.horizon ?? 0.35;
  const bottom = profile.camera?.shoreline ?? 0.588;
  const sunX = profile.climate?.sunX ?? 0.80;

  ctx.save();

  for (let i = 0; i < 220; i += 1) {
    const nx = hash01(i, 510, 1, cell.seed);
    const ny = lerp(top + 0.03, bottom - 0.02, hash01(i, 511, 2, cell.seed));
    const sample = hexfield.sample(nx, ny, t);

    const materialName =
      sample.waterDepth > 0.70 ? "waterDeep" :
      sample.waterDepth > 0.36 ? "waterFace" :
      "waterFar";

    ctx.fillStyle = material(materialName, 0.016 + sample.waterDepth * 0.034, {
      light: sample.shimmer * 0.10,
      shadow: sample.waterDepth * 0.12
    });

    ctx.beginPath();
    ctx.ellipse(
      nx * w,
      ny * h,
      w * (0.004 + hash01(i, 512, 3, cell.seed) * 0.017),
      h * (0.0007 + hash01(i, 513, 4, cell.seed) * 0.0018),
      -0.08,
      0,
      TAU
    );
    ctx.fill();
  }

  const reflection = ctx.createRadialGradient(w * sunX, h * 0.405, 0, w * sunX, h * 0.46, w * 0.48);
  reflection.addColorStop(0, material("shimmer", 0.28, { light: 0.16 }));
  reflection.addColorStop(0.25, material("shimmer", 0.14));
  reflection.addColorStop(0.58, material("shimmer", 0.046));
  reflection.addColorStop(1, material("shimmer", 0));
  ctx.fillStyle = reflection;
  ctx.fillRect(0, topPx, w, bottomPx - topPx);

  ctx.globalCompositeOperation = "screen";

  for (let j = 0; j < 54; j += 1) {
    const ny = lerp(top + 0.025, bottom - 0.020, j / 54);
    const depthFade = 1 - j / 66;

    ctx.globalAlpha = Math.max(0.018, 0.125 * depthFade);
    ctx.strokeStyle = material("foam", 0.15);
    ctx.lineWidth = Math.max(1, w * 0.00066);
    ctx.beginPath();

    for (let i = 0; i <= 132; i += 1) {
      const nx = i / 132;
      const sample = hexfield.sample(nx, ny, t);
      const wave =
        Math.sin(i * 0.80 + j * 0.54 + t * 0.80) * h * 0.00135 +
        Math.sin(i * 1.65 + t * 0.30) * h * 0.0009 +
        sample.wave * h * 0.0010;

      if (i === 0) ctx.moveTo(nx * w, ny * h + wave);
      else ctx.lineTo(nx * w, ny * h + wave);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawGroundMechanics(ctx, frame) {
  const { width: w, height: h, time: t, hexfield, profile } = frame;
  const camera = profile.camera || {};
  const shoreline = camera.shoreline ?? 0.588;
  const groundStart = camera.groundStart ?? 0.558;

  drawCoreShoreline(ctx, frame, shoreline);
  drawCoreShelf(ctx, frame, groundStart);
}

function drawCoreShoreline(ctx, frame, line) {
  const { width: w, height: h, time: t, hexfield, profile } = frame;
  const tide = Math.sin(t * 0.18) * h * 0.006 * (profile.water?.tide ?? 0.48);

  ctx.fillStyle = gradient(ctx, 0, h * (line - 0.044), 0, h * (line + 0.108), [
    { at: 0, material: "foam", alpha: 0.045 },
    { at: 0.24, material: "drySand", alpha: 0.36, options: { warmth: 0.12 } },
    { at: 0.54, material: "wetSand", alpha: 0.30, options: { wet: 0.35 } },
    { at: 1, material: "soil", alpha: 0 }
  ]);

  ctx.beginPath();
  ctx.moveTo(0, h * (line - 0.018));

  for (let i = 0; i <= 160; i += 1) {
    const nx = i / 160;
    const sample = hexfield.sample(nx, line, t);
    const y =
      h * line +
      Math.sin(i * 0.44 + t * 0.24) * h * 0.0042 +
      Math.sin(i * 1.22) * h * 0.0025 +
      sample.shorePressure * sample.tide * h * 0.0018;

    ctx.lineTo(nx * w, y);
  }

  ctx.lineTo(w, h * (line + 0.096));
  ctx.lineTo(0, h * (line + 0.090));
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.lineCap = "round";

  for (let pass = 0; pass < 2; pass += 1) {
    ctx.strokeStyle = material("foam", 0.24 - pass * 0.07);
    ctx.lineWidth = Math.max(1, w * (0.00075 + pass * 0.00022));
    ctx.beginPath();

    for (let i = 0; i <= 150; i += 1) {
      const nx = i / 150;
      const sample = hexfield.sample(nx, line, t);
      const y =
        h * line +
        tide +
        Math.sin(i * 0.54 + t * 0.56 + pass) * h * 0.0023 +
        Math.sin(i * 1.80 + t * 0.22) * h * 0.0011 +
        sample.tide * h * 0.0013 +
        pass * h * 0.0022;

      if (i === 0) ctx.moveTo(nx * w, y);
      else ctx.lineTo(nx * w, y);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawCoreShelf(ctx, frame, top) {
  const { width: w, height: h, time: t, hexfield, cell } = frame;

  ctx.fillStyle = gradient(ctx, 0, h * top, 0, h, [
    { at: 0, material: "shelfStone", alpha: 1, options: { warmth: 0.12 } },
    { at: 0.34, material: "soil", alpha: 1, options: { warmth: 0.06 } },
    { at: 0.72, material: "darkGround", alpha: 0.96, options: { shadow: 0.24 } },
    { at: 1, material: "darkGround", alpha: 1, options: { shadow: 0.45 } }
  ]);

  ctx.beginPath();
  ctx.moveTo(0, h * top);

  for (let i = 0; i <= 160; i += 1) {
    const nx = i / 160;
    const sample = hexfield.sample(nx, top, t);
    const y =
      h * top +
      Math.sin(i * 0.43) * h * 0.008 +
      Math.sin(i * 1.27 + 0.4) * h * 0.004 +
      sample.elevation * h * 0.0036;

    ctx.lineTo(nx * w, y);
  }

  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 320; i += 1) {
    const nx = hash01(i, 900, 1, cell.seed);
    const ny = 0.60 + hash01(i, 901, 2, cell.seed) * 0.38;
    const sample = hexfield.sample(nx, ny, t);
    const alpha = 0.012 + sample.fracture * 0.050;
    const r = h * (0.0007 + sample.grain * 0.0024);

    const groundMaterial =
      sample.rockPressure > 0.46 ? "shelfStone" :
      sample.moistureNoise > 0.68 ? "darkGround" :
      sample.pathPressure > 0.50 ? "wetSand" :
      "soil";

    ctx.fillStyle = material(groundMaterial, alpha, {
      light: sample.elevation * 0.12,
      wet: sample.moistureNoise * 0.10,
      shadow: sample.groundPressure * 0.10
    });

    ctx.beginPath();
    ctx.ellipse(nx * w, ny * h, r * 1.7, r * 0.58, sample.macro * Math.PI, 0, TAU);
    ctx.fill();
  }
}

function drawCoreAtmosphere(ctx, frame) {
  const { width: w, height: h, profile } = frame;
  const hazePower = clamp(profile.climate?.haze ?? 0.60, 0, 1);

  const haze = ctx.createLinearGradient(0, h * 0.26, 0, h * 0.68);
  haze.addColorStop(0, material("haze", 0.020 * hazePower));
  haze.addColorStop(0.30, material("haze", 0.10 * hazePower));
  haze.addColorStop(0.58, material("shimmer", 0.055 * hazePower));
  haze.addColorStop(1, material("haze", 0));
  ctx.fillStyle = haze;
  ctx.fillRect(0, h * 0.26, w, h * 0.44);

  const vignette = ctx.createRadialGradient(
    w * 0.50,
    h * 0.50,
    h * 0.20,
    w * 0.50,
    h * 0.50,
    w * 0.88
  );

  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(0.78, "rgba(0,0,0,.035)");
  vignette.addColorStop(1, "rgba(0,0,0,.30)");

  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}
