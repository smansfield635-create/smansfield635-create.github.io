// /showroom/globe/h-earth/region-lattice.js
// COMPLETE NEW FILE
// H_EARTH_REGION_LATTICE_FILE_BIRTH_STEP_002_NEUTRAL_256_CELL_SUBDIVISION_v1
//
// Consumes:
// /showroom/globe/h-earth/region-space.js
// H_EARTH_REGION_SPACE_FILE_BIRTH_STEP_001_COORDINATE_CONSTITUTION_v1
//
// Purpose:
// Divides the existing H-Earth region-space X/Z coordinate field into a
// neutral 16 x 16 lattice containing 256 addressable cell records.
//
// This file creates neutral spatial subdivision only.
//
// It does not create:
// - an independent coordinate system
// - rendering
// - camera behavior
// - travel behavior
// - streaming behavior
// - loading behavior
// - visibility behavior
// - NEWS classification
// - Fibonacci bands or synchronization
// - Nine Summit anchors
// - terrain
// - water
// - shoreline geometry
// - rocks, puddles, foam, manor, or detail geometry
// - diagnostics
// - production claim
// - validation claim
// - visual-pass claim
//
// Ownership:
// region-lattice.js owns:
// - 16 x 16 neutral subdivision
// - 256 stable cell records
// - cell IDs
// - lattice X/Z indexes
// - cell world bounds
// - cell center coordinates
// - coordinate-to-cell lookup
// - cell-ID lookup
// - optional structural adjacency
//
// region-lattice.js does not own:
// - axis law
// - origin
// - region bounds
// - world-unit scale
// - coordinate validation law
//
// Those remain owned by region-space.js.

import {
  H_EARTH_REGION_SPACE_CONTRACT_ID,
  H_EARTH_REGION_SPACE,
  getRegionBounds,
  normalizeCoordinateInput,
  isCoordinateInsideRegion
} from './region-space.js';

export const H_EARTH_REGION_LATTICE_CONTRACT_ID =
  'H_EARTH_REGION_LATTICE_FILE_BIRTH_STEP_002_NEUTRAL_256_CELL_SUBDIVISION_v1';

export const H_EARTH_REGION_LATTICE_DIMENSIONS = Object.freeze({
  columnsX: 16,
  rowsZ: 16,
  totalCells: 256,

  cellWidthX: 32,
  cellDepthZ: 32,

  latticeXMin: 0,
  latticeXMax: 15,
  latticeZMin: 0,
  latticeZMax: 15,

  createsCells: true,
  createsGeometry: false,
  createsRendererState: false,
  createsTravelState: false,
  createsLoadingState: false,
  createsNewsClassification: false,
  createsFibonacciAssignment: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_REGION_LATTICE_STATUS = Object.freeze({
  path: 'PATH_3_COORDINATE_GOVERNED_IMMERSIVE_REGION',
  buildStage: 'NEUTRAL_REGION_LATTICE_ONLY',
  implementationClass: 'NEUTRAL_256_CELL_COORDINATE_SUBDIVISION',

  productionClaim: false,
  validationClaim: false,
  visualPassClaim: false,
  rendererClaim: false,
  travelClaim: false,
  streamingClaim: false,
  loadingClaim: false,
  visibilityClaim: false,
  newsClaim: false,
  fibonacciClaim: false,
  nineSummitClaim: false,
  detailGeometryClaim: false,

  claimBoundaryPreserved: true
});

export const H_EARTH_REGION_LATTICE_OWNERSHIP = Object.freeze({
  consumesRegionSpace: true,
  dividesExistingCoordinateSpace: true,
  createsNeutralCellRecords: true,
  createsStableCellIds: true,
  createsCellWorldBounds: true,
  createsCellCenters: true,
  providesCoordinateLookup: true,
  providesCellIdLookup: true,
  providesStructuralAdjacency: true,

  inventsCoordinateSystem: false,
  redefinesAxes: false,
  redefinesOrigin: false,
  redefinesWorldBounds: false,
  redefinesWorldUnitScale: false,
  redefinesCoordinateValidation: false,

  createsRenderer: false,
  createsCamera: false,
  createsTravelController: false,
  createsRuntimeStreaming: false,
  createsLoadingPriority: false,
  createsVisibilityPipeline: false,
  createsNewsClassification: false,
  createsFibonacciBands: false,
  createsFibonacciSynchronization: false,
  createsNineSummitAnchors: false,
  createsTerrain: false,
  createsDetailGeometry: false,
  createsDiagnostics: false,

  claimBoundaryPreserved: true
});

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function padLatticeIndex(value) {
  return String(value).padStart(2, '0');
}

export function isHEarthLatticeIndexValid(latticeX, latticeZ) {
  return (
    Number.isInteger(latticeX) &&
    Number.isInteger(latticeZ) &&
    latticeX >= H_EARTH_REGION_LATTICE_DIMENSIONS.latticeXMin &&
    latticeX <= H_EARTH_REGION_LATTICE_DIMENSIONS.latticeXMax &&
    latticeZ >= H_EARTH_REGION_LATTICE_DIMENSIONS.latticeZMin &&
    latticeZ <= H_EARTH_REGION_LATTICE_DIMENSIONS.latticeZMax
  );
}

export function createHEarthRegionCellId(latticeX, latticeZ) {
  if (!isHEarthLatticeIndexValid(latticeX, latticeZ)) {
    return null;
  }

  return (
    `H_EARTH_REGION_CELL_` +
    `X${padLatticeIndex(latticeX)}_` +
    `Z${padLatticeIndex(latticeZ)}`
  );
}

export function getHEarthCellWorldBounds(latticeX, latticeZ) {
  if (!isHEarthLatticeIndexValid(latticeX, latticeZ)) {
    return null;
  }

  const regionBounds = getRegionBounds();

  const minX =
    regionBounds.x.min +
    latticeX * H_EARTH_REGION_LATTICE_DIMENSIONS.cellWidthX;

  const maxX =
    minX + H_EARTH_REGION_LATTICE_DIMENSIONS.cellWidthX;

  const minZ =
    regionBounds.z.min +
    latticeZ * H_EARTH_REGION_LATTICE_DIMENSIONS.cellDepthZ;

  const maxZ =
    minZ + H_EARTH_REGION_LATTICE_DIMENSIONS.cellDepthZ;

  return Object.freeze({
    x: Object.freeze({
      min: minX,
      max: maxX,
      span: H_EARTH_REGION_LATTICE_DIMENSIONS.cellWidthX
    }),

    y: Object.freeze({
      min: regionBounds.y.min,
      max: regionBounds.y.max,
      span: regionBounds.y.span,
      surfaceBaseline: regionBounds.y.surfaceBaseline
    }),

    z: Object.freeze({
      min: minZ,
      max: maxZ,
      span: H_EARTH_REGION_LATTICE_DIMENSIONS.cellDepthZ
    }),

    lowerInclusive: true,
    upperExclusiveForLookup: true,
    terminalRegionMaximumInclusive: true,

    claimBoundaryPreserved: true
  });
}

export function getHEarthCellCenter(latticeX, latticeZ) {
  const worldBounds = getHEarthCellWorldBounds(latticeX, latticeZ);

  if (!worldBounds) {
    return null;
  }

  return Object.freeze({
    x: worldBounds.x.min + worldBounds.x.span / 2,
    y: H_EARTH_REGION_SPACE.origin.y,
    z: worldBounds.z.min + worldBounds.z.span / 2,

    surfaceBaselineY: H_EARTH_REGION_SPACE.bounds.y.surfaceBaseline,
    centerIsCoordinateReferenceOnly: true,

    claimBoundaryPreserved: true
  });
}

export function createHEarthRegionCellRecord(latticeX, latticeZ) {
  if (!isHEarthLatticeIndexValid(latticeX, latticeZ)) {
    return null;
  }

  const cellId = createHEarthRegionCellId(latticeX, latticeZ);
  const worldBounds = getHEarthCellWorldBounds(latticeX, latticeZ);
  const center = getHEarthCellCenter(latticeX, latticeZ);

  return Object.freeze({
    cellId,

    latticeX,
    latticeZ,

    linearIndex:
      latticeZ * H_EARTH_REGION_LATTICE_DIMENSIONS.columnsX + latticeX,

    worldBounds,
    center,

    coordinateSpaceContractId: H_EARTH_REGION_SPACE_CONTRACT_ID,
    latticeContractId: H_EARTH_REGION_LATTICE_CONTRACT_ID,

    neutralCellRecord: true,
    addressable: true,

    newsClassificationAssigned: false,
    fibonacciBandAssigned: false,
    fibonacciSynchronizationAssigned: false,
    summitAnchorAssigned: false,

    travelPermissionAssigned: false,
    loadingStateAssigned: false,
    streamingStateAssigned: false,
    visibilityStateAssigned: false,

    geometryAssigned: false,
    terrainAssigned: false,
    waterAssigned: false,
    shorelineAssigned: false,
    detailAuthorityAssigned: false,

    rendererClaim: false,
    travelClaim: false,
    streamingClaim: false,
    loadingClaim: false,
    visibilityClaim: false,
    newsClaim: false,
    fibonacciClaim: false,
    nineSummitClaim: false,
    detailGeometryClaim: false,
    validationClaim: false,
    productionClaim: false,

    claimBoundaryPreserved: true
  });
}

export function buildHEarthRegionLatticeCells() {
  const cells = [];

  for (
    let latticeZ = H_EARTH_REGION_LATTICE_DIMENSIONS.latticeZMin;
    latticeZ <= H_EARTH_REGION_LATTICE_DIMENSIONS.latticeZMax;
    latticeZ += 1
  ) {
    for (
      let latticeX = H_EARTH_REGION_LATTICE_DIMENSIONS.latticeXMin;
      latticeX <= H_EARTH_REGION_LATTICE_DIMENSIONS.latticeXMax;
      latticeX += 1
    ) {
      cells.push(createHEarthRegionCellRecord(latticeX, latticeZ));
    }
  }

  return Object.freeze(cells);
}

export const H_EARTH_REGION_LATTICE_CELLS =
  buildHEarthRegionLatticeCells();

export function buildHEarthRegionLatticeCellsById(
  cells = H_EARTH_REGION_LATTICE_CELLS
) {
  const records = {};

  (Array.isArray(cells) ? cells : []).forEach((cell) => {
    if (!cell?.cellId) {
      return;
    }

    records[cell.cellId] = cell;
  });

  return Object.freeze(records);
}

export const H_EARTH_REGION_LATTICE_CELLS_BY_ID =
  buildHEarthRegionLatticeCellsById();

export function getHEarthRegionLatticeCells() {
  return H_EARTH_REGION_LATTICE_CELLS;
}

export function getHEarthRegionLatticeCellsById() {
  return H_EARTH_REGION_LATTICE_CELLS_BY_ID;
}

export function getHEarthRegionCellById(cellId) {
  const normalizedCellId = String(cellId || '').trim();

  if (!normalizedCellId) {
    return null;
  }

  return H_EARTH_REGION_LATTICE_CELLS_BY_ID[normalizedCellId] || null;
}

export function getHEarthRegionCellByLatticeIndex(latticeX, latticeZ) {
  if (!isHEarthLatticeIndexValid(latticeX, latticeZ)) {
    return null;
  }

  return getHEarthRegionCellById(
    createHEarthRegionCellId(latticeX, latticeZ)
  );
}

export function resolveHEarthLatticeIndexFromAxisValue(
  axisName,
  axisValue
) {
  const normalizedAxisName = String(axisName || '').toLowerCase();
  const numericAxisValue = Number(axisValue);

  if (!isFiniteNumber(numericAxisValue)) {
    return null;
  }

  const regionBounds = H_EARTH_REGION_SPACE.bounds;

  if (normalizedAxisName === 'x') {
    if (
      numericAxisValue < regionBounds.x.min ||
      numericAxisValue > regionBounds.x.max
    ) {
      return null;
    }

    if (numericAxisValue === regionBounds.x.max) {
      return H_EARTH_REGION_LATTICE_DIMENSIONS.latticeXMax;
    }

    return Math.floor(
      (numericAxisValue - regionBounds.x.min) /
        H_EARTH_REGION_LATTICE_DIMENSIONS.cellWidthX
    );
  }

  if (normalizedAxisName === 'z') {
    if (
      numericAxisValue < regionBounds.z.min ||
      numericAxisValue > regionBounds.z.max
    ) {
      return null;
    }

    if (numericAxisValue === regionBounds.z.max) {
      return H_EARTH_REGION_LATTICE_DIMENSIONS.latticeZMax;
    }

    return Math.floor(
      (numericAxisValue - regionBounds.z.min) /
        H_EARTH_REGION_LATTICE_DIMENSIONS.cellDepthZ
    );
  }

  return null;
}

export function resolveHEarthLatticeIndexesFromCoordinate(coordinate) {
  const point = normalizeCoordinateInput(coordinate);

  if (!point || isCoordinateInsideRegion(point) !== true) {
    return null;
  }

  const latticeX = resolveHEarthLatticeIndexFromAxisValue('x', point.x);
  const latticeZ = resolveHEarthLatticeIndexFromAxisValue('z', point.z);

  if (!isHEarthLatticeIndexValid(latticeX, latticeZ)) {
    return null;
  }

  return Object.freeze({
    latticeX,
    latticeZ,
    cellId: createHEarthRegionCellId(latticeX, latticeZ),

    coordinateAccepted: true,
    coordinateSpaceContractId: H_EARTH_REGION_SPACE_CONTRACT_ID,
    latticeContractId: H_EARTH_REGION_LATTICE_CONTRACT_ID,

    claimBoundaryPreserved: true
  });
}

export function getHEarthRegionCellAtCoordinate(coordinate) {
  const latticeIndexes =
    resolveHEarthLatticeIndexesFromCoordinate(coordinate);

  if (!latticeIndexes) {
    return null;
  }

  return getHEarthRegionCellById(latticeIndexes.cellId);
}

export function isHEarthCoordinateInsideCell(
  coordinate,
  cellOrCellId
) {
  const point = normalizeCoordinateInput(coordinate);

  if (!point || isCoordinateInsideRegion(point) !== true) {
    return false;
  }

  const cell =
    typeof cellOrCellId === 'string'
      ? getHEarthRegionCellById(cellOrCellId)
      : cellOrCellId;

  if (!cell?.worldBounds) {
    return false;
  }

  const regionBounds = H_EARTH_REGION_SPACE.bounds;

  const isTerminalXCell =
    cell.latticeX === H_EARTH_REGION_LATTICE_DIMENSIONS.latticeXMax;

  const isTerminalZCell =
    cell.latticeZ === H_EARTH_REGION_LATTICE_DIMENSIONS.latticeZMax;

  const xInside =
    point.x >= cell.worldBounds.x.min &&
    (
      point.x < cell.worldBounds.x.max ||
      (
        isTerminalXCell &&
        point.x === regionBounds.x.max
      )
    );

  const yInside =
    point.y >= cell.worldBounds.y.min &&
    point.y <= cell.worldBounds.y.max;

  const zInside =
    point.z >= cell.worldBounds.z.min &&
    (
      point.z < cell.worldBounds.z.max ||
      (
        isTerminalZCell &&
        point.z === regionBounds.z.max
      )
    );

  return xInside && yInside && zInside;
}

export function getHEarthRegionCellStructuralAdjacency(cellOrCellId) {
  const cell =
    typeof cellOrCellId === 'string'
      ? getHEarthRegionCellById(cellOrCellId)
      : cellOrCellId;

  if (
    !cell ||
    !isHEarthLatticeIndexValid(cell.latticeX, cell.latticeZ)
  ) {
    return null;
  }

  const negativeXCell = getHEarthRegionCellByLatticeIndex(
    cell.latticeX - 1,
    cell.latticeZ
  );

  const positiveXCell = getHEarthRegionCellByLatticeIndex(
    cell.latticeX + 1,
    cell.latticeZ
  );

  const negativeZCell = getHEarthRegionCellByLatticeIndex(
    cell.latticeX,
    cell.latticeZ - 1
  );

  const positiveZCell = getHEarthRegionCellByLatticeIndex(
    cell.latticeX,
    cell.latticeZ + 1
  );

  return Object.freeze({
    cellId: cell.cellId,

    negativeXCellId: negativeXCell?.cellId || null,
    positiveXCellId: positiveXCell?.cellId || null,
    negativeZCellId: negativeZCell?.cellId || null,
    positiveZCellId: positiveZCell?.cellId || null,

    adjacentCellIds: Object.freeze(
      [
        negativeXCell,
        positiveXCell,
        negativeZCell,
        positiveZCell
      ]
        .filter(Boolean)
        .map((adjacentCell) => adjacentCell.cellId)
    ),

    structuralAdjacencyOnly: true,
    travelPermissionClaim: false,
    transitionPermissionClaim: false,
    loadingClaim: false,
    streamingClaim: false,
    newsClassificationClaim: false,

    claimBoundaryPreserved: true
  });
}

export const H_EARTH_REGION_LATTICE = Object.freeze({
  contractId: H_EARTH_REGION_LATTICE_CONTRACT_ID,

  consumedRegionSpaceContractId:
    H_EARTH_REGION_SPACE_CONTRACT_ID,

  status: H_EARTH_REGION_LATTICE_STATUS,
  dimensions: H_EARTH_REGION_LATTICE_DIMENSIONS,
  ownership: H_EARTH_REGION_LATTICE_OWNERSHIP,

  cells: H_EARTH_REGION_LATTICE_CELLS,
  cellsById: H_EARTH_REGION_LATTICE_CELLS_BY_ID,

  cellCount: H_EARTH_REGION_LATTICE_CELLS.length,

  neutralSubdivisionOnly: true,

  createsRenderer: false,
  createsCamera: false,
  createsTravelController: false,
  createsRuntimeStreaming: false,
  createsLoadingPriority: false,
  createsVisibilityPipeline: false,
  createsNewsClassification: false,
  createsFibonacciBands: false,
  createsFibonacciSynchronization: false,
  createsNineSummitAnchors: false,
  createsTerrain: false,
  createsDetailGeometry: false,
  createsDiagnostics: false,

  validationClaim: false,
  productionClaim: false,
  visualPassClaim: false,

  claimBoundaryPreserved: true
});

export function getHEarthRegionLatticeContract() {
  return H_EARTH_REGION_LATTICE;
}

export function getHEarthRegionLatticeReceipt() {
  return Object.freeze({
    receiptId:
      'H_EARTH_REGION_LATTICE_RECEIPT_STEP_002_NEUTRAL_256_CELL_SUBDIVISION_v1',

    contractId: H_EARTH_REGION_LATTICE_CONTRACT_ID,
    consumedRegionSpaceContractId:
      H_EARTH_REGION_SPACE_CONTRACT_ID,

    status: 'NEUTRAL_REGION_LATTICE_DEFINED',

    dividesExistingCoordinateSpace: true,
    inventsCoordinateSpace: false,

    columnsX: H_EARTH_REGION_LATTICE_DIMENSIONS.columnsX,
    rowsZ: H_EARTH_REGION_LATTICE_DIMENSIONS.rowsZ,

    expectedCellCount:
      H_EARTH_REGION_LATTICE_DIMENSIONS.totalCells,

    actualCellCount:
      H_EARTH_REGION_LATTICE_CELLS.length,

    cellWidthX:
      H_EARTH_REGION_LATTICE_DIMENSIONS.cellWidthX,

    cellDepthZ:
      H_EARTH_REGION_LATTICE_DIMENSIONS.cellDepthZ,

    cellCountMatchesExpected:
      H_EARTH_REGION_LATTICE_CELLS.length ===
      H_EARTH_REGION_LATTICE_DIMENSIONS.totalCells,

    coordinateLookupDefined:
      typeof getHEarthRegionCellAtCoordinate === 'function',

    cellIdLookupDefined:
      typeof getHEarthRegionCellById === 'function',

    structuralAdjacencyDefined:
      typeof getHEarthRegionCellStructuralAdjacency === 'function',

    invalidIndexesRejectedByCellIdFactory:
      createHEarthRegionCellId(99, 99) === null,

    structuralAdjacencyUsesAxisLanguage: true,

    createsRenderer: false,
    createsCamera: false,
    createsTravel: false,
    createsStreaming: false,
    createsLoadingPriority: false,
    createsVisibilityPipeline: false,
    createsNews: false,
    createsFibonacci: false,
    createsNineSummits: false,
    createsDetails: false,
    createsDiagnostics: false,

    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,

    claimBoundaryPreserved: true
  });
}

export default H_EARTH_REGION_LATTICE;
