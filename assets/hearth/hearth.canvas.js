// /assets/hearth/hearth.canvas.js
// HEARTH_G2_CANVAS_POLE_SWIVEL_PRESERVATION_CONSUMER_TNT_v1
// Full-file replacement.
// Canvas / World Engine keeps truth substrate.
// Assets define visible material boundaries.
// Runtime stays motion authority.
// Controls stay input authority.
// New delta: consume inspectionTiltRadians / poleSwivelRadians from Hearth controls.
// Preserve existing Hearth visual posture and texture behavior.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G2_CANVAS_POLE_SWIVEL_PRESERVATION_CONSUMER_TNT_v1";
  const RECEIPT = "HEARTH_G2_CANVAS_POLE_SWIVEL_PRESERVATION_CONSUMER_RECEIPT";
  const PREVIOUS_CONTRACT = "HEARTH_G4_1_CANVAS_ASSET_BOUNDARY_RENDER_HOST_TNT_v1";

  const AXIS_TILT_DEGREES = 23.44;
  const TAU = Math.PI * 2;
  const instances = new WeakMap();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isMobile() {
    return window.innerWidth <= 760 || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
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

  function fallbackTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

    gradient.addColorStop(0, "#0a4974");
    gradient.addColorStop(0.45, "#1696ad");
    gradient.addColorStop(0.5, "#c4ae70");
    gradient.addColorStop(0.72, "#7a7950");
    gradient.addColorStop(1, "#253440");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.dataset.hearthFallbackTexture = "true";

    return canvas;
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
    canvas.dataset.hearthPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthGeneration = "G2-control-preservation";
    canvas.dataset.hearthAxisTiltDegrees = String(AXIS_TILT_DEGREES);
    canvas.dataset.hearthPoleSwivelConsumer = "true";
    canvas.dataset.hearthWorldEngine = "truth-substrate";
    canvas.dataset.hearthAssetsBoundaryExpression = "true";
    canvas.dataset.hearthAssetsAdoptAuthority = "false";
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

  function readInspectionTilt(state = {}) {
    const direct =
      Number.isFinite(state.inspectionTiltRadians) ? state.inspectionTiltRadians :
      Number.isFinite(state.poleSwivelRadians) ? state.poleSwivelRadians :
      null;

    if (Number.isFinite(direct)) return direct;

    const control = window.__HEARTH_INSPECTION_MOTION__ || {};

    if (Number.isFinite(control.inspectionTiltRadians)) return control.inspectionTiltRadians;
    if (Number.isFinite(control.poleSwivelRadians)) return control.poleSwivelRadians;

    return 0;
  }

  class HearthCanvas {
    constructor(mount, options = {}) {
      this.mount = mount;
      this.runtime = options.runtime || window.HEARTH_RUNTIME;
      this.assets = options.assets || window.HEARTH_ASSETS;
      this.canvas = ensureCanvas(mount);
      this.mobile = isMobile();
      this.destroyed = false;
      this.unsubscribe = null;
      this.resizeObserver = null;
      this.lastState = {};
      this.onControlMotion = this.onControlMotion.bind(this);

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
        this.unsubscribe = this.runtime.subscribe((state) => {
          this.lastState = state || {};
          this.draw(this.lastState);
        });
      } else {
        this.lastState = {
          rotationRadians: 0,
          axisTiltRadians: AXIS_TILT_DEGREES * Math.PI / 180
        };
        this.draw(this.lastState);
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
          float plasmaPulse = 0.5 + 0.5 * sin(uAtmospherePhase + vUV.y * 6.28318);
          float waterMotion = sin(vUV.x * 18.0 + uWaterPhase) * 0.004;
          vec3 living = base + vec3(0.0, waterMotion, waterMotion * 1.35);
          vec3 night = vec3(0.012, 0.028, 0.06);
          vec3 color = mix(night, living * (0.40 + light * 0.70), terminator);
          color += vec3(0.22, 0.58, 0.78) * rim * (0.20 + plasmaPulse * 0.08);
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

      const textureCanvas =
        this.assets && typeof this.assets.createTextureCanvas === "function"
          ? this.assets.createTextureCanvas()
          : fallbackTexture();

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

      window.addEventListener("hearth:control-motion", this.onControlMotion, { passive: true });
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
        this.draw(this.runtime && this.runtime.getState ? this.runtime.getState() : this.lastState);
      }
    }

    model(state) {
      const tilt = Number.isFinite(state.axisTiltRadians)
        ? state.axisTiltRadians
        : AXIS_TILT_DEGREES * Math.PI / 180;

      const rotation = Number.isFinite(state.rotationRadians) ? state.rotationRadians : 0;
      const inspectionTilt = readInspectionTilt(state);

      return mat4Multiply(
        mat4RotateX(inspectionTilt),
        mat4Multiply(
          mat4RotateZ(-tilt),
          mat4Multiply(mat4RotateY(rotation), mat4Scale(0.91))
        )
      );
    }

    onControlMotion(event) {
      if (this.destroyed) return;

      const control = event && event.detail ? event.detail : {};
      this.draw({
        ...this.lastState,
        inspectionTiltRadians: control.inspectionTiltRadians || 0,
        poleSwivelRadians: control.poleSwivelRadians || 0
      });
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

      const inspectionTilt = readInspectionTilt(this.lastState);

      this.canvas.dataset.hearthRotationRadians = Number(this.lastState.rotationRadians || 0).toFixed(5);
      this.canvas.dataset.hearthSpinVelocity = Number(this.lastState.spinVelocityRadiansPerSecond || 0).toFixed(5);
      this.canvas.dataset.hearthInspectionTiltRadians = Number(inspectionTilt || 0).toFixed(5);
      this.canvas.dataset.hearthRuntimeFrame = String(this.lastState.frame || 0);
      this.canvas.dataset.hearthAssetsBoundaryExpression = "true";
      this.canvas.dataset.hearthAssetsAdoptAuthority = "false";
      this.canvas.dataset.hearthPoleSwivelConsumer = "true";
    }

    stamp(status) {
      document.documentElement.dataset.hearthCanvasLoaded = "true";
      document.documentElement.dataset.hearthCanvasContract = CONTRACT;
      document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
      document.documentElement.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
      document.documentElement.dataset.hearthCanvasStatus = status;
      document.documentElement.dataset.hearthCanvasWorldEngine = "truth-substrate";
      document.documentElement.dataset.hearthCanvasConsumesRuntime = "true";
      document.documentElement.dataset.hearthCanvasConsumesPoleSwivel = "true";
      document.documentElement.dataset.hearthCanvasOwnsMotion = "false";
      document.documentElement.dataset.hearthAssetsBoundaryExpression = "true";
      document.documentElement.dataset.hearthAssetsAdoptAuthority = "false";

      window.HEARTH_CANVAS_RECEIPT = Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        generation: "G2-control-preservation",
        canvasWorldEngine: "truth-substrate",
        render: "drawing-authority",
        consumesRuntime: true,
        consumesPoleSwivel: true,
        ownsMotion: false,
        assetsBoundaryExpression: true,
        assetsAdoptAuthority: false,
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

      window.removeEventListener("hearth:control-motion", this.onControlMotion);

      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", this.resize);
      }

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
    previousContract: PREVIOUS_CONTRACT,
    mount
  });

  document.documentElement.dataset.hearthCanvasLoaded = "true";
  document.documentElement.dataset.hearthCanvasContract = CONTRACT;
  document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
  document.documentElement.dataset.hearthCanvasConsumesPoleSwivel = "true";
})();
