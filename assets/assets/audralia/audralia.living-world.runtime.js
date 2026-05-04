// /assets/audralia.living-world.runtime.js
// AUDRALIA_G1_LIVING_WORLD_RUNTIME_BRIDGE_TO_PLANET_RENDER_CHILDREN_TNT_v1
// Parent authority: /assets/AdreliaPlanetRendered.js
// Role: compatibility runtime bridge for the Audralia planet-render downstream chain.
// This file no longer consumes loose land/water/foliage/animal assets.
// It routes runtime authority through the direct planet-render child files.

import {
  createTopographyProfile,
  sampleTopography,
  buildTopographyField,
  getTopographySampleFromField,
  getTopographyStatus
} from "/assets/audralia.planet.render-topography.js";

import {
  createHydrationProfile,
  sampleHydration,
  buildHydrationField,
  getHydrationSampleFromField,
  getHydrationStatus
} from "/assets/audralia.planet.render-hydration.js";

import {
  createClimateProfile,
  sampleClimate,
  buildClimateField,
  getClimateSampleFromField,
  getClimateStatus
} from "/assets/audralia.planet.render-climate.js";

import {
  createEcologyProfile,
  sampleEcology,
  buildEcologyField,
  getEcologySampleFromField,
  getEcologyStatus
} from "/assets/audralia.planet.render-ecology.js";

import {
  createFaunaProfile,
  sampleFauna,
  buildFaunaField,
  getFaunaSampleFromField,
  getFaunaStatus
} from "/assets/audralia.planet.render-fauna.js";

import {
  createLivingWorldProfile,
  createLivingWorldState,
  tickLivingWorldState,
  buildLivingWorldFields,
  sampleLivingWorld as sampleLivingWorldUV,
  buildLivingWorldSnapshot,
  createLivingWorldRuntime,
  getLivingWorldStatus
} from "/assets/audralia.planet.render-living-world.js";

const RECEIPT = "AUDRALIA_G1_LIVING_WORLD_RUNTIME_BRIDGE_TO_PLANET_RENDER_CHILDREN_TNT_v1";
const RUNTIME_ID = "audralia-living-world-runtime";
const PLANETARY_OBJECT = "Audralia";
const CANONICAL_PLANET_ID = "audralia";
const GENERATION = "G1";
const PARENT_AUTHORITY = "/assets/AdreliaPlanetRendered.js";
const FILE = "/assets/audralia.living-world.runtime.js";

const CHILD_PATHS = Object.freeze({
  topography: "/assets/audralia.planet.render-topography.js",
  hydration: "/assets/audralia.planet.render-hydration.js",
  climate: "/assets/audralia.planet.render-climate.js",
  ecology: "/assets/audralia.planet.render-ecology.js",
  fauna: "/assets/audralia.planet.render-fauna.js",
  livingWorld: "/assets/audralia.planet.render-living-world.js"
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(Number(value)) ? Number(value) : 0));
}

function normalizeLon(lon) {
  let out = Number.isFinite(Number(lon)) ? Number(lon) : 0;
  while (out > 180) out -= 360;
  while (out < -180) out += 360;
  return out;
}

function normalizeLat(lat) {
  return clamp(lat, -90, 90);
}

function lonLatToUV(lonInput, latInput) {
  const lon = normalizeLon(lonInput);
  const lat = normalizeLat(latInput);

  return Object.freeze({
    lon,
    lat,
    u: (lon + 180) / 360,
    v: (90 - lat) / 180
  });
}

function uvToLonLat(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(vInput, 0, 1);

  return Object.freeze({
    u,
    v,
    lon: u * 360 - 180,
    lat: 90 - v * 180
  });
}

export function getEngines() {
  return Object.freeze({
    topography: Object.freeze({
      path: CHILD_PATHS.topography,
      createProfile: createTopographyProfile,
      sample: sampleTopography,
      buildField: buildTopographyField,
      getSampleFromField: getTopographySampleFromField,
      getStatus: getTopographyStatus
    }),
    hydration: Object.freeze({
      path: CHILD_PATHS.hydration,
      createProfile: createHydrationProfile,
      sample: sampleHydration,
      buildField: buildHydrationField,
      getSampleFromField: getHydrationSampleFromField,
      getStatus: getHydrationStatus
    }),
    climate: Object.freeze({
      path: CHILD_PATHS.climate,
      createProfile: createClimateProfile,
      sample: sampleClimate,
      buildField: buildClimateField,
      getSampleFromField: getClimateSampleFromField,
      getStatus: getClimateStatus
    }),
    ecology: Object.freeze({
      path: CHILD_PATHS.ecology,
      createProfile: createEcologyProfile,
      sample: sampleEcology,
      buildField: buildEcologyField,
      getSampleFromField: getEcologySampleFromField,
      getStatus: getEcologyStatus
    }),
    fauna: Object.freeze({
      path: CHILD_PATHS.fauna,
      createProfile: createFaunaProfile,
      sample: sampleFauna,
      buildField: buildFaunaField,
      getSampleFromField: getFaunaSampleFromField,
      getStatus: getFaunaStatus
    }),
    livingWorld: Object.freeze({
      path: CHILD_PATHS.livingWorld,
      createProfile: createLivingWorldProfile,
      createState: createLivingWorldState,
      tickState: tickLivingWorldState,
      buildFields: buildLivingWorldFields,
      sample: sampleLivingWorldUV,
      buildSnapshot: buildLivingWorldSnapshot,
      createRuntime: createLivingWorldRuntime,
      getStatus: getLivingWorldStatus
    })
  });
}

function readStatus(fn) {
  try {
    return fn();
  } catch (error) {
    return Object.freeze({
      ok: false,
      errored: true,
      error: String(error && error.message ? error.message : error)
    });
  }
}

export function getReadiness() {
  const statuses = Object.freeze({
    topography: readStatus(getTopographyStatus),
    hydration: readStatus(getHydrationStatus),
    climate: readStatus(getClimateStatus),
    ecology: readStatus(getEcologyStatus),
    fauna: readStatus(getFaunaStatus),
    livingWorld: readStatus(getLivingWorldStatus)
  });

  const topographyLoaded = !!statuses.topography && statuses.topography.status === "active";
  const hydrationLoaded = !!statuses.hydration && statuses.hydration.status === "active";
  const climateLoaded = !!statuses.climate && statuses.climate.status === "active";
  const ecologyLoaded = !!statuses.ecology && statuses.ecology.status === "active";
  const faunaLoaded = !!statuses.fauna && statuses.fauna.status === "active";
  const livingWorldLoaded = !!statuses.livingWorld && statuses.livingWorld.status === "active";

  const allChildrenLoaded =
    topographyLoaded &&
    hydrationLoaded &&
    climateLoaded &&
    ecologyLoaded &&
    faunaLoaded &&
    livingWorldLoaded;

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    runtime: RUNTIME_ID,
    planetaryObject: PLANETARY_OBJECT,
    canonicalPlanetId: CANONICAL_PLANET_ID,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    file: FILE,

    topographyLoaded,
    hydrationLoaded,
    climateLoaded,
    ecologyLoaded,
    faunaLoaded,
    livingWorldLoaded,
    allChildrenLoaded,

    chainReady: allChildrenLoaded,
    fallbackActive: false,
    sampleChainReady: allChildrenLoaded,
    compositorReady: allChildrenLoaded,
    visualPassClaimed: false,
    generationPassClaimed: false,

    paths: CHILD_PATHS,
    statuses
  });
}

export function createProfile(overrides = {}) {
  const readiness = getReadiness();

  return Object.freeze({
    receipt: RECEIPT,
    id: RUNTIME_ID,
    planetaryObject: PLANETARY_OBJECT,
    canonicalPlanetId: CANONICAL_PLANET_ID,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    file: FILE,
    label: "Audralia Living World Runtime",
    type: "living-world-runtime-bridge",

    role: "compatibility_runtime_bridge_to_planet_render_children",

    ownsRuntimeBridge: true,
    ownsTopography: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsFinalTexturePixels: false,
    ownsRouteShell: false,
    ownsHtml: false,
    ownsEarth: false,
    ownsSun: false,
    ownsMoon: false,

    childPaths: CHILD_PATHS,

    chainOrder: [
      "topography",
      "hydration",
      "climate",
      "ecology",
      "fauna",
      "livingWorld",
      "parentCompositor"
    ],

    canonicalSequence: [
      "Topography establishes landform permission",
      "Hydration fills water and ice permission",
      "Climate binds atmospheric permission",
      "Ecology responds to terrain, water, and climate",
      "Fauna inhabits lawful ecology",
      "Living-world runtime coordinates state",
      "Parent compositor reveals"
    ],

    readiness,

    visualPassClaimed: false,
    generationPassClaimed: false,

    ...overrides
  });
}

export function sampleUV(uInput, vInput, context = {}) {
  const point = uvToLonLat(uInput, vInput);
  const profile = createLivingWorldProfile(context.profile || {});
  const state = context.state || createLivingWorldState({
    profile,
    elapsedHours: context.elapsedHours || 0
  });

  const fields = context.fields || null;

  const sample = sampleLivingWorldUV(point.u, point.v, {
    profile,
    state,
    topographyField: fields && fields.topographyField,
    hydrationField: fields && fields.hydrationField,
    climateField: fields && fields.climateField,
    ecologyField: fields && fields.ecologyField,
    faunaField: fields && fields.faunaField
  });

  return Object.freeze({
    ...sample,
    receipt: RECEIPT,
    runtime: RUNTIME_ID,
    runtimeBridge: true,
    lon: point.lon,
    lat: point.lat,
    u: point.u,
    v: point.v,
    readiness: getReadiness(),
    parentAuthority: PARENT_AUTHORITY,
    file: FILE,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function sampleLivingWorld(lonInput, latInput, context = {}) {
  const point = lonLatToUV(lonInput, latInput);
  return sampleUV(point.u, point.v, context);
}

export function buildRuntimeField(width = 64, height = 64, options = {}) {
  const w = Math.max(1, Math.floor(Number(width) || 64));
  const h = Math.max(1, Math.floor(Number(height) || 64));
  const channels = 24;
  const data = new Float32Array(w * h * channels);

  const profile = createLivingWorldProfile(options.profile || {});
  const fields = options.fields || buildLivingWorldFields({
    width: options.fieldWidth || 256,
    height: options.fieldHeight || 256,
    profile
  });

  const state = options.state || createLivingWorldState({
    profile,
    elapsedHours: options.elapsedHours || 0
  });

  let i = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);

      const sample = sampleLivingWorldUV(u, v, {
        profile,
        state,
        topographyField: fields.topographyField,
        hydrationField: fields.hydrationField,
        climateField: fields.climateField,
        ecologyField: fields.ecologyField,
        faunaField: fields.faunaField
      });

      const topography = sample.topography || {};
      const hydration = sample.hydration || {};
      const climate = sample.climate || {};
      const ecology = sample.ecology || {};
      const fauna = sample.fauna || {};
      const activity = sample.activity || {};

      data[i] = clamp(topography.normalizedElevation || 0, 0, 1);
      data[i + 1] = clamp(topography.slope || 0, 0, 1);
      data[i + 2] = clamp(topography.mountainPermission || 0, 0, 1);
      data[i + 3] = clamp(topography.basinPermission || 0, 0, 1);
      data[i + 4] = hydration.isOcean ? 1 : 0;
      data[i + 5] = clamp(hydration.normalizedDepth || 0, 0, 1);
      data[i + 6] = clamp(hydration.coastalPermission || 0, 0, 1);
      data[i + 7] = clamp(hydration.riverPermission || 0, 0, 1);
      data[i + 8] = clamp(hydration.lakePermission || 0, 0, 1);
      data[i + 9] = clamp(hydration.glacierPermission || 0, 0, 1);
      data[i + 10] = clamp((climate.temperatureC + 40) / 90, 0, 1);
      data[i + 11] = clamp((climate.precipitationMm || 0) / 3000, 0, 1);
      data[i + 12] = clamp(climate.humidity || 0, 0, 1);
      data[i + 13] = clamp(climate.aridity || 0, 0, 1);
      data[i + 14] = clamp(climate.stormPermission || 0, 0, 1);
      data[i + 15] = clamp(ecology.vegetationDensity || 0, 0, 1);
      data[i + 16] = clamp(ecology.canopyPotential || 0, 0, 1);
      data[i + 17] = clamp(ecology.grasslandPotential || 0, 0, 1);
      data[i + 18] = clamp(ecology.wetlandPotential || 0, 0, 1);
      data[i + 19] = clamp(fauna.carryingCapacity || 0, 0, 1);
      data[i + 20] = clamp(fauna.biodiversityPotential || 0, 0, 1);
      data[i + 21] = clamp(fauna.migrationPermission || 0, 0, 1);
      data[i + 22] = clamp(activity.ecologyActivity || 0, 0, 1);
      data[i + 23] = clamp(activity.faunaActivity || 0, 0, 1);

      i += channels;
    }
  }

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    runtime: RUNTIME_ID,
    planetaryObject: PLANETARY_OBJECT,
    canonicalPlanetId: CANONICAL_PLANET_ID,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    file: FILE,
    width: w,
    height: h,
    channels,
    channelMap: Object.freeze([
      "normalizedElevation",
      "slope",
      "mountainPermission",
      "basinPermission",
      "isOcean",
      "normalizedDepth",
      "coastalPermission",
      "riverPermission",
      "lakePermission",
      "glacierPermission",
      "temperatureNormalized",
      "precipitationNormalized",
      "humidity",
      "aridity",
      "stormPermission",
      "vegetationDensity",
      "canopyPotential",
      "grasslandPotential",
      "wetlandPotential",
      "carryingCapacity",
      "biodiversityPotential",
      "migrationPermission",
      "ecologyActivity",
      "faunaActivity"
    ]),
    data,
    readiness: getReadiness(),
    seamSafe: true,
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function getStatus() {
  const readiness = getReadiness();

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    id: RUNTIME_ID,
    planetaryObject: PLANETARY_OBJECT,
    canonicalPlanetId: CANONICAL_PLANET_ID,
    generation: GENERATION,
    label: "Audralia Living World Runtime",
    type: "living-world-runtime-bridge",
    parentAuthority: PARENT_AUTHORITY,
    file: FILE,

    runtimeBridgeReady: true,
    childChainReady: readiness.chainReady,
    sampleChainReady: readiness.sampleChainReady,
    compositorReady: readiness.compositorReady,

    topographyLoaded: readiness.topographyLoaded,
    hydrationLoaded: readiness.hydrationLoaded,
    climateLoaded: readiness.climateLoaded,
    ecologyLoaded: readiness.ecologyLoaded,
    faunaLoaded: readiness.faunaLoaded,
    livingWorldLoaded: readiness.livingWorldLoaded,

    paths: CHILD_PATHS,

    ownsRuntimeBridge: true,
    ownsTopography: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRoute: false,
    ownsHtml: false,
    ownsEarth: false,
    ownsSun: false,
    ownsMoon: false,
    ownsFinalRender: false,

    generatedImage: false,
    graphicBox: false,
    staticImageReplacement: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

const api = Object.freeze({
  id: RUNTIME_ID,
  receipt: RECEIPT,
  planetaryObject: PLANETARY_OBJECT,
  canonicalPlanetId: CANONICAL_PLANET_ID,
  generation: GENERATION,
  parentAuthority: PARENT_AUTHORITY,
  file: FILE,

  createProfile,
  getStatus,
  getEngines,
  getReadiness,
  sampleLivingWorld,
  sample: sampleLivingWorld,
  sampleUV,
  buildRuntimeField,

  createLivingWorldProfile,
  createLivingWorldState,
  tickLivingWorldState,
  buildLivingWorldFields,
  buildLivingWorldSnapshot,
  createLivingWorldRuntime,
  getLivingWorldStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaLivingWorldRuntime = api;
  window.DiamondGateBridge = window.DiamondGateBridge || {};
  window.DiamondGateBridge.DGBAudraliaLivingWorldRuntime = api;

  try {
    window.dispatchEvent(
      new CustomEvent("dgb:audralia:living-world-runtime-ready", {
        detail: getStatus()
      })
    );
  } catch (_) {}
}

export default api;
