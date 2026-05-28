// /assets/hearth/hearth.materials.js
// HEARTH_MATERIAL_AUTHORITY_COMPATIBILITY_RESCUE_TNT_v1
// Full-file replacement.
// Materials authority compatibility rescue.
// Purpose:
// - Restore active v21 carrier material authority compatibility.
// - Never throw into the route carrier.
// - Preserve surface-mass anchoring fields from the previous materials direction.
// - Support legacy and current callable names.
// - Return broad safe color/material fields for multiple carrier expectations.
// Does not own:
// - elevation generation
// - terrain classification
// - canvas drawing
// - runtime motion
// - controls
// - route UI
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_MATERIAL_AUTHORITY_COMPATIBILITY_RESCUE_TNT_v1";
  const RECEIPT = "HEARTH_MATERIALS_COMPATIBILITY_RESCUE_ACTIVE_v1";
  const AUTHORITY = "materials";
  const SEA_LEVEL = 0.0;
  const DEG = Math.PI / 180;

  const root = typeof window !== "undefined" ? window : globalThis;

  const clamp = (value, min, max) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  };

  const clamp01 = (value) => clamp(value, 0, 1);

  const mix = (a, b, t) => a + (b - a) * clamp01(t);

  const smoothstep = (edge0, edge1, x) => {
    const d = edge1 - edge0 || 1;
    const t = clamp01((x - edge0) / d);
    return t * t * (3 - 2 * t);
  };

  const mixColor = (a, b, t) => {
    const k = clamp01(t);
    return [
      Math.round(mix(a[0], b[0], k)),
      Math.round(mix(a[1], b[1], k)),
      Math.round(mix(a[2], b[2], k))
    ];
  };

  const colorToCss = (rgb, alpha = 1) => {
    const r = clamp(Math.round(rgb && rgb[0]), 0, 255);
    const g = clamp(Math.round(rgb && rgb[1]), 0, 255);
    const b = clamp(Math.round(rgb && rgb[2]), 0, 255);
    const a = clamp(alpha, 0, 1);
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
  };

  const colorToHex = (rgb) => {
    const part = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
    return `#${part(rgb && rgb[0])}${part(rgb && rgb[1])}${part(rgb && rgb[2])}`;
  };

  const shadeColor = (rgb, amount) => {
    const a = clamp(amount, -1, 1);
    if (a >= 0) return mixColor(rgb, [242, 226, 174], a);
    return mixColor(rgb, [3, 8, 14], Math.abs(a));
  };

  const normalize3 = (p) => {
    const x = Number.isFinite(Number(p && p.x)) ? Number(p.x) : 0;
    const y = Number.isFinite(Number(p && p.y)) ? Number(p.y) : 0;
    const z = Number.isFinite(Number(p && p.z)) ? Number(p.z) : 1;
    const m = Math.hypot(x, y, z) || 1;
    return { x: x / m, y: y / m, z: z / m };
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

  const uvToVector = (u, v) => {
    const lon = mix(-180, 180, clamp01(u));
    const lat = mix(-90, 90, clamp01(v));
    return lonLatToVector(lon, lat);
  };

  const parsePoint = (...args) => {
    try {
      if (args.length === 1 && args[0] && typeof args[0] === "object") {
        const p = args[0];

        if (p.point && typeof p.point === "object") return parsePoint(p.point);
        if (p.normal && typeof p.normal === "object") return parsePoint(p.normal);
        if (p.surfaceNormal && typeof p.surfaceNormal === "object") return parsePoint(p.surfaceNormal);
        if (p.position && typeof p.position === "object") return parsePoint(p.position);

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
          return uvToVector(Number(p.u), Number(p.v));
        }
      }

      if (
        args.length >= 3 &&
        Number.isFinite(Number(args[0])) &&
        Number.isFinite(Number(args[1])) &&
        Number.isFinite(Number(args[2]))
      ) {
        return normalize3({ x: Number(args[0]), y: Number(args[1]), z: Number(args[2]) });
      }

      if (
        args.length >= 2 &&
        Number.isFinite(Number(args[0])) &&
        Number.isFinite(Number(args[1]))
      ) {
        const a = Number(args[0]);
        const b = Number(args[1]);

        if (a >= 0 && a <= 1 && b >= 0 && b <= 1) {
          return uvToVector(a, b);
        }

        return lonLatToVector(a, b);
      }
    } catch (err) {
      return { x: 0, y: 0, z: 1 };
    }

    return { x: 0, y: 0, z: 1 };
  };

  const PALETTE = {
    denseCrust: [142, 134, 82],
    exposedShield: [132, 128, 76],
    shelfLand: [112, 119, 73],
    bridgeLand: [128, 121, 71],
    ridgeLand: [106, 101, 67],
    coastLand: [94, 96, 66],
    cliffMass: [82, 82, 62],
    valleyLand: [82, 94, 63],
    mountainMass: [157, 150, 108],
    islandMass: [129, 126, 78],

    shallowWater: [17, 58, 76],
    saddleWater: [20, 64, 78],
    shelfWater: [16, 54, 73],
    submergedBridge: [17, 50, 64],
    deepWater: [4, 14, 29],
    basinWater: [5, 20, 32],

    shadow: [2, 7, 12],
    atmosphere: [120, 147, 137],
    fallbackLand: [126, 121, 74],
    fallbackWater: [5, 19, 35]
  };

  const MATERIAL_CLASS_BY_TERRAIN = {
    continental_core: "dense_crust",
    raised_shield: "exposed_shield_land",
    coastal_shelf: "grounded_coastal_shelf",
    exposed_bridge: "raised_landbridge",
    submerged_bridge: "submerged_shelf_bridge",
    ridge_corridor: "pressure_ridge_land",
    shallow_saddle: "shallow_saddle_water",
    basin_floor: "basin_shadow_floor",
    coast_edge: "grounded_coastline",
    cliff_candidate: "cliff_edge_mass",
    valley_candidate: "valley_shadow_land",
    mountain_candidate: "raised_relief_mass",
    island_seed: "anchored_island_mass",
    shallow_water: "shallow_shelf_water",
    deep_water: "deep_ocean_body"
  };

  const TERRAIN_CLASSES = Object.keys(MATERIAL_CLASS_BY_TERRAIN);

  const getCompositionAuthority = () => {
    try {
      if (root.HEARTH && root.HEARTH.composition) return root.HEARTH.composition;
      if (root.HEARTH_COMPOSITION) return root.HEARTH_COMPOSITION;
      if (root.HearthComposition) return root.HearthComposition;
    } catch (err) {
      return null;
    }
    return null;
  };

  const hasCompositionShape = (value) => {
    return !!(
      value &&
      typeof value === "object" &&
      (
        typeof value.terrainClass === "string" ||
        typeof value.materialClass === "string" ||
        Number.isFinite(Number(value.elevation)) ||
        Number.isFinite(Number(value.massAnchor)) ||
        Number.isFinite(Number(value.surfaceAttachment)) ||
        Number.isFinite(Number(value.materialDensity)) ||
        Number.isFinite(Number(value.shorelineContact))
      )
    );
  };

  const fallbackCompositionFromPoint = (p) => {
    const broadA = smoothstep(0.86, 0.24, Math.hypot(p.x + 0.42, p.y + 0.16, p.z - 0.76));
    const broadB = smoothstep(0.82, 0.22, Math.hypot(p.x - 0.42, p.y - 0.13, p.z - 0.78));
    const bridge = smoothstep(0.44, 0.03, Math.abs(p.x * 0.62 + p.y * 0.25));
    const landSeed = Math.max(broadA, broadB, bridge * Math.max(broadA, broadB) * 0.55);

    const elevation = clamp(-0.44 + landSeed * 0.86, -1, 1);
    const isLand = elevation > SEA_LEVEL;
    const isShallowWater = !isLand && elevation > -0.18;
    const isDeepWater = elevation <= -0.18;

    const coastPotential = clamp01(1 - Math.abs(elevation) / 0.16);
    const shelfPotential = clamp01(smoothstep(-0.24, 0.10, elevation) * (1 - smoothstep(0.18, 0.55, elevation)));
    const massAnchor = clamp01(smoothstep(-0.02, 0.28, elevation) * 0.72 + landSeed * 0.22);
    const shorelineContact = clamp01(coastPotential * 0.72 + shelfPotential * 0.22);
    const reliefStrength = clamp01(smoothstep(0.02, 0.55, elevation) * 0.48 + landSeed * 0.18);
    const slopePressure = clamp01(reliefStrength * 0.46 + shorelineContact * 0.34 + bridge * 0.12);
    const shelfDrop = clamp01(coastPotential * shelfPotential);
    const contactOcclusion = clamp01(shorelineContact * 0.48 + shelfDrop * 0.34);
    const underlandShadow = clamp01(contactOcclusion * 0.82);
    const rimCompression = clamp01(1 - Math.abs(p.z));
    const materialDensity = clamp01(massAnchor * 0.78 + reliefStrength * 0.2);
    const surfaceAttachment = clamp01(0.56 + massAnchor * 0.34 + shorelineContact * 0.08);

    let terrainClass = "deep_water";
    if (isLand && landSeed > 0.72 && elevation > 0.22) terrainClass = "continental_core";
    else if (isLand && bridge > 0.44) terrainClass = "exposed_bridge";
    else if (isLand && coastPotential > 0.52) terrainClass = "coast_edge";
    else if (isLand) terrainClass = "raised_shield";
    else if (isShallowWater && bridge > 0.4) terrainClass = "submerged_bridge";
    else if (isShallowWater) terrainClass = "shallow_water";

    return {
      contract: "HEARTH_MATERIALS_INTERNAL_SAFE_FALLBACK_COMPOSITION",
      receipt: "SAFE_FALLBACK_COMPOSITION_USED",
      authority: "composition-fallback",

      x: p.x,
      y: p.y,
      z: p.z,

      terrainClass,
      terrainClassHint: terrainClass,
      elevation,
      seaLevel: SEA_LEVEL,

      isLand,
      isWater: !isLand,
      isShallowWater,
      isDeepWater,

      landPotential: clamp01(smoothstep(-0.08, 0.26, elevation)),
      shelfPotential,
      bridgePotential: bridge,
      ridgePotential: clamp01(bridge * 0.38 + reliefStrength * 0.18),
      saddlePotential: clamp01(bridge * (isShallowWater ? 0.45 : 0.16)),
      basinPotential: clamp01(isDeepWater ? 0.26 : 0),
      islandPotential: clamp01(bridge * coastPotential * 0.32),
      coastPotential,
      waterDepthPotential: elevation < 0 ? clamp01(-elevation / 0.74) : 0,
      corePotential: landSeed,
      shieldPotential: landSeed * 0.72,

      massAnchor,
      shorelineContact,
      reliefStrength,
      slopePressure,
      shelfDrop,
      underlandShadow,
      materialDensity,
      rimCompression,
      curvatureLock: 0.86,
      contactOcclusion,
      surfaceAttachment,

      mountainCandidate: elevation > 0.48 ? 1 : 0,
      cliffCandidate: slopePressure > 0.62 ? 1 : 0,
      valleyCandidate: 0,
      coastCandidate: coastPotential > 0.52 ? 1 : 0,
      islandSeed: bridge * coastPotential > 0.38 ? 1 : 0
    };
  };

  const normalizeComposition = (raw, p) => {
    const source = raw && typeof raw === "object" ? raw : {};
    const elevation = clamp(source.elevation, -1, 1);
    const hasElevation = Number.isFinite(Number(source.elevation));
    const e = hasElevation ? elevation : -0.42;

    const terrainClass =
      typeof source.terrainClass === "string" && source.terrainClass
        ? source.terrainClass
        : typeof source.className === "string" && source.className
          ? source.className
          : e > 0.18
            ? "raised_shield"
            : e > 0
              ? "coast_edge"
              : e > -0.18
                ? "shallow_water"
                : "deep_water";

    const isLand =
      typeof source.isLand === "boolean"
        ? source.isLand
        : !!source.land || e > SEA_LEVEL;

    const isWater =
      typeof source.isWater === "boolean"
        ? source.isWater
        : !!source.water || !isLand;

    const isShallowWater =
      typeof source.isShallowWater === "boolean"
        ? source.isShallowWater
        : isWater && e > -0.18;

    const isDeepWater =
      typeof source.isDeepWater === "boolean"
        ? source.isDeepWater
        : isWater && e <= -0.18;

    return {
      contract: source.contract || "UNKNOWN_OR_NORMALIZED_COMPOSITION",
      receipt: source.receipt || "NORMALIZED_COMPOSITION_SAMPLE",

      x: Number.isFinite(Number(source.x)) ? Number(source.x) : p.x,
      y: Number.isFinite(Number(source.y)) ? Number(source.y) : p.y,
      z: Number.isFinite(Number(source.z)) ? Number(source.z) : p.z,

      terrainClass,
      terrainClassHint: source.terrainClassHint || source.hint || terrainClass,
      elevation: e,
      seaLevel: Number.isFinite(Number(source.seaLevel)) ? Number(source.seaLevel) : SEA_LEVEL,

      isLand,
      isWater,
      isShallowWater,
      isDeepWater,

      landPotential: clamp01(source.landPotential ?? (isLand ? 0.8 : 0.05)),
      shelfPotential: clamp01(source.shelfPotential),
      bridgePotential: clamp01(source.bridgePotential),
      ridgePotential: clamp01(source.ridgePotential),
      saddlePotential: clamp01(source.saddlePotential),
      basinPotential: clamp01(source.basinPotential),
      islandPotential: clamp01(source.islandPotential ?? source.islandSeed),
      coastPotential: clamp01(source.coastPotential ?? source.coastCandidate),
      waterDepthPotential: clamp01(source.waterDepthPotential),
      corePotential: clamp01(source.corePotential),
      shieldPotential: clamp01(source.shieldPotential),

      massAnchor: clamp01(source.massAnchor ?? (isLand ? 0.68 : 0.04)),
      shorelineContact: clamp01(source.shorelineContact ?? source.coastPotential),
      reliefStrength: clamp01(source.reliefStrength),
      slopePressure: clamp01(source.slopePressure),
      shelfDrop: clamp01(source.shelfDrop),
      underlandShadow: clamp01(source.underlandShadow),
      materialDensity: clamp01(source.materialDensity ?? (isLand ? 0.68 : 0.12)),
      rimCompression: clamp01(source.rimCompression),
      curvatureLock: clamp01(source.curvatureLock ?? 0.82),
      contactOcclusion: clamp01(source.contactOcclusion),
      surfaceAttachment: clamp01(source.surfaceAttachment ?? (isLand ? 0.78 : 0.46)),

      mountainCandidate: clamp01(source.mountainCandidate),
      cliffCandidate: clamp01(source.cliffCandidate),
      valleyCandidate: clamp01(source.valleyCandidate),
      coastCandidate: clamp01(source.coastCandidate ?? source.coastPotential),
      islandSeed: clamp01(source.islandSeed)
    };
  };

  const readCompositionUnsafe = (...args) => {
    const p = parsePoint(...args);

    if (args.length === 1 && hasCompositionShape(args[0])) {
      return normalizeComposition(args[0], p);
    }

    const authority = getCompositionAuthority();
    if (!authority) return fallbackCompositionFromPoint(p);

    const candidates = [
      authority.sample,
      authority.compose,
      authority.read,
      authority.get,
      authority.resolve,
      authority.classify && ((...inner) => {
        const terrainClass = authority.classify(...inner);
        return { terrainClass };
      })
    ].filter((fn) => typeof fn === "function");

    for (const fn of candidates) {
      try {
        const result = fn.apply(authority, args);
        if (result && typeof result === "object") return normalizeComposition(result, p);
      } catch (err) {
        try {
          const result = fn.call(authority, p);
          if (result && typeof result === "object") return normalizeComposition(result, p);
        } catch (err2) {
          // Continue to the next candidate.
        }
      }
    }

    return fallbackCompositionFromPoint(p);
  };

  const readComposition = (...args) => {
    try {
      return readCompositionUnsafe(...args);
    } catch (err) {
      return fallbackCompositionFromPoint(parsePoint(...args));
    }
  };

  const materialClassFor = (terrainClass) => {
    if (typeof terrainClass !== "string") return "deep_ocean_body";
    return MATERIAL_CLASS_BY_TERRAIN[terrainClass] || terrainClass || "deep_ocean_body";
  };

  const baseColorFor = (materialClass, comp) => {
    switch (materialClass) {
      case "dense_crust":
        return mixColor(PALETTE.denseCrust, PALETTE.mountainMass, comp.reliefStrength * 0.16);
      case "exposed_shield_land":
        return PALETTE.exposedShield;
      case "grounded_coastal_shelf":
        return mixColor(PALETTE.shelfLand, PALETTE.coastLand, comp.shorelineContact * 0.34);
      case "raised_landbridge":
        return mixColor(PALETTE.bridgeLand, PALETTE.ridgeLand, comp.ridgePotential * 0.24);
      case "submerged_shelf_bridge":
        return mixColor(PALETTE.submergedBridge, PALETTE.shallowWater, comp.saddlePotential * 0.3);
      case "pressure_ridge_land":
        return mixColor(PALETTE.ridgeLand, PALETTE.mountainMass, comp.reliefStrength * 0.2);
      case "shallow_saddle_water":
        return PALETTE.saddleWater;
      case "basin_shadow_floor":
        return mixColor(PALETTE.basinWater, PALETTE.valleyLand, comp.isLand ? 0.26 : 0);
      case "grounded_coastline":
        return mixColor(PALETTE.coastLand, PALETTE.shelfLand, 0.18);
      case "cliff_edge_mass":
        return mixColor(PALETTE.cliffMass, PALETTE.denseCrust, comp.reliefStrength * 0.2);
      case "valley_shadow_land":
        return mixColor(PALETTE.valleyLand, PALETTE.shadow, comp.basinPotential * 0.16);
      case "raised_relief_mass":
        return mixColor(PALETTE.mountainMass, PALETTE.denseCrust, 0.24);
      case "anchored_island_mass":
        return mixColor(PALETTE.islandMass, PALETTE.coastLand, comp.shorelineContact * 0.18);
      case "shallow_shelf_water":
        return PALETTE.shelfWater;
      case "deep_ocean_body":
      default:
        return PALETTE.deepWater;
    }
  };

  const computeFields = (comp, p, meta) => {
    const land = comp.isLand ? 1 : 0;
    const water = comp.isWater ? 1 : 0;

    const suppliedFacing =
      meta && Number.isFinite(Number(meta.viewDot))
        ? Number(meta.viewDot)
        : meta && Number.isFinite(Number(meta.cameraDot))
          ? Number(meta.cameraDot)
          : meta && Number.isFinite(Number(meta.normalDot))
            ? Number(meta.normalDot)
            : meta && Number.isFinite(Number(meta.normalFacing))
              ? Number(meta.normalFacing)
              : null;

    const limbPressure =
      suppliedFacing === null
        ? clamp01(1 - Math.abs(p.z))
        : clamp01(1 - Math.abs(suppliedFacing));

    const landDensity = clamp01(
      land * (
        0.52 +
        comp.massAnchor * 0.22 +
        comp.materialDensity * 0.18 +
        comp.surfaceAttachment * 0.12 +
        comp.reliefStrength * 0.08
      )
    );

    const shorelineGrounding = clamp01(
      comp.shorelineContact * 0.48 +
      comp.contactOcclusion * 0.32 +
      comp.shelfDrop * 0.26 +
      comp.coastPotential * 0.16
    );

    const contactShadow = clamp01(
      comp.contactOcclusion * 0.42 +
      comp.underlandShadow * 0.34 +
      shorelineGrounding * 0.24 +
      comp.rimCompression * comp.massAnchor * 0.18
    );

    const underlandOcclusion = clamp01(
      contactShadow * 0.74 +
      comp.shelfDrop * 0.22 +
      comp.shorelineContact * 0.18
    );

    const shelfTransition = clamp01(
      comp.shelfPotential * 0.42 +
      comp.shelfDrop * 0.34 +
      comp.shorelineContact * 0.24 +
      comp.waterDepthPotential * comp.shelfPotential * 0.18
    );

    const shelfShade = clamp01(
      shelfTransition * 0.48 +
      comp.waterDepthPotential * 0.22 +
      comp.saddlePotential * 0.12
    );

    const terrainRelief = clamp01(
      comp.reliefStrength * 0.48 +
      comp.slopePressure * 0.32 +
      comp.ridgePotential * 0.18 +
      comp.mountainCandidate * 0.18 +
      comp.cliffCandidate * 0.12
    );

    const slopeRelief = clamp01(
      comp.slopePressure * 0.62 +
      comp.cliffCandidate * 0.22 +
      comp.shelfDrop * 0.18
    );

    const ridgeRelief = clamp01(
      comp.ridgePotential * 0.56 +
      comp.mountainCandidate * 0.28 +
      terrainRelief * 0.18
    );

    const basinShade = clamp01(
      comp.basinPotential * 0.48 +
      comp.valleyCandidate * 0.26 +
      comp.waterDepthPotential * 0.18
    );

    const rimCompression = clamp01(
      comp.rimCompression * 0.5 +
      limbPressure * 0.38 +
      comp.curvatureLock * comp.surfaceAttachment * 0.1
    );

    const rimDarkening = clamp01(
      rimCompression * (0.34 + landDensity * 0.24 + shorelineGrounding * 0.14)
    );

    const coastCompression = clamp01(
      shorelineGrounding * 0.38 +
      rimCompression * comp.coastPotential * 0.3 +
      comp.shelfDrop * 0.22
    );

    const waterDepthShade = clamp01(
      comp.waterDepthPotential * 0.62 +
      basinShade * 0.22 +
      (comp.isDeepWater ? 0.18 : 0)
    );

    const shallowWaterMix = clamp01(
      comp.isShallowWater
        ? 0.54 + shelfTransition * 0.3
        : shelfTransition * water * 0.34
    );

    const deepWaterWeight = clamp01(
      comp.isDeepWater
        ? 0.68 + waterDepthShade * 0.24
        : comp.waterDepthPotential * 0.42
    );

    const atmosphereSeparation = clamp01(
      landDensity * 0.34 +
      comp.materialDensity * 0.22 +
      comp.surfaceAttachment * 0.18 +
      shorelineGrounding * 0.16 +
      comp.curvatureLock * 0.08
    );

    const solidSurfaceAlpha = clamp01(
      water
        ? 0.82 + deepWaterWeight * 0.12
        : 0.9 + landDensity * 0.06 + atmosphereSeparation * 0.03
    );

    return {
      landDensity,
      shorelineGrounding,
      contactShadow,
      underlandOcclusion,
      shelfShade,
      shelfTransition,
      terrainRelief,
      slopeRelief,
      ridgeRelief,
      basinShade,
      rimDarkening,
      rimCompression,
      coastCompression,
      waterDepthShade,
      shallowWaterMix,
      deepWaterWeight,
      atmosphereSeparation,
      solidSurfaceAlpha,
      alpha: solidSurfaceAlpha,
      surfaceAlpha: solidSurfaceAlpha,
      opacity: solidSurfaceAlpha
    };
  };

  const finalColorFor = (baseColor, materialClass, comp, fields) => {
    let color = baseColor.slice();

    if (comp.isLand) {
      color = shadeColor(color, fields.terrainRelief * 0.1);
      color = shadeColor(color, -fields.contactShadow * 0.22);
      color = shadeColor(color, -fields.rimDarkening * 0.2);
      color = mixColor(color, PALETTE.coastLand, fields.coastCompression * 0.2);
      color = mixColor(color, PALETTE.shadow, fields.underlandOcclusion * 0.1);

      if (
        materialClass === "raised_relief_mass" ||
        materialClass === "pressure_ridge_land" ||
        materialClass === "cliff_edge_mass"
      ) {
        color = shadeColor(color, fields.ridgeRelief * 0.07);
        color = shadeColor(color, -fields.slopeRelief * 0.09);
      }

      if (
        materialClass === "grounded_coastline" ||
        materialClass === "grounded_coastal_shelf" ||
        materialClass === "anchored_island_mass"
      ) {
        color = mixColor(color, PALETTE.shadow, fields.shorelineGrounding * 0.1);
      }
    } else {
      color = mixColor(color, PALETTE.deepWater, fields.deepWaterWeight * 0.42);
      color = mixColor(color, PALETTE.shallowWater, fields.shallowWaterMix * 0.26);
      color = shadeColor(color, -fields.rimDarkening * 0.14);

      if (
        materialClass === "submerged_shelf_bridge" ||
        materialClass === "shallow_saddle_water" ||
        materialClass === "shallow_shelf_water"
      ) {
        color = mixColor(color, PALETTE.shelfWater, fields.shelfTransition * 0.32);
      }
    }

    return color.map((v) => clamp(Math.round(v), 0, 255));
  };

  const buildMaterial = (...args) => {
    const p = parsePoint(...args);
    const meta = args.length === 1 && args[0] && typeof args[0] === "object" ? args[0] : null;

    const comp = readComposition(...args);
    const materialClass = materialClassFor(comp.materialClass || comp.terrainClass);
    const baseColor = baseColorFor(materialClass, comp);
    const fields = computeFields(comp, p, meta);
    const rgb = finalColorFor(baseColor, materialClass, comp, fields);
    const alpha = fields.solidSurfaceAlpha;
    const rgba = [rgb[0], rgb[1], rgb[2], alpha];
    const cssColor = colorToCss(rgb, alpha);
    const hex = colorToHex(rgb);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: AUTHORITY,
      status: "active",
      ready: true,
      valid: true,
      protected: true,
      finalVisualPassClaim: false,

      x: p.x,
      y: p.y,
      z: p.z,

      terrainClass: comp.terrainClass,
      terrainClassHint: comp.terrainClassHint,
      materialClass,
      className: materialClass,
      type: materialClass,

      elevation: comp.elevation,
      seaLevel: comp.seaLevel,

      isLand: comp.isLand,
      isWater: comp.isWater,
      isShallowWater: comp.isShallowWater,
      isDeepWater: comp.isDeepWater,
      land: comp.isLand,
      water: comp.isWater,
      shallow: comp.isShallowWater,
      deep: comp.isDeepWater,

      landPotential: comp.landPotential,
      shelfPotential: comp.shelfPotential,
      bridgePotential: comp.bridgePotential,
      ridgePotential: comp.ridgePotential,
      saddlePotential: comp.saddlePotential,
      basinPotential: comp.basinPotential,
      islandPotential: comp.islandPotential,
      coastPotential: comp.coastPotential,
      waterDepthPotential: comp.waterDepthPotential,

      massAnchor: comp.massAnchor,
      materialDensity: comp.materialDensity,
      surfaceAttachment: comp.surfaceAttachment,
      curvatureLock: comp.curvatureLock,

      landDensity: fields.landDensity,
      shorelineGrounding: fields.shorelineGrounding,
      contactShadow: fields.contactShadow,
      underlandOcclusion: fields.underlandOcclusion,
      shelfShade: fields.shelfShade,
      shelfTransition: fields.shelfTransition,

      terrainRelief: fields.terrainRelief,
      slopeRelief: fields.slopeRelief,
      ridgeRelief: fields.ridgeRelief,
      basinShade: fields.basinShade,

      rimDarkening: fields.rimDarkening,
      rimCompression: fields.rimCompression,
      coastCompression: fields.coastCompression,

      waterDepthShade: fields.waterDepthShade,
      shallowWaterMix: fields.shallowWaterMix,
      deepWaterWeight: fields.deepWaterWeight,

      atmosphereSeparation: fields.atmosphereSeparation,
      solidSurfaceAlpha: alpha,
      surfaceAlpha: alpha,
      alpha,
      opacity: alpha,
      a: alpha,

      baseColor,
      finalColorHint: rgb,
      color: rgb,
      rgb,
      rgba,
      r: rgb[0],
      g: rgb[1],
      b: rgb[2],

      cssColor,
      colorCss: cssColor,
      css: cssColor,
      fillStyle: cssColor,
      strokeStyle: cssColor,
      style: cssColor,
      hex,

      landColor: comp.isLand ? rgb : null,
      waterColor: comp.isWater ? rgb : null,

      compositionReceipt: comp.receipt,
      compositionContract: comp.contract,

      visualInstruction: comp.isLand
        ? "draw-as-attached-solid-planetary-crust"
        : comp.isShallowWater
          ? "draw-as-grounded-shallow-shelf-water"
          : "draw-as-deep-ocean-body"
    };
  };

  const safeMaterial = (...args) => {
    try {
      return buildMaterial(...args);
    } catch (err) {
      const p = parsePoint(...args);
      const comp = fallbackCompositionFromPoint(p);
      const materialClass = materialClassFor(comp.terrainClass);
      const baseColor = baseColorFor(materialClass, comp);
      const fields = computeFields(comp, p, null);
      const rgb = finalColorFor(baseColor, materialClass, comp, fields);
      const alpha = fields.solidSurfaceAlpha;
      const cssColor = colorToCss(rgb, alpha);

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        authority: AUTHORITY,
        status: "active",
        ready: true,
        valid: true,
        protected: true,
        fallbackProtected: true,
        finalVisualPassClaim: false,

        x: p.x,
        y: p.y,
        z: p.z,

        terrainClass: comp.terrainClass,
        materialClass,
        className: materialClass,
        type: materialClass,

        elevation: comp.elevation,
        isLand: comp.isLand,
        isWater: comp.isWater,
        isShallowWater: comp.isShallowWater,
        isDeepWater: comp.isDeepWater,

        land: comp.isLand,
        water: comp.isWater,

        color: rgb,
        rgb,
        rgba: [rgb[0], rgb[1], rgb[2], alpha],
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
        a: alpha,

        alpha,
        surfaceAlpha: alpha,
        solidSurfaceAlpha: alpha,
        opacity: alpha,

        cssColor,
        colorCss: cssColor,
        css: cssColor,
        fillStyle: cssColor,
        style: cssColor,
        hex: colorToHex(rgb),

        baseColor,
        finalColorHint: rgb,

        landDensity: fields.landDensity,
        shorelineGrounding: fields.shorelineGrounding,
        contactShadow: fields.contactShadow,
        underlandOcclusion: fields.underlandOcclusion,
        shelfTransition: fields.shelfTransition,
        terrainRelief: fields.terrainRelief,
        rimDarkening: fields.rimDarkening,
        atmosphereSeparation: fields.atmosphereSeparation,

        compositionReceipt: comp.receipt,
        compositionContract: comp.contract
      };
    }
  };

  const sample = (...args) => safeMaterial(...args);
  const read = (...args) => safeMaterial(...args);
  const get = (...args) => safeMaterial(...args);
  const materialize = (...args) => safeMaterial(...args);
  const getMaterial = (...args) => safeMaterial(...args);
  const sampleMaterial = (...args) => safeMaterial(...args);
  const readMaterial = (...args) => safeMaterial(...args);
  const materialAt = (...args) => safeMaterial(...args);
  const getMaterialAt = (...args) => safeMaterial(...args);
  const getSurfaceMaterial = (...args) => safeMaterial(...args);
  const resolve = (...args) => safeMaterial(...args);
  const resolveMaterial = (...args) => safeMaterial(...args);
  const getPixelMaterial = (...args) => safeMaterial(...args);
  const surfaceAt = (...args) => safeMaterial(...args);

  const classify = (...args) => safeMaterial(...args).materialClass;
  const getColor = (...args) => safeMaterial(...args).rgb;
  const getRGB = (...args) => safeMaterial(...args).rgb;
  const getRGBA = (...args) => safeMaterial(...args).rgba;
  const getCssColor = (...args) => safeMaterial(...args).cssColor;
  const getFillStyle = (...args) => safeMaterial(...args).fillStyle;

  const getReceipt = () => ({
    contract: CONTRACT,
    receipt: RECEIPT,
    authority: AUTHORITY,
    status: "active",
    ready: true,
    valid: true,
    protected: true,
    purpose: "material-authority-compatibility-rescue",
    sourceAuthority: "hearth.composition.js when available; internal safe fallback when unavailable",
    requiredUpstream: [],
    optionalUpstream: [
      "hearth.composition.js",
      "hearth.elevation.js"
    ],
    preparedDownstream: [
      "hearth.canvas.js",
      "hearth.climate.route.js",
      "v21 parent-chain carrier"
    ],
    aliases: [
      "sample",
      "read",
      "get",
      "materialize",
      "getMaterial",
      "sampleMaterial",
      "readMaterial",
      "materialAt",
      "getMaterialAt",
      "getSurfaceMaterial",
      "resolve",
      "resolveMaterial",
      "getPixelMaterial",
      "surfaceAt",
      "classify",
      "getColor",
      "getRGB",
      "getRGBA",
      "getCssColor",
      "getFillStyle"
    ],
    exposedFields: [
      "terrainClass",
      "materialClass",
      "elevation",
      "isLand",
      "isWater",
      "color",
      "rgb",
      "rgba",
      "cssColor",
      "alpha",
      "surfaceAlpha",
      "solidSurfaceAlpha",
      "opacity",
      "baseColor",
      "finalColorHint",
      "landDensity",
      "shorelineGrounding",
      "contactShadow",
      "underlandOcclusion",
      "shelfTransition",
      "terrainRelief",
      "rimDarkening",
      "atmosphereSeparation"
    ],
    materialClasses: Object.values(MATERIAL_CLASS_BY_TERRAIN),
    terrainClasses: TERRAIN_CLASSES,
    finalVisualPassClaim: false,
    forbiddenOwnership: [
      "elevation-generation",
      "terrain-classification",
      "canvas-drawing",
      "runtime-motion",
      "controls",
      "route-ui",
      "final-visual-pass-claim"
    ]
  });

  const api = {
    CONTRACT,
    RECEIPT,
    AUTHORITY,
    SEA_LEVEL,

    status: "active",
    ready: true,
    valid: true,
    protected: true,

    sample,
    read,
    get,
    materialize,
    getMaterial,
    sampleMaterial,
    readMaterial,
    materialAt,
    getMaterialAt,
    getSurfaceMaterial,
    resolve,
    resolveMaterial,
    getPixelMaterial,
    surfaceAt,

    classify,
    getColor,
    getRGB,
    getRGBA,
    getCssColor,
    getFillStyle,

    getReceipt,

    materialClassFor,
    materialClassMap: { ...MATERIAL_CLASS_BY_TERRAIN },
    terrainClasses: TERRAIN_CLASSES.slice(),
    materialClasses: Object.values(MATERIAL_CLASS_BY_TERRAIN),

    palette: { ...PALETTE },

    finalVisualPassClaim: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.materials = api;

  root.HEARTH_MATERIALS = api;
  root.HearthMaterials = api;
  root.HEARTH_MATERIAL_AUTHORITY = api;
  root.HearthMaterialAuthority = api;

  root.HEARTH_MATERIALS_RECEIPT = getReceipt();
  root.HEARTH_MATERIAL_AUTHORITY_RECEIPT = getReceipt();
  root.HEARTH_MATERIALS_CONTRACT = CONTRACT;
  root.HEARTH_MATERIALS_STATUS = "active";

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
