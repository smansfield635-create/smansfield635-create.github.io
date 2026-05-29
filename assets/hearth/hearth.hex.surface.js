// /assets/hearth/hearth.hex.surface.js
// HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1
// Full-file replacement.
// Previous contract: HEARTH_G3_HEX_SURFACE_GLOBAL_API_REPAIR_TNT_v1
// Purpose:
// - Convert Hearth hex surface into a pure consumer of the canonical four-pair hex authority.
// - Preserve HEARTH_HEX_SURFACE global API.
// - Preserve drawHearthHexSurfaceFrame() and getHearthHexSurfaceStatus().
// - Use HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY as the sole canonical hex truth.
// - Use raw sphere position for visual continuity.
// - Use hex authority cell / state / four-pair handshakes for grain, seam, influence, and diagnostic proof.
// - Keep local render hex footprint as visual seam geometry only, never canonical truth.
// - Preserve land / water / air authority separation.
// - Do not own land truth.
// - Do not own water truth.
// - Do not own air truth.
// - Do not own hydrology.
// - Do not own elevation.
// - Do not own materials.
// - Do not own canvas mounting.
// - Do not own route orchestration.
// - Do not own runtime motion.
// - Do not own controls.
// - Do not create GraphicBox.
// - Do not use generated images.
// - Do not claim visual pass.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";
  const RECEIPT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_G3_HEX_SURFACE_GLOBAL_API_REPAIR_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_G3_HIGH_DENSITY_HEX_SURFACE_BASELINE_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const CANONICAL_HEX_CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const CANONICAL_HEX_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const VERSION = "2026-05-29.hearth-hex-surface-four-pair-authority-consumer-v1";

  const PLANET_ID = "hearth";
  const PLANET_LABEL = "Hearth";
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const DEFAULTS = Object.freeze({
    radiusRatio: 0.456,
    hexDensity: 232,
    minHexRadius: 0.84,
    maxHexRadius: 3.15,
    edgeDarkening: 0.026,
    seamSoftening: 0.042,
    authoritySeedStrength: 0.42,
    microTerrainStrength: 0.38,
    landExposureLift: 0.18,
    waterDepthPush: 0.22,
    contrastLift: 0.16,
    atmosphereStrength: 0.94,
    axialTilt: -0.22,
    lightX: -0.48,
    lightY: 0.28,
    lightZ: 0.84
  });

  const STATUS = {
    ok: true,
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,
    role: "hearth-hex-surface-four-pair-authority-consumer",
    globalApi: "HEARTH_HEX_SURFACE",
    drawFunction: "drawHearthHexSurfaceFrame",
    statusFunction: "getHearthHexSurfaceStatus",

    canonicalHexAuthorityFile: CANONICAL_HEX_FILE,
    canonicalHexAuthorityExpectedContract: CANONICAL_HEX_CONTRACT,
    canonicalHexAuthorityPresent: false,
    canonicalHexAuthorityContractOk: false,
    canonicalHexAuthoritySampleOk: false,
    canonicalHexAuthorityFourPairOk: false,
    canonicalHexAuthorityWideProbeOk: false,

    soleHexAuthorityConsumer: true,
    ownsCanonicalHexTruth: false,
    ownsHexCellIdentity: false,
    ownsFourPairHandshakeTruth: false,
    highDensityHexSurface: true,
    overlappingHexFootprints: true,
    rawSpherePositionOwnsVisualContinuity: true,
    rawVectorVisualSampling: true,
    hexCenterVisualOverride: false,
    localRenderHexIsVisualFootprintOnly: true,

    landAuthority: false,
    waterAuthority: false,
    airAuthority: false,
    terrainAuthority: false,
    childEngineAuthority: false,
    canvasAuthority: false,
    runtimeAuthority: false,
    routeAuthority: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    lastFrameReceipt: null,
    lastAuthorityValidation: null,
    lastError: ""
  };

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

  function mix(a, b, t) {
    const k = clamp01(t);
    return a + (b - a) * k;
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function wrap01(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp01((value - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function hash2(x, y, seed) {
    return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
  }

  function valueNoise(x, y, seed) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = fract(x);
    const fy = fract(y);

    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return mix(mix(a, b, ux), mix(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves) {
    let total = 0;
    let amplitude = 0.52;
    let frequency = 1;
    let normalizer = 0;

    for (let index = 0; index < octaves; index += 1) {
      total += valueNoise(x * frequency, y * frequency, seed + index * 29.37) * amplitude;
      normalizer += amplitude;
      amplitude *= 0.5;
      frequency *= 2.04;
    }

    return total / Math.max(0.000001, normalizer);
  }

  function norm3(v) {
    const x = Number(v && v[0]) || 0;
    const y = Number(v && v[1]) || 0;
    const z = Number(v && v[2]) || 1;
    const m = Math.hypot(x, y, z) || 1;

    return [x / m, y / m, z / m];
  }

  function rotateY(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return [
      v[0] * c + v[2] * s,
      v[1],
      -v[0] * s + v[2] * c
    ];
  }

  function rotateX(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return [
      v[0],
      v[1] * c - v[2] * s,
      v[1] * s + v[2] * c
    ];
  }

  function vectorToCoordinate(v) {
    const n = norm3(v);
    const lon = Math.atan2(n[0], n[2]) / DEG;
    const lat = Math.asin(clamp(n[1], -1, 1)) / DEG;

    return {
      x: n[0],
      y: n[1],
      z: n[2],
      lon,
      lat,
      u: wrap01((lon + 180) / 360),
      v: clamp01((90 - lat) / 180)
    };
  }

  function cubeRound(q, r) {
    const s = -q - r;

    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);

    const qDiff = Math.abs(rq - q);
    const rDiff = Math.abs(rr - r);
    const sDiff = Math.abs(rs - s);

    if (qDiff > rDiff && qDiff > sDiff) {
      rq = -rr - rs;
    } else if (rDiff > sDiff) {
      rr = -rq - rs;
    }

    return { q: rq, r: rr };
  }

  function nearestHexCenter(xPx, yPx, hexRadius) {
    const q = ((Math.sqrt(3) / 3) * xPx - (1 / 3) * yPx) / hexRadius;
    const r = ((2 / 3) * yPx) / hexRadius;
    const rounded = cubeRound(q, r);

    return {
      x: hexRadius * Math.sqrt(3) * (rounded.q + rounded.r / 2),
      y: hexRadius * 1.5 * rounded.r,
      q: rounded.q,
      r: rounded.r
    };
  }

  function hexDistance(localX, localY, hexRadius) {
    const q = ((Math.sqrt(3) / 3) * localX - (1 / 3) * localY) / hexRadius;
    const r = ((2 / 3) * localY) / hexRadius;
    const s = -q - r;

    return Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
  }

  function normalizeOptions(options = {}) {
    return Object.freeze({
      radiusRatio: clamp(options.radiusRatio ?? DEFAULTS.radiusRatio, 0.34, 0.49),
      hexDensity: clamp(options.hexDensity ?? DEFAULTS.hexDensity, 150, 560),
      minHexRadius: clamp(options.minHexRadius ?? DEFAULTS.minHexRadius, 0.55, 3),
      maxHexRadius: clamp(options.maxHexRadius ?? DEFAULTS.maxHexRadius, 1.4, 6),
      edgeDarkening: clamp(options.edgeDarkening ?? DEFAULTS.edgeDarkening, 0, 0.18),
      seamSoftening: clamp(options.seamSoftening ?? DEFAULTS.seamSoftening, 0, 0.18),
      authoritySeedStrength: clamp(options.authoritySeedStrength ?? DEFAULTS.authoritySeedStrength, 0, 1),
      microTerrainStrength: clamp(options.microTerrainStrength ?? DEFAULTS.microTerrainStrength, 0, 0.9),
      landExposureLift: clamp(options.landExposureLift ?? DEFAULTS.landExposureLift, 0, 0.45),
      waterDepthPush: clamp(options.waterDepthPush ?? DEFAULTS.waterDepthPush, 0, 0.55),
      contrastLift: clamp(options.contrastLift ?? DEFAULTS.contrastLift, 0, 0.48),
      atmosphereStrength: clamp(options.atmosphereStrength ?? DEFAULTS.atmosphereStrength, 0, 1.4),
      axialTilt: Number.isFinite(Number(options.axialTilt)) ? Number(options.axialTilt) : DEFAULTS.axialTilt,
      lightX: Number(options.lightX) || DEFAULTS.lightX,
      lightY: Number(options.lightY) || DEFAULTS.lightY,
      lightZ: Number(options.lightZ) || DEFAULTS.lightZ
    });
  }

  function rgba(input, fallback) {
    if (Array.isArray(input) && input.length >= 3) {
      return [
        clamp(Math.round(input[0]), 0, 255),
        clamp(Math.round(input[1]), 0, 255),
        clamp(Math.round(input[2]), 0, 255),
        input[3] === undefined ? 255 : clamp(Math.round(input[3]), 0, 255)
      ];
    }

    return fallback.slice();
  }

  function mixColor(base, overlay, amount) {
    const t = clamp01(amount);

    return [
      clamp(Math.round(mix(base[0], overlay[0], t)), 0, 255),
      clamp(Math.round(mix(base[1], overlay[1], t)), 0, 255),
      clamp(Math.round(mix(base[2], overlay[2], t)), 0, 255),
      base[3] === undefined ? 255 : base[3]
    ];
  }

  function multiplyColor(color, amount) {
    return [
      clamp(Math.round(color[0] * amount), 0, 255),
      clamp(Math.round(color[1] * amount), 0, 255),
      clamp(Math.round(color[2] * amount), 0, 255),
      color[3] === undefined ? 255 : color[3]
    ];
  }

  function readNumber(sample, keys, fallback = 0) {
    if (!sample || typeof sample !== "object") return fallback;

    for (const key of keys) {
      const value = sample[key];
      const n = Number(value);

      if (Number.isFinite(n)) return n;
    }

    return fallback;
  }

  function readBoolean(sample, keys) {
    if (!sample || typeof sample !== "object") return false;

    return keys.some((key) => sample[key] === true || sample[key] === "true");
  }

  function readText(sample, keys, fallback = "") {
    if (!sample || typeof sample !== "object") return fallback;

    for (const key of keys) {
      if (sample[key] !== undefined && sample[key] !== null && String(sample[key]).length) {
        return String(sample[key]);
      }
    }

    return fallback;
  }

  function contractOf(value) {
    if (!value || typeof value !== "object") return "";

    return String(
      value.contract ||
      value.CONTRACT ||
      value.compatibilityContract ||
      value.boundaryHandshakeContract ||
      value.receipt ||
      value.RECEIPT ||
      ""
    );
  }

  function resolveCanonicalHexAuthority() {
    const candidates = [
      root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY,
      root.HEARTH_HEX_FOUR_PAIR_AUTHORITY,
      root.HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY,
      root.HEARTH_HEX_HANDSHAKE_AUTHORITY,
      root.HEARTH_HEXGRID_AUTHORITY,
      root.HEARTH && root.HEARTH.hexFourPairAuthority,
      root.HEARTH && root.HEARTH.hexAuthority
    ];

    return candidates.find((candidate) => candidate && typeof candidate === "object") || null;
  }

  function validateCanonicalHexAuthority() {
    const authority = resolveCanonicalHexAuthority();

    const validation = {
      contract: CONTRACT,
      receipt: RECEIPT,
      expectedContract: CANONICAL_HEX_CONTRACT,
      authorityPresent: Boolean(authority),
      actualContract: contractOf(authority),
      contractOk: false,
      sampleOk: false,
      fourPairOk: false,
      fourPairDirectionsOk: false,
      fourPairBodyBoundOk: false,
      wideProbeOk: false,
      wideProbeTotal: 0,
      wideProbeFailedCount: 0,
      status: "MISSING",
      validationOk: false,
      error: "",
      at: nowIso(),
      visualPassClaimed: false
    };

    validation.contractOk = Boolean(authority && contractOf(authority) === CANONICAL_HEX_CONTRACT);

    if (!authority) {
      validation.status = "MISSING";
      return validation;
    }

    try {
      if (typeof authority.sample === "function") {
        const sample = authority.sample({ u: 0.5, v: 0.5 });

        validation.sampleOk = Boolean(sample && typeof sample === "object");
        validation.fourPairDirectionsOk = Boolean(
          sample &&
          sample.north &&
          sample.south &&
          sample.east &&
          sample.west &&
          sample.north.direction === "north" &&
          sample.south.direction === "south" &&
          sample.east.direction === "east" &&
          sample.west.direction === "west"
        );

        validation.fourPairOk = Boolean(
          sample &&
          sample.everyPixelHasFourPairSet === true &&
          Array.isArray(sample.fourPairSet) &&
          sample.fourPairSet.length === 4 &&
          validation.fourPairDirectionsOk
        );

        validation.fourPairBodyBoundOk = Boolean(
          sample &&
          sample.bodyBound === true &&
          sample.surfaceBound === true &&
          sample.floatsAboveBody === false &&
          sample.allowedToFloat === false
        );
      }

      if (typeof authority.wideProbe === "function") {
        const wideProbe = authority.wideProbe({ rows: 5, columns: 9 });

        validation.wideProbeTotal = readNumber(wideProbe, ["total"], 0);
        validation.wideProbeFailedCount = readNumber(wideProbe, ["failedCount"], 0);
        validation.wideProbeOk = Boolean(
          wideProbe &&
          wideProbe.wideProbeReady === true &&
          wideProbe.everyPixelHasNorthSouthEastWest === true &&
          wideProbe.everyPixelHasFourPairSet === true &&
          validation.wideProbeTotal >= 25 &&
          validation.wideProbeFailedCount === 0
        );
      }
    } catch (error) {
      validation.error = error && error.message ? error.message : String(error);
    }

    validation.validationOk = Boolean(
      validation.authorityPresent &&
      validation.contractOk &&
      validation.sampleOk &&
      validation.fourPairOk &&
      validation.fourPairBodyBoundOk
    );

    validation.status = validation.validationOk
      ? "PASS"
      : validation.authorityPresent
        ? "DEGRADED"
        : "MISSING";

    return validation;
  }

  function sampleCanonicalHex(coord, localFallback = null) {
    const authority = resolveCanonicalHexAuthority();

    if (authority && typeof authority.sample === "function") {
      try {
        const packet = authority.sample(coord);

        if (packet && typeof packet === "object") {
          return {
            ...packet,
            canonicalHexAuthorityPresent: true,
            canonicalHexAuthorityContractOk: contractOf(authority) === CANONICAL_HEX_CONTRACT,
            fallbackHexAuthority: false
          };
        }
      } catch (_error) {}
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "hearth-hex-surface-local-render-footprint-fallback",
      fallbackHexAuthority: true,
      canonicalHexAuthorityPresent: false,
      canonicalHexAuthorityContractOk: false,
      cellId: localFallback ? `LOCAL_RENDER_HEX_Q${localFallback.q}_R${localFallback.r}` : "LOCAL_RENDER_HEX_UNKNOWN",
      hexId: localFallback ? `LOCAL_RENDER_HEX_Q${localFallback.q}_R${localFallback.r}` : "LOCAL_RENDER_HEX_UNKNOWN",
      row: 0,
      column: 0,
      q: localFallback ? localFallback.q : 0,
      r: localFallback ? localFallback.r : 0,
      s: localFallback ? -localFallback.q - localFallback.r : 0,
      stateId: localFallback ? Math.abs((localFallback.q * 37 + localFallback.r * 19) % 256) : 0,
      stateClass: "fallback-state",
      fourPairSet: [],
      everyPixelHasFourPairSet: false,
      everyPixelHasNorthSouthEastWest: false,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      visualPassClaimed: false
    };
  }

  function resolveChannel(kind) {
    const table = {
      land: [
        root.HEARTH_LAND_CHANNEL,
        root.HEARTH && root.HEARTH.landChannel,
        root.HEARTH && root.HEARTH.land
      ],
      water: [
        root.HEARTH_WATER_CHANNEL,
        root.HEARTH && root.HEARTH.waterChannel,
        root.HEARTH && root.HEARTH.water
      ],
      air: [
        root.HEARTH_AIR_CHANNEL,
        root.HEARTH && root.HEARTH.airChannel,
        root.HEARTH && root.HEARTH.air
      ]
    };

    return (table[kind] || []).find((candidate) => candidate && typeof candidate === "object") || null;
  }

  function sampleAuthority(authority, coord) {
    if (!authority || typeof authority !== "object") return null;

    try {
      if (typeof authority.sample === "function") {
        const value = authority.sample(coord);

        if (value && typeof value === "object") return value;
      }

      if (typeof authority.read === "function") {
        const value = authority.read(coord);

        if (value && typeof value === "object") return value;
      }

      if (typeof authority.sampleVector === "function") {
        const value = authority.sampleVector([coord.x, coord.y, coord.z]);

        if (value && typeof value === "object") return value;
      }
    } catch (_error) {}

    return null;
  }

  function fallbackLand(coord) {
    const ridge = fbm(coord.u * 6.4, coord.v * 5.1, 933, 4);
    const arch = Math.sin((coord.lon + 22) * DEG * 2.2) * Math.cos((coord.lat - 8) * DEG * 2.7);
    const belt = Math.abs(coord.lat) < 58 ? 1 : 0.38;
    const landSignal = clamp01((ridge * 0.72 + arch * 0.22 + 0.18) * belt);

    return {
      contract: "HEARTH_HEX_SURFACE_VISUAL_FALLBACK_LAND_PACKET",
      channel: "land",
      isLandChannel: true,
      isWaterChannel: false,
      isAirChannel: false,
      landPresence: landSignal > 0.57 ? landSignal : 0,
      landAlpha: landSignal > 0.57 ? landSignal : 0,
      isLand: landSignal > 0.57,
      rgb: [96, 84, 56],
      color: [96, 84, 56],
      terrainRelief: clamp01((ridge - 0.5) * 1.8),
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      fallback: true,
      visualPassClaimed: false
    };
  }

  function fallbackWater(coord) {
    const basin = fbm(coord.u * 4.2 + 8, coord.v * 3.7 - 3, 419, 3);
    const depth = clamp01(0.48 + basin * 0.38 + Math.abs(coord.lat) / 220);

    return {
      contract: "HEARTH_HEX_SURFACE_VISUAL_FALLBACK_WATER_PACKET",
      channel: "water",
      isWaterChannel: true,
      isLandChannel: false,
      isAirChannel: false,
      waterPresence: 0.72,
      waterAlpha: 0.72,
      waterDepth: depth,
      isWater: true,
      rgb: [14, 64, 116],
      color: [14, 64, 116],
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      fallback: true,
      visualPassClaimed: false
    };
  }

  function fallbackAir(coord) {
    const pressure = clamp01(0.28 + Math.abs(coord.lat) / 300);

    return {
      contract: "HEARTH_HEX_SURFACE_VISUAL_FALLBACK_AIR_PACKET",
      channel: "air",
      isAirChannel: true,
      airPresence: 0.12,
      airAlpha: 0.12,
      pressureEnvelope: pressure,
      humidity: 0.45,
      allowedToFloat: true,
      floatsAboveBody: true,
      mayDefineLand: false,
      mayDefineWater: false,
      fallback: true,
      visualPassClaimed: false
    };
  }

  function sampleChannels(coord) {
    const landAuthority = resolveChannel("land");
    const waterAuthority = resolveChannel("water");
    const airAuthority = resolveChannel("air");

    const land = sampleAuthority(landAuthority, coord) || fallbackLand(coord);
    const water = sampleAuthority(waterAuthority, coord) || fallbackWater(coord);
    const air = sampleAuthority(airAuthority, coord) || fallbackAir(coord);

    return {
      land,
      water,
      air,
      landAuthorityPresent: Boolean(landAuthority),
      waterAuthorityPresent: Boolean(waterAuthority),
      airAuthorityPresent: Boolean(airAuthority)
    };
  }

  function classifyVisualBlend(channels) {
    const land = channels.land || {};
    const water = channels.water || {};

    const landAlpha = clamp01(readNumber(land, ["landAlpha", "landPresence", "alpha"], readBoolean(land, ["isLand"]) ? 0.72 : 0));
    const waterAlpha = clamp01(readNumber(water, ["waterAlpha", "waterPresence", "alpha"], readBoolean(water, ["isWater"]) ? 0.72 : 0));

    const isLand = readBoolean(land, ["isLand", "visibleLand", "solidSurfaceLand"]) || landAlpha > 0.56;
    const isWater = readBoolean(water, ["isWater", "water", "ocean", "liquidWater"]) || waterAlpha > 0.42;

    const shorelineContact = Math.max(
      clamp01(readNumber(land, ["shorelineContact", "coastPotential"], 0)),
      clamp01(readNumber(water, ["shorelineContact", "coastPotential", "wetEdge"], 0))
    );

    const landDominance = landAlpha - waterAlpha * 0.62 + shorelineContact * 0.18;

    return {
      visualClass: isLand && landDominance > 0.05 ? "land" : isWater ? "water" : "water",
      landAlpha,
      waterAlpha,
      shorelineContact,
      landDominance,
      isLand,
      isWater
    };
  }

  function baseWaterColor(water, blend, config) {
    const depth = clamp01(readNumber(water, ["waterDepth", "depth", "oceanDepth"], 0.58));
    const wetEdge = clamp01(readNumber(water, ["wetEdge", "shorelineContact", "coastPotential"], 0));
    const basin = clamp01(readNumber(water, ["basinInfluence", "submergedBlockInfluence", "submergedScarInfluence"], 0));

    let color = rgba(water.rgb || water.color, [14, 64, 116, 255]);

    color = mixColor(color, [5, 30, 78, 255], depth * (0.34 + config.waterDepthPush));
    color = mixColor(color, [24, 118, 152, 255], wetEdge * 0.26);
    color = mixColor(color, [4, 24, 62, 255], basin * 0.12);

    if (blend.landAlpha > 0.22 && blend.shorelineContact > 0.12) {
      color = mixColor(color, [38, 128, 140, 255], blend.shorelineContact * 0.12);
    }

    return color;
  }

  function baseLandColor(land, blend, config) {
    const relief = clamp01(readNumber(land, ["terrainRelief", "reliefStrength", "reliefBinding"], 0));
    const ridge = clamp01(readNumber(land, ["ridgeRelief", "ridgePotential", "mountainArcPotential"], 0));
    const plateau = clamp01(readNumber(land, ["plateauPotential", "massAnchor"], 0));
    const basin = clamp01(readNumber(land, ["basinPotential", "contactOcclusion", "underlandShadow"], 0));
    const materialClass = readText(land, ["materialClass", "terrainClass", "landClass"], "");

    let color = rgba(land.rgb || land.color, [96, 84, 56, 255]);

    color = mixColor(color, [128, 112, 70, 255], config.landExposureLift + plateau * 0.14);
    color = mixColor(color, [168, 148, 96, 255], relief * 0.14 + config.contrastLift * 0.12);
    color = mixColor(color, [62, 58, 46, 255], ridge * 0.16 + basin * 0.12);

    if (materialClass.includes("wetstone") || materialClass.includes("shelf") || materialClass.includes("coastal")) {
      color = mixColor(color, [118, 104, 78, 255], 0.16 + blend.shorelineContact * 0.12);
    }

    if (materialClass.includes("shallow_water") || materialClass.includes("beach")) {
      color = mixColor(color, [154, 132, 84, 255], 0.12);
    }

    return color;
  }

  function composeColor(channels, hexPacket, geometry, index, coord, config, lightValue) {
    const blend = classifyVisualBlend(channels);
    const land = channels.land || {};
    const water = channels.water || {};
    const air = channels.air || {};

    let color = blend.visualClass === "land"
      ? baseLandColor(land, blend, config)
      : baseWaterColor(water, blend, config);

    if (blend.visualClass === "land" && blend.waterAlpha > 0.28 && blend.shorelineContact > 0.12) {
      color = mixColor(color, baseWaterColor(water, blend, config), blend.shorelineContact * 0.18);
    }

    const stateId = Number.isFinite(Number(hexPacket.stateId)) ? Number(hexPacket.stateId) : 0;
    const q = Number.isFinite(Number(hexPacket.q)) ? Number(hexPacket.q) : geometry.localHexQ[index];
    const r = Number.isFinite(Number(hexPacket.r)) ? Number(hexPacket.r) : geometry.localHexR[index];

    const edge = geometry.edgeFactors[index];
    const overlap = geometry.overlapFactors[index];
    const zDepth = geometry.sphericalDepths[index];
    const seed = (stateId + 1) / 257;

    const fineNoise = fbm(
      q * 0.145 + coord.u * 6.2 + seed * 4.1,
      r * 0.145 + coord.v * 5.4 - seed * 3.8,
      1711 + stateId,
      3
    );

    const broadNoise = fbm(
      coord.u * 12.4 + seed * 2.1,
      coord.v * 9.2 - seed * 1.7,
      2719 + stateId,
      3
    );

    const micro = (fineNoise - 0.5) * config.microTerrainStrength;
    const broad = (broadNoise - 0.5) * config.authoritySeedStrength;

    if (blend.visualClass === "land") {
      color = mixColor(color, [202, 184, 128, 255], Math.max(0, micro + broad) * 0.12);
      color = mixColor(color, [48, 52, 46, 255], Math.max(0, -(micro + broad)) * 0.15);
    } else {
      color = mixColor(color, [46, 160, 182, 255], Math.max(0, micro) * 0.045);
      color = mixColor(color, [3, 20, 58, 255], Math.max(0, -micro) * 0.07);
    }

    const fourPairValid = Boolean(
      hexPacket &&
      hexPacket.everyPixelHasFourPairSet === true &&
      Array.isArray(hexPacket.fourPairSet) &&
      hexPacket.fourPairSet.length === 4
    );

    const handshakeLift = fourPairValid ? 1 : 0.94;
    const seam = clamp(
      1 - edge * config.edgeDarkening + overlap * config.seamSoftening,
      0.80,
      1.10
    );

    const limbShade = clamp(0.56 + zDepth * 0.52, 0.48, 1.08);
    const lightShade = clamp(0.70 + lightValue * 0.42, 0.58, 1.14);
    const microShade = clamp(0.965 + (micro + broad) * 0.12, 0.86, 1.14);
    const airAlpha = clamp01(readNumber(air, ["airAlpha", "airPresence", "visualShellAlpha"], 0.10));

    color = multiplyColor(color, seam * limbShade * lightShade * microShade * handshakeLift);
    color = mixColor(color, [160, 198, 218, 255], airAlpha * 0.035);

    return color;
  }

  function buildHexGeometry(size, options = {}) {
    const config = normalizeOptions(options);
    const radius = size * config.radiusRatio;
    const cx = size / 2;
    const cy = size / 2;

    const hexRadius = clamp(
      size / config.hexDensity,
      config.minHexRadius,
      config.maxHexRadius
    );

    let count = 0;

    for (let py = 0; py < size; py += 1) {
      const y = (py + 0.5 - cy) / radius;

      for (let px = 0; px < size; px += 1) {
        const x = (px + 0.5 - cx) / radius;

        if (x * x + y * y <= 1) {
          count += 1;
        }
      }
    }

    const indices = new Uint32Array(count);
    const sphereX = new Float32Array(count);
    const sphereY = new Float32Array(count);
    const sphereZ = new Float32Array(count);
    const rawX = new Float32Array(count);
    const rawY = new Float32Array(count);
    const edgeFactors = new Float32Array(count);
    const overlapFactors = new Float32Array(count);
    const sphericalDepths = new Float32Array(count);
    const localHexQ = new Int32Array(count);
    const localHexR = new Int32Array(count);

    let index = 0;

    for (let py = 0; py < size; py += 1) {
      const yRaw = py + 0.5 - cy;
      const y = yRaw / radius;

      for (let px = 0; px < size; px += 1) {
        const xRaw = px + 0.5 - cx;
        const x = xRaw / radius;
        const r2 = x * x + y * y;

        if (r2 > 1) continue;

        const z = Math.sqrt(Math.max(0, 1 - r2));
        const center = nearestHexCenter(xRaw, yRaw, hexRadius);
        const localX = xRaw - center.x;
        const localY = yRaw - center.y;
        const hd = hexDistance(localX, localY, hexRadius);

        indices[index] = (py * size + px) * 4;
        sphereX[index] = x;
        sphereY[index] = -y;
        sphereZ[index] = z;
        rawX[index] = x;
        rawY[index] = y;
        edgeFactors[index] = smoothstep(0.76, 1.05, hd);
        overlapFactors[index] = 1 - smoothstep(0.82, 1.24, hd);
        sphericalDepths[index] = z;
        localHexQ[index] = center.q;
        localHexR[index] = center.r;

        index += 1;
      }
    }

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      familyContract: FAMILY_CONTRACT,
      model: "hearth-four-pair-authority-consumer-high-density-hex-surface",
      size,
      radius,
      hexRadius,
      count,
      configKey: [
        config.radiusRatio,
        config.hexDensity,
        config.minHexRadius,
        config.maxHexRadius
      ].join(":"),
      indices,
      sphereX,
      sphereY,
      sphereZ,
      rawX,
      rawY,
      edgeFactors,
      overlapFactors,
      sphericalDepths,
      localHexQ,
      localHexR,
      rawSpherePositionOwnsVisualContinuity: true,
      localRenderHexIsVisualFootprintOnly: true,
      hexCenterVisualOverride: false,
      ownsCanonicalHexTruth: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    });
  }

  function drawAtmosphere(ctx, size, options = {}) {
    const config = normalizeOptions(options);
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * config.radiusRatio;
    const strength = config.atmosphereStrength;

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.clip();

    const highlight = ctx.createRadialGradient(
      cx - radius * 0.34,
      cy - radius * 0.36,
      radius * 0.02,
      cx,
      cy,
      radius * 1.16
    );

    highlight.addColorStop(0, `rgba(255,255,255,${0.12 * strength})`);
    highlight.addColorStop(0.32, `rgba(255,255,255,${0.035 * strength})`);
    highlight.addColorStop(0.74, "rgba(0,0,0,0.10)");
    highlight.addColorStop(1, "rgba(0,0,0,0.48)");

    ctx.fillStyle = highlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const edge = ctx.createRadialGradient(cx, cy, radius * 0.66, cx, cy, radius);
    edge.addColorStop(0, "rgba(0,0,0,0)");
    edge.addColorStop(0.78, `rgba(8,23,44,${0.16 * strength})`);
    edge.addColorStop(1, `rgba(4,10,20,${0.62 * strength})`);

    ctx.fillStyle = edge;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, TAU);
    ctx.strokeStyle = `rgba(190,226,255,${0.26 * strength})`;
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(2, size * 0.011), 0, TAU);
    ctx.strokeStyle = `rgba(108,185,232,${0.10 * strength})`;
    ctx.lineWidth = Math.max(1, size * 0.006);
    ctx.stroke();

    ctx.restore();
  }

  function publishDataset(state, frameReceipt, validation) {
    const dataset = doc && doc.documentElement ? doc.documentElement.dataset : null;

    if (dataset) {
      dataset.hearthHexSurfaceLoaded = "true";
      dataset.hearthHexSurfaceReady = "true";
      dataset.hearthHexSurfaceContract = CONTRACT;
      dataset.hearthHexSurfaceReceipt = RECEIPT;
      dataset.hearthHexSurfacePreviousContract = PREVIOUS_CONTRACT;
      dataset.hearthHexSurfaceBaselineContract = BASELINE_CONTRACT;
      dataset.hearthHexSurfaceFamilyContract = FAMILY_CONTRACT;
      dataset.hearthHexSurfaceVersion = VERSION;

      dataset.hearthHexSurfaceRole = "four-pair-authority-consumer";
      dataset.hearthHexSurfaceGlobalApi = "true";
      dataset.hearthHexSurfaceDrawFunction = "drawHearthHexSurfaceFrame";
      dataset.hearthHexSurfaceStatusFunction = "getHearthHexSurfaceStatus";

      dataset.hearthHexSurfaceCanonicalAuthorityFile = CANONICAL_HEX_FILE;
      dataset.hearthHexSurfaceCanonicalAuthorityExpectedContract = CANONICAL_HEX_CONTRACT;
      dataset.hearthHexSurfaceCanonicalAuthorityPresent = String(Boolean(validation && validation.authorityPresent));
      dataset.hearthHexSurfaceCanonicalAuthorityContractOk = String(Boolean(validation && validation.contractOk));
      dataset.hearthHexSurfaceCanonicalAuthoritySampleOk = String(Boolean(validation && validation.sampleOk));
      dataset.hearthHexSurfaceCanonicalAuthorityFourPairOk = String(Boolean(validation && validation.fourPairOk));
      dataset.hearthHexSurfaceCanonicalAuthorityWideProbeOk = String(Boolean(validation && validation.wideProbeOk));
      dataset.hearthHexSurfaceCanonicalAuthorityStatus = validation && validation.status ? validation.status : "UNKNOWN";

      dataset.hearthHexSurfaceSoleHexAuthorityConsumer = "true";
      dataset.hearthHexSurfaceOwnsCanonicalHexTruth = "false";
      dataset.hearthHexSurfaceOwnsHexCellIdentity = "false";
      dataset.hearthHexSurfaceOwnsFourPairHandshakeTruth = "false";
      dataset.rawSpherePositionOwnsVisualContinuity = "true";
      dataset.hearthHexSurfaceRawVectorVisualSampling = "true";
      dataset.hearthHexSurfaceHexCenterVisualOverride = "false";
      dataset.hearthHexSurfaceLocalRenderHexVisualFootprintOnly = "true";

      dataset.hearthHexSurfaceLandAuthority = "false";
      dataset.hearthHexSurfaceWaterAuthority = "false";
      dataset.hearthHexSurfaceAirAuthority = "false";
      dataset.hearthHexSurfaceTerrainAuthority = "false";
      dataset.hearthHexSurfaceCanvasAuthority = "false";
      dataset.hearthHexSurfaceRuntimeAuthority = "false";
      dataset.hearthHexSurfaceRouteAuthority = "false";

      dataset.generatedImage = "false";
      dataset.graphicBox = "false";
      dataset.webgl = "false";
      dataset.visualPassClaimed = "false";

      if (frameReceipt) {
        dataset.hearthHexSurfaceFrameReceipt = frameReceipt.receipt;
        dataset.hearthHexSurfaceSamples = String(frameReceipt.samples || 0);
        dataset.hearthHexSurfaceLandPixels = String(frameReceipt.landPixels || 0);
        dataset.hearthHexSurfaceWaterPixels = String(frameReceipt.waterPixels || 0);
        dataset.hearthHexSurfaceFallbackHexPixels = String(frameReceipt.fallbackHexPixels || 0);
        dataset.hearthHexSurfaceCanonicalHexPixels = String(frameReceipt.canonicalHexPixels || 0);
        dataset.hearthHexSurfaceLandAuthorityPresent = String(Boolean(frameReceipt.landAuthorityPresent));
        dataset.hearthHexSurfaceWaterAuthorityPresent = String(Boolean(frameReceipt.waterAuthorityPresent));
        dataset.hearthHexSurfaceAirAuthorityPresent = String(Boolean(frameReceipt.airAuthorityPresent));
      }
    }

    if (state && state.canvas && state.canvas.dataset) {
      const canvasDataset = state.canvas.dataset;

      canvasDataset.hearthHexSurface = RECEIPT;
      canvasDataset.hearthHexSurfaceContract = CONTRACT;
      canvasDataset.hearthHexSurfacePreviousContract = PREVIOUS_CONTRACT;
      canvasDataset.hearthHexSurfaceVersion = VERSION;
      canvasDataset.hearthHexSurfaceRole = "four-pair-authority-consumer";
      canvasDataset.hearthHexSurfaceCanonicalAuthorityExpectedContract = CANONICAL_HEX_CONTRACT;
      canvasDataset.hearthHexSurfaceCanonicalAuthorityPresent = String(Boolean(validation && validation.authorityPresent));
      canvasDataset.hearthHexSurfaceCanonicalAuthorityContractOk = String(Boolean(validation && validation.contractOk));
      canvasDataset.hearthHexSurfaceCanonicalAuthorityFourPairOk = String(Boolean(validation && validation.fourPairOk));
      canvasDataset.rawSpherePositionOwnsVisualContinuity = "true";
      canvasDataset.hexCenterVisualOverride = "false";
      canvasDataset.hexCenterOwnsInfluenceOnly = "true";
      canvasDataset.hearthHexSurfaceOwnsCanonicalHexTruth = "false";
      canvasDataset.hearthHexSurfaceLocalRenderHexVisualFootprintOnly = "true";
      canvasDataset.generatedImage = "false";
      canvasDataset.graphicBox = "false";
      canvasDataset.webgl = "false";
      canvasDataset.visualPassClaimed = "false";

      if (frameReceipt) {
        canvasDataset.hearthHexSurfaceFrameReceipt = frameReceipt.receipt;
        canvasDataset.hearthHexSurfaceSamples = String(frameReceipt.samples || 0);
        canvasDataset.hearthHexSurfaceLandPixels = String(frameReceipt.landPixels || 0);
        canvasDataset.hearthHexSurfaceWaterPixels = String(frameReceipt.waterPixels || 0);
      }
    }
  }

  function drawHearthHexSurfaceFrame(state, options = {}) {
    const canvas = state && state.canvas ? state.canvas : state;
    const ctx = state && state.ctx
      ? state.ctx
      : state && state.context
        ? state.context
        : canvas && typeof canvas.getContext === "function"
          ? canvas.getContext("2d")
          : null;

    if (!canvas || !ctx) {
      const error = "HEARTH_HEX_SURFACE_MISSING_CANVAS_OR_CONTEXT";
      STATUS.lastError = error;
      throw new Error(error);
    }

    const size = Number(canvas.width) || 0;

    if (!size) {
      const error = "HEARTH_HEX_SURFACE_MISSING_CANVAS_SIZE";
      STATUS.lastError = error;
      throw new Error(error);
    }

    const config = normalizeOptions(options);
    const configKey = [
      config.radiusRatio,
      config.hexDensity,
      config.minHexRadius,
      config.maxHexRadius
    ].join(":");

    const phase = Number(state && state.phase) || 0;
    const light = norm3([config.lightX, config.lightY, config.lightZ]);
    const validation = validateCanonicalHexAuthority();

    if (
      !state.hearthHexSurfaceGeometry ||
      state.hearthHexSurfaceGeometry.size !== size ||
      state.hearthHexSurfaceGeometry.receipt !== RECEIPT ||
      state.hearthHexSurfaceGeometry.configKey !== configKey
    ) {
      state.hearthHexSurfaceGeometry = buildHexGeometry(size, config);
      state.hearthHexGeometry = state.hearthHexSurfaceGeometry;
    }

    const geometry = state.hearthHexSurfaceGeometry;
    const output = ctx.createImageData(size, size);
    const data = output.data;

    let landPixels = 0;
    let waterPixels = 0;
    let fallbackHexPixels = 0;
    let canonicalHexPixels = 0;
    let fallbackLandPixels = 0;
    let fallbackWaterPixels = 0;
    let authorityLandPixels = 0;
    let authorityWaterPixels = 0;

    let landAuthorityPresent = false;
    let waterAuthorityPresent = false;
    let airAuthorityPresent = false;

    for (let index = 0; index < geometry.count; index += 1) {
      const out = geometry.indices[index];

      let vec = [
        geometry.sphereX[index],
        geometry.sphereY[index],
        geometry.sphereZ[index]
      ];

      vec = rotateX(vec, config.axialTilt);
      vec = rotateY(vec, phase);

      const coord = vectorToCoordinate(vec);
      const localFallback = {
        q: geometry.localHexQ[index],
        r: geometry.localHexR[index]
      };

      const hexPacket = sampleCanonicalHex(coord, localFallback);
      const channels = sampleChannels(coord);
      const blend = classifyVisualBlend(channels);

      landAuthorityPresent = landAuthorityPresent || channels.landAuthorityPresent;
      waterAuthorityPresent = waterAuthorityPresent || channels.waterAuthorityPresent;
      airAuthorityPresent = airAuthorityPresent || channels.airAuthorityPresent;

      if (hexPacket.fallbackHexAuthority) fallbackHexPixels += 1;
      else canonicalHexPixels += 1;

      if (blend.visualClass === "land") landPixels += 1;
      else waterPixels += 1;

      if (channels.land && channels.land.fallback) fallbackLandPixels += 1;
      else if (blend.visualClass === "land") authorityLandPixels += 1;

      if (channels.water && channels.water.fallback) fallbackWaterPixels += 1;
      else if (blend.visualClass === "water") authorityWaterPixels += 1;

      const rawNormal = norm3([
        geometry.sphereX[index],
        geometry.sphereY[index],
        geometry.sphereZ[index]
      ]);

      const lightValue = clamp01(
        rawNormal[0] * light[0] +
        rawNormal[1] * light[1] +
        rawNormal[2] * light[2]
      );

      const color = composeColor(channels, hexPacket, geometry, index, coord, config, lightValue);

      data[out] = color[0];
      data[out + 1] = color[1];
      data[out + 2] = color[2];
      data[out + 3] = color[3];
    }

    ctx.putImageData(output, 0, 0);
    drawAtmosphere(ctx, size, config);

    const frameReceipt = Object.freeze({
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      model: "hearth-four-pair-authority-consumer-high-density-hex-surface",
      size,
      samples: geometry.count,
      hexRadius: geometry.hexRadius,

      canonicalHexAuthorityFile: CANONICAL_HEX_FILE,
      canonicalHexAuthorityExpectedContract: CANONICAL_HEX_CONTRACT,
      canonicalHexAuthorityPresent: validation.authorityPresent,
      canonicalHexAuthorityContractOk: validation.contractOk,
      canonicalHexAuthoritySampleOk: validation.sampleOk,
      canonicalHexAuthorityFourPairOk: validation.fourPairOk,
      canonicalHexAuthorityWideProbeOk: validation.wideProbeOk,
      canonicalHexAuthorityStatus: validation.status,

      canonicalHexPixels,
      fallbackHexPixels,
      landPixels,
      waterPixels,
      fallbackLandPixels,
      fallbackWaterPixels,
      authorityLandPixels,
      authorityWaterPixels,
      landAuthorityPresent,
      waterAuthorityPresent,
      airAuthorityPresent,

      soleHexAuthorityConsumer: true,
      ownsCanonicalHexTruth: false,
      ownsHexCellIdentity: false,
      ownsFourPairHandshakeTruth: false,
      rawSpherePositionOwnsVisualContinuity: true,
      rawVectorVisualSampling: true,
      localRenderHexIsVisualFootprintOnly: true,
      hexCenterVisualOverride: false,
      hexCenterOwnsInfluenceOnly: true,

      landAuthority: false,
      waterAuthority: false,
      airAuthority: false,
      terrainAuthority: false,
      childEngineAuthority: false,
      canvasAuthority: false,
      runtimeAuthority: false,
      routeAuthority: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      at: nowIso()
    });

    STATUS.lastFrameReceipt = frameReceipt;
    STATUS.lastAuthorityValidation = validation;
    STATUS.lastError = "";
    STATUS.canonicalHexAuthorityPresent = validation.authorityPresent;
    STATUS.canonicalHexAuthorityContractOk = validation.contractOk;
    STATUS.canonicalHexAuthoritySampleOk = validation.sampleOk;
    STATUS.canonicalHexAuthorityFourPairOk = validation.fourPairOk;
    STATUS.canonicalHexAuthorityWideProbeOk = validation.wideProbeOk;

    publishDataset({ ...state, canvas }, frameReceipt, validation);

    return frameReceipt;
  }

  function getHearthHexSurfaceStatus(state = null) {
    const validation = validateCanonicalHexAuthority();

    return Object.freeze({
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      role: "hearth-hex-surface-four-pair-authority-consumer",
      globalApi: "HEARTH_HEX_SURFACE",
      apiReady: true,
      drawHearthHexSurfaceFrame: true,
      getHearthHexSurfaceStatus: true,

      canonicalHexAuthorityFile: CANONICAL_HEX_FILE,
      canonicalHexAuthorityExpectedContract: CANONICAL_HEX_CONTRACT,
      canonicalHexAuthorityPresent: validation.authorityPresent,
      canonicalHexAuthorityActualContract: validation.actualContract,
      canonicalHexAuthorityContractOk: validation.contractOk,
      canonicalHexAuthoritySampleOk: validation.sampleOk,
      canonicalHexAuthorityFourPairOk: validation.fourPairOk,
      canonicalHexAuthorityFourPairDirectionsOk: validation.fourPairDirectionsOk,
      canonicalHexAuthorityFourPairBodyBoundOk: validation.fourPairBodyBoundOk,
      canonicalHexAuthorityWideProbeOk: validation.wideProbeOk,
      canonicalHexAuthorityWideProbeTotal: validation.wideProbeTotal,
      canonicalHexAuthorityWideProbeFailedCount: validation.wideProbeFailedCount,
      canonicalHexAuthorityStatus: validation.status,

      geometryLoaded: Boolean(state && (state.hearthHexSurfaceGeometry || state.hearthHexGeometry)),
      hexRadius: state && state.hearthHexSurfaceGeometry ? state.hearthHexSurfaceGeometry.hexRadius : null,
      hexSamples: state && state.hearthHexSurfaceGeometry ? state.hearthHexSurfaceGeometry.count : null,

      landChannelReady: Boolean(resolveChannel("land")),
      waterChannelReady: Boolean(resolveChannel("water")),
      airChannelReady: Boolean(resolveChannel("air")),

      soleHexAuthorityConsumer: true,
      ownsCanonicalHexTruth: false,
      ownsHexCellIdentity: false,
      ownsFourPairHandshakeTruth: false,
      highDensityHexSurface: true,
      overlappingHexFootprints: true,
      rawSpherePositionOwnsVisualContinuity: true,
      rawVectorVisualSampling: true,
      localRenderHexIsVisualFootprintOnly: true,
      hexCenterOwnsInfluenceOnly: true,
      hexCenterVisualOverride: false,

      landAuthority: false,
      waterAuthority: false,
      airAuthority: false,
      terrainAuthority: false,
      childEngineAuthority: false,
      canvasAuthority: false,
      runtimeAuthority: false,
      routeAuthority: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      lastFrameReceipt: STATUS.lastFrameReceipt,
      lastAuthorityValidation: validation,
      lastError: STATUS.lastError || ""
    });
  }

  function getReceipt() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      authority: "hearth-hex-surface-four-pair-authority-consumer",
      status: "active",
      destinationFile: "/assets/hearth/hearth.hex.surface.js",
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,

      canonicalHexAuthorityFile: CANONICAL_HEX_FILE,
      canonicalHexAuthorityExpectedContract: CANONICAL_HEX_CONTRACT,
      canonicalHexAuthorityRole: "sole Hearth hex truth",

      purpose: [
        "consume the canonical Hearth four-pair hex authority",
        "preserve high-density visible hex surface expression",
        "keep raw sphere position as visual continuity source",
        "use hex authority only for cell identity, four-pair proof, grain, seam, state seed, and diagnostic alignment",
        "prevent competing hex truth from living inside the surface renderer"
      ],

      exposedMethods: [
        "drawHearthHexSurfaceFrame",
        "drawFrame",
        "getHearthHexSurfaceStatus",
        "getStatus",
        "getReceipt",
        "buildHexGeometry",
        "validateCanonicalHexAuthority"
      ],

      renderLaw: [
        "canonical hex truth belongs only to HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1",
        "hex surface is a consumer, not an authority",
        "raw sphere position owns visual continuity",
        "hex center may influence grain, seam, seed, and edge pressure only",
        "hex center may not override land or water visual continuity",
        "local render hex geometry is visual footprint only",
        "surface renderer may not define land truth",
        "surface renderer may not define water truth",
        "surface renderer may not define air truth",
        "surface renderer may not claim visual pass"
      ],

      owns: [
        "visible hex surface expression",
        "high-density hex footprint rendering",
        "authority-seeded grain expression",
        "seam pressure expression",
        "micro texture expression",
        "surface-consumer receipts"
      ],

      doesNotOwn: [
        "canonical hex truth",
        "hex cell identity",
        "four-pair handshake truth",
        "land truth",
        "water truth",
        "air truth",
        "hydrology",
        "elevation",
        "materials",
        "canvas mounting",
        "atlas projection",
        "route orchestration",
        "runtime motion",
        "controls",
        "final visual pass claim"
      ],

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    });
  }

  function dispose() {
    if (root.HEARTH_HEX_SURFACE && root.HEARTH_HEX_SURFACE.contract === CONTRACT) {
      try {
        delete root.HEARTH_HEX_SURFACE;
      } catch (_error) {
        root.HEARTH_HEX_SURFACE = null;
      }
    }

    if (root.HEARTH_HEX_SURFACE_STATUS && root.HEARTH_HEX_SURFACE_STATUS.contract === CONTRACT) {
      try {
        delete root.HEARTH_HEX_SURFACE_STATUS;
      } catch (_error) {
        root.HEARTH_HEX_SURFACE_STATUS = null;
      }
    }

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthHexSurfaceDisposed = "true";
    }
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,

    drawHearthHexSurfaceFrame,
    drawFrame: drawHearthHexSurfaceFrame,
    getHearthHexSurfaceStatus,
    getStatus: getHearthHexSurfaceStatus,
    getReceipt,
    buildHexGeometry,
    validateCanonicalHexAuthority,
    resolveCanonicalHexAuthority,

    canonicalHexAuthorityFile: CANONICAL_HEX_FILE,
    canonicalHexAuthorityExpectedContract: CANONICAL_HEX_CONTRACT,

    soleHexAuthorityConsumer: true,
    ownsCanonicalHexTruth: false,
    ownsHexCellIdentity: false,
    ownsFourPairHandshakeTruth: false,
    rawSpherePositionOwnsVisualContinuity: true,
    rawVectorVisualSampling: true,
    localRenderHexIsVisualFootprintOnly: true,
    hexCenterOwnsInfluenceOnly: true,
    hexCenterVisualOverride: false,

    landAuthority: false,
    waterAuthority: false,
    airAuthority: false,
    terrainAuthority: false,
    canvasAuthority: false,
    runtimeAuthority: false,
    routeAuthority: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  });

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.hexSurface = api;
  root.HEARTH.hexSurfaceConsumer = api;

  root.HEARTH_HEX_SURFACE = api;
  root.HEARTH_HEX_SURFACE_STATUS = STATUS;
  root.HEARTH_HEX_SURFACE_CONTRACT = CONTRACT;
  root.HEARTH_HEX_SURFACE_RECEIPT = RECEIPT;
  root.HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER = api;
  root.__HEARTH_HEX_SURFACE_DISPOSE__ = dispose;

  const initialValidation = validateCanonicalHexAuthority();

  STATUS.lastAuthorityValidation = initialValidation;
  STATUS.canonicalHexAuthorityPresent = initialValidation.authorityPresent;
  STATUS.canonicalHexAuthorityContractOk = initialValidation.contractOk;
  STATUS.canonicalHexAuthoritySampleOk = initialValidation.sampleOk;
  STATUS.canonicalHexAuthorityFourPairOk = initialValidation.fourPairOk;
  STATUS.canonicalHexAuthorityWideProbeOk = initialValidation.wideProbeOk;

  publishDataset(null, null, initialValidation);

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
