// /assets/hearth/hearth.air.channel.js
// HEARTH_AIR_CORE_BOUNDARY_HANDSHAKE_TNT_v1
// Full-file replacement.
// Air / pressure / humidity / boundary-envelope authority only.
// Compatibility note:
// - Public validation contract remains HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1
//   because the active canvas currently validates that exact contract.
// - Boundary handshake contract is exposed separately as boundaryHandshakeContract.
// Purpose:
// - Let the atmosphere become Hearth's visible planetary boundary as a read-only pressure envelope.
// - Prevent air from carrying land, water, terrain, elevation, composition, hydrology, or material truth.
// - Add boundary-envelope fields for downstream canvas consumption.
// - Preserve immediate Runtime Table compatibility.
// Does not own:
// - land truth
// - water truth
// - terrain truth
// - elevation truth
// - tectonic cause
// - composition classification
// - hydrology
// - material palette
// - canvas mounting
// - atlas projection
// - route orchestration
// - runtime motion
// - controls
// - final visual pass claim

(() => {
  "use strict";

  const PUBLIC_CONTRACT = "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1";
  const BOUNDARY_HANDSHAKE_CONTRACT = "HEARTH_AIR_CORE_BOUNDARY_HANDSHAKE_TNT_v1";
  const RECEIPT = "HEARTH_AIR_CORE_BOUNDARY_HANDSHAKE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1";
  const VERSION = "2026-05-29.hearth-air-core-boundary-handshake-v1";

  const LAND_CONTRACT = "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1";
  const WATER_CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;

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

  function wrap01(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function normalize3(p) {
    const x = safeNumber(p && p.x, 0);
    const y = safeNumber(p && p.y, 0);
    const z = safeNumber(p && p.z, 1);
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
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

  function safeCall(authority, method, arg) {
    if (!authority || typeof authority[method] !== "function") return null;

    try {
      const value = authority[method](arg);
      return value && typeof value === "object" ? value : null;
    } catch (_error) {
      return null;
    }
  }

  function getLandChannel() {
    return (
      root.HEARTH_LAND_CHANNEL ||
      root.HearthLandChannel ||
      (root.HEARTH && root.HEARTH.landChannel) ||
      null
    );
  }

  function getWaterChannel() {
    return (
      root.HEARTH_WATER_CHANNEL ||
      root.HearthWaterChannel ||
      (root.HEARTH && root.HEARTH.waterChannel) ||
      null
    );
  }

  function getElevationAuthority() {
    return (
      root.HEARTH_ELEVATION ||
      root.HearthElevation ||
      (root.HEARTH && root.HEARTH.elevation) ||
      null
    );
  }

  function getCompositionAuthority() {
    return (
      root.HEARTH_COMPOSITION ||
      root.HearthComposition ||
      (root.HEARTH && root.HEARTH.composition) ||
      null
    );
  }

  function readAuthority(authority, arg) {
    return (
      safeCall(authority, "sample", arg) ||
      safeCall(authority, "read", arg) ||
      safeCall(authority, "get", arg) ||
      null
    );
  }

  function readBodyInputs(p) {
    const ll = vectorToLonLat(p);

    const arg = {
      x: p.x,
      y: p.y,
      z: p.z,
      u: lonToU(ll.lon),
      v: latToV(ll.lat),
      lon: ll.lon,
      lat: ll.lat
    };

    const land = readAuthority(getLandChannel(), arg) || {};
    const water = readAuthority(getWaterChannel(), arg) || {};
    const elevation = readAuthority(getElevationAuthority(), arg) || {};
    const composition = readAuthority(getCompositionAuthority(), arg) || {};

    const landAlpha = clamp01(
      safeNumber(
        land.landAlpha ??
          land.landPresence ??
          land.alpha ??
          composition.landAlpha ??
          composition.landPresence,
        0
      )
    );

    const landPotential = clamp01(
      safeNumber(
        land.landPotential ??
          land.landPresence ??
          composition.landPotential ??
          composition.landPresence,
        landAlpha
      )
    );

    const waterAlpha = clamp01(
      safeNumber(
        water.waterAlpha ??
          water.waterPresence ??
          water.alpha ??
          composition.waterAlpha ??
          composition.waterPresence,
        0
      )
    );

    const bodyBinding = clamp01(
      Math.max(
        safeNumber(land.bodyBinding, 0),
        land.bodyBound === true ? 1 : 0,
        safeNumber(composition.bodyBinding, 0)
      )
    );

    const surfaceAttachment = clamp01(
      Math.max(
        safeNumber(land.surfaceAttachment, 0),
        land.surfaceBound === true ? 1 : 0,
        safeNumber(composition.surfaceAttachment, 0)
      )
    );

    const hydrosphereBinding = clamp01(
      Math.max(
        safeNumber(water.hydrosphereBinding, 0),
        water.bodyBound === true ? 1 : 0,
        safeNumber(water.depthBinding, 0) * 0.78
      )
    );

    const surfaceSeat = clamp01(
      Math.max(
        safeNumber(water.surfaceSeat, 0),
        water.surfaceBound === true ? 1 : 0,
        safeNumber(water.depthBinding, 0) * 0.72
      )
    );

    const elevationValue = safeNumber(
      land.elevation ??
        water.elevation ??
        elevation.elevation ??
        composition.elevation,
      0
    );

    const seaLevel = safeNumber(
      water.seaLevel ??
        land.seaLevel ??
        elevation.seaLevel ??
        composition.seaLevel,
      0
    );

    const coastPotential = clamp01(
      Math.max(
        safeNumber(land.coastPotential, 0),
        safeNumber(water.coastPotential, 0),
        safeNumber(composition.coastPotential, 0),
        safeNumber(land.shorelineContact, 0),
        safeNumber(water.shorelineContact, 0)
      )
    );

    const basinPotential = clamp01(
      Math.max(
        safeNumber(land.basinPotential, 0),
        safeNumber(water.basinInfluence, 0),
        safeNumber(composition.basinPotential, 0)
      )
    );

    const isLand = Boolean(
      land.isLand === true ||
        composition.isLand === true ||
        landAlpha >= 0.2 ||
        (landPotential >= 0.28 && elevationValue > seaLevel)
    );

    const isWater = Boolean(
      water.isWater === true ||
        land.isWater === true ||
        waterAlpha >= 0.2 ||
        elevationValue <= seaLevel
    );

    return {
      arg,
      land,
      water,
      elevation,
      composition,

      landAlpha,
      landPotential,
      waterAlpha,
      bodyBinding,
      surfaceAttachment,
      hydrosphereBinding,
      surfaceSeat,
      elevation: elevationValue,
      seaLevel,
      coastPotential,
      basinPotential,
      isLand,
      isWater,

      landAuthorityPresent: Boolean(getLandChannel()),
      waterAuthorityPresent: Boolean(getWaterChannel()),
      elevationAuthorityPresent: Boolean(getElevationAuthority()),
      compositionAuthorityPresent: Boolean(getCompositionAuthority())
    };
  }

  function localWeatherField(p, body) {
    const ll = vectorToLonLat(p);
    const latCurve = Math.cos(ll.lat * DEG);
    const waveA = Math.sin((ll.lon * 1.7 + ll.lat * 0.55 + 41) * DEG) * 0.5 + 0.5;
    const waveB = Math.cos((ll.lon * 0.85 - ll.lat * 2.2 - 12) * DEG) * 0.5 + 0.5;
    const waveC = Math.sin((p.x * 2.4 + p.y * 3.1 + p.z * 1.8) * Math.PI) * 0.5 + 0.5;

    const maritimeInfluence = clamp01(body.waterAlpha * 0.64 + body.coastPotential * 0.26 + waveB * 0.08);
    const landHeatInfluence = clamp01(body.landAlpha * 0.34 + Math.max(0, body.elevation - body.seaLevel) * 0.12);
    const humidity = clamp01(0.18 + maritimeInfluence * 0.5 + body.basinPotential * 0.16 + waveA * 0.06);
    const temperature = clamp01(0.28 + latCurve * 0.34 + landHeatInfluence * 0.14 - Math.max(0, body.elevation) * 0.10);
    const pressureBase = clamp01(0.66 + body.waterAlpha * 0.09 + body.coastPotential * 0.05 - Math.max(0, body.elevation) * 0.16);
    const stormPressure = clamp01(Math.max(0, humidity - 0.58) * 0.34 + body.coastPotential * 0.08 + waveC * 0.035);

    return {
      maritimeInfluence,
      landHeatInfluence,
      humidity,
      temperature,
      airPressure: pressureBase,
      stormPressure,
      waveA,
      waveB,
      waveC
    };
  }

  function computeBoundaryHandshake(p, body, weather) {
    const landSeat = clamp01(body.landAlpha * Math.max(body.bodyBinding, body.surfaceAttachment));
    const waterSeat = clamp01(body.waterAlpha * Math.max(body.hydrosphereBinding, body.surfaceSeat));
    const shelfSeat = clamp01(body.landPotential * 0.28 + body.coastPotential * 0.34 + body.basinPotential * 0.12);
    const bodyMassSignal = clamp01(Math.max(landSeat, waterSeat, shelfSeat, body.landAlpha * 0.25, body.waterAlpha * 0.38));

    const coreContact = clamp01(bodyMassSignal);
    const coreContactConfidence = clamp01(
      0.36 +
        body.landAuthorityPresent * 0.13 +
        body.waterAuthorityPresent * 0.13 +
        body.elevationAuthorityPresent * 0.08 +
        body.compositionAuthorityPresent * 0.08 +
        coreContact * 0.22
    );

    const boundaryConfidence = clamp01(coreContactConfidence + body.coastPotential * 0.10);
    const planetaryBoundary = clamp01(0.58 + coreContact * 0.24 + body.waterAlpha * 0.07 + body.landPotential * 0.06);
    const pressureShell = clamp01(0.42 + weather.airPressure * 0.32 + weather.humidity * 0.10 + coreContact * 0.10);
    const boundaryEnvelope = clamp01(0.18 + planetaryBoundary * 0.20 + pressureShell * 0.22 + coreContact * 0.22);
    const atmosphericWrap = clamp01(0.20 + boundaryEnvelope * 0.42 + weather.humidity * 0.14);
    const rimEnvelope = clamp01(0.16 + pressureShell * 0.24 + atmosphericWrap * 0.18);
    const horizonClamp = clamp01(0.74 + boundaryEnvelope * 0.19 + coreContactConfidence * 0.05);
    const limbCompression = clamp01(0.48 + rimEnvelope * 0.27 + horizonClamp * 0.13);

    const bodyOcclusion = clamp01(0.08 + coreContact * 0.22 + pressureShell * 0.10);
    const innerHazeAlpha = clamp01(0.025 + weather.humidity * 0.045 + weather.stormPressure * 0.035);
    const outerGlowAlpha = clamp01(0.045 + rimEnvelope * 0.13);
    const visualShellAlpha = clamp01(0.050 + pressureShell * 0.055 + boundaryEnvelope * 0.060);
    const atmosphereOnlyAlpha = clamp01(0.042 + weather.humidity * 0.055 + rimEnvelope * 0.035);

    return {
      planetaryBoundary,
      boundaryEnvelope,
      boundaryConfidence,
      bodyBoundaryReadOnly: true,
      coreContact,
      coreContactConfidence,
      pressureShell,
      rimEnvelope,
      horizonClamp,
      limbCompression,
      atmosphericWrap,
      innerHazeAlpha,
      outerGlowAlpha,
      surfaceRejection: 1,
      landCarryRejection: clamp01(0.88 + body.landAlpha * 0.09),
      waterCarryRejection: clamp01(0.88 + body.waterAlpha * 0.09),
      terrainCarryRejection: 1,
      bodyOcclusion,
      visualShellAlpha,
      atmosphereOnlyAlpha,
      boundaryMode: "read-only-core-boundary-envelope"
    };
  }

  function computeAirColor(body, weather, boundary) {
    const deepPressure = [8, 12, 17];
    const maritimeBlue = [13, 22, 31];
    const rimBlue = [46, 70, 86];
    const humidGray = [24, 31, 36];

    let rgb = mixColor(deepPressure, maritimeBlue, clamp01(weather.maritimeInfluence * 0.55));
    rgb = mixColor(rgb, humidGray, clamp01(weather.humidity * 0.22));
    rgb = mixColor(rgb, rimBlue, clamp01(boundary.rimEnvelope * 0.16));

    if (body.isLand) {
      rgb = mixColor(rgb, [18, 18, 16], clamp01(body.landAlpha * 0.10));
    }

    return rgb;
  }

  function sampleAir(...args) {
    const p = parseInput(...args);
    const ll = vectorToLonLat(p);
    const body = readBodyInputs(p);
    const weather = localWeatherField(p, body);
    const boundary = computeBoundaryHandshake(p, body, weather);
    const rgb = computeAirColor(body, weather, boundary);

    const cloudPotential = clamp01(weather.humidity * 0.34 + weather.stormPressure * 0.26 + body.coastPotential * 0.08);
    const mistPotential = clamp01(weather.humidity * 0.24 + body.coastPotential * 0.18 + body.basinPotential * 0.10);
    const barometricPressure = clamp01(weather.airPressure * 0.72 + boundary.pressureShell * 0.18);
    const barometricGradient = clamp01(Math.abs(weather.waveA - weather.waveB) * 0.24 + body.coastPotential * 0.10);

    const airAlpha = clamp01(
      boundary.atmosphereOnlyAlpha +
        boundary.visualShellAlpha * 0.28 +
        cloudPotential * 0.035
    );

    return {
      contract: PUBLIC_CONTRACT,
      compatibilityContract: PUBLIC_CONTRACT,
      boundaryHandshakeContract: BOUNDARY_HANDSHAKE_CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "air-core-boundary-pressure-envelope-channel",

      x: p.x,
      y: p.y,
      z: p.z,
      u: lonToU(ll.lon),
      v: latToV(ll.lat),
      lon: ll.lon,
      lat: ll.lat,

      channel: "air",
      channelClass: "boundary-pressure-envelope-air-channel",
      airClass: "boundary-pressure-envelope-air-channel",
      isLandChannel: false,
      isWaterChannel: false,
      isAirChannel: true,

      airPresence: airAlpha,
      airAlpha,
      atmosphereSeparation: clamp01(boundary.surfaceRejection * 0.74 + boundary.boundaryEnvelope * 0.12),
      humidity: weather.humidity,
      airPressure: weather.airPressure,
      barometricPressure,
      barometricGradient,
      cloudPotential,
      mistPotential,
      stormPressure: weather.stormPressure,
      rimHaze: boundary.rimEnvelope,
      limbAtmosphere: boundary.atmosphericWrap,
      temperature: weather.temperature,
      moisture: weather.humidity,

      elevation: body.elevation,
      seaLevel: body.seaLevel,
      isLand: body.isLand,
      isWater: body.isWater,

      stormCoastInfluence: clamp01(weather.stormPressure * body.coastPotential),
      monsoonInfluence: clamp01(weather.humidity * body.coastPotential * 0.34),
      rainforestInfluence: clamp01(weather.humidity * body.landAlpha * 0.28),
      maritimeInfluence: weather.maritimeInfluence,
      alpineInfluence: clamp01(Math.max(0, body.elevation - body.seaLevel) * 0.26),
      basinPotential: body.basinPotential,
      coastPotential: body.coastPotential,

      pressureEnvelope: boundary.pressureShell,
      humidityEnvelope: clamp01(weather.humidity * 0.72 + boundary.innerHazeAlpha * 0.16),
      cloudEnvelope: clamp01(cloudPotential * 0.68 + boundary.outerGlowAlpha * 0.12),
      airFloat: clamp01(0.44 + boundary.atmosphericWrap * 0.28),
      bodyDetachment: clamp01(0.28 - boundary.coreContact * 0.14 + boundary.outerGlowAlpha * 0.08),
      landWaterRejection: clamp01(Math.min(boundary.landCarryRejection, boundary.waterCarryRejection)),

      planetaryBoundary: boundary.planetaryBoundary,
      boundaryEnvelope: boundary.boundaryEnvelope,
      boundaryConfidence: boundary.boundaryConfidence,
      bodyBoundaryReadOnly: true,
      coreContact: boundary.coreContact,
      coreContactConfidence: boundary.coreContactConfidence,
      pressureShell: boundary.pressureShell,
      rimEnvelope: boundary.rimEnvelope,
      horizonClamp: boundary.horizonClamp,
      limbCompression: boundary.limbCompression,
      atmosphericWrap: boundary.atmosphericWrap,
      innerHazeAlpha: boundary.innerHazeAlpha,
      outerGlowAlpha: boundary.outerGlowAlpha,
      surfaceRejection: boundary.surfaceRejection,
      landCarryRejection: boundary.landCarryRejection,
      waterCarryRejection: boundary.waterCarryRejection,
      terrainCarryRejection: boundary.terrainCarryRejection,
      bodyOcclusion: boundary.bodyOcclusion,
      visualShellAlpha: boundary.visualShellAlpha,
      atmosphereOnlyAlpha: boundary.atmosphereOnlyAlpha,
      boundaryMode: boundary.boundaryMode,

      bodyBound: false,
      surfaceBound: false,
      floatsAboveBody: true,
      allowedToFloat: true,
      mayDefineLand: false,
      mayDefineWater: false,
      mayDefineTerrain: false,
      mayDefineElevation: false,
      mayDefineComposition: false,
      mayDefineHydrology: false,
      mayDefineMaterials: false,

      landAuthorityPresent: body.landAuthorityPresent,
      waterAuthorityPresent: body.waterAuthorityPresent,
      elevationAuthorityPresent: body.elevationAuthorityPresent,
      compositionAuthorityPresent: body.compositionAuthorityPresent,
      landExpectedContract: LAND_CONTRACT,
      waterExpectedContract: WATER_CONTRACT,
      landActualContract: body.land && body.land.contract ? String(body.land.contract) : "",
      waterActualContract: body.water && body.water.contract ? String(body.water.contract) : "",

      rgb,
      color: rgb,
      alpha: airAlpha,
      debugColor: [170, 210, 235],

      ownsTectonicCause: false,
      ownsElevationGeneration: false,
      ownsCompositionClassification: false,
      ownsLand: false,
      ownsWater: false,
      ownsTerrain: false,
      ownsHydrology: false,
      ownsMaterialPalette: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function createWideProbe(options = {}) {
    const rows = clamp(Math.round(safeNumber(options.rows, 5)), 2, 16);
    const columns = clamp(Math.round(safeNumber(options.columns, 9)), 3, 32);
    const samples = [];

    for (let row = 0; row < rows; row += 1) {
      const v = rows <= 1 ? 0.5 : row / (rows - 1);

      for (let column = 0; column < columns; column += 1) {
        const u = columns <= 1 ? 0.5 : column / (columns - 1);
        samples.push(sampleAir({ u, v }));
      }
    }

    const total = samples.length || 1;
    const avg = (key) => samples.reduce((sum, item) => sum + safeNumber(item[key], 0), 0) / total;

    return {
      contract: PUBLIC_CONTRACT,
      boundaryHandshakeContract: BOUNDARY_HANDSHAKE_CONTRACT,
      receipt: RECEIPT,
      mode: "wide-probe",
      rows,
      columns,
      total: samples.length,
      minimumWideProbePoints: 25,
      wideProbeReady: samples.length >= 25,
      averages: {
        airAlpha: avg("airAlpha"),
        boundaryEnvelope: avg("boundaryEnvelope"),
        boundaryConfidence: avg("boundaryConfidence"),
        pressureShell: avg("pressureShell"),
        atmosphericWrap: avg("atmosphericWrap"),
        landCarryRejection: avg("landCarryRejection"),
        waterCarryRejection: avg("waterCarryRejection"),
        terrainCarryRejection: avg("terrainCarryRejection"),
        bodyOcclusion: avg("bodyOcclusion")
      },
      samples,
      visualPassClaimed: false
    };
  }

  function readAir(...args) {
    if (
      args.length === 1 &&
      args[0] &&
      typeof args[0] === "object" &&
      String(args[0].mode || "").toLowerCase() === "wide-probe"
    ) {
      return createWideProbe(args[0]);
    }

    return sampleAir(...args);
  }

  function getReceipt() {
    return {
      contract: PUBLIC_CONTRACT,
      compatibilityContract: PUBLIC_CONTRACT,
      boundaryHandshakeContract: BOUNDARY_HANDSHAKE_CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "air-core-boundary-pressure-envelope-channel",
      status: "active",
      destinationFile: "/assets/hearth/hearth.air.channel.js",
      channel: "air",
      role: "floating-atmosphere-pressure-boundary-envelope-channel",
      purpose:
        "separate air, pressure, humidity, haze, mist, cloud-like behavior, and read-only planetary boundary envelope from land and water before canvas multiplexing",

      compatibilityReason:
        "Current Hearth canvas validates HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1 directly. This TNT preserves that public validation contract while exposing the boundary handshake contract separately.",

      consumesReadOnly: [
        "Hearth land channel when available",
        "Hearth water channel when available",
        "Hearth elevation authority when available",
        "Hearth composition authority when available",
        "fallback local pressure/humidity packet only as fail-soft"
      ],

      exposedMethods: [
        "sample",
        "read",
        "getReceipt"
      ],

      readModes: [
        "sample",
        "wide-probe"
      ],

      exposedFields: [
        "airPresence",
        "airAlpha",
        "atmosphereSeparation",
        "humidity",
        "airPressure",
        "barometricPressure",
        "barometricGradient",
        "cloudPotential",
        "mistPotential",
        "stormPressure",
        "rimHaze",
        "limbAtmosphere",
        "pressureEnvelope",
        "humidityEnvelope",
        "cloudEnvelope",
        "airFloat",
        "bodyDetachment",
        "landWaterRejection",
        "planetaryBoundary",
        "boundaryEnvelope",
        "boundaryConfidence",
        "bodyBoundaryReadOnly",
        "coreContact",
        "coreContactConfidence",
        "pressureShell",
        "rimEnvelope",
        "horizonClamp",
        "limbCompression",
        "atmosphericWrap",
        "innerHazeAlpha",
        "outerGlowAlpha",
        "surfaceRejection",
        "landCarryRejection",
        "waterCarryRejection",
        "terrainCarryRejection",
        "bodyOcclusion",
        "visualShellAlpha",
        "atmosphereOnlyAlpha",
        "boundaryMode",
        "rgb",
        "alpha"
      ],

      renderLaw: [
        "air is the only channel allowed to float",
        "air may wrap, haze, soften, mist, cloud, rim, and pressure-shell the planet",
        "air may expose a read-only planetary boundary envelope",
        "air cannot define landmass",
        "air cannot define ocean boundary",
        "air cannot define terrain",
        "air cannot define elevation",
        "air cannot define composition",
        "air cannot define hydrology",
        "air cannot override body-bound land or surface-seated water",
        "canvas must composite body first and atmosphere after",
        "boundary envelope is consumer input, not source truth"
      ],

      owns: [
        "air-channel-expression",
        "pressure-fields",
        "barometric-fields",
        "humidity-fields",
        "cloud-like-fields",
        "mist-fields",
        "rim-haze-fields",
        "read-only-boundary-envelope-fields",
        "core-contact-read-fields",
        "land-carry-rejection-fields",
        "water-carry-rejection-fields",
        "terrain-carry-rejection-fields",
        "air-channel-color-packet",
        "air-channel-wide-probe-read-mode"
      ],

      doesNotOwn: [
        "tectonic-cause",
        "elevation-generation",
        "composition-classification",
        "land-authority",
        "water-authority",
        "terrain-authority",
        "hydrology-authority",
        "material-palette-authority",
        "canvas-mounting",
        "atlas-projection",
        "Runtime Table planning",
        "route-orchestration",
        "runtime-motion",
        "controls",
        "final-visual-pass-claim"
      ],

      expectedRuntimeTableOutcome: {
        airGlobalPresent: true,
        airActualContract: PUBLIC_CONTRACT,
        airSampleProbeOk: true,
        airSampleProbeCoordinatesOk: true,
        airSampleProbeFlagsOk: true,
        airValidationOk: true,
        boundaryHandshakeActive: true,
        bodyBoundaryReadOnly: true,
        wideProbeDiagnosticAvailable: true
      },

      loadSafety: {
        noImports: true,
        noRequiredFetch: true,
        exportsImmediately: true,
        safeWithoutDom: true,
        safeWithoutCanvas: true,
        safeWithoutRuntimeTable: true,
        safeWithoutUpstreamLand: true,
        safeWithoutUpstreamWater: true,
        neverReturnsNullFromSample: true
      },

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: PUBLIC_CONTRACT,
    compatibilityContract: PUBLIC_CONTRACT,
    boundaryHandshakeContract: BOUNDARY_HANDSHAKE_CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    authority: "air-core-boundary-pressure-envelope-channel",

    sample: sampleAir,
    read: readAir,
    getReceipt,

    supportsBoundaryHandshake: true,
    supportsReadOnlyPlanetaryBoundary: true,
    supportsPressureShell: true,
    supportsCoreContactRead: true,
    supportsLandCarryRejection: true,
    supportsWaterCarryRejection: true,
    supportsTerrainCarryRejection: true,
    supportsWideProbeReadMode: true,

    bodyBoundaryReadOnly: true,
    mayDefineLand: false,
    mayDefineWater: false,
    mayDefineTerrain: false,
    mayDefineElevation: false,
    mayDefineComposition: false,
    mayDefineHydrology: false,
    ownsCanvas: false,
    ownsRuntime: false,
    ownsControls: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.airChannel = api;

  root.HEARTH_AIR_CHANNEL = api;
  root.HearthAirChannel = api;
  root.HEARTH_AIR_CHANNEL_RECEIPT = getReceipt();
  root.HEARTH_AIR_CHANNEL_CONTRACT = PUBLIC_CONTRACT;
  root.HEARTH_AIR_BOUNDARY_HANDSHAKE_CONTRACT = BOUNDARY_HANDSHAKE_CONTRACT;
  root.HEARTH_AIR_CORE_BOUNDARY_HANDSHAKE_ACTIVE = true;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.hearthAirChannelLoaded = "true";
    dataset.hearthAirChannelContract = PUBLIC_CONTRACT;
    dataset.hearthAirChannelCompatibilityContract = PUBLIC_CONTRACT;
    dataset.hearthAirBoundaryHandshakeContract = BOUNDARY_HANDSHAKE_CONTRACT;
    dataset.hearthAirChannelReceipt = RECEIPT;
    dataset.hearthAirChannelPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthAirChannelAuthority = "air-core-boundary-pressure-envelope-channel";

    dataset.hearthAirBoundaryHandshakeActive = "true";
    dataset.hearthAirBoundaryMode = "read-only-core-boundary-envelope";
    dataset.hearthAirBodyBoundaryReadOnly = "true";
    dataset.hearthAirPressureShell = "true";
    dataset.hearthAirPlanetaryBoundaryEnvelope = "true";
    dataset.hearthAirCoreContactReadOnly = "true";
    dataset.hearthAirLandCarryRejection = "true";
    dataset.hearthAirWaterCarryRejection = "true";
    dataset.hearthAirTerrainCarryRejection = "true";
    dataset.hearthAirChannelAllowedToFloat = "true";
    dataset.hearthAirChannelDefinesLand = "false";
    dataset.hearthAirChannelDefinesWater = "false";
    dataset.hearthAirChannelDefinesTerrain = "false";
    dataset.hearthAirChannelDefinesElevation = "false";
    dataset.hearthAirChannelDefinesComposition = "false";
    dataset.hearthAirChannelDefinesHydrology = "false";

    dataset.hearthAirCanvasConsumerPending = "true";
    dataset.hearthAirCanvasMustCompositeBodyFirst = "true";
    dataset.hearthAirBoundaryFirstHandshake = "true";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
