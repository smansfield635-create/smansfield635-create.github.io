#!/usr/bin/env node
import { address, canonical, fail, hashObject, within } from './lib.v1.mjs';

export function buildSyntheticCells(world) {
  const cells = [];
  for (let row = 0; row < world.latticeRows; row += 1) {
    for (let column = 0; column < world.latticeColumns; column += 1) {
      const minX = world.originX + column * world.cellSize;
      const minZ = world.originZ + row * world.cellSize;
      const wave = Math.sin((row + 1) * 0.61) + Math.cos((column + 1) * 0.47);
      const ridge = Math.sin((row + column + 2) * 0.33);
      const featureClass = wave > 1.05 ? 'MOUNTAIN_MASS' : wave > 0.35 ? 'HILL' : ridge < -0.65 ? 'VALLEY' : ridge > 0.72 ? 'RIDGE' : ((row + column) % 7 === 0 ? 'SADDLE' : 'BASIN');
      cells.push({
        address: address(row, column), row, column,
        bounds: { minX, maxX: minX + world.cellSize, minZ, maxZ: minZ + world.cellSize },
        continuousFieldId: world.continuousFieldId,
        featureClass,
        baselineSlopeDeg: Number((4 + Math.abs(wave) * 8 + Math.abs(ridge) * 5).toFixed(3)),
        baselineNormalVarianceDeg: Number((2 + Math.abs(ridge) * 4).toFixed(3)),
        traversable: featureClass !== 'MOUNTAIN_MASS' || (row + column) % 3 !== 0
      });
    }
  }
  return cells;
}

export function runTerrainCensus({ world, cells }) {
  if (world.width !== 512 || world.depth !== 512 || world.latticeRows !== 16 || world.latticeColumns !== 16 || world.cellSize !== 32) fail('WORLD_DIMENSION_MISMATCH');
  if (world.expectedCellCount !== world.latticeRows * world.latticeColumns || cells.length !== world.expectedCellCount) fail('CELL_COUNT_MISMATCH');
  const addresses = new Set();
  const expected = new Set();
  for (let r = 0; r < world.latticeRows; r += 1) for (let c = 0; c < world.latticeColumns; c += 1) expected.add(address(r, c));
  const counts = {};
  for (const cell of cells) {
    if (addresses.has(cell.address)) fail('DUPLICATE_CELL_ADDRESS', cell.address);
    addresses.add(cell.address);
    if (cell.continuousFieldId !== world.continuousFieldId) fail('DISCONNECTED_CONTINUOUS_FIELD', cell.address);
    if (!within(cell.row, 0, world.latticeRows - 1) || !within(cell.column, 0, world.latticeColumns - 1) || cell.address !== address(cell.row, cell.column)) fail('CELL_ADDRESS_SET_MISMATCH', cell.address);
    const minX = world.originX + cell.column * world.cellSize;
    const minZ = world.originZ + cell.row * world.cellSize;
    if (canonical(cell.bounds) !== canonical({ minX, maxX: minX + world.cellSize, minZ, maxZ: minZ + world.cellSize })) fail('CELL_BOUNDS_MISMATCH', cell.address);
    counts[cell.featureClass] = (counts[cell.featureClass] ?? 0) + 1;
  }
  if (addresses.size !== expected.size || [...expected].some(item => !addresses.has(item))) fail('CELL_ADDRESS_SET_MISMATCH');
  const adjacencyEdgeCount = world.latticeRows * (world.latticeColumns - 1) + world.latticeColumns * (world.latticeRows - 1);
  const payload = { world, cells: [...cells].sort((a, b) => a.address.localeCompare(b.address)), classificationCounts: counts, adjacencyEdgeCount };
  return { schema: 'MAP_WIDE_TERRAIN_CENSUS_v1', ...payload, censusDigest: hashObject(payload) };
}
