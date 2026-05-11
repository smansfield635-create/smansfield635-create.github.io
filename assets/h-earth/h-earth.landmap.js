// /assets/h-earth/h-earth.landmap.js
// H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2
// Full-file replacement.
// Landmap parent mask authority only.
//
// Purpose:
// - Raise H-Earth land ratio into lawful ocean-dominant range.
// - Preserve ocean dominance without starving land terrain.
// - Provide enough land, coast, shelf, basin, seaway, island, and body seats
//   for complete 29/29 terrain-aspect disposition.
//
// Owns:
// - parent land/water mask
// - ocean-dominant balance
// - exposed land ratio
// - coastline candidate fields
// - basin/seaway eligibility
// - body-anchor seats
// - protected Earth-shell adaptation rules
//
// Does not own:
// - terrain height
// - surface color
// - canvas paint
// - motion
// - atmosphere
// - weather

const CONTRACT = "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2";
const REQUIRED_PARENT = "lattice256";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const TERRAIN_ONLY_CHAIN = "H_EARTH_G1_COMPLETE_TERRAIN_ONLY_PARENT_CHAIN_TNT_v1";
const VERSION = "2026-05-11.h-earth.g1.landmap-balance-full-aspect-disposition-v2";

const LAND_TARGET_MIN = 0.30;
const LAND_TARGET_MAX = 0.42;
const TARGET_LAND_CELLS = 92;

const BODY_ANCHORS = Object.freeze([
  {
    id: "north-crown",
    label: "North Crown Body",
    type: "polar-highland-body",
    lon: -16,
    lat: 61,
    rx: 66,
    ry: 31,
    weight: 1.32,
    terrainBias: "polar-crust-seat"
  },
  {
    id: "western-shield",
    label: "Western Shield Body",
    type: "shield-continent",
    lon: -109,
    lat: 20,
    rx: 67,
    ry: 48,
    weight: 1.38,
    terrainBias: "plateau-and-mountain-spine"
  },
  {
    id: "eastern-spine",
    label: "Eastern Spine Body",
    type: "spine-continent",
    lon: 82,
    lat: 17,
    rx: 61,
    ry: 50,
    weight: 1.36,
    terrainBias: "ridge-valley-corridor"
  },
  {
    id: "southern-basin",
    label: "Southern Basin Body",
    type: "basin-continent",
    lon: 20,
    lat: -45,
    rx: 72,
    ry: 38,
    weight: 1.24,
    terrainBias: "basin-escarpment-plateau"
  },
  {
    id: "equatorial-bridge",
    label: "Equatorial Bridge Body",
    type: "bridge-continent",
    lon: -18,
    lat: -3,
    rx: 52,
    ry: 24,
    weight: 1.02,
    terrainBias: "seaway-cut-bridge-land"
  },
  {
    id: "north-east-archipelago",
    label: "North East Archipelago",
    type: "archipelago-chain",
    lon: 137,
    lat: 41,
    rx: 42,
    ry: 22,
    weight: 0.94,
    terrainBias: "island-fragment-chain"
  },
  {
    id: "south-west-fragment-chain",
    label: "South West Fragment Chain",
    type: "fragment-chain",
    lon: -142,
    lat: -38,
    rx: 44,
    ry: 21,
    weight: 0.9,
    terrainBias: "offshore-fragment-seat"
  }
]);

const FRACTURE_LINES = Object.freeze([
  {
    id: "northwest-to-southeast-primary",
    label: "Northwest to Southeast Primary Fracture",
    angle: -32,
    offset: -0.08,
    width: 0.13,
    effect: "coast-break-valley-fault-ridge"
  },
  {
    id: "southwest-to-northeast-secondary",
    label: "Southwest to Northeast Secondary Fracture",
    angle: 41,
    offset: 0.16,
    width: 0.11,
    effect: "ridge-seaway-fracture-zone"
  },
  {
    id: "equatorial-seaway",
    label: "Equatorial Seaway Cut",
    angle: 4,
    offset: -0.02,
    width: 0.085,
    effect: "ocean-corridor-protection"
  },
  {
    id: "polar-ring-break",
    label: "Polar Ring Break",
    angle: 88,
    offset: 0.34,
    width: 0.09,
    effect: "polar-shelf-crust-boundary"
  },
  {
    id: "southern-basin-mouth",
    label: "Southern Basin Mouth",
    angle: 23,
    offset: -0.36,
    width: 0.10,
    effect: "basin-mouth-eligibility"
  }
]);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, places = 6) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function lonDistance(a, b) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function ellipticalInfluence(cell, anchor) {
  const dx = lonDistance(cell.lon, anchor.lon) / anchor.rx;
  const dy = Math.abs(cell.lat - anchor.lat) / anchor.ry;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0, 1 - distance) * anchor.weight;
}

function fractureValue(cell, fracture) {
  const angle = (fracture.angle * Math.PI) / 180;
  const nx = Math.cos(angle);
  const ny = Math.sin(angle);
  const x = cell.lon / 180;
  const y = cell.lat / 90;
  const lineDistance = Math.abs(x * nx + y * ny - fracture.offset);
  return Math.max(0, 1 - lineDistance / fracture.width);
}

function deterministicNoise(cell, salt = 1) {
  const raw =
    Math.sin((cell.index + 1) * (12.9898 + salt)) * 43758.5453 +
    Math.cos((cell.row + 3) * (19.19 + salt)) * 313.37 +
    Math.sin((cell.col + 5) * (7.73 + salt)) * 131.11;

  return raw - Math.floor(raw);
}

function nearestBody(cell) {
  let best = null;
  let bestScore = -Infinity;

  for (const anchor of BODY_ANCHORS) {
    const score = ellipticalInfluence(cell, anchor);
    if (score > bestScore) {
      best = anchor;
      bestScore = score;
    }
  }

  return {
    body: best,
    score: round(bestScore)
  };
}

function strongestFracture(cell) {
  let best = null;
  let bestValue = 0;

  for (const fracture of FRACTURE_LINES) {
    const value = fractureValue(cell, fracture);
    if (value > bestValue) {
      best = fracture;
      bestValue = value;
    }
  }

  return {
    fracture: best,
    value: round(bestValue)
  };
}

function protectedSeawayPressure(cell) {
  const equatorial = FRACTURE_LINES.find((line) => line.id === "equatorial-seaway");
  const southernMouth = FRACTURE_LINES.find((line) => line.id === "southern-basin-mouth");

  const equatorialPressure = equatorial ? fractureValue(cell, equatorial) : 0;
  const southernPressure = southernMouth ? fractureValue(cell, southernMouth) : 0;
  const latitudeCorridor = Math.abs(cell.lat) < 18 ? 0.22 : 0;

  return clamp(Math.max(equatorialPressure, southernPressure) + latitudeCorridor, 0, 1);
}

function computeLandScore(cell) {
  const bodyScore = BODY_ANCHORS.reduce((sum, anchor) => {
    return sum + ellipticalInfluence(cell, anchor);
  }, 0);

  const fracture = strongestFracture(cell);
  const seawayPressure = protectedSeawayPressure(cell);
  const polarGuard = Math.abs(cell.lat) > 76 ? -0.12 : 0;
  const oceanDominance = -0.12;
  const tectonicNoise = (deterministicNoise(cell, 2) - 0.5) * 0.19;
  const fractureBreak = fracture.value * 0.09;
  const seawayCut = seawayPressure > 0.62 ? seawayPressure * 0.48 : seawayPressure * 0.12;

  return round(bodyScore + tectonicNoise + polarGuard + oceanDominance - fractureBreak - seawayCut);
}

function scoreCells(cells) {
  return cells.map((cell) => {
    const nearest = nearestBody(cell);
    const fracture = strongestFracture(cell);
    const seawayPressure = protectedSeawayPressure(cell);
    const landScore = computeLandScore(cell);

    return {
      ...cell,
      landScore,
      nearestBodyId: nearest.body ? nearest.body.id : null,
      nearestBodyLabel: nearest.body ? nearest.body.label : null,
      nearestBodyType: nearest.body ? nearest.body.type : null,
      nearestBodyTerrainBias: nearest.body ? nearest.body.terrainBias : null,
      nearestBodyScore: nearest.score,
      strongestFractureId: fracture.fracture ? fracture.fracture.id : null,
      strongestFractureLabel: fracture.fracture ? fracture.fracture.label : null,
      fracturePressure: fracture.value,
      protectedSeawayPressure: round(seawayPressure),
      protectedOceanCorridor: seawayPressure > 0.66
    };
  });
}

function chooseLandKeys(scoredCells) {
  const eligible = scoredCells
    .filter((cell) => !cell.protectedOceanCorridor || cell.landScore > 0.92)
    .slice()
    .sort((a, b) => {
      return b.landScore - a.landScore || b.nearestBodyScore - a.nearestBodyScore || a.index - b.index;
    });

  const selected = new Set();

  for (const anchor of BODY_ANCHORS) {
    const bodyBest = eligible
      .filter((cell) => cell.nearestBodyId === anchor.id)
      .slice()
      .sort((a, b) => b.nearestBodyScore - a.nearestBodyScore || b.landScore - a.landScore)
      .slice(0, anchor.type.includes("archipelago") || anchor.type.includes("fragment") ? 3 : 5);

    for (const cell of bodyBest) {
      selected.add(cell.key);
    }
  }

  for (const cell of eligible) {
    if (selected.size >= TARGET_LAND_CELLS) break;
    selected.add(cell.key);
  }

  return selected;
}

function classifyBaseCell(cell, landKeys) {
  const isLand = landKeys.has(cell.key);
  const nearest = nearestBody(cell);

  return Object.freeze({
    ...cell,
    maskClass: isLand ? "land" : "ocean",
    isLand,
    isOcean: !isLand,
    bodyId: isLand && nearest.body ? nearest.body.id : null,
    bodyLabel: isLand && nearest.body ? nearest.body.label : null,
    bodyType: isLand && nearest.body ? nearest.body.type : null,
    terrainBias: isLand && nearest.body ? nearest.body.terrainBias : null,
    protectedEarthShellAdaptation: "reference-only-no-mutation"
  });
}

function enrichWithNeighbors(cells, lattice256) {
  const byKey = new Map(cells.map((cell) => [cell.key, cell]));

  return cells.map((cell) => {
    const neighbors = (lattice256.getNeighbors ? lattice256.getNeighbors(cell.key) : [])
      .map((neighbor) => byKey.get(neighbor.key))
      .filter(Boolean);

    const landNeighbors = neighbors.filter((neighbor) => neighbor.isLand).length;
    const oceanNeighbors = neighbors.filter((neighbor) => neighbor.isOcean).length;

    const isCoast = cell.isLand && oceanNeighbors > 0;
    const isShelf = cell.isOcean && landNeighbors > 0;
    const isInteriorLand = cell.isLand && oceanNeighbors === 0;
    const isOpenOcean = cell.isOcean && landNeighbors === 0;

    const coastPressure = neighbors.length ? oceanNeighbors / neighbors.length : 0;
    const shelfPressure = neighbors.length ? landNeighbors / neighbors.length : 0;
    const fracture = strongestFracture(cell);
    const seawayPressure = protectedSeawayPressure(cell);

    return Object.freeze({
      ...cell,
      isCoast,
      isShelf,
      isInteriorLand,
      isOpenOcean,
      landNeighborCount: landNeighbors,
      oceanNeighborCount: oceanNeighbors,
      coastPressure: round(coastPressure),
      shelfPressure: round(shelfPressure),
      fracturePressure: round(Math.max(cell.fracturePressure || 0, fracture.value)),
      protectedSeawayPressure: round(seawayPressure),
      coastlineCandidate: isCoast || isShelf,
      basinEligible:
        cell.isLand &&
        !isCoast &&
        (cell.bodyId === "southern-basin" || cell.bodyId === "equatorial-bridge" || cell.fracturePressure > 0.34),
      seawayEligible:
        cell.isOcean &&
        (cell.protectedSeawayPressure > 0.34 || (shelfPressure > 0.18 && cell.fracturePressure > 0.22)),
      islandCandidate:
        cell.isLand &&
        (cell.bodyType === "archipelago-chain" ||
          cell.bodyType === "fragment-chain" ||
          (landNeighbors <= 2 && oceanNeighbors >= 4)),
      archipelagoCandidate:
        cell.isLand &&
        (cell.bodyId === "north-east-archipelago" ||
          cell.bodyId === "south-west-fragment-chain" ||
          (landNeighbors <= 3 && Math.abs(cell.lat) < 58)),
      protectedOceanCorridor:
        cell.isOcean &&
        (cell.protectedSeawayPressure > 0.58 || (cell.fracturePressure > 0.48 && shelfPressure < 0.34)),
      basinMouthEligible:
        cell.isOcean &&
        shelfPressure > 0.12 &&
        (cell.strongestFractureId === "southern-basin-mouth" ||
          cell.protectedSeawayPressure > 0.28 ||
          cell.fracturePressure > 0.28)
    });
  });
}

function summarize(cells) {
  const land = cells.filter((cell) => cell.isLand);
  const ocean = cells.filter((cell) => cell.isOcean);
  const coast = cells.filter((cell) => cell.isCoast);
  const shelf = cells.filter((cell) => cell.isShelf);
  const islands = cells.filter((cell) => cell.islandCandidate);
  const seaways = cells.filter((cell) => cell.seawayEligible);

  const landRatio = land.length / cells.length;
  const oceanRatio = ocean.length / cells.length;

  return Object.freeze({
    totalCells: cells.length,
    landCells: land.length,
    oceanCells: ocean.length,
    coastCells: coast.length,
    shelfCells: shelf.length,
    islandCandidateCells: islands.length,
    seawayEligibleCells: seaways.length,
    landRatio: round(landRatio, 4),
    oceanRatio: round(oceanRatio, 4),
    oceanDominant: ocean.length > land.length,
    withinTargetLandRange: landRatio >= LAND_TARGET_MIN && landRatio <= LAND_TARGET_MAX
  });
}

function createDispositionIndex(cells) {
  const index = {
    landBodies: {},
    coastEdges: [],
    shelves: [],
    basinEligible: [],
    seawayEligible: [],
    islandCandidates: [],
    archipelagoCandidates: [],
    protectedOceanCorridors: [],
    basinMouthEligible: [],
    openOcean: [],
    interiorLand: []
  };

  for (const anchor of BODY_ANCHORS) {
    index.landBodies[anchor.id] = [];
  }

  for (const cell of cells) {
    if (cell.bodyId && index.landBodies[cell.bodyId]) index.landBodies[cell.bodyId].push(cell);
    if (cell.isCoast) index.coastEdges.push(cell);
    if (cell.isShelf) index.shelves.push(cell);
    if (cell.basinEligible) index.basinEligible.push(cell);
    if (cell.seawayEligible) index.seawayEligible.push(cell);
    if (cell.islandCandidate) index.islandCandidates.push(cell);
    if (cell.archipelagoCandidate) index.archipelagoCandidates.push(cell);
    if (cell.protectedOceanCorridor) index.protectedOceanCorridors.push(cell);
    if (cell.basinMouthEligible) index.basinMouthEligible.push(cell);
    if (cell.isOpenOcean) index.openOcean.push(cell);
    if (cell.isInteriorLand) index.interiorLand.push(cell);
  }

  return Object.freeze(
    Object.fromEntries(
      Object.entries(index).map(([key, value]) => {
        if (Array.isArray(value)) return [key, Object.freeze(value)];
        return [
          key,
          Object.freeze(
            Object.fromEntries(
              Object.entries(value).map(([bodyId, bodyCells]) => [
                bodyId,
                Object.freeze(bodyCells)
              ])
            )
          )
        ];
      })
    )
  );
}

export function createHEarthLandmap(context = {}) {
  const lattice256 = context.lattice256 || context.lattice || null;
  const kernel = context.kernel || null;

  if (!lattice256 || !Array.isArray(lattice256.cells)) {
    throw new Error("H-Earth landmap requires lattice256 parent cells.");
  }

  const scoredCells = scoreCells(lattice256.cells);
  const landKeys = chooseLandKeys(scoredCells);
  const baseCells = scoredCells.map((cell) => classifyBaseCell(cell, landKeys));
  const cells = Object.freeze(enrichWithNeighbors(baseCells, lattice256));
  const cellsByKey = Object.freeze(Object.fromEntries(cells.map((cell) => [cell.key, cell])));
  const dispositionIndex = createDispositionIndex(cells);
  const summary = summarize(cells);

  const landmap = {
    contract: CONTRACT,
    requiredParent: REQUIRED_PARENT,
    seedPacket: SEED_PACKET,
    terrainOnlyChain: TERRAIN_ONLY_CHAIN,
    version: VERSION,
    planet: "H-Earth",
    generation: "G1",
    parentReceipt: lattice256?.receipts?.lattice256 || null,
    kernelReceipt: kernel?.receipts?.kernel || null,
    owns: [
      "parent-land-water-mask",
      "ocean-dominant-balance",
      "coastline-candidate-fields",
      "basin-seaway-eligibility",
      "body-anchor-seats",
      "protected-reference-adaptation-rules"
    ],
    doesNotOwn: [
      "terrain-height",
      "surface-color",
      "canvas-paint",
      "motion",
      "atmosphere",
      "weather"
    ],
    target: Object.freeze({
      landTargetMin: LAND_TARGET_MIN,
      landTargetMax: LAND_TARGET_MAX,
      targetLandCells: TARGET_LAND_CELLS
    }),
    bodyAnchors: BODY_ANCHORS,
    fractureLines: FRACTURE_LINES,
    cells,
    cellsByKey,
    dispositionIndex,
    summary,
    receipts: Object.freeze({
      landmap: Object.freeze({
        contract: CONTRACT,
        seedPacket: SEED_PACKET,
        landRatio: summary.landRatio,
        oceanRatio: summary.oceanRatio,
        oceanDominant: summary.oceanDominant,
        withinTargetLandRange: summary.withinTargetLandRange,
        landCells: summary.landCells,
        oceanCells: summary.oceanCells,
        visualPassClaimed: false
      })
    }),
    getCellByKey(key) {
      return cellsByKey[key] || null;
    },
    getBodyCells(bodyId) {
      return dispositionIndex.landBodies[bodyId] || [];
    },
    getCoastCells() {
      return dispositionIndex.coastEdges;
    },
    getShelfCells() {
      return dispositionIndex.shelves;
    },
    getSeawayEligibleCells() {
      return dispositionIndex.seawayEligible;
    },
    getBasinMouthEligibleCells() {
      return dispositionIndex.basinMouthEligible;
    }
  };

  return Object.freeze(landmap);
}

export {
  CONTRACT,
  REQUIRED_PARENT,
  SEED_PACKET,
  TERRAIN_ONLY_CHAIN,
  VERSION,
  LAND_TARGET_MIN,
  LAND_TARGET_MAX,
  TARGET_LAND_CELLS,
  BODY_ANCHORS,
  FRACTURE_LINES
};

export default createHEarthLandmap;
