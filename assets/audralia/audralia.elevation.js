// /assets/audralia/audralia.elevation.js
// AUDRALIA_256_LATTICE_ELEVATION_DEPTH_FIELD_TNT_v1
// Full-file replacement.
// Elevation authority only.
// Purpose:
// - Gives Audralia computable elevation depth: mountains, ridges, cliffs, valleys, basins, plateaus, coastal rise, snowline, and shadow pressure.
// - Uses 256 lattice anchoring, φ-scaled fields, summit uplift, coastal falloff, basin depression, ridge probability, and latitude pressure.
// - Does not own footprint.
// - Does not own climate.
// - Does not own surface color.
// - Does not render canvas.
// - Does not touch runtime.
// - Does not touch Gauges.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_256_LATTICE_ELEVATION_DEPTH_FIELD_TNT_v1";
  const RECEIPT = "AUDRALIA_256_LATTICE_ELEVATION_DEPTH_FIELD_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_ELEVATION_HELD_OR_UNDEFINED";
  const VERSION = "2026-05-15.audralia-256-lattice-elevation-depth-field-v1";

  const PHI = 1.618033988749895;
  const INV_PHI = 1 / PHI;

  const SUMMIT_UPLIFT = Object.freeze({
    gratitude: 0.38,
    generosity: 0.24,
    dependability: 0.32,
    accountability: 0.44,
    forgiveness: 0.18,
    humility: 0.22,
    "self-control": 0.40,
    patience: 0.28,
    purity: 0.46,
    stability: 0.36
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

    if (SUMMIT_UPLIFT[key] !== undefined) return key;
    if (SUMMIT_UPLIFT[normalized] !== undefined) return normalized;

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

  function landAllowed(map) {
    if (!map || typeof map !== "object") return false;
    if (isOceanLike(map)) return false;
    return Boolean(map.isLand || map.terrainClass || map.topology || map.elevation);
  }

  function coastalPressure(map) {
    const shelf = normalize01(map?.shelf, 0.18);
    const beachEdge = normalize01(map?.beachEdge, 0);
    const topo = [map?.terrainClass, map?.topology, map?.elevation].map(text).join(" ");
    const coastalText = includesAny(topo, ["coast", "shore", "beach", "landrise"]) ? 0.34 : 0;

    return clamp(beachEdge * 0.58 + shelf * 0.22 + coastalText, 0, 1);
  }

  function latitudePressure(map) {
    const latitude = Number(map?.latitude || 0);
    const absLat = Math.abs(latitude);

    return Object.freeze({
      latitude,
      absLat,
      equatorial: 1 - smoothstep(8, 42, absLat),
      temperate: smoothstep(14, 38, absLat) * (1 - smoothstep(48, 72, absLat)),
      polar: smoothstep(54, 82, absLat),
      snowline: smoothstep(45, 76, absLat)
    });
  }

  function landformBias(map) {
    const source = [map?.terrainClass, map?.topology, map?.elevation].map(text).join(" ");

    let uplift = 0;
    let basin = 0;
    let ridge = 0;
    let cliff = 0;
    let plateau = 0;
    let valley = 0;

    if (includesAny(source, ["mountain", "range", "ridge", "peak", "alpine"])) {
      uplift += 0.34;
      ridge += 0.32;
      cliff += 0.18;
    }

    if (includesAny(source, ["highland", "shoulder", "upland"])) {
      uplift += 0.22;
      plateau += 0.18;
      ridge += 0.10;
    }

    if (includesAny(source, ["plateau", "tableland"])) {
      uplift += 0.16;
      plateau += 0.36;
    }

    if (includesAny(source, ["basin", "lowland", "depression"])) {
      basin += 0.42;
      valley += 0.12;
    }

    if (includesAny(source, ["valley", "drainage", "river"])) {
      valley += 0.34;
      basin += 0.16;
    }

    if (includesAny(source, ["cliff", "escarpment", "scarp"])) {
      cliff += 0.42;
      ridge += 0.14;
    }

    if (includesAny(source, ["coast", "shore", "landrise"])) {
      cliff += 0.10;
      uplift += 0.08;
    }

    return Object.freeze({
      uplift: clamp(uplift, 0, 1),
      basin: clamp(basin, 0, 1),
      ridge: clamp(ridge, 0, 1),
      cliff: clamp(cliff, 0, 1),
      plateau: clamp(plateau, 0, 1),
      valley: clamp(valley, 0, 1)
    });
  }

  function computeFields(map) {
    const u = wrap01(Number(map?.u || 0));
    const v = clamp(Number(map?.v || 0), 0, 1);
    const cell256 = getCell256(map);
    const cell = getCellXY(cell256);
    const lat = latitudePressure(map);
    const coast = coastalPressure(map);
    const bias = landformBias(map);
    const summit = summitKey(map);

    const cellPhaseX = (cell.x / 15) * PHI;
    const cellPhaseY = (cell.y / 15) * INV_PHI;
    const summitUplift = SUMMIT_UPLIFT[summit] ?? 0.30;

    const broadUplift = fbm(u * 0.72 + cellPhaseX, v * 0.66 - cellPhaseY, 610100, 5);
    const ancientPlate = fbm(u * 1.18 - cellPhaseY, v * 1.03 + cellPhaseX, 610900, 5);
    const mountainBelt = ridgeNoise(u * 1.72 + cellPhaseX, v * 1.42 - cellPhaseY, 611700, 5);
    const fineRidge = ridgeNoise(u * 4.8 - cellPhaseY, v * 3.9 + cellPhaseX, 612500, 4);
    const basinField = 1 - ridgeNoise(u * 1.36 + 0.31, v * 1.18 - 0.27, 613300, 4);
    const drainage = ridgeNoise(u * 7.6 + 0.17, v * 6.1 - 0.39, 614100, 3);
    const fracture = ridgeNoise(u * 13.4 - cellPhaseX, v * 10.8 + cellPhaseY, 614900, 3);
    const erosion = fbm(u * 18.0 + cellPhaseY, v * 15.5 - cellPhaseX, 615700, 3);

    const summitBand =
      summit === "purity" || summit === "accountability" || summit === "self-control"
        ? 0.16
        : summit === "gratitude" || summit === "stability" || summit === "dependability"
          ? 0.10
          : 0.06;

    let elevation01 =
      broadUplift * 0.26 +
      ancientPlate * 0.20 +
      mountainBelt * 0.24 +
      fineRidge * 0.10 +
      summitUplift * 0.16 +
      bias.uplift * 0.24 +
      summitBand;

    elevation01 -= basinField * (0.12 + bias.basin * 0.26);
    elevation01 -= drainage * bias.valley * 0.16;
    elevation01 += coast * 0.08;

    if (isBeachLike(map)) {
      elevation01 = Math.min(elevation01, 0.18 + coast * 0.10);
    }

    elevation01 = clamp(elevation01, 0, 1);

    const ridge = clamp(mountainBelt * 0.48 + fineRidge * 0.34 + bias.ridge * 0.34 + fracture * 0.10, 0, 1);
    const basin = clamp(basinField * 0.54 + bias.basin * 0.42 + (1 - elevation01) * 0.22, 0, 1);
    const valley = clamp(drainage * 0.44 + basin * 0.22 + bias.valley * 0.42, 0, 1);
    const plateau = clamp(ancientPlate * 0.30 + bias.plateau * 0.46 + smoothstep(0.44, 0.70, elevation01) * 0.24, 0, 1);
    const mountain = clamp(smoothstep(0.58, 0.84, elevation01) * 0.52 + ridge * 0.42 + bias.ridge * 0.18, 0, 1);
    const cliff = clamp(fracture * 0.34 + smoothstep(0.56, 0.88, ridge) * 0.28 + bias.cliff * 0.42 + coast * 0.12, 0, 1);

    const localRelief = clamp(
      Math.abs(mountainBelt - basinField) * 0.36 +
      fineRidge * 0.28 +
      fracture * 0.18 +
      mountain * 0.22,
      0,
      1
    );

    const slope = clamp(
      fineRidge * 0.30 +
      fracture * 0.24 +
      ridge * 0.20 +
      cliff * 0.24 +
      mountain * 0.18 -
      plateau * 0.08,
      0,
      1
    );

    const relief = clamp(localRelief * 0.54 + elevation01 * 0.28 + mountain * 0.28 + cliff * 0.18, 0, 1);
    const coastalRise = clamp(coast * smoothstep(0.18, 0.56, elevation01) + cliff * coast * 0.24, 0, 1);
    const shadowPressure = clamp(slope * 0.32 + cliff * 0.34 + mountain * 0.26 + valley * 0.16, 0, 1);
    const snowline = clamp(lat.snowline * 0.46 + mountain * 0.42 + smoothstep(0.68, 0.92, elevation01) * 0.28, 0, 1);

    return Object.freeze({
      u,
      v,
      cell256,
      cellX: cell.x,
      cellY: cell.y,
      latitude: lat.latitude,
      absLatitude: lat.absLat,
      summit,
      coast,
      broadUplift,
      ancientPlate,
      mountainBelt,
      fineRidge,
      basinField,
      drainage,
      fracture,
      erosion,
      elevation01: clamp(elevation01, 0, 1),
      height: clamp(elevation01, 0, 1),
      altitude: clamp(elevation01, 0, 1),
      relief,
      slope,
      basin,
      ridge,
      mountain,
      cliff,
      plateau,
      valley,
      coastalRise,
      snowline,
      shadowPressure
    });
  }

  function classify(fields, map) {
    if (isOceanLike(map)) {
      return Object.freeze({
        className: "sea",
        zone: "sea-level",
        form: "ocean-floor-held"
      });
    }

    if (isBeachLike(map)) {
      return Object.freeze({
        className: "beach-rise",
        zone: "coastal",
        form: "beach-to-land-rise"
      });
    }

    if (fields.snowline > 0.72 && fields.elevation01 > 0.62) {
      return Object.freeze({
        className: "snow-alpine",
        zone: "alpine",
        form: "snowline-mountain"
      });
    }

    if (fields.mountain > 0.72 && fields.ridge > 0.62) {
      return Object.freeze({
        className: "mountain",
        zone: "mountain-belt",
        form: "ancient-mountain-range"
      });
    }

    if (fields.cliff > 0.70 && fields.coastalRise > 0.42) {
      return Object.freeze({
        className: "cliff",
        zone: "coastal-escarpment",
        form: "coastal-cliff-rise"
      });
    }

    if (fields.cliff > 0.72) {
      return Object.freeze({
        className: "cliff",
        zone: "interior-escarpment",
        form: "fracture-cliff"
      });
    }

    if (fields.plateau > 0.68 && fields.elevation01 > 0.48) {
      return Object.freeze({
        className: "plateau",
        zone: "raised-tableland",
        form: "ancient-plateau"
      });
    }

    if (fields.valley > 0.68 && fields.basin > 0.50) {
      return Object.freeze({
        className: "valley",
        zone: "drainage-basin",
        form: "valley-channel"
      });
    }

    if (fields.basin > 0.72) {
      return Object.freeze({
        className: "basin",
        zone: "low-interior",
        form: "ancient-basin"
      });
    }

    if (fields.coastalRise > 0.54) {
      return Object.freeze({
        className: "coastal-rise",
        zone: "coastal-landrise",
        form: "raised-terrain-behind-beach"
      });
    }

    if (fields.elevation01 > 0.58 || fields.relief > 0.58) {
      return Object.freeze({
        className: "highland",
        zone: "highland",
        form: "highland-shoulder"
      });
    }

    return Object.freeze({
      className: "plain",
      zone: "rolling-lowland",
      form: "weathered-plain"
    });
  }

  function sampleElevation(map) {
    const allowed = landAllowed(map);
    const fields = computeFields(map || {});
    const classification = classify(fields, map || {});

    if (!allowed) {
      return Object.freeze({
        allowed: false,
        reason: isOceanLike(map) ? "elevation_authority_holds_ocean_at_sea_level" : "elevation_authority_holds_non_land",
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        version: VERSION,
        elevation01: 0,
        height: 0,
        altitude: 0,
        relief: 0,
        slope: 0,
        basin: 0,
        ridge: 0,
        mountain: 0,
        cliff: 0,
        plateau: 0,
        valley: 0,
        coastalRise: 0,
        snowline: 0,
        shadowPressure: 0,
        class: classification.className,
        zone: classification.zone,
        form: classification.form,
        ownsFootprint: false,
        ownsClimate: false,
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
      authority: "audralia-256-lattice-elevation-depth-field",
      mathBinding: "high_order_computable_planetary_math",
      cell256: fields.cell256,
      cellX: fields.cellX,
      cellY: fields.cellY,
      summit: fields.summit,
      elevation01: fields.elevation01,
      height: fields.height,
      altitude: fields.altitude,
      relief: fields.relief,
      slope: fields.slope,
      basin: fields.basin,
      ridge: fields.ridge,
      mountain: fields.mountain,
      cliff: fields.cliff,
      plateau: fields.plateau,
      valley: fields.valley,
      coastalRise: fields.coastalRise,
      snowline: fields.snowline,
      shadowPressure: fields.shadowPressure,
      class: classification.className,
      zone: classification.zone,
      form: classification.form,
      broadUplift: fields.broadUplift,
      ancientPlate: fields.ancientPlate,
      mountainBelt: fields.mountainBelt,
      fineRidge: fields.fineRidge,
      basinField: fields.basinField,
      drainage: fields.drainage,
      fracture: fields.fracture,
      erosion: fields.erosion,
      ownsFootprint: false,
      ownsClimate: false,
      ownsSurfaceColor: false,
      ownsCanvas: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function sample(map) {
    return sampleElevation(map);
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-elevation-depth-field",
      role: "computable_vertical_depth_authority",
      mathBinding: "high_order_computable_planetary_math",
      exposes: [
        "sampleElevation",
        "sample",
        "getStatus"
      ],
      fields: [
        "elevation01",
        "height",
        "altitude",
        "relief",
        "slope",
        "basin",
        "ridge",
        "mountain",
        "cliff",
        "plateau",
        "valley",
        "coastalRise",
        "snowline",
        "shadowPressure",
        "class",
        "zone",
        "form"
      ],
      uses: [
        "spherical_uv_sampling",
        "256_cell_lattice_anchor",
        "16_by_16_cell_coordinates",
        "phi_scaled_fields",
        "summit_uplift",
        "ridge_noise",
        "basin_depression",
        "coastal_falloff",
        "latitude_snowline",
        "fracture_and_cliff_pressure",
        "erosion_grain",
        "valley_drainage"
      ],
      ownsFootprint: false,
      ownsClimate: false,
      ownsSurfaceColor: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsGauges: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_ELEVATION = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    sampleElevation,
    sample,
    getStatus
  });

  window.AUDRALIA_ELEVATION_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaElevationLoaded = "true";
  document.documentElement.dataset.audraliaElevationContract = CONTRACT;
  document.documentElement.dataset.audraliaElevationReceipt = RECEIPT;
  document.documentElement.dataset.audraliaElevationPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.audraliaElevationRole = "computable_vertical_depth_authority";
  document.documentElement.dataset.audraliaElevationMathBinding = "high_order_computable_planetary_math";
  document.documentElement.dataset.audraliaElevationLattice256 = "true";
  document.documentElement.dataset.audraliaElevationMountains = "true";
  document.documentElement.dataset.audraliaElevationCliffs = "true";
  document.documentElement.dataset.audraliaElevationBasins = "true";
  document.documentElement.dataset.audraliaElevationPlateaus = "true";
  document.documentElement.dataset.audraliaElevationValleys = "true";
  document.documentElement.dataset.audraliaElevationCoastalRise = "true";
  document.documentElement.dataset.audraliaElevationSnowline = "true";
  document.documentElement.dataset.audraliaElevationOwnsFootprint = "false";
  document.documentElement.dataset.audraliaElevationOwnsClimate = "false";
  document.documentElement.dataset.audraliaElevationOwnsSurfaceColor = "false";
  document.documentElement.dataset.audraliaElevationOwnsCanvas = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
