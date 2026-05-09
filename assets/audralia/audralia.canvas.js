// /assets/audralia/audralia.canvas.js
// AUDRALIA_V18_CANVAS_ASSET_BOUNDARY_CONSUMER_TNT_v1
// Canvas draws Audralia and consumes runtime motion + asset material.
// Runtime remains motion-only.
// Assets bind, separate, define, carry, and express visible material boundaries.
// No GraphicBox. No generated image. No visual-pass claim.

import * as AudraliaAssets from "./audralia.assets.js";

const CONTRACT = "AUDRALIA_V18_CANVAS_ASSET_BOUNDARY_CONSUMER_TNT_v1";
const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const PREVIOUS_CONTRACT = "AUDRALIA_CANVAS_PARENT_CONTRACT_CHILD_ACTIVATION_TNT_v13";
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

function ensureCanvas(mount) {
  let canvas = mount.querySelector("canvas[data-audralia-canvas='true']");

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.dataset.audraliaCanvas = "true";
    mount.appendChild(canvas);
  }

  canvas.dataset.audraliaCanvas = "true";
  canvas.dataset.audraliaCanvasReceipt = RECEIPT;
  canvas.dataset.audraliaCanvasContract = CONTRACT;
  canvas.dataset.audraliaPreviousCanvasContract = PREVIOUS_CONTRACT;
  canvas.dataset.audraliaAssetsBoundaryExpression = "true";
  canvas.dataset.audraliaAssetsAbsorbAuthority = "false";
  canvas.dataset.generatedImage = "false";
  canvas.dataset.graphicBox = "false";
  canvas.dataset.visualPassClaimed = "false";
  canvas.tabIndex = 0;

  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "auto";
  canvas.style.touchAction = "none";
  canvas.style.userSelect = "none";

  return canvas;
}

function readRuntimeState(runtime, fallbackStart) {
  const status =
    runtime?.getState?.() ||
    runtime?.getMotionState?.() ||
    runtime?.getStatus?.() ||
    window.__AUDRALIA_RUNTIME_STATUS__ ||
    {};

  const elapsed = Math.max(0, (performance.now() - fallbackStart) / 1000);

  return {
    rotationRadians: Number.isFinite(status.rotationRadians)
      ? status.rotationRadians
      : Number.isFinite(status.angleRadians)
        ? status.angleRadians
        : Number.isFinite(status.orbitRadians)
          ? status.orbitRadians
          : elapsed * 0.05,
    axisTiltRadians: Number.isFinite(status.axisTiltRadians)
      ? status.axisTiltRadians
      : AXIS_TILT_DEGREES * Math.PI / 180,
    waterPhase: Number.isFinite(status.waterPhase) ? status.waterPhase : elapsed * 0.16,
    atmospherePhase: Number.isFinite(status.atmospherePhase) ? status.atmospherePhase : elapsed * 0.09,
    frame: Number.isFinite(status.frame) ? status.frame : Math.floor(elapsed * 60)
  };
}

class AudraliaCanvasController {
  constructor(mount, options = {}) {
    this.mount = mount;
    this.runtime = options.runtime || options.runtimeMotion || null;
    this.assets = options.assets || AudraliaAssets;
    this.canvas = ensureCanvas(mount);
    this.mobile = isMobile();
    this.destroyed = false;
    this.startedAt = performance.now();
    this.raf = 0;
    this.resizeObserver = null;

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

    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);

    this.initGL();
    this.install();
    this.resize();
    this.start();
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
        float terminator = smoothstep(-0.25, 0.78, dot(normal, normalize(uLightDirection)));
        float rim = pow(1.0 - max(dot(normal, normalize(uViewDirection)), 0.0), 2.15);
        float plasma = 0.5 + 0.5 * sin(uAtmospherePhase + vUV.y * 6.28318);
        float waterMotion = sin(vUV.x * 18.0 + uWaterPhase) * 0.004;

        vec3 living = base + vec3(0.0, waterMotion, waterMotion * 1.35);
        vec3 night = vec3(0.012, 0.028, 0.06);
        vec3 color = mix(night, living * (0.40 + light * 0.70), terminator);
        color += vec3(0.22, 0.58, 0.78) * rim * (0.20 + plasma * 0.08);

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

    const mesh = createSphere(this.mobile ? 48 : 64, this.mobile ? 96 : 128);
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
      this.assets?.createAudraliaAssetTexture?.() ||
      this.assets?.createTextureCanvas?.() ||
      AudraliaAssets.createAudraliaAssetTexture();

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
    }
  }

  model(state) {
    return mat4Multiply(
      mat4RotateZ(-state.axisTiltRadians),
      mat4Multiply(mat4RotateY(state.rotationRadians), mat4Scale(0.91))
    );
  }

  draw(state) {
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

    this.canvas.dataset.audraliaRuntimeFrame = String(state.frame || 0);
    this.canvas.dataset.audraliaRotationRadians = Number(state.rotationRadians || 0).toFixed(5);
  }

  loop() {
    if (this.destroyed) return;

    this.draw(readRuntimeState(this.runtime, this.startedAt));
    this.raf = requestAnimationFrame(this.loop);
  }

  start() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(this.loop);
  }

  stamp(status) {
    const canvasStatus = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      routeConsumesAssets: true,
      assetsBoundaryExpression: true,
      assetsAbsorbAuthority: false,
      runtimeMotionOnly: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      status
    };

    window.__AUDRALIA_CANVAS_STATUS__ = canvasStatus;
    window.AUDRALIA_CANVAS_STATUS = canvasStatus;

    document.documentElement.dataset.audraliaCanvasLoaded = "true";
    document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
    document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
    document.documentElement.dataset.audraliaAssetsBoundaryExpression = "true";
    document.documentElement.dataset.audraliaAssetsAbsorbAuthority = "false";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  destroy() {
    this.destroyed = true;

    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    } else {
      window.removeEventListener("resize", this.resize);
    }

    instances.delete(this.mount);
    this.stamp("disposed");
  }
}

function resolveMount(target) {
  if (typeof target === "string") return document.querySelector(target);
  if (target instanceof Element) return target;
  return document.querySelector("#audralia-canvas-mount, [data-audralia-canvas-mount]");
}

function mountAudraliaCanvas(target, options = {}) {
  const mount = resolveMount(target);

  if (!mount) {
    throw new Error(`${CONTRACT}: canonical mount not found.`);
  }

  if (instances.has(mount)) {
    instances.get(mount).destroy();
  }

  const controller = new AudraliaCanvasController(mount, options);
  instances.set(mount, controller);

  window.__AUDRALIA_CANVAS_DISPOSE__ = () => controller.destroy();

  return controller;
}

function getAudraliaCanvasStatus() {
  return Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    assetsBoundaryExpression: true,
    assetsAbsorbAuthority: false,
    runtimeMotionOnly: true,
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

if (typeof window !== "undefined") {
  window.mountAudraliaCanvas = mountAudraliaCanvas;
  window.renderAudraliaCanvas = mountAudraliaCanvas;
  window.__AUDRALIA_CANVAS_STATUS__ = getAudraliaCanvasStatus();
}

export {
  CONTRACT,
  RECEIPT,
  PREVIOUS_CONTRACT,
  mountAudraliaCanvas,
  mountAudraliaCanvas as renderAudraliaCanvas,
  mountAudraliaCanvas as bootAudraliaCanvas,
  mountAudraliaCanvas as createAudraliaCanvas,
  mountAudraliaCanvas as initAudraliaCanvas,
  mountAudraliaCanvas as mount,
  getAudraliaCanvasStatus
};

export default {
  mountAudraliaCanvas,
  renderAudraliaCanvas: mountAudraliaCanvas,
  mount: mountAudraliaCanvas,
  getAudraliaCanvasStatus
};
