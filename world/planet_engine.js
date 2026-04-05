Destination: /world/planet_engine.js

// /world/planet_engine.js
// MODE: CONTRACT EXECUTION
// STATUS: TRUE_ESM_ENGINE_FACTORY | CANONICAL_RUNTIME_ENGINE_SURFACE | NON-DRIFT

const VERSION = "PLANET_ENGINE_BASELINE_v2";
const ENGINE_ID = "PLANET_ENGINE";

const STATUS = Object.freeze({
  UNINITIALIZED: "UNINITIALIZED",
  BOOTSTRAPPING: "BOOTSTRAPPING",
  READY: "READY",
  CHECKPOINT_1_REACHED: "CHECKPOINT_1_REACHED",
  GAUGES_DEFERRED: "GAUGES_DEFERRED",
  ERROR: "ERROR"
});

const FIELD_CONSTANTS = Object.freeze({
  WIDTH: 256,
  HEIGHT: 256,
  DEFAULT_SEED: 25645161
});

function assert(condition, message) {
  if (!condition) {
    throw new Error(`[PLANET_ENGINE] ${message}`);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function freezeDeep(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => {
    freezeDeep(value[key]);
  });
  return Object.freeze(value);
}

function freezeCopy(value) {
  return freezeDeep(clone(value));
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function toFiniteNumber(value, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stableRound(value, places = 6) {
  const factor = 10 ** places;
  return Math.round(toFiniteNumber(value, 0) * factor) / factor;
}

function hash2(seed, x, y) {
  let h = (seed ^ (x * 374761393) ^ (y * 668265263)) >>> 0;
  h = (h ^ (h >> 13)) >>> 0;
  h = Math.imul(h, 1274126177) >>> 0;
  h = (h ^ (h >> 16)) >>> 0;
  return h / 4294967295;
}

function getKernel() {
  const kernel = globalThis.LiveRuntimeKernel;
  assert(kernel, "LiveRuntimeKernel is required before planet_engine boots");
  return kernel;
}

function createInitialState() {
  return {
    version: VERSION,
    engineId: ENGINE_ID,
    status: STATUS.UNINITIALIZED,
    baselineEstablished: false,
    kernelAttached: false,
    checkpoint1Reached: false,
    gaugesDeferred: true,
    liveTargets: {
      kernelFile: "/runtime/live_runtime_kernel.js",
      planetEngineFile: "/world/planet_engine.js",
      liveGaugesTarget: "/runtime/live_gauges_surface.js",
      runtimeReceiptTarget: "/world/planet_engine.js"
    },
    routeMap: {
      kernel: "/runtime/live_runtime_kernel.js",
      engine: "/world/planet_engine.js",
      gauges: "/runtime/live_gauges_surface.js"
    },
    parentStack: {
      status: "READY_FOR_LATER_BIND",
      filesCount: 0
    },
    runtimeBridge: {
      status: "READY"
    },
    runtimeState: {
      status: "READY"
    },
    lastError: null,
    events: [],
    lastUpdatedAt: null,
    fieldBuilds: 0
  };
}

function computeDirectionalForces(nx, ny, elevation, rainfall, basinStrength) {
  const north = clamp((1 - ny) * 0.55 + rainfall * 0.25 + basinStrength * 0.10, 0, 1);
  const south = clamp((ny + 1) * 0.275 + elevation * 0.30, 0, 1);
  const east = clamp((nx + 1) * 0.275 + elevation * 0.22, 0, 1);
  const west = clamp((1 - nx) * 0.275 + basinStrength * 0.22, 0, 1);
  const boundaryPressure = clamp(1 - elevation, 0, 1);

  return Object.freeze({
    N: stableRound(north),
    E: stableRound(east),
    S: stableRound(south),
    W: stableRound(west),
    B: stableRound(boundaryPressure)
  });
}

function computeProjectionPackets(x, y, width, height, latDeg, lonDeg) {
  const nx = width <= 1 ? 0 : x / (width - 1);
  const ny = height <= 1 ? 0 : y / (height - 1);

  const longitude = nx * (Math.PI * 2) - Math.PI;
  const latitude = (0.5 - ny) * Math.PI;

  return Object.freeze({
    flat: Object.freeze({
      kind: "flat",
      x,
      y,
      width,
      height
    }),
    tree: Object.freeze({
      kind: "tree",
      root: Math.max(0, Math.min(8, Math.floor(nx * 9))),
      branch: `${Math.max(0, Math.min(8, Math.floor(nx * 9)))}:${Math.max(0, Math.min(15, Math.floor(ny * 16)))}`,
      leaf: Math.max(0, Math.min(15, Math.floor(ny * 16))),
      width: 9,
      height: 16
    }),
    globe: Object.freeze({
      kind: "globe",
      longitude: stableRound(longitude, 12),
      latitude: stableRound(latitude, 12),
      x: stableRound(Math.cos(latitude) * Math.sin(longitude), 12),
      y: stableRound(Math.sin(latitude), 12),
      z: stableRound(Math.cos(latitude) * Math.cos(longitude), 12),
      latDeg: stableRound(latDeg, 6),
      lonDeg: stableRound(lonDeg, 6)
    })
  });
}

function classifyTerrain(elevation, slope, temperature, rainfall, basinStrength, ridgeStrength, freezePotential) {
  if (freezePotential >= 0.74) return { terrainClass: "POLAR_ICE", biomeType: "GLACIER", surfaceMaterial: "ICE" };
  if (elevation >= 0.82 && slope >= 0.52) return { terrainClass: "SUMMIT", biomeType: "TUNDRA", surfaceMaterial: "STONE" };
  if (elevation >= 0.68 && ridgeStrength >= 0.48) return { terrainClass: "MOUNTAIN", biomeType: "FOREST", surfaceMaterial: "STONE" };
  if (ridgeStrength >= 0.58) return { terrainClass: "RIDGE", biomeType: "GRASSLAND", surfaceMaterial: "STONE" };
  if (basinStrength >= 0.66 && rainfall >= 0.56) return { terrainClass: "BASIN", biomeType: "WETLAND", surfaceMaterial: "SOIL" };
  if (rainfall < 0.24 && temperature > 0.58) return { terrainClass: "PLAIN", biomeType: "DESERT", surfaceMaterial: "SAND" };
  if (slope < 0.16 && rainfall >= 0.46) return { terrainClass: "PLATEAU", biomeType: "GRASSLAND", surfaceMaterial: "SOIL" };
  return { terrainClass: "PLAIN", biomeType: "FOREST", surfaceMaterial: "SOIL" };
}

function buildPlanetFrame(frameState = {}, options = {}) {
  const source = normalizeObject(options);
  const seed = Number.isFinite(source.seed) ? source.seed : FIELD_CONSTANTS.DEFAULT_SEED;
  const width = Number.isInteger(source.width) && source.width > 0 ? source.width : FIELD_CONSTANTS.WIDTH;
  const height = Number.isInteger(source.height) && source.height > 0 ? source.height : FIELD_CONSTANTS.HEIGHT;
  const elapsedSeconds = Math.max(0, toFiniteNumber(normalizeObject(frameState).elapsedSeconds, 0));

  const samples = [];
  const summary = {
    defaultCursor: {
      x: Math.floor(width / 2),
      y: Math.floor(height / 2)
    }
  };

  for (let y = 0; y < height; y += 1) {
    const row = [];
    const ny = height <= 1 ? 0 : (y / (height - 1)) * 2 - 1;
    const latDeg = 90 - (y / Math.max(1, height - 1)) * 180;

    for (let x = 0; x < width; x += 1) {
      const nx = width <= 1 ? 0 : (x / (width - 1)) * 2 - 1;
      const lonDeg = (x / Math.max(1, width - 1)) * 360 - 180;

      const n1 = hash2(seed, x, y);
      const n2 = hash2(seed ^ 0x9e3779b9, x * 3 + 11, y * 5 + 7);
      const n3 = hash2(seed ^ 0x85ebca6b, x * 7 + 3, y * 11 + 13);

      const waveA = Math.sin((nx * Math.PI * 2.4) + n1 * 0.6);
      const waveB = Math.cos((ny * Math.PI * 2.0) + n2 * 0.8);
      const waveC = Math.sin(((nx + ny) * Math.PI * 1.6) + n3 * 0.7);

      const elevation = clamp(0.5 + waveA * 0.20 + waveB * 0.18 + waveC * 0.12 + (n1 - 0.5) * 0.10, 0, 1);
      const slope = clamp(Math.abs(waveA * 0.35) + Math.abs(waveC * 0.24), 0, 1);
      const curvature = clamp(waveB * 0.7 + (n2 - 0.5) * 0.25, -1, 1);
      const ridgeStrength = clamp(Math.max(0, waveA) * 0.58 + elevation * 0.24, 0, 1);
      const basinStrength = clamp(Math.max(0, -waveB) * 0.54 + (1 - elevation) * 0.20, 0, 1);
      const plateauStrength = clamp((1 - slope) * 0.52 + elevation * 0.18, 0, 1);
      const canyonStrength = clamp(Math.max(0, -waveC) * 0.48 + slope * 0.18, 0, 1);

      const temperature = clamp(1 - Math.abs(ny) * 0.82 - elevation * 0.22 + (n1 - 0.5) * 0.08, 0, 1);
      const seasonalTemperature = clamp(temperature * 0.92 + (n2 - 0.5) * 0.10, 0, 1);
      const rainfall = clamp((1 - Math.abs(nx) * 0.38) * 0.55 + basinStrength * 0.20 + (n3 - 0.5) * 0.20, 0, 1);
      const runoff = clamp(rainfall * 0.62 + slope * 0.22, 0, 1);
      const accumulation = clamp(basinStrength * 0.56 + rainfall * 0.24, 0, 1);
      const moisture = clamp(rainfall * 0.72 + basinStrength * 0.10, 0, 1);
      const freezePotential = clamp((1 - temperature) * 0.72 + elevation * 0.12, 0, 1);

      const terrain = classifyTerrain(
        elevation,
        slope,
        temperature,
        rainfall,
        basinStrength,
        ridgeStrength,
        freezePotential
      );

      const landMask = elevation >= 0.34 ? 1 : 0;
      const waterMask = landMask === 1 ? 0 : 1;
      const shorelineMask = elevation >= 0.30 && elevation <= 0.38 ? 1 : 0;

      const boundaryClassification =
        waterMask === 1 ? "BLOCK" :
        shorelineMask === 1 ? "BRIDGE" :
        ridgeStrength >= 0.76 ? "GATE" :
        canyonStrength >= 0.72 ? "HOLD" :
        "OPEN";

      const thresholdAction = boundaryClassification === "BLOCK" ? "HALT" : "PASS";

      const regionId = `R-${Math.floor(x / 32)}-${Math.floor(y / 32)}`;
      const nodeId = `N-${x}-${y}`;
      const divideId = `D-${Math.floor(x / 64)}-${Math.floor(y / 64)}`;

      const forces = computeDirectionalForces(nx, ny, elevation, rainfall, basinStrength);

      const force = Object.freeze({
        vector: forces,
        dominantDirection:
          Object.entries(forces)
            .filter(([key]) => key !== "B")
            .sort((a, b) => b[1] - a[1])[0][0],
        magnitude: stableRound(
          Math.max(forces.N, forces.E, forces.S, forces.W)
        )
      });

      const projections = computeProjectionPackets(x, y, width, height, latDeg, lonDeg);

      const dynamicIllumination = clamp(
        0.35 + temperature * 0.30 + (1 - waterMask) * 0.18 + (Math.sin(elapsedSeconds * 0.1) * 0.03),
        0,
        1
      );

      row.push(freezeDeep({
        i: x - Math.floor(width / 2),
        j: y - Math.floor(height / 2),
        region: {
          regionId,
          label: regionId
        },
        divide: {
          divideId,
          label: divideId
        },
        node: {
          nodeId,
          label: nodeId
        },
        boundary: {
          classification: boundaryClassification,
          label: boundaryClassification
        },
        force,
        terrainClass: terrain.terrainClass,
        biomeType: terrain.biomeType,
        surfaceMaterial: terrain.surfaceMaterial,
        climateBand: freezePotential >= 0.72 ? "POLAR" : temperature >= 0.66 ? "TROPICAL" : "TEMPERATE",
        climate: stableRound(temperature),
        moisture: stableRound(moisture),
        accumulation: stableRound(accumulation),
        shorelineMask,
        landMask,
        waterMask,
        habitability: stableRound(clamp((landMask * 0.6) + moisture * 0.2 + temperature * 0.2 - freezePotential * 0.2, 0, 1)),
        traversalDifficulty: stableRound(clamp(slope * 0.5 + waterMask * 0.8 + canyonStrength * 0.25, 0, 1)),
        fields: {
          boundaryPressure: forces.B,
          rainfall: stableRound(rainfall),
          runoff: stableRound(runoff),
          elevation: stableRound(elevation),
          slope: stableRound(slope)
        },
        derived: {
          latDeg: stableRound(latDeg),
          lonDeg: stableRound(lonDeg),
          nx: stableRound(nx),
          ny: stableRound(ny)
        },
        projections,
        receipt: {
          state: {
            i: x - Math.floor(width / 2),
            j: y - Math.floor(height / 2)
          },
          region: {
            regionId,
            label: regionId
          },
          node: {
            nodeId,
            label: nodeId
          },
          forces,
          boundary: boundaryClassification,
          timestamp: 0
        },
        threshold: {
          action: thresholdAction
        },
        dynamicIllumination: stableRound(dynamicIllumination),
        dynamicCloudBias: stableRound(clamp(rainfall * 0.55 + waterMask * 0.20, 0, 1)),
        dynamicStormBias: stableRound(clamp(rainfall * 0.45 + runoff * 0.20, 0, 1)),
        dynamicCurrentBias: stableRound(clamp(waterMask * 0.75 + shorelineMask * 0.18, 0, 1)),
        dynamicAuroraBias: stableRound(clamp(freezePotential * 0.55, 0, 1)),
        dynamicGlowBias: stableRound(clamp(ridgeStrength * 0.20 + dynamicIllumination * 0.25, 0, 1)),
        motionState: {
          elapsedSeconds: stableRound(elapsedSeconds),
          phase: stableRound((elapsedSeconds * 0.1) % (Math.PI * 2))
        },
        curvature: stableRound(curvature),
        ridgeStrength: stableRound(ridgeStrength),
        basinStrength: stableRound(basinStrength),
        canyonStrength: stableRound(canyonStrength),
        plateauStrength: stableRound(plateauStrength),
        strongestSummitScore: stableRound(clamp(elevation * ridgeStrength, 0, 1)),
        strongestBasinScore: stableRound(clamp((1 - elevation) * basinStrength, 0, 1)),
        backboneStrength: stableRound(clamp(ridgeStrength * 0.7 + slope * 0.2, 0, 1)),
        divideStrength: stableRound(clamp(ridgeStrength * 0.5 + plateauStrength * 0.2, 0, 1)),
        cavePotential: stableRound(clamp(canyonStrength * 0.5 + (1 - rainfall) * 0.2, 0, 1)),
        freezePotential: stableRound(freezePotential),
        temperature: stableRound(temperature),
        seasonalTemperature: stableRound(seasonalTemperature),
        rainfall: stableRound(rainfall),
        runoff: stableRound(runoff),
        basinAccumulation: stableRound(accumulation),
        drainage: waterMask === 1 ? "sea" : basinStrength >= 0.6 ? "basin" : "open",
        maritimeInfluence: stableRound(clamp((1 - Math.abs(nx)) * 0.55, 0, 1)),
        continentality: stableRound(clamp(Math.abs(nx) * 0.72, 0, 1)),
        rainShadowStrength: stableRound(clamp(ridgeStrength * 0.42, 0, 1)),
        evaporationPressure: stableRound(clamp(temperature * 0.62 + (1 - rainfall) * 0.18, 0, 1)),
        transportPotential: stableRound(clamp(runoff * 0.50 + slope * 0.18, 0, 1)),
        depositionPotential: stableRound(clamp(accumulation * 0.52 + basinStrength * 0.16, 0, 1)),
        sedimentLoad: stableRound(clamp(runoff * 0.35 + canyonStrength * 0.20, 0, 1)),
        distanceToWater: shorelineMask === 1 ? 0 : waterMask === 1 ? 0 : Math.max(1, Math.round((elevation - 0.34) * 100)),
        distanceToLand: waterMask === 1 ? Math.max(1, Math.round((0.34 - elevation) * 100)) : 0,
        compositionClass: ridgeStrength > 0.68 ? "PURITY_DOMINANT" : basinStrength > 0.58 ? "BASE_DOMINANT" : "PRECIOUS_DOMINANT",
        materialType: terrain.surfaceMaterial.toLowerCase(),
        sedimentType: basinStrength > 0.56 ? "fine" : "mixed",
        climateBandField: freezePotential >= 0.72 ? "COLD" : temperature >= 0.66 ? "HOT" : "MID",
        plateauRole: plateauStrength >= 0.66 ? "CORE" : plateauStrength >= 0.48 ? "OUTER" : "EDGE",
        flowClass: waterMask === 1 ? "SEA" : basinStrength >= 0.66 ? "LAKE" : runoff >= 0.58 ? "STREAM" : "NONE",
        shoreline: shorelineMask === 1,
        shorelineBand: shorelineMask === 1,
        riverCandidate: runoff >= 0.62 && waterMask === 0,
        lakeCandidate: basinStrength >= 0.70 && waterMask === 0,
        rangeId: ridgeStrength >= 0.66 ? `RANGE-${Math.floor(x / 24)}-${Math.floor(y / 24)}` : null,
        basinId: basinStrength >= 0.64 ? `BASIN-${Math.floor(x / 24)}-${Math.floor(y / 24)}` : null,
        plateauId: plateauStrength >= 0.64 ? `PLATEAU-${Math.floor(x / 32)}-${Math.floor(y / 32)}` : null,
        canyonId: canyonStrength >= 0.68 ? `CANYON-${Math.floor(x / 32)}-${Math.floor(y / 32)}` : null,
        creviceId: canyonStrength >= 0.74 ? `CREVICE-${Math.floor(x / 32)}-${Math.floor(y / 32)}` : null,
        valleyId: basinStrength >= 0.60 ? `VALLEY-${Math.floor(x / 32)}-${Math.floor(y / 32)}` : null,
        compositionWeight: stableRound(clamp(0.35 + ridgeStrength * 0.15 + basinStrength * 0.10, 0, 1)),
        preciousWeight: stableRound(clamp(ridgeStrength * 0.42 + n2 * 0.18, 0, 1)),
        baseWeight: stableRound(clamp(basinStrength * 0.45 + (1 - elevation) * 0.10, 0, 1)),
        regionalPurityWeight: stableRound(clamp(ridgeStrength * 0.25 + freezePotential * 0.10, 0, 1)),
        continentMacroWeight: stableRound(clamp(Math.abs(nx) * 0.35 + Math.abs(ny) * 0.20, 0, 1)),
        waterPurityWeight: stableRound(clamp((1 - runoff) * 0.25 + waterMask * 0.30, 0, 1)),
        mineralReflectanceWeight: stableRound(clamp(ridgeStrength * 0.24 + freezePotential * 0.20, 0, 1)),
        sedimentTintWeight: stableRound(clamp(basinStrength * 0.30 + accumulation * 0.15, 0, 1)),
        diamondDensity: stableRound(clamp(ridgeStrength * 0.28 + n1 * 0.12, 0, 1)),
        opalDensity: stableRound(clamp(freezePotential * 0.22 + n2 * 0.12, 0, 1)),
        graniteDensity: stableRound(clamp(elevation * 0.35 + ridgeStrength * 0.15, 0, 1)),
        marbleDensity: stableRound(clamp(plateauStrength * 0.24 + basinStrength * 0.10, 0, 1)),
        metalDensity: stableRound(clamp(ridgeStrength * 0.18 + canyonStrength * 0.12, 0, 1))
      }));
    }

    samples.push(freezeDeep(row));
  }

  return freezeDeep({
    width,
    height,
    samples,
    summary,
    motionContract: {
      deterministic: true,
      projectionModes: ["flat", "tree", "globe"]
    },
    timeState: {
      elapsedSeconds: stableRound(elapsedSeconds)
    }
  });
}

export function createPlanetEngine() {
  const subscribers = new Set();
  let state = createInitialState();

  function emit(type, payload) {
    state.events.push({
      type,
      at: nowIso(),
      payload: clone(payload || {})
    });
    state.lastUpdatedAt = nowIso();

    const snapshot = api.getState();
    subscribers.forEach((listener) => {
      try {
        listener(snapshot, type);
      } catch (_) {}
    });
  }

  function setStatus(nextStatus) {
    state.status = nextStatus;
    state.lastUpdatedAt = nowIso();
  }

  function withGuard(fn) {
    try {
      return fn();
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);
      setStatus(STATUS.ERROR);
      emit("PLANET_ENGINE_ERROR", { message: state.lastError });
      throw error;
    }
  }

  const api = {
    version: VERSION,

    buildPlanetFrame(frameState = {}, options = {}) {
      const field = buildPlanetFrame(frameState, options);
      state.fieldBuilds += 1;
      state.lastUpdatedAt = nowIso();
      return field;
    },

    getState() {
      return freezeCopy(state);
    },

    subscribe(listener) {
      assert(typeof listener === "function", "subscribe requires a function");
      subscribers.add(listener);
      return function unsubscribe() {
        subscribers.delete(listener);
      };
    },

    establishBaseline(config) {
      return withGuard(function () {
        const input = config || {};
        const kernel = getKernel();

        setStatus(STATUS.BOOTSTRAPPING);

        state.liveTargets.kernelFile = input.kernelFile || state.liveTargets.kernelFile;
        state.liveTargets.planetEngineFile =
          input.planetEngineFile || state.liveTargets.planetEngineFile;
        state.liveTargets.liveGaugesTarget =
          input.liveGaugesTarget || state.liveTargets.liveGaugesTarget;
        state.liveTargets.runtimeReceiptTarget =
          input.runtimeReceiptTarget || state.liveTargets.runtimeReceiptTarget;

        state.routeMap = {
          kernel: state.liveTargets.kernelFile,
          engine: state.liveTargets.planetEngineFile,
          gauges: state.liveTargets.liveGaugesTarget
        };

        const kernelState = kernel.getState ? kernel.getState() : null;
        const kernelAlreadyInitialized =
          kernelState && kernelState.kernel && kernelState.kernel.initialized;

        if (!kernelAlreadyInitialized) {
          kernel.initializeKernel({
            kernelId: "LIVE_RUNTIME_KERNEL",
            scope: "planet-engine-line"
          });
        }

        kernel.bindTargets({
          liveGaugesTarget: state.liveTargets.liveGaugesTarget,
          runtimeReceiptTarget: state.liveTargets.runtimeReceiptTarget,
          routeMap: state.routeMap
        });

        kernel.attachRuntime({
          receiptTarget: state.liveTargets.runtimeReceiptTarget,
          runtimeReceiptTarget: state.liveTargets.runtimeReceiptTarget,
          routeMap: state.routeMap,
          bridgeStatus: "READY",
          liveState: "READY"
        });

        kernel.setParentStackStatus(
          input.parentStackStatus || "READY_FOR_LATER_BIND",
          typeof input.parentFilesCount === "number" ? input.parentFilesCount : 0
        );

        kernel.setRuntimeBridgeStatus(input.runtimeBridgeStatus || "READY");
        kernel.setLiveRuntimeState(input.runtimeState || "READY");

        kernel.confirmCheckpoint1({
          source: ENGINE_ID,
          reason: "PLANET_ENGINE_BASELINE_ESTABLISHED"
        });

        state.kernelAttached = true;
        state.checkpoint1Reached = true;
        state.baselineEstablished = true;
        state.gaugesDeferred = true;
        state.parentStack.status = input.parentStackStatus || "READY_FOR_LATER_BIND";
        state.parentStack.filesCount =
          typeof input.parentFilesCount === "number" ? input.parentFilesCount : 0;
        state.runtimeBridge.status = input.runtimeBridgeStatus || "READY";
        state.runtimeState.status = input.runtimeState || "READY";

        setStatus(STATUS.CHECKPOINT_1_REACHED);

        emit("PLANET_ENGINE_BASELINE_ESTABLISHED", {
          checkpoint1: true,
          gaugesDeferred: true,
          routeMap: state.routeMap
        });

        emit("GAUGES_DEFERRED_UNTIL_EXPLICIT_ACTIVATION", {
          liveGaugesTarget: state.liveTargets.liveGaugesTarget
        });

        setStatus(STATUS.GAUGES_DEFERRED);

        return api.getState();
      });
    },

    activateGauges(config) {
      return withGuard(function () {
        const input = config || {};
        const kernel = getKernel();

        assert(state.baselineEstablished, "establish baseline before activating gauges");
        assert(state.checkpoint1Reached, "checkpoint 1 must be reached before gauges activate");
        assert(
          typeof kernel.canActivateGauges === "function" && kernel.canActivateGauges(),
          "kernel does not allow gauge activation yet"
        );

        kernel.activateGauges({
          gaugesTarget: input.gaugesTarget || state.liveTargets.liveGaugesTarget
        });

        state.gaugesDeferred = false;
        state.liveTargets.liveGaugesTarget =
          input.gaugesTarget || state.liveTargets.liveGaugesTarget;

        setStatus(STATUS.READY);

        emit("GAUGES_ACTIVATED_FROM_PLANET_ENGINE", {
          gaugesTarget: state.liveTargets.liveGaugesTarget
        });

        return api.getState();
      });
    },

    getCheckpointRead() {
      return freezeCopy({
        version: VERSION,
        engineId: ENGINE_ID,
        baselineEstablished: state.baselineEstablished,
        kernelAttached: state.kernelAttached,
        checkpoint1Reached: state.checkpoint1Reached,
        gaugesDeferred: state.gaugesDeferred,
        status: state.status,
        fieldBuilds: state.fieldBuilds
      });
    },

    getRuntimeRead() {
      const kernel = getKernel();
      const kernelState = kernel.getState ? kernel.getState() : {};
      const gaugeSnapshot =
        typeof kernel.getGaugeSnapshot === "function" ? kernel.getGaugeSnapshot() : null;

      return freezeCopy({
        planetEngine: api.getState(),
        kernel: kernelState,
        gauges: gaugeSnapshot
      });
    },

    reset() {
      const kernel = getKernel();
      if (typeof kernel.resetForNewRun === "function") {
        kernel.resetForNewRun();
      }
      state = createInitialState();
      emit("PLANET_ENGINE_RESET", {});
      return api.getState();
    }
  };

  return Object.freeze(api);
}

const DEFAULT_PLANET_ENGINE = createPlanetEngine();

export default DEFAULT_PLANET_ENGINE;
