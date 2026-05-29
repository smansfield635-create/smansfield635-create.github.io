// /assets/hearth/hearth.water.channel.js
// HEARTH_WATER_CHILD_HYDRO_RECEIVER_BIRTH_TNT_v1
// Full-file replacement.
// Birth contract for the missing Hearth Water Child.
// Exports the expected runtime/canvas contract:
// HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1
// Purpose:
// - Birth HEARTH_WATER_CHANNEL as a first-standing hydro receiver.
// - Receive Hearth hydro-related upstream packets when available.
// - Fall back locally when upstream hydro files are absent.
// - Always expose a Runtime Table-readable, body-bound, surface/depth-seated water-channel packet.
// - Prevent C6_GLOBAL_ACTOR_MISSING, C8_SAMPLE_API_FAILURE, C9_COORDINATE_PACKET_FAILURE,
//   and C10_WATER_AUTHORITY_FLAGS_FAILURE after this file is successfully served.
// Does not own:
// - hydrology generation
// - materials generation
// - composition classification
// - elevation generation
// - tectonic cause
// - land truth
// - air truth
// - canvas mounting
// - atlas projection
// - Runtime Table planning
// - route orchestration
// - runtime motion
// - controls
// - final visual pass claim

(() => {
  "use strict";

  const CHANNEL_CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";
  const BIRTH_CONTRACT = "HEARTH_WATER_CHILD_HYDRO_RECEIVER_BIRTH_TNT_v1";
  const RECEIPT = "HEARTH_WATER_CHILD_HYDRO_RECEIVER_BIRTH_RECEIPT_v1";
  const VERSION = "2026-05-29.hearth-water-child-hydro-receiver-birth-v1";
  const FALLBACK_CONTRACT = "HEARTH_WATER_CHILD_LOCAL_HYDRO_FALLBACK_v1";
  const FALLBACK_RECEIPT = "HEARTH_WATER_CHILD_LOCAL_HYDRO_FALLBACK_RECEIPT_v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;

  const SOURCE_ORDER = Object.freeze([
    "hydrology",
    "ocean",
    "waterline",
    "materials",
    "composition",
    "elevation"
  ]);

  const WATER_COLORS = Object.freeze({
    deep: [7, 64, 136],
    open: [10, 74, 145],
    shelf: [20, 92, 154],
    wet: [38, 104, 142],
    basin: [5, 48, 112],
    shadow: [2, 18, 62]
  });

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function isFunction(value) {
    return typeof value === "function";
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

  function normalize3(point) {
    const x = Number.isFinite(Number(point && point.x)) ? Number(point.x) : 0;
    const y = Number.isFinite(Number(point && point.y)) ? Number(point.y) : 0;
    const z = Number.isFinite(Number(point && point.z)) ? Number(point.z) : 1;
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

  function vectorToLonLat(point) {
    const p = normalize3(point);

    return {
      lon: Math.atan2(p.x, p.z) / DEG,
      lat: Math.asin(clamp(p.y, -1, 1)) / DEG
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
    let vector;
    let lon;
    let lat;
    let u;
    let v;

    if (args.length === 1 && isObject(args[0])) {
      const packet = args[0];

      if (Number.isFinite(Number(packet.u)) && Number.isFinite(Number(packet.v))) {
        u = wrap01(packet.u);
        v = clamp(packet.v, 0, 1);
        lon = uToLon(u);
        lat = vToLat(v);
        vector = lonLatToVector(lon, lat);
      } else if (Number.isFinite(Number(packet.lon)) && Number.isFinite(Number(packet.lat))) {
        lon = Number(packet.lon);
        lat = Number(packet.lat);
        u = lonToU(lon);
        v = latToV(lat);
        vector = lonLatToVector(lon, lat);
      } else if (Number.isFinite(Number(packet.longitude)) && Number.isFinite(Number(packet.latitude))) {
        lon = Number(packet.longitude);
        lat = Number(packet.latitude);
        u = lonToU(lon);
        v = latToV(lat);
        vector = lonLatToVector(lon, lat);
      } else if (
        Number.isFinite(Number(packet.x)) &&
        Number.isFinite(Number(packet.y)) &&
        Number.isFinite(Number(packet.z))
      ) {
        vector = normalize3(packet);
        const ll = vectorToLonLat(vector);
        lon = ll.lon;
        lat = ll.lat;
        u = lonToU(lon);
        v = latToV(lat);
      }
    } else if (args.length >= 3) {
      vector = normalize3({ x: args[0], y: args[1], z: args[2] });
      const ll = vectorToLonLat(vector);
      lon = ll.lon;
      lat = ll.lat;
      u = lonToU(lon);
      v = latToV(lat);
    } else if (args.length >= 2) {
      lon = Number(args[0]);
      lat = Number(args[1]);
      if (!Number.isFinite(lon)) lon = 0;
      if (!Number.isFinite(lat)) lat = 0;
      u = lonToU(lon);
      v = latToV(lat);
      vector = lonLatToVector(lon, lat);
    }

    if (!vector) {
      lon = 0;
      lat = 0;
      u = 0.5;
      v = 0.5;
      vector = lonLatToVector(lon, lat);
    }

    return {
      u,
      v,
      lon,
      lat,
      x: vector.x,
      y: vector.y,
      z: vector.z
    };
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return { ...value };
    }
  }

  function firstNumber(source, keys, fallback = 0) {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      const value = source[key];
      const n = Number(value);
      if (Number.isFinite(n)) return n;
    }

    return fallback;
  }

  function firstBool(source, keys, fallback = false) {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      if (typeof source[key] === "boolean") return source[key];
    }

    return fallback;
  }

  function firstString(source, keys, fallback = "") {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      if (typeof source[key] === "string" && source[key]) return source[key];
    }

    return fallback;
  }

  function firstColor(source, keys, fallback = null) {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      const value = source[key];

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

    return fallback;
  }

  function textHasWaterSignal(value) {
    const text = String(value || "").toLowerCase();

    return (
      text.includes("water") ||
      text.includes("ocean") ||
      text.includes("sea") ||
      text.includes("shelf") ||
      text.includes("shore") ||
      text.includes("coast") ||
      text.includes("basin") ||
      text.includes("submerged") ||
      text.includes("wet") ||
      text.includes("bay") ||
      text.includes("inlet")
    );
  }

  function getHearthRoot() {
    root.HEARTH = root.HEARTH || {};
    return root.HEARTH;
  }

  function getAuthorityCandidates() {
    const hearth = getHearthRoot();

    return [
      {
        key: "hydrology",
        authority:
          root.HEARTH_HYDROLOGY ||
          hearth.hydrology ||
          hearth.hydrologyAuthority ||
          null
      },
      {
        key: "ocean",
        authority:
          root.HEARTH_OCEAN ||
          hearth.ocean ||
          hearth.oceanAuthority ||
          null
      },
      {
        key: "waterline",
        authority:
          root.HEARTH_WATERLINE ||
          hearth.waterline ||
          hearth.waterlineAuthority ||
          null
      },
      {
        key: "materials",
        authority:
          root.HEARTH_MATERIALS ||
          hearth.materials ||
          hearth.materialsAuthority ||
          null
      },
      {
        key: "composition",
        authority:
          root.HEARTH_COMPOSITION ||
          hearth.composition ||
          hearth.compositionAuthority ||
          null
      },
      {
        key: "elevation",
        authority:
          root.HEARTH_ELEVATION ||
          hearth.elevation ||
          hearth.elevationAuthority ||
          null
      }
    ].filter((item) => isObject(item.authority));
  }

  function readAuthorityReceipt(authority) {
    if (!isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;

    return null;
  }

  function callAuthority(authority, input) {
    if (!isObject(authority)) return null;

    const methods = [
      "sample",
      "read",
      "getWaterSample",
      "sampleWater",
      "getHydroSample",
      "sampleHydrology",
      "resolve",
      "classify"
    ];

    const attempts = [
      [input],
      [input.lon, input.lat],
      [input.x, input.y, input.z],
      [input.u, input.v]
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      for (const args of attempts) {
        try {
          const packet = authority[method].apply(authority, args);
          if (isObject(packet)) return packet;
        } catch (_error) {}
      }
    }

    return null;
  }

  function collectSourcePackets(input) {
    const packets = [];

    getAuthorityCandidates().forEach((candidate) => {
      const sample = callAuthority(candidate.authority, input);
      const receipt = readAuthorityReceipt(candidate.authority);

      if (!sample && !receipt) return;

      packets.push({
        key: candidate.key,
        authority: candidate.authority,
        sample: isObject(sample) ? sample : {},
        receipt: isObject(receipt) ? receipt : {},
        contract:
          firstString(sample, ["contract", "sourceContract"], "") ||
          firstString(receipt, ["contract"], "") ||
          firstString(candidate.authority, ["contract"], ""),
        receiptName:
          firstString(sample, ["receipt", "sourceReceipt"], "") ||
          firstString(receipt, ["receipt"], "") ||
          firstString(candidate.authority, ["receipt"], "")
      });
    });

    packets.sort((a, b) => SOURCE_ORDER.indexOf(a.key) - SOURCE_ORDER.indexOf(b.key));
    return packets;
  }

  function localHydro(input) {
    const lon = input.lon;
    const lat = input.lat;

    const basinWave = Math.cos((lon * 1.32 - lat * 1.71 - 82) * DEG) * 0.5 + 0.5;
    const shelfWave = Math.sin((lon * 2.18 + lat * 0.41 + 33) * DEG) * 0.5 + 0.5;
    const scarWave = Math.sin((lon * 3.47 - lat * 2.13 + 121) * DEG) * 0.5 + 0.5;
    const blockWave = Math.cos((lon * 4.12 + lat * 1.77 - 17) * DEG) * 0.5 + 0.5;
    const polarPressure = clamp01((Math.abs(lat) - 56) / 34);

    const waterPotential = clamp01(
      0.52 +
        basinWave * 0.22 +
        shelfWave * 0.08 -
        scarWave * 0.06 -
        polarPressure * 0.11
    );

    const coastPotential = clamp01(1 - Math.abs(waterPotential - 0.52) * 3.2);
    const wetEdge = clamp01(coastPotential * 0.68 + shelfWave * 0.18);
    const basinInfluence = clamp01(basinWave * waterPotential);
    const submergedScarInfluence = clamp01(scarWave * waterPotential * 0.52);
    const submergedBlockInfluence = clamp01(blockWave * waterPotential * 0.44);
    const waterDepth = clamp01(0.18 + waterPotential * 0.62 + basinInfluence * 0.14 - wetEdge * 0.10);
    const waterAlpha = clamp01(0.26 + waterPotential * 0.48 + waterDepth * 0.12);

    let rgb = mixColor(WATER_COLORS.open, WATER_COLORS.deep, waterDepth);
    if (wetEdge > 0.52) rgb = mixColor(rgb, WATER_COLORS.shelf, wetEdge * 0.36);
    if (basinInfluence > 0.55) rgb = mixColor(rgb, WATER_COLORS.basin, basinInfluence * 0.18);

    return {
      sourceMode: "local-hydro-fallback",
      sourceContract: FALLBACK_CONTRACT,
      sourceReceipt: FALLBACK_RECEIPT,
      sourceAuthority: "water-child-local-deterministic-hydro-fallback",

      waterPotential,
      waterPresence: waterAlpha,
      waterAlpha,
      waterDepth,
      depthBinding: clamp01(0.72 + waterDepth * 0.22),
      hydrosphereBinding: clamp01(0.78 + waterDepth * 0.18),
      surfaceSeat: clamp01(0.78 + wetEdge * 0.12 + waterDepth * 0.08),
      shorelineContact: coastPotential,
      coastPotential,
      wetEdge,
      basinInfluence,
      submergedBlockInfluence,
      submergedScarInfluence,
      rgb,
      color: rgb,
      alpha: waterAlpha,
      channelClass: waterDepth > 0.68 ? "deep-ocean" : waterDepth > 0.44 ? "open-ocean" : "coastal-shelf-water",
      waterClass: waterDepth > 0.68 ? "deep-ocean" : waterDepth > 0.44 ? "open-ocean" : "coastal-shelf-water"
    };
  }

  function packetWaterSignal(packet) {
    if (!isObject(packet)) return 0;

    const isWater = firstBool(packet, ["isWater", "water", "ocean"], false);
    const isLand = firstBool(packet, ["isLand", "land"], false);
    const terrainClass = firstString(packet, [
      "waterClass",
      "channelClass",
      "terrainClass",
      "compatibilityTerrainClass",
      "materialClass",
      "hydrologyClass",
      "compositionClass"
    ], "");

    const classSignal = textHasWaterSignal(terrainClass) ? 0.74 : 0;
    const elevation = firstNumber(packet, ["elevation", "height", "altitude"], NaN);
    const seaLevel = firstNumber(packet, ["seaLevel", "waterline", "seaLevelValue"], 0);
    const belowSea = Number.isFinite(elevation) ? clamp01((seaLevel - elevation) * 4.8) : 0;

    const numericSignal = Math.max(
      firstNumber(packet, ["waterAlpha"], 0),
      firstNumber(packet, ["waterPresence"], 0),
      firstNumber(packet, ["waterPotential"], 0),
      firstNumber(packet, ["hydrologyWater"], 0),
      firstNumber(packet, ["materialWaterFeed"], 0),
      firstNumber(packet, ["materialShelfFeed"], 0),
      firstNumber(packet, ["materialWetStoneFeed"], 0),
      firstNumber(packet, ["materialWaterlineFeed"], 0),
      firstNumber(packet, ["oceanPresence"], 0),
      firstNumber(packet, ["oceanAlpha"], 0),
      firstNumber(packet, ["depthBinding"], 0),
      firstNumber(packet, ["shorelineContact"], 0) * 0.64,
      firstNumber(packet, ["coastPotential"], 0) * 0.54
    );

    let signal = Math.max(numericSignal, classSignal, belowSea);

    if (isWater) signal = Math.max(signal, 0.86);
    if (isLand && !isWater && !classSignal && !belowSea) signal = Math.min(signal, 0.12);

    return clamp01(signal);
  }

  function deriveHydroFromSources(input, sourcePackets) {
    const local = localHydro(input);

    if (!sourcePackets.length) {
      return local;
    }

    let waterSignal = local.waterAlpha * 0.72;
    let waterDepth = local.waterDepth;
    let depthBinding = local.depthBinding;
    let hydrosphereBinding = local.hydrosphereBinding;
    let surfaceSeat = local.surfaceSeat;
    let shorelineContact = local.shorelineContact;
    let coastPotential = local.coastPotential;
    let wetEdge = local.wetEdge;
    let basinInfluence = local.basinInfluence;
    let submergedBlockInfluence = local.submergedBlockInfluence;
    let submergedScarInfluence = local.submergedScarInfluence;
    let sourceRgb = null;

    sourcePackets.forEach((entry, index) => {
      const packet = entry.sample || {};
      const weight = index === 0 ? 0.46 : 0.26;

      const signal = packetWaterSignal(packet);
      waterSignal = Math.max(waterSignal, signal);

      const elevation = firstNumber(packet, ["elevation", "height", "altitude"], NaN);
      const seaLevel = firstNumber(packet, ["seaLevel", "waterline", "seaLevelValue"], 0);
      const elevationDepth = Number.isFinite(elevation) ? clamp01((seaLevel - elevation) * 5.2) : 0;

      waterDepth = Math.max(
        waterDepth,
        firstNumber(packet, ["waterDepth", "depth", "oceanDepth"], 0) * weight + local.waterDepth * (1 - weight),
        elevationDepth
      );

      depthBinding = Math.max(
        depthBinding,
        firstNumber(packet, ["depthBinding", "waterDepthBinding"], 0),
        firstNumber(packet, ["materialWaterFeed", "materialShelfFeed"], 0) * 0.8
      );

      hydrosphereBinding = Math.max(
        hydrosphereBinding,
        firstNumber(packet, ["hydrosphereBinding", "waterBinding", "oceanBinding"], 0),
        signal > 0.2 ? 0.82 : 0
      );

      surfaceSeat = Math.max(
        surfaceSeat,
        firstNumber(packet, ["surfaceSeat", "surfaceSeating", "waterSurfaceSeat"], 0),
        firstBool(packet, ["surfaceBound", "bodyBound"], false) && signal > 0.2 ? 0.84 : 0
      );

      shorelineContact = Math.max(
        shorelineContact,
        firstNumber(packet, ["shorelineContact", "shoreContact"], 0)
      );

      coastPotential = Math.max(
        coastPotential,
        firstNumber(packet, ["coastPotential", "coastalPotential"], 0)
      );

      wetEdge = Math.max(
        wetEdge,
        firstNumber(packet, ["wetEdge", "materialWetStoneFeed", "materialWaterlineFeed"], 0)
      );

      basinInfluence = Math.max(
        basinInfluence,
        firstNumber(packet, ["basinInfluence", "basinPotential"], 0)
      );

      submergedBlockInfluence = Math.max(
        submergedBlockInfluence,
        firstNumber(packet, ["submergedBlockInfluence", "materialSubmergedBlockFeed"], 0)
      );

      submergedScarInfluence = Math.max(
        submergedScarInfluence,
        firstNumber(packet, ["submergedScarInfluence", "materialSubmergedScarFeed"], 0)
      );

      const candidateRgb = firstColor(packet, [
        "waterRgb",
        "oceanRgb",
        "rgb",
        "color",
        "baseColor",
        "finalColorHint"
      ], null);

      if (candidateRgb && !sourceRgb) sourceRgb = candidateRgb;
    });

    const waterAlpha = clamp01(Math.max(0.24, waterSignal * 0.86, local.waterAlpha * 0.78));
    const finalDepth = clamp01(Math.max(waterDepth, waterAlpha * 0.54));
    const finalHydrosphereBinding = clamp01(Math.max(hydrosphereBinding, waterAlpha > 0.18 ? 0.84 : 0.62));
    const finalSurfaceSeat = clamp01(Math.max(surfaceSeat, waterAlpha > 0.18 ? 0.84 : 0.62));
    const finalDepthBinding = clamp01(Math.max(depthBinding, waterAlpha > 0.18 ? 0.78 : 0.56));

    let rgb = local.rgb;

    if (finalDepth > 0.66) {
      rgb = mixColor(WATER_COLORS.open, WATER_COLORS.deep, 0.68);
    } else if (finalDepth > 0.42) {
      rgb = mixColor(WATER_COLORS.open, WATER_COLORS.shelf, 0.24);
    } else {
      rgb = mixColor(WATER_COLORS.shelf, WATER_COLORS.wet, 0.22);
    }

    if (sourceRgb) {
      rgb = mixColor(sourceRgb, rgb, 0.72);
    }

    const primary = sourcePackets[0] || {};
    const sourceNames = sourcePackets.map((entry) => entry.key).join(",");

    let channelClass = "surface-water";
    if (finalDepth > 0.72) channelClass = "deep-ocean";
    else if (basinInfluence > 0.62) channelClass = "basin-water";
    else if (finalDepth > 0.48) channelClass = "open-ocean";
    else if (wetEdge > 0.52 || coastPotential > 0.52) channelClass = "coastal-shelf-water";

    return {
      sourceMode: "upstream-hydro-receiver",
      sourceContract: primary.contract || FALLBACK_CONTRACT,
      sourceReceipt: primary.receiptName || FALLBACK_RECEIPT,
      sourceAuthority: sourceNames || "hearth-upstream-hydro-chain",

      waterPotential: clamp01(Math.max(waterSignal, local.waterPotential)),
      waterPresence: waterAlpha,
      waterAlpha,
      waterDepth: finalDepth,
      depthBinding: finalDepthBinding,
      hydrosphereBinding: finalHydrosphereBinding,
      surfaceSeat: finalSurfaceSeat,
      shorelineContact: clamp01(shorelineContact),
      coastPotential: clamp01(coastPotential),
      wetEdge: clamp01(wetEdge),
      basinInfluence: clamp01(basinInfluence),
      submergedBlockInfluence: clamp01(submergedBlockInfluence),
      submergedScarInfluence: clamp01(submergedScarInfluence),
      rgb,
      color: rgb,
      alpha: waterAlpha,
      channelClass,
      waterClass: channelClass
    };
  }

  function sample(...args) {
    const input = parseInput(...args);
    const sourcePackets = collectSourcePackets(input);
    const hydro = deriveHydroFromSources(input, sourcePackets);

    const packet = {
      contract: CHANNEL_CONTRACT,
      receipt: RECEIPT,
      birthContract: BIRTH_CONTRACT,
      version: VERSION,
      authority: "water-child-hydro-receiver",

      x: input.x,
      y: input.y,
      z: input.z,
      u: input.u,
      v: input.v,
      lon: input.lon,
      lat: input.lat,

      sourceContract: hydro.sourceContract,
      sourceReceipt: hydro.sourceReceipt,
      sourceAuthority: hydro.sourceAuthority,
      sourceMode: hydro.sourceMode,
      sourceCount: sourcePackets.length,
      sourceOrder: sourcePackets.map((entry) => entry.key),

      channel: "water",
      channelClass: hydro.channelClass,
      waterClass: hydro.waterClass,

      isWaterChannel: true,
      isLandChannel: false,
      isAirChannel: false,

      waterPresence: clamp01(hydro.waterPresence),
      waterAlpha: clamp01(hydro.waterAlpha),
      waterPotential: clamp01(hydro.waterPotential),
      waterDepth: clamp01(hydro.waterDepth),
      depthBinding: clamp01(hydro.depthBinding),
      hydrosphereBinding: clamp01(hydro.hydrosphereBinding),
      surfaceSeat: clamp01(hydro.surfaceSeat),
      shorelineContact: clamp01(hydro.shorelineContact),
      coastPotential: clamp01(hydro.coastPotential),
      wetEdge: clamp01(hydro.wetEdge),
      basinInfluence: clamp01(hydro.basinInfluence),
      submergedBlockInfluence: clamp01(hydro.submergedBlockInfluence),
      submergedScarInfluence: clamp01(hydro.submergedScarInfluence),

      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      mayDefineLand: false,
      mayDefineAir: false,
      mayDefineWater: true,

      rgb: hydro.rgb.slice(),
      color: hydro.rgb.slice(),
      alpha: clamp01(hydro.alpha),

      ownsHydrology: false,
      ownsLand: false,
      ownsAir: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsTectonicCause: false,
      ownsElevationGeneration: false,
      ownsCompositionClassification: false,
      ownsMaterialPalette: false,

      receiverForPlanet: "Hearth",
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    return packet;
  }

  function read(...args) {
    return sample(...args);
  }

  function getColor(...args) {
    return sample(...args).rgb;
  }

  function getReceipt() {
    return {
      contract: CHANNEL_CONTRACT,
      receipt: RECEIPT,
      birthContract: BIRTH_CONTRACT,
      version: VERSION,
      authority: "water-child-hydro-receiver",
      status: "active",
      destinationFile: "/assets/hearth/hearth.water.channel.js",
      channel: "water",
      role: "body-bound-hydrosphere-surface-channel",
      purpose: "receive Hearth hydro-related authorities and expose one Runtime Table-readable water-channel output",
      receiverForPlanet: "Hearth",
      subjectCorrection: {
        rejected: "Planet Earth",
        accepted: "Planet Hearth"
      },
      consumes: [
        "Hearth hydrology when available",
        "Hearth ocean when available",
        "Hearth waterline when available",
        "Hearth materials when available",
        "Hearth composition when available",
        "Hearth elevation when available",
        "deterministic local hydro fallback when upstream files are unavailable"
      ],
      exposedMethods: [
        "sample",
        "read",
        "getReceipt"
      ],
      exposedFields: [
        "waterPresence",
        "waterAlpha",
        "waterPotential",
        "waterDepth",
        "depthBinding",
        "hydrosphereBinding",
        "surfaceSeat",
        "shorelineContact",
        "coastPotential",
        "wetEdge",
        "basinInfluence",
        "submergedBlockInfluence",
        "submergedScarInfluence",
        "bodyBound",
        "surfaceBound",
        "floatsAboveBody",
        "allowedToFloat",
        "mayDefineLand",
        "mayDefineAir",
        "rgb",
        "alpha",
        "sourceMode"
      ],
      renderLaw: [
        "water is body-bound",
        "water is surface/depth seated",
        "water cannot float",
        "water cannot define land",
        "water cannot define air",
        "water must disclose source mode",
        "fallback water is allowed only as Water Child continuity, not final visual pass"
      ],
      owns: [
        "water-channel-expression",
        "hydro-receiver-normalization",
        "surface-seat-fields",
        "hydrosphere-binding-fields",
        "depth-binding-fields",
        "wet-edge-fields",
        "basin/submerged influence fields",
        "water-channel-color-packet"
      ],
      doesNotOwn: [
        "hydrology generation",
        "materials generation",
        "composition classification",
        "elevation generation",
        "tectonic cause",
        "land authority",
        "air authority",
        "canvas mounting",
        "atlas projection",
        "Runtime Table planning",
        "route orchestration",
        "runtime motion",
        "controls",
        "final visual pass claim"
      ],
      loadSafety: {
        noImports: true,
        noRequiredFetch: true,
        exportsImmediately: true,
        safeWithoutDom: true,
        safeWithoutCanvas: true,
        safeWithoutRuntimeTable: true,
        safeWithoutUpstreamHydro: true,
        neverReturnsNullFromSample: true
      },
      expectedRuntimeTableOutcome: {
        waterGlobalPresent: true,
        waterActualContract: CHANNEL_CONTRACT,
        waterSampleProbeOk: true,
        waterSampleProbeCoordinatesOk: true,
        waterSampleProbeFlagsOk: true,
        waterValidationOk: true
      },
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CHANNEL_CONTRACT,
    receipt: RECEIPT,
    birthContract: BIRTH_CONTRACT,
    version: VERSION,
    authority: "water-child-hydro-receiver",

    sample,
    read,
    getColor,
    getReceipt,

    isWaterChannel: true,
    isLandChannel: false,
    isAirChannel: false,

    bodyBound: true,
    surfaceBound: true,
    floatsAboveBody: false,
    allowedToFloat: false,
    mayDefineLand: false,
    mayDefineAir: false,

    receiverForPlanet: "Hearth",
    hydroReceiver: true,
    waterChild: true,
    runtimeTableReadable: true,
    exportsImmediately: true,
    safeWithoutUpstreamHydro: true,

    ownsHydrology: false,
    ownsLand: false,
    ownsAir: false,
    ownsCanvas: false,
    ownsRuntime: false,
    ownsControls: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  const hearth = getHearthRoot();

  hearth.waterChannel = api;
  hearth.hydroReceiver = api;

  root.HEARTH_WATER_CHANNEL = api;
  root.HearthWaterChannel = api;
  root.HEARTH_WATER_CHANNEL_RECEIPT = getReceipt();
  root.HEARTH_WATER_CHANNEL_CONTRACT = CHANNEL_CONTRACT;
  root.HEARTH_WATER_CHANNEL_READY = true;
  root.HEARTH_WATER_CHILD_BIRTH_CONTRACT = BIRTH_CONTRACT;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.hearthWaterChannelLoaded = "true";
    dataset.hearthWaterChannelContract = CHANNEL_CONTRACT;
    dataset.hearthWaterChannelReceipt = RECEIPT;
    dataset.hearthWaterChildBirthContract = BIRTH_CONTRACT;
    dataset.hearthWaterChannelAuthority = "water-child-hydro-receiver";
    dataset.hearthWaterChannelBodyBound = "true";
    dataset.hearthWaterChannelSurfaceBound = "true";
    dataset.hearthWaterChannelAllowedToFloat = "false";
    dataset.hearthWaterChannelDefinesLand = "false";
    dataset.hearthWaterChannelDefinesAir = "false";
    dataset.hearthWaterChannelReceiverForPlanet = "Hearth";
    dataset.hearthWaterChannelExportsImmediately = "true";
    dataset.hearthWaterChannelSafeWithoutUpstreamHydro = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
