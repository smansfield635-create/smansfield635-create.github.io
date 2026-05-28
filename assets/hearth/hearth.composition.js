// /assets/hearth/hearth.composition.js
// HEARTH_SURFACE_MASS_ANCHORING_COMPOSITION_TNT_v1
// Full-file replacement.
// Composition authority only.
// Purpose:
// - Consume Hearth elevation authority.
// - Convert elevation fields into solid terrain composition.
// - Stop land from reading as floating cloud/mask by publishing mass anchoring fields.
// - Prepare hearth.materials.js to render dense, grounded, three-dimensional landmasses.
// Does not own:
// - colors
// - final material palette
// - canvas drawing
// - runtime motion
// - controls
// - route UI
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SURFACE_MASS_ANCHORING_COMPOSITION_TNT_v1";
  const RECEIPT = "HEARTH_COMPOSITION_ACTIVE_SURFACE_MASS_ANCHORING_v1";
  const SEA_LEVEL = 0.0;
  const DEG = Math.PI / 180;

  const root = typeof window !== "undefined" ? window : globalThis;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, Number.isFinite(v) ? v : a));
  const clamp01 = (v) => clamp(v, 0, 1);
  const mix = (a, b, t) => a + (b - a) * clamp01(t);

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

  const getElevationAuthority = () => {
    if (root.HEARTH && root.HEARTH.elevation) return root.HEARTH.elevation;
    if (root.HEARTH_ELEVATION) return root.HEARTH_ELEVATION;
    if (root.HearthElevation) return root.HearthElevation;
    return null;
  };

  const hasElevationShape = (v) => {
    return !!(
      v &&
      typeof v === "object" &&
      (
        Number.isFinite(v.elevation) ||
        Number.isFinite(v.landPotential) ||
        Number.isFinite(v.bridgePotential) ||
        typeof v.terrainClassHint === "string"
      )
    );
  };

  const normalizeElevationSample = (raw, p) => {
    const e = Number.isFinite(raw && raw.elevation) ? raw.elevation : -0.42;

    return {
      contract: raw && raw.contract ? raw.contract : "UNKNOWN_OR_FALLBACK_ELEVATION",
      receipt: raw && raw.receipt ? raw.receipt : "FALLBACK_ELEVATION_SAMPLE",

      x: Number.isFinite(raw && raw.x) ? raw.x : p.x,
      y: Number.isFinite(raw && raw.y) ? raw.y : p.y,
      z: Number.isFinite(raw && raw.z) ? raw.z : p.z,

      elevation: clamp(e, -1, 1),
      seaLevel: Number.isFinite(raw && raw.seaLevel) ? raw.seaLevel : SEA_LEVEL,

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

      terrainClassHint:
        raw && typeof raw.terrainClassHint === "string"
          ? raw.terrainClassHint
          : "deep_ocean",

      isLand:
        typeof (raw && raw.isLand) === "boolean"
          ? raw.isLand
          : e > SEA_LEVEL,

      isShallowWater:
        typeof (raw && raw.isShallowWater) === "boolean"
          ? raw.isShallowWater
          : e <= SEA_LEVEL && e > -0.16,

      isDeepWater:
        typeof (raw && raw.isDeepWater) === "boolean"
          ? raw.isDeepWater
          : e <= -0.16,

      dominantCoreId: raw && raw.dominantCoreId ? raw.dominantCoreId : null
    };
  };

  const fallbackElevationSample = (p) => {
    const lowerBlob =
      smoothstep(0.82, 0.2, Math.hypot(p.x + 0.42, p.y + 0.18, p.z - 0.78));

    const upperBlob =
      smoothstep(0.76, 0.2, Math.hypot(p.x - 0.42, p.y - 0.12, p.z - 0.80));

    const bridge = smoothstep(0.36, 0.02, Math.abs(p.x * 0.62 + p.y * 0.28));

    const elevation = clamp(
      -0.42 +
      lowerBlob * 0.64 +
      upperBlob * 0.6 +
      bridge * Math.max(lowerBlob, upperBlob) * 0.2,
      -1,
      1
    );

    return normalizeElevationSample(
      {
        contract: "HEARTH_COMPOSITION_FALLBACK_ELEVATION_ONLY",
        receipt: "FALLBACK_USED_ELEVATION_AUTHORITY_NOT_FOUND",
        x: p.x,
        y: p.y,
        z: p.z,
        elevation,
        landPotential: smoothstep(-0.06, 0.24, elevation),
        shelfPotential: smoothstep(-0.2, 0.12, elevation) * (1 - smoothstep(0.18, 0.5, elevation)),
        bridgePotential: bridge,
        ridgePotential: bridge * 0.45,
        saddlePotential: bridge * 0.22,
        basinPotential: 0,
        islandPotential: bridge * 0.28,
        coastPotential: clamp01(1 - Math.abs(elevation) / 0.14),
        waterDepthPotential: elevation < 0 ? clamp01(-elevation / 0.72) : 0,
        corePotential: Math.max(lowerBlob, upperBlob),
        shieldPotential: Math.max(lowerBlob, upperBlob) * 0.72,
        terrainClassHint: elevation > 0 ? "continental_core" : "deep_ocean"
      },
      p
    );
  };

  const readElevation = (...args) => {
    const p = parseInput(...args);

    if (args.length === 1 && hasElevationShape(args[0])) {
      return normalizeElevationSample(args[0], p);
    }

    const authority = getElevationAuthority();

    if (authority) {
      const fn =
        typeof authority.sample === "function"
          ? authority.sample
          : typeof authority.read === "function"
            ? authority.read
            : null;

      if (fn) {
        try {
          return normalizeElevationSample(fn.apply(authority, args), p);
        } catch (err) {
          try {
            return normalizeElevationSample(fn.call(authority, p), p);
          } catch (err2) {
            return fallbackElevationSample(p);
          }
        }
      }
    }

    return fallbackElevationSample(p);
  };

  const candidateFlags = (elev, base) => {
    const e = elev.elevation;
    const land = e > SEA_LEVEL ? 1 : 0;

    const mountainCandidate = clamp01(
      smoothstep(0.34, 0.72, e) * 0.48 +
      elev.ridgePotential * 0.38 +
      elev.corePotential * smoothstep(0.42, 0.78, e) * 0.26
    );

    const cliffCandidate = clamp01(
      base.slopePressure * 0.48 +
      base.shelfDrop * 0.34 +
      elev.coastPotential * smoothstep(0.02, 0.22, e) * 0.24
    );

    const valleyCandidate = clamp01(
      elev.basinPotential * 0.58 +
      elev.saddlePotential * 0.32 +
      smoothstep(0.08, -0.08, e) * elev.bridgePotential * 0.2
    );

    const coastCandidate = clamp01(
      elev.coastPotential * 0.72 +
      base.shorelineContact * 0.42
    );

    return {
      mountain_candidate: mountainCandidate > 0.58 && land,
      cliff_candidate: cliffCandidate > 0.56 && land,
      valley_candidate: valleyCandidate > 0.5,
      coast_edge: coastCandidate > 0.56,
      island_seed:
        elev.islandPotential > 0.52 &&
        e > -0.06 &&
        e < 0.28,
      bridge_member:
        elev.bridgePotential > 0.46 &&
        e > -0.16,
      solid_land:
        land === 1 && base.massAnchor > 0.45,
      shallow_water:
        e <= SEA_LEVEL && e > -0.18,
      deep_water:
        e <= -0.18
    };
  };

  const decideTerrainClass = (elev, base) => {
    const e = elev.elevation;

    if (e <= -0.22 && elev.bridgePotential < 0.26 && elev.shelfPotential < 0.24) {
      return "deep_water";
    }

    if (e <= SEA_LEVEL && e > -0.18) {
      if (elev.bridgePotential > 0.5 && elev.saddlePotential > 0.34) return "shallow_saddle";
      if (elev.bridgePotential > 0.46) return "submerged_bridge";
      return "shallow_water";
    }

    if (elev.coastPotential > 0.64 && e > -0.05 && e < 0.13) {
      return "coast_edge";
    }

    if (elev.islandPotential > 0.58 && e > -0.03 && e < 0.26) {
      return "island_seed";
    }

    if (base.slopePressure > 0.66 && base.shelfDrop > 0.5 && e > 0.08) {
      return "cliff_candidate";
    }

    if (elev.ridgePotential > 0.58 && e > 0.38) {
      return "mountain_candidate";
    }

    if (elev.basinPotential > 0.46 && e < 0.16) {
      return "basin_floor";
    }

    if (elev.saddlePotential > 0.48 && e < 0.14) {
      return "valley_candidate";
    }

    if (elev.corePotential > 0.68 && e > 0.22) {
      return "continental_core";
    }

    if (elev.shieldPotential > 0.52 && e > 0.14) {
      return "raised_shield";
    }

    if (elev.bridgePotential > 0.52 && elev.ridgePotential > 0.34 && e > 0.04) {
      return "exposed_bridge";
    }

    if (elev.ridgePotential > 0.48 && e > 0.06) {
      return "ridge_corridor";
    }

    if (elev.shelfPotential > 0.48 && e > -0.12 && e < 0.22) {
      return "coastal_shelf";
    }

    if (e > SEA_LEVEL) {
      return "raised_shield";
    }

    return "deep_water";
  };

  const computeBaseFields = (elev, p, inputMeta) => {
    const e = elev.elevation;

    const positiveLand = smoothstep(-0.04, 0.18, e);
    const exposedLand = e > SEA_LEVEL ? 1 : 0;
    const shallowBand = e <= SEA_LEVEL && e > -0.18 ? 1 : 0;

    const shorelineContact = clamp01(
      elev.coastPotential * 0.68 +
      elev.shelfPotential * smoothstep(-0.16, 0.08, e) * 0.34 +
      elev.bridgePotential * elev.saddlePotential * 0.16
    );

    const shelfDrop = clamp01(
      elev.shelfPotential * elev.coastPotential * 0.52 +
      elev.coastPotential * smoothstep(-0.06, 0.16, e) * 0.36 +
      elev.waterDepthPotential * elev.shelfPotential * 0.22
    );

    const slopePressure = clamp01(
      elev.ridgePotential * 0.42 +
      elev.coastPotential * 0.28 +
      shelfDrop * 0.32 +
      elev.basinPotential * 0.18 +
      elev.saddlePotential * 0.2
    );

    const reliefStrength = clamp01(
      smoothstep(0.0, 0.52, e) * 0.34 +
      elev.ridgePotential * 0.3 +
      elev.corePotential * 0.18 +
      slopePressure * 0.32
    );

    const materialDensity = clamp01(
      exposedLand * 0.45 +
      positiveLand * 0.24 +
      elev.corePotential * 0.18 +
      elev.ridgePotential * 0.12 +
      elev.bridgePotential * smoothstep(-0.02, 0.16, e) * 0.16 -
      elev.waterDepthPotential * 0.18
    );

    const massAnchor = clamp01(
      positiveLand * 0.42 +
      materialDensity * 0.34 +
      reliefStrength * 0.16 +
      shorelineContact * 0.16 +
      elev.corePotential * 0.1
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
      limbPressure * (0.44 + massAnchor * 0.42 + shorelineContact * 0.16)
    );

    const curvatureLock = clamp01(
      0.72 +
      massAnchor * 0.18 +
      materialDensity * 0.08 +
      shorelineContact * 0.04
    );

    const contactOcclusion = clamp01(
      shorelineContact * 0.42 +
      shelfDrop * 0.3 +
      massAnchor * rimCompression * 0.22 +
      reliefStrength * slopePressure * 0.24
    );

    const underlandShadow = clamp01(
      contactOcclusion * 0.72 +
      shelfDrop * 0.16 +
      shorelineContact * 0.18
    );

    const surfaceAttachment = clamp01(
      curvatureLock * 0.32 +
      massAnchor * 0.34 +
      materialDensity * 0.2 +
      contactOcclusion * 0.14
    );

    return {
      positiveLand,
      exposedLand,
      shallowBand,
      shorelineContact,
      shelfDrop,
      slopePressure,
      reliefStrength,
      materialDensity,
      massAnchor,
      rimCompression,
      curvatureLock,
      contactOcclusion,
      underlandShadow,
      surfaceAttachment
    };
  };

  const sample = (...args) => {
    const p = parseInput(...args);
    const inputMeta =
      args.length === 1 && args[0] && typeof args[0] === "object"
        ? args[0]
        : null;

    const elevationSample = readElevation(...args);
    const base = computeBaseFields(elevationSample, p, inputMeta);
    const terrainClass = decideTerrainClass(elevationSample, base);
    const flags = candidateFlags(elevationSample, base);

    const composition = {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "composition",
      sourceAuthority: "hearth.elevation.js",

      x: p.x,
      y: p.y,
      z: p.z,

      elevation: elevationSample.elevation,
      seaLevel: elevationSample.seaLevel,

      terrainClass,
      terrainClassHint: elevationSample.terrainClassHint,

      isLand: elevationSample.elevation > SEA_LEVEL,
      isWater: elevationSample.elevation <= SEA_LEVEL,
      isShallowWater: elevationSample.isShallowWater,
      isDeepWater: elevationSample.isDeepWater,

      landPotential: elevationSample.landPotential,
      shelfPotential: elevationSample.shelfPotential,
      bridgePotential: elevationSample.bridgePotential,
      ridgePotential: elevationSample.ridgePotential,
      saddlePotential: elevationSample.saddlePotential,
      basinPotential: elevationSample.basinPotential,
      islandPotential: elevationSample.islandPotential,
      coastPotential: elevationSample.coastPotential,
      waterDepthPotential: elevationSample.waterDepthPotential,
      corePotential: elevationSample.corePotential,
      shieldPotential: elevationSample.shieldPotential,

      massAnchor: base.massAnchor,
      shorelineContact: base.shorelineContact,
      reliefStrength: base.reliefStrength,
      slopePressure: base.slopePressure,
      shelfDrop: base.shelfDrop,
      underlandShadow: base.underlandShadow,
      materialDensity: base.materialDensity,
      rimCompression: base.rimCompression,
      curvatureLock: base.curvatureLock,
      contactOcclusion: base.contactOcclusion,
      surfaceAttachment: base.surfaceAttachment,

      mountainCandidate: flags.mountain_candidate ? 1 : 0,
      cliffCandidate: flags.cliff_candidate ? 1 : 0,
      valleyCandidate: flags.valley_candidate ? 1 : 0,
      coastCandidate: flags.coast_edge ? 1 : 0,
      islandSeed: flags.island_seed ? 1 : 0,

      candidates: flags,

      dominantCoreId: elevationSample.dominantCoreId,

      elevationReceipt: elevationSample.receipt,
      elevationContract: elevationSample.contract
    };

    return composition;
  };

  const compose = (...args) => sample(...args);
  const read = (...args) => sample(...args);
  const classify = (...args) => sample(...args).terrainClass;
  const getTerrainClass = classify;
  const sampleComposition = sample;
  const readComposition = read;

  const getReceipt = () => ({
    contract: CONTRACT,
    receipt: RECEIPT,
    authority: "composition",
    status: "active",
    sourceAuthority: "hearth.elevation.js",
    purpose: "surface-mass-anchoring",
    requiredUpstream: [
      "hearth.elevation.js"
    ],
    preparedDownstream: [
      "hearth.materials.js",
      "hearth.canvas.js"
    ],
    terrainClasses: [
      "continental_core",
      "raised_shield",
      "coastal_shelf",
      "exposed_bridge",
      "submerged_bridge",
      "ridge_corridor",
      "shallow_saddle",
      "basin_floor",
      "coast_edge",
      "cliff_candidate",
      "valley_candidate",
      "mountain_candidate",
      "island_seed",
      "shallow_water",
      "deep_water"
    ],
    exposedFields: [
      "terrainClass",
      "massAnchor",
      "shorelineContact",
      "reliefStrength",
      "slopePressure",
      "shelfDrop",
      "underlandShadow",
      "materialDensity",
      "rimCompression",
      "curvatureLock",
      "contactOcclusion",
      "surfaceAttachment"
    ],
    forbiddenOwnership: [
      "colors",
      "material-palette",
      "canvas-drawing",
      "runtime-motion",
      "controls",
      "route-ui",
      "final-visual-claim"
    ]
  });

  const api = {
    CONTRACT,
    RECEIPT,
    SEA_LEVEL,

    sample,
    compose,
    read,
    classify,
    getTerrainClass,
    sampleComposition,
    readComposition,
    getReceipt,

    terrainClasses: [
      "continental_core",
      "raised_shield",
      "coastal_shelf",
      "exposed_bridge",
      "submerged_bridge",
      "ridge_corridor",
      "shallow_saddle",
      "basin_floor",
      "coast_edge",
      "cliff_candidate",
      "valley_candidate",
      "mountain_candidate",
      "island_seed",
      "shallow_water",
      "deep_water"
    ]
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.composition = api;
  root.HEARTH_COMPOSITION = api;
  root.HearthComposition = api;
  root.HEARTH_COMPOSITION_RECEIPT = getReceipt();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
