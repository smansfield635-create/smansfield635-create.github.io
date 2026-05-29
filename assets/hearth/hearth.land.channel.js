// /assets/hearth/hearth.land.channel.js
// HEARTH_LAND_CORE_EXPANSION_OPAQUE_BODY_BINDING_TNT_v1
// Full-file replacement.
// Public consumer contract is intentionally preserved for Runtime Table compatibility:
// HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1
// Land channel / body-bound ground-level crust receiver only.
// Purpose:
// - Use existing Hearth land bodies as expansion cores.
// - Expand readable land-body reach by approximately 80% relative to valid/high-potential cores.
// - Improve opaque, body-seated land texture without converting the planet into 80% land.
// - Strengthen land body-binding, ground-seat, mass-anchor, surface-attachment, relief, and contact-occlusion fields.
// - Preserve shoreline/shelf/no-land samples as transition evidence, not false solid land.
// - Preserve wide-probe diagnostic mode so global distribution is never judged from one anchor sample.
// Does not own:
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology generation
// - water authority
// - air authority
// - material palette authority
// - canvas mounting
// - atlas projection
// - Runtime Table planning
// - route orchestration
// - runtime motion
// - controls
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1";
  const RECEIPT = "HEARTH_LAND_CORE_EXPANSION_OPAQUE_BODY_BINDING_RECEIPT_v1";
  const BIRTH_CONTRACT = "HEARTH_LAND_CORE_EXPANSION_OPAQUE_BODY_BINDING_TNT_v1";
  const PREVIOUS_BIRTH_CONTRACT = "HEARTH_LAND_GROUND_LEVEL_SURFACE_SEATING_BIRTH_TNT_v1";
  const VERSION = "2026-05-29.hearth-land-core-expansion-opaque-body-binding-v1";

  const SOURCE_CONTRACTS = Object.freeze({
    composition: "HEARTH_TECTONICS_SEATED_COMPOSITION_COORDINATION_TNT_v2",
    elevation: "HEARTH_TECTONICS_SEATED_ELEVATION_RESOLVER_TNT_v2",
    tectonics: "HEARTH_STRUCTURAL_CAUSE_TECTONICS_AUTHORITY_TNT_v2",
    hydrology: "HEARTH_SEA_LEVEL_WATERLINE_BEACH_BOUNDARY_HYDROLOGY_TNT_v1",
    materials: "HEARTH_SUBMERGED_PORT_BASIN_WATERLINE_MATERIALS_TNT_v1"
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;

  const COLORS = Object.freeze({
    lowLand: [38, 35, 27],
    shelf: [66, 58, 39],
    wetStone: [74, 66, 47],
    crust: [104, 84, 50],
    highCrust: [138, 111, 65],
    ridge: [164, 132, 78],
    shadow: [20, 18, 14],
    debugCore: [148, 114, 66],
    debugShoulder: [108, 92, 58]
  });

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
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

  function normalize3(p) {
    const x = safeNumber(p && p.x, 0);
    const y = safeNumber(p && p.y, 0);
    const z = safeNumber(p && p.z, 1);
    const m = Math.hypot(x, y, z) || 1;
    return { x: x / m, y: y / m, z: z / m };
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = safeNumber(lonDeg, 0) * DEG;
    const lat = safeNumber(latDeg, 0) * DEG;
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
    return wrap01((safeNumber(lon, 0) + 180) / 360);
  }

  function latToV(lat) {
    return clamp((90 - safeNumber(lat, 0)) / 180, 0, 1);
  }

  function uToLon(u) {
    return wrap01(u) * 360 - 180;
  }

  function vToLat(v) {
    return 90 - clamp(safeNumber(v, 0), 0, 1) * 180;
  }

  function parseInput(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        return lonLatToVector(uToLon(p.u), vToLat(p.v));
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        return lonLatToVector(p.lon, p.lat);
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        return lonLatToVector(p.longitude, p.latitude);
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
    if (args.length >= 2) return lonLatToVector(args[0], args[1]);
    return lonLatToVector(0, 0);
  }

  function coordinatePacketFromVector(p) {
    const ll = vectorToLonLat(p);
    return {
      x: p.x,
      y: p.y,
      z: p.z,
      u: lonToU(ll.lon),
      v: latToV(ll.lat),
      lon: ll.lon,
      lat: ll.lat
    };
  }

  function asLowerText(...values) {
    return values
      .filter((value) => value !== undefined && value !== null)
      .map((value) => String(value).toLowerCase())
      .join(" ");
  }

  function includesAny(text, words) {
    const source = String(text || "").toLowerCase();
    return words.some((word) => source.includes(word));
  }

  function colorField(source, keys, fallback) {
    for (const key of keys) {
      const value = source && source[key];
      if (
        Array.isArray(value) &&
        value.length >= 3 &&
        value.every((item) => Number.isFinite(Number(item)))
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

  function firstFinite(sources, keys, fallback = 0) {
    for (const source of sources) {
      if (!source || typeof source !== "object") continue;
      for (const key of keys) {
        if (Number.isFinite(Number(source[key]))) return Number(source[key]);
      }
    }
    return fallback;
  }

  function firstText(sources, keys, fallback = "") {
    for (const source of sources) {
      if (!source || typeof source !== "object") continue;
      for (const key of keys) {
        if (source[key] !== undefined && source[key] !== null && String(source[key]).length) return source[key];
      }
    }
    return fallback;
  }

  function getAuthority(names) {
    for (const name of names) {
      if (!name) continue;
      const value = name.split(".").reduce((cursor, part) => (cursor ? cursor[part] : null), root);
      if (value && typeof value === "object") return value;
    }
    return null;
  }

  function getCompositionAuthority() {
    return getAuthority([
      "HEARTH_COMPOSITION",
      "HearthComposition",
      "HEARTH.composition",
      "HEARTH.compositionAuthority"
    ]);
  }

  function getElevationAuthority() {
    return getAuthority([
      "HEARTH_ELEVATION",
      "HearthElevation",
      "HEARTH.elevation",
      "HEARTH.elevationAuthority"
    ]);
  }

  function getTectonicsAuthority() {
    return getAuthority([
      "HEARTH_TECTONICS",
      "HEARTH_TECTONICS_AUTHORITY",
      "HearthTectonics",
      "HEARTH.tectonics",
      "HEARTH.tectonicsAuthority"
    ]);
  }

  function getHydrologyAuthority() {
    return getAuthority([
      "HEARTH_HYDROLOGY",
      "HearthHydrology",
      "HEARTH.hydrology",
      "HEARTH.hydrologyAuthority"
    ]);
  }

  function getMaterialsAuthority() {
    return getAuthority([
      "HEARTH_MATERIALS",
      "HearthMaterials",
      "HEARTH.materials",
      "HEARTH.materialsAuthority"
    ]);
  }

  function callAuthority(authority, packet) {
    if (!authority || typeof authority !== "object") return null;

    const methods = ["sample", "read", "get", "lookup"];

    for (const method of methods) {
      if (typeof authority[method] !== "function") continue;

      try {
        const value = authority[method](packet);
        if (value && typeof value === "object") return value;
      } catch (_error) {}

      try {
        const value = authority[method](packet.u, packet.v, packet.lon, packet.lat);
        if (value && typeof value === "object") return value;
      } catch (_error2) {}

      try {
        const value = authority[method](packet.x, packet.y, packet.z);
        if (value && typeof value === "object") return value;
      } catch (_error3) {}
    }

    return null;
  }

  function deterministicFallback(packet) {
    const lon = safeNumber(packet.lon, 0);
    const lat = safeNumber(packet.lat, 0);
    const latR = lat * DEG;

    const continentalArc =
      Math.sin((lon + 38) * DEG) * 0.24 +
      Math.cos((lon * 1.72 - 18) * DEG) * 0.16 +
      Math.sin((lat * 2.15 + 22) * DEG) * 0.18;

    const ridgeNetwork =
      Math.sin((lon * 3.4 + lat * 1.2 + 8) * DEG) * 0.16 +
      Math.cos((lon * 1.1 - lat * 2.8 - 28) * DEG) * 0.13;

    const basinCounter = Math.cos(latR) * 0.12 - Math.sin((lon * 0.7 - 14) * DEG) * 0.09;
    const signal = continentalArc + ridgeNetwork + basinCounter;
    const elevation = signal * 0.24 - 0.025;
    const shelf = clamp01(0.28 + Math.abs(signal) * 0.34 - Math.max(0, -elevation) * 0.28);
    const landPotential = clamp01(0.18 + signal * 0.62 + shelf * 0.22);

    return {
      contract: "HEARTH_LAND_CORE_EXPANSION_FALLBACK_SOURCE_v1",
      sourceMode: "deterministic-local-land-fallback",
      terrainClass: elevation > 0.045 ? "fallback_ridge_land" : elevation > -0.025 ? "fallback_shelf_land" : "fallback_ocean_basin",
      compositionClass: elevation > 0 ? "fallback_crust_mass" : "fallback_basin_margin",
      materialClass: elevation > 0 ? "fallback.crust.ochre-stone" : "fallback.shelf.wetstone-transition",
      hydrologyClass: elevation > -0.035 ? "fallback_coastal_transition_zone" : "fallback_open_ocean",
      elevation,
      landPresence: landPotential,
      landPotential,
      crustDensity: clamp01(0.22 + landPotential * 0.62),
      materialDensity: clamp01(0.18 + landPotential * 0.58),
      reliefStrength: clamp01(Math.abs(ridgeNetwork) * 1.4),
      ridgeRelief: clamp01(Math.max(0, ridgeNetwork) * 1.8),
      plateauPotential: clamp01(Math.max(0, continentalArc) * 1.25),
      shorelineContact: shelf,
      coastPotential: shelf,
      isLand: elevation > 0.018,
      isWater: elevation <= 0.018
    };
  }

  function gatherSources(packet) {
    const composition = callAuthority(getCompositionAuthority(), packet);
    const elevation = callAuthority(getElevationAuthority(), packet);
    const tectonics = callAuthority(getTectonicsAuthority(), packet);
    const hydrology = callAuthority(getHydrologyAuthority(), packet);
    const materials = callAuthority(getMaterialsAuthority(), packet);
    const fallback = deterministicFallback(packet);

    return {
      composition,
      elevation,
      tectonics,
      hydrology,
      materials,
      fallback,
      list: [composition, materials, elevation, tectonics, hydrology, fallback].filter(Boolean)
    };
  }

  function classifySources(sources) {
    const sourceList = sources.list;
    const classText = asLowerText(
      ...sourceList.map((source) => source.terrainClass),
      ...sourceList.map((source) => source.compatibilityTerrainClass),
      ...sourceList.map((source) => source.materialClass),
      ...sourceList.map((source) => source.compositionClass),
      ...sourceList.map((source) => source.hydrologyClass),
      ...sourceList.map((source) => source.landClass),
      ...sourceList.map((source) => source.channelClass)
    );

    const elevation = firstFinite(sourceList, ["elevation", "height", "altitude", "terrainElevation"], sources.fallback.elevation);
    const seaLevel = firstFinite(sourceList, ["seaLevel", "waterline", "datum"], 0);
    const rawLandPresence = clamp01(firstFinite(sourceList, ["landPresence", "landAlpha", "landPotential", "land", "landSignal"], sources.fallback.landPotential));
    const rawLandPotential = clamp01(firstFinite(sourceList, ["landPotential", "landPresence", "crustDensity"], rawLandPresence));
    const rawCrustDensity = clamp01(firstFinite(sourceList, ["crustDensity", "crust", "materialDensity", "density"], sources.fallback.crustDensity));
    const rawMaterialDensity = clamp01(firstFinite(sourceList, ["materialDensity", "density", "crustDensity"], sources.fallback.materialDensity));
    const rawRelief = clamp01(firstFinite(sourceList, ["reliefStrength", "terrainRelief", "ridgeRelief", "relief"], sources.fallback.reliefStrength));
    const rawRidge = clamp01(firstFinite(sourceList, ["ridgeRelief", "ridgePotential", "mountainArcPotential"], sources.fallback.ridgeRelief));
    const rawPlateau = clamp01(firstFinite(sourceList, ["plateauPotential", "massAnchor", "groundSeat"], sources.fallback.plateauPotential));
    const shorelineContact = clamp01(firstFinite(sourceList, ["shorelineContact", "shoreContact", "shoreline", "wetEdge"], sources.fallback.shorelineContact));
    const coastPotential = clamp01(firstFinite(sourceList, ["coastPotential", "coast", "coastalBoundary", "shelfPotential"], sources.fallback.coastPotential));
    const basinPotential = clamp01(firstFinite(sourceList, ["basinPotential", "basinInfluence", "waterDepth"], 0));
    const waterDepth = clamp01(firstFinite(sourceList, ["waterDepth", "depth", "basinDepth"], Math.max(0, -elevation)));
    const submergedInfluence = clamp01(firstFinite(sourceList, ["submergedBlockInfluence", "submergedScarInfluence", "submergedInfluence"], 0));

    const textSaysSolidLand = includesAny(classText, [
      "land",
      "highland",
      "mountain",
      "ridge",
      "plateau",
      "desert",
      "forest",
      "grass",
      "plain",
      "crust",
      "cliff",
      "canyon",
      "escarpment",
      "summit"
    ]) && !includesAny(classText, ["no-solid-land", "no_land", "open-ocean", "deep-ocean"]);

    const textSaysShelf = includesAny(classText, [
      "shelf",
      "shore",
      "coast",
      "beach",
      "wetstone",
      "shallow",
      "transition",
      "waterline",
      "margin"
    ]);

    const textSaysOpenWater = includesAny(classText, [
      "open-ocean",
      "deep-ocean",
      "ocean_basin",
      "open_ocean",
      "abyssal",
      "deep_water"
    ]);

    const sourceSaysLand = sourceList.some((source) => safeBool(source.isLand, false) === true);
    const sourceSaysWater = sourceList.some((source) => safeBool(source.isWater, false) === true);

    const elevationCore = clamp01((elevation - seaLevel + 0.035) / 0.18);
    const elevationShoulder = clamp01((elevation - seaLevel + 0.105) / 0.20);
    const tectonicMass = clamp01(
      rawCrustDensity * 0.32 +
      rawMaterialDensity * 0.22 +
      rawRidge * 0.20 +
      rawPlateau * 0.18 +
      rawRelief * 0.08
    );

    const shelfPotential = clamp01(
      shorelineContact * 0.32 +
      coastPotential * 0.30 +
      (textSaysShelf ? 0.22 : 0) +
      elevationShoulder * 0.22 +
      rawLandPotential * 0.16 -
      submergedInfluence * 0.10
    );

    const openWaterRejection = clamp01(
      (textSaysOpenWater ? 0.42 : 0) +
      waterDepth * 0.34 +
      basinPotential * 0.16 +
      (sourceSaysWater && !textSaysShelf ? 0.10 : 0) -
      shelfPotential * 0.18 -
      elevationCore * 0.20
    );

    const existingCore = clamp01(
      rawLandPresence * 0.34 +
      rawLandPotential * 0.22 +
      elevationCore * 0.30 +
      tectonicMass * 0.26 +
      (textSaysSolidLand ? 0.24 : 0) +
      (sourceSaysLand ? 0.16 : 0) -
      openWaterRejection * 0.32
    );

    const expandedShoulder = clamp01(
      shelfPotential * 0.38 +
      rawLandPotential * 0.26 +
      tectonicMass * 0.20 +
      elevationShoulder * 0.18 +
      shorelineContact * 0.12 -
      openWaterRejection * 0.24
    );

    const landExpansionDelta = clamp01(expandedShoulder * 0.8 * (1 - existingCore * 0.28));
    const expandedSignal = clamp01(existingCore + landExpansionDelta);

    const solidCore = existingCore >= 0.48 && openWaterRejection < 0.72;
    const expandedSolidLand = expandedSignal >= 0.44 && openWaterRejection < 0.62 && (elevation > seaLevel - 0.055 || textSaysShelf);
    const transitionShelf = !expandedSolidLand && expandedSignal >= 0.18 && openWaterRejection < 0.78;
    const excludedOpenWater = !expandedSolidLand && !transitionShelf;

    const landClass = expandedSolidLand
      ? solidCore
        ? "opaque-expanded-core-land"
        : "opaque-expanded-shoulder-land"
      : transitionShelf
        ? "body-bound-land-potential-shelf"
        : textSaysOpenWater
          ? "excluded-open-ocean-no-solid-land"
          : "excluded-low-land-signal";

    const channelClass = expandedSolidLand
      ? "land-core-expanded-body-bound"
      : transitionShelf
        ? "land-potential-body-bound-shelf"
        : "low-signal-body-bound-land-channel";

    const isLand = Boolean(expandedSolidLand);
    const isWater = Boolean(!expandedSolidLand && (sourceSaysWater || openWaterRejection > 0.42));
    const diagnosticEligible = Boolean(expandedSolidLand || (transitionShelf && expandedSignal >= 0.28));

    const groundSeat = expandedSolidLand
      ? clamp01(0.68 + expandedSignal * 0.26 + tectonicMass * 0.10)
      : transitionShelf
        ? clamp01(0.40 + expandedSignal * 0.32 + shelfPotential * 0.24)
        : clamp01(0.18 + expandedSignal * 0.24);

    const massAnchor = expandedSolidLand
      ? clamp01(0.62 + expandedSignal * 0.24 + tectonicMass * 0.18)
      : transitionShelf
        ? clamp01(0.34 + expandedSignal * 0.30 + tectonicMass * 0.16)
        : clamp01(0.12 + expandedSignal * 0.22);

    const bodyBinding = expandedSolidLand
      ? clamp01(0.78 + groundSeat * 0.12 + massAnchor * 0.10)
      : transitionShelf
        ? clamp01(0.58 + groundSeat * 0.18 + shelfPotential * 0.12)
        : clamp01(0.42 + expandedSignal * 0.24);

    const surfaceAttachment = expandedSolidLand
      ? clamp01(0.76 + groundSeat * 0.14 + rawRelief * 0.08)
      : transitionShelf
        ? clamp01(0.56 + shelfPotential * 0.20 + groundSeat * 0.12)
        : clamp01(0.38 + expandedSignal * 0.22);

    const landAlpha = expandedSolidLand
      ? clamp01(0.40 + expandedSignal * 0.44 + rawRelief * 0.08)
      : transitionShelf
        ? clamp01(0.15 + expandedSignal * 0.34 + shelfPotential * 0.16)
        : clamp01(0.035 + expandedSignal * 0.16);

    const materialDensity = clamp01(rawMaterialDensity * 0.48 + expandedSignal * 0.34 + groundSeat * 0.18);
    const crustDensity = clamp01(rawCrustDensity * 0.50 + existingCore * 0.24 + expandedSignal * 0.20 + tectonicMass * 0.14);
    const reliefStrength = clamp01(rawRelief * 0.62 + rawRidge * 0.18 + expandedSignal * 0.16 + (expandedSolidLand ? 0.08 : 0));
    const reliefBinding = clamp01(reliefStrength * 0.48 + bodyBinding * 0.32 + groundSeat * 0.20);
    const curvatureLock = clamp01(0.58 + bodyBinding * 0.28 + surfaceAttachment * 0.12);
    const contactOcclusion = expandedSolidLand
      ? clamp01(0.18 + bodyBinding * 0.30 + reliefBinding * 0.20)
      : transitionShelf
        ? clamp01(0.10 + bodyBinding * 0.20 + shelfPotential * 0.10)
        : clamp01(0.04 + bodyBinding * 0.08);

    const underlandShadow = clamp01(contactOcclusion * 0.54 + massAnchor * 0.16 + (expandedSolidLand ? 0.10 : 0));
    const terrainRelief = clamp01(reliefStrength * (expandedSolidLand ? 0.82 : 0.42));
    const ridgeRelief = clamp01(rawRidge * (expandedSolidLand ? 0.94 : 0.48));
    const plateauPotential = clamp01(rawPlateau * 0.55 + existingCore * 0.22 + expandedSignal * 0.18);
    const canyonPotential = clamp01(firstFinite(sourceList, ["canyonPotential"], 0) * 0.74 + reliefStrength * 0.10);
    const escarpmentPotential = clamp01(firstFinite(sourceList, ["escarpmentPotential"], 0) * 0.74 + ridgeRelief * 0.12);
    const mountainArcPotential = clamp01(firstFinite(sourceList, ["mountainArcPotential"], 0) * 0.72 + rawRidge * 0.16);
    const ridgePotential = clamp01(firstFinite(sourceList, ["ridgePotential"], rawRidge) * 0.72 + ridgeRelief * 0.18);

    const baseColor = expandedSolidLand
      ? mixColor(COLORS.crust, COLORS.highCrust, clamp01(reliefStrength * 0.46 + crustDensity * 0.36))
      : transitionShelf
        ? mixColor(COLORS.shelf, COLORS.wetStone, clamp01(shelfPotential * 0.60 + shorelineContact * 0.24))
        : COLORS.lowLand.slice();

    const upstreamColor = colorField(
      sources.materials || sources.composition || sources.fallback,
      ["landRgb", "rgb", "color", "debugColor"],
      baseColor
    );

    const sourceColorContribution = expandedSolidLand ? 0.28 : transitionShelf ? 0.18 : 0.08;
    let rgb = mixColor(baseColor, upstreamColor, sourceColorContribution);
    rgb = mixColor(rgb, COLORS.shadow, underlandShadow * 0.20);
    rgb = scaleColor(rgb, expandedSolidLand ? 1.02 + reliefStrength * 0.06 : 0.90 + shelfPotential * 0.08);

    const terrainClass = String(
      firstText(sourceList, ["terrainClass", "compatibilityTerrainClass"], expandedSolidLand ? "expanded_land" : transitionShelf ? "land_potential_shelf" : "low_land_signal")
    );

    const materialClass = String(
      firstText(sourceList, ["materialClass"], expandedSolidLand ? "land.opaque.ochre-crust" : transitionShelf ? "land.shelf.wetstone-transition" : "land.low-signal")
    );

    const compositionClass = String(
      firstText(sourceList, ["compositionClass"], expandedSolidLand ? "expanded_crust_mass" : transitionShelf ? "coastal_margin_mass" : "low_land_composition")
    );

    const hydrologyClass = String(
      firstText(sourceList, ["hydrologyClass"], transitionShelf ? "coastal_transition_zone" : excludedOpenWater ? "open_ocean" : "land_boundary")
    );

    return {
      classText,
      elevation,
      seaLevel,
      rawLandPresence,
      rawLandPotential,
      rawCrustDensity,
      rawMaterialDensity,
      rawRelief,
      rawRidge,
      rawPlateau,
      shorelineContact,
      coastPotential,
      basinPotential,
      waterDepth,
      submergedInfluence,
      sourceSaysLand,
      sourceSaysWater,
      textSaysSolidLand,
      textSaysShelf,
      textSaysOpenWater,
      elevationCore,
      elevationShoulder,
      tectonicMass,
      shelfPotential,
      openWaterRejection,
      existingCore,
      expandedShoulder,
      landExpansionDelta,
      expandedSignal,
      solidCore,
      expandedSolidLand,
      transitionShelf,
      excludedOpenWater,
      landClass,
      channelClass,
      isLand,
      isWater,
      diagnosticEligible,
      groundSeat,
      massAnchor,
      bodyBinding,
      surfaceAttachment,
      landAlpha,
      materialDensity,
      crustDensity,
      reliefStrength,
      reliefBinding,
      curvatureLock,
      contactOcclusion,
      underlandShadow,
      terrainRelief,
      ridgeRelief,
      plateauPotential,
      canyonPotential,
      escarpmentPotential,
      mountainArcPotential,
      ridgePotential,
      terrainClass,
      materialClass,
      compositionClass,
      hydrologyClass,
      rgb
    };
  }

  function sample(...args) {
    const p = parseInput(...args);
    const packet = coordinatePacketFromVector(p);
    const sources = gatherSources(packet);
    const c = classifySources(sources);
    const sourceOrder = [];

    if (sources.composition) sourceOrder.push("composition");
    if (sources.materials) sourceOrder.push("materials");
    if (sources.elevation) sourceOrder.push("elevation");
    if (sources.tectonics) sourceOrder.push("tectonics");
    if (sources.hydrology) sourceOrder.push("hydrology");
    if (!sourceOrder.length) sourceOrder.push("fallback");

    const sourceAuthority = sourceOrder.join(",");
    const sourceContract =
      (sources.composition && sources.composition.contract) ||
      (sources.materials && sources.materials.contract) ||
      (sources.elevation && sources.elevation.contract) ||
      (sources.tectonics && sources.tectonics.contract) ||
      (sources.hydrology && sources.hydrology.contract) ||
      sources.fallback.contract ||
      "";

    const sourceReceipt =
      (sources.composition && sources.composition.receipt) ||
      (sources.materials && sources.materials.receipt) ||
      (sources.elevation && sources.elevation.receipt) ||
      (sources.tectonics && sources.tectonics.receipt) ||
      (sources.hydrology && sources.hydrology.receipt) ||
      "";

    const diagnosticClass = c.diagnosticEligible
      ? c.expandedSolidLand
        ? "eligible-expanded-body-bound-land"
        : "eligible-body-bound-land-potential-shelf"
      : c.excludedOpenWater
        ? "excluded-open-water-no-solid-land"
        : "excluded-low-signal-transition";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      birthContract: BIRTH_CONTRACT,
      previousBirthContract: PREVIOUS_BIRTH_CONTRACT,
      version: VERSION,
      authority: "land-core-expansion-opaque-body-binding-receiver",

      x: packet.x,
      y: packet.y,
      z: packet.z,
      u: packet.u,
      v: packet.v,
      lon: packet.lon,
      lat: packet.lat,

      sourceContract,
      sourceReceipt,
      sourceAuthority,
      sourceMode: sourceOrder.includes("fallback") && sourceOrder.length === 1 ? "deterministic-local-land-fallback" : "upstream-land-receiver",
      sourceCount: sourceOrder.length,
      sourceOrder,
      expectedSourceContracts: SOURCE_CONTRACTS,

      channel: "land",
      channelClass: c.channelClass,
      landClass: c.landClass,
      isLandChannel: true,
      isWaterChannel: false,
      isAirChannel: false,

      landPresence: c.landAlpha,
      landAlpha: c.landAlpha,
      landPotential: c.expandedSignal,
      existingLandCore: c.existingCore,
      landCoreSignal: c.existingCore,
      landExpansionDelta: c.landExpansionDelta,
      landExpansionTargetRelative: 0.8,
      landExpansionMode: "core-dilation-from-existing-land-bodies-and-high-confidence-shelves",
      expandedLandSignal: c.expandedSignal,
      expandedShoulder: c.expandedShoulder,
      shelfPotential: c.shelfPotential,
      openWaterRejection: c.openWaterRejection,

      isLand: c.isLand,
      isWater: c.isWater,
      elevation: c.elevation,
      seaLevel: c.seaLevel,
      groundSeat: c.groundSeat,
      massAnchor: c.massAnchor,
      bodyBinding: c.bodyBinding,
      surfaceAttachment: c.surfaceAttachment,
      materialDensity: c.materialDensity,
      crustDensity: c.crustDensity,
      reliefStrength: c.reliefStrength,
      reliefBinding: c.reliefBinding,
      curvatureLock: c.curvatureLock,
      contactOcclusion: c.contactOcclusion,
      underlandShadow: c.underlandShadow,
      terrainRelief: c.terrainRelief,
      ridgeRelief: c.ridgeRelief,
      plateauPotential: c.plateauPotential,
      basinPotential: c.basinPotential,
      canyonPotential: c.canyonPotential,
      escarpmentPotential: c.escarpmentPotential,
      mountainArcPotential: c.mountainArcPotential,
      ridgePotential: c.ridgePotential,
      shorelineContact: c.shorelineContact,
      coastPotential: c.coastPotential,
      waterDepth: c.waterDepth,
      submergedInfluence: c.submergedInfluence,

      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      atmosphericRejection: c.isLand ? 0.92 : c.transitionShelf ? 0.78 : 0.66,
      mayDefineWater: false,
      mayDefineAir: false,
      mayDefineLand: true,
      landExpansionOwnsHydrology: false,
      landExpansionOwnsTectonicCause: false,

      diagnosticEligible: c.diagnosticEligible,
      diagnosticClass,
      singleProbeDistributionEvidence: false,
      requiresWideProbeForDistribution: true,
      minimumWideProbePoints: 25,
      diagnosticNote: "Single anchor samples prove load, contract, method, coordinate, and local safety only. Global land expansion/distribution requires wide-probe mode.",

      ownsTectonicCause: false,
      ownsElevationGeneration: false,
      ownsCompositionClassification: false,
      ownsHydrology: false,
      ownsWater: false,
      ownsAir: false,
      ownsMaterialPalette: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,

      rgb: c.rgb,
      color: c.rgb,
      alpha: c.landAlpha,
      opacityMode: c.isLand ? "opaque-body-bound-land" : c.transitionShelf ? "semi-opaque-body-bound-shelf" : "low-signal-body-bound-land-channel",
      opaqueTextureTarget: true,
      rockyMeansJaggedNotGray: true,
      debugColor: c.isLand ? COLORS.debugCore.slice() : c.transitionShelf ? COLORS.debugShoulder.slice() : COLORS.lowLand.slice(),

      terrainClass: c.terrainClass,
      compatibilityTerrainClass: c.terrainClass,
      materialClass: c.materialClass,
      compositionClass: c.compositionClass,
      hydrologyClass: c.hydrologyClass,
      receiverForPlanet: "Hearth",
      targetGlobalLandRatioHint: 0.30,
      earthReferenceLandRatio: 0.29,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function createWideProbe(options = {}) {
    const rows = clamp(Math.round(safeNumber(options.rows, 5)), 2, 17);
    const columns = clamp(Math.round(safeNumber(options.columns, 9)), 3, 33);
    const samples = [];

    let solidLand = 0;
    let expandedShoulder = 0;
    let transitionShelf = 0;
    let openWaterRejected = 0;
    let bodyBindingSum = 0;
    let surfaceAttachmentSum = 0;
    let landAlphaSum = 0;
    let landPotentialSum = 0;
    let opacityEligible = 0;

    for (let row = 0; row < rows; row += 1) {
      const v = rows === 1 ? 0.5 : (row + 0.5) / rows;

      for (let column = 0; column < columns; column += 1) {
        const u = columns === 1 ? 0.5 : (column + 0.5) / columns;
        const value = sample({ u, v });
        samples.push(value);

        if (value.isLand) solidLand += 1;
        if (value.landClass === "opaque-expanded-shoulder-land") expandedShoulder += 1;
        if (value.landClass === "body-bound-land-potential-shelf") transitionShelf += 1;
        if (String(value.landClass).includes("open-ocean")) openWaterRejected += 1;
        if (value.alpha >= 0.30) opacityEligible += 1;

        bodyBindingSum += safeNumber(value.bodyBinding, 0);
        surfaceAttachmentSum += safeNumber(value.surfaceAttachment, 0);
        landAlphaSum += safeNumber(value.landAlpha, 0);
        landPotentialSum += safeNumber(value.landPotential, 0);
      }
    }

    const total = samples.length || 1;
    const landRatio = solidLand / total;
    const expandedShoulderRatio = expandedShoulder / total;
    const transitionShelfRatio = transitionShelf / total;
    const opaqueTextureRatio = opacityEligible / total;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      birthContract: BIRTH_CONTRACT,
      version: VERSION,
      authority: "land-core-expansion-opaque-body-binding-receiver",
      mode: "wide-probe",
      readMode: "wide-probe",
      rows,
      columns,
      total,
      minimumWideProbePoints: 25,
      wideProbeValid: total >= 25,
      singleProbeDistributionEvidence: false,
      globalDistributionEvidence: total >= 25,
      solidLand,
      expandedShoulder,
      transitionShelf,
      openWaterRejected,
      landRatio,
      expandedShoulderRatio,
      transitionShelfRatio,
      opaqueTextureRatio,
      averageBodyBinding: bodyBindingSum / total,
      averageSurfaceAttachment: surfaceAttachmentSum / total,
      averageLandAlpha: landAlphaSum / total,
      averageLandPotential: landPotentialSum / total,
      targetGlobalLandRatioHint: 0.30,
      earthReferenceLandRatio: 0.29,
      relativeExpansionTarget: 0.8,
      interpretation: "Relative expansion from existing land cores/high-confidence shelves, not 80% planetary land coverage.",
      samples: options.includeSamples === true ? samples : [],
      summary: {
        landBodiesExpandedFromCores: true,
        opaqueTextureStrengthened: true,
        waterTruthOwned: false,
        airTruthOwned: false,
        tectonicCauseOwned: false,
        elevationGenerationOwned: false,
        visualPassClaimed: false
      },
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function read(...args) {
    const first = args[0];
    if (first && typeof first === "object") {
      const mode = String(first.mode || first.readMode || "").toLowerCase();
      if (mode === "wide-probe" || mode === "wide_probe" || mode === "distribution") {
        return createWideProbe(first);
      }
    }

    return sample(...args);
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      birthContract: BIRTH_CONTRACT,
      previousBirthContract: PREVIOUS_BIRTH_CONTRACT,
      version: VERSION,
      authority: "land-core-expansion-opaque-body-binding-receiver",
      status: "active",
      destinationFile: "/assets/hearth/hearth.land.channel.js",
      channel: "land",
      role: "body-bound-ground-level-crust-surface-channel",
      purpose: "receive Hearth land-related authorities, expand existing land cores by relative 80% core-dilation, and expose one Runtime Table-readable opaque land-channel output",
      receiverForPlanet: "Hearth",
      publicConsumerContractPreserved: true,
      publicConsumerContractReason: "Canvas and Runtime Table currently validate HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1.",
      sourceContracts: SOURCE_CONTRACTS,
      consumes: [
        "Hearth composition when available",
        "Hearth materials when available",
        "Hearth elevation when available",
        "Hearth tectonic hints when available",
        "Hearth hydrology only as rejection/boundary context when available",
        "deterministic local land fallback when upstream files are unavailable"
      ],
      exposedMethods: ["sample", "read", "getReceipt"],
      readModes: ["sample", "wide-probe"],
      expansionLaw: {
        interpretation: "80% relative expansion from valid/high-potential existing land cores, not 80% global land coverage",
        landExpansionTargetRelative: 0.8,
        targetGlobalLandRatioHint: 0.30,
        earthReferenceLandRatio: 0.29,
        expansionMode: "core-dilation",
        openOceanMayNotBecomeLandWithoutEligibility: true,
        shelvesMayBecomeTransitionBeforeSolidLand: true
      },
      exposedFields: [
        "landPresence",
        "landAlpha",
        "landPotential",
        "existingLandCore",
        "landExpansionDelta",
        "expandedLandSignal",
        "landClass",
        "groundSeat",
        "massAnchor",
        "bodyBinding",
        "surfaceAttachment",
        "crustDensity",
        "materialDensity",
        "reliefStrength",
        "reliefBinding",
        "curvatureLock",
        "contactOcclusion",
        "underlandShadow",
        "terrainRelief",
        "ridgeRelief",
        "plateauPotential",
        "basinPotential",
        "canyonPotential",
        "escarpmentPotential",
        "shorelineContact",
        "coastPotential",
        "bodyBound",
        "surfaceBound",
        "floatsAboveBody",
        "allowedToFloat",
        "atmosphericRejection",
        "diagnosticEligible",
        "diagnosticClass",
        "singleProbeDistributionEvidence",
        "requiresWideProbeForDistribution",
        "rgb",
        "alpha",
        "opacityMode",
        "sourceMode"
      ],
      diagnosticAlignment: {
        wideProbeEnabled: true,
        wideProbeReadMode: "read({ mode: 'wide-probe', rows: 5, columns: 9 })",
        minimumWideProbePoints: 25,
        singleAnchorDistributionEvidence: false,
        noLandAnchorMayFailDistribution: false,
        shallowWaterAnchorMayFailLandBodyBinding: false,
        rule: "A no-land, water, or shoreline-shelf anchor sample may describe the local point, but it cannot prove global land-distribution or land-body-binding failure."
      },
      renderLaw: [
        "land is body-bound",
        "land is ground-level",
        "land cannot float",
        "land cannot define water",
        "land cannot define air",
        "water/no-land samples must remain no-land",
        "shoreline and shelf samples may expose land potential without pretending to be solid land",
        "existing land bodies are expansion cores",
        "opaque texture applies only to eligible land or body-bound shelf transition",
        "single anchor samples are not global distribution proof",
        "fallback land is allowed only as Land Child continuity, not final visual pass"
      ],
      owns: [
        "land-channel-expression",
        "land-receiver-normalization",
        "core-dilation-land-expansion-fields",
        "opaque-land-texture-fields",
        "ground-seat-fields",
        "body-binding-fields",
        "surface-attachment-fields",
        "mass-anchor-fields",
        "crust-density-fields",
        "terrain-relief-fields",
        "land-channel-color-packet",
        "land-channel-wide-probe-diagnostic-read-mode"
      ],
      doesNotOwn: [
        "tectonic-cause",
        "elevation-generation",
        "composition-classification",
        "hydrology-generation",
        "water-authority",
        "air-authority",
        "material-palette-authority",
        "canvas-mounting",
        "atlas-projection",
        "Runtime Table planning",
        "route-orchestration",
        "runtime-motion",
        "controls",
        "final-visual-pass-claim"
      ],
      loadSafety: {
        noImports: true,
        noRequiredFetch: true,
        exportsImmediately: true,
        safeWithoutDom: true,
        safeWithoutCanvas: true,
        safeWithoutRuntimeTable: true,
        safeWithoutUpstreamLand: true,
        neverReturnsNullFromSample: true
      },
      expectedRuntimeTableOutcome: {
        landGlobalPresent: true,
        landActualContract: CONTRACT,
        landSampleProbeOk: true,
        landSampleProbeCoordinatesOk: true,
        landSampleProbeFlagsOk: true,
        landValidationOk: true,
        wideProbeDiagnosticAvailable: true
      },
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    birthContract: BIRTH_CONTRACT,
    previousBirthContract: PREVIOUS_BIRTH_CONTRACT,
    version: VERSION,
    authority: "land-core-expansion-opaque-body-binding-receiver",
    channel: "land",
    receiverForPlanet: "Hearth",

    sample,
    read,
    getReceipt,
    createWideProbe,

    supportsWideProbe: true,
    supportsCoreExpansion: true,
    supportsOpaqueTexture: true,
    supportsBodyBinding: true,
    supportsGroundSeat: true,
    supportsMassAnchor: true,
    landExpansionTargetRelative: 0.8,
    landExpansionMode: "core-dilation",
    targetGlobalLandRatioHint: 0.30,
    earthReferenceLandRatio: 0.29,

    ownsTectonicCause: false,
    ownsElevationGeneration: false,
    ownsCompositionClassification: false,
    ownsHydrology: false,
    ownsWater: false,
    ownsAir: false,
    ownsMaterialPalette: false,
    ownsCanvas: false,
    ownsRuntime: false,
    ownsControls: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.landChannel = api;
  root.HEARTH.land = api;

  root.HEARTH_LAND_CHANNEL = api;
  root.HearthLandChannel = api;
  root.HEARTH_LAND_CHANNEL_RECEIPT = getReceipt();
  root.HEARTH_LAND_CHANNEL_CONTRACT = CONTRACT;
  root.HEARTH_LAND_CORE_EXPANSION_OPAQUE_BODY_BINDING = true;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.hearthLandChannelLoaded = "true";
    dataset.hearthLandChannelContract = CONTRACT;
    dataset.hearthLandChannelReceipt = RECEIPT;
    dataset.hearthLandChildBirthContract = BIRTH_CONTRACT;
    dataset.hearthLandPreviousBirthContract = PREVIOUS_BIRTH_CONTRACT;
    dataset.hearthLandChannelAuthority = "land-core-expansion-opaque-body-binding-receiver";
    dataset.hearthLandChannelBodyBound = "true";
    dataset.hearthLandChannelGroundLevel = "true";
    dataset.hearthLandChannelAllowedToFloat = "false";
    dataset.hearthLandChannelDefinesWater = "false";
    dataset.hearthLandChannelDefinesAir = "false";
    dataset.hearthLandChannelReceiverForPlanet = "Hearth";
    dataset.hearthLandChannelExportsImmediately = "true";
    dataset.hearthLandChannelSafeWithoutUpstreamLand = "true";
    dataset.hearthLandWideProbeDiagnostic = "true";
    dataset.hearthLandSingleAnchorDistributionEvidence = "false";
    dataset.hearthLandMinimumWideProbePoints = "25";
    dataset.hearthLandCoreExpansionActive = "true";
    dataset.hearthLandExpansionTargetRelative = "0.8";
    dataset.hearthLandExpansionMode = "core-dilation";
    dataset.hearthLandExpansionOwnsHydrology = "false";
    dataset.hearthLandExpansionOwnsTectonicCause = "false";
    dataset.hearthLandOpaqueTextureTarget = "true";
    dataset.hearthLandRockyMeansJaggedNotGray = "true";
    dataset.hearthLandTargetGlobalLandRatioHint = "0.30";
    dataset.hearthLandEarthReferenceLandRatio = "0.29";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
