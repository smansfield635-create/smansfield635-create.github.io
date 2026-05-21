// /assets/audralia/clean/runtime/audralia.true-globe.runtime.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_GLOBE_RUNTIME_SURFACE_RENDERER_MANIFEST_CONSUMER_TNT_v6
//
// Public runtime contract intentionally preserved for route JS compatibility:
// AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2
//
// Existing route-confirmed capability marker preserved:
// AUDRALIA_G2_TRUE_GLOBE_RUNTIME_TERRAIN_ECOSYSTEM_MANIFEST_CONSUMER_TNT_v5
//
// New internal capability marker:
// AUDRALIA_G2_TRUE_GLOBE_RUNTIME_SURFACE_RENDERER_MANIFEST_CONSUMER_TNT_v6
//
// Consumes manifest:
// /assets/audralia/clean/runtime/audralia.true-globe.family.manifest.js
//
// Purpose:
// - Preserve runtime public compatibility.
// - Preserve protected Lattice View.
// - Load family manifest first.
// - Load terrain/ecosystem forcing child.
// - Load moisture child.
// - Load Gratitude surface renderer child.
// - Load cloud child after surface availability.
// - Expose surface layer on runtime frame.
// - Preserve cloud-over-surface draw order authority.
// - Do not draw.
// - Do not create canvas.
// - Do not touch HTML.
// - Do not touch route JS.
// - No generated image. No GraphicBox. No flat projection.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2";
  var CHILD_KEY_RENEWAL_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_ORGANIC_CLOUD_CHILD_KEY_RENEWAL_TNT_v3";
  var TERRAIN_ECOSYSTEM_CONSUMER_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_TERRAIN_ECOSYSTEM_MANIFEST_CONSUMER_TNT_v5";
  var SURFACE_RENDERER_CONSUMER_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_SURFACE_RENDERER_MANIFEST_CONSUMER_TNT_v6";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_TERRAIN_ECOSYSTEM_MANIFEST_CONSUMER_TNT_v5";
  var STANDARD = "AUDRALIA_G2_GRATITUDE_CONTINENT_SURFACE_VISUALIZATION_SPEC_OPS_v1";
  var FAMILY_STANDARD = "AUDRALIA_G2_PARENT_CHILD_CONTRACT_HANDSHAKE_AND_FAMILY_MANIFEST_STANDARD_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.runtime.js";

  var MANIFEST_PATH = "/assets/audralia/clean/runtime/audralia.true-globe.family.manifest.js";
  var MANIFEST_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_FAMILY_MANIFEST_PARENT_CHILD_HANDSHAKE_TNT_v1";

  var FALLBACK_TERRAIN_ECOSYSTEM = {
    path: "/assets/audralia/clean/runtime/audralia.true-globe.terrain-ecosystem.js",
    publicContract: "AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_FORCING_FIELD_CHILD_TNT_v1",
    cacheKey: "AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_FORCING_FIELD_CHILD_TNT_v1",
    capabilityField: "contract",
    capabilityMarker: "AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_FORCING_FIELD_CHILD_TNT_v1"
  };

  var FALLBACK_MOISTURE = {
    path: "/assets/audralia/clean/runtime/audralia.true-globe.moisture.js",
    publicContract: "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1",
    cacheKey: "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_TERRAIN_FORCING_CONSUMER_TNT_v2",
    capabilityField: "contract",
    capabilityMarker: "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1"
  };

  var FALLBACK_SURFACE = {
    path: "/assets/audralia/clean/runtime/audralia.true-globe.surface.js",
    publicContract: "AUDRALIA_G2_TRUE_RUNTIME_GRATITUDE_CONTINENT_SURFACE_RENDERER_CHILD_TNT_v1",
    cacheKey: "AUDRALIA_G2_TRUE_RUNTIME_GRATITUDE_CONTINENT_SURFACE_RENDERER_CHILD_TNT_v1",
    capabilityField: "contract",
    capabilityMarker: "AUDRALIA_G2_TRUE_RUNTIME_GRATITUDE_CONTINENT_SURFACE_RENDERER_CHILD_TNT_v1"
  };

  var FALLBACK_CLOUDS = {
    path: "/assets/audralia/clean/runtime/audralia.true-globe.clouds.js",
    publicContract: "AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2",
    cacheKey: "AUDRALIA_G2_TRUE_RUNTIME_GLOBAL_MULTI_LAYER_CLOUD_SHELL_CHILD_TNT_v5",
    capabilityField: "lifecycleConservationContract",
    capabilityMarker: "AUDRALIA_G2_TRUE_RUNTIME_CLOUD_LIFECYCLE_CONSERVATION_CHILD_TNT_v3"
  };

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

    manifestApi: null,
    manifestLoaded: false,
    manifestLoading: false,
    manifestReady: false,

    terrainEcosystemApi: null,
    terrainEcosystemLoaded: false,
    terrainEcosystemLoading: false,
    terrainEcosystemField: null,
    terrainEcosystemReady: false,

    moistureApi: null,
    moistureLoaded: false,
    moistureLoading: false,
    moistureField: null,
    moistureFieldReady: false,

    surfaceApi: null,
    surfaceLoaded: false,
    surfaceLoading: false,
    surfaceLayer: null,
    surfaceRendererReady: false,
    gratitudeContinentVisible: false,

    cloudsApi: null,
    cloudsLoaded: false,
    cloudsLoading: false,
    cloudLayer: null,
    cloudRendererReady: false,

    sphericalProjection: true,
    flatProjectionBlocked: true,
    rotationAppliedBeforeProjection: true,
    frontBackVisibility: true,

    motionStateReady: false,
    diagnosticStateReady: false,
    sphereCarrierReady: false,

    parentAcceptsByPublicContract: true,
    parentFetchesByCacheKey: true,
    parentVerifiesChildCapabilityMarker: true,
    staleGlobalRejectedIfCapabilityMissing: true,

    terrainForcingDrivesMoisture: true,
    moistureDrivesClouds: true,
    surfaceDrawsBeforeClouds: true,
    cloudsRenderAboveSurface: true,
    terrainDirectCloudPaint: false,

    organicCloudChildRequested: false,
    runtimeCloudChildKeyCurrent: true,

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

  function clonePoint(point) {
    return { x: point.x, y: point.y, z: point.z };
  }

  function normalize3(point) {
    var length = Math.hypot(point.x, point.y, point.z) || 1;
    return { x: point.x / length, y: point.y / length, z: point.z / length };
  }

  function getNestedValue(source, path) {
    if (!source || !path) return undefined;

    var parts = String(path).split(".");
    var cursor = source;

    for (var i = 0; i < parts.length; i += 1) {
      if (cursor == null) return undefined;
      cursor = cursor[parts[i]];
    }

    return cursor;
  }

  function apiStatus(api) {
    if (!api) return null;

    if (typeof api.status === "function") {
      try {
        return api.status();
      } catch (error) {
        return {
          error: true,
          message: error && error.message ? error.message : String(error)
        };
      }
    }

    return api;
  }

  function getManifestApi() {
    return window.AUDRALIA_TRUE_GLOBE_FAMILY_MANIFEST ||
      window.AUDRALIA_G2_TRUE_GLOBE_FAMILY_MANIFEST ||
      null;
  }

  function getTerrainEcosystemApi() {
    return window.AUDRALIA_TRUE_GLOBE_TERRAIN_ECOSYSTEM ||
      window.AUDRALIA_G2_TRUE_GLOBE_TERRAIN_ECOSYSTEM ||
      null;
  }

  function getMoistureApi() {
    return window.AUDRALIA_TRUE_GLOBE_MOISTURE ||
      window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE ||
      null;
  }

  function getSurfaceApi() {
    return window.AUDRALIA_TRUE_GLOBE_SURFACE ||
      window.AUDRALIA_G2_TRUE_GLOBE_SURFACE ||
      null;
  }

  function getCloudsApi() {
    return window.AUDRALIA_TRUE_GLOBE_CLOUDS ||
      window.AUDRALIA_G2_TRUE_GLOBE_CLOUDS ||
      null;
  }

  function getManifestEntry(entryName) {
    var manifest = state.manifestApi || getManifestApi();

    if (manifest && typeof manifest.getEntry === "function") {
      try {
        var entry = manifest.getEntry(entryName);
        if (entry) return entry;
      } catch (_error) {}
    }

    if (entryName === "terrainEcosystem") return FALLBACK_TERRAIN_ECOSYSTEM;
    if (entryName === "moisture") return FALLBACK_MOISTURE;
    if (entryName === "surface") return FALLBACK_SURFACE;
    if (entryName === "clouds") return FALLBACK_CLOUDS;

    return null;
  }

  function buildEntryUrl(entry) {
    if (!entry || !entry.path) return "";
    var key = entry.cacheKey || entry.publicContract || SURFACE_RENDERER_CONSUMER_CONTRACT;
    return entry.path + "?v=" + encodeURIComponent(key);
  }

  function validateApiAgainstEntry(entryName, api) {
    var entry = getManifestEntry(entryName);
    var status = apiStatus(api);

    if (!entry) {
      return {
        ok: false,
        entryName: entryName,
        reason: "ENTRY_MISSING"
      };
    }

    if (!status) {
      return {
        ok: false,
        entryName: entryName,
        reason: "STATUS_MISSING",
        expectedPublicContract: entry.publicContract,
        expectedCapabilityField: entry.capabilityField,
        expectedCapabilityMarker: entry.capabilityMarker
      };
    }

    var publicContract = status.contract || "";
    var capabilityValue = getNestedValue(status, entry.capabilityField);

    var publicOk = publicContract === entry.publicContract;
    var capabilityOk = capabilityValue === entry.capabilityMarker;

    return {
      ok: Boolean(publicOk && capabilityOk),
      entryName: entryName,
      publicContractOk: publicOk,
      capabilityOk: capabilityOk,
      expectedPublicContract: entry.publicContract,
      actualPublicContract: publicContract,
      expectedCapabilityField: entry.capabilityField,
      expectedCapabilityMarker: entry.capabilityMarker,
      actualCapabilityMarker: capabilityValue || "",
      cacheKey: entry.cacheKey,
      fetchUrl: buildEntryUrl(entry),
      reason: publicOk && capabilityOk
        ? "PASS"
        : !publicOk
          ? "PUBLIC_CONTRACT_MISMATCH"
          : "CAPABILITY_MARKER_MISSING_OR_STALE"
    };
  }

  function childApiMatches(entryName, api) {
    return validateApiAgainstEntry(entryName, api).ok;
  }

  function getChildApi(entryName) {
    if (entryName === "terrainEcosystem") return getTerrainEcosystemApi();
    if (entryName === "moisture") return getMoistureApi();
    if (entryName === "surface") return getSurfaceApi();
    if (entryName === "clouds") return getCloudsApi();
    return null;
  }

  function removeWrongChildScripts(entryName, entry) {
    var scripts = document.querySelectorAll("script[data-audralia-runtime-child='" + entryName + "']");
    var i;

    for (i = 0; i < scripts.length; i += 1) {
      var script = scripts[i];
      var key = script.getAttribute("data-cache-key") || script.getAttribute("data-contract") || "";

      if (key && key !== entry.cacheKey) {
        try { script.remove(); } catch (_error) {}
      }
    }
  }

  function loadScript(path, cacheKey, attrs) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = path + "?v=" + encodeURIComponent(cacheKey);
      script.async = true;
      script.defer = true;

      attrs = attrs || {};
      Object.keys(attrs).forEach(function (key) {
        script.setAttribute(key, attrs[key]);
      });

      script.onload = function () { resolve(script); };
      script.onerror = function () {
        reject(new Error("AUDRALIA_SCRIPT_LOAD_FAILED_" + path + "_" + cacheKey));
      };

      document.head.appendChild(script);
    });
  }

  function loadManifestOnce() {
    return new Promise(function (resolve, reject) {
      var existing = getManifestApi();

      if (existing && typeof existing.status === "function") {
        state.manifestApi = existing;
        state.manifestLoaded = true;
        state.manifestReady = true;
        resolve(existing);
        return;
      }

      if (state.manifestLoading) {
        var attempts = 0;
        var interval = window.setInterval(function () {
          attempts += 1;
          var api = getManifestApi();

          if (api && typeof api.status === "function") {
            window.clearInterval(interval);
            state.manifestApi = api;
            state.manifestLoaded = true;
            state.manifestReady = true;
            resolve(api);
          }

          if (attempts > 80) {
            window.clearInterval(interval);
            reject(new Error("AUDRALIA_FAMILY_MANIFEST_WAIT_TIMEOUT"));
          }
        }, 50);

        return;
      }

      state.manifestLoading = true;

      loadScript(MANIFEST_PATH, MANIFEST_CONTRACT, {
        "data-audralia-runtime-family-manifest": SURFACE_RENDERER_CONSUMER_CONTRACT,
        "data-contract": MANIFEST_CONTRACT,
        "data-cache-key": MANIFEST_CONTRACT
      }).then(function () {
        var api = getManifestApi();

        if (!api || typeof api.status !== "function") {
          reject(new Error("AUDRALIA_FAMILY_MANIFEST_LOADED_GLOBAL_MISSING"));
          return;
        }

        state.manifestApi = api;
        state.manifestLoaded = true;
        state.manifestReady = true;
        state.manifestLoading = false;
        resolve(api);
      }).catch(function (error) {
        state.manifestLoading = false;
        reject(error);
      });
    });
  }

  function loadChildFromManifest(entryName) {
    return new Promise(function (resolve, reject) {
      var entry = getManifestEntry(entryName);

      if (!entry) {
        reject(new Error("AUDRALIA_CHILD_ENTRY_MISSING_" + entryName));
        return;
      }

      var existing = getChildApi(entryName);
      var existingValidation = validateApiAgainstEntry(entryName, existing);

      if (existingValidation.ok) {
        resolve(existing);
        return;
      }

      removeWrongChildScripts(entryName, entry);

      var existingScript = document.querySelector(
        "script[data-audralia-runtime-child='" + entryName + "'][data-cache-key='" + entry.cacheKey + "']"
      );

      if (existingScript) {
        var attempts = 0;
        var interval = window.setInterval(function () {
          attempts += 1;
          var api = getChildApi(entryName);

          if (childApiMatches(entryName, api)) {
            window.clearInterval(interval);
            resolve(api);
          }

          if (attempts > 80) {
            window.clearInterval(interval);
            reject(new Error("AUDRALIA_CHILD_WAIT_TIMEOUT_" + entryName + "_" + entry.cacheKey));
          }
        }, 50);

        return;
      }

      loadScript(entry.path, entry.cacheKey, {
        "data-audralia-runtime-child": entryName,
        "data-public-contract": entry.publicContract,
        "data-cache-key": entry.cacheKey,
        "data-capability-field": entry.capabilityField,
        "data-capability-marker": entry.capabilityMarker,
        "data-manifest-contract": MANIFEST_CONTRACT,
        "data-runtime-consumer-contract": SURFACE_RENDERER_CONSUMER_CONTRACT
      }).then(function () {
        var api = getChildApi(entryName);
        var validation = validateApiAgainstEntry(entryName, api);

        if (!validation.ok) {
          reject(new Error("AUDRALIA_CHILD_LOADED_BUT_HANDSHAKE_FAILED_" + entryName + "_" + validation.reason));
          return;
        }

        resolve(api);
      }).catch(reject);
    });
  }

  function ensureAtmosphereChildren() {
    if (
      state.manifestLoading ||
      state.terrainEcosystemLoading ||
      state.moistureLoading ||
      state.surfaceLoading ||
      state.cloudsLoading
    ) {
      return;
    }

    loadManifestOnce()
      .then(function () {
        state.terrainEcosystemLoading = true;
        return loadChildFromManifest("terrainEcosystem");
      })
      .then(function (terrainApi) {
        state.terrainEcosystemApi = terrainApi;
        state.terrainEcosystemLoaded = true;
        state.terrainEcosystemReady = true;
        state.terrainEcosystemLoading = false;

        buildTerrainEcosystemFrameData();

        state.moistureLoading = true;
        return loadChildFromManifest("moisture");
      })
      .then(function (moistureApi) {
        state.moistureApi = moistureApi;
        state.moistureLoaded = true;
        state.moistureFieldReady = true;
        state.moistureLoading = false;

        buildAtmosphereFrameData();

        state.surfaceLoading = true;
        return loadChildFromManifest("surface");
      })
      .then(function (surfaceApi) {
        state.surfaceApi = surfaceApi;
        state.surfaceLoaded = true;
        state.surfaceLoading = false;
        state.surfaceRendererReady = true;

        buildSurfaceFrameData();

        state.cloudsLoading = true;
        state.organicCloudChildRequested = true;

        return loadChildFromManifest("clouds");
      })
      .then(function (cloudsApi) {
        state.cloudsApi = cloudsApi;
        state.cloudsLoaded = true;
        state.cloudsLoading = false;
        state.cloudRendererReady = true;
        state.runtimeCloudChildKeyCurrent = true;
        state.diagnosticStateReady = true;

        buildAtmosphereFrameData();
        publish();
      })
      .catch(function (error) {
        state.manifestLoading = false;
        state.terrainEcosystemLoading = false;
        state.moistureLoading = false;
        state.surfaceLoading = false;
        state.cloudsLoading = false;
        recordError("ensureAtmosphereChildren", error);
        publish();
      });
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

    return { x: x2, y: y2, z: z };
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
      renderPriority: radialIndex % 4 === 0 ? 1 : radialIndex % 2 === 0 ? 0.74 : 0.54,
      connectionPriority: radialIndex % 4 === 0 ? 1 : radialIndex % 2 === 0 ? 0.70 : 0.48,
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

  function buildProjectedFrame() {
    var i;
    var projectedSeats = [];

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
      childKeyRenewalContract: CHILD_KEY_RENEWAL_CONTRACT,
      terrainEcosystemConsumerContract: TERRAIN_ECOSYSTEM_CONSUMER_CONTRACT,
      surfaceRendererConsumerContract: SURFACE_RENDERER_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      familyStandard: FAMILY_STANDARD,
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

      runtimeReady: state.runtimeReady,
      motionStateReady: state.motionStateReady,
      diagnosticStateReady: state.diagnosticStateReady,
      planetViewReady: state.planetViewReady,
      latticeViewReady: state.latticeViewReady,
      diagnosticScopeReady: state.diagnosticScopeReady,

      manifestLoaded: state.manifestLoaded,
      manifestReady: state.manifestReady,

      terrainEcosystemLoaded: state.terrainEcosystemLoaded,
      terrainEcosystemReady: state.terrainEcosystemReady,
      terrainEcosystemField: state.terrainEcosystemField,

      moistureLoaded: state.moistureLoaded,
      moistureFieldReady: state.moistureFieldReady,
      moistureField: state.moistureField,

      surfaceLoaded: state.surfaceLoaded,
      surfaceRendererReady: state.surfaceRendererReady,
      surfaceLayer: state.surfaceLayer,
      gratitudeContinentVisible: state.gratitudeContinentVisible,

      cloudsLoaded: state.cloudsLoaded,
      cloudRendererReady: state.cloudRendererReady,
      cloudLayer: state.cloudLayer,

      parentAcceptsByPublicContract: true,
      parentFetchesByCacheKey: true,
      parentVerifiesChildCapabilityMarker: true,
      staleGlobalRejectedIfCapabilityMissing: true,

      terrainForcingDrivesMoisture: true,
      moistureDrivesClouds: true,
      surfaceDrawsBeforeClouds: true,
      cloudsRenderAboveSurface: true,
      terrainDirectCloudPaint: false,

      organicCloudChildRequested: state.organicCloudChildRequested,
      runtimeCloudChildKeyCurrent: state.runtimeCloudChildKeyCurrent
    };
  }

  function buildTerrainEcosystemFrameData() {
    state.terrainEcosystemApi = state.terrainEcosystemApi || getTerrainEcosystemApi();
    state.terrainEcosystemLoaded = childApiMatches("terrainEcosystem", state.terrainEcosystemApi);

    if (state.terrainEcosystemLoaded && typeof state.terrainEcosystemApi.getField === "function") {
      try {
        state.terrainEcosystemField = state.terrainEcosystemApi.getField(buildFrameBase());
        state.terrainEcosystemReady = Boolean(
          state.terrainEcosystemField &&
          state.terrainEcosystemField.forcingFieldReady
        );
      } catch (error) {
        recordError("terrainEcosystemField", error);
      }
    }
  }

  function buildMoistureFrameData() {
    var frame = buildFrameBase();
    frame.terrainEcosystemField = state.terrainEcosystemField;

    state.moistureApi = state.moistureApi || getMoistureApi();
    state.moistureLoaded = childApiMatches("moisture", state.moistureApi);

    if (state.moistureLoaded && typeof state.moistureApi.getField === "function") {
      try {
        state.moistureField = state.moistureApi.getField(frame);
        state.moistureFieldReady = Boolean(state.moistureField && state.moistureField.moistureFieldReady);
      } catch (error) {
        recordError("moistureField", error);
      }
    }
  }

  function buildSurfaceFrameData() {
    var frame = buildFrameBase();
    frame.terrainEcosystemField = state.terrainEcosystemField;
    frame.moistureField = state.moistureField;

    state.surfaceApi = state.surfaceApi || getSurfaceApi();
    state.surfaceLoaded = childApiMatches("surface", state.surfaceApi);

    if (state.surfaceLoaded && typeof state.surfaceApi.buildSurfaceLayer === "function") {
      try {
        state.surfaceLayer = state.surfaceApi.buildSurfaceLayer(frame);
        state.surfaceRendererReady = Boolean(
          state.surfaceLayer &&
          state.surfaceLayer.surfaceRendererReady
        );
        state.gratitudeContinentVisible = Boolean(
          state.surfaceLayer &&
          state.surfaceLayer.gratitudeContinentVisible
        );
      } catch (error) {
        recordError("surfaceLayer", error);
      }
    }
  }

  function buildCloudFrameData() {
    var frame = buildFrameBase();
    frame.terrainEcosystemField = state.terrainEcosystemField;
    frame.moistureField = state.moistureField;
    frame.surfaceLayer = state.surfaceLayer;

    state.cloudsApi = state.cloudsApi || getCloudsApi();
    state.cloudsLoaded = childApiMatches("clouds", state.cloudsApi);
    state.runtimeCloudChildKeyCurrent = state.cloudsLoaded;

    if (state.cloudsLoaded && typeof state.cloudsApi.buildLayer === "function") {
      try {
        state.cloudLayer = state.cloudsApi.buildLayer(frame);
        state.cloudRendererReady = Boolean(state.cloudLayer && state.cloudLayer.rendererReady);
      } catch (error) {
        recordError("cloudLayer", error);
      }
    }
  }

  function buildAtmosphereFrameData() {
    state.manifestApi = state.manifestApi || getManifestApi();
    state.manifestLoaded = Boolean(state.manifestApi);
    state.manifestReady = Boolean(state.manifestApi);

    state.terrainEcosystemApi = state.terrainEcosystemApi || getTerrainEcosystemApi();
    state.moistureApi = state.moistureApi || getMoistureApi();
    state.surfaceApi = state.surfaceApi || getSurfaceApi();
    state.cloudsApi = state.cloudsApi || getCloudsApi();

    buildTerrainEcosystemFrameData();
    buildMoistureFrameData();
    buildSurfaceFrameData();
    buildCloudFrameData();
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
    var dx = nextX - state.pointerX;
    var dy = nextY - state.pointerY;

    state.pointerX = nextX;
    state.pointerY = nextY;
    state.pointerTime = finite(time, now());

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
    frame.terrainEcosystemField = state.terrainEcosystemField;
    frame.moistureField = state.moistureField;
    frame.surfaceLayer = state.surfaceLayer;
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

  function getTerrainEcosystemField() {
    buildTerrainEcosystemFrameData();
    return state.terrainEcosystemField;
  }

  function getMoistureField() {
    buildAtmosphereFrameData();
    return state.moistureField;
  }

  function getSurfaceLayer() {
    buildAtmosphereFrameData();
    return state.surfaceLayer;
  }

  function getCloudLayer() {
    buildAtmosphereFrameData();
    return state.cloudLayer;
  }

  function status() {
    var terrainEntry = getManifestEntry("terrainEcosystem") || FALLBACK_TERRAIN_ECOSYSTEM;
    var moistureEntry = getManifestEntry("moisture") || FALLBACK_MOISTURE;
    var surfaceEntry = getManifestEntry("surface") || FALLBACK_SURFACE;
    var cloudEntry = getManifestEntry("clouds") || FALLBACK_CLOUDS;

    var terrainStatus = state.terrainEcosystemApi && typeof state.terrainEcosystemApi.status === "function"
      ? state.terrainEcosystemApi.status()
      : null;

    var moistureStatus = state.moistureApi && typeof state.moistureApi.status === "function"
      ? state.moistureApi.status()
      : null;

    var surfaceStatus = state.surfaceApi && typeof state.surfaceApi.status === "function"
      ? state.surfaceApi.status()
      : null;

    var cloudStatus = state.cloudsApi && typeof state.cloudsApi.status === "function"
      ? state.cloudsApi.status()
      : null;

    var manifestStatus = state.manifestApi && typeof state.manifestApi.status === "function"
      ? state.manifestApi.status()
      : null;

    return {
      contract: CONTRACT,
      childKeyRenewalContract: CHILD_KEY_RENEWAL_CONTRACT,
      terrainEcosystemConsumerContract: TERRAIN_ECOSYSTEM_CONSUMER_CONTRACT,
      surfaceRendererConsumerContract: SURFACE_RENDERER_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      familyStandard: FAMILY_STANDARD,
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

      manifestPath: MANIFEST_PATH,
      manifestContract: MANIFEST_CONTRACT,
      manifestLoaded: state.manifestLoaded,
      manifestReady: state.manifestReady,
      manifestStatus: manifestStatus,

      terrainEcosystemPath: terrainEntry.path,
      terrainEcosystemPublicContract: terrainEntry.publicContract,
      terrainEcosystemCacheKey: terrainEntry.cacheKey,
      terrainEcosystemLoaded: state.terrainEcosystemLoaded,
      terrainEcosystemReady: state.terrainEcosystemReady,
      terrainEcosystemStatus: terrainStatus,
      terrainEcosystemHandshake: validateApiAgainstEntry("terrainEcosystem", state.terrainEcosystemApi),

      moisturePath: moistureEntry.path,
      moisturePublicContract: moistureEntry.publicContract,
      moistureCacheKey: moistureEntry.cacheKey,
      moistureLoaded: state.moistureLoaded,
      moistureFieldReady: state.moistureFieldReady,
      moistureStatus: moistureStatus,
      moistureHandshake: validateApiAgainstEntry("moisture", state.moistureApi),

      surfacePath: surfaceEntry.path,
      surfacePublicContract: surfaceEntry.publicContract,
      surfaceCacheKey: surfaceEntry.cacheKey,
      surfaceLoaded: state.surfaceLoaded,
      surfaceRendererReady: state.surfaceRendererReady,
      gratitudeContinentVisible: state.gratitudeContinentVisible,
      surfaceStatus: surfaceStatus,
      surfaceHandshake: validateApiAgainstEntry("surface", state.surfaceApi),

      cloudsPath: cloudEntry.path,
      cloudsPublicContract: cloudEntry.publicContract,
      cloudsCacheKey: cloudEntry.cacheKey,
      cloudsLoaded: state.cloudsLoaded,
      cloudRendererReady: state.cloudRendererReady,
      cloudStatus: cloudStatus,
      cloudHandshake: validateApiAgainstEntry("clouds", state.cloudsApi),

      parentAcceptsByPublicContract: true,
      parentFetchesByCacheKey: true,
      parentVerifiesChildCapabilityMarker: true,
      staleGlobalRejectedIfCapabilityMissing: true,

      terrainForcingDrivesMoisture: true,
      moistureDrivesClouds: true,
      surfaceDrawsBeforeClouds: true,
      cloudsRenderAboveSurface: true,
      terrainDirectCloudPaint: false,

      runtimeCloudChildKeyCurrent: state.runtimeCloudChildKeyCurrent,
      organicCloudChildRequested: state.organicCloudChildRequested,

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
      childKeyRenewalContract: CHILD_KEY_RENEWAL_CONTRACT,
      terrainEcosystemConsumerContract: TERRAIN_ECOSYSTEM_CONSUMER_CONTRACT,
      surfaceRendererConsumerContract: SURFACE_RENDERER_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      familyStandard: FAMILY_STANDARD,
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
      getTerrainEcosystemField: getTerrainEcosystemField,
      getMoistureField: getMoistureField,
      getSurfaceLayer: getSurfaceLayer,
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
      childKeyRenewalContract: CHILD_KEY_RENEWAL_CONTRACT,
      terrainEcosystemConsumerContract: TERRAIN_ECOSYSTEM_CONSUMER_CONTRACT,
      surfaceRendererConsumerContract: SURFACE_RENDERER_CONSUMER_CONTRACT,
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
    childKeyRenewalContract: CHILD_KEY_RENEWAL_CONTRACT,
    terrainEcosystemConsumerContract: TERRAIN_ECOSYSTEM_CONSUMER_CONTRACT,
    surfaceRendererConsumerContract: SURFACE_RENDERER_CONSUMER_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    standard: STANDARD,
    familyStandard: FAMILY_STANDARD,
    family: FAMILY,
    file: FILE,
    manifestPath: MANIFEST_PATH,
    manifestContract: MANIFEST_CONTRACT,
    parentAcceptsByPublicContract: true,
    parentFetchesByCacheKey: true,
    parentVerifiesChildCapabilityMarker: true,
    staleGlobalRejectedIfCapabilityMissing: true,
    terrainEcosystemLoadsBeforeMoisture: true,
    moistureLoadsBeforeSurface: true,
    surfaceLoadsBeforeClouds: true,
    terrainForcingDrivesMoisture: true,
    moistureDrivesClouds: true,
    surfaceDrawsBeforeClouds: true,
    cloudsRenderAboveSurface: true,
    terrainDirectCloudPaint: false,
    bootedAt: new Date().toISOString(),
    meaning: "Runtime evaluated with Gratitude surface renderer manifest consumer. Surface layer is loaded after moisture and before clouds and exposed on frame.surfaceLayer."
  };

  publish();
  init();
})();
