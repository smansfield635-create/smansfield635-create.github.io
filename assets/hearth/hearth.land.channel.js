// /assets/hearth/hearth.land.channel.js
// HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1
// Full-file replacement / new file.
// Land channel authority only.
// Purpose:
// - Own body-bound crust / land channel expression.
// - Convert resolved upstream packets into land-surface attachment fields.
// - Keep land seated to the planetary body instead of floating as atmosphere.
// - Expose a lightweight channel packet for canvas multiplexing.
// Does not own:
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology classification
// - water authority
// - air / atmosphere authority
// - material palette authority
// - canvas mounting
// - route orchestration
// - runtime motion
// - controls
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1";
  const RECEIPT = "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_RECEIPT_v1";
  const VERSION = "2026-05-28.hearth-land-surface-attachment-channel-v1";
  const SEA_LEVEL = 0.0;
  const DEG = Math.PI / 180;

  const root = typeof window !== "undefined" ? window : globalThis;

  const FALLBACK_COLORS = Object.freeze({
    land: [84, 82, 56],
    raised: [108, 101, 66],
    stone: [62, 64, 58],
    ridge: [122, 113, 78],
    basin: [61, 70, 48],
    shadow: [24, 28, 23],
    muted: [42, 45, 36]
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

  function packetFromDirectInput(input) {
    if (!input || typeof input !== "object") return null;

    if (
      Number.isFinite(Number(input.elevation)) ||
      Number.isFinite(Number(input.massAnchor)) ||
      Number.isFinite(Number(input.surfaceAttachment)) ||
      Number.isFinite(Number(input.materialDensity)) ||
      typeof input.terrainClass === "string" ||
      typeof input.worldTerrainClass === "string"
    ) {
      return input;
    }

    if (input.composition && typeof input.composition === "object") {
      return input.composition;
    }

    if (input.material && typeof input.material === "object") {
      return input.material;
    }

    if (input.elevationSample && typeof input.elevationSample === "object") {
      return input.elevationSample;
    }

    return null;
  }

  function fallbackPacket(p) {
    const latitudeCold = clamp01(Math.abs(p.lat) / 90);
    const equatorWarm = clamp01(1 - latitudeCold);
    const roughMass = clamp01(0.42 + Math.sin((p.lon + 45) * DEG) * 0.14 + Math.cos(p.lat * DEG * 2) * 0.10);
    const elevation = -0.18 + roughMass * 0.44 - latitudeCold * 0.08;
    const isLand = elevation > SEA_LEVEL;

    return {
      contract: "HEARTH_LAND_CHANNEL_FALLBACK_PACKET",
      receipt: "HEARTH_LAND_CHANNEL_FALLBACK_PACKET_RECEIPT",
      x: p.x,
      y: p.y,
      z: p.z,
      u: p.u,
      v: p.v,
      lon: p.lon,
      lat: p.lat,
      elevation,
      seaLevel: SEA_LEVEL,
      isLand,
      isWater: !isLand,
      terrainClass: isLand ? "raised_shield" : "deep_water",
      worldTerrainClass: isLand ? "raised_land" : "deep_ocean",
      landPotential: isLand ? clamp01(0.52 + roughMass * 0.30) : clamp01(roughMass * 0.22),
      massAnchor: isLand ? clamp01(0.44 + roughMass * 0.34) : 0,
      surfaceAttachment: isLand ? 0.66 : 0.18,
      materialDensity: isLand ? clamp01(0.46 + roughMass * 0.26) : 0.08,
      reliefStrength: isLand ? clamp01(0.24 + equatorWarm * 0.18) : 0.02,
      curvatureLock: isLand ? 0.72 : 0.28,
      contactOcclusion: isLand ? 0.28 : 0.06,
      underlandShadow: isLand ? 0.20 : 0.02,
      terrainRelief: isLand ? 0.30 : 0,
      ridgeRelief: isLand ? 0.18 : 0,
      plateauPotential: isLand ? 0.22 : 0,
      basinPotential: isLand ? 0.14 : 0,
      canyonPotential: 0,
      escarpmentPotential: 0,
      rgb: isLand ? FALLBACK_COLORS.land.slice() : FALLBACK_COLORS.muted.slice(),
      alpha: isLand ? 1 : 0
    };
  }

  function readUpstream(...args) {
    const p = parseInput(...args);
    const direct = args.length === 1 ? packetFromDirectInput(args[0]) : null;

    if (direct) {
      return normalizeUpstreamPacket(direct, p);
    }

    const composition = callAuthority(
      getCompositionAuthority(),
      ["sample", "read", "compose", "sampleComposition", "readComposition"],
      args,
      { u: p.u, v: p.v, lon: p.lon, lat: p.lat, x: p.x, y: p.y, z: p.z }
    );

    if (composition) {
      return normalizeUpstreamPacket(composition, p);
    }

    const material = callAuthority(
      getMaterialsAuthority(),
      ["sample", "read", "getMaterial", "materialAt", "getMaterialAt", "getSurfaceMaterial", "resolve", "resolveMaterial"],
      args,
      { u: p.u, v: p.v, lon: p.lon, lat: p.lat, x: p.x, y: p.y, z: p.z }
    );

    if (material) {
      return normalizeUpstreamPacket(material, p);
    }

    const elevation = callAuthority(
      getElevationAuthority(),
      ["sample", "read", "getElevation", "sampleElevation", "readElevation"],
      args,
      { u: p.u, v: p.v, lon: p.lon, lat: p.lat, x: p.x, y: p.y, z: p.z }
    );

    if (elevation) {
      return normalizeUpstreamPacket(elevation, p);
    }

    return normalizeUpstreamPacket(fallbackPacket(p), p);
  }

  function normalizeUpstreamPacket(raw, p) {
    const source = raw && typeof raw === "object" ? raw : fallbackPacket(p);
    const elevation = Number.isFinite(Number(source.elevation)) ? Number(source.elevation) : -0.48;
    const isLand = boolField(source, "isLand", elevation > SEA_LEVEL);
    const terrainClass = stringField(
      source,
      "worldTerrainClass",
      stringField(source, "terrainClass", elevation > SEA_LEVEL ? "continent_mass" : "deep_water")
    );

    const baseRgb = colorField(
      source,
      ["landRgb", "rgb", "color", "baseColor", "finalColorHint"],
      isLand ? FALLBACK_COLORS.land : FALLBACK_COLORS.muted
    );

    return {
      contract: stringField(source, "contract", "UNKNOWN_UPSTREAM_CONTRACT"),
      receipt: stringField(source, "receipt", "UNKNOWN_UPSTREAM_RECEIPT"),
      x: Number.isFinite(Number(source.x)) ? Number(source.x) : p.x,
      y: Number.isFinite(Number(source.y)) ? Number(source.y) : p.y,
      z: Number.isFinite(Number(source.z)) ? Number(source.z) : p.z,
      u: Number.isFinite(Number(source.u)) ? wrap01(source.u) : p.u,
      v: Number.isFinite(Number(source.v)) ? clamp(Number(source.v), 0, 1) : p.v,
      lon: Number.isFinite(Number(source.lon)) ? Number(source.lon) : p.lon,
      lat: Number.isFinite(Number(source.lat)) ? Number(source.lat) : p.lat,

      elevation,
      seaLevel: Number.isFinite(Number(source.seaLevel)) ? Number(source.seaLevel) : SEA_LEVEL,
      isLand,
      isWater: boolField(source, "isWater", !isLand),
      terrainClass,
      compatibilityTerrainClass: stringField(source, "compatibilityTerrainClass", ""),
      continentId: stringField(source, "continentId", ""),
      continentClass: stringField(source, "continentClass", ""),
      dominantCoreId: stringField(source, "dominantCoreId", ""),

      landPotential: clamp01(numberField(source, "landPotential", isLand ? 0.62 : 0)),
      massAnchor: clamp01(numberField(source, "massAnchor", isLand ? 0.56 : 0)),
      surfaceAttachment: clamp01(numberField(source, "surfaceAttachment", isLand ? 0.62 : 0)),
      materialDensity: clamp01(numberField(source, "materialDensity", isLand ? 0.52 : 0)),
      reliefStrength: clamp01(numberField(source, "reliefStrength", numberField(source, "terrainRelief", 0))),
      curvatureLock: clamp01(numberField(source, "curvatureLock", isLand ? 0.68 : 0)),
      contactOcclusion: clamp01(numberField(source, "contactOcclusion", numberField(source, "contactShadow", 0))),
      underlandShadow: clamp01(numberField(source, "underlandShadow", numberField(source, "underlandOcclusion", 0))),
      terrainRelief: clamp01(numberField(source, "terrainRelief", numberField(source, "reliefStrength", 0))),
      ridgeRelief: clamp01(numberField(source, "ridgeRelief", numberField(source, "ridgePotential", 0))),
      plateauPotential: clamp01(numberField(source, "plateauPotential", 0)),
      basinPotential: clamp01(numberField(source, "basinPotential", 0)),
      canyonPotential: clamp01(numberField(source, "canyonPotential", 0)),
      escarpmentPotential: clamp01(numberField(source, "escarpmentPotential", 0)),
      mountainArcPotential: clamp01(numberField(source, "mountainArcPotential", 0)),
      ridgePotential: clamp01(numberField(source, "ridgePotential", 0)),
      cliffCandidate: clamp01(numberField(source, "cliffCandidate", 0)),
      valleyCandidate: clamp01(numberField(source, "valleyCandidate", 0)),
      mountainCandidate: clamp01(numberField(source, "mountainCandidate", 0)),
      coastPotential: clamp01(numberField(source, "coastPotential", 0)),
      shorelineContact: clamp01(numberField(source, "shorelineContact", 0)),
      alpha: clamp01(numberField(source, "alpha", 1)),
      rgb: baseRgb,
      color: baseRgb
    };
  }

  function landClassFor(packet) {
    if (!packet.isLand && packet.landPotential < 0.18) return "no-land";
    if (packet.elevation <= SEA_LEVEL && packet.landPotential < 0.36) return "submerged-land-memory";
    if (packet.mountainArcPotential > 0.54 || packet.mountainCandidate > 0.5) return "body-bound-mountain";
    if (packet.escarpmentPotential > 0.48 || packet.cliffCandidate > 0.5) return "body-bound-escarpment";
    if (packet.canyonPotential > 0.46) return "body-bound-canyon";
    if (packet.plateauPotential > 0.46) return "body-bound-plateau";
    if (packet.basinPotential > 0.44 || packet.valleyCandidate > 0.5) return "body-bound-basin";
    if (packet.coastPotential > 0.52 || packet.shorelineContact > 0.46) return "body-bound-coastal-land";
    if (packet.surfaceAttachment > 0.62 && packet.massAnchor > 0.48) return "body-bound-crust";
    return packet.isLand ? "body-bound-land" : "latent-land-channel";
  }

  function computeLandColor(packet, landClass, landAlpha) {
    let rgb = packet.rgb.slice();

    if (!packet.isLand && landAlpha < 0.24) {
      return mixColor(FALLBACK_COLORS.muted, FALLBACK_COLORS.shadow, 0.22);
    }

    if (landClass === "body-bound-mountain") {
      rgb = mixColor(rgb, FALLBACK_COLORS.ridge, 0.38);
      rgb = mixColor(rgb, FALLBACK_COLORS.stone, packet.ridgeRelief * 0.24);
    } else if (landClass === "body-bound-escarpment") {
      rgb = mixColor(rgb, FALLBACK_COLORS.stone, 0.34);
      rgb = mixColor(rgb, FALLBACK_COLORS.shadow, packet.contactOcclusion * 0.18);
    } else if (landClass === "body-bound-canyon") {
      rgb = mixColor(rgb, FALLBACK_COLORS.shadow, 0.22);
      rgb = mixColor(rgb, FALLBACK_COLORS.basin, packet.basinPotential * 0.20);
    } else if (landClass === "body-bound-plateau") {
      rgb = mixColor(rgb, FALLBACK_COLORS.raised, 0.30);
    } else if (landClass === "body-bound-basin") {
      rgb = mixColor(rgb, FALLBACK_COLORS.basin, 0.32);
    } else if (landClass === "body-bound-coastal-land") {
      rgb = mixColor(rgb, FALLBACK_COLORS.stone, 0.16);
    }

    const shadow = clamp01(packet.underlandShadow * 0.18 + packet.contactOcclusion * 0.14);
    rgb = scaleColor(rgb, 1 - shadow);

    const reliefLift = clamp01(packet.reliefStrength * 0.08 + packet.terrainRelief * 0.06);
    rgb = mixColor(rgb, FALLBACK_COLORS.raised, reliefLift);

    return mixColor(FALLBACK_COLORS.muted, rgb, landAlpha);
  }

  function sample(...args) {
    const p = parseInput(...args);
    const packet = readUpstream(...args);

    const elevationLand = smoothstep(-0.08, 0.16, packet.elevation);
    const explicitLand = packet.isLand ? 1 : 0;
    const landPotential = clamp01(packet.landPotential);

    const surfaceAttachment = clamp01(
      packet.surfaceAttachment * 0.42 +
        packet.massAnchor * 0.22 +
        packet.curvatureLock * 0.16 +
        packet.materialDensity * 0.14 +
        elevationLand * 0.06
    );

    const bodyBinding = clamp01(
      surfaceAttachment * 0.38 +
        packet.curvatureLock * 0.20 +
        packet.massAnchor * 0.18 +
        packet.contactOcclusion * 0.10 +
        packet.underlandShadow * 0.08 +
        explicitLand * 0.06
    );

    const crustDensity = clamp01(
      packet.materialDensity * 0.38 +
        packet.massAnchor * 0.24 +
        packet.reliefStrength * 0.14 +
        packet.terrainRelief * 0.10 +
        landPotential * 0.14
    );

    const reliefBinding = clamp01(
      packet.reliefStrength * 0.28 +
        packet.terrainRelief * 0.20 +
        packet.ridgeRelief * 0.18 +
        packet.plateauPotential * 0.12 +
        packet.canyonPotential * 0.10 +
        packet.escarpmentPotential * 0.12
    );

    const atmosphericRejection = clamp01(
      bodyBinding * 0.36 +
        surfaceAttachment * 0.30 +
        crustDensity * 0.20 +
        packet.curvatureLock * 0.14
    );

    const landAlpha = clamp01(
      explicitLand * 0.42 +
        elevationLand * 0.22 +
        landPotential * 0.18 +
        bodyBinding * 0.14 +
        crustDensity * 0.04
    );

    const landClass = landClassFor(packet);
    const rgb = computeLandColor(packet, landClass, landAlpha);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "land-surface-attachment-channel",

      x: p.x,
      y: p.y,
      z: p.z,
      u: p.u,
      v: p.v,
      lon: p.lon,
      lat: p.lat,

      sourceContract: packet.contract,
      sourceReceipt: packet.receipt,

      channel: "land",
      channelClass: landClass,
      landClass,
      isLandChannel: true,
      isWaterChannel: false,
      isAirChannel: false,

      landPresence: landAlpha,
      landAlpha,
      landPotential,
      isLand: packet.isLand,
      elevation: packet.elevation,
      seaLevel: packet.seaLevel,

      massAnchor: packet.massAnchor,
      surfaceAttachment,
      materialDensity: packet.materialDensity,
      crustDensity,
      reliefStrength: packet.reliefStrength,
      reliefBinding,
      curvatureLock: packet.curvatureLock,
      contactOcclusion: packet.contactOcclusion,
      underlandShadow: packet.underlandShadow,
      terrainRelief: packet.terrainRelief,
      ridgeRelief: packet.ridgeRelief,
      plateauPotential: packet.plateauPotential,
      basinPotential: packet.basinPotential,
      canyonPotential: packet.canyonPotential,
      escarpmentPotential: packet.escarpmentPotential,
      mountainArcPotential: packet.mountainArcPotential,
      ridgePotential: packet.ridgePotential,

      shorelineContact: packet.shorelineContact,
      coastPotential: packet.coastPotential,

      bodyBinding,
      bodyBound: bodyBinding > 0.44,
      surfaceBound: surfaceAttachment > 0.46,
      atmosphericRejection,
      floatsAboveBody: false,
      allowedToFloat: false,

      rgb,
      color: rgb,
      alpha: landAlpha,
      debugColor: [160, 126, 64],

      terrainClass: packet.terrainClass,
      compatibilityTerrainClass: packet.compatibilityTerrainClass,
      continentId: packet.continentId,
      continentClass: packet.continentClass,
      dominantCoreId: packet.dominantCoreId,

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
  }

  const read = (...args) => sample(...args);

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "land-surface-attachment-channel",
      status: "active",
      destinationFile: "/assets/hearth/hearth.land.channel.js",
      channel: "land",
      role: "body-bound-crust-surface-channel",
      purpose: "seat land and crust expression to the planet body before canvas multiplexing",
      consumes: [
        "composition packet when available",
        "material packet when composition unavailable",
        "elevation packet when composition/material unavailable",
        "fallback local packet only as fail-soft"
      ],
      exposedMethods: [
        "sample",
        "read",
        "getReceipt"
      ],
      exposedFields: [
        "landPresence",
        "landAlpha",
        "landPotential",
        "landClass",
        "massAnchor",
        "surfaceAttachment",
        "materialDensity",
        "crustDensity",
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
        "bodyBinding",
        "bodyBound",
        "surfaceBound",
        "atmosphericRejection",
        "rgb",
        "alpha"
      ],
      renderLaw: [
        "land is body-bound",
        "land cannot float",
        "land cannot define water",
        "land cannot define air",
        "if land reads as cloud it is failing channel law"
      ],
      owns: [
        "land-channel-expression",
        "surface-attachment-fields",
        "crust-density-fields",
        "body-binding-fields",
        "land-channel-color-packet"
      ],
      doesNotOwn: [
        "tectonic-cause",
        "elevation-generation",
        "composition-classification",
        "hydrology-classification",
        "water-authority",
        "air-authority",
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

    channel: "land",
    authority: "land-surface-attachment-channel",

    supportsLandSurfaceAttachment: true,
    supportsBodyBoundCrust: true,
    supportsCanvasMultiplex: true,

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

  root.HEARTH_LAND_CHANNEL = api;
  root.HearthLandChannel = api;
  root.HEARTH_LAND_CHANNEL_RECEIPT = getReceipt();
  root.HEARTH_LAND_CHANNEL_CONTRACT = CONTRACT;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthLandChannelLoaded = "true";
    root.document.documentElement.dataset.hearthLandChannelContract = CONTRACT;
    root.document.documentElement.dataset.hearthLandChannelReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthLandChannelAuthority = "land-surface-attachment-channel";
    root.document.documentElement.dataset.hearthLandChannelBodyBound = "true";
    root.document.documentElement.dataset.hearthLandChannelAllowedToFloat = "false";
    root.document.documentElement.dataset.generatedImage = "false";
    root.document.documentElement.dataset.graphicBox = "false";
    root.document.documentElement.dataset.webgl = "false";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
