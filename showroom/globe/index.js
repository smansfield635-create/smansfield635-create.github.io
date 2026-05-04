/* ==========================================================================
   SHOWROOM_DUAL_GLOBE_EARTH_AUDRELIA_AUTHORITY_SPLIT_TNT_v1
   Path: /showroom/globe/index.js
   Purpose:
   Split /showroom/globe/ into two dedicated bodies:
   1. Earth = real-world reference globe.
   2. Audrelia = constructed active world-body.
   No Planet Australia identity bridge remains in the route consumer.
   ========================================================================== */

const SPLIT_STATUS = Object.freeze({
  id: "showroom-dual-globe-split",
  route: "/showroom/globe/",
  tnt: "SHOWROOM_DUAL_GLOBE_EARTH_AUDRELIA_AUTHORITY_SPLIT_TNT_v1",
  earth: "EARTH_REFERENCE_GLOBE",
  audrelia: "AUDRELIA_ACTIVE_WORLD_BODY",
  planetAustraliaLabelRemoved: true,
  staticImageReplacement: false,
  imageGeneration: false,
  graphicBox: false,
  visualPass: "HELD_UNTIL_USER_CONFIRMATION"
});

const AUDRELIA_RENDERER_PATH = "/assets/audrelia.planet.render.js";
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hash2(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return mix(mix(a, b, ux), mix(c, d, ux), uy);
}

function fbm(x, y, octaves = 5) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let total = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise(x * frequency, y * frequency) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2.07;
  }

  return total ? value / total : value;
}

function wrapLon(lon) {
  let wrapped = ((lon + 180) % 360 + 360) % 360 - 180;
  if (wrapped === -180) wrapped = 180;
  return wrapped;
}

function lonDelta(lon, center) {
  return wrapLon(lon - center);
}

function ellipse(lon, lat, cx, cy, rx, ry, rotDeg = 0) {
  const r = rotDeg * DEG;
  const dx = lonDelta(lon, cx);
  const dy = lat - cy;
  const x = dx * Math.cos(r) + dy * Math.sin(r);
  const y = -dx * Math.sin(r) + dy * Math.cos(r);
  return 1 - (x * x) / (rx * rx) - (y * y) / (ry * ry);
}

function ridge(lon, lat, cx, cy, length, width, rotDeg = 0) {
  const r = rotDeg * DEG;
  const dx = lonDelta(lon, cx);
  const dy = lat - cy;
  const x = dx * Math.cos(r) + dy * Math.sin(r);
  const y = -dx * Math.sin(r) + dy * Math.cos(r);
  return clamp(1 - Math.abs(x) / length) * Math.exp(-(y * y) / (width * width));
}

function rgb(r, g, b, a = 255) {
  return [
    Math.round(clamp(r, 0, 255)),
    Math.round(clamp(g, 0, 255)),
    Math.round(clamp(b, 0, 255)),
    Math.round(clamp(a, 0, 255))
  ];
}

function mixRgb(a, b, t) {
  return rgb(
    mix(a[0], b[0], t),
    mix(a[1], b[1], t),
    mix(a[2], b[2], t),
    mix(a[3] ?? 255, b[3] ?? 255, t)
  );
}

const COLORS = Object.freeze({
  space: rgb(2, 8, 19),
  oceanDeep: rgb(4, 16, 42),
  ocean: rgb(8, 45, 90),
  oceanLight: rgb(18, 88, 142),
  shelf: rgb(40, 129, 157),
  reef: rgb(80, 168, 158),
  earthLand: rgb(70, 126, 70),
  earthDry: rgb(142, 108, 63),
  earthIce: rgb(225, 234, 236),
  audreliaRed: rgb(128, 63, 42),
  audreliaDry: rgb(155, 91, 49),
  audreliaScrub: rgb(105, 119, 69),
  audreliaGreen: rgb(44, 105, 67),
  audreliaRock: rgb(80, 79, 72),
  audreliaCliff: rgb(120, 111, 92),
  audreliaSnow: rgb(229, 235, 232)
});

function clearMount(mount) {
  while (mount.firstChild) mount.removeChild(mount.firstChild);
}

function createStage(mount, labelText, receiptText) {
  clearMount(mount);

  const stage = document.createElement("section");
  stage.className = "globe-stage";

  const canvas = document.createElement("canvas");
  canvas.className = "globe-canvas";
  canvas.width = 420;
  canvas.height = 420;

  const label = document.createElement("div");
  label.className = "globe-label";
  label.textContent = labelText;

  const receipt = document.createElement("div");
  receipt.className = "globe-receipt";
  receipt.textContent = receiptText;

  stage.appendChild(canvas);
  stage.appendChild(label);
  stage.appendChild(receipt);
  mount.appendChild(stage);

  return { stage, canvas, receipt };
}

function writeReceipt(node, value) {
  if (node) node.textContent = value;
}

function makeCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function makeTexture(width, height, sampler) {
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
  const image = ctx.createImageData(width, height);
  const data = image.data;

  for (let y = 0; y < height; y += 1) {
    const v = y / (height - 1);
    const lat = 90 - v * 180;

    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      const lon = u * 360 - 180;
      const c = sampler(lon, lat, u, v);
      const i = (y * width + x) * 4;
      data[i] = c[0];
      data[i + 1] = c[1];
      data[i + 2] = c[2];
      data[i + 3] = c[3] ?? 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  return {
    canvas,
    width,
    height,
    data: ctx.getImageData(0, 0, width, height).data
  };
}

function sampleTexture(texture, lon, lat) {
  const u = ((wrapLon(lon) + 180) / 360 + 1) % 1;
  const v = clamp((90 - lat) / 180, 0, 1);
  const x = Math.floor(clamp(u, 0, 0.999999) * texture.width);
  const y = Math.floor(clamp(v, 0, 0.999999) * texture.height);
  const i = (y * texture.width + x) * 4;
  return [
    texture.data[i],
    texture.data[i + 1],
    texture.data[i + 2],
    texture.data[i + 3]
  ];
}

function earthLandScore(lon, lat) {
  let land = -0.22;

  land = Math.max(land, ellipse(lon, lat, -100, 46, 34, 22, -14) * 0.92);
  land = Math.max(land, ellipse(lon, lat, -61, -15, 22, 31, -11) * 0.82);
  land = Math.max(land, ellipse(lon, lat, 20, 5, 22, 31, -4) * 0.82);
  land = Math.max(land, ellipse(lon, lat, 78, 48, 55, 23, 6) * 0.88);
  land = Math.max(land, ellipse(lon, lat, 104, 21, 24, 16, -15) * 0.72);
  land = Math.max(land, ellipse(lon, lat, 134, -25, 18, 14, -9) * 0.78);
  land = Math.max(land, ellipse(lon, lat, 138, -5, 13, 8, 18) * 0.42);
  land = Math.max(land, ellipse(lon, lat, 47, -20, 8, 13, -22) * 0.42);
  land = Math.max(land, ellipse(lon, lat, -42, 72, 14, 8, 10) * 0.55);
  land = Math.max(land, smoothstep(59, 73, -lat) * 0.5);

  const noise = (fbm(lon * 0.04 + 5, lat * 0.05 - 2, 5) - 0.5) * 0.18;
  return land + noise;
}

function earthSampler(lon, lat) {
  const land = earthLandScore(lon, lat);
  const isLand = land > 0;
  const ice = smoothstep(58, 78, Math.abs(lat));

  if (!isLand) {
    const shelf = smoothstep(-0.20, 0.02, land);
    let c = mixRgb(COLORS.oceanDeep, COLORS.ocean, 0.52 + shelf * 0.28);
    c = mixRgb(c, COLORS.oceanLight, shelf * 0.35);
    c = mixRgb(c, COLORS.earthIce, ice * 0.66);
    return c;
  }

  const dry = fbm(lon * 0.035 + 20, lat * 0.04 + 7, 4);
  const green = fbm(lon * 0.045 - 11, lat * 0.05 + 3, 4);
  let c = mixRgb(COLORS.earthDry, COLORS.earthLand, green * 0.82);
  c = mixRgb(c, COLORS.earthIce, ice * 0.72);
  c = mixRgb(c, COLORS.earthDry, smoothstep(0.62, 0.86, dry) * 0.32);
  return c;
}

function audreliaFallbackLandScore(lon, lat) {
  const nx = lon / 180;
  const ny = lat / 90;

  let land =
    ellipse(lon, lat, -38, -9, 46, 17, -9) * 0.88 +
    (fbm(nx * 5.0 + 10, ny * 5.0 - 3, 5) - 0.5) * 0.16;

  land = Math.max(land, ellipse(lon, lat, 58, -8, 38, 20, 7) * 0.86);
  land = Math.max(land, ellipse(lon, lat, 110, -28, 20, 13, -22) * 0.46);
  land = Math.max(land, ellipse(lon, lat, -102, 22, 14, 8, 12) * 0.36);

  land -= Math.max(ellipse(lon, lat, 7, -9, 18, 9, 0), 0) * 0.36;
  land -= Math.max(ellipse(lon, lat, -10, -30, 33, 9, -4), 0) * 0.22;

  return land;
}

function audreliaFallbackSampler(lon, lat) {
  const land = audreliaFallbackLandScore(lon, lat);
  const isLand = land > 0;
  const reef = ridge(lon, lat, 47, -15, 40, 2.8, -8);
  const mountains = ridge(lon, lat, 66, -16, 34, 4.6, -8) + ridge(lon, lat, -68, -8, 26, 5.2, 14);
  const shelf = smoothstep(-0.22, 0.0, land) * (1 - smoothstep(-0.04, 0.08, land));
  const slope = clamp(Math.abs(land) < 0.12 ? 0.46 + mountains * 0.22 : mountains * 0.2);
  const coast = isLand ? smoothstep(0.18, 0.0, land) : smoothstep(-0.22, 0.0, land);
  const northWet = smoothstep(-28, 6, lat);
  const southCold = smoothstep(-20, -48, lat);
  const noise = fbm(lon * 0.06 + 3, lat * 0.07 - 9, 5);

  if (!isLand) {
    let c = mixRgb(COLORS.oceanDeep, COLORS.ocean, 0.55 + shelf * 0.18);
    c = mixRgb(c, COLORS.shelf, shelf * 0.55);
    c = mixRgb(c, COLORS.reef, reef * 0.42);
    return c;
  }

  let c = mixRgb(COLORS.audreliaRed, COLORS.audreliaDry, 0.5 + noise * 0.3);
  c = mixRgb(c, COLORS.audreliaScrub, smoothstep(0.28, 0.58, noise));
  c = mixRgb(c, COLORS.audreliaGreen, northWet * 0.34 + reef * 0.12);
  c = mixRgb(c, COLORS.audreliaRock, slope * coast * 0.46);
  c = mixRgb(c, COLORS.audreliaCliff, mountains * 0.32);
  c = mixRgb(c, COLORS.audreliaSnow, southCold * mountains * 0.45);
  return c;
}

function normalizeRendererTexture(canvasLike) {
  const source = canvasLike?.canvas || canvasLike?.texture || canvasLike?.image || canvasLike;

  if (!source || typeof source.getContext !== "function") {
    return null;
  }

  const width = Math.min(source.width || 1024, 1024);
  const height = Math.min(source.height || 512, 512);
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });

  ctx.drawImage(source, 0, 0, width, height);

  return {
    canvas,
    width,
    height,
    data: ctx.getImageData(0, 0, width, height).data
  };
}

async function buildAudreliaTexture() {
  try {
    const module = await import(`${AUDRELIA_RENDERER_PATH}?split=${Date.now()}`);
    const renderer =
      module.default ||
      module.AudreliaPlanetRenderer ||
      module.AudraliaPlanetRenderer ||
      module.PlanetAustraliaG1TerrainRenderer ||
      module.PlanetAustraliaG1Renderer ||
      module;

    const createProfile = renderer.createProfile || module.createProfile || (() => ({ id: "audrelia" }));
    const buildTexture = renderer.buildTexture || module.buildTexture;

    if (typeof buildTexture !== "function") {
      throw new Error("Audrelia renderer does not expose buildTexture().");
    }

    const profile = createProfile({
      id: "audrelia",
      name: "Audrelia",
      publicName: "Audrelia",
      width: 1024,
      height: 512
    });

    const built = buildTexture(profile, {
      width: 1024,
      height: 512,
      name: "Audrelia",
      publicName: "Audrelia"
    });

    const texture = normalizeRendererTexture(built);
    if (!texture) {
      throw new Error("Audrelia renderer returned no usable canvas texture.");
    }

    return {
      texture,
      source: "AUDRELIA_RENDERER",
      error: null
    };
  } catch (error) {
    return {
      texture: makeTexture(1024, 512, audreliaFallbackSampler),
      source: "AUDRELIA_CONSUMER_FALLBACK",
      error: error?.message || String(error)
    };
  }
}

function setCanvasSize(canvas) {
  const rect = canvas.parentElement?.getBoundingClientRect?.();
  const cssSize = Math.max(260, Math.min(Math.floor(rect?.width || 420), 440));
  const dpr = clamp(window.devicePixelRatio || 1, 1, 1.65);
  const size = Math.floor(Math.min(cssSize * dpr, 520));

  if (canvas.width !== size || canvas.height !== size) {
    canvas.width = size;
    canvas.height = size;
  }

  canvas.style.width = `${cssSize}px`;
  canvas.style.height = `${cssSize}px`;

  return size;
}

function drawGlobe(canvas, texture, state) {
  const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
  const size = setCanvasSize(canvas);
  const image = ctx.createImageData(size, size);
  const data = image.data;
  const cx = size * 0.5;
  const cy = size * 0.5;
  const radius = size * 0.43;
  const tilt = state.tilt * DEG;
  const light = state.light;

  for (let y = 0; y < size; y += 1) {
    const ny = (y - cy) / radius;

    for (let x = 0; x < size; x += 1) {
      const nx = (x - cx) / radius;
      const rr = nx * nx + ny * ny;
      const i = (y * size + x) * 4;

      if (rr > 1) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0;
        continue;
      }

      const z = Math.sqrt(1 - rr);
      const yt = ny * Math.cos(tilt) - z * Math.sin(tilt);
      const zt = ny * Math.sin(tilt) + z * Math.cos(tilt);
      const lon = Math.atan2(nx, zt) / DEG + state.rotation;
      const lat = Math.asin(clamp(-yt, -1, 1)) / DEG;
      const p = sampleTexture(texture, lon, lat);

      const normalDot =
        nx * light.x +
        ny * light.y +
        z * light.z;

      const limb = Math.pow(clamp(z), 0.66);
      const shade = clamp(0.34 + normalDot * 0.42 + limb * 0.36, 0.15, 1.12);
      const atm = Math.pow(clamp(1 - z), 2.0);

      data[i] = clamp(p[0] * shade + 55 * atm, 0, 255);
      data[i + 1] = clamp(p[1] * shade + 105 * atm, 0, 255);
      data[i + 2] = clamp(p[2] * shade + 180 * atm, 0, 255);
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  const halo = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.06);
  halo.addColorStop(0, "rgba(120, 190, 250, 0)");
  halo.addColorStop(0.66, "rgba(115, 186, 248, 0.10)");
  halo.addColorStop(1, "rgba(155, 216, 255, 0.58)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.025, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = "rgba(165, 215, 255, 0.72)";
  ctx.lineWidth = Math.max(1.4, size * 0.004);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.012, 0, TAU);
  ctx.stroke();

  const gloss = ctx.createRadialGradient(
    cx - radius * 0.34,
    cy - radius * 0.42,
    radius * 0.05,
    cx - radius * 0.28,
    cy - radius * 0.35,
    radius * 0.56
  );
  gloss.addColorStop(0, "rgba(255, 255, 255, 0.18)");
  gloss.addColorStop(0.35, "rgba(255, 255, 255, 0.07)");
  gloss.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gloss;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.fill();
}

function createGlobeController(canvas, texture, config) {
  const state = {
    rotation: config.rotation,
    speed: config.speed,
    tilt: config.tilt,
    light: config.light,
    last: performance.now(),
    accumulator: 0,
    paused: false
  };

  function frame(now) {
    const dt = Math.min(80, now - state.last);
    state.last = now;
    state.accumulator += dt;

    if (!state.paused) {
      state.rotation = (state.rotation + dt * state.speed) % 360;
    }

    if (state.accumulator >= 33) {
      state.accumulator = 0;
      drawGlobe(canvas, texture, state);
    }

    requestAnimationFrame(frame);
  }

  canvas.addEventListener("pointerdown", () => {
    state.paused = !state.paused;
  });

  window.addEventListener("resize", () => {
    drawGlobe(canvas, texture, state);
  });

  drawGlobe(canvas, texture, state);
  requestAnimationFrame(frame);

  return state;
}

async function boot() {
  const earthMount = document.querySelector("[data-earth-globe-mount]");
  const audreliaMount = document.querySelector("[data-audrelia-globe-mount]");

  if (!earthMount || !audreliaMount) {
    window.__SHOWROOM_DUAL_GLOBE_SPLIT__ = {
      ...SPLIT_STATUS,
      active: false,
      error: "Missing Earth or Audrelia mount."
    };
    return;
  }

  const earthStage = createStage(
    earthMount,
    "EARTH · REFERENCE_GLOBE",
    "EARTH · PROCEDURAL_REFERENCE_ACTIVE"
  );

  const audreliaStage = createStage(
    audreliaMount,
    "AUDRELIA · ACTIVE_WORLD_BODY",
    "AUDRELIA · LOADING_RENDERER"
  );

  const earthTexture = makeTexture(1024, 512, earthSampler);
  const audreliaResult = await buildAudreliaTexture();

  writeReceipt(
    audreliaStage.receipt,
    audreliaResult.source === "AUDRELIA_RENDERER"
      ? "AUDRELIA · RENDERER_TEXTURE_ACTIVE"
      : `AUDRELIA · FALLBACK_ACTIVE · ${audreliaResult.error || "IMPORT_ERROR"}`
  );

  createGlobeController(earthStage.canvas, earthTexture, {
    rotation: -40,
    speed: 0.018,
    tilt: -18,
    light: { x: -0.44, y: -0.55, z: 0.72 }
  });

  createGlobeController(audreliaStage.canvas, audreliaResult.texture, {
    rotation: 132,
    speed: 0.023,
    tilt: -18,
    light: { x: -0.42, y: -0.58, z: 0.70 }
  });

  window.__SHOWROOM_DUAL_GLOBE_SPLIT__ = {
    ...SPLIT_STATUS,
    active: true,
    earthTexture: "PROCEDURAL_REFERENCE_ACTIVE",
    audreliaTexture: audreliaResult.source,
    audreliaImportError: audreliaResult.error,
    timestamp: new Date().toISOString()
  };
}

function bootWhenReady() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
}

bootWhenReady();

export default {
  ...SPLIT_STATUS,
  boot: bootWhenReady
};
