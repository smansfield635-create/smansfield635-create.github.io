// /assets/audralia/clean/runtime/audralia.true-globe.runtime.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2
//
// Supersedes:
// AUDRALIA_G2_TRUE_GLOBE_RUNTIME_FAMILY_SEPARATION_TNT_v1
//
// Family:
// /assets/audralia/clean/runtime/
//
// Consumes children:
// /assets/audralia/clean/runtime/audralia.true-globe.moisture.js
// /assets/audralia/clean/runtime/audralia.true-globe.clouds.js
//
// Purpose:
// - Preserve true-globe runtime authority.
// - Own time, motion, lens state, spherical carrier state, Fibonacci 16×16 / 256 lattice state,
//   projection state, front/back visibility, and diagnostic state.
// - Load and consume the moisture child.
// - Load and consume the cloud child.
// - Publish moisture/cloud state inside runtime frame/status.
// - Do not draw the page.
// - Do not create canvas.
// - Do not own public HTML.
// - No generated image. No GraphicBox. No flat projection. No Earth/Audralia crossover. No Australia drift.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_FAMILY_SEPARATION_TNT_v1";
  var STANDARD = "AUDRALIA_TRUE_RUNTIME_CLOUD_RENEWAL_STANDARD_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.runtime.js";

  var MOISTURE_PATH = "/assets/audralia/clean/runtime/audralia.true-globe.moisture.js";
  var MOISTURE_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1";

  var CLOUDS_PATH = "/assets/audralia/clean/runtime/audralia.true-globe.clouds.js";
  var CLOUDS_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_4K_MOISTURE_CLOUD_CHILD_TNT_v1";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var FIBONACCI_SEQUENCE = [
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ];

  var FIBONACCI_OFFSETS = [1, 2, 3, 5, 8, 13];

  var state = {
    initialized: false,
    runtimeReady: false,

    activeLens: "planet",

    width: 640,
    height: 720,
    dpr: 1,

    clockStart: 0,
    lastTime: 0,
    deltaTime: 0,
    renderTime: 0,
    frameIndex: 0,

    yaw: -0.56,
    pitch: -0.18,
    roll: 0.02,

    velocityYaw: 0,
    velocityPitch: 0,

    dragging: false,
    pointerX: 0,
    pointerY: 0,
    pointerTime: 0,
    lastTapTime: 0,

    reducedMotion: false,

    seats: [],
    seatGrid: [],
    ringLinks: [],
    spineLinks: [],
    fibonacciLinks: [],

    projectedSeats: [],
    projectedLinks: {
      ringLinks: [],
      spineLinks: [],
      fibonacciLinks: []
    },

    moistureApi: null,
    cloudsApi: null,
    moistureLoaded: false,
    cloudsLoaded: false,
    moistureLoading: false,
    cloudsLoading: false,
    moistureField: null,
    cloudLayer: null,

    sphericalProjection: true,
    flatProjectionBlocked: true,
    rotationAppliedBeforeProjection: true,
    frontBackVisibility: true,

    motionStateReady: false,
    diagnosticStateReady: false,
    sphereCarrierReady: false,
    moistureFieldReady: false,
    cloudRendererReady: false,

    planetViewReady: false,
    latticeViewReady: false,
    diagnosticScopeReady: false,

    errors: []
  };

  function now() {
    if (typeof performance !== "undefined" && performance.now) return performance.now();
    return Date.now();
  }

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function normalize3(point) {
    var length = Math.hypot(point.x, point.y, point.z) || 1;
    return {
      x: point.x / length,
      y: point.y / length,
      z: point.z / length
    };
  }

  function clonePoint(point) {
    return {
      x: point.x,
      y: point.y,
      z: point.z
    };
  }

  function rotatePoint(point) {
    var x = point.x;
    var y = point.y;
    var z = point.z;

    var cy = Math.cos(state.yaw);
    var sy = Math.sin(state.yaw);
    var x1 = x * cy + z * sy;
    var z1 = -x * sy + z * cy;
    x = x1;
    z = z1;

    var cp = Math.cos(state.pitch);
    var sp = Math.sin(state.pitch);
    var y1 = y * cp - z * sp;
    var z2 = y * sp + z * cp;
    y = y1;
    z = z2;

    var cr = Math.cos(state.roll);
    var sr = Math.sin(state.roll);
    var x2 = x * cr - y * sr;
    var y2 = x * sr + y * cr;

    return {
      x: x2,
      y: y2,
      z: z
    };
  }

  function getMetrics() {
    var minSide = Math.min(state.width, state.height);
    var mobile = state.width < 760 * state.dpr;

    return {
      width: state.width,
      height: state.height,
      centerX: state.width / 2,
      centerY: mobile ? state.height * 0.405 : state.height * 0.42,
      radius: minSide * (mobile ? 0.345 : 0.365),
      cameraDistance: 3.72
    };
  }

  function projectSpherePoint(point) {
    var metrics = getMetrics();
    var rotated = rotatePoint(point);
    var denominator = Math.max(0.72, metrics.cameraDistance - rotated.z);
    var perspective = metrics.cameraDistance / denominator;

    return {
      x: metrics.centerX + rotated.x * metrics.radius * perspective,
      y: metrics.centerY - rotated.y * metrics.radius * perspective,
      z: rotated.z,
      rotated: rotated,
      perspective: perspective,
      frontFacing: rotated.z >= 0,
      visibility: rotated.z >= 0 ? 1 : clamp(0.18 + (rotated.z + 1) * 0.12, 0.04, 0.20)
    };
  }

  function createSeat(radialIndex, bandIndex) {
    var u = (bandIndex + 0.5) / FIBONACCI_BANDS;
    var y = 1 - 2 * u;
    var ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    var longitude = TAU * (radialIndex / RADIAL_NODES);
    var latitude = Math.asin(y);

    var position = {
      x: ringRadius * Math.cos(longitude),
      y: y,
      z: ringRadius * Math.sin(longitude)
    };

    var normal = normalize3(position);
    var fibonacci = FIBONACCI_SEQUENCE[bandIndex];
    var fibonacciWeight = fibonacci / FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1];

    return {
      seatIndex: bandIndex * RADIAL_NODES + radialIndex,
      radialIndex: radialIndex,
      bandIndex: bandIndex,
      longitude: longitude,
      latitude: latitude,
      spherePosition: position,
      surfaceNormal: normal,
      fibonacci: fibonacci,
      fibonacciWeight: fibonacciWeight,
      frontFacing: true,
      renderPriority:
        radialIndex % 4 === 0 ? 1 :
        radialIndex % 2 === 0 ? 0.74 :
        0.54,
      connectionPriority:
        radialIndex % 4 === 0 ? 1 :
        radialIndex % 2 === 0 ? 0.70 :
        0.48,
      futureMaterialClass: "pending-audralia-material",
      futureDiagnosticState: "carrier-seat-ready"
    };
  }

  function getSeat(radialIndex, bandIndex) {
    var r = ((radialIndex % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES;
    var b = clamp(bandIndex, 0, FIBONACCI_BANDS - 1);
    return state.seatGrid[b][r];
  }

  function buildSphereCarrier() {
    var grid = [];
    var bandIndex;
    var radialIndex;

    for (bandIndex = 0; bandIndex < FIBONACCI_BANDS; bandIndex += 1) {
      var band = [];

      for (radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
        band.push(createSeat(radialIndex, bandIndex));
      }

      grid.push(band);
    }

    state.seatGrid = grid;
    state.seats = [].concat.apply([], grid);

    var ringLinks = [];
    var spineLinks = [];
    var fibonacciLinks = [];

    for (bandIndex = 0; bandIndex < FIBONACCI_BANDS; bandIndex += 1) {
      for (radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
        ringLinks.push({
          linkIndex: ringLinks.length,
          family: "band-ring",
          a: getSeat(radialIndex, bandIndex),
          b: getSeat(radialIndex + 1, bandIndex),
          major: radialIndex % 4 === 0,
          offset: 1
        });
      }
    }

    for (radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
      for (bandIndex = 0; bandIndex < FIBONACCI_BANDS - 1; bandIndex += 1) {
        spineLinks.push({
          linkIndex: spineLinks.length,
          family: "radial-spine",
          a: getSeat(radialIndex, bandIndex),
          b: getSeat(radialIndex, bandIndex + 1),
          major: radialIndex % 4 === 0,
          offset: 0
        });
      }
    }

    for (bandIndex = 0; bandIndex < FIBONACCI_BANDS - 1; bandIndex += 1) {
      var offset = FIBONACCI_OFFSETS[bandIndex % FIBONACCI_OFFSETS.length];

      for (radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
        fibonacciLinks.push({
          linkIndex: fibonacciLinks.length,
          family: "fibonacci-forward",
          a: getSeat(radialIndex, bandIndex),
          b: getSeat(radialIndex + offset, bandIndex + 1),
          major: radialIndex % 4 === 0 || bandIndex % 4 === 0,
          offset: offset
        });

        if (bandIndex % 2 === 0) {
          fibonacciLinks.push({
            linkIndex: fibonacciLinks.length,
            family: "fibonacci-return",
            a: getSeat(radialIndex, bandIndex),
            b: getSeat(radialIndex - offset, bandIndex + 1),
            major: radialIndex % 4 === 0,
            offset: offset
          });
        }
      }
    }

    state.ringLinks = ringLinks;
    state.spineLinks = spineLinks;
    state.fibonacciLinks = fibonacciLinks;
    state.sphereCarrierReady = state.seats.length === LATTICE_STATES;

    if (!state.sphereCarrierReady) {
      throw new Error("AUDRALIA_TRUE_GLOBE_RUNTIME_SEAT_COUNT_FAILED_" + state.seats.length);
    }
  }

  function projectSeat(seat) {
    var projection = projectSpherePoint(seat.spherePosition);

    return {
      seatIndex: seat.seatIndex,
      radialIndex: seat.radialIndex,
      bandIndex: seat.bandIndex,
      longitude: seat.longitude,
      latitude: seat.latitude,
      spherePosition: clonePoint(seat.spherePosition),
      surfaceNormal: clonePoint(seat.surfaceNormal),
      fibonacci: seat.fibonacci,
      fibonacciWeight: seat.fibonacciWeight,
      frontFacing: projection.frontFacing,
      visibility: projection.visibility,
      renderPriority: seat.renderPriority,
      connectionPriority: seat.connectionPriority,
      futureMaterialClass: seat.futureMaterialClass,
      futureDiagnosticState: seat.futureDiagnosticState,
      screen: {
        x: projection.x,
        y: projection.y,
        z: projection.z,
        perspective: projection.perspective
      },
      rotated: projection.rotated
    };
  }

  function projectLink(link) {
    var a = projectSeat(link.a);
    var b = projectSeat(link.b);
    var avgZ = (a.screen.z + b.screen.z) / 2;

    return {
      linkIndex: link.linkIndex,
      family: link.family,
      offset: link.offset,
      major: link.major,
      a: a,
      b: b,
      frontFacing: avgZ >= 0,
      depth: avgZ,
      visibility: avgZ >= 0 ? 1 : clamp(0.08 + (avgZ + 1) * 0.10, 0.03, 0.18)
    };
  }

  function getMoistureApi() {
    return window.AUDRALIA_TRUE_GLOBE_MOISTURE || window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE || null;
  }

  function getCloudsApi() {
    return window.AUDRALIA_TRUE_GLOBE_CLOUDS || window.AUDRALIA_G2_TRUE_GLOBE_CLOUDS || null;
  }

  function loadScriptOnce(path, contract, key) {
    return new Promise(function (resolve, reject) {
      var existingApi = key === "moisture" ? getMoistureApi() : getCloudsApi();

      if (existingApi) {
        resolve(existingApi);
        return;
      }

      var existingScript = document.querySelector("script[data-audralia-runtime-child='" + key + "']");

      if (existingScript) {
        var attempts = 0;
        var interval = window.setInterval(function () {
          attempts += 1;

          var api = key === "moisture" ? getMoistureApi() : getCloudsApi();

          if (api) {
            window.clearInterval(interval);
            resolve(api);
          }

          if (attempts > 80) {
            window.clearInterval(interval);
            reject(new Error("AUDRALIA_RUNTIME_CHILD_WAIT_TIMEOUT_" + key));
          }
        }, 50);

        return;
      }

      var script = document.createElement("script");
      script.src = path + "?v=" + encodeURIComponent(contract);
      script.async = true;
      script.defer = true;
      script.setAttribute("data-audralia-runtime-child", key);
      script.setAttribute("data-contract", contract);

      script.onload = function () {
        var api = key === "moisture" ? getMoistureApi() : getCloudsApi();

        if (api) {
          resolve(api);
        } else {
          reject(new Error("AUDRALIA_RUNTIME_CHILD_LOADED_GLOBAL_MISSING_" + key));
        }
      };

      script.onerror = function () {
        reject(new Error("AUDRALIA_RUNTIME_CHILD_LOAD_FAILED_" + key));
      };

      document.head.appendChild(script);
    });
  }

  function ensureAtmosphereChildren() {
    if (state.moistureLoading || state.cloudsLoading) return;

    state.moistureLoading = true;

    loadScriptOnce(MOISTURE_PATH, MOISTURE_CONTRACT, "moisture")
      .then(function (moistureApi) {
        state.moistureApi = moistureApi;
        state.moistureLoaded = true;
        state.moistureFieldReady = Boolean(moistureApi);

        state.cloudsLoading = true;

        return loadScriptOnce(CLOUDS_PATH, CLOUDS_CONTRACT, "clouds");
      })
      .then(function (cloudsApi) {
        state.cloudsApi = cloudsApi;
        state.cloudsLoaded = true;
        state.cloudRendererReady = Boolean(cloudsApi);
        state.diagnosticStateReady = true;
        buildAtmosphereFrameData();
        publish();
      })
      .catch(function (error) {
        recordError("ensureAtmosphereChildren", error);
        publish();
      });
  }

  function buildProjectedFrame() {
    var projectedSeats = [];
    var i;

    for (i = 0; i < state.seats.length; i += 1) {
      projectedSeats.push(projectSeat(state.seats[i]));
    }

    var projectedRingLinks = [];
    for (i = 0; i < state.ringLinks.length; i += 1) {
      projectedRingLinks.push(projectLink(state.ringLinks[i]));
    }

    var projectedSpineLinks = [];
    for (i = 0; i < state.spineLinks.length; i += 1) {
      projectedSpineLinks.push(projectLink(state.spineLinks[i]));
    }

    var projectedFibonacciLinks = [];
    for (i = 0; i < state.fibonacciLinks.length; i += 1) {
      projectedFibonacciLinks.push(projectLink(state.fibonacciLinks[i]));
    }

    projectedRingLinks.sort(function (a, b) { return a.depth - b.depth; });
    projectedSpineLinks.sort(function (a, b) { return a.depth - b.depth; });
    projectedFibonacciLinks.sort(function (a, b) { return a.depth - b.depth; });
    projectedSeats.sort(function (a, b) { return a.screen.z - b.screen.z; });

    state.projectedSeats = projectedSeats;
    state.projectedLinks = {
      ringLinks: projectedRingLinks,
      spineLinks: projectedSpineLinks,
      fibonacciLinks: projectedFibonacciLinks
    };

    buildAtmosphereFrameData();
  }

  function buildFrameBase() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      activeLens: state.activeLens,

      yaw: state.yaw,
      pitch: state.pitch,
      roll: state.roll,
      deltaTime: state.deltaTime,
      renderTime: state.renderTime,
      frameIndex: state.frameIndex,

      width: state.width,
      height: state.height,
      dpr: state.dpr,
      metrics: getMetrics(),

      seats: state.seats,
      projectedSeats: state.projectedSeats,

      ringLinks: state.ringLinks,
      spineLinks: state.spineLinks,
      fibonacciLinks: state.fibonacciLinks,
      projectedLinks: state.projectedLinks,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      sphereSeats: state.seats.length,
      fibonacciOffsets: FIBONACCI_OFFSETS.slice(),

      frontBackVisibility: state.frontBackVisibility,
      sphericalProjection: state.sphericalProjection,
      flatProjectionBlocked: state.flatProjectionBlocked,
      rotationAppliedBeforeProjection: state.rotationAppliedBeforeProjection,

      planetViewReady: state.planetViewReady,
      latticeViewReady: state.latticeViewReady,
      diagnosticScopeReady: state.diagnosticScopeReady,
      runtimeReady: state.runtimeReady,
      motionStateReady: state.motionStateReady,
      diagnosticStateReady: state.diagnosticStateReady,

      moistureLoaded: state.moistureLoaded,
      cloudsLoaded: state.cloudsLoaded,
      moistureFieldReady: state.moistureFieldReady,
      cloudRendererReady: state.cloudRendererReady,
      moistureField: state.moistureField,
      cloudLayer: state.cloudLayer
    };
  }

  function buildAtmosphereFrameData() {
    var frame = buildFrameBase();

    state.moistureApi = state.moistureApi || getMoistureApi();
    state.cloudsApi = state.cloudsApi || getCloudsApi();

    state.moistureLoaded = Boolean(state.moistureApi);
    state.cloudsLoaded = Boolean(state.cloudsApi);

    if (state.moistureApi && typeof state.moistureApi.getField === "function") {
      try {
        state.moistureField = state.moistureApi.getField(frame);
        state.moistureFieldReady = Boolean(state.moistureField && state.moistureField.moistureFieldReady);
      } catch (error) {
        recordError("moistureField", error);
      }
    }

    if (state.cloudsApi && typeof state.cloudsApi.buildLayer === "function") {
      try {
        frame.moistureField = state.moistureField;
        state.cloudLayer = state.cloudsApi.buildLayer(frame);
        state.cloudRendererReady = Boolean(state.cloudLayer && state.cloudLayer.rendererReady);
      } catch (error) {
        recordError("cloudLayer", error);
      }
    }
  }

  function detectReducedMotion() {
    try {
      return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (_error) {
      return false;
    }
  }

  function resize(width, height, dpr) {
    state.width = Math.max(320, Math.floor(finite(width, state.width)));
    state.height = Math.max(320, Math.floor(finite(height, state.height)));
    state.dpr = Math.max(1, finite(dpr, state.dpr));
    buildProjectedFrame();
    state.diagnosticStateReady = true;
    return getFrame();
  }

  function setLens(lens) {
    state.activeLens = lens === "lattice" || lens === "diagnostic" ? lens : "planet";

    if (state.activeLens === "planet") state.planetViewReady = true;
    if (state.activeLens === "lattice") state.latticeViewReady = true;
    if (state.activeLens === "diagnostic") state.diagnosticScopeReady = true;

    buildProjectedFrame();
    return getFrame();
  }

  function reset() {
    state.yaw = -0.56;
    state.pitch = -0.18;
    state.roll = 0.02;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.dragging = false;
    buildProjectedFrame();
    return getFrame();
  }

  function pointerDown(x, y, time) {
    var t = finite(time, now());

    if (t - state.lastTapTime < 320) reset();

    state.lastTapTime = t;
    state.dragging = true;
    state.pointerX = finite(x, 0);
    state.pointerY = finite(y, 0);
    state.pointerTime = t;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.motionStateReady = true;

    return getFrame();
  }

  function pointerMove(x, y, time) {
    if (!state.dragging) return getFrame();

    var nextX = finite(x, state.pointerX);
    var nextY = finite(y, state.pointerY);
    var t = finite(time, now());

    var dx = nextX - state.pointerX;
    var dy = nextY - state.pointerY;

    state.pointerX = nextX;
    state.pointerY = nextY;
    state.pointerTime = t;

    state.yaw += dx * 0.008;
    state.pitch = clamp(state.pitch + dy * 0.0054, -1.05, 1.05);

    state.velocityYaw = clamp(dx * 0.0022, -0.048, 0.048);
    state.velocityPitch = clamp(dy * 0.0015, -0.034, 0.034);

    state.motionStateReady = true;

    buildProjectedFrame();
    return getFrame();
  }

  function pointerUp(time) {
    state.dragging = false;
    state.pointerTime = finite(time, now());
    state.motionStateReady = true;
    return getFrame();
  }

  function tick(time) {
    var t = finite(time, now());

    if (!state.clockStart) state.clockStart = t;

    var dt = state.lastTime ? clamp((t - state.lastTime) / 1000, 0, 0.05) : 0;
    state.lastTime = t;
    state.deltaTime = dt;
    state.renderTime = (t - state.clockStart) / 1000;

    if (!state.dragging) {
      state.yaw += state.velocityYaw;
      state.pitch += state.velocityPitch;

      var damping = Math.pow(0.94, dt * 60);
      state.velocityYaw *= damping;
      state.velocityPitch *= damping;

      if (Math.abs(state.velocityYaw) < 0.00006) state.velocityYaw = 0;
      if (Math.abs(state.velocityPitch) < 0.00006) state.velocityPitch = 0;

      if (state.velocityYaw === 0 && state.velocityPitch === 0 && !state.reducedMotion) {
        state.yaw += dt * 0.045;
      }
    }

    state.pitch = clamp(state.pitch, -1.05, 1.05);
    state.roll = Math.sin(state.renderTime * 0.16) * 0.015;

    state.frameIndex += 1;
    state.motionStateReady = true;

    buildProjectedFrame();

    return getFrame();
  }

  function getFrame() {
    buildAtmosphereFrameData();

    var frame = buildFrameBase();
    frame.moistureField = state.moistureField;
    frame.cloudLayer = state.cloudLayer;

    return frame;
  }

  function getSeats() {
    return state.seats.slice();
  }

  function getLinks() {
    return {
      ringLinks: state.ringLinks.slice(),
      spineLinks: state.spineLinks.slice(),
      fibonacciLinks: state.fibonacciLinks.slice()
    };
  }

  function getMoistureField() {
    buildAtmosphereFrameData();
    return state.moistureField;
  }

  function getCloudLayer() {
    buildAtmosphereFrameData();
    return state.cloudLayer;
  }

  function status() {
    var moistureStatus = state.moistureApi && typeof state.moistureApi.status === "function"
      ? state.moistureApi.status()
      : null;

    var cloudStatus = state.cloudsApi && typeof state.cloudsApi.status === "function"
      ? state.cloudsApi.status()
      : null;

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      runtimeReady: state.runtimeReady,
      initialized: state.initialized,

      activeLens: state.activeLens,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      sphereSeats: state.seats.length,
      fibonacciOffsets: FIBONACCI_OFFSETS.slice(),

      sphericalProjection: state.sphericalProjection,
      flatProjectionBlocked: state.flatProjectionBlocked,
      rotationAppliedBeforeProjection: state.rotationAppliedBeforeProjection,
      frontBackVisibility: state.frontBackVisibility,

      motionStateReady: state.motionStateReady,
      diagnosticStateReady: state.diagnosticStateReady,
      sphereCarrierReady: state.sphereCarrierReady,

      moisturePath: MOISTURE_PATH,
      moistureContract: MOISTURE_CONTRACT,
      moistureLoaded: state.moistureLoaded,
      moistureFieldReady: state.moistureFieldReady,
      moistureStatus: moistureStatus,

      cloudsPath: CLOUDS_PATH,
      cloudsContract: CLOUDS_CONTRACT,
      cloudsLoaded: state.cloudsLoaded,
      cloudRendererReady: state.cloudRendererReady,
      cloudStatus: cloudStatus,

      planetViewReady: state.planetViewReady,
      latticeViewReady: state.latticeViewReady,
      diagnosticScopeReady: state.diagnosticScopeReady,

      yaw: state.yaw,
      pitch: state.pitch,
      roll: state.roll,
      frameIndex: state.frameIndex,
      renderTime: state.renderTime,

      generatedImage: false,
      graphicBox: false,
      flatProjection: false,
      cssRingProof: false,
      earthCrossover: false,
      australiaNamingDrift: false,

      errors: state.errors.slice()
    };
  }

  function publish() {
    var api = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      init: init,
      setLens: setLens,
      resize: resize,
      pointerDown: pointerDown,
      pointerMove: pointerMove,
      pointerUp: pointerUp,
      reset: reset,
      tick: tick,
      getFrame: getFrame,
      getSeats: getSeats,
      getLinks: getLinks,
      getMoistureField: getMoistureField,
      getCloudLayer: getCloudLayer,
      ensureAtmosphereChildren: ensureAtmosphereChildren,
      status: status
    };

    window.AUDRALIA_TRUE_GLOBE_RUNTIME = api;
    window.AUDRALIA_TRUE_GLOBE_RUNTIME_STATUS = status();
    window.AUDRALIA_G2_TRUE_GLOBE_RUNTIME = api;
    window.AUDRALIA_G2_TRUE_GLOBE_RUNTIME_STATUS = status();

    return api;
  }

  function recordError(scope, error) {
    var message = error && error.message ? error.message : String(error || scope);

    state.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });

    window.AUDRALIA_TRUE_GLOBE_RUNTIME_ERROR = {
      contract: CONTRACT,
      scope: scope,
      message: message,
      errors: state.errors.slice()
    };

    return status();
  }

  function init(options) {
    try {
      options = options || {};

      state.activeLens = options.activeLens || state.activeLens;
      state.width = Math.max(320, Math.floor(finite(options.width, state.width)));
      state.height = Math.max(320, Math.floor(finite(options.height, state.height)));
      state.dpr = Math.max(1, finite(options.dpr, state.dpr));
      state.reducedMotion = typeof options.reducedMotion === "boolean"
        ? options.reducedMotion
        : detectReducedMotion();

      if (!state.seats.length) buildSphereCarrier();

      state.initialized = true;
      state.runtimeReady = true;
      state.motionStateReady = true;
      state.diagnosticStateReady = true;
      state.diagnosticScopeReady = true;

      if (state.activeLens === "planet") state.planetViewReady = true;
      if (state.activeLens === "lattice") state.latticeViewReady = true;

      resize(state.width, state.height, state.dpr);
      ensureAtmosphereChildren();
      publish();

      return getFrame();
    } catch (error) {
      recordError("init", error);
      publish();
      return getFrame();
    }
  }

  window.AUDRALIA_TRUE_GLOBE_RUNTIME_BOOT = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    standard: STANDARD,
    family: FAMILY,
    file: FILE,
    moisturePath: MOISTURE_PATH,
    cloudPath: CLOUDS_PATH,
    bootedAt: new Date().toISOString(),
    meaning: "Runtime file evaluated. Runtime now loads moisture/cloud children and exposes cloud layer data for the route renderer."
  };

  publish();
  init();
})();
