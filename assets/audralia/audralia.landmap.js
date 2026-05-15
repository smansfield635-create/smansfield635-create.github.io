// /assets/audralia/audralia.landmap.js
// AUDRALIA_30_BILLION_YEAR_EARTH_LEGACY_ORGANIC_LANDFORM_TNT_v1
// Full-file replacement.
// Landmap owns footprint authority.
// Uses 256 nodal lattice influence and Nine Summits province fields to shape organic landforms.
// Builds from Earth legacy into Audralia's 30-billion-year high-technology stewardship world expression.
// Canvas remains consumer-only.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_30_BILLION_YEAR_EARTH_LEGACY_ORGANIC_LANDFORM_TNT_v1";
  const RECEIPT = "AUDRALIA_30_BILLION_YEAR_EARTH_LEGACY_ORGANIC_LANDFORM_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_LANDMASS_AND_BEACH_FOOTPRINT_RENEWAL_TNT_v1";
  const VERSION = "2026-05-15.audralia-30-billion-year-earth-legacy-organic-landform-v1";

  const TARGET = Object.freeze({
    landRatioApprox: "30_to_45_percent",
    oceanRatioApprox: "55_to_70_percent",
    earthLegacy: true,
    thirtyBillionYearFuture: true,
    highTechnologyHiddenInsideNature: true,
    stewardshipWorld: true,
    lattice256AsHiddenScaffold: true,
    nineSummitsAsProvinceFields: true,
    majorLandmasses: true,
    organicCoastlines: true,
    beachesAndShelves: true,
    canvasOwnsFootprint: false
  });

  const SUMMIT_PROVINCES = Object.freeze([
    {
      name: "Gratitude",
      role: "fertile_lowlands",
      landPressure: 0.020,
      ridge: 0.10,
      basin: 0.34,
      shelf: 0.18,
      beach: 0.22,
      coastBite: 0.10,
      green: 0.30,
      technology: "soil_memory"
    },
    {
      name: "Balance",
      role: "stable_shelves",
      landPressure: 0.012,
      ridge: 0.16,
      basin: 0.16,
      shelf: 0.32,
      beach: 0.18,
      coastBite: 0.12,
      green: 0.20,
      technology: "shelf_stabilization"
    },
    {
      name: "Stability",
      role: "ancient_craton_cores",
      landPressure: 0.030,
      ridge: 0.20,
      basin: 0.08,
      shelf: 0.14,
      beach: 0.12,
      coastBite: 0.06,
      green: 0.16,
      technology: "deep_craton_anchor"
    },
    {
      name: "Peace",
      role: "wetlands_and_protected_bays",
      landPressure: 0.004,
      ridge: 0.06,
      basin: 0.40,
      shelf: 0.25,
      beach: 0.20,
      coastBite: 0.16,
      green: 0.27,
      technology: "quiet_water_routing"
    },
    {
      name: "Joy",
      role: "bright_coasts_and_island_chains",
      landPressure: 0.010,
      ridge: 0.10,
      basin: 0.15,
      shelf: 0.24,
      beach: 0.36,
      coastBite: 0.24,
      green: 0.25,
      technology: "living_coast_light"
    },
    {
      name: "Dignity",
      role: "mountain_belts_and_mineral_pressure",
      landPressure: 0.022,
      ridge: 0.44,
      basin: 0.06,
      shelf: 0.11,
      beach: 0.09,
      coastBite: 0.10,
      green: 0.12,
      technology: "mineral_memory"
    },
    {
      name: "Free Will",
      role: "peninsulas_straits_and_branching_edges",
      landPressure: -0.002,
      ridge: 0.18,
      basin: 0.10,
      shelf: 0.22,
      beach: 0.18,
      coastBite: 0.42,
      green: 0.15,
      technology: "branching_frontier_edges"
    },
    {
      name: "Love",
      role: "sheltered_valleys_and_habitable_basins",
      landPressure: 0.016,
      ridge: 0.12,
      basin: 0.32,
      shelf: 0.20,
      beach: 0.24,
      coastBite: 0.12,
      green: 0.34,
      technology: "protected_habitation_warmth"
    },
    {
      name: "Stewardship",
      role: "restoration_belts_and_green_infrastructure",
      landPressure: 0.018,
      ridge: 0.14,
      basin: 0.22,
      shelf: 0.28,
      beach: 0.20,
      coastBite: 0.14,
      green: 0.40,
      technology: "hidden_ecological_infrastructure"
    }
  ]);

  const LAND_BODIES = Object.freeze([
    {
      id: "mainland",
      label: "Mainland",
      className: "dominant-continental-body",
      lon: -28,
      lat: 8,
      rx: 61,
      ry: 34,
      weight: 1.02,
      tilt: -13,
      family: "continental"
    },
    {
      id: "northwest-mainland-lobe",
      label: "Northwest Mainland Lobe",
      className: "continental-lobe",
      lon: -62,
      lat: 25,
      rx: 35,
      ry: 22,
      weight: 0.58,
      tilt: 8,
      family: "continental"
    },
    {
      id: "southern-mainland-lobe",
      label: "Southern Mainland Lobe",
      className: "continental-lobe",
      lon: -8,
      lat: -18,
      rx: 37,
      ry: 24,
      weight: 0.68,
      tilt: -22,
      family: "continental"
    },
    {
      id: "southwest-mainland-shoulder",
      label: "Southwest Mainland Shoulder",
      className: "coastal-shoulder",
      lon: -48,
      lat: -24,
      rx: 23,
      ry: 20,
      weight: 0.38,
      tilt: 34,
      family: "continental"
    },
    {
      id: "eastern-subcontinent",
      label: "Eastern Subcontinent",
      className: "subcontinental-body",
      lon: 78,
      lat: -2,
      rx: 43,
      ry: 31,
      weight: 0.82,
      tilt: 18,
      family: "subcontinental"
    },
    {
      id: "northeast-eastern-lobe",
      label: "Northeast Eastern Lobe",
      className: "subcontinental-lobe",
      lon: 112,
      lat: 18,
      rx: 27,
      ry: 22,
      weight: 0.50,
      tilt: -8,
      family: "subcontinental"
    },
    {
      id: "southeast-eastern-lobe",
      label: "Southeast Eastern Lobe",
      className: "subcontinental-lobe",
      lon: 62,
      lat: -31,
      rx: 30,
      ry: 21,
      weight: 0.43,
      tilt: -26,
      family: "subcontinental"
    },
    {
      id: "western-continent",
      label: "Western Continent",
      className: "major-western-body",
      lon: -134,
      lat: -10,
      rx: 34,
      ry: 34,
      weight: 0.69,
      tilt: 5,
      family: "continental"
    },
    {
      id: "northwest-island-mass",
      label: "Northwest Island Mass",
      className: "large-island-body",
      lon: -152,
      lat: 18,
      rx: 22,
      ry: 20,
      weight: 0.33,
      tilt: -16,
      family: "large-island"
    },
    {
      id: "southern-landmass",
      label: "Southern Landmass",
      className: "southern-subcontinental-body",
      lon: 12,
      lat: -48,
      rx: 49,
      ry: 21,
      weight: 0.60,
      tilt: 4,
      family: "subcontinental"
    },
    {
      id: "southeast-southern-lobe",
      label: "Southeast Southern Lobe",
      className: "southern-large-island-lobe",
      lon: 54,
      lat: -53,
      rx: 24,
      ry: 16,
      weight: 0.30,
      tilt: -18,
      family: "large-island"
    },
    {
      id: "north-polar-land",
      label: "North Polar Land",
      className: "north-polar-landmass",
      lon: 150,
      lat: 66,
      rx: 39,
      ry: 16,
      weight: 0.35,
      tilt: 7,
      family: "polar"
    },
    {
      id: "northwest-polar-land",
      label: "Northwest Polar Land",
      className: "northwest-polar-landmass",
      lon: -118,
      lat: 68,
      rx: 31,
      ry: 14,
      weight: 0.30,
      tilt: -10,
      family: "polar"
    }
  ]);

  const OCEAN_CUTS = Object.freeze([
    {
      id: "central-western-seaway",
      lon: -88,
      lat: 2,
      rx: 24,
      ry: 46,
      weight: 0.17,
      tilt: -7
    },
    {
      id: "central-eastern-seaway",
      lon: 34,
      lat: 18,
      rx: 20,
      ry: 42,
      weight: 0.15,
      tilt: 12
    },
    {
      id: "southern-basin",
      lon: -78,
      lat: -52,
      rx: 38,
      ry: 22,
      weight: 0.12,
      tilt: 4
    },
    {
      id: "equatorial-blue-channel",
      lon: 152,
      lat: -4,
      rx: 26,
      ry: 30,
      weight: 0.12,
      tilt: -18
    },
    {
      id: "future-strait-field",
      lon: -4,
      lat: 2,
      rx: 17,
      ry: 54,
      weight: 0.09,
      tilt: -18
    },
    {
      id: "joy-island-sea",
      lon: 118,
      lat: -38,
      rx: 21,
      ry: 26,
      weight: 0.075,
      tilt: 22
    }
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function wrapLongitudeDelta(lon, centerLon) {
    return ((lon - centerLon + 540) % 360) - 180;
  }

  function degToRad(value) {
    return value * Math.PI / 180;
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
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function uvToLonLat(u, v) {
    return Object.freeze({
      longitude: wrap01(u) * 360 - 180,
      latitude: 90 - clamp(v, 0, 1) * 180
    });
  }

  function defaultCells(u, v) {
    const col16 = clamp(Math.floor(wrap01(u) * 16), 0, 15);
    const row16 = clamp(Math.floor(clamp(v, 0, 1) * 16), 0, 15);

    return Object.freeze({
      cell256: row16 * 16 + col16 + 1,
      cell64: Math.floor(row16 / 2) * 8 + Math.floor(col16 / 2) + 1,
      cell16: Math.floor(row16 / 4) * 4 + Math.floor(col16 / 4) + 1,
      row16,
      col16
    });
  }

  function latticeCells(u, v) {
    try {
      const lattice = window.AUDRALIA_LATTICE256;
      if (lattice && typeof lattice.coordinatesFromUV === "function") {
        const result = lattice.coordinatesFromUV(u, v);
        if (result && Number.isFinite(Number(result.cell256))) {
          const fallback = defaultCells(u, v);
          return Object.freeze({
            cell256: Number(result.cell256),
            cell64: Number.isFinite(Number(result.cell64)) ? Number(result.cell64) : fallback.cell64,
            cell16: Number.isFinite(Number(result.cell16)) ? Number(result.cell16) : fallback.cell16,
            row16: Number.isFinite(Number(result.row16)) ? Number(result.row16) : fallback.row16,
            col16: Number.isFinite(Number(result.col16)) ? Number(result.col16) : fallback.col16
          });
        }
      }
    } catch {
      return defaultCells(u, v);
    }

    return defaultCells(u, v);
  }

  function quadrantFrom(lon, lat) {
    if (lat >= 0 && lon >= 0) return "NE";
    if (lat >= 0 && lon < 0) return "NW";
    if (lat < 0 && lon >= 0) return "SE";
    return "SW";
  }

  function bandFrom(lat) {
    const abs = Math.abs(lat);
    if (abs >= 72) return lat >= 0 ? "north-polar" : "south-polar";
    if (abs >= 48) return lat >= 0 ? "north-cool-temperate" : "south-cool-temperate";
    if (abs >= 25) return lat >= 0 ? "north-temperate" : "south-temperate";
    if (abs >= 10) return lat >= 0 ? "north-subtropical" : "south-subtropical";
    return "equatorial";
  }

  function summitProvinceFor(cells, lon, lat) {
    const region = Math.floor(cells.col16 / 4) + Math.floor(cells.row16 / 4) * 4;
    const longitudeBand = Math.floor((lon + 180) / 45);
    const latitudeBand = Math.floor((lat + 90) / 30);
    const index = (region + longitudeBand + latitudeBand + cells.cell64) % SUMMIT_PROVINCES.length;
    return SUMMIT_PROVINCES[index];
  }

  function nodalInfluence(u, v, cells) {
    let landPull = 0;
    let coastBite = 0;
    let shelfWidth = 0;
    let beachSoftness = 0;
    let ridge = 0;
    let basin = 0;
    let peninsula = 0;
    let greenBelt = 0;
    let technology = 0;
    let norm = 0;

    for (let oy = -1; oy <= 1; oy += 1) {
      const row = cells.row16 + oy;
      if (row < 0 || row > 15) continue;

      for (let ox = -1; ox <= 1; ox += 1) {
        const col = (cells.col16 + ox + 16) % 16;
        const centerU = (col + 0.5) / 16;
        const centerV = (row + 0.5) / 16;
        const du = ((u - centerU + 0.5) % 1) - 0.5;
        const dv = v - centerV;
        const d = Math.sqrt((du * 16) * (du * 16) + (dv * 16) * (dv * 16));
        const w = 1 - smoothstep(0.0, 1.42, d);

        if (w <= 0) continue;

        const a = hash(col, row, 1001);
        const b = hash(col, row, 2002);
        const c = hash(col, row, 3003);
        const d2 = hash(col, row, 4004);
        const e = hash(col, row, 5005);
        const f = hash(col, row, 6006);
        const g = hash(col, row, 7007);
        const h = hash(col, row, 8008);
        const i = hash(col, row, 9009);

        landPull += ((a - 0.5) * 2) * w;
        coastBite += b * w;
        shelfWidth += c * w;
        beachSoftness += d2 * w;
        ridge += e * w;
        basin += f * w;
        peninsula += g * w;
        greenBelt += h * w;
        technology += i * w;
        norm += w;
      }
    }

    const n = Math.max(0.000001, norm);

    return Object.freeze({
      landPull: clamp(landPull / n, -1, 1),
      coastBite: clamp(coastBite / n, 0, 1),
      shelfWidth: clamp(shelfWidth / n, 0, 1),
      beachSoftness: clamp(beachSoftness / n, 0, 1),
      ridge: clamp(ridge / n, 0, 1),
      basin: clamp(basin / n, 0, 1),
      peninsula: clamp(peninsula / n, 0, 1),
      greenBelt: clamp(greenBelt / n, 0, 1),
      technology: clamp(technology / n, 0, 1)
    });
  }

  function landLobeScore(lon, lat, body) {
    const dx = wrapLongitudeDelta(lon, body.lon);
    const dy = lat - body.lat;
    const tilt = degToRad(body.tilt || 0);
    const cos = Math.cos(tilt);
    const sin = Math.sin(tilt);
    const x = (dx * cos + dy * sin) / body.rx;
    const y = (-dx * sin + dy * cos) / body.ry;
    const d = Math.sqrt(x * x + y * y);

    return body.weight * (1 - d);
  }

  function nearestLandBody(lon, lat) {
    let best = LAND_BODIES[0];
    let bestScore = -Infinity;

    for (const body of LAND_BODIES) {
      const score = landLobeScore(lon, lat, body);
      if (score > bestScore) {
        bestScore = score;
        best = body;
      }
    }

    return Object.freeze({
      body: best,
      score: bestScore
    });
  }

  function oceanCutScore(lon, lat, cut) {
    const dx = wrapLongitudeDelta(lon, cut.lon);
    const dy = lat - cut.lat;
    const tilt = degToRad(cut.tilt || 0);
    const cos = Math.cos(tilt);
    const sin = Math.sin(tilt);
    const x = (dx * cos + dy * sin) / cut.rx;
    const y = (-dx * sin + dy * cos) / cut.ry;
    const d = Math.sqrt(x * x + y * y);

    return cut.weight * Math.max(0, 1 - d);
  }

  function landFieldDetails(u, v) {
    const { longitude, latitude } = uvToLonLat(u, v);
    const cells = latticeCells(u, v);
    const province = summitProvinceFor(cells, longitude, latitude);
    const nodal = nodalInfluence(u, v, cells);

    let bestScore = -Infinity;
    let linkedPressure = 0;

    for (const body of LAND_BODIES) {
      const score = landLobeScore(longitude, latitude, body);
      bestScore = Math.max(bestScore, score);
      linkedPressure += Math.pow(Math.max(0, score), 1.72) * 0.18;
    }

    let basinCut = 0;
    for (const cut of OCEAN_CUTS) {
      basinCut += oceanCutScore(longitude, latitude, cut);
    }

    const continentalNoise =
      (fbm(u * 1.25 + 0.04, v * 1.00 - 0.02, 911000, 5) - 0.5) * 0.120 +
      (fbm(u * 3.60 - 0.18, v * 2.85 + 0.07, 911700, 4) - 0.5) * 0.075;

    const nodalCoastNoise =
      Math.sin((u * 16 + nodal.peninsula * 3.2) * Math.PI * 2) * 0.018 +
      Math.sin((v * 16 + nodal.coastBite * 4.8) * Math.PI * 2) * 0.016;

    const bayCutField =
      smoothstep(-0.08, 0.42, bestScore + linkedPressure) *
      (
        fbm(u * 5.2 + nodal.coastBite * 0.31, v * 4.8 - nodal.peninsula * 0.19, 944300, 4) *
        (0.026 + province.coastBite * 0.055 + nodal.coastBite * 0.032)
      );

    const peninsulaPull =
      smoothstep(0.48, 0.92, nodal.peninsula) *
      (0.016 + province.coastBite * 0.018) *
      (Math.sin((u * 9.0 - v * 6.5) * Math.PI * 2) * 0.5 + 0.5);

    const summitLandPressure = province.landPressure;
    const nodalLandPressure = nodal.landPull * 0.070;
    const greenBeltLift = smoothstep(0.60, 0.96, nodal.greenBelt) * province.green * 0.026;
    const polarRestraint = smoothstep(78, 90, Math.abs(latitude)) * 0.115;

    const raw =
      bestScore +
      linkedPressure +
      continentalNoise +
      nodalCoastNoise +
      summitLandPressure +
      nodalLandPressure +
      greenBeltLift +
      peninsulaPull -
      bayCutField -
      basinCut -
      polarRestraint -
      0.056;

    return Object.freeze({
      raw,
      cells,
      province,
      nodal,
      bayCutField,
      peninsulaPull,
      basinCut,
      longitude,
      latitude
    });
  }

  function landField(u, v) {
    return landFieldDetails(u, v).raw;
  }

  function coastalEdge(raw, beachWidth, shelfWidth) {
    const width = Math.max(0.10, beachWidth + shelfWidth * 0.55);
    return clamp(1 - Math.abs(raw) / width, 0, 1);
  }

  function beachWidthFor(details) {
    const { province, nodal } = details;
    return clamp(
      0.038 +
      province.beach * 0.048 +
      nodal.beachSoftness * 0.035 -
      nodal.ridge * 0.012,
      0.032,
      0.105
    );
  }

  function shelfWidthFor(details) {
    const { province, nodal } = details;
    return clamp(
      0.115 +
      province.shelf * 0.105 +
      nodal.shelfWidth * 0.070 +
      province.basin * 0.025,
      0.105,
      0.265
    );
  }

  function elevationValue(u, v, raw, body, lat, details) {
    const bodyPressure = clamp((raw + 0.08) / 0.72, 0, 1);
    const ridgeField =
      fbm(u * 1.9 + 0.16, v * 1.6 - 0.13, 922000, 5) * 0.48 +
      fbm(u * 5.3 - 0.08, v * 4.4 + 0.19, 922600, 4) * 0.31;

    const province = details.province;
    const nodal = details.nodal;

    const mountainBias =
      body.family === "continental" ? 0.12 :
      body.family === "subcontinental" ? 0.08 :
      body.family === "polar" ? 0.04 :
      0.02;

    const summitRidge = province.ridge * 0.21 + nodal.ridge * 0.15;
    const basinSoftening = province.basin * 0.10 + nodal.basin * 0.05;
    const coastalLow = details.edge * 0.19;
    const polarLift = smoothstep(62, 84, Math.abs(lat)) * 0.04;

    return clamp(
      bodyPressure * 0.52 +
      ridgeField * 0.32 +
      mountainBias +
      summitRidge +
      polarLift -
      basinSoftening -
      coastalLow,
      0,
      1
    );
  }

  function classifyLandTerrain(elev, u, v, body, lat, raw, details) {
    if (Math.abs(lat) >= 72) return "polar-ice";
    if (details.edge > 0.58 && elev < 0.42) return "coastal-lowland";
    if (elev >= 0.80) return "mountain";
    if (elev >= 0.66) return "highland";
    if (elev >= 0.51) return "plateau";

    const wetness =
      fbm(u * 2.2 - 0.11, v * 1.9 + 0.21, 933000, 4) * 0.68 +
      details.province.basin * 0.22 +
      details.nodal.basin * 0.10;

    if (wetness > 0.72 && Math.abs(lat) < 42) return "wetland";
    if (wetness > 0.52 && Math.abs(lat) < 58) return "forest";

    if (body.family === "large-island") return "island-lowland";
    return "lowland";
  }

  function topologyFor(terrainClass, raw, body, details) {
    if (terrainClass === "ocean") return "deep-ocean";
    if (terrainClass === "shelf") return "continental-shelf";
    if (terrainClass === "beach") return details.nodal.beachSoftness > 0.62 ? "cloud-soft-beach-band" : "coastal-beach-band";
    if (terrainClass === "polar-ice") return "polar-cap";
    if (terrainClass === "mountain") return "ancient-mountain-belt";
    if (terrainClass === "highland") return "highland-shoulder";
    if (terrainClass === "plateau") return "old-plateau";
    if (terrainClass === "wetland") return "protected-wetland-basin";
    if (terrainClass === "forest") return "restoration-green-belt";
    if (terrainClass === "coastal-lowland") return "living-coastal-lowland";
    if (body.family === "large-island") return "large-island-body";
    if (body.family === "subcontinental") return "subcontinental-core";
    if (body.family === "polar") return "polar-landmass";
    return details.province.name === "Stability" ? "ancient-craton-core" : "continental-core";
  }

  function elevationLabel(terrainClass, elev) {
    if (terrainClass === "ocean") return "sea";
    if (terrainClass === "shelf") return "shelf-sea";
    if (terrainClass === "beach") return "shore";
    if (terrainClass === "polar-ice") return "ice-cap";
    if (terrainClass === "mountain") return "mountain";
    if (terrainClass === "highland") return "highland";
    if (terrainClass === "plateau") return "plateau";
    if (elev < 0.34) return "lowland";
    if (elev < 0.54) return "rising-land";
    return "upper-land";
  }

  function internalSummitFromCell(cell256, cell64, cell16) {
    return SUMMIT_PROVINCES[(cell64 + cell16 + cell256 - 3) % SUMMIT_PROVINCES.length].name;
  }

  function geologyHintFor(terrainClass, details) {
    if (terrainClass === "beach") {
      if (details.province.name === "Joy") return "white-opal-bright-coast";
      if (details.province.name === "Dignity") return "black-diamond-mineral-sand";
      if (details.province.name === "Stewardship") return "restoration-shelf-green-gold";
      return "opal-diamond-coast";
    }

    if (terrainClass === "mountain" || terrainClass === "highland") return "ancient-mineral-pressure";
    if (terrainClass === "shelf") return "coastal-shelf-transition";
    if (terrainClass === "wetland") return "protected-water-memory";
    if (terrainClass === "forest") return "living-green-belt";
    return "audralia-earth-legacy-living-surface";
  }

  function sampleLandmap(uInput, vInput) {
    const u = wrap01(Number.isFinite(Number(uInput)) ? Number(uInput) : 0);
    const v = clamp(Number.isFinite(Number(vInput)) ? Number(vInput) : 0, 0, 1);
    const detailsBase = landFieldDetails(u, v);
    const { longitude, latitude, cells, province, nodal } = detailsBase;
    const raw = detailsBase.raw;
    const nearest = nearestLandBody(longitude, latitude);
    const body = nearest.body;

    const beachWidth = beachWidthFor(detailsBase);
    const shelfWidth = shelfWidthFor(detailsBase);
    const edge = coastalEdge(raw, beachWidth, shelfWidth);
    const details = Object.freeze({ ...detailsBase, edge, beachWidth, shelfWidth });

    const isShelf = raw <= 0 && raw > -shelfWidth;
    const isBeach = raw > 0 && raw <= beachWidth;
    const isOcean = raw <= -shelfWidth;
    const isLandCore = raw > beachWidth;

    const polarCandidate = Math.abs(latitude) >= 72 && (isLandCore || isBeach);
    const polarNoise = fbm(u * 2.4 + 0.33, v * 2.0 - 0.17, 944000, 4);
    const isPolarIce = polarCandidate && polarNoise > 0.24;

    let terrainClass = "ocean";
    let elevationScore = 0;

    if (isOcean) {
      terrainClass = "ocean";
      elevationScore = 0;
    } else if (isShelf) {
      terrainClass = "shelf";
      elevationScore = 0.08 + smoothstep(-shelfWidth, 0, raw) * 0.12;
    } else if (isBeach && !isPolarIce) {
      terrainClass = "beach";
      elevationScore = 0.16 + smoothstep(0, beachWidth, raw) * 0.08;
    } else {
      elevationScore = elevationValue(u, v, raw, body, latitude, details);
      terrainClass = isPolarIce ? "polar-ice" : classifyLandTerrain(elevationScore, u, v, body, latitude, raw, details);
    }

    const quadrant = quadrantFrom(longitude, latitude);
    const band = bandFrom(latitude);
    const topology = topologyFor(terrainClass, raw, body, details);
    const elevation = elevationLabel(terrainClass, elevationScore);

    const shelf = isShelf
      ? smoothstep(-shelfWidth, 0, raw)
      : isBeach
        ? 1
        : isOcean
          ? clamp(smoothstep(-shelfWidth * 2.1, -shelfWidth, raw) * 0.22, 0, 0.22)
          : clamp(1 - smoothstep(beachWidth, beachWidth + 0.25, raw), 0, 1) * 0.28;

    const beachEdge = edge;
    const primarySummit = province.name;
    const internalSummit = internalSummitFromCell(cells.cell256, cells.cell64, cells.cell16);

    return Object.freeze({
      u,
      v,
      longitude,
      latitude,
      cell256: cells.cell256,
      cell64: cells.cell64,
      cell16: cells.cell16,
      row16: cells.row16,
      col16: cells.col16,
      quadrant,
      band,

      primarySummit,
      internalSummit,
      summitProvince: province.name,
      summitProvinceRole: province.role,
      summitTechnology: province.technology,

      landmassId: body.id,
      landmassLabel: body.label,
      landmassClass: body.className,
      landmassFamily: body.family,

      terrainClass,
      topology,
      elevation,
      elevationScore,

      landScore: raw,
      coastline: edge,
      shelf,
      beachEdge,
      beachWidth,
      shelfWidth,

      isOcean,
      isLand: isLandCore || isBeach || isPolarIce,
      isShelf,
      isBeach: isBeach && !isPolarIce,
      isPolarIce,

      majorLandmass: body.family === "continental" || body.family === "subcontinental",
      largeIsland: body.family === "large-island",
      continentalBody: body.family === "continental",
      subcontinentalBody: body.family === "subcontinental",

      nodalLandPull: nodal.landPull,
      nodalCoastBite: nodal.coastBite,
      nodalShelfWidth: nodal.shelfWidth,
      nodalBeachSoftness: nodal.beachSoftness,
      nodalRidge: nodal.ridge,
      nodalBasin: nodal.basin,
      nodalPeninsula: nodal.peninsula,
      nodalGreenBelt: nodal.greenBelt,
      nodalTechnology: nodal.technology,

      lattice256AsHiddenScaffold: true,
      nineSummitsAsProvinceFields: true,
      earthLegacy: true,
      thirtyBillionYearFuture: true,
      highTechnologyHiddenInsideNature: true,
      stewardshipWorld: true,

      hydrologyHeld: false,
      canvasOwnsFootprint: false,
      landmapOwnsFootprint: true,
      beachBandAvailable: true,
      wetBeachTransition: isBeach && edge > 0.42,

      geologyHint: geologyHintFor(terrainClass, details)
    });
  }

  function estimateRatios(samplesWide = 192, samplesHigh = 96) {
    let land = 0;
    let beach = 0;
    let shelf = 0;
    let ocean = 0;
    let polar = 0;
    let total = 0;

    for (let y = 0; y < samplesHigh; y += 1) {
      const v = (y + 0.5) / samplesHigh;

      for (let x = 0; x < samplesWide; x += 1) {
        const u = (x + 0.5) / samplesWide;
        const map = sampleLandmap(u, v);

        total += 1;

        if (map.isPolarIce) polar += 1;
        if (map.isBeach) beach += 1;
        else if (map.isShelf) shelf += 1;
        else if (map.isOcean) ocean += 1;
        else if (map.isLand) land += 1;
      }
    }

    const denom = Math.max(1, total);

    return Object.freeze({
      samples: total,
      landRatio: Number(((land + beach + polar) / denom).toFixed(4)),
      coreLandRatio: Number((land / denom).toFixed(4)),
      beachRatio: Number((beach / denom).toFixed(4)),
      shelfRatio: Number((shelf / denom).toFixed(4)),
      oceanRatio: Number(((ocean + shelf) / denom).toFixed(4)),
      deepOceanRatio: Number((ocean / denom).toFixed(4)),
      polarRatio: Number((polar / denom).toFixed(4)),
      targetLandRatio: TARGET.landRatioApprox,
      targetOceanRatio: TARGET.oceanRatioApprox
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-landmap-footprint-authority",
      ownsFootprint: true,
      canvasOwnsFootprint: false,
      target: TARGET,
      primaryTarget: "/assets/audralia/audralia.landmap.js",
      secondaryTarget: "/assets/audralia/audralia.beaches.js",
      downstreamTargets: [
        "/assets/audralia/audralia.topology.js",
        "/assets/audralia/audralia.landrise.js",
        "/assets/audralia/audralia.elevation.js",
        "/assets/audralia/audralia.groundcover.js",
        "/assets/audralia/audralia.land.surface.js",
        "/assets/audralia/audralia.canvas.js"
      ],
      earthLegacy: true,
      thirtyBillionYearFuture: true,
      highTechnologyHiddenInsideNature: true,
      stewardshipWorld: true,
      lattice256AsHiddenScaffold: true,
      nineSummitsAsProvinceFields: true,
      organicLandforms: true,
      organicCoastlines: true,
      variableBeachBands: true,
      variableShelfZones: true,
      majorLandmasses: true,
      subcontinentalBodies: true,
      largeIslands: true,
      smallIslandScatterOnly: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_LANDMAP = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    target: TARGET,
    landBodies: LAND_BODIES,
    summitProvinces: SUMMIT_PROVINCES,
    sampleLandmap,
    sample: sampleLandmap,
    landField,
    landFieldDetails,
    estimateRatios,
    getStatus
  });

  window.AUDRALIA_LANDMAP_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaLandmapLoaded = "true";
  document.documentElement.dataset.audraliaLandmapContract = CONTRACT;
  document.documentElement.dataset.audraliaLandmapReceipt = RECEIPT;
  document.documentElement.dataset.audraliaLandmapPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.audraliaLandmapOwnsFootprint = "true";
  document.documentElement.dataset.audraliaCanvasOwnsFootprint = "false";
  document.documentElement.dataset.audraliaEarthLegacy = "true";
  document.documentElement.dataset.audraliaThirtyBillionYearFuture = "true";
  document.documentElement.dataset.audraliaHighTechnologyHiddenInsideNature = "true";
  document.documentElement.dataset.audraliaStewardshipWorld = "true";
  document.documentElement.dataset.audraliaLattice256AsHiddenScaffold = "true";
  document.documentElement.dataset.audraliaNineSummitsAsProvinceFields = "true";
  document.documentElement.dataset.audraliaOrganicLandforms = "true";
  document.documentElement.dataset.audraliaOrganicCoastlines = "true";
  document.documentElement.dataset.audraliaVariableBeachBands = "true";
  document.documentElement.dataset.audraliaVariableShelfZones = "true";
  document.documentElement.dataset.audraliaMajorLandmasses = "true";
  document.documentElement.dataset.audraliaSubcontinentalBodies = "true";
  document.documentElement.dataset.audraliaLargeIslands = "true";
  document.documentElement.dataset.audraliaSmallIslandScatterOnly = "false";
  document.documentElement.dataset.audraliaTargetLandRatio = "30_to_45_percent";
  document.documentElement.dataset.audraliaTargetOceanRatio = "55_to_70_percent";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
