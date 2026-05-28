// /assets/hearth/hearth.ocean.js
// HEARTH_RICH_BLUE_OCEAN_BODY_AUTHORITY_TNT_v1
// New file.
// Ocean authority only.
// Purpose:
// - Consume Hearth hydrology when available.
// - Express visible ocean-body material as a separate authority.
// - Provide rich blue ocean, deep ocean, shallow shelf, water-fill, waterline contrast, submerged basin, and port-basin water fields.
// Does not own:
// - terrain base material
// - landmass shape
// - beach generation
// - cliff generation
// - island generation
// - hydrology classification
// - sea-level calculation authority
// - canvas drawing
// - runtime motion
// - controls
// - route orchestration
// - clickable ports
// - labels
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_RICH_BLUE_OCEAN_BODY_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_RICH_BLUE_OCEAN_BODY_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-28.hearth-rich-blue-ocean-body-authority-v1";
  const FAMILY = "HEARTH_SEPARATE_OCEAN_BODY_AUTHORITY";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;

  const PALETTE = Object.freeze({
    deepOcean: [3, 12, 35],
    openOcean: [7, 31, 75],
    richOcean: [9, 43, 104],
    oldWorldBlue: [10, 38, 91],
    waterFill: [7, 29, 58],
    shallowShelf: [22, 70, 96],
    shelfGreenBlue: [26, 82, 93],
    waterlineBlue: [18, 55, 83],
    submergedBasin: [5, 18, 34],
    submergedPortBasin: [4, 14, 26],
    submergedScarMute: [10, 27, 39],
    submergedBlockDepth: [8, 24, 36],
    blueBlack: [2, 8, 20],
    boundarySoft: [24, 62, 78],
    boundaryHard: [8, 20, 31]
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
      Math.round(mixNumber(a[0], b[0], k)),
      Math.round(mixNumber(a[1], b[1], k)),
      Math.round(mixNumber(a[2], b[2], k))
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

  const normalize3 = (p) => {
    const x = Number.isFinite(Number(p && p.x)) ? Number(p.x) : 0;
    const y = Number.isFinite(Number(p && p.y)) ? Number(p.y) : 0;
    const z = Number.isFinite(Number(p && p.z)) ? Number(p.z) : 1;
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
  };

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

    if (args.length >= 3) {
      return normalize3({ x: args[0], y: args[1], z: args[2] });
    }

    if (args.length >= 2) {
      return lonLatToVector(Number(args[0]), Number(args[1]));
    }

    return lonLatToVector(0, 0);
  };

  const hashNoise = (x, y, z, salt = 0) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + salt * 61.77) * 43758.5453123;
    return n - Math.floor(n);
  };

  const oceanNoise = (p, salt = 0) => {
    const n1 = hashNoise(p.x, p.y, p.z, salt);
    const n2 = hashNoise(p.y + n1, p.z - n1, p.x + n1, salt + 19);
    const n3 = hashNoise(p.z - n2, p.x + n2, p.y - n2, salt + 43);
    return clamp01(n1 * 0.46 + n2 * 0.34 + n3 * 0.20);
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

  const getHydrologyAuthority = () => {
    if (root.HEARTH && root.HEARTH.hydrology) return root.HEARTH.hydrology;
    if (root.HEARTH_HYDROLOGY) return root.HEARTH_HYDROLOGY;
    if (root.HearthHydrology) return root.HearthHydrology;
    return null;
  };

  const fallbackHydrology = (p) => {
    const n = oceanNoise(p, 11);
    const impliedWater = p.z < 0.34 || n > 0.62;
    const depth = impliedWater ? clamp01((0.42 - p.z) * 1.1 + n * 0.22) : 0;
    const shelf = impliedWater ? clamp01(1 - depth) * 0.42 : 0;
    const waterline = clamp01((1 - Math.abs(p.z - 0.34) / 0.22) * 0.55);

    return {
      contract: "HEARTH_OCEAN_FALLBACK_HYDROLOGY",
      receipt: "FALLBACK_HYDROLOGY_USED",
      hydrologyClass: impliedWater ? "open_ocean_basin" : "none",
      waterBoundaryClass: impliedWater ? "open_ocean_basin" : "none",
      coastBoundaryClass: waterline > 0.24 ? "coastal_transition_zone" : "none",
      waterFill: impliedWater,
      waterFillStrength: impliedWater ? clamp01(0.46 + depth * 0.36) : 0,
      waterDepth: depth,
      waterDepthClass: depth > 0.68 ? "deep" : depth > 0.34 ? "mid" : impliedWater ? "shallow" : "dry",
      waterlineBoundary: waterline > 0.28,
      waterlineBoundaryStrength: waterline,
      shallowShelf: shelf > 0.22,
      shallowShelfStrength: shelf,
      belowSeaLevel: impliedWater,
      belowSeaLevelStrength: impliedWater ? clamp01(0.42 + depth * 0.32) : 0,
      nearSeaLevel: waterline > 0.28,
      nearSeaLevelStrength: waterline,
      oceanDepth: depth,
      oceanContinuity: impliedWater ? clamp01(0.52 + depth * 0.26) : 0,
      shelfGradient: shelf,
      materialWaterFeed: impliedWater ? clamp01(0.48 + depth * 0.26) : 0,
      materialShelfFeed: shelf,
      materialWaterlineFeed: waterline,
      submergedBlock: false,
      submergedBlockStrength: 0,
      submergedScar: false,
      submergedScarStrength: 0,
      oldCoastalTechSubmerged: false,
      oldCoastalTechSubmergedStrength: 0,
      materialSubmergedBlockFeed: 0,
      materialSubmergedScarFeed: 0,
      materialCliffWaterEdgeFeed: 0,
      materialSandShelfFeed: shelf * 0.2,
      materialBeachFeed: waterline * 0.1,
      bayPotential: 0,
      inletPotential: 0,
      straitPotential: 0,
      archipelagoChannelPotential: 0
    };
  };

  const normalizeHydrology = (raw, p) => {
    const fallback = fallbackHydrology(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const merged = { ...fallback, ...source };

    const numericKeys = [
      "waterFillStrength",
      "waterDepth",
      "waterlineBoundaryStrength",
      "shallowShelfStrength",
      "belowSeaLevelStrength",
      "nearSeaLevelStrength",
      "oceanDepth",
      "oceanContinuity",
      "shelfGradient",
      "materialWaterFeed",
      "materialShelfFeed",
      "materialWaterlineFeed",
      "submergedBlockStrength",
      "submergedScarStrength",
      "oldCoastalTechSubmergedStrength",
      "materialSubmergedBlockFeed",
      "materialSubmergedScarFeed",
      "materialCliffWaterEdgeFeed",
      "materialSandShelfFeed",
      "materialBeachFeed",
      "bayPotential",
      "inletPotential",
      "straitPotential",
      "archipelagoChannelPotential"
    ];

    numericKeys.forEach((key) => {
      merged[key] = clamp01(numberField(merged, key, fallback[key] || 0));
    });

    merged.hydrologyClass = stringField(merged, "hydrologyClass", fallback.hydrologyClass);
    merged.waterBoundaryClass = stringField(merged, "waterBoundaryClass", fallback.waterBoundaryClass);
    merged.coastBoundaryClass = stringField(merged, "coastBoundaryClass", fallback.coastBoundaryClass);
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

  const readHydrology = (...args) => {
    const p = parseInput(...args);
    const hydrology = getHydrologyAuthority();

    if (hydrology) {
      const fn =
        typeof hydrology.sample === "function"
          ? hydrology.sample
          : typeof hydrology.read === "function"
            ? hydrology.read
            : typeof hydrology.sampleHydrology === "function"
              ? hydrology.sampleHydrology
              : typeof hydrology.getHydrology === "function"
                ? hydrology.getHydrology
                : null;

      if (fn) {
        try {
          return normalizeHydrology(fn.apply(hydrology, args), p);
        } catch (_error) {
          try {
            return normalizeHydrology(fn.call(hydrology, p), p);
          } catch (_error2) {
            return fallbackHydrology(p);
          }
        }
      }
    }

    return fallbackHydrology(p);
  };

  const computeOceanFeeds = (hydrology, p) => {
    const waterPresence = clamp01(
      hydrology.waterFillStrength * 0.42 +
      hydrology.materialWaterFeed * 0.24 +
      hydrology.oceanContinuity * 0.18 +
      hydrology.belowSeaLevelStrength * 0.10 +
      (hydrology.waterFill ? 0.06 : 0)
    );

    const deepOceanBlueFeed = clamp01(
      hydrology.waterDepth * 0.34 +
      hydrology.oceanDepth * 0.34 +
      (hydrology.waterDepthClass === "deep" ? 0.24 : 0) +
      hydrology.oceanContinuity * 0.08
    );

    const openOceanBlueFeed = clamp01(
      hydrology.oceanContinuity * 0.42 +
      hydrology.materialWaterFeed * 0.22 +
      hydrology.waterFillStrength * 0.18 +
      (hydrology.waterDepthClass === "mid" ? 0.12 : 0) +
      waterPresence * 0.06
    );

    const richBlueOceanFeed = clamp01(
      openOceanBlueFeed * 0.36 +
      deepOceanBlueFeed * 0.22 +
      waterPresence * 0.22 +
      hydrology.materialWaterFeed * 0.14 +
      hydrology.oceanContinuity * 0.06
    );

    const shallowShelfBlueFeed = clamp01(
      hydrology.shallowShelfStrength * 0.42 +
      hydrology.shelfGradient * 0.26 +
      hydrology.materialShelfFeed * 0.18 +
      hydrology.materialSandShelfFeed * 0.06 +
      (hydrology.waterDepthClass === "shallow" ? 0.08 : 0)
    );

    const waterFillBlueFeed = clamp01(
      hydrology.waterFillStrength * 0.54 +
      hydrology.materialWaterFeed * 0.20 +
      hydrology.belowSeaLevelStrength * 0.14 +
      waterPresence * 0.12
    );

    const waterlineBlueContrastFeed = clamp01(
      hydrology.waterlineBoundaryStrength * 0.48 +
      hydrology.materialWaterlineFeed * 0.28 +
      hydrology.nearSeaLevelStrength * 0.14 +
      hydrology.shallowShelfStrength * 0.06 +
      hydrology.materialBeachFeed * 0.04
    );

    const submergedBasinBlueFeed = clamp01(
      hydrology.waterFillStrength * 0.22 +
      hydrology.waterDepth * 0.20 +
      hydrology.submergedBlockStrength * 0.16 +
      hydrology.submergedScarStrength * 0.12 +
      hydrology.oldCoastalTechSubmergedStrength * 0.10 +
      hydrology.materialSubmergedBlockFeed * 0.10 +
      hydrology.materialSubmergedScarFeed * 0.10
    );

    const protectedBasinSignal = clamp01(
      hydrology.bayPotential * 0.22 +
      hydrology.inletPotential * 0.18 +
      hydrology.straitPotential * 0.10 +
      hydrology.archipelagoChannelPotential * 0.10 +
      hydrology.submergedBlockStrength * 0.16 +
      hydrology.submergedScarStrength * 0.14 +
      hydrology.oldCoastalTechSubmergedStrength * 0.10
    );

    const submergedPortBasinBlueFeed = clamp01(
      submergedBasinBlueFeed * 0.36 +
      protectedBasinSignal * 0.34 +
      hydrology.waterlineBoundaryStrength * 0.10 +
      hydrology.shallowShelfStrength * 0.08 +
      hydrology.waterDepth * 0.12
    );

    const submergedScarWaterMuteFeed = clamp01(
      hydrology.submergedScarStrength * 0.38 +
      hydrology.materialSubmergedScarFeed * 0.24 +
      hydrology.oldCoastalTechSubmergedStrength * 0.18 +
      waterFillBlueFeed * 0.10 +
      hydrology.waterDepth * 0.10
    );

    const submergedBlockWaterDepthFeed = clamp01(
      hydrology.submergedBlockStrength * 0.38 +
      hydrology.materialSubmergedBlockFeed * 0.24 +
      hydrology.waterDepth * 0.18 +
      submergedBasinBlueFeed * 0.12 +
      waterFillBlueFeed * 0.08
    );

    const oceanTerrainSeparationFeed = clamp01(
      richBlueOceanFeed * 0.24 +
      waterlineBlueContrastFeed * 0.24 +
      shallowShelfBlueFeed * 0.16 +
      waterFillBlueFeed * 0.14 +
      hydrology.materialWaterlineFeed * 0.12 +
      hydrology.nearSeaLevelStrength * 0.10
    );

    const oceanDepthShade = clamp01(
      deepOceanBlueFeed * 0.36 +
      hydrology.waterDepth * 0.28 +
      submergedBasinBlueFeed * 0.14 +
      submergedPortBasinBlueFeed * 0.12 +
      hydrology.oceanDepth * 0.10
    );

    const surfaceNoise = oceanNoise(p, 137);
    const oceanSurfaceCalm = clamp01(
      0.62 -
      hydrology.materialCliffWaterEdgeFeed * 0.14 -
      hydrology.waterlineBoundaryStrength * 0.08 +
      surfaceNoise * 0.08
    );

    const oceanBoundarySoftness = clamp01(
      hydrology.shallowShelfStrength * 0.28 +
      hydrology.shelfGradient * 0.20 +
      hydrology.materialSandShelfFeed * 0.16 +
      hydrology.materialBeachFeed * 0.12 +
      hydrology.nearSeaLevelStrength * 0.10 +
      waterlineBlueContrastFeed * 0.08
    );

    const oceanBoundaryHardness = clamp01(
      hydrology.materialCliffWaterEdgeFeed * 0.30 +
      hydrology.submergedScarStrength * 0.16 +
      hydrology.submergedBlockStrength * 0.16 +
      hydrology.waterDepth * 0.12 +
      hydrology.straitPotential * 0.10 +
      hydrology.archipelagoChannelPotential * 0.08
    );

    return {
      oceanPresence: waterPresence,
      deepOceanBlueFeed,
      openOceanBlueFeed,
      richBlueOceanFeed,
      shallowShelfBlueFeed,
      waterFillBlueFeed,
      waterlineBlueContrastFeed,
      submergedBasinBlueFeed,
      submergedPortBasinBlueFeed,
      submergedScarWaterMuteFeed,
      submergedBlockWaterDepthFeed,
      oceanTerrainSeparationFeed,
      oceanDepthShade,
      oceanSurfaceCalm,
      oceanBoundarySoftness,
      oceanBoundaryHardness
    };
  };

  const computeOceanColor = (feeds) => {
    let rgb = PALETTE.blueBlack.slice();

    rgb = mixColor(rgb, PALETTE.deepOcean, clamp01(feeds.deepOceanBlueFeed * 0.72));
    rgb = mixColor(rgb, PALETTE.openOcean, clamp01(feeds.openOceanBlueFeed * 0.56));
    rgb = mixColor(rgb, PALETTE.richOcean, clamp01(feeds.richBlueOceanFeed * 0.46));
    rgb = mixColor(rgb, PALETTE.waterFill, clamp01(feeds.waterFillBlueFeed * 0.34));

    if (feeds.shallowShelfBlueFeed > 0.12) {
      rgb = mixColor(rgb, PALETTE.shallowShelf, clamp01(feeds.shallowShelfBlueFeed * 0.34));
      rgb = mixColor(rgb, PALETTE.shelfGreenBlue, clamp01(feeds.shallowShelfBlueFeed * 0.14));
    }

    if (feeds.waterlineBlueContrastFeed > 0.14) {
      rgb = mixColor(rgb, PALETTE.waterlineBlue, clamp01(feeds.waterlineBlueContrastFeed * 0.24));
    }

    if (feeds.submergedBasinBlueFeed > 0.16) {
      rgb = mixColor(rgb, PALETTE.submergedBasin, clamp01(feeds.submergedBasinBlueFeed * 0.38));
    }

    if (feeds.submergedPortBasinBlueFeed > 0.18) {
      rgb = mixColor(rgb, PALETTE.submergedPortBasin, clamp01(feeds.submergedPortBasinBlueFeed * 0.42));
    }

    if (feeds.submergedScarWaterMuteFeed > 0.14) {
      rgb = mixColor(rgb, PALETTE.submergedScarMute, clamp01(feeds.submergedScarWaterMuteFeed * 0.20));
    }

    if (feeds.submergedBlockWaterDepthFeed > 0.14) {
      rgb = mixColor(rgb, PALETTE.submergedBlockDepth, clamp01(feeds.submergedBlockWaterDepthFeed * 0.22));
    }

    rgb = mixColor(rgb, PALETTE.boundarySoft, clamp01(feeds.oceanBoundarySoftness * 0.10));
    rgb = mixColor(rgb, PALETTE.boundaryHard, clamp01(feeds.oceanBoundaryHardness * 0.18));

    const depthDarken = clamp01(feeds.oceanDepthShade * 0.16 + feeds.submergedPortBasinBlueFeed * 0.10);
    rgb = scaleColor(rgb, 1 - depthDarken);

    const richnessLift = clamp01(feeds.richBlueOceanFeed * 0.08 + feeds.openOceanBlueFeed * 0.05);
    rgb = [
      clamp(Math.round(rgb[0] * (1 - richnessLift * 0.20)), 0, 255),
      clamp(Math.round(rgb[1] * (1 + richnessLift * 0.16)), 0, 255),
      clamp(Math.round(rgb[2] * (1 + richnessLift * 0.24)), 0, 255)
    ];

    return rgb;
  };

  const sample = (...args) => {
    const p = parseInput(...args);
    const hydrology = readHydrology(...args);
    const feeds = computeOceanFeeds(hydrology, p);
    const oceanRgb = computeOceanColor(feeds);

    const isOcean = feeds.oceanPresence > 0.18 || hydrology.waterFill || hydrology.waterDepthClass !== "dry";
    const isDeepOcean = feeds.deepOceanBlueFeed > 0.46 || hydrology.waterDepthClass === "deep";
    const isOpenOcean = feeds.openOceanBlueFeed > 0.38 && !isDeepOcean;
    const isShallowShelf = feeds.shallowShelfBlueFeed > 0.30 || hydrology.shallowShelf;
    const isWaterline = feeds.waterlineBlueContrastFeed > 0.28 || hydrology.waterlineBoundary;
    const isSubmergedBasin = feeds.submergedBasinBlueFeed > 0.32;
    const isSubmergedPortBasinCandidate = feeds.submergedPortBasinBlueFeed > 0.34;
    const isSubmergedScarWater = feeds.submergedScarWaterMuteFeed > 0.30 || hydrology.submergedScar;
    const isSubmergedBlockWater = feeds.submergedBlockWaterDepthFeed > 0.30 || hydrology.submergedBlock;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      family: FAMILY,
      authority: "ocean",
      sourceAuthority: "hearth.hydrology.js",

      x: p.x,
      y: p.y,
      z: p.z,

      oceanRgb,
      oceanColor: oceanRgb,
      color: oceanRgb,
      oceanAlpha: clamp01(feeds.oceanPresence),
      oceanPresence: feeds.oceanPresence,

      deepOceanBlueFeed: feeds.deepOceanBlueFeed,
      openOceanBlueFeed: feeds.openOceanBlueFeed,
      richBlueOceanFeed: feeds.richBlueOceanFeed,
      shallowShelfBlueFeed: feeds.shallowShelfBlueFeed,
      waterFillBlueFeed: feeds.waterFillBlueFeed,
      waterlineBlueContrastFeed: feeds.waterlineBlueContrastFeed,
      submergedBasinBlueFeed: feeds.submergedBasinBlueFeed,
      submergedPortBasinBlueFeed: feeds.submergedPortBasinBlueFeed,
      submergedScarWaterMuteFeed: feeds.submergedScarWaterMuteFeed,
      submergedBlockWaterDepthFeed: feeds.submergedBlockWaterDepthFeed,
      oceanTerrainSeparationFeed: feeds.oceanTerrainSeparationFeed,
      oceanDepthShade: feeds.oceanDepthShade,
      oceanSurfaceCalm: feeds.oceanSurfaceCalm,
      oceanBoundarySoftness: feeds.oceanBoundarySoftness,
      oceanBoundaryHardness: feeds.oceanBoundaryHardness,

      isOcean,
      isDeepOcean,
      isOpenOcean,
      isShallowShelf,
      isWaterline,
      isSubmergedBasin,
      isSubmergedPortBasinCandidate,
      isSubmergedScarWater,
      isSubmergedBlockWater,

      oceanConsumerReady: true,

      hydrologyClass: hydrology.hydrologyClass,
      waterBoundaryClass: hydrology.waterBoundaryClass,
      coastBoundaryClass: hydrology.coastBoundaryClass,
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
      nearSeaLevel: hydrology.nearSeaLevel,
      nearSeaLevelStrength: hydrology.nearSeaLevelStrength,
      oceanDepth: hydrology.oceanDepth,
      oceanContinuity: hydrology.oceanContinuity,
      shelfGradient: hydrology.shelfGradient,
      materialWaterFeed: hydrology.materialWaterFeed,
      materialShelfFeed: hydrology.materialShelfFeed,
      materialWaterlineFeed: hydrology.materialWaterlineFeed,
      submergedBlock: hydrology.submergedBlock,
      submergedBlockStrength: hydrology.submergedBlockStrength,
      submergedScar: hydrology.submergedScar,
      submergedScarStrength: hydrology.submergedScarStrength,
      oldCoastalTechSubmerged: hydrology.oldCoastalTechSubmerged,
      oldCoastalTechSubmergedStrength: hydrology.oldCoastalTechSubmergedStrength,

      hydrologyContract: hydrology.contract || "UNKNOWN_HYDROLOGY_CONTRACT",

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      canvasDrawing: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  };

  const read = (...args) => sample(...args);
  const sampleOcean = (...args) => sample(...args);
  const readOcean = (...args) => sample(...args);
  const getOcean = (...args) => sample(...args);
  const oceanAt = (...args) => sample(...args);
  const getOceanAt = (...args) => sample(...args);
  const resolveOcean = (...args) => sample(...args);
  const getOceanColor = (...args) => sample(...args).oceanRgb;

  const getReceipt = () => ({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    family: FAMILY,
    authority: "ocean",
    status: "active",
    file: "/assets/hearth/hearth.ocean.js",
    fileStatus: "new-file",
    sourceAuthority: "hearth.hydrology.js",
    laterComposer: "hearth.canvas.js",
    purpose: "separate-rich-blue-ocean-body-authority",
    owns: [
      "rich-blue-ocean-body",
      "deep-ocean-blue-black",
      "open-ocean-blue",
      "shallow-shelf-blue",
      "water-fill-blue",
      "submerged-basin-water",
      "submerged-port-basin-water-darkness",
      "waterline-blue-contrast",
      "ocean-terrain-separation",
      "submerged-scar-water-muting",
      "submerged-block-water-depth"
    ],
    doesNotOwn: [
      "terrain-base-material",
      "landmass-shape",
      "cliff-generation",
      "island-generation",
      "beach-generation",
      "hydrology-classification",
      "sea-level-calculation-authority",
      "canvas-drawing",
      "runtime-motion",
      "controls",
      "route-orchestration",
      "clickable-port",
      "labels",
      "final-visual-pass-claim"
    ],
    consumesHydrology: true,
    exposesOceanBodyFields: true,
    oceanConsumerReady: true,
    outputFields: [
      "oceanRgb",
      "oceanAlpha",
      "oceanPresence",
      "deepOceanBlueFeed",
      "openOceanBlueFeed",
      "richBlueOceanFeed",
      "shallowShelfBlueFeed",
      "waterFillBlueFeed",
      "waterlineBlueContrastFeed",
      "submergedBasinBlueFeed",
      "submergedPortBasinBlueFeed",
      "submergedScarWaterMuteFeed",
      "submergedBlockWaterDepthFeed",
      "oceanTerrainSeparationFeed",
      "oceanDepthShade",
      "oceanSurfaceCalm",
      "oceanBoundarySoftness",
      "oceanBoundaryHardness",
      "oceanConsumerReady"
    ],
    booleans: [
      "isOcean",
      "isDeepOcean",
      "isOpenOcean",
      "isShallowShelf",
      "isWaterline",
      "isSubmergedBasin",
      "isSubmergedPortBasinCandidate",
      "isSubmergedScarWater",
      "isSubmergedBlockWater"
    ],
    designRules: [
      "ocean is separate from terrain",
      "hydrology classifies",
      "ocean expresses visible water body",
      "canvas composes later",
      "port basin remains implied",
      "no existing file modified",
      "no final visual pass claim"
    ],
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    canvasDrawing: false,
    routeMutation: false,
    runtimeMutation: false,
    controlsMutation: false,
    visualPassClaimed: false
  });

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    family: FAMILY,

    sample,
    read,
    sampleOcean,
    readOcean,
    getOcean,
    getOceanColor,
    oceanAt,
    getOceanAt,
    resolveOcean,
    getReceipt,

    palette: { ...PALETTE },

    supportsRichBlueOceanBody: true,
    supportsSeparateOceanAuthority: true,
    supportsHydrologyConsumer: true,
    supportsDeepOceanBlue: true,
    supportsShallowShelfBlue: true,
    supportsWaterlineBlueContrast: true,
    supportsSubmergedBasinWater: true,
    supportsSubmergedPortBasinWater: true,
    supportsOceanTerrainSeparation: true,
    oceanConsumerReady: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    canvasDrawing: false,
    routeMutation: false,
    runtimeMutation: false,
    controlsMutation: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.ocean = api;

  root.HEARTH_OCEAN = api;
  root.HearthOcean = api;
  root.HEARTH_OCEAN_RECEIPT = getReceipt();
  root.HEARTH_OCEAN_CONTRACT = CONTRACT;

  root.HEARTH_OCEAN_SUPPORTS_RICH_BLUE_OCEAN_BODY = true;
  root.HEARTH_OCEAN_SUPPORTS_SEPARATE_AUTHORITY = true;
  root.HEARTH_OCEAN_SUPPORTS_HYDROLOGY_CONSUMER = true;
  root.HEARTH_OCEAN_SUPPORTS_DEEP_OCEAN_BLUE = true;
  root.HEARTH_OCEAN_SUPPORTS_SHALLOW_SHELF_BLUE = true;
  root.HEARTH_OCEAN_SUPPORTS_WATERLINE_BLUE_CONTRAST = true;
  root.HEARTH_OCEAN_SUPPORTS_SUBMERGED_BASIN_WATER = true;
  root.HEARTH_OCEAN_SUPPORTS_SUBMERGED_PORT_BASIN_WATER = true;
  root.HEARTH_OCEAN_SUPPORTS_OCEAN_TERRAIN_SEPARATION = true;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthOceanAuthorityLoaded = "true";
    root.document.documentElement.dataset.hearthOceanContract = CONTRACT;
    root.document.documentElement.dataset.hearthOceanReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthOceanVersion = VERSION;
    root.document.documentElement.dataset.hearthOceanSeparateAuthority = "true";
    root.document.documentElement.dataset.hearthOceanConsumesHydrology = "true";
    root.document.documentElement.dataset.hearthOceanSupportsRichBlueOceanBody = "true";
    root.document.documentElement.dataset.hearthOceanSupportsDeepOceanBlue = "true";
    root.document.documentElement.dataset.hearthOceanSupportsShallowShelfBlue = "true";
    root.document.documentElement.dataset.hearthOceanSupportsWaterlineBlueContrast = "true";
    root.document.documentElement.dataset.hearthOceanSupportsSubmergedBasinWater = "true";
    root.document.documentElement.dataset.hearthOceanSupportsSubmergedPortBasinWater = "true";
    root.document.documentElement.dataset.hearthOceanSupportsOceanTerrainSeparation = "true";
    root.document.documentElement.dataset.generatedImage = "false";
    root.document.documentElement.dataset.graphicBox = "false";
    root.document.documentElement.dataset.webgl = "false";
    root.document.documentElement.dataset.canvasDrawing = "false";
    root.document.documentElement.dataset.routeMutation = "false";
    root.document.documentElement.dataset.runtimeMutation = "false";
    root.document.documentElement.dataset.controlsMutation = "false";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
