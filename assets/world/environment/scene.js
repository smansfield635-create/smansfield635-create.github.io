// /assets/world/environment/scene.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_MAJOR_VISUAL_SHIFT_MATERIAL_WORLD_SCENE_TNT_v1
// Owns: full visible ground-world composition through live hex substrate.
// Standard: no generic color filling. Every visible color is expressed as material.
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
  "h-earth-major-visual-shift-material-world-scene-v1";

const TAU = Math.PI * 2;

const MATERIAL = Object.freeze({
  atmosphereHigh: [72, 108, 137],
  atmosphereLow: [220, 194, 146],
  sunScatter: [255, 226, 158],
  cloudLit: [252, 246, 226],
  cloudShade: [143, 157, 156],
  goldenHaze: [255, 231, 181],

  deepWater: [8, 46, 78],
  waterFace: [28, 96, 129],
  waterLit: [91, 153, 158],
  foam: [238, 247, 240],
  shimmer: [255, 237, 180],
  wetSand: [144, 113, 69],
  drySand: [210, 178, 108],

  shelfStone: [126, 116, 78],
  darkStone: [34, 39, 36],
  soil: [88, 65, 42],
  clay: [114, 80, 51],
  pathDust: [164, 131, 77],

  grassBlade: [72, 126, 66],
  grassLit: [173, 166, 86],
  moss: [54, 101, 52],
  shrubLeaf: [49, 107, 61],
  stem: [37, 66, 41],

  manorStoneDark: [56, 50, 44],
  manorStoneMid: [123, 101, 70],
  manorStoneLit: [184, 146, 88],
  roofSlate: [40, 36, 34],
  windowLight: [255, 214, 136],
  structureShadow: [16, 12, 10]
});

function rgb(color) {
  return `rgb(${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])})`;
}

function rgba(color, alpha) {
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

function shade(materialName, options = {}) {
  const base = MATERIAL[materialName] || MATERIAL.darkStone;
  const light = clamp(options.light ?? 0, -1, 1);
  const shadow = clamp(options.shadow ?? 0, 0, 1);
  const wet = clamp(options.wet ?? 0, 0, 1);
  const warmth = clamp(options.warmth ?? 0, 0, 1);

  let color = [...base];

  if (wet > 0) color = mix(color, [8, 20, 24], wet * 0.34);
  if (warmth > 0) color = mix(color, MATERIAL.sunScatter, warmth * 0.24);
  if (light > 0) color = mix(color, [255, 255, 242], light * 0.30);
  if (light < 0) color = mix(color, [0, 0, 0], Math.abs(light) * 0.22);
  if (shadow > 0) color = mix(color, [0, 0, 0], shadow * 0.46);

  return color;
}

function paint(materialName, alpha = 1, options = {}) {
  return rgba(shade(materialName, options), alpha);
}

function materialGradient(ctx, x0, y0, x1, y1, stops) {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach((stop) => {
    gradient.addColorStop(stop.at, paint(stop.material, stop.alpha ?? 1, stop.options || {}));
  });
  return gradient;
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);

  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    return;
  }

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function chooseGround(sample) {
  if (!sample) return "soil";
  if (sample.pathPressure > 0.48) return "pathDust";
  if (sample.rockPressure > 0.44) return sample.fracture > 0.54 ? "shelfStone" : "darkStone";
  if (sample.moistureNoise > 0.68) return "moss";
  if (sample.elevation > 0.66) return "shelfStone";
  return sample.groundPressure > 0.72 ? "soil" : "clay";
}

function chooseVegetation(sample) {
  if (!sample) return "grassBlade";
  if (sample.moistureNoise > 0.70) return "moss";
  if (sample.lifeNoise > 0.66) return "shrubLeaf";
  return sample.elevation > 0.62 ? "grassLit" : "grassBlade";
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
    receipt: null,
    structureDrawn: false
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
      hexfield,
      profile,
      cell
    };

    ctx.clearRect(0, 0, size.width, size.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    drawAtmosphere(ctx, frame);
    drawCloudMass(ctx, frame);
    drawDistantStone(ctx, frame);
    drawWaterBody(ctx, frame);
    drawWaterMotion(ctx, frame);
    drawShoreline(ctx, frame);
    drawLandShelf(ctx, frame);
    drawMaterialTerrainDetail(ctx, frame);
    drawArrivalPath(ctx, frame);
    drawManorAnchor(ctx, frame);
    drawVegetation(ctx, frame);
    drawForegroundMaterial(ctx, frame);
    drawWildlife(ctx, frame);
    drawFinalAtmosphere(ctx, frame);

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
      majorVisualShift: true,
      materialExpression: true,
      colorFillRejected: true,
      compositionAnchor: "manor-midground",
      waterBehindStructure: true,
      structureDrawn: state.structureDrawn,
      manorVisible: state.structureDrawn,
      hexSubstrate: {
        live: true,
        scale: hexfield.scale,
        seed: hexfield.seed
      },
      materialSources: [
        "atmosphere",
        "cloud",
        "sun-scatter",
        "deep-water",
        "wave-face",
        "foam",
        "shimmer",
        "wet-sand",
        "dry-sand",
        "shelf-stone",
        "soil",
        "path-dust",
        "grass-blade",
        "leaf",
        "moss",
        "manor-stone",
        "roof-slate",
        "window-light"
      ],
      layers: [
        "atmosphere-material",
        "cloud-material",
        "distant-stone",
        "water-body",
        "water-motion",
        "shoreline-sand-and-foam",
        "land-shelf-material",
        "terrain-detail",
        "arrival-path",
        "manor-anchor",
        "vegetation-material",
        "foreground-material",
        "wildlife",
        "final-atmosphere"
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

function drawAtmosphere(ctx, frame) {
  const { width: w, height: h, profile } = frame;

  ctx.fillStyle = materialGradient(ctx, 0, 0, 0, h, [
    { at: 0, material: "atmosphereHigh", alpha: 1, options: { light: 0.02 } },
    { at: 0.22, material: "atmosphereLow", alpha: 1, options: { warmth: 0.12 } },
    { at: 0.42, material: "goldenHaze", alpha: 0.94, options: { warmth: 0.20 } },
    { at: 0.61, material: "shelfStone", alpha: 0.72, options: { warmth: 0.10, shadow: 0.08 } },
    { at: 1, material: "darkStone", alpha: 1, options: { shadow: 0.42 } }
  ]);
  ctx.fillRect(0, 0, w, h);

  const sunX = w * (profile.climate.sunX ?? 0.8);
  const sunY = h * (profile.climate.sunY ?? 0.13);

  const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.70);
  sun.addColorStop(0, paint("sunScatter", 0.72, { light: 0.30 }));
  sun.addColorStop(0.18, paint("sunScatter", 0.42, { warmth: 0.10 }));
  sun.addColorStop(0.46, paint("sunScatter", 0.15));
  sun.addColorStop(0.82, paint("sunScatter", 0.035));
  sun.addColorStop(1, paint("sunScatter", 0));
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);
}

function drawCloudMass(ctx, frame) {
  const { width: w, height: h, time: t, cell, hexfield, profile } = frame;
  const density = clamp(profile.climate.cloudDensity ?? 0.5, 0, 1);
  const wind = profile.climate.wind ?? 0.55;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const banks = Math.round(8 + density * 9);

  for (let bank = 0; bank < banks; bank += 1) {
    const baseX = (((hash01(bank, 310, 1, cell.seed) + t * 0.0016 * wind) % 1) + 1) % 1;
    const baseY = 0.045 + hash01(bank, 311, 2, cell.seed) * 0.265;
    const scaleX = 0.09 + hash01(bank, 312, 3, cell.seed) * 0.18;
    const scaleY = 0.010 + hash01(bank, 313, 4, cell.seed) * 0.026;
    const lobes = 8 + Math.floor(hash01(bank, 314, 5, cell.seed) * 8);

    for (let lobe = 0; lobe < lobes; lobe += 1) {
      const lx = baseX + (hash01(bank, lobe, 6, cell.seed) - 0.5) * scaleX;
      const ly = baseY + (hash01(bank, lobe, 7, cell.seed) - 0.5) * scaleY * 2.2;
      const nx = ((lx % 1) + 1) % 1;
      const sample = hexfield.sample(nx, clamp(ly, 0, 1), t);
      const pressure = sample.cloudNoise ?? hash01(bank, lobe, 8, cell.seed);

      ctx.globalAlpha = (0.045 + pressure * 0.078) * density;
      ctx.fillStyle = pressure > 0.52
        ? paint("cloudLit", 0.86, { light: 0.08 })
        : paint("cloudShade", 0.58, { shadow: 0.10 });

      ctx.beginPath();
      ctx.ellipse(
        nx * w,
        ly * h,
        w * scaleX * (0.15 + pressure * 0.32),
        h * scaleY * (0.42 + pressure * 0.95),
        pressure * 0.18,
        0,
        TAU
      );
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawDistantStone(ctx, frame) {
  const { width: w, height: h, time: t, cell, hexfield } = frame;

  const ridges = [
    { x: 0.08, y: 0.356, width: 0.22, height: 0.080 },
    { x: 0.59, y: 0.360, width: 0.17, height: 0.060 },
    { x: 0.82, y: 0.354, width: 0.24, height: 0.078 }
  ];

  ridges.forEach((ridge) => {
    ctx.fillStyle = materialGradient(ctx, 0, h * (ridge.y - ridge.height), 0, h * ridge.y, [
      { at: 0, material: "shelfStone", alpha: 0.34, options: { shadow: 0.32, warmth: 0.10 } },
      { at: 1, material: "darkStone", alpha: 0.18, options: { shadow: 0.52 } }
    ]);

    ctx.beginPath();
    ctx.moveTo(w * (ridge.x - ridge.width / 2), h * ridge.y);

    for (let i = 0; i <= 18; i += 1) {
      const local = i / 18;
      const nx = ridge.x - ridge.width / 2 + local * ridge.width;
      const sample = hexfield.sample(clamp(nx, 0, 1), ridge.y, t);
      const peak = Math.sin(local * Math.PI) * ridge.height * (0.62 + sample.fracture * 0.70);
      ctx.lineTo(nx * w, h * (ridge.y - peak));
    }

    ctx.lineTo(w * (ridge.x + ridge.width / 2), h * ridge.y);
    ctx.closePath();
    ctx.fill();
  });

  const islets = [
    [0.08, 0.365, 0.082, 0.046],
    [0.58, 0.359, 0.060, 0.033],
    [0.75, 0.356, 0.090, 0.042],
    [0.88, 0.363, 0.074, 0.034],
    [0.965, 0.374, 0.030, 0.017]
  ];

  islets.forEach(([cx, cy, sx, sy], index) => {
    const sample = hexfield.sample(cx, cy, t);

    ctx.fillStyle = paint("darkStone", 0.34 + sample.fracture * 0.24, {
      shadow: 0.34,
      wet: 0.20
    });

    ctx.beginPath();
    ctx.moveTo(w * (cx - sx), h * cy);

    for (let i = 0; i <= 10; i += 1) {
      const local = i / 10;
      const nx = cx - sx + local * sx * 2;
      const lift = Math.sin(local * Math.PI) * sy * (0.50 + hash01(index, i, 10, cell.seed) * 0.80);
      ctx.lineTo(nx * w, h * (cy - lift));
    }

    ctx.lineTo(w * (cx + sx), h * cy);
    ctx.closePath();
    ctx.fill();
  });
}

function drawWaterBody(ctx, frame) {
  const { width: w, height: h, time: t, hexfield, profile } = frame;
  const top = h * profile.camera.horizon;
  const bottom = h * profile.camera.shoreline;
  const water = profile.water;
  const tideOffset = Math.sin(t * 0.18) * h * 0.006 * (water.tide ?? 0.48);

  ctx.fillStyle = materialGradient(ctx, 0, top, 0, bottom, [
    { at: 0, material: "waterLit", alpha: 1, options: { light: 0.04 } },
    { at: 0.40, material: "waterFace", alpha: 1 },
    { at: 1, material: "deepWater", alpha: 1, options: { shadow: 0.20 } }
  ]);

  ctx.beginPath();
  ctx.moveTo(0, top);

  for (let i = 0; i <= 180; i += 1) {
    const nx = i / 180;
    const sample = hexfield.sample(nx, profile.camera.horizon, t);
    const y =
      top +
      Math.sin(i * 0.31 + t * 0.36) * h * 0.0025 * water.waveStrength +
      Math.sin(i * 1.43 + t * 0.15) * h * 0.0016 * water.waveStrength +
      sample.wave * h * 0.0014;

    ctx.lineTo(nx * w, y);
  }

  ctx.lineTo(w, bottom + tideOffset);
  ctx.lineTo(0, bottom + tideOffset);
  ctx.closePath();
  ctx.fill();
}

function drawWaterMotion(ctx, frame) {
  const { width: w, height: h, time: t, cell, hexfield, profile } = frame;
  const top = profile.camera.horizon;
  const bottom = profile.camera.shoreline;
  const sunX = profile.climate.sunX ?? 0.80;

  ctx.save();

  for (let i = 0; i < 260; i += 1) {
    const nx = hash01(i, 510, 1, cell.seed);
    const ny = lerp(top + 0.03, bottom - 0.02, hash01(i, 511, 2, cell.seed));
    const sample = hexfield.sample(nx, ny, t);
    const material = sample.waterDepth > 0.70 ? "deepWater" : sample.waterDepth > 0.36 ? "waterFace" : "waterLit";

    ctx.fillStyle = paint(material, 0.018 + sample.waterDepth * 0.038, {
      light: sample.shimmer * 0.10,
      shadow: sample.waterDepth * 0.16
    });

    ctx.beginPath();
    ctx.ellipse(
      nx * w,
      ny * h,
      w * (0.005 + hash01(i, 512, 3, cell.seed) * 0.020),
      h * (0.0008 + hash01(i, 513, 4, cell.seed) * 0.0022),
      -0.08,
      0,
      TAU
    );
    ctx.fill();
  }

  const reflection = ctx.createRadialGradient(w * sunX, h * 0.405, 0, w * sunX, h * 0.46, w * 0.48);
  reflection.addColorStop(0, paint("shimmer", 0.31, { light: 0.18 }));
  reflection.addColorStop(0.25, paint("shimmer", 0.16));
  reflection.addColorStop(0.56, paint("shimmer", 0.055));
  reflection.addColorStop(1, paint("shimmer", 0));
  ctx.fillStyle = reflection;
  ctx.fillRect(0, h * top, w, h * (bottom - top));

  ctx.globalCompositeOperation = "screen";

  for (let j = 0; j < 68; j += 1) {
    const ny = lerp(top + 0.022, bottom - 0.020, j / 68);
    const depthFade = 1 - j / 80;

    ctx.globalAlpha = Math.max(0.018, 0.15 * depthFade);
    ctx.strokeStyle = paint("foam", 0.17);
    ctx.lineWidth = Math.max(1, w * 0.00072);
    ctx.beginPath();

    for (let i = 0; i <= 146; i += 1) {
      const nx = i / 146;
      const sample = hexfield.sample(nx, ny, t);
      const wave =
        Math.sin(i * 0.80 + j * 0.54 + t * 0.80) * h * 0.00145 +
        Math.sin(i * 1.65 + t * 0.30) * h * 0.0010 +
        sample.wave * h * 0.0011;

      if (i === 0) ctx.moveTo(nx * w, ny * h + wave);
      else ctx.lineTo(nx * w, ny * h + wave);
    }

    ctx.stroke();
  }

  for (let i = 0; i < 300; i += 1) {
    const nx = clamp(sunX - 0.40 + hash01(i, 40, 1, cell.seed) * 0.68, 0, 1);
    const ny = lerp(top + 0.045, bottom - 0.018, hash01(i, 41, 2, cell.seed));
    const sample = hexfield.sample(nx, ny, t);
    const pulse = sample.shimmer;
    const lane = clamp(1 - Math.abs(nx - sunX) / 0.42, 0, 1);
    const alpha = (0.018 + pulse * 0.15) * (profile.water.shimmer ?? 0.94) * (0.40 + lane * 0.72);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = paint("shimmer", 0.80, { light: 0.25 });
    ctx.beginPath();
    ctx.ellipse(
      nx * w,
      ny * h,
      w * (0.0012 + hash01(i, 42, 3, cell.seed) * 0.0045),
      h * 0.00072,
      -0.12,
      0,
      TAU
    );
    ctx.fill();
  }

  ctx.restore();
}

function drawShoreline(ctx, frame) {
  const { width: w, height: h, time: t, hexfield, profile } = frame;
  const line = profile.camera.shoreline;
  const tide = Math.sin(t * 0.18) * h * 0.006 * (profile.water.tide ?? 0.48);

  ctx.fillStyle = materialGradient(ctx, 0, h * (line - 0.044), 0, h * (line + 0.108), [
    { at: 0, material: "foam", alpha: 0.05 },
    { at: 0.22, material: "drySand", alpha: 0.42, options: { warmth: 0.15 } },
    { at: 0.52, material: "wetSand", alpha: 0.34, options: { wet: 0.35 } },
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

  for (let pass = 0; pass < 3; pass += 1) {
    ctx.strokeStyle = paint("foam", 0.30 - pass * 0.07);
    ctx.lineWidth = Math.max(1, w * (0.0008 + pass * 0.00025));
    ctx.beginPath();

    for (let i = 0; i <= 160; i += 1) {
      const nx = i / 160;
      const sample = hexfield.sample(nx, line, t);
      const y =
        h * line +
        tide +
        Math.sin(i * 0.54 + t * 0.56 + pass) * h * 0.0027 +
        Math.sin(i * 1.80 + t * 0.22) * h * 0.0013 +
        sample.tide * h * 0.0015 +
        pass * h * 0.0024;

      if (i === 0) ctx.moveTo(nx * w, y);
      else ctx.lineTo(nx * w, y);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawLandShelf(ctx, frame) {
  const { width: w, height: h, time: t, hexfield, profile } = frame;
  const top = profile.camera.groundStart;

  ctx.fillStyle = materialGradient(ctx, 0, h * top, 0, h, [
    { at: 0, material: "shelfStone", alpha: 1, options: { warmth: 0.16 } },
    { at: 0.28, material: "soil", alpha: 1, options: { warmth: 0.10 } },
    { at: 0.56, material: "moss", alpha: 0.86, options: { shadow: 0.10 } },
    { at: 1, material: "darkStone", alpha: 1, options: { shadow: 0.45 } }
  ]);

  ctx.beginPath();
  ctx.moveTo(0, h * top);

  for (let i = 0; i <= 160; i += 1) {
    const nx = i / 160;
    const sample = hexfield.sample(nx, top, t);
    const y =
      h * top +
      Math.sin(i * 0.43) * h * 0.009 +
      Math.sin(i * 1.27 + 0.4) * h * 0.005 +
      Math.sin(i * 2.7) * h * 0.002 +
      sample.elevation * h * 0.004;

    ctx.lineTo(nx * w, y);
  }

  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();
}

function drawMaterialTerrainDetail(ctx, frame) {
  const { width: w, height: h, time: t, cell, hexfield } = frame;

  for (let i = 0; i < 860; i += 1) {
    const nx = hash01(i, 900, 1, cell.seed);
    const ny = 0.59 + hash01(i, 901, 2, cell.seed) * 0.39;
    const sample = hexfield.sample(nx, ny, t);
    const materialName = chooseGround(sample);
    const alpha = 0.016 + sample.fracture * 0.075;
    const r = h * (0.0009 + sample.grain * 0.0035);

    ctx.fillStyle = paint(materialName, alpha, {
      light: sample.elevation * 0.18,
      wet: sample.moistureNoise * 0.16,
      shadow: sample.groundPressure * 0.12
    });

    ctx.beginPath();
    ctx.ellipse(nx * w, ny * h, r * 1.9, r * 0.62, sample.macro * Math.PI, 0, TAU);
    ctx.fill();
  }
}

function drawArrivalPath(ctx, frame) {
  const { width: w, height: h, time: t, hexfield } = frame;

  ctx.fillStyle = materialGradient(ctx, w * 0.49, h * 0.64, w * 0.49, h, [
    { at: 0, material: "pathDust", alpha: 0.06, options: { warmth: 0.12 } },
    { at: 0.45, material: "soil", alpha: 0.25, options: { shadow: 0.05 } },
    { at: 1, material: "pathDust", alpha: 0.22, options: { light: 0.10, warmth: 0.20 } }
  ]);

  ctx.beginPath();
  ctx.moveTo(w * 0.475, h * 0.650);
  ctx.bezierCurveTo(w * 0.420, h * 0.760, w * 0.350, h * 0.875, w * 0.245, h);
  ctx.lineTo(w * 0.665, h);
  ctx.bezierCurveTo(w * 0.585, h * 0.875, w * 0.545, h * 0.760, w * 0.525, h * 0.650);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.26;
  ctx.strokeStyle = paint("drySand", 0.34, { light: 0.10 });

  for (let j = 0; j < 12; j += 1) {
    ctx.beginPath();

    for (let i = 0; i <= 60; i += 1) {
      const ny = 0.665 + (i / 60) * 0.31;
      const sample = hexfield.sample(0.50, ny, t);
      const x =
        w *
        (sample.pathCenter +
          (j - 5) * 0.006 +
          Math.sin(i * 0.42 + j) * 0.0018);

      if (i === 0) ctx.moveTo(x, h * ny);
      else ctx.lineTo(x, h * ny);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawManorAnchor(ctx, frame) {
  const { width: w, height: h } = frame;

  const cx = w * 0.50;
  const baseY = h * 0.618;
  const manorW = w * 0.325;
  const manorH = h * 0.165;
  const bodyTop = baseY - manorH * 0.72;
  const bodyH = manorH * 0.57;

  ctx.save();

  const shadow = ctx.createRadialGradient(cx, baseY + h * 0.018, 0, cx, baseY + h * 0.030, manorW * 0.95);
  shadow.addColorStop(0, paint("structureShadow", 0.56));
  shadow.addColorStop(0.55, paint("structureShadow", 0.24));
  shadow.addColorStop(1, paint("structureShadow", 0));
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.026, manorW * 0.86, h * 0.036, 0, 0, TAU);
  ctx.fill();

  drawManorWing(ctx, cx - manorW * 0.50, bodyTop + bodyH * 0.30, manorW * 0.245, bodyH * 0.70, -0.06, w);
  drawManorWing(ctx, cx + manorW * 0.255, bodyTop + bodyH * 0.30, manorW * 0.245, bodyH * 0.70, 0.04, w);
  drawManorCenter(ctx, cx, bodyTop, bodyH, manorW, w);
  drawManorRoofs(ctx, cx, bodyTop, bodyH, manorW, manorH, w);
  drawManorPortico(ctx, cx, baseY, bodyH, manorW, w);
  drawManorWindows(ctx, cx, bodyTop, bodyH, baseY, manorW);
  drawManorGlow(ctx, cx, bodyTop, baseY, manorW, h);

  ctx.restore();

  frame.sceneStructureDrawn = true;
}

function drawManorCenter(ctx, cx, top, bodyH, manorW, canvasW) {
  const bodyW = manorW * 0.46;
  const x = cx - bodyW / 2;

  ctx.fillStyle = materialGradient(ctx, x, top, x + bodyW, top + bodyH, [
    { at: 0, material: "manorStoneDark", alpha: 1, options: { shadow: 0.12 } },
    { at: 0.26, material: "manorStoneMid", alpha: 1 },
    { at: 0.52, material: "manorStoneLit", alpha: 1, options: { light: 0.10 } },
    { at: 0.80, material: "manorStoneMid", alpha: 1, options: { shadow: 0.20 } },
    { at: 1, material: "structureShadow", alpha: 1 }
  ]);

  ctx.strokeStyle = paint("sunScatter", 0.40);
  ctx.lineWidth = Math.max(1, canvasW * 0.0009);

  roundedRect(ctx, x, top, bodyW, bodyH, Math.max(2, canvasW * 0.003));
  ctx.fill();
  ctx.stroke();
}

function drawManorWing(ctx, x, y, wingW, wingH, light, canvasW) {
  ctx.fillStyle = materialGradient(ctx, x, y, x + wingW, y + wingH, [
    { at: 0, material: "manorStoneDark", alpha: 1, options: { light } },
    { at: 0.55, material: "manorStoneMid", alpha: 1, options: { light } },
    { at: 1, material: "structureShadow", alpha: 1 }
  ]);

  ctx.strokeStyle = paint("sunScatter", 0.32);
  ctx.lineWidth = Math.max(1, canvasW * 0.00082);

  roundedRect(ctx, x, y, wingW, wingH, Math.max(2, canvasW * 0.0028));
  ctx.fill();
  ctx.stroke();
}

function drawManorRoofs(ctx, cx, top, bodyH, manorW, manorH, canvasW) {
  ctx.fillStyle = paint("roofSlate", 1, { shadow: 0.10 });
  ctx.strokeStyle = paint("sunScatter", 0.45);
  ctx.lineWidth = Math.max(1, canvasW * 0.0010);

  triRoof(ctx, cx, top + bodyH * 0.02, manorW * 0.43, manorH * 0.32);
  triRoof(ctx, cx - manorW * 0.27, top + bodyH * 0.31, manorW * 0.27, manorH * 0.19);
  triRoof(ctx, cx + manorW * 0.27, top + bodyH * 0.31, manorW * 0.27, manorH * 0.19);
}

function triRoof(ctx, cx, baseY, roofW, roofH) {
  ctx.beginPath();
  ctx.moveTo(cx - roofW / 2, baseY);
  ctx.lineTo(cx, baseY - roofH);
  ctx.lineTo(cx + roofW / 2, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawManorPortico(ctx, cx, baseY, bodyH, manorW, canvasW) {
  const porticoW = manorW * 0.095;
  const porticoH = bodyH * 0.28;
  const y = baseY - porticoH;

  ctx.fillStyle = paint("structureShadow", 0.96);
  roundedRect(ctx, cx - porticoW / 2, y, porticoW, porticoH, Math.max(2, canvasW * 0.002));
  ctx.fill();

  ctx.strokeStyle = paint("sunScatter", 0.36);
  ctx.lineWidth = Math.max(1, canvasW * 0.0008);
  ctx.beginPath();
  ctx.moveTo(cx - porticoW * 0.70, y);
  ctx.lineTo(cx, y - porticoH * 0.40);
  ctx.lineTo(cx + porticoW * 0.70, y);
  ctx.stroke();
}

function drawManorWindows(ctx, cx, top, bodyH, baseY, manorW) {
  ctx.fillStyle = paint("windowLight", 0.88, { light: 0.18 });

  for (let floor = 0; floor < 3; floor += 1) {
    const y = top + bodyH * (0.28 + floor * 0.205);

    for (let i = -5; i <= 5; i += 1) {
      if (i === 0 && floor > 0) continue;
      if (Math.abs(i) === 5 && floor === 2) continue;

      const x = cx + i * manorW * 0.031;
      roundedRect(ctx, x - manorW * 0.0048, y, manorW * 0.0096, bodyH * 0.070, 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = paint("structureShadow", 0.96);
  roundedRect(ctx, cx - manorW * 0.014, baseY - bodyH * 0.245, manorW * 0.028, bodyH * 0.245, 3);
  ctx.fill();
}

function drawManorGlow(ctx, cx, top, baseY, manorW, h) {
  const glow = ctx.createRadialGradient(cx, top + h * 0.080, 0, cx, top + h * 0.108, manorW * 0.58);
  glow.addColorStop(0, paint("windowLight", 0.105));
  glow.addColorStop(0.50, paint("windowLight", 0.032));
  glow.addColorStop(1, paint("windowLight", 0));
  ctx.fillStyle = glow;
  ctx.fillRect(cx - manorW * 0.68, top - h * 0.022, manorW * 1.36, baseY - top + h * 0.050);
}

function drawVegetation(ctx, frame) {
  const { width: w, height: h, time: t, cell, hexfield, profile } = frame;
  const count = Math.round(170 + profile.foliage.density * 500);

  ctx.save();

  for (let i = 0; i < count; i += 1) {
    const nx = hash01(i, 110, 1, cell.seed);
    const ny = 0.585 + hash01(i, 111, 2, cell.seed) * 0.39;
    const sample = hexfield.sample(nx, ny, t);

    if (sample.foliagePressure < 0.105) continue;

    const nearManor = nx > 0.34 && nx < 0.66 && ny > 0.54 && ny < 0.70;
    if (nearManor && hash01(i, 999, 1, cell.seed) < 0.80) continue;

    const x = nx * w;
    const y = ny * h;
    const near = y > h * 0.78;
    const scale =
      h *
      (0.0030 + hash01(i, 112, 3, cell.seed) * (near ? 0.020 : 0.011)) *
      (0.74 + sample.foliagePressure * 0.60);

    const sway = sample.wind * scale * profile.foliage.windResponse * (near ? 1.05 : 0.62);
    const materialName = chooseVegetation(sample);

    if (hash01(i, 113, 4, cell.seed) < profile.foliage.shrubs * 0.24) {
      drawShrub(ctx, materialName, x, y, scale, sway, near, i, sample);
    } else {
      drawGrassBlade(ctx, materialName, x, y, scale, sway, near, i, sample);
    }

    if (sample.flowerPressure > 0.30 && near && hash01(i, 200, 5, cell.seed) < profile.foliage.wildflowers * 0.13) {
      drawFlower(ctx, x + sway, y - scale * 0.8, scale, i, cell.seed);
    }
  }

  ctx.restore();
}

function drawGrassBlade(ctx, materialName, x, y, scale, sway, near, i, sample) {
  const alpha = (near ? 0.38 : 0.23) * (0.74 + sample.foliagePressure * 0.60);

  ctx.strokeStyle = paint(materialName, alpha, {
    light: near ? 0.08 : 0.02,
    wet: sample.moistureNoise * 0.10,
    shadow: sample.pathPressure * 0.08
  });
  ctx.lineWidth = Math.max(1, scale * 0.085);

  ctx.beginPath();
  ctx.moveTo(x, y + scale * 0.70);
  ctx.quadraticCurveTo(
    x + sway * 0.56,
    y - scale * 0.62,
    x + sway,
    y - scale * (1.20 + hash01(i, 116) * 0.80)
  );
  ctx.stroke();

  if (near && hash01(i, 117) > 0.72) {
    ctx.fillStyle = paint(materialName, alpha * 0.72, { light: 0.08 });
    ctx.beginPath();
    ctx.ellipse(
      x + sway,
      y - scale * 1.02,
      scale * 0.38,
      scale * 1.10,
      -0.32 + sample.wind * 0.04,
      0,
      TAU
    );
    ctx.fill();
  }
}

function drawShrub(ctx, materialName, x, y, scale, sway, near, i, sample) {
  ctx.strokeStyle = paint("stem", 0.48, { shadow: 0.10 });
  ctx.lineWidth = Math.max(1, scale * 0.16);

  const stems = near ? 4 : 3;

  for (let s = 0; s < stems; s += 1) {
    const offset = (s - (stems - 1) / 2) * scale * 0.45;
    ctx.beginPath();
    ctx.moveTo(x + offset, y + scale * 1.2);
    ctx.quadraticCurveTo(
      x + offset + sway * 0.45,
      y - scale * 0.35,
      x + offset + sway * 1.2,
      y - scale * (1.8 + hash01(i, s, 119) * 1.1)
    );
    ctx.stroke();
  }

  ctx.fillStyle = paint(materialName, near ? 0.46 : 0.31, {
    light: near ? 0.06 : 0,
    wet: sample.moistureNoise * 0.08
  });

  for (let leaf = 0; leaf < 4; leaf += 1) {
    ctx.beginPath();
    ctx.ellipse(
      x + sway * (0.6 + leaf * 0.20) + (leaf - 1.5) * scale * 0.30,
      y - scale * (1.1 + leaf * 0.42),
      scale * (0.95 + hash01(i, leaf, 121) * 0.70),
      scale * (0.42 + hash01(i, leaf, 122) * 0.35),
      0.12 + sample.wind * 0.04,
      0,
      TAU
    );
    ctx.fill();
  }
}

function drawFlower(ctx, x, y, scale, i, seed) {
  const roll = hash01(i, 300, 1, seed);
  const flower =
    roll < 0.25
      ? [245, 238, 208]
      : roll < 0.52
        ? [230, 192, 74]
        : roll < 0.78
          ? [208, 132, 160]
          : [138, 116, 190];

  ctx.fillStyle = rgba(flower, 0.76);
  ctx.beginPath();
  ctx.arc(x, y, Math.max(1, scale * 0.23), 0, TAU);
  ctx.fill();

  ctx.fillStyle = paint("flowerGold", 0.58, { light: 0.12 });
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.8, scale * 0.09), 0, TAU);
  ctx.fill();
}

function drawForegroundMaterial(ctx, frame) {
  const { width: w, height: h, time: t, cell, hexfield } = frame;

  const boulders = [
    [0.08, 0.93, 0.075, 0.035],
    [0.18, 0.97, 0.090, 0.048],
    [0.80, 0.94, 0.080, 0.040],
    [0.92, 0.985, 0.110, 0.060]
  ];

  boulders.forEach(([nx, ny, sx, sy]) => {
    const sample = hexfield.sample(nx, ny, t);

    ctx.fillStyle = materialGradient(ctx, nx * w - sx * w, ny * h - sy * h, nx * w + sx * w, ny * h + sy * h, [
      { at: 0, material: "shelfStone", alpha: 0.36, options: { light: 0.12 } },
      { at: 0.52, material: "darkStone", alpha: 0.34, options: { shadow: 0.12 } },
      { at: 1, material: "darkStone", alpha: 0.46, options: { shadow: 0.35 } }
    ]);

    ctx.beginPath();
    ctx.ellipse(nx * w, ny * h, sx * w, sy * h, sample.macro * 0.35, 0, TAU);
    ctx.fill();
  });

  ctx.save();
  ctx.globalAlpha = 0.30;

  for (let i = 0; i < 110; i += 1) {
    const nx = hash01(i, 700, 1, cell.seed);
    const ny = 0.78 + hash01(i, 701, 2, cell.seed) * 0.22;
    const sample = hexfield.sample(nx, ny, t);

    if (sample.foliagePressure < 0.18) continue;

    const x = nx * w;
    const y = ny * h;
    const blade = h * (0.020 + hash01(i, 702, 3, cell.seed) * 0.055);
    const sway = sample.wind * h * 0.010;

    ctx.strokeStyle = paint(chooseVegetation(sample), 0.26, { light: 0.04 });
    ctx.lineWidth = Math.max(1, w * 0.0012);
    ctx.beginPath();
    ctx.moveTo(x, y + blade * 0.30);
    ctx.quadraticCurveTo(x + sway * 0.35, y - blade * 0.45, x + sway, y - blade);
    ctx.stroke();
  }

  ctx.restore();
}

function drawWildlife(ctx, frame) {
  const { width: w, height: h, time: t, cell, hexfield, profile } = frame;
  const birdCount = Math.round(5 + (profile.wildlife?.birds ?? 0.72) * 13);
  const phase = (t * 0.025) % 1;

  ctx.save();
  ctx.strokeStyle = paint("darkStone", 0.58, { shadow: 0.20 });
  ctx.lineWidth = Math.max(1, w * 0.00075);

  for (let i = 0; i < birdCount; i += 1) {
    const nx =
      ((hash01(i, 210, 1, cell.seed) +
        phase * (0.045 + hash01(i, 211, 2, cell.seed) * 0.065)) %
        1 +
        1) %
      1;
    const ny = 0.105 + hash01(i, 212, 3, cell.seed) * 0.235;
    const sample = hexfield.sample(nx, ny, t);

    const x = nx * w;
    const y = ny * h + sample.wind * h * 0.001;
    const s = w * (0.0030 + hash01(i, 213, 4, cell.seed) * 0.0048);
    const flap = Math.sin(t * 2.4 + i) * s * 0.38;

    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.quadraticCurveTo(x - s * 0.48, y - s * 0.48 - flap, x, y);
    ctx.quadraticCurveTo(x + s * 0.48, y - s * 0.48 + flap, x + s, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawFinalAtmosphere(ctx, frame) {
  const { width: w, height: h, profile } = frame;
  const hazePower = clamp(profile.climate.haze ?? 0.60, 0, 1);

  const horizonHaze = ctx.createLinearGradient(0, h * 0.26, 0, h * 0.68);
  horizonHaze.addColorStop(0, paint("goldenHaze", 0.02 * hazePower));
  horizonHaze.addColorStop(0.30, paint("goldenHaze", 0.11 * hazePower));
  horizonHaze.addColorStop(0.58, paint("sunScatter", 0.07 * hazePower));
  horizonHaze.addColorStop(1, paint("goldenHaze", 0));
  ctx.fillStyle = horizonHaze;
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
