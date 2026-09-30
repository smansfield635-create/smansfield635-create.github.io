(() => {
  "use strict";

  const PUBLIC_BASE_HEAD = "8ca9f9fcae3e975993f8c50a4c2524cee0de0f1c";

  const SOURCES = Object.freeze({
    P1: Object.freeze({ passage: "P1", identity: "ARRIVAL_STARFIELD", path: "assets/build/fibonacci-cosmos-core-v7.js", blob: "93a9fc9989b53ef75319dc1af0206ebc6a2b537c", mode: "ALGORITHM_DERIVATION", implementation: "VERTICAL_SLICE_ACTIVE" }),
    P2: Object.freeze({ passage: "P2", identity: "COMPASS", path: "assets/compass/upstream-compass.geometry.js", blob: "fe35d8d844859a6af810684ace53d2c65258522f", mode: "PURE_GEOMETRY_EXTRACTION", implementation: "VERTICAL_SLICE_ACTIVE" }),
    P3: Object.freeze({ passage: "P3", identity: "CHAPTER_ONE_HEART", path: "nine-summits-of-love/index.html", blob: "ac955931681b46e39706d298f4f83d4cf50a50c5", mode: "CODE_NATIVE_DESCRIPTOR", implementation: "BOUND_NOT_IMPLEMENTED" }),
    P4: Object.freeze({ passage: "P4", identity: "RESEARCH_FRONTIER", path: "evidence/agentic-frontier/index.html", blob: "06a82735deec6e577b71cf47b2d7246a9d853f0f", mode: "CODE_NATIVE_DESCRIPTOR", implementation: "BOUND_NOT_IMPLEMENTED" }),
    P5: Object.freeze({ passage: "P5", identity: "COHERENCE_DIAGNOSTIC", path: "coherence-diagnostic/index.html", blob: "bef36f101c15fe949b89dd6ecea6117cd471680e", mode: "CODE_NATIVE_DESCRIPTOR", implementation: "BOUND_NOT_IMPLEMENTED" }),
    P6: Object.freeze({ passage: "P6", identity: "COHERISCOPE", path: "assets/compass/compass.brain-scene.js", blob: "325b9486d0ab2136d425aed9468c22c28c67a57b", mode: "CODE_NATIVE_DESCRIPTOR", implementation: "BOUND_NOT_IMPLEMENTED" }),
    P7A: Object.freeze({ passage: "P7A", identity: "HOUSE", path: "assets/compass/compass.house-scene.js", blob: "a82e3c963a10808b9f8f1922faab45155ea4a62b", mode: "CODE_NATIVE_DESCRIPTOR", implementation: "BOUND_NOT_IMPLEMENTED" }),
    P7B: Object.freeze({ passage: "P7B", identity: "MIRRORLAND_WINDOW", path: "assets/shared/mirrorland-window.geometry.js", blob: "fb3ee8ab92fa4b08e7708b83780de75d1a6f8595", mode: "PURE_GEOMETRY_EXTRACTION", implementation: "BOUND_NOT_IMPLEMENTED" }),
    P7C: Object.freeze({ passage: "P7C", identity: "JEEVES_TALK_TO_HOUSE", path: "showroom/globe/hearth/jeeves/index.html", blob: "fe909379190431baaf825df1b776ec1d66c305f2", mode: "SEMANTIC_IDENTITY_DESCRIPTOR", implementation: "BOUND_NOT_IMPLEMENTED" }),
    P8: Object.freeze({ passage: "P8", identity: "BUILD_YOUR_OWN_WEBSITE", path: "build/index.html", blob: "7875a6a220fa44da24fe2ad805bb1e146440b5d6", mode: "CODE_NATIVE_DESCRIPTOR", implementation: "BOUND_NOT_IMPLEMENTED" }),
    P9: Object.freeze({ passage: "P9", identity: "AUDRALIA_WORLD", path: "inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs", blob: "872d20b17bb0cd89d9613ca0262b25350890a617", mode: "CANONICAL_GEOMETRY_EXTRACTION", implementation: "BOUND_NOT_IMPLEMENTED" }),
    P10: Object.freeze({ passage: "P10", identity: "TROPHY_AWARDS", path: "assets/compass/compass.trophy-scene.js", blob: "d281e18b06128671ffe2a19e8fdb272cc5544e31", mode: "CODE_NATIVE_DESCRIPTOR", implementation: "BOUND_NOT_IMPLEMENTED" }),
    P11: Object.freeze({ passage: "P11", identity: "RETURN_COMPASS_HANDOFF", path: "assets/compass/upstream-compass.geometry.js", blob: "fe35d8d844859a6af810684ace53d2c65258522f", mode: "PURE_GEOMETRY_EXTRACTION_TO_LIVE_HANDOFF", implementation: "BOUND_NOT_IMPLEMENTED" })
  });

  const FIBONACCI_COSMOS = Object.freeze({
    source: SOURCES.P1,
    model: "DGB_BUILD_GOVERNANCE_FIBONACCI_COSMOS_v7",
    goldenAngle: Math.PI * (3 - Math.sqrt(5)),
    deterministicFieldSeed: 0x44474243,
    minimumStars: 105,
    maximumStars: 230,
    areaDivisor: 6200,
    rogueRatio: 0.14,
    mobileDprCap: 1,
    desktopDprCap: 1.25,
    colors: Object.freeze([
      "255,248,224",
      "154,217,225",
      "234,208,131",
      "170,155,224"
    ])
  });

  const COMPASS = Object.freeze({
    source: SOURCES.P2,
    sourceModule: "DGB_UPSTREAM_COMPASS_GEOMETRY",
    sourceVersion: "3.0.0-fixed-center-independent-sibling",
    objectClass: "HOME_COMPASS_FIXED_CENTER_INSTRUMENT",
    projection: "CINEMATIC_2D_PROJECTION_OF_SOURCE_MESH_DATA",
    navigationAuthority: false,
    controllerAuthority: false,
    destinationGpuContext: false
  });

  const MATERIAL = Object.freeze({
    id: "DGB_CODE_NATIVE_HOLOGRAPHIC_MATERIAL_v1",
    base: "restrained-translucent-technical",
    warm: "244,214,128",
    cool: "102,196,215",
    ink: "248,242,224",
    stableFilter: "none",
    fullscreenAnimatedFilter: false,
    backdropFilterDuringPlaying: false,
    genericNeonWireframe: false
  });

  globalThis.DGB_HOLOGRAPHIC_DESCRIPTORS = Object.freeze({
    schema: "COMPASS_HOLOGRAPHIC_DESCRIPTOR_MANIFEST_v1",
    publicBaseHead: PUBLIC_BASE_HEAD,
    sources: SOURCES,
    fibonacciCosmos: FIBONACCI_COSMOS,
    compass: COMPASS,
    material: MATERIAL,
    descriptorCount: Object.keys(SOURCES).length,
    activeVerticalSlicePassages: Object.freeze(["P1", "P2"]),
    destinationRuntimeImports: false,
    destinationOwnedGpuContexts: 0
  });
})();
