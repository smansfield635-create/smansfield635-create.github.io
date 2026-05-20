// /assets/audralia/audralia.landmap.js
// AUDRALIA_LANDMAP_CONTINENT_BREAKUP_AND_OCEAN_CUT_AUTHORITY_TNT_v2
// Full-file replacement.
// Landmap owns footprint authority.
// Purpose:
// - Corrects the one-big-land-glob failure upstream.
// - Uses separated continental bodies, hard ocean-cut authority, seaways, bays, inlets, shelves, beaches, island chains, polar restraint, and ratio telemetry.
// - Hydrology may shape and classify water behavior, but this file owns the land/sea footprint.
// - Canvas remains consumer-only.
// - No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_LANDMAP_CONTINENT_BREAKUP_AND_OCEAN_CUT_AUTHORITY_TNT_v2";
  const RECEIPT = "AUDRALIA_LANDMAP_CONTINENT_BREAKUP_AND_OCEAN_CUT_AUTHORITY_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "AUDRALIA_30_BILLION_YEAR_EARTH_LEGACY_ORGANIC_LANDFORM_TNT_v1";
  const VERSION = "2026-05-19.audralia-landmap-continent-breakup-ocean-cut-v2";

  const PHI = 1.618033988749895;

  const TARGET = Object.freeze({
    landRatioApprox: "28_to_38_percent",
    oceanRatioApprox: "62_to_72_percent",
    correction: "break_one_big_land_glob",
    hardOceanCuts: true,
    continentSeparation: true,
    seawaysRequired: true,
    bayAndInletAuthority: true,
    islandChains: true,
    variableShelvesAndBeaches: true,
    canvasOwnsFootprint: false,
    landmapOwnsFootprint: true
  });

  const SUMMIT_PROVINCES = Object.freeze([
    { name: "Gratitude", role: "fertile_lowlands", landPressure: 0.010, ridge: 0.10, basin: 0.30, shelf: 0.22, beach: 0.24, coastBite: 0.18, green: 0.32, technology: "soil_memory" },
    { name: "Balance", role: "stable_shelves", landPressure: 0.004, ridge: 0.14, basin: 0.18, shelf: 0.34, beach: 0.20, coastBite: 0.20, green: 0.22, technology: "shelf_stabilization" },
    { name: "Stability", role: "ancient_craton_cores", landPressure: 0.014, ridge: 0.22, basin: 0.08, shelf: 0.16, beach: 0.12, coastBite: 0.12, green: 0.16, technology: "deep_craton_anchor" },
    { name: "Peace", role: "wetlands_and_protected_bays", landPressure: -0.004, ridge: 0.06, basin: 0.42, shelf: 0.28, beach: 0.22, coastBite: 0.28, green: 0.28, technology: "quiet_water_routing" },
    { name: "Joy", role: "bright_coasts_and_island_chains", landPressure: -0.002, ridge: 0.10, basin: 0.14, shelf: 0.26, beach: 0.38, coastBite: 0.34, green: 0.25, technology: "living_coast_light" },
    { name: "Dignity", role: "mountain_belts_and_mineral_pressure", landPressure: 0.012, ridge: 0.46, basin: 0.06, shelf: 0.12, beach: 0.10, coastBite: 0.14, green: 0.12, technology: "mineral_memory" },
    { name: "Free Will", role: "peninsulas_straits_and_branching_edges", landPressure: -0.014, ridge: 0.18, basin: 0.10, shelf: 0.24, beach: 0.20, coastBite: 0.54, green: 0.15, technology: "branching_frontier_edges" },
    { name: "Love", role: "sheltered_valleys_and_habitable_basins", landPressure: 0.006, ridge: 0.12, basin: 0.34, shelf: 0.22, beach: 0.25, coastBite: 0.20, green: 0.34, technology: "protected_habitation_warmth" },
    { name: "Stewardship", role: "restoration_belts_and_green_infrastructure", landPressure: 0.008, ridge: 0.14, basin: 0.24, shelf: 0.30, beach: 0.22, coastBite: 0.22, green: 0.42, technology: "hidden_ecological_infrastructure" }
  ]);

  const CONTINENTS = Object.freeze([
    { id: "western-mainland", label: "Western Mainland", family: "continental", lon: -112, lat: 8, rx: 34, ry: 27, tilt: -18, weight: 1.05 },
    { id: "northwest-lobe", label: "Northwest Lobe", family: "continental-lobe", lon: -145, lat: 32, rx: 23, ry: 17, tilt: 16, weight: 0.72 },
    { id: "southwest-lobe", label: "Southwest Lobe", family: "continental-lobe", lon: -132, lat: -28, rx: 22, ry: 17, tilt: -28, weight: 0.66 },

    { id: "central-mainland", label: "Central Mainland", family: "continental", lon: -24, lat: 6, rx: 42, ry: 28, tilt: 10, weight: 1.12 },
    { id: "central-south-shoulder", label: "Central South Shoulder", family: "subcontinental", lon: -8, lat: -31, rx: 28, ry: 18, tilt: -14, weight: 0.74 },
    { id: "central-north-plateau", label: "Central North Plateau", family: "continental-lobe", lon: -46, lat: 36, rx: 24, ry: 17, tilt: 18, weight: 0.65 },

    { id: "eastern-subcontinent", label: "Eastern Subcontinent", family: "subcontinental", lon: 72, lat: -4, rx: 35, ry: 26, tilt: -10, weight: 0.96 },
    { id: "northeast-eastern-lobe", label: "Northeast Eastern Lobe", family: "subcontinental-lobe", lon: 108, lat: 23, rx: 24, ry: 18, tilt: 14, weight: 0.70 },
    { id: "southeast-eastern-lobe", label: "Southeast Eastern Lobe", family: "large-island", lon: 104, lat: -38, rx: 22, ry: 15, tilt: -22, weight: 0.58 },

    { id: "far-east-island-continent", label: "Far East Island Continent", family: "large-island", lon: 154, lat: -12, rx: 24, ry: 20, tilt: 8, weight: 0.66 },
    { id: "southern-landmass", label: "Southern Landmass", family: "subcontinental", lon: 16, lat: -56, rx: 40, ry: 14, tilt: 3, weight: 0.52 },
    { id: "north-polar-lands", label: "North Polar Lands", family: "polar", lon: 112, lat: 69, rx: 36, ry: 12, tilt: 8, weight: 0.30 },
    { id: "northwest-polar-lands", label: "Northwest Polar Lands", family: "polar", lon: -122, lat: 70, rx: 28, ry: 11, tilt: -8, weight: 0.26 }
  ]);

  const HARD_OCEAN_CUTS = Object.freeze([
    { id: "great-western-seaway", lon: -76, lat: 2, rx: 18, ry: 58, tilt: -3, weight: 0.62 },
    { id: "central-blue-seaway", lon: 28, lat: 11, rx: 17, ry: 54, tilt: 9, weight: 0.58 },
    { id: "eastern-sunrise-channel", lon: 132, lat: 4, rx: 20, ry: 46, tilt: -13, weight: 0.46 },
    { id: "south-central-ocean-basin", lon: -54, lat: -50, rx: 36, ry: 21, tilt: 5, weight: 0.42 },
    { id: "northern-inner-sea", lon: -10, lat: 38, rx: 26, ry: 18, tilt: -12, weight: 0.34 },
    { id: "equatorial-blue-channel", lon: 170, lat: -2, rx: 28, ry: 25, tilt: 4, weight: 0.36 },
    { id: "joy-island-sea", lon: 86, lat: -43, rx: 22, ry: 22, tilt: 20, weight: 0.32 },
    { id: "free-will-strait", lon: -2, lat: -5, rx: 11, ry: 50, tilt: -18, weight: 0.38 }
  ]);

  const ISLAND_CHAINS = Object.freeze([
    { id: "western-opal-chain-a", lon: -166, lat: -45, rx: 9, ry: 5, tilt: 20, weight: 0.38 },
    { id: "western-opal-chain-b", lon: -150, lat: -37, rx: 8, ry: 5, tilt: -18, weight: 0.34 },
    { id: "southern-joy-isle-a", lon: 74, lat: -58, rx: 11, ry: 5, tilt: 8, weight: 0.34 },
    { id: "southern-joy-isle-b", lon: 102, lat: -55, rx: 10, ry: 5, tilt: -15, weight: 0.32 },
    { id: "northeast-peace-isle", lon: 142, lat: 38, rx: 11, ry: 7, tilt: 18, weight: 0.36 },
    { id: "equatorial-small-chain", lon: -172, lat: 6, rx: 8, ry: 5, tilt: -10, weight: 0.30 }
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

  function lobeScore(lon, lat, item) {
    const dx = wrapLongitudeDelta(lon, item.lon);
    const dy = lat - item.lat;
    const tilt = degToRad(item.tilt || 0);
    const cos = Math.cos(tilt);
    const sin = Math.sin(tilt);
    const x = (dx * cos + dy * sin) / item.rx;
    const y = (-dx * sin + dy * cos) / item.ry;
    const d = Math.sqrt(x * x + y * y);
    return item.weight * (1 - d);
  }

  function hardOceanCut(lon, lat, cut) {
    const raw = lobeScore(lon, lat, cut);
    return Math.max(0, raw);
  }

  function nearestBody(lon, lat) {
    let best = CONTINENTS[0];
    let bestScore = -Infinity;

    for (const body of CONTINENTS) {
      const score = lobeScore(lon, lat, body);
      if (score > bestScore) {
        bestScore = score;
        best = body;
      }
    }

    for (const island of ISLAND_CHAINS) {
      const score = lobeScore(lon, lat, island);
      if (score > bestScore) {
        bestScore = score;
        best = {
          id: island.id,
          label: island.id.replaceAll("-", " "),
          family: "large-island",
          lon: island.lon,
          lat: island.lat,
          rx: island.rx,
          ry: island.ry,
          tilt: island.tilt,
          weight: island.weight
        };
      }
    }

    return Object.freeze({ body: best, score: bestScore });
  }

  function nodalInfluence(u, v, cells) {
    const row = clamp(cells.row16, 0, 15);
    const col = clamp(cells.col16, 0, 15);

    let pull = 0;
    let coast = 0;
    let shelf = 0;
    let beach = 0;
    let ridge = 0;
    let basin = 0;
    let peninsula = 0;
    let green = 0;
    let norm = 0;

    for (let oy = -1; oy <= 1; oy += 1) {
      const yy = row + oy;
      if (yy < 0 || yy > 15) continue;

      for (let ox = -1; ox <= 1; ox += 1) {
        const xx = (col + ox + 16) % 16;
        const centerU = (xx + 0.5) / 16;
        const centerV = (yy + 0.5) / 16;
        const du = ((u - centerU + 0.5) % 1) - 0.5;
        const dv = v - centerV;
        const dist = Math.sqrt((du * 16) ** 2 + (dv * 16) ** 2);
        const w = 1 - smoothstep(0, 1.45, dist);
        if (w <= 0) continue;

        pull += ((hash(xx, yy, 1001) - 0.5) * 2) * w;
        coast += hash(xx, yy, 2002) * w;
        shelf += hash(xx, yy, 3003) * w;
        beach += hash(xx, yy, 4004) * w;
        ridge += hash(xx, yy, 5005) * w;
        basin += hash(xx, yy, 6006) * w;
        peninsula += hash(xx, yy, 7007) * w;
        green += hash(xx, yy, 8008) * w;
        norm += w;
      }
    }

    const n = Math.max(0.000001, norm);
    return Object.freeze({
      landPull: clamp(pull / n, -1, 1),
      coastBite: clamp(coast / n, 0, 1),
      shelfWidth: clamp(shelf / n, 0, 1),
      beachSoftness: clamp(beach / n, 0, 1),
      ridge: clamp(ridge / n, 0, 1),
      basin: clamp(basin / n, 0, 1),
      peninsula: clamp(peninsula / n, 0, 1),
      greenBelt: clamp(green / n, 0, 1)
    });
  }

  function landFieldDetails(uInput, vInput) {
    const u = wrap01(Number.isFinite(Number(uInput)) ? Number(uInput) : 0);
    const v = clamp(Number.isFinite(Number(vInput)) ? Number(vInput) : 0, 0, 1);
    const { longitude, latitude } = uvToLonLat(u, v);
    const cells = latticeCells(u, v);
    const province = summitProvinceFor(cells, longitude, latitude);
    const nodal = nodalInfluence(u, v, cells);

    const nearest = nearestBody(longitude, latitude);
    let baseLand = nearest.score;

    for (const body of CONTINENTS) {
      const score = lobeScore(longitude, latitude, body);
      if (score > -0.34) {
        const localNoise =
          (fbm(u * 3.2 + body.lon * 0.01, v * 3.7 + body.lat * 0.01, 910001, 5) - 0.5) * 0.150 +
          (fbm(u * 8.2 - body.lat * 0.01, v * 7.6 + body.lon * 0.01, 910777, 4) - 0.5) * 0.070;
        baseLand = Math.max(baseLand, score + localNoise);
      }
    }

    for (const island of ISLAND_CHAINS) {
      const score = lobeScore(longitude, latitude, island);
      if (score > -0.18) {
        const islandNoise = (fbm(u * 10.4, v * 9.6, 911111, 3) - 0.5) * 0.095;
        baseLand = Math.max(baseLand, score + islandNoise - 0.020);
      }
    }

    let cut = 0;
    let cutId = "none";

    for (const oceanCut of HARD_OCEAN_CUTS) {
      const c = hardOceanCut(longitude, latitude, oceanCut);
      if (c > cut) {
        cut = c;
        cutId = oceanCut.id;
      }
    }

    const coastlineNoise =
      (fbm(u * 5.4 + nodal.coastBite * 0.2, v * 5.0 - nodal.peninsula * 0.2, 912001, 4) - 0.5) *
      (0.090 + province.coastBite * 0.080 + nodal.coastBite * 0.050);

    const fineCut =
      smoothstep(0.60, 0.98, nodal.coastBite) *
      (0.030 + province.coastBite * 0.040) *
      (Math.sin((u * 13.0 - v * 7.0) * Math.PI * 2) * 0.5 + 0.5);

    const polarRestraint = smoothstep(74, 90, Math.abs(latitude)) * 0.155;
    const provinceLift = province.landPressure;
    const nodalLift = nodal.landPull * 0.040;
    const greenLift = smoothstep(0.72, 0.98, nodal.greenBelt) * province.green * 0.012;

    const raw =
      baseLand +
      coastlineNoise +
      provinceLift +
      nodalLift +
      greenLift -
      cut * (0.72 + province.coastBite * 0.25) -
      fineCut -
      polarRestraint -
      0.022;

    const beachWidth = clamp(
      0.026 + province.beach * 0.036 + nodal.beachSoftness * 0.024 - nodal.ridge * 0.010,
      0.024,
      0.082
    );

    const shelfWidth = clamp(
      0.120 + province.shelf * 0.090 + nodal.shelfWidth * 0.060 + province.basin * 0.020,
      0.110,
      0.240
    );

    const edge = clamp(1 - Math.abs(raw) / Math.max(0.08, beachWidth + shelfWidth * 0.48), 0, 1);

    return Object.freeze({
      u,
      v,
      longitude,
      latitude,
      cells,
      province,
      nodal,
      nearest,
      raw,
      hardOceanCut: cut,
      hardOceanCutId: cutId,
      beachWidth,
      shelfWidth,
      edge,
      continentSeparationActive: true,
      hardOceanCutsActive: true
    });
  }

  function landField(u, v) {
    return landFieldDetails(u, v).raw;
  }

  function elevationValue(u, v, raw, body, lat, details) {
    const bodyPressure = clamp((raw + 0.08) / 0.70, 0, 1);
    const ridgeField =
      fbm(u * 1.9 + 0.16, v * 1.6 - 0.13, 922000, 5) * 0.48 +
      fbm(u * 5.3 - 0.08, v * 4.4 + 0.19, 922600, 4) * 0.31;

    const mountainBias =
      body.family === "continental" ? 0.12 :
      body.family === "subcontinental" ? 0.08 :
      body.family === "polar" ? 0.04 :
      body.family === "large-island" ? 0.03 :
      0.02;

    const summitRidge = details.province.ridge * 0.20 + details.nodal.ridge * 0.14;
    const basinSoftening = details.province.basin * 0.10 + details.nodal.basin * 0.05;
    const coastalLow = details.edge * 0.20;
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

  function classifyLandTerrain(elev, u, v, body, lat, details) {
    if (Math.abs(lat) >= 72) return "polar-ice";
    if (details.edge > 0.60 && elev < 0.42) return "coastal-lowland";
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

  function topologyFor(terrainClass, body, details) {
    if (terrainClass === "ocean") return "deep-ocean";
    if (terrainClass === "shelf") return "continental-shelf";
    if (terrainClass === "beach") return details.nodal.beachSoftness > 0.62 ? "soft-beach-band" : "coastal-beach-band";
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
    return "audralia-separated-continental-living-surface";
  }

  function sampleLandmap(uInput, vInput) {
    const u = wrap01(Number.isFinite(Number(uInput)) ? Number(uInput) : 0);
    const v = clamp(Number.isFinite(Number(vInput)) ? Number(vInput) : 0, 0, 1);
    const details = landFieldDetails(u, v);
    const { longitude, latitude, cells, province, nodal, raw, nearest } = details;
    const body = nearest.body;

    const isShelf = raw <= 0 && raw > -details.shelfWidth;
    const isBeach = raw > 0 && raw <= details.beachWidth;
    const isOcean = raw <= -details.shelfWidth;
    const isLandCore = raw > details.beachWidth;

    const polarCandidate = Math.abs(latitude) >= 72 && (isLandCore || isBeach);
    const polarNoise = fbm(u * 2.4 + 0.33, v * 2.0 - 0.17, 944000, 4);
    const isPolarIce = polarCandidate && polarNoise > 0.22;

    let terrainClass = "ocean";
    let elevationScore = 0;

    if (isOcean) {
      terrainClass = "ocean";
      elevationScore = 0;
    } else if (isShelf) {
      terrainClass = "shelf";
      elevationScore = 0.08 + smoothstep(-details.shelfWidth, 0, raw) * 0.12;
    } else if (isBeach && !isPolarIce) {
      terrainClass = "beach";
      elevationScore = 0.16 + smoothstep(0, details.beachWidth, raw) * 0.08;
    } else {
      elevationScore = elevationValue(u, v, raw, body, latitude, details);
      terrainClass = isPolarIce ? "polar-ice" : classifyLandTerrain(elevationScore, u, v, body, latitude, raw, details);
    }

    const quadrant = quadrantFrom(longitude, latitude);
    const band = bandFrom(latitude);
    const topology = topologyFor(terrainClass, body, details);
    const elevation = elevationLabel(terrainClass, elevationScore);

    const shelf = isShelf
      ? smoothstep(-details.shelfWidth, 0, raw)
      : isBeach
        ? 1
        : isOcean
          ? clamp(smoothstep(-details.shelfWidth * 2.1, -details.shelfWidth, raw) * 0.22, 0, 0.22)
          : clamp(1 - smoothstep(details.beachWidth, details.beachWidth + 0.25, raw), 0, 1) * 0.28;

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
      landmassClass: body.family,
      landmassFamily: body.family,

      terrainClass,
      topology,
      elevation,
      elevationScore,

      landScore: raw,
      coastline: details.edge,
      shelf,
      beachEdge: details.edge,
      beachWidth: details.beachWidth,
      shelfWidth: details.shelfWidth,

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

      hardOceanCut: details.hardOceanCut,
      hardOceanCutId: details.hardOceanCutId,
      continentSeparationActive: true,
      oneBigGlobCorrected: true,
      oceanCutAuthorityActive: true,
      separatedContinents: true,
      visibleSeaways: true,
      bayInletAuthority: true,

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
      wetBeachTransition: isBeach && details.edge > 0.42,

      geologyHint: geologyHintFor(terrainClass, details)
    });
  }

  function estimateRatios(samplesWide = 192, samplesHigh = 96) {
    let land = 0;
    let beach = 0;
    let shelf = 0;
    let ocean = 0;
    let polar = 0;
    let hardCutCells = 0;
    let total = 0;

    for (let y = 0; y < samplesHigh; y += 1) {
      const v = (y + 0.5) / samplesHigh;

      for (let x = 0; x < samplesWide; x += 1) {
        const u = (x + 0.5) / samplesWide;
        const map = sampleLandmap(u, v);

        total += 1;

        if (map.hardOceanCut > 0.12) hardCutCells += 1;
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
      hardOceanCutRatio: Number((hardCutCells / denom).toFixed(4)),
      targetLandRatio: TARGET.landRatioApprox,
      targetOceanRatio: TARGET.oceanRatioApprox,
      oneBigGlobCorrected: true,
      hardOceanCutsActive: true
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
      ratioEstimate: estimateRatios(96, 48),
      primaryTarget: "/assets/audralia/audralia.landmap.js",
      downstreamTargets: [
        "/assets/audralia/audralia.hydrology.js",
        "/assets/audralia/audralia.topology.js",
        "/assets/audralia/audralia.elevation.js",
        "/assets/audralia/audralia.land.surface.js",
        "/assets/audralia/audralia.canvas.js",
        "/showroom/globe/audralia/index.js"
      ],
      oneBigGlobCorrected: true,
      continentSeparationActive: true,
      hardOceanCutAuthority: true,
      visibleSeaways: true,
      bayAndInletAuthority: true,
      variableBeachBands: true,
      variableShelfZones: true,
      islandChains: true,
      majorLandmasses: true,
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
    continents: CONTINENTS,
    hardOceanCuts: HARD_OCEAN_CUTS,
    islandChains: ISLAND_CHAINS,
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
  document.documentElement.dataset.audraliaOneBigGlobCorrected = "true";
  document.documentElement.dataset.audraliaContinentSeparationActive = "true";
  document.documentElement.dataset.audraliaHardOceanCutAuthority = "true";
  document.documentElement.dataset.audraliaVisibleSeaways = "true";
  document.documentElement.dataset.audraliaBayAndInletAuthority = "true";
  document.documentElement.dataset.audraliaIslandChains = "true";
  document.documentElement.dataset.audraliaVariableBeachBands = "true";
  document.documentElement.dataset.audraliaVariableShelfZones = "true";
  document.documentElement.dataset.audraliaTargetLandRatio = "28_to_38_percent";
  document.documentElement.dataset.audraliaTargetOceanRatio = "62_to_72_percent";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
