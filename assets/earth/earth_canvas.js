// /assets/earth/earth_canvas.js
// EARTH_NASA_REFERENCE_RENDERER_TNT_v1
// Role: Earth reference renderer.
// Standard: NASA-style Earth image asset, not Audralia procedural world logic.
// Earth is not designed by Audralia generation logic.

const RECEIPT = "EARTH_NASA_REFERENCE_RENDERER_TNT_v1";
const FILE = "/assets/earth/earth_canvas.js";

const EARTH_ASSET_CANDIDATES = Object.freeze([
  "/assets/earth/earth-blue-marble-day.jpg",
  "/assets/earth/earth-blue-marble-day.png",
  "/assets/earth/earth-reference.jpg",
  "/assets/earth/earth-reference.png",
  "/assets/earth/blue-marble.jpg",
  "/assets/earth/blue-marble.png"
]);

const STATE = {
  assetStatus: "not-requested",
  activeAssetPath: null,
  activeImage: null,
  lastError: null,
  loadingPromise: null
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createProfile(options = {}) {
  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: "Earth",
    publicName: "Earth",
    generation: "G4_CANDIDATE",
    generationStatus: "G4_CANDIDATE",
    generationClaimed: false,
    targetStandard: "NASA_EARTH_REFERENCE_G4",
    rendererMode: "NASA_TEXTURE_REFERENCE",
    file: FILE,
    authority: "EARTH_FILE_CHAIN",
    noAudraliaLogic: true,
    noProceduralWorldDesign: true,
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false,
    route: options.route || "/showroom/globe/"
  });
}

function buildTexture(profile = createProfile()) {
  beginAssetLoad();

  return Object.freeze({
    receipt: RECEIPT,
    type: "nasa-earth-reference-texture",
    profile,
    assetStatus: STATE.assetStatus,
    activeAssetPath: STATE.activeAssetPath,
    candidates: EARTH_ASSET_CANDIDATES.slice()
  });
}

function getStatus() {
  return Object.freeze({
    statusAvailable: true,
    ok: true,
    receipt: RECEIPT,
    status: "active",
    id: "earth-nasa-reference-renderer",
    planetaryObject: "Earth",
    publicName: "Earth",
    generation: "G4_CANDIDATE",
    generationStatus: "G4_CANDIDATE",
    generationClaimed: false,
    targetStandard: "NASA_EARTH_REFERENCE_G4",
    file: FILE,
    role: "earth-nasa-reference-renderer",
    authority: "EARTH_FILE_CHAIN",
    rendererMode: "NASA_TEXTURE_REFERENCE",
    assetDriven: true,
    activeAssetPath: STATE.activeAssetPath,
    assetStatus: STATE.assetStatus,
    noAudraliaLogic: true,
    noProceduralWorldDesign: true,
    exports: [
      "createProfile",
      "buildTexture",
      "sampleSurface",
      "renderSurface",
      "render",
      "renderPlanet",
      "getStatus"
    ],
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

function beginAssetLoad() {
  if (STATE.activeImage || STATE.loadingPromise) return STATE.loadingPromise;

  STATE.assetStatus = "loading";

  STATE.loadingPromise = loadFirstAvailableImage(EARTH_ASSET_CANDIDATES)
    .then(({ image, path }) => {
      STATE.activeImage = image;
      STATE.activeAssetPath = path;
      STATE.assetStatus = "loaded";
      STATE.lastError = null;
      return image;
    })
    .catch((error) => {
      STATE.assetStatus = "pending-local-nasa-asset";
      STATE.lastError = String(error && error.message ? error.message : error);
      return null;
    });

  return STATE.loadingPromise;
}

function loadFirstAvailableImage(paths) {
  return new Promise((resolve, reject) => {
    let index = 0;
    const errors = [];

    const tryNext = () => {
      if (index >= paths.length) {
        reject(new Error(`No local Earth reference asset found. Tried: ${paths.join(", ")}`));
        return;
      }

      const path = paths[index++];
      const image = new Image();
      image.decoding = "async";

      image.onload = () => resolve({ image, path });
      image.onerror = () => {
        errors.push(path);
        tryNext();
      };

      image.src = `${path}?v=${encodeURIComponent(RECEIPT)}_${Date.now()}`;
    };

    tryNext();
  });
}

function drawOrbitalClip(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
}

function drawEarthImage(ctx, image, cx, cy, r) {
  ctx.save();
  drawOrbitalClip(ctx, cx, cy, r);

  const diameter = r * 2;
  const scale = Math.max(diameter / image.width, diameter / image.height);
  const sw = image.width * scale;
  const sh = image.height * scale;
  const sx = cx - sw / 2;
  const sy = cy - sh / 2;

  ctx.drawImage(image, sx, sy, sw, sh);

  const shade = ctx.createRadialGradient(
    cx - r * 0.42,
    cy - r * 0.32,
    r * 0.05,
    cx + r * 0.22,
    cy + r * 0.08,
    r * 1.2
  );
  shade.addColorStop(0, "rgba(255,255,255,0.18)");
  shade.addColorStop(0.45, "rgba(255,255,255,0.03)");
  shade.addColorStop(0.78, "rgba(0,0,0,0.12)");
  shade.addColorStop(1, "rgba(0,0,0,0.62)");
  ctx.fillStyle = shade;
  ctx.fillRect(cx - r, cy - r, diameter, diameter);

  ctx.restore();
}

function drawAssetPendingEarth(ctx, cx, cy, r) {
  ctx.save();
  drawOrbitalClip(ctx, cx, cy, r);

  const ocean = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  ocean.addColorStop(0, "rgb(12, 45, 92)");
  ocean.addColorStop(0.42, "rgb(17, 74, 132)");
  ocean.addColorStop(1, "rgb(3, 17, 42)");
  ctx.fillStyle = ocean;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  for (let i = 0; i < 260; i += 1) {
    const x = cx - r + ((i * 97) % Math.floor(r * 2.05));
    const y = cy - r + ((i * 53) % Math.floor(r * 1.85));
    const band = Math.sin(i * 12.9898) * 0.5 + 0.5;
    const w = r * (0.03 + band * 0.13);
    const h = r * (0.006 + band * 0.025);

    ctx.fillStyle = i % 3 === 0
      ? "rgba(245,248,255,0.38)"
      : "rgba(235,241,255,0.20)";

    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0.2 * Math.sin(i), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(72, 125, 74, 0.78)";
  drawSoftLand(ctx, cx - r * 0.28, cy - r * 0.22, r * 0.42, r * 0.28, -0.35);
  drawSoftLand(ctx, cx + r * 0.08, cy + r * 0.28, r * 0.36, r * 0.22, 0.25);
  drawSoftLand(ctx, cx + r * 0.46, cy - r * 0.08, r * 0.22, r * 0.42, 0.52);

  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.textAlign = "center";
  ctx.font = `${Math.round(r * 0.07)}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillText("NASA ASSET PENDING", cx, cy + r * 0.72);
}

function drawSoftLand(ctx, x, y, w, h, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRimAndAtmosphere(ctx, cx, cy, r) {
  const atmosphere = ctx.createRadialGradient(cx, cy, r * 0.86, cx, cy, r * 1.08);
  atmosphere.addColorStop(0, "rgba(30, 95, 150, 0)");
  atmosphere.addColorStop(0.76, "rgba(80, 172, 240, 0.20)");
  atmosphere.addColorStop(1, "rgba(154, 218, 255, 0.48)");

  ctx.fillStyle = atmosphere;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.045, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = Math.max(2, r * 0.012);
  ctx.strokeStyle = "rgba(154, 218, 255, 0.56)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

function renderSurface(canvas, options = {}) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width || 1024;
  const h = canvas.height || 1024;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.38;

  ctx.clearRect(0, 0, w, h);

  const background = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.65);
  background.addColorStop(0, "rgba(10,20,40,0.20)");
  background.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, w, h);

  beginAssetLoad();

  if (STATE.activeImage) {
    drawEarthImage(ctx, STATE.activeImage, cx, cy, r);
  } else {
    drawAssetPendingEarth(ctx, cx, cy, r);
    STATE.loadingPromise?.then(() => {
      if (STATE.activeImage) renderSurface(canvas, options);
    });
  }

  drawRimAndAtmosphere(ctx, cx, cy, r);

  return Object.freeze({
    rendered: true,
    method: "renderSurface",
    receipt: RECEIPT,
    body: "Earth",
    generationStatus: "G4_CANDIDATE",
    generationClaimed: false,
    targetStandard: "NASA_EARTH_REFERENCE_G4",
    rendererMode: "NASA_TEXTURE_REFERENCE",
    assetStatus: STATE.assetStatus,
    activeAssetPath: STATE.activeAssetPath,
    noAudraliaLogic: true,
    visualPassClaimed: false
  });
}

function sampleSurface(x = 0, y = 0, options = {}) {
  return Object.freeze({
    body: "Earth",
    source: "NASA_TEXTURE_REFERENCE",
    designedWorld: false,
    noAudraliaLogic: true,
    x: clamp(Number(x) || 0, -1, 1),
    y: clamp(Number(y) || 0, -1, 1),
    assetStatus: STATE.assetStatus,
    activeAssetPath: STATE.activeAssetPath
  });
}

function render(canvas, options = {}) {
  return renderSurface(canvas, options);
}

function renderPlanet(canvas, options = {}) {
  return renderSurface(canvas, options);
}

const api = Object.freeze({
  createProfile,
  buildTexture,
  sampleSurface,
  renderSurface,
  render,
  renderPlanet,
  getStatus
});

export {
  createProfile,
  buildTexture,
  sampleSurface,
  renderSurface,
  render,
  renderPlanet,
  getStatus
};

export default api;
