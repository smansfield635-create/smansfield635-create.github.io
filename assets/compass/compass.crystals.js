// /assets/compass/compass.crystals.js
// DGB_COMPASS_CRYSTALS_3D_RUNTIME_TNT_v1
// FULL-FILE
// Owns: WebGL crystal rendering, objects, lighting, motion, resize, reduced motion, status/receipts.
// Does not own: Compass authority, routes, page layout, CSS, diagnostics, visual-pass claims.

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "DGB_COMPASS_CRYSTALS_3D_RUNTIME_TNT_v1";
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
    errorCount: 0,
    firstFrameDrawn: false,
    activeWing: "",
    activeRoom: "",
    lastAction: "loaded",
    updatedAt: iso(),
    instances: [],
    raf: 0,
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

    void main(void) {
      vec3 n = normalize(v_normal);
      vec3 light = normalize(vec3(-0.45, 0.72, 0.54));
      vec3 fill = normalize(vec3(0.58, -0.20, 0.42));

      float key = max(dot(n, light), 0.0);
      float soft = max(dot(n, fill), 0.0) * 0.34;
      float rim = pow(1.0 - max(abs(n.z), 0.0), 2.2);
      float inner = 0.46 + 0.18 * sin(u_time * 0.0012 + v_position.y * 5.0);

      vec3 color = mix(u_base, u_secondary, key * 0.68 + rim * 0.32);
      color += vec3(1.0, 0.88, 0.55) * rim * 0.20;
      color += vec3(0.32, 0.68, 1.0) * soft * 0.18;
      color *= inner + key * 0.50 + u_focus * 0.16;

      float alpha = 0.72 + rim * 0.16 + u_focus * 0.06;

      gl_FragColor = vec4(color, alpha);
    }
  `;

  function iso() {
    return new Date().toISOString();
  }

  function fail(scope, error) {
    state.errorCount += 1;
    state.errors.push({
      scope,
      message: error && error.message ? error.message : String(error),
      at: iso()
    });

    if (state.errors.length > 20) state.errors.shift();
    state.lastAction = "error:" + scope;
    publish();
  }

  function number(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, number(value, min)));
  }

  function prefersReducedMotion() {
    return Boolean(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
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
    const o = new Float32Array(16);

    for (let c = 0; c < 4; c += 1) {
      for (let r = 0; r < 4; r += 1) {
        o[c * 4 + r] =
          a[r] * b[c * 4] +
          a[4 + r] * b[c * 4 + 1] +
          a[8 + r] * b[c * 4 + 2] +
          a[12 + r] * b[c * 4 + 3];
      }
    }

    return o;
  }

  function mat4Perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);

    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * nf, -1,
      0, 0, 2 * near * far * nf, 0
    ]);
  }

  function mat4Translate(x, y, z) {
    const m = mat4Identity();
    m[12] = x;
    m[13] = y;
    m[14] = z;
    return m;
  }

  function mat4RotateX(a) {
    const c = Math.cos(a);
    const s = Math.sin(a);

    return new Float32Array([
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ]);
  }

  function mat4RotateY(a) {
    const c = Math.cos(a);
    const s = Math.sin(a);

    return new Float32Array([
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ]);
  }

  function mat4Scale(x, y, z) {
    return new Float32Array([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    ]);
  }

  function mat3FromMat4(m) {
    return new Float32Array([
      m[0], m[1], m[2],
      m[4], m[5], m[6],
      m[8], m[9], m[10]
    ]);
  }

  function createGeometry() {
    const vertices = [
      [0, 1.08, 0],
      [-0.52, 0.32, 0.52],
      [0.52, 0.32, 0.52],
      [0.66, 0.22, 0],
      [0.52, 0.32, -0.52],
      [-0.52, 0.32, -0.52],
      [-0.66, 0.22, 0],
      [0, -1.02, 0]
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

    for (const face of faces) {
      const a = vertices[face[0]];
      const b = vertices[face[1]];
      const c = vertices[face[2]];
      const normal = faceNormal(a, b, c);

      for (const index of face) {
        positions.push(vertices[index][0], vertices[index][1], vertices[index][2]);
        normals.push(normal[0], normal[1], normal[2]);
      }
    }

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      count: positions.length / 3
    };
  }

  function faceNormal(a, b, c) {
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

  function buffer(gl, data) {
    const item = gl.createBuffer();

    if (!item) throw new Error("Buffer allocation failed.");

    gl.bindBuffer(gl.ARRAY_BUFFER, item);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return item;
  }

  function colorForKind(kind) {
    switch (kind) {
      case "north":
        return [[0.95, 0.78, 0.36], [0.56, 0.84, 1.0]];
      case "east":
        return [[0.42, 0.78, 1.0], [0.94, 0.78, 0.36]];
      case "south":
        return [[0.50, 0.95, 0.74], [0.98, 0.70, 0.36]];
      case "west":
        return [[0.98, 0.62, 0.30], [0.48, 0.70, 1.0]];
      case "mirrorland":
        return [[0.86, 0.78, 1.0], [0.98, 0.78, 0.36]];
      default:
        return [[0.72, 0.86, 1.0], [0.98, 0.78, 0.36]];
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

    const geometry = createGeometry();
    const program = createProgram(gl);

    const instance = {
      index,
      host,
      canvas,
      gl,
      program,
      geometry,
      position: buffer(gl, geometry.positions),
      normal: buffer(gl, geometry.normals),
      width: 0,
      height: 0,
      pixelWidth: 0,
      pixelHeight: 0,
      dpr: 1,
      kind: host.getAttribute("data-compass-crystal") || "room",
      role: host.getAttribute("data-compass-crystal-role") || "",
      focus: 0,
      visible: true,
      phase: index * 0.73,
      locations: {
        position: gl.getAttribLocation(program, "a_position"),
        normal: gl.getAttribLocation(program, "a_normal"),
        matrix: gl.getUniformLocation(program, "u_matrix"),
        normalMatrix: gl.getUniformLocation(program, "u_normalMatrix"),
        base: gl.getUniformLocation(program, "u_base"),
        secondary: gl.getUniformLocation(program, "u_secondary"),
        time: gl.getUniformLocation(program, "u_time"),
        focus: gl.getUniformLocation(program, "u_focus")
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

  function drawInstance(instance, time) {
    const gl = instance.gl;
    const aspect = instance.pixelWidth / Math.max(1, instance.pixelHeight);
    const selected =
      instance.host.dataset.compassSelected === "true" ||
      instance.host.closest("[data-compass-selected='true']");

    const faded =
      instance.host.dataset.compassFaded === "true" ||
      instance.host.closest("[data-compass-faded='true']");

    instance.focus += ((selected ? 1 : 0) - instance.focus) * 0.08;

    const motion = state.reducedMotion ? 0 : time * 0.00022;
    const scale = selected ? 1.12 : faded ? 0.92 : 1.0;

    const projection = mat4Perspective(Math.PI / 4.2, aspect, 0.1, 20);
    const view = mat4Translate(0, 0, -4.1);
    const rotationY = mat4RotateY(motion + instance.phase);
    const rotationX = mat4RotateX(-0.22 + Math.sin(motion + instance.phase) * 0.08);
    const model = mat4Multiply(
      mat4Scale(scale, scale * 1.08, scale),
      mat4Multiply(rotationY, rotationX)
    );

    const matrix = mat4Multiply(projection, mat4Multiply(view, model));
    const normalMatrix = mat3FromMat4(model);
    const colors = colorForKind(instance.kind);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(instance.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, instance.position);
    gl.enableVertexAttribArray(instance.locations.position);
    gl.vertexAttribPointer(instance.locations.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, instance.normal);
    gl.enableVertexAttribArray(instance.locations.normal);
    gl.vertexAttribPointer(instance.locations.normal, 3, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(instance.locations.matrix, false, matrix);
    gl.uniformMatrix3fv(instance.locations.normalMatrix, false, normalMatrix);
    gl.uniform3fv(instance.locations.base, colors[0]);
    gl.uniform3fv(instance.locations.secondary, colors[1]);
    gl.uniform1f(instance.locations.time, time + instance.phase * 1000);
    gl.uniform1f(instance.locations.focus, instance.focus);

    gl.drawArrays(gl.TRIANGLES, 0, instance.geometry.count);

    state.drawCount += 1;
  }

  function frame(time) {
    state.raf = 0;

    if (!state.running) return;

    for (const instance of state.instances) {
      resizeInstance(instance);
      drawInstance(instance, time);
    }

    state.frameCount += 1;
    state.firstFrameDrawn = true;
    state.lastAction = "frame";

    if (!state.reducedMotion) {
      state.raf = window.requestAnimationFrame(frame);
    } else {
      publish();
    }
  }

  function start() {
    if (state.running || !state.instances.length) return false;

    state.running = true;
    state.lastAction = "started";

    if (window.requestAnimationFrame) {
      state.raf = window.requestAnimationFrame(frame);
    }

    publish();
    return true;
  }

  function stop() {
    state.running = false;

    if (state.raf && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(state.raf);
    }

    state.raf = 0;
    state.lastAction = "stopped";
    publish();
    return true;
  }

  function destroy() {
    stop();

    for (const instance of state.instances) {
      try {
        instance.gl.deleteBuffer(instance.position);
        instance.gl.deleteBuffer(instance.normal);
        instance.gl.deleteProgram(instance.program);
      } catch (_error) {}

      if (instance.canvas && instance.canvas.parentNode) {
        instance.canvas.parentNode.removeChild(instance.canvas);
      }
    }

    state.instances = [];
    state.mounted = false;
    state.hostCount = 0;
    state.webGLCount = 0;
    state.lastAction = "destroyed";
    publish();
    return true;
  }

  function readControllerState() {
    const controller = window.DGBCompassController;

    if (!controller || typeof controller.getStatus !== "function") return;

    try {
      const status = controller.getStatus();
      state.activeWing = status.activeWing || "";
      state.activeRoom = status.activeRoom || "";
    } catch (_error) {}
  }

  function handleControllerState(event) {
    const detail = event && event.detail ? event.detail : {};
    state.activeWing = detail.activeWing || state.activeWing || "";
    state.activeRoom = detail.activeRoom || state.activeRoom || "";
    state.lastAction = "controller-state";
    publish();
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
        fail("CREATE_CRYSTAL_INSTANCE", error);
      }
    });

    state.webGLCount = state.instances.length;
    state.mounted = true;
    state.lastAction = "mounted";

    document.documentElement.dataset.compassCrystalsLoaded = "true";
    document.documentElement.dataset.compassCrystalsContract = CONTRACT;
    document.documentElement.dataset.compassCrystalsWebglCount = String(state.webGLCount);

    readControllerState();
    window.addEventListener("dgb-compass-controller-state", handleControllerState);

    if (window.matchMedia) {
      try {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handler = () => {
          state.reducedMotion = prefersReducedMotion();
          if (!state.reducedMotion) start();
          publish();
        };

        if (query.addEventListener) query.addEventListener("change", handler);
      } catch (_error) {}
    }

    start();
    publish();

    return getStatus();
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      file: FILE,
      globalName: GLOBAL,
      mounted: state.mounted,
      running: state.running,
      reducedMotion: state.reducedMotion,
      hostCount: state.hostCount,
      webGLCount: state.webGLCount,
      frameCount: state.frameCount,
      drawCount: state.drawCount,
      errorCount: state.errorCount,
      firstFrameDrawn: state.firstFrameDrawn,
      activeWing: state.activeWing,
      activeRoom: state.activeRoom,
      lastAction: state.lastAction,
      updatedAt: state.updatedAt,
      canvas2DFallback: false,
      diagnosticChamber: false,
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
      visualPassClaimed: false,
      updatedAt: status.updatedAt
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      statusDetail: getStatus(),
      errors: state.errors.slice(),
      generatedAt: iso()
    };
  }

  function publish() {
    state.updatedAt = iso();

    const status = getStatus();

    window.DGB_COMPASS_CRYSTALS_STATUS = status;
    window.DGB_COMPASS_CRYSTALS_RECEIPT = getReceiptLight();

    try {
      document.documentElement.dataset.compassCrystalsMounted = String(status.mounted);
      document.documentElement.dataset.compassCrystalsRunning = String(status.running);
      document.documentElement.dataset.compassCrystalsFirstFrame = String(status.firstFrameDrawn);
      document.documentElement.dataset.compassCrystalsErrorCount = String(status.errorCount);
    } catch (_error) {}

    return status;
  }

  const API = Object.freeze({
    contract: CONTRACT,
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
