// /assets/audralia/audralia.runtime.js
// AUDRALIA_G1_PLANET_RUNTIME_ORCHESTRATOR_TNT_v1
//
// Role:
// - Audralia planet runtime.
// - Orchestrates the asset chain.
// - Verifies layer receipts.
// - Blocks stale topology / terrain contracts.
// - Keeps hydration, foliage, ecology, climate, and visual-pass claims closed.
// - Exposes approved planet state to the route compositor.
//
// Does not own:
// - drawing
// - terrain generation
// - topology generation
// - parent globe rendering
// - active hydration
// - foliage
// - ecology
// - climate
// - route shell
// - final visual pass

import {
  createTopologyProfile,
  sampleTopology,
  buildTopologyField,
  getTopologySampleFromField,
  getTopologyStatus
} from "./audralia.topology.render.js?v=AUDRALIA_G1_TOPOLOGY_PLANET_BLUEPRINT_AND_SUBTERRANEAN_DEPTH_TNT_v1";

import {
  createTerrainProfile,
  sampleTerrain,
  buildTerrainField,
  getTerrainSampleFromField,
  getTerrainStatus
} from "./audralia.terrain.render.js?v=AUDRALIA_G1_FULL_PLANET_TERRAIN_PURIFICATION_MAP_TNT_v1";

const RECEIPT = "AUDRALIA_G1_PLANET_RUNTIME_ORCHESTRATOR_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_RUNTIME";
const FILE = "/assets/audralia/audralia.runtime.js";

const MANIFEST_TARGET = "/assets/audralia/audralia_manifest.json";
const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";
const TOPOLOGY_AUTHORITY = "/assets/audralia/audralia.topology.render.js";
const TERRAIN_AUTHORITY = "/assets/audralia/audralia.terrain.render.js";
const ROUTE_COMPOSITOR = "/showroom/globe/audralia/index.js";

const EXPECTED = Object.freeze({
  topologyReceipt: "AUDRALIA_G1_TOPOLOGY_PLANET_BLUEPRINT_AND_SUBTERRANEAN_DEPTH_TNT_v1",
  terrainReceipt: "AUDRALIA_G1_FULL_PLANET_TERRAIN_PURIFICATION_MAP_TNT_v1",
  parentRole: "baseline-globe-body-only",
  runtimeReceipt: RECEIPT
});

const RUNTIME_LAW = Object.freeze({
  role: "planet-runtime-orchestrator",
  layerOrder: Object.freeze([
    "manifest",
    "runtime",
    "topology-blueprint",
    "terrain-elevation-relief",
    "parent-body-baseline",
    "route-compositor"
  ]),

  topologyRole: "planet-blueprint-land-void-sealevel-subterranean-authority",
  terrainRole: "above-sea-elevation-and-relief-authority",
  parentRole: "globe-body-baseline-only",
  routeRole: "visible-route-compositor-only",

  ownsRuntime: true,
  ownsDrawing: false,
  ownsTopologyGeneration: false,
  ownsTerrainGeneration: false,
  ownsParentRender: false,
  ownsHydration: false,
  ownsFoliage: false,
  ownsTrees: false,
  ownsVegetation: false,
  ownsEcology: false,
  ownsClimate: false,
  ownsFauna: false,
  ownsRouteShell: false,
  ownsVisualPass: false,

  hydrationGate: "held",
  foliageGate: "closed",
  ecologyGate: "closed",
  climateGate: "closed",
  visualPassClaimed: false
});

const DEFAULT_MANIFEST = Object.freeze({
  ok: true,
  syntheticFallback: true,
  receipt: "AUDRALIA_RUNTIME_SYNTHETIC_MANIFEST_FALLBACK_v1",
  planetaryObject: PLANETARY_OBJECT,
  layerOrder: RUNTIME_LAW.layerOrder,
  manifestTarget: MANIFEST_TARGET,
  topologyAuthority: TOPOLOGY_AUTHORITY,
  terrainAuthority: TERRAIN_AUTHORITY,
  parentAuthority: PARENT_AUTHORITY,
  routeCompositor: ROUTE_COMPOSITOR,
  hydrationGate: "held",
  foliageGate: "closed",
  visualPassClaimed: false
});

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function normalizeUV(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput), 0, 1);

  return Object.freeze({
    u,
    v,
    lon: u * 2 - 1,
    lat: 1 - v * 2
  });
}

function safeCall(fn, fallback) {
  try {
    return fn();
  } catch (error) {
    return Object.freeze({
      ...fallback,
      ok: false,
      error: error && error.message ? error.message : String(error)
    });
  }
}

function hasReceipt(status, expectedReceipt) {
  if (!status || !expectedReceipt) return false;

  if (status.receipt === expectedReceipt) return true;

  if (Array.isArray(status.previousReceipts) && status.previousReceipts.includes(expectedReceipt)) {
    return true;
  }

  if (status.terrainContract === expectedReceipt) return true;

  return false;
}

function isTopologyStatusValid(status) {
  return Boolean(
    status &&
      status.ok === true &&
      status.receipt === EXPECTED.topologyReceipt &&
      status.topologyBlueprint === true &&
      status.ownsLandVoidFootprint === true &&
      status.ownsSeaLevelBoundary === true &&
      status.ownsSubSeaDepthBlueprint === true &&
      status.ownsSubterraneanBlueprint === true &&
      status.ownsAboveSeaElevation === false &&
      status.ownsTerrainRelief === false &&
      status.ownsHydration === false &&
      status.ownsFoliage === false &&
      status.ownsTrees === false &&
      status.visualPassClaimed === false
  );
}

function isTerrainStatusValid(status) {
  return Boolean(
    status &&
      status.ok === true &&
      hasReceipt(status, EXPECTED.terrainReceipt) &&
      status.ownsTerrain === true &&
      status.ownsActiveHydration === false &&
      status.ownsFoliage === false &&
      status.ownsEcology === false &&
      status.visualPassClaimed === false
  );
}

function noLifeOrWaterLeak(object) {
  if (!object || typeof object !== "object") return true;

  return !(
    object.foliage === true ||
    object.trees === true ||
    object.vegetation === true ||
    object.ownsFoliage === true ||
    object.ownsTrees === true ||
    object.ownsVegetation === true ||
    object.ownsEcology === true ||
    object.ownsHydration === true ||
    object.activeHydrationOwnedHere === true ||
    object.visualPassClaimed === true
  );
}

function buildIntegrityReport(topologyStatus, terrainStatus, manifest) {
  const checks = Object.freeze([
    Object.freeze({
      id: "runtime_receipt_current",
      pass: true,
      detail: RECEIPT
    }),
    Object.freeze({
      id: "topology_receipt_current",
      pass: Boolean(topologyStatus && topologyStatus.receipt === EXPECTED.topologyReceipt),
      detail: topologyStatus && topologyStatus.receipt ? topologyStatus.receipt : "missing"
    }),
    Object.freeze({
      id: "topology_before_terrain",
      pass: Boolean(topologyStatus && topologyStatus.topologyComesBeforeTerrain === true),
      detail: "topologyComesBeforeTerrain"
    }),
    Object.freeze({
      id: "topology_blueprint_only",
      pass: isTopologyStatusValid(topologyStatus),
      detail: "topology owns blueprint, not terrain elevation"
    }),
    Object.freeze({
      id: "terrain_receipt_current",
      pass: isTerrainStatusValid(terrainStatus),
      detail: terrainStatus && terrainStatus.receipt ? terrainStatus.receipt : "missing"
    }),
    Object.freeze({
      id: "terrain_not_hydration",
      pass: Boolean(terrainStatus && terrainStatus.ownsActiveHydration === false),
      detail: "terrain owns relief, not active water"
    }),
    Object.freeze({
      id: "foliage_closed",
      pass: Boolean(
        topologyStatus &&
          terrainStatus &&
          topologyStatus.ownsFoliage === false &&
          topologyStatus.ownsTrees === false &&
          terrainStatus.ownsFoliage === false
      ),
      detail: "no topology/terrain foliage ownership"
    }),
    Object.freeze({
      id: "hydration_held",
      pass: true,
      detail: RUNTIME_LAW.hydrationGate
    }),
    Object.freeze({
      id: "visual_pass_unclaimed",
      pass: Boolean(
        topologyStatus &&
          terrainStatus &&
          topologyStatus.visualPassClaimed === false &&
          terrainStatus.visualPassClaimed === false
      ),
      detail: "runtime does not claim visual pass"
    }),
    Object.freeze({
      id: "manifest_available_or_fallback",
      pass: Boolean(manifest && manifest.ok === true),
      detail: manifest && manifest.syntheticFallback ? "synthetic fallback" : "manifest loaded"
    })
  ]);

  const passed = checks.filter((check) => check.pass).length;
  const failed = checks.length - passed;

  return Object.freeze({
    ok: failed === 0,
    total: checks.length,
    passed,
    failed,
    checks
  });
}

async function loadManifest() {
  if (typeof fetch !== "function") return DEFAULT_MANIFEST;

  try {
    const response = await fetch(MANIFEST_TARGET + "?v=" + encodeURIComponent(RECEIPT), {
      cache: "no-store"
    });

    if (!response.ok) return DEFAULT_MANIFEST;

    const json = await response.json();

    return Object.freeze({
      ok: true,
      syntheticFallback: false,
      ...json,
      manifestTarget: MANIFEST_TARGET
    });
  } catch (error) {
    return DEFAULT_MANIFEST;
  }
}

function getParentGlobal() {
  if (typeof window === "undefined") return null;

  return (
    window.DGBAudraliaPlanetRender ||
    window.AudraliaPlanetRender ||
    window.audraliaPlanetRender ||
    window.DGBAudreliaPlanetRender ||
    window.AudreliaPlanetRender ||
    window.audreliaPlanetRender ||
    null
  );
}

function getParentStatus() {
  const parent = getParentGlobal();

  if (!parent) {
    return Object.freeze({
      ok: false,
      loaded: false,
      receipt: "parent-not-loaded-through-runtime",
      parentAuthority: PARENT_AUTHORITY,
      role: EXPECTED.parentRole,
      note: "Runtime can operate before parent global loads. Route compositor may load parent separately."
    });
  }

  if (typeof parent.getStatus === "function") {
    return safeCall(
      () => {
        const status = parent.getStatus();

        return Object.freeze({
          ok: true,
          loaded: true,
          parentAuthority: PARENT_AUTHORITY,
          ...status
        });
      },
      {
        loaded: true,
        parentAuthority: PARENT_AUTHORITY,
        role: EXPECTED.parentRole
      }
    );
  }

  return Object.freeze({
    ok: true,
    loaded: true,
    parentAuthority: PARENT_AUTHORITY,
    role: EXPECTED.parentRole,
    getStatusAvailable: false
  });
}

function sampleSafeTopology(u, v, context = {}) {
  return safeCall(
    () => sampleTopology(u, v, context),
    {
      receipt: "topology-sample-fallback",
      isLandFootprint: false,
      isVoidFootprint: true,
      surfaceClass: "void_mid_ocean",
      surfaceClassId: 3,
      terrainRisePermission: 0,
      terrainBlockPermission: 1,
      oceanDepthIndex: 0.5,
      subterraneanDepthIndex: 0.2,
      foliage: false,
      trees: false,
      vegetation: false,
      visualPassClaimed: false
    }
  );
}

function sampleSafeTerrain(u, v, context = {}) {
  return safeCall(
    () => sampleTerrain(u, v, context),
    {
      receipt: "terrain-sample-fallback",
      isLand: false,
      isWater: true,
      isIce: false,
      normalizedElevation: -0.45,
      oceanDepth: 0.5,
      ridge: 0,
      basin: 0,
      mountainPressure: 0,
      canyonPressure: 0,
      hydrologyReadinessIndex: 0,
      foliage: false,
      trees: false,
      vegetation: false,
      visualPassClaimed: false
    }
  );
}

function terrainAllowedByTopology(topology, terrain) {
  if (!topology || !terrain) return false;

  if (topology.isVoidFootprint && terrain.isLand && topology.terrainRisePermission < 0.38) {
    return false;
  }

  if (topology.isSouthPolarIceFootprint && terrain.isLand && !terrain.isIce) {
    return false;
  }

  return true;
}

export async function createAudraliaRuntime(options = {}) {
  const manifest = await loadManifest();

  const topologyStatus = safeCall(getTopologyStatus, {
    receipt: "topology-status-fallback",
    ok: false
  });

  const terrainStatus = safeCall(getTerrainStatus, {
    receipt: "terrain-status-fallback",
    ok: false
  });

  const parentStatus = getParentStatus();
  const integrity = buildIntegrityReport(topologyStatus, terrainStatus, manifest);

  const runtime = Object.freeze({
    ok: integrity.ok,
    receipt: RECEIPT,
    status: integrity.ok ? "active" : "held",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    manifestTarget: MANIFEST_TARGET,
    parentAuthority: PARENT_AUTHORITY,
    topologyAuthority: TOPOLOGY_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,
    routeCompositor: ROUTE_COMPOSITOR,

    expected: EXPECTED,
    runtimeLaw: RUNTIME_LAW,
    layerOrder: RUNTIME_LAW.layerOrder,

    manifest,
    topologyStatus,
    terrainStatus,
    parentStatus,
    integrity,

    topologyReady: isTopologyStatusValid(topologyStatus),
    terrainReady: isTerrainStatusValid(terrainStatus),
    parentReady: Boolean(parentStatus && parentStatus.loaded),
    renderPermission: integrity.ok ? "allowed_for_route_compositor" : "held_until_integrity_passes",

    hydrationGate: RUNTIME_LAW.hydrationGate,
    foliageGate: RUNTIME_LAW.foliageGate,
    ecologyGate: RUNTIME_LAW.ecologyGate,
    climateGate: RUNTIME_LAW.climateGate,

    ownsRuntime: true,
    ownsDrawing: false,
    ownsTopologyGeneration: false,
    ownsTerrainGeneration: false,
    ownsParentRender: false,
    ownsHydration: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsEcology: false,
    ownsClimate: false,
    ownsVisualPass: false,
    visualPassClaimed: false,

    options: Object.freeze({ ...options })
  });

  if (typeof window !== "undefined") {
    window.DGBAudraliaRuntime = runtime;
    window.DGBAudraliaRuntimeAPI = API;
    window.dispatchEvent(
      new CustomEvent("dgb:audralia-runtime-ready", {
        detail: {
          receipt: RECEIPT,
          ok: runtime.ok,
          status: runtime.status,
          topologyReady: runtime.topologyReady,
          terrainReady: runtime.terrainReady,
          hydrationGate: runtime.hydrationGate,
          foliageGate: runtime.foliageGate,
          visualPassClaimed: false
        }
      })
    );
  }

  return runtime;
}

export function getAudraliaLayerReceipts() {
  const topologyStatus = safeCall(getTopologyStatus, { receipt: "topology-status-fallback", ok: false });
  const terrainStatus = safeCall(getTerrainStatus, { receipt: "terrain-status-fallback", ok: false });
  const parentStatus = getParentStatus();

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    runtime: RECEIPT,
    manifestTarget: MANIFEST_TARGET,
    topology: topologyStatus.receipt || "missing",
    topologyExpected: EXPECTED.topologyReceipt,
    terrain: terrainStatus.receipt || "missing",
    terrainExpected: EXPECTED.terrainReceipt,
    parent: parentStatus.receipt || parentStatus.role || "parent-not-loaded-through-runtime",
    parentAuthority: PARENT_AUTHORITY,
    routeCompositor: ROUTE_COMPOSITOR,
    hydrationGate: RUNTIME_LAW.hydrationGate,
    foliageGate: RUNTIME_LAW.foliageGate,
    visualPassClaimed: false
  });
}

export function getAudraliaRuntimeStatus() {
  const topologyStatus = safeCall(getTopologyStatus, { receipt: "topology-status-fallback", ok: false });
  const terrainStatus = safeCall(getTerrainStatus, { receipt: "terrain-status-fallback", ok: false });
  const parentStatus = getParentStatus();
  const integrity = buildIntegrityReport(topologyStatus, terrainStatus, DEFAULT_MANIFEST);

  return Object.freeze({
    ok: integrity.ok,
    receipt: RECEIPT,
    status: integrity.ok ? "active" : "held",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    manifestTarget: MANIFEST_TARGET,
    parentAuthority: PARENT_AUTHORITY,
    topologyAuthority: TOPOLOGY_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,
    routeCompositor: ROUTE_COMPOSITOR,

    role: "planet-runtime-orchestrator",
    layerOrder: RUNTIME_LAW.layerOrder,

    topologyReady: isTopologyStatusValid(topologyStatus),
    terrainReady: isTerrainStatusValid(terrainStatus),
    parentReady: Boolean(parentStatus && parentStatus.loaded),
    integrity,

    topologyStatus,
    terrainStatus,
    parentStatus,

    hydrationGate: RUNTIME_LAW.hydrationGate,
    foliageGate: RUNTIME_LAW.foliageGate,
    ecologyGate: RUNTIME_LAW.ecologyGate,
    climateGate: RUNTIME_LAW.climateGate,

    ownsRuntime: true,
    ownsDrawing: false,
    ownsTopologyGeneration: false,
    ownsTerrainGeneration: false,
    ownsParentRender: false,
    ownsHydration: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsEcology: false,
    ownsClimate: false,
    ownsFauna: false,
    ownsRouteShell: false,
    ownsVisualPass: false,

    exports: Object.freeze([
      "createAudraliaRuntime",
      "getAudraliaRuntimeStatus",
      "getAudraliaLayerReceipts",
      "sampleAudraliaPlanetState",
      "buildAudraliaRuntimeField",
      "assertAudraliaRuntimeIntegrity"
    ]),

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function sampleAudraliaPlanetState(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);

  const topology = sampleSafeTopology(point.u, point.v, context.topologyContext || context);
  const terrain = sampleSafeTerrain(point.u, point.v, context.terrainContext || context);
  const allowed = terrainAllowedByTopology(topology, terrain);

  const lifeLeak =
    !noLifeOrWaterLeak(topology) ||
    !noLifeOrWaterLeak(terrain);

  const state = Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    topology,
    terrain,

    topologySurfaceClass: topology.surfaceClass || "unknown",
    topologySurfaceClassId: topology.surfaceClassId ?? -1,
    topologyLandFootprint: Boolean(topology.isLandFootprint),
    topologyVoidFootprint: Boolean(topology.isVoidFootprint),
    topologySeaLevelBoundary: topology.seaLevelBoundary ?? 0,
    topologyOceanDepthIndex: topology.oceanDepthIndex ?? 0,
    topologySubterraneanDepthIndex: topology.subterraneanDepthIndex ?? 0,
    topologyTerrainRisePermission: topology.terrainRisePermission ?? 0,
    topologyTerrainBlockPermission: topology.terrainBlockPermission ?? 0,

    terrainIsLand: Boolean(terrain.isLand),
    terrainIsWater: Boolean(terrain.isWater),
    terrainIsIce: Boolean(terrain.isIce),
    terrainElevation: terrain.normalizedElevation ?? 0,
    terrainRidge: terrain.ridge ?? 0,
    terrainBasin: terrain.basin ?? 0,
    terrainMountainPressure: terrain.mountainPressure ?? 0,
    terrainCanyonPressure: terrain.canyonPressure ?? 0,
    terrainHydrologyReadinessIndex: terrain.hydrologyReadinessIndex ?? 0,

    terrainAllowedByTopology: allowed,
    runtimeIntegrityAtSample: allowed && !lifeLeak,
    lifeLeakDetected: lifeLeak,

    hydrationGate: RUNTIME_LAW.hydrationGate,
    foliageGate: RUNTIME_LAW.foliageGate,
    ecologyGate: RUNTIME_LAW.ecologyGate,
    climateGate: RUNTIME_LAW.climateGate,

    renderHint: allowed ? "render_from_runtime_state" : "hold_or_render_topology_safe_state",

    foliage: false,
    trees: false,
    vegetation: false,
    activeHydrationOwnedHere: false,
    visualPassClaimed: false
  });

  return state;
}

export function buildAudraliaRuntimeField(width = 96, height = 48, options = {}) {
  const w = Math.max(8, Math.floor(Number(width) || 96));
  const h = Math.max(8, Math.floor(Number(height) || 48));
  const samples = new Array(w * h);

  let validSamples = 0;
  let invalidSamples = 0;
  let landFootprintSamples = 0;
  let voidFootprintSamples = 0;
  let terrainLandSamples = 0;
  let terrainWaterSamples = 0;
  let topologyTerrainMismatchSamples = 0;
  let lifeLeakSamples = 0;

  let oceanDepthSum = 0;
  let subterraneanDepthSum = 0;
  let elevationSum = 0;
  let mountainSum = 0;
  let canyonSum = 0;

  const surfaceClassCounts = new Map();

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const index = y * w + x;
      const sample = sampleAudraliaPlanetState(u, v, options);

      samples[index] = sample;

      if (sample.runtimeIntegrityAtSample) validSamples += 1;
      else invalidSamples += 1;

      if (sample.topologyLandFootprint) landFootprintSamples += 1;
      if (sample.topologyVoidFootprint) voidFootprintSamples += 1;
      if (sample.terrainIsLand) terrainLandSamples += 1;
      if (sample.terrainIsWater) terrainWaterSamples += 1;
      if (!sample.terrainAllowedByTopology) topologyTerrainMismatchSamples += 1;
      if (sample.lifeLeakDetected) lifeLeakSamples += 1;

      oceanDepthSum += sample.topologyOceanDepthIndex;
      subterraneanDepthSum += sample.topologySubterraneanDepthIndex;
      elevationSum += sample.terrainElevation;
      mountainSum += sample.terrainMountainPressure;
      canyonSum += sample.terrainCanyonPressure;

      surfaceClassCounts.set(
        sample.topologySurfaceClass,
        (surfaceClassCounts.get(sample.topologySurfaceClass) || 0) + 1
      );
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    width: w,
    height: h,
    samples,
    stats: Object.freeze({
      totalSamples: samples.length,
      validSamples,
      invalidSamples,
      validRatio: validSamples / samples.length,
      invalidRatio: invalidSamples / samples.length,

      landFootprintSamples,
      voidFootprintSamples,
      terrainLandSamples,
      terrainWaterSamples,
      topologyTerrainMismatchSamples,
      lifeLeakSamples,

      averageTopologyOceanDepthIndex: oceanDepthSum / samples.length,
      averageTopologySubterraneanDepthIndex: subterraneanDepthSum / samples.length,
      averageTerrainElevation: elevationSum / samples.length,
      averageTerrainMountainPressure: mountainSum / samples.length,
      averageTerrainCanyonPressure: canyonSum / samples.length,

      activeSurfaceClassCount: surfaceClassCounts.size,
      activeSurfaceClasses: Array.from(surfaceClassCounts.keys()).sort(),

      runtimeOrchestrated: true,
      topologyBeforeTerrain: true,
      hydrationHeld: true,
      foliageClosed: true,
      ecologyClosed: true,
      climateClosed: true,
      visualPassClaimed: false
    })
  });
}

export function assertAudraliaRuntimeIntegrity() {
  const status = getAudraliaRuntimeStatus();
  const receipts = getAudraliaLayerReceipts();

  const assertions = Object.freeze([
    Object.freeze({
      id: "runtime_current",
      pass: status.receipt === RECEIPT,
      detail: status.receipt
    }),
    Object.freeze({
      id: "topology_current",
      pass: receipts.topology === EXPECTED.topologyReceipt,
      detail: receipts.topology
    }),
    Object.freeze({
      id: "terrain_current",
      pass: receipts.terrain === EXPECTED.terrainReceipt || status.terrainReady === true,
      detail: receipts.terrain
    }),
    Object.freeze({
      id: "topology_before_terrain",
      pass: status.topologyStatus && status.topologyStatus.topologyComesBeforeTerrain === true,
      detail: "topology before terrain"
    }),
    Object.freeze({
      id: "hydration_held",
      pass: status.hydrationGate === "held",
      detail: status.hydrationGate
    }),
    Object.freeze({
      id: "foliage_closed",
      pass: status.foliageGate === "closed" && status.ownsFoliage === false,
      detail: status.foliageGate
    }),
    Object.freeze({
      id: "visual_pass_unclaimed",
      pass: status.visualPassClaimed === false,
      detail: "false"
    })
  ]);

  const failed = assertions.filter((assertion) => !assertion.pass);

  return Object.freeze({
    ok: failed.length === 0,
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    total: assertions.length,
    passed: assertions.length - failed.length,
    failed: failed.length,
    assertions,
    status,
    receipts
  });
}

const API = Object.freeze({
  receipt: RECEIPT,
  planetaryObject: PLANETARY_OBJECT,
  generation: GENERATION,
  file: FILE,
  runtimeLaw: RUNTIME_LAW,
  createAudraliaRuntime,
  getAudraliaRuntimeStatus,
  getAudraliaLayerReceipts,
  sampleAudraliaPlanetState,
  buildAudraliaRuntimeField,
  assertAudraliaRuntimeIntegrity
});

if (typeof window !== "undefined") {
  window.DGBAudraliaRuntimeAPI = API;
}

export default API;
