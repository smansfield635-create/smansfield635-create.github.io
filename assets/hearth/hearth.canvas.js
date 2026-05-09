// /assets/hearth/hearth.canvas.js
// HEARTH_G3_CANVAS_CHILD_ENGINE_COMPOSITION_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Compose parent terrain plus child engines.
// - Terrain remains parent.
// - Child engines refine terrain.
// - Canvas renders: terrain + mountains + cliffs + valleys + beaches + islands.
// - No GraphicBox. No image generation.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_CANVAS_CHILD_ENGINE_COMPOSITION_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const VERSION = "2026-05-09.hearth-g3-canvas-child-engine-composition";
  const RECEIPT = "HEARTH_G3_CANVAS_CHILD_ENGINE_COMPOSITION_RECEIPT";

  const EXPECTED_MOUNT_ID = "hearthCanvasMount";
  const DPR_LIMIT = 2;
  const BUFFER_MAX = 460;
  const BUFFER_MIN = 270;
  const FRAME_MIN_MS = 46;
  const TAU = Math.PI * 2;

  const state = {
    canvas: null,
    ctx: null,
    mount: null,
    raf: 0,
    running: false,
    lastFrame: 0,
    buffer: null,
    bufferCtx: null,
    imageData: null,
    width: 0,
    height: 0,
    dpr: 1,
    rotation: 0,
    lastStatus: "booting"
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);
  const mix = (a, b, t) => Math.round(lerp(a, b, t));

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / ((b - a) || 1e-9), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function norm3(v) {
    const m = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / m, v[1] / m, v[2] / m];
  }

  function rotateY(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
  }

  function rotateX(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
  }

  function rockNoise(v, seed) {
    return clamp(
      0.5 +
        Math.sin(v[0] * 31.0 + v[1] * 19.0 + v[2] * 23.0 + seed) * 0.18 +
        Math.cos(v[0] * 47.0 - v[1] * 29.0 + v[2] * 17.0 + seed * 0.73) * 0.13 +
        Math.sin(v[0] * 83.0 + v[1] * 61.0 - v[2] * 43.0 + seed * 1.37) * 0.08,
      0,
      1
    );
  }

  function ridgeNoise(v, seed) {
    return clamp(
      0.5 +
        Math.sin(v[0] * 67.0 + v[1] * 41.0 + seed) * 0.22 +
        Math.cos(v[2] * 73.0 - v[1] * 37.0 + seed * 0.42) * 0.16,
      0,
      1
    );
  }

  function n(value) {
    return Number.isFinite(Number(value)) ? Number(value) : 0;
  }

  function color(input, fallback) {
    if (Array.isArray(input) && input.length >= 3) {
      return [
        clamp(Math.round(input[0]), 0, 255),
        clamp(Math.round(input[1]), 0, 255),
        clamp(Math.round(input[2]), 0, 255)
      ];
    }
    return fallback.slice();
  }

  function applyMix(base, target, amount) {
    return [
      mix(base[0], target[0], amount),
      mix(base[1], target[1], amount),
      mix(base[2], target[2], amount)
    ];
  }

  function applyLight(base, amount) {
    return [
      clamp(Math.round(base[0] + 255 * amount), 0, 255),
      clamp(Math.round(base[1] + 255 * amount), 0, 255),
      clamp(Math.round(base[2] + 255 * amount), 0, 255)
    ];
  }

  function applyDark(base, amount) {
    return [
      clamp(Math.round(base[0] * (1 - amount)), 0, 255),
      clamp(Math.round(base[1] * (1 - amount)), 0, 255),
      clamp(Math.round(base[2] * (1 - amount)), 0, 255)
    ];
  }

  function sampleModule(name, v) {
    const mod = window[name];
    if (!mod || typeof mod.sampleVector !== "function") return null;
    try {
      return mod.sampleVector(v);
    } catch (error) {
      document.documentElement.dataset[`hearthCanvas${name}Error`] =
        error && error.message ? error.message : String(error);
      return null;
    }
  }

  function receiptModule(name) {
    const mod = window[name];
    if (!mod || typeof mod.receipt !== "function") return null;
    try {
      return mod.receipt();
    } catch (_) {
      return null;
    }
  }

  function sampleAll(v) {
    const terrain = sampleModule("HEARTH_TERRAIN", v);
    const mountains = sampleModule("HEARTH_MOUNTAINS", v);
    const cliffs = sampleModule("HEARTH_CLIFFS", v);
    const valleys = sampleModule("HEARTH_VALLEYS", v);
    const beaches = sampleModule("HEARTH_BEACHES", v);
    const islands = sampleModule("HEARTH_ISLANDS", v);

    return { terrain, mountains, cliffs, valleys, beaches, islands };
  }

  function shadeWater(v, sx, sy, samples, light) {
    const terrain = samples.terrain;
    const beach = samples.beaches && samples.beaches.active ? samples.beaches : null;

    const waterDepth = clamp(n(terrain && terrain.waterDepth != null ? terrain.waterDepth : 0.72), 0, 1);
    const shelf = clamp(n(terrain && terrain.shelf != null ? terrain.shelf : 0), 0, 1);
    const coast = clamp(n(terrain && terrain.coast != null ? terrain.coast : 0), 0, 1);

    let c = [9, 72, 132];

    c = applyMix(c, [4, 34, 86], waterDepth * 0.62);
    c = applyMix(c, [34, 170, 184], shelf * 0.66);
    c = applyMix(c, [68, 206, 205], coast * 0.30);

    if (beach) {
      c = applyMix(c, color(beach.beachColorBias, [210, 174, 112]), clamp(n(beach.sandStrength) * 0.18, 0, 0.24));
      c = applyLight(c, clamp(n(beach.shoreSoftness) * 0.05, 0, 0.10));
    }

    const wave =
      Math.sin(v[0] * 24 + v[2] * 17 + state.rotation * 2.1) * 0.018 +
      Math.cos(v[1] * 31 - v[0] * 13 + state.rotation * 1.4) * 0.016;

    c = wave > 0 ? applyLight(c, wave) : applyDark(c, -wave * 0.45);

    const rim = smoothstep(0.70, 1.0, Math.hypot(sx, sy));
    c = applyDark(c, rim * 0.28);
    c = applyLight(c, light * 0.05);

    return c;
  }

  function shadeLand(v, sx, sy, samples, light) {
    const terrain = samples.terrain || {};
    const mountain = samples.mountains && samples.mountains.active ? samples.mountains : null;
    const cliff = samples.cliffs && samples.cliffs.active ? samples.cliffs : null;
    const valley = samples.valleys && samples.valleys.active ? samples.valleys : null;
    const beach = samples.beaches && samples.beaches.active ? samples.beaches : null;

    const seed = n(terrain.globalLandformSeat || terrain.landformSeat || terrain.countryId || 1);
    const noise = rockNoise(v, seed);
    const ridgeTexture = ridgeNoise(v, seed * 1.7);

    let c = color(terrain.color, [138, 124, 82]);

    const hillStrength = clamp(n(terrain.hillStrength), 0, 1.4);
    const mountainStrength = clamp(n(terrain.mountainStrength), 0, 1.7);
    const cliffStrength = clamp(n(terrain.cliffStrength), 0, 1.8);
    const valleyStrength = clamp(n(terrain.valleyStrength), 0, 1.5);
    const rock = clamp(n(terrain.rockExposure), 0, 1.8);
    const rigid = clamp(n(terrain.rigidLandscapeStrength), 0, 1.8);
    const coast = clamp(n(terrain.coast), 0, 1.2);

    c = applyMix(c, [118, 124, 76], hillStrength * 0.18);
    c = applyMix(c, [216, 206, 170], mountainStrength * 0.18);
    c = applyMix(c, [52, 54, 52], cliffStrength * 0.32);
    c = applyMix(c, [70, 104, 72], valleyStrength * 0.24);
    c = applyMix(c, [68, 68, 64], rock * 0.28);
    c = applyMix(c, [52, 50, 48], rigid * 0.18);

    if (mountain) {
      c = applyMix(c, color(mountain.mountainColorBias, [226, 216, 184]), clamp(n(mountain.peakStrength) * 0.20, 0, 0.34));
      c = applyLight(c, clamp(n(mountain.mountainHighlight), 0, 0.58));
      c = applyDark(c, clamp(n(mountain.mountainShadow), 0, 0.42));
      c = applyMix(c, [236, 228, 200], clamp(n(mountain.summitPressure) * 0.12, 0, 0.22));
    }

    if (cliff) {
      c = applyMix(c, color(cliff.cliffColorBias, [48, 50, 48]), clamp(n(cliff.cliffFaceStrength) * 0.30, 0, 0.48));
      c = applyDark(c, clamp(n(cliff.cliffShadow), 0, 0.60));
      c = applyLight(c, clamp(n(cliff.cliffHighlight), 0, 0.25));
      c = applyDark(c, clamp(n(cliff.rigidBorderDetail) * 0.10, 0, 0.20));
    }

    if (valley) {
      c = applyMix(c, color(valley.valleyColorBias, [74, 104, 74]), clamp(n(valley.valleyDepth) * 0.24, 0, 0.40));
      c = applyDark(c, clamp(n(valley.valleyShadow), 0, 0.38));
      c = applyLight(c, clamp(n(valley.valleySoftLight), 0, 0.20));
    }

    if (beach) {
      c = applyMix(c, color(beach.beachColorBias, [210, 174, 112]), clamp(n(beach.sandStrength) * 0.36, 0, 0.48));
      c = applyLight(c, clamp(n(beach.shoreSoftness) * 0.10, 0, 0.18));
    }

    const fracture = (noise - 0.5) * (0.14 + rock * 0.30 + rigid * 0.22);
    const ridgeLight = Math.max(0, ridgeTexture - 0.54) * (0.14 + mountainStrength * 0.28);
    const lowShadow = Math.max(0, 0.55 - ridgeTexture) * (0.10 + cliffStrength * 0.20 + valleyStrength * 0.16);

    c = fracture > 0 ? applyLight(c, fracture) : applyDark(c, -fracture);
    c = applyLight(c, ridgeLight);
    c = applyDark(c, lowShadow);
    c = applyMix(c, [58, 200, 200], coast * 0.18);

    const rim = smoothstep(0.72, 1.0, Math.hypot(sx, sy));
    c = applyDark(c, rim * 0.22);
    c = applyLight(c, light * 0.08);

    return c;
  }

  function shadeIsland(v, sx, sy, samples, light) {
    const island = samples.islands;
    let c = color(island.color, [152, 132, 84]);

    const noise = rockNoise(v, n(island.islandSeatNumber || 1) * 2.1);
    const mountain = clamp(n(island.mountainStrength), 0, 1.4);
    const cliff = clamp(n(island.cliffStrength), 0, 1.4);
    const valley = clamp(n(island.valleyStrength), 0, 1.4);
    const hill = clamp(n(island.hillStrength), 0, 1.4);

    c = applyMix(c, [146, 136, 86], hill * 0.16);
    c = applyMix(c, [222, 214, 182], mountain * 0.16);
    c = applyMix(c, [58, 60, 56], cliff * 0.25);
    c = applyMix(c, [80, 110, 76], valley * 0.18);

    const texture = (noise - 0.5) * 0.18;
    c = texture > 0 ? applyLight(c, texture) : applyDark(c, -texture);

    c = applyMix(c, [62, 202, 202], clamp(n(island.coast) * 0.14, 0, 0.18));
    c = applyLight(c, light * 0.08);

    const rim = smoothstep(0.72, 1.0, Math.hypot(sx, sy));
    c = applyDark(c, rim * 0.18);

    return c;
  }

  function renderPlanet(bufferCtx, width, height, time) {
    const imageData = state.imageData || bufferCtx.createImageData(width, height);
    state.imageData = imageData;

    const data = imageData.data;
    const cx = width * 0.5;
    const cy = height * 0.5;
    const radius = Math.min(width, height) * 0.456;
    const invRadius = 1 / radius;

    state.rotation = time * 0.000055;

    const axialTilt = -0.22;
    const sun = norm3([-0.48, 0.28, 0.84]);
    const atmosphere = [36, 170, 210];

    let offset = 0;

    for (let y = 0; y < height; y += 1) {
      const sy = (y - cy) * invRadius;

      for (let x = 0; x < width; x += 1) {
        const sx = (x - cx) * invRadius;
        const r2 = sx * sx + sy * sy;

        if (r2 > 1) {
          data[offset] = 0;
          data[offset + 1] = 0;
          data[offset + 2] = 0;
          data[offset + 3] = 0;
          offset += 4;
          continue;
        }

        const z = Math.sqrt(1 - r2);
        let v = [sx, -sy, z];

        v = rotateX(v, axialTilt);
        v = rotateY(v, state.rotation);

        const normal = norm3([sx, -sy, z]);
        const light = clamp(normal[0] * sun[0] + normal[1] * sun[1] + normal[2] * sun[2], 0, 1);
        const limb = smoothstep(0.62, 1, Math.sqrt(r2));

        const samples = sampleAll(v);
        let c;

        if (samples.islands && samples.islands.active && samples.islands.land && n(samples.islands.islandStrength) > 0.18) {
          c = shadeIsland(v, sx, sy, samples, light);
        } else if (samples.terrain && samples.terrain.land) {
          c = shadeLand(v, sx, sy, samples, light);
        } else {
          c = shadeWater(v, sx, sy, samples, light);
        }

        const night = 1 - (0.38 + light * 0.62);
        c = applyDark(c, night * 0.24);
        c = applyMix(c, atmosphere, limb * 0.18);

        data[offset] = c[0];
        data[offset + 1] = c[1];
        data[offset + 2] = c[2];
        data[offset + 3] = 255;

        offset += 4;
      }
    }

    bufferCtx.putImageData(imageData, 0, 0);
  }

  function drawHalo(ctx, width, height) {
    const cx = width * 0.5;
    const cy = height * 0.5;
    const radius = Math.min(width, height) * 0.456;

    ctx.save();

    const glow = ctx.createRadialGradient(cx, cy, radius * 0.88, cx, cy, radius * 1.30);
    glow.addColorStop(0, "rgba(64, 194, 218, 0.15)");
    glow.addColorStop(0.55, "rgba(38, 142, 190, 0.09)");
    glow.addColorStop(1, "rgba(4, 12, 24, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.30, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = "rgba(116, 202, 228, 0.17)";
    ctx.lineWidth = Math.max(1, width * 0.003);
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.005, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }

  function drawFrame(time) {
    if (!state.running || !state.canvas || !state.ctx || !state.buffer || !state.bufferCtx) return;

    if (time - state.lastFrame < FRAME_MIN_MS) {
      state.raf = requestAnimationFrame(drawFrame);
      return;
    }

    state.lastFrame = time;

    const ctx = state.ctx;
    const canvas = state.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bg = ctx.createRadialGradient(
      canvas.width * 0.50,
      canvas.height * 0.48,
      canvas.width * 0.08,
      canvas.width * 0.50,
      canvas.height * 0.50,
      canvas.width * 0.64
    );

    bg.addColorStop(0, "rgba(15, 39, 58, 0.94)");
    bg.addColorStop(0.62, "rgba(4, 13, 26, 0.96)");
    bg.addColorStop(1, "rgba(1, 5, 12, 1)");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawHalo(ctx, canvas.width, canvas.height);
    renderPlanet(state.bufferCtx, state.width, state.height, time);

    const targetSize = Math.min(canvas.width, canvas.height);
    const targetX = (canvas.width - targetSize) * 0.5;
    const targetY = (canvas.height - targetSize) * 0.5;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(state.buffer, targetX, targetY, targetSize, targetSize);
    ctx.restore();

    stamp("rendering");
    state.raf = requestAnimationFrame(drawFrame);
  }

  function getMount() {
    let mount = document.getElementById(EXPECTED_MOUNT_ID);

    if (!mount) {
      const parent = document.querySelector("main") || document.body;
      mount = document.createElement("section");
      mount.id = EXPECTED_MOUNT_ID;
      mount.dataset.hearthMount = "true";
      mount.dataset.hearthCanvasMountCreatedBy = CONTRACT;
      parent.appendChild(mount);
    }

    return mount;
  }

  function installStyle() {
    const prior = document.getElementById("hearth-canvas-child-engine-composition-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-canvas-child-engine-composition-style";
    style.textContent = `
      #${EXPECTED_MOUNT_ID} {
        position: relative;
        width: 100%;
        min-height: 300px;
        aspect-ratio: 1 / 1;
        overflow: hidden;
        isolation: isolate;
        touch-action: pan-y !important;
        border-radius: 28px;
      }

      #${EXPECTED_MOUNT_ID} canvas[data-hearth-canvas="child-engine-composition"] {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        touch-action: pan-y !important;
      }
    `;

    document.head.appendChild(style);
  }

  function resize() {
    if (!state.canvas || !state.mount) return;

    const rect = state.mount.getBoundingClientRect();
    const cssSize = Math.max(260, Math.min(rect.width || 360, rect.height || rect.width || 360));
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);

    state.dpr = dpr;
    state.canvas.width = Math.round(cssSize * dpr);
    state.canvas.height = Math.round(cssSize * dpr);
    state.canvas.style.width = `${cssSize}px`;
    state.canvas.style.height = `${cssSize}px`;

    const bufferSize = clamp(Math.round(cssSize * Math.min(dpr, 1.35)), BUFFER_MIN, BUFFER_MAX);

    state.width = bufferSize;
    state.height = bufferSize;
    state.buffer = document.createElement("canvas");
    state.buffer.width = bufferSize;
    state.buffer.height = bufferSize;
    state.bufferCtx = state.buffer.getContext("2d", { alpha: true, willReadFrequently: false });
    state.imageData = null;

    document.documentElement.dataset.hearthCanvasBufferSize = String(bufferSize);
    document.documentElement.dataset.hearthCanvasDevicePixelRatio = String(dpr);
  }

  function installCanvas() {
    state.mount = getMount();

    state.mount.querySelectorAll("canvas[data-hearth-canvas]").forEach((node) => node.remove());

    const canvas = document.createElement("canvas");
    canvas.dataset.hearthCanvas = "child-engine-composition";
    canvas.dataset.contract = CONTRACT;
    canvas.dataset.familyContract = FAMILY_CONTRACT;
    canvas.dataset.receipt = RECEIPT;
    canvas.setAttribute("aria-label", "Hearth G3 256 lattice child-engine composition canvas");

    state.mount.appendChild(canvas);

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });

    state.mount.dataset.hearthCanvasContract = CONTRACT;
    state.mount.dataset.hearthCanvasReceipt = RECEIPT;
    state.mount.dataset.hearthCanvasConsumesTerrain = "true";
    state.mount.dataset.hearthCanvasConsumesMountains = "true";
    state.mount.dataset.hearthCanvasConsumesCliffs = "true";
    state.mount.dataset.hearthCanvasConsumesValleys = "true";
    state.mount.dataset.hearthCanvasConsumesBeaches = "true";
    state.mount.dataset.hearthCanvasConsumesIslands = "true";
    state.mount.dataset.hearthCanvasGeneratedImage = "false";
    state.mount.dataset.hearthCanvasGraphicBox = "false";

    resize();
  }

  function stamp(status) {
    state.lastStatus = status;

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasFamilyContract = FAMILY_CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
    document.documentElement.dataset.hearthCanvasStatus = status;
    document.documentElement.dataset.hearthCanvasConsumes =
      "terrain,mountains,cliffs,valleys,beaches,islands";
    document.documentElement.dataset.hearthCanvasGeneratedImage = "false";
    document.documentElement.dataset.hearthCanvasGraphicBox = "false";
    document.documentElement.dataset.hearthCanvasTerrainReady = String(!!window.HEARTH_TERRAIN);
    document.documentElement.dataset.hearthCanvasMountainsReady = String(!!window.HEARTH_MOUNTAINS);
    document.documentElement.dataset.hearthCanvasCliffsReady = String(!!window.HEARTH_CLIFFS);
    document.documentElement.dataset.hearthCanvasValleysReady = String(!!window.HEARTH_VALLEYS);
    document.documentElement.dataset.hearthCanvasBeachesReady = String(!!window.HEARTH_BEACHES);
    document.documentElement.dataset.hearthCanvasIslandsReady = String(!!window.HEARTH_ISLANDS);
  }

  function exposeReceipt() {
    window.HEARTH_CANVAS_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      authority: "canvas-child-engine-composition",
      consumes: [
        "HEARTH_TERRAIN",
        "HEARTH_MOUNTAINS",
        "HEARTH_CLIFFS",
        "HEARTH_VALLEYS",
        "HEARTH_BEACHES",
        "HEARTH_ISLANDS"
      ],
      doesNotOwn: [
        "terrain authority",
        "mountain authority",
        "cliff authority",
        "valley authority",
        "beach authority",
        "island authority",
        "active weather",
        "clouds",
        "humidity",
        "generated images",
        "graphic blocks"
      ],
      status: () => ({
        running: state.running,
        width: state.width,
        height: state.height,
        lastStatus: state.lastStatus,
        terrain: receiptModule("HEARTH_TERRAIN"),
        mountains: receiptModule("HEARTH_MOUNTAINS"),
        cliffs: receiptModule("HEARTH_CLIFFS"),
        valleys: receiptModule("HEARTH_VALLEYS"),
        beaches: receiptModule("HEARTH_BEACHES"),
        islands: receiptModule("HEARTH_ISLANDS")
      })
    });
  }

  function boot() {
    dispose();

    installStyle();
    installCanvas();
    exposeReceipt();
    stamp("booted");

    state.running = true;
    state.lastFrame = 0;
    state.raf = requestAnimationFrame(drawFrame);

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });
  }

  function handleResize() {
    clearTimeout(handleResize._timer);
    handleResize._timer = setTimeout(() => {
      resize();
      stamp("resized");
    }, 120);
  }

  function dispose() {
    state.running = false;

    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }

    window.removeEventListener("resize", handleResize);
    window.removeEventListener("orientationchange", handleResize);

    const priorStyle = document.getElementById("hearth-canvas-child-engine-composition-style");
    if (priorStyle) priorStyle.remove();

    const mount = document.getElementById(EXPECTED_MOUNT_ID);
    if (mount) {
      mount.querySelectorAll('canvas[data-hearth-canvas="child-engine-composition"]').forEach((node) => node.remove());
    }

    state.canvas = null;
    state.ctx = null;
    state.buffer = null;
    state.bufferCtx = null;
    state.imageData = null;

    document.documentElement.dataset.hearthCanvasDisposed = "true";
  }

  window.__HEARTH_CANVAS_CHILD_ENGINE_COMPOSITION_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_LANDFORM_CONSUMPTION_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_BOUNDARY_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_FAMILY_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_ZONING_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_PLANET_BODY_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_VISIBLE_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_DISPOSE__ = dispose;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
