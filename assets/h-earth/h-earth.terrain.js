// /assets/h-earth/h-earth.terrain.js
// H_EARTH_G1_COMPLETE_TERRAIN_ONLY_TNT_v1
// Full-file replacement.
// Terrain parent relief authority only.
//
// Owns:
// - complete terrain-only relief model
// - elevation
// - escarpment
// - plateau
// - mountain
// - summit pressure
// - valley/basin candidates
// - coastline terrain disposition
// - island/fragment disposition
// - ocean-floor terrain disposition
// - terrain hierarchy derived from landmap only
//
// Does not own:
// - land/water ratio
// - route boot
// - canvas paint
// - controls
// - surface material color
// - weather
// - atmosphere
// - life systems

const CONTRACT = "H_EARTH_G1_COMPLETE_TERRAIN_ONLY_TNT_v1";
const REQUIRED_PARENT = "landmap";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const TERRAIN_ONLY_CHAIN = "H_EARTH_G1_COMPLETE_TERRAIN_ONLY_PARENT_CHAIN_TNT_v1";
const VERSION = "2026-05-10.h-earth.g1.complete-terrain-only";

const TERRAIN_ASPECTS = Object.freeze([
  "land-body-anchor",
  "coast-edge",
  "coastal-shelf",
  "beach-slope",
  "cliff-edge",
  "escarpment",
  "plateau",
  "highland",
  "mountain-spine",
  "master-summit",
  "secondary-peak",
  "valley-corridor",
  "basin",
  "canyon",
  "fault-ridge",
  "lowland",
  "island-fragment",
  "archipelago-seat",
  "polar-crust-seat",
  "glacial-terrain-seat",
  "continental-shelf",
  "slope-drop",
  "abyssal-plain",
  "trench",
  "mid-ocean-ridge",
  "seamount-chain",
  "fracture-zone",
  "seaway-corridor",
  "basin-mouth"
]);

const BODY_TERRAIN_RULES = Object.freeze({
  "north-crown": {
    summitBias: 0.92,
    plateauBias: 0.74,
    escarpmentBias: 0.66,
    valleyBias: 0.22,
    polarBias: 1,
    masterAspect: "polar-crust-seat"
  },
  "western-shield": {
    summitBias: 0.78,
    plateauBias: 0.86,
    escarpmentBias: 0.74,
    valleyBias: 0.36,
    polarBias: 0,
    masterAspect: "plateau"
  },
  "eastern-spine": {
    summitBias: 0.9,
    plateauBias: 0.62,
    escarpmentBias: 0.72,
    valleyBias: 0.58,
    polarBias: 0,
    masterAspect: "mountain-spine"
  },
  "southern-basin": {
    summitBias: 0.58,
    plateauBias: 0.7,
    escarpmentBias: 0.82,
    valleyBias: 0.76,
    polarBias: 0.34,
    masterAspect: "basin"
  },
  "equatorial-bridge": {
    summitBias: 0.42,
    plateauBias: 0.44,
    escarpmentBias: 0.62,
    valleyBias: 0.84,
    polarBias: 0,
    masterAspect: "seaway-corridor"
  },
  "north-east-archipelago": {
    summitBias: 0.38,
    plateauBias: 0.28,
    escarpmentBias: 0.82,
    valleyBias: 0.26,
    polarBias: 0.08,
    masterAspect: "archipelago-seat"
  },
  "south-west-fragment-chain": {
    summitBias: 0.36,
    plateauBias: 0.24,
    escarpmentBias: 0.86,
    valleyBias: 0.24,
    polarBias: 0.2,
    masterAspect: "island-fragment"
  }
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, places = 6) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function deterministicNoise(cell, salt = 1) {
  const raw =
    Math.sin((cell.index + 1) * (12.9898 + salt)) * 43758.5453 +
    Math.cos((cell.row + 2) * (78.233 + salt)) * 1287.13 +
    Math.sin((cell.col + 4) * (37.719 + salt)) * 918.21;

  return raw - Math.floor(raw);
}

function bodyRule(cell) {
  return BODY_TERRAIN_RULES[cell.bodyId] || {
    summitBias: 0.45,
    plateauBias: 0.45,
    escarpmentBias: 0.45,
    valleyBias: 0.45,
    polarBias: 0,
    masterAspect: "lowland"
  };
}

function normalizedLatPressure(cell) {
  return Math.abs(cell.lat) / 90;
}

function corePressure(cell) {
  return clamp(1 - cell.normalizedRadius, 0, 1);
}

function ridgeWave(cell) {
  const a = Math.sin((cell.lon / 180) * Math.PI * 2.2 + (cell.lat / 90) * 1.3);
  const b = Math.cos((cell.lat / 90) * Math.PI * 3.1 - (cell.lon / 180) * 0.7);
  return clamp((a + b + 2) / 4, 0, 1);
}

function computeLandElevation(cell) {
  const rule = bodyRule(cell);
  const noise = deterministicNoise(cell, 2);
  const ridge = ridgeWave(cell);
  const coastPenalty = cell.isCoast ? 0.22 + cell.coastPressure * 0.22 : 0;
  const interiorLift = cell.isInteriorLand ? 0.18 : 0;
  const fractureLift = cell.fracturePressure * 0.28;
  const polarLift = normalizedLatPressure(cell) * rule.polarBias * 0.22;

  const raw =
    0.28 +
    cell.landScore * 0.42 +
    ridge * rule.summitBias * 0.26 +
    corePressure(cell) * 0.16 +
    fractureLift +
    interiorLift +
    polarLift +
    (noise - 0.5) * 0.18 -
    coastPenalty;

  return round(clamp(raw, 0.05, 1));
}

function computeOceanFloorDepth(cell) {
  const noise = deterministicNoise(cell, 5);
  const shelfLift = cell.isShelf ? 0.38 + cell.shelfPressure * 0.22 : 0;
  const fractureDrop = cell.fracturePressure > 0.48 ? -0.18 : 0;
  const abyss = cell.isOpenOcean ? -0.62 : -0.32;

  const raw = abyss + shelfLift + fractureDrop + (noise - 0.5) * 0.14;

  return round(clamp(raw, -1, -0.02));
}

function classifyLandTerrain(cell, elevation) {
  const rule = bodyRule(cell);
  const latPressure = normalizedLatPressure(cell);
  const ridge = ridgeWave(cell);

  if (cell.islandCandidate) return "island-fragment";
  if (cell.archipelagoCandidate) return "archipelago-seat";

  if (latPressure > 0.76 && elevation > 0.46) return "glacial-terrain-seat";
  if (latPressure > 0.68 && elevation > 0.36) return "polar-crust-seat";

  if (cell.isCoast && cell.coastPressure > 0.68 && cell.fracturePressure > 0.38) return "cliff-edge";
  if (cell.isCoast && cell.coastPressure > 0.44) return "coast-edge";
  if (cell.isCoast) return "beach-slope";

  if (cell.basinEligible && rule.valleyBias > 0.68) return "basin";
  if (cell.fracturePressure > 0.66 && elevation > 0.42) return "fault-ridge";
  if (cell.fracturePressure > 0.54 && elevation < 0.46) return "canyon";

  if (elevation > 0.84) return "master-summit";
  if (elevation > 0.74 && ridge > 0.56) return "mountain-spine";
  if (elevation > 0.68) return "secondary-peak";
  if (elevation > 0.56 && rule.plateauBias > 0.55) return "plateau";
  if (elevation > 0.48 && rule.escarpmentBias > 0.62) return "escarpment";
  if (elevation > 0.44) return "highland";
  if (elevation < 0.26 && rule.valleyBias > 0.45) return "valley-corridor";

  return "lowland";
}

function classifyOceanTerrain(cell, depth) {
  if (cell.seawayEligible) return "seaway-corridor";
  if (cell.isShelf && cell.shelfPressure > 0.42) return "continental-shelf";
  if (cell.isShelf) return "slope-drop";
  if (cell.protectedOceanCorridor && cell.fracturePressure > 0.62) return "trench";
  if (cell.fracturePressure > 0.56 && depth < -0.58) return "mid-ocean-ridge";
  if (cell.fracturePressure > 0.44) return "fracture-zone";

  const noise = deterministicNoise(cell, 8);
  if (noise > 0.87 && depth < -0.45) return "seamount-chain";
  if (cell.shelfPressure > 0.18 && cell.fracturePressure > 0.28) return "basin-mouth";

  return "abyssal-plain";
}

function computeTerrainCell(cell) {
  if (cell.isLand) {
    const elevation = computeLandElevation(cell);
    const aspect = classifyLandTerrain(cell, elevation);

    return Object.freeze({
      ...cell,
      terrainClass: "land-terrain",
      terrainAspect: aspect,
      elevation,
      depth: 0,
      relief: round(elevation),
      slopePressure: round(cell.coastPressure * 0.42 + cell.fracturePressure * 0.58),
      summitPressure: round(clamp(elevation * 0.72 + ridgeWave(cell) * 0.28, 0, 1)),
      plateauPressure: round(clamp(elevation * bodyRule(cell).plateauBias, 0, 1)),
      escarpmentPressure: round(clamp(cell.coastPressure * 0.45 + bodyRule(cell).escarpmentBias * 0.35 + cell.fracturePressure * 0.2, 0, 1)),
      valleyPressure: round(clamp((1 - elevation) * bodyRule(cell).valleyBias + cell.fracturePressure * 0.18, 0, 1)),
      terrainOnly: true,
      surfaceMaterial: "not-authorized",
      canvasPaint: "not-authorized"
    });
  }

  const depth = computeOceanFloorDepth(cell);
  const aspect = classifyOceanTerrain(cell, depth);

  return Object.freeze({
    ...cell,
    terrainClass: "ocean-floor-terrain",
    terrainAspect: aspect,
    elevation: 0,
    depth,
    relief: round(Math.abs(depth)),
    slopePressure: round(cell.shelfPressure * 0.45 + cell.fracturePressure * 0.55),
    summitPressure: aspect === "seamount-chain" ? round(0.56 + deterministicNoise(cell, 9) * 0.3) : 0,
    plateauPressure: aspect === "continental-shelf" ? round(0.44 + cell.shelfPressure * 0.32) : 0,
    escarpmentPressure: aspect === "slope-drop" || aspect === "trench" ? round(0.48 + cell.fracturePressure * 0.4) : 0,
    valleyPressure: aspect === "trench" || aspect === "fracture-zone" ? round(0.48 + cell.fracturePressure * 0.42) : 0,
    terrainOnly: true,
    surfaceMaterial: "not-authorized",
    canvasPaint: "not-authorized"
  });
}

function indexByAspect(cells) {
  const index = Object.fromEntries(TERRAIN_ASPECTS.map((aspect) => [aspect, []]));

  for (const cell of cells) {
    if (!index[cell.terrainAspect]) index[cell.terrainAspect] = [];
    index[cell.terrainAspect].push(cell);
  }

  return Object.freeze(
    Object.fromEntries(
      Object.entries(index).map(([aspect, aspectCells]) => [
        aspect,
        Object.freeze(
          aspectCells
            .slice()
            .sort((a, b) => {
              const aWeight = a.relief + a.summitPressure + a.escarpmentPressure + a.valleyPressure;
              const bWeight = b.relief + b.summitPressure + b.escarpmentPressure + b.valleyPressure;
              return bWeight - aWeight;
            })
        )
      ])
    )
  );
}

function selectMasterSummits(cells) {
  const byBody = {};

  for (const cell of cells) {
    if (!cell.isLand || !cell.bodyId) continue;
    if (!byBody[cell.bodyId]) byBody[cell.bodyId] = [];
    byBody[cell.bodyId].push(cell);
  }

  const summits = Object.fromEntries(
    Object.entries(byBody).map(([bodyId, bodyCells]) => {
      const sorted = bodyCells
        .slice()
        .sort((a, b) => b.summitPressure - a.summitPressure || b.elevation - a.elevation);

      return [
        bodyId,
        Object.freeze(
          sorted.slice(0, 3).map((cell, index) => ({
            rank: index + 1,
            cellId: cell.id,
            key: cell.key,
            lon: cell.lon,
            lat: cell.lat,
            elevation: cell.elevation,
            summitPressure: cell.summitPressure,
            terrainAspect: index === 0 ? "master-summit" : "secondary-peak"
          }))
        )
      ];
    })
  );

  return Object.freeze(summits);
}

function createDispositionaryLocations(cells) {
  const aspectIndex = indexByAspect(cells);
  const masterSummits = selectMasterSummits(cells);

  const dispositions = {
    allAspects: {},
    masterSummits,
    landBodySeats: {},
    oceanFloorSeats: {},
    terrainCompletion: {
      everyCellAssignedTerrain: cells.every((cell) => Boolean(cell.terrainAspect)),
      aspectCatalogCount: TERRAIN_ASPECTS.length,
      populatedAspectCount: Object.values(aspectIndex).filter((aspectCells) => aspectCells.length > 0).length,
      surfaceHeld: true,
      canvasHeld: true,
      controlsHeld: true,
      visualPassClaimed: false
    }
  };

  for (const aspect of TERRAIN_ASPECTS) {
    const seats = aspectIndex[aspect] || [];

    dispositions.allAspects[aspect] = Object.freeze(
      seats.slice(0, 16).map((cell, index) => ({
        rank: index + 1,
        cellId: cell.id,
        key: cell.key,
        row: cell.row,
        col: cell.col,
        lon: cell.lon,
        lat: cell.lat,
        terrainClass: cell.terrainClass,
        terrainAspect: cell.terrainAspect,
        elevation: cell.elevation,
        depth: cell.depth,
        relief: cell.relief,
        summitPressure: cell.summitPressure,
        escarpmentPressure: cell.escarpmentPressure,
        valleyPressure: cell.valleyPressure,
        bodyId: cell.bodyId,
        bodyLabel: cell.bodyLabel
      }))
    );
  }

  for (const cell of cells) {
    if (cell.isLand && cell.bodyId) {
      if (!dispositions.landBodySeats[cell.bodyId]) dispositions.landBodySeats[cell.bodyId] = [];
      dispositions.landBodySeats[cell.bodyId].push(cell);
    }

    if (cell.isOcean) {
      if (!dispositions.oceanFloorSeats[cell.terrainAspect]) dispositions.oceanFloorSeats[cell.terrainAspect] = [];
      dispositions.oceanFloorSeats[cell.terrainAspect].push(cell);
    }
  }

  dispositions.landBodySeats = Object.freeze(
    Object.fromEntries(
      Object.entries(dispositions.landBodySeats).map(([bodyId, bodyCells]) => [
        bodyId,
        Object.freeze(
          bodyCells
            .slice()
            .sort((a, b) => b.relief - a.relief)
            .map((cell) => ({
              cellId: cell.id,
              key: cell.key,
              lon: cell.lon,
              lat: cell.lat,
              terrainAspect: cell.terrainAspect,
              elevation: cell.elevation,
              relief: cell.relief
            }))
        )
      ])
    )
  );

  dispositions.oceanFloorSeats = Object.freeze(
    Object.fromEntries(
      Object.entries(dispositions.oceanFloorSeats).map(([aspect, oceanCells]) => [
        aspect,
        Object.freeze(
          oceanCells
            .slice()
            .sort((a, b) => b.relief - a.relief)
            .map((cell) => ({
              cellId: cell.id,
              key: cell.key,
              lon: cell.lon,
              lat: cell.lat,
              terrainAspect: cell.terrainAspect,
              depth: cell.depth,
              relief: cell.relief
            }))
        )
      ])
    )
  );

  return Object.freeze(dispositions);
}

function summarizeTerrain(cells, dispositions) {
  const land = cells.filter((cell) => cell.isLand);
  const ocean = cells.filter((cell) => cell.isOcean);
  const high = land.filter((cell) => cell.elevation >= 0.62);
  const low = land.filter((cell) => cell.elevation < 0.34);
  const deep = ocean.filter((cell) => cell.depth <= -0.62);
  const shelf = ocean.filter((cell) => cell.terrainAspect === "continental-shelf" || cell.terrainAspect === "slope-drop");

  return Object.freeze({
    totalCells: cells.length,
    landTerrainCells: land.length,
    oceanFloorTerrainCells: ocean.length,
    highTerrainCells: high.length,
    lowTerrainCells: low.length,
    deepOceanFloorCells: deep.length,
    shelfOrSlopeCells: shelf.length,
    terrainAspectCount: TERRAIN_ASPECTS.length,
    populatedTerrainAspectCount: dispositions.terrainCompletion.populatedAspectCount,
    everyCellAssignedTerrain: dispositions.terrainCompletion.everyCellAssignedTerrain,
    terrainOnly: true,
    surfaceHeld: true,
    canvasHeld: true,
    controlsHeld: true,
    visualPassClaimed: false
  });
}

export function createHEarthTerrain(context = {}) {
  const landmap = context.landmap || null;
  const lattice256 = context.lattice256 || context.lattice || null;
  const kernel = context.kernel || null;

  if (!landmap || !Array.isArray(landmap.cells)) {
    throw new Error("H-Earth terrain requires landmap parent cells.");
  }

  const cells = Object.freeze(landmap.cells.map(computeTerrainCell));
  const cellsByKey = Object.freeze(Object.fromEntries(cells.map((cell) => [cell.key, cell])));
  const cellsById = Object.freeze(Object.fromEntries(cells.map((cell) => [cell.id, cell])));

  const dispositionaryLocations = createDispositionaryLocations(cells);
  const summary = summarizeTerrain(cells, dispositionaryLocations);

  const terrain = {
    contract: CONTRACT,
    requiredParent: REQUIRED_PARENT,
    seedPacket: SEED_PACKET,
    terrainOnlyChain: TERRAIN_ONLY_CHAIN,
    version: VERSION,
    planet: "H-Earth",
    generation: "G1",
    parentReceipt: landmap?.receipts?.landmap || null,
    latticeReceipt: lattice256?.receipts?.lattice256 || null,
    kernelReceipt: kernel?.receipts?.kernel || null,
    owns: [
      "complete-terrain-relief",
      "terrain-aspect-dispositionary-locations",
      "elevation",
      "bathymetry",
      "escarpment",
      "plateau",
      "mountain",
      "summit-pressure",
      "valley-basin-candidates",
      "island-fragment-seats",
      "ocean-floor-terrain"
    ],
    doesNotOwn: [
      "land-water-ratio",
      "route-boot",
      "canvas-paint",
      "controls",
      "surface-material-color",
      "weather",
      "atmosphere",
      "life-systems"
    ],
    terrainAspects: TERRAIN_ASPECTS,
    bodyTerrainRules: BODY_TERRAIN_RULES,
    cells,
    cellsByKey,
    cellsById,
    dispositionaryLocations,
    summary,
    receipts: Object.freeze({
      terrain: Object.freeze({
        contract: CONTRACT,
        seedPacket: SEED_PACKET,
        parent: REQUIRED_PARENT,
        completeTerrainOnly: true,
        totalCells: summary.totalCells,
        everyCellAssignedTerrain: summary.everyCellAssignedTerrain,
        terrainAspectCount: summary.terrainAspectCount,
        populatedTerrainAspectCount: summary.populatedTerrainAspectCount,
        surfaceHeld: true,
        canvasHeld: true,
        controlsHeld: true,
        visualPassClaimed: false
      })
    }),
    getCellByKey(key) {
      return cellsByKey[key] || null;
    },
    getCellById(id) {
      return cellsById[id] || null;
    },
    getAspectSeats(aspect) {
      return dispositionaryLocations.allAspects[aspect] || [];
    },
    getMasterSummits(bodyId = null) {
      if (bodyId) return dispositionaryLocations.masterSummits[bodyId] || [];
      return dispositionaryLocations.masterSummits;
    },
    getTerrainReceipt() {
      return this.receipts.terrain;
    }
  };

  return Object.freeze(terrain);
}

export {
  CONTRACT,
  REQUIRED_PARENT,
  SEED_PACKET,
  TERRAIN_ONLY_CHAIN,
  VERSION,
  TERRAIN_ASPECTS,
  BODY_TERRAIN_RULES
};

export default createHEarthTerrain;
