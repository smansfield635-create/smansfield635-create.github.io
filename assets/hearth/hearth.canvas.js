// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_CARRIER_FIRST_EMERGENCY_RECOVERY_TNT_v1
// Full-file replacement.
// Canvas visible-carrier authority only.
// Purpose:
// - Restore the Hearth loading screen and functional draggable planet immediately.
// - Own the visible carrier/drawing layer, not source truth.
// - Consume Runtime Table plan when present, but never require it for first render.
// - Consume Hearth source/material authorities when present, but never require them for first render.
// - Keep receipt/status lifecycle independent from canvas lifecycle.
// Does not own:
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology truth
// - material palette truth
// - route shell
// - route orchestration
// - runtime motion outside this visible carrier
// - controls authority beyond local canvas drag fallback
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_CARRIER_FIRST_EMERGENCY_RECOVERY_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_CARRIER_FIRST_EMERGENCY_RECOVERY_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_SOURCE_ALIGNED_VISIBLE_GLOBE_ROUTE_TNT_v17";
  const VERSION = "2026-05-29.hearth-canvas-carrier-first-emergency-recovery-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const documentRef = root.document || null;
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const MOUNT_ID = "hearthCanvasMount";
  const STATUS_ID = "hearth-route-status";

  const state = {
    booted: false,
    mounted: false,
    disposed: false,
    mount: null,
    canvas: null,
    ctx: null,
    overlay: null,
    texture: null,
    textureMode: "none",
    textureReady: false,
    sourceTextureAttempted: false,
    sourceTextureReady: false,
    fallbackTextureReady: false,
    firstFramePainted: false,
    frameCount: 0,
    dragInspectionBound: false,
    dragging: false,
    yaw: -0.28,
    tilt: -0.18,
    yawVelocity: 0.0018,
    tiltVelocity: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    runtimeTablePresent: false,
    runtimeTableMode: "UNTOUCHED",
    runtimePlan: null,
    wideProbeDeferred: true,
    sourceAuthorities: {},
    error: "",
    lastStatus: "UNBOOTED",
    rafId: 0,
    resizeObserver: null,
    startedAt: ""
  };

  const COLOR = Object.freeze({
    abyss: [2, 10, 24],
    deep: [4, 23, 52],
    ocean: [8, 52, 88],
    shelf: [22, 104, 118],
    foam: [116, 166, 142],
    beach: [187, 164, 102],
    oldStone: [74, 72, 58],
    wetStone: [43, 56, 54],
    forest: [37, 93, 58],
    wetForest: [28, 78, 54],
    plains: [118, 132, 74],
    savanna: [148, 132, 72],
    desert: [166, 132, 78],
    steppe: [120, 110, 76],
    mountain: [94, 93, 84],
    cliff: [45, 50, 52],
    highland: [108, 108, 86],
    tundra: [126, 134, 118],
    snow: [214, 226, 226],
    ice: [184, 210, 218],
    loadingCore: [8, 31, 50],
    loadingRim: [4, 12, 24]
  });

  const BODY_MASSES = Object.freeze([
    { key: "north-crown", lat: 78 * DEG, lon: -20 * DEG, rx: 42 * DEG, ry: 13 * DEG, angle: -10 * DEG, seed: 11 },
    { key: "equatorial-great", lat: 1 * DEG, lon: -8 * DEG, rx: 64 * DEG, ry: 28 * DEG, angle: -8 * DEG, seed: 22 },
    { key: "northwest-temperate", lat: 44 * DEG, lon: -104 * DEG, rx: 32 * DEG, ry: 17 * DEG, angle: 28 * DEG, seed: 33 },
    { key: "northeast-broken-shelf", lat: 34 * DEG, lon: 104 * DEG, rx: 34 * DEG, ry: 16 * DEG, angle: -24 * DEG, seed: 44 },
    { key: "southeast-warm", lat: -24 * DEG, lon: 142 * DEG, rx: 38 * DEG, ry: 20 * DEG, angle: 18 * DEG, seed: 55 },
    { key: "southwest-ridge", lat: -38 * DEG, lon: -122 * DEG, rx: 36 * DEG, ry: 18 * DEG, angle: -30 * DEG, seed: 66 },
    { key: "south-transitional", lat: -59 * DEG, lon: 36 * DEG, rx: 40 * DEG, ry: 14 * DEG, angle: 9 * DEG, seed: 77 }
  ]);

  const ISLANDS = Object.freeze([
    { lat: 69 * DEG, lon: -76 * DEG, rx: 6 * DEG, ry: 2.4 * DEG, angle: -20 * DEG, seed: 101 },
    { lat: 72 * DEG, lon: 44 * DEG, rx: 5 * DEG, ry: 2 * DEG, angle: 18 * DEG, seed: 102 },
    { lat: 21 * DEG, lon: 66 * DEG, rx: 5.5 * DEG, ry: 2.3 * DEG, angle: -26 * DEG, seed: 103 },
    { lat: -19 * DEG, lon: 57 * DEG, rx: 6.4 * DEG, ry: 2.5 * DEG, angle: 20 * DEG, seed: 104 },
    { lat: 44 * DEG, lon: 123 * DEG, rx: 7.4 * DEG, ry: 2.8 * DEG, angle: -18 * DEG, seed: 105 },
    { lat: 34 * DEG, lon: 139 * DEG, rx: 5.7 * DEG, ry: 2.1 * DEG, angle: 31 * DEG, seed: 106 },
    { lat: -9 * DEG, lon: 170 * DEG, rx: 6.6 * DEG, ry: 2.6 * DEG, angle: 34 * DEG, seed: 107 },
    { lat: -55 * DEG, lon: -84 * DEG, rx: 5.6 * DEG, ry: 2 * DEG, angle: 11 * DEG, seed: 108 },
    { lat: -70 * DEG, lon: 76 * DEG, rx: 6.2 * DEG, ry: 2.2 * DEG, angle: -20 * DEG, seed: 109 }
  ]);

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return ""; }
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function mix(a, b, t) {
    const k = clamp01(t);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k))
    ];
  }

  function lift(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
    ];
  }

  function scale(color, amount) {
    const k = Number.isFinite(Number(amount)) ? Number(amount) : 1;
    return [
      clamp(Math.round(color[0] * k), 0, 255),
      clamp(Math.round(color[1] * k), 0, 255),
      clamp(Math.round(color[2] * k), 0, 255)
    ];
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
  }

  function wrapPi(value) {
    return Math.atan2(Math.sin(value), Math.cos(value));
  }

  function hash(x, y, seed) {
    let h = Math.imul((x | 0) ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul((y | 0) ^ (seed | 0) ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function noise(u, v, scaleValue, seed) {
    const s = Math.max(1, Math.floor(scaleValue));
    const x = wrap01(u) * s;
    const y = clamp01(v) * s;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const xf = x - x0;
    const yf = y - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);
    const ax0 = ((x0 % s) + s) % s;
    const ax1 = ((x1 % s) + s) % s;

    return lerp(
      lerp(hash(ax0, y0, seed), hash(ax1, y0, seed), sx),
      lerp(hash(ax0, y1, seed), hash(ax1, y1, seed), sx),
      sy
    );
  }

  function ridged(u, v, seed) {
    let total = 0;
    let norm = 0;
    let amp = 0.6;
    let scaleValue = 8;

    for (let i = 0; i < 5; i += 1) {
      const n = noise(u, v, scaleValue, seed + i * 97);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.53;
      scaleValue *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ellipseField(lon, lat, mass) {
    const dx = wrapPi(lon - mass.lon) * Math.cos(mass.lat);
    const dy = lat - mass.lat;
    const ca = Math.cos(mass.angle);
    const sa = Math.sin(mass.angle);
    const x = dx * ca - dy * sa;
    const y = dx * sa + dy * ca;
    const nx = x / mass.rx;
    const ny = y / mass.ry;
    const theta = Math.atan2(ny, nx);
    const dist = Math.sqrt(nx * nx + ny * ny);
    return { theta, dist, nx, ny };
  }

  function fallbackLandField(u, v) {
    const lon = (wrap01(u) - 0.5) * TAU;
    const lat = (0.5 - clamp01(v)) * Math.PI;
    let best = { field: -10, mass: BODY_MASSES[0], theta: 0, island: false };

    BODY_MASSES.forEach((mass) => {
      const e = ellipseField(lon, lat, mass);
      const chip =
        Math.sign(Math.sin(e.theta * (7 + mass.seed % 5) + e.nx * 4.7 - e.ny * 3.8)) * 0.06 +
        Math.sin(e.theta * (11 + mass.seed % 3) - mass.seed * 0.11) * 0.04;
      const fracture = (ridged(u + mass.seed * 0.011, v - mass.seed * 0.009, 19000 + mass.seed) - 0.5) * 0.18;
      const bayCut = smoothstep(0.52, 0.94, noise(u - mass.seed * 0.013, v + mass.seed * 0.017, 96, 20000 + mass.seed)) * 0.11;
      const field = 1 - e.dist + chip + fracture - bayCut;

      if (field > best.field) {
        best = { field, mass, theta: e.theta, island: false };
      }
    });

    ISLANDS.forEach((island) => {
      const e = ellipseField(lon, lat, island);
      const chip = Math.sin(e.theta * 6 + island.seed * 0.13) * 0.13 + Math.sin(e.theta * 10) * 0.06;
      const field = 0.35 + chip - e.dist;

      if (field > best.field) {
        best = { field, mass: BODY_MASSES[0], theta: e.theta, island: true };
      }
    });

    const coast = 1 - smoothstep(0.015, 0.16, Math.abs(best.field));
    const shelf = smoothstep(-0.28, 0.03, best.field) * (best.field <= 0 ? 1 : 0);

    return {
      field: best.field,
      isLand: best.field > 0,
      coast: clamp01(coast),
      shelf: clamp01(shelf),
      mass: best.mass,
      island: best.island,
      lon,
      lat
    };
  }

  function fallbackClimateColor(u, v, land) {
    const latCold = Math.abs(land.lat) / (Math.PI / 2);
    const heat = clamp01(1 - latCold + (noise(u, v, 8, 33000) - 0.5) * 0.24);
    const moisture = clamp01(noise(u + 0.17, v - 0.11, 10, 34000) * 0.72 + land.coast * 0.22 + (land.island ? 0.08 : 0));
    const ridge = ridged(u + land.mass.seed * 0.021, v - land.mass.seed * 0.017, 35000);
    const mountain = smoothstep(0.58, 0.92, ridge);
    const highland = smoothstep(0.46, 0.82, ridge);
    const ice = smoothstep(0.68, 0.95, latCold + mountain * 0.16 - heat * 0.12);
    let color;

    if (ice > 0.58) color = mix(COLOR.tundra, COLOR.ice, ice);
    else if (mountain > 0.68) color = mix(COLOR.highland, COLOR.mountain, mountain);
    else if (heat > 0.66 && moisture < 0.32) color = COLOR.desert;
    else if (heat > 0.58 && moisture < 0.48) color = COLOR.savanna;
    else if (moisture > 0.72 && heat > 0.46) color = COLOR.wetForest;
    else if (moisture > 0.56) color = COLOR.forest;
    else if (latCold > 0.52) color = COLOR.tundra;
    else if (moisture < 0.35) color = COLOR.steppe;
    else color = COLOR.plains;

    color = mix(color, COLOR.beach, land.coast * 0.22);
    color = mix(color, COLOR.cliff, land.coast * mountain * 0.30);
    color = mix(color, COLOR.snow, ice * mountain * 0.34);

    const fine = noise(u + 0.41, v - 0.33, 128, 36000);
    const relief = mountain * 18 + highland * 8 + fine * 8 - land.coast * 4;
    return lift(color, relief - 6);
  }

  function fallbackTextureColor(u, v) {
    const land = fallbackLandField(u, v);

    if (!land.isLand) {
      let color = mix(COLOR.abyss, COLOR.deep, noise(u, v, 12, 31000));
      color = mix(color, COLOR.ocean, smoothstep(0.2, 0.9, land.shelf) * 0.48);
      color = mix(color, COLOR.shelf, land.shelf * 0.58);
      color = mix(color, COLOR.foam, land.coast * land.shelf * 0.16);
      return color;
    }

    return fallbackClimateColor(u, v, land);
  }

  function getMaterialsAuthority() {
    return root.HEARTH_MATERIALS || root.HearthMaterials || (root.HEARTH && root.HEARTH.materials) || null;
  }

  function getRuntimeTableAuthority() {
    return root.LAB_RUNTIME_TABLE || root.DexterRuntimeTable || root.RUNTIME_TABLE ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) || null;
  }

  function sampleMaterialColor(materials, u, v) {
    if (!materials) return null;
    const fn = typeof materials.sample === "function" ? materials.sample :
      typeof materials.read === "function" ? materials.read :
        typeof materials.getMaterial === "function" ? materials.getMaterial :
          typeof materials.resolveMaterial === "function" ? materials.resolveMaterial : null;

    if (!fn) return null;

    try {
      const packet = fn.call(materials, { u, v });
      const rgb = packet && (packet.rgb || packet.color || packet.finalColorHint || packet.baseColor);
      if (Array.isArray(rgb) && rgb.length >= 3) {
        return [
          clamp(Math.round(Number(rgb[0])), 0, 255),
          clamp(Math.round(Number(rgb[1])), 0, 255),
          clamp(Math.round(Number(rgb[2])), 0, 255)
        ];
      }
    } catch (_error) {}

    return null;
  }

  function buildTextureFromSampler(width, height, sampler) {
    const data = new Uint8ClampedArray(width * height * 4);

    for (let y = 0; y < height; y += 1) {
      const v = height <= 1 ? 0 : y / (height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = width <= 1 ? 0 : x / width;
        const color = sampler(u, v) || fallbackTextureColor(u, v);
        const i = (y * width + x) * 4;
        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = 255;
      }
    }

    return { width, height, data };
  }

  function buildFallbackTexture() {
    return buildTextureFromSampler(512, 256, fallbackTextureColor);
  }

  function buildSourceTexture() {
    const materials = getMaterialsAuthority();
    if (!materials) return null;

    if (typeof materials.createTextureCanvas === "function") {
      try {
        const atlas = materials.createTextureCanvas({ width: 512, height: 256, allowLargeTexture: false });
        const ctx = atlas && typeof atlas.getContext === "function" ? atlas.getContext("2d", { willReadFrequently: true }) : null;
        if (ctx) {
          const image = ctx.getImageData(0, 0, atlas.width, atlas.height);
          return { width: atlas.width, height: atlas.height, data: image.data };
        }
      } catch (_error) {}
    }

    const sampleColor = (u, v) => sampleMaterialColor(materials, u, v) || fallbackTextureColor(u, v);
    return buildTextureFromSampler(512, 256, sampleColor);
  }

  function ensureMount(target) {
    if (!documentRef) return null;

    let mount = null;

    if (typeof target === "string") mount = documentRef.querySelector(target);
    else if (target && target.nodeType === 1) mount = target;

    if (!mount) {
      mount = documentRef.getElementById(MOUNT_ID) || documentRef.querySelector("[data-hearth-canvas-mount]");
    }

    if (!mount) {
      mount = documentRef.createElement("section");
      mount.id = MOUNT_ID;
      mount.dataset.hearthCanvasMount = "true";
      const parent = documentRef.getElementById("hearth-main") || documentRef.body || documentRef.documentElement;
      parent.appendChild(mount);
    }

    mount.id = MOUNT_ID;
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthCanvasContract = CONTRACT;
    mount.dataset.hearthCanvasReceipt = RECEIPT;
    mount.dataset.hearthVisibleCarrierOwner = "hearth.canvas.js";
    mount.dataset.hearthCarrierFirst = "true";
    mount.dataset.runtimeTableRequiredForFirstRender = "false";
    mount.dataset.sourceStackRequiredForFirstRender = "false";
    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = "hidden";
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";
    mount.style.webkitUserSelect = "none";
    mount.style.webkitTouchCallout = "none";

    return mount;
  }

  function ensureOverlay(mount) {
    if (!documentRef || !mount) return null;

    let overlay = mount.querySelector("[data-hearth-loading-overlay]");
    if (!overlay) {
      overlay = documentRef.createElement("div");
      overlay.dataset.hearthLoadingOverlay = "true";
      overlay.setAttribute("aria-live", "polite");
      overlay.textContent = "Hearth visible carrier loading.";
      overlay.style.position = "absolute";
      overlay.style.inset = "0";
      overlay.style.display = "grid";
      overlay.style.placeItems = "center";
      overlay.style.zIndex = "4";
      overlay.style.padding = "20px";
      overlay.style.textAlign = "center";
      overlay.style.color = "rgba(238,246,255,.78)";
      overlay.style.font = "800 clamp(1rem, 4vw, 1.45rem)/1.2 system-ui, sans-serif";
      overlay.style.pointerEvents = "none";
      overlay.style.background = "radial-gradient(circle at 50% 50%, rgba(11,46,71,.44), rgba(2,7,14,.52) 64%, rgba(2,7,14,.76))";
      mount.appendChild(overlay);
    }

    return overlay;
  }

  function createCanvas(mount) {
    if (!documentRef || !mount) return null;

    mount.querySelectorAll("canvas[data-hearth-canvas-carrier='true']").forEach((node) => node.remove());

    const canvas = documentRef.createElement("canvas");
    canvas.dataset.hearthCanvasCarrier = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthVisibleCarrierOwner = "hearth.canvas.js";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";
    canvas.setAttribute("aria-label", "Hearth draggable visible planet carrier");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.zIndex = "3";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.webkitTouchCallout = "none";

    mount.appendChild(canvas);
    return canvas;
  }

  function updateStatus(statusValue, extra = {}) {
    state.lastStatus = statusValue;

    const receipt = getReceipt(extra);
    const dataset = documentRef && documentRef.documentElement ? documentRef.documentElement.dataset : null;

    if (dataset) {
      dataset.hearthCanvasLoaded = "true";
      dataset.hearthCanvasContract = CONTRACT;
      dataset.hearthCanvasReceipt = RECEIPT;
      dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
      dataset.hearthVisibleCarrierOwner = "hearth.canvas.js";
      dataset.hearthCanvasCarrierMounted = String(state.mounted);
      dataset.hearthCanvasFirstFramePainted = String(state.firstFramePainted);
      dataset.hearthRuntimeTablePresent = String(state.runtimeTablePresent);
      dataset.hearthRuntimeTableMode = state.runtimeTableMode;
      dataset.hearthRuntimeTableRequiredForFirstRender = "false";
      dataset.hearthSourceStackRequiredForFirstRender = "false";
      dataset.hearthVisibleFallbackCarrierAvailable = "true";
      dataset.hearthDragInspectionBound = String(state.dragInspectionBound);
      dataset.hearthWideProbeDeferred = "true";
      dataset.generatedImage = "false";
      dataset.graphicBox = "false";
      dataset.webgl = "false";
      dataset.visualPassClaimed = "false";
    }

    root.HEARTH_CANVAS_POSTGAME_RECEIPT = receipt;
    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_CONTRACT = CONTRACT;

    const statusNode = documentRef ? documentRef.getElementById(STATUS_ID) || documentRef.querySelector("[data-hearth-route-status]") : null;
    if (statusNode) {
      statusNode.textContent = [
        "Hearth canvas carrier active.",
        `Canvas contract ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        "Visible carrier owner hearth.canvas.js",
        `Mounted ${state.mounted}`,
        `First frame painted ${state.firstFramePainted}`,
        `Texture mode ${state.textureMode}`,
        `Runtime Table present ${state.runtimeTablePresent}`,
        `Runtime Table mode ${state.runtimeTableMode}`,
        "Runtime Table required for first render false",
        "Source stack required for first render false",
        `Drag inspection bound ${state.dragInspectionBound}`,
        "Wide probe deferred true",
        "Generated image false",
        "GraphicBox false",
        "WebGL false",
        "Visual pass claimed false",
        `Status ${statusValue}`,
        state.error ? `Error ${state.error}` : ""
      ].filter(Boolean).join("\n");
    }
  }

  function resizeCanvas() {
    if (!state.mount || !state.canvas) return false;

    const box = state.mount.getBoundingClientRect ? state.mount.getBoundingClientRect() : { width: 420, height: 420 };
    const cssWidth = Math.max(280, Math.floor(box.width || state.mount.clientWidth || 420));
    const cssHeight = Math.max(280, Math.floor(box.height || state.mount.clientHeight || cssWidth));
    const cssSize = Math.max(280, Math.floor(Math.min(cssWidth, cssHeight)));
    const dpr = Math.min(1.6, root.devicePixelRatio || 1);
    const size = Math.min(640, Math.max(320, Math.floor(cssSize * dpr)));

    if (state.canvas.width !== size || state.canvas.height !== size) {
      state.canvas.width = size;
      state.canvas.height = size;
      return true;
    }

    return false;
  }

  function sampleTexture(u, v) {
    const texture = state.texture;
    if (!texture || !texture.data) return fallbackTextureColor(u, v);

    const tx = Math.floor(wrap01(u) * texture.width) % texture.width;
    const ty = clamp(Math.floor(clamp(v, 0, 0.999999) * texture.height), 0, texture.height - 1);
    const i = (ty * texture.width + tx) * 4;

    return [texture.data[i], texture.data[i + 1], texture.data[i + 2]];
  }

  function drawLoadingCarrier() {
    if (!state.ctx || !state.canvas) return;

    resizeCanvas();

    const ctx = state.ctx;
    const width = state.canvas.width;
    const height = state.canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.42;
    const gradient = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.28, radius * 0.1, cx, cy, radius * 1.1);

    ctx.clearRect(0, 0, width, height);
    gradient.addColorStop(0, "rgba(23, 78, 102, 0.96)");
    gradient.addColorStop(0.55, "rgba(8, 37, 59, 0.98)");
    gradient.addColorStop(1, "rgba(2, 7, 17, 1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.lineWidth = Math.max(1, radius * 0.004);
    ctx.strokeStyle = "rgba(231,188,105,.24)";
    ctx.stroke();
    ctx.restore();
  }

  function drawPlanetFrame() {
    if (!state.ctx || !state.canvas || state.disposed) return;

    resizeCanvas();

    const canvas = state.canvas;
    const ctx = state.ctx;
    const width = canvas.width;
    const height = canvas.height;
    const image = ctx.createImageData(width, height);
    const data = image.data;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.44;
    const cosT = Math.cos(state.tilt);
    const sinT = Math.sin(state.tilt);

    for (let y = 0; y < height; y += 1) {
      const sy = (y - cy) / radius;

      for (let x = 0; x < width; x += 1) {
        const sx = (x - cx) / radius;
        const rr = sx * sx + sy * sy;
        const i = (y * width + x) * 4;

        if (rr > 1) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
          continue;
        }

        const z = Math.sqrt(Math.max(0, 1 - rr));
        const yy = sy * cosT + z * sinT;
        const zz = z * cosT - sy * sinT;
        const lon = Math.atan2(sx, zz) + state.yaw;
        const lat = Math.asin(clamp(yy, -1, 1));
        const u = lon / TAU + 0.5;
        const v = 0.5 - lat / Math.PI;

        let color = sampleTexture(u, v);
        const light = clamp(0.43 + z * 0.58 + sx * -0.07 + sy * -0.08, 0.18, 1.08);
        const limb = clamp(0.35 + z * 0.78, 0.2, 1);
        color = scale(color, light * limb);

        const rim = smoothstep(0.74, 1, rr);
        color = mix(color, [5, 17, 31], rim * 0.48);

        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    if (!state.firstFramePainted) {
      state.firstFramePainted = true;
      if (state.overlay) {
        state.overlay.textContent = "Hearth visible carrier active.";
        state.overlay.style.opacity = "0";
        state.overlay.style.transition = "opacity .22s ease";
        root.setTimeout(() => {
          if (state.overlay) state.overlay.hidden = true;
        }, 260);
      }
      updateStatus("FIRST_FRAME_PAINTED");
    }
  }

  function animationLoop() {
    if (state.disposed) return;

    drawPlanetFrame();

    if (!state.dragging) {
      state.yaw += state.yawVelocity;
      state.tilt += state.tiltVelocity;
      state.yawVelocity *= 0.994;
      state.tiltVelocity *= 0.93;
      if (Math.abs(state.yawVelocity) < 0.0012) state.yawVelocity = state.yawVelocity < 0 ? -0.0012 : 0.0012;
      if (state.tilt > 1.30) {
        state.tilt = 1.30;
        state.tiltVelocity *= -0.18;
      }
      if (state.tilt < -1.30) {
        state.tilt = -1.30;
        state.tiltVelocity *= -0.18;
      }
    }

    state.frameCount += 1;
    if (state.frameCount < 4 || state.frameCount % 120 === 0) {
      updateStatus("VISIBLE_CARRIER_RENDERING");
    }

    state.rafId = root.requestAnimationFrame(animationLoop);
  }

  function bindDrag() {
    const canvas = state.canvas;
    if (!canvas || state.dragInspectionBound) return;

    function pointerDown(event) {
      state.dragging = true;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
      state.yawVelocity = 0;
      state.tiltVelocity = 0;
      try { canvas.setPointerCapture && canvas.setPointerCapture(event.pointerId); } catch (_error) {}
      event.preventDefault();
    }

    function pointerMove(event) {
      if (!state.dragging) return;
      const dx = event.clientX - state.lastPointerX;
      const dy = event.clientY - state.lastPointerY;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
      state.yaw += dx * 0.009;
      state.tilt = clamp(state.tilt + dy * 0.0075, -1.35, 1.35);
      state.yawVelocity = dx * 0.00085;
      state.tiltVelocity = dy * 0.00055;
      event.preventDefault();
    }

    function pointerUp(event) {
      state.dragging = false;
      try { canvas.releasePointerCapture && canvas.releasePointerCapture(event.pointerId); } catch (_error) {}
      event.preventDefault();
    }

    canvas.addEventListener("pointerdown", pointerDown, { passive: false });
    canvas.addEventListener("pointermove", pointerMove, { passive: false });
    canvas.addEventListener("pointerup", pointerUp, { passive: false });
    canvas.addEventListener("pointercancel", pointerUp, { passive: false });

    state.dragInspectionBound = true;

    state.unbindDrag = () => {
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      state.dragInspectionBound = false;
    };
  }

  function readSourceAvailability() {
    state.sourceAuthorities = {
      tectonics: Boolean(root.HEARTH_TECTONICS || root.HearthTectonics || (root.HEARTH && root.HEARTH.tectonics)),
      elevation: Boolean(root.HEARTH_ELEVATION || root.HearthElevation || (root.HEARTH && root.HEARTH.elevation)),
      composition: Boolean(root.HEARTH_COMPOSITION || root.HearthComposition || (root.HEARTH && root.HEARTH.composition)),
      hydrology: Boolean(root.HEARTH_HYDROLOGY || root.HearthHydrology || (root.HEARTH && root.HEARTH.hydrology)),
      materials: Boolean(getMaterialsAuthority()),
      runtimeTable: Boolean(getRuntimeTableAuthority())
    };
    return state.sourceAuthorities;
  }

  function consumeRuntimeTablePlan(options = {}) {
    const runtimeTable = getRuntimeTableAuthority();
    state.runtimeTablePresent = Boolean(runtimeTable);

    if (!runtimeTable) {
      state.runtimeTableMode = "MISSING_DEGRADED_DIAGNOSTIC_MODE";
      state.runtimePlan = null;
      return null;
    }

    try {
      if (typeof runtimeTable.createHearthVisualCarrierPlan === "function") {
        state.runtimePlan = runtimeTable.createHearthVisualCarrierPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          imageRendered: state.firstFramePainted,
          renderMetadata: {
            routeMounted: true,
            canvasMounted: state.mounted,
            fallbackShellAvailable: true,
            sphereContainment: true,
            outsideSphereTransparent: true,
            noRectangularTextureSpill: true,
            visualCarrierAllowed: true,
            visibleCarrierAllowed: true,
            wideProbeDeferred: true
          },
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 },
          probeSamples: []
        }, options);
        state.runtimeTableMode = "PLAN_CONSUMED_NON_BLOCKING";
        return state.runtimePlan;
      }

      if (typeof runtimeTable.createVisualCarrierPlan === "function") {
        state.runtimePlan = runtimeTable.createVisualCarrierPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          imageRendered: state.firstFramePainted,
          renderMetadata: {
            routeMounted: true,
            canvasMounted: state.mounted,
            fallbackShellAvailable: true,
            sphereContainment: true,
            outsideSphereTransparent: true,
            noRectangularTextureSpill: true,
            visualCarrierAllowed: true,
            visibleCarrierAllowed: true,
            wideProbeDeferred: true
          },
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 },
          probeSamples: []
        }, options);
        state.runtimeTableMode = "PLAN_CONSUMED_NON_BLOCKING";
        return state.runtimePlan;
      }

      state.runtimeTableMode = "PRESENT_NO_PLAN_API_DEGRADED";
      state.runtimePlan = null;
      return null;
    } catch (error) {
      state.runtimeTableMode = "PLAN_ERROR_DEGRADED";
      state.error = error && error.message ? error.message : String(error);
      state.runtimePlan = null;
      return null;
    }
  }

  function upgradeTextureAsync() {
    state.sourceTextureAttempted = true;

    const run = () => {
      if (state.disposed) return;

      try {
        const sourceTexture = buildSourceTexture();
        if (sourceTexture && sourceTexture.data) {
          state.texture = sourceTexture;
          state.textureMode = "source-materials";
          state.sourceTextureReady = true;
          state.textureReady = true;
          updateStatus("SOURCE_TEXTURE_CONSUMED");
          return;
        }
      } catch (error) {
        state.error = error && error.message ? error.message : String(error);
      }

      if (!state.textureReady) {
        state.texture = buildFallbackTexture();
        state.textureMode = "fallback-procedural-carrier";
        state.fallbackTextureReady = true;
        state.textureReady = true;
        updateStatus("FALLBACK_TEXTURE_ACTIVE");
      }
    };

    if (typeof root.requestIdleCallback === "function") {
      root.requestIdleCallback(run, { timeout: 450 });
    } else {
      root.setTimeout(run, 16);
    }
  }

  function boot(options = {}) {
    if (!documentRef) return getReceipt({ status: "NO_DOCUMENT" });

    if (state.booted && !options.force) {
      return getReceipt({ status: "ALREADY_BOOTED" });
    }

    dispose({ preserveMount: true, silent: true });

    state.booted = true;
    state.disposed = false;
    state.startedAt = nowIso();
    state.frameCount = 0;
    state.firstFramePainted = false;
    state.textureReady = false;
    state.sourceTextureAttempted = false;
    state.sourceTextureReady = false;
    state.fallbackTextureReady = false;
    state.error = "";

    const mount = ensureMount(options.mount || options.target || null);
    state.mount = mount;
    state.overlay = ensureOverlay(mount);
    state.canvas = createCanvas(mount);
    state.ctx = state.canvas ? state.canvas.getContext("2d", { alpha: true, willReadFrequently: false }) : null;

    state.mounted = Boolean(state.mount && state.canvas && state.ctx);

    if (!state.mounted) {
      state.error = "Canvas carrier mount failed.";
      updateStatus("BLOCKED_CARRIER_STRUCTURAL_FAILURE");
      return getReceipt({ status: "BLOCKED_CARRIER_STRUCTURAL_FAILURE" });
    }

    readSourceAvailability();
    consumeRuntimeTablePlan(options.runtimeTableOptions || {});

    drawLoadingCarrier();
    bindDrag();

    state.texture = buildFallbackTexture();
    state.textureMode = "fallback-procedural-carrier";
    state.fallbackTextureReady = true;
    state.textureReady = true;

    updateStatus("VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_" + (state.runtimeTablePresent ? "READY_OR_DEGRADED" : "MISSING"));

    state.rafId = root.requestAnimationFrame(animationLoop);
    upgradeTextureAsync();

    if (typeof root.ResizeObserver === "function" && state.mount) {
      try {
        state.resizeObserver = new root.ResizeObserver(() => drawPlanetFrame());
        state.resizeObserver.observe(state.mount);
      } catch (_error) {}
    }

    return getReceipt({ status: "BOOTED_VISIBLE_CARRIER_FIRST" });
  }

  function dispose(options = {}) {
    state.disposed = true;

    if (state.rafId) {
      try { root.cancelAnimationFrame(state.rafId); } catch (_error) {}
      state.rafId = 0;
    }

    if (state.resizeObserver) {
      try { state.resizeObserver.disconnect(); } catch (_error) {}
      state.resizeObserver = null;
    }

    if (typeof state.unbindDrag === "function") {
      try { state.unbindDrag(); } catch (_error) {}
      state.unbindDrag = null;
    }

    if (state.canvas && state.canvas.parentNode && options.preserveCanvas !== true) {
      try { state.canvas.remove(); } catch (_error) {}
    }

    if (state.overlay && state.overlay.parentNode && options.preserveOverlay !== true) {
      try { state.overlay.remove(); } catch (_error) {}
    }

    if (options.preserveMount !== true) {
      state.mount = null;
    }

    state.canvas = null;
    state.ctx = null;
    state.overlay = null;
    state.mounted = false;
    state.dragInspectionBound = false;

    if (!options.silent) updateStatus("DISPOSED");
  }

  function getReceipt(extra = {}) {
    const runtimeStatus = state.runtimeTablePresent
      ? state.runtimeTableMode || "PRESENT"
      : "MISSING_DEGRADED_DIAGNOSTIC_MODE";

    const postgameStatus = state.mounted
      ? state.runtimeTablePresent
        ? "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_DEGRADED"
        : "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING"
      : "BLOCKED_CARRIER_STRUCTURAL_FAILURE";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-visible-carrier",
      destinationFile: "/assets/hearth/hearth.canvas.js",
      status: extra.status || state.lastStatus || postgameStatus,
      postgameStatus,
      activeRouteConductor: "hearth.js",
      visibleCarrierOwner: "hearth.canvas.js",
      retiredClimateRoute: true,
      climateRouteActive: false,
      canvasCarrierMounted: state.mounted,
      loadingScreenImmediate: true,
      runtimeTablePresent: state.runtimeTablePresent,
      runtimeTableMode: runtimeStatus,
      runtimeTableRequiredForFirstRender: false,
      runtimeTableMissingDoesNotBlockCarrier: true,
      sourceAuthorityHeld: true,
      sourceStackRequiredForFirstRender: false,
      visibleCarrierFirst: true,
      visibleFallbackCarrierAvailable: true,
      sourceTextureAttempted: state.sourceTextureAttempted,
      sourceTextureReady: state.sourceTextureReady,
      fallbackTextureReady: state.fallbackTextureReady,
      textureMode: state.textureMode,
      firstFramePainted: state.firstFramePainted,
      imageRendered: state.firstFramePainted,
      dragInspectionBound: state.dragInspectionBound,
      receiptOverlayIndependent: true,
      wideProbeDeferred: true,
      coherentExpressionPass: false,
      visualPassClaimed: false,
      firstFailedCoordinate: state.firstFramePainted ? "POST_FRAME_DIAGNOSTIC_PENDING" : "VISIBLE_CARRIER_FIRST_FRAME_PENDING",
      recommendedNextRenewalTarget: state.firstFramePainted ? "post-frame-diagnostic-receipt" : "visible-carrier-first-frame",
      sourceAuthorities: { ...state.sourceAuthorities },
      frames: state.frameCount,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      error: state.error,
      updatedAt: nowIso(),
      ...extra
    };
  }

  function mount(options = {}) { return boot(options); }
  function start(options = {}) { return boot(options); }
  function init(options = {}) { return boot(options); }
  function render(options = {}) { return boot(options); }
  function createVisibleCarrier(options = {}) { return boot(options); }
  function mountVisibleCarrier(options = {}) { return boot(options); }
  function bootVisibleCarrier(options = {}) { return boot(options); }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    boot,
    mount,
    start,
    init,
    render,
    createVisibleCarrier,
    mountVisibleCarrier,
    bootVisibleCarrier,
    dispose,
    getReceipt,
    readReceipt: getReceipt,
    consumeRuntimeTablePlan,
    readSourceAvailability,

    supportsCarrierFirstEmergencyRecovery: true,
    supportsImmediateLoadingScreen: true,
    supportsVisibleFallbackCarrier: true,
    supportsRuntimeTableOptionalPlan: true,
    supportsSourceStackOptionalUpgrade: true,
    runtimeTableRequiredForFirstRender: false,
    sourceStackRequiredForFirstRender: false,
    wideProbeDeferred: true,
    childFailureDoesNotEraseVisualization: true,
    receiptOverlayIndependent: true,

    ownsVisibleCarrier: true,
    ownsCanvasDrawing: true,
    ownsTectonicCause: false,
    ownsElevationGeneration: false,
    ownsCompositionClassification: false,
    ownsHydrologyTruth: false,
    ownsMaterialPaletteTruth: false,
    ownsRouteShell: false,
    ownsRouteOrchestration: false,
    ownsFinalVisualPass: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() { return state; }
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;
  root.HEARTH_CANVAS = api;
  root.HearthCanvas = api;
  root.HEARTH_CANVAS_CONTRACT = CONTRACT;
  root.HEARTH_CANVAS_RECEIPT = getReceipt({ status: "LOADED_NOT_BOOTED" });
  root.HEARTH_CANVAS_BOOT = boot;
  root.__HEARTH_CANVAS_DISPOSE__ = dispose;

  if (documentRef && documentRef.documentElement) {
    const dataset = documentRef.documentElement.dataset;
    dataset.hearthCanvasAuthorityLoaded = "true";
    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthVisibleCarrierOwner = "hearth.canvas.js";
    dataset.hearthCanvasSupportsCarrierFirstEmergencyRecovery = "true";
    dataset.hearthRuntimeTableRequiredForFirstRender = "false";
    dataset.hearthSourceStackRequiredForFirstRender = "false";
    dataset.hearthVisibleFallbackCarrierAvailable = "true";
    dataset.hearthWideProbeDeferred = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
