// /assets/hearth/hearth.land.channel.js
// HEARTH_LAND_CHILD_TNT_TERMINOLOGY_AND_WIDE_PROBE_DIAGNOSTIC_ALIGNMENT_TNT_v1
// Full-file replacement.
// Land channel authority only.
// Purpose:
// - Preserve the Runtime Table expected public contract: HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1.
// - Correct land-child birth terminology to TNT.
// - Keep land body-bound and ground-level.
// - Prevent a single no-land / shallow-water anchor probe from being treated as global land-distribution evidence.
// - Expose wide-probe diagnostic alignment through the existing read method without changing the public method set.
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
  const RECEIPT = "HEARTH_LAND_GROUND_LEVEL_SURFACE_SEATING_BIRTH_RECEIPT_v1";
  const BIRTH_CONTRACT = "HEARTH_LAND_GROUND_LEVEL_SURFACE_SEATING_BIRTH_TNT_v1";
  const VERSION = "2026-05-29.hearth-land-ground-level-surface-seating-birth-tnt-v1";
  const AUTHORITY = "land-ground-level-surface-seating-receiver";
  const DESTINATION_FILE = "/assets/hearth/hearth.land.channel.js";

  const ROOT = typeof window !== "undefined" ? window : globalThis;
  const DOC = typeof document !== "undefined" ? document : null;

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function isObject(value) {
    return value !== null && typeof value === "object";
  }

  function finiteNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function firstNumber(...values) {
    for (const value of values) {
      const n = Number(value);
      if (Number.isFinite(n)) return n;
    }
    return 0;
  }

  function firstText(...values) {
    for (const value of values) {
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
  }

  function toRad(degrees) {
    return (degrees * Math.PI) / 180;
  }

  function toDeg(radians) {
    return (radians * 180) / Math.PI;
  }

  function smoothstep(edge0, edge1, value) {
    if (edge0 === edge1) return value >= edge1 ? 1 : 0;
    const t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function hash2(a, b) {
    const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function normalizePoint(input) {
    const src = isObject(input) ? input : {};

    let x = Number(src.x);
    let y = Number(src.y);
    let z = Number(src.z);
    let u = Number(src.u);
    let v = Number(src.v);
    let lon = Number(src.lon);
    let lat = Number(src.lat);

    const hasVector =
      Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z);
    const hasUv = Number.isFinite(u) && Number.isFinite(v);
    const hasLonLat = Number.isFinite(lon) && Number.isFinite(lat);

    if (hasVector) {
      const magnitude = Math.sqrt(x * x + y * y + z * z) || 1;
      x /= magnitude;
      y /= magnitude;
      z /= magnitude;

      if (!hasLonLat) {
        lat = toDeg(Math.asin(clamp(y, -1, 1)));
        lon = toDeg(Math.atan2(x, z));
      }

      if (!hasUv) {
        u = (lon + 180) / 360;
        v = (90 - lat) / 180;
      }
    } else {
      if (!hasLonLat) {
        lon = hasUv ? u * 360 - 180 : 0;
        lat = hasUv ? 90 - v * 180 : 0;
      }

      if (!hasUv) {
        u = (lon + 180) / 360;
        v = (90 - lat) / 180;
      }

      const lonRad = toRad(lon);
      const latRad = toRad(lat);
      const cosLat = Math.cos(latRad);
      x = cosLat * Math.sin(lonRad);
      y = Math.sin(latRad);
      z = cosLat * Math.cos(lonRad);
    }

    return {
      x: finiteNumber(x, 0),
      y: finiteNumber(y, 0),
      z: finiteNumber(z, 1),
      u: clamp01(u),
      v: clamp01(v),
      lon: clamp(lon, -180, 180),
      lat: clamp(lat, -90, 90)
    };
  }

  function getHearthNamespace() {
    if (!isObject(ROOT.HEARTH)) ROOT.HEARTH = {};
    return ROOT.HEARTH;
  }

  function firstSource(...sources) {
    for (const source of sources) {
      if (isObject(source)) return source;
    }
    return null;
  }

  function getSources() {
    const hearth = getHearthNamespace();

    return {
      composition: firstSource(
        ROOT.HEARTH_COMPOSITION,
        hearth.composition,
        hearth.COMPOSITION
      ),
      materials: firstSource(
        ROOT.HEARTH_MATERIALS,
        hearth.materials,
        hearth.MATERIALS
      ),
      elevation: firstSource(
        ROOT.HEARTH_ELEVATION,
        hearth.elevation,
        hearth.ELEVATION
      ),
      tectonics: firstSource(
        ROOT.HEARTH_TECTONICS,
        hearth.tectonics,
        hearth.TECTONICS
      )
    };
  }

  function callSource(source, point) {
    if (!isObject(source)) return null;

    const candidates = ["sample", "read", "resolve", "getSample", "getPoint"];

    for (const method of candidates) {
      if (typeof source[method] !== "function") continue;

      try {
        const result = source[method](point);
        if (isObject(result)) return result;
      } catch (_error) {
        return null;
      }
    }

    return null;
  }

  function fallbackElevation(point) {
    const lon = point.lon;
    const lat = point.lat;
    const n1 = Math.sin(toRad(lon * 1.7)) * Math.cos(toRad(lat * 1.15));
    const n2 = Math.sin(toRad(lon * 3.3 + lat * 0.7)) * 0.35;
    const n3 = (hash2(Math.floor((lon + 180) / 18), Math.floor((lat + 90) / 18)) - 0.5) * 0.08;
    return n1 * 0.08 + n2 * 0.04 + n3 - 0.025;
  }

  function classHas(text, pattern) {
    return pattern.test(String(text || "").toLowerCase());
  }

  function isWaterClass(value) {
    return classHas(
      value,
      /open[-_\s]?ocean|deep[-_\s]?water|shallow[-_\s]?water|basin|water|sea|marine|submerged/
    );
  }

  function isShelfClass(value) {
    return classHas(
      value,
      /shelf|shore|coast|coastal|beach|wetstone|waterline|transition|shallows/
    );
  }

  function isSolidLandClass(value) {
    return classHas(
      value,
      /land|continent|plateau|mountain|ridge|crust|highland|upland|plain|valley|canyon|escarpment|rock|stone|terrain/
    ) && !isWaterClass(value);
  }

  function fallbackTerrainClass(elevation, seaLevel) {
    if (elevation > seaLevel + 0.18) return "mountain-land";
    if (elevation > seaLevel + 0.08) return "highland-land";
    if (elevation > seaLevel + 0.018) return "solid-land";
    if (elevation > seaLevel - 0.075) return "shallow-water";
    return "open-ocean";
  }

  function deriveSample(point) {
    const sources = getSources();
    const composition = callSource(sources.composition, point) || {};
    const materials = callSource(sources.materials, point) || {};
    const elevationPacket = callSource(sources.elevation, point) || {};
    const tectonics = callSource(sources.tectonics, point) || {};

    const elevation = firstNumber(
      composition.elevation,
      materials.elevation,
      elevationPacket.elevation,
      tectonics.elevation,
      fallbackElevation(point)
    );

    const seaLevel = firstNumber(
      composition.seaLevel,
      materials.seaLevel,
      elevationPacket.seaLevel,
      0
    );

    const terrainClass = firstText(
      composition.terrainClass,
      composition.compatibilityTerrainClass,
      materials.terrainClass,
      materials.compatibilityTerrainClass,
      elevationPacket.terrainClass,
      fallbackTerrainClass(elevation, seaLevel)
    );

    const materialClass = firstText(
      materials.materialClass,
      materials.className,
      composition.materialClass,
      ""
    );

    const compositionClass = firstText(
      composition.compositionClass,
      composition.continentClass,
      composition.dominantCoreId,
      ""
    );

    const hydrologyClass = firstText(
      materials.hydrologyClass,
      composition.hydrologyClass,
      ""
    );

    const upstreamLandFlag =
      composition.isLand === true ||
      materials.isLand === true ||
      elevationPacket.isLand === true;

    const classSaysSolidLand =
      isSolidLandClass(terrainClass) ||
      isSolidLandClass(materialClass) ||
      isSolidLandClass(compositionClass);

    const classSaysWater =
      isWaterClass(terrainClass) ||
      isWaterClass(materialClass) ||
      isWaterClass(hydrologyClass);

    const shelfByClass =
      isShelfClass(terrainClass) ||
      isShelfClass(materialClass) ||
      isShelfClass(hydrologyClass);

    const aboveWater = elevation > seaLevel + 0.018;
    const nearShore = elevation > seaLevel - 0.08 && elevation <= seaLevel + 0.018;

    const isLand = Boolean((upstreamLandFlag || classSaysSolidLand || aboveWater) && !classSaysWater);
    const isShelf = Boolean(!isLand && (shelfByClass || nearShore));
    const isWater = Boolean(!isLand && (classSaysWater || elevation <= seaLevel + 0.018));

    const elevationLift = smoothstep(seaLevel - 0.02, seaLevel + 0.28, elevation);
    const shelfLift = isShelf ? smoothstep(seaLevel - 0.09, seaLevel + 0.018, elevation) : 0;
    const tectonicPressure = clamp01(firstNumber(
      tectonics.tectonicPressure,
      tectonics.pressure,
      composition.tectonicPressure,
      Math.abs(Math.sin(toRad(point.lon * 1.8)) * Math.cos(toRad(point.lat * 1.4)))
    ));

    const ridgePressure = clamp01(firstNumber(
      tectonics.ridgePressure,
      tectonics.ridgeRelief,
      composition.ridgeRelief,
      elevationLift * tectonicPressure
    ));

    const coastPotential = clamp01(firstNumber(
      composition.coastPotential,
      materials.coastPotential,
      materials.shorelineContact,
      shelfLift * 0.7 + (isShelf ? 0.24 : 0)
    ));

    const shorelineContact = clamp01(firstNumber(
      composition.shorelineContact,
      materials.shorelineContact,
      coastPotential
    ));

    const landPotential = clamp01(
      firstNumber(composition.landPotential, materials.landPotential, 0) ||
      (isLand ? 0.55 + elevationLift * 0.35 + tectonicPressure * 0.1 : 0) ||
      (isShelf ? 0.08 + coastPotential * 0.16 : 0.02)
    );

    const groundSeat = isLand ? clamp01(0.62 + elevationLift * 0.24 + tectonicPressure * 0.1) : 0;
    const bodyBinding = isLand ? clamp01(0.74 + groundSeat * 0.18 + ridgePressure * 0.08) : 0;
    const surfaceAttachment = isLand ? clamp01(0.7 + groundSeat * 0.22 + elevationLift * 0.08) : 0;

    const materialDensity = isLand
      ? clamp01(0.36 + elevationLift * 0.34 + tectonicPressure * 0.18)
      : isShelf
        ? clamp01(0.08 + coastPotential * 0.12)
        : 0;

    const crustDensity = isLand
      ? clamp01(0.42 + elevationLift * 0.28 + ridgePressure * 0.18)
      : isShelf
        ? clamp01(0.05 + coastPotential * 0.08)
        : 0;

    const reliefStrength = isLand ? clamp01(0.22 + ridgePressure * 0.5 + elevationLift * 0.18) : 0;
    const reliefBinding = isLand ? clamp01(0.32 + reliefStrength * 0.55) : 0;
    const curvatureLock = isLand ? clamp01(0.78 + bodyBinding * 0.12) : 0.46;
    const contactOcclusion = isLand ? clamp01(0.18 + reliefStrength * 0.22) : 0;
    const underlandShadow = isLand ? clamp01(0.22 + crustDensity * 0.2) : 0;

    const terrainRelief = reliefStrength;
    const ridgeRelief = isLand ? clamp01(ridgePressure * 0.85) : 0;
    const plateauPotential = isLand ? clamp01(elevationLift * 0.55 + tectonicPressure * 0.2) : 0;
    const basinPotential = isLand ? clamp01((1 - elevationLift) * 0.16) : clamp01(shelfLift * 0.08);
    const canyonPotential = isLand ? clamp01(ridgePressure * (1 - elevationLift) * 0.38) : 0;
    const escarpmentPotential = isLand ? clamp01(ridgePressure * 0.44 + coastPotential * 0.1) : 0;
    const mountainArcPotential = isLand ? clamp01(ridgePressure * elevationLift * 0.72) : 0;
    const ridgePotential = ridgeRelief;

    const landPresence = isLand
      ? clamp01(0.48 + elevationLift * 0.32 + materialDensity * 0.16)
      : isShelf
        ? clamp01(0.05 + coastPotential * 0.08)
        : 0.018;

    const landAlpha = isLand
      ? clamp01(0.24 + landPresence * 0.58)
      : isShelf
        ? clamp01(0.045 + coastPotential * 0.07)
        : 0.018;

    const bodyBound = Boolean(isLand && bodyBinding >= 0.52 && surfaceAttachment >= 0.5);
    const surfaceBound = Boolean(isLand && surfaceAttachment >= 0.5);
    const atmosphericRejection = isLand ? 0.86 : isShelf ? 0.66 : 0.72;

    const rgb = isLand
      ? landRgb(elevationLift, materialDensity, ridgePressure)
      : isShelf
        ? [34, 37, 31]
        : [28, 31, 29];

    const diagnosticEligible = Boolean(isLand && landAlpha >= 0.2 && bodyBound);
    const singleProbeDistributionEvidence = false;
    const diagnosticClass = isLand
      ? "solid-land-body-sample"
      : isShelf
        ? "excluded-shoreline-shelf-no-solid-land"
        : "excluded-no-land-water-sample";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      birthContract: BIRTH_CONTRACT,
      version: VERSION,
      authority: AUTHORITY,

      x: point.x,
      y: point.y,
      z: point.z,
      u: point.u,
      v: point.v,
      lon: point.lon,
      lat: point.lat,

      sourceContract: firstText(
        composition.contract,
        materials.contract,
        elevationPacket.contract,
        tectonics.contract,
        "deterministic-local-land-continuity"
      ),
      sourceReceipt: firstText(
        composition.receipt,
        materials.receipt,
        elevationPacket.receipt,
        tectonics.receipt,
        "deterministic-local-land-continuity-receipt"
      ),
      sourceAuthority: "composition,materials,elevation,tectonics",
      sourceMode: hasAnySource(composition, materials, elevationPacket, tectonics)
        ? "upstream-land-receiver"
        : "deterministic-local-land-continuity",
      sourceCount: countSources(composition, materials, elevationPacket, tectonics),
      sourceOrder: ["composition", "materials", "elevation", "tectonics"],

      channel: "land",
      channelClass: isLand ? "body-bound-ground-land" : isShelf ? "land-potential-shelf" : "no-land",
      landClass: isLand ? "solid-ground-land" : isShelf ? "shoreline-shelf-no-solid-land" : "no-land",
      isLandChannel: true,
      isWaterChannel: false,
      isAirChannel: false,

      landPresence,
      landAlpha,
      landPotential,
      isLand,
      isWater,

      elevation,
      seaLevel,
      groundSeat,
      massAnchor: groundSeat,
      bodyBinding,
      surfaceAttachment,
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
      basinPotential,
      canyonPotential,
      escarpmentPotential,
      mountainArcPotential,
      ridgePotential,
      shorelineContact,
      coastPotential,

      bodyBound,
      surfaceBound,
      floatsAboveBody: false,
      allowedToFloat: false,
      atmosphericRejection,
      mayDefineWater: false,
      mayDefineAir: false,

      diagnosticEligible,
      diagnosticClass,
      singleProbeDistributionEvidence,
      requiresWideProbeForDistribution: true,
      minimumWideProbePoints: 25,
      diagnosticNote:
        "No-land and shallow-water anchor samples are local samples only; they are not valid global land-distribution evidence.",

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
      color: rgb.slice(),
      alpha: landAlpha,
      debugColor: isLand ? [142, 116, 70] : isShelf ? [92, 82, 58] : [54, 55, 48],

      terrainClass,
      compatibilityTerrainClass: terrainClass,
      materialClass,
      compositionClass,
      hydrologyClass,
      receiverForPlanet: "Hearth",

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function landRgb(elevationLift, materialDensity, ridgePressure) {
    const low = [48, 48, 36];
    const mid = [82, 72, 48];
    const high = [112, 100, 72];

    const t = clamp01(elevationLift * 0.72 + materialDensity * 0.2 + ridgePressure * 0.08);
    const a = t < 0.5 ? low : mid;
    const b = t < 0.5 ? mid : high;
    const localT = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;

    return [
      Math.round(a[0] + (b[0] - a[0]) * localT),
      Math.round(a[1] + (b[1] - a[1]) * localT),
      Math.round(a[2] + (b[2] - a[2]) * localT)
    ];
  }

  function hasAnySource(...packets) {
    return packets.some((packet) => isObject(packet) && Object.keys(packet).length > 0);
  }

  function countSources(...packets) {
    return packets.filter((packet) => isObject(packet) && Object.keys(packet).length > 0).length;
  }

  function sample(input) {
    const point = normalizePoint(input);
    return deriveSample(point);
  }

  function runWideProbe(input) {
    const config = isObject(input) ? input : {};
    const columns = clamp(Math.floor(finiteNumber(config.columns, config.cols || 9)), 5, 25);
    const rows = clamp(Math.floor(finiteNumber(config.rows, 5)), 3, 15);

    const samples = [];
    let solidLandCount = 0;
    let shelfCount = 0;
    let waterCount = 0;
    let diagnosticEligibleCount = 0;
    let landAlphaTotal = 0;
    let waterLikeCount = 0;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        const u = (col + 0.5) / columns;
        const v = (row + 0.5) / rows;
        const point = normalizePoint({ u, v });
        const reading = sample(point);

        samples.push({
          u: reading.u,
          v: reading.v,
          lon: reading.lon,
          lat: reading.lat,
          isLand: reading.isLand,
          isWater: reading.isWater,
          landAlpha: reading.landAlpha,
          bodyBound: reading.bodyBound,
          landClass: reading.landClass,
          diagnosticEligible: reading.diagnosticEligible
        });

        if (reading.isLand) solidLandCount += 1;
        if (reading.landClass === "shoreline-shelf-no-solid-land") shelfCount += 1;
        if (reading.isWater) waterCount += 1;
        if (reading.isWater || reading.landClass === "no-land") waterLikeCount += 1;
        if (reading.diagnosticEligible) diagnosticEligibleCount += 1;
        landAlphaTotal += reading.landAlpha;
      }
    }

    const total = samples.length || 1;
    const landCoverage = solidLandCount / total;
    const shelfCoverage = shelfCount / total;
    const waterCoverage = waterCount / total;
    const diagnosticEligibleCoverage = diagnosticEligibleCount / total;
    const averageLandAlpha = landAlphaTotal / total;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      diagnosticContract: "HEARTH_LAND_WIDE_PROBE_DIAGNOSTIC_ALIGNMENT_TNT_v1",
      diagnosticReceipt: "HEARTH_LAND_WIDE_PROBE_DIAGNOSTIC_ALIGNMENT_RECEIPT_v1",
      version: VERSION,
      authority: AUTHORITY,
      mode: "wide-probe",
      probeRows: rows,
      probeColumns: columns,
      total,
      solidLandCount,
      shelfCount,
      waterCount,
      waterLikeCount,
      diagnosticEligibleCount,
      landCoverage,
      shelfCoverage,
      waterCoverage,
      diagnosticEligibleCoverage,
      averageLandAlpha,
      singleAnchorUsed: false,
      singleAnchorDistributionEvidence: false,
      noLandAnchorMayFailDistribution: false,
      warningEligible: total >= 25,
      conclusion:
        total >= 25
          ? "Wide probe is valid for distribution review."
          : "Probe grid is too small for distribution review.",
      samples,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function read(input) {
    if (isObject(input) && (input.mode === "wide-probe" || input.wideProbe === true)) {
      return runWideProbe(input);
    }

    return sample(input);
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      birthContract: BIRTH_CONTRACT,
      version: VERSION,
      authority: AUTHORITY,
      status: "active",
      destinationFile: DESTINATION_FILE,
      channel: "land",
      role: "body-bound-ground-level-crust-surface-channel",
      purpose:
        "receive Hearth land-related authorities and expose one Runtime Table-readable ground-level land-channel output",
      receiverForPlanet: "Hearth",
      consumes: [
        "Hearth composition when available",
        "Hearth materials when available",
        "Hearth elevation when available",
        "Hearth tectonic hints when available",
        "deterministic local land fallback when upstream files are unavailable"
      ],
      exposedMethods: ["sample", "read", "getReceipt"],
      readModes: ["sample", "wide-probe"],
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
        "diagnosticEligible",
        "diagnosticClass",
        "singleProbeDistributionEvidence",
        "requiresWideProbeForDistribution",
        "rgb",
        "alpha",
        "sourceMode"
      ],
      diagnosticAlignment: {
        wideProbeEnabled: true,
        wideProbeReadMode: "read({ mode: 'wide-probe', rows: 5, columns: 9 })",
        minimumWideProbePoints: 25,
        singleAnchorDistributionEvidence: false,
        noLandAnchorMayFailDistribution: false,
        shallowWaterAnchorMayFailLandBodyBinding: false,
        rule:
          "A no-land, water, or shoreline-shelf anchor sample may describe the local point, but it cannot prove global land-distribution or land-body-binding failure."
      },
      renderLaw: [
        "land is body-bound",
        "land is ground-level",
        "land cannot float",
        "land cannot define water",
        "land cannot define air",
        "water/no-land samples must remain no-land",
        "shoreline and shelf samples may expose land potential without pretending to be solid land",
        "single anchor samples are not global distribution proof",
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

  function publishDataset() {
    if (!DOC || !DOC.documentElement) return;

    const dataset = DOC.documentElement.dataset;
    dataset.hearthLandChannelLoaded = "true";
    dataset.hearthLandChannelContract = CONTRACT;
    dataset.hearthLandChannelReceipt = RECEIPT;
    dataset.hearthLandChildBirthContract = BIRTH_CONTRACT;
    dataset.hearthLandChannelAuthority = AUTHORITY;
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
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    birthContract: BIRTH_CONTRACT,
    version: VERSION,
    authority: AUTHORITY,
    sample,
    read,
    getReceipt
  };

  const hearth = getHearthNamespace();
  ROOT.HEARTH_LAND_CHANNEL = api;
  hearth.landChannel = api;
  hearth.LAND_CHANNEL = api;

  publishDataset();
})();
