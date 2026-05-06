/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_ADOPTED_CANVAS_AUTHORITY_TNT_v1
   Precinct: Audralia visible canvas expression.
   Jurisdiction: canvas creation, globe drawing, animation, surface sampling, route-visible proof receipts.
   Non-jurisdiction: route shell copy, global showroom layout, Gauges scoring, runtime truth ownership.
*/

const AUDRALIA_CANVAS_CONTRACT = "AUDRALIA_ADOPTED_CANVAS_AUTHORITY_TNT_v1";

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

const DEFAULT_OPTIONS = {
  targetLandRatio: 0.292,
  rotationSpeed: 0.105,
  internalMotionSpeed: 0.72,
  pixelResolution: 384,
  minPixelResolution: 256,
  maxPixelResolution: 520,
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

  for (let octave = 0; octave < 5; octave += 1) {
    total += valueNoise3(x * freq, y * freq, z * freq) * amp;
    norm += amp;
    freq *= 2.04;
    amp *= 0.52;
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

function angularDistance(lonA, latA, lonB, latB) {
  const sinA = Math.sin(latA);
  const sinB = Math.sin(latB);
  const cosA = Math.cos(latA);
  const cosB = Math.cos(latB);
  const cosDelta = Math.cos(wrapLongitude(lonA - lonB));
  const v = clamp(sinA * sinB + cosA * cosB * cosDelta, -1, 1);
  return Math.acos(v);
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

function sampleAudraliaSurface(lon, lat, timeSeconds = 0) {
  const v = sphericalVector(lon, lat);

  const n1 = fractalNoise3(v.x * 2.8 + 10.1, v.y * 2.8 - 4.2, v.z * 2.8 + 3.7);
  const n2 = fractalNoise3(v.x * 7.4 - 1.3, v.y * 7.4 + 2.5, v.z * 7.4 - 8.2);
  const n3 = fractalNoise3(v.x * 15.2 + 9.5, v.y * 15.2 + 1.1, v.z * 15.2 - 2.6);

  const westernMass =
    ellipticalContinent(lon, lat, -2.42, 0.18, 0.92, 0.48, -0.38, 1.05) +
    ellipticalContinent(lon, lat, -1.88, -0.08, 0.72, 0.40, 0.52, 0.82) +
    ellipticalContinent(lon, lat, -2.82, -0.28, 0.58, 0.31, -0.12, 0.62);

  const centralMass =
    ellipticalContinent(lon, lat, -0.58, -0.02, 1.26, 0.50, 0.18, 1.16) +
    ellipticalContinent(lon, lat, 0.12, 0.18, 0.82, 0.34, -0.58, 0.78) +
    ellipticalContinent(lon, lat, -1.08, 0.31, 0.62, 0.28, 0.76, 0.52);

  const easternMass =
    ellipticalContinent(lon, lat, 1.52, -0.06, 0.88, 0.44, -0.34, 1.0) +
    ellipticalContinent(lon, lat, 2.12, 0.28, 0.54, 0.30, 0.62, 0.68) +
    ellipticalContinent(lon, lat, 1.06, -0.42, 0.42, 0.26, -0.78, 0.48);

  const islandArc =
    ellipticalContinent(lon, lat, 2.78, -0.04, 0.34, 0.18, 0.18, 0.42) +
    ellipticalContinent(lon, lat, -3.02, 0.24, 0.28, 0.16, -0.2, 0.36) +
    ellipticalContinent(lon, lat, 0.72, -0.58, 0.42, 0.17, 0.44, 0.34);

  const polarNorth = smoothstep(1.03, 1.37, lat) * 0.72;
  const polarSouth = smoothstep(1.02, 1.35, -lat) * 0.68;

  const rawContinents = Math.max(
    westernMass,
    centralMass,
    easternMass,
    islandArc,
    polarNorth,
    polarSouth
  );

  const tectonicRidge =
    0.18 * Math.sin(lon * 4.0 + lat * 2.2) +
    0.12 * Math.sin(lon * -2.7 + lat * 5.4) +
    0.10 * Math.cos(lon * 6.3 - lat * 1.7);

  const topology = rawContinents + (n1 - 0.5) * 0.42 + (n2 - 0.5) * 0.18 + tectonicRidge;
  const coastBand = smoothstep(0.48, 0.62, topology) * (1 - smoothstep(0.62, 0.78, topology));
  const landMask = smoothstep(0.575, 0.66, topology);
  const land = landMask > 0.47;

  const mountainSeed =
    Math.max(0, rawContinents - 0.34) *
    (0.52 + n2 * 0.68) *
    (0.65 + n3 * 0.45);

  const ancientRelief = clamp(
    mountainSeed + tectonicRidge * 0.25 + (n3 - 0.5) * 0.34,
    0,
    1
  );

  const glacier =
    landMask *
    smoothstep(0.58, 0.86, ancientRelief) *
    (smoothstep(0.78, 1.2, Math.abs(lat)) + smoothstep(0.76, 0.94, ancientRelief) * 0.42);

  const bathymetry = clamp((0.575 - topology) * 2.8 + (0.5 - n1) * 0.22, 0, 1);
  const shelf = clamp(1 - Math.abs(topology - 0.575) * 8.0, 0, 1);
  const deepOcean = smoothstep(0.35, 0.82, bathymetry);
  const current =
    0.5 +
    0.5 *
      Math.sin(
        lon * 5.0 +
          lat * 8.0 +
          timeSeconds * 0.16 +
          Math.sin(lat * 3.0 + timeSeconds * 0.05)
      );

  const hydration = clamp((1 - landMask) * (0.78 + deepOcean * 0.22) + coastBand * 0.38 + glacier * 0.46, 0, 1);

  let classification = "deep-ocean";
  if (land) classification = "land";
  if (land && coastBand > 0.24) classification = "coast";
  if (land && ancientRelief > 0.65) classification = "highland";
  if (glacier > 0.42) classification = "glacier";
  if (!land && shelf > 0.26) classification = "shelf";
  if (!land && deepOcean > 0.72) classification = "deep-ocean";

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
    current,
    classification
  };
}

function mixRgb(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t))
  ];
}

function rgbString(rgb, alpha = 1) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function colorForSample(sample, light, rim, timeSeconds) {
  const deep = [8, 24, 48];
  const ocean = [13, 64, 96];
  const shelf = [42, 122, 132];
  const coastWater = [76, 156, 150];

  const blackSand = [28, 29, 31];
  const whiteSand = [214, 205, 184];
  const granite = [91, 84, 74];
  const slate = [54, 66, 78];
  const opal = [122, 156, 154];
  const diamond = [198, 220, 218];
  const highIce = [226, 236, 236];

  let rgb;

  if (!sample.land) {
    const oceanBase = mixRgb(deep, ocean, 1 - sample.deepOcean);
    const shelfBase = mixRgb(oceanBase, shelf, sample.shelf);
    const currentLift = smoothstep(0.52, 1.0, sample.current) * 0.18;
    rgb = mixRgb(shelfBase, coastWater, currentLift + sample.shelf * 0.22);
  } else {
    const mineralNoise = fractalNoise3(
      sample.vector.x * 22.0 + 1.4,
      sample.vector.y * 22.0 - 2.8,
      sample.vector.z * 22.0 + timeSeconds * 0.006
    );

    const sand = mixRgb(blackSand, whiteSand, smoothstep(0.35, 0.78, mineralNoise));
    const stoneA = mixRgb(granite, slate, smoothstep(0.2, 0.9, mineralNoise));
    const stoneB = mixRgb(stoneA, opal, sample.terrain * 0.36);
    const stoneC = mixRgb(stoneB, diamond, smoothstep(0.68, 0.98, sample.terrain) * 0.28);

    rgb = mixRgb(stoneC, sand, sample.coastBand * 0.72);
    rgb = mixRgb(rgb, highIce, clamp(sample.glacier, 0, 0.92));
  }

  const shade = clamp(0.28 + light * 0.88 + rim * 0.18, 0, 1.18);
  return [
    clamp(Math.round(rgb[0] * shade), 0, 255),
    clamp(Math.round(rgb[1] * shade), 0, 255),
    clamp(Math.round(rgb[2] * shade), 0, 255)
  ];
}

function resolveElement(target) {
  if (!target) return null;
  if (typeof target === "string") return document.querySelector(target);
  if (target instanceof Element) return target;
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
    document.querySelector("#globe-main") ||
    document.querySelector("main") ||
    document.body
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

  let canvas =
    mount.querySelector(":scope > canvas[data-audralia-canvas-authority='true']") ||
    mount.querySelector("canvas#audraliaCanvas") ||
    mount.querySelector("canvas[data-audralia-canvas]");

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

  if (mount !== document.body) {
    const existingPosition = window.getComputedStyle(mount).position;
    if (existingPosition === "static") mount.style.position = "relative";
    if (!mount.style.minHeight) mount.style.minHeight = "min(78vw, 680px)";
  }

  return canvas;
}

function createReceiptBase(canvas, mount, options) {
  return {
    contract: AUDRALIA_CANVAS_CONTRACT,
    status: "initializing",
    precinct: "Audralia visible canvas expression",
    jurisdiction: [
      "canvas creation",
      "globe drawing",
      "animation loop",
      "surface sampling",
      "water land separation",
      "route visible proof receipts"
    ],
    nonJurisdiction: [
      "route shell copy",
      "global showroom layout",
      "Gauges scoring",
      "runtime truth ownership"
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
    width * 0.52,
    height * 0.45,
    width * 0.06,
    width * 0.5,
    height * 0.5,
    width * 0.72
  );

  gradient.addColorStop(0, "rgba(16, 25, 42, 0.95)");
  gradient.addColorStop(0.46, "rgba(5, 10, 20, 0.98)");
  gradient.addColorStop(1, "rgba(0, 2, 7, 1)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const count = Math.max(60, Math.floor((width * height) / 9400));
  for (let i = 0; i < count; i += 1) {
    const x = hash3(i, 4, 9) * width;
    const y = hash3(i, 8, 2) * height;
    const pulse = 0.35 + 0.65 * hash3(i, 11, 3);
    const twinkle = 0.45 + 0.35 * Math.sin(timeSeconds * (0.22 + pulse) + i);
    const r = 0.55 + hash3(i, 10, 6) * 1.2;

    ctx.beginPath();
    ctx.fillStyle = `rgba(215, 232, 255, ${0.12 + twinkle * 0.34})`;
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawAtmosphere(ctx, cx, cy, radius, timeSeconds) {
  ctx.save();

  const aura = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.22);
  aura.addColorStop(0, "rgba(48, 168, 190, 0)");
  aura.addColorStop(0.72, "rgba(68, 178, 204, 0.10)");
  aura.addColorStop(0.92, "rgba(152, 221, 232, 0.24)");
  aura.addColorStop(1, "rgba(152, 221, 232, 0)");

  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.22, 0, TAU);
  ctx.fill();

  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = `rgba(183, 232, 238, ${0.16 + 0.04 * Math.sin(timeSeconds * 0.7)})`;
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

  ctx.lineWidth = Math.max(0.5, radius * 0.0028);
  ctx.strokeStyle = "rgba(222, 242, 238, 0.115)";

  for (let lat = -60; lat <= 60; lat += 20) {
    const y = cy - Math.sin((lat * Math.PI) / 180) * radius;
    const ry = Math.cos((lat * Math.PI) / 180) * radius;

    ctx.beginPath();
    ctx.ellipse(cx, y, ry, radius * 0.055, 0, 0, TAU);
    ctx.stroke();
  }

  for (let lon = 0; lon < 360; lon += 20) {
    const phase = rotation + (lon * Math.PI) / 180;
    const xOffset = Math.sin(phase) * radius;
    const visible = Math.cos(phase);

    ctx.beginPath();
    ctx.ellipse(
      cx + xOffset * 0.012,
      cy,
      Math.abs(visible) * radius,
      radius,
      0,
      -HALF_PI,
      HALF_PI
    );
    ctx.globalAlpha = 0.045 + Math.abs(visible) * 0.075;
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

  for (let band = 0; band < 9; band += 1) {
    const lat = lerp(-0.82, 0.82, band / 8);
    const y = cy - Math.sin(lat) * radius;
    const ry = Math.cos(lat) * radius * (0.84 + 0.08 * Math.sin(timeSeconds * 0.15 + band));
    const phase = rotation * 0.42 + band * 0.7 + timeSeconds * 0.06;
    const alpha = 0.025 + 0.025 * Math.sin(timeSeconds * 0.31 + band * 1.7);

    ctx.strokeStyle = `rgba(218, 240, 236, ${alpha})`;
    ctx.lineWidth = Math.max(1, radius * (0.006 + band * 0.00035));
    ctx.setLineDash([radius * 0.16, radius * 0.09, radius * 0.04, radius * 0.12]);
    ctx.lineDashOffset = -phase * radius * 0.12;

    ctx.beginPath();
    ctx.ellipse(cx, y, ry, radius * 0.032, Math.sin(phase) * 0.08, 0, TAU);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.restore();
}

function renderGlobeRaster(offscreen, state, options) {
  const size = state.rasterSize;
  const ctx = offscreen.getContext("2d", { willReadFrequently: true });
  const image = ctx.createImageData(size, size);
  const data = image.data;

  const timeSeconds = state.timeSeconds;
  const rotation = state.rotation;
  const lightVector = {
    x: -0.45,
    y: 0.28,
    z: 0.84
  };

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
      const lon = wrapLongitude(Math.atan2(x, z) + rotation);
      const lat = Math.asin(y);

      const sample = sampleAudraliaSurface(lon, lat, timeSeconds);
      counts[sample.classification] = (counts[sample.classification] || 0) + 1;

      const light = clamp(
        sample.vector.x * lightVector.x +
          sample.vector.y * lightVector.y +
          sample.vector.z * lightVector.z,
        -0.3,
        1
      );

      const rim = smoothstep(0.48, 1.0, Math.sqrt(rr));
      const rgb = colorForSample(sample, light, rim, timeSeconds);

      const reliefShadow = sample.land
        ? (sample.terrain - 0.46) * 20 + sample.coastBand * 12
        : sample.shelf * 10 - sample.deepOcean * 12;

      const terminator = smoothstep(-0.18, 0.88, light);
      const edgeFade = 1 - smoothstep(0.84, 1.02, Math.sqrt(rr)) * 0.32;

      data[index] = clamp(rgb[0] + reliefShadow, 0, 255);
      data[index + 1] = clamp(rgb[1] + reliefShadow, 0, 255);
      data[index + 2] = clamp(rgb[2] + reliefShadow, 0, 255);
      data[index + 3] = Math.round(255 * edgeFade * (0.72 + terminator * 0.28));
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

function drawShadowAndDepth(ctx, cx, cy, radius) {
  ctx.save();

  const shade = ctx.createRadialGradient(
    cx - radius * 0.32,
    cy - radius * 0.22,
    radius * 0.1,
    cx,
    cy,
    radius
  );

  shade.addColorStop(0, "rgba(255,255,255,0.10)");
  shade.addColorStop(0.42, "rgba(255,255,255,0.015)");
  shade.addColorStop(0.76, "rgba(0,0,0,0.10)");
  shade.addColorStop(1, "rgba(0,0,0,0.58)");

  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.fill();

  ctx.globalCompositeOperation = "screen";
  const highlight = ctx.createRadialGradient(
    cx - radius * 0.36,
    cy - radius * 0.28,
    0,
    cx - radius * 0.36,
    cy - radius * 0.28,
    radius * 0.72
  );

  highlight.addColorStop(0, "rgba(255,255,255,0.20)");
  highlight.addColorStop(0.38, "rgba(255,255,255,0.07)");
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
      this.resizeObserver.observe(this.mount === document.body ? this.canvas : this.mount);
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

    const cssSize = Math.max(
      260,
      Math.floor(
        Math.min(
          rect.width || mountRect.width || 680,
          rect.height || mountRect.height || rect.width || mountRect.width || 680
        )
      )
    );

    const dpr = clamp(window.devicePixelRatio || 1, 1, this.options.devicePixelClamp);
    const size = Math.floor(cssSize * dpr);

    if (this.canvas.width !== size || this.canvas.height !== size) {
      this.canvas.width = size;
      this.canvas.height = size;
    }

    this.state.width = size;
    this.state.height = size;
    this.state.dpr = dpr;
    this.state.radius = Math.floor(size * 0.43);

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

    renderGlobeRaster(this.offscreen, this.state, this.options);
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
      this.canvas.dataset.visualDefinition = "active";
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
    canvas.__audraliaCanvasController.stop();
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
