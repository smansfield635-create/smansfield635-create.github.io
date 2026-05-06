/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_SPHERICAL_DEPTH_REFINEMENT_TNT_v3
   Jurisdiction: canvas creation, spherical projection, animation, land/water paint, terrain depth, coastline/shelf definition, receipts.
   Non-jurisdiction: HTML shell, route doorway, document.body mutation, Gauges scoring, image generation, GraphicBox.
*/

const AUDRALIA_CANVAS_CONTRACT = "AUDRALIA_CANVAS_SPHERICAL_DEPTH_REFINEMENT_TNT_v3";

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

const DEFAULT_OPTIONS = {
  rotationSpeed: 0.24,
  pixelResolution: 512,
  minPixelResolution: 360,
  maxPixelResolution: 720,
  devicePixelClamp: 2,
  targetLandRatio: 0.292,
  showReceipts: true
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function mixRgb(a, b, t) {
  const u = clamp(t, 0, 1);
  return [
    Math.round(lerp(a[0], b[0], u)),
    Math.round(lerp(a[1], b[1], u)),
    Math.round(lerp(a[2], b[2], u))
  ];
}

function wrapLongitude(lon) {
  let out = lon;
  while (out < -Math.PI) out += TAU;
  while (out > Math.PI) out -= TAU;
  return out;
}

function hash3(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise3(x, y, z) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);

  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);

  let total = 0;

  for (let dz = 0; dz <= 1; dz += 1) {
    for (let dy = 0; dy <= 1; dy += 1) {
      for (let dx = 0; dx <= 1; dx += 1) {
        const weight =
          (dx ? ux : 1 - ux) *
          (dy ? uy : 1 - uy) *
          (dz ? uz : 1 - uz);

        total += hash3(ix + dx, iy + dy, iz + dz) * weight;
      }
    }
  }

  return total;
}

function fbm3(x, y, z, octaves = 6) {
  let amplitude = 0.56;
  let frequency = 1;
  let total = 0;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    normalizer += amplitude;
    frequency *= 2.04;
    amplitude *= 0.5;
  }

  return total / Math.max(0.000001, normalizer);
}

function vec3(x, y, z) {
  return { x, y, z };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length
  };
}

function sphericalVector(lon, lat) {
  const c = Math.cos(lat);
  return {
    x: Math.sin(lon) * c,
    y: Math.sin(lat),
    z: Math.cos(lon) * c
  };
}

function lonLatFromVector(v) {
  return {
    lon: Math.atan2(v.x, v.z),
    lat: Math.asin(clamp(v.y, -1, 1))
  };
}

function angularDistance(a, b) {
  return Math.acos(clamp(dot(a, b), -1, 1));
}

function continentCap(point, centerLon, centerLat, radius, strength, warp = 0) {
  const center = sphericalVector(centerLon, centerLat);
  const d = angularDistance(point, center);
  const edgeNoise = fbm3(
    point.x * 7.5 + warp,
    point.y * 7.5 - warp * 0.4,
    point.z * 7.5 + warp * 0.7,
    4
  );

  const brokenRadius = radius * (0.86 + edgeNoise * 0.28);
  return Math.max(0, 1 - d / Math.max(0.001, brokenRadius)) * strength;
}

function ridgeLine(lon, lat, centerLon, centerLat, length, thickness, phase, strength) {
  const dLon = wrapLongitude(lon - centerLon);
  const trail =
    centerLat +
    Math.sin(dLon * 2.5 + phase) * 0.13 +
    Math.sin(dLon * 6.7 - phase) * 0.036;

  const along =
    smoothstep(-length, -length * 0.72, dLon) *
    (1 - smoothstep(length * 0.72, length, dLon));

  const cross = 1 - smoothstep(thickness * 0.35, thickness, Math.abs(lat - trail));
  return along * cross * strength;
}

function sampleAudraliaSurface(lon, lat, timeSeconds = 0) {
  const p = sphericalVector(lon, lat);

  const broad = fbm3(p.x * 2.3 + 9.1, p.y * 2.3 - 4.2, p.z * 2.3 + 2.8, 6);
  const coastNoise = fbm3(p.x * 9.8 - 3.7, p.y * 9.8 + 2.6, p.z * 9.8 + 7.1, 5);
  const rough = fbm3(p.x * 23.0 + 1.6, p.y * 23.0 - 8.2, p.z * 23.0 + 4.1, 5);
  const mineral = fbm3(p.x * 42.0 - 6.8, p.y * 42.0 + 2.9, p.z * 42.0 + 10.4, 4);

  const west =
    continentCap(p, -2.55, 0.08, 0.56, 1.02, 1.1) +
    continentCap(p, -2.02, -0.18, 0.39, 0.68, 2.2) +
    continentCap(p, -2.94, -0.28, 0.28, 0.34, 3.3);

  const middle =
    continentCap(p, -0.82, -0.04, 0.52, 0.72, 4.4) +
    continentCap(p, -0.28, 0.20, 0.34, 0.48, 5.5) +
    continentCap(p, 0.28, -0.18, 0.30, 0.36, 6.6);

  const east =
    continentCap(p, 1.28, -0.06, 0.43, 0.78, 7.7) +
    continentCap(p, 1.84, 0.22, 0.28, 0.42, 8.8) +
    continentCap(p, 1.02, -0.42, 0.22, 0.32, 9.9);

  const islands =
    continentCap(p, 2.52, -0.08, 0.18, 0.28, 10.1) +
    continentCap(p, -3.02, 0.24, 0.17, 0.24, 11.2) +
    continentCap(p, 0.74, -0.62, 0.18, 0.22, 12.3) +
    continentCap(p, 2.2, -0.55, 0.13, 0.18, 13.4) +
    continentCap(p, -1.24, 0.62, 0.13, 0.16, 14.5);

  const northPole = smoothstep(1.06, 1.45, lat) * (0.52 + coastNoise * 0.16);
  const southPole = smoothstep(1.06, 1.45, -lat) * (0.5 + coastNoise * 0.16);

  const rawLand = Math.max(west, middle, east, islands, northPole, southPole);

  const ridges =
    ridgeLine(lon, lat, -2.2, -0.04, 0.95, 0.095, 0.6, 0.25) +
    ridgeLine(lon, lat, -0.35, 0.02, 0.88, 0.085, -1.2, 0.22) +
    ridgeLine(lon, lat, 1.48, 0.06, 0.74, 0.08, 2.1, 0.2);

  const tectonicMemory =
    Math.sin(lon * 3.8 + lat * 2.1) * 0.07 +
    Math.sin(lon * -5.9 + lat * 4.8) * 0.045 +
    Math.cos(lon * 8.2 - lat * 2.9) * 0.035;

  const topology =
    rawLand +
    ridges +
    (broad - 0.5) * 0.24 +
    (coastNoise - 0.5) * 0.18 +
    tectonicMemory;

  const seaLevel = 0.552;
  const landMask = smoothstep(seaLevel - 0.026, seaLevel + 0.046, topology);
  const land = landMask > 0.5;

  const coastBand =
    smoothstep(seaLevel - 0.08, seaLevel + 0.02, topology) *
    (1 - smoothstep(seaLevel + 0.05, seaLevel + 0.18, topology));

  const shelf = clamp(1 - Math.abs(topology - seaLevel) * 7.2, 0, 1);
  const bathymetry = clamp((seaLevel - topology) * 3.1 + (0.48 - broad) * 0.18, 0, 1);
  const deepOcean = smoothstep(0.34, 0.88, bathymetry);

  const mountain = clamp(
    ridges * 1.45 +
      landMask * (rough - 0.36) * 0.72 +
      rawLand * 0.22 +
      tectonicMemory * 1.1,
    0,
    1
  );

  const terrain = clamp(
    landMask * (0.18 + mountain * 0.8 + mineral * 0.16),
    0,
    1
  );

  const glacier = clamp(
    landMask *
      smoothstep(0.66, 0.94, terrain) *
      (smoothstep(0.78, 1.28, Math.abs(lat)) + smoothstep(0.76, 0.96, mountain) * 0.42),
    0,
    1
  );

  const current =
    0.5 +
    0.5 *
      Math.sin(
        lon * 6.4 +
          lat * 7.4 +
          timeSeconds * 0.34 +
          Math.sin(lat * 3.2 + timeSeconds * 0.08)
      );

  let classification = "deep-ocean";
  if (!land && shelf > 0.24) classification = "shelf";
  if (land) classification = "land";
  if (land && coastBand > 0.26) classification = "coast";
  if (land && terrain > 0.62) classification = "highland";
  if (glacier > 0.44) classification = "glacier";

  return {
    lon,
    lat,
    vector: p,
    land,
    landMask,
    topology,
    terrain,
    mountain,
    shelf,
    bathymetry,
    deepOcean,
    coastBand,
    glacier,
    current,
    rough,
    mineral,
    classification
  };
}

function colorForSample(sample, viewNormal, timeSeconds) {
  const light = normalize(vec3(-0.42, 0.34, 0.84));
  const rawLight = dot(viewNormal, light);
  const day = smoothstep(-0.28, 0.9, rawLight);
  const rim = smoothstep(0.66, 1, Math.hypot(viewNormal.x, viewNormal.y));
  const limb = 1 - rim * 0.42;

  const abyss = [3, 10, 24];
  const deep = [5, 24, 48];
  const ocean = [10, 72, 106];
  const shelf = [36, 142, 154];
  const cyanShelf = [88, 206, 208];

  const blackSand = [34, 32, 31];
  const whiteSand = [218, 206, 184];
  const granite = [125, 116, 99];
  const slate = [70, 82, 90];
  const opal = [128, 174, 166];
  const diamond = [210, 228, 224];
  const ice = [232, 240, 242];

  let rgb;

  if (!sample.land) {
    const deepMix = mixRgb(abyss, deep, 1 - sample.deepOcean * 0.35);
    const water = mixRgb(deepMix, ocean, 1 - sample.deepOcean);
    const shallow = mixRgb(water, shelf, sample.shelf);
    const motion = smoothstep(0.48, 1, sample.current) * 0.18;
    rgb = mixRgb(shallow, cyanShelf, sample.shelf * 0.38 + motion);
  } else {
    const sand = mixRgb(blackSand, whiteSand, smoothstep(0.32, 0.84, sample.mineral));
    const stone = mixRgb(granite, slate, smoothstep(0.25, 0.82, sample.rough));
    const mineralStone = mixRgb(stone, opal, sample.terrain * 0.44);
    const brightStone = mixRgb(mineralStone, diamond, smoothstep(0.64, 0.98, sample.terrain) * 0.36);

    rgb = mixRgb(brightStone, sand, sample.coastBand * 0.64);
    rgb = mixRgb(rgb, ice, sample.glacier * 0.92);
  }

  const relief = sample.land
    ? (sample.terrain - 0.42) * 34 + sample.mountain * 18 + sample.coastBand * 12
    : sample.shelf * 20 - sample.deepOcean * 18 + (sample.current - 0.5) * 8;

  const shade = clamp(0.22 + day * 0.98 + rim * 0.08, 0, 1.16);
  const pulse = 1 + Math.sin(timeSeconds * 0.35 + sample.lon * 2) * 0.018;

  return [
    clamp(Math.round((rgb[0] + relief) * shade * limb * pulse), 0, 255),
    clamp(Math.round((rgb[1] + relief) * shade * limb * pulse), 0, 255),
    clamp(Math.round((rgb[2] + relief) * shade * limb * pulse), 0, 255)
  ];
}

function resolveElement(target) {
  if (!target) return null;
  if (typeof target === "string") return document.querySelector(target);
  if (typeof Element !== "undefined" && target instanceof Element) return target;
  return null;
}

function resolveAudraliaMount(explicitMount) {
  const explicit = resolveElement(explicitMount);
  if (explicit) return explicit;

  return (
    document.querySelector("#audraliaCanvasMount") ||
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("#audraliaMount") ||
    document.querySelector("#audralia-canvas-mount") ||
    null
  );
}

function prepareCanvas(mount, options) {
  if (!mount) {
    throw new Error("Audralia canvas mount was not found.");
  }

  if (mount.tagName && mount.tagName.toLowerCase() === "canvas") {
    mount.dataset.audraliaCanvasAuthority = "true";
    mount.dataset.contract = AUDRALIA_CANVAS_CONTRACT;
    return mount;
  }

  const existing = Array.from(
    mount.querySelectorAll("canvas[data-audralia-canvas-authority='true'], canvas[data-audralia-canvas], canvas#audraliaCanvas")
  );

  existing.slice(1).forEach((canvas) => canvas.remove());

  let canvas = existing[0];

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = options.canvasId || "audraliaCanvas";
    mount.appendChild(canvas);
  }

  canvas.dataset.audraliaCanvasAuthority = "true";
  canvas.dataset.audraliaCanvas = "true";
  canvas.dataset.contract = AUDRALIA_CANVAS_CONTRACT;
  canvas.setAttribute("aria-label", "Audralia animated planetary canvas");

  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.maxWidth = "100%";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.borderRadius = "50%";
  canvas.style.background = "radial-gradient(circle at 50% 50%, rgba(3,10,18,1), rgba(1,3,8,1))";

  return canvas;
}

function createReceiptBase(canvas, mount, options) {
  return {
    contract: AUDRALIA_CANVAS_CONTRACT,
    status: "initializing",
    jurisdiction: [
      "canvas creation",
      "spherical projection",
      "animation",
      "land water paint",
      "terrain depth",
      "coastline shelf definition",
      "receipts"
    ],
    nonJurisdiction: [
      "HTML shell",
      "route doorway",
      "document.body mutation",
      "Gauges scoring",
      "image generation",
      "GraphicBox"
    ],
    mountFound: Boolean(mount),
    canvasFound: Boolean(canvas),
    targetLandRatio: options.targetLandRatio,
    startedAt: new Date().toISOString(),
    frame: 0,
    animation: "pending",
    classificationCounts: {},
    samples: {}
  };
}

function drawSpace(ctx, width, height, timeSeconds) {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.44,
    width * 0.04,
    width * 0.5,
    height * 0.5,
    width * 0.75
  );

  gradient.addColorStop(0, "rgba(22, 43, 60, 0.96)");
  gradient.addColorStop(0.42, "rgba(5, 12, 24, 0.99)");
  gradient.addColorStop(1, "rgba(0, 2, 7, 1)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const count = Math.max(80, Math.floor((width * height) / 7200));

  for (let i = 0; i < count; i += 1) {
    const x = hash3(i, 4, 9) * width;
    const y = hash3(i, 8, 2) * height;
    const pulse = 0.4 + 0.6 * hash3(i, 11, 3);
    const twinkle = 0.45 + 0.35 * Math.sin(timeSeconds * (0.18 + pulse) + i);
    const r = 0.45 + hash3(i, 10, 6) * 1.05;

    ctx.beginPath();
    ctx.fillStyle = `rgba(215, 232, 255, ${0.10 + twinkle * 0.28})`;
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }
}

function renderGlobeRaster(offscreen, state) {
  const size = state.rasterSize;
  const ctx = offscreen.getContext("2d", { willReadFrequently: true });
  const image = ctx.createImageData(size, size);
  const data = image.data;

  const rotation = state.rotation;
  const axialTilt = -0.18;
  const cosR = Math.cos(rotation);
  const sinR = Math.sin(rotation);
  const cosT = Math.cos(axialTilt);
  const sinT = Math.sin(axialTilt);

  const counts = {
    land: 0,
    coast: 0,
    highland: 0,
    glacier: 0,
    shelf: 0,
    "deep-ocean": 0
  };

  for (let py = 0; py < size; py += 1) {
    const y = 1 - (py / (size - 1)) * 2;

    for (let px = 0; px < size; px += 1) {
      const x = (px / (size - 1)) * 2 - 1;
      const index = (py * size + px) * 4;
      const rr = x * x + y * y;

      if (rr > 1) {
        data[index + 3] = 0;
        continue;
      }

      const z = Math.sqrt(1 - rr);
      const viewNormal = vec3(x, y, z);

      const tiltedY = y * cosT - z * sinT;
      const tiltedZ = y * sinT + z * cosT;

      const wx = x * cosR + tiltedZ * sinR;
      const wz = tiltedZ * cosR - x * sinR;
      const wy = tiltedY;

      const world = normalize(vec3(wx, wy, wz));
      const ll = lonLatFromVector(world);
      const sample = sampleAudraliaSurface(ll.lon, ll.lat, state.timeSeconds);

      counts[sample.classification] = (counts[sample.classification] || 0) + 1;

      const rgb = colorForSample(sample, viewNormal, state.timeSeconds);
      const rim = smoothstep(0.82, 1, Math.sqrt(rr));
      const alpha = Math.round(255 * (1 - rim * 0.06));

      data[index] = rgb[0];
      data[index + 1] = rgb[1];
      data[index + 2] = rgb[2];
      data[index + 3] = alpha;
    }
  }

  ctx.putImageData(image, 0, 0);
  state.classificationCounts = counts;
}

function drawAtmosphere(ctx, cx, cy, radius, timeSeconds) {
  ctx.save();

  const aura = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.28);
  aura.addColorStop(0, "rgba(48,168,190,0)");
  aura.addColorStop(0.7, "rgba(68,178,204,0.10)");
  aura.addColorStop(0.91, "rgba(152,221,232,0.27)");
  aura.addColorStop(1, "rgba(152,221,232,0)");

  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.28, 0, TAU);
  ctx.fill();

  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = `rgba(183,232,238,${0.18 + Math.sin(timeSeconds * 0.7) * 0.035})`;
  ctx.lineWidth = Math.max(1, radius * 0.012);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.004, 0, TAU);
  ctx.stroke();

  ctx.restore();
}

function drawGrid(ctx, cx, cy, radius, rotation, timeSeconds) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  ctx.lineWidth = Math.max(0.5, radius * 0.0022);

  for (let lat = -60; lat <= 60; lat += 20) {
    const y = cy - Math.sin((lat * Math.PI) / 180) * radius;
    const ry = Math.cos((lat * Math.PI) / 180) * radius;

    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = "rgba(222,242,238,1)";
    ctx.beginPath();
    ctx.ellipse(cx, y, ry, radius * 0.05, 0, 0, TAU);
    ctx.stroke();
  }

  for (let lon = 0; lon < 360; lon += 20) {
    const phase = rotation + (lon * Math.PI) / 180;
    const visible = Math.cos(phase);

    ctx.globalAlpha = 0.018 + Math.abs(visible) * 0.055;
    ctx.strokeStyle = "rgba(222,242,238,1)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.abs(visible) * radius, radius, 0, -HALF_PI, HALF_PI);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.strokeStyle = `rgba(180,238,238,${0.13 + Math.sin(timeSeconds * 0.43) * 0.035})`;
  ctx.lineWidth = Math.max(1, radius * 0.004);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.996, 0, TAU);
  ctx.stroke();

  ctx.restore();
}

function drawMotionBands(ctx, cx, cy, radius, rotation, timeSeconds) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.998, 0, TAU);
  ctx.clip();
  ctx.globalCompositeOperation = "screen";

  for (let band = 0; band < 12; band += 1) {
    const lat = lerp(-0.92, 0.92, band / 11);
    const y = cy - Math.sin(lat) * radius;
    const ry = Math.cos(lat) * radius * (0.86 + Math.sin(timeSeconds * 0.16 + band) * 0.05);
    const phase = rotation * 0.62 + band * 0.78 + timeSeconds * 0.12;
    const alpha = 0.022 + 0.024 * Math.sin(timeSeconds * 0.31 + band * 1.7);

    ctx.strokeStyle = `rgba(218,240,236,${alpha})`;
    ctx.lineWidth = Math.max(1, radius * (0.0045 + band * 0.00025));
    ctx.setLineDash([radius * 0.16, radius * 0.09, radius * 0.04, radius * 0.12]);
    ctx.lineDashOffset = -phase * radius * 0.18;

    ctx.beginPath();
    ctx.ellipse(cx, y, ry, radius * 0.026, Math.sin(phase) * 0.08, 0, TAU);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.restore();
}

function drawDepthOverlay(ctx, cx, cy, radius) {
  ctx.save();

  const shade = ctx.createRadialGradient(
    cx - radius * 0.34,
    cy - radius * 0.28,
    radius * 0.08,
    cx,
    cy,
    radius
  );

  shade.addColorStop(0, "rgba(255,255,255,0.11)");
  shade.addColorStop(0.38, "rgba(255,255,255,0.018)");
  shade.addColorStop(0.74, "rgba(0,0,0,0.10)");
  shade.addColorStop(1, "rgba(0,0,0,0.52)");

  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.fill();

  ctx.globalCompositeOperation = "screen";

  const highlight = ctx.createRadialGradient(
    cx - radius * 0.38,
    cy - radius * 0.31,
    0,
    cx - radius * 0.38,
    cy - radius * 0.31,
    radius * 0.72
  );

  highlight.addColorStop(0, "rgba(255,255,255,0.18)");
  highlight.addColorStop(0.38, "rgba(255,255,255,0.06)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = highlight;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.fill();

  ctx.restore();
}

function sampleProofPixels(ctx, width, height) {
  const points = {
    center: [0.5, 0.5],
    north: [0.5, 0.22],
    south: [0.5, 0.78],
    west: [0.24, 0.5],
    east: [0.76, 0.5]
  };

  const output = {};

  Object.entries(points).forEach(([name, point]) => {
    const x = clamp(Math.floor(point[0] * width), 0, width - 1);
    const y = clamp(Math.floor(point[1] * height), 0, height - 1);
    const pixel = ctx.getImageData(x, y, 1, 1).data;

    output[name] = {
      x,
      y,
      rgba: [pixel[0], pixel[1], pixel[2], pixel[3]]
    };
  });

  return output;
}

function installReceipt(receipt) {
  window.__AUDRALIA_CANVAS_RECEIPT__ = receipt;
  window.AUDRALIA_CANVAS_RECEIPT = receipt;
  document.documentElement.dataset.audraliaCanvasContract = AUDRALIA_CANVAS_CONTRACT;
  document.documentElement.dataset.audraliaCanvasStatus = receipt.status;
  document.documentElement.dataset.audraliaCanvasFrame = String(receipt.frame || 0);
}

class AudraliaCanvasController {
  constructor(canvas, mount, options = {}) {
    this.canvas = canvas;
    this.mount = mount;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });

    this.state = {
      running: false,
      destroyed: false,
      animationFrame: 0,
      frame: 0,
      width: 1,
      height: 1,
      dpr: 1,
      radius: 1,
      rasterSize: this.options.pixelResolution,
      rotation: 0,
      timeSeconds: 0,
      lastTimestamp: 0,
      classificationCounts: {}
    };

    this.offscreen = document.createElement("canvas");
    this.offscreen.width = this.state.rasterSize;
    this.offscreen.height = this.state.rasterSize;

    this.receipt = createReceiptBase(canvas, mount, this.options);

    this.resizeObserver = null;
    this.resize = this.resize.bind(this);
    this.tick = this.tick.bind(this);
    this.destroy = this.destroy.bind(this);

    this.install();
  }

  install() {
    this.canvas.__audraliaCanvasController = this;
    this.canvas.dataset.status = "installed";
    this.resize();

    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(this.resize);
      this.resizeObserver.observe(this.mount.tagName?.toLowerCase() === "canvas" ? this.canvas : this.mount);
    } else {
      window.addEventListener("resize", this.resize, { passive: true });
    }

    this.receipt.status = "installed";
    this.receipt.animation = "ready";
    installReceipt(this.receipt);
  }

  resize() {
    if (this.state.destroyed) return;

    const rect = this.canvas.getBoundingClientRect();
    const mountRect = this.mount.getBoundingClientRect ? this.mount.getBoundingClientRect() : rect;

    const cssWidth = rect.width || mountRect.width || 680;
    const cssHeight = rect.height || mountRect.height || cssWidth;
    const cssSize = Math.max(260, Math.floor(Math.min(cssWidth, cssHeight)));
    const dpr = clamp(window.devicePixelRatio || 1, 1, this.options.devicePixelClamp);
    const size = Math.floor(cssSize * dpr);

    if (this.canvas.width !== size || this.canvas.height !== size) {
      this.canvas.width = size;
      this.canvas.height = size;
    }

    this.state.width = size;
    this.state.height = size;
    this.state.dpr = dpr;
    this.state.radius = Math.floor(size * 0.435);

    const rasterSize = clamp(
      Math.floor(this.options.pixelResolution * dpr),
      this.options.minPixelResolution,
      this.options.maxPixelResolution
    );

    if (this.state.rasterSize !== rasterSize) {
      this.state.rasterSize = rasterSize;
      this.offscreen.width = rasterSize;
      this.offscreen.height = rasterSize;
    }

    this.canvas.dataset.pixelWidth = String(size);
    this.canvas.dataset.pixelHeight = String(size);
    this.canvas.dataset.rasterSize = String(rasterSize);
  }

  start() {
    if (this.state.destroyed || this.state.running) return this;

    this.state.running = true;
    this.state.lastTimestamp = performance.now();
    this.canvas.dataset.status = "running";
    this.receipt.status = "running";
    this.receipt.animation = "active";
    installReceipt(this.receipt);

    this.state.animationFrame = requestAnimationFrame(this.tick);
    return this;
  }

  stop() {
    if (!this.state.running) return this;

    this.state.running = false;
    cancelAnimationFrame(this.state.animationFrame);
    this.canvas.dataset.status = "stopped";
    this.receipt.status = "stopped";
    this.receipt.animation = "stopped";
    installReceipt(this.receipt);

    return this;
  }

  tick(timestamp) {
    if (!this.state.running || this.state.destroyed) return;

    const dt = clamp((timestamp - this.state.lastTimestamp) / 1000, 0, 0.08);

    this.state.lastTimestamp = timestamp;
    this.state.timeSeconds += dt;
    this.state.rotation = wrapLongitude(this.state.rotation + dt * this.options.rotationSpeed);

    this.draw();

    this.state.animationFrame = requestAnimationFrame(this.tick);
  }

  draw() {
    const ctx = this.ctx;
    const width = this.state.width;
    const height = this.state.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = this.state.radius;

    drawSpace(ctx, width, height, this.state.timeSeconds);
    drawAtmosphere(ctx, cx, cy, radius, this.state.timeSeconds);
    renderGlobeRaster(this.offscreen, this.state);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(this.offscreen, cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();

    drawGrid(ctx, cx, cy, radius, this.state.rotation, this.state.timeSeconds);
    drawMotionBands(ctx, cx, cy, radius, this.state.rotation, this.state.timeSeconds);
    drawDepthOverlay(ctx, cx, cy, radius);
    drawAtmosphere(ctx, cx, cy, radius, this.state.timeSeconds);

    this.state.frame += 1;

    if (this.state.frame % 12 === 1 || this.state.frame < 3) {
      const visiblePixels = Object.values(this.state.classificationCounts).reduce(
        (sum, count) => sum + count,
        0
      );

      const landPixels =
        (this.state.classificationCounts.land || 0) +
        (this.state.classificationCounts.coast || 0) +
        (this.state.classificationCounts.highland || 0) +
        (this.state.classificationCounts.glacier || 0);

      this.receipt.status = "running";
      this.receipt.animation = "active";
      this.receipt.frame = this.state.frame;
      this.receipt.rotation = Number(this.state.rotation.toFixed(6));
      this.receipt.rasterSize = this.state.rasterSize;
      this.receipt.classificationCounts = { ...this.state.classificationCounts };
      this.receipt.measuredLandRatio = visiblePixels
        ? Number((landPixels / visiblePixels).toFixed(4))
        : 0;
      this.receipt.samples = sampleProofPixels(ctx, width, height);
      this.receipt.lastFrameAt = new Date().toISOString();

      this.canvas.dataset.frame = String(this.state.frame);
      this.canvas.dataset.rotation = String(this.receipt.rotation);
      this.canvas.dataset.measuredLandRatio = String(this.receipt.measuredLandRatio);
      this.canvas.dataset.visualDefinition = "spherical-depth-refined";
      this.canvas.dataset.sphericalWrapping = "active";
      this.canvas.dataset.coastlineDepth = "active";
      this.canvas.dataset.terrainDefinition = "active";
      this.canvas.dataset.animation = "active";

      installReceipt(this.receipt);
    }
  }

  destroy() {
    this.stop();
    this.state.destroyed = true;

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else {
      window.removeEventListener("resize", this.resize);
    }

    this.canvas.dataset.status = "destroyed";
    this.receipt.status = "destroyed";
    this.receipt.animation = "destroyed";
    installReceipt(this.receipt);

    if (this.canvas.__audraliaCanvasController === this) {
      delete this.canvas.__audraliaCanvasController;
    }
  }
}

function renderAudraliaCanvas(options = {}) {
  const mount = resolveAudraliaMount(options.mount || options.el || options.container || options.target);
  const canvas = prepareCanvas(mount, options);

  if (canvas.__audraliaCanvasController) {
    canvas.__audraliaCanvasController.destroy();
  }

  const controller = new AudraliaCanvasController(canvas, mount, options);
  controller.start();

  window.AudraliaCanvasAuthority.current = controller;
  window.AudraliaCanvasAuthority.receipt = controller.receipt;

  return controller;
}

function mountAudraliaCanvas(options = {}) {
  return renderAudraliaCanvas(options);
}

function startAudraliaCanvas(options = {}) {
  return renderAudraliaCanvas(options);
}

function createAudraliaCanvas(options = {}) {
  return renderAudraliaCanvas(options);
}

function getAudraliaCanvasReceipt() {
  return window.__AUDRALIA_CANVAS_RECEIPT__ || null;
}

function installGlobalAuthority() {
  const existing = window.AudraliaCanvasAuthority || {};

  window.AudraliaCanvasAuthority = {
    ...existing,
    contract: AUDRALIA_CANVAS_CONTRACT,
    render: renderAudraliaCanvas,
    mount: mountAudraliaCanvas,
    start: startAudraliaCanvas,
    create: createAudraliaCanvas,
    sampleSurface: sampleAudraliaSurface,
    getReceipt: getAudraliaCanvasReceipt,
    current: existing.current || null,
    receipt: existing.receipt || null
  };

  window.renderAudraliaCanvas = renderAudraliaCanvas;
  window.mountAudraliaCanvas = mountAudraliaCanvas;
  window.startAudraliaCanvas = startAudraliaCanvas;
  window.createAudraliaCanvas = createAudraliaCanvas;
  window.sampleAudraliaSurface = sampleAudraliaSurface;
}

installGlobalAuthority();

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      const autoMount = document.querySelector("[data-audralia-canvas-auto='true']");
      if (autoMount && !autoMount.querySelector("canvas[data-audralia-canvas-authority='true']")) {
        renderAudraliaCanvas({ mount: autoMount });
      }
    },
    { once: true }
  );
} else {
  const autoMount = document.querySelector("[data-audralia-canvas-auto='true']");
  if (autoMount && !autoMount.querySelector("canvas[data-audralia-canvas-authority='true']")) {
    renderAudraliaCanvas({ mount: autoMount });
  }
}

export {
  AUDRALIA_CANVAS_CONTRACT,
  AudraliaCanvasController,
  renderAudraliaCanvas,
  mountAudraliaCanvas,
  startAudraliaCanvas,
  createAudraliaCanvas,
  sampleAudraliaSurface,
  getAudraliaCanvasReceipt,
  resolveAudraliaMount
};

export default renderAudraliaCanvas;
