// /assets/hearth/hearth.water.channel.js
// HEARTH_WATER_CHILD_SEMICONDUCTOR_MULTIPLEX_ADAPTER_TNT_v1
// Full-file replacement.
// Water Child / semiconductor multiplex adapter authority only.
// Purpose:
// - Serve the missing Hearth Water Child at the deployed asset path.
// - Export one canonical downstream water channel.
// - Coordinate existing water-adjacent authorities without mutating them.
// - Normalize hydrology/materials/composition/elevation/land/air signals into one body-bound water packet.
// - Prevent synonymous water-language overlap from becoming competing visual output.
// - Satisfy canvas, Runtime Table, and Triple G child validation.
// Does not own:
// - route orchestration
// - canvas composition
// - Runtime Table canonical standard
// - Triple G diagnostic canonical standard
// - hydrology law
// - materials law
// - composition law
// - elevation law
// - land truth
// - air truth
// - runtime motion
// - controls
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";
  const RECEIPT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_RECEIPT_v1";
  const BUILD_CONTRACT = "HEARTH_WATER_CHILD_SEMICONDUCTOR_MULTIPLEX_ADAPTER_TNT_v1";
  const PREVIOUS_BUILD_CONTRACT = "HEARTH_DEPLOYED_ROUTE_ALIGNED_WATER_CHILD_TNT_v1";
  const VERSION = "2026-05-29.hearth-water-child-semiconductor-multiplex-adapter-v1";

  const ROUTE_PARENT = "/showroom/globe/hearth/";
  const ROUTE_CONDUCTOR = "/showroom/globe/hearth/hearth.climate.route.js";
  const ASSET_AUTHORITY = "/assets/hearth/hearth.water.channel.js";
  const CANVAS_AUTHORITY = "/assets/hearth/hearth.canvas.js";
  const RUNTIME_VALIDATOR = "/assets/lab/runtime-table.js";

  const HYDROLOGY_AUTHORITY = "/assets/hearth/hearth.hydrology.js";
  const MATERIALS_AUTHORITY = "/assets/hearth/hearth.materials.js";
  const COMPOSITION_AUTHORITY = "/assets/hearth/hearth.composition.js";
  const ELEVATION_AUTHORITY = "/assets/hearth/hearth.elevation.js";
  const LAND_CHANNEL_AUTHORITY = "/assets/hearth/hearth.land.channel.js";
  const AIR_CHANNEL_AUTHORITY = "/assets/hearth/hearth.air.channel.js";

  const HYDROLOGY_EXPECTED_CONTRACT = "HEARTH_SEA_LEVEL_WATERLINE_BEACH_BOUNDARY_HYDROLOGY_TNT_v1";
  const MATERIALS_EXPECTED_CONTRACT = "HEARTH_SUBMERGED_PORT_BASIN_WATERLINE_MATERIALS_TNT_v1";
  const COMPOSITION_EXPECTED_CONTRACT = "HEARTH_TECTONICS_SEATED_COMPOSITION_COORDINATION_TNT_v2";
  const ELEVATION_EXPECTED_CONTRACT = "HEARTH_TECTONICS_SEATED_ELEVATION_RESOLVER_TNT_v2";
  const LAND_EXPECTED_CONTRACT = "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1";
  const AIR_EXPECTED_CONTRACT = "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;
  const TWO_PI = Math.PI * 2;

  const COLORS = Object.freeze({
    deepOcean: [4, 14, 44],
    openWater: [7, 36, 88],
    shelf: [18, 70, 112],
    coastal: [34, 94, 124],
    waterline: [64, 124, 146],
    lowWater: [7, 20, 38],
    foam: [116, 160, 174],
    shadow: [2, 6, 15]
  });

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

  function scaleColor(rgb, scalar) {
    const s = Number.isFinite(Number(scalar)) ? Number(scalar) : 1;
    return [
      clamp(Math.round(rgb[0] * s), 0, 255),
      clamp(Math.round(rgb[1] * s), 0, 255),
      clamp(Math.round(rgb[2] * s), 0, 255)
    ];
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
        return lonLatToVector(uToLon(p.u), vToLat(p.v));
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        return lonLatToVector(Number(p.lon), Number(p.lat));
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        return lonLatToVector(Number(p.longitude), Number(p.latitude));
      }

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        return normalize3({
          x: Number(p.x),
          y: Number(p.y),
          z: Number(p.z)
        });
      }
    }

    if (args.length >= 3) {
      return normalize3({
        x: Number(args[0]),
        y: Number(args[1]),
        z: Number(args[2])
      });
    }

    if (args.length >= 2) {
      return lonLatToVector(Number(args[0]), Number(args[1]));
    }

    return lonLatToVector(0, 0);
  }

  function coordinatePacket(p) {
    const n = normalize3(p);
    const ll = vectorToLonLat(n);
    const magnitude = Math.hypot(n.x, n.y, n.z) || 1;

    return {
      u: lonToU(ll.lon),
      v: latToV(ll.lat),
      lon: ll.lon,
      lat: ll.lat,
      x: n.x,
      y: n.y,
      z: n.z,
      vectorMagnitude: magnitude,
      vectorMagnitudeError: Math.abs(1 - magnitude),
      uLaw: "u = wrap((lon + 180) / 360)",
      vLaw: "v = clamp((90 - lat) / 180)",
      coordinateBody: "shared-hearth-sphere-coordinate-body",
      coordinateCompatible: true
    };
  }

  function getDirectory() {
    return {
      contract: CONTRACT,
      buildContract: BUILD_CONTRACT,
      version: VERSION,
      route: {
        routeParent: ROUTE_PARENT,
        routeConductor: ROUTE_CONDUCTOR,
        role: "context-only"
      },
      self: {
        assetAuthority: ASSET_AUTHORITY,
        role: "normalized-water-output-authority",
        downstreamContract: CONTRACT
      },
      upstream: {
        hydrology: {
          authority: HYDROLOGY_AUTHORITY,
          expectedContract: HYDROLOGY_EXPECTED_CONTRACT,
          role: "where-water-belongs"
        },
        materials: {
          authority: MATERIALS_AUTHORITY,
          expectedContract: MATERIALS_EXPECTED_CONTRACT,
          role: "water-adjacent-material-hints"
        },
        composition: {
          authority: COMPOSITION_AUTHORITY,
          expectedContract: COMPOSITION_EXPECTED_CONTRACT,
          role: "surface-class-context"
        },
        elevation: {
          authority: ELEVATION_AUTHORITY,
          expectedContract: ELEVATION_EXPECTED_CONTRACT,
          role: "sea-level-and-depth-context"
        },
        land: {
          authority: LAND_CHANNEL_AUTHORITY,
          expectedContract: LAND_EXPECTED_CONTRACT,
          role: "land-conflict-boundary"
        },
        air: {
          authority: AIR_CHANNEL_AUTHORITY,
          expectedContract: AIR_EXPECTED_CONTRACT,
          role: "air-conflict-boundary"
        }
      },
      downstream: {
        canvas: {
          authority: CANVAS_AUTHORITY,
          role: "consumer-compositor"
        },
        runtimeTable: {
          authority: RUNTIME_VALIDATOR,
          role: "construction-validator"
        },
        tripleG: {
          authority: RUNTIME_VALIDATOR,
          role: "coherence-diagnostic"
        }
      },
      rule: "upstream-files-provide-signals-water-child-emits-one-normalized-water-packet"
    };
  }

  function getAuthorityByNames(names) {
    for (const name of names) {
      const value = name.split(".").reduce((node, key) => {
        if (!node || typeof node !== "object") return null;
        return node[key] || null;
      }, root);

      if (value && typeof value === "object") return value;
    }

    return null;
  }

  function getHydrologyAuthority() {
    return getAuthorityByNames([
      "HEARTH.hydrology",
      "HEARTH_HYDROLOGY",
      "HearthHydrology"
    ]);
  }

  function getMaterialsAuthority() {
    return getAuthorityByNames([
      "HEARTH.materials",
      "HEARTH_MATERIALS",
      "HearthMaterials"
    ]);
  }

  function getCompositionAuthority() {
    return getAuthorityByNames([
      "HEARTH.composition",
      "HEARTH_COMPOSITION",
      "HearthComposition"
    ]);
  }

  function getElevationAuthority() {
    return getAuthorityByNames([
      "HEARTH.elevation",
      "HEARTH_ELEVATION",
      "HearthElevation"
    ]);
  }

  function getLandAuthority() {
    return getAuthorityByNames([
      "HEARTH.landChannel",
      "HEARTH_LAND_CHANNEL",
      "HearthLandChannel"
    ]);
  }

  function getAirAuthority() {
    return getAuthorityByNames([
      "HEARTH.airChannel",
      "HEARTH_AIR_CHANNEL",
      "HearthAirChannel"
    ]);
  }

  function callAuthority(authority, input) {
    if (!authority || typeof authority !== "object") {
      return {
        present: false,
        sampleOk: false,
        contract: "",
        value: null,
        error: "authority-missing"
      };
    }

    const methods = [
      "sample",
      "read",
      "resolve",
      "get",
      "getSample",
      "sampleAt",
      "readAt",
      "at",
      "getPixel",
      "getMaterial",
      "getHydrology",
      "getElevation",
      "getComposition"
    ];

    for (const method of methods) {
      if (typeof authority[method] !== "function") continue;

      try {
        const value = authority[method].call(authority, input);
        if (value && typeof value === "object") {
          return {
            present: true,
            sampleOk: true,
            contract: String(authority.contract || value.contract || ""),
            value,
            method,
            error: ""
          };
        }
      } catch (error) {
        return {
          present: true,
          sampleOk: false,
          contract: String(authority.contract || ""),
          value: null,
          method,
          error: error && error.message ? error.message : String(error)
        };
      }
    }

    return {
      present: true,
      sampleOk: false,
      contract: String(authority.contract || ""),
      value: null,
      method: "",
      error: "no-readable-method"
    };
  }

  function numericField(source, keys, fallback = 0) {
    for (const key of keys) {
      const value = source && source[key];

      if (typeof value === "boolean") return value ? 1 : 0;

      if (Number.isFinite(Number(value))) {
        return Number(value);
      }

      if (typeof value === "string") {
        const lower = value.toLowerCase();
        if (
          lower.includes("ocean") ||
          lower.includes("water") ||
          lower.includes("shore") ||
          lower.includes("shelf") ||
          lower.includes("beach") ||
          lower.includes("submerged") ||
          lower.includes("basin")
        ) {
          return 1;
        }
      }
    }

    return fallback;
  }

  function booleanField(source, keys, fallback = false) {
    for (const key of keys) {
      const value = source && source[key];

      if (typeof value === "boolean") return value;

      if (Number.isFinite(Number(value))) return Number(value) > 0.5;

      if (typeof value === "string") {
        const lower = value.toLowerCase();
        if (["true", "yes", "water", "ocean", "shelf", "shore", "beach", "submerged"].some((token) => lower.includes(token))) {
          return true;
        }
      }
    }

    return fallback;
  }

  function softBand(value, center, width) {
    const d = Math.abs(Number(value) - Number(center));
    return clamp01(1 - d / Math.max(0.0001, Number(width)));
  }

  function fallbackPotential(coords) {
    const lon = coords.lon * DEG;
    const lat = coords.lat * DEG;

    const frontalBasin = clamp01(0.42 + coords.z * 0.38);
    const equatorialSea = clamp01(0.24 + Math.cos(lat * 1.35) * 0.22);
    const westernBasin = clamp01(0.20 + Math.sin(lon * 1.15 - lat * 0.42) * 0.16);
    const easternShelf = clamp01(0.16 + Math.cos(lon * 2.05 + lat * 0.62) * 0.14);
    const polarMute = clamp01(1 - Math.abs(coords.y) * 0.24);

    const straits = clamp01(
      softBand(Math.sin(lon * 2.8 + lat * 1.1), 0.12, 0.42) * 0.13 +
        softBand(Math.cos(lon * 1.7 - lat * 1.5), -0.08, 0.36) * 0.11
    );

    return clamp01(
      (
        frontalBasin * 0.47 +
        equatorialSea * 0.20 +
        westernBasin * 0.13 +
        easternShelf * 0.10 +
        straits * 0.10
      ) * polarMute
    );
  }

  function fallbackShelf(coords, waterValue) {
    const lon = coords.lon * DEG;
    const lat = coords.lat * DEG;

    return clamp01(
      softBand(waterValue, 0.42, 0.26) * 0.46 +
        softBand(Math.sin(lon * 2.1 + lat * 0.75), 0.0, 0.52) * 0.18 +
        softBand(Math.cos(lon * 1.3 - lat * 1.2), 0.16, 0.48) * 0.14
    );
  }

  function fallbackShoreline(coords, waterValue) {
    const lon = coords.lon * DEG;
    const lat = coords.lat * DEG;

    return clamp01(
      softBand(waterValue, 0.34, 0.14) * 0.58 +
        softBand(Math.sin(lon * 3.2 - lat * 1.4), 0.05, 0.32) * 0.16 +
        softBand(Math.cos(lon * 2.4 + lat * 1.8), -0.14, 0.30) * 0.12
    );
  }

  function adaptHydrology(read) {
    const value = read.value || {};

    const seaLevel = numericField(value, ["seaLevel", "seaLevelScore", "waterline", "waterlineStrength", "waterlineBoundary"], 0);
    const shore = numericField(value, ["shore", "shoreline", "shoreStrength", "coastalBoundary", "beachBoundary"], 0);
    const shelf = numericField(value, ["shelf", "shallowShelf", "sandShelf", "beachShelf", "continentalShelf"], 0);
    const basin = numericField(value, ["basin", "basinDepth", "submergedPortBasin", "depthBasin"], 0);
    const submerged = numericField(value, ["submergedBlock", "submergedScar", "submerged", "belowSeaLevel"], 0);

    const score = clamp01(seaLevel * 0.24 + shore * 0.18 + shelf * 0.18 + basin * 0.22 + submerged * 0.18);

    return {
      source: "hydrology",
      present: read.present,
      sampleOk: read.sampleOk,
      contract: read.contract,
      signal: score,
      seaLevel,
      shore,
      shelf,
      basin,
      submerged,
      detail: read.error || ""
    };
  }

  function adaptMaterials(read) {
    const value = read.value || {};

    const wetStone = numericField(value, ["wetStone", "wetStoneBoundary", "wetness", "waterlineWetness"], 0);
    const beachShelf = numericField(value, ["beachShelf", "sandShelf", "shelfMaterial", "shoreMaterial"], 0);
    const submergedPortBasin = numericField(value, ["submergedPortBasin", "portBasin", "basinMaterial"], 0);
    const coastalScar = numericField(value, ["coastalScar", "submergedScar", "scarMaterial"], 0);
    const materialWater = numericField(value, ["water", "waterMaterial", "oceanMaterial", "hydrologyMaterial"], 0);

    const score = clamp01(wetStone * 0.16 + beachShelf * 0.18 + submergedPortBasin * 0.24 + coastalScar * 0.16 + materialWater * 0.26);

    return {
      source: "materials",
      present: read.present,
      sampleOk: read.sampleOk,
      contract: read.contract,
      signal: score,
      wetStone,
      beachShelf,
      submergedPortBasin,
      coastalScar,
      materialWater,
      detail: read.error || ""
    };
  }

  function adaptComposition(read) {
    const value = read.value || {};

    const openOcean = numericField(value, ["openOcean", "ocean", "oceanic", "waterClass", "isWater"], 0);
    const coastalBoundary = numericField(value, ["coastalBoundary", "coast", "shore", "shoreline"], 0);
    const basinClass = numericField(value, ["basin", "basinClass", "depression", "lowland"], 0);
    const terrainWater = numericField(value, ["terrainWater", "waterPresence", "hydrologyPresence"], 0);

    const terrainClassText = String(value.terrainClass || value.className || value.kind || "").toLowerCase();
    const textWater = terrainClassText.includes("ocean") || terrainClassText.includes("water") || terrainClassText.includes("shore") || terrainClassText.includes("basin") ? 1 : 0;

    const score = clamp01(openOcean * 0.30 + coastalBoundary * 0.22 + basinClass * 0.20 + terrainWater * 0.18 + textWater * 0.10);

    return {
      source: "composition",
      present: read.present,
      sampleOk: read.sampleOk,
      contract: read.contract,
      signal: score,
      openOcean,
      coastalBoundary,
      basinClass,
      terrainWater,
      textWater,
      detail: read.error || ""
    };
  }

  function adaptElevation(read) {
    const value = read.value || {};

    const belowSeaLevel = numericField(value, ["belowSeaLevel", "submerged", "underSeaLevel"], 0);
    const nearSeaLevel = numericField(value, ["nearSeaLevel", "seaLevelBand", "waterlineBand"], 0);
    const depth = numericField(value, ["depth", "waterDepth", "basinDepth", "negativeElevation"], 0);
    const elevation = Number(value.elevation ?? value.height ?? value.altitude);

    let elevationSignal = 0;
    if (Number.isFinite(elevation)) {
      elevationSignal = elevation < 0 ? clamp01(Math.abs(elevation)) : clamp01(1 - elevation);
    }

    const score = clamp01(belowSeaLevel * 0.34 + nearSeaLevel * 0.18 + depth * 0.28 + elevationSignal * 0.20);

    return {
      source: "elevation",
      present: read.present,
      sampleOk: read.sampleOk,
      contract: read.contract,
      signal: score,
      belowSeaLevel,
      nearSeaLevel,
      depth,
      elevationSignal,
      detail: read.error || ""
    };
  }

  function adaptLandConflict(read) {
    const value = read.value || {};

    const landAlpha = numericField(value, ["landAlpha", "landPresence", "alpha"], 0);
    const bodyBinding = numericField(value, ["bodyBinding", "surfaceAttachment", "landBodyScore"], 0);
    const landConflict = clamp01(landAlpha * 0.70 + bodyBinding * landAlpha * 0.30);

    return {
      source: "land",
      present: read.present,
      sampleOk: read.sampleOk,
      contract: read.contract,
      signal: landConflict,
      landAlpha,
      bodyBinding,
      mayDefineWater: booleanField(value, ["mayDefineWater", "definesWaterTruth"], false),
      detail: read.error || ""
    };
  }

  function adaptAirConflict(read) {
    const value = read.value || {};

    const airAlpha = numericField(value, ["airAlpha", "airPresence", "alpha"], 0);
    const humidity = numericField(value, ["humidity", "humiditySignal", "moisture"], 0);
    const rimHaze = numericField(value, ["rimHaze", "limbAtmosphere", "haze"], 0);
    const airConflict = clamp01(airAlpha * 0.48 + humidity * 0.30 + rimHaze * 0.22);

    return {
      source: "air",
      present: read.present,
      sampleOk: read.sampleOk,
      contract: read.contract,
      signal: airConflict,
      airAlpha,
      humidity,
      rimHaze,
      mayDefineWater: booleanField(value, ["mayDefineWater", "definesWaterTruth"], false),
      detail: read.error || ""
    };
  }

  function readUpstream(coords) {
    const input = {
      u: coords.u,
      v: coords.v,
      lon: coords.lon,
      lat: coords.lat,
      x: coords.x,
      y: coords.y,
      z: coords.z
    };

    const hydrology = adaptHydrology(callAuthority(getHydrologyAuthority(), input));
    const materials = adaptMaterials(callAuthority(getMaterialsAuthority(), input));
    const composition = adaptComposition(callAuthority(getCompositionAuthority(), input));
    const elevation = adaptElevation(callAuthority(getElevationAuthority(), input));
    const land = adaptLandConflict(callAuthority(getLandAuthority(), input));
    const air = adaptAirConflict(callAuthority(getAirAuthority(), input));

    const presentCount = [hydrology, materials, composition, elevation, land, air].filter((entry) => entry.present).length;
    const sampleOkCount = [hydrology, materials, composition, elevation, land, air].filter((entry) => entry.sampleOk).length;

    return {
      hydrology,
      materials,
      composition,
      elevation,
      land,
      air,
      presentCount,
      sampleOkCount,
      fallbackMathUsed: sampleOkCount === 0
    };
  }

  function normalizeSignals(coords, upstream) {
    const baseWater = fallbackPotential(coords);
    const baseShelf = fallbackShelf(coords, baseWater);
    const baseShoreline = fallbackShoreline(coords, baseWater);

    const hydrologySignal = clamp01(upstream.hydrology.signal);
    const materialsSignal = clamp01(upstream.materials.signal);
    const compositionSignal = clamp01(upstream.composition.signal);
    const elevationSignal = clamp01(upstream.elevation.signal);
    const landConflictSignal = clamp01(upstream.land.signal);
    const airConflictSignal = clamp01(upstream.air.signal);

    const upstreamWater =
      hydrologySignal * 0.34 +
      compositionSignal * 0.22 +
      elevationSignal * 0.22 +
      materialsSignal * 0.12;

    const fallbackWeight = upstream.sampleOkCount > 0 ? 0.34 : 1;
    const upstreamWeight = upstream.sampleOkCount > 0 ? 0.66 : 0;

    const landRejection = clamp01(landConflictSignal * 0.38);
    const airRejection = clamp01(airConflictSignal * 0.24);

    const rawWater = clamp01(baseWater * fallbackWeight + upstreamWater * upstreamWeight);
    const waterSeatEvidence = clamp01(
      elevationSignal * 0.28 +
      hydrologySignal * 0.30 +
      compositionSignal * 0.18 +
      baseWater * 0.24
    );

    const normalizedWater = clamp01(rawWater * (1 - landRejection * 0.45) * (1 - airRejection * 0.20));
    const shelf = clamp01(baseShelf * 0.60 + upstream.hydrology.shelf * 0.18 + upstream.materials.beachShelf * 0.12 + upstream.composition.coastalBoundary * 0.10);
    const shoreline = clamp01(baseShoreline * 0.58 + upstream.hydrology.shore * 0.20 + upstream.hydrology.seaLevel * 0.12 + upstream.materials.wetStone * 0.10);
    const basin = clamp01(baseWater * 0.34 + upstream.hydrology.basin * 0.24 + upstream.elevation.depth * 0.24 + upstream.materials.submergedPortBasin * 0.18);

    let dominantWaterCause = "fallback-coordinate-waterfield";

    const causes = [
      ["hydrology", hydrologySignal],
      ["materials", materialsSignal],
      ["composition", compositionSignal],
      ["elevation", elevationSignal],
      ["fallback", baseWater]
    ].sort((a, b) => b[1] - a[1]);

    if (causes[0] && causes[0][1] > 0.05) {
      dominantWaterCause = `${causes[0][0]}-signal`;
    }

    return {
      baseWater,
      baseShelf,
      baseShoreline,
      hydrologySignal,
      materialsSignal,
      compositionSignal,
      elevationSignal,
      landConflictSignal,
      airConflictSignal,
      normalizedWater,
      waterSeatEvidence,
      shelf,
      shoreline,
      basin,
      multiplexScore: clamp01(
        normalizedWater * 0.34 +
        waterSeatEvidence * 0.24 +
        shelf * 0.12 +
        shoreline * 0.10 +
        basin * 0.16 +
        upstream.sampleOkCount * 0.02
      ),
      multiplexSourceCount: upstream.sampleOkCount,
      multiplexReady: true,
      fallbackMathUsed: upstream.fallbackMathUsed,
      dominantWaterCause
    };
  }

  function classifyWater(waterAlpha, waterDepth, shelf, shoreline) {
    if (waterAlpha >= 0.72 && waterDepth >= 0.62) return "deep-ocean";
    if (waterAlpha >= 0.52) return "open-water";
    if (waterAlpha >= 0.32 || shelf >= 0.34) return "shallow-shelf";
    if (waterAlpha >= 0.16 || shoreline >= 0.26) return "coastal-boundary";
    return "low-water";
  }

  function waterColor(depthClass, waterAlpha, shelf, shoreline, basin) {
    let rgb = COLORS.lowWater.slice();

    if (depthClass === "deep-ocean") {
      rgb = mixColor(COLORS.openWater, COLORS.deepOcean, 0.72);
    } else if (depthClass === "open-water") {
      rgb = mixColor(COLORS.openWater, COLORS.deepOcean, basin * 0.28);
    } else if (depthClass === "shallow-shelf") {
      rgb = mixColor(COLORS.openWater, COLORS.shelf, clamp01(0.38 + shelf * 0.44));
    } else if (depthClass === "coastal-boundary") {
      rgb = mixColor(COLORS.shelf, COLORS.coastal, clamp01(0.34 + shoreline * 0.46));
    } else {
      rgb = mixColor(COLORS.shadow, COLORS.lowWater, clamp01(waterAlpha * 1.8));
    }

    if (shoreline > 0.22) {
      rgb = mixColor(rgb, COLORS.waterline, shoreline * 0.10);
      rgb = mixColor(rgb, COLORS.foam, shoreline * 0.04);
    }

    return rgb;
  }

  function buildWaterSample(p) {
    const coords = coordinatePacket(p);
    const upstream = readUpstream(coords);
    const multiplex = normalizeSignals(coords, upstream);

    const waterAlpha = clamp01(
      multiplex.normalizedWater * 0.74 +
        multiplex.shelf * 0.12 +
        multiplex.shoreline * 0.08 +
        multiplex.basin * 0.06
    );

    const waterPresence = clamp01(
      waterAlpha * 0.80 +
        multiplex.waterSeatEvidence * 0.12 +
        multiplex.shoreline * 0.08
    );

    const waterDepth = clamp01(
      waterAlpha * 0.52 +
        multiplex.basin * 0.26 +
        multiplex.normalizedWater * 0.18 -
        multiplex.shoreline * 0.04
    );

    const waterDepthClass = classifyWater(waterAlpha, waterDepth, multiplex.shelf, multiplex.shoreline);
    const isVisibleWater = waterAlpha > 0.08;
    const isMajorWater = waterAlpha > 0.24;

    const hydrosphereBinding = isVisibleWater
      ? clamp01(0.76 + multiplex.waterSeatEvidence * 0.12 + waterAlpha * 0.10)
      : 0.64;

    const surfaceSeat = isVisibleWater
      ? clamp01(0.78 + waterPresence * 0.14 + multiplex.waterSeatEvidence * 0.08)
      : 0.62;

    const depthBinding = isVisibleWater
      ? clamp01(0.58 + waterDepth * 0.32 + multiplex.basin * 0.10)
      : 0.46;

    let rgb = waterColor(waterDepthClass, waterAlpha, multiplex.shelf, multiplex.shoreline, multiplex.basin);
    const bodyShade = clamp01(0.72 + coords.z * 0.12 + hydrosphereBinding * 0.10);
    rgb = scaleColor(rgb, bodyShade);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      buildContract: BUILD_CONTRACT,
      previousBuildContract: PREVIOUS_BUILD_CONTRACT,
      version: VERSION,
      authority: "hearth-water-child-semiconductor-multiplex-adapter",

      routeParent: ROUTE_PARENT,
      routeAligned: true,
      assetAuthority: ASSET_AUTHORITY,
      expectedRouteConductor: ROUTE_CONDUCTOR,
      expectedCanvasConsumer: CANVAS_AUTHORITY,
      expectedRuntimeValidator: RUNTIME_VALIDATOR,

      ...coords,

      channel: "water",
      channelClass: waterDepthClass,
      isWaterChannel: true,

      rgb,
      color: rgb,
      waterRgb: rgb,

      alpha: waterAlpha,
      waterAlpha,
      waterPresence,
      hydrosphereBinding,
      surfaceSeat,
      depthBinding,

      waterDepth,
      waterDepthClass,
      basinDepth: clamp01(waterDepth * 0.78 + multiplex.basin * 0.18),
      oceanContinuity: clamp01(multiplex.normalizedWater * 0.62 + waterPresence * 0.22 + multiplex.basin * 0.10),
      surfaceTension: clamp01(0.52 + multiplex.shoreline * 0.22 + multiplex.shelf * 0.08),

      shorelineBoundary: multiplex.shoreline > 0.22,
      shorelineBoundaryStrength: multiplex.shoreline,
      shallowShelf: multiplex.shelf > 0.24,
      shallowShelfStrength: multiplex.shelf,

      belowSeaLevel: isVisibleWater || multiplex.elevationSignal > 0.24,
      belowSeaLevelStrength: clamp01(waterPresence * 0.60 + multiplex.elevationSignal * 0.26),
      nearSeaLevel: multiplex.shoreline > 0.18 || multiplex.shelf > 0.22,
      nearSeaLevelStrength: clamp01(multiplex.shoreline * 0.62 + multiplex.shelf * 0.28),

      hydrologySignal: multiplex.hydrologySignal,
      materialsSignal: multiplex.materialsSignal,
      compositionSignal: multiplex.compositionSignal,
      elevationSignal: multiplex.elevationSignal,
      landConflictSignal: multiplex.landConflictSignal,
      airConflictSignal: multiplex.airConflictSignal,
      multiplexScore: multiplex.multiplexScore,
      multiplexSourceCount: multiplex.multiplexSourceCount,
      multiplexReady: multiplex.multiplexReady,
      fallbackMathUsed: multiplex.fallbackMathUsed,
      dominantWaterCause: multiplex.dominantWaterCause,

      upstreamSignals: {
        hydrology: upstream.hydrology,
        materials: upstream.materials,
        composition: upstream.composition,
        elevation: upstream.elevation,
        land: upstream.land,
        air: upstream.air
      },

      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,

      mayDefineLand: false,
      mayDefineAir: false,
      definesLandTruth: false,
      definesAirTruth: false,

      materialWetnessIsNotHydrosphere: true,
      airHumidityIsNotWaterBody: true,
      hydrologyHintIsNotFinalColor: true,
      landBoundaryIsNotWaterBody: true,

      atmosphericRejection: clamp01(0.74 + waterAlpha * 0.18),
      airSuppression: clamp01(0.58 + waterPresence * 0.28),
      landRejection: clamp01(isMajorWater ? 0.62 + waterAlpha * 0.22 : 0.24 + multiplex.shoreline * 0.26),

      surfaceNormalLock: true,
      coordinateLock: true,
      coordinateMapReady: true,
      semiconductorAdapter: true,
      singleOutputChannel: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      canvasMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  function sample(...args) {
    return buildWaterSample(parseInput(...args));
  }

  function read(...args) {
    return sample(...args);
  }

  function sampleWater(...args) {
    return sample(...args);
  }

  function readWater(...args) {
    return sample(...args);
  }

  function waterAt(...args) {
    return sample(...args);
  }

  function getWater(...args) {
    return sample(...args);
  }

  function resolveWater(...args) {
    return sample(...args);
  }

  function getMultiplexReceipt(input) {
    try {
      const packet = sample(input || { u: 0.5, v: 0.5 });

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        buildContract: BUILD_CONTRACT,
        routeParent: ROUTE_PARENT,
        assetAuthority: ASSET_AUTHORITY,
        multiplexReady: packet.multiplexReady,
        multiplexScore: packet.multiplexScore,
        multiplexSourceCount: packet.multiplexSourceCount,
        fallbackMathUsed: packet.fallbackMathUsed,
        dominantWaterCause: packet.dominantWaterCause,
        hydrologySignal: packet.hydrologySignal,
        materialsSignal: packet.materialsSignal,
        compositionSignal: packet.compositionSignal,
        elevationSignal: packet.elevationSignal,
        landConflictSignal: packet.landConflictSignal,
        airConflictSignal: packet.airConflictSignal,
        bodyBound: packet.bodyBound,
        surfaceBound: packet.surfaceBound,
        allowedToFloat: packet.allowedToFloat,
        singleOutputChannel: true,
        visualPassClaimed: false
      };
    } catch (error) {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        buildContract: BUILD_CONTRACT,
        multiplexReady: false,
        error: error && error.message ? error.message : String(error),
        visualPassClaimed: false
      };
    }
  }

  function getCoordinateMap() {
    return {
      contract: CONTRACT,
      buildContract: BUILD_CONTRACT,
      chronologicalOrder: [
        "served-file",
        "global-export",
        "internal-directory",
        "input-acceptance",
        "shared-body-math",
        "upstream-soft-read",
        "signal-classification",
        "semiconductor-gate",
        "multiplex-normalization",
        "normalized-water-packet",
        "dataset-receipt",
        "runtime-table-validation",
        "triple-g-receipt",
        "calibration-handoff"
      ],
      coordinates: [
        {
          id: "E0_SERVED_FILE",
          path: ASSET_AUTHORITY,
          request: "/assets/hearth/hearth.water.channel.js?v=hearth-water-channel-load-export-v1",
          acceptance: "waterScriptLoaded=true"
        },
        {
          id: "E1_GLOBAL_EXPORT",
          globals: ["HEARTH_WATER_CHANNEL", "HearthWaterChannel", "HEARTH.waterChannel"],
          acceptance: "waterGlobalPresent=true"
        },
        {
          id: "E2_INTERNAL_DIRECTORY",
          directory: getDirectory(),
          acceptance: "hearthWaterDirectoryReady=true"
        },
        {
          id: "E3_INPUT_ACCEPTANCE",
          acceptedInputs: ["{u,v}", "{lon,lat}", "{longitude,latitude}", "{x,y,z}", "x,y,z", "lon,lat"],
          probe: { u: 0.5, v: 0.5, x: 0, y: 0, z: 1 },
          acceptance: "waterSampleProbeOk=true"
        },
        {
          id: "E4_SHARED_BODY_MATH",
          laws: ["x²+y²+z²≈1", "u=wrap((lon+180)/360)", "v=clamp((90-lat)/180)"],
          acceptance: "waterSampleProbeCoordinatesOk=true"
        },
        {
          id: "E5_UPSTREAM_SOFT_READ",
          authorities: ["hydrology", "materials", "composition", "elevation", "land", "air"],
          failureMode: "fail-soft",
          acceptance: "missing-upstream-does-not-break-sample"
        },
        {
          id: "E6_SIGNAL_CLASSIFICATION",
          signals: ["hydrologySignal", "materialsSignal", "compositionSignal", "elevationSignal", "landConflictSignal", "airConflictSignal"],
          acceptance: "signals-classified-before-expression"
        },
        {
          id: "E7_SEMICONDUCTOR_GATE",
          rejectionLaws: [
            "materialWetnessIsNotHydrosphere",
            "airHumidityIsNotWaterBody",
            "hydrologyHintIsNotFinalColor",
            "landBoundaryIsNotWaterBody"
          ],
          acceptance: "overlap-rejected"
        },
        {
          id: "E8_MULTIPLEX_NORMALIZATION",
          output: "one-normalized-water-packet",
          acceptance: "singleOutputChannel=true"
        },
        {
          id: "E9_NORMALIZED_PACKET",
          requiredFlags: {
            channel: "water",
            isWaterChannel: true,
            bodyBound: true,
            surfaceBound: true,
            allowedToFloat: false
          },
          acceptance: "waterSampleProbeFlagsOk=true"
        },
        {
          id: "E10_DATASET_RECEIPT",
          acceptance: "document-root-water-child-receipt-present"
        },
        {
          id: "E11_RUNTIME_TABLE_VALIDATION",
          acceptance: "water.status=READY"
        },
        {
          id: "E12_TRIPLE_G_RECEIPT",
          acceptance: "RECEIPT_VERIFICATION_CHECK=PASS"
        },
        {
          id: "E13_CALIBRATION_HANDOFF",
          order: [
            "WATER_SURFACE_SEATING_CHECK",
            "CHANNEL_SEPARATION_CHECK",
            "LAND_BODY_BINDING_CHECK",
            "DISTRIBUTION_SHAPE_CHECK"
          ]
        }
      ]
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      buildContract: BUILD_CONTRACT,
      previousBuildContract: PREVIOUS_BUILD_CONTRACT,
      version: VERSION,
      authority: "hearth-water-child-semiconductor-multiplex-adapter",
      primaryTarget: ASSET_AUTHORITY,
      status: "active",
      role: "Water Child / semiconductor multiplex adapter / normalized hydrosphere output",

      routeParent: ROUTE_PARENT,
      routeAligned: true,
      assetAuthority: ASSET_AUTHORITY,
      expectedRouteConductor: ROUTE_CONDUCTOR,
      expectedCanvasConsumer: CANVAS_AUTHORITY,
      expectedRuntimeValidator: RUNTIME_VALIDATOR,

      directoryReady: true,
      directory: getDirectory(),
      coordinateMapReady: true,
      coordinateMap: getCoordinateMap(),
      multiplexReceipt: getMultiplexReceipt({ u: 0.5, v: 0.5 }),

      globalExports: [
        "HEARTH_WATER_CHANNEL",
        "HearthWaterChannel",
        "HEARTH.waterChannel"
      ],
      requiredMethods: [
        "sample",
        "read",
        "getReceipt",
        "getDirectory",
        "getCoordinateMap",
        "getMultiplexReceipt"
      ],
      aliases: [
        "sampleWater",
        "readWater",
        "waterAt",
        "getWater",
        "resolveWater"
      ],
      coordinateFields: [
        "u",
        "v",
        "lon",
        "lat",
        "x",
        "y",
        "z"
      ],
      multiplexFields: [
        "hydrologySignal",
        "materialsSignal",
        "compositionSignal",
        "elevationSignal",
        "landConflictSignal",
        "airConflictSignal",
        "multiplexScore",
        "multiplexSourceCount",
        "multiplexReady",
        "fallbackMathUsed",
        "dominantWaterCause"
      ],
      waterFields: [
        "waterAlpha",
        "waterPresence",
        "hydrosphereBinding",
        "surfaceSeat",
        "depthBinding",
        "waterDepth",
        "waterDepthClass",
        "basinDepth",
        "oceanContinuity",
        "shorelineBoundary",
        "shorelineBoundaryStrength",
        "shallowShelf",
        "shallowShelfStrength",
        "surfaceTension"
      ],
      waterClasses: [
        "deep-ocean",
        "open-water",
        "shallow-shelf",
        "coastal-boundary",
        "low-water"
      ],
      semiconductorRejectionLaws: {
        materialWetnessIsNotHydrosphere: true,
        airHumidityIsNotWaterBody: true,
        hydrologyHintIsNotFinalColor: true,
        landBoundaryIsNotWaterBody: true
      },
      channelTruth: {
        channel: "water",
        isWaterChannel: true,
        bodyBound: true,
        surfaceBound: true,
        floatsAboveBody: false,
        allowedToFloat: false,
        mayDefineLand: false,
        mayDefineAir: false,
        definesLandTruth: false,
        definesAirTruth: false
      },
      owns: [
        "water-sector-directory",
        "upstream-soft-read",
        "signal-classification",
        "semantic-overlap-rejection",
        "multiplex-normalization",
        "single-normalized-water-packet",
        "body-bound-water-channel-output",
        "water-sample-coordinate-identity"
      ],
      doesNotOwn: [
        "route-orchestration",
        "canvas-composition",
        "Runtime Table canonical standard",
        "Triple G diagnostic canonical standard",
        "hydrology-law",
        "materials-law",
        "composition-law",
        "elevation-law",
        "land-truth",
        "air-truth",
        "runtime-motion",
        "controls",
        "final-visual-pass-claim"
      ],
      acceptanceTarget: [
        "waterScriptLoaded true",
        "waterGlobalPresent true",
        "waterActualContract matches HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1",
        "waterSampleProbeOk true",
        "waterSampleProbeCoordinatesOk true",
        "waterSampleProbeFlagsOk true",
        "Runtime Table water record READY",
        "RECEIPT_VERIFICATION_CHECK PASS"
      ],
      calibrationAfterMissingChildClosure: [
        "WATER_SURFACE_SEATING_CHECK",
        "CHANNEL_SEPARATION_CHECK",
        "LAND_BODY_BINDING_CHECK",
        "DISTRIBUTION_SHAPE_CHECK"
      ],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      canvasMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    buildContract: BUILD_CONTRACT,
    previousBuildContract: PREVIOUS_BUILD_CONTRACT,
    version: VERSION,

    routeParent: ROUTE_PARENT,
    routeAligned: true,
    assetAuthority: ASSET_AUTHORITY,
    expectedRouteConductor: ROUTE_CONDUCTOR,
    expectedCanvasConsumer: CANVAS_AUTHORITY,
    expectedRuntimeValidator: RUNTIME_VALIDATOR,

    sample,
    read,
    sampleWater,
    readWater,
    waterAt,
    getWater,
    resolveWater,
    getReceipt,
    getDirectory,
    getCoordinateMap,
    getMultiplexReceipt,

    isWaterChannel: true,
    bodyBound: true,
    surfaceBound: true,
    floatsAboveBody: false,
    allowedToFloat: false,
    mayDefineLand: false,
    mayDefineAir: false,
    definesLandTruth: false,
    definesAirTruth: false,
    coordinateCompatible: true,

    semiconductorAdapter: true,
    multiplexReady: true,
    singleOutputChannel: true,

    materialWetnessIsNotHydrosphere: true,
    airHumidityIsNotWaterBody: true,
    hydrologyHintIsNotFinalColor: true,
    landBoundaryIsNotWaterBody: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    routeMutation: false,
    canvasMutation: false,
    runtimeMutation: false,
    controlsMutation: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.waterChannel = api;

  root.HEARTH_WATER_CHANNEL = api;
  root.HearthWaterChannel = api;
  root.HEARTH_WATER_CHANNEL_RECEIPT = getReceipt();
  root.HEARTH_WATER_CHANNEL_CONTRACT = CONTRACT;
  root.HEARTH_WATER_CHANNEL_LOADED = true;
  root.HEARTH_WATER_CHANNEL_ROUTE_ALIGNED = true;
  root.HEARTH_WATER_CHANNEL_SEMICONDUCTOR_ADAPTER = true;
  root.HEARTH_WATER_CHANNEL_MULTIPLEX_READY = true;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.hearthWaterChannelLoaded = "true";
    dataset.hearthWaterChannelContract = CONTRACT;
    dataset.hearthWaterChannelReceipt = RECEIPT;
    dataset.hearthWaterChildBuildContract = BUILD_CONTRACT;
    dataset.hearthWaterChildPreviousBuildContract = PREVIOUS_BUILD_CONTRACT;

    dataset.hearthWaterChannelRouteAligned = "true";
    dataset.hearthWaterChannelRouteParent = ROUTE_PARENT;
    dataset.hearthWaterChannelAssetAuthority = ASSET_AUTHORITY;
    dataset.hearthWaterChannelExpectedRouteConductor = ROUTE_CONDUCTOR;
    dataset.hearthWaterChannelExpectedCanvasConsumer = CANVAS_AUTHORITY;
    dataset.hearthWaterChannelExpectedRuntimeValidator = RUNTIME_VALIDATOR;

    dataset.hearthWaterDirectoryReady = "true";
    dataset.hearthWaterDirectoryIncludesHydrology = "true";
    dataset.hearthWaterDirectoryIncludesMaterials = "true";
    dataset.hearthWaterDirectoryIncludesComposition = "true";
    dataset.hearthWaterDirectoryIncludesElevation = "true";
    dataset.hearthWaterDirectoryIncludesLand = "true";
    dataset.hearthWaterDirectoryIncludesAir = "true";
    dataset.hearthWaterDirectoryIncludesCanvas = "true";
    dataset.hearthWaterDirectoryIncludesRuntimeTable = "true";

    dataset.hearthWaterHydrologyAuthority = HYDROLOGY_AUTHORITY;
    dataset.hearthWaterMaterialsAuthority = MATERIALS_AUTHORITY;
    dataset.hearthWaterCompositionAuthority = COMPOSITION_AUTHORITY;
    dataset.hearthWaterElevationAuthority = ELEVATION_AUTHORITY;
    dataset.hearthWaterLandChannelAuthority = LAND_CHANNEL_AUTHORITY;
    dataset.hearthWaterAirChannelAuthority = AIR_CHANNEL_AUTHORITY;

    dataset.hearthWaterSemiconductorAdapter = "true";
    dataset.hearthWaterMultiplexReady = "true";
    dataset.hearthWaterSingleOutputChannel = "true";
    dataset.hearthWaterFailSoftUpstreamRead = "true";
    dataset.hearthWaterSemanticOverlapRejected = "true";

    dataset.hearthWaterMaterialWetnessIsNotHydrosphere = "true";
    dataset.hearthWaterAirHumidityIsNotWaterBody = "true";
    dataset.hearthWaterHydrologyHintIsNotFinalColor = "true";
    dataset.hearthWaterLandBoundaryIsNotWaterBody = "true";

    dataset.hearthWaterChannelCoordinates = "true";
    dataset.hearthWaterChannelCoordinateMapReady = "true";
    dataset.hearthWaterChannelSampleReady = "true";
    dataset.hearthWaterChannelBodyBound = "true";
    dataset.hearthWaterChannelSurfaceBound = "true";
    dataset.hearthWaterChannelAllowedToFloat = "false";
    dataset.hearthWaterChannelMayDefineLand = "false";
    dataset.hearthWaterChannelMayDefineAir = "false";
    dataset.hearthWaterChannelDefinesLandTruth = "false";
    dataset.hearthWaterChannelDefinesAirTruth = "false";

    dataset.hearthWaterChannelPostWaterPriority = [
      "WATER_SURFACE_SEATING_CHECK",
      "CHANNEL_SEPARATION_CHECK",
      "LAND_BODY_BINDING_CHECK",
      "DISTRIBUTION_SHAPE_CHECK"
    ].join(",");

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.routeMutation = "false";
    dataset.canvasMutation = "false";
    dataset.runtimeMutation = "false";
    dataset.controlsMutation = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
