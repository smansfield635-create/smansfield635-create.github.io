// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_HTML_JS_PAIR_NEWS_DIAMOND_LATTICE_RUNTIME_ALIGNMENT_TNT_v1
//
// HTML responsibility:
// - public visual expression only.
//
// JS responsibility:
// - under-the-hood mathematics and delivery;
// - expression through delivery of construct.
//
// Purpose:
// - Restore Audralia's lattice object using donor-grade diamond-lattice construction.
// - Preserve NEWS standard: North, East, West, South.
// - Keep route JS as controller/delivery layer, not final NEWS ontology.
// - Keep runtime as preferred carrier source.
// - Keep local diamond lattice as recovery proof, not final runtime authority.
// - No HTML mutation beyond status text. No child math. No runtime rewrite. No visual-pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_HTML_JS_PAIR_NEWS_DIAMOND_LATTICE_RUNTIME_ALIGNMENT_TNT_v1";
  var DONOR_REFERENCE = "SHOWROOM_DIAMOND_G2_CRYSTAL_LATTICE_SEPARATION_MONOCHROME_REFINEMENT_JS_TNT_v1";
  var RUNTIME_PATH = "/assets/audralia/clean/runtime/audralia.true-globe.runtime.js";
  var RUNTIME_CACHE_KEY = "AUDRALIA_NEWS_DIAMOND_LATTICE_RUNTIME_ALIGNMENT_CONSUMER_v1";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;
  var HALF_PI = Math.PI / 2;

  var FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  var FIBONACCI_OFFSETS = Object.freeze([1, 2, 3, 5, 8, 13]);

  var LENS_COPY = Object.freeze({
    planet: {
      title: "Planet View",
      label: "<strong>Planet View</strong> → held carrier · diamond-lattice runtime alignment active",
      copy: "Planet View keeps the carrier held while the diamond-lattice standard governs the under-the-hood proof object. No child terrain, surface, cloud, moisture, datum, or continent math runs from this route."
    },
    lattice: {
      title: "Lattice View",
      label: "<strong>Lattice View</strong> → NEWS diamond-lattice carrier · 16 × 16 / 256 proof object",
      copy: "Lattice View is the thermostat. It renders the diamond-lattice construct while preserving NEWS: North, East, West, and South."
    },
    diagnostic: {
      title: "Diagnostic Scope",
      label: "<strong>Diagnostic Scope</strong> → HTML expresses · JS delivers · NEWS governs",
      copy: "Diagnostic Scope reports compact route, runtime, canvas, loop, NEWS, and 256-seat lattice status without running child math."
    }
  });

  var state = {
    stage: null,
    mount: null,
    canvas: null,
    gl: null,
    cachedDetails: [],

    solidProgram: null,
    lineProgram: null,
    pointProgram: null,

    solidPositionBuffer: null,
    solidColorBuffer: null,
    linePositionBuffer: null,
    lineColorBuffer: null,
    pointPositionBuffer: null,
    pointColorBuffer: null,
    pointSizeBuffer: null,

    width: 0,
    height: 0,
    dpr: 1,
    stageRect: null,

    activeLens: "planet",
    runtime: null,
    runtimeLoaded: false,
    runtimeReady: false,
    runtimePrimary: false,

    seats: [],
    triangles: [],
    ringLines: [],
    spineLines: [],
    fibonacciLines: [],
    fibonacciReturnLines: [],
    points: [],

    geometryBuilt: false,
    canvasReady: false,
    glReady: false,

    yaw: -0.54,
    pitch: -0.18,
    roll: 0.0,
    velocityYaw: 0,
    velocityPitch: 0,
    pointerActive: false,
    pointerId: null,
    pointerX: 0,
    pointerY: 0,
    lastTap: 0,

    raf: 0,
    lastFrameTime: 0,
    renderCount: 0,
    settleFrames: 0,
    stopped: false,

    fallbackActive: true,
    oneCanvas: false,
    oneLoop: false,
    pointerBound: false,
    duplicateCanvasRemoved: 0,

    datasetCache: {},
    lastDiagnosticAt: 0,
    errorCount: 0,
    lastError: ""
  };

  if (
    window.__AUDRALIA_NEWS_DIAMOND_LATTICE_CONTROLLER__ &&
    typeof window.__AUDRALIA_NEWS_DIAMOND_LATTICE_CONTROLLER__.stop === "function"
  ) {
    try {
      window.__AUDRALIA_NEWS_DIAMOND_LATTICE_CONTROLLER__.stop();
    } catch (_error) {}
  }

  var abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
  var signal = abortController ? abortController.signal : undefined;
  var resizeObserver = null;

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : (fallback || 0);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function mixColor(a, b, t) {
    return [
      lerp(a[0], b[0], t),
      lerp(a[1], b[1], t),
      lerp(a[2], b[2], t),
      lerp(a[3], b[3], t)
    ];
  }

  function now() {
    return typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  }

  function normalize3(v) {
    var length = Math.hypot(v.x, v.y, v.z) || 1;
    return { x: v.x / length, y: v.y / length, z: v.z / length };
  }

  function sub3(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  }

  function cross3(a, b) {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    };
  }

  function faceNormal(a, b, c) {
    return normalize3(cross3(sub3(b, a), sub3(c, a)));
  }

  function fibonacciWeight(band) {
    return FIBONACCI_SEQUENCE[band] / FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1];
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    var next = String(value);
    if (node && node.textContent !== next) node.textContent = next;
  }

  function setHtml(selector, value) {
    var node = document.querySelector(selector);
    var next = String(value);
    if (node && node.innerHTML !== next) node.innerHTML = next;
  }

  function setDataset(key, value) {
    var next = String(value);
    if (state.datasetCache[key] === next) return;
    state.datasetCache[key] = next;

    try {
      document.documentElement.dataset[key] = next;
      if (document.body) document.body.dataset[key] = next;
    } catch (_error) {}
  }

  function recordError(scope, error) {
    state.errorCount += 1;
    state.lastError = scope + ": " + (error && error.message ? error.message : String(error || "unknown"));

    window.AUDRALIA_NEWS_DIAMOND_LATTICE_ERROR = {
      contract: CONTRACT,
      scope: scope,
      message: state.lastError,
      errorCount: state.errorCount,
      time: new Date().toISOString()
    };
  }

  function closeCachedMenus() {
    for (var i = 0; i < state.cachedDetails.length; i += 1) {
      try {
        state.cachedDetails[i].open = false;
      } catch (_error) {}
    }
  }

  function roleForBand(band) {
    if (band <= 1) return "north-polar-cap";
    if (band <= 5) return "north-formation";
    if (band <= 9) return "equatorial-carrier";
    if (band <= 13) return "south-grounding";
    return "south-polar-cap";
  }

  function newsForSeat(band, radial) {
    return {
      standard: "NEWS",
      north: "origin/pole/axis/predecessor-authority",
      east: "formation/successor-expression",
      west: "correction/memory/opposite-relation",
      south: "completion/grounding/render-eligibility",
      routeComputedFinalNews: false,
      routePublicizesNewsOnly: true,
      datumDefinesNewsLaw: "expected",
      runtimeProjectsNewsCells: "expected",
      band: band,
      radial: radial
    };
  }

  function createSeat(band, radial) {
    var v = band / Math.max(1, FIBONACCI_BANDS - 1);
    var latitude = HALF_PI - v * Math.PI;
    var fib = FIBONACCI_SEQUENCE[band];
    var fibNorm = fibonacciWeight(band);
    var angle = (radial / RADIAL_NODES) * TAU;

    var radius = Math.cos(latitude);
    var y = Math.sin(latitude);

    var cardinalBoost = radial % 4 === 0 ? 1.018 : radial % 2 === 0 ? 1.006 : 0.992;
    var fibonacciBreath = 1 + (fibNorm - 0.5) * 0.018;
    var adjustedRadius = radius * cardinalBoost * fibonacciBreath;

    var x = Math.cos(angle) * adjustedRadius;
    var z = Math.sin(angle) * adjustedRadius;

    return Object.freeze({
      seatIndex: band * RADIAL_NODES + radial,
      band: band,
      radial: radial,
      fibonacci: fib,
      fibonacciWeight: fibNorm,
      angle: angle,
      latitude: latitude,
      longitude: angle - Math.PI,
      x: x,
      y: y,
      z: z,
      role: roleForBand(band),
      news: newsForSeat(band, radial),
      major: radial % 4 === 0 || band % 4 === 0,
      secondary: radial % 2 === 0 || band % 2 === 0,
      visibilityPriority: radial % 4 === 0 ? 1 : radial % 2 === 0 ? 0.78 : 0.58,
      connectionPriority: radial % 4 === 0 ? 1 : radial % 2 === 0 ? 0.72 : 0.54
    });
  }

  function crystalRoleColor(role, band, alpha) {
    var depth = band / Math.max(1, FIBONACCI_BANDS - 1);
    var a = finite(alpha, 1);

    if (role.indexOf("polar") >= 0) {
      return mixColor([0.92, 0.985, 1.0, 0.58 * a], [0.66, 0.86, 1.0, 0.50 * a], depth);
    }

    if (role.indexOf("formation") >= 0) {
      return mixColor([0.62, 0.90, 1.0, 0.50 * a], [0.26, 0.58, 0.94, 0.48 * a], depth);
    }

    if (role.indexOf("equatorial") >= 0) {
      return [0.18, 0.42, 0.88, 0.44 * a];
    }

    return mixColor([0.30, 0.62, 0.98, 0.48 * a], [0.10, 0.24, 0.68, 0.46 * a], depth);
  }

  function latticeColorForLine(line, alpha) {
    var a = finite(alpha, 1);

    if (line.family === "fibonacci-highlight") return [1.0, 0.84, 0.34, 0.86 * a];
    if (line.family === "fibonacci-return") return [0.82, 0.96, 1.0, 0.36 * a];
    if (line.major) return [1.0, 0.82, 0.30, 0.92 * a];
    if (line.secondary) return [0.62, 0.92, 1.0, 0.64 * a];

    return [0.40, 0.72, 1.0, 0.44 * a];
  }

  function pointColor(point, alpha) {
    var seat = point.seat;
    var a = finite(alpha, 1);

    if (seat.major) return [1.0, 0.82, 0.30, 0.98 * a];
    if (seat.secondary) return [0.70, 0.94, 1.0, 0.82 * a];

    return [0.50, 0.78, 1.0, 0.60 * a];
  }

  function buildGeometry() {
    var rings = [];

    for (var band = 0; band < FIBONACCI_BANDS; band += 1) {
      var ring = [];

      for (var radial = 0; radial < RADIAL_NODES; radial += 1) {
        ring.push(createSeat(band, radial));
      }

      rings.push(Object.freeze(ring));
    }

    function seat(band, radial) {
      return rings[band][((radial % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
    }

    var triangles = [];
    var ringLines = [];
    var spineLines = [];
    var fibonacciLines = [];
    var fibonacciReturnLines = [];
    var points = [];

    function addTriangle(a, b, c) {
      triangles.push({
        a: a,
        b: b,
        c: c,
        normal: faceNormal(a, b, c),
        family: "diamond-cell-facet",
        newsExpected: true,
        routeOwnsNewsMath: false
      });
    }

    function addLine(a, b, family, major, secondary, weight) {
      return {
        a: a,
        b: b,
        family: family,
        major: Boolean(major),
        secondary: Boolean(secondary),
        weight: weight || 1,
        newsExpected: true,
        routeOwnsNewsMath: false
      };
    }

    for (band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        var a = seat(band, radial);
        var b = seat(band, radial + 1);
        var c = seat(band + 1, radial + 1);
        var d = seat(band + 1, radial);

        addTriangle(a, d, c);
        addTriangle(a, c, b);
      }
    }

    for (band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        a = seat(band, radial);
        b = seat(band, radial + 1);

        ringLines.push(addLine(
          a,
          b,
          "fibonacci-band-ring",
          band % 4 === 0 || radial % 4 === 0,
          band % 2 === 0 || radial % 2 === 0,
          band % 4 === 0 ? 1.8 : 1
        ));
      }
    }

    for (radial = 0; radial < RADIAL_NODES; radial += 1) {
      for (band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
        a = seat(band, radial);
        b = seat(band + 1, radial);

        spineLines.push(addLine(
          a,
          b,
          radial % 4 === 0 ? "cardinal-radial-spine" : "radial-spine",
          radial % 4 === 0,
          radial % 2 === 0,
          radial % 4 === 0 ? 1.9 : 1
        ));
      }
    }

    for (band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      var offset = FIBONACCI_OFFSETS[band % FIBONACCI_OFFSETS.length];

      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        a = seat(band, radial);
        b = seat(band + 1, radial + offset);
        var c2 = seat(band + 1, radial - offset);
        var priority = radial % 4 === 0 || band % 4 === 0;

        fibonacciLines.push(addLine(
          a,
          b,
          "fibonacci-highlight",
          priority,
          radial % 2 === 0 || band % 2 === 0,
          priority ? 1.28 : 0.84
        ));

        if (band % 2 === 0) {
          fibonacciReturnLines.push(addLine(
            a,
            c2,
            "fibonacci-return",
            priority,
            radial % 2 === 0 || band % 2 === 0,
            priority ? 0.92 : 0.58
          ));
        }
      }
    }

    for (band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (radial = 0; radial < RADIAL_NODES; radial += 1) {
        var s = seat(band, radial);
        points.push({
          seat: s,
          family: "NEWS-diamond-cell-seat",
          size: s.major ? 8.2 : s.secondary ? 5.9 : 4.4,
          newsExpected: true,
          routeOwnsNewsMath: false
        });
      }
    }

    state.seats = rings.reduce(function (out, ring) {
      return out.concat(ring);
    }, []);
    state.triangles = triangles;
    state.ringLines = ringLines;
    state.spineLines = spineLines;
    state.fibonacciLines = fibonacciLines;
    state.fibonacciReturnLines = fibonacciReturnLines;
    state.points = points;
    state.geometryBuilt = state.seats.length === LATTICE_STATES;
  }

  function rotatePoint(point, orientation) {
    var x = point.x;
    var y = point.y;
    var z = point.z;

    var yaw = finite(orientation.yaw, state.yaw);
    var pitch = finite(orientation.pitch, state.pitch);
    var roll = finite(orientation.roll, state.roll);

    var cy = Math.cos(yaw);
    var sy = Math.sin(yaw);
    var x1 = x * cy + z * sy;
    var z1 = -x * sy + z * cy;
    x = x1;
    z = z1;

    var cp = Math.cos(pitch);
    var sp = Math.sin(pitch);
    var y1 = y * cp - z * sp;
    var z2 = y * sp + z * cp;
    y = y1;
    z = z2;

    var cr = Math.cos(roll);
    var sr = Math.sin(roll);
    var x2 = x * cr - y * sr;
    var y2 = x * sr + y * cr;

    return { x: x2, y: y2, z: z };
  }

  function frameOrientation(time) {
    var runtimeFrame = readRuntimeFrame(time);

    if (
      runtimeFrame &&
      Number.isFinite(runtimeFrame.yaw) &&
      Number.isFinite(runtimeFrame.pitch)
    ) {
      state.runtimePrimary = true;
      return {
        yaw: runtimeFrame.yaw,
        pitch: runtimeFrame.pitch,
        roll: finite(runtimeFrame.roll, 0),
        source: "runtime"
      };
    }

    state.runtimePrimary = false;

    return {
      yaw: state.yaw,
      pitch: state.pitch,
      roll: state.roll,
      source: "local-recovery"
    };
  }

  function stageFit() {
    var width = state.width || 640;
    var height = state.height || 720;
    var mobile = width / Math.max(1, state.dpr) < 680;
    var aspect = width / Math.max(1, height);

    return {
      scale: mobile ? 0.72 : 0.78,
      offsetY: mobile ? 0.02 : 0.015,
      aspectFit: aspect > 1 ? 1 / aspect : 1,
      cameraDistance: 3.58
    };
  }

  function projectPoint(point, orientation) {
    var rotated = rotatePoint(point, orientation);
    var fit = stageFit();
    var perspective = fit.cameraDistance / Math.max(0.72, fit.cameraDistance - rotated.z);

    return {
      x: rotated.x * fit.scale * fit.aspectFit * perspective,
      y: rotated.y * fit.scale * perspective + fit.offsetY,
      z: rotated.z,
      perspective: perspective,
      frontFacing: rotated.z >= -0.12
    };
  }

  function triangleDepth(triangle, orientation) {
    var a = rotatePoint(triangle.a, orientation);
    var b = rotatePoint(triangle.b, orientation);
    var c = rotatePoint(triangle.c, orientation);
    return (a.z + b.z + c.z) / 3;
  }

  function lightingForTriangle(triangle, orientation, time) {
    var normal = rotatePoint(triangle.normal, orientation);
    var key = normalize3({ x: -0.42, y: 0.72, z: 0.86 });
    var rim = normalize3({ x: 0.74, y: 0.22, z: 0.58 });
    var keyDot = Math.max(0, normal.x * key.x + normal.y * key.y + normal.z * key.z);
    var rimDot = Math.max(0, normal.x * rim.x + normal.y * rim.y + normal.z * rim.z);
    var pulse = 0.5 + 0.5 * Math.sin(time * 1.2 + triangle.a.band * 0.28 + triangle.a.radial * 0.16);
    return clamp(0.42 + keyDot * 0.48 + rimDot * 0.26 + pulse * 0.035, 0.28, 1.12);
  }

  function shadedColor(color, light, alphaScale) {
    return [
      clamp(color[0] * light + 0.035, 0, 1),
      clamp(color[1] * light + 0.035, 0, 1),
      clamp(color[2] * light + 0.045, 0, 1),
      clamp(color[3] * finite(alphaScale, 1), 0, 1)
    ];
  }

  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var error = gl.getShaderInfoLog(shader) || "Shader compile failed.";
      gl.deleteShader(shader);
      throw new Error(error);
    }

    return shader;
  }

  function createProgram(gl, vertexSource, fragmentSource) {
    var vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    var fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    var program = gl.createProgram();

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var error = gl.getProgramInfoLog(program) || "Program link failed.";
      gl.deleteProgram(program);
      throw new Error(error);
    }

    return program;
  }

  function createBuffer(gl) {
    var out = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, out);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(0), gl.DYNAMIC_DRAW);
    return out;
  }

  function updateBuffer(gl, targetBuffer, data) {
    gl.bindBuffer(gl.ARRAY_BUFFER, targetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  }

  function bindAttrib(gl, program, targetBuffer, name, size) {
    var location = gl.getAttribLocation(program, name);
    if (location < 0) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, targetBuffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }

  function initPrograms(gl) {
    var solidVertex = [
      "precision mediump float;",
      "attribute vec2 aPosition;",
      "attribute vec4 aColor;",
      "varying vec4 vColor;",
      "void main(){",
      "vColor=aColor;",
      "gl_Position=vec4(aPosition,0.0,1.0);",
      "}"
    ].join("");

    var solidFragment = [
      "precision mediump float;",
      "varying vec4 vColor;",
      "void main(){",
      "gl_FragColor=vColor;",
      "}"
    ].join("");

    var pointVertex = [
      "precision mediump float;",
      "attribute vec2 aPosition;",
      "attribute vec4 aColor;",
      "attribute float aSize;",
      "varying vec4 vColor;",
      "void main(){",
      "vColor=aColor;",
      "gl_Position=vec4(aPosition,0.0,1.0);",
      "gl_PointSize=aSize;",
      "}"
    ].join("");

    var pointFragment = [
      "precision mediump float;",
      "varying vec4 vColor;",
      "void main(){",
      "vec2 coord=gl_PointCoord-vec2(0.5);",
      "float d=length(coord);",
      "if(d>0.5) discard;",
      "float core=smoothstep(0.5,0.08,d);",
      "float shine=smoothstep(0.18,0.0,length(coord-vec2(-0.13,-0.14)))*0.22;",
      "gl_FragColor=vec4(vColor.rgb+shine,vColor.a*core);",
      "}"
    ].join("");

    state.solidProgram = createProgram(gl, solidVertex, solidFragment);
    state.lineProgram = createProgram(gl, solidVertex, solidFragment);
    state.pointProgram = createProgram(gl, pointVertex, pointFragment);

    state.solidPositionBuffer = createBuffer(gl);
    state.solidColorBuffer = createBuffer(gl);
    state.linePositionBuffer = createBuffer(gl);
    state.lineColorBuffer = createBuffer(gl);
    state.pointPositionBuffer = createBuffer(gl);
    state.pointColorBuffer = createBuffer(gl);
    state.pointSizeBuffer = createBuffer(gl);
  }

  function createWebGLContext(canvas) {
    return (
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      }) ||
      canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: true,
        depth: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      })
    );
  }

  function enforceOneCanvas(reason) {
    if (!state.mount) return;

    var canvases = Array.prototype.slice.call(state.mount.querySelectorAll("canvas"));
    var selected = state.canvas && state.mount.contains(state.canvas) ? state.canvas : null;

    if (!selected) {
      selected = canvases.find(function (canvas) {
        return canvas.getAttribute("data-audralia-news-diamond-canvas") === CONTRACT;
      }) || canvases[0] || document.createElement("canvas");
    }

    if (!state.mount.contains(selected)) {
      selected.setAttribute("data-audralia-news-diamond-canvas", CONTRACT);
      selected.setAttribute("aria-hidden", "true");
      state.mount.appendChild(selected);
    }

    canvases = Array.prototype.slice.call(state.mount.querySelectorAll("canvas"));

    canvases.forEach(function (canvas) {
      if (canvas === selected) return;

      try {
        canvas.remove();
        state.duplicateCanvasRemoved += 1;
      } catch (_error) {}
    });

    state.canvas = selected;
    Object.assign(state.canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      zIndex: "2",
      pointerEvents: "none",
      background: "transparent",
      imageRendering: "auto"
    });

    state.canvas.setAttribute("data-audralia-news-diamond-canvas", CONTRACT);
    state.canvas.setAttribute("data-news-standard-active", "true");
    state.canvas.setAttribute("data-route-owns-news-math", "false");
    state.canvas.setAttribute("data-lattice-states", String(LATTICE_STATES));

    state.oneCanvas = true;

    if (!state.gl) {
      state.gl = createWebGLContext(state.canvas);

      if (!state.gl) {
        recordError("webgl", "WEBGL_CONTEXT_UNAVAILABLE");
        return;
      }

      initPrograms(state.gl);
      state.glReady = true;
    }

    state.canvasReady = true;
  }

  function updateDimensionsFromRect(rect) {
    if (!rect || !state.canvas || !state.gl) return false;

    var dpr = Math.max(1, Math.min(1.85, window.devicePixelRatio || 1));
    var width = Math.max(320, Math.floor(rect.width * dpr));
    var height = Math.max(520, Math.floor(rect.height * dpr));

    state.stageRect = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    };

    if (state.width === width && state.height === height && state.dpr === dpr) return false;

    state.width = width;
    state.height = height;
    state.dpr = dpr;
    state.canvas.width = width;
    state.canvas.height = height;
    state.gl.viewport(0, 0, width, height);

    if (state.runtime && typeof state.runtime.resize === "function") {
      try {
        state.runtime.resize(width, height, dpr);
      } catch (error) {
        recordError("runtime.resize", error);
      }
    }

    requestRender("dimension-update", 6);
    return true;
  }

  function measureStageOnce() {
    if (!state.stage) return false;
    return updateDimensionsFromRect(state.stage.getBoundingClientRect());
  }

  function setupResizeHandling() {
    measureStageOnce();

    if (typeof ResizeObserver !== "undefined" && state.stage) {
      resizeObserver = new ResizeObserver(function (entries) {
        if (!entries || !entries[0]) return;

        var content = entries[0].contentRect;
        var box = state.stage.getBoundingClientRect();

        updateDimensionsFromRect({
          left: box.left,
          top: box.top,
          width: content.width,
          height: content.height
        });
      });

      try {
        resizeObserver.observe(state.stage);
      } catch (_error) {}
    }

    window.addEventListener("resize", function () {
      measureStageOnce();
      requestRender("window-resize", 6);
    }, signal ? { signal: signal, passive: true } : { passive: true });

    window.addEventListener("orientationchange", function () {
      setTimeout(function () {
        measureStageOnce();
        requestRender("orientationchange", 6);
      }, 120);
    }, signal ? { signal: signal, passive: true } : { passive: true });
  }

  function drawTriangles(gl, orientation, alphaScale, time) {
    var positions = [];
    var colors = [];
    var sorted = state.triangles.slice().sort(function (a, b) {
      return triangleDepth(a, orientation) - triangleDepth(b, orientation);
    });

    for (var i = 0; i < sorted.length; i += 1) {
      var triangle = sorted[i];
      var pa = projectPoint(triangle.a, orientation);
      var pb = projectPoint(triangle.b, orientation);
      var pc = projectPoint(triangle.c, orientation);
      var base = crystalRoleColor(triangle.a.role, triangle.a.band, 1);
      var light = lightingForTriangle(triangle, orientation, time);
      var color = shadedColor(base, light, alphaScale);

      positions.push(pa.x, pa.y, pb.x, pb.y, pc.x, pc.y);
      colors.push(color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]);
    }

    if (!positions.length) return;

    gl.useProgram(state.solidProgram);
    updateBuffer(gl, state.solidPositionBuffer, new Float32Array(positions));
    updateBuffer(gl, state.solidColorBuffer, new Float32Array(colors));
    bindAttrib(gl, state.solidProgram, state.solidPositionBuffer, "aPosition", 2);
    bindAttrib(gl, state.solidProgram, state.solidColorBuffer, "aColor", 4);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
  }

  function drawLines(gl, lines, orientation, alphaScale, time) {
    var positions = [];
    var colors = [];

    for (var i = 0; i < lines.length; i += 1) {
      var line = lines[i];
      var pa = projectPoint(line.a, orientation);
      var pb = projectPoint(line.b, orientation);
      var depth = clamp(0.84 + ((pa.z + pb.z) / 2) * 0.10, 0.50, 1.18);
      var pulse = line.family && line.family.indexOf("fibonacci") >= 0
        ? 0.88 + Math.sin(time * 1.35 + line.a.band * 0.28 + line.a.radial * 0.16) * 0.12
        : 1;

      var base = latticeColorForLine(line, alphaScale);
      var color = [
        clamp(base[0] * depth, 0, 1),
        clamp(base[1] * depth, 0, 1),
        clamp(base[2] * depth, 0, 1),
        clamp(base[3] * pulse, 0, 1)
      ];

      positions.push(pa.x, pa.y, pb.x, pb.y);
      colors.push(color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]);
    }

    if (!positions.length) return;

    gl.useProgram(state.lineProgram);
    updateBuffer(gl, state.linePositionBuffer, new Float32Array(positions));
    updateBuffer(gl, state.lineColorBuffer, new Float32Array(colors));
    bindAttrib(gl, state.lineProgram, state.linePositionBuffer, "aPosition", 2);
    bindAttrib(gl, state.lineProgram, state.lineColorBuffer, "aColor", 4);
    gl.drawArrays(gl.LINES, 0, positions.length / 2);
  }

  function drawPoints(gl, orientation, alphaScale, time) {
    var positions = [];
    var colors = [];
    var sizes = [];

    for (var i = 0; i < state.points.length; i += 1) {
      var point = state.points[i];
      var projected = projectPoint(point.seat, orientation);
      var pulse = 0.88 + Math.sin(time * 1.75 + point.seat.band * 0.34 + point.seat.radial * 0.22) * 0.12;
      var depth = clamp(0.86 + projected.z * 0.13, 0.58, 1.22);
      var base = pointColor(point, alphaScale);

      var color = [
        clamp(base[0] * depth, 0, 1),
        clamp(base[1] * depth, 0, 1),
        clamp(base[2] * depth, 0, 1),
        clamp(base[3] * pulse, 0, 1)
      ];

      positions.push(projected.x, projected.y);
      colors.push(color[0], color[1], color[2], color[3]);
      sizes.push(Math.max(2.4, point.size * state.dpr * projected.perspective));
    }

    if (!positions.length) return;

    gl.useProgram(state.pointProgram);
    updateBuffer(gl, state.pointPositionBuffer, new Float32Array(positions));
    updateBuffer(gl, state.pointColorBuffer, new Float32Array(colors));
    updateBuffer(gl, state.pointSizeBuffer, new Float32Array(sizes));
    bindAttrib(gl, state.pointProgram, state.pointPositionBuffer, "aPosition", 2);
    bindAttrib(gl, state.pointProgram, state.pointColorBuffer, "aColor", 4);
    bindAttrib(gl, state.pointProgram, state.pointSizeBuffer, "aSize", 1);
    gl.drawArrays(gl.POINTS, 0, positions.length / 2);
  }

  function readRuntimeFrame(time) {
    if (!state.runtime) return null;

    try {
      if (typeof state.runtime.getFrame === "function") {
        return state.runtime.getFrame();
      }

      if (typeof state.runtime.tick === "function") {
        return state.runtime.tick(time);
      }
    } catch (error) {
      recordError("runtime.frame", error);
    }

    return null;
  }

  function renderFrame(timestamp) {
    if (state.stopped || !state.gl || !state.geometryBuilt) return;

    state.raf = 0;

    var dt = state.lastFrameTime ? clamp((timestamp - state.lastFrameTime) / 1000, 0, 0.05) : 0;
    state.lastFrameTime = timestamp;

    if (!state.pointerActive) {
      state.yaw += state.velocityYaw;
      state.pitch += state.velocityPitch;

      var damping = Math.pow(0.938, dt * 60);
      state.velocityYaw *= damping;
      state.velocityPitch *= damping;

      if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
      if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;
    }

    state.pitch = clamp(state.pitch, -1.05, 1.05);
    state.roll = Math.sin(timestamp * 0.00018) * 0.012;

    var orientation = frameOrientation(timestamp);
    var gl = state.gl;

    gl.clearColor(0.002, 0.010, 0.030, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    if (state.activeLens === "planet") {
      drawTriangles(gl, orientation, 0.82, timestamp * 0.001);
      drawLines(gl, state.ringLines.concat(state.spineLines), orientation, 0.15, timestamp * 0.001);
    } else {
      drawTriangles(gl, orientation, state.pointerActive ? 0.10 : 0.16, timestamp * 0.001);
      drawLines(gl, state.ringLines, orientation, state.pointerActive ? 0.78 : 0.92, timestamp * 0.001);
      drawLines(gl, state.spineLines, orientation, state.pointerActive ? 0.78 : 0.92, timestamp * 0.001);
      drawLines(gl, state.fibonacciReturnLines, orientation, state.pointerActive ? 0.34 : 0.54, timestamp * 0.001);
      drawLines(gl, state.fibonacciLines, orientation, state.pointerActive ? 0.72 : 0.98, timestamp * 0.001);
      drawPoints(gl, orientation, state.pointerActive ? 0.82 : 0.98, timestamp * 0.001);
    }

    state.renderCount += 1;
    state.oneLoop = true;

    if (state.settleFrames > 0) state.settleFrames -= 1;

    window.AUDRALIA_NEWS_DIAMOND_LATTICE_STATE = compactStatus();

    if (
      state.pointerActive ||
      state.settleFrames > 0 ||
      Math.abs(state.velocityYaw) > 0 ||
      Math.abs(state.velocityPitch) > 0
    ) {
      state.raf = window.requestAnimationFrame(renderFrame);
    }
  }

  function requestRender(reason, settleFrames) {
    if (settleFrames) state.settleFrames = Math.max(state.settleFrames, settleFrames);
    if (!state.raf && !state.stopped) {
      state.raf = window.requestAnimationFrame(renderFrame);
    }
  }

  function setLens(nextLens) {
    var lens = Object.prototype.hasOwnProperty.call(LENS_COPY, nextLens) ? nextLens : "planet";
    closeCachedMenus();
    state.activeLens = lens;

    document.documentElement.dataset.audraliaActiveLens = lens;

    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-lens-button]")).forEach(function (button) {
      var pressed = button.dataset.audraliaLensButton === lens;
      button.setAttribute("aria-pressed", pressed ? "true" : "false");
    });

    setText("[data-audralia-lens-title]", LENS_COPY[lens].title);
    setText("[data-audralia-lens-copy]", LENS_COPY[lens].copy);
    setHtml("[data-audralia-stage-label]", LENS_COPY[lens].label);

    if (state.runtime && typeof state.runtime.setLens === "function") {
      try {
        state.runtime.setLens(lens);
      } catch (error) {
        recordError("runtime.setLens", error);
      }
    }

    updateDiagnostics(true);
    requestRender("lens-switch", lens === "planet" ? 4 : 10);
  }

  function bindLensControls() {
    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-lens-button]")).forEach(function (button) {
      button.addEventListener("click", function () {
        setLens(button.dataset.audraliaLensButton);
      }, signal ? { signal: signal } : false);
    });
  }

  function pointerPoint(event) {
    var rect = state.stageRect;
    if (!rect) return { x: event.clientX, y: event.clientY };

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.addEventListener("pointerdown", function (event) {
      closeCachedMenus();

      var t = now();
      if (t - state.lastTap < 320) {
        resetCarrier();
      }

      state.lastTap = t;
      state.pointerActive = true;
      state.pointerId = event.pointerId;

      var p = pointerPoint(event);
      state.pointerX = p.x;
      state.pointerY = p.y;
      state.velocityYaw = 0;
      state.velocityPitch = 0;

      try {
        state.stage.setPointerCapture(event.pointerId);
      } catch (_error) {}

      if (state.runtime && typeof state.runtime.pointerDown === "function") {
        try {
          state.runtime.pointerDown(p.x * state.dpr, p.y * state.dpr, t);
        } catch (error) {
          recordError("runtime.pointerDown", error);
        }
      }

      requestRender("pointer-down", 4);
      event.preventDefault();
    }, signal ? { signal: signal, passive: false } : { passive: false });

    state.stage.addEventListener("pointermove", function (event) {
      if (!state.pointerActive) return;

      var p = pointerPoint(event);
      var dx = p.x - state.pointerX;
      var dy = p.y - state.pointerY;

      state.pointerX = p.x;
      state.pointerY = p.y;

      state.yaw += dx * 0.0085;
      state.pitch = clamp(state.pitch + dy * 0.0058, -1.05, 1.05);
      state.velocityYaw = clamp(dx * 0.0024, -0.052, 0.052);
      state.velocityPitch = clamp(dy * 0.0016, -0.040, 0.040);

      if (state.runtime && typeof state.runtime.pointerMove === "function") {
        try {
          state.runtime.pointerMove(p.x * state.dpr, p.y * state.dpr, now());
        } catch (error) {
          recordError("runtime.pointerMove", error);
        }
      }

      requestRender("pointer-move", 2);
      event.preventDefault();
    }, signal ? { signal: signal, passive: false } : { passive: false });

    function release(event) {
      if (!state.pointerActive) return;

      state.pointerActive = false;

      if (state.runtime && typeof state.runtime.pointerUp === "function") {
        try {
          state.runtime.pointerUp(now());
        } catch (error) {
          recordError("runtime.pointerUp", error);
        }
      }

      try {
        if (state.pointerId !== null) state.stage.releasePointerCapture(state.pointerId);
      } catch (_error) {}

      state.pointerId = null;
      updateDiagnostics(true);
      requestRender("pointer-release", 18);
      event.preventDefault();
    }

    state.stage.addEventListener("pointerup", release, signal ? { signal: signal, passive: false } : { passive: false });
    state.stage.addEventListener("pointercancel", release, signal ? { signal: signal, passive: false } : { passive: false });
    state.stage.addEventListener("lostpointercapture", release, signal ? { signal: signal, passive: false } : { passive: false });

    state.pointerBound = true;
  }

  function resetCarrier() {
    state.yaw = -0.54;
    state.pitch = -0.18;
    state.roll = 0;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    requestRender("reset", 8);
  }

  function getRuntime() {
    return window.AUDRALIA_TRUE_GLOBE_RUNTIME ||
      window.AUDRALIA_G2_TRUE_GLOBE_RUNTIME ||
      null;
  }

  function initRuntime() {
    var runtime = getRuntime();
    if (!runtime) return;

    state.runtime = runtime;
    state.runtimeLoaded = true;
    state.runtimeReady = true;

    if (typeof runtime.init === "function") {
      try {
        runtime.init({
          width: state.width,
          height: state.height,
          dpr: state.dpr,
          activeLens: state.activeLens,
          mode: "audralia-news-diamond-lattice-runtime-alignment",
          newsStandardActive: true,
          routePublicizesNewsOnly: true,
          routeOwnsNewsMath: false,
          diamondCellStandardActive: true,
          childMathHeldDuringLattice: true,
          visualPassClaimed: false
        });
      } catch (error) {
        recordError("runtime.init", error);
      }
    }

    updateDiagnostics(true);
    requestRender("runtime-init", 8);
  }

  function loadRuntime() {
    var existing = getRuntime();

    if (existing) {
      initRuntime();
      return Promise.resolve(existing);
    }

    return new Promise(function (resolve) {
      var existingScript = document.querySelector("script[data-audralia-runtime-loader='true']");
      if (existingScript) {
        setTimeout(function () {
          initRuntime();
          resolve(getRuntime());
        }, 0);
        return;
      }

      var script = document.createElement("script");
      script.src = RUNTIME_PATH + "?v=" + encodeURIComponent(RUNTIME_CACHE_KEY);
      script.defer = true;
      script.async = true;
      script.setAttribute("data-audralia-runtime-loader", "true");
      script.setAttribute("data-route-contract", CONTRACT);
      script.setAttribute("data-news-standard-active", "true");
      script.setAttribute("data-route-publicizes-news-only", "true");
      script.setAttribute("data-route-owns-news-math", "false");

      script.onload = function () {
        initRuntime();
        resolve(getRuntime());
      };

      script.onerror = function () {
        state.runtimeLoaded = false;
        state.runtimeReady = false;
        recordError("loadRuntime", "runtime script failed");
        updateDiagnostics(true);
        requestRender("runtime-failed", 4);
        resolve(null);
      };

      document.body.appendChild(script);
    });
  }

  function compactStatus() {
    return {
      contract: CONTRACT,
      donorReference: DONOR_REFERENCE,
      activeLens: state.activeLens,
      htmlOwns: "public-visual-expression",
      jsOwns: "under-hood-math-delivery-and-construct-expression",
      runtimeReady: state.runtimeReady,
      runtimePrimary: state.runtimePrimary,
      fallbackActive: !state.runtimePrimary,
      fallbackNotSuccessStandard: true,
      newsStandardActive: true,
      cellRequiresNorthEastWestSouth: true,
      routePublicizesNewsOnly: true,
      routeOwnsNewsMath: false,
      diamondCellStandardActive: true,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      geometryBuilt: state.geometryBuilt,
      oneCanvas: state.oneCanvas,
      oneLoop: state.oneLoop,
      pointerBound: state.pointerBound,
      pointerActive: state.pointerActive,
      renderCount: state.renderCount,
      noChildMath: true,
      noRuntimeRewrite: true,
      noVisualPassClaim: true,
      duplicateCanvasRemoved: state.duplicateCanvasRemoved,
      errorCount: state.errorCount
    };
  }

  function updateDiagnostics(force) {
    var time = now();

    if (state.pointerActive && !force) return;
    if (!force && time - state.lastDiagnosticAt < 1000) return;

    state.lastDiagnosticAt = time;

    var status = compactStatus();

    setText("[data-audralia-diagnostic-route]", "HTML public expression · JS construct delivery");
    setText("[data-audralia-diagnostic-runtime]", status.runtimeReady ? (status.runtimePrimary ? "runtime primary" : "runtime loaded · local recovery proof active") : "runtime pending · local recovery proof active");
    setText("[data-audralia-diagnostic-lens]", status.activeLens);
    setText("[data-audralia-diagnostic-canvas]", status.oneCanvas ? "one WebGL canvas" : "canvas pending");
    setText("[data-audralia-diagnostic-loop]", status.oneLoop ? "dirty RAF · piston controlled" : "loop pending");
    setText("[data-audralia-diagnostic-children]", "child math held · no surface/cloud/continent execution");
    setText("[data-audralia-diagnostic-news]", "NEWS active · route publicizes only");
    setText("[data-audralia-diagnostic-lattice]", "16 × 16 / 256 diamond-lattice seats");

    setDataset("audraliaNewsStandardActive", true);
    setDataset("audraliaRouteOwnsNewsMath", false);
    setDataset("audraliaDiamondCellStandardActive", true);
    setDataset("audraliaRuntimePrimary", status.runtimePrimary);
    setDataset("audraliaFallbackNotSuccessStandard", true);
    setDataset("audraliaLatticeStates", LATTICE_STATES);

    window.AUDRALIA_NEWS_DIAMOND_LATTICE_STATUS = status;
  }

  function publishBoot() {
    window.AUDRALIA_NEWS_DIAMOND_LATTICE_BOOT = {
      contract: CONTRACT,
      donorReference: DONOR_REFERENCE,
      route: "/showroom/globe/audralia/",
      html: "/showroom/globe/audralia/index.html",
      js: "/showroom/globe/audralia/index.js",
      htmlOwns: "public-visual-expression",
      jsOwns: "under-hood-math-delivery-and-construct-expression",
      newsStandardActive: true,
      cellRequiresNorthEastWestSouth: true,
      routePublicizesNewsOnly: true,
      routeOwnsNewsMath: false,
      datumDefinesNewsLaw: "expected",
      runtimeProjectsNewsCells: "expected",
      diamondCellStandardActive: true,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      showroomAuthorityImported: false,
      noChildMath: true,
      noRuntimeRewrite: true,
      noVisualPassClaim: true,
      bootedAt: new Date().toISOString()
    };
  }

  function stop() {
    state.stopped = true;

    if (state.raf) {
      try {
        window.cancelAnimationFrame(state.raf);
      } catch (_error) {}
    }

    state.raf = 0;

    if (resizeObserver) {
      try {
        resizeObserver.disconnect();
      } catch (_error) {}
    }

    if (abortController) {
      try {
        abortController.abort();
      } catch (_error) {}
    }
  }

  window.__AUDRALIA_NEWS_DIAMOND_LATTICE_CONTROLLER__ = {
    stop: stop,
    state: state,
    contract: CONTRACT
  };

  function init() {
    state.stage = document.querySelector("#audraliaGlobeStage");
    state.mount = document.querySelector("#audraliaGlobeMount");
    state.cachedDetails = Array.prototype.slice.call(document.querySelectorAll("details"));

    if (!state.stage || !state.mount) {
      recordError("init", "Missing #audraliaGlobeStage or #audraliaGlobeMount");
      return;
    }

    enforceOneCanvas("boot");
    buildGeometry();
    setupResizeHandling();
    bindLensControls();
    bindPointer();
    setLens("planet");
    publishBoot();

    loadRuntime().then(function () {
      updateDiagnostics(true);
      requestRender("runtime-load", 8);
    });

    updateDiagnostics(true);
    requestRender("boot", 8);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
  } else {
    init();
  }
})();
