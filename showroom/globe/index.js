const FIBONACCI_SEQUENCE = Object.freeze([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]);
const RUNTIME_FIELD_SIZE = 256;
const TAU = Math.PI * 2;
const MAX_DPR = 1.5;

const GLOBE_SELECTOR_STATE = Object.freeze({
  contract: "SHOWROOM_GLOBE_MULTI_NODAL_PHYSICAL_MATERIAL_RESTORATION_TNT_v10",
  previousContract: "SHOWROOM_GLOBE_SATELLITE_PLANETARY_VIEW_RENEWAL_TNT_v9",
  route: "/showroom/globe/",
  role: "globe-system-gateway-selector",
  gatewayAuthority: true,
  visualScaleAuthority: true,
  multiNodalVisualAnchors: true,
  physicalGraphicMaterial: true,
  materialAsset: true,
  hydrationFile: true,
  fibonacciRuntime: true,
  lattice256Runtime: true,
  runtimeFieldSize: RUNTIME_FIELD_SIZE,
  fibonacciSequence: FIBONACCI_SEQUENCE,
  runtimeMotionLaw: "fibonacci-within-256-lattice",
  materialSource: "multi-nodal-physical-material:v10",
  opaqueGlobeBody: true,
  cartoonFallbackPrimary: false,
  splitSeasonGlobe: false,
  satelliteAbstraction: false,
  dayNightSplitFace: false,
  groundLevelBuildActive: false,
  diamondInstrument: false,
  publicReceiptsVisible: false,
  generatedImage: false,
  graphicBox: false,
  heavyRuntimeLoaded: false,
  childRoutes: Object.freeze({
    earth: "/showroom/globe/earth/",
    "h-earth": "/showroom/globe/h-earth/",
    audralia: "/showroom/globe/audralia/"
  })
});

const BODY_CONFIG = Object.freeze({
  earth: Object.freeze({
    key: "earth",
    title: "Earth",
    subtitle: "Reference Body · hydrated Fibonacci runtime",
    openText: "Open Earth",
    href: "/showroom/globe/earth/",
    anchor: "EARTH_HYDRATED_OBJECT",
    palette: Object.freeze({
      base: [25, 88, 118],
      base2: [10, 52, 88],
      deep: [4, 17, 38],
      material: [165, 146, 92],
      material2: [206, 190, 135],
      mineral: [64, 110, 118],
      scar: [12, 38, 48],
      shell: [180, 220, 250],
      glow: [112, 186, 245],
      highlight: [236, 240, 218]
    }),
    density: Object.freeze({
      patches: 28,
      veins: 20,
      craters: 16,
      haze: 16,
      glints: 6
    })
  }),

  "h-earth": Object.freeze({
    key: "h-earth",
    title: "H-Earth",
    subtitle: "Hybrid Earth · physical dry material",
    openText: "Open H-Earth",
    href: "/showroom/globe/h-earth/",
    anchor: "H_EARTH_PHYSICAL_DRY_MATERIAL",
    palette: Object.freeze({
      base: [132, 126, 88],
      base2: [75, 88, 72],
      deep: [16, 24, 22],
      material: [185, 170, 102],
      material2: [222, 204, 132],
      mineral: [50, 92, 82],
      scar: [10, 28, 22],
      shell: [194, 230, 210],
      glow: [150, 232, 180],
      highlight: [236, 224, 166]
    }),
    density: Object.freeze({
      patches: 36,
      veins: 32,
      craters: 26,
      haze: 10,
      glints: 7
    })
  }),

  audralia: Object.freeze({
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World · physical material",
    openText: "Open Audralia",
    href: "/showroom/globe/audralia/",
    anchor: "AUDRALIA_CONSTRUCTED_MATERIAL",
    palette: Object.freeze({
      base: [92, 68, 104],
      base2: [54, 42, 82],
      deep: [16, 12, 38],
      material: [142, 98, 90],
      material2: [194, 134, 116],
      mineral: [96, 76, 132],
      scar: [34, 18, 50],
      shell: [226, 214, 255],
      glow: [196, 158, 248],
      highlight: [230, 176, 148]
    }),
    density: Object.freeze({
      patches: 34,
      veins: 34,
      craters: 24,
      haze: 12,
      glints: 6
    })
  })
});

const state = {
  body: "earth",
  mode: "auto",
  yaw: 0.16,
  pitch: -0.06,
  velocityYaw: 0,
  velocityPitch: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,
  lastTime: 0,
  raf: 0,
  dpr: 1,
  width: 0,
  height: 0,
  needsRender: true,
  materials: Object.create(null),
  frames: Object.create(null),
  runtimeAddress: 0,
  fibonacciBand: 8
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rgb(values, alpha = 1) {
  return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
}

function mixColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];
}

function seededUnit(index, salt) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1 + 1) % 1;
}

function seededSigned(index, salt) {
  return seededUnit(index, salt) * 2 - 1;
}

function makeCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function resizeCanvas(canvas) {
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.floor(box.width * dpr));
  const height = Math.max(520, Math.floor(box.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    state.width = width;
    state.height = height;
    state.dpr = dpr;
    state.needsRender = true;
  }
}

function getLayoutMetrics(width, height) {
  const cssWidth = width / state.dpr;
  const isMobile = cssWidth <= 560;
  const topBand = isMobile ? 188 * state.dpr : 176 * state.dpr;
  const bottomBand = isMobile ? 214 * state.dpr : 198 * state.dpr;
  const available = Math.max(220 * state.dpr, height - topBand - bottomBand);

  const radius = Math.min(
    width * (isMobile ? 0.345 : 0.380),
    available * (isMobile ? 0.510 : 0.535)
  );

  return Object.freeze({
    isMobile,
    topBand,
    bottomBand,
    globeCenterX: width * 0.5,
    globeCenterY: topBand + available * 0.48,
    radius
  });
}

function fibonacciBandForMode() {
  if (state.mode === "stable") return 3;
  if (state.mode === "soft") return 21;
  return 13;
}

function resolveRuntimeAddress() {
  const bodyIndex = Object.keys(BODY_CONFIG).indexOf(state.body);
  const yawBucket = Math.round((((state.yaw % TAU) + TAU) % TAU) / TAU * 64) % 64;
  const pitchBucket = Math.round(((state.pitch + 0.6) / 1.2) * 15);
  const modeBucket = state.mode === "stable" ? 0 : state.mode === "soft" ? 1 : 2;
  state.runtimeAddress = (bodyIndex * 64 + yawBucket + pitchBucket * 4 + modeBucket) % RUNTIME_FIELD_SIZE;
  return state.runtimeAddress;
}

function buildMaterial(bodyKey) {
  if (state.materials[bodyKey]) return state.materials[bodyKey];

  const config = BODY_CONFIG[bodyKey] || BODY_CONFIG.earth;
  const material = {
    key: bodyKey,
    anchor: config.anchor,
    source: `multi-nodal-physical-material:v10:${bodyKey}`,
    patches: [],
    veins: [],
    craters: [],
    haze: [],
    glints: []
  };

  for (let i = 0; i < config.density.patches; i += 1) {
    material.patches.push(Object.freeze({
      lat: seededSigned(i, bodyKey.length + 10) * 1.10,
      lon: seededSigned(i, bodyKey.length + 11) * Math.PI,
      rx: 0.08 + seededUnit(i, bodyKey.length + 12) * 0.20,
      ry: 0.04 + seededUnit(i, bodyKey.length + 13) * 0.16,
      angle: seededUnit(i, bodyKey.length + 14) * TAU,
      tone: seededUnit(i, bodyKey.length + 15)
    }));
  }

  for (let i = 0; i < config.density.veins; i += 1) {
    const points = [];
    const baseLat = seededSigned(i, bodyKey.length + 40) * 1.02;
    const baseLon = seededSigned(i, bodyKey.length + 41) * Math.PI;
    const length = 0.26 + seededUnit(i, bodyKey.length + 42) * 0.64;
    const bend = seededSigned(i, bodyKey.length + 43) * 0.18;

    for (let j = 0; j < 11; j += 1) {
      const t = j / 10;
      points.push(Object.freeze({
        lat: clamp(baseLat + (t - 0.5) * length * 0.42 + Math.sin(t * Math.PI) * bend, -1.34, 1.34),
        lon: baseLon + (t - 0.5) * length + Math.sin(t * TAU) * 0.035
      }));
    }

    material.veins.push(Object.freeze({
      points: Object.freeze(points),
      width: 0.004 + seededUnit(i, bodyKey.length + 44) * 0.012,
      tone: seededUnit(i, bodyKey.length + 45)
    }));
  }

  for (let i = 0; i < config.density.craters; i += 1) {
    material.craters.push(Object.freeze({
      lat: seededSigned(i, bodyKey.length + 70) * 1.00,
      lon: seededSigned(i, bodyKey.length + 71) * Math.PI,
      r: 0.020 + seededUnit(i, bodyKey.length + 72) * 0.058,
      stretch: 0.74 + seededUnit(i, bodyKey.length + 73) * 0.55,
      angle: seededUnit(i, bodyKey.length + 74) * TAU,
      tone: seededUnit(i, bodyKey.length + 75)
    }));
  }

  for (let i = 0; i < config.density.haze; i += 1) {
    material.haze.push(Object.freeze({
      lat: seededSigned(i, bodyKey.length + 100) * 0.86,
      lon: seededSigned(i, bodyKey.length + 101) * Math.PI,
      rx: 0.10 + seededUnit(i, bodyKey.length + 102) * 0.22,
      ry: 0.010 + seededUnit(i, bodyKey.length + 103) * 0.028,
      angle: seededUnit(i, bodyKey.length + 104) * TAU,
      alpha: 0.020 + seededUnit(i, bodyKey.length + 105) * 0.045
    }));
  }

  for (let i = 0; i < config.density.glints; i += 1) {
    material.glints.push(Object.freeze({
      lat: seededSigned(i, bodyKey.length + 130) * 0.86,
      lon: seededSigned(i, bodyKey.length + 131) * Math.PI,
      size: 0.014 + seededUnit(i, bodyKey.length + 132) * 0.030,
      tone: seededUnit(i, bodyKey.length + 133)
    }));
  }

  state.materials[bodyKey] = Object.freeze({
    key: material.key,
    anchor: material.anchor,
    source: material.source,
    patches: Object.freeze(material.patches),
    veins: Object.freeze(material.veins),
    craters: Object.freeze(material.craters),
    haze: Object.freeze(material.haze),
    glints: Object.freeze(material.glints)
  });

  return state.materials[bodyKey];
}

function project(lat, lon, yaw, pitch, cx, cy, radius) {
  const adjustedLon = lon + yaw;
  const cosLat = Math.cos(lat);
  const x0 = Math.cos(adjustedLon) * cosLat;
  const y0 = Math.sin(lat);
  const z0 = Math.sin(adjustedLon) * cosLat;

  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y1 = y0 * cp - z0 * sp;
  const z1 = y0 * sp + z0 * cp;

  const visible = z1 > -0.14;
  const depth = clamp((z1 + 1) * 0.5, 0, 1);
  const perspective = 0.93 + depth * 0.12;

  return Object.freeze({
    x: cx + x0 * radius * perspective,
    y: cy - y1 * radius * perspective,
    z: z1,
    depth,
    visible
  });
}

function frameBucket(value, count) {
  return ((Math.round((((value % TAU) + TAU) % TAU) / TAU * count) % count) + count) % count;
}

function bucketPose(yaw, pitch) {
  const yawBuckets = state.mode === "stable" ? 34 : state.mode === "soft" ? 89 : 55;
  const pitchBuckets = 13;
  const yawBucket = frameBucket(yaw, yawBuckets);
  const pitchBucket = Math.round(((clamp(pitch, -0.60, 0.60) + 0.60) / 1.20) * (pitchBuckets - 1));

  return Object.freeze({
    yaw: (yawBucket / yawBuckets) * TAU,
    pitch: (pitchBucket / (pitchBuckets - 1)) * 1.20 - 0.60,
    yawBuckets,
    pitchBucket
  });
}

function getFrameKey(bodyKey, radius, yaw, pitch) {
  const pose = bucketPose(yaw, pitch);
  const radiusBucket = Math.round(radius / 10) * 10;
  const fibonacciBand = fibonacciBandForMode();
  return `${bodyKey}:${radiusBucket}:${pose.yawBuckets}:${frameBucket(yaw, pose.yawBuckets)}:${pose.pitchBucket}:${fibonacciBand}`;
}

function getFrame(bodyKey, radius, yaw, pitch) {
  const key = getFrameKey(bodyKey, radius, yaw, pitch);
  if (state.frames[key]) return state.frames[key];

  const frame = buildFrame(bodyKey, radius, yaw, pitch);
  state.frames[key] = frame;
  trimFrames();
  return frame;
}

function trimFrames() {
  const keys = Object.keys(state.frames);
  if (keys.length <= 55) return;

  for (let i = 0; i < keys.length - 55; i += 1) {
    delete state.frames[keys[i]];
  }
}

function buildFrame(bodyKey, radius, yaw, pitch) {
  const config = BODY_CONFIG[bodyKey] || BODY_CONFIG.earth;
  const material = buildMaterial(bodyKey);
  const pose = bucketPose(yaw, pitch);
  const pad = Math.ceil(radius * 0.30);
  const size = Math.ceil(radius * 2 + pad * 2);
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext("2d", { alpha: true });
  const cx = size * 0.5;
  const cy = size * 0.5;

  drawPhysicalAura(ctx, config, cx, cy, radius);
  drawOpaquePhysicalBody(ctx, config, cx, cy, radius);
  drawPhysicalPatches(ctx, config, material, cx, cy, radius, pose.yaw, pose.pitch);
  drawPhysicalVeins(ctx, config, material, cx, cy, radius, pose.yaw, pose.pitch);
  drawPhysicalCraters(ctx, config, material, cx, cy, radius, pose.yaw, pose.pitch);
  drawHydratedObjectShell(ctx, config, material, cx, cy, radius, pose.yaw, pose.pitch);
  drawPhysicalBodyLighting(ctx, config, cx, cy, radius);
  drawHydrationAtmosphere(ctx, config, cx, cy, radius);
  drawSurfaceGlints(ctx, config, material, cx, cy, radius, pose.yaw, pose.pitch);

  return Object.freeze({
    source: `multi-nodal-physical-material:v10:${bodyKey}`,
    anchor: config.anchor,
    canvas,
    size,
    radius,
    ready: true
  });
}

function drawPhysicalAura(ctx, config, cx, cy, radius) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const outer = ctx.createRadialGradient(cx, cy, radius * 0.74, cx, cy, radius * 1.42);
  outer.addColorStop(0.00, "rgba(255,255,255,0)");
  outer.addColorStop(0.48, rgb(config.palette.glow, 0.08));
  outer.addColorStop(0.76, rgb(config.palette.glow, 0.20));
  outer.addColorStop(1.00, "rgba(255,255,255,0)");

  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.42, 0, TAU);
  ctx.fill();

  ctx.restore();
}

function drawOpaquePhysicalBody(ctx, config, cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  const base = ctx.createRadialGradient(
    cx - radius * 0.24,
    cy - radius * 0.30,
    radius * 0.06,
    cx + radius * 0.06,
    cy + radius * 0.10,
    radius * 1.10
  );

  base.addColorStop(0.00, rgb(mixColor(config.palette.base, config.palette.highlight, 0.18), 1));
  base.addColorStop(0.28, rgb(config.palette.base, 1));
  base.addColorStop(0.58, rgb(config.palette.base2, 1));
  base.addColorStop(0.84, rgb(mixColor(config.palette.base2, config.palette.deep, 0.55), 1));
  base.addColorStop(1.00, rgb(config.palette.deep, 1));

  ctx.fillStyle = base;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  for (let i = 0; i < 42; i += 1) {
    const angle = seededUnit(i, config.key.length + 300) * TAU;
    const dist = Math.sqrt(seededUnit(i, config.key.length + 301)) * radius * 0.92;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const r = radius * (0.030 + seededUnit(i, config.key.length + 302) * 0.115);
    const color = i % 3 === 0 ? config.palette.material : i % 3 === 1 ? config.palette.mineral : config.palette.material2;

    const spot = ctx.createRadialGradient(x, y, 0, x, y, r);
    spot.addColorStop(0.00, rgb(color, 0.14));
    spot.addColorStop(0.72, rgb(color, 0.035));
    spot.addColorStop(1.00, "rgba(255,255,255,0)");

    ctx.fillStyle = spot;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawPhysicalPatches(ctx, config, material, cx, cy, radius, yaw, pitch) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  for (const patch of material.patches) {
    const p = project(patch.lat, patch.lon, yaw, pitch, cx, cy, radius);
    if (!p.visible) continue;

    const visible = clamp((p.z + 0.14) / 1.14, 0, 1);
    const rx = patch.rx * radius * (0.74 + p.depth * 0.24);
    const ry = patch.ry * radius * (0.70 + p.depth * 0.18);
    const toneA = mixColor(config.palette.material, config.palette.material2, patch.tone * 0.65);
    const toneB = mixColor(config.palette.mineral, config.palette.deep, patch.tone * 0.40);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(patch.angle + yaw * 0.035);

    const fill = ctx.createRadialGradient(-rx * 0.18, -ry * 0.24, Math.max(3, rx * 0.06), 0, 0, Math.max(rx, ry));
    fill.addColorStop(0.00, rgb(mixColor(toneA, config.palette.highlight, 0.20), 0.62 * visible));
    fill.addColorStop(0.42, rgb(toneA, 0.56 * visible));
    fill.addColorStop(0.86, rgb(toneB, 0.38 * visible));
    fill.addColorStop(1.00, "rgba(255,255,255,0)");

    ctx.fillStyle = fill;
    drawOrganicPatch(ctx, rx, ry, patch.tone * 11 + patch.angle);
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}

function drawOrganicPatch(ctx, rx, ry, seed) {
  ctx.beginPath();

  for (let i = 0; i <= 86; i += 1) {
    const t = (i / 86) * TAU;
    const wobble = 1
      + 0.14 * Math.sin(t * 3 + seed * 0.31)
      + 0.07 * Math.cos(t * 5 - seed * 0.17)
      + 0.04 * Math.sin(t * 8 + seed * 0.13);

    const x = Math.cos(t) * rx * wobble;
    const y = Math.sin(t) * ry * wobble;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.closePath();
}

function drawPhysicalVeins(ctx, config, material, cx, cy, radius, yaw, pitch) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  for (const vein of material.veins) {
    const points = vein.points
      .map((point) => project(point.lat, point.lon, yaw, pitch, cx, cy, radius))
      .filter((point) => point.visible);

    if (points.length < 3) continue;

    const depth = points.reduce((sum, point) => sum + point.depth, 0) / points.length;
    const alpha = (0.18 + depth * 0.26) * (0.65 + vein.tone * 0.45);

    ctx.strokeStyle = rgb(config.palette.scar, alpha);
    ctx.lineWidth = Math.max(1.05, radius * vein.width);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = rgb(config.palette.shell, alpha * 0.10);
    ctx.lineWidth = Math.max(0.45, radius * vein.width * 0.26);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

function drawPhysicalCraters(ctx, config, material, cx, cy, radius, yaw, pitch) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  for (const crater of material.craters) {
    const p = project(crater.lat, crater.lon, yaw, pitch, cx, cy, radius);
    if (!p.visible) continue;

    const visible = clamp((p.z + 0.14) / 1.14, 0, 1);
    const r = crater.r * radius * (0.78 + p.depth * 0.40);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(crater.angle);
    ctx.scale(crater.stretch, 1);

    const bowl = ctx.createRadialGradient(0, 0, r * 0.06, 0, 0, r);
    bowl.addColorStop(0.00, rgb(config.palette.deep, 0.30 * visible));
    bowl.addColorStop(0.48, rgb(config.palette.scar, 0.22 * visible));
    bowl.addColorStop(0.68, rgb(config.palette.highlight, 0.14 * visible));
    bowl.addColorStop(1.00, "rgba(255,255,255,0)");

    ctx.fillStyle = bowl;
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.68, 0, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = rgb(config.palette.highlight, 0.10 * visible);
    ctx.lineWidth = Math.max(0.55, radius * 0.0022);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.78, r * 0.50, 0, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

function drawHydratedObjectShell(ctx, config, material, cx, cy, radius, yaw, pitch) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();
  ctx.globalCompositeOperation = "screen";

  for (const haze of material.haze) {
    const p = project(haze.lat, haze.lon, yaw, pitch, cx, cy, radius);
    if (!p.visible) continue;

    const visible = clamp((p.z + 0.14) / 1.14, 0, 1);
    const rx = haze.rx * radius;
    const ry = haze.ry * radius;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(haze.angle);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0.00, rgb(config.palette.shell, haze.alpha * visible));
    g.addColorStop(0.58, rgb(config.palette.shell, haze.alpha * 0.28 * visible));
    g.addColorStop(1.00, "rgba(255,255,255,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function drawPhysicalBodyLighting(ctx, config, cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  const glass = ctx.createRadialGradient(
    cx - radius * 0.34,
    cy - radius * 0.38,
    radius * 0.06,
    cx,
    cy,
    radius * 1.12
  );

  glass.addColorStop(0.00, "rgba(255,255,255,0.18)");
  glass.addColorStop(0.24, "rgba(255,255,255,0.040)");
  glass.addColorStop(0.58, "rgba(255,255,255,0.000)");
  glass.addColorStop(0.84, "rgba(0,0,0,0.16)");
  glass.addColorStop(1.00, "rgba(0,0,0,0.42)");

  ctx.fillStyle = glass;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();
}

function drawHydrationAtmosphere(ctx, config, cx, cy, radius) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const rim = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.18);
  rim.addColorStop(0.00, "rgba(255,255,255,0)");
  rim.addColorStop(0.52, rgb(config.palette.glow, 0.08));
  rim.addColorStop(0.74, rgb(config.palette.glow, 0.20));
  rim.addColorStop(0.88, rgb(config.palette.shell, 0.24));
  rim.addColorStop(1.00, "rgba(255,255,255,0)");

  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.18, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = rgb(config.palette.shell, 0.26);
  ctx.lineWidth = Math.max(1, radius * 0.0058);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.006, 0, TAU);
  ctx.stroke();

  ctx.restore();
}

function drawSurfaceGlints(ctx, config, material, cx, cy, radius, yaw, pitch) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const glint of material.glints) {
    const p = project(glint.lat, glint.lon, yaw, pitch, cx, cy, radius);
    if (!p.visible || p.depth < 0.38) continue;

    const size = glint.size * radius;
    const alpha = 0.05 + p.depth * 0.10;

    ctx.strokeStyle = rgb(config.palette.shell, alpha);
    ctx.lineWidth = Math.max(0.5, radius * 0.0015);
    ctx.beginPath();
    ctx.moveTo(p.x - size, p.y);
    ctx.lineTo(p.x + size, p.y);
    ctx.moveTo(p.x, p.y - size);
    ctx.lineTo(p.x, p.y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function drawStageBackground(ctx, width, height, config) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "rgba(3, 10, 22, 1)");
  bg.addColorStop(0.52, "rgba(7, 18, 36, 1)");
  bg.addColorStop(1, "rgba(1, 5, 13, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const metrics = getLayoutMetrics(width, height);
  const halo = ctx.createRadialGradient(
    metrics.globeCenterX,
    metrics.globeCenterY,
    metrics.radius * 0.24,
    metrics.globeCenterX,
    metrics.globeCenterY,
    metrics.radius * 2.10
  );
  halo.addColorStop(0, rgb(config.palette.glow, 0.12));
  halo.addColorStop(0.42, rgb(config.palette.glow, 0.052));
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);

  drawStars(ctx, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();

  for (let i = 0; i < 44; i += 1) {
    const x = seededUnit(i, 1) * width;
    const y = seededUnit(i, 2) * height;
    const alpha = 0.045 + seededUnit(i, 3) * 0.13;
    const size = i % 13 === 0 ? 5.2 : i % 5 === 0 ? 2.5 : 1;

    ctx.strokeStyle = `rgba(235,244,255,${alpha})`;
    ctx.lineWidth = Math.max(1, width * 0.00075);
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGroundGlow(ctx, width, height, config) {
  const metrics = getLayoutMetrics(width, height);
  const radius = metrics.radius;
  const cx = metrics.globeCenterX;
  const cy = metrics.globeCenterY;

  const glow = ctx.createRadialGradient(cx, cy + radius * 1.08, radius * 0.02, cx, cy + radius * 1.08, radius * 0.44);
  glow.addColorStop(0, rgb(config.palette.glow, 0.10));
  glow.addColorStop(0.46, "rgba(82,109,146,0.08)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(cx, cy + radius * 1.08, radius * 0.42, radius * 0.075, 0, 0, TAU);
  ctx.fill();
}

function render(canvas, ctx) {
  const config = BODY_CONFIG[state.body] || BODY_CONFIG.earth;
  const width = canvas.width;
  const height = canvas.height;
  const metrics = getLayoutMetrics(width, height);
  const frame = getFrame(state.body, metrics.radius, state.yaw, state.pitch);

  ctx.clearRect(0, 0, width, height);
  drawStageBackground(ctx, width, height, config);
  drawGroundGlow(ctx, width, height, config);

  const x = metrics.globeCenterX - frame.size * 0.5;
  const y = metrics.globeCenterY - frame.size * 0.5;

  ctx.drawImage(frame.canvas, x, y);

  state.needsRender = false;
}

function updateMotion(dt) {
  let changed = false;
  const fibonacciBand = fibonacciBandForMode();
  state.fibonacciBand = fibonacciBand;

  if (!state.dragging) {
    const priorYaw = state.yaw;
    const priorPitch = state.pitch;

    state.yaw += state.velocityYaw;
    state.pitch = clamp(state.pitch + state.velocityPitch, -0.60, 0.60);

    const decayBase = state.mode === "soft" ? 0.986 : state.mode === "stable" ? 0.972 : 0.978;
    const fibonacciDecay = Math.pow(decayBase, (dt * 60) / Math.max(1, fibonacciBand / 8));

    state.velocityYaw *= fibonacciDecay;
    state.velocityPitch *= fibonacciDecay;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;

    if (state.mode === "auto" && state.velocityYaw === 0 && state.velocityPitch === 0) {
      state.yaw += dt * (1 / 55);
    }

    changed = changed || Math.abs(priorYaw - state.yaw) > 0.00001 || Math.abs(priorPitch - state.pitch) > 0.00001;
  }

  resolveRuntimeAddress();

  if (changed) state.needsRender = true;
}

function step(time, canvas, ctx) {
  const dt = state.lastTime ? clamp((time - state.lastTime) / 1000, 0, 0.05) : 0;
  state.lastTime = time;

  resizeCanvas(canvas);
  updateMotion(dt);

  if (state.needsRender) render(canvas, ctx);

  state.raf = requestAnimationFrame((next) => step(next, canvas, ctx));
}

function bindPointer(stage) {
  stage.addEventListener("pointerdown", (event) => {
    const now = performance.now();

    if (now - state.lastTap < 320) resetView();

    state.lastTap = now;
    state.dragging = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.needsRender = true;

    stage.setPointerCapture?.(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.pointerX;
    const dy = event.clientY - state.pointerY;

    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    const sensitivity = state.mode === "stable" ? 0.0048 : 0.0062;

    state.yaw += dx * sensitivity;
    state.pitch = clamp(state.pitch - dy * 0.0040, -0.60, 0.60);

    state.velocityYaw = dx * 0.0018;
    state.velocityPitch = -dy * 0.0011;
    state.needsRender = true;
  }, { passive: true });

  const release = (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    state.needsRender = true;
    stage.releasePointerCapture?.(event.pointerId);
  };

  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("pointerleave", release);
}

function resetView() {
  state.yaw = 0.16;
  state.pitch = -0.06;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.needsRender = true;
}

function setBody(bodyKey) {
  if (!BODY_CONFIG[bodyKey]) return;

  state.body = bodyKey;
  buildMaterial(bodyKey);
  resetView();

  const config = BODY_CONFIG[bodyKey];

  document.querySelectorAll("[data-body]").forEach((button) => {
    button.setAttribute("aria-selected", button.dataset.body === bodyKey ? "true" : "false");
  });

  const stage = document.querySelector("[data-globe-selector-stage]");
  if (stage) stage.dataset.selectedBody = bodyKey;

  const title = document.querySelector("[data-body-title]");
  if (title) title.textContent = config.title;

  const subtitle = document.querySelector("[data-body-subtitle]");
  if (subtitle) subtitle.textContent = config.subtitle;

  const open = document.querySelector("[data-open-body]");
  if (open) {
    open.href = config.href;
    open.textContent = config.openText;
  }
}

function setMode(mode) {
  state.mode = mode;
  state.needsRender = true;

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.setAttribute("aria-selected", button.dataset.mode === mode ? "true" : "false");
  });
}

function markRoute() {
  const markers = {
    globeGatewayStatus: "multi-nodal-physical-material-restored",
    globeGatewayAuthority: "true",
    visualScaleAuthority: "true",
    multiNodalVisualAnchors: "true",
    physicalGraphicMaterial: "true",
    materialAsset: "true",
    hydrationFile: "true",
    fibonacciRuntime: "true",
    lattice256Runtime: "true",
    runtimeFieldSize: "256",
    runtimeMotionLaw: "fibonacci-within-256-lattice",
    materialSource: "multi-nodal-physical-material:v10",
    opaqueGlobeBody: "true",
    cartoonFallbackPrimary: "false",
    splitSeasonGlobe: "false",
    satelliteAbstraction: "false",
    dayNightSplitFace: "false",
    groundLevelBuildActive: "false",
    diamondInstrument: "false"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = value;
    document.body.dataset[key] = value;
  });
}

function protectGatewayIdentity() {
  const title = document.querySelector("title");
  if (title && !/Globe Showcase/i.test(title.textContent || "")) {
    title.textContent = "Globe Showcase · Diamond Gate Bridge";
  }

  const h1 = document.querySelector("h1");
  if (h1 && /Earth is the real-world reference body/i.test(h1.textContent || "")) {
    h1.textContent = "Clean globe, hydrated object, not public map construction.";
  }
}

function bindControls() {
  document.querySelectorAll("[data-body]").forEach((button) => {
    button.addEventListener("click", () => setBody(button.dataset.body));
  });

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  const reset = document.querySelector("[data-reset-view]");
  if (reset) reset.addEventListener("click", resetView);
}

function warmMaterials() {
  Object.keys(BODY_CONFIG).forEach((key) => buildMaterial(key));
}

function warmInitialFrames(canvas) {
  const metrics = getLayoutMetrics(canvas.width || 390, canvas.height || 700);
  Object.keys(BODY_CONFIG).forEach((key) => {
    getFrame(key, metrics.radius || 170, 0.16, -0.06);
  });
}

function initGlobeSelector() {
  markRoute();
  protectGatewayIdentity();
  warmMaterials();

  const stage = document.querySelector("[data-globe-selector-stage]");
  const canvas = document.querySelector("[data-globe-selector-canvas]");

  if (!stage || !canvas) return null;

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!ctx) return null;

  bindControls();
  bindPointer(stage);
  setBody("earth");
  setMode("auto");
  resizeCanvas(canvas);
  warmInitialFrames(canvas);
  render(canvas, ctx);

  if (!state.raf) {
    state.raf = requestAnimationFrame((time) => step(time, canvas, ctx));
  }

  window.DGBGlobeSelector = Object.freeze({
    ...GLOBE_SELECTOR_STATE,
    status() {
      resolveRuntimeAddress();

      return Object.freeze({
        ...GLOBE_SELECTOR_STATE,
        ready: true,
        selectedBody: state.body,
        mode: state.mode,
        yaw: state.yaw,
        pitch: state.pitch,
        runtimeAddress: state.runtimeAddress,
        fibonacciBand: state.fibonacciBand,
        frameCacheSize: Object.keys(state.frames).length,
        materialCacheKeys: Object.freeze(Object.keys(state.materials)),
        materialSource: "multi-nodal-physical-material:v10",
        currentMaterialSource: `multi-nodal-physical-material:v10:${state.body}`,
        currentAnchor: BODY_CONFIG[state.body]?.anchor || "UNKNOWN",
        multiNodalVisualAnchors: true,
        physicalGraphicMaterial: true,
        materialAsset: true,
        hydrationFile: true,
        fibonacciRuntime: true,
        lattice256Runtime: true,
        runtimeFieldSize: RUNTIME_FIELD_SIZE,
        fibonacciSequence: FIBONACCI_SEQUENCE,
        runtimeMotionLaw: "fibonacci-within-256-lattice",
        opaqueGlobeBody: true,
        cartoonFallbackPrimary: false,
        splitSeasonGlobe: false,
        satelliteAbstraction: false,
        dayNightSplitFace: false,
        groundLevelBuildActive: false,
        diamondMountedHere: false,
        earthStandingInGateway: false
      });
    }
  });

  return window.DGBGlobeSelector;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGlobeSelector, { once: true });
} else {
  initGlobeSelector();
}

export { GLOBE_SELECTOR_STATE, initGlobeSelector };
export default GLOBE_SELECTOR_STATE;
