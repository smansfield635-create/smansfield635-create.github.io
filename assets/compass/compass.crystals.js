// /assets/compass/compass.crystals.js
// DGB_COMPASS_GENERATION_ONE_CRYSTALS_TNT_v1
// FULL-FILE

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "DGB_COMPASS_GENERATION_ONE_CRYSTALS_TNT_v1";
  const GLOBAL = "DGBCompassCrystals";

  const state = {
    mounted: false,
    running: false,
    webglAvailable: false,
    canvasCreated: false,
    singleCanvas: true,
    perObjectCanvas: false,
    reducedMotion: false,
    objectCount: 0,
    visibleObjectCount: 0,
    frameCount: 0,
    errorCount: 0,
    lastAction: "loaded",
    updatedAt: stamp(),
    raf: 0,
    canvas: null,
    gl: null,
    program: null,
    buffers: null,
    locations: null,
    stage: null
  };

  const VERTEX = `
    precision highp float;

    attribute vec2 a_position;

    uniform vec2 u_resolution;
    uniform vec2 u_center;
    uniform float u_size;
    uniform float u_rotation;

    varying vec2 v_local;

    void main(){
      float c = cos(u_rotation);
      float s = sin(u_rotation);

      vec2 local = a_position * u_size;
      vec2 rotated = vec2(
        local.x * c - local.y * s,
        local.x * s + local.y * c
      );

      vec2 pixel = u_center + rotated;
      vec2 clip = (pixel / u_resolution) * 2.0 - 1.0;

      gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
      v_local = a_position;
    }
  `;

  const FRAGMENT = `
    precision highp float;

    varying vec2 v_local;

    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    uniform float u_alpha;
    uniform float u_selected;
    uniform float u_faded;

    void main(){
      vec2 p = v_local;

      float diamond = abs(p.x) + abs(p.y);
      if (diamond > 1.0) discard;

      float edge = smoothstep(1.0, 0.72, diamond);
      float core = 1.0 - smoothstep(0.0, 0.92, diamond);
      float facet = abs(p.x - p.y);
      float rim = smoothstep(0.70, 1.0, diamond);

      vec3 color = mix(u_colorA, u_colorB, p.y * 0.5 + 0.5);
      color += vec3(1.0, 0.82, 0.45) * rim * 0.32;
      color += vec3(0.55, 0.78, 1.0) * (1.0 - facet) * 0.15;
      color += vec3(1.0) * core * 0.20;

      color *= 0.74 + u_selected * 0.30;
      color *= mix(1.0, 0.35, u_faded);

      float alpha = edge * u_alpha * mix(1.0, 0.34, u_faded);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  function stamp() {
    return new Date().toISOString();
  }

  function one(selector, root = document) {
    return root.querySelector(selector);
  }

  function all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function prefersReducedMotion() {
    return Boolean(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function recordError(error) {
    state.errorCount += 1;
    state.lastAction = "error";
    state.lastError = error && error.message ? error.message : String(error);
    publish();
  }

  function shader(gl, type, source) {
    const item = gl.createShader(type);
    if (!item) throw new Error("Shader allocation failed.");

    gl.shaderSource(item, source);
    gl.compileShader(item);

    if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(item) || "Shader compile failed.";
      gl.deleteShader(item);
      throw new Error(message);
    }

    return item;
  }

  function program(gl) {
    const vertex = shader(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = shader(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const item = gl.createProgram();

    if (!item) throw new Error("Program allocation failed.");

    gl.attachShader(item, vertex);
    gl.attachShader(item, fragment);
    gl.linkProgram(item);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(item, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(item) || "Program link failed.";
      gl.deleteProgram(item);
      throw new Error(message);
    }

    return item;
  }

  function createCanvas(stage) {
    const canvas = document.createElement("canvas");

    canvas.setAttribute("data-compass-crystal-scene", "true");
    canvas.setAttribute("aria-hidden", "true");

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "1";
    canvas.style.pointerEvents = "none";

    stage.insertBefore(canvas, one(".compass-scene", stage));

    state.canvas = canvas;
    state.canvasCreated = true;

    return canvas;
  }

  function setupGL(canvas) {
    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false
      }) ||
      canvas.getContext("experimental-webgl");

    if (!gl) throw new Error("WebGL unavailable.");

    const activeProgram = program(gl);

    const positions = new Float32Array([
      0, -1,
      0.72, -0.72,
      1, 0,
      0.72, 0.72,
      0, 1,
      -0.72, 0.72,
      -1, 0,
      -0.72, -0.72
    ]);

    const buffer = gl.createBuffer();
    if (!buffer) throw new Error("Buffer allocation failed.");

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    state.gl = gl;
    state.program = activeProgram;
    state.buffers = { position: buffer, count: positions.length / 2 };
    state.locations = {
      position: gl.getAttribLocation(activeProgram, "a_position"),
      resolution: gl.getUniformLocation(activeProgram, "u_resolution"),
      center: gl.getUniformLocation(activeProgram, "u_center"),
      size: gl.getUniformLocation(activeProgram, "u_size"),
      rotation: gl.getUniformLocation(activeProgram, "u_rotation"),
      colorA: gl.getUniformLocation(activeProgram, "u_colorA"),
      colorB: gl.getUniformLocation(activeProgram, "u_colorB"),
      alpha: gl.getUniformLocation(activeProgram, "u_alpha"),
      selected: gl.getUniformLocation(activeProgram, "u_selected"),
      faded: gl.getUniformLocation(activeProgram, "u_faded")
    };

    state.webglAvailable = true;
  }

  function resize() {
    if (!state.canvas || !state.stage || !state.gl) return;

    const rect = state.stage.getBoundingClientRect();
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));

    if (state.canvas.width !== width || state.canvas.height !== height) {
      state.canvas.width = width;
      state.canvas.height = height;
    }

    state.gl.viewport(0, 0, width, height);
  }

  function objectPalette(node) {
    const wing = node.dataset.compassWing || "";
    const type = node.dataset.compassObject || "";

    if (type === "mirrorland") return [[0.92, 0.72, 1.0], [1.0, 0.78, 0.32]];
    if (type === "return") return [[0.78, 0.88, 1.0], [0.92, 0.76, 0.45]];
    if (wing === "north") return [[1.0, 0.78, 0.34], [0.60, 0.86, 1.0]];
    if (wing === "east") return [[0.44, 0.76, 1.0], [0.92, 0.78, 0.38]];
    if (wing === "south") return [[0.52, 0.92, 0.72], [1.0, 0.70, 0.36]];
    if (wing === "west") return [[1.0, 0.58, 0.30], [0.50, 0.68, 1.0]];

    return [[0.72, 0.86, 1.0], [0.96, 0.76, 0.38]];
  }

  function objectScale(node) {
    const type = node.dataset.compassObject || "";
    const centered = node.dataset.compassCentered === "true";
    const selected = node.dataset.compassSelected === "true";

    if (type === "mirrorland") return 0.54;
    if (type === "return") return 0.25;
    if (type === "room") return selected ? 0.34 : 0.29;
    if (centered) return 0.48;

    return 0.40;
  }

  function visibleObjects() {
    const stageRect = state.stage.getBoundingClientRect();

    const objects = all("[data-compass-object]").filter((node) => {
      if (node.hidden) return false;
      if (node.dataset.compassVisible === "false") return false;
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    state.objectCount = all("[data-compass-object]").length;
    state.visibleObjectCount = objects.length;

    return objects.map((node) => {
      const rect = node.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height) * objectScale(node);
      const palette = objectPalette(node);

      return {
        node,
        centerX: rect.left - stageRect.left + rect.width / 2,
        centerY: rect.top - stageRect.top + rect.height / 2,
        size,
        palette,
        selected: node.dataset.compassSelected === "true" ? 1 : 0,
        faded: node.dataset.compassFaded === "true" ? 1 : 0,
        type: node.dataset.compassObject || ""
      };
    });
  }

  function drawObject(item, time) {
    const gl = state.gl;
    const loc = state.locations;

    const rotation =
      state.reducedMotion
        ? 0.785
        : time * 0.00018 + item.centerX * 0.002 + item.centerY * 0.001;

    const alpha = item.type === "return" ? 0.58 : 0.74;

    gl.uniform2f(loc.center, item.centerX, item.centerY);
    gl.uniform1f(loc.size, item.size);
    gl.uniform1f(loc.rotation, rotation);
    gl.uniform3fv(loc.colorA, item.palette[0]);
    gl.uniform3fv(loc.colorB, item.palette[1]);
    gl.uniform1f(loc.alpha, alpha);
    gl.uniform1f(loc.selected, item.selected);
    gl.uniform1f(loc.faded, item.faded);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, state.buffers.count);
  }

  function frame(time) {
    state.raf = 0;
    if (!state.running || !state.gl) return;

    resize();

    const gl = state.gl;
    const loc = state.locations;
    const objects = visibleObjects();

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(state.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, state.buffers.position);
    gl.enableVertexAttribArray(loc.position);
    gl.vertexAttribPointer(loc.position, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(loc.resolution, state.canvas.width, state.canvas.height);

    objects.forEach((item) => drawObject(item, time));

    state.frameCount += 1;
    state.lastAction = "frame";
    publish();

    if (!state.reducedMotion) {
      state.raf = window.requestAnimationFrame(frame);
    }
  }

  function start() {
    if (state.running || !state.webglAvailable) return false;

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

  function mount() {
    if (state.mounted) return getStatus();

    state.reducedMotion = prefersReducedMotion();
    state.stage = one(".compass-stage");

    if (!state.stage) {
      state.mounted = false;
      state.lastAction = "held:no-stage";
      publish();
      return getStatus();
    }

    try {
      const existing = one("[data-compass-crystal-scene]", state.stage);
      state.canvas = existing || createCanvas(state.stage);
      setupGL(state.canvas);
      state.mounted = true;
      state.lastAction = "mounted";
      start();
    } catch (error) {
      recordError(error);
      state.mounted = false;
      state.running = false;
      state.webglAvailable = false;
    }

    publish();
    return getStatus();
  }

  function destroy() {
    stop();

    if (state.gl) {
      try {
        if (state.buffers && state.buffers.position) {
          state.gl.deleteBuffer(state.buffers.position);
        }
        if (state.program) {
          state.gl.deleteProgram(state.program);
        }
      } catch (_error) {}
    }

    if (state.canvas && state.canvas.parentNode) {
      state.canvas.parentNode.removeChild(state.canvas);
    }

    state.canvas = null;
    state.gl = null;
    state.program = null;
    state.buffers = null;
    state.locations = null;
    state.mounted = false;
    state.canvasCreated = false;
    state.webglAvailable = false;
    state.lastAction = "destroyed";

    publish();
    return getStatus();
  }

  function publish() {
    state.updatedAt = stamp();

    const status = getStatus();

    window.DGB_COMPASS_CRYSTALS_STATUS = status;
    window.DGB_COMPASS_CRYSTALS_RECEIPT = getReceiptLight();

    document.documentElement.dataset.compassCrystalsContract = CONTRACT;
    document.documentElement.dataset.compassCrystalsMounted = String(state.mounted);
    document.documentElement.dataset.compassCrystalsRunning = String(state.running);
    document.documentElement.dataset.compassCrystalsWebglAvailable = String(state.webglAvailable);
    document.documentElement.dataset.compassCrystalsSingleCanvas = "true";

    return status;
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      mounted: state.mounted,
      running: state.running,
      webglAvailable: state.webglAvailable,
      canvasCreated: state.canvasCreated,
      objectCount: state.objectCount,
      visibleObjectCount: state.visibleObjectCount,
      frameCount: state.frameCount,
      errorCount: state.errorCount,
      lastAction: state.lastAction,
      updatedAt: state.updatedAt,
      singleCanvas: true,
      perObjectCanvas: false,
      htmlOwnsCopy: true,
      cssOwnsPresentation: true,
      controllerOwnsBehavior: true,
      crystalsOwnVisualization: true,
      canvas2DFallback: false,
      diagnosticChamber: false,
      visualPassClaimed: false
    };
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      status: state.mounted && state.webglAvailable ? "READY" : "HELD",
      running: state.running,
      webglAvailable: state.webglAvailable,
      canvasCreated: state.canvasCreated,
      visibleObjectCount: state.visibleObjectCount,
      frameCount: state.frameCount,
      errorCount: state.errorCount,
      singleCanvas: true,
      perObjectCanvas: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      statusDetail: getStatus(),
      generatedAt: stamp()
    };
  }

  window[GLOBAL] = Object.freeze({
    contract: CONTRACT,
    mount,
    start,
    stop,
    destroy,
    getStatus,
    getReceiptLight,
    getReceipt
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
