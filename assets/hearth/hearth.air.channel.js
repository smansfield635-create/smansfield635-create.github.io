// /assets/hearth/hearth.air.channel.js
// HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1
// Full-file replacement / new file.
// Air channel authority only.
// Purpose:
// - Own atmospheric / pressure / humidity / haze channel expression.
// - Convert resolved climate, material, hydrology, ocean, composition, and elevation packets into air-layer fields.
// - Keep air explicitly separate from land and water body channels.
// - Allow only air to float above the planetary body.
// - Expose a lightweight channel packet for canvas multiplexing.
// Does not own:
// - tectonic cause
// - elevation generation
// - composition classification
// - land authority
// - water authority
// - material palette authority
// - canvas mounting
// - route orchestration
// - runtime motion
// - controls
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1";
  const RECEIPT = "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_RECEIPT_v1";
  const VERSION = "2026-05-28.hearth-air-pressure-humidity-channel-v1";
  const SEA_LEVEL = 0.0;
  const DEG = Math.PI / 180;

  const root = typeof window !== "undefined" ? window : globalThis;

  const FALLBACK_COLORS = Object.freeze({
    clearAir: [24, 38, 58],
    haze: [114, 145, 164],
    humidMist: [158, 184, 190],
    storm: [70, 78, 96],
    pressure: [138, 128, 176],
    rim: [174, 216, 236],
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

  function smoothstep(edge0, edge1, x) {
    const d = edge1 - edge0 || 1;
    const t = clamp01((x - edge0) / d);
    return t * t * (3 - 2 * t);
  }

  function softBand(value, center, width) {
    const t = 1 - clamp(Math.abs(value - center) / Math.max(0.000001, width), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
  }

  function normalize3(p) {
    const x = Number.isFinite(Number(p && p.x)) ? Number(p.x) : 0;
    const y = Number.isFinite(Number(p && p.y)) ? Number(p.y) : 0;
    const z = Number.isFinite(Number(p && p.z)) ? Number(p.z) : 1;
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
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

  function parseInput(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        const u = wrap01(p.u);
        const v = clamp(Number(p.v), 0, 1);
        const lon = uToLon(u);
        const lat = vToLat(v);
        const vector = lonLatToVector(lon, lat);
        return { ...vector, u, v, lon, lat };
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        const lon = Number(p.lon);
        const lat = Number(p.lat);
        const vector = lonLatToVector(lon, lat);
        return { ...vector, u: lonToU(lon), v: latToV(lat), lon, lat };
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        const lon = Number(p.longitude);
        const lat = Number(p.latitude);
        const vector = lonLatToVector(lon, lat);
        return { ...vector, u: lonToU(lon), v: latToV(lat), lon, lat };
      }

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        const vector = normalize3(p);
        const ll = vectorToLonLat(vector);
        return { ...vector, u: lonToU(ll.lon), v: latToV(ll.lat), lon: ll.lon, lat: ll.lat };
      }
    }

    if (args.length >= 3) {
      const vector = normalize3({ x: args[0], y: args[1], z: args[2] });
      const ll = vectorToLonLat(vector);
      return { ...vector, u: lonToU(ll.lon), v: latToV(ll.lat), lon: ll.lon, lat: ll.lat };
    }

    if (args.length >= 2) {
      const lon = Number(args[0]);
      const lat = Number(args[1]);
      const vector = lonLatToVector(lon, lat);
      return { ...vector, u: lonToU(lon), v: latToV(lat), lon, lat };
    }

    const vector = lonLatToVector(0, 0);
    return { ...vector, u: 0.5, v: 0.5, lon: 0, lat: 0 };
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

  function getClimateAuthority() {
    if (root.HEARTH && root.HEARTH.climate) return root.HEARTH.climate;
    if (root.HEARTH_CLIMATE) return root.HEARTH_CLIMATE;
    if (root.HearthClimate) return root.HearthClimate;
    return null;
  }

  function getCompositionAuthority() {
    if (root.HEARTH && root.HEARTH.composition) return root.HEARTH.composition;
    if (root.HEARTH_COMPOSITION) return root.HEARTH_COMPOSITION;
    if (root.HearthComposition) return root.HearthComposition;
    return null;
  }

  function getElevationAuthority() {
    if (root.HEARTH && root.HEARTH.elevation) return root.HEARTH.elevation;
    if (root.HEARTH_ELEVATION) return root.HEARTH_ELEVATION;
    if (root.HearthElevation) return root.HearthElevation;
    return null;
  }

  function getMaterialsAuthority() {
    if (root.HEARTH && root.HEARTH.materials) return root.HEARTH.materials;
    if (root.HEARTH_MATERIALS) return root.HEARTH_MATERIALS;
    if (root.HearthMaterials) return root.HearthMaterials;
    return null;
  }

  function getHydrologyAuthority() {
    if (root.HEARTH && root.HEARTH.hydrology) return root.HEARTH.hydrology;
    if (root.HEARTH_HYDROLOGY) return root.HEARTH_HYDROLOGY;
    if (root.HearthHydrology) return root.HearthHydrology;
    return null;
  }

  function getOceanAuthority() {
    if (root.HEARTH && root.HEARTH.ocean) return root.HEARTH.ocean;
    if (root.HEARTH_OCEAN) return root.HEARTH_OCEAN;
    if (root.HearthOcean) return root.HearthOcean;
    return null;
  }

  function callAuthority(authority, methods, args, fallbackArg) {
    if (!authority) return null;

    for (const method of methods) {
      if (typeof authority[method] !== "function") continue;

      try {
        const result = authority[method].apply(authority, args);
        if (result && typeof result === "object") return result;
      } catch (_error) {
        try {
          const result = authority[method].call(authority, fallbackArg);
          if (result && typeof result === "object") return result;
        } catch (_error2) {}
      }
    }

    return null;
  }

  function callClimateAuthority(p, base, terrain, elevation) {
    const climate = getClimateAuthority();

    if (!climate) return null;

    if (typeof climate.sampleClimate === "function") {
      try {
        const result = climate.sampleClimate(p.u, p.v, base || {}, terrain || {}, elevation || {});
        if (result && typeof result === "object") return result;
      } catch (_error) {}
    }

    return callAuthority(
      climate,
      ["sample", "read", "getClimate", "sampleAir", "readAir"],
      [{ u: p.u, v: p.v, lon: p.lon, lat: p.lat, x: p.x, y: p.y, z: p.z }],
      { u: p.u, v: p.v, lon: p.lon, lat: p.lat, x: p.x, y: p.y, z: p.z }
    );
  }

  function packetFromDirectInput(input) {
    if (!input || typeof input !== "object") return null;

    if (
      Number.isFinite(Number(input.atmosphereSeparation)) ||
      Number.isFinite(Number(input.humidity)) ||
      Number.isFinite(Number(input.airPressure)) ||
      Number.isFinite(Number(input.barometricPressure)) ||
      Number.isFinite(Number(input.cloudPotential)) ||
      Number.isFinite(Number(input.mistPotential)) ||
      Number.isFinite(Number(input.stormPressure)) ||
      Number.isFinite(Number(input.rimHaze)) ||
      Number.isFinite(Number(input.limbAtmosphere))
    ) {
      return input;
    }

    if (input.air && typeof input.air === "object") return input.air;
    if (input.climate && typeof input.climate === "object") return input.climate;
    if (input.material && typeof input.material === "object") return input.material;
    if (input.composition && typeof input.composition === "object") return input.composition;
    if (input.elevationSample && typeof input.elevationSample === "object") return input.elevationSample;

    return null;
  }

  function fallbackPacket(p) {
    const latitudeCold = clamp01(Math.abs(p.lat) / 90);
    const equatorWarm = clamp01(1 - latitudeCold);
    const limbHint = clamp01(1 - Math.abs(p.z));
    const humidity = clamp01(equatorWarm * 0.34 + softBand(p.lat, 0, 32) * 0.20);
    const pressure = clamp01(0.58 + Math.cos(p.lat * DEG) * 0.14 - latitudeCold * 0.10);
    const gradient = clamp01(Math.abs(Math.sin((p.lon + p.lat) * DEG)) * 0.42);
    const cloud = clamp01(humidity * 0.42 + gradient * 0.18);
    const mist = clamp01(humidity * 0.22 + limbHint * 0.18);
    const storm = clamp01(cloud * gradient * 0.40);

    return {
      contract: "HEARTH_AIR_CHANNEL_FALLBACK_PACKET",
      receipt: "HEARTH_AIR_CHANNEL_FALLBACK_PACKET_RECEIPT",
      x: p.x,
      y: p.y,
      z: p.z,
      u: p.u,
      v: p.v,
      lon: p.lon,
      lat: p.lat,

      elevation: 0,
      isLand: false,
      isWater: false,

      temperature: equatorWarm,
      moisture: humidity,
      humidity,
      airPressure: pressure,
      barometricPressure: pressure,
      barometricGradient: gradient,
      cloudPotential: cloud,
      mistPotential: mist,
      stormPressure: storm,
      rimHaze: limbHint,
      limbAtmosphere: limbHint,
      atmosphereSeparation: 0.42,
      rgb: FALLBACK_COLORS.haze.slice(),
      alpha: clamp01(0.10 + mist * 0.20 + cloud * 0.12)
    };
  }

  function readSourcePackets(args, p) {
    const fallbackArg = { u: p.u, v: p.v, lon: p.lon, lat: p.lat, x: p.x, y: p.y, z: p.z };
    const direct = args.length === 1 ? packetFromDirectInput(args[0]) : null;

    const composition = direct || callAuthority(
      getCompositionAuthority(),
      ["sample", "read", "compose", "sampleComposition", "readComposition"],
      args,
      fallbackArg
    );

    const elevation = direct || callAuthority(
      getElevationAuthority(),
      ["sample", "read", "getElevation", "sampleElevation", "readElevation"],
      args,
      fallbackArg
    );

    const material = direct || callAuthority(
      getMaterialsAuthority(),
      ["sample", "read", "getMaterial", "materialAt", "getMaterialAt", "getSurfaceMaterial", "resolve", "resolveMaterial"],
      args,
      fallbackArg
    );

    const hydrology = direct || callAuthority(
      getHydrologyAuthority(),
      ["sample", "read", "sampleHydrology", "readHydrology", "getHydrology"],
      args,
      fallbackArg
    );

    const ocean = direct || callAuthority(
      getOceanAuthority(),
      ["sample", "read", "sampleOcean", "readOcean", "getOcean", "oceanAt", "getOceanAt", "resolveOcean"],
      args,
      fallbackArg
    );

    const climate = direct || callClimateAuthority(
      p,
      composition || {},
      material || {},
      elevation || {}
    );

    return {
      climate: climate && typeof climate === "object" ? climate : null,
      composition: composition && typeof composition === "object" ? composition : null,
      elevation: elevation && typeof elevation === "object" ? elevation : null,
      material: material && typeof material === "object" ? material : null,
      hydrology: hydrology && typeof hydrology === "object" ? hydrology : null,
      ocean: ocean && typeof ocean === "object" ? ocean : null
    };
  }

  function normalizePacket(sources, p) {
    const fallback = fallbackPacket(p);
    const climate = sources.climate || {};
    const composition = sources.composition || {};
    const elevationPacket = sources.elevation || {};
    const material = sources.material || {};
    const hydrology = sources.hydrology || {};
    const ocean = sources.ocean || {};

    const elevation = Number.isFinite(Number(composition.elevation))
      ? Number(composition.elevation)
      : Number.isFinite(Number(elevationPacket.elevation))
        ? Number(elevationPacket.elevation)
        : Number.isFinite(Number(material.elevation))
          ? Number(material.elevation)
          : fallback.elevation;

    const isWater = boolField(
      composition,
      "isWater",
      boolField(
        elevationPacket,
        "isWater",
        boolField(hydrology, "waterFill", elevation <= SEA_LEVEL)
      )
    );

    const isLand = boolField(composition, "isLand", boolField(elevationPacket, "isLand", elevation > SEA_LEVEL));

    const latitudeCold = clamp01(Math.abs(p.lat) / 90);
    const equatorWarm = clamp01(1 - latitudeCold);

    const moisture = clamp01(
      numberField(climate, "moisture",
        numberField(climate, "wetness",
          numberField(composition, "rainforestInfluence",
            numberField(composition, "maritimeInfluence", 0) * 0.54 +
            numberField(hydrology, "waterFillStrength", 0) * 0.24 +
            numberField(ocean, "oceanPresence", 0) * 0.18
          )
        )
      )
    );

    const temperature = clamp01(
      numberField(climate, "temperature",
        numberField(composition, "climatePotential", equatorWarm)
      )
    );

    const humidity = clamp01(
      numberField(climate, "humidity",
        numberField(material, "humidity",
          moisture * 0.50 +
          numberField(hydrology, "waterFillStrength", 0) * 0.18 +
          numberField(ocean, "oceanPresence", 0) * 0.16 +
          equatorWarm * 0.10
        )
      )
    );

    const atmosphereSeparation = clamp01(
      numberField(material, "atmosphereSeparation",
        numberField(climate, "atmosphereSeparation",
          humidity * 0.18 +
          latitudeCold * 0.10 +
          numberField(ocean, "oceanTerrainSeparationFeed", 0) * 0.10 +
          0.22
        )
      )
    );

    const airPressure = clamp01(
      numberField(climate, "airPressure",
        numberField(climate, "pressure",
          0.52 +
          (1 - Math.abs(p.lat) / 110) * 0.20 +
          humidity * 0.10 -
          Math.max(0, elevation) * 0.12
        )
      )
    );

    const barometricPressure = clamp01(
      numberField(climate, "barometricPressure",
        airPressure * 0.76 +
        humidity * 0.10 +
        numberField(composition, "stormCoastInfluence", 0) * 0.08
      )
    );

    const barometricGradient = clamp01(
      numberField(climate, "barometricGradient",
        Math.abs(airPressure - barometricPressure) * 1.8 +
        numberField(composition, "stormCoastInfluence", 0) * 0.20 +
        numberField(composition, "monsoonInfluence", 0) * 0.12 +
        numberField(composition, "alpineInfluence", 0) * 0.10
      )
    );

    const cloudPotential = clamp01(
      numberField(climate, "cloudPotential",
        humidity * 0.38 +
        barometricGradient * 0.20 +
        numberField(composition, "stormCoastInfluence", 0) * 0.16 +
        numberField(composition, "monsoonInfluence", 0) * 0.10
      )
    );

    const mistPotential = clamp01(
      numberField(climate, "mistPotential",
        humidity * 0.28 +
        numberField(composition, "basinPotential", 0) * 0.12 +
        numberField(hydrology, "nearSeaLevelStrength", 0) * 0.14 +
        numberField(ocean, "shallowShelfBlueFeed", 0) * 0.10
      )
    );

    const stormPressure = clamp01(
      numberField(climate, "stormPressure",
        cloudPotential * barometricGradient * 0.56 +
        numberField(composition, "stormCoastInfluence", 0) * 0.22 +
        numberField(composition, "monsoonInfluence", 0) * 0.14
      )
    );

    const rimHaze = clamp01(numberField(climate, "rimHaze", atmosphereSeparation * 0.38 + humidity * 0.14));
    const limbAtmosphere = clamp01(numberField(climate, "limbAtmosphere", rimHaze * 0.68 + atmosphereSeparation * 0.18));

    const baseRgb = colorField(
      climate,
      ["airRgb", "atmosphereRgb", "rgb", "color"],
      colorField(material, ["atmosphereRgb", "airRgb"], FALLBACK_COLORS.haze)
    );

    return {
      contract:
        stringField(climate, "contract", "") ||
        stringField(material, "contract", "") ||
        stringField(composition, "contract", "") ||
        stringField(elevationPacket, "contract", fallback.contract),

      receipt:
        stringField(climate, "receipt", "") ||
        stringField(material, "receipt", "") ||
        stringField(composition, "receipt", "") ||
        stringField(elevationPacket, "receipt", fallback.receipt),

      x: p.x,
      y: p.y,
      z: p.z,
      u: p.u,
      v: p.v,
      lon: p.lon,
      lat: p.lat,

      elevation,
      isLand,
      isWater,

      temperature,
      moisture,
      humidity,
      airPressure,
      barometricPressure,
      barometricGradient,
      cloudPotential,
      mistPotential,
      stormPressure,
      rimHaze,
      limbAtmosphere,
      atmosphereSeparation,

      stormCoastInfluence: clamp01(numberField(composition, "stormCoastInfluence", 0)),
      monsoonInfluence: clamp01(numberField(composition, "monsoonInfluence", 0)),
      rainforestInfluence: clamp01(numberField(composition, "rainforestInfluence", 0)),
      maritimeInfluence: clamp01(numberField(composition, "maritimeInfluence", 0)),
      alpineInfluence: clamp01(numberField(composition, "alpineInfluence", 0)),
      basinPotential: clamp01(numberField(composition, "basinPotential", 0)),
      coastPotential: clamp01(numberField(composition, "coastPotential", 0)),
      waterFillStrength: clamp01(numberField(hydrology, "waterFillStrength", 0)),
      oceanPresence: clamp01(numberField(ocean, "oceanPresence", 0)),
      nearSeaLevelStrength: clamp01(numberField(hydrology, "nearSeaLevelStrength", 0)),

      rgb: baseRgb,
      color: baseRgb,
      alpha: clamp01(numberField(climate, "alpha", atmosphereSeparation * 0.22 + cloudPotential * 0.18 + mistPotential * 0.12))
    };
  }

  function airClassFor(packet) {
    if (packet.stormPressure > 0.42) return "floating-storm-pressure";
    if (packet.cloudPotential > 0.48) return "floating-cloud-field";
    if (packet.mistPotential > 0.38) return "floating-humid-mist";
    if (packet.barometricGradient > 0.40) return "floating-barometric-gradient";
    if (packet.humidity > 0.42) return "floating-humidity-field";
    if (packet.rimHaze > 0.32 || packet.limbAtmosphere > 0.30) return "floating-rim-haze";
    if (packet.atmosphereSeparation > 0.24) return "floating-clear-air";
    return "thin-air-channel";
  }

  function computeAirColor(packet, airClass, airAlpha) {
    let rgb = packet.rgb.slice();

    if (airClass === "floating-storm-pressure") {
      rgb = mixColor(rgb, FALLBACK_COLORS.storm, 0.46);
      rgb = mixColor(rgb, FALLBACK_COLORS.pressure, packet.barometricGradient * 0.22);
    } else if (airClass === "floating-cloud-field") {
      rgb = mixColor(rgb, FALLBACK_COLORS.haze, 0.42);
    } else if (airClass === "floating-humid-mist") {
      rgb = mixColor(rgb, FALLBACK_COLORS.humidMist, 0.46);
    } else if (airClass === "floating-barometric-gradient") {
      rgb = mixColor(rgb, FALLBACK_COLORS.pressure, 0.34);
    } else if (airClass === "floating-rim-haze") {
      rgb = mixColor(rgb, FALLBACK_COLORS.rim, 0.28);
    } else {
      rgb = mixColor(FALLBACK_COLORS.clearAir, rgb, 0.36);
    }

    const stormShade = clamp01(packet.stormPressure * 0.12 + packet.barometricGradient * 0.06);
    rgb = scaleColor(rgb, 1 - stormShade);

    return mixColor(FALLBACK_COLORS.transparent, rgb, airAlpha);
  }

  function sample(...args) {
    const p = parseInput(...args);
    const sources = readSourcePackets(args, p);
    const packet = normalizePacket(sources, p);

    const humidity = clamp01(packet.humidity);
    const pressure = clamp01(packet.airPressure);
    const barometricPressure = clamp01(packet.barometricPressure);
    const barometricGradient = clamp01(packet.barometricGradient);
    const cloudPotential = clamp01(packet.cloudPotential);
    const mistPotential = clamp01(packet.mistPotential);
    const stormPressure = clamp01(packet.stormPressure);
    const atmosphereSeparation = clamp01(packet.atmosphereSeparation);
    const rimHaze = clamp01(packet.rimHaze);
    const limbAtmosphere = clamp01(packet.limbAtmosphere);

    const airFloat = clamp01(
      atmosphereSeparation * 0.34 +
        cloudPotential * 0.18 +
        mistPotential * 0.14 +
        rimHaze * 0.12 +
        limbAtmosphere * 0.12 +
        stormPressure * 0.10
    );

    const pressureEnvelope = clamp01(
      pressure * 0.30 +
        barometricPressure * 0.28 +
        barometricGradient * 0.18 +
        stormPressure * 0.14 +
        humidity * 0.10
    );

    const humidityEnvelope = clamp01(
      humidity * 0.42 +
        mistPotential * 0.20 +
        cloudPotential * 0.16 +
        packet.waterFillStrength * 0.10 +
        packet.oceanPresence * 0.08 +
        packet.nearSeaLevelStrength * 0.04
    );

    const cloudEnvelope = clamp01(
      cloudPotential * 0.38 +
        mistPotential * 0.18 +
        stormPressure * 0.18 +
        barometricGradient * 0.14 +
        packet.stormCoastInfluence * 0.08 +
        packet.monsoonInfluence * 0.04
    );

    const bodyDetachment = clamp01(
      airFloat * 0.42 +
        atmosphereSeparation * 0.22 +
        cloudEnvelope * 0.14 +
        rimHaze * 0.12 +
        limbAtmosphere * 0.10
    );

    const landWaterRejection = clamp01(
      bodyDetachment * 0.36 +
        pressureEnvelope * 0.18 +
        humidityEnvelope * 0.16 +
        cloudEnvelope * 0.16 +
        atmosphereSeparation * 0.14
    );

    const airAlpha = clamp01(
      atmosphereSeparation * 0.18 +
        humidityEnvelope * 0.16 +
        cloudEnvelope * 0.16 +
        rimHaze * 0.12 +
        limbAtmosphere * 0.12 +
        stormPressure * 0.10 +
        mistPotential * 0.08
    );

    const airClass = airClassFor(packet);
    const rgb = computeAirColor(packet, airClass, airAlpha);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "air-pressure-humidity-channel",

      x: p.x,
      y: p.y,
      z: p.z,
      u: p.u,
      v: p.v,
      lon: p.lon,
      lat: p.lat,

      sourceContract: packet.contract,
      sourceReceipt: packet.receipt,

      channel: "air",
      channelClass: airClass,
      airClass,
      isLandChannel: false,
      isWaterChannel: false,
      isAirChannel: true,

      airPresence: airAlpha,
      airAlpha,
      atmosphereSeparation,
      humidity,
      airPressure: pressure,
      barometricPressure,
      barometricGradient,
      cloudPotential,
      mistPotential,
      stormPressure,
      rimHaze,
      limbAtmosphere,

      temperature: packet.temperature,
      moisture: packet.moisture,
      elevation: packet.elevation,
      isLand: packet.isLand,
      isWater: packet.isWater,

      stormCoastInfluence: packet.stormCoastInfluence,
      monsoonInfluence: packet.monsoonInfluence,
      rainforestInfluence: packet.rainforestInfluence,
      maritimeInfluence: packet.maritimeInfluence,
      alpineInfluence: packet.alpineInfluence,
      basinPotential: packet.basinPotential,
      coastPotential: packet.coastPotential,

      pressureEnvelope,
      humidityEnvelope,
      cloudEnvelope,
      airFloat,
      bodyDetachment,
      landWaterRejection,

      bodyBound: false,
      surfaceBound: false,
      floatsAboveBody: true,
      allowedToFloat: true,
      mayDefineLand: false,
      mayDefineWater: false,

      rgb,
      color: rgb,
      alpha: airAlpha,
      debugColor: [170, 210, 235],

      ownsTectonicCause: false,
      ownsElevationGeneration: false,
      ownsCompositionClassification: false,
      ownsLand: false,
      ownsWater: false,
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

  const read = (...args) => sample(...args);

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "air-pressure-humidity-channel",
      status: "active",
      destinationFile: "/assets/hearth/hearth.air.channel.js",
      channel: "air",
      role: "floating-atmosphere-pressure-humidity-channel",
      purpose: "separate air, pressure, humidity, haze, mist, and cloud-like behavior from land and water before canvas multiplexing",
      consumes: [
        "climate packet when available",
        "material atmosphere fields when available",
        "hydrology and ocean moisture fields when available",
        "composition climate influence fields when available",
        "elevation packet for altitude pressure only",
        "fallback local packet only as fail-soft"
      ],
      exposedMethods: [
        "sample",
        "read",
        "getReceipt"
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
        "rgb",
        "alpha"
      ],
      renderLaw: [
        "air is the only channel allowed to float",
        "air may haze, soften, mist, and cloud",
        "air cannot define landmass",
        "air cannot define ocean boundary",
        "air cannot override body-bound land or surface-seated water"
      ],
      owns: [
        "air-channel-expression",
        "pressure-fields",
        "barometric-fields",
        "humidity-fields",
        "cloud-like-fields",
        "mist-fields",
        "rim-haze-fields",
        "air-channel-color-packet"
      ],
      doesNotOwn: [
        "tectonic-cause",
        "elevation-generation",
        "composition-classification",
        "land-authority",
        "water-authority",
        "material-palette-authority",
        "canvas-mounting",
        "route-orchestration",
        "runtime-motion",
        "controls",
        "final-visual-pass-claim"
      ],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,

    sample,
    read,
    getReceipt,

    channel: "air",
    authority: "air-pressure-humidity-channel",

    supportsAirPressureHumidity: true,
    supportsAtmosphericSeparation: true,
    supportsCanvasMultiplex: true,

    ownsTectonicCause: false,
    ownsElevationGeneration: false,
    ownsCompositionClassification: false,
    ownsLand: false,
    ownsWater: false,
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
  root.HEARTH.airChannel = api;

  root.HEARTH_AIR_CHANNEL = api;
  root.HearthAirChannel = api;
  root.HEARTH_AIR_CHANNEL_RECEIPT = getReceipt();
  root.HEARTH_AIR_CHANNEL_CONTRACT = CONTRACT;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthAirChannelLoaded = "true";
    root.document.documentElement.dataset.hearthAirChannelContract = CONTRACT;
    root.document.documentElement.dataset.hearthAirChannelReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthAirChannelAuthority = "air-pressure-humidity-channel";
    root.document.documentElement.dataset.hearthAirChannelAllowedToFloat = "true";
    root.document.documentElement.dataset.hearthAirChannelDefinesLand = "false";
    root.document.documentElement.dataset.hearthAirChannelDefinesWater = "false";
    root.document.documentElement.dataset.generatedImage = "false";
    root.document.documentElement.dataset.graphicBox = "false";
    root.document.documentElement.dataset.webgl = "false";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
