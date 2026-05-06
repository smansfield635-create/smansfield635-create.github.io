/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_TERRAIN_RELIEF_AND_MINERAL_DEPTH_TNT_v8
   Jurisdiction: canvas creation, cached terrain surface, mineral depth, elevation bands, hydrology-ready cuts, mobile budget governor, low-lag spherical projection, receipts.
   Non-jurisdiction: HTML shell, route doorway, document.body mutation, Gauges scoring, image generation, GraphicBox.
*/

const AUDRALIA_CANVAS_CONTRACT = "AUDRALIA_CANVAS_TERRAIN_RELIEF_AND_MINERAL_DEPTH_TNT_v8";

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

const DEFAULT_OPTIONS = {
  rotationSpeed: 0.11,
  initialRotation: -2.18,
  mobileTextureWidth: 384,
  balancedTextureWidth: 512,
  desktopTextureWidth: 640,
  mobileRasterSize: 220,
  balancedRasterSize: 280,
  desktopRasterSize: 340,
  mobileFps: 8,
  balancedFps: 10,
  desktopFps: 14,
  devicePixelClamp: 1.25,
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

function waveNoise(lon, lat, scale, phase) {
  return (
    0.5 +
    0.5 *
      (
        Math.sin(lon * scale + phase) * 0.45 +
        Math.cos(lat * scale * 0.83 - phase * 0.7) * 0.32 +
        Math.sin((lon + lat) * scale * 0.47 + phase * 1.3) * 0.23
      )
  );
}

function continentCap(point, centerLon, centerLat, radius, strength, warp) {
  const center = sphericalVector(centerLon, centerLat);
  const d = angularDistance(point, center);
  const noise = waveNoise(centerLon + point.x, centerLat + point.y, 5.2, warp);
  const brokenRadius = radius * (0.88 + noise * 0.24);
  return Math.max(0, 1 - d / Math.max(0.001, brokenRadius)) * strength;
}

function plateCurve(lon, lat, centerLon, centerLat, length, thickness, phase, bend, strength) {
  const dLon = wrapLongitude(lon - centerLon);

  const trail =
    centerLat +
    Math.sin(dLon * 1.8 + phase) * bend +
    Math.sin(dLon * 4.8 - phase) * bend * 0.22;

  const along =
    smoothstep(-length, -length * 0.76, dLon) *
    (1 - smoothstep(length * 0.76, length, dLon));

  const cross = 1 - smoothstep(thickness * 0.28, thickness, Math.abs(lat - trail));
  return along * cross * strength;
}

function sampleAudraliaSurface(lon, lat) {
  const p = sphericalVector(lon, lat);

  const broad = waveNoise(lon, lat, 2.2, 0.7);
  const coastNoise = waveNoise(lon, lat, 7.6, 2.1);
  const rough = waveNoise(lon, lat, 15.0, 4.4);
  const mineral = waveNoise(lon, lat, 24.0, 6.2);
  const basinNoise = waveNoise(lon, lat, 4.6, 9.1);
  const erosionNoise = waveNoise(lon, lat, 18.0, 12.4);
  const fractureNoise = waveNoise(lon, lat, 10.5, 18.2);

  const west =
    continentCap(p, -2.55, 0.08, 0.6, 1.08, 1.1) +
    continentCap(p, -2.02, -0.18, 0.43, 0.72, 2.2) +
    continentCap(p, -2.94, -0.28, 0.31, 0.38, 3.3) +
    continentCap(p, -2.35, 0.42, 0.22, 0.28, 15.1);

  const middle =
    continentCap(p, -0.82, -0.04, 0.54, 0.76, 4.4) +
    continentCap(p, -0.28, 0.2, 0.36, 0.5, 5.5) +
    continentCap(p, 0.28, -0.18, 0.32, 0.38, 6.6) +
    continentCap(p, -1.34, -0.46, 0.24, 0.26, 16.2) +
    continentCap(p, -1.48, 0.24, 0.2, 0.24, 17.3);

  const east =
    continentCap(p, 1.28, -0.06, 0.45, 0.78, 7.7) +
    continentCap(p, 1.84, 0.22, 0.3, 0.42, 8.8) +
    continentCap(p, 1.02, -0.42, 0.24, 0.32, 9.9);

  const islands =
    continentCap(p, 2.52, -0.08, 0.18, 0.28, 10.1) +
    continentCap(p, -3.02, 0.24, 0.17, 0.24, 11.2) +
    continentCap(p, 0.74, -0.62, 0.18, 0.22, 12.3) +
    continentCap(p, -1.24, 0.62, 0.13, 0.16, 14.5);

  const northPole = smoothstep(1.06, 1.45, lat) * (0.52 + coastNoise * 0.16);
  const southPole = smoothstep(1.06, 1.45, -lat) * (0.5 + coastNoise * 0.16);
  const rawLand = Math.max(west, middle, east, islands, northPole, southPole);

  const continentalRidge =
    plateCurve(lon, lat, -2.2, -0.04, 0.95, 0.095, 0.6, 0.16, 0.25) +
    plateCurve(lon, lat, -0.35, 0.02, 0.88, 0.085, -1.2, 0.12, 0.22) +
    plateCurve(lon, lat, 1.48, 0.06, 0.74, 0.08, 2.1, 0.1, 0.2);

  const midOceanRidge =
    plateCurve(lon, lat, -0.08, 0.04, 1.72, 0.105, 0.35, 0.22, 0.45) +
    plateCurve(lon, lat, 2.38, -0.02, 1.15, 0.09, 1.6, 0.17, 0.28);

  const subductionTrench =
    plateCurve(lon, lat, -1.58, -0.32, 1.18, 0.11, -0.45, 0.2, 0.34) +
    plateCurve(lon, lat, 0.98, 0.34, 1.05, 0.1, 1.25, 0.18, 0.3) +
    plateCurve(lon, lat, 2.72, -0.28, 0.78, 0.09, -1.8, 0.16, 0.24);

  const tectonicMemory =
    Math.sin(lon * 3.8 + lat * 2.1) * 0.06 +
    Math.sin(lon * -5.2 + lat * 4.2) * 0.035;

  const topology =
    rawLand +
    continentalRidge +
    (broad - 0.5) * 0.2 +
    (coastNoise - 0.5) * 0.16 +
    tectonicMemory;

  const seaLevel = 0.536;
  const landMask = smoothstep(seaLevel - 0.026, seaLevel + 0.046, topology);
  const land = landMask > 0.5;

  const coastBand =
    smoothstep(seaLevel - 0.08, seaLevel + 0.02, topology) *
    (1 - smoothstep(seaLevel + 0.05, seaLevel + 0.18, topology));

  const shelf = clamp(1 - Math.abs(topology - seaLevel) * 7.2, 0, 1);
  const slope = clamp(1 - Math.abs(topology - (seaLevel - 0.12)) * 6.4, 0, 1) * (1 - landMask);

  const basinFloor = clamp(
    (seaLevel - topology) * 2.0 +
      (0.58 - broad) * 0.2 +
      (basinNoise - 0.5) * 0.24,
    0,
    1
  );

  const ridgeUplift = clamp(midOceanRidge * (1 - landMask), 0, 1);
  const trenchDepth = clamp(subductionTrench * (1 - landMask), 0, 1);

  const bathymetry = clamp(
    basinFloor * 0.7 +
      trenchDepth * 0.22 -
      shelf * 0.46 -
      slope * 0.16 -
      ridgeUplift * 0.3,
    0,
    1
  );

  const abyssalPlain = smoothstep(0.54, 0.82, bathymetry) * (1 - trenchDepth * 0.38);
  const midOcean = (1 - landMask) * smoothstep(0.18, 0.46, bathymetry) * (1 - smoothstep(0.72, 0.94, bathymetry));
  const shallowShelf = shelf * (1 - landMask);

  const mountain = clamp(
    continentalRidge * 1.45 +
      landMask * (rough - 0.34) * 0.7 +
      rawLand * 0.2 +
      tectonicMemory * 1.1,
    0,
    1
  );

  const plateau = clamp(
    landMask *
      smoothstep(0.52, 0.78, rawLand + broad * 0.2 + continentalRidge * 0.35) *
      (0.45 + rough * 0.55),
    0,
    1
  );

  const terrain = clamp(
    landMask *
      (
        0.16 +
        mountain * 0.58 +
        plateau * 0.3 +
        mineral * 0.12 +
        fractureNoise * 0.08
      ),
    0,
    1
  );

  const highland = clamp(landMask * smoothstep(0.5, 0.78, terrain + mountain * 0.24), 0, 1);
  const summit = clamp(landMask * smoothstep(0.74, 0.96, terrain + mountain * 0.18), 0, 1);
  const lowland = clamp(landMask * (1 - coastBand) * (1 - smoothstep(0.42, 0.72, terrain)), 0, 1);

  const glacier = clamp(
    landMask *
      smoothstep(0.72, 0.96, terrain) *
      (
        smoothstep(0.8, 1.28, Math.abs(lat)) * 0.82 +
        smoothstep(0.82, 0.98, mountain) * 0.28
      ),
    0,
    1
  );

  const erosionChannels = clamp(
    landMask *
      (1 - coastBand * 0.4) *
      smoothstep(0.48, 0.92, mountain + plateau * 0.4) *
      smoothstep(0.52, 0.98, erosionNoise) *
      (0.5 + Math.abs(Math.sin(lon * 9.0 + lat * 11.0)) * 0.5),
    0,
    1
  );

  const hydrologyCuts = clamp(
    erosionChannels * (0.42 + glacier * 0.38 + coastBand * 0.2),
    0,
    1
  );

  const runoff = clamp(coastBand * (0.28 + glacier * 0.36 + mountain * 0.18) + hydrologyCuts * 0.22, 0, 1);

  const diamond = clamp(summit * 0.42 + mineral * 0.22 + glacier * 0.18, 0, 1);
  const opal = clamp((0.5 + Math.sin(lon * 2.4 - lat * 3.1) * 0.5) * terrain * 0.62 + runoff * 0.2, 0, 1);
  const granite = clamp(lowland * 0.35 + plateau * 0.44 + rough * 0.22, 0, 1);
  const slate = clamp(highland * 0.36 + fractureNoise * 0.34 + erosionChannels * 0.28, 0, 1);

  let elevationClass = "ocean";
  if (land) elevationClass = "lowland";
  if (land && coastBand > 0.26) elevationClass = "coast";
  if (land && plateau > 0.36) elevationClass = "plateau";
  if (land && highland > 0.42) elevationClass = "highland";
  if (land && summit > 0.36) elevationClass = "summit";
  if (glacier > 0.38) elevationClass = "glacier";

  let mineralClass = "ocean";
  if (land) mineralClass = "granite";
  if (land && slate > granite && slate > opal) mineralClass = "slate";
  if (land && opal > granite && opal >= slate) mineralClass = "opal";
  if (land && diamond > 0.36) mineralClass = "diamond";

  let classification = "abyssal-plain";
  if (!land && shallowShelf > 0.24) classification = "shallow-shelf";
  else if (!land && slope > 0.26) classification = "continental-slope";
  else if (!land && trenchDepth > 0.34) classification = "subduction-trench";
  else if (!land && ridgeUplift > 0.24) classification = "ridge-seamount";
  else if (!land && midOcean > 0.24) classification = "mid-ocean";
  else if (!land && abyssalPlain > 0.24) classification = "abyssal-plain";

  if (land) classification = elevationClass;

  return {
    lon,
    lat,
    land,
    landMask,
    terrain,
    mountain,
    plateau,
    highland,
    summit,
    lowland,
    shelf,
    slope,
    shallowShelf,
    bathymetry,
    abyssalPlain,
    trenchDepth,
    ridgeUplift,
    coastBand,
    glacier,
    runoff,
    hydrologyCuts,
    erosionChannels,
    rough,
    mineral,
    diamond,
    opal,
    granite,
    slate,
    elevationClass,
    mineralClass,
    classification
  };
}

function baseColorForSample(sample) {
  const trench = [4, 12, 26];
  const abyss = [6, 20, 42];
  const basin = [8, 44, 76];
  const mid = [14, 82, 112];
  const slope = [30, 120, 138];
  const shelf = [50, 154, 160];
  const shelfGlow = [82, 196, 190];
  const ridgeGlow = [58, 148, 164];

  const blackSand = [42, 38, 34];
  const whiteSand = [196, 188, 170];
  const lowGranite = [128, 118, 100];
  const warmGranite = [148, 134, 108];
  const darkSlate = [58, 68, 76];
  const blueSlate = [82, 98, 106];
  const mutedOpal = [124, 164, 158];
  const brightOpal = [164, 202, 190];
  const diamondStone = [184, 202, 198];
  const glacialIce = [218, 230, 232];

  if (!sample.land) {
    const depthColor = mixRgb(
      mixRgb(trench, abyss, 1 - sample.trenchDepth * 0.36),
      basin,
      1 - sample.abyssalPlain * 0.36
    );

    const midColor = mixRgb(depthColor, mid, sample.midOcean * 0.64);
    const slopeColor = mixRgb(midColor, slope, sample.slope * 0.58);
    const shelfColor = mixRgb(slopeColor, shelf, sample.shallowShelf * 0.74);
    const ridgeColor = mixRgb(shelfColor, ridgeGlow, sample.ridgeUplift * 0.32);
    const glowColor = mixRgb(ridgeColor, shelfGlow, sample.shallowShelf * 0.28 + sample.runoff * 0.2);

    const relief =
      sample.shallowShelf * 14 +
      sample.slope * 8 +
      sample.ridgeUplift * 14 -
      sample.abyssalPlain * 7 -
      sample.trenchDepth * 12;

    return [
      clamp(Math.round(glowColor[0] + relief), 0, 255),
      clamp(Math.round(glowColor[1] + relief), 0, 255),
      clamp(Math.round(glowColor[2] + relief), 0, 255)
    ];
  }

  const sand = mixRgb(blackSand, whiteSand, smoothstep(0.26, 0.76, sample.mineral));
  const granite = mixRgb(lowGranite, warmGranite, sample.granite);
  const slate = mixRgb(darkSlate, blueSlate, sample.slate);
  const opal = mixRgb(mutedOpal, brightOpal, sample.opal);
  const summitStone = mixRgb(slate, diamondStone, sample.diamond * 0.48);

  let rgb = granite;

  rgb = mixRgb(rgb, slate, sample.highland * 0.52 + sample.slate * 0.22);
  rgb = mixRgb(rgb, opal, sample.opal * 0.32);
  rgb = mixRgb(rgb, summitStone, sample.summit * 0.48);
  rgb = mixRgb(rgb, sand, sample.coastBand * 0.58);
  rgb = mixRgb(rgb, glacialIce, sample.glacier * 0.58);

  const channelDarken = sample.hydrologyCuts * 32 + sample.erosionChannels * 14;
  const relief =
    sample.lowland * 4 +
    sample.plateau * 13 +
    sample.highland * 22 +
    sample.summit * 26 +
    sample.coastBand * 8 -
    channelDarken;

  const wetLift = sample.runoff * 10;
  const mineralLift = sample.opal * 8 + sample.diamond * 6;

  return [
    clamp(Math.round(rgb[0] + relief + wetLift + mineralLift), 0, 255),
    clamp(Math.round(rgb[1] + relief + wetLift + mineralLift), 0, 255),
    clamp(Math.round(rgb[2] + relief + wetLift + mineralLift), 0, 255)
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

  mount.style.contain = "layout paint style";
  mount.style.contentVisibility = "auto";

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
  canvas.style.pointerEvents = "none";
  canvas.style.userSelect = "none";

  return canvas;
}

function createReceiptBase(canvas, mount, options) {
  return {
    contract: AUDRALIA_CANVAS_CONTRACT,
    status: "initializing",
    jurisdiction: [
      "canvas creation",
      "cached terrain surface",
      "mineral depth",
      "elevation bands",
      "hydrology ready cuts",
      "mobile budget throttling",
      "low lag spherical projection",
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
    performanceMode: "pending",
    startedAt: new Date().toISOString(),
    frame: 0,
    animation: "pending",
    classificationCounts: {},
    samples: {}
  };
}

function drawSpace(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.44,
    width * 0.04,
    width * 0.5,
    height * 0.5,
    width * 0.75
  );

  gradient.addColorStop(0, "rgba(22, 43, 60, 0.94)");
  gradient.addColorStop(0.42, "rgba(5, 12, 24, 0.99)");
  gradient.addColorStop(1, "rgba(0, 2, 7, 1)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawAtmosphere(ctx, cx, cy, radius) {
  ctx.save();

  const aura = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.22);
  aura.addColorStop(0, "rgba(48,168,190,0)");
  aura.addColorStop(0.72, "rgba(68,178,204,0.045)");
  aura.addColorStop(0.92, "rgba(152,221,232,0.145)");
  aura.addColorStop(1, "rgba(152,221,232,0)");

  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.22, 0, TAU);
  ctx.fill();

  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "rgba(183,232,238,0.09)";
  ctx.lineWidth = Math.max(1, radius * 0.007);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.004, 0, TAU);
  ctx.stroke();

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

  shade.addColorStop(0, "rgba(255,255,255,0.075)");
  shade.addColorStop(0.38, "rgba(255,255,255,0.01)");
  shade.addColorStop(0.74, "rgba(0,0,0,0.07)");
  shade.addColorStop(1, "rgba(0,0,0,0.38)");

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

  highlight.addColorStop(0, "rgba(255,255,255,0.12)");
  highlight.addColorStop(0.38, "rgba(255,255,255,0.032)");
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
      visible: true,
      userPauseUntil: 0,
      animationFrame: 0,
      frame: 0,
      width: 1,
      height: 1,
      dpr: 1,
      radius: 1,
      textureWidth: this.options.mobileTextureWidth,
      textureHeight: Math.floor(this.options.mobileTextureWidth / 2),
      rasterSize: this.options.mobileRasterSize,
      fps: this.options.mobileFps,
      frameInterval: 1000 / this.options.mobileFps,
      performanceMode: "mobile",
      rotation: Number.isFinite(this.options.initialRotation) ? this.options.initialRotation : -2.18,
      lastTimestamp: 0,
      lastDrawAt: 0,
      surfaceBuilt: false,
      surfaceVersion: 0,
      classificationCounts: {}
    };

    this.surfaceImageData = null;
    this.surfaceCanvas = document.createElement("canvas");
    this.surfaceCtx = this.surfaceCanvas.getContext("2d", { willReadFrequently: true });

    this.projectedCanvas = document.createElement("canvas");
    this.projectedCtx = this.projectedCanvas.getContext("2d", { willReadFrequently: true });

    this.receipt = createReceiptBase(canvas, mount, this.options);

    this.resizeObserver = null;
    this.intersectionObserver = null;

    this.resize = this.resize.bind(this);
    this.tick = this.tick.bind(this);
    this.destroy = this.destroy.bind(this);
    this.pauseForUserAction = this.pauseForUserAction.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.install();
  }

  install() {
    this.canvas.__audraliaCanvasController = this;
    this.canvas.dataset.status = "installed";
    this.resize();
    this.buildSurfaceCache();
    this.renderProjection();

    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(this.resize);
      this.resizeObserver.observe(this.mount.tagName?.toLowerCase() === "canvas" ? this.canvas : this.mount);
    } else {
      window.addEventListener("resize", this.resize, { passive: true });
    }

    if (typeof IntersectionObserver !== "undefined") {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        this.state.visible = entries.some((entry) => entry.isIntersecting);
      });
      this.intersectionObserver.observe(this.canvas);
    }

    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    document.addEventListener("selectionchange", this.handleSelectionChange);
    document.addEventListener("copy", this.pauseForUserAction);
    document.addEventListener("cut", this.pauseForUserAction);
    document.addEventListener("paste", this.pauseForUserAction);
    document.addEventListener("pointerdown", this.pauseForUserAction, { passive: true });
    document.addEventListener("touchstart", this.pauseForUserAction, { passive: true });
    document.addEventListener("keydown", this.handleKeydown);

    this.receipt.status = "installed";
    this.receipt.animation = "ready";
    this.receipt.performanceMode = this.state.performanceMode;
    installReceipt(this.receipt);
  }

  resolvePerformanceProfile(cssSize, dpr) {
    const cores = navigator.hardwareConcurrency || 4;
    const mobile =
      cssSize <= 560 ||
      window.matchMedia?.("(max-width: 760px)")?.matches ||
      cores <= 4;

    if (mobile) {
      return {
        performanceMode: "mobile",
        textureWidth: this.options.mobileTextureWidth,
        rasterSize: this.options.mobileRasterSize,
        fps: this.options.mobileFps
      };
    }

    if (dpr > 1.15 || cores <= 6) {
      return {
        performanceMode: "balanced",
        textureWidth: this.options.balancedTextureWidth,
        rasterSize: this.options.balancedRasterSize,
        fps: this.options.balancedFps
      };
    }

    return {
      performanceMode: "desktop",
      textureWidth: this.options.desktopTextureWidth,
      rasterSize: this.options.desktopRasterSize,
      fps: this.options.desktopFps
    };
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

    const profile = this.resolvePerformanceProfile(cssSize, dpr);
    const nextTextureWidth = Math.max(256, Math.floor(profile.textureWidth));
    const nextTextureHeight = Math.floor(nextTextureWidth / 2);
    const nextRasterSize = Math.max(180, Math.floor(profile.rasterSize));

    this.state.width = size;
    this.state.height = size;
    this.state.dpr = dpr;
    this.state.radius = Math.floor(size * 0.435);
    this.state.performanceMode = profile.performanceMode;
    this.state.fps = profile.fps;
    this.state.frameInterval = 1000 / profile.fps;

    if (
      this.state.textureWidth !== nextTextureWidth ||
      this.state.textureHeight !== nextTextureHeight ||
      this.state.rasterSize !== nextRasterSize
    ) {
      this.state.textureWidth = nextTextureWidth;
      this.state.textureHeight = nextTextureHeight;
      this.state.rasterSize = nextRasterSize;
      this.state.surfaceBuilt = false;
      this.buildSurfaceCache();
      this.renderProjection();
    }

    this.canvas.dataset.pixelWidth = String(size);
    this.canvas.dataset.pixelHeight = String(size);
    this.canvas.dataset.rasterSize = String(this.state.rasterSize);
    this.canvas.dataset.textureWidth = String(this.state.textureWidth);
    this.canvas.dataset.performanceMode = this.state.performanceMode;
    this.canvas.dataset.fps = String(this.state.fps);
  }

  pauseForUserAction() {
    this.state.userPauseUntil = performance.now() + 1600;
  }

  handleSelectionChange() {
    const selection = window.getSelection?.();
    if (selection && !selection.isCollapsed) {
      this.state.userPauseUntil = performance.now() + 2200;
    }
  }

  handleVisibilityChange() {
    this.state.visible = !document.hidden;
  }

  handleKeydown(event) {
    if ((event.ctrlKey || event.metaKey) && ["a", "c", "v", "x"].includes(String(event.key).toLowerCase())) {
      this.pauseForUserAction();
    }
  }

  shouldPause(now) {
    return (
      this.state.destroyed ||
      document.hidden ||
      !this.state.visible ||
      now < this.state.userPauseUntil
    );
  }

  buildSurfaceCache() {
    const width = this.state.textureWidth;
    const height = this.state.textureHeight;

    this.surfaceCanvas.width = width;
    this.surfaceCanvas.height = height;

    const image = this.surfaceCtx.createImageData(width, height);
    const data = image.data;

    const counts = {
      coast: 0,
      lowland: 0,
      plateau: 0,
      highland: 0,
      summit: 0,
      glacier: 0,
      "shallow-shelf": 0,
      "continental-slope": 0,
      "mid-ocean": 0,
      "abyssal-plain": 0,
      "subduction-trench": 0,
      "ridge-seamount": 0
    };

    const minerals = {
      granite: 0,
      slate: 0,
      opal: 0,
      diamond: 0
    };

    for (let y = 0; y < height; y += 1) {
      const lat = HALF_PI - (y / Math.max(1, height - 1)) * Math.PI;

      for (let x = 0; x < width; x += 1) {
        const lon = (x / Math.max(1, width - 1)) * TAU - Math.PI;
        const sample = sampleAudraliaSurface(lon, lat);
        const rgb = baseColorForSample(sample);
        const index = (y * width + x) * 4;

        counts[sample.classification] = (counts[sample.classification] || 0) + 1;

        if (sample.land && minerals[sample.mineralClass] !== undefined) {
          minerals[sample.mineralClass] += 1;
        }

        data[index] = rgb[0];
        data[index + 1] = rgb[1];
        data[index + 2] = rgb[2];
        data[index + 3] = 255;
      }
    }

    this.surfaceCtx.putImageData(image, 0, 0);
    this.surfaceImageData = image;
    this.state.classificationCounts = counts;
    this.state.mineralCounts = minerals;
    this.state.surfaceBuilt = true;
    this.state.surfaceVersion += 1;
  }

  sampleSurfaceTexture(lon, lat) {
    if (!this.surfaceImageData) return [0, 0, 0];

    const width = this.state.textureWidth;
    const height = this.state.textureHeight;
    const data = this.surfaceImageData.data;

    const u = (wrapLongitude(lon) + Math.PI) / TAU;
    const v = (HALF_PI - clamp(lat, -HALF_PI, HALF_PI)) / Math.PI;

    const x = clamp(Math.floor(u * (width - 1)), 0, width - 1);
    const y = clamp(Math.floor(v * (height - 1)), 0, height - 1);
    const index = (y * width + x) * 4;

    return [data[index], data[index + 1], data[index + 2]];
  }

  renderProjection() {
    if (!this.state.surfaceBuilt) this.buildSurfaceCache();

    const size = this.state.rasterSize;
    this.projectedCanvas.width = size;
    this.projectedCanvas.height = size;

    const image = this.projectedCtx.createImageData(size, size);
    const data = image.data;

    const rotation = this.state.rotation;
    const axialTilt = -0.18;
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);
    const cosT = Math.cos(axialTilt);
    const sinT = Math.sin(axialTilt);
    const light = normalize(vec3(-0.42, 0.34, 0.84));

    for (let py = 0; py < size; py += 1) {
      const y = 1 - (py / Math.max(1, size - 1)) * 2;

      for (let px = 0; px < size; px += 1) {
        const x = (px / Math.max(1, size - 1)) * 2 - 1;
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
        const base = this.sampleSurfaceTexture(ll.lon, ll.lat);

        const rawLight = dot(viewNormal, light);
        const day = smoothstep(-0.28, 0.9, rawLight);
        const rim = smoothstep(0.66, 1, Math.hypot(viewNormal.x, viewNormal.y));
        const limb = 1 - rim * 0.38;
        const shade = clamp(0.28 + day * 1.02 + rim * 0.045, 0, 1.18);
        const alpha = Math.round(255 * (1 - smoothstep(0.82, 1, Math.sqrt(rr)) * 0.06));

        data[index] = clamp(Math.round(base[0] * shade * limb), 0, 255);
        data[index + 1] = clamp(Math.round(base[1] * shade * limb), 0, 255);
        data[index + 2] = clamp(Math.round(base[2] * shade * limb), 0, 255);
        data[index + 3] = alpha;
      }
    }

    this.projectedCtx.putImageData(image, 0, 0);
  }

  start() {
    if (this.state.destroyed || this.state.running) return this;

    this.state.running = true;
    this.state.lastTimestamp = performance.now();
    this.state.lastDrawAt = 0;
    this.canvas.dataset.status = "running";
    this.receipt.status = "running";
    this.receipt.animation = "active";
    this.receipt.performanceMode = this.state.performanceMode;
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

    if (!this.shouldPause(timestamp) && timestamp - this.state.lastDrawAt >= this.state.frameInterval) {
      const dt = clamp((timestamp - this.state.lastTimestamp) / 1000, 0, 0.12);

      this.state.lastTimestamp = timestamp;
      this.state.lastDrawAt = timestamp;
      this.state.rotation = wrapLongitude(this.state.rotation + dt * this.options.rotationSpeed);

      this.renderProjection();
      this.draw();
    }

    this.state.animationFrame = requestAnimationFrame(this.tick);
  }

  draw() {
    const ctx = this.ctx;
    const width = this.state.width;
    const height = this.state.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = this.state.radius;

    drawSpace(ctx, width, height);
    drawAtmosphere(ctx, cx, cy, radius);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = this.state.performanceMode === "mobile" ? "medium" : "high";
    ctx.drawImage(this.projectedCanvas, cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();

    drawDepthOverlay(ctx, cx, cy, radius);
    drawAtmosphere(ctx, cx, cy, radius);

    this.state.frame += 1;

    if (this.state.frame % 48 === 1 || this.state.frame < 3) {
      const visiblePixels = Object.values(this.state.classificationCounts).reduce(
        (sum, count) => sum + count,
        0
      );

      const landPixels =
        (this.state.classificationCounts.coast || 0) +
        (this.state.classificationCounts.lowland || 0) +
        (this.state.classificationCounts.plateau || 0) +
        (this.state.classificationCounts.highland || 0) +
        (this.state.classificationCounts.summit || 0) +
        (this.state.classificationCounts.glacier || 0);

      this.receipt.status = "running";
      this.receipt.animation = "active";
      this.receipt.frame = this.state.frame;
      this.receipt.rotation = Number(this.state.rotation.toFixed(6));
      this.receipt.rasterSize = this.state.rasterSize;
      this.receipt.textureWidth = this.state.textureWidth;
      this.receipt.textureHeight = this.state.textureHeight;
      this.receipt.surfaceVersion = this.state.surfaceVersion;
      this.receipt.performanceMode = this.state.performanceMode;
      this.receipt.fps = this.state.fps;
      this.receipt.selectionPauseActive = performance.now() < this.state.userPauseUntil;
      this.receipt.classificationCounts = { ...this.state.classificationCounts };
      this.receipt.mineralCounts = { ...this.state.mineralCounts };
      this.receipt.measuredLandRatio = visiblePixels
        ? Number((landPixels / visiblePixels).toFixed(4))
        : 0;
      this.receipt.samples = sampleProofPixels(ctx, width, height);
      this.receipt.lastFrameAt = new Date().toISOString();

      this.canvas.dataset.frame = String(this.state.frame);
      this.canvas.dataset.rotation = String(this.receipt.rotation);
      this.canvas.dataset.measuredLandRatio = String(this.receipt.measuredLandRatio);
      this.canvas.dataset.visualDefinition = "terrain-relief-mineral-depth";
      this.canvas.dataset.performanceBudget = "selection-safe";
      this.canvas.dataset.surfaceCache = "active";
      this.canvas.dataset.terrainRelief = "active";
      this.canvas.dataset.mineralDepth = "active";
      this.canvas.dataset.hydrologyCuts = "active";
      this.canvas.dataset.fps = String(this.state.fps);
      this.canvas.dataset.animation = "throttled";

      installReceipt(this.receipt);
    }
  }

  destroy() {
    this.stop();
    this.state.destroyed = true;

    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.intersectionObserver) this.intersectionObserver.disconnect();

    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    document.removeEventListener("selectionchange", this.handleSelectionChange);
    document.removeEventListener("copy", this.pauseForUserAction);
    document.removeEventListener("cut", this.pauseForUserAction);
    document.removeEventListener("paste", this.pauseForUserAction);
    document.removeEventListener("pointerdown", this.pauseForUserAction);
    document.removeEventListener("touchstart", this.pauseForUserAction);
    document.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("resize", this.resize);

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
