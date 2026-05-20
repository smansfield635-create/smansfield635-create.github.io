// /assets/audralia/audralia.landmap.js
// AUDRALIA_LANDMASS_SEPARATION_AND_ARCHIPELAGO_RENEWAL_TNT_v1
// Full-file replacement.
// Landmap owns footprint authority only.
// Purpose:
// - Renews Audralia away from the one-big-land-glob read.
// - Separates major landmasses through stronger ocean corridors, straits, bays, gulfs, and interior water pressure.
// - Adds archipelago chains, offshore fragments, peninsulas, shelf zones, beaches, and sharper coastal interruption.
// - Preserves Audralia spelling, 256 lattice compatibility, Nine Summits province fields, Earth-legacy mirror-world logic.
// - Does not render canvas.
// - Does not color surface.
// - Does not own hydrology.
// - Does not own climate.
// - Does not own elevation.
// - Does not touch runtime.
// - Does not touch Gauges.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_LANDMASS_SEPARATION_AND_ARCHIPELAGO_RENEWAL_TNT_v1";
  const RECEIPT = "AUDRALIA_LANDMASS_SEPARATION_AND_ARCHIPELAGO_RENEWAL_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_30_BILLION_YEAR_EARTH_LEGACY_ORGANIC_LANDFORM_TNT_v1";
  const VERSION = "2026-05-19.audralia-landmass-separation-and-archipelago-renewal-v1";

  const TARGET = Object.freeze({
    landRatioApprox: "28_to_40_percent",
    oceanRatioApprox: "60_to_72_percent",
    oneBigGlobCorrected: true,
    majorLandmassesSeparated: true,
    archipelagoChains: true,
    oceanCorridors: true,
    baysInletsStraits: true,
    jaggedCoastlines: true,
    offshoreFragments: true,
    earthLegacy: true,
    thirtyBillionYearFuture: true,
    highTechnologyHiddenInsideNature: true,
    stewardshipWorld: true,
    lattice256AsHiddenScaffold: true,
    nineSummitsAsProvinceFields: true,
    canvasOwnsFootprint: false
  });

  const SUMMIT_PROVINCES = Object.freeze([
    {
      name: "Gratitude",
      role: "fertile_lowlands",
      landPressure: 0.012,
      ridge: 0.10,
      basin: 0.34,
      shelf: 0.22,
      beach: 0.24,
      coastBite: 0.18,
      island: 0.12,
      green: 0.30,
      technology: "soil_memory"
    },
    {
      name: "Balance",
      role: "stable_shelves",
      landPressure: 0.004,
      ridge: 0.16,
      basin: 0.16,
      shelf: 0.34,
      beach: 0.20,
      coastBite: 0.22,
      island: 0.18,
      green: 0.20,
      technology: "shelf_stabilization"
    },
    {
      name: "Stability",
      role: "ancient_craton_cores",
      landPressure: 0.016,
      ridge: 0.22,
      basin: 0.08,
      shelf: 0.16,
      beach: 0.12,
      coastBite: 0.12,
      island: 0.08,
      green: 0.16,
      technology: "deep_craton_anchor"
    },
    {
      name: "Peace",
      role: "wetlands_and_protected_bays",
      landPressure: -0.004,
      ridge: 0.06,
      basin: 0.40,
      shelf: 0.28,
      beach: 0.22,
      coastBite: 0.24,
      island: 0.16,
      green: 0.27,
      technology: "quiet_water_routing"
    },
    {
      name: "Joy",
      role: "bright_coasts_and_island_chains",
      landPressure: 0.002,
      ridge: 0.10,
      basin: 0.15,
      shelf: 0.28,
      beach: 0.40,
      coastBite: 0.38,
      island: 0.34,
      green: 0.25,
      technology: "living_coast_light"
    },
    {
      name: "Dignity",
      role: "mountain_belts_and_mineral_pressure",
      landPressure: 0.012,
      ridge: 0.46,
      basin: 0.06,
      shelf: 0.13,
      beach: 0.09,
      coastBite: 0.18,
      island: 0.10,
      green: 0.12,
      technology: "mineral_memory"
    },
    {
      name: "Free Will",
      role: "peninsulas_straits_and_branching_edges",
      landPressure: -0.010,
      ridge: 0.20,
      basin: 0.10,
      shelf: 0.26,
      beach: 0.18,
      coastBite: 0.48,
      island: 0.28,
      green: 0.15,
      technology: "branching_frontier_edges"
    },
    {
      name: "Love",
      role: "sheltered_valleys_and_habitable_basins",
      landPressure: 0.008,
      ridge: 0.12,
      basin: 0.32,
      shelf: 0.22,
      beach: 0.26,
      coastBite: 0.20,
      island: 0.12,
      green: 0.34,
      technology: "protected_habitation_warmth"
    },
    {
      name: "Stewardship",
      role: "restoration_belts_and_green_infrastructure",
      landPressure: 0.006,
      ridge: 0.14,
      basin: 0.22,
      shelf: 0.32,
      beach: 0.22,
      coastBite: 0.22,
      island: 0.20,
      green: 0.40,
      technology: "hidden_ecological_infrastructure"
    }
  ]);

  const LAND_BODIES = Object.freeze([
    {
      id: "west-audralian-continent",
      label: "West Audralian Continent",
      className: "separated-western-continental-body",
      lon: -132,
      lat: -8,
      rx: 33,
      ry: 30,
      weight: 0.82,
      tilt: 4,
      family: "continental"
    },
    {
      id: "northwest-island-continent",
      label: "Northwest Island Continent",
      className: "large-northwest-island-continent",
      lon: -154,
      lat: 25,
      rx: 22,
      ry: 18,
      weight: 0.48,
      tilt: -18,
      family: "large-island"
    },
    {
      id: "central-mainland-north",
      label: "Central Mainland North",
      className: "northern-mainland-fragment",
      lon: -54,
      lat: 23,
      rx: 34,
      ry: 21,
      weight: 0.74,
      tilt: -10,
      family: "continental"
    },
    {
      id: "central-mainland-south",
      label: "Central Mainland South",
      className: "southern-mainland-fragment",
      lon: -28,
      lat: -19,
      rx: 36,
      ry: 23,
      weight: 0.78,
      tilt: 18,
      family: "continental"
    },
    {
      id: "southwest-shoulder-island",
      label: "Southwest Shoulder Island",
      className: "southwest-shelf-island",
      lon: -66,
      lat: -39,
      rx: 22,
      ry: 15,
      weight: 0.40,
      tilt: 24,
      family: "large-island"
    },
    {
      id: "east-audralian-subcontinent",
      label: "East Audralian Subcontinent",
      className: "separated-eastern-subcontinent",
      lon: 72,
      lat: -5,
      rx: 38,
      ry: 28,
      weight: 0.78,
      tilt: 17,
      family: "subcontinental"
    },
    {
      id: "northeast-crescent-land",
      label: "Northeast Crescent Land",
      className: "northeast-crescent-subcontinent",
      lon: 116,
      lat: 24,
      rx: 25,
      ry: 20,
      weight: 0.48,
      tilt: -12,
      family: "subcontinental"
    },
    {
      id: "southeast-island-land",
      label: "Southeast Island Land",
      className: "southeast-large-island-body",
      lon: 86,
      lat: -40,
      rx: 27,
      ry: 18,
      weight: 0.44,
      tilt: -22,
      family: "large-island"
    },
    {
      id: "southern-continent",
      label: "Southern Continent",
      className: "southern-separated-landmass",
      lon: 10,
      lat: -52,
      rx: 45,
      ry: 17,
      weight: 0.52,
      tilt: 3,
      family: "subcontinental"
    },
    {
      id: "south-polar-shelf-land",
      label: "South Polar Shelf Land",
      className: "south-polar-shelf-landmass",
      lon: -112,
      lat: -68,
      rx: 29,
      ry: 11,
      weight: 0.24,
      tilt: -8,
      family: "polar"
    },
    {
      id: "north-polar-land",
      label: "North Polar Land",
      className: "north-polar-landmass",
      lon: 146,
      lat: 67,
      rx: 36,
      ry: 14,
      weight: 0.30,
      tilt: 7,
      family: "polar"
    },
    {
      id: "northwest-polar-land",
      label: "Northwest Polar Land",
      className: "northwest-polar-landmass",
      lon: -112,
      lat: 68,
      rx: 29,
      ry: 12,
      weight: 0.26,
      tilt: -10,
      family: "polar"
    }
  ]);

  const OCEAN_CORRIDORS = Object.freeze([
    {
      id: "west-central-great-seaway",
      lon: -96,
      lat: 5,
      rx: 19,
      ry: 50,
      weight: 0.32,
      tilt: -5
    },
    {
      id: "central-split-strait",
      lon: -18,
      lat: 3,
      rx: 15,
      ry: 49,
      weight: 0.30,
      tilt: -17
    },
    {
      id: "east-central-blue-corridor",
      lon: 34,
      lat: 10,
      rx: 18,
      ry: 47,
      weight: 0.28,
      tilt: 12
    },
    {
      id: "southern-basin-corridor",
      lon: -55,
      lat: -50,
      rx: 37,
      ry: 19,
      weight: 0.22,
      tilt: 1
    },
    {
      id: "eastern-subcontinent-strait",
      lon: 48,
      lat: -22,
      rx: 17,
      ry: 32,
      weight: 0.22,
      tilt: -20
    },
    {
      id: "northeast-inner-sea",
      lon: 100,
      lat: 9,
      rx: 19,
      ry: 23,
      weight: 0.18,
      tilt: 18
    },
    {
      id: "equatorial-far-east-sea",
      lon: 156,
      lat: -3,
      rx: 25,
      ry: 30,
      weight: 0.20,
      tilt: -18
    },
    {
      id: "joy-island-sea",
      lon: 120,
      lat: -39,
      rx: 24,
      ry: 24,
      weight: 0.18,
      tilt: 22
    },
    {
      id: "northern-gulf-cut",
      lon: -38,
      lat: 41,
      rx: 30,
      ry: 15,
      weight: 0.18,
      tilt: 8
    },
    {
      id: "central-inland-sea",
      lon: -42,
      lat: -2,
      rx: 13,
      ry: 18,
      weight: 0.13,
      tilt: 6
    },
    {
      id: "eastern-inland-bay",
      lon: 82,
      lat: 12,
      rx: 12,
      ry: 18,
      weight: 0.13,
      tilt: -12
    },
    {
      id: "southern-fjord-field",
      lon: 20,
      lat: -43,
      rx: 18,
      ry: 13,
      weight: 0.13,
      tilt: 12
    }
  ]);

  const ARCHIPELAGO_CHAINS = Object.freeze([
    {
      id: "western-shelf-archipelago",
      label: "Western Shelf Archipelago",
      lonA: -174,
      latA: -34,
      lonB: -106,
      latB: -48,
      count: 12,
      rx: 7.0,
      ry: 4.4,
      weight: 0.34,
      family: "archipelago"
    },
    {
      id: "northern-crown-islands",
      label: "Northern Crown Islands",
      lonA: -82,
      latA: 47,
      lonB: 20,
      latB: 50,
      count: 15,
      rx: 6.4,
      ry: 4.0,
      weight: 0.28,
      family: "archipelago"
    },
    {
      id: "east-bright-island-chain",
      label: "East Bright Island Chain",
      lonA: 98,
      latA: -24,
      lonB: 166,
      latB: -51,
      count: 14,
      rx: 6.2,
      ry: 4.2,
      weight: 0.33,
      family: "archipelago"
    },
    {
      id: "equatorial-blue-islands",
      label: "Equatorial Blue Islands",
      lonA: 132,
      latA: 8,
      lonB: -166,
      latB: -10,
      count: 17,
      rx: 5.2,
      ry: 3.6,
      weight: 0.25,
      family: "archipelago"
    },
    {
      id: "south-quiet-islands",
      label: "South Quiet Islands",
      lonA: -20,
      latA: -61,
      lonB: 92,
      latB: -59,
      count: 11,
      rx: 5.6,
      ry: 3.4,
      weight: 0.22,
      family: "archipelago"
    }
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function wrapLongitudeDelta(lon, centerLon) {
    return ((lon - centerLon + 540) % 360) - 180;
  }

  function interpolateLongitude(a, b, t) {
    const delta = wrapLongitudeDelta(b, a);
    return ((a + delta * t + 540) % 360) - 180;
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

    return lerp(lerp(a, b, sx), lerp(c, d, sx), sy);
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
      scale *= 1.92;
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
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.5;
      scale *= 1.88;
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
    let island = 0;
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
        const w = 1 - smoothstep(0.0, 1.45, d);

        if (w <= 0) continue;

        landPull += ((hash(col, row, 1001) - 0.5) * 2) * w;
        coastBite += hash(col, row, 2002) * w;
        shelfWidth += hash(col, row, 3003) * w;
        beachSoftness += hash(col, row, 4004) * w;
        ridge += hash(col, row, 5005) * w;
        basin += hash(col, row, 6006) * w;
        peninsula += hash(col, row, 7007) * w;
        greenBelt += hash(col, row, 8008) * w;
        island += hash(col, row, 8508) * w;
        technology += hash(col, row, 9009) * w;
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
      island: clamp(island / n, 0, 1),
      technology: clamp(technology / n, 0, 1)
    });
  }

  function ellipticalScore(lon, lat, item) {
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

  function oceanCutScore(lon, lat, cut) {
    return Math.max(0, ellipticalScore(lon, lat, cut));
  }

  function nearestLandBody(lon, lat) {
    let best = LAND_BODIES[0];
    let bestScore = -Infinity;

    for (const body of LAND_BODIES) {
      const score = ellipticalScore(lon, lat, body);
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

  function archipelagoScore(lon, lat, u, v, province, nodal) {
    let bestScore = -Infinity;
    let bestChain = null;
    let bestIndex = -1;

    for (const chain of ARCHIPELAGO_CHAINS) {
      for (let i = 0; i < chain.count; i += 1) {
        const t = chain.count <= 1 ? 0 : i / (chain.count - 1);
        const seed = hash(i, chain.count, 17000 + chain.id.length);
        const wobbleLon = (seed - 0.5) * 11;
        const wobbleLat = (hash(i, chain.count, 18000 + chain.id.length) - 0.5) * 7;
        const centerLon = interpolateLongitude(chain.lonA, chain.lonB, t) + wobbleLon;
        const centerLat = lerp(chain.latA, chain.latB, t) + wobbleLat;
        const rx = chain.rx * lerp(0.72, 1.20, hash(i, 11, 19000));
        const ry = chain.ry * lerp(0.70, 1.16, hash(i, 13, 20000));
        const tilt = lerp(-28, 28, hash(i, 17, 21000));
        const weight = chain.weight * lerp(0.76, 1.16, hash(i, 19, 22000));

        const score = ellipticalScore(lon, lat, {
          lon: centerLon,
          lat: centerLat,
          rx,
          ry,
          weight,
          tilt
        });

        if (score > bestScore) {
          bestScore = score;
          bestChain = chain;
          bestIndex = i;
        }
      }
    }

    const islandNoise =
      (fbm(u * 12.0 + nodal.island * 0.4, v * 9.2 - province.island * 0.3, 244300, 3) - 0.5) * 0.055 +
      ridgeNoise(u * 23.0 - 0.17, v * 16.0 + 0.11, 244900, 2) * 0.030;

    const provinceLift = province.island * 0.060 + nodal.island * 0.035;
    const score = bestScore + islandNoise + provinceLift - 0.045;

    return Object.freeze({
      score,
      chain: bestChain,
      index: bestIndex
    });
  }

  function landFieldDetails(u, v) {
    const { longitude, latitude } = uvToLonLat(u, v);
    const cells = latticeCells(u, v);
    const province = summitProvinceFor(cells, longitude, latitude);
    const nodal = nodalInfluence(u, v, cells);
    const nearest = nearestLandBody(longitude, latitude);

    let bodyScore = -Infinity;

    for (const body of LAND_BODIES) {
      const local = ellipticalScore(longitude, latitude, body);
      const localTexture =
        (fbm(u * 2.15 + body.lon * 0.002, v * 1.75 - body.lat * 0.003, 311000 + body.id.length, 4) - 0.5) * 0.070 +
        (ridgeNoise(u * 7.2 - body.lat * 0.004, v * 5.6 + body.lon * 0.002, 312000 + body.id.length, 3) - 0.5) * 0.040;

      bodyScore = Math.max(bodyScore, local + localTexture);
    }

    const archipelago = archipelagoScore(longitude, latitude, u, v, province, nodal);

    let oceanCut = 0;
    let strongestCut = null;

    for (const cut of OCEAN_CORRIDORS) {
      const score = oceanCutScore(longitude, latitude, cut);
      if (score > oceanCut) {
        oceanCut = score;
        strongestCut = cut;
      }
    }

    const continentalTexture =
      (fbm(u * 1.28 + 0.04, v * 1.02 - 0.02, 411000, 5) - 0.5) * 0.078 +
      (fbm(u * 4.80 - 0.18, v * 3.85 + 0.07, 411700, 4) - 0.5) * 0.052;

    const coastFracture =
      ridgeNoise(u * 13.0 + nodal.coastBite * 0.31, v * 9.8 - nodal.peninsula * 0.19, 414300, 3) *
      (0.020 + province.coastBite * 0.052 + nodal.coastBite * 0.034);

    const straitThread =
      ridgeNoise(u * 18.0 - 0.33, v * 13.5 + 0.21, 415100, 2) *
      smoothstep(0.54, 0.92, nodal.coastBite) *
      (0.014 + province.coastBite * 0.018);

    const peninsulaPull =
      smoothstep(0.50, 0.94, nodal.peninsula) *
      (0.012 + province.coastBite * 0.014) *
      (Math.sin((u * 9.0 - v * 6.5) * Math.PI * 2) * 0.5 + 0.5);

    const greenLift = smoothstep(0.62, 0.96, nodal.greenBelt) * province.green * 0.014;
    const nodalLift = nodal.landPull * 0.040;
    const polarRestraint = smoothstep(78, 90, Math.abs(latitude)) * 0.130;

    const baseScore = Math.max(bodyScore, archipelago.score);
    const archipelagoDominant = archipelago.score > bodyScore;

    const raw =
      baseScore +
      continentalTexture +
      province.landPressure +
      nodalLift +
      greenLift +
      peninsulaPull -
      oceanCut * (0.90 + province.coastBite * 0.48) -
      coastFracture -
      straitThread -
      polarRestraint -
      0.050;

    return Object.freeze({
      raw,
      baseScore,
      bodyScore,
      archipelagoScore: archipelago.score,
      archipelagoDominant,
      archipelagoChain: archipelago.chain,
      archipelagoIndex: archipelago.index,
      cells,
      province,
      nodal,
      oceanCut,
      strongestCut,
      coastFracture,
      straitThread,
      peninsulaPull,
      longitude,
      latitude,
      nearest
    });
  }

  function landField(u, v) {
    return landFieldDetails(u, v).raw;
  }

  function beachWidthFor(details) {
    const { province, nodal, archipelagoDominant } = details;

    return clamp(
      0.030 +
      province.beach * 0.045 +
      nodal.beachSoftness * 0.030 +
      (archipelagoDominant ? 0.010 : 0) -
      nodal.ridge * 0.010,
      0.026,
      0.092
    );
  }

  function shelfWidthFor(details) {
    const { province, nodal, archipelagoDominant } = details;

    return clamp(
      0.100 +
      province.shelf * 0.112 +
      nodal.shelfWidth * 0.066 +
      province.basin * 0.022 +
      (archipelagoDominant ? 0.030 : 0),
      0.092,
      0.260
    );
  }

  function coastalEdge(raw, beachWidth, shelfWidth) {
    const width = Math.max(0.082, beachWidth + shelfWidth * 0.48);
    return clamp(1 - Math.abs(raw) / width, 0, 1);
  }

  function elevationValue(u, v, raw, body, lat, details) {
    const bodyPressure = clamp((raw + 0.08) / 0.62, 0, 1);
    const ridgeField =
      ridgeNoise(u * 2.1 + 0.16, v * 1.8 - 0.13, 522000, 5) * 0.48 +
      ridgeNoise(u * 6.3 - 0.08, v * 5.4 + 0.19, 522600, 4) * 0.29;

    const province = details.province;
    const nodal = details.nodal;

    const mountainBias =
      body.family === "continental" ? 0.11 :
      body.family === "subcontinental" ? 0.075 :
      body.family === "polar" ? 0.035 :
      0.018;

    const summitRidge = province.ridge * 0.20 + nodal.ridge * 0.14;
    const basinSoftening = province.basin * 0.10 + nodal.basin * 0.05;
    const coastalLow = details.edge * 0.18;
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
    if (details.edge > 0.64 && elev < 0.40) return "coastal-lowland";
    if (details.archipelagoDominant && elev < 0.52) return "island-lowland";
    if (elev >= 0.82) return "mountain";
    if (elev >= 0.67) return "highland";
    if (elev >= 0.52) return "plateau";

    const wetness =
      fbm(u * 2.2 - 0.11, v * 1.9 + 0.21, 533000, 4) * 0.66 +
      details.province.basin * 0.22 +
      details.nodal.basin * 0.11;

    if (wetness > 0.72 && Math.abs(lat) < 42) return "wetland";
    if (wetness > 0.52 && Math.abs(lat) < 58) return "forest";

    if (body.family === "large-island") return "island-lowland";
    return "lowland";
  }

  function topologyFor(terrainClass, raw, body, details) {
    if (terrainClass === "ocean") {
      if (details.strongestCut) return "deep-ocean-corridor";
      return "deep-ocean";
    }

    if (terrainClass === "shelf") return "continental-shelf";
    if (terrainClass === "beach") {
      if (details.archipelagoDominant) return "island-beach-band";
      if (details.nodal.beachSoftness > 0.62) return "cloud-soft-beach-band";
      return "coastal-beach-band";
    }

    if (terrainClass === "polar-ice") return "polar-cap";
    if (terrainClass === "mountain") return "ancient-mountain-belt";
    if (terrainClass === "highland") return "highland-shoulder";
    if (terrainClass === "plateau") return "old-plateau";
    if (terrainClass === "wetland") return "protected-wetland-basin";
    if (terrainClass === "forest") return "restoration-green-belt";
    if (terrainClass === "coastal-lowland") return "living-coastal-lowland";
    if (details.archipelagoDominant) return "archipelago-island-body";
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
      if (details.archipelagoDominant) return "opal-archipelago-coast";
      if (details.province.name === "Joy") return "white-opal-bright-coast";
      if (details.province.name === "Dignity") return "black-diamond-mineral-sand";
      if (details.province.name === "Stewardship") return "restoration-shelf-green-gold";
      return "opal-diamond-coast";
    }

    if (terrainClass === "mountain" || terrainClass === "highland") return "ancient-mineral-pressure";
    if (terrainClass === "shelf") return "coastal-shelf-transition";
    if (terrainClass === "wetland") return "protected-water-memory";
    if (terrainClass === "forest") return "living-green-belt";
    if (terrainClass === "island-lowland") return "archipelago-living-edge";
    return "audralia-earth-legacy-living-surface";
  }

  function sampleLandmap(uInput, vInput) {
    const u = wrap01(Number.isFinite(Number(uInput)) ? Number(uInput) : 0);
    const v = clamp(Number.isFinite(Number(vInput)) ? Number(vInput) : 0, 0, 1);
    const detailsBase = landFieldDetails(u, v);
    const { longitude, latitude, cells, province, nodal } = detailsBase;
    const raw = detailsBase.raw;
    const body = detailsBase.nearest.body;

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
      elevationScore = 0.07 + smoothstep(-shelfWidth, 0, raw) * 0.12;
    } else if (isBeach && !isPolarIce) {
      terrainClass = "beach";
      elevationScore = 0.15 + smoothstep(0, beachWidth, raw) * 0.08;
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

      landmassId: details.archipelagoDominant && details.archipelagoChain ? details.archipelagoChain.id : body.id,
      landmassLabel: details.archipelagoDominant && details.archipelagoChain ? details.archipelagoChain.label : body.label,
      landmassClass: details.archipelagoDominant ? "archipelago-island-chain" : body.className,
      landmassFamily: details.archipelagoDominant ? "archipelago" : body.family,

      terrainClass,
      topology,
      elevation,
      elevationScore,

      landScore: raw,
      bodyScore: details.bodyScore,
      archipelagoScore: details.archipelagoScore,
      oceanCut: details.oceanCut,
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
      archipelagoIsland: Boolean(details.archipelagoDominant),
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
      nodalIsland: nodal.island,
      nodalTechnology: nodal.technology,

      oneBigGlobCorrected: true,
      landmassSeparationActive: true,
      oceanCorridorsActive: true,
      archipelagoChainsActive: true,
      baysInletsStraitsActive: true,
      jaggedCoastlinesActive: true,

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
    let archipelago = 0;
    let total = 0;

    for (let y = 0; y < samplesHigh; y += 1) {
      const v = (y + 0.5) / samplesHigh;

      for (let x = 0; x < samplesWide; x += 1) {
        const u = (x + 0.5) / samplesWide;
        const map = sampleLandmap(u, v);

        total += 1;

        if (map.isPolarIce) polar += 1;
        if (map.archipelagoIsland) archipelago += 1;
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
      archipelagoRatio: Number((archipelago / denom).toFixed(4)),
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
      downstreamTargets: [
        "/assets/audralia/audralia.hydrology.js",
        "/assets/audralia/audralia.topology.js",
        "/assets/audralia/audralia.elevation.js",
        "/assets/audralia/audralia.land.surface.js",
        "/assets/audralia/audralia.canvas.js"
      ],
      oneBigGlobCorrected: true,
      landmassSeparationActive: true,
      oceanCorridorsActive: true,
      archipelagoChainsActive: true,
      baysInletsStraitsActive: true,
      jaggedCoastlinesActive: true,
      offshoreFragmentsActive: true,
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
    oceanCorridors: OCEAN_CORRIDORS,
    archipelagoChains: ARCHIPELAGO_CHAINS,
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
  document.documentElement.dataset.audraliaLandmassSeparationActive = "true";
  document.documentElement.dataset.audraliaOceanCorridorsActive = "true";
  document.documentElement.dataset.audraliaArchipelagoChainsActive = "true";
  document.documentElement.dataset.audraliaBaysInletsStraitsActive = "true";
  document.documentElement.dataset.audraliaJaggedCoastlinesActive = "true";
  document.documentElement.dataset.audraliaOffshoreFragmentsActive = "true";
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
  document.documentElement.dataset.audraliaTargetLandRatio = "28_to_40_percent";
  document.documentElement.dataset.audraliaTargetOceanRatio = "60_to_72_percent";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
