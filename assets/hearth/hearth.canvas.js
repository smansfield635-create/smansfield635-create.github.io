// /assets/hearth/hearth.canvas.js
// HEARTH_G4_CANVAS_WORLD_ENGINE_RENDER_HOST_TNT_v1
// Full-file replacement.
// Deduced -> Reassigned -> Renewed.
// Canvas / World Engine = truth substrate and material composition.
// Assets = eyes/plasma/material expression.
// Runtime = motion authority.
// Controls = drag/spin/finger sensitivity input feed.
// Render = drawing authority.
// This file hosts the canvas/world-engine truth substrate and WebGL render output,
// while consuming motion from HEARTH_RUNTIME.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G4_CANVAS_WORLD_ENGINE_RENDER_HOST_TNT_v1";
  const RECEIPT = "HEARTH_G4_CANVAS_WORLD_ENGINE_RENDER_HOST_RECEIPT";
  const VERSION = "2026-05-09.hearth-g4-canvas-world-engine-render-host-v1";
  const AXIS_TILT_DEGREES = 23.44;
  const TAU = Math.PI * 2;

  const instances = new WeakMap();

  const MATERIAL_COMPOSITION = Object.freeze({
    diamond: { color: [196, 232, 242], hardness: 10, reflectance: 0.74 },
    opal: { color: [174, 214, 204], hardness: 5.8, reflectance: 0.46 },
    gold: { color: [217, 175, 76], hardness: 2.8, reflectance: 0.68 },
    slate: { color: [72, 83, 91], hardness: 5.5, reflectance: 0.18 },
    marble: { color: [184, 178, 160], hardness: 4.2, reflectance: 0.34 },
    granite: { color: [126, 119, 105], hardness: 6.5, reflectance: 0.28 },
    copper: { color: [174, 104, 63], hardness: 3.0, reflectance: 0.42 },
    soil: { color: [118, 105, 70], hardness: 1.0, reflectance: 0.12 },
    water: { color: [18, 104, 146], hardness: 0, reflectance: 0.52 }
  });

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
    const narrow = window.innerWidth <= 760;
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    return Boolean(narrow || coarse);
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

    return lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sy);
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
    for (let i = 0; i < values.length; i += 1) out = Math.max(out, values[i]);
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
      const ocean = MATERIAL_COMPOSITION.water.color;
      const shelfBlue = [24, 150, 174];

      let color = mixColor(deep, ocean, clamp(0.35 + micro * 0.48, 0, 1));
      color = mixColor(color, shelfBlue, clamp(shelf * 0.86, 0, 1));

      const softCurrent =
        (fbm(u * 0.92 + 0.13, v * 0.88 - 0.05, 4441) - 0.5) * 7 +
        (ridgedFbm(u * 0.75 - 0.09, v * 0.7 + 0.12, 5119) - 0.5) * 4;

      return addColor(color, softCurrent + (1 - shelf) * -4);
    }

    const sand = MATERIAL_COMPOSITION.soil.color;
    const dryGrass = [148, 137, 86];
    const olive = [105, 122, 80];
    const slate = MATERIAL_COMPOSITION.slate.color;
    const marble = MATERIAL_COMPOSITION.marble.color;
    const granite = MATERIAL_COMPOSITION.granite.color;
    const gold = MATERIAL_COMPOSITION.gold.color;
    const opal = MATERIAL_COMPOSITION.opal.color;

    const elevation = clamp(field * 1.2 + ridge * 0.52 + (broad - 0.5) * 0.22, 0, 1);
    const lowland = smoothstep(0.02, 0.23, field);
    const mountain = smoothstep(0.47, 0.92, elevation);
    const dry = smoothstep(0.38, 0.82, broad);
    const mineral = valueNoise(u + 0.42, v - 0.18, 64, 9207);

    let color = mixColor(sand, dryGrass, lowland);
    color = mixColor(color, olive, clamp((1 - dry) * 0.42, 0, 1));
    color = mixColor(color, slate, mountain * 0.34);
    color = mixColor(color, granite, mountain * ridge * 0.28);
    color = mixColor(color, marble, mountain * smoothstep(0.72, 0.98, ridge) * 0.24);
    color = mixColor(color, gold, smoothstep(0.92, 0.995, mineral) * 0.28);
    color = mixColor(color, opal, smoothstep(0.965, 0.999, valueNoise(u, v, 96, 3331)) * 0.20);
    color = mixColor(sand, color, smoothstep(0.08, 0.42, field));

    return addColor(color, coast * 18 + (micro - 0.5) * 16);
  }

  function createTextureCanvas() {
    const mobile = isMobileRuntime();
    const width = mobile ? 1024 : 2048;
    const height = width / 2;

    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = width;
    textureCanvas.height = height;

    const ctx = textureCanvas.getContext("2d", { alpha: false, willReadFrequently: false });
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

    return { canvas: textureCanvas, width, height };
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

  function mat4Scale(scale) {
    return new Float32Array([
      scale, 0, 0, 0,
      0, scale, 0, 0,
      0, 0, scale, 0,
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
      0, -2 * bt, 0,
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

  function ensureCanvas(mount) {
    let canvas = isCanvas(mount) ? mount : mount.querySelector("canvas[data-hearth-canvas]");

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.dataset.hearthCanvas = "true";
      canvas.className = "hearth-canvas";
      mount.appendChild(canvas);
    }

    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.hearthContract = CONTRACT;
    canvas.dataset.hearthReceipt = RECEIPT;
    canvas.dataset.hearthGeneration = "G4";
    canvas.dataset.hearthAxisTiltDegrees = String(AXIS_TILT_DEGREES);
    canvas.dataset.hearthWorldEngine = "truth-substrate";
    canvas.dataset.hearthRender = "drawing-authority";
    canvas.dataset.hearthRuntimeMotionSource = "HEARTH_RUNTIME";
    canvas.dataset.hearthGeneratedImage = "false";
    canvas.dataset.hearthGraphicBox = "false";
    canvas.dataset.hearthVisualPassClaimed = "false";

    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth G4 motion-renewed planet with drag and spin controls");
    canvas.tabIndex = 0;

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "auto";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.webkitTouchCallout = "none";

    return canvas;
  }

  class HearthCanvasWorldEngineRenderHost {
    constructor(mount, options = {}) {
      this.mount = mount;
      this.runtime = options.runtime || window.HEARTH_RUNTIME;
      this.canvas = ensureCanvas(mount);
      this.mobile = isMobileRuntime();
      this.destroyed = false;
      this.unsubscribe = null;
      this.textureSource = createTextureCanvas();

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

      if (!this.gl) throw new Error(`${CONTRACT}: WebGL unavailable.`);

      this.resize = this.resize.bind(this);
      this.draw = this.draw.bind(this);
      this.onContextLost = this.onContextLost.bind(this);
      this.onContextRestored = this.onContextRestored.bind(this);

      this.initGL();
      this.install();
      this.resize();

      if (this.runtime && typeof this.runtime.subscribe === "function") {
        this.unsubscribe = this.runtime.subscribe(this.draw);
      } else {
        this.draw({
          axisTiltRadians: AXIS_TILT_DEGREES * Math.PI / 180,
          rotationRadians: 0.34,
          waterPhase: 0,
          atmospherePhase: 0,
          lightPhase: 0
        });
      }

      this.stamp("mounted");
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
        varying vec2 vUV;

        void main() {
          vec4 worldPosition = uModel * vec4(aPosition, 1.0);
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
        uniform float uWaterPhase;
        uniform float uAtmospherePhase;

        varying vec3 vNormal;
        varying vec2 vUV;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 base = texture2D(uTexture, vUV).rgb;

          float light = max(dot(normal, normalize(uLightDirection)), 0.0);
          float terminator = smoothstep(-0.24, 0.78, dot(normal, normalize(uLightDirection)));
          float soft = 0.38 + light * 0.70;

          float rim = pow(1.0 - max(dot(normal, normalize(uViewDirection)), 0.0), 2.1);
          float plasmaPulse = 0.5 + 0.5 * sin(uAtmospherePhase + vUV.y * 6.2831);
          vec3 atmosphere = vec3(0.22, 0.58, 0.78) * rim * (0.22 + plasmaPulse * 0.08);

          float waterMotion = sin((vUV.x * 18.0) + uWaterPhase) * 0.006;
          vec3 livingBase = base + vec3(0.0, waterMotion, waterMotion * 1.4);

          vec3 night = vec3(0.012, 0.028, 0.06);
          vec3 color = mix(night, livingBase * soft, terminator);
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
        uViewDirection: gl.getUniformLocation(this.program, "uViewDirection"),
        uWaterPhase: gl.getUniformLocation(this.program, "uWaterPhase"),
        uAtmospherePhase: gl.getUniformLocation(this.program, "uAtmospherePhase")
      };

      const latSegments = this.mobile ? 48 : 64;
      const lonSegments = this.mobile ? 96 : 128;
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
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureSource.canvas);
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

    install() {
      this.resizeObserver = typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(this.resize)
        : null;

      if (this.resizeObserver) {
        this.resizeObserver.observe(this.mount);
      } else {
        window.addEventListener("resize", this.resize, { passive: true });
      }

      this.canvas.addEventListener("webglcontextlost", this.onContextLost, { passive: false });
      this.canvas.addEventListener("webglcontextrestored", this.onContextRestored, { passive: false });
    }

    getRenderSize() {
      const rect = this.mount.getBoundingClientRect();
      const available = Math.max(300, Math.floor(rect.width || this.mount.clientWidth || window.innerWidth || 560));
      const cssCap = this.mobile ? 560 : 760;
      const physicalCap = this.mobile ? 760 : 1100;
      const dprCap = this.mobile ? 1.5 : 1.85;
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

        this.gl.viewport(0, 0, next.physicalSize, next.physicalSize);
        this.projectionMatrix = mat4Ortho(-1.08, 1.08, -1.08, 1.08, 0.1, 10);
        this.viewMatrix = mat4Translate(0, 0, -2.7);

        this.canvas.dataset.hearthPhysicalSize = String(next.physicalSize);
        this.canvas.dataset.hearthDevicePixelRatioUsed = String(next.dpr.toFixed(2));

        const runtimeState = this.runtime && this.runtime.getState ? this.runtime.getState() : {};
        this.draw(runtimeState);
      }
    }

    buildModelMatrix(runtimeState) {
      const axisTiltRadians = Number.isFinite(runtimeState.axisTiltRadians)
        ? runtimeState.axisTiltRadians
        : AXIS_TILT_DEGREES * Math.PI / 180;

      const rotationRadians = Number.isFinite(runtimeState.rotationRadians)
        ? runtimeState.rotationRadians
        : 0;

      const scale = mat4Scale(0.91);
      const axialTilt = mat4RotateZ(-axisTiltRadians);
      const spin = mat4RotateY(rotationRadians);

      return mat4Multiply(axialTilt, mat4Multiply(spin, scale));
    }

    draw(runtimeState = {}) {
      if (this.destroyed || !this.gl || this.gl.isContextLost()) return;

      const gl = this.gl;

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(this.program);

      gl.uniformMatrix4fv(this.locations.uModel, false, this.buildModelMatrix(runtimeState));
      gl.uniformMatrix4fv(this.locations.uView, false, this.viewMatrix || mat4Translate(0, 0, -2.7));
      gl.uniformMatrix4fv(this.locations.uProjection, false, this.projectionMatrix || mat4Ortho(-1.08, 1.08, -1.08, 1.08, 0.1, 10));
      gl.uniform1f(this.locations.uWaterPhase, runtimeState.waterPhase || 0);
      gl.uniform1f(this.locations.uAtmospherePhase, runtimeState.atmospherePhase || 0);

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

      this.canvas.dataset.hearthRotationRadians = Number(runtimeState.rotationRadians || 0).toFixed(5);
      this.canvas.dataset.hearthSpinVelocity = Number(runtimeState.spinVelocityRadiansPerSecond || 0).toFixed(5);
      this.canvas.dataset.hearthRuntimeFrame = String(runtimeState.frame || 0);
      this.canvas.dataset.hearthFrameReceipt = `${RECEIPT}:frame:${runtimeState.frame || 0}`;
    }

    onContextLost(event) {
      event.preventDefault();
      this.canvas.dataset.hearthWebglContext = "lost";
    }

    onContextRestored() {
      this.canvas.dataset.hearthWebglContext = "restored";
      this.initGL();
      this.resize();
    }

    stamp(status) {
      document.documentElement.dataset.hearthCanvasLoaded = "true";
      document.documentElement.dataset.hearthCanvasContract = CONTRACT;
      document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
      document.documentElement.dataset.hearthCanvasVersion = VERSION;
      document.documentElement.dataset.hearthCanvasStatus = status;
      document.documentElement.dataset.hearthCanvasWorldEngine = "truth-substrate";
      document.documentElement.dataset.hearthRender = "drawing-authority";
      document.documentElement.dataset.hearthCanvasConsumesRuntime = "true";
      document.documentElement.dataset.hearthCanvasOwnsMotion = "false";
      document.documentElement.dataset.hearthCanvasGeneratedImage = "false";
      document.documentElement.dataset.hearthCanvasGraphicBox = "false";

      window.HEARTH_CANVAS_RECEIPT = Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        version: VERSION,
        generation: "G4",
        canvasWorldEngine: "truth-substrate-material-composition",
        render: "drawing-authority",
        consumesRuntime: true,
        ownsMotion: false,
        materialComposition: Object.keys(MATERIAL_COMPOSITION),
        axisTiltDegrees: AXIS_TILT_DEGREES,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false,
        status
      });
    }

    destroy() {
      this.destroyed = true;

      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }

      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      } else {
        window.removeEventListener("resize", this.resize);
      }

      this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
      this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);

      const gl = this.gl;
      if (gl && !gl.isContextLost()) {
        if (this.positionBuffer) gl.deleteBuffer(this.positionBuffer);
        if (this.normalBuffer) gl.deleteBuffer(this.normalBuffer);
        if (this.uvBuffer) gl.deleteBuffer(this.uvBuffer);
        if (this.indexBuffer) gl.deleteBuffer(this.indexBuffer);
        if (this.texture) gl.deleteTexture(this.texture);
        if (this.program) gl.deleteProgram(this.program);
      }

      instances.delete(this.mount);
      this.stamp("disposed");
    }
  }

  function mount(target, options = {}) {
    const mountTarget = isElement(target) ? target : document.querySelector(target || "#hearthCanvasMount");

    if (!mountTarget) {
      throw new Error(`${CONTRACT}: mount target not found.`);
    }

    if (instances.has(mountTarget)) {
      const prior = instances.get(mountTarget);
      prior.destroy();
    }

    const instance = new HearthCanvasWorldEngineRenderHost(mountTarget, options);
    instances.set(mountTarget, instance);

    window.__HEARTH_CANVAS_DISPOSE__ = () => instance.destroy();

    return instance;
  }

  function getContract() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      generation: "G4",
      canvasWorldEngine: "truth-substrate-material-composition",
      render: "drawing-authority",
      consumesRuntime: true,
      ownsMotion: false,
      axisTiltDegrees: AXIS_TILT_DEGREES,
      materialComposition: Object.keys(MATERIAL_COMPOSITION),
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_CANVAS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    materialComposition: MATERIAL_COMPOSITION,
    mount,
    getContract
  });

  document.documentElement.dataset.hearthCanvasLoaded = "true";
  document.documentElement.dataset.hearthCanvasContract = CONTRACT;
  document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
  document.documentElement.dataset.hearthCanvasVersion = VERSION;
})();
