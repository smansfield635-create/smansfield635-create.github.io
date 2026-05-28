// /assets/hearth/hearth.canvas.js
// HEARTH_TRUE_SHELL_FIRST_NONBLOCKING_CANVAS_TNT_v3
// Full-file replacement.
// Canvas / projection / interaction authority only.
// Purpose:
// - Mount visible Hearth shell immediately.
// - Bind thumb / pointer drag immediately.
// - Return route-compatible mount API immediately.
// - Build refined atlas asynchronously after mount.
// - Prevent Map Portal / page freeze during Hearth load.
// - Preserve public canvas API and sphere containment.
// Does not own:
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology classification
// - ocean authority generation
// - terrain material generation
// - route orchestration
// - runtime motion
// - external controls authority
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_TRUE_SHELL_FIRST_NONBLOCKING_CANVAS_TNT_v3";
  const RECEIPT = "HEARTH_TRUE_SHELL_FIRST_NONBLOCKING_CANVAS_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "HEARTH_INTERACTIVE_ATLAS_PROJECTION_CANVAS_TNT_v2";
  const OCEAN_CONTRACT = "HEARTH_RICH_BLUE_OCEAN_BODY_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-28.hearth-true-shell-first-nonblocking-canvas-v3";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;
  const TWO_PI = Math.PI * 2;

  const FALLBACK = Object.freeze({
    land: [82, 84, 58],
    raised: [100, 96, 67],
    stone: [58, 62, 55],
    water: [8, 31, 76],
    deepWater: [3, 12, 34],
    shelf: [22, 69, 91],
    basin: [4, 15, 28],
    scar: [30, 39, 36],
    shadow: [2, 7, 15],
    shellDark: [6, 11, 22],
    shellMid: [18, 35, 54],
    shellLight: [64, 88, 96],
    atmosphere: [20, 32, 48],
    transparent: [0, 0, 0]
  });

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrap01(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
  }

  function mixNumber(a, b, t) {
    const k = clamp01(t);
    return a + (b - a) * k;
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      clamp(Math.round(mixNumber(a[0], b[0], k)), 0, 255),
      clamp(Math.round(mixNumber(a[1], b[1], k)), 0, 255),
      clamp(Math.round(mixNumber(a[2], b[2], k)), 0, 255)
    ];
  }

  function scaleColor(rgb, scalar) {
    const s = Number.isFinite(Number(scalar)) ? Number(scalar) : 1;
    return [
      clamp(Math.round(rgb[0] * s), 0, 255),
      clamp(Math.round(rgb[1] * s), 0, 255),
      clamp(Math.round(rgb[2] * s), 0, 255)
    ];
  }

  function liftOceanBlue(rgb, strength) {
    const k = clamp01(strength);
    return [
      clamp(Math.round(rgb[0] * (1 - k * 0.10)), 0, 255),
      clamp(Math.round(rgb[1] * (1 + k * 0.10)), 0, 255),
      clamp(Math.round(rgb[2] * (1 + k * 0.24)), 0, 255)
    ];
  }

  function normalize3(p) {
    const x = Number.isFinite(Number(p && p.x)) ? Number(p.x) : 0;
    const y = Number.isFinite(Number(p && p.y)) ? Number(p.y) : 0;
    const z = Number.isFinite(Number(p && p.z)) ? Number(p.z) : 1;
    const m = Math.hypot(x, y, z) || 1;
    return { x: x / m, y: y / m, z: z / m };
  }

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = Number(lonDeg || 0) * DEG;
    const lat = Number(latDeg || 0) * DEG;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  }

  function vectorToLonLat(p) {
    const n = normalize3(p);
    return {
      lon: Math.atan2(n.x, n.z) / DEG,
      lat: Math.asin(clamp(n.y, -1, 1)) / DEG
    };
  }

  function lonToU(lon) {
    return wrap01((Number(lon) + 180) / 360);
  }

  function latToV(lat) {
    return clamp((90 - Number(lat)) / 180, 0, 1);
  }

  function uToLon(u) {
    return wrap01(u) * 360 - 180;
  }

  function vToLat(v) {
    return 90 - clamp(Number(v), 0, 1) * 180;
  }

  function rotateY(p, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
      x: p.x * c + p.z * s,
      y: p.y,
      z: -p.x * s + p.z * c
    };
  }

  function rotateX(p, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
      x: p.x,
      y: p.y * c - p.z * s,
      z: p.y * s + p.z * c
    };
  }

  function rotateForView(p, rotationLon, rotationLat) {
    return normalize3(rotateY(rotateX(p, rotationLat), rotationLon));
  }

  function spherePixelToVector(x, y, width, height) {
    const size = Math.min(width, height);
    const cx = (width - 1) / 2;
    const cy = (height - 1) / 2;
    const radius = size * 0.5 * 0.985;

    const dx = (x - cx) / radius;
    const dy = (y - cy) / radius;
    const rr = dx * dx + dy * dy;

    if (rr > 1) {
      return {
        inside: false,
        edgeAlpha: 0,
        radial: Math.sqrt(rr),
        vector: { x: 0, y: 0, z: 1 }
      };
    }

    const radial = Math.sqrt(rr);
    const z = Math.sqrt(Math.max(0, 1 - rr));
    const edgeAlpha = clamp01((1 - radial) / 0.025);

    return {
      inside: true,
      edgeAlpha,
      radial,
      vector: normalize3({
        x: dx,
        y: -dy,
        z
      })
    };
  }

  function parseInput(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        return lonLatToVector(uToLon(p.u), vToLat(p.v));
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        return lonLatToVector(Number(p.lon), Number(p.lat));
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        return lonLatToVector(Number(p.longitude), Number(p.latitude));
      }

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        return normalize3(p);
      }
    }

    if (args.length >= 3) return normalize3({ x: args[0], y: args[1], z: args[2] });
    if (args.length >= 2) return lonLatToVector(Number(args[0]), Number(args[1]));
    return lonLatToVector(0, 0);
  }

  function numberField(source, key, fallback = 0) {
    const n = Number(source && source[key]);
    return Number.isFinite(n) ? n : fallback;
  }

  function boolField(source, key, fallback = false) {
    return typeof (source && source[key]) === "boolean" ? source[key] : fallback;
  }

  function stringField(source, key, fallback = "") {
    return typeof (source && source[key]) === "string" && source[key] ? source[key] : fallback;
  }

  function colorField(source, keys, fallback) {
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
  }

  function getHydrologyAuthority() {
    if (root.HEARTH && root.HEARTH.hydrology) return root.HEARTH.hydrology;
    if (root.HEARTH_HYDROLOGY) return root.HEARTH_HYDROLOGY;
    if (root.HearthHydrology) return root.HearthHydrology;
    return null;
  }

  function getMaterialsAuthority() {
    if (root.HEARTH && root.HEARTH.materials) return root.HEARTH.materials;
    if (root.HEARTH_MATERIALS) return root.HEARTH_MATERIALS;
    if (root.HearthMaterials) return root.HearthMaterials;
    return null;
  }

  function getOceanAuthority() {
    if (root.HEARTH && root.HEARTH.ocean) return root.HEARTH.ocean;
    if (root.HEARTH_OCEAN) return root.HEARTH_OCEAN;
    if (root.HearthOcean) return root.HearthOcean;
    return null;
  }

  function callAuthority(authority, methods, args) {
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
  }

  function fallbackMaterial(p) {
    const ll = vectorToLonLat(p);
    const equator = 1 - Math.abs(latToV(ll.lat) - 0.5) * 2;
    const isWater = p.z < 0.20;
    const isCoast = Math.abs(p.z - 0.20) < 0.16;

    let rgb = isWater ? FALLBACK.water : mixColor(FALLBACK.land, FALLBACK.raised, equator * 0.16);
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
  }

  function normalizeMaterial(raw, p) {
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
  }

  function fallbackHydrology(_p, material) {
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
  }

  function normalizeHydrology(raw, p, material) {
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
  }

  function normalizeOcean(raw) {
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

    return {
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
  }

  function readMaterials(...args) {
    const p = parseInput(...args);
    const raw = callAuthority(
      getMaterialsAuthority(),
      ["sample", "read", "getMaterial", "materialAt", "getMaterialAt", "getSurfaceMaterial", "resolve", "resolveMaterial"],
      args
    );

    return normalizeMaterial(raw, p);
  }

  function readHydrology(material, ...args) {
    const p = parseInput(...args);
    const raw = callAuthority(
      getHydrologyAuthority(),
      ["sample", "read", "sampleHydrology", "readHydrology", "getHydrology"],
      args
    );

    return normalizeHydrology(raw, p, material);
  }

  function readOcean(...args) {
    const raw = callAuthority(
      getOceanAuthority(),
      ["sample", "read", "sampleOcean", "readOcean", "getOcean", "oceanAt", "getOceanAt", "resolveOcean"],
      args
    );

    return normalizeOcean(raw);
  }

  function computeOceanWeight(material, hydrology, ocean) {
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
  }

  function preserveSubmergedStructure(rgb, material, hydrology, ocean, weight) {
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
  }

  function applyFinalLighting(rgb, p, material, ocean, oceanWeight) {
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
    color = mixColor(color, FALLBACK.atmosphere, limb * atmosphere);

    return color;
  }

  function composeSample(...args) {
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
        rgb = mixColor(
          rgb,
          FALLBACK.shelf,
          clamp01(ocean.shallowShelfBlueFeed * 0.12 + hydrology.shallowShelfStrength * 0.08)
        );
      }

      if (ocean.isSubmergedBasin || ocean.isSubmergedPortBasinCandidate) {
        rgb = mixColor(
          rgb,
          FALLBACK.basin,
          clamp01(ocean.submergedBasinBlueFeed * 0.16 + ocean.submergedPortBasinBlueFeed * 0.24)
        );
      }

      rgb = preserveSubmergedStructure(rgb, material, hydrology, ocean, oceanWeight);
    }

    rgb = applyFinalLighting(rgb, p, material, ocean, oceanWeight);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
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

      sphereContained: true,
      outsideSphereTransparent: true,
      noRectangularTextureSpill: true,
      projectionCompatible: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  const sample = (...args) => composeSample(...args);
  const read = (...args) => composeSample(...args);
  const compose = (...args) => composeSample(...args);
  const composeSampleAlias = (...args) => composeSample(...args);
  const composePixel = (...args) => composeSample(...args);
  const getPixel = (...args) => composeSample(...args);
  const getColor = (...args) => composeSample(...args).rgb;

  function createShellCanvas(options = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth shell canvas requires document.createElement.");
    }

    const requestedSize = Number.isFinite(Number(options.size))
      ? Math.round(Number(options.size))
      : Number.isFinite(Number(options.width))
        ? Math.round(Number(options.width))
        : 420;

    const size = clamp(requestedSize, 240, options.allowLargeTexture === true ? 720 : 520);
    const canvas = root.document.createElement("canvas");

    canvas.width = size;
    canvas.height = size;
    canvas.className = options.className || "hearth-canvas-texture hearth-canvas-contained-sphere hearth-canvas-shell-first";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.background = "transparent";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.cursor = "grab";

    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasShellFirst = "true";
    canvas.dataset.hearthCanvasInteractiveShellMounted = "true";
    canvas.dataset.hearthCanvasCachedAtlasProjection = "pending";
    canvas.dataset.hearthCanvasInteractiveProjection = "true";
    canvas.dataset.hearthCanvasControlsBound = "false";
    canvas.dataset.hearthCanvasAtlasReady = "false";
    canvas.dataset.hearthCanvasAtlasBuilding = "false";
    canvas.dataset.hearthCanvasAtlasProgress = "0";
    canvas.dataset.hearthCanvasSphereContainment = "true";
    canvas.dataset.hearthCanvasNoRectangularTextureSpill = "true";
    canvas.dataset.hearthCanvasOutsideSphereTransparent = "true";
    canvas.dataset.visualPassClaimed = "false";

    return canvas;
  }

  function drawFallbackShell(canvas, state = {}) {
    if (!canvas || typeof canvas.getContext !== "function") return null;

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const width = canvas.width;
    const height = canvas.height;
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const r = size * 0.47;
    const rotationLon = Number.isFinite(Number(state.rotationLon)) ? Number(state.rotationLon) : 0;
    const rotationLat = Number.isFinite(Number(state.rotationLat)) ? Number(state.rotationLat) : 0;

    ctx.clearRect(0, 0, width, height);

    const shell = ctx.createRadialGradient(
      cx - r * 0.28,
      cy - r * 0.34,
      r * 0.05,
      cx,
      cy,
      r
    );

    shell.addColorStop(0, "rgba(82, 112, 118, 0.98)");
    shell.addColorStop(0.34, "rgba(31, 57, 73, 0.98)");
    shell.addColorStop(0.72, "rgba(8, 18, 36, 0.99)");
    shell.addColorStop(1, "rgba(1, 4, 12, 1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.clip();

    ctx.fillStyle = shell;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.globalAlpha = 0.42;
    ctx.strokeStyle = "rgba(138, 130, 88, 0.62)";
    ctx.lineWidth = Math.max(1.2, size * 0.005);

    for (let i = 0; i < 7; i += 1) {
      const phase = rotationLon * 0.9 + i * 0.91;
      const y = cy + Math.sin(phase + rotationLat) * r * 0.42;
      const rx = r * (0.28 + (i % 3) * 0.10);
      const ry = r * (0.08 + (i % 2) * 0.04);
      const x = cx + Math.cos(phase * 0.7) * r * 0.22;

      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, phase * 0.22, 0.18 * Math.PI, 1.72 * Math.PI);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.24;
    ctx.strokeStyle = "rgba(19, 91, 132, 0.70)";
    ctx.lineWidth = Math.max(1, size * 0.0035);

    for (let i = 0; i < 6; i += 1) {
      const phase = rotationLon * 1.15 + i * 1.17;
      const y = cy + Math.sin(phase - rotationLat * 0.6) * r * 0.36;
      const rx = r * (0.34 + (i % 2) * 0.12);
      const ry = r * 0.07;
      const x = cx + Math.cos(phase * 0.5) * r * 0.18;

      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, phase * 0.18, 0, TWO_PI);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.20;
    ctx.strokeStyle = "rgba(190, 205, 194, 0.52)";
    ctx.lineWidth = Math.max(1, size * 0.0028);

    for (let i = 0; i < 5; i += 1) {
      const phase = rotationLon * 0.7 + i * 1.31;
      ctx.beginPath();
      ctx.arc(
        cx + Math.cos(phase) * r * 0.10,
        cy + Math.sin(phase + rotationLat) * r * 0.10,
        r * (0.52 + i * 0.018),
        0.15 * Math.PI + phase * 0.05,
        1.25 * Math.PI + phase * 0.05
      );
      ctx.stroke();
    }

    const shade = ctx.createRadialGradient(
      cx - r * 0.25,
      cy - r * 0.32,
      r * 0.10,
      cx + r * 0.18,
      cy + r * 0.14,
      r * 1.08
    );

    shade.addColorStop(0, "rgba(255,255,255,0.12)");
    shade.addColorStop(0.42, "rgba(255,255,255,0.00)");
    shade.addColorStop(0.75, "rgba(0,0,0,0.20)");
    shade.addColorStop(1, "rgba(0,0,0,0.48)");

    ctx.globalAlpha = 1;
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.strokeStyle = "rgba(172, 219, 240, 0.28)";
    ctx.lineWidth = Math.max(1, size * 0.005);
    ctx.stroke();

    canvas.dataset.hearthCanvasFallbackShellPainted = "true";
    canvas.dataset.hearthCanvasFrames = String(Number(canvas.dataset.hearthCanvasFrames || 0) + 1);
    return canvas;
  }

  function sampleAtlasNearest(atlas, u, v) {
    const x = clamp(Math.round(wrap01(u) * (atlas.width - 1)), 0, atlas.width - 1);
    const y = clamp(Math.round(clamp(v, 0, 1) * (atlas.height - 1)), 0, atlas.height - 1);
    const i = (y * atlas.width + x) * 4;

    return [
      atlas.data[i],
      atlas.data[i + 1],
      atlas.data[i + 2],
      atlas.data[i + 3]
    ];
  }

  function renderSphereFromAtlas(targetCanvas, atlas, state = {}, options = {}) {
    if (!targetCanvas || !atlas || !atlas.data) return targetCanvas;

    const ctx = targetCanvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const width = targetCanvas.width;
    const height = targetCanvas.height;
    const image = ctx.createImageData(width, height);
    const data = image.data;

    const rotationLon = Number.isFinite(Number(state.rotationLon)) ? Number(state.rotationLon) : 0;
    const rotationLat = Number.isFinite(Number(state.rotationLat)) ? Number(state.rotationLat) : 0;
    const light = normalize3({ x: -0.34, y: 0.42, z: 0.83 });
    const useSoftLighting = options.softProjectionLighting !== false;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const sphere = spherePixelToVector(x, y, width, height);
        const i = (y * width + x) * 4;

        if (!sphere.inside) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
          continue;
        }

        const world = rotateForView(sphere.vector, rotationLon, rotationLat);
        const ll = vectorToLonLat(world);
        const color = sampleAtlasNearest(atlas, lonToU(ll.lon), latToV(ll.lat));

        let r = color[0];
        let g = color[1];
        let b = color[2];

        if (useSoftLighting) {
          const illumination = clamp01(0.64 + dot3(sphere.vector, light) * 0.30);
          const edgeShade = clamp01(1 - sphere.radial * 0.13);
          const shade = clamp01(illumination * edgeShade);
          r = clamp(Math.round(r * shade), 0, 255);
          g = clamp(Math.round(g * shade), 0, 255);
          b = clamp(Math.round(b * shade), 0, 255);

          const limbAtmosphere = clamp01(sphere.radial * 0.05);
          const mixed = mixColor([r, g, b], FALLBACK.atmosphere, limbAtmosphere);
          r = mixed[0];
          g = mixed[1];
          b = mixed[2];
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = Math.round(clamp01(color[3] / 255) * 255 * sphere.edgeAlpha);
      }
    }

    ctx.putImageData(image, 0, 0);
    targetCanvas.dataset.hearthCanvasRenderedFromCachedAtlas = "true";
    targetCanvas.dataset.hearthCanvasInteractiveProjection = "true";
    targetCanvas.dataset.hearthCanvasAtlasReady = "true";
    targetCanvas.dataset.hearthCanvasFrames = String(Number(targetCanvas.dataset.hearthCanvasFrames || 0) + 1);
    return targetCanvas;
  }

  function scheduleWork(fn) {
    if (root.requestIdleCallback) {
      root.requestIdleCallback(fn, { timeout: 80 });
      return;
    }

    if (root.requestAnimationFrame) {
      root.requestAnimationFrame(fn);
      return;
    }

    setTimeout(fn, 0);
  }

  function createAtlasTextureCanvas(options = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth canvas atlas creation requires document.createElement.");
    }

    const requestedWidth = Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 384;
    const requestedHeight = Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : 192;

    const width = clamp(requestedWidth, 32, options.allowLargeTexture === true ? 1536 : 512);
    const height = clamp(requestedHeight, 16, options.allowLargeTexture === true ? 768 : 256);

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    canvas.dataset.hearthCanvasAtlasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasProjectionCompatible = "source-only";
    canvas.dataset.hearthCanvasRawAtlasDisplayForbidden = "true";
    canvas.dataset.hearthCanvasCachedAtlas = "true";
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
  }

  function buildAtlasAsync(options = {}, handlers = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      const error = new Error("Hearth async atlas creation requires document.createElement.");
      if (typeof handlers.onError === "function") handlers.onError(error);
      return { cancel() {} };
    }

    const width = clamp(
      Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 384,
      32,
      options.allowLargeTexture === true ? 1024 : 512
    );

    const height = clamp(
      Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : 192,
      16,
      options.allowLargeTexture === true ? 512 : 256
    );

    const rowsPerChunk = clamp(
      Number.isFinite(Number(options.rowsPerChunk)) ? Math.round(Number(options.rowsPerChunk)) : 2,
      1,
      8
    );

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.hearthCanvasAtlasTexture = "true";
    canvas.dataset.hearthCanvasAsyncAtlas = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.visualPassClaimed = "false";

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    let y = 0;
    let cancelled = false;

    const controller = {
      canvas,
      width,
      height,
      cancel() {
        cancelled = true;
      }
    };

    const processChunk = () => {
      if (cancelled) return;

      try {
        const endY = Math.min(height, y + rowsPerChunk);

        for (; y < endY; y += 1) {
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

        const progress = clamp01(y / height);
        if (typeof handlers.onProgress === "function") {
          handlers.onProgress(progress, { y, width, height, rowsPerChunk });
        }

        if (y >= height) {
          ctx.putImageData(image, 0, 0);

          const readCtx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
          const atlasImage = readCtx.getImageData(0, 0, width, height);

          const atlas = {
            canvas,
            width,
            height,
            data: atlasImage.data
          };

          if (typeof handlers.onComplete === "function") handlers.onComplete(atlas);
          return;
        }

        scheduleWork(processChunk);
      } catch (error) {
        if (typeof handlers.onError === "function") handlers.onError(error);
      }
    };

    scheduleWork(processChunk);
    return controller;
  }

  function getAtlasData(atlasCanvas) {
    const ctx = atlasCanvas.getContext("2d", { alpha: true, willReadFrequently: true });
    const image = ctx.getImageData(0, 0, atlasCanvas.width, atlasCanvas.height);

    return {
      canvas: atlasCanvas,
      width: atlasCanvas.width,
      height: atlasCanvas.height,
      data: image.data
    };
  }

  function createSphereTextureCanvas(options = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth canvas texture creation requires document.createElement.");
    }

    const atlasCanvas = createAtlasTextureCanvas({
      width: options.atlasWidth || 384,
      height: options.atlasHeight || 192,
      allowLargeTexture: options.allowLargeTexture === true
    });

    const atlas = getAtlasData(atlasCanvas);

    const requestedWidth = Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 420;
    const requestedHeight = Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : requestedWidth;

    const width = clamp(requestedWidth, 32, options.allowLargeTexture === true ? 1024 : 520);
    const height = clamp(requestedHeight, 32, options.allowLargeTexture === true ? 1024 : 520);

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSphereContainment = "true";
    canvas.dataset.hearthCanvasOutsideSphereTransparent = "true";
    canvas.dataset.hearthCanvasCachedAtlasProjection = "true";
    canvas.dataset.visualPassClaimed = "false";

    renderSphereFromAtlas(
      canvas,
      atlas,
      {
        rotationLon: Number.isFinite(Number(options.rotationLon)) ? Number(options.rotationLon) : 0,
        rotationLat: Number.isFinite(Number(options.rotationLat)) ? Number(options.rotationLat) : 0
      },
      options
    );

    return canvas;
  }

  function createTextureCanvas(options = {}) {
    if (options && options.atlas === true) return createAtlasTextureCanvas(options);
    return createSphereTextureCanvas(options);
  }

  const createCanvas = (options = {}) => createTextureCanvas(options);
  const createPlanetTexture = (options = {}) => createTextureCanvas(options);
  const createTexture = (options = {}) => createTextureCanvas(options);
  const buildTexture = (options = {}) => createTextureCanvas(options);
  const getTextureCanvas = (options = {}) => createTextureCanvas(options);

  function paintToCanvas(targetCanvas, options = {}) {
    if (!targetCanvas || typeof targetCanvas.getContext !== "function") return null;

    const texture = createSphereTextureCanvas({
      width: options.width || targetCanvas.width || 420,
      height: options.height || targetCanvas.height || targetCanvas.width || 420,
      atlasWidth: options.atlasWidth || 384,
      atlasHeight: options.atlasHeight || 192,
      allowLargeTexture: options.allowLargeTexture === true
    });

    const ctx = targetCanvas.getContext("2d");
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    ctx.drawImage(texture, 0, 0, targetCanvas.width, targetCanvas.height);

    targetCanvas.dataset.hearthCanvasPainted = "true";
    targetCanvas.dataset.hearthCanvasContract = CONTRACT;
    targetCanvas.dataset.hearthCanvasSphereContainment = "true";
    targetCanvas.dataset.hearthCanvasOutsideSphereTransparent = "true";
    targetCanvas.dataset.hearthCanvasCachedAtlasProjection = "true";
    targetCanvas.dataset.visualPassClaimed = "false";

    return targetCanvas;
  }

  const renderToCanvas = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const drawToCanvas = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const render = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const paint = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);

  function bindPointerDrag(canvas, api, options = {}) {
    const state = api.state;

    const handlePointerDown = (event) => {
      if (state.destroyed) return;

      state.dragging = true;
      state.pointerId = event.pointerId;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;

      canvas.style.cursor = "grabbing";
      canvas.dataset.hearthCanvasDragging = "true";

      if (canvas.setPointerCapture && event.pointerId !== undefined) {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch (_error) {}
      }

      if (event.cancelable) event.preventDefault();
    };

    const handlePointerMove = (event) => {
      if (state.destroyed || !state.dragging) return;
      if (state.pointerId !== null && event.pointerId !== state.pointerId) return;

      const dx = event.clientX - state.lastPointerX;
      const dy = event.clientY - state.lastPointerY;

      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;

      state.rotationLon -= dx * 0.010;
      state.rotationLat += dy * 0.008;
      state.rotationLat = clamp(state.rotationLat, -Math.PI * 0.42, Math.PI * 0.42);

      canvas.dataset.hearthCanvasRotationLon = String(state.rotationLon);
      canvas.dataset.hearthCanvasRotationLat = String(state.rotationLat);

      api.requestRedraw();

      if (event.cancelable) event.preventDefault();
    };

    const endDrag = (event) => {
      if (state.destroyed) return;
      if (state.pointerId !== null && event && event.pointerId !== state.pointerId) return;

      state.dragging = false;
      canvas.style.cursor = "grab";
      canvas.dataset.hearthCanvasDragging = "false";

      if (event && canvas.releasePointerCapture && event.pointerId !== undefined) {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch (_error) {}
      }

      state.pointerId = null;
      if (event && event.cancelable) event.preventDefault();
    };

    canvas.addEventListener("pointerdown", handlePointerDown, { passive: false });
    canvas.addEventListener("pointermove", handlePointerMove, { passive: false });
    canvas.addEventListener("pointerup", endDrag, { passive: false });
    canvas.addEventListener("pointercancel", endDrag, { passive: false });
    canvas.addEventListener("lostpointercapture", endDrag, { passive: false });

    canvas.dataset.hearthCanvasControlsBound = "true";
    state.controlsBound = true;

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("lostpointercapture", endDrag);
      canvas.dataset.hearthCanvasControlsBound = "false";
      state.controlsBound = false;
    };
  }

  function createShellFirstMount(target, options = {}) {
    if (!root.document) return null;

    const element =
      typeof target === "string"
        ? root.document.querySelector(target)
        : target && target.nodeType === 1
          ? target
          : null;

    if (!element) return null;

    element.querySelectorAll("[data-hearth-canvas-texture], canvas.hearth-canvas-texture").forEach((node) => {
      node.remove();
    });

    const canvas = createShellCanvas(options);

    const state = {
      rotationLon: Number.isFinite(Number(options.rotationLon)) ? Number(options.rotationLon) : 0,
      rotationLat: Number.isFinite(Number(options.rotationLat)) ? Number(options.rotationLat) : 0,
      dragging: false,
      pointerId: null,
      lastPointerX: 0,
      lastPointerY: 0,
      frames: 0,
      atlasReady: false,
      atlasBuilding: false,
      atlasProgress: 0,
      fallbackActive: true,
      destroyed: false,
      redrawPending: false,
      controlsBound: false,
      atlas: null,
      atlasController: null
    };

    const api = {
      canvas,
      node: element,
      state,
      mounted: true,
      canvasFound: true,
      controlsBound: false,
      interactiveShellMounted: true,
      cachedAtlasProjection: false,
      atlasReady: false,
      atlasBuilding: false,
      contract: CONTRACT,
      receipt: RECEIPT,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      redraw() {
        if (state.destroyed) return canvas;

        state.redrawPending = false;

        if (state.atlasReady && state.atlas) {
          renderSphereFromAtlas(canvas, state.atlas, state, options);
          state.fallbackActive = false;
        } else {
          drawFallbackShell(canvas, state);
          state.fallbackActive = true;
        }

        state.frames += 1;
        canvas.dataset.hearthCanvasFrames = String(state.frames);
        return canvas;
      },
      requestRedraw() {
        if (state.destroyed || state.redrawPending) return;
        state.redrawPending = true;

        if (root.requestAnimationFrame) {
          root.requestAnimationFrame(() => api.redraw());
        } else {
          setTimeout(() => api.redraw(), 16);
        }
      },
      destroy() {
        state.destroyed = true;

        if (state.atlasController && typeof state.atlasController.cancel === "function") {
          state.atlasController.cancel();
        }

        if (typeof api.unbindControls === "function") api.unbindControls();

        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      },
      unbindControls: null
    };

    element.appendChild(canvas);

    canvas.dataset.hearthCanvasMountedImmediately = "true";
    canvas.dataset.hearthCanvasInteractiveShellMounted = "true";
    canvas.dataset.hearthCanvasAtlasReady = "false";
    canvas.dataset.hearthCanvasAtlasBuilding = "false";
    canvas.dataset.hearthCanvasAtlasProgress = "0";

    drawFallbackShell(canvas, state);

    api.unbindControls = bindPointerDrag(canvas, api, options);
    api.controlsBound = true;
    state.controlsBound = true;

    if (typeof options.onStatus === "function") {
      options.onStatus("mounted-shell-first", {
        mounted: true,
        canvasFound: true,
        controlsBound: true,
        interactiveShellMounted: true,
        atlasReady: false,
        atlasBuilding: false,
        frames: state.frames,
        contract: CONTRACT,
        receipt: RECEIPT
      });
    }

    const startAtlas = () => {
      if (state.destroyed) return;

      state.atlasBuilding = true;
      api.atlasBuilding = true;
      canvas.dataset.hearthCanvasAtlasBuilding = "true";

      if (typeof options.onStatus === "function") {
        options.onStatus("atlas-building-async", {
          mounted: true,
          canvasFound: true,
          controlsBound: true,
          interactiveShellMounted: true,
          atlasReady: false,
          atlasBuilding: true,
          frames: state.frames,
          contract: CONTRACT,
          receipt: RECEIPT
        });
      }

      state.atlasController = buildAtlasAsync(
        {
          width: options.atlasWidth || 384,
          height: options.atlasHeight || 192,
          rowsPerChunk: options.rowsPerChunk || 2,
          allowLargeTexture: options.allowLargeTexture === true
        },
        {
          onProgress(progress) {
            if (state.destroyed) return;

            state.atlasProgress = progress;
            canvas.dataset.hearthCanvasAtlasProgress = String(progress);

            if (typeof options.onStatus === "function" && progress > 0 && progress < 1) {
              options.onStatus("atlas-progress", {
                mounted: true,
                canvasFound: true,
                controlsBound: true,
                interactiveShellMounted: true,
                atlasReady: false,
                atlasBuilding: true,
                atlasProgress: progress,
                frames: state.frames,
                contract: CONTRACT,
                receipt: RECEIPT
              });
            }
          },
          onComplete(atlas) {
            if (state.destroyed) return;

            state.atlas = atlas;
            state.atlasReady = true;
            state.atlasBuilding = false;
            state.atlasProgress = 1;
            state.fallbackActive = false;

            api.atlasReady = true;
            api.atlasBuilding = false;
            api.cachedAtlasProjection = true;

            canvas.dataset.hearthCanvasAtlasReady = "true";
            canvas.dataset.hearthCanvasAtlasBuilding = "false";
            canvas.dataset.hearthCanvasAtlasProgress = "1";
            canvas.dataset.hearthCanvasCachedAtlasProjection = "true";

            api.requestRedraw();

            if (typeof options.onStatus === "function") {
              options.onStatus("atlas-ready", {
                mounted: true,
                canvasFound: true,
                controlsBound: true,
                interactiveShellMounted: true,
                atlasReady: true,
                atlasBuilding: false,
                atlasProgress: 1,
                frames: state.frames,
                contract: CONTRACT,
                receipt: RECEIPT
              });
            }
          },
          onError(error) {
            if (state.destroyed) return;

            state.atlasBuilding = false;
            state.atlasReady = false;
            state.fallbackActive = true;

            api.atlasBuilding = false;
            api.atlasReady = false;

            canvas.dataset.hearthCanvasAtlasBuilding = "false";
            canvas.dataset.hearthCanvasAtlasReady = "false";
            canvas.dataset.hearthCanvasAtlasError = error && error.message ? error.message : String(error);

            drawFallbackShell(canvas, state);

            if (typeof options.onStatus === "function") {
              options.onStatus("atlas-error-fallback-held", {
                mounted: true,
                canvasFound: true,
                controlsBound: true,
                interactiveShellMounted: true,
                atlasReady: false,
                atlasBuilding: false,
                error: error && error.message ? error.message : String(error),
                frames: state.frames,
                contract: CONTRACT,
                receipt: RECEIPT
              });
            }
          }
        }
      );
    };

    setTimeout(startAtlas, 0);

    return api;
  }

  const mount = (target, options = {}) => createShellFirstMount(target, options);

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "true-shell-first-nonblocking-canvas",
      status: "active",
      primaryTarget: "/assets/hearth/hearth.canvas.js",
      shellFirstMount: true,
      nonBlockingMount: true,
      asyncAtlasBuild: true,
      chunkedAtlasBuild: true,
      fallbackShellImmediate: true,
      touchDragBoundImmediately: true,
      pointerDragBoundImmediately: true,
      mountReturnsApiObject: true,
      consumesOcean: true,
      oceanContract: OCEAN_CONTRACT,
      oceanConsumerContract: CONTRACT,
      oceanFailSoft: true,
      oceanComposedWithMaterials: true,
      oceanComposedWithHydrology: true,
      sphereContainment: true,
      noRectangularTextureSpill: true,
      projectionCompatible: true,
      outsideSphereTransparent: true,
      cachedAtlasProjection: true,
      interactiveProjection: true,
      owns: [
        "visible-canvas-shell",
        "fallback-shell-drawing",
        "pointer-touch-drag-binding",
        "rotation-state",
        "redraw-scheduling",
        "async-atlas-build",
        "cached-atlas-projection",
        "final-pixel-composition",
        "spherical-alpha-containment-for-visible-canvas-output"
      ],
      doesNotOwn: [
        "tectonic-cause",
        "elevation-generation",
        "composition-classification",
        "hydrology-classification",
        "ocean-authority-generation",
        "terrain-material-generation",
        "route-orchestration",
        "runtime-motion",
        "external-controls-authority",
        "final-visual-pass-claim"
      ],
      failSoftRules: [
        "mount-visible-shell-before-atlas",
        "bind-controls-before-atlas",
        "return-api-before-atlas",
        "if-atlas-fails-keep-draggable-fallback-shell",
        "no-blank-planet",
        "no-map-portal-freeze",
        "no-raw-rectangle-fallback"
      ],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    sample,
    read,
    compose,
    composeSample,
    composeSampleAlias,
    composePixel,
    getPixel,
    getColor,

    createShellCanvas,
    drawFallbackShell,
    bindPointerDrag,
    buildAtlasAsync,
    createShellFirstMount,

    createTextureCanvas,
    createSphereTextureCanvas,
    createAtlasTextureCanvas,
    createCanvas,
    createPlanetTexture,
    createTexture,
    buildTexture,
    getTextureCanvas,

    renderSphereFromAtlas,
    paintToCanvas,
    renderToCanvas,
    drawToCanvas,
    render,
    paint,
    mount,

    getReceipt,

    supportsTrueShellFirstMount: true,
    supportsNonBlockingMount: true,
    supportsAsyncAtlasBuild: true,
    supportsChunkedAtlasBuild: true,
    supportsImmediateFallbackShell: true,
    supportsImmediateTouchDrag: true,
    supportsImmediatePointerDrag: true,
    supportsRichBlueOceanCanvasConsumer: true,
    supportsOceanTerrainComposition: true,
    supportsOceanFailSoft: true,
    supportsSphereContainment: true,
    supportsOutsideSphereTransparency: true,
    supportsProjectionCompatibility: true,
    supportsCachedAtlasProjection: true,
    supportsInteractiveProjection: true,

    consumesOcean: true,
    oceanContract: OCEAN_CONTRACT,
    oceanConsumerContract: CONTRACT,
    oceanFailSoft: true,
    oceanComposedWithMaterials: true,
    oceanComposedWithHydrology: true,
    sphereContainment: true,
    noRectangularTextureSpill: true,
    outsideSphereTransparent: true,
    projectionCompatible: true,
    cachedAtlasProjection: true,
    interactiveProjection: true,
    shellFirstMount: true,
    nonBlockingMount: true,

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
  root.HEARTH_CANVAS_SPHERE_CONTAINMENT = true;
  root.HEARTH_CANVAS_NO_RECTANGULAR_TEXTURE_SPILL = true;
  root.HEARTH_CANVAS_PROJECTION_COMPATIBLE = true;
  root.HEARTH_CANVAS_OUTSIDE_SPHERE_TRANSPARENT = true;
  root.HEARTH_CANVAS_CACHED_ATLAS_PROJECTION = true;
  root.HEARTH_CANVAS_INTERACTIVE_PROJECTION = true;
  root.HEARTH_CANVAS_TRUE_SHELL_FIRST = true;
  root.HEARTH_CANVAS_NONBLOCKING_MOUNT = true;
  root.HEARTH_CANVAS_ASYNC_ATLAS_BUILD = true;
  root.HEARTH_CANVAS_SUPPORTS_TOUCH_DRAG = true;
  root.HEARTH_CANVAS_SUPPORTS_POINTER_DRAG = true;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthCanvasAuthorityLoaded = "true";
    root.document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    root.document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    root.document.documentElement.dataset.hearthCanvasConsumesOcean = "true";
    root.document.documentElement.dataset.hearthCanvasOceanContract = OCEAN_CONTRACT;
    root.document.documentElement.dataset.hearthCanvasOceanConsumerContract = CONTRACT;
    root.document.documentElement.dataset.hearthCanvasOceanFailSoft = "true";
    root.document.documentElement.dataset.hearthCanvasOceanComposedWithMaterials = "true";
    root.document.documentElement.dataset.hearthCanvasOceanComposedWithHydrology = "true";
    root.document.documentElement.dataset.hearthCanvasSphereContainment = "true";
    root.document.documentElement.dataset.hearthCanvasNoRectangularTextureSpill = "true";
    root.document.documentElement.dataset.hearthCanvasProjectionCompatible = "true";
    root.document.documentElement.dataset.hearthCanvasOutsideSphereTransparent = "true";
    root.document.documentElement.dataset.hearthCanvasCachedAtlasProjection = "true";
    root.document.documentElement.dataset.hearthCanvasInteractiveProjection = "true";
    root.document.documentElement.dataset.hearthCanvasTrueShellFirst = "true";
    root.document.documentElement.dataset.hearthCanvasNonBlockingMount = "true";
    root.document.documentElement.dataset.hearthCanvasAsyncAtlasBuild = "true";
    root.document.documentElement.dataset.hearthCanvasSupportsTouchDrag = "true";
    root.document.documentElement.dataset.hearthCanvasSupportsPointerDrag = "true";
    root.document.documentElement.dataset.hearthCanvasMountReturnsApiObject = "true";
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
