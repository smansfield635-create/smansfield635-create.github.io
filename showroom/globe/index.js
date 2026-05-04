/* ==========================================================================
   PLANET_AUSTRALIA_G1_GLOBE_MOUNT_CONSUMER_TNT_v1
   Path: /showroom/globe/index.js
   Purpose:
   Make the live /showroom/globe/ module consume the Planet Australia /
   Audralia terrain renderer directly and render it as a rotating globe.
   This file is the route consumer. It does not replace the planet renderer.
   ========================================================================== */

const GLOBE_CONSUMER_STATUS = Object.freeze({
  id: "showroom-globe-consumer",
  route: "/showroom/globe/",
  generation: "G1_CONSUMER_ALIGNMENT",
  contract: "PLANET_AUSTRALIA_G1_TERRAIN_MAPPING_BINDING_v1",
  tnt: "PLANET_AUSTRALIA_G1_GLOBE_MOUNT_CONSUMER_TNT_v1",
  consumes: "/assets/audrelia.planet.render.js",
  imageGeneration: false,
  graphicBox: false,
  staticImageReplacement: false,
  visualPass: "HELD_UNTIL_USER_CONFIRMATION"
});

const PLANET_RENDERER_PATH = "/assets/audrelia.planet.render.js";
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function createElement(tag, className = "", text = "") {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function findMount() {
  const candidates = [
    "#globe-main",
    "#audralia-globe",
    "#audrelia-globe",
    "#planet-globe",
    "[data-globe-mount]",
    "[data-audralia-mount]",
    "[data-audrelia-mount]",
    ".globe-mount",
    ".audralia-mount",
    ".audrelia-mount",
    ".showroom-globe",
    ".visible-mount"
  ];

  for (const selector of candidates) {
    const found = qs(selector);
    if (found) return found;
  }

  const main = qs("main") || document.body;
  return main;
}

function findExistingVisualFrame(mount) {
  const canvas = qs("canvas", mount);
  if (canvas) return canvas.parentElement || mount;

  const likelyFrames = [
    ".audralia-frame",
    ".audrelia-frame",
    ".globe-frame",
    ".planet-frame",
    ".visible-render",
    ".render-frame",
    ".chamber",
    ".mount"
  ];

  for (const selector of likelyFrames) {
    const found = qs(selector, mount);
    if (found) return found;
  }

  return mount;
}

function ensureStage(mount) {
  let stage = qs("[data-planet-australia-stage]", mount);
  if (stage) return stage;

  const frame = findExistingVisualFrame(mount);

  stage = createElement("section", "planet-australia-stage");
  stage.setAttribute("data-planet-australia-stage", "true");
  stage.setAttribute("aria-label", "Planet Australia G1 globe render");

  const shell = createElement("div", "planet-australia-canvas-shell");
  shell.setAttribute("data-planet-australia-shell", "true");

  const canvas = document.createElement("canvas");
  canvas.className = "planet-australia-canvas";
  canvas.setAttribute("data-planet-australia-canvas", "true");
  canvas.setAttribute("aria-label", "Planet Australia rendered globe");

  const label = createElement(
    "div",
    "planet-australia-label",
    "PLANET AUSTRALIA · G1_TERRAIN_RENDER_ACTIVE"
  );
  label.setAttribute("data-planet-australia-label", "true");

  const receipt = createElement("div", "planet-australia-receipt");
  receipt.setAttribute("data-planet-australia-receipt", "true");
  receipt.textContent = "CONSUMER · /showroom/globe/index.js · ACTIVE";

  shell.appendChild(canvas);
  stage.appendChild(shell);
  stage.appendChild(label);
  stage.appendChild(receipt);

  const existingCanvas = qs("canvas", frame);
  if (existingCanvas && existingCanvas.parentElement) {
    existingCanvas.parentElement.replaceWith(stage);
  } else {
    frame.appendChild(stage);
  }

  return stage;
}

function injectLocalStyle() {
  if (qs("#planet-australia-g1-consumer-style")) return;

  const style = document.createElement("style");
  style.id = "planet-australia-g1-consumer-style";
  style.textContent = `
    [data-planet-australia-stage] {
      width: min(92vw, 720px);
      margin: 0 auto;
      padding: 18px;
      border: 1px solid rgba(150, 190, 230, 0.26);
      border-radius: 28px;
      background:
        radial-gradient(circle at 50% 34%, rgba(40, 120, 180, 0.22), transparent 38%),
        linear-gradient(180deg, rgba(7, 18, 38, 0.92), rgba(2, 7, 18, 0.96));
      box-shadow:
        0 18px 60px rgba(0, 0, 0, 0.45),
        inset 0 0 80px rgba(66, 140, 220, 0.10);
    }

    [data-planet-australia-shell] {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      max-height: min(72vh, 720px);
      display: grid;
      place-items: center;
      overflow: hidden;
      border-radius: 24px;
      background:
        radial-gradient(circle at 50% 50%, rgba(26, 74, 122, 0.28), transparent 60%),
        linear-gradient(180deg, rgba(1, 8, 22, 0.72), rgba(1, 4, 13, 0.92));
    }

    [data-planet-australia-shell]::before {
      content: "";
      position: absolute;
      inset: 7%;
      border-radius: 999px;
      background:
        radial-gradient(circle at 38% 28%, rgba(255, 255, 255, 0.18), transparent 10%),
        radial-gradient(circle at 62% 70%, rgba(65, 140, 210, 0.14), transparent 24%);
      filter: blur(7px);
      opacity: 0.65;
      pointer-events: none;
    }

    [data-planet-australia-canvas] {
      position: relative;
      z-index: 1;
      width: min(100%, 680px);
      height: auto;
      display: block;
      border-radius: 999px;
      filter: saturate(1.08) contrast(1.05);
    }

    [data-planet-australia-label],
    [data-planet-australia-receipt] {
      margin-top: 10px;
      text-align: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      letter-spacing: 0.11em;
      color: rgba(225, 238, 255, 0.86);
      text-transform: uppercase;
    }

    [data-planet-australia-label] {
      font-size: clamp(0.72rem, 2.4vw, 0.95rem);
      font-weight: 800;
    }

    [data-planet-australia-receipt] {
      font-size: clamp(0.58rem, 1.9vw, 0.72rem);
      color: rgba(173, 199, 225, 0.70);
    }
  `;

  document.head.appendChild(style);
}

async function loadPlanetRenderer() {
  const cached =
    window.PlanetAustraliaG1TerrainRenderer ||
    window.PlanetAustraliaG1Renderer ||
    window.AudreliaPlanetRenderer ||
    window.AudraliaPlanetRenderer ||
    window.AdraliaPlanetRenderer;

  if (cached) return cached;

  const module = await import(`${PLANET_RENDERER_PATH}?consumer=${Date.now()}`);

  return (
    module.default ||
    module.PlanetAustraliaG1TerrainRenderer ||
    module.PlanetAustraliaG1Renderer ||
    module.AudreliaPlanetRenderer ||
    module.registerExtension?.() ||
    module
  );
}

function getRendererApi(rendererModule) {
  const renderer = rendererModule?.default || rendererModule;

  return {
    createProfile:
      renderer?.createProfile ||
      rendererModule?.createProfile ||
      (() => ({ id: "audrelia", name: "Planet Australia" })),

    buildTexture:
      renderer?.buildTexture ||
      rendererModule?.buildTexture ||
      null,

    sampleSurface:
      renderer?.sampleSurface ||
      rendererModule?.sampleSurface ||
      null,

    getStatus:
      renderer?.getStatus ||
      rendererModule?.getStatus ||
      (() => ({}))
  };
}

function resizeCanvas(canvas) {
  const shell = canvas.parentElement;
  const rect = shell?.getBoundingClientRect?.();
  const cssSize = Math.max(280, Math.floor(Math.min(rect?.width || 640, 720)));
  const dpr = clamp(window.devicePixelRatio || 1, 1, 2);

  const px = Math.floor(cssSize * dpr);
  if (canvas.width !== px || canvas.height !== px) {
    canvas.width = px;
    canvas.height = px;
  }

  canvas.style.width = `${cssSize}px`;
  canvas.style.height = `${cssSize}px`;

  return { size: px, cssSize, dpr };
}

function readTexturePixel(textureCtx, textureWidth, textureHeight, lon, lat) {
  const u = ((lon + 180) / 360) % 1;
  const v = clamp((90 - lat) / 180, 0, 1);

  const x = Math.floor(clamp(u, 0, 0.999999) * textureWidth);
  const y = Math.floor(clamp(v, 0, 0.999999) * textureHeight);

  return textureCtx.getImageData(x, y, 1, 1).data;
}

function shadeColor(pixel, shade, atmosphere = 0) {
  const r = clamp(pixel[0] * shade + 70 * atmosphere, 0, 255);
  const g = clamp(pixel[1] * shade + 125 * atmosphere, 0, 255);
  const b = clamp(pixel[2] * shade + 190 * atmosphere, 0, 255);

  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 1)`;
}

function drawGlobe(ctx, canvas, textureCtx, textureWidth, textureHeight, state) {
  const { size } = resizeCanvas(canvas);
  const radius = size * 0.43;
  const cx = size * 0.5;
  const cy = size * 0.5;

  ctx.clearRect(0, 0, size, size);

  const bg = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.35);
  bg.addColorStop(0, "rgba(21, 69, 112, 0.10)");
  bg.addColorStop(0.58, "rgba(9, 35, 70, 0.16)");
  bg.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  const spin = state.rotation;
  const tilt = -18 * DEG;
  const light = {
    x: -0.42,
    y: -0.58,
    z: 0.70
  };

  const step = Math.max(1, Math.floor(size / 320));
  const image = ctx.createImageData(size, size);
  const data = image.data;

  for (let y = 0; y < size; y += step) {
    const ny = (y - cy) / radius;

    for (let x = 0; x < size; x += step) {
      const nx = (x - cx) / radius;
      const rr = nx * nx + ny * ny;

      if (rr > 1) continue;

      const z = Math.sqrt(1 - rr);

      const yt = ny * Math.cos(tilt) - z * Math.sin(tilt);
      const zt = ny * Math.sin(tilt) + z * Math.cos(tilt);

      const lon = Math.atan2(nx, zt) / DEG + spin;
      const lat = Math.asin(clamp(-yt, -1, 1)) / DEG;

      const pixel = readTexturePixel(textureCtx, textureWidth, textureHeight, lon, lat);

      const normalDot =
        nx * light.x +
        ny * light.y +
        z * light.z;

      const limb = Math.pow(clamp(z), 0.62);
      const shade = clamp(0.36 + normalDot * 0.45 + limb * 0.34, 0.16, 1.18);
      const atmosphere = Math.pow(clamp(1 - z), 2.2) * 0.72;

      const color = shadeColor(pixel, shade, atmosphere);
      const match = color.match(/\d+/g).map(Number);

      for (let py = 0; py < step; py += 1) {
        for (let px = 0; px < step; px += 1) {
          const xx = x + px;
          const yy = y + py;
          if (xx >= size || yy >= size) continue;

          const idx = (yy * size + xx) * 4;
          data[idx] = match[0];
          data[idx + 1] = match[1];
          data[idx + 2] = match[2];
          data[idx + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(image, 0, 0);

  const halo = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.06);
  halo.addColorStop(0, "rgba(120, 190, 250, 0)");
  halo.addColorStop(0.64, "rgba(115, 186, 248, 0.10)");
  halo.addColorStop(1, "rgba(155, 216, 255, 0.62)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.025, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = "rgba(165, 215, 255, 0.72)";
  ctx.lineWidth = Math.max(1.5, size * 0.004);
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
  gloss.addColorStop(0, "rgba(255, 255, 255, 0.20)");
  gloss.addColorStop(0.35, "rgba(255, 255, 255, 0.07)");
  gloss.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gloss;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.fill();

  const shadow = ctx.createRadialGradient(
    cx + radius * 0.42,
    cy + radius * 0.30,
    radius * 0.08,
    cx,
    cy,
    radius * 1.02
  );
  shadow.addColorStop(0, "rgba(0, 0, 0, 0.10)");
  shadow.addColorStop(0.66, "rgba(0, 0, 0, 0.02)");
  shadow.addColorStop(1, "rgba(0, 0, 0, 0.36)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.fill();
}

async function buildTextureFromRenderer(api) {
  const profile = api.createProfile({
    width: 2048,
    height: 1024,
    centerLon: 132,
    centerLat: -25
  });

  if (!api.buildTexture) {
    throw new Error("Planet renderer does not expose buildTexture().");
  }

  const texture = api.buildTexture(profile, {
    width: 2048,
    height: 1024,
    centerLon: 132,
    centerLat: -25
  });

  const textureCanvas = texture?.canvas || texture?.texture || texture?.image;
  if (!textureCanvas) {
    throw new Error("Planet renderer did not return a canvas texture.");
  }

  const textureCtx = textureCanvas.getContext("2d", {
    alpha: true,
    willReadFrequently: true
  });

  return {
    texture,
    textureCanvas,
    textureCtx,
    textureWidth: textureCanvas.width,
    textureHeight: textureCanvas.height
  };
}

function writeReceipt(stage, text) {
  const receipt = qs("[data-planet-australia-receipt]", stage);
  if (receipt) receipt.textContent = text;
}

function exposeRuntime(api, texture) {
  window.__PLANET_AUSTRALIA_G1_CONSUMER__ = {
    status: GLOBE_CONSUMER_STATUS,
    rendererStatus: api.getStatus(),
    textureStatus: texture?.status || null,
    routeConsumer: true,
    active: true,
    timestamp: new Date().toISOString()
  };
}

async function boot() {
  injectLocalStyle();

  const mount = findMount();
  const stage = ensureStage(mount);
  const canvas = qs("[data-planet-australia-canvas]", stage);
  const ctx = canvas.getContext("2d", {
    alpha: true,
    willReadFrequently: false
  });

  writeReceipt(stage, "CONSUMER · LOADING_PLANET_RENDERER");

  const rendererModule = await loadPlanetRenderer();
  const api = getRendererApi(rendererModule);

  writeReceipt(stage, "CONSUMER · BUILDING_TERRAIN_TEXTURE");

  const textureBundle = await buildTextureFromRenderer(api);
  exposeRuntime(api, textureBundle.texture);

  const state = {
    rotation: 128,
    speed: 0.028,
    last: performance.now(),
    paused: false
  };

  function frame(now) {
    const dt = Math.min(48, now - state.last);
    state.last = now;

    if (!state.paused) {
      state.rotation = (state.rotation + dt * state.speed) % 360;
    }

    drawGlobe(
      ctx,
      canvas,
      textureBundle.textureCtx,
      textureBundle.textureWidth,
      textureBundle.textureHeight,
      state
    );

    requestAnimationFrame(frame);
  }

  canvas.addEventListener("pointerdown", () => {
    state.paused = !state.paused;
    writeReceipt(
      stage,
      state.paused
        ? "CONSUMER · ROTATION_PAUSED_BY_USER"
        : "CONSUMER · VISIBLE_RENDER_ACTIVE"
    );
  });

  window.addEventListener("resize", () => {
    drawGlobe(
      ctx,
      canvas,
      textureBundle.textureCtx,
      textureBundle.textureWidth,
      textureBundle.textureHeight,
      state
    );
  });

  writeReceipt(stage, "CONSUMER · VISIBLE_RENDER_ACTIVE");
  requestAnimationFrame(frame);
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
  ...GLOBE_CONSUMER_STATUS,
  boot: bootWhenReady
};
