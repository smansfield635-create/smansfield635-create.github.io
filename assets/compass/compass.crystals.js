// /assets/compass/compass.crystals.js
// DGB_COMPASS_CRYSTALS_CINEMATIC_REDESIGN_TNT_v2_1
// FULL-FILE
// Owns: WebGL crystal visualization, lighting, animation, resize, reduced motion,
// runtime status, and receipts.
// Does not own: copy, routes, authority model, layout, CSS, diagnostics, or visual-pass claims.

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "DGB_COMPASS_CRYSTALS_CINEMATIC_REDESIGN_TNT_v2_1";
  const PREVIOUS_CONTRACT = "DGB_COMPASS_CRYSTALS_3D_RUNTIME_TNT_v1";
  const FILE = "/assets/compass/compass.crystals.js";
  const GLOBAL = "DGBCompassCrystals";
  const HOST_SELECTOR = "[data-compass-crystal]";
  const MAX_DPR = 2;

  const state = {
    mounted: false,
    running: false,
    reducedMotion: false,
    hostCount: 0,
    webGLCount: 0,
    frameCount: 0,
    drawCount: 0,
    firstFrameDrawn: false,
    errorCount: 0,
    lastAction: "loaded",
    updatedAt: now(),
    raf: 0,
    instances: [],
    errors: []
  };

  const VERTEX_SOURCE = `
    precision highp float;

    attribute vec3 a_position;
    attribute vec3 a_normal;

    uniform mat4 u_matrix;
    uniform mat3 u_normalMatrix;

    varying vec3 v_normal;
    varying vec3 v_position;

    void main(void) {
      v_normal = normalize(u_normalMatrix * a_normal);
      v_position = a_position;
      gl_Position = u_matrix * vec4(a_position, 1.0);
    }
  `;

  const FRAGMENT_SOURCE = `
    precision highp float;

    varying vec3 v_normal;
    varying vec3 v_position;

    uniform vec3 u_base;
    uniform vec3 u_secondary;
    uniform float u_time;
    uniform float u_focus;
    uniform float u_fade;

    void main(void) {
      vec3 n = normalize(v_normal);

      vec3 keyLight = normalize(vec3(-0.42, 0.72, 0.54));
      vec3 fillLight = normalize(vec3(0.62, -0.18, 0.38));

      float key = max(dot(n, keyLight), 0.0);
      float fill = max(dot(n, fillLight), 0.0);
      float rim = pow(1.0 - max(abs(n.z), 0.0), 2.1);
      float inner = 0.58 + 0.14 * sin(u_time * 0.001 + v_position.y * 4.8);

      vec3 color = mix(u_base, u_secondary, key * 0.62 + rim * 0.25);
      color += vec3(1.0, 0.84, 0.48) * rim * 0.20;
      color += vec3(0.38, 0.68, 1.0) * fill * 0.16;

      color *= inner + key * 0.48 + u_focus * 0.18;
      color *= mix(0.44, 1.0, 1.0 - u_fade);

      float alpha = mix(0.32, 0.78 + rim * 0.14 + u_focus * 0.08, 1.0 - u_fade);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  function now() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function prefersReducedMotion() {
    return Boolean(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function recordError(scope, error) {
    state.errorCount += 1;
    state.errors.push({
      scope,
      message: error && error.message ? error.message : String(error),
      at: now()
    });

    if (state.errors.length > 20) state.errors.shift();

    state.lastAction = "error:" + scope;
    publish();
  }

  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.max(min, Math.min(max, number));
  }

  function identity4() {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  function multiply4(a, b) {
    const out = new Float32Array(16);

    for (let column = 0; column < 4; column += 1) {
      for (let row = 0; row < 4; row += 1) {
        out[column * 4 + row] =
          a[row] * b[column * 4] +
          a[4 + row] * b[column * 4 + 1] +
          a[8 + row] * b[column * 4 + 2] +
          a[12 + row] * b[column * 4 + 3];
      }
    }

    return out;
  }

  function perspective4(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);

    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * nf, -1,
      0, 0, 2 * near * far * nf, 0
    ]);
  }

  function translate4(x, y, z) {
    const m = identity4();
    m[12] = x;
    m[13] = y;
    m[14] = z;
    return m;
  }

  function rotateX4(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Float32Array([
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ]);
  }

  function rotateY4(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Float32Array([
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ]);
  }

  function scale4(x, y, z) {
    return new Float32Array([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    ]);
  }

  function normal3From4(m) {
    return new Float32Array([
      m[0], m[1], m[2],
      m[4], m[5], m[6],
      m[8], m[9], m[10]
    ]);
  }

  function normalOf(a, b, c) {
    const ux = b[0] - a[0];
    const uy = b[1] - a[1];
    const uz = b[2] - a[2];

    const vx = c[0] - a[0];
    const vy = c[1] - a[1];
    const vz = c[2] - a[2];

    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const length = Math.hypot(nx, ny, nz) || 1;

    return [nx / length, ny / length, nz / length];
  }

  function createCrystalGeometry(kind) {
    const tall = kind === "mirrorland" ? 1.12 : kind === "room" ? 0.92 : 1.0;

    const vertices = [
      [0.00, 1.10 * tall, 0.00],
      [-0.46, 0.38, 0.48],
      [0.46, 0.38, 0.48],
      [0.62, 0.28, 0.00],
      [0.46, 0.38, -0.48],
      [-0.46, 0.38, -0.48],
      [-0.62, 0.28, 0.00],
      [0.00, -1.02 * tall, 0.00]
    ];

    const faces = [
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 4],
      [0, 4, 5],
      [0, 5, 6],
      [0, 6, 1],
      [7, 2, 1],
      [7, 3, 2],
      [7, 4, 3],
      [7, 5, 4],
      [7, 6, 5],
      [7, 1, 6]
    ];

    const positions = [];
    const normals = [];

    faces.forEach((face) => {
      const a = vertices[face[0]];
      const b = vertices[face[1]];
      const c = vertices[face[2]];
      const n = normalOf(a, b, c);

      face.forEach((index) => {
        const v = vertices[index];
        positions.push(v[0], v[1], v[2]);
        normals.push(n[0], n[1], n[2]);
      });
    });

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      count: positions.length / 3
    };
  }

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Shader allocation failed.");

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || "Shader compile failed.";
      gl.deleteShader(shader);
      throw new Error(message);
    }

    return shader;
  }

  function createProgram(gl) {
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SOURCE);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SOURCE);
    const program = gl.createProgram();

    if (!program) throw new Error("Program allocation failed.");

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || "Program link failed.";
      gl.deleteProgram(program);
      throw new Error(message);
    }

    return program;
  }

  function createBuffer(gl, data) {
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error("Buffer allocation failed.");

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return buffer;
  }

  function colors(kind) {
    switch (kind) {
      case "north":
        return [[0.96, 0.78, 0.34], [0.58, 0.84, 1.00]];
      case "east":
        return [[0.40, 0.76, 1.00], [0.92, 0.78, 0.38]];
      case "south":
        return [[0.48, 0.92, 0.72], [0.96, 0.70, 0.38]];
      case "west":
        return [[0.96, 0.58, 0.30], [0.48, 0.68, 1.00]];
      case "mirrorland":
        return [[0.82, 0.74, 1.00], [1.00, 0.80, 0.42]];
      default:
        return [[0.72, 0.86, 1.00], [0.96, 0.76, 0.38]];
    }
  }

  function createInstance(host, index) {
    const canvas = document.createElement("canvas");

    canvas.setAttribute("data-compass-crystal-canvas", "true");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    host.appendChild(canvas);

    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: true,
        stencil: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false
      }) ||
      canvas.getContext("experimental-webgl");

    if (!gl) {
      host.dataset.compassCrystalWebgl = "false";
      throw new Error("WebGL unavailable.");
    }

    const kind = host.getAttribute("data-compass-crystal") || "room";
    const geometry = createCrystalGeometry(kind);
    const program = createProgram(gl);

    const instance = {
      index,
      host,
      canvas,
      gl,
      kind,
      role: host.getAttribute("data-compass-crystal-role") || "",
      phase: index * 0.74,
      focus: 0,
      fade: 0,
      width: 0,
      height: 0,
      pixelWidth: 0,
      pixelHeight: 0,
      dpr: 1,
      program,
      geometry,
      positionBuffer: createBuffer(gl, geometry.positions),
      normalBuffer: createBuffer(gl, geometry.normals),
      locations: {
        position: gl.getAttribLocation(program, "a_position"),
        normal: gl.getAttribLocation(program, "a_normal"),
        matrix: gl.getUniformLocation(program, "u_matrix"),
        normalMatrix: gl.getUniformLocation(program, "u_normalMatrix"),
        base: gl.getUniformLocation(program, "u_base"),
        secondary: gl.getUniformLocation(program, "u_secondary"),
        time: gl.getUniformLocation(program, "u_time"),
        focus: gl.getUniformLocation(program, "u_focus"),
        fade: gl.getUniformLocation(program, "u_fade")
      }
    };

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    host.dataset.compassCrystalWebgl = "true";

    return instance;
  }

  function resizeInstance(instance) {
    const rect = instance.host.getBoundingClientRect();

    instance.width = Math.max(1, Math.floor(rect.width));
    instance.height = Math.max(1, Math.floor(rect.height));
    instance.dpr = clamp(window.devicePixelRatio || 1, 1, MAX_DPR);
    instance.pixelWidth = Math.max(1, Math.floor(instance.width * instance.dpr));
    instance.pixelHeight = Math.max(1, Math.floor(instance.height * instance.dpr));

    if (
      instance.canvas.width !== instance.pixelWidth ||
      instance.canvas.height !== instance.pixelHeight
    ) {
      instance.canvas.width = instance.pixelWidth;
      instance.canvas.height = instance.pixelHeight;
    }

    instance.gl.viewport(0, 0, instance.pixelWidth, instance.pixelHeight);
  }

  function readVisualState(instance) {
    const selfSelected = instance.host.dataset.compassSelected === "true";
    const selfFaded = instance.host.dataset.compassFaded === "true";

    const parentSelected = Boolean(instance.host.closest("[data-compass-selected='true']"));
    const parentFaded = Boolean(instance.host.closest("[data-compass-faded='true']"));

    return {
      selected: selfSelected || parentSelected,
      faded: selfFaded || parentFaded
    };
  }

  function drawInstance(instance, time) {
    const gl = instance.gl;
    const visual = readVisualState(instance);
    const aspect = instance.pixelWidth / Math.max(1, instance.pixelHeight);

    instance.focus += ((visual.selected ? 1 : 0) - instance.focus) * 0.08;
    instance.fade += ((visual.faded ? 1 : 0) - instance.fade) * 0.08;

    const motion = state.reducedMotion ? 0 : time * 0.00018;
    const scale = instance.kind === "mirrorland" ? 1.10 : instance.kind === "room" ? 0.86 : 1.0;

    const projection = perspective4(Math.PI / 4.3, aspect, 0.1, 20);
    const view = translate4(0, 0, -4.15);
    const rotY = rotateY4(motion + instance.phase);
    const rotX = rotateX4(-0.22 + Math.sin(motion + instance.phase) * 0.06);
    const model = multiply4(scale4(scale, scale * 1.08, scale), multiply4(rotY, rotX));
    const matrix = multiply4(projection, multiply4(view, model));
    const normalMatrix = normal3From4(model);
    const palette = colors(instance.kind);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(instance.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, instance.positionBuffer);
    gl.enableVertexAttribArray(instance.locations.position);
    gl.vertexAttribPointer(instance.locations.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, instance.normalBuffer);
    gl.enableVertexAttribArray(instance.locations.normal);
    gl.vertexAttribPointer(instance.locations.normal, 3, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(instance.locations.matrix, false, matrix);
    gl.uniformMatrix3fv(instance.locations.normalMatrix, false, normalMatrix);
    gl.uniform3fv(instance.locations.base, palette[0]);
    gl.uniform3fv(instance.locations.secondary, palette[1]);
    gl.uniform1f(instance.locations.time, time + instance.phase * 1000);
    gl.uniform1f(instance.locations.focus, instance.focus);
    gl.uniform1f(instance.locations.fade, instance.fade);

    gl.drawArrays(gl.TRIANGLES, 0, instance.geometry.count);

    state.drawCount += 1;
  }

  function frame(time) {
    state.raf = 0;

    if (!state.running) return;

    state.instances.forEach((instance) => {
      resizeInstance(instance);
      drawInstance(instance, time);
    });

    state.frameCount += 1;
    state.firstFrameDrawn = true;
    state.lastAction = "frame";

    if (!state.reducedMotion) {
      state.raf = window.requestAnimationFrame(frame);
    }

    publish();
  }

  function start() {
    if (state.running || !state.instances.length) return false;

    state.running = true;
    state.lastAction = "started";

    state.raf = window.requestAnimationFrame(frame);
    publish();

    return true;
  }

  function stop() {
    state.running = false;

    if (state.raf) {
      window.cancelAnimationFrame(state.raf);
      state.raf = 0;
    }

    state.lastAction = "stopped";
    publish();

    return true;
  }

  function destroy() {
    stop();

    state.instances.forEach((instance) => {
      try {
        instance.gl.deleteBuffer(instance.positionBuffer);
        instance.gl.deleteBuffer(instance.normalBuffer);
        instance.gl.deleteProgram(instance.program);
      } catch (_error) {}

      if (instance.canvas && instance.canvas.parentNode) {
        instance.canvas.parentNode.removeChild(instance.canvas);
      }
    });

    state.instances = [];
    state.mounted = false;
    state.hostCount = 0;
    state.webGLCount = 0;
    state.lastAction = "destroyed";

    publish();

    return true;
  }

  function mount() {
    if (state.mounted) return getStatus();

    state.reducedMotion = prefersReducedMotion();
    state.instances = [];
    state.errors = [];

    const hosts = Array.from(document.querySelectorAll(HOST_SELECTOR));
    state.hostCount = hosts.length;

    hosts.forEach((host, index) => {
      try {
        state.instances.push(createInstance(host, index));
      } catch (error) {
        recordError("createInstance", error);
      }
    });

    state.webGLCount = state.instances.length;
    state.mounted = true;
    state.lastAction = "mounted";

    document.documentElement.dataset.compassCrystalsContract = CONTRACT;
    document.documentElement.dataset.compassCrystalsLoaded = "true";
    document.documentElement.dataset.compassCrystalsWebglCount = String(state.webGLCount);

    start();
    publish();

    return getStatus();
  }

  function publish() {
    state.updatedAt = now();

    const status = getStatus();

    window.DGB_COMPASS_CRYSTALS_STATUS = status;
    window.DGB_COMPASS_CRYSTALS_RECEIPT = getReceiptLight();

    document.documentElement.dataset.compassCrystalsMounted = String(status.mounted);
    document.documentElement.dataset.compassCrystalsRunning = String(status.running);
    document.documentElement.dataset.compassCrystalsFirstFrame = String(status.firstFrameDrawn);
    document.documentElement.dataset.compassCrystalsErrorCount = String(status.errorCount);

    return status;
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      globalName: GLOBAL,
      mounted: state.mounted,
      running: state.running,
      reducedMotion: state.reducedMotion,
      hostCount: state.hostCount,
      webGLCount: state.webGLCount,
      frameCount: state.frameCount,
      drawCount: state.drawCount,
      firstFrameDrawn: state.firstFrameDrawn,
      errorCount: state.errorCount,
      lastAction: state.lastAction,
      updatedAt: state.updatedAt,
      htmlOwnsCopy: true,
      cssOwnsPresentation: true,
      controllerOwnsBehavior: true,
      crystalsOwnVisualization: true,
      diagnosticChamber: false,
      canvas2DFallback: false,
      visualPassClaimed: false
    };
  }

  function getReceiptLight() {
    const status = getStatus();

    return {
      contract: CONTRACT,
      file: FILE,
      status: status.webGLCount > 0 ? "READY" : "HELD",
      mounted: status.mounted,
      running: status.running,
      hostCount: status.hostCount,
      webGLCount: status.webGLCount,
      firstFrameDrawn: status.firstFrameDrawn,
      errorCount: status.errorCount,
      updatedAt: status.updatedAt,
      visualPassClaimed: false
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      statusDetail: getStatus(),
      errors: state.errors.slice(),
      generatedAt: now()
    };
  }

  const API = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    file: FILE,
    mount,
    start,
    stop,
    destroy,
    getStatus,
    getReceiptLight,
    getReceipt,
    publishGlobals: publish
  });

  window[GLOBAL] = API;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
