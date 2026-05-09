// /assets/hearth/hearth.canvas.js
// HEARTH_G3_CANVAS_LANDFORM_CONSUMPTION_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1
// Purpose:
// - Canvas consumes terrain authority instead of smoothing it away.
// - Render hill, mountain, cliff, and valley fields from /assets/hearth/hearth.terrain.js.
// - Treat terrain sample fields as visual authority:
//   hillStrength, mountainStrength, cliffStrength, valleyStrength,
//   rockExposure, rigidLandscapeStrength, dominantLandform, landformCategory,
//   globalLandformSeat.
// - Keep hydration passive.
// - Do not generate images.
// - Do not create graphic blocks.
// - Do not own terrain.
// - Do not own islands.
// - Do not own beaches/sand.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_CANVAS_LANDFORM_CONSUMPTION_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1";
  const VERSION = "2026-05-09.hearth-g3-canvas-landform-consumption";
  const RECEIPT = "HEARTH_G3_CANVAS_LANDFORM_CONSUMPTION_RECEIPT";

  const EXPECTED_TERRAIN_CONTRACT = "HEARTH_G3_256_LANDFORM_CATEGORY_TERRAIN_TNT_v1";
  const EXPECTED_MOUNT_ID = "hearthCanvasMount";

  const DPR_LIMIT = 2;
  const BUFFER_MAX = 430;
  const BUFFER_MIN = 260;
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
    generation: 0,
    terrainReady: false,
    islandsReady: false,
    lastReceiptStatus: "booting"
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
    return [
      v[0] * c + v[2] * s,
      v[1],
      -v[0] * s + v[2] * c
    ];
  }

  function rotateX(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
      v[0],
      v[1] * c - v[2] * s,
      v[1] * s + v[2] * c
    ];
  }

  function hash3(x, y, z) {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
    return n - Math.floor(n);
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

  function toColor(input, fallback) {
    if (Array.isArray(input) && input.length >= 3) {
      return [
        clamp(Math.round(input[0]), 0, 255),
        clamp(Math.round(input[1]), 0, 255),
        clamp(Math.round(input[2]), 0, 255)
      ];
    }

    return fallback.slice();
  }

  function applyMix(color, target, amount) {
    return [
      mix(color[0], target[0], amount),
      mix(color[1], target[1], amount),
      mix(color[2], target[2], amount)
    ];
  }

  function applyLight(color, amount) {
    return [
      clamp(Math.round(color[0] + 255 * amount), 0, 255),
      clamp(Math.round(color[1] + 255 * amount), 0, 255),
      clamp(Math.round(color[2] + 255 * amount), 0, 255)
    ];
  }

  function applyDark(color, amount) {
    return [
      clamp(Math.round(color[0] * (1 - amount)), 0, 255),
      clamp(Math.round(color[1] * (1 - amount)), 0, 255),
      clamp(Math.round(color[2] * (1 - amount)), 0, 255)
    ];
  }

  function sampleTerrain(v) {
    const terrain = window.HEARTH_TERRAIN;
    if (!terrain || typeof terrain.sampleVector !== "function") {
      return null;
    }

    try {
      return terrain.sampleVector(v);
    } catch (error) {
      document.documentElement.dataset.hearthCanvasTerrainSampleError = String(error && error.message ? error.message : error);
      return null;
    }
  }

  function sampleIslands(v) {
    const islands = window.HEARTH_ISLANDS;
    if (!islands || typeof islands.sampleVector !== "function") {
      return null;
    }

    try {
      const sample = islands.sampleVector(v);
      return sample && sample.active ? sample : null;
    } catch (error) {
      document.documentElement.dataset.hearthCanvasIslandSampleError = String(error && error.message ? error.message : error);
      return null;
    }
  }

  function terrainReceipt() {
    const terrain = window.HEARTH_TERRAIN;
    if (!terrain || typeof terrain.receipt !== "function") return null;

    try {
      return terrain.receipt();
    } catch (_) {
      return null;
    }
  }

  function islandsReceipt() {
    const islands = window.HEARTH_ISLANDS;
    if (!islands || typeof islands.receipt !== "function") return null;

    try {
      return islands.receipt();
    } catch (_) {
      return null;
    }
  }

  function dominantCategory(sample) {
    return String(sample.dominantLandform || sample.landformCategory || "").toLowerCase();
  }

  function categoryBoost(sample) {
    const category = dominantCategory(sample);
    const hill = clamp(Number(sample.hillStrength || 0), 0, 1.4);
    const mountain = clamp(Number(sample.mountainStrength || 0), 0, 1.6);
    const cliff = clamp(Number(sample.cliffStrength || 0), 0, 1.6);
    const valley = clamp(Number(sample.valleyStrength || 0), 0, 1.4);

    return { category, hill, mountain, cliff, valley };
  }

  function shadeWater(v, sx, sy, sample, light) {
    const waterDepth = clamp(Number(sample && sample.waterDepth != null ? sample.waterDepth : 0.72), 0, 1);
    const shelf = clamp(Number(sample && sample.shelf != null ? sample.shelf : 0), 0, 1);
    const coast = clamp(Number(sample && sample.coast != null ? sample.coast : 0), 0, 1);

    let color = [10, 74, 134];

    color = applyMix(color, [4, 36, 88], waterDepth * 0.62);
    color = applyMix(color, [34, 173, 183], shelf * 0.72);
    color = applyMix(color, [66, 205, 206], coast * 0.34);

    const wave =
      Math.sin(v[0] * 28 + v[2] * 18 + state.rotation * 2.2) * 0.020 +
      Math.cos(v[1] * 34 - v[0] * 14 + state.rotation * 1.4) * 0.018;

    color = applyLight(color, Math.max(0, wave));
    color = applyDark(color, Math.max(0, -wave) * 0.45);

    const rim = smoothstep(0.70, 1.0, Math.hypot(sx, sy));
    color = applyDark(color, rim * 0.28);
    color = applyLight(color, light * 0.05);

    return color;
  }

  function shadeLand(v, sx, sy, sample, light) {
    const category = categoryBoost(sample);
    const seed = Number(sample.globalLandformSeat || sample.landformSeat || sample.countryId || 1);
    const noise = rockNoise(v, seed);
    const ridge = ridgeNoise(v, seed * 1.7);

    const relief = clamp(Number(sample.relief || 0), 0, 1.8);
    const ridgeStrength = clamp(Number(sample.ridge || 0), 0, 1.8);
    const upland = clamp(Number(sample.upland || 0), 0, 1.4);
    const lowland = clamp(Number(sample.lowland || 0), 0, 1.2);
    const rock = clamp(Number(sample.rockExposure || 0), 0, 1.8);
    const rigid = clamp(Number(sample.rigidLandscapeStrength || 0), 0, 1.8);
    const summit = clamp(Number(sample.summitStrength || 0), 0, 1.6);
    const mountain = clamp(Number(sample.mountainStrength || category.mountain || 0), 0, 1.7);
    const cliff = clamp(Number(sample.cliffStrength || category.cliff || 0), 0, 1.7);
    const valley = clamp(Number(sample.valleyStrength || category.valley || 0), 0, 1.4);
    const hill = clamp(Number(sample.hillStrength || category.hill || 0), 0, 1.3);

    let color = toColor(sample.color, [142, 124, 78]);

    color = applyMix(color, [116, 124, 76], hill * 0.22);
    color = applyMix(color, [216, 204, 166], mountain * 0.22);
    color = applyMix(color, [58, 60, 58], cliff * 0.40);
    color = applyMix(color, [76, 104, 72], valley * 0.30);

    color = applyMix(color, [76, 74, 68], rock * 0.36);
    color = applyMix(color, [54, 52, 48], rigid * 0.22);

    const fracture = (noise - 0.5) * (0.18 + rock * 0.36 + rigid * 0.24);
    const ridgeHighlight = Math.max(0, ridge - 0.54) * (ridgeStrength * 0.48 + mountain * 0.24);
    const cliffShadow = Math.max(0, 0.56 - ridge) * (cliff * 0.36 + rigid * 0.18);
    const valleyShadow = valley * (0.16 + lowland * 0.18);

    if (fracture > 0) {
      color = applyLight(color, fracture);
    } else {
      color = applyDark(color, -fracture);
    }

    color = applyLight(color, ridgeHighlight);
    color = applyDark(color, cliffShadow);
    color = applyDark(color, valleyShadow);

    color = applyLight(color, summit * 0.32);
    color = applyLight(color, upland * 0.04);
    color = applyDark(color, lowland * 0.08);

    const categoryName = category.category;

    if (categoryName === "hill") {
      color = applyMix(color, [150, 138, 86], 0.12 + hill * 0.12);
    } else if (categoryName === "mountain") {
      color = applyMix(color, [230, 222, 190], 0.10 + mountain * 0.15);
      color = applyDark(color, rigid * 0.08);
    } else if (categoryName === "cliff") {
      color = applyMix(color, [50, 52, 50], 0.14 + cliff * 0.22);
      color = applyLight(color, ridgeHighlight * 0.35);
    } else if (categoryName === "valley") {
      color = applyMix(color, [70, 100, 72], 0.12 + valley * 0.18);
      color = applyDark(color, valley * 0.10);
    }

    const coast = clamp(Number(sample.coast || 0), 0, 1);
    color = applyMix(color, [60, 196, 196], coast * 0.20);

    const rim = smoothstep(0.72, 1.0, Math.hypot(sx, sy));
    color = applyDark(color, rim * 0.22);
    color = applyLight(color, light * 0.08);

    return color;
  }

  function shadeIsland(v, sx, sy, sample, light) {
    const category = categoryBoost(sample);
    const seed = Number(sample.islandSeatNumber || sample.islandIndex || 1);
    const noise = rockNoise(v, seed * 2.3);
    const relief = clamp(Number(sample.relief || 0), 0, 1.2);
    const ridge = clamp(Number(sample.ridge || 0), 0, 1.2);

    let color = toColor(sample.color, [154, 132, 82]);

    color = applyMix(color, [212, 198, 150], category.mountain * 0.18);
    color = applyMix(color, [58, 60, 56], category.cliff * 0.28);
    color = applyMix(color, [80, 112, 76], category.valley * 0.20);
    color = applyMix(color, [142, 132, 84], category.hill * 0.16);

    const texture = (noise - 0.5) * (0.12 + relief * 0.20);
    color = texture > 0 ? applyLight(color, texture) : applyDark(color, -texture);
    color = applyLight(color, ridge * 0.08);
    color = applyLight(color, light * 0.08);

    const coast = clamp(Number(sample.coast || 0), 0, 1);
    color = applyMix(color, [64, 202, 202], coast * 0.16);

    const rim = smoothstep(0.72, 1.0, Math.hypot(sx, sy));
    color = applyDark(color, rim * 0.18);

    return color;
  }

  function chooseVisibleSample(v) {
    const terrain = sampleTerrain(v);
    const island = sampleIslands(v);

    if (island && island.land && island.islandStrength > 0.20) {
      return {
        sample: island,
        type: "island"
      };
    }

    if (terrain) {
      return {
        sample: terrain,
        type: terrain.land ? "land" : "water"
      };
    }

    return {
      sample: null,
      type: "fallback-water"
    };
  }

  function renderPlanet(bufferCtx, width, height, time) {
    const imageData = state.imageData || bufferCtx.createImageData(width, height);
    state.imageData = imageData;

    const data = imageData.data;
    const cx = width * 0.5;
    const cy = height * 0.5;
    const radius = Math.min(width, height) * 0.455;
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

        const visibleNormal = norm3([sx, -sy, z]);
        const light = clamp(visibleNormal[0] * sun[0] + visibleNormal[1] * sun[1] + visibleNormal[2] * sun[2], 0, 1);
        const limb = smoothstep(0.62, 1, Math.sqrt(r2));

        const visible = chooseVisibleSample(v);
        let color;

        if (visible.type === "land") {
          color = shadeLand(v, sx, sy, visible.sample, light);
        } else if (visible.type === "island") {
          color = shadeIsland(v, sx, sy, visible.sample, light);
        } else {
          color = shadeWater(v, sx, sy, visible.sample, light);
        }

        const night = 1 - (0.38 + light * 0.62);
        color = applyDark(color, night * 0.24);
        color = applyMix(color, atmosphere, limb * 0.18);

        data[offset] = color[0];
        data[offset + 1] = color[1];
        data[offset + 2] = color[2];
        data[offset + 3] = 255;

        offset += 4;
      }
    }

    bufferCtx.putImageData(imageData, 0, 0);
  }

  function drawHalo(ctx, width, height) {
    const cx = width * 0.5;
    const cy = height * 0.5;
    const radius = Math.min(width, height) * 0.455;

    ctx.save();

    const glow = ctx.createRadialGradient(cx, cy, radius * 0.88, cx, cy, radius * 1.28);
    glow.addColorStop(0, "rgba(64, 194, 218, 0.16)");
    glow.addColorStop(0.55, "rgba(38, 142, 190, 0.10)");
    glow.addColorStop(1, "rgba(4, 12, 24, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.28, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = "rgba(116, 202, 228, 0.18)";
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
    const width = state.width;
    const height = state.height;

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

    renderPlanet(state.bufferCtx, width, height, time);

    const targetSize = Math.min(canvas.width, canvas.height);
    const targetX = (canvas.width - targetSize) * 0.5;
    const targetY = (canvas.height - targetSize) * 0.5;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(state.buffer, targetX, targetY, targetSize, targetSize);
    ctx.restore();

    stampRuntime("rendering");

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
    const prior = document.getElementById("hearth-canvas-landform-consumption-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-canvas-landform-consumption-style";
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

      #${EXPECTED_MOUNT_ID} canvas[data-hearth-canvas="landform-consumption"] {
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

    state.generation += 1;

    document.documentElement.dataset.hearthCanvasBufferSize = String(bufferSize);
    document.documentElement.dataset.hearthCanvasDevicePixelRatio = String(dpr);
  }

  function installCanvas() {
    state.mount = getMount();

    const existing = state.mount.querySelectorAll("canvas[data-hearth-canvas]");
    existing.forEach((node) => node.remove());

    const canvas = document.createElement("canvas");
    canvas.dataset.hearthCanvas = "landform-consumption";
    canvas.dataset.contract = CONTRACT;
    canvas.dataset.familyContract = FAMILY_CONTRACT;
    canvas.dataset.receipt = RECEIPT;
    canvas.setAttribute("aria-label", "Hearth G3 terrain landform rendering canvas");

    state.mount.appendChild(canvas);

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });

    state.mount.dataset.hearthCanvasContract = CONTRACT;
    state.mount.dataset.hearthCanvasReceipt = RECEIPT;
    state.mount.dataset.hearthCanvasConsumesTerrain = "true";
    state.mount.dataset.hearthCanvasConsumesLandforms = "true";
    state.mount.dataset.hearthCanvasConsumesIslands = "optional-if-loaded";
    state.mount.dataset.hearthCanvasGeneratedImage = "false";
    state.mount.dataset.hearthCanvasGraphicBox = "false";

    resize();
  }

  function stampRuntime(status) {
    const terrain = terrainReceipt();
    const islands = islandsReceipt();

    state.terrainReady = !!terrain;
    state.islandsReady = !!islands;
    state.lastReceiptStatus = status;

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasFamilyContract = FAMILY_CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
    document.documentElement.dataset.hearthCanvasStatus = status;
    document.documentElement.dataset.hearthCanvasTerrainReady = String(!!terrain);
    document.documentElement.dataset.hearthCanvasIslandsReady = String(!!islands);
    document.documentElement.dataset.hearthCanvasConsumesLandforms = "true";
    document.documentElement.dataset.hearthCanvasConsumesLandformFields =
      "hillStrength,mountainStrength,cliffStrength,valleyStrength,rockExposure,rigidLandscapeStrength,dominantLandform,landformCategory,globalLandformSeat";
    document.documentElement.dataset.hearthCanvasGeneratedImage = "false";
    document.documentElement.dataset.hearthCanvasGraphicBox = "false";

    if (terrain) {
      document.documentElement.dataset.hearthCanvasTerrainContract = String(terrain.contract || "unknown");
      document.documentElement.dataset.hearthCanvasExpectedTerrainContract = EXPECTED_TERRAIN_CONTRACT;
      document.documentElement.dataset.hearthCanvasTerrainStandard = String(terrain.standard || "unknown");
    }

    if (islands) {
      document.documentElement.dataset.hearthCanvasIslandsContract = String(islands.contract || "unknown");
      document.documentElement.dataset.hearthCanvasIslandsStandard = String(islands.standard || "unknown");
    }
  }

  function exposeReceipt() {
    window.HEARTH_CANVAS_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      authority: "canvas-landform-consumption",
      expectedTerrainContract: EXPECTED_TERRAIN_CONTRACT,
      consumes: [
        "hillStrength",
        "mountainStrength",
        "cliffStrength",
        "valleyStrength",
        "rockExposure",
        "rigidLandscapeStrength",
        "dominantLandform",
        "landformCategory",
        "globalLandformSeat"
      ],
      optionalConsumes: [
        "HEARTH_ISLANDS.sampleVector"
      ],
      doesNotOwn: [
        "terrain authority",
        "island authority",
        "hydration expansion",
        "beaches",
        "sand",
        "weather",
        "climate",
        "clouds",
        "humidity",
        "generated images",
        "graphic blocks"
      ],
      status: () => ({
        running: state.running,
        terrainReady: state.terrainReady,
        islandsReady: state.islandsReady,
        width: state.width,
        height: state.height,
        lastReceiptStatus: state.lastReceiptStatus,
        terrainReceipt: terrainReceipt(),
        islandsReceipt: islandsReceipt()
      })
    });
  }

  function boot() {
    dispose();

    installStyle();
    installCanvas();
    exposeReceipt();
    stampRuntime("booted");

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
      stampRuntime("resized");
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

    const priorStyle = document.getElementById("hearth-canvas-landform-consumption-style");
    if (priorStyle) priorStyle.remove();

    const mount = document.getElementById(EXPECTED_MOUNT_ID);
    if (mount) {
      mount.querySelectorAll('canvas[data-hearth-canvas="landform-consumption"]').forEach((node) => node.remove());
    }

    state.canvas = null;
    state.ctx = null;
    state.buffer = null;
    state.bufferCtx = null;
    state.imageData = null;

    document.documentElement.dataset.hearthCanvasDisposed = "true";
  }

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
