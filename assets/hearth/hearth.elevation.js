// /assets/hearth/hearth.elevation.js
// HEARTH_ELEVATION_NEWS_FIBONACCI_COORDINATE_BODY_RESOLVER_TNT_v3
// Full-file replacement.
// Elevation resolver authority only.
// Purpose:
// - Preserve HEARTH_TECTONICS_SEATED_ELEVATION_RESOLVER_TNT_v2 behavior.
// - Consume HEARTH_STRUCTURAL_CAUSE_TECTONICS_AUTHORITY_TNT_v2 when present.
// - Add definitive NEWS/Fibonacci coordinate body seats.
// - Resolve land-body breadth, interior, edge, channel, ocean-basin, and summit pressure by coordinate.
// - Convert tectonic structural cause + coordinate seats into physical height/depth.
// - Preserve downstream compatibility fields for composition, hydrology, materials, and canvas.
// Does not own:
// - tectonic origin cause
// - climate authority
// - biome authority
// - material palette
// - canvas drawing
// - runtime motion
// - controls
// - route orchestration
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ELEVATION_NEWS_FIBONACCI_COORDINATE_BODY_RESOLVER_TNT_v3";
  const RECEIPT = "HEARTH_ELEVATION_NEWS_FIBONACCI_COORDINATE_BODY_RESOLVER_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "HEARTH_TECTONICS_SEATED_ELEVATION_RESOLVER_TNT_v2";
  const REQUIRED_TECTONICS_CONTRACT = "HEARTH_STRUCTURAL_CAUSE_TECTONICS_AUTHORITY_TNT_v2";
  const VERSION = "2026-05-30.hearth-elevation-news-fibonacci-coordinate-body-resolver-v3";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;
  const RAD = 180 / Math.PI;
  const SEA_LEVEL = 0.0;
  const EPSILON = 0.000001;

  const ANCHOR = Object.freeze({
    id: "HEARTH_COORDINATE_ANCHOR_0_0",
    u: 0.5,
    v: 0.5,
    lon: 0,
    lat: 0,
    news: "CENTER",
    fibonacci: "F1"
  });

  const NEWS_PROTOCOL = Object.freeze({
    NORTH: {
      role: "checkpoint-governance-cold-height-memory",
      axis: "latitude-positive",
      gate: "N"
    },
    EAST: {
      role: "expansion-first-paint-forward-placement",
      axis: "longitude-positive",
      gate: "E"
    },
    WEST: {
      role: "integration-handoff-boundary-admissibility",
      axis: "longitude-negative",
      gate: "W"
    },
    SOUTH: {
      role: "visible-output-depth-basin-and-completion",
      axis: "latitude-negative",
      gate: "S"
    },
    CENTER: {
      role: "anchor-reference-stabilizer",
      axis: "origin",
      gate: "C"
    }
  });

  const BODY_SEATS = Object.freeze([
    {
      id: "western_shield",
      pressureId: "western_shield_pressure",
      name: "Western Shield Continent",
      index: 0,
      news: "WEST",
      fibonacci: "F1",
      lon: -126,
      lat: 18,
      radiusDeg: 48,
      innerDeg: 16,
      edgeDeg: 52,
      uplift: 0.39,
      breadth: 0.84,
      roughness: 0.14,
      channelResistance: 0.66,
      continentClass: "shield-continent"
    },
    {
      id: "eastern_basin",
      pressureId: "eastern_basin_pressure",
      name: "Eastern Basin Continent",
      index: 1,
      news: "EAST",
      fibonacci: "F2",
      lon: 74,
      lat: 8,
      radiusDeg: 44,
      innerDeg: 14,
      edgeDeg: 49,
      uplift: 0.31,
      breadth: 0.72,
      roughness: 0.10,
      channelResistance: 0.44,
      continentClass: "basin-continent"
    },
    {
      id: "northern_cold",
      pressureId: "northern_cold_pressure",
      name: "Northern Cold Continent",
      index: 2,
      news: "NORTH",
      fibonacci: "F3",
      lon: -22,
      lat: 58,
      radiusDeg: 38,
      innerDeg: 12,
      edgeDeg: 43,
      uplift: 0.35,
      breadth: 0.62,
      roughness: 0.18,
      channelResistance: 0.58,
      continentClass: "cold-crown-continent"
    },
    {
      id: "southern_harsh",
      pressureId: "southern_harsh_pressure",
      name: "Southern Harsh Continent",
      index: 3,
      news: "SOUTH",
      fibonacci: "F5",
      lon: 24,
      lat: -50,
      radiusDeg: 40,
      innerDeg: 12,
      edgeDeg: 46,
      uplift: 0.33,
      breadth: 0.66,
      roughness: 0.20,
      channelResistance: 0.50,
      continentClass: "southern-harsh-continent"
    },
    {
      id: "equatorial_wet",
      pressureId: "equatorial_wet_pressure",
      name: "Equatorial Wet Continent",
      index: 4,
      news: "CENTER",
      fibonacci: "F8",
      lon: -42,
      lat: -2,
      radiusDeg: 42,
      innerDeg: 13,
      edgeDeg: 48,
      uplift: 0.34,
      breadth: 0.74,
      roughness: 0.11,
      channelResistance: 0.36,
      continentClass: "equatorial-wet-continent"
    },
    {
      id: "mountain_arc",
      pressureId: "mountain_arc_pressure",
      name: "Mountain Arc Continent",
      index: 5,
      news: "EAST",
      fibonacci: "F13",
      lon: 138,
      lat: 30,
      radiusDeg: 36,
      innerDeg: 10,
      edgeDeg: 42,
      uplift: 0.42,
      breadth: 0.55,
      roughness: 0.32,
      channelResistance: 0.70,
      continentClass: "mountain-arc-continent"
    },
    {
      id: "broken_archipelago",
      pressureId: "broken_archipelago_pressure",
      name: "Broken Archipelago Continent",
      index: 6,
      news: "WEST",
      fibonacci: "F21",
      lon: -158,
      lat: -24,
      radiusDeg: 34,
      innerDeg: 8,
      edgeDeg: 43,
      uplift: 0.25,
      breadth: 0.42,
      roughness: 0.38,
      channelResistance: 0.24,
      continentClass: "broken-archipelago-continent"
    }
  ].map((seat) => Object.freeze({
    ...seat,
    vector: lonLatToVectorRaw(seat.lon, seat.lat)
  })));

  const OCEAN_BASIN_SEATS = Object.freeze([
    {
      id: "northwest_ocean_basin",
      name: "Northwest Ocean Basin",
      news: "WEST",
      fibonacci: "F3",
      lon: -78,
      lat: 44,
      radiusDeg: 36,
      depth: 0.44,
      channelCut: 0.22
    },
    {
      id: "central_blue_basin",
      name: "Central Blue Basin",
      news: "CENTER",
      fibonacci: "F5",
      lon: 8,
      lat: 2,
      radiusDeg: 42,
      depth: 0.52,
      channelCut: 0.18
    },
    {
      id: "eastern_deep_ocean",
      name: "Eastern Deep Ocean",
      news: "EAST",
      fibonacci: "F8",
      lon: 116,
      lat: -10,
      radiusDeg: 46,
      depth: 0.58,
      channelCut: 0.24
    },
    {
      id: "southern_shelf_basin",
      name: "Southern Shelf Basin",
      news: "SOUTH",
      fibonacci: "F13",
      lon: -18,
      lat: -68,
      radiusDeg: 34,
      depth: 0.48,
      channelCut: 0.30
    },
    {
      id: "polar_north_basin",
      name: "Polar North Basin",
      news: "NORTH",
      fibonacci: "F21",
      lon: 110,
      lat: 68,
      radiusDeg: 28,
      depth: 0.38,
      channelCut: 0.16
    }
  ].map((seat) => Object.freeze({
    ...seat,
    vector: lonLatToVectorRaw(seat.lon, seat.lat)
  })));

  const SUMMIT_SEATS = Object.freeze([
    {
      id: "summit_high_plateau",
      pressureId: "summit_high_plateau_pressure",
      label: "High Plateau Summit Region",
      terrain: "plateau",
      bookSummit: "Gratitude",
      news: "NORTH",
      fibonacci: "F1",
      lon: -112,
      lat: 32,
      radiusDeg: 18,
      uplift: 0.28
    },
    {
      id: "summit_waterfall_escarpment",
      pressureId: "summit_waterfall_escarpment_pressure",
      label: "Waterfall Escarpment Summit Region",
      terrain: "waterfall_escarpment",
      bookSummit: "Generosity",
      news: "WEST",
      fibonacci: "F2",
      lon: -58,
      lat: 16,
      radiusDeg: 15,
      uplift: 0.18
    },
    {
      id: "summit_canyon_crossing",
      pressureId: "summit_canyon_crossing_pressure",
      label: "Canyon Crossing Summit Region",
      terrain: "canyon",
      bookSummit: "Dependability",
      news: "CENTER",
      fibonacci: "F3",
      lon: -18,
      lat: -14,
      radiusDeg: 14,
      uplift: 0.12
    },
    {
      id: "summit_storm_coast_cliff",
      pressureId: "summit_storm_coast_cliff_pressure",
      label: "Storm Coast Cliff Summit Region",
      terrain: "storm_coast_cliff",
      bookSummit: "Accountability",
      news: "WEST",
      fibonacci: "F5",
      lon: -166,
      lat: -6,
      radiusDeg: 16,
      uplift: 0.16
    },
    {
      id: "summit_glacial_pass",
      pressureId: "summit_glacial_pass_pressure",
      label: "Glacial Pass Summit Region",
      terrain: "glacial_pass",
      bookSummit: "Forgiveness",
      news: "NORTH",
      fibonacci: "F8",
      lon: -8,
      lat: 66,
      radiusDeg: 15,
      uplift: 0.22
    },
    {
      id: "summit_rainforest_basin",
      pressureId: "summit_rainforest_basin_pressure",
      label: "Rainforest Basin Summit Region",
      terrain: "rainforest_basin",
      bookSummit: "Humility",
      news: "CENTER",
      fibonacci: "F13",
      lon: -38,
      lat: -2,
      radiusDeg: 17,
      uplift: 0.08
    },
    {
      id: "summit_mountain_arc",
      pressureId: "summit_mountain_arc_pressure",
      label: "Mountain Arc Summit Region",
      terrain: "mountain_arc",
      bookSummit: "Self-Control",
      news: "EAST",
      fibonacci: "F21",
      lon: 142,
      lat: 34,
      radiusDeg: 17,
      uplift: 0.32
    },
    {
      id: "summit_dry_plateau",
      pressureId: "summit_dry_plateau_pressure",
      label: "Dry Plateau Summit Region",
      terrain: "dry_plateau",
      bookSummit: "Patience",
      news: "SOUTH",
      fibonacci: "F34",
      lon: 38,
      lat: -42,
      radiusDeg: 16,
      uplift: 0.20
    },
    {
      id: "summit_archipelago_threshold",
      pressureId: "summit_archipelago_threshold_pressure",
      label: "Archipelago Threshold Summit Region",
      terrain: "archipelago_threshold",
      bookSummit: "Purity",
      news: "WEST",
      fibonacci: "F55",
      lon: -154,
      lat: -28,
      radiusDeg: 18,
      uplift: 0.10
    }
  ].map((seat) => Object.freeze({
    ...seat,
    vector: lonLatToVectorRaw(seat.lon, seat.lat)
  })));

  const CHANNEL_SEATS = Object.freeze([
    {
      id: "western_to_central_channel",
      news: "WEST",
      fibonacci: "F8",
      from: "western_shield",
      to: "central_blue_basin",
      lon: -72,
      lat: 8,
      radiusDeg: 20,
      cut: 0.24
    },
    {
      id: "equatorial_basin_channel",
      news: "CENTER",
      fibonacci: "F13",
      from: "equatorial_wet",
      to: "central_blue_basin",
      lon: -18,
      lat: -6,
      radiusDeg: 22,
      cut: 0.21
    },
    {
      id: "eastern_basin_cut",
      news: "EAST",
      fibonacci: "F21",
      from: "eastern_basin",
      to: "eastern_deep_ocean",
      lon: 94,
      lat: -4,
      radiusDeg: 24,
      cut: 0.26
    },
    {
      id: "southern_shear_channel",
      news: "SOUTH",
      fibonacci: "F34",
      from: "southern_harsh",
      to: "southern_shelf_basin",
      lon: 6,
      lat: -48,
      radiusDeg: 20,
      cut: 0.23
    },
    {
      id: "archipelago_fracture_channel",
      news: "WEST",
      fibonacci: "F55",
      from: "broken_archipelago",
      to: "northwest_ocean_basin",
      lon: -140,
      lat: -12,
      radiusDeg: 26,
      cut: 0.30
    }
  ].map((seat) => Object.freeze({
    ...seat,
    vector: lonLatToVectorRaw(seat.lon, seat.lat)
  })));

  const PROVINCE_COMPATIBILITY = Object.freeze(
    BODY_SEATS.reduce((map, seat) => {
      map[seat.pressureId] = {
        id: seat.id,
        name: seat.name,
        index: seat.index
      };
      return map;
    }, {})
  );

  const SUMMIT_COMPATIBILITY = Object.freeze(
    SUMMIT_SEATS.reduce((map, seat) => {
      map[seat.pressureId] = {
        region: seat.id,
        label: seat.label,
        terrain: seat.terrain,
        bookSummit: seat.bookSummit
      };
      return map;
    }, {})
  );

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(EPSILON, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function softBand(value, center, width) {
    const t = 1 - clamp(Math.abs(value - center) / Math.max(EPSILON, width), 0, 1);
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

  function lonLatToVectorRaw(lonDeg, latDeg) {
    const lon = Number(lonDeg || 0) * DEG;
    const lat = Number(latDeg || 0) * DEG;
    const c = Math.cos(lat);

    const x = Math.sin(lon) * c;
    const y = Math.sin(lat);
    const z = Math.cos(lon) * c;
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
  }

  function lonLatToVector(lonDeg, latDeg) {
    return normalize3(lonLatToVectorRaw(lonDeg, latDeg));
  }

  function vectorToLonLat(p) {
    const n = normalize3(p);

    return {
      lon: Math.atan2(n.x, n.z) * RAD,
      lat: Math.asin(clamp(n.y, -1, 1)) * RAD
    };
  }

  function lonToU(lon) {
    return wrap01((Number(lon) + 180) / 360);
  }

  function latToV(lat) {
    return clamp((90 - Number(lat)) / 180, 0, 1);
  }

  function angularDistanceDeg(a, b) {
    const dot = clamp(a.x * b.x + a.y * b.y + a.z * b.z, -1, 1);
    return Math.acos(dot) * RAD;
  }

  function seatPressure(distanceDeg, radiusDeg, innerDeg) {
    const inner = Math.max(0, Number(innerDeg || 0));
    const outer = Math.max(inner + 1, Number(radiusDeg || inner + 1));

    if (distanceDeg <= inner) return 1;
    return clamp01(1 - smoothstep(inner, outer, distanceDeg));
  }

  function edgePressureFor(distanceDeg, innerDeg, edgeDeg) {
    const center = (Number(innerDeg || 0) + Number(edgeDeg || 0)) * 0.5;
    const width = Math.max(2, (Number(edgeDeg || 0) - Number(innerDeg || 0)) * 0.55);
    return softBand(distanceDeg, center, width);
  }

  function parseInput(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        const vector = normalize3(p);
        const ll = vectorToLonLat(vector);

        return {
          ...vector,
          lon: ll.lon,
          lat: ll.lat,
          u: lonToU(ll.lon),
          v: latToV(ll.lat)
        };
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        const lon = Number(p.lon);
        const lat = Number(p.lat);
        const vector = lonLatToVector(lon, lat);

        return {
          ...vector,
          lon,
          lat,
          u: lonToU(lon),
          v: latToV(lat)
        };
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        const lon = Number(p.longitude);
        const lat = Number(p.latitude);
        const vector = lonLatToVector(lon, lat);

        return {
          ...vector,
          lon,
          lat,
          u: lonToU(lon),
          v: latToV(lat)
        };
      }

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        const u = wrap01(p.u);
        const v = clamp(Number(p.v), 0, 1);
        const lon = u * 360 - 180;
        const lat = 90 - v * 180;
        const vector = lonLatToVector(lon, lat);

        return {
          ...vector,
          lon,
          lat,
          u,
          v
        };
      }
    }

    if (args.length >= 3) {
      const vector = normalize3({ x: args[0], y: args[1], z: args[2] });
      const ll = vectorToLonLat(vector);

      return {
        ...vector,
        lon: ll.lon,
        lat: ll.lat,
        u: lonToU(ll.lon),
        v: latToV(ll.lat)
      };
    }

    if (args.length >= 2) {
      const lon = Number(args[0]);
      const lat = Number(args[1]);
      const vector = lonLatToVector(lon, lat);

      return {
        ...vector,
        lon,
        lat,
        u: lonToU(lon),
        v: latToV(lat)
      };
    }

    const vector = lonLatToVector(0, 0);

    return {
      ...vector,
      lon: 0,
      lat: 0,
      u: ANCHOR.u,
      v: ANCHOR.v
    };
  }

  function hashNoise(x, y, z, salt = 0) {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + salt * 41.31) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(p, salt = 0) {
    const n1 = hashNoise(p.x, p.y, p.z, salt);
    const n2 = hashNoise(p.y + n1, p.z - n1, p.x + n1, salt + 9);
    const n3 = hashNoise(p.z - n2, p.x + n2, p.y - n2, salt + 23);
    return clamp01(n1 * 0.52 + n2 * 0.31 + n3 * 0.17);
  }

  function getTectonicsApi() {
    return (
      root.HEARTH_TECTONICS ||
      root.HearthTectonics ||
      (root.HEARTH && root.HEARTH.tectonics) ||
      null
    );
  }

  function fallbackTectonics(p) {
    const oldBody = valueNoise(p, 701);
    const folded = valueNoise({ x: p.y, y: p.z, z: p.x }, 709);
    const cut = valueNoise({ x: p.z, y: p.x, z: p.y }, 719);
    const latAbs = Math.abs(p.lat) / 90;
    const equatorialMass = clamp01(1 - latAbs * 0.58);

    const continentalMassPressure = clamp01(oldBody * 0.46 + equatorialMass * 0.28 + folded * 0.16);
    const oceanBasinPressure = clamp01((1 - continentalMassPressure) * 0.58 + cut * 0.22);
    const ridgeCollisionPressure = clamp01(folded * 0.34 + continentalMassPressure * 0.18);
    const plateauUpliftPressure = clamp01(continentalMassPressure * 0.42 + oldBody * 0.18);
    const basinSinkPressure = clamp01(oceanBasinPressure * 0.52 + cut * 0.12);
    const fractureCutPressure = clamp01(cut * 0.46 + folded * 0.18);
    const shelfCutPressure = clamp01(softBand(continentalMassPressure - oceanBasinPressure, 0, 0.26));
    const coastBoundaryMemory = clamp01(shelfCutPressure * 0.5 + cut * 0.12);
    const archipelagoFracturePressure = clamp01(fractureCutPressure * shelfCutPressure);

    return {
      contract: "HEARTH_ELEVATION_INTERNAL_FALLBACK_TECTONICS",
      receipt: "HEARTH_ELEVATION_INTERNAL_FALLBACK_TECTONICS_RECEIPT",
      u: p.u,
      v: p.v,
      lat: p.lat * DEG,
      lon: p.lon * DEG,
      latDeg: p.lat,
      lonDeg: p.lon,

      depth: clamp01(0.34 + oldBody * 0.22 + continentalMassPressure * 0.12),
      subsurfacePressure: clamp01(continentalMassPressure * 0.32 + ridgeCollisionPressure * 0.18),
      plateStress: clamp01(folded * 0.38 + fractureCutPressure * 0.18),
      crustalCompression: clamp01(continentalMassPressure * 0.46 + ridgeCollisionPressure * 0.18),
      ridgePressure: ridgeCollisionPressure,
      basinPressure: basinSinkPressure,
      scarPressure: fractureCutPressure,
      ancientChannelCut: cut * 0.42,
      shelfCutPressure,
      buriedStructure: clamp01(continentalMassPressure * 0.32 + fractureCutPressure * 0.18 + shelfCutPressure * 0.12),
      elevationInfluence: clamp01(0.5 + continentalMassPressure * 0.28 + ridgeCollisionPressure * 0.18 - oceanBasinPressure * 0.24 - basinSinkPressure * 0.14),

      crustalProvincePressure: continentalMassPressure,
      crustalProvinceId: "fallback_crustal_pressure",
      crustalProvinceLabel: "Fallback Crustal Pressure",
      continentalMassPressure,
      oceanBasinPressure,
      oceanBasinId: "fallback_ocean_basin_pressure",
      oceanBasinLabel: "Fallback Ocean Basin Pressure",
      coastBoundaryMemory,
      ridgeCollisionPressure,
      ridgeCollisionId: "fallback_ridge_collision_pressure",
      ridgeCollisionLabel: "Fallback Ridge Collision Pressure",
      plateauUpliftPressure,
      basinSinkPressure,
      fractureCutPressure,
      escarpmentPressure: clamp01(ridgeCollisionPressure * 0.24 + fractureCutPressure * 0.28 + coastBoundaryMemory * 0.18),
      archipelagoFracturePressure,
      summitPressure: 0,
      summitPressureId: "none",
      summitPressureLabel: "None",

      tectonicClass: "fallback-pre-terrain-body",
      structuralClass: "fallback-stable-pre-terrain-cause",
      dominantStructuralCause: "fallback-buried-cause",
      structuralCauseAuthorityLoaded: false
    };
  }

  function sampleTectonicsFor(p) {
    const api = getTectonicsApi();

    if (api && typeof api.sampleTectonics === "function") {
      try {
        const tectonics = api.sampleTectonics(p.u, p.v);

        if (tectonics && Number.isFinite(Number(tectonics.elevationInfluence))) {
          return {
            tectonics,
            consumed: tectonics.contract === REQUIRED_TECTONICS_CONTRACT,
            available: true
          };
        }
      } catch (error) {
        return {
          tectonics: fallbackTectonics(p),
          consumed: false,
          available: false,
          error: error && error.message ? error.message : String(error)
        };
      }
    }

    if (api && typeof api.sample === "function") {
      try {
        const tectonics = api.sample(p.u, p.v);

        if (tectonics && Number.isFinite(Number(tectonics.elevationInfluence))) {
          return {
            tectonics,
            consumed: tectonics.contract === REQUIRED_TECTONICS_CONTRACT,
            available: true
          };
        }
      } catch (error) {
        return {
          tectonics: fallbackTectonics(p),
          consumed: false,
          available: false,
          error: error && error.message ? error.message : String(error)
        };
      }
    }

    return {
      tectonics: fallbackTectonics(p),
      consumed: false,
      available: false
    };
  }

  function strongestSeat(seats, p, pressureFn) {
    let best = null;
    let bestPressure = 0;

    seats.forEach((seat) => {
      const distanceDeg = angularDistanceDeg(p, seat.vector);
      const pressure = pressureFn(seat, distanceDeg);

      if (pressure > bestPressure) {
        bestPressure = pressure;
        best = {
          ...seat,
          distanceDeg,
          pressure
        };
      }
    });

    return best || {
      id: "none",
      name: "None",
      label: "None",
      pressure: 0,
      distanceDeg: 180,
      news: "CENTER",
      fibonacci: "F0"
    };
  }

  function resolveCoordinatePressures(p, tectonics) {
    const body = strongestSeat(BODY_SEATS, p, (seat, distanceDeg) => {
      const base = seatPressure(distanceDeg, seat.radiusDeg, seat.innerDeg);
      const noise = valueNoise({
        x: p.x + seat.index * 0.07,
        y: p.y - seat.index * 0.05,
        z: p.z + seat.index * 0.03
      }, 900 + seat.index);

      return clamp01(base * (0.88 + noise * 0.12));
    });

    const ocean = strongestSeat(OCEAN_BASIN_SEATS, p, (seat, distanceDeg) => {
      return seatPressure(distanceDeg, seat.radiusDeg, Math.max(6, seat.radiusDeg * 0.26));
    });

    const summit = strongestSeat(SUMMIT_SEATS, p, (seat, distanceDeg) => {
      return seatPressure(distanceDeg, seat.radiusDeg, Math.max(3, seat.radiusDeg * 0.32));
    });

    const channel = strongestSeat(CHANNEL_SEATS, p, (seat, distanceDeg) => {
      return seatPressure(distanceDeg, seat.radiusDeg, Math.max(4, seat.radiusDeg * 0.24));
    });

    const bodySeat = BODY_SEATS.find((seat) => seat.id === body.id) || null;
    const bodyDistance = Number.isFinite(body.distanceDeg) ? body.distanceDeg : 180;
    const bodyInteriorPressure = bodySeat ? seatPressure(bodyDistance, bodySeat.innerDeg, Math.max(1, bodySeat.innerDeg * 0.36)) : 0;
    const bodyEdgePressure = bodySeat ? edgePressureFor(bodyDistance, bodySeat.innerDeg, bodySeat.edgeDeg) : 0;
    const bodyBreadthPressure = clamp01(body.pressure * (bodySeat ? bodySeat.breadth : 0));
    const bodyRoughnessPressure = clamp01(body.pressure * (bodySeat ? bodySeat.roughness : 0));

    const oceanPressure = clamp01(ocean.pressure);
    const oceanDepthPressure = clamp01(ocean.pressure * (ocean.depth || 0));
    const channelCutPressure = clamp01(channel.pressure * (channel.cut || 0));
    const summitCoordinatePressure = clamp01(summit.pressure);
    const summitCoordinateUplift = clamp01(summit.pressure * (summit.uplift || 0));

    const tectonicContinent = clamp01(tectonics.continentalMassPressure || 0);
    const tectonicOcean = clamp01(tectonics.oceanBasinPressure || 0);
    const tectonicRidge = clamp01(tectonics.ridgeCollisionPressure || tectonics.ridgePressure || 0);
    const tectonicFracture = clamp01(tectonics.fractureCutPressure || tectonics.scarPressure || 0);

    const coordinateLandPressure = clamp01(
      body.pressure * 0.58 +
      bodyBreadthPressure * 0.18 +
      tectonicContinent * 0.16 +
      summitCoordinatePressure * 0.08
    );

    const coordinateWaterPressure = clamp01(
      oceanPressure * 0.46 +
      oceanDepthPressure * 0.28 +
      channelCutPressure * 0.16 +
      tectonicOcean * 0.10
    );

    const coordinateShelfPressure = clamp01(
      bodyEdgePressure * 0.36 +
      oceanPressure * 0.24 +
      channelCutPressure * 0.14 +
      softBand(body.pressure - oceanPressure, 0.0, 0.36) * 0.26
    );

    const coordinateRidgePressure = clamp01(
      bodyRoughnessPressure * 0.34 +
      summitCoordinatePressure * 0.24 +
      tectonicRidge * 0.28 +
      bodyEdgePressure * 0.14
    );

    const coordinateFracturePressure = clamp01(
      channelCutPressure * 0.42 +
      tectonicFracture * 0.28 +
      bodyEdgePressure * 0.16 +
      oceanPressure * 0.14
    );

    return {
      coordinateResolverActive: true,
      coordinateMapRole: "ELEVATION_BODY_SEAT_RESOLVER",
      coordinateMapIsTectonicOrigin: false,

      bodySeatId: body.id || "none",
      bodySeatName: body.name || "None",
      bodySeatIndex: Number.isFinite(Number(body.index)) ? Number(body.index) : -1,
      bodySeatPressureId: body.pressureId || "",
      bodySeatNews: body.news || "CENTER",
      bodySeatFibonacci: body.fibonacci || "F0",
      bodySeatDistanceDeg: Number(bodyDistance.toFixed(3)),
      bodySeatPressure: clamp01(body.pressure),
      bodyInteriorPressure,
      bodyEdgePressure,
      bodyBreadthPressure,
      bodyRoughnessPressure,
      bodyCoordinateClass: body.continentClass || "none",

      oceanSeatId: ocean.id || "none",
      oceanSeatName: ocean.name || "None",
      oceanSeatNews: ocean.news || "CENTER",
      oceanSeatFibonacci: ocean.fibonacci || "F0",
      oceanSeatPressure: oceanPressure,
      oceanDepthPressure,

      channelSeatId: channel.id || "none",
      channelSeatNews: channel.news || "CENTER",
      channelSeatFibonacci: channel.fibonacci || "F0",
      channelSeatPressure: clamp01(channel.pressure),
      channelCutPressure,

      summitSeatId: summit.id || "none",
      summitSeatPressureId: summit.pressureId || "none",
      summitSeatLabel: summit.label || "None",
      summitSeatTerrain: summit.terrain || "none",
      summitBookSummit: summit.bookSummit || "none",
      summitSeatNews: summit.news || "CENTER",
      summitSeatFibonacci: summit.fibonacci || "F0",
      summitCoordinatePressure,
      summitCoordinateUplift,

      coordinateLandPressure,
      coordinateWaterPressure,
      coordinateShelfPressure,
      coordinateRidgePressure,
      coordinateFracturePressure
    };
  }

  function provinceCompatibility(tectonics, coordinates, isDeepWater) {
    if (isDeepWater && Number(tectonics.oceanBasinPressure || 0) > 0.56 && coordinates.coordinateWaterPressure > coordinates.coordinateLandPressure) {
      return {
        id: "open_ocean",
        name: "Open Ocean",
        index: -1
      };
    }

    if (coordinates.bodySeatId && coordinates.bodySeatId !== "none" && coordinates.bodySeatPressure > 0.12) {
      return {
        id: coordinates.bodySeatId,
        name: coordinates.bodySeatName,
        index: coordinates.bodySeatIndex
      };
    }

    return (
      PROVINCE_COMPATIBILITY[tectonics.crustalProvinceId] ||
      {
        id: "unresolved_crustal_province",
        name: "Unresolved Crustal Province",
        index: -1
      }
    );
  }

  function summitCompatibility(tectonics, coordinates) {
    const coordinateActive = coordinates.summitCoordinatePressure > 0.16;

    if (coordinateActive) {
      return {
        summitRegionHint: coordinates.summitSeatId,
        summitRegionLabel: coordinates.summitSeatLabel,
        summitTerrainHint: coordinates.summitSeatTerrain,
        summitBookSummit: coordinates.summitBookSummit,
        summitPotential: clamp01(coordinates.summitCoordinatePressure),
        summitNews: coordinates.summitSeatNews,
        summitFibonacci: coordinates.summitSeatFibonacci
      };
    }

    const item = SUMMIT_COMPATIBILITY[tectonics.summitPressureId];

    if (!item || Number(tectonics.summitPressure || 0) < 0.16) {
      return {
        summitRegionHint: "none",
        summitRegionLabel: "None",
        summitTerrainHint: "none",
        summitBookSummit: "none",
        summitPotential: 0,
        summitNews: "CENTER",
        summitFibonacci: "F0"
      };
    }

    return {
      summitRegionHint: item.region,
      summitRegionLabel: item.label,
      summitTerrainHint: item.terrain,
      summitBookSummit: item.bookSummit || "none",
      summitPotential: clamp01(tectonics.summitPressure || 0),
      summitNews: "CENTER",
      summitFibonacci: "F0"
    };
  }

  function climateCompatibility(p, elevation, fields) {
    const absLat = Math.abs(p.lat);
    const latitudeCold = clamp01(absLat / 90);
    const equatorHeat = clamp01(1 - latitudeCold);

    const water = elevation <= SEA_LEVEL ? 1 : 0;
    const high = clamp01((elevation - 0.18) / 0.62);
    const coast = fields.coastPotential;
    const ridge = fields.ridgePotential;
    const basin = fields.basinPotential;
    const shelf = fields.shelfPotential;
    const archipelago = fields.archipelagoPotential;

    const influences = {
      polar_icefield: clamp01(smoothstep(58, 78, absLat) * (0.54 + high * 0.22)),
      tundra_subpolar: clamp01(softBand(absLat, 56, 18) * (0.36 + high * 0.18)),
      temperate_highland: clamp01(softBand(absLat, 34, 26) * (0.34 + high * 0.38 + ridge * 0.16)),
      temperate_coastal_storm: clamp01(softBand(absLat, 38, 28) * coast * (0.44 + shelf * 0.24)),
      tropical_rainforest_wet_basin: clamp01(equatorHeat * (0.24 + basin * 0.38 + coast * 0.18)),
      monsoon_floodplain: clamp01(softBand(absLat, 18, 18) * (basin * 0.32 + coast * 0.24)),
      arid_desert_dry_plateau: clamp01(softBand(absLat, 24, 20) * (fields.plateauPotential * 0.38 + (1 - coast) * 0.18)),
      alpine_mountain_arc: clamp01((ridge * 0.64 + high * 0.32) * (0.38 + fields.landPotential * 0.5)),
      maritime_archipelago_subtropical_shelf: clamp01((archipelago * 0.54 + shelf * 0.32 + coast * 0.18) * (0.32 + softBand(absLat, 24, 26) * 0.44))
    };

    if (water && fields.waterDepthPotential > 0.54 && shelf < 0.42) {
      return {
        climateHint: "open_ocean",
        climatePotential: fields.waterDepthPotential,
        climateInfluences: influences
      };
    }

    let climateHint = "temperate_highland";
    let climatePotential = -1;

    Object.keys(influences).forEach((key) => {
      if (influences[key] > climatePotential) {
        climateHint = key;
        climatePotential = influences[key];
      }
    });

    return {
      climateHint,
      climatePotential: clamp01(climatePotential),
      climateInfluences: influences
    };
  }

  function terrainClassHintFor(sample) {
    if (sample.elevation <= -0.42 || sample.oceanBasinPotential > 0.68) return "ocean_basin";
    if (sample.elevation <= -0.20) return "deep_ocean";
    if (sample.archipelagoPotential > 0.42 && sample.elevation <= SEA_LEVEL) return "archipelago_shelf";
    if (sample.shelfPotential > 0.44 && sample.elevation <= SEA_LEVEL) return "continental_shelf";
    if (sample.elevation <= SEA_LEVEL) return "shallow_water";
    if (sample.waterfallCandidate > 0.56) return "waterfall_escarpment";
    if (sample.escarpmentPotential > 0.56) return "cliff_escarpment";
    if (sample.canyonPotential > 0.52) return "canyon_corridor";
    if (sample.summitPotential > 0.58) return "summit_region";
    if (sample.mountainArcPotential > 0.56) return "mountain_arc";
    if (sample.plateauPotential > 0.54) return "plateau_interior";
    if (sample.basinPotential > 0.50) return "basin_floor";
    if (sample.coastPotential > 0.56) return "coast_edge";
    if (sample.archipelagoPotential > 0.42) return "island_arc";
    if (sample.bodyInteriorPressure > 0.62) return "continent_interior";
    if (sample.bodyEdgePressure > 0.46) return "continent_edge";
    return "continent_mass";
  }

  function isAnchorCoordinate(p) {
    return (
      Math.abs(p.u - ANCHOR.u) < 0.000001 &&
      Math.abs(p.v - ANCHOR.v) < 0.000001
    );
  }

  function sample(...args) {
    const p = parseInput(...args);
    const tectonicResult = sampleTectonicsFor(p);
    const tectonics = tectonicResult.tectonics;
    const coordinates = resolveCoordinatePressures(p, tectonics);

    const structuralNoise = valueNoise(p, 811);
    const surfaceNoise = valueNoise({ x: p.y, y: p.z, z: p.x }, 823);
    const cutNoise = valueNoise({ x: p.z, y: p.x, z: p.y }, 839);

    const continentalMassPressure = clamp01(
      (tectonics.continentalMassPressure || 0) * 0.58 +
      coordinates.coordinateLandPressure * 0.42
    );

    const oceanBasinPressure = clamp01(
      (tectonics.oceanBasinPressure || 0) * 0.52 +
      coordinates.coordinateWaterPressure * 0.48
    );

    const ridgeCollisionPressure = clamp01(
      (tectonics.ridgeCollisionPressure || tectonics.ridgePressure || 0) * 0.62 +
      coordinates.coordinateRidgePressure * 0.38
    );

    const plateauUpliftPressure = clamp01(
      (tectonics.plateauUpliftPressure || 0) * 0.68 +
      coordinates.bodyInteriorPressure * 0.20 +
      coordinates.summitCoordinateUplift * 0.12
    );

    const basinSinkPressure = clamp01(
      (tectonics.basinSinkPressure || tectonics.basinPressure || 0) * 0.56 +
      coordinates.oceanDepthPressure * 0.30 +
      coordinates.channelCutPressure * 0.14
    );

    const fractureCutPressure = clamp01(
      (tectonics.fractureCutPressure || tectonics.scarPressure || 0) * 0.54 +
      coordinates.coordinateFracturePressure * 0.46
    );

    const escarpmentPressure = clamp01(
      (tectonics.escarpmentPressure || 0) * 0.58 +
      coordinates.bodyEdgePressure * 0.24 +
      coordinates.coordinateRidgePressure * 0.18
    );

    const archipelagoFracturePressure = clamp01(
      (tectonics.archipelagoFracturePressure || 0) * 0.52 +
      (coordinates.bodySeatId === "broken_archipelago" ? coordinates.bodySeatPressure * 0.32 : 0) +
      coordinates.channelCutPressure * 0.16
    );

    const summitPressure = clamp01(
      (tectonics.summitPressure || 0) * 0.46 +
      coordinates.summitCoordinatePressure * 0.54
    );

    const coastBoundaryMemory = clamp01(
      (tectonics.coastBoundaryMemory || 0) * 0.46 +
      coordinates.coordinateShelfPressure * 0.34 +
      coordinates.bodyEdgePressure * 0.20
    );

    const shelfCutPressure = clamp01(
      (tectonics.shelfCutPressure || 0) * 0.48 +
      coordinates.coordinateShelfPressure * 0.52
    );

    const ancientChannelCut = clamp01(
      (tectonics.ancientChannelCut || 0) * 0.58 +
      coordinates.channelCutPressure * 0.42
    );

    const buriedStructure = clamp01(
      (tectonics.buriedStructure || 0) * 0.62 +
      coordinates.bodyBreadthPressure * 0.24 +
      coordinates.bodyInteriorPressure * 0.14
    );

    const elevationInfluence = clamp01(
      (tectonics.elevationInfluence || 0.5) * 0.50 +
      coordinates.coordinateLandPressure * 0.30 -
      coordinates.coordinateWaterPressure * 0.20 +
      0.10
    );

    let elevation =
      -0.32 +
      elevationInfluence * 0.42 +
      continentalMassPressure * 0.46 +
      coordinates.bodyBreadthPressure * 0.20 +
      coordinates.bodyInteriorPressure * 0.14 +
      ridgeCollisionPressure * 0.25 +
      plateauUpliftPressure * 0.22 +
      buriedStructure * 0.10 +
      summitPressure * 0.11 -
      oceanBasinPressure * 0.60 -
      basinSinkPressure * 0.34 -
      coordinates.oceanDepthPressure * 0.18 -
      ancientChannelCut * 0.12 -
      shelfCutPressure * 0.08 -
      fractureCutPressure * 0.06 +
      (structuralNoise - 0.5) * 0.050 +
      (surfaceNoise - 0.5) * 0.032;

    elevation = clamp(elevation, -1, 1);

    const isLand = elevation > SEA_LEVEL;
    const isWater = !isLand;
    const isShallowWater = elevation <= SEA_LEVEL && elevation > -0.20;
    const isDeepWater = elevation <= -0.20;

    const landPotential = clamp01(
      smoothstep(-0.08, 0.20, elevation) * 0.56 +
      continentalMassPressure * 0.22 +
      coordinates.coordinateLandPressure * 0.18 +
      plateauUpliftPressure * 0.04
    );

    const waterDepthPotential = isWater
      ? clamp01(Math.max(-elevation / 0.72, oceanBasinPressure * 0.64 + basinSinkPressure * 0.22 + coordinates.oceanDepthPressure * 0.14))
      : 0;

    const oceanBasinPotential = oceanBasinPressure;
    const shelfPotential = clamp01(shelfCutPressure * 0.40 + coastBoundaryMemory * 0.30 + softBand(elevation, -0.035, 0.18) * 0.24 + coordinates.coordinateShelfPressure * 0.06);
    const continentShelfPotential = shelfPotential;
    const coastPotential = clamp01(coastBoundaryMemory * 0.34 + shelfCutPressure * 0.26 + softBand(elevation, SEA_LEVEL, 0.135) * 0.30 + coordinates.bodyEdgePressure * 0.10);

    const mountainArcPotential = ridgeCollisionPressure;
    const plateauPotential = plateauUpliftPressure;
    const canyonPotential = clamp01(fractureCutPressure * 0.44 + ancientChannelCut * 0.34 + cutNoise * 0.10 + coordinates.channelCutPressure * 0.12);
    const escarpmentPotential = clamp01(escarpmentPressure * 0.58 + coastPotential * 0.14 + ridgeCollisionPressure * 0.12 + fractureCutPressure * 0.10 + coordinates.bodyEdgePressure * 0.06);
    const waterfallCandidate = clamp01(escarpmentPotential * (coastPotential * 0.28 + basinSinkPressure * 0.18 + ridgeCollisionPressure * 0.16 + ancientChannelCut * 0.14));
    const archipelagoPotential = archipelagoFracturePressure;
    const basinPotential = basinSinkPressure;
    const ridgePotential = ridgeCollisionPressure;
    const saddlePotential = clamp01((1 - Math.abs(continentalMassPressure - oceanBasinPressure)) * 0.28 + fractureCutPressure * 0.18 + shelfPotential * 0.16);
    const islandPotential = clamp01(archipelagoPotential * 0.64 + shelfPotential * 0.2 + coastPotential * 0.16);
    const scarPotential = clamp01(fractureCutPressure * 0.38 + ancientChannelCut * 0.32 + buriedStructure * 0.14);

    const province = provinceCompatibility(tectonics, coordinates, isDeepWater);
    const summit = summitCompatibility(tectonics, coordinates);

    const physicalFields = {
      landPotential,
      waterDepthPotential,
      coastPotential,
      ridgePotential,
      basinPotential,
      shelfPotential,
      plateauPotential,
      archipelagoPotential
    };

    const climate = climateCompatibility(p, elevation, physicalFields);

    const continentPotential = continentalMassPressure;
    const nearestContinentDistance = clamp01(1 - continentPotential);
    const continentSeparation = clamp01(shelfPotential * 0.42 + fractureCutPressure * 0.18 + coastBoundaryMemory * 0.18);

    const output = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      requiredTectonicsContract: REQUIRED_TECTONICS_CONTRACT,
      version: VERSION,
      authority: "elevation-resolver",

      x: p.x,
      y: p.y,
      z: p.z,
      lon: p.lon,
      lat: p.lat,
      u: p.u,
      v: p.v,
      anchorId: isAnchorCoordinate(p) ? ANCHOR.id : "",

      elevation,
      seaLevel: SEA_LEVEL,

      isLand,
      isWater,
      isShallowWater,
      isDeepWater,

      landPotential,
      waterDepthPotential,
      oceanBasinPotential,
      continentShelfPotential,
      shelfPotential,
      coastPotential,

      continentId: province.id,
      continentName: province.name,
      continentIndex: province.index,
      continentPotential,
      continentSeparation,
      nearestContinentDistance,

      newsProtocolActive: true,
      fibonacciAlignmentActive: true,
      coordinateBodyResolverActive: true,
      coordinateMapRole: coordinates.coordinateMapRole,
      coordinateMapIsTectonicOrigin: false,

      bodySeatId: coordinates.bodySeatId,
      bodySeatName: coordinates.bodySeatName,
      bodySeatIndex: coordinates.bodySeatIndex,
      bodySeatPressureId: coordinates.bodySeatPressureId,
      bodySeatNews: coordinates.bodySeatNews,
      bodySeatFibonacci: coordinates.bodySeatFibonacci,
      bodySeatDistanceDeg: coordinates.bodySeatDistanceDeg,
      bodySeatPressure: coordinates.bodySeatPressure,
      bodyInteriorPressure: coordinates.bodyInteriorPressure,
      bodyEdgePressure: coordinates.bodyEdgePressure,
      bodyBreadthPressure: coordinates.bodyBreadthPressure,
      bodyRoughnessPressure: coordinates.bodyRoughnessPressure,
      bodyCoordinateClass: coordinates.bodyCoordinateClass,

      oceanSeatId: coordinates.oceanSeatId,
      oceanSeatName: coordinates.oceanSeatName,
      oceanSeatNews: coordinates.oceanSeatNews,
      oceanSeatFibonacci: coordinates.oceanSeatFibonacci,
      oceanSeatPressure: coordinates.oceanSeatPressure,
      oceanDepthPressure: coordinates.oceanDepthPressure,

      channelSeatId: coordinates.channelSeatId,
      channelSeatNews: coordinates.channelSeatNews,
      channelSeatFibonacci: coordinates.channelSeatFibonacci,
      channelSeatPressure: coordinates.channelSeatPressure,
      channelCutPressure: coordinates.channelCutPressure,

      climateHint: climate.climateHint,
      climatePotential: climate.climatePotential,
      climateInfluences: climate.climateInfluences,
      climateCompatibilityHintOnly: true,
      ownsClimate: false,

      polarInfluence: climate.climateInfluences.polar_icefield,
      tundraInfluence: climate.climateInfluences.tundra_subpolar,
      temperateInfluence: Math.max(climate.climateInfluences.temperate_highland, climate.climateInfluences.temperate_coastal_storm),
      stormCoastInfluence: climate.climateInfluences.temperate_coastal_storm,
      rainforestInfluence: climate.climateInfluences.tropical_rainforest_wet_basin,
      monsoonInfluence: climate.climateInfluences.monsoon_floodplain,
      desertInfluence: climate.climateInfluences.arid_desert_dry_plateau,
      alpineInfluence: climate.climateInfluences.alpine_mountain_arc,
      maritimeInfluence: climate.climateInfluences.maritime_archipelago_subtropical_shelf,

      summitRegionHint: summit.summitRegionHint,
      summitRegionLabel: summit.summitRegionLabel,
      summitTerrainHint: summit.summitTerrainHint,
      summitBookSummit: summit.summitBookSummit,
      summitPotential: summit.summitPotential,
      summitNews: summit.summitNews,
      summitFibonacci: summit.summitFibonacci,

      mountainArcPotential,
      plateauPotential,
      canyonPotential,
      escarpmentPotential,
      waterfallCandidate,
      archipelagoPotential,
      basinPotential,
      ridgePotential,
      saddlePotential,
      islandPotential,
      scarPotential,

      corePotential: continentPotential,
      shieldPotential: clamp01(continentalMassPressure * 0.52 + plateauUpliftPressure * 0.28 + buriedStructure * 0.16),
      bridgePotential: clamp01(continentSeparation * 0.22 + scarPotential * 0.22 + coastBoundaryMemory * 0.12),

      dominantCoreId: province.id,

      tectonicsAvailable: tectonicResult.available,
      tectonicsConsumed: tectonicResult.consumed,
      tectonicsContract: tectonics.contract || "",
      tectonicsReceipt: tectonics.receipt || "",
      tectonicsStructuralClass: tectonics.structuralClass || "",
      tectonicsDominantStructuralCause: tectonics.dominantStructuralCause || "",
      elevationResolvedFromTectonics: tectonicResult.consumed === true,

      tectonicElevationInfluence: elevationInfluence,
      tectonicDepth: clamp01(tectonics.depth || 0),
      tectonicSubsurfacePressure: clamp01(tectonics.subsurfacePressure || 0),
      tectonicPlateStress: clamp01(tectonics.plateStress || 0),
      tectonicCrustalCompression: clamp01(tectonics.crustalCompression || 0),
      tectonicRidgePressure: clamp01(tectonics.ridgePressure || ridgeCollisionPressure),
      tectonicBasinPressure: clamp01(tectonics.basinPressure || basinSinkPressure),
      tectonicScarPressure: clamp01(tectonics.scarPressure || fractureCutPressure),
      tectonicAncientChannelCut: ancientChannelCut,
      tectonicShelfCutPressure: shelfCutPressure,
      tectonicBuriedStructure: buriedStructure,

      crustalProvincePressure: clamp01(tectonics.crustalProvincePressure || continentalMassPressure),
      crustalProvinceId: tectonics.crustalProvinceId || coordinates.bodySeatPressureId || "",
      crustalProvinceLabel: tectonics.crustalProvinceLabel || coordinates.bodySeatName || "",
      continentalMassPressure,
      oceanBasinPressure,
      oceanBasinId: tectonics.oceanBasinId || coordinates.oceanSeatId || "",
      oceanBasinLabel: tectonics.oceanBasinLabel || coordinates.oceanSeatName || "",
      coastBoundaryMemory,
      ridgeCollisionPressure,
      ridgeCollisionId: tectonics.ridgeCollisionId || "",
      ridgeCollisionLabel: tectonics.ridgeCollisionLabel || "",
      plateauUpliftPressure,
      basinSinkPressure,
      fractureCutPressure,
      escarpmentPressure,
      archipelagoFracturePressure,
      tectonicSummitPressure: summitPressure,
      tectonicSummitPressureId: tectonics.summitPressureId || coordinates.summitSeatPressureId || "none",
      tectonicSummitPressureLabel: tectonics.summitPressureLabel || coordinates.summitSeatLabel || "None",

      ownsTectonicCause: false,
      ownsComposition: false,
      ownsHydrology: false,
      ownsMaterialRendering: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    output.terrainClassHint = terrainClassHintFor(output);

    if (tectonicResult.error) {
      output.tectonicsError = tectonicResult.error;
    }

    return output;
  }

  const read = (...args) => sample(...args);
  const getElevation = (...args) => sample(...args);
  const sampleElevation = (...args) => sample(...args);
  const readElevation = (...args) => sample(...args);
  const sampleAnchor = () => sample({ u: ANCHOR.u, v: ANCHOR.v });

  function getCoordinateRegistry() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      coordinateMapRole: "ELEVATION_BODY_SEAT_RESOLVER",
      coordinateMapIsTectonicOrigin: false,
      newsProtocol: NEWS_PROTOCOL,
      bodySeats: BODY_SEATS.map(({ vector, ...seat }) => ({ ...seat })),
      oceanBasinSeats: OCEAN_BASIN_SEATS.map(({ vector, ...seat }) => ({ ...seat })),
      summitSeats: SUMMIT_SEATS.map(({ vector, ...seat }) => ({ ...seat })),
      channelSeats: CHANNEL_SEATS.map(({ vector, ...seat }) => ({ ...seat }))
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      requiredTectonicsContract: REQUIRED_TECTONICS_CONTRACT,
      version: VERSION,
      authority: "elevation-resolver",
      status: "active",
      destinationFile: "/assets/hearth/hearth.elevation.js",
      anchor: ANCHOR,
      purpose: "consume-structural-cause-tectonics-and-resolve-news-fibonacci-coordinate-height-depth",
      tectonicsSeated: true,
      tectonicsConsumedAtSampleTime: true,
      elevationResolvedFromTectonics: true,
      causeLayerOwnedByTectonics: true,
      elevationOwnsStructuralCause: false,
      coordinateBodyResolverActive: true,
      coordinateMapRole: "ELEVATION_BODY_SEAT_RESOLVER",
      coordinateMapIsTectonicOrigin: false,
      newsProtocolActive: true,
      fibonacciAlignmentActive: true,
      bodySeatCount: BODY_SEATS.length,
      oceanBasinSeatCount: OCEAN_BASIN_SEATS.length,
      summitSeatCount: SUMMIT_SEATS.length,
      channelSeatCount: CHANNEL_SEATS.length,
      climateCompatibilityHintOnly: true,
      ownsClimate: false,
      exposedFields: [
        "elevation",
        "seaLevel",
        "isLand",
        "isWater",
        "isShallowWater",
        "isDeepWater",
        "landPotential",
        "waterDepthPotential",
        "oceanBasinPotential",
        "continentShelfPotential",
        "shelfPotential",
        "coastPotential",
        "continentId",
        "continentName",
        "continentIndex",
        "continentPotential",
        "continentSeparation",
        "nearestContinentDistance",
        "bodySeatId",
        "bodySeatName",
        "bodySeatNews",
        "bodySeatFibonacci",
        "bodySeatPressure",
        "bodyInteriorPressure",
        "bodyEdgePressure",
        "bodyBreadthPressure",
        "oceanSeatId",
        "oceanSeatPressure",
        "oceanDepthPressure",
        "channelSeatId",
        "channelCutPressure",
        "climateHint",
        "climatePotential",
        "climateInfluences",
        "summitRegionHint",
        "summitRegionLabel",
        "summitTerrainHint",
        "summitBookSummit",
        "summitPotential",
        "summitNews",
        "summitFibonacci",
        "mountainArcPotential",
        "plateauPotential",
        "canyonPotential",
        "escarpmentPotential",
        "waterfallCandidate",
        "archipelagoPotential",
        "basinPotential",
        "ridgePotential",
        "saddlePotential",
        "islandPotential",
        "scarPotential",
        "terrainClassHint",
        "dominantCoreId",
        "tectonicsConsumed",
        "tectonicsContract",
        "elevationResolvedFromTectonics"
      ],
      designRules: [
        "tectonics owns structural cause",
        "elevation resolves height and depth only",
        "coordinate seats stabilize body placement inside elevation",
        "NEWS protocol stores directional alignment metadata",
        "Fibonacci alignment stores deterministic sequence metadata",
        "land and water booleans are elevation consequences",
        "climate remains downstream and is not owned here",
        "materials remain downstream and are not owned here",
        "canvas remains downstream and is not owned here",
        "no final visual pass claim"
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
    previousContract: PREVIOUS_CONTRACT,
    requiredTectonicsContract: REQUIRED_TECTONICS_CONTRACT,
    version: VERSION,
    seaLevel: SEA_LEVEL,
    anchor: ANCHOR,

    sample,
    read,
    getElevation,
    sampleElevation,
    readElevation,
    sampleAnchor,
    getCoordinateRegistry,
    getReceipt,

    supportsTectonicsSeatedElevationResolver: true,
    supportsStructuralCauseConsumption: true,
    supportsHeightDepthResolution: true,
    supportsSevenProvinceCompatibility: true,
    supportsDownstreamCompatibilityFields: true,
    supportsNewsFibonacciCoordinateBodyResolver: true,
    supportsCoordinateBodySeats: true,
    supportsCoordinateOceanBasinSeats: true,
    supportsCoordinateSummitSeats: true,
    supportsCoordinateChannelSeats: true,

    supportsSevenContinentRealPlanetElevation: true,
    supportsNineClimateFamilies: false,
    supportsNonlinearSummitRegions: true,

    ownsTectonicCause: false,
    ownsClimate: false,
    ownsMaterialRendering: false,
    ownsCanvas: false,
    ownsRuntime: false,
    ownsControls: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.elevation = api;

  root.HEARTH_ELEVATION = api;
  root.HearthElevation = api;
  root.HEARTH_ELEVATION_RECEIPT = getReceipt();
  root.HEARTH_ELEVATION_CONTRACT = CONTRACT;
  root.HEARTH_ELEVATION_COORDINATE_REGISTRY = getCoordinateRegistry();
  root.HEARTH_ELEVATION_SUPPORTS_TECTONICS_SEATED_RESOLVER = true;
  root.HEARTH_ELEVATION_SUPPORTS_SEVEN_CONTINENT_REAL_PLANET = true;
  root.HEARTH_ELEVATION_SUPPORTS_NEWS_FIBONACCI_COORDINATE_BODY_RESOLVER = true;

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.hearthElevationAuthorityLoaded = "true";
    document.documentElement.dataset.hearthElevationContract = CONTRACT;
    document.documentElement.dataset.hearthElevationReceipt = RECEIPT;
    document.documentElement.dataset.hearthElevationPreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.hearthElevationRequiredTectonicsContract = REQUIRED_TECTONICS_CONTRACT;
    document.documentElement.dataset.hearthElevationTectonicsSeated = "true";
    document.documentElement.dataset.hearthElevationResolvedFromTectonics = "true";
    document.documentElement.dataset.hearthElevationCoordinateBodyResolverActive = "true";
    document.documentElement.dataset.hearthElevationCoordinateMapRole = "ELEVATION_BODY_SEAT_RESOLVER";
    document.documentElement.dataset.hearthElevationCoordinateMapIsTectonicOrigin = "false";
    document.documentElement.dataset.hearthElevationNewsProtocolActive = "true";
    document.documentElement.dataset.hearthElevationFibonacciAlignmentActive = "true";
    document.documentElement.dataset.hearthElevationBodySeatCount = String(BODY_SEATS.length);
    document.documentElement.dataset.hearthElevationOceanBasinSeatCount = String(OCEAN_BASIN_SEATS.length);
    document.documentElement.dataset.hearthElevationSummitSeatCount = String(SUMMIT_SEATS.length);
    document.documentElement.dataset.hearthElevationChannelSeatCount = String(CHANNEL_SEATS.length);
    document.documentElement.dataset.hearthElevationOwnsStructuralCause = "false";
    document.documentElement.dataset.hearthElevationOwnsClimate = "false";
    document.documentElement.dataset.hearthElevationClimateCompatibilityHintOnly = "true";
    document.documentElement.dataset.hearthElevationAnchor = ANCHOR.id;
    document.documentElement.dataset.hearthElevationAnchorU = String(ANCHOR.u);
    document.documentElement.dataset.hearthElevationAnchorV = String(ANCHOR.v);
    document.documentElement.dataset.hearthElevationAnchorLon = String(ANCHOR.lon);
    document.documentElement.dataset.hearthElevationAnchorLat = String(ANCHOR.lat);
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.webgl = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
