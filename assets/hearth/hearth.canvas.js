// /assets/hearth/hearth.canvas.js
// HEARTH_G4_CANVAS_WORLD_ENGINE_RENDER_HOST_TNT_v2

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G4_CANVAS_WORLD_ENGINE_RENDER_HOST_TNT_v2";
  const RECEIPT = "HEARTH_G4_CANVAS_WORLD_ENGINE_RENDER_HOST_RECEIPT";
  const AXIS_TILT_DEGREES = 23.44;
  const TAU = Math.PI * 2;

  const instances = new WeakMap();

  const MATERIALS = Object.freeze({
    diamond: [196, 232, 242],
    opal: [174, 214, 204],
    gold: [217, 175, 76],
    slate: [72, 83, 91],
    marble: [184, 178, 160],
    granite: [126, 119, 105],
    soil: [118, 105, 70],
    water: [18, 104, 146]
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

  function isMobile() {
    return window.innerWidth <= 760 || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  }

  function hash(a, b, seed) {
    let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(b ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function noise(u, v, scale, seed) {
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

    return lerp(
      lerp(hash(mod(x0, s), y0, seed), hash(mod(x1, s), y0, seed), sx),
      lerp(hash(mod(x0, s), y1, seed), hash(mod(x1, s), y1, seed), sx),
      sy
    );
  }

  function fbm(u, v, seed) {
    let amp = 0.5;
    let total = 0;
    let norm = 0;
    let scale = 4;

    for (let i = 0; i < 5; i += 1) {
      total += noise(u, v, scale, seed + i * 97) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridged(u, v, seed) {
    let amp = 0.54;
    let total = 0;
    let norm = 0;
    let scale = 8;

    for (let i = 0; i < 4; i += 1) {
      const n = noise(u, v, scale, seed + i * 71);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ellipse(u, v, cx, cy, rx, ry, angle) {
    const dx = wrapDelta(u - cx);
    const dy = v - cy;
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    const x = dx * ca - dy * sa;
    const y = dx * sa + dy * ca;
    return 1 - Math.sqrt((x * x) / (rx * rx) + (y * y) / (ry * ry));
  }

  function maxOf(list) {
    let out = -999;
    for (let i = 0; i < list.length; i += 1) out = Math.max(out, list[i]);
    return out;
  }

  function mix(a, b, t) {
    const x = clamp(t, 0, 1);
    return [
      Math.round(lerp(a[0], b[0], x)),
      Math.round(lerp(a[1], b[1], x)),
      Math.round(lerp(a[2], b[2], x))
    ];
  }

  function add(c, amount) {
    return [
      clamp(Math.round(c[0] + amount), 0, 255),
      clamp(Math.round(c[1] + amount), 0, 255),
      clamp(Math.round(c[2] + amount), 0, 255)
    ];
  }

  function landField(u, v) {
    const main = maxOf([
      ellipse(u, v, 0.315, 0.475, 0.205, 0.245, -0.25),
      ellipse(u, v, 0.275, 0.415, 0.105, 0.135, -0.8),
      ellipse(u, v, 0.392, 0.535, 0.115, 0.145, 0.35),
      ellipse(u, v, 0.255, 0.63, 0.07, 0.105, 0.1)
    ]);

    const right = maxOf([
      ellipse(u, v, 0.775, 0.585, 0.09, 0.315, 0.05),
      ellipse(u, v, 0.825, 0.695, 0.06, 0.17, -0.32)
    ]);

    const islands = maxOf([
      ellipse(u, v, 0.175, 0.66, 0.035, 0.062, -0.15),
      ellipse(u, v, 0.225, 0.705, 0.032, 0.055, 0.45),
      ellipse(u, v, 0.365, 0.24, 0.023, 0.017, 0.1)
    ]);

    return maxOf([main, right, islands])
      + (fbm(u + 0.013, v - 0.027, 1011) - 0.5) * 0.155
      + (ridged(u - 0.041, v + 0.062, 2027) - 0.5) * 0.072;
  }

  function surfaceColor(u, v) {
    const field = landField(u, v);
    const shelf = smoothstep(-0.16, 0.02, field);
    const micro = fbm(u - 0.082, v + 0.051, 907);
    const broad = fbm(u + 0.117, v + 0.039, 307);
    const ridge = ridged(u + 0.021, v - 0.015, 1409);

    if (field <= 0) {
      let color = mix([5, 33, 66], MATERIALS.water, clamp(0.35 + micro * 0.48, 0, 1));
      color = mix(color, [24, 150, 174], shelf * 0.86);
      return add(color, (fbm(u * 0.92 + 0.13, v * 0.88 - 0.05, 4441) - 0.5) * 7);
    }

    const coast = 1 - clamp(Math.abs(field) * 17, 0, 1);
    const elevation = clamp(field * 1.2 + ridge * 0.52 + (broad - 0.5) * 0.22, 0, 1);
    const mountain = smoothstep(0.47, 0.92, elevation);
    const mineral = noise(u + 0.42, v - 0.18, 64, 9207);

    let color = mix(MATERIALS.soil, [148, 137, 86], smoothstep(0.02, 0.23, field));
    color = mix(color, MATERIALS.slate, mountain * 0.34);
    color = mix(color, MATERIALS.granite, mountain * ridge * 0.28);
    color = mix(color, MATERIALS.marble, mountain * smoothstep(0.72, 0.98, ridge) * 0.24);
    color = mix(color, MATERIALS.gold, smoothstep(0.92, 0.995, mineral) * 0.28);
    color = mix(color, MATERIALS.opal, smoothstep(0.965, 0.999, noise(u, v, 96, 3331)) * 0.20);

    return add(color, coast * 18 + (micro - 0.5) * 16);
  }

  function makeTexture() {
    const width = isMobile() ? 1024 : 2048;
    const height = width / 2;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let y = 0; y < height; y += 1) {
      const v = y / Math.max(1, height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = x / width;
        const c = surfaceColor(u, v);
        const i = (y * width + x) * 4;
        data[i] = c[0];
        data[i + 1] = c[1];
        data[i + 2] = c[2];
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);
    return canvas;
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
    return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
  }

  function mat4RotateZ(rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  function mat4Scale(s) {
    return new Float32Array([s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1]);
  }

  function mat4Translate(x, y, z) {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
  }

  function mat4Ortho(left, right, bottom, top, near, far) {
    return new Float32Array([
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, -2 / (far - near), 0,
      -(right + left) / (right - left),
      -(top + bottom) / (top - bottom),
      -(far + near) / (far - near),
      1
    ]);
  }

  function shader(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);

    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(s) || "shader compile failed";
      gl.deleteShader(s);
      throw new Error(`${CONTRACT}: ${info}`);
    }

    return s;
  }

  function program(gl, vs, fs) {
    const p = gl.createProgram();
    const v = shader(gl, gl.VERTEX_SHADER, vs);
    const f = shader(gl, gl.FRAGMENT_SHADER, fs);

    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);

    gl.deleteShader(v);
    gl.deleteShader(f);

    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(p) || "program link failed";
      gl.deleteProgram(p);
      throw new Error(`${CONTRACT}: ${info}`);
    }

    return p;
  }

  function sphere(latSegments, lonSegments) {
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
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
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
    let canvas = mount.querySelector("canvas[data-hearth-canvas='true']");

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.dataset.hearthCanvas = "true";
      mount.appendChild(canvas);
    }

    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.hearthContract = CONTRACT;
    canvas.dataset.hearthReceipt = RECEIPT;
    canvas.dataset.hearthGeneration = "G4";
    canvas.dataset.hearthAxisTiltDegrees = String(AXIS_TILT_DEGREES);
    canvas.dataset.hearthWorldEngine = "truth-substrate";
    canvas.dataset.hearthRender = "drawing-authority";
    canvas.dataset.hearthGeneratedImage = "false";
    canvas.dataset.hearthGraphicBox = "false";
    canvas.dataset.hearthVisualPassClaimed = "false";
    canvas.tabIndex = 0;

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "auto";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.webkitTouchCallout = "none";

    return canvas;
  }

  class HearthCanvas {
    constructor(mount, options = {}) {
      this.mount = mount;
      this.runtime = options.runtime || window.HEARTH_RUNTIME;
      this.canvas = ensureCanvas(mount);
      this.mobile = isMobile();
      this.destroyed = false;
      this.unsubscribe = null;

      this.gl = this.canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      });

      if (!this.gl) throw new Error(`${CONTRACT}: WebGL unavailable`);

      this.resize = this.resize.bind(this);
      this.draw = this.draw.bind(this);

      this.init();
      this.install();
      this.resize();

      if (this.runtime && typeof this.runtime.subscribe === "function") {
        this.unsubscribe = this.runtime.subscribe(this.draw);
      } else {
        this.draw({ rotationRadians: 0, axisTiltRadians: AXIS_TILT_DEGREES * Math.PI / 180 });
      }

      this.stamp("mounted");
    }

    init() {
      const gl = this.gl;

      const vs = `
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

      const fs = `
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
          float terminator = smoothstep(-0.25, 0.78, dot(normal, normalize(uLightDirection)));
          float rim = pow(1.0 - max(dot(normal, normalize(uViewDirection)), 0.0), 2.1);
          float pulse = 0.5 + 0.5 * sin(uAtmospherePhase + vUV.y * 6.28318);
          float waterMotion = sin(vUV.x * 18.0 + uWaterPhase) * 0.006;
          vec3 living = base + vec3(0.0, waterMotion, waterMotion * 1.45);
          vec3 night = vec3(0.012, 0.028, 0.06);
          vec3 color = mix(night, living * (0.38 + light * 0.70), terminator);
          color += vec3(0.22, 0.58, 0.78) * rim * (0.22 + pulse * 0.08);
          gl_FragColor = vec4(color, 1.0);
        }
      `;

      this.program = program(gl, vs, fs);
      gl.useProgram(this.program);

      this.loc = {
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

      const mesh = sphere(this.mobile ? 48 : 64, this.mobile ? 96 : 128);
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

      const textureCanvas = makeTexture();
      this.texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.disable(gl.CULL_FACE);
      gl.clearColor(0, 0, 0, 0);

      gl.uniform1i(this.loc.uTexture, 0);
      gl.uniform3f(this.loc.uLightDirection, -0.42, 0.36, 0.84);
      gl.uniform3f(this.loc.uViewDirection, 0, 0, 1);
    }

    install() {
      this.resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(this.resize) : null;

      if (this.resizeObserver) {
        this.resizeObserver.observe(this.mount);
      } else {
        window.addEventListener("resize", this.resize, { passive: true });
      }
    }

    resize() {
      if (this.destroyed) return;

      const rect = this.mount.getBoundingClientRect();
      const cssSize = Math.max(320, Math.floor(rect.width || this.mount.clientWidth || 560));
      const dpr = clamp(window.devicePixelRatio || 1, 1, this.mobile ? 1.5 : 1.85);
      const physical = Math.max(320, Math.min(this.mobile ? 760 : 1100, Math.round(cssSize * dpr)));

      if (this.canvas.width !== physical || this.canvas.height !== physical) {
        this.canvas.width = physical;
        this.canvas.height = physical;
        this.canvas.style.height = `${cssSize}px`;

        this.gl.viewport(0, 0, physical, physical);
        this.projection = mat4Ortho(-1.08, 1.08, -1.08, 1.08, 0.1, 10);
        this.view = mat4Translate(0, 0, -2.7);

        this.draw(this.runtime && this.runtime.getState ? this.runtime.getState() : {});
      }
    }

    model(state) {
      const tilt = Number.isFinite(state.axisTiltRadians)
        ? state.axisTiltRadians
        : AXIS_TILT_DEGREES * Math.PI / 180;
      const rotation = Number.isFinite(state.rotationRadians) ? state.rotationRadians : 0;
      return mat4Multiply(mat4RotateZ(-tilt), mat4Multiply(mat4RotateY(rotation), mat4Scale(0.91)));
    }

    draw(state = {}) {
      if (this.destroyed) return;

      const gl = this.gl;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(this.program);

      gl.uniformMatrix4fv(this.loc.uModel, false, this.model(state));
      gl.uniformMatrix4fv(this.loc.uView, false, this.view || mat4Translate(0, 0, -2.7));
      gl.uniformMatrix4fv(this.loc.uProjection, false, this.projection || mat4Ortho(-1.08, 1.08, -1.08, 1.08, 0.1, 10));
      gl.uniform1f(this.loc.uWaterPhase, state.waterPhase || 0);
      gl.uniform1f(this.loc.uAtmospherePhase, state.atmospherePhase || 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.enableVertexAttribArray(this.loc.aPosition);
      gl.vertexAttribPointer(this.loc.aPosition, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
      gl.enableVertexAttribArray(this.loc.aNormal);
      gl.vertexAttribPointer(this.loc.aNormal, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
      gl.enableVertexAttribArray(this.loc.aUV);
      gl.vertexAttribPointer(this.loc.aUV, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);

      this.canvas.dataset.hearthRotationRadians = Number(state.rotationRadians || 0).toFixed(5);
      this.canvas.dataset.hearthSpinVelocity = Number(state.spinVelocityRadiansPerSecond || 0).toFixed(5);
      this.canvas.dataset.hearthRuntimeFrame = String(state.frame || 0);
    }

    stamp(status) {
      document.documentElement.dataset.hearthCanvasLoaded = "true";
      document.documentElement.dataset.hearthCanvasContract = CONTRACT;
      document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
      document.documentElement.dataset.hearthCanvasStatus = status;
      document.documentElement.dataset.hearthCanvasWorldEngine = "truth-substrate";
      document.documentElement.dataset.hearthCanvasConsumesRuntime = "true";
      document.documentElement.dataset.hearthCanvasOwnsMotion = "false";

      window.HEARTH_CANVAS_RECEIPT = Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        generation: "G4",
        canvasWorldEngine: "truth-substrate",
        render: "drawing-authority",
        consumesRuntime: true,
        ownsMotion: false,
        materialComposition: Object.keys(MATERIALS),
        axisTiltDegrees: AXIS_TILT_DEGREES,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false,
        status
      });
    }

    destroy() {
      this.destroyed = true;
      if (this.unsubscribe) this.unsubscribe();
      if (this.resizeObserver) this.resizeObserver.disconnect();
      else window.removeEventListener("resize", this.resize);
      instances.delete(this.mount);
      this.stamp("disposed");
    }
  }

  function mount(target, options = {}) {
    const mountTarget = typeof target === "string" ? document.querySelector(target) : target;

    if (!mountTarget) {
      throw new Error(`${CONTRACT}: mount target missing`);
    }

    if (instances.has(mountTarget)) {
      instances.get(mountTarget).destroy();
    }

    const instance = new HearthCanvas(mountTarget, options);
    instances.set(mountTarget, instance);
    window.__HEARTH_CANVAS_DISPOSE__ = () => instance.destroy();
    return instance;
  }

  window.HEARTH_CANVAS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    mount
  });

  document.documentElement.dataset.hearthCanvasLoaded = "true";
  document.documentElement.dataset.hearthCanvasContract = CONTRACT;
  document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
})();
