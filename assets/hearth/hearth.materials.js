// /assets/hearth/hearth.materials.js
// HEARTH_SURFACE_MASS_ANCHORING_MATERIALS_TNT_v1
// Full-file replacement.
// Materials authority only.
// Purpose:
// - Consume Hearth composition authority.
// - Convert terrain composition fields into dense, grounded, curvature-locked planetary materials.
// - Reduce floating decal / cloud-mask behavior by adding material density, shoreline grounding,
//   contact shadow, shelf transition, relief response, rim compression, and atmosphere separation.
// Does not own:
// - elevation generation
// - terrain classification
// - landmass shape generation
// - canvas drawing
// - runtime motion
// - controls
// - route UI
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SURFACE_MASS_ANCHORING_MATERIALS_TNT_v1";
  const RECEIPT = "HEARTH_MATERIALS_ACTIVE_SURFACE_MASS_ANCHORING_v1";
  const SEA_LEVEL = 0.0;
  const DEG = Math.PI / 180;

  const root = typeof window !== "undefined" ? window : globalThis;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, Number.isFinite(v) ? v : a));
  const clamp01 = (v) => clamp(v, 0, 1);
  const mix = (a, b, t) => a + (b - a) * clamp01(t);
  const mixColor = (a, b, t) => [
    Math.round(mix(a[0], b[0], t)),
    Math.round(mix(a[1], b[1], t)),
    Math.round(mix(a[2], b[2], t))
  ];

  const smoothstep = (edge0, edge1, x) => {
    const d = edge1 - edge0 || 1;
    const t = clamp01((x - edge0) / d);
    return t * t * (3 - 2 * t);
  };

  const normalize3 = (p) => {
    const x = Number.isFinite(p && p.x) ? p.x : 0;
    const y = Number.isFinite(p && p.y) ? p.y : 0;
    const z = Number.isFinite(p && p.z) ? p.z : 1;
    const m = Math.hypot(x, y, z) || 1;
    return { x: x / m, y: y / m, z: z / m };
  };

  const lonLatToVector = (lonDeg, latDeg) => {
    const lon = lonDeg * DEG;
    const lat = latDeg * DEG;
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
        Number.isFinite(p.x) &&
        Number.isFinite(p.y) &&
        Number.isFinite(p.z)
      ) {
        return normalize3(p);
      }

      if (Number.isFinite(p.lon) && Number.isFinite(p.lat)) {
        return lonLatToVector(p.lon, p.lat);
      }

      if (Number.isFinite(p.longitude) && Number.isFinite(p.latitude)) {
        return lonLatToVector(p.longitude, p.latitude);
      }

      if (Number.isFinite(p.u) && Number.isFinite(p.v)) {
        return lonLatToVector(mix(-180, 180, p.u), mix(-90, 90, p.v));
      }
    }

    if (args.length >= 3) {
      return normalize3({ x: args[0], y: args[1], z: args[2] });
    }

    if (args.length >= 2) {
      return lonLatToVector(args[0], args[1]);
    }

    return lonLatToVector(0, 0);
  };

  const colorToCss = (rgb, alpha = 1) => {
    const r = clamp(Math.round(rgb[0]), 0, 255);
    const g = clamp(Math.round(rgb[1]), 0, 255);
    const b = clamp(Math.round(rgb[2]), 0, 255);
    const a = clamp(alpha, 0, 1);
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
  };

  const shadeColor = (rgb, amount) => {
    const a = clamp(amount, -1, 1);
    if (a >= 0) {
      return mixColor(rgb, [255, 245, 210], a);
    }
    return mixColor(rgb, [4, 10, 18], Math.abs(a));
  };

  const PALETTE = {
    denseCrust: [150, 139, 78],
    exposedShield: [138, 132, 73],
    shelfLand: [122, 127, 73],
    bridgeLand: [132, 124, 68],
    ridgeLand: [116, 111, 66],
    coastline: [100, 101, 64],
    cliffMass: [89, 86, 61],
    valleyLand: [88, 96, 62],
    mountainMass: [160, 151, 104],
    islandMass: [135, 131, 78],

    shallowWater: [13, 50, 67],
    saddleWater: [19, 63, 75],
    shelfWater: [15, 59, 76],
    submergedBridge: [18, 55, 67],
    deepWater: [3, 15, 31],
    basinWater: [5, 21, 33],

    shadow: [2, 7, 12],
    atmosphere: [122, 150, 136],
    receiptGold: [210, 176, 96]
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

  const getCompositionAuthority = () => {
    if (root.HEARTH && root.HEARTH.composition) return root.HEARTH.composition;
    if (root.HEARTH_COMPOSITION) return root.HEARTH_COMPOSITION;
    if (root.HearthComposition) return root.HearthComposition;
    return null;
  };

  const hasCompositionShape = (v) => {
    return !!(
      v &&
      typeof v === "object" &&
      (
        typeof v.terrainClass === "string" ||
        Number.isFinite(v.massAnchor) ||
        Number.isFinite(v.surfaceAttachment) ||
        Number.isFinite(v.materialDensity) ||
        Number.isFinite(v.shorelineContact)
      )
    );
  };

  const normalizeCompositionSample = (raw, p) => {
    const elevation = Number.isFinite(raw && raw.elevation) ? raw.elevation : -0.42;
    const terrainClass =
      raw && typeof raw.terrainClass === "string"
        ? raw.terrainClass
        : elevation > SEA_LEVEL
          ? "raised_shield"
          : elevation > -0.18
            ? "shallow_water"
            : "deep_water";

    return {
      contract: raw && raw.contract ? raw.contract : "UNKNOWN_OR_FALLBACK_COMPOSITION",
      receipt: raw && raw.receipt ? raw.receipt : "FALLBACK_COMPOSITION_SAMPLE",

      x: Number.isFinite(raw && raw.x) ? raw.x : p.x,
      y: Number.isFinite(raw && raw.y) ? raw.y : p.y,
      z: Number.isFinite(raw && raw.z) ? raw.z : p.z,

      elevation,
      seaLevel: Number.isFinite(raw && raw.seaLevel) ? raw.seaLevel : SEA_LEVEL,

      terrainClass,
      terrainClassHint:
        raw && typeof raw.terrainClassHint === "string"
          ? raw.terrainClassHint
          : terrainClass,

      isLand:
        typeof (raw && raw.isLand) === "boolean"
          ? raw.isLand
          : elevation > SEA_LEVEL,

      isWater:
        typeof (raw && raw.isWater) === "boolean"
          ? raw.isWater
          : elevation <= SEA_LEVEL,

      isShallowWater:
        typeof (raw && raw.isShallowWater) === "boolean"
          ? raw.isShallowWater
          : elevation <= SEA_LEVEL && elevation > -0.18,

      isDeepWater:
        typeof (raw && raw.isDeepWater) === "boolean"
          ? raw.isDeepWater
          : elevation <= -0.18,

      landPotential: clamp01(raw && raw.landPotential),
      shelfPotential: clamp01(raw && raw.shelfPotential),
      bridgePotential: clamp01(raw && raw.bridgePotential),
      ridgePotential: clamp01(raw && raw.ridgePotential),
      saddlePotential: clamp01(raw && raw.saddlePotential),
      basinPotential: clamp01(raw && raw.basinPotential),
      islandPotential: clamp01(raw && raw.islandPotential),
      coastPotential: clamp01(raw && raw.coastPotential),
      waterDepthPotential: clamp01(raw && raw.waterDepthPotential),
      corePotential: clamp01(raw && raw.corePotential),
      shieldPotential: clamp01(raw && raw.shieldPotential),

      massAnchor: clamp01(raw && raw.massAnchor),
      shorelineContact: clamp01(raw && raw.shorelineContact),
      reliefStrength: clamp01(raw && raw.reliefStrength),
      slopePressure: clamp01(raw && raw.slopePressure),
      shelfDrop: clamp01(raw && raw.shelfDrop),
      underlandShadow: clamp01(raw && raw.underlandShadow),
      materialDensity: clamp01(raw && raw.materialDensity),
      rimCompression: clamp01(raw && raw.rimCompression),
      curvatureLock: clamp01(raw && raw.curvatureLock),
      contactOcclusion: clamp01(raw && raw.contactOcclusion),
      surfaceAttachment: clamp01(raw && raw.surfaceAttachment),

      mountainCandidate: clamp01(raw && raw.mountainCandidate),
      cliffCandidate: clamp01(raw && raw.cliffCandidate),
      valleyCandidate: clamp01(raw && raw.valleyCandidate),
      coastCandidate: clamp01(raw && raw.coastCandidate),
      islandSeed: clamp01(raw && raw.islandSeed)
    };
  };

  const fallbackCompositionSample = (p) => {
    const landSeedA = smoothstep(0.88, 0.24, Math.hypot(p.x + 0.44, p.y + 0.16, p.z - 0.78));
    const landSeedB = smoothstep(0.82, 0.22, Math.hypot(p.x - 0.42, p.y - 0.13, p.z - 0.80));
    const landSeed = Math.max(landSeedA, landSeedB);
    const elevation = clamp(-0.42 + landSeed * 0.78, -1, 1);
    const coastPotential = clamp01(1 - Math.abs(elevation) / 0.16);
    const shelfPotential = smoothstep(-0.22, 0.12, elevation) * (1 - smoothstep(0.18, 0.54, elevation));
    const massAnchor = clamp01(smoothstep(-0.02, 0.24, elevation) * 0.74 + landSeed * 0.2);
    const shorelineContact = clamp01(coastPotential * 0.75 + shelfPotential * 0.22);
    const reliefStrength = clamp01(smoothstep(0.04, 0.5, elevation) * 0.5 + landSeed * 0.2);
    const shelfDrop = clamp01(coastPotential * shelfPotential);
    const contactOcclusion = clamp01(shorelineContact * 0.5 + shelfDrop * 0.35);
    const underlandShadow = clamp01(contactOcclusion * 0.8);

    return normalizeCompositionSample(
      {
        contract: "HEARTH_MATERIALS_FALLBACK_COMPOSITION_ONLY",
        receipt: "FALLBACK_USED_COMPOSITION_AUTHORITY_NOT_FOUND",
        x: p.x,
        y: p.y,
        z: p.z,
        elevation,
        terrainClass: elevation > 0.18 ? "raised_shield" : elevation > 0 ? "coast_edge" : elevation > -0.18 ? "shallow_water" : "deep_water",
        isLand: elevation > 0,
        isWater: elevation <= 0,
        isShallowWater: elevation <= 0 && elevation > -0.18,
        isDeepWater: elevation <= -0.18,
        landPotential: smoothstep(-0.08, 0.25, elevation),
        shelfPotential,
        coastPotential,
        waterDepthPotential: elevation < 0 ? clamp01(-elevation / 0.72) : 0,
        corePotential: landSeed,
        shieldPotential: landSeed * 0.7,
        massAnchor,
        shorelineContact,
        reliefStrength,
        slopePressure: clamp01(reliefStrength * 0.6 + shelfDrop * 0.4),
        shelfDrop,
        underlandShadow,
        materialDensity: clamp01(massAnchor * 0.8 + reliefStrength * 0.2),
        rimCompression: clamp01(1 - Math.abs(p.z)),
        curvatureLock: 0.82,
        contactOcclusion,
        surfaceAttachment: clamp01(0.55 + massAnchor * 0.35)
      },
      p
    );
  };

  const readComposition = (...args) => {
    const p = parseInput(...args);

    if (args.length === 1 && hasCompositionShape(args[0])) {
      return normalizeCompositionSample(args[0], p);
    }

    const authority = getCompositionAuthority();

    if (authority) {
      const fn =
        typeof authority.sample === "function"
          ? authority.sample
          : typeof authority.compose === "function"
            ? authority.compose
            : typeof authority.read === "function"
              ? authority.read
              : null;

      if (fn) {
        try {
          return normalizeCompositionSample(fn.apply(authority, args), p);
        } catch (err) {
          try {
            return normalizeCompositionSample(fn.call(authority, p), p);
          } catch (err2) {
            return fallbackCompositionSample(p);
          }
        }
      }
    }

    return fallbackCompositionSample(p);
  };

  const materialClassFor = (terrainClass) => {
    return MATERIAL_CLASS_BY_TERRAIN[terrainClass] || "deep_ocean_body";
  };

  const baseColorFor = (materialClass, comp) => {
    switch (materialClass) {
      case "dense_crust":
        return mixColor(PALETTE.denseCrust, PALETTE.mountainMass, comp.reliefStrength * 0.18);
      case "exposed_shield_land":
        return PALETTE.exposedShield;
      case "grounded_coastal_shelf":
        return mixColor(PALETTE.shelfLand, PALETTE.coastline, comp.shorelineContact * 0.36);
      case "raised_landbridge":
        return mixColor(PALETTE.bridgeLand, PALETTE.ridgeLand, comp.ridgePotential * 0.26);
      case "submerged_shelf_bridge":
        return mixColor(PALETTE.submergedBridge, PALETTE.shallowWater, comp.saddlePotential * 0.34);
      case "pressure_ridge_land":
        return mixColor(PALETTE.ridgeLand, PALETTE.mountainMass, comp.reliefStrength * 0.22);
      case "shallow_saddle_water":
        return PALETTE.saddleWater;
      case "basin_shadow_floor":
        return mixColor(PALETTE.basinWater, PALETTE.valleyLand, comp.isLand ? 0.28 : 0);
      case "grounded_coastline":
        return mixColor(PALETTE.coastline, PALETTE.shelfLand, 0.22);
      case "cliff_edge_mass":
        return mixColor(PALETTE.cliffMass, PALETTE.denseCrust, comp.reliefStrength * 0.22);
      case "valley_shadow_land":
        return mixColor(PALETTE.valleyLand, PALETTE.shadow, comp.basinPotential * 0.18);
      case "raised_relief_mass":
        return mixColor(PALETTE.mountainMass, PALETTE.denseCrust, 0.28);
      case "anchored_island_mass":
        return mixColor(PALETTE.islandMass, PALETTE.coastline, comp.shorelineContact * 0.2);
      case "shallow_shelf_water":
        return PALETTE.shelfWater;
      case "deep_ocean_body":
      default:
        return PALETTE.deepWater;
    }
  };

  const computeMaterialFields = (comp, p, inputMeta) => {
    const land = comp.isLand ? 1 : 0;
    const water = comp.isWater ? 1 : 0;

    const landDensity = clamp01(
      land * (
        0.48 +
        comp.massAnchor * 0.24 +
        comp.materialDensity * 0.2 +
        comp.surfaceAttachment * 0.12 +
        comp.reliefStrength * 0.08
      )
    );

    const shorelineGrounding = clamp01(
      comp.shorelineContact * 0.48 +
      comp.contactOcclusion * 0.32 +
      comp.shelfDrop * 0.28 +
      comp.coastPotential * 0.18
    );

    const contactShadow = clamp01(
      comp.contactOcclusion * 0.44 +
      comp.underlandShadow * 0.34 +
      shorelineGrounding * 0.24 +
      comp.rimCompression * comp.massAnchor * 0.18
    );

    const underlandOcclusion = clamp01(
      contactShadow * 0.72 +
      comp.shelfDrop * 0.24 +
      comp.shorelineContact * 0.18
    );

    const shelfTransition = clamp01(
      comp.shelfPotential * 0.42 +
      comp.shelfDrop * 0.36 +
      comp.shorelineContact * 0.24 +
      comp.waterDepthPotential * comp.shelfPotential * 0.2
    );

    const shelfShade = clamp01(
      shelfTransition * 0.5 +
      comp.waterDepthPotential * 0.22 +
      comp.saddlePotential * 0.14
    );

    const terrainRelief = clamp01(
      comp.reliefStrength * 0.48 +
      comp.slopePressure * 0.34 +
      comp.ridgePotential * 0.18 +
      comp.mountainCandidate * 0.18 +
      comp.cliffCandidate * 0.12
    );

    const slopeRelief = clamp01(
      comp.slopePressure * 0.64 +
      comp.cliffCandidate * 0.22 +
      comp.shelfDrop * 0.18
    );

    const ridgeRelief = clamp01(
      comp.ridgePotential * 0.58 +
      comp.mountainCandidate * 0.28 +
      terrainRelief * 0.2
    );

    const basinShade = clamp01(
      comp.basinPotential * 0.48 +
      comp.valleyCandidate * 0.26 +
      comp.waterDepthPotential * 0.18
    );

    const suppliedFacing =
      inputMeta && Number.isFinite(inputMeta.viewDot)
        ? inputMeta.viewDot
        : inputMeta && Number.isFinite(inputMeta.cameraDot)
          ? inputMeta.cameraDot
          : inputMeta && Number.isFinite(inputMeta.normalDot)
            ? inputMeta.normalDot
            : inputMeta && Number.isFinite(inputMeta.normalFacing)
              ? inputMeta.normalFacing
              : null;

    const limbPressure =
      suppliedFacing === null
        ? clamp01(1 - Math.abs(p.z))
        : clamp01(1 - Math.abs(suppliedFacing));

    const rimCompression = clamp01(
      comp.rimCompression * 0.55 +
      limbPressure * 0.36 +
      comp.curvatureLock * comp.surfaceAttachment * 0.1
    );

    const rimDarkening = clamp01(
      rimCompression * (0.34 + landDensity * 0.26 + shorelineGrounding * 0.16)
    );

    const coastCompression = clamp01(
      shorelineGrounding * 0.38 +
      rimCompression * comp.coastPotential * 0.32 +
      comp.shelfDrop * 0.24
    );

    const waterDepthShade = clamp01(
      comp.waterDepthPotential * 0.62 +
      basinShade * 0.22 +
      (comp.isDeepWater ? 0.18 : 0)
    );

    const shallowWaterMix = clamp01(
      comp.isShallowWater ? 0.55 + shelfTransition * 0.32 : shelfTransition * water * 0.38
    );

    const deepWaterWeight = clamp01(
      comp.isDeepWater ? 0.68 + waterDepthShade * 0.26 : comp.waterDepthPotential * 0.42
    );

    const atmosphereSeparation = clamp01(
      landDensity * 0.34 +
      comp.materialDensity * 0.22 +
      comp.surfaceAttachment * 0.18 +
      shorelineGrounding * 0.16 +
      comp.curvatureLock * 0.1
    );

    const solidSurfaceAlpha = clamp01(
      water
        ? 0.82 + deepWaterWeight * 0.12
        : 0.88 +
          landDensity * 0.08 +
          atmosphereSeparation * 0.04
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
      solidSurfaceAlpha
    };
  };

  const computeFinalColor = (baseColor, materialClass, comp, fields) => {
    let color = baseColor.slice();

    if (comp.isLand) {
      color = shadeColor(color, fields.terrainRelief * 0.12);
      color = shadeColor(color, -fields.contactShadow * 0.22);
      color = shadeColor(color, -fields.rimDarkening * 0.2);
      color = mixColor(color, PALETTE.coastline, fields.coastCompression * 0.22);
      color = mixColor(color, PALETTE.shadow, fields.underlandOcclusion * 0.12);

      if (
        materialClass === "raised_relief_mass" ||
        materialClass === "pressure_ridge_land" ||
        materialClass === "cliff_edge_mass"
      ) {
        color = shadeColor(color, fields.ridgeRelief * 0.08);
        color = shadeColor(color, -fields.slopeRelief * 0.1);
      }

      if (
        materialClass === "grounded_coastline" ||
        materialClass === "grounded_coastal_shelf" ||
        materialClass === "anchored_island_mass"
      ) {
        color = mixColor(color, PALETTE.shadow, fields.shorelineGrounding * 0.12);
      }
    } else {
      color = mixColor(color, PALETTE.deepWater, fields.deepWaterWeight * 0.42);
      color = mixColor(color, PALETTE.shallowWater, fields.shallowWaterMix * 0.28);
      color = shadeColor(color, -fields.rimDarkening * 0.14);

      if (
        materialClass === "submerged_shelf_bridge" ||
        materialClass === "shallow_saddle_water" ||
        materialClass === "shallow_shelf_water"
      ) {
        color = mixColor(color, PALETTE.shelfWater, fields.shelfTransition * 0.34);
      }
    }

    return color.map((v) => clamp(Math.round(v), 0, 255));
  };

  const sample = (...args) => {
    const p = parseInput(...args);
    const inputMeta =
      args.length === 1 && args[0] && typeof args[0] === "object"
        ? args[0]
        : null;

    const comp = readComposition(...args);
    const materialClass = materialClassFor(comp.terrainClass);
    const baseColor = baseColorFor(materialClass, comp);
    const fields = computeMaterialFields(comp, p, inputMeta);
    const finalColorHint = computeFinalColor(baseColor, materialClass, comp, fields);

    const material = {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "materials",
      sourceAuthority: "hearth.composition.js",

      x: p.x,
      y: p.y,
      z: p.z,

      terrainClass: comp.terrainClass,
      terrainClassHint: comp.terrainClassHint,
      materialClass,

      elevation: comp.elevation,
      seaLevel: comp.seaLevel,
      isLand: comp.isLand,
      isWater: comp.isWater,
      isShallowWater: comp.isShallowWater,
      isDeepWater: comp.isDeepWater,

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
      solidSurfaceAlpha: fields.solidSurfaceAlpha,

      baseColor,
      finalColorHint,
      color: finalColorHint,
      rgb: finalColorHint,
      rgba: [
        finalColorHint[0],
        finalColorHint[1],
        finalColorHint[2],
        fields.solidSurfaceAlpha
      ],
      cssColor: colorToCss(finalColorHint, fields.solidSurfaceAlpha),

      compositionReceipt: comp.receipt,
      compositionContract: comp.contract,

      visualInstruction: comp.isLand
        ? "draw-as-attached-solid-planetary-crust"
        : comp.isShallowWater
          ? "draw-as-grounded-shallow-shelf-water"
          : "draw-as-deep-ocean-body",

      finalVisualPassClaim: false
    };

    return material;
  };

  const read = (...args) => sample(...args);
  const materialize = (...args) => sample(...args);
  const getMaterial = (...args) => sample(...args);
  const sampleMaterial = (...args) => sample(...args);
  const readMaterial = (...args) => sample(...args);
  const getColor = (...args) => sample(...args).finalColorHint;
  const getRGBA = (...args) => sample(...args).rgba;
  const getCssColor = (...args) => sample(...args).cssColor;

  const classify = (...args) => sample(...args).materialClass;

  const getReceipt = () => ({
    contract: CONTRACT,
    receipt: RECEIPT,
    authority: "materials",
    status: "active",
    sourceAuthority: "hearth.composition.js",
    purpose: "surface-mass-anchoring-material-expression",
    requiredUpstream: [
      "hearth.composition.js",
      "hearth.elevation.js"
    ],
    preparedDownstream: [
      "hearth.canvas.js",
      "hearth.climate.route.js"
    ],
    exposedFields: [
      "materialClass",
      "landDensity",
      "shorelineGrounding",
      "contactShadow",
      "underlandOcclusion",
      "shelfShade",
      "shelfTransition",
      "terrainRelief",
      "slopeRelief",
      "ridgeRelief",
      "basinShade",
      "rimDarkening",
      "rimCompression",
      "coastCompression",
      "waterDepthShade",
      "shallowWaterMix",
      "deepWaterWeight",
      "atmosphereSeparation",
      "solidSurfaceAlpha",
      "baseColor",
      "finalColorHint"
    ],
    materialClasses: Object.values(MATERIAL_CLASS_BY_TERRAIN),
    forbiddenOwnership: [
      "elevation-generation",
      "terrain-classification",
      "landmass-shape-generation",
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
    SEA_LEVEL,

    sample,
    read,
    materialize,
    getMaterial,
    sampleMaterial,
    readMaterial,

    getColor,
    getRGBA,
    getCssColor,
    classify,

    getReceipt,

    materialClassFor,
    materialClassMap: { ...MATERIAL_CLASS_BY_TERRAIN },

    palette: { ...PALETTE }
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.materials = api;
  root.HEARTH_MATERIALS = api;
  root.HearthMaterials = api;
  root.HEARTH_MATERIALS_RECEIPT = getReceipt();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
