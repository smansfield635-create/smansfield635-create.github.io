// /assets/hearth/hearth.tectonics.js
// HEARTH_STRUCTURAL_CAUSE_TECTONICS_AUTHORITY_TNT_v2
// Full-file replacement.
// Structural-cause tectonics authority only.
// Produces numeric buried planetary cause fields for elevation/composition consumers.
// Tectonics owns cause. Elevation resolves height. Composition classifies body. Hydrology resolves water. Materials reveal surface. Canvas displays.
// No generated image. No GraphicBox. No WebGL. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_STRUCTURAL_CAUSE_TECTONICS_AUTHORITY_TNT_v2";
  const RECEIPT = "HEARTH_STRUCTURAL_CAUSE_TECTONICS_AUTHORITY_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_PRE_TERRAIN_DEPTH_TECTONICS_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-28.hearth-structural-cause-tectonics-authority-v2";

  const TWO_PI = Math.PI * 2;
  const HALF_PI = Math.PI / 2;
  const DEG = Math.PI / 180;
  const EPSILON = 0.000001;

  const ANCHOR = Object.freeze({
    id: "HEARTH_COORDINATE_ANCHOR_0_0",
    u: 0.5,
    v: 0.5,
    lonDeg: 0,
    latDeg: 0
  });

  function clamp(value, min = 0, max = 1) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
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

  function normalizeSampleInput(u, v) {
    return {
      u: wrap01(u),
      v: clamp(v, 0, 1)
    };
  }

  function lonRadFromU(u) {
    return wrap01(u) * TWO_PI - Math.PI;
  }

  function latRadFromV(v) {
    return HALF_PI - clamp(v, 0, 1) * Math.PI;
  }

  function lonDegFromU(u) {
    return wrap01(u) * 360 - 180;
  }

  function latDegFromV(v) {
    return 90 - clamp(v, 0, 1) * 180;
  }

  function vectorFromLatLonRad(lat, lon) {
    const cosLat = Math.cos(lat);
    return {
      x: cosLat * Math.cos(lon),
      y: Math.sin(lat),
      z: cosLat * Math.sin(lon)
    };
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

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function angularDistance(a, b) {
    return Math.acos(clamp(dot3(a, b), -1, 1));
  }

  function sphericalInfluence(point, item, radiusOverride) {
    const radius = Math.max(EPSILON, Number.isFinite(radiusOverride) ? radiusOverride : item.radius);
    const distance = angularDistance(point, item.vector);
    const t = 1 - clamp(distance / radius, 0, 1);
    return Math.pow(smoothstep(0, 1, t), item.falloff || 1);
  }

  function hash3(a, b, c) {
    let h = Math.imul((a | 0) ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul((b | 0) ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= Math.imul((c | 0) ^ 0x165667b1, 0x9e3779b1);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function noise(u, v, scale, seed) {
    const s = Math.max(1, Math.floor(scale));
    const x = wrap01(u) * s;
    const y = clamp(v, 0, 1) * s;

    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const xf = x - x0;
    const yf = y - y0;

    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    const ax0 = ((x0 % s) + s) % s;
    const ax1 = ((x1 % s) + s) % s;

    const n00 = hash3(ax0, y0, seed);
    const n10 = hash3(ax1, y0, seed);
    const n01 = hash3(ax0, y1, seed);
    const n11 = hash3(ax1, y1, seed);

    return lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sy);
  }

  function fbm(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u, v, scale, seed + i * 313) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(EPSILON, norm);
  }

  function point(latDeg, lonDeg, radius, weight, falloff = 1) {
    const lat = latDeg * DEG;
    const lon = lonDeg * DEG;

    return Object.freeze({
      latDeg,
      lonDeg,
      lat,
      lon,
      radius,
      weight,
      falloff,
      vector: vectorFromLatLonRad(lat, lon)
    });
  }

  function province(id, label, latDeg, lonDeg, radius, weight, falloff = 1.2) {
    return Object.freeze({
      id,
      label,
      ...point(latDeg, lonDeg, radius, weight, falloff)
    });
  }

  const CRUSTAL_PROVINCES = Object.freeze([
    province("western_shield_pressure", "Western Shield Crustal Province", 18, -118, 0.82, 0.96, 1.28),
    province("eastern_basin_pressure", "Eastern Basin Crustal Province", 6, 28, 0.78, 0.84, 1.18),
    province("northern_cold_pressure", "Northern Cold Crustal Province", 61, -38, 0.76, 0.82, 1.24),
    province("southern_harsh_pressure", "Southern Harsh Crustal Province", -45, 84, 0.78, 0.86, 1.26),
    province("equatorial_wet_pressure", "Equatorial Wet Crustal Province", -10, -34, 0.7, 0.78, 1.18),
    province("mountain_arc_pressure", "Mountain Arc Crustal Province", 21, 138, 0.72, 0.88, 1.34),
    province("broken_archipelago_pressure", "Broken Archipelago Crustal Province", -31, -164, 0.62, 0.68, 1.42)
  ]);

  const OCEAN_BASIN_SINKS = Object.freeze([
    province("deep_western_ocean_sink", "Deep Western Ocean Basin Sink", 2, -145, 0.62, 0.72, 1.55),
    province("central_ocean_sink", "Central Ocean Basin Sink", -12, -54, 0.68, 0.7, 1.48),
    province("northeast_ocean_sink", "Northeast Ocean Basin Sink", 28, 8, 0.72, 0.66, 1.52),
    province("south_central_ocean_sink", "South Central Ocean Basin Sink", -44, 54, 0.68, 0.62, 1.42),
    province("far_east_ocean_sink", "Far East Ocean Basin Sink", 14, 122, 0.66, 0.64, 1.5)
  ]);

  const RIDGE_COLLISION_ZONES = Object.freeze([
    province("northwest_collision_ridge", "Northwest Collision Ridge", 55, -92, 0.38, 0.82, 1.95),
    province("central_collision_ridge", "Central Collision Ridge", 12, -28, 0.36, 0.66, 1.76),
    province("south_collision_ridge", "South Collision Ridge", -31, 22, 0.42, 0.76, 1.88),
    province("east_collision_ridge", "East Collision Ridge", 38, 88, 0.38, 0.7, 1.84),
    province("far_east_collision_ridge", "Far East Collision Ridge", -18, 146, 0.4, 0.74, 1.86)
  ]);

  const SCAR_SYSTEMS = Object.freeze([
    province("polar_scar_system", "Polar Ancient Scar System", 61, -158, 0.34, 0.58, 2.05),
    province("western_scar_system", "Western Ancient Scar System", 26, -96, 0.32, 0.52, 1.9),
    province("central_scar_system", "Central Ancient Scar System", -5, -12, 0.38, 0.68, 1.95),
    province("southern_scar_system", "Southern Ancient Scar System", -36, 78, 0.34, 0.54, 1.92),
    province("far_east_scar_system", "Far East Ancient Scar System", 19, 171, 0.31, 0.48, 1.82)
  ]);

  const SUMMIT_PRESSURE_FIELDS = Object.freeze([
    province("summit_high_plateau_pressure", "High Plateau Summit Pressure", 21, -111, 0.32, 0.82, 2.0),
    province("summit_waterfall_escarpment_pressure", "Waterfall Escarpment Summit Pressure", -6, -20, 0.31, 0.78, 1.96),
    province("summit_canyon_crossing_pressure", "Canyon Crossing Summit Pressure", 13, 42, 0.31, 0.76, 1.94),
    province("summit_storm_coast_cliff_pressure", "Storm Coast Cliff Summit Pressure", 39, -72, 0.34, 0.78, 1.98),
    province("summit_glacial_pass_pressure", "Glacial Pass Summit Pressure", 66, -27, 0.3, 0.74, 1.92),
    province("summit_rainforest_basin_pressure", "Rainforest Basin Summit Pressure", -8, -45, 0.34, 0.76, 1.96),
    province("summit_mountain_arc_pressure", "Mountain Arc Summit Pressure", 24, 142, 0.34, 0.82, 2.0),
    province("summit_dry_plateau_pressure", "Dry Plateau Summit Pressure", -37, 82, 0.34, 0.78, 1.96),
    province("summit_archipelago_threshold_pressure", "Archipelago Threshold Summit Pressure", -30, -157, 0.36, 0.72, 1.9)
  ]);

  function weightedField(point3, list) {
    let total = 0;
    let weight = 0;

    list.forEach((item) => {
      const value = sphericalInfluence(point3, item) * item.weight;
      total += value;
      weight += Math.max(EPSILON, item.weight);
    });

    return clamp01(total / Math.max(EPSILON, weight));
  }

  function strongestField(point3, list) {
    let best = null;
    let second = null;

    list.forEach((item) => {
      const value = sphericalInfluence(point3, item) * item.weight;
      const record = {
        id: item.id,
        label: item.label,
        value: clamp01(value)
      };

      if (!best || record.value > best.value) {
        second = best;
        best = record;
      } else if (!second || record.value > second.value) {
        second = record;
      }
    });

    return {
      best: best || { id: "none", label: "None", value: 0 },
      second: second || { id: "none", label: "None", value: 0 }
    };
  }

  function seamArcPressure(u, v, phase, frequency, width, bend = 0.28) {
    const wave = Math.sin((u * frequency + phase) * TWO_PI);
    const latBend = Math.cos((v - 0.5) * Math.PI);
    const folded = Math.abs(wave * (1 - bend) + latBend * bend);
    return 1 - smoothstep(width, width + 0.34, folded);
  }

  function diagonalArcPressure(u, v, phase, frequency, width) {
    const diagonal = wrap01(u + v * 0.42 + phase);
    const wave = Math.sin(diagonal * TWO_PI * frequency);
    const counter = Math.sin((u - v * 0.36 + phase * 0.5) * TWO_PI);
    const folded = Math.abs(wave * 0.66 + counter * 0.34);
    return 1 - smoothstep(width, width + 0.32, folded);
  }

  function ancientChannelCut(u, v) {
    const a = seamArcPressure(u + 0.07, v, 0.18, 2.0, 0.18, 0.3);
    const b = seamArcPressure(u - 0.11, v + 0.03, 0.61, 3.0, 0.14, 0.24);
    const c = diagonalArcPressure(u + 0.23, v - 0.04, 0.39, 1.5, 0.13);
    const aged = fbm(u * 1.17 + 0.09, v * 0.94 - 0.04, 51000, 4);

    return clamp01((a * 0.34 + b * 0.32 + c * 0.26) * (0.72 + aged * 0.28));
  }

  function fractureCutPressure(u, v) {
    const a = diagonalArcPressure(u, v, 0.12, 2.0, 0.15);
    const b = diagonalArcPressure(u + 0.17, v - 0.04, 0.44, 3.0, 0.12);
    const c = seamArcPressure(u - 0.08, v + 0.02, 0.78, 2.5, 0.13, 0.2);
    const grit = fbm(u * 2.21 + 0.13, v * 1.86 - 0.07, 52000, 4);

    return clamp01(a * 0.3 + b * 0.28 + c * 0.22 + grit * 0.2);
  }

  function shelfCutPressure(u, v, crustalProvincePressure, oceanBasinPressure) {
    const equatorialWrap = Math.pow(Math.sin(clamp(v, 0, 1) * Math.PI), 0.74);
    const edgeA = seamArcPressure(u, v, 0.73, 4.0, 0.12, 0.22);
    const edgeB = seamArcPressure(u + 0.19, v, 0.27, 2.5, 0.16, 0.36);
    const edgeC = diagonalArcPressure(u - 0.13, v + 0.05, 0.52, 2.0, 0.14);
    const boundaryTension = Math.abs(crustalProvincePressure - oceanBasinPressure);

    return clamp01(
      edgeA * 0.22 +
        edgeB * 0.18 +
        edgeC * 0.16 +
        smoothstep(0.08, 0.42, boundaryTension) * 0.32 +
        equatorialWrap * 0.12
    );
  }

  function coastBoundaryMemory(u, v, crustalProvincePressure, oceanBasinPressure, shelfCut) {
    const balance = 1 - clamp(Math.abs(crustalProvincePressure - oceanBasinPressure) / 0.5, 0, 1);
    const oldCut = ancientChannelCut(u + 0.04, v - 0.02);
    return clamp01(balance * 0.38 + shelfCut * 0.38 + oldCut * 0.18 + fbm(u, v, 53000, 3) * 0.06);
  }

  function strongestSummit(point3) {
    const strongest = strongestField(point3, SUMMIT_PRESSURE_FIELDS);
    if (strongest.best.value < 0.12) {
      return {
        summitPressure: 0,
        summitPressureId: "none",
        summitPressureLabel: "None"
      };
    }

    return {
      summitPressure: clamp01(strongest.best.value),
      summitPressureId: strongest.best.id,
      summitPressureLabel: strongest.best.label
    };
  }

  function dominantCause(field) {
    const candidates = [
      ["ridge-collision", field.ridgeCollisionPressure],
      ["ocean-basin-sink", field.oceanBasinPressure],
      ["continental-mass", field.continentalMassPressure],
      ["plateau-uplift", field.plateauUpliftPressure],
      ["fracture-cut", field.fractureCutPressure],
      ["escarpment-boundary", field.escarpmentPressure],
      ["archipelago-fracture", field.archipelagoFracturePressure],
      ["coast-boundary-memory", field.coastBoundaryMemory],
      ["summit-pressure", field.summitPressure],
      ["ancient-channel-cut", field.ancientChannelCut],
      ["buried-stable-body", field.buriedStructure]
    ];

    let best = candidates[0];

    candidates.forEach((item) => {
      if (item[1] > best[1]) best = item;
    });

    return best[0];
  }

  function structuralClass(field) {
    if (field.oceanBasinPressure > 0.72 && field.continentalMassPressure < 0.34) return "deep-basin-cause";
    if (field.ridgeCollisionPressure > 0.68 && field.plateStress > 0.5) return "ridge-collision-cause";
    if (field.archipelagoFracturePressure > 0.58) return "broken-shelf-cause";
    if (field.escarpmentPressure > 0.6) return "drop-boundary-cause";
    if (field.coastBoundaryMemory > 0.62) return "old-coast-boundary-cause";
    if (field.plateauUpliftPressure > 0.6) return "uplifted-crust-cause";
    if (field.summitPressure > 0.58) return "summit-pressure-cause";
    if (field.fractureCutPressure > 0.62) return "fractured-crust-cause";
    if (field.continentalMassPressure > 0.56) return "continental-crust-cause";
    if (field.buriedStructure > 0.54) return "buried-structure-cause";
    return "stable-pre-terrain-cause";
  }

  function legacyTectonicClass(field) {
    if (field.basinPressure > 0.72 && field.subsurfacePressure < 0.45) return "deep-basin-seed";
    if (field.ridgePressure > 0.68 && field.plateStress > 0.54) return "ridge-pressure-seed";
    if (field.scarPressure > 0.62 && field.ancientChannelCut > 0.46) return "ancient-cut-structure";
    if (field.shelfCutPressure > 0.64) return "buried-shelf-boundary";
    if (field.crustalCompression > 0.66) return "compressed-crust";
    if (field.depth > 0.64) return "old-deep-body";
    if (field.plateStress > 0.58) return "lateral-plate-stress";
    return "stable-pre-terrain-body";
  }

  function sampleTectonics(uInput, vInput, context = {}) {
    const input = normalizeSampleInput(uInput, vInput);
    const u = input.u;
    const v = input.v;

    const lat = latRadFromV(v);
    const lon = lonRadFromU(u);
    const latDeg = latDegFromV(v);
    const lonDeg = lonDegFromU(u);
    const point3 = vectorFromLatLonRad(lat, lon);

    const ancientNoise = fbm(u * 0.94 + 0.03, v * 1.08 - 0.02, 47000, 5);
    const deepNoise = fbm(u * 1.62 - 0.21, v * 1.31 + 0.14, 48000, 5);
    const fractureNoise = fbm(u * 2.26 + 0.17, v * 1.89 - 0.09, 49000, 4);
    const oldBodyNoise = fbm(u * 0.73 - 0.09, v * 0.67 + 0.04, 50000, 4);

    const provinceStrongest = strongestField(point3, CRUSTAL_PROVINCES);
    const crustalProvincePressure = clamp01(
      weightedField(point3, CRUSTAL_PROVINCES) * 0.52 +
        provinceStrongest.best.value * 0.42 +
        ancientNoise * 0.06
    );

    const continentalMassPressure = clamp01(
      crustalProvincePressure * 0.64 +
        provinceStrongest.best.value * 0.24 +
        oldBodyNoise * 0.12
    );

    const oceanSinkStrongest = strongestField(point3, OCEAN_BASIN_SINKS);
    const oceanBasinPressure = clamp01(
      weightedField(point3, OCEAN_BASIN_SINKS) * 0.54 +
        oceanSinkStrongest.best.value * 0.36 +
        deepNoise * 0.1
    );

    const ridgeStrongest = strongestField(point3, RIDGE_COLLISION_ZONES);
    const ridgeCollisionPressure = clamp01(
      weightedField(point3, RIDGE_COLLISION_ZONES) * 0.44 +
        ridgeStrongest.best.value * 0.44 +
        fractureNoise * 0.12
    );

    const scarStrongest = strongestField(point3, SCAR_SYSTEMS);
    const scarPressure = clamp01(
      weightedField(point3, SCAR_SYSTEMS) * 0.48 +
        scarStrongest.best.value * 0.36 +
        fractureNoise * 0.16
    );

    const arcA = seamArcPressure(u, v, 0.11, 2.0, 0.16, 0.28);
    const arcB = seamArcPressure(u + 0.13, v - 0.02, 0.47, 3.0, 0.13, 0.22);
    const arcC = seamArcPressure(u - 0.21, v + 0.05, 0.82, 1.5, 0.18, 0.35);
    const diagonalStress = diagonalArcPressure(u + 0.05, v - 0.03, 0.31, 2.0, 0.14);

    const plateStress = clamp01(
      arcA * 0.26 +
        arcB * 0.24 +
        arcC * 0.16 +
        diagonalStress * 0.14 +
        ridgeCollisionPressure * 0.16 +
        fractureNoise * 0.04
    );

    const fractureCut = fractureCutPressure(u, v);
    const ancientCut = ancientChannelCut(u, v);
    const shelfCut = shelfCutPressure(u, v, crustalProvincePressure, oceanBasinPressure);
    const coastMemory = coastBoundaryMemory(u, v, crustalProvincePressure, oceanBasinPressure, shelfCut);

    const plateauUpliftPressure = clamp01(
      continentalMassPressure * 0.34 +
        crustalProvincePressure * 0.24 +
        ridgeCollisionPressure * 0.14 +
        oldBodyNoise * 0.14 -
        oceanBasinPressure * 0.12 +
        provinceStrongest.best.value * 0.12
    );

    const basinSinkPressure = clamp01(
      oceanBasinPressure * 0.56 +
        (1 - crustalProvincePressure) * 0.16 +
        deepNoise * 0.16 +
        ancientCut * 0.08 +
        shelfCut * 0.04
    );

    const escarpmentPressure = clamp01(
      ridgeCollisionPressure * 0.24 +
        fractureCut * 0.24 +
        coastMemory * 0.22 +
        shelfCut * 0.18 +
        Math.abs(continentalMassPressure - oceanBasinPressure) * 0.12
    );

    const archipelagoProvince = provinceStrongest.best.id === "broken_archipelago_pressure"
      ? provinceStrongest.best.value
      : 0;

    const archipelagoFracturePressure = clamp01(
      archipelagoProvince * 0.42 +
        shelfCut * 0.22 +
        fractureCut * 0.18 +
        coastMemory * 0.12 +
        fractureNoise * 0.06
    );

    const summit = strongestSummit(point3);

    const crustalCompression = clamp01(
      crustalProvincePressure * 0.36 +
        continentalMassPressure * 0.22 +
        plateauUpliftPressure * 0.18 +
        ridgeCollisionPressure * 0.14 +
        ancientNoise * 0.1 -
        oceanBasinPressure * 0.12
    );

    const ridgePressure = clamp01(
      ridgeCollisionPressure * 0.62 +
        plateStress * 0.18 +
        crustalCompression * 0.12 +
        deepNoise * 0.08
    );

    const basinPressure = clamp01(
      basinSinkPressure * 0.64 +
        oceanBasinPressure * 0.2 +
        (1 - continentalMassPressure) * 0.08 +
        deepNoise * 0.08
    );

    const depth = clamp01(
      0.32 +
        ancientNoise * 0.14 +
        deepNoise * 0.16 +
        oldBodyNoise * 0.08 +
        continentalMassPressure * 0.14 +
        oceanBasinPressure * 0.12 +
        scarPressure * 0.08 +
        crustalProvincePressure * 0.08
    );

    const subsurfacePressure = clamp01(
      depth * 0.26 +
        crustalCompression * 0.2 +
        plateStress * 0.16 +
        ridgePressure * 0.16 +
        plateauUpliftPressure * 0.1 +
        scarPressure * 0.08 -
        basinPressure * 0.06
    );

    const buriedStructure = clamp01(
      subsurfacePressure * 0.22 +
        crustalCompression * 0.16 +
        ridgePressure * 0.12 +
        basinPressure * 0.1 +
        scarPressure * 0.1 +
        ancientCut * 0.08 +
        shelfCut * 0.08 +
        coastMemory * 0.06 +
        fractureCut * 0.05 +
        summit.summitPressure * 0.03
    );

    const elevationInfluence = clamp01(
      0.5 +
        continentalMassPressure * 0.24 +
        crustalCompression * 0.18 +
        ridgeCollisionPressure * 0.18 +
        plateauUpliftPressure * 0.14 +
        summit.summitPressure * 0.04 -
        oceanBasinPressure * 0.22 -
        basinSinkPressure * 0.18 -
        ancientCut * 0.08 -
        shelfCut * 0.07 -
        fractureCut * 0.04 +
        (deepNoise - 0.5) * 0.06
    );

    const field = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "structural-cause-tectonics",

      anchorId: u === ANCHOR.u && v === ANCHOR.v ? ANCHOR.id : "",
      u,
      v,
      lat,
      lon,
      latDeg,
      lonDeg,

      depth,
      subsurfacePressure,
      plateStress,
      crustalCompression,
      ridgePressure,
      basinPressure,
      scarPressure,
      ancientChannelCut: ancientCut,
      shelfCutPressure: shelfCut,
      buriedStructure,
      elevationInfluence,

      crustalProvincePressure,
      crustalProvinceId: provinceStrongest.best.id,
      crustalProvinceLabel: provinceStrongest.best.label,
      continentalMassPressure,
      oceanBasinPressure,
      oceanBasinId: oceanSinkStrongest.best.id,
      oceanBasinLabel: oceanSinkStrongest.best.label,
      coastBoundaryMemory,
      ridgeCollisionPressure,
      ridgeCollisionId: ridgeStrongest.best.id,
      ridgeCollisionLabel: ridgeStrongest.best.label,
      plateauUpliftPressure,
      basinSinkPressure,
      fractureCutPressure: fractureCut,
      escarpmentPressure,
      archipelagoFracturePressure,
      summitPressure: summit.summitPressure,
      summitPressureId: summit.summitPressureId,
      summitPressureLabel: summit.summitPressureLabel,

      causeLayer: "pre-terrain",
      causeBeforeElevation: true,
      numericStructuralAuthorityOnly: true,
      preTerrainDepthAuthorityLoaded: true,
      structuralCauseAuthorityLoaded: true,

      ownsElevation: false,
      ownsHydrology: false,
      ownsMaterialRendering: false,
      ownsFinalLandOcean: false,
      ownsClimate: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    const structural = structuralClass(field);
    const dominant = dominantCause(field);

    return Object.freeze({
      ...field,
      tectonicClass: legacyTectonicClass(field),
      structuralClass: structural,
      dominantStructuralCause: dominant
    });
  }

  function sample(u, v, context = {}) {
    return sampleTectonics(u, v, context);
  }

  function read(u, v, context = {}) {
    return sampleTectonics(u, v, context);
  }

  function sampleGrid(columns = 16, rows = 16) {
    const width = Math.max(1, Math.floor(columns));
    const height = Math.max(1, Math.floor(rows));
    const cells = [];

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        cells.push(sampleTectonics((x + 0.5) / width, (y + 0.5) / height));
      }
    }

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      columns: width,
      rows: height,
      count: cells.length,
      cells: Object.freeze(cells)
    });
  }

  function sampleAnchor() {
    return sampleTectonics(ANCHOR.u, ANCHOR.v);
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "structural-cause-tectonics",
      destinationFile: "/assets/hearth/hearth.tectonics.js",
      anchor: ANCHOR,
      structuralCauseAuthorityLoaded: true,
      preTerrainDepthAuthorityLoaded: true,
      tectonicsBeforeElevation: true,
      numericStructuralAuthorityOnly: true,
      producesElevationInfluence: true,
      exportedFields: [
        "depth",
        "subsurfacePressure",
        "plateStress",
        "crustalCompression",
        "ridgePressure",
        "basinPressure",
        "scarPressure",
        "ancientChannelCut",
        "shelfCutPressure",
        "buriedStructure",
        "elevationInfluence",
        "crustalProvincePressure",
        "continentalMassPressure",
        "oceanBasinPressure",
        "coastBoundaryMemory",
        "ridgeCollisionPressure",
        "plateauUpliftPressure",
        "basinSinkPressure",
        "fractureCutPressure",
        "escarpmentPressure",
        "archipelagoFracturePressure",
        "summitPressure",
        "summitPressureId",
        "dominantStructuralCause",
        "structuralClass"
      ],
      ownsElevation: false,
      ownsHydrology: false,
      ownsMaterialRendering: false,
      ownsFinalLandOcean: false,
      ownsClimate: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    });
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    anchor: ANCHOR,

    sampleTectonics,
    sample,
    read,
    sampleGrid,
    sampleAnchor,
    getStatus,

    supportsStructuralCauseTectonics: true,
    supportsPreTerrainDepth: true,
    supportsElevationInfluence: true,
    supportsCrustalProvincePressure: true,
    supportsOceanBasinPressure: true,
    supportsSummitPressure: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  });

  window.HEARTH = window.HEARTH || {};
  window.HEARTH.tectonics = api;

  window.HEARTH_TECTONICS = api;
  window.HearthTectonics = api;
  window.HEARTH_TECTONICS_RECEIPT = getStatus();
  window.HEARTH_TECTONICS_CONTRACT = CONTRACT;
  window.HEARTH_STRUCTURAL_CAUSE_TECTONICS_RECEIPT = getStatus();

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.hearthTectonicsAuthorityLoaded = "true";
    document.documentElement.dataset.hearthTectonicsAuthorityContract = CONTRACT;
    document.documentElement.dataset.hearthTectonicsAuthorityReceipt = RECEIPT;
    document.documentElement.dataset.hearthTectonicsPreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.hearthPreTerrainDepthAuthorityLoaded = "true";
    document.documentElement.dataset.hearthStructuralCauseAuthorityLoaded = "true";
    document.documentElement.dataset.hearthTectonicsBeforeElevation = "true";
    document.documentElement.dataset.hearthTectonicsNumericStructuralAuthorityOnly = "true";
    document.documentElement.dataset.hearthTectonicsAnchor = ANCHOR.id;
    document.documentElement.dataset.hearthTectonicsAnchorU = String(ANCHOR.u);
    document.documentElement.dataset.hearthTectonicsAnchorV = String(ANCHOR.v);
    document.documentElement.dataset.hearthTectonicsAnchorLon = String(ANCHOR.lonDeg);
    document.documentElement.dataset.hearthTectonicsAnchorLat = String(ANCHOR.latDeg);
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.webgl = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
