// /assets/hearth/hearth.canvas.js
// HEARTH_G3_WEBGL_AXIS_DRAG_SPIN_SENSOR_TNT_v3
// Full-file replacement.
// Scope:
// - Canvas authority only.
// - Replaces ticking strip renderer with WebGL sphere renderer.
// - Locks Hearth to Earth-like axial degree: 23.44°.
// - Restores finger drag and flick spin inertia.
// - Rotation occurs around the tilted planetary axis, not a flat strip.
// - Cached world texture generated once.
// - Child engines remain deferred/nonblocking.
// - No GraphicBox. No image generation. No visual-pass claim.

const CONTRACT = "HEARTH_G3_WEBGL_AXIS_DRAG_SPIN_SENSOR_TNT_v3";
const RECEIPT = "HEARTH_WEBGL_AXIS_DRAG_SPIN_RECEIPT";
const VERSION = "2026-05-09.hearth-g3.webgl-axis-drag-spin-sensor.v3";

const AXIS_TILT_DEGREES = 23.44;
const AXIS_TILT_RADIANS = AXIS_TILT_DEGREES * Math.PI / 180;
const TAU = Math.PI * 2;

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
    return addColor(color, softCurrent + depth);
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
  return addColor(color, beachLift + terrainVariation);
}

function makeCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function generateWorldTexture(options) {
  const mobile = isMobileRuntime();
  const width = options.textureWidth || (mobile ? 1024 : 1536);
  const height = options.textureHeight || Math.round(width / 2);

  const textureCanvas = makeCanvas(width, height);
  const ctx = textureCanvas.getContext("2d", {
    alpha: false,
    willReadFrequently: false
  });

  const image = ctx.createImageData(width, height);
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

  ctx.putImageData(image, 0, 0);

  return {
    canvas: textureCanvas,
    width,
    height,
    receipt: `${RECEIPT}:cached-world-texture:${width}x${height}`
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
  canvas.dataset.axisTiltDegrees = String(AXIS_TILT_DEGREES);

  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    "Hearth Generation 3 WebGL globe with Earth-like axial tilt and drag spin control"
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

function mat4Identity() {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}

function mat4Multiply(a, b) {
  const out = new Float32Array(16);

  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      out[col * 4 + row] =
        a[0 * 4 + row] * b[col * 4 + 0] +
        a[1 * 4 + row] * b[col * 4 + 1] +
        a[2 * 4 + row] * b[col * 4 + 2] +
        a[3 * 4 + row] * b[col * 4 + 3];
    }
  }

  return out;
}

function mat4RotateX(rad) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);

  return new Float32Array([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ]);
}

function mat4RotateY(rad) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);

  return new Float32Array([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ]);
}

function mat4RotateZ(rad) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);

  return new Float32Array([
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}

function mat4Scale(s) {
  return new Float32Array([
    s, 0, 0, 0,
    0, s, 0, 0,
    0, 0, s, 0,
    0, 0, 0, 1
  ]);
}

function mat4Translate(x, y, z) {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ]);
}

function mat4Ortho(left, right, bottom, top, near, far) {
  const lr = 1 / (left - right);
  const bt = 1 / (bottom - top);
  const nf = 1 / (near - far);

  return new Float32Array([
    -2 * lr, 0, 0, 0,
    0, -2 * bt, 0, 0,
    0, 0, 2 * nf, 0,
    (left + right) * lr,
    (top + bottom) * bt,
    (far + near) * nf,
    1
  ]);
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || "unknown shader compile error";
    gl.deleteShader(shader);
    throw new Error(`${CONTRACT}: ${info}`);
  }

  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) || "unknown program link error";
    gl.deleteProgram(program);
    throw new Error(`${CONTRACT}: ${info}`);
  }

  return program;
}

function createSphereMesh(latSegments, lonSegments) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let lat = 0; lat <= latSegments; lat += 1) {
    const v = lat / latSegments;
    const theta = v * Math.PI;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= lonSegments; lon += 1) {
      const u = lon / lonSegments;
      const phi = u * TAU;

      const x = Math.sin(phi) * sinTheta;
      const y = cosTheta;
      const z = Math.cos(phi) * sinTheta;

      positions.push(x, y, z);
      normals.push(x, y, z);
      uvs.push(u, v);
    }
  }

  const row = lonSegments + 1;

  for (let lat = 0; lat < latSegments; lat += 1) {
    for (let lon = 0; lon < lonSegments; lon += 1) {
      const a = lat * row + lon;
      const b = a + row;
      const c = b + 1;
      const d = a + 1;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices)
  };
}

class HearthWebGLRenderer {
  constructor(target, options = {}) {
    this.options = Object.assign(
      {
        autoRotate: !prefersReducedMotion(),
        autoRadiansPerSecond: 0.085,
        dragRadiansPerScreen: TAU * 0.92,
        inertiaFrictionPerSecond: 2.15,
        minSpinVelocity: 0.0005,
        maxSpinVelocity: 8.5,
        maxCssSizeMobile: 560,
        maxCssSizeDesktop: 760,
        maxPhysicalMobile: 720,
        maxPhysicalDesktop: 1100,
        maxDprMobile: 1.5,
        maxDprDesktop: 1.85,
        latSegmentsMobile: 48,
        lonSegmentsMobile: 96,
        latSegmentsDesktop: 64,
        lonSegmentsDesktop: 128,
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

    this.mobile = isMobileRuntime();

    this.gl =
      this.canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      }) ||
      this.canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: true,
        depth: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      });

    if (!this.gl) {
      throw new Error(`${CONTRACT}: WebGL unavailable`);
    }

    this.textureSource = generateWorldTexture(this.options);

    this.destroyed = false;
    this.resizeObserver = null;
    this.raf = 0;

    this.cssSize = 0;
    this.physicalSize = 0;

    this.rotation = 0.23;
    this.spinVelocity = 0;
    this.pointerActive = false;
    this.pointerId = null;
    this.lastPointerX = 0;
    this.lastPointerTime = 0;
    this.lastTick = performance.now();
    this.lastInteraction = 0;

    this.diagnostics = {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      renderAuthority: "canvas",
      renderMode: "webgl-gpu-textured-sphere",
      axis: {
        locked: true,
        samePhysicalDegreeAsEarth: true,
        tiltDegrees: AXIS_TILT_DEGREES
      },
      motion: {
        dragSensor: true,
        spinSensor: true,
        inertia: true,
        tickingStripRendererRemoved: true
      },
      childEngines: {
        mode: "deferred-nonblocking",
        loaded: [],
        held: Object.keys(CHILD_ENGINE_PATHS),
        requiredForFirstPaint: false
      },
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      textureReceipt: this.textureSource.receipt
    };

    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onContextLost = this.onContextLost.bind(this);
    this.onContextRestored = this.onContextRestored.bind(this);

    this.initGL();
    this.installResize();
    this.installInput();
    this.resize();

    if (this.options.loadChildEngines) {
      this.loadChildEngines();
    }

    this.writeDiagnostics();
    this.requestLoop();
  }

  initGL() {
    const gl = this.gl;

    const vertexSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec2 aUV;

      uniform mat4 uModel;
      uniform mat4 uView;
      uniform mat4 uProjection;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUV;

      void main() {
        vec4 worldPosition = uModel * vec4(aPosition, 1.0);
        vPosition = worldPosition.xyz;
        vNormal = normalize((uModel * vec4(aNormal, 0.0)).xyz);
        vUV = aUV;
        gl_Position = uProjection * uView * worldPosition;
      }
    `;

    const fragmentSource = `
      precision mediump float;

      uniform sampler2D uTexture;
      uniform vec3 uLightDirection;
      uniform vec3 uViewDirection;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUV;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 base = texture2D(uTexture, vUV).rgb;

        float light = max(dot(normal, normalize(uLightDirection)), 0.0);
        float soft = 0.38 + light * 0.68;

        float rim = pow(1.0 - max(dot(normal, normalize(uViewDirection)), 0.0), 2.25);
        vec3 atmosphere = vec3(0.22, 0.58, 0.78) * rim * 0.30;

        float terminator = smoothstep(-0.26, 0.74, dot(normal, normalize(uLightDirection)));
        vec3 night = vec3(0.015, 0.035, 0.07);

        vec3 color = mix(night, base * soft, terminator);
        color += atmosphere;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    this.program = createProgram(gl, vertexSource, fragmentSource);
    gl.useProgram(this.program);

    this.locations = {
      aPosition: gl.getAttribLocation(this.program, "aPosition"),
      aNormal: gl.getAttribLocation(this.program, "aNormal"),
      aUV: gl.getAttribLocation(this.program, "aUV"),
      uModel: gl.getUniformLocation(this.program, "uModel"),
      uView: gl.getUniformLocation(this.program, "uView"),
      uProjection: gl.getUniformLocation(this.program, "uProjection"),
      uTexture: gl.getUniformLocation(this.program, "uTexture"),
      uLightDirection: gl.getUniformLocation(this.program, "uLightDirection"),
      uViewDirection: gl.getUniformLocation(this.program, "uViewDirection")
    };

    const latSegments = this.mobile ? this.options.latSegmentsMobile : this.options.latSegmentsDesktop;
    const lonSegments = this.mobile ? this.options.lonSegmentsMobile : this.options.lonSegmentsDesktop;
    const mesh = createSphereMesh(latSegments, lonSegments);

    this.indexCount = mesh.indices.length;

    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);

    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);

    this.uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.uvs, gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

    this.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.textureSource.canvas
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 0);

    gl.uniform1i(this.locations.uTexture, 0);
    gl.uniform3f(this.locations.uLightDirection, -0.42, 0.36, 0.84);
    gl.uniform3f(this.locations.uViewDirection, 0.0, 0.0, 1.0);
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
    this.canvas.addEventListener("webglcontextlost", this.onContextLost, { passive: false });
    this.canvas.addEventListener("webglcontextrestored", this.onContextRestored, { passive: false });
  }

  removeInput() {
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerUp);
    this.canvas.removeEventListener("wheel", this.onWheel);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
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

    return { cssSize, physicalSize, dpr };
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

      const gl = this.gl;
      gl.viewport(0, 0, next.physicalSize, next.physicalSize);

      this.projectionMatrix = mat4Ortho(-1.08, 1.08, -1.08, 1.08, 0.1, 10);
      this.viewMatrix = mat4Translate(0, 0, -2.7);

      this.diagnostics.performance = {
        mobile: this.mobile,
        cssSize: next.cssSize,
        physicalSize: next.physicalSize,
        devicePixelRatioUsed: next.dpr,
        renderer: "webgl",
        frameThrottle: "none"
      };

      this.writeDiagnostics();
    }
  }

  onPointerDown(event) {
    event.preventDefault();

    this.pointerActive = true;
    this.pointerId = event.pointerId;
    this.lastPointerX = event.clientX;
    this.lastPointerTime = performance.now();
    this.spinVelocity = 0;
    this.lastInteraction = this.lastPointerTime;

    try {
      this.canvas.setPointerCapture(event.pointerId);
    } catch (_) {}

    this.canvas.dataset.hearthTouchControl = "drag-active";
    this.requestLoop();
  }

  onPointerMove(event) {
    if (!this.pointerActive || event.pointerId !== this.pointerId) return;
    event.preventDefault();

    const now = performance.now();
    const dx = event.clientX - this.lastPointerX;
    const dt = Math.max(8, now - this.lastPointerTime);

    const width = Math.max(1, this.cssSize || this.canvas.clientWidth || 1);
    const delta = (dx / width) * this.options.dragRadiansPerScreen;

    this.rotation += delta;
    this.spinVelocity = clamp(delta / (dt / 1000), -this.options.maxSpinVelocity, this.options.maxSpinVelocity);

    this.lastPointerX = event.clientX;
    this.lastPointerTime = now;
    this.lastInteraction = now;

    this.canvas.dataset.hearthTouchControl = "drag-active";
    this.requestLoop();
  }

  onPointerUp(event) {
    if (event.pointerId !== this.pointerId) return;
    event.preventDefault();

    this.pointerActive = false;
    this.pointerId = null;
    this.lastInteraction = performance.now();

    try {
      this.canvas.releasePointerCapture(event.pointerId);
    } catch (_) {}

    this.canvas.dataset.hearthTouchControl = "spin-inertia";
    this.requestLoop();
  }

  onWheel(event) {
    event.preventDefault();

    const delta = clamp(event.deltaY || 0, -120, 120);
    this.spinVelocity += -delta * 0.0025;
    this.spinVelocity = clamp(this.spinVelocity, -this.options.maxSpinVelocity, this.options.maxSpinVelocity);
    this.lastInteraction = performance.now();

    this.canvas.dataset.hearthTouchControl = "wheel-spin";
    this.requestLoop();
  }

  onContextLost(event) {
    event.preventDefault();
    this.canvas.dataset.hearthWebglContext = "lost";
  }

  onContextRestored() {
    this.canvas.dataset.hearthWebglContext = "restored";
    this.initGL();
    this.resize();
    this.requestLoop();
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
        held.push({ name, path, reason: "deferred-nonblocking-import-held" });
      }
    });

    this.diagnostics.childEngines.loaded = loaded;
    this.diagnostics.childEngines.held = held;
    this.writeDiagnostics();
  }

  updateMotion(now) {
    const dt = Math.min(0.05, Math.max(0, (now - this.lastTick) / 1000));
    this.lastTick = now;

    if (this.pointerActive) return;

    if (Math.abs(this.spinVelocity) > this.options.minSpinVelocity) {
      this.rotation += this.spinVelocity * dt;
      const decay = Math.exp(-this.options.inertiaFrictionPerSecond * dt);
      this.spinVelocity *= decay;
      return;
    }

    this.spinVelocity = 0;

    if (this.options.autoRotate) {
      this.rotation += this.options.autoRadiansPerSecond * dt;
    }
  }

  buildModelMatrix() {
    const scale = mat4Scale(0.91);
    const axialTilt = mat4RotateZ(-AXIS_TILT_RADIANS);
    const spin = mat4RotateY(this.rotation);

    return mat4Multiply(axialTilt, mat4Multiply(spin, scale));
  }

  draw() {
    const gl = this.gl;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.program);

    const model = this.buildModelMatrix();

    gl.uniformMatrix4fv(this.locations.uModel, false, model);
    gl.uniformMatrix4fv(this.locations.uView, false, this.viewMatrix || mat4Translate(0, 0, -2.7));
    gl.uniformMatrix4fv(this.locations.uProjection, false, this.projectionMatrix || mat4Ortho(-1.08, 1.08, -1.08, 1.08, 0.1, 10));

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(this.locations.aPosition);
    gl.vertexAttribPointer(this.locations.aPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.enableVertexAttribArray(this.locations.aNormal);
    gl.vertexAttribPointer(this.locations.aNormal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.enableVertexAttribArray(this.locations.aUV);
    gl.vertexAttribPointer(this.locations.aUV, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);

    this.canvas.dataset.hearthRotationRadians = this.rotation.toFixed(5);
    this.canvas.dataset.hearthSpinVelocity = this.spinVelocity.toFixed(5);
    this.canvas.dataset.hearthFrameReceipt = `${RECEIPT}:webgl-frame:${Math.floor(performance.now())}`;
  }

  loop(now) {
    if (this.destroyed) return;

    this.raf = 0;

    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      this.requestLoop();
      return;
    }

    this.updateMotion(now);
    this.draw();

    const shouldContinue =
      this.options.autoRotate ||
      this.pointerActive ||
      Math.abs(this.spinVelocity) > this.options.minSpinVelocity;

    if (shouldContinue) {
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
    this.canvas.dataset.hearthRenderMode = "webgl-axis-sphere";
    this.canvas.dataset.hearthAxisTiltDegrees = String(AXIS_TILT_DEGREES);
    this.canvas.dataset.hearthAxisLock = "earth-like-23.44-degree";
    this.canvas.dataset.hearthTouchControl = this.pointerActive ? "drag-active" : "ready";
    this.canvas.dataset.hearthDragSensor = "true";
    this.canvas.dataset.hearthSpinSensor = "true";
    this.canvas.dataset.hearthGeneratedImage = "false";
    this.canvas.dataset.hearthGraphicBox = "false";
    this.canvas.dataset.hearthVisualPassClaimed = "false";
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

    const gl = this.gl;
    if (gl && !gl.isContextLost()) {
      if (this.positionBuffer) gl.deleteBuffer(this.positionBuffer);
      if (this.normalBuffer) gl.deleteBuffer(this.normalBuffer);
      if (this.uvBuffer) gl.deleteBuffer(this.uvBuffer);
      if (this.indexBuffer) gl.deleteBuffer(this.indexBuffer);
      if (this.texture) gl.deleteTexture(this.texture);
      if (this.program) gl.deleteProgram(this.program);
    }

    if (this.canvas && INSTANCE_BY_CANVAS.get(this.canvas) === this) {
      INSTANCE_BY_CANVAS.delete(this.canvas);
    }
  }
}

export function mountHearthCanvas(target, options) {
  const normalized = normalizeArgs(target, options);
  return new HearthWebGLRenderer(normalized.target, normalized.options);
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
    renderMode: "webgl-gpu-textured-sphere",
    axisTiltDegrees: AXIS_TILT_DEGREES,
    samePhysicalDegreeAsEarth: true,
    dragSensor: true,
    spinSensor: true,
    inertia: true,
    childEnginePaths: CHILD_ENGINE_PATHS,
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
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
    axisTiltDegrees: AXIS_TILT_DEGREES,
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
