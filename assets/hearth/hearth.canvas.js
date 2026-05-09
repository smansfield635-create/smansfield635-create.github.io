// /assets/hearth/hearth.canvas.js
// HEARTH_G3_PERFORMANCE_CACHED_HIGH_DENSITY_HEX_SURFACE_TNT_v1
// Full-file replacement.
// Scope:
// - Canvas authority only.
// - Keeps Hearth identity.
// - Preserves high-density hex surface as coordinated metadata, not visible block tiling.
// - Caches static world texture once.
// - Animates globe rotation/lighting from cached texture.
// - Caps mobile DPR and render size.
// - Loads child engines as nonblocking refiners only.
// - No GraphicBox. No image generation. No visual-pass claim.

const CONTRACT = "HEARTH_G3_PERFORMANCE_CACHED_HIGH_DENSITY_HEX_SURFACE_TNT_v1";
const RECEIPT = "HEARTH_CANVAS_PERFORMANCE_CACHE_RECEIPT";
const VERSION = "2026-05-09.hearth-g3.cached-high-density-hex-surface.v1";

const CHILD_ENGINE_PATHS = Object.freeze({
  terrain: "/assets/hearth/hearth.terrain.js",
  mountains: "/assets/hearth/hearth.mountains.js",
  cliffs: "/assets/hearth/hearth.cliffs.js",
  valleys: "/assets/hearth/hearth.valleys.js",
  beaches: "/assets/hearth/hearth.beaches.js",
  islands: "/assets/hearth/hearth.islands.js",
  hexSurface: "/assets/hearth/hearth.hex.surface.js"
});

const DEFAULT_SELECTORS = [
  "[data-hearth-canvas-mount]",
  "[data-hearth-render-mount]",
  "[data-hearth-planet-mount]",
  "#hearth-canvas-mount",
  "#hearth-render-mount",
  "#hearth-planet-mount",
  ".hearth-canvas-mount",
  ".hearth-render-mount",
  ".hearth-planet-mount"
];

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;
const INSTANCE_BY_CANVAS = new WeakMap();

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function wrap01(value) {
  return mod(value, 1);
}

function wrapDelta(value) {
  return mod(value + 0.5, 1) - 0.5;
}

function isElement(value) {
  return typeof Element !== "undefined" && value instanceof Element;
}

function isCanvas(value) {
  return typeof HTMLCanvasElement !== "undefined" && value instanceof HTMLCanvasElement;
}

function isMobileRuntime() {
  if (typeof window === "undefined") return false;
  const narrow = window.innerWidth <= 760;
  const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  return Boolean(narrow || coarse);
}

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hashInt(a, b, seed) {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b);
  h ^= Math.imul(b ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
  h ^= h >>> 15;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function valueNoise(u, v, scale, seed) {
  const s = Math.max(1, Math.floor(scale));
  const x = u * s;
  const y = v * s;

  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;

  const xf = x - x0;
  const yf = y - y0;

  const sx = xf * xf * (3 - 2 * xf);
  const sy = yf * yf * (3 - 2 * yf);

  const n00 = hashInt(mod(x0, s), y0, seed);
  const n10 = hashInt(mod(x1, s), y0, seed);
  const n01 = hashInt(mod(x0, s), y1, seed);
  const n11 = hashInt(mod(x1, s), y1, seed);

  const nx0 = lerp(n00, n10, sx);
  const nx1 = lerp(n01, n11, sx);

  return lerp(nx0, nx1, sy);
}

function fbm(u, v, seed) {
  let amp = 0.5;
  let total = 0;
  let norm = 0;
  let scale = 4;

  for (let i = 0; i < 5; i += 1) {
    total += valueNoise(u, v, scale, seed + i * 101) * amp;
    norm += amp;
    amp *= 0.5;
    scale *= 2;
  }

  return total / Math.max(0.000001, norm);
}

function ridgedFbm(u, v, seed) {
  let amp = 0.52;
  let total = 0;
  let norm = 0;
  let scale = 8;

  for (let i = 0; i < 4; i += 1) {
    const n = valueNoise(u, v, scale, seed + i * 73);
    total += (1 - Math.abs(n * 2 - 1)) * amp;
    norm += amp;
    amp *= 0.52;
    scale *= 2;
  }

  return total / Math.max(0.000001, norm);
}

function rotatedEllipse(u, v, cx, cy, rx, ry, angle) {
  const dx = wrapDelta(u - cx);
  const dy = v - cy;

  const ca = Math.cos(angle);
  const sa = Math.sin(angle);

  const x = dx * ca - dy * sa;
  const y = dx * sa + dy * ca;

  const d = Math.sqrt((x * x) / (rx * rx) + (y * y) / (ry * ry));
  return 1 - d;
}

function unionMax(values) {
  let out = -999;
  for (let i = 0; i < values.length; i += 1) out = Math.max(out, values[i]);
  return out;
}

function hexRound(q, r) {
  let x = q;
  let z = r;
  let y = -x - z;

  let rx = Math.round(x);
  let ry = Math.round(y);
  let rz = Math.round(z);

  const xDiff = Math.abs(rx - x);
  const yDiff = Math.abs(ry - y);
  const zDiff = Math.abs(rz - z);

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }

  return [rx, rz];
}

function subtleHexMicroValue(u, v) {
  const density = 118;
  const x = u * density * 1.7320508075688772;
  const y = v * density;

  const q = (Math.sqrt(3) / 3) * x - (1 / 3) * y;
  const r = (2 / 3) * y;

  const rounded = hexRound(q, r);
  const centerHash = hashInt(rounded[0], rounded[1], 60091);

  return centerHash - 0.5;
}

function landField(u, v) {
  const main = unionMax([
    rotatedEllipse(u, v, 0.315, 0.475, 0.205, 0.245, -0.25),
    rotatedEllipse(u, v, 0.275, 0.415, 0.105, 0.135, -0.8),
    rotatedEllipse(u, v, 0.392, 0.535, 0.115, 0.145, 0.35),
    rotatedEllipse(u, v, 0.255, 0.63, 0.07, 0.105, 0.1),
    rotatedEllipse(u, v, 0.358, 0.305, 0.055, 0.06, 0.1)
  ]);

  const rightMass = unionMax([
    rotatedEllipse(u, v, 0.775, 0.585, 0.09, 0.315, 0.05),
    rotatedEllipse(u, v, 0.825, 0.695, 0.06, 0.17, -0.32),
    rotatedEllipse(u, v, 0.735, 0.455, 0.045, 0.105, 0.55)
  ]);

  const islands = unionMax([
    rotatedEllipse(u, v, 0.175, 0.66, 0.035, 0.062, -0.15),
    rotatedEllipse(u, v, 0.225, 0.705, 0.032, 0.055, 0.45),
    rotatedEllipse(u, v, 0.255, 0.735, 0.026, 0.04, -0.35),
    rotatedEllipse(u, v, 0.365, 0.24, 0.023, 0.017, 0.1),
    rotatedEllipse(u, v, 0.405, 0.225, 0.015, 0.011, -0.2)
  ]);

  const base = unionMax([main, rightMass, islands]);

  const coastBreak = (fbm(u + 0.013, v - 0.027, 1011) - 0.5) * 0.155;
  const smallBreak = (ridgedFbm(u - 0.041, v + 0.062, 2027) - 0.5) * 0.072;

  return base + coastBreak + smallBreak;
}

function mixColor(a, b, t) {
  const x = clamp(t, 0, 1);
  return [
    Math.round(lerp(a[0], b[0], x)),
    Math.round(lerp(a[1], b[1], x)),
    Math.round(lerp(a[2], b[2], x))
  ];
}

function addColor(a, amount) {
  return [
    clamp(Math.round(a[0] + amount), 0, 255),
    clamp(Math.round(a[1] + amount), 0, 255),
    clamp(Math.round(a[2] + amount), 0, 255)
  ];
}

function sampleSurfaceColor(u, v) {
  const field = landField(u, v);
  const land = field > 0;

  const regional = fbm(u + 0.117, v + 0.039, 307);
  const micro = fbm(u - 0.082, v + 0.051, 907);
  const ridge = ridgedFbm(u + 0.021, v - 0.015, 1409);
  const hexMicro = subtleHexMicroValue(u, v);

  const coast = 1 - clamp(Math.abs(field) * 17, 0, 1);
  const shelf = smoothstep(-0.16, 0.02, field);

  if (!land) {
    const deep = [5, 35, 66];
    const ocean = [9, 75, 122];
    const shelfBlue = [24, 151, 174];

    let color = mixColor(deep, ocean, clamp(0.38 + micro * 0.45, 0, 1));
    color = mixColor(color, shelfBlue, clamp(shelf * 0.84, 0, 1));

    const waterMotionTexture = (fbm(u + 0.27, v - 0.18, 4441) - 0.5) * 9;
    const softDepth = (1 - shelf) * -5;
    const hexAmount = hexMicro * 1.4;

    color = addColor(color, waterMotionTexture + softDepth + hexAmount);

    return {
      r: color[0],
      g: color[1],
      b: color[2],
      material: shelf > 0.32 ? 214 : 176
    };
  }

  const sand = [186, 166, 108];
  const dryGrass = [148, 137, 86];
  const olive = [105, 122, 80];
  const stone = [126, 119, 96];
  const highRock = [174, 165, 132];

  const elevation = clamp(field * 1.2 + ridge * 0.52 + (regional - 0.5) * 0.22, 0, 1);
  const lowland = smoothstep(0.02, 0.23, field);
  const mountain = smoothstep(0.47, 0.92, elevation);
  const dry = smoothstep(0.38, 0.82, regional);

  let color = mixColor(sand, dryGrass, lowland);
  color = mixColor(color, olive, clamp((1 - dry) * 0.42, 0, 1));
  color = mixColor(color, stone, mountain * 0.55);
  color = mixColor(color, highRock, mountain * ridge * 0.34);
  color = mixColor(sand, color, smoothstep(0.08, 0.42, field));

  const beachLift = coast * 18;
  const terrainVariation = (micro - 0.5) * 18 + hexMicro * 2.2;
  color = addColor(color, beachLift + terrainVariation);

  return {
    r: color[0],
    g: color[1],
    b: color[2],
    material: 255
  };
}

function generateWorldTexture(options) {
  const mobile = isMobileRuntime();
  const width = options.textureWidth || (mobile ? 768 : 1024);
  const height = options.textureHeight || Math.round(width / 2);

  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    const v = y / Math.max(1, height - 1);

    for (let x = 0; x < width; x += 1) {
      const u = x / width;
      const color = sampleSurfaceColor(u, v);
      const i = (y * width + x) * 4;

      data[i] = color.r;
      data[i + 1] = color.g;
      data[i + 2] = color.b;
      data[i + 3] = color.material;
    }
  }

  return {
    width,
    height,
    data,
    receipt: `${RECEIPT}:texture-cache:${width}x${height}`
  };
}

function buildProjection(size) {
  const radius = size * 0.462;
  const cx = size / 2;
  const cy = size / 2;

  const indices = [];
  const lonBase = [];
  const vCoord = [];
  const shade = [];
  const waterSpec = [];
  const rim = [];

  const lx = -0.33;
  const ly = 0.48;
  const lz = 0.812;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x + 0.5 - cx) / radius;
      const ny = (cy - y - 0.5) / radius;
      const rr = nx * nx + ny * ny;

      if (rr > 1) continue;

      const nz = Math.sqrt(1 - rr);
      const lon = Math.atan2(nx, nz) / TAU + 0.5;
      const lat = Math.asin(clamp(ny, -1, 1));
      const v = 0.5 - lat / Math.PI;

      const dot = clamp(nx * lx + ny * ly + nz * lz, -1, 1);
      const diffuse = Math.max(0, dot);
      const edge = Math.pow(clamp(1 - nz, 0, 1), 1.24);

      const baseShade = clamp(0.44 + diffuse * 0.62 - edge * 0.45, 0.08, 1.08);
      const spec = Math.pow(Math.max(0, dot), 34) * 44 * smoothstep(0.12, 0.92, nz);

      indices.push((y * size + x) * 4);
      lonBase.push(lon);
      vCoord.push(v);
      shade.push(baseShade);
      waterSpec.push(spec);
      rim.push(edge);
    }
  }

  return {
    size,
    indices: Uint32Array.from(indices),
    lonBase: Float32Array.from(lonBase),
    vCoord: Float32Array.from(vCoord),
    shade: Float32Array.from(shade),
    waterSpec: Float32Array.from(waterSpec),
    rim: Float32Array.from(rim),
    receipt: `${RECEIPT}:projection-cache:${size}`
  };
}

function sampleTextureNearest(texture, u, v) {
  const x = Math.floor(wrap01(u) * texture.width);
  const y = clamp(Math.floor(v * texture.height), 0, texture.height - 1);
  return (y * texture.width + mod(x, texture.width)) * 4;
}

function resolveMount(target) {
  if (typeof document === "undefined") return null;

  if (typeof target === "string") {
    return document.querySelector(target);
  }

  if (isElement(target)) {
    return target;
  }

  for (const selector of DEFAULT_SELECTORS) {
    const found = document.querySelector(selector);
    if (found) return found;
  }

  const existing = document.querySelector("canvas[data-hearth-canvas='true']");
  if (existing) return existing;

  return null;
}

function normalizeArgs(target, options) {
  if (
    target &&
    typeof target === "object" &&
    !isElement(target) &&
    !isCanvas(target) &&
    typeof target !== "string"
  ) {
    return {
      target: target.mount || target.target || target.element || target.selector || null,
      options: Object.assign({}, target, options || {})
    };
  }

  return {
    target,
    options: options || {}
  };
}

function styleCanvas(canvas) {
  canvas.dataset.hearthCanvas = "true";
  canvas.dataset.contract = CONTRACT;
  canvas.dataset.receipt = RECEIPT;
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    "Hearth Generation 3 cached high-density hex surface planet render"
  );

  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.maxWidth = "100%";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.borderRadius = "inherit";
  canvas.style.contain = "layout paint size";
  canvas.style.imageRendering = "auto";
}

function ensureCanvas(target) {
  const mount = resolveMount(target);
  if (!mount) return null;

  if (isCanvas(mount)) {
    styleCanvas(mount);
    return mount;
  }

  const existing = mount.querySelector("canvas[data-hearth-canvas='true'], canvas.hearth-canvas");
  if (existing && isCanvas(existing)) {
    styleCanvas(existing);
    return existing;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "hearth-canvas";
  styleCanvas(canvas);

  mount.appendChild(canvas);
  return canvas;
}

function upsertHiddenReceipt(canvas, diagnostics) {
  if (!canvas || !canvas.parentElement || typeof document === "undefined") return;

  const parent = canvas.parentElement;
  let node = parent.querySelector("[data-hearth-render-receipt]");

  if (!node) {
    node = document.createElement("output");
    node.hidden = true;
    node.dataset.hearthRenderReceipt = "true";
    parent.appendChild(node);
  }

  node.textContent = JSON.stringify(diagnostics);
}

async function loadChildEngines(diagnostics) {
  const entries = Object.entries(CHILD_ENGINE_PATHS);

  const results = await Promise.allSettled(
    entries.map(async ([name, path]) => {
      const module = await import(path);
      return { name, path, module };
    })
  );

  const loaded = [];
  const held = [];

  results.forEach((result, index) => {
    const [name, path] = entries[index];

    if (result.status === "fulfilled") {
      loaded.push(name);
    } else {
      held.push({ name, path, reason: "nonblocking-import-held" });
    }
  });

  diagnostics.childEngines = {
    mode: "nonblocking",
    loaded,
    held,
    requiredForFirstPaint: false
  };

  return diagnostics.childEngines;
}

class HearthCanvasRenderer {
  constructor(target, options = {}) {
    this.options = Object.assign(
      {
        rotationSpeed: prefersReducedMotion() ? 0 : 0.0105,
        mobileRotationSpeed: prefersReducedMotion() ? 0 : 0.008,
        maxCssSizeMobile: 560,
        maxCssSizeDesktop: 720,
        maxDprMobile: 1.35,
        maxDprDesktop: 1.75,
        fpsMobile: 22,
        fpsDesktop: 30
      },
      options || {}
    );

    this.canvas = ensureCanvas(target);

    if (!this.canvas) {
      throw new Error(`${CONTRACT}: no Hearth canvas mount found`);
    }

    const existing = INSTANCE_BY_CANVAS.get(this.canvas);
    if (existing) {
      existing.destroy();
    }

    INSTANCE_BY_CANVAS.set(this.canvas, this);

    this.ctx = this.canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
      willReadFrequently: false
    });

    this.mobile = isMobileRuntime();
    this.destroyed = false;
    this.texture = null;
    this.projection = null;
    this.frame = null;
    this.frameData = null;
    this.lastDraw = 0;
    this.startTime = performance.now();
    this.raf = 0;
    this.resizeObserver = null;

    this.diagnostics = {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      renderAuthority: "canvas",
      surfaceTruth: "cached-static-world-texture",
      animationAuthority: "rotation-and-lighting-only",
      hexPolicy: "high-density-metadata-subtle-overlap-no-block-tiling",
      childEngines: {
        mode: "nonblocking",
        loaded: [],
        held: [],
        requiredForFirstPaint: false
      },
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      cache: {
        staticTexture: false,
        projection: false,
        frameBuffer: false
      },
      performance: {
        mobile: this.mobile,
        dprCap: this.mobile ? this.options.maxDprMobile : this.options.maxDprDesktop,
        fpsTarget: this.mobile ? this.options.fpsMobile : this.options.fpsDesktop
      }
    };

    this.texture = generateWorldTexture(this.options);
    this.diagnostics.cache.staticTexture = true;
    this.diagnostics.textureReceipt = this.texture.receipt;

    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);

    this.installResize();
    this.resize();

    loadChildEngines(this.diagnostics)
      .catch(() => null)
      .finally(() => {
        this.writeDiagnostics();
      });

    this.writeDiagnostics();
    this.loop(this.startTime);
  }

  installResize() {
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.canvas.parentElement || this.canvas);
    } else if (typeof window !== "undefined") {
      window.addEventListener("resize", this.resize, { passive: true });
    }
  }

  getRenderSize() {
    const parent = this.canvas.parentElement;
    const parentRect = parent ? parent.getBoundingClientRect() : null;
    const canvasRect = this.canvas.getBoundingClientRect();

    const cssBase = Math.max(
      280,
      Math.floor(
        parentRect && parentRect.width
          ? parentRect.width
          : canvasRect && canvasRect.width
            ? canvasRect.width
            : Math.min(window.innerWidth || 560, 620)
      )
    );

    const cssCap = this.mobile ? this.options.maxCssSizeMobile : this.options.maxCssSizeDesktop;
    const dprCap = this.mobile ? this.options.maxDprMobile : this.options.maxDprDesktop;
    const dpr = clamp(window.devicePixelRatio || 1, 1, dprCap);

    const cssSize = Math.min(cssBase, cssCap);
    const physicalSize = Math.max(320, Math.round(cssSize * dpr));

    return {
      cssSize,
      physicalSize,
      dpr
    };
  }

  resize() {
    if (this.destroyed) return;

    const next = this.getRenderSize();

    if (this.canvas.width === next.physicalSize && this.canvas.height === next.physicalSize) {
      return;
    }

    this.canvas.width = next.physicalSize;
    this.canvas.height = next.physicalSize;
    this.canvas.style.height = `${next.cssSize}px`;

    this.projection = buildProjection(next.physicalSize);
    this.frame = this.ctx.createImageData(next.physicalSize, next.physicalSize);
    this.frameData = this.frame.data;

    this.diagnostics.cache.projection = true;
    this.diagnostics.cache.frameBuffer = true;
    this.diagnostics.projectionReceipt = this.projection.receipt;
    this.diagnostics.performance.cssSize = next.cssSize;
    this.diagnostics.performance.physicalSize = next.physicalSize;
    this.diagnostics.performance.devicePixelRatioUsed = next.dpr;

    this.writeDiagnostics();
    this.draw(performance.now());
  }

  draw(now) {
    if (!this.ctx || !this.texture || !this.projection || !this.frameData) return;

    const size = this.projection.size;
    const texture = this.texture;
    const output = this.frameData;
    const indices = this.projection.indices;
    const lonBase = this.projection.lonBase;
    const vCoord = this.projection.vCoord;
    const shade = this.projection.shade;
    const waterSpec = this.projection.waterSpec;
    const rim = this.projection.rim;

    const speed = this.mobile ? this.options.mobileRotationSpeed : this.options.rotationSpeed;
    const rotation = wrap01(((now - this.startTime) / 1000) * speed + 0.018);

    for (let i = 0; i < indices.length; i += 1) {
      const outIndex = indices[i];
      const u = lonBase[i] + rotation;
      const texIndex = sampleTextureNearest(texture, u, vCoord[i]);

      const material = texture.data[texIndex + 3];
      const s = shade[i];
      const edge = rim[i];

      let r = texture.data[texIndex] * s;
      let g = texture.data[texIndex + 1] * s;
      let b = texture.data[texIndex + 2] * s;

      if (material < 230) {
        const spec = waterSpec[i] * smoothstep(0.02, 0.64, 1 - edge);
        r += spec * 0.48;
        g += spec * 0.72;
        b += spec;
      }

      const atmosphericEdge = smoothstep(0.42, 1, edge);
      r = lerp(r, 28, atmosphericEdge * 0.26);
      g = lerp(g, 111, atmosphericEdge * 0.20);
      b = lerp(b, 152, atmosphericEdge * 0.18);

      output[outIndex] = clamp(Math.round(r), 0, 255);
      output[outIndex + 1] = clamp(Math.round(g), 0, 255);
      output[outIndex + 2] = clamp(Math.round(b), 0, 255);
      output[outIndex + 3] = 255;
    }

    this.ctx.clearRect(0, 0, size, size);
    this.ctx.putImageData(this.frame, 0, 0);
    this.drawAtmosphere(size);

    this.canvas.dataset.hearthRotation = rotation.toFixed(5);
    this.canvas.dataset.hearthFrameReceipt = `${RECEIPT}:frame:${Math.floor(now)}`;
  }

  drawAtmosphere(size) {
    const ctx = this.ctx;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.462;

    ctx.save();

    const glow = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius * 1.06);
    glow.addColorStop(0, "rgba(56, 161, 198, 0.00)");
    glow.addColorStop(0.76, "rgba(63, 166, 202, 0.08)");
    glow.addColorStop(1, "rgba(105, 190, 224, 0.30)");

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.035, 0, TAU);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
    ctx.lineWidth = Math.max(1, size * 0.006);
    ctx.strokeStyle = "rgba(155, 209, 228, 0.22)";
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.005, 0, TAU);
    ctx.stroke();

    ctx.lineWidth = Math.max(1, size * 0.0025);
    ctx.strokeStyle = "rgba(255, 244, 199, 0.10)";
    ctx.beginPath();
    ctx.arc(cx - radius * 0.015, cy - radius * 0.012, radius * 0.975, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }

  loop(now) {
    if (this.destroyed) return;

    const hidden = typeof document !== "undefined" && document.visibilityState === "hidden";
    if (hidden) {
      this.raf = window.setTimeout(() => this.loop(performance.now()), 400);
      return;
    }

    const fps = this.mobile ? this.options.fpsMobile : this.options.fpsDesktop;
    const interval = 1000 / Math.max(1, fps);

    if (now - this.lastDraw >= interval) {
      this.lastDraw = now;
      this.draw(now);
    }

    this.raf = window.requestAnimationFrame(this.loop);
  }

  writeDiagnostics() {
    this.canvas.dataset.hearthContract = CONTRACT;
    this.canvas.dataset.hearthReceipt = RECEIPT;
    this.canvas.dataset.hearthVersion = VERSION;
    this.canvas.dataset.hearthGeneratedImage = "false";
    this.canvas.dataset.hearthGraphicBox = "false";
    this.canvas.dataset.hearthVisualPassClaimed = "false";
    this.canvas.dataset.hearthCacheActive = String(Boolean(this.texture && this.projection));
    this.canvas.dataset.hearthChildEngines = JSON.stringify(this.diagnostics.childEngines);

    if (typeof window !== "undefined") {
      window.HEARTH_G3_RENDER_RECEIPT = Object.freeze(
        Object.assign({}, this.diagnostics, {
          updatedAt: new Date().toISOString()
        })
      );
    }

    upsertHiddenReceipt(this.canvas, this.diagnostics);
  }

  destroy() {
    this.destroyed = true;

    if (this.raf) {
      if (typeof this.raf === "number") {
        window.cancelAnimationFrame(this.raf);
        window.clearTimeout(this.raf);
      }
      this.raf = 0;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    } else if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.resize);
    }

    if (this.canvas && INSTANCE_BY_CANVAS.get(this.canvas) === this) {
      INSTANCE_BY_CANVAS.delete(this.canvas);
    }
  }
}

export function mountHearthCanvas(target, options) {
  const normalized = normalizeArgs(target, options);
  return new HearthCanvasRenderer(normalized.target, normalized.options);
}

export function renderHearthCanvas(target, options) {
  return mountHearthCanvas(target, options);
}

export function renderHearth(target, options) {
  return mountHearthCanvas(target, options);
}

export function initHearth(target, options) {
  return mountHearthCanvas(target, options);
}

export function startHearth(target, options) {
  return mountHearthCanvas(target, options);
}

export function getHearthCanvasContract() {
  return Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    childEnginePaths: CHILD_ENGINE_PATHS,
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

export default mountHearthCanvas;

function autoBoot() {
  if (typeof document === "undefined") return;

  const target = resolveMount(null);
  if (!target) return;

  const canvas = isCanvas(target)
    ? target
    : target.querySelector("canvas[data-hearth-canvas='true'], canvas.hearth-canvas");

  if (canvas && INSTANCE_BY_CANVAS.has(canvas)) return;

  try {
    mountHearthCanvas(target);
  } catch (error) {
    if (typeof window !== "undefined") {
      window.HEARTH_G3_RENDER_ERROR = {
        contract: CONTRACT,
        receipt: RECEIPT,
        message: error && error.message ? error.message : String(error),
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      };
    }
  }
}

if (typeof window !== "undefined") {
  window.HEARTH_CANVAS_AUTHORITY = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    mount: mountHearthCanvas,
    render: renderHearth,
    init: initHearth,
    start: startHearth,
    getContract: getHearthCanvasContract
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoBoot, { once: true });
  } else {
    queueMicrotask(autoBoot);
  }
}
