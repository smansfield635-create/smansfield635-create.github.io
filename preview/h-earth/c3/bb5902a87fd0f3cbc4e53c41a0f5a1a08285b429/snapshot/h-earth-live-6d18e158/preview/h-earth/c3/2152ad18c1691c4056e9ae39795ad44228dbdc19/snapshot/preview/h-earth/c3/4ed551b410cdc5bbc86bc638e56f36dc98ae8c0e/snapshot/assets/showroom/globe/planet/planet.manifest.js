// /assets/showroom/globe/planet/planet.manifest.js
// AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MANIFEST_TNT_v1
// Full-file replacement.
// File 1 of 16.
// Universal planet-family manifest.
// Purpose:
// - Establishes Showroom Globe universal planet-family law.
// - Defines the 16 primary files and 256 nodal construct.
// - Defines Fibonacci build chronology.
// - Defines authority boundaries, load order, inheritance rules, and retired-chain exclusion.
// - Establishes Audralia as the first specific planet instance.
// - Establishes H-Earth / Hybrid Earth as downstream ground-view expression of Planet Audralia.
// - Does not render.
// - Does not mount.
// - Does not draw.
// - Does not own land, water, weather, surface, motion, controls, canvas, route, or HTML.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MANIFEST_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MANIFEST_RECEIPT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-planet-family-manifest-v1";

  const UNIVERSAL_ANCHOR = "/showroom/globe/";
  const AUDRALIA_ROUTE = "/showroom/globe/audralia/";
  const H_EARTH_ROUTE = "/showroom/globe/h-earth/";

  const CORE_LAW = Object.freeze({
    chronology: "Fibonacci governs chronological growth.",
    primaryStructure: "16 governs primary file structure.",
    nodalExpansion: "256 governs full nodal expansion.",
    construct: "16 primary files × 16 subnodes = 256 nodal construct.",
    universalAnchor: "Showroom Globe carries universal planet-family law.",
    planetInstance: "Audralia is the specific planet instance and Possibility Path.",
    downstreamGroundView: "H-Earth / Hybrid Earth is a downstream ground-view expression of Planet Audralia.",
    oneFileOneJob: true
  });

  const RETIRED_AUTHORITY = Object.freeze([
    "routefinder",
    "projection-space-landmask",
    "surface-texture-visibility-override",
    "asset-chain-held",
    "legacy-visible-guard",
    "false-visible-proof-label",
    "mixed-route-canvas-authority",
    "atmosphere-before-surface-truth"
  ]);

  const DEPLOYMENT_TOUCHPOINTS = Object.freeze([
    {
      order: 17,
      path: "/showroom/globe/audralia/index.js",
      role: "route bridge only",
      authority: "loads clean engine after the 16-file planet family exists",
      ownsPlanetTruth: false,
      ownsRenderTruth: false
    },
    {
      order: 18,
      path: "/showroom/globe/audralia/index.html",
      role: "expression shell only",
      authority: "visible page surface and mount frame",
      ownsPlanetTruth: false,
      ownsRenderTruth: false
    }
  ]);

  const PRIMARY_FILES = Object.freeze([
    {
      node: 1,
      fibonacci: 1,
      subnodes: [1, 16],
      phase: "first-seed",
      path: "/assets/showroom/globe/planet/planet.manifest.js",
      contract: CONTRACT,
      role: "universal manifest, file-family registry, load order, retired-chain law",
      authority: "family-law",
      universal: true,
      planetSpecific: false,
      parentAnchor: UNIVERSAL_ANCHOR,
      owns: ["family law", "file registry", "load order", "authority boundaries", "retired-chain exclusion"],
      doesNotOwn: ["math", "lattice", "palette", "identity", "landmask", "hydrology", "elevation", "climate", "biome", "surface", "atmosphere", "runtime", "controls", "canvas", "engine", "route", "html"]
    },
    {
      node: 2,
      fibonacci: 1,
      subnodes: [17, 32],
      phase: "second-seed",
      path: "/assets/showroom/globe/planet/planet.math.js",
      contract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1",
      role: "universal projection, spherical math, noise, ratios, coordinate helpers",
      authority: "computation",
      universal: true,
      planetSpecific: false,
      parentAnchor: UNIVERSAL_ANCHOR,
      owns: ["math", "projection helpers", "noise helpers", "ratio helpers", "coordinate helpers"],
      doesNotOwn: ["family law", "palette", "identity", "landmask", "surface", "runtime state", "canvas", "route", "html"]
    },
    {
      node: 3,
      fibonacci: 2,
      subnodes: [33, 48],
      phase: "first-pair-expansion",
      path: "/assets/showroom/globe/planet/planet.lattice.js",
      contract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_LATTICE_TNT_v1",
      role: "universal 16 × 16 / 256-state planet lattice",
      authority: "256-node-address-structure",
      universal: true,
      planetSpecific: false,
      parentAnchor: UNIVERSAL_ANCHOR,
      owns: ["16-by-16 lattice", "256-node address structure", "node addressing"],
      doesNotOwn: ["math primitives", "colors", "land", "water", "climate", "surface", "canvas"]
    },
    {
      node: 4,
      fibonacci: 2,
      subnodes: [49, 64],
      phase: "first-pair-expansion",
      path: "/assets/showroom/globe/planet/planet.palette.js",
      contract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_PALETTE_TNT_v1",
      role: "universal material and color constants",
      authority: "material-constants",
      universal: true,
      planetSpecific: false,
      parentAnchor: UNIVERSAL_ANCHOR,
      owns: ["material constants", "color constants", "render-safe palette values"],
      doesNotOwn: ["surface synthesis", "atmosphere behavior", "planet identity", "landmask", "canvas"]
    },
    {
      node: 5,
      fibonacci: 3,
      subnodes: [65, 80],
      phase: "identity-to-body",
      path: "/assets/audralia/clean/audralia.identity.js",
      contract: "AUDRALIA_CLEAN_CANVAS_IDENTITY_TNT_v1",
      role: "Audralia identity, Possibility Path, clean-slate mirror world, Nine Summits placement",
      authority: "planet-identity",
      universal: false,
      planetSpecific: true,
      parentAnchor: AUDRALIA_ROUTE,
      owns: ["Audralia identity", "Possibility Path identity", "Nine Summits Universe placement", "H-Earth relationship statement"],
      doesNotOwn: ["land", "water", "climate", "surface", "atmosphere", "runtime", "canvas"]
    },
    {
      node: 6,
      fibonacci: 3,
      subnodes: [81, 96],
      phase: "identity-to-body",
      path: "/assets/audralia/clean/audralia.landmask.js",
      contract: "AUDRALIA_CLEAN_CANVAS_LANDMASK_TNT_v1",
      role: "Audralia land/ocean footprint authority",
      authority: "land-ocean-footprint",
      universal: false,
      planetSpecific: true,
      parentAnchor: AUDRALIA_ROUTE,
      owns: ["land footprint", "ocean footprint", "continents", "islands", "shelves", "bays", "inlets", "seaways"],
      doesNotOwn: ["water behavior", "height", "climate", "biome", "surface color", "atmosphere", "runtime", "canvas"]
    },
    {
      node: 7,
      fibonacci: 3,
      subnodes: [97, 112],
      phase: "identity-to-body",
      path: "/assets/audralia/clean/audralia.hydrology.js",
      contract: "AUDRALIA_CLEAN_CANVAS_HYDROLOGY_TNT_v1",
      role: "Audralia water behavior and watershed authority",
      authority: "water-behavior",
      universal: false,
      planetSpecific: true,
      parentAnchor: AUDRALIA_ROUTE,
      owns: ["rivers", "lakes", "inland seas", "wetlands", "deltas", "estuaries", "lagoons", "watersheds"],
      doesNotOwn: ["core land/ocean footprint", "continents", "height", "climate", "surface", "atmosphere", "canvas"]
    },
    {
      node: 8,
      fibonacci: 5,
      subnodes: [113, 128],
      phase: "physical-condition-field",
      path: "/assets/audralia/clean/audralia.elevation.js",
      contract: "AUDRALIA_CLEAN_CANVAS_ELEVATION_TNT_v1",
      role: "Audralia vertical depth authority",
      authority: "vertical-depth",
      universal: false,
      planetSpecific: true,
      parentAnchor: AUDRALIA_ROUTE,
      owns: ["mountains", "ridges", "cliffs", "basins", "valleys", "plateaus", "snowline", "shadow pressure"],
      doesNotOwn: ["land/ocean footprint", "hydrology", "climate", "biome", "surface color", "atmosphere", "canvas"]
    },
    {
      node: 9,
      fibonacci: 5,
      subnodes: [129, 144],
      phase: "physical-condition-field",
      path: "/assets/audralia/clean/audralia.climate.js",
      contract: "AUDRALIA_CLEAN_CANVAS_CLIMATE_TNT_v1",
      role: "Audralia condition-field authority",
      authority: "condition-fields",
      universal: false,
      planetSpecific: true,
      parentAnchor: "/showroom/globe/audralia/index.html",
      owns: ["heat", "moisture", "aridity", "cold", "rainfall", "climate bands"],
      doesNotOwn: ["land/ocean footprint", "water behavior", "height", "biome", "surface", "atmosphere rendering", "canvas"]
    },
    {
      node: 10,
      fibonacci: 5,
      subnodes: [145, 160],
      phase: "physical-condition-field",
      path: "/assets/audralia/clean/audralia.biome.js",
      contract: "AUDRALIA_CLEAN_CANVAS_BIOME_TNT_v1",
      role: "Audralia living-world category authority",
      authority: "living-categories",
      universal: false,
      planetSpecific: true,
      parentAnchor: "/showroom/globe/audralia/index.html",
      owns: ["forest", "grassland", "wetland", "desert", "alpine", "coastal", "polar", "restoration zones"],
      doesNotOwn: ["land/ocean footprint", "hydrology", "height", "climate physics", "surface material synthesis", "atmosphere", "canvas"]
    },
    {
      node: 11,
      fibonacci: 5,
      subnodes: [161, 176],
      phase: "physical-condition-field",
      path: "/assets/audralia/clean/audralia.surface.js",
      contract: "AUDRALIA_CLEAN_CANVAS_SURFACE_TNT_v1",
      role: "Audralia visible land/water material synthesis",
      authority: "visible-material-synthesis",
      universal: false,
      planetSpecific: true,
      parentAnchor: "/showroom/globe/audralia/index.html",
      owns: ["visible material synthesis", "land material", "water material", "coast material", "terrain material"],
      doesNotOwn: ["land/ocean footprint", "water behavior", "height", "climate", "biome categories", "atmosphere", "motion", "canvas"]
    },
    {
      node: 12,
      fibonacci: 5,
      subnodes: [177, 192],
      phase: "physical-condition-field",
      path: "/assets/audralia/clean/audralia.atmosphere.js",
      contract: "AUDRALIA_CLEAN_CANVAS_ATMOSPHERE_TNT_v1",
      role: "Audralia atmosphere, weather, haze, rim light, cloud veil, downstream inheritance source",
      authority: "atmosphere-weather-inheritance-source",
      universal: false,
      planetSpecific: true,
      parentAnchor: "/showroom/globe/audralia/index.html",
      owns: ["atmosphere", "weather source", "haze", "rim light", "cloud veil", "terminator softness", "H-Earth condition inheritance"],
      doesNotOwn: ["land/ocean footprint", "surface material truth", "runtime", "controls", "canvas", "route", "html"]
    },
    {
      node: 13,
      fibonacci: 8,
      subnodes: [193, 208],
      phase: "motion-interaction-composition-field",
      path: "/assets/audralia/clean/audralia.runtime.js",
      contract: "AUDRALIA_CLEAN_CANVAS_RUNTIME_TNT_v1",
      role: "Audralia motion authority only",
      authority: "motion-only",
      universal: false,
      planetSpecific: true,
      parentAnchor: "/showroom/globe/audralia/index.js",
      owns: ["spin", "glide", "frame pacing", "resize state", "reduced-motion handling"],
      doesNotOwn: ["land", "water", "weather", "surface", "atmosphere truth", "controls", "canvas", "route", "html"]
    },
    {
      node: 14,
      fibonacci: 8,
      subnodes: [209, 224],
      phase: "motion-interaction-composition-field",
      path: "/assets/audralia/clean/audralia.controls.js",
      contract: "AUDRALIA_CLEAN_CANVAS_CONTROLS_TNT_v1",
      role: "Audralia drag/touch inspection authority only",
      authority: "inspection-only",
      universal: false,
      planetSpecific: true,
      parentAnchor: "/showroom/globe/audralia/index.js",
      owns: ["drag input", "touch input", "pointer inspection", "gesture safety"],
      doesNotOwn: ["motion truth", "land", "water", "surface", "atmosphere", "canvas composition", "route", "html"]
    },
    {
      node: 15,
      fibonacci: 8,
      subnodes: [225, 240],
      phase: "motion-interaction-composition-field",
      path: "/assets/audralia/clean/audralia.canvas.js",
      contract: "AUDRALIA_CLEAN_CANVAS_COMPOSITOR_TNT_v1",
      role: "Audralia canvas compositor only",
      authority: "composition-only",
      universal: false,
      planetSpecific: true,
      parentAnchor: "/showroom/globe/audralia/index.js",
      owns: ["draw order", "composition", "visible canvas assembly", "offscreen buffer coordination"],
      doesNotOwn: ["land/ocean footprint", "water behavior", "height", "climate", "biome", "surface truth", "atmosphere truth", "runtime truth", "route", "html"]
    },
    {
      node: 16,
      fibonacci: 8,
      subnodes: [241, 256],
      phase: "motion-interaction-composition-field",
      path: "/assets/audralia/clean/audralia.engine.js",
      contract: "AUDRALIA_CLEAN_CANVAS_ENGINE_TNT_v1",
      role: "Audralia clean engine coordinator, chain verifier, mount API",
      authority: "chain-verification-and-mount-api",
      universal: false,
      planetSpecific: true,
      parentAnchor: "/showroom/globe/audralia/index.js",
      owns: ["chain verification", "engine readiness", "mount API", "consumer-facing status"],
      doesNotOwn: ["family law", "math", "lattice", "palette", "land", "water", "height", "climate", "surface", "atmosphere", "runtime internals", "controls internals", "route", "html"]
    }
  ]);

  const BUILD_ORDER = Object.freeze(PRIMARY_FILES.map((file) => Object.freeze({
    order: file.node,
    path: file.path,
    contract: file.contract,
    authority: file.authority,
    subnodes: file.subnodes
  })));

  const INHERITANCE = Object.freeze({
    sourcePlanet: "Audralia",
    downstreamView: "H-Earth / Hybrid Earth",
    sourceRoute: AUDRALIA_ROUTE,
    downstreamRoute: H_EARTH_ROUTE,
    rule: "H-Earth inherits Audralia planet-level weather, atmosphere, and condition truth by default.",
    localModifierAllowed: true,
    localModifierBoundary: "H-Earth may express local view modifiers but must not duplicate planet-level authority unless explicitly authorized.",
    flow: Object.freeze([
      "audralia.atmosphere.js",
      "audralia.engine.js",
      "/showroom/globe/audralia/index.js",
      "/showroom/globe/audralia/index.html",
      "/showroom/globe/h-earth/"
    ])
  });

  const RENDER_ORDER_STANDARD = Object.freeze([
    "background",
    "planet-body-mask",
    "ocean-land-footprint",
    "shelves-beaches-coastlines",
    "terrain-elevation",
    "hydrology-detail",
    "biome-surface-material",
    "lighting",
    "atmosphere",
    "rim-glow",
    "proof-status"
  ]);

  const FIRST_VISUAL_SUCCESS = Object.freeze([
    "clear ocean",
    "separated landmasses",
    "visible coastlines",
    "shelf and beach transitions",
    "terrain variation",
    "restrained atmosphere",
    "stable sphere body",
    "touch and drag inspection",
    "truthful proof labels"
  ]);

  function clone(value) {
    if (Array.isArray(value)) return value.map(clone);
    if (value && typeof value === "object") {
      const out = {};
      Object.keys(value).forEach((key) => {
        out[key] = clone(value[key]);
      });
      return out;
    }
    return value;
  }

  function getPrimaryFiles() {
    return clone(PRIMARY_FILES);
  }

  function getBuildOrder() {
    return clone(BUILD_ORDER);
  }

  function getFileByNode(node) {
    const number = Number(node);
    const file = PRIMARY_FILES.find((item) => item.node === number);
    return file ? clone(file) : null;
  }

  function getFileByPath(path) {
    const target = String(path || "");
    const file = PRIMARY_FILES.find((item) => item.path === target);
    return file ? clone(file) : null;
  }

  function getNodeBySubnode(subnode) {
    const number = Number(subnode);
    if (!Number.isFinite(number) || number < 1 || number > 256) return null;

    const file = PRIMARY_FILES.find((item) => number >= item.subnodes[0] && number <= item.subnodes[1]);
    if (!file) return null;

    return Object.freeze({
      subnode: number,
      primaryNode: file.node,
      path: file.path,
      contract: file.contract,
      authority: file.authority,
      localIndex: number - file.subnodes[0] + 1
    });
  }

  function isRetiredAuthority(value) {
    const source = String(value || "").toLowerCase();
    return RETIRED_AUTHORITY.some((item) => source.includes(item));
  }

  function isKnownPrimaryPath(path) {
    const target = String(path || "");
    return PRIMARY_FILES.some((item) => item.path === target);
  }

  function assertNextExpectedPath(completedCount, nextPath) {
    const count = Number(completedCount);
    const expected = PRIMARY_FILES[count] || null;
    const supplied = String(nextPath || "");

    return Object.freeze({
      allowed: Boolean(expected && expected.path === supplied),
      completedCount: Number.isFinite(count) ? count : 0,
      expectedNext: expected ? expected.path : null,
      suppliedNext: supplied || null,
      reason: expected
        ? expected.path === supplied
          ? "next_path_matches_invariant_build_order"
          : "next_path_does_not_match_invariant_build_order"
        : "all_primary_files_complete"
    });
  }

  function validatePrimaryFile(fileLike) {
    const path = String(fileLike?.path || "");
    const contract = String(fileLike?.contract || "");
    const match = PRIMARY_FILES.find((item) => item.path === path);

    if (!match) {
      return Object.freeze({
        valid: false,
        path,
        reason: "path_not_registered_in_manifest"
      });
    }

    if (match.contract !== contract) {
      return Object.freeze({
        valid: false,
        path,
        expectedContract: match.contract,
        suppliedContract: contract,
        reason: "contract_mismatch"
      });
    }

    return Object.freeze({
      valid: true,
      path,
      contract,
      node: match.node,
      authority: match.authority,
      reason: "registered_primary_file_matches_manifest"
    });
  }

  function getInheritance() {
    return clone(INHERITANCE);
  }

  function getRenderOrderStandard() {
    return clone(RENDER_ORDER_STANDARD);
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "universal-planet-family-manifest",
      fileNumber: 1,
      totalPrimaryFiles: 16,
      totalSubnodes: 256,
      deploymentTouchpointsAfterPrimaryFiles: clone(DEPLOYMENT_TOUCHPOINTS),
      universalAnchor: UNIVERSAL_ANCHOR,
      firstPlanetInstance: "Audralia",
      firstPlanetRoute: AUDRALIA_ROUTE,
      downstreamGroundView: "H-Earth / Hybrid Earth",
      downstreamGroundRoute: H_EARTH_ROUTE,
      coreLaw: clone(CORE_LAW),
      retiredAuthority: clone(RETIRED_AUTHORITY),
      buildOrder: clone(BUILD_ORDER),
      inheritance: clone(INHERITANCE),
      renderOrderStandard: clone(RENDER_ORDER_STANDARD),
      firstVisualSuccess: clone(FIRST_VISUAL_SUCCESS),
      oneFileOneJob: true,
      fibonacciChronology: true,
      primaryStructure16: true,
      nodalConstruct256: true,
      hEarthInheritsAudraliaConditions: true,
      routeJsBridgeOnly: true,
      htmlExpressionOnly: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    coreLaw: CORE_LAW,
    universalAnchor: UNIVERSAL_ANCHOR,
    audraliaRoute: AUDRALIA_ROUTE,
    hEarthRoute: H_EARTH_ROUTE,
    primaryFiles: PRIMARY_FILES,
    buildOrder: BUILD_ORDER,
    deploymentTouchpoints: DEPLOYMENT_TOUCHPOINTS,
    retiredAuthority: RETIRED_AUTHORITY,
    inheritance: INHERITANCE,
    renderOrderStandard: RENDER_ORDER_STANDARD,
    firstVisualSuccess: FIRST_VISUAL_SUCCESS,
    getPrimaryFiles,
    getBuildOrder,
    getFileByNode,
    getFileByPath,
    getNodeBySubnode,
    isRetiredAuthority,
    isKnownPrimaryPath,
    assertNextExpectedPath,
    validatePrimaryFile,
    getInheritance,
    getRenderOrderStandard,
    getStatus
  });

  window.DGB_PLANET_FAMILY_MANIFEST = API;
  window.DGB_PLANET_FAMILY_MANIFEST_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_MANIFEST = API;
  window.AUDRALIA_CLEAN_CANVAS_MANIFEST_RECEIPT = getStatus();

  if (document?.documentElement?.dataset) {
    document.documentElement.dataset.planetFamilyManifestLoaded = "true";
    document.documentElement.dataset.planetFamilyManifestContract = CONTRACT;
    document.documentElement.dataset.planetFamilyManifestReceipt = RECEIPT;
    document.documentElement.dataset.planetFamilyManifestVersion = VERSION;
    document.documentElement.dataset.planetFamilyUniversalAnchor = UNIVERSAL_ANCHOR;
    document.documentElement.dataset.audraliaCleanCanvasManifestLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasManifestContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasManifestReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasPrimaryFiles = "16";
    document.documentElement.dataset.audraliaCleanCanvasSubnodes = "256";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.audraliaRouteJsBridgeOnly = "true";
    document.documentElement.dataset.audraliaHtmlExpressionOnly = "true";
    document.documentElement.dataset.hEarthInheritsAudraliaConditions = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();
