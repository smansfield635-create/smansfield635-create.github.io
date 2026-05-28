// /assets/hearth/hearth.canvas.js
// HEARTH_RICH_BLUE_OCEAN_BODY_CANVAS_CONSUMER_TNT_v1
// Full-file replacement.
// Canvas / composition authority only.
// Purpose:
// - Compose Hearth hydrology + terrain materials + separate ocean authority.
// - Make HEARTH.ocean visibly active without collapsing ocean into terrain materials.
// - Increase rich-blue ocean visibility in water-classified regions.
// - Preserve dry land, submerged scars/blocks, basin darkness, route stability, and runtime/controls separation.
// Does not own:
// - hydrology classification
// - ocean authority generation
// - terrain material generation
// - elevation generation
// - tectonics
// - route orchestration
// - runtime motion
// - controls
// - beaches/cliffs/islands generation
// - clickable ports
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_RICH_BLUE_OCEAN_BODY_CANVAS_CONSUMER_TNT_v1";
  const RECEIPT = "HEARTH_RICH_BLUE_OCEAN_BODY_CANVAS_CONSUMER_RECEIPT_v1";
  const OCEAN_CONTRACT = "HEARTH_RICH_BLUE_OCEAN_BODY_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-28.hearth-rich-blue-ocean-body-canvas-consumer-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;

  const FALLBACK = Object.freeze({
    land: [82, 84, 58],
    raised: [100, 96, 67],
    stone: [58, 62, 55],
    water: [8, 31, 76],
    deepWater: [3, 12, 34],
    shelf: [22, 69, 91],
    basin: [4, 15, 28],
    scar: [30, 39, 36],
    shadow: [2, 7, 15]
  });

  const clamp = (value, min, max) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  };

  const clamp01 = (value) => clamp(value, 0, 1);

  const mixNumber = (a, b, t) => {
    const k = clamp01(t);
    return a + (b - a) * k;
  };

  const mixColor = (a, b, t) => {
    const k = clamp01(t);
    return [
      clamp(Math.round(mixNumber(a[0], b[0], k)), 0, 255),
      clamp(Math.round(mixNumber(a[1], b[1], k)), 0, 255),
      clamp(Math.round(mixNumber(a[2], b[2], k)), 0, 255)
    ];
  };

  const scaleColor = (rgb, scalar) => {
    const s = Number.isFinite(Number(scalar)) ? Number(scalar) : 1;
    return [
      clamp(Math.round(rgb[0] * s), 0, 255),
      clamp(Math.round(rgb[1] * s), 0, 255),
      clamp(Math.round(rgb[2] * s), 0, 255)
    ];
  };

  const liftOceanBlue = (rgb, strength) => {
    const k = clamp01(strength);
    return [
      clamp(Math.round(rgb[0] * (1 - k * 0.10)), 0, 255),
      clamp(Math.round(rgb[1] * (1 + k * 0.10)), 0, 255),
      clamp(Math.round(rgb[2] * (1 + k * 0.24)), 0, 255)
    ];
  };

  const normalize3 = (p) => {
    const x = Number.isFinite(Number(p && p.x)) ? Number(p.x) : 0;
    const y = Number.isFinite(Number(p && p.y)) ? Number(p.y) : 0;
    const z = Number.isFinite(Number(p && p.z)) ? Number(p.z) : 1;
    const m = Math.hypot(x, y, z) || 1;
    return { x: x / m, y: y / m, z: z / m };
  };

  const dot3 = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

  const lonLatToVector = (lonDeg, latDeg) => {
    const lon = Number(lonDeg || 0) * DEG;
    const lat = Number(latDeg || 0) * DEG;
    const c = Math.cos(lat);
    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  };

  const parseInput = (...args) => {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        return normalize3(p);
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        return lonLatToVector(Number(p.lon), Number(p.lat));
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        return lonLatToVector(Number(p.longitude), Number(p.latitude));
      }

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        return lonLatToVector(Number(p.u) * 360 - 180, 90 - Number(p.v) * 180);
      }
    }

    if (args.length >= 3) return normalize3({ x: args[0], y: args[1], z: args[2] });
    if (args.length >= 2) return lonLatToVector(Number(args[0]), Number(args[1]));
    return lonLatToVector(0, 0);
  };

  const numberField = (source, key, fallback = 0) => {
    const n = Number(source && source[key]);
    return Number.isFinite(n) ? n : fallback;
  };

  const boolField = (source, key, fallback = false) => {
    return typeof (source && source[key]) === "boolean" ? source[key] : fallback;
  };

  const stringField = (source, key, fallback = "") => {
    return typeof (source && source[key]) === "string" && source[key] ? source[key] : fallback;
  };

  const colorField = (source, keys, fallback) => {
    for (const key of keys) {
      const value = source && source[key];
      if (
        Array.isArray(value) &&
        value.length >= 3 &&
        value.every((v) => Number.isFinite(Number(v)))
      ) {
        return [
          clamp(Math.round(Number(value[0])), 0, 255),
          clamp(Math.round(Number(value[1])), 0, 255),
          clamp(Math.round(Number(value[2])), 0, 255)
        ];
      }
    }

    return fallback.slice();
  };

  const getHydrologyAuthority = () => {
    if (root.HEARTH && root.HEARTH.hydrology) return root.HEARTH.hydrology;
    if (root.HEARTH_HYDROLOGY) return root.HEARTH_HYDROLOGY;
    if (root.HearthHydrology) return root.HearthHydrology;
    return null;
  };

  const getMaterialsAuthority = () => {
    if (root.HEARTH && root.HEARTH.materials) return root.HEARTH.materials;
    if (root.HEARTH_MATERIALS) return root.HEARTH_MATERIALS;
    if (root.HearthMaterials) return root.HearthMaterials;
    return null;
  };

  const getOceanAuthority = () => {
    if (root.HEARTH && root.HEARTH.ocean) return root.HEARTH.ocean;
    if (root.HEARTH_OCEAN) return root.HEARTH_OCEAN;
    if (root.HearthOcean) return root.HearthOcean;
    return null;
  };

  const callAuthority = (authority, methods, args) => {
    if (!authority) return null;

    for (const method of methods) {
      if (typeof authority[method] !== "function") continue;

      try {
        const result = authority[method].apply(authority, args);
        if (result && typeof result === "object") return result;
      } catch (_error) {
        try {
          const p = parseInput(...args);
          const result = authority[method].call(authority, p);
          if (result && typeof result === "object") return result;
        } catch (_error2) {}
      }
    }

    return null;
  };

  const fallbackMaterial = (p) => {
    const isWater = p.z < 0.22;
    const isCoast = Math.abs(p.z - 0.22) < 0.16;

    let rgb = isWater ? FALLBACK.water : FALLBACK.land;
    if (p.y > 0.55) rgb = mixColor(rgb, FALLBACK.stone, 0.22);
    if (isCoast) rgb = mixColor(rgb, FALLBACK.stone, 0.18);

    return {
      contract: "HEARTH_CANVAS_FALLBACK_MATERIAL",
      receipt: "FALLBACK_MATERIAL_USED",
      rgb,
      color: rgb,
      alpha: 1,
      isLand: !isWater,
      isWater,
      landDensity: isWater ? 0 : 0.62,
      shorelineGrounding: isCoast ? 0.38 : 0,
      contactShadow: isCoast ? 0.26 : 0,
      underlandOcclusion: isWater ? 0.16 : 0.22,
      shelfTransition: isCoast ? 0.32 : 0,
      terrainRelief: isWater ? 0.04 : 0.34,
      ridgeRelief: p.y > 0.45 ? 0.26 : 0.08,
      basinShade: isWater ? 0.34 : 0.10,
      rimDarkening: 0.18,
      atmosphereSeparation: isWater ? 0.18 : 0.36,
      surfaceAttachment: 0.68,
      curvatureLock: 0.72,
      waterDepthShade: isWater ? 0.40 : 0,
      submergedWorksFeed: 0,
      submergedShadowBand: isWater ? 0.20 : 0,
      greenGlowSuppression: 0,
      coastalScarContinuity: isCoast ? 0.20 : 0,
      harborScarBasin: 0,
      boundaryMorphologyFeed: isCoast ? 0.20 : 0
    };
  };

  const normalizeMaterial = (raw, p) => {
    const fallback = fallbackMaterial(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "baseColor", "finalColorHint"], fallback.rgb);

    return {
      ...fallback,
      ...source,
      rgb,
      color: rgb,
      alpha: clamp01(numberField(source, "alpha", fallback.alpha)),
      isLand: boolField(source, "isLand", fallback.isLand),
      isWater: boolField(source, "isWater", fallback.isWater),
      landDensity: clamp01(numberField(source, "landDensity", fallback.landDensity)),
      shorelineGrounding: clamp01(numberField(source, "shorelineGrounding", fallback.shorelineGrounding)),
      contactShadow: clamp01(numberField(source, "contactShadow", fallback.contactShadow)),
      underlandOcclusion: clamp01(numberField(source, "underlandOcclusion", fallback.underlandOcclusion)),
      shelfTransition: clamp01(numberField(source, "shelfTransition", fallback.shelfTransition)),
      terrainRelief: clamp01(numberField(source, "terrainRelief", fallback.terrainRelief)),
      ridgeRelief: clamp01(numberField(source, "ridgeRelief", fallback.ridgeRelief)),
      basinShade: clamp01(numberField(source, "basinShade", fallback.basinShade)),
      rimDarkening: clamp01(numberField(source, "rimDarkening", fallback.rimDarkening)),
      atmosphereSeparation: clamp01(numberField(source, "atmosphereSeparation", fallback.atmosphereSeparation)),
      surfaceAttachment: clamp01(numberField(source, "surfaceAttachment", fallback.surfaceAttachment)),
      curvatureLock: clamp01(numberField(source, "curvatureLock", fallback.curvatureLock)),
      waterDepthShade: clamp01(numberField(source, "waterDepthShade", fallback.waterDepthShade)),
      submergedWorksFeed: clamp01(numberField(source, "submergedWorksFeed", fallback.submergedWorksFeed)),
      submergedShadowBand: clamp01(numberField(source, "submergedShadowBand", fallback.submergedShadowBand)),
      greenGlowSuppression: clamp01(numberField(source, "greenGlowSuppression", fallback.greenGlowSuppression)),
      coastalScarContinuity: clamp01(numberField(source, "coastalScarContinuity", fallback.coastalScarContinuity)),
      harborScarBasin: clamp01(numberField(source, "harborScarBasin", fallback.harborScarBasin)),
      boundaryMorphologyFeed: clamp01(numberField(source, "boundaryMorphologyFeed", fallback.boundaryMorphologyFeed))
    };
  };

  const fallbackHydrology = (p, material) => {
    const waterFillStrength = material.isWater ? 0.54 : 0;
    const waterlineBoundaryStrength = material.shorelineGrounding || 0;
    const shallowShelfStrength = material.shelfTransition || 0;

    return {
      contract: "HEARTH_CANVAS_FALLBACK_HYDROLOGY",
      receipt: "FALLBACK_HYDROLOGY_USED",
      waterFill: waterFillStrength > 0.40,
      waterFillStrength,
      waterDepth: material.isWater ? clamp01(0.36 + material.waterDepthShade * 0.42) : 0,
      waterDepthClass: material.waterDepthShade > 0.54 ? "deep" : material.isWater ? "mid" : "dry",
      waterlineBoundary: waterlineBoundaryStrength > 0.28,
      waterlineBoundaryStrength,
      shallowShelf: shallowShelfStrength > 0.22,
      shallowShelfStrength,
      belowSeaLevel: material.isWater,
      belowSeaLevelStrength: material.isWater ? 0.50 : 0,
      nearSeaLevel: waterlineBoundaryStrength > 0.22,
      nearSeaLevelStrength: waterlineBoundaryStrength,
      oceanDepth: material.waterDepthShade,
      oceanContinuity: material.isWater ? 0.48 : 0,
      shelfGradient: shallowShelfStrength,
      submergedBlock: false,
      submergedBlockStrength: 0,
      submergedScar: false,
      submergedScarStrength: 0,
      oldCoastalTechSubmerged: false,
      oldCoastalTechSubmergedStrength: 0,
      bayPotential: 0,
      inletPotential: 0,
      straitPotential: 0,
      archipelagoChannelPotential: 0
    };
  };

  const normalizeHydrology = (raw, p, material) => {
    const fallback = fallbackHydrology(p, material);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const merged = { ...fallback, ...source };

    [
      "waterFillStrength",
      "waterDepth",
      "waterlineBoundaryStrength",
      "shallowShelfStrength",
      "belowSeaLevelStrength",
      "nearSeaLevelStrength",
      "oceanDepth",
      "oceanContinuity",
      "shelfGradient",
      "submergedBlockStrength",
      "submergedScarStrength",
      "oldCoastalTechSubmergedStrength",
      "bayPotential",
      "inletPotential",
      "straitPotential",
      "archipelagoChannelPotential"
    ].forEach((key) => {
      merged[key] = clamp01(numberField(merged, key, fallback[key] || 0));
    });

    merged.waterDepthClass = stringField(merged, "waterDepthClass", fallback.waterDepthClass);
    merged.waterFill = boolField(merged, "waterFill", merged.waterFillStrength > 0.40);
    merged.waterlineBoundary = boolField(merged, "waterlineBoundary", merged.waterlineBoundaryStrength > 0.34);
    merged.shallowShelf = boolField(merged, "shallowShelf", merged.shallowShelfStrength > 0.34);
    merged.belowSeaLevel = boolField(merged, "belowSeaLevel", merged.belowSeaLevelStrength > 0.38);
    merged.nearSeaLevel = boolField(merged, "nearSeaLevel", merged.nearSeaLevelStrength > 0.34);
    merged.submergedBlock = boolField(merged, "submergedBlock", merged.submergedBlockStrength > 0.36);
    merged.submergedScar = boolField(merged, "submergedScar", merged.submergedScarStrength > 0.34);
    merged.oldCoastalTechSubmerged = boolField(
      merged,
      "oldCoastalTechSubmerged",
      merged.oldCoastalTechSubmergedStrength > 0.36
    );

    return merged;
  };

  const normalizeOcean = (raw) => {
    if (!raw || typeof raw !== "object") {
      return {
        available: false,
        oceanRgb: FALLBACK.water.slice(),
        oceanAlpha: 0,
        oceanPresence: 0,
        oceanConsumerReady: false
      };
    }

    const oceanRgb = colorField(raw, ["oceanRgb", "oceanColor", "color"], FALLBACK.water);

    const ocean = {
      ...raw,
      available: true,
      oceanRgb,
      oceanAlpha: clamp01(numberField(raw, "oceanAlpha", numberField(raw, "oceanPresence", 0))),
      oceanPresence: clamp01(numberField(raw, "oceanPresence", numberField(raw, "oceanAlpha", 0))),
      deepOceanBlueFeed: clamp01(numberField(raw, "deepOceanBlueFeed", 0)),
      openOceanBlueFeed: clamp01(numberField(raw, "openOceanBlueFeed", 0)),
      richBlueOceanFeed: clamp01(numberField(raw, "richBlueOceanFeed", 0)),
      shallowShelfBlueFeed: clamp01(numberField(raw, "shallowShelfBlueFeed", 0)),
      waterFillBlueFeed: clamp01(numberField(raw, "waterFillBlueFeed", 0)),
      waterlineBlueContrastFeed: clamp01(numberField(raw, "waterlineBlueContrastFeed", 0)),
      submergedBasinBlueFeed: clamp01(numberField(raw, "submergedBasinBlueFeed", 0)),
      submergedPortBasinBlueFeed: clamp01(numberField(raw, "submergedPortBasinBlueFeed", 0)),
      submergedScarWaterMuteFeed: clamp01(numberField(raw, "submergedScarWaterMuteFeed", 0)),
      submergedBlockWaterDepthFeed: clamp01(numberField(raw, "submergedBlockWaterDepthFeed", 0)),
      oceanTerrainSeparationFeed: clamp01(numberField(raw, "oceanTerrainSeparationFeed", 0)),
      oceanDepthShade: clamp01(numberField(raw, "oceanDepthShade", 0)),
      oceanBoundarySoftness: clamp01(numberField(raw, "oceanBoundarySoftness", 0)),
      oceanBoundaryHardness: clamp01(numberField(raw, "oceanBoundaryHardness", 0)),
      isOcean: boolField(raw, "isOcean", numberField(raw, "oceanPresence", 0) > 0.18),
      isDeepOcean: boolField(raw, "isDeepOcean", numberField(raw, "deepOceanBlueFeed", 0) > 0.46),
      isOpenOcean: boolField(raw, "isOpenOcean", numberField(raw, "openOceanBlueFeed", 0) > 0.38),
      isShallowShelf: boolField(raw, "isShallowShelf", numberField(raw, "shallowShelfBlueFeed", 0) > 0.30),
      isWaterline: boolField(raw, "isWaterline", numberField(raw, "waterlineBlueContrastFeed", 0) > 0.28),
      isSubmergedBasin: boolField(raw, "isSubmergedBasin", numberField(raw, "submergedBasinBlueFeed", 0) > 0.32),
      isSubmergedPortBasinCandidate: boolField(
        raw,
        "isSubmergedPortBasinCandidate",
        numberField(raw, "submergedPortBasinBlueFeed", 0) > 0.34
      ),
      isSubmergedScarWater: boolField(
        raw,
        "isSubmergedScarWater",
        numberField(raw, "submergedScarWaterMuteFeed", 0) > 0.30
      ),
      isSubmergedBlockWater: boolField(
        raw,
        "isSubmergedBlockWater",
        numberField(raw, "submergedBlockWaterDepthFeed", 0) > 0.30
      ),
      oceanConsumerReady: boolField(raw, "oceanConsumerReady", true)
    };

    return ocean;
  };

  const readMaterials = (...args) => {
    const p = parseInput(...args);
    const raw = callAuthority(
      getMaterialsAuthority(),
      ["sample", "read", "getMaterial", "materialAt", "getMaterialAt", "getSurfaceMaterial", "resolve", "resolveMaterial"],
      args
    );

    return normalizeMaterial(raw, p);
  };

  const readHydrology = (material, ...args) => {
    const p = parseInput(...args);
    const raw = callAuthority(
      getHydrologyAuthority(),
      ["sample", "read", "sampleHydrology", "readHydrology", "getHydrology"],
      args
    );

    return normalizeHydrology(raw, p, material);
  };

  const readOcean = (...args) => {
    const raw = callAuthority(
      getOceanAuthority(),
      ["sample", "read", "sampleOcean", "readOcean", "getOcean", "oceanAt", "getOceanAt", "resolveOcean"],
      args
    );

    return normalizeOcean(raw);
  };

  const computeOceanWeight = (material, hydrology, ocean) => {
    if (!ocean.available || !ocean.oceanConsumerReady) return 0;

    const openOceanWeight = clamp01(
      ocean.oceanPresence * 0.22 +
      ocean.richBlueOceanFeed * 0.22 +
      ocean.openOceanBlueFeed * 0.24 +
      hydrology.oceanContinuity * 0.14 +
      hydrology.waterFillStrength * 0.10
    );

    const deepOceanWeight = clamp01(
      ocean.deepOceanBlueFeed * 0.28 +
      ocean.oceanDepthShade * 0.22 +
      hydrology.waterDepth * 0.18 +
      hydrology.oceanDepth * 0.14 +
      (hydrology.waterDepthClass === "deep" ? 0.12 : 0)
    );

    const shallowShelfWeight = clamp01(
      ocean.shallowShelfBlueFeed * 0.26 +
      hydrology.shallowShelfStrength * 0.22 +
      hydrology.shelfGradient * 0.14 +
      ocean.oceanBoundarySoftness * 0.10
    );

    const waterlineWeight = clamp01(
      ocean.waterlineBlueContrastFeed * 0.20 +
      ocean.oceanTerrainSeparationFeed * 0.16 +
      hydrology.waterlineBoundaryStrength * 0.18 +
      hydrology.nearSeaLevelStrength * 0.10
    );

    const submergedWeight = clamp01(
      ocean.submergedBasinBlueFeed * 0.20 +
      ocean.submergedPortBasinBlueFeed * 0.22 +
      ocean.submergedBlockWaterDepthFeed * 0.14 +
      ocean.submergedScarWaterMuteFeed * 0.12 +
      material.submergedShadowBand * 0.08 +
      material.harborScarBasin * 0.08
    );

    let weight = clamp01(
      openOceanWeight +
      deepOceanWeight +
      shallowShelfWeight +
      waterlineWeight +
      submergedWeight
    );

    if (ocean.isDeepOcean || hydrology.waterDepthClass === "deep") {
      weight = Math.max(weight, 0.68);
    } else if (ocean.isOpenOcean || hydrology.oceanContinuity > 0.46) {
      weight = Math.max(weight, 0.58);
    } else if (ocean.isShallowShelf || hydrology.shallowShelf) {
      weight = Math.max(weight, 0.34);
    } else if (ocean.isWaterline || hydrology.waterlineBoundary) {
      weight = Math.max(weight, 0.24);
    }

    if (ocean.isSubmergedPortBasinCandidate) {
      weight = Math.max(weight, 0.48);
    }

    if (material.isLand && !hydrology.waterFill && hydrology.belowSeaLevelStrength < 0.24) {
      weight *= 0.18;
    }

    if (material.isLand && hydrology.waterlineBoundary) {
      weight = Math.max(weight, clamp01(hydrology.waterlineBoundaryStrength * 0.30));
      weight = Math.min(weight, 0.46);
    }

    if (material.isLand && hydrology.shallowShelfStrength > 0.32) {
      weight = Math.max(weight, clamp01(hydrology.shallowShelfStrength * 0.34));
      weight = Math.min(weight, 0.52);
    }

    return clamp01(weight);
  };

  const preserveSubmergedStructure = (rgb, material, hydrology, ocean, weight) => {
    let color = rgb.slice();

    const scar = clamp01(
      hydrology.submergedScarStrength * 0.22 +
      ocean.submergedScarWaterMuteFeed * 0.28 +
      material.coastalScarContinuity * 0.10 +
      material.boundaryMorphologyFeed * 0.08
    );

    const block = clamp01(
      hydrology.submergedBlockStrength * 0.22 +
      ocean.submergedBlockWaterDepthFeed * 0.26 +
      material.submergedWorksFeed * 0.10 +
      material.submergedShadowBand * 0.10
    );

    const port = clamp01(
      ocean.submergedPortBasinBlueFeed * 0.34 +
      material.harborScarBasin * 0.16 +
      hydrology.bayPotential * 0.08 +
      hydrology.inletPotential * 0.08
    );

    if (scar > 0.10) {
      color = mixColor(color, FALLBACK.scar, scar * 0.18);
      color[1] = clamp(Math.round(color[1] * (1 - scar * 0.10)), 0, 255);
    }

    if (block > 0.10) {
      color = mixColor(color, FALLBACK.shadow, block * 0.14);
    }

    if (port > 0.16) {
      color = mixColor(color, FALLBACK.basin, port * 0.28);
      color = liftOceanBlue(color, port * 0.10);
    }

    if (weight > 0.36 && material.greenGlowSuppression > 0.12) {
      color[1] = clamp(Math.round(color[1] * (1 - material.greenGlowSuppression * 0.06)), 0, 255);
    }

    return color;
  };

  const applyFinalLighting = (rgb, p, material, hydrology, ocean, oceanWeight) => {
    const light = normalize3({ x: -0.36, y: 0.42, z: 0.82 });
    const illumination = clamp01(0.55 + dot3(p, light) * 0.45);
    const limb = clamp01(1 - Math.abs(p.z) * 0.55);

    const terrainShade = clamp01(
      0.74 +
      illumination * 0.24 -
      material.rimDarkening * 0.10 -
      material.underlandOcclusion * 0.06
    );

    const oceanShade = clamp01(
      0.82 +
      illumination * 0.18 -
      ocean.oceanDepthShade * 0.05 -
      ocean.submergedPortBasinBlueFeed * 0.06
    );

    const shade = mixNumber(terrainShade, oceanShade, oceanWeight);
    let color = scaleColor(rgb, shade);

    if (oceanWeight > 0.16) {
      color = liftOceanBlue(color, clamp01(oceanWeight * 0.22 + ocean.richBlueOceanFeed * 0.12));
    }

    const atmosphere = clamp01(material.atmosphereSeparation * 0.05 + oceanWeight * 0.03);
    color = mixColor(color, [20, 32, 48], limb * atmosphere);

    return color;
  };

  const composeSample = (...args) => {
    const p = parseInput(...args);
    const material = readMaterials(...args);
    const hydrology = readHydrology(material, ...args);
    const ocean = readOcean(...args);

    const oceanWeight = computeOceanWeight(material, hydrology, ocean);

    let rgb = material.rgb.slice();

    if (oceanWeight > 0) {
      const oceanRgb = ocean.oceanRgb || FALLBACK.water;
      rgb = mixColor(rgb, oceanRgb, oceanWeight);

      if (ocean.isShallowShelf || hydrology.shallowShelf) {
        rgb = mixColor(rgb, FALLBACK.shelf, clamp01(ocean.shallowShelfBlueFeed * 0.12 + hydrology.shallowShelfStrength * 0.08));
      }

      if (ocean.isSubmergedBasin || ocean.isSubmergedPortBasinCandidate) {
        rgb = mixColor(rgb, FALLBACK.basin, clamp01(ocean.submergedBasinBlueFeed * 0.16 + ocean.submergedPortBasinBlueFeed * 0.24));
      }

      rgb = preserveSubmergedStructure(rgb, material, hydrology, ocean, oceanWeight);
    }

    rgb = applyFinalLighting(rgb, p, material, hydrology, ocean, oceanWeight);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "canvas-composer",

      x: p.x,
      y: p.y,
      z: p.z,

      rgb,
      color: rgb,
      alpha: material.alpha,
      oceanWeight,
      oceanComposed: ocean.available && oceanWeight > 0,
      oceanAvailable: ocean.available,

      materialRgb: material.rgb,
      oceanRgb: ocean.oceanRgb || null,

      isLand: material.isLand && oceanWeight < 0.52,
      isWater: material.isWater || hydrology.waterFill || oceanWeight > 0.46,

      waterFill: hydrology.waterFill,
      waterFillStrength: hydrology.waterFillStrength,
      waterDepth: hydrology.waterDepth,
      waterDepthClass: hydrology.waterDepthClass,
      waterlineBoundary: hydrology.waterlineBoundary,
      waterlineBoundaryStrength: hydrology.waterlineBoundaryStrength,
      shallowShelf: hydrology.shallowShelf,
      shallowShelfStrength: hydrology.shallowShelfStrength,
      belowSeaLevel: hydrology.belowSeaLevel,
      belowSeaLevelStrength: hydrology.belowSeaLevelStrength,
      submergedBlock: hydrology.submergedBlock,
      submergedBlockStrength: hydrology.submergedBlockStrength,
      submergedScar: hydrology.submergedScar,
      submergedScarStrength: hydrology.submergedScarStrength,

      oceanPresence: ocean.oceanPresence || 0,
      richBlueOceanFeed: ocean.richBlueOceanFeed || 0,
      deepOceanBlueFeed: ocean.deepOceanBlueFeed || 0,
      openOceanBlueFeed: ocean.openOceanBlueFeed || 0,
      shallowShelfBlueFeed: ocean.shallowShelfBlueFeed || 0,
      waterlineBlueContrastFeed: ocean.waterlineBlueContrastFeed || 0,
      submergedBasinBlueFeed: ocean.submergedBasinBlueFeed || 0,
      submergedPortBasinBlueFeed: ocean.submergedPortBasinBlueFeed || 0,
      oceanTerrainSeparationFeed: ocean.oceanTerrainSeparationFeed || 0,

      materialContract: material.contract || "UNKNOWN_MATERIAL_CONTRACT",
      hydrologyContract: hydrology.contract || "UNKNOWN_HYDROLOGY_CONTRACT",
      oceanContract: ocean.contract || "OCEAN_UNAVAILABLE",

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  };

  const sample = (...args) => composeSample(...args);
  const read = (...args) => composeSample(...args);
  const compose = (...args) => composeSample(...args);
  const composePixel = (...args) => composeSample(...args);
  const getPixel = (...args) => composeSample(...args);
  const getColor = (...args) => composeSample(...args).rgb;

  const createTextureCanvas = (options = {}) => {
    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth canvas texture creation requires document.createElement.");
    }

    const requestedWidth = Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 768;
    const requestedHeight = Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : 384;

    const width = clamp(requestedWidth, 32, options.allowLargeTexture === true ? 1536 : 1024);
    const height = clamp(requestedHeight, 16, options.allowLargeTexture === true ? 768 : 512);

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasConsumesOcean = "true";
    canvas.dataset.hearthCanvasOceanContract = OCEAN_CONTRACT;
    canvas.dataset.hearthCanvasOceanConsumerContract = CONTRACT;
    canvas.dataset.hearthCanvasOceanFailSoft = "true";
    canvas.dataset.hearthCanvasOceanComposedWithMaterials = "true";
    canvas.dataset.hearthCanvasOceanComposedWithHydrology = "true";
    canvas.dataset.visualPassClaimed = "false";

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let y = 0; y < height; y += 1) {
      const v = height <= 1 ? 0 : y / (height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = width <= 1 ? 0 : x / (width - 1);
        const px = composeSample({ u, v });
        const i = (y * width + x) * 4;

        data[i] = px.rgb[0];
        data[i + 1] = px.rgb[1];
        data[i + 2] = px.rgb[2];
        data[i + 3] = Math.round(clamp01(px.alpha) * 255);
      }
    }

    ctx.putImageData(image, 0, 0);
    return canvas;
  };

  const createCanvas = (options = {}) => createTextureCanvas(options);
  const createPlanetTexture = (options = {}) => createTextureCanvas(options);
  const createTexture = (options = {}) => createTextureCanvas(options);
  const buildTexture = (options = {}) => createTextureCanvas(options);
  const getTextureCanvas = (options = {}) => createTextureCanvas(options);

  const paintToCanvas = (targetCanvas, options = {}) => {
    if (!targetCanvas || typeof targetCanvas.getContext !== "function") {
      return null;
    }

    const texture = createTextureCanvas({
      width: options.width || targetCanvas.width || 768,
      height: options.height || targetCanvas.height || 384,
      allowLargeTexture: options.allowLargeTexture === true
    });

    const ctx = targetCanvas.getContext("2d");
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    ctx.drawImage(texture, 0, 0, targetCanvas.width, targetCanvas.height);

    targetCanvas.dataset.hearthCanvasPainted = "true";
    targetCanvas.dataset.hearthCanvasContract = CONTRACT;
    targetCanvas.dataset.hearthCanvasConsumesOcean = "true";
    targetCanvas.dataset.visualPassClaimed = "false";

    return targetCanvas;
  };

  const renderToCanvas = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const drawToCanvas = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const render = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const paint = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);

  const mount = (target, options = {}) => {
    if (!root.document) return null;

    const element =
      typeof target === "string"
        ? root.document.querySelector(target)
        : target && target.nodeType === 1
          ? target
          : null;

    if (!element) return null;

    const canvas = createTextureCanvas(options);
    canvas.className = options.className || "hearth-canvas-texture";
    element.appendChild(canvas);

    return canvas;
  };

  const getReceipt = () => ({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    authority: "canvas-composer",
    status: "active",
    primaryTarget: "/assets/hearth/hearth.canvas.js",
    consumesOcean: true,
    oceanContract: OCEAN_CONTRACT,
    oceanConsumerContract: CONTRACT,
    oceanFailSoft: true,
    oceanComposedWithMaterials: true,
    oceanComposedWithHydrology: true,
    owns: [
      "final-pixel-composition",
      "ocean-weighting",
      "terrain-ocean-blend",
      "waterline-layering",
      "submerged-basin-layering",
      "final-light-shadow-application"
    ],
    doesNotOwn: [
      "hydrology-classification",
      "ocean-authority-generation",
      "terrain-material-generation",
      "elevation-generation",
      "route-orchestration",
      "runtime-motion",
      "controls",
      "beach-generation",
      "cliff-generation",
      "island-generation",
      "clickable-port",
      "final-visual-pass-claim"
    ],
    failSoftRules: [
      "if-ocean-missing-use-material-render",
      "if-ocean-sample-throws-ignore-ocean-for-sample",
      "if-ocean-output-malformed-ignore-ocean-for-sample",
      "no-blank-planet",
      "no-route-failure",
      "no-broken-drag"
    ],
    supportsRichBlueOceanCanvasConsumer: true,
    supportsOceanTerrainComposition: true,
    supportsOceanFailSoft: true,
    supportsSubmergedBasinComposition: true,
    supportsPortBasinImpliedComposition: true,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    routeMutation: false,
    runtimeMutation: false,
    controlsMutation: false,
    visualPassClaimed: false
  });

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,

    sample,
    read,
    compose,
    composeSample,
    composePixel,
    getPixel,
    getColor,

    createTextureCanvas,
    createCanvas,
    createPlanetTexture,
    createTexture,
    buildTexture,
    getTextureCanvas,

    paintToCanvas,
    renderToCanvas,
    drawToCanvas,
    render,
    paint,
    mount,

    getReceipt,

    supportsRichBlueOceanCanvasConsumer: true,
    supportsOceanTerrainComposition: true,
    supportsOceanFailSoft: true,
    supportsSubmergedBasinComposition: true,
    supportsPortBasinImpliedComposition: true,

    consumesOcean: true,
    oceanContract: OCEAN_CONTRACT,
    oceanConsumerContract: CONTRACT,
    oceanFailSoft: true,
    oceanComposedWithMaterials: true,
    oceanComposedWithHydrology: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    routeMutation: false,
    runtimeMutation: false,
    controlsMutation: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;

  root.HEARTH_CANVAS = api;
  root.HearthCanvas = api;
  root.HEARTH_CANVAS_RECEIPT = getReceipt();
  root.HEARTH_CANVAS_CONTRACT = CONTRACT;

  root.HEARTH_CANVAS_CONSUMES_OCEAN = true;
  root.HEARTH_CANVAS_OCEAN_CONTRACT = OCEAN_CONTRACT;
  root.HEARTH_CANVAS_OCEAN_CONSUMER_CONTRACT = CONTRACT;
  root.HEARTH_CANVAS_OCEAN_FAIL_SOFT = true;
  root.HEARTH_CANVAS_OCEAN_COMPOSED_WITH_MATERIALS = true;
  root.HEARTH_CANVAS_OCEAN_COMPOSED_WITH_HYDROLOGY = true;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthCanvasAuthorityLoaded = "true";
    root.document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    root.document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthCanvasConsumesOcean = "true";
    root.document.documentElement.dataset.hearthCanvasOceanContract = OCEAN_CONTRACT;
    root.document.documentElement.dataset.hearthCanvasOceanConsumerContract = CONTRACT;
    root.document.documentElement.dataset.hearthCanvasOceanFailSoft = "true";
    root.document.documentElement.dataset.hearthCanvasOceanComposedWithMaterials = "true";
    root.document.documentElement.dataset.hearthCanvasOceanComposedWithHydrology = "true";
    root.document.documentElement.dataset.generatedImage = "false";
    root.document.documentElement.dataset.graphicBox = "false";
    root.document.documentElement.dataset.webgl = "false";
    root.document.documentElement.dataset.routeMutation = "false";
    root.document.documentElement.dataset.runtimeMutation = "false";
    root.document.documentElement.dataset.controlsMutation = "false";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
