// /assets/h-earth/h-earth.terrain.js
// H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2
// Full-file replacement.
// Terrain parent relief authority only.
//
// Purpose:
// - Keep terrain-only scope.
// - Consume renewed landmap only.
// - Assign every one of the 256 cells a terrain class.
// - Force at least one lawful disposition seat for all 29 terrain aspects.
// - Preserve surface/canvas/controls as held.
//
// Owns:
// - complete terrain-only relief model
// - terrain-aspect dispositionary locations
// - elevation
// - ocean-floor depth
// - escarpment
// - plateau
// - mountain
// - summit pressure
// - valley/basin candidates
// - coastline terrain disposition
// - island/fragment disposition
// - ocean-floor terrain disposition
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

const CONTRACT = "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2";
const REQUIRED_PARENT = "landmap";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const TERRAIN_ONLY_CHAIN = "H_EARTH_G1_COMPLETE_TERRAIN_ONLY_PARENT_CHAIN_TNT_v1";
const VERSION = "2026-05-11.h-earth.g1.terrain-balance-full-aspect-disposition-v2";

const LAND_TERRAIN_ASPECTS = Object.freeze([
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
  "glacial-terrain-seat"
]);

const OCEAN_TERRAIN_ASPECTS = Object.freeze([
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

const TERRAIN_ASPECTS = Object.freeze([
  ...LAND_TERRAIN_ASPECTS,
  ...OCEAN_TERRAIN_ASPECTS
]);

const BODY_TERRAIN_RULES = Object.freeze({
  "north-crown": {
    summitBias: 0.94,
    plateauBias: 0.76,
    escarpmentBias: 0.68,
    valleyBias: 0.22,
    polarBias: 1,
    masterAspect: "polar-crust-seat"
  },
  "western-shield": {
    summitBias: 0.8,
    plateauBias: 0.88,
    escarpmentBias: 0.76,
    valleyBias: 0.38,
    polarBias: 0,
    masterAspect: "plateau"
  },
  "eastern-spine": {
    summitBias: 0.92,
    plateauBias: 0.64,
    escarpmentBias: 0.74,
    valleyBias: 0.6,
    polarBias: 0,
    masterAspect: "mountain-spine"
  },
  "southern-basin": {
    summitBias: 0.6,
    plateauBias: 0.72,
    escarpmentBias: 0.84,
    valleyBias: 0.78,
    polarBias: 0.34,
    masterAspect: "basin"
  },
  "equatorial-bridge": {
    summitBias: 0.44,
    plateauBias: 0.46,
    escarpmentBias: 0.64,
    valleyBias: 0.86,
    polarBias: 0,
    masterAspect: "seaway-corridor"
  },
  "north-east-archipelago": {
    summitBias: 0.4,
    plateauBias: 0.3,
    escarpmentBias: 0.84,
    valleyBias: 0.28,
    polarBias: 0.08,
    masterAspect: "archipelago-seat"
  },
  "south-west-fragment-chain": {
    summitBias: 0.38,
    plateauBias: 0.26,
    escarpmentBias: 0.88,
    valleyBias: 0.26,
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

function computeLandElevation(cell) {
  const rule = bodyRule(cell);
  const noise = deterministicNoise(cell, 2);
  const ridge = ridgeWave(cell);
  const coastPenalty = cell.isCoast ? 0.16 + cell.coastPressure * 0.17 : 0;
  const interiorLift = cell.isInteriorLand ? 0.22 : 0;
  const fractureLift = cell.fracturePressure * 0.3;
  const polarLift = normalizedLatPressure(cell) * rule.polarBias * 0.24;

  const raw =
    0.3 +
    cell.landScore * 0.34 +
    ridge * rule.summitBias * 0.27 +
    corePressure(cell) * 0.13 +
    fractureLift +
    interiorLift +
    polarLift +
    (noise - 0.5) * 0.16 -
    coastPenalty;

  return round(clamp(raw, 0.05, 1));
}

function computeOceanFloorDepth(cell) {
  const noise = deterministicNoise(cell, 5);
  const shelfLift = cell.isShelf ? 0.42 + cell.shelfPressure * 0.24 : 0;
  const seawayCut = cell.seawayEligible ? -0.12 : 0;
  const fractureDrop = cell.fracturePressure > 0.48 ? -0.17 : 0;
  const abyss = cell.isOpenOcean ? -0.64 : -0.34;

  const raw = abyss + shelfLift + fractureDrop + seawayCut + (noise - 0.5) * 0.13;

  return round(clamp(raw, -1, -0.02));
}

function makeBaseCell(cell) {
  if (cell.isLand) {
    const elevation = computeLandElevation(cell);
    const rule = bodyRule(cell);

    return {
      ...cell,
      terrainClass: "land-terrain",
      elevation,
      depth: 0,
      relief: round(elevation),
      ridgePressure: round(ridgeWave(cell)),
      slopePressure: round(cell.coastPressure * 0.42 + cell.fracturePressure * 0.58),
      summitPressure: round(clamp(elevation * 0.72 + ridgeWave(cell) * 0.28, 0, 1)),
      plateauPressure: round(clamp(elevation * rule.plateauBias, 0, 1)),
      escarpmentPressure: round(
        clamp(cell.coastPressure * 0.45 + rule.escarpmentBias * 0.35 + cell.fracturePressure * 0.2, 0, 1)
      ),
      valleyPressure: round(clamp((1 - elevation) * rule.valleyBias + cell.fracturePressure * 0.18, 0, 1))
    };
  }

  const depth = computeOceanFloorDepth(cell);

  return {
    ...cell,
    terrainClass: "ocean-floor-terrain",
    elevation: 0,
    depth,
    relief: round(Math.abs(depth)),
    ridgePressure: round(ridgeWave(cell)),
    slopePressure: round(cell.shelfPressure * 0.45 + cell.fracturePressure * 0.55),
    summitPressure: 0,
    plateauPressure: cell.isShelf ? round(0.38 + cell.shelfPressure * 0.32) : 0,
    escarpmentPressure: cell.isShelf || cell.fracturePressure > 0.4 ? round(0.32 + cell.fracturePressure * 0.42) : 0,
    valleyPressure: cell.fracturePressure > 0.4 ? round(0.36 + cell.fracturePressure * 0.44) : 0
  };
}

function defaultLandAspect(cell) {
  if (cell.islandCandidate) return "island-fragment";
  if (cell.archipelagoCandidate) return "archipelago-seat";

  if (normalizedLatPressure(cell) > 0.76 && cell.elevation > 0.46) return "glacial-terrain-seat";
  if (normalizedLatPressure(cell) > 0.66 && cell.elevation > 0.34) return "polar-crust-seat";

  if (cell.isCoast && cell.coastPressure > 0.66 && cell.fracturePressure > 0.34) return "cliff-edge";
  if (cell.isCoast && cell.coastPressure > 0.54) return "coast-edge";
  if (cell.isCoast && cell.elevation < 0.34) return "beach-slope";
  if (cell.isCoast) return "coastal-shelf";

  if (cell.basinEligible && cell.valleyPressure > 0.62) return "basin";
  if (cell.fracturePressure > 0.66 && cell.elevation > 0.42) return "fault-ridge";
  if (cell.fracturePressure > 0.54 && cell.elevation < 0.48) return "canyon";

  if (cell.elevation > 0.84) return "master-summit";
  if (cell.elevation > 0.73 && cell.ridgePressure > 0.54) return "mountain-spine";
  if (cell.elevation > 0.67) return "secondary-peak";
  if (cell.elevation > 0.56 && cell.plateauPressure > 0.48) return "plateau";
  if (cell.elevation > 0.48 && cell.escarpmentPressure > 0.52) return "escarpment";
  if (cell.elevation > 0.42) return "highland";
  if (cell.elevation < 0.28 && cell.valleyPressure > 0.42) return "valley-corridor";

  return "lowland";
}

function defaultOceanAspect(cell) {
  if (cell.seawayEligible && cell.protectedSeawayPressure > 0.42) return "seaway-corridor";
  if (cell.basinMouthEligible) return "basin-mouth";
  if (cell.isShelf && cell.shelfPressure > 0.42) return "continental-shelf";
  if (cell.isShelf) return "slope-drop";
  if (cell.protectedOceanCorridor && cell.fracturePressure > 0.6) return "trench";
  if (cell.fracturePressure > 0.58 && cell.depth < -0.55) return "mid-ocean-ridge";
  if (cell.fracturePressure > 0.44) return "fracture-zone";

  if (deterministicNoise(cell, 8) > 0.84 && cell.depth < -0.42) return "seamount-chain";

  return "abyssal-plain";
}

function defaultAspect(cell) {
  return cell.isLand ? defaultLandAspect(cell) : defaultOceanAspect(cell);
}

function isLandAspect(aspect) {
  return LAND_TERRAIN_ASPECTS.includes(aspect);
}

function scoreCandidate(cell, aspect) {
  switch (aspect) {
    case "land-body-anchor":
      return cell.isLand ? cell.nearestBodyScore + cell.landScore : -Infinity;
    case "coast-edge":
      return cell.isLand && cell.isCoast ? cell.coastPressure + cell.fracturePressure * 0.4 : -Infinity;
    case "coastal-shelf":
      return cell.isLand && cell.isCoast ? cell.coastPressure + (1 - cell.fracturePressure) * 0.3 : -Infinity;
    case "beach-slope":
      return cell.isLand && cell.isCoast ? (1 - cell.elevation) + (1 - cell.fracturePressure) : -Infinity;
    case "cliff-edge":
      return cell.isLand && cell.isCoast ? cell.fracturePressure + cell.elevation : -Infinity;
    case "escarpment":
      return cell.isLand ? cell.escarpmentPressure + cell.coastPressure * 0.35 : -Infinity;
    case "plateau":
      return cell.isLand ? cell.plateauPressure + cell.elevation * 0.35 : -Infinity;
    case "highland":
      return cell.isLand ? cell.elevation + cell.ridgePressure * 0.25 : -Infinity;
    case "mountain-spine":
      return cell.isLand ? cell.ridgePressure + cell.elevation + cell.fracturePressure * 0.35 : -Infinity;
    case "master-summit":
      return cell.isLand ? cell.summitPressure + cell.elevation : -Infinity;
    case "secondary-peak":
      return cell.isLand ? cell.summitPressure + cell.elevation * 0.75 + cell.ridgePressure * 0.25 : -Infinity;
    case "valley-corridor":
      return cell.isLand ? cell.valleyPressure + (1 - cell.elevation) * 0.35 + cell.fracturePressure * 0.25 : -Infinity;
    case "basin":
      return cell.isLand ? (cell.basinEligible ? 1 : 0) + cell.valleyPressure + (1 - cell.elevation) : -Infinity;
    case "canyon":
      return cell.isLand ? cell.fracturePressure + cell.valleyPressure + (1 - cell.elevation) * 0.25 : -Infinity;
    case "fault-ridge":
      return cell.isLand ? cell.fracturePressure + cell.elevation + cell.ridgePressure * 0.3 : -Infinity;
    case "lowland":
      return cell.isLand ? (1 - cell.elevation) + (cell.isInteriorLand ? 0.25 : 0) : -Infinity;
    case "island-fragment":
      return cell.isLand ? (cell.islandCandidate ? 1.25 : 0) + cell.oceanNeighborCount * 0.2 : -Infinity;
    case "archipelago-seat":
      return cell.isLand ? (cell.archipelagoCandidate ? 1.25 : 0) + cell.oceanNeighborCount * 0.16 : -Infinity;
    case "polar-crust-seat":
      return cell.isLand ? normalizedLatPressure(cell) + cell.elevation * 0.4 : -Infinity;
    case "glacial-terrain-seat":
      return cell.isLand ? normalizedLatPressure(cell) + cell.elevation * 0.7 : -Infinity;
    case "continental-shelf":
      return cell.isOcean && cell.isShelf ? cell.shelfPressure + (1 - Math.abs(cell.depth)) * 0.3 : -Infinity;
    case "slope-drop":
      return cell.isOcean && cell.isShelf ? cell.slopePressure + Math.abs(cell.depth) * 0.2 : -Infinity;
    case "abyssal-plain":
      return cell.isOcean ? Math.abs(cell.depth) + (cell.isOpenOcean ? 0.7 : 0) : -Infinity;
    case "trench":
      return cell.isOcean ? cell.fracturePressure + Math.abs(cell.depth) + (cell.protectedOceanCorridor ? 0.5 : 0) : -Infinity;
    case "mid-ocean-ridge":
      return cell.isOcean ? cell.fracturePressure + cell.ridgePressure + (cell.isOpenOcean ? 0.2 : 0) : -Infinity;
    case "seamount-chain":
      return cell.isOcean ? deterministicNoise(cell, 8) + Math.abs(cell.depth) * 0.5 : -Infinity;
    case "fracture-zone":
      return cell.isOcean ? cell.fracturePressure + cell.slopePressure * 0.3 : -Infinity;
    case "seaway-corridor":
      return cell.isOcean ? (cell.seawayEligible ? 1 : 0) + cell.protectedSeawayPressure + cell.fracturePressure * 0.25 : -Infinity;
    case "basin-mouth":
      return cell.isOcean ? (cell.basinMouthEligible ? 1 : 0) + cell.shelfPressure + cell.fracturePressure * 0.2 : -Infinity;
    default:
      return -Infinity;
  }
}

function allocateForcedAspects(baseCells) {
  const forced = new Map();
  const used = new Set();

  const rareFirstOrder = Object.freeze([
    "glacial-terrain-seat",
    "polar-crust-seat",
    "master-summit",
    "mountain-spine",
    "secondary-peak",
    "fault-ridge",
    "canyon",
    "basin",
    "valley-corridor",
    "plateau",
    "escarpment",
    "cliff-edge",
    "coast-edge",
    "coastal-shelf",
    "beach-slope",
    "highland",
    "lowland",
    "land-body-anchor",
    "island-fragment",
    "archipelago-seat",
    "trench",
    "mid-ocean-ridge",
    "seamount-chain",
    "fracture-zone",
    "seaway-corridor",
    "basin-mouth",
    "continental-shelf",
    "slope-drop",
    "abyssal-plain"
  ]);

  for (const aspect of rareFirstOrder) {
    const wantsLand = isLandAspect(aspect);

    let candidates = baseCells
      .filter((cell) => !used.has(cell.key))
      .filter((cell) => (wantsLand ? cell.isLand : cell.isOcean))
      .map((cell) => ({
        cell,
        score: scoreCandidate(cell, aspect)
      }))
      .filter((entry) => Number.isFinite(entry.score))
      .sort((a, b) => b.score - a.score || a.cell.index - b.cell.index);

    if (!candidates.length) {
      candidates = baseCells
        .filter((cell) => !used.has(cell.key))
        .filter((cell) => (wantsLand ? cell.isLand : cell.isOcean))
        .map((cell) => ({
          cell,
          score: wantsLand ? cell.landScore + cell.elevation : Math.abs(cell.depth) + cell.fracturePressure
        }))
        .sort((a, b) => b.score - a.score || a.cell.index - b.cell.index);
    }

    if (!candidates.length) continue;

    const selected = candidates[0].cell;
    forced.set(selected.key, aspect);
    used.add(selected.key);
  }

  return forced;
}

function terrainCellFromBase(cell, forcedAspectMap) {
  const forcedAspect = forcedAspectMap.get(cell.key) || null;
  const terrainAspect = forcedAspect || defaultAspect(cell);

  return Object.freeze({
    ...cell,
    terrainAspect,
    forcedDisposition: Boolean(forcedAspect),
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
              return bWeight - aWeight || a.index - b.index;
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

  return Object.freeze(
    Object.fromEntries(
      Object.entries(byBody).map(([bodyId, bodyCells]) => {
        const sorted = bodyCells
          .slice()
          .sort((a, b) => b.summitPressure - a.summitPressure || b.elevation - a.elevation || a.index - b.index);

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
    )
  );
}

function createDispositionaryLocations(cells) {
  const aspectIndex = indexByAspect(cells);
  const masterSummits = selectMasterSummits(cells);

  const dispositions = {
    allAspects: {},
    masterSummits,
    landBodySeats: {},
    oceanFloorSeats: {},
    forcedAspectSeats: {},
    terrainCompletion: {
      everyCellAssignedTerrain: cells.every((cell) => Boolean(cell.terrainAspect)),
      aspectCatalogCount: TERRAIN_ASPECTS.length,
      populatedAspectCount: Object.values(aspectIndex).filter((aspectCells) => aspectCells.length > 0).length,
      missingAspects: TERRAIN_ASPECTS.filter((aspect) => !aspectIndex[aspect] || aspectIndex[aspect].length === 0),
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
        forcedDisposition: cell.forcedDisposition,
        elevation: cell.elevation,
        depth: cell.depth,
        relief: cell.relief,
        summitPressure: cell.summitPressure,
        plateauPressure: cell.plateauPressure,
        escarpmentPressure: cell.escarpmentPressure,
        valleyPressure: cell.valleyPressure,
        bodyId: cell.bodyId,
        bodyLabel: cell.bodyLabel
      }))
    );
  }

  for (const cell of cells) {
    if (cell.forcedDisposition) {
      if (!dispositions.forcedAspectSeats[cell.terrainAspect]) dispositions.forcedAspectSeats[cell.terrainAspect] = [];
      dispositions.forcedAspectSeats[cell.terrainAspect].push(cell);
    }

    if (cell.isLand && cell.bodyId) {
      if (!dispositions.landBodySeats[cell.bodyId]) dispositions.landBodySeats[cell.bodyId] = [];
      dispositions.landBodySeats[cell.bodyId].push(cell);
    }

    if (cell.isOcean) {
      if (!dispositions.oceanFloorSeats[cell.terrainAspect]) dispositions.oceanFloorSeats[cell.terrainAspect] = [];
      dispositions.oceanFloorSeats[cell.terrainAspect].push(cell);
    }
  }

  dispositions.forcedAspectSeats = Object.freeze(
    Object.fromEntries(
      Object.entries(dispositions.forcedAspectSeats).map(([aspect, aspectCells]) => [
        aspect,
        Object.freeze(aspectCells.map((cell) => cell.key))
      ])
    )
  );

  dispositions.landBodySeats = Object.freeze(
    Object.fromEntries(
      Object.entries(dispositions.landBodySeats).map(([bodyId, bodyCells]) => [
        bodyId,
        Object.freeze(
          bodyCells
            .slice()
            .sort((a, b) => b.relief - a.relief || a.index - b.index)
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
            .sort((a, b) => b.relief - a.relief || a.index - b.index)
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

  dispositions.terrainCompletion.missingAspects = Object.freeze(dispositions.terrainCompletion.missingAspects);
  dispositions.terrainCompletion = Object.freeze(dispositions.terrainCompletion);

  return Object.freeze(dispositions);
}

function summarizeTerrain(cells, dispositions) {
  const land = cells.filter((cell) => cell.isLand);
  const ocean = cells.filter((cell) => cell.isOcean);
  const high = land.filter((cell) => cell.elevation >= 0.62);
  const low = land.filter((cell) => cell.elevation < 0.34);
  const deep = ocean.filter((cell) => cell.depth <= -0.62);
  const shelf = ocean.filter((cell) => cell.terrainAspect === "continental-shelf" || cell.terrainAspect === "slope-drop");
  const forced = cells.filter((cell) => cell.forcedDisposition);

  return Object.freeze({
    totalCells: cells.length,
    landTerrainCells: land.length,
    oceanFloorTerrainCells: ocean.length,
    highTerrainCells: high.length,
    lowTerrainCells: low.length,
    deepOceanFloorCells: deep.length,
    shelfOrSlopeCells: shelf.length,
    forcedDispositionCells: forced.length,
    terrainAspectCount: TERRAIN_ASPECTS.length,
    populatedTerrainAspectCount: dispositions.terrainCompletion.populatedAspectCount,
    missingTerrainAspects: dispositions.terrainCompletion.missingAspects,
    everyCellAssignedTerrain: dispositions.terrainCompletion.everyCellAssignedTerrain,
    fullAspectDisposition: dispositions.terrainCompletion.populatedAspectCount === TERRAIN_ASPECTS.length,
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

  const baseCells = landmap.cells.map(makeBaseCell);
  const forcedAspectMap = allocateForcedAspects(baseCells);
  const cells = Object.freeze(baseCells.map((cell) => terrainCellFromBase(cell, forcedAspectMap)));
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
    landTerrainAspects: LAND_TERRAIN_ASPECTS,
    oceanTerrainAspects: OCEAN_TERRAIN_ASPECTS,
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
        fullAspectDisposition: summary.fullAspectDisposition,
        missingTerrainAspects: summary.missingTerrainAspects,
        forcedDispositionCells: summary.forcedDispositionCells,
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
      return terrain.receipts.terrain;
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
  LAND_TERRAIN_ASPECTS,
  OCEAN_TERRAIN_ASPECTS,
  BODY_TERRAIN_RULES
};

export default createHEarthTerrain;
