// /assets/hearth/hearth.land.channel.js
// HEARTH_LAND_GROUND_LEVEL_SURFACE_SEATING_BIRTH_TMT_v1
// Full-file replacement.
// Land Child / ground-level surface-seating authority only.
// Runtime Table-facing contract remains intentionally stable:
//   HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1
//
// Purpose:
// - Rebirth Hearth Land Channel as a ground-level, body-bound receiver.
// - Preserve the existing Runtime Table API and contract identity.
// - Stop land from reading as atmospheric/floating expression.
// - Ground only true land samples; do not fake land over water.
// - Keep shelf / shoreline / shallow-water samples valid without pretending they are solid land.
// - Remain safe without DOM, canvas, runtime, controls, Runtime Table, or upstream files.
//
// Owns:
// - land-channel expression
// - land receiver normalization
// - ground-level body/surface seating fields
// - crust/surface attachment fields
// - land alpha/body-binding fields
// - land-channel color packet
//
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
// - route orchestration
// - runtime motion
// - controls
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1";
  const RECEIPT = "HEARTH_LAND_GROUND_LEVEL_SURFACE_SEATING_BIRTH_RECEIPT_v1";
  const BIRTH_CONTRACT = "HEARTH_LAND_GROUND_LEVEL_SURFACE_SEATING_BIRTH_TMT_v1";
  const VERSION = "2026-05-29.hearth-land-ground-level-surface-seating-birth-tmt-v1";

  const ROOT = typeof window !== "undefined" ? window : globalThis;

  const RECEIVER_FOR_PLANET = "Hearth";

  const RECEIPT_PACKET = {
    contract: CONTRACT,
    receipt: RECEIPT,
    birthContract: BIRTH_CONTRACT,
    version: VERSION,
    authority: "land-ground-level-surface-seating-receiver",
    status: "active",
    destinationFile: "/assets/hearth/hearth.land.channel.js",
    channel: "land",
    role: "body-bound-ground-level-crust-surface-channel",
    purpose:
      "receive Hearth land-related authorities and expose one Runtime Table-readable ground-level land-channel output",
    receiverForPlanet: RECEIVER_FOR_PLANET,
    consumes: [
      "Hearth composition when available",
      "Hearth materials when available",
      "Hearth elevation when available",
      "Hearth tectonic hints when available",
      "deterministic local land fallback when upstream files are unavailable"
    ],
    exposedMethods: ["sample", "read", "getReceipt"],
    exposedFields: [
      "landPresence",
      "landAlpha",
      "landPotential",
      "landClass",
      "groundSeat",
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
      "rgb",
      "alpha",
      "sourceMode"
    ],
    renderLaw: [
      "land is body-bound",
      "land is ground-level",
      "land cannot float",
      "land cannot define water",
      "land cannot define air",
      "water/no-land samples must remain no-land",
      "shoreline and shelf samples may expose land potential without pretending to be solid land",
      "fallback land is allowed only as Land Child continuity, not final visual pass"
    ],
    owns: [
      "land-channel-expression",
      "land-receiver-normalization",
      "ground-seat-fields",
      "body-binding-fields",
      "surface-attachment-fields",
      "crust-density-fields",
      "terrain-relief-fields",
      "land-channel-color-packet"
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
      landValidationOk: true
    },
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  const clamp = (value, min = 0, max = 1) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  };

  const mix = (a, b, t) => a + (b - a) * clamp(t);

  const smooth = (edge0, edge1, value) => {
    const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  };

  const hash = (n) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  };

  const wave = (lon, lat, a, b, c) => {
    const lr = (lon * Math.PI) / 180;
    const br = (lat * Math.PI) / 180;
    return Math.sin(lr * a + br * b + c) * 0.5 + 0.5;
  };

  const normalizePoint = (input = {}) => {
    const hasUv =
      Number.isFinite(Number(input.u)) && Number.isFinite(Number(input.v));

    let u = hasUv ? Number(input.u) : null;
    let v = hasUv ? Number(input.v) : null;

    let lon = Number(input.lon);
    let lat = Number(input.lat);

    if (!Number.isFinite(lon) && u !== null) lon = u * 360 - 180;
    if (!Number.isFinite(lat) && v !== null) lat = 90 - v * 180;

    let x = Number(input.x);
    let y = Number(input.y);
    let z = Number(input.z);

    if (
      (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) &&
      Number.isFinite(lon) &&
      Number.isFinite(lat)
    ) {
      const lonRad = (lon * Math.PI) / 180;
      const latRad = (lat * Math.PI) / 180;
      const cosLat = Math.cos(latRad);
      x = cosLat * Math.sin(lonRad);
      y = Math.sin(latRad);
      z = cosLat * Math.cos(lonRad);
    }

    if (
      Number.isFinite(x) &&
      Number.isFinite(y) &&
      Number.isFinite(z)
    ) {
      const mag = Math.sqrt(x * x + y * y + z * z) || 1;
      x /= mag;
      y /= mag;
      z /= mag;

      if (!Number.isFinite(lat)) lat = (Math.asin(clamp(y, -1, 1)) * 180) / Math.PI;
      if (!Number.isFinite(lon)) lon = (Math.atan2(x, z) * 180) / Math.PI;
    }

    if (u === null || !Number.isFinite(u)) u = (lon + 180) / 360;
    if (v === null || !Number.isFinite(v)) v = (90 - lat) / 180;

    u = ((u % 1) + 1) % 1;
    v = clamp(v, 0, 1);
    lon = u * 360 - 180;
    lat = 90 - v * 180;

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      const lonRad = (lon * Math.PI) / 180;
      const latRad = (lat * Math.PI) / 180;
      const cosLat = Math.cos(latRad);
      x = cosLat * Math.sin(lonRad);
      y = Math.sin(latRad);
      z = cosLat * Math.cos(lonRad);
    }

    return { u, v, lon, lat, x, y, z };
  };

  const callAuthority = (authority, point) => {
    if (!authority) return null;

    const methods = ["sample", "read", "get", "at"];
    for (const method of methods) {
      if (typeof authority[method] !== "function") continue;
      try {
        const value = authority[method](point);
        if (value && typeof value === "object") return value;
      } catch (_) {
        continue;
      }
    }

    if (typeof authority === "function") {
      try {
        const value = authority(point);
        if (value && typeof value === "object") return value;
      } catch (_) {
        return null;
      }
    }

    return null;
  };

  const collectSources = (point) => {
    const composition =
      callAuthority(ROOT.HEARTH_COMPOSITION, point) ||
      callAuthority(ROOT.HEARTH_COMPOSITION_AUTHORITY, point) ||
      callAuthority(ROOT.HearthComposition, point);

    const materials =
      callAuthority(ROOT.HEARTH_MATERIALS, point) ||
      callAuthority(ROOT.HEARTH_MATERIALS_AUTHORITY, point) ||
      callAuthority(ROOT.HearthMaterials, point);

    const elevation =
      callAuthority(ROOT.HEARTH_ELEVATION, point) ||
      callAuthority(ROOT.HEARTH_ELEVATION_AUTHORITY, point) ||
      callAuthority(ROOT.HearthElevation, point);

    const tectonics =
      callAuthority(ROOT.HEARTH_TECTONICS, point) ||
      callAuthority(ROOT.HEARTH_TECTONICS_AUTHORITY, point) ||
      callAuthority(ROOT.HearthTectonics, point);

    const sources = { composition, materials, elevation, tectonics };
    const present = Object.entries(sources)
      .filter(([, value]) => !!value)
      .map(([key]) => key);

    return {
      ...sources,
      sourceCount: present.length,
      sourceOrder: present,
      sourceAuthority: present.length ? present.join(",") : "deterministic-local-fallback",
      sourceMode: present.length ? "upstream-land-receiver" : "deterministic-local-land-fallback"
    };
  };

  const readFirstNumber = (objects, fields, fallback = 0) => {
    for (const object of objects) {
      if (!object || typeof object !== "object") continue;
      for (const field of fields) {
        const value = Number(object[field]);
        if (Number.isFinite(value)) return value;
      }
    }
    return fallback;
  };

  const readFirstString = (objects, fields, fallback = "") => {
    for (const object of objects) {
      if (!object || typeof object !== "object") continue;
      for (const field of fields) {
        const value = object[field];
        if (typeof value === "string" && value.trim()) return value.trim();
      }
    }
    return fallback;
  };

  const readFirstBool = (objects, fields, fallback = null) => {
    for (const object of objects) {
      if (!object || typeof object !== "object") continue;
      for (const field of fields) {
        if (typeof object[field] === "boolean") return object[field];
      }
    }
    return fallback;
  };

  const fallbackElevation = (point) => {
    const { lon, lat } = point;

    const continental =
      wave(lon, lat, 1.15, 0.65, 0.2) * 0.34 +
      wave(lon, lat, 2.3, -1.1, 1.4) * 0.26 +
      wave(lon, lat, -3.7, 1.9, 2.1) * 0.2 +
      wave(lon, lat, 5.1, 2.6, 0.7) * 0.12 +
      hash(Math.floor((lon + 180) * 0.7) + Math.floor((lat + 90) * 1.3) * 19) * 0.08;

    const polarWeight = smooth(58, 84, Math.abs(lat)) * 0.08;
    const seamSoftener = 0.02 * Math.cos((lon * Math.PI) / 90);

    return continental - 0.61 + polarWeight + seamSoftener;
  };

  const classifyWaterLike = (terrainClass, materialClass, hydrologyClass) => {
    const text = `${terrainClass} ${materialClass} ${hydrologyClass}`.toLowerCase();

    if (!text.trim()) return false;

    return [
      "water",
      "ocean",
      "sea",
      "basin",
      "submerged",
      "shelf",
      "shore",
      "wet",
      "reef",
      "bay",
      "inlet",
      "lake",
      "river"
    ].some((term) => text.includes(term));
  };

  const classifyLandLike = (terrainClass, materialClass, compositionClass) => {
    const text = `${terrainClass} ${materialClass} ${compositionClass}`.toLowerCase();

    if (!text.trim()) return false;

    return [
      "land",
      "mountain",
      "ridge",
      "plateau",
      "highland",
      "lowland",
      "plain",
      "valley",
      "canyon",
      "desert",
      "forest",
      "jungle",
      "tundra",
      "crust",
      "rock",
      "stone",
      "soil",
      "continent",
      "island",
      "peninsula",
      "cliff",
      "escarpment"
    ].some((term) => text.includes(term));
  };

  const resolveLandState = (point, sources) => {
    const sourceObjects = [
      sources.composition,
      sources.materials,
      sources.elevation,
      sources.tectonics
    ];

    const terrainClass = readFirstString(
      sourceObjects,
      ["terrainClass", "compatibilityTerrainClass", "class", "landClass"],
      ""
    );

    const materialClass = readFirstString(
      sourceObjects,
      ["materialClass", "surfaceClass", "material", "surfaceMaterial"],
      ""
    );

    const compositionClass = readFirstString(
      sourceObjects,
      ["compositionClass", "continentClass", "continentId", "dominantCoreId"],
      ""
    );

    const hydrologyClass = readFirstString(
      sourceObjects,
      ["hydrologyClass", "waterClass", "channelClass"],
      ""
    );

    const upstreamIsLand = readFirstBool(
      sourceObjects,
      ["isLand", "land", "aboveSeaLevel"],
      null
    );

    const upstreamIsWater = readFirstBool(
      sourceObjects,
      ["isWater", "water", "belowSeaLevel"],
      null
    );

    const elevation = readFirstNumber(
      sourceObjects,
      ["elevation", "height", "altitude", "surfaceElevation"],
      fallbackElevation(point)
    );

    const seaLevel = readFirstNumber(sourceObjects, ["seaLevel"], 0);

    const terrainLandLike = classifyLandLike(
      terrainClass,
      materialClass,
      compositionClass
    );

    const terrainWaterLike = classifyWaterLike(
      terrainClass,
      materialClass,
      hydrologyClass
    );

    const elevationLand = elevation > seaLevel + 0.012;
    const elevationShelf = elevation > seaLevel - 0.08 && elevation <= seaLevel + 0.012;
    const elevationDeepWater = elevation <= seaLevel - 0.08;

    let landTruth = false;

    if (upstreamIsLand === true && upstreamIsWater !== true) {
      landTruth = true;
    } else if (upstreamIsWater === true) {
      landTruth = false;
    } else if (terrainLandLike && !terrainWaterLike) {
      landTruth = true;
    } else if (terrainWaterLike) {
      landTruth = false;
    } else {
      landTruth = elevationLand;
    }

    const shelfTruth = !landTruth && (terrainWaterLike || elevationShelf);
    const openWaterTruth = !landTruth && !shelfTruth && elevationDeepWater;

    const elevationRise = smooth(seaLevel - 0.02, seaLevel + 0.22, elevation);
    const shelfSignal = shelfTruth ? smooth(seaLevel - 0.09, seaLevel + 0.015, elevation) : 0;
    const reliefSignal = clamp(
      readFirstNumber(
        sourceObjects,
        ["terrainRelief", "reliefStrength", "ridgeRelief", "roughness"],
        Math.abs(elevation - seaLevel) * 1.6
      )
    );

    const landPotential = landTruth
      ? clamp(0.56 + elevationRise * 0.34 + reliefSignal * 0.1)
      : shelfTruth
        ? clamp(0.08 + shelfSignal * 0.22)
        : clamp(0.02 + Math.max(0, elevation - seaLevel + 0.08) * 0.4);

    const landPresence = landTruth
      ? clamp(0.68 + elevationRise * 0.24 + reliefSignal * 0.08)
      : shelfTruth
        ? clamp(0.04 + shelfSignal * 0.16)
        : clamp(landPotential * 0.35, 0.015, 0.075);

    const landAlpha = landTruth
      ? clamp(0.72 + elevationRise * 0.18 + reliefSignal * 0.1)
      : shelfTruth
        ? clamp(0.035 + shelfSignal * 0.14)
        : clamp(landPresence, 0.012, 0.075);

    const groundSeat = landTruth ? clamp(0.86 + elevationRise * 0.1) : 0;
    const bodyBinding = landTruth ? clamp(0.88 + elevationRise * 0.09) : 0;
    const surfaceAttachment = landTruth ? clamp(0.86 + elevationRise * 0.1) : 0;
    const crustDensity = landTruth ? clamp(0.55 + elevationRise * 0.32 + reliefSignal * 0.13) : 0;
    const materialDensity = landTruth ? clamp(0.48 + elevationRise * 0.28 + reliefSignal * 0.12) : 0;

    const coastPotential = shelfTruth
      ? clamp(0.45 + shelfSignal * 0.35)
      : landTruth
        ? clamp(0.16 + (1 - elevationRise) * 0.22)
        : clamp(0.04 + shelfSignal * 0.2);

    const shorelineContact = shelfTruth || (landTruth && elevation < seaLevel + 0.12)
      ? clamp(coastPotential)
      : clamp(coastPotential * 0.35);

    const plateauPotential = landTruth
      ? clamp(smooth(0.12, 0.42, elevation - seaLevel) * (0.4 + reliefSignal * 0.3))
      : 0;

    const basinPotential = !landTruth
      ? clamp(smooth(0.02, 0.28, seaLevel - elevation))
      : clamp(smooth(-0.03, 0.07, seaLevel - elevation) * 0.2);

    const canyonPotential = landTruth
      ? clamp(reliefSignal * wave(point.lon, point.lat, 4.2, -2.1, 0.6) * 0.58)
      : 0;

    const escarpmentPotential = landTruth
      ? clamp(reliefSignal * wave(point.lon, point.lat, -5.7, 2.8, 1.7) * 0.64)
      : 0;

    const ridgeRelief = landTruth
      ? clamp(reliefSignal * (0.42 + wave(point.lon, point.lat, 6.1, 1.4, 2.3) * 0.38))
      : 0;

    const terrainRelief = landTruth ? clamp(reliefSignal * 0.92 + elevationRise * 0.08) : 0;

    const landClass = landTruth
      ? elevation - seaLevel > 0.38
        ? "grounded-highland"
        : elevation - seaLevel > 0.18
          ? "grounded-plateau"
          : elevation - seaLevel > 0.045
            ? "grounded-lowland"
            : "grounded-coastal-land"
      : shelfTruth
        ? "shoreline-shelf-no-solid-land"
        : "no-land";

    const channelClass = landTruth
      ? "ground-level-land"
      : shelfTruth
        ? "land-potential-shelf"
        : "no-land";

    const bodyBound = landTruth;
    const surfaceBound = landTruth;

    return {
      terrainClass: terrainClass || (landTruth ? "land" : shelfTruth ? "shallow_water" : "open_water"),
      compatibilityTerrainClass:
        terrainClass || (landTruth ? "land" : shelfTruth ? "shallow_water" : "open_water"),
      materialClass,
      compositionClass,
      hydrologyClass,
      elevation,
      seaLevel,
      landTruth,
      shelfTruth,
      openWaterTruth,
      channelClass,
      landClass,
      landPresence,
      landAlpha,
      landPotential,
      groundSeat,
      bodyBinding,
      surfaceAttachment,
      materialDensity,
      crustDensity,
      reliefStrength: terrainRelief,
      reliefBinding: landTruth ? clamp(0.76 + terrainRelief * 0.2) : 0,
      curvatureLock: landTruth ? 1 : shelfTruth ? 0.46 : 0.24,
      contactOcclusion: landTruth ? clamp(0.26 + terrainRelief * 0.35) : 0,
      underlandShadow: landTruth ? clamp(0.24 + terrainRelief * 0.28) : 0,
      terrainRelief,
      ridgeRelief,
      plateauPotential,
      basinPotential,
      canyonPotential,
      escarpmentPotential,
      mountainArcPotential: ridgeRelief,
      ridgePotential: ridgeRelief,
      shorelineContact,
      coastPotential,
      bodyBound,
      surfaceBound,
      atmosphericRejection: landTruth ? 1 : shelfTruth ? 0.66 : 0.34
    };
  };

  const colorForLand = (state) => {
    if (!state.landTruth) {
      return state.shelfTruth ? [34, 37, 31] : [30, 32, 27];
    }

    const high = smooth(0.18, 0.52, state.elevation - state.seaLevel);
    const relief = clamp(state.terrainRelief);
    const coast = clamp(state.shorelineContact);

    const r = Math.round(mix(78, 128, high) + relief * 18 - coast * 8);
    const g = Math.round(mix(76, 112, high) + relief * 14 - coast * 6);
    const b = Math.round(mix(50, 76, high) + relief * 10 - coast * 5);

    return [
      clamp(r, 42, 156),
      clamp(g, 42, 142),
      clamp(b, 32, 104)
    ];
  };

  const buildSample = (input = {}) => {
    const point = normalizePoint(input);
    const sources = collectSources(point);
    const state = resolveLandState(point, sources);
    const rgb = colorForLand(state);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      birthContract: BIRTH_CONTRACT,
      version: VERSION,
      authority: "land-ground-level-surface-seating-receiver",

      x: point.x,
      y: point.y,
      z: point.z,
      u: point.u,
      v: point.v,
      lon: point.lon,
      lat: point.lat,

      sourceContract:
        readFirstString(
          [sources.composition, sources.materials, sources.elevation, sources.tectonics],
          ["contract"],
          BIRTH_CONTRACT
        ),
      sourceReceipt:
        readFirstString(
          [sources.composition, sources.materials, sources.elevation, sources.tectonics],
          ["receipt"],
          RECEIPT
        ),
      sourceAuthority: sources.sourceAuthority,
      sourceMode: sources.sourceMode,
      sourceCount: sources.sourceCount,
      sourceOrder: sources.sourceOrder,

      channel: "land",
      channelClass: state.channelClass,
      landClass: state.landClass,

      isLandChannel: true,
      isWaterChannel: false,
      isAirChannel: false,

      landPresence: state.landPresence,
      landAlpha: state.landAlpha,
      landPotential: state.landPotential,
      isLand: state.landTruth,

      elevation: state.elevation,
      seaLevel: state.seaLevel,

      groundSeat: state.groundSeat,
      massAnchor: state.bodyBinding,
      bodyBinding: state.bodyBinding,
      surfaceAttachment: state.surfaceAttachment,
      materialDensity: state.materialDensity,
      crustDensity: state.crustDensity,

      reliefStrength: state.reliefStrength,
      reliefBinding: state.reliefBinding,
      curvatureLock: state.curvatureLock,
      contactOcclusion: state.contactOcclusion,
      underlandShadow: state.underlandShadow,

      terrainRelief: state.terrainRelief,
      ridgeRelief: state.ridgeRelief,
      plateauPotential: state.plateauPotential,
      basinPotential: state.basinPotential,
      canyonPotential: state.canyonPotential,
      escarpmentPotential: state.escarpmentPotential,
      mountainArcPotential: state.mountainArcPotential,
      ridgePotential: state.ridgePotential,

      shorelineContact: state.shorelineContact,
      coastPotential: state.coastPotential,

      bodyBound: state.bodyBound,
      surfaceBound: state.surfaceBound,
      floatsAboveBody: false,
      allowedToFloat: false,
      atmosphericRejection: state.atmosphericRejection,

      mayDefineWater: false,
      mayDefineAir: false,
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

      rgb,
      color: rgb,
      alpha: state.landAlpha,
      debugColor: state.landTruth ? [132, 105, 60] : state.shelfTruth ? [92, 82, 58] : [38, 41, 33],

      terrainClass: state.terrainClass,
      compatibilityTerrainClass: state.compatibilityTerrainClass,
      materialClass: state.materialClass,
      compositionClass: state.compositionClass,
      hydrologyClass: state.hydrologyClass,

      receiverForPlanet: RECEIVER_FOR_PLANET,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  };

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    birthContract: BIRTH_CONTRACT,
    version: VERSION,
    authority: "land-ground-level-surface-seating-receiver",
    channel: "land",
    receiverForPlanet: RECEIVER_FOR_PLANET,

    sample(input) {
      return buildSample(input);
    },

    read(input) {
      return buildSample(input);
    },

    getReceipt() {
      return { ...RECEIPT_PACKET };
    }
  };

  ROOT.HEARTH_LAND_CHANNEL = api;

  if (ROOT.document && ROOT.document.documentElement) {
    const dataset = ROOT.document.documentElement.dataset;
    dataset.hearthLandChannelLoaded = "true";
    dataset.hearthLandChannelContract = CONTRACT;
    dataset.hearthLandChannelReceipt = RECEIPT;
    dataset.hearthLandChildBirthContract = BIRTH_CONTRACT;
    dataset.hearthLandChannelAuthority = "land-ground-level-surface-seating-receiver";
    dataset.hearthLandChannelBodyBound = "true";
    dataset.hearthLandChannelGroundLevel = "true";
    dataset.hearthLandChannelAllowedToFloat = "false";
    dataset.hearthLandChannelDefinesWater = "false";
    dataset.hearthLandChannelDefinesAir = "false";
    dataset.hearthLandChannelReceiverForPlanet = RECEIVER_FOR_PLANET;
    dataset.hearthLandChannelExportsImmediately = "true";
    dataset.hearthLandChannelSafeWithoutUpstreamLand = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }
})();
