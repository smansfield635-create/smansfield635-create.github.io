// /assets/h-earth/h-earth.lattice256.js
// H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1
// Full-file replacement.
// 256 lattice parent-coordinate authority only.
//
// Owns:
// - 1→4→1 traversal
// - 1→16→1 traversal
// - 1→256→1 traversal
// - A→Z intermittent traversal fields
// - coordinate seats
// - state receipts
// - cell identity
//
// Does not own:
// - land/water truth
// - terrain height
// - surface color
// - canvas paint
// - runtime motion

const CONTRACT = "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1";
const REQUIRED_PARENT = "kernel";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const TERRAIN_ONLY_CHAIN = "H_EARTH_G1_COMPLETE_TERRAIN_ONLY_PARENT_CHAIN_TNT_v1";
const VERSION = "2026-05-10.h-earth.g1.terrain-only.lattice256";

const SIZE = 16;
const TOTAL = SIZE * SIZE;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function round(value, places = 6) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function cardinalFromLonLat(lon, lat) {
  const ns = lat >= 0 ? "north" : "south";
  const ew = lon >= 0 ? "east" : "west";

  if (Math.abs(lat) > Math.abs(lon) / 2) return ns;
  if (Math.abs(lon) > Math.abs(lat) * 2) return ew;

  return `${ns}-${ew}`;
}

function quadrantFromRowCol(row, col) {
  if (row < 8 && col < 8) return "north-west";
  if (row < 8 && col >= 8) return "north-east";
  if (row >= 8 && col < 8) return "south-west";
  return "south-east";
}

function ringFromRowCol(row, col) {
  const distanceToEdge = Math.min(row, col, SIZE - 1 - row, SIZE - 1 - col);
  if (distanceToEdge <= 1) return "outer-ring";
  if (distanceToEdge <= 3) return "middle-ring";
  if (distanceToEdge <= 5) return "inner-ring";
  return "core-ring";
}

function createCell(row, col) {
  const index = row * SIZE + col;
  const u = (col + 0.5) / SIZE;
  const v = (row + 0.5) / SIZE;
  const lon = -180 + u * 360;
  const lat = 90 - v * 180;
  const x = u * 2 - 1;
  const y = 1 - v * 2;

  const theta = Math.atan2(y, x);
  const radius = Math.sqrt(x * x + y * y);
  const normalizedRadius = clamp01(radius / Math.SQRT2);

  const letter = LETTERS[index % LETTERS.length];
  const letterPass = Math.floor(index / LETTERS.length) + 1;

  return Object.freeze({
    id: `HE-${String(index + 1).padStart(3, "0")}`,
    index,
    row,
    col,
    seat: index + 1,
    key: `${row}:${col}`,
    u: round(u),
    v: round(v),
    x: round(x),
    y: round(y),
    lon: round(lon, 3),
    lat: round(lat, 3),
    theta: round(theta),
    radius: round(radius),
    normalizedRadius: round(normalizedRadius),
    quadrant: quadrantFromRowCol(row, col),
    cardinal: cardinalFromLonLat(lon, lat),
    ring: ringFromRowCol(row, col),
    letter,
    letterPass,
    azField: `${letter}${letterPass}`,
    scale4Seat: quadrantFromRowCol(row, col),
    scale16Seat: `R${String(row + 1).padStart(2, "0")}`,
    scale256Seat: `S${String(index + 1).padStart(3, "0")}`
  });
}

function createCells() {
  const cells = [];

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      cells.push(createCell(row, col));
    }
  }

  return Object.freeze(cells);
}

function groupBy(cells, key) {
  const grouped = {};

  for (const cell of cells) {
    const groupKey = cell[key];
    if (!grouped[groupKey]) grouped[groupKey] = [];
    grouped[groupKey].push(cell);
  }

  return Object.freeze(
    Object.fromEntries(
      Object.entries(grouped).map(([groupKey, groupCells]) => [
        groupKey,
        Object.freeze(groupCells)
      ])
    )
  );
}

function createScale4Traversal(cells) {
  const grouped = groupBy(cells, "quadrant");

  return Object.freeze({
    name: "1→4→1",
    origin: "H-Earth kernel",
    order: Object.freeze(["north-west", "north-east", "south-east", "south-west", "origin-return"]),
    seats: grouped,
    receipt: "H_EARTH_LATTICE_SCALE_4_RETURN_RECEIPT"
  });
}

function createScale16Traversal(cells) {
  const rows = groupBy(cells, "scale16Seat");

  return Object.freeze({
    name: "1→16→1",
    origin: "H-Earth kernel",
    order: Object.freeze(Object.keys(rows).concat("origin-return")),
    seats: rows,
    receipt: "H_EARTH_LATTICE_SCALE_16_RETURN_RECEIPT"
  });
}

function createScale256Traversal(cells) {
  return Object.freeze({
    name: "1→256→1",
    origin: "H-Earth kernel",
    order: Object.freeze(cells.map((cell) => cell.scale256Seat).concat("origin-return")),
    seats: Object.freeze(
      Object.fromEntries(cells.map((cell) => [cell.scale256Seat, cell]))
    ),
    receipt: "H_EARTH_LATTICE_SCALE_256_RETURN_RECEIPT"
  });
}

function createAZTraversal(cells) {
  const grouped = groupBy(cells, "letter");

  return Object.freeze({
    name: "A→Z intermittent",
    origin: "H-Earth kernel",
    order: Object.freeze(LETTERS),
    seats: grouped,
    receipt: "H_EARTH_LATTICE_A_TO_Z_INTERMITTENT_RECEIPT"
  });
}

function getNeighbors(cells, cell) {
  const byKey = new Map(cells.map((entry) => [entry.key, entry]));
  const offsets = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1]
  ];

  return offsets
    .map(([dr, dc]) => byKey.get(`${cell.row + dr}:${cell.col + dc}`))
    .filter(Boolean);
}

function createNeighborMap(cells) {
  return Object.freeze(
    Object.fromEntries(
      cells.map((cell) => [
        cell.key,
        Object.freeze(getNeighbors(cells, cell).map((neighbor) => neighbor.key))
      ])
    )
  );
}

export function createHEarthLattice256(context = {}) {
  const kernel = context.kernel || context;
  const cells = createCells();
  const cellsByKey = Object.freeze(Object.fromEntries(cells.map((cell) => [cell.key, cell])));
  const cellsById = Object.freeze(Object.fromEntries(cells.map((cell) => [cell.id, cell])));
  const neighborMap = createNeighborMap(cells);

  const lattice = {
    contract: CONTRACT,
    requiredParent: REQUIRED_PARENT,
    seedPacket: SEED_PACKET,
    terrainOnlyChain: TERRAIN_ONLY_CHAIN,
    version: VERSION,
    planet: "H-Earth",
    generation: "G1",
    parentReceipt: kernel?.receipts?.kernel || null,
    owns: [
      "coordinate-seats",
      "cell-identity",
      "scale-4-traversal",
      "scale-16-traversal",
      "scale-256-traversal",
      "a-to-z-intermittent-fields"
    ],
    doesNotOwn: [
      "land-water-truth",
      "terrain-height",
      "surface-color",
      "canvas-paint",
      "motion"
    ],
    size: SIZE,
    total: TOTAL,
    cells,
    cellsByKey,
    cellsById,
    neighborMap,
    scale4: createScale4Traversal(cells),
    scale16: createScale16Traversal(cells),
    scale256: createScale256Traversal(cells),
    azTraversal: createAZTraversal(cells),
    receipts: Object.freeze({
      lattice256: Object.freeze({
        contract: CONTRACT,
        seedPacket: SEED_PACKET,
        scale4: "complete",
        scale16: "complete",
        scale256: "complete",
        azTraversal: "complete",
        cells: TOTAL,
        visualPassClaimed: false
      })
    }),
    getCellByKey(key) {
      return cellsByKey[key] || null;
    },
    getCellById(id) {
      return cellsById[id] || null;
    },
    getNeighbors(cellOrKey) {
      const key = typeof cellOrKey === "string" ? cellOrKey : cellOrKey?.key;
      return (neighborMap[key] || []).map((neighborKey) => cellsByKey[neighborKey]);
    }
  };

  return Object.freeze(lattice);
}

export {
  CONTRACT,
  REQUIRED_PARENT,
  SEED_PACKET,
  TERRAIN_ONLY_CHAIN,
  VERSION,
  SIZE,
  TOTAL
};

export default createHEarthLattice256;
