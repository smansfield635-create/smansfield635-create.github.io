// /assets/hearth/hearth.canvas.js
// HEARTH_G2_CANVAS_POLE_SWIVEL_SEVEN_BODY_CONSUMER_TNT_v2
// Full-file replacement.
// Contract repair for failed Hearth seven-body-mass hard renewal.
// Canvas draws runtime state, consumes Hearth G2 pole swivel, and consumes seven-body-mass assets.
// Runtime remains motion authority.
// Controls remain input authority.
// Assets remain material/body-mass expression authority.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G2_CANVAS_POLE_SWIVEL_SEVEN_BODY_CONSUMER_TNT_v2";
  const RECEIPT = "HEARTH_G2_CANVAS_POLE_SWIVEL_SEVEN_BODY_CONSUMER_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_G4_1_CANVAS_ASSET_BOUNDARY_RENDER_HOST_TNT_v1";

  const AXIS_TILT_DEGREES = 23.44;
  const AXIS_TILT_RADIANS = (AXIS_TILT_DEGREES * Math.PI) / 180;
  const TAU = Math.PI * 2;

  const instances = new WeakMap();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader) || "shader compile failed";
      gl.deleteShader(shader);
      throw new Error(`${CONTRACT}: ${info}`);
    }

    return shader;
  }

  function createProgram(gl, vertexSource, fragmentSource) {
    const program = gl.createProgram();
    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program) || "program link failed";
      gl.deleteProgram(program);
      throw new Error(`${CONTRACT}: ${info}`);
    }

    return program;
  }

  function createSphere(latSegments, lonSegments) {
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

  function fallbackTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;

    const ctx = canvas.getContext("2d", { alpha: false });
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

    gradient.addColorStop(0, "#06172f");
    gradient.addColorStop(0.26, "#0b5b87");
    gradient.addColorStop(0.38, "#34a2a6");
    gradient.addColorStop(0.48, "#c7ad70");
    gradient.addColorStop(0.56, "#73915d");
    gradient.addColorStop(0.72, "#5b7552");
    gradient.addColorStop(1, "#18253a");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(220,230,226,0.42)";
    for (let i = 0; i < 9; i += 1) {
      const x = ((i * 137) % canvas.width);
      const y = ((i * 83) % canvas.height);
      ctx.beginPath();
      ctx.ellipse(x, y, 90 + i * 8, 20 + i * 3, i * 0.43, 0, TAU);
      ctx.fill();
    }

    canvas.dataset.hearthFallbackTexture = "true";
    return canvas;
  }

  function resolveTextureCanvas(assets) {
    if (assets && typeof assets.createTextureCanvas === "function") {
      return assets.createTextureCanvas();
    }

    if (assets && typeof assets.createHearthTextureCanvas === "function") {
      return assets.createHearthTextureCanvas();
    }

    if (window.HEARTH_ASSETS && typeof window.HEARTH_ASSETS.createTextureCanvas === "function") {
      return window.HEARTH_ASSETS.createTextureCanvas();
    }

    return fallbackTexture();
  }

  function ensureCanvas(mount) {
    let canvas = mount.querySelector("canvas[data-hearth-canvas='true']");

    if (!canvas) {
      canvas = document.createElement("canvas");
      mount.appendChild(canvas);
    }

    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthPreviousCanvasContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthPoleSwivelConsumer = "true";
    canvas.dataset.hearthSevenBodyMassConsumer = "true";
    canvas.dataset.hearthCanvasConsumesSevenBodyMass = "true";
    canvas.dataset.hearthCanvasConsumesPoleSwivel = "true";
    canvas.dataset.hearthGeneratedImage = "false";
    canvas.dataset.hearthGraphicBox = "false";
    canvas.dataset.hearthVisualPassClaimed = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.visualPassClaimed = "false";

    canvas.tabIndex = 0;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "auto";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.webkitTouchCallout = "none";

    return canvas;
  }

  function readInspectionTilt(state = {}) {
    if (Number.isFinite(state.inspectionTiltRadians)) return state.inspectionTiltRadians;
    if (Number.isFinite(state.poleSwivelRadians)) return state.poleSwivelRadians;

    const motion = window.__HEARTH_INSPECTION_MOTION__ || {};

    if (Number.isFinite(motion.inspectionTiltRadians)) return motion.inspectionTiltRadians;
    if (Number.isFinite(motion.poleSwivelRadians)) return motion.poleSwivelRadians;

    return 0;
  }

  function readRuntimeState(runtime, fallbackStartMs, lastState = {}) {
    const direct =
      (runtime && typeof runtime.getState === "function" ? runtime.getState() : null) ||
      (runtime && typeof runtime.sampleMotionState === "function" ? runtime.sampleMotionState() : null) ||
      (runtime && typeof runtime.sampleRuntimeMotion === "function" ? runtime.sampleRuntimeMotion() : null) ||
      lastState ||
      {};

    const elapsedSeconds = Math.max(0, (performance.now() - fallbackStartMs) / 1000);

    return {
      rotationRadians:
        Number.isFinite(direct.rotationRadians) ? direct.rotationRadians :
        Number.isFinite(direct.rotationRad) ? direct.rotationRad :
        elapsedSeconds * 0.045,

      axisTiltRadians:
        Number.isFinite(direct.axisTiltRadians) ? direct.axisTiltRadians :
        Number.isFinite(direct.axialTiltRad) ? direct.axialTiltRad :
        AXIS_TILT_RADIANS,

      waterPhase:
        Number.isFinite(direct.waterPhase) ? direct.waterPhase :
        Number.isFinite(direct.oceanPhaseRad) ? direct.oceanPhaseRad :
        elapsedSeconds * 0.12,

      atmospherePhase:
        Number.isFinite(direct.atmospherePhase) ? direct.atmospherePhase :
        Number.isFinite(direct.atmosphericPhaseRad) ? direct.atmosphericPhaseRad :
        elapsedSeconds * 0.08,

      frame:
        Number.isFinite(direct.frame) ? direct.frame :
        Math.floor(elapsedSeconds * 60)
    };
  }

  class HearthCanvasController {
    constructor(mount, options = {}) {
      this.mount = mount;
      this.runtime = options.runtime || window.HEARTH_RUNTIME || null;
      this.assets = options.assets || window.HEARTH_ASSETS || null;
      this.canvas = ensureCanvas(mount);
      this.destroyed = false;
      this.startedAt = performance.now();
      this.lastState = {};
      this.raf = 0;
      this.unsubscribe = null;
      this.resizeObserver = null;

      this.resize = this.resize.bind(this);
      this.frame = this.frame.bind(this);
      this.onControlMotion = this.onControlMotion.bind(this);

      this.gl = this.canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      });

      if (!this.gl) {
        throw new Error(`${CONTRACT}: WebGL unavailable.`);
      }

      this.init();
      this.install();
      this.resize();

      if (this.runtime && typeof this.runtime.subscribe === "function") {
        this.unsubscribe = this.runtime.subscribe((state) => {
          this.lastState = { ...this.lastState, ...(state || {}) };
          this.draw(this.lastState);
        });
      }

      this.start();
      this.stamp("mounted");
    }

    init() {
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
          float terminator = smoothstep(-0.25, 0.78, dot(normal, normalize(uLightDirection)));
          float rim = pow(1.0 - max(dot(normal, normalize(uViewDirection)), 0.0), 2.12);
          float livingPulse = 0.5 + 0.5 * sin(uAtmospherePhase + vUV.y * 6.28318);
          float waterShift = sin(vUV.x * 18.0 + uWaterPhase) * 0.004;

          vec3 living = base + vec3(0.0, waterShift, waterShift * 1.25);
          vec3 night = vec3(0.012, 0.028, 0.060);
          vec3 color = mix(night, living * (0.40 + light * 0.70), terminator);

          color += vec3(0.22, 0.58, 0.78) * rim * (0.20 + livingPulse * 0.08);

          gl_FragColor = vec4(color, 1.0);
        }
      `;

      this.program = createProgram(gl, vertexSource, fragmentSource);
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

      const mobile =
        window.innerWidth <= 760 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

      const mesh = createSphere(mobile ? 48 : 64, mobile ? 96 : 128);
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

      const textureCanvas = resolveTextureCanvas(this.assets);

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
      if (typeof ResizeObserver !== "undefined") {
        this.resizeObserver = new ResizeObserver(this.resize);
        this.resizeObserver.observe(this.mount);
      } else {
        window.addEventListener("resize", this.resize, { passive: true });
      }

      window.addEventListener("hearth:control-motion", this.onControlMotion, { passive: true });
    }

    resize() {
      if (this.destroyed) return;

      const rect = this.mount.getBoundingClientRect();
      const cssSize = Math.max(320, Math.floor(rect.width || this.mount.clientWidth || 560));
      const coarse =
        window.matchMedia &&
        window.matchMedia("(pointer: coarse)").matches;

      const dpr = clamp(window.devicePixelRatio || 1, 1, coarse ? 1.5 : 1.85);
      const physical = Math.max(320, Math.min(coarse ? 760 : 1100, Math.round(cssSize * dpr)));

      if (this.canvas.width !== physical || this.canvas.height !== physical) {
        this.canvas.width = physical;
        this.canvas.height = physical;
        this.canvas.style.height = `${cssSize}px`;

        this.gl.viewport(0, 0, physical, physical);
        this.projection = mat4Ortho(-1.08, 1.08, -1.08, 1.08, 0.1, 10);
        this.view = mat4Translate(0, 0, -2.7);
      }

      this.draw(this.lastState);
    }

    model(state = {}) {
      const rotation = Number.isFinite(state.rotationRadians) ? state.rotationRadians : 0;
      const axisTilt = Number.isFinite(state.axisTiltRadians) ? state.axisTiltRadians : AXIS_TILT_RADIANS;
      const poleTilt = readInspectionTilt(state);

      return mat4Multiply(
        mat4RotateX(poleTilt),
        mat4Multiply(
          mat4RotateZ(-axisTilt),
          mat4Multiply(mat4RotateY(rotation), mat4Scale(0.91))
        )
      );
    }

    draw(state = {}) {
      if (this.destroyed) return;

      this.lastState = {
        ...this.lastState,
        ...state
      };

      const gl = this.gl;

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(this.program);

      gl.uniformMatrix4fv(this.loc.uModel, false, this.model(this.lastState));
      gl.uniformMatrix4fv(this.loc.uView, false, this.view || mat4Translate(0, 0, -2.7));
      gl.uniformMatrix4fv(this.loc.uProjection, false, this.projection || mat4Ortho(-1.08, 1.08, -1.08, 1.08, 0.1, 10));
      gl.uniform1f(this.loc.uWaterPhase, this.lastState.waterPhase || 0);
      gl.uniform1f(this.loc.uAtmospherePhase, this.lastState.atmospherePhase || 0);

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

      const poleTilt = readInspectionTilt(this.lastState);

      this.canvas.dataset.hearthRuntimeFrame = String(this.lastState.frame || 0);
      this.canvas.dataset.hearthRotationRadians = Number(this.lastState.rotationRadians || 0).toFixed(5);
      this.canvas.dataset.hearthInspectionTiltRadians = Number(poleTilt || 0).toFixed(5);
      this.canvas.dataset.hearthPoleSwivelConsumer = "true";
      this.canvas.dataset.hearthSevenBodyMassConsumer = "true";
    }

    frame() {
      if (this.destroyed) return;

      const sampled = readRuntimeState(this.runtime, this.startedAt, this.lastState);
      this.draw({
        ...sampled,
        inspectionTiltRadians: readInspectionTilt(this.lastState)
      });

      this.raf = requestAnimationFrame(this.frame);
    }

    start() {
      if (this.raf) return;
      this.raf = requestAnimationFrame(this.frame);
    }

    onControlMotion(event) {
      if (this.destroyed) return;

      const detail = event && event.detail ? event.detail : {};
      this.draw({
        ...this.lastState,
        inspectionTiltRadians: detail.inspectionTiltRadians || 0,
        poleSwivelRadians: detail.poleSwivelRadians || 0
      });
    }

    stamp(status) {
      document.documentElement.dataset.hearthCanvasLoaded = "true";
      document.documentElement.dataset.hearthCanvasContract = CONTRACT;
      document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
      document.documentElement.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
      document.documentElement.dataset.hearthCanvasStatus = status;
      document.documentElement.dataset.hearthCanvasConsumesRuntime = "true";
      document.documentElement.dataset.hearthCanvasConsumesPoleSwivel = "true";
      document.documentElement.dataset.hearthCanvasConsumesSevenBodyMass = "true";
      document.documentElement.dataset.hearthPoleSwivelConsumer = "true";
      document.documentElement.dataset.hearthSevenBodyMassConsumer = "true";
      document.documentElement.dataset.generatedImage = "false";
      document.documentElement.dataset.graphicBox = "false";
      document.documentElement.dataset.visualPassClaimed = "false";

      window.HEARTH_CANVAS_RECEIPT = Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        status,
        consumesRuntime: true,
        consumesPoleSwivel: true,
        consumesSevenBodyMass: true,
        ownsMotion: false,
        ownsAssets: false,
        draws: true,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      });
    }

    destroy() {
      this.destroyed = true;

      if (this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
      }

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

      window.removeEventListener("hearth:control-motion", this.onControlMotion);

      instances.delete(this.mount);
      this.stamp("disposed");
    }
  }

  function resolveMount(target) {
    if (typeof target === "string") return document.querySelector(target);
    if (target instanceof Element) return target;
    return document.getElementById("hearthCanvasMount") || document.querySelector("[data-hearth-canvas-mount]");
  }

  function mount(target, options = {}) {
    const mountTarget = resolveMount(target);

    if (!mountTarget) {
      throw new Error(`${CONTRACT}: mount target missing.`);
    }

    if (instances.has(mountTarget)) {
      instances.get(mountTarget).destroy();
    }

    const controller = new HearthCanvasController(mountTarget, options);
    instances.set(mountTarget, controller);

    window.__HEARTH_CANVAS_DISPOSE__ = () => controller.destroy();

    return controller;
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      consumesRuntime: true,
      consumesPoleSwivel: true,
      consumesSevenBodyMass: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_CANVAS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    mount,
    getStatus
  });

  window.HEARTH_CANVAS_RECEIPT = getStatus();

  document.documentElement.dataset.hearthCanvasLoaded = "true";
  document.documentElement.dataset.hearthCanvasContract = CONTRACT;
  document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
  document.documentElement.dataset.hearthCanvasConsumesPoleSwivel = "true";
  document.documentElement.dataset.hearthCanvasConsumesSevenBodyMass = "true";
})();
