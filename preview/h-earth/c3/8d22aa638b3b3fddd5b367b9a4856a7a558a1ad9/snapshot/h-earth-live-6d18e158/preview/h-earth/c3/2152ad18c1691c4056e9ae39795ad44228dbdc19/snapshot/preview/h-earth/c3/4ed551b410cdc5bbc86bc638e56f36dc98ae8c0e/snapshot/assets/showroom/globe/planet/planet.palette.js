// /assets/showroom/globe/planet/planet.palette.js
// AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_PALETTE_TNT_v1
// Full-file replacement.
// File 4 of 16.
// Universal planet-family palette authority.
// Purpose:
// - Provides reusable material and color constants for Showroom Globe planet-family builds.
// - Defines render-safe RGB constants for space, ocean, shelf, beach, land, terrain, hydrology, biome, atmosphere, lighting, and proof/status surfaces.
// - Supports Audralia as the first specific planet instance without becoming Audralia-specific.
// - Supports H-Earth downstream inheritance by making atmosphere/weather colors addressable to downstream consumers.
// - Does not render.
// - Does not mount.
// - Does not draw.
// - Does not synthesize surface material.
// - Does not own atmosphere behavior.
// - Does not own manifest law, math primitives, lattice addresses, land, water, weather, surface, motion state, controls, canvas, route, or HTML.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_PALETTE_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_PALETTE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_LATTICE_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-planet-family-palette-v1";

  const FAMILY_ANCHOR = "/showroom/globe/";
  const PRIMARY_NODE = 4;
  const SUBNODE_RANGE = Object.freeze([49, 64]);

  const PALETTE = Object.freeze({
    space: Object.freeze({
      void: Object.freeze([1, 4, 13]),
      deep: Object.freeze([3, 9, 24]),
      field: Object.freeze([7, 18, 36]),
      upperGlow: Object.freeze([17, 45, 63]),
      starSoft: Object.freeze([210, 248, 230]),
      starGold: Object.freeze([244, 210, 128])
    }),

    ocean: Object.freeze({
      abyss: Object.freeze([2, 16, 50]),
      deep: Object.freeze([4, 28, 76]),
      open: Object.freeze([8, 78, 132]),
      living: Object.freeze([12, 104, 150]),
      current: Object.freeze([36, 134, 164]),
      polarWater: Object.freeze([118, 174, 190])
    }),

    shelf: Object.freeze({
      outer: Object.freeze([28, 124, 152]),
      inner: Object.freeze([58, 166, 172]),
      bright: Object.freeze([118, 210, 186]),
      lagoon: Object.freeze([134, 218, 184]),
      reefHint: Object.freeze([178, 224, 174])
    }),

    coast: Object.freeze({
      wetBeach: Object.freeze([166, 150, 98]),
      beach: Object.freeze([222, 198, 126]),
      paleSand: Object.freeze([234, 214, 154]),
      dune: Object.freeze([190, 160, 94]),
      cliffEdge: Object.freeze([118, 112, 88]),
      tidalGreen: Object.freeze([86, 138, 112])
    }),

    land: Object.freeze({
      lowland: Object.freeze([108, 154, 80]),
      fertile: Object.freeze([82, 148, 82]),
      forest: Object.freeze([44, 118, 72]),
      deepForest: Object.freeze([28, 82, 50]),
      grassland: Object.freeze([142, 158, 86]),
      savanna: Object.freeze([170, 150, 78]),
      scrub: Object.freeze([116, 130, 78]),
      dryland: Object.freeze([156, 116, 76]),
      desert: Object.freeze([196, 144, 82])
    }),

    terrain: Object.freeze({
      basin: Object.freeze([98, 84, 66]),
      valley: Object.freeze([58, 78, 62]),
      plateau: Object.freeze([154, 146, 104]),
      highland: Object.freeze([134, 126, 88]),
      mountain: Object.freeze([138, 132, 116]),
      ridge: Object.freeze([158, 150, 122]),
      stone: Object.freeze([102, 108, 102]),
      cliff: Object.freeze([54, 62, 60]),
      shadow: Object.freeze([26, 36, 38]),
      snow: Object.freeze([226, 236, 230]),
      ice: Object.freeze([194, 222, 226])
    }),

    hydrology: Object.freeze({
      river: Object.freeze([38, 134, 152]),
      riverBright: Object.freeze([78, 180, 186]),
      lake: Object.freeze([36, 122, 144]),
      inlandSea: Object.freeze([18, 96, 140]),
      wetland: Object.freeze([60, 124, 104]),
      marsh: Object.freeze([92, 142, 98]),
      delta: Object.freeze([72, 156, 132]),
      estuary: Object.freeze([72, 166, 166]),
      dryChannel: Object.freeze([126, 108, 78])
    }),

    biome: Object.freeze({
      rainforest: Object.freeze([34, 112, 62]),
      temperateForest: Object.freeze([58, 118, 72]),
      restorationGreen: Object.freeze([78, 148, 88]),
      grassland: Object.freeze([138, 158, 86]),
      savanna: Object.freeze([170, 154, 82]),
      desert: Object.freeze([196, 142, 76]),
      wetland: Object.freeze([62, 128, 106]),
      alpine: Object.freeze([152, 168, 150]),
      polar: Object.freeze([214, 232, 232]),
      coastal: Object.freeze([96, 150, 116])
    }),

    atmosphere: Object.freeze({
      deepAir: Object.freeze([42, 92, 132]),
      air: Object.freeze([92, 174, 210]),
      rim: Object.freeze([152, 230, 214]),
      haze: Object.freeze([180, 226, 220]),
      cloud: Object.freeze([234, 242, 235]),
      cloudShadow: Object.freeze([134, 160, 164]),
      warmTerminator: Object.freeze([244, 196, 116]),
      coolTerminator: Object.freeze([76, 126, 170]),
      stormBlue: Object.freeze([74, 112, 144]),
      rainGrey: Object.freeze([116, 138, 146])
    }),

    lighting: Object.freeze({
      daylight: Object.freeze([255, 244, 214]),
      warmLight: Object.freeze([244, 204, 128]),
      coolLight: Object.freeze([176, 214, 238]),
      nightTint: Object.freeze([10, 22, 52]),
      terminatorBlue: Object.freeze([28, 56, 92]),
      specular: Object.freeze([244, 255, 240]),
      rimLight: Object.freeze([168, 242, 222])
    }),

    proof: Object.freeze({
      panel: Object.freeze([5, 18, 28]),
      panelSoft: Object.freeze([8, 28, 38]),
      line: Object.freeze([158, 240, 191]),
      gold: Object.freeze([243, 200, 111]),
      ink: Object.freeze([255, 244, 216]),
      muted: Object.freeze([210, 226, 238]),
      success: Object.freeze([158, 240, 191]),
      held: Object.freeze([243, 200, 111]),
      fail: Object.freeze([244, 126, 112])
    })
  });

  const MATERIAL_ROLES = Object.freeze({
    oceanBase: "ocean.deep",
    oceanVisible: "ocean.open",
    oceanLife: "ocean.living",
    shelfBase: "shelf.outer",
    shelfVisible: "shelf.inner",
    beachBase: "coast.beach",
    wetBeach: "coast.wetBeach",
    lowlandBase: "land.lowland",
    forestBase: "land.forest",
    highlandBase: "terrain.highland",
    mountainBase: "terrain.mountain",
    snowBase: "terrain.snow",
    atmosphereBase: "atmosphere.air",
    atmosphereRim: "atmosphere.rim",
    cloudBase: "atmosphere.cloud",
    weatherStorm: "atmosphere.stormBlue",
    proofLine: "proof.line"
  });

  const RENDER_SAFETY = Object.freeze({
    atmosphereMaxOpacityBeforeSurface: 0.18,
    atmosphereMaxOpacityAfterSurface: 0.34,
    proofLabelMustNotClaimVisualPass: true,
    surfaceTruthBeforeAtmosphere: true,
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
  });

  function clone(value) {
    if (Array.isArray(value)) return Object.freeze(value.map((item) => item));
    if (value && typeof value === "object") {
      const out = {};
      Object.keys(value).forEach((key) => {
        out[key] = clone(value[key]);
      });
      return Object.freeze(out);
    }
    return value;
  }

  function normalizePath(path) {
    return String(path || "").trim().split(".").filter(Boolean);
  }

  function getColor(path, fallback = [255, 255, 255]) {
    const parts = normalizePath(path);
    let cursor = PALETTE;

    for (const part of parts) {
      if (!cursor || typeof cursor !== "object" || !(part in cursor)) {
        return Object.freeze(Array.isArray(fallback) ? fallback.slice(0, 3) : [255, 255, 255]);
      }
      cursor = cursor[part];
    }

    if (!Array.isArray(cursor)) {
      return Object.freeze(Array.isArray(fallback) ? fallback.slice(0, 3) : [255, 255, 255]);
    }

    return Object.freeze(cursor.slice(0, 3));
  }

  function getRoleColor(role, fallback = [255, 255, 255]) {
    const key = String(role || "").trim();
    const path = MATERIAL_ROLES[key];

    if (!path) {
      return Object.freeze(Array.isArray(fallback) ? fallback.slice(0, 3) : [255, 255, 255]);
    }

    return getColor(path, fallback);
  }

  function getGroup(group) {
    const key = String(group || "").trim();
    if (!PALETTE[key]) return null;
    return clone(PALETTE[key]);
  }

  function listGroups() {
    return Object.freeze(Object.keys(PALETTE));
  }

  function listRoleNames() {
    return Object.freeze(Object.keys(MATERIAL_ROLES));
  }

  function colorToRgbString(color) {
    const source = Array.isArray(color) ? color : [255, 255, 255];
    const r = Math.max(0, Math.min(255, Math.round(Number(source[0]) || 0)));
    const g = Math.max(0, Math.min(255, Math.round(Number(source[1]) || 0)));
    const b = Math.max(0, Math.min(255, Math.round(Number(source[2]) || 0)));
    return `rgb(${r},${g},${b})`;
  }

  function colorToRgbaString(color, alpha = 1) {
    const source = Array.isArray(color) ? color : [255, 255, 255];
    const r = Math.max(0, Math.min(255, Math.round(Number(source[0]) || 0)));
    const g = Math.max(0, Math.min(255, Math.round(Number(source[1]) || 0)));
    const b = Math.max(0, Math.min(255, Math.round(Number(source[2]) || 0)));
    const a = Math.max(0, Math.min(1, Number(alpha) || 0));
    return `rgba(${r},${g},${b},${a})`;
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_palette_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/showroom/globe/planet/planet.palette.js",
        contract: CONTRACT
      });
    } catch (error) {
      return Object.freeze({
        manifestAvailable: true,
        valid: false,
        reason: error instanceof Error ? error.message : String(error)
      });
    }
  }

  function validatePriorAuthorities() {
    const math = window.DGB_PLANET_FAMILY_MATH || window.AUDRALIA_CLEAN_CANVAS_MATH || null;
    const lattice = window.DGB_PLANET_FAMILY_LATTICE || window.AUDRALIA_CLEAN_CANVAS_LATTICE || null;

    return Object.freeze({
      math: Object.freeze({
        available: Boolean(math),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1",
        actualContract: math?.contract || null,
        valid: !math || math.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1"
      }),
      lattice: Object.freeze({
        available: Boolean(lattice),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_LATTICE_TNT_v1",
        actualContract: lattice?.contract || null,
        valid: !lattice || lattice.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_LATTICE_TNT_v1"
      })
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "universal-planet-family-palette",
      fileNumber: 4,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      universalAnchor: FAMILY_ANCHOR,
      owns: Object.freeze([
        "material constants",
        "color constants",
        "render-safe color groups",
        "palette role names",
        "RGB/RGBA string conversion",
        "atmosphere/weather color addressability for downstream consumers"
      ]),
      doesNotOwn: Object.freeze([
        "manifest law",
        "math primitives",
        "lattice authority",
        "Audralia identity",
        "landmask",
        "hydrology",
        "elevation",
        "climate",
        "biome",
        "surface material synthesis",
        "atmosphere behavior",
        "weather behavior",
        "runtime state",
        "controls",
        "canvas composition",
        "route bridge",
        "HTML expression"
      ]),
      groups: listGroups(),
      roles: listRoleNames(),
      renderSafety: clone(RENDER_SAFETY),
      manifestRegistration: validateManifestRegistration(),
      priorAuthorities: validatePriorAuthorities(),
      hEarthCanReadAtmosphereColors: true,
      fibonacciChronology: true,
      primaryStructure16: true,
      nodalConstruct256: true,
      oneFileOneJob: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    FAMILY_ANCHOR,
    PRIMARY_NODE,
    SUBNODE_RANGE,

    palette: PALETTE,
    materialRoles: MATERIAL_ROLES,
    renderSafety: RENDER_SAFETY,

    getColor,
    getRoleColor,
    getGroup,
    listGroups,
    listRoleNames,
    colorToRgbString,
    colorToRgbaString,
    validateManifestRegistration,
    validatePriorAuthorities,
    getStatus
  });

  window.DGB_PLANET_FAMILY_PALETTE = API;
  window.DGB_PLANET_FAMILY_PALETTE_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_PALETTE = API;
  window.AUDRALIA_CLEAN_CANVAS_PALETTE_RECEIPT = getStatus();

  if (document?.documentElement?.dataset) {
    document.documentElement.dataset.planetFamilyPaletteLoaded = "true";
    document.documentElement.dataset.planetFamilyPaletteContract = CONTRACT;
    document.documentElement.dataset.planetFamilyPaletteReceipt = RECEIPT;
    document.documentElement.dataset.planetFamilyPaletteVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasPaletteLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasPaletteContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasPaletteReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasPaletteNode = "4";
    document.documentElement.dataset.audraliaCleanCanvasPaletteSubnodes = "49-64";
    document.documentElement.dataset.audraliaCleanCanvasPaletteGroups = String(listGroups().length);
    document.documentElement.dataset.audraliaCleanCanvasMaterialRoles = String(listRoleNames().length);
    document.documentElement.dataset.hEarthCanReadAudraliaAtmosphereColors = "true";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();
