// /assets/audralia/clean/runtime/audralia.true-globe.family.manifest.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_GLOBE_FAMILY_MANIFEST_DATUM_CHILD_REGISTRATION_TNT_v4
//
// Public manifest contract intentionally preserved for runtime compatibility:
// AUDRALIA_G2_TRUE_GLOBE_FAMILY_MANIFEST_PARENT_CHILD_HANDSHAKE_TNT_v1
//
// Purpose:
// - Preserve parent-child manifest authority.
// - Register the planetary datum child before terrain/ecosystem.
// - Preserve terrain/ecosystem, moisture, surface, and cloud child registrations.
// - Preserve runtime, route, public contract, cache key, and capability marker separation.
// - Admit true North / true South / equator / climate belt authority into the parent chain.
// - Do not create canvas.
// - Do not draw.
// - Do not touch HTML.
// - Do not touch route JS.
// - Do not touch runtime in this phase.
// - No generated image. No GraphicBox. No flat projection.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_FAMILY_MANIFEST_PARENT_CHILD_HANDSHAKE_TNT_v1";
  var DATUM_REGISTRATION_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_FAMILY_MANIFEST_DATUM_CHILD_REGISTRATION_TNT_v4";
  var PREVIOUS_REGISTRATION_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_FAMILY_MANIFEST_SURFACE_RENDERER_CHILD_REGISTRATION_TNT_v3";

  var STANDARD = "AUDRALIA_G2_PARENT_CHILD_CONTRACT_HANDSHAKE_AND_FAMILY_MANIFEST_STANDARD_v1";
  var DATUM_STANDARD = "AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_SPEC_OPS_v1";
  var TERRAIN_STANDARD = "AUDRALIA_G2_TERRAIN_ECOSYSTEM_FORCING_FIELD_STANDARD_v1";
  var SURFACE_STANDARD = "AUDRALIA_G2_GRATITUDE_CONTINENT_SURFACE_VISUALIZATION_SPEC_OPS_v1";

  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.family.manifest.js";

  var MANIFEST = {
    contract: CONTRACT,
    datumRegistrationContract: DATUM_REGISTRATION_CONTRACT,
    previousRegistrationContract: PREVIOUS_REGISTRATION_CONTRACT,

    standard: STANDARD,
    datumStandard: DATUM_STANDARD,
    terrainStandard: TERRAIN_STANDARD,
    surfaceStandard: SURFACE_STANDARD,

    family: FAMILY,
    file: FILE,
    generatedAt: new Date().toISOString(),

    route: {
      routePath: "/showroom/globe/audralia/",
      htmlPath: "/showroom/globe/audralia/index.html",
      routeJsPath: "/showroom/globe/audralia/index.js",

      htmlPublicContract: "AUDRALIA_G2_HTML_ROUTE_JS_MOISTURE_CLOUD_CONSUMER_KEY_RENEWAL_TNT_v1",
      routeJsPublicContract: "AUDRALIA_G2_ROUTE_JS_GRATITUDE_SURFACE_RENDERER_CONSUMER_TNT_v4",
      routeJsCacheKey: "AUDRALIA_G2_ROUTE_JS_GRATITUDE_SURFACE_RENDERER_CONSUMER_TNT_v4",
      nextExpectedRouteConsumer: "AUDRALIA_G2_ROUTE_JS_DATUM_RUNTIME_CONSUMER_KEY_RENEWAL_TNT_v5",

      moduleImporterDisabled: true,
      classicScriptLoader: true
    },

    runtime: {
      path: "/assets/audralia/clean/runtime/audralia.true-globe.runtime.js",

      publicContract: "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2",
      cacheKey: "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_SURFACE_RENDERER_MANIFEST_CONSUMER_TNT_v6",
      capabilityField: "surfaceRendererConsumerContract",
      capabilityMarker: "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_SURFACE_RENDERER_MANIFEST_CONSUMER_TNT_v6",

      nextRequiredRuntimeConsumer: "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_DATUM_MANIFEST_CONSUMER_TNT_v7",

      previousPublicContract: "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2",

      acceptsByPublicContract: true,
      fetchesByCacheKey: true,
      verifiesCapabilityMarker: true
    },

    datum: {
      path: "/assets/audralia/clean/runtime/audralia.true-globe.datum.js",

      publicContract: "AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_CHILD_TNT_v1",
      cacheKey: "AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_CHILD_TNT_v1",
      capabilityField: "contract",
      capabilityMarker: "AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_CHILD_TNT_v1",

      standard: "AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_SPEC_OPS_v1",

      role: "planetary-orientation-parent",
      loadsBeforeTerrainEcosystem: true,
      loadsBeforeMoisture: true,
      loadsBeforeSurface: true,
      loadsBeforeClouds: true,

      outputs: [
        "sample(longitude, latitude, time)",
        "getDatum(frame)",
        "status()"
      ],

      authorityFields: [
        "trueNorthPole",
        "trueSouthPole",
        "equatorPlane",
        "primeMeridian",
        "antiMeridian",
        "hemisphere",
        "latitudeBand",
        "longitudeBand",
        "axialTilt",
        "rotationAxis",
        "seasonalAngle",
        "solarDeclination",
        "coriolisDirection",
        "coriolisStrength",
        "northPolarVortex",
        "southPolarVortex",
        "equatorialConvectionBelt",
        "northTradeWindBand",
        "southTradeWindBand",
        "northTemperateJetBand",
        "southTemperateJetBand",
        "northPolarJetBand",
        "southPolarJetBand",
        "climateBelt",
        "stormTrackLatitudeBias",
        "polarResonanceStrength",
        "equatorMoistureBias",
        "hemisphereSeasonBias",
        "groundLevelDatumReadiness"
      ],

      planetaryDatumExpected: true,
      trueNorthAuthorityExpected: true,
      trueSouthAuthorityExpected: true,
      equatorAuthorityExpected: true,
      climateBeltAuthorityExpected: true,
      polarResonanceAuthorityExpected: true,

      noCanvasCreated: true,
      noDrawAuthority: true,
      noRouteJsAuthority: true,
      noHtmlAuthority: true,
      noRuntimeMotionAuthority: true,
      latticeViewProtected: true,

      acceptsByPublicContract: true,
      fetchesByCacheKey: true,
      verifiesCapabilityMarker: true,
      staleGlobalRejectedIfCapabilityMissing: true
    },

    terrainEcosystem: {
      path: "/assets/audralia/clean/runtime/audralia.true-globe.terrain-ecosystem.js",

      publicContract: "AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_FORCING_FIELD_CHILD_TNT_v1",
      cacheKey: "AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_FORCING_FIELD_CHILD_TNT_v1",
      capabilityField: "contract",
      capabilityMarker: "AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_FORCING_FIELD_CHILD_TNT_v1",

      standard: "AUDRALIA_G2_TERRAIN_ECOSYSTEM_FORCING_FIELD_STANDARD_v1",
      prewrite: "AUDRALIA_G2_TERRAIN_ECOSYSTEM_FORCING_FIELD_STRATEGIC_CODE_PREWRITE_v1",

      role: "planetary-forcing-parent",
      loadsAfterDatum: true,
      readsDatumLater: true,
      loadsBeforeMoisture: true,
      loadsBeforeSurface: true,
      loadsBeforeClouds: true,

      directCloudPaint: false,
      noCanvasCreated: true,
      noRouteJsAuthority: true,
      noHtmlAuthority: true,

      outputs: [
        "sample(longitude, latitude, time)",
        "getField(frame)",
        "status()"
      ],

      acceptsByPublicContract: true,
      fetchesByCacheKey: true,
      verifiesCapabilityMarker: true,
      staleGlobalRejectedIfCapabilityMissing: true
    },

    moisture: {
      path: "/assets/audralia/clean/runtime/audralia.true-globe.moisture.js",

      publicContract: "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1",
      cacheKey: "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_TERRAIN_FORCING_CONSUMER_TNT_v2",
      capabilityField: "contract",
      capabilityMarker: "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1",

      terrainForcingConsumerField: "terrainForcingConsumerContract",
      terrainForcingConsumerMarker: "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_TERRAIN_FORCING_CONSUMER_TNT_v2",

      nextExpectedDatumConsumer: "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_DATUM_CONSUMER_TNT_v3",

      readsDatumLater: true,
      readsTerrainEcosystem: true,
      loadsAfterDatum: true,
      loadsAfterTerrainEcosystem: true,
      loadsBeforeSurface: true,
      loadsBeforeClouds: true,

      acceptsByPublicContract: true,
      fetchesByCacheKey: true,
      verifiesCapabilityMarker: true
    },

    surface: {
      path: "/assets/audralia/clean/runtime/audralia.true-globe.surface.js",

      publicContract: "AUDRALIA_G2_TRUE_RUNTIME_GRATITUDE_CONTINENT_SURFACE_RENDERER_CHILD_TNT_v1",
      cacheKey: "AUDRALIA_G2_TRUE_RUNTIME_GRATITUDE_CONTINENT_SURFACE_RENDERER_CHILD_TNT_v1",
      capabilityField: "contract",
      capabilityMarker: "AUDRALIA_G2_TRUE_RUNTIME_GRATITUDE_CONTINENT_SURFACE_RENDERER_CHILD_TNT_v1",

      standard: "AUDRALIA_G2_GRATITUDE_CONTINENT_SURFACE_VISUALIZATION_SPEC_OPS_v1",
      nextExpectedDatumConsumer: "AUDRALIA_G2_TRUE_RUNTIME_SURFACE_DATUM_CLIMATE_GROUND_BRIDGE_TNT_v2",

      role: "planet-view-visible-surface-material-renderer",
      gratitudeContinentOnly: true,
      visibleSurfaceAuthority: true,
      drawsBeforeClouds: true,

      readsDatumLater: true,
      loadsAfterDatum: true,
      loadsAfterTerrainEcosystem: true,
      loadsAfterMoisture: true,
      loadsBeforeClouds: true,

      renderApi: "render(ctx, frame, options)",
      layerApi: "buildSurfaceLayer(frame)",
      statusApi: "status()",

      allowedDrawScope: [
        "deep_ocean",
        "shallow_shelf",
        "coastal_edge",
        "gratitude_lowland",
        "gratitude_highland",
        "gratitude_ridge",
        "gratitude_basin",
        "gratitude_wetland",
        "gratitude_hydrology_channel",
        "gratitude_moist_forest",
        "gratitude_dryland_transition"
      ],

      forbiddenDrawScope: [
        "clouds",
        "lattice-view",
        "all-continents",
        "second-canvas",
        "flat-map",
        "static-sticker"
      ],

      noCanvasCreated: true,
      noRouteJsAuthority: true,
      noHtmlAuthority: true,
      noRuntimeMotionAuthority: true,
      drawsClouds: false,
      latticeViewProtected: true,
      planetViewOnly: true,

      acceptsByPublicContract: true,
      fetchesByCacheKey: true,
      verifiesCapabilityMarker: true,
      staleGlobalRejectedIfCapabilityMissing: true
    },

    clouds: {
      path: "/assets/audralia/clean/runtime/audralia.true-globe.clouds.js",

      publicContract: "AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2",
      cacheKey: "AUDRALIA_G2_TRUE_RUNTIME_GLOBAL_MULTI_LAYER_CLOUD_SHELL_CHILD_TNT_v5",
      capabilityField: "lifecycleConservationContract",
      capabilityMarker: "AUDRALIA_G2_TRUE_RUNTIME_CLOUD_LIFECYCLE_CONSERVATION_CHILD_TNT_v3",

      readabilityScaleCalibrationField: "readabilityScaleCalibrationContract",
      readabilityScaleCalibrationMarker: "AUDRALIA_G2_TRUE_RUNTIME_CLOUD_READABILITY_SCALE_CALIBRATION_CHILD_TNT_v4",

      globalMultiLayerCloudShellField: "globalMultiLayerCloudShellContract",
      globalMultiLayerCloudShellMarker: "AUDRALIA_G2_TRUE_RUNTIME_GLOBAL_MULTI_LAYER_CLOUD_SHELL_CHILD_TNT_v5",

      nextExpectedDatumConsumer: "AUDRALIA_G2_TRUE_RUNTIME_CLOUD_DATUM_POLAR_RESONANCE_CHILD_TNT_v6",

      previousPublicContract: "AUDRALIA_G2_TRUE_RUNTIME_4K_MOISTURE_CLOUD_CHILD_TNT_v1",

      readsDatumLater: true,
      loadsAfterDatum: true,
      loadsAfterTerrainEcosystem: true,
      loadsAfterMoisture: true,
      loadsAfterSurface: true,
      rendersAboveSurface: true,

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
      latticeViewCloudsBlocked: true,
      latticeViewSurfaceBlocked: true,
      latticeViewDatumVisualsBlocked: true,
      datumMayUse256SeatSummary: true,
      datumMayNotExposeVisibleGrid: true,
      terrainEcosystemMayUse256SeatSummary: true,
      terrainEcosystemMayNotExposeVisibleGrid: true,
      surfaceMayNotExposeVisibleGrid: true
    },

    planet: {
      planetaryDatumExpected: true,
      trueNorthAuthorityExpected: true,
      trueSouthAuthorityExpected: true,
      equatorAuthorityExpected: true,
      climateBeltAuthorityExpected: true,
      polarResonanceAuthorityExpected: true,

      planetViewCloudsOnly: true,
      planetViewSurfaceAllowed: true,
      gratitudeContinentSurfaceExpected: true,

      datumDrivesTerrainClimatePlacement: true,
      datumDrivesMoistureCirculationLater: true,
      datumDrivesCloudPolarResonanceLater: true,
      datumDrivesSurfaceGroundBridgeLater: true,

      terrainEcosystemForcingExpected: true,
      terrainForcingDrivesMoisture: true,
      moistureDrivesClouds: true,
      surfaceDrawsBeforeClouds: true,
      cloudsRenderAboveSurface: true,
      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsNotVisible256Grid: true,
      naturalTimeActive: true,
      timeLapseBlocked: true,
      cloudMassConservationExpected: true
    },

    chain: {
      currentAuthorityOrder: [
        "html-shell",
        "route-js-consumer",
        "runtime",
        "family-manifest",
        "datum-child",
        "terrain-ecosystem-child",
        "moisture-child",
        "surface-renderer-child",
        "cloud-child",
        "planet-view-renderer"
      ],

      childLoadOrder: [
        "datum",
        "terrainEcosystem",
        "moisture",
        "surface",
        "clouds"
      ],

      planetViewDrawOrder: [
        "route-js-clear-canvas",
        "surface-renderer-draws-ocean-land-gratitude-continent",
        "cloud-child-draws-global-cloud-shell",
        "route-js-draws-limb-rim"
      ],

      correctDatumCausalChain: [
        "planetary datum / axis",
        "terrain climate placement",
        "moisture circulation",
        "surface climate-ground bridge",
        "cloud polar resonance"
      ],

      correctCloudCoverCausalChain: [
        "planetary datum / axis",
        "terrain/ecosystem forcing",
        "moisture eligibility",
        "cloud lifecycle",
        "visual cloud render"
      ],

      correctSurfaceCausalChain: [
        "planetary datum / axis",
        "terrain/ecosystem forcing",
        "surface material classification",
        "visible Gratitude continent",
        "clouds remain above surface"
      ],

      forbiddenCloudCoverCausalChain: [
        "terrain/ecosystem forcing",
        "direct cloud paint"
      ]
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
      htmlChildInternals: false,

      datumDrawsVisuals: false,
      datumCreatesCanvas: false,
      datumPaintsClouds: false,
      datumPaintsTerrain: false,
      datumOwnsRuntimeMotion: false,
      datumOwnsRouteJs: false,
      datumOwnsHtml: false,
      datumVisibleGrid: false,

      terrainDirectCloudPaint: false,
      terrainCanvasCreation: false,
      terrainRouteMutation: false,
      terrainHtmlMutation: false,

      visible256GridInPlanetView: false,

      surfaceDrawsClouds: false,
      surfaceCreatesCanvas: false,
      surfaceOwnsRouteJs: false,
      surfaceOwnsHtml: false,
      surfaceOwnsRuntimeMotion: false,
      surfaceDrawsAllContinents: false,
      surfaceDrawsLatticeView: false
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

    var result = {
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

    if (entryName === "datum") {
      result.planetaryDatumChildReady = Boolean(status.planetaryDatumChildReady);
      result.trueNorthDefined = Boolean(status.trueNorthDefined);
      result.trueSouthDefined = Boolean(status.trueSouthDefined);
      result.equatorDefined = Boolean(status.equatorDefined);
      result.climateBeltClassificationActive = Boolean(status.climateBeltClassificationActive);
      result.polarResonanceActive = Boolean(status.polarResonanceActive);
    }

    if (entryName === "moisture") {
      var terrainMoistureValue = getNestedValue(status, entry.terrainForcingConsumerField);
      result.expectedTerrainForcingConsumerField = entry.terrainForcingConsumerField;
      result.expectedTerrainForcingConsumerMarker = entry.terrainForcingConsumerMarker;
      result.actualTerrainForcingConsumerMarker = terrainMoistureValue || "";
      result.terrainForcingConsumerOk = terrainMoistureValue === entry.terrainForcingConsumerMarker;
    }

    if (entryName === "clouds") {
      var readabilityValue = getNestedValue(status, entry.readabilityScaleCalibrationField);
      var shellValue = getNestedValue(status, entry.globalMultiLayerCloudShellField);

      result.expectedReadabilityScaleCalibrationField = entry.readabilityScaleCalibrationField;
      result.expectedReadabilityScaleCalibrationMarker = entry.readabilityScaleCalibrationMarker;
      result.actualReadabilityScaleCalibrationMarker = readabilityValue || "";
      result.readabilityScaleCalibrationOk = readabilityValue === entry.readabilityScaleCalibrationMarker;

      result.expectedGlobalMultiLayerCloudShellField = entry.globalMultiLayerCloudShellField;
      result.expectedGlobalMultiLayerCloudShellMarker = entry.globalMultiLayerCloudShellMarker;
      result.actualGlobalMultiLayerCloudShellMarker = shellValue || "";
      result.globalMultiLayerCloudShellOk = shellValue === entry.globalMultiLayerCloudShellMarker;
    }

    return result;
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

  function getLoadOrder() {
    return [
      clone(MANIFEST.datum),
      clone(MANIFEST.terrainEcosystem),
      clone(MANIFEST.moisture),
      clone(MANIFEST.surface),
      clone(MANIFEST.clouds)
    ];
  }

  function status() {
    return {
      contract: CONTRACT,
      datumRegistrationContract: DATUM_REGISTRATION_CONTRACT,
      previousRegistrationContract: PREVIOUS_REGISTRATION_CONTRACT,

      standard: STANDARD,
      datumStandard: DATUM_STANDARD,
      terrainStandard: TERRAIN_STANDARD,
      surfaceStandard: SURFACE_STANDARD,

      family: FAMILY,
      file: FILE,

      manifestReady: true,
      familyManifestAuthorityReady: true,

      datumChildRegistered: true,
      datumLoadsBeforeTerrainEcosystem: true,
      datumLoadsBeforeMoisture: true,
      datumLoadsBeforeSurface: true,
      datumLoadsBeforeClouds: true,

      planetaryDatumExpected: true,
      trueNorthAuthorityExpected: true,
      trueSouthAuthorityExpected: true,
      equatorAuthorityExpected: true,
      climateBeltAuthorityExpected: true,
      polarResonanceAuthorityExpected: true,

      terrainEcosystemChildRegistered: true,
      surfaceRendererChildRegistered: true,

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
      nextRequiredRuntimeConsumer: MANIFEST.runtime.nextRequiredRuntimeConsumer,

      datumPath: MANIFEST.datum.path,
      datumPublicContract: MANIFEST.datum.publicContract,
      datumCacheKey: MANIFEST.datum.cacheKey,
      datumCapabilityField: MANIFEST.datum.capabilityField,
      datumCapabilityMarker: MANIFEST.datum.capabilityMarker,
      datumRole: MANIFEST.datum.role,

      terrainEcosystemPath: MANIFEST.terrainEcosystem.path,
      terrainEcosystemPublicContract: MANIFEST.terrainEcosystem.publicContract,
      terrainEcosystemCacheKey: MANIFEST.terrainEcosystem.cacheKey,
      terrainEcosystemCapabilityField: MANIFEST.terrainEcosystem.capabilityField,
      terrainEcosystemCapabilityMarker: MANIFEST.terrainEcosystem.capabilityMarker,
      terrainEcosystemLoadsAfterDatum: true,
      terrainEcosystemLoadsBeforeMoisture: true,
      terrainEcosystemLoadsBeforeSurface: true,
      terrainEcosystemLoadsBeforeClouds: true,

      moisturePublicContract: MANIFEST.moisture.publicContract,
      moistureCacheKey: MANIFEST.moisture.cacheKey,
      moistureCapabilityField: MANIFEST.moisture.capabilityField,
      moistureCapabilityMarker: MANIFEST.moisture.capabilityMarker,
      moistureTerrainForcingConsumerField: MANIFEST.moisture.terrainForcingConsumerField,
      moistureTerrainForcingConsumerMarker: MANIFEST.moisture.terrainForcingConsumerMarker,
      moistureLoadsAfterDatum: true,

      surfacePath: MANIFEST.surface.path,
      surfacePublicContract: MANIFEST.surface.publicContract,
      surfaceCacheKey: MANIFEST.surface.cacheKey,
      surfaceCapabilityField: MANIFEST.surface.capabilityField,
      surfaceCapabilityMarker: MANIFEST.surface.capabilityMarker,
      surfaceRendererChildRegistered: true,
      surfaceRendererExpected: true,
      gratitudeContinentOnly: true,
      surfaceDrawsBeforeClouds: true,
      surfaceLoadsAfterDatum: true,

      cloudPublicContract: MANIFEST.clouds.publicContract,
      cloudCacheKey: MANIFEST.clouds.cacheKey,
      cloudCapabilityField: MANIFEST.clouds.capabilityField,
      cloudCapabilityMarker: MANIFEST.clouds.capabilityMarker,
      cloudReadabilityScaleCalibrationField: MANIFEST.clouds.readabilityScaleCalibrationField,
      cloudReadabilityScaleCalibrationMarker: MANIFEST.clouds.readabilityScaleCalibrationMarker,
      cloudGlobalMultiLayerCloudShellField: MANIFEST.clouds.globalMultiLayerCloudShellField,
      cloudGlobalMultiLayerCloudShellMarker: MANIFEST.clouds.globalMultiLayerCloudShellMarker,
      cloudLoadsAfterDatum: true,

      childLoadOrder: MANIFEST.chain.childLoadOrder.slice(),

      latticeViewProtected: true,
      planetViewSurfaceAllowed: true,
      planetViewCloudsOnly: true,
      latticeViewCloudsBlocked: true,
      latticeViewSurfaceBlocked: true,
      latticeViewDatumVisualsBlocked: true,

      datumDrivesTerrainClimatePlacement: true,
      terrainForcingDrivesMoisture: true,
      moistureDrivesClouds: true,
      terrainDirectCloudPaint: false,
      surfaceDrawsClouds: false,
      cloudsRenderAboveSurface: true,

      radialNodes: 16,
      fibonacciBands: 16,
      latticeStates: 256,

      noDrawAuthority: true,
      noRouteJsChange: true,
      noHtmlChange: true,
      noRuntimeChangeInThisPhase: true,

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
      datumRegistrationContract: DATUM_REGISTRATION_CONTRACT,
      previousRegistrationContract: PREVIOUS_REGISTRATION_CONTRACT,

      standard: STANDARD,
      datumStandard: DATUM_STANDARD,
      terrainStandard: TERRAIN_STANDARD,
      surfaceStandard: SURFACE_STANDARD,

      family: FAMILY,
      file: FILE,

      manifest: clone(MANIFEST),
      getEntry: getEntry,
      getUrl: getUrl,
      getLoadOrder: getLoadOrder,
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
      datumRegistrationContract: DATUM_REGISTRATION_CONTRACT,
      previousRegistrationContract: PREVIOUS_REGISTRATION_CONTRACT,
      standard: STANDARD,
      datumStandard: DATUM_STANDARD,
      family: FAMILY,
      file: FILE,
      datumChildRegistered: true,
      childLoadOrder: MANIFEST.chain.childLoadOrder.slice(),
      bootedAt: new Date().toISOString(),
      meaning: "Audralia runtime family manifest evaluated with planetary datum child registered before terrain/ecosystem."
    };

    return api;
  }

  publish();
})();
