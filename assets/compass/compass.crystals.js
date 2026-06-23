// /assets/compass/compass.crystals.js
// DGB_COMPASS_CRYSTALS_3D_RUNTIME_TNT_v1
// Single-file WebGL crystal ornament runtime.
// No Canvas2D fallback. No visual-pass claim.

(function installCompassCrystals(global, document) {
  "use strict";

  var CONTRACT = "DGB_COMPASS_CRYSTALS_3D_RUNTIME_TNT_v1";
  var VERSION = "1.0.0";
  var FILE = "/assets/compass/compass.crystals.js";
  var API_NAME = "DGBCompassCrystals";

  var HOST_SELECTOR = "[data-compass-crystal]";
  var MAX_DPR = 2;

  var VERTEX_SOURCE =
    "precision highp float;" +
    "attribute vec3 a_position;" +
    "attribute vec3 a_normal;" +
    "attribute vec3 a_color;" +
    "uniform mat4 u_matrix;" +
    "uniform mat3 u_normalMatrix;" +
    "varying vec3 v_normal;" +
    "varying vec3 v_color;" +
    "void main(void){" +
    "v_normal=normalize(u_normalMatrix*a_normal);" +
    "v_color=a_color;" +
    "gl_Position=u_matrix*vec4(a_position,1.0);" +
    "}";

  var FRAGMENT_SOURCE =
    "precision highp float;" +
    "varying vec3 v_normal;" +
    "varying vec3 v_color;" +
    "void main(void){" +
    "vec3 n=normalize(v_normal);" +
    "vec3 l=normalize(vec3(-0.45,0.72,0.52));" +
    "vec3 f=normalize(vec3(0.62,0.18,0.72));" +
    "float key=max(dot(n,l),0.0);" +
    "float fill=max(dot(n,f),0.0);" +
    "float rim=pow(1.0-abs(n.z),2.4);" +
    "vec3 c=v_color*(0.30+key*0.82+fill*0.25)+vec3(0.65,0.82,1.0)*rim*0.28;" +
    "gl_FragColor=vec4(c,0.86);" +
    "}";

  var state = {
    contract: CONTRACT,
    version: VERSION,
    file: FILE,
    installedAt: now(),
    initialized: false,
    running: false,
    reducedMotion: false,
    webGLActive: false,
    hostCount: 0,
    mountedCount: 0,
    drawCount: 0,
    errorCount: 0,
    errors: [],
    instances: [],
    frameId: 0,
    visualPassClaimed: false
  };

  function now() {
    try { return new Date().toISOString(); } catch (_error) { return null; }
  }

  function isFn(value) {
    return typeof value === "function";
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || min));
  }

  function recordError(scope, error) {
    state.errorCount += 1;
    state.errors.push({
      scope: scope,
      message: error && error.message ? error.message : String(error || "UNKNOWN_ERROR"),
      at: now()
    });
    if (state.errors.length > 21) state.errors.shift();
  }

  function reducedMotion() {
    try {
      return Boolean(
        global.matchMedia &&
        global.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch (_error) {
      return false;
    }
  }

  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var message = gl.getShaderInfoLog(shader) || "Shader compile failed.";
      gl.deleteShader(shader);
      throw new Error(message);
    }

    return shader;
  }

  function createProgram(gl) {
    var vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SOURCE);
    var fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SOURCE);
    var program = gl.createProgram();

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var message = gl.getProgramInfoLog(program) || "Program link failed.";
      gl.deleteProgram(program);
      throw new Error(message);
    }

    return program;
  }

  function normalize(v) {
    var d = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / d, v[1] / d, v[2] / d];
  }

  function faceNormal(a, b, c) {
    var ux = b[0] - a[0];
    var uy = b[1] - a[1];
    var uz = b[2] - a[2];
    var vx = c[0] - a[0];
    var vy = c[1] - a[1];
    var vz = c[2] - a[2];

    return normalize([
      uy * vz - uz * vy,
      uz * vx - ux * vz,
      ux * vy - uy * vx
    ]);
  }

  function makeGeometry(kind) {
    var top = [0, 0.92, 0];
    var table = [
      [-0.34, 0.36, 0.34],
      [0.34, 0.36, 0.34],
      [0.48, 0.22, 0],
      [0.34, 0.36, -0.34],
      [-0.34, 0.36, -0.34],
      [-0.48, 0.22, 0]
    ];
    var girdle = [
      [-0.70, -0.08, 0.42],
      [0, -0.16, 0.62],
      [0.70, -0.08, 0.42],
      [0.72, -0.10, -0.40],
      [0, -0.16, -0.62],
      [-0.72, -0.10, -0.40]
    ];
    var bottom = [0, -0.94, 0];

    var palette = kind === "mission"
      ? [[0.34, 1.0, 0.72], [0.08, 0.44, 0.36], [1.0, 0.86, 0.38]]
      : kind === "path"
        ? [[0.55, 0.86, 1.0], [0.12, 0.28, 0.78], [1.0, 0.78, 0.30]]
        : [[0.86, 0.96, 1.0], [0.18, 0.46, 1.0], [1.0, 0.82, 0.36]];

    var positions = [];
    var normals = [];
    var colors = [];

    function tri(a, b, c, color) {
      var n = faceNormal(a, b, c);
      [a, b, c].forEach(function (p) {
        positions.push(p[0], p[1], p[2]);
        normals.push(n[0], n[1], n[2]);
        colors.push(color[0], color[1], color[2]);
      });
    }

    for (var i = 0; i < table.length; i += 1) {
      tri(top, table[i], table[(i + 1) % table.length], palette[i % palette.length]);
    }

    for (var j = 0; j < table.length; j += 1) {
      tri(table[j], girdle[j], girdle[(j + 1) % girdle.length], palette[(j + 1) % palette.length]);
      tri(table[j], girdle[(j + 1) % girdle.length], table[(j + 1) % table.length], palette[(j + 2) % palette.length]);
    }

    for (var k = 0; k < girdle.length; k += 1) {
      tri(girdle[k], bottom, girdle[(k + 1) % girdle.length], palette[k % palette.length]);
    }

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      colors: new Float32Array(colors),
      count: positions.length / 3
    };
  }

  function buffer(gl, data) {
    var out = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, out);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return out;
  }

  function m4Identity() {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  function m4Multiply(a, b) {
    var o = new Float32Array(16);
    for (var c = 0; c < 4; c += 1) {
      for (var r = 0; r < 4; r += 1) {
        o[c * 4 + r] =
          a[r] * b[c * 4] +
          a[4 + r] * b[c * 4 + 1] +
          a[8 + r] * b[c * 4 + 2] +
          a[12 + r] * b[c * 4 + 3];
      }
    }
    return o;
  }

  function m4Perspective(fov, aspect, near, far) {
    var f = 1 / Math.tan(fov / 2);
    var nf = 1 / (near - far);

    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * nf, -1,
      0, 0, 2 * near * far * nf, 0
    ]);
  }

  function m4Translate(x, y, z) {
    var m = m4Identity();
    m[12] = x;
    m[13] = y;
    m[14] = z;
    return m;
  }

  function m4RotateX(a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return new Float32Array([
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ]);
  }

  function m4RotateY(a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return new Float32Array([
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ]);
  }

  function normal3(m) {
    return new Float32Array([
      m[0], m[1], m[2],
      m[4], m[5], m[6],
      m[8], m[9], m[10]
    ]);
  }

  function createCanvas(host) {
    var canvas = document.createElement("canvas");
    canvas.setAttribute("data-compass-crystal-canvas", "true");
    canvas.setAttribute("aria-hidden", "true");
    canvas.tabIndex = -1;
    host.appendChild(canvas);
    return canvas;
  }

  function createInstance(host, index) {
    var kind = host.getAttribute("data-compass-crystal") || "house";
    var canvas = createCanvas(host);
    var gl = null;

    try {
      gl =
        canvas.getContext("webgl", {
          alpha: true,
          antialias: true,
          depth: true,
          stencil: false,
          premultipliedAlpha: true,
          preserveDrawingBuffer: false
        }) ||
        canvas.getContext("experimental-webgl");
    } catch (_error) {
      gl = null;
    }

    if (!gl) {
      host.setAttribute("data-compass-crystal-state", "webgl-unavailable");
      return null;
    }

    try {
      var program = createProgram(gl);
      var geometry = makeGeometry(kind);
      var instance = {
        host: host,
        canvas: canvas,
        gl: gl,
        kind: kind,
        index: index,
        program: program,
        geometry: geometry,
        buffers: {
          position: buffer(gl, geometry.positions),
          normal: buffer(gl, geometry.normals),
          color: buffer(gl, geometry.colors)
        },
        locations: {
          position: gl.getAttribLocation(program, "a_position"),
          normal: gl.getAttribLocation(program, "a_normal"),
          color: gl.getAttribLocation(program, "a_color"),
          matrix: gl.getUniformLocation(program, "u_matrix"),
          normalMatrix: gl.getUniformLocation(program, "u_normalMatrix")
        },
        width: 0,
        height: 0,
        pixelWidth: 0,
        pixelHeight: 0,
        mounted: true,
        drawCount: 0
      };

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      gl.clearColor(0, 0, 0, 0);

      host.setAttribute("data-compass-crystal-state", "mounted");

      return instance;
    } catch (error) {
      recordError("CREATE_INSTANCE", error);
      host.setAttribute("data-compass-crystal-state", "error");
      return null;
    }
  }

  function resizeInstance(instance) {
    var rect = instance.host.getBoundingClientRect();
    var width = Math.max(1, Math.floor(rect.width));
    var height = Math.max(1, Math.floor(rect.height));
    var dpr = clamp(global.devicePixelRatio || 1, 1, MAX_DPR);

    instance.width = width;
    instance.height = height;
    instance.pixelWidth = Math.max(1, Math.floor(width * dpr));
    instance.pixelHeight = Math.max(1, Math.floor(height * dpr));

    if (
      instance.canvas.width !== instance.pixelWidth ||
      instance.canvas.height !== instance.pixelHeight
    ) {
      instance.canvas.width = instance.pixelWidth;
      instance.canvas.height = instance.pixelHeight;
    }

    instance.canvas.style.width = "100%";
    instance.canvas.style.height = "100%";
  }

  function bindAttribute(gl, location, bufferObject) {
    if (location < 0) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferObject);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
  }

  function drawInstance(instance, time) {
    var gl = instance.gl;
    resizeInstance(instance);

    var aspect = instance.pixelWidth / Math.max(1, instance.pixelHeight);
    var speed = state.reducedMotion ? 0 : 0.00034;
    var angle = time * speed + instance.index * 0.78;

    var projection = m4Perspective(34 * Math.PI / 180, aspect, 0.1, 10);
    var view = m4Translate(0, 0, -3.25);
    var model = m4Multiply(m4RotateX(-0.22), m4RotateY(angle));
    var matrix = m4Multiply(projection, m4Multiply(view, model));

    gl.viewport(0, 0, instance.pixelWidth, instance.pixelHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(instance.program);

    bindAttribute(gl, instance.locations.position, instance.buffers.position);
    bindAttribute(gl, instance.locations.normal, instance.buffers.normal);
    bindAttribute(gl, instance.locations.color, instance.buffers.color);

    gl.uniformMatrix4fv(instance.locations.matrix, false, matrix);
    gl.uniformMatrix3fv(instance.locations.normalMatrix, false, normal3(model));

    gl.drawArrays(gl.TRIANGLES, 0, instance.geometry.count);

    instance.drawCount += 1;
    state.drawCount += 1;
  }

  function frame(time) {
    state.frameId = 0;

    if (!state.running) return;

    for (var i = 0; i < state.instances.length; i += 1) {
      try {
        drawInstance(state.instances[i], time || 0);
      } catch (error) {
        recordError("DRAW_INSTANCE", error);
      }
    }

    if (global.requestAnimationFrame) {
      state.frameId = global.requestAnimationFrame(frame);
    }
  }

  function start() {
    if (state.running || !state.instances.length) return false;
    state.running = true;
    state.frameId = global.requestAnimationFrame ? global.requestAnimationFrame(frame) : 0;
    return true;
  }

  function stop() {
    state.running = false;
    if (state.frameId && global.cancelAnimationFrame) {
      global.cancelAnimationFrame(state.frameId);
    }
    state.frameId = 0;
  }

  function destroy() {
    stop();

    state.instances.forEach(function (instance) {
      try {
        var gl = instance.gl;
        gl.deleteBuffer(instance.buffers.position);
        gl.deleteBuffer(instance.buffers.normal);
        gl.deleteBuffer(instance.buffers.color);
        gl.deleteProgram(instance.program);
        if (instance.canvas && instance.canvas.parentNode) {
          instance.canvas.parentNode.removeChild(instance.canvas);
        }
        instance.host.removeAttribute("data-compass-crystal-state");
      } catch (error) {
        recordError("DESTROY_INSTANCE", error);
      }
    });

    state.instances = [];
    state.mountedCount = 0;
    state.webGLActive = false;

    document.documentElement.removeAttribute("data-compass-crystals-webgl");
    document.documentElement.removeAttribute("data-compass-crystals-runtime-loaded");

    publish();
    return true;
  }

  function init() {
    if (state.initialized || !document) return;

    state.reducedMotion = reducedMotion();

    var hosts = Array.prototype.slice.call(document.querySelectorAll(HOST_SELECTOR));
    state.hostCount = hosts.length;

    hosts.forEach(function (host, index) {
      var instance = createInstance(host, index);
      if (instance) state.instances.push(instance);
    });

    state.mountedCount = state.instances.length;
    state.webGLActive = state.mountedCount > 0;
    state.initialized = true;

    document.documentElement.setAttribute("data-compass-crystals-runtime-loaded", "true");

    if (state.webGLActive) {
      document.documentElement.setAttribute("data-compass-crystals-webgl", "true");
    }

    try {
      if (global.matchMedia) {
        var query = global.matchMedia("(prefers-reduced-motion: reduce)");
        if (query && query.addEventListener) {
          query.addEventListener("change", function (event) {
            state.reducedMotion = Boolean(event.matches);
            publish();
          });
        }
      }
    } catch (_error) {}

    start();
    publish();
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      initialized: state.initialized,
      running: state.running,
      reducedMotion: state.reducedMotion,
      hostCount: state.hostCount,
      mountedCount: state.mountedCount,
      webGLActive: state.webGLActive,
      drawCount: state.drawCount,
      errorCount: state.errorCount,
      visualPassClaimed: false
    };
  }

  function getReceiptLight() {
    var status = getStatus();

    return {
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      status: status.webGLActive ? "ACTIVE" : "HELD",
      initialized: status.initialized,
      running: status.running,
      hostCount: status.hostCount,
      mountedCount: status.mountedCount,
      webGLActive: status.webGLActive,
      drawCount: status.drawCount,
      errorCount: status.errorCount,
      visualPassClaimed: false,
      generatedAt: now()
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      status: getStatus(),
      instances: state.instances.map(function (instance) {
        return {
          kind: instance.kind,
          mounted: instance.mounted,
          width: instance.width,
          height: instance.height,
          pixelWidth: instance.pixelWidth,
          pixelHeight: instance.pixelHeight,
          drawCount: instance.drawCount
        };
      }),
      errors: state.errors.slice(),
      noClaims: {
        visualPassClaimed: false,
        diagnosticChamberCreated: false,
        canvas2DFallbackCreated: false
      },
      generatedAt: now()
    };
  }

  function publish() {
    global[API_NAME] = api;
    global.DGB_COMPASS_CRYSTALS_RECEIPT = getReceiptLight();
    return global.DGB_COMPASS_CRYSTALS_RECEIPT;
  }

  var api = {
    CONTRACT: CONTRACT,
    contract: CONTRACT,
    VERSION: VERSION,
    version: VERSION,
    FILE: FILE,
    file: FILE,
    init: init,
    start: start,
    stop: stop,
    destroy: destroy,
    getStatus: getStatus,
    getReceiptLight: getReceiptLight,
    getReceipt: getReceipt,
    visualPassClaimed: false
  };

  publish();

  if (document) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis, typeof document !== "undefined" ? document : null);
