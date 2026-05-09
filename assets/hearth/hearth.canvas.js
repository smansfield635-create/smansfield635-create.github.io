// /assets/hearth/hearth.canvas.js
// HEARTH_G3_TOUCH_CONTROL_FAST_STRIP_RENDER_TNT_v2
// Full-file replacement.
// Scope:
// - Canvas authority only.
// - Fixes mobile lag by removing per-frame per-pixel projection.
// - Generates static Hearth world texture once.
// - Renders animation with fast cached strip blits.
// - Restores finger drag, touch control, velocity, and inertia.
// - Caps mobile physical render cost.
// - Child engines remain nonblocking/deferred.
// - No GraphicBox. No image generation. No visual-pass claim.

const CONTRACT = "HEARTH_G3_TOUCH_CONTROL_FAST_STRIP_RENDER_TNT_v2";
const RECEIPT = "HEARTH_CANVAS_TOUCH_FAST_RENDER_RECEIPT";
const VERSION = "2026-05-09.hearth-g3.touch-control-fast-strip-render.v2";

const CHILD_ENGINE_PATHS = Object.freeze({
  terrain: "/assets/hearth/hearth.terrain.js",
  mountains: "/assets/hearth/hearth.mountains.js",
  cliffs: "/assets/hearth/hearth.cliffs.js",
  valleys: "/assets/hearth/hearth.valleys.js",
  beaches: "/assets/hearth/hearth.beaches.js",
  islands: "/assets/hearth/hearth.islands.js",
  hexSurface: "/assets/hearth/hearth.hex.surface.js"
});

const DEFAULT_SELECTORS = Object.freeze([
  "[data-hearth-canvas-mount]",
  "[data-hearth-render-mount]",
  "[data-hearth-planet-mount]",
  "#hearth-canvas-mount",
  "#hearth-render-mount",
  "#hearth-planet-mount",
  ".hearth-canvas-mount",
  ".hearth-render-mount",
  ".hearth-planet-mount"
]);

const TAU = Math.PI * 2;

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
    amp *= 0.52;
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
  for (let i = 0; i < values.length; i += 1) {
    out = Math.max(out, values[i]);
  }
  return out;
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

function sampleSurfaceColor(u, v) {
  const field = landField(u, v);
  const isLand = field > 0;

  const broad = fbm(u + 0.117, v + 0.039, 307);
  const micro = fbm(u - 0.082, v + 0.051, 907);
  const ridge = ridgedFbm(u + 0.021, v - 0.015, 1409);

  const coast = 1 - clamp(Math.abs(field) * 17, 0, 1);
  const shelf = smoothstep(-0.16, 0.02, field);

  if (!isLand) {
    const deep = [5, 33, 66];
    const ocean = [8, 74, 123];
    const shelfBlue = [24, 150, 174];

    let color = mixColor(deep, ocean, clamp(0.35 + micro * 0.48, 0, 1));
    color = mixColor(color, shelfBlue, clamp(shelf * 0.86, 0, 1));

    const softCurrent =
      (fbm(u * 0.92 + 0.13, v * 0.88 - 0.05, 4441) - 0.5) * 7 +
      (ridgedFbm(u * 0.75 - 0.09, v * 0.7 + 0.12, 5119) - 0.5) * 4;

    const depth = (1 - shelf) * -4;
    color = addColor(color, softCurrent + depth);

    return color;
  }

  const sand = [185, 166, 109];
  const dryGrass = [148, 137, 86];
  const olive = [105, 122, 80];
  const stone = [126, 119, 96];
  const highRock = [174, 165, 132];

  const elevation = clamp(field * 1.2 + ridge * 0.52 + (broad - 0.5) * 0.22, 0, 1);
  const lowland = smoothstep(0.02, 0.23, field);
  const mountain = smoothstep(0.47, 0.92, elevation);
  const dry = smoothstep(0.38, 0.82, broad);

  let color = mixColor(sand, dryGrass, lowland);
  color = mixColor(color, olive, clamp((1 - dry) * 0.42, 0, 1));
  color = mixColor(color, stone, mountain * 0.55);
  color = mixColor(color, highRock, mountain * ridge * 0.34);
  color = mixColor(sand, color, smoothstep(0.08, 0.42, field));

  const beachLift = coast * 18;
  const terrainVariation = (micro - 0.5) * 16;
  color = addColor(color, beachLift + terrainVariation);

  return color;
}

function makeCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function generateWorldTexture(options) {
  const mobile = isMobileRuntime();
  const width = options.textureWidth || (mobile ? 832 : 1280);
  const height = options.textureHeight || Math.round(width / 2);

  const textureCanvas = makeCanvas(width, height);
  const textureCtx = textureCanvas.getContext("2d", {
    alpha: false,
    willReadFrequently: false
  });

  const image = textureCtx.createImageData(width, height);
  const data = image.data;

  for (let y = 0; y < height; y += 1) {
    const v = y / Math.max(1, height - 1);

    for (let x = 0; x < width; x += 1) {
      const u = x / width;
      const color = sampleSurfaceColor(u, v);
      const index = (y * width + x) * 4;

      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = 255;
    }
  }

  textureCtx.putImageData(image, 0, 0);

  const repeatedCanvas = makeCanvas(width * 3, height);
  const repeatedCtx = repeatedCanvas.getContext("2d", {
    alpha: false,
    willReadFrequently: false
  });

  repeatedCtx.drawImage(textureCanvas, 0, 0);
  repeatedCtx.drawImage(textureCanvas, width, 0);
  repeatedCtx.drawImage(textureCanvas, width * 2, 0);

  return {
    canvas: textureCanvas,
    repeated: repeatedCanvas,
    width,
    height,
    receipt: `${RECEIPT}:static-texture:${width}x${height}`
  };
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
    "Hearth Generation 3 touch-controlled fast cached planet render"
  );

  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.maxWidth = "100%";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.borderRadius = "inherit";
  canvas.style.contain = "layout paint size";
  canvas.style.imageRendering = "auto";
  canvas.style.touchAction = "none";
  canvas.style.userSelect = "none";
  canvas.style.webkitUserSelect = "none";
  canvas.style.webkitTouchCallout = "none";
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

const INSTANCE_BY_CANVAS = new WeakMap();

class HearthCanvasRenderer {
  constructor(target, options = {}) {
    this.options = Object.assign(
      {
        autoRotate: !prefersReducedMotion(),
        autoSpeed: 0.0065,
        mobileAutoSpeed: 0.005,
        dragSensitivity: 0.82,
        inertiaFriction: 0.0032,
        maxCssSizeMobile: 560,
        maxCssSizeDesktop: 720,
        maxPhysicalMobile: 500,
        maxPhysicalDesktop: 820,
        maxDprMobile: 1.12,
        maxDprDesktop: 1.6,
        fpsMobile: 24,
        fpsDesktop: 30,
        stripCountMobile: 76,
        stripCountDesktop: 118,
        loadChildEngines: false
      },
      options || {}
    );

    this.canvas = ensureCanvas(target);

    if (!this.canvas) {
      throw new Error(`${CONTRACT}: no Hearth canvas mount found`);
    }

    const existing = INSTANCE_BY_CANVAS.get(this.canvas);
    if (existing) existing.destroy();
    INSTANCE_BY_CANVAS.set(this.canvas, this);

    this.ctx = this.canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
      willReadFrequently: false
    });

    this.mobile = isMobileRuntime();
    this.texture = generateWorldTexture(this.options);

    this.destroyed = false;
    this.resizeObserver = null;
    this.raf = 0;

    this.cssSize = 0;
    this.physicalSize = 0;
    this.radius = 0;
    this.cx = 0;
    this.cy = 0;

    this.rotation = 0.03;
    this.velocity = 0;
    this.lastTick = performance.now();
    this.lastDraw = 0;
    this.lastInput = 0;
    this.pointerActive = false;
    this.pointerId = null;
    this.lastPointerX = 0;
    this.lastPointerTime = 0;
    this.dirty = true;

    this.diagnostics = {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      renderAuthority: "canvas",
      renderMode: "cached-texture-fast-strip-blit",
      lagFix: "no-per-frame-per-pixel-projection",
      touchControl: "pointer-drag-inertia-enabled",
      childEngines: {
        mode: "deferred-nonblocking",
        loaded: [],
        held: Object.keys(CHILD_ENGINE_PATHS),
        requiredForFirstPaint: false
      },
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      cache: {
        staticTexture: true,
        textureReceipt: this.texture.receipt
      },
      performance: {
        mobile: this.mobile,
        fpsTarget: this.mobile ? this.options.fpsMobile : this.options.fpsDesktop
      }
    };

    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onWheel = this.onWheel.bind(this);

    this.installResize();
    this.installInput();
    this.resize();

    if (this.options.loadChildEngines) {
      this.loadChildEngines();
    }

    this.writeDiagnostics();
    this.requestLoop();
  }

  installResize() {
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.canvas.parentElement || this.canvas);
    } else {
      window.addEventListener("resize", this.resize, { passive: true });
    }
  }

  installInput() {
    this.canvas.addEventListener("pointerdown", this.onPointerDown, { passive: false });
    this.canvas.addEventListener("pointermove", this.onPointerMove, { passive: false });
    this.canvas.addEventListener("pointerup", this.onPointerUp, { passive: false });
    this.canvas.addEventListener("pointercancel", this.onPointerUp, { passive: false });
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false });
  }

  removeInput() {
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerUp);
    this.canvas.removeEventListener("wheel", this.onWheel);
  }

  async loadChildEngines() {
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

    this.diagnostics.childEngines.loaded = loaded;
    this.diagnostics.childEngines.held = held;
    this.writeDiagnostics();
  }

  getRenderSize() {
    const parent = this.canvas.parentElement;
    const parentRect = parent ? parent.getBoundingClientRect() : null;
    const canvasRect = this.canvas.getBoundingClientRect();

    const available = Math.max(
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
    const physicalCap = this.mobile ? this.options.maxPhysicalMobile : this.options.maxPhysicalDesktop;
    const dprCap = this.mobile ? this.options.maxDprMobile : this.options.maxDprDesktop;
    const dpr = clamp(window.devicePixelRatio || 1, 1, dprCap);

    const cssSize = Math.min(available, cssCap);
    const physicalSize = Math.max(320, Math.min(physicalCap, Math.round(cssSize * dpr)));

    return {
      cssSize,
      physicalSize,
      dpr
    };
  }

  resize() {
    if (this.destroyed) return;

    const next = this.getRenderSize();

    if (this.canvas.width !== next.physicalSize || this.canvas.height !== next.physicalSize) {
      this.canvas.width = next.physicalSize;
      this.canvas.height = next.physicalSize;
      this.canvas.style.height = `${next.cssSize}px`;

      this.cssSize = next.cssSize;
      this.physicalSize = next.physicalSize;
      this.cx = next.physicalSize / 2;
      this.cy = next.physicalSize / 2;
      this.radius = next.physicalSize * 0.455;

      this.diagnostics.performance.cssSize = next.cssSize;
      this.diagnostics.performance.physicalSize = next.physicalSize;
      this.diagnostics.performance.devicePixelRatioUsed = next.dpr;
      this.diagnostics.performance.stripCount = this.getStripCount();

      this.dirty = true;
      this.writeDiagnostics();
    }
  }

  getStripCount() {
    return this.mobile ? this.options.stripCountMobile : this.options.stripCountDesktop;
  }

  onPointerDown(event) {
    event.preventDefault();

    this.pointerActive = true;
    this.pointerId = event.pointerId;
    this.lastPointerX = event.clientX;
    this.lastPointerTime = performance.now();
    this.lastInput = this.lastPointerTime;
    this.velocity = 0;

    try {
      this.canvas.setPointerCapture(event.pointerId);
    } catch (_) {
      // Capture is best-effort across browsers.
    }

    this.canvas.dataset.hearthTouchControl = "active";
    this.dirty = true;
    this.requestLoop();
  }

  onPointerMove(event) {
    if (!this.pointerActive || event.pointerId !== this.pointerId) return;
    event.preventDefault();

    const now = performance.now();
    const dx = event.clientX - this.lastPointerX;
    const dt = Math.max(8, now - this.lastPointerTime);

    const deltaRotation = -(dx / Math.max(1, this.cssSize || this.canvas.clientWidth || 1)) * this.options.dragSensitivity;

    this.rotation = wrap01(this.rotation + deltaRotation);
    this.velocity = deltaRotation / dt;

    this.lastPointerX = event.clientX;
    this.lastPointerTime = now;
    this.lastInput = now;
    this.dirty = true;

    this.requestLoop();
  }

  onPointerUp(event) {
    if (event.pointerId !== this.pointerId) return;
    event.preventDefault();

    this.pointerActive = false;
    this.pointerId = null;
    this.lastInput = performance.now();

    try {
      this.canvas.releasePointerCapture(event.pointerId);
    } catch (_) {
      // Release is best-effort across browsers.
    }

    this.canvas.dataset.hearthTouchControl = "inertia";
    this.dirty = true;
    this.requestLoop();
  }

  onWheel(event) {
    event.preventDefault();

    const delta = clamp(event.deltaY || 0, -120, 120);
    this.rotation = wrap01(this.rotation + delta * 0.0009);
    this.velocity = delta * 0.0000015;
    this.lastInput = performance.now();
    this.dirty = true;

    this.requestLoop();
  }

  updateMotion(now) {
    const dt = Math.min(80, Math.max(0, now - this.lastTick));
    this.lastTick = now;

    if (this.pointerActive) return;

    if (Math.abs(this.velocity) > 0.000002) {
      this.rotation = wrap01(this.rotation + this.velocity * dt);
      this.velocity *= Math.exp(-this.options.inertiaFriction * dt);
      this.dirty = true;
      return;
    }

    this.velocity = 0;

    if (this.options.autoRotate) {
      const speed = this.mobile ? this.options.mobileAutoSpeed : this.options.autoSpeed;
      this.rotation = wrap01(this.rotation + speed * (dt / 1000));
      this.dirty = true;
    }
  }

  draw() {
    if (!this.ctx || !this.texture || !this.physicalSize) return;

    const ctx = this.ctx;
    const size = this.physicalSize;
    const cx = this.cx;
    const cy = this.cy;
    const radius = this.radius;

    ctx.clearRect(0, 0, size, size);

    const background = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius * 1.16);
    background.addColorStop(0, "rgba(10, 25, 39, 0.98)");
    background.addColorStop(0.72, "rgba(4, 12, 22, 0.98)");
    background.addColorStop(1, "rgba(1, 5, 10, 1)");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.clip();

    this.drawSurfaceStrips(ctx, cx, cy, radius);
    this.drawSphereLighting(ctx, cx, cy, radius);

    ctx.restore();

    this.drawAtmosphere(ctx, cx, cy, radius);

    this.canvas.dataset.hearthRotation = this.rotation.toFixed(5);
    this.canvas.dataset.hearthFrameReceipt = `${RECEIPT}:frame:${Math.floor(performance.now())}`;
  }

  drawSurfaceStrips(ctx, cx, cy, radius) {
    const strips = this.getStripCount();
    const texture = this.texture;
    const repeated = texture.repeated;
    const textureWidth = texture.width;
    const textureHeight = texture.height;

    const left = cx - radius;
    const top = cy - radius;
    const diameter = radius * 2;

    const destStep = diameter / strips;
    const srcSlice = Math.max(2, textureWidth / strips * 1.35);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = this.mobile ? "medium" : "high";

    for (let i = 0; i < strips; i += 1) {
      const x0 = left + i * destStep;
      const xMid = x0 + destStep * 0.5;
      const nx = clamp((xMid - cx) / radius, -1, 1);
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx));

      const lon = wrap01(this.rotation + 0.5 + Math.atan2(nx, nz) / TAU);
      const sourceX = textureWidth + lon * textureWidth;

      ctx.drawImage(
        repeated,
        sourceX,
        0,
        srcSlice,
        textureHeight,
        x0,
        top,
        destStep + 1.25,
        diameter
      );
    }
  }

  drawSphereLighting(ctx, cx, cy, radius) {
    const leftShadow = ctx.createRadialGradient(
      cx - radius * 0.38,
      cy - radius * 0.42,
      radius * 0.15,
      cx,
      cy,
      radius * 1.08
    );

    leftShadow.addColorStop(0, "rgba(255, 245, 196, 0.20)");
    leftShadow.addColorStop(0.38, "rgba(255, 245, 196, 0.04)");
    leftShadow.addColorStop(0.72, "rgba(5, 21, 38, 0.16)");
    leftShadow.addColorStop(1, "rgba(0, 5, 12, 0.58)");

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = leftShadow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.fill();

    const terminator = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    terminator.addColorStop(0, "rgba(255, 244, 196, 0.10)");
    terminator.addColorStop(0.46, "rgba(255, 255, 255, 0.00)");
    terminator.addColorStop(1, "rgba(0, 6, 17, 0.38)");

    ctx.fillStyle = terminator;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.fill();

    const highlight = ctx.createRadialGradient(
      cx - radius * 0.2,
      cy - radius * 0.28,
      radius * 0.02,
      cx - radius * 0.18,
      cy - radius * 0.26,
      radius * 0.55
    );

    highlight.addColorStop(0, "rgba(255, 248, 205, 0.16)");
    highlight.addColorStop(0.48, "rgba(255, 248, 205, 0.035)");
    highlight.addColorStop(1, "rgba(255, 248, 205, 0.00)");

    ctx.fillStyle = highlight;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.fill();
  }

  drawAtmosphere(ctx, cx, cy, radius) {
    ctx.save();

    const glow = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius * 1.08);
    glow.addColorStop(0, "rgba(56, 161, 198, 0.00)");
    glow.addColorStop(0.76, "rgba(63, 166, 202, 0.08)");
    glow.addColorStop(1, "rgba(105, 190, 224, 0.30)");

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.035, 0, TAU);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
    ctx.lineWidth = Math.max(1, this.physicalSize * 0.006);
    ctx.strokeStyle = "rgba(155, 209, 228, 0.22)";
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.005, 0, TAU);
    ctx.stroke();

    ctx.lineWidth = Math.max(1, this.physicalSize * 0.0025);
    ctx.strokeStyle = "rgba(255, 244, 199, 0.10)";
    ctx.beginPath();
    ctx.arc(cx - radius * 0.015, cy - radius * 0.012, radius * 0.975, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }

  loop(now) {
    if (this.destroyed) return;

    this.raf = 0;

    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      this.requestLoop();
      return;
    }

    this.updateMotion(now);

    const fps = this.mobile ? this.options.fpsMobile : this.options.fpsDesktop;
    const interval = 1000 / Math.max(1, fps);

    if (this.dirty && now - this.lastDraw >= interval) {
      this.draw();
      this.lastDraw = now;
      this.dirty = false;
    }

    if (
      this.options.autoRotate ||
      this.pointerActive ||
      Math.abs(this.velocity) > 0.000002 ||
      this.dirty
    ) {
      this.requestLoop();
    }
  }

  requestLoop() {
    if (this.destroyed || this.raf) return;
    this.raf = window.requestAnimationFrame(this.loop);
  }

  writeDiagnostics() {
    this.canvas.dataset.hearthContract = CONTRACT;
    this.canvas.dataset.hearthReceipt = RECEIPT;
    this.canvas.dataset.hearthVersion = VERSION;
    this.canvas.dataset.hearthGeneratedImage = "false";
    this.canvas.dataset.hearthGraphicBox = "false";
    this.canvas.dataset.hearthVisualPassClaimed = "false";
    this.canvas.dataset.hearthRenderMode = "fast-strip-blit";
    this.canvas.dataset.hearthTouchControl = this.pointerActive ? "active" : "ready";
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
      window.cancelAnimationFrame(this.raf);
      this.raf = 0;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    } else if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.resize);
    }

    this.removeInput();

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
    visualPassClaimed: false,
    touchControl: true,
    renderMode: "cached-texture-fast-strip-blit"
  });
}

export function warmHearthChildEngines() {
  return Promise.allSettled(
    Object.entries(CHILD_ENGINE_PATHS).map(async ([name, path]) => {
      const module = await import(path);
      return { name, path, module };
    })
  );
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
    warmChildEngines: warmHearthChildEngines,
    getContract: getHearthCanvasContract
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoBoot, { once: true });
  } else {
    queueMicrotask(autoBoot);
  }
}
