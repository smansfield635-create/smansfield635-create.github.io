/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_GLOBE_REFINEMENT_TNT_v2
   Precinct: Audralia visible canvas expression.
   Jurisdiction: canvas creation, spherical globe drawing, animation, sampled surface expression, water-land separation, proof receipts.
   Non-jurisdiction: route shell copy, global showroom layout, Gauges scoring, runtime truth ownership, document.body replacement.
*/

const AUDRALIA_CANVAS_CONTRACT = "AUDRALIA_CANVAS_GLOBE_REFINEMENT_TNT_v2";

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

const DEFAULT_OPTIONS = {
  targetLandRatio: 0.292,
  rotationSpeed: 0.18,
  internalMotionSpeed: 0.85,
  pixelResolution: 448,
  minPixelResolution: 320,
  maxPixelResolution: 640,
  devicePixelClamp: 2,
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
  let accum = 0;

  for (let dz = 0; dz <= 1; dz += 1) {
    for (let dy = 0; dy <= 1; dy += 1) {
      for (let dx = 0; dx <= 1; dx += 1) {
        const weight =
          (dx ? ux : 1 - ux) *
          (dy ? uy : 1 - uy) *
          (dz ? uz : 1 - uz);
        accum += hash3(ix + dx, iy + dy, iz + dz) * weight;
      }
    }
  }

  return accum;
}

function fractalNoise3(x, y, z) {
  let amp = 0.54;
  let freq = 1;
  let total = 0;
  let norm = 0;

  for (let octave = 0; octave < 6; octave += 1) {
    total += valueNoise3(x * freq, y * freq, z * freq) * amp;
    norm += amp;
    freq *= 2.02;
    amp *= 0.51;
  }

  return total / Math.max(0.000001, norm);
}

function sphericalVector(lon, lat) {
  const c = Math.cos(lat);
  return {
    x: Math.sin(lon) * c,
    y: Math.sin(lat),
    z: Math.cos(lon) * c
  };
}

function normalize3(vector) {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
}

function dot3(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function ellipticalContinent(lon, lat, centerLon, centerLat, radiusLon, radiusLat, tilt, strength) {
  const dLon = wrapLongitude(lon - centerLon) * Math.cos(centerLat);
  const dLat = lat - centerLat;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const rx = dLon * ct - dLat * st;
  const ry = dLon * st + dLat * ct;
  const d = Math.sqrt((rx * rx) / (radiusLon * radiusLon) + (ry * ry) / (radiusLat * radiusLat));
  return Math.max(0, 1 - d) * strength;
}

function ridgeBand(lon, lat, anchorLon, anchorLat, length, thickness, bend, strength) {
  const dLon = wrapLongitude(lon - anchorLon);
  const warpedLat =
    anchorLat +
    Math.sin(dLon * 2.1 + bend) * 0.18 +
    Math.sin(dLon * 5.2 - bend) * 0.052;

  const along =
    smoothstep(-length, -length * 0.55, dLon) *
    (1 - smoothstep(length * 0.55, length, dLon));

  const cross = 1 - smoothstep(thickness * 0.35, thickness, Math.abs(lat - warpedLat));
  return along * cross * strength;
}

function polarCap(lat, side) {
  const signedLat = side > 0 ? lat : -lat;
  return smoothstep(1.02, 1.42, signedLat);
}

function sampleAudraliaSurface(lon, lat, timeSeconds = 0) {
  const v = sphericalVector(lon, lat);

  const nBroad = fractalNoise3(v.x * 2.4 + 4.2, v.y * 2.4 - 1.8, v.z * 2.4 + 7.5);
  const nCoast = fractalNoise3(v.x * 8.6 - 3.2, v.y * 8.6 + 5.7, v.z * 8.6 - 0.9);
  const nRough = fractalNoise3(v.x * 18.5 + 11.3, v.y * 18.5 - 4.1, v.z * 18.5 + 2.6);
  const nMineral = fractalNoise3(v.x * 33.0 - 7.4, v.y * 33.0 + 1.9, v.z * 33.0 + 8.1);

  const continentWest =
    ellipticalContinent(lon, lat, -2.62, 0.15, 0.74, 0.38, -0.36, 1.03) +
    ellipticalContinent(lon, lat, -2.05, -0.12, 0.58, 0.30, 0.46, 0.74) +
    ellipticalContinent(lon, lat, -2.88, -0.34, 0.42, 0.22, -0.12, 0.44);

  const continentArc =
    ellipticalContinent(lon, lat, -0.88, -0.02, 0.82, 0.34, 0.14, 0.86) +
    ellipticalContinent(lon, lat, -0.22, 0.20, 0.54, 0.25, -0.62, 0.58) +
    ellipticalContinent(lon, lat, 0.34, -0.18, 0.48, 0.24, 0.36, 0.52);

  const continentEast =
    ellipticalContinent(lon, lat, 1.35, -0.05, 0.64, 0.34, -0.28, 0.9) +
    ellipticalContinent(lon, lat, 1.95, 0.26, 0.42, 0.23, 0.58, 0.52) +
    ellipticalContinent(lon, lat, 1.06, -0.46, 0.34, 0.20, -0.78, 0.43);

  const islandChains =
    ellipticalContinent(lon, lat, 2.64, -0.10, 0.22, 0.13, 0.2, 0.34) +
    ellipticalContinent(lon, lat, -3.05, 0.25, 0.20, 0.12, -0.2, 0.32) +
    ellipticalContinent(lon, lat, 0.76, -0.61, 0.26, 0.12, 0.44, 0.28) +
    ellipticalContinent(lon, lat, 2.28, -0.52, 0.22, 0.10, -0.28, 0.24) +
    ellipticalContinent(lon, lat, -1.28, 0.64, 0.24, 0.12, 0.18, 0.22);

  const ridges =
    ridgeBand(lon, lat, -1.85, 0.0, 1.28, 0.145, 0.7, 0.34) +
    ridgeBand(lon, lat, 0.42, -0.08, 1.18, 0.13, -1.2, 0.29) +
    ridgeBand(lon, lat, 2.15, 0.12, 0.82, 0.12, 2.2, 0.24);

  const polarNorth = polarCap(lat, 1) * (0.58 + nCoast * 0.18);
  const polarSouth = polarCap(lat, -1) * (0.55 + nCoast * 0.18);

  const rawMass = Math.max(continentWest, continentArc, continentEast, islandChains, polarNorth, polarSouth);

  const stress =
    0.11 * Math.sin(lon * 3.4 + lat * 2.6) +
    0.08 * Math.sin(lon * -5.2 + lat * 4.4) +
    0.06 * Math.cos(lon * 7.0 - lat * 2.2);

  const coastBreak = (nCoast - 0.5) * 0.27 + (nRough - 0.5) * 0.11;
  const topology = rawMass + ridges + (nBroad - 0.5) * 0.34 + coastBreak + stress;

  const seaLevel = 0.57;
  const landMask = smoothstep(seaLevel - 0.035, seaLevel + 0.055, topology);
  const land = landMask > 0.48;

  const coastBand =
    smoothstep(seaLevel - 0.07, seaLevel + 0.035, topology) *
    (1 - smoothstep(seaLevel + 0.055, seaLevel + 0.18, topology));

  const shelf = clamp(1 - Math.abs(topology - seaLevel) * 7.8, 0, 1);
  const bathymetry = clamp((seaLevel - topology) * 2.8 + (0.55 - nBroad) * 0.22, 0, 1);
  const deepOcean = smoothstep(0.36, 0.88, bathymetry);

  const mountainLine = clamp(
    ridges * 1.15 + rawMass * 0.28 + (nRough - 0.44) * 0.48 + stress * 0.55,
    0,
    1
  );

  const ancientRelief = clamp(
    landMask * (0.24 + mountainLine * 0.76 + nMineral * 0.22),
    0,
    1
  );

  const glacier = clamp(
    landMask *
      smoothstep(0.62, 0.88, ancientRelief) *
      (smoothstep(0.78, 1.25, Math.abs(lat)) + smoothstep(0.78, 0.96, mountainLine) * 0.46),
    0,
    1
  );

  const waterMotion =
    0.5 +
    0.5 *
      Math.sin(
        lon * 5.8 +
          lat * 7.2 +
          timeSeconds * 0.26 +
          Math.sin(lat * 3.1 + timeSeconds * 0.07)
      );

  const hydration = clamp(
    (1 - landMask) * (0.76 + deepOcean * 0.24) + shelf * 0.28 + coastBand * 0.38 + glacier * 0.52,
    0,
    1
  );

  let classification = "deep-ocean";
  if (!land && shelf > 0.24) classification = "shelf";
  if (land) classification = "land";
  if (land && coastBand > 0.28) classification = "coast";
  if (land && ancientRelief > 0.63) classification = "highland";
  if (glacier > 0.42) classification = "glacier";

  return {
    lon,
    lat,
    vector: v,
    land,
    landMask,
    topology,
    terrain: ancientRelief,
    hydration,
    bathymetry,
    shelf,
    coastBand,
    deepOcean,
    glacier,
    current: waterMotion,
    mineral: nMineral,
    roughness: nRough,
    classification
  };
}

function mixRgb(a, b, t) {
  const u = clamp(t, 0, 1);
  return [
    Math.round(lerp(a[0], b[0], u)),
    Math.round(lerp(a[1], b[1], u)),
    Math.round(lerp(a[2], b[2], u))
  ];
}

function colorForSample(sample, viewNormal) {
  const lightVector = normalize3({ x: -0.46, y: 0.32, z: 0.83 });
  const rawLight = dot3(viewNormal, lightVector);
  const dayLight = smoothstep(-0.24, 0.92, rawLight);
  const rim = smoothstep(0.66, 1.0, Math.hypot(viewNormal.x, viewNormal.y));

  const deep = [5, 18, 38];
  const abyss = [3, 10, 24];
  const ocean = [10, 70, 102];
  const shelf = [38, 138, 148];
  const glowShelf = [82, 196, 198];

  const blackSand = [34, 31, 29];
  const whiteSand = [216, 205, 181];
  const granite = [124, 113, 96];
  const slate = [68, 80, 88];
  const opal = [126, 172, 166];
  const diamond = [210, 228, 224];
  const ice = [226, 238, 240];

  let rgb;

  if (!sample.land) {
    const deepBase = mixRgb(abyss, deep, 1 - sample.deepOcean * 0.35);
    const oceanBase = mixRgb(deepBase, ocean, 1 - sample.deepOcean);
    const shelfBase = mixRgb(oceanBase, shelf, sample.shelf);
    const currentLift = smoothstep(0.48, 1.0, sample.current) * 0.18;
    rgb = mixRgb(shelfBase, glowShelf, sample.shelf * 0.34 + currentLift);
  } else {
    const sandBlend = smoothstep(0.32, 0.82, sample.mineral);
    const sand = mixRgb(blackSand, whiteSand, sandBlend);
    const stoneA = mixRgb(granite, slate, smoothstep(0.24, 0.86, sample.roughness));
    const stoneB = mixRgb(stoneA, opal, sample.terrain * 0.42);
    const stoneC = mixRgb(stoneB, diamond, smoothstep(0.62, 0.98, sample.terrain) * 0.32);
    rgb = mixRgb(stoneC, sand, sample.coastBand * 0.68);
    rgb = mixRgb(rgb, ice, sample.glacier * 0.92);
  }

  const relief = sample.land
    ? (sample.terrain - 0.42) * 26 + sample.coastBand * 14 + sample.glacier * 12
    : sample.shelf * 18 - sample.deepOcean * 16 + (sample.current - 0.5) * 7;

  const shade = clamp(0.24 + dayLight * 0.92 + rim * 0.08, 0, 1.12);
  const limbShade = 1 - rim * 0.38;

  return [
    clamp(Math.round((rgb[0] + relief) * shade * limbShade), 0, 255),
    clamp(Math.round((rgb[1] + relief) * shade * limbShade), 0, 255),
    clamp(Math.round((rgb[2] + relief) * shade * limbShade), 0, 255)
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
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("#audraliaCanvasMount") ||
    document.querySelector("#audraliaMount") ||
    document.querySelector("#audralia-canvas-mount") ||
    document.querySelector("#audralia-stage") ||
    document.querySelector("#audraliaStage") ||
    document.querySelector("#globe-stage") ||
    document.querySelector("#globeStage") ||
    null
  );
}

function prepareCanvas(mount, options) {
  if (!mount) {
    throw new Error("Audralia canvas mount was not found. The route doorway must provide #audraliaCanvasMount.");
  }

  if (mount.tagName && mount.tagName.toLowerCase() === "canvas") {
    mount.dataset.audraliaCanvasAuthority = "true";
    mount.dataset.contract = AUDRALIA_CANVAS_CONTRACT;
    return mount;
  }

  const oldCanvases = Array.from(
    mount.querySelectorAll("canvas[data-audralia-canvas-authority='true'], canvas[data-audralia-canvas]")
  );

  oldCanvases.slice(1).forEach((oldCanvas) => oldCanvas.remove());

  let canvas = oldCanvases[0] || mount.querySelector("canvas#audraliaCanvas");

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
  canvas.style.background = "radial-gradient(circle at 50% 50%, rgba(4,10,18,1), rgba(1,3,8,1))";

  return canvas;
}

function createReceiptBase(canvas, mount, options) {
  return {
    contract: AUDRALIA_CANVAS_CONTRACT,
    status: "initializing",
    precinct: "Audralia visible canvas expression",
    jurisdiction: [
      "canvas creation",
      "spherical globe drawing",
      "animation loop",
      "surface sampling",
      "water land separation",
      "route visible proof receipts"
    ],
    nonJurisdiction: [
      "route shell copy",
      "global showroom layout",
      "Gauges scoring",
      "runtime truth ownership",
      "document.body replacement"
    ],
    mountFound: Boolean(mount),
    canvasFound: Boolean(canvas),
    targetLandRatio: options.targetLandRatio,
    startedAt: new Date().toISOString(),
    frame: 0,
    samples: {},
    classificationCounts: {},
    animation: "pending"
  };
}

function drawStarfield(ctx, width, height, timeSeconds) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.46,
    width * 0.04,
    width * 0.5,
    height * 0.5,
    width * 0.72
  );

  gradient.addColorStop(0, "rgba(18, 35, 54, 0.95)");
  gradient.addColorStop(0.44, "rgba(5, 12, 24, 0.98)");
  gradient.addColorStop(1, "rgba(0, 2, 7, 1)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const count = Math.max(70, Math.floor((width * height) / 7800));

  for (let i = 0; i < count; i += 1) {
    const x = hash3(i, 4, 9) * width;
    const y = hash3(i, 8, 2) * height;
    const pulse = 0.35 + 0.65 * hash3(i, 11, 3);
    const twinkle = 0.45 + 0.35 * Math.sin(timeSeconds * (0.18 + pulse) + i);
    const r = 0.45 + hash3(i, 10, 6) * 1.1;

    ctx.beginPath();
    ctx.fillStyle = `rgba(215, 232, 255, ${0.10 + twinkle * 0.28})`;
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function renderGlobeRaster(offscreen, state) {
  const size = state.rasterSize;
  const ctx = offscreen.getContext("2d", { willReadFrequently: true });
  const image = ctx.createImageData(size, size);
  const data = image.data;
  const timeSeconds = state.timeSeconds;
  const rotation = state.rotation;

  const counts = {
    land: 0,
    coast: 0,
    highland: 0,
    glacier: 0,
    shelf: 0,
    "deep-ocean": 0
  };

  const cosRot = Math.cos(rotation);
  const sinRot = Math.sin(rotation);

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
      const viewNormal = { x, y, z };
      const wx = x * cosRot + z * sinRot;
      const wz = z * cosRot - x * sinRot;
      const lon = wrapLongitude(Math.atan2(wx, wz));
      const lat = Math.asin(y);
      const sample = sampleAudraliaSurface(lon, lat, timeSeconds);

      counts[sample.classification] = (counts[sample.classification] || 0) + 1;

      const rgb = colorForSample(sample, viewNormal);
      const rim = smoothstep(0.78, 1.0, Math.sqrt(rr));
      const alpha = Math.round(255 * (1 - rim * 0.08));

      data[index] = rgb[0];
      data[index + 1] = rgb[1];
      data[index + 2] = rgb[2];
      data[index + 3] = alpha;
    }
  }

  ctx.putImageData(image, 0, 0);
  state.classificationCounts = counts;
}

function drawRasterToMain(ctx, offscreen, cx, cy, radius) {
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(offscreen, cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();
}

function drawAtmosphere(ctx, cx, cy, radius, timeSeconds) {
  ctx.save();

  const aura = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.26);
  aura.addColorStop(0, "rgba(48, 168, 190, 0)");
  aura.addColorStop(0.70, "rgba(68, 178, 204, 0.11)");
  aura.addColorStop(0.91, "rgba(152, 221, 232, 0.27)");
  aura.addColorStop(1, "rgba(152, 221, 232, 0)");

  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.26, 0, TAU);
  ctx.fill();

  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = `rgba(183, 232, 238, ${0.18 + 0.04 * Math.sin(timeSeconds * 0.7)})`;
  ctx.lineWidth = Math.max(1, radius * 0.012);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.004, 0, TAU);
  ctx.stroke();

  ctx.restore();
}

function drawLatitudeLongitude(ctx, cx, cy, radius, rotation, timeSeconds) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  ctx.lineWidth = Math.max(0.5, radius * 0.0024);

  for (let lat = -60; lat <= 60; lat += 20) {
    const y = cy - Math.sin((lat * Math.PI) / 180) * radius;
    const ry = Math.cos((lat * Math.PI) / 180) * radius;

    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = "rgba(222, 242, 238, 1)";
    ctx.beginPath();
    ctx.ellipse(cx, y, ry, radius * 0.055, 0, 0, TAU);
    ctx.stroke();
  }

  for (let lon = 0; lon < 360; lon += 20) {
    const phase = rotation + (lon * Math.PI) / 180;
    const visible = Math.cos(phase);

    ctx.globalAlpha = 0.028 + Math.abs(visible) * 0.082;
    ctx.strokeStyle = "rgba(222, 242, 238, 1)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.abs(visible) * radius, radius, 0, -HALF_PI, HALF_PI);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.strokeStyle = `rgba(180, 238, 238, ${0.14 + 0.04 * Math.sin(timeSeconds * 0.43)})`;
  ctx.lineWidth = Math.max(1, radius * 0.004);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.996, 0, TAU);
  ctx.stroke();

  ctx.restore();
}

function drawCloudAndCurrentBands(ctx, cx, cy, radius, rotation, timeSeconds) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.998, 0, TAU);
  ctx.clip();

  ctx.globalCompositeOperation = "screen";

  for (let band = 0; band < 11; band += 1) {
    const lat = lerp(-0.9, 0.9, band / 10);
    const y = cy - Math.sin(lat) * radius;
    const ry = Math.cos(lat) * radius * (0.86 + 0.06 * Math.sin(timeSeconds * 0.16 + band));
    const phase = rotation * 0.52 + band * 0.76 + timeSeconds * 0.09;
    const alpha = 0.028 + 0.024 * Math.sin(timeSeconds * 0.31 + band * 1.7);

    ctx.strokeStyle = `rgba(218, 240, 236, ${alpha})`;
    ctx.lineWidth = Math.max(1, radius * (0.0048 + band * 0.00028));
    ctx.setLineDash([radius * 0.17, radius * 0.1, radius * 0.045, radius * 0.13]);
    ctx.lineDashOffset = -phase * radius * 0.16;

    ctx.beginPath();
    ctx.ellipse(cx, y, ry, radius * 0.027, Math.sin(phase) * 0.08, 0, TAU);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.restore();
}

function drawShadowAndDepth(ctx, cx, cy, radius) {
  ctx.save();

  const shade = ctx.createRadialGradient(
    cx - radius * 0.34,
    cy - radius * 0.24,
    radius * 0.08,
    cx,
    cy,
    radius
  );

  shade.addColorStop(0, "rgba(255,255,255,0.12)");
  shade.addColorStop(0.42, "rgba(255,255,255,0.018)");
  shade.addColorStop(0.76, "rgba(0,0,0,0.08)");
  shade.addColorStop(1, "rgba(0,0,0,0.48)");

  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.fill();

  ctx.globalCompositeOperation = "screen";

  const highlight = ctx.createRadialGradient(
    cx - radius * 0.38,
    cy - radius * 0.3,
    0,
    cx - radius * 0.38,
    cy - radius * 0.3,
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

function dispatchCanvasEvent(name, detail) {
  window.dispatchEvent(
    new CustomEvent(name, {
      detail,
      bubbles: false,
      cancelable: false
    })
  );
}

class AudraliaCanvasController {
  constructor(canvas, mount, options = {}) {
    this.canvas = canvas;
    this.mount = mount;
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    };

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

    dispatchCanvasEvent("audralia:canvas-installed", {
      contract: AUDRALIA_CANVAS_CONTRACT,
      controller: this
    });
  }

  resize() {
    if (this.state.destroyed) return;

    const rect = this.canvas.getBoundingClientRect();
    const mountRect = this.mount && this.mount.getBoundingClientRect ? this.mount.getBoundingClientRect() : rect;

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
    if (this.state.destroyed) return this;
    if (this.state.running) return this;

    this.state.running = true;
    this.state.lastTimestamp = performance.now();
    this.canvas.dataset.status = "running";

    this.receipt.status = "running";
    this.receipt.animation = "active";
    installReceipt(this.receipt);

    this.state.animationFrame = requestAnimationFrame(this.tick);

    dispatchCanvasEvent("audralia:canvas-started", {
      contract: AUDRALIA_CANVAS_CONTRACT,
      controller: this
    });

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

    drawStarfield(ctx, width, height, this.state.timeSeconds);
    drawAtmosphere(ctx, cx, cy, radius, this.state.timeSeconds);
    renderGlobeRaster(this.offscreen, this.state);
    drawRasterToMain(ctx, this.offscreen, cx, cy, radius);
    drawLatitudeLongitude(ctx, cx, cy, radius, this.state.rotation, this.state.timeSeconds);
    drawCloudAndCurrentBands(ctx, cx, cy, radius, this.state.rotation, this.state.timeSeconds);
    drawShadowAndDepth(ctx, cx, cy, radius);
    drawAtmosphere(ctx, cx, cy, radius, this.state.timeSeconds);

    this.state.frame += 1;

    if (this.state.frame % 12 === 1 || this.state.frame < 3) {
      this.receipt.status = "running";
      this.receipt.animation = "active";
      this.receipt.frame = this.state.frame;
      this.receipt.rotation = Number(this.state.rotation.toFixed(6));
      this.receipt.rasterSize = this.state.rasterSize;
      this.receipt.classificationCounts = { ...this.state.classificationCounts };
      this.receipt.samples = sampleProofPixels(ctx, width, height);
      this.receipt.lastFrameAt = new Date().toISOString();

      const visiblePixels = Object.values(this.receipt.classificationCounts).reduce((sum, count) => sum + count, 0);

      const landPixels =
        (this.receipt.classificationCounts.land || 0) +
        (this.receipt.classificationCounts.coast || 0) +
        (this.receipt.classificationCounts.highland || 0) +
        (this.receipt.classificationCounts.glacier || 0);

      this.receipt.measuredLandRatio = visiblePixels
        ? Number((landPixels / visiblePixels).toFixed(4))
        : 0;

      this.canvas.dataset.frame = String(this.state.frame);
      this.canvas.dataset.rotation = String(this.receipt.rotation);
      this.canvas.dataset.measuredLandRatio = String(this.receipt.measuredLandRatio);
      this.canvas.dataset.visualDefinition = "refined";
      this.canvas.dataset.sphericalWrapping = "active";
      this.canvas.dataset.waterLandSeparation = "active";
      this.canvas.dataset.animation = "active";

      installReceipt(this.receipt);
    }

    if (this.state.frame % 60 === 1) {
      dispatchCanvasEvent("audralia:canvas-frame", {
        contract: AUDRALIA_CANVAS_CONTRACT,
        frame: this.state.frame,
        receipt: this.receipt
      });
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
