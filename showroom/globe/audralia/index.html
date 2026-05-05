// /showroom/globe/audralia/index.js
// AUDRALIA_EXISTING_ROUTE_COMPOSITOR_REWIRE_TNT_v1
//
// Existing-file correction only.
// No new file required.
// This route script owns visible consumption/composition/control.
// Parent owns baseline land/water only.
// Terrain child owns terrain pressure only.
// This file consumes both and renders the visible Audralia body.

(function () {
  "use strict";

  const RECEIPT = "AUDRALIA_EXISTING_ROUTE_COMPOSITOR_REWIRE_TNT_v1";

  const ROUTE = "/showroom/globe/audralia/";
  const BODY = "audralia";
  const LABEL = "Audralia";

  const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";
  const TERRAIN_AUTHORITY = "/assets/audralia/audralia.terrain.render.js";

  const PARENT_VERSION = "AUDRALIA_PARENT_BASELINE_LAND_WATER_RESTORE_TNT_v1";
  const TERRAIN_VERSION = "AUDRALIA_G1_TERRAIN_PRESSURE_ISLAND_ELEVATION_CHILD_TNT_v2";

  const CONTROL = Object.freeze({
    axisDegrees: 21.5,
    textureWidth: 768,
    textureHeight: 384,
    minSize: 320,
    maxSize: 720,
    initialPhase: 0.18,
    autoStep: 0.00046,
    dragFactor: 0.00174,
    releaseFriction: 0.952,
    minVelocity: 0.000014,
    rotationModel: "audralia-existing-route-surface-phase",
    compositorModel: "existing-route-parent-baseline-plus-terrain-child",
    touchModel: "horizontal-spin-only",
    diskRotation: "forbidden",
    wholeCanvasRotation: "forbidden",
    textureStretch: "forbidden",
    visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION"
  });

  const TERRAIN_CONTEXT = Object.freeze({
    coherenceIndex: 0.94,
    collaborativeExpression: 0.9
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
    return (
      path +
      "?v=" +
      encodeURIComponent(version) +
      "&consumer=" +
      encodeURIComponent(RECEIPT) +
      "&t=" +
      String(Date.now())
    );
  }

  function getMount() {
    return (
      document.getElementById("audraliaRenderMount") ||
      document.getElementById("audreliaRenderMount") ||
      document.querySelector("[data-audralia-render-mount]") ||
      document.querySelector("[data-audrelia-render-mount]") ||
      document.querySelector("[data-body='audralia'][data-render-mount]") ||
      document.querySelector("[data-body='audrelia'][data-render-mount]")
    );
  }

  function markRoute(status) {
    document.documentElement.dataset.activeBody = BODY;
    document.documentElement.dataset.activeRoute = ROUTE;
    document.documentElement.dataset.audraliaExistingRouteCompositor = RECEIPT;
    document.documentElement.dataset.audraliaRouteCompositorStatus = status || "booting";
    document.documentElement.dataset.audraliaParentAuthority = PARENT_AUTHORITY;
    document.documentElement.dataset.audraliaTerrainAuthority = TERRAIN_AUTHORITY;
    document.documentElement.dataset.audraliaCompositorModel = CONTROL.compositorModel;
    document.documentElement.dataset.oldNewFileBypass = "not-used";
    document.documentElement.dataset.newFileRequired = "false";
    document.documentElement.dataset.earthAdoption = "blocked";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.activeBody = BODY;
      document.body.dataset.activeRoute = ROUTE;
      document.body.dataset.audraliaExistingRouteCompositor = RECEIPT;
      document.body.dataset.publicReceipts = "hidden";
      document.body.dataset.earthAdoption = "blocked";
    }
  }

  function ensureStyle() {
    if (document.getElementById("audralia-existing-route-compositor-style")) return;

    const style = document.createElement("style");
    style.id = "audralia-existing-route-compositor-style";
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
        min-height: clamp(360px, 74vw, 740px);
        overflow: visible;
        isolation: isolate;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }

      .audralia-existing-route-stage {
        position: relative;
        display: grid;
        place-items: center;
        width: min(100%, 780px);
        aspect-ratio: 1 / 1;
        overflow: visible;
        isolation: isolate;
      }

      .audralia-existing-route-stage::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(78vw, 650px);
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background:
          radial-gradient(circle, rgba(82, 164, 232, 0.18), transparent 66%),
          radial-gradient(circle, rgba(255, 255, 255, 0.05), transparent 44%);
        filter: blur(2px);
        pointer-events: none;
        z-index: 0;
      }

      .audralia-existing-route-axis {
        position: absolute;
        left: 50%;
        top: 50%;
        height: min(84vw, 700px);
        width: 2px;
        transform: translate(-50%, -50%) rotate(var(--audralia-axis-deg));
        transform-origin: center;
        background: linear-gradient(
          180deg,
          transparent 0%,
          rgba(212, 235, 255, 0.14) 12%,
          rgba(212, 235, 255, 0.36) 50%,
          rgba(212, 235, 255, 0.14) 88%,
          transparent 100%
        );
        pointer-events: none;
        z-index: 1;
      }

      .audralia-existing-route-canvas {
        position: relative;
        z-index: 2;
        display: block;
        width: min(100%, 690px);
        max-width: min(100%, 690px);
        aspect-ratio: 1 / 1;
        border: 0;
        outline: 0;
        border-radius: 50%;
        background: transparent;
        box-shadow:
          inset -28px -20px 48px rgba(0, 0, 0, 0.34),
          inset 12px 10px 24px rgba(255, 255, 255, 0.07),
          0 0 0 1px rgba(184, 217, 255, 0.18),
          0 0 36px rgba(105, 177, 255, 0.22),
          0 0 90px rgba(105, 177, 255, 0.13);
        transform: none !important;
        rotate: none !important;
        scale: none !important;
        translate: none !important;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }

      .audralia-existing-route-label {
        position: absolute;
        left: 50%;
        bottom: clamp(18px, 5vw, 44px);
        z-index: 4;
        transform: translateX(-50%);
        border: 1px solid rgba(210, 235, 255, 0.18);
        border-radius: 999px;
        padding: 0.62rem 0.96rem;
        color: rgba(246, 239, 224, 0.92);
        background: rgba(5, 10, 20, 0.70);
        font: 900 clamp(0.7rem, 2.4vw, 0.92rem) / 1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        pointer-events: none;
      }

      .audralia-existing-route-hidden-receipt {
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
    const existing = getParentApi();

    if (existing && typeof existing.buildTexture === "function") {
      return Promise.resolve(existing);
    }

    return new Promise(function (resolve) {
      const script = document.createElement("script");
      script.src = cacheUrl(PARENT_AUTHORITY, PARENT_VERSION);
      script.defer = true;
      script.dataset.audraliaParentAuthority = "true";
      script.dataset.consumer = RECEIPT;

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
        if (module && typeof module.sampleTerrain === "function") return module;
        if (module && module.default && typeof module.default.sampleTerrain === "function") return module.default;
        return null;
      })
      .catch(function () {
        return null;
      });
  }

  function fallbackParentTexture(width, height) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    const ocean = ctx.createLinearGradient(0, 0, width, height);
    ocean.addColorStop(0, "#08306a");
    ocean.addColorStop(0.52, "#145c94");
    ocean.addColorStop(1, "#061b4d");

    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(240,249,255,0.90)";
    ctx.fillRect(0, height * 0.91, width, height * 0.08);

    return canvas;
  }

  function buildParentTexture(parentApi) {
    if (parentApi && typeof parentApi.buildTexture === "function") {
      try {
        const texture = parentApi.buildTexture({
          width: CONTROL.textureWidth,
          height: CONTROL.textureHeight
        });

        if (texture && texture.getContext && texture.width && texture.height) {
          texture.dataset.parentAuthority = PARENT_AUTHORITY;
          return texture;
        }
      } catch (error) {
        // Fall through.
      }
    }

    const fallback = fallbackParentTexture(CONTROL.textureWidth, CONTROL.textureHeight);
    fallback.dataset.parentAuthority = "fallback-parent-baseline";
    return fallback;
  }

  function fallbackTerrainSample(u, v) {
    const lon = u * 2 - 1;
    const lat = 1 - v * 2;

    const bodies = [
      { lon: -0.1, lat: 0.02, rx: 0.36, ry: 0.28, region: 2, elevation: 0.28 },
      { lon: -0.62, lat: 0.0, rx: 0.22, ry: 0.24, region: 8, elevation: 0.7 },
      { lon: 0.58, lat: 0.04, rx: 0.24, ry: 0.24, region: 4, elevation: 0.42 },
      { lon: 0.16, lat: -0.46, rx: 0.3, ry: 0.18, region: 6, elevation: 0.62 },
      { lon: 0.02, lat: 0.82, rx: 0.42, ry: 0.14, region: 7, elevation: 0.72 }
    ];

    let best = null;
    let strength = 0;

    for (const body of bodies) {
      const dx = lon - body.lon;
      const dy = lat - body.lat;
      const d = Math.exp(-((dx * dx) / (body.rx * body.rx) + (dy * dy) / (body.ry * body.ry)));

      if (d > strength) {
        strength = d;
        best = body;
      }
    }

    for (let i = 0; i < 72; i += 1) {
      const ilon = -0.82 + ((i * 0.137) % 1.64);
      const ilat = -0.58 + Math.sin(i * 1.71) * 0.42 + Math.cos(i * 0.61) * 0.06;
      const radius = 0.022 + (i % 5) * 0.004;
      const dx = lon - ilon;
      const dy = lat - ilat;
      const d = Math.exp(-((dx * dx + dy * dy) / (radius * radius)));

      if (d > strength) {
        strength = d;
        best = {
          lon: ilon,
          lat: ilat,
          rx: radius,
          ry: radius,
          region: 1 + (i % 9),
          elevation: 0.12 + (i % 9) * 0.1
        };
      }
    }

    const southIce = lat < -0.76;
    const isLand = !southIce && strength > 0.5;

    return {
      isLand,
      isWater: !isLand && !southIce,
      isIce: southIce,
      southIce,
      normalizedElevation: isLand && best ? best.elevation : southIce ? 0 : -0.5,
      regionRelativeElevation: isLand && best ? best.elevation : 0,
      regionId: isLand && best ? best.region : 0,
      landPressure: strength,
      territoryStrength: isLand ? strength : 0,
      coastPressure: Math.max(0, 1 - Math.abs(strength - 0.5) / 0.18),
      shelfPermission: !isLand && !southIce ? Math.max(0, 1 - Math.abs(strength - 0.5) / 0.22) : 0,
      ridge: isLand && best ? Math.max(0, best.elevation - 0.35) : 0,
      dryInteriorPressure: isLand && Math.abs(lat) > 0.28 ? 0.35 : 0
    };
  }

  function sampleTerrain(terrainApi, u, v) {
    if (terrainApi && typeof terrainApi.sampleTerrain === "function") {
      try {
        const sample = terrainApi.sampleTerrain(u, v, TERRAIN_CONTEXT);
        if (sample) return sample;
      } catch (error) {
        return fallbackTerrainSample(u, v);
      }
    }

    return fallbackTerrainSample(u, v);
  }

  function terrainColor(sample, base) {
    if (sample.isIce) {
      return { r: 238, g: 248, b: 252, amount: 0.94 };
    }

    if (sample.isLand) {
      const elevation = clamp(sample.normalizedElevation || 0, 0, 1);
      const region = clamp(sample.regionRelativeElevation || elevation, 0, 1);
      const ridge = clamp(sample.ridge || 0, 0, 1);
      const dry = clamp(sample.dryInteriorPressure || 0, 0, 1);
      const coast = clamp(sample.coastPressure || 0, 0, 1);

      let r = mix(76, 210, region * 0.74);
      let g = mix(132, 192, ridge * 0.3);
      let b = mix(82, 150, ridge * 0.24);

      r = mix(r, 184, dry * 0.32);
      g = mix(g, 128, dry * 0.24);
      b = mix(b, 82, dry * 0.18);

      r = mix(r, 214, coast * 0.16);
      g = mix(g, 190, coast * 0.13);
      b = mix(b, 118, coast * 0.1);

      return {
        r: clamp(Math.round(r), 0, 255),
        g: clamp(Math.round(g), 0, 255),
        b: clamp(Math.round(b), 0, 255),
        amount: clamp(0.82 + elevation * 0.12 + clamp(sample.territoryStrength || 0, 0, 1) * 0.1, 0.82, 0.98)
      };
    }

    const shelf = clamp(sample.shelfPermission || 0, 0, 1);
    const coast = clamp(sample.coastPressure || 0, 0, 1);

    return {
      r: clamp(Math.round(mix(base.r, mix(10, 56, shelf), 0.42 + coast * 0.1)), 0, 255),
      g: clamp(Math.round(mix(base.g, mix(42, 164, shelf), 0.42 + coast * 0.12)), 0, 255),
      b: clamp(Math.round(mix(base.b, mix(100, 188, shelf), 0.42 + coast * 0.12)), 0, 255),
      amount: clamp(0.34 + shelf * 0.28 + coast * 0.14, 0.28, 0.7)
    };
  }

  function composeTexture(parentTexture, terrainApi) {
    const width = parentTexture.width || CONTROL.textureWidth;
    const height = parentTexture.height || CONTROL.textureHeight;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(parentTexture, 0, 0, width, height);

    const image = ctx.getImageData(0, 0, width, height);
    const data = image.data;

    let terrainSamples = 0;
    let landSamples = 0;
    let waterSamples = 0;
    let iceSamples = 0;

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

        const sample = sampleTerrain(terrainApi, u, v);
        const target = terrainColor(sample, base);

        terrainSamples += 1;
        if (sample.isIce) iceSamples += 1;
        else if (sample.isLand) landSamples += 1;
        else waterSamples += 1;

        data[index] = clamp(Math.round(mix(base.r, target.r, target.amount)), 0, 255);
        data[index + 1] = clamp(Math.round(mix(base.g, target.g, target.amount)), 0, 255);
        data[index + 2] = clamp(Math.round(mix(base.b, target.b, target.amount)), 0, 255);
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    canvas.dataset.body = BODY;
    canvas.dataset.contract = RECEIPT;
    canvas.dataset.parentAuthority = PARENT_AUTHORITY;
    canvas.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    canvas.dataset.parentTexture = parentTexture.dataset.parentAuthority || PARENT_AUTHORITY;
    canvas.dataset.terrainLoaded = String(Boolean(terrainApi));
    canvas.dataset.compositorStatus = terrainApi ? "parent-plus-terrain-child" : "parent-plus-fallback-terrain";
    canvas.dataset.terrainSamples = String(terrainSamples);
    canvas.dataset.landSamples = String(landSamples);
    canvas.dataset.waterSamples = String(waterSamples);
    canvas.dataset.iceSamples = String(iceSamples);
    canvas.dataset.visualPass = CONTROL.visualPass;

    return canvas;
  }

  function createStage(mount) {
    const stage = document.createElement("div");
    stage.className = "audralia-existing-route-stage";
    stage.dataset.body = BODY;
    stage.dataset.route = ROUTE;
    stage.dataset.contract = RECEIPT;
    stage.dataset.axisDegrees = String(CONTROL.axisDegrees);
    stage.dataset.compositorModel = CONTROL.compositorModel;
    stage.style.setProperty("--audralia-axis-deg", CONTROL.axisDegrees + "deg");

    const axis = document.createElement("div");
    axis.className = "audralia-existing-route-axis";
    axis.dataset.axis = "audralia-fixed-axis";

    const canvas = document.createElement("canvas");
    canvas.className = "audralia-existing-route-canvas";
    canvas.dataset.body = BODY;
    canvas.dataset.contract = RECEIPT;
    canvas.dataset.rotationModel = CONTROL.rotationModel;
    canvas.dataset.touchModel = CONTROL.touchModel;
    canvas.dataset.compositorModel = CONTROL.compositorModel;
    canvas.dataset.diskRotation = CONTROL.diskRotation;
    canvas.dataset.textureStretch = CONTROL.textureStretch;
    canvas.dataset.visualPass = CONTROL.visualPass;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Audralia existing route compositor with terrain child consumption and natural axis rotation");

    const label = document.createElement("div");
    label.className = "audralia-existing-route-label";
    label.textContent = "AUDRALIA · ROUTE COMPOSITOR";

    const receipt = document.createElement("div");
    receipt.hidden = true;
    receipt.setAttribute("aria-hidden", "true");
    receipt.className = "audralia-existing-route-hidden-receipt";
    receipt.dataset.contract = RECEIPT;
    receipt.dataset.route = ROUTE;
    receipt.dataset.parentAuthority = PARENT_AUTHORITY;
    receipt.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    receipt.dataset.newFileRequired = "false";
    receipt.dataset.visualPass = CONTROL.visualPass;
    receipt.textContent =
      "AUDRALIA_EXISTING_ROUTE_COMPOSITOR_REWIRE_TNT_v1 new_file_required=false parent_consumed=true terrain_consumed=true visual_pass=held";

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
    mount.dataset.compositorModel = CONTROL.compositorModel;
    mount.dataset.rotationModel = CONTROL.rotationModel;
    mount.dataset.visualPass = CONTROL.visualPass;
    mount.dataset.newFileRequired = "false";
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
    const stripHeight = Math.max(2, Math.floor(size / 270));
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
    ctx.strokeStyle = "rgba(190,226,255,0.28)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();
    ctx.restore();
  }

  function draw(state) {
    const size = sizeCanvas(state.canvas, state.mount);
    drawSphere(state.ctx, state.texture, state.phase, size);

    state.canvas.dataset.phase = state.phase.toFixed(5);
    state.canvas.dataset.velocity = state.velocity.toFixed(6);
    state.mount.dataset.phase = state.phase.toFixed(5);
    state.mount.dataset.velocity = state.velocity.toFixed(6);
  }

  function attachControls(state) {
    const canvas = state.canvas;

    function point(event) {
      const source = event.touches && event.touches[0] ? event.touches[0] : event;
      return { x: source.clientX };
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
    markRoute("booting");
    ensureStyle();

    const mount = getMount();

    if (!mount) {
      markRoute("missing-mount");
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

      markRoute("active");

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
        new CustomEvent("dgb:audralia-existing-route-compositor-ready", {
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
            newFileRequired: false,
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
        compositorModel: CONTROL.compositorModel,
        rotationModel: CONTROL.rotationModel,
        phase: activeState ? activeState.phase : null,
        velocity: activeState ? activeState.velocity : null,
        newFileRequired: false,
        parentReopened: false,
        terrainRewrittenHere: false,
        visualPassClaimed: false
      });
    }
  });

  window.DGBAudraliaExistingRouteCompositor = window.DGBAudraliaRouteControl;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
