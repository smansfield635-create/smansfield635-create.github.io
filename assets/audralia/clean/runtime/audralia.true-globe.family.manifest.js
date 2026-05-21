// /assets/audralia/clean/runtime/audralia.true-globe.family.manifest.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_GLOBE_FAMILY_MANIFEST_PARENT_CHILD_HANDSHAKE_TNT_v1
//
// Purpose:
// - Establish one dependency authority for the Audralia true-globe runtime family.
// - Stop parent/child file leapfrog.
// - Separate public contract, cache key, and capability marker.
// - Give runtime a manifest it can consume before loading moisture/cloud children.
// - Preserve Lattice View protection.
// - Preserve Planet View-only clouds.
// - Do not create canvas.
// - Do not draw.
// - Do not touch HTML.
// - Do not touch route JS.
// - No generated image. No GraphicBox. No flat projection.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_FAMILY_MANIFEST_PARENT_CHILD_HANDSHAKE_TNT_v1";
  var STANDARD = "AUDRALIA_G2_PARENT_CHILD_CONTRACT_HANDSHAKE_AND_FAMILY_MANIFEST_STANDARD_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.family.manifest.js";

  var MANIFEST = {
    contract: CONTRACT,
    standard: STANDARD,
    family: FAMILY,
    file: FILE,
    generatedAt: new Date().toISOString(),

    route: {
      routePath: "/showroom/globe/audralia/",
      htmlPath: "/showroom/globe/audralia/index.html",
      routeJsPath: "/showroom/globe/audralia/index.js",

      htmlPublicContract: "AUDRALIA_G2_HTML_ROUTE_JS_MOISTURE_CLOUD_CONSUMER_KEY_RENEWAL_TNT_v1",
      routeJsPublicContract: "AUDRALIA_G2_ROUTE_JS_RUNTIME_CACHE_KEY_SEPARATION_TNT_v2",
      routeJsCacheKey: "AUDRALIA_G2_ROUTE_JS_RUNTIME_CACHE_KEY_SEPARATION_TNT_v2",

      moduleImporterDisabled: true,
      classicScriptLoader: true
    },

    runtime: {
      path: "/assets/audralia/clean/runtime/audralia.true-globe.runtime.js",

      publicContract: "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2",
      cacheKey: "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_ORGANIC_CLOUD_CHILD_KEY_RENEWAL_TNT_v3",
      capabilityField: "childKeyRenewalContract",
      capabilityMarker: "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_ORGANIC_CLOUD_CHILD_KEY_RENEWAL_TNT_v3",

      previousPublicContract: "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_FAMILY_SEPARATION_TNT_v1",

      acceptsByPublicContract: true,
      fetchesByCacheKey: true,
      verifiesCapabilityMarker: true
    },

    moisture: {
      path: "/assets/audralia/clean/runtime/audralia.true-globe.moisture.js",

      publicContract: "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1",
      cacheKey: "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1",
      capabilityField: "contract",
      capabilityMarker: "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1",

      acceptsByPublicContract: true,
      fetchesByCacheKey: true,
      verifiesCapabilityMarker: true
    },

    clouds: {
      path: "/assets/audralia/clean/runtime/audralia.true-globe.clouds.js",

      publicContract: "AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2",
      cacheKey: "AUDRALIA_G2_TRUE_RUNTIME_CLOUD_LIFECYCLE_CONSERVATION_CHILD_TNT_v3",
      capabilityField: "lifecycleConservationContract",
      capabilityMarker: "AUDRALIA_G2_TRUE_RUNTIME_CLOUD_LIFECYCLE_CONSERVATION_CHILD_TNT_v3",

      previousPublicContract: "AUDRALIA_G2_TRUE_RUNTIME_4K_MOISTURE_CLOUD_CHILD_TNT_v1",

      acceptsByPublicContract: true,
      fetchesByCacheKey: true,
      verifiesCapabilityMarker: true,
      staleGlobalRejectedIfCapabilityMissing: true
    },

    lattice: {
      radialNodes: 16,
      fibonacciBands: 16,
      latticeStates: 256,
      latticeEquation: "16_RADIAL_NODES_X_16_FIBONACCI_BANDS_EQUALS_256_LATTICE_SEATS",
      latticeViewProtected: true,
      latticeViewCloudsBlocked: true
    },

    planet: {
      planetViewCloudsOnly: true,
      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsNotVisible256Grid: true,
      naturalTimeActive: true,
      timeLapseBlocked: true,
      cloudMassConservationExpected: true
    },

    forbidden: {
      generatedImage: false,
      graphicBox: false,
      flatProjection: false,
      cssRingProof: false,
      visibleLegacyHandoff: false,
      earthCrossover: false,
      australiaNamingDrift: false,
      routeJsChildInternals: false,
      htmlChildInternals: false
    }
  };

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
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

  function readStatus(api) {
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

  function buildUrl(entry) {
    if (!entry || !entry.path) return "";

    var key = entry.cacheKey || entry.publicContract || CONTRACT;
    return entry.path + "?v=" + encodeURIComponent(key);
  }

  function validateStatus(entryName, apiOrStatus) {
    var entry = MANIFEST[entryName];

    if (!entry) {
      return {
        ok: false,
        entryName: entryName,
        reason: "MANIFEST_ENTRY_NOT_FOUND"
      };
    }

    var status = readStatus(apiOrStatus);

    if (!status) {
      return {
        ok: false,
        entryName: entryName,
        reason: "STATUS_NOT_AVAILABLE",
        expectedPublicContract: entry.publicContract,
        expectedCapabilityField: entry.capabilityField,
        expectedCapabilityMarker: entry.capabilityMarker
      };
    }

    var publicContract = status.contract || "";
    var capabilityValue = getNestedValue(status, entry.capabilityField);

    var publicContractOk = publicContract === entry.publicContract;
    var capabilityOk = capabilityValue === entry.capabilityMarker;

    return {
      ok: Boolean(publicContractOk && capabilityOk),
      entryName: entryName,

      publicContractOk: publicContractOk,
      capabilityOk: capabilityOk,

      expectedPublicContract: entry.publicContract,
      actualPublicContract: publicContract,

      expectedCapabilityField: entry.capabilityField,
      expectedCapabilityMarker: entry.capabilityMarker,
      actualCapabilityMarker: capabilityValue || "",

      cacheKey: entry.cacheKey,
      fetchUrl: buildUrl(entry),

      staleGlobalRejectedIfCapabilityMissing: Boolean(entry.staleGlobalRejectedIfCapabilityMissing),
      reason: publicContractOk && capabilityOk
        ? "PASS"
        : !publicContractOk
          ? "PUBLIC_CONTRACT_MISMATCH"
          : "CAPABILITY_MARKER_MISSING_OR_STALE"
    };
  }

  function shouldRejectLoadedGlobal(entryName, apiOrStatus) {
    var result = validateStatus(entryName, apiOrStatus);
    return !result.ok;
  }

  function getEntry(entryName) {
    return clone(MANIFEST[entryName] || null);
  }

  function getUrl(entryName) {
    var entry = MANIFEST[entryName];
    return buildUrl(entry);
  }

  function status() {
    return {
      contract: CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      manifestReady: true,
      familyManifestAuthorityReady: true,

      parentAcceptsByPublicContract: true,
      parentFetchesByCacheKey: true,
      parentVerifiesChildCapabilityMarker: true,
      staleGlobalRejectedIfCapabilityMissing: true,

      routeJsNoChildInternals: true,
      htmlNoChildInternals: true,

      runtimePublicContract: MANIFEST.runtime.publicContract,
      runtimeCacheKey: MANIFEST.runtime.cacheKey,
      runtimeCapabilityField: MANIFEST.runtime.capabilityField,
      runtimeCapabilityMarker: MANIFEST.runtime.capabilityMarker,

      moisturePublicContract: MANIFEST.moisture.publicContract,
      moistureCacheKey: MANIFEST.moisture.cacheKey,
      moistureCapabilityField: MANIFEST.moisture.capabilityField,
      moistureCapabilityMarker: MANIFEST.moisture.capabilityMarker,

      cloudPublicContract: MANIFEST.clouds.publicContract,
      cloudCacheKey: MANIFEST.clouds.cacheKey,
      cloudCapabilityField: MANIFEST.clouds.capabilityField,
      cloudCapabilityMarker: MANIFEST.clouds.capabilityMarker,

      latticeViewProtected: true,
      planetViewCloudsOnly: true,
      latticeViewCloudsBlocked: true,

      radialNodes: 16,
      fibonacciBands: 16,
      latticeStates: 256,

      generatedImage: false,
      graphicBox: false,
      flatProjection: false,
      cssRingProof: false,
      visibleLegacyHandoff: false,
      earthCrossover: false,
      australiaNamingDrift: false
    };
  }

  function publish() {
    var api = {
      contract: CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      manifest: clone(MANIFEST),
      getEntry: getEntry,
      getUrl: getUrl,
      validateStatus: validateStatus,
      shouldRejectLoadedGlobal: shouldRejectLoadedGlobal,
      status: status
    };

    window.AUDRALIA_TRUE_GLOBE_FAMILY_MANIFEST = api;
    window.AUDRALIA_G2_TRUE_GLOBE_FAMILY_MANIFEST = api;
    window.AUDRALIA_TRUE_GLOBE_FAMILY_MANIFEST_STATUS = status();
    window.AUDRALIA_G2_TRUE_GLOBE_FAMILY_MANIFEST_STATUS = status();

    window.AUDRALIA_TRUE_GLOBE_FAMILY_MANIFEST_BOOT = {
      contract: CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,
      bootedAt: new Date().toISOString(),
      meaning: "Audralia runtime family manifest evaluated. Parent-child contract/cache/capability handshake authority is available."
    };

    return api;
  }

  publish();
})();
