// /assets/hearth/hearth.hex.js
// HEARTH_G3_HEX_OVERLAP_SEEDED_VARIATION_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Correct hexagonal pixel substrate.
// - Hex does NOT hard-quantize visual sampling.
// - Hex provides overlapping hex influence, stable seeded variation, adjacency, and 256-state metadata.
// - Engines keep raw vector visual sampling for crisp continuous 4K-like rendering.
// - No GraphicBox. No generated image.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_HEX_OVERLAP_SEEDED_VARIATION_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const VERSION = "2026-05-09.hearth-g3-hex-overlap-seeded-variation";
  const RECEIPT = "HEARTH_G3_HEX_OVERLAP_SEEDED_VARIATION_RECEIPT";

  const TAU = Math.PI * 2;
  const GRID = 16;
  const TOTAL_HEX_CELLS = GRID * GRID;

  const AXIAL_NEIGHBORS = Object.freeze([
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1]
  ]);

  const FEATURE_CATEGORIES = Object.freeze(["peninsula", "bay", "key", "mainIsland"]);
  const LANDFORM_CATEGORIES = Object.freeze(["hill", "mountain", "cliff", "valley"]);

  const REGION_NAMES = Object.freeze([
    "Northwest Hex Field",
    "Northeast Hex Field",
    "Southwest Hex Field",
    "Southeast Hex Field"
  ]);

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function norm3(v) {
    const m = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / m, v[1] / m, v[2] / m];
  }

  function seededUnit(a, b, c, d = 0) {
    const n = Math.sin(a * 127.1 + b * 311.7 + c * 74.7 + d * 191.3) * 43758.5453123;
    return n - Math.floor(n);
  }

  function seededSigned(a, b, c, d = 0) {
    return seededUnit(a, b, c, d) * 2 - 1;
  }

  function vectorToLonLat(vec) {
    const v = norm3(vec);
    return {
      vector: v,
      lon: Math.atan2(v[0], v[2]),
      lat: Math.asin(clamp(v[1], -1, 1))
    };
  }

  function lonLatToVector(lon, lat) {
    const cl = Math.cos(lat);
    return [cl * Math.sin(lon), Math.sin(lat), cl * Math.cos(lon)];
  }

  function axialRound(qf, rf) {
    let x = qf;
    let z = rf;
    let y = -x - z;

    let rx = Math.round(x);
    let ry = Math.round(y);
    let rz = Math.round(z);

    const xDiff = Math.abs(rx - x);
    const yDiff = Math.abs(ry - y);
    const zDiff = Math.abs(rz - z);

    if (xDiff > yDiff && xDiff > zDiff) {
      rx = -ry - rz;
    } else if (yDiff > zDiff) {
      ry = -rx - rz;
    } else {
      rz = -rx - ry;
    }

    return { q: mod(rx, GRID), r: mod(rz, GRID) };
  }

  function vectorToFractionalAxial(vec) {
    const pos = vectorToLonLat(vec);
    const u = (pos.lon + Math.PI) / TAU;
    const v = (pos.lat + Math.PI / 2) / Math.PI;

    const y = clamp(v * GRID, 0, GRID - 1e-9);
    const x = mod(u * GRID, GRID);

    return {
      qf: x - y * 0.5,
      rf: y,
      u,
      v,
      lon: pos.lon,
      lat: pos.lat,
      vector: pos.vector
    };
  }

  function vectorToAxial(vec) {
    const f = vectorToFractionalAxial(vec);
    return axialRound(f.qf, f.rf);
  }

  function axialToCenterVector(q, r) {
    const y = r + 0.5;
    const x = q + y * 0.5 + 0.5;
    const u = mod(x / GRID, 1);
    const v = clamp(y / GRID, 0, 1);
    const lon = u * TAU - Math.PI;
    const lat = v * Math.PI - Math.PI / 2;
    return lonLatToVector(lon, lat);
  }

  function hexId(q, r) {
    return r * GRID + q + 1;
  }

  function axialWrappedDistance(qf, rf, q, r) {
    let best = Infinity;

    for (let oq = -GRID; oq <= GRID; oq += GRID) {
      for (let or = -GRID; or <= GRID; or += GRID) {
        const dq = qf - (q + oq);
        const dr = rf - (r + or);
        const ds = -dq - dr;
        const dist = Math.max(Math.abs(dq), Math.abs(dr), Math.abs(ds));
        if (dist < best) best = dist;
      }
    }

    return best;
  }

  function neighborCells(q, r) {
    return AXIAL_NEIGHBORS.map(([dq, dr]) => {
      const nq = mod(q + dq, GRID);
      const nr = mod(r + dr, GRID);
      return {
        hexId: hexId(nq, nr),
        q: nq,
        r: nr,
        cubeX: nq,
        cubeZ: nr,
        cubeY: -nq - nr
      };
    });
  }

  function regionBinding(q, r) {
    const eastHalf = q >= GRID / 2;
    const southHalf = r >= GRID / 2;

    if (!eastHalf && !southHalf) return 1;
    if (eastHalf && !southHalf) return 2;
    if (!eastHalf && southHalf) return 3;
    return 4;
  }

  function countryBinding(q, r, regionId) {
    const localQ = q % 8;
    const localR = r % 8;

    const east = localQ >= 4;
    const south = localR >= 4;

    let offset = 0;
    if (!east && !south) offset = 0;
    else if (east && !south) offset = 1;
    else if (!east && south) offset = 2;
    else offset = 3;

    return (regionId - 1) * 4 + offset + 1;
  }

  function directionBinding(q, r) {
    const localQ = q % 4;
    const localR = r % 4;

    if (localR === 0) return "north";
    if (localQ === 3) return "east";
    if (localR === 3) return "south";
    return "west";
  }

  function landformSeatBinding(q, r) {
    return (r % 4) * 4 + (q % 4) + 1;
  }

  function landformCategoryBinding(q, r) {
    return LANDFORM_CATEGORIES[mod(q + r, LANDFORM_CATEGORIES.length)];
  }

  function featureCategoryBinding(q, r) {
    const ringBand = Math.floor(r / 4);
    return FEATURE_CATEGORIES[clamp(ringBand, 0, 3)];
  }

  function featureFamilyBinding(featureCategory) {
    if (featureCategory === "peninsula") return "attached-coastal-extension";
    if (featureCategory === "bay") return "negative-coastline-carve";
    if (featureCategory === "key") return "low-island-chain";
    if (featureCategory === "mainIsland") return "major-detached-island";
    return "latent";
  }

  function adjacencyClass(q, r) {
    const edgeQ = q === 0 || q === GRID - 1;
    const edgeR = r === 0 || r === GRID - 1;

    if (edgeQ && edgeR) return "corner-adjacency";
    if (edgeQ || edgeR) return "edge-adjacency";
    return "interior-adjacency";
  }

  function coastRelationBinding(q, r) {
    const localSeat = landformSeatBinding(q, r);
    const feature = featureCategoryBinding(q, r);

    if (feature === "peninsula") return "attached-coast-extension";
    if (feature === "bay") return "negative-coast-carve";
    if (feature === "key") return "near-coast-key-chain";
    if (feature === "mainIsland") return "detached-main-island";

    if (localSeat <= 4) return "coast-facing";
    if (localSeat >= 13) return "interior-facing";
    return "transitional";
  }

  function variationForCell(q, r) {
    const id = hexId(q, r);
    const regionId = regionBinding(q, r);
    const countryId = countryBinding(q, r, regionId);

    return Object.freeze({
      seed: id * 1009 + regionId * 97 + countryId * 37,

      visualJitter: seededSigned(q, r, id, 1) * 0.038,
      coastlineJitter: seededSigned(q, r, id, 2) * 0.075,
      mountainJitter: seededSigned(q, r, id, 3) * 0.11,
      cliffJitter: seededSigned(q, r, id, 4) * 0.12,
      valleyJitter: seededSigned(q, r, id, 5) * 0.10,
      beachJitter: seededSigned(q, r, id, 6) * 0.09,
      islandJitter: seededSigned(q, r, id, 7) * 0.12,
      colorJitter: seededSigned(q, r, id, 8) * 0.08,

      asymmetry: seededUnit(q, r, id, 9),
      brokenArc: seededUnit(q, r, id, 10),
      irregularWeight: 0.72 + seededUnit(q, r, id, 11) * 0.56,
      featureThresholdOffset: seededSigned(q, r, id, 12) * 0.095,
      localScaleOffset: seededSigned(q, r, id, 13) * 0.055,

      deterministic: true,
      randomType: "seeded-coordinated"
    });
  }

  function sampleAxial(qInput, rInput) {
    const q = mod(Math.round(qInput), GRID);
    const r = mod(Math.round(rInput), GRID);

    const id = hexId(q, r);
    const regionId = regionBinding(q, r);
    const countryId = countryBinding(q, r, regionId);
    const landformSeat = landformSeatBinding(q, r);
    const globalLandformSeat = (countryId - 1) * 16 + landformSeat;
    const featureCategory = featureCategoryBinding(q, r);

    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      authority: "hearth-hexagonal-overlap-substrate",

      hexId: id,
      hexIndex: id - 1,
      hexGridSize: GRID,
      totalHexCells: TOTAL_HEX_CELLS,

      axialQ: q,
      axialR: r,
      cubeX: q,
      cubeZ: r,
      cubeY: -q - r,

      centerVector: axialToCenterVector(q, r),
      neighborIds: neighborCells(q, r).map((cell) => cell.hexId),
      neighbors: neighborCells(q, r),

      regionId,
      regionName: REGION_NAMES[regionId - 1],
      countryId,
      countryDirection: directionBinding(q, r),

      landformSeat,
      globalLandformSeat,
      landformCategory: landformCategoryBinding(q, r),

      featureSeat: id,
      featureCategory,
      featureFamily: featureFamilyBinding(featureCategory),

      adjacencyClass: adjacencyClass(q, r),
      coastalRelation: coastRelationBinding(q, r),

      variation: variationForCell(q, r),

      geometry: "overlapping-hexagonal-pixel-substrate",
      lattice: "16x16-256-state",
      substrateRole: "geometry-and-influence-before-terrain",
      visualSamplingMode: "raw-vector-continuity",
      generatedImage: false,
      graphicBox: false
    });
  }

  function overlappingInfluences(vec) {
    const frac = vectorToFractionalAxial(vec);
    const primary = axialRound(frac.qf, frac.rf);

    const candidates = [
      [primary.q, primary.r],
      ...AXIAL_NEIGHBORS.map(([dq, dr]) => [mod(primary.q + dq, GRID), mod(primary.r + dr, GRID)])
    ];

    const weighted = candidates.map(([q, r]) => {
      const dist = axialWrappedDistance(frac.qf, frac.rf, q, r);
      const base = Math.pow(Math.max(0, 1.35 - dist), 2.15);
      const variation = variationForCell(q, r);
      const weight = base * variation.irregularWeight;

      return {
        ...sampleAxial(q, r),
        distance: dist,
        influenceWeightRaw: weight
      };
    });

    const total = weighted.reduce((sum, cell) => sum + cell.influenceWeightRaw, 0) || 1;

    return weighted
      .map((cell) =>
        Object.freeze({
          ...cell,
          influenceWeight: cell.influenceWeightRaw / total
        })
      )
      .sort((a, b) => b.influenceWeight - a.influenceWeight);
  }

  function blendVariation(influences) {
    const result = {
      visualJitter: 0,
      coastlineJitter: 0,
      mountainJitter: 0,
      cliffJitter: 0,
      valleyJitter: 0,
      beachJitter: 0,
      islandJitter: 0,
      colorJitter: 0,
      asymmetry: 0,
      brokenArc: 0,
      irregularWeight: 0,
      featureThresholdOffset: 0,
      localScaleOffset: 0
    };

    influences.forEach((cell) => {
      const w = cell.influenceWeight || 0;
      const v = cell.variation || {};

      Object.keys(result).forEach((key) => {
        result[key] += (v[key] || 0) * w;
      });
    });

    result.deterministic = true;
    result.randomType = "overlapping-seeded-coordinated";
    return Object.freeze(result);
  }

  function sampleVector(vec) {
    const influences = overlappingInfluences(vec);
    const primary = influences[0] || sampleAxial(0, 0);
    const blendedVariation = blendVariation(influences);

    return Object.freeze({
      ...primary,
      primaryHex: primary,
      overlappingHexInfluences: influences,
      hexInfluenceCount: influences.length,
      hexInfluenceMode: "overlapping-footprints",
      blendedVariation,

      visualSamplingMode: "raw-vector-continuity",
      hardQuantization: false,
      centerVectorForMetadataOnly: primary.centerVector,

      geometry: "overlapping-hexagonal-pixel-substrate",
      substrateRole: "classification-adjacency-influence",
      generatedImage: false,
      graphicBox: false
    });
  }

  function allCells() {
    const cells = [];
    for (let r = 0; r < GRID; r += 1) {
      for (let q = 0; q < GRID; q += 1) {
        cells.push(sampleAxial(q, r));
      }
    }
    return cells;
  }

  function installSampleBridge(globalName) {
    const mod = window[globalName];

    if (!mod || typeof mod.sampleVector !== "function") {
      return false;
    }

    if (mod.hexBridgeContract === CONTRACT) {
      return true;
    }

    const original = mod;
    const originalSample = mod.sampleVector.bind(mod);
    const originalReceipt = typeof mod.receipt === "function" ? mod.receipt.bind(mod) : null;

    const bridged = Object.freeze({
      ...mod,
      hexBridgeInstalled: true,
      hexBridgeContract: CONTRACT,
      hexBridgeFamilyContract: FAMILY_CONTRACT,

      sampleVector(vec) {
        const hex = sampleVector(vec);

        // CRITICAL:
        // Visual sample stays raw-vector.
        // Hex metadata is attached after sampling.
        // Do NOT sample the visual field at hex.centerVector.
        const source = originalSample(vec);

        if (!source || typeof source !== "object") {
          return source;
        }

        return {
          ...source,

          hex,
          primaryHex: hex.primaryHex,
          overlappingHexInfluences: hex.overlappingHexInfluences,
          hexInfluenceCount: hex.hexInfluenceCount,
          hexInfluenceMode: hex.hexInfluenceMode,

          hexId: hex.hexId,
          hexIndex: hex.hexIndex,
          hexAxialQ: hex.axialQ,
          hexAxialR: hex.axialR,
          hexCubeX: hex.cubeX,
          hexCubeY: hex.cubeY,
          hexCubeZ: hex.cubeZ,
          hexNeighborIds: hex.neighborIds,

          hexRegionId: hex.regionId,
          hexRegionName: hex.regionName,
          hexCountryId: hex.countryId,
          hexCountryDirection: hex.countryDirection,

          hexLandformSeat: hex.landformSeat,
          hexGlobalLandformSeat: hex.globalLandformSeat,
          hexLandformCategory: hex.landformCategory,

          hexFeatureSeat: hex.featureSeat,
          hexFeatureCategory: hex.featureCategory,
          hexFeatureFamily: hex.featureFamily,
          hexAdjacencyClass: hex.adjacencyClass,
          hexCoastalRelation: hex.coastalRelation,

          hexVariation: hex.blendedVariation,
          visualJitter: hex.blendedVariation.visualJitter,
          coastlineJitter: hex.blendedVariation.coastlineJitter,
          mountainJitter: hex.blendedVariation.mountainJitter,
          cliffJitter: hex.blendedVariation.cliffJitter,
          valleyJitter: hex.blendedVariation.valleyJitter,
          beachJitter: hex.blendedVariation.beachJitter,
          islandJitter: hex.blendedVariation.islandJitter,
          colorJitter: hex.blendedVariation.colorJitter,
          asymmetry: hex.blendedVariation.asymmetry,
          brokenArc: hex.blendedVariation.brokenArc,
          featureThresholdOffset: hex.blendedVariation.featureThresholdOffset,

          hexQuantized: false,
          hardQuantization: false,
          visualSamplingMode: "raw-vector-continuity",
          hexSubstrateContract: CONTRACT,
          geometrySubstrate: "overlapping-hexagonal-pixel"
        };
      },

      receipt() {
        const base = originalReceipt ? originalReceipt() : {};
        return {
          ...base,
          hexBridge: {
            installed: true,
            contract: CONTRACT,
            familyContract: FAMILY_CONTRACT,
            substrate: "overlapping-hexagonal-pixel",
            quantizedSampling: false,
            rawVectorVisualSampling: true,
            overlappingInfluence: true,
            seededVariation: true,
            geometry: "16x16-256-state"
          }
        };
      }
    });

    window[`${globalName}_UNBRIDGED`] = original;
    window[globalName] = bridged;

    return true;
  }

  function installKnownBridges() {
    const modules = [
      "HEARTH_TERRAIN",
      "HEARTH_MOUNTAINS",
      "HEARTH_CLIFFS",
      "HEARTH_VALLEYS",
      "HEARTH_BEACHES",
      "HEARTH_ISLANDS"
    ];

    const results = {};

    modules.forEach((name) => {
      results[name] = installSampleBridge(name);
    });

    document.documentElement.dataset.hearthHexBridgeResults = Object.entries(results)
      .map(([name, ok]) => `${name}:${ok ? "bridged" : "not-present"}`)
      .join(",");

    return results;
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      authority: "hearth-hexagonal-overlap-substrate",
      standard: "overlapping-hexagonal-pixel-format",
      geometry: "16x16-256-state",
      totalHexCells: TOTAL_HEX_CELLS,
      visualSamplingMode: "raw-vector-continuity",
      hardQuantization: false,
      overlappingInfluence: true,
      seededVariation: true,
      grid: {
        width: GRID,
        height: GRID,
        coordinates: "axial/cube",
        neighborsPerCell: 6
      },
      owns: [
        "hex cell creation",
        "256-state geometry",
        "axial coordinates",
        "cube coordinates",
        "neighbor relationships",
        "overlapping hex influence footprints",
        "seeded coordinated variation",
        "region binding",
        "country binding",
        "landform seat binding",
        "feature category binding",
        "coastal relation binding",
        "raw-vector sample bridging"
      ],
      doesNotOwn: [
        "terrain meaning",
        "mountain detail",
        "cliff detail",
        "valley detail",
        "beach detail",
        "island body rendering",
        "hydration expansion",
        "weather",
        "clouds",
        "humidity",
        "generated images",
        "GraphicBox"
      ],
      correction:
        "Hex metadata influences the render without forcing visual samples to coarse cell centers.",
      chain: [
        "hex",
        "terrain",
        "mountains",
        "cliffs",
        "valleys",
        "beaches",
        "islands",
        "canvas"
      ]
    });
  }

  function dispose() {
    [
      "HEARTH_TERRAIN",
      "HEARTH_MOUNTAINS",
      "HEARTH_CLIFFS",
      "HEARTH_VALLEYS",
      "HEARTH_BEACHES",
      "HEARTH_ISLANDS"
    ].forEach((name) => {
      const original = window[`${name}_UNBRIDGED`];

      if (original) {
        window[name] = original;
        try {
          delete window[`${name}_UNBRIDGED`];
        } catch (_) {
          window[`${name}_UNBRIDGED`] = null;
        }
      }
    });

    if (window.HEARTH_HEX && window.HEARTH_HEX.contract === CONTRACT) {
      try {
        delete window.HEARTH_HEX;
      } catch (_) {
        window.HEARTH_HEX = null;
      }
    }
  }

  window.HEARTH_HEX = Object.freeze({
    receipt,
    contract: CONTRACT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,
    authority: "hearth-hexagonal-overlap-substrate",
    sampleVector,
    sampleAxial,
    allCells,
    overlappingInfluences,
    installSampleBridge,
    installKnownBridges
  });

  window.__HEARTH_HEX_DISPOSE__ = dispose;

  document.documentElement.dataset.hearthHexLoaded = "true";
  document.documentElement.dataset.hearthHexContract = CONTRACT;
  document.documentElement.dataset.hearthHexFamilyContract = FAMILY_CONTRACT;
  document.documentElement.dataset.hearthHexVersion = VERSION;
  document.documentElement.dataset.hearthHexStandard = "overlapping-hexagonal-pixel-format";
  document.documentElement.dataset.hearthHexGeometry = "16x16-256-state";
  document.documentElement.dataset.hearthHexTotalCells = String(TOTAL_HEX_CELLS);
  document.documentElement.dataset.hearthHexVisualSamplingMode = "raw-vector-continuity";
  document.documentElement.dataset.hearthHexHardQuantization = "false";
  document.documentElement.dataset.hearthHexOverlappingInfluence = "true";
  document.documentElement.dataset.hearthHexSeededVariation = "true";
  document.documentElement.dataset.hearthHexGeneratedImage = "false";
  document.documentElement.dataset.hearthHexGraphicBox = "false";
})();
