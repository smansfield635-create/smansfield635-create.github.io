// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_TERRAIN_CHILD_CONSUMPTION_AND_CACHE_BUST_TNT_v1
//
// Role:
// - Audralia route compositor and rotation control.
// - Loads parent baseline land/water authority.
// - Imports terrain child authority with cache bust.
// - Composes visible texture from:
//   1. /assets/audralia/audralia.planet.render.js
//   2. /assets/audralia/audralia.terrain.render.js
// - Rotates the composed texture on Audralia-specific axis.
// - Keeps terrain pressure out of parent file.
//
// Does not own:
// - parent land/water generation
// - terrain generation
// - hydration
// - climate
// - ecology
// - fauna
// - Earth behavior
// - Gauges
// - Products
// - Sun
// - Moon
// - global files
// - visual pass claim

(function () {
  "use strict";

  const RECEIPT = "AUDRALIA_ROUTE_TERRAIN_CHILD_CONSUMPTION_AND_CACHE_BUST_TNT_v1";

  const ROUTE = "/showroom/globe/audralia/";
  const BODY = "audralia";
  const LABEL = "Audralia";

  const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";
  const TERRAIN_AUTHORITY = "/assets/audralia/audralia.terrain.render.js";

  const PARENT_VERSION = "AUDRALIA_PARENT_BASELINE_LAND_WATER_RESTORE_TNT_v1";
  const TERRAIN_VERSION = "AUDRALIA_G1_TERRAIN_PRESSURE_ISLAND_ELEVATION_CHILD_TNT_v2";

  const CONTROL = Object.freeze({
    axisDegrees: 21.5,
    autoStep: 0.00042,
    dragFactor: 0.00172,
    releaseFriction: 0.952,
    minVelocity: 0.000014,
    initialPhase: 0.18,
    minSize: 320,
    maxSize: 720,
    textureWidth: 768,
    textureHeight: 384,
    rotationModel: "audralia-natural-surface-phase",
    touchModel: "horizontal-spin-only",
    compositorModel: "parent-baseline-plus-terrain-child",
    diskRotation: "forbidden",
    wholeCanvasRotation: "forbidden",
    textureStretch: "forbidden",
    visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION"
  });

  const TERRAIN_CONTEXT = Object.freeze({
    coherenceIndex: 0.92,
    collaborativeExpression: 0.88
  });

  let activeState = null;

  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.max(min, Math.min(max, number));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function cacheUrl(path, version) {
    return path + "?v=" + encodeURIComponent(version) + "&route=" + encodeURIComponent(RECEIPT);
  }

  function query(selector) {
    return document.querySelector(selector);
  }

  function getMount() {
    return (
      document.getElementById("audraliaRenderMount") ||
      document.getElementById("audreliaRenderMount") ||
      query("[data-audralia-render-mount]") ||
      query("[data-audrelia-render-mount]") ||
      query("[data-body='audralia'][data-render-mount]") ||
      query("[data-body='audrelia'][data-render-mount]")
    );
  }

  function markRoute() {
    document.documentElement.dataset.activeBody = BODY;
    document.documentElement.dataset.activeRoute = ROUTE;
    document.documentElement.dataset.audraliaRouteControl = RECEIPT;
    document.documentElement.dataset.audraliaParentAuthority = PARENT_AUTHORITY;
    document.documentElement.dataset.audraliaTerrainAuthority = TERRAIN_AUTHORITY;
    document.documentElement.dataset.audraliaTerrainConsumption = "active";
    document.documentElement.dataset.audraliaCompositorModel = CONTROL.compositorModel;
    document.documentElement.dataset.earthAdoption = "blocked";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.activeBody = BODY;
      document.body.dataset.activeRoute = ROUTE;
      document.body.dataset.audraliaRouteControl = RECEIPT;
      document.body.dataset.audraliaTerrainConsumption = "active";
      document.body.dataset.earthAdoption = "blocked";
      document.body.dataset.publicReceipts = "hidden";
    }
  }

  function ensureStyle() {
    if (document.getElementById("audralia-terrain-compositor-rotation-style")) return;

    const style = document.createElement("style");
    style.id = "audralia-terrain-compositor-rotation-style";
    style.textContent = `
      #audraliaRenderMount,
      #audreliaRenderMount,
      [data-audralia-render-mount],
      [data-audrelia-render-mount],
      [data-body="audralia"][data-render-mount],
      [data-body="audrelia"][data-render-mount] {
        position: relative;
        display: grid;
        place-items: center;
        min-height: clamp(360px, 72vw, 720px);
        overflow: visible;
        isolation: isolate;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }

      .audralia-axis-stage {
        position: relative;
        display: grid;
        place-items: center;
        width: min(100%, 760px);
        aspect-ratio: 1 / 1;
        overflow: visible;
        isolation: isolate;
      }

      .audralia-axis-stage::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(74vw, 620px);
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background:
          radial-gradient(circle, rgba(92, 170, 238, 0.18), transparent 68%),
          radial-gradient(circle, rgba(255, 255, 255, 0.05), transparent 48%);
        filter: blur(2px);
        pointer-events: none;
        z-index: 0;
      }

      .audralia-axis-line {
        position: absolute;
        left: 50%;
        top: 50%;
        height: min(82vw, 690px);
        width: 2px;
        transform: translate(-50%, -50%) rotate(var(--audralia-axis-deg));
        transform-origin: center;
        background: linear-gradient(
          180deg,
          transparent 0%,
          rgba(210, 235, 255, 0.20) 12%,
          rgba(210, 235, 255, 0.42) 50%,
          rgba(210, 235, 255, 0.20) 88%,
          transparent 100%
        );
        box-shadow: 0 0 18px rgba(104, 175, 255, 0.18);
        pointer-events: none;
        z-index: 1;
      }

      .audralia-rotation-canvas {
        position: relative;
        z-index: 2;
        display: block;
        width: min(100%, 680px);
        max-width: min(100%, 680px);
        aspect-ratio: 1 / 1;
        border: 0;
        outline: 0;
        border-radius: 50%;
        background: transparent;
        box-shadow:
          inset -24px -18px 44px rgba(0, 0, 0, 0.32),
          inset 12px 10px 24px rgba(255, 255, 255, 0.07),
          0 0 0 1px rgba(184, 217, 255, 0.18),
          0 0 34px rgba(105, 177, 255, 0.22),
          0 0 86px rgba(105, 177, 255, 0.12);
        transform: none !important;
        rotate: none !important;
        scale: none !important;
        translate: none !important;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }

      .audralia-axis-label {
        position: absolute;
        left: 50%;
        bottom: clamp(18px, 5vw, 44px);
        z-index: 4;
        transform: translateX(-50%);
        border: 1px solid rgba(210, 235, 255, 0.18);
        border-radius: 999px;
        padding: 0.62rem 0.96rem;
        color: rgba(246, 239, 224, 0.92);
        background: rgba(5, 10, 20, 0.68);
        font: 900 clamp(0.7rem, 2.4vw, 0.92rem) / 1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        pointer-events: none;
      }

      .audralia-hidden-receipt {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  function getParentApi() {
    return (
      window.DGBAudraliaPlanetRender ||
      window.AudraliaPlanetRender ||
      window.audraliaPlanetRender ||
      window.DGBAudreliaPlanetRender ||
      window.AudreliaPlanetRender ||
      window.audreliaPlanetRender ||
      null
    );
  }

  function loadParentAuthority() {
    const existingApi = getParentApi();

    if (existingApi && typeof existingApi.buildTexture === "function") {
      return Promise.resolve(existingApi);
    }

    return new Promise(function (resolve) {
      const script = document.createElement("script");
      script.src = cacheUrl(PARENT_AUTHORITY, PARENT_VERSION);
      script.defer = true;
      script.dataset.audraliaParentAuthority = "true";
      script.dataset.contract = RECEIPT;

      script.onload = function () {
        resolve(getParentApi());
      };

      script.onerror = function () {
        resolve(null);
      };

      document.head.appendChild(script);
    });
  }

  function loadTerrainAuthority() {
    return import(cacheUrl(TERRAIN_AUTHORITY, TERRAIN_VERSION))
      .then(function (module) {
        if (module && typeof module.sampleTerrain === "function") {
          return module;
        }

        if (module && module.default && typeof module.default.sampleTerrain === "function") {
          return module.default;
        }

        return null;
      })
      .catch(function () {
        return null;
      });
  }

  function createFallbackTexture(width, height) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    const ocean = ctx.createLinearGradient(0, 0, width, height);
    ocean.addColorStop(0, "#08306a");
    ocean.addColorStop(0.55, "#145c94");
    ocean.addColorStop(1, "#061b4d");

    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, width, height);

    function blob(cx, cy, rx, ry, color) {
      ctx.beginPath();

      for (let i = 0; i <= 80; i += 1) {
        const a = (Math.PI * 2 * i) / 80;
        const wobble = 1 + Math.sin(a * 3 + cx * 0.01) * 0.08 + Math.sin(a * 7 + cy * 0.01) * 0.05;
        const x = cx + Math.cos(a) * rx * wobble;
        const y = cy + Math.sin(a) * ry * wobble;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    blob(width * 0.43, height * 0.49, width * 0.14, height * 0.18, "#77925f");
    blob(width * 0.18, height * 0.49, width * 0.10, height * 0.14, "#8d8b58");
    blob(width * 0.70, height * 0.51, width * 0.11, height * 0.14, "#3f8c58");
    blob(width * 0.58, height * 0.66, width * 0.08, height * 0.07, "#9a8f5c");
    blob(width * 0.50, height * 0.08, width * 0.18, height * 0.06, "#d4e7ee");

    ctx.fillStyle = "rgba(240, 249, 255, 0.88)";
    ctx.fillRect(0, height * 0.91, width, height * 0.08);

    return canvas;
  }

  function buildParentTexture(api) {
    if (api && typeof api.buildTexture === "function") {
      try {
        const texture = api.buildTexture({
          width: CONTROL.textureWidth,
          height: CONTROL.textureHeight
        });

        if (texture && texture.getContext && texture.width && texture.height) {
          return texture;
        }
      } catch (error) {
        // Fallback keeps the route alive.
      }
    }

    return createFallbackTexture(CONTROL.textureWidth, CONTROL.textureHeight);
  }

  function terrainLandColor(sample) {
    const influence = sample && sample.terrainColorInfluence ? sample.terrainColorInfluence : null;

    let r = influence && Number.isFinite(influence.r) ? influence.r : 112;
    let g = influence && Number.isFinite(influence.g) ? influence.g : 142;
    let b = influence && Number.isFinite(influence.b) ? influence.b : 92;

    const elevation = clamp(sample.normalizedElevation || 0, 0, 1);
    const regionElevation = clamp(sample.regionRelativeElevation || 0, 0, 1);
    const ridge = clamp(sample.ridge || 0, 0, 1);
    const dry = clamp(sample.dryInteriorPressure || 0, 0, 1);
    const coast = clamp(sample.coastPressure || 0, 0, 1);

    r = mix(r, 210, elevation * 0.22 + regionElevation * 0.18);
    g = mix(g, 198, ridge * 0.16);
    b = mix(b, 164, ridge * 0.16);

    r = mix(r, 184, dry * 0.22);
    g = mix(g, 132, dry * 0.18);
    b = mix(b, 84, dry * 0.14);

    r = mix(r, 210, coast * 0.16);
    g = mix(g, 185, coast * 0.12);
    b = mix(b, 112, coast * 0.10);

    return {
      r: clamp(Math.round(r), 0, 255),
      g: clamp(Math.round(g), 0, 255),
      b: clamp(Math.round(b), 0, 255)
    };
  }

  function terrainWaterColor(sample, base) {
    const shelf = clamp(sample.shelfPermission || 0, 0, 1);
    const depth = clamp(Math.abs(sample.normalizedElevation || 0), 0, 1);
    const coast = clamp(sample.coastPressure || 0, 0, 1);

    let r = mix(8, 44, shelf);
    let g = mix(30, 142, shelf);
    let b = mix(78, 168, shelf);

    r = mix(r, base.r, 0.38 + depth * 0.22);
    g = mix(g, base.g, 0.38 + depth * 0.22);
    b = mix(b, base.b, 0.38 + depth * 0.22);

    r = mix(r, 86, coast * 0.15);
    g = mix(g, 176, coast * 0.18);
    b = mix(b, 190, coast * 0.18);

    return {
      r: clamp(Math.round(r), 0, 255),
      g: clamp(Math.round(g), 0, 255),
      b: clamp(Math.round(b), 0, 255)
    };
  }

  function terrainIceColor(sample) {
    const southIce = sample.southIce || sample.regionKey === "south_polar_ice";
    return southIce
      ? { r: 238, g: 248, b: 252 }
      : { r: 222, g: 237, b: 244 };
  }

  function composeTexture(parentTexture, terrainModule) {
    if (!terrainModule || typeof terrainModule.sampleTerrain !== "function") {
      parentTexture.dataset.compositorStatus = "terrain-child-missing-parent-only";
      return parentTexture;
    }

    const width = parentTexture.width || CONTROL.textureWidth;
    const height = parentTexture.height || CONTROL.textureHeight;

    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = width;
    sourceCanvas.height = height;

    const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
    sourceCtx.drawImage(parentTexture, 0, 0, width, height);

    const image = sourceCtx.getImageData(0, 0, width, height);
    const data = image.data;

    let landSamples = 0;
    let waterSamples = 0;
    let iceSamples = 0;
    let terrainSamples = 0;

    for (let py = 0; py < height; py += 1) {
      const v = height <= 1 ? 0.5 : py / (height - 1);

      for (let px = 0; px < width; px += 1) {
        const u = width <= 1 ? 0.5 : px / (width - 1);
        const index = (py * width + px) * 4;

        const base = {
          r: data[index],
          g: data[index + 1],
          b: data[index + 2]
        };

        let sample = null;

        try {
          sample = terrainModule.sampleTerrain(u, v, TERRAIN_CONTEXT);
        } catch (error) {
          sample = null;
        }

        if (!sample) continue;

        terrainSamples += 1;

        let target = base;
        let amount = 0.35;

        if (sample.isIce) {
          iceSamples += 1;
          target = terrainIceColor(sample);
          amount = 0.92;
        } else if (sample.isLand) {
          landSamples += 1;
          target = terrainLandColor(sample);
          amount = clamp(
            0.72 +
              clamp(sample.landPressure || 0, 0, 1) * 0.16 +
              clamp(sample.territoryStrength || 0, 0, 1) * 0.16 +
              clamp(sample.regionRelativeElevation || 0, 0, 1) * 0.08,
            0.72,
            0.96
          );
        } else {
          waterSamples += 1;
          target = terrainWaterColor(sample, base);
          amount = clamp(0.28 + clamp(sample.shelfPermission || 0, 0, 1) * 0.30, 0.26, 0.62);
        }

        data[index] = clamp(Math.round(mix(base.r, target.r, amount)), 0, 255);
        data[index + 1] = clamp(Math.round(mix(base.g, target.g, amount)), 0, 255);
        data[index + 2] = clamp(Math.round(mix(base.b, target.b, amount)), 0, 255);
        data[index + 3] = 255;
      }
    }

    sourceCtx.putImageData(image, 0, 0);

    sourceCanvas.dataset.body = BODY;
    sourceCanvas.dataset.contract = RECEIPT;
    sourceCanvas.dataset.parentAuthority = PARENT_AUTHORITY;
    sourceCanvas.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    sourceCanvas.dataset.compositorStatus = "parent-plus-terrain-child";
    sourceCanvas.dataset.landSamples = String(landSamples);
    sourceCanvas.dataset.waterSamples = String(waterSamples);
    sourceCanvas.dataset.iceSamples = String(iceSamples);
    sourceCanvas.dataset.terrainSamples = String(terrainSamples);
    sourceCanvas.dataset.visualPass = CONTROL.visualPass;

    return sourceCanvas;
  }

  function createStage(mount) {
    const stage = document.createElement("div");
    stage.className = "audralia-axis-stage";
    stage.dataset.body = BODY;
    stage.dataset.route = ROUTE;
    stage.dataset.contract = RECEIPT;
    stage.dataset.axisDegrees = String(CONTROL.axisDegrees);
    stage.dataset.rotationModel = CONTROL.rotationModel;
    stage.dataset.compositorModel = CONTROL.compositorModel;
    stage.dataset.parentAuthority = PARENT_AUTHORITY;
    stage.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    stage.dataset.diskRotation = CONTROL.diskRotation;
    stage.dataset.textureStretch = CONTROL.textureStretch;
    stage.style.setProperty("--audralia-axis-deg", CONTROL.axisDegrees + "deg");

    const axis = document.createElement("div");
    axis.className = "audralia-axis-line";
    axis.dataset.axis = "audralia-fixed-axis";
    axis.dataset.axisDegrees = String(CONTROL.axisDegrees);

    const canvas = document.createElement("canvas");
    canvas.className = "audralia-rotation-canvas";
    canvas.dataset.body = BODY;
    canvas.dataset.contract = RECEIPT;
    canvas.dataset.rotationModel = CONTROL.rotationModel;
    canvas.dataset.compositorModel = CONTROL.compositorModel;
    canvas.dataset.touchModel = CONTROL.touchModel;
    canvas.dataset.diskRotation = CONTROL.diskRotation;
    canvas.dataset.wholeCanvasRotation = CONTROL.wholeCanvasRotation;
    canvas.dataset.textureStretch = CONTROL.textureStretch;
    canvas.dataset.visualPass = CONTROL.visualPass;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Audralia terrain-composed natural axis rotation control");

    const label = document.createElement("div");
    label.className = "audralia-axis-label";
    label.textContent = "AUDRALIA · TERRAIN COMPOSED";

    const receipt = document.createElement("div");
    receipt.hidden = true;
    receipt.setAttribute("aria-hidden", "true");
    receipt.className = "audralia-hidden-receipt";
    receipt.dataset.contract = RECEIPT;
    receipt.dataset.route = ROUTE;
    receipt.dataset.parentAuthority = PARENT_AUTHORITY;
    receipt.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    receipt.dataset.axisDegrees = String(CONTROL.axisDegrees);
    receipt.dataset.rotationModel = CONTROL.rotationModel;
    receipt.dataset.compositorModel = CONTROL.compositorModel;
    receipt.dataset.visualPass = CONTROL.visualPass;
    receipt.textContent =
      "AUDRALIA_ROUTE_TERRAIN_CHILD_CONSUMPTION_AND_CACHE_BUST_TNT_v1 parent_baseline=consumed terrain_child=consumed surface_phase=active visual_pass=held";

    stage.appendChild(axis);
    stage.appendChild(canvas);
    stage.appendChild(label);
    stage.appendChild(receipt);

    mount.replaceChildren(stage);

    mount.dataset.body = BODY;
    mount.dataset.route = ROUTE;
    mount.dataset.contract = RECEIPT;
    mount.dataset.parentAuthority = PARENT_AUTHORITY;
    mount.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    mount.dataset.terrainConsumption = "active";
    mount.dataset.axisDegrees = String(CONTROL.axisDegrees);
    mount.dataset.rotationModel = CONTROL.rotationModel;
    mount.dataset.compositorModel = CONTROL.compositorModel;
    mount.dataset.touchModel = CONTROL.touchModel;
    mount.dataset.diskRotation = CONTROL.diskRotation;
    mount.dataset.wholeCanvasRotation = CONTROL.wholeCanvasRotation;
    mount.dataset.textureStretch = CONTROL.textureStretch;
    mount.dataset.visualPass = CONTROL.visualPass;
    mount.dataset.earthAdoption = "blocked";

    return { stage, canvas };
  }

  function sizeCanvas(canvas, mount) {
    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : null;
    const available = rect && rect.width ? rect.width : window.innerWidth - 32;
    const cssSize = clamp(Math.floor(available * 0.88), CONTROL.minSize, CONTROL.maxSize);
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const px = Math.max(CONTROL.minSize, Math.floor(cssSize * dpr));

    if (canvas.width !== px || canvas.height !== px) {
      canvas.width = px;
      canvas.height = px;
    }

    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    return px;
  }

  function drawWrappedStrip(ctx, texture, phase, sy, sh, dx, dy, dw, dh) {
    if (!texture || !texture.width || !texture.height || dw <= 0 || dh <= 0) return;

    const sourceWidth = texture.width;
    const sourceHeight = texture.height;
    const start = wrap01(phase) * sourceWidth;
    const safeSy = clamp(sy, 0, sourceHeight - 1);
    const safeSh = clamp(sh, 1, sourceHeight - safeSy);

    const firstSourceWidth = sourceWidth - start;
    const firstDestWidth = dw * (firstSourceWidth / sourceWidth);
    const secondDestWidth = dw - firstDestWidth;

    ctx.drawImage(texture, start, safeSy, firstSourceWidth, safeSh, dx, dy, firstDestWidth, dh);

    if (secondDestWidth > 0.5) {
      ctx.drawImage(texture, 0, safeSy, start, safeSh, dx + firstDestWidth, dy, secondDestWidth, dh);
    }
  }

  function drawSphere(ctx, texture, phase, size) {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.405;
    const stripHeight = Math.max(2, Math.floor(size / 260));
    const sourceHeight = texture.height || CONTROL.textureHeight;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    for (let y = -radius; y <= radius; y += stripHeight) {
      const yMid = y + stripHeight / 2;
      const normalizedY = yMid / radius;
      const chord = Math.sqrt(Math.max(0, 1 - normalizedY * normalizedY));
      const destWidth = radius * 2 * chord;
      const destX = cx - destWidth / 2;
      const destY = cy + y;
      const v = clamp(0.5 + normalizedY * 0.5, 0, 1);
      const sy = Math.floor(v * (sourceHeight - 1));
      const sh = Math.max(1, Math.ceil((stripHeight / (radius * 2)) * sourceHeight * 1.72));

      drawWrappedStrip(ctx, texture, phase, sy, sh, destX, destY, destWidth, stripHeight + 1);
    }

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const light = ctx.createRadialGradient(
      cx - radius * 0.34,
      cy - radius * 0.36,
      radius * 0.03,
      cx,
      cy,
      radius * 1.16
    );

    light.addColorStop(0, "rgba(255,255,255,0.20)");
    light.addColorStop(0.35, "rgba(255,255,255,0.06)");
    light.addColorStop(0.74, "rgba(0,0,0,0.10)");
    light.addColorStop(1, "rgba(0,0,0,0.42)");

    ctx.fillStyle = light;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const edge = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius);
    edge.addColorStop(0, "rgba(0,0,0,0)");
    edge.addColorStop(0.82, "rgba(8,23,44,0.10)");
    edge.addColorStop(1, "rgba(10,24,42,0.38)");

    ctx.fillStyle = edge;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(190, 226, 255, 0.28)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();
    ctx.restore();
  }

  function attachControls(state) {
    const canvas = state.canvas;

    function point(event) {
      const source = event.touches && event.touches[0] ? event.touches[0] : event;
      return {
        x: source.clientX,
        y: source.clientY
      };
    }

    function down(event) {
      const p = point(event);
      state.dragging = true;
      state.lastX = p.x;
      state.velocity = 0;
      canvas.dataset.dragging = "true";

      if (canvas.setPointerCapture && event.pointerId !== undefined) {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch (error) {}
      }

      if (event.cancelable) event.preventDefault();
    }

    function move(event) {
      if (!state.dragging) return;

      const p = point(event);
      const dx = p.x - state.lastX;
      state.lastX = p.x;

      const delta = -dx * CONTROL.dragFactor;
      state.phase = wrap01(state.phase + delta);
      state.velocity = delta * 0.58;

      draw(state);

      if (event.cancelable) event.preventDefault();
    }

    function up() {
      state.dragging = false;
      canvas.dataset.dragging = "false";
    }

    canvas.addEventListener("pointerdown", down, { passive: false });
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    state.cleanup.push(function () {
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    });
  }

  function draw(state) {
    const size = sizeCanvas(state.canvas, state.mount);
    drawSphere(state.ctx, state.texture, state.phase, size);

    state.canvas.dataset.phase = state.phase.toFixed(5);
    state.canvas.dataset.velocity = state.velocity.toFixed(6);
    state.canvas.dataset.terrainConsumption = "active";
    state.mount.dataset.phase = state.phase.toFixed(5);
    state.mount.dataset.velocity = state.velocity.toFixed(6);
  }

  function tick(state) {
    if (!state.running) return;

    state.phase = wrap01(state.phase + CONTROL.autoStep + state.velocity);
    state.velocity *= CONTROL.releaseFriction;

    if (Math.abs(state.velocity) < CONTROL.minVelocity) {
      state.velocity = 0;
    }

    draw(state);

    state.raf = window.requestAnimationFrame(function () {
      tick(state);
    });
  }

  function destroyActiveState() {
    if (!activeState) return;

    activeState.running = false;

    if (activeState.raf) {
      window.cancelAnimationFrame(activeState.raf);
    }

    activeState.cleanup.forEach(function (fn) {
      fn();
    });

    activeState = null;
  }

  function boot() {
    markRoute();
    ensureStyle();

    const mount = getMount();

    if (!mount) {
      document.documentElement.dataset.audraliaRouteControlStatus = "missing-mount";
      return;
    }

    destroyActiveState();

    Promise.all([loadParentAuthority(), loadTerrainAuthority()]).then(function (results) {
      const parentApi = results[0];
      const terrainApi = results[1];

      const parentTexture = buildParentTexture(parentApi);
      const composedTexture = composeTexture(parentTexture, terrainApi);

      const parts = createStage(mount);
      const ctx = parts.canvas.getContext("2d", { alpha: true });

      const state = {
        mount,
        stage: parts.stage,
        canvas: parts.canvas,
        ctx,
        texture: composedTexture,
        parentApi,
        terrainApi,
        phase: CONTROL.initialPhase,
        velocity: 0,
        dragging: false,
        lastX: 0,
        running: false,
        raf: 0,
        cleanup: []
      };

      activeState = state;

      attachControls(state);
      draw(state);

      state.running = true;
      state.raf = window.requestAnimationFrame(function () {
        tick(state);
      });

      document.documentElement.dataset.audraliaRouteControlStatus = "active";
      document.documentElement.dataset.audraliaParentAuthorityLoaded = String(Boolean(parentApi));
      document.documentElement.dataset.audraliaTerrainAuthorityLoaded = String(Boolean(terrainApi));
      document.documentElement.dataset.audraliaComposedTexture = composedTexture.dataset.compositorStatus || "unknown";

      mount.dataset.parentAuthorityLoaded = String(Boolean(parentApi));
      mount.dataset.terrainAuthorityLoaded = String(Boolean(terrainApi));
      mount.dataset.composedTexture = composedTexture.dataset.compositorStatus || "unknown";
      mount.dataset.terrainSamples = composedTexture.dataset.terrainSamples || "0";
      mount.dataset.landSamples = composedTexture.dataset.landSamples || "0";
      mount.dataset.waterSamples = composedTexture.dataset.waterSamples || "0";
      mount.dataset.iceSamples = composedTexture.dataset.iceSamples || "0";

      window.dispatchEvent(
        new CustomEvent("dgb:audralia-terrain-composed-rotation-ready", {
          detail: {
            body: BODY,
            label: LABEL,
            route: ROUTE,
            contract: RECEIPT,
            parentAuthority: PARENT_AUTHORITY,
            terrainAuthority: TERRAIN_AUTHORITY,
            parentLoaded: Boolean(parentApi),
            terrainLoaded: Boolean(terrainApi),
            composedTexture: composedTexture.dataset.compositorStatus || "unknown",
            terrainSamples: composedTexture.dataset.terrainSamples || "0",
            landSamples: composedTexture.dataset.landSamples || "0",
            waterSamples: composedTexture.dataset.waterSamples || "0",
            iceSamples: composedTexture.dataset.iceSamples || "0",
            axisDegrees: CONTROL.axisDegrees,
            rotationModel: CONTROL.rotationModel,
            visualPass: CONTROL.visualPass
          }
        })
      );
    });
  }

  window.DGBAudraliaRouteControl = Object.freeze({
    receipt: RECEIPT,
    body: BODY,
    label: LABEL,
    route: ROUTE,
    parentAuthority: PARENT_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,
    parentVersion: PARENT_VERSION,
    terrainVersion: TERRAIN_VERSION,
    control: CONTROL,
    boot,
    getStatus: function () {
      return Object.freeze({
        ok: Boolean(activeState),
        receipt: RECEIPT,
        body: BODY,
        route: ROUTE,
        parentAuthority: PARENT_AUTHORITY,
        terrainAuthority: TERRAIN_AUTHORITY,
        parentLoaded: Boolean(activeState && activeState.parentApi),
        terrainLoaded: Boolean(activeState && activeState.terrainApi),
        axisDegrees: CONTROL.axisDegrees,
        rotationModel: CONTROL.rotationModel,
        touchModel: CONTROL.touchModel,
        compositorModel: CONTROL.compositorModel,
        phase: activeState ? activeState.phase : null,
        velocity: activeState ? activeState.velocity : null,
        planetPosition: "fixed",
        canvas: "fixed",
        surfacePhase: "active",
        terrainChildConsumption: "active",
        diskRotation: "forbidden",
        wholeCanvasRotation: "forbidden",
        textureStretch: "forbidden",
        earthInheritance: "forbidden",
        parentReopened: false,
        terrainRewrittenHere: false,
        hydrationOwnedHere: false,
        climateOwnedHere: false,
        visualPassClaimed: false
      });
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
