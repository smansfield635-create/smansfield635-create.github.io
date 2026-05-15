// /assets/audralia/audralia.terrain.fingers.js
// AUDRALIA_GROUND_VIEW_ORGANIC_TERRAIN_FINGERS_TNT_v1
// Full-file replacement.
// Terrain Fingers morphology authority only.
// Purpose:
// - Creates organic terrain causes before surface/elevation paint.
// - Defines mountain fingers, ridge chains, valley cuts, cliff walls, plateau shelves, basin bowls, coastal rises, and drainage corridors.
// - Supports eventual ground-view readability.
// - Does not own land footprint.
// - Does not own climate.
// - Does not own elevation.
// - Does not own surface color.
// - Does not render canvas.
// - Does not touch runtime.
// - Does not touch Gauges.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_GROUND_VIEW_ORGANIC_TERRAIN_FINGERS_TNT_v1";
  const RECEIPT = "AUDRALIA_GROUND_VIEW_ORGANIC_TERRAIN_FINGERS_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_TERRAIN_FINGERS_HELD_OR_UNDEFINED";
  const VERSION = "2026-05-15.audralia-ground-view-organic-terrain-fingers-v1";

  const PHI = 1.618033988749895;
  const INV_PHI = 1 / PHI;

  const SUMMIT_MORPHOLOGY = Object.freeze({
    gratitude: { uplift: 0.34, basin: 0.20, ridge: 0.24, valley: 0.32, walk: 0.74 },
    generosity: { uplift: 0.26, basin: 0.28, ridge: 0.20, valley: 0.42, walk: 0.78 },
    dependability: { uplift: 0.36, basin: 0.18, ridge: 0.34, valley: 0.24, walk: 0.66 },
    accountability: { uplift: 0.48, basin: 0.12, ridge: 0.46, valley: 0.18, walk: 0.52 },
    forgiveness: { uplift: 0.22, basin: 0.36, ridge: 0.18, valley: 0.46, walk: 0.80 },
    humility: { uplift: 0.20, basin: 0.42, ridge: 0.16, valley: 0.34, walk: 0.84 },
    "self-control": { uplift: 0.44, basin: 0.14, ridge: 0.42, valley: 0.20, walk: 0.56 },
    patience: { uplift: 0.28, basin: 0.34, ridge: 0.22, valley: 0.38, walk: 0.76 },
    purity: { uplift: 0.52, basin: 0.10, ridge: 0.48, valley: 0.16, walk: 0.48 },
    stability: { uplift: 0.40, basin: 0.18, ridge: 0.38, valley: 0.24, walk: 0.64 },
    balance: { uplift: 0.32, basin: 0.26, ridge: 0.30, valley: 0.30, walk: 0.70 },
    dignity: { uplift: 0.42, basin: 0.16, ridge: 0.36, valley: 0.22, walk: 0.58 },
    peace: { uplift: 0.24, basin: 0.38, ridge: 0.18, valley: 0.44, walk: 0.82 }
  });

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

  function sharpen(value, strength = 1.2) {
    const x = clamp(value, 0, 1);
    return clamp((x - 0.5) * strength + 0.5, 0, 1);
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

  function ridgeNoise(u, v, seed, octaves = 5) {
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

    if (SUMMIT_MORPHOLOGY[key]) return key;
    if (SUMMIT_MORPHOLOGY[normalized]) return normalized;

    if (key.includes("gratitude")) return "gratitude";
    if (key.includes("generosity")) return "generosity";
    if (key.includes("depend")) return "dependability";
    if (key.includes("account")) return "accountability";
    if (key.includes("forgive")) return "forgiveness";
    if (key.includes("humility")) return "humility";
    if (key.includes("control")) return "self-control";
    if (key.includes("patience")) return "patience";
    if (key.includes("purity")) return "purity";
    if (key.includes("stability")) return "stability";
    if (key.includes("balance")) return "balance";
    if (key.includes("dignity")) return "dignity";
    if (key.includes("peace")) return "peace";

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

  function isBeachLike(map) {
    return Boolean(
      map?.isBeach ||
      map?.terrainClass === "beach" ||
      includesAny(map?.topology, ["beach", "shore", "coastline"])
    );
  }

  function morphologyAllowed(map) {
    if (!map || typeof map !== "object") return false;
    if (isOceanLike(map)) return false;
    return Boolean(map.isLand || isBeachLike(map) || map.terrainClass || map.topology || map.elevation);
  }

  function latitudeBands(map) {
    const latitude = Number(map?.latitude || 0);
    const absLat = Math.abs(latitude);

    return Object.freeze({
      latitude,
      absLat,
      equatorial: 1 - smoothstep(8, 42, absLat),
      subtropical: smoothstep(14, 32, absLat) * (1 - smoothstep(36, 54, absLat)),
      temperate: smoothstep(30, 48, absLat) * (1 - smoothstep(56, 74, absLat)),
      polar: smoothstep(58, 84, absLat)
    });
  }

  function coastalPressure(map) {
    const shelf = normalize01(map?.shelf, 0.16);
    const beachEdge = normalize01(map?.beachEdge, 0);
    const topo = [map?.terrainClass, map?.topology, map?.elevation].map(text).join(" ");
    const coastalText = includesAny(topo, ["coast", "shore", "beach", "landrise"]) ? 0.36 : 0;

    return clamp(beachEdge * 0.60 + shelf * 0.22 + coastalText, 0, 1);
  }

  function terrainTextBias(map) {
    const source = [map?.terrainClass, map?.topology, map?.elevation].map(text).join(" ");

    let mountain = 0;
    let ridge = 0;
    let valley = 0;
    let basin = 0;
    let plateau = 0;
    let cliff = 0;
    let coastal = 0;
    let drainage = 0;

    if (includesAny(source, ["mountain", "range", "peak", "alpine"])) {
      mountain += 0.36;
      ridge += 0.28;
      cliff += 0.12;
    }

    if (includesAny(source, ["ridge", "belt", "chain"])) {
      ridge += 0.38;
      mountain += 0.18;
    }

    if (includesAny(source, ["highland", "shoulder", "upland"])) {
      mountain += 0.16;
      ridge += 0.18;
      plateau += 0.16;
    }

    if (includesAny(source, ["plateau", "tableland", "old-plateau"])) {
      plateau += 0.46;
      ridge += 0.08;
    }

    if (includesAny(source, ["basin", "lowland", "depression", "dry-bowl"])) {
      basin += 0.44;
      valley += 0.12;
      drainage += 0.14;
    }

    if (includesAny(source, ["valley", "channel", "drainage", "river"])) {
      valley += 0.42;
      drainage += 0.38;
      basin += 0.12;
    }

    if (includesAny(source, ["cliff", "escarpment", "scarp", "wall"])) {
      cliff += 0.46;
      ridge += 0.14;
    }

    if (includesAny(source, ["coast", "shore", "beach", "landrise"])) {
      coastal += 0.42;
      cliff += 0.10;
      drainage += 0.10;
    }

    return Object.freeze({
      mountain: clamp(mountain, 0, 1),
      ridge: clamp(ridge, 0, 1),
      valley: clamp(valley, 0, 1),
      basin: clamp(basin, 0, 1),
      plateau: clamp(plateau, 0, 1),
      cliff: clamp(cliff, 0, 1),
      coastal: clamp(coastal, 0, 1),
      drainage: clamp(drainage, 0, 1)
    });
  }

  function computeMorphology(map) {
    const u = wrap01(Number(map?.u || 0));
    const v = clamp(Number(map?.v || 0), 0, 1);
    const cell256 = getCell256(map);
    const cell = getCellXY(cell256);
    const summit = summitKey(map);
    const summitBias = SUMMIT_MORPHOLOGY[summit] || SUMMIT_MORPHOLOGY.gratitude;
    const lat = latitudeBands(map);
    const coast = coastalPressure(map);
    const textBias = terrainTextBias(map);

    const cellPhaseX = (cell.x / 15) * PHI;
    const cellPhaseY = (cell.y / 15) * INV_PHI;

    const continentalPull = fbm(u * 0.68 + cellPhaseX, v * 0.60 - cellPhaseY, 710100, 5);
    const plateMemory = fbm(u * 1.12 - cellPhaseY, v * 0.96 + cellPhaseX, 710900, 5);
    const mountainFingerField = ridgeNoise(u * 1.86 + cellPhaseX, v * 1.38 - cellPhaseY, 711700, 5);
    const ridgeChainField = ridgeNoise(u * 3.18 - cellPhaseY, v * 2.72 + cellPhaseX, 712500, 5);
    const valleyCutField = ridgeNoise(u * 5.8 + INV_PHI, v * 4.6 - PHI, 713300, 4);
    const cliffWallField = ridgeNoise(u * 11.2 - cellPhaseX, v * 8.7 + cellPhaseY, 714100, 3);
    const basinBowlField = 1 - ridgeNoise(u * 1.42 + 0.22, v * 1.22 - 0.31, 714900, 4);
    const drainageCorridorField = ridgeNoise(u * 7.4 + cellPhaseY, v * 6.0 - cellPhaseX, 715700, 4);
    const erosionFingerField = fbm(u * 18.0 + cellPhaseX, v * 14.5 - cellPhaseY, 716500, 3);

    const mountainFinger = sharpen(clamp(
      mountainFingerField * 0.38 +
      ridgeChainField * 0.22 +
      summitBias.uplift * 0.22 +
      textBias.mountain * 0.32 +
      textBias.ridge * 0.18 +
      lat.temperate * 0.06 -
      coast * 0.08,
      0,
      1
    ), 1.16);

    const ridgeChain = sharpen(clamp(
      ridgeChainField * 0.42 +
      mountainFingerField * 0.22 +
      summitBias.ridge * 0.22 +
      textBias.ridge * 0.34 +
      textBias.mountain * 0.16 +
      erosionFingerField * 0.08,
      0,
      1
    ), 1.18);

    const valleyCut = sharpen(clamp(
      valleyCutField * 0.36 +
      drainageCorridorField * 0.28 +
      summitBias.valley * 0.22 +
      textBias.valley * 0.34 +
      basinBowlField * 0.12 +
      coast * 0.05,
      0,
      1
    ), 1.14);

    const cliffWall = sharpen(clamp(
      cliffWallField * 0.36 +
      ridgeChain * 0.24 +
      mountainFinger * 0.14 +
      textBias.cliff * 0.40 +
      coast * 0.12,
      0,
      1
    ), 1.22);

    const plateauShelf = sharpen(clamp(
      plateMemory * 0.36 +
      continentalPull * 0.20 +
      textBias.plateau * 0.44 +
      summitBias.uplift * 0.12 -
      valleyCut * 0.10 -
      cliffWall * 0.08,
      0,
      1
    ), 1.10);

    const basinBowl = sharpen(clamp(
      basinBowlField * 0.42 +
      summitBias.basin * 0.26 +
      textBias.basin * 0.36 +
      lat.subtropical * 0.10 -
      mountainFinger * 0.12 -
      ridgeChain * 0.08,
      0,
      1
    ), 1.16);

    const coastalRise = sharpen(clamp(
      coast * 0.54 +
      textBias.coastal * 0.36 +
      plateauShelf * coast * 0.22 +
      cliffWall * coast * 0.20 +
      drainageCorridorField * coast * 0.10,
      0,
      1
    ), 1.14);

    const drainageCorridor = sharpen(clamp(
      drainageCorridorField * 0.44 +
      valleyCut * 0.26 +
      basinBowl * 0.18 +
      textBias.drainage * 0.32 +
      coast * 0.10 -
      mountainFinger * 0.08,
      0,
      1
    ), 1.12);

    const walkability = clamp(
      summitBias.walk * 0.36 +
      plateauShelf * 0.22 +
      basinBowl * 0.22 +
      valleyCut * 0.18 +
      drainageCorridor * 0.12 -
      cliffWall * 0.28 -
      mountainFinger * 0.18,
      0,
      1
    );

    const climbability = clamp(
      mountainFinger * 0.36 +
      ridgeChain * 0.30 +
      cliffWall * 0.18 +
      plateauShelf * 0.08 -
      basinBowl * 0.10,
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
      coast,
      latitude: lat.latitude,
      absLatitude: lat.absLat,
      continentalPull,
      plateMemory,
      mountainFingerField,
      ridgeChainField,
      valleyCutField,
      cliffWallField,
      basinBowlField,
      drainageCorridorField,
      erosionFingerField,
      mountainFinger,
      ridgeChain,
      valleyCut,
      cliffWall,
      plateauShelf,
      basinBowl,
      coastalRise,
      drainageCorridor,
      walkability,
      climbability
    });
  }

  function classifyGroundZone(fields, map) {
    if (isOceanLike(map)) {
      return Object.freeze({
        className: "ocean-held",
        zone: "sea",
        form: "not-ground-view-land"
      });
    }

    if (isBeachLike(map)) {
      return Object.freeze({
        className: "beach-threshold",
        zone: "coastal-ground",
        form: "beach-to-land-rise"
      });
    }

    if (fields.mountainFinger > 0.72 && fields.ridgeChain > 0.58) {
      return Object.freeze({
        className: "mountain-finger",
        zone: "climbable-ridge-country",
        form: "organic-mountain-chain"
      });
    }

    if (fields.cliffWall > 0.72) {
      return Object.freeze({
        className: "cliff-wall",
        zone: fields.coastalRise > 0.48 ? "coastal-escarpment" : "interior-escarpment",
        form: "sharp-elevation-transition"
      });
    }

    if (fields.plateauShelf > 0.70) {
      return Object.freeze({
        className: "plateau-shelf",
        zone: "raised-traversable-land",
        form: "old-walkable-plateau"
      });
    }

    if (fields.basinBowl > 0.70) {
      return Object.freeze({
        className: "basin-bowl",
        zone: "low-ground-basin",
        form: "drainage-or-dry-bowl"
      });
    }

    if (fields.valleyCut > 0.68 || fields.drainageCorridor > 0.70) {
      return Object.freeze({
        className: "valley-cut",
        zone: "drainage-ground",
        form: "walkable-valley-channel"
      });
    }

    if (fields.coastalRise > 0.62) {
      return Object.freeze({
        className: "coastal-rise",
        zone: "land-behind-beach",
        form: "shore-to-interior-rise"
      });
    }

    if (fields.ridgeChain > 0.62) {
      return Object.freeze({
        className: "ridge-chain",
        zone: "rolling-ridge-land",
        form: "long-ground-ridge"
      });
    }

    return Object.freeze({
      className: "organic-ground",
      zone: "mixed-traversable-land",
      form: "weathered-ground-field"
    });
  }

  function sampleTerrainFingers(map) {
    const allowed = morphologyAllowed(map);
    const fields = computeMorphology(map || {});
    const classification = classifyGroundZone(fields, map || {});

    if (!allowed) {
      return Object.freeze({
        allowed: false,
        reason: isOceanLike(map) ? "terrain_fingers_hold_ocean" : "terrain_fingers_hold_non_land",
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        version: VERSION,
        mountainFinger: 0,
        ridgeChain: 0,
        valleyCut: 0,
        cliffWall: 0,
        plateauShelf: 0,
        basinBowl: 0,
        coastalRise: 0,
        drainageCorridor: 0,
        walkability: 0,
        climbability: 0,
        class: classification.className,
        zone: classification.zone,
        form: classification.form,
        ownsFootprint: false,
        ownsClimate: false,
        ownsElevation: false,
        ownsSurfaceColor: false,
        ownsCanvas: false,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      });
    }

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-ground-view-organic-terrain-fingers",
      mathBinding: "high_order_computable_planetary_math",
      cell256: fields.cell256,
      cellX: fields.cellX,
      cellY: fields.cellY,
      summit: fields.summit,
      latitude: fields.latitude,
      mountainFinger: fields.mountainFinger,
      ridgeChain: fields.ridgeChain,
      valleyCut: fields.valleyCut,
      cliffWall: fields.cliffWall,
      plateauShelf: fields.plateauShelf,
      basinBowl: fields.basinBowl,
      coastalRise: fields.coastalRise,
      drainageCorridor: fields.drainageCorridor,
      walkability: fields.walkability,
      climbability: fields.climbability,
      class: classification.className,
      zone: classification.zone,
      form: classification.form,
      rawFields: {
        continentalPull: fields.continentalPull,
        plateMemory: fields.plateMemory,
        mountainFingerField: fields.mountainFingerField,
        ridgeChainField: fields.ridgeChainField,
        valleyCutField: fields.valleyCutField,
        cliffWallField: fields.cliffWallField,
        basinBowlField: fields.basinBowlField,
        drainageCorridorField: fields.drainageCorridorField,
        erosionFingerField: fields.erosionFingerField
      },
      groundViewAdmissible: true,
      orbitViewCause: true,
      ownsFootprint: false,
      ownsClimate: false,
      ownsElevation: false,
      ownsSurfaceColor: false,
      ownsCanvas: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function sample(map) {
    return sampleTerrainFingers(map);
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-terrain-fingers-morphology-authority",
      role: "organic_ground_view_terrain_cause_field",
      mathBinding: "high_order_computable_planetary_math",
      exposes: [
        "sampleTerrainFingers",
        "sample",
        "getStatus"
      ],
      fields: [
        "mountainFinger",
        "ridgeChain",
        "valleyCut",
        "cliffWall",
        "plateauShelf",
        "basinBowl",
        "coastalRise",
        "drainageCorridor",
        "walkability",
        "climbability",
        "class",
        "zone",
        "form"
      ],
      uses: [
        "spherical_uv_sampling",
        "256_cell_lattice_anchor",
        "16_by_16_cell_coordinates",
        "phi_scaled_fields",
        "summit_morphology_bias",
        "coastal_falloff",
        "ridge_noise",
        "basin_bowl_field",
        "drainage_corridor_field",
        "erosion_finger_field",
        "latitude_band_pressure"
      ],
      groundViewAdmissibilityLaw: [
        "visible_ridge_implies_walkable_or_climbable_ridge_system",
        "visible_basin_implies_lower_terrain_or_drainage_bowl",
        "visible_coastal_band_implies_beach_shelf_rise",
        "visible_cliff_implies_sharp_elevation_transition",
        "visible_plateau_implies_raised_traversable_land_shelf"
      ],
      ownsFootprint: false,
      ownsClimate: false,
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

  window.AUDRALIA_TERRAIN_FINGERS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    sampleTerrainFingers,
    sample,
    getStatus
  });

  window.AUDRALIA_TERRAIN_FINGERS_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaTerrainFingersLoaded = "true";
  document.documentElement.dataset.audraliaTerrainFingersContract = CONTRACT;
  document.documentElement.dataset.audraliaTerrainFingersReceipt = RECEIPT;
  document.documentElement.dataset.audraliaTerrainFingersPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.audraliaTerrainFingersRole = "organic_ground_view_terrain_cause_field";
  document.documentElement.dataset.audraliaTerrainFingersMathBinding = "high_order_computable_planetary_math";
  document.documentElement.dataset.audraliaTerrainFingersGroundViewAdmissible = "true";
  document.documentElement.dataset.audraliaTerrainFingersMountainFinger = "true";
  document.documentElement.dataset.audraliaTerrainFingersRidgeChain = "true";
  document.documentElement.dataset.audraliaTerrainFingersValleyCut = "true";
  document.documentElement.dataset.audraliaTerrainFingersCliffWall = "true";
  document.documentElement.dataset.audraliaTerrainFingersPlateauShelf = "true";
  document.documentElement.dataset.audraliaTerrainFingersBasinBowl = "true";
  document.documentElement.dataset.audraliaTerrainFingersCoastalRise = "true";
  document.documentElement.dataset.audraliaTerrainFingersDrainageCorridor = "true";
  document.documentElement.dataset.audraliaTerrainFingersOwnsFootprint = "false";
  document.documentElement.dataset.audraliaTerrainFingersOwnsClimate = "false";
  document.documentElement.dataset.audraliaTerrainFingersOwnsElevation = "false";
  document.documentElement.dataset.audraliaTerrainFingersOwnsSurfaceColor = "false";
  document.documentElement.dataset.audraliaTerrainFingersOwnsCanvas = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
