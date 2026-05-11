// /assets/h-earth/h-earth.landmap.js
// H_EARTH_G1_TERRAIN_ONLY_LANDMAP_TNT_v1
// Full-file replacement.
// Landmap parent mask authority only.
//
// Owns:
// - parent land/water mask
// - ocean-dominant balance
// - exposed land ratio
// - coastline candidate fields
// - basin/seaway eligibility
// - protected Earth-shell adaptation rules
//
// Does not own:
// - terrain height
// - surface color
// - canvas paint
// - motion
// - atmosphere
// - weather

const CONTRACT = "H_EARTH_G1_TERRAIN_ONLY_LANDMAP_TNT_v1";
const REQUIRED_PARENT = "lattice256";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const TERRAIN_ONLY_CHAIN = "H_EARTH_G1_COMPLETE_TERRAIN_ONLY_PARENT_CHAIN_TNT_v1";
const VERSION = "2026-05-10.h-earth.g1.terrain-only.landmap";

const LAND_TARGET_MIN = 0.30;
const LAND_TARGET_MAX = 0.42;

const BODY_ANCHORS = Object.freeze([
  {
    id: "north-crown",
    label: "North Crown Body",
    type: "polar-highland-body",
    lon: -18,
    lat: 62,
    rx: 58,
    ry: 24,
    weight: 1.1,
    terrainBias: "polar-crust-seat"
  },
  {
    id: "western-shield",
    label: "Western Shield Body",
    type: "shield-continent",
    lon: -112,
    lat: 22,
    rx: 50,
    ry: 38,
    weight: 1.18,
    terrainBias: "plateau-and-mountain-spine"
  },
  {
    id: "eastern-spine",
    label: "Eastern Spine Body",
    type: "spine-continent",
    lon: 84,
    lat: 18,
    rx: 44,
    ry: 42,
    weight: 1.16,
    terrainBias: "ridge-valley-corridor"
  },
  {
    id: "southern-basin",
    label: "Southern Basin Body",
    type: "basin-continent",
    lon: 24,
    lat: -48,
    rx: 62,
    ry: 30,
    weight: 1.05,
    terrainBias: "basin-escarpment-plateau"
  },
  {
    id: "equatorial-bridge",
    label: "Equatorial Bridge Body",
    type: "bridge-continent",
    lon: -18,
    lat: -4,
    rx: 38,
    ry: 18,
    weight: 0.92,
    terrainBias: "seaway-cut-bridge-land"
  },
  {
    id: "north-east-archipelago",
    label: "North East Archipelago",
    type: "archipelago-chain",
    lon: 138,
    lat: 42,
    rx: 34,
    ry: 18,
    weight: 0.76,
    terrainBias: "island-fragment-chain"
  },
  {
    id: "south-west-fragment-chain",
    label: "South West Fragment Chain",
    type: "fragment-chain",
    lon: -142,
    lat: -38,
    rx: 36,
    ry: 16,
    weight: 0.72,
    terrainBias: "offshore-fragment-seat"
  }
]);

const FRACTURE_LINES = Object.freeze([
  {
    id: "northwest-to-southeast-primary",
    label: "Northwest to Southeast Primary Fracture",
    angle: -32,
    offset: -0.08,
    width: 0.11,
    effect: "coast-break-and-valley-eligibility"
  },
  {
    id: "southwest-to-northeast-secondary",
    label: "Southwest to Northeast Secondary Fracture",
    angle: 41,
    offset: 0.16,
    width: 0.09,
    effect: "ridge-and-seaway-eligibility"
  },
  {
    id: "equatorial-seaway",
    label: "Equatorial Seaway Cut",
    angle: 4,
    offset: -0.02,
    width: 0.07,
    effect: "ocean-corridor-protection"
  },
  {
    id: "polar-ring-break",
    label: "Polar Ring Break",
    angle: 88,
    offset: 0.34,
    width: 0.08,
    effect: "polar-shelf-and-crust-boundary"
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

function deterministicTectonicNoise(cell) {
  const raw =
    Math.sin((cell.index + 1) * 12.9898) * 43758.5453 +
    Math.cos((cell.row + 3) * 19.19) * 313.37 +
    Math.sin((cell.col + 5) * 7.73) * 131.11;

  return raw - Math.floor(raw);
}

function computeLandScore(cell) {
  const bodyScore = BODY_ANCHORS.reduce((sum, anchor) => {
    return sum + ellipticalInfluence(cell, anchor);
  }, 0);

  const fractureCut = FRACTURE_LINES.reduce((sum, fracture) => {
    const value = fractureValue(cell, fracture);
    if (fracture.effect.includes("seaway")) return sum + value * 0.34;
    if (fracture.effect.includes("coast-break")) return sum + value * 0.18;
    return sum + value * 0.10;
  }, 0);

  const polarGuard = Math.abs(cell.lat) > 72 ? -0.18 : 0;
  const oceanDominance = -0.31;
  const noise = (deterministicTectonicNoise(cell) - 0.5) * 0.18;

  return round(bodyScore + noise + polarGuard + oceanDominance - fractureCut);
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

function classifyBaseCell(cell) {
  const score = computeLandScore(cell);
  const nearest = nearestBody(cell);
  const isLand = score > 0.17;

  return {
    ...cell,
    landScore: score,
    maskClass: isLand ? "land" : "ocean",
    isLand,
    isOcean: !isLand,
    bodyId: isLand && nearest.body ? nearest.body.id : null,
    bodyLabel: isLand && nearest.body ? nearest.body.label : null,
    bodyType: isLand && nearest.body ? nearest.body.type : null,
    terrainBias: isLand && nearest.body ? nearest.body.terrainBias : null,
    nearestBodyId: nearest.body ? nearest.body.id : null,
    nearestBodyScore: nearest.score,
    protectedEarthShellAdaptation: "reference-only-no-mutation"
  };
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

    const fracturePressure = FRACTURE_LINES.reduce((max, fracture) => {
      return Math.max(max, fractureValue(cell, fracture));
    }, 0);

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
      fracturePressure: round(fracturePressure),
      coastlineCandidate: isCoast || isShelf,
      basinEligible: cell.isLand && !isCoast && fracturePressure > 0.34,
      seawayEligible: cell.isOcean && shelfPressure > 0.18 && fracturePressure > 0.24,
      islandCandidate: cell.isLand && landNeighbors <= 2 && oceanNeighbors >= 4,
      archipelagoCandidate: cell.isLand && landNeighbors <= 3 && Math.abs(cell.lat) < 58,
      protectedOceanCorridor: cell.isOcean && fracturePressure > 0.42
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

  return Object.freeze({
    totalCells: cells.length,
    landCells: land.length,
    oceanCells: ocean.length,
    coastCells: coast.length,
    shelfCells: shelf.length,
    islandCandidateCells: islands.length,
    seawayEligibleCells: seaways.length,
    landRatio: round(land.length / cells.length, 4),
    oceanRatio: round(ocean.length / cells.length, 4),
    oceanDominant: ocean.length > land.length,
    withinTargetLandRange: land.length / cells.length >= LAND_TARGET_MIN && land.length / cells.length <= LAND_TARGET_MAX
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

  const baseCells = lattice256.cells.map(classifyBaseCell);
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
  BODY_ANCHORS,
  FRACTURE_LINES
};

export default createHEarthLandmap;
