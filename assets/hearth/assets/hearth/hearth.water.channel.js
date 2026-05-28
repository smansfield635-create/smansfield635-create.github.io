// /assets/hearth/hearth.water.channel.js
// HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1
// Full-file replacement / new file.
// Water channel authority only.
// Purpose:
// - Own surface-seated hydrosphere / water channel expression.
// - Convert resolved hydrology, ocean, material, and composition packets into water-surface attachment fields.
// - Keep water seated on or below the planetary body instead of floating as atmosphere.
// - Expose a lightweight channel packet for canvas multiplexing.
// Does not own:
// - tectonic cause
// - elevation generation
// - composition classification
// - land authority
// - air / atmosphere authority
// - material palette authority
// - canvas mounting
// - route orchestration
// - runtime motion
// - controls
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";
  const RECEIPT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_RECEIPT_v1";
  const VERSION = "2026-05-28.hearth-water-hydrosphere-surface-channel-v1";
  const SEA_LEVEL = 0.0;
  const DEG = Math.PI / 180;

  const root = typeof window !== "undefined" ? window : globalThis;

  const FALLBACK_COLORS = Object.freeze({
    water: [8, 31, 76],
    deepWater: [3, 12, 34],
    shelf: [22, 69, 91],
    coast: [34, 82, 108],
    basin: [4, 15, 28],
    submerged: [18, 45, 66],
    scar: [30, 39, 42],
    foamMute: [88, 116, 124],
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

  function getMaterialsAuthority() {
    if (root.HEARTH && root.HEARTH.materials) return root.HEARTH.materials;
    if (root.HEARTH_MATERIALS) return root.HEARTH_MATERIALS;
    if (root.HearthMaterials) return root.HearthMaterials;
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
      Number.isFinite(Number(input.waterFillStrength)) ||
      Number.isFinite(Number(input.oceanPresence)) ||
      Number.isFinite(Number(input.oceanWeight)) ||
      Number.isFinite(Number(input.waterDepth)) ||
      Number.isFinite(Number(input.shallowShelfStrength)) ||
      Number.isFinite(Number(input.waterlineBoundaryStrength)) ||
      typeof input.waterDepthClass === "string"
    ) {
      return input;
    }

    if (input.hydrology && typeof input.hydrology === "object") return input.hydrology;
    if (input.ocean && typeof input.ocean === "object") return input.ocean;
    if (input.material && typeof input.material === "object") return input.material;
    if (input.composition && typeof input.composition === "object") return input.composition;
    if (input.elevationSample && typeof input.elevationSample === "object") return input.elevationSample;

    return null;
  }

  function fallbackPacket(p) {
    const coastBand = softBand(p.z, 0.18, 0.18);
    const waterDepth = clamp01(smoothstep(0.22, -0.32, p.z));
    const oceanPresence = clamp01(waterDepth * 0.64 + coastBand * 0.18);
    const isWater = oceanPresence > 0.36;

    return {
      contract: "HEARTH_WATER_CHANNEL_FALLBACK_PACKET",
      receipt: "HEARTH_WATER_CHANNEL_FALLBACK_PACKET_RECEIPT",
      x: p.x,
      y: p.y,
      z: p.z,
      u: p.u,
      v: p.v,
      lon: p.lon,
      lat: p.lat,

      elevation: isWater ? -0.28 : 0.12,
      seaLevel: SEA_LEVEL,
      isWater,
      isLand: !isWater,

      waterFill: isWater,
      waterFillStrength: oceanPresence,
      waterDepth,
      waterDepthClass: waterDepth > 0.62 ? "deep" : isWater ? "mid" : "dry",
      oceanPresence,
      oceanWeight: oceanPresence,
      oceanDepth: waterDepth,
      oceanContinuity: isWater ? 0.52 : 0,
      shallowShelf: coastBand > 0.34,
      shallowShelfStrength: coastBand,
      shelfGradient: coastBand,
      waterlineBoundary: coastBand > 0.42,
      waterlineBoundaryStrength: coastBand,
      nearSeaLevel: coastBand > 0.36,
      nearSeaLevelStrength: coastBand,
      belowSeaLevel: isWater,
      belowSeaLevelStrength: isWater ? oceanPresence : 0,

      coastPotential: coastBand,
      coastBoundaryMemory: coastBand,
      submergedBasin: false,
      submergedBasinStrength: 0,
      submergedScar: false,
      submergedScarStrength: 0,
      submergedBlock: false,
      submergedBlockStrength: 0,
      bayPotential: 0,
      inletPotential: 0,
      straitPotential: 0,
      archipelagoChannelPotential: 0,

      oceanRgb: isWater ? FALLBACK_COLORS.water.slice() : FALLBACK_COLORS.transparent.slice(),
      rgb: isWater ? FALLBACK_COLORS.water.slice() : FALLBACK_COLORS.transparent.slice(),
      alpha: isWater ? oceanPresence : 0
    };
  }

  function readSourcePackets(args, p) {
    const fallbackArg = { u: p.u, v: p.v, lon: p.lon, lat: p.lat, x: p.x, y: p.y, z: p.z };

    const direct = args.length === 1 ? packetFromDirectInput(args[0]) : null;

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

    const material = direct || callAuthority(
      getMaterialsAuthority(),
      ["sample", "read", "getMaterial", "materialAt", "getMaterialAt", "getSurfaceMaterial", "resolve", "resolveMaterial"],
      args,
      fallbackArg
    );

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

    return {
      hydrology: hydrology && typeof hydrology === "object" ? hydrology : null,
      ocean: ocean && typeof ocean === "object" ? ocean : null,
      material: material && typeof material === "object" ? material : null,
      composition: composition && typeof composition === "object" ? composition : null,
      elevation: elevation && typeof elevation === "object" ? elevation : null
    };
  }

  function normalizePacket(sources, p) {
    const fallback = fallbackPacket(p);
    const hydrology = sources.hydrology || {};
    const ocean = sources.ocean || {};
    const material = sources.material || {};
    const composition = sources.composition || {};
    const elevationPacket = sources.elevation || {};

    const elevation = Number.isFinite(Number(composition.elevation))
      ? Number(composition.elevation)
      : Number.isFinite(Number(elevationPacket.elevation))
        ? Number(elevationPacket.elevation)
        : Number.isFinite(Number(material.elevation))
          ? Number(material.elevation)
          : fallback.elevation;

    const isWater = boolField(
      hydrology,
      "waterFill",
      boolField(
        composition,
        "isWater",
        boolField(
          elevationPacket,
          "isWater",
          elevation <= SEA_LEVEL
        )
      )
    );

    const isLand = boolField(composition, "isLand", boolField(elevationPacket, "isLand", !isWater));

    const waterFillStrength = clamp01(
      numberField(hydrology, "waterFillStrength",
        numberField(material, "waterFillStrength",
          numberField(composition, "waterDepthPotential", isWater ? 0.48 : 0)
        )
      )
    );

    const waterDepth = clamp01(
      numberField(hydrology, "waterDepth",
        numberField(hydrology, "oceanDepth",
          numberField(ocean, "oceanDepthShade",
            numberField(material, "waterDepthShade",
              numberField(composition, "waterDepthPotential", elevation <= SEA_LEVEL ? clamp01(-elevation / 0.72) : 0)
            )
          )
        )
      )
    );

    const oceanPresence = clamp01(
      numberField(ocean, "oceanPresence",
        numberField(ocean, "oceanAlpha",
          numberField(material, "oceanPresence",
            Math.max(waterFillStrength, waterDepth * 0.72)
          )
        )
      )
    );

    const shallowShelfStrength = clamp01(
      numberField(hydrology, "shallowShelfStrength",
        numberField(hydrology, "shelfGradient",
          numberField(ocean, "shallowShelfBlueFeed",
            numberField(material, "shelfTransition",
              numberField(composition, "shelfPotential", 0)
            )
          )
        )
      )
    );

    const waterlineBoundaryStrength = clamp01(
      numberField(hydrology, "waterlineBoundaryStrength",
        numberField(hydrology, "nearSeaLevelStrength",
          numberField(ocean, "waterlineBlueContrastFeed",
            numberField(material, "shorelineGrounding",
              numberField(composition, "shorelineContact",
                numberField(composition, "coastPotential", 0)
              )
            )
          )
        )
      )
    );

    const submergedBasinStrength = clamp01(
      numberField(ocean, "submergedBasinBlueFeed",
        numberField(ocean, "submergedPortBasinBlueFeed",
          numberField(hydrology, "submergedBasinStrength",
            numberField(material, "harborScarBasin", 0)
          )
        )
      )
    );

    const submergedScarStrength = clamp01(
      numberField(hydrology, "submergedScarStrength",
        numberField(ocean, "submergedScarWaterMuteFeed",
          numberField(material, "coastalScarContinuity",
            numberField(composition, "scarPotential", 0)
          )
        )
      )
    );

    const submergedBlockStrength = clamp01(
      numberField(hydrology, "submergedBlockStrength",
        numberField(ocean, "submergedBlockWaterDepthFeed",
          numberField(material, "submergedWorksFeed", 0)
        )
      )
    );

    const coastPotential = clamp01(
      numberField(composition, "coastPotential",
        numberField(material, "coastPotential",
          waterlineBoundaryStrength
        )
      )
    );

    const coastBoundaryMemory = clamp01(
      numberField(composition, "coastBoundaryMemory",
        numberField(elevationPacket, "coastBoundaryMemory",
          Math.max(coastPotential, waterlineBoundaryStrength)
        )
      )
    );

    const bayPotential = clamp01(numberField(hydrology, "bayPotential", numberField(ocean, "bayPotential", 0)));
    const inletPotential = clamp01(numberField(hydrology, "inletPotential", numberField(ocean, "inletPotential", 0)));
    const straitPotential = clamp01(numberField(hydrology, "straitPotential", numberField(ocean, "straitPotential", 0)));
    const archipelagoChannelPotential = clamp01(
      numberField(hydrology, "archipelagoChannelPotential",
        numberField(composition, "archipelagoPotential", 0)
      )
    );

    const oceanRgb = colorField(
      ocean,
      ["oceanRgb", "oceanColor", "color", "rgb"],
      colorField(
        material,
        ["waterRgb", "rgb", "color", "baseColor", "finalColorHint"],
        waterDepth > 0.54 ? FALLBACK_COLORS.deepWater : FALLBACK_COLORS.water
      )
    );

    const waterDepthClass = stringField(
      hydrology,
      "waterDepthClass",
      waterDepth > 0.62 ? "deep" : waterDepth > 0.32 ? "mid" : isWater ? "shallow" : "dry"
    );

    return {
      contract:
        stringField(hydrology, "contract", "") ||
        stringField(ocean, "contract", "") ||
        stringField(material, "contract", "") ||
        stringField(composition, "contract", "") ||
        stringField(elevationPacket, "contract", fallback.contract),

      receipt:
        stringField(hydrology, "receipt", "") ||
        stringField(ocean, "receipt", "") ||
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
      seaLevel: Number.isFinite(Number(composition.seaLevel))
        ? Number(composition.seaLevel)
        : Number.isFinite(Number(elevationPacket.seaLevel))
          ? Number(elevationPacket.seaLevel)
          : SEA_LEVEL,

      isWater,
      isLand,

      waterFill: boolField(hydrology, "waterFill", waterFillStrength > 0.38),
      waterFillStrength,
      waterDepth,
      waterDepthClass,
      oceanPresence,
      oceanWeight: clamp01(
        numberField(material, "oceanWeight",
          numberField(ocean, "oceanWeight",
            Math.max(oceanPresence, waterFillStrength * 0.82, waterDepth * 0.62)
          )
        )
      ),
      oceanDepth: waterDepth,
      oceanContinuity: clamp01(numberField(hydrology, "oceanContinuity", oceanPresence * 0.72)),
      shallowShelf: boolField(hydrology, "shallowShelf", shallowShelfStrength > 0.32),
      shallowShelfStrength,
      shelfGradient: shallowShelfStrength,
      waterlineBoundary: boolField(hydrology, "waterlineBoundary", waterlineBoundaryStrength > 0.32),
      waterlineBoundaryStrength,
      nearSeaLevel: boolField(hydrology, "nearSeaLevel", waterlineBoundaryStrength > 0.30),
      nearSeaLevelStrength: waterlineBoundaryStrength,
      belowSeaLevel: boolField(hydrology, "belowSeaLevel", elevation <= SEA_LEVEL),
      belowSeaLevelStrength: clamp01(numberField(hydrology, "belowSeaLevelStrength", elevation <= SEA_LEVEL ? 0.58 : 0)),

      coastPotential,
      coastBoundaryMemory,

      submergedBasin: submergedBasinStrength > 0.34,
      submergedBasinStrength,
      submergedScar: submergedScarStrength > 0.32,
      submergedScarStrength,
      submergedBlock: submergedBlockStrength > 0.32,
      submergedBlockStrength,

      bayPotential,
      inletPotential,
      straitPotential,
      archipelagoChannelPotential,

      oceanTerrainSeparationFeed: clamp01(numberField(ocean, "oceanTerrainSeparationFeed", waterlineBoundaryStrength)),
      deepOceanBlueFeed: clamp01(numberField(ocean, "deepOceanBlueFeed", waterDepth > 0.62 ? waterDepth : 0)),
      openOceanBlueFeed: clamp01(numberField(ocean, "openOceanBlueFeed", oceanPresence)),
      shallowShelfBlueFeed: clamp01(numberField(ocean, "shallowShelfBlueFeed", shallowShelfStrength)),
      waterlineBlueContrastFeed: clamp01(numberField(ocean, "waterlineBlueContrastFeed", waterlineBoundaryStrength)),

      oceanRgb,
      rgb: oceanRgb,
      alpha: clamp01(numberField(ocean, "oceanAlpha", numberField(material, "alpha", Math.max(oceanPresence, waterFillStrength))))
    };
  }

  function waterClassFor(packet) {
    if (!packet.isWater && packet.waterFillStrength < 0.18 && packet.oceanPresence < 0.18) return "no-water";
    if (packet.submergedBasinStrength > 0.46) return "seated-submerged-basin";
    if (packet.submergedScarStrength > 0.42) return "seated-submerged-scar";
    if (packet.submergedBlockStrength > 0.40) return "seated-submerged-structure";
    if (packet.straitPotential > 0.42) return "seated-strait-channel";
    if (packet.inletPotential > 0.42) return "seated-inlet-water";
    if (packet.bayPotential > 0.42) return "seated-bay-water";
    if (packet.shallowShelfStrength > 0.44) return "seated-shallow-shelf";
    if (packet.waterlineBoundaryStrength > 0.42) return "seated-waterline-boundary";
    if (packet.waterDepthClass === "deep" || packet.waterDepth > 0.62) return "seated-deep-ocean";
    if (packet.oceanPresence > 0.48) return "seated-open-ocean";
    if (packet.waterFillStrength > 0.34) return "seated-surface-water";
    return "latent-water-channel";
  }

  function computeWaterColor(packet, waterClass, waterAlpha) {
    let rgb = packet.oceanRgb.slice();

    if (waterClass === "seated-deep-ocean") {
      rgb = mixColor(rgb, FALLBACK_COLORS.deepWater, 0.46);
    } else if (waterClass === "seated-open-ocean") {
      rgb = mixColor(rgb, FALLBACK_COLORS.water, 0.28);
    } else if (waterClass === "seated-shallow-shelf") {
      rgb = mixColor(rgb, FALLBACK_COLORS.shelf, 0.44);
    } else if (waterClass === "seated-waterline-boundary") {
      rgb = mixColor(rgb, FALLBACK_COLORS.coast, 0.32);
    } else if (waterClass === "seated-submerged-basin") {
      rgb = mixColor(rgb, FALLBACK_COLORS.basin, 0.42);
    } else if (waterClass === "seated-submerged-scar") {
      rgb = mixColor(rgb, FALLBACK_COLORS.scar, 0.30);
    } else if (waterClass === "seated-submerged-structure") {
      rgb = mixColor(rgb, FALLBACK_COLORS.submerged, 0.34);
    } else if (
      waterClass === "seated-bay-water" ||
      waterClass === "seated-inlet-water" ||
      waterClass === "seated-strait-channel"
    ) {
      rgb = mixColor(rgb, FALLBACK_COLORS.coast, 0.22);
      rgb = mixColor(rgb, FALLBACK_COLORS.basin, 0.16);
    }

    const depthShade = clamp01(packet.waterDepth * 0.16 + packet.submergedBasinStrength * 0.12);
    rgb = scaleColor(rgb, 1 - depthShade);

    const shelfLift = clamp01(packet.shallowShelfStrength * 0.12 + packet.waterlineBoundaryStrength * 0.08);
    rgb = mixColor(rgb, FALLBACK_COLORS.shelf, shelfLift);

    return mixColor(FALLBACK_COLORS.transparent, rgb, waterAlpha);
  }

  function sample(...args) {
    const p = parseInput(...args);
    const sources = readSourcePackets(args, p);
    const packet = normalizePacket(sources, p);

    const belowSeaSeat = smoothstep(0.10, -0.08, packet.elevation);
    const waterFill = clamp01(packet.waterFillStrength);
    const oceanWeight = clamp01(packet.oceanWeight);
    const oceanPresence = clamp01(packet.oceanPresence);
    const shelfSeat = clamp01(packet.shallowShelfStrength);
    const waterlineSeat = clamp01(packet.waterlineBoundaryStrength);
    const depthSeat = clamp01(packet.waterDepth);

    const surfaceSeat = clamp01(
      belowSeaSeat * 0.26 +
        waterFill * 0.22 +
        oceanPresence * 0.18 +
        shelfSeat * 0.14 +
        waterlineSeat * 0.12 +
        packet.coastBoundaryMemory * 0.08
    );

    const hydrosphereBinding = clamp01(
      surfaceSeat * 0.34 +
        oceanWeight * 0.22 +
        depthSeat * 0.16 +
        packet.oceanContinuity * 0.12 +
        shelfSeat * 0.10 +
        waterlineSeat * 0.06
    );

    const depthBinding = clamp01(
      depthSeat * 0.38 +
        packet.deepOceanBlueFeed * 0.18 +
        packet.submergedBasinStrength * 0.18 +
        packet.submergedBlockStrength * 0.10 +
        packet.belowSeaLevelStrength * 0.16
    );

    const coastalBinding = clamp01(
      waterlineSeat * 0.34 +
        shelfSeat * 0.22 +
        packet.coastPotential * 0.16 +
        packet.coastBoundaryMemory * 0.16 +
        packet.bayPotential * 0.06 +
        packet.inletPotential * 0.06
    );

    const submergedBinding = clamp01(
      packet.submergedBasinStrength * 0.28 +
        packet.submergedScarStrength * 0.24 +
        packet.submergedBlockStrength * 0.20 +
        packet.archipelagoChannelPotential * 0.12 +
        depthBinding * 0.16
    );

    const atmosphericRejection = clamp01(
      hydrosphereBinding * 0.38 +
        surfaceSeat * 0.28 +
        depthBinding * 0.18 +
        coastalBinding * 0.16
    );

    const waterAlpha = clamp01(
      packet.isWater ? 0.26 : 0 +
        waterFill * 0.22 +
        oceanPresence * 0.20 +
        oceanWeight * 0.14 +
        shelfSeat * 0.08 +
        waterlineSeat * 0.06 +
        submergedBinding * 0.04
    );

    const waterClass = waterClassFor(packet);
    const rgb = computeWaterColor(packet, waterClass, waterAlpha);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "water-hydrosphere-surface-channel",

      x: p.x,
      y: p.y,
      z: p.z,
      u: p.u,
      v: p.v,
      lon: p.lon,
      lat: p.lat,

      sourceContract: packet.contract,
      sourceReceipt: packet.receipt,

      channel: "water",
      channelClass: waterClass,
      waterClass,
      isLandChannel: false,
      isWaterChannel: true,
      isAirChannel: false,

      waterPresence: waterAlpha,
      waterAlpha,
      waterFill: packet.waterFill,
      waterFillStrength: packet.waterFillStrength,
      waterDepth: packet.waterDepth,
      waterDepthClass: packet.waterDepthClass,
      oceanWeight: packet.oceanWeight,
      oceanPresence: packet.oceanPresence,
      oceanDepth: packet.oceanDepth,
      oceanContinuity: packet.oceanContinuity,

      isWater: packet.isWater,
      isLand: packet.isLand,
      elevation: packet.elevation,
      seaLevel: packet.seaLevel,

      shallowShelf: packet.shallowShelf,
      shallowShelfStrength: packet.shallowShelfStrength,
      shelfGradient: packet.shelfGradient,
      waterlineBoundary: packet.waterlineBoundary,
      waterlineBoundaryStrength: packet.waterlineBoundaryStrength,
      nearSeaLevel: packet.nearSeaLevel,
      nearSeaLevelStrength: packet.nearSeaLevelStrength,
      belowSeaLevel: packet.belowSeaLevel,
      belowSeaLevelStrength: packet.belowSeaLevelStrength,

      coastPotential: packet.coastPotential,
      coastBoundaryMemory: packet.coastBoundaryMemory,

      submergedBasin: packet.submergedBasin,
      submergedBasinStrength: packet.submergedBasinStrength,
      submergedScar: packet.submergedScar,
      submergedScarStrength: packet.submergedScarStrength,
      submergedBlock: packet.submergedBlock,
      submergedBlockStrength: packet.submergedBlockStrength,

      bayPotential: packet.bayPotential,
      inletPotential: packet.inletPotential,
      straitPotential: packet.straitPotential,
      archipelagoChannelPotential: packet.archipelagoChannelPotential,

      surfaceSeat,
      hydrosphereBinding,
      depthBinding,
      coastalBinding,
      submergedBinding,
      bodyBound: hydrosphereBinding > 0.38,
      surfaceBound: surfaceSeat > 0.34,
      atmosphericRejection,
      floatsAboveBody: false,
      allowedToFloat: false,

      rgb,
      color: rgb,
      alpha: waterAlpha,
      debugColor: [24, 122, 190],

      deepOceanBlueFeed: packet.deepOceanBlueFeed,
      openOceanBlueFeed: packet.openOceanBlueFeed,
      shallowShelfBlueFeed: packet.shallowShelfBlueFeed,
      waterlineBlueContrastFeed: packet.waterlineBlueContrastFeed,
      oceanTerrainSeparationFeed: packet.oceanTerrainSeparationFeed,

      ownsTectonicCause: false,
      ownsElevationGeneration: false,
      ownsCompositionClassification: false,
      ownsLand: false,
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
      authority: "water-hydrosphere-surface-channel",
      status: "active",
      destinationFile: "/assets/hearth/hearth.water.channel.js",
      channel: "water",
      role: "surface-seated-hydrosphere-channel",
      purpose: "seat ocean, shelf, coast, submerged scars, basins, inlets, bays, and straits to the planet body before canvas multiplexing",
      consumes: [
        "hydrology packet when available",
        "ocean packet when available",
        "material packet when available",
        "composition packet when hydrology/ocean/material unavailable",
        "elevation packet when composition unavailable",
        "fallback local packet only as fail-soft"
      ],
      exposedMethods: [
        "sample",
        "read",
        "getReceipt"
      ],
      exposedFields: [
        "waterPresence",
        "waterAlpha",
        "waterFill",
        "waterFillStrength",
        "waterDepth",
        "waterDepthClass",
        "oceanWeight",
        "oceanPresence",
        "oceanDepth",
        "oceanContinuity",
        "shallowShelf",
        "shallowShelfStrength",
        "shelfGradient",
        "waterlineBoundary",
        "waterlineBoundaryStrength",
        "coastPotential",
        "coastBoundaryMemory",
        "submergedBasin",
        "submergedBasinStrength",
        "submergedScar",
        "submergedScarStrength",
        "bayPotential",
        "inletPotential",
        "straitPotential",
        "surfaceSeat",
        "hydrosphereBinding",
        "depthBinding",
        "coastalBinding",
        "submergedBinding",
        "atmosphericRejection",
        "rgb",
        "alpha"
      ],
      renderLaw: [
        "water is surface-seated",
        "water may sit on or below surface",
        "water cannot float as atmosphere",
        "water cannot define land",
        "water cannot define air",
        "if water reads as haze it is failing channel law"
      ],
      owns: [
        "water-channel-expression",
        "hydrosphere-binding-fields",
        "surface-water-seating-fields",
        "ocean-depth-fields",
        "coastal-waterline-fields",
        "submerged-water-fields",
        "water-channel-color-packet"
      ],
      doesNotOwn: [
        "tectonic-cause",
        "elevation-generation",
        "composition-classification",
        "land-authority",
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

    channel: "water",
    authority: "water-hydrosphere-surface-channel",

    supportsWaterHydrosphereSurface: true,
    supportsSurfaceSeatedWater: true,
    supportsCanvasMultiplex: true,

    ownsTectonicCause: false,
    ownsElevationGeneration: false,
    ownsCompositionClassification: false,
    ownsLand: false,
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
  root.HEARTH.waterChannel = api;

  root.HEARTH_WATER_CHANNEL = api;
  root.HearthWaterChannel = api;
  root.HEARTH_WATER_CHANNEL_RECEIPT = getReceipt();
  root.HEARTH_WATER_CHANNEL_CONTRACT = CONTRACT;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthWaterChannelLoaded = "true";
    root.document.documentElement.dataset.hearthWaterChannelContract = CONTRACT;
    root.document.documentElement.dataset.hearthWaterChannelReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthWaterChannelAuthority = "water-hydrosphere-surface-channel";
    root.document.documentElement.dataset.hearthWaterChannelSurfaceSeated = "true";
    root.document.documentElement.dataset.hearthWaterChannelAllowedToFloat = "false";
    root.document.documentElement.dataset.generatedImage = "false";
    root.document.documentElement.dataset.graphicBox = "false";
    root.document.documentElement.dataset.webgl = "false";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
