const GLOBE_SELECTOR_STATE = Object.freeze({
  contract: "SHOWROOM_GLOBE_CINEMATIC_MATERIAL_RESTORATION_TNT_v7",
  previousContract: "SHOWROOM_GLOBE_MOBILE_STAGE_LAYOUT_GOVERNOR_TNT_v5",
  route: "/showroom/globe/",
  role: "globe-system-gateway-selector",
  gatewayAuthority: true,
  visualScaleAuthority: true,
  diamondInstrument: false,
  runtimeStabilized: true,
  surfaceCacheEnabled: true,
  mobileStageLayoutGovernor: true,
  protectedVerticalBands: true,
  cinematicMaterialRestored: true,
  proceduralBlobPrimary: false,
  opaqueGlobeBody: true,
  blockTileLandRender: false,
  childRoutes: Object.freeze({
    earth: "/showroom/globe/earth/",
    "h-earth": "/showroom/globe/h-earth/",
    audralia: "/showroom/globe/audralia/"
  }),
  publicReceiptsVisible: false,
  generatedImage: false,
  graphicBox: false,
  heavyRuntimeLoaded: false
});

const BODY_CONFIG = Object.freeze({
  earth: Object.freeze({
    key: "earth",
    title: "Earth",
    subtitle: "Reference Body · cinematic selector material",
    openText: "Open Earth",
    href: "/showroom/globe/earth/",
    materialKind: "reference-cinematic",
    ocean: [18, 82, 132],
    oceanDeep: [3, 18, 48],
    shelf: [55, 142, 174],
    land: [146, 148, 102],
    landDark: [72, 110, 78],
    landBright: [207, 197, 147],
    highland: [222, 214, 180],
    ice: [230, 240, 242],
    cloud: [238, 248, 255],
    glow: [112, 184, 244],
    imageCandidates: Object.freeze([
      "/assets/showroom/globe/earth-cinematic.webp",
      "/assets/showroom/globe/earth.webp",
      "/assets/showroom/globe/earth.jpg",
      "/assets/earth/earth-cinematic.webp",
      "/assets/earth/earth-blue-marble.webp",
      "/assets/earth/earth-blue-marble.jpg",
      "/assets/earth/earth_material.jpg",
      "/assets/earth/earth.jpg",
      "/assets/earth/earth.png"
    ]),
    landforms: Object.freeze([
      { lat: 0.22, lon: -1.92, rx: 0.44, ry: 0.78, seed: 11, twist: -0.34, edge: 0.18 },
      { lat: -0.52, lon: -1.34, rx: 0.28, ry: 0.48, seed: 12, twist: 0.18, edge: 0.22 },
      { lat: 0.34, lon: 0.24, rx: 0.52, ry: 0.58, seed: 13, twist: 0.28, edge: 0.20 },
      { lat: -0.28, lon: 0.78, rx: 0.34, ry: 0.34, seed: 14, twist: -0.14, edge: 0.20 },
      { lat: -0.74, lon: 2.08, rx: 0.22, ry: 0.16, seed: 15, twist: 0.44, edge: 0.22 },
      { lat: 0.76, lon: -0.44, rx: 0.64, ry: 0.16, seed: 16, twist: 0.08, edge: 0.14 }
    ])
  }),

  "h-earth": Object.freeze({
    key: "h-earth",
    title: "H-Earth",
    subtitle: "Hybrid Earth · cinematic inspection gateway",
    openText: "Open H-Earth",
    href: "/showroom/globe/h-earth/",
    materialKind: "hybrid-cinematic",
    ocean: [25, 96, 112],
    oceanDeep: [5, 28, 52],
    shelf: [70, 160, 150],
    land: [184, 158, 82],
    landDark: [66, 118, 102],
    landBright: [224, 204, 132],
    highland: [238, 221, 168],
    ice: [222, 240, 226],
    cloud: [226, 248, 238],
    glow: [150, 238, 190],
    imageCandidates: Object.freeze([
      "/assets/showroom/globe/h-earth-cinematic.webp",
      "/assets/showroom/globe/h-earth.webp",
      "/assets/showroom/globe/h-earth.jpg",
      "/assets/h-earth/h-earth-cinematic.webp",
      "/assets/h-earth/h-earth.material.webp",
      "/assets/h-earth/h-earth.jpg",
      "/assets/h-earth/h-earth.png",
      "/assets/hearth/hearth-cinematic.webp",
      "/assets/hearth/hearth.jpg",
      "/assets/hearth/hearth.png"
    ]),
    landforms: Object.freeze([
      { lat: 0.10, lon: -1.65, rx: 0.56, ry: 0.80, seed: 31, twist: -0.24, edge: 0.24 },
      { lat: -0.38, lon: -0.62, rx: 0.38, ry: 0.52, seed: 32, twist: 0.36, edge: 0.20 },
      { lat: 0.30, lon: 0.76, rx: 0.50, ry: 0.56, seed: 33, twist: -0.16, edge: 0.22 },
      { lat: -0.58, lon: 1.54, rx: 0.30, ry: 0.28, seed: 34, twist: 0.18, edge: 0.22 },
      { lat: 0.70, lon: 2.14, rx: 0.44, ry: 0.18, seed: 35, twist: -0.06, edge: 0.16 }
    ])
  }),

  audralia: Object.freeze({
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World · cinematic selector material",
    openText: "Open Audralia",
    href: "/showroom/globe/audralia/",
    materialKind: "constructed-cinematic",
    ocean: [50, 58, 96],
    oceanDeep: [10, 13, 40],
    shelf: [96, 102, 142],
    land: [154, 112, 94],
    landDark: [78, 62, 98],
    landBright: [214, 168, 144],
    highland: [232, 188, 164],
    ice: [218, 212, 238],
    cloud: [232, 226, 255],
    glow: [196, 158, 250],
    imageCandidates: Object.freeze([
      "/assets/showroom/globe/audralia-cinematic.webp",
      "/assets/showroom/globe/audralia.webp",
      "/assets/showroom/globe/audralia.jpg",
      "/assets/audralia/audralia-cinematic.webp",
      "/assets/audralia/audralia.material.webp",
      "/assets/audralia/audralia.jpg",
      "/assets/audralia/audralia.png"
    ]),
    landforms: Object.freeze([
      { lat: -0.02, lon: -1.18, rx: 0.66, ry: 0.72, seed: 51, twist: 0.22, edge: 0.24 },
      { lat: 0.42, lon: 0.56, rx: 0.40, ry: 0.36, seed: 52, twist: -0.34, edge: 0.28 },
      { lat: -0.48, lon: 1.36, rx: 0.34, ry: 0.28, seed: 53, twist: 0.28, edge: 0.22 },
      { lat: 0.78, lon: -2.28, rx: 0.40, ry: 0.16, seed: 54, twist: 0.10, edge: 0.18 }
    ])
  })
});

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;
const MAX_DPR = 1.5;
const MATERIAL_W = 1600;
const MATERIAL_H = 800;

const state = {
  body: "earth",
  mode: "auto",
  yaw: 0.24,
  pitch: -0.10,
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
  materialCache: Object.create(null),
  activeMaterial: null
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
    width * (isMobile ? 0.305 : 0.345),
    available * (isMobile ? 0.445 : 0.49)
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

function materialCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = MATERIAL_W;
  canvas.height = MATERIAL_H;
  return canvas;
}

function lonToX(lon) {
  return ((lon + Math.PI) / TAU) * MATERIAL_W;
}

function latToY(lat) {
  return (0.5 - lat / Math.PI) * MATERIAL_H;
}

function makeBlobPath(ctx, cx, cy, rx, ry, seed, edge, twist = 0, samples = 96) {
  ctx.beginPath();

  for (let i = 0; i <= samples; i += 1) {
    const t = (i / samples) * TAU;
    const wobbleA = 1 + edge * Math.sin(t * 3 + seed * 0.41);
    const wobbleB = 1 + edge * 0.55 * Math.cos(t * 5 - seed * 0.27);
    const wobbleC = 1 + edge * 0.34 * Math.sin(t * 7 + seed * 0.13);
    const notch = 1 - edge * 0.40 * Math.max(0, Math.sin(t * 2.0 + seed));
    const r = wobbleA * wobbleB * wobbleC * notch;

    const localX = Math.cos(t) * rx * r;
    const localY = Math.sin(t) * ry * r;

    const x = cx + localX * Math.cos(twist) - localY * Math.sin(twist);
    const y = cy + localX * Math.sin(twist) + localY * Math.cos(twist);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.closePath();
}

function drawWrappedBlob(ctx, form, config, layer) {
  const centerX = lonToX(form.lon);
  const centerY = latToY(form.lat);
  const rx = form.rx * (MATERIAL_W / TAU);
  const ry = form.ry * (MATERIAL_H / Math.PI);
  const copies = [0];

  if (centerX - rx < 0) copies.push(MATERIAL_W);
  if (centerX + rx > MATERIAL_W) copies.push(-MATERIAL_W);

  for (const offset of copies) {
    const x = centerX + offset;

    if (layer === "shelf") {
      ctx.save();
      makeBlobPath(ctx, x, centerY, rx * 1.08, ry * 1.08, form.seed, form.edge * 0.78, form.twist);
      ctx.fillStyle = rgb(config.shelf, 0.52);
      ctx.shadowColor = rgb(config.shelf, 0.34);
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();
      continue;
    }

    if (layer === "land") {
      ctx.save();
      makeBlobPath(ctx, x, centerY, rx, ry, form.seed, form.edge, form.twist);

      const gradient = ctx.createRadialGradient(
        x - rx * 0.22,
        centerY - ry * 0.34,
        Math.max(10, rx * 0.08),
        x,
        centerY,
        Math.max(rx, ry) * 1.20
      );

      gradient.addColorStop(0, rgb(config.landBright, 1));
      gradient.addColorStop(0.40, rgb(config.land, 1));
      gradient.addColorStop(0.78, rgb(mixColor(config.land, config.landDark, 0.45), 1));
      gradient.addColorStop(1, rgb(config.landDark, 1));

      ctx.fillStyle = gradient;
      ctx.strokeStyle = rgb(config.coast || config.shelf, 0.70);
      ctx.lineWidth = 3.4;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      continue;
    }

    if (layer === "terrain") {
      ctx.save();
      makeBlobPath(ctx, x, centerY, rx * 0.64, ry * 0.58, form.seed + 19, form.edge * 0.55, form.twist + 0.4);
      ctx.globalCompositeOperation = "soft-light";
      ctx.fillStyle = rgb(config.highland, 0.46);
      ctx.fill();

      ctx.globalCompositeOperation = "screen";
      ctx.strokeStyle = rgb(config.highland, 0.18);
      ctx.lineWidth = 1.6;

      for (let i = 0; i < 6; i += 1) {
        const y = centerY + (i - 2.5) * ry * 0.15;
        ctx.beginPath();
        ctx.moveTo(x - rx * 0.34, y);
        ctx.bezierCurveTo(
          x - rx * 0.10,
          y - ry * 0.10,
          x + rx * 0.12,
          y + ry * 0.10,
          x + rx * 0.36,
          y - ry * 0.02
        );
        ctx.stroke();
      }

      ctx.restore();
    }
  }
}

function drawCinematicFallbackMaterial(config) {
  const canvas = materialCanvas();
  const ctx = canvas.getContext("2d", { alpha: false });

  const ocean = ctx.createLinearGradient(0, 0, MATERIAL_W, MATERIAL_H);
  ocean.addColorStop(0, rgb(mixColor(config.ocean, config.shelf, 0.26), 1));
  ocean.addColorStop(0.32, rgb(config.ocean, 1));
  ocean.addColorStop(0.70, rgb(mixColor(config.ocean, config.oceanDeep, 0.50), 1));
  ocean.addColorStop(1, rgb(config.oceanDeep, 1));
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, MATERIAL_W, MATERIAL_H);

  for (let i = 0; i < 90; i += 1) {
    const x = seededUnit(i, config.key.length + 80) * MATERIAL_W;
    const y = seededUnit(i, config.key.length + 81) * MATERIAL_H;
    const r = 20 + seededUnit(i, config.key.length + 82) * 70;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgb(config.shelf, 0.16));
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  for (const form of config.landforms) drawWrappedBlob(ctx, form, config, "shelf");
  for (const form of config.landforms) drawWrappedBlob(ctx, form, config, "land");
  for (const form of config.landforms) drawWrappedBlob(ctx, form, config, "terrain");

  drawPolarBand(ctx, config, 0);
  drawPolarBand(ctx, config, MATERIAL_H);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = rgb(config.shelf, 0.08);
  ctx.lineWidth = 2;

  for (let i = 0; i < 24; i += 1) {
    const y = MATERIAL_H * (0.18 + seededUnit(i, config.key.length + 150) * 0.64);
    const x0 = seededUnit(i, config.key.length + 151) * MATERIAL_W;
    const length = 180 + seededUnit(i, config.key.length + 152) * 280;

    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.bezierCurveTo(
      x0 + length * 0.28,
      y - 24,
      x0 + length * 0.70,
      y + 24,
      x0 + length,
      y
    );
    ctx.stroke();
  }

  ctx.restore();

  drawStaticCloudMaterial(ctx, config);
  drawMaterialVignette(ctx, config);

  return Object.freeze({
    key: config.key,
    source: "fallback-cinematic-material",
    canvas,
    image: canvas,
    width: MATERIAL_W,
    height: MATERIAL_H,
    ready: true
  });
}

function drawPolarBand(ctx, config, yEdge) {
  const y = yEdge === 0 ? 0 : MATERIAL_H;
  const height = MATERIAL_H * 0.10;
  const gradient = ctx.createLinearGradient(0, yEdge === 0 ? 0 : MATERIAL_H - height, 0, yEdge === 0 ? height : MATERIAL_H);

  if (yEdge === 0) {
    gradient.addColorStop(0, rgb(config.ice, 0.96));
    gradient.addColorStop(1, rgb(config.ice, 0));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, MATERIAL_W, height);
  } else {
    gradient.addColorStop(0, rgb(config.ice, 0));
    gradient.addColorStop(1, rgb(config.ice, 0.96));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, MATERIAL_H - height, MATERIAL_W, height);
  }

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = rgb(config.ice, 0.20);

  for (let i = 0; i < 20; i += 1) {
    const x = seededUnit(i, y + config.key.length) * MATERIAL_W;
    const w = 80 + seededUnit(i, y + 10) * 200;
    const h = 12 + seededUnit(i, y + 11) * 34;
    const yy = yEdge === 0
      ? seededUnit(i, y + 12) * height
      : MATERIAL_H - seededUnit(i, y + 12) * height;

    ctx.beginPath();
    ctx.ellipse(x, yy, w, h, seededUnit(i, y + 13) * 0.8, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawStaticCloudMaterial(ctx, config) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let i = 0; i < 42; i += 1) {
    const x = seededUnit(i, config.key.length + 300) * MATERIAL_W;
    const y = MATERIAL_H * (0.18 + seededUnit(i, config.key.length + 301) * 0.64);
    const w = 80 + seededUnit(i, config.key.length + 302) * 210;
    const h = 10 + seededUnit(i, config.key.length + 303) * 26;
    const alpha = 0.035 + seededUnit(i, config.key.length + 304) * 0.070;

    const g = ctx.createRadialGradient(x, y, 0, x, y, w);
    g.addColorStop(0, rgb(config.cloud, alpha));
    g.addColorStop(0.48, rgb(config.cloud, alpha * 0.42));
    g.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, seededUnit(i, config.key.length + 305) * 0.8, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawMaterialVignette(ctx, config) {
  ctx.save();
  ctx.globalCompositeOperation = "multiply";

  const top = ctx.createLinearGradient(0, 0, 0, MATERIAL_H);
  top.addColorStop(0, "rgba(0,0,0,0.22)");
  top.addColorStop(0.18, "rgba(0,0,0,0)");
  top.addColorStop(0.82, "rgba(0,0,0,0)");
  top.addColorStop(1, "rgba(0,0,0,0.20)");

  ctx.fillStyle = top;
  ctx.fillRect(0, 0, MATERIAL_W, MATERIAL_H);

  ctx.restore();
}

function getMaterial(bodyKey) {
  if (!state.materialCache[bodyKey]) {
    const config = BODY_CONFIG[bodyKey] || BODY_CONFIG.earth;
    state.materialCache[bodyKey] = drawCinematicFallbackMaterial(config);
    loadImageMaterial(config);
  }

  return state.materialCache[bodyKey];
}

function activateMaterial(bodyKey) {
  state.activeMaterial = getMaterial(bodyKey);
  state.needsRender = true;
}

function loadImageMaterial(config) {
  if (!config.imageCandidates || !config.imageCandidates.length) return;
  if (state.materialCache[config.key]?.source?.startsWith("image:")) return;

  const candidates = Array.from(config.imageCandidates);
  let index = 0;

  const tryNext = () => {
    if (index >= candidates.length) return;

    const src = candidates[index];
    index += 1;

    const image = new Image();
    image.decoding = "async";
    image.loading = "eager";

    image.onload = () => {
      state.materialCache[config.key] = Object.freeze({
        key: config.key,
        source: `image:${src}`,
        image,
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
        ready: true
      });

      if (state.body === config.key) {
        state.activeMaterial = state.materialCache[config.key];
        state.needsRender = true;
      }

      markMaterialSource(config.key, src);
    };

    image.onerror = tryNext;
    image.src = `${src}${src.includes("?") ? "&" : "?"}material_restore=v7`;
  };

  tryNext();
}

function markMaterialSource(bodyKey, source) {
  const safeKey = bodyKey.replace(/[^a-z0-9-]/gi, "");
  document.documentElement.dataset[`materialSource${toDatasetName(safeKey)}`] = source;
  document.body.dataset[`materialSource${toDatasetName(safeKey)}`] = source;
}

function toDatasetName(value) {
  return value
    .split("-")
    .map((part) => part ? part[0].toUpperCase() + part.slice(1) : "")
    .join("");
}

function drawBackground(ctx, width, height, config) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "rgba(3, 10, 22, 0.98)");
  bg.addColorStop(0.52, "rgba(7, 18, 36, 0.98)");
  bg.addColorStop(1, "rgba(1, 5, 13, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(
    width * 0.5,
    height * 0.43,
    width * 0.035,
    width * 0.5,
    height * 0.45,
    width * 0.56
  );

  halo.addColorStop(0, rgb(config.glow, 0.13));
  halo.addColorStop(0.42, rgb(config.glow, 0.052));
  halo.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();

  for (let i = 0; i < 48; i += 1) {
    const x = seededUnit(i, 1) * width;
    const y = seededUnit(i, 2) * height;
    const alpha = 0.05 + seededUnit(i, 3) * 0.14;
    const size = i % 13 === 0 ? 5.5 : i % 5 === 0 ? 2.7 : 1.0;

    ctx.strokeStyle = `rgba(235,244,255,${alpha})`;
    ctx.lineWidth = Math.max(1, width * 0.0008);
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function drawWrappedImageStrip(ctx, image, sx, sy, sw, sh, dx, dy, dw, dh) {
  const iw = image.naturalWidth || image.width;
  const start = ((sx % iw) + iw) % iw;

  if (start + sw <= iw) {
    ctx.drawImage(image, start, sy, sw, sh, dx, dy, dw, dh);
    return;
  }

  const first = iw - start;
  const firstRatio = first / sw;
  ctx.drawImage(image, start, sy, first, sh, dx, dy, dw * firstRatio, dh);

  const second = sw - first;
  ctx.drawImage(image, 0, sy, second, sh, dx + dw * firstRatio, dy, dw * (1 - firstRatio), dh);
}

function drawCinematicGlobeBody(ctx, width, height, config, material) {
  const metrics = getLayoutMetrics(width, height);
  const radius = metrics.radius;
  const cx = metrics.globeCenterX;
  const cy = metrics.globeCenterY;
  const image = material.image;
  const iw = image.naturalWidth || image.width;
  const ih = image.naturalHeight || image.height;

  ctx.save();

  const aura = ctx.createRadialGradient(cx, cy, radius * 0.18, cx, cy, radius * 1.54);
  aura.addColorStop(0, rgb(config.glow, 0.080));
  aura.addColorStop(0.52, rgb(config.glow, 0.040));
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  ctx.fillStyle = rgb(config.oceanDeep, 1);
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const yawOffset = ((state.yaw / TAU) % 1 + 1) % 1;
  const pitchOffset = clamp(state.pitch / Math.PI, -0.18, 0.18);
  const srcSpan = iw * 0.50;
  const srcX = yawOffset * iw;
  const rowStep = Math.max(1, Math.floor(1.15 * state.dpr));

  for (let y = -radius; y <= radius; y += rowStep) {
    const dy = y;
    const normalizedY = dy / radius;
    const half = Math.sqrt(Math.max(0, 1 - normalizedY * normalizedY)) * radius;

    if (half <= 0.5) continue;

    const destY = cy + dy;
    const destX = cx - half;
    const destW = half * 2;
    const destH = rowStep + 0.65;

    const v = clamp(0.5 + normalizedY * 0.5 + pitchOffset, 0.001, 0.999);
    const sy = clamp(v * ih, 0, ih - 2);
    const sh = Math.max(1, (rowStep / Math.max(1, radius * 2)) * ih * 1.7);

    drawWrappedImageStrip(ctx, image, srcX, sy, srcSpan, sh, destX, destY, destW, destH);
  }

  const highlight = ctx.createRadialGradient(
    cx - radius * 0.38,
    cy - radius * 0.42,
    radius * 0.05,
    cx + radius * 0.02,
    cy + radius * 0.02,
    radius * 1.08
  );

  highlight.addColorStop(0, "rgba(255,255,255,0.20)");
  highlight.addColorStop(0.34, "rgba(255,255,255,0.045)");
  highlight.addColorStop(0.64, "rgba(0,0,0,0.06)");
  highlight.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = highlight;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const terminator = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  terminator.addColorStop(0, "rgba(0,0,0,0.04)");
  terminator.addColorStop(0.58, "rgba(0,0,0,0.00)");
  terminator.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = terminator;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  drawAtmosphere(ctx, width, height, config, radius, cx, cy);
  drawGroundShadow(ctx, config, radius, cx, cy);

  ctx.restore();
}

function drawAtmosphere(ctx, width, height, config, radius, cx, cy) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const limb = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.18);
  limb.addColorStop(0, "rgba(255,255,255,0)");
  limb.addColorStop(0.64, rgb(config.glow, 0.12));
  limb.addColorStop(0.82, rgb(config.glow, 0.26));
  limb.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = limb;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.14, 0, TAU);
  ctx.fill();

  ctx.restore();

  ctx.save();
  ctx.strokeStyle = rgb(config.glow, 0.30);
  ctx.lineWidth = Math.max(1.05, width * 0.00115);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function drawGroundShadow(ctx, config, radius, cx, cy) {
  const shadow = ctx.createRadialGradient(
    cx,
    cy + radius * 1.08,
    radius * 0.04,
    cx,
    cy + radius * 1.08,
    radius * 0.48
  );

  shadow.addColorStop(0, rgb(config.glow, 0.10));
  shadow.addColorStop(0.46, "rgba(82,109,146,0.09)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(cx, cy + radius * 1.08, radius * 0.44, radius * 0.08, 0, 0, TAU);
  ctx.fill();
}

function drawGlints(ctx, width, height, config) {
  const metrics = getLayoutMetrics(width, height);
  const radius = metrics.radius;
  const cx = metrics.globeCenterX;
  const cy = metrics.globeCenterY;

  const points = [
    [cx - radius * 0.54, cy - radius * 0.25, 5.5],
    [cx + radius * 0.45, cy - radius * 0.14, 4.2],
    [cx - radius * 0.03, cy - radius * 0.80, 3.4]
  ];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  points.forEach(([x, y, size]) => {
    ctx.strokeStyle = "rgba(255,255,255,0.11)";
    ctx.lineWidth = Math.max(0.7, width * 0.00075);
    ctx.beginPath();
    ctx.moveTo(x - size * state.dpr, y);
    ctx.lineTo(x + size * state.dpr, y);
    ctx.moveTo(x, y - size * state.dpr);
    ctx.lineTo(x, y + size * state.dpr);
    ctx.stroke();
  });

  ctx.restore();
}

function render(canvas, ctx) {
  const config = BODY_CONFIG[state.body] || BODY_CONFIG.earth;
  const material = state.activeMaterial || getMaterial(state.body);
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, width, height, config);
  drawStars(ctx, width, height);
  drawCinematicGlobeBody(ctx, width, height, config, material);
  drawGlints(ctx, width, height, config);

  state.needsRender = false;
}

function updateMotion(dt) {
  let changed = false;

  if (!state.dragging) {
    const priorYaw = state.yaw;
    const priorPitch = state.pitch;

    state.yaw += state.velocityYaw;
    state.pitch = clamp(state.pitch + state.velocityPitch, -0.60, 0.60);

    const damping = state.mode === "soft" ? 0.958 : 0.940;
    const applied = Math.pow(damping, dt * 60);

    state.velocityYaw *= applied;
    state.velocityPitch *= applied;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;

    if (state.mode === "auto" && state.velocityYaw === 0 && state.velocityPitch === 0) {
      state.yaw += dt * 0.038;
    }

    changed = changed || Math.abs(priorYaw - state.yaw) > 0.00001 || Math.abs(priorPitch - state.pitch) > 0.00001;
  }

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

    state.yaw += dx * 0.0062;
    state.pitch = clamp(state.pitch - dy * 0.0042, -0.60, 0.60);

    state.velocityYaw = dx * 0.0018;
    state.velocityPitch = -dy * 0.0012;
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
  state.yaw = 0.24;
  state.pitch = -0.10;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.needsRender = true;
}

function setBody(bodyKey) {
  if (!BODY_CONFIG[bodyKey]) return;

  state.body = bodyKey;
  activateMaterial(bodyKey);
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
  document.documentElement.dataset.globeGatewayStatus = "cinematic-material-restored";
  document.documentElement.dataset.globeGatewayAuthority = "true";
  document.documentElement.dataset.visualScaleAuthority = "true";
  document.documentElement.dataset.runtimeStabilized = "true";
  document.documentElement.dataset.surfaceCacheEnabled = "true";
  document.documentElement.dataset.mobileStageLayoutGovernor = "true";
  document.documentElement.dataset.protectedVerticalBands = "true";
  document.documentElement.dataset.cinematicMaterialRestored = "true";
  document.documentElement.dataset.proceduralBlobPrimary = "false";
  document.documentElement.dataset.opaqueGlobeBody = "true";
  document.documentElement.dataset.blockTileLandRender = "false";
  document.documentElement.dataset.diamondInstrument = "false";
  document.documentElement.dataset.earthRecord = "false";

  document.body.dataset.globeGatewayStatus = "cinematic-material-restored";
  document.body.dataset.globeGatewayAuthority = "true";
  document.body.dataset.visualScaleAuthority = "true";
  document.body.dataset.runtimeStabilized = "true";
  document.body.dataset.surfaceCacheEnabled = "true";
  document.body.dataset.mobileStageLayoutGovernor = "true";
  document.body.dataset.protectedVerticalBands = "true";
  document.body.dataset.cinematicMaterialRestored = "true";
  document.body.dataset.proceduralBlobPrimary = "false";
  document.body.dataset.opaqueGlobeBody = "true";
  document.body.dataset.blockTileLandRender = "false";
  document.body.dataset.diamondInstrument = "false";
  document.body.dataset.earthRecord = "false";
}

function protectGatewayIdentity() {
  const title = document.querySelector("title");
  if (title && !/Globe Showcase/i.test(title.textContent || "")) {
    title.textContent = "Globe Showcase · Diamond Gate Bridge";
  }

  const h1 = document.querySelector("h1");
  if (h1 && /Earth is the real-world reference body/i.test(h1.textContent || "")) {
    h1.textContent = "Choose the world body you meant to open.";
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
  Object.keys(BODY_CONFIG).forEach((key) => {
    getMaterial(key);
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
  render(canvas, ctx);

  if (!state.raf) {
    state.raf = requestAnimationFrame((time) => step(time, canvas, ctx));
  }

  window.DGBGlobeSelector = Object.freeze({
    ...GLOBE_SELECTOR_STATE,
    status() {
      const material = state.activeMaterial || getMaterial(state.body);

      return Object.freeze({
        ...GLOBE_SELECTOR_STATE,
        ready: true,
        selectedBody: state.body,
        mode: state.mode,
        gatewayAuthority: true,
        earthStandingInGateway: false,
        diamondMountedHere: false,
        runtimeStabilized: true,
        surfaceCacheEnabled: true,
        mobileStageLayoutGovernor: true,
        protectedVerticalBands: true,
        cinematicMaterialRestored: true,
        opaqueGlobeBody: true,
        materialSource: material.source,
        cacheKeys: Object.freeze(Object.keys(state.materialCache))
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
