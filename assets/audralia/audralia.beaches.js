// /assets/audralia/audralia.beaches.js
// AUDRALIA_LIMITED_SPECIAL_BEACH_AUTHORITY_TNT_v1
// Full-file replacement.
// Beach Authority only.
// Purpose:
// - Makes beaches rare named threshold regions, not default coastline.
// - Binds one climate-standard diamond-grained beach with provisional naming held for Sean's Gratitude / Generosity naming standard.
// - Uses chronological organic formation first, then 16-node admissibility, then 256-lattice coastal inspection.
// - Percentage targets are audit calibration only, not origin law.
// - Does not own land/sea footprint.
// - Does not own climate.
// - Does not own terrain morphology.
// - Does not own elevation.
// - Does not own surface color.
// - Does not render canvas.
// - Does not touch runtime.
// - Does not touch Gauges.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_LIMITED_SPECIAL_BEACH_AUTHORITY_TNT_v1";
  const RECEIPT = "AUDRALIA_LIMITED_SPECIAL_BEACH_AUTHORITY_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_BEACH_AUTHORITY_HELD_OR_GENERIC_COASTLINE";
  const VERSION = "2026-05-15.audralia-limited-special-beach-authority-v1";

  const PHI = 1.618033988749895;
  const INV_PHI = 1 / PHI;

  const CLIMATE_STANDARD_BEACH = Object.freeze({
    beachId: "CLIMATE_STANDARD_BEACH_01",
    beachName: "PENDING_GRATITUDE_GENEROSITY_NAME",
    provisionalName: "Climate Standard Beach · Name Held",
    material: "diamond-grained sand",
    isClimateStandardBeach: true,
    hasDiamondGrainedSand: true,
    accessGoverned: true,
    technologyResponsibilityStandard: "each_level_of_technology_requires_greater_responsibility_to_respect_the_technology",
    coherenceAccessRequired: true,
    accessStandard: "only_people_coherent_enough_to_be_trusted_with_the_technology_may_access_the_region",
    finalNameHeld: true
  });

  const BEACH_TYPE_FAMILY = Object.freeze([
    "diamond-grained-climate-standard-beach",
    "warm-sand-beach",
    "wetland-delta-beach",
    "rocky-mineral-beach",
    "cold-gravel-beach"
  ]);

  const NON_BEACH_COAST_TYPES = Object.freeze([
    "rocky-coast",
    "cliff-coast",
    "marsh-edge",
    "wetland-delta",
    "reef-shelf",
    "tidal-shelf",
    "cold-gravel-coast",
    "steep-coastal-rise",
    "submerged-shelf",
    "ordinary-shoreline",
    "mineral-coast",
    "mangrove-wetland-edge",
    "fjord-inlet-wall"
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalize01(value, fallback = 0.5) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    if (number >= 0 && number <= 1) return number;
    if (number >= -1 && number <= 1) return (number + 1) * 0.5;
    if (number >= 0 && number <= 100) return number / 100;
    return clamp(number, 0, 1);
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function text(value) {
    return String(value || "").trim().toLowerCase();
  }

  function includesAny(value, terms) {
    const source = text(value);
    return terms.some((term) => source.includes(term));
  }

  function hash(x, y, seed) {
    let h = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(y ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function noise(u, v, scale, seed) {
    const s = Math.max(2, Math.floor(scale));
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

    const a = hash(((x0 % s) + s) % s, y0, seed);
    const b = hash(((x1 % s) + s) % s, y0, seed);
    const c = hash(((x0 % s) + s) % s, y1, seed);
    const d = hash(((x1 % s) + s) % s, y1, seed);

    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  }

  function fbm(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3.5;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridgeNoise(u, v, seed, octaves = 4) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 4.0;

    for (let i = 0; i < octaves; i += 1) {
      const n = noise(u, v, scale, seed + i * 197);
      const ridge = 1 - Math.abs(n * 2 - 1);
      total += ridge * amp;
      norm += amp;
      amp *= 0.5;
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function getCell256(map) {
    const existing = Number(map?.cell256);
    if (Number.isFinite(existing) && existing >= 1 && existing <= 256) return Math.floor(existing);

    const u = clamp(Number(map?.u || 0), 0, 1);
    const v = clamp(Number(map?.v || 0), 0, 1);
    return Math.max(1, Math.min(256, Math.floor(v * 16) * 16 + Math.floor(u * 16) + 1));
  }

  function getCellXY(cell256) {
    const index = clamp(Math.floor(cell256) - 1, 0, 255);
    return Object.freeze({
      x: index % 16,
      y: Math.floor(index / 16)
    });
  }

  function summitKey(map) {
    const key = text(map?.internalSummit || map?.primarySummit || map?.summitProvince || "gratitude");
    const normalized = key.replace(/\s+/g, "-");

    if (normalized.includes("gratitude")) return "gratitude";
    if (normalized.includes("generosity")) return "generosity";
    if (normalized.includes("depend")) return "dependability";
    if (normalized.includes("account")) return "accountability";
    if (normalized.includes("forgive")) return "forgiveness";
    if (normalized.includes("humility")) return "humility";
    if (normalized.includes("control")) return "self-control";
    if (normalized.includes("patience")) return "patience";
    if (normalized.includes("purity")) return "purity";
    if (normalized.includes("stability")) return "stability";
    if (normalized.includes("balance")) return "balance";
    if (normalized.includes("dignity")) return "dignity";
    if (normalized.includes("peace")) return "peace";

    return "gratitude";
  }

  function isOceanLike(map) {
    return Boolean(
      map?.isOcean ||
      map?.terrainClass === "ocean" ||
      map?.terrainClass === "shelf" ||
      map?.isShelf
    );
  }

  function isBeachHint(map) {
    return Boolean(
      map?.isBeach ||
      map?.terrainClass === "beach" ||
      includesAny(map?.topology, ["beach", "shore", "coastline"])
    );
  }

  function readClimate(map) {
    try {
      if (window.AUDRALIA_CLIMATE_RENDER?.sampleClimate) {
        const value = window.AUDRALIA_CLIMATE_RENDER.sampleClimate(map);
        if (value && typeof value === "object") return value;
      }

      if (window.AUDRALIA_CLIMATE_RENDER?.sample) {
        const value = window.AUDRALIA_CLIMATE_RENDER.sample(map);
        if (value && typeof value === "object") return value;
      }
    } catch {
      document.documentElement.dataset.audraliaBeachClimateReadFailed = "true";
    }

    return null;
  }

  function readElevation(map) {
    try {
      if (window.AUDRALIA_ELEVATION?.sampleElevation) {
        const value = window.AUDRALIA_ELEVATION.sampleElevation(map);
        if (value && typeof value === "object") return value;
      }

      if (window.AUDRALIA_ELEVATION?.sample) {
        const value = window.AUDRALIA_ELEVATION.sample(map);
        if (value && typeof value === "object") return value;
      }
    } catch {
      document.documentElement.dataset.audraliaBeachElevationReadFailed = "true";
    }

    return null;
  }

  function readTerrainFingers(map) {
    try {
      if (window.AUDRALIA_TERRAIN_FINGERS?.sampleTerrainFingers) {
        const value = window.AUDRALIA_TERRAIN_FINGERS.sampleTerrainFingers(map);
        if (value && typeof value === "object") return value;
      }

      if (window.AUDRALIA_TERRAIN_FINGERS?.sample) {
        const value = window.AUDRALIA_TERRAIN_FINGERS.sample(map);
        if (value && typeof value === "object") return value;
      }
    } catch {
      document.documentElement.dataset.audraliaBeachTerrainFingersReadFailed = "true";
    }

    return null;
  }

  function readGroundcover(map) {
    try {
      if (window.AUDRALIA_GROUNDCOVER?.sampleGroundcover) {
        const value = window.AUDRALIA_GROUNDCOVER.sampleGroundcover(map);
        if (value && typeof value === "object") return value;
      }

      if (window.AUDRALIA_GROUNDCOVER?.sample) {
        const value = window.AUDRALIA_GROUNDCOVER.sample(map);
        if (value && typeof value === "object") return value;
      }
    } catch {
      document.documentElement.dataset.audraliaBeachGroundcoverReadFailed = "true";
    }

    return null;
  }

  function coastalSignals(map, elevation, terrain, climate, groundcover) {
    const u = wrap01(Number(map?.u || 0));
    const v = clamp(Number(map?.v || 0), 0, 1);
    const cell256 = getCell256(map);
    const cell = getCellXY(cell256);
    const summit = summitKey(map);

    const terrainText = [
      map?.terrainClass,
      map?.topology,
      map?.elevation,
      terrain?.class,
      terrain?.zone,
      terrain?.form,
      elevation?.class,
      elevation?.zone,
      elevation?.form,
      climate?.biome,
      climate?.zone,
      climate?.material,
      groundcover?.cover,
      groundcover?.type,
      groundcover?.class
    ].map(text).join(" ");

    const shelf = normalize01(map?.shelf, 0.12);
    const beachEdge = normalize01(map?.beachEdge, 0);
    const latitude = Number.isFinite(Number(map?.latitude)) ? Number(map.latitude) : 90 - v * 180;
    const absLat = Math.abs(latitude);

    const coastText = includesAny(terrainText, ["coast", "shore", "beach", "landrise", "tidal", "delta"]) ? 0.36 : 0;
    const footprintContact = clamp(beachEdge * 0.56 + shelf * 0.24 + coastText + (isBeachHint(map) ? 0.32 : 0), 0, 1);

    const cliff = normalize01(elevation?.cliff, 0) * 0.58 + normalize01(terrain?.cliffWall, 0) * 0.42;
    const slope = normalize01(elevation?.slope, 0.36);
    const coastalRise = normalize01(elevation?.coastalRise, 0.16) * 0.62 + normalize01(terrain?.coastalRise, 0) * 0.38;
    const basin = normalize01(elevation?.basin, 0.16) * 0.56 + normalize01(terrain?.basinBowl, 0) * 0.44;
    const valley = normalize01(elevation?.valley, 0.14) * 0.48 + normalize01(terrain?.valleyCut, 0) * 0.28 + normalize01(terrain?.drainageCorridor, 0) * 0.24;
    const mountain = normalize01(elevation?.mountain, 0.10) * 0.56 + normalize01(terrain?.mountainFinger, 0) * 0.44;
    const ridge = normalize01(elevation?.ridge, 0.18) * 0.54 + normalize01(terrain?.ridgeChain, 0) * 0.46;
    const walkability = normalize01(terrain?.walkability, 0.55);

    const heat = normalize01(climate?.heat ?? climate?.temperature ?? climate?.warmth, 0.52);
    const moisture = normalize01(climate?.moisture ?? climate?.humidity ?? climate?.wetness ?? climate?.rainfall, 0.46);
    const aridity = normalize01(climate?.aridity ?? climate?.dryness, 1 - moisture);
    const cold = normalize01(climate?.cold, smoothstep(48, 82, absLat));
    const wetlandPotential = normalize01(climate?.wetlandPotential, basin * 0.4 + valley * 0.3 + moisture * 0.3);
    const desertPotential = normalize01(climate?.desertPotential, aridity * 0.65);
    const tropical = text(climate?.zone).includes("tropic") || text(climate?.biome).includes("tropical");
    const subtropical = text(climate?.zone).includes("subtropic") || text(climate?.biome).includes("subtropical");
    const tundra = text(climate?.zone).includes("tundra") || text(climate?.biome).includes("tundra");
    const polar = text(climate?.zone).includes("polar") || text(climate?.biome).includes("polar");

    const cellPhaseX = (cell.x / 15) * PHI;
    const cellPhaseY = (cell.y / 15) * INV_PHI;

    const waveSorting = fbm(u * 2.4 + cellPhaseX, v * 2.0 - cellPhaseY, 910100, 5);
    const sedimentField = fbm(u * 4.8 - cellPhaseY, v * 3.6 + cellPhaseX, 910900, 4);
    const mineralField = ridgeNoise(u * 7.5 + cellPhaseX, v * 5.8 - cellPhaseY, 911700, 3);
    const reefField = ridgeNoise(u * 9.2 - 0.14, v * 7.1 + 0.22, 912500, 3);
    const rarityField = fbm(u * 1.15 + cellPhaseY, v * 1.05 - cellPhaseX, 913300, 5);
    const chronologyField = fbm(u * 0.72 + cellPhaseX, v * 0.64 - cellPhaseY, 914100, 5);

    const deposition = clamp(
      shelf * 0.28 +
      waveSorting * 0.20 +
      sedimentField * 0.24 +
      valley * 0.14 +
      basin * 0.10 -
      cliff * 0.20 -
      slope * 0.12,
      0,
      1
    );

    const slopeAdmissible = clamp(1 - slope * 0.62 - cliff * 0.44 - mountain * 0.20 + walkability * 0.18, 0, 1);
    const terrainAdmissible = clamp(1 - cliff * 0.56 - mountain * 0.28 - coastalRise * 0.12 + valley * 0.18 + walkability * 0.18, 0, 1);
    const elevationAdmissible = clamp(1 - cliff * 0.52 - slope * 0.38 - mountain * 0.22 + shelf * 0.18 + valley * 0.12, 0, 1);

    const climateAdmissible = clamp(
      heat * 0.18 +
      moisture * 0.14 +
      (1 - cold) * 0.16 +
      wetlandPotential * 0.12 +
      (1 - Math.max(tundra ? 0.22 : 0, polar ? 0.44 : 0)) * 0.18 +
      (1 - aridity) * 0.08 +
      desertPotential * 0.08,
      0,
      1
    );

    const groundcoverAdmissible = clamp(
      walkability * 0.24 +
      normalize01(groundcover?.vegetation ?? groundcover?.density, 0.44) * 0.16 +
      (1 - normalize01(groundcover?.canopy, 0.30) * 0.18) +
      wetlandPotential * 0.10,
      0,
      1
    );

    const organicChronology = clamp(
      chronologyField * 0.22 +
      deposition * 0.20 +
      shelf * 0.16 +
      sedimentField * 0.12 +
      mineralField * 0.08 +
      terrainAdmissible * 0.12 +
      climateAdmissible * 0.10,
      0,
      1
    );

    const rarityGate = clamp(
      rarityField * 0.30 +
      organicChronology * 0.30 +
      deposition * 0.18 +
      mineralField * 0.10 +
      (summit === "gratitude" || summit === "generosity" ? 0.08 : 0) -
      cliff * 0.16 -
      mountain * 0.10,
      0,
      1
    );

    return Object.freeze({
      u,
      v,
      cell256,
      cellX: cell.x,
      cellY: cell.y,
      summit,
      latitude,
      absLat,
      terrainText,
      shelf,
      beachEdge,
      footprintContact,
      cliff,
      slope,
      coastalRise,
      basin,
      valley,
      mountain,
      ridge,
      walkability,
      heat,
      moisture,
      aridity,
      cold,
      wetlandPotential,
      desertPotential,
      tropical,
      subtropical,
      tundra,
      polar,
      waveSorting,
      sedimentField,
      mineralField,
      reefField,
      rarityField,
      chronologyField,
      deposition,
      slopeAdmissible,
      terrainAdmissible,
      elevationAdmissible,
      climateAdmissible,
      groundcoverAdmissible,
      organicChronology,
      rarityGate
    });
  }

  function resolveShorelineType(signals) {
    if (signals.footprintContact < 0.24) return "non-coastal";
    if (signals.cliff > 0.62 && signals.coastalRise > 0.40) return "cliff-coast";
    if (signals.cliff > 0.56) return "rocky-coast";
    if (signals.mountain > 0.62 && signals.slope > 0.50) return "steep-coastal-rise";
    if (signals.polar || signals.tundra || signals.cold > 0.68) return "cold-gravel-coast";
    if (signals.wetlandPotential > 0.62 && signals.basin > 0.44) return "marsh-edge";
    if (signals.valley > 0.58 && signals.deposition > 0.44 && signals.moisture > 0.48) return "wetland-delta";
    if (signals.reefField > 0.74 && signals.tropical) return "reef-shelf";
    if (signals.shelf > 0.50 && signals.deposition < 0.38) return "tidal-shelf";
    if (signals.shelf < 0.18 && signals.footprintContact > 0.36) return "submerged-shelf";
    if (signals.mineralField > 0.76 && signals.cliff > 0.34) return "mineral-coast";
    return "ordinary-shoreline";
  }

  function resolveBeachType(signals) {
    const isGratitudeGenerosity = signals.summit === "gratitude" || signals.summit === "generosity";
    const climateStandardCandidate =
      isGratitudeGenerosity &&
      signals.mineralField > 0.78 &&
      signals.organicChronology > 0.62 &&
      signals.deposition > 0.50 &&
      signals.terrainAdmissible > 0.52 &&
      signals.elevationAdmissible > 0.52 &&
      signals.rarityGate > 0.70 &&
      signals.cell256 % 17 === 0;

    if (climateStandardCandidate) return "diamond-grained-climate-standard-beach";

    if (signals.wetlandPotential > 0.66 && signals.valley > 0.46 && signals.moisture > 0.50) return "wetland-delta-beach";
    if ((signals.polar || signals.tundra || signals.cold > 0.66) && signals.slopeAdmissible > 0.50) return "cold-gravel-beach";
    if (signals.mineralField > 0.72 && signals.deposition > 0.46 && signals.cliff < 0.56) return "rocky-mineral-beach";
    if ((signals.tropical || signals.subtropical || signals.heat > 0.56) && signals.deposition > 0.50) return "warm-sand-beach";

    return "warm-sand-beach";
  }

  function provisionalBeachId(beachType, signals) {
    if (beachType === "diamond-grained-climate-standard-beach") return CLIMATE_STANDARD_BEACH.beachId;

    if (beachType === "wetland-delta-beach") {
      return signals.summit === "generosity" ? "GENEROSITY_BEACH_01" : "GRATITUDE_BEACH_01";
    }

    if (beachType === "rocky-mineral-beach") {
      return signals.summit === "generosity" ? "GENEROSITY_BEACH_02" : "GRATITUDE_BEACH_02";
    }

    if (beachType === "cold-gravel-beach") {
      return signals.summit === "generosity" ? "GENEROSITY_BEACH_03" : "GRATITUDE_BEACH_03";
    }

    return signals.summit === "generosity" ? "GENEROSITY_BEACH_04" : "GRATITUDE_BEACH_04";
  }

  function provisionalBeachName(beachType) {
    if (beachType === "diamond-grained-climate-standard-beach") return CLIMATE_STANDARD_BEACH.provisionalName;
    return "PENDING_GRATITUDE_GENEROSITY_NAME";
  }

  function node(name, passed, score, required = true) {
    return Object.freeze({
      name,
      passed: Boolean(passed),
      score: clamp(Number(score) || 0, 0, 1),
      required: Boolean(required)
    });
  }

  function buildNodes(signals, beachType, shorelineType) {
    const namedSlotScore =
      beachType === "diamond-grained-climate-standard-beach"
        ? 1
        : clamp(signals.rarityGate * 0.72 + signals.organicChronology * 0.28, 0, 1);

    const climateStandardCheck =
      beachType === "diamond-grained-climate-standard-beach"
        ? 1
        : 0.72;

    const diamondRestriction =
      beachType === "diamond-grained-climate-standard-beach"
        ? 1
        : 1;

    const accessGoverned =
      beachType === "diamond-grained-climate-standard-beach"
        ? 1
        : 0.74;

    const groundView =
      clamp(
        signals.walkability * 0.24 +
        signals.deposition * 0.24 +
        signals.slopeAdmissible * 0.20 +
        signals.terrainAdmissible * 0.18 +
        (1 - signals.cliff) * 0.14,
        0,
        1
      );

    const surfaceDisplay = clamp(
      signals.footprintContact * 0.18 +
      signals.deposition * 0.18 +
      signals.rarityGate * 0.20 +
      signals.slopeAdmissible * 0.14 +
      signals.terrainAdmissible * 0.14 +
      signals.elevationAdmissible * 0.10 +
      signals.climateAdmissible * 0.06,
      0,
      1
    );

    return Object.freeze([
      node("01_footprint_contact", signals.footprintContact > 0.42, signals.footprintContact),
      node("02_shoreline_type", !["non-coastal", "cliff-coast", "steep-coastal-rise", "submerged-shelf"].includes(shorelineType), shorelineType === "ordinary-shoreline" ? 0.62 : 0.76),
      node("03_slope_admissibility", signals.slopeAdmissible > 0.46, signals.slopeAdmissible),
      node("04_shelf_deposition", signals.deposition > 0.48, signals.deposition),
      node("05_terrain_finger_compatibility", signals.terrainAdmissible > 0.48, signals.terrainAdmissible),
      node("06_elevation_compatibility", signals.elevationAdmissible > 0.48, signals.elevationAdmissible),
      node("07_climate_compatibility", signals.climateAdmissible > 0.42, signals.climateAdmissible),
      node("08_groundcover_compatibility", signals.groundcoverAdmissible > 0.34, signals.groundcoverAdmissible, false),
      node("09_rarity_gate", signals.rarityGate > 0.62, signals.rarityGate),
      node("10_named_beach_slot", namedSlotScore > 0.58, namedSlotScore),
      node("11_gratitude_generosity_naming", false, 0.5, false),
      node("12_climate_standard_check", climateStandardCheck > 0.70, climateStandardCheck, beachType === "diamond-grained-climate-standard-beach"),
      node("13_diamond_grain_restriction", diamondRestriction > 0.95, diamondRestriction),
      node("14_access_governed_region", accessGoverned > 0.70, accessGoverned, beachType === "diamond-grained-climate-standard-beach"),
      node("15_ground_view_admissibility", groundView > 0.46, groundView),
      node("16_surface_display_permission", surfaceDisplay > 0.52, surfaceDisplay)
    ]);
  }

  function nodesPass(nodes) {
    return nodes.every((item) => !item.required || item.passed);
  }

  function nodeScore(nodes) {
    const total = nodes.reduce((sum, item) => sum + item.score, 0);
    return total / Math.max(1, nodes.length);
  }

  function denialReason(nodes, shorelineType) {
    const failed = nodes.find((item) => item.required && !item.passed);
    if (failed) return `failed_${failed.name}`;
    if (shorelineType === "non-coastal") return "not_a_coastal_cell";
    return "beach_not_authorized";
  }

  function sampleBeach(map) {
    const source = map && typeof map === "object" ? map : {};

    const climate = readClimate(source);
    const elevation = readElevation(source);
    const terrain = readTerrainFingers(source);
    const groundcover = readGroundcover(source);
    const signals = coastalSignals(source, elevation, terrain, climate, groundcover);
    const shorelineType = resolveShorelineType(signals);
    const beachType = resolveBeachType(signals);
    const nodes = buildNodes(signals, beachType, shorelineType);
    const passed = nodesPass(nodes);
    const score = nodeScore(nodes);

    const allowed =
      !isOceanLike(source) &&
      shorelineType !== "non-coastal" &&
      passed &&
      score > 0.58;

    const isClimateStandardBeach = allowed && beachType === "diamond-grained-climate-standard-beach";
    const beachId = allowed ? provisionalBeachId(beachType, signals) : "";
    const beachName = allowed ? provisionalBeachName(beachType) : "";
    const coastType = allowed ? "true-beach-threshold" : shorelineType;

    const beachProbability = clamp(
      signals.organicChronology * 0.26 +
      signals.deposition * 0.22 +
      signals.rarityGate * 0.20 +
      signals.slopeAdmissible * 0.12 +
      signals.terrainAdmissible * 0.10 +
      signals.elevationAdmissible * 0.06 +
      signals.climateAdmissible * 0.04,
      0,
      1
    );

    return Object.freeze({
      allowed,
      isBeach: allowed,
      reason: allowed ? "authorized_limited_special_beach" : denialReason(nodes, shorelineType),
      beachType: allowed ? beachType : "",
      beachName,
      provisionalBeachName: beachName,
      beachId,
      finalNameHeld: allowed,
      gratitudeGenerosityNamingPending: true,
      isClimateStandardBeach,
      hasDiamondGrainedSand: isClimateStandardBeach,
      sandMaterial: isClimateStandardBeach ? "diamond-grained sand" : allowed ? beachType.replace(/-/g, " ") : "",
      accessGoverned: isClimateStandardBeach,
      technologyResponsibilityStandard: isClimateStandardBeach ? CLIMATE_STANDARD_BEACH.technologyResponsibilityStandard : "",
      coherenceAccessRequired: isClimateStandardBeach,
      accessStandard: isClimateStandardBeach ? CLIMATE_STANDARD_BEACH.accessStandard : "",
      coastType,
      shorelineType,
      deposition: signals.deposition,
      shelf: signals.shelf,
      slopeAdmissible: signals.slopeAdmissible,
      climateAdmissible: signals.climateAdmissible,
      terrainAdmissible: signals.terrainAdmissible,
      elevationAdmissible: signals.elevationAdmissible,
      groundcoverAdmissible: signals.groundcoverAdmissible,
      organicChronology: signals.organicChronology,
      rarity: signals.rarityGate,
      beachProbability,
      nodeScore: score,
      nodes,
      lattice: {
        scope: 256,
        cell256: signals.cell256,
        cellX: signals.cellX,
        cellY: signals.cellY,
        visibleGridStamping: false
      },
      chronologicalFormationFirst: true,
      percentageCalibrationOnlyAfterOrganicFormation: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-limited-special-beach-authority",
      ownsFootprint: false,
      ownsClimate: false,
      ownsTerrainFingers: false,
      ownsElevation: false,
      ownsSurfaceColor: false,
      ownsCanvas: false,
      canvasMayPaint: allowed,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function sample(map) {
    return sampleBeach(map);
  }

  function classifyCoast(map) {
    const beach = sampleBeach(map);

    if (beach.allowed) return beach.beachType;
    return beach.coastType || "ordinary-shoreline";
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-beach-authority",
      role: "limited_special_named_threshold_beach_admissibility",
      hierarchy: {
        level1: "one_climate_standard_diamond_grained_beach",
        level2: "16_nodal_beach_admissibility_construct",
        level3: "256_lattice_coastal_scope",
        level4: "percentage_calibration_after_organic_chronology_only"
      },
      climateStandardBeach: CLIMATE_STANDARD_BEACH,
      beachTypes: BEACH_TYPE_FAMILY,
      nonBeachCoastTypes: NON_BEACH_COAST_TYPES,
      exposes: [
        "sampleBeach",
        "sample",
        "classifyCoast",
        "getStatus"
      ],
      sixteenNodes: [
        "01_footprint_contact",
        "02_shoreline_type",
        "03_slope_admissibility",
        "04_shelf_deposition",
        "05_terrain_finger_compatibility",
        "06_elevation_compatibility",
        "07_climate_compatibility",
        "08_groundcover_compatibility",
        "09_rarity_gate",
        "10_named_beach_slot",
        "11_gratitude_generosity_naming",
        "12_climate_standard_check",
        "13_diamond_grain_restriction",
        "14_access_governed_region",
        "15_ground_view_admissibility",
        "16_surface_display_permission"
      ],
      chronologicalOrder: [
        "narrative_chronology",
        "geological_formation",
        "climate_behavior",
        "terrain_elevation_admissibility",
        "named_threshold_logic",
        "16_node_admissibility",
        "256_lattice_coastal_inspection",
        "percentage_calibration_last"
      ],
      binding: [
        "coastline_is_not_automatically_beach",
        "shelf_is_not_automatically_beach",
        "beaches_are_rare_named_threshold_regions",
        "diamond_grained_sand_reserved_for_climate_standard_beach",
        "final_names_pending_gratitude_generosity_standard",
        "land_surface_may_display_beach_only_after_authority_permission"
      ],
      readsOptionalAuthorities: {
        climate: Boolean(window.AUDRALIA_CLIMATE_RENDER?.sampleClimate || window.AUDRALIA_CLIMATE_RENDER?.sample),
        elevation: Boolean(window.AUDRALIA_ELEVATION?.sampleElevation || window.AUDRALIA_ELEVATION?.sample),
        terrainFingers: Boolean(window.AUDRALIA_TERRAIN_FINGERS?.sampleTerrainFingers || window.AUDRALIA_TERRAIN_FINGERS?.sample),
        groundcover: Boolean(window.AUDRALIA_GROUNDCOVER?.sampleGroundcover || window.AUDRALIA_GROUNDCOVER?.sample)
      },
      ownsFootprint: false,
      ownsClimate: false,
      ownsTerrainFingers: false,
      ownsElevation: false,
      ownsSurfaceColor: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsGauges: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_BEACHES = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    climateStandardBeach: CLIMATE_STANDARD_BEACH,
    beachTypes: BEACH_TYPE_FAMILY,
    nonBeachCoastTypes: NON_BEACH_COAST_TYPES,
    sampleBeach,
    sample,
    classifyCoast,
    getStatus
  });

  window.AUDRALIA_BEACHES_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaBeachesLoaded = "true";
  document.documentElement.dataset.audraliaBeachesContract = CONTRACT;
  document.documentElement.dataset.audraliaBeachesReceipt = RECEIPT;
  document.documentElement.dataset.audraliaBeachesPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.audraliaBeachesRole = "limited_special_named_threshold_beach_admissibility";
  document.documentElement.dataset.audraliaBeachesChronologyFirst = "true";
  document.documentElement.dataset.audraliaBeachesSixteenNodeConstruct = "true";
  document.documentElement.dataset.audraliaBeachesLattice256Scope = "true";
  document.documentElement.dataset.audraliaBeachesPercentageCalibrationLast = "true";
  document.documentElement.dataset.audraliaBeachesClimateStandardBeach = "true";
  document.documentElement.dataset.audraliaBeachesDiamondGrainedSand = "true";
  document.documentElement.dataset.audraliaBeachesFinalNamesHeld = "true";
  document.documentElement.dataset.audraliaBeachesGratitudeGenerosityNamingPending = "true";
  document.documentElement.dataset.audraliaBeachesCoherenceAccessGoverned = "true";
  document.documentElement.dataset.audraliaBeachesOwnsFootprint = "false";
  document.documentElement.dataset.audraliaBeachesOwnsClimate = "false";
  document.documentElement.dataset.audraliaBeachesOwnsTerrainFingers = "false";
  document.documentElement.dataset.audraliaBeachesOwnsElevation = "false";
  document.documentElement.dataset.audraliaBeachesOwnsSurfaceColor = "false";
  document.documentElement.dataset.audraliaBeachesOwnsCanvas = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
